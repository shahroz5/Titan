import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { takeUntil, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CustomErrors,
  FileUploadLists,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RequestStatusTypesEnum,
  RsoDetailsPayload,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  WorkflowTypeABEnum,
  WorkflowTypeEnum
} from '@poss-web/shared/models';
import { getApprovalsManualAdvanceBookingRequetsUrl } from '@poss-web/shared/util-site-routes';

import { CommonFacade } from '@poss-web/shared/common/data-access-common';

import { TranslateService } from '@ngx-translate/core';

import { AbManualRequestFacade } from '@poss-web/eposs/ab-manual-requests/data-access-ab-manual-requests';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';

const approvalUrl = 'approvals';
const RSOCode = 'RSO';

@Component({
  selector: 'poss-web-ab-manual-request-details',
  templateUrl: './ab-manual-request-details.component.html',
  styleUrls: []
})
export class AbManualRequestDetailsComponent implements OnInit, OnDestroy {
  isCorpUser = true;
  destroy$: Subject<null> = new Subject<null>();
  cmRequestDetails$: Observable<any>;
  cmRequestDetails: any;
  cmCustomerDetails$: Observable<any>;
  cmHeaderDetails$: Observable<any>;
  productDetails$: Observable<any>;
  isLoading$: Observable<boolean>;
  taskId: string;
  processId: string;
  id: string;
  txnType: string;
  paidValue = 0;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  docNo: number;
  pgDesc$: Observable<{}>;
  imageUrlData$: Subject<any> = new Subject<any>();
  imageUrl: string;
  rsoDetails$: Observable<RsoDetailsPayload[]>;
  isCommonLoading$: Observable<boolean>;

  constructor(
    private requestFacade: AbManualRequestFacade,
    private paymentFacade: PaymentFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private commonFacade: CommonFacade,
    private translate: TranslateService,
    private productFacade: ProductFacade
  ) {
    this.requestFacade.clearAbManualRequestDetails();
    this.commonFacade.clearTransactionConfig();
    this.commonFacade.clearTransactionTD();
    this.taskId = this.activatedRoute.snapshot.params['_taskId'];
    this.processId = this.activatedRoute.snapshot.params['_processId'];

    this.commonFacade.setTransactionConfig({
      isPaymentEditable: false,
      transactionType: {
        type: TransactionTypeEnum.AB,
        subType: SubTransactionTypeEnum.MANUAL_AB
      },
      workflowData: {
        processID: this.processId,
        taskID: this.taskId,
        taskName: WorkflowTypeABEnum.REQUEST_APPROVER_L1,
        workflowType: WorkflowTypeEnum.MANUAL_AB_BILL
      }
    });
  }

  ngOnInit() {
    this.requestFacade.loadAbManualRequestDetails({
      processId: this.processId,
      taskId: this.taskId,
      taskName: WorkflowTypeABEnum.REQUEST_APPROVER_L1,
      workFlowType: WorkflowTypeABEnum.MANUAL_BILL
    });
    this.commonFacade.loadABPgDesc();
    this.componentInit();
  }

  componentInit() {
    this.isLoading$ = this.requestFacade.getIsLoading();
    this.cmRequestDetails$ = this.requestFacade.getAbManualRequestDetails();
    this.cmCustomerDetails$ = this.requestFacade.getAbManualCustomerDetails();
    this.cmHeaderDetails$ = this.requestFacade.getAbManualHeaderDetails();
    this.productDetails$ = this.requestFacade.getAbManualProductDetails();
    this.rsoDetails$ = this.productFacade.getRSODetails();
    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );
    this.requestFacade
      .getAbManualProductList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val1 => {
        if (val1) {
          val1.itemIdList.forEach(element => {
            this.requestFacade.loadAbManualProductDetails({
              id: val1.id,
              itemId: element,
              txnType: val1.txnType,
              subTxnType: val1.subTxnType
            });
          });
        }
      });

    this.requestFacade
      .getAbManualRequestDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val1 => {
        if (val1) {
          this.cmRequestDetails = val1;
          this.productFacade.loadRSODetails(
            RSOCode,
            this.cmRequestDetails?.locationCode
          );
          this.requestFacade.loadFileUploadList({
            txnType: TransactionTypeEnum.AB,
            id: this.cmRequestDetails?.headerData?.data.id,
            customerId: this.cmRequestDetails?.headerData?.data.customerId,
            locationCode: this.cmRequestDetails?.locationCode
          });

          this.commonFacade.setTransactionTotalAmount(
            val1.headerData.data.finalValue
          );
        }
      });

    this.requestFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.requestFacade
      .getAbManualApprovalRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.approvalSuccessNotifications(data);
        }
      });

    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalValue => {
        if (totalValue) {
          this.paidValue = totalValue;
        } else {
          this.paidValue = 0;
        }
      });

    this.requestFacade
      .getUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.updateCashMemoNotification(data);
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.IMAGE_URL_DATA
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        if (data !== null) {
          this.imageUrlData$.next(data);
        }
      });

    this.isCommonLoading$ = this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.LOADING
      );

    this.requestFacade
      .getFileUploadListRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FileUploadLists[]) => {
        if (data.length !== 0)
          this.requestFacade.loadFileDownloadUrl({
            id: data[data.length - 1].id,
            locationCode: this.cmRequestDetails?.locationCode
          });
      });

    this.requestFacade
      .getFileDownloadUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        this.imageUrl = data;
      });
  }

  isApprove(event: any) {
    const data = {
      isApprove: event.isApprove,
      requestBody: {
        approvedData: this.cmRequestDetails.approvedData,
        approverRemarks: event.remarks
      },
      processId: this.processId,
      taskId: this.taskId,
      taskName: WorkflowTypeABEnum.REQUEST_APPROVER_L1
    };
    this.requestFacade.loadAbManualApprovalRequest(data);
  }

  back() {
    this.router.navigate([getApprovalsManualAdvanceBookingRequetsUrl()], {
      state: { clearFilter: false }
    });
  }

  approvalSuccessNotifications(data: any) {
    let key;
    const key1 = 'pw.cmRequestApproval.approvalSucccessMsg1';
    const key2 = 'pw.cmRequestApproval.approvalSucccessMsg2';
    const key3 = 'pw.cmRequestApproval.approvalSucccessMsg3';
    const key4 = 'pw.cmRequestApproval.rejectSucccessMsg';
    if (data.taskStatus === RequestStatusTypesEnum.APPROVED) {
      key = key3;
    } else {
      key = key4;
    }

    this.translate
      .get([key1, key2, key3, key4])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            message:
              translatedMessages[key1] +
              `${this.cmRequestDetails.docNo}` +
              translatedMessages[key2] +
              `${this.cmRequestDetails.locationCode}` +
              translatedMessages[key],
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }

  errorNotifications(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  updateCashMemoNotification(data) {
    this.docNo = data.docNo;

    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.back();
        }
      });
  }

  /**
   * to display error message
   * @param error : error from api
   */
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

  loadImageUrl(event: string) {
    this.commonFacade.loadABImageUrl(event);
  }

  ngOnDestroy(): void {
    this.overlayNotification.close();

    this.destroy$.next();
    this.destroy$.complete();
    this.commonFacade.clearTransactionConfig();
  }
}
