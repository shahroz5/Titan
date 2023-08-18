import { Component } from '@angular/core';
import { DiscountClubTypeEnum } from '@poss-web/shared/models';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-discount-header',
  templateUrl: './discount-header.component.html',
  styleUrls: ['./discount-header.component.scss']
})
export class DiscountHeaderComponent implements ICellRendererAngularComp {
  clubbingDiscountType: string;
  discountDescription: string;
  params: any;


  agInit(params: any) {
    this.fetchData(params);
  }

  refresh(params: any): boolean {
    this.fetchData(params);
    return true;
  }

  fetchData(params) {
    this.clubbingDiscountType = params.data.clubbingDiscountType;
    this.discountDescription = params.data.discountDescription;
    if (this.clubbingDiscountType === DiscountClubTypeEnum.TYPE_1) {
      this.clubbingDiscountType = 'Type 1';
    } else if (this.clubbingDiscountType === DiscountClubTypeEnum.TYPE_2) {
      this.clubbingDiscountType = 'Type 2';
    } else if (this.clubbingDiscountType === DiscountClubTypeEnum.TYPE_3) {
      this.clubbingDiscountType = 'Type 3';
    }
  }
}
