import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilAdaptorsModule } from './shared-util-adaptors.module';

describe('SharedUtilAdaptorsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedUtilAdaptorsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUtilAdaptorsModule).toBeDefined();
  });
});
