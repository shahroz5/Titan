import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedStoneUiStoneListModule } from './shared-stone-ui-stone-list.module';

describe('SharedStoneUiStoneListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedStoneUiStoneListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedStoneUiStoneListModule).toBeDefined();
  });
});
