import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-temperature-form',
  templateUrl: './temperature-form.component.html',
  styleUrls: ['./temperature-form.component.css']
})
export class TemperatureFormComponent implements OnInit {

  temperatureForm: FormGroup = new FormGroup({
    minTemperature: new FormControl(),
    maxTemperature: new FormControl(),
    targetTemperature: new FormControl(),
  });
  isFormValid = false;
  showErrorMessage = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.temperatureForm = this.formBuilder.group({
      minTemperature: ['', Validators.required],
      maxTemperature: ['', [Validators.required, this.checkValidMaxTemperature.bind(this)]],
      targetTemperature: ['', [Validators.required, this.checkValidTargetTemperature.bind(this)]]
    });
  }

  checkValidMaxTemperature(control: AbstractControl): ValidationErrors | null {
    const minTemperature = +this.temperatureForm?.controls['minTemperature']?.value;
    const maxTemperature = control.value;

    if (maxTemperature && minTemperature  && (maxTemperature < minTemperature )) {
      return { 'invalidMaxTemperature': true };
    }
    return null;
  }

  checkValidTargetTemperature(control: AbstractControl): ValidationErrors | null {
    const minTemperature = +this.temperatureForm?.controls['minTemperature']?.value;
    const maxTemperature = +this.temperatureForm?.controls['maxTemperature']?.value;
    const targetTemperature = control.value;

    if (maxTemperature && minTemperature && targetTemperature && (targetTemperature < minTemperature || targetTemperature > maxTemperature)) {
      return { 'invalidTargetTemperature': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.temperatureForm.valid) {
      this.isFormValid = true;
      this.showErrorMessage = false;
    } else {
      this.showErrorMessage = true;
    }
  }

}
