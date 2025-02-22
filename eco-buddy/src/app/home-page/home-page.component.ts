declare const google: any;

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [CommonModule, FormsModule],
})
export class HomepageComponent {
  routeRenderers: any[] = [];
  routeLabels: any[] = [];
  routeOverlays: any[] = [];
  routes: any[] = []; // Routes array
  fromLocation: string = '';
  toLocation: string = '';
  travelMode: string = 'DRIVING'; // Default to DRIVING
  vehicleFuelEfficiency: number = 15; // km per liter (for a gasoline car)
  carEmissionFactor: number = 2.31; // kg CO2 per liter of gasoline
  publicTransportEmissionFactor: number = 0.05; // kg CO2 per person per km (for public transport)
  walkingEmissionFactor: number = 0; // No emissions for walking

  map: any;
  directionsService: any;

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
      provideRouteAlternatives: true, // Get multiple routes
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.clearRoutes();

        // Select only the top 3 routes
        const topRoutes = result.routes.slice(0, 3);

        let bestRouteIndex = -1;
        let lowestCO2Emissions = Infinity;

        // Iterate over routes to calculate CO2 emissions and find the best one
        topRoutes.forEach((route: any, index: number) => {
          const distance = route.legs[0].distance.value / 1000; // Convert meters to km
          const co2Emissions = this.calculateCO2Emissions(distance);

          // If this route has the lowest emissions, store it
          if (co2Emissions < lowestCO2Emissions) {
            lowestCO2Emissions = co2Emissions;
            bestRouteIndex = index;
          }

          const renderer = new google.maps.DirectionsRenderer({
            map: this.map,
            directions: result,
            routeIndex: index,
            polylineOptions: {
              strokeColor: this.getRouteColor(index),
              strokeWeight: 5,
            },
          });

          this.routeRenderers.push(renderer);

          const label = this.createRouteLabel(route, index, co2Emissions);
          this.routeLabels.push(label);

          const path = route.overview_path;
          const overlay = new google.maps.Polyline({
            path: path,
            strokeOpacity: 0,
            strokeWeight: 15,
            map: this.map,
          });

          overlay.addListener('click', () => {
            this.hideAllLabels();
            label.open(this.map);
          });

          this.routeOverlays.push(overlay);
        });

        // Highlight the best route with the lowest CO2 emissions
        this.highlightBestRoute(bestRouteIndex);

        // Store the routes in the `routes` array
        this.routes = topRoutes;
      } else {
        alert('Directions request failed: ' + status);
      }
    });
  }

  calculateCO2Emissions(distance: number): number {
    let emissionFactor: number;

    // Adjust emission factor based on travel mode
    if (this.travelMode === 'DRIVING') {
      emissionFactor = this.carEmissionFactor; // Emission factor for driving
    } else if (this.travelMode === 'WALKING') {
      emissionFactor = this.walkingEmissionFactor; // No emissions for walking
    } else if (this.travelMode === 'TRANSIT') {
      emissionFactor = this.publicTransportEmissionFactor; // Emission factor for public transport
    } else {
      emissionFactor = this.carEmissionFactor; // Default to driving emissions if unknown mode
    }

    // Calculate CO2 emissions in kg
    if (this.travelMode === 'WALKING') {
      return 0; // No emissions for walking
    } else {
      const fuelConsumed = distance / this.vehicleFuelEfficiency; // Distance / fuel efficiency
      return fuelConsumed * emissionFactor; // Fuel consumed * emission factor
    }
  }

  clearRoutes() {
    this.routeRenderers.forEach(renderer => renderer.setMap(null));
    this.routeRenderers = [];
    this.routeOverlays.forEach(overlay => overlay.setMap(null));
    this.routeOverlays = [];
    this.routeLabels.forEach(label => label.close());
    this.routeLabels = [];
  }

  getRouteColor(index: number): string {
    const colors = ['#FF0000', '#0000FF', '#008000']; // Red, Blue, Green
    return colors[index % colors.length];
  }

  createRouteLabel(route: any, index: number, co2Emissions: number) {
    const leg = route.legs[0];
    if (leg) {
      const midpointIndex = Math.floor(leg.steps.length / 2);
      const midpoint = leg.steps[midpointIndex].end_location;

      return new google.maps.InfoWindow({
        content: `<div style="
          background: rgba(255, 255, 255, 0.9);
          padding: 5px;
          border-radius: 5px;
          font-size: 12px;
          color: #333;
          font-weight: bold;">
          Route ${index + 1}<br>${leg.distance.text} - ${leg.duration.text}<br>CO2 Emissions: ${co2Emissions.toFixed(2)} kg
        </div>`,
        position: midpoint,
      });
    }
  }

  highlightBestRoute(bestRouteIndex: number) {
    // Highlight the best route (route with lowest CO2 emissions)
    const bestRouteRenderer = this.routeRenderers[bestRouteIndex];
    bestRouteRenderer.setOptions({
      polylineOptions: {
        strokeColor: '#00FF00', // Highlight with Green
      },
    });
  }

  hideAllLabels() {
    this.routeLabels.forEach(label => label.close());
  }
}
