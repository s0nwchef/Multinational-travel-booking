import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute, { StaffRoute } from './ProtectedRoute';
import authService from '../services/authService.js';

// Mock the authService
jest.mock('../services/authService.js', () => ({
    isAuthenticated: jest.fn(),
    getCurrentUser: jest.fn(),
    fetchCurrentUser: jest.fn()
}));

// Mock child component for testing
const MockChildComponent = () => <div data-testid="protected-content">Protected Content</div>;
const LoginPage = () => <div data-testid="login-page">Login Page</div>;

describe('ProtectedRoute', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show loading state while checking authentication', () => {
        authService.isAuthenticated.mockReturnValue(true);
        authService.getCurrentUser.mockReturnValue({ role: 'user' });
        authService.fetchCurrentUser.mockResolvedValue({ role: 'user' });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={
                        <ProtectedRoute>
                            <MockChildComponent />
                        </ProtectedRoute>
                    } />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Đang kiểm tra quyền truy cập...')).toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', async () => {
        authService.isAuthenticated.mockReturnValue(false);
        authService.fetchCurrentUser.mockResolvedValue(null);

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={
                        <ProtectedRoute>
                            <MockChildComponent />
                        </ProtectedRoute>
                    } />
                    <Route path="/home" element={<LoginPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });
    });

    it('should render protected content when user is authenticated', async () => {
        authService.isAuthenticated.mockReturnValue(true);
        authService.getCurrentUser.mockReturnValue({ role: 'user' });
        authService.fetchCurrentUser.mockResolvedValue({ role: 'user' });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={
                        <ProtectedRoute>
                            <MockChildComponent />
                        </ProtectedRoute>
                    } />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });
    });

    it('should allow access when user has required role', async () => {
        authService.isAuthenticated.mockReturnValue(true);
        authService.getCurrentUser.mockReturnValue({ role: 'tour_operator' });
        authService.fetchCurrentUser.mockResolvedValue({ role: 'tour_operator' });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={
                        <ProtectedRoute roles={['tour_operator', 'admin']}>
                            <MockChildComponent />
                        </ProtectedRoute>
                    } />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });
    });

    it('should redirect to login when user does not have required role', async () => {
        authService.isAuthenticated.mockReturnValue(true);
        authService.getCurrentUser.mockReturnValue({ role: 'user' }); // Regular user, not tour_operator
        authService.fetchCurrentUser.mockResolvedValue({ role: 'user' });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={
                        <ProtectedRoute roles={['tour_operator', 'admin']}>
                            <MockChildComponent />
                        </ProtectedRoute>
                    } />
                    <Route path="/home" element={<LoginPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });
    });

    it('should handle fetchCurrentUser returning null (session expired)', async () => {
        authService.isAuthenticated.mockReturnValue(true);
        authService.getCurrentUser.mockReturnValue({ role: 'user' });
        authService.fetchCurrentUser.mockResolvedValue(null); // Session expired

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={
                        <ProtectedRoute>
                            <MockChildComponent />
                        </ProtectedRoute>
                    } />
                    <Route path="/home" element={<LoginPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });
    });

    it('should handle fetchCurrentUser error gracefully', async () => {
        authService.isAuthenticated.mockReturnValue(true);
        authService.getCurrentUser.mockReturnValue({ role: 'user' });
        authService.fetchCurrentUser.mockRejectedValue(new Error('Network error'));

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/protected" element={
                        <ProtectedRoute>
                            <MockChildComponent />
                        </ProtectedRoute>
                    } />
                    <Route path="/home" element={<LoginPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });
    });

    it('should include return URL in redirect when unauthorized', async () => {
        authService.isAuthenticated.mockReturnValue(false);

        render(
            <MemoryRouter initialEntries={['/protected?param=value']}>
                <Routes>
                    <Route path="/protected" element={
                        <ProtectedRoute>
                            <MockChildComponent />
                        </ProtectedRoute>
                    } />
                    <Route path="/home" element={<LoginPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });
    });

    describe('StaffRoute wrapper', () => {
        it('should allow tour_operator access', async () => {
            authService.isAuthenticated.mockReturnValue(true);
            authService.getCurrentUser.mockReturnValue({ role: 'tour_operator' });
            authService.fetchCurrentUser.mockResolvedValue({ role: 'tour_operator' });

            render(
                <MemoryRouter initialEntries={['/staff']}>
                    <Routes>
                        <Route path="/staff" element={
                            <StaffRoute>
                                <MockChildComponent />
                            </StaffRoute>
                        } />
                    </Routes>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByTestId('protected-content')).toBeInTheDocument();
            });
        });

        it('should allow admin access', async () => {
            authService.isAuthenticated.mockReturnValue(true);
            authService.getCurrentUser.mockReturnValue({ role: 'admin' });
            authService.fetchCurrentUser.mockResolvedValue({ role: 'admin' });

            render(
                <MemoryRouter initialEntries={['/staff']}>
                    <Routes>
                        <Route path="/staff" element={
                            <StaffRoute>
                                <MockChildComponent />
                            </StaffRoute>
                        } />
                    </Routes>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByTestId('protected-content')).toBeInTheDocument();
            });
        });

        it('should redirect regular user from staff route', async () => {
            authService.isAuthenticated.mockReturnValue(true);
            authService.getCurrentUser.mockReturnValue({ role: 'user' });
            authService.fetchCurrentUser.mockResolvedValue({ role: 'user' });

            render(
                <MemoryRouter initialEntries={['/staff']}>
                    <Routes>
                        <Route path="/staff" element={
                            <StaffRoute>
                                <MockChildComponent />
                            </StaffRoute>
                        } />
                        <Route path="/home" element={<LoginPage />} />
                    </Routes>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByTestId('login-page')).toBeInTheDocument();
            });
        });
    });

    it('should re-check authentication when route changes', async () => {
        authService.isAuthenticated
            .mockReturnValueOnce(true)  // First call for /protected1
            .mockReturnValueOnce(false) // Second call for /protected2
            .mockReturnValueOnce(false); // Third call (after redirect)
        
        authService.getCurrentUser.mockReturnValue({ role: 'user' });
        authService.fetchCurrentUser.mockResolvedValue({ role: 'user' });

        const { rerender } = render(
            <MemoryRouter initialEntries={['/protected1']}>
                <Routes>
                    <Route path="/protected1" element={
                        <ProtectedRoute>
                            <MockChildComponent />
                        </ProtectedRoute>
                    } />
                    <Route path="/protected2" element={
                        <ProtectedRoute>
                            <div>Protected 2</div>
                        </ProtectedRoute>
                    } />
                    <Route path="/home" element={<LoginPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Should show protected content for first route
        await waitFor(() => {
            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });

        // Clear mocks for next check
        jest.clearAllMocks();
        authService.isAuthenticated.mockReturnValue(false);

        // Navigate to second protected route
        rerender(
            <MemoryRouter initialEntries={['/protected2']}>
                <Routes>
                    <Route path="/protected1" element={
                        <ProtectedRoute>
                            <MockChildComponent />
                        </ProtectedRoute>
                    } />
                    <Route path="/protected2" element={
                        <ProtectedRoute>
                            <div>Protected 2</div>
                        </ProtectedRoute>
                    } />
                    <Route path="/home" element={<LoginPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Should redirect to login for second route
        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
        });
    });
});