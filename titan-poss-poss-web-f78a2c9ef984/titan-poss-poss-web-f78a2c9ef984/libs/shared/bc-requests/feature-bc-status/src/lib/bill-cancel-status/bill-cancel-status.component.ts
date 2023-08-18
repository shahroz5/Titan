import { Subject, Observable, fromEvent } from 'rxjs';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import {
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  BillCancelStatus
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { FormControl } from '@angular/forms';

import * as moment from 'moment';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

import { BillCancellationRequestsFacade } from '@poss-web/shared/bc-requests/data-access-bc';
import {
  BcCmRouteTypesEnum,
  getBillCancellationRequestDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';

@Component({
  selector: 'poss-web-bill-cancel-status',
  templateUrl: './bill-cancel-status.component.html',
  styleUrls: ['./bill-cancel-status.component.scss']
})
export class BillCancelStatusComponent
  implements OnInit, OnDestroy, AfterViewInit {
  pageSize = 4;

  initalPageSize = 4;

  statusesList = ['APPROVED', 'PENDING', 'REJECTED'];
  isHistoryLoadedOnce = false;

  hasNotification = false;
  destroy$: Subject<null> = new Subject<null>();

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  isLoading$: Observable<boolean>;
  searchFormControl = new FormControl();
  statuses = new FormControl('APPROVED');
  searchValue: number;

  currentDate = moment();
  count: number;
  billCancelList: BillCancelStatus[];

  status: string;
  statusColor: string;
  noDataFoundMessage: string;

  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private commonFacade: CommonFacade,
    private facade: BillCancellationRequestsFacade
  ) {
    if (
      this.router['lastSuccessfulNavigation'] &&
      this.router['lastSuccessfulNavigation']['extras']['state'] &&
      this.router['lastSuccessfulNavigation']['extras']['state'][
        'clearFilter'
      ] === false
    ) {
    } else {
      this.facade.resetFilter();
    }

    this.translate
      .get(['pw.entity.requestEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.requestEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessages: any) => {
            this.noDataFoundMessage =
              translatedMessages['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit(): void {
    // this.commonFacade.clearTransactionConfig();
    // this.commonFacade.clearTransactionTD();
    this.commonFacade.clearTransactionConfig();
    this.commonFacade.clearTransactionTD();
    this.facade.resetList();
    this.loadRequests(0);
    this.componentInit();
  }

  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */

    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const historySearchValue = this.searchFormControl.value;
        // this.facade.resetHistory();
        if (historySearchValue !== null || historySearchValue !== undefined) {
          this.searchValue = historySearchValue;
          this.isHistoryLoadedOnce = false;
          this.facade.resetList();
          this.loadRequests(0);
        } else if (
          historySearchValue === null ||
          historySearchValue !== undefined
        ) {
          // this.clearSearch();
        }
      });
  }

  /**
   * to load and get data
   */
  componentInit(): void {
    this.facade
      .hasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });
    this.isLoading$ = this.facade.getisLoading();
    this.facade
      .getBillsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data);
        this.count = data;
      });
    this.facade
      .getbillCancellationRequestStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data, 'fhj');
        if (data) {
          this.billCancelList = data;
          this.isHistoryLoadedOnce = true;
        }
      });
  }

  loadRequests(pageIndex: number): void {
    console.log('inside load');
    this.facade
      .getHistoryFilterData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterData: string) => {
        console.log(filterData);
        this.statuses.patchValue(filterData, { emitEvent: true });
      });
    this.facade.loadBillCancellationStatus({
      httpMethod: 'POST',
      relativeUrl: 'api/workflow/v2/workflow-process/list',
      reqBody: {
        dateRangeType: 'ALL',
        docNo: this.searchValue ? this.searchValue : null
      },
      requestParams: {
        approvalStatus: this.statuses.value,
        page: pageIndex,
        size: !this.isHistoryLoadedOnce ? this.initalPageSize : this.pageSize,
        workflowType: 'BILL_CANCELLATION'
      }
    });
  }

  onSelectionChange(event) {
    console.log(event);
    this.isHistoryLoadedOnce = false;
    this.facade.resetList();
    this.facade.loadHistoryFilterData(event.value);
    this.loadRequests(0);
  }
  onSelected(event) {
    this.facade.loadSelectedData(event);
    // this.commonFacade.setTransactionConfig({
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: false,
      transactionType: {
        type: event.headerData.data.refTxnType,
        subType: event.headerData.data.refSubTxnType
      }
    });
    // this.commonFacade.setTransactionTD(event.headerData.data.refTxnId);
    this.commonFacade.setTransactionTD(event.headerData.data.refTxnId);

    console.log(
      'sales/bill-Cancellation/request-status/',
      event.docNo,
      event.headerData.data.refSubTxnType.toLowerCase(),
      event.headerData.data.refTxnId
    );
    this.router.navigate([
      getBillCancellationRequestDetailsRouteUrl(
        Object.keys(BcCmRouteTypesEnum).filter(
          key => BcCmRouteTypesEnum[key] === event.headerData.data.refSubTxnType
        )[0],
        event.headerData.data.refTxnId,
        event.processId
      )
    ]);
    // this.router.navigate([
    //   'sales/bill-cancellation/request-status/' + event.docNo
    // ]);
  }
  clearSearch() {
    this.searchFormControl.reset();

    // this.facade.resetHistory();
    this.searchValue = null;

    this.isHistoryLoadedOnce = false;
    this.loadRequests(0);
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        // Action based event
      });
  }

  getStatus(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.status;
  }
  getStatusColor(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
