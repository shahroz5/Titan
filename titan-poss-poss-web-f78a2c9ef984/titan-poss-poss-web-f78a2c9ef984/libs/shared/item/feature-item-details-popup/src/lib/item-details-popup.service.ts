import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemDetailsPopupComponent } from './item-details-popup.component';
import { ItemDetailsPopupData, ItemDetailsPopupTabType } from '@poss-web/shared/models';
import { ItemDetailPopupserviceAbstraction } from '@poss-web/shared/models';

@Injectable()
export class ItemDetailPopupservice
  implements ItemDetailPopupserviceAbstraction {
  constructor(private dialog: MatDialog) {}

  open(itemData: ItemDetailsPopupData): Observable<any> {
    const dialogRef = this.dialog.open(ItemDetailsPopupComponent, {
      autoFocus: false,
      width: '80vw',
      data: itemData,
      disableClose : itemData.tabs?.includes(ItemDetailsPopupTabType.PRICE_DETAILS)
      
    });
    return dialogRef.afterClosed();
  }
}
