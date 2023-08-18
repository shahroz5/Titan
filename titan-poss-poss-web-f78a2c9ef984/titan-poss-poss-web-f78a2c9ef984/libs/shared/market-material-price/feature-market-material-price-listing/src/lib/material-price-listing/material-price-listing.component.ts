import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import {
  CustomErrors,
  MaterialPricePayload,
  MaterialPriceList,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  MetalTypeEnum,
  OverlayNotificationType
} from '@poss-web/shared/models';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { MarketMaterialPriceFacade } from '@poss-web/shared/market-material-price/data-access-market-material-price';
import {
  getMaterialPriceDetailPageRoutingUrl,
  getMaterialPriceListRoutingUrl,
  getMasterHomeRouteUrl
} from '@poss-web/shared/util-site-routes';

import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'poss-web-material-price-listing',
  templateUrl: './material-price-listing.component.html'
})
export class MaterialPriceListingComponent implements OnInit, OnDestroy {
  currentDate = moment();

  utcOffset = moment().startOf('day').utcOffset();
  applicableDate;
  isDisableForced: boolean;
  itemDetails: any;
  label: string;
  materialTypeUrlParam: string;
  destroy$ = new Subject<null>();
  materialPrice$: Observable<MaterialPriceList[]>;
  dateForm = new FormGroup({
    applicableDate: new FormControl(this.currentDate)
  });
  isDisableDaily: boolean;
  dateFormat: string;
  marketGoldPrice: string;
  marketSilverPrice: string;
  MarketPlatinumPrice: string;
  isLoading$: Observable<boolean>;
  noDataFoundMessage: any;
  metalTypeEnumRef = MetalTypeEnum;

  totalMaterialPriceCount$: Observable<number>;

  marketCodePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  pageSizeOptions: number[] = [];
  minPageSize = 0;
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private marketMaterialPriceFacade: MarketMaterialPriceFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appsettingFacade: AppsettingFacade,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.entity.marketPriceEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.marketPriceEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.marketMaterialPriceFacade.loadReset();
    this.isLoading$ = this.marketMaterialPriceFacade.getIsLoading();
    this.totalMaterialPriceCount$ = this.marketMaterialPriceFacade.getMetalPriceTotalCount();
    this.materialPrice$ = this.marketMaterialPriceFacade.getMetalPriceDetails();
    this.applicableDate = moment()
      .startOf('day')
      .add(this.utcOffset, 'm')
      .valueOf();

    this.marketMaterialPriceFacade.updateSelectedDate(
      moment().startOf('day').add(this.utcOffset, 'm').valueOf()
    );
    this.appsettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.dateFormat = data;
      });

    this.translate
      .get([
        'pw.materialPrice.marketGoldPriceLabel',
        'pw.materialPrice.marketSilverPriceLabel',
        'pw.materialPrice.marketPlatinumPriceLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.marketGoldPrice =
          translatedMessages['pw.materialPrice.marketGoldPriceLabel'];
        this.marketSilverPrice =
          translatedMessages['pw.materialPrice.marketSilverPriceLabel'];
        this.MarketPlatinumPrice =
          translatedMessages['pw.materialPrice.marketPlatinumPriceLabel'];
      });
    this.activateRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.materialTypeUrlParam = params['_materialType'];
        if (this.materialTypeUrlParam === 'gold') {
          this.materialTypeUrlParam = MetalTypeEnum.GOLD;
          this.label = this.marketGoldPrice;
        } else if (this.materialTypeUrlParam === 'silver') {
          this.materialTypeUrlParam = MetalTypeEnum.SILVER;
          this.label = this.marketSilverPrice;
        } else if (this.materialTypeUrlParam === 'platinum') {
          this.materialTypeUrlParam = MetalTypeEnum.PLATINUM;
          this.label = this.MarketPlatinumPrice;
        }
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.marketCodePageEvent.pageSize = pageSize;
        this.loadPriceByMaterialType({
          applicableDate: this.applicableDate,
          materialCode: this.materialTypeUrlParam,
          pageIndex: this.marketCodePageEvent.pageIndex,
          pageSize: this.marketCodePageEvent.pageSize
        });
      });

    this.marketMaterialPriceFacade
      .getIsValueResetToZero()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showNotification(
            'Amount to be added and amount to be deducted field reset to zero successfully'
          );
        }
      });

    this.materialPrice$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        const dailyPriceTypeD = data.filter(
          priceData => priceData.priceType === 'D'
        );
        const date = this.dateForm
          .get('applicableDate')
          .value.startOf('day')
          .startOf('day');

        // if (
        //   dailyPriceTypeD.length > 0 &&
        //   moment(date).isSame(moment().startOf('day'))
        // ) {
        //   this.isDisableDaily = true;
        //   this.isDisableForced = false;
        // } else {
        //   if (moment(date).isSame(moment().startOf('day'))) {
        //     this.isDisableDaily = false;
        //     this.isDisableForced = true;
        //   } else {
        //     this.isDisableDaily = true;
        //   }
        // }

        if ( moment(date).isSame(moment().startOf('day'))) {
          if (data.length > 0) {
            this.isDisableDaily = true;
            this.isDisableForced = false;
          } else {
            this.isDisableDaily = false;
            this.isDisableForced = true;
          }
        } else {
          this.isDisableDaily = true;
          this.isDisableForced = true;
        }
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

    this.dateForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        let materialPricePayload;

        this.applicableDate = this.dateForm
          .get('applicableDate')
          .value.startOf('day')
          .startOf('day')
          .add(this.utcOffset, 'm')
          .valueOf();
        materialPricePayload = {
          applicableDate: this.applicableDate,
          materialCode: this.materialTypeUrlParam,
          pageIndex: this.marketCodePageEvent.pageIndex,
          pageSize: this.marketCodePageEvent.pageSize
        };
        this.marketMaterialPriceFacade.updateSelectedDate(this.applicableDate);

        if (
          moment(
            this.dateForm
              .get('applicableDate')
              .value.startOf('day')
              .startOf('day')
          ).isSame(moment().startOf('day').startOf('day'))
        ) {
          this.isDisableForced = false;
          this.loadPriceByMaterialType(materialPricePayload);
        } else {
          this.isDisableForced = true;
          this.loadPriceByMaterialType(materialPricePayload);
        }
      });
  }

  paginate(pageEvent) {
    this.marketCodePageEvent = pageEvent;
    this.loadPriceByMaterialType({
      applicableDate: this.applicableDate,
      materialCode: this.materialTypeUrlParam,
      pageIndex: this.marketCodePageEvent.pageIndex,
      pageSize: this.marketCodePageEvent.pageSize
    });
  }

  view(itemDetails) {
    const materialTypeParam = this.activateRoute.snapshot.params[
      '_materialType'
    ];
    this.itemDetails = itemDetails;
    this.router.navigate(
      [
        getMaterialPriceDetailPageRoutingUrl(
          materialTypeParam,
          this.itemDetails.priceType === 'Daily' ? 'daily' : 'forced',
          itemDetails.id
        )
      ],
      {
        relativeTo: this.activateRoute
      }
    );
  }

  showNotification(key: string) {
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
          .events.subscribe(() => {
            this.overlayNotification.close();
          });
      });
  }

  changeMaterialType(materialType) {
    if (materialType === 'gold') {
      this.materialTypeUrlParam = MetalTypeEnum.GOLD;
    } else if (materialType === 'silver') {
      this.materialTypeUrlParam = MetalTypeEnum.SILVER;
    } else if (materialType === 'platinum') {
      this.materialTypeUrlParam = MetalTypeEnum.PLATINUM;
    }

    this.loadPriceByMaterialType({
      applicableDate: this.applicableDate,
      materialCode: this.materialTypeUrlParam,
      pageIndex: this.marketCodePageEvent.pageIndex,
      pageSize: this.marketCodePageEvent.pageSize
    });
    this.router.navigate([getMaterialPriceListRoutingUrl(materialType)]);
  }

  loadPriceByMaterialType(materialPricePayload: MaterialPricePayload) {
    this.marketMaterialPriceFacade.loadMetalPriceDetails(materialPricePayload);
  }

  valueResetToZero() {
    this.marketMaterialPriceFacade.loadIsValueResetZero();
  }

  back() {
    this.marketMaterialPriceFacade.loadReset();
    // this.router.navigate([getProductPricingDashboardRouteUrl()]);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_PRICING_MENU_KEY
      }
    });
  }

  addNewPrice(priceType: string, mode: string) {
    const materialType = this.activateRoute.snapshot.params['_materialType'];
    this.router.navigate(
      [getMaterialPriceDetailPageRoutingUrl(materialType, priceType, mode)],
      {
        relativeTo: this.activateRoute
      }
    );
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
