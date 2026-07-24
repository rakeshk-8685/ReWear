import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    isAuthenticated: computed(() => !!state.user() && !!state.token()),
    userRole: computed(() => state.user()?.role || 'USER'),
    isAdmin: computed(() => state.user()?.role === 'ADMIN' || state.user()?.role === 'MODERATOR'),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    setUser(user: User | null, token: string | null) {
      patchState(store, { user, token });
    },
    logout() {
      authService.logout();
      patchState(store, { user: null, token: null });
    },
  }))
);
