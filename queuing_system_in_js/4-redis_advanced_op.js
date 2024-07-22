import { createClient, print } from 'redis';

const redis = createClient();

redis.hset('HolbertonSchools', 'Portland', '50', (err, reply) => {
  print(`Reply: ${reply}`);
});

redis.hset('HolbertonSchools', 'Seattle', '80', (err, reply) => {
  print(`Reply: ${reply}`);
});

redis.hset('HolbertonSchools', 'New York', '20', (err, reply) => {
  print(`Reply: ${reply}`);
});

redis.hset('HolbertonSchools', 'Bogota', '20', (err, reply) => {
  print(`Reply: ${reply}`);
});

redis.hset('HolbertonSchools', 'Cali', 40, (err, reply) => {
  print(`Reply: ${reply}`);
});

redis.hset('HolbertonSchools', 'Paris', 2, (err, reply) => {
  print(`Reply: ${reply}`);
});

redis.hgetall('HolbertonSchools', (err, result) => {
  console.log(result);
});
