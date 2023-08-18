import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GrnApprovalConfigFacade } from '@poss-web/eposs/grn-approval-config/data-access-grn-approval-config';
import {
  ActiveConfigs,
  ConfigTypeEnum,
  CustomErrors,
  GrnApprovalConfig,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectedLocation
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  getGrnApprovalConfigListRouteUrl,
} from '@poss-web/shared/util-site-routes';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-grn-approval-config-view-detail',
  templateUrl: './grn-approval-config-view-detail.component.html'
})
export class GrnApprovalConfigViewDetailComponent implements OnInit, OnDestroy {
  ruleId: string;
  ruleType: string;
  grnApprovalConfig$: Observable<GrnApprovalConfig>;
  selectedLocations: SelectedLocation[] = [];
  activeConfigs: Observable<ActiveConfigs[]>;
  activeConfigValue: ActiveConfigs[];
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  formGroup: FormGroup;
  mappedLocations = [];
  constructor(
    public grnApprovalConfigFacade: GrnApprovalConfigFacade,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade
  ) {}

  ngOnInit() {
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
        }
      });
    this.grnApprovalConfigFacade.loadReset();
    this.isLoading$ = this.grnApprovalConfigFacade.getIsloading();

    this.grnApprovalConfigFacade.loadRoleList();

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

  openLocationMapping($event) {
    this.ruleId = this.activatedRoute.snapshot.params['_ruleId'];

    this.locationMappingService.open({
      isConfig: true,
      readonly: true,
      configDetails: {
        configId: this.ruleId,
        configType: this.getGRNTypeEnum()
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

  getGRNTypeEnum(): ConfigTypeEnum {
    for (const eachEnum in ConfigTypeEnum) {
      if (isNaN(Number(eachEnum))) {
        if (this.ruleType === eachEnum) {
          return ConfigTypeEnum[eachEnum] as ConfigTypeEnum;
        }
      }
    }
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
