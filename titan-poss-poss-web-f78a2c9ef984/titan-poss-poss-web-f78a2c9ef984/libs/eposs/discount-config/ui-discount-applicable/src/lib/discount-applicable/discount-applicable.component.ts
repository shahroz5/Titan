import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  BasicDiscountCategoryConfig,
  DiscountTypeEnum,
  ClubbingDiscountsConfig,
  ClubbingOffersConfig,
  GRNConfig,
  AbCoConfig,
  CumulativeDiscountConfig,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  DiscountTEPDetails,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { TepRecoveryConfigComponent } from '../tep-recovery-config/tep-recovery-config.component';
import { ClubbingOffersComponent } from '../clubbing-offers/clubbing-offers.component';
import { GRNConfigComponent } from '../grn-config/grn-config.component';
import { AbCoConfigComponent } from '../ab-co-config/ab-co-config.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-applicable',
  templateUrl: './discount-applicable.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountApplicableComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() currencyCode: string;
  @Input() discountTypes: string[] = [];
  @Input() clubbingDiscountTypes;
  @Input() durations;
  @Input() isRiva: boolean;
  @Input() discountDetails;
  @Input() params;
  @Output() save = new EventEmitter<any>();
  @Output() formDirty = new EventEmitter<any>();

  @Input() config: any;

  @ViewChild(TepRecoveryConfigComponent)
  tepRecoveryConfigComponent: TepRecoveryConfigComponent;

  @ViewChild(GRNConfigComponent)
  grnConfigComponent: GRNConfigComponent;

  @ViewChild(AbCoConfigComponent)
  abCoConfigComponent: AbCoConfigComponent;

  @ViewChild(ClubbingOffersComponent)
  clubbingOffersComponent: ClubbingOffersComponent;

  enableTepDiscountRecovery;
  destroy$ = new Subject();

  tepConfig: any[] = [
    {
      duration: 10,
      recoveryPercent: '20'
    }
  ];

  storeEditOptionDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT
  ];

  clubbingOffersOptionDiscounts = [
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT,
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.SYSTEM_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT,
    DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT,
    DiscountTypeEnum.BEST_DEAL_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT,
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT
  ];

  clubbingDiscountOptionDiscounts = [
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT,
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT,
    DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT,
    DiscountTypeEnum.BEST_DEAL_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT
  ];

  narrationOptionDiscoutns = [
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT,
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT,
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT,
    DiscountTypeEnum.BEST_DEAL_DISCOUNT
  ];

  accuralOptionDiscounts = [DiscountTypeEnum.EMPOWERMENT_DISCOUNT];
  minKaratageEligibleGEP = [];

  grnConfigDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
  ];

  abCoConfigDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT,
    DiscountTypeEnum.BEST_DEAL_DISCOUNT
  ];

  clubbingBillLevelDiscountOption = [DiscountTypeEnum.BILL_LEVEL_DISCOUNT];

  ucpValueDiscounts = [
    DiscountTypeEnum.BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT
  ];
  cumulativeDiscountConfigDiscounts = [
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT
  ];

  coniConfigDiscounts = [DiscountTypeEnum.COIN_OFFER_DISCOUNT];

  multipleTransactionPerDayOptionDiscounts = [];

  tataEmployeeConfigDiscounts = [DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT];

  serialNoOptionDiscounts = [DiscountTypeEnum.EMPLOYEE_DISCOUNT];

  applicableForAutomatedDiscountOptionDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT,
    DiscountTypeEnum.BEST_DEAL_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT
  ];

  fullValueTEPDiscountRecoveryOptionDiscounts = [
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT,
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.SYSTEM_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT,
    DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT,
    DiscountTypeEnum.BEST_DEAL_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT
  ];

  daysOptionOfGRNDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT
  ];

  daysOptionOfInvoiceDiscounts = [
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT
  ];

  allowedForGRNBeforeOfferPeriodOptionDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT
  ];

  grnSameCFAEligibleOptionDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT
  ];
  valid = true;
  clubDiscountsInvalid;
  basicDiscountsInvalid;
  clubOtherDiscountsInvalid: any;

  constructor(
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit() {
    if (this.config && this.config.basicCriteria) {
      this.enableTepDiscountRecovery = this.config.basicCriteria.data.isTepRecovery;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      if (this.config && this.config.basicCriteria) {
        this.enableTepDiscountRecovery = this.config.basicCriteria.data.isTepRecovery;
      }
    }
    if (changes['selectedDiscount']) {
      this.selectedDiscount = this.selectedDiscount;
    }
  }
  enableStoreEditOption() {
    return this.storeEditOptionDiscounts.includes(this.selectedDiscount);
  }

  enableClubbingOffersOption() {
    return this.clubbingOffersOptionDiscounts.includes(this.selectedDiscount);
  }

  enableClubbingDiscountOption() {
    return this.clubbingDiscountOptionDiscounts.includes(this.selectedDiscount);
  }

  enableNarrationOption() {
    return this.narrationOptionDiscoutns.includes(this.selectedDiscount);
  }

  enableAccuralOption() {
    return this.accuralOptionDiscounts.includes(this.selectedDiscount);
  }

  enableMinKaratageEligibleForGEP() {
    return this.minKaratageEligibleGEP.includes(this.selectedDiscount);
  }

  enableGrnConfig() {
    return this.grnConfigDiscounts.includes(this.selectedDiscount);
  }

  enableUCPValue() {
    return this.ucpValueDiscounts.includes(this.selectedDiscount);
  }

  enableCumulativeDiscountConfig() {
    return this.cumulativeDiscountConfigDiscounts.includes(
      this.selectedDiscount
    );
  }

  enableConiConfig() {
    return this.coniConfigDiscounts.includes(this.selectedDiscount);
  }

  enableMultipleTransactionPerDayOption() {
    return this.multipleTransactionPerDayOptionDiscounts.includes(
      this.selectedDiscount
    );
  }

  enableTataEmployeeConfig() {
    return this.tataEmployeeConfigDiscounts.includes(this.selectedDiscount);
  }

  enableSerialNoOption() {
    return this.serialNoOptionDiscounts.includes(this.selectedDiscount);
  }

  enableApplicableForAutomatedDiscountOption() {
    return this.applicableForAutomatedDiscountOptionDiscounts.includes(
      this.selectedDiscount
    );
  }

  enableFullValueTEPDiscountRecoveryOption() {
    return this.fullValueTEPDiscountRecoveryOptionDiscounts.includes(
      this.selectedDiscount
    );
  }

  enableDaysOptionOfGRN() {
    return this.daysOptionOfGRNDiscounts.includes(this.selectedDiscount);
  }

  enableDaysOptionOfInvoice() {
    return this.daysOptionOfInvoiceDiscounts.includes(this.selectedDiscount);
  }

  enableAllowedForGRNBeforeOfferPeriodOption() {
    return this.allowedForGRNBeforeOfferPeriodOptionDiscounts.includes(
      this.selectedDiscount
    );
  }

  enableGRNSameCFAEligibleOption() {
    return this.grnSameCFAEligibleOptionDiscounts.includes(
      this.selectedDiscount
    );
  }

  enableClubbingBillLevelDiscountOption() {
    return this.clubbingBillLevelDiscountOption.includes(this.selectedDiscount);
  }

  enableAbCoConfig() {
    return this.abCoConfigDiscounts.includes(this.selectedDiscount);
  }

  isSystemDiscount() {
    return this.selectedDiscount === DiscountTypeEnum.SYSTEM_DISCOUNT;
  }
  isTataEmployeeDiscount() {
    return this.selectedDiscount === DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT;
  }
  isEmployeeDiscount() {
    return this.selectedDiscount === DiscountTypeEnum.EMPLOYEE_DISCOUNT;
  }
  isBillLevelDiscount() {
    return this.selectedDiscount === DiscountTypeEnum.SYSTEM_DISCOUNT;
  }
  isEmpowermentDiscount() {
    return this.selectedDiscount === DiscountTypeEnum.EMPOWERMENT_DISCOUNT;
  }
  isCoinOfferDiscount() {
    return this.selectedDiscount === DiscountTypeEnum.COIN_OFFER_DISCOUNT;
  }
  enableGRNApplicableOption() {
    return this.selectedDiscount === DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT;
  }
  enableGrnPercentageOption() {
    return this.selectedDiscount !== DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT;
  }

  basicDiscountCategoryChange(data: BasicDiscountCategoryConfig) {
    this.config = {
      ...this.config,
      basicCriteria: {
        data: data,
        type: this.config.basicCriteria.type
      }
    };

    this.enableTepDiscountRecovery = data.isTepRecovery;
  }

  clubbingDiscountsChange(data: ClubbingDiscountsConfig) {
    this.config = {
      ...this.config,
      clubDiscountType: {
        data: data,
        type: this.config.clubDiscountType.type
      }
    };
  }

  clubbingOffersChange(data: ClubbingOffersConfig) {
    this.config = {
      ...this.config,
      clubOtherOffersConfig: {
        data: data,
        type: this.config.clubOtherOffersConfig.type
      }
    };
  }

  grnDetailsChange(data: GRNConfig) {
    this.config = {
      ...this.config,
      grnDetails: {
        data: data,
        type: this.config.grnDetails.type
      }
    };
  }

  abCoConfigChange(data: AbCoConfig) {
    this.config = {
      ...this.config,
      orderDetails: {
        data: data,
        type: this.config.orderDetails.type
      }
    };
  }

  tepRecoveryConfigChange(data: DiscountTEPDetails) {
    this.config = {
      ...this.config,
      tepDetails: {
        data: data,
        type: this.config.tepDetails.type
      }
    };
  }

  cumulativeDiscountChange(data: CumulativeDiscountConfig) {
    this.config = {
      ...this.config,
      cumulativeDetails: {
        data: data,
        type: this.config.cumulativeDetails.type
      }
    };
  }

  // TODO :  add check based on enable fn
  saveFn() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.enableTepDiscountRecovery) {
        if (this.tepRecoveryConfigComponent.checkValidation()) {
          this.config = {
            ...this.config,
            tepDetails: {
              data: {
                tepDetails: this.tepRecoveryConfigComponent.save().all,
                isEnabled: this.enableTepDiscountRecovery
              },
              type: this.config.tepDetails.type
            }
          };
          this.config.basicCriteria.data.isTepRecovery;
        } else {
          return;
        }
      } else {
        this.config = {
          ...this.config,
          tepDetails: {
            data: {
              tepDetails: [],
              isEnabled: this.enableTepDiscountRecovery
            },
            type: this.config.tepDetails.type
          }
        };

        this.config = {
          ...this.config,
          basicCriteria: {
            ...this.config.basicCriteria,
            data: {
              ...this.config.basicCriteria.data,
              isTepRecovery: this.enableTepDiscountRecovery
            }
          }
        };
      }
      if (
        this.enableClubbingDiscountOption() &&
        !this.checkClubbingOfferData()
      ) {
        this.showClubbingOfferDataError();
        return;
      }

      if (
        this.enableTepDiscountRecovery &&
        this.config.tepDetails.data.tepDetails.length === 0
      ) {
        this.showTEPConfigErrorPopUp();
        return;
      }

      if (this.enableGrnConfig() && !this.grnConfigComponent?.isValid()) {
        this.showGrnConfigErrorPopUp();
        return;
      }

      if (this.enableAbCoConfig() && !this.abCoConfigComponent?.isValid()) {
        this.showAbCoConfigErrorPopUp();
        return;
      } else {
        if (!this.enableApplicableForAutomatedDiscountOption()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                ...this.config.basicCriteria.data,
                isApplicableForAutomatedDiscount: null
              },
              type: this.config.basicCriteria.type
            }
          };
        }

        if (!this.enableFullValueTEPDiscountRecoveryOption()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                ...this.config.basicCriteria.data,
                isFullValueTepDiscountRecovery: null
              },
              type: this.config.basicCriteria.type
            }
          };
        }

        if (!this.enableConiConfig()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                ...this.config.basicCriteria.data,
                coinConfig: null
              },
              type: this.config.basicCriteria.type
            }
          };
        }
        if (!this.enableTataEmployeeConfig()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                ...this.config.basicCriteria.data,
                tataEmployeeConfig: null
              },
              type: this.config.basicCriteria.type
            }
          };
        }
        if (this.isTataEmployeeDiscount()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                isNarationMandatory: this.config.basicCriteria.data
                  .isNarationMandatory,
                isEditable: this.config.basicCriteria.data.isEditable,
                maxDiscount: this.config.basicCriteria.data.maxDiscount,
                maxCount: this.config.basicCriteria.data.tataEmployeeConfig
                  .maxCount,
                isTepRecovery: this.config.basicCriteria.data.isTepRecovery,
                isFullValueTepDiscountRecovery: this.config.basicCriteria.data
                  .isFullValueTepDiscountRecovery,
                isUploadMandatory: this.config.basicCriteria.data
                  .tataEmployeeConfig.uploadMandatory,
                isNameMandatory: this.config.basicCriteria.data
                  .tataEmployeeConfig.employeeNameMandatory
              },
              type: DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT
            }
          };
        }
        if (this.enableUCPValue()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                isNarationMandatory: this.config.basicCriteria.data
                  .isNarationMandatory,
                isEditable: this.config.basicCriteria.data.isEditable,
                maxDiscount: this.config.basicCriteria.data.maxDiscount,
                isTepRecovery: this.config.basicCriteria.data.isTepRecovery,
                isFullValueTepDiscountRecovery: this.config.basicCriteria.data
                  .isFullValueTepDiscountRecovery,
                ucpValue: this.config.basicCriteria.data.ucp.value,
                isBillValue: this.config.basicCriteria.data.ucp.isValue
              },
              type: this.config.basicCriteria.type
            }
          };
        }
        if (this.isEmployeeDiscount()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                isNarationMandatory: this.config.basicCriteria.data
                  .isNarationMandatory,
                isEditable: this.config.basicCriteria.data.isEditable,
                maxDiscount: this.config.basicCriteria.data.maxDiscount,
                isTepRecovery: this.config.basicCriteria.data.isTepRecovery,
                isFullValueTepDiscountRecovery: this.config.basicCriteria.data
                  .isFullValueTepDiscountRecovery,
                startingSerialNo: this.config.basicCriteria.data
                  .startingSerialNo
              },
              type: this.selectedDiscount
            }
          };
        }

        if (this.isCoinOfferDiscount()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                isNarationMandatory: this.config.basicCriteria.data
                  .isNarationMandatory,
                isEditable: this.config.basicCriteria.data.isEditable,
                maxDiscount: this.config.basicCriteria.data.maxDiscount,
                isTepRecovery: this.config.basicCriteria.data.isTepRecovery,
                isFullValueTepDiscountRecovery: this.config.basicCriteria.data
                  .isFullValueTepDiscountRecovery,
                coinPurchaseStartDate: this.config.basicCriteria.data.coinConfig
                  .coinPurchasePeriod.from,
                coinPurchaseEndDate: this.config.basicCriteria.data.coinConfig
                  .coinPurchasePeriod.to,
                tepPeriodStartDate: this.config.basicCriteria.data.coinConfig
                  .tepPeriod.from,
                tepPeriodEndDate: this.config.basicCriteria.data.coinConfig
                  .tepPeriod.to,
                tepCNUtilizationPercent: this.config.basicCriteria.data
                  .coinConfig.tepCNPercentage,
                mCPercent: this.config.basicCriteria.data.coinConfig
                  .makingChargePercentage
              },
              type: this.selectedDiscount
            }
          };
        }
        if (!this.enableSerialNoOption()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                ...this.config.basicCriteria.data,
                startingSerialNo: null
              },
              type: this.config.basicCriteria.type
            }
          };
        }

        if (!this.enableStoreEditOption()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                ...this.config.basicCriteria.data,
                isEditable: null
              },
              type: this.config.basicCriteria.type
            }
          };
        }

        if (!this.enableNarrationOption()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                ...this.config.basicCriteria.data,
                isNarationMandatory: null
              },
              type: this.config.basicCriteria.type
            }
          };
        }

        if (!this.enableMultipleTransactionPerDayOption()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                ...this.config.basicCriteria.data,
                isMultipleTransactionPerDayAllowed: null,
                maxTransactionPerDay: null
              },
              type: this.config.basicCriteria.type
            }
          };
        }

        if (!this.enableUCPValue()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                ...this.config.basicCriteria.data,
                isBillValue: null,
                ucpValue: null
              },
              type: this.config.basicCriteria.type
            }
          };
        }

        if (!this.enableMinKaratageEligibleForGEP()) {
          this.config = {
            ...this.config,
            basicCriteria: {
              data: {
                ...this.config.basicCriteria.data,
                minKarateEligibleForGEP: null
              },
              type: this.config.basicCriteria.type
            }
          };
        }

        if (!this.enableDaysOptionOfGRN()) {
          this.config = {
            ...this.config,
            grnDetails: {
              data: {
                ...this.config.grnDetails?.data,
                noOfDaysAfterOfferPeriod: null
              },
              type: this.config.grnDetails?.type
            }
          };
        }

        if (!this.enableDaysOptionOfInvoice()) {
          this.config = {
            ...this.config,
            grnDetails: {
              data: {
                ...this.config.grnDetails.data,
                daysAfterInvoice: null
              },
              type: this.config.grnDetails.type
            }
          };
        }

        if (!this.enableAllowedForGRNBeforeOfferPeriodOption()) {
          this.config = {
            ...this.config,
            grnDetails: {
              data: {
                ...this.config.grnDetails.data,
                isAllowedBeforeOffer: false
              },
              type: this.config.grnDetails.type
            }
          };
        }

        if (!this.enableGRNSameCFAEligibleOption()) {
          this.config = {
            ...this.config,
            grnDetails: {
              data: {
                ...this.config.grnDetails.data,
                isSameCfaEligible: false
              },
              type: this.config.grnDetails.type
            }
          };
        }

        if (!this.enableGrnConfig()) {
          this.config = {
            ...this.config,
            grnDetails: null
          };
        }

        if (!this.enableCumulativeDiscountConfig()) {
          this.config = {
            ...this.config,
            cumulativeDetails: null
          };
        }

        if (!this.enableClubbingOffersOption()) {
          this.config = {
            ...this.config,
            clubOtherOffersConfig: null
          };
        }

        if (!this.enableClubbingDiscountOption()) {
          this.config = {
            ...this.config,
            clubDiscountType: null
          };
        }

        if (!this.enableAbCoConfig()) {
          this.config = {
            ...this.config,
            abCoData: null
          };
        }

        this.save.emit(this.config);
      }
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

  checkClubbingOfferData(): boolean {
    console.log(
      'Is valid ? ',
      this.clubbingOffersComponent?.checkClubbingOfferData()
    );
    return this.clubbingOffersComponent?.checkClubbingOfferData();
  }
  showClubbingOfferDataError() {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: 'pw.discountApplicable.clubbingOfferDataError'
    });
  }
  showTEPConfigErrorPopUp() {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: 'pw.discountApplicable.tepConfigErrorMsg'
    });
  }

  showGrnConfigErrorPopUp() {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: 'pw.discountApplicable.grnConfigErrorMsg'
    });
  }

  showAbCoConfigErrorPopUp() {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: 'pw.discountApplicable.abCoConfigErrorMsg'
    });
  }

  formDirtyCheck(event) {
    this.formDirty.emit(event);
  }
  basicDiscountsValidCheck(event) {
    this.basicDiscountsInvalid = event;
  }
  clubOtherOfferDisountsValidCheck(event) {
    this.clubOtherDiscountsInvalid = event;
  }
  clubDisountsValidCheck(event) {
    this.clubDiscountsInvalid = event;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
