import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-gl-boutique-list-items',
  templateUrl: './gl-boutique-list-items.component.html'
})
export class GlBoutiqueListItemsComponent implements OnInit, OnDestroy {
  @Input() glBoutiqueList;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() glBoutiqueLocationCode = new EventEmitter<string>();
  @Output() emitToggleValue = new EventEmitter<{
    locationCode: string;
    isActive: boolean;
  }>();
  destroy$ = new Subject<null>();
  @Input() pageSizeOptions;
  @Input() minPageSize;
  @Output() viewPage = new EventEmitter<string>();



  ngOnInit() {
    console.log(this.pageEvent, 'page');
  }
  emitLocationCode($event: string) {
    this.glBoutiqueLocationCode.emit($event);
  }
  emitToggle(event) {
    this.emitToggleValue.emit(event);
  }
  openViewPage($event) {
    this.viewPage.emit($event);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
