const Factory = require('rosie').Factory;
const faker = require('faker');

const orders = Factory.define('order').attrs({
  customerId: () => {
    return Math.ceil(Math.random() * 10);
  },
  orderId: () => {
    return faker.random.uuid;
  },
  weight: () => {
    return Math.ceil(Math.random() * 5);
  },
});

module.exports = orders;
