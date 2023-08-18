import {
  Component,

  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { MarketCodeDetails } from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
@Component({
  selector: 'poss-web-market-code-listing-item',
  templateUrl: './market-code-listing-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketCodeListingItemComponent implements OnChanges {
  @Input() marketCodeList: MarketCodeDetails;
  @Input() permissions$: Observable<any[]>;
  @Output() isActive = new EventEmitter<{
    isActive: boolean;
    marketCode: string;
  }>();
  @Output() marketCode = new EventEmitter<string>();
  @Output() viewPage = new EventEmitter<string>();
  active: boolean;
  VIEW_MARKET_CODE_PERMISSIONS = 'MarketCode Master - View MarketCode Master';
  ADD_EDIT_MARKET_CODE_PERMISSIONS =
    'MarketCode Master - Add/Edit MarketCode Master';

  ngOnChanges(changes: SimpleChanges): void {
    this.active = this.marketCodeList.isActive;
  }
  getMarketCode(marketCode: string) {
    this.marketCode.emit(marketCode);
  }
  constructor(private elementPermission: ElementPermissionService) {}
  change(isActive: boolean, marketCode) {
    this.isActive.emit({ isActive: isActive, marketCode: marketCode });
  }
  openViewPage() {
    this.viewPage.emit(this.marketCodeList.marketCode);
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
