import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-payee-bank-items',
  templateUrl: './payee-bank-items.component.html'
})
export class PayeeBankItemsComponent implements OnDestroy {
  @Input() payeeBankDetailsList;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() permissions$: Observable<any[]>;
  @Output() bankName = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitToggleValue = new EventEmitter<{
    bankName: string;
    isActive: boolean;
  }>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions;
  @Input() minPageSize;
  @Output() viewPage = new EventEmitter<string>();

  emitpayeeBankName(bankName) {
    this.bankName.emit(bankName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
}
