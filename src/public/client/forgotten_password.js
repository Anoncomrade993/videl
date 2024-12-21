import Dialog from '../utils/Dialog.js';

document.addEventListener('DOMContentLoaded', () => {
	const dlog = new Dialog();
	const submitBtn = document.getElementById('submit');
	const emailElement = document.getElementById('email');
	const resendLink = document.getElementById('resend-link');
	const countdownElement = document.getElementById('countdown');
	let countdownTimer;

	submitBtn.addEventListener('click', async () => {
		clearErrors();

		const email = emailElement.value.trim();
		const errors = validateForm(emailElement, email);

		if (errors.length > 0) {
			errors.forEach(error => displayError(error.input, error.message));
			return;
		}

		submitBtn.disabled = true;
		submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

		try {
			const response = await fetch('/auth/request-fp-token', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});

			if (response.ok) {
				dlog.success('', 'Check your email for the token');
				startCountdown(); // Start countdown on successful request
			} else {
				handleErrorResponse(response);
			}
		} catch (error) {
			console.error('Network error:', error);
			dlog.error('Network error', 'Please try again.');
		} finally {
			submitBtn.disabled = false;
			submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
		}
	});

	resendLink.addEventListener('click', (event) => {
		event.preventDefault();
		submitBtn.click()
		startCountdown();
	});

	function startCountdown() {
		const countdownDuration = 60; // 60 seconds
		let remainingTime = countdownDuration;

		// Disable the link and start the countdown
		resendLink.classList.add('cursor-not-allowed', 'text-gray-400');
		resendLink.classList.remove('text-blue-400');
		countdownElement.textContent = `(${remainingTime}s)`;
		countdownElement.classList.remove('hidden');

		countdownTimer = setInterval(() => {
			remainingTime--;
			countdownElement.textContent = `(${remainingTime}s)`;

			if (remainingTime <= 0) {
				clearInterval(countdownTimer);
				resendLink.classList.remove('cursor-not-allowed', 'text-gray-400');
				resendLink.classList.add('text-blue-400');
				countdownElement.classList.add('hidden');
				countdownElement.textContent = '';
			}
		}, 1000);
	}

	function validateForm(emailElement, email) {
		const errors = [];
		if (!validateEmail(email)) {
			errors.push({ input: emailElement, message: 'Invalid email format' });
		}
		return errors;
	}

	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function displayError(input, message) {
		let errorElement = input.nextElementSibling;
		if (!errorElement || !errorElement.classList.contains('error-message')) {
			errorElement = document.createElement('p');
			errorElement.classList.add('error-message', 'text-red-500', 'text-xs', 'mt-1');
			input.parentNode.insertBefore(errorElement, input.nextSibling);
		}
		errorElement.textContent = message;
		input.classList.add('border-red-500');
	}

	function clearErrors() {
		document.querySelectorAll('.error-message').forEach(el => el.remove());
		document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
	}

	function handleErrorResponse(response) {
		let errorMessage = 'Something went wrong';
		response.json().then(errorData => {
			errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
			dlog.error('Request failed', errorMessage);
		}).catch(() => {
			dlog.error('Request failed', `Error ${response.status}: ${response.statusText}`);
		});
	}
});