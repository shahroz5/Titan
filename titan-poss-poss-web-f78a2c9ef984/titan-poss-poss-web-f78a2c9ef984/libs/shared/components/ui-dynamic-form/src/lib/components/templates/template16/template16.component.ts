import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { ButtonType } from '../../../enums/commandButton.enum';
import { TemplateAbstract } from '../template-abstract';

@Component({
  selector: 'poss-web-template16',
  templateUrl: './template16.component.html'
})
export class Template16Component
  extends TemplateAbstract
  implements OnInit, AfterViewInit {
  ButtonType = ButtonType;

  @ViewChildren('commandButtonPanel')
  commandButtonPanel: QueryList<ElementRef>;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.commandButtonsOutput.emit(this.commandButtonPanel);
  }
}
