import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedOverlayNotificationFeatureOverlayNotificationModule } from './shared-overlay-notification-feature-overlay-notification.module';

describe('SharedOverlayNotificationFeatureOverlayNotificationModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedOverlayNotificationFeatureOverlayNotificationModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(
      SharedOverlayNotificationFeatureOverlayNotificationModule
    ).toBeDefined();
  });
});
