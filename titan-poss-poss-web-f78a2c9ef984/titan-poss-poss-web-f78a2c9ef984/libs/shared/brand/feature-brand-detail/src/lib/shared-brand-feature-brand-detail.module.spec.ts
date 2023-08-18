import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedBrandFeatureBrandDetailModule } from './shared-brand-feature-brand-detail.module';

describe('SharedBrandFeatureBrandDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedBrandFeatureBrandDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedBrandFeatureBrandDetailModule).toBeDefined();
  });
});
