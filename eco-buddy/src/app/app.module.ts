import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GamaComponent } from './gama/gama.component';
 import { GamificationService } from './gama/gama.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    GamaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,

  ],
  providers: [GamificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
