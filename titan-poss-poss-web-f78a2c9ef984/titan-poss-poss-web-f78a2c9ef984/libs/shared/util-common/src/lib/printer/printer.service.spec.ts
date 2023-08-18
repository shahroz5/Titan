import { TestBed } from '@angular/core/testing';

import { PrinterService } from './printer.service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('PrinterService', () => {
  let service: PrinterService;

  const apiUrl = "localhost:4300"

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PrinterService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });    service = TestBed.inject(PrinterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
