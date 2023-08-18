import { getApprovalsHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Event } from '@angular/router';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  ApprovalsMenuKeyEnum,
  SaveRoRequestApproval,
  RoRequestApprovalListResponse,
  roRequestEnum
} from '@poss-web/shared/models';
import { OverlayNotificationType } from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take, debounceTime, filter } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { RoRequestApprovalFacade } from '@poss-web/shared/ro-request-approvals/data-access-ro-request-approvals';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-ro-request-approvals',
  templateUrl: './ro-request-approvals.component.html',
  styleUrls: []
})
export class RoRequestApprovalsComponent implements OnInit, OnDestroy {
  currentDate = moment();
  filterForm = new FormGroup({});
  isApproved: boolean;
  fiscalYear: string;
  pageIndex = 0;
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  pendingRequests: any;
  disableButton = true;
  currentFiscalYear: string;
  rejectedRequests$: Observable<RoRequestApprovalListResponse[]>;
  approvedRequests$: Observable<RoRequestApprovalListResponse[]>;
  closedRequests$: Observable<RoRequestApprovalListResponse[]>;
  type: string;
  dateFormat: string;
  isLoggedIn: boolean;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[];
  initialPageSize: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private roRequestApprovalFacade: RoRequestApprovalFacade,
    private authFacade: AuthFacade,
    private bodeodFacade: SharedBodEodFacade
  ) {}

  ngOnInit() {
    this.bodeodFacade.loadLatestBusinessDay();
    this.roRequestApprovalFacade.loadReset();
    this.translate
      .get(['pw.roRequestApproval.fiscalYear'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.fiscalYear = translatedMessages['pw.roRequestApproval.fiscalYear'];
      });
    this.filterForm = new FormGroup({
      searchFormControl: new FormControl(),
      fromDate: new FormControl(this.currentDate),
      toDate: new FormControl(this.currentDate),
      fiscalYear: new FormControl('', []),
      historyType: new FormControl('Approved')
    });
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear?.toString();
        }
      });
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.initialPageSize = pageSize;
      });

    this.router.events
      .pipe(
        filter(
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.type = this.activatedRoute.snapshot.params['type'];
      });

    this.isLoading$ = this.roRequestApprovalFacade.getIsloading();
    this.roRequestApprovalFacade
      .getPendingRoRequestList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pendingRequests = [];
        const newArray = [];
        for (const request of data) {
          newArray.push({
            approvedBy: request.approvedBy,
            approvedDate: request.approvedDate,
            remarks: request.remarks,
            docDate: request.docDate,
            reqNo: request.reqNo,
            fiscalYear: request.fiscalYear,
            amount: request.amount,
            customerName: request.customerName,
            customerTitle: request.customerTitle,
            customerMobileNumber: request.customerMobileNumber,
            cashierId: request.cashierId,
            customerId: request.customerId,
            locationCode: request.locationCode,
            processId: request.processId,
            cashierName: request.cashierName,
            requestedDate: request.requestedDate,
            requestTime: moment(request.requestedDate).format('hh:mm A'),
            requestorReason: request.requestorReason,
            taskId: request.taskId,
            taskName: request.taskName,
            workflowType: request.workflowType
          });
        }
        this.pendingRequests = newArray;
      });
    this.rejectedRequests$ = this.roRequestApprovalFacade.getRejectedRoRequestList();
    this.closedRequests$ = this.roRequestApprovalFacade.getClosedRoRequestList();
    this.approvedRequests$ = this.roRequestApprovalFacade.getApprovedRoRequestList();
    this.roRequestApprovalFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.roRequestApprovalFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true && this.isApproved) {
          this.showSuccessMessageNotification(
            'pw.roRequestApproval.approveSuccessMsg'
          );
        } else if (hasUpdated === true && !this.isApproved) {
          this.showSuccessMessageNotification(
            'pw.roRequestApproval.rejectSuccessMsg'
          );
        }
      });

    this.type = this.activatedRoute.snapshot.params['type'];
    this.loadBasedOnType();

    this.filterForm
      .get('toDate')
      .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(data => {
        if (
          data &&
          this.filterForm.get('fromDate').value &&
          this.filterForm.get('fromDate').value !== ''
        ) {
          this.loadBasedOnType();
        }
      });

    this.filterForm
      .get('fiscalYear')
      .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        this.initialPageEvent = {
          pageIndex: 0,
          pageSize: this.initialPageSize,
          length: 0
        };
        this.loadBasedOnType();
      });
    this.filterForm
      .get('searchFormControl')
      .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        this.initialPageEvent = {
          pageIndex: 0,
          pageSize: this.initialPageSize,
          length: 0
        };
        this.loadBasedOnType();
      });
    this.filterForm
      .get('historyType')
      .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        this.initialPageEvent = {
          pageIndex: 0,
          pageSize: this.initialPageSize,
          length: 0
        };
        this.loadBasedOnType();
      });
  }

  loadFilterData(approvalStatus) {
    if (approvalStatus === roRequestEnum.pending) {
      this.roRequestApprovalFacade.loadPendingRoRequestList({
        approvalStatus: approvalStatus,
        pageIndex: this.initialPageEvent.pageIndex,
        pageSize: this.initialPageEvent.pageSize,
        filterOptions: {
          dateRangeType: roRequestEnum.custom,
          filterParams: {
            locationCode: this.filterForm.get('searchFormControl').value
              ? this.filterForm.get('searchFormControl').value
              : undefined
          },
          startDate: this.filterForm
            .get('fromDate')
            .value?.startOf('day')
            .valueOf(),
          endDate: this.filterForm.get('toDate').value?.endOf('day').valueOf(),
          fiscalYear: this.filterForm.get('fiscalYear').value
        },
        workflowType: roRequestEnum.workflowType
      });
    } else if (approvalStatus === roRequestEnum.rejected) {
      this.roRequestApprovalFacade.loadRejectedRoRequestList({
        approvalStatus: approvalStatus,
        workflowType: roRequestEnum.workflowType,
        pageIndex: this.initialPageEvent.pageIndex,
        pageSize: this.initialPageEvent.pageSize,
        filterOptions: {
          filterParams: {
            locationCode: this.filterForm.get('searchFormControl').value
              ? this.filterForm.get('searchFormControl').value
              : undefined
          },
          dateRangeType: roRequestEnum.custom,

          startDate: this.filterForm
            .get('fromDate')
            .value.startOf('day')
            .valueOf(),
          endDate: this.filterForm.get('toDate').value.endOf('day').valueOf(),
          fiscalYear: this.filterForm.get('fiscalYear').value
        }
      });
    } else if (approvalStatus === roRequestEnum.closed) {
      this.roRequestApprovalFacade.loadClosedRoRequestList({
        approvalStatus: approvalStatus,
        workflowType: roRequestEnum.workflowType,
        pageIndex: this.initialPageEvent.pageIndex,
        pageSize: this.initialPageEvent.pageSize,
        filterOptions: {
          filterParams: {
            locationCode: this.filterForm.get('searchFormControl').value
              ? this.filterForm.get('searchFormControl').value
              : undefined
          },
          dateRangeType: roRequestEnum.custom,

          startDate: this.filterForm
            .get('fromDate')
            .value.startOf('day')
            .valueOf(),
          endDate: this.filterForm.get('toDate').value.endOf('day').valueOf(),
          fiscalYear: this.filterForm.get('fiscalYear').value
        }
      });
    } else if (approvalStatus === roRequestEnum.approved) {
      this.roRequestApprovalFacade.loadApprovedRoRequestList({
        approvalStatus: approvalStatus,
        workflowType: roRequestEnum.workflowType,
        pageIndex: this.initialPageEvent.pageIndex,
        pageSize: this.initialPageEvent.pageSize,
        filterOptions: {
          filterParams: {
            locationCode: this.filterForm.get('searchFormControl').value
              ? this.filterForm.get('searchFormControl').value
              : undefined
          },
          dateRangeType: roRequestEnum.custom,

          startDate: this.filterForm
            .get('fromDate')
            .value.startOf('day')
            .valueOf(),
          endDate: this.filterForm.get('toDate').value.endOf('day').valueOf(),
          fiscalYear: this.filterForm.get('fiscalYear').value
        }
      });
    }
  }
  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: {
        menu: ApprovalsMenuKeyEnum.PAYMENT_MENU_KEY
      }
    });
    this.roRequestApprovalFacade.loadReset();
  }

  clearSearch() {
    this.filterForm.get('searchFormControl').reset();
    this.loadBasedOnType();
  }
  validateSearch(searchValue: string): boolean {
    return fieldValidation.locationCodeField.pattern.test(searchValue);
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(take(1))
      .subscribe(() => {
        // Action based event
      });
  }
  save(saveRoRequestApproval: SaveRoRequestApproval) {
    this.isApproved =
      saveRoRequestApproval.bulkApproverRequestObjectDto[0].approved;
    this.roRequestApprovalFacade.saveRoRequestStatus(saveRoRequestApproval);
  }
  changeTab(type) {
    this.initialPageEvent = {
      pageIndex: 0,
      pageSize: this.initialPageSize,
      length: 0
    };
    this.disableButton = true;
    this.roRequestApprovalFacade.loadReset();
    this.pendingRequests = [];

    this.filterForm.get('searchFormControl').reset();
    this.router.navigate(['..', type], {
      relativeTo: this.activatedRoute
    });
    this.loadBasedOnType();
  }
  loadBasedOnType() {
    if (this.type === roRequestEnum.list) {
      this.loadFilterData(roRequestEnum.pending);
    } else if (this.type === roRequestEnum.history) {
      if (
        this.filterForm.get('historyType').value === roRequestEnum.historyType
      ) {
        this.loadFilterData(roRequestEnum.approved);
      } else if (
        this.filterForm.get('historyType').value === roRequestEnum.closed
      ) {
        this.loadFilterData(roRequestEnum.closed);
      } else {
        this.loadFilterData(roRequestEnum.rejected);
      }
    }
  }
  paginate(event) {
    this.initialPageEvent = event;
    this.loadBasedOnType();
  }
  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

            hasBackdrop: true
          })
          .events.subscribe();
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
