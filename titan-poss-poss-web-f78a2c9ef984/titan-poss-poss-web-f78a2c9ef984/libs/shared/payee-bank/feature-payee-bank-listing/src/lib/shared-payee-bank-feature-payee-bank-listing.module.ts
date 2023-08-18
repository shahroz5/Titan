import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayeeBankListingComponent } from './payee-bank-listing/payee-bank-listing.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPayeeBankUiPayeeBankListModule } from '@poss-web/shared/payee-bank/ui-payee-bank-list';
import { RouterModule } from '@angular/router';
import { SharedPayeeBankDataAccessPayeeBankModule } from '@poss-web/shared/payee-bank/data-access-payee-bank';
import { SharedPayeeBankUiPayeeBankDetailModule } from '@poss-web/shared/payee-bank/ui-payee-bank-detail';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

const route = [
  { path: '', component: PayeeBankListingComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPayeeBankUiPayeeBankListModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiDynamicFormModule,
    RouterModule.forChild(route),
    SharedPayeeBankDataAccessPayeeBankModule,
    SharedPayeeBankUiPayeeBankDetailModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [PayeeBankListingComponent]
})
export class SharedPayeeBankFeaturePayeeBankListingModule {}
