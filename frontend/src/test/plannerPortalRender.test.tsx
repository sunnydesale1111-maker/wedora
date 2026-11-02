import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';

describe('PlannerPortal render and modal opening test', () => {
  it('renders Planner route successfully inside RouterProvider and opens Create Event modal', async () => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });
    await router.load();
    await router.navigate({ to: '/planner' });

    render(<RouterProvider router={router} />);
    expect(screen.getAllByText('Managed Client Events').length).toBeGreaterThan(0);

    const createBtn = screen.getByTestId('create-event-btn');
    expect(createBtn).toBeInTheDocument();

    // Verify clicking opens Create Event modal
    fireEvent.click(createBtn);
    expect(screen.getByTestId('create-event-modal')).toBeInTheDocument();
    expect(screen.getByTestId('tab-create-with-ai')).toBeInTheDocument();
    expect(screen.getByTestId('tab-create-manually')).toBeInTheDocument();
  });
});
