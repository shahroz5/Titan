import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossIbtUiIbtPopupModule } from './eposs-ibt-ui-ibt-popup.module';

describe('EpossIbtUiIbtPopupModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossIbtUiIbtPopupModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossIbtUiIbtPopupModule).toBeDefined();
  });
});
