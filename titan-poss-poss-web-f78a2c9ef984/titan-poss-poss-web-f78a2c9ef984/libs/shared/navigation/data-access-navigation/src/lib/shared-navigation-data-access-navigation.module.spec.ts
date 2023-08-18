import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedNavigationDataAccessNavigationModule } from './shared-navigation-data-access-navigation.module';

describe('SharedNavigationDataAccessNavigationModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedNavigationDataAccessNavigationModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedNavigationDataAccessNavigationModule).toBeDefined();
  });
});
