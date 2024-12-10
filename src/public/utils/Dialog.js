// dialog.js
class Dialog {
	constructor(options = {}) {
		this.options = {
			title: options.title || 'Notification',
			message: options.message || '',
			type: options.type || 'info', // info, success, error, warning
			confirmText: options.confirmText || 'OK',
			cancelText: options.cancelText || 'Cancel',
			showCancel: options.showCancel || false,
			onConfirm: options.onConfirm || (() => {}),
			onCancel: options.onCancel || (() => {})
		};

		this.init();
	}

	init() {
		// Create dialog elements
		this.dialogOverlay = document.createElement('div');
		this.dialogContainer = document.createElement('div');

		// Set base styles
		this.dialogOverlay.classList.add(
			'fixed', 'inset-0', 'bg-black', 'bg-opacity-50',
			'z-50', 'flex', 'items-center', 'justify-center'
		);

		this.dialogContainer.classList.add(
			'bg-white', 'rounded-lg', 'shadow-xl',
			'p-6', 'w-96', 'relative', 'max-w-md'
		);

		this.render();
	}

	render() {
		// Dialog content structure
		this.dialogContainer.innerHTML = `
            <button id="dialogCloseBtn" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                ✕
            </button>

            <div class="flex flex-col items-center text-center">
                ${this.getIconHTML()}
                
                <h2 class="text-xl font-bold mb-4 ${this.getTitleColor()}">
                    ${this.options.title}
                </h2>
                
                <p class="text-gray-700 mb-6">${this.options.message}</p>
                
                <div class="flex gap-4">
                    ${this.getConfirmButton()}
                    ${this.options.showCancel ? this.getCancelButton() : ''}
                </div>
            </div>
        `;

		this.dialogOverlay.appendChild(this.dialogContainer);

		// Event Listeners
		this.setupEventListeners();
	}

	getIconHTML() {
		const iconClasses = {
			info: {
				color: 'text-blue-500',
				icon: 'ℹ️'
			},
			success: {
				color: 'text-green-500',
				icon: '✅'
			},
			error: {
				color: 'text-red-500',
				icon: '❌'
			},
			warning: {
				color: 'text-yellow-500',
				icon: '⚠️'
			}
		};

		const { color, icon } = iconClasses[this.options.type];
		return `<div class="text-6xl mb-4 ${color}">${icon}</div>`;
	}

	getTitleColor() {
		const colors = {
			info: 'text-blue-600',
			success: 'text-green-600',
			error: 'text-red-600',
			warning: 'text-yellow-600'
		};
		return colors[this.options.type];
	}

	getConfirmButton() {
		const buttonColors = {
			info: 'bg-blue-500 hover:bg-blue-600',
			success: 'bg-green-500 hover:bg-green-600',
			error: 'bg-red-500 hover:bg-red-600',
			warning: 'bg-yellow-500 hover:bg-yellow-600'
		};

		return `
            <button id="dialogConfirmBtn" class="
                px-6 py-2 rounded-md text-white 
                ${buttonColors[this.options.type]}
            ">
                ${this.options.confirmText}
            </button>
        `;
	}

	getCancelButton() {
		return `
            <button id="dialogCancelBtn" class="
                px-6 py-2 rounded-md text-gray-700 
                bg-gray-200 hover:bg-gray-300
            ">
                ${this.options.cancelText}
            </button>
        `;
	}

	setupEventListeners() {
		const confirmBtn = this.dialogContainer.querySelector('#dialogConfirmBtn');
		const cancelBtn = this.dialogContainer.querySelector('#dialogCancelBtn');
		const closeBtn = this.dialogContainer.querySelector('#dialogCloseBtn');

		confirmBtn.addEventListener('click', () => {
			this.options.onConfirm();
			this.close();
		});

		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => {
				this.options.onCancel();
				this.close();
			});
		}

		closeBtn.addEventListener('click', () => this.close());
	}

	open() {
		document.body.appendChild(this.dialogOverlay);
	}

	close() {
		document.body.removeChild(this.dialogOverlay);
	}

	// Static method to show quick dialogs
	static show(options) {
		const dialog = new Dialog(options);
		dialog.open();
		return dialog;
	}
}

// Example Usage
function showRegistrationDialog(success) {
	Dialog.show({
		title: success ? 'Registration Successful' : 'Registration Failed',
		message: success ?
			'Your account has been created successfully!' : 'There was an error creating your account.',
		type: success ? 'success' : 'error',
		confirmText: 'Continue',
		onConfirm: () => {
			if (success) {
				// Redirect or do something on success
				console.log('Navigating to dashboard...');
			}
		}
	});
}

module.exports = Dialog;