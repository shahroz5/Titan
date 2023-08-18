import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCourierFeatureCourierDetailModule } from './shared-courier-feature-courier-detail.module';

describe('SharedCourierFeatureCourierDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCourierFeatureCourierDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCourierFeatureCourierDetailModule).toBeDefined();
  });
});
