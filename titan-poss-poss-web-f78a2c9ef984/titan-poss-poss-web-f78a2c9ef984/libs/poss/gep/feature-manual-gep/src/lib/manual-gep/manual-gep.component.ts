import { ActivatedRoute } from '@angular/router';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  TemplateRef,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Observable, Subject, fromEvent, combineLatest } from 'rxjs';
import { GepFacade } from '@poss-web/poss/gep/data-access-gep';
import {
  totalBreakUp,
  OverlayNotificationServiceAbstraction,
  SummaryBarServiceAbstraction,
  SummaryBarEventRef,
  SummaryBarEventType,
  OverlayNotificationType,
  CustomErrors,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  GEPProductDetails,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  SummaryBarType,
  ToolbarConfig,
  LocationSettingAttributesEnum,
  printTypesEnum,
  printDocTypeEnum,
  MetalTypeEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  SetTotalProductValuesPayload,
  StatusTypesEnum,
  CommomStateAttributeTypeEnum,
  FileUploadLists,
  SharedBodEodFeatureServiceAbstraction,
  PrintingServiceAbstraction,
  PostTransactionConfirmationActionsServiceAbstraction,
  InvoiceDeliveryTypes,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  DiscountsSelectionServiceAbstraction,
  DiscountsList,
  DiscountListPayload,
  CommomStateAttributeNameEnum,
  PanCardPopupAbstraction,
  CUSTOMER_TYPE_ENUM,
  PanFormVerifyPopupServiceAbstraction,
  CustomerServiceAbstraction,
  Customers
} from '@poss-web/shared/models';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';
import { HostListener } from '@angular/core';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-manual-gep',
  templateUrl: './manual-gep.component.html',
  styleUrls: ['./manual-gep.component.scss'],
  providers: [BarcodeReaderService]
})
export class ManualGepComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() openId;
  rso: any;
  metalDetail: any;
  itemDetail: any;
  customerId = null;
  customer: Customers = null;
  locationCode$: string;
  gepResponse$: Observable<any>;
  gepItemId: string;
  metalPrice$: Observable<any>;
  ratePerUnit: any;
  metal: string;
  item: string;
  measuredWeight: any;
  measuredPurity: any;
  totalTax: number;
  date: any;
  destroy$: Subject<null> = new Subject<null>();
  currentDate = moment();
  loadMetalFlag = false;
  detailsFlag = false;
  gepForm = new FormGroup({
    rsoName: new FormControl(''),

    preDeclarationForm: new FormControl(false)
  });

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchFormControl = new FormControl();
  totalProduct: any;
  itemId: string;
  success: boolean;

  weightPurity: string;
  totalBreakUp: totalBreakUp;
  detailsFlag$: Subject<boolean> = new Subject<boolean>();
  TransactionTypeEnumRef = TransactionTypeEnum;
  metalRate: [
    {
      materialTypeCode: string;
      ratePerUnit: number;
      totalMetalWeight: number;
    }
  ];
  billDetails: any;
  locationCode: any;
  materialRates$: any;
  onHoldtotalTax: number;
  hasNotification: boolean;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  srcDocNo: any;
  totalValue = 0;
  netValue: number;
  totalWt: any;
  totalQty: any;
  isLoading$: Observable<boolean>;
  productGrid: GEPProductDetails[] = [];
  tempId: any;
  preMelt: any;
  updatedPrice: boolean;
  gepSuccess: GEPProductDetails;
  weight: number;
  purity: number;
  docNo: any;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.GEP,
    subTxnType: SubTransactionTypeEnum.MANUAL_GEP,
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };

  summaryBarRemarks$ = new Subject<string>();
  currencyCode: string;
  karatageAccepted: string;
  holdTimeInMinutes: number;
  isDeclarationFormMandatory: any;
  // isPremeltDetails = true;
  fileIds: any;
  purityKarat: number;
  validationForm: FormGroup;
  scan: boolean;
  printErrorText: any;
  cnNo: any;
  gepPatchId: string;
  imageUrl: string;
  fileName = 'View Pre-Declaration Form';
  previewHeader = 'Pre-Declaration Form';
  bussinessDay: number;
  isTransactionSuccess = false;

  remarks = '';
  customerType: any;
  customerPAN: any;
  form60Submitted: boolean;
  panMandatoryForGEP: boolean;
  maxAllowedAmount: number;
  selectRSONameLabel: string;
  searchByRSOCodeLabel: string;
  gstNumber: string;
  idProof: string;
  isProfileMatched: boolean;
  permissions$: Observable<any[]>;

  GEP_CONFIRM_MANUAL_GEP_SUBMENU =
    'Customer Transaction Status-GEP Confirm Manual GEP Submenu';
  GEP_MANUAL_GEP_ADD_EDIT =
    'Customer Transaction Status-GEP Add/Edit Manual Submenu';

  constructor(
    public dialog: MatDialog,
    public printingService: PrintingServiceAbstraction,
    private fileFacade: FileFacade,
    public form: FormBuilder,
    private facade: GepFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private translate: TranslateService,
    private customerFacade: CustomerFacade,
    private regularFacade: ProductFacade,
    private toolbarFacade: ToolbarFacade,
    private authFacade: AuthFacade,
    private barcodeService: BarcodeReaderService,
    private fieldValidator: FieldValidatorsService,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private commonFacade: CommonFacade,
    private activatedRoute: ActivatedRoute,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private alertPopUpService: AlertPopupServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade, // private cashMemoFacade: CashMemoFacade
    private discountsSelectionService: DiscountsSelectionServiceAbstraction,
    private panCardServiceAbstraction: PanCardPopupAbstraction,
    private selectionDialog: SelectionDialogService,
    private panFormVerifyPopupService: PanFormVerifyPopupServiceAbstraction,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.gepForm = form.group({
      rsoName: ['', [this.fieldValidator.requiredField('RSO Name')]],

      preDeclarationForm: [false, []]
    });
    this.translate
      .get([
        'pw.otherReceiptsIssues.printError',
        'pw.productGrid.selectRSONameLabel',
        'pw.productGrid.searchByRSOCodeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
        this.selectRSONameLabel =
          translatedMessages['pw.productGrid.selectRSONameLabel'];
        this.searchByRSOCodeLabel =
          translatedMessages['pw.productGrid.searchByRSOCodeLabel'];
      });
    this.searchFormControl.disable();
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GEP_KARAT_ACCEPTED_FOR_GEP
      )
      .subscribe(configDetails => {
        if (configDetails && configDetails !== null) {
          console.log(configDetails);
          this.karatageAccepted = configDetails;
          this.purityKarat = (Number(configDetails) * 100) / 24;
          console.log(this.purityKarat);
        }
      });

    this.barcodeService.gepInput
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log(this.weight, ' ', this.purity, 'testing');
        this.searchFormControl.setValue(
          this.barcodeService.GepBarCodeWeight +
            this.barcodeService.GepBarCodePurity
        );
      });

    this.validationForm = new FormGroup({
      weight: new FormControl('', [
        this.fieldValidator.requiredField('Weight'),
        this.fieldValidator.weightField('Weight'),
        this.fieldValidator.min(0.001, 'Weight')
      ]),
      purity: new FormControl('', [
        this.fieldValidator.requiredField('Purity'),
        this.fieldValidator.purityField('Purity'),
        this.fieldValidator.max(100, 'Purity')
      ]),
      scan: new FormControl(false, [])
    });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.commonFacade.setFileUploadVisible(false);
    this.facade.resetGep();
    this.overlayNotification.close();
    this.summaryBar.close();

    this.customerFacade.clearCustomerSearch();
    this.loadMetalFlag = true;
    this.detailsFlag$.next(false);
    this.barcodeService.gepInput
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('checking new gep');
        this.searchFormControl.setValue(
          this.barcodeService.GepBarCodeWeight +
            this.barcodeService.GepBarCodePurity
        );
        console.log(
          this.searchFormControl.value,
          this.barcodeService.GepBarCodeWeight,
          this.barcodeService.GepBarCodePurity
        );
        if (
          this.barcodeService.GepBarCodeWeight &&
          this.barcodeService.GepBarCodePurity
        )
          this.add('search');
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GEP_HOLD_TIME)
      .subscribe(configDetails => {
        if (configDetails && configDetails !== null) {
          console.log(configDetails);
          this.holdTimeInMinutes = Number(configDetails);

          // this.commonFacade.setConfigHoldTime(this.holdTimeInMinutes);
          this.commonFacade.setConfigHoldTime(this.holdTimeInMinutes);
        }
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GEP_KARAT_ACCEPTED_FOR_GEP
      )
      .subscribe(configDetails => {
        if (configDetails && configDetails !== null) {
          console.log(configDetails);
          this.karatageAccepted = configDetails;
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GEP_IS_PRE_MELTING_DETAILS_MANDATORY
      )
      .subscribe(configDetails => {
        if (configDetails && configDetails !== null) {
          console.log(configDetails);
          this.isDeclarationFormMandatory = configDetails === 'true';
        }
      });
    this.facade
      .getTotalBreakUp()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data);
        if (data) {
          console.log(data);
          if (data.data.isSave === false) {
            this.facade.postGepResponse({
              data: {
                measuredPurity: data.totalBreakUp.purity,
                measuredWeight: data.totalBreakUp.measuredWeight,
                metalType: data.data.metalType,
                itemType: data.data.itemType,
                preMeltingDetails: this.preMelt,
                unitValue: data.totalBreakUp.finalValue,
                karat: data.totalBreakUp.karat
              },
              subTxnType: 'MANUAL_GEP',
              id: this.gepItemId,
              tempId: this.tempId
            });
          } else if (data.data.isSave === true) {
            console.log(data, 'data123');
            this.facade.updateGep({
              data: {
                measuredPurity: data.totalBreakUp.purity,
                measuredWeight: data.totalBreakUp.measuredWeight,
                preMeltingDetails: this.preMelt,
                itemType: data.data.itemType,
                metalType: data.data.metalType,
                unitValue: data.totalBreakUp.finalValue,
                karat: data.totalBreakUp.karat
              },
              errorData: this.gepSuccess,
              id: this.gepItemId,
              itemId: this.gepPatchId,
              subTxnType: 'MANUAL_GEP'
            });

            this.gepSuccess = null;
          }
        }
      });

    // this.commonFacade.setTransactionConfig({
    //   transactionType: {
    //     type: TransactionTypeEnum.GEP,
    //     subType: SubTransactionTypeEnum.MANUAL_GEP
    //   }
    // });
    this.commonFacade.setTransactionConfig({
      transactionType: {
        type: TransactionTypeEnum.GEP,
        subType: SubTransactionTypeEnum.MANUAL_GEP
      }
    });
    this.toolbarFacade.setToolbarConfig(this.toolbarData);

    console.log(this.date);

    this.componentInit();
    this.regularFacade.loadRSODetails('RSO');

    this.facade.loadItem('GEPITEMTYPE');
    this.facade.loadMetal('METAL');
    // this.facade.metalPrice(
    //   this.date
    //  );

    this.facade
      .getUploadResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.facade.loadFileUploadList({
            id: this.gepItemId,
            customerId: this.customerId,
            txnType: TransactionTypeEnum.GEP
          });
        }
      });

    this.facade
      .getFileUploadListRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FileUploadLists[]) => {
        if (data.length !== 0) {
          this.fileIds = data;
          this.facade.loadFileDownloadUrl({
            id: data[data.length - 1].id,
            locationCode: null
          });
        }
      });

    this.facade
      .getFileDownloadUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.imageUrl = data;
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

    this.facade
      .getAvailableDiscountsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discountsList: DiscountsList[]) => {
        if (discountsList && discountsList.length > 1) {
          this.dialog.closeAll();
          this.discountsSelectionService
            .open(discountsList)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: DiscountsList) => {
              if (data) {
                this.facade.holdConfirm({
                  data: {
                    customerId: this.customerId,
                    employeeCode: this.gepForm.get('rsoName').value,
                    metalRateList: {
                      metalRates: this.ratePerUnit
                    },

                    remarks: this.remarks ? this.remarks : null,
                    totalQuantity: this.totalQty,
                    isRefund: true,
                    discountTypeSelected: data.discountType,
                    totalTax: this.currencyRoundOff(this.totalTax),
                    totalValue: this.currencyRoundOff(this.netValue),
                    finalValue: this.currencyRoundOff(this.totalValue),
                    totalWeight: this.weightRoundOff(this.totalWt)
                  },

                  id: this.gepItemId,
                  status: 'CONFIRMED',
                  subTxnType: 'MANUAL_GEP'
                });
              }
            });
        } else if (discountsList && discountsList.length < 2) {
          const discountTypeSelected =
            discountsList.length === 1 ? discountsList[0].discountType : null;
          this.facade.holdConfirm({
            data: {
              customerId: this.customerId,
              employeeCode: this.gepForm.get('rsoName').value,
              metalRateList: {
                metalRates: this.ratePerUnit
              },
              discountTypeSelected,
              remarks: this.remarks ? this.remarks : null,
              totalQuantity: this.totalQty,
              isRefund: true,
              totalTax: this.currencyRoundOff(this.totalTax),
              totalValue: this.currencyRoundOff(this.netValue),
              finalValue: this.currencyRoundOff(this.totalValue),
              totalWeight: this.weightRoundOff(this.totalWt)
            },

            id: this.gepItemId,
            status: 'CONFIRMED',
            subTxnType: 'MANUAL_GEP'
          });
        }
      });
    this.fileFacade
      .getDocumentsLst()
      .pipe(takeUntil(this.destroy$))
      .subscribe((docsList: any) => {
        if (docsList) {
          this.fileIds = docsList;
        }
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openId']) {
      console.log(this.openId);
      if (this.openId) {
        this.summaryBarRemarks$.next('');
        this.searchFormControl.reset();
        this.searchFormControl.disable();
        this.customerFacade.clearCustomerSearch();
        this.facade.resetGep();
        this.validationForm.reset();
        this.overlayNotification.close();

        this.customerId = null;
        this.customer = null;

        this.gepItemId = null;
        this.isProfileMatched = false;
        this.productGrid = [];
        this.gepForm.reset();
        this.gepForm.get('preDeclarationForm').setValue(false);
        this.docNo = null;
        this.gepItemId = this.openId;
        this.facade.loadGep({
          id: this.gepItemId,
          subTxnType: 'MANUAL_GEP'
        });
      }
    }
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
    // this.commonFacade
    //   .getTransactionConfig()

    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bussinessDay = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_CONFIG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.status === 'OPEN') {
          this.summaryBarRemarks$.next('');
          this.searchFormControl.reset();
          this.searchFormControl.disable();
          this.customerFacade.clearCustomerSearch();
          this.facade.resetGep();
          this.validationForm.reset();
          this.overlayNotification.close();

          this.customerId = null;
          this.customer = null;

          this.gepItemId = null;
          this.isProfileMatched = false;
          this.productGrid = [];
          this.gepForm.reset();
          this.gepForm.get('preDeclarationForm').setValue(false);

          this.docNo = null;
          this.openId = data.txnId;
          this.gepItemId = data.txnId;
          this.facade.loadGep({
            id: data.txnId,
            subTxnType: 'MANUAL_GEP'
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
    this.facade
      .getGepInit()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data && data.subTxnType === 'MANUAL_GEP') {
          this.detailsFlag = true;
          this.detailsFlag$.next(true);
          this.gepItemId = data.id;
          if (this.customerId) {
            this.facade.patchPso({
              data: {
                customerId: this.customerId
              },
              id: this.gepItemId,
              subTxnType: 'MANUAL_GEP'
            });
          }
          this.showSummaryBar();
          this.errorNotifications('Password accepted');
        }
      });
    this.facade
      .getgepItemResponse$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.tempId = data.id;
        }
      });
    this.facade
      .getGepDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          console.log(data, 'check');
          if (this.openId) {
            this.detailsFlag = true;
            this.docNo = data.docNo;

            // this.commonFacade.setOrderNumber({
            // this.cashMemoFacade.setOrderNumber({
            // this.commonFacade.setOrderNumber({
            //   orderNo: data.docNo,
            //   status: StatusTypesEnum.OPEN
            // });
            this.commonFacade.setGEPOrderNumber({
              orderNo: data.docNo,
              status: StatusTypesEnum.OPEN
            });
            if (data.customerId)
              this.customerFacade.loadSelectedCustomer(data.customerId, false);
            this.customerId = data.customerId;
            this.gepItemId = data.id;
            this.billDetails = data.manualBillDetails;
            this.ratePerUnit = data.metalRateList.metalRates;
            const rsoNames = this.rso.map(
              (rsoNameObj: { value: string; description: string }) => {
                return rsoNameObj.value;
              }
            );
            if (rsoNames.includes(data.employeeCode)) {
              this.gepForm.get('rsoName').setValue(data.employeeCode);
            }

            this.gepForm
              .get('preDeclarationForm')
              .setValue(data.isDeclarationFormSubmitted);
            this.onHoldtotalTax = data.totalTax;
            data.itemIdList.forEach(element => {
              console.log(element, 'itemId');
              this.facade.loadGepItem({
                id: this.gepItemId,
                itemId: element,

                subTxnType: 'MANUAL_GEP'
              });
            });
          }

          this.showSummaryBar();
        }
      });
    this.facade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });
    this.isLoading$ = this.facade.getIsLoaded();
    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.customerId = data.customerId;
          this.customer = data;
          this.customerPAN = data.custTaxNo;
          this.customerType = data.customerType;
          this.form60Submitted =
            data.customerDetails.data.form60AndIdProofSubmitted;
          this.gstNumber = data.instiTaxNo;
          this.idProof = data.customerDetails.data.idProof;
          if (this.customerId && this.detailsFlag) {
            this.facade.patchPso({
              data: {
                customerId: this.customerId
              },
              id: this.gepItemId,
              subTxnType: 'MANUAL_GEP'
            });
          }
        } else if (!this.openId) {
          this.facade.resetGep();
          this.validationForm.reset();
          this.customerId = null;
          this.customer = null;
          this.customerPAN = null;
          this.customerType = null;
          this.gepItemId = null;
          this.isProfileMatched = false;
          this.openId = null;
          this.gstNumber = null;
          this.idProof = null;
          // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
          // this.cashMemoFacade.setOrderNumber({ orderNo: 0, status: null });
          // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
          this.commonFacade.setGEPOrderNumber({ orderNo: 0, status: null });
          this.gepForm.get('rsoName').setValue('');
          this.gepForm.get('preDeclarationForm').setValue(false);

          this.overlayNotification.close();
          this.summaryBar.close();
          this.detailsFlag = false;
        }
        console.log(this.customerId);
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.FACTORY_BRAND_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandCode => {
        if (brandCode) {
          this.customerFacade.loadBrandDetails(brandCode);
        }
      });

    combineLatest([
      this.facade.getTotalValue().pipe(takeUntil(this.destroy$)),
      this.facade.getTotalTax().pipe(takeUntil(this.destroy$)),
      this.facade.getTotalWeight().pipe(takeUntil(this.destroy$)),
      this.facade.getTotalqty().pipe(takeUntil(this.destroy$)),
      this.facade.getNetValue().pipe(takeUntil(this.destroy$))
    ]).subscribe(([val, val1, val2, val3, val4]) => {
      this.totalValue = Math.round(val);
      console.log(val1, this.onHoldtotalTax);
      this.totalTax =
        this.onHoldtotalTax > val1
          ? Math.round(this.onHoldtotalTax * 100) / 100
          : Math.round(val1 * 100) / 100;
      this.totalWt = val2;
      this.totalQty = val3;
      this.netValue = val4;
      const totalValues: SetTotalProductValuesPayload = {
        productQty: this.totalQty,
        productWeight: this.totalWt,
        productDisc: 0,
        productAmt: 0,
        taxAmt: this.totalTax,
        totalAmt: this.totalValue,
        coinQty: 0,
        coinWeight: 0,
        coinDisc: 0,
        coinAmt: 0,
        finalAmt: this.totalValue,
        hallmarkCharges: 0,
        hallmarkDiscount: 0
      };
      // this.commonFacade.setTotalProductValues(totalValues);
      // this.cashMemoFacade.setTotalProductValues(totalValues);
      // this.commonFacade.setTotalProductValues(totalValues);
      this.commonFacade.setGEPTotalProductValues(totalValues);
    });

    this.gepForm.controls['rsoName'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedValue => {
        if (this.customerId) this.searchFormControl.enable();
        console.log(selectedValue);
        console.log(this.gepForm.controls['rsoName'].value);
        if (this.gepForm.controls['rsoName'].value) {
          this.facade.patchPso({
            data: {
              employeeCode: this.gepForm.get('rsoName').value
            },
            id: this.gepItemId,
            subTxnType: 'MANUAL_GEP'
          });
        }
      });

    this.gepForm.controls['preDeclarationForm'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedValue => {
        if (selectedValue === true && !this.customerId) {
          this.gepForm.get('preDeclarationForm').setValue(false);
          this.errorNotifications('Please Select Customer');
        } else if (
          selectedValue === true &&
          !this.gepForm.controls['rsoName'].value
        ) {
          this.gepForm.get('preDeclarationForm').setValue(false);
          this.errorNotifications('Please Select Rso');
        } else if (
          selectedValue === false &&
          this.isDeclarationFormMandatory === true &&
          this.customerId &&
          this.gepForm.controls['rsoName'].value
        ) {
          this.errorNotifications('Select Pre-Declaration Form');
        }

        if (this.customerId && this.gepForm.get('rsoName').value) {
          this.facade.patchPso({
            data: {
              isDeclarationFormSubmitted: this.gepForm.get('preDeclarationForm')
                .value
            },
            id: this.gepItemId,
            subTxnType: 'MANUAL_GEP'
          });
        }
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
      .getGepResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.overlayNotification.close();
          this.onHoldtotalTax = data.totalTax;
          const qty = data.totalQuantity;
          let i = 0;
          data.itemIdList.forEach(element => {
            console.log(element, 'itemId');
            this.facade.loadGepItem({
              id: this.gepItemId,
              itemId: element,
              status: 'price_update',
              subTxnType: 'MANUAL_GEP'
            });
            i = i + 1;
          });
          if (qty === i)
            this.errorNotifications(
              'Metal Price is Updated. Please Confirm/Hold Gep'
            );
        }
      });
    this.facade
      .getMetal()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.metalDetail = data;
        }
      });
    this.facade
      .getItem()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.itemDetail = data;
        }
      });

    this.facade
      .getHeaderDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) this.ratePerUnit = data.metalRateList.metalRates;
      });

    this.facade
      .getgepProductDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data);
        if (data) {
          this.productGrid = data;
          //temporary fix this.facade.loadGep()
        }
      });
    //this.facade.getGepDetails.sub()
    // this.facade
    //   .getGepDetails()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(data => {
    //     if (data) {
    //       if (this.updatedPrice) {
    //         data.itemIdList.forEach(element => {
    //           console.log(element, 'itemId');
    //           this.facade.loadGepItem({
    //             id: this.gepItemId,
    //             itemId: element,

    //             subTxnType: 'MANUAL_GEP'
    //           });
    //         });
    //         this.updatedPrice = false;
    //       }
    //     }
    //   });

    // this.facade
    //   .getGepResponse()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: any) => {
    //     if (data) {
    //       this.itemId = data.itemDetails.itemId;
    //       this.facade.loadGep({
    //         id: this.gepItemId,
    //         subTxnType: 'MANUAL_GEP'
    //       });
    //     }
    //   });

    this.facade
      .getHold()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event !== null) {
          if (event.status === 'CONFIRMED') {
            this.srcDocNo = event.docNo;
            this.cnNo = event.cnDocNo;
            this.showConfirmIssueSuccessNotification(this.srcDocNo);
          }
          // window.location.reload();
        }
      });

    this.facade
      .getUpdatedGep()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (
            data.preMeltingDetails.purity &&
            this.isDeclarationFormMandatory === true &&
            this.gepForm.get('preDeclarationForm').value !== true
          )
            this.errorNotifications('Select Pre-Declaration Form');
        }
      });

    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetail => {
        if (brandDetail) {
          this.maxAllowedAmount =
            brandDetail.panCardDetails.data.configurationAmountForGEP;
          this.panMandatoryForGEP =
            brandDetail.panCardDetails.data.isPanCardMandatoryforGEP;
        }
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
  updateGepNotification(successKey1: string, successKey2: string, docNo) {
    this.translate
      .get([successKey1, successKey2])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message:
              translatedMessages[successKey1] +
              docNo +
              translatedMessages[successKey2],
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.facade.resetGep();
              this.validationForm.reset();
              this.customerId = null;
              this.customer = null;
              this.gepItemId = null;
              this.isProfileMatched = false;
              this.openId = null;
              // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
              // this.cashMemoFacade.setOrderNumber({ orderNo: 0, status: null });
              // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
              this.commonFacade.setGEPOrderNumber({ orderNo: 0, status: null });
              this.gepForm.get('rsoName').setValue('');
              this.gepForm.get('preDeclarationForm').setValue(false);

              this.customerFacade.clearCustomerSearch();
              this.overlayNotification.close();
              this.summaryBar.close();
              this.detailsFlag = false;
            }
          });
      });
  }

  currencyRoundOff(amount) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }

  weightRoundOff(weight) {
    const roundedOffWeight = this.weightFormatterService.format(weight);
    return !!roundedOffWeight ? +roundedOffWeight : 0;
  }
  scanForm(event: any) {
    if (event === true) {
      this.scan = true;
    } else {
      this.scan = false;
    }
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
              this.validationForm.reset();
              this.customerId = null;
              this.customer = null;
              this.gepItemId = null;
              this.isProfileMatched = false;
              this.openId = null;
              // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
              // this.cashMemoFacade.setOrderNumber({ orderNo: 0, status: null });
              // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
              this.commonFacade.setGEPOrderNumber({ orderNo: 0, status: null });
              this.gepForm.get('rsoName').setValue('');
              this.gepForm.get('preDeclarationForm').setValue(false);

              this.customerFacade.clearCustomerSearch();
              this.overlayNotification.close();
              this.summaryBar.close();
              this.detailsFlag = false;
              this.detailsFlag$.next(false);
            }
          });
      });
  }
  validateBill(event) {
    this.billDetails = event;
    if (this.customerId !== null) {
      if (!this.gepItemId) {
        this.facade.loadGepInit({
          data: event,

          subTxnType: 'MANUAL_GEP'
        });
      } else {
        this.facade.patchPso({
          data: {
            customerId: this.customerId
          },
          id: this.gepItemId,
          subTxnType: 'MANUAL_GEP'
        });
      }
      // this.facade.loadGepInit({
      //   data: event,

      //   subTxnType: 'MANUAL_GEP'
      // });
    } else this.errorNotifications('Please Select Customer');
    // this.detailsFlag = true;
  }

  billDateChange(changeEvent) {
    // this.date = moment(changeEvent)
    //   .format()
    //   .replace(':', '%3A')
    //   .replace('+', '%2B');
    // this.manualCashMemoFacade.loadMaterialPrices({
    //   applicableDate: moment(changeEvent).format(),
    //   locationCode: this.locationCode
    // });
    // this.facade.metalPrice(this.date);
  }

  metalType(event) {
    console.log(event, 'checking new api');
    this.preMelt = event.preMeltingDetails;
    if (event.isSave === false) {
      this.measuredWeight = this.weight;
      this.measuredPurity = this.purity;
    } else if (event.isSave === true) {
      this.measuredWeight = event.weight;
      this.measuredPurity = event.purity;
      this.gepPatchId = event.id;
    }

    this.totalBreakUpValue(event);
  }

  totalBreakUpValue(event) {
    console.log(event);

    // if (!(!event.metal && !event.item)) {
    //   this.facade.updateProduct({
    //     metal: event.metal,
    //     item: event.item,
    //     id: event.id
    //   });
    // }
    if (event.item !== null && event.metal !== null && this.ratePerUnit) {
      if (this.measuredWeight <= 0) {
        this.errorNotifications(`Weight cannot be blank`);
      } else if (this.measuredPurity < this.purityKarat) {
        this.errorNotifications(
          `Please add purity greater than ${this.purityKarat}`
        );
      } else if (this.measuredPurity > 100) {
        this.errorNotifications(`Please add purity value between 1 and 100`);
      }
      if (
        this.measuredWeight &&
        this.measuredWeight > 0 &&
        this.measuredPurity &&
        this.measuredPurity >= this.purityKarat &&
        this.measuredPurity <= 100
      ) {
        const data = {
          itemType: event.item,
          measuredPurity: this.measuredPurity,
          measuredWeight: this.measuredWeight,
          metalType: event.metal,
          standardPrice: this.ratePerUnit,
          isSave: event.isSave
        };
        this.tempId = event.id;
        this.preMelt = event.preMeltingDetails;
        this.facade.totalBreakUp(data);
      }
    }
  }

  deleteEmit(event) {
    console.log(event);

    if (event) {
      // if (!this.itemId) {
      //   this.facade.getGepResponse().pipe(
      //     takeUntil(this.destroy$)
      //   ).subscribe((event: any) => {
      //     console.log(event)
      //     this.itemId = event.itemDetails.itemId;

      //   })

      // }
      if (event.isSave === true) {
        this.facade.delete({
          id: this.gepItemId,
          itemId: event.id,
          subTxnType: 'MANUAL_GEP'
        });
      } else {
        this.facade.deleteTempId(event.id);
      }
    }
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
        type: 'MANUAL_GEP',
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.remarks = event.remarks;

        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            // this.clear
            this.customerFacade.clearCustomerSearch();
            this.facade.resetGep();
            this.validationForm.reset();
            this.gepItemId = null;
            this.isProfileMatched = false;
            this.openId = null;
            this.overlayNotification.close();
            // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
            // this.cashMemoFacade.setOrderNumber({ orderNo: 0, status: null });
            // this.commonFacade.setOrderNumber({ orderNo: 0, status: null });
            this.commonFacade.setGEPOrderNumber({ orderNo: 0, status: null });
            this.customerId = null;
            this.customer = null;
            this.detailsFlag$.next(false);

            this.productGrid = [];
            this.gepForm.get('rsoName').setValue('');
            this.gepForm.get('preDeclarationForm').setValue(false);
            this.detailsFlag = false;
            this.summaryBar.close();

            break;
          }
          case SummaryBarEventType.CONFRIM: {
            if (!this.customerId) {
              this.errorNotifications('Please Select Customer');
            } else {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.customer
              );
              if (!isFormValidated) {
                this.customerService.open({
                  customerType: this.customerType,
                  customerId: this.customerId
                });
              } else if (!this.gepForm.get('rsoName').value) {
                this.errorNotifications('Please Select Rso');
              } else if (
                this.totalQty <= 3 &&
                this.isDeclarationFormMandatory === true &&
                this.gepForm.get('preDeclarationForm').value === false
              ) {
                this.errorNotifications('Select Pre-Declaration Form');
              }
              // else if (this.totalQty <= 3 && this.isPremeltDetails === false) {
              //   this.errorNotifications('Please add Premelting Details');
              // }
              else if (!this.totalValue) {
                this.errorNotifications('Please add items');
              } else if (
                this.gepForm.get('preDeclarationForm').value === true &&
                this.imageUrl === null
              ) {
                this.alertPopUpService.open({
                  type: AlertPopupTypeEnum.ERROR,
                  message: 'pw.gep.uploadFileErrorMsg'
                });
              } else if (!event.remarks) {
                this.errorNotifications('Please enter remarks.');
              } else if (
                this.customerId &&
                this.gepForm.get('rsoName').value &&
                // this.isPremeltDetails === true &&
                this.totalValue &&
                event.remarks &&
                (this.isDeclarationFormMandatory === false ||
                  (this.isDeclarationFormMandatory === true &&
                    this.gepForm.get('preDeclarationForm').value === true))
              ) {
                if (
                  this.totalQty !== 0 &&
                  this.panMandatoryForGEP &&
                  this.totalValue > this.maxAllowedAmount &&
                  !this.isProfileMatched
                  // ((this.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL &&
                  //   !this.form60Submitted) ||
                  //   (this.customerType === CUSTOMER_TYPE_ENUM.ONE_TIME &&
                  //     !this.form60Submitted &&
                  //     !this.customerPAN) ||
                  //   (this.customerType === CUSTOMER_TYPE_ENUM.INSTITUTIONAL &&
                  //     !this.gstNumber &&
                  //     !this.customerPAN) ||
                  //   (this.customerType === CUSTOMER_TYPE_ENUM.REGULAR &&
                  //     !this.customerPAN &&
                  //     !this.idProof))
                ) {
                  // this.openPanCardPopUp();
                  this.showPanFormVerifyPopup();
                } else {
                  const requestPayload: DiscountListPayload = {
                    id: this.gepItemId,
                    subTxnType: 'MANUAL_GEP',
                    txnType: TransactionTypeEnum.GEP
                  };
                  this.facade.loadAvailableDiscountsList(requestPayload);
                }
              }
            }
            break;
          }
          case SummaryBarEventType.PRINT: {
            // this.print();
            break;
          }
        }
      });
  }

  openPanCardPopUp() {
    this.panCardServiceAbstraction.open(this.customerId, this.customerType);
  }

  showPanFormVerifyPopup() {
    this.panFormVerifyPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        id: this.gepItemId,
        customerId: Number(this.customerId),
        customerType: this.customerType,
        txnType: TransactionTypeEnum.GEP
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((dailogResponse: boolean) => {
        this.isProfileMatched = dailogResponse;
      });
  }

  patchGridItem(event) {
    console.log(event);
    this.preMelt = event.preMeltingDetails;
    if (
      event.preMeltingDetails &&
      event.preMeltingDetails.purity &&
      event.isPreMelt
    ) {
      // this.isPremeltDetails = true;
      this.preMelt = event.preMeltingDetails;
      this.facade.updateGep({
        data: {
          measuredPurity: event.measuredPurity,
          measuredWeight: event.measuredWeight,
          preMeltingDetails: event.preMeltingDetails,
          itemType: event.item,
          metalType: event.metal,
          unitValue: event.unitValue,
          karat: event.karat
        },
        errorData: this.gepSuccess,
        id: this.gepItemId,
        itemId: event.id,
        subTxnType: 'MANUAL_GEP'
      });
    } else if (event.isSave) {
      // if (event.measuredWeight)
      //   this.facade.updateWeight({
      //     id: event.id,
      //     weight: event.measuredWeight
      //   });
      // if (event.measuredPurity)
      //   this.facade.updatePurity({
      //     id: event.id,
      //     purity: event.measuredPurity
      //   });
      this.measuredWeight = event.measuredWeight;
      this.measuredPurity = event.measuredPurity;
      this.gepPatchId = event.id;
      this.totalBreakUpValue(event);
    }

    // if (event.isSave) {
    //   this.facade.updateGep({
    //     data: {
    //       measuredPurity: event.measuredPurity,
    //       measuredWeight: event.measuredWeight,
    //       preMeltingDetails: event.preMeltingDetails,
    //       itemType:event.item,
    //       metalType:event.metal,
    //       unitValue:event.unitValue,
    //       karat:event.karat

    //     },
    //     errorData: this.gepSuccess,
    //     id: this.gepItemId,
    //     itemId: event.id,
    //     subTxnType: 'NEW_GEP'
    //   });
    // } else {
    //   this.tempId = event.id;
    // }
    // this.gepSuccess = null;
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
            printType: printTypesEnum.GEP_PRINTS,
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            transacionId: this.gepItemId,
            reprint: false,
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

  ngAfterViewInit() {
    console.log(
      'mismatch' +
        this.barcodeService.GepBarCodeWeight +
        '' +
        this.barcodeService.GepBarCodePurity
    );
    if (this.detailsFlag) {
      fromEvent(this.searchBox.nativeElement, 'input')
        .pipe(debounceTime(1000), takeUntil(this.destroy$))
        .subscribe((event: any) => {
          console.log(event);
          const searchValue = this.searchFormControl.value;
          console.log(searchValue);
          if (searchValue !== '') {
            if (
              searchValue !==
              this.barcodeService.GepBarCodeWeight +
                this.barcodeService.GepBarCodePurity
            ) {
              console.log(
                'mismatch' +
                  this.barcodeService.GepBarCodeWeight +
                  '' +
                  this.barcodeService.GepBarCodePurity +
                  searchValue
              );
            } else {
              console.log('tru');
            }
            // }
          } else {
            this.clearSearch();
          }
        });
    }
  }

  @HostListener('keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    console.log('ff' + event.key + 'gh');
    this.barcodeService.gepBarCodeReader(event);
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
  oldValue(event) {
    console.log(event);
    this.gepSuccess = event;
  }
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else if (error.code === ErrorEnums.ERR_CUST_001) {
      this.customerService.open({
        customerType: this.customerType,
        customerId: this.customerId
      });
    }
    if (error.code === 'ERR-SALE-008' || error.code === 'ERR-SALE-045') {
      this.facade.updatePrice({
        id: this.gepItemId,
        subTxnType: 'MANUAL_GEP'
      });
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

  checkPreDeclarationForm(event: boolean) {
    this.gepForm.controls['preDeclarationForm'].setValue(event);
    if (this.gepForm.get('preDeclarationForm').value === false) {
      this.clear();
    }
  }

  upload(event) {
    console.log(event);
    this.success = true;

    this.overlayNotification.close();
    const fileList: FileList = event;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      console.log(fileList.item(0));

      formData.append('file', fileList.item(0));
      console.log(formData);

      this.facade.uploadForm({
        customerId: this.customerId,
        id: this.gepItemId,
        file: formData,
        txnType: TransactionTypeEnum.GEP
      });
    }
  }
  add(event?: any) {
    this.facade
      .getGepInit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && data.subTxnType === 'MANUAL_GEP') {
          this.gepItemId = data.id;

          // this.commonFacade.setOrderNumber({
          //   // this.cashMemoFacade.setOrderNumber({
          //   orderNo: data.docNo,
          //   status: StatusTypesEnum.OPEN
          // });
          // this.commonFacade.setOrderNumber({
          //   orderNo: data.docNo,
          //   status: StatusTypesEnum.OPEN
          // });
          this.commonFacade.setGEPOrderNumber({
            orderNo: 0,
            status: StatusTypesEnum.OPEN
          });
        }
      });
    if (!this.customerId) {
      this.errorNotifications('Please Select Customer');
    } else if (!this.gepForm.get('rsoName').value) {
      this.errorNotifications('Please Select Rso');
    } else if (
      this.totalQty < 3 &&
      this.isDeclarationFormMandatory === true &&
      this.gepForm.get('preDeclarationForm').value === false
    ) {
      this.errorNotifications('Select Pre-Declaration Form');
    } // else if (this.totalQty === 0) {
    //   this.isPremeltDetails = true;
    // } else if (
    //   (this.totalQty < 3 || this.totalQty >= 3) &&
    //   this.isPremeltDetails === false
    // ) {
    //   this.errorNotifications('Please add Premelting Details');
    // }
    else if (this.totalQty >= 3) {
      this.errorNotifications('Max items allowed in transaction is 3');
    }

    console.log(this.validationForm);
    if (event === 'search') {
      if (this.searchFormControl.value) {
        this.weightPurity = this.searchFormControl.value;

        if (
          this.barcodeService.GepBarCodeWeight &&
          this.barcodeService.GepBarCodePurity
        ) {
          this.weight = Number(this.barcodeService.GepBarCodeWeight);
          this.purity = Number(this.barcodeService.GepBarCodePurity);
        } else if (this.searchFormControl.value) {
          this.weight = Number(
            this.weightPurity.substring(0, this.weightPurity.indexOf(' '))
          );
          this.purity = Number(
            this.weightPurity.substring(this.weightPurity.indexOf(' ') + 1)
          );
        }
      }
    } else {
      this.weight = this.validationForm.get('weight').value;
      this.purity = this.validationForm.get('purity').value;
      console.log(this.purity, this.purityKarat);
    }
    if (this.weight <= 0) {
      this.errorNotifications(`Weight cannot be blank`);
    } else if (this.purity < this.purityKarat) {
      this.errorNotifications(
        `Please add purity greater than ${this.purityKarat}`
      );
    } else if (this.purity > 100) {
      this.errorNotifications(`Please add purity value between 1 and 100`);
    }
    if (
      this.customerId &&
      this.gepForm.get('rsoName').value &&
      this.weight &&
      this.weight > 0 &&
      this.purity &&
      this.purity >= this.purityKarat &&
      this.purity <= 100 &&
      this.totalQty < 3 &&
      // this.isPremeltDetails === true &&
      (this.isDeclarationFormMandatory === false ||
        (this.isDeclarationFormMandatory === true &&
          this.gepForm.get('preDeclarationForm').value === true))
    ) {
      /* this.facade.addProduct({
        weight: this.weight,
        purity: this.purity,
        metalType: MetalTypeEnum.GOLD,
        itemType: 'JEWELLERY'
      }); */
      const data = {
        itemType: 'JEWELLERY',
        measuredPurity: this.purity,
        measuredWeight: this.weight,
        metalType: MetalTypeEnum.GOLD,
        standardPrice: this.ratePerUnit,
        isSave: false
      };

      this.facade.totalBreakUp(data);
      this.preMelt = null;
      // this.isPremeltDetails = false;
    }
    this.validationForm.reset();
    this.validationForm.get('weight').setValue('');
    this.validationForm.get('purity').setValue('');
    this.barcodeService.clearGepBarcodeData();
    this.clearSearch();
  }

  clearSearch() {
    this.searchFormControl.reset();
    // this.conversionFacade.clearSearchedRequests();
    // this.loadRequests(0);
  }

  clear() {
    this.fileIds.forEach(element => {
      this.fileFacade.deleteDocument(element.id);
    });
    this.imageUrl = null;
  }

  onRSONameChange(event: any) {
    console.log('On RSO Name Change :', event);
    if (event) {
      this.facade.patchPso({
        data: {
          employeeCode: event
        },
        id: this.gepItemId,
        subTxnType: 'MANUAL_GEP'
      });
    }
  }

  // select RSO Name from Popup
  openRSOSelectionPopup() {
    this.dialog.closeAll();
    const rsoNamesForSelection = this.rso.map(rso => ({
      id: rso.value,
      description: rso.description + ' - ' + rso.value
    }));
    this.selectionDialog
      .open({
        title: this.selectRSONameLabel,
        placeholder: this.searchByRSOCodeLabel,
        options: rsoNamesForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.onRSONameChange(selectedOption.id);
          this.gepForm.get('rsoName').patchValue(selectedOption.id);
        }
      });
  }

  // display rso name from rso code
  getRsoNameFromCode(code: string) {
    if (this.rso.length !== 0) {
      for (const rso of this.rso) {
        if (rso.value === code) return rso.description;
      }
    }
    return code;
  }

  ngOnDestroy(): void {
    this.customerFacade.clearCustomerSearch();
    this.commonFacade.setFileUploadVisible(false);

    this.overlayNotification.close();

    this.customerId = null;
    this.customer = null;
    this.isProfileMatched = false;
    this.gepForm.get('rsoName').setValue('');
    this.gepForm.get('preDeclarationForm').setValue(false);
    this.detailsFlag = false;
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.facade.resetGep();
    this.validationForm.reset();
    // this.commonFacade.clearTransactionConfig();
    this.commonFacade.clearTransactionConfig();

    this.detailsFlag$.next(false);
    this.summaryBarRemarks$.next('');
    this.printingService.resetPrint();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
