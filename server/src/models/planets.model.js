const planetSchema = require('./planets.mongo')
const {parse} = require('csv-parse');
const fs = require('fs');

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetData() {
    fs.createReadStream('src/data/kepler_data.csv')
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
                await savePlanet(data)
            }
        })
        .on('error', (err) => {
            console.log(err);
        })
        .on('end', () => {
            // console.log(habitablePlanets.map((planet) => {
            //     return planet['kepler_name'];
            // }));
            // console.log(`${habitablePlanets.length} habitable planets found!`);
        });
}


async function getAllPlanets() {
    return await planetSchema.find({}, {
        "_id": 0, "__v": 0
    })
}

async function savePlanet(planet) {
    try {
        return await planetSchema.updateOne(
            {keplerName: planet.kepler_name},
            {keplerName: planet.kepler_name},
            {upsert: true}
        )
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    loadPlanetData,
    getAllPlanets,
}
