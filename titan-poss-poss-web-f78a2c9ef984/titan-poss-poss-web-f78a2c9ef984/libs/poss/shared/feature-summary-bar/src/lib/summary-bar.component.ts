import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  Component,
  OnDestroy,
  Inject,
  OnInit,
  EventEmitter,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SUMMARY_BAR_DATA } from './summary-bar.token';
import { takeUntil } from 'rxjs/operators';
import {
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  LocationSettingAttributesEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  ShortcutServiceAbstraction,
  Command
} from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SummaryBarBase } from './summary-bar.service';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

const buttonFocusKey = 'Global.OVERLAY_FOCUS';

@Component({
  selector: 'poss-web-summary-bar',
  templateUrl: './summary-bar.component.html',
  styleUrls: ['./summary-bar.component.scss']
})
export class SummaryBarComponent implements OnInit, OnDestroy, SummaryBarBase {
  events = new EventEmitter<SummaryBarEventRef>();
  remarksFormControl: FormControl;

  weightUnit: string;
  currencyCode: string;
  productQty = 0;
  otherCharges = 0;
  coinQty = 0;
  focQty = 0;
  focWeight = 0;

  remarksLabel = '';
  totalTcsAmt: number;
  permissions$: Observable<any[]>;

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
  hallmarkCharges = 0;
  hallmarkDiscount = 0;

  get totalAmount(): number {
    return this.totalAmt;
  }

  private destroy$ = new Subject<void>();
  productAmount$: Observable<number>;
  isErrorinPriceUpdate = false;
  isSystemDvDiscountApplied = 0;
  @ViewChild('clearButtonRef', { static: true })
  clearButtonRef: ElementRef;

  CASH_MEMO_CONFIRM_SUBMENU =
    'Customer Transaction Status-Cashmemo Confirm Submenu';
  CASH_MEMO_HOLD_SUBMENU = 'Customer Transaction Status-Cashmemo Hold Submenu';
  AB_HOLD_SUBMENU = 'Customer Transaction Status-AB Hold Submenu';

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    private data: {
      remarks: Observable<string>;
      isRemarksMandatory: Observable<boolean>;
    },
    public commonFacade: CommonFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService,
    public locationSettingsFacade: LocationSettingsFacade,
    private shortcutService: ShortcutServiceAbstraction,
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
      CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.PRODUCT_AMT
    );
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.DISCOUNT,
        CommomStateAttributeNameEnum.DISCOUNT_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.isSystemDvDiscountApplied = data?.data?.ghsDiscountDetails
          ?.voucherDetails
          ? data?.data?.ghsDiscountDetails?.voucherDetails?.length
          : 0;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TCS_TO_BE_COLLECTED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.totalTcsAmt = data ? data : 0;
      });
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
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.PRODUCT_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (amt: number) => (console.log(this.productAmt), (this.productAmt = amt))
      );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.COIN_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => (this.coinAmt = amt));

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
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TAX_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => (this.taxAmt = amt));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.PRODUCT_DISC
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((disc: number) => (this.productDisc = disc));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.COIN_DISC
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((disc: number) => (this.coinDisc = disc));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.PRODUCT_QTY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((qty: number) => (this.productQty = qty));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.COIN_QTY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((qty: number) => (this.coinQty = qty));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.FINAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((amt: number) => {
        this.totalAmt = amt;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.ROUND_OFF
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((roundOff: number) => (this.roundOff = roundOff));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.HALLMARK_CHARGES
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (hallmarkCharges: number) => (this.hallmarkCharges = hallmarkCharges)
      );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.HALLMARK_DISCOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (hallmarkDiscount: number) => (this.hallmarkDiscount = hallmarkDiscount)
      );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.PRODUCT_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((weight: number) => (this.productWeight = weight));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.COIN_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((weight: number) => (this.coinWeight = weight));

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.ERROR_IN_PRICE_UPDATE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isError: boolean) => {
        this.isErrorinPriceUpdate = isError;
      });

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

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

  convert() {
    this.events.emit({
      eventType: SummaryBarEventType.CONVERT
    });
  }

  delete() {
    this.events.emit({
      eventType: SummaryBarEventType.DELETE
    });
  }

  trimRemarks() {
    this.remarksFormControl.setValue(
      this.remarksFormControl.value.replace(/\s+/g, ' ')
    );
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case buttonFocusKey: {
        if (this.clearButtonRef) {
          this.clearButtonRef?.nativeElement?.focus();
        }
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
