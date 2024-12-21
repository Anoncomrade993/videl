import Dialog from '../utils/Dialog.js'



document.addEventListener('DOMContentLoaded', () => {

	const dlog = new Dialog()

	const submitBtn = document.getElementById('submit');
	const token = document.getElementById('token').value;
	const email = document.getElementById('uemail').value;
	const npassword = document.getElementById('new-password').value;
	const cpassword = document.getElementById('current-password').value;


	submitBtn.addEventListener('click', () => {
		try {
			const response = await fetch('/auth/change-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, npassword, cpassword, token }),
			});

			const result = await response.json();

			if (response.ok) {

				dlog.success('Success', 'Password updated successfully')
				setTimeout(() => {
					window.location.href = '/signin';
				}, 2000);
			}
			else {
				let errorMessage = 'Something went wrong';
				try {
					const errorData = await response.json();
					errorMessage = errorData.message ||
						`Error ${response.status}: ${response.statusText}`;
				} catch (parseError) {
					errorMessage = `Error ${response.status}: ${response.statusText}`;
				}

				dlog.error('update failed', errorMessage);
			}
		} catch (error) {
			console.error('password update error:', error);
			dlog.error('Network error', 'Please try again.');
		} finally {
			submitBtn.disabled = false;
			submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
		}
	});

})