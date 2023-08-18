import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignatureComponent } from './digital-signature.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiSignaturePadModule } from '@poss-web/shared/components/ui-signature-pad';
import { RouterModule } from '@angular/router';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { TermsCondtionComponent } from './terms-condtion/terms-condtion.component';
import { PossDigitalSignatureDataAccessDigitalSignatureModule } from '@poss-web/poss/digital-signature/data-access-digital-signature';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
import { GepDeclarationFormTemplateComponent } from './gep-declaration-form-template/gep-declaration-form-template.component';
import { TepDeclarationFormTemplateComponent } from './tep-declaration-form-template/tep-declaration-form-template.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

const route = [
  { path: '', component: DigitalSignatureComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(route),
    SharedComponentsUiSignaturePadModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    PossDigitalSignatureDataAccessDigitalSignatureModule,
    SharedComponentsUiFileUploadModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    DigitalSignatureComponent,
    TermsCondtionComponent,
    GepDeclarationFormTemplateComponent,
    TepDeclarationFormTemplateComponent
  ],
  entryComponents: [
    TermsCondtionComponent,
    GepDeclarationFormTemplateComponent,
    TepDeclarationFormTemplateComponent
  ]
})
export class PossDigitalSignatureFeatureDigitalSignatureModule {}
