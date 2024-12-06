const email = document.getElementById('email')
const form = document.getElementById('form')

document.addEventListener('DOMContentLoaded', function() {





	form.addEventListener('submit', function(event) {
		event.preventDefault()
		if (typeof(email.value.trim()) === 'undefined') {

		}
		if (!EMAIL_REGEX.test(email.value.trim())) {

		}

		const req = await fetch('/api/v1/newsletter', {

		});
		const res = await req.json()
		
	})
})