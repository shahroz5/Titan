import { TestBed } from '@angular/core/testing';

import { OtherChargesService } from './other-charges.service';

describe('OtherChargesService', () => {
  let service: OtherChargesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherChargesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
