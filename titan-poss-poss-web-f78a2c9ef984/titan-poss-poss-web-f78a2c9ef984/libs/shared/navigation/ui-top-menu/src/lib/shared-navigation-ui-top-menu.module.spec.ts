import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedNavigationUiTopMenuModule } from './shared-navigation-ui-top-menu.module';

describe('SharedNavigationUiTopMenuModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedNavigationUiTopMenuModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedNavigationUiTopMenuModule).toBeDefined();
  });
});
