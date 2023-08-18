import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { IbtConfiguration } from '@poss-web/shared/models';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-ibt-configuration-items',
  templateUrl: './ibt-configuration-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IbtConfigurationItemsComponent implements OnInit {
  @Input() ibtConfigurationList: IbtConfiguration[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];

  minPageSize: number;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() viewConfigId = new EventEmitter<string>();
  @Output() configId = new EventEmitter<string>();
  @Output() toggleValue = new EventEmitter<IbtConfiguration>();


  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }

  view(event) {
    this.viewConfigId.emit(event);
  }
  edit(event) {
    this.configId.emit(event);
  }
  change(event) {
    this.toggleValue.emit(event);
  }
  trackBy(_: number, item: IbtConfiguration) {
    return item.configId;
  }
}
