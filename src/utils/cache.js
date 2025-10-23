// src/utils/cache.js

// Simple in-memory cache with TTL (Time To Live)
class Cache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  set(key, value, ttl = 300000) { // Default 5 minutes
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set the value
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });

    // Set timer to remove the value after TTL
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
    
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  clear() {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.cache.clear();
  }

  has(key) {
    return this.cache.has(key) && this.get(key) !== null;
  }

  size() {
    return this.cache.size;
  }
}

// Create a global cache instance
export const cache = new Cache();

// Cache keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  PAYMENTS: 'payments',
  COMPLAINTS: 'complaints',
  NOTICES: 'notices',
  RESIDENTS: 'residents'
};

// Cache helper functions
export const getCachedData = (key) => {
  return cache.get(key);
};

export const setCachedData = (key, data, ttl = 300000) => {
  cache.set(key, data, ttl);
};

export const clearCachedData = (key) => {
  cache.delete(key);
};

export const clearAllCache = () => {
  cache.clear();
};
