import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertPopupServiceAbstraction,
  ConfigTypeEnum,
  GrnApprovalConfig,
  GrnApprovalConfigResponse,
  AlertPopupTypeEnum,
  RoleList,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import {
  fieldValidation,
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  InputValidatorComponent,
  DeleteRowComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { ErrorPopUpComponent } from '../error-pop-up/error-pop-up.component';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-grn-approval-config-detail-item',
  templateUrl: './grn-approval-config-detail-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrnApprovalConfigDetailItemComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() grnApprovalConfig$: Observable<GrnApprovalConfigResponse>;
  @Input() roleList$: Observable<RoleList[]>;
  @Input() permissions$: Observable<any[]>;

  @Output() saveGrnApprovalConfig = new EventEmitter<GrnApprovalConfig>();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  configDetail = null;

  grnTypeList = [
    {
      value: 'GRN_APPROVAL_ACCESS_REGULAR',
      description: 'Regular'
    },
    {
      value: 'GRN_APPROVAL_ACCESS_MFG_DEFECT',
      description: 'Manufacturing Defect'
    }
  ];

  grnDescription: string;

  approveTypeList = ['EMAIL', 'CODE'];

  configTypeEnumRef = ConfigTypeEnum;

  destroy$ = new Subject<any>();
  ruleId: string;
  ruleType: string;
  grnApprovalConfigForm: FormGroup;
  residualValueAmountLabel: string;

  rowHeight = 40;
  animateRows = true;
  rowData = [];
  objCategoryMappings = {};
  domLayout = 'autoHeight';
  editable = false;
  columnDefs = [];
  translatedMessages: [];
  api: GridApi;
  isAdd = true;
  errorDialogReference;
  addRowData = false;
  valueEmpty: boolean;
  selectedRowIndex: number;
  isNumber: boolean;
  isValid = true;
  noConfig: boolean;
  roleList: any;
  originalRoleList: any;
  fromValueGreaterThanTo: boolean;

  constructor(
    public activatedRoute: ActivatedRoute,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private elementPermission: ElementPermissionService
  ) {
    this.translateService
      .get([
        'pw.grnApprovalConfig.approverLabel',
        'pw.grnApprovalConfig.approveTypeLabel',
        'pw.grnApprovalConfig.fromNumberLabel',
        'pw.grnApprovalConfig.toNumberLabel',
        'pw.grnApprovalConfig.upperLimitLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.translatedMessages = translatedMessages;
        this.columnDefinitions(this.translatedMessages);
      });
  }

  columnDefinitions(translatedMessages: any) {
    this.columnDefs = [
      {
        headerName: translatedMessages['pw.grnApprovalConfig.approverLabel'],
        field: 'roleCode',
        editable: false,
        resizable: true,
        minWidth: 100
      },
      {
        headerName: translatedMessages['pw.grnApprovalConfig.approveTypeLabel'],
        field: 'processType',
        minWidth: 100,
        cellEditorSelector: params => {
          this.objCategoryMappings = {};
          params.data.approveTypes.forEach(element => {
            this.objCategoryMappings[`${element}`] = `${element}`;
          });
          return {
            component: 'agSelectCellEditor',
            params: {
              values: this.extractValues(this.objCategoryMappings)
            }
          };
        },
        valueFormatter: params => {
          if (params.data !== null && params?.data !== undefined) {
            if (params.data.processType !== '') {
              const obj = params.data.approveTypes.filter(
                itemTypes => itemTypes === params.value
              );
              return obj[0]?.value;
            }
          } else {
            return this.lookupValue(this.objCategoryMappings, params.value);
          }
        },
        editable: true,
        singleClickEdit: true,
        resizable: true
      },

      {
        headerName: translatedMessages['pw.grnApprovalConfig.fromNumberLabel'],
        field: 'fromDays',
        resizable: true,
        editable: true,
        cellEditor: 'inputValidator',
        cellClass: 'pw-form-input-width',
        suppressSizeToFit: true,
        singleClickEdit: true,
        valueFormatter: param => {
          if (typeof param.value === 'object') {
            if (param.value.value) {
              return param.value.value;
            } else {
              return '';
            }
          } else {
            return param.value;
          }
        },
        cellClassRules: {
          'pw-gray-border': param => {
            return param.value.isValid === true;
          },
          'pw-error-border': param => {
            return param.value.isValid === false && param.value.value !== '';
          }
        }
      },
      {
        headerName: translatedMessages['pw.grnApprovalConfig.toNumberLabel'],
        field: 'tillDays',
        cellClass: 'pw-form-input-width',
        resizable: true,
        editable: true,
        suppressSizeToFit: true,
        singleClickEdit: true,
        cellEditor: 'inputValidator',
        valueFormatter: params => {
          if (typeof params.value === 'object') {
            if (params.value.value) {
              return params.value.value;
            } else {
              return '';
            }
          } else {
            return params.value;
          }
        },
        cellClassRules: {
          'pw-gray-border': params => {
            return params.value.isValid === true;
          },
          'pw-error-border': params => {
            return params.value.isValid === false && params.value.value !== '';
          }
        }
      },
      {
        headerName: translatedMessages['pw.grnApprovalConfig.upperLimitLabel'],
        field: 'upperLimit',
        cellClass: 'pw-form-input-width',
        resizable: true,
        editable: true,
        minWidth: 100,
        suppressSizeToFit: true,
        singleClickEdit: true,
        cellEditor: 'inputValidator',
        valueFormatter: params => {
          if (params.value === undefined || params.value === '') {
            return '';
          } else if (
            typeof params.value === 'object' &&
            typeof params.value !== null
          ) {
            if (params.value && params.value.value) {
              return Number(params.value.value);
            } else {
              return '';
            }
          } else {
            return Number(params.value);
          }
        }
      },

      {
        headerName: '',
        field: 'id',
        cellRenderer: 'deleteRowRenderer',
        width: 21,
        minWidth: 21,
        maxWidth: 21,
        cellClass: 'pw-delete-icon-width',
        headerClass: 'pw-delete-icon-width',
        suppressMovable: true,
        onCellClicked: this.openConfirmDialogForDelete.bind(this)
      }
    ];
  }

  onCellKeyPress(pressEvent) {
    const keyPressed = pressEvent.event.key;
    if (keyPressed === 'Enter') {
      if (pressEvent.colDef.cellRenderer === 'deleteRowRenderer') {
        this.openConfirmDialogForDelete(pressEvent);
      }
    }
  }

  openConfirmDialogForDelete(data: any) {
    if (this.configDetail?.description !== '' && !this.configDetail?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountProductGroupMapping.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.remove(data);
          }
        });
    }
  }

  openConfirmDialogForSave(data: any) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.remove(data);
        }
      });
  }

  remove(params) {
    this.api.stopEditing();
    this.api.applyTransaction({ remove: [params.data] });
    this.api.redrawRows();
    let configDetailData = [];
    if (this.getAllRows().length > 0) {
      configDetailData = this.getAllRows().map(obj => ({
        ...obj,
        roleCode:
          typeof obj.roleCode === 'object' ? obj.roleCode.value : obj.roleCode,

        processType:
          typeof obj.processType === 'object'
            ? obj.processType.value
            : obj.processType,
        approveTypes: this.approveTypeList,
        fromDays:
          typeof obj.fromDays === 'object' ? obj.fromDays.value : obj.fromDays,
        tillDays:
          typeof obj.tillDays === 'object' ? obj.tillDays.value : obj.tillDays,
        upperLimit:
          typeof obj.upperLimit === 'object'
            ? obj.upperLimit.value
            : obj.upperLimit
      }));
    } else {
      configDetailData.splice(this.selectedRowIndex + 1, 0);
    }

    this.api.setRowData(configDetailData);
    const roleRemoved = this.originalRoleList.find(
      role => role.value === params.data.roleCode
    );
    if (roleRemoved) {
      this.roleList.push(roleRemoved);
    }

    this.isAdd = true;
    this.isValid = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grnApprovalConfig$']) {
      this.grnApprovalConfig$
        .pipe(takeUntil(this.destroy$))
        .subscribe(cnDetail => {
          this.configDetail = cnDetail;
        });
      if (this.configDetail && this.configDetail.config) {
        this.rowData = [];
        if (
          this.configDetail.config &&
          this.configDetail.config.length > 0 &&
          this.configDetail.config !== undefined
        ) {
          for (const details of this.configDetail.config)
            this.rowData.push({
              roleCode: details ? details.roleCode : '',
              processType: details ? details.processType : '',
              fromDays: details ? details.fromDays : '',
              tillDays: details ? details.tillDays : '',
              upperLimit: details ? details.upperLimit : '',
              id: '',
              approveTypes: this.approveTypeList
            });
          this.initForm(this.configDetail);
        } else {
          this.rowData.push({
            roleCode: '',
            processType: '',
            fromDays: '',
            tillDays: '',
            upperLimit: '',
            id: '',
            approveTypes: this.approveTypeList
          });
        }
        if (this.configDetail.config) {
          this.editable = true;
          this.columnDefinitions(this.translatedMessages);
        }
      }
    }
  }

  locationMapping() {
    if (this.configDetail?.description !== '' && !this.configDetail?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.openLocationMappingEvent.emit(true);
  }

  extractValues(mappings) {
    return Object.keys(mappings);
  }

  lookupValue(mappings, key) {
    return mappings[key];
  }

  addRow(roleCode) {
    if (this.configDetail?.description !== '' && !this.configDetail?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.addRowData = true;

      this.checkValidation(this.getAllRows(), roleCode);
    }
  }

  checkValidation(rowData, roleCode) {
    let currentRowData;
    this.selectedRowIndex = this.getAllRows().length;

    currentRowData = rowData[this.selectedRowIndex - 1];

    if (
      (typeof currentRowData?.processType === 'object'
        ? currentRowData?.processType.value === ''
        : currentRowData?.processType === '') ||
      (typeof currentRowData?.fromDays === 'object'
        ? currentRowData?.fromDays.value === ''
        : currentRowData?.fromDays === '') ||
      (typeof currentRowData?.tillDays === 'object'
        ? currentRowData?.tillDays.value === ''
        : currentRowData?.tillDays === '')
    ) {
      if (this.getAllRows().length > 0) {
        this.valueEmpty = true;
      } else {
        this.valueEmpty = false;
      }
    } else {
      this.valueEmpty = false;
    }

    const pattern = fieldValidation.daysField.pattern;
    if (!this.valueEmpty && this.getAllRows().length > 0) {
      if (
        (typeof currentRowData?.fromDays === 'object'
          ? pattern.test(currentRowData?.fromDays?.value)
          : pattern.test(currentRowData?.fromDays)) &&
        (typeof currentRowData?.tillDays === 'object'
          ? pattern.test(currentRowData?.tillDays?.value)
          : pattern.test(currentRowData?.tillDays))
      ) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    }

    if (
      currentRowData?.upperLimit &&
      (typeof currentRowData?.upperLimit === 'object' &&
      currentRowData?.upperLimit.value !== ''
        ? Number(currentRowData?.upperLimit?.value) <= 0
        : Number(currentRowData?.upperLimit) <= 0)
    ) {
      this.isValid = false;
    }

    if (!this.valueEmpty && this.isValid && this.getAllRows().length > 0) {
      if (
        Number(
          typeof currentRowData?.fromDays === 'object'
            ? currentRowData?.fromDays?.value
            : currentRowData?.fromDays
        ) >=
        Number(
          typeof currentRowData?.tillDays === 'object'
            ? currentRowData?.tillDays?.value
            : currentRowData?.tillDays
        )
      ) {
        this.fromValueGreaterThanTo = true;
      } else {
        this.fromValueGreaterThanTo = false;
      }
    }

    if (this.valueEmpty === true) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.ERROR,
          message: 'pw.alertPopup.valueEmptyText'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    } else if (this.fromValueGreaterThanTo === true) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.ERROR,
          message: 'pw.alertPopup.fromValueGreaterThanToText'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    } else if (this.isValid === false) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.ERROR,
          message: 'pw.alertPopup.isValidText'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }

    if (!this.valueEmpty && !this.fromValueGreaterThanTo && this.isValid) {
      this.addData(roleCode);
    }
  }

  showErrorPopUp() {
    if (
      this.valueEmpty ||
      this.noConfig ||
      this.fromValueGreaterThanTo ||
      !this.isValid
    ) {
      if (
        this.dialog.openDialogs.filter(ref => ref === this.errorDialogReference)
          .length === 0
      ) {
        this.errorDialogReference = this.dialog.open(ErrorPopUpComponent, {
          width: '500px',
          height: 'auto',
          disableClose: true,
          data: {
            valueEmpty: this.valueEmpty,
            noConfig: this.noConfig,
            fromValueGreaterThanTo: this.fromValueGreaterThanTo,
            isValid: this.isValid
          }
        });
        this.errorDialogReference
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.valueEmpty = null;
            this.noConfig = null;
            this.fromValueGreaterThanTo = null;
            this.isValid = null;
          });
      }
    } else {
    }
  }
  addData(roleCode) {
    if (
      this.addRowData === true &&
      !this.valueEmpty &&
      !this.fromValueGreaterThanTo
    ) {
      const gridData = this.getAllRows();
      this.editable = false;
      this.columnDefinitions(this.translatedMessages);
      gridData.splice(this.selectedRowIndex + 1, 0, {
        roleCode: roleCode,
        processType: '',
        fromDays: '',
        tillDays: '',
        upperLimit: '',
        approveTypes: this.approveTypeList,
        id: ''
      });
      this.api.setRowData(gridData);
      this.addRowData = false;
      const gridRoleCode = gridData.map(grid => grid.roleCode);
      this.grnApprovalConfigForm.get('approvedBy').patchValue('');
      this.roleList = this.roleList.filter(
        role => !gridRoleCode.includes(role.value)
      );
    }
  }

  getAllRows() {
    const rowData = [];
    this.api.forEachNode(node => rowData.push(node.data));

    return rowData;
  }

  getContext() {
    return {
      validators: {
        fromDays: [
          this.fieldValidatorsService.requiredField(
            this.translatedMessages['pw.grnApprovalConfig.fromNumberLabel']
          ),
          this.fieldValidatorsService.daysField(
            this.translatedMessages['pw.grnApprovalConfig.fromNumberLabel']
          )
        ],
        tillDays: [
          this.fieldValidatorsService.requiredField(
            this.translatedMessages['pw.grnApprovalConfig.toNumberLabel']
          ),
          this.fieldValidatorsService.daysField(
            this.translatedMessages['pw.grnApprovalConfig.toNumberLabel']
          )
        ],
        upperLimit: [
          this.fieldValidatorsService.min(
            1,
            this.translatedMessages['pw.grnApprovalConfig.upperLimitLabel']
          )
        ]
      }
    };
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      deleteRowRenderer: DeleteRowComponent
    };
  }

  onGridSizeChanged(params: GridReadyEvent) {
    if (window.innerWidth >= 991) {
      params.api.sizeColumnsToFit();
    }
  }

  initForm(grnApprovalConfigDetails: GrnApprovalConfigResponse) {
    this.translateService
      .get([
        'pw.grnApprovalConfig.grnTypeLabel',
        'pw.grnApprovalConfig.configNameLabel',
        'pw.grnApprovalConfig.approveTypeLabel',
        'pw.grnApprovalConfig.fromNumberLabel',
        'pw.grnApprovalConfig.toNumberLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.grnApprovalConfigForm = new FormGroup({
          grnType: new FormControl(
            grnApprovalConfigDetails.ruleType
              ? grnApprovalConfigDetails.ruleType
              : '',
            [
              this.fieldValidatorsService.requiredField(
                translatedMessages['pw.grnApprovalConfig.grnTypeLabel']
              )
            ]
          ),
          grnTypeInput: new FormControl(
            grnApprovalConfigDetails.ruleType ? this.getGRNTypeValue() : ''
          ),
          configName: new FormControl(
            grnApprovalConfigDetails.description
              ? grnApprovalConfigDetails.description
              : '',
            [
              this.fieldValidatorsService.requiredField(
                translatedMessages['pw.grnApprovalConfig.configNameLabel']
              ),
              this.fieldValidatorsService.nameWithSpaceField(
                translatedMessages['pw.grnApprovalConfig.configNameLabel']
              )
            ]
          ),
          isActive: new FormControl(
            grnApprovalConfigDetails.isActive
              ? grnApprovalConfigDetails.isActive
              : false
          ),
          approvedBy: new FormControl('')
        });
        if (grnApprovalConfigDetails && grnApprovalConfigDetails.config) {
          grnApprovalConfigDetails.config.forEach((configDetails, index) => {
            this.grnApprovalConfigForm.addControl(
              index.toString(),
              new FormGroup({
                roleCode: new FormControl(
                  configDetails ? configDetails.roleCode : ''
                ),
                processType: new FormControl(
                  configDetails ? configDetails.processType : '',
                  [
                    this.fieldValidatorsService.requiredField(
                      translatedMessages[
                        'pw.grnApprovalConfig.approveTypeLabel'
                      ]
                    )
                  ]
                ),
                fromDays: new FormControl(
                  configDetails ? configDetails.fromDays : '',
                  [
                    this.fieldValidatorsService.requiredField(
                      translatedMessages['pw.grnApprovalConfig.fromNumberLabel']
                    )
                  ]
                ),
                tillDays: new FormControl(
                  configDetails ? configDetails.tillDays : '',
                  [
                    this.fieldValidatorsService.requiredField(
                      translatedMessages['pw.grnApprovalConfig.toNumberLabel']
                    )
                  ]
                ),
                upperLimit: new FormControl(
                  configDetails ? configDetails.upperLimit : ''
                )
              })
            );
          });
        }
      });

    if (this.ruleId !== 'new') {
      this.grnApprovalConfigForm.get('grnTypeInput').disable();
      this.grnApprovalConfigForm.get('configName').disable();
    }
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.ruleId = params['_ruleId'];
        this.ruleType = params['_ruleType'];
      });

    this.roleList$.pipe(takeUntil(this.destroy$)).subscribe(roleListData => {
      if (roleListData) {
        const roleList = roleListData.filter(x => x.isActive);
        if (roleList) {
          this.roleList = roleList.map(roles => ({
            value: roles.roleCode,
            description: roles.roleName
          }));
          this.originalRoleList = roleList.map(roles => ({
            value: roles.roleCode,
            description: roles.roleName
          }));
          if (this.roleList && this.rowData) {
            const gridRoleCode = this.rowData.map(grid => grid.roleCode);
            this.roleList = this.roleList.filter(
              role => !gridRoleCode.includes(role.value)
            );
          }
        }
      }
    });

    this.grnApprovalConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cnDetail => {
        if (cnDetail) {
          this.initForm(cnDetail);
          this.ruleId = cnDetail.ruleId;
          this.ruleType = cnDetail.ruleType;

          this.configDetail = cnDetail;
          if (this.ruleId !== 'new') {
            this.grnApprovalConfigForm.get('grnTypeInput').disable();
            this.grnApprovalConfigForm.get('grnType').disable();
            this.grnApprovalConfigForm.get('configName').disable();
            this.grnDescription =
              this.ruleType === ConfigTypeEnum.GRN_APPROVAL_ACCESS_REGULAR
                ? 'Regular'
                : 'Manufacturing Defect';
          }
        }
      });
    if (this.ruleId !== 'new') {
      this.grnApprovalConfigForm.get('grnTypeInput').disable();
      this.grnApprovalConfigForm.get('configName').disable();
    }
  }

  onCellValueChanged(changeEvent) {
    if (changeEvent.value !== undefined) {
      if (
        changeEvent.value?.value !== '' &&
        changeEvent.value?.value !== null
      ) {
        this.isAdd = changeEvent.value?.isValid;
        if (changeEvent.id !== '') {
          switch (changeEvent.colDef.field) {
            case 'processType': {
              this.grnApprovalConfigForm.patchValue({
                processType: changeEvent.data.processType
              });
              this.editable = true;
              this.columnDefinitions(this.translatedMessages);
              break;
            }
            case 'fromDays': {
              if (
                changeEvent.newValue.value !== '' &&
                changeEvent.newValue.value
              ) {
                this.isValid = changeEvent.newValue.isValid;
                this.grnApprovalConfigForm.patchValue({
                  fromDays: changeEvent.value.value
                });
              }
              break;
            }
            case 'tillDays': {
              if (
                changeEvent.newValue.value !== '' &&
                changeEvent.newValue.value
              ) {
                this.isValid = changeEvent.newValue.isValid;
                this.grnApprovalConfigForm.patchValue({
                  tillDays: changeEvent.value.value
                });
              }
              break;
            }
            case 'upperLimit': {
              if (
                changeEvent.newValue.value !== '' &&
                changeEvent.newValue.value
              ) {
                this.isValid = changeEvent.newValue.isValid;
                this.grnApprovalConfigForm.patchValue({
                  upperLimit: changeEvent.value.value
                });
              }
              break;
            }
          }
        } else {
          switch (changeEvent.colDef.field) {
            case 'processType': {
              this.isValid = changeEvent.value.isValid;
              this.editable = true;
              this.columnDefinitions(this.translatedMessages);
              break;
            }
          }
        }
      }
    }
  }

  saveDetail() {
    if (this.configDetail?.description !== '' && !this.configDetail?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.getAllRows().length === 0) {
        this.noConfig = true;
        if (this.noConfig === true) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.ERROR,
              message: 'pw.alertPopup.isConfigText'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        }
      } else {
        this.noConfig = false;
      }
      if (this.grnApprovalConfigForm.valid && this.getAllRows().length > 0) {
        this.api.stopEditing();
        this.addRowData = false;
        this.checkValidation(this.getAllRows(), '');
        if (!this.valueEmpty && !this.fromValueGreaterThanTo && this.isValid) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                if (
                  this.valueEmpty === false &&
                  this.fromValueGreaterThanTo === false &&
                  this.isValid
                ) {
                  const payload = this.prepareResponse();
                  this.saveGrnApprovalConfig.emit(payload);
                }
              }
            });
        }
      }
    }
  }
  showMessage(key: string) {
    this.translateService
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }
  prepareResponse() {
    const addGrnDetails = [];
    for (const grn of this.getAllRows()) {
      if (grn.id === '' || grn.id === undefined || grn.id === null) {
        if (grn.upperLimit) {
          addGrnDetails.push({
            roleCode:
              typeof grn.roleCode === 'object'
                ? grn.roleCode.value
                : grn.roleCode,

            processType:
              typeof grn.processType === 'object'
                ? grn.processType.value
                : grn.processType,
            fromDays:
              typeof grn.fromDays === 'object'
                ? Number(grn.fromDays.value)
                : Number(grn.fromDays),
            tillDays:
              typeof grn.tillDays === 'object'
                ? Number(grn.tillDays.value)
                : Number(grn.tillDays),
            upperLimit:
              typeof grn.upperLimit === 'object'
                ? grn.upperLimit.value
                  ? Number(grn.upperLimit.value)
                  : null
                : Number(grn.upperLimit)
          });
        } else {
          addGrnDetails.push({
            roleCode:
              typeof grn.roleCode === 'object'
                ? grn.roleCode.value
                : grn.roleCode,

            processType:
              typeof grn.processType === 'object'
                ? grn.processType.value
                : grn.processType,
            fromDays:
              typeof grn.fromDays === 'object'
                ? Number(grn.fromDays.value)
                : Number(grn.fromDays),
            tillDays:
              typeof grn.tillDays === 'object'
                ? Number(grn.tillDays.value)
                : Number(grn.tillDays)
          });
        }
      }
    }
    const formValues = this.grnApprovalConfigForm.getRawValue();
    const saveGrnApprovalConfig = {
      description: formValues.configName,
      isActive: formValues.isActive,
      ruleType: formValues.grnType,
      ruleDetails: {
        data: {
          config: addGrnDetails
        },
        type: formValues.grnType
      }
    };

    return saveGrnApprovalConfig;
  }

  getGRNTypeValue() {
    if (this.ruleType) {
      const selectedCnType = this.grnTypeList.find(
        grnType => grnType.value === this.ruleType
      );
      return selectedCnType.description;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
