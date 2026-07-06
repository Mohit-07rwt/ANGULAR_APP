import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5173/api/Auth';

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  // Login
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // Register
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // Logout
  logout(): void {
    this.storage.clearToken();
  }

  // Check login
  isLoggedIn(): boolean {
    return !!this.storage.getToken();
  }


  //captcha
  getCaptcha(){
  return this.http.get('http://localhost:5173/api/Captcha');
  }
}