require('dotenv').config();
const { Kafka } = require('kafkajs');

let producer = null;
let connectingPromise = null;

const createKafkaClient = () => new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    rejectUnauthorized: false,
  },
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});

const getProducer = async () => {
  if (!producer) {
    producer = createKafkaClient().producer();
  }

  if (!connectingPromise) {
    connectingPromise = (async () => {
      try {
        await producer.connect();
        console.log('🚀 Notification Kafka Producer Connected');
      } catch (error) {
        console.error('❌ Notification Kafka producer connect failed:', error.message);
        producer = null;
        throw error;
      }
    })();
  }

  try {
    await connectingPromise;
  } catch (error) {
    connectingPromise = null;
    throw error;
  }

  return producer;
};

const kafka = createKafkaClient();

module.exports = Object.assign(kafka, { getProducer });