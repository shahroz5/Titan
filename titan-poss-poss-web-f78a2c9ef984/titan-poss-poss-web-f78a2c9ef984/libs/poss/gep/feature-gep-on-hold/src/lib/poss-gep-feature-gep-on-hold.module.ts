import { PossGepDataAccessGepModule } from '@poss-web/poss/gep/data-access-gep';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GepOnHoldComponent } from './gep-on-hold/gep-on-hold.component';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule,
    CommonCustomMaterialModule,
    PossGepDataAccessGepModule,
    SharedCommonDataAccessCommonModule],
  declarations: [GepOnHoldComponent],
  exports:[GepOnHoldComponent]
})
export class PossGepFeatureGepOnHoldModule {}
