import { Action } from '@ngrx/store';
import {
  StateDataService,
  CountryDataService,
  ZoneDataService,
  BrandDataService
} from '@poss-web/shared/masters/data-access-masters';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';

import { map } from 'rxjs/operators';

import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import * as CustomerActions from './customer.actions';
import { CustomerActionTypes } from './customer.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import {
  CustomErrors,
  TownSummary,
  CountrySummary,
  CustomerLov,
  CustomerInfo,
  PincodeSummary,
  Zone,
  CreatedCustomerResponse,
  AllowedTransactionTypeMap,
  SEARCH_BY_ENUM,
  CustomerStateSummary,
  ValidatePanResponse,
  ValidateGstResponse,
  RivaahCouponDetail,
  ValidateEmailResponse,
  VerifyPanDetailsResponse
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomerDataService } from '../customer.service';
import { Observable } from 'rxjs';

@Injectable()
export class CustomerEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private countryDataService: CountryDataService,
    private stateDataService: StateDataService,
    private customerDataService: CustomerDataService,
    private zoneDataService: ZoneDataService,
    private brandDataService: BrandDataService
  ) {}

  @Effect()
  loadCountries$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_COUNTRIES,
    {
      run: (action: CustomerActions.LoadCountries) => {
        return this.countryDataService
          .getCountrySummary(null, null, true)
          .pipe(
            map(
              (data: CountrySummary[]) =>
                new CustomerActions.LoadCountriesSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.LoadCountries,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadCountriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadStates$ = this.dataPersistence.fetch(CustomerActionTypes.LOAD_STATES, {
    run: (action: CustomerActions.LoadStates) => {
      return this.customerDataService
        .getStateSummary(action.payload, null, null, true, ['description'])
        .pipe(
          map(
            (data: CustomerStateSummary[]) =>
              new CustomerActions.LoadStatesSuccess(data)
          )
        );
    },
    onError: (action: CustomerActions.LoadStates, error: HttpErrorResponse) => {
      return new CustomerActions.LoadStatesFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadTowns$ = this.dataPersistence.fetch(CustomerActionTypes.LOAD_TOWNS, {
    run: (action: CustomerActions.LoadTowns) => {
      return this.customerDataService
        .getTownsSummary(action.payload, null, null)
        .pipe(
          map(
            (data: TownSummary[]) => new CustomerActions.LoadTownsSuccess(data)
          )
        );
    },
    onError: (action: CustomerActions.LoadTowns, error: HttpErrorResponse) => {
      return new CustomerActions.LoadTownsFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadCatchmentArea$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_CATCHMENT_AREA,
    {
      run: (action: CustomerActions.LoadCatchmentArea) => {
        return this.customerDataService
          .getCathmentList()
          .pipe(
            map(
              (data: []) => new CustomerActions.LoadCatchmentAreaSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.LoadCatchmentArea,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadCatchmentAreaFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAllowedTransactionTypes$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_ALLOWED_TRANSACTIONTYPES,
    {
      run: (action: CustomerActions.LoadAllowedTransactionTypes) => {
        return this.customerDataService
          .getAllowedTransactionTypes()
          .pipe(
            map(
              (data: AllowedTransactionTypeMap) =>
                new CustomerActions.LoadAllowedTransactionTypesSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.LoadAllowedTransactionTypes,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadAllowedTransactionTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPincode$ = this.dataPersistence.fetch(CustomerActionTypes.LOAD_PINCODE, {
    run: (action: CustomerActions.LoadPincode) => {
      return this.customerDataService
        .getPincodeSummary(
          action.payload.countryCode,
          action.payload.pincode,
          null,
          null,
          true
        )
        .pipe(
          map(
            (data: PincodeSummary) =>
              new CustomerActions.LoadPincodeSuccess(data)
          )
        );
    },
    onError: (
      action: CustomerActions.LoadPincode,
      error: HttpErrorResponse
    ) => {
      return new CustomerActions.LoadPincodeFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadIsUniqueMobile$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_MOBILE,
    {
      run: (action: CustomerActions.LoadCustomerUniqueMobile) => {
        return this.customerDataService
          .getIsUniqueCustomer(action.payload.searchType, action.payload.value)
          .pipe(
            map(
              (data: boolean) =>
                new CustomerActions.LoadCustomerUniqueMobileSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.LoadCustomerUniqueMobile,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadCustomerUniqueMobileFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadIsUniquepassport$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PASSPORT,
    {
      run: (action: CustomerActions.LoadCustomerUniquePassport) => {
        return this.customerDataService
          .getIsUniqueCustomer(action.payload.searchType, action.payload.value)
          .pipe(
            map(
              (data: boolean) =>
                new CustomerActions.LoadCustomerUniquePassportSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.LoadCustomerUniquePassport,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadCustomerUniquePassportFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadIsUniqueEmail$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_EMAIL,
    {
      run: (action: CustomerActions.LoadCustomerUniqueEmail) => {
        return this.customerDataService
          .getIsUniqueCustomer(action.payload.searchType, action.payload.value)
          .pipe(
            map(
              (data: boolean) =>
                new CustomerActions.LoadCustomerUniqueEmailSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.LoadCustomerUniqueEmail,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadCustomerUniqueEmailFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadIsUniquePan$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PAN,
    {
      run: (action: CustomerActions.LoadCustomerUniquePan) => {
        return this.customerDataService
          .getIsUniqueCustomer(action.payload.searchType, action.payload.value)
          .pipe(
            map(
              (data: boolean) =>
                new CustomerActions.LoadCustomerUniquePanSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.LoadCustomerUniquePan,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadCustomerUniquePanFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPanVerificationStatus$ = this.dataPersistence.fetch(
    CustomerActionTypes.PAN_CARD_VERIFICATION_STATUS,
    {
      run: (action: CustomerActions.PanCardVerificationStatus) => {
        return this.customerDataService
          .validatePAN(action.payload)
          .pipe(
            map(
              (data: ValidatePanResponse) =>
                new CustomerActions.PanCardVerificationStatusSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.PanCardVerificationStatus,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.PanCardVerificationStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadGstVerificationStatus$ = this.dataPersistence.fetch(
    CustomerActionTypes.GST_CARD_VERIFICATION_STATUS,
    {
      run: (action: CustomerActions.GstCardVerificationStatus) => {
        return this.customerDataService
          .validateGST(action.payload)
          .pipe(
            map(
              (data: ValidateGstResponse) =>
                new CustomerActions.GstCardVerificationStatusSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.GstCardVerificationStatus,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.GstCardVerificationStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadEmailValidationStatus$ = this.dataPersistence.fetch(
    CustomerActionTypes.EMAIL_VALIDATION_STATUS,
    {
      run: (action: CustomerActions.EmailValidationStatus) => {
        return this.customerDataService
          .validateEmail(action.payload)
          .pipe(
            map(
              (data: ValidateEmailResponse) =>
                new CustomerActions.EmailValidationStatusSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.EmailValidationStatus,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.EmailValidationStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadIsUniqueGst$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_GST,
    {
      run: (action: CustomerActions.LoadCustomerUniqueGst) => {
        return this.customerDataService
          .getIsUniqueCustomer(action.payload.searchType, action.payload.value)
          .pipe(
            map(
              (data: boolean) =>
                new CustomerActions.LoadCustomerUniqueGstSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.LoadCustomerUniqueGst,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadCustomerUniqueGstFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCountryCode$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_COUNTRY_CODE,
    {
      run: (action: CustomerActions.LoadCountryCode) => {
        return this.customerDataService
          .getCountryCode()
          .pipe(
            map((data: any) => new CustomerActions.LoadCountryCodeSuccess(data))
          );
      },
      onError: (
        action: CustomerActions.LoadCountryCode,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadCountryCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadSalutations$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_SALUTATIONS,
    {
      run: (action: CustomerActions.LoadSalutations) => {
        return this.customerDataService
          .getCustomerLovs(action.payload)
          .pipe(
            map(
              (data: CustomerLov[]) =>
                new CustomerActions.LoadSalutationsSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.LoadSalutations,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadSalutationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadIdProofs$ = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_ID_PROOFS,
    {
      run: (action: CustomerActions.LoadIdProofs) => {
        return this.customerDataService
          .getCustomerLovs(action.payload)
          .pipe(
            map(
              (data: CustomerLov[]) =>
                new CustomerActions.LoadIdProofsSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.LoadIdProofs,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadIdProofsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() SaveCustomer$: Observable<Action> = this.dataPersistence.fetch(
    CustomerActionTypes.SAVE_CUSTOMER_FORM_DETAILS,
    {
      run: (action: CustomerActions.SaveCustomerFormDetails) => {
        return this.customerDataService
          .saveCustomer(action.payload)
          .pipe(
            map(
              (createdCustomer: CustomerInfo) =>
                new CustomerActions.SaveCustomerFormDetailsSuccess(
                  createdCustomer
                )
            )
          );
      },

      onError: (
        action: CustomerActions.SaveCustomerFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.SaveCustomerFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() UpdateCustomer$: Observable<Action> = this.dataPersistence.fetch(
    CustomerActionTypes.UPDATE_CUSTOMER,
    {
      run: (action: CustomerActions.UpdateCustomer) => {
        return this.customerDataService
          .updateCustomer(action.payload.customerId, action.payload.data)
          .pipe(
            map(
              (updatedCustomer: CustomerInfo) =>
                new CustomerActions.UpdateCustomerSuccess(updatedCustomer)
            )
          );
      },

      onError: (
        action: CustomerActions.UpdateCustomer,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.UpdateCustomerFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() searchCustomer$: Observable<Action> = this.dataPersistence.fetch(
    CustomerActionTypes.SEARCH_CUSTOMER,
    {
      run: (action: CustomerActions.SearchCustomer) => {
        return this.customerDataService
          .searchCustomer(action.payload.searchBy, action.payload.searchValue)
          .pipe(
            map(
              (customer: CustomerInfo) =>
                new CustomerActions.SearchCustomerSuccess(customer)
            )
          );
      },

      onError: (
        action: CustomerActions.SearchCustomer,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.SearchCustomerFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() searchOneTimeCustomer$: Observable<Action> = this.dataPersistence.fetch(
    CustomerActionTypes.SEARCH_ONE_TIME_CUSTOMER,
    {
      run: (action: CustomerActions.SearchOneTimeCustomer) => {
        return this.customerDataService
          .searchOneTimeCustomer(action.payload.searchBy, action.payload.searchValue)
          .pipe(
            map(
              (customers: CustomerInfo[]) =>
                new CustomerActions.SearchOneTimeCustomerSuccess(customers)
            )
          );
      },

      onError: (
        action: CustomerActions.SearchOneTimeCustomer,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.SearchOneTimeCustomerFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  selectInternationalCustomer$ = this.dataPersistence.fetch(
    CustomerActionTypes.SELECT_INTERNATIONAL_CUSTOMER,
    {
      run: (action: CustomerActions.SelectInternationalCustomer) => {
        return this.customerDataService
          .searchCustomer(SEARCH_BY_ENUM.PASSPORT_ID, action.payload)
          .pipe(
            map(
              (data: CustomerInfo) =>
                new CustomerActions.SelectInternationalCustomerSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.SelectInternationalCustomer,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.SelectInternationalCustomerFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  selectOneTimeCustomer$ = this.dataPersistence.fetch(
    CustomerActionTypes.SELECT_ONETIME_CUSTOMER,
    {
      run: (action: CustomerActions.SelectOneTimeCustomer) => {
        return this.customerDataService
          .searchCustomer(SEARCH_BY_ENUM.CUSTOMER_ID, action.payload)
          .pipe(
            map(
              (data: CustomerInfo) =>
                new CustomerActions.SelectOneTimeCustomerSuccess(data)
            )
          );
      },
      onError: (
        action: CustomerActions.SelectOneTimeCustomer,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.SelectOneTimeCustomerFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() selectedCustomerDetail$: Observable<
    Action
  > = this.dataPersistence.fetch(CustomerActionTypes.SELECTED_CUSTOMER_DETAIL, {
    run: (action: CustomerActions.SelectedCustomerDetail) => {
      return this.customerDataService
        .getCustomerDetails(
          action.payload.customerId,
          action.payload.isCalledFromCustomer
        )
        .pipe(
          map(
            (customer: CreatedCustomerResponse) =>
              new CustomerActions.SelectedCustomerDetailSuccess(customer)
          )
        );
    },

    onError: (
      action: CustomerActions.SelectedCustomerDetail,
      error: HttpErrorResponse
    ) => {
      return new CustomerActions.SelectedCustomerDetailFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect()
  loadZones$: Observable<Action> = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_ZONES,
    {
      run: (action: CustomerActions.LoadZones) => {
        return this.zoneDataService.getZones().pipe(
          map((data: Zone[]) => {
            return new CustomerActions.LoadZonesSuccess(data);
          })
        );
      },
      onError: (
        action: CustomerActions.LoadZones,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadZonesFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() loadSelectedCustomer$: Observable<
    Action
  > = this.dataPersistence.fetch(CustomerActionTypes.LOAD_SELECTED_CUSTOMER, {
    run: (action: CustomerActions.LoadSelectedCustomer) => {
      return this.customerDataService
        .getCustomer(
          action.payload.customerId,
          action.payload.isCalledFromCustomer
        )
        .pipe(
          map((data: any) => {
            return new CustomerActions.LoadSelectedCustomerSuccess({
              customerInfo: data,
              enableClear: action.payload.enableClear,
              enableEdit: action.payload.enableEdit,
              enableCreate: action.payload.enableCreate
            });
          })
        );
    },

    onError: (
      action: CustomerActions.LoadSelectedCustomer,
      error: HttpErrorResponse
    ) => {
      return new CustomerActions.LoadSelectedCustomerFailure(
        this.errorHandler(error)
      );
    }
  });

  @Effect()
  loadBrandDetails$: Observable<Action> = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_BRAND_DETAILS,
    {
      run: (action: CustomerActions.LoadBrandDetails) => {
        return this.customerDataService.getBrandByCode(action.payload).pipe(
          map((data: any) => {
            return new CustomerActions.LoadBrandDetailsSuccess(data);
          })
        );
      },
      onError: (
        action: CustomerActions.LoadBrandDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadBrandDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getCustomer$: Observable<Action> = this.dataPersistence.fetch(
    CustomerActionTypes.GET_GHS_CUSTOMER_DETAILS,
    {
      run: (action: CustomerActions.GetGhsCustomerDetails) => {
        return this.customerDataService
          .searchCustomer(action.payload.searchBy, action.payload.searchValue)
          .pipe(
            map(
              (customer: CustomerInfo) =>
                new CustomerActions.GetCustomerDetailsSuccess(customer)
            )
          );
      },

      onError: (
        action: CustomerActions.GetGhsCustomerDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.GetCustomerDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getRivaahCuponDetail$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CustomerActionTypes.LOAD_RIVAAH_COUPON_DETAIL,
    {
      run: (action: CustomerActions.LoadRivaahCouponDetail) => {
        return this.customerDataService
          .getRivaahCouponDetails(action.customerId, action.sendCoupon)
          .pipe(
            map(
              (rivaahInfo: RivaahCouponDetail) =>
                new CustomerActions.LoadRivaahCouponDetailSucess(rivaahInfo)
            )
          );
      },

      onError: (
        action: CustomerActions.LoadRivaahCouponDetail,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.LoadRivaahCouponDetailFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() verifyPanDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CustomerActionTypes.VERIFY_PAN_DETAILS,
    {
      run: (action: CustomerActions.verifyPanDetails) => {
        return this.customerDataService
          .getVerifiedPanDetails(action.payload)
          .pipe(
            map(
              (data: VerifyPanDetailsResponse) =>
                new CustomerActions.verifyPanDetailsSuccess(data)
            )
          );
      },

      onError: (
        action: CustomerActions.verifyPanDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.verifyPanDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updatePanFormDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CustomerActionTypes.UPDATE_PAN_FORM_DETAILS,
    {
      run: (action: CustomerActions.updatePanFormDetails) => {
        return this.customerDataService
          .updatePanFormDetails(action.payload)
          .pipe(
            map(
              (data) =>
                new CustomerActions.updatePanFormDetailsSuccess(data)
            )
          );
      },

      onError: (
        action: CustomerActions.updatePanFormDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerActions.updatePanFormDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
