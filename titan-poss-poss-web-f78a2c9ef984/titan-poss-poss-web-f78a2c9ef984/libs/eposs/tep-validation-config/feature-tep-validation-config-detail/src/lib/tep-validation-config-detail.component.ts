import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  CustomErrors,
  OverlayNotificationType,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  ConfigTypeEnum,
  TEPValidationConfigResult,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import {
  getTepValidationConfigDetailsRouteUrl,
  getTEPValidationConfigurationRouteUrl
} from '@poss-web/shared/util-site-routes';
import { TepValidationConfigFacade } from '@poss-web/eposs/tep-validation-config/data-access-tep-validation-config';
import { MatDialog } from '@angular/material/dialog';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-tep-validation-config-detail',
  templateUrl: './tep-validation-config-detail.component.html',
  styles: []
})
export class TepValidationConfigDetailComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationMappingService: LocationMappingServiceAbstraction,
    private dialog: MatDialog,
    private tepValidationConfigFacade: TepValidationConfigFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade
  ) {}

  buttonText: string;
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  tepValidationConfigDetails$: Observable<TEPValidationConfigResult>;
  tepValidationConfigDetails: TEPValidationConfigResult;
  mappedLocations = [];
  showViewOnly: boolean;

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.showViewOnly = params?.showViewOnly ? true : false;
      });

    this.buttonText = this.translate.instant('pw.alertPopup.okayButtonText');

    const param = this.activatedRoute.snapshot.params['_id'];
    this.isLoading$ = this.tepValidationConfigFacade.getIsloading();
    this.tepValidationConfigFacade.loadTepValidationConfigDetails(param);

    this.tepValidationConfigDetails$ = this.tepValidationConfigFacade.getTepValidationConfigDetails();

    this.tepValidationConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepValidationConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.tepValidationConfigDetails$.pipe(take(1)).subscribe(data => {
            if (data.configId) {
              this.router.navigate([
                getTepValidationConfigDetailsRouteUrl(),
                data.configId
              ]);

              this.tepValidationConfigDetailsFormOutput({
                ...this.tepValidationConfigDetails,
                configId: data.configId
              });

              this.showLocMappingAlertMessage();
            }
          });
          this.showNotification(
            'pw.tepValidationConfig.TEPValidationConfigurationSaved'
          );
        }
      });
    this.tepValidationConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotification(
            'pw.tepValidationConfig.TEPValidationConfigurationSaved',
            true
          );
        }
      });

    if (param !== 'new') {
      this.locationMappingFacade.loadMappedLocations({
        ruleType: ConfigTypeEnum.TEP_VALIDATION,
        ruleID: param
      });
    }
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
    this.router.navigate([getTEPValidationConfigurationRouteUrl()]);
  }

  tepValidationConfigDetailsFormOutput($event: TEPValidationConfigResult) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(take(1))
      .subscribe(result => {
        if (result) {
          this.tepValidationConfigDetails = $event;
          if ($event.configId) {
            this.tepValidationConfigFacade.updateTepValidationConfigDetails(
              $event
            );
          } else {
            this.tepValidationConfigFacade.saveTepValidationConfigDetails(
              $event
            );
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
            buttonText: this.buttonText,
            message: translatedMsg,
            time: 2000,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe(() => {
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
        configType: ConfigTypeEnum.TEP_VALIDATION
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
          // this.selectedLocation = selectedOption;
          // this.locationCode = selectedOption.id;
          // this.priceGroupMappingFacade.loadLocationPriceGroupMappingList(
          //   this.locationCode
          // );
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
