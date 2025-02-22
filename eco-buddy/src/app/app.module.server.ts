import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';  // Import the AppModule
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,  // Import AppModule here
    ServerModule
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
