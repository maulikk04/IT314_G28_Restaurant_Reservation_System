const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const { getAllRestaurants, getPublicRestaurantById } = require('../controllers/publicRestaurantController.js');
const Restaurant = require('../model/restaurantmodel');

describe('Restaurant Controller Tests', () => {
    let req, res, restaurantStub;

    beforeEach(() => {
        // Reset stubs and spies before each test
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        req = {
            params: {}
        };
    });

    afterEach(() => {
        // Restore all stubs after each test
        sinon.restore();
    });

    describe('getAllRestaurants', () => {
        it('should return all restaurants successfully', async () => {
            // Mock data
            const mockRestaurants = [
                {
                    name: 'Test Restaurant 1',
                    location: 'Test Location 1',
                    cuisines: ['Italian'],
                    image: ['image1.jpg', 'image2.jpg'],
                    openingTime: '09:00',
                    closingTime: '22:00',
                    phoneNumber: '1234567890',
                    foodPreference: 'Both',
                    toObject: () => ({
                        name: 'Test Restaurant 1',
                        location: 'Test Location 1',
                        cuisines: ['Italian'],
                        image: ['image1.jpg', 'image2.jpg'],
                        openingTime: '09:00',
                        closingTime: '22:00',
                        phoneNumber: '1234567890',
                        foodPreference: 'Both'
                    })
                }
            ];

            // Create stub for Restaurant.find
            restaurantStub = sinon.stub(Restaurant, 'find').returns({
                select: sinon.stub().resolves(mockRestaurants)
            });

            // Call the function
            await getAllRestaurants(req, res);

            // Assertions
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0]).to.deep.equal({
                success: true,
                restaurantData: mockRestaurants.map(restaurant => ({
                    ...restaurant.toObject(),
                    image: restaurant.image[0],
                    Image: restaurant.image
                }))
            });
        });

        it('should handle errors appropriately', async () => {
            // Simulate database error
            restaurantStub = sinon.stub(Restaurant, 'find').throws(new Error('Database error'));

            // Call the function
            await getAllRestaurants(req, res);

            // Assertions
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({
                success: false,
                message: 'Failed to fetch restaurants'
            })).to.be.true;
        });
    });

    describe('getPublicRestaurantById', () => {
        it('should return a specific restaurant when valid ID is provided', async () => {
            // Mock data
            const mockRestaurant = {
                _id: 'validId123',
                name: 'Test Restaurant',
                location: 'Test Location',
                cuisines: ['Italian'],
                image: ['image1.jpg']
            };

            // Mock request parameters
            req.params = { id: 'validId123' };

            // Create stub for Restaurant.findById
            restaurantStub = sinon.stub(Restaurant, 'findById').returns({
                select: sinon.stub().resolves(mockRestaurant)
            });

            // Call the function
            await getPublicRestaurantById(req, res);

            // Assertions
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                success: true,
                restaurantData: mockRestaurant
            })).to.be.true;
        });

        it('should return 404 when restaurant is not found', async () => {
            // Mock request parameters
            req.params = { id: 'invalidId123' };

            // Create stub for Restaurant.findById
            restaurantStub = sinon.stub(Restaurant, 'findById').returns({
                select: sinon.stub().resolves(null)
            });

            // Call the function
            await getPublicRestaurantById(req, res);

            // Assertions
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({
                success: false,
                message: 'Restaurant not found'
            })).to.be.true;
        });

        it('should handle database errors appropriately', async () => {
            // Mock request parameters
            req.params = { id: 'validId123' };

            // Simulate database error
            restaurantStub = sinon.stub(Restaurant, 'findById').throws(new Error('Database error'));

            // Call the function
            await getPublicRestaurantById(req, res);

            // Assertions
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({
                success: false,
                message: 'Failed to fetch restaurant details'
            })).to.be.true;
        });
    });
});