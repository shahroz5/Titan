import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  Component,
  OnInit,
  EventEmitter,
  Inject,
  OnDestroy
} from '@angular/core';
import {
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  LocationSettingAttributesEnum,
  SummaryBarEventRef,
  SummaryBarEventType
} from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SummaryBarBase } from '../summary-bar.service';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-summary-bar-gep',
  templateUrl: './summary-bar-gep.component.html',
  styleUrls: ['./summary-bar-gep.component.scss']
})
export class SummaryBarGepComponent
  implements OnInit, OnDestroy, SummaryBarBase {
  events = new EventEmitter<SummaryBarEventRef>();
  remarksFormControl: FormControl;
  cardsTotalWeight = 0;
  cardsTotalQty = 0;
  cardTotalValue = 0;
  selectedRso$: Observable<any>;

  destroy$: Subject<null> = new Subject<null>();
  customerId = null;
  employeecode = null;

  reason = null;
  remarksLabel = '';
  currencyCode: string;
  weightUnit: string;
  permissions$: Observable<any[]>;

  GEP_CONFIRM_SUBMENU = 'Customer Transaction Status-GEP Confirm Submenu';

  constructor(
    @Inject(SUMMARY_BAR_DATA)
    public data: {
      status: string;
      type: string;
      remarks: Observable<string>;
    },
    private fieldValidatorsService: FieldValidatorsService,
    public translate: TranslateService,
    public locationSettingsFacade: LocationSettingsFacade,
    private commonFacade: CommonFacade,
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
    this.remarksFormControl = new FormControl(null, [
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
        CommomStateAttributeTypeEnum.GEP,
        CommomStateAttributeNameEnum.TOTAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.cardTotalValue = Math.round(data);
        } else this.cardTotalValue = 0;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GEP,
        CommomStateAttributeNameEnum.TOTAL_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) this.cardsTotalWeight = Number(Number(data).toFixed(3));
        else this.cardsTotalWeight = 0;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GEP,
        CommomStateAttributeNameEnum.TOTAL_QUANTITY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) this.cardsTotalQty = data;
        else this.cardsTotalQty = 0;
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  clearGcData() {
    this.remarksFormControl.reset();
    this.events.emit({
      eventType: SummaryBarEventType.CLAER
    });
  }

  confirmAndPrint() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CONFRIM,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.events.emit({
        eventType: SummaryBarEventType.CONFRIM,
        remarks: null
      });
    }
  }

  print() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT
    });
  }

  cancel() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CANCELWITHCN,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }

  hold() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.HOLD,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.events.emit({
        eventType: SummaryBarEventType.HOLD,
        remarks: null
      });
    }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
