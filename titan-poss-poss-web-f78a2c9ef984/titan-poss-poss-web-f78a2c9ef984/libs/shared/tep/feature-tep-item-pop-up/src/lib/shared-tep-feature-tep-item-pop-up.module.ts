import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { TepItemPopUpComponent } from './tep-item-pop-up/tep-item-pop-up.component';
import { TepItemPopUpService } from './tep-item-pop-up.service';
import { TepItemPopUpServiceAbstraction } from '@poss-web/shared/models';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedTepDataAccessDirectTepModule } from '@poss-web/shared/tep/data-access-direct-tep';
import { SharedTepUiCmTepItemListGridModule } from '@poss-web/shared/tep/ui-cm-tep-item-list-grid';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedTepUiTepStoneDetailsListGridModule } from '@poss-web/shared/tep/ui-tep-stone-details-list-grid';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedTepDataAccessDirectTepModule,
    SharedTepUiCmTepItemListGridModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiFormattersModule,
    SharedTepUiTepStoneDetailsListGridModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [TepItemPopUpComponent],
  entryComponents: [TepItemPopUpComponent],
  providers: [
    {
      provide: TepItemPopUpServiceAbstraction,
      useClass: TepItemPopUpService
    }
  ]
})
export class SharedTepFeatureTepItemPopUpModule {}
