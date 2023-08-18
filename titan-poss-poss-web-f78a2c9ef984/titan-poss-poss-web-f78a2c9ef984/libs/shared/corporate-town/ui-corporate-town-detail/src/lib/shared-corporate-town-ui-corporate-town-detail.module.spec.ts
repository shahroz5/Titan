import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCorporateTownUiCorporateTownDetailModule } from './shared-corporate-town-ui-corporate-town-detail.module';

describe('SharedCorporateTownUiCorporateTownDetailModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCorporateTownUiCorporateTownDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCorporateTownUiCorporateTownDetailModule).toBeDefined();
  });
});
