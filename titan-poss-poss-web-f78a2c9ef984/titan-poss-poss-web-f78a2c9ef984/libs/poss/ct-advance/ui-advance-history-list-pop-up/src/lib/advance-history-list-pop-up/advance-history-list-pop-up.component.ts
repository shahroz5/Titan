import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AdvanceHistoryItem } from '@poss-web/shared/models';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-advance-history-list-pop-up',
  templateUrl: './advance-history-list-pop-up.component.html',
  styleUrls: ['./advance-history-list-pop-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvanceHistoryListPopUpComponent implements OnInit, OnDestroy {
  selectedHistoryItem: any;
  advanceHistoryItems: AdvanceHistoryItem[] = [];
  advanceHistoryItems$: Observable<any>;
  // count;
  // pageSizeOptions: number[];
  // minPageSize = 0;
  // pageSize = 10;
  currentDate = moment();
  itemTotalCount;
  load = new Subject();
  destroy$ = new Subject();
  constructor(
    public dialogRef: MatDialogRef<AdvanceHistoryListPopUpComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      advanceHistoryList: AdvanceHistoryItem[];
      advanceHistoryItems: Observable<any>;
      advanceHistoryItemsCount: Observable<any>;
    }
  ) {
    // this.pageSize = 10;
    // this.minPageSize = 10;
    // this.pageSizeOptions = [10, 20, 50];
  }

  // ngOnChanges() {
  //   this.advanceHistoryItems = this.data.advanceHistoryList;
  // }

  ngOnInit() {
    // this.advanceHistoryItems = this.data.advanceHistoryList;
    this.advanceHistoryItems$ = this.data.advanceHistoryItems;
    this.data.advanceHistoryItems
      .pipe(takeUntil(this.destroy$))
      .subscribe((advanceHistoryItems: any) => {
        const itemsArray = [...advanceHistoryItems];
        this.advanceHistoryItems = itemsArray.map(item => item);
        console.log(
          'ADVANCE HISTORY ITEMS IN POP UP :',
          this.advanceHistoryItems
        );
      });
    this.data.advanceHistoryItemsCount
      .pipe(takeUntil(this.destroy$))
      .subscribe((advanceHistoryItemsCount: any) => {
        this.itemTotalCount = advanceHistoryItemsCount;
        console.log(
          'ADVANCE HISTORY ITEMS COUNT IN POP UP :',
          this.itemTotalCount
        );
      });
  }

  paginationDetail(event) {
    this.load.next({
      size: event.size,
      page: event.page
    });
  }

  getSelectedHistoryItem(selectedHistoryItem: any) {
    this.selectedHistoryItem = selectedHistoryItem;
    this.dialogRef.close(this.selectedHistoryItem);
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
