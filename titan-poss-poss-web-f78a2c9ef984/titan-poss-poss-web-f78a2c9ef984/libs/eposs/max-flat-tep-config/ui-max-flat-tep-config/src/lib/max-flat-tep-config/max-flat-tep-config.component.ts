import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-max-flat-tep-config-ui',
  templateUrl: './max-flat-tep-config.component.html'
})
export class MaxFlatTepConfigComponent implements OnInit {
  @Input() maxFlatTepConfigValue: string;
  @Output() emitUpdatedMaxFlatTepValue: EventEmitter<string> = new EventEmitter<
    string
  >();
  maxFlatTepExchangeForm: FormGroup;

  constructor(private fieldValidatorsService: FieldValidatorsService) {}

  ngOnInit(): void {
    this.maxFlatTepExchangeForm = new FormGroup({
      maxFlatTepExchangeValue: new FormControl(this.maxFlatTepConfigValue, [
        this.fieldValidatorsService.requiredField('Max Flat TEP Exchange Value')
      ])
    });
  }

  updateMaxFlatTepExchangeValue() {
    if (this.maxFlatTepExchangeForm.get('maxFlatTepExchangeValue').value) {
      console.log(
        'this.maxFlatTepExchangeForm.get(maxFlatTepExchangeValue).value :',
        this.maxFlatTepExchangeForm.get('maxFlatTepExchangeValue').value
      );
      this.emitUpdatedMaxFlatTepValue.emit(
        this.maxFlatTepExchangeForm.get('maxFlatTepExchangeValue').value
      );
    }
  }
}
