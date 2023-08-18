import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as moment from 'moment';
import { CustomerDataService } from './customer.service';
import {
  getCustomerSaveNewFormDetailsUrl,
  getCustomerDetailsUrl,
  getCustomerSearchUrl,
  getCustomerTownsSummaryUrl,
  getIsCustomerUniqueEndpointUrl,
  getCountryCodeEndpointUrl,
  getCustomerBySearchByEmailUrl,
  getPANVerificationUrl,
  getGSTVerificationUrl,
  getRivaahCouponEndpointUrl,
  getCatchmentListUrl
} from '@poss-web/shared/util-api-service';
import { of } from 'rxjs';
import {
  Customers,
  PincodeSummary,
  Pincode,
  TownSummary,
  CreatedCustomerResponse,
  CustomerInfo,
  SEARCH_BY_ENUM,
  CustomerStateSummary
} from '@poss-web/shared/models';
import {
  CustomerDataAdaptor,
  CustomerSearchAdaptor,
  LovHelper,
  TownDataAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  LovDataService,
  PinCodeDataService,
  StateDataService
} from '@poss-web/shared/masters/data-access-masters';

describe('CustomerDataService ', () => {
  let httpTestingController: HttpTestingController;
  let customerDataService: CustomerDataService;
  const apiUrl = 'http://localhost:3000';
  let mockPincodeSummaryService;
  let mockLovService;
  let mockStateDateService;
  const customerLovs: any = [
    {
      code: 'Dr',
      value: 'Dr',
      isActive: true
    },
    {
      code: 'Mrs',
      value: 'Mrs',
      isActive: true
    },
    {
      code: 'Mr',
      value: 'Mr',
      isActive: true
    },
    {
      code: 'M/S',
      value: 'M/S',
      isActive: true
    }
  ];

  const pincodeData: Pincode[] = [
    {
      cachementArea: 'Rajajinagar',
      countryCode: 'IND',
      id: 1,
      isActive: true,
      pincode: '571313',
      stateName: 'Karanataka',
      townName: 'Banglore'
    },
    {
      cachementArea: 'RajaRajeswari Nagar',
      countryCode: 'IND',
      id: 2,
      isActive: true,
      pincode: '571313',
      stateName: 'Karanataka',
      townName: 'Banglore'
    }
  ];

  const dummyTownSummaryResponseData: TownSummary[] = [
    {
      description: 'Banglore',
      townCode: 1
    },
    {
      description: 'Mysore',
      townCode: 2
    },
    {
      description: 'Chamarajanagar',
      townCode: 3
    }
  ];

  const dummyResponseData: CustomerInfo = {
    customerId: '702',
    title: 'Mr',
    customerName: 'Customerone',
    customerType: 'REGULAR',
    ulpId: '4626',
    mobileNumber: '8970420911',
    emailId: 'customerone@gmail.com',
    instiTaxNo: '1234567890poiuy',
    custTaxNo: 'BLOPJ2603A',
    isActive: true,
    customerDetails: {
      type: 'REGULAR',
      data: {
        addressLines: ['Address line1', 'Address line2', 'Address line3'],
        pinCode: '560010',
        city: 'Banglore',
        state: 'karnataka',
        country: 'qew1',
        zone: 'Zone 1',
        catchmentName: 'Rajajinagar',
        birthday: moment(1585679400000),
        spouseBirthday: moment(1585765800000),
        anniversary: moment(1586975400000),
        canSendSMS: true,
        altContactNo: null
      }
    },
    passportId: null,
    pointBalance: null,
    currentTier: null,
    enrollmentDate: null,
    isMemberBlocked: false,
    isPulseCustomer: false,
    loyaltyDetails: {
      data: {
        anniversary: '',
        anniversaryDiscount: '',
        anniversaryValidityPeriod: '',
        birthday: '',
        birthdayDiscount: '',
        birthdayValdityPeriod: '',
        child1BirthdayDiscount: '',
        child1BirthdayValidityPeriod: '',
        child2BirthdayDiscount: '',
        child2BirthdayValidityPeriod: '',
        spouseBirthday: '',
        spouseBirthdayDiscount: '',
        spouseBirthdayValidityPeriod: ''
      },
      type: 'REGULAR'
    }
  };

  const dummyCustomerDetail: CreatedCustomerResponse = {
    customerId: '702',
    title: 'Mr',
    customerName: 'Customerone',
    customerType: 'REGULAR',
    ulpId: '4626',
    mobileNumber: '8970420911',
    emailId: 'customerone@gmail.com',
    instiTaxNo: '1234567890poiuy',
    custTaxNo: 'BLOPJ2603A',
    isPulseCustomer: false,
    isMemberBlocked: false,
    currentTier: null,
    customerDetails: {
      type: 'REGULAR',
      data: {
        addressLines: ['Address line1', 'Address line2', 'Address line3'],
        pinCode: '560010',
        city: 'Banglore',
        state: 'karnataka',
        country: 'qew1',
        zone: 'Zone 1',
        catchmentName: 'Rajajinagar',
        birthday: moment(1585679400000),
        spouseBirthday: moment(1585765800000),
        anniversary: moment(1586975400000),
        canSendSMS: true,
        altContactNo: null
      }
    },
    isActive: true,
    loyaltyDetails: {
      data: {
        anniversary: '',
        anniversaryDiscount: '',
        anniversaryValidityPeriod: '',
        birthday: '',
        birthdayDiscount: '',
        birthdayValdityPeriod: '',
        child1BirthdayDiscount: '',
        child1BirthdayValidityPeriod: '',
        child2BirthdayDiscount: '',
        child2BirthdayValidityPeriod: '',
        spouseBirthday: '',
        spouseBirthdayDiscount: '',
        spouseBirthdayValidityPeriod: ''
      },
      type: 'REGULAR'
    }
  };

  const panVerificationResponse = {
    message: 'Invalid PAN',
    ownerName: 'ADDDD',
    verificationStatus: true
  };

  const gstVerificationResponse = {
    errorMessage: 'Invalida GST',
    gstIn: 'ASJKWKO93322',
    status: true
  };

  const dummyResponse = null;

  beforeEach(() => {
    mockPincodeSummaryService = jasmine.createSpyObj(['getPincodesSummary']);
    mockLovService = jasmine.createSpyObj(['getSalesLovs']);
    mockStateDateService = jasmine.createSpyObj(['getStatesSummary']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerDataService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        },
        {
          provide: PinCodeDataService,
          useValue: mockPincodeSummaryService
        },

        {
          provide: LovDataService,
          useValue: mockLovService
        },
        {
          provide: StateDataService,
          useValue: mockStateDateService
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    customerDataService = TestBed.inject(CustomerDataService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(customerDataService).toBeTruthy();
  });

  describe('get customer LOV', () => {
    const lovType = 'SALUTATION';

    it('should call get Lov method of LovHelper with correct arguments', () => {
      spyOn(LovHelper, 'getLovs').and.returnValue({});
      mockLovService.getSalesLovs.and.returnValue(of(customerLovs));

      customerDataService.getCustomerLovs(lovType).subscribe();
      expect(LovHelper.getLovs).toHaveBeenCalledWith(customerLovs);
    });

    it('should retun data mapped by getLov method of LovHelper', () => {
      spyOn(LovHelper, 'getLovs').and.returnValue(customerLovs);
      mockLovService.getSalesLovs.and.returnValue(of(customerLovs));

      customerDataService.getCustomerLovs(lovType).subscribe(response => {
        expect(response).toEqual(customerLovs);
      });
    });
  });

  describe('saveCustomer', () => {
    const customerData: Customers = {
      title: 'Mr',
      customerId: '',
      ulpId: '',
      customerName: 'Customerone',
      customerType: 'REGULAR',
      mobileNumber: '8970420911',
      emailId: 'customerone@gmail.com',
      instiTaxNo: '1234567890poiuy',
      custTaxNo: 'BLOPJ2603A',
      customerDetails: {
        type: 'REGULAR',
        data: {
          addressLines: ['address1', 'address2', 'adddress3'],
          pinCode: '560010',
          city: 'Banglore',
          state: 'karnataka',
          country: 'qew1',
          zone: 'Zone 1',
          catchmentName: 'Rajajinagar',
          canSendSMS: true
        }
      },
      isActive: true
    };
    it('should create proper URL for as per parameters passed', () => {
      const path = getCustomerSaveNewFormDetailsUrl();
      expect(path).toEqual('/sales/v2/customers');
    });

    it('should call POST api method with correct url and params', () => {
      const path = getCustomerSaveNewFormDetailsUrl();

      customerDataService.saveCustomer(customerData).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(JSON.parse(request.request.body)).toEqual(customerData);
    });

    it('should call CustomerSearchAdaptor method with correct arguments', () => {
      spyOn(CustomerSearchAdaptor, 'fromJson').and.returnValue({});
      const path = getCustomerSaveNewFormDetailsUrl();

      customerDataService.saveCustomer(customerData).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyResponseData);
      expect(CustomerSearchAdaptor.fromJson).toHaveBeenCalledWith(
        dummyResponseData
      );
    });

    it('should retun data mapped by CustomerSearchAdaptor', () => {
      spyOn(CustomerSearchAdaptor, 'fromJson').and.returnValue(
        dummyResponseData
      );

      const path = getCustomerSaveNewFormDetailsUrl();

      customerDataService.saveCustomer(customerData).subscribe(response => {
        expect(response).toEqual(dummyResponseData);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('updateCustomer', () => {
    const customerId = '22';
    const dummyCustomer = null;

    it('should create proper URL for as per parameters passed', () => {
      const path = getCustomerDetailsUrl(customerId);
      expect(path).toEqual('/sales/v2/customers/22');
    });

    it('should call PATCH api method with correct url and params', () => {
      const path = getCustomerDetailsUrl(customerId);

      customerDataService.updateCustomer(customerId, dummyCustomer).subscribe();
      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + path
      );

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PATCH');
      expect(JSON.parse(request.request.body)).toEqual(dummyCustomer);
    });

    it('should call CustomerSearchAdaptor method with correct arguments', () => {
      spyOn(CustomerSearchAdaptor, 'fromJson').and.returnValue({});
      const path = getCustomerDetailsUrl(customerId);

      customerDataService.updateCustomer(customerId, dummyCustomer).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyResponse);
      expect(CustomerSearchAdaptor.fromJson).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by CustomerSearchAdaptor', () => {
      spyOn(CustomerSearchAdaptor, 'fromJson').and.returnValue(dummyResponse);

      const path = getCustomerDetailsUrl(customerId);

      customerDataService
        .updateCustomer(customerId, dummyCustomer)
        .subscribe(response => {
          expect(response).toEqual(dummyResponse);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('searchCustomer', () => {
    it('should call GET api method with correct url and params', () => {
      const searchBy = SEARCH_BY_ENUM.EMAIL_ID;
      const searchValue = 'customerone@gmail.com';
      spyOn(CustomerSearchAdaptor, 'fromJson').and.returnValue({});
      const path = getCustomerBySearchByEmailUrl(searchBy, searchValue);

      customerDataService.searchCustomer(searchBy, searchValue).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CustomerSearchAdaptor method with correct arguments', () => {
      const searchBy = SEARCH_BY_ENUM.MOBILE_NO;
      const searchValue = '8970420911';
      spyOn(CustomerSearchAdaptor, 'fromJson').and.returnValue({});
      const { path } = getCustomerSearchUrl(searchBy, searchValue);

      customerDataService.searchCustomer(searchBy, searchValue).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyResponse);
      expect(CustomerSearchAdaptor.fromJson).toHaveBeenCalledWith(
        dummyResponse
      );
    });

    it('should retun data mapped by CustomerSearchAdaptor', () => {
      const searchBy = SEARCH_BY_ENUM.MOBILE_NO;
      const searchValue = '8970420911';
      spyOn(CustomerSearchAdaptor, 'fromJson').and.returnValue(
        dummyResponseData
      );

      const path = getCustomerSearchUrl(searchBy, searchValue);

      customerDataService
        .searchCustomer(searchBy, searchValue)
        .subscribe(response => {
          expect(response).toEqual(dummyResponseData);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush({});
    });
  });

  describe('townSummary', () => {
    const stateCode = '1';
    it('should call GET api method with correct url and params', () => {
      spyOn(TownDataAdaptor, 'townDataSummaryFromJson').and.returnValue({});
      const path = getCustomerTownsSummaryUrl(stateCode);

      customerDataService.getTownsSummary(stateCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call TownDataAdaptor method with correct arguments', () => {
      spyOn(TownDataAdaptor, 'townDataSummaryFromJson').and.returnValue({});
      const path = getCustomerTownsSummaryUrl(stateCode);

      customerDataService.getTownsSummary(stateCode).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(dummyTownSummaryResponseData);
      expect(TownDataAdaptor.townDataSummaryFromJson).toHaveBeenCalledWith(
        dummyTownSummaryResponseData
      );
    });

    it('should retun data mapped by TownDataAdaptor', () => {
      spyOn(TownDataAdaptor, 'townDataSummaryFromJson').and.returnValue(
        dummyTownSummaryResponseData
      );

      const path = getCustomerTownsSummaryUrl(stateCode);

      customerDataService.getTownsSummary(stateCode).subscribe(response => {
        expect(response).toEqual(dummyTownSummaryResponseData);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush({});
    });
  });

  describe('loadPincodeSummary', () => {
    const dummyPincodeSummary: PincodeSummary = {
      townName: 'Banglore',
      stateName: 'Karanataka',
      cachementArea: ['Rajajinagar', 'RajaRajeswari Nagar']
    };
    const countryCode = 'IND';
    const pincode = '571313';

    it('should call getPincodeSummary method of CustomerDataAdaptor with correct arguments', () => {
      spyOn(CustomerDataAdaptor, 'pincodeDataSummaryFromJson').and.returnValue(
        {}
      );
      mockPincodeSummaryService.getPincodesSummary.and.returnValue(
        of(dummyPincodeSummary)
      );

      customerDataService.getPincodeSummary(countryCode, pincode).subscribe();
      expect(
        CustomerDataAdaptor.pincodeDataSummaryFromJson
      ).toHaveBeenCalledWith(dummyPincodeSummary);
    });

    it('should retun data mapped by getPincodeSummaryData method of CustomerDataAdaptor', () => {
      spyOn(CustomerDataAdaptor, 'pincodeDataSummaryFromJson').and.returnValue(
        dummyPincodeSummary
      );
      mockPincodeSummaryService.getPincodesSummary.and.returnValue(
        of(pincodeData)
      );

      customerDataService
        .getPincodeSummary(countryCode, pincode)
        .subscribe(response => {
          expect(response).toEqual(dummyPincodeSummary);
        });
    });
  });

  describe('getStateSummary', () => {
    const customerStateSummary: CustomerStateSummary[] = [
      {
        stateId: 'ASDA213124DS',
        description: 'Karanataka'
      }
    ];
    const countryCode = 'IND';

    it('should call getStateSummary method of CustomerDataAdaptor with correct arguments', () => {
      spyOn(CustomerDataAdaptor, 'stateDataSummaryFromJson').and.returnValue(
        {}
      );
      mockStateDateService.getStatesSummary.and.returnValue(
        of(customerStateSummary)
      );

      customerDataService.getStateSummary(countryCode).subscribe();
      expect(CustomerDataAdaptor.stateDataSummaryFromJson).toHaveBeenCalledWith(
        customerStateSummary
      );
    });

    it('should retun data mapped by getStateSummary method of CustomerDataAdaptor', () => {
      spyOn(CustomerDataAdaptor, 'stateDataSummaryFromJson').and.returnValue(
        customerStateSummary
      );
      mockStateDateService.getStatesSummary.and.returnValue(
        of(customerStateSummary)
      );

      customerDataService.getStateSummary(countryCode).subscribe(response => {
        expect(response).toEqual(customerStateSummary);
      });
    });
  });

  describe('checkUniqueness', () => {
    it('should call GET api method with correct url and params', () => {
      const url = getIsCustomerUniqueEndpointUrl('EMAIL_ID', 'abc@mail.com');

      customerDataService
        .getIsUniqueCustomer('EMAIL_ID', 'abc@mail.com')
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.params.get('searchType')).toEqual('EMAIL_ID');
      expect(request.request.params.get('value')).toEqual('abc@mail.com');
      request.flush({});
    });
  });

  describe('verify PAN card', () => {
    it('should call POST api method with correct url and params', () => {
      const requestPayload = {
        panCardNo: 'BLOPJ2603A',
        vendorCode: 'PAN',
        verificationType: 'NUMBER'
      };
      const url = getPANVerificationUrl(requestPayload);

      customerDataService.validatePAN(requestPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CustomerDataAdaptor method with correct arguments', () => {
      spyOn(CustomerDataAdaptor, 'panVerificationJson').and.returnValue({});
      const requestPayload = {
        panCardNo: 'BLOPJ2603A',
        vendorCode: 'PAN',
        verificationType: 'NUMBER'
      };

      const url = getPANVerificationUrl(requestPayload);

      customerDataService.validatePAN(requestPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(panVerificationResponse);
      expect(CustomerDataAdaptor.panVerificationJson).toHaveBeenCalledWith(
        panVerificationResponse
      );
    });

    it('should retun data mapped by CustomerDataAdaptor', () => {
      spyOn(CustomerDataAdaptor, 'panVerificationJson').and.returnValue(
        panVerificationResponse
      );

      const requestPayload = {
        panCardNo: 'BLOPJ2603A',
        vendorCode: 'PAN',
        verificationType: 'NUMBER'
      };
      const url = getPANVerificationUrl(requestPayload);

      customerDataService.validatePAN(requestPayload).subscribe(response => {
        expect(response).toEqual(panVerificationResponse);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('verify GST card', () => {
    it('should call POST api method with correct url and params', () => {
      const requestPayload = {
        gstIn: 'BLOPJ2603A',
        vendorCode: 'E_INVOICE'
      };
      const url = getGSTVerificationUrl(requestPayload);

      customerDataService.validateGST(requestPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.params.toString()).toEqual(url.params.toString());
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CustomerDataAdaptor method with correct arguments', () => {
      spyOn(CustomerDataAdaptor, 'gstVerificationJson').and.returnValue({});
      const requestPayload = {
        gstIn: 'BLOPJ2603A',
        vendorCode: 'E_INVOICE'
      };

      const url = getGSTVerificationUrl(requestPayload);

      customerDataService.validateGST(requestPayload).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush(gstVerificationResponse);
      expect(CustomerDataAdaptor.gstVerificationJson).toHaveBeenCalledWith(
        gstVerificationResponse
      );
    });

    it('should retun data mapped by CustomerDataAdaptor', () => {
      spyOn(CustomerDataAdaptor, 'gstVerificationJson').and.returnValue(
        gstVerificationResponse
      );

      const requestPayload = {
        gstIn: 'BLOPJ2603A',
        vendorCode: 'E_INVOICE'
      };
      const url = getGSTVerificationUrl(requestPayload);

      customerDataService.validateGST(requestPayload).subscribe(response => {
        expect(response).toEqual(gstVerificationResponse);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });

      request.flush({});
    });
  });

  describe('customerDetail', () => {
    const customerId = '702';
    it('should call GET api method with correct url and params', () => {
      spyOn(CustomerDataAdaptor, 'customerFromJson').and.returnValue({});
      const path = getCustomerDetailsUrl(customerId);

      customerDataService.getCustomerDetails(customerId).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CustomerDataAdaptor method with correct arguments', () => {
      spyOn(CustomerDataAdaptor, 'customerFromJson').and.returnValue({});
      const path = getCustomerDetailsUrl(customerId);

      customerDataService.getCustomerDetails(customerId).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyCustomerDetail);
      expect(CustomerDataAdaptor.customerFromJson).toHaveBeenCalledWith(
        dummyCustomerDetail
      );
    });

    it('should retun data mapped by CustomerDataAdaptor', () => {
      spyOn(CustomerDataAdaptor, 'customerFromJson').and.returnValue(
        dummyCustomerDetail
      );

      const path = getCustomerDetailsUrl(customerId);

      customerDataService.getCustomerDetails(customerId).subscribe(response => {
        expect(response).toEqual(dummyCustomerDetail);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getcustomerDetail', () => {
    const customerId = '702';
    it('should call GET api method with correct url and params', () => {
      spyOn(CustomerDataAdaptor, 'customerFromJson').and.returnValue({});
      const path = getCustomerDetailsUrl(customerId);
      customerDataService.getCustomer(customerId).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CustomerDataAdaptor method with correct arguments', () => {
      spyOn(CustomerDataAdaptor, 'customerFromJson').and.returnValue({});
      const path = getCustomerDetailsUrl(customerId);

      customerDataService.getCustomer(customerId).subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush(dummyResponseData);
      expect(CustomerDataAdaptor.customerFromJson).toHaveBeenCalledWith(
        dummyResponseData
      );
    });

    it('should retun data mapped by CustomerDataAdaptor', () => {
      spyOn(CustomerDataAdaptor, 'customerFromJson').and.returnValue(
        dummyResponseData
      );

      const path = getCustomerDetailsUrl(customerId);

      customerDataService.getCustomer(customerId).subscribe(response => {
        expect(response).toEqual(dummyResponseData);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });
  });

  describe('getRivaahCouponDetails', () => {
    const customerId = '702';
    const couponSend = true;
    const couponResponseDetail = null;

    it('should call GET api method with correct url and params', () => {
      spyOn(CustomerDataAdaptor, 'rivaahCouponDetailJson').and.returnValue({});
      const path = getRivaahCouponEndpointUrl(customerId, couponSend);

      customerDataService
        .getRivaahCouponDetails(customerId, couponSend)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CustomerDataAdaptor method with correct arguments', () => {
      spyOn(CustomerDataAdaptor, 'rivaahCouponDetailJson').and.returnValue({});
      const path = getRivaahCouponEndpointUrl(customerId, couponSend);

      customerDataService
        .getRivaahCouponDetails(customerId, couponSend)
        .subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(couponResponseDetail);
      expect(CustomerDataAdaptor.rivaahCouponDetailJson).toHaveBeenCalledWith(
        couponResponseDetail,
        true
      );
    });

    it('should retun data mapped by CustomerDataAdaptor', () => {
      spyOn(CustomerDataAdaptor, 'rivaahCouponDetailJson').and.returnValue(
        couponResponseDetail
      );

      const path = getRivaahCouponEndpointUrl(customerId, couponSend);

      customerDataService
        .getRivaahCouponDetails(customerId, couponSend)
        .subscribe(response => {
          expect(response).toEqual(couponResponseDetail);
        });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush({});
    });
  });

  describe('getCathmentList', () => {
    const responseData = [];
    it('should call GET api method with correct url and params', () => {
      spyOn(CustomerDataAdaptor, 'getCatchmentList').and.returnValue({});
      const path = getCatchmentListUrl();

      customerDataService.getCathmentList().subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
      request.flush({});
    });

    it('should call CustomerDataAdaptor method with correct arguments', () => {
      spyOn(CustomerDataAdaptor, 'getCatchmentList').and.returnValue({});
      const path = getCatchmentListUrl();

      customerDataService.getCathmentList().subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush(responseData);
      expect(CustomerDataAdaptor.getCatchmentList).toHaveBeenCalledWith(
        responseData
      );
    });

    it('should retun data mapped by CustomerDataAdaptor', () => {
      spyOn(CustomerDataAdaptor, 'getCatchmentList').and.returnValue(
        responseData
      );

      const path = getCatchmentListUrl();

      customerDataService.getCathmentList().subscribe(response => {
        expect(response).toEqual(responseData);
      });
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      request.flush({});
    });
  });

  describe('getCountrycode', () => {
    it('should call GET api method with correct url and params', () => {
      const path = getCountryCodeEndpointUrl();

      customerDataService.getCountryCode().subscribe();
      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path.path;
      });

      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
    });
  });
});
