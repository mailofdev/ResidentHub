// src/components/display/ThemeToggle.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { setThemeSettings } from '../../features/societyCare/settings/settingsSlice';
import { updateThemeSettingsThunk } from '../../features/societyCare/settings/settingsThunks';

const ThemeToggle = ({ size = 'sm', showLabel = true, className = '' }) => {
  const dispatch = useDispatch();
  const { themeSettings } = useSelector(state => state.settings);
  const { isDarkMode } = themeSettings;

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleToggle = async () => {
    const newTheme = !isDarkMode;
    
    // Update Redux state immediately for responsive UI
    dispatch(setThemeSettings({ isDarkMode: newTheme }));
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-bs-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Save to Firebase
    try {
      await dispatch(updateThemeSettingsThunk({ isDarkMode: newTheme })).unwrap();
    } catch (error) {
      console.error('Failed to save theme settings:', error);
    }
  };

  return (
    <Button
      variant={isDarkMode ? 'outline-light' : 'outline-dark'}
      size={size}
      onClick={handleToggle}
      className={`d-flex align-items-center ${className}`}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <i className={`bi ${isDarkMode ? 'bi-sun' : 'bi-moon'} me-1`}></i>
      {showLabel && (
        <span className="d-none d-sm-inline">
          {isDarkMode ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;
