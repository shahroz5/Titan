import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProfileUiProfileModule } from './shared-profile-ui-profile.module';

describe('SharedProfileUiProfileModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedProfileUiProfileModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedProfileUiProfileModule).toBeDefined();
  });
});
