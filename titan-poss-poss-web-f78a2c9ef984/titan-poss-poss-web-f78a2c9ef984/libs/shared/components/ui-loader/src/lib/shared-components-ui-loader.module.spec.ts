import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiLoaderModule } from './shared-components-ui-loader.module';

describe('SharedComponentsUiLoaderModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiLoaderModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiLoaderModule).toBeDefined();
  });
});
