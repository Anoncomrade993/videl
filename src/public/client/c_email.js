import Dialog from '../utils/Dialog'


document.addEventListener('DOMContentLoaded', function() {
	clearErrors();

	const passwordInput = document.getElementById('password')
	const tokenInput = document.getElementById('rs-tkn')

	const password = passwordInput.value.trim();
	const token = tokenInput.value.trim()

	const errors = validateForm(
		passwordInput,
		tokenInput,
		password,
		token
	);


	if (errors.length > 0) {
		errors.forEach(error => displayError(error.input, error.message));
		return;
	}

	submitBtn.disabled = true;
	submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

	try {
		const response = await fetch('/auth/change-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token,
				password
			})
		});

		if (response.ok) {
			dlog.success('Email change', 'email updated  successfully');
			setTimeout(() => {
				window.location.href = '/signin';
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
			dlog.error('Email change failed', errorMessage)
		}
	} catch (error) {
		console.error('Email change  error:', error);
		dlog.error('Network error', 'Please try again.');
	} finally {
		submitBtn.disabled = false;
		submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
	}




	function validateForm(
		passwordElement,
		tokenInput,
		password,
		token
	) {
		const errors = [];


		// Password validation
		if (password.length < 8) {
			errors.push({
				input: passwordElement,
				message: 'Password must be at least 8 characters'
			});
		}
		// Token validation
		if (token.length < 8) {
			errors.push({
				input: tokenInput,
				message: 'token must be at least 6 characters'
			});
		}

		return errors;
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