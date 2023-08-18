import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedOneTimePasswordDataAccessOneTimePasswordModule } from './shared-one-time-password-data-access-one-time-password.module';

describe('SharedOneTimePasswordDataAccessOneTimePasswordModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedOneTimePasswordDataAccessOneTimePasswordModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedOneTimePasswordDataAccessOneTimePasswordModule).toBeDefined();
  });
});
