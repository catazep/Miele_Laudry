import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cycle, PayloadCycle } from '../models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CyclesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/cycles`;

  public getAll(): Observable<Cycle[]> {
    const user = this.auth.currentUser();
    let params = new HttpParams();
    if (user && user.role !== 'admin') {
      // Mock backend filtering based on user and user role
      params = params.set('userId', user.id);
    }
    return this.http.get<Cycle[]>(this.baseUrl, { params });
  }

  public getById(id: string): Observable<Cycle> {
    return this.http.get<Cycle>(`${this.baseUrl}/${id}`);
  }

  public create(payload: PayloadCycle): Observable<Cycle> {
    return this.http.post<Cycle>(this.baseUrl, payload);
  }

  public update(id: string, partial: Partial<PayloadCycle>): Observable<Cycle> {
    return this.http.patch<Cycle>(`${this.baseUrl}/${id}`, partial);
  }
}
