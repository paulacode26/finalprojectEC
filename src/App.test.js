import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const titleElement = screen.getByText(/group 1/i);
  expect(titleElement).toBeInTheDocument();

  const member1 = screen.getByText(/paula gomez perez/i);
  expect(member1).toBeInTheDocument();

  const member2 = screen.getByText(/sandra vera gomez/i);
  expect(member2).toBeInTheDocument();

  const member3 = screen.getByText(/nafiyad adane gudina/i);
  expect(member3).toBeInTheDocument();

  const member4 = screen.getByText(/erick mulia goycoolea/i);
  expect(member4).toBeInTheDocument();
});
