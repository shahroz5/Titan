import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from "@angular/core/testing";
import { POSS_WEB_API_URL } from "@poss-web/shared/util-config";
import { GlLocationPaymentService } from "./gl-location-payment.service";

describe('GlBoutiqueLocationService', () => {
  let httpTestingController: HttpTestingController;
  let glLocationPaymentService: GlLocationPaymentService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GlLocationPaymentService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    glLocationPaymentService = TestBed.inject(GlLocationPaymentService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(glLocationPaymentService).toBeTruthy();
  });
})
