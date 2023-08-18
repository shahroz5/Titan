import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
  SelectedLocation,
  LocationMappingServiceAbstraction,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  ActiveConfigs,
  PaymentConfiguration,
  SelectedOptionsData,
  PaymentModesConfig,
  CNCancelation,
  paymentConiguration,
  ConfigTypeEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  CheckBoxHeader,
  CheckBoxSelectedOption
} from '@poss-web/shared/models';
import { PaymentConfigurationFacade } from '@poss-web/eposs/payment-configuration/data-access-payment-configuration';
import {
  getPaymentConfigDetailRouteUrl,
  getPaymentConfigListRouteUrl
} from '@poss-web/shared/util-site-routes';

import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';

import { take, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PaymentConfigurationDetailItemsComponent } from '@poss-web/eposs/payment-configuration/ui-payment-configuration-detail';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
@Component({
  selector: 'poss-web-payment-configuration-detail',
  templateUrl: './payment-configuration-detail.component.html'
})
export class PaymentConfigurationDetailComponent implements OnInit, OnDestroy {
  @ViewChild(PaymentConfigurationDetailItemsComponent)
  paymentConfigurationDetailItemsComponent: PaymentConfigurationDetailItemsComponent;

  configId: string;
  paymentConfiguration: PaymentConfiguration;
  paymentNameLabel: string;
  paymentModes$: Observable<PaymentModesConfig[]>;
  transactionTypesData: any[] = [];
  transactionTypes$: Observable<any>;
  selectedOptions$: Observable<SelectedOptionsData>;
  isTransactionTypeLoading$: Observable<boolean>;
  isPaymentModesLoading$: Observable<boolean>;
  isSelectedOptionLoading$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  maxOptionsLimit: number;
  destroy$ = new Subject();
  formData: FormGroup;
  readonly: boolean;
  locationMappingButtonDisable = false;
  selectedLocations: SelectedLocation[];
  activeConfigs$: Observable<ActiveConfigs[]>;
  hasChange = false;
  hasUpdated$: Observable<boolean>;
  hasSaved$: Observable<boolean>;
  paymentName: string;
  mappedLocations = [];
  showViewOnly: boolean;
  transactionTypes: CheckBoxHeader[] = [];
  paymentTypes: PaymentModesConfig[] = [];
  seletedModes: CheckBoxSelectedOption[] = [];
  rowHeaderTitle = 'Type of Payments';
  columnHeaderTitle = 'Type of Transaction';
  tcsPaymentModes = [];

  constructor(
    private paymentConfigurationFacade: PaymentConfigurationFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private locationMappingService: LocationMappingServiceAbstraction,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private route: ActivatedRoute,
    private locationMappingFacade: LocationMappingFacade,
    private selectionDialog: SelectionDialogService,
    private appSettingFacade: AppsettingFacade
  ) {}

  ngOnInit() {
    this.locationMappingFacade.resetMappedLocations();
    this.paymentConfigurationFacade.loadReset();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });
    this.appSettingFacade
      .getmaxLimitForCheckboxGrid()
      .pipe(takeUntil(this.destroy$))
      .subscribe((maxLimit: number) => {
        this.maxOptionsLimit = maxLimit;
      });
    this.transactionTypes$ = this.paymentConfigurationFacade.getTransactionTypes();
    this.translate
      .get(['pw.paymentConfiguration.paymentName'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.paymentNameLabel =
          translatedMsg['pw.paymentConfiguration.paymentName'];
      });
    this.createForm();
    this.paymentConfigurationFacade.loadPaymentModeCount();

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        if (this.configId !== 'new') {
          if (this.showViewOnly) {
            this.paymentConfigurationFacade.loadSelectedPaymentConfigurationByConfigId(
              {
                configId: this.configId
              }
            );
          }
          this.locationMappingFacade.loadMappedLocations({
            ruleType: ConfigTypeEnum.PAYMENT_CONFIGURATIONS,
            ruleID: this.configId
          });
          this.locationMappingButtonDisable = true;
          this.formData.get('paymentName').disable();
          this.paymentConfigurationFacade.loadPaymentConfigurationByConfigId(
            this.configId
          );
          this.paymentConfigurationFacade.loadTcsPaymentModes(this.configId);
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

    this.paymentConfigurationFacade
      .getPaymentModeCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        if (count !== null) {
          this.paymentConfigurationFacade.loadPaymentModeAndTransacionType({
            configId: this.configId,
            count: count
          });
        }
      });

    this.paymentConfigurationFacade
      .getPaymentConfiguration()
      .pipe(takeUntil(this.destroy$))
      .subscribe(paymentConfiguration => {
        if (paymentConfiguration) {
          this.paymentConfiguration = paymentConfiguration;
        }
      });

    this.isLoading$ = this.paymentConfigurationFacade.getIsloading();

    this.paymentModes$ = this.paymentConfigurationFacade.getPaymentModes();

    this.paymentModes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.paymentName = this.paymentConfigurationDetailItemsComponent
        ? this.paymentConfigurationDetailItemsComponent.selectedRowName
          ? this.paymentConfigurationDetailItemsComponent.selectedRowName
          : ''
        : '';
    });
    this.paymentConfigurationFacade
      .getPaymentModes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.paymentTypes = [];
          data.forEach(mode => {
            if (mode.title === this.paymentName) {
              this.paymentTypes.unshift({
                description: mode.description,
                title: mode.title,
                totalCount: mode.totalCount,
                selectedCount: mode.selectedCount
              });
            } else {
              this.paymentTypes.push({
                description: mode.description,
                title: mode.title,
                totalCount: mode.totalCount,
                selectedCount: mode.selectedCount
              });
            }
          });
        }
      });

    this.paymentConfigurationFacade
      .getTransactionTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        {
          this.transactionTypes = [];
          data.forEach(d => {
            this.transactionTypes.push({
              key: d.rowKey,
              title: d.description
            });
            this.transactionTypesData.push({
              rowKey: d.rowKey,
              description: d.description,
              formGroup: new FormGroup({
                'Active/inActive': new FormControl()
              }),
              value: '',
              condition: ''
            });
          });
        }
      });

    this.selectedOptions$ = this.paymentConfigurationFacade.getSelectedOptions();
    this.paymentConfigurationFacade
      .getSelectedOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedOptions => {
        if (selectedOptions) {
          this.seletedModes = [];
          selectedOptions.selectedResponse.forEach(val => {
            this.seletedModes.push({
              id: val.id,
              rowHeaderKey: val.columnHeaderKey,
              columnHeaderKey: val.rowHeaderKey
            });
          });
        }
      });

    this.paymentConfigurationFacade
      .getTcsPaymentModes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tcsPaymentModes => {
        this.tcsPaymentModes = [];
        if (tcsPaymentModes.length) {
          for (const tcsPaymentMode of tcsPaymentModes) {
            this.tcsPaymentModes.push({
              code: tcsPaymentMode.code,
              checked: tcsPaymentMode.checked,
              id: tcsPaymentMode.id
            });
          }
        }
      });

    this.paymentConfigurationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.paymentConfigurationFacade.loadSelectedPaymentConfigurationByConfigId(
            {
              configId: this.configId,
              paymentName: this.paymentName
            }
          );
          this.showSuccessMessageNotification(
            'pw.paymentConfiguration.updateMsg'
          );
          this.hasChange = false;
          this.router.navigate([getPaymentConfigListRouteUrl()]);
        }
      });
    this.hasUpdated$ = this.paymentConfigurationFacade.getHasUpdated();
    this.hasSaved$ = this.paymentConfigurationFacade.getHasSaved();

    this.paymentConfigurationFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.showSuccessMessageNotification(
            'pw.paymentConfiguration.successMsg'
          );
          setTimeout(() => {
            this.router.navigate([getPaymentConfigListRouteUrl()]);
          }, 2000);
        }
        this.hasChange = false;
      });
    this.paymentConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.paymentConfigurationFacade
      .getConfigId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(configId => {
        if (configId) {
          setTimeout(() => {
            this.paymentConfigurationFacade.loadSelectedPaymentConfigurationByConfigId(
              {
                configId: configId,
                paymentName: this.paymentName
              }
            );
            this.router.navigate([getPaymentConfigDetailRouteUrl(configId)]);
          }, 1000);
        }
      });
  }

  updateCount(dataToUpdate: { count: number; id: string }) {
    this.paymentConfigurationFacade.updateCount(dataToUpdate);
  }
  createForm() {
    this.formData = new FormGroup({
      paymentName: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.paymentNameLabel),
        this.fieldValidatorsService.nameWithSpaceField(this.paymentNameLabel)
      ]),
      isActive: new FormControl(true)
    });
  }

  loadTransactionByPaymentName(event) {
    this.paymentName = event.paymentName;

    if (event.paymentName && this.configId !== 'new') {
      this.paymentConfigurationFacade.loadSelectedPaymentConfigurationByConfigId(
        {
          configId: this.configId,
          paymentName: event.paymentName,
          newCount: event.newCount
        }
      );
    }
  }

  save() {
    if (
      this.paymentConfigurationDetailItemsComponent.tcsPaymentModes.length !==
        0 &&
      this.paymentConfigurationDetailItemsComponent.tcsPaymentModes.filter(
        ob => ob.checked
      )?.length === 0
    ) {
      this.showMessage('pw.paymentConfiguration.tcsPaymentModeErrorMsg');
    } else if (
      this.paymentConfiguration &&
      this.paymentConfiguration?.paymentName !== '' &&
      !this.paymentConfiguration?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const response = this.paymentConfigurationDetailItemsComponent.getReponse();

      const removeConfigs = response
        ? response.removedArray
          ? response.removedArray
          : []
        : [];
      let updateConfigs = response
        ? response.updateConfigs
          ? response.updateConfigs
          : []
        : [];
      const map = response ? (response.map ? response.map : null) : null;
      const addedConfigs = [];

      if (map) {
        map.forEach((v: any[], k) => {
          const t = v;
          t.forEach(tt => {
            if (tt !== 'CN') {
              if (tt.transactionName === CNCancelation.cn) {
                addedConfigs.push({
                  paymentCode: k,
                  transactionType: tt ? tt.transactionName : '',
                  configDetails: tt ? tt.configDetails : ''
                });
              } else {
                addedConfigs.push({
                  paymentCode: k,
                  transactionType: tt
                });
              }
            }
          });
        });
      }

      addedConfigs.forEach(added => {
        if (added.transactionType === 'CM') {
          if (
            this.paymentConfigurationDetailItemsComponent.tcsPaymentModes
              .filter(tcsChecked => tcsChecked.checked)
              .filter(ob => ob.id === null)
              .map(data => data.code)
              .includes(added.paymentCode)
          ) {
            addedConfigs[addedConfigs.indexOf(added)] = {
              ...addedConfigs[addedConfigs.indexOf(added)],
              configDetails: {
                type: 'PAYEMENT_CONFIG_DETAILS',
                data: {
                  isTCSPaymentEnabled: true
                }
              }
            };
          }
        }
      });

      updateConfigs = this.paymentConfigurationDetailItemsComponent.tcsPaymentModes

        .filter(ob => ob.id !== null)
        .map(ob => ({
          configDetailId: ob.id,
          configsDto: {
            configDetails: {
              type: 'PAYEMENT_CONFIG_DETAILS',
              data: {
                isTCSPaymentEnabled: ob.checked
              }
            },
            paymentCode: ob.code,
            transactionType: 'CM'
          }
        }));
      const savePaymentConfiguration = {
        description: this.formData.get('paymentName').value,
        isActive: this.formData.get('isActive').value,
        configType: paymentConiguration.paymentConfig
      };
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.alertPopup.saveConfirmation'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            if (this.configId === 'new') {
              this.paymentConfigurationFacade.savePaymentConfiguration({
                paymentConfiguration: savePaymentConfiguration,
                saveData: {
                  addConfigs: addedConfigs,
                  removeConfigs: removeConfigs,
                  updateConfigs: updateConfigs
                }
              });
            } else {
              this.paymentConfigurationFacade.updateSelectedPaymentConfigurationByConfigId(
                {
                  configId: this.configId,
                  data: {
                    addConfigs: addedConfigs,
                    removeConfigs: removeConfigs,
                    updateConfigs: updateConfigs
                  }
                }
              );
            }
          }
        });
    }
  }
  change(event) {
    this.hasChange = event;
  }
  showMessage(key: string) {
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
          .events.subscribe();
      });
  }
  // updateIsActive(event) {
  //   if (this.configId !== 'new') {
  //     this.paymentConfigurationFacade.updatePaymentConfiguration({
  //       configId: this.configId,
  //       data: { isActive: event, configType: paymentConiguration.paymentConfig }
  //     });
  //   }
  // }
  back() {
    this.paymentConfigurationFacade.loadReset();
    this.router.navigate([getPaymentConfigListRouteUrl()]);
  }
  loadCheckPaymentName() {
    if (this.formData.get('paymentName').value !== '') {
      if (
        fieldValidation.nameWithSpaceField.pattern.test(
          this.formData.get('paymentName').value
        )
      ) {
        this.paymentConfigurationFacade.checkUniquePaymentName(
          this.formData.get('paymentName').value
        );
      }

      this.paymentConfigurationFacade
        .getPaymentConfigurationList()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data && data.length === 1) {
            this.formData
              .get('paymentName')
              .setValidators([
                this.fieldValidatorsService.isUniqueCheck(
                  this.paymentNameLabel,
                  false
                )
              ]);

            this.formData.controls['paymentName'].updateValueAndValidity();
          } else {
            this.formData.get('paymentName').clearValidators();
            this.formData
              .get('paymentName')
              .setValidators([
                this.fieldValidatorsService.requiredField(
                  this.paymentNameLabel
                ),
                this.fieldValidatorsService.nameWithSpaceField(
                  this.paymentNameLabel
                ),
                this.fieldValidatorsService.isUniqueCheck(
                  this.paymentNameLabel,
                  true
                )
              ]);
            this.formData.controls['paymentName'].updateValueAndValidity();
          }
        });
    }
  }
  openLocationMapping() {
    if (
      this.paymentConfiguration?.paymentName !== '' &&
      !this.paymentConfiguration?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.configId = this.activatedRoute.snapshot.params['_configId'];
      this.locationMappingService.open({
        isConfig: true,
        configDetails: {
          configId: this.configId,
          configType: ConfigTypeEnum.PAYMENT_CONFIGURATIONS
        }
      });
    }
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,

            hasBackdrop: true
          })
          .events.subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
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
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
