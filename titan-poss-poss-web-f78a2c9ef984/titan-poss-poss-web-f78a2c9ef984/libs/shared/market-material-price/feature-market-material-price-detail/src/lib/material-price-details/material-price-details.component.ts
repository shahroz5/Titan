import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import * as moment from 'moment';

import { fromEvent, Subject, Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  CustomErrors,
  LocationDetails,
  MarketDetails,
  OverlayNotificationServiceAbstraction,
  SelectedStock,
  MetalTypeEnum,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { MarketMaterialPriceFacade } from '@poss-web/shared/market-material-price/data-access-market-material-price';
import { getMaterialPriceListRoutingUrl } from '@poss-web/shared/util-site-routes';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import {
  fieldValidation,
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-material-price-details',
  templateUrl: './material-price-details.component.html'
})
export class MaterialPriceDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  locationDetails$: Observable<LocationDetails[]>;
  materialTypeUrlParam: string;
  mode: string;
  marketCodesListing$: Observable<MarketDetails[]>;
  marketDetails: MarketDetails[];
  totalMarketCodesCount$: Observable<number>;
  pageEventOption: PageEvent;
  isLoading$: Observable<boolean>;
  destroy$ = new Subject<null>();
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  headerDetails: FormGroup;
  materialPriceTypeCode: string;
  selectedMarketCodes: SelectedStock[] = [];
  selectedMarketCodeAcrossPages: string[];
  viewLocationDisable = true;
  price: number | string;
  time: string;
  hasNewViewLocationSuccess$: Observable<boolean>;
  hasNewViewLocationSuccess: boolean;
  locationDetailsCount$: Observable<number>;
  disable: boolean;

  searchPlaceHolder: string;
  label: string;
  isAllSelected = false;
  basePriceAmount: number;
  pageSize: number;
  dateFormat: string;
  marketCodeInvalidSearch = false;
  locationInvalidSearch = false;
  newMarketGoldPrice: string;
  newMarketSilverPrice: string;
  newMarketPlatinumPrice: string;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  marketCodePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  viewLocationPgaeEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  savedLocationPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  remarksForm: FormGroup;
  selectedDate: any;
  noDataFoundForMarketCodeMessage: string;
  noDataFoundForLocationMessage: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appsettingFacade: AppsettingFacade,
    private marketMaterialPriceFacade: MarketMaterialPriceFacade,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private fb: FormBuilder
  ) {
    // this.translate
    //   .get(['pw.global.noDataFoundMessage'], {
    //     entityName: 'MarketCode'
    //   })
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((translatedMessages: any) => {
    //     this.noDataFoundForMarketCodeMessage =
    //       translatedMessages['pw.global.noDataFoundMessage'];
    //   });

    // this.translate
    //   .get(['pw.global.noDataFoundMessage'], {
    //     entityName: 'Location Code'
    //   })
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((translatedMessages: any) => {
    //     this.noDataFoundForLocationMessage =
    //       translatedMessages['pw.global.noDataFoundMessage'];
    //   });
    this.translate
      .get(['pw.entity.locationCode'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.locationCode']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundForLocationMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
    this.translate
      .get(['pw.entity.marketCodeEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.marketCodeEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundForMarketCodeMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  ngOnInit() {
    this.appsettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.dateFormat = data;
      });

    this.marketMaterialPriceFacade
      .getSelectedDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        this.selectedDate = date;
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
        this.marketCodePageEvent.pageSize = this.pageSize;
        this.viewLocationPgaeEvent.pageSize = this.pageSize;
        this.savedLocationPageEvent.pageSize = this.pageSize;
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

    this.remarksForm = new FormGroup({
      remarks: new FormControl('', [
        this.fieldValidatorsService.requiredField('remarks'),
        this.fieldValidatorsService.remarkField('remarks')
      ])
    });
    this.materialTypeUrlParam = this.activatedRoute.snapshot.params[
      '_materialType'
    ];

    this.translate
      .get([
        'pw.materialPrice.newMarketGoldPriceLabel',
        'pw.materialPrice.newMarketSilverPriceLabel',
        'pw.materialPrice.newMarketPlatinumPriceLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.newMarketGoldPrice =
          translatedMessages['pw.materialPrice.newMarketGoldPriceLabel'];
        this.newMarketSilverPrice =
          translatedMessages['pw.materialPrice.newMarketSilverPriceLabel'];
        this.newMarketPlatinumPrice =
          translatedMessages['pw.materialPrice.newMarketPlatinumPriceLabel'];
      });
    if (this.materialTypeUrlParam === 'gold') {
      this.materialTypeUrlParam = MetalTypeEnum.GOLD;
      this.label = this.newMarketGoldPrice;
    } else if (this.materialTypeUrlParam === 'silver') {
      this.materialTypeUrlParam = MetalTypeEnum.SILVER;
      this.label = this.newMarketSilverPrice;
    } else if (this.materialTypeUrlParam === 'platinum') {
      this.materialTypeUrlParam = MetalTypeEnum.PLATINUM;
      this.label = this.newMarketPlatinumPrice;
    }

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.materialPriceTypeCode = param['type'];
        if (this.materialPriceTypeCode === 'forced') {
          this.materialPriceTypeCode = 'F';
        } else if (this.materialPriceTypeCode === 'daily') {
          this.materialPriceTypeCode = 'D';
        }
      });

    this.mode = this.activatedRoute.snapshot.params['_mode'];

    if (this.mode !== 'new') {
      this.pageEventOption = this.savedLocationPageEvent;
      this.marketMaterialPriceFacade.loadMetalPriceDetails({
        applicableDate: this.selectedDate,
        materialCode: this.materialTypeUrlParam,
        configId: this.mode
      });
      this.loadSavedBasePrice();
    } else {
      this.pageEventOption = this.marketCodePageEvent;
      this.loadMarketCodesBasedOnMaterial();
    }

    this.headerDetails = new FormGroup({
      basePrice: new FormControl('', [
        this.fieldValidatorsService.requiredField('Base Price'),
        this.fieldValidatorsService.numbersField('Base Price')
      ]),
      applicableDate: new FormControl(moment().format(this.dateFormat))
    });

    this.marketCodesListing$ = this.marketMaterialPriceFacade.getMarketDetailsBasedOnMaterial();
    this.locationDetails$ = this.marketMaterialPriceFacade.getLocationDetails();
    this.locationDetailsCount$ = this.marketMaterialPriceFacade.getLocationDetailsCount();
    this.totalMarketCodesCount$ = this.marketMaterialPriceFacade.getTotalMarketCodesCount();
    this.isLoading$ = this.marketMaterialPriceFacade.getIsLoading();
    this.hasNewViewLocationSuccess$ = this.marketMaterialPriceFacade.getHasNewViewLocationPriceSuccess();

    this.marketMaterialPriceFacade
      .getAllSelected()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAllSelected => (this.isAllSelected = isAllSelected));

    this.marketMaterialPriceFacade
      .getSelectedStock()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.selectedMarketCodes = data;
      });

    this.marketMaterialPriceFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.marketMaterialPriceFacade.loadReset();
          this.router.navigate([
            getMaterialPriceListRoutingUrl(
              this.activatedRoute.snapshot.params['_materialType']
            )
          ]);
        }
      });

    this.marketMaterialPriceFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.marketCodesListing$
      .pipe(takeUntil(this.destroy$))
      .subscribe(marketDetails => {
        if (marketDetails) {
          this.marketDetails = marketDetails;
        }
      });
    this.hasNewViewLocationSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.hasNewViewLocationSuccess = data;
        this.searchPlaceHolder =
          this.hasNewViewLocationSuccess || this.mode !== 'new'
            ? ' Search By Location Code'
            : 'Search By Market Code';
      });

    this.marketMaterialPriceFacade
      .getMetalPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (this.mode !== 'new') {
          this.price = data[0] ? data[0].price : '';
          this.time = data[0] ? data[0].time : '';
        }
      });
  }

  computeBasePrice(event) {
    let computedPrice;
    if (event.isChecked) {
      computedPrice =
        event.markupFactor * event.computedPrice +
        event.addAmount -
        event.deductAmount;
      this.marketMaterialPriceFacade.computeBasePriceForForcedType({
        id: event.marketCode,
        computedPrice: Math.ceil(Number(computedPrice)),
        isChecked: event.isChecked
      });
    } else {
      computedPrice = '';
      this.marketMaterialPriceFacade.updateSelectedStock({
        id: event.marketCode,
        computedPrice: '',
        isChecked: event.isChecked
      });
    }
  }

  computePriceForAll(event) {
    this.selectedMarketCodes = [];
    this.marketMaterialPriceFacade.loadResetSelectedStock();
    this.basePriceAmount = event.basePrice;
    const marketDetails: MarketDetails[] = [];
    const selectedStock: any = [];
    if (event.selected) {
      this.isAllSelected = true;
      for (const data of this.marketDetails) {
        marketDetails.push({
          marketCode: data.marketCode,
          materialCode: data.materialCode,
          isChecked: event.selected,
          computedPrice: Math.ceil(Number(
            data.markupFactor * event.basePrice +
              data.addAmount -
              data.deductAmount
          )),
          addAmount: data.addAmount,
          deductAmount: data.deductAmount,
          description: data.description,
          markupFactor: data.markupFactor
        });
      }

      this.marketMaterialPriceFacade.loadComputePriceForAll(marketDetails);
    } else {
      for (const data of this.marketDetails) {
        marketDetails.push({
          marketCode: data.marketCode,
          materialCode: data.materialCode,
          isChecked: event.selected,
          computedPrice: null,
          addAmount: data.addAmount,
          deductAmount: data.deductAmount,
          description: data.description,
          markupFactor: data.markupFactor
        });
      }

      this.marketMaterialPriceFacade.loadRemovePriceForAll(
        marketDetails,
        selectedStock
      );
    }
  }

  savePrice() {
    const marketCodes =
      this.materialPriceTypeCode === 'F'
        ? this.isAllSelected
          ? []
          : this.selectedMarketCodes.map(data => data.id)
        : [];
    const basePrice = this.headerDetails.get('basePrice').value;
    this.marketMaterialPriceFacade.updateSelectedDate(
      moment(this.headerDetails.get('applicableDate').value).format()
    );
    this.marketMaterialPriceFacade.savePrice({
      materialCode: this.materialTypeUrlParam,
      data: {
        applicableDate: new Date().getTime(),
        basePrice: Number(basePrice),
        marketCodes: marketCodes,
        priceTypeCode: this.materialPriceTypeCode,
        remarks: this.remarksForm.get('remarks').value
      }
    });
  }

  updateChecked(event) {
    this.selectedMarketCodes = [];
    this.marketMaterialPriceFacade.updateCheckBox(event);
  }

  search(searchValue) {
    if (
      fieldValidation.locationCodeField.pattern.test(searchValue.toUpperCase())
    ) {
      if (this.mode !== 'new') {
        this.marketMaterialPriceFacade.searchSavedLocationPriceByMarketCode({
          id: this.mode,
          locationCode: searchValue.toUpperCase(),
          materialCode: this.materialTypeUrlParam,
          pageSize: this.savedLocationPageEvent.pageSize,
          pageIndex: this.savedLocationPageEvent.pageIndex
        });
      } else if (this.hasNewViewLocationSuccess) {
        const marketCodes =
          this.materialPriceTypeCode === 'D'
            ? []
            : this.selectedMarketCodes.map(data => data.id);
        this.marketMaterialPriceFacade.searchComputedPriceByMarketCode({
          locationCode: searchValue.toUpperCase(),
          materialCode: this.materialTypeUrlParam,
          pageSize: this.viewLocationPgaeEvent.pageSize,
          pageIndex: this.viewLocationPgaeEvent.pageIndex,
          data: {
            applicableDate: moment(
              this.headerDetails.get('applicableDate').value
            ).unix,
            basePrice: Number(this.headerDetails.get('basePrice').value),
            marketCodes: marketCodes,
            priceTypeCode: this.materialPriceTypeCode
          }
        });
        this.locationDetails$ = this.marketMaterialPriceFacade.getComputedPriceSearchResult();
        this.locationDetailsCount$ = this.marketMaterialPriceFacade.getcomputedPriceSearchResultCount();
      }
      this.locationInvalidSearch = false;
    }

    if (this.mode === 'new' && !this.hasNewViewLocationSuccess) {
      if (fieldValidation.marketCodeField.pattern.test(searchValue)) {
        this.marketMaterialPriceFacade.searchMaterialCode({
          data: {
            materialCode: this.materialTypeUrlParam,
            marketCode: searchValue.toUpperCase()
          },
          selectedStock: this.selectedMarketCodes,
          isAllSelected: this.isAllSelected,
          basePrice: Number(this.basePriceAmount)
        });
      }
    }
    if (
      !(
        fieldValidation.locationCodeField.pattern.test(
          searchValue.toUpperCase()
        ) && fieldValidation.marketCodeField.pattern.test(searchValue)
      )
    ) {
      this.locationInvalidSearch = true;
    } else {
      this.locationInvalidSearch = false;
    }

    if (!fieldValidation.marketCodeField.pattern.test(searchValue)) {
      this.marketCodeInvalidSearch = true;
    } else {
      this.marketCodeInvalidSearch = false;
    }
  }

  clearSearch() {
    this.searchForm.reset();
    this.locationInvalidSearch = false;
    this.marketCodeInvalidSearch = false;
    if (this.mode !== 'new') {
      this.pageEventOption = this.savedLocationPageEvent;
      this.loadSavedBasePrice();
    } else if (this.hasNewViewLocationSuccess) {
      this.locationDetails$ = this.marketMaterialPriceFacade.getLocationDetails();
      this.locationDetailsCount$ = this.marketMaterialPriceFacade.getLocationDetailsCount();
    } else {
      this.pageEventOption = this.marketCodePageEvent;
      this.loadMarketCodesBasedOnMaterial();
    }
  }

  paginate(pageEvent) {
    if (this.mode !== 'new') {
      this.savedLocationPageEvent = pageEvent;
      this.loadSavedBasePrice();
    } else if (this.hasNewViewLocationSuccess) {
      this.viewLocationPgaeEvent = pageEvent;
      this.viewLocationPrice();
    } else {
      this.marketCodePageEvent = pageEvent;
      this.loadMarketCodesBasedOnMaterial();
    }
  }

  loadMarketCodesBasedOnMaterial() {
    this.pageEventOption = this.marketCodePageEvent;
    this.marketMaterialPriceFacade.loadMarketDetails({
      data: {
        pageIndex: this.marketCodePageEvent.pageIndex,
        pageSize: this.marketCodePageEvent.pageSize,
        materialCode: this.materialTypeUrlParam
      },
      selectedStock: this.selectedMarketCodes,
      isAllSelected: this.isAllSelected,
      basePrice: Number(this.basePriceAmount)
    });
  }

  loadSavedBasePrice() {
    this.marketMaterialPriceFacade.loadSavedBasePrice({
      pageIndex: this.savedLocationPageEvent.pageIndex,
      pageSize: this.savedLocationPageEvent.pageSize,
      materialCode: this.materialTypeUrlParam,
      id: this.mode
    });
  }

  viewLocationPrice() {
    if (this.headerDetails.controls.basePrice.value === '') {
      this.showErrorNotification('pw.materialPrice.pleaseEnterBasePrice');
    } else if (
      this.materialPriceTypeCode !== 'D' &&
      (this.isAllSelected ? false : this.selectedMarketCodes.length === 0)
    ) {
      this.showErrorNotification('pw.materialPrice.pleaseSelectMarketCodesMsg');
    } else {
      if (this.headerDetails.valid) {
        this.price = this.headerDetails.controls.basePrice.value;

        this.time = moment(new Date()).format('HH:mm A');
        this.searchForm.reset();

        this.pageEventOption = this.viewLocationPgaeEvent;
        this.marketMaterialPriceFacade.loadReset();
        this.marketMaterialPriceFacade.loadLocationPrice({
          pageIndex: this.viewLocationPgaeEvent.pageIndex,
          pageSize: this.viewLocationPgaeEvent.pageSize,
          materialCode: this.materialTypeUrlParam,
          data: {
            applicableDate: new Date().getTime(),
            basePrice: Number(this.headerDetails.get('basePrice').value),
            marketCodes:
              this.materialPriceTypeCode === 'D'
                ? []
                : this.selectedMarketCodes.map(data => data.id),

            priceTypeCode: this.materialPriceTypeCode
          }
        });
      }
    }
  }

  back() {
    this.clearSearch();
    //  this.marketMaterialPriceFacade.loadReset();
    const materialTypeUrlParam = this.activatedRoute.snapshot.params[
      '_materialType'
    ];

    if (this.mode !== 'new' || !this.hasNewViewLocationSuccess) {
      this.marketMaterialPriceFacade.loadResetLocationData();
      this.marketMaterialPriceFacade.loadReset();
      this.marketMaterialPriceFacade.loadResetSelectedStock();
      this.marketMaterialPriceFacade.updateAllSelected(false);
      this.router.navigate([
        getMaterialPriceListRoutingUrl(materialTypeUrlParam)
      ]);
    } else if (this.hasNewViewLocationSuccess) {
      this.marketMaterialPriceFacade.loadResetLocationData();
      this.loadMarketCodesBasedOnMaterial();
    }
  }

  showNotification(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMessage,
            time: 2000,
            hasBackdrop: true
          })
          .events.subscribe();
      });
  }

  showErrorNotification(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            time: 2000,
            hasClose: true,
            hasBackdrop: true
          })
          .events.subscribe();
      });
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  ngOnDestroy() {
    this.marketMaterialPriceFacade.loadResetSelectedStock();
    this.marketMaterialPriceFacade.updateAllSelected(false);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
