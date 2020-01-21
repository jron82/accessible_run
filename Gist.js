const axios = require('axios');
const Report = require( process.cwd() + '/Report');

class Gist {
  constructor(batch, filename, content, report_id) {
    this.gistUrl = 'https://api.github.com/gists';
    this.batch = batch;
    this.filename = filename;
    this.content = content;
    this.report_id = report_id;
  }

  create() {
    axios({
      method: 'post',
      url: this.gistUrl,
      auth: this.getAuth(),
      data: this.getData()
    }).then(r => {
      if (r.status === 201) {
        let report = new Report(this.batch, this.report_id, r.data.id);
        report.send();
        console.log(JSON.stringify(r.data.id))
      }
    }).catch(err => {
      console.log(`Could not save Gist for ${this.filename} of ${this.batch}`);
      console.warn(err)
    });
  }

  getData() {
    let data = JSON.stringify(this.content);
    var fileList = {};
    fileList[this.filename] = {content: data};

    return {
      description: 'Accessibility Report',
      files: fileList,
      public: false
    };

  }

  getAuth() {
    return {
      username: process.env.LIGHTHOUSE_GIST_API_USER,
      password: process.env.LIGHTHOUSE_GIST_API_KEY
    };
  }

  getHeaders() {
    return {
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    };
  }
}

module.exports = Gist;