import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiDynamicFormModule } from './shared-components-ui-dynamic-form.module';

describe('SharedComponentsUiDynamicFormModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiDynamicFormModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiDynamicFormModule).toBeDefined();
  });
});
