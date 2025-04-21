// Service worker registration logic removed.

// Keep the unregister function in case it's still imported elsewhere,
// but make it a no-op or ensure it handles the case where SW is not supported/registered.
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('Service worker unregistered.');
      })
      .catch((error) => {
        // It's okay if unregistration fails, especially if there wasn't one registered.
        // console.error('Service worker unregistration failed:', error.message);
      });
  } else {
    // console.log('Service workers are not supported in this browser.');
  }
}

// Remove the register function or make it a no-op
export function register(config) {
  // console.log('Service worker registration is disabled.');
}
