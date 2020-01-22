const axios = require('axios');

class Report {

  constructor(batch, report_id, gist_id) {
    this.batch = batch;
    this.report_id = report_id;
    this.gist_id = gist_id;
  }

  send() {
    let values = {
      app_id: process.env.ACCESSIBLE_APP_ID,
      batch: this.batch,
      report_id: this.report_id,
      gist_id: this.gist_id
    };

    axios.post(process.env.ACCESSIBLE_WEBHOOK_URL, values).then(r => {
      console.log(r.status);
      console.log(r.data);
    }).catch(err => {
      console.warn(err);
    })
  }
}

module.exports = Report;