import { createQueue } from 'kue';
import { createClient } from 'redis';

const queue = createQueue({
  redis: {
    createClientFactory: () => createClient(),
  },
});

const data = {
  phoneNumber: '0173943892',
  message: 'This is the code to verify your account',
};

const job = queue.create('Push notification code,', data);
job.on('enqueue', () => console.log(`Notification job created: ${job.id}`));
job.on('complete', () => console.log('Notification job completed'));
job.on('failed', () => console.log('Notification job failed'));
job.save();
