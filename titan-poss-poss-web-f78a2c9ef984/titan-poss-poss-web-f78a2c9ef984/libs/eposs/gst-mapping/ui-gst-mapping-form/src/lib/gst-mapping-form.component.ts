import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  Lov,
  Tax,
  GSTMappingPayload,
  GSTMappingFilter,
  GSTMappingDetails,
  GSTMappingFormTypeEnum,
  GSTMappingActiveStatusEnum,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-gst-mapping-form',
  templateUrl: './gst-mapping-form.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GSTMappingFormComponent implements OnInit {
  gstMappingForm: FormGroup;
  isActive = true;
  destroy$: Subject<null> = new Subject<null>();
  isFilter = false;
  isEdit = false;
  formHeadingKey;
  buttonTextKey;
  transactionTypeLabel: string;
  applicableTaxTypeLabel: string;
  sourceLocationTypeLabel: string;
  destinationLocationTypeLabel: string;
  customerTypeLabel: string;

  soruceLocationApplicableTaxLabel: string;
  destinationLocationApplicableTaxLabel: string;

  isActiveValues: SelectDropDownOption[] = [
    {
      value: GSTMappingActiveStatusEnum.ACTIVE,
      description: GSTMappingActiveStatusEnum.ACTIVE
    },
    {
      value: GSTMappingActiveStatusEnum.INACTIVE,
      description: GSTMappingActiveStatusEnum.INACTIVE
    }
  ];
  txnTypes: SelectDropDownOption[] = [];
  srcLocationTypes: SelectDropDownOption[] = [];
  destLocationTypes: SelectDropDownOption[] = [];
  customerTypes: SelectDropDownOption[] = [];

  constructor(
    public dialogRef: MatDialogRef<GSTMappingFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: GSTMappingFormTypeEnum;
      configData: GSTMappingDetails;
      filterData: GSTMappingFilter;
      txnTypes: Lov[];
      taxes: Tax[];
      srcLocationTypes: SelectDropDownOption[];
      destLocationTypes: SelectDropDownOption[];
      customerTypes: string[];
    },
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService
  ) {
    this.translateService
      .get([
        'pw.gstMapping.transactionTypeLabel',
        'pw.gstMapping.applicableTaxLabel',
        'pw.gstMapping.sourceLocationTypeFormLabel',
        'pw.gstMapping.destinationLocationTypeFormLabel',
        'pw.gstMapping.customerTypeFormLabel',
        'pw.gstMapping.sourceLocationApplicableTaxFormLabel',
        'pw.gstMapping.destLocApplicableTaxFormLabel'
      ])
      .subscribe((translatedMessages: any) => {
        this.transactionTypeLabel =
          translatedMessages['pw.gstMapping.transactionTypeLabel'];
        this.applicableTaxTypeLabel =
          translatedMessages['pw.gstMapping.applicableTaxLabel'];

        this.sourceLocationTypeLabel =
          translatedMessages['pw.gstMapping.sourceLocationTypeFormLabel'];

        this.destinationLocationTypeLabel =
          translatedMessages['pw.gstMapping.destinationLocationTypeFormLabel'];

        this.customerTypeLabel =
          translatedMessages['pw.gstMapping.customerTypeFormLabel'];

        this.soruceLocationApplicableTaxLabel =
          translatedMessages[
            'pw.gstMapping.sourceLocationApplicableTaxFormLabel'
          ];

        this.destinationLocationApplicableTaxLabel =
          translatedMessages['pw.gstMapping.destLocApplicableTaxFormLabel'];
      });
  }

  ngOnInit() {
    if (this.data?.txnTypes?.length) {
      this.txnTypes = this.data.txnTypes.map(tx => ({
        value: tx.code,
        description: tx.value
      }));
    }

    if (this.data?.srcLocationTypes?.length) {
      this.srcLocationTypes = [...this.data.srcLocationTypes];
    }

    if (this.data?.destLocationTypes?.length) {
      this.destLocationTypes = [...this.data.destLocationTypes]
    }

    if (this.data?.customerTypes?.length) {
      this.customerTypes = this.data.customerTypes.map(customer => ({
        value: customer,
        description: customer
      }));
    }

    if (this.data.type === GSTMappingFormTypeEnum.NEW) {
      this.formHeadingKey = 'pw.gstMapping.newFromHeader';
      this.buttonTextKey = 'pw.gstMapping.addButton';

      this.gstMappingForm = new FormGroup({
        txnType: new FormControl(null, [
          this.fieldValidatorsService.requiredField(this.transactionTypeLabel)
        ]),
        applicableTax: new FormControl(null, [
          this.fieldValidatorsService.requiredField(this.applicableTaxTypeLabel)
        ]),
        srcLocationType: new FormControl(null, [
          this.fieldValidatorsService.requiredField(
            this.sourceLocationTypeLabel
          )
        ]),

        destLocationType: new FormControl(null),
        customerType: new FormControl(null, [
          // this.fieldValidatorsService.requiredField(this.customerTypeLabel)
        ]),
        srcLocationApplicableTax: new FormControl([]),

        destLocationApplicableTax: new FormControl([]),

        isSameState: new FormControl(false),

        srcTaxApplicable: new FormControl(false)
      });
    } else if (this.data.type === GSTMappingFormTypeEnum.EDIT) {
      this.formHeadingKey = 'pw.gstMapping.editFromHeader';
      this.buttonTextKey = 'pw.gstMapping.updateButton';

      this.isEdit = true;
      this.isActive = this.data.configData.isActive;
      this.gstMappingForm = new FormGroup({
        txnType: new FormControl(
          this.getTxnType(this.data.configData.txnType),
          [this.fieldValidatorsService.requiredField(this.transactionTypeLabel)]
        ),
        applicableTax: new FormControl(
          this.convertStringArray(this.data.configData.applicableTax),
          [
            this.fieldValidatorsService.requiredField(
              this.applicableTaxTypeLabel
            )
          ]
        ),
        srcLocationType: new FormControl(
          this.data.configData.srcLocationTaxType,
          [
            this.fieldValidatorsService.requiredField(
              this.sourceLocationTypeLabel
            )
          ]
        ),

        destLocationType: new FormControl(
          this.data.configData.destLocationTaxType
        ),
        customerType: new FormControl(this.data.configData.customerTaxType, [
          // this.fieldValidatorsService.requiredField(this.customerTypeLabel)
        ]),
        srcLocationApplicableTax: new FormControl(
          this.convertStringArray(this.data.configData.srcLocationApplicableTax)
        ),

        destLocationApplicableTax: new FormControl(
          this.convertStringArray(
            this.data.configData.destLocationApplicableTax
          )
        ),

        isSameState: new FormControl(this.data.configData.isSameState),

        srcTaxApplicable: new FormControl(this.data.configData.srcTaxApplicable)
      });
    } else if (this.data.type === GSTMappingFormTypeEnum.FILTER) {
      this.formHeadingKey = 'pw.gstMapping.filterFromHeader';
      this.buttonTextKey = 'pw.gstMapping.applyButton';

      this.isFilter = true;
      this.isActive =
        this.data.filterData.isActive === null
          ? true
          : this.data.filterData.isActive;
      this.gstMappingForm = new FormGroup({
        txnType: new FormControl(this.data.filterData.txnType),
        srcLocationType: new FormControl(
          this.data.filterData.srcLocationTaxType
        ),
        destLocationType: new FormControl(
          this.data.filterData.destLocationTaxType
        ),
        customerType: new FormControl(this.data.filterData.customerTaxType),
        isActive: new FormControl(
          this.data.filterData.isActive === null
            ? null
            : this.data.filterData.isActive
            ? GSTMappingActiveStatusEnum.ACTIVE
            : GSTMappingActiveStatusEnum.INACTIVE
        )
      });
    }
  }
  getTxnType(description: string): string {
    const index = this.data.txnTypes.findIndex(
      type => type.value === description || type.code === description
    );
    if (index >= 0) {
      return this.data.txnTypes[index].code;
    } else {
      return null;
    }
  }

  submit() {
    const formValue = this.gstMappingForm.value;
    if (!this.isFilter) {
      if (this.gstMappingForm.valid) {
        const response: GSTMappingPayload = {
          isActive: this.isActive,
          applicableTax: this.convertArrayToString(formValue.applicableTax),
          customerTaxType: formValue.customerType !== undefined ? formValue.customerType : null,
          destLocationApplicableTax: this.convertArrayToString(
            formValue.destLocationApplicableTax
          ),
          destLocationTaxType: formValue.destLocationType,
          isSameState: formValue.isSameState,
          srcLocationApplicableTax: this.convertArrayToString(
            formValue.srcLocationApplicableTax
          ),
          srcLocationTaxType: formValue.srcLocationType,
          srcTaxApplicable: formValue.srcTaxApplicable,
          txnType: formValue.txnType
        };
        this.dialogRef.close(response);
      }
    } else {
      let isActive;

      if (formValue.isActive === GSTMappingActiveStatusEnum.ACTIVE) {
        isActive = true;
      } else if (formValue.isActive === GSTMappingActiveStatusEnum.INACTIVE) {
        isActive = false;
      } else {
        isActive = null;
      }
      const response: GSTMappingFilter = {
        isActive: isActive,
        customerTaxType: formValue.customerType,
        destLocationTaxType: formValue.destLocationType,
        srcLocationTaxType: formValue.srcLocationType,
        txnType: formValue.txnType
      };
      this.dialogRef.close(response);
    }
  }

  convertArrayToString(data: string[]): string {
    return data && data.length !== 0
      ? data.reduce((d1, d2) => d1 + ',' + d2)
      : null;
  }

  convertStringArray(data: string): string[] {
    return data ? data.split(',') : [];
  }

  clear() {
    this.isActive = true;

    this.gstMappingForm.reset();
    if (this.isFilter) {
      this.gstMappingForm.patchValue({
        isActive: null,
        isSameState: false,
        srcTaxApplicable: false
      });
    } else {
      this.gstMappingForm.patchValue({
        isSameState: false,
        srcTaxApplicable: false
      });
    }
  }

  close() {
    this.dialogRef.close(null);
  }
}
