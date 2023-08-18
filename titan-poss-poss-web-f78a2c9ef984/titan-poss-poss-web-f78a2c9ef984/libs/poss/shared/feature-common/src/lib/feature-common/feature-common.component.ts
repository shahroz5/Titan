import { Component, OnInit, Inject } from '@angular/core';
import {
  MetalPrice,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  LocationSettingAttributesEnum,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { interval, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { POSS_WEB_MATERIAL_PRICE_REFRESH_INTERVAL } from '@poss-web/shared/util-config';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';

@Component({
  selector: 'poss-web-feature-common',
  templateUrl: './feature-common.component.html',
  styleUrls: ['./feature-common.component.scss']
})
export class FeatureCommonComponent implements OnInit {
  metals: MetalPrice[] = [
    // {
    //   materialName: 'Platinumssss',
    //   karatage: 45,
    //   applicableDate: null,
    //   offset: null,
    //   purity: null,
    //   ratePerUnit: 1222,
    //   unit: 'gms'
    // },
    // {
    //   materialName: 'Platinum',
    //   karatage: 45,
    //   applicableDate: null,
    //   offset: null,
    //   purity: null,
    //   ratePerUnit: 1222,
    //   unit: 'gms'
    // },
    // {
    //   materialName: 'Silver',
    //   karatage: 45,
    //   applicableDate: null,
    //   offset: null,
    //   purity: null,
    //   ratePerUnit: 1222,
    //   unit: 'gms'
    // },
    // {
    //   materialName: 'Ruby',
    //   karatage: 45,
    //   applicableDate: null,
    //   offset: null,
    //   purity: null,
    //   ratePerUnit: 1222,
    //   unit: 'gms'
    // }
  ];
  Previousmetals: MetalPrice[];
  materialPrice$: Observable<MetalPrice[]>;
  destroy$: Subject<null> = new Subject<null>();
  isLoading$ = false;
  showOnHoldCM = false;
  onHoldCMCount = 0;
  customerInfo = false;
  currencyCode: string;

  constructor(
    private commonFacade: CommonFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public locationSettingsFacade: LocationSettingsFacade,
    @Inject(POSS_WEB_MATERIAL_PRICE_REFRESH_INTERVAL) public refreshInterval,
    private toolbarFacade: ToolbarFacade
  ) {}

  ngOnInit() {
    this.toolbarFacade.loadMetalPriceDetails();
    const source = interval(this.refreshInterval);
    source.subscribe(() => this.LoadMetals());

    this.componentInit();
  }

  LoadMetals() {
    this.toolbarFacade.loadMetalPriceDetails();
  }

  componentInit() {
    this.toolbarFacade
      .getMetalPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(priceDetails => {
        if (priceDetails) {
          this.metals = priceDetails;
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

    this.toolbarFacade
      .getPreviousMetalPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(priceDetail => {
        if (priceDetail) {
          console.log(priceDetail);
          this.Previousmetals = priceDetail;
        }
      });

    //   this.commonFacade
    //     .getHasError()
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe((error: CustomErrors) => {
    //       if (error) {
    //         this.errorHandler(error);
    //       }
    //     });

    //   this.commonFacade
    //     .getIsLoading()
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe((isLoading: boolean) => {
    //       this.isLoading$ = isLoading;
    //     });
  }
  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onHoldCM() {
    this.showOnHoldCM = !this.showOnHoldCM;
  }
}
