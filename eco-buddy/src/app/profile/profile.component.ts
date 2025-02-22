import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Agent } from 'http';

export interface User {
  name: string;
  age: number;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] 
  //Urls umjesto Url ako css ne bude radio pitat amnu jel joj radi
})
export class ProfileComponent implements OnInit{
  user: User = {name: '', age: 0};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  updateUser(): void {
    this.userService.setUser({ name: 'Ime Prezime', age: 99});
    this.user = {name: 'Ime Prezime', age: 99};
  }
}
