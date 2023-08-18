import { InventoryValidationService } from './inventory-validation.service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  getValidateItemEndpointUrl,
  getWeightToleranceEndpointUrl
} from '@poss-web/shared/util-api-service';

describe('InventoryValidationService', () => {
  let httpTestingController: HttpTestingController;
  let inventoryValidationService: InventoryValidationService;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InventoryValidationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    inventoryValidationService = TestBed.inject(InventoryValidationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: InventoryValidationService = TestBed.inject(
      InventoryValidationService
    );
    expect(service).toBeTruthy();
  });

  it('should call GET api method with correct url and params for validateWeightTolerance method', () => {
    const productGroupCode = 'Test';
    const availableWeight = 10;
    const measuredWeight = 10;
    const measuredQuantity = 10;
    const availableQuantity = 10;
    const configType = 'WEIGHT_TOLERANCE';

    const { path, params } = getWeightToleranceEndpointUrl(
      productGroupCode,
      availableWeight,
      measuredWeight,
      measuredQuantity,
      availableQuantity,
      configType
    );

    inventoryValidationService
      .validateWeightTolerance(
        productGroupCode,
        availableWeight,
        measuredWeight,
        measuredQuantity,
        availableQuantity
      )
      .subscribe();
    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.toString()).toEqual(params.toString());
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('productGroupCode')).toEqual(
      productGroupCode
    );
    expect(request.request.params.get('availableWeight').toString()).toEqual(
      availableWeight.toString()
    );
    expect(request.request.params.get('measuredWeight').toString()).toEqual(
      measuredWeight.toString()
    );
    expect(request.request.params.get('measuredQuantity').toString()).toEqual(
      measuredQuantity.toString()
    );
    expect(request.request.params.get('availableQuantity').toString()).toEqual(
      availableQuantity.toString()
    );
    expect(request.request.params.get('configType')).toEqual(configType);

    request.flush({});
  });
  it('should retun data sent by the api', () => {
    const result = { isValid: true };

    const productGroupCode = 'Test';
    const availableWeight = 10;
    const measuredWeight = 10;
    const measuredQuantity = 10;
    const availableQuantity = 10;
    const configType = 'WEIGHT_TOLERANCE';

    const path = getWeightToleranceEndpointUrl(
      productGroupCode,
      availableWeight,
      measuredWeight,
      measuredQuantity,
      availableQuantity,
      configType
    ).path;

    inventoryValidationService
      .validateWeightTolerance(
        productGroupCode,
        availableWeight,
        measuredWeight,
        measuredQuantity,
        availableQuantity
      )
      .subscribe(data => {
        expect(data).toEqual(result);
      });

    const request = httpTestingController.expectOne(req => {
      return req.url === apiUrl + path;
    });
    request.flush(result);
  });

  it('should call GET api method with correct url and params for validateConversionRestriction method', () => {
    const productGroupCode = 'Test';
    const availableWeight = 10;
    const measuredWeight = 10;
    const measuredQuantity = 10;
    const availableQuantity = 10;
    const configType = 'CONVERSION_RESTRICTION';

    const { path, params } = getValidateItemEndpointUrl(
      productGroupCode,
      availableWeight,
      measuredWeight,
      measuredQuantity,
      availableQuantity,
      configType
    );
    inventoryValidationService
      .validateConversionRestriction(
        productGroupCode,
        availableWeight,
        measuredWeight,
        measuredQuantity,
        availableQuantity
      )
      .subscribe();
    const request = httpTestingController.expectOne(
      req => req.url === apiUrl + path
    );
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.toString()).toEqual(params.toString());
    expect(request.request.responseType).toEqual('json');
    expect(request.request.params.get('productGroupCode')).toEqual(
      productGroupCode
    );
    expect(request.request.params.get('availableWeight').toString()).toEqual(
      availableWeight.toString()
    );
    expect(request.request.params.get('measuredWeight').toString()).toEqual(
      measuredWeight.toString()
    );
    expect(request.request.params.get('measuredQuantity').toString()).toEqual(
      measuredQuantity.toString()
    );
    expect(request.request.params.get('availableQuantity').toString()).toEqual(
      availableQuantity.toString()
    );
    expect(request.request.params.get('configType')).toEqual(configType);

    request.flush({});
  });
});
