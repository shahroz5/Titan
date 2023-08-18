import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiscountTypeEnum } from '@poss-web/shared/models';
import * as moment from 'moment';
@Component({
  selector: 'poss-web-discount-header-details-view',
  templateUrl: './discount-header-details-view.component.html'
})
export class DiscountHeaderDetailsViewComponent implements OnInit {
  @Input() discountTypes;
  @Input() applicableLevels;
  @Input() subBrands;
  @Input() brands;
  @Input() discountDetails;
  @Input() disable;
  @Input() isLocationData;
  @Input() isCategoryPgData;
  @Input() isSlabData;
  selectedDiscount: DiscountTypeEnum = DiscountTypeEnum.CATEGORY_DISCOUNT;
  @Output() discountSelected = new EventEmitter<any>();
  @Output() faqFileDownload = new EventEmitter<any>();

  fileName = 'View FAQ Document';
  previewHeader = 'FAQ Document';
  enableClose = false;

  ngOnInit(): void {
    console.log('abc');
    this.selectedDiscount = this.discountDetails.discountType
      ? this.discountDetails.discountType
      : this.selectedDiscount;
  }

  downloadPreviewDocument(event) {
    if (event) {
      this.faqFileDownload.emit(
        this.discountDetails?.workflowFileUploadDetails?.data
      );
    }
  }
  // getBrand(code) {
  //   console.log('abc', this.brands);

  //   return this.brands.filter(brand => brand.code === code)[0].description;
  // }
  // getSubBrand(code) {
  //   console.log('abc', this.subBrands);
  //   return this.brands.filter(subBrand => subBrand.code === code)[0]
  //     .description;
  // }
  enableRiva() {
    return (
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BEST_DEAL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.HIGH_VALUE_DISCOUNT
    );
  }
  enableAbCoConfig() {
    return (
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT
    );
  }
  enablePreviewAvailable() {
    return (
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT
    );
  }
  enableAccuralEncircle() {
    return (
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.ULP_BIRTHDAY ||
      this.selectedDiscount === DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY ||
      this.selectedDiscount === DiscountTypeEnum.ULP_ANNIVERSARY ||
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.COIN_OFFER_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BEST_DEAL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EMPOWERMENT_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.SYSTEM_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.TSSS_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EMPLOYEE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BILL_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
    );
  }
  enableApplicableEncircle() {
    return (
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BEST_DEAL_DISCOUNT
    );
  }
  enableApplicableLevel() {
    return (
      this.selectedDiscount === DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.ULP_BIRTHDAY ||
      this.selectedDiscount === DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY ||
      this.selectedDiscount === DiscountTypeEnum.ULP_ANNIVERSARY ||
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BILL_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EMPLOYEE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.TSSS_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BEST_DEAL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EMPOWERMENT_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.COIN_OFFER_DISCOUNT
    );
  }
  dateFormatting(date) {
    return moment(Number(date));
  }
}
