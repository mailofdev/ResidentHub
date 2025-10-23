// src/hooks/useKeyboardNavigation.js
import { useEffect, useCallback } from 'react';

export const useKeyboardNavigation = (onEscape, onEnter, onArrowUp, onArrowDown) => {
  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter();
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp();
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown();
        }
        break;
      default:
        break;
    }
  }, [onEscape, onEnter, onArrowUp, onArrowDown]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export const useFocusManagement = (isOpen, focusableSelector = 'button, input, select, textarea, [tabindex]:not([tabindex="-1"])') => {
  useEffect(() => {
    if (isOpen) {
      const focusableElements = document.querySelectorAll(focusableSelector);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (firstElement) {
        firstElement.focus();
      }

      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen, focusableSelector]);
};
