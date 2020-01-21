const {PubSub} = require('@google-cloud/pubsub');

class Report {

  constructor(batch, report_id , gist_id) {
    this.batch = batch;
    this.report_id = report_id;
    this.gist_id = gist_id;
  }

  send() {
    let projectId = process.env.PROJECT_ID;
    let topicName = process.env.TOPIC_NAME;

    const pubsub = new PubSub({projectId});
    const topic = pubsub.topic(topicName);

    let values = {
      batch: this.batch,
      report_id: this.batch,
      gist_id: this.gist_id
    };

    let json = JSON.stringify(values);
    const data = Buffer.from(json);

    topic.publish(data).then((messageId) => {
      console.log(messageId);
    }).catch(err => {
      console.warn(err);
    });
  }
}

module.exports = Report;