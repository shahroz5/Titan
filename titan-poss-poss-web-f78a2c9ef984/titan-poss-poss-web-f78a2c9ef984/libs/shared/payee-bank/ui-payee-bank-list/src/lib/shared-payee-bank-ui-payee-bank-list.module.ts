import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayeeBankItemsComponent } from './payee-bank-items/payee-bank-items.component';
import { PayeeBankListingItemsComponent } from './payee-bank-listing-items/payee-bank-listing-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [PayeeBankItemsComponent, PayeeBankListingItemsComponent],
  exports: [PayeeBankItemsComponent, PayeeBankListingItemsComponent]
})
export class SharedPayeeBankUiPayeeBankListModule {}
