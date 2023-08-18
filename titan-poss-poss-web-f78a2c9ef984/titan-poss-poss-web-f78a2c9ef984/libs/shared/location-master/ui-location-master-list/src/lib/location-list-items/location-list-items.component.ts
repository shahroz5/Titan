import {
  Component,

  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { EmitCopyLocationCodePayload, LocationListingData } from '@poss-web/shared/models';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-location-list-items',
  templateUrl: './location-list-items.component.html',
  styleUrls: ['./location-list-items.component.scss']
})
export class LocationListItemsComponent
  implements OnDestroy, OnChanges {
  @Input() locationList: LocationListingData[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSize: number[];
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitCopyLocationData = new EventEmitter<
    EmitCopyLocationCodePayload
  >();
  @Output() locationCode = new EventEmitter<any>();
  @Output() viewLocationCode = new EventEmitter<any>();
  @Output() emitToggleValue = new EventEmitter<any>();

  pageSizeOptions: number[] = [];
  minPageSize = 0;
  destroy$ = new Subject<null>();

  ngOnChanges(changes: SimpleChanges): void {
    this.pageSizeOptions = this.pageSize;

    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }


  emitViewLocationCode(locationCode: string) {
    this.viewLocationCode.emit(locationCode);
  }

  emitlocationCode(locationCode: string) {
    this.locationCode.emit(locationCode);
  }
  copyDetails(copyDetails: EmitCopyLocationCodePayload) {
    this.emitCopyLocationData.emit(copyDetails);
  }
  updateIsActive(event) {
    this.emitToggleValue.emit(event);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
