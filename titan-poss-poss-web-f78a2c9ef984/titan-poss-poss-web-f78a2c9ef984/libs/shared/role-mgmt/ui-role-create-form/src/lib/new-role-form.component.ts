import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { TranslateService } from '@ngx-translate/core';
import { RoleTypes, StoreFormatsEnum } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-new-role-form',
  templateUrl: './new-role-form.component.html',
  styleUrls: ['./new-role-form.component.scss']
})
export class NewRoleFormComponent {
  roleForm: FormGroup;
  regExp: RegExp = new RegExp(`^[0-9]*$`, 'i');
  selectedFilterList: string[] = [];
  roleNameLabel: string;
  roleCodeLabel: string;
  descriptionLabel: string;

  accessType = '0';
  regionalUser = false;
  showLocationFormat = false;

  constructor(
    private formbuilder: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private newRoleFormDialog: MatDialogRef<NewRoleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translationService: TranslateService
  ) {
    this.roleNameLabel = this.translationService.instant(
      'pw.rolemanagementform.roleNameLabel'
    );

    this.roleCodeLabel = this.translationService.instant(
      'pw.rolemanagementform.roleCodeLabel'
    );

    this.descriptionLabel = this.translationService.instant(
      'pw.rolemanagementform.descriptionLabel'
    );

    let i;
    for (i = 1; i < data.roleTypes.length; i++) {
      this.accessType = this.accessType + '0';
    }
    this.createRoleForm();
  }

  createRoleForm() {
    this.roleForm = this.formbuilder.group({
      accessType: '',
      roleName: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.roleNameLabel),
          this.fieldValidatorsService.alphabetWithSpaceField(
            this.roleNameLabel
          ),
          this.fieldValidatorsService.maxLength(100, this.roleNameLabel)
        ]
      ],
      roleCode: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.roleCodeLabel),
          this.fieldValidatorsService.roleCodeField(this.roleCodeLabel),
          this.fieldValidatorsService.maxLength(20, this.roleCodeLabel)
        ]
      ],
      description: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.descriptionLabel),
          this.fieldValidatorsService.descriptionField(this.descriptionLabel),
          this.fieldValidatorsService.maxLength(250, this.descriptionLabel)
        ]
      ],
      isLocationMapping: [false, []]
    });
    this.data.locationFormats.forEach((value, key) =>
      this.roleForm.addControl(key, new FormControl(0))
    );
  }

  updateRoleList(event: MatSelectionListChange, roleTypes: any) {
    let index;
    if (event.option.selected) {
      if (event.option.value === RoleTypes.Regional) this.regionalUser = true;
      this.selectedFilterList = [
        ...this.selectedFilterList,
        event.option.value
      ];
      index = roleTypes.findIndex(item => item.code === event.option.value);
      this.accessType =
        this.accessType.substring(0, index) +
        '1' +
        this.accessType.substring(index + 1);
    } else if (!event.option.selected) {
      const valueToRemove = event.option.value;
      if (event.option.value === RoleTypes.Regional) this.regionalUser = false;
      this.selectedFilterList = this.selectedFilterList.filter(
        item => item !== valueToRemove
      );
      index = roleTypes.findIndex(item => item.code === event.option.value);
      this.accessType =
        this.accessType.substring(0, index) +
        '0' +
        this.accessType.substring(index + 1);
    }

    if (
      this.selectedFilterList.includes(RoleTypes.Corporate) ||
      this.selectedFilterList.includes(RoleTypes.Regional) ||
      this.selectedFilterList.length === 0
    )
      this.showLocationFormat = false;
    else this.showLocationFormat = true;
  }

  checkForDisable(isSelected, value): boolean {
    return (
      !isSelected &&
      this.selectedFilterList.length >= 1 &&
      !(
        value === StoreFormatsEnum.L1_STORE &&
        (this.selectedFilterList.includes(StoreFormatsEnum.L2_STORE) ||
          this.selectedFilterList.includes(StoreFormatsEnum.L3_STORE))
      ) &&
      !(
        value === StoreFormatsEnum.L2_STORE &&
        (this.selectedFilterList.includes(StoreFormatsEnum.L1_STORE) ||
          this.selectedFilterList.includes(StoreFormatsEnum.L3_STORE))
      ) &&
      !(
        value === StoreFormatsEnum.L3_STORE &&
        (this.selectedFilterList.includes(StoreFormatsEnum.L1_STORE) ||
          this.selectedFilterList.includes(StoreFormatsEnum.L2_STORE))
      )
    );
  }
  isLocationMapping(checked) {
    this.roleForm.controls['isLocationMapping'].setValue(checked);
  }
  submitForm() {
    if (this.roleForm.valid && this.selectedFilterList.length !== 0) {
      const formValue = {
        accessType: this.accessType,
        roleName: this.roleForm.value['roleName'],
        roleCode: this.roleForm.value['roleCode'],
        description: this.roleForm.value['description'],
        addRoleToLocationFormats: [],
        corpAccess: !this.showLocationFormat,
        isLocationMappingRequired: this.roleForm.value['isLocationMapping']
      };

      this.data.locationFormats.forEach((value, key) =>
        formValue['addRoleToLocationFormats'].push({
          locationFormat: key,
          userLimit: this.roleForm.value[key]
        })
      );

      this.newRoleFormDialog.close(formValue);
    } else {
      this.roleForm.markAllAsTouched();
    }
  }
}
