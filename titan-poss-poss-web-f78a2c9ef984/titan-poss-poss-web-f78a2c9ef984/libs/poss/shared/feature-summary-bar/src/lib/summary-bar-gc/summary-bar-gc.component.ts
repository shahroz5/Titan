import {
  Component,
  OnInit,
  Inject,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  GiftCardsTypesEnum,
  CustomerInfo,
  LocationSettingAttributesEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import {
  SummaryBarEventRef,
  SummaryBarEventType,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import { SummaryBarBase } from '../summary-bar.service';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';

@Component({
  selector: 'poss-web-summary-bar-gc',
  templateUrl: './summary-bar-gc.component.html',
  styleUrls: ['./summary-bar-gc.component.scss']
})
export class GiftCardSaleSummaryBarComponent
  implements OnInit, OnDestroy, SummaryBarBase {
  events = new EventEmitter<SummaryBarEventRef>();
  currencyCode = '';
  remarksFormControl: FormControl;
  cardsTotalAmount = 0;
  cardsTotalQty$: Observable<number>;
  selectedCustomer$: Observable<CustomerInfo>;
  selectedRso$: Observable<{ value: string; description: string }>;
  totalPaidAmount$: Observable<number>;
  giftCardsTypesEnum = GiftCardsTypesEnum;
  totalPaidAmount = 0;
  remarksLabel = '';
  statusTypesEnum = StatusTypesEnum;

  destroy$: Subject<null> = new Subject<null>();

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    public data: {
      status?: StatusTypesEnum;
      type: GiftCardsTypesEnum;
      remarks: Observable<string>;
    },
    public currencySymbolService: CurrencySymbolService,
    private paymentFacade: PaymentFacade,
    private commonFacade: CommonFacade,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    private locationSettingsFacade: LocationSettingsFacade
  ) {
    this.translate
      .get(['pw.summaryBar.remarksLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksLabel = translatedMessages['pw.summaryBar.remarksLabel'];
      });
  }

  ngOnInit() {
    this.remarksFormControl = new FormControl('', [
      this.fieldValidatorsService.remarkField(this.remarksLabel)
      // this.fieldValidatorsService.requiredField(this.remarksLabel)
    ]);
    if (this.data?.remarks) {
      this.data.remarks
        .pipe(takeUntil(this.destroy$))
        .subscribe((remarks: string) => {
          this.remarksFormControl.reset();
          this.remarksFormControl.setValue(remarks);
        });
    }
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
      });
    // this.cardsTotalQty$ = this.commonFacade.getGcTotalCardsQty();
    // this.selectedRso$ = this.commonFacade.getSelectedRsoName();
    // this.commonFacade
    //   .getTransactionTotalAmount()
    this.cardsTotalQty$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.GIFT_CARD,
      CommomStateAttributeNameEnum.GC_TOTAL_CARDS_QTY
    );
    this.selectedRso$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.GIFT_CARD,
      CommomStateAttributeNameEnum.GC_TOTAL_CARDS_QTY
    );
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_TOTAL_AMOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amount => {
        this.cardsTotalAmount = amount;
      });

    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(amount => {
        this.totalPaidAmount = amount;
      });
  }

  printAdvanceItem() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT,
      remarks: this.remarksFormControl.value
    });
  }

  clearGcData() {
    this.events.emit({
      eventType: SummaryBarEventType.CLAER
    });
    this.remarksFormControl.reset();
  }

  confirmAndPrint() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CONFRIM,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  cancelWithReturn() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CANCELWITHRETURN,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  cancelWithCn() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CANCELWITHCN,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  trimRemarks() {
    this.remarksFormControl.setValue(
      this.remarksFormControl.value.replace(/\s+/g, ' ')
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
