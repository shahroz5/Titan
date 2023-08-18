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
  TepTypesEnum,
  CreateTepTypesEnum
} from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import {
  SummaryBarEventRef,
  SummaryBarEventType,
  TepPaymentTypesEnum
} from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import { SummaryBarBase } from '../summary-bar.service';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';
import { select } from '@ngrx/store';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'poss-web-summary-bar-tep',
  templateUrl: './summary-bar-tep.component.html',
  styleUrls: ['./summary-bar-tep.component.scss']
})
export class SummaryBarTepComponent implements OnInit, OnDestroy {
  events = new EventEmitter<SummaryBarEventRef>();
  currencyCode = '';
  remarksFormControl: FormControl;
  cardsTotalAmount = 0;
  tepItemsTotalQty$: Observable<number>;
  selectedCustomer$: Observable<CustomerInfo>;
  selectedRso$: Observable<string>;
  totalPaidAmount$: Observable<number>;
  remarksLabel = '';
  totalQty$: Observable<number>;
  totalGrossWt$: Observable<number>;
  totalExchangeAmt: number;
  totalRefundAmt: number;
  destroy$: Subject<null> = new Subject<null>();
  selectedPaymentMethod = '';
  selectedTepType = '';
  isCreateTep: boolean;
  tepPaymentTypesEnum = TepPaymentTypesEnum;
  createTepTypesEnum = CreateTepTypesEnum;
  isRequestRaisingScenario = false;
  isRefundFormValid = false;
  isL3Store = false;

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    public data: {
      type: TepTypesEnum;
      remarks: Observable<string>;
    },
    public currencySymbolService: CurrencySymbolService,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    private router: Router,
    private profiledatafacade: ProfileDataFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private commonFacade: CommonFacade
  ) {
    this.translate
      .get(['pw.summaryBar.remarksLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksLabel = translatedMessages['pw.summaryBar.remarksLabel'];
      });
  }

  ngOnInit() {
    this.locationSettingsFacade
      .getLocationSetting('currencyCode')
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
        console.log('CURRENCY CODE :', this.currencyCode);
      });
    this.remarksFormControl = new FormControl('', [
      this.fieldValidatorsService.remarkField(this.remarksLabel)
      // this.fieldValidatorsService.requiredField(this.remarksLabel)
    ]);
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
      });

    if (this.data?.remarks) {
      this.data.remarks
        .pipe(takeUntil(this.destroy$))
        .subscribe((remarks: string) => {
          this.remarksFormControl.reset();
          this.remarksFormControl.setValue(remarks);
        });
    }
    if (this.router.url.includes('create-tep')) {
      this.isCreateTep = true;
    } else {
      this.isCreateTep = false;
    }

    // this.totalQty$ = this.commonFacade.getTepTotalQty();
    // this.totalGrossWt$ = this.commonFacade.getTepTotalGrossWt();
    // this.totalExchangeAmt$ = this.commonFacade.getTepTotalExchangeAmt();
    this.totalQty$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.TEP,
      CommomStateAttributeNameEnum.TEP_TOTAL_QTY
    );
    this.totalGrossWt$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.TEP,
      CommomStateAttributeNameEnum.TEP_TOTAL_GROSS_WT
    );
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
    // this.tepFacade
    //   .getRemarks()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((remarks: string) => {
    //     console.log('TEP REMARKS :', remarks);
    //     this.remarksFormControl.setValue(remarks);
    //     this.remarksFormControl.updateValueAndValidity();
    //   });
    // this.commonFacade
    //   .getIsTepRefundFormValid()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.IS_TEP_REFUND_FORM_VALID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRefundFormValid: boolean) => {
        console.log('isRefundFormValid :', isRefundFormValid);
        this.isRefundFormValid = isRefundFormValid;
      });
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

    this.profiledatafacade
      .isL3Boutique()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isL3Store => (this.isL3Store = isL3Store));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.SELECTED_TEP_TYPE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedTepType: string) => {
        console.log('Selected tep type :', selectedTepType);
        this.selectedTepType = this.selectedTepType
          ? selectedTepType
          : this.createTepTypesEnum.REGULAR_TEP;
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

  clearGcData() {
    this.events.emit({
      eventType: SummaryBarEventType.CLAER
    });
    this.remarksFormControl.reset();
  }

  onHoldClicked() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.HOLD,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  onRefundClicked() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.REFUND,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  onGenerateCnClicked() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.GENERATE_CN,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  onRequestApprovalClicked() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.TEP_REQUEST_APPROVAL,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  delete() {
    this.events.emit({
      eventType: SummaryBarEventType.DELETE,
      remarks: this.remarksFormControl.value
    });
  }

  trimRemarks() {
    this.remarksFormControl.setValue(
      this.remarksFormControl.value.replace(/\s+/g, ' ')
    );
  }

  print() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT
    });
  }

  open() {
    this.events.emit({
      eventType: SummaryBarEventType.TEP_EXCEPTION
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
