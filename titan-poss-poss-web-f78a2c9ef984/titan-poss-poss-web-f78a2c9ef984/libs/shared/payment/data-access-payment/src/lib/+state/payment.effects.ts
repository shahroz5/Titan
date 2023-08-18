import { Injectable } from '@angular/core';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';

import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map, mergeMap } from 'rxjs/operators';
import { PaymentState } from './payment.state';
import { PaymentActionTypes } from './payment.actions';
import * as PaymentActions from './payment.actions';
import { PaymentService } from '../payment.service';
import { UnipayService } from '../unipay.service';

import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  PaymentModeEnum,
  PaymentDetails,
  QCGCCardDetails,
  AllowedPaymentsResponse,
  PaymentConfig,
  StoreUser,
  PaymentRequest,
  GHSeVoucherDetails,
  CNListResponsePayload,
  CNListResponse,
  GHSAccountDetails,
  GHSAttachments,
  CreditNoteDetail,
  DigiPriceDetails,
  DigiGoldDetails,
  PaymentStatusEnum,
  CashLimitDetails,
  MaxCashAmountDetails,
  AdvanceBookingDetailsResponse,
  FileUploadLists
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { CommonService } from '@poss-web/shared/common/data-access-common';

@Injectable()
export class PaymentEffects {
  constructor(
    private dataPersistence: DataPersistence<PaymentState>,
    private paymentsService: PaymentService,
    private unipayService: UnipayService,
    private loggerService: LoggerService,
    private storeUserDataService: StoreUserDataService,
    private commonService: CommonService
  ) {}

  @Effect()
  loadAllowedPayments$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_ALLOWED_PAYMENTS,
    {
      run: (action: PaymentActions.LoadAllowedPayments) => {
        return this.paymentsService.getAllowedPayments(action.payload).pipe(
          mergeMap((allowedPaymentsResponse: AllowedPaymentsResponse) => {
            const newActions: any[] = [
              new PaymentActions.LoadAllowedPaymentsSuccess(
                allowedPaymentsResponse
              )
            ];
            if (
              allowedPaymentsResponse.allowedPayments.has(PaymentModeEnum.CARD)
            ) {
              newActions.push(new PaymentActions.LoadPayeeBanks());
            }

            if (
              allowedPaymentsResponse.allowedPayments.has(PaymentModeEnum.CARD)
            ) {
              newActions.push(new PaymentActions.LoadCardPayerBanks());
            }

            if (
              allowedPaymentsResponse.allowedPayments.has(PaymentModeEnum.DD)
            ) {
              newActions.push(new PaymentActions.LoadDDPayerBanks());
            }

            if (
              allowedPaymentsResponse.allowedPayments.has(
                PaymentModeEnum.CHEQUE
              )
            ) {
              newActions.push(new PaymentActions.LoadChequePayerBanks());
            }

            if (
              allowedPaymentsResponse.allowedPayments.has(
                PaymentModeEnum.RO_PAYMENT
              )
            ) {
              newActions.push(new PaymentActions.LoadRSOList());
            }
            return newActions;
          })
        );
      },
      onError: (
        action: PaymentActions.LoadAllowedPayments,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadAllowedPaymentsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPaymentDetails$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_PAYMENT_DETAILS,
    {
      run: (action: PaymentActions.LoadPaymentDetails) => {
        return this.paymentsService
          .loadPaymentDetails(
            action.payload.transactionId,
            action.payload.transactionType,
            action.payload.subTransactionType
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails[]) =>
                new PaymentActions.LoadPaymentDetailsSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.LoadPaymentDetails,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadPaymentDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCreditNoteDetails$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_CREDIT_NOTE_DETAILS,
    {
      run: (action: PaymentActions.LoadCreditNoteDetails) => {
        return this.paymentsService
          .loadCreditNoteDetails(
            action.payload.transactionId,
            action.payload.transactionType
          )
          .pipe(
            map(
              (paymentDetails: CNListResponsePayload[]) =>
                new PaymentActions.LoadCreditNoteDetailsSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.LoadCreditNoteDetails,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadCreditNoteDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  confirmPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.CONFIRM_PAYMENT,
    {
      run: (action: PaymentActions.ConfirmPayment) => {
        return this.paymentsService
          .confirmPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.paymentDetails.paymentId,
            action.payload.paymentDetails.details,
            action.payload.paymentMode
          )
          .pipe(
            map((paymentDetails: PaymentDetails) => {
              return new PaymentActions.ConfirmPaymentSuccess(paymentDetails);
            })
          );
      },
      onError: (
        action: PaymentActions.ConfirmPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.ConfirmPaymentFailure({
          error: this.errorHandler(error),
          paymentId: action.payload.paymentDetails.paymentId
        });
      }
    }
  );
  @Effect()
  loadRSOList$ = this.dataPersistence.fetch(PaymentActionTypes.LOAD_RSO_LIST, {
    run: (action: PaymentActions.LoadRSOList) => {
      return this.storeUserDataService
        .getStoreUsers(null, null, null, null, ['RSO'])
        .pipe(
          map(
            (rsoList: StoreUser[]) =>
              new PaymentActions.LoadRSOListSuccess(rsoList)
          )
        );
    },
    onError: (action: PaymentActions.LoadRSOList, error: HttpErrorResponse) => {
      return new PaymentActions.LoadRSOListFailure(this.errorHandler(error));
    }
  });

  @Effect()
  loadPayeeBanks$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_PAYEE_BANKS,
    {
      run: (action: PaymentActions.LoadPayeeBanks) => {
        return this.paymentsService
          .loadPayeeBanks()
          .pipe(
            map(
              (payeeBanks: string[]) =>
                new PaymentActions.LoadPayeeBanksSuccess(payeeBanks)
            )
          );
      },
      onError: (
        action: PaymentActions.LoadPayeeBanks,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadPayeeBanksFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getGVBalance$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_GV_BALANCE,
    {
      run: (action: PaymentActions.GetGVBalance) => {
        return this.paymentsService
          .getGVBalance(action.payload)
          .pipe(map(data => new PaymentActions.GetGVBalanceSuccess(data)));
      },
      onError: (
        action: PaymentActions.GetGVBalance,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetGVBalanceFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  loadCardPayerBanks$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_CARD_PAYER_BANKS,
    {
      run: (action: PaymentActions.LoadCardPayerBanks) => {
        return this.paymentsService
          .loadPayerBanks(PaymentModeEnum.CARD)
          .pipe(
            map(
              (config: PaymentConfig) =>
                new PaymentActions.LoadCardPayerBanksSuccess(config)
            )
          );
      },
      onError: (
        action: PaymentActions.LoadCardPayerBanks,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadCardPayerBanksFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadEncireclePoints$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_ENCIRECLE_POINTS,
    {
      run: (action: PaymentActions.LoadEncireclePoints) => {
        return this.paymentsService
          .loadEncirclePoints(action.payload)
          .pipe(
            map(
              (points: number) =>
                new PaymentActions.LoadEncireclePointsSuccess(points)
            )
          );
      },
      onError: (
        action: PaymentActions.LoadEncireclePoints,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadEncireclePointsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadUnipayConfiguration$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_UNIPAY_HOST_CONFIGURATION,
    {
      run: (action: PaymentActions.UnipayHostConfiguration) => {
        return this.unipayService
          .getUnipayConfiguration()
          .pipe(
            map(
              (paymentEnabled: string[]) =>
                new PaymentActions.UnipayHostConfigurationSuccess(
                  paymentEnabled
                )
            )
          );
      },
      onError: (
        action: PaymentActions.UnipayHostConfiguration,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.UnipayHostConfigurationFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadDDPayerBanks$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_DD_PAYER_BANKS,
    {
      run: (action: PaymentActions.LoadDDPayerBanks) => {
        return this.paymentsService
          .loadPayerBanks(PaymentModeEnum.DD)
          .pipe(
            map(
              (config: PaymentConfig) =>
                new PaymentActions.LoadDDPayerBanksSuccess(config)
            )
          );
      },
      onError: (
        action: PaymentActions.LoadDDPayerBanks,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadDDPayerBanksFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadChequePayerBanks$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_CHEQUE_PAYER_BANKS,
    {
      run: (action: PaymentActions.LoadChequePayerBanks) => {
        return this.paymentsService
          .loadPayerBanks(PaymentModeEnum.CHEQUE)
          .pipe(
            map(
              (config: PaymentConfig) =>
                new PaymentActions.LoadChequePayerBanksSuccess(config)
            )
          );
      },
      onError: (
        action: PaymentActions.LoadChequePayerBanks,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadChequePayerBanksFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addCashPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_CASH_PAYMENT,
    {
      run: (action: PaymentActions.AddCashPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddCashPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddCashPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddCashPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addROPayments$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_RO_PAYMENT,
    {
      run: (action: PaymentActions.AddROPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddROPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddROPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddROPaymentFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  addROManualPayments$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_MANUAL_PAYMENT,
    {
      run: (action: PaymentActions.AddManualPayment) => {
        return this.paymentsService
          .addManualPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddManualPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddManualPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddManualPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addCardPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_CARD_PAYMENT,
    {
      run: (action: PaymentActions.AddCardPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddCardPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddCardPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddCardPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  sendPaymentRequest$ = this.dataPersistence.fetch(
    PaymentActionTypes.SEND_PAYMENT_REQUEST,
    {
      run: (action: PaymentActions.SendPaymentRequest) => {
        return this.paymentsService
          .sendROPaymentRquest(action.payload)
          .pipe(
            map(
              (data: any) => new PaymentActions.SendPaymentRequestSuccess(data)
            )
          );
      },
      onError: (
        action: PaymentActions.SendPaymentRequest,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.SendPaymentRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addChequeDDPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_CHEQUE_DD_PAYMENT,
    {
      run: (action: PaymentActions.AddChequeDDPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddChequeDDPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddChequeDDPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddChequeDDPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addEncirclePointsPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_ENCIRCLE_POINTS_PAYMENT,
    {
      run: (action: PaymentActions.AddEncirclePointsPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddEncirclePointsPaymentSuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: PaymentActions.AddEncirclePointsPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddEncirclePointsPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addQCGCPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_QCGC_PAYMENT,
    {
      run: (action: PaymentActions.AddQCGCPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddQCGCPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddQCGCPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddQCGCPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addDigiPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_DIGI_GOLD_PAYMENT,
    {
      run: (action: PaymentActions.AddDigiPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddDigiPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddDigiPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddDigiPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addGVPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_GV_PAYMENT,
    {
      run: (action: PaymentActions.AddGVPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddGVPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddGVPayment,
        error: HttpErrorResponse
      ) => {
        const msg = new PaymentActions.AddQCGCPaymentFailure(
          this.errorHandler(error)
        );

        return new PaymentActions.AddGVPaymentFailure({
          ...action.payload,
          PaymentFailureMsg: msg.payload.message
        });
      }
    }
  );
  @Effect()
  addUnipayPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_UNIPAY_PAYMENT,
    {
      run: (action: PaymentActions.AddUnipayPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddUnipayPaymentSuccess({
                  amount: paymentDetails.amount,
                  id: paymentDetails.id
                })
            )
          );
      },
      onError: (
        action: PaymentActions.AddUnipayPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddUnipayPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  startUnipayPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.START_UNIPAY_PAYMENT,
    {
      run: (action: PaymentActions.StartUnipayPayment) => {
        return this.unipayService
          .startUnipayPayment(action.payload)
          .pipe(
            map(
              (uniPayResponse: any) =>
                new PaymentActions.StartUnipayPaymentSuccess(uniPayResponse)
            )
          );
      },
      onError: (
        action: PaymentActions.StartUnipayPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.StartUnipayPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateUnipayPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.UPDATE_UNIPAY_PAYMENT,
    {
      run: (action: PaymentActions.UpdateUnipayPayment) => {
        return this.unipayService
          .updateUniPayment(action.payload)
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.UpdateUnipayPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.UpdateUnipayPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.UpdateUnipayPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  deletePayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.DELETE_PAYMENT,
    {
      run: (action: PaymentActions.DeletePayment) => {
        return this.paymentsService
          .deletePayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.paymentId
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.DeletePaymentSuccess(
                  action.payload.paymentId,
                  {
                    ...paymentDetails,
                    showPopup: action.payload.showPopup === false ? false : true
                  }
                )
            )
          );
      },
      onError: (
        action: PaymentActions.DeletePayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.DeletePaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadROPaymentRequestStatus$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_RO_PAYMENT_REQUEST_STATUS,
    {
      run: (action: PaymentActions.LoadROPaymentRequestStatus) => {
        return this.paymentsService
          .getROPaymentRequestStatus(action.payload)
          .pipe(
            map((request: PaymentRequest) => {
              return new PaymentActions.LoadROPaymentRequestStatusSuccess(
                request
              );
            })
          );
      },
      onError: (
        action: PaymentActions.LoadROPaymentRequestStatus,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadROPaymentRequestStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPaymentRequestStatus$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_PAYMENT_REQUEST_STATUS,
    {
      run: (action: PaymentActions.LoadPaymentRequestStatus) => {
        return this.paymentsService
          .getPaymentRequestStatus(action.payload, action.paymentCode)
          .pipe(
            map((request: PaymentRequest[]) => {
              return new PaymentActions.LoadPaymentRequestStatusSuccess(
                request
              );
            })
          );
      },
      onError: (
        action: PaymentActions.LoadPaymentRequestStatus,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadPaymentRequestStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  editCashPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.EDIT_CASH_PAYMENT,
    {
      run: (action: PaymentActions.EditCashPayment) => {
        return this.paymentsService
          .editPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.paymentDetails.paymentId,
            action.payload.paymentDetails.details
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.EditCashPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.EditCashPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.EditCashPaymentFailure({
          error: this.errorHandler(error),
          paymentId: action.payload.paymentDetails.paymentId
        });
      }
    }
  );

  @Effect()
  loadMaxCashLimit$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_MAX_CASH_LIMIT,
    {
      run: (action: PaymentActions.LoadMaxCashLimit, state: any) => {
        return this.paymentsService
          .getMaxCashLimit(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.customerId,
            action.payload.paymentCode,
            action.payload.paymentGroup,
            action.payload.transactionId
          )
          .pipe(
            mergeMap((maxLimit: CashLimitDetails) => {
              const actions: any[] = [
                new PaymentActions.LoadMaxCashLimitSuccess(maxLimit)
              ];
              if (maxLimit.eligibleAmount <= 0) {
                actions.push(new PaymentActions.LoadCashLimitCap());
              }

              return actions;
            })
          );
      },
      onError: (
        action: PaymentActions.LoadMaxCashLimit,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadMaxCashLimitFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCashLimitCap$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_CASH_LIMIT_CAP,
    {
      run: (action: PaymentActions.LoadCashLimitCap, state: any) => {
        return this.paymentsService
          .getCashLimitCap()
          .pipe(
            map(
              (maxLimit: MaxCashAmountDetails) =>
                new PaymentActions.LoadCashLimitCapSuccess(maxLimit)
            )
          );
      },
      onError: (
        action: PaymentActions.LoadCashLimitCap,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadCashLimitCapFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  voidUnipayPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.VOID_UNIPAY_PAYMENT,
    {
      run: (action: PaymentActions.VoidUnipayPayment) => {
        return this.unipayService.voidUnipayPayment(action.payload).pipe(
          map((uniPayResponse: any) => {
            // if (uniPayResponse.response.ResponseCode === 0) {
            //   return new PaymentActions.DeletePayment({
            //     transactionType: action.payload.transactionType,
            //     subTransactionType: action.payload.subTransactionType,
            //     paymentId: action.payload.txnId
            //   });
            // } else {
            return new PaymentActions.VoidUnipayPaymentSuccess({
              res: uniPayResponse,
              status: 'success',
              unipayDetails: action.payload.unipayDetails
            });
            // }
          })
        );
      },
      onError: (
        action: PaymentActions.VoidUnipayPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.VoidUnipayPaymentFailure(
          {
            paymentId: action.payload.txnId,
            status: 'error',
            unipayDetails: action.payload.unipayDetails
          }
          // this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getQCGCBalance$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_QCGC_BALANCE,
    {
      run: (action: PaymentActions.GetQCGCBalance) => {
        return this.paymentsService.getQCGCBalance(action.payload).pipe(
          map((cardInfo: QCGCCardDetails) => {
            return new PaymentActions.GetQCGCBalanceSuccess(cardInfo);
          })
        );
      },
      onError: (
        action: PaymentActions.GetQCGCBalance,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetQCGCBalanceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getDigiBalance$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_DIGI_BALANCE,
    {
      run: (action: PaymentActions.GetDigiBalance) => {
        return this.paymentsService.getDigiBalance(action.payload).pipe(
          map((info: DigiGoldDetails) => {
            return new PaymentActions.GetDigiBalanceSuccess(info);
          })
        );
      },
      onError: (
        action: PaymentActions.GetDigiBalance,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetDigiBalanceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getDigiPrice$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_DIGI_PRICE,
    {
      run: (action: PaymentActions.GetDigiPrice) => {
        return this.paymentsService.getDigiPrice(action.payload).pipe(
          map((info: DigiPriceDetails) => {
            return new PaymentActions.GetDigiPriceSuccess(info);
          })
        );
      },
      onError: (
        action: PaymentActions.GetDigiPrice,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetDigiPriceFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  generateDigiOtp$ = this.dataPersistence.fetch(
    PaymentActionTypes.GENERATE_OTP_FOR_DIGI,
    {
      run: (action: PaymentActions.GenerateOtpForDigiGold) => {
        return this.paymentsService.generateDigiOtp(action.payload).pipe(
          map((info: any) => {
            return new PaymentActions.GenerateOtpForDigiGoldSuccess(info);
          })
        );
      },
      onError: (
        action: PaymentActions.GenerateOtpForDigiGold,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GenerateOtpForDigiGoldFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getGHSeVoucherCustomerBalance$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_GHS_eVOUCHER_BALANCE,
    {
      run: (action: PaymentActions.GetGHSeVoucherBalance) => {
        return this.paymentsService
          .getGHSeVoucherCustomerBalance(action.payload)
          .pipe(
            map((cardInfo: GHSeVoucherDetails) => {
              return new PaymentActions.GetGHSeVoucherBalanceSuccess(cardInfo);
            })
          );
      },
      onError: (
        action: PaymentActions.GetGHSeVoucherBalance,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetGHSeVoucherBalanceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addWalletPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_WALLET_PAYMENT,
    {
      run: (action: PaymentActions.AddWalletPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddWalletPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddWalletPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddWalletPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addCreditNotePayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_CREDIT_NOTE_PAYMENT,
    {
      run: (action: PaymentActions.AddCreditNotePayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddCreditNotePaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddCreditNotePayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddCreditNotePaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addEmployeeLoanPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_EMPLOYEE_LOAN_PAYMENT,
    {
      run: (action: PaymentActions.AddEmployeeLoanPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddEmployeeLoanPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddEmployeeLoanPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddEmployeeLoanPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addBankLoanPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_BANK_LOAN_PAYMENT,
    {
      run: (action: PaymentActions.AddBankLoanPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddBankLoanPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddBankLoanPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddBankLoanPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addRtgsPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_RTGS_PAYMENT,
    {
      run: (action: PaymentActions.AddRtgsPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddRtgsPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddRtgsPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddRtgsPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addUPIPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_UPI_PAYMENT,
    {
      run: (action: PaymentActions.AddUPIPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddUPIPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddUPIPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddUPIPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addAirpayPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_AIRPAY_PAYMENT,
    {
      run: (action: PaymentActions.AddAirpayPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddAirpayPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddAirpayPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddAirpayPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  startAirpayIntPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.START_AIRPAY_INT_PAYMENT,
    {
      run: (action: PaymentActions.StartAirpayIntPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.StartAirpayIntPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.StartAirpayIntPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.StartAirpayIntPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  resendPaymentLink$ = this.dataPersistence.fetch(
    PaymentActionTypes.UPDATE_INT_PAYMENT,
    {
      run: (action: PaymentActions.UpdateIntPayment) => {
        return this.paymentsService
          .resendPaymentLink(action.payload)
          .pipe(
            map(
              (paymentDetails: PaymentRequest) =>
                new PaymentActions.UpdateIntPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.UpdateIntPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.UpdateIntPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ValidateIntegratedPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.VALIDATE_INT_PAYMENT,
    {
      run: (action: PaymentActions.ValidateIntPayment) => {
        return this.paymentsService
          .validateIntegratedPayment(action.payload)
          .pipe(
            map(
              (paymentDetails: PaymentRequest) =>
                new PaymentActions.ValidateIntPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.ValidateIntPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.ValidateIntPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  startRazorpayPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.START_RAZORPAY_PAYMENT,
    {
      run: (action: PaymentActions.StartRazorpayPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.StartRazorpayPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.StartRazorpayPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.StartRazorpayPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  // @Effect()
  // resendRazorpayLink$ = this.dataPersistence.fetch(
  //   PaymentActionTypes.UPDATE_RAZORPAY_PAYMENT,
  //   {
  //     run: (action: PaymentActions.UpdateRazorpayPayment) => {
  //       return this.paymentsService
  //         .resendPaymentLink(
  //           action.payload.transactionType,
  //           action.payload.subTransactionType,
  //           action.payload.paymentDetails.paymentId,
  //           action.payload.paymentDetails.details,
  //           action.payload.status
  //         )
  //         .pipe(
  //           map(
  //             (paymentDetails: PaymentDetails) =>
  //               new PaymentActions.UpdateRazorpayPaymentSuccess(paymentDetails)
  //           )
  //         );
  //     },
  //     onError: (
  //       action: PaymentActions.UpdateRazorpayPayment,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new PaymentActions.UpdateRazorpayPaymentFailure(
  //         this.errorHandler(error)
  //       );
  //     }
  //   }
  // );
  // @Effect()
  // validateRazorpay$ = this.dataPersistence.fetch(
  //   PaymentActionTypes.VALIDATE_RAZORPAY_PAYMENT,
  //   {
  //     run: (action: PaymentActions.ValidateRazorpayPayment) => {
  //       return this.paymentsService
  //         .validatePayment(
  //           action.payload.transactionType,
  //           action.payload.subTransactionType,
  //           action.payload.paymentId,
  //           action.payload.inputValue
  //         )
  //         .pipe(
  //           map(
  //             (paymentDetails: PaymentDetails) =>
  //               new PaymentActions.ValidateRazorpayPaymentSuccess(
  //                 paymentDetails
  //               )
  //           )
  //         );
  //     },
  //     onError: (
  //       action: PaymentActions.ValidateRazorpayPayment,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new PaymentActions.ValidateRazorpayPaymentFailure(
  //         this.errorHandler(error)
  //       );
  //     }
  //   }
  // );

  @Effect()
  ValidadteEncicrcle$ = this.dataPersistence.fetch(
    PaymentActionTypes.VALIDATE_PAYMENT,
    {
      run: (action: PaymentActions.ValidatePayment) => {
        return this.paymentsService
          .validatePayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.paymentId,
            action.payload.inputValue
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.ValidatePaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.ValidatePayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.ValidatePaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadOpenAirpayPaymentDetails$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_OPEN_AIRPAY_PAYMENT_DETAILS,
    {
      run: (action: PaymentActions.LoadOpenAirpayPaymentDetails) => {
        return this.paymentsService
          .loadPaymentDetails(
            action.payload.transactionId,
            action.payload.transactionType,
            action.payload.subTransactionType
          )
          .pipe(
            map((paymentDetails: PaymentDetails[]) => {
              const openPayments = [];
              paymentDetails
                .filter(x => {
                  if (
                    x &&
                    x.paymentCode === PaymentModeEnum.AIRPAY &&
                    (x.status === PaymentStatusEnum.OPEN ||
                      x.status === PaymentStatusEnum.INPROGRESS)
                  ) {
                    return x;
                  }
                })
                .forEach((x: PaymentDetails) => {
                  openPayments.push({ ...x });
                });
              return new PaymentActions.LoadOpenAirpayPaymentDetailsSuccess(
                openPayments
              );
            })
          );
      },
      onError: (
        action: PaymentActions.LoadOpenAirpayPaymentDetails,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadOpenAirpayPaymentDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCMRequestPaymentDetails$ = this.dataPersistence.fetch(
    PaymentActionTypes.LOAD_CM_REQUEST_PAYMENT_DETAILS,
    {
      run: (action: PaymentActions.LoadCMRequestPaymentDetails) => {
        return this.paymentsService
          .loadCMRequestPaymentDetails(
            action.payload.processId,
            action.payload.taskId,
            action.payload.taskName,
            action.payload.workFlowType
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails[]) =>
                new PaymentActions.LoadCMRequestPaymentDetailsSuccess(
                  paymentDetails
                )
            )
          );
      },
      onError: (
        action: PaymentActions.LoadCMRequestPaymentDetails,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.LoadCMRequestPaymentDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addGHSeVoucherPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_GHS_eVOUCHER_PAYMENT,
    {
      run: (action: PaymentActions.AddGHSeVoucherPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddGHSeVoucherPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddGHSeVoucherPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddGHSeVoucherPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getCreditNoteList$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_CREDIT_NOTE_LIST,
    {
      run: (action: PaymentActions.GetCreditNoteList) => {
        return this.paymentsService.loadCreditNoteList(action.payload).pipe(
          map((request: CNListResponse) => {
            return new PaymentActions.GetCreditNoteListSuccess(request);
          })
        );
      },
      onError: (
        action: PaymentActions.GetCreditNoteList,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetCreditNoteListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getThirdPartyCnList$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_THIRD_PARTY_CN_LIST,
    {
      run: (action: PaymentActions.GetThirdPartyCNList) => {
        return this.paymentsService.getThirdPartyCnList(action.payload).pipe(
          map((request: CNListResponse) => {
            return new PaymentActions.GetThirdPartyCNListSuccess(request);
          })
        );
      },
      onError: (
        action: PaymentActions.GetThirdPartyCNList,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetThirdPartyCNListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  generateOtpForCn$ = this.dataPersistence.fetch(
    PaymentActionTypes.GENERATE_OTP_FOR_CN,
    {
      run: (action: PaymentActions.GenerateOtpForCn) => {
        return this.paymentsService.generateOTPForCN(action.payload).pipe(
          map((request: string) => {
            return new PaymentActions.GenerateOtpForCnSuccess();
          })
        );
      },
      onError: (
        action: PaymentActions.GenerateOtpForCn,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GenerateOtpForCnFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  generateOtpForEmpLoan$ = this.dataPersistence.fetch(
    PaymentActionTypes.GENERATE_OTP_FOR_EMP_LOAN,
    {
      run: (action: PaymentActions.GenerateOtpForEmpLoan) => {
        return this.paymentsService.generateOTPForCN(action.payload).pipe(
          map((request: string) => {
            return new PaymentActions.GenerateOtpForEmpLoanSuccess();
          })
        );
      },
      onError: (
        action: PaymentActions.GenerateOtpForEmpLoan,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GenerateOtpForEmpLoanFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getInvokedCreditNote$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_INVOKED_CREDIT_NOTE,
    {
      run: (action: PaymentActions.GetInvokedCreditNote) => {
        return this.paymentsService.invokeCN(action.payload).pipe(
          map((request: CNListResponse) => {
            return new PaymentActions.GetInvokedCreditNoteSuccess(request);
          })
        );
      },
      onError: (
        action: PaymentActions.GetInvokedCreditNote,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetInvokedCreditNoteFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  getGHSAccountDetails$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_GHS_ACCOUNT_DETAILS,
    {
      run: (action: PaymentActions.GetGHSAccountDetails) => {
        return this.paymentsService.getGHSAccountDetails(action.payload).pipe(
          map((details: GHSAccountDetails) => {
            return new PaymentActions.GetGHSAccountDetailsSuccess(details);
          })
        );
      },
      onError: (
        action: PaymentActions.GetGHSAccountDetails,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetGHSAccountDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getGHSAttachments$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_GHS_ATTACHMENTS,
    {
      run: (action: PaymentActions.GetGHSAttachments) => {
        return this.paymentsService.getGHSAttachments(action.payload).pipe(
          map((details: GHSAttachments[]) => {
            return new PaymentActions.GetGHSAttachmentsSuccess(details);
          })
        );
      },
      onError: (
        action: PaymentActions.GetGHSAttachments,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetGHSAttachmentsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  addGHSAccountPayment$ = this.dataPersistence.fetch(
    PaymentActionTypes.ADD_GHS_ACCOUNT_PAYMENT,
    {
      run: (action: PaymentActions.AddGHSAccountPayment) => {
        return this.paymentsService
          .addPayment(
            action.payload.transactionType,
            action.payload.subTransactionType,
            action.payload.transactionId,
            action.payload.paymentDetails,
            action.payload?.isTcsPayment
          )
          .pipe(
            map(
              (paymentDetails: PaymentDetails) =>
                new PaymentActions.AddGHSAccountPaymentSuccess(paymentDetails)
            )
          );
      },
      onError: (
        action: PaymentActions.AddGHSAccountPayment,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.AddGHSAccountPaymentFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getCreditNoteDetail$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_CREDIT_NOTE_DETAIL,
    {
      run: (action: PaymentActions.GetCreditNoteDetail) => {
        return this.paymentsService
          .getCreditNoteDetailById(action.payload)
          .pipe(
            map((creditNoteDetails: CreditNoteDetail) => {
              return new PaymentActions.GetCreditNoteDetailSuccess(
                creditNoteDetails
              );
            })
          );
      },
      onError: (
        action: PaymentActions.GetCreditNoteDetail,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetCreditNoteDetailFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getDiscountIdsInCreditNote$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_DISCOUNT_IDS_IN_CREDIT_NOTE,
    {
      run: (action: PaymentActions.GetDiscountIdsInCreditNote) => {
        return this.paymentsService
          .getDiscountIdsInCreditNote(action.payload)
          .pipe(
            map((data: string[]) => {
              return new PaymentActions.GetDiscountIdsInCreditNoteSuccess(data);
            })
          );
      },
      onError: (
        action: PaymentActions.GetDiscountIdsInCreditNote,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetDiscountIdsInCreditNoteFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  GetEmpLoanConfigList$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_EMP_LOAN_DETAILS,
    {
      run: (action: PaymentActions.GetEmpLoanDetails) => {
        return this.paymentsService
          .getEmpLoanDetails(action.payload)
          .pipe(map(data => new PaymentActions.GetEmpLoanDetailsSuccess(data)));
      },
      onError: (
        action: PaymentActions.GetEmpLoanDetails,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetEmpLoanDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  GetCashBackOfferBankDetails$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_CASH_BACK_OFFER_BANK_DETAILS,
    {
      run: (action: PaymentActions.GetCashBackOfferBankDetails) => {
        return this.paymentsService
          .getCahbacOfferkBankDetail()
          .pipe(
            map(
              data =>
                new PaymentActions.GetCashBackOfferBankDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: PaymentActions.GetCashBackOfferBankDetails,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetCashBackOfferBankDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  GetCashBackOfferConfigDetails$ = this.dataPersistence.fetch(
    PaymentActionTypes.GET_CASH_BACK_OFFER_CONFIG_DETAILS,
    {
      run: (action: PaymentActions.GetCashBackOfferConfigDetails) => {
        return this.paymentsService
          .getCashBackConfigDetails(action.payload)
          .pipe(
            map(
              data =>
                new PaymentActions.GetCashBackOfferConfigDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: PaymentActions.GetCashBackOfferConfigDetails,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.GetCashBackOfferConfigDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ValidateCashBackOfferCard$ = this.dataPersistence.fetch(
    PaymentActionTypes.VALIDATE_CASH_BACK_OFFER_CARD,
    {
      run: (action: PaymentActions.ValidateCashBackOfferCard) => {
        return this.paymentsService
          .validateCashbackCard(action.payload)
          .pipe(
            map(
              data => new PaymentActions.ValidateCashBackOfferCardSuccess(data)
            )
          );
      },
      onError: (
        action: PaymentActions.ValidateCashBackOfferCard,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.ValidateCashBackOfferCardFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileUpload$: Observable<Action> = this.dataPersistence.fetch(
    PaymentActionTypes.FILE_UPLOAD,
    {
      run: (action: PaymentActions.FileUpload) => {
        return this.commonService
          .uploadFile(action.payload)
          .pipe(map((data: any) => new PaymentActions.FileUploadSuccess(true)));
      },

      onError: (
        action: PaymentActions.FileUpload,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.FileUploadFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() getFileUploadList$: Observable<Action> = this.dataPersistence.fetch(
    PaymentActionTypes.FILE_UPLOAD_LIST,
    {
      run: (action: PaymentActions.FileUploadList) => {
        return this.commonService
          .uploadFileList(action.payload)
          .pipe(
            map(
              (data: FileUploadLists[]) =>
                new PaymentActions.FileUploadListSuccess(data)
            )
          );
      },

      onError: (
        action: PaymentActions.FileUploadList,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.FileUploadListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getFileDownload$: Observable<Action> = this.dataPersistence.fetch(
    PaymentActionTypes.FILE_DOWNLOAD_URL,
    {
      run: (action: PaymentActions.FileDownloadUrl) => {
        return this.commonService
          .downloadFile(action.payload)
          .pipe(
            map(
              (data: string) => new PaymentActions.FileDownloadUrlSuccess(data)
            )
          );
      },

      onError: (
        action: PaymentActions.FileDownloadUrl,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.FileDownloadUrlFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updatePaymentStatusForVoidUnipay$: Observable<
    Action
  > = this.dataPersistence.fetch(
    PaymentActionTypes.UPDATE_PAYMENT_STATUS_FOR_VOID_UNIPAY,
    {
      run: (action: PaymentActions.UpdatePaymentStatusForVoidUnipay) => {
        return this.paymentsService
          .updatePaymentStatusForVoidUnipay(action.payload)
          .pipe(
            map(
              (data: boolean) =>
                new PaymentActions.UpdatePaymentStatusForVoidUnipaySuccess({
                  res: true,
                  callCancelBillWithReturn:
                    action.payload.callCancelBillWithReturn
                })
            )
          );
      },

      onError: (
        action: PaymentActions.UpdatePaymentStatusForVoidUnipay,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.UpdatePaymentStatusForVoidUnipayFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateCNStatusForVoidUnipay$: Observable<
    Action
  > = this.dataPersistence.fetch(
    PaymentActionTypes.UPDATE_CN_STATUS_FOR_VOID_UNIPAY,
    {
      run: (action: PaymentActions.UpdateCNStatusForVoidUnipay) => {
        return this.paymentsService
          .updateCNStatusForVoidUnipay(action.payload)
          .pipe(
            map(
              (data: boolean) =>
                new PaymentActions.UpdateCNStatusForVoidUnipaySuccess(data)
            )
          );
      },

      onError: (
        action: PaymentActions.UpdateCNStatusForVoidUnipay,
        error: HttpErrorResponse
      ) => {
        return new PaymentActions.UpdateCNStatusForVoidUnipayFailure(
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
