module.exports = (title, message, redirectUrl = '/signin') =>
	`<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<title> ${title}  - Videl </title>
	<!-- Favicon -->
	<link rel="icon" href="/favicon.ico" type="image/x-icon">
	<!-- Fallback favicons  -->
	<link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
	<link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
	<link rel="stylesheet" href="../public/styles.css">
	<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>-->
</head>

<body class="bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen flex items-center justify-center">
	<div class="max-w-md  mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8">
		<div class="text-center">
			<div class="text-red-500 text-6xl mb-4">
				<i data-lucide="x-circle"></i>
			</div>
			<h3 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">${title}</h3>
			<p class="text-gray-700 mb-6">${message}</p>
			<a href="${redirectUrl}" class="inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200">Go to Sign In</a>
		</div>
	</div>
	<script>
		lucide.createIcons();
	</script>
</body>

</html>`