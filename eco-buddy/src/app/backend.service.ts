import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = 'http://localhost:2400/api/hello';
  constructor(private http: HttpClient) { }
  getHelloMessage(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
