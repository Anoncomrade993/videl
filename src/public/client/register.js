import Dialog from '../utils/Dialog.js';

document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('registration-form');
	const submitBtn = document.getElementById('submit');

	form.addEventListener('submit', async (event) => {
		event.preventDefault(); 
		clearErrors();

		const username = form.username.value.trim();
		const email = form.email.value.trim();
		const password = form.password.value.trim();
		const confirmPassword = form.cpassword.value.trim();

		const errors = validateForm(username, email, password, confirmPassword);
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
					password
				})
			});

			if (response.ok) {
				form.reset();
				window.localStorage.setItem('uemail', JSON.stringify({ email }));
				showRegistrationDialog(true);
				setTimeout(() => {
					window.location.href = '/verification';
				}, 2000);
			} else {
				// Handle error response
				const errorData = await response.json();
				showRegistrationDialog(false); // Show error dialog
			}
		} catch (error) {
			console.error('Registration error:', error);
			showRegistrationDialog(false); // Show error dialog for network issues
		} finally {
			submitBtn.disabled = false;
			submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
		}
	});

	function validateForm(username, email, password, confirmPassword) {
		const errors = [];
		if (username.length < 3 || username.length > 20) {
			errors.push({ input: form.username, message: 'Username must be 3-20 characters' });
		}
		if (!validateEmail(email)) {
			errors.push({ input: form.email, message: 'Invalid email format' });
		}
		if (password.length < 8) {
			errors.push({ input: form.password, message: 'Password must be at least 8 characters' });
		}
		if (password !== confirmPassword) {
			errors.push({ input: form.cpassword, message: 'Passwords must match' });
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

	function showRegistrationDialog(success) {
		Dialog.show({
			title: success ? 'Registration Successful' : 'Registration Failed',
			message: success ?
				'Your account has been created successfully!' : 'There was an error creating your account.',
			type: success ? 'success' : 'error',
			confirmText: 'Continue',
			onConfirm: () => {
				if (success) {
					console.log('Navigating to verification...');
				}
			}
		});
	}
});