const express = require('express');
const axios = require('axios')
const _server = express();

_server.use(express.static('public'));

_server.get('/data', async (req, res) => {
    try {
        const response = await axios.get('https://statsapi.web.nhl.com/api/v1/standings');
        const data = response.data;
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
      }
  });

  _server.listen(process.env.PORT, () => {
    console.log('Server listening on port 8080');
  });