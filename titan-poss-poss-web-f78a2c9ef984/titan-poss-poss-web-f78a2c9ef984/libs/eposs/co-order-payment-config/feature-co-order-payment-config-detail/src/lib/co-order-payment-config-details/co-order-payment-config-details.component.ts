import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CoOrderPaymentFacade } from '@poss-web/eposs/co-order-payment-config/data-access-co-order-payment-config';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  ProductGroup,
  CoOrderPaymentConfigPayload,
  ConfigTypeEnum,
  OverlayNotificationType,
  CustomErrors,
  CoOrderPaymentsRequest,
  SaveCoOrderPaymentsPayload,
  UpdateCoOrderPaymentConfigPayload,
  CoOrderPaymentResponse,
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
  getCustomerOrderPaymentConfigDetailRouteUrl,
  getCustomerOrderPaymentConfigListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { PageEvent } from '@angular/material/paginator';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
@Component({
  selector: 'poss-web-co-order-payment-config-details',
  templateUrl: './co-order-payment-config-details.component.html'
})
export class CoOrderPaymentConfigDetailsComponent implements OnInit, OnDestroy {
  configName: string;
  formData: FormGroup;
  configId: string;
  noLocationError: string;
  isLoading$: Observable<boolean>;
  productGroups$: Observable<ProductGroup[]>;
  destroy$: Subject<null> = new Subject<null>();
  isCleared$: Observable<any>;
  coOrderPaymentConfigeDetails$: Observable<any>;
  selectedConfigDetails: CoOrderPaymentConfigPayload;

  configurationSaveMessage: string;
  configurationUpdateMessage: string;
  configurationRemoveMessage: string;

  coOrderPaymentConfigDetails: CoOrderPaymentResponse[] = [];
  allCoOrderPaymentConfigRuleDetails: CoOrderPaymentResponse[] = [];

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
    public coOrderPaymentFacade: CoOrderPaymentFacade,
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
    this.coOrderPaymentFacade.loadReset();
    this.createForm();
    this.activatedRoute.queryParams.subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });
    this.translate
      .get([
        'pw.coOrderPaymentConfig.configName',
        'pw.coOrderPaymentConfig.mappedLocationsTitle',
        'pw.coOrderPaymentConfig.searchLocationPlaceholder',
        'pw.coOrderPaymentConfig.configurationSaveMessage',
        'pw.coOrderPaymentConfig.configurationUpdateMessage',
        'pw.coOrderPaymentConfig.configurationRemoveMessage'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.configName =
          translatedMessages['pw.coOrderPaymentConfig.configName'];
        this.mappedLocationsTitle =
          translatedMessages['pw.coOrderPaymentConfig.mappedLocationsTitle'];
        this.searchLocationPlaceholder =
          translatedMessages[
            'pw.coOrderPaymentConfig.searchLocationPlaceholder'
          ];
        this.configurationSaveMessage =
          translatedMessages[
            'pw.coOrderPaymentConfig.configurationSaveMessage'
          ];
        this.configurationUpdateMessage =
          translatedMessages[
            'pw.coOrderPaymentConfig.configurationUpdateMessage'
          ];
        this.configurationRemoveMessage =
          translatedMessages[
            'pw.coOrderPaymentConfig.configurationRemoveMessage'
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
        ruleType: ConfigTypeEnum.ORDER_CO_PAYMENT_CONFIG,
        ruleID: this.configId
      });
    }
    this.coOrderPaymentFacade.loadProductGroups();
    this.isLoading$ = this.coOrderPaymentFacade.getIsloading();
    this.noLocationError = ErrorEnums.ERR_CONFIG_002;
    this.totalElements$ = this.coOrderPaymentFacade.getCoOrderPaymentRulesDetailsCount();
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations.length > 0) {
          this.mappedLocations = mappedLocations;
          this.isMappedLocation = true;
        }
      });

    this.isCleared$ = this.coOrderPaymentFacade.getIsCleared();
    this.productGroups$ = this.coOrderPaymentFacade.getProductGroups();

    this.coOrderPaymentFacade
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

    this.coOrderPaymentFacade
      .getCoOrderPaymentCOnfigDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && data.length) {
          this.coOrderPaymentConfigDetails = [];
          for (const item of data) {
            this.coOrderPaymentConfigDetails.push({
              id: item.id,
              productGroupCode: item.productGroupCode,
              ruleDetails: item.ruleDetails,
              productCategoryCode: item.productCategoryCode,
              rangeId: item.rangeId,
              ibtMetalRateFrozenPercentforGold:
                item.ibtMetalRateFrozenPercentforGold,
              ibtMetalRateFrozenPercentforPlatinum:
                item.ibtMetalRateFrozenPercentforPlatinum,
              ibtMetalRateNonFrozenPercentforGold:
                item.ibtMetalRateNonFrozenPercentforGold,
              ibtMetalRateNonFrozenPercentforPlatinum:
                item.ibtMetalRateNonFrozenPercentforPlatinum,
              ibtBestRatePercentforGold: item.ibtBestRatePercentforGold,
              ibtBestRatePercentforPlatinum: item.ibtBestRatePercentforPlatinum,
              mtrMetalRateFrozenPercentforGold:
                item.mtrMetalRateFrozenPercentforGold,
              mtrMetalRateFrozenPercentforPlatinum:
                item.mtrMetalRateFrozenPercentforPlatinum,
              mtrMetalRateNonFrozenPercentforGold:
                item.mtrMetalRateNonFrozenPercentforGold,
              mtrMetalRateNonFrozenPercentforPlatinum:
                item.mtrMetalRateNonFrozenPercentforPlatinum,
              mtrBestRatePercentforGold: item.mtrBestRatePercentforGold,
              mtrBestRatePercentforPlatinum: item.mtrBestRatePercentforPlatinum,
              prodMetalRateFrozenPercentforGold:
                item.prodMetalRateFrozenPercentforGold,
              prodMetalRateFrozenPercentforPlatinum:
                item.prodMetalRateFrozenPercentforPlatinum,
              prodMetalRateNonFrozenPercentforGold:
                item.prodMetalRateNonFrozenPercentforGold,
              prodMetalRateNonFrozenPercentforPlatinum:
                item.prodMetalRateNonFrozenPercentforPlatinum,
              prodBestRatePercentforGold: item.prodBestRatePercentforGold,
              prodBestRatePercentforPlatinum:
                item.prodBestRatePercentforPlatinum,
              comMetalRateFrozenPercentforGold:
                item.comMetalRateFrozenPercentforGold,
              comMetalRateFrozenPercentforPlatinum:
                item.comMetalRateFrozenPercentforPlatinum,
              comMetalRateNonFrozenPercentforGold:
                item.comMetalRateNonFrozenPercentforGold,
              comMetalRateNonFrozenPercentforPlatinum:
                item.comMetalRateNonFrozenPercentforPlatinum,
              comBestRatePercentforGold: item.comBestRatePercentforGold,
              comBestRatePercentforPlatinum: item.comBestRatePercentforPlatinum,
              autoApprovalFrozenPercentforGold:
                item.autoApprovalFrozenPercentforGold,
              autoApprovalFrozenPercentforPlatinum:
                item.autoApprovalFrozenPercentforPlatinum,
              autoApprovalNonFrozenPercentforGold:
                item.autoApprovalNonFrozenPercentforGold,
              autoApprovalNonFrozenPercentforPlatinum:
                item.autoApprovalNonFrozenPercentforPlatinum,
              autoApprovalBestRatePercentforGold:
                item.autoApprovalBestRatePercentforGold,
              autoApprovalBestRatePercentforPlatinum:
                item.autoApprovalBestRatePercentforPlatinum,
              description: this.productGroupsMap.get(item.productGroupCode)
            });
          }
        } else {
          this.coOrderPaymentConfigDetails = [];
        }
      });
    this.coOrderPaymentFacade
      .getAllCoOrderPaymentRulesDetailst()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.allCoOrderPaymentConfigRuleDetails = [];
        if (data && data.length) {
          for (const item of data) {
            this.allCoOrderPaymentConfigRuleDetails.push({
              id: item.id,
              productGroupCode: item.productGroupCode,
              ruleDetails: item.ruleDetails,
              productCategoryCode: item.productCategoryCode,
              rangeId: item.rangeId,
              ibtMetalRateFrozenPercentforGold:
                item.ibtMetalRateFrozenPercentforGold,
              ibtMetalRateFrozenPercentforPlatinum:
                item.ibtMetalRateFrozenPercentforPlatinum,
              ibtMetalRateNonFrozenPercentforGold:
                item.ibtMetalRateNonFrozenPercentforGold,
              ibtMetalRateNonFrozenPercentforPlatinum:
                item.ibtMetalRateNonFrozenPercentforPlatinum,
              ibtBestRatePercentforGold: item.ibtBestRatePercentforGold,
              ibtBestRatePercentforPlatinum: item.ibtBestRatePercentforPlatinum,
              mtrMetalRateFrozenPercentforGold:
                item.mtrMetalRateFrozenPercentforGold,
              mtrMetalRateFrozenPercentforPlatinum:
                item.mtrMetalRateFrozenPercentforPlatinum,
              mtrMetalRateNonFrozenPercentforGold:
                item.mtrMetalRateNonFrozenPercentforGold,
              mtrMetalRateNonFrozenPercentforPlatinum:
                item.mtrMetalRateNonFrozenPercentforPlatinum,
              mtrBestRatePercentforGold: item.mtrBestRatePercentforGold,
              mtrBestRatePercentforPlatinum: item.mtrBestRatePercentforPlatinum,
              prodMetalRateFrozenPercentforGold:
                item.prodMetalRateFrozenPercentforGold,
              prodMetalRateFrozenPercentforPlatinum:
                item.prodMetalRateFrozenPercentforPlatinum,
              prodMetalRateNonFrozenPercentforGold:
                item.prodMetalRateNonFrozenPercentforGold,
              prodMetalRateNonFrozenPercentforPlatinum:
                item.prodMetalRateNonFrozenPercentforPlatinum,
              prodBestRatePercentforGold: item.prodBestRatePercentforGold,
              prodBestRatePercentforPlatinum:
                item.prodBestRatePercentforPlatinum,
              comMetalRateFrozenPercentforGold:
                item.comMetalRateFrozenPercentforGold,
              comMetalRateFrozenPercentforPlatinum:
                item.comMetalRateFrozenPercentforPlatinum,
              comMetalRateNonFrozenPercentforGold:
                item.comMetalRateNonFrozenPercentforGold,
              comMetalRateNonFrozenPercentforPlatinum:
                item.comMetalRateNonFrozenPercentforPlatinum,
              comBestRatePercentforGold: item.comBestRatePercentforGold,
              comBestRatePercentforPlatinum: item.comBestRatePercentforPlatinum,
              autoApprovalFrozenPercentforGold:
                item.autoApprovalFrozenPercentforGold,
              autoApprovalFrozenPercentforPlatinum:
                item.autoApprovalFrozenPercentforPlatinum,
              autoApprovalNonFrozenPercentforGold:
                item.autoApprovalNonFrozenPercentforGold,
              autoApprovalNonFrozenPercentforPlatinum:
                item.autoApprovalNonFrozenPercentforPlatinum,
              autoApprovalBestRatePercentforGold:
                item.autoApprovalBestRatePercentforGold,
              autoApprovalBestRatePercentforPlatinum:
                item.autoApprovalBestRatePercentforPlatinum,
              description: this.productGroupsMap.get(item.productGroupCode)
            });
          }
        }
      });

    this.coOrderPaymentFacade
      .getConfiguration()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedConfigDetails => {
        this.selectedConfigDetails = selectedConfigDetails;
      });
    this.coOrderPaymentFacade
      .getConfigId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configId => {
        if (configId !== null && configId !== 'new') {
          this.configId = configId;

          this.loadCoOrderPaymentConfigDetails();
          this.showSaveSuccessMessageNotification(
            this.configurationSaveMessage
          );
          this.formData.get('configName').disable({ onlySelf: true });
        }
      });
    if (this.configId !== 'new') {
      this.formData.get('configName').disable({ onlySelf: true });
      this.coOrderPaymentFacade.loadSelectedConfigDetails(this.configId);
      this.loadCoOrderPaymentConfigDetails();
      this.coOrderPaymentFacade.loadAllCoOrderPaymentRulesById({
        isPageable: false,
        configId: this.configId
      });
    }
    this.coOrderPaymentFacade
      .getIsCleared()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCleared => {
        if (isCleared) {
          this.loadCoOrderPaymentConfigDetails();

          this.showSuccessMessageNotification(this.configurationRemoveMessage);
        } else this.overlayNotification.close();
      });
    this.coOrderPaymentFacade
      .getIsUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.coOrderPaymentFacade.loadSelectedConfigDetails(this.configId);
          this.showSuccessMessageNotification(this.configurationUpdateMessage);
        } else this.overlayNotification.close();
      });
    this.coOrderPaymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  back() {
    this.coOrderPaymentFacade.loadReset();
    this.router.navigate([getCustomerOrderPaymentConfigListRouteUrl()]);
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
        this.coOrderPaymentFacade.uniqueConfigNameCheck(
          this.formData.get('configName').value.trim()
        );
        this.coOrderPaymentFacade
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
      this.coOrderPaymentFacade.updateIsActive({
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

  remove(ordrerPaymentConfigReq: CoOrderPaymentsRequest) {
    const updateWeightTolerancePayload: UpdateCoOrderPaymentConfigPayload = {
      id: this.configId,
      data: ordrerPaymentConfigReq
    };
    this.coOrderPaymentFacade.removeConfiguration(updateWeightTolerancePayload);
  }

  createConfiguration(ordrerPaymentConfigReq: CoOrderPaymentsRequest) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          if (this.configId === 'new') {
            const saveTolerancePayload: SaveCoOrderPaymentsPayload = {
              configDetail: {
                description: this.formData.get('configName').value.trim(),
                isActive: true,
                ruleDetails: {}
              },
              orderPaymentConfigRequest: ordrerPaymentConfigReq
            };
            this.coOrderPaymentFacade.saveConfiguration(saveTolerancePayload);
          } else {
            const updateConfigPayload: UpdateCoOrderPaymentConfigPayload = {
              id: this.configId,
              data: ordrerPaymentConfigReq
            };
            this.coOrderPaymentFacade.updateConfig(updateConfigPayload);
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
        configType: ConfigTypeEnum.ORDER_CO_PAYMENT_CONFIG
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
            getCustomerOrderPaymentConfigDetailRouteUrl(this.configId)
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
    this.coOrderPaymentFacade.loadCoOrderPaymentConfigById({
      configId: this.configId,
      productGroupCode: searchValue
    });
  }

  clearProductGroupSearch() {
    this.loadCoOrderPaymentConfigDetails();
  }

  paginate(pageEvent: PageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadCoOrderPaymentConfigDetails();
  }

  sort(sortEvent: string[]) {
    this.initialPageEvent.pageIndex = 0;
    this.sortData = [...sortEvent];
    this.loadCoOrderPaymentConfigDetails();
  }

  loadCoOrderPaymentConfigDetails() {
    if (this.sortData.length === 0) {
      this.sortData = ['productGroupCode' + ',' + 'asc'];
    }
    if (this.configId !== 'new') {
      this.coOrderPaymentFacade.loadCoOrderPaymentConfigById({
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
        message: 'pw.coOrderPaymentConfig.locationsMandatoryMessage'
      })
      .pipe(take(1))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
