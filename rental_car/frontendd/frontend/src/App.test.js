import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Sewa Sekarang button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Sewa Sekarang/i);
  expect(buttonElement).toBeInTheDocument();
});
