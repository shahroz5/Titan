import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedNavigationUiSideMenuModule } from './shared-navigation-ui-side-menu.module';

describe('SharedNavigationUiSideMenuModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedNavigationUiSideMenuModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedNavigationUiSideMenuModule).toBeDefined();
  });
});
