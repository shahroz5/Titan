import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  BasicDiscountCategoryConfig,
  DiscountTypeEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-basic-discount-category-view',
  templateUrl: './basic-discount-category-view.component.html'
})
export class BasicDiscountCategoryViewComponent implements OnInit {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() config: BasicDiscountCategoryConfig;
  @Input() currencyCode: string;
  @Input() enableAccuralOption: boolean;
  @Input() enableUCPValue: boolean;
  @Input() enableMultipleTransactionPerDayOption: boolean;
  @Input() enableStoreEditOption: boolean;
  @Input() enableNarrationOption: boolean;
  @Input() enableMaxCapOption: boolean;
  @Input() enableSerialNoOption: boolean;
  @Input() enableTataEmployeeConfig: boolean;
  @Input() enableConiConfig: boolean;
  @Input() enableApplicableForAutomatedDiscountOption: boolean;
  @Input() enableFullValueTEPDiscountRecoveryOption: boolean;
  form: FormGroup;

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.form = new FormGroup({
      // maxDiscount: new FormControl(
      //   this.config && this.config.maxDiscount ? this.config.maxDiscount : null
      // ),
      isNarationMandatory: new FormControl(
        this.config && this.config.isNarationMandatory
          ? this.config.isNarationMandatory
          : false
      ),
      isEditable: new FormControl(
        this.config && this.config.isEditable ? this.config.isEditable : false
      ),
      isTepRecovery: new FormControl(
        this.config && this.config.isTepRecovery
          ? this.config.isTepRecovery
          : false
      ),
      isMultipleTransactionPerDayAllowed: new FormControl(
        this.config && this.config.isMultipleTransactionPerDayAllowed
          ? this.config.isMultipleTransactionPerDayAllowed
          : false
      ),

      // TODO: Add custom validator based on isMultipleTransactionPerDayAllowed
      maxTransactionPerDay: new FormControl(
        this.config && this.config.maxTransactionPerDay
          ? this.config.maxTransactionPerDay
          : null
      ),

      isUcpValue: new FormControl(
        this.config && this.config.ucp && this.config.ucp.isValue
          ? this.config.ucp.isValue
          : false
      ),
      // TODO: Add custom validator based on isUcpValue

      ucpValue: new FormControl(
        this.config && this.config.ucp && this.config.ucp?.isValue === true
          ? this.config.ucp?.value
          : null
      ),
      // TODO: Add custom validator based on isUcpValue

      ucpPercentage: new FormControl(
        this.config && this.config.ucp && this.config.ucp?.isValue === false
          ? this.config.ucp?.value
          : null
      ),

      serialNoStartsFrom: new FormControl(
        this.config && this.config.startingSerialNo
          ? this.config.startingSerialNo
          : null
      ),

      maxCount: new FormControl(
        this.config &&
        this.config.tataEmployeeConfig &&
        this.config.tataEmployeeConfig.maxCount
          ? this.config.tataEmployeeConfig.maxCount
          : null
      ),

      tepCNPercentage: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.tepCNPercentage
          ? this.config.coinConfig.tepCNPercentage
          : null
      ),

      makingChargePercentage: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.makingChargePercentage
          ? this.config.coinConfig.makingChargePercentage
          : null
      ),

      coinPurchasePeriodFrom: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.coinPurchasePeriod &&
        this.config.coinConfig.coinPurchasePeriod.from
          ? this.config.coinConfig.coinPurchasePeriod.from
          : null
      ),

      coinPurchasePeriodTo: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.coinPurchasePeriod &&
        this.config.coinConfig.coinPurchasePeriod.to
          ? this.config.coinConfig.coinPurchasePeriod.to
          : null
      ),

      tepPeriodFrom: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.tepPeriod &&
        this.config.coinConfig.tepPeriod.from
          ? this.config.coinConfig.tepPeriod.from
          : null
      ),

      tepPeriodTo: new FormControl(
        this.config &&
        this.config.coinConfig &&
        this.config.coinConfig.tepPeriod &&
        this.config.coinConfig.tepPeriod.to
          ? this.config.coinConfig.tepPeriod.to
          : null
      ),

      isFullValueTepDiscountRecovery: new FormControl(
        this.config && this.config.isFullValueTepDiscountRecovery
          ? this.config.isFullValueTepDiscountRecovery
          : false
      ),
      isApplicableForAutomatedDiscount: new FormControl(
        this.config && this.config.isApplicableForAutomatedDiscount
          ? this.config.isApplicableForAutomatedDiscount
          : false
      )
    });
  }
  formatter(date) {
    console.log('Date', date);
    if (date) {
      return moment(date);
    }
  }
}
