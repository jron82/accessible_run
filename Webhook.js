const axios = require('axios');

class Webhook {

  constructor(batch, filename, gistId) {
    this.batch = batch;
    this.filename = filename;
    this.gistId = gistId;
    this.url = process.env.ACCESSIBLE_WEBHOOK_URL;
    this.app_id = process.env.ACCESSIBLE_APP_ID;
  }

  post() {

    let params = {
      batch: this.batch,
      filename: this.filename,
      gist_id: this.gistId,
      app_id: this.app_id
    };

     axios.post(this.url, params).then(r => {
       console.log(r.data);
       console.log(`Saved ${this.filename} gist of ${this.batch}`);
     }).catch(err => {
       console.warn(err.response.data);
     });
  }

}

module.exports = Webhook;