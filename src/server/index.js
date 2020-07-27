require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

// example API call
app.get("/apod", async (req, res) => {
  try {
    console.log("hehe");
    let data = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
  } catch (err) {
    console.log("error:", err);
  }
});

app.get("/neows", async (req, res) => {
  try {
    let data = await fetch(
      `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
    // res.send("hello");
  } catch (err) {
    console.log("error:", err);
    res.send("err");
  }
});

// https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=DEMO_KEY

app.get("/rover/curiosity", async (req, res) => {
  try {
    let data = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
    // res.send("hello");
  } catch (err) {
    console.log("error:", err);
    res.send("err");
  }
});

app.get("/rover/opportunity", async (req, res) => {
  try {
    let data = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=1000&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
    // res.send("hello");
  } catch (err) {
    console.log("error:", err);
    res.send("err");
  }
});

app.get("/rover/spirit", async (req, res) => {
  try {
    let data = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos?sol=1000&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
    // res.send("hello");
  } catch (err) {
    console.log("error:", err);
    res.send("err");
  }
});
// https://images-api.nasa.gov
app.get("/images", async (req, res) => {
  try {
    let data = await fetch(
      `https://images-api.nasa.gov/search?q=mars`
    ).then((res) => res.json());
    res.send({ data });
    // res.send("hello");
  } catch (err) {
    console.log("error:", err);
    res.send("err");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
