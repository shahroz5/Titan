import { TestBed } from '@angular/core/testing';

import { FindPriceService } from './find-price.service';

describe('FindPriceService', () => {
  let service: FindPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
