const createLighthouse = require(process.cwd() + '/Lighthouse');
const Gist = require(process.cwd() + '/Gist');
const express = require('express');
const app = express();
const port = process.env.PORT;

console.log('pre setup');

app.get('/', (req, res) => {

  if (undefined === req.query.url ||
      undefined === req.query.batch ||
      undefined === req.query.filename) {
    res.status(400).send('Bad Request');
    console.warn('[Bad Request] ' + JSON.stringify(req.query));
    process.exit(1);
  }

  let url = req.query.url;
  let batch = req.query.batch;
  let filename = req.query.filename;
  let request = {url: url, batch: batch, filename: filename}
  let success = JSON.stringify({message: 'Processing request', request: request});
  let failure = JSON.stringify({message: 'Request failed'});
  let options = {logLevel: 'info'};

  Promise.resolve()
      .then(() => createLighthouse(url, options, null))
      .then(({chrome, start}) => {
        return start()
            .then((results) => {
              let gist = new Gist(batch, filename, results.lhr);
              gist.create();
              return chrome.kill().then(() => {
                return res.status(200).send(success)
              })
            })
            .catch((err) => {
              return chrome.kill().then(err => {
                console.log(err);
                return res.status(400).send(failure)
              })
            })
      })
      .catch(err => {
        console.log(err);
        return res.send(failure);
      });
});


let server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
server.setTimeout(60000);

