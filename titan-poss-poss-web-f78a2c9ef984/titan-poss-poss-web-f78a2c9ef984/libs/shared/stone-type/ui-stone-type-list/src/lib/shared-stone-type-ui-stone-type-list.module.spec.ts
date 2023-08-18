import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedStoneTypeUiStoneTypeListModule } from './shared-stone-type-ui-stone-type-list.module';

describe('SharedStoneTypeUiStoneTypeListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedStoneTypeUiStoneTypeListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedStoneTypeUiStoneTypeListModule).toBeDefined();
  });
});
