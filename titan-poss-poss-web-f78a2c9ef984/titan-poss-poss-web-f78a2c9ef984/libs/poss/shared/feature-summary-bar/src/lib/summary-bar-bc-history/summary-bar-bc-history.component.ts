import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  Component,
  OnDestroy,
  Inject,
  OnInit,
  EventEmitter
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';
import { takeUntil } from 'rxjs/operators';
import {
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  LocationSettingAttributesEnum,
  SummaryBarEventRef,
  SummaryBarEventType
} from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SummaryBarBase } from '../summary-bar.service';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

@Component({
  selector: 'poss-web-summary-bar-bc-history',
  templateUrl: './summary-bar-bc-history.component.html',
  styleUrls: ['./summary-bar-bc-history.component.scss']
})
export class SummaryBarBcHistoryComponent implements OnInit {

  events = new EventEmitter<SummaryBarEventRef>();
  remarksFormControl: FormControl;

  weightUnit: string;
  currencyCode: string;
  productQty = 0;
  coinQty = 0;
  remarksLabel = '';
  focQty = 0;
  focWeight = 0;

  get totalQty(): number {
    return this.productQty + this.coinQty + this.focQty;
  }

  productWeight = 0;
  coinWeight = 0;

  get totalWeight(): number {
    return this.productWeight + this.coinWeight + this.focWeight;
  }

  productDisc = 0;
  coinDisc = 0;

  get totalDisc(): number {
    return this.productDisc + this.coinDisc;
  }

  productAmt = 0;
  coinAmt = 0;
  taxAmt = 0;
  totalAmt = 0;
  roundOff = 0;
  tcsCollectedAmount: number;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  otherCharges = 0;

  private destroy$ = new Subject<void>();
  productAmount$: Observable<number>;
  isApproval = true;

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    public data: {
      status: string;
      approval: boolean;
      remarks: Observable<string>;
    },
    private commonFacade: CommonFacade,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    public locationSettingsFacade: LocationSettingsFacade
  ) {
    if (data) {
      this.isApproval = data?.approval;
    }

    this.translate
      .get(['pw.summaryBar.remarksLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksLabel = translatedMessages['pw.summaryBar.remarksLabel'];
      });
  }

  ngOnInit(): void {
    // this.productAmount$ = this.commonFacade.getProductAmt();
    this.productAmount$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.BILL_CANCELLATION,
      CommomStateAttributeNameEnum.PRODUCT_AMT
    );
    this.remarksFormControl = new FormControl('', [
      this.fieldValidatorsService.remarkField(this.remarksLabel)
    ]);

    this.commonFacade
    .getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.FOC,
      CommomStateAttributeNameEnum.FOC_ITEMS
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.focQty = 0;
      this.focWeight = 0;
      data.forEach(element => {
        this.focQty = this.focQty + element.totalQuantity;
        this.focWeight = this.focWeight + element.totalWeight;
      });
    });

    this.commonFacade
    .getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.BILL_CANCELLATION,
      CommomStateAttributeNameEnum.TCS_COLLECTED_AMOUNT
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe(tcsCollectedAmount => {
      this.tcsCollectedAmount = tcsCollectedAmount ? tcsCollectedAmount : 0;
    });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.HALLMARK_CHARGES
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (hallmarkCharges: number) => (this.hallmarkCharges = hallmarkCharges)
      );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.HALLMARK_DISCOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (hallmarkDiscount: number) => (this.hallmarkDiscount = hallmarkDiscount)
      );

      this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.OTHER_CHARGES
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((charges: any) => {
        if (charges) {
          this.otherCharges = charges.data?.value;
        } else {
          this.otherCharges = 0;
        }
      });


    this.commonFacade
    .getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.GLOBAL,
      CommomStateAttributeNameEnum.TRANSACTION_TOTAL_AMOUNT
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe(amount => {
      this.totalAmt = amount;
      console.log(this.totalAmt,'new amount')
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

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.PRODUCT_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => (this.productAmt = amt));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.COIN_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => (this.coinAmt = amt));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.TAX_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => (this.taxAmt = amt));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.PRODUCT_DISC
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((disc: number) => (this.productDisc = disc));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.COIN_DISC
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((disc: number) => (this.coinDisc = disc));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.PRODUCT_QTY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((qty: number) => (this.productQty = qty));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.COIN_QTY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((qty: number) => (this.coinQty = qty));


    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.ROUND_OFF
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((roundOff: number) => (this.roundOff = roundOff));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.PRODUCT_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((weight: number) => (this.productWeight = weight));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.COIN_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((weight: number) => (this.coinWeight = weight));
  }
  print() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
