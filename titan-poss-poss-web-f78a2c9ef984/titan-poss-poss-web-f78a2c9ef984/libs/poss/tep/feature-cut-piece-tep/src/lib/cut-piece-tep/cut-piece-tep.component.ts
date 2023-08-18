import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { filter, takeUntil } from 'rxjs/operators';
import { TepFacade } from '@poss-web/shared/tep/data-access-direct-tep';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { Observable, Subject } from 'rxjs';
import {
  addCutPieceTepItemInStockManagementPayload,
  addOrPatchCutPieceTepItemInStockManagementResponse,
  AddOrUpdateTepItemResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  confirmCutPieceTepItemInStockManagementPayload,
  createOpenOrPatchCutPieceTepStockManagementResponse,
  CreateTepTypesEnum,
  CustomErrors,
  DeleteTepItemResponse,
  GetTepItemConfiguratonResponse,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  patchCutPieceTepItemInStockManagementPayload,
  patchCutPieceTepStockManagementPayload,
  ProductDetails,
  RoleCodesEnum,
  RsoNameObject,
  SearchEmitEvent,
  SearchProductList,
  SelectDropDownOption,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  TepItemResponse,
  TepStatusEnum,
  TepTransactionResponse,
  TepTypesEnum,
  ToolbarConfig,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { ProductSearchAutocompleteComponent } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-cut-piece-tep',
  templateUrl: './cut-piece-tep.component.html'
})
export class CutPieceTepComponent implements OnInit, OnDestroy {
  @ViewChild('cutPieceTepSuccessNotificationTemplate', { static: true })
  private cutPieceTepSuccessNotificationTemplate: TemplateRef<any>;
  isLoading$: Observable<boolean>;
  isOpenTaskLoading$: Observable<boolean>;
  isProductSearchLoading$: Observable<boolean>;
  roleCode = RoleCodesEnum.RSO;
  cutPieceTepFormGroup: FormGroup;
  standardMetalRates: any;
  rsoNamesList: SelectDropDownOption[] = [];
  isOpenTask = false;
  tepTransactionId = '';
  customerId: number;
  openStatus = '';
  summaryBarRemarks$ = new Subject<string>();
  isLoggedIn: boolean;
  deleteId = '';
  clearSelectedRsoName = false;
  cutPieceItemList: any;
  selectedRso: { value: string; description: string };
  selectRsoNameAlertMessage = '';
  addRemarksAlertMessage = '';
  selectCustomerAlertMessage = '';
  notHallmarkedAlertMessage = '';
  searchProductList$: Observable<SearchProductList[]>;
  searchEnableFlag$: Observable<boolean>;
  itemCode = '';
  currencyCode: string;
  recentlyAddedUniqueRowId = '';
  deleteIdForSoftDelete = '';
  tepItemConfiguration: any;
  metalRate = null;
  customerMobileNumber: string;
  selectedProductDetails: ProductDetails | any;
  totalQty = 0;
  totalGrossWt = 0;
  totalValue = 0;
  totalTax = 0;
  tepStatusEnum = TepStatusEnum;
  returnWeight = 0;
  measuredWeight: number;
  itemId: string;
  status = '';
  docNo = 0;
  selectedCustomer: any;
  isAddTepItemSuccessful = false;
  destroy$: Subject<null> = new Subject<null>();
  @ViewChild(ProductSearchAutocompleteComponent)
  private searchComponent: ProductSearchAutocompleteComponent;
  permissions$: Observable<any[]>;

  TEP_ADD_EDIT_SUBMENU = 'Customer Transaction Status-TEP Add/Edit Submenu';

  constructor(
    private toolbarFacade: ToolbarFacade,
    private productFacade: ProductFacade,
    private currencyFormatterService: CurrencyFormatterService,
    private summaryBar: SummaryBarServiceAbstraction,
    private tepFacade: TepFacade,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private weightFormatterService: WeightFormatterService,
    private overlayNotificationServiceAbstraction: OverlayNotificationServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.cutPieceTepFormGroup = new FormGroup({
      rsoName: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.getTranslatedAlertMessages();
    this.searchProductList$ = this.productFacade.getSearchProductList();
    this.searchEnableFlag$ = this.productFacade.getGridSearchEnable();
    const toolbarData: ToolbarConfig = {
      txnType: TransactionTypeEnum.TEP,
      subTxnType: SubTransactionTypeEnum.CUT_PIECE_TEP,
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: true
    };
    this.toolbarFacade.setToolbarConfig(toolbarData);
    this.commonFacade.setTransactionConfig({
      transactionType: {
        type: TransactionTypeEnum.TEP,
        subType: SubTransactionTypeEnum.CUT_PIECE_TEP
      }
    });

    const id = this.activatedRoute.snapshot.params['_id'];

    const isCutPieceTepTabSelected = this.router.url.includes('cut-piece-tep');
    console.log('isCutPieceTepTabSelected :', isCutPieceTepTabSelected);
    this.commonFacade.setFileUploadVisible(false);
    if (id !== 'new' && isCutPieceTepTabSelected) {
      this.cutPieceItemList = [];
      this.clearCutPieceTepData();
      this.tepFacade.clearTepItemDetails();
      this.tepFacade.loadTepTransactionDetails(
        id,
        SubTransactionTypeEnum.CUT_PIECE_TEP
      );
      this.commonFacade.setTransactionTD(id);
    } else {
      this.isOpenTask = false;
    }
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });
    this.router.events
      .pipe(
        filter(
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const id = this.activatedRoute.snapshot.params['_id'];
        const isCutPieceTepSelected = this.router.url.includes('cut-piece-tep');
        if (id && isCutPieceTepSelected) {
          this.tepFacade.loadTepTransactionDetails(
            id,
            SubTransactionTypeEnum.CUT_PIECE_TEP
          );
          this.commonFacade.setTransactionTD(id);
        } else {
          this.isOpenTask = false;
        }
      });

    this.isLoading$ = this.tepFacade.getIsLoading();
    this.isOpenTaskLoading$ = this.tepFacade.getIsOpenTaskLoading();
    this.isProductSearchLoading$ = this.productFacade.getIsLoading();
    this.tepFacade.LoadRsoList(this.roleCode);
    this.commonFacade.loadTEPStandardMetalPriceDetails();
    this.getRsoList();
    this.getSelectedRsoName();
    this.getError();
    this.getProductFacadeError();
    this.showSummaryBar();
    this.getStandardMetalRates();
    this.getOpenTepTransactionId();
    this.getDeleteTepItemResponse();
    this.getTepItemConfiguration();
    this.getTepItemCutPieceDetails();
    this.getAddTepItemResponse();
    this.getTepTransactionResponse();
    this.getProductDetails();
    this.getCutPieceTotalQty();
    this.getCutPieceTotalValue();
    this.getTepHoldOrConfirmationResponse();
    this.getTepItemResponse();
    this.loadOpenValues();
    this.getDeleteTepTransactionResponse();
    this.getAddCutPieceTepItemResponse();
    this.getUpdateCutPieceTepItemResponse();
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.selectedCustomer = data;
        }
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  getDeleteTepTransactionResponse() {
    this.tepFacade
      .getDeleteTepTransactionResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(deleteTepTransactionResponse => {
        if (deleteTepTransactionResponse) {
          this.tepTransactionId = '';
          this.clearCutPieceTepData(true);
          this.commonFacade.setTepOrderNumber({
            orderNo: 0,
            status: null
          });
          this.isOpenTask = false;
          this.loadOpenValues();
          this.showAlertNotification('Transaction is successfully deleted.');
        }
      });
  }

  getTepItemResponse() {
    this.tepFacade
      .getTepItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tepItemDetails: TepItemResponse) => {
        if (tepItemDetails) {
          const id = '_' + Math.random().toString(36).substr(2, 9);
          this.itemCode = tepItemDetails.itemCode;

          this.recentlyAddedUniqueRowId = id;

          this.selectedProductDetails = tepItemDetails;

          this.totalTax = tepItemDetails.totalTax;
          this.returnWeight = tepItemDetails.stdWeight;

          this.totalGrossWt = tepItemDetails.totalWeight;

          const cutPieceTepItem = {
            variantCode: tepItemDetails.itemDetails.data.ORIGINAL_ITEM.itemCode,
            lotNo: tepItemDetails.itemDetails.data.ORIGINAL_ITEM.lotNumber,
            grossWt: tepItemDetails.itemDetails.data.ORIGINAL_ITEM.grossWeight,
            goldWt:
              tepItemDetails.itemDetails.data.ORIGINAL_ITEM.metalWeight.data
                .goldWeight,
            cutPieceCode: tepItemDetails.itemCode,
            cutPieceLotNo: tepItemDetails.lotNumber,
            cutPieceWt: tepItemDetails.stdWeight,
            itemId: tepItemDetails.id,
            cutPieceValue: tepItemDetails.stdValue,
            formGroup: new FormGroup({
              isHallmarking: new FormControl({
                value: tepItemDetails?.isHallmarking,
                disabled: true
              })
            })
          };
          this.cutPieceItemList = [...this.cutPieceItemList, cutPieceTepItem];
        }
      });
  }

  getTepHoldOrConfirmationResponse() {
    this.tepFacade
      .getConfirmCutPieceTepItemResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmTepResponse: any) => {
        if (confirmTepResponse) {
          this.status = confirmTepResponse.status
            ? confirmTepResponse.status.toUpperCase()
            : '';
          this.docNo = confirmTepResponse.docNo;
          this.showTepSuccessNotification();
          this.isOpenTask = false;
          this.commonFacade.setTepOrderNumber({
            orderNo: 0,
            status: null
          });
          this.loadOpenValues();
        }
      });
  }

  showTepSuccessNotification(): void {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: this.cutPieceTepSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === 0) {
          this.clearCutPieceTepData(true);
          this.loadOpenValues();
        }
      });
  }

  getCutPieceTotalQty() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.CUT_PIECE_TEP_TOTAL_QUANTITY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((cutPieceTepTotalQty: number) => {
        this.totalQty = cutPieceTepTotalQty;
      });
  }

  getCutPieceTotalValue() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.CUT_PIECE_TEP_TOTAL_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((cutPieceTepTotalValue: number) => {
        this.totalValue = cutPieceTepTotalValue;
      });
  }

  getAddTepItemResponse() {
    this.tepFacade
      .getAddTepItemResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((addTepItemResponse: AddOrUpdateTepItemResponse) => {
        if (addTepItemResponse) {
          this.isAddTepItemSuccessful = true;
          if (this.cutPieceItemList.length > 0) {
            let cutPieceItemObj = this.cutPieceItemList[0];
            cutPieceItemObj = {
              ...cutPieceItemObj,
              itemId: addTepItemResponse.itemDetails.itemId
            };
            const cutPieceTepItem = {
              variantCode: cutPieceItemObj.variantCode,
              lotNo: cutPieceItemObj.lotNo,
              grossWt: cutPieceItemObj.grossWt,
              goldWt: cutPieceItemObj.goldWt,
              cutPieceCode: cutPieceItemObj.cutPieceCode,
              cutPieceLotNo: cutPieceItemObj.cutPieceLotNo,
              cutPieceWt: addTepItemResponse.totalWeight,
              itemId: cutPieceItemObj.itemId,
              cutPieceValue: addTepItemResponse.totalValue,
              formGroup: new FormGroup({
                isHallmarking: new FormControl({
                  value: cutPieceItemObj?.isHallmarking,
                  disabled: true
                })
              })
            };
            this.cutPieceItemList = [];
            this.cutPieceItemList = [...this.cutPieceItemList, cutPieceTepItem];
          }
          if (addTepItemResponse.totalQuantity) {
            this.totalQty = addTepItemResponse.totalQuantity;
          }
          if (addTepItemResponse.totalTax) {
            this.totalTax = addTepItemResponse.totalTax;
          }
          if (addTepItemResponse.totalValue) {
            this.totalValue = addTepItemResponse.totalValue;
          }
          if (addTepItemResponse.totalWeight) {
            this.totalGrossWt = addTepItemResponse.totalWeight;
          }
        }
      });
  }

  getProductDetails() {
    this.productFacade
      .getProductDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productDetailsList: ProductDetails[]) => {
        if (productDetailsList && productDetailsList.length > 0) {
          this.selectedProductDetails = productDetailsList[0];
          this.tepFacade.loadTepItemConfiguration(
            this.selectedProductDetails.itemCode,
            SubTransactionTypeEnum.CUT_PIECE_TEP,
            false,
            this.customerMobileNumber
          );
        }
      });
  }

  getTepTransactionResponse() {
    this.cutPieceItemList = [];
    this.tepFacade
      .getTepTransactionDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tepTransactionDetails: TepTransactionResponse) => {
        if (tepTransactionDetails) {
          this.isOpenTask = true;
          this.openStatus = tepTransactionDetails.status;
          this.commonFacade.setTepOrderNumber({
            orderNo: tepTransactionDetails.docNo,
            status: this.openStatus
          });
          this.tepTransactionId = tepTransactionDetails.id;
          this.customerId = tepTransactionDetails.customerId;

          const rsoNames = this.rsoNamesList.map(
            (rsoNameObj: { value: string; description: string }) => {
              return rsoNameObj.value;
            }
          );
          if (rsoNames.includes(tepTransactionDetails.employeeCode)) {
            this.selectedRso = {
              value: tepTransactionDetails.employeeCode,
              description: tepTransactionDetails.employeeCode
            };
            this.onSelectedRSONameChanged(this.selectedRso);
          }
          tepTransactionDetails.itemIds.forEach((tepItemId: string) => {
            this.tepFacade.loadTepItemDetails(
              tepTransactionDetails.id,
              tepItemId,
              SubTransactionTypeEnum.CUT_PIECE_TEP,
              CreateTepTypesEnum.CUT_PIECE_TEP,
              this.selectedCustomer && this.selectedCustomer.mobileNumber
                ? this.selectedCustomer.mobileNumber
                : null
            );
          });
          if (tepTransactionDetails.customerId) {
            this.customerFacade.loadSelectedCustomer(
              String(tepTransactionDetails.customerId)
            );
          }
          this.summaryBarRemarks$.next(tepTransactionDetails.remarks);
        } else {
          this.isOpenTask = false;
        }
      });
  }

  getTepItemCutPieceDetails() {
    this.tepFacade
      .getTepItemCutPieceDetailsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response) {
          this.cutPieceItemList = [
            ...this.cutPieceItemList,
            {
              variantCode: response.itemCode,
              lotNo: response.lotNo,
              grossWt: response.netWeight,
              goldWt: response.metalWeight,
              cutPieceCode: response.cutPieceCode,
              cutPieceLotNo: response.cutPieceLotNo,
              cutPieceWt: response.cutPieceWt,
              itemId: '1234-abcd',
              formGroup: new FormGroup({
                isHallmarking: new FormControl({
                  value: response?.isHallmarking,
                  disabled: true
                })
              })
            }
          ];
        }
      });
  }

  deleteTepItemById(event: any) {
    this.deleteId = event.itemId;
    // To be uncommented.
    if (this.deleteId !== 'abcd-1234') {
      this.tepFacade.DeleteTepItem(
        this.tepTransactionId,
        event.itemId,
        SubTransactionTypeEnum.CUT_PIECE_TEP
      );
    } else {
      const objectToBeRemoved = this.cutPieceItemList.filter(data => {
        return data.itemId === this.deleteId;
      });
      this.cutPieceItemList.splice(
        this.cutPieceItemList.indexOf(objectToBeRemoved[0]),
        1
      );
      this.cutPieceItemList = [...this.cutPieceItemList];
      this.deleteIdForSoftDelete = this.deleteId;
    }
  }

  getAddCutPieceTepItemResponse() {
    this.tepFacade
      .getAddCutPieceTepItemResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: addOrPatchCutPieceTepItemInStockManagementResponse) => {
          if (response) {
            this.cutPieceItemList = [
              ...this.cutPieceItemList,
              {
                variantCode: this.selectedProductDetails.itemCode,
                lotNo: this.selectedProductDetails.lotNumber,
                grossWt: this.selectedProductDetails.stdWeight,
                goldWt:
                  this.selectedProductDetails.totalWeightDetails &&
                  this.selectedProductDetails.totalWeightDetails.data &&
                  this.selectedProductDetails.totalWeightDetails.data.goldWeight
                    ? this.selectedProductDetails.totalWeightDetails.data
                        .goldWeight
                    : 0,
                cutPieceCode:
                  this.selectedProductDetails.karatage === 22
                    ? '11GOPYM008'
                    : this.selectedProductDetails.karatage === 18
                    ? '11GOLYM009'
                    : this.selectedProductDetails.karatage === 14
                    ? '11GOHYM007'
                    : '',
                cutPieceLotNo: `${this.selectedProductDetails.lotNumber}CP`,
                cutPieceWt: 0,
                cutPieceValue: 0,
                itemId: response.id,
                formGroup: new FormGroup({
                  isHallmarking: new FormControl({
                    value: response?.isHallmarking,
                    disabled: true
                  })
                })
              }
            ];
          }
        }
      );
  }

  getTepItemConfiguration() {
    this.tepFacade
      .getTepItemConfiguratonResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: GetTepItemConfiguratonResponse) => {
        if (response) {
          this.clearSearchField();
          if (response.isCutPieceTepAllowed) {
            this.tepItemConfiguration = response;
            const requestPayload: addCutPieceTepItemInStockManagementPayload = {
              inventoryId: this.selectedProductDetails.inventoryId,
              itemCode: response.tepCutPieceConfig.cutPieceItemCode,
              lotNumber: this.selectedProductDetails.lotNumber
            };
            this.tepFacade.addCutPieceTepItem(
              this.tepTransactionId,
              requestPayload
            );
          } else {
            this.showAlertNotification(
              'CUT PIECE TEP is not allowed. Please check configuration.'
            );
          }
        }
      });
  }

  setTotalValueOfGridItems(event: any) {
    if (event && event.totalQty !== 0) {
      this.commonFacade.setCutPieceTepTotalQty(event.totalQty);
    } else {
      this.commonFacade.setCutPieceTepTotalQty(0);
    }

    if (event && event.totalValue !== 0) {
      this.commonFacade.setCutPieceTepTotalValue(event.totalValue);
    } else {
      this.commonFacade.setCutPieceTepTotalValue(0);
    }
  }

  getDeleteTepItemResponse() {
    this.tepFacade
      .getDeleteTepItemResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: DeleteTepItemResponse) => {
        if (response) {
          const objectToBeRemoved = this.cutPieceItemList.filter(data => {
            return data.itemId === this.deleteId;
          });
          this.cutPieceItemList.splice(
            this.cutPieceItemList.indexOf(objectToBeRemoved[0]),
            1
          );
          this.cutPieceItemList = [...this.cutPieceItemList];
          this.deleteIdForSoftDelete = this.deleteId;
          this.tepFacade.clearDeleteTepItemResponse();
          this.isAddTepItemSuccessful = false;
        }
      });
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.CUT_PIECE_TEP, {
        type: TepTypesEnum.CUT_PIECE_TEP,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.DELETE: {
            if (this.tepTransactionId) {
              this.tepFacade.deleteTepTransactionDetails(
                this.tepTransactionId,
                SubTransactionTypeEnum.CUT_PIECE_TEP
              );
            }
            break;
          }
          case SummaryBarEventType.CLAER: {
            this.clearCutPieceTepData(true);
            break;
          }
          case SummaryBarEventType.HOLD: {
            if (this.isAddTepItemSuccessful) {
              this.confirmOrHoldTep(TepStatusEnum.HOLD, event.remarks);
            } else {
              this.showAlertNotification(
                'Cut Piece TEP item could not be added properly. Please try to update cut piece weight in the existing row and then hold or delete and try again.'
              );
            }
            break;
          }
          case SummaryBarEventType.CONFRIM: {
            this.confirmOrHoldTep(TepStatusEnum.CONFIRMED, event.remarks);
            break;
          }
        }
      });
  }

  confirmOrHoldTep(tepStatusType: TepStatusEnum, remarks?: string) {
    if (!this.selectedRso) {
      this.showAlertNotification(this.selectRsoNameAlertMessage);
    } else if (!remarks) {
      this.showAlertNotification(this.addRemarksAlertMessage);
    } else if (
      this.cutPieceItemList.some(x => !x.formGroup?.value?.isHallmarking)
    ) {
      this.showAlertNotification(this.notHallmarkedAlertMessage);
    } else {
      console.log(this.cutPieceItemList);
      const requestPayload: confirmCutPieceTepItemInStockManagementPayload = {
        employeeCode: this.selectedRso.value,
        remarks: remarks,
        totalQuantity: this.totalQty,
        totalValue: this.totalValue,
        totalWeight: this.returnWeight
          ? Number(this.returnWeight.toFixed(3))
          : this.measuredWeight
      };
      if (
        this.measuredWeight &&
        Number(this.measuredWeight) !==
          Number(this.weightFormatterService.format(this.returnWeight))
      ) {
        this.getCutPieceDetails({
          cutPieceWt: this.measuredWeight,
          itemId: this.itemId
        });
      } else {
        this.tepFacade.confirmCutPieceTepItem(
          this.tepTransactionId,
          requestPayload
        );
      }
    }
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

  onSelectedRSONameChanged(event: { value: string; description: string }) {
    this.clearSelectedRsoName = false;
    this.selectedRso = event;
    if (this.tepTransactionId) {
      if (event && event.value) {
        const requestPayload: patchCutPieceTepStockManagementPayload = {
          employeeCode: event.value
        };
        this.tepFacade.patchCutPieceTepTransaction(
          this.tepTransactionId,
          requestPayload
        );
        this.tepFacade.SetSelectedRsoName(event);
      }
    } else {
      // this.tepFacade.createOpenCutPieceTepTransaction();
    }
  }

  searchByItemcode(event: SearchEmitEvent) {
    this.productFacade.clearProductRelatedDetails();
    if (event.isValid) {
      this.productFacade.loadSearchProduct({
        searchValue: event.searchValue
      });
    } else {
      this.productFacade.clearSearchProductList();
    }
  }

  selectedItemcode(event: SearchProductList) {
    this.deleteId = '';
    this.tepFacade.createOpenCutPieceTepTransaction();
    this.productFacade.clearProductRelatedDetails();
    this.tepFacade.SetTepItemProductCode('');
    if (this.cutPieceItemList && this.cutPieceItemList.length > 0) {
      this.showAlertNotification(
        'Only one item is allowed for cut piece TEP at once.'
      );
    } else {
      this.itemCode = event.itemCode;
      this.recentlyAddedUniqueRowId = 'cut-piece-tep';
      this.productFacade.loadProductDetails({
        itemCode: event.itemCode
      });
      // if (this.tepTransactionId) {
      //   this.itemCode = event.itemCode;
      //   this.recentlyAddedUniqueRowId = 'cut-piece-tep';
      //   this.productFacade.loadProductDetails({
      //     itemCode: event.itemCode
      //   });
      // } else {
      //   this.productFacade.clearSearchProductList();
      // }
    }
  }

  exactSearchByItemcode(event: SearchEmitEvent) {
    this.productFacade.clearProductRelatedDetails();
    if (event.isValid) {
      this.productFacade.loadProductDetails({
        itemCode: event.searchValue
      });
    } else {
      this.productFacade.clearSearchProductList();
    }
  }

  clearCutPieceTepData(value?: boolean) {
    this.deleteId = '';
    this.tepFacade.SetRemarks('');
    this.customerFacade.clearCustomerSearch();
    this.customerFacade.clearSelectedCustomer();
    this.tepTransactionId = '';
    this.cutPieceItemList = [];
    this.tepFacade.resetTep();
    this.tepFacade.LoadRsoList(this.roleCode);
    this.selectedRso = null;
    this.summaryBarRemarks$.next('');
  }

  getRsoList() {
    this.tepFacade
      .getRsoList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: RsoNameObject[]) => {
        this.rsoNamesList = response;
        // if (response && response.length > 0) {
        //   this.rsoNamesList = response.map((rsoName: string) => {
        //     return { value: rsoName, description: rsoName };
        //   });
        // } else {
        //   this.rsoNamesList = [];
        // }
      });
  }

  getTranslatedAlertMessages() {
    const selectCustomerAlertMessage = 'pw.grf.selectCustomerAlert';
    const selectRsoNameAlertMessage = 'pw.grf.selectRsoNameAlert';
    const addRemarksAlertMessage = 'pw.grf.addRemarksAlert';
    this.translate
      .get([
        selectCustomerAlertMessage,
        selectRsoNameAlertMessage,
        addRemarksAlertMessage,
        'pw.tep.notHallmarkedalertMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        this.selectCustomerAlertMessage =
          translatedMessages[selectCustomerAlertMessage];
        this.selectRsoNameAlertMessage =
          translatedMessages[selectRsoNameAlertMessage];
        this.addRemarksAlertMessage =
          translatedMessages[addRemarksAlertMessage];
        this.notHallmarkedAlertMessage =
          translatedMessages['pw.tep.notHallmarkedalertMessage'];
      });
  }

  showAlertNotification(message: string): void {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getStandardMetalRates() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.TEP,
        CommomStateAttributeNameEnum.STANDARD_METAL_PRICE_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((standardMetalPriceDetails: any) => {
        this.standardMetalRates = standardMetalPriceDetails;
        if (this.standardMetalRates) {
          this.metalRate = this.standardMetalRates['J'].ratePerUnit;
        }
      });
  }

  getError() {
    this.tepFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.clearSearchField();
          this.errorHandler(error);
        }
      });
  }

  getCutPieceDetails(event: any) {
    const requestPayload: patchCutPieceTepItemInStockManagementPayload = {
      measuredWeight: event.cutPieceWt
    };
    this.measuredWeight = event.cutPieceWt;
    this.itemId = event.itemId;
    this.tepFacade.patchCutPieceTepItem(
      this.tepTransactionId,
      event.itemId,
      requestPayload
    );
  }

  getUpdateCutPieceTepItemResponse() {
    this.tepFacade
      .getPatchCutPieceTepItemResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: addOrPatchCutPieceTepItemInStockManagementResponse) => {
          if (response) {
            this.returnWeight = response.stdWeight;
            const cutPieceTepItem = {
              variantCode: response.itemDetails.data.ORIGINAL_ITEM.itemCode,
              lotNo: response.itemDetails.data.ORIGINAL_ITEM.lotNumber,
              grossWt: response.itemDetails.data.ORIGINAL_ITEM.grossWeight,
              goldWt:
                response.itemDetails.data.ORIGINAL_ITEM.metalWeight.data
                  .goldWeight,
              cutPieceCode: response.itemCode,
              cutPieceLotNo: response.lotNumber,
              cutPieceWt: response.stdWeight,
              itemId: response.id,
              cutPieceValue: response.stdValue,
              formGroup: new FormGroup({
                isHallmarking: new FormControl({
                  value: response?.isHallmarking,
                  disabled: true
                })
              })
            };
            this.cutPieceItemList = [];
            this.cutPieceItemList = [...this.cutPieceItemList, cutPieceTepItem];

            this.commonFacade.setCutPieceTepTotalValue(response.stdValue);
          }
        }
      );
  }

  getProductFacadeError() {
    this.productFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    this.overlayNotificationServiceAbstraction
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getSelectedRsoName() {
    this.tepFacade
      .getSelectedRsoName()
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedRsoName: SelectDropDownOption) => {
        if (!selectedRsoName) {
          this.clearSelectedRsoName = true;
        }
        if (selectedRsoName) {
          this.selectedRso = {
            value: selectedRsoName.value,
            description: selectedRsoName.value
          };
        }
      });
  }

  getSelectedCustomer() {
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (!this.isOpenTask) {
          if (!this.tepTransactionId && customer && customer.customerId) {
            this.customerId = customer.customerId;
            this.customerMobileNumber = customer.mobileNumber;
            this.tepFacade.createOpenTepTransaction(
              SubTransactionTypeEnum.CUT_PIECE_TEP,
              {}
            );
          }
        }
      });
  }

  getOpenTepTransactionId() {
    this.tepFacade
      .getOpenCutPieceTepTransactionResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: createOpenOrPatchCutPieceTepStockManagementResponse) => {
          if (response && response.id) {
            this.tepTransactionId = response.id;
            this.openStatus = response.status;
            this.commonFacade.setTepOrderNumber({
              orderNo: Number(response.docNo),
              status: this.openStatus
            });
            this.loadOpenValues();
            if (this.selectedRso && this.selectedRso.value) {
              this.onSelectedRSONameChanged(this.selectedRso);
            }
          }
        }
      );
  }

  loadOpenValues() {
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.TEP,
      subTxnType: SubTransactionTypeEnum.CUT_PIECE_TEP
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.TEP,
      subTxnType: SubTransactionTypeEnum.CUT_PIECE_TEP,
      pageIndex: 0,
      pageSize: 10
    });
  }

  clearSearchField() {
    this.searchComponent?.clearSearch(null);
  }

  ngOnDestroy() {
    this.tepFacade.clearTepItemConfiguration();
    this.commonFacade.setTepOrderNumber({
      orderNo: 0,
      status: null
    });
    this.isOpenTask = false;
    this.summaryBar.close();
    this.overlayNotificationServiceAbstraction.close();
    this.tepFacade.resetTep();
    this.customerFacade.clearCustomerSearch();
    this.toolbarFacade.resetValues();
    this.productFacade.clearProductList();
    this.clearCutPieceTepData(false);
    this.tepFacade.clearTepItemConfiguration();
    this.destroy$.next();
    this.destroy$.complete();
    this.docNo = 0;
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
