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
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-summary-bar-ab',
  templateUrl: './summary-bar-ab.component.html',
  styleUrls: ['./summary-bar-ab.component.scss']
})
export class SummaryBarAbComponent
  implements OnInit, OnDestroy, SummaryBarBase {
  events = new EventEmitter<SummaryBarEventRef>();
  remarksFormControl: FormControl;

  weightUnit: string;
  currencyCode: string;
  productQty = 0;
  coinQty = 0;

  get totalQty(): number {
    return this.productQty + this.coinQty;
  }

  productWeight = 0;
  coinWeight = 0;

  get totalWeight(): number {
    return this.productWeight + this.coinWeight;
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
  hallmarkCharges = 0;
  hallmarkDiscount = 0;

  get totalAmount(): number {
    return this.totalAmt;
  }

  private destroy$ = new Subject<void>();
  productAmount$: Observable<number>;
  remarksLabel = '';
  permissions$: Observable<any[]>;

  CUSTOMER_ACTIVATION_AB_SUBMENU =
    'Customer Transaction Status-Confirm Activation Bill Submenu';
  CUSTOMER_CANCEL_BILL_CONFIRM =
    'Customer Transaction Status-Confirm Cancellation Bill Submenu';

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    public data: {
      status: string;
      type: string;
      remarks: Observable<string>;
    },
    private commonFacade: CommonFacade,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    public locationSettingsFacade: LocationSettingsFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.translate
      .get(['pw.summaryBar.remarksLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksLabel = translatedMessages['pw.summaryBar.remarksLabel'];
      });
  }

  ngOnInit(): void {
    // this.productAmount$ = this.commonFacade.getProductAmt();
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.productAmount$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
      CommomStateAttributeNameEnum.PRODUCT_AMT
    );

    this.remarksFormControl = new FormControl('', [
      this.fieldValidatorsService.remarkField(this.remarksLabel)
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
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_WEIGHT_UNIT)
      .pipe(takeUntil(this.destroy$))
      .subscribe(weightUnit => {
        this.weightUnit = weightUnit;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.PRODUCT_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => (this.productAmt = amt));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.COIN_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => (this.coinAmt = amt));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.TAX_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => (this.taxAmt = amt));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.PRODUCT_DISC
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((disc: number) => (this.productDisc = disc));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.COIN_DISC
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((disc: number) => (this.coinDisc = disc));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.PRODUCT_QTY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((qty: number) => (this.productQty = qty));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.COIN_QTY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((qty: number) => (this.coinQty = qty));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.FINAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => (this.totalAmt = amt));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.ROUND_OFF
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((roundOff: number) => (this.roundOff = roundOff));
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.HALLMARK_CHARGES
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (hallmarkCharges: number) => (this.hallmarkCharges = hallmarkCharges)
      );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.HALLMARK_DISCOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (hallmarkDiscount: number) => (this.hallmarkDiscount = hallmarkDiscount)
      );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.PRODUCT_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((weight: number) => (this.productWeight = weight));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.COIN_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((weight: number) => (this.coinWeight = weight));
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  regulrizeAB() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.REGULARIZE_AB,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  delete() {
    this.events.emit({
      eventType: SummaryBarEventType.DELETE
    });
  }
  cancelAB() {
    this.events.emit({
      eventType: SummaryBarEventType.CANCEL_AB
    });
  }

  confirmRejection() {
    this.events.emit({
      eventType: SummaryBarEventType.CONFIRMCANCEL
    });
  }

  suspendRejection() {
    this.events.emit({
      eventType: SummaryBarEventType.SUSPEND_AB
    });
  }
  clear() {
    this.events.emit({
      eventType: SummaryBarEventType.CLAER
    });
    this.remarksFormControl.reset();
  }
  ActivateAB() {
    this.events.emit({
      eventType: SummaryBarEventType.ACTIVATE_AB
    });
  }
  addPayment() {
    this.events.emit({
      eventType: SummaryBarEventType.ADD_PAYMENT
    });
  }

  Freeze() {
    this.events.emit({
      eventType: SummaryBarEventType.FREEZE
    });
  }
  trimRemarks() {
    this.remarksFormControl.setValue(
      this.remarksFormControl.value.replace(/\s+/g, ' ')
    );
  }
  requestCancelAB() {
    this.events.emit({
      eventType: SummaryBarEventType.CANCEL_REQUEST_AB
    });
  }

  requestActivateAB() {
    this.events.emit({
      eventType: SummaryBarEventType.ACTIVATE_REQUEST_AB
    });
  }
  print() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT
    });
  }
  /// to check if complete amount is paid

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
