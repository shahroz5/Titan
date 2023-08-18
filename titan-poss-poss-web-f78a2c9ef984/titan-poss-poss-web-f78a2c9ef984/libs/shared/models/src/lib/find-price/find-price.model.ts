export interface AvailableProduct {
    lotNumber: string;
    inventoryId: string;
    totalWeight: number;
    totalQuantity?: number;
}

export interface PriceRequest {
    checkInventory: true;
    itemCode: string;
    lotNumber: string;
    measuredWeight: number;
    measuredQuantity: number;
    standardPrice: any;
}

export interface FindPricePayload{
    isViewPricing: boolean;
    payload: PriceRequest;
}

export interface FindPriceResponse{
    isViewPricing: boolean;
    data: any;
}

export interface TaxPayload{
    itemCode: string;
    txnType: string;
}