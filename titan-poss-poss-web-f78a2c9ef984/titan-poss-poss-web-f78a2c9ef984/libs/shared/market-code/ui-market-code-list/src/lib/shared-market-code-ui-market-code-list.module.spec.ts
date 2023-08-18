import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedMarketCodeUiMarketCodeListModule } from './shared-market-code-ui-market-code-list.module';

describe('SharedMarketCodeUiMarketCodeListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedMarketCodeUiMarketCodeListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedMarketCodeUiMarketCodeListModule).toBeDefined();
  });
});
