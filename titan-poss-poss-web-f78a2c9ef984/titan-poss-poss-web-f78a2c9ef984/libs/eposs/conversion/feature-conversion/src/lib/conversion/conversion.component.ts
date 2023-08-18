import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConversionFacade } from '@poss-web/eposs/conversion/data-access-conversion';
import {
  ConversionHistoryPopupComponent,
  RequestPopupComponent
} from '@poss-web/eposs/conversion/ui-conversion-request-popup';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CardListComponent } from '@poss-web/shared/components/ui-card-list';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { SelectionDailogOption } from '@poss-web/shared/components/ui-selection-dialog';
import {
  ItemSearchListComponent,
  ItemSearchResponse
} from '@poss-web/shared/item/ui-item-search';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  BinCode,
  Command,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  ConversionHistory,
  ConversionHistoryAdvancedFilterPayload,
  ConversionInventoryItem,
  ConversionItem,
  ConversionItemPayload,
  ConversionRequestItems,
  ConversionRequests,
  ConversionSplitItemPayload,
  ConvertedTransactionHistoryPayload,
  CustomErrors,
  InStockConversionTypesEnum,
  ItemDetailPopupserviceAbstraction,
  ItemDetailsPopupTabType,
  LocationSettingAttributesEnum,
  MetalTypeEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PriceRequestPayload,
  ProductPriceDetails,
  ProductTypesEnum,
  RequestSentHistoryPayload,
  SelectDropDownOption,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';
import {
  fieldValidation,
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import {
  getConversionDetailsRouteUrl,
  getConversionHistoryDetailsRouteUrl,
  getConversionHistoryRouteUrl,
  getConversionRouteUrl,
  getInStockHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { calculatePriceBreakup } from '@poss-web/shared/util-price';

const searchlistShortcutKeyF2 = 'ConversionComponent.MAIN_SEARCH';
const searchShortcutKeyF7 = 'ConversionComponent.SECONDARY_SEARCH';
const cardlistShortcutKeyF4 = 'ConversionComponent.CARD_LIST';
const back = 'ConversionComponent.BACK';
const tab1ShortcutKey = 'Common.TAB_1';
const tab2ShortcutKey = 'Common.TAB_2';
const tab3ShortcutKey = 'Common.TAB_3';
const componentName = 'ConversionComponent';

@Component({
  selector: 'poss-web-conversion',
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss']
})
export class ConversionComponent implements OnInit, OnDestroy, AfterViewInit {
  storeType: string;
  tab: InStockConversionTypesEnum;
  conversionEnumRef = InStockConversionTypesEnum;
  id: number;
  pageSize = 4;
  initialPageSize = 8;
  InStockConversionTypesEnumRef = InStockConversionTypesEnum;
  searchedItemsList: ConversionInventoryItem[] = [];
  isSearchingItems$: Observable<boolean>;
  hasSearchedItems$: Observable<boolean>;

  itemList$: Observable<ConversionInventoryItem[]>;
  hasItem$: Observable<boolean>;

  selectedItem: ConversionItem;
  showChildItems = false;
  showChildItems$: Observable<boolean>;
  parentItem: ConversionInventoryItem;
  imageCatalogueDetails;

  isLoadingCount$: Observable<boolean>;

  conversionRequestsCount = 0;
  conversionRequests$: Observable<ConversionRequests[]>;
  isLoadingConversionRequests$: Observable<boolean>;
  isConversionReqLoadedOnce = false;

  isSearchingRequests$: Observable<boolean>;
  hasSearchedRequests$: Observable<boolean>;
  searchedRequestResult$: Observable<ConversionRequests[]>;

  isLoadingConversionItems$: Observable<boolean>;
  rsoDetails$: Observable<string[]>;
  isLoadingRsoDetails$: Observable<boolean>;

  childItemsWeight = 0;
  hasConversionItemsLoaded = false;

  status: string;
  statusColor: string;
  conversionDocNo = 0;

  childItemArray = [];

  @ViewChild(ItemSearchListComponent)
  searchListRef: ItemSearchListComponent;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  @ViewChild(CardListComponent)
  cardListComponentRef: CardListComponent;

  destroy$: Subject<null> = new Subject<null>();

  parentForm: FormArray;
  rsoForm: FormGroup;
  rsoNames: string[] = [];

  sendReqDocNo = 0;
  binGroupCode: string;
  binCodes: BinCode[] = [];

  binsForSelection: SelectionDailogOption[] = [];

  isL1L2Store: boolean;
  isL3Store: boolean;

  hasNotification = false;
  searchFormControl = new FormControl();
  searchForm: FormGroup;
  advanceFilter = null;
  historyFormGroup: FormGroup;

  type: string;

  isConversionHistoryLoaddedOnce = false;
  conversionHistoryCount$: Observable<number>;
  conversionHistory$: Observable<ConversionHistory[]>;
  sentRequestHistory: ConversionHistory[];

  isLoadingHistory$: Observable<boolean>;
  isLoadingConversionHistory: boolean;

  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('confirmRequestSuccessNotificationTemplate', {
    static: true
  })
  confirmRequestSuccessNotificationTemplate: TemplateRef<any>;
  isShowingErrorNotifcation = false;
  requestType = 'requestSent';
  @ViewChild('conversionHistorySearch', { static: true })
  conversionHistorySearch: ElementRef;
  reqDocNo = null;
  noDataFoundMessage: string;
  enterWeightBinCodeErrorMsg: string;
  rsoNameText: string;

  @ViewChild('tabRef') tabRef: ElementRef;
  rsoNamesArray: SelectDropDownOption[] = [];
  currentFiscalYear: string;
  isLoadAddedImageUrl: boolean;
  isLoadSearchImageUrl: boolean;
  isLoadChildImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;

  standardPrice: {};

  currencyCode: string;
  weightCode: string;
  productType: string;
  stdPriceDetailsTitle: string;
  priceDetailsTitle: string;
  enableAddRowBtn: boolean;
  weightMissmatchError: string;
  priceMissmatchError: string;
  conversionWeightToleranceForBangle: number;
  locationCode: string;
  priceDetails: ProductPriceDetails[];

  constructor(
    private conversionFacade: ConversionFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private shortcutService: ShortcutServiceAbstraction,
    private profiledatafacade: ProfileDataFacade,
    private weightFormatter: WeightFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private commonFacade: CommonFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private itemDetailPopupservice: ItemDetailPopupserviceAbstraction,
    private currencyFormatterService: CurrencyFormatterService,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.translate
      .get([
        'pw.entity.requestsEntity',
        'pw.conversionNotificationMessages.enterWeight-BinCode-errorMsg',
        'pw.conversion.rsoName',
        'pw.conversion.stdPriceTitle',
        'pw.conversion.priceDetailsTitle'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string[]) => {
        this.enterWeightBinCodeErrorMsg =
          translatedMsg[
            'pw.conversionNotificationMessages.enterWeight-BinCode-errorMsg'
          ];
        this.rsoNameText = translatedMsg['pw.conversion.rsoName'];

        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: translatedMsg['pw.entity.requestsEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMessage: string) => {
            this.noDataFoundMessage =
              translatedMessage['pw.global.noDataFoundMessage'];
          });
        this.stdPriceDetailsTitle = translatedMsg['pw.findPrice.stdPriceTitle'];
        this.priceDetailsTitle =
          translatedMsg['pw.findPrice.priceDetailsTitle'];
      });
    this.historyFormGroup = new FormGroup({
      selectRadioButton: new FormControl('requestSent')
    });
    this.parentForm = new FormArray([]);

    this.searchForm = this.formBuilder.group({
      searchValue: [],
      historySearchControl: []
    });

    this.rsoForm = this.formBuilder.group({
      rsoName: ['', this.fieldValidatorsService.requiredField(this.rsoNameText)]
    });
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.clearFilter === false
    ) {
    } else {
      this.conversionFacade.resetAdvanceFilter();
    }
  }

  ngOnInit() {
    this.isLoadingImage$ = this.conversionFacade.getIsLoadingImage();
    this.tab = InStockConversionTypesEnum.SEARCH;
    this.conversionFacade.resetError();
    this.id = this.activatedRoute.snapshot.params['id'];
    this.type = this.activatedRoute.snapshot.params['type'];

    this.tab = this.activatedRoute.snapshot.params['type'];
    if (this.type === InStockConversionTypesEnum.HISTORY) {
      this.requestType = this.activatedRoute.snapshot.params['requestType'];
      this.historyFormGroup.patchValue({
        selectRadioButton: this.requestType
      });
    }

    this.conversionFacade.loadStandardPrice();

    this.historyFormGroup
      .get('selectRadioButton')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((requestType: string) => {
        if (requestType) {
          this.router.navigate([getConversionHistoryRouteUrl(requestType)]);
          this.requestType = requestType;
          this.loadHistory();
        }
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((locationCode: string) => {
        this.locationCode = locationCode;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.INV_CONVERSION_WT_TOLERANCE_FOR_BANGLE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((conversionWeightTolerance: string) => {
        this.conversionWeightToleranceForBangle = Number(
          conversionWeightTolerance
        );
      });
    this.conversionFacade
      .getAdvancedFilter()
      .pipe(takeUntil(this.destroy$))
      .subscribe((advancedFilter: ConversionHistoryAdvancedFilterPayload) => {
        this.advanceFilter = advancedFilter;
        this.loadHistory();
      });

    combineLatest([
      this.profiledatafacade.getBoutiqueType(),
      this.profiledatafacade.isL1Boutique(),
      this.profiledatafacade.isL2Boutique(),
      this.profiledatafacade.isL3Boutique()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([val, val1, val2, val3]) => {
        this.storeType = val;
        this.isL1L2Store = val1 || val2;
        this.isL3Store = val3;
        this.binGroupCode = this.isL1L2Store
          ? InStockConversionTypesEnum.STN
          : InStockConversionTypesEnum.PURCFA;
        this.componentInit();
      });

    this.shortcutService.componentNames = [componentName];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });

    this.parentForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.showNotification();
      });
    this.changeType(this.type);

    this.conversionFacade
      .getStandardPrice()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: {}) => {
        if (data) {
          this.standardPrice = data;
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_WEIGHT_UNIT)
      .pipe(takeUntil(this.destroy$))
      .subscribe(weightCode => {
        this.weightCode = weightCode;
      });
  }

  ngAfterViewInit() {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        const searchValue = this.searchFormControl.value;
        if (searchValue !== '') {
          if (this.validateSearch(searchValue)) {
            this.searchRequests(searchValue);
          } else {
            this.conversionFacade.clearSearchedRequests();
          }
        } else {
          this.clearSearch();
        }
      });
    fromEvent(this.conversionHistorySearch.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((event: any) => {
        this.reqDocNo = this.searchForm.get('historySearchControl').value;

        if (this.reqDocNo !== '') {
          if (this.validateSearch(this.reqDocNo)) {
            this.loadHistory();
          }
        } else {
          this.clearHistorySearch();
        }
      });
  }
  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }
  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    let isTab = false;
    const tabCount = Number(command.name.split('_').pop());
    if (
      (command.name === tab1ShortcutKey ||
        command.name === tab2ShortcutKey ||
        command.name === tab3ShortcutKey) &&
      !isNaN(tabCount) &&
      tabCount <= this.tabRef.nativeElement.children.length
    ) {
      switch (this.tabRef.nativeElement.children[tabCount - 1].id) {
        case InStockConversionTypesEnum.SENT: {
          this.changeType(InStockConversionTypesEnum.SEARCH);
          isTab = true;
          break;
        }
        case InStockConversionTypesEnum.REQUEST: {
          this.changeType(InStockConversionTypesEnum.REQUEST);
          isTab = true;
          break;
        }
        case InStockConversionTypesEnum.HISTORY: {
          this.changeType(InStockConversionTypesEnum.HISTORY);
          isTab = true;
          break;
        }
      }
    }

    if (!isTab) {
      if (command.name === searchlistShortcutKeyF2) {
        if (this.tab === InStockConversionTypesEnum.REQUEST) {
          if (this.searchBox) {
            this.searchBox.nativeElement.focus();
          }
        } else {
          if (this.searchListRef) {
            this.searchListRef.focus();
          }
        }
      } else if (command.name === cardlistShortcutKeyF4) {
        if (this.cardListComponentRef) {
          this.cardListComponentRef.focus();
        }
      } else if (command.name === back) {
        this.back();
      }
    }
  }

  componentInit() {
    this.hasNotification = false;
    this.conversionFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.conversionFacade.loadStuddedProductGroups();
    this.isLoadingCount$ = this.conversionFacade.getIsLoadingConversionRequestCount();
    this.isSearchingItems$ = this.conversionFacade.getIsSearchingItems();
    this.hasSearchedItems$ = this.conversionFacade.getHasSearchedItems();
    this.isLoadingConversionItems$ = this.conversionFacade.getisLoadingConversionItems();
    this.isLoadingConversionRequests$ = this.conversionFacade.getIsLoadingConversionRequests();
    this.hasItem$ = this.conversionFacade.getHasSelectedVarient();

    this.isSearchingRequests$ = this.conversionFacade.getIsSearchingRequests();
    this.hasSearchedRequests$ = this.conversionFacade.getHasSearchedRequests();
    this.searchedRequestResult$ = this.conversionFacade.getSearchedRequests();
    this.conversionFacade.loadBinCodes(this.binGroupCode);
    this.conversionFacade.loadRsoDetails();
    this.isLoadingRsoDetails$ = this.conversionFacade.getIsLoadingRsoDetails();
    this.conversionHistoryCount$ = this.conversionFacade.getConversionHistoryCount();
    this.isLoadingHistory$ = this.conversionFacade.getIsLoadingHistory();
    this.conversionFacade
      .getIsLoadingHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => {
        this.isLoadingConversionHistory = isLoading;
      });
    this.conversionHistory$ = this.conversionFacade.getConversionHistory();
    this.conversionFacade
      .getConversionHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((requestSentHistory: ConversionHistory[]) => {
        if (
          requestSentHistory &&
          requestSentHistory.length !== 0 &&
          !this.isConversionHistoryLoaddedOnce
        ) {
          this.isConversionHistoryLoaddedOnce = true;
        }
      });
    this.conversionFacade
      .getItemSplitResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.conversionDocNo = data.srcDocNo;
        }
      });

    this.conversionFacade
      .getBinCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((bincodes: BinCode[]) => {
        this.binCodes = bincodes;
        this.binsForSelection = bincodes.map(bincode => ({
          id: bincode.binCode,
          description: bincode.description
        }));
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.INVENTORY,
        CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((imageCatalogueDetails: any) => {
        this.imageCatalogueDetails = imageCatalogueDetails;
      });

    this.conversionFacade
      .getSearchedItemsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.searchedItemsList = data;
        if (
          this.isLoadSearchImageUrl &&
          this.searchedItemsList.length > 0 &&
          this.imageCatalogueDetails
        )
          this.loadImage(
            this.searchedItemsList,
            this.imageCatalogueDetails,
            true,
            false
          );
      });
    this.conversionFacade
      .getSelectedVarient()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.parentItem = data[0];
      });

    this.conversionFacade
      .getConversionItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response != null) {
          this.childItemArray = [];
          this.selectedItem = response;
          if (this.selectedItem && this.selectedItem.childItems.length > 0) {
            this.addRowShowOrNot(
              this.selectedItem,
              this.selectedItem.childItems
            );
          }
          if (
            this.isLoadChildImageUrl &&
            this.selectedItem.childItems.length > 0 &&
            this.imageCatalogueDetails
          )
            this.loadImage(
              this.selectedItem.childItems,
              this.imageCatalogueDetails,
              false,
              true
            );
        }
      });
    this.conversionFacade
      .getConversionRequestResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response) {
          this.sendReqDocNo = response.srcDocNo;
          this.showConversionRequestSuccessNotification(response.srcDocNo);
        }
      });
    this.conversionFacade
      .getConversionRequestCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: any) => {
        this.conversionRequestsCount = count;
      });
    this.conversionFacade
      .getHasRsoDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasData: any) => {
        if (hasData) {
          this.conversionFacade
            .getRsoDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((empNames: any) => {
              this.rsoNames = empNames;
              for (const rso of empNames) {
                this.rsoNamesArray = [];
                this.rsoNamesArray.push({
                  value: rso,
                  description: rso
                });
              }
            });
        }
      });

    this.clearAll();
    this.loadRequests(0);
    this.getRequests();
  }
  clearHistoryParams() {
    this.clearAdvancedFilterOptions();
  }

  clearAdvancedFilterOptions() {
    this.advanceFilter = null;
  }
  loadHistory() {
    this.isConversionHistoryLoaddedOnce = false;
    this.conversionFacade.resetConversionHistory();
    this.loadRequests(0);
  }

  getRequests() {
    this.conversionFacade.loadConversionReqCount();
    this.conversionRequests$ = this.conversionFacade.getConversionRequests();
    this.conversionRequests$
      .pipe(takeUntil(this.destroy$))
      .subscribe((requests: ConversionRequests[]) => {
        if (
          requests &&
          requests.length !== 0 &&
          !this.isConversionReqLoadedOnce
        ) {
          this.isConversionReqLoadedOnce = true;
        }
      });
  }

  changeType(newType: any) {
    if (this.tab !== newType) {
      this.tab = newType;
      this.overlayNotification.close();
      if (newType === InStockConversionTypesEnum.HISTORY) {
        this.conversionFacade.resetConversionHistory();
        this.conversionFacade.resetAdvanceFilter();
        this.router.navigate([getConversionHistoryRouteUrl(this.requestType)]);
        this.loadHistory();
      } else if (newType === InStockConversionTypesEnum.REQUEST) {
        this.router.navigate([getConversionRouteUrl(newType)]);
        this.loadRequests(0);
      } else {
        this.router.navigate([getConversionRouteUrl(newType)]);
        this.clearAll();
      }
    }
  }

  search(searchData: ItemSearchResponse) {
    this.showChildItems = false;
    this.selectedItem = null;
    this.childItemArray = [];
    this.conversionFacade.removeFromSelectedVarient();
    this.isLoadSearchImageUrl = true;
    this.conversionFacade.loadSearchedItemsList(searchData.searchValue);
  }
  onSearchItemsSelected(item: ConversionInventoryItem) {
    this.clearAll();
    this.conversionFacade.removeFromSelectedVarient();
    this.conversionFacade.addToSelectedVarient(item);
  }

  isSplitAvailable(item: any) {
    this.showChildItems = false;
    this.isLoadChildImageUrl = true;
    this.conversionFacade.loadConversionItems({
      lotNumber: this.parentItem.lotNumber,
      itemCode: this.parentItem.itemCode,
      itemWeight: this.parentItem.stdWeight,
      binCode: this.parentItem.binCode
    });
    this.conversionFacade
      .getHasConverionItemsLoaded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasItemsLoaded: boolean) => {
        this.hasConversionItemsLoaded = hasItemsLoaded;
        if (this.hasConversionItemsLoaded) {
          this.showChildItems = true;
          if (
            this.selectedItem.studded &&
            this.selectedItem.childItems?.length > 0
          ) {
            this.getItemPriceDetails(this.selectedItem);
            this.mapPriceDetails();
          }
        } else {
          this.showChildItems = false;
        }
        this.showNotification();
      });
  }
  loadRequests(pageIndex) {
    if (this.tab === InStockConversionTypesEnum.REQUEST) {
      this.conversionFacade.loadConversionRequests({
        pageIndex: pageIndex,
        pageSize: pageIndex === 0 ? this.initialPageSize : this.pageSize
      });
    } else if (
      this.tab === InStockConversionTypesEnum.HISTORY &&
      this.isLoadingConversionHistory === false &&
      this.requestType === InStockConversionTypesEnum.REQUEST_SENT
    ) {
      this.conversionFacade.loadRequestSentHistory(
        this.createConversionRequestHistoryPayload(pageIndex)
      );
    } else if (
      this.tab === InStockConversionTypesEnum.HISTORY &&
      this.isLoadingConversionHistory === false &&
      this.requestType === InStockConversionTypesEnum.CONVERTED_TRANSACTION
    ) {
      this.conversionFacade.loadConvertedTransactionHistory(
        this.createConvertedTransactionHistoryPayload(pageIndex)
      );
    }
  }
  createConversionRequestHistoryPayload(pageIndex): RequestSentHistoryPayload {
    if (this.advanceFilter && this.reqDocNo == null) {
      if (
        this.advanceFilter.docNo !== '' &&
        this.advanceFilter.docNo !== null
      ) {
        this.reqDocNo = this.advanceFilter.docNo;
      }
    }
    return {
      requestSentPayload: {
        actionType: InStockConversionTypesEnum.ISSUE,
        dateRangeType: InStockConversionTypesEnum.CUSTOM,
        endDate: this.advanceFilter
          ? this.advanceFilter.requestToDate
          : moment().endOf('day').valueOf(),
        locationCode: null,
        reqDocNo: this.reqDocNo,
        reqFiscalYear: this.advanceFilter
          ? this.advanceFilter.fiscalYear
          : null,
        startDate: this.advanceFilter
          ? this.advanceFilter.requestFromDate
          : moment().startOf('day').valueOf(),
        statuses: this.advanceFilter ? this.advanceFilter.statuses : []
      },
      pageIndex: pageIndex,
      pageSize: this.isConversionHistoryLoaddedOnce
        ? this.pageSize
        : this.initialPageSize,
      requestType: InStockConversionTypesEnum.REQUEST_TYPE
    };
  }
  createConvertedTransactionHistoryPayload(
    pageIndex
  ): ConvertedTransactionHistoryPayload {
    if (this.advanceFilter && this.reqDocNo == null) {
      if (
        this.advanceFilter.docNo !== '' &&
        this.advanceFilter.docNo !== null
      ) {
        this.reqDocNo = this.advanceFilter.docNo;
      }
    }
    return {
      convertedTransaction: {
        actionType: InStockConversionTypesEnum.RECEIVE,
        dateRangeType: InStockConversionTypesEnum.CUSTOM,
        endDate: this.advanceFilter
          ? this.advanceFilter.requestToDate
          : moment().endOf('day').valueOf(),
        issueDocNo: this.reqDocNo,
        issueFiscalYear: null,
        receiveDocNo: null,
        receiveFiscalYear: this.advanceFilter
          ? this.advanceFilter.fiscalYear
          : null,
        startDate: this.advanceFilter
          ? this.advanceFilter.requestFromDate
          : moment().startOf('day').valueOf(),
        statuses: this.advanceFilter ? this.advanceFilter.statuses : []
      },
      pageIndex: pageIndex,
      pageSize: this.isConversionHistoryLoaddedOnce
        ? this.pageSize
        : this.initialPageSize,
      transactionType: InStockConversionTypesEnum.REQUEST_TYPE
    };
  }

  onSelected(request: any) {
    if (this.tab !== InStockConversionTypesEnum.HISTORY) {
      this.router.navigate([getConversionDetailsRouteUrl(request.id)]);
    } else {
      this.router.navigate([
        getConversionHistoryDetailsRouteUrl(
          this.type,
          this.requestType,
          request.id
        )
      ]);
    }
  }
  showRequestPopup() {
    const dialogRef = this.dialog.open(RequestPopupComponent, {
      width: '100vw',
      data: { selectedItem: this.selectedItem, binCodes: this.binCodes },
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res !== 'close') {
          this.sendSplitRequest(res);
        }
      });
  }
  showNotification() {
    if (!this.isShowingErrorNotifcation) {
      this.overlayNotification.close();
      if (this.hasConversionItemsLoaded) {
        this.showChildItems = true;
        if (
          this.selectedItem?.autoApproved &&
          this.parentForm?.valid &&
          !this.enableAddRowBtn
        ) {
          this.showChildItems = true;
          this.convertNowOverlay();
          if (this.selectedItem.isStudded) {
            // this.mapPriceDetails();
          }
        } else if (
          this.selectedItem?.autoApproved &&
          this.parentForm.valid &&
          this.enableAddRowBtn
        ) {
          this.addChildItemOverlay();
        } else if (
          this.selectedItem?.autoApproved &&
          this.parentForm?.invalid
        ) {
          this.enterWeightOverlay();
        } else if (this.selectedItem && !this.selectedItem.autoApproved) {
          this.showChildItems = false;
          this.sendRequestOverlay();
        }
      }
    }
  }
  sendSplitRequest(payload) {
    this.conversionFacade.sendConversionRequest(payload);
    this.showProgressNotification();
  }
  searchRequests(srcDocNo: number) {
    this.conversionFacade.searchConversionRequests(srcDocNo);
  }

  clearSearch() {
    this.searchFormControl.reset();
    this.conversionFacade.clearSearchedRequests();
    this.loadRequests(0);
  }
  clearHistorySearch() {
    this.searchForm.reset();
    this.reqDocNo = null;
    this.loadHistory();
  }
  clearAll() {
    this.parentForm.clear();
    this.conversionFacade.clearLoadedConversionItems();
    this.conversionFacade.removeFromSelectedVarient();
    this.conversionFacade.clearSearchedItemsList();
    this.rsoForm.patchValue({ rsoName: '' }, { emitEvent: false });
    this.overlayNotification.close();
  }
  back() {
    this.router.navigate([getInStockHomeRouteUrl()]);
  }
  createSplitItemPayload(): ConversionSplitItemPayload {
    const issueItem: ConversionItemPayload[] = [
      {
        binCode: null,
        inventoryId: this.selectedItem.inventoryId,
        itemCode: this.selectedItem.itemCode,
        lotNumber: this.selectedItem.lotNumber,
        measuredWeight: +this.weightFormatter.format(
          this.selectedItem.stdWeight
        )
      }
    ];
    const receiveItems: ConversionItemPayload[] = [];

    for (const receivedItem of this.parentForm.controls) {
      const receiveItem: ConversionItemPayload = {
        binCode: receivedItem.value.binCode,
        inventoryId: receivedItem.value.inventoryId,
        itemCode: receivedItem.value.itemCode,
        lotNumber: receivedItem.value.lotNumber,
        measuredWeight: +this.weightFormatter.format(receivedItem.value.weight),
        makingCharges: receivedItem.value.makingCharges,
        makingChargesPct: receivedItem.value.makingChargesPct,
        final_value: receivedItem.value.finalValue
      };
      receiveItems.push(receiveItem);
    }
    const splitItemPayload: ConversionSplitItemPayload = {
      issueItems: issueItem,
      receiveItems: receiveItems,
      rsoName: this.rsoForm.get('rsoName').value
    };
    return splitItemPayload;
  }
  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatus(status?: string) {
    let key = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  errorHandler(error: CustomErrors) {
    this.isShowingErrorNotifcation = true;
    this.hasNotification = true;
    this.overlayNotification.close();

    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        this.isShowingErrorNotifcation = false;
        this.showNotification();
      });
  }
  convertNowOverlay() {
    this.translate
      .get([
        'pw.conversion.confirmOverlayMessage',
        'pw.conversionNotificationMessages.btnText-ConvertNow',
        'pw.conversionNotificationMessages.priceMismatchMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string[]) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText:
              translatedMsg[
                'pw.conversionNotificationMessages.btnText-ConvertNow'
              ],
            message: translatedMsg['pw.conversion.confirmOverlayMessage']
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.rsoForm.get('rsoName').markAsTouched();
              if (this.selectedItem.itemCode.charAt(6) === 'V') {
                const parentItemWeight = this.selectedItem.stdWeight;
                let childItemWeight = 0;
                this.parentForm.controls.forEach(item => {
                  childItemWeight = Number(
                    (childItemWeight + Number(item.value.weight)).toFixed(3)
                  );
                });

                const parentItemPrice = this.priceDetails?.find(
                  x => x.itemCode === this.selectedItem.itemCode
                )?.finalValue;
                let childItemPrice = 0;
                this.priceDetails
                  ?.filter(x => x.itemCode !== this.selectedItem.itemCode)
                  ?.forEach(y => {
                    childItemPrice = childItemPrice + Number(y.finalValue);
                  });
                let priceDiff = Number(
                  Math.abs(parentItemPrice - childItemPrice).toFixed(2)
                );

                if (parentItemWeight !== childItemWeight) {
                  this.weightMissmatchError =
                    'Sum of child item weight should be equal to parent item weight.';
                } else if (this.selectedItem.studded && priceDiff > 2) {
                  this.priceMissmatchError =
                    translatedMsg[
                      'pw.conversionNotificationMessages.priceMismatchMessage'
                    ];
                } else {
                  this.weightMissmatchError = '';
                  if (this.rsoForm.valid) {
                    this.conversionFacade.splitItem(
                      this.createSplitItemPayload()
                    );
                    this.showProgressNotification();
                    this.conversionFacade
                      .getItemSplitResponse()
                      .pipe(takeUntil(this.destroy$))
                      .subscribe((response: any) => {
                        if (response) {
                          this.overlayNotification.close();
                          this.conversionSuccessMsgOverlay();
                        }
                      });
                  } else {
                    this.showNotification();
                  }
                }
              } else {
                if (this.rsoForm.valid) {
                  this.conversionFacade.splitItem(
                    this.createSplitItemPayload()
                  );
                  this.showProgressNotification();
                  this.conversionFacade
                    .getItemSplitResponse()
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((response: any) => {
                      if (response) {
                        this.overlayNotification.close();
                        this.conversionSuccessMsgOverlay();
                      }
                    });
                } else {
                  this.showNotification();
                }
              }
            }
          });
      });
  }
  sendRequestOverlay() {
    this.translate
      .get([
        'pw.conversionNotificationMessages.sendRequestOverlayMessage',
        'pw.conversion.sendRequest'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.hasNotification = false;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            buttonText: translatedMsg['pw.conversion.sendRequest'],
            message:
              translatedMsg[
                'pw.conversionNotificationMessages.sendRequestOverlayMessage'
              ]
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.TRUE) {
              this.showRequestPopup();
            }
          });
      });
  }
  showConversionRequestSuccessNotification(documentNumber: number) {
    this.overlayNotification.close();
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmRequestSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        this.reloadComponent(event);
      });
  }

  enterWeightOverlay() {
    this.overlayNotification.close();
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: this.enterWeightBinCodeErrorMsg
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
      });
  }

  addChildItemOverlay() {
    this.overlayNotification.close();
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: 'Please add other child items'
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
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
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
          });
      });
  }
  conversionSuccessMsgOverlay() {
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasClose: true,
        hasBackdrop: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        this.reloadComponent(event);
      });
  }
  reloadComponent(event: any) {
    if (event.eventType === OverlayNotificationEventType.CLOSE) {
      this.componentInit();
    }
  }
  numberCheck($event: KeyboardEvent) {
    const pattern = fieldValidation.numbersField.pattern;
    return pattern.test($event.key);
  }
  advancedFilter() {
    const dialogRef = this.dialog.open(ConversionHistoryPopupComponent, {
      width: '30vw',
      data: {
        advancedFilter: this.advanceFilter,
        requestType: this.requestType,
        currentFiscalYear: this.currentFiscalYear
      },
      disableClose: true
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== undefined) {
          this.reqDocNo = null;
          this.conversionFacade.storeAdvancedFilterData(data);
          this.loadHistory();
        }
      });
  }
  // Image
  loadImage(
    itemList,
    imageCatalogueDetails,
    isSearchedItem = false,
    isChildItems = false
  ) {
    this.isLoadSearchImageUrl = false;
    this.isLoadChildImageUrl = false;
    itemList.forEach(item => {
      if (item.imageURL !== null && item.imageURL !== undefined) {
        this.conversionFacade.loadSearchVariantThumbnailImageUrl({
          id: item.id,
          itemCode: item.itemCode,
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails,
          isSearchedItem: isSearchedItem,
          isChildItems: isChildItems
        });
      }
    });
  }

  loadImageUrl(event, isSearchedItem = false, isChildItems = false) {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.INVENTORY,
        CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
      )
      .pipe(take(1))
      .subscribe(imageCatalogueDetails => {
        if (event.imageUrl !== null && event.imageUrl !== undefined) {
          this.conversionFacade.loadSearchVariantImageUrl({
            id: event.id,
            itemCode: event.itemCode,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails,
            isSearchedItem: isSearchedItem,
            isChildItems: isChildItems
          });
        }
      });
  }

  getItemPriceDetails(item: ConversionItem) {
    let payload: PriceRequestPayload = {
      itemCode: item.itemCode,
      lotNumber: item.lotNumber,
      inventoryId: item.inventoryId,
      standardPrice: this.standardPrice,
      locationCode: this.locationCode
    };
    this.conversionFacade.loadItemPriceDetails(payload);
  }

  mapPriceDetails() {
    this.conversionFacade
      .getPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ProductPriceDetails[]) => {
        if (data?.length > 0) {
          this.priceDetails = data;
          data.forEach(x => {
            let index = this.selectedItem.childItems.findIndex(
              item => item.itemCode === x.itemCode
            );
            this.selectedItem = JSON.parse(JSON.stringify(this.selectedItem));
            this.selectedItem.childItems[index] = {
              ...this.selectedItem.childItems[index],
              priceDetails: x
            };
            //calculatethis.childItems[index]['priceDetails'] = x;
          });
        }
      });
  }

  mapItemPriceDetails(itemCode: string) {
    return (
      this.priceDetails && this.priceDetails.find(x => x.itemCode === itemCode)
    );
  }

  AddNewChildItem() {
    let smallestChildItem = this.selectedItem.childItems[0];
    let numberOfItem = Number(smallestChildItem.itemCode.charAt(10));
    this.selectedItem.childItems.forEach(item => {
      if (Number(item.itemCode.charAt(10)) < numberOfItem) {
        smallestChildItem = item;
        numberOfItem = Number(smallestChildItem.itemCode.charAt(10));
      }
    });

    const newChildItem = {
      itemCode: smallestChildItem.itemCode,
      productCategoryDesc: smallestChildItem.productCategoryDesc,
      productCategory: smallestChildItem.productCategory,
      productType: null,
      stoneValue: null,
      stdWeight: smallestChildItem.stdWeight,
      stdValue: null,
      complexityCode: smallestChildItem.complexityCode,
      lotNumber: '',
      binCode: null,
      imageURL: smallestChildItem.imageURL,
      inventoryId: null,
      productGroupDesc: smallestChildItem.productGroupDesc,
      productGroup: smallestChildItem.productGroup,
      weightUnit: null,
      currencyCode: null,
      itemDescription: '',
      childItems: null,
      autoApproved: smallestChildItem.autoApproved,
      isStudded: false,
      thumbnailImageURL: '',
      isLoadingImage: false,
      isLoadingThumbnailImage: smallestChildItem.isLoadingThumbnailImage
    };

    if (this.childItemArray.length === 0) {
      this.childItemArray = this.selectedItem.childItems;
    }

    this.childItemArray = [...this.childItemArray, newChildItem];

    if (this.childItemArray.length > 0) {
      this.addRowShowOrNot(this.selectedItem, this.childItemArray);
    }
  }

  addRowShowOrNot(parentItem, childItems) {
    const seventCharOfItem = parentItem.itemCode.charAt(6);
    const sumOfParentItemPices = Number(parentItem.itemCode.charAt(10));
    let sumOfChildItePiecs = 0;
    childItems.forEach(item => {
      if (item.itemCode.charAt(10) === 'A') {
        sumOfChildItePiecs = sumOfChildItePiecs + 1;
      } else {
        sumOfChildItePiecs =
          sumOfChildItePiecs + Number(item.itemCode.charAt(10));
      }
    });

    if (
      this.selectedItem.autoApproved &&
      seventCharOfItem === 'V' &&
      sumOfParentItemPices === 6 &&
      childItems.length === 1 &&
      Number(childItems[0].itemCode.charAt(10)) === 4
    ) {
      this.enableAddRowBtn = false;
      this.sendRequestOverlay();
    } else if (
      this.selectedItem.autoApproved &&
      seventCharOfItem === 'V' &&
      sumOfParentItemPices !== sumOfChildItePiecs
    ) {
      this.enableAddRowBtn = true;
    } else {
      this.enableAddRowBtn = false;
    }
  }

  openPriceDetailsPopup(priceDetails: ProductPriceDetails) {
    let goldRate;
    let platinumRate;
    let silverRate;
    const dataArray =
      priceDetails?.priceDetails?.metalPriceDetails?.metalPrices;
    dataArray?.forEach(element => {
      if (element.metalTypeCode === MetalTypeEnum.GOLD) {
        goldRate = {
          karat: element.karat,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.PLATINUM) {
        platinumRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }

      if (element.metalTypeCode === MetalTypeEnum.SILVER) {
        silverRate = {
          purity: element.purity,
          price: element.ratePerUnit
        };
      }
    });

    const priceResult = calculatePriceBreakup(
      priceDetails?.priceDetails,
      {} as any,
      {
        isUcp: priceDetails?.priceDetails?.isUcp,
        totalValue: this.currencyRoundOff(priceDetails.finalValue),
        weightUnit: this.weightCode,
        weight: priceDetails?.stdWeight
      }
    );
    if (priceDetails.productGroupCode === this.coinCode) {
      this.productType = ProductTypesEnum.COINS;
    } else {
      this.productType = ProductTypesEnum.REGULAR;
    }
    this.itemDetailPopupservice.open({
      title: priceDetails?.lotNumber
        ? this.priceDetailsTitle
        : this.stdPriceDetailsTitle,
      tabs: [
        ItemDetailsPopupTabType.PRICE_DETAILS,
        ItemDetailsPopupTabType.STONE_DETAILS
      ],
      currencyCode: this.currencyCode,
      weightUnit: this.weightCode,
      headerDetails: {
        showTitle: false,
        itemCode: priceDetails?.itemCode,
        lotNumber: priceDetails?.lotNumber ? priceDetails?.lotNumber : '-',
        productCategory: priceDetails?.productCategoryCode,
        productGroup: priceDetails?.productGroupCode,
        grossWeight: priceDetails?.stdWeight,
        netWeight: priceDetails?.priceDetails?.netWeight,
        goldRate: goldRate,
        platinumRate: platinumRate,
        silverRate: silverRate,
        isCOMOrder: priceDetails?.lotNumber ? false : true
      },
      priceBreakup: priceResult
    });
  }

  currencyRoundOff(amount: any) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }
  ngOnDestroy(): void {
    this.parentForm.clear();
    this.destroy$.next();
    this.destroy$.complete();
  }
  trackBy(_: number, item: ConversionItem) {
    return item.inventoryId;
  }
}
