// test/todo-list.test.tsx

import { screen } from '@testing-library/dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { TodoList } from '../src/components/TodoList';

// mock the analytic hook
jest.mock('../src/hooks/analytics.hook', () => ({
    useAnalytics: () => ({
        client: { capture: jest.fn() }
    })
}));


describe('TodoList', () => {
    test('should add a new todo when entering a name and pressing Enter', async () => {
        render(React.createElement(TodoList));

        // show the add task input
        const addButton = screen.getByRole('button', { name: /Add Task/i });
        fireEvent.click(addButton);

        // enter the task
        const todoInput = screen.getByPlaceholderText(/Enter todo name/i);
        fireEvent.change(todoInput, { target: { value: 'Take my dog for a walk' } });

        // invoke the enter key
        fireEvent.keyDown(todoInput, { key: 'Enter', code: 'Enter' });

        // wait for the new todo to appear in the list
        await waitFor(() => {
            expect(screen.getByText('Take my dog for a walk')).toBeInTheDocument();
        });
    });
});
