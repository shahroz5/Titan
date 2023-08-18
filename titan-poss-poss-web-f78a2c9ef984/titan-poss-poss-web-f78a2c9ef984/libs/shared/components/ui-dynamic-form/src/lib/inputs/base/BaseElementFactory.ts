import { TextInput } from '../TextInput';
import { BaseElementParams } from './BaseElementParams';
import { TextAreaInput } from '../TextAreaInput';
import { SelectInput } from '../SelectInput';
import { MultiSelectInput } from '../MultiSelectInput';
import { CheckboxGroup } from '../CheckboxGroup';
import { RadioButtonGroup } from '../RadioButtonGroup';
import { DateTimePicker } from '../DateTimePicker';
import { DatePicker } from '../DatePicker';
import { OutlineInput } from '../OutlineInput';
import { FormFieldType } from '../../FormFieldType';
import { TextLabel } from '../TextLabel';
import { ToggleInput } from '../ToggleInput';
import { TextWeightInput } from '../TextWeightInput';
import { TextOutline } from '../TextOutline';
import { SelectionInput } from '../SelectionInput';
import { AmountInput } from '../AmountInput';
import { RefreshSelectInput } from '../RefreshSelectInput';

export class BaseElementFactory {
  public static build(
    className: string,
    fieldName: string,
    params: BaseElementParams
  ): any {
    let selectOptions: any;
    switch (className) {
      // case TextInput.name:
      //     return new TextInput(fieldName, params);
      // case CheckboxGroup.name:
      //     selectOptions = params.selectOptions.selectOptions;
      //     return new CheckboxGroup(fieldName, selectOptions, params);
      // case TextAreaInput.name:
      //     return new TextAreaInput(fieldName, params);
      // case SelectInput.name:
      //     params.value = params.selectOptions.value;
      //     selectOptions = params.selectOptions.selectOptions;
      //     return new SelectInput(fieldName, selectOptions, params);
      // case RadioButtonGroup.name:
      //     params.value = params.selectOptions.value;
      //     selectOptions = params.selectOptions.selectOptions;
      //     return new RadioButtonGroup(fieldName, selectOptions, params);
      // case DateTimePicker.name:
      //     return new DateTimePicker(fieldName, params);
      // case DatePicker.name:
      //     return new DatePicker(fieldName, params);
      // case OutlineInput.name:
      //     return new OutlineInput(fieldName, params);
      case FormFieldType.TEXT:
        return new TextInput(fieldName, params);
      case FormFieldType.AMOUNT:
        return new AmountInput(fieldName, params);
      case FormFieldType.TEXTWEIGHTINPUT:
        return new TextWeightInput(fieldName, params);
      case FormFieldType.CHECKBOX:
        selectOptions = params.selectOptions.selectOptions;
        return new CheckboxGroup(fieldName, selectOptions, params);
      case FormFieldType.TEXT_AREA:
        return new TextAreaInput(fieldName, params);
      case FormFieldType.SELECT:
        params.value = params.selectOptions.value;
        selectOptions = params.selectOptions.selectOptions;
        return new SelectInput(fieldName, selectOptions, params);
      case FormFieldType.REFRESH_SELECT:
        params.value = params.selectOptions.value;
        selectOptions = params.selectOptions.selectOptions;
        return new RefreshSelectInput(fieldName, selectOptions, params);
      case FormFieldType.MULTISELECT:
        params.value = params.selectOptions.value;
        selectOptions = params.selectOptions.selectOptions;
        return new MultiSelectInput(fieldName, selectOptions, params);
      case FormFieldType.RADIO:
        params.value = params.selectOptions.value;
        selectOptions = params.selectOptions.selectOptions;
        return new RadioButtonGroup(fieldName, selectOptions, params);
      case FormFieldType.DATE_TIME:
        return new DateTimePicker(fieldName, params);
      case FormFieldType.DATE:
        return new DatePicker(fieldName, params);
      case FormFieldType.OUTLINE:
        return new OutlineInput(fieldName, params);
      case FormFieldType.TEXT_LABEL:
        return new TextLabel(fieldName, params);
      case FormFieldType.TOGGLE:
        params.value = params.selectOptions.value;
        selectOptions = params.selectOptions.selectOptions;
        return new ToggleInput(fieldName, selectOptions, params);
      case FormFieldType.TEXT_OUTLINE:
        return new TextOutline(fieldName, params);
      case FormFieldType.SELECTION_INPUT:
        params.value = params.selectOptions.value;
        selectOptions = params.selectOptions.selectOptions;
        return new SelectionInput(fieldName, selectOptions, params);
    }
  }
}
