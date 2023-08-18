import { ActivatedRoute } from '@angular/router';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { BarcodeReaderService } from '@poss-web/shared/util-barcode-reader';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  Input,
  OnChanges,
  SimpleChanges,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import {
  GEPProductDetails,
  OverlayNotificationServiceAbstraction,
  SummaryBarServiceAbstraction,
  SummaryBarEventRef,
  SummaryBarEventType,
  OverlayNotificationType,
  CustomErrors,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  StatusTypesEnum,
  SummaryBarType,
  ToolbarConfig,
  LocationSettingAttributesEnum,
  printTypesEnum,
  printDocTypeEnum,
  MetalTypeEnum,
  SelectDropDownOption,
  printTransactionTypesEnum,
  printFileTypeEnum,
  SetTotalProductValuesPayload,
  CommomStateAttributeTypeEnum,
  FileUploadLists,
  totalBreakUp,
  PrintingServiceAbstraction,
  PostTransactionConfirmationActionsServiceAbstraction,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  InvoiceDeliveryTypes,
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
import * as moment from 'moment';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable, Subject, combineLatest, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { GepFacade } from '@poss-web/poss/gep/data-access-gep';
import { TranslateService } from '@ngx-translate/core';
import { CustomerNotSelectedPopupComponent } from '@poss-web/poss/gep/ui-manual-gep';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import {
  WeightFormatterService,
  CurrencyFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';

import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
@Component({
  selector: 'poss-web-new-gep',
  templateUrl: './new-gep.component.html',
  styleUrls: ['./new-gep.component.scss'],
  providers: [BarcodeReaderService]
})
export class NewGepComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  onHoldId: any;
  @Input() onHoldTime;
  openId: any;
  docNo: any;
  rso: any;
  metalDetail: any;
  itemDetail: any;
  customerId = null;
  customer: Customers = null;
  locationCode$: string;
  gepResponse$: Observable<any>;
  gepItemId: any;
  metalPrice$: Observable<any>;
  ratePerUnit: any;
  tempId: string = null;
  measuredWeight: any;
  measuredPurity: any;
  totalTax: number;
  date: any;
  currentDate = moment();
  weight: number;
  purity: number;
  printErrorText: string;
  totalValue: number;
  netValue: number;
  totalQty: number;
  totalWt: number;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchFormControl = new FormControl();
  summaryBarRemarks$ = new Subject<string>();
  success: boolean;
  gepForm = new FormGroup({
    rsoName: new FormControl(''),

    preDeclarationForm: new FormControl(false)
  });
  weightPurity: string;
  totalBreakUp: totalBreakUp = null;
  destroy$: Subject<null> = new Subject<null>();

  hasNotification: boolean;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  srcDocNo: any;
  isLoading$: Observable<boolean>;

  productGrid: GEPProductDetails[] = [];
  preMelt: any;
  updatedPrice = false;
  gepSuccess: GEPProductDetails;
  addButton = false;
  onHoldtotalTax: number;
  isExpired: boolean;
  holdMetalRate: any;

  @Output() toolbarConfig = new EventEmitter<ToolbarConfig>();

  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.GEP,
    subTxnType: SubTransactionTypeEnum.NEW_GEP,
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };
  currencyCode: string;
  holdTimeInMinutes: number;
  abHoldTimeInMinutes: number;
  karatageAccepted: any;
  isDeclarationFormMandatory: any;
  // isPremeltDetails = true;
  fileIds: any;
  validationForm: FormGroup;
  scan: boolean = true;
  purityKarat: number;
  cnNo: any;
  gepPatchId: any;
  imageUrl: string;
  fileName = 'View Pre-Declaration Form';
  previewHeader = 'Pre-Declaration Form';
  isTransactionSuccess = false;
  // rsoName: string;
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

  GEP_ADD_EDIT_SUBMENU = 'Customer Transaction Status-GEP Add/Edit Submenu';

  constructor(
    public dialog: MatDialog,
    form: FormBuilder,
    public printingService: PrintingServiceAbstraction,
    private fileFacade: FileFacade,
    private regularFacade: ProductFacade,
    private facade: GepFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private translate: TranslateService,
    private barcodeService: BarcodeReaderService,
    private customerFacade: CustomerFacade,
    private toolbarFacade: ToolbarFacade,
    private commonFacade: CommonFacade,
    private fieldValidator: FieldValidatorsService,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private locationSettingsFacade: LocationSettingsFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private panFormVerifyPopupService: PanFormVerifyPopupServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private discountsSelectionService: DiscountsSelectionServiceAbstraction,
    private panCardServiceAbstraction: PanCardPopupAbstraction,
    private selectionDialog: SelectionDialogService,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.searchFormControl.enable();
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GEP_KARAT_ACCEPTED_FOR_GEP
      )
      .subscribe(configDetails => {
        if (configDetails && configDetails !== null) {
          this.karatageAccepted = configDetails;
          this.purityKarat = (Number(configDetails) * 100) / 24;
        }
      });

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
      scan: new FormControl(true)
    });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.barcodeService.gepInput
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.searchFormControl.setValue(
          this.barcodeService.GepBarCodeWeight +
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
          this.holdTimeInMinutes = Number(configDetails);
          this.commonFacade.setConfigHoldTime(this.holdTimeInMinutes);
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GEP_IS_PRE_MELTING_DETAILS_MANDATORY
      )
      .subscribe(configDetails => {
        if (configDetails && configDetails !== null) {
          this.isDeclarationFormMandatory = configDetails === 'true';
        }
      });
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: true,
      transactionType: {
        type: TransactionTypeEnum.GEP,
        subType: SubTransactionTypeEnum.NEW_GEP
      }
    });
    this.toolbarConfig.emit(this.toolbarData);
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.facade.resetGep();
    this.resetValidationForm();
    this.overlayNotification.close();
    this.summaryBar.close();

    this.showSummaryBar();
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

    this.facade.loadItem('GEPITEMTYPE');
    this.facade.loadMetal('METAL');
    this.facade.metalPrice(null);

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
        if (data.length !== 0)
          this.facade.loadFileDownloadUrl({
            id: data[data.length - 1].id,
            locationCode: null
          });
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
                    isRefund: true,
                    discountTypeSelected: data.discountType,
                    remarks: this.remarks ? this.remarks : null,
                    totalQuantity: this.totalQty,
                    totalTax: this.currencyRoundOff(this.totalTax),
                    totalValue: this.currencyRoundOff(this.netValue),
                    finalValue: this.currencyRoundOff(this.totalValue),
                    totalWeight: this.weightRoundOff(this.totalWt)
                  },

                  id: this.gepItemId,
                  status: 'CONFIRMED',
                  subTxnType: 'NEW_GEP'
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
              isRefund: true,
              discountTypeSelected,
              remarks: this.remarks ? this.remarks : null,
              totalQuantity: this.totalQty,
              totalTax: this.currencyRoundOff(this.totalTax),
              totalValue: this.currencyRoundOff(this.netValue),
              finalValue: this.currencyRoundOff(this.totalValue),
              totalWeight: this.weightRoundOff(this.totalWt)
            },

            id: this.gepItemId,
            status: 'CONFIRMED',
            subTxnType: 'NEW_GEP'
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
    this.facade
      .getIsCustomerUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isCustomerUpdate) => {
        if (isCustomerUpdate && this.gepItemId) {
          this.facade.updatePrice({
            id: this.gepItemId,
            subTxnType: 'NEW_GEP'
          });
        }
      })
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  expireTime(time) {
    if (time) {
      const momentTime = moment(time);
      const currentTime = moment();
      const leftOverMinutes = moment().diff(moment(momentTime), 'minutes');

      if (leftOverMinutes <= this.holdTimeInMinutes) {
        return currentTime
          .add(this.holdTimeInMinutes - leftOverMinutes, 'minutes')
          .format('hh:mm A');
      } else {
        return 'Expired';
      }
    } else {
      return null;
    }
  }
  scanForm(event: any) {
    if (event === true) {
      this.scan = true;
      this.searchFormControl.enable();
    } else {
      this.scan = false;
      this.searchFormControl.disable();
    }
    if(this.searchFormControl.value){
      this.clearSearch();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['onHoldId'] && changes['onHoldId'].currentValue) {
      if (this.onHoldId) {
        this.clearGep('open');
        this.gepItemId = this.onHoldId;
        this.facade.loadGep({
          id: this.gepItemId,
          subTxnType: 'NEW_GEP'
        });
      }
    }

    if (changes['onHoldTime'] && changes['onHoldTime'].currentValue) {
    }
    if (changes['openId'] && changes['openId'].currentValue) {
      this.clearGep('open');

      this.gepItemId = this.openId;
      this.facade.updatePrice({
        id: this.openId,
        subTxnType: 'NEW_GEP'
      });
    }
  }
  openExpiredDialog() {
    const dialogRef = this.dialog.open(CustomerNotSelectedPopupComponent, {
      data: 'expired',
      width: '500px',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.facade.updatePrice({
          id: this.gepItemId,
          subTxnType: 'NEW_GEP'
        });
      }
    });
  }

  componentInit() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_CONFIG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.status === 'HOLD') {
          this.clearGep('open');
          this.gepItemId = data.txnId;
          this.onHoldId = data.txnId;
          this.facade.loadGep({
            id: data.txnId,
            subTxnType: 'NEW_GEP'
          });
        } else if (data.status === 'OPEN') {
          this.clearGep('open');
          this.openId = data.txnId;
          this.gepItemId = data.txnId;
          this.facade.updatePrice({
            id: data.txnId,
            subTxnType: 'NEW_GEP'
          });
        }
      });
    this.facade
      .getgepProductDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.productGrid = data;
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
      this.commonFacade.setGEPTotalProductValues(totalValues);
    });

    combineLatest([
      this.facade.getOnHoldExpiredTimeList().pipe(takeUntil(this.destroy$)),
      this.commonFacade
        .getCommonFacadeAttributes(
          CommomStateAttributeTypeEnum.GEP,
          CommomStateAttributeNameEnum.STANDARD_METAL_PRICE_DETAILS
        )
        .pipe(takeUntil(this.destroy$))
    ]).subscribe(([val, val1]) => {
      if (val) {
        if (this.holdMetalRate && val1 !== this.holdMetalRate) {
          this.holdMetalRate = val1;
          this.ratePerUnit = val1;
          this.openExpiredDialog();
        }
      }

      if (this.ratePerUnit && val1 !== this.ratePerUnit) {
        this.ratePerUnit = val1;
        this.openExpiredDialog();
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
              exchangeDetails: {
                type: 'EXCHANGE_DETAILS_CONFIG',
                data: {
                  isDeclarationFormSubmitted: this.gepForm.get(
                    'preDeclarationForm'
                  ).value
                }
              }
            },
            id: this.gepItemId,
            subTxnType: 'NEW_GEP'
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
      .getMetal()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.metalDetail = data;
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
      .getItem()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.itemDetail = data;
        }
      });

    this.facade
      .getGepInit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && data.subTxnType === 'NEW_GEP') {
          this.gepItemId = data.id;
          this.commonFacade.setTransactionTD(this.gepItemId);
          this.commonFacade.setGEPOrderNumber({
            orderNo: data.docNo,
            status: data.status
          });
        }
        if (this.gepItemId) {
          if (this.customerId) {
            this.facade.patchPso({
              data: {
                customerId: this.customerId
              },
              id: this.gepItemId,
              subTxnType: 'NEW_GEP',
              isCustomerUpdate: true
            });
          }
          this.gepForm.markAllAsTouched();
          this.loadHoldValues();
          this.loadOpenValues();
        }
      });

    this.facade
      .getdeleteGep()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.loadOpenValues();
          this.loadHoldValues();

          this.clearGep('delete');
        }
      });

    this.facade
      .getMetalPrice()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) this.ratePerUnit = data;
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
          if (!this.onHoldId && !this.openId && this.customerId) {
            if (!this.gepItemId) {
              const gepData = {
                data: {},
                subTxnType: 'NEW_GEP'
              };
              this.facade.loadGepInit(gepData);
            } else {
              this.facade.patchPso({
                data: {
                  customerId: this.customerId
                },
                id: this.gepItemId,
                subTxnType: 'NEW_GEP'
              });
            }
          }
        } else {
          this.customerId = null;
          this.customer = null;
          this.customerPAN = null;
          this.customerType = null;
          this.gstNumber = null;
          this.idProof = null;
          //this.commonFacade.setGEPOrderNumber({ orderNo: 0, status: null });
        }
        // if (this.onHoldId && !this.customerId) {
        //   this.facade.resetGep();
        //   this.validationForm.reset();
        //   this.summaryBar.close();
        // this.gepForm.get('rsoName').setValue('');
        // this.gepForm.get('preDeclarationForm').setValue(false);

        //   this.overlayNotification.close();

        //   this.showSummaryBar();
        // }
      });

    this.facade
      .getHold()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event !== null) {
          if (event.status === 'HOLD') {
            const successKey1 = 'pw.gep.holdmess1';
            const successKey2 = '.';
            this.summaryBarRemarks$.next(event?.remarks);
            this.updateGepNotification(successKey1, successKey2, event.docNo);
          } else if (event.status === 'CONFIRMED') {
            this.srcDocNo = event.docNo;
            this.cnNo = event.cnDocNo;
            this.isTransactionSuccess = true;
            this.showConfirmIssueSuccessNotification(this.srcDocNo);
          }
          this.loadHoldValues();
          this.loadOpenValues();
        }
      });

    this.facade
      .getTotalBreakUp()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
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
              subTxnType: 'NEW_GEP',
              id: this.gepItemId,
              tempId: this.tempId
            });
          } else if (data.data.isSave === true) {
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
              subTxnType: 'NEW_GEP'
            });

            this.gepSuccess = null;
          }
        }
      });

    this.facade
      .getGepResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.docNo = data.docNo;
          if (this.openId) {
            this.commonFacade.setGEPOrderNumber({
              orderNo: data.docNo,
              status: data.status
            });
            if (data.customerId)
              this.customerFacade.loadSelectedCustomer(data.customerId, false);

            this.customerId = data.customerId;

            this.gepItemId = data.id;

            this.ratePerUnit = data.metalRateList.metalRates;
            const rsoNames = this.rso.map(
              (rsoNameObj: { value: string; description: string }) => {
                return rsoNameObj.value;
              }
            );
            if (rsoNames.includes(data.employeeCode)) {
              this.gepForm.get('rsoName').setValue(data.employeeCode);
            }

            if (data && data.exchangeDetails && data.exchangeDetails.data) {
              this.gepForm
                .get('preDeclarationForm')
                .setValue(data.exchangeDetails.data.isDeclarationFormSubmitted);
              if (data.exchangeDetails.data.isDeclarationFormSubmitted) {
                this.commonFacade.setFileUploadVisible(true);
              } else {
                this.commonFacade.setFileUploadVisible(false);
              }
            }
            this.gepForm.updateValueAndValidity();
            this.onHoldtotalTax = data.totalTax;
            data.itemIdList.forEach(element => {
              this.facade.loadGepItem({
                id: this.gepItemId,
                itemId: element,

                subTxnType: 'NEW_GEP'
              });
            });
          } else {
            this.overlayNotification.close();
            const rsoNames = this.rso.map(
              (rsoNameObj: { value: string; description: string }) => {
                return rsoNameObj.value;
              }
            );
            if (rsoNames.includes(data.employeeCode)) {
              this.gepForm.get('rsoName').setValue(data.employeeCode);
            }

            if (data && data.exchangeDetails && data.exchangeDetails.data) {
              this.gepForm
                .get('preDeclarationForm')
                .setValue(data.exchangeDetails.data.isDeclarationFormSubmitted);
              if (data.exchangeDetails.data.isDeclarationFormSubmitted) {
                this.commonFacade.setFileUploadVisible(true);
              } else {
                this.commonFacade.setFileUploadVisible(false);
              }
            }
            this.gepForm.updateValueAndValidity();
            this.onHoldtotalTax = data.totalTax;

            let i = 0;
            data.itemIdList.forEach(element => {
              this.facade.loadGepItem({
                id: this.gepItemId,
                itemId: element,
                status: 'price_update',
                subTxnType: 'NEW_GEP'
              });
              i = i + 1;
            });
          }
        }
      });

    this.facade
      .getGepDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.docNo = data.docNo;
          this.commonFacade.setTransactionConfig({
            transactionType: {
              type: TransactionTypeEnum.GEP,
              subType: SubTransactionTypeEnum.NEW_GEP
            }
          });
          const rsoNames = this.rso.map(
            (rsoNameObj: { value: string; description: string }) => {
              return rsoNameObj.value;
            }
          );
          if (rsoNames.includes(data.employeeCode)) {
            this.gepForm.get('rsoName').setValue(data.employeeCode);
          }
          if (this.onHoldId) {
            this.docNo = data.docNo;
            if (this.expireTime(data.lastHoldTime) === 'Expired') {
              const goldRateChangeMsg =
                'Hold time expired. GEP will be updated with latest price';
              this.errorNotifications(goldRateChangeMsg);

              this.facade.updatePrice({
                id: this.onHoldId,
                subTxnType: 'NEW_GEP'
              });
            }

            this.customerFacade.loadSelectedCustomer(data.customerId, false);
            this.customerId = data.customerId;
            this.gepItemId = data.id;

            this.holdMetalRate = data.metalRateList.metalRates;
            const rsoNames = this.rso.map(
              (rsoNameObj: { value: string; description: string }) => {
                return rsoNameObj.value;
              }
            );
            if (rsoNames.includes(data.employeeCode)) {
              this.gepForm.get('rsoName').setValue(data.employeeCode);
            }

            if (data && data.exchangeDetails && data.exchangeDetails.data) {
              this.gepForm
                .get('preDeclarationForm')
                .setValue(data.exchangeDetails.data.isDeclarationFormSubmitted);
            }
            if (
              data &&
              data.exchangeDetails &&
              data.exchangeDetails.data &&
              data.exchangeDetails.data.isDeclarationFormSubmitted
            ) {
              this.commonFacade.setFileUploadVisible(true);
            } else {
              this.commonFacade.setFileUploadVisible(false);
            }
            this.onHoldtotalTax = data.totalTax;
            data.itemIdList.forEach(element => {
              this.facade.loadGepItem({
                id: this.gepItemId,
                itemId: element,

                subTxnType: 'NEW_GEP'
              });
            });
          }
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
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onRSONameChange(event: any) {
    if (event) {
      this.facade.patchPso({
        data: {
          employeeCode: event
        },
        id: this.gepItemId,
        subTxnType: 'NEW_GEP'
      });
    }
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
              this.loadHoldValues();
              this.summaryBar.close();
              this.clearGep();
              this.showSummaryBar();
            }
          });
      });
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
              this.summaryBar.close();
              this.clearGep();
              this.showSummaryBar();
              this.commonFacade.setTransactionConfig({
                isPaymentEditable: true,
                transactionType: {
                  type: TransactionTypeEnum.GEP,
                  subType: SubTransactionTypeEnum.NEW_GEP
                }
              });
            }
          });
      });
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.searchFormControl.value;
        if (searchValue !== '') {
          if (
            searchValue !==
            this.barcodeService.GepBarCodeWeight +
              this.barcodeService.GepBarCodePurity
          ) {
          } else if (
            searchValue ===
            this.barcodeService.GepBarCodeWeight +
              this.barcodeService.GepBarCodePurity
          ) {
            this.add('search');
          }
        } else {
          this.clearSearch();
        }
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

  metalType(event) {
    if (event.isSave === false) {
      this.measuredWeight = this.weight;
      this.measuredPurity = this.purity;
    } else if (event.isSave === true) {
      this.measuredWeight = event.weight;
      this.measuredPurity = event.purity;
      this.gepPatchId = event.id;
    }
    this.preMelt = event.preMeltingDetails;
    this.totalBreakUpValue(event);
  }

  totalBreakUpValue(event) {
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
    if (event) {
      if (event.isSave === true) {
        this.facade.delete({
          id: this.gepItemId,
          itemId: event.id,
          subTxnType: 'NEW_GEP'
        });
      } else {
        this.facade.deleteTempId(event.id);
      }
    }
  }

  showSummaryBar() {
    this.summaryBar
      .open(SummaryBarType.GEP, {
        type: 'NEW_GEP',
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.remarks = event.remarks;
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            this.clearGep();

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
              } //else if (this.totalQty <= 3 && this.isPremeltDetails === false) {
              //this.errorNotifications('Please add Premelting Details');
              //}
              else if (!this.totalValue) {
                this.errorNotifications('Please add items');
              } else if (
                this.gepForm.get('preDeclarationForm').value === true &&
                this.fileIds.length === 0
              ) {
                this.alertPopupService.open({
                  type: AlertPopupTypeEnum.ERROR,
                  message: 'pw.gep.uploadFileErrorMsg'
                });
              } else if (
                this.customerId &&
                this.gepForm.get('rsoName').value &&
                //this.isPremeltDetails === true &&
                this.totalValue &&
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
                    subTxnType: 'NEW_GEP',
                    txnType: TransactionTypeEnum.GEP
                  };
                  this.facade.loadAvailableDiscountsList(requestPayload);
                }
              }
            }
            break;
          }
          case SummaryBarEventType.HOLD: {
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
              } else if (
                  this.customerId &&
                  this.gepForm.get('rsoName').value &&
                  //this.isPremeltDetails === true &&
                  this.totalValue
                )
                  this.facade.holdConfirm({
                    data: {
                      customerId: this.customerId,
                      employeeCode: this.gepForm.get('rsoName').value,
                      metalRateList: {
                        metalRates: this.ratePerUnit
                      },

                      remarks: event.remarks ? event.remarks : null,
                      isRefund: true,
                      totalQuantity: this.totalQty,
                      totalTax: this.currencyRoundOff(this.totalTax),
                      totalValue: this.currencyRoundOff(this.netValue),
                      finalValue: this.currencyRoundOff(this.totalValue),
                      totalWeight: this.weightRoundOff(this.totalWt)
                    },

                    id: this.gepItemId,
                    status: 'HOLD',
                    subTxnType: 'NEW_GEP'
                  });
                else if (!this.totalValue)
                  this.errorNotifications('Please add items');
                else if (!this.customerId)
                  this.errorNotifications('Please enter customer');
                else if (!this.gepForm.get('rsoName').value) {
                  this.errorNotifications('Please select rso name');
                  this.gepForm.markAllAsTouched();
                }
                // else if (this.totalQty <= 3 && this.isPremeltDetails === false) {
                //   this.errorNotifications('Please add Premelting Details');
                // }
            }
            break;
          }
          case SummaryBarEventType.PRINT: {
            break;
          }
          case SummaryBarEventType.DELETE: {
            if (this.gepItemId)
              this.facade.deleteGep({
                id: this.gepItemId,

                subTxnType: 'NEW_GEP'
              });
            break;
          }
        }
      });
  }

  @HostListener('keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    this.barcodeService.gepBarCodeReader(event);
  }

  patchGridItem(event) {
    // this.isPremeltDetails = false;
    this.preMelt = event.preMeltingDetails;
    if (
      event.preMeltingDetails &&
      event.preMeltingDetails.purity &&
      event.isPreMelt
    ) {
      // this.isPremeltDetails = true;
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
        subTxnType: 'NEW_GEP'
      });
    } else if (event.isSave) {
      this.measuredWeight = event.measuredWeight;
      this.measuredPurity = event.measuredPurity;
      this.gepPatchId = event.id;
      this.totalBreakUpValue(event);
    }
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

  errorNotifications(errorKey) {
    const key = errorKey;
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: key,
        hasClose: true,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        if (
          event.eventType === OverlayNotificationEventType.CLOSE &&
          errorKey === 'GEP  is deleted Successfully!!'
        ) {
          this.clearGep();
        }
      });
  }
  loadOpenValues() {
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.GEP,
      subTxnType: SubTransactionTypeEnum.NEW_GEP
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.GEP,
      subTxnType: SubTransactionTypeEnum.NEW_GEP,
      pageIndex: 0,
      pageSize: 10
    });
  }

  loadHoldValues() {
    this.toolbarFacade.loadOnHoldCount({
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.GEP,
      subTxnType: SubTransactionTypeEnum.NEW_GEP
    });
    this.toolbarFacade.loadOnHold({
      searchValue: '',
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.GEP,
      subTxnType: SubTransactionTypeEnum.NEW_GEP,
      pageIndex: 0,
      pageSize: 10
    });
  }
  clearGep(data?: string) {
    this.isTransactionSuccess = false;
    // this.isPremeltDetails = true;
    this.commonFacade.setFileUploadVisible(false);
    this.summaryBarRemarks$.next('');
    this.searchFormControl.reset();
    this.searchFormControl.disable();
    this.customerFacade.clearCustomerSearch();
    this.customerFacade.clearSelectedCustomer();
    this.facade.resetGep();
    this.resetValidationForm();
    if (data !== 'open') {
      this.commonFacade.setGEPOrderNumber({ orderNo: 0, status: null });
      this.onHoldId = null;
      this.openId = null;
    }
    this.overlayNotification.close();

    this.customerId = null;
    this.customer = null;

    this.gepItemId = null;
    this.isProfileMatched = false;
    this.productGrid = [];
    this.gepForm.reset();
    this.gepForm.get('preDeclarationForm').setValue(false);
    if (data && data !== 'open') {
      this.errorNotifications(
        'GEP doc No. ' + this.docNo + ' is deleted Successfully!!'
      );
    }
    this.docNo = null;
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
        this.showConfirmIssueSuccessNotification(this.srcDocNo);
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else if (error.code === 'ERR-SALE-008' || error.code === 'ERR-SALE-045') {
      this.openExpiredDialog();
    } else if (error.code === ErrorEnums.ERR_CUST_001) {
      this.customerService.open({
        customerType: this.customerType,
        customerId: this.customerId
      });
    } else
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.isTransactionSuccess) {
            this.showConfirmIssueSuccessNotification(this.srcDocNo);
          }
        });
  }

  checkPreDeclarationForm(event: boolean) {
    this.gepForm.get('preDeclarationForm').setValue(event);
    if (this.gepForm.get('preDeclarationForm').value === true) {
      this.commonFacade.setFileUploadVisible(true);
    } else {
      this.fileIds.forEach(element => {
        this.fileFacade.deleteDocument(element.id);
      });
      this.commonFacade.setFileUploadVisible(false);
    }
  }

  upload(event) {
    this.success = true;
    this.overlayNotification.close();
    const fileList: FileList = event;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      formData.append('file', fileList.item(0));

      this.facade.uploadForm({
        customerId: this.customerId,
        id: this.gepItemId,
        file: formData,
        txnType: TransactionTypeEnum.GEP
      });
    }
  }
  uploadError(event: string) {
    this.showNotifications(event);
  }

  oldValue(event) {
    this.gepSuccess = event;
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
          .subscribe((event: OverlayNotificationEventRef) => {});
      });
  }
  add(event?: any) {
    this.facade
      .getGepInit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && data.subTxnType === 'NEW_GEP') {
          this.gepItemId = data.id;
          this.commonFacade.setGEPOrderNumber({
            orderNo: data.docNo,
            status: data.status
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
    }
    // else if (this.totalQty === 0) {
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
      // this.facade.addProduct({
      //   weight: this.weight,
      //   purity: this.purity,
      //   metalType: MetalTypeEnum.GOLD,
      //   itemType: 'JEWELLERY'
      // });
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
    this.resetValidationForm();
    this.validationForm.get('weight').setValue('');
    this.validationForm.get('purity').setValue('');

    this.barcodeService.clearGepBarcodeData();
    this.clearSearch();
  }

  resetValidationForm(){
    this.validationForm.reset();
    this.validationForm.patchValue({scan: this.scan});
    this.searchFormControl.enable();
  }

  clearSearch() {
    this.searchFormControl.reset();
  }

  clear() {
    this.imageUrl = null;
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
    this.clearGep();
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.commonFacade.clearTransactionConfig();
    this.printingService.resetPrint();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
