import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  ActiveConfigs,
  CnPriorityConfig,
  CnTypeList,
  ConfigTypeEnum,
  CustomErrors,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectedLocation
} from '@poss-web/shared/models';

import { CnPriorityConfigFacade } from '@poss-web/eposs/cn-priority-config/data-access-cn-priority-config';
import { ActivatedRoute, Router } from '@angular/router';

import { take, takeUntil } from 'rxjs/operators';
import { getCreditNotePriorityListRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-cn-priority-config-view-detail',
  templateUrl: './cn-priority-config-view-detail.component.html'
})
export class CnPriorityConfigViewDetailComponent implements OnInit, OnDestroy {
  configId: string;
  cnPriorityConfig$: Observable<CnPriorityConfig>;
  selectedLocations: SelectedLocation[] = [];
  activeConfigs: Observable<ActiveConfigs[]>;
  activeConfigValue: ActiveConfigs[];
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  cnTypeList$: Observable<CnTypeList[]>;
  mappedLocations = [];

  constructor(
    public cnPriorityConfigFacade: CnPriorityConfigFacade,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade
  ) {
    this.cnPriorityConfigFacade.loadCnTypeList();
    this.cnTypeList$ = this.cnPriorityConfigFacade.getCnTypeList();
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
        }
      });
  }

  ngOnInit() {
    this.cnPriorityConfigFacade.loadReset();
    this.isLoading$ = this.cnPriorityConfigFacade.getIsloading();

    this.configId = this.activatedRoute.snapshot.params['_configId'];

    this.cnPriorityConfig$ = this.cnPriorityConfigFacade.getCnPriorityConfig();

    if (this.configId === 'new') {
      this.cnPriorityConfigFacade.loadNewCnPriorityConfigByConfigId();
    } else {
      this.cnPriorityConfigFacade.loadCnPriorityConfigByConfigId(this.configId);
    }

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

  openLocationMapping($event) {
    this.configId = this.activatedRoute.snapshot.params['_configId'];

    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: this.configId,
        configType: ConfigTypeEnum.CN_PRIORITY_CONFIG
      },
      readonly: true
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
