import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedLocationMappingFeatureLocationMappingModule } from './shared-location-mapping-feature-location-mapping.module';

describe('SharedLocationMappingFeatureLocationMappingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedLocationMappingFeatureLocationMappingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedLocationMappingFeatureLocationMappingModule).toBeDefined();
  });
});
