const express = require("express");
const axios = require("axios");
const app = express();
const config = require('./config.js');

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
	let weather;
	let pollution;
  let errorW = "City not found, Please try again!";
  let errorP = "Information not found";
	let flag;

	if(req.query.city==null){
		res.render("index", { weather: undefined, pollution, errorW, errorP, flag });
	} 

  const city = req.query.city;
  const apiW = config.apiKey;

  const APIweather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiW}`;
  

  try {
    const responseW = await axios.get(APIweather);
    weather = responseW.data;
  } catch (error) {
    weather = null;
  }
	console.log(weather);

	if(weather != null){
		flag = `https://flagsapi.com/${weather.sys.country}/flat/64.png`;
		
		try {
			const APIpollution = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${weather.coord.lat}&lon=${weather.coord.lon}&appid=${apiW}`;
			const responseP = await axios.get(APIpollution);
			pollution = responseP.data;
		} catch (error) {
			pollution = null;
		}
		console.log(pollution);
	}
  res.render("index", { weather, pollution, errorW, errorP, flag});
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});