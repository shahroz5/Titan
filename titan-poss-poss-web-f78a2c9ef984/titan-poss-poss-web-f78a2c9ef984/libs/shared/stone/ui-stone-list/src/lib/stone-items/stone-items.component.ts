import {
  Component,

  Input,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-stone-items',
  templateUrl: './stone-items.component.html'
})
export class StoneItemsComponent implements OnDestroy {
  @Input() stoneDetailsList;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions;
  @Input() minPageSize;
  @Output() paginator = new EventEmitter<PageEvent>();

  destroy$ = new Subject<null>();




  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
