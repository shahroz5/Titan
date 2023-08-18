import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CnValidationFacade } from '@poss-web/eposs/cn-validation/data-access-cn-validation';
import {
  ActiveConfigs,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CnTypeList,
  CnValidation,
  ConfigTypeEnum,
  CustomErrors,
  LocationMappingServiceAbstraction,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectedLocation
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  getCreditNoteValidationDetailRouteUrl,
  getCreditNoteValidationListRouteUrl,
} from '@poss-web/shared/util-site-routes';
import { MatDialog } from '@angular/material/dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

@Component({
  selector: 'poss-web-cn-validation-detail',
  templateUrl: './cn-validation-detail.component.html'
})
export class CnValidationDetailComponent implements OnInit, OnDestroy {
  ruleId: string;
  ruleType: string;
  cnValidation$: Observable<CnValidation>;
  selectedLocations: SelectedLocation[] = [];
  activeConfigs: Observable<ActiveConfigs[]>;
  activeConfigValue: ActiveConfigs[];
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  formGroup: FormGroup;
  cnTypeList$: Observable<CnTypeList[]>;
  mappedLocations: any = [];
  constructor(
    public cnValidationFacade: CnValidationFacade,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog,
    private locationMappingFacade: LocationMappingFacade
  ) {}

  ngOnInit() {
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedLocations => {
        if (selectedLocations) {
          this.mappedLocations = selectedLocations;
        }
      });
    this.cnValidationFacade.loadReset();
    this.isLoading$ = this.cnValidationFacade.getIsloading();

    this.cnValidationFacade.loadCnTypeList();
    this.cnTypeList$ = this.cnValidationFacade.getCnTypeList();

    this.ruleId = this.activatedRoute.snapshot.params['_ruleId'];
    this.ruleType = this.activatedRoute.snapshot.params['_ruleType'];
    this.getCNTypeEnum();

    this.cnValidation$ = this.cnValidationFacade.getCnValidation();

    this.cnValidationFacade
      .getCnValidation()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configDetails => {
        if (configDetails && configDetails.ruleId !== 'new') {
          this.ruleType = configDetails.ruleType;
          this.ruleId = configDetails.ruleId;

        }
      });
    if (this.ruleId === 'new') {
      this.cnValidationFacade.loadNewCnValidationByRuleId();
    } else {
      this.cnValidationFacade.loadCnValidationByRuleId(
        this.ruleId,
        this.ruleType
      );
    }

    this.cnValidationFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.saveNotification('pw.cnValidation.successMessage');
        }
      });
    this.cnValidationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.saveNotification('pw.cnValidation.updateSuccessMessage');
        } else this.overlayNotification.close();
      });

    this.cnValidationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  back() {
    this.cnValidationFacade.loadReset();
    this.router.navigate([getCreditNoteValidationListRouteUrl()]);
  }
  createCnValidation(cnValidation: CnValidation) {
    const ruleId = this.activatedRoute.snapshot.params['_ruleId'];
    if (ruleId === 'new') {
      this.cnValidationFacade.saveCnValidation(cnValidation);
    } else {
      cnValidation.ruleId = ruleId;
      this.cnValidationFacade.updateCnValidation(cnValidation);
    }
  }

  openLocationMapping($event) {
    this.ruleId = this.activatedRoute.snapshot.params['_ruleId'];

    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: this.ruleId,
        configType: this.getCNTypeEnum()
      }
    });
  }

  saveNotification(key) {
    this.locationMappingFacade.loadMappedLocations({
      ruleType: ConfigTypeEnum.CN_VALIDATION_CONFIG,
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
              getCreditNoteValidationDetailRouteUrl(this.ruleId, this.ruleType)
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
        message: 'pw.cnValidation.locationsMandatoryMessage'
      })
      .pipe(take(1))
      .subscribe();
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
