import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';

import HomePage from './HomePage';
import { UserProvider } from '../Context/userContext';
import type { Location, HomePageProps } from '../../types';

const mockSetLocation = vi.fn();
const mockSetRadius = vi.fn();
const mockLocation: Location = { latitude: "0", longitude: "0" };
const mockProps: HomePageProps = {
  location: mockLocation,
  setLocation: mockSetLocation,
  radius: 25,
  setRadius: mockSetRadius,
};

describe('HomePage Component', () => {
  beforeEach(() => {
    render(
      <UserProvider>
        <Router>
          <HomePage {...mockProps} />
        </Router>
      </UserProvider>
    );
  });

  it('renders the SideQuest logo', () => {
    const logo = screen.getByAltText('SideQuest Logo');
    expect(logo).toBeInTheDocument();
  });

  it('displays the welcome message', () => {
    const welcomeMessage = screen.getByText('Welcome to SideQuest!');
    expect(welcomeMessage).toBeInTheDocument();
  });

  it('renders the DistanceSlider component', () => {
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
  });

  it('updates radius on slider change', async () => {
    const slider = screen.getByRole('slider');
    await userEvent.click(slider);
    await userEvent.keyboard('{ArrowRight}');
    expect(mockSetRadius).toHaveBeenCalledWith(26);
  });

  it('renders the Find Quests button', () => {
    const button = screen.getByRole('button', { name: 'Find Quests' });
    expect(button).toBeInTheDocument();
  });
});