const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt'); // Added explicit import for bcrypt
const nodemailer = require('nodemailer'); // Added explicit import for nodemailer
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
    
            sinon.stub(usermodel, 'findOne').resolves({ email: 'testuser@gmail.com' });
    
            await signup_post(req, res);
    
            expect(res.status.calledWith(409)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'User already exists' })).to.be.true;
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
                // Immediately call the callback with empty result to simulate invalid domain
                setImmediate(() => callback(null, []));
            });

            await signup_post(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Invalid email domain' })).to.be.true;
        });

        it('should return 401 if passwords do not match', async function() {
            this.timeout(5000); // Increase timeout to 5 seconds

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

            sinon.stub(usermodel, 'findOne').resolves(null);
            sinon.stub(usermodel.prototype, 'save').rejects(new Error('Database error'));
            sinon.stub(dns, 'resolveMx').callsFake((domain, callback) => {
                callback(null, [{exchange: 'test.com', priority: 10}]);
            });

            await signup_post(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Database error' })).to.be.true;
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

            sinon.stub(usermodel, 'findOne').resolves(user);
            sinon.stub(bcrypt, 'compare').resolves(true); // Fixed direct bcrypt usage
            sinon.stub(jwt, 'sign').returns('mockedToken');

            await login_post(req, res);

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
                deleteOne: sinon.stub().resolves() // Ensure deleteOne exists
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
            sinon.stub(usermodel, 'findByIdAndUpdate').resolves(user);

            await confirmEmail(req, res);

            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.args[0][0]).to.include('/login?type=owner&verified=true');
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
    
        beforeEach(() => {
            // Create a stub for sendMail that we can control
            sendMailStub = sinon.stub();
            // Create a stub for the transporter
            transporterStub = {
                sendMail: sendMailStub
            };
            // Stub the createTransport method to return our stub transporter
            sinon.stub(nodemailer, 'createTransport').returns(transporterStub);
        });
    
        afterEach(() => {
            sinon.restore();
        });
    
        it('should handle email sending error', (done) => {
            const name = 'Test User';
            const email = 'test@example.com';
            const token = 'test-token';
    
            // Configure sendMail to call its callback with an error
            const testError = new Error('Email sending failed');
            sendMailStub.callsFake((options, callback) => {
                callback(testError, null);
            });
    
            // Spy on console.log
            const consoleLogSpy = sinon.spy(console, 'log');
    
            // We need to import and call the actual sendresetpasswordmail function
            const { sendresetpasswordmail } = require('../controllers/userController');
    
            sendresetpasswordmail(name, email, token)
                .then(() => {
                    // Verify that sendMail was called
                    expect(sendMailStub.calledOnce).to.be.true;
                    
                    // Verify that the error was logged
                    expect(consoleLogSpy.calledWith(testError)).to.be.true;
                    
                    done();
                })
                .catch(done);
        });
    
        it('should include correct mail options', (done) => {
            const name = 'Test User';
            const email = 'test@example.com';
            const token = 'test-token';
    
            // Configure sendMail to capture the options
            sendMailStub.callsFake((options, callback) => {
                // Verify mail options
                expect(options.to).to.equal(email);
                expect(options.subject).to.equal('For reset password');
                expect(options.html).to.include(name); // Verify template includes name
                expect(options.html).to.include(token); // Verify template includes token
                callback(null, { response: 'Success' });
            });
    
            const { sendresetpasswordmail } = require('../controllers/userController');
    
            sendresetpasswordmail(name, email, token)
                .then(() => {
                    expect(sendMailStub.calledOnce).to.be.true;
                    done();
                })
                .catch(done);
        });
    });

    describe('sendConfirmationEmail', () => {
        let sendMailStub;
        let transporterStub;
        let consoleLogSpy;
    
        beforeEach(() => {
            // Create stubs for nodemailer
            sendMailStub = sinon.stub();
            transporterStub = {
                sendMail: sendMailStub
            };
            sinon.stub(nodemailer, 'createTransport').returns(transporterStub);
            
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
