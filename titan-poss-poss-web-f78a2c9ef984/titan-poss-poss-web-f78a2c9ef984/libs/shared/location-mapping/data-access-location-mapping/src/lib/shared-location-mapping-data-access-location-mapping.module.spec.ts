import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedLocationMappingDataAccessLocationMappingModule } from './shared-location-mapping-data-access-location-mapping.module';

describe('SharedLocationMappingDataAccessLocationMappingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedLocationMappingDataAccessLocationMappingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedLocationMappingDataAccessLocationMappingModule).toBeDefined();
  });
});
