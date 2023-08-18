import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedPurityDataAccessPurityModule } from './shared-purity-data-access-purity.module';

describe('SharedPurityDataAccessPurityModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedPurityDataAccessPurityModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedPurityDataAccessPurityModule).toBeDefined();
  });
});
