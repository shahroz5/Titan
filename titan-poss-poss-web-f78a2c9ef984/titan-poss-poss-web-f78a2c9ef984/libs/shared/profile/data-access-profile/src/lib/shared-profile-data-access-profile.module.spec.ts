import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedProfileDataAccessProfileModule } from './shared-profile-data-access-profile.module';

describe('SharedProfileDataAccessProfileModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedProfileDataAccessProfileModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedProfileDataAccessProfileModule).toBeDefined();
  });
});
