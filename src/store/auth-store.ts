import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: { name: string; role: string } | null; // Ensure `role` and `name` match your backend response
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        try {
          const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('Invalid credentials');
          }

          const data = await response.json();
          
          // Debugging: Check the login response
          console.log('Login response:', data);

          set({ user: data, token: data.token });

          // Set token in local storage for persistence
          localStorage.setItem('token', data.token);
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token'); // Clear token
      },
    }),
    {
      name: 'auth-storage', // Store name
      partialize: (state) => ({ user: state.user, token: state.token }), // Persist only user and token
    }
  )
);
