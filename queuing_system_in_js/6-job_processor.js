const queue = createQueue({
  redis: {
    createClientFactory: () => createClient(),
  },
});

function sendNotification(phoneNumber, message) {
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );
}

queue.process('push_notification_code', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message);
  done();
});
