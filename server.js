const express = require('express');
const axios = require('axios')
const _server = express();
const authData = require('./auth-service.js');
const clientSessions = require("client-sessions");
const router = express.Router();
require('dotenv').config();

_server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://nhl-stats-portal.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Add this line to allow credentials

  next();
});

const API_URL = "https://statsapi.web.nhl.com/api/v1";

_server.use(express.static('public'));
_server.use(express.json());

//session middleware
_server.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "some_random_session", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

_server.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

  _server.get('/standings', async (req, res) => {
    try {
        const response = await axios.get(API_URL + '/standings');
        const data = response.data;
        const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
        const origin = req.headers.origin;
        
        if (allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
        // res.header('Access-Control-Allow-Origin', 'https://nhl-stats-portal.netlify.app');
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
      }
  });
  _server.get('/schedule', async (req, res) => {
    try {
        const response = await axios.get(API_URL + '/schedule');
        const data = response.data;
        const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
        const origin = req.headers.origin;
        
        if (allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
        // res.header('Access-Control-Allow-Origin', 'https://nhl-stats-portal.netlify.app');
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
      }
  });
  _server.get('/schedule/:date', async (req, res) => {
  try {
      const response = await axios.get(API_URL + '/schedule?date=' + req.params.date);
      const data = response.data;
      const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
      const origin = req.headers.origin;
      
      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      // res.header('Access-Control-Allow-Origin', 'https://nhl-stats-portal.netlify.app');
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving data');
    }
  });
  _server.get('/teams', async (req, res) => {
    try {
        const response = await axios.get(API_URL + '/teams');
        const data = response.data;
        const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
        const origin = req.headers.origin;
        
        if (allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        }
        // res.header('Access-Control-Allow-Origin', 'https://nhl-stats-portal.netlify.app');
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
      }
  });
  _server.get('/team/:id/roster', async (req, res) => {
    try {
        let response = await axios.get(API_URL + '/teams/' + req.params.id + '/roster');
        const data = response.data.roster;
          for(let i = 0; i < data.length; i++){
            let playerID = data[i].person.id;
            url = ('https://statsapi.web.nhl.com/api/v1/people/' + playerID + '/stats?stats=statsSingleSeason&season=20222023');
            let info = await axios.get(url);
            data[i].stat = info.data.stats[0].splits[0].stat;
          }
          const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
          const origin = req.headers.origin;
          
          if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
          }
          // res.header('Access-Control-Allow-Origin', 'https://nhl-stats-portal.netlify.app');
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
      }
  });
  _server.get('/player/:id/info', async (req, res) => {
    try {
      let  playersInfo = {};
        var playerID = req.params.id;
        let response = await axios.get(API_URL + "/people/" + playerID);
        const data = response.data.people[0];
          playersInfo.fullName = data.fullName;
          playersInfo.primaryNumber = data.primaryNumber;
          playersInfo.birthDate = data.birthDate;
          playersInfo.birthCity = data.birthCity;
          playersInfo.birthCountry = data.birthCountry;
          playersInfo.height = data.height;
          playersInfo.weight = data.weight;
          playersInfo.currentTeam = data.currentTeam.name;
          playersInfo.primaryPosition = data.primaryPosition.name;
          const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
          const origin = req.headers.origin;
          
          if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
          }
          // res.header('Access-Control-Allow-Origin', 'https://nhl-stats-portal.netlify.app');
        res.send(playersInfo);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
      }
  });

_server.post("/register", async (req, res) => {
  const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  authData.registerUser(req.body).then((msg) => {
    res.status(201).json({ message: msg });
  }).catch((err) => {
    res.status(409).json({ error: err });
  });
});
 
_server.post("/login", async (req, res) => {
  const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  req.body.userAgent = req.get('User-Agent'); 
        authData.checkUser(req.body).then((user) => {


            req.session.user = {
                userName: user.userName, // authenticated user's userName
                email: user.email,// authenticated user's email
                loginHistory: user.loginHistory// authenticated user's loginHistory
            }
            res.status(200).json({ message: "Success" });
        }).catch((err) => {
          res.status(409).json({ error: err });
    });
});

_server.get("/logout", function (req, res) {
  const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  req.session.reset();
  res.status(200).json({ message: "Success" });
});

_server.get("/check-login", (req, res) => {
  const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  if (req.session && req.session.user) {
    // User is logged in
    res.sendStatus(200);
   } 
  else {
    // User is not logged in
    res.sendStatus(204);
  }
});

_server.get("/session", (req, res) => {
  const allowedOrigins = ['https://nhl-stats-portal.netlify.app', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // Retrieve session data from req.session or any other session storage mechanism
  const sessionData = req.session;

  // Return the session data as JSON response
  res.json(sessionData);
});

  authData.initialize().then(()=>{
    _server.listen(8080, () => {
      console.log('Server listening on port 8080');
    });
  });
