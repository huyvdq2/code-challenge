import '@testing-library/jest-dom';
import React from 'react';

// Mock React globally to fix forwardRef issues
global.React = React;

// Ensure React is properly available for all imports
if (typeof globalThis !== 'undefined') {
  globalThis.React = React;
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
