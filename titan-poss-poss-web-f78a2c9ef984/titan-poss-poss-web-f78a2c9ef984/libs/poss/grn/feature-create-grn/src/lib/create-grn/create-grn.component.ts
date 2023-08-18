import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GrnFacade } from '@poss-web/poss/grn/data-access-grn';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  GrnInitResponse,
  ConfirmGrnWithOutApprovalPayload,
  GrnApproverSuccessList,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  LocationSettingAttributesEnum,
  printTypesEnum,
  printDocTypeEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  ProductGridProperties,
  ProductDetailsInGrid,
  ProductTypesEnum,
  GrnApprovalTypeEnums,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  GrnReasonEnums,
  PrintingServiceAbstraction,
  SharedBodEodFeatureServiceAbstraction,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  GrnEnums,
  SummaryBarType,
  SummaryBarServiceAbstraction,
  SummaryBarEventRef,
  SummaryBarEventType,
  PostTransactionConfirmationActionsServiceAbstraction,
  InvoiceDeliveryTypes,
  ItemDataPayload,
  GrnProductDetails,
  RsoDetailsPayload
} from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import {
  POSS_WEB_COIN_PRODUCT_GROUP_CODE,
  POSS_WEB_CURRENCY_CODE
} from '@poss-web/shared/util-config';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { calculatePriceBreakup } from '@poss-web/shared/util-price';

import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { getGrnStatusUrl } from '@poss-web/shared/util-site-routes';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
const weightCode = 'gms';
const RSOCode = 'RSO';
@Component({
  selector: 'poss-web-create-grn',
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.scss']
})
export class CreateGrnComponent implements OnInit, AfterViewInit, OnDestroy {
  grnFormGroup: FormGroup;
  isLoading$: Observable<boolean>;
  isCommonLoading$: Observable<boolean>;
  grnDetails: GrnInitResponse;
  isLegacy = false;
  imageUrlData$: Subject<any> = new Subject<any>();
  destroy$: Subject<null> = new Subject<null>();
  customerId: number;
  productDetails: any = [];
  grnType = GrnEnums.REGULAR_GRN;
  binControl: FormControl;
  reasonControl: FormControl;
  otherReasonControl: FormControl;
  grnEnumRef = GrnEnums;
  locationForSelection: SelectionDailogOption[] = [];
  selectedLocation: SelectionDailogOption;
  grnDays;
  maxGrnDays;
  pgDesc$: Observable<{}>;
  item$: Subject<GrnProductDetails> = new Subject<GrnProductDetails>();
  summaryBarRemarks$ = new Subject<string>();
  currentDate = moment();
  currentYear = moment().year();
  currentMonth = moment().month();
  grnRemarks: any;
  txnType: any;
  subTxnType: any;
  txnId: any;
  checkDays: number;
  confirm: boolean;
  approvalCodeControl: FormControl;
  locationCode: string;
  initiate = false;
  approvalFormGroup: FormGroup;
  approvers: GrnApproverSuccessList[];
  reasons;
  approvalType: any;
  formData: FormData = new FormData();
  grnApprovalRemarks: any;
  items: ItemDataPayload[] = [];
  boutiqueCode: string;
  value: any;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('confirmSuccessNotificationTemplateApproval', { static: true })
  confirmSuccessNotificationTemplateApproval: TemplateRef<any>;
  docNo: number;
  reqNo: number;
  refDocNo: any;
  boutiqueDesc: string;
  cnDocNo: any;
  cnAmt: any;
  searchErrorCode: ErrorEnums;
  hasError$: any;
  PrintErrorText: any;
  response: {
    docNo: number;
    cnDocNo: any;
    cnAmount: number;
    tcsCnDocNo: any;
    tcsCnAmt?: number;
  };
  amtMsg: any;
  reasonDropDown: any;
  approversDropdown: any;
  type = GrnEnums.REGULAR_GRN;
  productGridProperties: ProductGridProperties;
  product$: ProductDetailsInGrid[];
  clearAllData$: Subject<null> = new Subject<null>();
  radioFormGroup: FormGroup;
  details = false;
  productDataToGrid: ProductDetailsInGrid;
  pgDescription: {};
  mailData = '';
  fileUploadTitle =
    'Upload Approval Mail / Consent Letter / ID proof / Other Documents';
  fileType = 'OTHERS';

  businessDate: any;
  approvalReason: any;
  currentFiscalYear: string;
  imageUrl: any;
  cmDate: moment.Moment;
  confirmId: any;
  fileIds: string[];
  tcsCollectedAmount = 0;
  originalTcsAmountCollected = 0;
  tcsCnAmt: any;
  focDeductionValue: number;
  encirclePoints = 0;
  tcsCnDocNo: any;
  rsoDetails$: Observable<RsoDetailsPayload[]>;
  constructor(
    private grnFacade: GrnFacade,
    private commonFacade: CommonFacade,
    private dialog: MatDialog,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private profileDataFacade: ProfileDataFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private customerFacade: CustomerFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private selectionDialog: SelectionDialogService,
    public printingService: PrintingServiceAbstraction,
    private fileFacade: FileFacade,
    private productFacade: ProductFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private bodeodFacade: SharedBodEodFacade,
    @Inject(POSS_WEB_CURRENCY_CODE) public defaultCurrencyCode
  ) {
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
      });
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.PrintErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
        this.amtMsg = translatedMessages['pw.grn.amtMsg'];
      });
    this.binControl = new FormControl();
    this.reasonControl = new FormControl(
      '',
      this.fieldValidatorsService.requiredField('Reason for return')
    );
    this.otherReasonControl = new FormControl(
      '',
      this.fieldValidatorsService.reasonField('Reason for return')
    );
    this.approvalCodeControl = new FormControl('');
    this.grnEnumRef = GrnEnums;
    this.radioFormGroup = new FormGroup({
      selectRadioButton: new FormControl(this.type)
    });
    this.grnFormGroup = new FormGroup({
      refDocNo: new FormControl('', [
        this.fieldValidatorsService.requiredField('CM Number'),
        this.fieldValidatorsService.requestNumberField('CM Number')
      ]),
      locationCode: new FormControl(''),
      fiscalYear: new FormControl('')
    });

    this.approvalFormGroup = new FormGroup({
      approverRoleCode: new FormControl(
        '',
        this.fieldValidatorsService.requiredField('Approver')
      ),
      reasonForCancellation: new FormControl(
        '',
        this.fieldValidatorsService.requiredField('Reason for Return')
      ),
      otherReasons: new FormControl(
        '',
        this.fieldValidatorsService.reasonField('Reason for Return')
      ),
      approvalCode: new FormControl(''),
      ccafNo: new FormControl(''),
      approvalDate: new FormControl(this.businessDate),
      approvalEMailUploadURL: new FormControl('')
    });
  }

  ngOnInit() {
    this.bodeodFacade.loadLatestBusinessDay();
    this.setValidation();
    this.grnFacade.loadReset();
    this.commonFacade.setFileUploadVisible(true);
    this.commonFacade.setGrnTotalProducts(0);
    this.commonFacade.setGrnTotalValue(0);
    this.commonFacade.setGrnStatus(null);
    this.isLoading$ = this.grnFacade.getIsloading();
    this.hasError$ = this.grnFacade.getError();
    this.grnFacade.loadLocations();
    this.grnFacade.loadGrnReasons('GRN_REASON_TYPE');
    this.radioFormGroup
      .get('selectRadioButton')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(grnType => {
        this.grnType = grnType;
        this.resetForms();
        this.summaryBar.close();
        this.loadConfigCheck();
      });
    this.productFacade.loadRSODetails(RSOCode);
    this.rsoDetails$ = this.productFacade.getRSODetails();
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

    this.isCommonLoading$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.GRN,
      CommomStateAttributeNameEnum.LOADING
    );

    this.grnFacade
      .getGrnReasons()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.reasonDropDown = [];
          data.forEach(reason => {
            // const reasons = {};
            // reasons['value'] = reason.code;
            // reasons['description'] = reason.value;
            this.reasonDropDown.push({
              value: reason.code,
              description: reason.value
            });
          });
        }
      });
    this.grnFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.searchErrorCode = ErrorEnums.ERR_SALE_070;
    this.profileDataFacade
      .getBoutiqueCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(boutiqueCode => {
        console.log(boutiqueCode, 'boutiqueCode');

        this.boutiqueCode = boutiqueCode;
      });
    this.profileDataFacade
      .getBoutiqueDesc()
      .pipe(takeUntil(this.destroy$))
      .subscribe(boutiqueDesc => {
        console.log(boutiqueDesc, 'boutiqueDesc');

        this.boutiqueDesc = boutiqueDesc;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GRN_NO_OF_DAYS_GRN_ALLOWED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        if (data) {
          this.grnDays = Number(data);
        }
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GRN_MAX_NO_OF_DAYS_FOR_APPROVED_GRN
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        if (data) {
          this.maxGrnDays = Number(data);
        }
      });
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) this.currentFiscalYear = fiscalYear.toString();
      });
    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

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
            tcsCnDocNo: data.cndocTypes
              ? data.cndocTypes['TCS_CREDIT_NOTE']
              : null,
            tcsCnAmt: data.tcsCnAmt
          };

          this.showSuccessMessageNotification(this.response);
        }
      });

    this.grnFacade
      .getGrnReqId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          console.log(data, 'reqId');

          this.showSuccessMessageNotificationApproval(data);
        }
      });

    this.grnFacade
      .getLocationCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: any) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description
          }));
        }
      });

    this.grnFacade
      .getGrnFinalPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const finalValue = data.finalValue;
          const totalReturnQuantity = data.totalReturnQuantity;
          this.focDeductionValue = data.focDeductionValue;
          this.tcsCollectedAmount = data.tcsAmountToBeRefund;
          this.encirclePoints = data.encirclePoints;
          this.grnFacade.setFocDeduction(this.focDeductionValue);
          this.commonFacade.setGrnTotalValue(finalValue);
          this.commonFacade.setGrnTotalProducts(totalReturnQuantity);
        }
      });
    this.fileFacade
      .getFileIds()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ids: string[]) => {
        if (ids) {
          this.fileIds = ids;
          //if (ids.length > 0) this.overlayNotification.close();
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

    // this.commonFacade.loadPgDesc();
    // this.pgDesc$ = this.commonFacade.getPgDesc();
    this.commonFacade.loadGRNPgDesc();
    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.GRN,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );
  }
  setValidation() {
    // this.refDocNo = this.grnFormGroup.get('refDocNo').value;
    const reason = this.approvalFormGroup.get('reasonForCancellation');
    this.reasonControl.valueChanges.subscribe(data => {
      this.otherReasonControl.patchValue('');
    });
    reason.valueChanges.subscribe(data => {
      this.approvalFormGroup.get('otherReasons').patchValue('');
    });
  }
  confirmWithOutApproval(
    confirmGrnWithOutApprovalPayload: ConfirmGrnWithOutApprovalPayload
  ) {
    this.grnFacade.confirmGrnWithOutApproval(confirmGrnWithOutApprovalPayload);
  }

  loadImageUrl(event: string) {
    // this.commonFacade.loadImageUrl(event);
    this.commonFacade.loadGRNImageUrl(event);
  }
  initiateGrn() {
    const values = this.grnFormGroup.getRawValue();
    const payload = {
      refDocNo: values.refDocNo ? values.refDocNo : null,
      locationCode: this.selectedLocation ? this.locationCode : null,
      fiscalYear: values.fiscalYear ? values.fiscalYear : null
    };

    this.grnFacade.loadInitiateGrn(payload);
  }

  resetForms() {
    this.approvalType = '';
    this.reasonControl.reset();
    this.approvalFormGroup.reset();
  }

  loadConfigCheck() {
    if (this.grnType !== GrnEnums.MFG_DEFECT) {
      this.binControl.patchValue('GRN');
      this.approvalFormGroup.get('reasonForCancellation').reset();
      this.approvalFormGroup.get('reasonForCancellation').enable();
    } else {
      this.binControl.patchValue('DEFECTIVE');
      this.approvalFormGroup.patchValue({
        reasonForCancellation: GrnReasonEnums.QUALITY_ISSUE
      });
      this.approvalFormGroup.get('reasonForCancellation').disable();
    }

    this.grnFacade.loadApprovers({
      data: {
        locationCode: this.boutiqueCode
      },
      ruleType:
        this.grnType === GrnEnums.MFG_DEFECT
          ? GrnEnums.GRN_APPROVAL_ACCESS_MFG_DEFECT
          : GrnEnums.GRN_APPROVAL_ACCESS_REGULAR
    });

    this.checkDays = this.businessDate.diff(this.grnDetails.refDocDate, 'days');

    if (
      this.checkDays > this.grnDays &&
      this.checkDays <= this.maxGrnDays &&
      this.grnType === GrnEnums.REGULAR_GRN
    ) {
      this.showApprovalSummaryBar();
      this.confirm = false;
    } else if (
      this.checkDays <= this.grnDays &&
      this.grnType === GrnEnums.REGULAR_GRN
    ) {
      this.showConfirmSummaryBar();
      this.confirm = true;
    } else if (
      this.checkDays > this.maxGrnDays &&
      this.grnType === GrnEnums.REGULAR_GRN
    ) {
      this.errorNotifications(
        'Max Days Reached for GRN as per the configuration'
      );
    } else if (this.grnType === GrnEnums.MFG_DEFECT) {
      this.showApprovalSummaryBar();
      this.confirm = false;
    }
  }
  getItems(itemData) {
    this.items = [...itemData];
    if (this.items.length > 0) {
      this.grnFacade.loadGrnFinalPriceDetails({
        data: { refTxnId: this.txnId, items: this.items },
        txnType: this.txnType,
        subTxnType: this.subTxnType
      });
    } else {
      this.focDeductionValue = 0;
      this.encirclePoints = 0;
      this.tcsCollectedAmount = this.originalTcsAmountCollected;
      this.grnFacade.setFocDeduction(this.focDeductionValue);
      this.commonFacade.setGrnTotalProducts(0);
      this.commonFacade.setGrnTotalValue(0);
    }
  }

  print() {
    console.log(this.confirmId, 'this.confirmId');

    this.postConfirmationActions
      .open()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          let action = null;
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
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            transacionId: this.confirmId,
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
        this.showSuccessMessageNotification(this.response); //call your respective success overlay method
      });
  }

  showSuccessMessageNotification(response) {
    this.docNo = response?.docNo;
    this.cnDocNo = response?.cnDocNo;
    this.cnAmt = response?.cnAmount;
    this.tcsCnDocNo = response?.tcsCnDocNo;
    this.tcsCnAmt = response?.tcsCnAmt;
    const key = 'pw.grn.grnRequestMsg';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            // message: translatedMsg + ' ' + this.docNo,
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
  showSuccessMessageNotificationApproval(documentNumber: number) {
    this.reqNo = documentNumber;
    const key = 'pw.grn.grnConfirmMesg';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMsg + ' ' + documentNumber,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplateApproval
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.router.navigate([getGrnStatusUrl()]);
            }
          });
      });
  }
  openLocationSelectionPopup() {
    this.dialog.closeAll();
    this.selectionDialog
      .open({
        title: 'Select Location',
        placeholder: 'Select Location',
        options: this.locationForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocation = selectedOption;
          this.locationCode = this.selectedLocation.id;
        }
      });
  }
  upload(event) {
    this.overlayNotification.close();
    const fileList: FileList = event;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: File = fileList.item(0);
      formData.append('file', fileList.item(0));
    }
    this.fileFacade.uploadForm({
      fileType: 'OTHERS',
      docType: 'GRN',
      file: formData
    });
  }
  uploadError(event: string) {
    this.showNotifications(event);
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
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
  }
  clearLocation() {
    this.locationCode = null;
  }
  clearDetails() {
    this.grnFacade.loadReset();
    this.grnFormGroup.reset();
    this.grnFormGroup.get('fiscalYear').patchValue(this.currentFiscalYear);
    this.commonFacade.setGrnTotalProducts(0);
    this.commonFacade.setGrnTotalValue(0);
    this.grnFormGroup.enable();
    this.encirclePoints = 0;
    this.tcsCollectedAmount = this.originalTcsAmountCollected;
    this.grnDetails = null;
    this.isLegacy = false;
    this.initiate = false;
    this.details = false;
    this.clearAllData$.next();
    this.summaryBar.close();
  }

  errorHandler(error: CustomErrors) {
    console.log(error.code, ErrorEnums.ERR_QZ_TRAY, 'check error');

    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else if (error.code === this.searchErrorCode) {
      this.grnFormGroup.enable();
      this.initiate = false;
      return;
    } else
      this.overlayNotification.show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      });
  }
  ngAfterViewInit() {
    this.grnFacade
      .getInitiateGrnResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.grnFormGroup.disable();
          this.initiate = true;
          this.details = true;
          this.grnDetails = data;
          if (data?.txnSource === 'LEGACY') {
            this.isLegacy = true;
          }

          if (data.returnedItemIds.length > 0) {
            this.productDetails = data.items.filter(item => {
              return !data.returnedItemIds.find(
                returnedId => returnedId.itemId === item.id
              );
            });

            data.items.forEach(item => {
              data.returnedItemIds.filter(returnedId => {
                if (item.id === returnedId.itemId) {
                  if (item.totalQuantity > returnedId.totalQuantity) {
                    item = {
                      ...item,
                      totalQuantity:
                        item.totalQuantity - returnedId.totalQuantity
                    };
                    console.log('Sarika', item);
                    this.productDetails.push(item);
                    const payload = {
                      refTxnId: this.grnDetails.id ? this.grnDetails.id : null,
                      data: {
                        itemId: item.id,
                        totalQuantity: item.totalQuantity
                      },
                      selected: false
                    };
                    this.grnFacade.loadItemDetails(payload);
                  }
                }
              });
            });
          } else {
            this.productDetails = data.items;
          }
          if (this.productDetails.length === 0) {
            this.alertPopupService.open({
              type: AlertPopupTypeEnum.INFO,
              message: 'No products available for raising GRN for this invoice'
            });
          }
          // this.productDetails = data.items;
          this.customerId = data.grnCustomerId;
          //this.grnFacade.loadTcsCollectedAmount(data.id);
          //this.tcsCollectedAmount = data.tcsAmountCollected;
          //this.originalTcsAmountCollected = data.tcsAmountCollected;
          this.txnId = data.id;
          this.cmDate = data.refDocDate;
          this.txnType = GrnEnums.TXN_TYPE;
          this.subTxnType = GrnEnums.SUB_TXN_TYPE;
          this.customerFacade.loadSelectedCustomer(
            String(this.customerId),
            false,
            false
          );
          this.loadConfigCheck();
        }
      });

    this.grnFacade
      .getItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.item$.next({ ...data });
          this.productDetails = this.productDetails.map(element => {
            if (element.id === data.id) {
              element = { ...data };
            }
            return element;
          });
        }
      });

    // this.grnFacade
    //   .getTcsCollectedAmount()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: TcsCollectedResponse) => {
    //     if (data) {
    //       this.tcsCollectedAmount = data.tcsAmountCollected;
    //     }
    //   });

    this.grnFacade
      .getApprovers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.approvers = data;
        }
      });

    this.approvalFormGroup
      .get('approverRoleCode')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const x = this.approvers.filter(a => a.value === data);
          this.approvalType = x[0]?.processType;
          this.setValidation2();
        }
      });
  }

  quantityChange(event) {
    const payload = {
      refTxnId: this.grnDetails.id ? this.grnDetails.id : null,
      data: { itemId: event.id, totalQuantity: event.totalQuantity },
      selected: event.selected
    };
    this.grnFacade.loadItemDetails(payload);
  }

  sendProductToGrid(items: any) {
    this.productGridProperties = {
      checkBox: {
        isMultipleCheckBox: false
      },
      selectedLotNumber: {
        isLotNumber: true,
        isEditable: false
      },
      actualWeight: {
        isEditable: false
      },
      selectedRso: {
        isEditable: false
      },
      discount: {
        isDiscountValue: true
      },
      finalPrice: {
        isAnchor: true
      },
      delete: false
    };

    const productArray = [];

    for (const item of items) {
      console.log(item, 'check');
      const priceResult = calculatePriceBreakup(
        item?.priceDetails,
        item?.taxDetails?.data,
        {
          isUcp: item?.priceDetails?.isUcp,
          totalValue: item?.totalValue,
          weightUnit: weightCode,
          weight: item?.totalWeight
        }
      );
      const productDataToGrid: ProductDetailsInGrid = {
        itemCode: item.itemCode,
        binCode: item.binCode,
        description: this.pgDescription
          ? this.pgDescription[`${item.productGroupCode}`]
          : item.productGroupCode,
        selectedLotNumber:
          item.productGroupCode === this.coinCode
            ? String(item.totalQuantity)
            : item.lotNumber,
        availableLotNumbers: [],
        unitWeight: item.unitWeight,
        actualWeight: Number(item.totalWeight),
        selectedRso: item.employeeCode,
        availableRso: null,
        pricePerUnit: item.pricePerUnit,
        discount: item.totalDiscount,
        finalPrice: item.finalValue,
        priceBreakUp: priceResult,
        productDetails: {
          binCode: item.binCode,
          inventoryId: null,
          lotNumber: item.lotNumber,
          karatage: 0,
          quantity: null,
          actualWeight: item.totalWeight,
          unitWeight: item.unitWeight,
          productCategoryCode: item.productCategoryCode,
          productCategoryDescription: null,
          productGroupCode: item.productGroupCode,
          productGroupDescription: null,
          inventoryWeightDetails: null,
          itemCode: item.itemCode,
          imageUrl: null,
          itemDescription: null,
          binGroupCode: null
        },
        inventoryId: null,
        itemId: item.id,
        productType: ProductTypesEnum.REGULAR,
        isAdd: true,
        remarks: null,
        priceDetails: item.priceDetails,
        quantity: null,
        taxDetails: item.taxDetails,
        stdWeight: null,
        karatage: null,
        productCatergory: item.productCategoryCode,
        productGroup: item.productGroupCode,
        status: null,
        totalQuantity: null,
        subTxnType: null,
        selectedReason: null,
        availableReasons: [],
        rowId: 0
      };

      console.log(productDataToGrid, 'productDataToGrid');
      this.productDataToGrid = productDataToGrid;
      productArray.push(productDataToGrid);

      // }
    }
    this.product$ = productArray;
  }

  showConfirmSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.GRN, {
        productDetails: this.productDetails
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        if (event.eventType === SummaryBarEventType.CONFRIM_GRN) {
          this.grnRemarks = event.remarks !== '' ? event.remarks : null;
          this.reasonControl.markAllAsTouched();
          if (this.items.length === 0) {
            this.errorNotifications('Please select atleast one product item');
          } else {
            if (this.reasonControl.invalid)
              this.errorNotifications('Please select reason');
            else this.confirmGrn();
          }
        }
        if (event.eventType === SummaryBarEventType.CLAER) {
          this.clearDetails();
        }
      });
  }
  showApprovalSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.GRN_APPROVAL, {
        productDetails: this.productDetails
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        if (event.eventType === SummaryBarEventType.GRN_SEND_FOR_APPROVAL) {
          this.grnApprovalRemarks = event.remarks;
          this.approvalFormGroup.markAllAsTouched();
          if (this.items.length === 0) {
            this.errorNotifications('Please select atleast one product item');
          } else {
            if (this.approvalFormGroup.get('approverRoleCode').value === null) {
              this.errorNotifications('Please Select Approver');
            } else if (
              this.approvalType === 'CODE' &&
              this.approvalFormGroup.get('approvalCode').value === ''
            ) {
              this.errorNotifications('Please Enter Approval Code');
            } else if (
              this.approvalType === 'CODE' &&
              this.approvalFormGroup.get('ccafNo').value === ''
            ) {
              this.errorNotifications('Please CCAF No');
            } else if (!this.approvalFormGroup.invalid) {
              this.sendForApproval();
            }
          }
        }
        if (event.eventType === SummaryBarEventType.CLAER) {
          this.radioFormGroup.get('selectRadioButton').patchValue(this.type);
          this.resetForms();
          this.clearDetails();
        }
      });
  }
  setValidation2() {
    const ccafCtrl = this.approvalFormGroup.get('ccafNo');
    const approvalCodeCtrl = this.approvalFormGroup.get('approvalCode');
    const dateCtrl = this.approvalFormGroup.get('approvalDate');
    console.log(this.approvalType, 'in validation');

    if (this.approvalType === GrnApprovalTypeEnums.CODE) {
      dateCtrl.setErrors(null);
      ccafCtrl.setValidators([
        this.fieldValidatorsService.requiredField('CCAF No')
      ]);
      approvalCodeCtrl.setValidators([
        this.fieldValidatorsService.requiredField('Approval Code')
      ]);
    } else if (this.approvalType === GrnApprovalTypeEnums.EMAIL) {
      approvalCodeCtrl.setErrors(null);
      ccafCtrl.setErrors(null);
      dateCtrl.setValidators([
        this.fieldValidatorsService.requiredField('Approval Date'),
        this.fieldValidatorsService.minDate(this.cmDate, 'Approval Date')
      ]);
    }
    ccafCtrl.updateValueAndValidity;
    approvalCodeCtrl.updateValueAndValidity;
    dateCtrl.updateValueAndValidity;
    console.log(this.approvalFormGroup, 'check2');
  }
  confirmGrn() {
    this.grnFacade.confirmGrnWithOutApproval({
      data: {
        cancelType: this.grnType,
        customerId: this.customerId,
        items: this.items,
        reasonForCancellation:
          this.reasonControl.value !== GrnReasonEnums.OTHERS
            ? this.reasonControl.value
            : this.otherReasonControl.value
            ? GrnReasonEnums.OTHERS + ':' + this.otherReasonControl.value
            : GrnReasonEnums.OTHERS,
        refTxnId: this.txnId,
        remarks: this.grnRemarks,
        isVoid: this.grnDetails?.isVoid
      },
      txnType: this.txnType,
      subTxnType: this.subTxnType
    });
  }
  sendForApproval() {
    const values = this.approvalFormGroup.getRawValue();
    this.approvalReason = values.reasonForCancellation;

    const payload = {
      approvalCode: values.approvalCode ? values.approvalCode : null,
      approvalDate:
        this.approvalType === GrnApprovalTypeEnums.EMAIL
          ? values.approvalDate
          : null,
      approverRoleCode: values.approverRoleCode
        ? values.approverRoleCode
        : null,
      reasonForCancellation:
        values.reasonForCancellation !== GrnReasonEnums.OTHERS
          ? values.reasonForCancellation
          : values.otherReasons
          ? GrnReasonEnums.OTHERS + ':' + values.otherReasons
          : GrnReasonEnums.OTHERS,
      ccafNo: values.ccafNo ? values.ccafNo : null
    };
    if (
      this.approvalType === GrnApprovalTypeEnums.EMAIL &&
      this.fileIds.length === 0
    ) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.grn.approvalMailErrorMsg'
      });
    } else {
      this.grnFacade.sendForApproval({
        data: {
          approvalCode:
            this.approvalType === GrnApprovalTypeEnums.CODE
              ? payload.approvalCode
              : null,
          approvalDate:
            this.approvalType === GrnApprovalTypeEnums.EMAIL
              ? payload.approvalDate
              : null,
          tempFileIds:
            this.approvalType === GrnApprovalTypeEnums.EMAIL
              ? {
                  OTHERS: this.fileIds
                }
              : null,
          approverRoleCode: payload.approverRoleCode,
          cancelType: this.grnType,
          ccafNo:
            this.approvalType === GrnApprovalTypeEnums.CODE
              ? payload.ccafNo
              : null,
          customerId: this.customerId,
          items: this.items,
          reasonForCancellation: payload.reasonForCancellation,
          refTxnId: this.txnId,
          requestorRemarks: this.grnApprovalRemarks
            ? this.grnApprovalRemarks
            : null,
          isVoid: this.grnDetails?.isVoid
        },
        txnType: this.txnType,
        subTxnType: this.subTxnType
      });
    }
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.summaryBar.close();
    this.clearAllData$.next();
    this.printingService.resetPrint();
  }
}
