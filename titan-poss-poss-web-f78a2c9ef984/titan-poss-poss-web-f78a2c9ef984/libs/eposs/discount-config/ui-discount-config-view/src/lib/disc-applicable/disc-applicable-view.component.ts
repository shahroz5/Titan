import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DiscountTypeEnum } from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-disc-applicable-view',
  templateUrl: './disc-applicable-view.component.html'
})
export class DiscApplicableViewComponent implements OnInit, OnChanges {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() currencyCode: string;
  @Input() discountTypes: string[] = [];
  @Input() clubbingDiscountTypes;
  @Input() durations;
  @Input() isRiva: boolean;
  @Input() config: any;
  enableTepDiscountRecovery;
  destroy$ = new Subject();
  tepConfig: any[] = [
    {
      // id: 'ID',
      duration: 10,
      recoveryPercent: '20'
    }
  ];
  expanded = true;
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
    DiscountTypeEnum.BEST_DEAL_DISCOUNT,
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
  ];

  accuralOptionDiscounts = [DiscountTypeEnum.EMPOWERMENT_DISCOUNT];

  maxOptionDiscounts = [
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
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT
  ];
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
    DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
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

  multipleTransactionPerDayOptionDiscounts = [
    // DiscountTypeEnum.ULP_BIRTHDAY,
    // DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    // DiscountTypeEnum.ULP_ANNIVERSARY
  ];

  tataEmployeeConfigDiscounts = [DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT];

  serialNoOptionDiscounts = [
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT
  ];
  applicableForAutomatedDiscountOptionDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT,
    DiscountTypeEnum.BEST_DEAL_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT
  ];

  fullValueTEPDiscountRecoveryOptionDiscounts = [
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
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT,
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
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
  isGrnApplicableOptionDiscounts = [DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT];
  valid = true;
  clubDiscountsInvalid;
  basicDiscountsInvalid;
  constructor(private dialog: MatDialog, private translate: TranslateService) {}

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
  enableMaxCapOption() {
    return this.maxOptionDiscounts.includes(this.selectedDiscount);
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

  enableIsGRNApplicable() {
    return this.isGrnApplicableOptionDiscounts.includes(this.selectedDiscount);
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
  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
