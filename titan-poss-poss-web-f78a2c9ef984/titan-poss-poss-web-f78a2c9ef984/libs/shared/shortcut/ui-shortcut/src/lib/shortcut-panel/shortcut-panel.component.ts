import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewContainerRef,
  OnDestroy,
  HostListener,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-shortcut-panel',
  templateUrl: './shortcut-panel.component.html',
  styleUrls: ['./shortcut-panel.component.scss']
})
export class ShortcutPanelComponent implements OnInit, OnDestroy, OnChanges {
  @Input() panelCount = 10;
  @Output() selectedPanel = new EventEmitter<number>();
  createPanels = [];
  @ViewChildren('inputButton', { read: ViewContainerRef })
  public inputs: QueryList<any>;
  @Input() setPanelFocus$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();

  constructor() {}

  ngOnInit(): void {
    this.setPanelFocus$?.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) this.focusOnInputNextTick(this.inputs.first);
    });
  }

  private focusOnInputNextTick(input: ViewContainerRef) {
    window.setTimeout(() => {
      input.element.nativeElement.focus();
    }, 0);
  }

  @HostListener('keyup', ['$event'])
  chipPressEvent(event: KeyboardEvent, selectedPanelNumber: number) {
    // console.log('selectedPanel', event);
    if (event.key === 'Enter') this.selectedPanel.emit(selectedPanelNumber);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['panelCount']) {
      console.log('panelCount', this.panelCount);
      this.createPanels = [];
      for (let i = 0; i < this.panelCount; i++) {
        this.createPanels.push(i + 1);
      }
    }
  }

  chipClickEvent(selectedPanelNumber: number) {
    // console.log('selectedPanel', event);
    this.selectedPanel.emit(selectedPanelNumber);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
