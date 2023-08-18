import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProductGroupMappingFeatureProductGroupMappingModule } from './shared-product-group-mapping-feature-product-group-mapping.module';

describe('SharedProductGroupMappingFeatureProductGroupMappingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedProductGroupMappingFeatureProductGroupMappingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      SharedProductGroupMappingFeatureProductGroupMappingModule
    ).toBeDefined();
  });
});
