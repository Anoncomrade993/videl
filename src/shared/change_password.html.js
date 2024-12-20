module.exports = (uemail = "", token = "") => `
	
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
		<script src="https://cdn.tailwindcss.com"></script>
	<title>Change Password - Videl</title>
</head>

<body class="bg-white min-h-screen overflow-x-hidden">

	<!-- Navigation -->
	<nav class="fixed w-full z-20 top-0 left-0 border-b border-gray-200 bg-white/90 backdrop-blur-md">
		<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
			<a href="#" class="flex items-center space-x-3">
				<span class="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap text-orange-600 logo-text">Videl</span>
			</a>
		</div>
	</nav>

	<!--  Password Section -->
	<div class="pt-16 sm:pt-24 bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen flex items-center px-4 sm:px-6 lg:px-8">
		<div class="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden change-password-card">
			<div class="p-6 sm:p-8 md:p-10">
				<div class="mb-4 sm:mb-6 flex justify-center">
					<i data-lucide="lock" class="w-10 sm:w-12 h-10 sm:h-12 text-orange-600"></i>
				</div>
				<h2 class="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-3 sm:mb-4 heading">
					Password Change
				</h2>
				<p class="text-gray-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
					Enter your new password below
				</p>

				<div id="change-password-form" class="space-y-4 sm:space-y-6">
					<!-- Current Password Input -->
					<div>
						<label for="current-password" class="block text-sm font-medium text-gray-700 mb-2">
							Current Password
						</label>
						<input id="token" type="text" value="${token}" disabled hidden>
						<input id="uemail" type="text" value="${uemail}" disabled hidden>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<i data-lucide="key" class="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 input-icon"></i>
							</div>
							<input type="password" id="current-password" required class="input-field pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Enter current password" minlength="8">
							<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
							</div>
						</div>
						<p id="new-password-error" class="text-red-500 text-sm mt-2 hidden"></p>
					</div>

					<!-- New Password Input -->
					<div>
						<label for="new-password" class="block text-sm font-medium text-gray-700 mb-2">
							New Password
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<i data-lucide="check-circle" class="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 input-icon"></i>
							</div>
							<input type="password" id="new-password" required class="input-field pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="enter new password" minlength="8">
							<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
							</div>
						</div>
						<p id="new-password-error" class="text-red-500 text-sm mt-2 hidden"></p>
					</div>

					<!-- Password Strength Indicator -->
					<div id="password-strength" class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
						<div class="h-full w-0 transition-all duration-300" style="background-color: transparent;"></div>
					</div>

					<!-- Submission Button -->
					<div>
						<button id="submit" type="button" class="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 active:scale-[0.98] transition-transform">
							Update password
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
	<script>
		lucide.createIcons();

		// Basic password strength indicator
		const newPasswordInput = document.getElementById('new-password');
		const passwordStrengthIndicator = document.querySelector('#password-strength > div');

		newPasswordInput.addEventListener('input', function() {
					const value = this.value;
					let strength = 0;

					if (value.length >= 8) strength++; // Length
					if (/[A-Z]/.test(value)) strength++; // Uppercase
					if (/[a-z]/.test(value)) strength++; // Lowercase
					if (/[0-9]/.test(value)) strength++; // Number
					if (/[^A-Za-z0-9]/.test(value)) strength++; // Special character

					// Update the strength indicator
					const strengthPercentage = (strength / 5) * 100;
					passwordStrengthIndicator.style.width = \`\$\{strengthPercentage\}\ % \`;
			passwordStrengthIndicator.style.backgroundColor = strengthPercentage < 50 ? 'red' : 'green';
		});
	</script>
	<script type="module" src="/client/change_password.js"></script>
	<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
	<script>
		lucide.createIcons();
	</script>
</body>

</html>`