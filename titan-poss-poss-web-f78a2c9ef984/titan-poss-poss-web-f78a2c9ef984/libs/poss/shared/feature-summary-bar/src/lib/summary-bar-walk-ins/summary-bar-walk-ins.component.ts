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
  SummaryBarEventRef,
  SummaryBarEventType
} from '@poss-web/shared/models';
// import { SUMMARY_BAR_TYPE } from '../summary-bar.token';
import { SUMMARY_BAR_DATA } from '../summary-bar.token';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

@Component({
  selector: 'poss-web-summary-bar-walk-ins',
  templateUrl: './summary-bar-walk-ins.component.html',
  styleUrls: ['./summary-bar-walk-ins.component.scss']
})
export class SummaryBarWalkInsComponent implements OnInit, OnDestroy {
  events = new EventEmitter<SummaryBarEventRef>();
  currencyCode = '';
  totalConversions$: Observable<number>;
  totalWalkIns$: Observable<number>;
  disableSaveButton = false;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    @Inject(SUMMARY_BAR_DATA) public type: string,
    public translate: TranslateService,
    private commonFacade: CommonFacade
  ) {}

  ngOnInit(): void {
    // this.totalConversions$ = this.commonFacade.getWalkInsConversionCount();
    // this.totalWalkIns$ = this.commonFacade.getWalkInsCount();
    this.totalConversions$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.WALKINS,
      CommomStateAttributeNameEnum.WALKINS_CONVERSION_COUNT
    );
    this.totalWalkIns$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.WALKINS,
      CommomStateAttributeNameEnum.WALKINS_COUNT
    );
    // this.walkInsRecordFacade.getWalksInCount().subscribe(() => {});
    // this.commonFacade
    //   .getIsWalkInsFormInvalid()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.WALKINS,
        CommomStateAttributeNameEnum.IS_WALKINS_FORM_INVALID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormInvalid: boolean) => {
        this.disableSaveButton = isFormInvalid;
      });
  }

  cancelData() {
    this.events.emit({
      eventType: SummaryBarEventType.CANCEL
    });
  }

  saveWalkInDetails() {
    this.events.emit({
      eventType: SummaryBarEventType.SAVE
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
