const { createClient } = require('redis');

const client = createClient();
client.on('error', (error) => {
  console.error('Redis Client Error:', error.message);
});
client.on('connnect', () => console.log('Connected to Redis Server'));

export function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (error, reply) => {
    if (error) {
      console.error(error);
    }
    print(`Reply ${reply}`);
  });
}

export function displaySchoolValue(schoolName) {
  client.get(schoolName, (error, reply) => {
    if (error) console.error(error);
    print(`School Value: ${reply}`);
  });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
