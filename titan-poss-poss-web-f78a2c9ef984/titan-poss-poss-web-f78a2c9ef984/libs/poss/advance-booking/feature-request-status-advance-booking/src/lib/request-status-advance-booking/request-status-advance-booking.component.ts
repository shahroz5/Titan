import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdvanceBookingFacade } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import {
  BillCancelStatus,
  BodEodStatusEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RequestDropdownvalues,
  RequestStatusDownValues,
  SalesMenuKeyEnum
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  getAdvanceBookingNewUrl,
  getHomePageUrl,
  getSalesHomePageUrl,
  getViewAdvanceBookingRequestStaustUrl
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-request-status-advance-booking',
  templateUrl: './request-status-advance-booking.component.html'
})
export class RequestStatusAdvanceBookingComponent
  implements OnInit, OnDestroy, AfterViewInit {
  pageSize = 4;

  initalPageSize = 8;

  isHistoryLoadedOnce = false;
  dropDownEnum = RequestDropdownvalues;
  dropDownvalues: RequestStatusDownValues[] = [
    {
      value: 'CANCEL_ADVANCE_BOOKING',
      description: 'Cancellation',
      isActive: true
    },
    {
      value: 'ACTIVATE_ADVANCE_BOOKING',
      description: 'Activation',
      isActive: true
    },

    {
      value: 'ADVANCE_BOOKING_MANUAL_BILL',
      description: 'Manual AB',
      isActive: true
    }
  ];
  hasNotification = false;
  statusesList = [
    {
      value: 'APPROVED',
      description: 'APPROVED',
      isActive: true
    },
    {
      value: 'PENDING',
      description: 'PENDING',
      isActive: true
    },
    {
      value: 'REJECTED',
      description: 'REJECTED',
      isActive: true
    }
  ];
  isLoggedIn: boolean;

  destroy$: Subject<null> = new Subject<null>();

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  isLoading$: Observable<boolean>;
  searchFormControl = new FormControl();
  status = new FormControl('CANCEL_ADVANCE_BOOKING');
  types = new FormControl('APPROVED');
  searchValue: number;

  currentDate = moment();
  count: number;
  billCancelList: BillCancelStatus[];
  noDataFoundMessage: string;
  statusColor: string;
  bodEodStatus: string;
  isGoldRateAvailable: boolean;
  permissions$: Observable<any[]>;

  AB_ADD_EDIT_SUBMENU = 'Customer Transaction Status-AB Add/Edit Submenu';
  AB_REQUEST_VIEW_MANUAL_BILL_SUBMENU =
    'Customer Transaction Status-AB Request/View Manual Bill Submenu';
  AB_REQUEST_VIEW_CANCELLATION_BILL_SUBMENU =
    'Customer Transaction Status-AB Request/View Cancellation Bill Submenu';
  AB_REQUEST_VIEW_ACTIVATION_BILL_SUBMENU =
    'Customer Transaction Status-AB Request/View Activation Bill Submenu';

  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private fieldValidatorsService: FieldValidatorsService,
    private advanceBookingFacade: AdvanceBookingFacade,
    private sharedBodEodFacade: SharedBodEodFacade,
    private authFacade: AuthFacade,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.searchFormControl = new FormControl(
      '',
      this.fieldValidatorsService.requestNumberField('Req. Number')
    );
    this.translate
      .get(['pw.entity.advanceBookingRequestStatusEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.advanceBookingRequestStatusEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });

    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.clearFilter === false
    ) {
    } else {
      this.advanceBookingFacade.setDropDownValue({
        status: this.types.value,
        type: this.status.value
      });
    }
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.advanceBookingFacade
      .getDropdownValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.types.patchValue(data.status);
        this.status.patchValue(data.type);
      });
    this.advanceBookingFacade.resetValues();
    this.advanceBookingFacade.loadSelectedData(null);
    this.loadRequests(0);
    this.componentInit();

    this.sharedBodEodFacade
      .getBodEodStatus()
      .pipe(
        filter(BodEodStatus => !!BodEodStatus),
        takeUntil(this.destroy$)
      )
      .subscribe(bodEodStatus => {
        this.bodEodStatus = bodEodStatus;
      });

    this.sharedBodEodFacade
      .getGoldRateAvailablityStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(goldRateAvailable => {
        this.isGoldRateAvailable = goldRateAvailable;
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngAfterViewInit(): void {
    /**
     * Event Handler for search Box input with debounce
     */

    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchFormControl.value;

        if (
          this.searchFormControl.valid &&
          (searchValue !== null || searchValue !== undefined)
        ) {
          this.searchValue = searchValue;
          this.advanceBookingFacade.clearSearchList();
          this.loadRequests(0);
        } else if (searchValue === null || searchValue !== undefined) {
        }
      });
  }

  /**
   * to load and get data
   */
  componentInit(): void {
    this.advanceBookingFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });
    this.isLoading$ = this.advanceBookingFacade.getIsLoading();

    this.advanceBookingFacade
      .getSelectedRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.billCancelList = data;
      });

    this.advanceBookingFacade
      .getRequestCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.count = data;
      });
  }

  back() {
    const url = this.isGoldRateAvailable
      ? getSalesHomePageUrl()
      : getHomePageUrl();

    if (this.bodEodStatus === BodEodStatusEnum.OPEN) {
      this.router.navigate([url], {
        queryParams: {
          menu: SalesMenuKeyEnum.REQUEST_APPROVALS_STATUS
        }
      });
    } else {
      this.router.navigate([getHomePageUrl()]);
    }
  }

  possNewABUrl() {
    this.router.navigate([getAdvanceBookingNewUrl()]);
  }
  loadRequests(pageIndex: number): void {
    this.advanceBookingFacade.loadRequests({
      httpMethod: 'POST',
      relativeUrl: 'api/workflow/v2/workflow-process/list',
      reqBody: {
        dateRangeType: 'ALL',
        docNo: this.searchValue ? this.searchValue : null
      },
      requestParams: {
        approvalStatus: this.types.value,
        page: pageIndex,
        size: 8,
        workflowType: this.status.value
      }
    });
    this.isHistoryLoadedOnce = true;
  }

  loadmore(pageIndex: number): void {
    this.advanceBookingFacade.loadRequests({
      httpMethod: 'POST',
      relativeUrl: 'api/workflow/v2/workflow-process/list',
      reqBody: {
        dateRangeType: 'ALL',
        docNo: this.searchValue ? this.searchValue : null
      },
      requestParams: {
        approvalStatus: this.types.value,
        page: pageIndex,
        size: 4,
        workflowType: this.status.value
      }
    });
    this.isHistoryLoadedOnce = true;
  }

  onSelectionTypeChange(event) {
    this.advanceBookingFacade.setDropDownValue({
      status: this.types.value,
      type: this.status.value
    });
    this.advanceBookingFacade.clearSearchList();
    this.advanceBookingFacade.loadRequests({
      httpMethod: 'POST',
      relativeUrl: 'api/workflow/v2/workflow-process/list',
      reqBody: {
        dateRangeType: 'ALL',
        docNo: this.searchValue ? this.searchValue : null
      },
      requestParams: {
        approvalStatus: this.types.value,
        page: 0,
        size: 8,
        workflowType: event.value
      }
    });
  }

  onSelectionStatusChange(event) {
    this.advanceBookingFacade.setDropDownValue({
      status: this.types.value,
      type: this.status.value
    });

    this.advanceBookingFacade.clearSearchList();
    this.advanceBookingFacade.loadRequests({
      httpMethod: 'POST',
      relativeUrl: 'api/workflow/v2/workflow-process/list',
      reqBody: {
        dateRangeType: 'ALL',
        docNo: this.searchValue ? this.searchValue : null
      },
      requestParams: {
        approvalStatus: this.types.value,
        page: 0,
        size: 8,
        workflowType: this.status.value
      }
    });
  }
  onSelected(event) {
    let subTxnType = 'new-ab';
    if (event.headerData?.data?.subTxnType !== 'NEW_AB') {
      subTxnType = 'manual-ab';
    }

    if (this.status.value === 'CANCEL_ADVANCE_BOOKING') {
      this.router.navigate(
        [
          getViewAdvanceBookingRequestStaustUrl(
            event.headerData?.data?.id,
            'cancel',
            subTxnType,
            event.processId
          )
        ],
        { state: { subTxnType: event.subTxnType } }
      );
    } else if (this.status.value === 'ACTIVATE_ADVANCE_BOOKING') {
      this.router.navigate(
        [
          getViewAdvanceBookingRequestStaustUrl(
            event.headerData?.data?.id,
            'activate',
            subTxnType,
            event.processId
          )
        ],
        { state: { subTxnType: event.subTxnType } }
      );
    } else {
      this.router.navigate([
        getViewAdvanceBookingRequestStaustUrl(
          event.headerData?.data?.id,
          'regularize',
          subTxnType,
          event.processId
        )
      ]);
    }
  }
  clearSearch() {
    this.searchFormControl.reset();

    this.searchValue = null;

    this.isHistoryLoadedOnce = false;
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
      .subscribe(() => {});
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
