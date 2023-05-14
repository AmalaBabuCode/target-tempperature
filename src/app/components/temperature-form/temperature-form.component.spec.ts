import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureFormComponent } from './temperature-form.component';
import { ReactiveFormsModule } from '@angular/forms';

fdescribe('TemperatureFormComponent', () => {
  let component: TemperatureFormComponent;
  let fixture: ComponentFixture<TemperatureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemperatureFormComponent ],
      imports: [ ReactiveFormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with required controls', () => {
    const form = component.temperatureForm;
    expect(form.get('minTemperature')).toBeTruthy();
    expect(form.get('maxTemperature')).toBeTruthy();
    expect(form.get('targetTemperature')).toBeTruthy();
  });

  it('should validate the form as invalid if any field is empty', () => {
    const form = component.temperatureForm;
    form.patchValue({
      minTemperature: 10,
      maxTemperature: 20,
      targetTemperature: null
    });
    expect(form.valid).toBeFalsy();
  });

  it('should validate the form as invalid if target temperature is outside the range', () => {
    const form = component.temperatureForm;
    form.patchValue({
      minTemperature: 10,
      maxTemperature: 20,
      targetTemperature: 5
    });
    expect(form.valid).toBeFalsy();
  });

  it('should validate the form as valid if all fields are filled correctly', () => {
    const form = component.temperatureForm;
    form.patchValue({
      minTemperature: 10,
      maxTemperature: 20,
      targetTemperature: 15
    });
    expect(form.valid).toBeTruthy();
  });

  it('should display error message for required fields', () => {
    const form = component.temperatureForm;
    fixture.detectChanges();
    const errorMessageElements = fixture.nativeElement.querySelectorAll('.text-danger');
    expect(errorMessageElements.length).toBe(3);
  });

  it('should display error message for invalid target temperature', () => {
    const form = component.temperatureForm;
    form.patchValue({
      minTemperature: 10,
      maxTemperature: 20,
      targetTemperature: 5
    });
    fixture.detectChanges();
    const errorMessageElement = fixture.nativeElement.querySelector('.text-danger');
    expect(errorMessageElement.textContent).toContain('Target temperature should be between minimum and maximum temperature');
  });
});
