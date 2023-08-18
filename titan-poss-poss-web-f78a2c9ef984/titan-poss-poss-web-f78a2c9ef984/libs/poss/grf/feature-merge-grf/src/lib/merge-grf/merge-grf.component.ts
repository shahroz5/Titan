import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CtGrfFacade } from '@poss-web/poss/grf/data-access-grf';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigurationType,
  CreditNote,
  CustomErrors,
  FrozenCNs,
  LocationSettingAttributesEnum,
  MergeCNResponse,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  printDocTypeEnum,
  printFileTypeEnum,
  printTransactionTypesEnum,
  printTypesEnum,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  ToolbarConfig,
  TransactionTypeEnum,
  PostTransactionConfirmationActionsServiceAbstraction,
  InvoiceDeliveryTypes,
  PrintingServiceAbstraction,
  CustomerServiceAbstraction,
  Customers
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { MatDialog } from '@angular/material/dialog';
import { AddOtherGrfPopupComponent } from '@poss-web/poss/grf/ui-merge-grf-list';
import { TranslateService } from '@ngx-translate/core';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { getSalesHomePageUrl } from '@poss-web/shared/util-api-service';
import { Router } from '@angular/router';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';
const csvExtn = 'csv';
const reqfileKey = 'reqFile';
@Component({
  selector: 'poss-web-merge-grf',
  templateUrl: './merge-grf.component.html',
  styleUrls: []
})
export class MergeGrfComponent implements OnInit, OnDestroy {
  @ViewChild('confirmMergedCNNotificationTemplate', { static: true })
  private confirmMergedCNNotificationTemplate: TemplateRef<any>;
  destroy$: Subject<null> = new Subject<null>();
  frozenCNs: FrozenCNs[] = [];
  customerId: string;
  customer: Customers;
  customerType: any;
  grfCNs: CreditNote[] = [];
  isLoading$: Observable<boolean>;
  printIsLoading$: Observable<boolean>;
  dialogRef: any;
  isAddAnotherGRF = false;
  hasOtpValidated = false;
  token = '';
  docNo = null;
  fiscalYear = null;
  anotherCustomerGRFCNs: CreditNote = null;
  summaryBarRemarks$ = new Subject<string>();
  mergeGrfRemarks: string;
  ids: string[] = [];
  mergedCNResponse: MergeCNResponse = null;
  isMergeCNAllowed: string;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.CM,
    subTxnType: SubTransactionTypeEnum.MANUAL_CM,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  currentFiscalYear: string;
  @ViewChild('fileInput') fileInput;
  fileSize = 20000;
  locationCode: string;
  isMergingGRFCNAllowed = false;
  configAmountForAdv: number;
  isPanCardMandatory: boolean;
  isMergingAllowed: string;
  txnId: string;
  PrintErrorText: any;
  fileIds: string[] = [];

  constructor(
    private grfFacade: CtGrfFacade,
    private customerFacade: CustomerFacade,
    private commonFacade: CommonFacade,
    private dialog: MatDialog,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private translate: TranslateService,
    private locationSettingsFacade: LocationSettingsFacade,
    private toolbarFacade: ToolbarFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    private router: Router,
    private printingService: PrintingServiceAbstraction,
    private fileFacade: FileFacade,
    private bodeodFacade: SharedBodEodFacade,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService
  ) {
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.PrintErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
  }

  ngOnInit(): void {
    this.bodeodFacade.loadLatestBusinessDay();
    this.fileFacade.clearResponse();
    this.customerFacade.disableCustomerCreate();
    this.overlayNotification.close();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.isLoading$ = this.grfFacade.getIsLoading();
    this.grfFacade.resetGrf();

    this.commonFacade.setTransactionConfig({
      isPaymentEditable: true,
      transactionType: {
        type: TransactionTypeEnum.ADV,
        subType: SubTransactionTypeEnum.FROZEN_RATES
      }
    });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.FACTORY_BRAND_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandCode => {
        if (brandCode) {
          this.customerFacade.loadBrandDetails(brandCode);
        }
      });
    this.printIsLoading$ = this.printingService.getPrinterIsLoading();
    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetails => {
        if (brandDetails) {
          this.configAmountForAdv =
            brandDetails.panCardDetails.data.configurationAmountForAdvance;
          this.isPanCardMandatory =
            brandDetails.panCardDetails.data.isPanCardMandatoryforAdvance;
          this.commonFacade.setConfigurationAmountForAdvance({
            amount: this.configAmountForAdv,
            isPanCardMan: this.isPanCardMandatory
          });
        }
      });
    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GRF_IS_MERGE_CN_ALLOWED)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMergeCNAllowed: string) => {
        if (isMergeCNAllowed === 'false') {
          this.isMergingAllowed = isMergeCNAllowed;
          this.showLocaionSettingNotification('pw.grf.mergingCNNotAllowedMsg');
        } else {
          this.showSummaryBar();
        }
      });
    this.profiledatafacade
      .getBoutiqueCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locationCode: string) => {
        if (locationCode) {
          this.locationCode = locationCode;
          this.commonFacade.loadMaxCashLimit({
            ruleType: ConfigurationType.CASH_CONFIGURATION,
            requestBody: { locationCode: this.locationCode }
          });
          this.grfFacade.loadCNValidationDetails({
            ruleType: ConfigurationType.ADV,
            requestBody: { locationCode: this.locationCode }
          });
        }
      });

    this.grfFacade
      .getCnValidationDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.isMergingGRFCNAllowed = data.isMergingGRFCNAllowed;
        }
      });

    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.customerId = customer?.customerId;
          this.customerType = customer.customerType;
          this.customer = customer;
          if (this.customerId !== null) {
            this.grfFacade.loadFrozenCNs(this.customerId);
          }
        } else {
          this.clearData();
          this.customerId = null;
          this.customerType = null;
          this.customer = null;
        }
      });

    this.grfFacade
      .getFrozenCNs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((frozenCNs: FrozenCNs[]) => {
        if (frozenCNs) {
          this.frozenCNs = frozenCNs;
        }
      });
    this.grfFacade
      .getMergeCNs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mergeCNResponse: MergeCNResponse) => {
        if (mergeCNResponse) {
          this.summaryBar.close();
          this.mergedCNResponse = mergeCNResponse;
          this.txnId = mergeCNResponse.id;
          this.showNotification();
        }
      });

    this.grfFacade
      .getGRFCN()
      .pipe(takeUntil(this.destroy$))
      .subscribe((creditNote: CreditNote[]) => {
        if (creditNote) {
          this.ids = creditNote.map(obj => obj.id);
          if (!this.isAddAnotherGRF) {
            this.grfCNs = creditNote;
          }
        }
      });

    this.grfFacade
      .getAnotherCustomerGRFCN()
      .pipe(takeUntil(this.destroy$))
      .subscribe((anotherCustomerGRFCN: CreditNote) => {
        if (anotherCustomerGRFCN) {
          if (this.isAddAnotherGRF) {
            if (anotherCustomerGRFCN.status.toUpperCase() !== 'OPEN') {
              this.grfFacade.removeGRFCN(anotherCustomerGRFCN.id);
              this.showAlertNotification('pw.grf.openMsg');
            } else {
              this.anotherCustomerGRFCNs = anotherCustomerGRFCN;
              this.hasOtpValidated = false;
              this.token = '';
              this.overlayNotification.close();
              this.addAnotherGRF();
            }
          }
        }
      });
    this.grfFacade
      .getHasOtpValidated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasOtpValidated: boolean) => {
        if (hasOtpValidated) {
          this.hasOtpValidated = hasOtpValidated;
          this.addAnotherGRF();
        }
      });

    this.grfFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.fileFacade
      .getFileIds()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ids: string[]) => {
        if (ids) {
          this.fileIds = ids;
          if (ids.length > 0) this.overlayNotification.close();
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
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.MERGE_GRF, {
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.mergeGrfRemarks = event.remarks;
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            this.clearData();
            break;
          }
          case SummaryBarEventType.CREATEGRF: {
            if(this.customerId !== null){
              let isFormValidated = this.validateCustomerService.validateCustomer(this.customer)
              if(isFormValidated){
                let differentCustomersCNs = false;
                if (!this.isMergingGRFCNAllowed) {
                  this.grfCNs.forEach(data => {
                    if (data.customerId !== Number(this.customerId)) {
                      differentCustomersCNs = true;
                      return;
                    }
                  });
                }
                if (differentCustomersCNs) {
                  this.callAlertPopup('pw.grf.multipleCNMsg');
                } else if (this.customerId) {
                  differentCustomersCNs = false;
                  this.grfCNs.forEach(data => {
                    if (data.customerId !== Number(this.customerId)) {
                      differentCustomersCNs = true;
                      return;
                    }
                  });
                  if (this.fileIds.length === 0 && differentCustomersCNs) {
                    this.showAlertNotification('Document upload is mandatory');
                  } else {
                    this.callInfoPopup('pw.grf.infoMsgLabel');
                  }
                } else {
                  this.showAlertNotification('pw.grf.selectCustomerAlert');
                }
              } else{
                this.customerService.open({customerType: this.customerType, customerId: this.customerId})
              }
            }
            break;
          }
        }
      });
  }
  print() {
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
            printType: printTypesEnum.MERGE_GRF,
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            transacionId: this.txnId,
            reprint: false,
            customerId: this.customerId,
            invoiceType: action
          });
        }
      });
  }

  showAlertPopUp(message: string) {
    this.alertPopupService
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
        message: this.PrintErrorText,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.showNotification();
      });
  }
  callAlertPopup(key: string) {
    this.dialog.closeAll();
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((trasnaltedMsg: string) => {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.ERROR,
            message: trasnaltedMsg
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
            }
          });
      });
  }
  callInfoPopup(key: string) {
    this.dialog.closeAll();
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((trasnaltedMsg: string) => {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.INFO,
            message: trasnaltedMsg
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.grfFacade.mergeCNs({
                customerId: this.customerId,
                employeeCode: 'abc',
                ids: this.ids,
                tempFileIds:
                  this.fileIds.length > 0
                    ? {
                        OTHERS: this.fileIds
                      }
                    : null,
                remarks:
                  this.mergeGrfRemarks !== '' ? this.mergeGrfRemarks : null
              });
            }
          });
      });
  }
  clearData() {
    // this.commonFacade.clearTransactionTD();
    this.commonFacade.clearTransactionTD();
    this.customerFacade.clearSelectedCustomer();
    this.grfFacade.removeAllGEFCNs();
    this.summaryBarRemarks$.next('');
    if (this.isMergingAllowed !== 'false') this.overlayNotification.close();
    this.dialog.closeAll();
    this.docNo = null;
    this.fiscalYear = null;
    this.fileIds = [];
    this.fileFacade.clearResponse();
    this.fileFacade.clearFileList(true);
    this.mergedCNResponse = null;
  }
  showAlertNotification(key: string): void {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
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
  showLocaionSettingNotification(key: string): void {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }
  back() {
    this.router.navigate([getSalesHomePageUrl()]);
  }

  showNotification() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmMergedCNNotificationTemplate
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.clearData();
          this.showSummaryBar();
        }
      });
  }
  addAnotherGRF() {
    this.dialog.closeAll();
    let disableGenerateOTP = false;

    if (this.anotherCustomerGRFCNs?.customerId === Number(this.customerId)) {
      disableGenerateOTP = true;
    }
    if (!this.isMergingGRFCNAllowed) {
      this.callAlertPopup('pw.grf.multipleCNMsg');
    } else {
      this.dialogRef = this.dialog.open(AddOtherGrfPopupComponent, {
        width: '500px',
        height: 'auto',
        disableClose: true,
        data: {
          grfCn: this.anotherCustomerGRFCNs,
          hasOtpValidated: this.hasOtpValidated,
          token: this.token,
          currentFiscalYear: this.currentFiscalYear,
          disableGenerateOTPButton: disableGenerateOTP
        }
      });
      this.dialogRef.componentInstance.getCNDetails
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          if (value) {
            this.isAddAnotherGRF = true;
            this.grfFacade.searchGRF({
              docNo: value.grfNumber,
              fiscalYear: value.fiscalYear
            });
          }
        });

      this.dialogRef.componentInstance.otp
        .pipe(takeUntil(this.destroy$))
        .subscribe(generateOtp => {
          if (generateOtp) {
            this.grfFacade.generateOTP(generateOtp);
          }
        });
      this.dialogRef.componentInstance.validateOTP
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data) {
            this.grfFacade.validateOTP({ id: data.id, token: data.token });
            this.token = data.token;
          }
        });

      this.dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          if (result) {
            const data = this.grfCNs.filter(
              obj =>
                obj.docNo === this.anotherCustomerGRFCNs.docNo &&
                obj.fiscalYear === this.anotherCustomerGRFCNs.fiscalYear
            );
            if (result === 'ADD') {
              if (data.length === 0)
                this.grfCNs = this.grfCNs.concat(this.anotherCustomerGRFCNs);
              else {
                this.callAlertPopup('pw.grf.alertMsg');
              }
            } else if (result === 'CLOSE') {
              if (this.anotherCustomerGRFCNs?.id && data.length === 0)
                this.grfFacade.removeGRFCN(this.anotherCustomerGRFCNs.id);
            }
            this.anotherCustomerGRFCNs = null;
            this.hasOtpValidated = false;
            this.token = '';
            this.isAddAnotherGRF = false;
          }
        });
    }
  }
  add() {
    const cn = this.grfCNs.filter(obj => {
      if (obj.docNo === this.docNo && obj.fiscalYear === this.fiscalYear)
        return true;
      else return false;
    });
    this.isAddAnotherGRF = false;
    if (cn.length > 0) {
      this.callAlertPopup('pw.grf.alertMsg');
    } else {
      this.grfFacade.searchGRF({
        docNo: this.docNo,
        fiscalYear: this.fiscalYear
      });
    }
  }

  selectionChange($event) {
    this.isAddAnotherGRF = false;
    this.docNo = $event.cnDocNo;
    this.fiscalYear = $event.cnFiscalYear;
  }
  deleteGRFCN(id) {
    this.grfFacade.removeGRFCN(id);
  }
  mergeGRFCNs(creditNotes: CreditNote[]) {
    let flag = false;
    for (const cn of creditNotes) {
      if (cn.customerId !== Number(this.customerId)) {
        this.commonFacade.setFileUploadVisible(true);
        flag = true;
        break;
      }
    }
    if (!flag) {
      this.commonFacade.setFileUploadVisible(false);
    }
    this.commonFacade.setMergingCns(creditNotes);
  }
  uploadConsentForm(event) {
    this.overlayNotification.close();
    const fileList: FileList = event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey = 'pw.payerBanks.maximumFileSizeErrorMessage';
        this.showNotifications(errorKey);
        this.fileInput.nativeElement.value = '';
      }
      const extn = file.name.split('.').pop();
      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.showNotifications(errorKey);
        this.fileInput.nativeElement.value = '';
      }
      const type = file.name.substring(0, 3);
      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {
        if (type) {
          formData.set(reqfileKey, file, file.name);
          //this.fileFacade.loadFileUpload(formData, FileGroupEnum.PAYER_BANK);
          this.fileInput.nativeElement.value = '';
        }
      }
    }
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: false
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else if (error.code === ErrorEnums.ERR_CUST_001) {
      this.customerService.open({customerType: this.customerType, customerId: this.customerId})
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasBackdrop: true,
          hasClose: true,
          error: error
        })
        .events.pipe(take(1))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (this.mergedCNResponse) {
            this.showNotification();
          }
        });
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearData();
    this.summaryBar.close();
    this.customerFacade.enableCustomerCreate();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.printingService.resetPrint();
    this.customerFacade.clearCustomerSearch();
    this.commonFacade.clearTransactionConfig();
  }
}
