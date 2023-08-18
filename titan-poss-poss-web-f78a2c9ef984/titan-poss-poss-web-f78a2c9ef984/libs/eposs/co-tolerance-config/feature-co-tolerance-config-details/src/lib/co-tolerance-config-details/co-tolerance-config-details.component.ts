import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoToleranceConfigFacade } from '@poss-web/eposs/co-tolerance-config/data-access-co-tolerance-config';
import {
  OverlayNotificationServiceAbstraction,
  LocationMappingServiceAbstraction,
  CoToleranceWeightRange,
  CoToleranceConfigMetalType,
  ConfigTypeEnum,
  CustomErrors,
  OverlayNotificationType,
  CoToleranceRangeMappingResponse,
  CoToleranceConfigResponse,
  SaveCoTolerancePayload,
  COToleranceUpdateRangeMappingPayload,
  CoToleranceRangeConfigRequest,
  SelectDropDownOption,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import {
  getCustomerOrderToleranceConfigListRouteUrl,
  getCustomerOrderToleranceConfigDetailsRouteUrl
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
import { PageEvent } from '@angular/material/paginator';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
@Component({
  selector: 'poss-web-co-tolerance-config-details',
  templateUrl: './co-tolerance-config-details.component.html'
})
export class CoToleranceConfigDetailsComponent implements OnInit, OnDestroy {
  formData: FormGroup;
  isLoading$: Observable<boolean>;
  configId: string;
  noLocationError: string;
  newlyCreated = false;

  weightRange$: Observable<CoToleranceWeightRange[]>;
  metalTypes$: Observable<CoToleranceConfigMetalType[]>;
  toleranceConfig$: Observable<CoToleranceRangeMappingResponse>;
  selectedConfigDetails: CoToleranceConfigResponse;

  orderType: string;
  orderTypeFormControl = new FormControl();

  orderTypesArray: SelectDropDownOption[];
  configurationSaveMessage: string;
  configurationUpdateMessage: string;
  configurationRemoveMessage: string;
  configName: string;

  destroy$ = new Subject();
  showViewOnly: boolean;
  mappedLocations = [];
  isMappedLocation = false;
  mappedLocationsTitle: string;
  searchLocationPlaceholder: string;

  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number[];

  totalElements$: Observable<number>;
  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  sortData: string[] = [];

  constructor(
    private coToleranceConfigFacade: CoToleranceConfigFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private dialog: MatDialog,
    public fb: FormBuilder,
    private alertPopupService: AlertPopupServiceAbstraction,
    private locationMappingFacade: LocationMappingFacade,
    private selectionDialog: SelectionDialogService,
    private appSettingFacade: AppsettingFacade
  ) {}

  ngOnInit(): void {
    this.sortData = [];
    this.locationMappingFacade.resetMappedLocations();
    this.isMappedLocation = false;
    this.coToleranceConfigFacade.loadReset();
    this.totalElements$ = this.coToleranceConfigFacade.getRuleDetailsTotalCount();
    this.activatedRoute.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });

    this.translate
      .get([
        'pw.coWeightTolerance.configName',
        'pw.coWeightTolerance.frozenOrder',
        'pw.coWeightTolerance.nonFrozenOrder',
        'pw.coWeightTolerance.mappedLocationsTitle',
        'pw.coWeightTolerance.searchLocationPlaceholder',
        'pw.coWeightTolerance.configurationSaveMessage',
        'pw.coWeightTolerance.configurationUpdateMessage',
        'pw.coWeightTolerance.configurationRemoveMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.configName = translatedMessages['pw.coWeightTolerance.configName'];
        this.mappedLocationsTitle =
          translatedMessages['pw.coWeightTolerance.mappedLocationsTitle'];
        this.searchLocationPlaceholder =
          translatedMessages['pw.coWeightTolerance.searchLocationPlaceholder'];
        this.configurationSaveMessage =
          translatedMessages['pw.coWeightTolerance.configurationSaveMessage'];
        this.configurationUpdateMessage =
          translatedMessages['pw.coWeightTolerance.configurationUpdateMessage'];
        this.configurationRemoveMessage =
          translatedMessages['pw.coWeightTolerance.configurationRemoveMessage'];
        this.orderTypesArray = [
          {
            value: 'frozen',
            description: translatedMessages['pw.coWeightTolerance.frozenOrder']
          },
          {
            value: 'non-frozen',
            description:
              translatedMessages['pw.coWeightTolerance.nonFrozenOrder']
          }
        ];
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
        this.listingPageEvent.pageSize = data;
      });

    this.createForm();

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        this.orderType = param['orderType'];
        if (this.configId !== 'new') {
          this.locationMappingFacade.loadMappedLocations({
            ruleType:
              this.orderType === 'frozen'
                ? ConfigTypeEnum.ORDER_CO_FROZEN_TOLERANCE
                : ConfigTypeEnum.ORDER_CO_NON_FROZEN_TOLERANCE,
            ruleID: this.configId
          });
        }
      });

    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations.length > 0) {
          this.mappedLocations = mappedLocations;
          this.isMappedLocation = true;
        }
      });

    this.orderTypeFormControl.patchValue(this.orderType);
    this.coToleranceConfigFacade.loadCoTolerancelWeightRanges();
    this.coToleranceConfigFacade.loadMetalTypes();
    this.weightRange$ = this.coToleranceConfigFacade.getWeightRanges();
    this.metalTypes$ = this.coToleranceConfigFacade.getMetalTypes();
    this.toleranceConfig$ = this.coToleranceConfigFacade.getToleranceConfig();
    this.isLoading$ = this.coToleranceConfigFacade.getIsloading();

    this.noLocationError = ErrorEnums.ERR_CONFIG_002;

    this.coToleranceConfigFacade
      .getCoToleranceConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.selectedConfigDetails = data;
          this.formData.patchValue({
            configName: this.selectedConfigDetails?.description,
            isActive: this.selectedConfigDetails?.isActive,
            isApplicableForFrozenOrder: this.selectedConfigDetails?.ruleDetails
              ?.data?.isApplicableForFrozenOrder,
            isApplicableForNonFrozenOrder: this.selectedConfigDetails
              ?.ruleDetails?.data?.isApplicableForNonFrozenOrder
          });
        }
      });

    this.coToleranceConfigFacade
      .getConfigId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configId => {
        if (configId !== null && configId !== 'new') {
          this.configId = configId;
          this.newlyCreated = true;
        }
      });
    if (this.configId !== 'new') {
      this.formData.get('configName').disable({ onlySelf: true });
      this.coToleranceConfigFacade.loadSelectedConfigDetails({
        configId: this.configId,
        ruleType: this.getRuleType()
      });
    }
    this.loadRuleDetails();

    this.coToleranceConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          if (this.newlyCreated) {
            this.loadRuleDetails();
            this.showSaveSuccessMessageNotification(
              this.configurationSaveMessage
            );
            this.formData.get('configName').disable({ onlySelf: true });
          } else {
            this.coToleranceConfigFacade.loadSelectedConfigDetails({
              configId: this.configId,
              ruleType: this.getRuleType()
            });
            this.loadRuleDetails();

            this.showSuccessMessageNotification(
              this.configurationUpdateMessage
            );
          }
        } else this.overlayNotification.close();
      });

    this.coToleranceConfigFacade
      .getIsCleared()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.coToleranceConfigFacade.loadSelectedConfigDetails({
            configId: this.configId,
            ruleType: this.getRuleType()
          });
          this.loadRuleDetails();

          this.showSuccessMessageNotification(this.configurationRemoveMessage);
        } else this.overlayNotification.close();
      });

    this.coToleranceConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  createForm() {
    this.formData = new FormGroup({
      configName: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.configName),
        this.fieldValidatorsService.descriptionField(this.configName)
      ]),
      isActive: new FormControl(true),
      isApplicableForFrozenOrder: new FormControl(false),
      isApplicableForNonFrozenOrder: new FormControl(false)
    });
  }

  back() {
    this.coToleranceConfigFacade.loadReset();
    this.router.navigate([
      getCustomerOrderToleranceConfigListRouteUrl(
        this.orderTypeFormControl.value
      )
    ]);
  }

  openViewLocationMapping() {
    this.selectionDialog
      .open({
        title: this.mappedLocationsTitle,
        placeholder: this.searchLocationPlaceholder,
        options: this.mappedLocations,
        isPopupClosed: false
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
        }
      });
  }

  openLocationMapping(gridLength: number) {
    this.configId = this.activatedRoute.snapshot.params['_configId'];
    this.totalElements$.pipe(take(1)).subscribe(count => {
      if (count > 0 || gridLength > 0) {
        this.locationMappingService.open({
          isConfig: true,
          configDetails: {
            configId: this.configId,
            configType:
              this.orderType === 'frozen'
                ? ConfigTypeEnum.ORDER_CO_FROZEN_TOLERANCE
                : ConfigTypeEnum.ORDER_CO_NON_FROZEN_TOLERANCE
          }
        });
      } else {
        this.errorNotifications('Please add atleast one metal item');
      }
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
            const saveTolerancePayload: SaveCoTolerancePayload = {
              configDetail: {
                description: this.formData.get('configName').value.trim(),
                isActive: this.formData.get('isActive').value
                  ? this.formData.get('isActive').value
                  : true,

                ruleDetails: {
                  type: this.getRuleType(),
                  data: {
                    isApplicableForNonFrozenOrder: this.formData.get(
                      'isApplicableForNonFrozenOrder'
                    ).value
                      ? this.formData.get('isApplicableForNonFrozenOrder').value
                      : false,
                    isApplicableForFrozenOrder: this.formData.get(
                      'isApplicableForFrozenOrder'
                    ).value
                      ? this.formData.get('isApplicableForFrozenOrder').value
                      : false
                  }
                }
              },
              ruleType: this.getRuleType(),
              residualTolerance: payload
            };
            this.coToleranceConfigFacade.saveToleranceConfig(
              saveTolerancePayload
            );
          } else {
            this.coToleranceConfigFacade.updateCoTolerance({
              id: this.configId,
              data: payload,
              ruleType: this.getRuleType()
            });
          }
        }
      });
  }

  errorNotifications(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  showSuccessMessageNotification(key: any) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        message: key,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.back();
        }
      });
  }

  showSaveSuccessMessageNotification(key: any) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        message: key,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.router.navigate([
            getCustomerOrderToleranceConfigDetailsRouteUrl(
              this.orderType,
              this.configId
            )
          ]);
          if (this.mappedLocations.length === 0) {
            this.showLocMappingAlertMessage();
          }
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
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          if (this.newlyCreated) {
            this.loadRuleDetails();
            this.showSaveSuccessMessageNotification(
              this.configurationSaveMessage
            );
          } else this.loadRuleDetails();
        }
      });
  }

  remove(ordrerPaymentConfigReq: CoToleranceRangeConfigRequest) {
    const updateWeightTolerancePayload: COToleranceUpdateRangeMappingPayload = {
      id: this.configId,
      data: ordrerPaymentConfigReq,
      ruleType: this.getRuleType()
    };
    this.coToleranceConfigFacade.removeConfiguration(
      updateWeightTolerancePayload
    );
  }

  updateConfig() {
    const updateConfigPayload: CoToleranceConfigResponse = {
      ruleId: Number(this.configId),
      isActive: this.formData.get('isActive').value
        ? this.formData.get('isActive').value
        : true,
      ruleType: this.getRuleType(),
      
      ruleDetails: {
        type: this.getRuleType(),
        data: {
          isApplicableForNonFrozenOrder: this.formData.get(
            'isApplicableForNonFrozenOrder'
          ).value
            ? this.formData.get('isApplicableForNonFrozenOrder').value
            : false,
          isApplicableForFrozenOrder: this.formData.get(
            'isApplicableForFrozenOrder'
          ).value
            ? this.formData.get('isApplicableForFrozenOrder').value
            : false
        }
      }
    };
    if (this.configId !== 'new') {
      this.coToleranceConfigFacade.updateConfigIsActive(updateConfigPayload);
    }
  }

  loadCheckConfigName() {
    this.formData
      .get('configName')
      .setValidators([
        this.fieldValidatorsService.requiredField(this.configName),
        this.fieldValidatorsService.descriptionField(this.configName)
      ]);
    this.formData.controls['configName'].updateValueAndValidity();
    if (
      this.formData.get('configName').value !== '' &&
      this.formData.get('configName').valid
    ) {
      if (
        fieldValidation.descriptionField.pattern.test(
          this.formData.get('configName').value
        )
      ) {
        this.coToleranceConfigFacade.uniqueConfigNameCheck(
          this.formData.get('configName').value.trim()
        );
        this.coToleranceConfigFacade
          .getUniqueNameCheckCount()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            if (data) {
              this.formData
                .get('configName')
                .setValidators([
                  this.fieldValidatorsService.isUniqueCheck(
                    this.configName,
                    false
                  )
                ]);

              this.formData.controls['configName'].updateValueAndValidity();
            } else {
              this.formData.get('configName').clearValidators();
              this.formData
                .get('configName')
                .setValidators([
                  this.fieldValidatorsService.requiredField(this.configName),
                  this.fieldValidatorsService.isUniqueCheck(
                    this.configName,
                    true
                  ),
                  this.fieldValidatorsService.descriptionField(this.configName)
                ]);

              this.formData.controls['configName'].updateValueAndValidity();
            }
          });
      }
    } else {
      this.formData
        .get('configName')
        .setValidators([
          this.fieldValidatorsService.requiredField(this.configName),
          this.fieldValidatorsService.isUniqueCheck(this.configName, true),
          this.fieldValidatorsService.descriptionField(this.configName)
        ]);
      this.formData.controls['configName'].updateValueAndValidity();
    }
  }

  onOrderTypeChanged(event) {
    if (this.orderType !== this.orderTypeFormControl.value) {
      this.orderType = event.value;
      this.loadCheckConfigName();
      this.router.navigate([
        getCustomerOrderToleranceConfigDetailsRouteUrl(
          this.orderType,
          this.configId
        )
      ]);
    }
  }

  getRuleType(): string {
    if (this.orderType === 'frozen') {
      return ConfigTypeEnum.ORDER_CO_FROZEN_TOLERANCE;
    }
    return ConfigTypeEnum.ORDER_CO_NON_FROZEN_TOLERANCE;
  }

  sort(sortEvent: string[]) {
    this.listingPageEvent.pageIndex = 0;
    this.sortData = [...sortEvent];
    this.loadRuleDetails();
  }

  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadRuleDetails();
  }

  loadRuleDetails() {
    this.coToleranceConfigFacade.loadCoMappingByConfigId({
      configId: this.configId,
      ruleType: this.getRuleType(),
      pageIndex: this.listingPageEvent.pageIndex,
      pageSize: this.listingPageEvent.pageSize,
      sort: this.sortData
    });
  }

  showLocMappingAlertMessage() {
    this.dialog.closeAll();
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.coWeightTolerance.locationsMandatoryMessage'
      })
      .pipe(take(1))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
