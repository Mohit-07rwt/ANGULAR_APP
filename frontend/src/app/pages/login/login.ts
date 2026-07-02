import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
   styleUrls: ['./login.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMsg = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storage: StorageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // 🔐 LOGIN METHOD (ONLY ONE - CLEAN)
  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const token = res?.token || res?.jwt;

        if (!token) {
          this.errorMsg = 'Invalid server response';
          return;
        }

        this.storage.saveToken(token);
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },

      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = 'Invalid email or password';
        console.error(err);
      }
    });
  }

  // 🚪 LOGOUT (optional, keep if used here)
  logout() {
    this.storage.clearToken();
    this.router.navigate(['/login']);
  }
}