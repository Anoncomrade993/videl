import Dialog from '../utils/Dialog'

const dlog = new Dialog();

window.addEventListener('DOMContentLoaded', () => {})

document.getElementById('submit').addEventListener('click', async function() {
	const email = document.getElementById('uemail').value;
	const token = document.getElementById('token').value;
	const newPassword = document.getElementById('new-password').value;
	const confirmPassword = document.getElementById('confirm-password').value;
	const submitBtn = this;

	submitBtn.disabled = true;
	submitBtn.classList.add('opacity-50', 'cursor-not-allowed');


	if (!newPassword || !confirmPassword) {
		dlog.error('Error', 'Both password fields are required.');
		submitBtn.disabled = false;
		submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
		return;
	}

	if (newPassword !== confirmPassword) {
		dlog.error('Error', 'Passwords do not match.');
		submitBtn.disabled = false;
		submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
		return;
	}

	if (!token) {
		dlog.error('Error', 'Token is required.');
		submitBtn.disabled = false;
		submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
		return;
	}

	try {
		const response = await fetch('/reset-password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, token, npassword: newPassword })
		});

		if (response.ok) {
			dlog.success('Success', 'Your password has been reset successfully!');
			setTimeout(() => {
				window.location.href = '/signin';
			}, 2000);
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


function handleErrorResponse(response) {
	response.json().then(result => {
		dlog.error('Error', result.message || 'Failed to reset password.');
	}).catch(err => {
		dlog.error('Error', 'An unexpected error occurred.');
	});
}