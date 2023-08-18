import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  CnMasterDetail,
  UpdateCreditNoteMasterPayload
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cn-master-item',
  templateUrl: './cn-master-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnMasterItemComponent implements OnChanges {
  @Input() creditNoteMasterListItem: CnMasterDetail;

  @Output() cnType = new EventEmitter<{ creditNoteType; isActive }>();
  @Output() view = new EventEmitter<{ creditNoteType; isActive }>();
  @Output() toggleEvent = new EventEmitter<UpdateCreditNoteMasterPayload>();
  isActive: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    this.isActive = this.creditNoteMasterListItem.isActive;
  }
  edit(creditNoteType: string, isActive: boolean) {
    this.cnType.emit({ creditNoteType, isActive });
  }

  viewMode(creditNoteType: string, isActive: boolean) {
    this.view.emit({ creditNoteType, isActive });
  }

  updateValue(event) {
    this.isActive = event.cheked;
    this.toggleEvent.emit({
      cnType: this.creditNoteMasterListItem.creditNoteType,
      cnDetail: {
        isActive: event.checked,
        description: this.creditNoteMasterListItem.description,
        configDetails: {
          data: {
            IsAllowedForGHSGrammageAccount: this.creditNoteMasterListItem
              .IsAllowedForGHSGrammageAccount,
            IsAllowedforEghs: this.creditNoteMasterListItem.IsAllowedforEghs
          }
        }
      }
    });
  }
}
