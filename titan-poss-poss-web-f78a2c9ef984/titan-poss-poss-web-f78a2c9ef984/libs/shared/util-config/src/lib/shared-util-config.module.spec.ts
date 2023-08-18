import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUtilConfigModule } from './shared-util-config.module';

describe('SharedUtilConfigModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedUtilConfigModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUtilConfigModule).toBeDefined();
  });
});
