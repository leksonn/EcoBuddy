declare const google: any;

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule


@Component({
  selector: 'app-homepage',
  standalone: true, // ✅ Ensure the component is standalone
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [CommonModule, FormsModule] // ✅ Add CommonModule for *ngIf, *ngFor
})
export class HomepageComponent {
  routeRenderers: any[] = [];
  routeLabels: any[] = [];

  fromLocation: string = '';
  toLocation: string = '';
  travelMode: string = 'DRIVING';
  routes: any[] = [];

  map: any;
  directionsService: any;
  directionsRenderers: any[] = [];

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 43.8563, lng: 18.4131 },
      zoom: 12,
    });

    this.directionsService = new google.maps.DirectionsService();
  }

  calculateRoute() {
    const request = {
      origin: this.fromLocation,
      destination: this.toLocation,
      travelMode: google.maps.TravelMode[this.travelMode],
      provideRouteAlternatives: true, // Enable multiple routes
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        // Clear existing routes before displaying new ones
        this.routeRenderers.forEach((renderer) => renderer.setMap(null));
        this.routeRenderers = [];

        result.routes.forEach((route: any, index: number) => {
          // Create a new renderer for each route
          const renderer = new google.maps.DirectionsRenderer({
            map: this.map,
            directions: result,
            routeIndex: index,
            polylineOptions: {
              strokeColor: this.getRouteColor(index), // Assign unique colors
              strokeWeight: 5,
            },
          });

          this.routeRenderers.push(renderer);

          // Add labels with distance & duration
          this.addRouteLabel(route, index);
        });
      } else {
        alert('Directions request failed: ' + status);
      }
    });
  }

// Generate different colors for each route
  getRouteColor(index: number): string {
    const colors = ['#FF0000', '#0000FF', '#008000', '#FFA500']; // Red, Blue, Green, Orange
    return colors[index % colors.length]; // Cycle through colors
  }

// Add labels for distance & duration on the map
  addRouteLabel(route: any, index: number) {
    const leg = route.legs[0];

    if (leg) {
      // Get the midpoint of the route
      const midpointIndex = Math.floor(leg.steps.length / 2);
      const midpoint = leg.steps[midpointIndex].end_location;

      // Create the label (small InfoWindow)
      const label = new google.maps.InfoWindow({
        content: `
        <div style="
          background: rgba(255, 255, 255, 0.9);
          padding: 5px;
          border-radius: 5px;
          font-size: 12px;
          color: #333;
          font-weight: bold;
        ">
          Route ${index + 1}<br>
          ${leg.distance.text} - ${leg.duration.text}
        </div>`,
        position: midpoint,
      });

      // Display the label
      label.open(this.map);
      this.routeLabels.push(label);
    }
  }

  clearRoutes() {
    this.directionsRenderers.forEach(renderer => renderer.setMap(null));
    this.directionsRenderers = [];
  }
}
