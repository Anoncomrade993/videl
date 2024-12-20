module.exports = () => `
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>500 - Internal Server Error</title>
	<link rel="stylesheet" href="/styles.css">
	<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
	<style>
		@keyframes hypnoWobble {

			0%,
			100% {
				transform: rotate(-5deg) scale(0.98);
			}

			50% {
				transform: rotate(5deg) scale(1.02);
			}
		}

		.hypno-container {
			animation: hypnoWobble 3s ease-in-out infinite;
		}
	</style>
</head>

<body class="bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen flex items-center justify-center">
	<div class="hypno-container max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden p-8 text-center">
		<div class="flex justify-center mb-6 p-5">
			<i data-lucide="server-crash" class="text-red-500" width="64" height="64"></i>
		</div>

		<h1 class="text-3xl font-extrabold text-gray-900 mb-4">
			500 - Server Error
		</h1>

		<p class="text-gray-600 mb-6">
			Looks like our servers are having a bit of a meltdown. Our tech wizards are working their magic to fix things.
		</p>

		<div class="flex justify-center space-x-4">
			<a href="/" class="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
				<i data-lucide="home" width="16" height="16"></i>
				Go to Homepage
			</a>
			<button onclick="window.location.reload()" class="flex items-center gap-2 border border-orange-600 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
				<i data-lucide="refresh-cw" width="16" height="16"></i>
				Retry
			</button>
		</div>
	</div>

	<script>
		lucide.createIcons();
	</script>
</body>

</html>`