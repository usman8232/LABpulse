import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoginPage } from '../pages/login-page';

describe('LoginPage', () => {
  it('renders heading', () => {
    render(<LoginPage />);
    expect(screen.getByText(/sign in to labpulse/i)).toBeInTheDocument();
  });
});
