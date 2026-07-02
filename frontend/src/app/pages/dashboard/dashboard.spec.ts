import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register', // change to app-dashboard in dashboard.ts
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html', // change to dashboard.html in dashboard.ts
  styleUrl: './dashboard.scss' // change to dashboard.scss in dashboard.ts
})
export class Dashboard {}