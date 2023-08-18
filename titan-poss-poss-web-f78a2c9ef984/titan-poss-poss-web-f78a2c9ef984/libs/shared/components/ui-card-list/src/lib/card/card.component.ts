import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';

/**
 * Poss-Web-Card-Title
 */
@Component({
  selector: 'poss-web-card-title',
  template: '<h4><ng-content></ng-content></h4>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardTitleComponent {

}

/**
 * Poss-Web-Card-Subtitle
 */
@Component({
  selector: 'poss-web-card-subtitle',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardSubtitleComponent {

}

/**
 * Poss-Web-Card-Content
 */
@Component({
  selector: 'poss-web-card-content',
  template: '<div class="mt-1"> <ng-content></ng-content> </div>'
})
export class CardContentComponent {

}

/**
 * Poss-Web-Card
 * Used in the Poss-Web-Card-List
 * @param index  : [number] Index of the card in the list.
 * @param isSelected : [boolean] set by the card-list component whether this card is selected or not.
 * @param data  : [any] Data to be emitted on the click of the card. Which is passed by the user of the control.
 * @param selected : [{ data: any, index: number }] Event emitter when the card is selected with data and index.
 */
@Component({
  selector: 'poss-web-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements  FocusableOption {
  @Input() private index: number;
  @Input() private data: any;
  @Input() isSelected = false;

  @Output() private selected: EventEmitter<any> = new EventEmitter<{
    data: any;
    index: number;
  }>();

  @ViewChild('card', { read: ElementRef, static: true })
  private card: ElementRef;

  tabindex = -1;



  /**
   * Sets Focus on mat-card called by CDK Focusable
   */
  focus(): void {
    this.card.nativeElement.focus();
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
