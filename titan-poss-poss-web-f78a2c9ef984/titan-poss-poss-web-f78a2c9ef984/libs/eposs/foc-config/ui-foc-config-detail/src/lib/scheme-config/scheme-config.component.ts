import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  InputValidatorComponent,
  DeleteRowComponent,
  EditItemComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import {
  SchemeDetails,
  focSchemeBasedEnums,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'poss-web-scheme-config',
  templateUrl: './scheme-config.component.html',
  styleUrls: ['./scheme-config.component.scss']
})
export class SchemeConfigComponent implements OnInit, OnChanges {
  schemeNameLabel: string;
  descriptionLabel: string;
  noOfDaysBeforeOfferPeriodForGrnLabel: string;
  grnUtilizationPercentageLabel: string;
  noOfDaysAfterOfferPeriodForGrnLabel: string;
  noOfDaysAfterPeriodForCoLabel: string;
  coUtilizationPercentageLabel: string;
  noOfDaysAfterOfferPeriodForAbLabel: string;
  abUtilizationPercentageLabel: string;
  errorMessageLabel: string;
  columnDefs = [];
  destroy$ = new Subject<null>();
  gridApi: GridApi;
  domLayout = 'autoHeight';
  schemeConfigurationForm: FormGroup;
  tepDiscountRecoveryArray = new FormArray([]);

  @Input() schemeDetails: SchemeDetails;
  @Input() rangeWeight: string[];
  @Input() tepDetails;

  @Output() saveSchemeDetails = new EventEmitter<SchemeDetails>();
  // @Output() deletetepConfig = new EventEmitter<SchemeDetails>();
  editMode = false;
  invalidValueError = false;
  errorMessageForTepNull: any;
  errorMessageForduplicateValue: any;
  errorDurationValue: any;
  errorDialogReference: any;
  duplicateValueError = false;
  rowNotDeleted: { durationInDays: string; recoveryPercent: string }[];
  add = false;
  tepRowData = [];
  component: SchemeConfigComponent = this;
  durationLabel: string;
  utilizationLabel: string;
  inValidRecoveryPercent = false;
  tepDetailsError = false;
  focSchemeBasedEnums = focSchemeBasedEnums;
  isChecked: boolean;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private fieldValidatorService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.translate
      .get([
        'pw.focConfiguration.durationInDays',
        'pw.focConfiguration.recoveryPercentage',
        'pw.focConfiguration.schemeNameLabel',
        'pw.focConfiguration.descriptionLabel',
        'pw.focConfiguration.noOfDaysBeforeOfferPeriodForGrnLabel',
        'pw.focConfiguration.grnUtilizationPercentageLabel',
        'pw.focConfiguration.noOfDaysAfterOfferPeriodForGrnLabel',
        'pw.focConfiguration.noOfDaysAfterPeriodForCoLabel',
        'pw.focConfiguration.coUtilizationPercentageLabel',
        'pw.focConfiguration.noOfDaysAfterOfferPeriodForAbLabel',
        'pw.focConfiguration.abUtilizationPercentageLabel',
        'pw.focConfiguration.errorMessageLabel',
        'pw.focConfiguration.errorMessageForTepNull',
        'pw.focConfiguration.errorMessageForduplicateValue'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.durationLabel =
          translatedMessages['pw.focConfiguration.durationInDays'];
        this.utilizationLabel =
          translatedMessages['pw.focConfiguration.recoveryPercentage'];

        this.errorMessageForTepNull =
          translatedMessages['pw.focConfiguration.errorMessageForTepNull'];

        this.errorMessageForduplicateValue =
          translatedMessages[
            'pw.focConfiguration.errorMessageForduplicateValue'
          ];
        this.schemeNameLabel =
          translatedMessages['pw.focConfiguration.schemeNameLabel'];
        this.descriptionLabel =
          translatedMessages['pw.focConfiguration.descriptionLabel'];

        this.noOfDaysBeforeOfferPeriodForGrnLabel =
          translatedMessages[
            'pw.focConfiguration.noOfDaysBeforeOfferPeriodForGrnLabel'
          ];
        this.grnUtilizationPercentageLabel =
          translatedMessages[
            'pw.focConfiguration.grnUtilizationPercentageLabel'
          ];
        this.noOfDaysAfterOfferPeriodForGrnLabel =
          translatedMessages[
            'pw.focConfiguration.noOfDaysAfterOfferPeriodForGrnLabel'
          ];
        this.noOfDaysAfterPeriodForCoLabel =
          translatedMessages[
            'pw.focConfiguration.noOfDaysAfterPeriodForCoLabel'
          ];
        this.coUtilizationPercentageLabel =
          translatedMessages[
            'pw.focConfiguration.coUtilizationPercentageLabel'
          ];
        this.noOfDaysAfterOfferPeriodForAbLabel =
          translatedMessages[
            'pw.focConfiguration.noOfDaysAfterOfferPeriodForAbLabel'
          ];
        this.abUtilizationPercentageLabel =
          translatedMessages[
            'pw.focConfiguration.abUtilizationPercentageLabel'
          ];

        this.errorMessageLabel =
          translatedMessages['pw.focConfiguration.errorMessageLabel'];

        this.columnDefs = [
          {
            headerName:
              translatedMessages['pw.focConfiguration.durationInDays'],
            field: 'durationInDays',
            cellEditorSelector: params => {
              return {
                component: 'agSelectCellEditor',
                params: {
                  values: this.rangeWeight
                }
              };
            },
            cellRendererFramework: EditItemComponent,
            editable: true,
            width: 200
          },
          {
            headerName:
              translatedMessages['pw.focConfiguration.recoveryPercentage'],
            field: 'recoveryPercent',
            flex: 1,
            editable: true,
            cellRendererFramework: EditItemComponent,
            valueFormatter: (params: { value: { value: any } }) => {
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return params.value.value;
                } else {
                  return ' ';
                }
              } else {
                return params.value;
              }
            },
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params?.value?.isValid) {
                  this.inValidRecoveryPercent = false;
                }
                return params?.value?.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params.value.value !== '') {
                  if (params?.value?.isValid === false) {
                    this.inValidRecoveryPercent = true;
                  }
                }

                return (
                  params?.value?.isValid === false &&
                  params?.value?.value !== ''
                );
              }
            },
            cellEditor: 'inputValidator'
          },
          {
            headerName: '',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            suppressMovable: true,
            cellRendererFramework: DeleteRowComponent,
            suppressRowClickSelection: 'true',
            onCellClicked: this.remove.bind(this)
          }
        ];
      });
  }

  remove(params) {
    if (params.data.isSaved === true) {
      this.rowNotDeleted = this.getAllRows().filter(
        data => data.durationInDays !== params.data.durationInDays
      );
      this.saveSchemeDetails.emit(this.prepareResponse(false));
    }
    this.editMode = false;
    let index = 1;
    if (this.getAllRows().length === 1) {
      this.gridApi.setRowData([
        {
          id: '',
          recoveryPercent: '',
          durationInDays: ''
        }
      ]);
    } else {
      this.gridApi.applyTransaction({
        remove: [params.data]
      });

      this.gridApi.setRowData(
        this.getAllRows().map(ob => ({
          ...ob,
          rowId: (index++).toString()
        }))
      );
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.createForm();
    this.isChecked =
      this.schemeDetails?.tepConfigData?.data?.isEnabled === true
        ? this.schemeDetails?.tepConfigData?.data?.isEnabled
        : false;
    if (this.gridApi) {
      if (this.tepDetails.length) {
        this.tepRowData = this.tepDetails;
        this.gridApi.setRowData(this.tepDetails);
      } else {
        this.tepRowData = [
          { durationInDays: '', recoveryPercent: '', isSaved: false }
        ];

        this.gridApi.setRowData([
          { durationInDays: '', recoveryPercent: '', isSaved: false }
        ]);
      }
    }
  }


  getComponents() {
    return {
      inputValidator: InputValidatorComponent
    };
  }
  // updateIsActive(checked) {
  //   this.schemeConfigurationForm.get('isActive').patchValue(checked);
  // }
  createForm() {
    this.schemeConfigurationForm = new FormGroup({
      schemeName: new FormControl(
        {
          value: this.schemeDetails?.name,
          disabled: this.schemeDetails?.id ? true : false
        },
        [
          this.fieldValidatorService.requiredField(this.schemeNameLabel),
          this.fieldValidatorService.focSchemeNameField(this.schemeNameLabel)
        ]
      ),
      description: new FormControl(this.schemeDetails?.description, [
        this.fieldValidatorService.requiredField(this.descriptionLabel),
        this.fieldValidatorService.descriptionField(this.descriptionLabel)
      ]),
      isActive: new FormControl(this.schemeDetails?.isActive),
      isClubbedWithExchangeOffers: new FormControl(
        this.schemeDetails?.clubbingConfigData?.data?.isExchangeOffer
      ),
      isClubbedWithGHSAccountMaturity: new FormControl(
        this.schemeDetails?.clubbingConfigData?.data?.isGHS
      ),
      isClubbedWithDV: new FormControl(
        this.schemeDetails?.clubbingConfigData?.data?.isDV
      ),
      isClubbedWithCBO: new FormControl(
        this.schemeDetails?.clubbingConfigData?.data?.isCBO
      ),
      isClubbedWithRIVAJPP: new FormControl(
        this.schemeDetails?.clubbingConfigData?.data?.isRiva
      ),
      noOfDaysBeforeOfferPeriodForGrn: new FormControl(
        this.schemeDetails?.grnConfigData?.data?.noOfDaysBeforeOfferPeriod,
        this.fieldValidatorService.daysField(
          this.noOfDaysBeforeOfferPeriodForGrnLabel
        )
      ),
      grnUtilizationPercentage: new FormControl(
        this.schemeDetails?.grnConfigData?.data?.utilizationPercent,
        this.fieldValidatorService.percentageField(
          this.grnUtilizationPercentageLabel
        )
      ),
      noOfDaysAfterOfferPeriodForGrn: new FormControl(
        this.schemeDetails?.grnConfigData?.data?.noOfDaysAfterOfferPeriod,
        this.fieldValidatorService.daysField(
          this.noOfDaysAfterOfferPeriodForGrnLabel
        )
      ),
      isTepRecoveryEnabled: new FormControl(
        this.schemeDetails?.tepConfigData?.data?.isEnabled
      ),
      noOfDaysAfterPeriodForCo: new FormControl(
        this.schemeDetails?.orderConfigData?.data?.offerPeriodForCO,
        this.fieldValidatorService.daysField(this.noOfDaysAfterPeriodForCoLabel)
      ),
      coUtilizationPercentage: new FormControl(
        this.schemeDetails?.orderConfigData?.data?.coPercent,
        this.fieldValidatorService.percentageField(
          this.coUtilizationPercentageLabel
        )
      ),
      isGoldRateForzenForCo: new FormControl(
        this.schemeDetails?.orderConfigData?.data?.isGoldRateFrozenForCO
      ),
      noOfDaysAfterOfferPeriodForAb: new FormControl(
        this.schemeDetails?.orderConfigData?.data?.offerPeriodForAB,
        this.fieldValidatorService.daysField(
          this.noOfDaysAfterOfferPeriodForAbLabel
        )
      ),
      abUtilizationPercentage: new FormControl(
        this.schemeDetails?.orderConfigData?.data?.abPercent,
        this.fieldValidatorService.percentageField(
          this.abUtilizationPercentageLabel
        )
      ),
      isGoldRateForzenForAb: new FormControl(
        this.schemeDetails?.orderConfigData?.data?.isGoldRateFrozenForAB
      ),
      isAccuralEncirclePoint: new FormControl(
        this.schemeDetails?.isAccrualUlp
      ),
    });
  }

  checkboxChange(event) {
    this.isChecked = event.checked;
    if (this.getAllRows().length === 0) {
      this.gridApi.setRowData([
        { durationInDays: '', recoveryPercent: '', isSaved: false }
      ]);
    }
  }
  onClick() {
    let index = 1;
    if (this.isChecked) {
      this.gridApi.stopEditing();
      this.checkValidation(this.getAllRows());
    } else {
      this.duplicateValueError = false;
      this.invalidValueError = false;
      this.gridApi.forEachNode(node => {
        if (node.data.isSaved === false) {
          this.gridApi.applyTransaction({
            remove: [node.data]
          });
        }
      });

      this.gridApi.setRowData(
        this.getAllRows().map(ob => ({
          ...ob,
          rowId: (index++).toString()
        }))
      );
    }

    if (
      this.schemeConfigurationForm.valid &&
      this.duplicateValueError === false &&
      this.invalidValueError === false
    ) {
      this.saveSchemeDetails.emit(this.prepareResponse(true));
    }
  }
  prepareResponse(isSave) {
    const schemeDetails: SchemeDetails = {
      name: this.schemeConfigurationForm.get('schemeName').value,
      description: this.schemeConfigurationForm.get('description').value,
      isActive: true,
      isAccrualUlp: this.schemeConfigurationForm.get('isAccuralEncirclePoint').value,
      clubbingConfigData: {
        data: {
          isCBO: this.schemeConfigurationForm.get('isClubbedWithCBO').value,
          isExchangeOffer: this.schemeConfigurationForm.get(
            'isClubbedWithExchangeOffers'
          ).value,

          isGHS: this.schemeConfigurationForm.get(
            'isClubbedWithGHSAccountMaturity'
          ).value,
          isRiva: this.schemeConfigurationForm.get('isClubbedWithRIVAJPP')
            .value,
          isDV: this.schemeConfigurationForm.get('isClubbedWithDV').value
        },
        type: 'CLUBBING_CONFIG'
      },
      tepConfigData: {
        data: {
          isEnabled: this.schemeConfigurationForm.get('isTepRecoveryEnabled')
            .value,
          tepDetails: isSave ? this.getAllRows() : this.rowNotDeleted
        },
        type: 'TEP_CONFIG'
      },
      grnConfigData: {
        data: {
          noOfDaysAfterOfferPeriod: this.schemeConfigurationForm.get(
            'noOfDaysAfterOfferPeriodForGrn'
          ).value,
          noOfDaysBeforeOfferPeriod: this.schemeConfigurationForm.get(
            'noOfDaysBeforeOfferPeriodForGrn'
          ).value,
          utilizationPercent: this.schemeConfigurationForm.get(
            'grnUtilizationPercentage'
          ).value
        },
        type: 'GRN_CONFIG'
      },
      orderConfigData: {
        data: {
          isGoldRateFrozenForAB: this.schemeConfigurationForm.get(
            'isGoldRateForzenForAb'
          ).value,
          isGoldRateFrozenForCO: this.schemeConfigurationForm.get(
            'isGoldRateForzenForCo'
          ).value,
          offerPeriodForAB: this.schemeConfigurationForm.get(
            'noOfDaysAfterOfferPeriodForAb'
          ).value,
          offerPeriodForCO: this.schemeConfigurationForm.get(
            'noOfDaysAfterPeriodForCo'
          ).value,
          coPercent: this.schemeConfigurationForm.get('coUtilizationPercentage')
            .value,
          abPercent: this.schemeConfigurationForm.get('abUtilizationPercentage')
            .value
        },
        type: 'ORDER_CONFIG'
      }
    };

    return schemeDetails;
  }
  getContext() {
    return {
      validators: {
        durationInDays: [
          this.fieldValidatorService.requiredField(this.durationLabel)
        ],
        recoveryPercent: [
          this.fieldValidatorService.requiredField(this.utilizationLabel),
          this.fieldValidatorService.percentageField(this.utilizationLabel)
        ]
      },
      componentParent: this.component
    };
  }
  getRowNotDeleted() {
    let rowData = [];
    this.gridApi.forEachNode(node => {
      if (node?.data?.isSaved) {
        rowData.push(node.data);
      }
    });
    rowData = rowData?.map(data => ({
      ...data,
      recoveryPercent: data?.recoveryPercent?.value
        ? data?.recoveryPercent?.value
        : data?.recoveryPercent
    }));
    return rowData;
  }
  getAllRows() {
    let rowData = [];
    this.gridApi.forEachNode(node => {
      if (node) {
        rowData.push(node.data);
      }
    });
    rowData = rowData?.map(data => ({
      ...data,
      recoveryPercent: data?.recoveryPercent?.value
        ? data?.recoveryPercent?.value
        : data?.recoveryPercent
    }));
    return rowData;
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData([
      { durationInDays: '', recoveryPercent: '', isSaved: false }
    ]);
  }

  addAnother() {
    this.add = true;
    if (this.editMode) {
      this.editMode = false;
      this.gridApi.stopEditing();
    } else {
      this.checkValidation(this.getAllRows());
      this.addData();
    }
  }

  checkValidation(rowData) {
    this.invalidValueError = false;

    for (const data of rowData) {
      if (
        data?.durationInDays === '' ||
        data?.durationInDays === undefined ||
        data?.recoveryPercent === '' ||
        data?.recoveryPercent === undefined ||
        data?.recoveryPercent?.value === '' ||
        data?.recoveryPercent?.invalid ||
        this.inValidRecoveryPercent === true
      ) {
        this.invalidValueError = true;
        break;
      }
    }

    if (!this.invalidValueError) {
      this.duplicateValueError = false;
      this.errorDurationValue = null;
      const durationMap = new Map<string, string>();
      for (const data of rowData) {
        if (durationMap.has(data.durationInDays)) {
          this.duplicateValueError = true;
          this.errorDurationValue = data.durationInDays;
          break;
        } else {
          durationMap.set(data.durationInDays, data.durationInDays);
        }
      }
    }

    this.showErrorPopUp();
  }

  showErrorPopUp() {
    if (
      this.invalidValueError ||
      this.duplicateValueError ||
      this.schemeConfigurationForm.invalid
    ) {
      this.tepDetailsError = true;
      let errorMessage;
      if (this.invalidValueError) {
        errorMessage = this.errorMessageForTepNull;
      } else if (this.duplicateValueError) {
        errorMessage =
          this.errorMessageForduplicateValue + this.errorDurationValue;
      } else {
        errorMessage = this.errorMessageLabel;
      }
      if (
        this.dialog.openDialogs.filter(ref => ref === this.errorDialogReference)
          .length === 0
      ) {
        this.alertPopupService.open({
          type: AlertPopupTypeEnum.ERROR,
          message: errorMessage
        });
      }
    } else {
      this.tepDetailsError = false;
    }
  }

  rowEditingStarted() {
    this.editMode = true;
  }

  addData() {
    this.tepRowData = this.getAllRows();
    if (this.add === true) {
      if (this.getAllRows().length > 1 || this.getAllRows().length === 1) {
        if (
          this.invalidValueError === false &&
          this.duplicateValueError === false
        ) {
          this.tepRowData.push({
            isSaved: false,
            durationInDays: '',
            recoveryPercent: ''
          });
          this.gridApi.setRowData(this.tepRowData);
        }
      }
    }
    this.add = false;
  }
  rowValueChanged() {
    this.checkValidation(this.getAllRows());
    this.addData();
    this.editMode = false;
  }
}
