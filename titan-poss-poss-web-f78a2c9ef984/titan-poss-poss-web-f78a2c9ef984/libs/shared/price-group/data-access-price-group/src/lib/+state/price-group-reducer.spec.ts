//you should simply assert that you get the right state given the provided inputs.

import * as actions from './price-group-actions';

import { PriceGroupState } from './price-group-state';
import { priceGroupReducer, initialState } from './price-group-reducer';
import { PriceGroupMaster, PriceGroupListing, PriceGroupListPayload, SavePriceGroupMasterPayload, UpdatePriceGroupMasterPayload } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Price Group reducer Testing Suite', () => {

    const createPriceGroup = (
        priceGroup: string,
        description: string,
        isActive: boolean
    ): PriceGroupMaster => {
        return {
            priceGroup,
            description,
            isActive
        };
    };

    const priceGroup1 = createPriceGroup(
        'priceGroup1',
        'priceGroup1',
        true
    );

    const priceGroup2 = createPriceGroup(
        'priceGroup2',
        'priceGroup2',
        true
    );

    describe('Testing Load price group listing ', () => {
        beforeEach(() => { });
        it('LoadPriceGroupSuccess should return list of price groups', () => {
            const payload: PriceGroupListPayload = {
                pageIndex: 0,
                pageSize: 100
            };

            const action = new actions.LoadPriceGroup(payload);

            const result: PriceGroupState = priceGroupReducer(
                initialState,
                action
            );

            expect(result.isloading).toBe(true);


        });
        it('LoadPriceGroupSuccess should return list of price groups', () => {
            const priceGroupArray = [priceGroup1, priceGroup2];
            const priceGroupList: PriceGroupListing = { results: priceGroupArray, totalElements: 2 }
            const action = new actions.LoadPriceGroupSuccess(priceGroupList);

            const result: PriceGroupState = priceGroupReducer(
                initialState,
                action
            );

            expect(result.isloading).toBe(false);
            expect(result.priceGroupList.ids.length).toBe(2);

        });
        it('LoadPriceGroupFailure should return error', () => {
            const action = new actions.LoadPriceGroupFailure(
                CustomErrorAdaptor.fromJson(Error('some error'))
            );

            const result: PriceGroupState = priceGroupReducer(initialState, action);

            expect(result.error.message).toEqual('some error');
        });
    });

    describe('Testing Search price group Functionality ', () => {
        beforeEach(() => { });
        it('SearchPriceGroupList should return searched price group', () => {
            const payload = 'priceGroup'
            const priceGroupArray = [priceGroup1];

            const action = new actions.SearchPriceGroupList(payload);

            const result: PriceGroupState = priceGroupReducer(
                initialState,
                action
            );

            expect(result.isloading).toBe(true);

        });
        it('SearchPriceGroupListSuccess should return searched price group', () => {
            const priceGroupArray = [priceGroup1];
            const priceGroupList: PriceGroupListing = { results: priceGroupArray, totalElements: 1 }
            const action = new actions.SearchPriceGroupListSuccess(priceGroupList);

            const result: PriceGroupState = priceGroupReducer(
                initialState,
                action
            );

            expect(result.isloading).toBe(false);
            expect(result.priceGroupList.ids.length).toBe(1);

        });
        it('SearchPriceGroupListFailure should return error', () => {
            const action = new actions.SearchPriceGroupListFailure(
                CustomErrorAdaptor.fromJson(Error('some error'))
            );

            const result: PriceGroupState = priceGroupReducer(initialState, action);

            expect(result.error.message).toEqual('some error');
        });
    });
    describe('Testing SavePriceGroupSuccessFunctionality ', () => {
        beforeEach(() => { });
        it('SavePriceGroup ', () => {
            const payload: SavePriceGroupMasterPayload = {
                priceGroup: "ABC",
                description: "ABC",
                isActive: true
            }
            const action = new actions.SavePriceGroup(payload);

            const result: PriceGroupState = priceGroupReducer(
                initialState,
                action
            );

            expect(result.isloading).toBe(true);


        });
        it('SavePriceGroupSuccess should update the hasSaved property to true', () => {

            const action = new actions.SavePriceGroupSuccess();

            const result: PriceGroupState = priceGroupReducer(
                initialState,
                action
            );

            expect(result.isloading).toBe(false);
            expect(result.hasSaved).toBe(true)

        });
        it('SavePriceGroupFailure should return error', () => {
            const action = new actions.SavePriceGroupFailure(
                CustomErrorAdaptor.fromJson(Error('some error'))
            );

            const result: PriceGroupState = priceGroupReducer(initialState, action);

            expect(result.error.message).toEqual('some error');
        });
    });

    describe('Testing UpdatePricGroupByPriceGroupCodeSuccess ', () => {
        beforeEach(() => { });
        it('UpdatePricGroupByPriceGroupCode ', () => {
            const payload: UpdatePriceGroupMasterPayload = {
                priceGroup: "ABC",
                data: {
                    isActive: false
                }
            }
            const action = new actions.UpdatePricGroupByPriceGroupCode(payload);

            const result: PriceGroupState = priceGroupReducer(
                initialState,
                action
            );

            expect(result.isloading).toBe(true);


        });
        it('UpdatePricGroupByPriceGroupCodeSuccess should update the hasUpdated property to true', () => {

            const action = new actions.UpdatePricGroupByPriceGroupCodeSuccess();

            const result: PriceGroupState = priceGroupReducer(
                initialState,
                action
            );

            expect(result.isloading).toBe(false);
            expect(result.hasUpdated).toBe(true)

        });
        it('UpdatePricGroupByPriceGroupCodeFailure should return error', () => {
            const action = new actions.UpdatePricGroupByPriceGroupCodeFailure(
                CustomErrorAdaptor.fromJson(Error('some error'))
            );

            const result: PriceGroupState = priceGroupReducer(initialState, action);

            expect(result.error.message).toEqual('some error');
        });
    });

    describe('Testing LoadPriceGroupByPriceGroupCodeSuccess ', () => {
        beforeEach(() => { });
        it('LoadPriceGroupByPriceGroupCode should return the price group object', () => {
            const payload = "priceGroup"
            const action = new actions.LoadPriceGroupByPriceGroupCode(payload);

            const result: PriceGroupState = priceGroupReducer(
                initialState,

                action
            );

            expect(result.isloading).toBe(true);


        });
        it('LoadPriceGroupByPriceGroupCodeSuccess should return the price group object', () => {

            const action = new actions.LoadPriceGroupByPriceGroupCodeSuccess(priceGroup1);

            const result: PriceGroupState = priceGroupReducer(
                initialState,

                action
            );

            expect(result.isloading).toBe(false);
            expect(result.priceGroup).toEqual(priceGroup1)

        });
        it('LoadPriceGroupByPriceGroupCodeFailure should return error', () => {
            const action = new actions.LoadPriceGroupByPriceGroupCodeFailure(
                CustomErrorAdaptor.fromJson(Error('some error'))
            );

            const result: PriceGroupState = priceGroupReducer(initialState, action);

            expect(result.error.message).toEqual('some error');
        });
    });

    describe('Testing LoadReset ', () => {
        beforeEach(() => { });
        it('LoadReset should reset the store', () => {

            const action = new actions.LoadReset();

            const result: PriceGroupState = priceGroupReducer(
                initialState,

                action
            );

            expect(result).toEqual(initialState);



        });
    });


});
