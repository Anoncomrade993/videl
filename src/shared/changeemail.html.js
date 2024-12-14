module.exports = () => `
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
	<link rel="stylesheet" href="/styles.css">
	<title>Email change - Videl</title>
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
		<div class="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden change-email-card">
			<div class="p-6 sm:p-8 md:p-10">
				<div class="mb-4 sm:mb-6 flex justify-center">
					<i data-lucide="lock" class="w-10 sm:w-12 h-10 sm:h-12 text-orange-600"></i>
				</div>
				<h2 class="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-3 sm:mb-4 heading">
					Email Change
				</h2>
				<p class="text-gray-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
					Enter your credentials below
				</p>

				<div id="change-email-form" class="space-y-4 sm:space-y-6">
					<!-- Token Input -->
					<div>
						<label for="rs-tken" class="block text-sm font-medium text-gray-700 mb-2">
							Token
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<i data-lucide="key" class="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 input-icon"></i>
							</div>
							<input type="password" id="rs-tkn" required class="input-field pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Enter token" minlength="6">
							<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
							</div>
						</div>
						<p id="token-error" class="text-red-500 text-sm mt-2 hidden"></p>
					</div>

					<!--  Password Input -->
					<div>
						<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<i data-lucide="check-circle" class="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 input-icon"></i>
							</div>
							<input type="password" id="password" required class="input-field pl-10 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Confirm new password" minlength="8">
							<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
							</div>
						</div>
						<p id="password-error" class="text-red-500 text-sm mt-2 hidden"></p>
					</div>


					<!-- Submission Button -->
					<div>
						<button type="submit" class="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 active:scale-[0.98] transition-transform">
							Update email
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
	<script>
		lucide.createIcons();
	</script>
	<script type="module" src="/client/c_email.js"></script>
	<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
	<script>
		lucide.createIcons();
	</script>
</body>

</html>`