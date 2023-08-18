import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GrnApprovalConfigFacade } from '@poss-web/eposs/grn-approval-config/data-access-grn-approval-config';
import {
  ActiveConfigs,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigTypeEnum,
  CustomErrors,
  GrnApprovalConfig,
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
  getGrnApprovalConfigDetailRouteUrl,
  getGrnApprovalConfigListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { MatDialog } from '@angular/material/dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-grn-approval-config-detail',
  templateUrl: './grn-approval-config-detail.component.html'
})
export class GrnApprovalConfigDetailComponent implements OnInit, OnDestroy {
  ruleId: string;
  ruleType: string;
  grnApprovalConfig$: Observable<GrnApprovalConfig>;
  selectedLocations: SelectedLocation[] = [];
  activeConfigs: Observable<ActiveConfigs[]>;
  activeConfigValue: ActiveConfigs[];
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  formGroup: FormGroup;
  roleList$: Observable<RoleList[]>;
  mappedLocations: any = [];
  permissions$: Observable<any[]>;
  constructor(
    public grnApprovalConfigFacade: GrnApprovalConfigFacade,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog,
    private locationMappingFacade: LocationMappingFacade,
    private permissionfacade: PermissionFacade
  ) {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
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

    this.grnApprovalConfigFacade.loadReset();
    this.isLoading$ = this.grnApprovalConfigFacade.getIsloading();

    this.grnApprovalConfigFacade.loadRoleList();

    this.roleList$ = this.grnApprovalConfigFacade.getRoleList();
    this.grnApprovalConfigFacade.loadRoleList();
    this.ruleId = this.activatedRoute.snapshot.params['_ruleId'];
    this.ruleType = this.activatedRoute.snapshot.params['_ruleType'];
    this.getGRNTypeEnum();

    this.grnApprovalConfig$ = this.grnApprovalConfigFacade.getGrnApprovalConfig();

    this.grnApprovalConfigFacade
      .getGrnApprovalConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configDetails => {
        if (configDetails && configDetails.ruleId !== 'new') {
          this.ruleType = configDetails.ruleType;
          this.ruleId = configDetails.ruleId;
        }
      });
    if (this.ruleId === 'new') {
      this.grnApprovalConfigFacade.loadNewGrnApprovalConfigByRuleId();
    } else {
      this.grnApprovalConfigFacade.loadGrnApprovalConfigByRuleId(
        this.ruleId,
        this.ruleType
      );
    }

    this.grnApprovalConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.saveNotification('pw.grnApprovalConfig.successMessage');
        }
      });
    this.grnApprovalConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.saveNotification('pw.grnApprovalConfig.updatedMsg');
        } else this.overlayNotification.close();
      });

    this.grnApprovalConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  back() {
    this.grnApprovalConfigFacade.loadReset();
    this.router.navigate([getGrnApprovalConfigListRouteUrl()]);
  }

  saveNotification(key) {
    this.locationMappingFacade.loadMappedLocations({
      ruleType: ConfigTypeEnum.GRN_APPROVAL_CONFIGURATION,
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
              getGrnApprovalConfigDetailRouteUrl(this.ruleId, this.ruleType)
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
        message: 'pw.grnApprovalConfig.locationsMandatoryMessage'
      })
      .pipe(take(1))
      .subscribe();
  }

  createGrnApprovalConfig(grnApprovalConfig: GrnApprovalConfig) {
    const ruleId = this.activatedRoute.snapshot.params['_ruleId'];
    if (ruleId === 'new') {
      this.grnApprovalConfigFacade.searchGrnType(
        grnApprovalConfig.description.toUpperCase()
      );
      let exsitingGRN = null;
      setTimeout(() => {
        this.grnApprovalConfigFacade
          .getGrnApprovalConfigList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(grnConfig => {
            if (grnConfig.length !== 0) {
              exsitingGRN = grnConfig.find(
                gr =>
                  gr.description.toUpperCase() ===
                  grnApprovalConfig.description.toUpperCase()
              );
            }
          });
      }, 500);

      setTimeout(() => {
        console.log(exsitingGRN);
        if (exsitingGRN) {
          if (
            exsitingGRN.description.toUpperCase() ===
            grnApprovalConfig.description.toUpperCase()
          ) {
            this.showAlredyExisteNotification(
              'GRN approval access configuration already exist'
            );
          }
        } else {
          this.grnApprovalConfigFacade.saveGrnApprovalConfig(grnApprovalConfig);
        }
      }, 1000);
    } else {
      grnApprovalConfig.ruleId = ruleId;
      this.grnApprovalConfigFacade.updateGrnApprovalConfig(grnApprovalConfig);
    }
  }

  openLocationMapping($event) {
    this.ruleId = this.activatedRoute.snapshot.params['_ruleId'];

    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: this.ruleId,
        configType: this.getGRNTypeEnum()
      }
    });
  }

  getGRNTypeEnum(): ConfigTypeEnum {
    for (const eachEnum in ConfigTypeEnum) {
      if (isNaN(Number(eachEnum))) {
        if (this.ruleType === eachEnum) {
          return ConfigTypeEnum[eachEnum] as ConfigTypeEnum;
        }
      }
    }
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
