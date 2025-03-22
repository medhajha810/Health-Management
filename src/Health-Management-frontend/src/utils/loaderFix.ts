/**
 * Utility function to forcibly remove the loading spinner
 * This fixes the issue where the loader gets stuck and prevents the website from opening
 */
export const forceRemoveLoader = () => {
  // Check for common loader IDs and classes
  const possibleLoaderIds = ["loading", "loader", "app-loader", "spinner", "preloader"];
  const possibleLoaderClasses = [".loader", ".loading", ".spinner", ".preloader", ".loading-spinner"];
  
  // Function to hide an element
  const hideElement = (element: Element) => {
    if (element) {
      // Force hide immediately by setting display to none
      (element as HTMLElement).style.display = "none";
      
      // Also set opacity and visibility for good measure
      (element as HTMLElement).style.opacity = "0";
      (element as HTMLElement).style.visibility = "hidden";
      
      // Add a class to mark as removed
      element.classList.add("loader-removed");
      
      // Also try to remove it from the DOM entirely
      try {
        element.parentNode?.removeChild(element);
      } catch (error) {
        console.error("Error removing loader:", error);
      }
      
      // Log that we removed the loader
      console.log("Loader element removed:", element);
    }
  };
  
  // Try to find loaders by ID
  possibleLoaderIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      hideElement(element);
    }
  });
  
  // Try to find loaders by class
  possibleLoaderClasses.forEach(className => {
    const elements = document.querySelectorAll(className);
    elements.forEach(hideElement);
  });
  
  // Also look for elements with loading-related attributes
  const loadingElements = document.querySelectorAll('[data-loading="true"], [aria-busy="true"]');
  loadingElements.forEach(element => {
    (element as HTMLElement).setAttribute('data-loading', 'false');
    (element as HTMLElement).setAttribute('aria-busy', 'false');
  });
  
  // Try to find any visible elements with loading-related text content
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const text = element.textContent?.toLowerCase() || '';
    if (
      (text.includes('loading') || text.includes('please wait')) && 
      window.getComputedStyle(element as HTMLElement).display !== 'none'
    ) {
      hideElement(element);
    }
  });
  
  // Set a body class to indicate loader was removed
  document.body.classList.add("loader-removed");
  
  // Check for spinner overlay elements that might be preventing interaction
  const overlays = document.querySelectorAll('.overlay, .modal-backdrop, .loading-overlay');
  overlays.forEach(hideElement);
  
  // Make sure body is scrollable
  document.body.style.overflow = "auto";
  document.body.style.pointerEvents = "auto";
  
  return true;
};

/**
 * Apply the loader fix with a backup timeout
 * Call this early in your application initialization
 */
export const applyLoaderFix = () => {
  // Try to remove immediately
  forceRemoveLoader();
  
  // Set multiple backup timeouts to ensure the loader is removed
  // This handles cases where the loader might be added dynamically after initial page load
  setTimeout(forceRemoveLoader, 100);
  setTimeout(forceRemoveLoader, 500);
  setTimeout(forceRemoveLoader, 1000);
  setTimeout(forceRemoveLoader, 2000);
  
  // Also handle potential future loaders that might be added
  const observer = new MutationObserver((mutations) => {
    // Check if any mutations might have added a loader
    let shouldCheckForLoaders = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldCheckForLoaders = true;
        break;
      }
    }
    
    // If new elements were added, check for loaders
    if (shouldCheckForLoaders) {
      forceRemoveLoader();
    }
  });
  
  // Start observing changes to the body
  observer.observe(document.body, { childList: true, subtree: true });
  
  return true;
};

// IIFE that runs immediately when this file is imported
// This is the earliest possible point to catch and fix the loader
(() => {
  // Check if we're in the browser
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    console.log("Applying immediate loader fix (module import time)");
    
    // Try immediate fix using a separate function to avoid any reference errors
    const quickFix = () => {
      const loader = document.getElementById("loading");
      if (loader) {
        loader.style.display = "none";
        console.log("Quick fixed loader");
      }
      
      // Also set body styles to ensure content is visible
      if (document.body) {
        document.body.style.display = "block";
        document.body.style.visibility = "visible";
        document.body.style.opacity = "1";
      }
    };
    
    try {
      quickFix();
    } catch (e) {
      console.error("Error in quick loader fix:", e);
    }
    
    // Schedule the full fix for when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyLoaderFix);
    } else {
      applyLoaderFix();
    }
  }
})(); 