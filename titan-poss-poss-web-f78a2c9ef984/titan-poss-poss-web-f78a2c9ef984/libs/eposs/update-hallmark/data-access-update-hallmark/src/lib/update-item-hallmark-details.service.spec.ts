import { TestBed } from '@angular/core/testing';

import { UpdateItemHallmarkDetailsService } from './update-item-hallmark-details.service';

describe('UpdateItemHallmarkDetailsService', () => {
  let service: UpdateItemHallmarkDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateItemHallmarkDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
