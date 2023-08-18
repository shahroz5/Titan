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
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import {
  getGRNWeightValueConfigListRouteUrl,
  geGRNWeightValueConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import { GRNWeightValueConfigFacade } from '@poss-web/eposs/grn-tolerance-config/data-access-grn-tolerance-config';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
@Component({
  selector: 'poss-web-weight-value-config-main',
  templateUrl: './weight-value-config-main.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightValueConfigMainComponent implements OnInit, OnDestroy {
  configId: number;
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private weightValueConfigFacade: GRNWeightValueConfigFacade,
    private locationMappingService: LocationMappingServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  weightValueConfigDetails$: Observable<WeightValueConfigDetails>;
  weightValueConfigListing$: Observable<WeightValueConfigDetails[]>;
  numberOfLocationsSelected$: Subject<number> = new Subject<number>();
  weightValueConfigTotal$: Subject<number> = new Subject<number>();

  productMappingErrorCode = ErrorEnums.ERR_PAY_009;

  routeParam: Observable<Params>;
  showViewOnly: boolean;
  mappedLocations: any = [];

  ngOnInit() {
    //this.locationMappingFacade.resetMappedLocations();
    this.routeParam = this.activatedRoute.params;
    const param = this.activatedRoute.snapshot.params['_id'];
    this.weightValueConfigFacade.loadWeightValueConfigDetails(param);
    this.activatedRoute.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });

    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
        }
      });
    this.hasError$ = this.weightValueConfigFacade.getError();
    this.isLoading$ = this.weightValueConfigFacade.getIsLoading();
    this.weightValueConfigDetails$ = this.weightValueConfigFacade.getWeightValueConfigDetails();
    this.weightValueConfigListing$ = this.weightValueConfigFacade.getWeightValueConfigListing();

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

    this.weightValueConfigFacade
      .getMappedLocationsCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        if (count !== -1) {
          this.numberOfLocationsSelected$.next(count);
        }
      });

    this.weightValueConfigFacade
      .getWeightValueConfigTotal()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.weightValueConfigTotal$.next(count);
      });
  }

  showLocMappingAlertMessage() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.weightValueConfig.selAtleaseOneLocationForGrnTolerance'
      })
      .pipe(take(1))
      .subscribe();
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

  showNotification(key: string) {
    this.locationMappingFacade.loadMappedLocations({
      ruleType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG,
      ruleID: this.configId.toString()
    });
    // this.cpgProductGroupForQCGCFacade.LoadCPGProductGroupConfigMapping(param)

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
              geGRNWeightValueConfigDetailRouteUrl(this.configId)
            ]);
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
        configType: ConfigTypeEnum.GRN_TOLERANCE_CONFIG
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backArrow() {
    this.weightValueConfigFacade.loadReset();
    this.router.navigate([getGRNWeightValueConfigListRouteUrl()]);
  }

  validateConfigName(event: string) {
    this.weightValueConfigFacade.searchWeightValueConfigListing(event);
  }

  getSelectedLocationsCount() {
    this.weightValueConfigFacade.loadMappedLocationsCount(
      this.activatedRoute.snapshot.params['_id']
    );
  }
}
