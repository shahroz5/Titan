import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CardDetails } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-card-details-view',
  templateUrl: './card-details-view.component.html'
})
export class CardDetailsViewComponent implements OnInit {
  @Input() cardDetails: CardDetails[];
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() count: number;
  @Output() paginator = new EventEmitter<PageEvent>();
  cardValues: CardDetails[];


  ngOnInit(): void {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
}
