import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { getFocConfigurationRouteUrl } from '@poss-web/shared/util-site-routes';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Subject, Observable, fromEvent } from 'rxjs';
import {
  focSchemeBasedEnums,
  SaveVariantDetailsPayload,
  ValueBasedVariantDetails,
  ProductGroupMappingOption,
  SaveProductGroup,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  CustomErrors,
  LocationMappingServiceAbstraction,
  LocationMappingFormType,
  SaveLocationPayload,
  FocLocationList,
  FOCItemCodes,
  WeightBasedVariantDetails,
  SchemeDetails,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  SelectDropDownOption,
  FocTypeState
} from '@poss-web/shared/models';
import { FocConfigurationFacade } from '@poss-web/eposs/foc-config/data-access-foc-config';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { MatDialog } from '@angular/material/dialog';
import { FocItemMappingPopupComponent } from '@poss-web/eposs/foc-config/ui-foc-item-mapping-popup';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { ErrorGridPopupComponent } from '@poss-web/shared/components/ui-error-grid-popup';

@Component({
  selector: 'poss-web-foc-variant-details',
  templateUrl: './foc-variant-details.component.html'
})
export class FocVariantDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit {
  isLoading$: Observable<boolean>;
  selectedTab = 0;
  utcOffset = moment().startOf('day').utcOffset();
  hasChange: boolean;
  invalidSearch = false;
  invalidLocationSearch = false;
  focSchemeDetailsForm: FormGroup;
  destroy$ = new Subject<null>();
  itemType = focSchemeBasedEnums.GOLD_COIN;
  category = focSchemeBasedEnums.VALUE_BASED;
  configId: string;
  selectedValueBased = focSchemeBasedEnums.GOLD_COIN;
  selectedWeightBased = focSchemeBasedEnums.GOLD_COIN;
  valueBasedVariantDetails$: Observable<ValueBasedVariantDetails[]>;
  locationList$: Observable<FocLocationList[]>;
  locationList: FocLocationList[] = [];
  weightBasedVariantDetails$: Observable<WeightBasedVariantDetails[]>;
  selectedProductGroups$: Observable<ProductGroupMappingOption[]>;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl(),
    locationSearch: new FormControl()
  });
  @ViewChild('locationSearchBox', { static: true })
  locationSearchBox: ElementRef;
  locationSearchForm = new FormGroup({
    locationSearch: new FormControl()
  });
  isRemoving = false;
  focItemCodes: FOCItemCodes[] = [];
  focItemCodePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };

  locationPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };

  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  totalFocItems$: Observable<number>;
  totalLocations$: Observable<number>;
  mappedFocItems: FOCItemCodes[];
  offerType: any;
  hasRemoved = false;
  schemeName: string;
  prodouctGroupLoadingError: boolean;
  event: any;
  selectedGroups: Subject<any> = new Subject<any>();
  observable = this.selectedGroups.asObservable();
  hasUpdatedProductGroups = false;
  focEligiblity: string;
  itemTypeDropDownArray: SelectDropDownOption[] = [];
  itemTypeControl = new FormControl(focSchemeBasedEnums.GOLD_COIN);
  totalFocItems: number;
  mappedFocItemCodes: FOCItemCodes[] = [];
  schemeDetails: SchemeDetails;
  selectFocSchemDateLabel: string;
  totalLocationsCount: number;
  selectedLocations: { id: string; description: string }[];
  errorMessageToMapFocItemCode: string;
  getFocTypeState$: Observable<any>;
  focTypeDetails: FocTypeState;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public focConfigurationFacade: FocConfigurationFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private locationMappingService: LocationMappingServiceAbstraction,
    private dialog: MatDialog,
    private appsettingFacade: AppsettingFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.focConfigurationFacade.getIsloading();
    this.focConfigurationFacade.loadReset();
    this.isLoading$ = this.focConfigurationFacade.getIsloading();
    this.valueBasedVariantDetails$ = this.focConfigurationFacade.getValueBasedVariantDetails();

    this.weightBasedVariantDetails$ = this.focConfigurationFacade.getWeightBasedVariantDetails();
    this.selectedProductGroups$ = this.focConfigurationFacade.getProductGroups();
    this.locationList$ = this.focConfigurationFacade.getLocationList();
    this.getFocTypeState$ = this.focConfigurationFacade.getFocTypeState();
    this.focConfigurationFacade.loadFOCItemCodes({
      excludeProductCategories: [],
      excludeProductGroups: [],
      includeProductCategories: [],
      includeProductGroups: ['73'],
      isFocItem: true
    });
    this.translate
      .get([
        'pw.focConfiguration.goldCoin',
        'pw.focConfiguration.others',
        'pw.focConfiguration.selectFocSchemeDateLabel',
        'pw.focConfiguration.errorMessageToMapFocItemCode'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.errorMessageToMapFocItemCode =
          translatedMessages[
            'pw.focConfiguration.errorMessageToMapFocItemCode'
          ];
        this.itemTypeDropDownArray.push(
          {
            value: focSchemeBasedEnums.GOLD_COIN,
            description: translatedMessages['pw.focConfiguration.goldCoin']
          },

          {
            value: focSchemeBasedEnums.OTHERS,
            description: translatedMessages['pw.focConfiguration.others']
          }
        );
        this.selectFocSchemDateLabel =
          translatedMessages['pw.focConfiguration.selectFocSchemeDateLabel'];
      });
    this.locationList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(locationDetails => {
        const locationDetailsArray = locationDetails;
        this.locationList = [];
        console.log('locationLst', locationDetails);
        for (const location of locationDetailsArray) {
          this.locationList.push({
            locationCode: location.locationCode,
            description: location.description,
            startDate: location.startDate,
            endDate: location.endDate,
            id: location.id,
            isActive: location.isActive,
            subBrandCode: location.subBrandCode
          });
        }
      });

    this.focConfigurationFacade
      .getFocTypeState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(focTypeDetails => {
        this.focTypeDetails = focTypeDetails;
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        if (this.configId !== 'new') {
          this.focConfigurationFacade.loadFocSchemeConfigurationByConfigId(
            this.configId
          );
          this.loadMappedLocations();
        }
      });
    this.focConfigurationFacade
      .getSchemeDetailsById()
      .pipe(takeUntil(this.destroy$))
      .subscribe((schemeDetails: SchemeDetails) => {
        if (schemeDetails) {
          this.schemeDetails = schemeDetails;
          this.schemeName = schemeDetails.name;
        }
      });

    this.focConfigurationFacade
      .getLoadMappedProdcutGroup()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.prodouctGroupLoadingError = data;
        }
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.focItemCodePageEvent.pageSize = pageSize;
        this.locationPageEvent.pageSize = pageSize;
        this.loadMappedFocItems();
      });

    this.focConfigurationFacade
      .getAllSelectedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          console.log('data', data);
          this.selectedLocations = [];
          data.locationList.forEach(locations => {
            this.selectedLocations.push({
              id: locations.locationCode,
              description: locations.description
            });
          });
          console.log('data123', data);
        }
      });

    this.focSchemeDetailsForm = new FormGroup({
      valueBased: new FormControl(focSchemeBasedEnums.GOLD_COIN),
      weightBased: new FormControl(focSchemeBasedEnums.GOLD_COIN)
    });

    this.focConfigurationFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        if (productGroups !== null) {
          this.selectedGroups.next(productGroups);
        }
      });

    this.focConfigurationFacade
      .getHasProductsUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasProductsUpdated => {
        if (hasProductsUpdated) {
          this.hasUpdatedProductGroups = hasProductsUpdated;
          this.showSuccessMessageNotification('pw.focConfiguration.updatedMsg');
          if (this.offerType === focSchemeBasedEnums.SLAB) {
            this.focConfigurationFacade.loadMappedProductGroupByConfigId({
              masterId: this.configId,
              category: this.category,
              itemType: this.itemType
            });
          }

          this.focConfigurationFacade.loadVariantDetailsById({
            id: this.configId,
            category: this.category,
            offerType: this.offerType ? this.offerType : this.getOfferType(),
            itemType: this.itemType
          });
        }
      });

    this.focConfigurationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.focConfigurationFacade.loadVariantDetailsById({
            id: this.configId,
            category: this.category,
            offerType: this.offerType ? this.offerType : this.getOfferType(),
            itemType: this.itemType
          });
          this.loadMappedLocations();
          if (this.hasRemoved) {
            this.showSuccessMessageNotification(
              'pw.focConfiguration.removeMsg'
            );
          } else {
            this.showSuccessMessageNotification(
              'pw.focConfiguration.updatedMsg'
            );
          }
        }
      });

    this.focConfigurationFacade
      .getIsLocationUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLocationUpdated => {
        if (isLocationUpdated === true) {
          this.loadMappedLocations();
          this.showSuccessMessageNotification(
            'pw.focConfiguration.locationMsg'
          );
        }
      });
    this.focConfigurationFacade
      .getHasFocItemsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSavedFocItems => {
        if (hasSavedFocItems) {
          this.loadMappedFocItems();
          if (this.isRemoving === false) {
            this.showSuccessMessageNotification(
              'pw.focConfiguration.saveItemCodeMsg'
            );
          } else {
            this.showSuccessMessageNotification(
              'pw.focConfiguration.removedItemCodeMsg'
            );
          }
        }
      });
    this.focConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          if (error.code === 'ERR-CONFIG-045') {
            this.focConfigurationFacade.loadVariantDetailsById({
              id: this.configId,
              category: this.category,
              offerType: this.offerType ? this.offerType : this.getOfferType(),
              itemType: this.itemType
            });
            const rowData = [];
            for (const causes of error.errorCause) {
              rowData.push({
                productGroupCode: causes.productGroupCode,
                schemeName: causes.schemeName
              });
            }
            const columnDefs = [
              {
                field: 'productGroupCode',
                headerName: 'ProductGroupCode',
                width: 180
              },
              {
                field: 'schemeName',
                headerName: 'SchemeName',
                width: 180
              }
            ];
            const dialogRef = this.dialog.open(ErrorGridPopupComponent, {
              autoFocus: false,
              width: '520px',
              data: {
                title: 'ProductGroup Mapping Failed',
                subTitle:
                  'Following ProductGroups Already Mapped to Below Schemes',
                columnDefs: columnDefs,
                rowData: rowData,
                buttonText: 'OK'
              }
            });
            dialogRef
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(res => {
                if (res === 'ok') {
                }
              });
          } else if (error.code !== 'ERR-CONFIG-045') {
            this.errorHandler(error);
          }
        }
      });

    this.totalFocItems$ = this.focConfigurationFacade.getTotalFocItems();
    this.totalLocations$ = this.focConfigurationFacade.getLocationCount();
    this.totalLocations$
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        if (count) {
          console.log('count', count);
          if (count !== this.totalLocationsCount) {
            this.totalLocationsCount = count;
            this.focConfigurationFacade.loadAllLocations({
              pageIndex: 0,
              pageSize: count,
              length: null,
              id: this.configId
            });
          }
        }
      });
    this.totalFocItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalElements: number) => {
        if (totalElements !== this.totalFocItems) {
          this.totalFocItems = totalElements;
          this.focConfigurationFacade.loadAllFocItemCodes({
            id: this.configId,
            pageIndex: 0,
            pageSize: this.totalFocItems
          });
        }
      });
    this.focConfigurationFacade
      .getAllFocItemCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((allMappedFocItems: FOCItemCodes[]) => {
        if (allMappedFocItems) {
          this.mappedFocItemCodes = allMappedFocItems;
          if (allMappedFocItems.length === 0) {
            this.showAlertPopToMapFOCItemCode();
          }
          console.log('allMapped', allMappedFocItems);
        }
      });
    this.focConfigurationFacade
      .getMappedFocItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedFocItems: FOCItemCodes[]) => {
        if (mappedFocItems) {
          this.mappedFocItems = mappedFocItems;
        }
      });

    this.focConfigurationFacade.loadVariantDetailsById({
      id: this.configId,
      category: this.category,
      itemType: this.itemType,
      offerType: this.offerType ? this.offerType : this.getOfferType()
    });

    this.focConfigurationFacade
      .getFocItemCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((focItemCodes: FOCItemCodes[]) => {
        if (focItemCodes.length > 0) {
          this.focItemCodes = [];
          for (const itemCodes of focItemCodes) {
            this.focItemCodes.push({
              itemCode: itemCodes.itemCode,
              stdWeight: itemCodes.stdWeight,
              karat: itemCodes.karat,
              isSelected: false
            });
          }
        }
      });
  }
  addFocItemCodes() {
    if (
      this.configId !== focSchemeBasedEnums.NEW &&
      !this.schemeDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const emitData = {
        focItemCodes: this.focItemCodes ? this.focItemCodes : [],
        selectedItemCodes: this.mappedFocItemCodes
      };
      const dialogRef = this.dialog.open(FocItemMappingPopupComponent, {
        data: emitData,
        disableClose: true
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data.type === 'apply') {
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.alertPopup.saveConfirmation'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res) {
                  const addItems = [];
                  const removeItems = [];
                  data.data.addItemCodes.forEach(focItemCodes => {
                    addItems.push({
                      itemCode: focItemCodes.itemCode,
                      stdWeight: focItemCodes.stdWeight,
                      karat: focItemCodes.karat
                    });
                  });
                  data.data.removeItemCodes.forEach(focItemCodes => {
                    removeItems.push(focItemCodes.id);
                  });
                  this.isRemoving = false;
                  this.focConfigurationFacade.saveFocItems({
                    savePayload: {
                      addItems: addItems,
                      removeItems: removeItems
                    },
                    id: this.configId
                  });
                }
              });
          }
        });
    }
  }
  loadProductGroups(event) {
    this.event = event;
    this.hasUpdatedProductGroups = false;

    this.focConfigurationFacade.loadMappedProductGroupByConfigId(event);
  }

  loadFocTypeState(event) {
    this.focConfigurationFacade.loadFocTypeState(event);
  }
  loadVariantDetails(event) {
    event.id = this.configId;
    this.offerType = event.offerType;
    this.focConfigurationFacade.loadVariantDetailsById(event);
    if (event.offerType === focSchemeBasedEnums.SLAB) {
      this.focConfigurationFacade.loadMappedProductGroupByConfigId({
        category: this.category,
        masterId: this.configId,
        itemType: this.itemType
      });
    }
  }
  paginate(pageEvent: PageEvent, type: string) {
    if (type === 'itemCode') {
      this.focItemCodePageEvent = pageEvent;
      this.loadMappedFocItems();
    } else if (type === 'location') {
      this.locationPageEvent = pageEvent;
      this.loadMappedLocations();
    }
  }

  loadMappedFocItems() {
    if (this.configId !== 'new') {
      this.focConfigurationFacade.loadMappedFocItems({
        id: this.configId,
        pageIndex: this.focItemCodePageEvent.pageIndex,
        pageSize: this.focItemCodePageEvent.pageSize
      });
    }
  }
  changeTab(tab) {
    this.offerType = focSchemeBasedEnums.STANDARD;
    this.selectedTab = tab;
    if (this.selectedTab === 0) {
      this.itemType = focSchemeBasedEnums.GOLD_COIN;
      this.category = focSchemeBasedEnums.VALUE_BASED;
      this.offerType = this.focTypeDetails.valueBasedGoldCoin;
    }
    if (this.selectedTab === 1) {
      this.itemType = focSchemeBasedEnums.OTHERS;
      this.category = focSchemeBasedEnums.VALUE_BASED;
      this.offerType = this.focTypeDetails.valueBasedOthers;
      this.showAlertPopToMapFOCItemCode();
    }
    if (this.selectedTab === 2) {
      this.itemType = focSchemeBasedEnums.GOLD_COIN;
      this.category = focSchemeBasedEnums.WEIGHT_BASED;
      this.offerType = this.focTypeDetails.weightBasedGoldCoin;
    }
    if (this.selectedTab === 3) {
      this.itemType = focSchemeBasedEnums.OTHERS;
      this.category = focSchemeBasedEnums.WEIGHT_BASED;
      this.offerType = this.focTypeDetails.weightBasedOthers;
      this.showAlertPopToMapFOCItemCode();
    }
    if (this.selectedTab === 4) {
    }
    this.focConfigurationFacade.loadVariantDetailsById({
      id: this.configId,
      category: this.category,
      offerType: this.offerType ? this.offerType : this.getOfferType(),
      itemType: this.itemType
    });
  }
  back() {
    this.focConfigurationFacade.loadReset();
    this.router.navigate([getFocConfigurationRouteUrl() + '/' + this.configId]);
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else this.clearSearch();
      });
    fromEvent(this.locationSearchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.locationSearchForm.value.locationSearch;
        if (searchValue) {
          this.searchLocationCode(searchValue);
        } else this.clearLocationSearch();
      });
  }
  search(searchValue) {
    if (fieldValidation.itemCodeField.pattern.test(searchValue)) {
      if (this.configId !== 'new') {
        this.focConfigurationFacade.searchFocItems({
          configId: this.configId,
          itemCode: searchValue
        });
      }

      this.invalidSearch = false;
    } else {
      this.invalidSearch = false;
      this.mappedFocItems = [];
    }
  }
  searchLocationCode(searchValue) {
    if (fieldValidation.itemCodeField.pattern.test(searchValue)) {
      if (this.configId !== 'new') {
        this.focConfigurationFacade.searchLocationCode({
          configId: this.configId,
          locationCode: searchValue
        });
      }
      this.invalidLocationSearch = false;
    } else {
      this.invalidLocationSearch = false;
      this.locationList = [];
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadMappedFocItems();
  }
  clearLocationSearch() {
    this.invalidLocationSearch = false;
    this.locationSearchForm.reset();
    this.loadMappedLocations();
  }
  loadMappedLocations() {
    this.focConfigurationFacade.loadLocationListById({
      pageIndex: this.locationPageEvent.pageIndex,
      pageSize: this.locationPageEvent.pageSize,
      length: this.locationPageEvent.length,
      id: this.configId
    });
  }
  saveVariantDetails(saveVariantDetails: SaveVariantDetailsPayload) {
    this.hasRemoved = false;
    saveVariantDetails.masterId = this.configId;
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.focConfigurationFacade.saveVariantDetails(saveVariantDetails);
        }
      });
  }
  mapProductGroup(saveProductGroup: SaveProductGroup) {
    this.focConfigurationFacade.updateProductGroupByConfigId(saveProductGroup);
  }
  onValueBasedDropDownChange(event) {
    this.offerType = focSchemeBasedEnums.STANDARD;
    this.itemType = event.value;
    this.category = focSchemeBasedEnums.VALUE_BASED;
    this.selectedValueBased = event.value;
    if (event.value === focSchemeBasedEnums.GOLD_COIN) {
      this.selectedTab = 0;
      this.focConfigurationFacade.loadFOCItemCodes({
        excludeProductCategories: [],
        excludeProductGroups: [],
        includeProductCategories: [],
        includeProductGroups: ['73'],
        isFocItem: true
      });
    } else if (event.value === focSchemeBasedEnums.OTHERS) {
      this.showAlertPopToMapFOCItemCode();
      this.focConfigurationFacade.loadFOCItemCodes({
        excludeProductCategories: [],
        excludeProductGroups: ['73'],
        includeProductCategories: [],
        includeProductGroups: [],
        isFocItem: true
      });
      this.selectedTab = 1;
    }
    this.focConfigurationFacade.loadVariantDetailsById({
      id: this.configId,
      category: this.category,
      itemType: this.itemType,
      offerType: this.offerType ? this.offerType : this.getOfferType()
    });
  }

  onWeightBasedDropDownChange(event) {
    this.offerType = focSchemeBasedEnums.STANDARD;
    this.itemType = event.value;
    this.category = focSchemeBasedEnums.WEIGHT_BASED;
    this.selectedWeightBased = event.value;
    if (event.value === focSchemeBasedEnums.GOLD_COIN) {
      this.selectedTab = 2;
      this.focConfigurationFacade.loadFOCItemCodes({
        excludeProductCategories: [],
        excludeProductGroups: [],
        includeProductCategories: [],
        includeProductGroups: ['73'],
        isFocItem: true
      });
    } else if (event.value === focSchemeBasedEnums.OTHERS) {
      this.showAlertPopToMapFOCItemCode();
      this.selectedTab = 3;
      this.focConfigurationFacade.loadFOCItemCodes({
        excludeProductCategories: [],
        excludeProductGroups: ['73'],
        includeProductCategories: [],
        includeProductGroups: [],
        isFocItem: true
      });
    }
    this.focConfigurationFacade.loadVariantDetailsById({
      id: this.configId,
      category: this.category,
      itemType: this.itemType,
      offerType: this.offerType ? this.offerType : this.getOfferType()
    });
  }

  updateLocation(updateLocation: SaveLocationPayload) {
    updateLocation.id = this.configId;
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.focConfigurationFacade.updateLocationById(updateLocation);
        }
      });
  }

  updateIsActiveStatus(updateLocation: SaveLocationPayload) {
    updateLocation.id = this.configId;
    this.focConfigurationFacade.updateLocationById(updateLocation);
  }
  openLocationMappingPopup() {
    if (
      this.configId !== focSchemeBasedEnums.NEW &&
      !this.schemeDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.locationMappingService
        .openLocationMappingWithForm({
          formType: LocationMappingFormType.FOC_SCHEME_BASED_CONFIG,
          formLabel: this.selectFocSchemDateLabel,
          selectedLocations: this.selectedLocations
        })
        .subscribe(res => {
          if (res.type !== 'close') {
            let saveLocationPayload: SaveLocationPayload;
            const addLocations = [];
            const validityDetails = {
              endDate: res.data?.config?.endsOnDate
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf(),
              startDate: res.data?.config?.startFromDate
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf(),
              status: res.data?.config?.status
            };
            if (res?.data?.locations.selectedLocations) {
              res.data.locations.selectedLocations.forEach(Addedlocation => {
                addLocations.push(Addedlocation.id);
              });
            }
            saveLocationPayload = {
              id: this.configId,
              saveLocationPayload: {
                addLocations: addLocations,
                removeLocations: [],
                updateLocations: [],
                validity: validityDetails
              }
            };
            this.focConfigurationFacade.updateLocationById(saveLocationPayload);
          }
        });
    }
  }

  showMessage(key: string) {
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
          .events.subscribe();
      });
  }
  showAlertPopToMapFOCItemCode() {
    if (this.mappedFocItemCodes.length === 0) {
      if (!(this.selectedTab === 4 || this.selectedTab === 5))
        if (this.itemType === focSchemeBasedEnums.OTHERS) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.ERROR,
              message: this.errorMessageToMapFocItemCode
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        }
    }
  }
  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
          });
      });
  }
  deleteItemCode($event) {
    this.isRemoving = true;
    this.focConfigurationFacade.saveFocItems({
      savePayload: { addItems: [], removeItems: [$event] },
      id: this.configId
    });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_CORE_032) {
      this.focConfigurationFacade.loadVariantDetailsById({
        id: this.configId,
        category: this.category,
        offerType: this.offerType ? this.offerType : this.getOfferType(),
        itemType: this.itemType
      });
    }
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }
  deleteSchemes(removeSchemeDetails: SaveVariantDetailsPayload) {
    this.hasRemoved = true;
    removeSchemeDetails.masterId = this.configId;
    this.focConfigurationFacade.saveVariantDetails(removeSchemeDetails);
  }
  getOfferType(){
  //  default value is GOLD_COIN and VALUE_BASED
    return this.focTypeDetails.valueBasedGoldCoin;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
