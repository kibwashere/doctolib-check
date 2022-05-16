require('dotenv').config()
const axios = require('axios')
const cron = require('node-cron')
var page = require('webpage')

const phantom = require('phantom')
const slackToken = process.env.SLACK_TOKEN
const { sendSlack } = require('@kznjunk/paperboy-slack')(slackToken)

const items = [
    {
        name: 'Melgven',
        fullUrl: 'https://www.doctolib.fr/vaccination-covid-19/melgven/centre-de-vaccination-covid-19-de-concarneau/booking/availabilities?motiveKey=r%C3%A9serv%C3%A9%20%C3%A9lections%2020%20et%2027%20Juin-5494&placeId=practice-165721&specialityId=5494',
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
        fullUrl: 'https://www.doctolib.fr/vaccination-covid-19/quimperle/centre-de-vaccination-covid-19-de-quimperle/booking/availabilities?motiveKey=1re%20injection%20vaccin%20COVID-19%20%28Pfizer-BioNTech%29-5494&pid=practice-166434&placeId=practice-166434&specialityId=5494',
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

// loopItems()
doMagic(items[0])

// cron.schedule('*/20 * * * * *', () => {
//     loopItems()
// })

function loopItems() {
    for (let i = 0; i < items.length; i++) {
        doMagic(items[i])
    }
}

async function doMagic(item) {
    const config = {
        method: 'get',
        url: item.fullUrl,
        headers: {
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        }
    }

    const instance = await phantom.create()
    const page = await instance.createPage()
    await page.property('customHeaders', config.headers)

    // await page.on('onResourceRequested', function (requestData) {
    //     console.info('Requesting', requestData.url);
    // })
    // await page.on('onResourceTimeout', function (data) {
    //     console.log('-- 2')
    //     console.log(data)
    // })

    page.on('onResourceReceived', function (response) {
        console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
    });

    const status = await page.open(item.fullUrl)



    // console.log(status)

    // const t = await page.evaluate(function () {
    //     console.log('test')
    //     return 'test'
    // })

    // const x = await page.open(item.fullUrl, function (status) {
    //     console.log('in opend')
    //     return waitFor(function () {
    //         console.log('test: ', document.getElementsByClassName('main-container'))
    //         return document.getElementsByClassName('main-container').length

    //     }, function () {
    //         const output = page.render(output)
    //         console.log(/14 juin/i.test(output))
    //         phantom.exit();
    //     }, 5000)
    // })
    // console.log(x)
    page.on('onConsoleMessage', function (msg, lineNum, sourceId) {
        console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
    })

    page.on('onError', function (msg, trace) {
        console.log(msg);
        trace.forEach(function (item) {
            console.log('  ', item.file, ':', item.line);
        });
    });
    let pp
    console.log('--- AAAAAA')
    // var script1 = "function(){ console.log('hello world 1');}"
    // var value = page.evaluate(script1)
    //const x = await page.open(item.fullUrl, function (status) {
    // var script1 = "function(){ console.log('hello world 2');}"
    // pp = page.evaluate(script1)
    // console.log('ttt')

    // setTimeout(function () {
    //     console.log(page.content);
    //     phantom.exit();
    // }, 5000);

    // if (status !== 'success') {
    //     console.log('Unable to load the address!');
    //     phantom.exit();
    // } else {
    //     console.log('--- test')
    //     waitFor(
    //         function () {
    //             console.log('--- test2')
    //             return page.evaluate(function () {
    //                 console.log('--- test3')
    //                 return document.getElementsByClassName('main-container').length
    //                 // return $('#thediv').is(':visible');
    //             });
    //         },
    //         function () {
    //             // content x = page.render(output)
    //             // console.log('data x: ', )
    //             const content = page.property('content')
    //             console.log(/14 juin/i.test(content))

    //             phantom.exit();
    //         }, 5000);
    // }
    // });
    console.log(x)
    console.log(pp)
    console.log('--- ZZZZZZ')




    function waitFor($config) {
        $config._start = $config._start || new Date();

        if ($config.timeout && new Date - $config._start > $config.timeout) {
            if ($config.error) $config.error();
            if ($config.debug) console.log('timedout ' + (new Date - $config._start) + 'ms');
            return;
        }

        if ($config.check()) {
            if ($config.debug) console.log('success ' + (new Date - $config._start) + 'ms');
            return $config.success();
        }

        setTimeout(waitFor, $config.interval || 0, $config);
    }


    // const content = await page.property('content')
    // console.log(/14 juin/i.test(content))

    // console.log(content)



    // await instance.exit()

    // axios(config)
    //     .then(function (res) {
    //         const data = res && res.data
    //         console.log(item.name)
    //         if (data) {
    //             const today = new Date()
    //             const tomorrow = new Date()
    //             tomorrow.setDate(tomorrow.getDate() + 1)

    //             const dateOptions = {
    //                 month: 'long',
    //                 day: 'numeric'
    //             }
    //             const currDayToCheck = today.toLocaleDateString('fr-FR', dateOptions)
    //             const nextDayToCheck = tomorrow.toLocaleDateString('fr-FR', dateOptions)
    //             const pattern = new RegExp(`${currDayToCheck}|${nextDayToCheck}|14 juin`, 'ig')
    //             const isGoodToGo = pattern.test(data)
    //             console.log(isGoodToGo)
    //             if (item.name === "Melgven") {
    //                 console.log(data)
    //             }
    //             if (isGoodToGo) sendMessage(item.name, `${item.fullUrl}`)
    //         }
    //     })
    //     .catch(function (error) {
    //         console.log(error)
    //     })
}

function sendMessage(city, link) {
    const channel = 'tests'
    const message = `Gogo dispo ${city}!!! Link: ${link}`

    sendSlack(channel, message)
}
