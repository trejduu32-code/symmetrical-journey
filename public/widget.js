(function() {
  'use strict';

  // Prevent multiple instances
  if (window.URLGPTWidget) return;
  window.URLGPTWidget = true;

  // Get the origin of the parent page
  const WIDGET_ORIGIN = document.currentScript ? new URL(document.currentScript.src).origin : window.location.origin;

  // Create widget button
  const button = document.createElement('div');
  button.id = 'urlgpt-widget-button';
  button.innerHTML = `
    <img src="https://cdn-ai.onspace.ai/onspace/files/GPyTSpPocHTrri5ywNrK8f/5963259a7_5a60156c-c371-4523-82a7-0845fe34cebb.jpeg" alt="URLGPT" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
  `;
  
  // Button styles
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    color: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(16, 185, 129, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    zIndex: '999999',
    border: 'none',
  });

  // Create widget modal
  const modal = document.createElement('div');
  modal.id = 'urlgpt-widget-modal';
  modal.style.cssText = `
    position: fixed;
    bottom: 96px;
    right: 24px;
    width: 420px;
    max-width: calc(100vw - 48px);
    height: 600px;
    max-height: calc(100vh - 120px);
    background: #0a0a0a;
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 12px;
    box-shadow: 0 0 40px rgba(16, 185, 129, 0.3), 0 8px 32px rgba(0, 0, 0, 0.5);
    z-index: 999998;
    display: none;
    overflow: hidden;
  `;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = WIDGET_ORIGIN + '/?widget=true';
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 12px;
  `;

  modal.appendChild(iframe);

  // Hover effects
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.7), 0 6px 16px rgba(0, 0, 0, 0.4)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)';
  });

  // Toggle modal
  let isOpen = false;
  button.addEventListener('click', () => {
    isOpen = !isOpen;
    modal.style.display = isOpen ? 'block' : 'none';
    
    if (isOpen) {
      button.style.transform = 'rotate(180deg)';
    } else {
      button.style.transform = 'rotate(0deg)';
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen && !modal.contains(e.target) && !button.contains(e.target)) {
      isOpen = false;
      modal.style.display = 'none';
      button.style.transform = 'rotate(0deg)';
    }
  });

  // Append to body when DOM is ready
  function init() {
    document.body.appendChild(button);
    document.body.appendChild(modal);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
