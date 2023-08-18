import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiAddressPanelModule } from './shared-components-ui-address-panel.module';

describe('SharedComponentsUiAddressPanelModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiAddressPanelModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiAddressPanelModule).toBeDefined();
  });
});
