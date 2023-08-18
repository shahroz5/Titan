


import { TestBed } from '@angular/core/testing';

import { FileDownloadService } from './file-download.service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('FileDownloadService', () => {
  let service: FileDownloadService;

  const apiUrl = "localhost:4300"

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FileDownloadService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });    service = TestBed.inject(FileDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
