import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { CnDirectService } from './cn-direct.service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';

describe('CnDirectService', () => {
  // let service: CnDirectService;
  // beforeEach(() => {
  //   TestBed.configureTestingModule({});
  //   service = TestBed.inject(CnDirectService);
  // });
  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
  let httpTestingController: HttpTestingController;
  let cnDirectService: CnDirectService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CnDirectService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    cnDirectService = TestBed.inject(CnDirectService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(cnDirectService).toBeTruthy();
  });
});
