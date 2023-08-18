import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  CnMasterDetail,
  UpdateCreditNoteMasterPayload
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cn-master-items',
  templateUrl: './cn-master-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnMasterItemsComponent implements OnInit {
  @Input() creditNoteMasterList: CnMasterDetail[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleEvent = new EventEmitter<UpdateCreditNoteMasterPayload>();
  @Output() cnType = new EventEmitter<{ creditNoteType; isActive }>();
  @Output() view = new EventEmitter<{ creditNoteType; isActive }>();

  minPageSize: number;

  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  updateIsActive(event) {
    this.emitToggleEvent.emit(event);
  }

  edit(cnType) {
    this.cnType.emit(cnType);
  }

  viewMode(cnType) {
    this.view.emit(cnType);
  }
}
