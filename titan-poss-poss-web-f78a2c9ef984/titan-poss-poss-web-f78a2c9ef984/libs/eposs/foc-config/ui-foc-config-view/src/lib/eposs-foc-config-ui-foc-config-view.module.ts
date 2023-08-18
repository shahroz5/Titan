import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { FocConfigViewComponent } from './foc-config-view.component';
import { SchemeConfigViewComponent } from './scheme-config-view/scheme-config-view.component';
import { ClubbingOtherOfferViewComponent } from './clubbing-other-offer-view/clubbing-other-offer-view.component';
import { GrnConfigurationViewComponent } from './grn-configuration-view/grn-configuration-view.component';
import { TepDiscountRecoveryViewComponent } from './tep-discount-recovery-view/tep-discount-recovery-view.component';
import { AbcoConfigurationViewComponent } from './abco-configuration-view/abco-configuration-view.component';
import { SchemeDetailsViewComponent } from './scheme-details-view/scheme-details-view.component';
import { ValueGoldStandardViewComponent } from './value-gold-standard-view/value-gold-standard-view.component';
import { ValueOtherStandardViewComponent } from './value-other-standard-view/value-other-standard-view.component';
import { ValueGoldSlabViewComponent } from './value-gold-slab-view/value-gold-slab-view.component';
import { ValueOtherSlabViewComponent } from './value-other-slab-view/value-other-slab-view.component';
import { WeightGoldStandardViewComponent } from './weight-gold-standard-view/weight-gold-standard-view.component';
import { WeightOtherStandardViewComponent } from './weight-other-standard-view/weight-other-standard-view.component';
import { WeightGoldSlabViewComponent } from './weight-gold-slab-view/weight-gold-slab-view.component';
import { WeightOtherSlabViewComponent } from './weight-other-slab-view/weight-other-slab-view.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    FocConfigViewComponent,
    SchemeConfigViewComponent,
    ClubbingOtherOfferViewComponent,
    GrnConfigurationViewComponent,
    TepDiscountRecoveryViewComponent,
    AbcoConfigurationViewComponent,
    SchemeDetailsViewComponent,
    ValueGoldStandardViewComponent,
    ValueOtherStandardViewComponent,
    ValueGoldSlabViewComponent,
    ValueOtherSlabViewComponent,
    WeightGoldStandardViewComponent,
    WeightOtherStandardViewComponent,
    WeightGoldSlabViewComponent,
    WeightOtherSlabViewComponent
  ],
  exports: [FocConfigViewComponent]
})
export class EpossFocConfigUiFocConfigViewModule {}
