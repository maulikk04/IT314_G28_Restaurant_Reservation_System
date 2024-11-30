const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dns = require('dns');
const { signup_post, login_post, forgotPassword, resetPassword, confirmEmail, errorHandle } = require('../controllers/userController');
const usermodel = require('../model/usermodel');
const Token = require('../model/tokenmodel');
const { expect } = chai;
const mongoose = require('mongoose'); 

describe('Auth Controller', () => {
    let req, res;
    
    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            send: sinon.stub(),
            setHeader: sinon.stub(),
            redirect: sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore(); // Clean up stubs, mocks, etc. after each test
    });

    describe('signup_post', () => {
        it('should return 409 if user already exists', async () => {
            const req = {
                body: {
                    name: 'TestUser',
                    email: 'testuser@gmail.com',
                    password: '!Password123',
                    confirmPassword: '!Password123',
                    isOwner: false
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            const findOneStub = sinon.stub(usermodel, 'findOne');
            findOneStub.withArgs({ email: 'testuser@gmail.com' }).resolves({ email: 'testuser@gmail.com' });
            findOneStub.resolves(null);
    
            await signup_post(req, res);
    
            expect(res.status.calledWith(409)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'User already exists' })).to.be.true;
            expect(findOneStub.calledWith({ email: 'testuser@gmail.com' })).to.be.true;
        });

        it('should return 400 for an invalid email domain', async () => {
            const req = {
                body: {
                    name: 'TestUser',
                    email: 'invalidemail@test',
                    password: '!Password123',
                    confirmPassword: '!Password123',
                    isOwner: false
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(usermodel, 'findOne').resolves(null);
            sinon.stub(dns, 'resolveMx').callsFake((domain, callback) => {
                setImmediate(() => callback(null, []));
            });

            await signup_post(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Invalid email domain' })).to.be.true;
        });

        it('should return 401 if passwords do not match', async function() {
            this.timeout(5000);

            const req = {
                body: {
                    name: 'TestUser',
                    email: 'testuser@gmail.com',
                    password: '!Password123',
                    confirmPassword: 'WrongPassword123',
                    isOwner: false
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(usermodel, 'findOne').resolves(null);
            
            // Mock DNS resolution
            sinon.stub(require('dns'), 'resolveMx').callsFake((domain, callback) => {
                callback(null, [{exchange: 'test.com', priority: 10}]);
            });

            await signup_post(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Password not matching' })).to.be.true;
        });

        it('should handle error when saving user fails', async () => {
            req = {
                body: {
                    name: 'TestUser',
                    email: 'testuser@gmail.com',
                    password: '!Password123',
                    confirmPassword: '!Password123',
                    isOwner: false
                }
            };
    
            // Mock usermodel.findOne to return null (user doesn't exist)
            sinon.stub(usermodel, 'findOne').resolves(null);
    
            // Mock save to check the user object properties before rejecting
            sinon.stub(usermodel.prototype, 'save').callsFake(function() {
                expect(this.name).to.equal(req.body.name);
                expect(this.email).to.equal(req.body.email);
                expect(this.password).to.exist;
                expect(this.isOwner).to.equal(req.body.isOwner);
                return Promise.reject(new Error('Database error'));
            });
    
            // Mock jwt.sign to verify payload and options
            const jwtSignStub = sinon.stub(jwt, 'sign').callsFake((payload, secret, options) => {
                expect(payload).to.have.property('id').that.is.not.empty;
                expect(options).to.have.property('expiresIn').that.equals('1h');
                return 'mock-token';
            });
    
            sinon.stub(dns, 'resolveMx').callsFake((domain, callback) => {
                if (domain === 'gmail.com') {
                    callback(null, [{exchange: 'test.com', priority: 10}]);
                } else {
                    callback(new Error('Invalid domain'), null);
                }
            });
    
            await signup_post(req, res);
    
            // Verify error response
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ 
                message: sinon.match.string.and(sinon.match.truthy)
            })).to.be.true;
            expect(res.json.lastCall.args[0].message).to.equal('Database error');
        });

        it('should handle error when sending confirmation email fails', async () => {
            req = {
                body: {
                    name: 'TestUser',
                    email: 'testuser@gmail.com',
                    password: '!Password123',
                    confirmPassword: '!Password123',
                    isOwner: false
                }
            };
        
            // Stub necessary dependencies
            sinon.stub(usermodel, 'findOne').resolves(null);
            sinon.stub(dns, 'resolveMx').callsFake((domain, callback) => {
                callback(null, [{exchange: 'test.com', priority: 10}]);
            });
        
            // Stub user save to succeed
            const savedUser = {
                _id: 'testId',
                isOwner: false
            };
            sinon.stub(usermodel.prototype, 'save').resolves(savedUser);
        
            // Stub JWT signing
            sinon.stub(jwt, 'sign').returns('test-token');
        
            // Stub nodemailer to throw an error
            sinon.stub(nodemailer, 'createTransport').throws(new Error('Email send failed'));
        
            // Spy on console.log
            const consoleLogSpy = sinon.spy(console, 'log');
        
            await signup_post(req, res);
        
            // Assertions
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ 
                message: 'User created successfully',
                userId: 'testId',
                owner: false 
            })).to.be.false;
            
            // Check that an error was logged
            expect(consoleLogSpy.calledOnce).to.be.true;
            expect(consoleLogSpy.firstCall.args[0]).to.be.an('error');
        });
    });

    describe('forgotPassword', () => {
        it('should return 401 when owner tries to use customer route', async () => {
            const req = {
                body: {
                    email: 'testuser@gmail.com',
                    userType: 'customer'  // Trying to use customer route
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            // Mock user as an owner
            const user = {
                email: 'testuser@gmail.com',
                isOwner: true,  // User is an owner
                _id: new mongoose.Types.ObjectId(),
                name: 'TestUser'
            };
    
            const findOneStub = sinon.stub(usermodel, 'findOne').resolves(user);
    
            await forgotPassword(req, res);
    
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Unauthorized' })).to.be.true;
            expect(findOneStub.calledWith({ email: req.body.email })).to.be.true;
        });

        it('should return 401 when customer tries to use owner route', async () => {
            const req = {
                body: {
                    email: 'testuser@gmail.com',
                    userType: 'owner'
                }
            };
    
            const user = {
                email: 'testuser@gmail.com',
                isOwner: false,
                _id: new mongoose.Types.ObjectId(),
                name: 'TestUser'
            };
    
            sinon.stub(usermodel, 'findOne').resolves(user);
    
            await forgotPassword(req, res);
    
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Unauthorized' })).to.be.true;
        });

        it('should return 401 for unregistered email', async () => {
            const req = {
                body: {
                    email: 'invaliduser@gmail.com',
                    userType: 'customer'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            sinon.stub(usermodel, 'findOne').resolves(null);

            await forgotPassword(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.send.calledWithMatch({ message: 'Enter valid registered Email Id' })).to.be.true;
        });

        it('should handle error when creating new token', async () => {
            req = {
                body: {
                    email: 'testuser@gmail.com',
                    userType: 'customer'
                }
            };

            const user = {
                email: 'testuser@gmail.com',
                isOwner: false,
                _id: new mongoose.Types.ObjectId(),
                name: 'TestUser'
            };

            sinon.stub(usermodel, 'findOne').resolves(user);
            sinon.stub(Token, 'findOne').resolves(null);
            sinon.stub(Token.prototype, 'save').rejects(new Error('Token save failed'));

            await forgotPassword(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Token save failed' })).to.be.true;
        });

        it('should handle nodemailer transport creation error', async () => {
            req = {
                body: {
                    email: 'testuser@gmail.com',
                    userType: 'customer'
                }
            };

            const user = {
                email: 'testuser@gmail.com',
                isOwner: false,
                _id: new mongoose.Types.ObjectId(),
                name: 'TestUser'
            };

            sinon.stub(usermodel, 'findOne').resolves(user);
            sinon.stub(Token, 'findOne').resolves({
                userid: user._id,
                token: 'existingtoken'
            });
            sinon.stub(nodemailer, 'createTransport').throws(new Error('Transport creation failed'));

            await forgotPassword(req, res);

            expect(res.status.calledWith(401)).to.be.false;
            expect(res.json.calledWithMatch({ message: 'Transport creation failed' })).to.be.false;
        });
    });

    describe('login_post', () => {
        it('should log in the user with valid credentials', async () => {
            const req = {
                body: {
                    email: 'testuser@gmail.com',
                    password: '!Password123',
                    isOwner: false,
                    emailVerified: true
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                setHeader: sinon.stub()
            };

            const user = {
                email: 'testuser@gmail.com',
                password: '$2b$10$1234567890123456789012',
                isOwner: false,
                emailVerified: true,
                _id: '12345'
            };

            const findOneStub = sinon.stub(usermodel, 'findOne').resolves(user);
            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(jwt, 'sign').returns('mockedToken');

            await login_post(req, res);

            expect(findOneStub.calledWith({ email: req.body.email })).to.be.true;

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ 
                message: 'User logged in successfully',
                userId: '12345',
                token: 'mockedToken'
            })).to.be.true;
            expect(res.setHeader.calledWith('Authorization', 'Bearer mockedToken')).to.be.true;
        });

        it('should return 403 for unverified email', async () => {
            const req = {
                body: {
                    email: 'unverified@example.com',
                    password: '!Password123',
                    emailVerified: false,
                    isOwner: false
                }
            };

            const user = {
                email: 'unverified@gmail.com',
                password: '!Password123',
                emailVerified: false,
                isOwner: false,
                _id: '12345'
            };

            sinon.stub(usermodel, 'findOne').resolves(user);

            await login_post(req, res);

            expect(res.status.calledWith(403)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Please verify your email before logging in. Check your inbox for the confirmation link.' })).to.be.true;
        });

        it('should return 401 for invalid email', async () => {
            const req = {
                body: {
                    email: 'invaliduser@example.com',
                    password: '!Password123',
                    isOwner: false
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(usermodel, 'findOne').resolves(null);

            await login_post(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Enter Valid Email' })).to.be.true;
        });

        it('should return 401 for invalid password', async () => {
            const req = {
                body: {
                    email: 'testuser@gmail.com',
                    password: '!WrongPassword123',  // Simulated incorrect password
                    emailVerified: true,
                    isOwner: false
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
        
            const user = {
                email: 'testuser@gmail.com',
                password: '$2b$10$SomeEncryptedPasswordHash', // Simulated encrypted password
                isOwner: false,
                emailVerified: true,
                _id: '12345'
            };
        
            // Mock findOne to return the user
            sinon.stub(usermodel, 'findOne').resolves(user);
        
            // Mock bcrypt.compare to resolve with false (incorrect password)
            sinon.stub(bcrypt, 'compare').resolves(false);
        
            // Call the login_post function
            await login_post(req, res);
        
            // Assertions
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Enter valid password' })).to.be.true;
        });

        it('should return 401 for mismatched user type', async () => {
            req = {
                body: {
                    email: 'testuser@gmail.com',
                    password: '!Password123',
                    isOwner: true
                }
            };

            const user = {
                email: 'testuser@gmail.com',
                password: 'hashedPassword',
                isOwner: false,
                _id: '12345'
            };

            sinon.stub(usermodel, 'findOne').resolves(user);

            await login_post(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Invalid User' })).to.be.true;
        });

        it('should handle database errors during login', async () => {
            req = {
                body: {
                    email: 'testuser@gmail.com',
                    password: '!Password123',
                    isOwner: false
                }
            };

            sinon.stub(usermodel, 'findOne').rejects(new Error('Database error'));

            await login_post(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Database error' })).to.be.true;
        });
    });

    describe('resetPassword', () => {
        it('should reset the password for a valid token', async () => {
            const tokendata = {
                userid: '12345',
                token: 'validtoken',
                deleteOne: sinon.stub().resolves()
            };
            const user = {
                _id: '12345',
                save: sinon.stub().resolves()
            };

            sinon.stub(Token, 'findOne').resolves(tokendata);
            sinon.stub(usermodel, 'findOne').resolves(user);

            const req = {
                params: { token: 'validtoken' },
                body: { password: '!NewPassword123' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                send: sinon.stub()
            };

            await resetPassword(req, res);

            expect(user.save.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWithMatch({ message: 'Password changed successfully' })).to.be.true;
        });

        it('should return 404 for invalid token', async () => {
            const req = {
                params: { token: 'invalidtoken' },
                body: { password: 'NewPassword123' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            sinon.stub(Token, 'findOne').resolves(null);

            await resetPassword(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledWithMatch({ message: 'Invalid Token' })).to.be.true;
        });

        it('should return 401 when no password provided', async () => {
            req = {
                params: { token: 'validtoken' },
                body: {}
            };

            sinon.stub(Token, 'findOne').resolves({
                userid: '12345',
                token: 'validtoken'
            });

            await resetPassword(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.send.calledWithMatch({ message: 'Password is required' })).to.be.true;
        });

        it('should return 400 when user not found', async () => {
            req = {
                params: { token: 'validtoken' },
                body: { password: 'newpassword' }
            };

            sinon.stub(Token, 'findOne').resolves({
                userid: '12345',
                token: 'validtoken'
            });
            sinon.stub(usermodel, 'findOne').resolves(null);

            await resetPassword(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWithMatch({ message: 'Cannot find user' })).to.be.true;
        });

        it('should handle error when saving new password', async () => {
            req = {
                params: { token: 'validtoken' },
                body: { password: 'newpassword' }
            };

            const tokenData = {
                userid: '12345',
                token: 'validtoken',
                deleteOne: sinon.stub().resolves()
            };

            const user = {
                _id: '12345',
                save: sinon.stub().rejects(new Error('Save failed'))
            };

            sinon.stub(Token, 'findOne').resolves(tokenData);
            sinon.stub(usermodel, 'findOne').resolves(user);

            await resetPassword(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Save failed' })).to.be.true;
        });
    });

    describe('confirmEmail', () => {
        it('should redirect to login page for valid token', async () => {
            req = {
                params: { token: 'validtoken' }
            };
        
            const decoded = { _id: 'userid' };
            const user = { _id: 'userid', isOwner: true };
        
            sinon.stub(jwt, 'verify').returns(decoded);
            
            // Create a more sophisticated stub for findByIdAndUpdate
            const findByIdAndUpdateStub = sinon.stub(usermodel, 'findByIdAndUpdate');
            
            // Store the update parameters and options for verification
            let capturedUpdateParams;
            let capturedOptions;
            
            findByIdAndUpdateStub.callsFake((id, updateParams, options) => {
                capturedUpdateParams = updateParams;
                capturedOptions = options;
                
                // Verify that emailVerified is true and sessionToken exists
                expect(updateParams).to.have.property('emailVerified', true);
                expect(updateParams).to.have.property('sessionToken').that.is.a('string');
                
                // Create a user object that includes the updates
                const updatedUser = {
                    ...user,
                    emailVerified: updateParams.emailVerified,
                    sessionToken: updateParams.sessionToken
                };
                
                // If options.new is false, return the original user
                if (options && options.new === false) {
                    return Promise.resolve(user);
                }
                
                // Otherwise return the updated user
                return Promise.resolve(updatedUser);
            });
        
            await confirmEmail(req, res);
        
            // Verify the update parameters
            expect(capturedUpdateParams).to.have.property('emailVerified', true);
            expect(capturedUpdateParams).to.have.property('sessionToken').that.is.a('string');
            expect(Object.keys(capturedUpdateParams).length).to.equal(2); // Ensure no extra fields
        
            // Verify the options
            expect(capturedOptions).to.deep.equal({ new: true, runValidators: false });
            
            // Verify that findByIdAndUpdate was called with correct parameters
            expect(findByIdAndUpdateStub.calledWith(
                decoded._id,
                sinon.match.has('emailVerified', true)
                .and(sinon.match.has('sessionToken', sinon.match.string)),
                { new: true, runValidators: false }
            )).to.be.true;
        
            // Verify the redirect
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.args[0][0]).to.include('/login?type=owner&verified=true');
            
            // Verify that the updated user has the correct properties
            const updatedUser = await findByIdAndUpdateStub.returnValues[0];
            expect(updatedUser.emailVerified).to.be.true;
            expect(updatedUser.sessionToken).to.be.a('string');
        });

        it('should handle invalid token', async () => {
            req = {
                params: { token: 'invalidtoken' }
            };

            sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

            await confirmEmail(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Email confirmation failed' })).to.be.true;
        });

        it('should handle non-existent user', async () => {
            req = {
                params: { token: 'validtoken' }
            };

            const decoded = { _id: 'userid' };
            
            sinon.stub(jwt, 'verify').returns(decoded);
            sinon.stub(usermodel, 'findByIdAndUpdate').resolves(null);

            await confirmEmail(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Invalid token or user does not exist' })).to.be.true;
        });

        it('should redirect customer to customer login page', async () => {
            req = {
                params: { token: 'validtoken' }
            };

            const decoded = { _id: 'userid' };
            const user = { _id: 'userid', isOwner: false };

            sinon.stub(jwt, 'verify').returns(decoded);
            sinon.stub(usermodel, 'findByIdAndUpdate').resolves(user);

            await confirmEmail(req, res);

            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.args[0][0]).to.include('/login?type=customer&verified=true');
        });
    });

    describe('sendresetpasswordmail', () => {
        let sendMailStub;
        let transporterStub;
        let consoleLogSpy;
    
        beforeEach(() => {
            // Create stubs for nodemailer
            sendMailStub = sinon.stub();
            transporterStub = {
                sendMail: sendMailStub
            };
            
            // Spy on console.log before each test
            consoleLogSpy = sinon.spy(console, 'log');
    
            sinon.stub(nodemailer, 'createTransport').callsFake((config) => {
                if (!config.host || config.host === '') {
                    throw new Error('Host is missing or empty');
                }
                if (config.secure !== true) {
                    throw new Error('Secure flag is not true');
                }
                if (config.requireTLS !== true) {
                    throw new Error('requireTLS flag is not true');
                }
                if (!config.auth || !config.auth.user || !config.auth.pass) {
                    throw new Error('Auth configuration is missing or invalid');
                }
                return transporterStub;
            });
        });
    
        afterEach(() => {
            sinon.restore();
            consoleLogSpy.restore();
        });
    
        it('should handle email sending error with proper error check', (done) => {
            const name = 'Test User';
            const email = 'test@example.com';
            const token = 'test-token';
    
            const testError = new Error('Email sending failed');
            
            // Track if error callback was actually triggered
            let errorCallbackTriggered = false;
            
            sendMailStub.callsFake((options, callback) => {
                errorCallbackTriggered = true;
                callback(testError, null);
            });
    
            const { sendresetpasswordmail } = require('../controllers/userController');
    
            sendresetpasswordmail(name, email, token)
                .then(() => {
                    expect(errorCallbackTriggered).to.be.true;
                    expect(sendMailStub.calledOnce).to.be.true;
                    expect(consoleLogSpy.firstCall.args[0]).to.equal(testError);
                    expect(consoleLogSpy.firstCall.args[0]).to.be.instanceof(Error);
                    done();
                })
                .catch(done);
        });
    
        it('should properly log success message with response info', (done) => {
            const name = 'Test User';
            const email = 'test@example.com';
            const token = 'test-token';
            
            const successResponse = { response: 'Success Response' };
            
            sendMailStub.callsFake((options, callback) => {
                callback(null, successResponse);
            });
    
            const { sendresetpasswordmail } = require('../controllers/userController');
    
            sendresetpasswordmail(name, email, token)
                .then(() => {
                    expect(sendMailStub.calledOnce).to.be.true;
                    expect(consoleLogSpy.firstCall.args[0]).to.include('email send successfully');
                    expect(consoleLogSpy.firstCall.args[0]).to.include(successResponse.response);
                    expect(consoleLogSpy.firstCall.args[0].length).to.be.greaterThan(0);
                    done();
                })
                .catch(done);
        });
    
        it('should include correct mail options', (done) => {
            const name = 'Test User';
            const email = 'test@example.com';
            const token = 'test-token';
    
            sendMailStub.callsFake((options, callback) => {
                expect(options.to).to.equal(email);
                expect(options.subject).to.equal('For reset password');
                expect(options.html).to.include(name);
                expect(options.html).to.include(token);
                callback(null, { response: 'Success' });
            });
    
            const { sendresetpasswordmail } = require('../controllers/userController');
    
            sendresetpasswordmail(name, email, token)
                .then(() => {
                    expect(sendMailStub.calledOnce).to.be.true;
                    const mailOptions = sendMailStub.getCall(0).args[0];
                    expect(mailOptions.html).to.include(name);
                    expect(mailOptions.html).to.not.include('{Username}');
                    expect(mailOptions.html).to.not.include('{url}');
                    done();
                })
                .catch(done);
        });

        it('should handle sendMail errors correctly', (done) => {
            nodemailer.createTransport.restore();
            sinon.stub(nodemailer, 'createTransport').returns(transporterStub);
    
            const mailError = new Error('Mail sending failed');
            sendMailStub.callsFake((options, callback) => {
                callback(mailError, null);
            });
    
            const { sendresetpasswordmail } = require('../controllers/userController');
    
            sendresetpasswordmail('Test User', 'test@example.com', 'test-token')
                .then(() => {
                    expect(consoleLogSpy.calledWith(mailError)).to.be.true;
                    done();
                })
                .catch(done);
        });
    });

    describe('sendConfirmationEmail', () => {
        let sendMailStub;
        let transporterStub;
    
        beforeEach(() => {
            // Create stubs for nodemailer
            sendMailStub = sinon.stub();
            transporterStub = {
                sendMail: sendMailStub
            };
            sinon.stub(nodemailer, 'createTransport').callsFake((config) => {
                // Validate host
                if (!config.host || config.host === '') {
                    throw new Error('Host is missing or empty');
                }
        
                // Validate secure
                if (config.secure !== true) {
                    throw new Error('Secure flag is not true');
                }
        
                // Validate auth
                if (!config.auth || !config.auth.user || !config.auth.pass) {
                    throw new Error('Auth configuration is missing or invalid');
                }
        
                return transporterStub;
            });
            
            // Spy on console.log
            consoleLogSpy = sinon.spy(console, 'log');
        });
    
        afterEach(() => {
            sinon.restore();
        });
    
        it('should send email with correct options', async () => {
            const name = 'Test User';
            const email = 'test@example.com';
            const token = 'test-token';
    
            sendMailStub.resolves();
    
            const { sendConfirmationEmail } = require('../controllers/userController');
    
            await sendConfirmationEmail(name, email, token);
    
            // Verify mail options
            const mailOptions = sendMailStub.getCall(0).args[0];
            expect(mailOptions).to.have.property('to', email);
            expect(mailOptions).to.have.property('subject', 'Account Confirmation');
            expect(mailOptions.html).to.include(name);
            expect(mailOptions.html).to.include(token);

            expect(mailOptions.html).to.include(name);
            expect(mailOptions.html).to.not.include('{Username}');
            expect(mailOptions.html).to.not.include('{url}');
        });
    });

    describe('errorHandle', () => {
        it('should return default message when error message is empty', () => {
            const error = new Error('');
            const result = errorHandle(error);
            expect(result).to.equal('An unknown error occurred');
        });
    });
});
