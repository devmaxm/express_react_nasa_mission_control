const API_URL = process.env.REACT_APP_API_URL

async function httpGetPlanets() {
    const response = await fetch(`${API_URL}/planets`)
    const planets = await response.json()
    return planets.planets
}

async function httpGetLaunches() {
    const response = await fetch(`${API_URL}/launches`)
    const launches = await response.json()
    launches.launches.sort((a, b) => {
        return a.flightNumber - b.flightNumber
    })
    return launches.launches
}

async function httpSubmitLaunch(launch) {
    try {
        return await fetch(`${API_URL}/launches`, {
            method: "POST",
            body: JSON.stringify(launch),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (e) {
        return {
            ok: false
        }
    }
}

async function httpAbortLaunch(id) {
    try {
        return await fetch(`${API_URL}/launches/${id}`, {method: 'delete'})
    } catch (e) {
        return {
            ok: false
        }
    }
}

export {
    httpGetPlanets,
    httpGetLaunches,
    httpSubmitLaunch,
    httpAbortLaunch,
};
