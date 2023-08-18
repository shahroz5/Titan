import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  CustomErrors,
  OverlayNotificationType,
  WeightValueConfigConstants,
  WeightValueConfigDetails,
  LocationMappingServiceAbstraction,
  ConfigTypeEnum,
  OverlayNotificationServiceAbstraction,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import {
  getWeightValueConfigListRouteUrl,
  getWeightValueConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { WeightValueConfigFacade } from '@poss-web/eposs/grf-tolerance-config/data-access-grf-tolerance-config';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
@Component({
  selector: 'poss-web-weight-value-config-main',
  templateUrl: './weight-value-config-main.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightValueConfigMainComponent implements OnInit, OnDestroy {
  showViewOnly: boolean;
  mappedLocations = [];
  configId: any;
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private weightValueConfigFacade: WeightValueConfigFacade,
    private locationMappingService: LocationMappingServiceAbstraction,
    private locationMappingFacade: LocationMappingFacade,
    private selectionDialog: SelectionDialogService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  weightValueConfigDetails$: Observable<WeightValueConfigDetails>;

  productMappingErrorCode = ErrorEnums.ERR_PAY_009;

  routeParam: Observable<Params>;

  ngOnInit() {
    this.locationMappingFacade.resetMappedLocations();
    this.activatedRoute.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });
    this.weightValueConfigFacade.loadReset();
    this.routeParam = this.activatedRoute.params;
    const param = this.activatedRoute.snapshot.params['_id'];
    this.weightValueConfigFacade.loadWeightValueConfigDetails(param);

    this.hasError$ = this.weightValueConfigFacade.getError();
    this.isLoading$ = this.weightValueConfigFacade.getIsLoading();
    this.weightValueConfigDetails$ = this.weightValueConfigFacade.getWeightValueConfigDetails();

    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
        }
      });

    this.weightValueConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.weightValueConfigFacade
      .getWeightValueConfigDetailsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.configId = data.ruleId;

          this.showNotification('pw.weightValueConfig.successMsg');
        }
      });

    this.weightValueConfigFacade
      .getWeightValueConfigDetailsEdited()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.configId = data.ruleId;

          this.showNotification('pw.weightValueConfig.successMsg');
        }
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.productMappingErrorCode) {
      return;
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

  showNotification(key: string) {
    console.log(this.configId);
    this.locationMappingFacade.loadMappedLocations({
      ruleType: ConfigTypeEnum.GRF_CONFIGURATION,
      ruleID: this.configId
    });
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe(() => {
            this.router.navigate([
              getWeightValueConfigDetailRouteUrl(this.configId)
            ]);
            console.log(this.mappedLocations);
            if (this.mappedLocations.length === 0) {
              this.showLocMappingAlertMessage();
            }
          });
      });
  }

  formOutput(formData: WeightValueConfigDetails) {
    if (
      this.activatedRoute.snapshot.params['_id'] ===
      WeightValueConfigConstants.NEW
    ) {
      this.weightValueConfigFacade.saveWeightValueConfigDetails(formData);
    } else {
      this.weightValueConfigFacade.editWeightValueConfigDetails(formData);
    }
  }

  openLocationMapping($event) {
    const ruleId = this.activatedRoute.snapshot.params['_id'];
    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: ruleId,
        configType: ConfigTypeEnum.GRF_CONFIGURATION
      }
    });
  }

  openViewLocationMapping() {
    this.selectionDialog
      .open({
        title: 'Mapped Locations',
        placeholder: 'Search Location',
        options: this.mappedLocations,
        isPopupClosed: false
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
        }
      });
  }
  showLocMappingAlertMessage() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.weightValueConfig.selAtleaseOneLocationForGRF'
      })
      .pipe(take(1))
      .subscribe();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backArrow() {
    this.weightValueConfigFacade.loadReset();
    this.router.navigate([getWeightValueConfigListRouteUrl()]);
  }
}
