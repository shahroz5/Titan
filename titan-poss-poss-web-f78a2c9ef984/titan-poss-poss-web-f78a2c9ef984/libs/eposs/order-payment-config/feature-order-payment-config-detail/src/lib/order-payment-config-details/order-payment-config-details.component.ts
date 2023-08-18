import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { OrderPaymentFacade } from '@poss-web/eposs/order-payment-config/data-access-order-payment-config';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  ProductGroup,
  OrderPaymentConfigPayload,
  ConfigTypeEnum,
  OverlayNotificationType,
  CustomErrors,
  OrderPaymentsRequest,
  SaveOrderPaymentsPayload,
  UpdateOrderPaymentConfigPayload,
  OrderPaymentResponse,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil } from 'rxjs/Operators';
import { FormGroup, FormControl } from '@angular/forms';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  getOrderPaymentConfigDetailRouteUrl,
  getOrderPaymentConfigListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
@Component({
  selector: 'poss-web-order-payment-config-details',
  templateUrl: './order-payment-config-details.component.html'
})
export class OrderPaymentConfigDetailsComponent implements OnInit, OnDestroy {
  configName: string;
  formData: FormGroup;
  configId: string;
  noLocationError: string;
  isLoading$: Observable<boolean>;
  productGroups$: Observable<ProductGroup[]>;
  destroy$: Subject<null> = new Subject<null>();
  isCleared$: Observable<any>;
  orderPaymentConfigeDetails$: Observable<any>;
  selectedConfigDetails: OrderPaymentConfigPayload;

  configurationSaveMessage: string;
  configurationUpdateMessage: string;
  configurationRemoveMessage: string;

  orderPaymentConfigDetails: OrderPaymentResponse[] = [];
  allOrderPaymentConfigRuleDetails: OrderPaymentResponse[] = [];

  showViewOnly: boolean;
  productGroupsMap: Map<string, string> = new Map();
  mappedLocations = [];
  isMappedLocation = false;
  mappedLocationsTitle: string;
  searchLocationPlaceholder: string;

  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number[];

  totalElements$: Observable<number>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  sortData: string[] = [];

  constructor(
    public orderPaymentFacade: OrderPaymentFacade,
    private fieldValidatorsService: FieldValidatorsService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private alertPopupService: AlertPopupServiceAbstraction,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translate: TranslateService,
    private locationMappingFacade: LocationMappingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private appSettingFacade: AppsettingFacade
  ) {}

  ngOnInit() {
    this.sortData = [];
    this.locationMappingFacade.resetMappedLocations();
    this.isMappedLocation = false;
    this.orderPaymentFacade.loadReset();
    this.createForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });
    this.translate
      .get([
        'pw.abOrderPaymentConfig.configName',
        'pw.abOrderPaymentConfig.mappedLocationsTitle',
        'pw.abOrderPaymentConfig.searchLocationPlaceholder',
        'pw.abOrderPaymentConfig.configurationSaveMessage',
        'pw.abOrderPaymentConfig.configurationUpdateMessage',
        'pw.abOrderPaymentConfig.configurationRemoveMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.configName =
          translatedMessages['pw.abOrderPaymentConfig.configName'];
        this.mappedLocationsTitle =
          translatedMessages['pw.abOrderPaymentConfig.mappedLocationsTitle'];
        this.searchLocationPlaceholder =
          translatedMessages[
            'pw.abOrderPaymentConfig.searchLocationPlaceholder'
          ];
        this.configurationSaveMessage =
          translatedMessages[
            'pw.abOrderPaymentConfig.configurationSaveMessage'
          ];
        this.configurationUpdateMessage =
          translatedMessages[
            'pw.abOrderPaymentConfig.configurationUpdateMessage'
          ];
        this.configurationRemoveMessage =
          translatedMessages[
            'pw.abOrderPaymentConfig.configurationRemoveMessage'
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
        this.initialPageEvent.pageSize = data;
      });
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
      });
    if (this.configId !== 'new') {
      this.locationMappingFacade.loadMappedLocations({
        ruleType: ConfigTypeEnum.ORDER_AB_PAYMENT_CONFIG,
        ruleID: this.configId
      });
    }
    this.orderPaymentFacade.loadProductGroups();
    this.isLoading$ = this.orderPaymentFacade.getIsloading();
    this.noLocationError = ErrorEnums.ERR_CONFIG_002;
    this.totalElements$ = this.orderPaymentFacade.getOrderPaymentRulesDetailsCount();
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations.length > 0) {
          this.mappedLocations = mappedLocations;
          this.isMappedLocation = true;
        }
      });

    this.isCleared$ = this.orderPaymentFacade.getIsCleared();
    this.productGroups$ = this.orderPaymentFacade.getProductGroups();

    this.orderPaymentFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: ProductGroup[]) => {
        if (productGroups) {
          this.productGroupsMap = new Map();
          productGroups.forEach((groups: ProductGroup) => {
            this.productGroupsMap.set(
              groups.productGroupCode,
              groups.description
            );
          });
        }
      });

    this.orderPaymentFacade
      .getOrderPaymentCOnfigDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && data.length) {
          this.orderPaymentConfigDetails = [];
          for (const item of data) {
            this.orderPaymentConfigDetails.push({
              id: item.id,
              productGroupCode: item.productGroupCode,
              ruleDetails: item.ruleDetails,
              productCategoryCode: item.productCategoryCode,
              rangeId: item.rangeId,
              bestRatePercent: item.bestRatePercent,
              metalRateFrozenPercent: item.metalRateFrozenPercent,
              metalRateNonFrozenPercent: item.metalRateNonFrozenPercent,
              description: this.productGroupsMap.get(item.productGroupCode)
            });
          }
        } else {
          this.orderPaymentConfigDetails = [];
        }
      });
    this.orderPaymentFacade
      .getAllOrderPaymentRulesDetailst()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.allOrderPaymentConfigRuleDetails = [];
        if (data && data.length) {
          for (const item of data) {
            this.allOrderPaymentConfigRuleDetails.push({
              id: item.id,
              productGroupCode: item.productGroupCode,
              ruleDetails: item.ruleDetails,
              productCategoryCode: item.productCategoryCode,
              rangeId: item.rangeId,
              bestRatePercent: item.bestRatePercent,
              metalRateFrozenPercent: item.metalRateFrozenPercent,
              metalRateNonFrozenPercent: item.metalRateNonFrozenPercent,
              description: this.productGroupsMap.get(item.productGroupCode)
            });
          }
        }
      });

    this.orderPaymentFacade
      .getConfiguration()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedConfigDetails => {
        this.selectedConfigDetails = selectedConfigDetails;
      });
    this.orderPaymentFacade
      .getConfigId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configId => {
        if (configId !== null && configId !== 'new') {
          this.configId = configId;

          this.loadOrderPaymentConfigDetails();
          this.showSaveSuccessMessageNotification(
            this.configurationSaveMessage
          );
          this.formData.get('configName').disable({ onlySelf: true });
        }
      });
    if (this.configId !== 'new') {
      this.formData.get('configName').disable({ onlySelf: true });
      this.orderPaymentFacade.loadSelectedConfigDetails(this.configId);
      this.loadOrderPaymentConfigDetails();
      this.orderPaymentFacade.loadAllOrderPaymentRulesById({
        isPageable: false,
        configId: this.configId
      });
    }
    this.orderPaymentFacade
      .getIsCleared()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCleared => {
        if (isCleared) {
          this.loadOrderPaymentConfigDetails();

          this.showSuccessMessageNotification(this.configurationRemoveMessage);
        } else this.overlayNotification.close();
      });
    this.orderPaymentFacade
      .getIsUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.orderPaymentFacade.loadSelectedConfigDetails(this.configId);
          this.showSuccessMessageNotification(this.configurationUpdateMessage);
        } else this.overlayNotification.close();
      });
    this.orderPaymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  back() {
    this.orderPaymentFacade.loadReset();
    this.router.navigate([getOrderPaymentConfigListRouteUrl()]);
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

  createForm() {
    this.formData = new FormGroup({
      configName: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.configName),
        this.fieldValidatorsService.descriptionField(this.configName)
      ]),
      isActive: new FormControl(true)
    });
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
        fieldValidation.nameWithSpaceField.pattern.test(
          this.formData.get('configName').value
        )
      ) {
        this.orderPaymentFacade.uniqueConfigNameCheck(
          this.formData.get('configName').value.trim()
        );
        this.orderPaymentFacade
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
                  this.fieldValidatorsService.descriptionField(this.configName),
                  this.fieldValidatorsService.isUniqueCheck(
                    this.configName,
                    true
                  )
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
          this.fieldValidatorsService.descriptionField(this.configName),
          this.fieldValidatorsService.isUniqueCheck(this.configName, true)
        ]);
      this.formData.controls['configName'].updateValueAndValidity();
    }
  }

  updateIsActive(event) {
    if (this.configId !== 'new') {
      this.orderPaymentFacade.updateIsActive({
        data: {
          isActive: event
        },
        id: this.configId
      });
    } else {
      this.selectedConfigDetails = {
        isActive: event
      };
      this.formData.get('isActive').setValue(event);
    }
  }

  remove(ordrerPaymentConfigReq: OrderPaymentsRequest) {
    const updateWeightTolerancePayload: UpdateOrderPaymentConfigPayload = {
      id: this.configId,
      data: ordrerPaymentConfigReq
    };
    this.orderPaymentFacade.removeConfiguration(updateWeightTolerancePayload);
  }

  createConfiguration(ordrerPaymentConfigReq: OrderPaymentsRequest) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          if (this.configId === 'new') {
            const saveTolerancePayload: SaveOrderPaymentsPayload = {
              configDetail: {
                description: this.formData.get('configName').value.trim(),
                isActive: true,
                ruleDetails: {}
              },
              orderPaymentConfigRequest: ordrerPaymentConfigReq
            };
            this.orderPaymentFacade.saveConfiguration(saveTolerancePayload);
          } else {
            const updateConfigPayload: UpdateOrderPaymentConfigPayload = {
              id: this.configId,
              data: ordrerPaymentConfigReq
            };
            this.orderPaymentFacade.updateConfig(updateConfigPayload);
          }
        }
      });
  }

  openLocationMapping() {
    this.configId = this.activatedRoute.snapshot.params['_configId'];
    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: this.configId,
        configType: ConfigTypeEnum.ORDER_AB_PAYMENT_CONFIG
      }
    });
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
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.back();
        }
      });
  }

  showSaveSuccessMessageNotification(key: any) {
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
            getOrderPaymentConfigDetailRouteUrl(this.configId)
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
    });
  }

  searchProductGroup(searchValue) {
    this.orderPaymentFacade.loadOrderPaymentConfigById({
      configId: this.configId,
      productGroupCode: searchValue
    });
  }

  clearProductGroupSearch() {
    this.loadOrderPaymentConfigDetails();
  }

  paginate(pageEvent: PageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadOrderPaymentConfigDetails();
  }

  sort(sortEvent: string[]) {
    this.initialPageEvent.pageIndex = 0;
    this.sortData = [...sortEvent];
    this.loadOrderPaymentConfigDetails();
  }

  loadOrderPaymentConfigDetails() {
    if (this.sortData.length === 0) {
      this.sortData = ['productGroupCode' + ',' + 'asc'];
    }
    if (this.configId !== 'new') {
      this.orderPaymentFacade.loadOrderPaymentConfigById({
        pageIndex: this.initialPageEvent.pageIndex,
        pageSize: this.initialPageEvent.pageSize,
        configId: this.configId,
        sort: this.sortData
      });
    }
  }

  showLocMappingAlertMessage() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.abOrderPaymentConfig.locationsMandatoryMessage'
      })
      .pipe(take(1))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
