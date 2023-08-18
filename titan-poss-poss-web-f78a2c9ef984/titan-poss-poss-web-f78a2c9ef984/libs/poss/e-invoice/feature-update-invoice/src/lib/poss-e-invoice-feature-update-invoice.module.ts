import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { UpdateInvoiceComponent } from './update-invoice/update-invoice.component';
import { PossEInvoiceUiUpdateInvoiceModule } from '@poss-web/poss/e-invoice/ui-update-invoice';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

const routes: Routes = [
  {
    path: '',
    component: UpdateInvoiceComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    PossEInvoiceUiUpdateInvoiceModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiLoaderModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [UpdateInvoiceComponent]
})
export class PossEInvoiceFeatureUpdateInvoiceModule {}
