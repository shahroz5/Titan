import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TEMPLATE12 } from '@poss-web/shared/components/ui-dynamic-form';
import {
  invglobalConfigurationsEnum,
  UpdateFieldValuePayload
} from '@poss-web/shared/models';
import { AmendmentConfigurationModel } from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-amendment-config-details',
  templateUrl: './amendment-config-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmendmentConfigDetailsComponent implements OnChanges {
  @Input() amendmentConfigValue = 0;
  @Output() updatedFiledValue = new EventEmitter<UpdateFieldValuePayload>();

  public currentStyle: string[];
  public formFields: any;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['amendmentConfigValue']) {
      const form = this.prepareSet(this.amendmentConfigValue);
      this.formFields = this.getInputs(form);
      this.currentStyle = this.getCssProp();
    }
  }

  prepareSet(value: number) {
    const globalConfig = new AmendmentConfigurationModel(
      1,
      value,
      this.fieldValidatorsService,
      this.translateService
    );

    return globalConfig;
  }

  getCssProp() {
    const annot = (AmendmentConfigDetailsComponent as any).__annotations__;
    if (annot) return annot[0]?.styles;
  }

  public getInputs(form) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }
  public setFormConfig() {
    return {
      formName: 'Amendment Form',
      formDesc: 'Amendment Config',
      formTemplate: TEMPLATE12
    };
  }

  addButton(formGroup: FormGroup) {
    const formValues = formGroup.getRawValue();

    const noOfDays = formValues['1-noOfDaysForApproval'];
    this.updatedFiledValue.emit({
      ruleDetails: {
        data: {
          noOfDaysToRaiseAmendment: noOfDays
        },
        type: invglobalConfigurationsEnum.AMENDMENT_CONFIGURATION
      }
    });
  }
}
