import {
  Class,
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType
} from '@poss-web/shared/components/ui-dynamic-form';
import { TcsConfigApplicableRatesDummyModel } from './new_tcs-applicableRates_dummy.model';
import { TcsConfigApplicableRatesInstitutionalModel } from './new_tcs-applicableRates_institutional.model';
import { TcsConfigApplicableRatesInternationalModel } from './new_tcs-applicableRates_international.model';
import { TcsConfigApplicableRatesRegularWithoutPanModel } from './new_tcs-applicableRates_regular_without_pan.model';
import { TcsConfigApplicableRatesRegularWithPanModel } from './new_tcs-applicableRates_regular_with_pan.model';

import { TcsConfigModel } from './new_tcs-config.model';
import { TcsConfigGrnConfigModel } from './new_tcs-grnConfig.model';

export class TcsConfigMainFormModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: '',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private tcsConfigModel: TcsConfigModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Applicable Rates for Regular customer with PAN',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private tcsConfigApplicableRatesRegularWithPanModel: TcsConfigApplicableRatesRegularWithPanModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Applicable Rates for Regular customer without PAN but with FORM 60',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private tcsConfigApplicableRatesRegularWithoutPanModel: TcsConfigApplicableRatesRegularWithoutPanModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Applicable Rates for Dummy customer',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private tcsConfigApplicableRatesDummyModel: TcsConfigApplicableRatesDummyModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Applicable Rates for Institutional customer',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private tcsConfigApplicableRatesInstitutionalModel: TcsConfigApplicableRatesInstitutionalModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'Applicable Rates for International customer',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private tcsConfigApplicableRatesInternationalModel: TcsConfigApplicableRatesInternationalModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'GRN Configuration',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private tcsConfigGrnConfigModel: TcsConfigGrnConfigModel;

  constructor(
    id: number,
    tcsConfigModel: TcsConfigModel,
    tcsConfigApplicableRatesRegularWithPanModel: TcsConfigApplicableRatesRegularWithPanModel,
    tcsConfigApplicableRatesRegularWithoutPanModel: TcsConfigApplicableRatesRegularWithoutPanModel,
    tcsConfigApplicableRatesDummyModel: TcsConfigApplicableRatesDummyModel,
    tcsConfigApplicableRatesInstitutionalModel: TcsConfigApplicableRatesInstitutionalModel,
    tcsConfigApplicableRatesInternationalModel: TcsConfigApplicableRatesInternationalModel,
    tcsConfigGrnConfigModel: TcsConfigGrnConfigModel
  ) {
    super();
    this.id = id;
    this.tcsConfigModel = tcsConfigModel;
    this.tcsConfigApplicableRatesRegularWithPanModel = tcsConfigApplicableRatesRegularWithPanModel;
    this.tcsConfigApplicableRatesRegularWithoutPanModel = tcsConfigApplicableRatesRegularWithoutPanModel;
    this.tcsConfigApplicableRatesDummyModel = tcsConfigApplicableRatesDummyModel;
    this.tcsConfigApplicableRatesInstitutionalModel = tcsConfigApplicableRatesInstitutionalModel;
    this.tcsConfigApplicableRatesInternationalModel = tcsConfigApplicableRatesInternationalModel;
    this.tcsConfigGrnConfigModel = tcsConfigGrnConfigModel;
  }
}
