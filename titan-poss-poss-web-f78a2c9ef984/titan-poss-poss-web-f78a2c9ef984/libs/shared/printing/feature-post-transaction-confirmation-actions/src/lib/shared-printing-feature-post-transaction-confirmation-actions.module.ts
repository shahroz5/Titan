import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostTransactionConfirmationActionsPopUpComponent } from './post-transaction-confirmation-actions-pop-up/post-transaction-confirmation-actions-pop-up.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PostTransactionConfirmationActionsServiceAbstraction } from '@poss-web/shared/models';
import { PostTransactionConfirmationActionsService } from './post-transaction-confirmation-actions.service';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [PostTransactionConfirmationActionsPopUpComponent],
  entryComponents: [PostTransactionConfirmationActionsPopUpComponent],
  providers: [
    {
      provide: PostTransactionConfirmationActionsServiceAbstraction,
      useClass: PostTransactionConfirmationActionsService
    }
  ]
})
export class SharedPrintingFeaturePostTransactionConfirmationActionsModule {}
