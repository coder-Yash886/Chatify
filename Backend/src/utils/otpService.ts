import otpGenerator from 'otp-generator'
import nodemailer from 'nodemailer'
import twilio from 'twilio'
import {OTP,OTPStore} from '../types'
import { otpConfig,emailConfig,smsConfig } from './config'
import { promises } from 'node:dns'

const otpStore: OTPStore = {}

export const generateOTP = (): string =>{
    return otpGenerator.generate(otpConfig.LENGTH,{
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,

    })
}


export const storeOTP = (identifier:string, otp: string): void => {
    const expiresAt = new Date(Date.now() + otpConfig.EXPIRY_MINUTES*60*1000);
    otpStore[identifier] = {
        code: otp,
        expiresAt,
        attempts: 0,
    }
     console.log(`OTP stored for ${identifier}: ${otp} (expires: ${expiresAt.toLocaleTimeString()})`);

}

export const verifyOTP = (identifier: string, otp:string): boolean =>{
    const storedOTP  = otpStore[identifier];

    if(!storedOTP){
        console.log(`No OTP found for ${identifier}`);
        return false
    }
    if (new Date() > storedOTP.expiresAt) {
    console.log(` OTP expired for ${identifier}`);
    delete otpStore[identifier];
    return false;
  }
  if (storedOTP.attempts >= 3) {
    console.log(` Too many attempts for ${identifier}`);
    delete otpStore[identifier];
    return false;
  }
  storedOTP.attempts++;

  if (storedOTP.code === otp) {
    console.log(` OTP verified for ${identifier}`);
    delete otpStore[identifier];
    return true;
  }
  console.log(` Invalid OTP for ${identifier}. Attempt ${storedOTP.attempts}/3`);
  return false;

}

export const sendOTPEmail = async (email: string, otp:string): Promise<boolean> =>{
    try{
        const transporter = nodemailer.createTransport({
      service: emailConfig.SERVICE,
      auth: {
        user: emailConfig.USER,
        pass: emailConfig.PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Chat App" <${emailConfig.USER}>`,
      to: email,
      subject: 'Your OTP Code - Chatify',
      text: `Your verification code is: ${otp}\n\nThis code will expire in ${otpConfig.EXPIRY_MINUTES} minutes.\n\nIf you didn't request this code, please ignore this email.`,
    };
    await transporter.sendMail(mailOptions);
    console.log(` OTP email sent to ${email}`);
    return true;

  }catch (error) {
    console.error(' Error sending OTP email:', error);
    return false;
  }

}

export const sendOTPSMS = async (phone: string, otp: string): Promise<boolean> => {
  try {
    if (!smsConfig.TWILIO_ACCOUNT_SID || !smsConfig.TWILIO_AUTH_TOKEN) {
      console.error(' Twilio credentials not configured');
      return false;
    }

    const client = twilio(smsConfig.TWILIO_ACCOUNT_SID, smsConfig.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body: `Your Chat App verification code is: ${otp}. Valid for ${otpConfig.EXPIRY_MINUTES} minutes. Do not share this code.`,
      from: smsConfig.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log(`📱 OTP SMS sent to ${phone}`);
    return true;
  } catch (error) {
    console.error(' Error sending OTP SMS:', error);
    return false;
  }
};

setInterval(()=>{
    const now = new Date();
    let cleanedCount = 0;

    Object.keys(otpStore).forEach((identifier) =>{
        if(now > otpStore[identifier].expiresAt){
            delete otpStore[identifier];
            cleanedCount++;
        }
    })
    if(cleanedCount>0){
        console.log(`Clenaed ${cleanedCount} expired OTP(s)`)
    }
},10*60*1000);
