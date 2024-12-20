module.exports = () => `<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>404 - Page Not Found</title>
	link
	<link rel="stylesheet" href="/styles.css">
	<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
	<style>
		@keyframes hypnoSpin {
			0% {
				transform: rotate(0deg) scale(1);
			}

			50% {
				transform: rotate(10deg) scale(1.05);
			}

			100% {
				transform: rotate(-10deg) scale(0.95);
			}
		}

		.hypno-container {
			animation: hypnoSpin 3s ease-in-out infinite;
		}
	</style>
</head>

<body class="bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen flex items-center justify-center">
	<div class="hypno-container max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden p-8 text-center">
		<div class="flex justify-center mb-6">
			<i data-lucide="alert-triangle" class="text-red-500" width="64" height="64"></i>
		</div>

		<h1 class="text-3xl font-extrabold text-gray-900 mb-4">
			404 - Page Not Found
		</h1>

		<p class="text-gray-600 mb-6">
			Oops! The page you are looking for seems to have wandered off into the digital abyss.
		</p>

		<div class="flex justify-center space-x-4">
			<a href="/" class="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
				<i data-lucide="home" width="16" height="16"></i>
				Go to Homepage
			</a>
			<a href="#" onclick="window.history.back()" class="flex items-center gap-2 border border-orange-600 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
				<i data-lucide="arrow-left" width="16" height="16"></i>
				Go Back
			</a>
		</div>
	</div>

	<script>
		lucide.createIcons();
	</script>
</body>

</html>`