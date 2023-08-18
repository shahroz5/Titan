import { TestBed } from '@angular/core/testing';

import { PanFormVerifyPopupService } from './pan-form-verify-popup.service';

describe('PanFormVerifyPopupService', () => {
  let service: PanFormVerifyPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanFormVerifyPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
