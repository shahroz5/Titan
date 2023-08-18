import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  LocationSettingAttributesEnum,
  SummaryBarEventRef,
  SummaryBarEventType
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SummaryBarBase } from '../summary-bar.service';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';

@Component({
  selector: 'poss-web-summary-bar-co',
  templateUrl: './summary-bar-co.component.html',
  styleUrls: ['./summary-bar-co.component.scss']
})
export class SummaryBarCoComponent
  implements OnInit, SummaryBarBase, OnDestroy {
  events = new EventEmitter<SummaryBarEventRef>();
  weightUnit: string;
  currencyCode: string;

  productQty = 0;

  get totalQty(): number {
    return this.productQty;
  }

  productAmt = 0;

  get totalAmount(): number {
    return this.finalAmt;
  }

  productWeight = 0;

  get totalWeight(): number {
    return this.productWeight;
  }

  productDisc = 0;

  get totalDisc(): number {
    return this.productDisc;
  }

  private destroy$ = new Subject<void>();
  remarksFormControl: FormControl;
  remarksLabel = '';
  taxAmt = 0;
  finalAmt = 0;
  roundOff = 0;

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    private data: {},
    public commonFacade: CommonFacade,
    public locationSettingsFacade: LocationSettingsFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.summaryBar.remarksLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksLabel = translatedMessages['pw.summaryBar.remarksLabel'];
      });
  }

  ngOnInit(): void {
    this.remarksFormControl = new FormControl('', [
      this.fieldValidatorsService.remarkField(this.remarksLabel)
    ]);
    this.componentInit();
  }

  componentInit() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.PRODUCT_QTY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((qty: number) => (this.productQty = qty));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.PRODUCT_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amount: number) => (this.productAmt = amount));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.PRODUCT_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((weight: number) => (this.productWeight = weight));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.PRODUCT_DISC
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((discount: number) => (this.productDisc = discount));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.TAX_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((tax: number) => (this.taxAmt = tax));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.FINAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => {
        this.finalAmt = amt;
      });

      this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.ROUND_OFF
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((roundOff: number) => {
        this.roundOff = roundOff;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_WEIGHT_UNIT)
      .pipe(takeUntil(this.destroy$))
      .subscribe(weightUnit => {
        this.weightUnit = weightUnit;
      });
  }

  trimRemarks() {
    this.remarksFormControl.setValue(
      this.remarksFormControl.value.replace(/\s+/g, ' ')
    );
  }

  hold() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.HOLD,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }
  confirm() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CONFRIM,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }
  clear() {
    this.remarksFormControl.reset();
    this.events.emit({
      eventType: SummaryBarEventType.CLAER
    });
  }
  print() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT
    });
  }
  delete() {
    this.events.emit({
      eventType: SummaryBarEventType.DELETE
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
