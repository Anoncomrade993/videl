import Dialog from './Dialog'



document.addEventListener('DOMContentLoaded', () => {
	// Countdown timer
	const countdownElement = document.getElementById('countdown');
	const requestLink = document.getElementById('requestLink');
	let countdownTime = 120; // 5 minutes in seconds

	const countdown = setInterval(() => {
		const minutes = Math.floor(countdownTime / 60);
		const seconds = countdownTime % 60;

		countdownElement.textContent = `Time remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

		if (countdownTime <= 0) {
			clearInterval(countdown);
			countdownElement.textContent = 'Time is up! You can now request a new verification link.';
			requestLink.classList.remove('disabled:opacity-50');
			requestLink.onclick = () => handler()
		}
		countdownTime--;
	}, 1000);
	
	
	
	async function handler() {
		try {
			// Prepare data for submission
			const email = window.localStorage.getItem('uemail');
			if (!email) {
				return;
			}
			const userData = { email: email.trim() };

			// Send registration request
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

			// Handle different response statuses
			if (response.ok) {
				// Successful registration
				Dialog.show({
					title: 'Email verification',
					message: 'token sent to email!',
					type: 'success',
					onConfirm: () => {
						form.reset();
						localStorage.clear();
						window.location.href = '/login'
					}
				});
			} else {
				// Server returned an error
				throw new Error(result.message || 'Registration failed');
			}

		} catch (error) {
			// Display user-friendly error dialog
			Dialog.show({
				title: 'Registration Error',
				message: error.message || 'An unexpected error occurred',
				type: 'error'
			});
		}
	};
});