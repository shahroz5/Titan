import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbToleranceConfigFacade } from '@poss-web/eposs/ab-tolerance-config/data-access-ab-tolerance-config';
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
  SelectDropDownOption,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import {
  getAdavanceBookingToleranceConfigListRouteUrl,
  getAdavanceBookingToleranceConfigDetailsRouteUrl
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
  selector: 'poss-web-ab-tolerance-config-details',
  templateUrl: './ab-tolerance-config-details.component.html'
})
export class AbToleranceConfigDetailsComponent implements OnInit, OnDestroy {
  formData: FormGroup;
  isLoading$: Observable<boolean>;
  configId: string;
  noLocationError: string;
  newlyCreated = false;

  weightRange$: Observable<AbToleranceWeightRange[]>;
  metalTypes$: Observable<AbToleranceConfigMetalType[]>;
  toleranceConfig$: Observable<AbToleranceRangeMappingResponse>;
  selectedConfigDetails: AbToleranceConfigResponse;

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
    private abToleranceConfigFacade: AbToleranceConfigFacade,
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
    this.abToleranceConfigFacade.loadReset();
    this.totalElements$ = this.abToleranceConfigFacade.getRuleDetailsTotalCount();
    this.activatedRoute.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });

    this.translate
      .get([
        'pw.abWeightTolerance.configName',
        'pw.abWeightTolerance.frozenOrder',
        'pw.abWeightTolerance.nonFrozenOrder',
        'pw.abWeightTolerance.mappedLocationsTitle',
        'pw.abWeightTolerance.searchLocationPlaceholder',
        'pw.abWeightTolerance.configurationSaveMessage',
        'pw.abWeightTolerance.configurationUpdateMessage',
        'pw.abWeightTolerance.configurationRemoveMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.configName = translatedMessages['pw.abWeightTolerance.configName'];
        this.mappedLocationsTitle =
          translatedMessages['pw.abWeightTolerance.mappedLocationsTitle'];
        this.searchLocationPlaceholder =
          translatedMessages['pw.abWeightTolerance.searchLocationPlaceholder'];
        this.configurationSaveMessage =
          translatedMessages['pw.abWeightTolerance.configurationSaveMessage'];
        this.configurationUpdateMessage =
          translatedMessages['pw.abWeightTolerance.configurationUpdateMessage'];
        this.configurationRemoveMessage =
          translatedMessages['pw.abWeightTolerance.configurationRemoveMessage'];
        this.orderTypesArray = [
          {
            value: 'frozen',
            description: translatedMessages['pw.abWeightTolerance.frozenOrder']
          },
          {
            value: 'non-frozen',
            description:
              translatedMessages['pw.abWeightTolerance.nonFrozenOrder']
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
                ? ConfigTypeEnum.ORDER_AB_FROZEN_TOLERANCE
                : ConfigTypeEnum.ORDER_AB_NON_FROZEN_TOLERANCE,
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
    this.abToleranceConfigFacade.loadAbTolerancelWeightRanges();
    this.abToleranceConfigFacade.loadMetalTypes();
    this.weightRange$ = this.abToleranceConfigFacade.getWeightRanges();
    this.metalTypes$ = this.abToleranceConfigFacade.getMetalTypes();
    this.toleranceConfig$ = this.abToleranceConfigFacade.getToleranceConfig();
    this.isLoading$ = this.abToleranceConfigFacade.getIsloading();

    this.noLocationError = ErrorEnums.ERR_CONFIG_002;

    this.abToleranceConfigFacade
      .getAbToleranceConfig()
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

    this.abToleranceConfigFacade
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
      this.abToleranceConfigFacade.loadSelectedConfigDetails({
        configId: this.configId,
        ruleType: this.getRuleType()
      });
    }
    this.loadRuleDetails();

    this.abToleranceConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          if(this.newlyCreated){
            this.loadRuleDetails();
            this.showSaveSuccessMessageNotification(
              this.configurationSaveMessage
            );
            this.formData.get('configName').disable({ onlySelf: true });
          }else{
            this.abToleranceConfigFacade.loadSelectedConfigDetails({
              configId: this.configId,
              ruleType: this.getRuleType()
            });
            this.loadRuleDetails();
  
            this.showSuccessMessageNotification(this.configurationUpdateMessage);
          }
        }  else this.overlayNotification.close();
      });

    this.abToleranceConfigFacade
      .getIsCleared()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.abToleranceConfigFacade.loadSelectedConfigDetails({
            configId: this.configId,
            ruleType: this.getRuleType()
          });
          this.loadRuleDetails();

          this.showSuccessMessageNotification(this.configurationRemoveMessage);
        } else this.overlayNotification.close();
      });

    this.abToleranceConfigFacade
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
    this.abToleranceConfigFacade.loadReset();
    this.router.navigate([
      getAdavanceBookingToleranceConfigListRouteUrl(
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
    this.totalElements$
    .pipe(take(1))
    .subscribe((count)=> {
      if(count > 0 || gridLength > 0){
        this.locationMappingService.open({
          isConfig: true,
          configDetails: {
            configId: this.configId,
            configType:
              this.orderType === 'frozen'
                ? ConfigTypeEnum.ORDER_AB_FROZEN_TOLERANCE
                : ConfigTypeEnum.ORDER_AB_NON_FROZEN_TOLERANCE
          }
        });
      } else{
        this.errorNotifications('Please add atleast one metal item');
      }
    })
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
            const saveTolerancePayload: SaveAbTolerancePayload = {
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
            this.abToleranceConfigFacade.saveToleranceConfig(
              saveTolerancePayload
            );
          } else {
            this.abToleranceConfigFacade.updateAbTolerance({
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
            getAdavanceBookingToleranceConfigDetailsRouteUrl(
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
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    })
    .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          if(this.newlyCreated){
            this.loadRuleDetails();
            this.showSaveSuccessMessageNotification(
              this.configurationSaveMessage
            );
          }else this.loadRuleDetails();
        }
      });
  }

  remove(ordrerPaymentConfigReq: AbToleranceRangeConfigRequest) {
    const updateWeightTolerancePayload: ABToleranceUpdateRangeMappingPayload = {
      id: this.configId,
      data: ordrerPaymentConfigReq,
      ruleType: this.getRuleType()
    };
    this.abToleranceConfigFacade.removeConfiguration(
      updateWeightTolerancePayload
    );
  }

  updateConfig() {
    const updateConfigPayload: AbToleranceConfigResponse = {
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
      this.abToleranceConfigFacade.updateConfigIsActive(updateConfigPayload);
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
        this.abToleranceConfigFacade.uniqueConfigNameCheck(
          this.formData.get('configName').value.trim()
        );
        this.abToleranceConfigFacade
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
        getAdavanceBookingToleranceConfigDetailsRouteUrl(
          this.orderType,
          this.configId
        )
      ]);
    }
  }

  getRuleType(): string {
    if (this.orderType === 'frozen') {
      return ConfigTypeEnum.ORDER_AB_FROZEN_TOLERANCE;
    }
    return ConfigTypeEnum.ORDER_AB_NON_FROZEN_TOLERANCE;
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
    this.abToleranceConfigFacade.loadAbMappingByConfigId({
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
        message: 'pw.abWeightTolerance.locationsMandatoryMessage'
      })
      .pipe(take(1))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
