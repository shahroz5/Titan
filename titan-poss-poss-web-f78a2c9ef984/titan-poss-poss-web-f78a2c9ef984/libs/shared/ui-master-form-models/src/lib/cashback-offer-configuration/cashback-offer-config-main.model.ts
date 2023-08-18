import {
  FormField,
  FormFieldType,
  DynamicFormFieldsBuilder,
} from '@poss-web/shared/components/ui-dynamic-form';

import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { CashBackOfferConfigOneModel } from './cashback-offer-config-one.model';
import { CasbackOfferConfigTwoModel } from './cashback-offer.configurtaion-two.model';

export class CashBackOfferConigMainModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: ''
  })
  private cashBackOfferConfigOneModel: CashBackOfferConfigOneModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: ''
  })
  private cashBackOfferConfigTwoModel: CasbackOfferConfigTwoModel;

  constructor(
    id: number,
    cashBackOfferConfigOneModel: CashBackOfferConfigOneModel,
    cashBackOfferConfigTwoModel: CasbackOfferConfigTwoModel,
    fieldValidatorsService: FieldValidatorsService,
    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.cashBackOfferConfigOneModel = cashBackOfferConfigOneModel;
    this.cashBackOfferConfigTwoModel = cashBackOfferConfigTwoModel;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
