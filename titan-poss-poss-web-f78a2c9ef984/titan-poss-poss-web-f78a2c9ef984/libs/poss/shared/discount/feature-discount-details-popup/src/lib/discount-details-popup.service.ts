import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiscountDetailsPopupComponent } from './discount-details-popup.component';
import { Observable } from 'rxjs';
import {
  DiscountDetailsPopupServiceAbstraction,
  DiscountPopupAbstractionPayload
} from '@poss-web/shared/models';
@Injectable({
  providedIn: 'root'
})


export class DiscountDetailsPopupService
  implements DiscountDetailsPopupServiceAbstraction {
  constructor(private dialog: MatDialog) {}

  open(payload: DiscountPopupAbstractionPayload): Observable<any> {
    console.log('discountDetails in service', payload);
    const dialogRef = this.dialog.open(DiscountDetailsPopupComponent, {
      autoFocus: false,
      width: '80vw',
      data: payload,
      // data: {
      //   headerDetails: {
      //     showTitle: true,
      //     itemCode: discountDetails.itemDetails.itemCode,
      //     lotNumber: discountDetails.itemDetails.lotNumber,
      //     productGroup:  discountDetails.itemDetails.productGroupCode,
      //     productCategory:  discountDetails.itemDetails.productCategoryCode,
      //     grossWeight: discountDetails.itemDetails.totalWeight,
      //     goldRate: {
      //       karat: 22,
      //       price: 2334
      //     },
      //     netWeight: 12.2
      //   },
      //   itemDetails: {
      //     itemCode: string;
      //     lotNumber: string;
      //   };
      //   transactionDetails: {
      //     transactionType: TransactionTypeEnum;
      //   };
      //   itemData: any;
      //   currencyCode: 'INR',
      //   weightUnit: 'gms'
      // },

      disableClose: true
    });

    return dialogRef.afterClosed();
  }
}
