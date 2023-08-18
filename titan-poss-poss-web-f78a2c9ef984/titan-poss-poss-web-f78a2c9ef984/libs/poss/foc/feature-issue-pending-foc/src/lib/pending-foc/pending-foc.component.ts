import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
import { MatDialog } from '@angular/material/dialog';
import { AddFocPopupComponent } from '@poss-web/poss/cash-memo/ui-add-foc-popup';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import {
  ProductDetailsInGrid,
  PendingCMResponsePayload,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  FocItemDetailsResponsePayload,
  OverlayNotificationServiceAbstraction,
  SummaryBarServiceAbstraction,
  SummaryBarEventRef,
  SummaryBarEventType,
  IssuepPendingFocPayload,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  IssuePendingFocConfirmationPayload,
  CustomErrors,
  SummaryBarType,
  ProductGridProperties,
  ToolbarConfig,
  SelectDropDownOption,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  CashMemoItemDetails,
  RsoDetailsPayload
} from '@poss-web/shared/models';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';

import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { TranslateService } from '@ngx-translate/core';
import {
  FocOutOfStockComponent,
  AddFocAlertPopupComponent
} from '@poss-web/poss/foc/ui-foc-popups';
import { FormControl, FormGroup } from '@angular/forms';

import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';

const selectRSO = 'Select RSO';
const RSOCode = 'RSO';
@Component({
  selector: 'poss-web-pending-foc',
  templateUrl: './pending-foc.component.html'
})
export class PendingFOCComponent implements OnInit, OnDestroy {
  // @Input() selectedCMObservable: Observable<any>;

  selectedCM: PendingCMResponsePayload = null;
  itemDetails: FocItemDetailsResponsePayload[];

  rsoDetails: RsoDetailsPayload[] = [];
  isLoadingPendingCM$: Observable<boolean>;
  isLoadingPendingFocSchemes$: Observable<boolean>;
  isLoadingFocItemDetails$: Observable<boolean>;
  isIssuingPendingFOC$: Observable<boolean>;

  isCustomerSelected = false;
  hasFocItemDetails = false;
  confirmationResponse: IssuePendingFocConfirmationPayload;
  error$: Observable<CustomErrors>;
  finalData = [];
  eligibleItemsList = [];

  focParentForm: any;
  selectedFocItems = [];

  hasNotification = true;

  destroy$: Subject<null> = new Subject<null>();
  pendingFocSchemes: any;

  focPopupData = [];

  addFocDialogRef: any;
  focSelectedRso: string;

  product: ProductDetailsInGrid | ProductDetailsInGrid[];
  // clearAllData$: Subject<null> = new Subject<null>();
  productGridProperties: ProductGridProperties;
  focPopupData$: Subject<any> = new Subject<[]>();

  totalEligibleQty = 0;
  totalEligibleWeight = 0;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  /////////////////

  pendingCM: PendingCMResponsePayload[] = [];
  // selectedCM = null;
  // currentYear = moment().year();
  selectedCmSubject = new Subject();
  selectedCmObservable = this.selectedCmSubject.asObservable();
  pendingCmFormGroup: FormGroup;
  toolbarData: ToolbarConfig = {
    txnType: null,
    subTxnType: null,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  imageUrlData$: Subject<any> = new Subject<any>();
  pgDesc$: Observable<{}>;
  productDetails$ = of([]);
  pendingCmArray: SelectDropDownOption[] = [];
  currentFiscalYear: string;

  selectedCustomerDetails: any;
  isCommonLoading$: Observable<boolean>;

  constructor(
    private focFacade: FocFacade,
    private dialog: MatDialog,
    private regularCashMemoFacade: ProductFacade,
    private customerFacade: CustomerFacade,
    private summaryBar: SummaryBarServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private toolbarFacade: ToolbarFacade,
    private commonFacade: CommonFacade,
    private bodeodFacade: SharedBodEodFacade
  ) {
    this.customerFacade.clearSelectedCustomer();
    this.customerFacade.disableCustomerCreate();
    this.pendingCmFormGroup = new FormGroup({
      pendingCM: new FormControl(''),
      fiscalYear: new FormControl(this.currentFiscalYear)
    });
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: true,
      transactionType: {
        type: TransactionTypeEnum.CM,
        subType: SubTransactionTypeEnum.NEW_CM
      },
      taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_CM
    });
  }

  ngOnInit(): void {
    this.bodeodFacade.loadLatestBusinessDay();
    this.focFacade.resetFOCData();
    this.showSummaryBar();
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.IMAGE_URL_DATA
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data !== null) {
          this.imageUrlData$.next(data);
        }
      });

    this.isCommonLoading$ = this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.LOADING
      );

    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });
    this.focFacade
      .getPendingCM()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.pendingCM = data;
        this.pendingCmArray = [];
        for (const cm of this.pendingCM) {
          this.pendingCmArray.push({
            value: cm.docNo.toString(),
            description: cm.docNo.toString()
          });
        }
      });

    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.customerFacade.clearSelectedCustomer();
    this.focFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.focFacade
      .getSelectedCmDetails()
      .pipe(takeUntil(this.destroy$), debounceTime(10))
      .subscribe(data => {
        if (data) {
          this.selectedCM = data;
          if (
            data &&
            this.selectedCustomerDetails?.customerId !==
              this.selectedCM?.customerId
          ) {
            this.customerFacade.clearSelectedCustomer();
            //this.selectedCM = data;

            this.customerFacade.loadSelectedCustomer(
              String(this.selectedCM?.customerId),
              false,
              false,
              false
            );
          }
          this.componentInit();
        }
      });
    this.focFacade
      .getPendingSchemes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.setTotalEligibleWeightAndQty(data);
        if (data && data.focSchemes.length > 0) {
          this.pendingFocSchemes = data;
          this.loadFocItemDetails();
        } else if (data && data.focSchemes.length === 0) {
          this.focPopupData$.next([]);
        }
      });

    this.focFacade
      .getFocItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.itemDetails = data;
        if (data) {
          this.loadData();
        }
      });
    this.isLoadingPendingCM$ = this.focFacade.getIsLoadingPendingCm();
    this.isLoadingPendingFocSchemes$ = this.focFacade.getIsLoadingPendingFocScheme();
    this.isLoadingFocItemDetails$ = this.focFacade.getIsLoadingFocItemDetails();
    this.isIssuingPendingFOC$ = this.focFacade.getIsIssuingPendingFOC();
    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );
    this.customerFacade
      .getIsCustomerSelected()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.isCustomerSelected = data;
      });
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.selectedCustomerDetails = data;
        if (this.selectedCustomerDetails) {
          this.loadPendingCM();
        } else if (!this.selectedCustomerDetails) {
          // this.clearFocGrid();
          this.selectedFocItems = [];
          this.selectedCM = null;
          this.productDetails$ = of([]);
          this.commonFacade.setFocItems(this.selectedFocItems);
          this.pendingCmFormGroup.patchValue({
            pendingCM: '',
            fiscalYear: this.currentFiscalYear
          });
          this.focSelectedRso = null;
          this.customerFacade.clearCustomerSearch();

          this.focFacade.resetFOCData();
          // this.clearAllData$.next();
          this.overlayNotification.close();
          this.loadPendingCM();
        }
      });

    this.focFacade
      .getIssuePendingFOCResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.confirmationResponse = data;
          this.showConfirmIssueSuccessNotification();
        }
      });
    this.focPopupData$
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.openFocPopup(data);
      });
  }

  componentInit() {
    this.regularCashMemoFacade.loadRSODetails(RSOCode);
    this.commonFacade.loadCMPgDesc();
    this.regularCashMemoFacade
      .getRSODetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoDetails: RsoDetailsPayload[]) => {
        console.log('rsoDetails:', rsoDetails);
        this.rsoDetails = [{ code: selectRSO, name: 'None' }];
        if (rsoDetails.length !== 0) {
          rsoDetails.forEach(element =>
            this.rsoDetails.push({ code: element.code, name: element.name })
          );
        }
      });
  }
  loadData() {
    this.focPopupData = [];
    for (let i = 0; i < this.pendingFocSchemes.focSchemes.length; i++) {
      let details = this.itemDetails;
      let inventoryDetails = [];
      let focDetails = null;
      this.pendingFocSchemes.focSchemes[
        i
      ].eligibleFocItemDetails.focItems.forEach(v => {
        focDetails = v;
        inventoryDetails = details
          .filter(x => {
            return x.itemCode === v.itemCode;
          })
          .concat(...inventoryDetails);
        details = details.filter(x => x.itemCode !== v.itemCode);
      });
      this.focPopupData.push({
        inventoryFocItemList: inventoryDetails ? inventoryDetails : null,
        otherFocDetails: focDetails,
        purchaseItems: this.pendingFocSchemes.focSchemes[i].purchaseItemDetails
          .purchaseItems,
        schemeDetailId: this.pendingFocSchemes.focSchemes[i].schemeDetails.data
          .schemeDetailIds[0],
        schemeCategory: this.pendingFocSchemes.focSchemes[i].schemeDetails.data
          .schemeCategory,
        schemeId: this.pendingFocSchemes.focSchemes[i].id,
        schemeName: this.pendingFocSchemes.focSchemes[i].schemeDetails.data
          .schemeName,
        salesTxnId: this.pendingFocSchemes.focSchemes[i].salesTxnId,
        isStockAvailable: inventoryDetails ? true : false
      });
    }

    this.focPopupData$.next(this.focPopupData);
  }
  loadFocItemDetails() {
    this.eligibleItemsList = [];
    for (const scheme of this.pendingFocSchemes.focSchemes) {
      for (const item of scheme.eligibleFocItemDetails.focItems) {
        this.eligibleItemsList.push(item.itemCode);
      }
    }
    this.focFacade.loadFocItemDetails({ itemsCodes: this.eligibleItemsList });
  }
  openFocPopup(data: any) {
    let isOutOfStock = false;
    if (data && data.length === 0) {
      this.showNoFocForSelectedItemNotification();
    } else if (data && data.length > 0) {
      const array = this.focPopupData.every(e => {
        if (e.inventoryFocItemList.length === 0) {
          isOutOfStock = true;
          return false;
        }
        return true;
      });
      if (isOutOfStock) {
        this.dialog
          .open(FocOutOfStockComponent, {
            width: '420px'
          })
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
            if (res) {
              // this.focFacade.keepFocPending(this.keepFocPending());
            }
          });
      } else {
        this.showFocPopup();
      }
    }
  }
  showFocPopup() {
    this.dialog
      .open(AddFocPopupComponent, {
        width: '835px',
        maxWidth: '90vw',
        data: {
          focData: this.focPopupData,
          isPendingRequired: false,
          rsoNames: this.rsoDetails.filter(e => e.code !== selectRSO),
          selectedRso: this.focSelectedRso
        },
        disableClose: true
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          if (res.type === 'pendingFOC') {
            // this.focFacade.keepFocPending(this.keepFocPending());
          } else if (res.type === 'addFoc') {
            this.focSelectedRso = res.data.value.rsoName;
            this.focParentForm = res.data.value.parentForm;

            for (const itemForm of this.focParentForm) {
              for (const item of itemForm.inventoryFocItemList) {
                if (item.isSelected && item.quantity > 0) {
                  this.selectedFocItems.push(item);
                }
              }
            }
            this.commonFacade.setFocItems(this.selectedFocItems);
            this.sendProductToGrid(this.selectedFocItems);
            // this.showSummaryBar();
          } else if (res.type === 'showAlert') {
            this.focPopupData = res.data.parentForm;
            this.focSelectedRso = res.data.rsoName;
            this.dialog
              .open(AddFocAlertPopupComponent, {
                width: '420px'
              })
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(response => {
                this.showFocPopup();
              });
          }
        }
      });
  }
  sendProductToGrid(items: any) {
    const products = [];
    for (const item of items) {
      const productDataToGrid: CashMemoItemDetails = {
        itemCode: item.itemCode,
        lotNumber: item.lotNumber,
        binCode: item.binCode,
        inventoryId: item.inventoryId,
        finalValue: 0,
        remarks: null,
        totalDiscount: 0,
        totalQuantity: item.quantity,
        totalTax: null,
        totalValue: 0,
        totalWeight: Number((item.quantity * item.stdWeight).toFixed(3)),
        unitValue: 0,
        unitWeight: item.unitWeight,
        employeeCode: this.focSelectedRso,
        discountDetails: null,
        focDetails: null,
        taxDetails: null,
        priceDetails: null,
        inventoryWeightDetails: null,
        isFoc: true,
        measuredWeightDetails: null,
        productCategoryCode: null,
        productGroupCode: null,
        refTxnId: null,
        refTxnType: null,
        refSubTxnType: null,
        rowId: null,
        reason: null,
        hallmarkCharges: 0,
        hallmarkDiscount: 0
      };
      products.push(productDataToGrid);
    }
    this.productDetails$ = of(products);
  }
  ngOnDestroy() {
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.customerFacade.clearSelectedCustomer();
    this.commonFacade.clearTransactionConfig();
  }
  showSummaryBar() {
    // if (this.selectedFocItems.length > 0) {
    this.summaryBar.close();
    this.summaryBar
      .open(SummaryBarType.FOC)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            this.selectedFocItems = [];
            this.selectedCM = null;
            this.productDetails$ = of([]);
            this.commonFacade.setFocItems(this.selectedFocItems);
            this.pendingCmFormGroup.patchValue({
              pendingCM: '',
              fiscalYear: this.currentFiscalYear
            });
            this.focSelectedRso = null;
            this.customerFacade.clearCustomerSearch();
            this.focFacade.resetFOCData();
            // this.clearAllData$.next();
            this.overlayNotification.close();
            if (!this.selectedCustomerDetails?.customerId) {
              this.loadPendingCM();
            }

            // this.summaryBar.close();
            break;
          }
          case SummaryBarEventType.CONFRIM: {
            if (this.selectedFocItems.length > 0)
              this.focFacade.issuePendingFoc(this.createIssuePayload());
            else {
              const enterRsoMsgKey = 'pw.foc.noItemsSelectedToBeIssuedMsg';
              this.translate
                .get(enterRsoMsgKey)
                .pipe(take(1))
                .subscribe((translatedMsg: any) => {
                  this.overlayNotification
                    .show({
                      type: OverlayNotificationType.SIMPLE,
                      hasBackdrop: true,
                      hasClose: true,
                      message: translatedMsg
                    })
                    .events.pipe(take(1))
                    .subscribe();
                });
            }
            break;
          }
        }
      });
    // }
  }
  createIssuePayload(): IssuepPendingFocPayload {
    return {
      refTxnId: this.focParentForm[0].salesTxnId,
      subTxnType: SubTransactionTypeEnum.FOC_CM,
      txnType: TransactionTypeEnum.CM,
      payload: this.createItemsPayload()
    };
  }
  createItemsPayload(): any {
    const focItemsDetails = [];
    for (const itemForm of this.focParentForm) {
      for (const item of itemForm.inventoryFocItemList) {
        if (item.isSelected && item.quantity > 0) {
          focItemsDetails.push({
            focItemDetails: [
              {
                employeeCode: this.focSelectedRso,
                inventoryId: item.inventoryId,
                itemCode: item.itemCode,
                lotNumber: item.lotNumber,
                totalQuantity: item.quantity,
                totalWeight: item.actualWeight,
                unitWeight: item.unitWeight
              }
            ],
            focSchemeId: itemForm.schemeId
          });
        }
      }
    }
    return { focDetails: focItemsDetails };
  }
  showConfirmIssueSuccessNotification(): void {
    this.hasNotification = true;
    this.summaryBar.close();
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.customerFacade.clearCustomerSearch();
          this.focFacade.resetFOCData();
          // this.clearAllData$.next();
          this.pendingCmFormGroup.patchValue({
            pendingCM: ''
          });
          this.overlayNotification.close();
          this.summaryBar.close();
          this.loadPendingCM();
        }
      });
  }
  showEmployeeNotification() {
    const enterRsoMsgKey = 'pw.regularCashMemo.enterRsoMsg';
    this.translate
      .get(enterRsoMsgKey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          hasClose: true,
          message: translatedMsg
        });
      });
  }
  errorHandler(error: any) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          // this.showNotifications();
        }
      });
  }
  showNoFocForSelectedItemNotification() {
    const pendingFocSuccessMsgKey = 'pw.foc.noFocSchemesAvailableMsg';
    this.translate
      .get(pendingFocSuccessMsgKey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          hasClose: true,
          message: translatedMsg
        });
      });
  }
  loadFOCPopupData() {
    this.selectedFocItems = [];
    this.focFacade.loadPendingSchemes({
      id: this.selectedCM.id.toString(),
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM
    });
  }
  clearFocGrid() {
    this.selectedFocItems = [];
    this.productDetails$ = of([]);
    this.focSelectedRso = null;
  }
  search() {
    this.selectedCM = null;
    this.clearFocGrid();
    this.focFacade.resetFOCData();
    this.loadPendingCM();
  }

  fiscalYearEmit(value) {
    this.selectedCM = null;
    this.clearFocGrid();
    this.focFacade.resetFOCData();
    this.loadPendingCM();
  }
  selectCM(value: any) {
    this.focFacade.setSelectedFocCm(this.getSelectedPendingCM());
  }
  getSelectedPendingCM() {
    const selectedDetails = this.pendingCM.filter(cmDetails => {
      if (
        cmDetails.docNo ===
        Number(this.pendingCmFormGroup.get('pendingCM').value)
      ) {
        return cmDetails;
      }
    });
    return selectedDetails[0];
  }
  clearForm($event) {
    if ($event) {
      this.pendingCmFormGroup.reset();
      this.loadPendingCM();
    }
  }
  setTotalEligibleWeightAndQty(data: any) {
    this.totalEligibleWeight = 0;
    this.totalEligibleQty = 0;
    for (const i in data?.focSchemes) {
      if (data?.focSchemes[i]?.eligibleFocItemDetails?.focItems[0].weight) {
        this.totalEligibleWeight =
          this.totalEligibleWeight +
          data.focSchemes[i].eligibleFocItemDetails.focItems[0].weight;
      } else {
        this.totalEligibleQty =
          this.totalEligibleQty +
          data.focSchemes[i].eligibleFocItemDetails.focItems[0].quantity;
      }
    }
    this.commonFacade.setFocEligibleWtAndQty({
      qty: this.totalEligibleQty,
      wt: this.totalEligibleWeight
    });
  }
  loadImageUrl(event: string) {
    this.commonFacade.loadCMImageUrl(event);
  }
  loadPendingCM() {
    //todo clear Foc

    this.focFacade.loadPendingCM({
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      customerId: this.selectedCustomerDetails?.customerId
        ? this.selectedCustomerDetails?.customerId
        : null,
      fiscalYear: !!this.pendingCmFormGroup.get('fiscalYear').value
        ? this.pendingCmFormGroup.get('fiscalYear').value.toString()
        : this.currentFiscalYear
    });
  }
}
