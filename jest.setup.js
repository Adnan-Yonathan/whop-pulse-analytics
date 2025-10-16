// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
  },
  AnimatePresence: ({ children }) => children,
  useMotionValue: () => ({ get: () => 0, set: jest.fn() }),
  useTransform: () => 0,
  animate: jest.fn(),
  useReducedMotion: () => false,
}))

// Mock SWR
jest.mock('swr', () => ({
  default: () => ({
    data: null,
    error: null,
    isLoading: false,
    mutate: jest.fn(),
  }),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_WHOP_APP_ID = 'test-app-id'
process.env.WHOP_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_WHOP_COMPANY_ID = 'test-company-id'
