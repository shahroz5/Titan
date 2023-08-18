import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcListComponent } from './bc-list/bc-list.component';
import { PossBcUiBcListModule } from '@poss-web/poss/bc/ui-bc-list';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossBcDataAccessBcModule } from '@poss-web/poss/bc/data-access-bc';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

@NgModule({
  imports: [
    CommonModule,
    PossBcUiBcListModule,
    CommonCustomMaterialModule,
    PossBcDataAccessBcModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [BcListComponent],
  exports: [BcListComponent]
})
export class PossBcFeatureBcListModule {}
