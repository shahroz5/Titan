import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemFeatureItemDetailsPopupModule } from './shared-item-feature-item-details-popup.module';

describe('SharedItemFeatureItemDetailsPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemFeatureItemDetailsPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemFeatureItemDetailsPopupModule).toBeDefined();
  });
});
