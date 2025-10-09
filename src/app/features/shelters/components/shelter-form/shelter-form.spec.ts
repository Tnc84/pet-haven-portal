import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterForm } from './shelter-form';

describe('ShelterForm', () => {
  let component: ShelterForm;
  let fixture: ComponentFixture<ShelterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelterForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelterForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
