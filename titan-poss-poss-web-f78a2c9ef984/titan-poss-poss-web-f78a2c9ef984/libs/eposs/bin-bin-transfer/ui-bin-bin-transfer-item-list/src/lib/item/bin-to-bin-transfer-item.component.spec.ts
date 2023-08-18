import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { BinToBinTransferItemComponent } from './bin-to-bin-transfer-item.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Pipe,
  PipeTransform,
  NO_ERRORS_SCHEMA,
  DebugElement
} from '@angular/core';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import * as moment from 'moment';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import {
  StockItemBinGroupCodeEnum,
  StockReceiveProductCategoryCodeEnum,
  StockItemBinCodeEnum,
  BinToBinTransProductCategoryCodeEnum,
  BinToBinTransBinsferEnum
} from '@poss-web/shared/models';
import { By } from '@angular/platform-browser';
import { SelectionDialogGridService } from '@poss-web/shared/components/ui-selection-dialog-grid';

@Pipe({
  name: 'translate'
})
class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'dateFormatter'
})
class DateFromatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'weightFormatter'
})
class WeightFromatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Pipe({
  name: 'currencyFormatter'
})
class CurrencyFormatterPipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

class Page {
  get binSelectionButton() {
    return this.query(`button`);
  }

  get deleteButton() {
    return this.query(`.pw-close-icon-24`);
  }

  get checkBox() {
    return this.query(`mat-checkbox`);
  }

  private fixture: ComponentFixture<BinToBinTransferItemComponent>;

  constructor(fixture: ComponentFixture<BinToBinTransferItemComponent>) {
    this.fixture = fixture;
  }

  private query(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }
}

describe('BinToBinTransferItemComponent', () => {
  let component: BinToBinTransferItemComponent;
  let fixture: ComponentFixture<BinToBinTransferItemComponent>;
  let selectionDialogService;
  let page: Page;

  beforeEach(() => {
    selectionDialogService = jasmine.createSpyObj(['open']);

    TestBed.configureTestingModule({
      declarations: [
        BinToBinTransferItemComponent,
        TranslatePipeStub,
        DateFromatterPipeStub,
        WeightFromatterPipeStub,
        CurrencyFormatterPipeStub
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [CommonCustomMaterialModule, NoopAnimationsModule],
      providers: [
        {
          provide: WeightFormatterService,
          useValue: {
            format: (data: any) => data
          }
        },
        {
          provide: SelectionDialogGridService,
          useValue: selectionDialogService
        },

        {
          provide: TranslateService,
          useValue: {
            get: (data: any) => {
              let result = {};
              if (data instanceof Array) {
                for (let i = 0; i < data.length; i++) {
                  result = {
                    ...result,
                    [data[i]]: data[i]
                  };
                }
                return of(result);
              } else {
                return of(data);
              }
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(BinToBinTransferItemComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);

    component.bins = [
      {
        binCode: 'ABC',
        binGroupCode: 'ABC_BG'
      },
      {
        binCode: 'TEST',
        binGroupCode: 'TEST_BG'
      },
      {
        binCode: 'TEPSALE',
        binGroupCode: 'TEPSALE'
      }
    ];

    component.item = {
      id: 'B948E97B-BBB8-4C77-9383-1712B570F713',
      itemCode: '511178VHIU1A00',
      lotNumber: '2EA001188',
      mfgDate: moment(),
      productCategory: 'V',
      productGroup: '71',
      productCategoryDesc: 'BANGLES',
      productGroupDesc: 'Gold Plain',
      binCode: 'CHAIN',
      binGroupCode: 'STN',
      stdValue: 88213.86,
      stdWeight: 28.75,
      currencyCode: 'INR',
      weightUnit: 'gms',
      imageURL: '/productcatalogue/ProductImages/1178VHI.jpg',
      itemDetails: {},
      availableWeight: 28.75,
      availableValue: 88213.86,
      availableQuantity: 1,
      isSelected: false,
      isDisabled: false,
      destinationBinGroupCode: null,
      destinationBinCode: 'BINCODE',
      isStudded: true
    };
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Selection', () => {
    it('should selection event as true when checked', () => {
      component.sendSelectionChangeEvent(true);

      component['updateItem'].subscribe(data => {
        expect(data.isSelected).toBeTruthy();
      });
    });

    it('should selection event as false when un checked', () => {
      component.sendSelectionChangeEvent(false);

      component['updateItem'].subscribe(data => {
        expect(data.isSelected).toBeFalsy();
      });
    });
    it('should not reset bin on un checked', () => {
      component.sendSelectionChangeEvent(true);

      component['updateItem'].subscribe(data => {
        expect(data.destinationBinCode).not.toBeNull();
      });
    });

    it('should reset bin on un checked', () => {
      component.sendSelectionChangeEvent(false);

      component['updateItem'].subscribe(data => {
        expect(data.destinationBinCode).toBeNull();
      });
    });

    it('should not render check box when select is disabled', () => {
      component.canSelect = false;

      fixture.detectChanges();

      expect(page.checkBox).toBeNull();
    });

    it('should  render check box when select is enabled', () => {
      component.canSelect = true;

      fixture.detectChanges();

      expect(page.checkBox).not.toBeNull();
    });

    it('should call sendSelectionChangeEvent funtion on change', () => {
      component.canSelect = true;
      spyOn(component, 'sendSelectionChangeEvent');

      fixture.detectChanges();

      page.checkBox.triggerEventHandler('change', true);

      expect(component.sendSelectionChangeEvent).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    it('should send delete event', () => {
      component.deleteItem();

      component['delete'].subscribe(data => {
        expect(data).toEqual(component.item.id);
      });
    });

    it('should send delete when when delete key is pressed and delete is enabled', () => {
      component.canDelete = true;
      spyOn(component, 'deleteItem');
      component['onKeydown']({
        ...new KeyboardEvent('Delete'),
        code: 'Delete'
      });
      expect(component.deleteItem).toHaveBeenCalled();
    });

    it('should send delete when when delete key is pressed and delete is disabled', () => {
      component.canDelete = false;
      spyOn(component, 'deleteItem');
      component['onKeydown']({
        ...new KeyboardEvent('Delete'),
        code: 'Delete'
      });
      expect(component.deleteItem).not.toHaveBeenCalled();
    });

    it('should not render delete button when delete is disabled', () => {
      component.canDelete = false;

      fixture.detectChanges();

      expect(page.deleteButton).toBeNull();
    });

    it('should  render delete button when delete is enabled', () => {
      component.canDelete = true;

      fixture.detectChanges();

      expect(page.deleteButton).not.toBeNull();
    });

    it('should call delete funtion on click', () => {
      component.canDelete = true;
      spyOn(component, 'deleteItem');

      fixture.detectChanges();

      page.deleteButton.triggerEventHandler('click', null);

      expect(component.deleteItem).toHaveBeenCalled();
    });
  });

  describe('Bin selection', () => {
    it('should have option of TEP SALE incase of coins', () => {
      component.item.productCategory =
        BinToBinTransProductCategoryCodeEnum.COIN;

      component.ngOnInit();

      const count = component.binsForSelection.filter(
        b => b.binCode === BinToBinTransBinsferEnum.TEP_SALE
      ).length;

      expect(count).toEqual(1);
    });

    it('should not have option of TEP SALE incase other than coins', () => {
      component.item.productCategory = 'NOT_A_COIN';

      component.ngOnInit();

      const count = component.binsForSelection.filter(
        b => b.binCode === BinToBinTransBinsferEnum.TEP_SALE
      ).length;

      expect(count).toEqual(0);
    });

    it('should not have option source bin', () => {
      const bincode = component.bins[0].binCode;
      component.item.binCode = bincode;
      component.ngOnInit();

      const count = component.binsForSelection.filter(b => b.binCode === bincode)
        .length;

      expect(count).toEqual(0);
    });

    it('should open bin selection popup', () => {
      selectionDialogService.open.and.returnValue(of(null));
      spyOn(component.updateItem, 'emit');
      component.openBinSelectionPopup();
      expect(selectionDialogService.open).toHaveBeenCalled();
    });

    it('should call update item after setteing the bincode', () => {
      const result = {
        id: 'BINCODE',
        additionalProperty: 'BIN_GROUPCODE'
      };
      selectionDialogService.open.and.returnValue(of(result));
      component.openBinSelectionPopup();

      component['updateItem'].subscribe(data => {
        expect(data.destinationBinCode).toEqual(result.id);
        expect(data.destinationBinGroupCode).toEqual(result.additionalProperty);
      });
    });

    it('should not show bin selection button only if  showDestinationBin is false', () => {
      component.showDestinationBin = false;

      fixture.detectChanges();

      expect(page.binSelectionButton).toBeNull();
    });

    it('should show bin selection button only if  showDestinationBin is true', () => {
      component.showDestinationBin = true;

      fixture.detectChanges();

      expect(page.binSelectionButton).not.toBeNull();
    });

    it('should call openBinSelectionPopup on click of bin selection button', () => {
      component.showDestinationBin = true;
      spyOn(component, 'openBinSelectionPopup');

      fixture.detectChanges();
      page.binSelectionButton.triggerEventHandler('click', null);

      expect(component.openBinSelectionPopup).toHaveBeenCalled();
    });

    it('should not call openBinSelectionPopup when item is not selected', () => {
      component.showDestinationBin = true;
      component.item.isSelected = false;
      spyOn(component, 'openBinSelectionPopup');

      fixture.detectChanges();
      page.binSelectionButton.triggerEventHandler('click', null);

      expect(page.binSelectionButton.nativeElement.disabled).toBeTruthy();
    });

    it('should show selected binCode on the button', () => {
      const expected = component.item.destinationBinCode;
      component.showDestinationBin = true;

      fixture.detectChanges();
      const actual = page.binSelectionButton.nativeElement.textContent;

      expect(actual).toContain(expected);
    });
  });
});
