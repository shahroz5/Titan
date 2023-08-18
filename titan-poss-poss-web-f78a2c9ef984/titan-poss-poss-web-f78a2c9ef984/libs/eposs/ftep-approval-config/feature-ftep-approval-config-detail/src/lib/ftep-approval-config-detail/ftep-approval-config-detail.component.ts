import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FtepApprovalConfigFacade } from '@poss-web/eposs/ftep-approval-config/data-access-ftep-approval-config';
import {
  ActiveConfigs,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigTypeEnum,
  CustomErrors,
  FtepApprovalConfig,
  LocationMappingServiceAbstraction,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RoleList,
  SelectedLocation
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  getFtepApprovalConfigDetailRouteUrl,
  getFtepApprovalConfigListRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-ftep-approval-config-detail',
  templateUrl: './ftep-approval-config-detail.component.html'
})
export class FtepApprovalConfigDetailComponent implements OnInit, OnDestroy {
  ruleId: string;
  ruleType: string;
  ftepApprovalConfig$: Observable<FtepApprovalConfig>;
  selectedLocations: SelectedLocation[] = [];
  activeConfigs: Observable<ActiveConfigs[]>;
  activeConfigValue: ActiveConfigs[];
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  mappedLocations: any = [];
  // noConfigValueMapErrorCode: string;
  // noLocationError: string;
  formGroup: FormGroup;
  roleList$: Observable<RoleList[]>;
  showViewOnly: boolean;
  constructor(
    public ftepApprovalConfigFacade: FtepApprovalConfigFacade,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.locationMappingFacade.resetMappedLocations();
    this.ftepApprovalConfigFacade.loadReset();
    this.isLoading$ = this.ftepApprovalConfigFacade.getIsloading();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.showViewOnly = params?.showViewOnly ? true : false;
      });
    this.ftepApprovalConfigFacade.loadRoleList();
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedLocations => {
        if (selectedLocations) {
          this.mappedLocations = selectedLocations;
        }
      });

    this.roleList$ = this.ftepApprovalConfigFacade.getRoleList();
    this.ftepApprovalConfigFacade.loadRoleList();
    this.ruleId = this.activatedRoute.snapshot.params['_ruleId'];
    this.ruleType = this.activatedRoute.snapshot.params['_ruleType'];

    this.ftepApprovalConfig$ = this.ftepApprovalConfigFacade.getFtepApprovalConfig();

    this.ftepApprovalConfigFacade
      .getFtepApprovalConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configDetails => {
        if (
          configDetails &&
          configDetails.ruleId !== 'new' &&
          !this.showViewOnly
        ) {
          if (configDetails.isActive === true) {
            this.ruleType = configDetails.ruleType;
            this.ruleId = configDetails.ruleId;
          }

        }
      });
    if (this.ruleId === 'new') {
      this.ftepApprovalConfigFacade.loadNewFtepApprovalConfigByRuleId();
    } else {
      this.locationMappingFacade.loadMappedLocations({
        ruleType: ConfigTypeEnum.FTEP_APPROVAL_ACCESS_REGULAR,
        ruleID: this.ruleId
      });
      this.ftepApprovalConfigFacade.loadFtepApprovalConfigByRuleId(
        this.ruleId,
        this.ruleType
      );
    }

    this.ftepApprovalConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.saveNotification('pw.ftepApprovalConfig.successMessage');
        }
      });
    this.ftepApprovalConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.saveNotification('pw.ftepApprovalConfig.updatedMsg');
        } else this.overlayNotification.close();
      });

    this.ftepApprovalConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  back() {
    this.ftepApprovalConfigFacade.loadReset();
    this.router.navigate([getFtepApprovalConfigListRouteUrl()]);
  }

  saveNotification(key) {
    this.locationMappingFacade.loadMappedLocations({
      ruleType: ConfigTypeEnum.FTEP_APPROVAL_ACCESS_REGULAR,
      ruleID: this.ruleId
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
              getFtepApprovalConfigDetailRouteUrl(this.ruleId, this.ruleType)
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
        message: 'pw.ftepApprovalConfig.locationsMandatoryMessage'
      })
      .pipe(take(1))
      .subscribe();
  }

  createFtepApprovalConfig(ftepApprovalConfig: FtepApprovalConfig) {
    const ruleId = this.activatedRoute.snapshot.params['_ruleId'];
    if (ruleId === 'new') {
      this.ftepApprovalConfigFacade.searchFtepType(
        ftepApprovalConfig.description.toUpperCase()
      );
      let exsitingGRN = null;
      setTimeout(() => {
        this.ftepApprovalConfigFacade
          .getFtepApprovalConfigList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(ftepConfig => {
            if (ftepConfig.length !== 0) {
              exsitingGRN = ftepConfig[0];
            }
          });
      }, 500);

      setTimeout(() => {
        if (exsitingGRN) {
          if (
            exsitingGRN.description.toUpperCase() ===
            ftepApprovalConfig.description.toUpperCase()
          ) {
            this.showAlredyExisteNotification(
              'FTEP approval access configuration already exist'
            );
          }
        } else {
          this.ftepApprovalConfigFacade.saveFtepApprovalConfig(
            ftepApprovalConfig
          );
        }
      }, 1000);
    } else {
      ftepApprovalConfig.ruleId = ruleId;
      this.ftepApprovalConfigFacade.updateFtepApprovalConfig(
        ftepApprovalConfig
      );
    }
  }

  openLocationMapping($event) {
    this.ruleId = this.activatedRoute.snapshot.params['_ruleId'];

    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: this.ruleId,
        configType: ConfigTypeEnum.FTEP_APPROVAL_ACCESS_REGULAR
      }
    });
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

  showAlredyExisteNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          message: translatedMsg,
          hasBackdrop: true,
          hasClose: true
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
