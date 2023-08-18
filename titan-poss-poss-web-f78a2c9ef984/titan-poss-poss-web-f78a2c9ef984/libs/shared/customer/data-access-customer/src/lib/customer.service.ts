import { map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  ApiService,
  getCustomerSaveNewFormDetailsUrl,
  getCustomerSearchUrl,
  getCustomerDetailsUrl,
  getIsCustomerUniqueEndpointUrl,
  getCountryCodeEndpointUrl,
  getCustomerTownsSummaryUrl,
  getTransactionTypesForCustomerTypeUrl,
  getCustomerBySearchByEmailUrl,
  getBrandsbyBrandCodeUrl,
  getPANVerificationUrl,
  getGSTVerificationUrl,
  getCatchmentListUrl,
  getRivaahCouponEndpointUrl,
  getEmailValidationUrl,
  getVerifyPanDetailsUrl,
  updatePanFormDetailsUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import {
  CustomerLov,
  Customers,
  CustomerInfo,
  PincodeSummary,
  CreatedCustomerResponse,
  TownSummary,
  TransactionTypeEnum,
  CUSTOMER_TYPE_ENUM,
  AllowedTransactionTypeMap,
  SEARCH_BY_ENUM,
  Brand,
  CustomerStateSummary,
  PanVerificationRequestPayload,
  ValidatePanResponse,
  GstVerificationRequestPayload,
  ValidateGstResponse,
  RivaahCouponDetail,
  ValidateEmailResponse,
  VerifyPanDetailsResponse,
  PanFormDetailsRequestPayload
} from '@poss-web/shared/models';
import {
  LovHelper,
  CustomerDataAdaptor,
  CustomerSearchAdaptor,
  TownDataAdaptor,
  BrandAdaptor
} from '@poss-web/shared/util-adaptors';
import {
  LovDataService,
  PinCodeDataService,
  StateDataService
} from '@poss-web/shared/masters/data-access-masters';

@Injectable({
  providedIn: 'root'
})
export class CustomerDataService {
  constructor(
    private apiService: ApiService,
    private pincodeService: PinCodeDataService,
    private lovService: LovDataService,
    private stateService: StateDataService
  ) {}

  getAllowedTransactionTypes(): Observable<AllowedTransactionTypeMap> {
    const regualrTypeCustomerURL = getTransactionTypesForCustomerTypeUrl(
      CUSTOMER_TYPE_ENUM.REGULAR
    );
    const instituationalTypeCustomerURL = getTransactionTypesForCustomerTypeUrl(
      CUSTOMER_TYPE_ENUM.INSTITUTIONAL
    );
    const internaltionalTypeCustomerURL = getTransactionTypesForCustomerTypeUrl(
      CUSTOMER_TYPE_ENUM.INTERNATIONAL
    );
    const oneTimeTypeCustomerURL = getTransactionTypesForCustomerTypeUrl(
      CUSTOMER_TYPE_ENUM.ONE_TIME
    );

    return this.apiService
      .get(regualrTypeCustomerURL.path, regualrTypeCustomerURL.params)
      .pipe(
        map((data: any) =>
          this.fetchTransactionType(
            CUSTOMER_TYPE_ENUM.REGULAR,
            new Map<CUSTOMER_TYPE_ENUM, TransactionTypeEnum[]>(),
            data
          )
        ),

        mergeMap((transactionTypeMap: AllowedTransactionTypeMap) =>
          this.apiService
            .get(
              instituationalTypeCustomerURL.path,
              instituationalTypeCustomerURL.params
            )
            .pipe(
              map((data: any) =>
                this.fetchTransactionType(
                  CUSTOMER_TYPE_ENUM.INSTITUTIONAL,
                  transactionTypeMap,
                  data
                )
              )
            )
        ),
        mergeMap((transactionTypeMap: AllowedTransactionTypeMap) =>
          this.apiService
            .get(
              internaltionalTypeCustomerURL.path,
              internaltionalTypeCustomerURL.params
            )
            .pipe(
              map((data: any) =>
                this.fetchTransactionType(
                  CUSTOMER_TYPE_ENUM.INTERNATIONAL,
                  transactionTypeMap,
                  data
                )
              )
            )
        ),
        mergeMap((transactionTypeMap: AllowedTransactionTypeMap) =>
          this.apiService
            .get(oneTimeTypeCustomerURL.path, oneTimeTypeCustomerURL.params)
            .pipe(
              map((data: any) =>
                this.fetchTransactionType(
                  CUSTOMER_TYPE_ENUM.ONE_TIME,
                  transactionTypeMap,
                  data
                )
              )
            )
        )
      );
  }

  fetchTransactionType(
    customerType: CUSTOMER_TYPE_ENUM,
    transactionTypeMap: AllowedTransactionTypeMap,
    data: any
  ): AllowedTransactionTypeMap {
    // data = {
    //   configId: '8B3A198B-B18A-4BBB-B8C2-C9061B4DBD7B',
    //   customerType: 'REGULAR',
    //   transactionType: ['GHS', 'GRF', 'AO', 'AB', 'CM', 'GEP', 'ASSM', 'ADV']
    // };
    if (data && data.transactionType && data.transactionType.length) {
      transactionTypeMap.set(
        customerType,
        data.transactionType as TransactionTypeEnum[]
      );
    }

    return transactionTypeMap;
  }

  getCustomerLovs(lovType: string): Observable<CustomerLov[]> {
    return this.lovService
      .getSalesLovs(lovType)
      .pipe(map((data: any) => LovHelper.getLovs(data)));
  }

  getBrandByCode(BrandCode: string): Observable<any> {
    const url = getBrandsbyBrandCodeUrl(BrandCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => BrandAdaptor.brandDataFromJson(data)));
  }

  saveCustomer = (data: Customers): Observable<CustomerInfo> => {
    const url = getCustomerSaveNewFormDetailsUrl();
    return this.apiService
      .post(url, data)
      .pipe(map((response: any) => CustomerSearchAdaptor.fromJson(response)));
  };

  updateCustomer = (
    customerId: string,
    customer: any
  ): Observable<CustomerInfo> =>
    this.apiService
      .patch(getCustomerDetailsUrl(customerId), customer)
      .pipe(map((response: any) => CustomerSearchAdaptor.fromJson(response)));

  searchCustomer(
    searchBy: SEARCH_BY_ENUM,
    searchValue: string
  ): Observable<CustomerInfo> {
    if (searchBy === SEARCH_BY_ENUM.EMAIL_ID) {
      const url = getCustomerBySearchByEmailUrl(searchBy, searchValue);
      return this.apiService.get(url.path, url.params).pipe(
        map((data: any) => {
          if (data?.results?.length > 0) {
            return CustomerSearchAdaptor.fromJson(data.results[0]);
          } else {
            return null;
          }
        })
      );
    } else {
      const url = getCustomerSearchUrl(searchBy, searchValue);
      return this.apiService
        .get(url.path, url.params)
        .pipe(map((data: any) => CustomerSearchAdaptor.fromJson(data)));
    }
  }

  searchOneTimeCustomer(
    searchBy: SEARCH_BY_ENUM,
    searchValue: string
  ): Observable<CustomerInfo[]> {
    const url = getCustomerBySearchByEmailUrl(searchBy, searchValue);
    return this.apiService.get(url.path, url.params).pipe(
      map((data: any) => {
        if (data?.results?.length > 0) {
          return CustomerSearchAdaptor.getOneTimeCustomer(data.results);
        } else {
          return null;
        }
      })
    );
  }

  getPincodeSummary(
    countryCode: string,
    pincode: string,
    pageIndex?: number,
    pageSize?: number,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<PincodeSummary> {
    return this.pincodeService
      .getPincodesSummary(
        countryCode,
        pincode,
        pageIndex,
        pageSize,
        isPageable,
        sort
      )
      .pipe(
        map((data: any) => CustomerDataAdaptor.pincodeDataSummaryFromJson(data))
      );
  }

  getStateSummary(
    countryCode: string,
    pageIndex?: number,
    pageSize?: number,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<CustomerStateSummary[]> {
    return this.stateService
      .getStatesSummary(countryCode, pageIndex, pageSize, false, sort)
      .pipe(
        map((data: any) => CustomerDataAdaptor.stateDataSummaryFromJson(data))
      );
  }

  getTownsSummary(
    stateName: string,
    pageIndex?: number,
    pageSize?: number,
    sort?: string[]
  ): Observable<TownSummary[]> {
    const url = getCustomerTownsSummaryUrl(
      stateName,
      pageIndex,
      pageSize,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => TownDataAdaptor.townDataSummaryFromJson(data)));
  }

  getCathmentList() {
    const url = getCatchmentListUrl();

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => CustomerDataAdaptor.getCatchmentList(data)));
  }

  getIsUniqueCustomer(searchType: string, value: string): Observable<boolean> {
    const url = getIsCustomerUniqueEndpointUrl(searchType, value);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: boolean) => data));
  }

  validatePAN(
    request: PanVerificationRequestPayload
  ): Observable<ValidatePanResponse> {
    const url = getPANVerificationUrl(request);
    return this.apiService
      .post(url.path, request.panDocument, url.params)
      .pipe(map((data: any) => CustomerDataAdaptor.panVerificationJson(data)));
  }

  validateGST(
    request: GstVerificationRequestPayload
  ): Observable<ValidateGstResponse> {
    const url = getGSTVerificationUrl(request);
    return this.apiService
      .post(url.path, {}, url.params)
      .pipe(map((data: any) => CustomerDataAdaptor.gstVerificationJson(data)));
  }

  validateEmail(emailId: string): Observable<ValidateEmailResponse> {
    const vendorCode = 'EMAIL_VALIDATION_TITAN';
    const verificationType = 'EMAIL';
    const url = getEmailValidationUrl(emailId, vendorCode, verificationType);
    return this.apiService
      .post(url.path, {}, url.params)
      .pipe(map((data: any) => CustomerDataAdaptor.emailvalidationJson(data)));
  }

  getCustomerDetails(
    customerId: string,
    isCalledFromCustomer?: boolean
  ): Observable<CreatedCustomerResponse> {
    const url = getCustomerDetailsUrl(customerId);
    return this.apiService
      .get(url)
      .pipe(
        map((data: any) =>
          CustomerDataAdaptor.customerFromJson(data, isCalledFromCustomer)
        )
      );
  }

  getCustomer(
    customerId: string,
    isCalledFromCustomer?: boolean
  ): Observable<CreatedCustomerResponse> {
    const url = getCustomerDetailsUrl(customerId);
    return this.apiService
      .get(url)
      .pipe(
        map((data: any) =>
          CustomerDataAdaptor.customerFromJson(data, isCalledFromCustomer)
        )
      );
  }

  getCountryCode(): Observable<any> {
    const url = getCountryCodeEndpointUrl();
    return this.apiService
      .get(url.path)
      .pipe(map((data: any) => data.country.countryCode));
  }

  getRivaahCouponDetails(
    customerId: string,
    couponSend: boolean
  ): Observable<RivaahCouponDetail> {
    const url = getRivaahCouponEndpointUrl(customerId, couponSend);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          CustomerDataAdaptor.rivaahCouponDetailJson(data, couponSend)
        )
      );
  }

  getVerifiedPanDetails(
    payload: PanVerificationRequestPayload
  ): Observable<VerifyPanDetailsResponse> {
    const url = getVerifyPanDetailsUrl(payload);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          CustomerDataAdaptor.verifyPanDetailsJson(data)
        )
      );
  }

  updatePanFormDetails(
    payload: PanFormDetailsRequestPayload
  ): Observable<any> {
    const url = updatePanFormDetailsUrl(payload);
    return this.apiService
      .post(url.path, payload.customerIdDetails, url.params)
      .pipe(
        map(data => data)
      );
  }

}
