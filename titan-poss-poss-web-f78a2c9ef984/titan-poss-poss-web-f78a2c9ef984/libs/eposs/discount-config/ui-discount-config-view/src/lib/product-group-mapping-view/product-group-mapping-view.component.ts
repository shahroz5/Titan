import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { ProductGroup, MappedDetails } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'poss-web-product-group-mapping-view',
  templateUrl: './product-group-mapping-view.component.html'
})
export class ProductGroupMappingViewComponent implements OnInit, OnDestroy {
  @Input() productGroups: ProductGroup[] = [];
  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize: number;
  @Input() productGroupTypes: string[] = [];
  @Input() selectedProductGroups: MappedDetails[] = [];
  @Output() loadItems = new EventEmitter<any>();
  @Output() productGroupType = new EventEmitter<string>();
  destroy$ = new Subject<null>();
  filterForm: FormGroup;
  productTypeList: { value: string; description: any }[];
  searchValue: string;
  plainLabel: any;
  othersLabel: any;
  studedLabel: any;
  miaLabel: any;
  allOptionsLabel: any;
  type: string;

  constructor(private translate: TranslateService) {
    this.translate
      .get([
        'pw.discountProductGroupMapping.productGroupLable',
        'pw.prooductGroupMapping.plainLabel',
        'pw.prooductGroupMapping.othersLabel',
        'pw.prooductGroupMapping.studedLabel',
        'pw.prooductGroupMapping.miaLabel',
        'pw.prooductGroupMapping.allLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.plainLabel = translatedMsg['pw.prooductGroupMapping.plainLabel'];
        this.othersLabel = translatedMsg['pw.prooductGroupMapping.othersLabel'];
        this.studedLabel = translatedMsg['pw.prooductGroupMapping.studedLabel'];
        this.miaLabel = translatedMsg['pw.prooductGroupMapping.miaLabel'];
        this.allOptionsLabel =
          translatedMsg['pw.prooductGroupMapping.allLabel'];
        this.productTypeList = [
          { value: 'P', description: this.plainLabel },
          { value: 'M', description: this.miaLabel },
          { value: 'O', description: this.othersLabel },
          { value: 'S', description: this.studedLabel }
        ];
        this.filterForm = new FormGroup({
          type: new FormControl(),
          searchValue: new FormControl()
        });
      });
  }

  ngOnInit(): void {
    this.filterForm.patchValue({
      type: null
    });
    this.filterForm
      .get('type')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.type = data;
        this.productGroupType.emit(this.type);
      });
  }
  paginate(data) {
    this.pageEvent = data;
    this.loadMappedProductGroups();
  }

  loadMappedProductGroups() {
    this.loadItems.emit({
      type: this.type,
      searchValue: this.searchValue,
      pageEvent: this.pageEvent
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
