import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedSubBrandDataAccessSubBrandModule } from './shared-sub-brand-data-access-sub-brand.module';

describe('SharedSubBrandDataAccessSubBrandModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedSubBrandDataAccessSubBrandModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedSubBrandDataAccessSubBrandModule).toBeDefined();
  });
});
