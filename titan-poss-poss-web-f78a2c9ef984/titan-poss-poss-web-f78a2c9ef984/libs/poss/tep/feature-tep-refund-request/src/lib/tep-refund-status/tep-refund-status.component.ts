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
  ToolbarConfig,
  LocationSettingAttributesEnum,
  SalesMenuKeyEnum,
  RefundStatus,
  TransactionTypeEnum,
  SubTransactionTypeEnum
} from '@poss-web/shared/models';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { commonRefundTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TEPRequestFacade } from '@poss-web/poss/tep/data-access-tep';
import { Router } from '@angular/router';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { getSalesHomePageUrl } from '@poss-web/shared/util-api-service';

import {
  getCreateTepOpenHoldUrl,
  getViewUrl
} from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-tep-refund-status',
  templateUrl: './tep-refund-status.component.html'
})
export class TepRefundStatusComponent
  implements OnInit, OnDestroy, AfterViewInit {
  hasNotification = false;
  statusMessage = '';

  statusesList = [
    {
      value: 'APPROVAL_PENDING',
      description: 'APPROVAL PENDING',
      isActive: true
    },
    {
      value: 'PENDING_FROM_RO',
      description: 'PENDING FROM RO',
      isActive: true
    },
    {
      value: 'REFUNDED',
      description: 'REFUNDED',
      isActive: true
    },
    {
      value: 'REJECTED',
      description: 'REJECTED',
      isActive: true
    }
  ];

  refundTypeList = [
    {
      value: 'CHEQUE',
      description: 'CHEQUE',
      isActive: true
    },
    {
      value: 'RTGS',
      description: 'RTGS',
      isActive: true
    }
  ];

  typeList = [
    {
      value: 'NEW_TEP',
      description: 'Regular TEP',
      isActive: true
    },
    {
      value: 'FULL_VALUE_TEP',
      description: 'Full Value TEP',
      isActive: true
    },
    {
      value: 'INTER_BRAND_TEP',
      description: 'Interbrand TEP',
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
  @ViewChild('searchBox', {
    static: true
  })
  searchBox: ElementRef;
  isLoading$: Observable<boolean>;
  searchFormControl = new FormControl();
  pageSize = 4;
  currencyCode: string;
  status = new FormControl('APPROVAL_PENDING');
  type = new FormControl('NEW_TEP');
  refundtype = new FormControl('CHEQUE');
  searchValue: number;
  locationCode: string;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.TEP,
    subTxnType: SubTransactionTypeEnum.NEW_TEP,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };

  count: number;
  noDataFoundMessage: string;
  requestList: RefundStatus[] = [];

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

    if (history?.state && history.state?.clearFilter) {
      this.tepRequestFacade.setRefundDropDownValue({
        status: this.status.value,
        type: this.type.value,
        refundType: this.refundtype.value
      });
    }
  }

  ngOnInit(): void {
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE)
      .subscribe(data => {
        if (data) {
          this.locationCode = data;
        }
      });

    this.tepRequestFacade
      .getrefundDropdownValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.status.patchValue(data.status);
        this.type.patchValue(data.type);
        this.refundtype.patchValue(data.refundType);
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
      .getSelectedRefundRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.requestList = data;
      });

    this.tepRequestFacade
      .getRefundCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.count = data;
      });
  }

  loadRequests(pageIndex: number): void {
    this.tepRequestFacade.loadRefundRequests({
      httpMethod: 'POST',
      relativeUrl: '/sales​/v2​/refund​/list',
      reqBody: {
        dateRangeType: 'LAST_YEAR',
        docNo: this.searchValue ? this.searchValue : null,
        refundType: this.refundtype.value,
        subTxnType: this.type.value,
        status: this.status.value,
        locationCode: this.locationCode
      },
      requestParams: {
        page: pageIndex,
        size: 8,
        txntype: 'TEP'
      }
    });
  }

  onSelected(value) {
    if (value) {
      this.router.navigate([getViewUrl(value.id)]);
    }
  }

  loadmore(pageIndex: number): void {
    this.tepRequestFacade.loadRefundRequests({
      httpMethod: 'POST',
      relativeUrl: '/sales​/v2​/refund​/list',
      reqBody: {
        dateRangeType: 'LAST_YEAR',
        docNo: this.searchValue ? this.searchValue : null,
        refundType: this.refundtype.value,
        subTxnType: this.type.value,
        status: this.status.value,
        locationCode: this.locationCode
      },
      requestParams: {
        page: pageIndex,
        size: 4,
        txntype: 'TEP'
      }
    });
  }
  createTepHome() {
    this.router.navigate([getCreateTepOpenHoldUrl()]);
  }
  onSelectionStatusChange(event) {
    this.tepRequestFacade.setRefundDropDownValue({
      status: this.status.value,
      type: this.type.value,
      refundType: this.refundtype.value
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
    if (commonRefundTranslateKeyMap.has(status)) {
      key = commonRefundTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.statusMessage = translatedMessages[key.status];
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
