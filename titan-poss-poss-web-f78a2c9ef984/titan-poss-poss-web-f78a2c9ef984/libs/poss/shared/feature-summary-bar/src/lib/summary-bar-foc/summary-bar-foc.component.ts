import {
  Component,
  OnInit,
  EventEmitter,
  OnDestroy,
  Inject
} from '@angular/core';
import {
  SummaryBarEventType,
  SummaryBarEventRef,
  LocationSettingAttributesEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum
} from '@poss-web/shared/models';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SummaryBarBase } from '../summary-bar.service';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

@Component({
  selector: 'poss-web-summary-bar-foc',
  templateUrl: './summary-bar-foc.component.html',
  styleUrls: ['./summary-bar-foc.component.scss']
})
export class SummaryBarFocComponent
  implements OnInit, OnDestroy, SummaryBarBase {
  events = new EventEmitter<SummaryBarEventRef>();
  destroy$: Subject<null> = new Subject<null>();
  focItemsCount = 0;
  totalEligibleFocQty = 0;
  totalEligibleFocWt = 0;
  weightUnit: string;
  constructor(
    // private focFacade: FocFacade,
    private commonFacade: CommonFacade,
    private locationSettingsFacade: LocationSettingsFacade
  ) {}

  ngOnInit() {
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_WEIGHT_UNIT)
      .pipe(takeUntil(this.destroy$))
      .subscribe(weightUnit => {
        this.weightUnit = weightUnit;
      });

    // this.commonFacade
    //   .getFocItemsCount()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(data => {
    //     this.focItemsCount = data;
    //   });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.FOC,
        CommomStateAttributeNameEnum.FOC_ELIGIBLE_WT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.totalEligibleFocWt = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.FOC,
        CommomStateAttributeNameEnum.FOC_ELIGIBLE_QTY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.totalEligibleFocQty = data;
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.FOC,
        CommomStateAttributeNameEnum.FOC_ITEMS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.focItemsCount = 0;
        data.forEach(element => {
          this.focItemsCount = this.focItemsCount + element.quantity;
        });
      });
  }

  clear() {
    this.totalEligibleFocWt = 0;
    this.events.emit({
      eventType: SummaryBarEventType.CLAER
    });
  }

  confirm() {
    this.events.emit({
      eventType: SummaryBarEventType.CONFRIM
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
