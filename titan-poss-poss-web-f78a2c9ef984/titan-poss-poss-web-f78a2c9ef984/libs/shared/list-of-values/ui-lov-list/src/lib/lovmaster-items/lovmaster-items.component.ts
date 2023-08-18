import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import { LovMaster, LovMasterType } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-lovmaster-items',
  templateUrl: './lovmaster-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LovmasterItemsComponent implements OnInit, OnDestroy {
  @Input() lovMasterList: LovMaster[];
  @Input() lovMasterTypes: LovMasterType[];
  @Input() lovMasterTypesList: { value: string; description: string }[];
  @Input() isLoading: boolean;
  @Input() count: number;
  @Input() pageEvent: PageEvent;

  @Output() lovTypeSelect = new EventEmitter<string>();
  @Output() lovMasterItemView = new EventEmitter<LovMaster>();
  @Output() lovMasterItemEdit = new EventEmitter<LovMaster>();
  @Output() lovMasterSwitch = new EventEmitter<LovMaster>();
  @Output() searchKey = new EventEmitter<string>();

  searchBox = '';

  lovSelectedType: string;
  constructor(private translate: TranslateService) {
    this.translate
      .get(['pw.entity.lovName'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.lovName']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageNonVerifiedItems =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  noDataFoundMessageNonVerifiedItems: string;
  destroy$ = new Subject<null>();

  ngOnInit() {
    this.lovMasterTypesList = this.getLovMasterTypes(this.lovMasterTypes);
  }

  selectedDropdown($event: any) {
    if ($event) {
      this.clearSearch();
      this.lovSelectedType = $event.value;
      this.lovTypeSelect.emit($event.value);
    }
  }

  getLovMasterCodeView($event: LovMaster) {
    this.lovMasterItemView.emit($event);
  }
  getLovMasterCode($event: LovMaster) {
    this.lovMasterItemEdit.emit($event);
  }

  lovSearch(key: string) {
    this.searchKey.emit(key);
  }

  clearSearch() {
    this.searchBox = '';
    this.lovSearch(this.searchBox);
  }

  toggleChange($event) {
    this.lovMasterSwitch.emit($event);
  }

  getLovMasterTypes(data: LovMasterType[]) {
    return data.map(val => {
      // this.translate
      //   .get(val.value)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe(translatedMsg => {
      //     value = translatedMsg;
      //   });

      return {
        value: val.value,
        description: this.translate.instant(val.name)
      };
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
