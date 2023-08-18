import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IbtConfigurationFacade } from '@poss-web/eposs/ibt-config/data-access-ibt-config';
import {
  IbtConfiguration,
  LocationMappingServiceAbstraction,
  SelectedLocation,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  CustomErrors,
  ActiveConfigs,
  ConfigTypeEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  OverlayNotificationEventRef,
} from '@poss-web/shared/models';
import {
  getIBTConfigListRouteUrl,
  getIBTConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';

import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/Operators';
import { FormGroup } from '@angular/forms';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-ibt-coniguration-detail',
  templateUrl: './ibt-coniguration-detail.component.html'
})
export class IbtConigurationDetailComponent implements OnInit, OnDestroy {
  configId: string;
  ibtConfiguration$: Observable<IbtConfiguration>;
  selectedLocations: SelectedLocation[] = [];
  activeConfigs: Observable<ActiveConfigs[]>;
  activeConfigValue: ActiveConfigs[];
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;

  formGroup: FormGroup;
  isSave: boolean;
  ibtConfigurationDetails: IbtConfiguration;
  constructor(
    public ibtConfigurationFacade: IbtConfigurationFacade,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  mappedLocations = [];

  showViewOnly: boolean;

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.showViewOnly = params?.showViewOnly === 'true' ? true : false;
      });

    this.ibtConfigurationFacade.loadReset();
    this.isLoading$ = this.ibtConfigurationFacade.getIsloading();

    this.configId = this.activatedRoute.snapshot.params['_configId'];

    this.ibtConfiguration$ = this.ibtConfigurationFacade.getIbtConfiguration();
    this.ibtConfiguration$
      .pipe(takeUntil(this.destroy$))
      .subscribe((details: IbtConfiguration) => {
        if (details) {
          this.ibtConfigurationDetails = details;
        }
      });
    this.ibtConfigurationFacade
      .getIbtConfiguration()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configDetails => {
        if (configDetails && configDetails.configId !== 'new') {
          this.configId = configDetails.configId;
        }
      });
    if (this.configId === 'new') {
      this.ibtConfigurationFacade.loadNewIbtConfigurationByConfigId();
    } else {
      this.ibtConfigurationFacade.loadIbtConfigurationByConfigId(this.configId);
    }

    this.ibtConfigurationFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.showSuccessMessageNotification('pw.ibtConfiguration.successMsg');
        }
      });
    this.ibtConfigurationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.showSuccessMessageNotification('pw.ibtConfiguration.updatedMsg');
        } else this.overlayNotification.close();
      });

    this.ibtConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
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
  back() {
    this.ibtConfigurationFacade.loadReset();
    this.router.navigate([getIBTConfigListRouteUrl()]);
  }
  createConfiguration(ibtConfiguration: IbtConfiguration) {
    const configId = this.activatedRoute.snapshot.params['_configId'];
    if (configId === 'new') {
      ibtConfiguration.isActive = true;
      this.isSave = true;
      this.ibtConfigurationFacade.searchConfig(ibtConfiguration.description);
      this.ibtConfigurationFacade
        .getIbtConfigurationList()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data) {
            if (data?.length !== 0) {
              this.showNotifications(
                'pw.ibtConfiguration.configNameDuplicateErrorMsg'
              );
            } else {
              if (data?.length === 0) {
                ibtConfiguration.isActive = true;
                this.ibtConfigurationFacade.saveIbtConfiguration(
                  ibtConfiguration
                );
              }
            }
          }
        });
    } else {
      this.isSave = false;
      ibtConfiguration.configId = configId;
      this.ibtConfigurationFacade.updateIbtConfiguration(ibtConfiguration);
    }
    this.overlayNotification.close();
  }

  openLocationMapping($event) {
    if (
      this.ibtConfigurationDetails?.description !== '' &&
      !this.ibtConfigurationDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.configId = this.activatedRoute.snapshot.params['_configId'];
      this.locationMappingService.open({
        isConfig: true,
        configDetails: {
          configId: this.configId,
          configType: ConfigTypeEnum.IBT_CONFIGURATIONS
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
  showLocMappingAlertMessage() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.ibtConfiguration.selAtleaseOneLocation'
      })
      .pipe(take(1))
      .subscribe();
  }

  showNotifications(key) {
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
          .subscribe((event: OverlayNotificationEventRef) => {
            this.ibtConfigurationFacade.clearSearch();
          });
      });
  }

  showSuccessMessageNotification(key: any) {
    this.locationMappingFacade.loadMappedLocations({
      ruleType: ConfigTypeEnum.IBT_CONFIGURATIONS,
      ruleID: this.configId
    });
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.subscribe(() => {
            this.router.navigate([getIBTConfigDetailRouteUrl(this.configId)], {
              queryParams: {
                showViewOnly: this.showViewOnly
              },
              queryParamsHandling: 'merge'
            });
            if (this.mappedLocations.length === 0) {
              this.showLocMappingAlertMessage();
            }
          });
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }

  openViewLocationMapping() {
    if (this.ibtConfiguration$)
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
            // this.selectedLocation = selectedOption;
            // this.locationCode = selectedOption.id;
            // this.priceGroupMappingFacade.loadLocationPriceGroupMappingList(
            //   this.locationCode
            // );
          }
        });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
