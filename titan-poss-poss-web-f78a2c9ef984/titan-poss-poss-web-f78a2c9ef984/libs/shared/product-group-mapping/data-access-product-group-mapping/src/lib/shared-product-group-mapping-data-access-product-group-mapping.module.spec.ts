import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProductGroupMappingDataAccessProductGroupMappingModule } from './shared-product-group-mapping-data-access-product-group-mapping.module';

describe('SharedProductGroupMappingDataAccessProductGroupMappingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedProductGroupMappingDataAccessProductGroupMappingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      SharedProductGroupMappingDataAccessProductGroupMappingModule
    ).toBeDefined();
  });
});
