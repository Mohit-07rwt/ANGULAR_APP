// // import { Component, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import {
// //   FormBuilder,
// //   FormGroup,
// //   ReactiveFormsModule,
// //   Validators
// // } from '@angular/forms';
// // import { RouterLink } from '@angular/router';

// // @Component({
// //   selector: 'app-register',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     ReactiveFormsModule,
// //     RouterLink
// //   ],
// //   templateUrl: './register.html',
// //   styleUrl: './register.scss'
// // })
// // export class Register implements OnInit {
// //   registerForm!: FormGroup;



// //   constructor(private fb: FormBuilder) {}



// //   ngOnInit(): void {
// //     this.registerForm = this.fb.group({
// //       firstName: ['', Validators.required],
// //       lastName: ['', Validators.required],
// //       email: ['', [Validators.required, Validators.email]],
// //       password: ['', [Validators.required, Validators.minLength(6)]],
// //       confirmPassword: ['', Validators.required]
// //     });
// //   }
  
  
// //   onSubmit() {
// //       if (this.registerForm.invalid) return;
  
// //       this.authService.register(this.registerForm.value).subscribe({
// //         next: (res: any) => {

// //           // 🔐 SAVE TOKEN (if backend returns it)
// //           this.storage.saveToken(res.token);

// //           // 🚀 GO TO DASHBOARD
// //           this.router.navigate(['/dashboard']);

// //         },
// //         error: (err: any) => {
// //           console.error(err);
// //         }
// //       });
// // }
// // }




// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators
// } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';

// import { AuthService } from '../../core/services/auth.service';
// import { StorageService } from '../../core/services/storage.service';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     RouterLink
//   ],
//   templateUrl: './register.html',
//   styleUrls: ['./register.scss']
// })
// export class RegisterComponent implements OnInit {

//   registerForm!: FormGroup;
//   isLoading = false;
//   errorMsg = '';

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private storage: StorageService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.registerForm = this.fb.group({
//       firstName: ['', Validators.required],
//       lastName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       confirmPassword: ['', Validators.required]
//     });
//   }

//   onSubmit() {
//     if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
//   alert("Passwords do not match");
//   return;
// }

//     this.authService.register(this.registerForm.value).subscribe({
//       next: (res: any) => {
//         this.isLoading = false;

//         // ⚠️ only if backend returns token
//         if (res?.token) {
//           this.storage.saveToken(res.token);
//           this.router.navigate(['/dashboard']);
//         } else {
//           this.router.navigate(['/login']);
//         }

//       },
//       error: (err: any) => {
//         this.isLoading = false;
//         this.errorMsg = 'Registration failed';
//         console.error(err);
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  isLoading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storage: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMsg = "Passwords do not match";
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    // remove confirmPassword before sending
    const payload = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res?.token) {
          this.storage.saveToken(res.token);
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        } else {
          this.router.navigate(['/login'], { replaceUrl: true });
        }
      },

      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = 'Registration failed';
        console.error(err);
      }
    });
  }
}