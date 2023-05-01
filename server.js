const express = require('express');
const axios = require('axios')
const _server = express();

_server.use(express.static('public'));

  _server.get('/standings', async (req, res) => {
    try {
        const response = await axios.get('https://statsapi.web.nhl.com/api/v1/standings');
        const data = response.data;
        res.header('Access-Control-Allow-Origin', 'https://nhl-stats-portal.netlify.app');
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
      }
  });
  _server.get('/schedule', async (req, res) => {
    try {
        const response = await axios.get('https://statsapi.web.nhl.com/api/v1/schedule');
        const data = response.data;
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
      }
  });
  _server.get('/schedule/:date', async (req, res) => {
  try {
      const response = await axios.get('https://statsapi.web.nhl.com/api/v1/schedule?date=' + req.params.date);
      const data = response.data;
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving data');
    }
  });

_server.listen(process.env.PORT || 8080, () => {
    console.log('Server listening on port ' + process.env.PORT);
});
