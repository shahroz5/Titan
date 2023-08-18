import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  CustomErrors,
  BillCancellation
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { BillCancellationRequestsFacade } from '@poss-web/shared/bc-requests/data-access-bc';
@Component({
  selector: 'poss-web-bill-cancellation-requests',
  templateUrl: './bill-cancellation-requests.component.html',
  styleUrls: []
})
export class BillCancellationRequestsComponent implements OnInit, OnDestroy {
  pageIndex = 0;
  pageSize: number;
  count$: number;
  billCancel$: Observable<any>;
  locations: any;
  destroy$: Subject<null> = new Subject<null>();
  pageSizeOptions: number[];
  minPageSize: any;
  txnId = null;
  isLoading$: Observable<boolean>;
  productGrid: BillCancellation[];
  customerId: string;
  hasNotification: boolean;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;

  @Output() customerDetails = new EventEmitter<any>();
  srcDocNo: any;
  status: any;
  reason: any;
  headerDetails: any;
  approve: any;
  dateRangeType = 'CUSTOM';
  currentDate = moment();
  minDate = moment('00010101');
  constructor(
    private facade: BillCancellationRequestsFacade,
    private appSettingFacade: AppsettingFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,

    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private customerFacade: CustomerFacade
  ) {}

  ngOnInit(): void {
    this.overlayNotification.close();

    this.facade.reset();

    this.facade
      .hasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });
    this.isLoading$ = this.facade.getisLoading();
    this.componentInit();

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;

        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
        console.log(this.minPageSize);
      });
    this.facade.loadLocations();
    this.defaultLoadData();
  }

  defaultLoadData() {
    this.facade.loadBillCancellationRequests({
      page: this.pageIndex,
      size: this.pageSize,
      approvalStatus: 'PENDING',
      body: {
        dateRangeType: this.dateRangeType,
        endDate: moment(this.currentDate).valueOf(),
        startDate: moment(this.minDate).valueOf()
      },
      workflowType: 'BILL_CANCELLATION'
    });
  }

  componentInit() {
    this.facade
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.locations = data;
        }
      });
    this.facade
      .getbillCancelCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data, 'count');
        if (data) {
          this.count$ = data;
        }
      });
    this.facade
      .getbillCancellationRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data, 'grid');
        if (data) {
          this.productGrid = data;

          //temporaray fix for tax
          // this.facade.loadGep()
        }
      });
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.customerId = data.customerId;
        } else {
          this.customerId = null;
          this.customerDetails.emit(null);
        }
        if (this.customerId === null && this.txnId) {
          this.customerFacade.clearCustomerSearch();

          this.customerId = null;
          this.txnId = null;
          this.facade.reset();
          this.customerDetails.emit(null);
          this.overlayNotification.close();
        }
      });

    this.facade
      .getbillCancellationDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event !== null) {
          this.status = event.taskStatus;
          this.showConfirmIssueSuccessNotification(this.srcDocNo, this.status);
        }
        // window.location.reload();
      });
  }

  componentEmits(event) {
    if (event === 'cancel') {
      this.txnId = null;
      this.customerId = null;
      this.facade.reset();
      this.customerDetails.emit(null);
      this.defaultLoadData();
    } else this.facade.approveBillCancellationRequests(event);
  }

  showConfirmIssueSuccessNotification(srcDocNo: number, status: string): void {
    const key = 'pw.stockIssueNotificationMessages.confirmSuccessMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: 'Process ID' + srcDocNo + 'has been' + status,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.facade.reset();
              this.customerId = null;

              this.txnId = null;
              this.customerDetails.emit(null);
              this.customerFacade.clearCustomerSearch();
              this.overlayNotification.close();
              this.defaultLoadData();
            }
          });
      });
  }

  loadBillCancellationRequests(event) {
    console.log(event);

    this.facade.loadBillCancellationRequests({
      page: this.pageIndex,
      size: this.pageSize,
      approvalStatus: 'PENDING',
      body: {
        docNo: event.no?.docNo,
        filterParams: event.filterParams.valid,
        dateRangeType: this.dateRangeType,
        endDate: moment(this.currentDate).valueOf(),
        startDate: moment(this.minDate).valueOf()
      },
      workflowType: 'BILL_CANCELLATION'
    });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onPaginate(event) {
    this.facade.loadBillCancellationRequests({
      page: event.page,
      size: event.size,

      approvalStatus: 'PENDING',
      body: {
        docNo: event.no?.docNo,
        filterParams: event.filterParams.valid,
        dateRangeType: this.dateRangeType,
        endDate: moment(this.currentDate).valueOf(),
        startDate: moment(this.minDate).valueOf()
      },
      workflowType: 'BILL_CANCELLATION'
    });
  }
  onRoute(event: BillCancellation) {
    //this.router.navigate(['sales/gep/cancel', event]);
    console.log(event);
    this.customerDetails.emit(event);
    this.txnId = event;
    this.customerId = event.headerData.data.customerId;
    this.srcDocNo = event.docNo;
    if (this.txnId) {
      this.headerDetails = event;
    }
  }
  ngOnDestroy(): void {
    this.txnId = null;

    this.customerId = null;
    this.customerDetails.emit(null);
    this.facade.reset();

    this.overlayNotification.close();
    this.customerFacade.clearCustomerSearch();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
