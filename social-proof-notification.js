/**
 * SocialProofNotification.js
 * A lightweight library for displaying social proof notifications
 * Compatible with Bootstrap, Tailwind, and custom CSS frameworks
 * 
 * @version 1.0.0
 * @license MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SocialProofNotification = factory());
})(this, (function () {
  'use strict';

  // Default configuration
  const defaults = {
    position: 'bottom-right',
    autoClose: true,
    autoCloseTimeout: 8000,
    initialDelay: 10000,
    dataSource: 'local',
    apiUrl: null,
    localData: [],
    saveToStorage: true,
    minTimeBetween: 9, // hours
    theme: 'default', // 'default', 'bootstrap', 'tailwind', or custom CSS class
    showIcon: true,
    iconType: 'checkmark',
    animation: 'slide',
    animationDuration: 300,
    closeButton: true,
    pauseOnHover: false,
    maxNotifications: 1,
    messageFormat: '{count} people {action} {timeframe}!',
  };

  // Theme configurations
  const themes = {
    // Default vanilla CSS
    default: {
      container: 'spn-notification',
      wrapper: 'spn-wrapper',
      iconWrapper: 'spn-icon-wrapper',
      icon: 'spn-icon',
      content: 'spn-content',
      message: 'spn-message',
      timestamp: 'spn-timestamp',
      closeButton: 'spn-close',
    },
    // Bootstrap 5 classes
    bootstrap: {
      container: 'toast show',
      wrapper: 'd-flex align-items-start gap-3 px-3 py-2',
      iconWrapper: 'flex-shrink-0',
      icon: 'bi bi-check-circle-fill text-success fs-4',
      content: 'flex-grow-1',
      message: 'mb-1 fw-semibold',
      timestamp: 'text-muted small',
      closeButton: 'btn-close ms-auto',
    },
    // Tailwind CSS classes
    tailwind: {
      container: 'bg-white border border-gray-200 rounded-lg shadow-lg p-4',
      wrapper: 'flex items-start justify-between',
      iconWrapper: 'flex-shrink-0',
      icon: 'w-5 h-5 text-green-600',
      content: 'flex-1 min-w-0 ml-3',
      message: 'text-sm text-gray-600',
      timestamp: 'text-xs text-gray-400 mt-1',
      closeButton: 'flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors',
    },
  };

  // Sample data for random generation
  const sampleActions = [
    "bought this",
    "joined the program",
    "enrolled",
    "got access",
    "completed their purchase",
    "signed up",
    "started their journey",
    "secured their spot",
  ];

  const sampleTimeframes = [
    "in the last hour",
    "recently",
    "X minutes ago",
    "in the last X hours",
  ];

  const sampleCounts = ["Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

  class SocialProofNotification {
    constructor(options = {}) {
      this.config = { ...defaults, ...options };
      this.notificationElement = null;
      this.notificationsShown = 0;
      this.timeoutId = null;
      this.isVisible = false;
      this.storageKey = 'spn_last_shown';
      
      this.injectStyles();
    }

    init() {
      if (!this.shouldShowNotification()) {
        return;
      }

      setTimeout(() => {
        this.show();
      }, this.config.initialDelay);
    }

    injectStyles() {
      this.injectBaseStyles();
      if (this.config.theme === 'default') {
        this.injectDefaultThemeStyles();
      }
    }

    injectBaseStyles() {
      const styleId = 'spn-base-styles';
      if (document.getElementById(styleId)) return;

      const styles = `
        .spn-container {
          position: fixed;
          z-index: 9999;
          max-width: 400px;
        }

        .spn-container.position-top-left { top: 20px; left: 20px; }
        .spn-container.position-top-right { top: 20px; right: 20px; }
        .spn-container.position-top-center { top: 20px; left: 50%; transform: translateX(-50%); }
        .spn-container.position-bottom-left { bottom: 20px; left: 20px; }
        .spn-container.position-bottom-right { bottom: 20px; right: 20px; }
        .spn-container.position-bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); }

        @media (max-width: 640px) {
          .spn-container {
            max-width: calc(100vw - 40px);
            left: 20px !important;
            right: 20px !important;
            transform: none !important;
          }
        }
      `;

      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }

    injectDefaultThemeStyles() {
      const styleId = 'spn-default-theme-styles';
      if (document.getElementById(styleId)) return;

      const styles = `
        .spn-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .spn-notification {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 16px;
          transition: all 0.3s ease-in-out;
        }

        .spn-notification.animate-slide {
          animation: spn-slide-in 0.3s ease-out;
        }

        .spn-notification.animate-fade {
          animation: spn-fade-in 0.3s ease-out;
        }

        .spn-notification.animate-bounce {
          animation: spn-bounce-in 0.5s ease-out;
        }

        .spn-notification.hiding {
          opacity: 0;
          transform: translateX(100%);
        }

        .spn-wrapper {
          display: flex;
          align-items: flex-start;
        }

        .spn-icon-wrapper {
          flex-shrink: 0;
          margin-right: 12px;
        }

        .spn-icon-wrapper .spn-icon-circle {
          width: 32px;
          height: 32px;
          background-color: #dcfce7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spn-icon {
          width: 20px;
          height: 20px;
          color: #16a34a;
        }

        .spn-content {
          flex: 1;
          min-width: 0;
        }

        .spn-message {
          color: #4b5563;
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 4px 0;
        }

        .spn-timestamp {
          color: #9ca3af;
          font-size: 12px;
          margin: 0;
        }

        .spn-close {
          flex-shrink: 0;
          margin-left: 12px;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .spn-close:hover {
          color: #4b5563;
        }

        .spn-close svg {
          width: 16px;
          height: 16px;
        }

        @keyframes spn-slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spn-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spn-bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) translateX(100%);
          }
          50% {
            transform: scale(1.05) translateX(0);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `;

      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }

    shouldShowNotification() {
      if (!this.config.saveToStorage) return true;

      try {
        const lastShownTime = localStorage.getItem(this.storageKey);
        
        if (!lastShownTime) return true;
        
        const lastShown = new Date(lastShownTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastShown.getTime()) / (1000 * 60 * 60);
        
        return hoursDiff >= this.config.minTimeBetween;
      } catch (error) {
        return true;
      }
    }

    async fetchNotificationData() {
      if (this.config.dataSource === 'local') {
        if (this.config.localData.length > 0) {
          return this.config.localData[Math.floor(Math.random() * this.config.localData.length)];
        }
        return this.generateRandomNotification();
      }

      if (this.config.dataSource === 'api' && this.config.apiUrl) {
        try {
          const response = await fetch(this.config.apiUrl);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('SocialProofNotification: Failed to fetch from API', error);
          return this.generateRandomNotification();
        }
      }

      return this.generateRandomNotification();
    }

    generateRandomNotification() {
      const action = sampleActions[Math.floor(Math.random() * sampleActions.length)];
      let timeframe = sampleTimeframes[Math.floor(Math.random() * sampleTimeframes.length)];
      const count = sampleCounts[Math.floor(Math.random() * sampleCounts.length)];
      
      if (timeframe.includes('X')) {
        const randomNumber = Math.floor(Math.random() * 8) + 2;
        timeframe = timeframe.replace('X', randomNumber.toString());
      }
      
      const message = this.config.messageFormat
        .replace('{count}', count)
        .replace('{action}', action)
        .replace('{timeframe}', timeframe);
      
      return {
        message,
        timestamp: 'Just now',
      };
    }

    getIconSVG() {
      const icons = {
        checkmark: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
        fire: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z"></path></svg>',
        star: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>',
      };
      return icons[this.config.iconType] || icons.checkmark;
    }

    getCloseButtonSVG() {
      return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    }

    createNotificationElement(data) {
      const theme = themes[this.config.theme] || themes.default;
      const isBootstrap = this.config.theme === 'bootstrap';
      const isTailwind = this.config.theme === 'tailwind';
      
      // Create container
      const container = document.createElement('div');
      container.className = `spn-container position-${this.config.position}`;
      
      // Create notification
      const notification = document.createElement('div');
      notification.className = theme.container;
      
      if (this.config.animation !== 'none' && this.config.theme === 'default') {
        notification.classList.add(`animate-${this.config.animation}`);
      }

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = theme.wrapper;

      // Create icon section
      if (this.config.showIcon) {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = theme.iconWrapper;
        
        if (this.config.theme === 'default') {
          const iconCircle = document.createElement('div');
          iconCircle.className = 'spn-icon-circle';
          const iconElement = document.createElement('div');
          iconElement.className = theme.icon;
          iconElement.innerHTML = this.getIconSVG();
          iconCircle.appendChild(iconElement);
          iconWrapper.appendChild(iconCircle);
        } else if (isBootstrap) {
          const iconElement = document.createElement('i');
          iconElement.className = theme.icon;
          iconElement.style.fontSize = '24px';
          iconWrapper.appendChild(iconElement);
        } else if (isTailwind) {
          const iconElement = document.createElement('div');
          iconElement.className = `${theme.iconWrapper} w-8 h-8 bg-green-100 rounded-full flex items-center justify-center`;
          iconElement.innerHTML = `<div class="${theme.icon}">${this.getIconSVG()}</div>`;
          wrapper.appendChild(iconElement);
        }
        
        if (!isTailwind) {
          wrapper.appendChild(iconWrapper);
        }
      }

      // Create content section
      const content = document.createElement('div');
      content.className = theme.content;

      const message = document.createElement('p');
      message.className = theme.message;
      message.textContent = data.message;
      content.appendChild(message);

      if (data.timestamp) {
        const timestamp = document.createElement('p');
        timestamp.className = theme.timestamp;
        timestamp.textContent = data.timestamp;
        content.appendChild(timestamp);
      }

      wrapper.appendChild(content);

      // Create close button
      if (this.config.closeButton) {
        const closeBtn = document.createElement('button');
        closeBtn.className = theme.closeButton;
        closeBtn.setAttribute('aria-label', 'Close notification');
        
        if (isBootstrap) {
          closeBtn.setAttribute('type', 'button');
        } else {
          closeBtn.innerHTML = this.getCloseButtonSVG();
        }
        
        closeBtn.addEventListener('click', () => this.hide());
        wrapper.appendChild(closeBtn);
      }

      notification.appendChild(wrapper);
      container.appendChild(notification);

      // Pause on hover
      if (this.config.pauseOnHover) {
        container.addEventListener('mouseenter', () => {
          if (this.timeoutId) {
            clearTimeout(this.timeoutId);
          }
        });

        container.addEventListener('mouseleave', () => {
          if (this.config.autoClose && this.isVisible) {
            this.timeoutId = setTimeout(() => this.hide(), this.config.autoCloseTimeout);
          }
        });
      }

      return container;
    }

    async show() {
      if (this.notificationsShown >= this.config.maxNotifications) return;
      if (this.isVisible) return;

      const data = await this.fetchNotificationData();
      
      this.notificationElement = this.createNotificationElement(data);
      document.body.appendChild(this.notificationElement);
      
      this.isVisible = true;
      this.notificationsShown++;

      // Save to storage
      if (this.config.saveToStorage) {
        try {
          localStorage.setItem(this.storageKey, new Date().toISOString());
        } catch (error) {
          console.warn('SocialProofNotification: Failed to save to localStorage', error);
        }
      }

      // Auto-close
      if (this.config.autoClose) {
        this.timeoutId = setTimeout(() => this.hide(), this.config.autoCloseTimeout);
      }
    }

    hide() {
      if (!this.notificationElement || !this.isVisible) return;

      const notification = this.notificationElement.querySelector(
        this.config.theme === 'default' ? '.spn-notification' : 
        this.config.theme === 'bootstrap' ? '.toast' : 
        '[class*="bg-white"]'
      );

      if (notification && this.config.theme === 'default') {
        notification.classList.add('hiding');
      }

      setTimeout(() => {
        if (this.notificationElement && this.notificationElement.parentNode) {
          this.notificationElement.parentNode.removeChild(this.notificationElement);
        }
        this.notificationElement = null;
        this.isVisible = false;
      }, this.config.animationDuration);

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }

    destroy() {
      this.hide();
      this.notificationsShown = 0;
    }
  }

  // Factory function
  function create(options) {
    return new SocialProofNotification(options);
  }

  return {
    create,
    SocialProofNotification,
  };

}));
