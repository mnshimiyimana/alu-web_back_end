import { createClient } from 'redis';

const redis = createClient();

redis.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});
redis.on('connect', () => console.log('Redis client connected to the server'));

function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    redis.publish('holberton school channel', message);
  }, time);
}

publishMessage('Holberton School is so cool!, 100');
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
