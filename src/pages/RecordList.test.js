import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RecordList from './RecordList';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import Swal from 'sweetalert2';

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

describe('RecordList Component', () => {
    const mockSetBalance = jest.fn();
    const mockAxios = new MockAdapter(axios);

    const mockRecords = [
        { id: 1, operationType: 'Addition', operationResponse: '10', date: '2024-11-21T12:00:00Z' },
        { id: 2, operationType: 'Subtraction', operationResponse: '-5', date: '2024-11-20T15:30:00Z' },
        { id: 3, operationType: 'Multiplication', operationResponse: '20', date: '2024-11-19T08:45:00Z' },
    ];

    beforeEach(() => {
        mockAxios.reset(); // Reset mock between tests
        mockAxios.onGet('/calculator/records').reply(200, mockRecords); // Mock fetching records
        mockAxios.onGet('/calculator/balance').reply(200, 100); // Mock fetching balance
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders RecordList and fetches records', async () => {
        render(
            <Router>
                <RecordList setBalance={mockSetBalance} />
            </Router>
        );

        expect(screen.getByText(/Records List/i)).toBeInTheDocument();
        expect(mockAxios.history.get.length).toBe(2); // Verify both records and balance were fetched

        // Wait for records to load
        await waitFor(() => {
            expect(screen.getByText(/Addition/i)).toBeInTheDocument();
            expect(screen.getByText(/Subtraction/i)).toBeInTheDocument();
        });
    });

    test('filters records based on search input', async () => {
        render(
            <Router>
                <RecordList setBalance={mockSetBalance} />
            </Router>
        );

        // Wait for records to load
        await waitFor(() => {
            expect(screen.getByText(/Addition/i)).toBeInTheDocument();
        });

        // Enter a search term
        fireEvent.change(screen.getByLabelText(/Search Records/i), {
            target: { value: 'Subtraction' },
        });

        // Verify filtered result
        expect(screen.getByText(/Subtraction/i)).toBeInTheDocument();
        expect(screen.queryByText(/Addition/i)).not.toBeInTheDocument();
    });

    test('pagination is showed', async () => {
        render(
            <Router>
                <RecordList setBalance={mockSetBalance} />
            </Router>
        );

        // Wait for records to load
        await waitFor(() => {
            expect(screen.getByText(/Addition/i)).toBeInTheDocument();
        });

        // Find the rows per page dropdown
        const rowsPerPageDropdown = screen.getByLabelText(/Rows per page/i);

        // Open the dropdown (Material-UI dropdown requires mouseDown event to open)
        fireEvent.mouseDown(rowsPerPageDropdown);

        // Verify the change
        await waitFor(() => {
            expect(rowsPerPageDropdown).toHaveTextContent('5');
        });
    });

    test('handles errors during fetch', async () => {
        mockAxios.onGet('/calculator/records').reply(500); // Mock failure for fetching records

        render(
            <Router>
                <RecordList setBalance={mockSetBalance} />
            </Router>
        );

        // Verify error alert is shown
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    icon: 'error',
                    title: 'Error while trying to fetch records',
                })
            );
        });
    });
});
