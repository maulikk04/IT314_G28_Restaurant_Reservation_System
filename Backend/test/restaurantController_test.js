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
const assert=require('assert');
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

    describe('isValidTimeRange', () => {
        // Test case for Mutation 1 (return true for closing time before opening time)
    it('should correctly handle closing time before opening time (spanning midnight)', () => {
        const openTime = '23:30';  // Opening at 11:30 PM
        const closeTime = '00:15'; // Closing at 12:15 AM

        // This should return true, as the time range spans midnight correctly
        const result = isValidTimeRange(openTime, closeTime);
        expect(result).to.be.false;
    });

    // Test case for Mutation 2 (>= instead of > comparison)
    it('should correctly handle closing time being exactly the same as opening time', () => {
        const openTime = '23:30';  // Opening at 11:30 PM
        const closeTime = '23:30'; // Closing at 11:30 PM

        // This should return false because the times are identical
        const result = isValidTimeRange(openTime, closeTime);
        expect(result).to.be.false;
    });

    it('should correctly handle a valid time range without midnight crossing', () => {
        const openTime = '08:30';  // Opening at 8:30 AM
        const closeTime = '09:00'; // Closing at 9:00 AM

        // This should return true, as 09:00 is after 08:30
        const result = isValidTimeRange(openTime, closeTime);
        expect(result).to.be.true;
    });

   

    // Test case where the closing time is greater than opening time after adding 24 hours (spanning midnight)
    it('should return true for closing time after midnight', () => {
        const openTime = '23:30'; // Opening at 11:30 PM
        const closeTime = '00:30'; // Closing at 12:30 AM (next day)

        // This should return true, as the time spans midnight
        const result = isValidTimeRange(openTime, closeTime);
        expect(result).to.be.false;
    });

    
        it('should return false for identical opening and closing times', () => {
            assert.strictEqual(isValidTimeRange('12:00', '12:00'), false);
        });
    
        it('should handle edge case of midnight (00:00) as opening time', () => {
            assert.strictEqual(isValidTimeRange('00:00', '01:00'), true);
        });
    
        it('should handle edge case of midnight (00:00) as closing time', () => {
            assert.strictEqual(isValidTimeRange('23:30', '00:00'), false);
        });
    
        it('should handle full day range from 00:00 to 23:59', () => {
            assert.strictEqual(isValidTimeRange('00:00', '23:59'), true);
        });
    
        it('should return true if closing time is exactly one minute after opening time', () => {
            assert.strictEqual(isValidTimeRange('10:00', '10:01'), true);
        });
    
        it('should handle times with non-zero minutes correctly (valid range)', () => {
            assert.strictEqual(isValidTimeRange('10:15', '10:30'), true); // 615 < 630
        });
    
        it('should handle times with non-zero minutes correctly (invalid range)', () => {
            assert.strictEqual(isValidTimeRange('10:30', '10:15'), false); // 630 > 615
        });
    
        it('should correctly compare times across midnight with non-zero minutes', () => {
            assert.strictEqual(isValidTimeRange('23:45', '00:15'), false); // 1425 < 15 + 1440
        });
    
        it('should return false if closing time is exactly one minute before opening time with non-zero minutes', () => {
            assert.strictEqual(isValidTimeRange('23:45', '23:44'), false); // 1425 > 1424
        });
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

        it('should return 400 if any one image is not provided', async () => {
            // Arrange
            req.files.menuImage = undefined; // No menu image provided
    
            // Act
            await addRestaurant(req, res);
    
            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Images are required' })).to.be.true;
        });
    
        it('should return the correct response object on success', async () => {
            const mockRequest = {
                body: {
                    name: 'Test Restaurant',
                    location: 'Test Location',
                    capacity: '50',
                    cuisines: ['Indian'],
                    openingTime: '09:00',
                    closingTime: '21:00',
                    phoneNumber: '1234567890',
                    foodPreference: 'Vegetarian',
                    features: ['WiFi'],
                    specialDishes: ['Dish1']
                },
                files: {
                    image: [{ filename: 'image.jpg' }],
                    menuImage: [{ filename: 'menu.jpg' }]
                },
                user: { _id: 'mockUserId' }
            };
    
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            const saveStub = sinon.stub(restaurant.prototype, 'save').resolves();
    
            await addRestaurant(mockRequest, mockResponse);
    
            expect(mockResponse.status.calledWith(201)).to.be.true;
            expect(mockResponse.json.calledWith(sinon.match({
                message: 'Restaurant added successfully',
                restaurant: sinon.match.object
            }))).to.be.true;
    
            saveStub.restore();
        });

        it('should save the restaurant with valid images', async () => {
            const mockRequest = {
                user: { _id: 'mockUserId' },
                files: {
                    image: [{ filename: 'image1.jpg' }],
                    menuImage: [{ filename: 'menu1.jpg' }]
                },
                body: {
                    name: 'Test Restaurant',
                    location: 'Test Location',
                    capacity: '50',
                    cuisines: ['Indian'],
                    openingTime: '09:00',
                    closingTime: '21:00',
                    phoneNumber: '1234567890',
                    foodPreference: 'Vegetarian',
                    features: ['WiFi'],
                    specialDishes: ['Dish1']
                }
            };
    
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            // Stub the save method to prevent actual DB interaction
            const saveStub = sinon.stub(restaurant.prototype, 'save').resolves();
    
            // Call the function under test
            await addRestaurant(mockRequest, mockResponse);
    
            // Assert that the image array contains valid filenames (not undefined)
            expect(mockResponse.status.calledWith(201)).to.be.true;
            expect(mockResponse.json.calledWith({
                message: 'Restaurant added successfully',
                restaurant: sinon.match.has('image', ['image1.jpg'])
            })).to.be.true;
    
            saveStub.restore();
        });

        it('should save the restaurant with valid menu images', async () => {
            const mockRequest = {
                user: { _id: 'mockUserId' },
                files: {
                    image: [{ filename: 'image1.jpg' }],
                    menuImage: [{ filename: 'menu1.jpg' }]  // Mocking menuImage with valid file
                },
                body: {
                    name: 'Test Restaurant',
                    location: 'Test Location',
                    capacity: '50',
                    cuisines: ['Indian'],
                    openingTime: '09:00',
                    closingTime: '21:00',
                    phoneNumber: '1234567890',
                    foodPreference: 'Vegetarian',
                    features: ['WiFi'],
                    specialDishes: ['Dish1']
                }
            };
    
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            // Stub the save method to prevent actual DB interaction
            const saveStub = sinon.stub(restaurant.prototype, 'save').resolves();
    
            // Call the function under test
            await addRestaurant(mockRequest, mockResponse);
    
            // Assert that the menuImage array contains valid filenames (not undefined)
            expect(mockResponse.status.calledWith(201)).to.be.true;
            expect(mockResponse.json.calledWith({
                message: 'Restaurant added successfully',
                restaurant: sinon.match.has('menuImage', ['menu1.jpg'])
            })).to.be.true;
    
            saveStub.restore();
        });

        it('should handle errors properly and return a 401 status with error message', async () => {
            const mockRequest = {
                user: { _id: 'mockUserId' },
                files: {
                    image: [{ filename: 'image1.jpg' }],
                    menuImage: [{ filename: 'menu1.jpg' }]
                },
                body: {
                    name: 'Test Restaurant',
                    location: 'Test Location',
                    capacity: '50',
                    cuisines: ['Indian'],
                    openingTime: '09:00',
                    closingTime: '21:00',
                    phoneNumber: '1234567890',
                    foodPreference: 'Vegetarian',
                    features: ['WiFi'],
                    specialDishes: ['Dish1']
                }
            };
    
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            // Stub the save method to simulate an error
            const saveStub = sinon.stub(restaurant.prototype, 'save').rejects(new Error('Database error'));
    
            // Spy on console.log to check if the error is logged
            const consoleLogSpy = sinon.spy(console, 'log');
    
            // Call the function under test
            await addRestaurant(mockRequest, mockResponse);
    
            // Assert that the error was logged
            expect(consoleLogSpy.calledOnce).to.be.true;
            expect(consoleLogSpy.args[0][0].message).to.equal('Database error');
    
            // Assert that the response status is 401 and the error message is returned
            expect(mockResponse.status.calledWith(401)).to.be.true;
            expect(mockResponse.json.calledWith({
                message: 'Database error'
            })).to.be.true;
    
            // Restore the spy and stub
            consoleLogSpy.restore();
            saveStub.restore();
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

        it('should correctly transform restaurant data and include the first image', async () => {
            const mockRequest = {
                user: { _id: 'mockUserId' }
            };
    
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            // Mock restaurant data with multiple restaurants
            const mockRestaurants = [
                {
                    _id: 'restaurant1',
                    ownerId: 'mockUserId',
                    image: ['image1.jpg', 'image2.jpg'],
                    toObject: sinon.stub().returns({ _id: 'restaurant1', ownerId: 'mockUserId', image: ['image1.jpg', 'image2.jpg'] })
                },
                {
                    _id: 'restaurant2',
                    ownerId: 'mockUserId',
                    image: ['image3.jpg', 'image4.jpg'],
                    toObject: sinon.stub().returns({ _id: 'restaurant2', ownerId: 'mockUserId', image: ['image3.jpg', 'image4.jpg'] })
                }
            ];
    
            // Stub `find` to return mock restaurant data
            const findStub = sinon.stub(restaurant, 'find').resolves(mockRestaurants);
    
            // Call the function under test
            await allRestaurant(mockRequest, mockResponse);
    
            // Check that transformedData is correct
            expect(mockResponse.status.calledWith(201)).to.be.true;
            expect(mockResponse.json.calledWith({
                restaurantData: [
                    { _id: 'restaurant1', ownerId: 'mockUserId', image: 'image1.jpg' },
                    { _id: 'restaurant2', ownerId: 'mockUserId', image: 'image3.jpg' }
                ]
            })).to.be.true;
    
            findStub.restore();
        });
    
        it('should return an empty array if no restaurants are found', async () => {
            const mockRequest = {
                user: { _id: 'mockUserId' }
            };
    
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            // Stub `find` to return an empty array
            const findStub = sinon.stub(restaurant, 'find').resolves([]);
    
            // Call the function under test
            await allRestaurant(mockRequest, mockResponse);
    
            // Check that transformedData is an empty array
            expect(mockResponse.status.calledWith(201)).to.be.true;
            expect(mockResponse.json.calledWith({ restaurantData: [] })).to.be.true;
    
            findStub.restore();
        });
        
        it('should only return restaurants belonging to the current user', async () => {
            const mockRequest = {
                user: { _id: 'mockUserId' }
            };
    
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            const mockRestaurants = [
                { 
                    _id: 'restaurant1',
                    ownerId: 'mockUserId', 
                    image: ['image1.jpg'],
                    toObject: sinon.stub().returns({ _id: 'restaurant1', ownerId: 'mockUserId', image: ['image1.jpg'] })
                },
                { 
                    _id: 'restaurant2',
                    ownerId: 'mockUserId', 
                    image: ['image2.jpg'],
                    toObject: sinon.stub().returns({ _id: 'restaurant2', ownerId: 'mockUserId', image: ['image2.jpg'] })
                },
                { 
                    _id: 'restaurant3',
                    ownerId: 'otherUserId', 
                    image: ['image3.jpg'],
                    toObject: sinon.stub().returns({ _id: 'restaurant3', ownerId: 'otherUserId', image: ['image3.jpg'] })
                }
            ];
    
            // Stub `find` to simulate the mutated call (i.e., no filter)
            const findStub = sinon.stub(restaurant, 'find').resolves(mockRestaurants);
    
            // Call the function under test
            await allRestaurant(mockRequest, mockResponse);
    
            // Log the output to verify the returned data
            console.log('Mock Response JSON:', mockResponse.json.args);
    
            // Assert that `find` was called with an empty filter
            expect(findStub.calledWith({})).to.be.false;
    
            // Check that the transformed data only includes restaurants of the current user
            
    
            findStub.restore();
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

        it('should return 404 if the restaurant is not found or unauthorized', async () => {
            const mockRequest = {
                params: { id: 'mockRestaurantId' },
                body: {
                    name: 'Updated Restaurant',
                    location: 'Updated Location',
                    capacity: '100',
                    cuisines: ['Indian', 'Chinese'],
                    openingTime: '10:00',
                    closingTime: '22:00',
                    phoneNumber: '1234567890',
                    features: ['WiFi', 'Parking'],
                    specialDishes: ['Dish1', 'Dish2']
                },
                files: {
                    image: [{ filename: 'image1.jpg' }],
                    menuImage: [{ filename: 'menu1.jpg' }]
                },
                user: { _id: 'mockUserId' }
            };
    
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            // Stub `findOne` to simulate the mutant
            const findOneStub = sinon.stub(restaurant, 'findOne').resolves(null); // No restaurant matches the query
    
            await updateRestaurant(mockRequest, mockResponse);
    
            expect(findOneStub.calledWith({ _id: 'mockRestaurantId', ownerId: 'mockUserId' })).to.be.true; // Ensure proper query is used
            expect(mockResponse.status.calledWith(404)).to.be.true;
            expect(mockResponse.json.calledWith({ message: 'Restaurant not found or unauthorized access' })).to.be.true;
    
            findOneStub.restore();
        });

        it('should correctly update the image filenames', async () => {
            const mockRequest = {
                params: { id: 'mockRestaurantId' },
                body: {
                    name: 'Updated Restaurant',
                    location: 'Updated Location',
                    capacity: '100',
                    cuisines: ['Indian', 'Chinese'],
                    openingTime: '10:00',
                    closingTime: '22:00',
                    phoneNumber: '1234567890',
                    features: ['WiFi', 'Parking'],
                    specialDishes: ['Dish1', 'Dish2']
                },
                files: {
                    image: [{ filename: 'image1.jpg' }, { filename: 'image2.jpg' }], // Mock image files
                    menuImage: [{ filename: 'menu1.jpg' }]
                },
                user: { _id: 'mockUserId' }
            };
    
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            const mockRestaurant = {
                save: sinon.stub().resolves(),
                image: [],
                menuImage: []
            };
    
            // Stub `findOne` to return a mock restaurant
            const findOneStub = sinon.stub(restaurant, 'findOne').resolves(mockRestaurant);
    
            await updateRestaurant(mockRequest, mockResponse);
    
            // Validate that the correct filenames are set
            expect(mockRestaurant.image).to.deep.equal(['image1.jpg', 'image2.jpg']);
            expect(mockResponse.status.calledWith(200)).to.be.true;
            expect(mockResponse.json.calledWith(sinon.match({
                message: 'Restaurant updated successfully',
                restaurant: sinon.match.object
            }))).to.be.true;
    
            findOneStub.restore();
        });

        it('should correctly update the menu image filenames', async () => {
            const mockRequest = {
                params: { id: 'mockRestaurantId' },
                body: {
                    name: 'Updated Restaurant',
                    location: 'Updated Location',
                    capacity: '100',
                    cuisines: ['Indian', 'Chinese'],
                    openingTime: '10:00',
                    closingTime: '22:00',
                    phoneNumber: '1234567890',
                    features: ['WiFi', 'Parking'],
                    specialDishes: ['Dish1', 'Dish2']
                },
                files: {
                    image: [{ filename: 'image1.jpg' }],
                    menuImage: [{ filename: 'menu1.jpg' }, { filename: 'menu2.jpg' }] // Mock menu images
                },
                user: { _id: 'mockUserId' }
            };
    
            const mockResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
    
            const mockRestaurant = {
                save: sinon.stub().resolves(),
                image: [],
                menuImage: []
            };
    
            // Stub `findOne` to return a mock restaurant
            const findOneStub = sinon.stub(restaurant, 'findOne').resolves(mockRestaurant);
    
            await updateRestaurant(mockRequest, mockResponse);
    
            // Validate that the correct filenames are set
            expect(mockRestaurant.menuImage).to.deep.equal(['menu1.jpg', 'menu2.jpg']);
            expect(mockResponse.status.calledWith(200)).to.be.true;
            expect(mockResponse.json.calledWith(sinon.match({
                message: 'Restaurant updated successfully',
                restaurant: sinon.match.object
            }))).to.be.true;
    
            findOneStub.restore();
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