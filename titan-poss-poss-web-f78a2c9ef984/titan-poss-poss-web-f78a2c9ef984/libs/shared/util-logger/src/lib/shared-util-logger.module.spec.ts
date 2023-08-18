import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilLoggerModule } from './shared-util-logger.module';

describe('SharedUtilLoggerModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedUtilLoggerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUtilLoggerModule).toBeDefined();
  });
});
