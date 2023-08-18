import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilNotificationModule } from './shared-util-notification.module';

describe('SharedUtilNotificationModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedUtilNotificationModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUtilNotificationModule).toBeDefined();
  });
});
