module.exports = {

	deleteUser: (data = {}) => `
	<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<!-- Favicon -->
		<link rel="icon" href="/favicon.ico" type="image/x-icon">
		<!-- Fallback favicons  -->
		<link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
		<link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
		<script src="https://cdn.tailwindcss.com"></script>
		<title>Account Deletion Scheduled - Videl</title>
	</head>
	
	<body class="bg-gray-50 font-['Inter'] text-gray-800 leading-relaxed">
		<div class="max-w-xl mx-auto px-4 py-8">
			<div class="bg-white shadow-xl rounded-xl p-6 md:p-8">
				<div class="text-center mb-6">
					<h2 class="text-2xl font-bold text-orange-600 mb-4">Account Deletion Scheduled</h2>
				</div>
	
				<div class="space-y-4">
					<p>Hello 👋, <span class="font-semibold">${data.username}</span></p>
					<p>We've received your request to delete your account. Your account is scheduled for deletion in 14 days — ${data.date}.</p>
	
					<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
						<p class="text-yellow-700">If you've changed your mind and want to keep your account, please click the button below:</p>
					</div>
	
					<div class="text-center my-6">
						<a href='${data.tokenLink}' class='inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-300'>
							Cancel Account Deletion
						</a>
					</div>
	
					<p>If you take no action, your account and all associated data will be permanently deleted on ${data.date}.</p>
					<p>We're sorry to see you go. If you have any feedback, please let us know.</p>
					<p>Best regards,<br><span class="font-bold text-orange-600">Videl Team</span></p>
				</div>
	
				<div class="mt-8 border-t pt-4 text-center text-sm text-gray-500">
	
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
	<!-- Favicon -->
	<link rel="icon" href="/favicon.ico" type="image/x-icon">
	<!-- Fallback favicons  -->
	<link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
	<link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">

	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<title>Verify Your Email - Videl</title>
</head>

<body class="bg-gray-50 font-['Inter'] text-gray-800 leading-relaxed">
	<div class="max-w-xl mx-auto px-4 py-8">
		<div class="bg-white shadow-xl rounded-xl p-6 md:p-8">
			<div class="text-center mb-6">
				<h2 class="text-2xl font-bold text-orange-600 mb-4">Verify Your Email</h2>
				<p class="text-gray-600">Complete Your Account Setup</p>
			</div>

			<div class="space-y-4">
				<p>Hello 👋, ${data.username} </p>
				<p>Welcome to Videl! To complete your account setup, please verify your email address.</p>

				<div class="space-y-4">
					<a href="${data.tokenLink}" class="block bg-orange-500 text-white p-4 text-center rounded-lg hover:bg-orange-600 transition-colors duration-300">
						Verify Email Address
					</a>

					<div class="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
						<span id="verificationLink" class="text-sm text-gray-700 truncate mr-4">${data.tokenLink}</span>
						<button onclick="copyLink()" class="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm hover:bg-orange-200 transition-colors">
							Copy Link
						</button>
					</div>

					<p class="text-sm text-gray-600 mt-2">This verification link will expire in 5 minutes</p>
				</div>

				<div class="bg-green-50 border-l-4 border-green-400 p-4">
					<p class="text-green-700 text-sm">
						✅ Verifying your email helps us keep your account secure and ensures you can recover your account if needed.
					</p>
				</div>

				<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
					<p class="text-yellow-700 text-sm">
						⚠️ If you didn't create this account, please ignore this email or contact our support team.
					</p>
				</div>

				<p>Welcome aboard,<br><span class="font-bold text-orange-600">Videl Team</span></p>
			</div>

			<div class="mt-8 border-t pt-4 text-center text-sm text-gray-500">
				<div class="flex justify-center space-x-4 mb-4">
					<a href="${data.twitter}" class="text-gray-600 hover:text-orange-500">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
							<path d="M18.901 1.153h3.68l-8.04 9.136L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.777l8.62-9.838L0 1.153h7.594l5.243 6.932L16.8 1.153zm-2.101 19.694h2.039L7.233 3.259H5.065L16.8 20.847z" />
						</svg>
					</a>
				</div>
				<p>
					<a href="${data.contact}" class="hover:text-orange-600">Contact us</a> |
					<a href="${data.privacy}" class="hover:text-orange-600">Privacy Policy</a>
				</p>
				<p class="mt-2 text-xs">© <span id="currentYear"></span> Videl. All rights reserved.</p>
			</div>
		</div>
	</div>

	<script>
		// Dynamic year
		document.getElementById('currentYear').textContent = new Date().getFullYear();

		// Copy verification link function
		function copyLink() {
			const link = document.getElementById('verificationLink');
			const textArea = document.createElement('textarea');
			textArea.value = link.textContent;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);

			// Visual feedback
			const copyButton = event.target;
			copyButton.textContent = 'Copied!';
			copyButton.classList.remove('bg-orange-100', 'text-orange-700');
			copyButton.classList.add('bg-green-100', 'text-green-700');

			setTimeout(() => {
				copyButton.textContent = 'Copy Link';
				copyButton.classList.remove('bg-green-100', 'text-green-700');
				copyButton.classList.add('bg-orange-100', 'text-orange-700');
			}, 2000);
		}
	</script>
</body>

</html>`,
	changePassword: (data = {}) => `
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- Favicon -->
	<link rel="icon" href="/favicon.ico" type="image/x-icon">
	<!-- Fallback favicons  -->
	<link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
	<link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">

	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<title>Password Change Confirmation - Videl</title>
</head>

<body class="bg-gray-50 font-['Poppins'] text-gray-800 leading-relaxed">
	<div class="max-w-xl mx-auto px-4 py-8">
		<div class="bg-white shadow-xl rounded-xl p-6 md:p-8">
			<div class="text-center mb-6">
				<h2 class="text-2xl font-bold text-orange-600 mb-4">Password Change</h2>
		</div>

			<div class="space-y-4">
				<p>Hello 👋, ${data.username} </p> 
				<p>You've requested to change your password. Use the button or link below to confirm the change:</p>

				<div class="space-y-4">
					<a href="${data.tokenLink}" class="block bg-orange-500 text-white p-4 text-center rounded-lg hover:bg-orange-600 transition-colors duration-300">
						Confirm Password Change
					</a>

					<div class="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
						<span id="tokenLink" class="text-sm text-gray-700 truncate mr-4">${data.tokenLink}</span>
						<button onclick="copyToken()" class="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm hover:bg-orange-200 transition-colors">
							Copy Link
						</button>
					</div>

					<p class="text-sm text-gray-600 mt-2">This token will expire in 5 minutes</p>
				</div>

				<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
					<p class="text-yellow-700 text-sm">
						⚠️ If you didn't request this change, please contact our support team immediately.
					</p>
				</div>

				<p>Thank you,<br><span class="font-bold text-orange-600">Videl Team</span></p>
			</div>

			<div class="mt-8 border-t pt-4 text-center text-sm text-gray-500">
				<div class="flex justify-center space-x-4 mb-4">
					<a href="${data.twitter}" class="text-gray-600 hover:text-blue-500">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
							<path d="M18.901 1.153h3.68l-8.04 9.136L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.777l8.62-9.838L0 1.153h7.594l5.243 6.932L16.8 1.153zm-2.101 19.694h2.039L7.233 3.259H5.065L16.8 20.847z" />
						</svg>
					</a>
				</div>
				<p>
					<a href="${data.contact}" class="hover:text-orange-600">Contact us</a> |
					<a href="${data.privacy}" class="hover:text-orange-600">Privacy Policy</a>
				</p>
				<p class="mt-2 text-xs">© <span id="currentYear"></span> Videl. All rights reserved.</p>
			</div>
		</div>
	</div>

	<script>
		// Dynamic year
		document.getElementById('currentYear').textContent = new Date().getFullYear();

		// Copy token link function
		function copyToken() {
			const tokenLink = document.getElementById('tokenLink');
			const textArea = document.createElement('textarea');
			textArea.value = tokenLink.textContent;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);

			// Optional: Provide visual feedback
			const copyButton = event.target;
			copyButton.textContent = 'Copied!';
			copyButton.classList.remove('bg-orange-100', 'text-orange-700');
			copyButton.classList.add('bg-green-100', 'text-green-700');

			setTimeout(() => {
				copyButton.textContent = 'Copy Link';
				copyButton.classList.remove('bg-green-100', 'text-green-700');
				copyButton.classList.add('bg-orange-100', 'text-orange-700');
			}, 2000);
		}
	</script>
</body>

</html>`,
	changeEmail: (data = {}) => `
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- Favicon -->
	<link rel="icon" href="/favicon.ico" type="image/x-icon">
	<!-- Fallback favicons  -->
	<link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
	<link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
	<script src="https://cdn.tailwindcss.com"></script>
	<title>Email Change Confirmation - Videl</title>
</head>

<body class="bg-gray-50 font-['Inter'] text-gray-800 leading-relaxed">
	<div class="max-w-xl mx-auto px-4 py-8">
		<div class="bg-white shadow-xl rounded-xl p-6 md:p-8">
			<div class="text-center mb-6">
				<h2 class="text-2xl font-bold text-orange-600 mb-4">Email Change Request</h2>
			</div>

			<div class="space-y-4">
				<p>Hello 👋, ${data.username} </p> 
				<p>You've requested to change your email address.</p>

				<div class="space-y-4">
					<a href="${data.tokenLink}" class="block bg-orange-500 text-white p-4 text-center rounded-lg hover:bg-orange-600 transition-colors duration-300">
						Confirm Email Change
					</a>

					<div class="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
						<span id="confirmationLink" class="text-sm text-gray-700 truncate mr-4">${data.tokenLink}</span>
						<button onclick="copyLink()" class="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm hover:bg-orange-200 transition-colors">
							Copy Link
						</button>
					</div>

					<p class="text-sm text-gray-600 mt-2">This confirmation link will expire in 5 minutes</p>
				</div>

				<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
					<p class="text-yellow-700 text-sm">
						⚠️ If you didn't request this change, please contact our support team immediately and update your account security.
					</p>
				</div>

				<div class="bg-blue-50 border-l-4 border-blue-400 p-4">
					<p class="text-blue-700 text-sm">
						💡 Tip: Always verify the email address before confirming the change.
					</p>
				</div>

				<p>Best regards,<br><span class="font-bold text-orange-600">Videl Team</span></p>
			</div>

			<div class="mt-8 border-t pt-4 text-center text-sm text-gray-500">
				<div class="flex justify-center space-x-4 mb-4">
					<a href="${data.twitter}" class="text-gray-600 hover:text-blue-500">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
							<path d="M18.901 1.153h3.68l-8.04 9.136L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.777l8.62-9.838L0 1.153h7.594l5.243 6.932L16.8 1.153zm-2.101 19.694h2.039L7.233 3.259H5.065L16.8 20.847z" />
						</svg>
					</a>
				</div>
				<p>
					<a href="${data.contact}" class="hover:text-orange-600">Contact us</a> |
					<a href="${data.privacy}" class="hover:text-orange-600">Privacy Policy</a>
				</p>
				<p class="mt-2 text-xs">© <span id="currentYear"></span> Videl. All rights reserved.</p>
			</div>
		</div>
	</div>

	<script>
		// Dynamic year
		document.getElementById('currentYear').textContent = new Date().getFullYear();

		// Copy confirmation link function
		function copyLink() {
			const link = document.getElementById('confirmationLink');
			const textArea = document.createElement('textarea');
			textArea.value = link.textContent;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);

			// Visual feedback
			const copyButton = event.target;
			copyButton.textContent = 'Copied!';
			copyButton.classList.remove('bg-orange-100', 'text-orange-700');
			copyButton.classList.add('bg-green-100', 'text-green-700');

			setTimeout(() => {
				copyButton.textContent = 'Copy Link';
				copyButton.classList.remove('bg-green-100', 'text-green-700');
				copyButton.classList.add('bg-orange-100', 'text-orange-700');
			}, 2000);
		}
	</script>
</body>

</html>`,
	forgottenPassword: (data = {}) => `
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- Favicon -->
	<link rel="icon" href="/favicon.ico" type="image/x-icon">
	<!-- Fallback favicons  -->
	<link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
	<link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">

	<script src="https://cdn.tailwindcss.com"></script>
	<title>Reset Your Password - Videl</title>
</head>

<body class="bg-gray-50 font-['Inter'] text-gray-800 leading-relaxed">
	<div class="max-w-xl mx-auto px-4 py-8">
		<div class="bg-white shadow-xl rounded-xl p-6 md:p-8">
			<div class="text-center mb-6">
				<h2 class="text-2xl font-bold text-orange-600 mb-4">Reset Your Password</h2>
			</div>

			<div class="space-y-4">
				<p>Hello 👋, ${data.username} </p>
				<p>We received a request to reset the password for your Videl account. If you didn't make this request, you can safely ignore this email.</p>

				<div class="space-y-4">
					<a href="${data.tokenLink}" class="block bg-orange-500 text-white p-4 text-center rounded-lg hover:bg-orange-600 transition-colors duration-300">
						Reset Your Password
					</a>

					<div class="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
						<span id="resetLink" class="text-sm text-gray-700 truncate mr-4">${data.tokenLink}</span>
						<button onclick="copyLink()" class="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm hover:bg-orange-200 transition-colors">
							Copy Link
						</button>
					</div>

					<p class="text-sm text-gray-600 mt-2">This password reset link will expire in 5 minutes</p>
				</div>

				<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
					<p class="text-yellow-700 text-sm">
						⚠️ Important Security Tips:
					<ul class="list-disc list-inside text-xs mt-2">
						<li>Never share your reset link with anyone</li>
						<li>Choose a strong, unique password</li>
						<li>Avoid using common or previously used passwords</li>
					</ul>
					</p>
				</div>

				<div class="bg-blue-50 border-l-4 border-blue-400 p-4">
					<p class="text-blue-700 text-sm">
						💡 Password Strength Guide:
					<ul class="list-disc list-inside text-xs mt-2">
						<li>Use at least 12 characters</li>
						<li>Mix uppercase and lowercase letters</li>
						<li>Include numbers and special characters</li>
						<li>Avoid personal information</li>
					</ul>
					</p>
				</div>

				<p>Stay secure,<br><span class="font-bold text-orange-600">Videl Team</span></p>
			</div>

			<div class="mt-8 border-t pt-4 text-center text-sm text-gray-500">
				<div class="flex justify-center space-x-4 mb-4">
					<a href="${data.twitter}" class="text-gray-600 hover:text-blue-500">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
							<path d="M18.901 1.153h3.68l-8.04 9.136L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.777l8.62-9.838L0 1.153h7.594l5.243 6.932L16.8 1.153zm-2.101 19.694h2.039L7.233 3.259H5.065L16.8 20.847z" />
						</svg>
					</a>
				</div>
				<p>
					<a href="${data.contact}" class="hover:text-orange-600">Contact us</a> |
					<a href="${data.privacy}" class="hover:text-orange-600">Privacy Policy</a>
				</p>
				<p class="mt-2 text-xs">© <span id="currentYear"></span> Videl. All rights reserved.</p>
			</div>
		</div>
	</div>

	<script>
		// Dynamic year
		document.getElementById('currentYear').textContent = new Date().getFullYear();

		// Copy reset link function
		function copyLink() {
			const link = document.getElementById('resetLink');
			const textArea = document.createElement('textarea');
			textArea.value = link.textContent;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);

			// Visual feedback
			const copyButton = event.target;
			copyButton.textContent = 'Copied!';
			copyButton.classList.remove('bg-orange-100', 'text-orange-700');
			copyButton.classList.add('bg-green-100', 'text-green-700');

			setTimeout(() => {
				copyButton.textContent = 'Copy Link';
				copyButton.classList.remove('bg-green-100', 'text-green-700');
				copyButton.classList.add('bg-orange-100', 'text-orange-700');
			}, 2000);
		}
	</script>
</body>

</html>`

}