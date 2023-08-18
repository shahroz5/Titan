import { waitForAsync, TestBed } from '@angular/core/testing';
import { SharedItemMasterUiProductSearchAutocompleteModule } from './shared-item-master-ui-product-search-autocomplete.module';

describe('SharedItemMasterUiProductSearchAutocompleteModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedItemMasterUiProductSearchAutocompleteModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedItemMasterUiProductSearchAutocompleteModule).toBeDefined();
  });
});
