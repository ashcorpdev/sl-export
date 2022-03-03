"use strict";
/*

    @title STREAMLABS LOYALTY EXTENSION > STREAMELEMENTS EXPORTER
    @author ashcorpdev
    @description This nodejs script will allow exporting your streamlabs loyalty extension points to a CSV file that can be imported into StreamElements etc.

*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const axios_1 = __importDefault(require("axios"));
const axios_rate_limit_1 = __importDefault(require("axios-rate-limit"));
const export_to_csv_1 = require("export-to-csv");
require('dotenv/config');
// Make web requests for each points page.
// Save the data into an array/list
// Export to a .csv with USERNAME,POINTS format (WITH NO HEADERS).
console.log('Attempting to download streamlabs data...');
const http = (0, axios_rate_limit_1.default)(axios_1.default.create(), { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2 });
let data = [];
function getData(http) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Setting up connection...');
        let pages = parseInt(process.env.PAGES);
        let config = {
            headers: {
                "User-Agent": process.env.USERAGENT,
                Accept: "application/json text/plain */*",
                Referer: "https://streamlabs.com/dashboard",
                "X-CSRF-TOKEN": process.env.XCSRFTOKEN,
                "X-Requested-With": "XMLHttpRequest",
                DNT: 1,
                Connection: "keep-alive",
                Cookie: process.env.COOKIE,
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "no-cors",
                "Sec-Fetch-Site": "same-origin",
                "Sec-GPC": 1,
                "Pragma": "no-cache",
                "Cache-Control": "no-cache",
                TE: "trailers"
            }
        };
        for (let index = 1; index <= pages; index++) {
            const url = `https://streamlabs.com/api/v5/loyalty/user-points?request_url=https://streamlabs.com/api/v5/loyalty/user-points&sort=username&order=DESC&limit=100&page=${index}`;
            console.log(`Processing page ${index} of ${pages}`);
            yield http.get(url, config).then((res) => {
                for (let j = 0; j < 100; j++) {
                    const user = JSON.stringify(res.data.points.data[j].username);
                    const points = JSON.stringify(res.data.points.data[j].points);
                    const timeWatched = JSON.stringify(res.data.points.data[j].time_watched);
                    data.push({
                        username: JSON.parse(user),
                        twitchId: "",
                        currentPoints: JSON.parse(points),
                        allTimePoints: 0,
                        watchTime: JSON.parse(timeWatched)
                    });
                }
            }).catch((err) => console.log(`Got Error: ${err}`));
        }
    });
}
getData(http).then(() => {
    // Export to CSV
    const options = {
        fieldSeparator: ',',
        title: 'sl-points',
        useKeysAsHeaders: false
    };
    const csvExporter = new export_to_csv_1.ExportToCsv(options);
    const csvData = csvExporter.generateCsv(data, true);
    fs.writeFileSync('sl-points.csv', csvData);
    console.log('Process complete! You may now exit this process...');
});
