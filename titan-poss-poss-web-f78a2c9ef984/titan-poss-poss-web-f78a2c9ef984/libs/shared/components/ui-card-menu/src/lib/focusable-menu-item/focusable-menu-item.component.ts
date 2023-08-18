import { FocusableOption } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'poss-web-focusable-menu-item',
  templateUrl: './focusable-menu-item.component.html',
  styleUrls: ['./focusable-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FocusableMenuItemComponent implements FocusableOption {
  @Input() private index: number;
  @Input() private data: any;
  @Input() isSelected = false;

  @Output() private selected: EventEmitter<any> = new EventEmitter<{
    data: any;
    index: number;
  }>();

  @ViewChild('menuCard', { read: ElementRef, static: true })
  private menuCard: ElementRef;

  tabindex = -1;

  /**
   * Sets Focus on mat-card called by CDK Focusable
   */
  focus(): void {
    this.menuCard.nativeElement.focus();
  }

  /**
   *  Emits data and index of the card whent it is selected.
   */
  onSelected(): void {
    this.selected.emit({ index: this.index, data: this.data });
  }

  /**
   *  Listener for Enter key event to call onSelected() function
   */
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSelected();
    }
  }
}
