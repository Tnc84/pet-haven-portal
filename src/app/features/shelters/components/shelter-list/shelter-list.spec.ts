import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterList } from './shelter-list';

describe('ShelterList', () => {
  let component: ShelterList;
  let fixture: ComponentFixture<ShelterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelterList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelterList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
