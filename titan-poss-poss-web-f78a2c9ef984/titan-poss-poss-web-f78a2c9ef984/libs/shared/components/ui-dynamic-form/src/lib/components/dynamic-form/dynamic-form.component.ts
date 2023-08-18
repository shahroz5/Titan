import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup
} from '@angular/forms';

import { PermissionData } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import * as template from '../../template.constant';
import { CommandButton } from '../../interfaces/CommandButton.interface';
import { ButtonType } from '../../enums/commandButton.enum';

@Component({
  selector: 'poss-web-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements AfterViewInit, OnChanges {
  @Input() formFields: any;
  @Input() style: string[];
  @Input() buttonNames: string[];
  @Input() commandButtons: CommandButton[];
  @Input() disabled: boolean;
  @Input() disableSubmit: boolean;
  @Input() enableSubmitOnInvalid: boolean;

  formTemplate: string;

  @Output() customValidation: EventEmitter<FormGroup> = new EventEmitter<
    FormGroup
  >();
  @Output() formGroupCreated: EventEmitter<FormGroup> = new EventEmitter<
    FormGroup
  >();
  @Output() onFormSubmit: EventEmitter<FormGroup> = new EventEmitter<
    FormGroup
  >();
  @Output() invalidForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onFormCancel: EventEmitter<FormGroup> = new EventEmitter<
    FormGroup
  >();
  @Output() selectRefreshClick: EventEmitter<string> = new EventEmitter<
    string
  >();
  @Output() buttonClick: EventEmitter<CommandButton> = new EventEmitter<
    CommandButton
  >();
  @Output() commandButtonsOutput: EventEmitter<
    QueryList<ElementRef>
  > = new EventEmitter<QueryList<ElementRef>>();

  @ViewChildren('commandButtonPanel')
  commandButtonPanel: QueryList<ElementRef>;

  ButtonType = ButtonType;

  fields: any[] = [];

  formId: number;
  form: FormGroup;

  addFormButton: boolean;
  deleteFormButton: boolean;

  oldFields: any[];

  templateConst: any;

  formName: string;
  formDesc: string;

  constructor(private cdr: ChangeDetectorRef) {}

  checkPermission(event: Observable<PermissionData>) {
    event.subscribe();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    if (this.disabled) {
      this.form.disable();
    }

    this.commandButtonsOutput.emit(this.commandButtonPanel);
  }

  ngOnChanges() {
    this.fields = this.formFields.formFields;

    this.formName = this.formFields.formConfig.formName;
    this.formDesc = this.formFields.formConfig.formDesc;
    this.formTemplate = this.formFields.formConfig.formTemplate;

    this.templateConst = template;

    if (this.fields[0].formId !== undefined) {
      this.formId = this.fields[0].formId;
    } else {
      if (this.fields[0].parentFormId !== undefined) {
        this.formId = this.fields[0].parentFormId;
      }
    }

    this.oldFields = JSON.parse(JSON.stringify(this.fields));
    this.removeDependants(this.fields);
    this.buildFormGroup();
    this.initSelectDepedents(this.fields);
  }

  selectRefreshClickEvent(fieldName: string) {
    this.selectRefreshClick.emit(fieldName);
  }

  removeDependants(rdFields: any[]) {
    rdFields.forEach(field => {
      if (field.controlType === 'subForm') {
        this.removeDependants(field.fields);
      } else {
        if (field.dependsOn && field.dependsOn !== '') {
          field.options = [];
        }
      }
    });
  }

  dependantsInSubForm(
    sbFields: any[],
    name: string,
    selectedVal: any,
    dependants: any
  ) {
    sbFields.forEach(field => {
      if (field.controlType === 'subForm') {
        this.dependantsInSubForm(field.fields, name, selectedVal, dependants);
      } else {
        if (field.dependsOn === name) {
          dependants[field.name] = field.options.filter(pro => {
            if (pro.foreignKey === selectedVal) {
              return true;
            } else {
              return false;
            }
          });

          this.selectChange({ selectedVal: '@', name: field.name });
        }
      }
    });
  }

  subFormSelectOptsChange(sbFields: any[], dependants: any) {
    sbFields.forEach(field => {
      this.fieldChanges(field, dependants);
    });
  }

  selectChange(obj: { selectedVal: any; name: string }) {
    const dependants = {};
    // finding dependants
    this.oldFields.forEach(field => {
      if (field.controlType === 'subForm') {
        this.dependantsInSubForm(
          field.fields,
          obj.name,
          obj.selectedVal,
          dependants
        );
      } else {
        if (field.dependsOn === obj.name) {
          dependants[field.name] = field.options.filter(pro => {
            if (pro.foreignKey === obj.selectedVal) {
              return true;
            } else {
              return false;
            }
          });

          this.selectChange({ selectedVal: '@', name: field.name });
        }
      }
    });

    // changing dependant drop downs options
    if (Object.keys(dependants).length !== 0) {
      this.fields.forEach(field => {
        this.fieldChanges(field, dependants);
      });
    }
  }

  fieldChanges(field: any, dependants: any) {
    if (field.controlType === 'subForm') {
      this.subFormSelectOptsChange(field.fields, dependants);
    } else {
      if (dependants[field.name] !== undefined) {
        field.setValue(undefined);
        field.options = dependants[field.name];
      }
    }
  }
  radioValuesInSubForm(name: string, sbFields: any[]) {
    let res: any = {};
    sbFields.forEach(field => {
      if (field.controlType === 'subForm') {
        res = this.radioValuesInSubForm(name, field.fields);
      } else {
        if (field.name === name) {
          res.subForm = field.subForm;
          res.show = field.show;
        }
      }
    });
    return res;
  }

  hideOrShowSubForm(value: boolean, name: string, sbFields: any[]) {
    sbFields.forEach(field => {
      if (field.name === name) {
        field.hide = value;
      } else {
        if (field.controlType === 'subForm') {
          this.hideOrShowSubForm(true, name, field.fields);
        }
      }
    });
  }

  radioChange(obj: { name: string; value: string }) {
    let subForm = '';
    let show = '';

    let res: any;

    // get show and subForm values in radio
    this.fields.forEach(field => {
      if (field.controlType === 'subForm') {
        res = this.radioValuesInSubForm(obj.name, field.fields);
        if (res.subForm !== undefined && res.show !== undefined) {
          subForm = res.subForm;
          show = res.show;
        }
      } else {
        if (field.name === obj.name) {
          subForm = field.subForm;
          show = field.show;
        }
      }
    });

    // Here is where you need to catch...
    // hide or show subForm based on show value

    if (subForm.length && show.length) {
      const subFormIndex = show.indexOf(obj.value);
      if (subFormIndex === -1) {
        this.fields.forEach(field => {
          if (field.name === subForm) {
            field.hide = true;
          } else {
            if (field.controlType === 'subForm') {
              this.hideOrShowSubForm(true, subForm, field.fields);
            }
          }
        });
      } else {
        this.fields.forEach(field => {
          field.hide = true;
        });

        this.fields.forEach(field => {
          field.hide = true;
          if (field.name === subForm[subFormIndex]) {
            field.hide = false;
          } else {
            if (field.controlType === 'subForm') {
              this.hideOrShowSubForm(false, subForm, field.fields);
            }
          }
        });
      }
    }
  }

  private checkBoxCheckedFn(field: any) {
    let checked = false;

    return field.options.map((opt: { selectedKey: any }) => {
      checked = false;
      if (opt.selectedKey) {
        checked = true;
      }
      return new FormControl(checked);
    });
  }

  private buildFormGroup() {
    const formGroup: { [key: string]: AbstractControl } = {};
    this.fields.forEach(field => {
      if (field.controlType === 'subForm') {
        if (!field.hide) {
          formGroup[field.name] = this.buildSubFormGroup(field.fields);
        }
      } else {
        if (
          field.controlType === 'checkbox' ||
          field.controlType === 'toggle'
        ) {
          const controls = this.checkBoxCheckedFn(field);
          formGroup[field.name] = new FormArray(controls);
        } else {
          formGroup[field.name] = field;
        }
      }
    });

    this.form = new FormGroup(formGroup);
    this.formGroupCreated.emit(this.form);
    this.customValidation.emit(this.form);
    this.cdr.detectChanges();
  }

  buildSubFormGroup(fields: any[]) {
    const subFormGroup: { [key: string]: AbstractControl } = {};
    fields.forEach(field => {
      if (field.controlType === 'subForm') {
        if (!field.hide) {
          subFormGroup[field.name] = this.buildSubFormGroup(field.fields);
        }
      } else {
        if (field.controlType === 'checkbox') {
          const controls = this.checkBoxCheckedFn(field);
          subFormGroup[field.name] = new FormArray(controls);
        } else {
          subFormGroup[field.name] = field;
        }
      }
    });

    return new FormGroup(subFormGroup);
  }

  public onAddForm() {
    if (!this.form.invalid) {
      this.onFormSubmit.emit(this.form);
    } else {
      this.invalidForm.emit(true);
      this.form.markAllAsTouched();
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public onDeleteForm() {
    this.onFormCancel.emit(this.form);
  }

  checkBoxChange(obj: {
    name: string;
    value: string;
    option: any[];
    index: number;
    subformName: string;
  }) {
    let val = [];
    if (obj.subformName) {
      val = this.form.get(obj.subformName).get(obj.name).value;
    } else {
      val = this.form.get(obj.name).value;
    }

    const checkVal = val[obj.index];

    for (let i = 0; i < obj.option.length; i++) {
      if (obj.option[i].foreignKey === obj.value) {
        val[i] = !checkVal;
      }
    }

    if (obj.subformName) {
      this.form.get(obj.subformName).get(obj.name).patchValue(val);
    } else {
      this.form.get(obj.name).patchValue(val);
    }
  }

  initSelectDepedents(sbFields: any[], subFormName?: string) {
    const dependantControls: any[] = [];
    sbFields.forEach(field => {
      if (field.controlType === 'subForm') {
        this.initSelectDepedents(field.fields, field.name);
      } else {
        if (
          field.controlType === 'select' ||
          field.controlType === 'refreshSelect' ||
          field.controlType === 'multiselect'
        ) {
          const selected = field.options.filter(pros => pros.selectedKey)[0];
          if (selected) {
            this.selectChange({
              selectedVal: selected.value,
              name: field.name
            });
            if (selected.foreignKey) {
              dependantControls.push({
                subFormName,
                name: field.name,
                value: selected.value
              });
            }
          }
        }
      }
    });

    if (dependantControls.length) {
      dependantControls.forEach(control => {
        if (control.subFormName) {
          this.form
            .get(control.subFormName)
            .get(control.name)
            .patchValue(control.value);
        } else {
          this.form.get(control.name).patchValue(control.value);
        }
      });
    }
  }

  emitButton(
    btn: { name: string; type: ButtonType; disableNonDirty: boolean },
    i: number
  ) {
    if (btn.type === ButtonType.SUBMIT) {
      this.onAddForm();
    } else if (btn.type === ButtonType.CANCEL) {
      this.onDeleteForm();
    } else {
      this.buttonClick.emit({ ...btn, i });
    }
  }
}
