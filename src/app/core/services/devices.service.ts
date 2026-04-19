import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Device } from '../models';

@Injectable({ providedIn: 'root' })
export class DevicesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/devices`;

  public getAll(): Observable<Device[]> {
    return this.http.get<Device[]>(this.baseUrl);
  }

  public getById(id: string): Observable<Device> {
    return this.http.get<Device>(`${this.baseUrl}/${id}`);
  }
}
