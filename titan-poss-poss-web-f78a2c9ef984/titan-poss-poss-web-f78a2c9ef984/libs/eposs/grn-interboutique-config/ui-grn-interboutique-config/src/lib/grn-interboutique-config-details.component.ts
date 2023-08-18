import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  AlertPopupServiceAbstraction,
  GrnInterboutiqueConfig,
  GrnInterboutiqueConfigConfig,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';

@Component({
  selector: 'poss-web-grn-interboutique-config-details',
  templateUrl: './grn-interboutique-config-details.component.html'
})
export class GrnInterboutiqueConfigDetailsComponent
  implements OnInit, OnDestroy {
  destroy$ = new Subject<null>();

  grnInterboutiqueConfigForm: FormGroup;

  @Input() grnInterboutiqueConfig: GrnInterboutiqueConfig;
  @Input() permissions$: Observable<any[]>;

  @Output() grnInterboutiqueConfigDetailsForm = new EventEmitter<{
    form: GrnInterboutiqueConfig;
    mode: boolean;
  }>();

  ADD_EDIT_PERMISSION = 'Configurations_grnInteboutique_addEditPermission';

  constructor(
    public dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private elementPermission: ElementPermissionService
  ) {}

  ngOnInit(): void {
    this.grnInterboutiqueConfigForm = new FormGroup({
      L1toL1: new FormControl(
        this.grnInterboutiqueConfig.ruleDetails.data.config.L1.includes('L1')
      ),
      L1toL2: new FormControl(
        this.grnInterboutiqueConfig.ruleDetails.data.config.L1.includes('L2')
      ),
      L1toL3: new FormControl(
        this.grnInterboutiqueConfig.ruleDetails.data.config.L1.includes('L3')
      ),
      L2toL1: new FormControl(
        this.grnInterboutiqueConfig.ruleDetails.data.config.L2.includes('L1')
      ),
      L2toL2: new FormControl(
        this.grnInterboutiqueConfig.ruleDetails.data.config.L2.includes('L2')
      ),
      L2toL3: new FormControl(
        this.grnInterboutiqueConfig.ruleDetails.data.config.L2.includes('L3')
      ),
      L3toL1: new FormControl(
        this.grnInterboutiqueConfig.ruleDetails.data.config.L3.includes('L1')
      ),
      L3toL2: new FormControl(
        this.grnInterboutiqueConfig.ruleDetails.data.config.L3.includes('L2')
      ),
      L3toL3: new FormControl(
        this.grnInterboutiqueConfig.ruleDetails.data.config.L3.includes('L3')
      )
    });
  }

  onSubmit() {
    const formValues = this.grnInterboutiqueConfigForm.getRawValue();
    const L1: string[] = [];
    const L2: string[] = [];
    const L3: string[] = [];

    if (formValues.L1toL1) {
      L1.push('L1');
    }
    if (formValues.L1toL2) {
      L1.push('L2');
    }
    if (formValues.L1toL3) {
      L1.push('L3');
    }

    if (formValues.L2toL1) {
      L2.push('L1');
    }
    if (formValues.L2toL2) {
      L2.push('L2');
    }
    if (formValues.L2toL3) {
      L2.push('L3');
    }

    if (formValues.L3toL1) {
      L3.push('L1');
    }
    if (formValues.L3toL2) {
      L3.push('L2');
    }
    if (formValues.L3toL3) {
      L3.push('L3');
    }

    const configData: GrnInterboutiqueConfigConfig = {
      L1,
      L2,
      L3
    };

    const mode = false; // true=New; false=Edit, this will never be new, we always have one default record.
    // let ruleId = 1;
    // if (this.grnInterboutiqueConfig.ruleId === 1) {
    //   mode = false;
    //   ruleId = this.grnInterboutiqueConfig.ruleId
    // }

    const formData: GrnInterboutiqueConfig = {
      ...this.grnInterboutiqueConfig,
      ruleId: this.grnInterboutiqueConfig.ruleId,
      ruleDetails: {
        type: this.grnInterboutiqueConfig.ruleDetails.type,
        data: {
          type: this.grnInterboutiqueConfig.ruleDetails.data.type,
          config: configData
        }
      }
    };
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.grnInterboutiqueConfigDetailsForm.emit({ form: formData, mode });
        }
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
