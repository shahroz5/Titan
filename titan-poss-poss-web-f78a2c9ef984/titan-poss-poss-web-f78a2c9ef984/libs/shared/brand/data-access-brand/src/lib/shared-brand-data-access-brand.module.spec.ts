import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedBrandDataAccessBrandModule } from './shared-brand-data-access-brand.module';

describe('SharedBrandDataAccessBrandModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedBrandDataAccessBrandModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedBrandDataAccessBrandModule).toBeDefined();
  });
});
