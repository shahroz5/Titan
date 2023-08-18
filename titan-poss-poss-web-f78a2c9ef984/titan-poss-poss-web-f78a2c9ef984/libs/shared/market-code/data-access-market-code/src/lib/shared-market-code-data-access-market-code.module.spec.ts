import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedMarketCodeDataAccessMarketCodeModule } from './shared-market-code-data-access-market-code.module';

describe('SharedMarketCodeDataAccessMarketCodeModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedMarketCodeDataAccessMarketCodeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedMarketCodeDataAccessMarketCodeModule).toBeDefined();
  });
});
