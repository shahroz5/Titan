import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiCheckboxGridModule } from './shared-components-ui-checkbox-grid.module';

describe('SharedComponentsUiCheckboxGridModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiCheckboxGridModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiCheckboxGridModule).toBeDefined();
  });
});
