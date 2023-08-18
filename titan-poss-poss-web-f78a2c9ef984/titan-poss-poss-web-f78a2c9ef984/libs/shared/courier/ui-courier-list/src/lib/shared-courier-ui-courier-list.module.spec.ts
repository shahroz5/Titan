import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCourierUiCourierListModule } from './shared-courier-ui-courier-list.module';

describe('SharedCourierUiCourierListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCourierUiCourierListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCourierUiCourierListModule).toBeDefined();
  });
});
