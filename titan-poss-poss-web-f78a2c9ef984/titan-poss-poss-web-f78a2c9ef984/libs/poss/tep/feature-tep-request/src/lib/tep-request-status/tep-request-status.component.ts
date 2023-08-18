import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  BillCancelStatus,
  ToolbarConfig,
  LocationSettingAttributesEnum,
  SalesMenuKeyEnum,
  CreateTepTypesEnum,
  TransactionTypeEnum,
  SubTransactionTypeEnum
} from '@poss-web/shared/models';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TEPRequestFacade } from '@poss-web/poss/tep/data-access-tep';
import { Router } from '@angular/router';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { getSalesHomePageUrl } from '@poss-web/shared/util-api-service';

import {
  getCreateTepOpenHoldUrl,
  getViewTepRequesUrl
} from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-tep-request-status',
  templateUrl: './tep-request-status.component.html'
})
export class TepRequestStatusComponent
  implements OnInit, OnDestroy, AfterViewInit {
  hasNotification = false;
  statusesList = ['APPROVED', 'PENDING', 'REJECTED'];
  typeList = [
    {
      value: 'TEP_APPROVAL_WORKFLOW',
      description: 'Regular TEP',
      isActive: true
    },
    {
      value: 'TEP_EXCEPTION_APPROVAL_WORKFLOW',
      description: 'Regular TEP Exception',
      isActive: true
    },
    {
      value: 'FULL_VALUE_TEP',
      description: 'Full Value TEP',
      isActive: true
    },
    {
      value: 'MANUAL_TEP',
      description: 'Manual TEP',
      isActive: true
    },
    {
      value: 'MANUAL_FULL_VALUE_TEP',
      description: 'Manual Full Value TEP',
      isActive: true
    }
  ];
  destroy$: Subject<null> = new Subject<null>();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  isLoading$: Observable<boolean>;
  searchFormControl = new FormControl();
  pageSize = 4;
  currencyCode: string;
  status = new FormControl('APPROVED');
  type = new FormControl('TEP_APPROVAL_WORKFLOW');
  searchValue: number;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.TEP,
    subTxnType: SubTransactionTypeEnum.NEW_TEP,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };

  count: number;
  noDataFoundMessage: string;
  requestList: BillCancelStatus[] = [];

  statusColor: string;
  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    public locationSettingsFacade: LocationSettingsFacade,
    private router: Router,
    private tepRequestFacade: TEPRequestFacade,
    private toolbarFacade: ToolbarFacade
  ) {
    this.translate
      .get(['pw.entity.tepRequestStatusEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.tepRequestStatusEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });

    if (history.state && history.state.clearFilter) {
      this.tepRequestFacade.setDropDownValue({
        status: this.status.value,
        type: this.type.value
      });
    }
  }

  getType(type) {
    switch (type) {
      case 'TEP_APPROVAL_WORKFLOW': {
        return CreateTepTypesEnum.REGULAR_TEP.toLowerCase();
      }
      case 'FULL_VALUE_TEP': {
        return CreateTepTypesEnum.FULL_VALUE_TEP.toLowerCase();
      }
      case 'TEP_EXCEPTION_APPROVAL_WORKFLOW': {
        return CreateTepTypesEnum.TEP_EXCEPTION_APPROVAL_WORKFLOW;
      }
      case 'MANUAL_TEP': {
        return CreateTepTypesEnum.MANUAL_TEP.toLowerCase();
      }
      case 'MANUAL_FULL_VALUE_TEP': {
        return CreateTepTypesEnum.MANUAL_FULL_VALUE_TEP.toLowerCase();
      }
      default: {
        return CreateTepTypesEnum.REGULAR_TEP.toLowerCase();
      }
    }
  }

  ngOnInit(): void {
    this.tepRequestFacade
      .getDropdownValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('aaa', data);
        this.status.patchValue(data.status);
        this.type.patchValue(data.type);
      });
    this.tepRequestFacade.resetValue();

    this.loadRequests(0);

    this.componentInit();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
  }

  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */

    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchFormControl.value;

        if (searchValue !== null || searchValue !== undefined) {
          this.searchValue = searchValue;
          this.tepRequestFacade.clearSearchList();
          this.loadRequests(0);
        } else if (searchValue === null || searchValue !== undefined) {
          this.clearSearch();
        }
      });
  }

  back() {
    this.router.navigate([getSalesHomePageUrl()], {
      queryParams: {
        menu: SalesMenuKeyEnum.REQUEST_APPROVALS_STATUS
      }
    });
  }

  componentInit(): void {
    this.tepRequestFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });
    this.isLoading$ = this.tepRequestFacade.getIsLoading();
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });
    this.tepRequestFacade
      .getSelectedRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.requestList = data;
      });

    this.tepRequestFacade
      .getRequestCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.count = data;
      });
  }

  loadRequests(pageIndex: number): void {
    this.tepRequestFacade.loadRequests({
      httpMethod: 'POST',
      relativeUrl: 'api/workflow/v2/workflow-process/list',
      reqBody: {
        dateRangeType: 'ALL',
        docNo: this.searchValue ? this.searchValue : null
      },
      requestParams: {
        approvalStatus: this.status.value,
        page: pageIndex,
        size: 8,
        workflowType: this.type.value
      }
    });
  }

  onSelected(value) {
    this.router.navigate([
      getViewTepRequesUrl(
        value.headerData.data.salesTxnId,
        value.processId,
        this.getType(this.type.value)
      )
    ]);
  }

  createTepHome() {
    this.router.navigate([getCreateTepOpenHoldUrl()]);
  }

  loadmore(pageIndex: number): void {
    this.tepRequestFacade.loadRequests({
      httpMethod: 'POST',
      relativeUrl: 'api/workflow/v2/workflow-process/list',
      reqBody: {
        dateRangeType: 'ALL',
        docNo: this.searchValue ? this.searchValue : null
      },
      requestParams: {
        approvalStatus: this.status.value,
        page: pageIndex,
        size: 4,
        workflowType: this.type.value
      }
    });
  }
  onSelectionStatusChange(event) {
    this.tepRequestFacade.setDropDownValue({
      status: this.status.value,
      type: this.type.value
    });
    this.tepRequestFacade.clearSearchList();

    this.loadRequests(0);
  }

  clearSearch() {
    this.searchFormControl.reset();
    this.searchValue = null;
    this.loadRequests(0);
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
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
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  ngOnDestroy(): void {
    this.tepRequestFacade.clearSearchList();
    this.destroy$.next();
    this.destroy$.complete();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
