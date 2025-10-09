import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterDetail } from './shelter-detail';

describe('ShelterDetail', () => {
  let component: ShelterDetail;
  let fixture: ComponentFixture<ShelterDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelterDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelterDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
