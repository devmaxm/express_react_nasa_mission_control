const launchSchema = require('./launches.mongo')
const planetSchema = require('./planets.mongo')
const DEFAULT_FLIGHT_NUMBER = 100;


async function isLaunchExist(launchId) {
    return await launchSchema.findOne({
        flightNumber: launchId
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchSchema
        .findOne()
        .sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launchSchema.find()
}

async function addNewLaunch(launch) {
    const newLaunch = Object.assign(launch, {
        flightNumber: await getLatestFlightNumber() + 1,
        customers: ["NASA"],
        upcoming: true,
        success: true
    })

    return await saveLaunch(newLaunch)
}

async function saveLaunch(launch) {
    return await launchSchema.findOneAndUpdate(
        {flightNumber: launch.flightNumber},
        launch,
        {upsert: true, new: true}
    )
}

async function abortLaunch(launchId) {
    return await launchSchema.findOneAndUpdate(
        {flightNumber: launchId},
        {success: false, upcoming: false},
        {new: true}
    )
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    isLaunchExist,
    abortLaunch
}
