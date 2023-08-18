import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { TemplateAbstract } from '../template-abstract';

@Component({
  selector: 'poss-web-template5',
  templateUrl: './template5.component.html'
})
export class Template5Component
  extends TemplateAbstract
  implements OnInit, AfterViewInit {
  @ViewChildren('commandButtonPanel')
  commandButtonPanel: QueryList<ElementRef>;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.commandButtonsOutput.emit(this.commandButtonPanel);
  }
}
