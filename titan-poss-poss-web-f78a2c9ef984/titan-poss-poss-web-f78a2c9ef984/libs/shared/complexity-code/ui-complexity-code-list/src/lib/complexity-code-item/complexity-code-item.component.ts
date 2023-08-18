import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ComplexityCode } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-complexity-code-item',
  templateUrl: './complexity-code-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplexityCodeItemComponent implements OnChanges {
  @Input() compexityCodeItem: ComplexityCode;
  @Output() complexityCode = new EventEmitter<string>();
  @Output() emitToggle = new EventEmitter<{
    isActive: boolean;
    complexityCode: string;
    description: string;
  }>();
  isActive: boolean;
  @Output() viewPage = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.compexityCodeItem.isActive;
  }



  edit(complexityCode) {
    this.complexityCode.emit(complexityCode);
  }
  changeEvent(event) {
    this.isActive = event.checked;
    const obj = {
      isActive: event.checked,
      complexityCode: this.compexityCodeItem.complexityCode,
      description: this.compexityCodeItem.description
    };
    this.emitToggle.emit(obj);
  }
  openViewPage(complexityCode) {
    this.viewPage.emit(complexityCode);
  }
}
