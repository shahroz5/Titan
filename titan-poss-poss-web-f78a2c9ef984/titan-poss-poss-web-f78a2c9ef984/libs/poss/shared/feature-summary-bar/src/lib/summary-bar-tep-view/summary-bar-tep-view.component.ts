import {
  Component,
  OnInit,
  Inject,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CustomerInfo,
  LocationSettingAttributesEnum,
  TepStatusEnum,
  TepTypesEnum
} from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import {
  SummaryBarEventRef,
  SummaryBarEventType,
  TepPaymentTypesEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import { SummaryBarBase } from '../summary-bar.service';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';
import { select } from '@ngrx/store';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

@Component({
  selector: 'poss-web-summary-bar-tep-view',
  templateUrl: './summary-bar-tep-view.component.html',
  styleUrls: ['./summary-bar-tep-view.component.scss']
})
export class SummaryBarTepViewComponent implements OnInit {
  events = new EventEmitter<SummaryBarEventRef>();
  currencyCode = '';
  remarksFormControl: FormControl;
  cardsTotalAmount = 0;
  tepItemsTotalQty$: Observable<number>;
  selectedCustomer$: Observable<CustomerInfo>;
  selectedRso$: Observable<string>;
  totalPaidAmount$: Observable<number>;

  totalQty$: Observable<number>;
  isValid$: Observable<boolean>;
  totalGrossWt$: Observable<number>;
  totalExchangeAmt$: Observable<number>;
  destroy$: Subject<null> = new Subject<null>();
  selectedPaymentMethod = '';
  tepPaymentTypesEnum = TepPaymentTypesEnum;
  isRequestRaisingScenario = false;
  isRefundFormValid = false;
  tepTypesEnum = TepTypesEnum;
  remarksLabel = '';
  tepStatusEnum = TepStatusEnum;
  totalRefundAmt$: Observable<number>;
  totalExchangeAmt: number;
  totalRefundAmt: number;

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    public data: {
      type: TepTypesEnum | TepStatusEnum;
      remarks: Observable<string>;
    },
    public currencySymbolService: CurrencySymbolService,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    private locationSettingsFacade: LocationSettingsFacade,
    private commonFacade: CommonFacade
  ) {
    this.translate
      .get(['pw.gep.cancelSearch5'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksLabel = translatedMessages['pw.gep.cancelSearch5'];
      });
  }

  ngOnInit() {
    this.remarksFormControl = new FormControl('', [
      this.fieldValidatorsService.remarkField(this.remarksLabel),
      this.fieldValidatorsService.requiredField(this.remarksLabel)
    ]);
    this.locationSettingsFacade
      .getLocationSetting('currencyCode')
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
      });

    // this.fieldValidatorsService.requiredField(this.remarksLabel)

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
      });

    // this.totalQty$ = this.commonFacade.getTepTotalQty();
    this.totalQty$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.TEP,
      CommomStateAttributeNameEnum.TEP_TOTAL_QTY
    );
    // this.totalGrossWt$ = this.commonFacade.getTepTotalGrossWt();
    this.totalGrossWt$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.TEP,
      CommomStateAttributeNameEnum.TEP_TOTAL_GROSS_WT
    );
    // this.totalExchangeAmt$ = this.commonFacade.getTepTotalExchangeAmt();
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.TEP_TOTAL_EXCHANGE_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalExchangeAmt: number) => {
        this.totalExchangeAmt = Math.round(totalExchangeAmt);
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.TEP_TOTAL_REFUND_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalRefundAmt: number) => {
        this.totalRefundAmt = Math.round(totalRefundAmt);
      });

    // this.isValid$ = this.commonFacade.getApprovalValid();
    this.isValid$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.TEP,
      CommomStateAttributeNameEnum.SEND_TO_COMMERCIAL
    );
    // this.commonFacade
    //   .getTepSelectedPaymentMethod()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.TEP_SELECETED_PAYMENT_METHOD
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedPaymentMethod: string) => {
        console.log('Selected Payment method :', selectedPaymentMethod);
        this.selectedPaymentMethod = selectedPaymentMethod;
      });
    // this.commonFacade
    //   .getIsTepRequestRaising()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.IS_TEP_REQUEST_RAISING
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRequestRaising: boolean) => {
        console.log('IS REQUEST RAISING :', isRequestRaising);
        this.isRequestRaisingScenario = isRequestRaising;
      });
  }

  onRequestApprovalClicked() {
    this.events.emit({
      eventType: SummaryBarEventType.TEP_REQUEST_APPROVAL,
      remarks: ''
    });
  }

  onRequestConfirmClicked() {
    this.events.emit({
      eventType: SummaryBarEventType.CONFRIM,
      remarks: ''
    });
  }

  onRequestcancelClicked() {
    this.events.emit({
      eventType: SummaryBarEventType.CANCEL,
      remarks: ''
    });
  }

  onCancelClicked() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CANCEL_TEP,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  print() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT
    });
  }

  printAnnexure() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT_ANNEXURE
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
