import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import {
  FormGroup,
  AbstractControl,
  FormControl,
  ValidatorFn
} from '@angular/forms';

import { Observable, Subject, combineLatest } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';

import { takeUntil, filter, take, withLatestFrom } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';

import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {
  OtherReceiptItem,
  BinCode,
  Filter,
  Column,
  Lov,
  OtherReceiptStockItemBinGroupCodeEnum,
  CustomErrors,
  OtherReceiptsIssuesEnum,
  OtherReceiptsModel,
  OtherReceiptStockStatusEnum,
  ProductCategory,
  ProductGroup,
  OtherReceiptItemToUpdate,
  otherReceiptStockItemStatusEnum,
  ConfirmOtherReceive,
  OtherReceiptFilterOption,
  OverlayNotificationServiceAbstraction,
  OtherReceiptItemValidate,
  sortFilterDataOtherReceipt,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  Command,
  ShortcutServiceAbstraction,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  printTransactionTypesEnum,
  printDocTypeEnum,
  PrintingServiceAbstraction
} from '@poss-web/shared/models';
import {
  ItemSearchComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import { OtherReceiptsFacade } from '@poss-web/eposs/other-receipt/data-access-other-receipt';
import {
  FilterService,
  FilterActions
} from '@poss-web/shared/components/ui-filter-dialog';
import { SortDialogService } from '@poss-web/shared/components/ui-sort-dialog';
import { ErrorEnums, ErrorTranslateKeyMap } from '@poss-web/shared/util-error';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import {
  getOtherIssuesReceiptUrl,
  get404Url
} from '@poss-web/shared/util-site-routes';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

const mainSearchShortCutKey = 'OtherReceiptDetailsComponent.MAIN_SEARCH';
const filterShortCutKey = 'OtherReceiptDetailsComponent.FILTER';
const sortShortCutKey = 'OtherReceiptDetailsComponent.SORT';
const backShortCutKey = 'OtherReceiptDetailsComponent.BACK';
const binDropdwonShortCutKey = 'OtherReceiptDetailsComponent.PRIMARY_DROPDOWN';
const componentName = 'OtherReceiptDetailsComponent';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
@Component({
  selector: 'poss-web-other-receipt-details',
  templateUrl: './other-receipt-details.component.html',
  styleUrls: ['./other-receipt-details.component.scss']
})
export class OtherReceiptDetailsComponent implements OnInit, OnDestroy {
  selectedStock: OtherReceiptsModel;
  tab: string;
  pageSize = 5;
  pageIndex = 0;

  nonVerifiedItemsPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  verifiedItemsPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  initailPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  searchedItems$: Observable<OtherReceiptItem[]>;
  isSearchingItems$: Observable<boolean>;
  hasSearchedItems$: Observable<boolean>;

  nonVerifiedItemsTotalCount = 0;
  verifiedItemsTotalCount = 0;

  itemsTotalCountLoaded$: Observable<boolean>;
  itemsTotalCountLoading$: Observable<boolean>;

  nonVerifiedItems$: Observable<OtherReceiptItem[]>;
  verifiedItems$: Observable<OtherReceiptItem[]>;
  remarks$: Observable<Lov[]>;
  tolerance$: Observable<number>;

  type: string;
  stockId: string;
  storeType: string;

  maxDate = moment();

  hasError$: Observable<string>;
  isLoading$: Observable<boolean>;
  isNonVerifiedItemsLoading$: Observable<boolean>;
  isVerifiedItemsLoading$: Observable<boolean>;
  transferType: string;

  isAssigningBinToAllItems$: Observable<boolean>;
  isverifiedCountShownOnce = false;
  hasNotification = false;

  isLoadingSelectedStock$: Observable<boolean>;
  isLoadingBinGroups$: Observable<boolean>;
  isLoadingRemarks$: Observable<boolean>;
  isLoadingTolerance$: Observable<boolean>;
  selectedSortBy: string = null;
  selectedProperty: string = null;
  currenTab: string;
  stockType: string;
  @ViewChild(ItemSearchComponent, { static: true })
  searchRef: ItemSearchComponent;
  stockForm: FormGroup;

  destroy$: Subject<null> = new Subject<null>();
  binGroupCode: string;
  binCodes$: Observable<BinCode[]>;
  itemCode: string;
  lotNumber: string;
  maxFilterLimit: any;
  maxSortLimit: any;
  productCategory: { [key: string]: Filter[] };
  productGroup: { [key: string]: Filter[] };
  filterDataNonVerifiedProducts$: Observable<{ [key: string]: Filter[] }>;
  filterTabDataNonVerifiedProducts: { [key: string]: Filter[] };
  filterDataVerifiedProducts$: Observable<{ [key: string]: Filter[] }>;
  filterTabDataVerifiedProducts: { [key: string]: Filter[] };
  sortDataNonVerifiedProducts$: Observable<Column[]>;
  sortDataVerifiedProducts$: Observable<Column[]>;
  printdata$: Observable<any>;
  sortTabDataNonVerifiedProducts: Column[];
  sortTabDataVerifiedProducts: Column[];
  filterData: {};
  filterNonVerified: { key: string; value: any[] }[] = [];
  filterVerified: { key: string; value: any[] }[] = [];
  sortData: any[];
  sortOrder: any;
  sortBy: any;
  sortMapNonverified = new Map();
  sortMapVerified = new Map();
  isParentFormDirty = false;
  itemsCountNonVerified$: Observable<number>;
  itemsCountVerified$: Observable<number>;
  isNonVerifiedItemsLoaded$: Observable<boolean>;
  isVerifiedItemsLoaded$: Observable<boolean>;
  dateFormat: string;
  OtherReceiptsIssuesEnumRef = OtherReceiptsIssuesEnum;
  binCodes: BinCode[] = [];
  binsForSelection: OtherReceiptFilterOption[] = [];
  selectedBinCode: string;
  PrintErrorText: string;
  searchBinCodeLable: string;
  selectBinCodeLable: string;
  pageSizeOptions: number[] = [];

  isL1L2Store = false;
  isL3Store = false;
  isLoggedIn: boolean;
  noDataFoundMessage: '';
  requestDocNumber: number;
  stockTransactionNumber: number;
  isLoadImageUrl: boolean;
  isLoadVerifiedImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private otherReceiptsFacade: OtherReceiptsFacade,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private shortcutService: ShortcutServiceAbstraction,
    private filterService: FilterService,
    private sortDialogService: SortDialogService,
    private selectionDialog: SelectionDialogService,
    private profiledatafacade: ProfileDataFacade,
    private dialog: MatDialog,
    public printingService: PrintingServiceAbstraction,
    private authFacade: AuthFacade,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.sortDialogService.DataSource = sortFilterDataOtherReceipt;
    this.stockForm = new FormGroup(
      {
        searchValue: new FormControl(''),
        binCode: new FormControl(''),
        courierReceivedDate: new FormControl(moment()),
        reasonForDelay: new FormControl(null)
      },
      [this.reasonForDelayValidator()]
    );
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.PrintErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });

    this.stockForm
      .get('binCode')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value && value !== '') {
          this.overlayNotification.close();
          this.hasNotification = false;
          this.showProgressNotification();

          this.otherReceiptsFacade.assignBinToAllItems({
            id: this.selectedStock.id,
            data: {
              binCode: value,
              binGroupCode:
                this.type === OtherReceiptsIssuesEnum.EXHIBITION
                  ? OtherReceiptStockItemBinGroupCodeEnum.EXHIBITION
                  : OtherReceiptStockItemBinGroupCodeEnum.LOAN
            },
            transactionType: this.stockType
          });
        }
      });
    this.translate
      .get([
        'pw.otherReceiptsIssues.searchBinCodeLable',
        'pw.otherReceiptsIssues.selectBinCodeLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.searchBinCodeLable =
          translatedMessages['pw.otherReceiptsIssues.searchBinCodeLable'];
        this.selectBinCodeLable =
          translatedMessages['pw.otherReceiptsIssues.selectBinCodeLable'];
      });
    this.translate
      .get(['pw.entity.otherReceiptEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.otherReceiptEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.isLoadingImage$ = this.otherReceiptsFacade.getIsLoadingImage();
    this.otherReceiptsFacade.loadStuddedProductGroups();

    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && this.isLoggedIn),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const tab = this.activatedRoute.snapshot.params['tab'];
        this.changeTab(tab);
        this.showNotifications();
      });

    this.stockId = this.activatedRoute.snapshot.params['_id'];
    this.type = this.activatedRoute.snapshot.params['type'];
    this.tab = this.activatedRoute.snapshot.params['tab'];

    switch (this.type) {
      case OtherReceiptsIssuesEnum.EXHIBITION: {
        this.transferType = OtherReceiptsIssuesEnum.EXHIBITION_TYPE;
        break;
      }
      case OtherReceiptsIssuesEnum.LOAN_TYPE: {
        this.transferType = OtherReceiptsIssuesEnum.LOAN;
        break;
      }
      case OtherReceiptsIssuesEnum.ADJUSTMENT: {
        this.transferType = OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE;
        break;
      }
      case OtherReceiptsIssuesEnum.LOSS: {
        this.transferType = OtherReceiptsIssuesEnum.LOSS_TYPE;
        break;
      }
      case OtherReceiptsIssuesEnum.PSV: {
        this.transferType = OtherReceiptsIssuesEnum.PSV;
        break;
      }
      case OtherReceiptsIssuesEnum.FOC: {
        this.transferType = OtherReceiptsIssuesEnum.FOC;
        break;
      }
    }

    // TODO : show notfound page
    if (!this.tab || !(this.tab === 'nonverified' || this.tab === 'verified')) {
      this.router.navigate([get404Url()]);
    }

    combineLatest([
      this.profiledatafacade.getBoutiqueType().pipe(takeUntil(this.destroy$)),
      this.profiledatafacade.isL1Boutique().pipe(takeUntil(this.destroy$)),
      this.profiledatafacade.isL2Boutique().pipe(takeUntil(this.destroy$)),
      this.profiledatafacade.isL3Boutique().pipe(takeUntil(this.destroy$))
    ]).subscribe(([val, val1, val2, val3]) => {
      this.storeType = val;
      this.isL1L2Store = val1 || val2;
      this.isL3Store = val3;

      this.binGroupCode =
        this.type === OtherReceiptsIssuesEnum.EXHIBITION
          ? OtherReceiptStockItemBinGroupCodeEnum.EXHIBITION
          : OtherReceiptStockItemBinGroupCodeEnum.LOAN;
    });
    this.getAppSettingsData();
    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => this.shortcutEventHandler(command));
  }
  getAppSettingsData() {
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.initailPageEvent.pageSize = data;
        this.nonVerifiedItemsPageEvent = this.initailPageEvent;
        this.verifiedItemsPageEvent = this.initailPageEvent;
        this.componentInit();
      });

    this.appsettingFacade
      .getMaxFilterLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxFilterLimit = data;
      });

    this.appsettingFacade
      .getMaxSortLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.maxSortLimit = data;
      });
    this.appsettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });
    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
      });
  }

  reasonForDelayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const to = moment();
      const from = control.get('courierReceivedDate').value;
      const dateDiff = moment.duration(to.diff(from)).asHours();
      if (dateDiff > 48) {
        if (
          control.get('reasonForDelay').value === null ||
          control.get('reasonForDelay').value === ''
        ) {
          control.get('reasonForDelay').markAsTouched();
          control
            .get('reasonForDelay')
            .setErrors({ reasonForDelay: 'Reason For Delay is Required' });
          return {
            hasRasonForDelay: 'hasRasonForDelay',
            reasonForDelay: 'pw.stockReceive.reasonForDelayRequiredErrorMessage'
          };
        } else if (
          control.get('reasonForDelay').value.length < 30 ||
          control.get('reasonForDelay').value.length > 250
        ) {
          control.get('reasonForDelay').markAsTouched();
          control.get('reasonForDelay').setErrors({
            reasonForDelay:
              'pw.otherReceiptsIssues.reasonForDelaylimitErrorMessage'
          });

          return {
            hasRasonForDelay: 'hasRasonForDelay',
            reasonForDelay:
              'pw.otherReceiptsIssues.reasonForDelaylimitErrorMessage'
          };
        } else {
          return {
            hasRasonForDelay: 'hasRasonForDelay'
          };
        }
      } else {
        return null;
      }
    };
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    switch (command.name) {
      case mainSearchShortCutKey: {
        if (this.searchRef) {
          this.dialog.closeAll();
          this.searchRef.focus();
        }
        break;
      }
      case filterShortCutKey: {
        this.openFilter();
        break;
      }
      case sortShortCutKey: {
        this.openSort();
        break;
      }
      case backShortCutKey: {
        this.back();
        this.dialog.closeAll();
        break;
      }
      case binDropdwonShortCutKey: {
        if (
          this.nonVerifiedItemsTotalCount === 0 &&
          this.verifiedItemsTotalCount !== 0 &&
          this.tab === OtherReceiptsIssuesEnum.VERIFIED &&
          !(this.filterVerified.length > 0 || this.itemCode)
        ) {
          this.dialog.closeAll();
          this.openBinSelectionPopup();
        }
        break;
      }
      case tab1ShortcutKey: {
        this.changeTab('nonverified');
        break;
      }
      case tab2ShortcutKey: {
        this.changeTab('verified');
        break;
      }
    }
  }

  componentInit() {
    this.otherReceiptsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          // TODO : check all errors after implemention
          this.errorHandler(error);
        }
      });

    this.isLoadingSelectedStock$ = this.otherReceiptsFacade.getIsLoadingSelectedStock();
    this.isLoadingBinGroups$ = this.otherReceiptsFacade.getIsLoadingBinGroups();
    this.isLoadingRemarks$ = this.otherReceiptsFacade.getIsLoadingRemarks();

    this.hasError$ = this.otherReceiptsFacade.getHasError();
    this.isLoading$ = this.otherReceiptsFacade.getIsLoading();

    this.nonVerifiedItems$ = this.otherReceiptsFacade.getNonVerifiedItems();
    this.verifiedItems$ = this.otherReceiptsFacade.getVerifiedItems();
    this.itemsCountNonVerified$ = this.otherReceiptsFacade.getItemsCountNonVerified();
    this.itemsCountVerified$ = this.otherReceiptsFacade.getItemsCountVerified();
    this.isNonVerifiedItemsLoading$ = this.otherReceiptsFacade.getIsNonVerifiedItemsLoading();
    this.isVerifiedItemsLoading$ = this.otherReceiptsFacade.getIsVerifiedItemsLoading();
    this.itemsTotalCountLoaded$ = this.otherReceiptsFacade.getItemsTotalCountLoaded();
    this.itemsTotalCountLoading$ = this.otherReceiptsFacade.getIsItemsTotalCountLoading();
    this.isSearchingItems$ = this.otherReceiptsFacade.getIsSearchingItems();
    this.hasSearchedItems$ = this.otherReceiptsFacade.getHasSearchedItems();
    this.isNonVerifiedItemsLoaded$ = this.otherReceiptsFacade.getIsNonVerifiedItemsLoaded();
    this.isVerifiedItemsLoaded$ = this.otherReceiptsFacade.getIsVerifiedItemsLoaded();
    this.remarks$ = this.otherReceiptsFacade.getRemarks();
    this.printdata$ = this.otherReceiptsFacade.getPrintDataResponse();
    this.printdata$
      .pipe(
        filter(data => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        const printData = [
          {
            type: 'pixel',
            format: 'html',
            flavor: 'plain',
            data: data
          }
        ];
      });

    this.verifiedItems$
      .pipe(
        withLatestFrom(
          this.commonFacade.getCommonFacadeAttributes(
            CommomStateAttributeTypeEnum.INVENTORY,
            CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([itemList, imageCatalogueDetails]) => {
        if (itemList.length !== 0) {
          if (
            this.isLoadVerifiedImageUrl &&
            itemList.length > 0 &&
            imageCatalogueDetails
          )
            this.loadImage(itemList, imageCatalogueDetails, true);
        }
      });

    this.nonVerifiedItems$
      .pipe(
        withLatestFrom(
          this.commonFacade.getCommonFacadeAttributes(
            CommomStateAttributeTypeEnum.INVENTORY,
            CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([itemList, imageCatalogueDetails]) => {
        if (itemList.length !== 0) {
          if (
            this.isLoadImageUrl &&
            itemList.length > 0 &&
            imageCatalogueDetails
          )
            this.loadImage(itemList, imageCatalogueDetails, false);
        }
      });
    this.otherReceiptsFacade.loadBinCodes(this.binGroupCode);
    this.otherReceiptsFacade.loadRemarks();
    this.otherReceiptsFacade
      .getBinCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((bincodes: BinCode[]) => {
        if (bincodes) {
          this.binCodes = bincodes;
          this.binsForSelection = bincodes.map(bincode => ({
            id: bincode.binCode,
            description: bincode.description
          }));
        }
      });
    if (this.type === OtherReceiptsIssuesEnum.LOAN_TYPE) {
      this.stockType = OtherReceiptsIssuesEnum.LOAN;
    } else if (this.type === OtherReceiptsIssuesEnum.EXHIBITION) {
      this.stockType = OtherReceiptsIssuesEnum.EXHIBITION_TYPE;
    }
    this.otherReceiptsFacade.loadSelectedStock({
      id: this.stockId,
      transactionType: this.stockType
    });

    this.otherReceiptsFacade
      .getSelectedStock()
      .pipe(takeUntil(this.destroy$))
      .subscribe((stockTransferNote: OtherReceiptsModel) => {
        if (stockTransferNote) {
          if (
            stockTransferNote.status.toLowerCase() !==
            OtherReceiptStockStatusEnum.ISSUED.toLowerCase()
          ) {
            this.router.navigate([get404Url()]);
          } else {
            this.selectedStock = stockTransferNote;
            this.initialLoad();
          }
        }
      });

    this.otherReceiptsFacade
      .getNonVerifiedItemsTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.nonVerifiedItemsTotalCount = count;
        this.showNotifications();
      });

    this.otherReceiptsFacade
      .getVerifiedItemsTotalCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.verifiedItemsTotalCount = count;
        this.showNotifications();
      });

    this.itemsTotalCountLoaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoaded: boolean) => {
        if (isLoaded) {
          this.showNotifications();
        }
      });

    this.otherReceiptsFacade
      .getUpdateItemSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.showNotifications();
        }
      });
    this.otherReceiptsFacade
      .getVerifyItemSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isVerified: boolean) => {
        if (isVerified) {
          this.loadNonVerifiedItems();
        }
      });
    this.otherReceiptsFacade
      .getIsVerifyingAllItemSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.changeTab('verified');
        }
      });

    this.isAssigningBinToAllItems$ = this.otherReceiptsFacade.getIsAssigningBinToAllItems();

    this.otherReceiptsFacade
      .getIsAssigningBinToAllItemsSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSuccess: boolean) => {
        const binCode = this.stockForm.get('binCode').value;
        if (isSuccess) {
          this.loadVerifiedItems();
          this.showAssignBinToAllSuccessNotification(binCode);
          this.stockForm.get('binCode').reset();
        } else if (isSuccess === false) {
          this.stockForm.get('binCode').reset();
        }
      });

    this.otherReceiptsFacade
      .getConfirmedStock()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmedStock: any) => {
        if (confirmedStock) {
          this.requestDocNumber = confirmedStock.destDocNo;
          this.stockTransactionNumber = confirmedStock.id;
          // this.showConfirmReceiveSuccessNotification(confirmedStock.destDocNo);
          this.showSuccessMessageNotification();
        }
      });

    this.getFilterAndSortData();
  }
  getFilterAndSortData() {
    this.otherReceiptsFacade.loadProductCategories();
    this.otherReceiptsFacade.loadProductGroups();
    this.otherReceiptsFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productCategories: ProductCategory[]) => {
        if (productCategories !== null) {
          this.productCategory = this.mapToFilterOptions(
            'Product Category',
            productCategories.map(productCategory => ({
              id: productCategory.productCategoryCode,
              description: productCategory.description
            }))
          );
        }
      });

    this.otherReceiptsFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: ProductGroup[]) => {
        if (productGroups !== null) {
          this.productGroup = this.mapToFilterOptions(
            'Product Group',
            productGroups.map(productGroup => ({
              id: productGroup.productGroupCode,
              description: productGroup.description
            }))
          );
        }
      });

    this.filterDataNonVerifiedProducts$ = this.otherReceiptsFacade.getfilterDataNonVerifiedProducts();
    this.filterDataNonVerifiedProducts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterValue => {
        this.filterTabDataNonVerifiedProducts = filterValue;
      });
    this.filterDataVerifiedProducts$ = this.otherReceiptsFacade.getfilterDataVerifiedProducts();
    this.filterDataVerifiedProducts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterValue => {
        this.filterTabDataVerifiedProducts = filterValue;
      });

    this.sortDataNonVerifiedProducts$ = this.otherReceiptsFacade.getSortDataNonVerifiedProducts();
    this.sortDataNonVerifiedProducts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sortValue => {
        this.sortTabDataNonVerifiedProducts = sortValue;
      });
    this.sortDataVerifiedProducts$ = this.otherReceiptsFacade.getSortDataVerifiedProducts();
    this.sortDataVerifiedProducts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sortValue => {
        this.sortTabDataVerifiedProducts = sortValue;
      });
  }
  initialLoad() {
    this.otherReceiptsFacade.loadItemsTotalCount({
      transactionType: this.stockType,
      id: this.selectedStock.id
    });

    if (this.tab === 'nonverified') {
      this.loadNonVerifiedItems();
    } else if (this.tab === 'verified') {
      this.loadVerifiedItems();
    }
  }

  changeTab(newTab: string) {
    if (this.tab !== newTab) {
      this.tab = newTab;

      this.clearSearchItems();
      this.hasNotification = false;

      this.router
        .navigate(['..', this.tab], {
          relativeTo: this.activatedRoute
        })
        .then(isTabChangeSuccess => {
          if (isTabChangeSuccess) {
            this.showNotifications();
          }
        });

      if (this.tab === 'nonverified') {
        this.nonVerifiedItemsPageEvent = this.initailPageEvent;
        this.loadNonVerifiedItems();
      } else if (this.tab === 'verified') {
        this.verifiedItemsPageEvent = this.initailPageEvent;
        this.loadVerifiedItems();
      }
    }
  }

  /**
   * Search searchItems based on varient code
   */
  searchItems(searchData: ItemSearchResponse) {
    this.itemCode = searchData.searchValue;
    this.lotNumber = searchData.lotNumber;
    if (searchData.isValid) {
      this.initialLoad();
    } else {
      this.otherReceiptsFacade.clearItems();
    }
  }

  /**
   * clears the search result
   */
  clearSearchItems() {
    this.itemCode = null;
    this.lotNumber = null;
    if (this.searchRef) {
      this.searchRef.reset();
    }
    this.initialLoad();
    this.showNotifications();
  }

  loadNonVerifiedItems() {
    if (this.selectedStock) this.isLoadImageUrl = true;
    this.otherReceiptsFacade.loadNonVerifiedItems({
      id: this.selectedStock.id,
      pageIndex: this.nonVerifiedItemsPageEvent.pageIndex,
      pageSize: this.nonVerifiedItemsPageEvent.pageSize,
      sortBy: this.selectedSortBy,
      property: this.selectedProperty,
      transactionType: this.stockType,
      itemCode: this.itemCode,
      lotNumber: this.lotNumber,
      sort: this.sortMapNonverified,
      filter: this.filterNonVerified
    });
  }

  loadVerifiedItems() {
    if (this.selectedStock) {
      this.isLoadVerifiedImageUrl = true;
      this.otherReceiptsFacade.loadVerifiedItems({
        id: this.selectedStock.id,
        pageIndex: this.verifiedItemsPageEvent.pageIndex,
        pageSize: this.verifiedItemsPageEvent.pageSize,
        sortBy: this.selectedSortBy,
        property: this.selectedProperty,
        transactionType: this.stockType,
        itemCode: this.itemCode,
        lotNumber: this.lotNumber,
        sort: this.sortMapVerified,
        filter: this.filterVerified
      });
    }
  }

  verifyItem(itemToUpdate: OtherReceiptItemToUpdate) {
    this.otherReceiptsFacade.verifyItem({
      id: this.selectedStock.id,
      itemId: itemToUpdate.id,
      newUpdate: itemToUpdate.newUpdate,
      actualDetails: itemToUpdate.actualDetails,
      transactionType: this.stockType
    });
  }

  updateItem(itemToUpdate: OtherReceiptItemToUpdate) {
    this.otherReceiptsFacade.updateItem({
      id: this.selectedStock.id,
      itemId: itemToUpdate.id,
      newUpdate: itemToUpdate.newUpdate,
      actualDetails: itemToUpdate.actualDetails,
      transactionType: this.stockType
    });
  }

  paginateNonVerifedItems(event: PageEvent) {
    this.nonVerifiedItemsPageEvent = event;
    this.loadNonVerifiedItems();
  }

  paginateVerifedItems(event: PageEvent) {
    this.verifiedItemsPageEvent = event;
    this.loadVerifiedItems();
  }

  onParentFormDirty(isDirty) {
    this.isParentFormDirty = isDirty;
    this.showNotifications();
  }

  showNotifications() {
    this.overlayNotification.close();
    if (
      !this.isParentFormDirty &&
      this.nonVerifiedItemsTotalCount !== 0 &&
      this.tab === OtherReceiptsIssuesEnum.NON_VERIFIED &&
      (this.itemCode === null || this.itemCode === undefined) &&
      this.filterNonVerified.length === 0
    ) {
      this.showVerifyAllNotification(this.nonVerifiedItemsTotalCount);
    }
    if (
      this.verifiedItemsTotalCount !== 0 &&
      this.tab === OtherReceiptsIssuesEnum.VERIFIED
    ) {
      if (
        this.nonVerifiedItemsTotalCount === 0 &&
        (this.itemCode === null || this.itemCode === undefined) &&
        this.filterVerified.length === 0
      ) {
        this.showConfirmReceiveNotificationTranslator();
      } else if (!this.isverifiedCountShownOnce) {
        this.showVerifiedItemCountNotification(this.verifiedItemsTotalCount);
      }
    }
  }

  showVerifyAllNotification(count: number = 0) {
    const key =
      'pw.stockReceiveNotificationMessages.nonVerifiedProductsCountMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: count + ' ' + translatedMessage,
            buttonText: 'VERIFY ALL'
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.showProgressNotification();
              this.otherReceiptsFacade.verifyAllItems({
                id: this.selectedStock.id,
                data: {
                  binCode: null,
                  status: otherReceiptStockItemStatusEnum.VERIFIED
                },
                transactionType: this.stockType
              });
            }
          });
      });
  }

  showConfirmReceiveNotificationTranslator(
    key: string = 'pw.stockReceiveNotificationMessages.confirmReceiveMessage'
  ) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.showConfirmReceiveNotification(translatedMessage);
      });
  }

  showConfirmReceiveNotification(message: string) {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ACTION,
        message: message,
        buttonText: 'CONFIRM RECEIVE',
        hasRemarks: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;

        if (event.eventType === OverlayNotificationEventType.TRUE) {
          if (
            !(this.isL1L2Store && this.stockForm.hasError('reasonForDelay'))
          ) {
            this.showProgressNotification();
            let confirmReceiveData: ConfirmOtherReceive;
            if (this.isL1L2Store) {
              confirmReceiveData = {
                courierReceivedDate: (this.stockForm.value[
                  'courierReceivedDate'
                ] as moment.Moment).format(),
                reasonForDelay: this.stockForm.value['reasonForDelay']
                  ? this.stockForm.value['reasonForDelay']
                  : '',
                remarks: event.data
              };
            } else if (this.isL3Store) {
              confirmReceiveData = {
                receivedDate: (this.stockForm.value[
                  'courierReceivedDate'
                ] as moment.Moment).format(),
                remarks: event.data
              };
            }
            this.otherReceiptsFacade.confirmStock({
              id: this.selectedStock.id,
              confirmReceive: confirmReceiveData,
              transactionType: this.stockType
            });
          } else {
            this.showConfirmReceiveNotificationTranslator(
              'pw.stockReceiveNotificationMessages.reasonForDelayMessage'
            );
          }
        }
      });
  }

  showVerifiedItemCountNotification(count: number) {
    const key =
      'pw.stockReceiveNotificationMessages.verifiedProductsCountMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: count + ' ' + translatedMessage
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.isverifiedCountShownOnce = true;
            }
          });
      });
  }

  showVerifyAllFailureNotification() {
    const key = 'pw.stockReceiveNotificationMessages.verifyAllFailedMessge';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.showFailureNotification(event);
          });
      });
  }

  showAssignBinToAllSuccessNotification(binCode: string) {
    const key = 'pw.stockReceiveNotificationMessages.assignBinAllSuccessMessge';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.showConfirmReceiveNotification(
          translatedMessage.replace('{0}', binCode)
        );
      });
  }

  showAssignBinToAllFailureNotification(binCode: string) {
    const key = 'pw.stockReceiveNotificationMessages.assignBinAllFailedMessge';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage.replace('{0}', binCode),
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.showFailureNotification(event);
          });
      });
  }

  showProgressNotification() {
    const key = 'pw.stockReceiveNotificationMessages.progressMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.PROGRESS,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.hasNotification = false;
          });
      });
  }

  /* showConfirmReceiveSuccessNotification(documentNumber: number) {
    const key =
      'pw.stockReceiveNotificationMessages.confirmReceiveSuccessMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg + ' ' + documentNumber,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.router.navigate([
                getOtherIssuesReceiptUrl(
                  OtherReceiptsIssuesEnum.OTHER_RECEIPTS,
                  this.type
                )
                /* 'inventory/instock/other-receipts-issues-list/otherreceipts/' +
                  this.type
              ]);
            }
          });
      });
  } */
  showSuccessMessageNotification() {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.successCancelCloseOperation(event);
      });
  }
  successCancelCloseOperation(event: OverlayNotificationEventRef) {
    if (event.eventType === OverlayNotificationEventType.CLOSE) {
      this.router.navigateByUrl(
        getOtherIssuesReceiptUrl(
          OtherReceiptsIssuesEnum.OTHER_RECEIPTS,
          this.type
        )
      );
    }
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (event.eventType === OverlayNotificationEventType.CLOSE) {
            this.showNotifications();
          }
        });
    }
    if (
      error.code === ErrorEnums.ERR_INV_005 ||
      error.code === ErrorEnums.ERR_INV_009
    ) {
      this.showConfirmReceiveNotificationTranslator(
        ErrorTranslateKeyMap.get(error.code)
      );
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error,
          hasBackdrop:
            error.code === ErrorEnums.ERR_INV_013 ||
            error.code === ErrorEnums.ERR_INV_029
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          this.hasNotification = false;
          if (event.eventType === OverlayNotificationEventType.CLOSE) {
            if (
              error.code === ErrorEnums.ERR_INV_013 ||
              error.code === ErrorEnums.ERR_INV_029
            ) {
              this.router.navigate([
                getOtherIssuesReceiptUrl(
                  OtherReceiptsIssuesEnum.OTHER_RECEIPTS,
                  this.type
                )
                /* 'inventory/instock/other-receipts-issues-list/otherreceipts/' +
                  this.type */
              ]);
            } else {
              this.showNotifications();
            }
          }
        });
    }
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
        this.showSuccessMessageNotification();
      });
  }

  print() {
    this.printingService.loadPrintData({
      printType: this.transferType,
      transacionId: this.stockTransactionNumber,
      transacionType: printTransactionTypesEnum.OTHER_RECEIVE,
      doctype: printDocTypeEnum.STOCK_PRINT
    });
  }

  selectedSort(sortSelection: string) {
    if (this.tab === 'nonverified') {
      this.isLoadImageUrl = true;
      this.otherReceiptsFacade.loadNonVerifiedItems({
        id: this.selectedStock.id,
        pageIndex: this.nonVerifiedItemsPageEvent.pageIndex,
        pageSize: this.nonVerifiedItemsPageEvent.pageSize,
        sortBy: 'itemWeight',
        property: sortSelection,
        transactionType: this.stockType
      });
    } else {
      this.isLoadVerifiedImageUrl = true;
      this.otherReceiptsFacade.loadVerifiedItems({
        id: this.selectedStock.id,
        pageIndex: this.verifiedItemsPageEvent.pageIndex,
        pageSize: this.verifiedItemsPageEvent.pageSize,
        sortBy: 'itemWeight',
        property: sortSelection,
        transactionType: this.stockType
      });
    }
  }
  openFilter(): void {
    this.filterService.DataSource = {
      ...this.productCategory,
      ...this.productGroup
    };
    this.dialog.closeAll();
    let filterTabData: { [key: string]: Filter[] } = {};
    if (this.tab === OtherReceiptsIssuesEnum.NON_VERIFIED) {
      filterTabData = this.filterTabDataNonVerifiedProducts;
    } else if (this.tab === OtherReceiptsIssuesEnum.VERIFIED) {
      filterTabData = this.filterTabDataVerifiedProducts;
    }
    this.filterService
      .openDialog(this.maxFilterLimit, filterTabData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (filterResult: {
          data: { [key: string]: Filter[] };
          actionfrom: string;
        }) => {
          if (filterResult.actionfrom === FilterActions.APPLY) {
            if (this.tab === OtherReceiptsIssuesEnum.NON_VERIFIED) {
              this.otherReceiptsFacade.setOtherReciptNonVerifiedFilter(
                filterResult.data
              );
              const filterData = filterResult.data;
              if (filterData == null) {
                this.filterData = {};
              } else {
                this.filterData = filterData;
              }
              this.filterNonVerified = [];
              if (filterData) {
                let filterValues = [];
                if (filterData['Product Group']) {
                  filterData['Product Group'].forEach(value => {
                    filterValues.push(value.id);
                  });
                  if (filterValues.length > 0) {
                    this.filterNonVerified.push({
                      key: 'productGroup',
                      value: filterValues
                    });
                  }
                }
                filterValues = [];
                if (filterData['Product Category']) {
                  filterData['Product Category'].forEach(value => {
                    filterValues.push(value.id);
                  });
                  if (filterValues.length > 0) {
                    this.filterNonVerified.push({
                      key: 'productCategory',
                      value: filterValues
                    });
                  }
                }
              }
              this.nonVerifiedItemsPageEvent = this.initailPageEvent;
            } else if (this.tab === OtherReceiptsIssuesEnum.VERIFIED) {
              this.otherReceiptsFacade.setOtherReciptVerifiedFilter(
                filterResult.data
              );
              const filterData = filterResult.data;
              if (filterData == null) {
                this.filterData = {};
              } else {
                this.filterData = filterData;
              }
              this.filterVerified = [];
              if (filterData) {
                let filterValues = [];
                if (filterData['Product Group']) {
                  filterData['Product Group'].forEach(value => {
                    filterValues.push(value.id);
                  });
                  if (filterValues.length > 0) {
                    this.filterVerified.push({
                      key: 'productGroup',
                      value: filterValues
                    });
                  }
                }
                filterValues = [];
                if (filterData['Product Category']) {
                  filterData['Product Category'].forEach(value => {
                    filterValues.push(value.id);
                  });
                  if (filterValues.length > 0) {
                    this.filterVerified.push({
                      key: 'productCategory',
                      value: filterValues
                    });
                  }
                }
              }
              this.verifiedItemsPageEvent = this.initailPageEvent;
            }
            this.initialLoad();
          }
        }
      );
  }
  openSort(): void {
    this.dialog.closeAll();
    let sortTabData: Column[] = [];
    if (this.tab === OtherReceiptsIssuesEnum.NON_VERIFIED) {
      sortTabData = this.sortTabDataNonVerifiedProducts;
    } else if (this.tab === OtherReceiptsIssuesEnum.VERIFIED) {
      sortTabData = this.sortTabDataVerifiedProducts;
    }
    this.sortDialogService
      .openDialog(this.maxSortLimit, sortTabData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        if (sortResult.actionfrom === FilterActions.APPLY) {
          if (this.tab === OtherReceiptsIssuesEnum.NON_VERIFIED) {
            this.otherReceiptsFacade.setOtherReceiptNonVerifiedProductsSort(
              sortResult.data
            );
            this.sortMapNonverified.clear();
            const sortData = sortResult.data;
            if (sortData == null || sortData.length === 0) {
              this.sortData = [];
              this.sortOrder = null;
              this.sortBy = null;
            } else {
              this.sortData = sortData;
              if (sortData.length > 0) {
                if (sortData[0].id === 0) {
                  this.sortBy = 'issuedWeight';
                } else if (sortData[0].id === 1) {
                  this.sortBy = 'issuedQuantity';
                }
                this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
              }
            }
            if (this.sortBy !== null && this.sortOrder !== null) {
              this.sortMapNonverified.set(
                'sort',
                this.sortBy + ',' + this.sortOrder
              );
            }
            this.nonVerifiedItemsPageEvent = this.initailPageEvent;
          } else if (this.tab === OtherReceiptsIssuesEnum.VERIFIED) {
            this.otherReceiptsFacade.setOtherReceiptVerifiedProductsSort(
              sortResult.data
            );
            this.sortMapVerified.clear();
            const sortData = sortResult.data;
            if (sortData == null || sortData.length === 0) {
              this.sortData = [];
              this.sortOrder = null;
              this.sortBy = null;
            } else {
              this.sortData = sortData;
              if (sortData.length > 0) {
                if (sortData[0].id === 0) {
                  this.sortBy = 'issuedWeight';
                } else if (sortData[0].id === 1) {
                  this.sortBy = 'issuedQuantity';
                }
                this.sortOrder = sortData[0].sortAscOrder ? 'ASC' : 'DESC';
              }
            }
            if (this.sortBy !== null && this.sortOrder !== null) {
              this.sortMapVerified.set(
                'sort',
                this.sortBy + ',' + this.sortOrder
              );
            }
            this.verifiedItemsPageEvent = this.initailPageEvent;
          }
          this.initialLoad();
        }
      });
  }
  mapToFilterOptions(
    key: string,
    options: OtherReceiptFilterOption[]
  ): { [key: string]: Filter[] } {
    return {
      [key]: options.map(option => ({
        id: option.id,
        description: option.description,
        selected: false
      }))
    };
  }
  showFailureNotification(event: OverlayNotificationEventRef) {
    this.hasNotification = false;
    if (event.eventType === OverlayNotificationEventType.CLOSE) {
      this.showNotifications();
    }
  }
  openBinSelectionPopup(event = null) {
    if (event) {
      event.stopPropagation();
    }

    this.selectionDialog
      .open({
        title: this.selectBinCodeLable,
        placeholder: this.searchBinCodeLable,
        options: this.binsForSelection
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: OtherReceiptFilterOption) => {
        if (selectedOption) {
          this.selectedBinCode = selectedOption.id;
          this.showProgressNotification();
          this.otherReceiptsFacade.assignBinToAllItems({
            transactionType: this.selectedStock.transactionType,
            id: this.selectedStock.id,
            data: {
              binCode: selectedOption.id,
              binGroupCode:
                this.type === OtherReceiptsIssuesEnum.EXHIBITION
                  ? OtherReceiptStockItemBinGroupCodeEnum.EXHIBITION
                  : OtherReceiptStockItemBinGroupCodeEnum.LOAN
            }
          });
        }
      });
  }
  validateItem(data: OtherReceiptItemValidate) {
    if (this.tab === 'nonverified') {
      this.otherReceiptsFacade.validateNonVerifiedItem(data);
    } else {
      this.otherReceiptsFacade.validateVerifiedItem(data);
    }
  }
  back() {
    this.router.navigate([
      getOtherIssuesReceiptUrl(
        OtherReceiptsIssuesEnum.OTHER_RECEIPTS,
        this.type
      )
    ]);
  }
  // Image
  loadImage(
    itemList: OtherReceiptItem[],
    imageCatalogueDetails,
    isVerifiedItems
  ) {
    if (isVerifiedItems) this.isLoadVerifiedImageUrl = false;
    else this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if (item.imageURL !== null && item.imageURL !== undefined) {
        this.otherReceiptsFacade.loadThumbnailImageUrl({
          id: item.id,
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails,
          isVerifiedItems: isVerifiedItems
        });
      }
    });
  }

  loadImageUrl(event, isVerifiedItems) {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.INVENTORY,
        CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
      )
      .pipe(take(1))
      .subscribe(imageCatalogueDetails => {
        if (event.imageUrl !== null && event.imageUrl !== undefined) {
          this.otherReceiptsFacade.loadImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails,
            isVerifiedItems: isVerifiedItems
          });
        }
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayNotification.close();
    this.printingService.resetPrint();
  }
}
