import {
  Input,
  Output,
  EventEmitter,
  QueryList,
  ElementRef,
  Component
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ButtonType } from '../../enums/commandButton.enum';
import { CommandButton } from '../../interfaces/CommandButton.interface';

@Component({
  template: ''
})
export abstract class TemplateAbstract {
  @Input() form: FormGroup;
  @Input() formName: string;
  @Input() formId: number;
  @Input() fields: any[] = [];
  @Input() style: string[];
  @Input() disabled: boolean;
  @Input() disableSubmit: boolean;
  @Input() buttonNames: string[];
  @Input() commandButtons: CommandButton[];
  @Input() enableSubmitOnInvalid: boolean;

  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectRefreshClickEvent: EventEmitter<any> = new EventEmitter<
    any
  >();
  @Output() radioChange: EventEmitter<{
    name: string;
    value: string;
  }> = new EventEmitter<{ name: string; value: string }>();
  @Output() checkBoxChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAddForm: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteForm: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitButton: EventEmitter<{
    btn: { name: string; type: ButtonType; disableNonDirty: boolean };
    i: number;
  }> = new EventEmitter<{
    btn: { name: string; type: ButtonType; disableNonDirty: boolean };
    i: number;
  }>();
  @Output() commandButtonsOutput: EventEmitter<
    QueryList<ElementRef>
  > = new EventEmitter<QueryList<ElementRef>>(); // New
}
