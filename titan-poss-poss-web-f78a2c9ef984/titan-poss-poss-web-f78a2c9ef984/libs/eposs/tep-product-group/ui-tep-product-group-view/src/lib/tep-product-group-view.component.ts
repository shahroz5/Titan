import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  TEPProductGroupConfigDetails,
  TEPProductGroupMappingDetails
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-tep-product-group-view',
  templateUrl: './tep-product-group-view.component.html',
  styleUrls: ['./tep-product-group-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepProductGroupViewComponent  {

  @Input() tepProductGroupConfigDetails: TEPProductGroupConfigDetails;
  @Input() tepProductGroupMappingList$: Observable<
    TEPProductGroupMappingDetails[]
  >;
  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() sortEmitter = new EventEmitter<string[]>();
  @Output() productGroupCodeGridSearch = new EventEmitter<string>();
  @Output() clearGridSearch = new EventEmitter<boolean>();
  
  expanded = true;

  productGroupSearchEmitter(event) {
    this.productGroupCodeGridSearch.emit(event);
  }

  clearSearchEmitter(event: any) {
    this.clearGridSearch.emit(event);
  }

  paginatorEvent(event: PageEvent) {
    this.paginator.emit(event);
  }

  sortEvent(event: any) {
    this.sortEmitter.emit(event);
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
