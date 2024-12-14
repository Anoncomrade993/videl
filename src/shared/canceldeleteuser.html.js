module.exports = () => ` 
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta http-equiv="refresh" content="4;url=/signin">
	<title>redirecting...</title>
	<!-- Favicon -->
	<link rel="icon" href="/favicon.ico" type="image/x-icon">
	<!-- Fallback favicons -->
	<link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
	<link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
	<link rel="stylesheet" href="/styles.css">
</head>

<body class="bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen flex items-center justify-center">

	<div class="flex justify-center mb-6  mx-auto max-w-md bg-white rounded-xl p-6 sm:p-8">
		<div class="text-center">
			<div class="text-green-500 text-6xl mb-4">
				<i data-lucide="check-circle"></i>
			</div>
			<h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">Verification Successful</h1>
			<p class="text-gray-700 mb-6">Your account deletion schedule has been cancelled successfully!</p>
		</div>
	</div>
	<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
	<script>
		lucide.createIcons();
	</script>
</body>

</html>`