import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import {
  SummaryBarType,
  SummaryBarServiceAbstraction,
  SummaryBarEventRef,
  GrnReqDetails,
  SummaryBarEventType,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  GrnEnums,
  CustomErrors,
  LocationSettingAttributesEnum,
  printTypesEnum,
  printDocTypeEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  PrintingServiceAbstraction,
  InvoiceDeliveryTypes,
  PostTransactionConfirmationActionsServiceAbstraction,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  RsoDetailsPayload,
  TransactionTypeEnum,
  FileTypeEnum
} from '@poss-web/shared/models';
import { GrnFacade } from '@poss-web/poss/grn/data-access-grn';

import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { ActivatedRoute, Router } from '@angular/router';

import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';

import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
// import { PrintingService } from '@poss-web/shared/printing/feature-printing';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getGrnStatusUrl } from '@poss-web/shared/util-site-routes';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';

const RSOCode = 'RSO';

@Component({
  selector: 'poss-web-view-grn',
  templateUrl: './view-grn.component.html',
  styleUrls: ['./view-grn.component.scss']
})
export class ViewGrnComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  columnDefs = [];
  weightCode = 'gms';
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  RSONameHeaderText: string;
  headerDetails;
  weightCodeForGm = 'gm';
  getRowHeight = 50;
  summaryBarRemarks$ = new Subject<string>();

  currencyCode: string;
  grnId: string;
  isProcessId: boolean;
  grnDetails: GrnReqDetails;
  isLegacy = false;
  isGRN = true;
  grnRemarks: string;
  txnType: string;
  subTxnType: string;
  customerId: string;
  isLoading$: Observable<boolean>;
  isCommonLoading$: Observable<boolean>;
  boutiqueName: string;
  grnEnums = GrnEnums;
  docNo;
  pgDesc$: Observable<{}>;
  imageUrlData$: Subject<any> = new Subject<any>();
  productDetails$: Subject<any> = new Subject<any>();
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  cnDocNo: any;
  cnAmt: any;
  amtMsg: string;
  txnId: string;
  printErrorText: string;
  cnMessage: string;
  response: any;
  confirmId: any;
  tcsCollectedAmount = 0;
  tcsCnAmt: any;
  focDeductionValue: number;
  rsoDetails$: Observable<RsoDetailsPayload[]>;
  tcsCnDocNo: any;
  isWorkflowRequired;
  defaultImageUrl = 'assets/img/product-default-image.svg';
  filesList: any;
  fileUploadLabel: string;
  fileType = 'OTHERS';
  docType = TransactionTypeEnum.GRN;
  statusColor: string;
  creditNoteType: string;

  constructor(
    private translate: TranslateService,
    private summaryBar: SummaryBarServiceAbstraction,
    private customerFacade: CustomerFacade,
    private grnFacade: GrnFacade,
    private activatedRoute: ActivatedRoute,
    private commonFacade: CommonFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade,
    private router: Router,
    private locationDataService: LocationDataService,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private alertPopUpService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode,
    private printingService: PrintingServiceAbstraction,
    private productFacade: ProductFacade,
    private fileFacade: FileFacade,
    private dialog: MatDialog,

  ) {}

  ngOnInit(): void {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRN,
        CommomStateAttributeNameEnum.GRN_WORKFLOW_FLAG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isWorkflowRequired: boolean) => {
          this.isWorkflowRequired = isWorkflowRequired
      });
    this.productDetails$.next([]);
    this.grnFacade.loadReset();
    this.commonFacade.setGrnTotalProducts(0);
    this.commonFacade.setGrnTotalValue(0);
    this.commonFacade.setGrnStatus(null);
    this.focDeductionValue = 0
    this.grnFacade.setFocDeduction(this.focDeductionValue);
    this.grnId = this.activatedRoute.snapshot.params['_grnId'];
    this.isLoading$ = this.grnFacade.getIsloading();

    this.translate
      .get([
        'pw.otherReceiptsIssues.printError',
        'pw.grn.amtMsg',
        'pw.grn.grnFileUploadedLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
        this.amtMsg = translatedMessages['pw.grn.amtMsg'];
        this.fileUploadLabel =
          translatedMessages['pw.grn.grnFileUploadedLabel'];
      });
    this.grnFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.grnFacade
      .getFocDeductionAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(focDeductionAmount => {
        if (focDeductionAmount) {
          this.focDeductionValue = focDeductionAmount;
        }
      });
    // this.commonFacade.loadPgDesc();
    this.commonFacade.loadGRNPgDesc();
    this.productFacade.loadRSODetails(RSOCode);
    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.GRN,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );
    // this.commonFacade
    //   .getImageUrl()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRN,
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
        CommomStateAttributeTypeEnum.GRN,
        CommomStateAttributeNameEnum.LOADING
      );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRN,
        CommomStateAttributeNameEnum.CREDIT_NOTE_TYPE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((creditNoteType: string) => {
          this.creditNoteType = creditNoteType;
      });
    this.grnFacade.loadGrnDetails(this.grnId, this.creditNoteType);
    this.grnFacade
      .getGrnDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.grnDetails = data;
          if(data?.txnSource === 'LEGACY'){
            this.isLegacy = true;
          }
          if(this.grnDetails.processId === ''){
            this.isProcessId = false;
          } else{
            this.isProcessId = true;
          }
          //this.grnFacade.loadTcsCollectedAmount(data.cashmemoId);
          this.tcsCollectedAmount = this.grnDetails.tcsAmountCollected;
          if(this.grnDetails.approvalStatus !== ''){
            this.commonFacade.setGrnStatus(this.grnDetails.approvalStatus);
          } else{
            this.commonFacade.setGrnStatus(this.grnDetails.status);
          }
          this.commonFacade.setGrnTotalProducts(
            Number(this.grnDetails.totalReturnProduct)
          );

          if(!this.isWorkflowRequired){
            this.commonFacade.setGrnTotalValue(
              Number(this.grnDetails.totalReturnGrn + this.grnDetails.tcsAmountCollected)
            );
          } else{
            this.commonFacade.setGrnTotalValue(
              Number(this.grnDetails.totalReturnGrn)
            );
          }
          this.focDeductionValue = this.grnDetails.focRecoveredValue;
          this.grnFacade.setFocDeduction(this.focDeductionValue);

          console.log(
            'itemIds',
            this.grnDetails.productDetails.map(item => item.id)
          );
          // if(this.isWorkflowRequired){
          //   const selectedItems = []
          //   this.grnDetails.productDetails.forEach(item => {
          //     if(item.id){
          //       selectedItems.push({
          //         itemId : item.id,
          //         totalQuantity : item.totalQuantity
          //       });
          //     }
          //   });
          //   this.grnFacade.loadGrnFinalPriceDetails({
          //     data: {
          //       refTxnId: this.grnDetails.cashmemoId,
          //       items: selectedItems
          //     },
          //     txnType: this.txnType,
          //     subTxnType: this.subTxnType
          //   });
          // }

          this.productDetails$.next(
            this.grnDetails.productDetails ? this.grnDetails.productDetails : []
          );
          this.customerId = data.customerId;
          this.txnType = data.txnType;

          this.subTxnType = data.subTxnType;
          if (this.grnDetails.approvalStatus !== this.grnEnums.REJECTED) {
            this.showSummaryBar();
          }
          this.locationDataService
            .getLocationSummaryByLocationCode(this.grnDetails.boutiqueCode)
            .pipe(takeUntil(this.destroy$))
            .subscribe(location => {
              this.boutiqueName = location.description;
            });
          this.customerFacade.loadSelectedCustomer(
            String(this.customerId),
            false,
            false
          );
          if(this.isProcessId){
            this.fileFacade.loadDocumentsList({
              customerId: null,
              docType: this.docType,
              fileType: this.fileType,
              id: this.grnDetails.cashmemoId
            });
          }
        } else {
          this.productDetails$.next([]);
        }
      });

    this.rsoDetails$ = this.productFacade.getRSODetails();
    this.grnFacade
      .getGrnConfirmResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          console.log(data, 'getGrnConfirmResponse');
          this.confirmId = data.id;
          console.log(this.confirmId, 'this.confirmId1');
          this.response = {
            docNo: data.docNo,
            cnDocNo: Object.keys(data.cndocNos).map(k => data.cndocNos[k]),
            cnAmount: data.cnAmt,
            tcsCnAmount: data.tcsCnAmt
          };

          this.showSuccessMessageNotification(this.response);
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((currencyCode: string) => {
        this.currencyCode = currencyCode;
      });

    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.printingService
      .getIsMailSent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMailSent: boolean) => {
        if (isMailSent) {
          this.showAlertPopUp('pw.regularCashMemo.mailSentMsg');
        }
      });

    this.printingService
      .getIsPrintingSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPrintingSuccess: boolean) => {
        if (isPrintingSuccess) {
          this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
        }
      });

    this.fileFacade
      .getDocumentsLst()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docs => {
        if (docs) {
          this.filesList = docs;
        }
      });

    this.fileFacade
      .getDocumentUrlById()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docUrl => {
        if (docUrl) {
          this.showPopup(docUrl);
        }
      });

    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  loadImageUrl(event: string) {
    // this.commonFacade.loadImageUrl(event);
    this.commonFacade.loadGRNImageUrl(event);
  }

  loadFileImageUrl(fileData) {
    let extn = fileData.name.split('.').pop();
    extn = extn.toLowerCase();
    if (extn === FileTypeEnum.PDF) this.fileFacade.downloadPdfFile(fileData);
    else extn === FileTypeEnum.JPG || extn === FileTypeEnum.JPEG;
    this.fileFacade.loadDocumentUrlById(fileData.id);
  }

  showPopup(image): void {
    this.dialog.open(FilePreviewComponent, {
      height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl,
        imageUrl: image,
        previewHeader: this.fileUploadLabel
      }
    });
  }

  confirmGrn() {
    this.grnFacade.confirmGrn({
      grnId: this.grnId,
      txnType: this.txnType,
      subTxnType: this.subTxnType,
      data: { customerId: this.customerId, remarks: this.grnRemarks }
    });
  }

  print() {
    console.log(this.confirmId, 'this.confirmId');

    this.postConfirmationActions
      .open()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          let action = '';
          switch (res) {
            case 'print': {
              action = InvoiceDeliveryTypes.PRINT;
              break;
            }
            case 'mail': {
              action = InvoiceDeliveryTypes.MAIL;
              break;
            }
            case 'both': {
              action = InvoiceDeliveryTypes.BOTH;
              break;
            }
          }
          this.printingService.loadPrintData({
            printType: printTypesEnum.GRN,
            transacionId: this.grnId,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            reprint: true,
            customerId: this.customerId,
            invoiceType: action
          });
        }
      });
  }

  showAlertPopUp(message: string) {
    this.alertPopUpService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
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
        this.showSuccessMessageNotification(this.response);
      });
  }

  showSuccessMessageNotification(response) {
    this.docNo = response?.docNo;
    this.cnDocNo = response?.cnDocNo;
    this.cnAmt = response?.cnAmount;
    this.tcsCnAmt = response?.tcsCnAmt;
    this.tcsCnDocNo = response?.tcsCnDocNo;
    const key = 'pw.grn.grnConfirmMesg';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            // message: translatedMsg + ' ' + documentNumber,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.router.navigate([getGrnStatusUrl()]);
            }
          });
      });
  }
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else {
      this.overlayNotification.show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      });
    }
  }
  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.GRN)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CONFRIM_GRN: {
            this.grnRemarks = event.remarks;
            this.confirmGrn();
            break;
          }
          case SummaryBarEventType.PRINT: {
            this.print();
            break;
          }
        }
      });
  }

  getRequestStatusColor(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    else{
      key = commonTranslateKeyMap.get("CANCELLED")
    }
    this.translate
      .get([key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.fileFacade.clearResponse();
    this.summaryBar.close();
    this.printingService.resetPrint();
  }
}
