import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/operators';
import {
  CODetailsResponse,
  COMOrders,
  CreateCOResponse,
  CustomErrors,
  Lov
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomerOrderActionTypes } from './customer-order.actions';
import * as CustomerOrderActions from './customer-order.actions';
import { CustomerOrderState } from './customer-order.state';
import { CustomerOrderService } from '../customer-order.service';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class CustomerOrderEffect {
  constructor(
    private loggerService: LoggerService,
    private dataPersistence: DataPersistence<CustomerOrderState>,
    private customerOrderService: CustomerOrderService,
    private lovDataService: LovDataService
  ) {}

  @Effect() fetchCO$: Observable<Action> = this.dataPersistence.fetch(
    CustomerOrderActionTypes.FETCH_CO,
    {
      run: (action: CustomerOrderActions.FetchCO) => {
        return this.customerOrderService
          .fetchCO(action.payload.locationCode, action.payload.requestDetails)
          .pipe(
            map((data: COMOrders[]) => {
              return new CustomerOrderActions.FetchCOSuccess(data);
            })
          );
      },

      onError: (
        action: CustomerOrderActions.FetchCO,
        error: HttpErrorResponse
      ) => {
        return new CustomerOrderActions.FetchCOFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() createCO$: Observable<Action> = this.dataPersistence.fetch(
    CustomerOrderActionTypes.CREATE_CO,
    {
      run: (action: CustomerOrderActions.CreateCO) => {
        return this.customerOrderService
          .createCO(
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.requestDetails
          )
          .pipe(
            map((data: CreateCOResponse) => {
              return new CustomerOrderActions.CreateCOSuccess(data);
            })
          );
      },

      onError: (
        action: CustomerOrderActions.CreateCO,
        error: HttpErrorResponse
      ) => {
        return new CustomerOrderActions.CreateCOFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() viewCO$: Observable<Action> = this.dataPersistence.fetch(
    CustomerOrderActionTypes.VIEW_CO,
    {
      run: (action: CustomerOrderActions.ViewCO) => {
        return this.customerOrderService
          .viewCO(
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.id
          )
          .pipe(
            map((data: CODetailsResponse) => {
              return new CustomerOrderActions.ViewCOSuccess(data);
            })
          );
      },

      onError: (
        action: CustomerOrderActions.ViewCO,
        error: HttpErrorResponse
      ) => {
        return new CustomerOrderActions.ViewCOFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() updateCO$: Observable<Action> = this.dataPersistence.fetch(
    CustomerOrderActionTypes.UPDATE_CO,
    {
      run: (action: CustomerOrderActions.UpdateCO) => {
        return this.customerOrderService
          .updateCO(
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.id,
            action.payload.status,
            action.payload.requestDetails
          )
          .pipe(
            map((data: CODetailsResponse) => {
              return new CustomerOrderActions.UpdateCOSuccess(data);
            })
          );
      },

      onError: (
        action: CustomerOrderActions.UpdateCO,
        error: HttpErrorResponse
      ) => {
        return new CustomerOrderActions.UpdateCOFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() partialUpdateCO$: Observable<Action> = this.dataPersistence.fetch(
    CustomerOrderActionTypes.PARTIAL_UPDATE_CO,
    {
      run: (action: CustomerOrderActions.PartialUpdateCO) => {
        return this.customerOrderService
          .partialUpdateCO(
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.id,
            action.payload.requestDetails
          )
          .pipe(
            map((data: CODetailsResponse) => {
              return new CustomerOrderActions.PartialUpdateCOSuccess(data);
            })
          );
      },

      onError: (
        action: CustomerOrderActions.PartialUpdateCO,
        error: HttpErrorResponse
      ) => {
        return new CustomerOrderActions.PartialUpdateCOFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() deleteCO$: Observable<Action> = this.dataPersistence.fetch(
    CustomerOrderActionTypes.DELETE_CO,
    {
      run: (action: CustomerOrderActions.DeleteCO) => {
        return this.customerOrderService
          .deleteCO(
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.id
          )
          .pipe(
            map((data: boolean) => {
              return new CustomerOrderActions.DeleteCOSuccess(true);
            })
          );
      },

      onError: (
        action: CustomerOrderActions.DeleteCO,
        error: HttpErrorResponse
      ) => {
        return new CustomerOrderActions.DeleteCOFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadRelationshipTypes$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CustomerOrderActionTypes.LOAD_RELATIONSHIP_TYPES,
    {
      run: (action: CustomerOrderActions.LoadRelationshipTypes) => {
        return this.lovDataService.getSalesLovs(action.payload).pipe(
          map((data: Lov[]) => {
            return new CustomerOrderActions.LoadRelationshipTypesSuccess(data);
          })
        );
      },

      onError: (
        action: CustomerOrderActions.LoadRelationshipTypes,
        error: HttpErrorResponse
      ) => {
        return new CustomerOrderActions.LoadRelationshipTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updatePriceDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    CustomerOrderActionTypes.UPDATE_PRICE_DETAILS,
    {
      run: (action: CustomerOrderActions.UpdatePriceDetails) => {
        return this.customerOrderService
          .updatePriceDetails(
            action.payload.id,
            action.payload.txnType,
            action.payload.subTxnType,
            action.action
          )
          .pipe(
            map((data: CODetailsResponse) => {
              return new CustomerOrderActions.UpdatePriceDetailsSuccess(data);
            })
          );
      },

      onError: (
        action: CustomerOrderActions.UpdatePriceDetails,
        error: HttpErrorResponse
      ) => {
        return new CustomerOrderActions.UpdatePriceDetailsFailure(
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
