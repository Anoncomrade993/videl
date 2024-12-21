module.exports = {

	deleteUser: (data = {}) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
    <link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <title>Account Deletion Scheduled - Videl</title>
    <style>
        body {
            background-color: #F9FAFB;
            font-family: 'Inter', sans-serif;
            color: #1F2937;
            line-height: 1.625;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 32px 16px;
        }

        .card {
            background-color: #FFFFFF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            padding: 24px;
        }

        .text-center {
            text-align: center;
        }

        .text-2xl {
            font-size: 1.5rem;
            font-weight: 700;
            color: #F97316;
        }

        .mb-4 {
            margin-bottom: 16px;
        }

        .space-y-4 > * + * {
            margin-top: 16px;
        }

        .bg-yellow-50 {
            background-color: #FBEBC8;
            border-left: 4px solid #FBBF24;
            padding: 16px;
            margin: 16px 0;
        }

        .bg-orange-500 {
            background-color: #F97316;
            color: white;
            padding: 16px;
            text-align: center;
            border-radius: 8px;
            display: inline-block;
            transition: background-color 0.3s;
        }

        .bg-orange-500:hover {
            background-color: #EA580C;
        }

        .text-sm {
            font-size: 0.875rem;
        }

        .text-gray-500 {
            color: #6B7280;
        }

        .text-yellow-700 {
            color: #B45309;
        }

        .font-bold {
            font-weight: 700;
        }

        .mt-8 {
            margin-top: 32px;
        }

        .border-t {
            border-top: 1px solid #E5E7EB;
            padding-top: 16px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="card">
            <div class="text-center mb-6">
                <h2 class="text-2xl">Account Deletion Scheduled</h2>
            </div>

            <div class="space-y-4">
                <p>Hello 👋, <span class="font-semibold">${data.username}</span></p>
                <p>We've received your request to delete your account. Your account is scheduled for deletion in 14 days — ${data.date}.</p>

                <div class="bg-yellow-50">
                    <p class="text-yellow-700">If you've changed your mind and want to keep your account, please click the button below:</p>
                </div>

                <div class="text-center my-6">
                    <a href='${data.tokenLink}' class='bg-orange-500'>
                        Cancel Account Deletion
                    </a>
                </div>

                <p>If you take no action, your account and all associated data will be permanently deleted on ${data.date}.</p>
                <p>We're sorry to see you go. If you have any feedback, please let us know.</p>
                <p>Best regards,<br><span class="font-bold text-orange-600">Videl Team</span></p>
            </div>

            <div class="mt-8 border-t text-center text-sm text-gray-500">
                <p>
                    <a href="${data.contact}" class="hover:text-orange-600">Contact us</a> |
                    <a href="${data.privacy}" class="hover:text-orange-600">Privacy Policy</a>
                </p>
                <p class="mt-2 text-xs">© 2024 Videl. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>

</html>

	`,
	emailVerification: (data = {}) => `
	
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
    <link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <title>Verify Your Email - Videl</title>
    <style>
        body { background-color: #F9FAFB; font-family: 'Inter', sans-serif; color: #1F2937; line-height: 1.625; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
        .card { background-color: #FFFFFF; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 12px; padding: 24px; }
        .text-center { text-align: center; }
        .text-2xl { font-size: 1.5rem; font-weight: 700; color: #F97316; }
        .bg-orange-500 { background-color: #F97316; color: white; padding: 16px; text-align: center; border-radius: 8px; display: inline-block; transition: background-color 0.3s; }
        .bg-orange-500:hover { background-color: #EA580C; }
        .bg-gray-100 { background-color: #F3F4F6; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center; }
        .text-sm { font-size: 0.875rem; }
        .text-gray-500 { color: #6B7280; }
        .text-gray-600 { color: #4B5563; }
        .font-bold { font-weight: 700; }
        .mt-8 { margin-top: 32px; }
        .border-t { border-top: 1px solid #E5E7EB; padding-top: 16px; }
    </style>
</head>

<body>
    <div class="container">
        <div class="card">
            <div class="text-center mb-6">
                <h2 class="text-2xl">Verify Your Email</h2>
                <p class="text-gray-600">Complete Your Account Setup</p>
            </div>

            <div>
                <p>Hello 👋, ${data.username}</p>
                <p>Welcome to Videl! To complete your account setup, please verify your email address.</p>

                <a href="${data.tokenLink}" class="bg-orange-500">Verify Email Address</a>

                <div class="bg-gray-100">
                    <span id="verificationLink" class="text-sm">${data.tokenLink}</span>
                    <button onclick="copyLink()" style="background-color: #FBBF24; color: #7C2D12; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Copy Link</button>
                </div>

                <p class="text-sm text-gray-600 mt-2">This verification link will expire in 5 minutes</p>

                <div style="background-color: #D1FAE5; border-left: 4px solid #4ADE80; padding: 16px;">
                    <p style="color: #065F46; font-size: 0.875rem;">✅ Verifying your email helps us keep your account secure.</p>
                </div>

                <div style="background-color: #FEF9C3; border-left: 4px solid #FBBF24; padding: 16px;">
                    <p style="color: #B45309; font-size: 0.875rem;">⚠️ If you didn't create this account, please ignore this email.</p>
                </div>

                <p>Welcome aboard,<br><span class="font-bold" style="color: #F97316;">Videl Team</span></p>
            </div>

            <div class="mt-8 border-t text-center text-sm text-gray-500">
                <p>
                    <a href="${data.contact}" style="color: #6B7280; text-decoration: none;">Contact us</a> |
                    <a href="${data.privacy}" style="color: #6B7280; text-decoration: none;">Privacy Policy</a>
                </p>
                <p class="mt-2 text-xs">© <span id="currentYear"></span> Videl. All rights reserved.</p>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        function copyLink() {
            const link = document.getElementById('verificationLink');
            const textArea = document.createElement('textarea');
            textArea.value = link.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        }
    </script>
</body>

</html>
`,
	changePassword: (data = {}) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
    <link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <title>Password Change Confirmation - Videl</title>
    <style>
        body { background-color: #F9FAFB; font-family: 'Poppins', sans-serif; color: #1F2937; line-height: 1.625; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
        .card { background-color: #FFFFFF; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 12px; padding: 24px; }
        .text-center { text-align: center; }
        .text-2xl { font-size: 1.5rem; font-weight: 700; color: #F97316; }
        .bg-orange-500 { background-color: #F97316; color: white; padding: 16px; text-align: center; border-radius: 8px; display: inline-block; transition: background-color 0.3s; }
        .bg-orange-500:hover { background-color: #EA580C; }
        .bg-gray-100 { background-color: #F3F4F6; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center; }
        .text-sm { font-size: 0.875rem; }
        .text-gray-500 { color: #6B7280; }
        .text-gray-600 { color: #4B5563; }
        .font-bold { font-weight: 700; }
        .mt-8 { margin-top: 32px; }
        .border-t { border-top: 1px solid #E5E7EB; padding-top: 16px; }
    </style>
</head>

<body>
    <div class="container">
        <div class="card">
            <div class="text-center mb-6">
                <h2 class="text-2xl">Password Change</h2>
            </div>

            <div>
                <p>Hello 👋, ${data.username}</p>
                <p>You've requested to change your password. Use the button or link below to confirm the change:</p>

                <a href="${data.tokenLink}" class="bg-orange-500">Confirm Password Change</a>

                <div class="bg-gray-100">
                    <span id="tokenLink" class="text-sm">${data.tokenLink}</span>
                    <button onclick="copyToken()" style="background-color: #FBBF24; color: #7C2D12; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Copy Link</button>
                </div>

                <p class="text-sm text-gray-600 mt-2">This token will expire in 5 minutes</p>

                <div style="background-color: #FEF9C3; border-left: 4px solid #FBBF24; padding: 16px;">
                    <p style="color: #B45309; font-size: 0.875rem;">⚠️ If you didn't request this change, please contact our support team immediately.</p>
                </div>

                <p>Thank you,<br><span class="font-bold" style="color: #F97316;">Videl Team</span></p>
            </div>

            <div class="mt-8 border-t text-center text-sm text-gray-500">
                <p>
                    <a href="${data.contact}" style="color: #6B7280; text-decoration: none;">Contact us</a> |
                    <a href="${data.privacy}" style="color: #6B7280; text-decoration: none;">Privacy Policy</a>
                </p>
                <p class="mt-2 text-xs">© <span id="currentYear"></span> Videl. All rights reserved.</p>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        function copyToken() {
            const tokenLink = document.getElementById('tokenLink');
            const textArea = document.createElement('textarea');
            textArea.value = tokenLink.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        }
    </script>
</body>

</html>
`,
	changeEmail: (data = {}) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
    <link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <title>Email Change Confirmation - Videl</title>
    <style>
        body { background-color: #F9FAFB; font-family: 'Inter', sans-serif; color: #1F2937; line-height: 1.625; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
        .card { background-color: #FFFFFF; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 12px; padding: 24px; }
        .text-center { text-align: center; }
        .text-2xl { font-size: 1.5rem; font-weight: 700; color: #F97316; }
        .bg-orange-500 { background-color: #F97316; color: white; padding: 16px; text-align: center; border-radius: 8px; display: inline-block; transition: background-color 0.3s; }
        .bg-orange-500:hover { background-color: #EA580C; }
        .bg-gray-100 { background-color: #F3F4F6; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center; }
        .text-sm { font-size: 0.875rem; }
        .text-gray-500 { color: #6B7280; }
        .text-gray-600 { color: #4B5563; }
        .font-bold { font-weight: 700; }
        .mt-8 { margin-top: 32px; }
        .border-t { border-top: 1px solid #E5E7EB; padding-top: 16px; }
    </style>
</head>

<body>
    <div class="container">
        <div class="card">
            <div class="text-center mb-6">
                <h2 class="text-2xl">Email Change Request</h2>
            </div>

            <div>
                <p>Hello 👋, ${data.username}</p>
                <p>You've requested to change your email address.</p>

                <a href="${data.tokenLink}" class="bg-orange-500">Confirm Email Change</a>

                <div class="bg-gray-100">
                    <span id="confirmationLink" class="text-sm">${data.tokenLink}</span>
                    <button onclick="copyLink()" style="background-color: #FBBF24; color: #7C2D12; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Copy Link</button>
                </div>

                <p class="text-sm text-gray-600 mt-2">This confirmation link will expire in 5 minutes</p>

                <div style="background-color: #FEF9C3; border-left: 4px solid #FBBF24; padding: 16px;">
                    <p style="color: #B45309; font-size: 0.875rem;">⚠️ If you didn't request this change, please contact our support team immediately.</p>
                </div>

                <div style="background-color: #BFDBFE; border-left: 4px solid #60A5FA; padding: 16px;">
                    <p style="color: #1D4ED8; font-size: 0.875rem;">💡 Tip: Always verify the email address before confirming the change.</p>
                </div>

                <p>Best regards,<br><span class="font-bold" style="color: #F97316;">Videl Team</span></p>
            </div>

            <div class="mt-8 border-t text-center text-sm text-gray-500">
                <p>
                    <a href="${data.contact}" style="color: #6B7280; text-decoration: none;">Contact us</a> |
                    <a href="${data.privacy}" style="color: #6B7280; text-decoration: none;">Privacy Policy</a>
                </p>
                <p class="mt-2 text-xs">© <span id="currentYear"></span> Videl. All rights reserved.</p>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        function copyLink() {
            const link = document.getElementById('confirmationLink');
            const textArea = document.createElement('textarea');
            textArea.value = link.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        }
    </script>
</body>

</html>
`,
	forgottenPassword: (data = {}) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
    <link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <title>Reset Your Password - Videl</title>
    <style>
        body { background-color: #F9FAFB; font-family: 'Inter', sans-serif; color: #1F2937; line-height: 1.625; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
        .card { background-color: #FFFFFF; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); border-radius: 12px; padding: 24px; }
        .text-center { text-align: center; }
        .text-2xl { font-size: 1.5rem; font-weight: 700; color: #F97316; }
        .bg-orange-500 { background-color: #F97316; color: white; padding: 16px; text-align: center; border-radius: 8px; display: inline-block; transition: background-color 0.3s; }
        .bg-orange-500:hover { background-color: #EA580C; }
        .bg-gray-100 { background-color: #F3F4F6; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; align-items: center; }
        .text-sm { font-size: 0.875rem; }
        .text-gray-500 { color: #6B7280; }
        .text-gray-600 { color: #4B5563; }
        .font-bold { font-weight: 700; }
        .mt-8 { margin-top: 32px; }
        .border-t { border-top: 1px solid #E5E7EB; padding-top: 16px; }
    </style>
</head>

<body>
    <div class="container">
        <div class="card">
            <div class="text-center mb-6">
                <h2 class="text-2xl">Reset Your Password</h2>
            </div>

            <div>
                <p>Hello 👋, ${data.username}</p>
                <p>We received a request to reset your password. Click the button below to set a new password:</p>

                <a href="${data.tokenLink}" class="bg-orange-500">Reset Password</a>

                <div class="bg-gray-100">
                    <span id="resetLink" class="text-sm">${data.tokenLink}</span>
                    <button onclick="copyLink()" style="background-color: #FBBF24; color: #7C2D12; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Copy Link</button>
                </div>

                <p class="text-sm text-gray-600 mt-2">This link will expire in 5 minutes</p>

                <div style="background-color: #D1FAE5; border-left: 4px solid #4ADE80; padding: 16px;">
                    <p style="color: #065F46; font-size: 0.875rem;">✅ If you did not request a password reset, please ignore this email.</p>
                </div>

                <p>Thank you,<br><span class="font-bold" style="color: #F97316;">Videl Team</span></p>
            </div>

            <div class="mt-8 border-t text-center text-sm text-gray-500">
                <p>
                    <a href="${data.contact}" style="color: #6B7280; text-decoration: none;">Contact us</a> |
                    <a href="${data.privacy}" style="color: #6B7280; text-decoration: none;">Privacy Policy</a>
                </p>
                <p class="mt-2 text-xs">© <span id="currentYear"></span> Videl. All rights reserved.</p>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        function copyLink() {
            const link = document.getElementById('resetLink');
            const textArea = document.createElement('textarea');
            textArea.value = link.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        }
    </script>
</body>

</html>`

}