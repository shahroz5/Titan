import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CFAProductsResponse } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
@Component({
  selector: 'poss-web-cfa-product-code-item',
  templateUrl: './cfa-product-code-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CfaProductCodeItemComponent implements OnInit, OnChanges {
  @Input() CFAProductCodeItem: CFAProductsResponse;
  @Input() permissions$: Observable<any[]>;
  @Output() productGroupCode = new EventEmitter<string>();
  @Output() isActive = new EventEmitter<{
    isActive: boolean;
    CFAProductCode: string;
  }>();
  @Output() viewProductCodeDetails = new EventEmitter<string>();
  active: boolean;
  VIEW_PRODUCT_GROUP_PERMISSIONS =
    'ProductGroup Master - View ProductGroup Master';
  ADD_EDIT_PRODUCT_GROUP_PERMISSIONS =
    'ProductGroup Master - Add/Edit ProductGroup Master';
  constructor(private elementPermission: ElementPermissionService) {}

  ngOnInit() {
    this.permissions$.subscribe(val => {
      console.log('val', val);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.active = this.CFAProductCodeItem.isActive;
  }
  edit(productGroupCode) {
    this.productGroupCode.emit(productGroupCode);
  }
  openViewPage(productGroupCode) {
    this.viewProductCodeDetails.emit(productGroupCode);
  }
  changeEvent(isActive: boolean) {
    this.active = isActive;
    this.isActive.emit({
      isActive: isActive,
      CFAProductCode: this.CFAProductCodeItem.productGroupCode
    });
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
