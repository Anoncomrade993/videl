module.exports = {
	deletUser: (data = {}) => `
	<!DOCTYPE html>
	    <html lang="en">
	
	    <head>
	    	<meta charset="UTF-8">
	    	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	    	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	    	<title>Account Deletion Scheduled</title>
	    	<style>
	    		@import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");
	
	    		body {
	    			font-family: "Poppins", sans-serif;
	    			line-height: 1.6;
	    			color: #333;
	    			max-width: 600px;
	    			margin: 0 auto;
	    			padding: 20px;
	    		}
	
	    		.container {
	    			background-color: #f9f9f9;
	    			padding: 20px;
	    		}
	
	    		.button {
	    			display: inline-block;
	    			padding: 10px 20px;
	    			background-color: #e74c3c;
	    			color: white;
	    			text-decoration: none;
	    			border-radius: 5px;
	    		}
	
	    		.footer {
	    			margin-top: 30px;
	    			font-size: 0.9em;
	    			color: #888;
	    			text-align: center;
	    		}
	
	    		.social-icons a {
	    			text-decoration: none;
	    			margin: 0 5px;
	    			color: #000000;
	    			font-size: 18px
	    		}
	    	</style>
	    </head>
	
	    <body>
	    	<div class="container">
	    		<h2>Account Deletion Scheduled</h2>
	    		<p>Hello 👋,${data.username}</p>
	    		<p>We've received your request to delete your account. Your account is scheduled for deletion in 14 days.</p>
	    		<p>If you've changed your mind and want to keep your account, please click the button below:</p>
	    		<p>${data.token}</p>
	    		<p> <a class='button' href='${data.url}'>Cancel Schedule</a></p>
	    		<p>If you take no action, your account and all associated data will be permanently deleted on ${data.date}.</p>
	    		<p>We're sorry to see you go. If you have any feedback, please let us know.</p>
	    		<p>Best regards,<br>Videl Team.</p>
	
	    		<div class="footer">
	    			<div class="social-icons">
	    				<a href="${data.twitter}"><i class="fa fa-twitter"></i></a>
	    				<a href="${data.telegram}"><i class="fa fa-telegram"></i></a>
	    			</div>
	    			<p><a href="${data.contact}" style="color: #888;">Contact us</a> | <a href="${data.privacy}" style="color: #888;">Privacy Policy</a></p>
	    			<p>Videl</p>
	    		</div>
	    	</div>
	    </body>
	
	    </html>`,
	changePassword: (data = {}) => `
	<!DOCTYPE html>
	<html lang="en">
	
	<head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	  <title>Change Password</title>
	  <style>
	   @import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");
	    body {
	      font-family: "Poppins", sans-serif;
	      line-height: 1.6;
	      color: #333;
	      max-width: 600px;
	      margin: 0 auto;
	      padding: 20px;
	    }
	
	    .container {
	      background-color: #fff;
	      border-radius: 5px;
	      padding: 20px;
	      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	    }
	
	    
	
	    .otp {
	      font-size: 1em;
	      font-weight: bold;
	      text-align: center;
	      letter-spacing: 5px;
	      color: #3498db;
	      margin: 20px 0;
	      padding: 10px;
	      background-color: #ebf5fb;
	      border-radius: 5px;
	    }
	
	    .warning {
	      font-size: 0.9em;
	      color: #e74c3c;
	    }
	
	    .footer {
	      margin-top: 30px;
	      font-size: 0.9em;
	      color: #888;
	      text-align: center;
	    }
	
	    .social-icons a {
	      text-decoration: none;
	      margin: 0 5px;
	      color: #000000;
	      font-size: 18px
	    }
	
	    h2 {
	      text-align: center
	    }
	  </style>
	</head>
	
	<body>
	  <div class="container">
	    <h2>Password Change</h2>
	    <p>You've requested to change your password . Use this OTP to confirm the change:</p>
	    <div class="otp">${data.token}</div>
	    <p>This OTP will expire in 5 minutes.</p>
	    <p class="warning">If you didn't request this change, please contact our support team immediately.</p>
	    <p>Thank you,<br>Videl Team.</p>
	    <div class="footer">
	
	      <div class="social-icons">
	        <a href="${data.twitter}"><i class="fa fa-twitter"></i></a>
	        <a href="${data.telegram}"><i class="fa fa-telegram"></i></a>
	    </div>
	      <p><a href="${data.contact}" style="color: #888;">Contact us</a> | <a href="${data.privacy}" style="color: #888;">Privacy Policy</a></p>
	      <p>Videl.</p>
	    </div>
	  </div>
	</body>
	
	</html>`,
	forgotPassword: (data = {}) => `
	<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<title>Change Password</title>
		<style>
			@import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");
	
			body {
				font-family: "Poppins", sans-serif;
				line-height: 1.6;
				color: #333;
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
			}
	
			.container {
				background-color: #fff;
				border-radius: 5px;
				padding: 20px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			}
	
	
			.token {
				font-size: 1em;
				font-weight: bold;
				text-align: center;
				letter-spacing: 5px;
				color: #3498db;
				margin: 20px 0;
				padding: 10px;
				background-color: #ebf5fb;
				border-radius: 5px;
			}
	
			.warning {
				font-size: 0.9em;
				color: #e74c3c;
			}
	
			.footer {
				margin-top: 30px;
				font-size: 0.9em;
				color: #888;
				text-align: center;
			}
	
			.social-icons a {
				text-decoration: none;
				margin: 0 5px;
				color: #000000;
				font-size: 18px
			}
	
			h2 {
				text-align: center
			}
		</style>
	</head>
	
	<body>
		<div class="container">
			<h2>Password Reset</h2>
			<p>Hello 👋,${data.username}</p>
			<p>You've requested to reset your password. Use this Token to confirm the reset:</p>
			<div class="token">${data.token}</div>
			<p>This Token will expire in 5 minutes.</p>
			<p class="warning">If you didn't request this change, please contact our support team immediately.</p>
			<p>Thank you,<br>Videl Team.</p>
			<div class="footer">
	
				<div class="social-icons">
					<a href="${data.twitter}"><i class="fa fa-twitter"></i></a>
					<a href="${data.telegram}"><i class="fa fa-telegram"></i></a>
				</div>
				<p><a href="${data.contact}" style="color: #888;">Contact us</a> | <a href="${data.privacy}" style="color: #888;">Privacy Policy</a></p>
				<p>Videl.</p>
			</div>
		</div>
	</body>
	
	</html>`,
	changeEmail: (data = {}) => `
	<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<title>Email Change</title>
		<style>
			@import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");
	
			body {
				font-family: "Poppins", sans-serif;
				line-height: 1.6;
				color: #333;
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
			}
	
			.container {
				background-color: #fff;
				border-radius: 5px;
				padding: 20px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			}
	
	
			.token {
				font-size: 1em;
				font-weight: bold;
				text-align: center;
				letter-spacing: 5px;
				color: #3498db;
				margin: 20px 0;
				padding: 10px;
				background-color: #ebf5fb;
				border-radius: 5px;
			}
	
			.warning {
				font-size: 0.9em;
				color: #e74c3c;
			}
	
			.footer {
				margin-top: 30px;
				font-size: 0.9em;
				color: #888;
				text-align: center;
			}
	
			.social-icons a {
				text-decoration: none;
				margin: 0 5px;
				color: #000000;
				font-size: 18px
			}
	
			h2 {
				text-align: center
			}
		</style>
	</head>
	
	<body>
		<div class="container">
	
			<h2>Password Change</h2>
			<p>You've requested to change your email address. Use this Token to confirm the change:</p>
			<div class="token">${data.token}</div>
			<p>This Token will expire in 5 minutes.</p>
			<p class="warning">If you didn't request this change, please contact our support team immediately.</p>
			<p>Thank you,<br>Videl Team.</p>
			<div class="footer">
				<div class="social-icons">
					<a href="${data.twitter}"><i class="fa fa-twitter"></i></a>
					<a href="${data.telegram}"><i class="fa fa-telegram"></i></a>
				</div>
				<p><a href="${data.contact}" style="color: #888;">Contact us</a> | <a href="${data.privacy}" style="color: #888;">Privacy Policy</a></p>
				<p>Videl.</p>
			</div>
		</div>
	</body>
	
	</html>`,
	verifyEmail: (data = {}) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <title>Email Verification</title>
    <style>
        @import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");

        body {
            font-family: "Poppins", sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .container {
            background-color: #fff;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .verification-link {
            font-size: 1em;
            font-weight: bold;
            text-align: center;
            color: #FFFFFF;
            margin: 20px 0;
            padding: 10px;
            background-color: #FFA500;
            border-radius: 5px;
            display: inline-block;
            text-decoration: none;
        }

        .warning {
            font-size: 0.9em;
            color: #e74c3c;
        }

        .footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #888;
            text-align: center;
        }

        .social-icons a {
            text-decoration: none;
            margin: 0 5px;
            color: #000000;
            font-size: 18px;
        }

        h2 {
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Email Verification</h2>
        <p>Hello 👋, ${data.username}</p>
        <p>Thank you for signing up on Videl. Please click the link below to verify your email address:</p>
        <a href="${data.verificationLink}" class="verification-link">Verify My Email</a>
        <p>This link will expire in 5 minutes.</p>
        <p class="warning">If you didn't request this change, please contact our support team immediately.</p>
        <p>Thank you,<br>Videl Team.</p>
        <div class="footer">
            <div class="social-icons">
                <a href="${data.twitter}"><i class="fa fa-twitter"></i></a>
                <a href="${data.telegram}"><i class="fa fa-telegram"></i></a>
            </div>
            <p><a href="${data.contact}" style="color: #888;">Contact us</a> | <a href="${data.privacy}" style="color: #888;">Privacy Policy</a></p>
            <p>Videl.</p>
        </div>
    </div>
</body>

</html>`
}