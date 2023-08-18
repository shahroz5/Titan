import {
  Class,
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType
} from '@poss-web/shared/components/ui-dynamic-form';
import { LocationBoutiqueFactoryModel } from './location-boutique-factory.model';
import { LocationContactModel } from './location-contact.model';
import { LocationCurrencyModel } from './location-currency.model';
import { LocationHallmarkModel } from './location-hallmark.model';
import { LocationWalkinsModel } from './location-walkins.model';

export class LocationMainFormModel extends DynamicFormFieldsBuilder {
  private id: number;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.boutiqueDetails',
    hide: false
  })
  private locationBoutiqueFactoryModel: LocationBoutiqueFactoryModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.contactDetails',
    hide: false
  })
  private locationContactModel: LocationContactModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.currencyDetails',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private locationCurrencyModel: LocationCurrencyModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.walkins',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private walkInsModel: LocationWalkinsModel;

  @FormField({
    fieldType: FormFieldType.SUB_FORM,
    label: 'pw.locationMaster.hallmark',
    hide: false
  })
  @Class({ className: ['pw-form-card__flex-3-column'] })
  private locationHallmarkModel: LocationHallmarkModel;

  constructor(
    id: number,
    locationBoutiqueFactoryModel: LocationBoutiqueFactoryModel,
    locationContactModel: LocationContactModel,
    locationCurrencyModel: LocationCurrencyModel,
    walkInsModel: LocationWalkinsModel,
    locationHallmarkModel: LocationHallmarkModel
  ) {
    super();
    this.id = id;
    this.locationBoutiqueFactoryModel = locationBoutiqueFactoryModel;
    this.locationContactModel = locationContactModel;
    this.locationCurrencyModel = locationCurrencyModel;
    this.walkInsModel = walkInsModel;
    this.locationHallmarkModel = locationHallmarkModel;
  }
}
