import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiFocusableListModule } from './shared-components-ui-focusable-list.module';

describe('SharedComponentsUiFocusableListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiFocusableListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiFocusableListModule).toBeDefined();
  });
});
