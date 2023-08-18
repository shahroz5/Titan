import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'poss-web-toolbar-doc-num',
  template: `
    <ng-container>
      <a class="pw-anchor-underline" (click)="selectedRow()">{{ docNumber }}</a>
    </ng-container>
  `,
  styles: []
})
export class ToolbarDocNumComponent implements ICellRendererAngularComp {
  params: ICellRendererParams;
  docNumber: number;

  refresh(): boolean {
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.docNumber = params.value;
  }

  selectedRow() {
    this.params.context.componentParent?.selectedId(this.params.data.id);
  }
}
