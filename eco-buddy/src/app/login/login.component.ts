import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:false
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    // Normally, you would call a service here to authenticate the user
    if (this.username && this.password) {
      // Simulate successful login
      console.log('Logged in successfully');
      this.router.navigate(['/dashboard']); // Navigate to the dashboard or home page
    } else {
      alert('Please fill in both fields');
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']); // Navigate to the signup page
  }
}
