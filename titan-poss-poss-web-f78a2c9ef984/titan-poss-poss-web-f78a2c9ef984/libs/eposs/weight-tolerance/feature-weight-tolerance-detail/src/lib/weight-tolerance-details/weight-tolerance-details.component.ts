import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  SelectedLocation,
  ActiveConfigs,
  LocationMappingServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  WeightRange,
  weightToleranceEnum,
  WeightToleranceRequest,
  SaveWeightTolerancePayload,
  UpdateWeightTolerancePayload,
  ConfigDetails,
  ProductGroup,
  ConfigTypeEnum,
  WeightTolerance,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { FormGroup, FormControl } from '@angular/forms';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil } from 'rxjs/operators';
import { WeightToleranceFacade } from '@poss-web/eposs/weight-tolerance/data-access-weight-tolerance';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  getWeightToleranceDetailRouteUrl,
  getWeightToleranceListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { PageEvent } from '@angular/material/paginator';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
@Component({
  selector: 'poss-web-weight-tolerance-details',
  templateUrl: './weight-tolerance-details.component.html'
})
export class WeightToleranceDetailsComponent implements OnInit, OnDestroy {
  activeConfigs: Observable<ActiveConfigs[]>;
  isCleared$: Observable<boolean>;
  rangeWeight$: Observable<WeightRange[]>;
  weightTolerance$: Observable<WeightTolerance[]>;
  isLoading$: Observable<boolean>;
  formGroup: FormGroup;
  weightTolerance: WeightTolerance[] = [];
  formData: FormGroup;
  selectedConfigDetails: ConfigDetails;
  selectedLocations: SelectedLocation[] = [];
  configId: string;
  configNameLabel: string;
  noLocationError: string;
  destroy$: Subject<null> = new Subject<null>();
  productGroups$: Observable<ProductGroup[]>;

  pageSizeOptions: number[] = [];
  minPageSize = 0;
  pageSize: number[];

  totalElements$: Observable<number>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  constructor(
    public weightToleranceFacade: WeightToleranceFacade,
    private fieldValidatorsService: FieldValidatorsService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  mappedLocations = [];
  showViewOnly: boolean;

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.showViewOnly = params?.showViewOnly === 'true' ? true : false;
      });

    this.weightToleranceFacade.loadReset();
    this.translate
      .get(['pw.weightTolerance.configNameLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.configNameLabel =
          translatedMessages['pw.weightTolerance.configNameLabel'];
      });
    this.createForm();
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
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
    this.weightToleranceFacade.loadProductGroups();
    this.weightToleranceFacade.loadRangeWeight();
    this.totalElements$ = this.weightToleranceFacade.getTotalElements();
    this.rangeWeight$ = this.weightToleranceFacade.getRangeWeight();
    this.weightTolerance$ = this.weightToleranceFacade.getWeightToleranceByConfigId();
    this.isLoading$ = this.weightToleranceFacade.getIsloading();

    this.noLocationError = ErrorEnums.ERR_CONFIG_002;
    this.isCleared$ = this.weightToleranceFacade.getIsCleared();
    this.productGroups$ = this.weightToleranceFacade.getProductGroups();

    this.weightTolerance$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data && data.length) {
        this.weightTolerance = [];
        for (const item of data) {
          this.weightTolerance.push({
            weightRange: item.rangeId,
            tolerance: item.tolerance,
            productGroupCode: item.productGroupCode,
            id: item.id,
            isSaved: item.isSaved
          });
        }
      } else {
        this.weightTolerance = [];
      }
    });
    this.weightToleranceFacade
      .getSelectedConfigDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedConfigDetails => {
        this.selectedConfigDetails = selectedConfigDetails;
      });

    this.weightToleranceFacade
      .getConfigId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configId => {
        if (configId !== null && configId !== 'new') {
          this.configId = configId;
          this.loadWeightTolerance();
          this.showSuccessMessageNotification('pw.weightTolerance.successMsg');
          this.formData.get('configName').disable({ onlySelf: true });
        }
      });
    if (
      this.configId !== weightToleranceEnum.new &&
      this.configId !== null &&
      this.configId !== undefined
    ) {
      this.formData.get('configName').disable({ onlySelf: true });
      this.weightToleranceFacade.loadSelectedConfigDetails(this.configId);
      this.loadWeightTolerance();
    }

    this.weightToleranceFacade
      .getIsCleared()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isCleared => {
        if (isCleared) {
          setTimeout(() => {
            this.loadWeightTolerance();
          }, 2000);

          this.showSuccessMessageNotification('pw.weightTolerance.removeMsg');
        } else this.overlayNotification.close();
      });
    this.weightToleranceFacade
      .getIsUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          setTimeout(() => {
            this.weightToleranceFacade.loadSelectedConfigDetails(this.configId);
            this.loadWeightTolerance();
          }, 2000);
          this.showSuccessMessageNotification('pw.weightTolerance.updateMsg');
        } else this.overlayNotification.close();
      });

    this.weightToleranceFacade
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

  loadWeightTolerance() {
    this.weightToleranceFacade.loadWeightToleranceByConfigId({
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
      configId: this.configId
    });
  }
  paginate(pageEvent: PageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadWeightTolerance();
  }

  back() {
    this.weightToleranceFacade.loadReset();
    this.router.navigate([getWeightToleranceListRouteUrl()]);
  }
  createForm() {
    this.formData = new FormGroup({
      configName: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.configNameLabel),
        this.fieldValidatorsService.nameWithSpaceField(this.configNameLabel)
      ]),
      isActive: new FormControl(true)
    });
  }
  searchProductGroup(searchValue) {
    this.weightToleranceFacade.loadWeightToleranceByConfigId({
      configId: this.configId,
      productGroupCode: searchValue
    });
  }
  clearProductGroupSearch() {
    this.loadWeightTolerance();
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
        this.weightToleranceFacade.searchConfigDetailsByConfigName(
          this.formData.get('configName').value
        );
        this.weightToleranceFacade
          .getConfigList()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            if (data && data.length !== 0) {
              this.formData
                .get('configName')
                .setValidators([
                  this.fieldValidatorsService.isUniqueCheck(
                    this.configNameLabel,
                    false
                  )
                ]);

              this.formData.controls['configName'].updateValueAndValidity();
            } else {
              this.formData.get('configName').clearValidators();
              this.formData
                .get('configName')
                .setValidators([
                  this.fieldValidatorsService.requiredField(
                    this.configNameLabel
                  ),
                  this.fieldValidatorsService.nameWithSpaceField(
                    this.configNameLabel
                  ),
                  this.fieldValidatorsService.isUniqueCheck(
                    this.configNameLabel,
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
          this.fieldValidatorsService.requiredField(this.configNameLabel),
          this.fieldValidatorsService.nameWithSpaceField(this.configNameLabel),
          this.fieldValidatorsService.isUniqueCheck(this.configNameLabel, true)
        ]);
      this.formData.controls['configName'].updateValueAndValidity();
    }
  }

  remove(weightToleranceRequest: WeightToleranceRequest) {
    const updateWeightTolerancePayload: UpdateWeightTolerancePayload = {
      id: this.configId,
      data: weightToleranceRequest
    };
    this.weightToleranceFacade.removeWeightTolerance(
      updateWeightTolerancePayload
    );
  }
  createConfiguration(weightToleranceRequest: WeightToleranceRequest) {
    if (this.configId === weightToleranceEnum.new) {
      const saveTolerancePayload: SaveWeightTolerancePayload = {
        configDetail: {
          description: this.formData.get('configName').value,
          isActive: this.formData.get('isActive').value,
          ruleDetails: {}
        },
        weightToleranceRequest: weightToleranceRequest
      };

      this.weightToleranceFacade.saveWeightTolerance(saveTolerancePayload);
    } else {
      const updateWeightTolerancePayload: UpdateWeightTolerancePayload = {
        id: this.configId,
        data: weightToleranceRequest
      };

      this.weightToleranceFacade.updateWeightTolerance(
        updateWeightTolerancePayload
      );
    }
  }
  openLocationMapping() {
    this.configId = this.activatedRoute.snapshot.params['_configId'];

    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: this.configId,
        configType: ConfigTypeEnum.WEIGHT_TOLERANCE
      }
    });
  }
  showLocMappingAlertMessage() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.weightTolerance.selAtleaseOneLocation'
      })
      .pipe(take(1))
      .subscribe();
  }
  showSuccessMessageNotification(key: any) {
    this.locationMappingFacade.loadMappedLocations({
      ruleType: ConfigTypeEnum.WEIGHT_TOLERANCE,
      ruleID: this.configId
    });
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,

            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.router.navigate([
              getWeightToleranceDetailRouteUrl(this.configId)
            ]);
            if (this.mappedLocations.length === 0) {
              this.showLocMappingAlertMessage();
            }
          });
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
          // this.selectedLocation = selectedOption;
          // this.locationCode = selectedOption.id;
          // this.priceGroupMappingFacade.loadLocationPriceGroupMappingList(
          //   this.locationCode
          // );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
