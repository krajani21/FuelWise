import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock all API modules
jest.mock('./api/recentSearches', () => ({
  fetchRecentSearches: jest.fn().mockResolvedValue([]),
  saveRecentSearch: jest.fn().mockResolvedValue({})
}));

jest.mock('./api/profile', () => ({
  updateUserCountry: jest.fn().mockResolvedValue({ country: 'US', brands: [] }),
  fetchUserProfile: jest.fn().mockResolvedValue(null)
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn()
};
global.navigator.geolocation = mockGeolocation;

// Mock fetch for token validation
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: false,
    json: () => Promise.resolve({})
  })
);

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});

test('renders FuelWise app without crashing', async () => {
  render(<App />);
  
  // Wait for auth loading to complete
  await waitFor(() => {
    expect(screen.queryByText(/validating authentication/i)).not.toBeInTheDocument();
  });
  
  // Check if the app header renders
  expect(screen.getByText(/FuelWise/i)).toBeInTheDocument();
});

test('renders landing page for unauthenticated users', async () => {
  render(<App />);
  
  await waitFor(() => {
    expect(screen.queryByText(/validating authentication/i)).not.toBeInTheDocument();
  });
  
  // Should show login/signup options
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('shows guest mode banner on search page', async () => {
  // Navigate to search page by setting initial route
  window.history.pushState({}, 'Search page', '/search');
  
  render(<App />);
  
  await waitFor(() => {
    expect(screen.queryByText(/validating authentication/i)).not.toBeInTheDocument();
  });
  
  // Should show guest mode banner
  await waitFor(() => {
    expect(screen.getByText(/You're using FuelWise as a guest/i)).toBeInTheDocument();
  });
});
