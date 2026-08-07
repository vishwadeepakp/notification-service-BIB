class SmsService {
  async send(data) {
    // यहाँ Twilio / Fast2SMS का कोड आएगा
    console.log(`📱 [SMS SENT] Sending OTP ${data.otp} to Mobile: ${data.recipient}`);
    return true;
  }
}

module.exports = SmsService;