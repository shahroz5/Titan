import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCourierFeatureCourierListingModule } from './shared-courier-feature-courier-listing.module';

describe('SharedCourierFeatureCourierListingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCourierFeatureCourierListingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCourierFeatureCourierListingModule).toBeDefined();
  });
});
