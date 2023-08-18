import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CnValidationFacade } from '@poss-web/eposs/cn-validation/data-access-cn-validation';
import {
  ActiveConfigs,
  CnTypeList,
  CnValidation,
  ConfigTypeEnum,
  CustomErrors,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectedLocation
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { getCreditNoteValidationListRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-cn-validation-view-detail',
  templateUrl: './cn-validation-view-detail.component.html'
})
export class CnValidationViewDetailComponent implements OnInit, OnDestroy {
  ruleId: string;
  ruleType: string;
  cnValidation$: Observable<CnValidation>;
  selectedLocations: SelectedLocation[] = [];
  activeConfigs: Observable<ActiveConfigs[]>;
  activeConfigValue: ActiveConfigs[];
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  cnTypeList$: Observable<CnTypeList[]>;
  mappedLocations = [];
  constructor(
    public cnValidationFacade: CnValidationFacade,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade
  ) {}

  ngOnInit() {
    this.cnValidationFacade.loadReset();
    this.isLoading$ = this.cnValidationFacade.getIsloading();

    this.cnValidationFacade.loadCnTypeList();
    this.cnTypeList$ = this.cnValidationFacade.getCnTypeList();

    this.ruleId = this.activatedRoute.snapshot.params['_ruleId'];
    this.ruleType = this.activatedRoute.snapshot.params['_ruleType'];
    this.getCNTypeEnum();

    this.cnValidation$ = this.cnValidationFacade.getCnValidation();

    if (this.ruleId === 'new') {
      this.cnValidationFacade.loadNewCnValidationByRuleId();
    } else {
      this.cnValidationFacade.loadCnValidationByRuleId(
        this.ruleId,
        this.ruleType
      );
    }

    this.cnValidationFacade
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
    this.cnValidationFacade.loadReset();
    this.router.navigate([getCreditNoteValidationListRouteUrl()]);
  }

  openLocationMapping($event) {
    this.ruleId = this.activatedRoute.snapshot.params['_ruleId'];

    this.locationMappingService.open({
      isConfig: true,
      readonly: true,
      configDetails: {
        configId: this.ruleId,
        configType: this.getCNTypeEnum()
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

      });
  }

  getCNTypeEnum(): ConfigTypeEnum {
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
