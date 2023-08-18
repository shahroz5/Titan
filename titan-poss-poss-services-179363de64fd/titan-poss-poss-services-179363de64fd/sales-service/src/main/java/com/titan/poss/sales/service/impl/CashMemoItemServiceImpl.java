/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.dto.CoinDetailsDto;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ItemCodeInvWeightDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.response.InvWeightAndQuantityDto;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.ItemDetailsDto;
import com.titan.poss.sales.dto.ItemDetailsUpdateDto;
import com.titan.poss.sales.dto.ItemDiscountDetailsDto;
import com.titan.poss.sales.dto.ItemInvDetailsDto;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.request.SalesItemDto;
import com.titan.poss.sales.dto.response.CashMemoAndItemDetialsResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CashMemoRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CashMemoItemService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.DiscountFacadeService;
import com.titan.poss.sales.service.DiscountItemFacadeService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OrderUtilService;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for Cash memo Item.
 * 
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesCashMemoItemService")
public class CashMemoItemServiceImpl implements CashMemoItemService {

	@Autowired
	private CashMemoRepositoryExt cashMemoRepository;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Autowired
	private InventoryService inventoryService;

	@Autowired
	private CashMemoItemServiceImpl cashMemoItemService;

	@Autowired
	private OrderUtilService orderUtilService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountItemFacadeService discountItemFacadeService;

	@Autowired
	private CommonPaymentService commonPaymentService;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private DiscountFacadeService discountFacadeService;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	private static final String BIN_GROUP_RESERVE_BIN = "RESERVEBIN";

	private static final String ERR_SALE_052 = "ERR-SALE-052";
	private static final String ITEM_CANNOT_BE_CHANGED = "Item cannot be changed.";

	private static final String ERR_SALE_203 = "ERR-SALE-203";
	private static final String LOT_NUMBER_CANNOT_BE_CHANGED_FOR_THE_ITEM = "Lot number cannot be changed for the item.";


	private List<CashMemoDetailsDaoExt> checkIfItemsAreInStock(String id) {
		// get cash memo items if exists.
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = commonCashMemoService.getCashMemoDetails(id);

		// check if items are in stock.
		commonCashMemoService.checkIfItemsInStock(cashMemoDetailsDaoList);

		return cashMemoDetailsDaoList;

	}

	@Transactional
	@Override
	public CashMemoAndItemDetialsResponseDto addItemToCashMemo(String id, String transactionType, String subTxnType,
			ItemDetailsDto itemDetailsCreateDto, Boolean isIGST) {
		log.info("Add item to CM :- " + id + " Item code: " + itemDetailsCreateDto.getItemCode() + " Inventory id: "
				+ itemDetailsCreateDto.getInventoryId());

		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);

		// check if items are in stock.
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = checkIfItemsAreInStock(id);

		// only cash memo on hold or open?
		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		// Add or Update item should be restricted in case FOC added in CM
		commonCashMemoService.checkIfFocAdded(cashMemoDao.getSalesTxnDao(), false,
				"Add/Update item is not allowed as FOC added in CM.");

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(cashMemoDao.getSalesTxnDao());

		commonTransactionService.paymentCheckForItemORCustomerUpdate(cashMemoDao.getSalesTxnDao(), false, false, false);

		CashMemoDetailsDaoExt cashMemoDetailsDao = (CashMemoDetailsDaoExt) MapperUtil
				.getObjectMapping(itemDetailsCreateDto, new CashMemoDetailsDaoExt());
		cashMemoDetailsDao.setCashMemoDao(cashMemoDao);

		validateMappedCashMemoDetails(cashMemoDetailsDao, cashMemoDao.getSalesTxnDao(), null);

		// row Id.
		cashMemoDetailsDao.setRowId(cashMemoDetailsRepository.countByCashMemoDaoId(id) + 1);

		cashMemoDetailsDao.setSrcSyncId(0);
		cashMemoDetailsDao.setDestSyncId(0);

		// update AB item(if exists for temp delete)
		if (cashMemoDetailsDao.getOrderItem() != null) {
			if (BooleanUtils.isTrue(cashMemoDetailsDao.getOrderItem().getIsItemToBeReleased())) {
				cashMemoDetailsDao.getOrderItem().setIsItemToBeReleased(false);
				orderDetailsRepository.save(cashMemoDetailsDao.getOrderItem());
			}

			// in AB to CM, for coins - total quantity cannot be edited
			// NOTE: for coins lot number will come not come in input
			if ((SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(cashMemoDetailsDao.getProductGroupCode())
					|| SalesConstants.SILVER_COIN_PRODUCT_GROUP_CODE.equals(cashMemoDetailsDao.getProductGroupCode()))
					&& itemDetailsCreateDto.getTotalQuantity()
							.compareTo(cashMemoDetailsDao.getOrderItem().getTotalQuantity()) != 0) {
				throw new ServiceException(ITEM_CANNOT_BE_CHANGED, ERR_SALE_052,
						"Quantity cannot be edited for coins from AB/CO");
			}
		}

		cashMemoDetailsDao = cashMemoDetailsRepository.save(cashMemoDetailsDao);

		// Validate pre-order details, if exists
		commonCashMemoService.validatePreOrderDetailsIfExists(cashMemoDao);

		// update cashMemo total details
		// add current item to CM item list
		cashMemoDetailsDaoList.add(cashMemoDetailsDao);
		updatedCashMemoHeader(cashMemoDao, cashMemoDetailsDaoList);
		cashMemoDao.setSrcSyncId(cashMemoDao.getSrcSyncId() + 1);
		cashMemoDao = cashMemoRepository.save(cashMemoDao);
		// RIVAAH DISCOUNT VALIDATION
		discountUtilService.validateRivaahDiscounts(cashMemoDao.getSalesTxnDao());
		return mapCashMemoAndItemToResponse(cashMemoDao, cashMemoDetailsDao);
	}

	@Override
	public ListResponse<ItemDetailsResponseDto> listCashMemoItems(Integer customerId) {

		List<String> cmIds = cashMemoRepository.getAllConfirmedCmIdOfToday(CommonUtil.getStoreCode(), customerId,
				businessDayService.getBusinessDay().getBusinessDate());

		List<ItemDetailsResponseDto> items = new ArrayList<>();

		// if any CM available, list all CM items
		if (!cmIds.isEmpty()) {

			List<CashMemoDetailsDaoExt> cashMemoItems = cashMemoDetailsRepository.findByCashMemoDaoIdIn(cmIds);
			if (!cashMemoItems.isEmpty()) {

				items = cashMemoItems.stream().map(this::mapCashMemoDetailsToItemDto).collect(Collectors.toList());
			}
		}
		return new ListResponse<>(items);
	}

	@Transactional
	@Override
	public ItemDetailsResponseDto getItemInCashMemo(String id, String itemId, String transactionType,
			String subTxnType) {

		CashMemoDaoExt cashMemoDaoExt = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);
		CashMemoDetailsDaoExt cashMemoDetailsDao = checkIfItemExists(itemId, id);

		// check if item is in stock - different for coins and items

		// for coins: itemCode, weight, quantity, productGroup and locationCode(doubt -
		// should check for binGroup?)

		// for items - check by inventory id, quantity and locationCode(doubt - should
		// check for binGroup?)

		// update: ignore for CONFIRMED/CANCELLED status.
		if (BooleanUtils
				.isTrue(SalesUtil.checkTranscationStatusForUpdate(cashMemoDaoExt.getSalesTxnDao().getStatus()))) {
			checkItemInStock(cashMemoDetailsDao);
		}

		return mapCashMemoDetailsToItemDto(cashMemoDetailsDao);

	}

	@Transactional
	@Override
	public CashMemoAndItemDetialsResponseDto updateCashMemoItem(String id, String itemId, String transactionType,
			String subTxnType, ItemDetailsDto itemDetailsCreateDto, Boolean removeFromOrder) {

		log.info("Add item to CM :- " + id + ", item id: " + itemId);
		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		// check if items are in stock.
		List<CashMemoDetailsDaoExt> cashMemoDetailsList = checkIfItemsAreInStock(id);

		commonTransactionService.paymentCheckForItemORCustomerUpdate(cashMemoDao.getSalesTxnDao(), false, false, false);
		// check item payment
		commonTransactionService.checkPaymentItemMapping(itemId);

		// Add or Update item should be restricted in case FOC added in CM
		commonCashMemoService.checkIfFocAdded(cashMemoDao.getSalesTxnDao(), false,
				"Add/Update item is not allowed as FOC added in CM.");

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(cashMemoDao.getSalesTxnDao());

		CashMemoDetailsDaoExt cashMemoDetailsDao = checkIfItemExistsInListAndRemoveIfExists(itemId,
				cashMemoDetailsList);

		Boolean isDiscountReset = Boolean.FALSE;
		if (cashMemoDetailsDao.getOrderItem() != null) {
			// Delete the item level discounts applied
			discountItemFacadeService.deleteItemDiscounts(cashMemoDao.getSalesTxnDao().getId(), transactionType,
					subTxnType, itemId, true);
			// if Item is from AB and carried txn level discounts are applied, then throw
			// error(previously, linked txn will not be checked)
			if (isLinkedTransactionLevelDiscointPresent(cashMemoDao.getSalesTxnDao(), cashMemoDetailsDao.getId())) {
				throw new ServiceException(
						SalesConstants.WEIGHT_CANNOT_BE_EDITED_AS_TRANSACTION_LEVEL_DISCOUNTS_ARE_ADDED,
						SalesConstants.ERR_DISC_040,
						SalesConstants.WEIGHT_CANNOT_BE_EDITED_AS_TRANSACTION_LEVEL_DISCOUNTS_ARE_ADDED);

			}
			discountFacadeService.deleteLinkedTransactionLevelDiscountForAnItem(cashMemoDao.getSalesTxnDao().getId(),
					transactionType, subTxnType, itemId);
			// reset totalDiscount
			itemDetailsCreateDto.setTotalDiscount(BigDecimal.ZERO);
			isDiscountReset = Boolean.TRUE;
		}

		if (!cashMemoDetailsDao.getItemCode().equals(itemDetailsCreateDto.getItemCode())) {
			throw new ServiceException(ITEM_CANNOT_BE_CHANGED, ERR_SALE_052, "Item code cannot be changed in update.");
		}

		checkLinkedItem(itemDetailsCreateDto, removeFromOrder, cashMemoDetailsDao);

		cashMemoDetailsDao = (CashMemoDetailsDaoExt) MapperUtil.getObjectMapping(itemDetailsCreateDto,
				cashMemoDetailsDao);
		// explicit set
		cashMemoDetailsDao.setRemarks(itemDetailsCreateDto.getRemarks());
		cashMemoDetailsDao.setReason(itemDetailsCreateDto.getReason());

		validateMappedCashMemoDetails(cashMemoDetailsDao, cashMemoDao.getSalesTxnDao(), isDiscountReset);

		cashMemoDetailsDao.setSrcSyncId(cashMemoDetailsDao.getDestSyncId() + 1);
		// update AB item(if exists for temp delete)
		if (cashMemoDetailsDao.getOrderItem() != null
				&& BooleanUtils.isTrue(cashMemoDetailsDao.getOrderItem().getIsItemToBeReleased())) {
			cashMemoDetailsDao.getOrderItem().setIsItemToBeReleased(false);
			orderDetailsRepository.save(cashMemoDetailsDao.getOrderItem());
		}
		cashMemoDetailsDao = cashMemoDetailsRepository.save(cashMemoDetailsDao);

		// add updated item to list
		cashMemoDetailsList.add(cashMemoDetailsDao);
		// update cash memo total details - get updated item list
		updatedCashMemoHeader(cashMemoDao, cashMemoDetailsList);
		cashMemoDao.setSrcSyncId(cashMemoDao.getDestSyncId() + 1);
		cashMemoDao = cashMemoRepository.save(cashMemoDao);
		// RIVAAH DISCOUNT VALIDATION
		discountUtilService.validateRivaahDiscounts(cashMemoDao.getSalesTxnDao());

		return mapCashMemoAndItemToResponse(cashMemoDao, cashMemoDetailsDao);

	}

	private void checkLinkedItem(ItemDetailsDto itemDetailsCreateDto, Boolean removeFromOrder,
			CashMemoDetailsDaoExt cashMemoDetailsDao) {
		if (!StringUtils.isEmpty(cashMemoDetailsDao.getOrderItem())) {
			// for AB to CM item, then lot number change is not allowed.
			if (!StringUtils.isEmpty(cashMemoDetailsDao.getLotNumber())
					&& (!cashMemoDetailsDao.getLotNumber().equals(itemDetailsCreateDto.getLotNumber()))) {
				// check if 'removeFromOrder' is provided
				if (removeFromOrder == null) {
					throw new ServiceException(LOT_NUMBER_CANNOT_BE_CHANGED_FOR_THE_ITEM, ERR_SALE_203,
							"Lot number cannot be changed for items converted from AB to CM. Please mention if item can be deleted or not from AB.");
				} else {

					if (BooleanUtils.isTrue(removeFromOrder)) {
						log.info("Release order item id:- {}", cashMemoDetailsDao.getOrderItem().getId());

						orderUtilService.releaseItemFromReserveBin(cashMemoDetailsDao.getOrderItem());
					}
					// clear 'getOrderItem'
					cashMemoDetailsDao.setOrderItem(null);
				}

			} // in AB to CM, for coins - total quantity cannot be edited
				// NOTE: for coins lot number will come not come in input
			else if (cashMemoDetailsDao.getLotNumber() == null && itemDetailsCreateDto.getTotalQuantity()
					.compareTo(cashMemoDetailsDao.getOrderItem().getTotalQuantity()) != 0) {
				throw new ServiceException(ITEM_CANNOT_BE_CHANGED, ERR_SALE_052,
						"Quantity cannot be edited for coins from AB/CO");
			}

		}
	}

	@Transactional
	@Override
	public CashMemoAndItemDetialsResponseDto partialUpdateCashMemoItem(String id, String itemId, String transactionType,
			String subTxnType, ItemDetailsUpdateDto itemDetailsUpdateDto) {

		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);
		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());

		// check if items are in stock.
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = checkIfItemsAreInStock(id);

		// check to be ignored only for RSO update
		if (!StringUtils.isEmpty(itemDetailsUpdateDto.getTotalTax())) {
			commonTransactionService.paymentCheckForItemORCustomerUpdate(cashMemoDao.getSalesTxnDao(), false, false,
					false);
			commonTransactionService.checkPaymentItemMapping(itemId);

			// Validate If any Bill level discount already applied
			discountUtilService.checkIfBillLevelDiscountApplied(cashMemoDao.getSalesTxnDao());

		}

		CashMemoDetailsDaoExt cashMemoDetailsDao = checkIfItemExistsInListAndRemoveIfExists(itemId,
				cashMemoDetailsDaoList);

		cashMemoDetailsDao = checkPartialUpdateInputs(itemDetailsUpdateDto, cashMemoDetailsDao);

		cashMemoDetailsDao.setSrcSyncId(cashMemoDetailsDao.getDestSyncId() + 1);
		cashMemoDetailsDao = cashMemoDetailsRepository.save(cashMemoDetailsDao);

		// update cash memo total details
		if (!StringUtils.isEmpty(itemDetailsUpdateDto.getTotalTax())) {
			// add updated CM item to list
			cashMemoDetailsDaoList.add(cashMemoDetailsDao);
			updatedCashMemoHeader(cashMemoDao, cashMemoDetailsDaoList);
			cashMemoDao.setSrcSyncId(cashMemoDao.getDestSyncId() + 1);
			cashMemoRepository.save(cashMemoDao);
		}

		// RIVAAH DISCOUNT VALIDATION
		discountUtilService.validateRivaahDiscounts(cashMemoDao.getSalesTxnDao());

		return mapCashMemoAndItemToResponse(cashMemoDao, cashMemoDetailsDao);

	}

	/**
	 * @param itemDetailsUpdateDto
	 * @param cashMemoDetailsDao
	 * @return
	 */
	private CashMemoDetailsDaoExt checkPartialUpdateInputs(ItemDetailsUpdateDto itemDetailsUpdateDto,
			CashMemoDetailsDaoExt cashMemoDetailsDao) {
		// RSO name check - if comes as empty value (""), then discard RSO name
		// currently saved
		if (itemDetailsUpdateDto.getEmployeeCode() != null && "".equals(itemDetailsUpdateDto.getEmployeeCode())) {
			cashMemoDetailsDao.setEmployeeCode(null);
			itemDetailsUpdateDto.setEmployeeCode(null);
		}

		cashMemoDetailsDao = (CashMemoDetailsDaoExt) MapperUtil.getObjectMapping(itemDetailsUpdateDto,
				cashMemoDetailsDao);

		// get tax details and update net or total value
		if (!StringUtils.isEmpty(itemDetailsUpdateDto.getTotalTax())) {

			commonCashMemoService.validateTaxDetails(cashMemoDetailsDao, false, true);

			// update final value
			BigDecimal finalValue = commonTransactionService.getItemFinalValue(cashMemoDetailsDao.getTotalValue(),
					cashMemoDetailsDao.getTotalDiscount(), cashMemoDetailsDao.getTotalTax(),
					cashMemoDetailsDao.getHallmarkCharges(), cashMemoDetailsDao.getHallmarkDiscount());
			cashMemoDetailsDao.setFinalValue(finalValue);
		}

		if (!StringUtil.isBlankJsonData(itemDetailsUpdateDto.getDiscountDetails())
				&& itemDetailsUpdateDto.getDiscountDetails().getData() != null) {
			ItemDiscountDetailsDto itemDiscountDetailsDto = MapperUtil
					.mapObjToClass(itemDetailsUpdateDto.getDiscountDetails().getData(), ItemDiscountDetailsDto.class);
			itemDiscountDetailsDto.validate(itemDiscountDetailsDto);

			JsonData jsonData = MapperUtil.mapObjToClass(cashMemoDetailsDao.getDiscountDetails(), JsonData.class);

			ItemDiscountDetailsDto itemDiscountDetailsDtoExisting;
			if (jsonData == null || jsonData.getData() == null) {
				itemDiscountDetailsDtoExisting = itemDiscountDetailsDto;
			} else {
				itemDiscountDetailsDtoExisting = MapperUtil.mapObjToClass(jsonData.getData(),
						ItemDiscountDetailsDto.class);
				itemDiscountDetailsDtoExisting = (ItemDiscountDetailsDto) MapperUtil
						.getObjectMapping(itemDiscountDetailsDto, itemDiscountDetailsDtoExisting);
			}

			cashMemoDetailsDao.setDiscountDetails(
					MapperUtil.getStringFromJson(new JsonData("DISCOUNT_DETAILS", itemDiscountDetailsDtoExisting)));
		}

		return cashMemoDetailsDao;
	}

	@Transactional
	@Override
	public CashMemoResponseDto deleteCashMemoItem(String id, String itemId, String transactionType, String subTxnType,
			Boolean removeFromOrder) {

		log.info("Delete item  id:- {} from CM id:- {}", itemId, id);

		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);

		commonTransactionService.checkTranscationStatusForUpdate(cashMemoDao.getSalesTxnDao().getStatus());
		commonTransactionService.paymentCheckForItemORCustomerUpdate(cashMemoDao.getSalesTxnDao(), false, false, false);

		CashMemoDetailsDaoExt cashMemoDetailsDao = checkIfItemExists(itemId, id);

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(cashMemoDao.getSalesTxnDao());

		// Delete the item level discounts applied
		discountItemFacadeService.deleteItemDiscounts(cashMemoDao.getSalesTxnDao().getId(), transactionType, subTxnType,
				itemId, true);
		// if Item is from AB, then delete bill level discounts also
		if (cashMemoDetailsDao.getOrderItem() != null) {
			discountFacadeService.deleteLinkedTransactionLevelDiscountForAnItem(cashMemoDao.getSalesTxnDao().getId(),
					transactionType, subTxnType, itemId);
		}

		// pending - check if payment is done for the item. - GV, Cash back

		cashMemoDetailsDao.setSrcSyncId(cashMemoDetailsDao.getDestSyncId() + 1);

		// If pre ordered item, release from reserve bin & update order details
		if (BooleanUtils.isTrue(removeFromOrder)) {
			if (StringUtils.isEmpty(cashMemoDetailsDao.getOrderItem().getId())) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						"Not a pre-ordered item to remove from order");
			}

			log.info("Release order item id:- {}", cashMemoDetailsDao.getOrderItem().getId());
			orderUtilService.releaseItemFromReserveBin(cashMemoDetailsDao.getOrderItem());
		}
		// check if payment is done for the item
		commonTransactionService.checkPaymentItemMapping(itemId);

		cashMemoDetailsRepository.delete(cashMemoDetailsDao);

		// row id. update for other items
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList = commonCashMemoService
				.getCashMemoDetails(cashMemoDao.getId());
		if (!CollectionUtils.isEmpty(cashMemoDetailsDaoList)) {
			Integer rowId = 1;
			for (CashMemoDetailsDaoExt cashMemoDetails : cashMemoDetailsDaoList) {
				cashMemoDetails.setRowId(rowId++);
				cashMemoDetailsDao.setSrcSyncId(cashMemoDetailsDao.getDestSyncId() + 1);
			}
			cashMemoDetailsRepository.saveAll(cashMemoDetailsDaoList);
		} else if (CollectionUtils.isEmpty(cashMemoDetailsDaoList)
				&& TransactionStatusEnum.HOLD.name().equals(cashMemoDao.getSalesTxnDao().getStatus())
				&& BooleanUtils.isTrue(cashMemoDetailsDao.getItemInStock())) {
			cashMemoItemService.checkItemInStock(cashMemoDetailsDao);

			if (BooleanUtils.isTrue(cashMemoDetailsDao.getItemInStock())) {
				throw new ServiceException(SalesConstants.ITEM_CANNOT_BE_DELETED, SalesConstants.ERR_SALE_181,
						"Item cannot be deleted as it is the last item in the transaction which is on 'HOLD'.");
			}
		}
		// update cash memo total details
		updatedCashMemoHeader(cashMemoDao, cashMemoDetailsDaoList);

		cashMemoDao.setSrcSyncId(cashMemoDao.getDestSyncId() + 1);
		cashMemoRepository.save(cashMemoDao);

		return commonCashMemoService.cashMemoResponse(cashMemoDao);

	}

	private CashMemoDaoExt updatedCashMemoHeader(CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {
		return commonCashMemoService.updatedCashMemoHeader(cashMemoDao, cashMemoDetailsDaoList);
	}

	private CashMemoDetailsDaoExt checkIfItemExists(String itemId, String cashMemoId) {
		CashMemoDetailsDaoExt cashMemoDetailsDao = cashMemoDetailsRepository.findOneByIdAndCashMemoDaoId(itemId,
				cashMemoId);

		if (cashMemoDetailsDao == null) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid item id: " + itemId, Map.of("type", "item"));
		}

		return cashMemoDetailsDao;

	}

	private CashMemoDetailsDaoExt checkIfItemExistsInListAndRemoveIfExists(String itemId,
			List<CashMemoDetailsDaoExt> cashMemoDetailsList) {
		CashMemoDetailsDaoExt cashMemoDetailsDao = null;
		int itemFoundAt = 0;
		for (CashMemoDetailsDaoExt cashMemoItem : cashMemoDetailsList) {
			if (itemId.equals(cashMemoItem.getId())) {
				cashMemoDetailsDao = cashMemoItem;
				break;
			}
			itemFoundAt += 1;
		}

		// if item not found
		if (cashMemoDetailsDao == null) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid cash memo item id: " + itemId, Map.of("type", "item"));
		}

		// remove item from list and all at the end.
		cashMemoDetailsList.remove(itemFoundAt);

		return cashMemoDetailsDao;
	}

	@Override
	public ItemDetailsResponseDto mapCashMemoDetailsToItemDto(CashMemoDetailsDaoExt cashMemoDetailsDao) {
		return commonCashMemoService.mapCashMemoDetailsToItemDto(cashMemoDetailsDao);
	}

	private CashMemoAndItemDetialsResponseDto mapCashMemoAndItemToResponse(CashMemoDaoExt cashMemoDao,
			CashMemoDetailsDaoExt cashMemoDetailsDao) {

		CashMemoAndItemDetialsResponseDto cashMemoAndItemDetialsResponseDto = (CashMemoAndItemDetialsResponseDto) MapperUtil
				.getDtoMapping(commonCashMemoService.cashMemoResponse(cashMemoDao),
						CashMemoAndItemDetialsResponseDto.class);
		cashMemoAndItemDetialsResponseDto.setItemDetailsDto(mapCashMemoDetailsToItemDto(cashMemoDetailsDao));

		return cashMemoAndItemDetialsResponseDto;
	}

	private void validateMappedCashMemoDetails(CashMemoDetailsDaoExt cashMemoDetailsDao, SalesTxnDaoExt salesTxnDao,
			Boolean isDiscountReset) {

		// RSO name check - if comes as empty value (""), then discard RSO name
		// currently saved
		if (cashMemoDetailsDao.getEmployeeCode() != null && "".equals(cashMemoDetailsDao.getEmployeeCode())) {
			cashMemoDetailsDao.setEmployeeCode(null);
		}

		// if rateFreeze CN is added, then metal rate check is not required.
		PaymentDetailsDaoExt rateFreezedCNPayment = commonPaymentService.getMetalRateProtectedCNIfExists(salesTxnDao);

		// get item details from item_master
		String itemPricingType = getItemMasterDetails(cashMemoDetailsDao, rateFreezedCNPayment);

		// get inventory item
		// if ProductGroupCode is 73, then get without lotNumber, else get with
		// lotNumebr.
		Short totalQuantity;
		BigDecimal invStdWeight;
		BigDecimal invStdValue;
		Object weightDetails;
		
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(salesTxnDao.getLocationCode());
		Boolean isFOCItemSaleable= locationCacheDto.getOfferDetails().getIsFOCitemssaleable();

		if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(cashMemoDetailsDao.getProductGroupCode()) ||
				SalesConstants.SILVER_COIN_PRODUCT_GROUP_CODE.equals(cashMemoDetailsDao.getProductGroupCode())) {
			CoinDetailsDto coinDetailsDto = getInventoryCoinDetails(cashMemoDetailsDao);
			totalQuantity = coinDetailsDto.getTotalQuantity().shortValue();
			invStdWeight = coinDetailsDto.getStdWeight();
			invStdValue = coinDetailsDto.getStdValue();
			weightDetails = coinDetailsDto.getTotalWeightDetails();
			// if coins then only quantity update allowed.
			commonCashMemoService.checkIfCoinIsAddedAlready(cashMemoDetailsDao);
		} else {
			InventoryItemDto inventoryItem = getInvetoryItemDetails(cashMemoDetailsDao,isFOCItemSaleable);
			totalQuantity = inventoryItem.getTotalQuantity();
			invStdWeight = inventoryItem.getStdWeight();
			invStdValue = inventoryItem.getStdValue();
			weightDetails = inventoryItem.getTotalWeightDetails();
		}

		// set inv std weight and value
		cashMemoDetailsDao.setInventoryStdWeight(invStdWeight);
		cashMemoDetailsDao.setInventoryStdValue(invStdValue);
		cashMemoDetailsDao.setInventoryWeightDetails(commonCashMemoService.getInvWeightDetails(weightDetails));

		// check if item is already present in other transaction
		commonCashMemoService.checkIfItemIsAlreadyAdded(totalQuantity, cashMemoDetailsDao);

		// validate quantity and set measured weight details if present
		commonCashMemoService.validateQuantityAndWeight(cashMemoDetailsDao, itemPricingType);
          boolean isPriceUpdate = Boolean.FALSE;
		if("82".equals(cashMemoDetailsDao.getProductGroupCode())) {
			isPriceUpdate = Boolean.TRUE;
		}
		// validate item price
		commonCashMemoService.validateItemPrice(salesTxnDao, cashMemoDetailsDao, isPriceUpdate, rateFreezedCNPayment != null);
		// validate tax details
		commonCashMemoService.validateTaxDetails(cashMemoDetailsDao, BooleanUtils.isTrue(isDiscountReset) || isPriceUpdate , false);

		// tax value check based on net value - done in validateTaxDetails
		// net value = unit * quantity - done in validateItemPrice

		if (cashMemoDetailsDao.getTotalDiscount() == null) {
			cashMemoDetailsDao.setTotalDiscount(BigDecimal.ZERO);
		}

		// @formatter:off
		// final value = (total value + hallmark charges - (total discount + hallmark
		// discount)) + total tax(includes hallmark tax also).
		// @formatter:on
		BigDecimal finalValue = commonTransactionService.getItemFinalValue(cashMemoDetailsDao.getTotalValue(),
				cashMemoDetailsDao.getTotalDiscount(), cashMemoDetailsDao.getTotalTax(),
				cashMemoDetailsDao.getHallmarkCharges(), cashMemoDetailsDao.getHallmarkDiscount());
		cashMemoDetailsDao
				.setFinalValue(BooleanUtils.isTrue(isDiscountReset) ? finalValue : cashMemoDetailsDao.getFinalValue());

		if (!isPriceUpdate && finalValue.compareTo(cashMemoDetailsDao.getFinalValue()) != 0) {
			throw new ServiceException(SalesConstants.PRICE_MISMATCH, SalesConstants.ERR_SALE_044,
					"Price mismatch on field: Final Value, expected value: " + finalValue + ", found value: "
							+ cashMemoDetailsDao.getFinalValue());
		}

		// check if item is applicable for Slab/HighValue discount
		if (cashMemoDetailsDao.getId() == null) { // to be done when item is first added only
			checkIfItemForSlabOrHighValuediscount(cashMemoDetailsDao);
		}

	}

	private void checkIfItemForSlabOrHighValuediscount(CashMemoDetailsDaoExt cashMemoDetailsDao) {

		// check if item can be involved in cumulative calculation for Slab/HighValue
		// discount

		SalesItemDetailsDto salesItemDetailsDto = (SalesItemDetailsDto) MapperUtil.getObjectMapping(cashMemoDetailsDao,
				new SalesItemDetailsDto(), "priceDetails");
		PriceDetailsDto priceDetails = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(cashMemoDetailsDao.getPriceDetails()), PriceDetailsDto.class);
		salesItemDetailsDto.setPriceDetails(priceDetails);

		// Set wastgae percent & making charge per gram for eligibility check for
		// Non-ucp products
		if (!StringUtils.isEmpty(priceDetails) && BooleanUtils.isFalse(priceDetails.getIsUcp())) {
			salesItemDetailsDto.setComplexityPercent(priceDetails.getMakingChargeDetails().getWastagePct());
			salesItemDetailsDto.setMakingChargePerGram(priceDetails.getMakingChargeDetails().getMakingChargePgram());
		}

		if (!StringUtils.isEmpty(cashMemoDetailsDao.getItemDetails())
				&& !StringUtils.isEmpty(cashMemoDetailsDao.getInventoryId())) {
			discountUtilService.getInventoryItemDetails(cashMemoDetailsDao.getItemDetails(),
					cashMemoDetailsDao.getInventoryId(), salesItemDetailsDto);
		}

		// Need reference Order item id during AB to CM discount flow
		if (!StringUtils.isEmpty(cashMemoDetailsDao.getOrderItem())) {
			salesItemDetailsDto.setOrderItemId(cashMemoDetailsDao.getOrderItem().getId());
		}

		cashMemoDetailsDao.setDiscountDetails(discountUtilService.checkIfItemCanBeIncludedInSlabOrHighValueDiscount(
				cashMemoDetailsDao.getDiscountDetails(), salesItemDetailsDto));
	}

	private String getItemMasterDetails(CashMemoDetailsDaoExt cashMemoDetailsDao,
			PaymentDetailsDaoExt rateFreezedCNPayment) {
		ItemSearchRequestDto itemSearchRequestDto = new ItemSearchRequestDto();
		itemSearchRequestDto.setItemCode(cashMemoDetailsDao.getItemCode());

		List<ItemDto> itemMasterDetailsList = engineService.getItems(itemSearchRequestDto).getResults();

		if (CollectionUtils.isEmpty(itemMasterDetailsList)) {
			throw new ServiceException(SalesConstants.INVALID_ITEM, SalesConstants.ERR_SALE_051,
					"Invalid item cannot be added to Cash Memo.");
		}
		// set pgc and pcc
		cashMemoDetailsDao.setProductGroupCode(itemMasterDetailsList.get(0).getProductGroupCode());
		cashMemoDetailsDao.setProductCategoryCode(itemMasterDetailsList.get(0).getProductCategoryCode());

		// if ProductGroupCode is not 73-gold coins and 82-silver coins, then lotNumber and inventoryId are mandatory
		if (!SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cashMemoDetailsDao.getProductGroupCode())
				&& (StringUtils.isEmpty(cashMemoDetailsDao.getLotNumber())
						|| StringUtils.isEmpty(cashMemoDetailsDao.getInventoryId()))) {

			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Lot Number and Inventory Id are mandatory");

		} else if (SalesConstants.COIN_PRODUCT_GROUP_CODES.contains(cashMemoDetailsDao.getProductGroupCode())) {
			// set lot number and invId to null. -for coins(as lot no. allotment happens at
			// confirmation)
			cashMemoDetailsDao.setLotNumber(null);
			cashMemoDetailsDao.setInventoryId(null);
		}

		// if freezed rate payment is added, then only allowed category items can be
		// added.
		commonTransactionService.checkItemType(cashMemoDetailsDao.getProductGroupCode(), rateFreezedCNPayment,
				itemMasterDetailsList);

		return itemMasterDetailsList.get(0).getPricingType();
	}

	// pending: validate coin with txnType
	private CoinDetailsDto getInventoryCoinDetails(CashMemoDetailsDaoExt cashMemoDetailsDao) {
		return commonTransactionService.getInventoryCoinDetails(cashMemoDetailsDao.getItemCode(),
				cashMemoDetailsDao.getInventoryWeight(), cashMemoDetailsDao.getTotalQuantity());

	}

	private InventoryItemDto getInvetoryItemDetails(CashMemoDetailsDaoExt cashMemoDetailsDao,Boolean isFOCItemSaleable ) {
		InventoryItemDto validInventoryItem = commonTransactionService.getInvetoryItemDetails(
				cashMemoDetailsDao.getInventoryId(), cashMemoDetailsDao.getInventoryWeight(),
				cashMemoDetailsDao.getTotalQuantity());
		// bin and inv weight
		// set values to cash memo details.
		cashMemoDetailsDao.setBinCode(validInventoryItem.getBinCode());
		cashMemoDetailsDao.setBinGroupCode(validInventoryItem.getBinCode());
		// set item details
		ItemInvDetailsDto itemInvDetailsDto = (ItemInvDetailsDto) MapperUtil.getDtoMapping(validInventoryItem,
				ItemInvDetailsDto.class);
		// set quantity.
		itemInvDetailsDto.setQuantity(cashMemoDetailsDao.getTotalQuantity());
		cashMemoDetailsDao.setItemDetails(MapperUtil.getStringFromJson(
				new JsonData("ITEM_DETAILS", Map.of(validInventoryItem.getInventoryId(), itemInvDetailsDto))));

		// reserve bin check to be ignored for items converted from AB to CM. and only
		// on update.
		// for 'BIN_GROUP_RESERVE_BIN' check: either order item id should be null or
		// (order item id is not null and a new item is being added to it)
		if (BIN_GROUP_RESERVE_BIN.equals(validInventoryItem.getBinGroupCode())
				&& StringUtils.isEmpty(cashMemoDetailsDao.getOrderItem())) {
			checkIfReserveBinItemIsValid(cashMemoDetailsDao, validInventoryItem);

		}

		// check binGroup and binCode
		Map<String, List<String>> validBinGroupAndCodes = SalesUtil.getBinGroupCodeAndCodeBasedOnLocationCode(BooleanUtils.isTrue(isFOCItemSaleable));

		if (StringUtils.isEmpty(cashMemoDetailsDao.getOrderItem())) {
			if (!validBinGroupAndCodes.containsKey(validInventoryItem.getBinGroupCode())) {
				String binGroupCode = validInventoryItem.getBinGroupCode();
				if (!Pattern.matches(SalesConstants.BIN_CHECK_REGEX, binGroupCode)) {
					binGroupCode = binGroupCode + " BIN";
				}
				throw new ServiceException(SalesConstants.ITEM_FROM_DYNAMIC_BIN_GROUP_CANNOT_BE_SOLD_TO_OTHERS,
						SalesConstants.ERR_SALE_002,
						"Item is in invalid Bin group: " + binGroupCode + ", hence cannot be sold.",
						Map.of(SalesConstants.BIN_GROUP, binGroupCode));
			} else if (validBinGroupAndCodes.get(validInventoryItem.getBinGroupCode()) != null && !validBinGroupAndCodes
					.get(validInventoryItem.getBinGroupCode()).contains(validInventoryItem.getBinCode())) {
				// to validate 'TEPSALE' bin of 'TEP' bin group
				// bin code check is only for TEP bin group
				String binCode = validInventoryItem.getBinCode();
				if (!Pattern.matches(SalesConstants.BIN_CHECK_REGEX, binCode)) {
					binCode = binCode + " BIN";
				}
				throw new ServiceException(SalesConstants.ITEM_FROM_DYNAMIC_BIN_GROUP_CANNOT_BE_SOLD_TO_OTHERS,
						SalesConstants.ERR_SALE_002,
						"Item is in invalid Bin group: " + binCode + ", hence cannot be sold.",
						Map.of(SalesConstants.BIN_GROUP, binCode));
			}
		}

		return validInventoryItem;
	}

	private void checkIfReserveBinItemIsValid(CashMemoDetailsDaoExt cashMemoDetailsDao,
			InventoryItemDto validInventoryItem) {
		if (cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getRefTxnId() == null) {
			throw new ServiceException(SalesConstants.ITEM_FROM_DYNAMIC_BIN_GROUP_CANNOT_BE_SOLD_TO_OTHERS,
					SalesConstants.ERR_SALE_002,
					"Item in " + validInventoryItem.getBinGroupCode() + " cannot be sold to others.",
					Map.of(SalesConstants.BIN_GROUP, validInventoryItem.getBinGroupCode()));
		}

		List<OrderDetailsDaoExt> orderDetailsList = orderDetailsRepository.findAllByOrderIdAndStatus(
				cashMemoDetailsDao.getCashMemoDao().getSalesTxnDao().getRefTxnId().getId(),
				TransactionStatusEnum.CONFIRMED.name());

		OrderDetailsDaoExt validOrderItem = null;
		for (OrderDetailsDaoExt orderdetails : orderDetailsList) {
			if (cashMemoDetailsDao.getInventoryId().equals(orderdetails.getInventoryId())) {
				validOrderItem = orderdetails;
				break;
			}
		}

		if (validOrderItem == null) {
			throw new ServiceException(SalesConstants.ITEM_FROM_DYNAMIC_BIN_GROUP_CANNOT_BE_SOLD_TO_OTHERS,
					SalesConstants.ERR_SALE_002,
					"Item in " + validInventoryItem.getBinGroupCode() + " cannot be sold to others.",
					Map.of(SalesConstants.BIN_GROUP, validInventoryItem.getBinGroupCode()));
		}

		// link oder item
		cashMemoDetailsDao.setOrderItem(validOrderItem);
	}

	/**
	 * @param cashMemoDetailsDao
	 */
	public InvWeightAndQuantityDto checkItemInStock(CashMemoDetailsDaoExt cashMemoDetailsDao) {
		boolean isCoinStockCheck = SalesConstants.COIN_PRODUCT_GROUP_CODE
				.equals(cashMemoDetailsDao.getProductGroupCode());

		InvWeightAndQuantityDto itemCodeAndQuantityDto = inventoryService.checkIfItemIsInStock(
				cashMemoDetailsDao.getInventoryId(), cashMemoDetailsDao.getItemCode(),
				cashMemoDetailsDao.getInventoryWeight(), cashMemoDetailsDao.getProductGroupCode(),
				cashMemoDetailsDao.getTotalQuantity(), isCoinStockCheck);

		// if values are different only then save the latest details
		if (!itemCodeAndQuantityDto.getIsItemInStock().equals(cashMemoDetailsDao.getItemInStock())) {
			cashMemoDetailsDao.setItemInStock(itemCodeAndQuantityDto.getIsItemInStock());
			cashMemoDetailsRepository.save(cashMemoDetailsDao);
		}

		return itemCodeAndQuantityDto;
	}

	@Override
	public PriceResponseDto getOrderItemPriceDetails(String id, String transactionType, String subTxnType,
			OrdersPriceRequest orderPriceRequest) {
		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(id, transactionType,
				subTxnType);

		CashMemoDetailsDaoExt dummyCmDetailsDao = (CashMemoDetailsDaoExt) MapperUtil.getObjectMapping(orderPriceRequest,
				new CashMemoDetailsDaoExt());
		dummyCmDetailsDao.setTotalWeight(orderPriceRequest.getMeasuredWeight());
		dummyCmDetailsDao.setTotalQuantity(orderPriceRequest.getMeasuredQuantity());
		// get item details from item_master
		getItemMasterDetails(dummyCmDetailsDao, null);

		List<InventoryDetailsDao> invList;
		if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(dummyCmDetailsDao.getProductGroupCode())) {
			ItemCodeInvWeightDto itemCodeInvWeightDto = new ItemCodeInvWeightDto(orderPriceRequest.getItemCode(),
					orderPriceRequest.getMeasuredWeight().divide(
							new BigDecimal(orderPriceRequest.getMeasuredQuantity()), DomainConstants.WEIGHT_SCALE,
							DomainConstants.ROUNDIND_MODE));
			// Fetch Inventory coins for a bin Group
			Map<ItemCodeInvWeightDto, List<InventoryDetailsDao>> itemCodeAndInvCoinsMap = inventoryService
					.getInvCoinDetails(Map.of(itemCodeInvWeightDto, new SalesItemDto()),
							List.of(CommonConstants.BIN_GROUP_RESERVE_BIN), true);

			invList = itemCodeAndInvCoinsMap.get(itemCodeInvWeightDto);

		} else {
			invList = inventoryService.getItemsByIdAndLocationCode(List.of(orderPriceRequest.getInventoryId()));
		}

		if (CollectionUtils.isEmpty(invList)) {
			throw new ServiceException(SalesConstants.ITEM_NOT_AVAILABLE, SalesConstants.ERR_SALE_131,
					orderPriceRequest.getItemCode());
		}

		return commonCashMemoService.getOrderItemPriceDetails(cashMemoDao.getSalesTxnDao(), orderPriceRequest,
				invList.get(0).getBinGroupCode(), invList.get(0), dummyCmDetailsDao.getProductGroupCode());
	}

	private boolean isLinkedTransactionLevelDiscointPresent(SalesTxnDaoExt salesTxn, String itemId) {
		// Find all Linked Bill Level discounts applied for a item
		List<DiscountItemDetailsDaoExt> discountItemDetails = discountItemDetailsRepository
				.findAllLinkedDiscountByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdAndReferenceId(
						salesTxn,
						com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum.BILL_LEVEL.name(), itemId,
						null);
		return !CollectionUtil.isEmpty(discountItemDetails);

	}

}
