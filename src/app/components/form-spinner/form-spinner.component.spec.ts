import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSpinnerComponent } from './form-spinner.component';

describe('FormSpinnerComponent', () => {
  let component: FormSpinnerComponent;
  let fixture: ComponentFixture<FormSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormSpinnerComponent]
    });
    fixture = TestBed.createComponent(FormSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
