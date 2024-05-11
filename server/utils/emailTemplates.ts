export const verifyEmailHTML = (
  name: string,
  verificationLink: string,
  verificationCode: string
) =>
  `
  <div style="max-width: 600px; margin: auto; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgb(104, 182, 255);">
    <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
      <img src="" alt="SoYummy Logo" style="display: block; margin: auto auto 20px;max-width: 50%;">
      <p style="font-size: 18px; margin-bottom: 20px; text-align: center; color: #4b5563; font-weight: bold;">Welcome to SoYummy, ${name}!</p>
      <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #4b5563;">Please click the button below to verify your email address and activate your account:</p>
      <div style="text-align: center; margin-bottom: 20px;">
        <a href="${verificationLink}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block; font-size: 16px; font-weight: bold;">Verify Email Address</a>
     </div>
      <p style="font-size: 14px; margin-bottom: 20px; text-align: center; color: #4b5563;">Please note that the device you are using for this verification process will be set as your primary device.</p>
      <p style="font-size: 14px; margin-bottom: 20px; text-align: center; color: #6b7280;">The link will expire in 30 minutes.</p>
      <p style="font-size: 16px; margin-bottom: 15px; text-align: center; color: #3b82f6; font-weight: bold;">Your verification code is: <span style="color: #000000;">${verificationCode}</span></p>
      <p style="font-size: 14px; margin-bottom: 20px; text-align: center; color: #4b5563;">If you did not create an account, please ignore this email.</p>
     </div>
  </div>`;

export const verifyLoginHTML = (
  name: string,
  verificationLink: string,
  blockLink: string
) => `
    <div style="background-color: #F4F4F4; padding: 20px;">
      <div style="background-color: #fff; padding: 20px; border-radius: 10px;">
        <h1 style="color: black; font-size: 24px; margin-bottom: 20px;">New login attempt detected</h1>
        <p>Dear ${name},</p>
        <ul style="list-style: none; padding-left: 0;">
           </ul>
        <p>If this was you, please click the button below to verify your login:</p>
        <div style="text-align: center;">
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #1da1f2; color: #fff; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">Verify Login</a>
        </div>
        <p>If you believe this was an unauthorized attempt, please click the button below to block this login:</p>
        <div style="text-align: center;">
          <a href="${blockLink}" style="display: inline-block; padding: 10px 20px; background-color: #E0245E; color: #fff; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">Block Login</a>
        </div>
        <p>Please verify that this login was authorized. If you have any questions or concerns, please contact our customer support team.</p>
      </div>
    </div>
  `;
