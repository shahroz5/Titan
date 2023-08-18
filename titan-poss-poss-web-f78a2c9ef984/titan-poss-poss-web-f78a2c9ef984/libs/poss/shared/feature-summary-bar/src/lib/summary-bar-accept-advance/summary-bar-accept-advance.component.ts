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
  CtAdvanceTabsEnum,
  CustomerInfo,
  LocationSettingAttributesEnum,
  StatusTypesEnum
} from '@poss-web/shared/models';
import {
  SummaryBarEventRef,
  SummaryBarEventType
} from '@poss-web/shared/models';
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
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-summary-bar-accept-advance',
  templateUrl: './summary-bar-accept-advance.component.html',
  styleUrls: ['./summary-bar-accept-advance.component.scss']
})
export class CtAcceptAdvanceSummaryBarComponent
  implements OnInit, OnDestroy, SummaryBarBase {
  events = new EventEmitter<SummaryBarEventRef>();
  currencyCode = '';
  remarksFormControl: FormControl;
  totalAmt = 0;
  selectedRso$: Observable<{ value: string; description: string }>;
  totalPaidAmt = 0;
  destroy$: Subject<null> = new Subject<null>();
  remarksLabel = '';
  ctAdvanceTabsEnum = CtAdvanceTabsEnum;
  statusTypesEnum = StatusTypesEnum;
  permissions$: Observable<any[]>;

  ACCEPT_ADVANCE_CONFIRM_SUBMENU =
    'Customer Transaction Status-Accept Advance Confirm Submenu';

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    public data: {
      status: StatusTypesEnum;
      type: CtAdvanceTabsEnum;
      remarks: Observable<string>;
    },
    public currencySymbolService: CurrencySymbolService,
    private paymentFacade: PaymentFacade,
    private commonFacade: CommonFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
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
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
      });
    // this.cardsTotalQty$ = this.giftCardsFacade.getTotalCardsQty();
    // this.selectedRso$ = this.ctAcceptAdvanceFacade.getSelectedRsoName();
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
    this.remarksFormControl = new FormControl('', [
      this.fieldValidatorsService.remarkField(this.remarksLabel)
    ]);

    if (this.data?.remarks) {
      this.data.remarks
        .pipe(takeUntil(this.destroy$))
        .subscribe((remarks: string) => {
          console.log('REMARKS IN ADV :', remarks);
          this.remarksFormControl.reset();
          this.remarksFormControl.setValue(remarks);
        });
    }
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  closeAdvanceData() {
    this.events.emit({
      eventType: SummaryBarEventType.CLAER
    });
    this.remarksFormControl.reset();
  }

  confirmAcceptAdvance() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CONFRIM,
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

  printAdvanceItem() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT,
      remarks: this.remarksFormControl.value
    });
  }

  delete() {
    this.events.emit({
      eventType: SummaryBarEventType.DELETE,
      remarks: this.remarksFormControl.value
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
