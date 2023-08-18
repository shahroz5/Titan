# shared-components-ui-paginated-selection-dialog

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test shared-components-ui-paginated-selection-dialog` to execute the unit tests.

TODO: USAGE of seletion dailog pagination. to be deleted
open() {

const bins\$ = new BehaviorSubject<SelectionDailogPaginationOption[]>(
this.binsForSelection
);

    const isLoadingBinCodes$ = new BehaviorSubject<boolean>(false);
    const total$ = new BehaviorSubject<number>(100);
    const ref = this.selectionDialog.open({
      title: this.selectBinCodeLable,
      placeholder: this.searchBinCodeLable,
      options: bins$.asObservable(),
      isLoading: isLoadingBinCodes$.asObservable(),
      pageSize: 10,
      total: total$.asObservable()
    });

    const subscription = new Subject();

    ref.close.pipe(takeUntil(subscription)).subscribe(() => {
      subscription.next();
      subscription.complete();
    });

    ref.load.pipe(takeUntil(subscription)).subscribe(data => {
      setTimeout(() => {
       bins$.next([
          { id: 'Test1', description: 'Test 1' },
          { id: 'Test2', description: 'Test 2' }
        ]);
        isLoadingBinCodes$.next(false);
     }, 1000);
    });

}
