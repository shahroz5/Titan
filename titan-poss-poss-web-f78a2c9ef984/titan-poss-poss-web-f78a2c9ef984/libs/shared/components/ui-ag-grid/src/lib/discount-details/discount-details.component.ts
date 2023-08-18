import { Component } from '@angular/core';
import {
  DiscountTypeEnum,
  ProductTypesEnum
} from '@poss-web/shared/models';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-discount-details',
  templateUrl: './discount-details.component.html'
})
export class DiscountDetailsComponent implements ICellRendererAngularComp {
  discountName: string;
  sampleDiscountName = 'Studded Discount';
  discountCount = 0;
  discountValue = 0;
  params: any;
  productTypesEnumRef = ProductTypesEnum;


  agInit(params: any) {
    // console.log('params', params);

    this.params = params;
    //rivaah is add on discount so it should filtered
    const discountData = params?.data?.selectedDiscounts?.filter(x => {
      return x.discountType !== DiscountTypeEnum.RIVAAH_CARD_DISCOUNT;
    });
    this.discountName = '';
    if (discountData && discountData.length !== 0) {
      discountData.forEach(element => {
        this.discountName =
          this.discountName +
          (this.discountName !== '' ? ' | ' : '') +
          element.discountAttributes.occasion;
        // console.log('discountData', this.discountName);
      });
      this.discountCount = discountData.length;
    }
    this.discountValue = params?.data?.discount;

    // this.discountName =
    //   params?.data?.selectedDiscounts[0]?.discountAttributes.occasion;
    // if (params.data.discount !== 0) {
    //   this.discountCount = params.data.discount.length;
    // this.discountName = params.data.discount[0].applicableDiscounts;
    // } else {
    // this.discountName = this.sampleDiscountName;
    //   this.discountCount = 0;
    // }
  }

  refresh(): boolean {
    return true;
  }
}
