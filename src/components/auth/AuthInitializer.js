// src/components/auth/AuthInitializer.js
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../../features/societyCare/auth/authThunks';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    // Only initialize once
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // Initialize auth and store unsubscribe function
      dispatch(initializeAuth()).then((result) => {
        if (result && typeof result === 'function') {
          unsubscribeRef.current = result;
        }
      });
    }

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
