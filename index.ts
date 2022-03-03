/*

    @title STREAMLABS LOYALTY EXTENSION > STREAMELEMENTS EXPORTER
    @author ashcorpdev
    @description This nodejs script will allow exporting your streamlabs loyalty extension points to a CSV file that can be imported into StreamElements etc.

*/

import { RateLimitedAxiosInstance } from './node_modules/axios-rate-limit/typings/index.d';
const fs = require('fs');
import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import { ExportToCsv } from 'export-to-csv';
require('dotenv/config');

// Make web requests for each points page.
// Save the data into an array/list
// Export to a .csv with USERNAME,POINTS format (WITH NO HEADERS).

console.log('Attempting to download streamlabs data...');
const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2})
let data: { username: string; twitchId: string; currentPoints: string; allTimePoints: Number; watchTime: string; }[] = [];

async function getData(http: RateLimitedAxiosInstance) {
    console.log('Setting up connection...');
    let pages = parseInt(process.env.PAGES!);


    let config = {
        headers: {
            "User-Agent": process.env.USERAGENT!,
            Accept: "application/json text/plain */*",
            Referer: "https://streamlabs.com/dashboard",
            "X-CSRF-TOKEN": process.env.XCSRFTOKEN!,
            "X-Requested-With": "XMLHttpRequest",
            DNT: 1,
            Connection: "keep-alive",
            Cookie: process.env.COOKIE!,
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-origin",
            "Sec-GPC": 1,
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            TE: "trailers"
        }
    }

    for (let index = 1; index <= pages; index++) {

        const url = `https://streamlabs.com/api/v5/loyalty/user-points?request_url=https://streamlabs.com/api/v5/loyalty/user-points&sort=username&order=DESC&limit=100&page=${index}`
        
        console.log(`Processing page ${index} of ${pages}`)
        await http.get(url, config).then((res) => {
            for(let j = 0; j < 100; j++) {
                const user = JSON.stringify(res.data.points.data[j].username)
                const points = JSON.stringify(res.data.points.data[j].points)
                const timeWatched = JSON.stringify(res.data.points.data[j].time_watched);
    
                data.push({
                    username: JSON.parse(user),
                    twitchId: "",
                    currentPoints: JSON.parse(points),
                    allTimePoints: 0,
                    watchTime: JSON.parse(timeWatched)
                })
            }
        }).catch((err) => console.log(`Got Error: ${err}`));
    }
}

getData(http).then(() => {
    

    // Export to CSV
    const options = { 
        fieldSeparator: ',',
        title: 'sl-points',
        useKeysAsHeaders: false
      };
     
    const csvExporter = new ExportToCsv(options);
    const csvData = csvExporter.generateCsv(data, true);
    fs.writeFileSync('sl-points.csv',csvData)
    console.log('Process complete! You may now exit this process...')
});