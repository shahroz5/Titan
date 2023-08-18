import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AlertPopupServiceAbstraction,
  ConfigTypeEnum,
  CustomErrors,
  AlertPopupTypeEnum,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  TEPStoneConfig,
  TEPStoneConfigDetails,
  TEPStoneConfigEnum,
  TEPStoneConfigGridEnum,
  TEPStoneConfigQualities,
  TEPStoneConfigRange,
  TEPStoneConfigStoneType,
  TEPStoneDetailsModify
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { TepStoneConfigFacade } from '@poss-web/eposs/tep-stone-config/data-access-tep-stone-config';
import {
  getTepStoneConfigDetailsRouteUrl,
  getTEPStoneConfigurationRouteUrl
} from '@poss-web/shared/util-site-routes';
import { take, takeUntil } from 'rxjs/operators';
import { TepStoneConfigEditDialogComponent } from '@poss-web/eposs/tep-stone-config/ui-tep-stone-config-detail';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-tep-stone-config-detail',
  templateUrl: './tep-stone-config-detail.component.html',
  styles: []
})
export class TepStoneConfigDetailComponent implements OnInit, OnDestroy {
  constructor(
    private locationMappingService: LocationMappingServiceAbstraction,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private tepStoneConfigFacade: TepStoneConfigFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade // private binRequestFacade: RequestApprovalsFacade // Test only
  ) {}

  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  configId: string;

  tepStoneConfigDetails$: Observable<TEPStoneConfig>;
  tepStoneConfigDetails: TEPStoneConfig;
  tepStoneConfigDetailsList$: Observable<TEPStoneConfigDetails[]>;

  tepStoneConfigStoneType$: Observable<TEPStoneConfigStoneType[]>;
  tepStoneConfigQualities$: Observable<TEPStoneConfigQualities[]>;
  tepStoneConfigRange$: Observable<TEPStoneConfigRange[]>;

  tepStoneDetailsModify: TEPStoneDetailsModify;
  showViewOnly: boolean;
  mappedLocations = [];


  ngOnInit(): void {
    this.locationMappingFacade.resetMappedLocations();
    this.locationMappingFacade.resetMappedConfigs();

    this.configId = this.activatedRoute.snapshot.params['_id'];
    this.isLoading$ = this.tepStoneConfigFacade.getIsloading();
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

    this.tepStoneConfigFacade.loadTepStoneConfigDetails(this.configId);
    this.loadTepStoneConfigDetailsList();

    this.tepStoneConfigDetails$ = this.tepStoneConfigFacade.getTepStoneConfigDetails();
    this.tepStoneConfigDetailsList$ = this.tepStoneConfigFacade.getTepStoneConfigDetailsList();

    this.tepStoneConfigFacade.LoadTepStoneTypesListing();
    this.tepStoneConfigFacade.LoadTepStoneQualitiesListing();
    this.tepStoneConfigFacade.LoadTepStoneRangeListing();

    this.tepStoneConfigStoneType$ = this.tepStoneConfigFacade.getTepStoneConfigStoneType();
    this.tepStoneConfigQualities$ = this.tepStoneConfigFacade.getTepStoneConfigQualities();
    this.tepStoneConfigRange$ = this.tepStoneConfigFacade.getTepStoneConfigRange();

    this.tepStoneConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tepStoneConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotification('pw.tepStoneConfig.TEPStoneConfigurationSaved');
          if (this.configId === TEPStoneConfigEnum.NEW) {
            this.tepStoneConfigDetails$.pipe(take(1)).subscribe(data => {
              this.configId = data.configId;
              if (data.configId) {
                if (this.tepStoneDetailsModify?.addStones?.length) {
                  this.tepStoneConfigDetailsFormOutput({
                    mode: TEPStoneConfigGridEnum.ADD,
                    formData: this.tepStoneDetailsModify
                  });
                }
                this.showLocMappingAlertMessage();
                this.router.navigate([
                  getTepStoneConfigDetailsRouteUrl(),
                  data.configId
                ]);
              }
            });
          }
        }
      });

    this.tepStoneConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotification('pw.tepStoneConfig.TEPStoneConfigurationSaved');
        }
      });
  }

  loadTepStoneConfigDetailsList() {
    if (this.configId !== TEPStoneConfigEnum.NEW) {
      this.tepStoneConfigFacade.loadTepStoneConfigDetailsList(this.configId);
    }
  }

  openLocationMapping() {
    const configId = this.activatedRoute.snapshot.params['_id'];
    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId,
        configType: ConfigTypeEnum.TEP_STONE
      }
    });
  }

  tepStoneConfigFormOutput(formData: TEPStoneConfig) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(take(1))
      .subscribe(result => {
        if (result) {
          if (this.configId === TEPStoneConfigEnum.NEW) {
            this.tepStoneConfigFacade.saveTepStoneConfig(formData);
          } else {
            this.tepStoneConfigFacade.updateTepStoneConfigDetails(formData);
          }
        }
      });
  }
  tepStoneConfigDetailsFormOutput(event: {
    mode: TEPStoneConfigGridEnum;
    formData: TEPStoneDetailsModify;
  }) {
    if (event.mode === TEPStoneConfigGridEnum.ADD) {
      if (this.configId === TEPStoneConfigEnum.NEW) {
        this.tepStoneDetailsModify = event.formData;
      } else {
        this.tepStoneConfigFacade.saveTepStoneConfigDetails(
          this.configId,
          event.formData
        );
        this.tepStoneDetailsModify = {
          addStones: []
        };
      }
    }
    if (event.mode === TEPStoneConfigGridEnum.REMOVE) {
      this.tepStoneConfigFacade.removeTepStoneConfigDetails(
        this.configId,
        event.formData
      );
    }
  }
  editGridValue(selectedConfig: TEPStoneConfigDetails[]) {
    const dialogRef = this.dialog.open(TepStoneConfigEditDialogComponent, {
      width: '300px',
      height: 'auto',
      data: selectedConfig,
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(event => {
        if (event) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(take(1))
            .subscribe(result => {
              if (result) {
                if (event.mode === TEPStoneConfigGridEnum.EDIT) {
                  this.tepStoneConfigFacade.editTepStoneConfigDetails(
                    this.configId,
                    event.formData
                  );
                }
              }
            });
        }
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
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
          .events.subscribe(() => {
            this.overlayNotification.close();
          });
      });
  }

  stoneTypeCodeGridSearch(event: string) {
    this.tepStoneConfigFacade.searchTepStoneConfigDetails(
      this.configId,
      event.toUpperCase()
    );
  }
  clearGridSearch(event: boolean) {
    this.loadTepStoneConfigDetailsList();
  }

  // Instead show alert message to select atlease one location mapping
  showLocMappingAlertMessage() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.tepStoneConfig.selAtleaseOneLocation'
      })
      .pipe(take(1))
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

  backArrow() {
    this.router.navigate([getTEPStoneConfigurationRouteUrl()]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
