import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UcpMarketCode } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-ucp-market-code-list-item',
  templateUrl: './ucp-market-code-list-item.component.html'
})
export class UcpMarketCodeListItemComponent {
  @Input() ucpMarketCodeFactor: UcpMarketCode;
  @Output() id = new EventEmitter<any>();
  @Output() viewDetails = new EventEmitter<any>();

  getId(id: string) {
    this.id.emit(id);
  }
  view(id) {
    this.viewDetails.emit(id);
  }
}
