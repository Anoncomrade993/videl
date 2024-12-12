import Dialog from '../utils/Dialog';

document.addEventListener('DOMContentLoaded', () => {

	const dlog = new Dialog();

	const submitBtn = document.getElementById('submit');
	const emailElement = document.getElementById('email');
	const passwordElement = document.getElementById('password');

	submitBtn.addEventListener('click', async (event) => {
		clearErrors();

		const email = emailElement.value.trim();
		const password = passwordElement.value.trim();

		const errors = validateForm(emailElement, email);

		console.log(errors);

		if (errors.length > 0) {
			errors.forEach(error => displayError(error.input, error.message));
			return;
		}

		submitBtn.disabled = true;
		submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

		try {
			const response = await fetch('/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password,
				})
			});

			if (response.ok) {
				// Successful registration
				let uemail = window.localStorage.getItem('uemail')
				if (uemail) window.localStorage.clear()

				dlog.success('Login', 'Signed in successfully')
				setTimeout(() => {
					window.location.href = '/dashboard';
				}, 2000);
			} else {
				let errorMessage = 'Something went wrong';
				try {
					const errorData = await response.json();
					errorMessage = errorData.message ||
						`Error ${response.status}: ${response.statusText}`;
				} catch (parseError) {
					errorMessage = `Error ${response.status}: ${response.statusText}`;
				}

				dlog.error('Login failed', errorMessage);
			}
		} catch (error) {
			console.error('Login error:', error);
			dlog.error('Network error', 'Please try again.');
		} finally {
			submitBtn.disabled = false;
			submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
		}
	});


	function validateForm(
		emailElement,
		email
	) {
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


	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}


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



	function clearErrors() {
		document.querySelectorAll('.error-message').forEach(el => el.remove());
		document.querySelectorAll('.border-red-500')
			.forEach(el => el.classList.remove('border-red-500'));
	}
});