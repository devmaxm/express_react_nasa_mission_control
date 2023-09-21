const {
    getAllLaunches,
    addNewLaunch,
    isLaunchExist,
    abortLaunch
} = require('../../models/launches.model')
const planetSchema = require("../../models/planets.mongo");

async function httpGetAllLaunches(req, res) {
    return res.status(200).json({launches: await getAllLaunches()})
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: "Missing required launch property"
        })
    }
    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid launch date"
        })
    }
    const planet = await planetSchema.findOne({keplerName: launch.target})
    if (!planet) {
        return res.status(400).json({error: 'No matching planet found'})
    }
    return res.status(201).json(await addNewLaunch(launch))
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id)
    if (!await isLaunchExist(launchId)) {
        return res.status(404).json({
            error: "Launch doesn't exist"
        })
    }
    return res.status(200).json(await abortLaunch(launchId))
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}
