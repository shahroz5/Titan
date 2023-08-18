import { Component, OnInit, OnDestroy } from '@angular/core';
import { BgrToleranceConfigFacade } from '@poss-web/eposs/bgr-tolerance-config/data-access-bgr-tolerance-config';
import {
  OverlayNotificationServiceAbstraction,
  LocationMappingServiceAbstraction,
  AbToleranceWeightRange,
  AbToleranceConfigMetalType,
  ConfigTypeEnum,
  CustomErrors,
  OverlayNotificationType,
  AbToleranceRangeMappingResponse,
  AbToleranceConfigResponse,
  SaveAbTolerancePayload,
  ABToleranceUpdateRangeMappingPayload,
  AbToleranceRangeConfigRequest,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OrderTypesEnum
} from '@poss-web/shared/models';
import {
  getBgrToleranceConfigDetailsRouteUrl,
  getBgrToleranceConfigListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { TranslateService } from '@ngx-translate/core';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
@Component({
  selector: 'poss-web-bgr-tolerance-config-details',
  templateUrl: './bgr-tolerance-config-details.component.html',
  styleUrls: ['./bgr-tolerance-config-details.component.scss']
})
export class BgrToleranceConfigDetailsComponent implements OnInit, OnDestroy {
  formData: FormGroup;
  isLoading$: Observable<boolean>;
  configId: string;
  orderType: string;
  noLocationError: string;
  isActive: boolean;
  weightRange$: Observable<AbToleranceWeightRange[]>;
  metalTypes$: Observable<AbToleranceConfigMetalType[]>;
  toleranceConfig: Observable<AbToleranceRangeMappingResponse>;
  selectedConfigDetails: AbToleranceConfigResponse;
  isRowDeletedRecently = false;
  recentlyDeletedRangeId = '';
  deleteId = '';
  configIdInValidationSlabFailureScenario: number;
  destroy$ = new Subject();
  showViewOnly: boolean;
  mappedLocations = [];
  ruleType: string;
  orderTypes = [
    {
      value: OrderTypesEnum.ADVANCE_BOOKING,
      description: OrderTypesEnum.ADVANCE_BOOKING
    },
    {
      value: OrderTypesEnum.CUSTOMER_ORDER,
      description: OrderTypesEnum.CUSTOMER_ORDER
    }
  ];
  constructor(
    private bgrToleranceConfigFacade: BgrToleranceConfigFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private dialog: MatDialog,
    public fb: FormBuilder,
    private locationMappingFacade: LocationMappingFacade,
    private selectionDialog: SelectionDialogService
  ) {}

  ngOnInit(): void {
    this.isRowDeletedRecently = false;
    this.bgrToleranceConfigFacade.loadReset();
    this.activatedRoute.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });
    this.createForm();
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        this.orderType = param['_ruleType'];
        this.formData.get('orderType').setValue(this.orderType);
        if (this.configId !== 'new') {
          this.locationMappingFacade.loadMappedLocations({
            ruleType:
              this.orderType === OrderTypesEnum.ADVANCE_BOOKING
                ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
                : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG,
            ruleID: this.configId
          });
        }
      });
    this.bgrToleranceConfigFacade.loadBgrTolerancelWeightRanges();
    this.bgrToleranceConfigFacade.loadMetalTypes();
    this.weightRange$ = this.bgrToleranceConfigFacade.getWeightRanges();
    this.metalTypes$ = this.bgrToleranceConfigFacade.getMetalTypes();
    this.bgrToleranceConfigFacade
      .getToleranceConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe((configDetails: any) => {
        if (configDetails) {
          this.isActive = configDetails.isActive;
        }
        if (!this.isRowDeletedRecently) {
          this.toleranceConfig = configDetails;
        }
      });
    this.isLoading$ = this.bgrToleranceConfigFacade.getIsloading();

    this.noLocationError = ErrorEnums.ERR_CONFIG_002;

    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
          console.log('mappedLocations', mappedLocations);
        }
      });

    this.bgrToleranceConfigFacade
      .getAbToleranceConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.selectedConfigDetails = data;
          this.isActive = this.selectedConfigDetails.isActive;
          this.formData.patchValue({
            configName: this.selectedConfigDetails?.description,
            isActive: this.selectedConfigDetails?.isActive,
            orderType: this.orderType
          });
        }
      });

    this.bgrToleranceConfigFacade
      .getConfigId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configId => {
        if (configId !== null && configId !== 'new') {
          this.bgrToleranceConfigFacade.loadBgrMappingByConfigId(
            configId,
            this.orderType === OrderTypesEnum.ADVANCE_BOOKING
              ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
              : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
          );
          this.showSuccessMessageNotification(
            'Configuration Saved Successfully'
          );
          this.formData.get('configName').disable({ onlySelf: true });
          this.formData.get('orderType').disable({ onlySelf: true });
          setTimeout(() => {
            this.router.navigate([
              getBgrToleranceConfigDetailsRouteUrl(
                configId,
                this.formData.get('orderType').value
              )
            ]);
          }, 2000);
        }
      });
    if (this.configId !== 'new') {
      this.formData.get('configName').disable({ onlySelf: true });
      this.formData.get('orderType').disable({ onlySelf: true });
      this.bgrToleranceConfigFacade.loadSelectedConfigDetails(
        this.configId,
        this.orderType === OrderTypesEnum.ADVANCE_BOOKING
          ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
          : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
      );
    }

    this.bgrToleranceConfigFacade
      .getConfigIdInValidationSlabFailure()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configIdInValidationSlabFailureScenario => {
        this.configIdInValidationSlabFailureScenario = configIdInValidationSlabFailureScenario;
      });

    this.bgrToleranceConfigFacade.loadBgrMappingByConfigId(
      this.configId,
      this.formData.get('orderType').value === OrderTypesEnum.ADVANCE_BOOKING
        ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
        : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
    );
    this.bgrToleranceConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          setTimeout(() => {
            this.bgrToleranceConfigFacade.loadSelectedConfigDetails(
              this.configId,
              this.formData.get('orderType').value ===
                OrderTypesEnum.ADVANCE_BOOKING
                ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
                : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
            );
            this.bgrToleranceConfigFacade.loadBgrMappingByConfigId(
              this.configId,
              this.formData.get('orderType').value ===
                OrderTypesEnum.ADVANCE_BOOKING
                ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
                : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
            );
          }, 2000);
          this.showSuccessMessageNotification(
            'Configuration updated successfully'
          );
        } else this.overlayNotification.close();
      });
    this.bgrToleranceConfigFacade
      .getIsCleared()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.isRowDeletedRecently = true;
          this.deleteId = this.recentlyDeletedRangeId;
          setTimeout(() => {
            this.bgrToleranceConfigFacade.loadSelectedConfigDetails(
              this.configId,
              this.formData.get('orderType').value ===
                OrderTypesEnum.ADVANCE_BOOKING
                ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
                : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
            );
            this.bgrToleranceConfigFacade.loadBgrMappingByConfigId(
              this.configId,
              this.formData.get('orderType').value ===
                OrderTypesEnum.ADVANCE_BOOKING
                ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
                : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
            );
          }, 2000);
          this.showSuccessMessageNotification(
            'Configuration Removed successfully'
          );
        } else this.overlayNotification.close();
      });

    this.bgrToleranceConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });
  }
  openViewLocationMapping() {
    this.selectionDialog
      .open({
        title: 'Mapped Locations',
        placeholder: 'Search Location',
        options: this.mappedLocations
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
        }
      });
  }
  createForm() {
    this.formData = new FormGroup({
      configName: new FormControl('', [
        this.fieldValidatorsService.requiredField('Config Name'),
        this.fieldValidatorsService.descriptionField('Config Name')
      ]),
      isActive: new FormControl(true),
      orderType: new FormControl(OrderTypesEnum.ADVANCE_BOOKING)
    });
  }
  back() {
    this.bgrToleranceConfigFacade.loadReset();
    this.router.navigate([getBgrToleranceConfigListRouteUrl()]);
  }
  openLocationMapping() {
    this.configId = this.activatedRoute.snapshot.params['_configId'];

    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: this.configId,
        configType:
          this.formData.get('orderType').value ===
          OrderTypesEnum.ADVANCE_BOOKING
            ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
            : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
      }
    });
  }

  onOrderTypeChanged(event: any) {
    console.log('EVENT 123 :', event);
    // if (event.value === OrderTypesEnum.ADVANCE_BOOKING) {
    //   this.ruleType = ConfigTypeEnum.BGR_TOLERANCE_CONFIG;
    // }
  }

  createConfiguration(payload: any) {
    this.deleteId = '';
    this.recentlyDeletedRangeId = '';
    this.isRowDeletedRecently = false;
    console.log(this.formData.get('orderType').value);
    if (this.configId === 'new') {
      const saveTolerancePayload: SaveAbTolerancePayload = {
        ruleType:
          this.formData.get('orderType').value ===
          OrderTypesEnum.ADVANCE_BOOKING
            ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
            : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG,
        configDetail: {
          description: this.formData.get('configName').value,
          isActive: this.formData.get('isActive').value
            ? this.formData.get('isActive').value
            : false,
          ruleDetails: {
            type:
              this.formData.get('orderType').value ===
              OrderTypesEnum.ADVANCE_BOOKING
                ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
                : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG,
            data: {}
          }
        },
        residualTolerance: payload
      };
      this.bgrToleranceConfigFacade.saveToleranceConfig(saveTolerancePayload);
    } else {
      this.bgrToleranceConfigFacade.updateBgrTolerance({
        id: this.configId,
        data: payload,
        ruleType:
          this.formData.get('orderType').value ===
          OrderTypesEnum.ADVANCE_BOOKING
            ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
            : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
      });
    }
  }
  showSuccessMessageNotification(key: any) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: key,
        hasClose: true,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event && event.eventType === OverlayNotificationEventType.CLOSE) {
          this.back();
        }
      });
  }
  errorHandler(error: CustomErrors) {
    if (error.code === this.noLocationError) {
      return;
    }
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === 0 && error.code === ErrorEnums.ERR_CONFIG_005) {
          this.router.navigate([
            getBgrToleranceConfigDetailsRouteUrl(
              // this.configIdInValidationSlabFailureScenario
              this.configId,
              this.formData.get('orderType').value
            )
          ]);
          this.bgrToleranceConfigFacade.updateConfigId(null);
          this.configIdInValidationSlabFailureScenario = null;
        }
      });
  }
  remove(ordrerPaymentConfigReq: AbToleranceRangeConfigRequest) {
    this.recentlyDeletedRangeId = ordrerPaymentConfigReq.removeRangeConfigs[0];
    const updateWeightTolerancePayload: ABToleranceUpdateRangeMappingPayload = {
      id: this.configId,
      data: ordrerPaymentConfigReq,
      ruleType:
        this.formData.get('orderType').value === OrderTypesEnum.ADVANCE_BOOKING
          ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
          : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
    };
    this.bgrToleranceConfigFacade.removeConfiguration(
      updateWeightTolerancePayload
    );
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateConfig(event) {
    this.isActive = !this.isActive;

    this.formData.get('isActive').setValue(event.checked);
    this.formData.updateValueAndValidity();
    const updateConfigPayload: AbToleranceConfigResponse = {
      ruleType:
        this.formData.get('orderType').value === OrderTypesEnum.ADVANCE_BOOKING
          ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
          : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG,
      ruleId: Number(this.configId),
      isActive: this.formData.get('isActive').value
        ? this.formData.get('isActive').value
        : false
      //   // ruleDetails: {
      //   //   type: ConfigTypeEnum.BGR_TOLERANCE_CONFIG,
      //   //   data: {
      //   //     // isApplicableForNonFrozenOrder: this.formData.get(
      //   //     //   'isApplicableForNonFrozenOrder'
      //   //     // ).value
      //   //     //   ? this.formData.get('isApplicableForNonFrozenOrder').value
      //   //     //   : false,
      //   //     // isApplicableForFrozenOrder: this.formData.get(
      //   //     //   'isApplicableForFrozenOrder'
      //   //     // ).value
      //   //     //   ? this.formData.get('isApplicableForFrozenOrder').value
      //   //     //   : false
      //   //   }
      //   // }
    };
    if (this.configId !== 'new') {
      this.bgrToleranceConfigFacade.updateConfigIsActive(updateConfigPayload);
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
        this.bgrToleranceConfigFacade.searchConfigByConfigName(
          this.formData.get('configName').value,
          this.formData.get('orderType').value ===
            OrderTypesEnum.ADVANCE_BOOKING
            ? ConfigTypeEnum.BGR_TOLERANCE_CONFIG
            : ConfigTypeEnum.BGR_CO_TOLERANCE_CONFIG
        );
        this.bgrToleranceConfigFacade
          .getBgrToleranceConfigList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            if (data && data.length !== 0) {
              this.formData
                .get('configName')
                .setValidators([
                  this.fieldValidatorsService.isUniqueCheck(
                    'Config Name',
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
}
