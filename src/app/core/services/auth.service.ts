import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../models';

const SESSION_KEY = 'ml_user_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly currentUser = signal<User | undefined>(this.loadSession());

  public login(id: string, password: string): Observable<User> {
    // We assume user ids are unique
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`).pipe(
      map((user) => {
        // Dummy authentication logic for demonstration purposes
        if (!user || user.password !== password) {
          throw new Error('Invalid credentials');
        }
        return user;
      }),
      tap((user) => {
        this.currentUser.set(user);
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }),
    );
  }

  public logout(): void {
    this.currentUser.set(undefined);
    localStorage.removeItem(SESSION_KEY);
  }

  public isAuthenticated(): boolean {
    return this.currentUser() !== undefined;
  }

  private loadSession(): User | undefined {
    try {
      const currentUser = localStorage.getItem(SESSION_KEY);
      return currentUser ? (JSON.parse(currentUser) satisfies User) : undefined;
    } catch (error) {
      console.error('Failed to load current user session:', error);
      return undefined;
    }
  }
}
