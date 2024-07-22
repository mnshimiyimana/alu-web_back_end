import { createClient, print } from 'redis';
import { promisify } from 'util';

const client = createClient();
client.on('error', (err) =>
  console.log('Redis client not connected to the server', err.message)
);
client.on('connect', () => console.log('Redis client connected to the server'));

export async function setNewSchool(schoolName, value) {
  const setAsync = promisify(client.set).bind(client);
  const reply = await setAsync(schoolName, value);
  print(`Reply: ${reply}`);
}

export async function displaySchoolValue(schoolName) {
  const getAsync = promisify(client.get).bind(client);
  const value = await getAsync(schoolName);
  print(value);
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
