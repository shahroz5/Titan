import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossIbtFeatureIbtDetailsModule } from './eposs-ibt-feature-ibt-details.module';

describe('EpossIbtFeatureIbtDetailsModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossIbtFeatureIbtDetailsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossIbtFeatureIbtDetailsModule).toBeDefined();
  });
});
