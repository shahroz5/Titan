import {
  Directive,
  forwardRef,
  Attribute,
  Inject,
  Input,
  HostBinding
} from '@angular/core';
import {
  NG_VALIDATORS,
  Validators,
  NG_ASYNC_VALIDATORS,
  AbstractControl
} from '@angular/forms';
import { FieldValidatorsService } from './field-validators.service';

@Directive({
  selector: '[possWebRequired]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: RequiredValidator,
      multi: true
    }
  ]
})
export class RequiredValidator {
  @Input() name: string;
  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.requiredField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebEmail]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmailValidator,
      multi: true
    }
  ]
})
export class EmailValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.emailField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebAmount]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AmountValidator,
      multi: true
    }
  ]
})
export class AmountValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.amountField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebNumbers]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NumbersValidator,
      multi: true
    }
  ]
})
export class NumbersValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.numbersField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebAlphaNumeric]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AlphaNumericValidator,
      multi: true
    }
  ]
})
export class AlphaNumericValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.alphaNumericField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebBinCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: BinCodeValidator,
      multi: true
    }
  ]
})
export class BinCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.binCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebBinGroupCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: BinGroupCodeValidator,
      multi: true
    }
  ]
})
export class BinGroupCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.binGroupCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebBrandCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: BrandCodeValidator,
      multi: true
    }
  ]
})
export class BrandCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.brandCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebSubBrandCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SubBrandCodeValidator,
      multi: true
    }
  ]
})
export class SubBrandCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.subBrandCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebRegionCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: RegionCodeValidator,
      multi: true
    }
  ]
})
export class RegionCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.regionCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebSubRegionCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SubRegionCodeValidator,
      multi: true
    }
  ]
})
export class SubRegionCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.subRegionCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebStoneCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StoneCodeValidator,
      multi: true
    }
  ]
})
export class StoneCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.stoneCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebMaterialCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaterialCodeValidator,
      multi: true
    }
  ]
})
export class MaterialCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.materialCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebMarketCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MarketCodeValidator,
      multi: true
    }
  ]
})
export class MarketCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.marketCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebPriceGroupTypeCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PriceGroupTypeCodeValidator,
      multi: true
    }
  ]
})
export class PriceGroupTypeCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.priceGroupTypeCodeField(this.name)(
      control
    );
  }
}

@Directive({
  selector: '[possWebPaymentCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PaymentCodeValidator,
      multi: true
    }
  ]
})
export class PaymentCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.paymentCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebDepreciationCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DepreciationCodeValidator,
      multi: true
    }
  ]
})
export class DepreciationCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.depreciationCodeField(this.name)(
      control
    );
  }
}

@Directive({
  selector: '[possWebCfaProductCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CfaProductCodeValidator,
      multi: true
    }
  ]
})
export class CfaProductCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.cfaProductCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebColor]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ColorValidator,
      multi: true
    }
  ]
})
export class ColorValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.colorField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebDays]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DaysValidator,
      multi: true
    }
  ]
})
export class DaysValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.daysField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebDescription]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DescriptionValidator,
      multi: true
    }
  ]
})
export class DescriptionValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.descriptionField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebGstNumber]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: GstNumberValidator,
      multi: true
    }
  ]
})
export class GstNumberValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.gstNumberField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebPassportId]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PassportIdValidator,
      multi: true
    }
  ]
})
export class PassportIdValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.passportIdField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebKarat]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: KaratValidator,
      multi: true
    }
  ]
})
export class KaratValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.karatField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebFactor]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FactorValidator,
      multi: true
    }
  ]
})
export class FactorValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.factorField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebMobile]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MobileValidator,
      multi: true
    }
  ]
})
export class MobileValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.mobileField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebNumberOfPrintsAllowed]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MobileValidator,
      multi: true
    }
  ]
})
export class NumberOfPrintsAllowedValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.numberOfPrintsAllowedField(this.name)(
      control
    );
  }
}

@Directive({
  selector: '[possWebNameWithSpace]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NameWithSpaceValidator,
      multi: true
    }
  ]
})
export class NameWithSpaceValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.nameWithSpaceField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebPurityOffset]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PurityOffsetValidator,
      multi: true
    }
  ]
})
export class PurityOffsetValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.purityField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebPercentage]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PercentageValidator,
      multi: true
    }
  ]
})
export class PercentageValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.percentageField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebPincode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PincodeValidator,
      multi: true
    }
  ]
})
export class PincodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.pincodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebAlphabets]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AlphabetsValidator,
      multi: true
    }
  ]
})
export class AlphabetsValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.alphabetsField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebTolerance]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ToleranceValidator,
      multi: true
    }
  ]
})
export class ToleranceValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.toleranceField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebUrl]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UrlValidator,
      multi: true
    }
  ]
})
export class UrlValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.urlField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebProductCategory]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ProductCategoryValidator,
      multi: true
    }
  ]
})
export class ProductCategoryValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.productCategoryField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebAddress]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AddressValidator,
      multi: true
    }
  ]
})
export class AddressValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.addressField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebCorporateAddress]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AddressValidator,
      multi: true
    }
  ]
})
export class CorporateAddressValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.corporateAddressField(this.name)(
      control
    );
  }
}

@Directive({
  selector: '[possWebApprovalCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ApprovalCodeValidator,
      multi: true
    }
  ]
})
export class ApprovalCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.approvalCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebCity]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CityValidator,
      multi: true
    }
  ]
})
export class CityValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.cityField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebCourierDocNo]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CourierDocNoValidator,
      multi: true
    }
  ]
})
export class CourierDocNoValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.courierDocNoField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebCourierRoadPermitNo]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CourierRoadPermitNoValidator,
      multi: true
    }
  ]
})
export class CourierRoadPermitNoValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.courierRoadPermitNoField(this.name)(
      control
    );
  }
}

@Directive({
  selector: '[possWebDesignation]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DesignationValidator,
      multi: true
    }
  ]
})
export class DesignationValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.designationField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebPancard]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PancardValidator,
      multi: true
    }
  ]
})
export class PancardValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.pancardField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebQuantity]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: QuantityValidator,
      multi: true
    }
  ]
})
export class QuantityValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.quantityField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebLockNumber]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: LockNumberValidator,
      multi: true
    }
  ]
})
export class LockNumberValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.lockNumberField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebReason]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ReasonValidator,
      multi: true
    }
  ]
})
export class ReasonValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.reasonField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebRemark]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: RemarkValidator,
      multi: true
    }
  ]
})
export class RemarkValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.remarkField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebRoleCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: RoleCodeValidator,
      multi: true
    }
  ]
})
export class RoleCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.roleCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebState]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StateValidator,
      multi: true
    }
  ]
})
export class StateValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.stateField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebWeight]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: WeightValidator,
      multi: true
    }
  ]
})
export class WeightValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.weightField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebTownCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: TownCodeValidator,
      multi: true
    }
  ]
})
export class TownCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.townCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebStateCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StateCodeValidator,
      multi: true
    }
  ]
})
export class StateCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.stateCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebLocationTypeCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: LocationTypeCodeValidator,
      multi: true
    }
  ]
})
export class LocationTypeCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.locationTypeCodeField(this.name)(
      control
    );
  }
}

@Directive({
  selector: '[possWebCountryCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CountryCodeValidator,
      multi: true
    }
  ]
})
export class CountryCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.countryCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebCurrencyCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CurrencyCodeValidator,
      multi: true
    }
  ]
})
export class CurrencyCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.currencyCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebUniCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UniCodeValidator,
      multi: true
    }
  ]
})
export class UniCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.uniCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebItemCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ItemCodeValidator,
      multi: true
    }
  ]
})
export class ItemCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.itemCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebProductCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ProductCodeValidator,
      multi: true
    }
  ]
})
export class ProductCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.productCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebComplexityCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ComplexityCodeValidator,
      multi: true
    }
  ]
})
export class ComplexityCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.complexityCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebStoneQuality]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StoneQualityValidator,
      multi: true
    }
  ]
})
export class StoneQualityValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.stoneQualityField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebProductGroupCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ProductGroupCodeValidator,
      multi: true
    }
  ]
})
export class ProductGroupCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.productGroupCodeField(this.name)(
      control
    );
  }
}

@Directive({
  selector: '[possWebStoneTypeCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StoneTypeCodeValidator,
      multi: true
    }
  ]
})
export class StoneTypeCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.stoneTypeCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebSupplyChainCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SupplyChainCodeValidator,
      multi: true
    }
  ]
})
export class SupplyChainCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.supplyChainCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebProductTypeCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ProductTypeCodeValidator,
      multi: true
    }
  ]
})
export class ProductTypeCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.productTypeCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebFindingCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FindingCodeValidator,
      multi: true
    }
  ]
})
export class FindingCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.findingCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebLocationCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: LocationCodeValidator,
      multi: true
    }
  ]
})
export class LocationCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.locationCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebPriceGroupCode]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PriceGroupCodeValidator,
      multi: true
    }
  ]
})
export class PriceGroupCodeValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.priceGroupCodeField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebCinNumber]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CINNumberValidator,
      multi: true
    }
  ]
})
export class CINNumberValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.cinNumberField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebContactNo]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ContactNoValidator,
      multi: true
    }
  ]
})
export class ContactNoValidator {
  @Input() name: string;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.contactNoField(this.name)(control);
  }
}

@Directive({
  selector: '[possWebMinlength]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MinlengthValidator,
      multi: true
    }
  ]
})
export class MinlengthValidator {
  @Input() name: string;
  @Input() minlength: number;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.minLength(
      this.minlength,
      this.name
    )(control);
  }
}

@Directive({
  selector: '[possWebMaxlength]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxlengthValidator,
      multi: true
    }
  ]
})
export class MaxlengthValidator {
  @Input() name: string;
  @Input() maxlength: number;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    return this.fieldValidatorsService.maxLength(
      this.maxlength,
      this.name
    )(control);
  }
}
