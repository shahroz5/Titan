/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.CoinDetailsDto;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.ItemDetailsDto;
import com.titan.poss.sales.dto.ItemDetailsUpdateDto;
import com.titan.poss.sales.dto.ItemDiscountDetailsDto;
import com.titan.poss.sales.dto.ItemInvDetailsDto;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.response.OrderAndItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.OrderItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.OrderResponseDto;
import com.titan.poss.sales.repository.OrderDetailsConfigRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.service.CommonPaymentService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.DiscountItemFacadeService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OrderItemService;
import com.titan.poss.sales.service.OrderUtilService;
import com.titan.poss.sales.utils.DiscountUtilServiceImpl;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * Service Implementation class for Order items
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesOrderItemServiceImpl")
public class OrderItemServiceImpl implements OrderItemService {

	private static final String BIN_GROUP_RESERVE_BIN = "RESERVEBIN";

	private static final String ERR_SALE_052 = "ERR-SALE-052";
	private static final String ITEM_CANNOT_BE_CHANGED = "Item cannot be changed.";

	@Autowired
	private OrderRepositoryExt orderRepository;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private OrderUtilService orderUtilService;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountItemFacadeService discountItemFacadeService;

	@Autowired
	private CommonPaymentService commonPaymentService;

	@Autowired
	private OrderDetailsConfigRepositoryExt orderDetailsConfigRepositoryExt;
	
	@Autowired
	private DiscountUtilServiceImpl discountUtilServiceImpl;

	// This method will add the new Item to order
	@Override
	@Transactional
	public OrderAndItemDetailsResponseDto addItemToOrder(String id, String transactionType, String subTxnType,
			ItemDetailsDto itemDetailsDto) {

		// verify whether the requested Order exists or not
		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsByOrderId(id, transactionType, subTxnType);

		// validate whether update allowed for this transaction
		commonTransactionService.checkTranscationStatusForUpdate(orderDao.getSalesTxn().getStatus());

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(orderDao.getSalesTxn());

		// Item Update is not allowed, in case payment made has dependency on item
		// attributes
		commonTransactionService.paymentCheckForItemORCustomerUpdate(orderDao.getSalesTxn(), false, false, false);

		// Map Input data to OrderDetailsDao
		OrderDetailsDaoExt orderDetailsDao = (OrderDetailsDaoExt) MapperUtil.getObjectMapping(itemDetailsDto,
				new OrderDetailsDaoExt());
		orderDetailsDao.setOrder(orderDao);

		// Set status as 'OPEN' for newly added items
		orderDetailsDao.setStatus(TransactionStatusEnum.OPEN.name());

		OrderDetailsConfigDaoExt orderDetailsConfigDao = new OrderDetailsConfigDaoExt();

		// validate inventory,item price,tax details of item
		validateMappedOrderDetails(orderDetailsDao, orderDao.getSalesTxn(), orderDetailsConfigDao);
		orderDetailsConfigDao.setOrderItem(orderDetailsDao);

		// row Id.
		orderDetailsDao.setRowId(orderDetailsRepository.countByOrderId(id) + 1);

		orderDetailsDao = orderDetailsRepository.save(orderDetailsDao);
		orderDetailsConfigRepositoryExt.save(orderDetailsConfigDao);

		// Update Order Header details like Total value,weight,quantity and final value
		orderUtilService.updateOrderHeader(orderDao, null);

		orderRepository.save(orderDao);

		return mapOrderAndItemToResponse(orderDao, orderDetailsDao);

	}

	// This method will get the item details of an order
	@Override
	public OrderItemDetailsResponseDto getItemOfOrder(String id, String itemId, String transactionType,
			String subTxnType) {
		// To verify whether the requested Order exists or not
		orderUtilService.checkIfOrderExistsByOrderId(id, transactionType, subTxnType);

		// Verify If item exist w.r.t order
		OrderDetailsDaoExt orderDetailsDao = checkIfItemExists(itemId, id);

		return orderUtilService.mapOrderDetailsToItemDto(orderDetailsDao);
	}

	// This method will Update the Item details of an Order
	@Override
	@Transactional
	public OrderAndItemDetailsResponseDto updateOrderItem(String id, String itemId, String transactionType,
			String subTxnType, ItemDetailsDto itemDetailsDto) {

		log.info("Update item of Order :-" + id + ", item Id :- " + itemId);

		// To verify whether the requested Order exists or not
		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsByOrderId(id, transactionType, subTxnType);

		// To validate whether update allowed for this transaction
		commonTransactionService.checkTranscationStatusForUpdate(orderDao.getSalesTxn().getStatus());

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(orderDao.getSalesTxn());

		// Item Update is not allowed, in case payment made has dependency on item
		// attributes
		commonTransactionService.paymentCheckForItemORCustomerUpdate(orderDao.getSalesTxn(), false, false, false);
		// payment item map check
		commonTransactionService.checkPaymentItemMapping(itemId);

		// Verify If item exist w.r.t order
		OrderDetailsDaoExt orderDetailsDao = checkIfItemExists(itemId, id);
		// get item config details
		OrderDetailsConfigDaoExt orderDetailsConfigDao = orderUtilService.getItemConfigByItem(orderDetailsDao);

		if (!orderDetailsDao.getItemCode().equals(itemDetailsDto.getItemCode())) {
			throw new ServiceException(ITEM_CANNOT_BE_CHANGED, ERR_SALE_052);
		}

		orderDetailsDao = (OrderDetailsDaoExt) MapperUtil.getObjectMapping(itemDetailsDto, orderDetailsDao);
		orderDetailsDao.setRemarks(itemDetailsDto.getRemarks());

		validateMappedOrderDetails(orderDetailsDao, orderDetailsDao.getOrder().getSalesTxn(), orderDetailsConfigDao);

		orderDetailsDao = orderDetailsRepository.save(orderDetailsDao);
		orderDetailsConfigRepositoryExt.save(orderDetailsConfigDao);

		orderUtilService.updateOrderHeader(orderDao, null);

		orderRepository.save(orderDao);

		return mapOrderAndItemToResponse(orderDao, orderDetailsDao);

	}

	@Override
	@Transactional
	public OrderAndItemDetailsResponseDto partialUpdateOrderItem(String id, String itemId, String transactionType,
			String subTxnType, ItemDetailsUpdateDto itemDetailsUpdateDto) {
		// To verify whether the requested Order exists or not
		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsByOrderId(id, transactionType, subTxnType);

		// To validate whether update allowed for this transaction
		commonTransactionService.checkTranscationStatusForUpdate(orderDao.getSalesTxn().getStatus());

		// Item Update is not allowed, in case payment made has dependency on item
		// attributes
		if (!StringUtils.isEmpty(itemDetailsUpdateDto.getTotalTax())) {
			commonTransactionService.paymentCheckForItemORCustomerUpdate(orderDao.getSalesTxn(), false, false, false);
			// payment item map check
			commonTransactionService.checkPaymentItemMapping(itemId);

			// Validate If any Bill level discount already applied
			discountUtilService.checkIfBillLevelDiscountApplied(orderDao.getSalesTxn());

		}
		// Verify If item exist w.r.t order
		OrderDetailsDaoExt orderDetailsDao = checkIfItemExists(itemId, id);

		orderDetailsDao = checkPartialUpdateInput(itemDetailsUpdateDto, orderDetailsDao);

		orderDetailsDao = orderDetailsRepository.save(orderDetailsDao);

		// update order total details
		if (!StringUtils.isEmpty(itemDetailsUpdateDto.getTotalTax())) {
			orderUtilService.updateOrderHeader(orderDao, null);
			orderRepository.save(orderDao);
		}

		return mapOrderAndItemToResponse(orderDao, orderDetailsDao);
	}

	/**
	 * @param itemDetailsUpdateDto
	 * @param orderDetailsDao
	 * @return
	 */
	private OrderDetailsDaoExt checkPartialUpdateInput(ItemDetailsUpdateDto itemDetailsUpdateDto,
			OrderDetailsDaoExt orderDetailsDao) {
		// RSO name check - if comes as empty value (""), then discard RSO name
		// currently saved
		if (itemDetailsUpdateDto.getEmployeeCode() != null && "".equals(itemDetailsUpdateDto.getEmployeeCode())) {
			itemDetailsUpdateDto.setEmployeeCode(null);
			orderDetailsDao.setEmployeeCode(null);
		}

		orderDetailsDao = (OrderDetailsDaoExt) MapperUtil.getObjectMapping(itemDetailsUpdateDto, orderDetailsDao);

		// get tax details and update net or total value
		if (!StringUtils.isEmpty(itemDetailsUpdateDto.getTotalTax())) {
			orderUtilService.validateTaxDetails(orderDetailsDao, false, true);

			// update final value
			BigDecimal finalValue = commonTransactionService.getItemFinalValue(orderDetailsDao.getTotalValue(),
					orderDetailsDao.getTotalDiscount(), orderDetailsDao.getTotalTax(),
					orderDetailsDao.getHallmarkCharges(), orderDetailsDao.getHallmarkDiscount());
			orderDetailsDao.setFinalValue(finalValue);
		}

		if (!StringUtil.isBlankJsonData(itemDetailsUpdateDto.getDiscountDetails())
				&& itemDetailsUpdateDto.getDiscountDetails().getData() != null) {
			ItemDiscountDetailsDto itemDiscountDetailsDto = MapperUtil
					.mapObjToClass(itemDetailsUpdateDto.getDiscountDetails().getData(), ItemDiscountDetailsDto.class);
			itemDiscountDetailsDto.validate(itemDiscountDetailsDto);

			JsonData jsonData = MapperUtil.mapObjToClass(orderDetailsDao.getDiscountDetails(), JsonData.class);
			ItemDiscountDetailsDto itemDiscountDetailsDtoExisting;

			if (jsonData == null || jsonData.getData() == null) {
				itemDiscountDetailsDtoExisting = itemDiscountDetailsDto;
			} else {
				itemDiscountDetailsDtoExisting = MapperUtil.mapObjToClass(jsonData.getData(),
						ItemDiscountDetailsDto.class);
				itemDiscountDetailsDtoExisting = (ItemDiscountDetailsDto) MapperUtil
						.getObjectMapping(itemDiscountDetailsDto, itemDiscountDetailsDtoExisting);
			}

			orderDetailsDao.setDiscountDetails(
					MapperUtil.getStringFromJson(new JsonData("DISCOUNT_DETAILS", itemDiscountDetailsDtoExisting)));
		}

		return orderDetailsDao;
	}

	// This method will delete the item of an order
	@Override
	@Transactional
	public OrderResponseDto deleteOrderItem(String id, String itemId, String transactionType, String subTxnType,
			String cashMemoId) {

		log.info("Delete item id:- {} from order id:- {}, CM id(to release item):- {}", itemId, id, cashMemoId);

		// To verify whether the requested Order exists or not
		OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsByOrderId(id, transactionType, subTxnType);

		// Verify If item exist w.r.t order
		OrderDetailsDaoExt orderDetailsDao = checkIfItemExists(itemId, id);
		// get item config details
		// TODO: make changes here
		OrderDetailsConfigDaoExt orderDetailsConfigDao = null;
		if (!TransactionTypeEnum.CO.name().equals(orderDao.getSalesTxn().getTxnType())) {
			orderDetailsConfigDao = orderUtilService.getItemConfigByItem(orderDetailsDao);
		}
		// In case trying to delete ordered item from Invoked Cash memo, update item
		// status & release from inventory
		if (!StringUtils.isEmpty(cashMemoId)) {
			orderUtilService.releaseItemFromReserveBin(orderDetailsDao);
		}
		// Regular delete of item from OPEN order
		else {

			// Validate If any Bill level discount already applied
			discountUtilService.checkIfBillLevelDiscountApplied(orderDao.getSalesTxn());

			// Delete the item level discounts applied
			discountItemFacadeService.deleteItemDiscounts(orderDao.getSalesTxn().getId(), transactionType, subTxnType,
					itemId, true);

			// To validate whether update allowed for this transaction
			commonTransactionService.checkTranscationStatusForUpdate(orderDao.getSalesTxn().getStatus());

			// Item Update is not allowed, in case payment made has dependency on item
			// attributes
			commonTransactionService.paymentCheckForItemORCustomerUpdate(orderDao.getSalesTxn(), false, false, false);

			// check if payment is done for the item, if yes the cannot delete item
			commonTransactionService.checkPaymentItemMapping(itemId);

			if (orderDetailsConfigDao != null)
				orderDetailsConfigRepositoryExt.delete(orderDetailsConfigDao);
			orderDetailsRepository.delete(orderDetailsDao);

			// row id. update for other items
			List<OrderDetailsDaoExt> orderDetailsDaoList = orderDetailsRepository.findAllByOrderId(orderDao.getId());
			if (!orderDetailsDaoList.isEmpty()) {
				Integer rowId = 1;
				for (OrderDetailsDaoExt orderItemDetails : orderDetailsDaoList) {
					orderItemDetails.setRowId(rowId++);
				}
				orderDetailsRepository.saveAll(orderDetailsDaoList);
			}

			// update order total details
			orderUtilService.updateOrderHeader(orderDao, null);

			orderRepository.save(orderDao);

		}

		return orderUtilService.orderResponse(orderDao, null);
	}

	private void validateMappedOrderDetails(OrderDetailsDaoExt orderDetailsDao, SalesTxnDaoExt salesTxnDao,
			OrderDetailsConfigDaoExt orderDetailsConfigDao) {

		// RSO name check - if comes as empty value (""), then discard RSO name
		// currently saved
		if (orderDetailsDao.getEmployeeCode() != null && "".equals(orderDetailsDao.getEmployeeCode())) {
			orderDetailsDao.setEmployeeCode(null);
		}

		// if rateFreeze CN is added, then metal rate check is not required.
		PaymentDetailsDaoExt rateFreezedCNPayment = commonPaymentService.getMetalRateProtectedCNIfExists(salesTxnDao);

		// get item details from item_master
		getItemMasterDetails(orderDetailsDao, rateFreezedCNPayment);

		// get inventory item
		// if ProductGroupCode is 73, then get without lotNumber, else get with
		// lotNumebr.
		Short totalQuantity;
		Object weightDetails;
		
		LocationCacheDto locationCacheDto = engineService.getStoreLocation(salesTxnDao.getLocationCode());
		Boolean isFOCItemSaleable= locationCacheDto.getOfferDetails().getIsFOCitemssaleable();

		if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(orderDetailsDao.getProductGroupCode())||
				SalesConstants.SILVER_COIN_PRODUCT_GROUP_CODE.equals(orderDetailsDao.getProductGroupCode())) {
			CoinDetailsDto coinDetailsDto = getInventoryCoinDetails(orderDetailsDao);
			totalQuantity = coinDetailsDto.getTotalQuantity().shortValue();
			weightDetails = coinDetailsDto.getTotalWeightDetails();
			// if coins then only quantity update allowed.
			checkIfCoinIsAddedAlready(orderDetailsDao);
		} else {
			// Validate inventory details & Bin Group
			InventoryItemDto inventoryItem = getInvetoryItemDetails(orderDetailsDao,isFOCItemSaleable);
			totalQuantity = inventoryItem.getTotalQuantity();
			weightDetails = inventoryItem.getTotalWeightDetails();
		}

		orderDetailsDao.setInventoryWeightDetails(orderUtilService.getInvWeightDetails(weightDetails));

		// check if item is already present in other transaction
		orderUtilService.checkIfItemIsAlreadyAdded(totalQuantity, orderDetailsDao);

		// validate quantity and weight
		orderUtilService.validateQuantityAndWeight(orderDetailsDao);

		// validate item price
		orderUtilService.validateItemPrice(salesTxnDao, orderDetailsDao, orderDetailsConfigDao, false,
				rateFreezedCNPayment != null);
		// validate tax details
		orderUtilService.validateTaxDetails(orderDetailsDao, false, false);

		// tax value check based on net value - done in validateTaxDetails
		// net value = unit * quantity - done in validateItemPrice

		if (orderDetailsDao.getTotalDiscount() == null) {
			orderDetailsDao.setTotalDiscount(BigDecimal.ZERO);
		}

		// @formatter:off
		// final value = (total value + hallmark charges - (total discount + hallmark discount)) + total tax(includes hallmark tax also).
		// @formatter:on
		BigDecimal finalValue = commonTransactionService.getItemFinalValue(orderDetailsDao.getTotalValue(),
				orderDetailsDao.getTotalDiscount(), orderDetailsDao.getTotalTax(), orderDetailsDao.getHallmarkCharges(),
				orderDetailsDao.getHallmarkDiscount());

		orderDetailsDao.setMinDiscountPayment(discountUtilServiceImpl.getMinPaymentForDiscountEligibility(
				orderDetailsDao.getId(), orderDetailsDao.getOrder().getId(), orderDetailsDao.getFinalValue()));

		if (finalValue.compareTo(orderDetailsDao.getFinalValue()) != 0) {
			log.info("Calculated final value - {}", finalValue);
			throw new ServiceException(SalesConstants.PRICE_MISMATCH, SalesConstants.ERR_SALE_044,
					"Price mismatch on field: Final Value, expected value: " + finalValue + ", found value: "
							+ orderDetailsDao.getFinalValue());
		}

		orderUtilService.calculateMinOrderValue(orderDetailsDao, salesTxnDao.getTxnType(), null);
		// PENDING: discount

		// check if item is applicable for Slab/HighValue discount
		if (orderDetailsDao.getId() == null) { // to be done when item is first added only
			checkIfItemForSlabOrHighValuediscount(orderDetailsDao);
		}

	}

	private void checkIfItemForSlabOrHighValuediscount(OrderDetailsDaoExt orderDetailsDao) {

		// check if item can be involved in cumulative calculation for Slab/HighValue
		// discount

		SalesItemDetailsDto salesItemDetailsDto = (SalesItemDetailsDto) MapperUtil.getObjectMapping(orderDetailsDao,
				new SalesItemDetailsDto(), "priceDetails");
		PriceDetailsDto priceDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(orderDetailsDao.getPriceDetails()), PriceDetailsDto.class);
		salesItemDetailsDto.setPriceDetails(priceDetails);

		// Set wastgae percent & making charge per gram for eligibility check for
		// Non-ucp products
		if (!StringUtils.isEmpty(priceDetails) && BooleanUtils.isFalse(priceDetails.getIsUcp())) {
			salesItemDetailsDto.setComplexityPercent(priceDetails.getMakingChargeDetails().getWastagePct());
			salesItemDetailsDto.setMakingChargePerGram(priceDetails.getMakingChargeDetails().getMakingChargePgram());
		}

		if (!StringUtils.isEmpty(orderDetailsDao.getItemDetails())
				&& !StringUtils.isEmpty(orderDetailsDao.getInventoryId())) {
			discountUtilService.getInventoryItemDetails(orderDetailsDao.getItemDetails(),
					orderDetailsDao.getInventoryId(), salesItemDetailsDto);
		}

		orderDetailsDao.setDiscountDetails((discountUtilService.checkIfItemCanBeIncludedInSlabOrHighValueDiscount(
						orderDetailsDao.getDiscountDetails(), salesItemDetailsDto)));
	}

	// Method to validate item code w.r.t Item master
	private void getItemMasterDetails(OrderDetailsDaoExt orderDetailsDao, PaymentDetailsDaoExt rateFreezedCNPayment) {
		ItemSearchRequestDto itemSearchRequestDto = new ItemSearchRequestDto();
		itemSearchRequestDto.setItemCode(orderDetailsDao.getItemCode());

		List<ItemDto> itemMasterDetailsList = engineService.getItems(itemSearchRequestDto).getResults();

		if (CollectionUtils.isEmpty(itemMasterDetailsList)) {
			throw new ServiceException(SalesConstants.INVALID_ITEM, SalesConstants.ERR_SALE_051);
		}
		// set pgc and pcc
		orderDetailsDao.setProductGroupCode(itemMasterDetailsList.get(0).getProductGroupCode());
		orderDetailsDao.setProductCategoryCode(itemMasterDetailsList.get(0).getProductCategoryCode());

		// if ProductGroupCode is not 73, then lotNumber and inventoryId are mandatory
		if (!SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(orderDetailsDao.getProductGroupCode())
				&& (StringUtils.isEmpty(orderDetailsDao.getLotNumber())
						|| StringUtils.isEmpty(orderDetailsDao.getInventoryId()))) {

			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Lot Number and Inventory Id are mandatory");

		} else if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(orderDetailsDao.getProductGroupCode())) {
			// set lot number and invId to null. -for coins(as lot no. allotment happens at
			// confirmation)
			orderDetailsDao.setLotNumber(null);
			orderDetailsDao.setInventoryId(null);
		}

		// if freezed rate payment is added, then only allowed category items can be
		// added.
		commonTransactionService.checkItemType(orderDetailsDao.getProductGroupCode(), rateFreezedCNPayment,
				itemMasterDetailsList);

	}

	// Fetch coin details, pending: validate coin with txnType
	private CoinDetailsDto getInventoryCoinDetails(OrderDetailsDaoExt orderDetailsDao) {
		CoinDetailsDto coinDetailsDto = commonTransactionService.getInventoryCoinDetails(orderDetailsDao.getItemCode(),
				orderDetailsDao.getInventoryWeight(), orderDetailsDao.getTotalQuantity());
		orderDetailsDao.setInventoryWeightDetails(MapperUtil.getStringFromJson(coinDetailsDto.getTotalWeightDetails()));

		return coinDetailsDto;
	}

	// Method to check , if duplicate coin are being added
	private void checkIfCoinIsAddedAlready(OrderDetailsDaoExt orderDetailsDao) {

		// if item is to be updated, then ignore check
		if (!StringUtils.isEmpty(orderDetailsDao.getId())) {
			return;
		}
		if (SalesConstants.COIN_PRODUCT_GROUP_CODE.equals(orderDetailsDao.getProductGroupCode())
				&& orderDetailsRepository.existsByItemCodeAndOrderIdAndOrderSalesTxnLocationCodeAndInventoryWeight(
						orderDetailsDao.getItemCode(), orderDetailsDao.getOrder().getId(), CommonUtil.getLocationCode(),
						orderDetailsDao.getInventoryWeight())) {
			throw new ServiceException(
					SalesConstants.ITEM_IS_ALREADY_ADDED_IN_DYNAMIC_TRANSACTIONTYPE_DYNAMIC_TASKTYPE_TASK_NUMBER_DYNAMIC_DOCNO,
					SalesConstants.ERR_SALE_089, "Item is already added. Update quantity for existing item.",
					Map.of("transactionType", orderDetailsDao.getOrder().getSalesTxn().getTxnType(), "taskType",
							orderDetailsDao.getOrder().getSalesTxn().getStatus(), "docNo",
							orderDetailsDao.getOrder().getSalesTxn().getDocNo().toString()));
		}
	}

	// Method to validate inventory details, saleable check & Bin group validation
	private InventoryItemDto getInvetoryItemDetails(OrderDetailsDaoExt orderDetailsDao,Boolean isFOCItemSaleable) {
		InventoryItemDto validInventoryItem = commonTransactionService.getInvetoryItemDetails(
				orderDetailsDao.getInventoryId(), orderDetailsDao.getInventoryWeight(),
				orderDetailsDao.getTotalQuantity());
		// bin and inv weight
		// set values to order details.
		orderDetailsDao.setBinCode(validInventoryItem.getBinCode());
		orderDetailsDao.setBinGroupCode(validInventoryItem.getBinCode());
		orderDetailsDao
				.setInventoryWeightDetails(MapperUtil.getStringFromJson(validInventoryItem.getTotalWeightDetails()));

		// set item details
		ItemInvDetailsDto itemInvDetailsDto = (ItemInvDetailsDto) MapperUtil.getDtoMapping(validInventoryItem,
				ItemInvDetailsDto.class);
		// set quantity.
		itemInvDetailsDto.setQuantity(orderDetailsDao.getTotalQuantity());
		orderDetailsDao.setItemDetails(MapperUtil.getStringFromJson(
				new JsonData("ITEM_DETAILS", Map.of(validInventoryItem.getInventoryId(), itemInvDetailsDto))));

		if (BIN_GROUP_RESERVE_BIN.equals(validInventoryItem.getBinGroupCode())) {
			throw new ServiceException(SalesConstants.ITEM_FROM_DYNAMIC_BIN_GROUP_CANNOT_BE_SOLD_TO_OTHERS,
					SalesConstants.ERR_SALE_002,
					"Item in " + validInventoryItem.getBinGroupCode() + " cannot be sold to others.",
					Map.of("binGroup", validInventoryItem.getBinGroupCode()));
		}

		// check binGroup and binCode
		Map<String, List<String>> validBinGroupAndCodes = SalesUtil.getBinGroupCodeAndCodeBasedOnLocationCode(BooleanUtils.isTrue(isFOCItemSaleable));

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
					SalesConstants.ERR_SALE_002, "Item is in invalid Bin code: " + binCode + ", hence cannot be sold.",
					Map.of(SalesConstants.BIN_GROUP, binCode));
		}

		return validInventoryItem;
	}

	private OrderAndItemDetailsResponseDto mapOrderAndItemToResponse(OrderDaoExt orderDao,
			OrderDetailsDaoExt orderDetailsDao) {

		OrderAndItemDetailsResponseDto orderAndItemDetailsResponseDto = (OrderAndItemDetailsResponseDto) MapperUtil
				.getDtoMapping(orderUtilService.orderResponse(orderDao, null), OrderAndItemDetailsResponseDto.class);

		orderAndItemDetailsResponseDto.setItemDetailsDto(orderUtilService.mapOrderDetailsToItemDto(orderDetailsDao));

		return orderAndItemDetailsResponseDto;
	}

	private OrderDetailsDaoExt checkIfItemExists(String itemId, String orderId) {
		OrderDetailsDaoExt orderDetailsDao = orderDetailsRepository.findOneByIdAndOrderId(itemId, orderId);

		if (orderDetailsDao == null) {
			throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
					"Invalid order item id", Map.of("type", "item"));
		}

		return orderDetailsDao;

	}

}
