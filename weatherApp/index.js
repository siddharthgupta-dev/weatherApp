const http = require('http');
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let  temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp/10).toFixed(1));
    temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min/10).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max/10).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);


    return temperature;
    
}


const server  = http.createServer((req, res) => {
    if (req.url == "/") {
    
        requests("http://api.openweathermap.org/data/2.5/weather?q=Allahabad,In&APPID=b6d77439a6fa12a9085690c12e00a09d")
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            //console.log(arrData [0].main.temp/10);
            const realTimeData = arrData
                .map((val) =>  replaceVal(homeFile, val))
                .join("");
                 res.write(realTimeData);
              // console.log(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log('connection closed due to error', err);
            res.end();
        });
    
    }

});

server.listen(8080);