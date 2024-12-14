module.exports = {
	deletUser: (data = {}) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Account Deletion Scheduled</title>
    </head>
    <body class="bg-gray-50 font-['Inter'] text-gray-800 leading-relaxed">
        <div class="max-w-xl mx-auto px-4 py-8">
            <div class="bg-white shadow-xl rounded-xl p-6 md:p-8">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-orange-600 mb-4">Account Deletion Scheduled</h2>
                    <p class="text-gray-600">We're sorry to see you go</p>
                </div>
                
                <div class="space-y-4">
                    <p>Hello 👋, <span class="font-semibold">${data.username}</span></p>
                    <p>We've received your request to delete your account. Your account is scheduled for deletion in 14 days.</p>
                    
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
                    <div class="flex justify-center space-x-4 mb-4">
                        <a href="${data.twitter}" class="text-gray-600 hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path d="M18.901 1.153h3.68l-8.04 9.136L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.777l8.62-9.838L0 1.153h7.594l5.243 6.932L18.901 1.153zm-2.101 19.694h2.039L7.233 3.259H5.065L16.8 20.847z"/>
                            </svg>
                        </a>
                        <a href="${data.telegram}" class="text-gray-600 hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 10v5h-2v-5h2zm-2-3h4v2h-4v-2z"/>
                            </svg>
                        </a>
                    </div>
                    <p>
                        <a href="${data.contact}" class="hover:text-orange-600">Contact us</a> | 
                        <a href="${data.privacy}" class="hover:text-orange-600">Privacy Policy</a>
                    </p>
                    <p class="mt-2 text-xs">© 2024 Videl. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>`,

	changePassword: (data = {}) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Password Change Confirmation</title>
    </head>
    <body class="bg-gray-50 font-['Inter'] text-gray-800 leading-relaxed">
        <div class="max-w-xl mx-auto px-4 py-8">
            <div class="bg-white shadow-xl rounded-xl p-6 md:p-8">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-orange-600 mb-4">Password Change</h2>
                    <p class="text-gray-600">Secure Your Account</p>
                </div>
                
                <div class="space-y-4">
                    <p>Hello 👋,</p>
                    <p>You've requested to change your password. Use the button  below to confirm the change:</p>
                    
                    <div class="bg-orange-50 border-l-4 border-orange-400 p-4 my-4 text-center">
                        <span class="text-2xl font-bold text-orange-700 tracking-widest">
                            ${data.token}
                        </span>
                        <p class="text-sm text-gray-600 mt-2">This OTP will expire in 5 minutes</p>
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
                                <path d="M18.901 1.153h3.68l-8.04 9.136L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.777l8.62-9.838L0 1.153h7.594l5.243 6.932L18.901 1.153zm-2.101 19.694h2.039L7.233 3.259H5.065L16.8 20.847z"/>
                            </svg>
                        </a>
                        <a href="${data.telegram}" class="text-gray-600 hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 10v5h-2v-5h2zm-2-3h4v2h-4v-2z"/>
                            </svg>
                        </a>
                    </div>
                    <p>
                        <a href="${data.contact}" class="hover:text-orange-600">Contact us</a> | 
                        <a href="${data.privacy}" class="hover:text-orange-600">Privacy Policy</a>
                    </p>
                    <p class="mt-2 text-xs">© 2024 Videl. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>`,

	forgotPassword: (data = {}) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Password Reset</title>
    </head>
    <body class="bg-gray-50 font-['Inter'] text-gray-800 leading-relaxed">
        <div class="max-w-xl mx-auto px-4 py-8">
            <div class="bg-white shadow-xl rounded-xl p-6 md:p-8">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-orange-600 mb-4">Password Reset</h2>
                    <p class="text-gray-600">Regain Access to Your Account</p>
                </div>
                
                <div class="space-y-4">
                    <p>Hello 👋, ${data.username}</p>
                    <p>You've requested to reset your password. Use the Token below to confirm the reset:</p>
                    
                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 text-center">
                        <span class="text-2xl font-bold text-blue-700 tracking-widest">
                            ${data.token}
                        </span>
                        <p class="text-sm text-gray-600 mt-2">This Token will expire in 5 minutes</p>
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
                                <path d="M18.901 1.153h3.68l-8.04 9.136L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.777l8.62-9.838L0 1.153h7.594l5.243 6.932L18.901 1.153zm-2.101 19.694h2.039L7.233 3.259H5.065L16.8 20.847z"/>
                            </svg>
                        </a>
                        <a href="${data.telegram}" class="text-gray-600 hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 10v5h-2v-5h2zm-2-3h4v2h-4v-2z"/>
                            </svg>
                        </a>
                    </div>
                    <p>
                        <a href="${data.contact}" class="hover:text-orange-600">Contact us</a> | 
                        <a href="${data.privacy}" class="hover:text-orange-600">Privacy Policy</a>
                    </p>
                    <p class="mt-2 text-xs">© 2024 Videl. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>`,
	changeEmail: (data = {}) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Email Change Confirmation</title>
    </head>
    <body class="bg-gray-50 font-['Inter'] text-gray-800 leading-relaxed">
        <div class="max-w-xl mx-auto px-4 py-8">
            <div class="bg-white shadow-xl rounded-xl p-6 md:p-8">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-orange-600 mb-4">Email Address Change</h2>
                    <p class="text-gray-600">Verify Your New Contact Information</p>
                </div>
                
                <div class="space-y-4">
                    <p>Hello 👋,</p>
                    <p>You've requested to change your email address. Use the Token below to confirm this change:</p>
                    
                    <div class="bg-green-50 border-l-4 border-green-400 p-4 my-4 text-center">
                        <span class="text-2xl font-bold text-green-700 tracking-widest">
                            ${data.token}
                        </span>
                        <p class="text-sm text-gray-600 mt-2">This Token will expire in 5 minutes</p>
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
                                <path d="M18.901 1.153h3.68l-8.04 9.136L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.777l8.62-9.838L0 1.153h7.594l5.243 6.932L18.901 1.153zm-2.101 19.694h2.039L7.233 3.259H5.065L16.8 20.847z"/>
                            </svg>
                        </a>
                        <a href="${data.telegram}" class="text-gray-600 hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 10v5h-2v-5h2zm-2-3h4v2h-4v-2z"/>
                            </svg>
                        </a>
                    </div>
                    <p>
                        <a href="${data.contact}" class="hover:text-orange-600">Contact us</a> | 
                        <a href="${data.privacy}" class="hover:text-orange-600">Privacy Policy</a>
                    </p>
                    <p class="mt-2 text-xs">© 2024 Videl. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>`,

	verifyEmail: (data = {}) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Email Verification</title>
    </head>
    <body class="bg-gray-50 font-['Inter'] text-gray-800 leading-relaxed">
        <div class="max-w-xl mx-auto px-4 py-8">
            <div class="bg-white shadow-xl rounded-xl p-6 md:p-8">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-orange-600 mb-4">Email Verification</h2>
                    <p class="text-gray-600">Confirm Your Email Address</p>
                </div>
                
                <div class="space-y-4">
                    <p>Hello 👋, ${data.username}</p>
                    <p>Thank you for signing up on Videl. Please click the button below to verify your email address:</p>
                    
                    <div class="text-center my-6">
                        <a href="${data.verificationLink}" class="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-300">
                            Verify My Email
                        </a>
                    </div>
                    
                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <p class="text-blue-700 text-sm">
                            ℹ️ This verification link will expire in 5 minutes.
                        </p>
                    </div>
                    
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                    
                    <p>Thank you,<br><span class="font-bold text-orange-600">Videl Team</span></p>
                </div>

                <div class="mt-8 border-t pt-4 text-center text-sm text-gray-500">
                    <div class="flex justify-center space-x-4 mb-4">
                        <a href="${data.twitter}" class="text-gray-600 hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path d="M18.901 1.153h3.68l-8.04 9.136L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.777l8.62-9.838L0 1.153h7.594l5.243 6.932L18.901 1.153zm-2.101 19.694h2.039L7.233 3.259H5.065L16.8 20.847z"/>
                            </svg>
                        </a>
                        <a href="${data.telegram}" class="text-gray-600 hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 10v5h-2v-5h2zm-2-3h4v2h-4v-2z"/>
                            </svg>
                        </a>
                    </div>
                    <p>
                        <a href="${data.contact}" class="hover:text-orange-600">Contact us</a> | 
                        <a href="${data.privacy}" class="hover:text-orange-600">Privacy Policy</a>
                    </p>
                    <p class="mt-2 text-xs">© 2024 Videl. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>`

}