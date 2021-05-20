require('dotenv').config()
const axios = require('axios')
const cron = require('node-cron')
const slackToken = process.env.SLACK_TOKEN
const { sendSlack } = require('@kznjunk/paperboy-slack')(slackToken)

const items = [
    {
        name: 'Melgven',
        host: 'https://www.doctolib.fr',
        subpaths: '/vaccination-covid-19/melgven/centre-de-vaccination-covid-19-de-concarneau/booking/availabilities',
        data: {
            'motiveKey': '1re%20injection%20vaccin%20COVID-19%20%28Pfizer-BioNTech%29-5494',
            'placeId': 'practice-165721',
            'specialityId': '5494'
        }
    },
    {
        name: 'Quimperlé',
        host: 'https://www.doctolib.fr',
        subpaths: '/vaccination-covid-19/quimperle/centre-de-vaccination-covid-19-de-quimperle/booking/availabilities',
        data: {
            'motiveKey': '1re%20injection%20vaccin%20COVID-19%20%28Pfizer-BioNTech%29-5494',
            'pid': 'practice-166434',
            'placeId': 'practice-166434',
            'specialityId': '5494'
        }
    }
]

cron.schedule('20 * * * * *', () => {
    loopItems()
})

function loopItems() {
    for (let i = 0; i < items.length; i++) {
        doMagic(items[i])
    }
}

function doMagic(item) {
    const config = {
        method: 'get',
        url: `${item.host}${item.subpaths}`,
        data: item.data,
        headers: {
            'User-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        }
    }

    axios(config)
        .then(function (res) {
            const data = res && res.data

            if (data) {
                const today = new Date()
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)

                const dateOptions = {
                    month: 'long',
                    day: 'numeric'
                }
                const currDayToCheck = today.toLocaleDateString('fr-FR', dateOptions)
                const nextDayToCheck = tomorrow.toLocaleDateString('fr-FR', dateOptions)
                const pattern = new RegExp(`${currDayToCheck}|${nextDayToCheck}`, 'ig')
                const isGoodToGo = pattern.test(data)

                if (isGoodToGo) sendMessage(item.name)
            }
        })
        .catch(function (error) {
            console.log(error)
        })
}

function sendMessage(city) {
    const channel = 'tests'
    const message = `Gogo dispo ${city}!!!`

    sendSlack(channel, message)
}
