import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { EmployeeLoanConfigurationService } from './employee-loan-configuration.service';
import {
  AirpayHostSuccessList,
  ListingPayload,
  SortItem,
  UploadResponse,
  FileGroupEnum,
  EmployeeLoanSuccessList
} from '@poss-web/shared/models';
import * as moment from 'moment';

import { AirpayHostConfigurationAdaptor, EmployeeLoanConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getDeleteEmpLoanConfigUrl,
  getEmpLoanConfigUrl,
  getFileUploadCommonUrl,
  getPaymentHostnameUrl
} from '@poss-web/shared/util-api-service';

describe('AirpayHostConfigurationService', () => {
  let httpTestingController: HttpTestingController;
  let empLoanConfigurationService: EmployeeLoanConfigurationService;
  const apiUrl = 'http://localhost:3000';



  const listingPayload: ListingPayload = {
    pageIndex: 0,
    pageSize: 10
  };
  const sortField: SortItem = {
    colId: '',
    sort: 'Desc'
  };

  const empLoanConfigurationList: EmployeeLoanSuccessList = {
    configList: [
      {
        id: 'a',
        empName: 'emp1',
        empCode: '1234',
        empMobileNum: '1234567899',
        eligibleAmount: 20000,
        approvalDate: moment(1623456),
        validityDate: moment(1623456),
        applicableCFACodes: '54,72',
        applicableLocationCodes: 'TBO,CPD',
        marginPercentage: 2,
        validationOTP: 1,
        partialRedeemableAmt: 50
      }
    ],
    count: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmployeeLoanConfigurationService,
        {
          provide: POSS_WEB_API_URL,
          useValue: apiUrl
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    empLoanConfigurationService = TestBed.inject(
      EmployeeLoanConfigurationService
    );
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(empLoanConfigurationService).toBeTruthy();
  });

  describe('accessList', () => {
    it('should call GET api method with correct url', () => {
      spyOn(
        EmployeeLoanConfigurationAdaptor,
        'employeeLoanConfigList'
      ).and.returnValue({});
      const url = getEmpLoanConfigUrl(0, 10, sortField);
      empLoanConfigurationService
        .empLoanConfigList(listingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('GET');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
    it('should call  EmployeeLoanConfigurationAdaptor method with correct arguments', () => {
      spyOn(
        EmployeeLoanConfigurationAdaptor,
        'employeeLoanConfigList'
      ).and.returnValue({});
      const url = getEmpLoanConfigUrl(0, 10, sortField);

      empLoanConfigurationService
        .empLoanConfigList(listingPayload, sortField)
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      request.flush(empLoanConfigurationList);
      expect(
        EmployeeLoanConfigurationAdaptor.employeeLoanConfigList
      ).toHaveBeenCalledWith(empLoanConfigurationList);
    });

    it('should retun data mapped by EmployeeLoanConfigurationAdaptor Adaptor', () => {
      spyOn(
        EmployeeLoanConfigurationAdaptor,
        'employeeLoanConfigList'
      ).and.returnValue(empLoanConfigurationList);

      const url = getEmpLoanConfigUrl(0, 10, sortField);

      empLoanConfigurationService
        .empLoanConfigList(listingPayload, sortField)
        .subscribe(data => {
          expect(data).toEqual(empLoanConfigurationList);
        });

      const request = httpTestingController.expectOne(
        req => req.url === apiUrl + url.path
      );
      request.flush({});
    });
    it('should call GET api method with correct url', () => {
      spyOn(
        EmployeeLoanConfigurationAdaptor,
        'employeeLoanConfigList'
      ).and.returnValue({});
      const url = getDeleteEmpLoanConfigUrl('123');
      empLoanConfigurationService
        .deleteEmpLoanConfig('123')
        .subscribe();

      const request = httpTestingController.expectOne(req => {
        return req.url === apiUrl + url.path;
      });
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('POST');
      expect(request.request.responseType).toEqual('json');

      request.flush({});
    });
  });
});
