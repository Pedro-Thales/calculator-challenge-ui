import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import RecordCreate from './RecordCreate';

const mockAxios = new MockAdapter(axios);

describe('RecordCreate Component', () => {
    const mockSetBalance = jest.fn();

    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('token', 'test-token');
        mockSetBalance.mockClear();
    });

    test('renders the component correctly', () => {
        render(
            <Router>
                <RecordCreate setBalance={mockSetBalance} />
            </Router>
        );

        expect(screen.getByText(/Create New Record/i)).toBeInTheDocument();
        expect(screen.getByText(/Choose the operation to perform/i)).toBeInTheDocument();
        expect(screen.getByText(/Addition/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/First Value/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Second Value/i)).toBeInTheDocument();
    });

    test('handles operation selection', () => {
        render(
            <Router>
                <RecordCreate setBalance={mockSetBalance} />
            </Router>
        );

        fireEvent.click(screen.getByText(/Square Root/i));
        expect(screen.getByLabelText(/Second Value/i)).toBeDisabled();
    });

    test('saves a record successfully', async () => {
        mockAxios.onPost('calculator/calculate').reply(200);
        mockAxios.onGet('calculator/balance').reply(200, 100);

        render(
            <Router>
                <RecordCreate setBalance={mockSetBalance} />
            </Router>
        );

        fireEvent.change(screen.getByLabelText(/First Value/i), {
            target: { value: '50' },
        });
        fireEvent.change(screen.getByLabelText(/Second Value/i), {
            target: { value: '30' },
        });

        fireEvent.click(screen.getByText(/Save Record/i));

        await waitFor(() => {
            expect(screen.getByText(/Record saved successfully!/i)).toBeInTheDocument();
        });
    });

});
