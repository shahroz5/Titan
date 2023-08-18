import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayerBankListComponent } from './payer-bank-list/payer-bank-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedPayerBankDataAccessPayerBankModule } from '@poss-web/shared/payer-bank/data-access-payer-bank';
import { SharedPayerBankUiPayerBankItemListModule } from '@poss-web/shared/payer-bank/ui-payer-bank-item-list';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFileuploadConfirmationPopupModule } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
const routes: Routes = [
  {
    path: '',
    component: PayerBankListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedPayerBankDataAccessPayerBankModule,
    SharedPayerBankUiPayerBankItemListModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFileuploadConfirmationPopupModule,
    SharedFileUploadDataAccessFileUploadModule
  ],
  declarations: [PayerBankListComponent]
})
export class SharedPayerBankFeaturePayerBankListModule {}
