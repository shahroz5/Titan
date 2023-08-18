import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedMarketCodeUiMarketCodeDetailModule } from './shared-market-code-ui-market-code-detail.module';

describe('SharedMarketCodeUiMarketCodeDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedMarketCodeUiMarketCodeDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedMarketCodeUiMarketCodeDetailModule).toBeDefined();
  });
});
