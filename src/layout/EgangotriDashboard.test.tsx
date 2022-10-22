import { render, screen } from '@testing-library/react';
import EgangotriDashboard from './EgangotriDashboard';

test('renders learn react link', () => {
  render(<EgangotriDashboard />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
