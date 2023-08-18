import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedFileUploadUiFileMultiUploadModule } from '@poss-web/shared/file-upload/ui-file-multi-upload';
import { CnTransferDetailsComponent } from './cn-transfer-details/cn-transfer-details.component';
import { PossCnTransferDataAccessCnTransferModule } from '@poss-web/poss/cn-transfer/data-access-cn-transfer';
import { PossCnTransferUiCnTransferDetailsModule } from '@poss-web/poss/cn-transfer/ui-cn-transfer-details';
import { PossCreditNoteDataAccessCnModule } from '@poss-web/poss/credit-note/data-access-cn';

@NgModule({
  imports: [
    CommonModule,
    PossCnTransferDataAccessCnTransferModule,
    PossCnTransferUiCnTransferDetailsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule,
    SharedFileUploadUiFileMultiUploadModule,
    PossCreditNoteDataAccessCnModule
  ],
  declarations: [CnTransferDetailsComponent],
  exports: [CnTransferDetailsComponent]
})
export class PossCnTransferFeatureCnTransferDetailsModule {}
