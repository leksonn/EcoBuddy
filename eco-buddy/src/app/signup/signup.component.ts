import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone:false
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(protected router: Router) {}

  signup() {
    if (this.password === this.confirmPassword) {
      // Normally, you would call a service here to create the user account
      console.log('Signed up successfully');
      this.router.navigate(['/login']); // Navigate to the login page after successful signup
    } else {
      alert('Passwords do not match');
    }
  }
}
