import {
  Component,
  OnInit,
  EventEmitter,
  OnDestroy,
  Inject
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CustomerInfo,
  GoldRateFreezeEnumTypes,
  LocationSettingAttributesEnum,
  StatusTypesEnum,
  ValidationTypesEnum
} from '@poss-web/shared/models';
import {
  SummaryBarEventRef,
  SummaryBarEventType
} from '@poss-web/shared/models';
// import { CtGrfFacade } from '@poss-web/poss/grf/data-access-grf';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import { FormControl } from '@angular/forms';
import { SummaryBarBase } from '../summary-bar.service';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-summary-bar-grf',
  templateUrl: './summary-bar-grf.component.html',
  styleUrls: ['./summary-bar-grf.component.scss']
})
export class GrfSummaryBarComponent
  implements OnInit, OnDestroy, SummaryBarBase {
  events = new EventEmitter<SummaryBarEventRef>();
  currencyCode: string;
  weightUnit: string;
  remarksFormControl: FormControl;
  totalAmt = 0;
  // selectedRso$: Observable<{ value: string; description: string }>;
  totalPaidAmt = 0;
  goldWeight: number;
  destroy$: Subject<null> = new Subject<null>();
  remarksLabel = '';
  goldRateFreezeEnumTypes = GoldRateFreezeEnumTypes;
  statusTypesEnum = StatusTypesEnum;
  validationTypesEnumRef = ValidationTypesEnum;
  permissions$: Observable<any[]>;

  GRF_CONFIRM_SUBMENU = 'Customer Transaction Status-GRF Confirm Submenu';

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    public data: {
      status?: string;
      actionType?: ValidationTypesEnum;
      type: GoldRateFreezeEnumTypes;
      remarks: Observable<string>;
    },
    public translate: TranslateService,
    public currencySymbolService: CurrencySymbolService,
    private paymentFacade: PaymentFacade,
    private commonFacade: CommonFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private locationSettingsFacade: LocationSettingsFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService // private ctGrfFacade: CtGrfFacade
  ) {
    this.translate
      .get(['pw.summaryBar.remarksLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.remarksLabel = translatedMessages['pw.summaryBar.remarksLabel'];
      });
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
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
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_WEIGHT_UNIT)
      .pipe(takeUntil(this.destroy$))
      .subscribe(weightUnit => {
        this.weightUnit = weightUnit;
      });

    // this.cardsTotalQty$ = this.giftCardsFacade.getTotalCardsQty();
    // this.selectedRso$ = this.ctGrfFacade.getSelectedRsoName();
    // this.commonFacade
    //   .getTransactionTotalAmount()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_TOTAL_AMOUNT
      )

      .pipe(takeUntil(this.destroy$))
      .subscribe(amount => {
        this.totalAmt = amount;
      });
    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(amount => {
        this.totalPaidAmt = amount;
      });

    // this.commonFacade
    //   .getGrfGoldWeight()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRF,
        CommomStateAttributeNameEnum.GRF_GOLD_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((goldWeight: number) => {
        console.log('GOLD WEIGHT IN SUMMARY BAR :', goldWeight);
        this.goldWeight = goldWeight;
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  clearData() {
    this.events.emit({
      eventType: SummaryBarEventType.CLAER
    });
    this.remarksFormControl.reset();
  }

  createGrf() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CREATEGRF,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  regularizeBill() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.REGULARIZE_GRF,
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

  printGrfItem() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT,
      remarks: this.remarksFormControl.value
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
