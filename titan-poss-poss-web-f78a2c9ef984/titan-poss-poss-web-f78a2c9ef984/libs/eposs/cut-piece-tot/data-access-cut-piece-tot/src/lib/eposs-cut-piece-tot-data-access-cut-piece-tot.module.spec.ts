import { waitForAsync, TestBed } from '@angular/core/testing';
import { EpossCutPieceTotDataAccessCutPieceTotModule } from './eposs-cut-piece-tot-data-access-cut-piece-tot.module';

describe('EpossCutPieceTotDataAccessCutPieceTotModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [EpossCutPieceTotDataAccessCutPieceTotModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(EpossCutPieceTotDataAccessCutPieceTotModule).toBeDefined();
  });
});
