import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossIbtFeatureIbtCreateRequestModule } from './eposs-ibt-feature-ibt-create-request.module';

describe('EpossIbtFeatureIbtCreateRequestModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossIbtFeatureIbtCreateRequestModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossIbtFeatureIbtCreateRequestModule).toBeDefined();
  });
});
