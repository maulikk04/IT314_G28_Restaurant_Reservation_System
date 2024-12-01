const EmailVerificationTemplate = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            text-align: center;
        }
        
        .confirm-button {
            background-color: #ffd94f;
            border: none;
            color: #00796b;
            padding: 15px 30px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            border-radius: 12px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color: #800080;">Hello {Username}!</h1>
        
        <p>Thank you for joining <strong>Fork & Feast</strong>!</p>
        
        <p>To start reserving your favorite dining spots and exploring exclusive offers, please confirm your email address.</p>
        
        <a href="{url}" class="confirm-button">Confirm Email</a>
        
        <p>We look forward to helping you discover your next great meal!</p>
        
        <p>If you didn't sign up, please ignore this email—no further action is needed.</p>
        
        <p style="color: #aaa; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>
`;

const ResetPasswordTemplate = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            text-align: center;
        }
        
        .reset-button {
            background-color: #ffd94f;
            border: none;
            color: #00796b;
            padding: 15px 30px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            border-radius: 12px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color: #800080;">Hello {Username}!</h1>
        
        <p>We received a request to reset your password for your <strong>Fork & Feast</strong> account!</p>
        
        <p>To reset your password, please click the button below:</p>
        
        <a href="{url}" class="reset-button">Reset Password</a>
        
        <p>This link will expire in 15 minutes for your security.</p>
        
        <p>If you didn't request this, please ignore this email. Your password won't be changed.</p>
        
        <p style="color: #aaa; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>
`;

const BookingConfirmTemplate = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ffd94f;
            color: #000000;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .content h2 {
            color: #16da5b;
        }
        .details {
            margin: 20px 0;
        }
        .details p {
            margin: 5px 0;
        }
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            color: #888888;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Restaurant Reservation Confirmation</h1>
        </div>
        <div class="content">
            <h2>Thank you for booking with <span id="site-name"><strong>Fork and Feast</strong></span>!</h2>
            <p>Your booking has been successfully confirmed. Here are the details of your reservation:</p>
            <div class="details">
                <p><strong>Restaurant Name:</strong> <span id="restaurant-name">{Restaurant Name}</span></p>
                <p><strong>Date:</strong> <span id="date">{Date}</span></p>
                <p><strong>Time:</strong> <span id="time">{Time}</span></p>
                <p><strong>Number of Tables Booked:</strong></p>
                <ul>
                    <li>Table for 2: <span id="table-for-2">{Count1}</span></li>
                    <li>Table for 4: <span id="table-for-4">{Count2}</span></li>
                    <li>Table for 6: <span id="table-for-6">{Count3}</span></li>
                </ul>
                <p><strong>Booking Code:</strong> <span id="booking-code">{Booking Code}</span></p>
            </div>
            <p>We hope you have a wonderful dining experience at <span id="restaurant-name-again">{Restaurant Name}</span>. If you have any questions or need to make changes to your reservation, please contact us directly.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Fork and Feast. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

const BookingUpdateTemplate = `
<html>
  <!-- Similar structure to BookingConfirmTemplate -->
  <div class="content">
    <h2>Your Reservation Has Been Updated</h2>
    <p>Your booking at {Restaurant Name} has been successfully updated. Here are your new reservation details:</p>
    <div class="details">
      <p><strong>Date:</strong> {Date}</p>
      <p><strong>Time:</strong> {Time}</p>
      <p><strong>Number of Tables:</strong></p>
      <ul>
        <li>Table for 2: {Count1}</li>
        <li>Table for 4: {Count2}</li>
        <li>Table for 6: {Count3}</li>
      </ul>
      <p><strong>Booking Code:</strong> {Booking Code}</p>
    </div>
  </div>
</html>
`;

const BookingCancellationTemplate = `
<html>
  <!-- Similar structure -->
  <div class="content">
    <h2>Your Reservation Has Been Cancelled</h2>
    <p>Your booking at {Restaurant Name} for the following details has been cancelled:</p>
    <div class="details">
      <p><strong>Date:</strong> {Date}</p>
      <p><strong>Time:</strong> {Time}</p>
      <p><strong>Booking Code:</strong> {Booking Code}</p>
    </div>
  </div>
</html>
`;

module.exports = { EmailVerificationTemplate, ResetPasswordTemplate, BookingConfirmTemplate, BookingUpdateTemplate, BookingCancellationTemplate };