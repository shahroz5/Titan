import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ProductTypesEnum,
  RequestTypeEnum,
  SchemeCategoryEnum,
  SchemeNameEnum
} from '@poss-web/shared/models';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailsComponent
  implements ICellRendererAngularComp, OnDestroy {
  itemCode: string;
  binCode: string;
  totalQuantity: number;
  karatage: string;
  params: any;
  productTypesEnumRef = ProductTypesEnum;
  destroy$: Subject<null> = new Subject<null>();
  descriptionValues = null;
  descriptionCode = null;
  isCOMOrder = false;
  requestTypeEnumRef = RequestTypeEnum;

  constructor(public dialog: MatDialog) {}

  agInit(params: any) {
    this.params = params;
    this.isCOMOrder = params.data?.isCOMOrder ? params.data?.isCOMOrder : false;
    this.itemCode = params.data?.itemCode;
    this.binCode = params.data?.binCode;
    this.descriptionCode = `${params.data?.productGroup}`;
    this.totalQuantity = params.data?.totalQuantity;
    this.karatage = params.data?.karatage;

    this.params.context?.componentParent?.pgDescEvent
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) this.descriptionValues = data;
      });
  }

  showPopup(itemCode): void {
    this.params.context?.componentParent?.loadImageUrl?.emit(itemCode);
  }

  refresh(): boolean {
    return true;
  }

  getSchemeCategoryToDisplay(schemeCategory) {
    if (schemeCategory === SchemeCategoryEnum.WEIGHT_BASED) {
      return 'pw.productGrid.weightBasedLabel';
    } else if (schemeCategory === SchemeCategoryEnum.VALUE_BASED) {
      return 'pw.productGrid.valueBasedLabel';
    }
    return schemeCategory;
  }

  getSchemeNameToDisplay(schemeName) {
    if (schemeName === SchemeNameEnum.FOC_BLOCKING_FOR_CUSTOMER) {
      return 'pw.productGrid.focCustomerLevelLabel';
    } else if (schemeName === SchemeNameEnum.FOC_BLOCKING_FOR_STORE) {
      return 'pw.productGrid.focStoreLevelLabel';
    }
    return schemeName;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
