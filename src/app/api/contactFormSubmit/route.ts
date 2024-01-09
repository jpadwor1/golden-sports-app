import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request, response: Response) {
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;

  const postData = await request.json();
  const { gRecaptchaToken, message, email } = postData;

  console.log(
    'gRecaptchaToken,email, message:',
    gRecaptchaToken?.slice(0, 10) + '...',
    email,
    message
  );

  let res: any;
  const formData = `secret=${secretKey}&response=${gRecaptchaToken}`;
  try {
    res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  } catch (e) {
    console.log('recaptcha error:', e);
  }

  if (res && res.data?.success && res.data?.score > 0.5) {
   
    return NextResponse.json({
      success: true,
      email: email,
      message: message,
    });
  } else {
    console.log('fail: res.data?.score:', res.data?.score);
    return NextResponse.json({ success: false, score: res.data?.score });
  }
}
