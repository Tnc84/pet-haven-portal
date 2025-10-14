import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimalService } from '../../core/services/animal.service';
import { of, throwError } from 'rxjs';
import { HappyTails } from './happy-tails';

describe('HappyTails', () => {
  let component: HappyTails;
  let fixture: ComponentFixture<HappyTails>;
  let mockAnimalService: jasmine.SpyObj<AnimalService>;

  beforeEach(async () => {
    const animalServiceSpy = jasmine.createSpyObj('AnimalService', ['getAnimals']);

    await TestBed.configureTestingModule({
      imports: [HappyTails],
      providers: [
        { provide: AnimalService, useValue: animalServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HappyTails);
    component = fixture.componentInstance;
    mockAnimalService = TestBed.inject(AnimalService) as jasmine.SpyObj<AnimalService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load animals on init', () => {
    const mockAnimals = [
      { id: 1, name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', age: 3, gender: 'Male' },
      { id: 2, name: 'Whiskers', type: 'Cat', breed: 'Persian', age: 2, gender: 'Female' }
    ];
    
    mockAnimalService.getAnimals.and.returnValue(of(mockAnimals));
    
    component.ngOnInit();
    
    expect(mockAnimalService.getAnimals).toHaveBeenCalled();
    expect(component.animals).toEqual(mockAnimals);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading animals', () => {
    mockAnimalService.getAnimals.and.returnValue(throwError(() => new Error('API Error')));
    
    component.ngOnInit();
    
    expect(component.error).toBe('Failed to load animals');
    expect(component.loading).toBeFalse();
  });

  it('should get correct animal type icon', () => {
    expect(component.getAnimalTypeIcon('Dog')).toBe('🐕');
    expect(component.getAnimalTypeIcon('Cat')).toBe('🐱');
    expect(component.getAnimalTypeIcon('Bird')).toBe('🐦');
    expect(component.getAnimalTypeIcon('Unknown')).toBe('🐾');
  });

  it('should generate random animal image path', () => {
    const animal = { id: 5, name: 'Test' };
    const imagePath = component.getRandomAnimalImage(animal);
    expect(imagePath).toBe('assets/images/animals/animal-6.svg');
  });
});
