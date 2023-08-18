import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Inject
} from '@angular/core';
import { SummaryBarBase } from '../summary-bar.service';
import {
  SummaryBarEventRef,
  CustomerInfo,
  SummaryBarEventType,
  GrnEnums,
  LocationSettingAttributesEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';
import { TranslateService } from '@ngx-translate/core';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';

import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';

import { takeUntil } from 'rxjs/operators';
import { GrnFacade } from '@poss-web/poss/grn/data-access-grn';

import { CommonFacade } from '@poss-web/shared/common/data-access-common';

@Component({
  selector: 'poss-web-summary-bar-grn',
  templateUrl: './summary-bar-grn.component.html',
  styleUrls: ['./summary-bar-grn.component.scss']
})
export class SummaryBarGrnComponent
  implements OnInit, OnDestroy, SummaryBarBase {
  events = new EventEmitter<SummaryBarEventRef>();

  status: string;
  currencyCode: string;
  totalReturnProducts = 0;
  totalReturnGrn: any;
  remarksFormControl: FormControl;

  destroy$: Subject<null> = new Subject<null>();
  remarksLabel = '';
  grnEnums = GrnEnums;
  type: string;
  approvalGrn: boolean;
  totaltcsCollected: number;
  constructor(
    @Inject(SUMMARY_BAR_DATA)
    public data: {
      remarks: Observable<string>,
      productDetails: any
     },
    public translate: TranslateService,
    public currencySymbolService: CurrencySymbolService,
    private fieldValidatorsService: FieldValidatorsService,
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

  ngOnInit(): void {
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
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
      });

    // this.commonFacade
    //   .getGrnStatus()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(status => {
    //     if (status) {
    //       this.status = status;
    //     }
    //   });

    // this.commonFacade
    //   .getTotalGrnValue()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(totalReturnGrn => {
    //     if (totalReturnGrn) {
    //       this.totalReturnGrn = totalReturnGrn;
    //     }
    //   });

    // this.commonFacade
    //   .getTotalGrnProducts()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(totalReturnProducts => {
    //     if (totalReturnProducts) {
    //       this.totalReturnProducts = totalReturnProducts;
    //     }
    //   });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRN,
        CommomStateAttributeNameEnum.GRN_STATUS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        if (status) {
          this.status = status;
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRN,
        CommomStateAttributeNameEnum.TOTAL_RETURN_GRN
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalReturnGrn => {
        // if (totalReturnGrn) {
        this.totalReturnGrn = Math.round(totalReturnGrn);
        // }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRN,
        CommomStateAttributeNameEnum.TOTAL_RETURN_PRODUCTS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalReturnProducts => {
        // if (totalReturnProducts) {
        this.totalReturnProducts = totalReturnProducts;
        // }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRN,
        CommomStateAttributeNameEnum.GRN_WORKFLOW_FLAG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((approvalGrn: boolean) => {
          this.approvalGrn = approvalGrn
      });
  }

  clearData() {
    this.events.emit({
      eventType: SummaryBarEventType.CLAER
    });
    this.remarksFormControl.reset();
  }

  confirmGrn() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CONFRIM_GRN,
        remarks: this.remarksFormControl.value
      });
    } else {
      this.remarksFormControl.markAsTouched();
    }
  }
  confirmNewGrn() {
    if (this.remarksFormControl.valid) {
      this.events.emit({
        eventType: SummaryBarEventType.CONFRIM_GRN,
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

  print() {
    this.events.emit({
      eventType: SummaryBarEventType.PRINT
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
