import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedLoginUiLoginFormModule } from './shared-login-ui-login-form.module';

describe('SharedLoginUiLoginFormModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedLoginUiLoginFormModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedLoginUiLoginFormModule).toBeDefined();
  });
});
