import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getPayerBankConfigurationRouteUrl } from '@poss-web/shared/util-site-routes';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { takeUntil, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { PayerBankConfigFacade } from '@poss-web/eposs/payer-bank-config/data-access-payer-bank-config';
import {
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventType,
  PayerBankConfigDetails,
  PayerBankConfigSavePayload,
  PaymentModeResponse,
  PayerBankMaster,
  CustomErrors,
  LocationMappingServiceAbstraction,
  SelectedPayerBankLocations,
  SelectedBanks,
  ActivePayerConfigurations,
  ConfigTypeEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { TranslateService } from '@ngx-translate/core';
import { PageEvent } from '@angular/material/paginator';
import { getPayerBankConfigurationDetailsRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
export enum PayerBankConfigurationEnum {
  CC = 'cc',
  DC = 'dc',
  PC = 'pc',
  CARD = 'CARD'
}
@Component({
  selector: 'poss-web-payer-bank-config-details',
  templateUrl: './payer-bank-config-details.component.html'
})
export class PayerBankConfigDetailsComponent implements OnInit, OnDestroy {
  configId: string;
  bankDetailsFormGroup: FormGroup;
  readOnly = false;
  cardsList = [
    {
      id: 'cc',
      name: 'Credit Card'
    },
    {
      id: 'dc',
      name: 'DebitCard'
    },
    {
      id: 'pc',
      name: 'Pre-Paid-Card'
    }
  ];
  selectedLocations: SelectedPayerBankLocations[] = [];
  activeConfigs$: Observable<ActivePayerConfigurations[]>;
  payerBanks: PayerBankMaster[] = [];
  cardType: string[] = [];
  selectedBanksList: SelectedBanks[] = [];
  selectedBanks: string[] = [];
  deletedBanks: string[] = [];
  hidden = true;
  configDetails: PayerBankConfigSavePayload = null;
  destroy$ = new Subject<null>();
  isLoading$: Observable<boolean>;
  paymentModes: PaymentModeResponse[];
  adding = false;
  disable = true;
  isCardMandatory = false;
  count = 0;
  isSelction = false;
  payerBankConfigPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  banksCount$: Observable<number>;
  minPageSize = 0;
  paymentMode: string;
  rowChange = false;
  configNameTraslatedMsg: string;
  paymentModeTranslatedMsg: string;
  mappedLocations = [];
  showViewOnly: boolean;
  constructor(
    private router: Router,
    private fieldValidatorsService: FieldValidatorsService,
    private payerBankConfigurationFacade: PayerBankConfigFacade,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationMappingService: LocationMappingServiceAbstraction,
    private appsettingFacade: AppsettingFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private selectionDialog: SelectionDialogService,
    private locationMappingFacade: LocationMappingFacade
  ) {
    this.translate
      .get([
        'pw.payerBankConfiguration.configurationNameLabel',
        'pw.payerBankConfiguration.payementModeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.configNameTraslatedMsg =
          translatedMsg['pw.payerBankConfiguration.configurationNameLabel'];
        this.paymentModeTranslatedMsg =
          translatedMsg['pw.payerBankConfiguration.payementModeLabel'];
      });
    this.createForm();
  }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
    });

    this.payerBankConfigurationFacade.resetPayerBankConfigDetails();
    this.isLoading$ = this.payerBankConfigurationFacade.getIsLoading();
    this.payerBankConfigurationFacade.loadPaymentModes();
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.payerBankConfigPageEvent.pageSize = pageSize;
        this.loadPayerBanks();
      });
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.payerBankConfigurationFacade
      .getPayerBanks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((banks: PayerBankMaster[]) => {
        if (banks) {
          this.payerBanks = banks;
        }
      });
    const fromPath = this.route.pathFromRoot[2];
    this.configId = fromPath.snapshot.params['_configName'];
    if (this.configId !== 'new') {
      this.selectedBanks = [];
      this.deletedBanks = [];
      this.payerBankConfigurationFacade.payerBankDetailsByConfigName(
        this.configId
      );
    }
    this.payerBankConfigurationFacade
      .getConfigId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((configId: string) => {
        if (configId) {
          this.configId = configId;
          this.saveNotification('pw.payerBankConfiguration.successMessage');
        }
      });

    this.payerBankConfigurationFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.payerBankConfigurationFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasUpdated: boolean) => {
        if (hasUpdated) {
          this.showNotifications('pw.payerBankConfiguration.updateMessage');
          this.payerBankConfigurationFacade.payerBankDetailsByConfigName(
            this.configId
          );
        }
      });
    this.payerBankConfigurationFacade
      .getPayerBankDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((payerBankDetails: PayerBankConfigDetails) => {
        if (payerBankDetails) {
          this.readOnly = true;
          this.bankDetailsFormGroup
            .get('paymentMode')
            .disable({ emitEvent: false });
          this.configDetails = payerBankDetails.configDetails;
          this.disable = false;
          this.createForm();
          if (
            payerBankDetails.configDetails.paymentCode ===
            PayerBankConfigurationEnum.CARD
          ) {
            this.cardType = [];
            this.hidden = false;
            const cardTypes =
              payerBankDetails.configDetails.paymentDetails.cardType;
            cardTypes.forEach(card => {
              if (card === PayerBankConfigurationEnum.CC) {
                this.cardType.push(PayerBankConfigurationEnum.CC);
                this.bankDetailsFormGroup.patchValue({ cc: true });
              } else if (card === PayerBankConfigurationEnum.DC) {
                this.cardType.push(PayerBankConfigurationEnum.DC);
                this.bankDetailsFormGroup.patchValue({ dc: true });
              } else if (card === PayerBankConfigurationEnum.PC) {
                this.cardType.push(PayerBankConfigurationEnum.PC);
                this.bankDetailsFormGroup.patchValue({ pc: true });
              }
            });
          }
          this.selectedBanksList = payerBankDetails.selectedBanks;
        }
      });
    this.payerBankConfigurationFacade
      .getPaymentModes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((paymentModes: PaymentModeResponse[]) => {
        if (paymentModes) {
          this.paymentModes = paymentModes;
        }
      });
    this.banksCount$ = this.payerBankConfigurationFacade.getBanksCount();

    if (this.configId !== 'new') {
      this.locationMappingFacade.loadMappedLocations({
        ruleType: ConfigTypeEnum.PAYER_BANK_CONFIGURATIONS,
        ruleID: this.configId
      });
    }
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
        }
      });
  }
  search(searchValue) {
    this.payerBankConfigurationFacade.searchPayerBankName(
      searchValue.toUpperCase()
    );
  }

  loadPayerBanks() {
    this.payerBankConfigurationFacade.loadPayerBanks(
      this.payerBankConfigPageEvent
    );
  }
  paginate(pageEvent: PageEvent) {
    this.payerBankConfigPageEvent = pageEvent;
    this.loadPayerBanks();
  }
  showNotifications(key) {
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
            this.selectedBanks = [];
            this.deletedBanks = [];
          });
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
            this.router.navigate([
              getPayerBankConfigurationDetailsRouteUrl(this.configId)
            ]);
            this.selectedBanks = [];
            this.deletedBanks = [];
            this.payerBankConfigurationFacade.payerBankDetailsByConfigName(
              this.configId
            );
          });
      });
  }
  selectionChange(paymentMode: string) {
    if (paymentMode === PayerBankConfigurationEnum.CARD) {
      this.hidden = false;
    } else this.hidden = true;
  }
  createForm() {
    this.bankDetailsFormGroup = new FormGroup({
      configName: new FormControl(
        this.configDetails ? this.configDetails.description : '',
        [
          this.fieldValidatorsService.requiredField(
            this.configNameTraslatedMsg
          ),
          this.fieldValidatorsService.nameWithSpaceField(
            this.configNameTraslatedMsg
          )
        ]
      ),
      paymentMode: new FormControl(
        this.configDetails ? this.configDetails.paymentCode : '',
        [
          this.fieldValidatorsService.requiredField(
            this.paymentModeTranslatedMsg
          )
        ]
      ),
      cc: new FormControl(false),
      dc: new FormControl(false),
      pc: new FormControl(false),
      isCardMandatory: new FormControl(
        this.configDetails
          ? this.configDetails.paymentDetails.isCardMandatory
          : false
      ),
      isBankMandatory: new FormControl(
        this.configDetails
          ? this.configDetails.paymentDetails.isBankMandatory
          : false
      )
    });
  }

  change($event) {
    if ($event.checked) {
      this.cardType.push($event.source.id);
    } else {
      this.cardType = this.cardType.filter(id => id !== $event.source.id);
    }
  }
  save() {
    if (!this.configDetails?.isActive && this.configId !== 'new') {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.alertPopup.saveConfirmation'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            if (this.configId !== 'new') {
              this.payerBankConfigurationFacade.updatePayerBankConfigDetails({
                id: this.configId,
                configPayload: {
                  description: this.bankDetailsFormGroup.get('configName')
                    .value,
                  paymentCode: this.bankDetailsFormGroup.get('paymentMode')
                    .value,
                  paymentDetails: this.hidden
                    ? {}
                    : {
                        isCardMandatory: this.bankDetailsFormGroup.get(
                          'isCardMandatory'
                        ).value,
                        isBankMandatory: this.bankDetailsFormGroup.get(
                          'isBankMandatory'
                        ).value,
                        cardType: this.cardType
                      },

                  isActive: true
                },
                banksPayload: {
                  addBankName: this.selectedBanks,
                  removeBankName: this.deletedBanks
                }
              });
            } else {
              this.payerBankConfigurationFacade.savePayerBankConfigDetails({
                configPayload: {
                  description: this.bankDetailsFormGroup.get('configName')
                    .value,
                  paymentCode: this.bankDetailsFormGroup.get('paymentMode')
                    .value,
                  paymentDetails: {
                    isCardMandatory: this.bankDetailsFormGroup.get(
                      'isCardMandatory'
                    ).value,
                    isBankMandatory: this.bankDetailsFormGroup.get(
                      'isBankMandatory'
                    ).value,
                    cardType: this.cardType
                  },
                  isActive: true
                },
                banksPayload: {
                  addBankName: this.selectedBanks,
                  removeBankName: []
                }
              });
            }
          }
        });
    }
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
  back() {
    this.router.navigate([getPayerBankConfigurationRouteUrl()]);
    this.payerBankConfigurationFacade.resetPayerBankConfigDetails();
  }
  addedBank(selectedBankName: string) {
    this.count = 0;
    this.selectedBanksList.forEach((bankName: SelectedBanks) => {
      if (bankName.bankName !== selectedBankName) {
        this.count = this.count + 1;
      }
    });
    if (this.count === this.selectedBanksList.length) {
      if (this.selectedBanks.indexOf(selectedBankName) === -1) {
        this.selectedBanks.push(selectedBankName);
      }
    }
  }
  removedBank(removeBank: { bankName: string; id: string }) {
    this.selectedBanksList.forEach((bankName: SelectedBanks) => {
      if (bankName.id === removeBank.id) {
        this.deletedBanks.push(removeBank.id);
      }
    });
    this.selectedBanks = this.selectedBanks.filter(
      bankName => bankName !== removeBank.bankName
    );
  }
  locationMapping() {
    if (!this.configDetails?.isActive && this.configId !== 'new') {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.locationMappingService.open({
        isConfig: true,
        configDetails: {
          configId: this.configId,
          configType: ConfigTypeEnum.PAYER_BANK_CONFIGURATIONS
        }
      });
    }
  }
  rowSelectionChange($event) {
    this.rowChange = true;
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
