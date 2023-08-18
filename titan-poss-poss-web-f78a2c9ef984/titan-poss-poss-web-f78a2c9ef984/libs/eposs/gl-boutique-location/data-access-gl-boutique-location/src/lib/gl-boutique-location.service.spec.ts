import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { GlBoutiqueLocationService } from './gl-boutique-location.service';
describe('GlBoutiqueLocationService', () => {
  let httpTestingController: HttpTestingController;
  let glBoutiqueLocationService: GlBoutiqueLocationService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GlBoutiqueLocationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    glBoutiqueLocationService = TestBed.inject(GlBoutiqueLocationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(glBoutiqueLocationService).toBeTruthy();
  });
})
