import { NgModule } from '@angular/core';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicInputComponent } from './components/dynamic-input/dynamic-input.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import {
  DialogDateTimePicker,
  DatetimePickerComponent
} from './components/datetime-picker/datetime-picker.component';
import { ValidationErrorsComponent } from './components/validation-errors/validation-errors.component';
import { ObjIteratorPipe } from './pipes/obj-iterator.pipe';
import { NonsubformfilterPipe } from './pipes/nonsubformfilter.pipe';
import { SubformfilterPipe } from './pipes/subformfilter.pipe';
import {
  DialogDatePicker,
  DatePickerComponent
} from './components/date-picker/date-picker.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { HelperFunctions } from './helper/helperFunctions';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { Template5Component } from './components/templates/template5/template5.component';
import { Template19Component } from './components/templates/template19/template19.component';
import { Template6Component } from './components/templates/template6/template6.component';
import { Template7Component } from './components/templates/template7/template7.component';
import { Template8Component } from './components/templates/template8/template8.component';
import { Template9Component } from './components/templates/template9/template9.component';
import { Template10Component } from './components/templates/template10/template10.component';
import { Template12Component } from './components/templates/template12/template12.component';
import { Template15Component } from './components/templates/template15/template15.component';
import { Template16Component } from './components/templates/template16/template16.component';
import { Template17Component } from './components/templates/template17/template17.component';
import { Template18Component } from './components/templates/template18/template18.component';

@NgModule({
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [
    DynamicFormComponent,
    DynamicInputComponent,
    DialogDateTimePicker,
    ErrorMessageComponent,
    ValidationErrorsComponent,
    ObjIteratorPipe,
    DatetimePickerComponent,
    NonsubformfilterPipe,
    SubformfilterPipe,
    DialogDatePicker,
    DatePickerComponent,
    Template5Component,
    Template19Component,
    Template6Component,
    Template7Component,
    Template8Component,
    Template9Component,
    Template10Component,
    Template12Component,
    Template15Component,
    Template16Component,
    Template17Component,
    Template18Component
  ],
  exports: [
    DynamicFormComponent,
    DynamicInputComponent,
    DialogDateTimePicker,
    DialogDatePicker,
    ErrorMessageComponent,
    ValidationErrorsComponent,
    ObjIteratorPipe,
    DatetimePickerComponent,
    DatePickerComponent,
    NonsubformfilterPipe,
    SubformfilterPipe
  ],
  entryComponents: [DialogDateTimePicker, DialogDatePicker],
  providers: [
    HelperFunctions,
    FieldValidatorsService,
    TranslateService,
    SelectionDialogService
  ]
})
export class SharedComponentsUiDynamicFormModule {}
