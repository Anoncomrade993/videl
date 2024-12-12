class NotificationManager {
	constructor(options = {}) {
		this.container = null;
		this.options = {
			position: options.position || 'top-right',
			maxNotifications: options.maxNotifications || 3,
			duration: options.duration || 5000
		};
		this._initContainer();
	}

	// SVG Icons (inline to avoid external dependencies)
	static ICONS = {
		success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
		error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>`,
		warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
		info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
	};

	static STYLES = {
		success: {
			container: 'bg-green-50 border-green-500 text-green-900',
			icon: 'text-green-500',
		},
		error: {
			container: 'bg-red-50 border-red-500 text-red-900',
			icon: 'text-red-500',
		},
		warning: {
			container: 'bg-yellow-50 border-yellow-500 text-yellow-900',
			icon: 'text-yellow-500',
		},
		info: {
			container: 'bg-blue-50 border-blue-500 text-blue-900',
			icon: 'text-blue-500',
		}
	};

	// Initialize container
	_initContainer() {
		// Create container if it doesn't exist
		this.container = document.getElementById('notification-container');
		if (!this.container) {
			this.container = document.createElement('div');
			this.container.id = 'notification-container';
			this.container.className = `
                fixed ${this._getPositionClass()} 
                z-50 flex flex-col items-end 
                space-y-2 p-4 pointer-events-none
            `;
			document.body.appendChild(this.container);
		}
	}

	// Get Tailwind positioning classes
	_getPositionClass() {
		const positions = {
			'top-right': 'top-4 right-4',
			'top-left': 'top-4 left-4',
			'bottom-right': 'bottom-4 right-4',
			'bottom-left': 'bottom-4 left-4'
		};
		return positions[this.options.position] || positions['top-right'];
	}

	// Create notification
	_createNotification(type, title, message, duration) {
		// Manage max notifications
		if (this.container.children.length >= this.options.maxNotifications) {
			this.container.removeChild(this.container.firstElementChild);
		}

		// Create notification element
		const notification = document.createElement('div');
		notification.className = `
            relative flex items-center p-4 rounded-lg shadow-lg 
            w-96 max-w-full mb-2 overflow-hidden border-l-4 
            animate-slide-in-right pointer-events-auto
            ${NotificationManager.STYLES[type].container}
        `;

		// Notification content
		notification.innerHTML = `
            <div class="flex items-center space-x-3 w-full">
                <div class="flex-shrink-0 ${NotificationManager.STYLES[type].icon}">
                    ${NotificationManager.ICONS[type]} 
                    <h2 class="text-gray-900 text-xl font-bold mb-4 ">
                           ${title}
                      </h2>
                </div>
                <div class="flex-1">${message}</div>
                <button class="close-btn hover:bg-gray-100 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div class="absolute bottom-0 left-0 h-1 bg-black/20 progress-bar"></div>
        `;

		// Progress bar
		const progressBar = notification.querySelector('.progress-bar');
		const closeBtns = notification.querySelectorAll('.close-btn');

		// Close functionality
		const close = () => {
			notification.classList.add('animate-fade-out');
			setTimeout(() => {
				this.container.removeChild(notification);
			}, 300);
		};

		// Close button event
		closeBtns.forEach(btn => btn.addEventListener('click', close));

		// Progress bar and auto-close
		const actualDuration = duration || this.options.duration;
		let startTime = Date.now();

		const updateProgressBar = () => {
			const elapsed = Date.now() - startTime;
			const remaining = Math.max(0, actualDuration - elapsed);
			const percentage = (remaining / actualDuration) * 100;

			progressBar.style.width = `${percentage}%`;

			if (remaining > 0) {
				requestAnimationFrame(updateProgressBar);
			} else {
				close();
			}
		};

		requestAnimationFrame(updateProgressBar);

		// Add to container
		this.container.appendChild(notification);

		return notification;
	}

	// Public notification methods
	success(title, message, duration) {
		return this._createNotification('success', title, message, duration);
	}

	error(title, message, duration) {
		return this._createNotification('error', title, message, duration);
	}

	warning(title, message, duration) {
		return this._createNotification('warning', title, message, duration);
	}

	info(title, message, duration) {
		return this._createNotification('info', title, message, duration);
	}
}

const styles = `
@keyframes slide-in-right {
    0% { transform: translateX(100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
}

@keyframes fade-out {
    0% { opacity: 1; transform: translateX(0); }
    100% { opacity: 0; transform: translateX(100%); }
}

.animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
}

.animate-fade-out {
    animation: fade-out 0.3s ease-in forwards;
}
`;

// Inject styles if not already present
if (!document.getElementById('notification-styles')) {
	const styleEl = document.createElement('style');
	styleEl.id = 'notification-styles';
	styleEl.textContent = styles;
	document.head.appendChild(styleEl);
}

export default NotificationManager