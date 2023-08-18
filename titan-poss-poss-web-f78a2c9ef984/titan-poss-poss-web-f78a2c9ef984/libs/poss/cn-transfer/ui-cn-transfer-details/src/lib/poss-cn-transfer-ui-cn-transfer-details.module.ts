import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SentRequestDetailsComponent } from './sent-request-details/sent-request-details.component';
import { SearchDetailsComponent } from './search-details/search-details.component';
import { ReceivedRequestDetailsComponent } from './received-request-details/received-request-details.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    SearchDetailsComponent,
    SentRequestDetailsComponent,
    ReceivedRequestDetailsComponent
  ],
  exports: [
    SearchDetailsComponent,
    SentRequestDetailsComponent,
    ReceivedRequestDetailsComponent
  ]
})
export class PossCnTransferUiCnTransferDetailsModule {}
