import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-fiscal-year',
  templateUrl: './fiscal-year.component.html',
  styleUrls: ['./fiscal-year.component.scss']
})
export class FiscalYearComponent implements OnChanges, OnDestroy {
  @Input() currentFiscalYear: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() control = new FormControl();
  @Input() placeHolder;
  @Output() fiscalYear = new EventEmitter();
  @Input() data = null;
  fiscalYearForm: FormGroup;
  destroy$ = new Subject<null>();
  constructor(private fieldValidatorsService: FieldValidatorsService) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentFiscalYear'] || changes['data']) {
      if (this.data && this.data !== '') {
        this.control.patchValue(this.data ? this.data : '');
      } else if (this.currentFiscalYear) {
        this.control.patchValue(this.currentFiscalYear);
        this.control.setValidators([
          this.fieldValidatorsService.fiscalYearField('Fiscal Year'),
          this.fieldValidatorsService.max(
            Number(this.currentFiscalYear),
            'Fiscal Year'
          )
        ]);
        this.control.updateValueAndValidity();
      }
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }
    if (changes['required']) {
      const fiscalYearCtrl = this.control;
      if (this.required) {
        this.control.setValidators([
          this.fieldValidatorsService.requiredField('Fiscal Year'),
          this.fieldValidatorsService.fiscalYearField('Fiscal Year'),
          this.fieldValidatorsService.max(
            Number(this.currentFiscalYear),
            'Fiscal Year'
          )
        ]);
      } else {
        this.control.setValidators([
          this.fieldValidatorsService.fiscalYearField('Fiscal Year'),
          this.fieldValidatorsService.max(
            Number(this.currentFiscalYear),
            'Fiscal Year'
          )
        ]);
        //fiscalYearCtrl.updateValueAndValidity();
      }
    }
  }

  fiscalYearChamge(value) {
    if (this.control.valid) {
      this.fiscalYear.emit();
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
