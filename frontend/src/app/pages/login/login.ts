// import { Component,OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';

// import { AuthService } from '../../core/services/auth.service';
// import { StorageService } from '../../core/services/storage.service';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [ReactiveFormsModule,RouterLink,CommonModule,MatProgressSpinnerModule],
//   templateUrl: './login.html',
//    styleUrls: ['./login.scss']
// })

// export class LoginComponent implements OnInit {

//   loginForm: FormGroup;
//   errorMsg = '';
//   isLoading = false;
//   captchaImage: string = '';
//   captchaId: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private storage: StorageService,
//     private router: Router
//   ) {
//     // ✅ FORM MUST BE INSIDE CONSTRUCTOR
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       captchaId: [''],
//       captchaText: ['', [Validators.required]]
//     });
//   }

//   // ✅ NGONINIT MUST BE INSIDE CLASS (AFTER CONSTRUCTOR)
//   ngOnInit() {
//     this.loadCaptcha();
//   }

//   // 🔐 LOGIN METHOD
//   onSubmit() {
//     if (this.loginForm.invalid) return;

//     this.isLoading = true;
//     this.errorMsg = '';

//     const payload = {
//       email: this.loginForm.value.email,
//       password: this.loginForm.value.password,
//       captchaId: this.loginForm.value.captchaId,
//       captchaText: this.loginForm.value.captchaText
//     };

//     this.authService.login(payload).subscribe({
//       next: (res: any) => {
//         this.isLoading = false;

//         const token = res?.token || res?.jwt;

//         if (!token) {
//           this.errorMsg = 'Invalid server response';
//           return;
//         }

//         this.storage.saveToken(token);

//         localStorage.setItem('username', res.username);
//         localStorage.setItem('email', res.email);
//         localStorage.setItem('role', res.role);

//         this.router.navigate(['/dashboard'], { replaceUrl: true });
//       },

//       error: (err: any) => {
//         this.isLoading = false;
//         this.errorMsg = 'Invalid email/password or captcha incorrect';

//         console.error(err);

//         this.loadCaptcha();

//         this.loginForm.patchValue({
//           captchaText: ''
//         });
//       }
//     });
//   }

//   logout() {
//     this.storage.clearToken();
//     this.router.navigate(['/login']);
//   }

//   // 🔄 CAPTCHA
//   loadCaptcha() {
//     this.authService.getCaptcha().subscribe({
//       next: (res: any) => {
//         this.captchaImage = 'data:image/png;base64,' + res.imageBase64;
//         this.captchaId = res.captchaId;

//         this.loginForm.patchValue({
//           captchaId: res.captchaId
//         });
//       },
//       error: (err:any) => {
//         console.log('Captcha load failed', err);
//       }
//     });
//   }
// }




import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  errorMsg = '';
  isLoading = false;
  captchaImage: string = '';
  captchaId: string = '';

  private captchaRefreshTimer: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storage: StorageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      captchaId: [''],
      captchaText: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadCaptcha();

    // auto-refresh the captcha every 2 minutes to match backend expiry
    this.captchaRefreshTimer = setInterval(() => {
      this.loadCaptcha();
    }, 2 * 60 * 1000);
  }

  ngOnDestroy() {
    if (this.captchaRefreshTimer) {
      clearInterval(this.captchaRefreshTimer);
    }
  }

  // 🔐 LOGIN METHOD
  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMsg = '';

    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      captchaId: this.loginForm.value.captchaId,
      captchaValue: this.loginForm.value.captchaText // ✅ matches backend LoginRequest.CaptchaValue
    };

    this.authService.login(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const token = res?.token || res?.jwt;

        if (!token) {
          this.errorMsg = 'Invalid server response';
          return;
        }

        this.storage.saveToken(token);

        localStorage.setItem('username', res.username);
        localStorage.setItem('email', res.email);
        localStorage.setItem('role', res.role);

        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },

      error: (err: any) => {
        this.isLoading = false;

        // show the backend's specific captcha message when available,
        // otherwise fall back to a generic message
        this.errorMsg = err?.error?.message || 'Invalid email/password or captcha incorrect';

        console.error(err);

        this.loadCaptcha();

        this.loginForm.patchValue({
          captchaText: ''
        });
      }
    });
  }

  logout() {
    this.storage.clearToken();
    this.router.navigate(['/login']);
  }

  // 🔄 CAPTCHA
  loadCaptcha() {
    this.authService.getCaptcha().subscribe({
      next: (res: any) => {
        this.captchaImage = 'data:image/png;base64,' + res.imageBase64;
        this.captchaId = res.captchaId;

        this.loginForm.patchValue({
          captchaId: res.captchaId
        });
      },
      error: (err: any) => {
        console.log('Captcha load failed', err);
      }
    });
  }
}