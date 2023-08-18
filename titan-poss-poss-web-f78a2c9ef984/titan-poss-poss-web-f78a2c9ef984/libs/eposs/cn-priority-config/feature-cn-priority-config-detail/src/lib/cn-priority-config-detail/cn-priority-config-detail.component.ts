import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  ActiveConfigs,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CnPriorityConfig,
  CnTypeList,
  ConfigTypeEnum,
  CustomErrors,
  LocationMappingServiceAbstraction,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectedLocation
} from '@poss-web/shared/models';
import { FormGroup } from '@angular/forms';
import { CnPriorityConfigFacade } from '@poss-web/eposs/cn-priority-config/data-access-cn-priority-config';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil } from 'rxjs/operators';
import {
  getCreditNotePriorityDetailRouteUrl,
  getCreditNotePriorityListRouteUrl,
} from '@poss-web/shared/util-site-routes';
import { MatDialog } from '@angular/material/dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-cn-priority-config-detail',
  templateUrl: './cn-priority-config-detail.component.html'
})
export class CnPriorityConfigDetailComponent implements OnInit, OnDestroy {
  configId: string;
  cnPriorityConfig$: Observable<CnPriorityConfig>;
  selectedLocations: SelectedLocation[] = [];
  activeConfigs: Observable<ActiveConfigs[]>;
  activeConfigValue: ActiveConfigs[];
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  formGroup: FormGroup;
  cnTypeList$: Observable<CnTypeList[]>;
  mappedLocations: any = [];

  constructor(
    public cnPriorityConfigFacade: CnPriorityConfigFacade,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog,
    private locationMappingFacade: LocationMappingFacade
  ) {
    this.cnPriorityConfigFacade.loadCnTypeList();
    this.cnTypeList$ = this.cnPriorityConfigFacade.getCnTypeList();
  }

  ngOnInit() {
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedLocations => {
        if (selectedLocations) {
          this.mappedLocations = selectedLocations;
        }
      });

    this.cnPriorityConfigFacade.loadReset();
    this.isLoading$ = this.cnPriorityConfigFacade.getIsloading();
    this.configId = this.activatedRoute.snapshot.params['_configId'];

    this.cnPriorityConfig$ = this.cnPriorityConfigFacade.getCnPriorityConfig();

    this.cnPriorityConfigFacade
      .getCnPriorityConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configDetails => {
        if (configDetails && configDetails.configId !== 'new') {
          this.configId = configDetails.configId;

        }
      });
    if (this.configId === 'new') {
      this.cnPriorityConfigFacade.loadNewCnPriorityConfigByConfigId();
    } else {
      this.cnPriorityConfigFacade.loadCnPriorityConfigByConfigId(this.configId);
    }

    this.cnPriorityConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.saveNotification('pw.cnPriorityConfig.successMsg');
        }
      });
    this.cnPriorityConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.saveNotification('pw.cnPriorityConfig.updatedMsg');
        } else this.overlayNotification.close();
      });

    this.cnPriorityConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  back() {
    this.cnPriorityConfigFacade.loadReset();
    this.router.navigate([getCreditNotePriorityListRouteUrl()]);
  }
  createConfiguration(cnPriorityConfig: CnPriorityConfig) {
    const configId = this.activatedRoute.snapshot.params['_configId'];
    if (configId === 'new') {
      this.cnPriorityConfigFacade.saveCnPriorityConfig(cnPriorityConfig);
    } else {
      cnPriorityConfig.configId = configId;
      this.cnPriorityConfigFacade.updateCnPriorityConfig(cnPriorityConfig);
    }
  }

  openLocationMapping($event) {
    this.configId = this.activatedRoute.snapshot.params['_configId'];

    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: this.configId,
        configType: ConfigTypeEnum.CN_PRIORITY_CONFIG
      }
    });
  }

  saveNotification(key) {
    this.locationMappingFacade.loadMappedLocations({
      ruleType: ConfigTypeEnum.CN_PRIORITY_CONFIG,
      ruleID: this.configId
    });
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
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.router.navigate([
              getCreditNotePriorityDetailRouteUrl(this.configId)
            ]);
            console.log('mappedLocations', this.mappedLocations);
            if (this.mappedLocations.length === 0) {
              this.showLocMappingAlertMessage();
            }
          });
      });
  }

  showLocMappingAlertMessage() {
    this.dialog.closeAll();
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.cnPriorityConfig.locationsMandatoryMessage'
      })
      .pipe(take(1))
      .subscribe();
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.TIMER,
          message: translatedMsg,
          hasBackdrop: true
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
