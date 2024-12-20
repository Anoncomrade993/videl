module.exports = () => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 - Access Forbidden</title>
	<link rel="stylesheet" href="/styles.css">
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        @keyframes restrictedDance {
            0%, 100% { transform: rotate(-3deg) scale(1); }
            25% { transform: rotate(3deg) scale(1.02); }
            50% { transform: rotate(-2deg) scale(0.98); }
            75% { transform: rotate(2deg) scale(1.01); }
        }
        @keyframes keypadFlicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        .restricted-container {
            animation: restrictedDance 2s ease-in-out infinite;
        }
        .keypad-flicker {
            animation: keypadFlicker 1s infinite alternate;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen flex items-center justify-center overflow-hidden">
    <div class="restricted-container relative max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden p-8 text-center border-4 border-orange-600">
        <div class="absolute top-4 right-4 transform rotate-12">
            <div class="keypad-flicker bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                ACCESS DENIED
            </div>
        </div>

        <div class="flex justify-center mb-6">
            <div class="relative">
                <i data-lucide="lock" class="text-orange-600" width="64" height="64"></i>
                <div class="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            </div>
        </div>
        
        <h1 class="text-3xl font-extrabold text-gray-900 mb-4">
            403 - Restricted Access
        </h1>
        
        <p class="text-gray-600 mb-6">
            Oops! This digital vault is locked tighter than a secret recipe. 
            You'll need special clearance to breach these walls.
        </p>
        
        <div class="flex justify-center space-x-4">
            <a 
                href="/" 
                class="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
                <i data-lucide="home" width="16" height="16"></i>
                Safe Zone
            </a>
            <button 
                onclick="window.history.back()"
                class="flex items-center gap-2 border border-orange-600 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
            >
                <i data-lucide="arrow-left" width="16" height="16"></i>
                Retreat
            </button>
        </div>

        <div class="mt-6 text-xs text-gray-400 italic">
            * No unauthorized access permitted
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>`