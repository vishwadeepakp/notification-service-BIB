const kafka = require('./kafkaClient');
const NotificationFactory = require('./services/notificationFactory');

const consumer = kafka.consumer({ groupId: 'otp-notification-group' });

const startService = async () => {
  try {
    await consumer.connect();
    console.log("🚀 Notification Service Connected to Kafka!");

    // 'send-otp' टॉपिक को सब्सक्राइब करें
    await consumer.subscribe({ topic: 'send-otp', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = JSON.parse(message.value.toString());
          // payload का सैंपल: { channel: 'EMAIL', recipient: 'test@gmail.com', otp: '4821' }

          console.log(`\n📩 [New OTP Request Received] Channel: ${payload.channel}`);

          // 1. Factory से सही Service निकालो
          const notificationProvider = NotificationFactory.getService(payload.channel);

          // 2. Notification भेजो
          await notificationProvider.send(payload);

        } catch (err) {
          console.error("❌ Processing Error:", err.message);
        }
      },
    });

  } catch (error) {
    console.error("❌ Notification Service Failed to Start:", error);
  }
};

module.exports = { startService };