import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { RoleDetail } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-view-role-form',
  templateUrl: './view-role-form.component.html',
  styleUrls: ['./view-role-form.component.scss']
})
export class ViewRoleFormComponent {

  roleForm: FormGroup;
  regExp: RegExp = new RegExp(`^[0-9]*$`, 'i');
  roleNameLable: string;
  descriptionLabel: string;
  accessType = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    private formbuilder: FormBuilder,
    private editRoleFormDialog: MatDialogRef<ViewRoleFormComponent>
  ) {
    this.translateService
      .get([
        'pw.rolemanagementform.rolenamePlaceholderText',
        'pw.rolemanagementform.descriptionPlaceholderText'
      ])
      .subscribe((translatedLabels: any) => {
        this.roleNameLable =
          translatedLabels['pw.rolemanagementform.rolenamePlaceholderText'];
        this.descriptionLabel =
          translatedLabels['pw.rolemanagementform.descriptionPlaceholderText'];
      });
    this.createRoleForm(data.roleDetails);
  }

  createRoleForm(roledata: RoleDetail) {
    this.accessType = roledata.accessType.split('');
    this.roleForm = this.formbuilder.group({
      accessType: '',
      roleName: [
        roledata.roleName,
        [
          this.fieldValidatorsService.requiredField(this.roleNameLable),
          this.fieldValidatorsService.nameWithSpaceField(this.roleNameLable),
          this.fieldValidatorsService.maxLength(100, this.roleNameLable)
        ]
      ],
      roleCode: [roledata.roleCode],
      description: [
        roledata.description,
        [
          this.fieldValidatorsService.requiredField(this.descriptionLabel),
          this.fieldValidatorsService.maxLength(250, this.descriptionLabel),
          this.fieldValidatorsService.descriptionField(this.descriptionLabel)
        ]
      ]
    });

    this.roleForm.disable();

    if (roledata.locationFormats.size !== 0) {
      this.data.locationFormats.forEach((value, key) =>
        this.roleForm.addControl(
          key,
          new FormControl(
            roledata.locationFormats.get(key)
              ? roledata.locationFormats.get(key)
              : 0
          )
        )
      );
    }
  }

  submitForm() {
    if (this.roleForm.valid) {
      const formValue = {
        roleName: this.roleForm.value['roleName'],
        roleCode: this.roleForm.value['roleCode'],
        description: this.roleForm.value['description'],
        addRoleToLocationFormats: [],
        isLocationFormatUpdate: false
      };

      this.data.locationFormats.forEach((value, key) => {
        if (
          this.data.roleDetails.locationFormats.get(key) !==
          this.roleForm.value[key]
        ) {
          formValue['isLocationFormatUpdate'] = true;
        }

        formValue['addRoleToLocationFormats'].push({
          locationFormat: key,
          userLimit: this.roleForm.value[key]
        });
      });

      if (!formValue['isLocationFormatUpdate']) {
        delete formValue['addRoleToLocationFormats'];
      }

      this.editRoleFormDialog.close(formValue);
    } else {
      this.roleForm.markAllAsTouched();
    }
  }
}
