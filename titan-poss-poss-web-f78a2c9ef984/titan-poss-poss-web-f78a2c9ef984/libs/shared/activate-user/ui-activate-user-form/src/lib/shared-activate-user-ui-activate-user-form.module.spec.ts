import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedActivateUserUiActivateUserFormModule } from './shared-activate-user-ui-activate-user-form.module';

describe('SharedActivateUserUiActivateUserFormModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedActivateUserUiActivateUserFormModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedActivateUserUiActivateUserFormModule).toBeDefined();
  });
});
