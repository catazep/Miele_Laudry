import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Tariff } from '../models';

@Injectable({ providedIn: 'root' })
export class TariffsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tariffs`;

  public getAll(): Observable<Tariff[]> {
    return this.http.get<Tariff[]>(this.baseUrl);
  }

  public getById(id: string): Observable<Tariff> {
    return this.http.get<Tariff>(`${this.baseUrl}/${id}`);
  }
}
