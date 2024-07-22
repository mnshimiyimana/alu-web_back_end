const { createClient } = require('redis');

const createCustomClient = async () => {
  const client = await createClient()
    .on('error', (error) => {
      console.error(error);
    })
    .on('connect', () => {
      console.log('Connected to Redis Server');
    });
  return client;
};

createCustomClient();
