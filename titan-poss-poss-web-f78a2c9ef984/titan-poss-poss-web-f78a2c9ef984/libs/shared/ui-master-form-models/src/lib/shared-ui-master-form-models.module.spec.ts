import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedUiMasterFormModelsModule } from './shared-ui-master-form-models.module';

describe('SharedUiMasterFormModelsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiMasterFormModelsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedUiMasterFormModelsModule).toBeDefined();
  });
});
