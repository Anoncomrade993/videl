import Dialog from '../utils/Dialog';

document.addEventListener('DOMContentLoaded', () => {

	const dlog = new Dialog();


	const submitBtn = document.getElementById('submit');
	const usernameElement = document.getElementById('username');
	const emailElement = document.getElementById('email');
	const passwordElement = document.getElementById('password');
	const cpasswordElement = document.getElementById('confirm-password');

	submitBtn.addEventListener('click', async (event) => {
		clearErrors();

		const username = usernameElement.value.trim();
		const email = emailElement.value.trim();
		const password = passwordElement.value.trim();
		const cpassword = cpasswordElement.value.trim();

		const errors = validateForm(
			usernameElement,
			emailElement,
			passwordElement,
			cpasswordElement,
			username,
			email,
			password,
			cpassword
		);

		console.log(errors);

		if (errors.length > 0) {
			errors.forEach(error => displayError(error.input, error.message));
			return;
		}

		submitBtn.disabled = true;
		submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

		try {
			const response = await fetch('/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username,
					email,
					password,
					cpassword
				})
			});

			if (response.ok) {
				// Successful registration
				window.localStorage.setItem('uemail', JSON.stringify({ email }));
				dlog.success('Registration', 'user registered successfully');

				setTimeout(() => {
					window.location.href = '/verification';
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
				dlog.error('Registration failed', errorMessage)
			}
		} catch (error) {
			console.error('Registration error:', error);
			dlog.error('Network error', 'Please try again.');
		} finally {
			submitBtn.disabled = false;
			submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
		}
	});


	function validateForm(
		usernameElement,
		emailElement,
		passwordElement,
		cpasswordElement,
		username,
		email,
		password,
		confirmPassword
	) {
		const errors = [];

		// Username validation
		if (username.length < 3 || username.length > 20) {
			errors.push({
				input: usernameElement,
				message: 'Username must be 3-20 characters'
			});
		}

		// Email validation
		if (!validateEmail(email)) {
			errors.push({
				input: emailElement,
				message: 'Invalid email format'
			});
		}

		// Password validation
		if (password.length < 8) {
			errors.push({
				input: passwordElement,
				message: 'Password must be at least 8 characters'
			});
		}

		// Confirm password validation
		if (password !== confirmPassword) {
			errors.push({
				input: cpasswordElement,
				message: 'Passwords must match'
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
})