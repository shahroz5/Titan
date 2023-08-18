import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PayeeBankAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getPayeeBankByBankNameUrl,
  getPayeeBankDetailsListingUrl,
  getPayeeBankGlCodeDefaults,
  getPayeeBankGLCodeDetailsUrl,
  getPayeeBankSaveFormDetailsUrl,
  savePayeeBankGLCodeDetailsUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import {
  GlSelectMappedLocations,
  LoadPayeeBankListingPayload,
  LoadPayeeBankListingSuccessPayload,
  PayeeBankDetails,
  PayeeBankGLCodeDetails,
  PayeeBankGLCodePayload,
  PayeeGLCodeDetailsSuccessList,
  SaveGLcodeDetails,
  SavePayeeBankFormPayload
} from 'libs/shared/models/src/lib/company-related/payee-bank.model';
import { PayeeBankService } from './payee-bank.service';

describe('PayeeBankService', () => {
  let httpTestingController: HttpTestingController;
  const apiUrl = 'http://localhost:3000';
  let payeeBankService: PayeeBankService;
  const payeeBankListing: LoadPayeeBankListingPayload = {
    pageIndex: 0,
    pageSize: 10
  }
  const savePayeeBankForm: SavePayeeBankFormPayload = {
    bankName: 'ICICI',
    bankCode: '123rc',
    address: 'addr1',
    mailId: null,
    ownerType: "L1,L2",
    contactPerson: null,
    isActive: true
  }
  const payeeBankGlCode: PayeeBankGLCodePayload = {
    payloadData: {
      bankName: 'AMEX',
      locationCode: ['CPD'],
      paymentCode: ['CASH']
    },
    pageEvent: {
      pageIndex: 0,
      pageSize: 10
    },
    isPageable: false
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PayeeBankService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    payeeBankService = TestBed.inject(PayeeBankService);
  });
  it('should be created', () => {
    expect(payeeBankService).toBeTruthy();
  });
  describe('getPayeeBankDetails', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PayeeBankAdaptor, 'getPayeeBankDetailsListing').and.returnValue({});

      const url = getPayeeBankDetailsListingUrl(
        payeeBankListing.pageIndex,
        payeeBankListing.pageSize
      ).path

      payeeBankService.getPayeeBankDetails(payeeBankListing).subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
    });
    it('should return data mappedby adaptors', () => {
      const payeeBankDetailsListing: LoadPayeeBankListingSuccessPayload = {
        payeeBankListing: [
          {
            bankName: 'ICICI',
            bankCode: '123rc',
            addressOne: 'addr1',
            addressTwo: 'addr2',
            townName: "GAYA",
            stateName: "BIHAR",
            mailId: null,
            contactPerson: null,
            ownerType: "L1,L2",
            isActive: true
          }
        ],
        totalElements: 10
      }

      spyOn(PayeeBankAdaptor, 'getPayeeBankDetailsListing').and.returnValue(
        payeeBankDetailsListing
      );
      const url = getPayeeBankDetailsListingUrl(0, 10).path;
      payeeBankService.getPayeeBankDetails(payeeBankListing)
      .subscribe(data => {
        expect(data).toEqual(payeeBankDetailsListing);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url;
      });

      request.flush({});
    });
  });

  describe('getPayeeBankByBankName', () => {
    it('should call GET api method with correct url and params', () => {
      spyOn(PayeeBankAdaptor, 'getPayeeBankDetailsBasedOnBankName').and.returnValue({});

      const path = getPayeeBankByBankNameUrl('ICICI');

      payeeBankService.getPayeeBankByBankName('ICICI').subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');
    })
    it('should return data mapped by adaptors', () => {
      const payeeBankDetails: PayeeBankDetails = {
        bankName: 'ICICI',
        bankCode: '123rc',
        addressOne: 'addr1',
        addressTwo: 'addr2',
        townName: "GAYA",
        stateName: "BIHAR",
        mailId: null,
        contactPerson: null,
        ownerType: "L1,L2",
        isActive: true
      }
      spyOn(PayeeBankAdaptor, 'getPayeeBankDetailsBasedOnBankName').and.returnValue(
        payeeBankDetails
      );
      const path = getPayeeBankByBankNameUrl('ICICI');

      payeeBankService.getPayeeBankByBankName('ICICI')
      .subscribe(data => {
        expect(data).toEqual(payeeBankDetails);
      });

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + path;
      });

      request.flush({});
    });

    describe('getPayeeBankSearchResult', () => {
      it('should call GET api method with correct url and params', () => {
        spyOn(PayeeBankAdaptor, 'getPayeeBankDetailsSearch').and.returnValue({});

        const url = getPayeeBankByBankNameUrl('ICICI');

        payeeBankService.getPayeeBankSearchResult('ICICI').subscribe();

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + url;
        });
        expect(request.cancelled).toBeFalsy();
        expect(request.request.method).toEqual('GET');
        expect(request.request.responseType).toEqual('json');
      });
      it('should return data mapped by adaptors', () => {
        const payerBankDetails: PayeeBankDetails[] = [
          {
            bankName: 'ICICI',
            bankCode: '123rc',
            addressOne: 'addr1',
            addressTwo: 'addr2',
            townName: "GAYA",
            stateName: "BIHAR",
            mailId: null,
            contactPerson: null,
            ownerType: "L1,L2",
            isActive: true
          }
        ]
        spyOn(PayeeBankAdaptor, 'getPayeeBankDetailsSearch').and.returnValue(
          payerBankDetails
        );

        const url = getPayeeBankByBankNameUrl('ICICI');

        payeeBankService.getPayeeBankSearchResult('ICICI')
        .subscribe(data => {
          expect(data).toEqual(payerBankDetails);
        })

        const request = httpTestingController.expectOne(req => {
          return req.url === apiUrl + url;
        });

        request.flush({});
      });

      describe('savePayeeBankFormDetails', () => {
        it('should call POST api method with correct url and params', () => {
          const url = getPayeeBankSaveFormDetailsUrl();

          payeeBankService.savePayeeBankFormDetails(savePayeeBankForm).subscribe();

          const request = httpTestingController.expectOne(req => {
            return req.url === apiUrl + url;
          });
          expect(request.cancelled).toBeFalsy();
          expect(request.request.method).toEqual('POST');
          expect(request.request.responseType).toEqual('json');
        })
      })

      describe('editPayeeBankFormDetails', () => {
        it('should call PATCH api method with correct url and params', () => {

          const url = getPayeeBankByBankNameUrl(savePayeeBankForm.bankName);

          payeeBankService.editPayeeBankFormDetails(savePayeeBankForm).subscribe();

          const request = httpTestingController.expectOne(req => {
            return req.url === apiUrl + url;
          });
          expect(request.cancelled).toBeFalsy();
          expect(request.request.method).toEqual('PATCH');
          expect(request.request.responseType).toEqual('json');
        })
      })

      describe('savePayeeBankGlCodeDetails', () => {
        it('should call PATCH api method with correct url and params', () => {

          const saveData: SaveGLcodeDetails = {
            bankName: 'ICICI',
            addLocations: [],
            addPaymentCodes: [],
            removeLocations: [],
            removePaymentCodes: [],
            updateConfigs: []
          }
          const url = savePayeeBankGLCodeDetailsUrl(saveData.bankName);

          payeeBankService.savePayeeBankGlCodeDetails(saveData).subscribe();

          const request = httpTestingController.expectOne(req => {
            return req.url === apiUrl + url;
          });
          expect(request.cancelled).toBeFalsy();
          expect(request.request.method).toEqual('PATCH');
          expect(request.request.responseType).toEqual('json');
        })
      })

      describe('getGlCodeDefaults', () => {
        it('should call GET api method with correct url and params', () => {
          spyOn(PayeeBankAdaptor, 'getGLCodeDefaultsList').and.returnValue({});
          const payload = {
            id: '1',
            bankName: 'ICICI',
            locationCode: 'loc123',
            paymentCode: 'cash123',
            glCode: 1,
            isDefault: false
          }

          const url = getPayeeBankGlCodeDefaults();

          payeeBankService.getGlCodeDefaults(payload).subscribe();

          const request = httpTestingController.expectOne(req => {
            return req.url === apiUrl + url;
          });
          expect(request.cancelled).toBeFalsy();
          expect(request.request.method).toEqual('POST');
          expect(request.request.responseType).toEqual('json');
        });

        it('should return data mapped by adaptors', () => {
          const payload: PayeeBankGLCodeDetails[] = [{
            id: '1',
            bankName: 'ICICI',
            locationCode: 'loc123',
            paymentCode: 'cash123',
            glCode: 1,
            isDefault: false
          }];
          spyOn(PayeeBankAdaptor, 'getGLCodeDefaultsList').and.returnValue(
            payload
          );

          const url = getPayeeBankGlCodeDefaults();

          payeeBankService.getGlCodeDefaults(payload)
          .subscribe(data => {
            expect(data).toEqual(payload);
          })

          const request = httpTestingController.expectOne(req => {
            return req.url === apiUrl + url;
          });

          request.flush({});
        })
      });

      describe('getMappedLocations', () => {
        it('should call POST api method with correct url params', () => {
          spyOn(PayeeBankAdaptor, 'getMappedLocationList').and.returnValue({});

          const url = getPayeeBankGLCodeDetailsUrl(
            payeeBankGlCode.payloadData.bankName,
            payeeBankGlCode.payloadData.paymentCode,
            false
          );

          payeeBankService.getMappedLocations(payeeBankGlCode).subscribe();

          const request = httpTestingController.expectOne(req => {
            return req.url === apiUrl + url.path;
          });
          expect(request.cancelled).toBeFalsy();
          expect(request.request.method).toEqual('POST');
          expect(request.request.responseType).toEqual('json');
        });

        it('should return data mapped by adaptors', () => {

          const respose: GlSelectMappedLocations[] = [{
            id: '111222',
            description: 'Delhi'
          }]
          spyOn(PayeeBankAdaptor, 'getMappedLocationList').and.returnValue(
            respose
          );
          const url = getPayeeBankGLCodeDetailsUrl(
            payeeBankGlCode.payloadData.bankName,
            payeeBankGlCode.payloadData.paymentCode,
            false
          );

          payeeBankService.getMappedLocations(payeeBankGlCode)
          .subscribe(data => {
            expect(data).toEqual(respose)
          });

          const request = httpTestingController.expectOne(req => {
            return req.url === apiUrl + url.path;
          });
          request.flush({});
        })
      })

      describe('getPayeeBankGlCodeDetails', () => {
        it('should call POST api method with correct url and params', () => {
          spyOn(PayeeBankAdaptor, 'getGLCodeDetailList').and.returnValue({});

          const url = getPayeeBankGLCodeDetailsUrl(
            payeeBankGlCode.payloadData.bankName,
            payeeBankGlCode.payloadData.paymentCode,
            true,
            payeeBankGlCode.pageEvent.pageIndex,
            payeeBankGlCode.pageEvent.pageSize
          )

          payeeBankService.getPayeeBankGlCodeDetails(payeeBankGlCode).subscribe();

          const request = httpTestingController.expectOne(req => {
            return req.url === apiUrl + url.path;
          });
          expect(request.cancelled).toBeFalsy();
          expect(request.request.method).toEqual('POST');
          expect(request.request.responseType).toEqual('json');
        })

        it('should return data mapped by adaptors', () => {

          const responsePayload: PayeeGLCodeDetailsSuccessList = {
            locationList: [{
              id: '1',
              bankName: 'ICICI',
              locationCode: 'loc123',
              paymentCode: 'cash123',
              glCode: 1,
              isDefault: false
            }],
            count: 10
          }
          spyOn(PayeeBankAdaptor, 'getGLCodeDetailList').and.returnValue(
            responsePayload
          )

          const url = getPayeeBankGLCodeDetailsUrl(
            payeeBankGlCode.payloadData.bankName,
            payeeBankGlCode.payloadData.paymentCode,
            true,
            payeeBankGlCode.pageEvent.pageIndex,
            payeeBankGlCode.pageEvent.pageSize
          )

          payeeBankService.getPayeeBankGlCodeDetails(payeeBankGlCode)
          .subscribe(data => {
            expect(data).toEqual(responsePayload);
          });

          const request = httpTestingController.expectOne(req => {
            return req.url === apiUrl + url.path;
          });

          request.flush({});
        })
      })
    })
  })
})
