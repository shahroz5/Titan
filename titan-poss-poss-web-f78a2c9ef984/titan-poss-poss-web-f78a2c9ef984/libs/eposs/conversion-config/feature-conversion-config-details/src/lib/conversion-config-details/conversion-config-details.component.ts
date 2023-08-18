import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  getConversionConfigurationRouteUrl,
  getConversionConfigurationDetailsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ConversionConfigFacade } from '@poss-web/eposs/conversion-config/data-access-conversion-config';
import { takeUntil, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import {
  OverlayNotificationType,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  CustomErrors,
  ConversionConfigByIdPayload,
  CheckBoxHeader,
  CheckBoxSelectedOption,
  CheckBoxResponse,
  CreateConfig,
  ProductGroups,
  LocationMappingServiceAbstraction,
  ConfigTypeEnum
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { CheckboxGridComponent } from '@poss-web/shared/components/ui-checkbox-grid';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'poss-web-conversion-config-details',
  templateUrl: './conversion-config-details.component.html'
})
export class ConversionConfigDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(CheckboxGridComponent)
  checkbox: CheckboxGridComponent;
  checkBoxResponse: CheckBoxResponse;
  destroy$ = new Subject<null>();
  configId: string;
  columnHeaders: CheckBoxHeader[];
  rowHeaders: CheckBoxHeader[];
  selectedOptions: CheckBoxSelectedOption[] = [];
  conversionConfigDetailsById$: Observable<ConversionConfigByIdPayload>;
  maxOptionsLimit: number;
  isLoading$: Observable<boolean>;
  change: boolean;
  conversionConfigForm: FormGroup;
  createConfigDetails: CreateConfig;
  tab: string;
  ruleId: number;
  selectedGroups: ProductGroups[] = [];
  locationMappingButtonDisable = false;
  product$: Subject<ProductGroups[]> = new Subject<ProductGroups[]>();
  productObservable = this.product$.asObservable();
  options: ProductGroups[] = [];
  removedGroups: string[] = [];
  addedProducts: ProductGroups[] = [];
  rowHeaderTitle = 'ProductCategory';
  columnHeaderTitle = 'ProductGroup';
  productGroupDescription: string;
  productCategoryDescription: string;
  productGroupDes: Map<string, string> = new Map<string, string>();
  productCategoryDes: Map<string, string> = new Map<string, string>();
  configNameTranslation;

  constructor(
    private router: Router,
    private conversionConfigFacade: ConversionConfigFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private route: ActivatedRoute,
    private fieldValidatorsService: FieldValidatorsService,
    private locationMappingService: LocationMappingServiceAbstraction,
    private appSettingFacade: AppsettingFacade
  ) {
    this.translate
      .get(['pw.conversionConfig.configNameLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.configNameTranslation =
          translatedMsg['pw.conversionConfig.configNameLabel'];
      });
  }

  showViewOnly: boolean;
  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.showViewOnly = params?.showViewOnly === 'true' ? true : false;
    });

    this.productGroupDes = new Map();
    this.productCategoryDes = new Map();
    this.conversionConfigFacade.resetConversionConfig();
    this.conversionConfigFacade.loadProductGroups();
    this.conversionConfigFacade.loadProductCategories();
    const fromPath = this.route.pathFromRoot[2];
    this.configId = fromPath.snapshot.params['_configId'];
    this.tab = 'productGroup';
    this.appSettingFacade
      .getmaxLimitForCheckboxGrid()
      .pipe(takeUntil(this.destroy$))
      .subscribe((maxLimit: number) => {
        this.maxOptionsLimit = maxLimit;
      });
    this.createForm();
    if (this.configId !== 'new') {
      this.conversionConfigFacade.loadConversionConfigDetailsById(
        this.configId
      );
      this.locationMappingButtonDisable = true;
      this.conversionConfigForm.get('configName').disable();
    }

    this.conversionConfigFacade
      .getConversionConfigDetailsById()
      .pipe(takeUntil(this.destroy$))
      .subscribe((payload: ConversionConfigByIdPayload) => {
        if (payload) {
          this.ruleId = payload.createConfig.ruleId;
          this.createConfigDetails = payload.createConfig;
          this.getSelectedOptions(payload.productGroups);
        }
      });
    this.conversionConfigFacade
      .getSaveSuccessPayload()
      .pipe(takeUntil(this.destroy$))
      .subscribe((successPayload: ConversionConfigByIdPayload) => {
        if (successPayload) {
          this.configId = String(successPayload.createConfig.ruleId);
          this.conversionConfigFacade.loadConversionConfigDetailsById(
            this.configId
          );
          this.saveNotification('pw.conversionConfig.savedSuccessMessage');
        }
      });

    this.conversionConfigFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: CheckBoxHeader[]) => {
        this.columnHeaders = productGroups;
        this.columnHeaders.forEach(prod => {
          this.productGroupDes.set(prod.key, prod.title);
        });
      });
    this.conversionConfigFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productCategories: CheckBoxHeader[]) => {
        this.rowHeaders = productCategories;
        this.rowHeaders.forEach(productCategory => {
          this.productCategoryDes.set(
            productCategory.key,
            productCategory.title
          );
        });
      });

    this.conversionConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasUpdated: boolean) => {
        if (hasUpdated) {
          if (hasUpdated === true) {
            this.updateNotifications(
              'pw.conversionConfig.updateSuccessMessage'
            );
          }
        }
      });

    this.conversionConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.isLoading$ = this.conversionConfigFacade.getIsLoading();
  }
  getSelectedOptions(productGroups: ProductGroups[]) {
    this.selectedOptions = [];
    for (const groups of productGroups) {
      this.selectedOptions.push({
        rowHeaderKey: groups.productCategoryCode,
        columnHeaderKey: groups.productGroupCode,
        id: groups.id
      });
    }
    this.productGroups(productGroups);
  }
  productGroups(products: ProductGroups[]) {
    this.options = [];
    products.forEach((pro: ProductGroups) => {
      this.options.push({
        productCategoryDescription: this.productCategoryDes.get(
          pro.productCategoryCode
        ),
        productGroupDescription: this.productGroupDes.get(pro.productGroupCode),
        productGroupCode: pro.productGroupCode,
        productCategoryCode: pro.productCategoryCode,
        allowedLimitValue: pro.allowedLimitValue,
        allowedLimitWeight: pro.allowedLimitWeight,
        autoApprovalLimitValue: pro.autoApprovalLimitValue,
        autoApprovalLimitWeight: pro.autoApprovalLimitWeight,
        id: pro.id
      });
    });
    this.selectedGroups = this.options;
  }
  createForm() {
    this.conversionConfigForm = new FormGroup({
      configName: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.configNameTranslation),
        this.fieldValidatorsService.nameWithSpaceField(
          this.configNameTranslation
        )
      ]),
      isActive: new FormControl(true)
    });
  }
  changeTab(changeType: string) {
    this.tab = changeType;
    if (this.tab === 'setLimit') {
      this.next();
    }
  }

  updateNotifications(key) {
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
            this.conversionConfigFacade.resetConversionConfig();
            this.conversionConfigFacade.loadConversionConfigDetailsById(
              this.configId
            );
          });
      });
  }
  saveNotification(key) {
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
            this.conversionConfigFacade.resetConversionConfig();
            this.router.navigate([
              getConversionConfigurationDetailsRouteUrl(this.configId)
            ]);
          });
      });
  }
  back() {
    this.conversionConfigFacade.resetConversionConfig();
    this.router.navigate([getConversionConfigurationRouteUrl()]);
  }
  next() {
    this.checkBoxResponse = this.checkbox.getValue();
    this.selectedGroups = [];
    this.addedProducts = [];
    this.removedGroups = this.checkBoxResponse.removed;

    for (const added of this.checkBoxResponse.added) {
      this.addedProducts.push({
        productCategoryDescription: this.productCategoryDes.get(
          added.rowHeaderKey
        ),
        productGroupDescription: this.productGroupDes.get(
          added.columnHeaderKey
        ),
        productCategoryCode: added.rowHeaderKey,
        productGroupCode: added.columnHeaderKey,
        allowedLimitWeight: '',
        allowedLimitValue: '',
        autoApprovalLimitWeight: '',
        autoApprovalLimitValue: '',
        id: ''
      });
    }

    this.selectedGroups = this.addedProducts.concat(this.options);
    if (this.removedGroups) {
      this.removedGroups.forEach(id => {
        this.selectedGroups = this.selectedGroups.filter(obj => obj.id !== id);
      });
    }
  }
  saveConversionConfigValues(configValues: {
    addProducts: [];
    updateProducts: [];
    removeProducts: [];
  }) {
    const fromPath = this.route.pathFromRoot[2];
    this.configId = fromPath.snapshot.params['_configId'];
    if (this.configId === 'new') {
      this.conversionConfigFacade.saveConversionConfigValues({
        createConfig: {
          description: this.conversionConfigForm.get('configName').value,
          isActive: true,
          ruleDetails: {}
        },
        configValues: {
          addProducts: configValues.addProducts,
          removeProducts: [],
          updateProducts: []
        }
      });
    } else {
      this.conversionConfigFacade.updateConversionConfigDetails({
        configId: Number(this.configId),
        createConfig: {
          isActive: true,
          ruleDetails: {}
        },
        configValues: {
          addProducts: configValues.addProducts,
          removeProducts: this.removedGroups,
          updateProducts: configValues.updateProducts
        }
      });
    }
  }
  locationMapping() {
    const fromPath = this.route.pathFromRoot[2];
    this.configId = fromPath.snapshot.params['_configId'];
    this.locationMappingService.open({
      isConfig: true,
      configDetails: {
        configId: this.configId,
        configType: ConfigTypeEnum.CONVERSIONS
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
