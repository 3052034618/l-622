import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { getTestAccounts } from '@/mock/data/users';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  hasPermission: (roles: UserRole[]) => boolean;
  switchUser: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const accounts = getTestAccounts();
        const account = accounts.find(a => a.username === username && a.password === password);
        
        if (account) {
          set({
            user: account.user,
            token: `mock-token-${Date.now()}`,
            isAuthenticated: true,
          });
          return { success: true, message: '登录成功' };
        }
        
        return { success: false, message: '用户名或密码错误' };
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('health-platform-auth');
      },
      
      hasPermission: (roles: UserRole[]) => {
        const user = get().user;
        if (!user) return false;
        return roles.includes(user.role);
      },
      
      switchUser: (role: UserRole) => {
        const accounts = getTestAccounts();
        const account = accounts.find(a => a.user.role === role);
        if (account) {
          set({
            user: account.user,
            token: `mock-token-${Date.now()}`,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: 'health-platform-auth',
    }
  )
);
