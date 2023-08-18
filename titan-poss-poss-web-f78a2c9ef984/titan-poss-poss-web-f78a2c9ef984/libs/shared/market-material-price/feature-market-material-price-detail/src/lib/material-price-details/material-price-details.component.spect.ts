

describe('StockReceiveDetailsComponent', () => {
    //let component: MaterialPriceDetailsComponent;
    //let fixture: ComponentFixture<MaterialPriceDetailsComponent>;
    let marketMaterialPriceFacade;
    // let appsettingFacadeSpy;
    // let overlayNotificationServiceSpy;
    beforeEach(() => {
        marketMaterialPriceFacade = jasmine.createSpyObj([
            'getAllSelected',
            "getMarketDetailsBasedOnMaterial",
            "getSelectedDate",
            "getHasNewViewLocationPriceSuccess",
            "getSelectedStock",
            "getLocationDetails",
            "getHasSaved",
            "getError",
            "getLocationDetails",
            "getLocationDetailsCount",
            "getTotalMarketCodesCount",
            "getIsLoading",
            "savePrice",
            "updateCheckBox",
            "computeBasePriceForForcedType",
            "updateSelectedStock",
            "updateAllSelected",
            "loadReset",
            "updateHasNewViewLocationPrice",
            "updateAllSelected",
            "loadComputePriceForAll",
            "loadRemovePriceForAll",
            "loadMarketDetails",
            "searchSavedLocationPriceByMarketCode",
            "getComputedPriceSearchResult",
            "getcomputedPriceSearchResultCount",
            "searchMaterialCode",
            "loadSavedBasePrice",
            "loadLocationPrice",
            "updateAllSelected"
        ])
    })
});
