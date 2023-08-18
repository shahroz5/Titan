import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  DiscountExcludeConfigTabEnum,
  DiscountExcludeItemCodes,
  DiscountExcludeThemeCode,
  DiscountExcludeConfig,
  SaveDiscountExcludeConfig
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-discount-exclude-config',
  templateUrl: './discount-exclude-config.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountExcludeConfigComponent implements OnInit {
  @Input() excludeItemCodes: DiscountExcludeItemCodes[] = [];
  @Input() excludeThemeCodes: DiscountExcludeThemeCode[] = [];
  @Input() currencyCode: string;

  @Input() excludeItemCodesCount: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize = 0;

  @Input() excludeComplexity: DiscountExcludeConfig[] = [];
  @Input() excludeMC: DiscountExcludeConfig[] = [];
  @Input() discountDetails;

  @Output() addThemeCode = new EventEmitter<string>();
  @Output() deleteThemeCode = new EventEmitter<string>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() activateThemeCode = new EventEmitter<any>();
  @Output() activateExcludeType = new EventEmitter<any>();
  @Output() loadItemCodes = new EventEmitter<any>();
  @Output() downLoadFormat = new EventEmitter<null>();
  @Output() uploadItemCodes = new EventEmitter<any>();
  @Output() deleteExcludeComplexity = new EventEmitter<string>();
  @Output() saveExcludeComplexity = new EventEmitter<
    SaveDiscountExcludeConfig
  >();
  @Output() deleteExcludeMC = new EventEmitter<string>();
  @Output() saveExcludeMC = new EventEmitter<SaveDiscountExcludeConfig>();
  @Output() excludeType = new EventEmitter<string>();

  selectedTab = DiscountExcludeConfigTabEnum.THEME_CODE;

  discountExcludeConfigTabEnumRef = DiscountExcludeConfigTabEnum;



  ngOnInit() {
    // this.emitType();
  }

  changeTab(newTab: DiscountExcludeConfigTabEnum) {
    this.selectedTab = newTab;
    this.emitType();
  }
  emitType() {
    this.excludeType.emit(this.selectedTab);
  }

}
