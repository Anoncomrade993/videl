class Dialog {
	constructor(options = {}) {
		this.options = {
			title: options.title || 'Notification',
			message: options.message || '',
			type: options.type || 'info', // info, success, error, warning
			duration: options.duration || 3000
		};

		this.init();
	}

	init() {
		// Create dialog elements
		this.dialogOverlay = document.createElement('div');
		this.dialogContainer = document.createElement('div');

		// Base styles with inflation and loader effect
		this.dialogOverlay.classList.add(
			'fixed', 'inset-0', 'bg-black', 'bg-opacity-50',
			'z-50', 'flex', 'items-center', 'justify-center',
			'opacity-0', 'transition-opacity', 'duration-300'
		);

		this.dialogContainer.classList.add(
			'bg-white', 'rounded-lg', 'shadow-xl',
			'p-6', 'w-96', 'relative', 'max-w-md',
			'transform', 'scale-95', 'opacity-0',
			'transition-all', 'duration-300'
		);

		this.render();
	}

	render() {
		// Simplified dialog content
		this.dialogContainer.innerHTML = `
            <div class="flex flex-col items-center text-center">
                <h2 class="text-xl font-bold mb-4 ${this.getTitleColor()}">
                    ${this.options.title}
                </h2>
                
                <p class="text-gray-700 mb-4">${this.options.message}</p>
                
                <div class="w-12 h-12 border-4 border-t-4 
                    ${this.getLoaderColor()} 
                    border-t-transparent rounded-full 
                    animate-spin"></div>
            </div>
        `;

		this.dialogOverlay.appendChild(this.dialogContainer);
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

	getLoaderColor() {
		const colors = {
			info: 'border-blue-600',
			success: 'border-green-600',
			error: 'border-red-600',
			warning: 'border-yellow-600'
		};
		return colors[this.options.type];
	}

	open() {
		document.body.appendChild(this.dialogOverlay);

		// Trigger reflow to enable transitions
		void this.dialogOverlay.offsetWidth;

		// Animate in
		this.dialogOverlay.classList.remove('opacity-0');
		this.dialogContainer.classList.remove('scale-95', 'opacity-0');

		// Auto-close
		if (this.options.duration > 0) {
			this.closeTimer = setTimeout(() => this.close(), this.options.duration);
		}
	}

	close() {
		// Clear any existing timer
		if (this.closeTimer) {
			clearTimeout(this.closeTimer);
		}

		// Animate out
		this.dialogOverlay.classList.add('opacity-0');
		this.dialogContainer.classList.add('scale-95', 'opacity-0');

		// Remove after transition
		setTimeout(() => {
			document.body.removeChild(this.dialogOverlay);
		}, 300);
	}

	// Static method to show quick dialogs
	static show(options) {
		const dialog = new Dialog(options);
		dialog.open();
		return dialog;
	}
}

export default Dialog;