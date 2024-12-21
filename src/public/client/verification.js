import Dialog from '../utils/Dialog.js';


document.addEventListener('DOMContentLoaded', () => {
	const dlog = new Dialog();

	// Get DOM elements
	const countdownElement = document.getElementById('countdown');
	const requestLink = document.getElementById('requestLink');
	let countdownTime = 120; // 2 minutes in seconds

	// Countdown timer function
	const startCountdown = () => {
		const countdownInterval = setInterval(() => {
			const minutes = Math.floor(countdownTime / 60);
			const seconds = countdownTime % 60;

			// Format countdown display
			countdownElement.textContent = `Time remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

			if (countdownTime <= 0) {
				clearInterval(countdownInterval);
				countdownElement.textContent = 'Time is up! You can now request a new verification link.';

				// Enable request link
				requestLink.classList.remove('disabled:opacity-50');
				requestLink.disabled = false;
				requestLink.onclick = handler;
			}

			countdownTime--;
		}, 1000);
	};

	// Handler for requesting verification link
	async function handler() {
		try {
			// Retrieve email from localStorage
			const email = window.localStorage.getItem('uemail');
			if (!email) {
				dlog.error('Email Error', 'Email not found. Please try again.');
				return;
			}

			// Disable request link during request
			requestLink.disabled = true;
			requestLink.classList.add('disabled:opacity-50');

			// Prepare request data
			const userData = { email: email.trim() };

			// Send verification request
			const response = await fetch('/auth/request-ev-otp', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify(userData)
			});

			// Parse response
			const result = await response.json();

			// Handle response
			if (response.ok) {
				dlog.success('Verification Sent', 'Verification token sent to your email');

				// Reset countdown
				countdownTime = 120;
				startCountdown();
			} else {
				dlog.error('Verification request error', result.message || 'Failed to send verification token');
				// Log error
				console.error('Verification request error:', result);
			}
		} catch (error) {
			// Network or unexpected error
			dlog.error('Network Error', 'Please check your connectivity');
			console.error('Request error:', error);
		} finally {
			// Re-enable request link
			requestLink.disabled = false;
			requestLink.classList.remove('disabled:opacity-50');
		}
	}

	// Initial setup
	requestLink.onclick = handler;
	startCountdown();
});