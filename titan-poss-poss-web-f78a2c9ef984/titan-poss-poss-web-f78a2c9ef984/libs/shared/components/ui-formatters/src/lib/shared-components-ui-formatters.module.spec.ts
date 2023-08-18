import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiFormattersModule } from './shared-components-ui-formatters.module';

describe('SharedComponentsUiFormattersModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiFormattersModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiFormattersModule).toBeDefined();
  });
});
