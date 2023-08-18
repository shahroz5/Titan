import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PasswordConfigFacade } from '@poss-web/eposs/password-config/data-access-password-config';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import {
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  ConfigurationsMenuKeyEnum,
  MetalRatesPayload,
  MetalRates,
  LocationSummaryList,
  GenerateBoutiquePasswordForGoldRateResponse,
  GenerateBoutiquePasswordForManualBillResponse,
  GenerateBoutiquePasswordForManualBillRequest,
  GenerateBoutiquePasswordForGoldRateRequest,
  ContextTypeEnum,
  GenerateCashDepositPasswordResponse,
  GenerateCashDepositPasswordRequest,
  TransactionTypes
} from '@poss-web/shared/models';
import { take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ErrorEnums } from '@poss-web/shared/util-error';

const transactionTypeCode = 'TRANSACTION_TYPE';

@Component({
  selector: 'poss-web-generate-password',
  templateUrl: './generate-password.component.html'
})
export class GeneratePasswordComponent implements OnInit, OnDestroy {
  generateBoutiquePasswordResponseForManualBill$: Observable<
    GenerateBoutiquePasswordForManualBillResponse
  >;
  generateBoutiquePasswordResponseForGoldRate$: Observable<
    GenerateBoutiquePasswordForGoldRateResponse
  >;
  generateCashDepositPasswordResponse$: Observable<
    GenerateCashDepositPasswordResponse
  >;

  locationCodes$: Observable<LocationSummaryList[]>;
  documentTypes$: Observable<TransactionTypes[]>;
  materialRates$: Observable<MetalRates[]>;
  isLoading$: Observable<boolean>;
  clearPriceData$: Subject<null> = new Subject<null>();
  destroy$: Subject<null> = new Subject<null>();
  contextTypeLabel: string;
  contextFormGroup: FormGroup;
  contextTypes = [
    {
      value: ContextTypeEnum.MANUAL_BILL,
      description: ContextTypeEnum.MANUAL_BILL
    },
    {
      value: ContextTypeEnum.GOLD_RATE,
      description: ContextTypeEnum.GOLD_RATE
    },
    {
      value: ContextTypeEnum.CASH_DEPOSIT,
      description: ContextTypeEnum.CASH_DEPOSIT
    }
  ];

  contextTypeEnumRef = ContextTypeEnum;

  constructor(
    private passwordConfigFacade: PasswordConfigFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private formbuilder: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.translate
      .get(['pw.passwordConfig.contextTypePlaceHolder'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.contextTypeLabel =
          translatedMsg['pw.passwordConfig.contextTypePlaceHolder'];
      });
  }

  ngOnInit(): void {
    this.createForm();
    this.passwordConfigFacade.resetValues();
    this.componentInit();
    this.generateBoutiquePasswordResponseForManualBill$ = this.passwordConfigFacade.getGenerateBoutiquePasswordForManualBillResponse();
    this.generateBoutiquePasswordResponseForGoldRate$ = this.passwordConfigFacade.getGenerateBoutiquePasswordForGoldRateResponse();
    this.generateCashDepositPasswordResponse$ = this.passwordConfigFacade.getGenerateCashDepositPasswordResponse();
    this.locationCodes$ = this.passwordConfigFacade.getLocationCodes();
    this.documentTypes$ = this.passwordConfigFacade.getDocumentTypes();
    this.materialRates$ = this.passwordConfigFacade.getMaterialPrices();
    this.isLoading$ = this.passwordConfigFacade.getIsLoading();
  }

  createForm() {
    this.contextFormGroup = this.formbuilder.group({
      contextType: [
        ContextTypeEnum.MANUAL_BILL,
        [this.fieldValidatorsService.requiredField(this.contextTypeLabel)]
      ]
    });
  }

  componentInit() {
    this.passwordConfigFacade.loadLocationCodes();
    this.passwordConfigFacade.loadDocumentTypes(transactionTypeCode);

    this.passwordConfigFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.contextFormGroup
      .get(['contextType'])
      .valueChanges.subscribe(val => {
        if (val) {
          this.passwordConfigFacade.resetPasswordValues();
        }
      });
  }

  generateBoutiquePasswordForManualBill(
    event: GenerateBoutiquePasswordForManualBillRequest
  ) {
    this.passwordConfigFacade.generateBoutiquePasswordForManualBill(event);
  }

  generateBoutiquePasswordForGoldRate(
    event: GenerateBoutiquePasswordForGoldRateRequest
  ) {
    this.passwordConfigFacade.generateBoutiquePasswordForGoldRate(event);
  }

  generateCashDepositPasswordEvent(event: GenerateCashDepositPasswordRequest) {
    this.passwordConfigFacade.generateCashDepositPassword(event);
  }

  getMaterialPrices(event: MetalRatesPayload) {
    this.passwordConfigFacade.loadMaterialPrices({
      applicableDate: event.applicableDate,
      locationCode: event.locationCode
    });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_CORE_034) {
      const key = 'pw.passwordConfig.metalPriceNotificationMsg';
      this.errorNotifications(key);
      this.clearPriceData$.next();
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          // Action based event
        });
    }
  }

  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.GLOBAL_CONFIGURATIONS_MENU_KEY
      }
    });
  }

  errorNotifications(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
