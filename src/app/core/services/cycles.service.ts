import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cycle, PayloadCycle } from '../models';

@Injectable({ providedIn: 'root' })
export class CyclesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cycles`;

  public getAll(): Observable<Cycle[]> {
    return this.http.get<Cycle[]>(this.baseUrl);
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
