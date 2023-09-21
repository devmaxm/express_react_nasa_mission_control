const request = require('supertest')
const app = require('../../app')
const {mongoConnect, mongoDisconnect} = require("../../services/mongo");
const {raw} = require("express");

describe('test launches API', () => {
    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => await mongoDisconnect())

    describe('test GET /launches', () => {
        it('should return 200 status code', async () => {
            const response = await request(app)
                .get('/api/launches')
                .expect(200)
        })
    })


    describe('test POST /launches', () => {
        const correctLaunchData = {
            mission: "Test mission",
            rocket: "Test rocket",
            target: "Kepler-1652 b",
            launchDate: "January 1, 2030"
        }

        const launchDataWithoutDate = {
            mission: "Test mission",
            rocket: "Test rocket",
            target: "Kepler-1652 b"
        }

        const launchDataWithInvalidDate = {
            mission: "Test mission",
            rocket: "Test rocket",
            target: "Kepler-1652 b",
            launchDate: "test"
        }

        const launchDataWithInvalidTarget = {
            mission: "Test mission",
            rocket: "Test rocket",
            target: "kfmo1j[fisahfi9ahf03-fjopi",
            launchDate: "January 1, 2030"
        }

        it('should return 201 status code if success', async () => {
            const response = await request(app)
                .post('/api/launches')
                .send(correctLaunchData)
                .expect(201)

            const requestDate = new Date(correctLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject({
                ...launchDataWithoutDate,
                customers: ['NASA'],
                upcoming: true,
                success: true
            })

            expect(typeof response.body.flightNumber).toBe('number')
        })

        it('should catch error if body empty', async () => {
            const response = await request(app)
                .post('/api/launches')
                .expect(400)

            expect(response.body).toStrictEqual({
                error: "Missing required launch property"
            })
        })

        it('should catch error if missing required fields', async () => {
            const response = await request(app)
                .post('/api/launches')
                .send(launchDataWithoutDate)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: "Missing required launch property"
            })
        })

        it('should catch error if invalid launch data sent', async () => {
            const response = await request(app)
                .post('/api/launches')
                .send(launchDataWithInvalidDate)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: "Invalid launch date"
            })
        })

        it('should catch error if invalid target', async () => {
            const response = await request(app)
                .post('/api/launches')
                .send(launchDataWithInvalidTarget)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: "No matching planet found"
            })
        })
    })

})

