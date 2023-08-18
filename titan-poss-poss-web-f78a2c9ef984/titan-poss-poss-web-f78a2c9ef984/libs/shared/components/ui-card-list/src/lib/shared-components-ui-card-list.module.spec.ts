import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedComponentsUiCardListModule } from './shared-components-ui-card-list.module';

describe('SharedComponentsUiCardListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedComponentsUiCardListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedComponentsUiCardListModule).toBeDefined();
  });
});
