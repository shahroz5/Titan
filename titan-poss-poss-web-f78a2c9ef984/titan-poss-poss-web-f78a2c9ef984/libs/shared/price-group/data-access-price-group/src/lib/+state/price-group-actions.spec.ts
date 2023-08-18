

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { PriceGroupListPayload, PriceGroupListing, CustomErrors, PriceGroupMaster, UpdatePriceGroupMasterPayload, SavePriceGroupMasterPayload } from '@poss-web/shared/models';
import { LoadPriceGroup, PriceGroupMasterActionsTypes, LoadPriceGroupSuccess, LoadPriceGroupFailure, LoadPriceGroupByPriceGroupCode, LoadPriceGroupByPriceGroupCodeSuccess, LoadPriceGroupByPriceGroupCodeFailure, UpdatePricGroupByPriceGroupCodeFailure, UpdatePricGroupByPriceGroupCodeSuccess, UpdatePricGroupByPriceGroupCode, SavePriceGroup, SavePriceGroupSuccess, SavePriceGroupFailure, SearchPriceGroupListFailure, SearchPriceGroupListSuccess, SearchPriceGroupList, LoadReset } from './price-group-actions';


describe('Price Group Action Testing Suite', () => {
    describe('LoadPriceGroup Action Test Cases', () => {
        it('should check correct type is used for  LoadPriceGroup action ', () => {
            const payload: PriceGroupListPayload = {
                pageIndex: 0,
                pageSize: 100
            };
            const action = new LoadPriceGroup(payload);
            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_LISTING,
                payload
            });
        });
        it('should check correct type is used for  LoadPriceGroupSuccess action ', () => {
            const payload: PriceGroupListing = { results: [], totalElements: 0 };
            const action = new LoadPriceGroupSuccess(payload);

            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_LISTING_SUCCESS,
                payload
            });
        });
        it('should check correct type is used for  LoadPriceGroupFailure action ', () => {
            const payload: CustomErrors = CustomErrorAdaptor.fromJson(
                Error('Some Error')
            );
            const action = new LoadPriceGroupFailure(payload);

            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_LISTING_FAILURE,
                payload
            });
        });
    });
    describe('LoadPriceGroupByPriceGroupCode Action Test Cases', () => {
        it('should check correct type is used for  LoadPriceGroupByPriceGroupCode action ', () => {
            const payload = 'abc'
            const action = new LoadPriceGroupByPriceGroupCode(payload);
            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE,
                payload
            });
        });
        it('should check correct type is used for LoadPriceGroupByPriceGroupCodeSuccess action ', () => {
            const payload: PriceGroupMaster = { description: 'ABC', priceGroup: "ABC", isActive: true };
            const action = new LoadPriceGroupByPriceGroupCodeSuccess(payload);

            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE_SUCCESS,
                payload
            });
        });
        it('should check correct type is used for  LoadPriceGroupByPriceGroupCodeFailure action ', () => {
            const payload: CustomErrors = CustomErrorAdaptor.fromJson(
                Error('Some Error')
            );
            const action = new LoadPriceGroupByPriceGroupCodeFailure(payload);

            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE_FAILURE,
                payload
            });
        });
    });
    describe('UpdatePricGroupByPriceGroupCode Action Test Cases', () => {
        it('should check correct type is used for  UpdatePricGroupByPriceGroupCode action ', () => {
            const payload: UpdatePriceGroupMasterPayload = {
                priceGroup: "ABC",
                data: {
                    isActive: false
                }
            }
            const action = new UpdatePricGroupByPriceGroupCode(payload);
            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE,
                payload
            });
        });
        it('should check correct type is used for UpdatePricGroupByPriceGroupCodeSuccess action ', () => {
            const action = new UpdatePricGroupByPriceGroupCodeSuccess();

            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE_SUCCESS,

            });
        });
        it('should check correct type is used for  UpdatePricGroupByPriceGroupCodeFailure action ', () => {
            const payload: CustomErrors = CustomErrorAdaptor.fromJson(
                Error('Some Error')
            );
            const action = new UpdatePricGroupByPriceGroupCodeFailure(payload);

            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE_FAILURE,
                payload
            });
        });
    });

    describe('SavePriceGroup Action Test Cases', () => {
        it('should check correct type is used for  SavePriceGroup action ', () => {
            const payload: SavePriceGroupMasterPayload = {
                priceGroup: "ABC",
                description: "ABC",
                isActive: true
            }
            const action = new SavePriceGroup(payload);
            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.SAVE_PRICE_GROUP,
                payload
            });
        });
        it('should check correct type is used for SavePriceGroupSuccess action ', () => {

            const action = new SavePriceGroupSuccess();

            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.SAVE_PRICE_GROUP_SUCCESS,

            });
        });
        it('should check correct type is used for  SavePriceGroupFailure action ', () => {
            const payload: CustomErrors = CustomErrorAdaptor.fromJson(
                Error('Some Error')
            );
            const action = new SavePriceGroupFailure(payload);

            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.SAVE_PRICE_GROUP_FAILURE,
                payload
            });
        });
    });
    describe('SearchPriceGroupList Action Test Cases', () => {
        it('should check correct type is used for  SearchPriceGroupList action ', () => {
            const payload = 'ABC'
            const action = new SearchPriceGroupList(payload);
            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.SEARCH_PRICE_GROUP_LIST,
                payload
            });
        });
        it('should check correct type is used for SearchPriceGroupListSuccess action ', () => {
            const payload: PriceGroupListing = { results: [], totalElements: 0 };
            const action = new SearchPriceGroupListSuccess(payload);

            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.SEARCH_PRICE_GROUP_LIST_SUCCESS,
                payload
            });
        });
        it('should check correct type is used for SearchPriceGroupListFailure action ', () => {
            const payload: CustomErrors = CustomErrorAdaptor.fromJson(
                Error('Some Error')
            );
            const action = new SearchPriceGroupListFailure(payload);

            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.SEARCH_PRICE_GROUP_LIST_FAILURE,
                payload
            });
        });
    });

    describe('LoadReset Action Test Cases', () => {
        it('should check correct type is used for  LoadReset action ', () => {
            const action = new LoadReset();
            expect({ ...action }).toEqual({
                type: PriceGroupMasterActionsTypes.LOAD_RESET,

            });
        });

    });
});