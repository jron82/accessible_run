const createLighthouse = require(process.cwd() + '/Lighthouse');
const Gist = require(process.cwd() + '/Gist');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/', (req, res) => {

  if (!req.body) {
    const msg = 'no Pub/Sub message received';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  if (!req.body.message) {
    const msg = 'invalid Pub/Sub message format';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }

  let pubSubMessage = req.body.message;
  let stringifiedData =  Buffer.from(pubSubMessage.data, 'base64').toString().trim();
  let data = JSON.parse(stringifiedData);

  if (undefined === data.report_id || undefined === data.batch || undefined === data.url || undefined === data.filename) {
    console.warn('[Bad Request] ' +  stringifiedData);
    return res.status(400).send('Bad Request');
  }

  let url = data.url;
  let batch = data.batch;
  let filename = data.filename;
  let report_id = data.report_id;
  let options = {logLevel: 'info'};

  Promise.resolve()
      .then(() => createLighthouse(url, options, null))
      .then(({chrome, start}) => {
        return start()
            .then((results) => {
              let gist = new Gist(batch, filename, results.lhr, report_id);
              gist.create();
              return chrome.kill().then(() => {
                return res.status(204).send();
              })
            })
            .catch((err) => {
              return chrome.kill().then(err => {
                console.log(err);
                 return res.status(400).send();
              })
            })
      })
      .catch(err => {
        console.log(err);
         return res.status(400).send();
      });
});


let server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
server.setTimeout(60000);

