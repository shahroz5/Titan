import {
  DynamicFormFieldsBuilder,
  FormField,
  FormFieldType,
  Validation,
  Class
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  FieldValidatorsService,
  PossWebFieldValidators
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';

export class CMSMSConfigurationModel extends DynamicFormFieldsBuilder {
  private id: number;
  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.SMSUserName'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.SMSUserName' }
      },
      {
        name: PossWebFieldValidators.nameWithSpaceField,
        options: { fieldKey: 'pw.brandMaster.SMSUserName' }
      }
    ]
  })
  private SMSUserName: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.SMSPassword'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.SMSPassword' }
      },
      {
        name: PossWebFieldValidators.passwordField,
        options: { fieldKey: 'pw.brandMaster.SMSPassword' }
      }
    ]
  })
  private SMSPassword: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.centralS3BucketName'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.centralS3BucketName' }
      }
    ]
  })
  private centralS3BucketName: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.centralS3AccessKey'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.centralS3AccessKey' }
      }
    ]
  })
  private centralS3AccessKey: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.centralS3SecretKey'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.centralS3SecretKey' }
      }
    ]
  })
  private centralS3SecretKey: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.centralS3RegionEndPoint'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.urlField,
        options: { fieldKey: 'pw.brandMaster.centralS3RegionEndPoint' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.centralS3RegionEndPoint' }
      }
    ]
  })
  private centralS3RegionEndPoint: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.centralWebAPIURL'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.urlField,
        options: { fieldKey: 'pw.brandMaster.centralWebAPIURL' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.centralWebAPIURL' }
      }
    ],
    inputConstraint: PossWebFieldValidators.urlField
  })
  private centralWebAPIURL: string;

  @FormField({
    fieldType: FormFieldType.TEXT,
    label: 'pw.brandMaster.EPOSSServiceURL'
  })
  @Class({ className: ['col-12'] })
  @Validation({
    customValidators: [
      {
        name: PossWebFieldValidators.urlField,
        options: { fieldKey: 'pw.brandMaster.EPOSSServiceURL' }
      },
      {
        name: PossWebFieldValidators.requiredField,
        options: { fieldKey: 'pw.brandMaster.EPOSSServiceURL' }
      }
    ],
    inputConstraint: PossWebFieldValidators.urlField
  })
  private EPOSSServiceURL: string;

  constructor(
    id: number,
    SMSUserName: string,
    SMSPassword: string,
    centralS3BucketName: string,
    centralS3AccessKey: string,
    centralS3SecretKey: string,
    centralS3RegionEndPoint: string,
    centralWebAPIURL: string,
    EPOSSServiceURL: string,
    fieldValidatorsService: FieldValidatorsService,

    translateService: TranslateService
  ) {
    super();
    this.id = id;
    this.SMSUserName = SMSUserName;
    this.SMSPassword = SMSPassword;
    this.centralS3BucketName = centralS3BucketName;
    this.centralS3AccessKey = centralS3AccessKey;
    this.centralS3SecretKey = centralS3SecretKey;
    this.centralS3RegionEndPoint = centralS3RegionEndPoint;
    this.centralWebAPIURL = centralWebAPIURL;
    this.EPOSSServiceURL = EPOSSServiceURL;
    this.FieldValidatorsService = fieldValidatorsService;
    this.TranslateService = translateService;
  }
}
