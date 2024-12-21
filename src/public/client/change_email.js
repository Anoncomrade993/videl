import Dialog from '../utils/Dialog.js'


document.addEventListener('DOMContentLoaded', () => {

	const dlog = new Dialog();
	document.getElementById('submit').addEventListener('click', async function() {
		const emailToken = document.getElementById('tkn').value;
		const kaf = document.getElementById('kaf').value;
		const password = document.getElementById('password').value;
		const submitBtn = document.getElementById('submit');

		// Disable the button to prevent multiple submissions
		submitBtn.disabled = true;
		submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

		// Validate the password input
		if (!password) {
			dlog.error('Error', 'Password is required.');
			submitBtn.disabled = false;
			submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
			return;
		}

		try {
			const response = await fetch('/change-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: emailToken, kaf, password })
			});

			if (response.ok) {
				dlog.success('Success', 'Your email has been updated successfully!');
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
})
// Function to handle error responses from the server
function handleErrorResponse(response) {
	response.json().then(result => {
		dlog.error('Error', result.message || 'Failed to update email.');
	}).catch(err => {
		dlog.error('Error', 'An unexpected error occurred.');
	});
}