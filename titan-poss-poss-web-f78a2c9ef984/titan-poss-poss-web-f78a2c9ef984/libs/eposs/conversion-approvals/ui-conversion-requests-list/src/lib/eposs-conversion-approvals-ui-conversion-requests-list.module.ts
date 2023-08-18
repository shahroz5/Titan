import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { ConversionRequestsListComponent } from './conversion-requests-list/conversion-requests-list.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiCardListModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [ConversionRequestsListComponent],
  exports: [ConversionRequestsListComponent]
})
export class EpossConversionApprovalsUiConversionRequestsListModule {}
