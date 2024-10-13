export const logout = () => {
    localStorage.removeItem('token');
    // You can add any additional cleanup here
    window.location.href = '/login'; // Redirect to login page after logout
};

export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};