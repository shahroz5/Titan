import { TestBed, waitForAsync } from '@angular/core/testing';
import { SharedAuthDataAccessAuthModule } from './shared-auth-data-access-auth.module';

describe('SharedAuthDataAccessAuthModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedAuthDataAccessAuthModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedAuthDataAccessAuthModule).toBeDefined();
  });
});
