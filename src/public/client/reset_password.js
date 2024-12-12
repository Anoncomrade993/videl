import Dialog from '../utils/Dialog';

document.addEventListener('DOMContentLoaded', () => {
	const dlog = new Dialog();

	// Get DOM elements
	const countdownElement = document.getElementById('countdown');
	const emailElement = document.getElementById('email');
	const submitBtn = document.getElementById('submit-button');
	const requestLink = document.getElementById('resend-link');

	// Countdown configuration
	const COUNTDOWN_DURATION = 120; // 2 minutes in seconds
	let countdownTime = COUNTDOWN_DURATION;

	// Event listeners for submit and request link
    [requestLink, submitBtn].forEach((element) => {
		element.addEventListener('click', async (event) => {
			clearErrors();

			const email = emailElement.value.trim();
			const errors = validateForm(emailElement, email);

			if (errors.length > 0) {
				errors.forEach(error => displayError(error.input, error.message));
				return;
			}

			// Disable submit button during request
			setSubmitButtonState(true);

			try {
				const response = await requestToken(email);

				if (response.ok) {
					startCountdown();
					dlog.success('Operation successful', 'Check your email for the token');
				} else {
					handleErrorResponse(response);
				}
			} catch (error) {
				console.error('Login error:', error);
				dlog.error('Network error', 'Please try again.');
			} finally {
				// Re-enable submit button
				setSubmitButtonState(false);
			}
		});
	});

	// Form validation function
	function validateForm(emailElement, email) {
		const errors = [];

		// Email validation
		if (!validateEmail(email)) {
			errors.push({
				input: emailElement,
				message: 'Invalid email format'
			});
		}

		return errors;
	}

	// Email validation regex
	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	// Display form validation errors
	function displayError(input, message) {
		let errorElement = input.nextElementSibling;

		if (!errorElement || !errorElement.classList.contains('error-message')) {
			errorElement = document.createElement('div');
			errorElement.classList.add(
				'error-message',
				'text-red-500',
				'text-xs',
				'mt-1'
			);
			input.parentNode.insertBefore(errorElement, input.nextSibling);
		}

		errorElement.textContent = message;
		input.classList.add('border-red-500');
	}

	// Request token from server
	async function requestToken(email) {
		return fetch('/auth/request-fp-OTP', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ email })
		});
	}

	// Clear previous validation errors
	function clearErrors() {
		document.querySelectorAll('.error-message').forEach(el => el.remove());
		document.querySelectorAll('.border-red-500')
			.forEach(el => el.classList.remove('border-red-500'));
	}

	// Handle error responses from server
	function handleErrorResponse(response) {
		let errorMessage = 'Something went wrong, try again';

		try {
			const errorData = await response.json();
			errorMessage = errorData.message ||
				`Error ${response.status}: ${response.statusText}`;
		} catch (parseError) {
			errorMessage = `Error ${response.status}: ${response.statusText}`;
		}

		dlog.error('Operation failed', errorMessage);
	}

	// Disable/enable submit button
	function setSubmitButtonState(disabled) {
		submitBtn.disabled = disabled;
		submitBtn.classList.toggle('opacity-50', disabled);
		submitBtn.classList.toggle('cursor-not-allowed', disabled);
	}

	// Countdown timer function
	function startCountdown() {
		countdownTime = COUNTDOWN_DURATION;
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
			}

			countdownTime--;
		}, 1000);
	}
});