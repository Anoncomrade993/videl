module.exports = () => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="refresh" content="4;url=/signin">
    <title>Redirecting...</title>
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" type="image/x-icon" sizes="32x32" href="/videl32.ico">
    <link rel="icon" type="image/x-icon" sizes="48x48" href="/videl48.ico">
    <style>
        body {
            background: linear-gradient(to bottom right, #FFEDD5, #FFFAF0);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }

        .container {
            display: flex;
            justify-content: center;
            margin-bottom: 1.5rem;
            max-width: 28rem;
            background: white;
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .text-center {
            text-align: center;
        }

        .icon {
            color: #34D399; /* green-500 */
            font-size: 3rem; /* text-6xl */
            margin-bottom: 1rem;
        }

        h1 {
            font-size: 1.5rem; /* text-2xl */
            font-weight: 800; /* font-extrabold */
            color: #1F2937; /* gray-900 */
            margin-bottom: 1rem;
        }

        p {
            color: #4B5563; /* gray-700 */
            margin-bottom: 1.5rem;
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="text-center">
            <div class="icon">
                <i data-lucide="check-circle"></i>
            </div>
            <h1>Verification Successful</h1>
            <p>Your email has been verified successfully!</p>
        </div>
    </div>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>

</html>`