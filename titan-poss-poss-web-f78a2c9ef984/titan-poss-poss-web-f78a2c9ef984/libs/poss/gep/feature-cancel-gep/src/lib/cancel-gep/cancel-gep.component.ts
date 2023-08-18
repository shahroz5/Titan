import { PrintingService } from '@poss-web/shared/printing/feature-printing';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { combineLatest, Observable, Subject } from 'rxjs';
import { GepFacade } from '@poss-web/poss/gep/data-access-gep';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  EventEmitter,
  Output
} from '@angular/core';
import { takeUntil, take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import {
  OverlayNotificationServiceAbstraction,
  SummaryBarServiceAbstraction,
  GEPProductDetails,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  SummaryBarEventRef,
  SummaryBarEventType,
  CustomErrors,
  SummaryBarType,
  ToolbarConfig,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  printTypesEnum,
  printDocTypeEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  SetTotalProductValuesPayload,
  StatusTypesEnum,
  InvoiceDeliveryTypes
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import * as moment from 'moment';
import { SearchCancelGepPopupComponent } from '@poss-web/poss/gep/ui-cancel-gep';
import { MatDialog } from '@angular/material/dialog';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
@Component({
  selector: 'poss-web-cancel-gep',
  templateUrl: './cancel-gep.component.html',
  styleUrls: []
})
export class CancelGepComponent implements OnInit, OnDestroy {
  pageIndex = 0;
  pageSize: number;
  rso: any;
  cancelGep$: Subject<any> = new Subject<any>();
  count$: Observable<number>;
  cancelCount$: Subject<any> = new Subject<any>();
  paginate$: Subject<any> = new Subject<any>();
  minPageSize$: Subject<any> = new Subject<any>();
  pageSizeOptions$: Subject<any> = new Subject<any>();
  size$: Subject<any> = new Subject<any>();
  destroy$: Subject<null> = new Subject<null>();
  pageSizeOptions: number[];
  minPageSize: any;
  txnId: any = null;
  isLoading$: Observable<boolean>;
  productGrid: GEPProductDetails[];
  customerId: string;
  hasNotification: boolean;
  dateFormat: string;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  dialogRef: any;
  @Output() componentEmit = new EventEmitter<any>();

  srcDocNo: any;
  rsoName: any;
  reason: any;
  headerDetails: any;
  exchangeDetails: any;
  formDetails: {
    customerMobileNo: any;
    docDate: any;
    refDocNo: any;
    fiscalYear: any;
  };
  customerMobileNo: any;
  docDate: any;
  refDocNo: any;
  fiscalYear: any;

  paginate: boolean;
  isRsoValid: boolean;
  isReasonValid: boolean;
  subTxnType: any;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.CANCEL_GEP,
    subTxnType: SubTransactionTypeEnum.CANCEL_GEP,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  summaryBarRemarks$ = new Subject<string>();
  printErrorText: string;
  cnNo: any;
  cancelId: any;
  totalValue: number;
  totalTax: number;
  totalWt: number;
  currentFiscalYear: string;

  constructor(
    private facade: GepFacade,
    public dialog: MatDialog,
    private appSettingFacade: AppsettingFacade,
    private router: Router,
    private regularFacade: ProductFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private toolbarFacade: ToolbarFacade,
    private customerFacade: CustomerFacade,
    private printingService: PrintingService,
    private commonFacade: CommonFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodeodFacade: SharedBodEodFacade
  ) {
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
  }

  ngOnInit(): void {
    this.commonFacade.setFileUploadVisible(false);
    this.overlayNotification.close();
    this.bodeodFacade.loadLatestBusinessDay();
    this.summaryBar.close();
    this.facade.resetGep();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.facade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });
    this.isLoading$ = this.facade.getIsLoaded();
    this.componentInit();
    this.regularFacade.loadRSODetails('RSO');
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
        this.size$.next(this.pageSize);
      });
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) this.currentFiscalYear = fiscalYear.toString();
      });
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.pageSizeOptions$.next(data);

        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
        this.minPageSize$.next(this.minPageSize);
      });

    // this.facade.loadCancelGep({
    //   page: this.pageIndex,
    //   size: this.pageSize
    // });
  }

  printError() {
    this.overlayNotification

      .show({
        type: OverlayNotificationType.TIMER,

        message: this.printErrorText,

        hasClose: false
      })

      .events.pipe(takeUntil(this.destroy$))

      .subscribe((event: OverlayNotificationEventRef) => {
        this.showConfirmIssueSuccessNotification(this.srcDocNo); //call your respective success overlay method
      });
  }
  componentInit() {
    this.printingService

      .getPrintError()

      .pipe(takeUntil(this.destroy$))

      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    combineLatest([
      this.facade.getCancelCount().pipe(takeUntil(this.destroy$)),
      this.facade.getCancelGep().pipe(takeUntil(this.destroy$))
    ]).subscribe(([data, data1]) => {
      if (!this.txnId && data > 0 && data1.length > 0) {
        console.log('popup', data, data1);
        this.cancelCount$.next(data);
        this.cancelGep$.next(data1);
        console.log('abc');
      }
    });

    combineLatest([
      this.facade.getTotalValue().pipe(takeUntil(this.destroy$)),
      this.facade.getTotalTax().pipe(takeUntil(this.destroy$)),
      this.facade.getTotalWeight().pipe(takeUntil(this.destroy$)),
      this.facade.getTotalqty().pipe(takeUntil(this.destroy$))
    ]).subscribe(([val, val1, val2, val3]) => {
      const totalValues: SetTotalProductValuesPayload = {
        productQty: val3,
        productWeight: val2,
        productDisc: 0,
        productAmt: 0,
        taxAmt: val1,
        totalAmt: val,
        coinQty: 0,
        coinWeight: 0,
        coinDisc: 0,
        coinAmt: 0,
        finalAmt: val,
        hallmarkCharges: 0,
        hallmarkDiscount: 0
      };
      // this.commonFacade.setTotalProductValues(totalValues);
      // this.cashMemoFacade.setTotalProductValues(totalValues);
      // this.commonFacade.setTotalProductValues(totalValues);
      this.commonFacade.setGEPTotalProductValues(totalValues);
    });

    this.regularFacade
      .getRSODetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.rso = data.map(rso => ({
            value: rso.code,

            description: rso.name
          }));
        }
      });
    this.facade
      .getgepProductDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data);
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
        }
        if (this.customerId === null && this.txnId) {
          this.customerFacade.clearCustomerSearch();

          this.customerId = null;
          this.txnId = null;
          this.facade.resetGep();
          this.summaryBar.close();
          this.overlayNotification.close();
        }
      });

    this.facade
      .getSaveCancel()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event !== null) {
          this.srcDocNo = event.docNo;
          this.cnNo = event.cndocNos;
          this.cancelId = event.id;
          this.showConfirmIssueSuccessNotification(event.docNo);
        }
        // window.location.reload();
      });

    this.facade
      .getGepDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.txnId) {
            this.customerId = data.customerId;

            // this.commonFacade.setOrderNumber({
            // this.cashMemoFacade.setOrderNumber({
            // this.commonFacade.setOrderNumber({
            //   orderNo: data.docNo,
            //   status: StatusTypesEnum.CANCEL
            // });
            this.commonFacade.setGEPOrderNumber({
              orderNo: data.docNo,
              status: StatusTypesEnum.CANCEL
            });
            this.headerDetails = {
              docNo: data.docNo,
              cnDocNo: data.cnDocNo,
              employeeCode: data.employeeCode,
              docDate: moment(data.docDate).format('MMM Do,YYYY')
            };
            this.exchangeDetails = {
              type: data.exchangeDetails.type,
              data: data.exchangeDetails.data,
            }
            this.customerFacade.loadSelectedCustomer(
              data.customerId,
              false,
              false
            );

            data.itemIdList.forEach(element => {
              console.log(element, 'itemId');
              this.facade.loadGepItem({
                id: data.id,
                itemId: element,

                subTxnType: this.subTxnType
              });
            });
          }
        }
      });
  }

  componentEmits(event) {
    this.commonFacade.setComponentInstance(event);
    // this.cashMemoFacade.setComponentInstance(event);
  }

  print() {
    this.printingService.loadPrintData({
      printType: printTypesEnum.GEP_CANCEL_PRINTS,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      customerId: this.customerId,
      transacionId: this.txnId,
      reprint: false,
      invoiceType: InvoiceDeliveryTypes.PRINT
    });
  }

  emitRso(event) {
    this.rsoName = event;
    this.facade.saveRso(event);
  }

  emitReason(event) {
    this.reason = event;
    this.facade.saveReason(event);
  }
  showConfirmIssueSuccessNotification(srcDocNo: number): void {
    const key = 'pw.stockIssueNotificationMessages.confirmSuccessMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMessage + srcDocNo,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.facade.resetGep();
              this.customerId = null;
              // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
              // this.cashMemoFacade.setOrderNumber({ orderNo: 0, status: null });

              // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
              this.commonFacade.setGEPOrderNumber({ orderNo: 0, status: null });
              this.txnId = null;
              this.isRsoValid = true;
              this.isReasonValid = true;
              this.customerFacade.clearCustomerSearch();
              this.overlayNotification.close();
              this.summaryBar.close();
            }
          });
      });
  }

  showSummaryBar() {
    // if(!this.totalTax){
    //   this.facade.getGepResponse().pipe(
    //     takeUntil(this.destroy$)
    //   ).subscribe((event: any) => {
    //       console.log(event)

    //       this.totalTax=event.totalTax;
    //     })

    // }
    this.summaryBar
      .open(SummaryBarType.GEP, {
        type: 'CANCEL_GEP',
        remarks: this.summaryBarRemarks$.asObservable()
      })

      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            // this.clear
            this.customerFacade.clearCustomerSearch();
            this.facade.resetGep();
            this.summaryBar.close();
            this.overlayNotification.close();
            // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
            // this.cashMemoFacade.setOrderNumber({ orderNo: 0, status: null });
            // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
            this.commonFacade.setGEPOrderNumber({ orderNo: 0, status: null });
            this.customerId = null;
            this.txnId = null;

            break;
          }
          case SummaryBarEventType.CANCELWITHCN: {
            // this.commonFacade.confrimCashMemo();
            // combineLatest(
            //   this.facade.getGepDetails().pipe(takeUntil(this.destroy$)),

            // ).subscribe(data => {
            //   this.totalTax = data.totalTax,
            //   this.totalValue = data.totalValue,
            //   this.totalQty = data.totalQuantity,
            //   this.totalWt = data.totalWeight
            //   this.componentInit();
            // });
            this.rsoName = this.headerDetails?.employeeCode;
            if (!this.rsoName) {
              this.isRsoValid = false;
            }
            if (!this.reason) {
              this.isReasonValid = false;
            }
            if (!event.remarks) {
              this.errorNotifications('Please enter remarks.');
            }
            if (this.rsoName && this.reason && event.remarks)
              this.facade.saveCancelGep({
                data: {
                  cancelType: 'CANCEL_WITH_CN',
                  employeeCode: this.rsoName,
                  reasonForCancellation: this.reason,
                  refTxnId: this.txnId,
                  remarks: event.remarks ? event.remarks : null
                },

                subTxnType: 'GEP'
              });

            break;
          }
          case SummaryBarEventType.PRINT: {
            this.print();
            break;
          }
        }
      });
  }

  loadCancelGep(event) {
    console.log(event);
    this.customerMobileNo = event.customerMobileNo;
    this.docDate = event.docDate;
    this.refDocNo = event.refDocNo;
    this.fiscalYear = event.fiscalYear;

    this.facade.loadCancelGep({
      page: 0,
      size: this.pageSize,
      customerMobileNo: event.customerMobileNo,
      docDate: event.docDate,
      refDocNo: event.refDocNo,
      fiscalYear: event.fiscalYear
    });
    this.formDetails = {
      customerMobileNo: event.customerMobileNo,
      docDate: event.docDate,
      refDocNo: event.refDocNo,
      fiscalYear: event.fiscalYear
    };

    this.SearchCancelGepPopupComponent();
  }
  errorNotifications(errorKey) {
    const key = errorKey;
    // this.translate
    //   .get(key)
    //   .pipe(take(1))
    //   .subscribe((translatedMessage: string) => {
    //     // this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: key,
        hasClose: true,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
    // });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    }
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
    console.log(event);

    this.facade.loadCancelGep({
      page: event.page,
      size: event.size,
      customerMobileNo: this.customerMobileNo,
      docDate: this.docDate,
      refDocNo: this.refDocNo,
      fiscalYear: this.fiscalYear
    });
  }
  SearchCancelGepPopupComponent(): void {
    this.cancelGep$.next([]);
    this.cancelCount$.next(0);

    this.dialogRef = this.dialog.open(SearchCancelGepPopupComponent, {
      width: '700px',

      data: {
        gep: this.cancelGep$.asObservable(),
        count: this.cancelCount$.asObservable(),
        dateFormat: this.dateFormat
      }
    });

    // return {
    //   close: dialogRef.afterClosed(),
    //   load: dialogRef.componentInstance.load.asObservable()
    // };

    this.dialogRef.componentInstance.load
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result?.page !== undefined) {
          this.onPaginate(result);
        }
      });

    this.dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) this.onRoute(result);
      });
  }

  onRoute(event) {
    // this.router.navigate(['sales/gep/cancel', event]);

    console.log(event, 'after popup effect');
    this.txnId = event.refTxnId;
    this.subTxnType = event.subTxnType;

    if (this.txnId) {
      this.facade.loadGep({
        id: this.txnId,
        subTxnType: this.subTxnType
      });
      this.showSummaryBar();
    }
  }
  ngOnDestroy(): void {
    this.txnId = null;

    this.customerId = null;
    this.rsoName = null;
    this.reason = null;
    this.facade.resetGep();
    this.summaryBar.close();
    this.overlayNotification.close();
    this.customerFacade.clearCustomerSearch();
    this.destroy$.next();
    this.destroy$.complete();
    this.summaryBarRemarks$.next('');
    this.printingService.resetPrint();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
