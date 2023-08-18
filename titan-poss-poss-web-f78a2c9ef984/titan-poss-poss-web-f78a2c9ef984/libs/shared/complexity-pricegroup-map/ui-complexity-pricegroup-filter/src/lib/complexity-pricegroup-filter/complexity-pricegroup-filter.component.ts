import { 
  ChangeDetectionStrategy, 
  Component, 
  Inject, 
  OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { ComplexityPricegroupFilter } from '@poss-web/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-complexity-pricegroup-filter',
  templateUrl: './complexity-pricegroup-filter.component.html',
  styleUrls: ['./complexity-pricegroup-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplexityPricegroupFilterComponent implements OnInit {

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<ComplexityPricegroupFilterComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ComplexityPricegroupFilter,
    public dialog: MatDialog
  ) {
    this.dialogData = data;
  }

  dialogData: ComplexityPricegroupFilter;
  filterForm: FormGroup;

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      complexityCode: new FormControl(this.dialogData?.complexityCode || ''),
      priceGroup: new FormControl(this.dialogData?.priceGroup || '')
    });
  }

  onSubmit() {
    const filterForm = this.filterForm.getRawValue();

    this.dialogRef.close({
      complexityCode: filterForm.complexityCode,
      priceGroup: filterForm.priceGroup
    });
  }

  clear() {
    this.filterForm.reset();
  }

  onClose() {
    this.dialogRef.close();
  }

}
