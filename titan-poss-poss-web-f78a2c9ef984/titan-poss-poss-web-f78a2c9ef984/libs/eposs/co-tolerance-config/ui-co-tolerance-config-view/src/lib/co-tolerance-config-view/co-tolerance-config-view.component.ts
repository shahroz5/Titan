import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import { PageEvent } from '@angular/material/paginator';
import { ShortcutServiceAbstraction } from '@poss-web/shared/models';
import { take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

export const sortShortcutKey = 'CoToleranceConfigUiGridComponent.SORT';
const componentName = 'CoToleranceConfigUiGridComponent';

@Component({
  selector: 'poss-web-co-tolerance-config-view',
  templateUrl: './co-tolerance-config-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoToleranceConfigViewComponent implements OnInit, OnChanges {
  @Input() selectedConfigDetails;
  @Input() configDetails: any[] = [];
  @Input() weightRange: any = [];
  @Input() metaltypes: any[] = [];
  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() pageSize: number[];

  @Output() paginator = new EventEmitter<PageEvent>();

  pageSizeOptions = [];
  minPageSize = 0;

  maxSortLimit = 2;

  @Output() sortEmitter = new EventEmitter<string[]>();

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;
  sort: string[] = [];

  destroy$: Subject<null> = new Subject<null>();

  rowData = [];
  expanded = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.configDetails === null) this.configDetails = [];
    if (
      changes['configDetails'] ||
      changes['weightRange'] ||
      changes['metaltypes']
    ) {
      this.rowData = [];

      this.configDetails.forEach(config => {
        const metalType = this.metaltypes.filter(
          obj => obj.materialTypeCode === config.metalType
        );
        this.rowData.push({
          metalType: `${metalType[0].description} - (${metalType[0].materialTypeCode})`,
          ranges: this.weightRange.filter(obj => obj.id === config.rangeId)[0]
            .range,
          configValue: config.configValue,
          configPercent: config.configPercent
        });
      });
    }
  }
  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private sortService: SortDialogService,
    private shortcutService: ShortcutServiceAbstraction
  ) {}

  toggleAccordion() {
    this.expanded = !this.expanded;
  }

  ngOnInit(): void {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );

    this.translate
      .get([
        'pw.coWeightTolerance.metalType',
        'pw.coWeightTolerance.weightRange'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName:
              translatedMessages['pw.coWeightTolerance.metalType'],
            sortAscOrder: false
          },
          {
            id: 1,
            sortByColumnName:
              translatedMessages['pw.coWeightTolerance.weightRange'],
            sortAscOrder: false
          }
        ];
      });
  }

  openSortDailog() {
    this.dialog.closeAll();
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(take(1))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        this.sort = [];
        if (sortResult.actionfrom === 'apply') {
          const sortData = sortResult.data;
          if (sortData == null || sortData.length === 0) {
            this.sortData = [];
            this.sortOrder = null;
            this.sortBy = null;
          } else {
            this.sortData = sortData;
            if (sortData.length > 0) {
              this.sortData.forEach(sort => {
                switch (sort.id) {
                  case 0:
                    this.sortBy = 'metalType';
                    break;
                  case 1:
                    this.sortBy = 'rangeId.fromRange';
                    break;
                }
                this.sortOrder = sort.sortAscOrder ? 'asc' : 'desc';
                this.sort = [...this.sort, this.sortBy + ',' + this.sortOrder];
              });
            }
          }
          this.sortEmitter.emit(this.sort);
        }
      });
  }
}
