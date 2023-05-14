import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TemperatureFormComponent } from './components/temperature-form/temperature-form.component';
import { TemperatureDisplayComponent } from './components/temperature-display/temperature-display.component';

@NgModule({
  declarations: [
    AppComponent,
    TemperatureFormComponent,
    TemperatureDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
