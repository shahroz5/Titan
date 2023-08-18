import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiFormFieldControlsModule } from './shared-components-ui-form-field-controls.module';

describe('SharedComponentsUiFormFieldControlsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiFormFieldControlsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiFormFieldControlsModule).toBeDefined();
  });
});
