const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const restaurant = require('../model/restaurantmodel');
const { 
    addRestaurant, 
    allRestaurant, 
    updateRestaurant, 
    GetRestaurantById,
} = require('../controllers/restaurantController');
const{isValidTimeRange}=require('../controllers/restaurantController');

describe('Restaurant Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        // Reset sinon sandbox before each test
        sinon.restore();

        // Mock request and response objects
        req = {
            user: { _id: 'testUserId' },
            body: {},
            files: {},
            params: {}
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    
    describe('addRestaurant validation', () => {
        beforeEach(() => {
            // Setup base request with valid data
            req.body = {
                name: 'Test Restaurant',
                location: 'Test Location',
                capacity: '{"tables": 10, "seats": 40}',
                openingTime: '10:00',
                closingTime: '22:00',
                cuisines: ['Italian', 'Mexican'],
                phoneNumber: '1234567890',
                foodPreference: 'both',
                features: ['parking', 'wifi'],
                specialDishes: ['Pizza', 'Pasta']
            };
            
            req.files = {
                image: [{ filename: 'test-image.jpg' }],
                menuImage: [{ filename: 'test-menu.jpg' }]
            };
        });
    
        it('should return 400 if both images are not provided', async () => {
            // Arrange
            req.files.image = undefined; // No image provided
            req.files.menuImage = undefined; // No menu image provided
    
            // Act
            await addRestaurant(req, res);
    
            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Images are required' })).to.be.true;
        });
    
 
        it('should properly validate edge case times', async () => {
            const testCases = [
                { openTime: '00:00', closeTime: '23:59', shouldBeValid: true },
                { openTime: '23:59', closeTime: '00:01', shouldBeValid: true },
                { openTime: '12:00', closeTime: '12:00', shouldBeValid: false },
                { openTime: '23:59', closeTime: '23:58', shouldBeValid: false }
            ];

            for (const testCase of testCases) {
                req.body.openingTime = testCase.openTime;
                req.body.closingTime = testCase.closeTime;

                const saveStub = sinon.stub(restaurant.prototype, 'save').resolves({
                    ...req.body,
                    _id: 'testRestaurantId'
                });

                await addRestaurant(req, res);

                if (testCase.shouldBeValid) {
                    expect(res.status.calledWith(201)).to.be.true;
                    expect(saveStub.calledOnce).to.be.true;
                } else {
                    expect(res.status.calledWith(400)).to.be.true;
                    expect(res.json.calledWith({
                        message: "Invalid Time Range"
                    })).to.be.true;
                }

                sinon.restore(); // Reset stubs for next iteration
            }
        });

        // Test for empty or malformed time strings
        it('should handle malformed time strings', async () => {
            const invalidTimeCases = [
                { openTime: '', closeTime: '17:00' },
                { openTime: '09:00', closeTime: '' },
                { openTime: 'invalid', closeTime: '17:00' },
                { openTime: '09:00', closeTime: 'invalid' },
                { openTime: '25:00', closeTime: '17:00' },
                { openTime: '09:00', closeTime: '24:01' }
            ];

            for (const testCase of invalidTimeCases) {
                req.body.openingTime = testCase.openTime;
                req.body.closingTime = testCase.closeTime;

                await addRestaurant(req, res);

                expect(res.status.calledWith(400)).to.be.true;
                expect(res.json.calledWith({
                    message: "Invalid Time Range"
                })).to.be.true;

                sinon.restore(); // Reset stubs for next iteration
            }
        });
    });

    describe('allRestaurant', () => {
        it('should return all restaurants for owner', async () => {
            const mockRestaurants = [
                {
                    _id: 'rest1',
                    name: 'Restaurant 1',
                    image: ['image1.jpg', 'image2.jpg'],
                    toObject: function() {
                        return {
                            _id: this._id,
                            name: this.name,
                            image: this.image
                        };
                    }
                }
            ];

            sinon.stub(restaurant, 'find').resolves(mockRestaurants);

            await allRestaurant(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({
                restaurantData: sinon.match.array
            })).to.be.true;
        });

        it('should handle errors', async () => {
            sinon.stub(restaurant, 'find').rejects(new Error('Database error'));

            await allRestaurant(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({
                error: 'Database error'
            })).to.be.true;
        });
    });

    describe('GetRestaurantById', () => {
        let req, res, next;

    beforeEach(() => {
        req = { params: { id: 'some-id' } };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });
        it('should return restaurant by id', async () => {
            const mockRestaurant = {
                _id: 'testRestaurantId',
                name: 'Test Restaurant'
            };

            req.params.id = 'testRestaurantId';
            sinon.stub(restaurant, 'findById').resolves(mockRestaurant);

            await GetRestaurantById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                restaurantData: mockRestaurant
            })).to.be.true;
        });

        it('should handle non-existent restaurant', async () => {
            req.params.id = 'nonexistentId';
            sinon.stub(restaurant, 'findById').resolves(null);

            await GetRestaurantById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({
                message: 'Restaurant Not Found'
            })).to.be.true;
        });

        it('should return 401 and error message when an exception is thrown', async () => {
            const error = new Error('Database connection error');
            sinon.stub(restaurant, 'findById').throws(error);
    
            await GetRestaurantById(req, res, next);
    
            expect(res.status.calledOnceWith(401)).to.be.true;
            expect(res.json.calledOnceWith({ error: 'Database connection error' })).to.be.true;
        });
    });

    describe('updateRestaurant', () => {
        beforeEach(() => {
            req.params.id = 'testRestaurantId';
            req.body = {
                name: 'Updated Restaurant',
                location: 'New Location',
                phoneNumber:'12345648910',
                capacity: '{"tables": 15, "seats": 60}',
                specialDishes:['Pasta','Pizza'],
                features: ['WiFi', 'Parking'],
                cuisines: ['Italian', 'French']
            };
            req.files = {
                image: [{ filename: 'new-image.jpg' }],
                menuImage: [{ filename: 'new-menu.jpg' }]
            };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            mockRestaurant = {
                features: [],
                save: sinon.stub().resolves(),
            };
            
            
        });

        it('should successfully update restaurant', async () => {
            const mockRestaurant = {
                _id: 'testRestaurantId',
                ...req.body,
                save: sinon.stub().resolves()
            };

            sinon.stub(restaurant, 'findOne').resolves(mockRestaurant);

            await updateRestaurant(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                message: 'Restaurant updated successfully',
                restaurant: sinon.match.object
            })).to.be.true;
        });

        it('should handle errors and return a 401 status', async () => {
            // Arrange
            const errorMessage = 'Database error';
            
            // Stub the findOne method to resolve a restaurant
            sinon.stub(restaurant, 'findOne').resolves({ 
                _id: 'testRestaurantId',
                ...req.body,
                save: sinon.stub().rejects(new Error(errorMessage)) // Simulate an error on save
            });
        
            // Act
            await updateRestaurant(req, res);
        
            // Assert
            expect(res.status.calledWith(401)).to.be.true; // Check that res.status(401) was called
            expect(res.json.calledWith({ error: errorMessage })).to.be.true; // Check that res.json was called with the correct error message
        });

        it('should handle unauthorized access', async () => {
            sinon.stub(restaurant, 'findOne').resolves(null);

            await updateRestaurant(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({
                message: 'Restaurant not found or unauthorized access'
            })).to.be.true;
        });
    });
});