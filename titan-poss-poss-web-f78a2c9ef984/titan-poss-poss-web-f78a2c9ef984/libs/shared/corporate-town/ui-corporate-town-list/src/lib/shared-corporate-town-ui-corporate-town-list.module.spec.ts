import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedCorporateTownUiCorporateTownListModule } from './shared-corporate-town-ui-corporate-town-list.module';

describe('SharedCorporateTownUiCorporateTownListModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedCorporateTownUiCorporateTownListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedCorporateTownUiCorporateTownListModule).toBeDefined();
  });
});
