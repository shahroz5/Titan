import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { CfaProductCodeItemsComponent } from './cfa-product-code-items/cfa-product-code-items.component';
import { CfaProductCodeItemComponent } from './cfa-product-code-item/cfa-product-code-item.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
@NgModule({
  declarations: [CfaProductCodeItemsComponent, CfaProductCodeItemComponent],
  exports: [CfaProductCodeItemsComponent, CfaProductCodeItemComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ]
})
export class SharedCfaProductUiCfaProductListModule {}
