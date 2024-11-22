import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import axiosInstance from '../AxiosConfig'
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';

const mockAxios = new MockAdapter(axiosInstance);

describe('Login Component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('renders the login form', () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByText(/login/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('handles successful login', async () => {
        mockAxios.onPost('/auth/login').reply(200, { token: 'test-token' });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(localStorage.getItem('user')).toBe('test@example.com');
            expect(localStorage.getItem('token')).toBe('test-token');
            expect(screen.getByText(/login successfully!/i)).toBeInTheDocument();
        });
    });

    test('handles login failure', async () => {
        mockAxios.onPost('/auth/login').reply(400);

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: 'wrongpassword' },
        });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/an error occured!/i)).toBeInTheDocument();
        });
    });

    test('disables the login button while saving', async () => {
        mockAxios.onPost('/auth/login').reply(200, { token: 'test-token' });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: 'password123' },
        });

        const loginButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(loginButton);

        expect(loginButton).toBeDisabled();

        await waitFor(() => {
            expect(loginButton).not.toBeDisabled();
        });
    });
});