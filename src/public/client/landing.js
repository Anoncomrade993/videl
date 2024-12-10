import Dialog from '../utils/Dialog.js'

document.addEventListener('DOMContentLoaded', function() {

	const emailInput = document.getElementById('email').value.trim().toLowerCase()
	const form = document.getElementById('newsletter')

	// Validate email function
	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	form.addEventListener('submit', async function(event) {
		event.preventDefault();

		// Disable submit button to prevent multiple submissions
		const submitButton = form.querySelector('button[type="submit"]');
		submitButton.disabled = true;
		submitButton.classList.add('loading');

		try {
			// Validate email before submission
			if (!validateEmail(emailInput)) {
				throw new Error('Please enter a valid email address');
			}

			const req = await fetch('/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: emailInput })
			});

			const res = await req.json();

			if (!req.ok) {
				throw new Error(res.message || 'An error occurred during subscription');
			}

			// Success case
			Dialog.show({
				type: 'success',
				title: 'Subscription Successful',
				message: res.message || 'You have been successfully subscribed to our newsletter!'
			});

		} catch (error) {
			// Error handling
			Dialog.show({
				type: 'error',
				title: 'Subscription Error',
				message: error.message
			});
		} finally {
			// Re-enable submit button
			submitButton.disabled = false;
			submitButton.classList.remove('loading');
		}
	});
});