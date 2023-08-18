import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResidualCoWeightConfigFacade } from '@poss-web/eposs/co-residual-weight-config/data-access-co-residual-weight-config';
import {
  OverlayNotificationServiceAbstraction,
  LocationMappingServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  ConfigTypeEnum,
  ResidualWeightConfigResponse,
  ResidualWeightRange,
  SaveResidualTolerancePayload,
  UpdateRangeMappingPayload,
  RangeConfigRequest,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import {
  getCOResidualWeightToleranceConfigRouteUrl,
  getCOResidualWeightToleranceDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
@Component({
  selector: 'poss-web-residual-weight-details',
  templateUrl: './residual-weight-details.component.html'
})
export class ResidualWeightDetailsComponent implements OnInit, OnDestroy {
  orderType = 'advance';
  formData: FormGroup;
  isLoading$: Observable<boolean>;
  configId: string;
  weightRange$: Observable<ResidualWeightRange[]>;
  rangeMappingConfig$: Observable<any>;
  noLocationError: string;
  selectedConfigDetails: ResidualWeightConfigResponse;
  destroy$ = new Subject();
  showViewOnly: boolean;
  mappedLocations = [];

  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number[];

  totalElements$: Observable<number>;

  constructor(
    private residualWeightConfigFacade: ResidualCoWeightConfigFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private dialog: MatDialog,
    public fb: FormBuilder,
    private alertPopupService: AlertPopupServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade,
    private appSettingFacade: AppsettingFacade
  ) {}

  routeParam: Observable<Params>;
  ngOnInit(): void {
    this.locationMappingFacade.resetMappedLocations();
    this.residualWeightConfigFacade.loadReset();
    this.totalElements$ = this.residualWeightConfigFacade.getRuleDetailsCount();
    this.activatedRoute.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.initialPageEvent.pageSize = data;
      });
    this.createForm();
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        if (this.configId !== 'new') {
          this.locationMappingFacade.loadMappedLocations({
            ruleType: ConfigTypeEnum.ORDER_CO_RESIDUAL_TOLERANCE_CONFIG,
            ruleID: this.configId
          });
        }
      });
    this.residualWeightConfigFacade.loadResidualWeightRanges();
    this.weightRange$ = this.residualWeightConfigFacade.getResidualWeightRanges();
    this.rangeMappingConfig$ = this.residualWeightConfigFacade.getRangeMappingConfig();
    this.isLoading$ = this.residualWeightConfigFacade.getIsloading();

    this.noLocationError = ErrorEnums.ERR_CONFIG_002;
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
        }
      });

    this.residualWeightConfigFacade
      .getResidualWeightCOnfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.selectedConfigDetails = data;
          this.formData.patchValue({
            configName: this.selectedConfigDetails?.description,
            isActive: this.selectedConfigDetails?.isActive
          });
        }
      });
    this.residualWeightConfigFacade
      .getConfigId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configId => {
        if (configId !== null && configId !== 'new') {
          this.configId = configId;

          this.loadResidualTolerance();
          this.showSaveSuccessMessageNotification(
            'Configuration Saved Successfully'
          );
          this.formData.get('configName').disable({ onlySelf: true });
        }
      });
    if (this.configId && this.configId !== 'new') {
      this.formData.get('configName').disable({ onlySelf: true });
      this.residualWeightConfigFacade.loadSelectedConfigDetails(this.configId);
      this.loadResidualTolerance();
    }

    this.residualWeightConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.loadResidualTolerance();
          this.showSuccessMessageNotification(
            'Configuration updated successfully'
          );
        } else this.overlayNotification.close();
      });

    this.residualWeightConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.residualWeightConfigFacade
      .getIsCleared()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.residualWeightConfigFacade.loadSelectedConfigDetails(
            this.configId
          );

          this.loadResidualTolerance();

          this.showSuccessMessageNotification(
            'Configuration Removed successfully'
          );
        } else this.overlayNotification.close();
      });
  }
  createForm() {
    this.formData = new FormGroup({
      configName: new FormControl('', [
        this.fieldValidatorsService.requiredField('Config Name'),
        this.fieldValidatorsService.descriptionField('Config Name')
      ]),
      isActive: new FormControl(true)
    });
  }
  back() {
    this.residualWeightConfigFacade.loadReset();
    this.router.navigate([getCOResidualWeightToleranceConfigRouteUrl()]);
  }
  showSuccessMessageNotification(key: any) {
    // this.translate
    //   .get(key)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((translatedMsg: string) => {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: key,
        hasClose: true,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.back();
        }
      });
    // });
  }
  showSaveSuccessMessageNotification(key: any) {
    // this.translate
    //   .get(key)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((translatedMsg: string) => {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: key,
        hasClose: true,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.router.navigate([
            getCOResidualWeightToleranceDetailsRouteUrl(this.configId)
          ]);
          if (this.mappedLocations.length === 0) {
            this.showLocMappingAlertMessage();
          }
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
  errorHandler(error: CustomErrors) {
    if (error.code === this.noLocationError) {
      return;
    }
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  createConfiguration(payload: any) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          if (this.configId === 'new') {
            const saveTolerancePayload: SaveResidualTolerancePayload = {
              configDetail: {
                description: this.formData.get('configName').value,
                isActive: this.formData.get('isActive').value,
                ruleDetails: {}
              },
              residualTolerance: payload
            };
            this.residualWeightConfigFacade.saveWeightToleranceConfig(
              saveTolerancePayload
            );
          } else {
            const updateConfigPayload: UpdateRangeMappingPayload = {
              id: this.configId,
              data: payload
            };
            this.residualWeightConfigFacade.updateWeightTolerance(
              updateConfigPayload
            );
          }
        }
      });
  }
  editConfiguration(updateConfigs) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          const updateConfigPayload: UpdateRangeMappingPayload = {
            id: this.configId,
            data: {
              addRangeConfigs: [],
              updateRangeConfigs: updateConfigs
            }
          };
          this.residualWeightConfigFacade.updateWeightTolerance(
            updateConfigPayload
          );
        }
      });
  }

  openLocationMapping() {
    this.configId = this.activatedRoute.snapshot.params['_configId'];
    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: this.configId,
        configType: ConfigTypeEnum.ORDER_CO_RESIDUAL_TOLERANCE_CONFIG
      }
    });
  }
  updateConfig() {
    const payload: ResidualWeightConfigResponse = {
      ruleId: Number(this.configId),
      isActive: this.formData.get('isActive').value
        ? this.formData.get('isActive').value
        : true
    };
    if (this.configId !== 'new') {
      this.residualWeightConfigFacade.updateConfigIsActive(payload);
    }
  }

  loadCheckConfigName() {
    if (
      this.formData.get('configName').value !== '' &&
      this.formData.get('configName').valid
    ) {
      if (
        fieldValidation.nameWithSpaceField.pattern.test(
          this.formData.get('configName').value
        )
      ) {
        this.residualWeightConfigFacade.searchConfigByConfigName(
          this.formData.get('configName').value
        );
        this.residualWeightConfigFacade
          .getResidualWeightConfigList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            if (data && data.length !== 0) {
              this.formData
                .get('configName')
                .setValidators([
                  this.fieldValidatorsService.isUniqueCheck(
                    'config Name',
                    false
                  )
                ]);

              this.formData.controls['configName'].updateValueAndValidity();
            } else {
              this.formData.get('configName').clearValidators();
              this.formData
                .get('configName')
                .setValidators([
                  this.fieldValidatorsService.requiredField('Config Name'),
                  this.fieldValidatorsService.isUniqueCheck(
                    'Config Name',
                    true
                  ),
                  this.fieldValidatorsService.descriptionField('Config Name')
                ]);

              this.formData.controls['configName'].updateValueAndValidity();
            }
          });
      }
    } else {
      this.formData
        .get('configName')
        .setValidators([
          this.fieldValidatorsService.requiredField('Config Name'),
          this.fieldValidatorsService.isUniqueCheck('Config Name', true),
          this.fieldValidatorsService.descriptionField('Config Name')
        ]);
      this.formData.controls['configName'].updateValueAndValidity();
    }
  }
  remove(ordrerPaymentConfigReq: RangeConfigRequest) {
    const updateWeightTolerancePayload: UpdateRangeMappingPayload = {
      id: this.configId,
      data: ordrerPaymentConfigReq
    };
    this.residualWeightConfigFacade.removeConfiguration(
      updateWeightTolerancePayload
    );
  }
  paginate(pageEvent: PageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadResidualTolerance();
  }
  loadResidualTolerance() {
    if (this.configId) {
      this.residualWeightConfigFacade.loadRangeMappingByConfigId({
        pageIndex: this.initialPageEvent.pageIndex,
        pageSize: this.initialPageEvent.pageSize,
        configId: this.configId
      });
    }
  }
  showLocMappingAlertMessage() {
    this.dialog.closeAll();
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.coResidualToleranceDetails.locationsMandatoryMessage'
      })
      .pipe(take(1))
      .subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
