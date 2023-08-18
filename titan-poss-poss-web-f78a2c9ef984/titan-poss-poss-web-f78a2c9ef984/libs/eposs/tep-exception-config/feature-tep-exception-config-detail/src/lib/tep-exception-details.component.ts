import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  CustomErrors,
  OverlayNotificationType,
  LocationMappingServiceAbstraction,
  ProductGroupMappingOption,
  OverlayNotificationServiceAbstraction,
  TEPExceptionConfig,
  ConfigTypeEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import {
  getTepExchangeConfigDetailsRouteUrl,
  getTepExchangeConfigRouteUrl
} from '@poss-web/shared/util-site-routes';
import { TepExceptionConfigFacade } from '@poss-web/eposs/tep-exception-config/data-access-tep-exception-config';
import { MatDialog } from '@angular/material/dialog';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-tep-exception-details',
  templateUrl: './tep-exception-details.component.html',
  styles: []
})
export class TepExceptionDetailsComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationMappingService: LocationMappingServiceAbstraction,
    private tepExceptionConfigFacade: TepExceptionConfigFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade,
    private dialog: MatDialog
  ) {}

  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  tepExceptionConfigDetails$: Observable<TEPExceptionConfig>;
  tepExceptionConfigDetails: TEPExceptionConfig;
  maxFlatTepExchangeValue$: Observable<number>;

  productMappingErrorCode = ErrorEnums.ERR_PAY_009;

  selectedGroups: ProductGroupMappingOption[] = [];
  routeParam: Observable<Params>;

  showViewOnly: boolean;
  mappedLocations = [];
  buttonText: string;
  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.showViewOnly = params?.showViewOnly ? true : false;
      });

    this.buttonText = this.translate.instant('pw.alertPopup.okayButtonText');

    const param = this.activatedRoute.snapshot.params['_id'];
    this.isLoading$ = this.tepExceptionConfigFacade.getIsloading();
    this.tepExceptionConfigFacade.loadTepExceptionConfigDetails(param);
    this.tepExceptionConfigFacade.loadMaxFlatTepExchangeValue();
    this.maxFlatTepExchangeValue$ = this.tepExceptionConfigFacade.getMaxFlatTepExchangeValue();

    this.tepExceptionConfigDetails$ = this.tepExceptionConfigFacade.getTepExceptionConfigDetails();

    this.tepExceptionConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepExceptionConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.tepExceptionConfigDetails$.pipe(take(1)).subscribe(data => {
            if (data.configId) {
              this.router.navigate([
                getTepExchangeConfigDetailsRouteUrl(),
                data.configId
              ]);

              this.tepExceptionConfigDetailsFormOutput({
                ...this.tepExceptionConfigDetails,
                configId: data.configId
              });

              this.showLocMappingAlertMessage();
            }
          });
          this.showNotification(
            'pw.tepExceptionConfig.TEPExceptionConfigurationSaved',
            false
          );
        }
      });
    this.tepExceptionConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotification(
            'pw.tepExceptionConfig.TEPExceptionConfigurationSaved',
            false
          );
        }
      });

    this.locationMappingFacade.loadMappedLocations({
      ruleType: ConfigTypeEnum.TEP_EXCEPTION,
      ruleID: param
    });

    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
        }
      });
  }

  backArrow() {
    this.router.navigate([getTepExchangeConfigRouteUrl()]);
  }

  tepExceptionConfigDetailsFormOutput($event: TEPExceptionConfig) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(take(1))
      .subscribe((res: boolean) => {
        if (res) {
          this.tepExceptionConfigDetails = $event;
          if ($event.configId) {
            this.tepExceptionConfigFacade.updateTepExceptionConfigDetails(
              $event
            );
          } else {
            this.tepExceptionConfigFacade.saveTepExceptionConfigDetails($event);
          }
        }
      });
  }

  errorHandler(error: CustomErrors) {
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

  showNotification(key: string, navigateBack = false) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.ACTION,
            message: translatedMsg,
            time: 2000,
            buttonText: this.buttonText,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe(res => {
            if (navigateBack) {
              this.backArrow();
            }
          });
      });
  }

  showLocMappingAlertMessage() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.tepStoneConfig.selAtleaseOneLocation'
      })
      .pipe(take(1))
      .subscribe();
  }

  openLocationMapping() {
    const configId = this.activatedRoute.snapshot.params['_id'];
    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId,
        configType: ConfigTypeEnum.TEP_EXCEPTION
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
