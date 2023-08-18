import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossIbtDataAccessIbtModule } from './eposs-ibt-data-access-ibt.module';

describe('EpossIbtDataAccessIbtModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EpossIbtDataAccessIbtModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EpossIbtDataAccessIbtModule).toBeDefined();
  });
});
