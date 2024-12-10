import Dialog from '../utils/Dialog.js'

document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('form');

	// Prevent default form submission immediately
	form.addEventListener('submit', function(event) {
		event.preventDefault();
		event.stopPropagation();
	}, { passive: false });

	// Remove any existing submit event listeners
	const oldForm = form.cloneNode(true);
	form.parentNode.replaceChild(oldForm, form);

	oldForm.addEventListener('submit', async function(event) {
		// Multiple layers of prevention
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

		// Disable submit button to prevent multiple submissions
		const submitButton = this.querySelector('button[type="submit"]');
		if (submitButton) {
			submitButton.disabled = true;
			submitButton.classList.add('opacity-50', 'cursor-not-allowed');
		}

		// Clear any previous error messages
		clearErrors();

		// Get input elements
		const passwordInput = this.querySelector('input[name="password"]');
		const confirmPasswordInput = this.querySelector('input[name="cpassword"]');
		const emailInput = this.querySelector('input[name="email"]');
		const usernameInput = this.querySelector('input[name="username"]');

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
			errors.push({ input: confirmPasswordInput, errorMessage: 'Passwords must match' });
		}

		// If there are validation errors, display them and stop submission
		if (errors.length > 0) {
			// Use Dialog for validation errors
			Dialog.show({
				title: 'Validation Error',
				message: errors[0].errorMessage || 'Please check your input',
				type: 'error'
			});

			// Highlight specific inputs
			errors.forEach(({ input, errorMessage }) => {
				displayError(input, errorMessage);
			});

			// Re-enable submit button
			if (submitButton) {
				submitButton.disabled = false;
				submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
			}

			return false;
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
						this.reset();
						window.localStorage.setItem('uemail', JSON.stringify(userData.email));
						window.location.href = '/verification';
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
		} finally {
			// Re-enable submit button
			if (submitButton) {
				submitButton.disabled = false;
				submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
			}
		}

		// Explicitly return false to prevent any default submission
		return false;
	}, { passive: false });

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
		let errorElement = input.nextElementSibling;
		if (!errorElement || !errorElement.classList.contains('error-message')) {
			errorElement = document.createElement('div');
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
});