const EmailService = require('./emailService');
const SmsService = require('./smsService');

class NotificationFactory {
  static getService(channel) {
    switch (channel.toUpperCase()) {
      case 'EMAIL':
        return new EmailService();
      case 'SMS':
        return new SmsService();
      default:
        throw new Error(`❌ Unsupported channel type: ${channel}`);
    }
  }
}

module.exports = NotificationFactory;