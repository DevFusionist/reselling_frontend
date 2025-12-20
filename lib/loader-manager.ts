/**
 * Global loader manager that can be used from anywhere (including API client)
 * This works by storing a callback that updates the loading state
 */

type LoaderCallback = (loading: boolean) => void;

let loaderCallback: LoaderCallback | null = null;

export const LoaderManager = {
  /**
   * Register the loader callback (called by LoadingProvider)
   */
  register(callback: LoaderCallback) {
    loaderCallback = callback;
  },

  /**
   * Unregister the loader callback
   */
  unregister() {
    loaderCallback = null;
  },

  /**
   * Show the loader
   */
  show() {
    if (loaderCallback && typeof window !== 'undefined') {
      loaderCallback(true);
    }
  },

  /**
   * Hide the loader
   */
  hide() {
    if (loaderCallback && typeof window !== 'undefined') {
      loaderCallback(false);
    }
  },

  /**
   * Check if loader is available
   */
  isAvailable(): boolean {
    return loaderCallback !== null && typeof window !== 'undefined';
  },
};

