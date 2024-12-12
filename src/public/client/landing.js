import Dialog from '../utils/Dialog'

document.addEventListener('DOMContentLoaded', () => {
	const dlog = new Dialog();


	const emailElement = document.getElementById('email');
	const submitBtn = document.getElementById('submit');

	submitBtn.addEventListener('click', async function(event) {
		const email = emailElement.value.trim()

		if (!isValidEmail(email)) {
			dlog.warning('Invalid Email', 'provide a valid email address')
			return;
		}
		try {
			const response = await fetch('/susbcribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			const result = await response.json();

			if (response.ok) {
				dlog.success('Subscription', 'Email subscribed successfully');
				return;
			} else {
				dlog.error('Subscription error', 'Something went wrong' || result.message)
			}
		} catch (error) {
			console.error('Network error', error)
			dlog.error('Network error', 'Check your connectivity')
		}
	});

	function isValidEmail(email = '') {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email.trim().toLowerCase())
	}
});