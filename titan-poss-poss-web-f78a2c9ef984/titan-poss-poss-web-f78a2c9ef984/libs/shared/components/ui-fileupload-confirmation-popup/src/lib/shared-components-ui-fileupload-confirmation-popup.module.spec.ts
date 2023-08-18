import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiFileuploadConfirmationPopupModule } from './shared-components-ui-fileupload-confirmation-popup.module';

describe('SharedComponentsUiFileuploadConfirmationPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiFileuploadConfirmationPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiFileuploadConfirmationPopupModule).toBeDefined();
  });
});
