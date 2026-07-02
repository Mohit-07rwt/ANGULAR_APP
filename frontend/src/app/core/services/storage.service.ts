import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private tokenKey = 'auth_token';

  constructor() { }

  // 💾 Save token
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // 📥 Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // 🧹 Remove token
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}