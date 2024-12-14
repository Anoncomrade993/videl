import Dialog from '../utils/Dialog'


document.addEventListener('DOMContentLoaded', function() {
	clearErrors();

	const passwordInput = document.getElementById('new-password')
	const confirmPassword = document.getElementById('confirm-password')
	const emailElement = document.getElementById('uemail')

	const password = passwordInput.value.trim();
	const cpassword = confirmPassword.value.trim();
	const email = emailElement.value.trim()

	const errors = validateForm(
		emailElement,
		passwordInput,
		confirmPassword,
		email,
		password,
		cpassword
	);


	if (errors.length > 0) {
		errors.forEach(error => displayError(error.input, error.message));
		return;
	}

	submitBtn.disabled = true;
	submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

	try {
		const response = await fetch('/auth/change-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password
			})
		});

		if (response.ok) {
			dlog.success('password change', 'password updated successfully');
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
			dlog.error('password change failed', errorMessage)
		}
	} catch (error) {
		console.error('password change error:', error);
		dlog.error('Network error', 'Please try again.');
	} finally {
		submitBtn.disabled = false;
		submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
	}





	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function validateForm(
		emailElement,
		passwordElement,
		cpasswordElement,
		email,
		password,
		cpassword
	) {
		const errors = [];


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