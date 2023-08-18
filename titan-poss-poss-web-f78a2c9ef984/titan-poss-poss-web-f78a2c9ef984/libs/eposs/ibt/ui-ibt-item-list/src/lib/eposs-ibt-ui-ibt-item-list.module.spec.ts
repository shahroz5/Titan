import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossIbtUiIbtItemListModule } from './eposs-ibt-ui-ibt-item-list.module';

describe('EpossIbtUiIbtItemListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossIbtUiIbtItemListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossIbtUiIbtItemListModule).toBeDefined();
  });
});
