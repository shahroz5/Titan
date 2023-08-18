import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { BoutiqueBankDepositListingComponent } from './boutique-bank-deposit-listing/boutique-bank-deposit-listing.component';
import { SharedBoutiqueBankDepositUiBoutiqueBankDepositItemsModule } from '@poss-web/shared/boutique-bank-deposit/ui-boutique-bank-deposit-items';
import { SharedBoutiqueBankDepositDataAccessBoutiqueBankDepositModule } from '@poss-web/shared/boutique-bank-deposit/data-access-boutique-bank-deposit';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedComponentsUiErrorGridPopupModule } from '@poss-web/shared/components/ui-error-grid-popup';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
const routes: Routes = [
  {
    path: '',
    component: BoutiqueBankDepositListingComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedBoutiqueBankDepositUiBoutiqueBankDepositItemsModule,
    SharedComponentsUiLoaderModule,
    SharedBoutiqueBankDepositDataAccessBoutiqueBankDepositModule,
    SharedComponentsUiFormattersModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedCustomerDataAccessCustomerModule,
    SharedComponentsUiErrorGridPopupModule,
    SharedComponentsUiSortDialogModule
  ],
  declarations: [BoutiqueBankDepositListingComponent],
  exports: [BoutiqueBankDepositListingComponent]
})
export class SharedBoutiqueBankDepositFeatureBoutiqueBankDepositListingModule {}
