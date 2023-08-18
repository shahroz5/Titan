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
  TepTypesEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import {
  SummaryBarEventRef,
  SummaryBarEventType
} from '@poss-web/shared/models';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { GiftCardsFacade } from '@poss-web/poss/gift-cards/data-access-gift-cards';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import { SummaryBarBase } from '../summary-bar.service';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-summary-bar-cut-piece-tep',
  templateUrl: './summary-bar-cut-piece-tep.component.html',
  styleUrls: ['./summary-bar-cut-piece-tep.component.scss']
})
export class SummaryBarCutPieceTepComponent implements OnInit, OnDestroy {
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
  totalValue$: Observable<number>;
  totalGrossWt$: Observable<number>;
  totalExchangeAmt$: Observable<number>;
  destroy$: Subject<null> = new Subject<null>();
  permissions$: Observable<any[]>;

  TEP_CONFIRM_SUBMENU = 'Customer Transaction Status-TEP Confirm Submenu';

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    public data: {
      type: TepTypesEnum;
      remarks: Observable<string>;
    },
    public currencySymbolService: CurrencySymbolService,
    private customerFacade: CustomerFacade,
    private paymentFacade: PaymentFacade,
    private commonFacade: CommonFacade,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    private locationSettingsFacade: LocationSettingsFacade,
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

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
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
    // this.totalQty$ = this.commonFacade.getCutPieceTepTotalQty();
    // this.totalValue$ = this.commonFacade.getCutPieceTepTotalValue();
    this.totalQty$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.TEP,
      CommomStateAttributeNameEnum.CUT_PIECE_TEP_TOTAL_QUANTITY
    );
    this.totalValue$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.TEP,
      CommomStateAttributeNameEnum.CUT_PIECE_TEP_TOTAL_VALUE
    );
    this.selectedCustomer$ = this.customerFacade.getSelectSelectedCustomer();
    // this.tepFacade
    //   .getRemarks()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((remarks: string) => {
    //     console.log('REMARKS :', remarks);
    //     this.remarksFormControl.setValue(remarks);
    //     this.remarksFormControl.updateValueAndValidity();
    //   });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  clearData() {
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

  onConfirmClicked() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CONFRIM,
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
