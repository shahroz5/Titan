import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossIbtFeatureIbtListModule } from './eposs-ibt-feature-ibt-list.module';

describe('EpossIbtFeatureIbtListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossIbtFeatureIbtListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossIbtFeatureIbtListModule).toBeDefined();
  });
});
