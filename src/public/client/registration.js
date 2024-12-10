import Dialog from './Dialog'

document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('form');
	const passwordInput = document.querySelector('input[name="password"]');
	const confirmPasswordInput = document.querySelector('input[name="cpassword"]');
	const emailInput = document.querySelector('input[name="email"]');
	const usernameInput = document.querySelector('input[name="username"]');

	form.addEventListener('submit', async function(event) {
		event.preventDefault();

		// Clear any previous error messages
		clearErrors();

		// Validation checks
		const validations = [
			{ input: emailInput, validator: validateEmail, errorMessage: 'Invalid email format' },
			{ input: passwordInput, validator: validatePassword, errorMessage: 'Password must be at least 8 characters' },
			{ input: usernameInput, validator: validateUsername, errorMessage: 'Username must be 3-20 characters' }
        ];

		// Perform validations
		const errors = validations.filter(({ input, validator }) =>
			!validator(input.value.trim())
		);

		// Check if passwords match
		if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
			errors.push({ errorMessage: 'Passwords must match' });
		}

		// If there are validation errors, display them and stop submission
		if (errors.length > 0) {
			// Use Dialog for validation errors
			Dialog.show({
				title: 'Validation Error',
				message: errors[0].errorMessage || 'Please check your input',
				type: 'error'
			});

			// Also highlight specific inputs
			errors.forEach(({ input, errorMessage }) => {
				displayError(input, errorMessage);
			});
			return;
		}

		try {
			// Prepare data for submission
			const userData = {
				email: emailInput.value.trim(),
				password: passwordInput.value.trim(),
				username: usernameInput.value.trim()
			};

			// Send registration request
			const response = await fetch('/auth/register', {
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
					title: 'Registration Successful',
					message: 'Your account has been created!',
					type: 'success',
					onConfirm: () => {
						form.reset();
						window.localStorage.setItem('uemail', JSON.stringify(userData.email))
						window.location.href = '/verification'
					}
				});
			} else {
				// Server returned an error

				throw new Error(result.message || 'Registration failed');
				Dialog.show({
					title: 'Registration Error',
					message: result.message || 'Registration failed',
					type: response.status > 399 && response.status < 500 ? 'warning' : 'error'
				})
			}

		} catch (error) {
			// Display user-friendly error dialog
			Dialog.show({
				title: 'Registration Error',
				message: error.message || 'An unexpected error occurred',
				type: 'error'
			});
		}
	});

	// Validation helper functions
	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function validatePassword(password) {
		return password.length >= 8;
	}

	function validateUsername(username) {
		return username.length >= 3 && username.length <= 20;
	}

	// Error display functions
	function displayError(input, message) {
		// Create or update error element
		let errorElement = input.nextElementSibling;
		if (!errorElement || !errorElement.classList.contains('error-message')) {
			errorElement = document.createElement('div');
			errorElement.classList.add('error-message');
			input.parentNode.insertBefore(errorElement, input.nextSibling);
		}

		errorElement.textContent = message;
		input.classList.add('error');
	}

	function clearErrors() {
		document.querySelectorAll('.error-message').forEach(el => el.remove());
		document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
	}
});