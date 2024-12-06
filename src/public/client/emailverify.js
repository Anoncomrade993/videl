import Dialog from './Dialog'



document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('form');
	const tokenInput = document.querySelector('input[name="token"]');

	form.addEventListener('submit', async function(event) {
		event.preventDefault();

		// Clear any previous error messages
		clearErrors();

		// Validation checks
		const validations = [
			{ input: tokenInput, validator: validateToken, errorMessage: 'Token must be 4 characters' },
        ];

		// Perform validations
		const errors = validations.filter(({ input, validator }) =>
			!validator(input.value.trim())
		);


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
			const email = window.localStorage.getItem('exml')
			const userData = {
				email: email.trim(),
				token: tokenInput.value.trim(),
			};

			// Send registration request
			const response = await fetch('/api/v1/auth/email-verification', {
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
					title: 'Successful Login',
					message: 'user logged in!',
					type: 'success',
					onConfirm: () => {
						form.reset();
						localStorage.clear()
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
	});



	function validateToken(token) {
		if (typeof(token) !== 'string') return;
		return token.length === 4;
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