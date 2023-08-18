import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  BgrConfigDetails,
  OverlayNotificationServiceAbstraction,
  LocationMappingServiceAbstraction,
  OverlayNotificationEventType,
  OverlayNotificationEventRef,
  LocationSelectionServiceResponse,
  BgrErrorCodeEnum,
  OrderTypesEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  WeightValueConfigConstants,
  ConfigTypeEnum
} from '@poss-web/shared/models';

import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { getBgrConfigListRouteUrl } from '@poss-web/shared/util-site-routes';
import { BgrConfigFacade } from '@poss-web/eposs/bgr-config/data-access-bgr-config';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';

import { FormControl, FormGroup } from '@angular/forms';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';

@Component({
  selector: 'poss-web-bgr-config-detail',
  templateUrl: './bgr-config-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgrConfigDetailComponent implements OnInit, OnDestroy {
  constructor(
    public router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationMappingService: LocationMappingServiceAbstraction,
    private bgrConfigFacade: BgrConfigFacade,
    private locationMappingFacade: LocationMappingFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private cd: ChangeDetectorRef,
    private selectionDialog: SelectionDialogService
  ) {}

  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  bgrConfigDetails$: Observable<BgrConfigDetails>;
  routeParam: Observable<Params>;
  generatedRuleId: number;
  formData: FormGroup;
  showViewOnly: boolean;
  configDetails: BgrConfigDetails;
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
  ruleType = ConfigTypeEnum.BGR_CONFIG;
  isActive = false;
  configId;
  mappedLocations = [];
  ngOnInit() {
    this.locationMappingFacade.resetMappedLocations();
    this.activatedRoute.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });
    this.formData = new FormGroup({
      configName: new FormControl('', [
        this.fieldValidatorsService.requiredField('Config Name'),
        this.fieldValidatorsService.descriptionField('Config Name')
      ]),
      isActive: new FormControl(true),
      orderType: new FormControl(OrderTypesEnum.ADVANCE_BOOKING)
    });
    this.routeParam = this.activatedRoute.params;
    const param = this.activatedRoute.snapshot.params['_configId'];
    const ruleType = this.activatedRoute.snapshot.params['_ruleType'];
    this.formData.get('orderType').setValue(ruleType);
    console.log(ruleType, 'ruleType');
    const payload = {
      ruleId: param,
      ruleType:
        ruleType === OrderTypesEnum.ADVANCE_BOOKING
          ? ConfigTypeEnum.BGR_CONFIG
          : ConfigTypeEnum.CO_BGR_CONFIG
    };
    this.bgrConfigFacade.loadBgrConfigDetails(payload);
    this.hasError$ = this.bgrConfigFacade.getError();
    this.isLoading$ = this.bgrConfigFacade.getIsLoading();
    this.bgrConfigDetails$ = this.bgrConfigFacade.getBgrConfigDetails();
    this.bgrConfigDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((configDetails: BgrConfigDetails) => {
        if (configDetails) {
          this.configDetails = configDetails;
          this.formData.get('configName').setValue(configDetails.description);
          if (configDetails.ruleType === ConfigTypeEnum.BGR_CONFIG) {
            this.formData
              .get('orderType')
              .setValue(OrderTypesEnum.ADVANCE_BOOKING);
          } else {
            this.formData
              .get('orderType')
              .setValue(OrderTypesEnum.CUSTOMER_ORDER);
          }
          if (
            this.activatedRoute.snapshot.params['_configId'] !==
            WeightValueConfigConstants.NEW
          ) {
            this.formData.get('configName').disable();
            this.formData.get('orderType').disable();
          }
          this.formData.updateValueAndValidity();
          this.isActive = configDetails.isActive;
        }
      });
    this.routeParam.subscribe((param: any) => {
      this.configId = param['_configId'];
      if (param['_configId'] === WeightValueConfigConstants.NEW) {
        this.isActive = true;
        this.formData.get('configName').enable();
      } else if (this.configId !== WeightValueConfigConstants.NEW) {
        this.locationMappingFacade.loadMappedLocations({
          ruleType:
            this.formData.get('orderType').value ===
            OrderTypesEnum.ADVANCE_BOOKING
              ? ConfigTypeEnum.BGR_CONFIG
              : ConfigTypeEnum.CO_BGR_CONFIG,
          ruleID: this.configId
        });
      } else {
        this.formData.get('configName').disable();
        this.formData.get('orderType').disable();
      }
      this.formData.updateValueAndValidity();
      this.cd.markForCheck();
    });
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
          console.log('mappedLocations', mappedLocations);
        }
      });
    this.bgrConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.bgrConfigFacade
      .getBgrConfigDetailsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.generatedRuleId = data.ruleId;
        }
      });
    this.locationMappingFacade
      .getUpdateStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updateStatus: { isSuccess: boolean }) => {
        if (updateStatus && updateStatus.isSuccess) {
          this.showNotification('pw.bgrConfigurations.successMsg');
        }
      });
    this.locationMappingFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          if (
            error &&
            error.code &&
            error.code ===
              BgrErrorCodeEnum.LOCATION_MAPPING_DUPLICATE_ERROR_CODE
          ) {
            this.openLocationMappingFailureAlertDialog();
          } else {
            this.errorHandler(error);
          }
        }
      });
    this.bgrConfigFacade
      .getBgrConfigDetailsEdited()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showNotification('pw.bgrConfigurations.successMsg');
        }
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  openLocationMappingFailureAlertDialog() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.bgrConfigurations.locationMappingFailureAlertMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.router.navigate([getBgrConfigListRouteUrl()]);
          this.generatedRuleId = null;
          this.locationMappingFacade.clear();
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
  showNotification(key: string) {
    this.overlayNotification.close();
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              if (this.generatedRuleId) {
                this.generatedRuleId = null;
              }
              this.locationMappingFacade.clear();
              this.router.navigate([getBgrConfigListRouteUrl()]);
            }
          });
      });
  }

  formOutput(formData: BgrConfigDetails) {
    if (
      this.activatedRoute.snapshot.params['_configId'] ===
      WeightValueConfigConstants.NEW
    ) {
      this.locationMappingService
        .openLocationSelectionPopUp()
        .pipe(takeUntil(this.destroy$))
        .subscribe((event: LocationSelectionServiceResponse) => {
          if (event) {
            const locationMappingDetails = {
              addLocations:
                event.data && event.data.selectedLocations
                  ? event.data.selectedLocations
                  : [],
              overwriteLocations: [],
              removeLocations: []
            };
            if (formData) {
              formData.ruleDetails.type =
                this.formData.get('orderType').value ===
                OrderTypesEnum.ADVANCE_BOOKING
                  ? ConfigTypeEnum.BGR_CONFIG
                  : ConfigTypeEnum.CO_BGR_CONFIG;
              formData.ruleType =
                this.formData.get('orderType').value ===
                OrderTypesEnum.ADVANCE_BOOKING
                  ? ConfigTypeEnum.BGR_CONFIG
                  : ConfigTypeEnum.CO_BGR_CONFIG;
              formData.description = this.formData.get('configName').value;
              formData.isActive = this.formData.get('isActive').value;
            }
            console.log('FORM DATA :', formData);
            this.bgrConfigFacade.saveBgrConfigDetails(
              formData,
              locationMappingDetails
            );
          }
        });
    } else {
      if (formData) {
        formData.ruleDetails.type =
          this.formData.get('orderType').value ===
          OrderTypesEnum.ADVANCE_BOOKING
            ? ConfigTypeEnum.BGR_CONFIG
            : ConfigTypeEnum.CO_BGR_CONFIG;
        formData.ruleType =
          this.formData.get('orderType').value ===
          OrderTypesEnum.ADVANCE_BOOKING
            ? ConfigTypeEnum.BGR_CONFIG
            : ConfigTypeEnum.CO_BGR_CONFIG;
        formData.description = this.formData.get('configName').value;
        formData.isActive = this.formData.get('isActive').value;
      }
      console.log('FORM DATA :', formData);
      this.bgrConfigFacade.editBgrConfigDetails(formData);
    }
  }

  openLocationMapping($event) {
    const ruleId = this.activatedRoute.snapshot.params['_configId'];
    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: ruleId,
        configType:
          this.formData.get('orderType').value ===
          OrderTypesEnum.ADVANCE_BOOKING
            ? ConfigTypeEnum.BGR_CONFIG
            : ConfigTypeEnum.CO_BGR_CONFIG
      }
    });
    console.log({
      configId: ruleId,
      configType:
        this.formData.get('orderType').value === OrderTypesEnum.ADVANCE_BOOKING
          ? ConfigTypeEnum.BGR_CONFIG
          : ConfigTypeEnum.CO_BGR_CONFIG
    });
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
        this.bgrConfigFacade.searchBgrConfigListing(
          this.formData.get('configName').value
        );
        this.bgrConfigFacade
          .getBgrConfigListing()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            if (data && data.length !== 0) {
              this.formData
                .get('configName')
                .setValidators([
                  this.fieldValidatorsService.isUniqueCheck(
                    'Config Name',
                    false
                  ),
                  this.fieldValidatorsService.requiredField('Config Name'),
                  this.fieldValidatorsService.descriptionField('Config Name')
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

  onOrderTypeChanged(event: any) {
    console.log('EVENT 123 :', event);
    if (event.value === OrderTypesEnum.ADVANCE_BOOKING) {
      this.ruleType = ConfigTypeEnum.BGR_CONFIG;
    } else {
      this.ruleType = ConfigTypeEnum.CO_BGR_CONFIG;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeEvent(event: any) {
    this.isActive = !this.isActive;
    this.formData.get('isActive').setValue(this.isActive);
    this.formData.updateValueAndValidity();
  }

  backArrow() {
    this.locationMappingFacade.clear();
    this.router.navigate([getBgrConfigListRouteUrl()]);
  }
}
