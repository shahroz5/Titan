import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TEPExceptionConfigFilter } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-tep-exception-filter',
  templateUrl: './tep-exception-filter.component.html',
  styleUrls: ['./tep-exception-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepExceptionFilterComponent implements OnInit {
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<TepExceptionFilterComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: TEPExceptionConfigFilter,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }

  dialogData: TEPExceptionConfigFilter;
  filterForm: FormGroup;

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      configName: new FormControl(this.dialogData?.configName || ''),
      variantCode: new FormControl(this.dialogData?.variantCode || '')
    });
  }

  onSubmit() {
    const filterForm = this.filterForm.getRawValue();

    this.dialogRef.close({
      configName: filterForm.configName,
      variantCode: filterForm.variantCode
    });
  }

  clear() {
    this.filterForm.reset();
  }

  onClose() {
    this.dialogRef.close();
  }
}
