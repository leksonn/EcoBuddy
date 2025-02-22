import { Component, OnInit } from '@angular/core';
import { BackendService } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'eco-buddy';
  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.backendService.getHelloMessage().subscribe((data)=> {
      this.title = data.title;
    });
  }
}
