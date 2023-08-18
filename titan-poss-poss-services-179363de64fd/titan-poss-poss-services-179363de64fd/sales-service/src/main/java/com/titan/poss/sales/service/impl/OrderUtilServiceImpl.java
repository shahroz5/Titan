/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.config.dto.constants.RangeTypeEnum;
import com.titan.poss.config.dto.request.json.BGRToleranceRangeDetails;
import com.titan.poss.config.dto.request.json.MetalOrderPaymentConfig;
import com.titan.poss.config.dto.request.json.OrderPaymentConfigDetails;
import com.titan.poss.config.dto.request.json.OrderRangeConfigDetails;
import com.titan.poss.config.dto.request.json.RequestTypeOrderPaymentConfig;
import com.titan.poss.core.discount.dto.AbCoSlabDiscountRequestDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountEngineResponseDto;
import com.titan.poss.core.discount.dto.LinkDiscountDetailsDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.discount.dto.SlabBasedDiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.SlabConfigDetails;
import com.titan.poss.core.discount.dto.SlabItemDetailsDto;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.domain.constant.enums.PaymentGroupEnum;
import com.titan.poss.core.dto.AbCoDiscountRequestDto;
import com.titan.poss.core.dto.CustomerOrderDetails;
import com.titan.poss.core.dto.ItemCodeInvWeightDto;
import com.titan.poss.core.dto.LocationAdvanceBookingDetailsDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.enums.CNStatus;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.RequestTypeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.repository.ItemRepository;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.BusinessDayDaoExt;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.DiscountConfigDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.CustomerOrderDetailsDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.DiscountValueDetailsObjectDto;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.OrderActivationDetails;
import com.titan.poss.sales.dto.OrderCancelDetails;
import com.titan.poss.sales.dto.OrderMinPaymentDto;
import com.titan.poss.sales.dto.PaymentCreateDto;
import com.titan.poss.sales.dto.TaxDetailsListDto;
import com.titan.poss.sales.dto.WeightDetailsDto;
import com.titan.poss.sales.dto.constants.DiscountReferenceTypeEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.constants.SubTxnTypeEnum;
import com.titan.poss.sales.dto.request.CreditNoteLinkDto;
import com.titan.poss.sales.dto.request.HallmarkGstRequestDto;
import com.titan.poss.sales.dto.request.SalesItemDto;
import com.titan.poss.sales.dto.request.WeightDetailsAndQtyDto;
import com.titan.poss.sales.dto.response.ExistingItemDetailsDto;
import com.titan.poss.sales.dto.response.OrderAndItemIdResponseDto;
import com.titan.poss.sales.dto.response.OrderItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.OrderResponseDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.dto.response.UpdateInvItemAndSalesItemDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.inventory.service.InventoryService;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.DiscountConfigDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsConfigRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.DiscountFacadeService;
import com.titan.poss.sales.service.DiscountItemFacadeService;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OrderUtilService;
import com.titan.poss.sales.service.PaymentFacadeService;
import com.titan.poss.sales.utils.SalesUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesCommonOrderServiceImpl")
public class OrderUtilServiceImpl implements OrderUtilService {

	private static final String ERR_SALE_005 = "ERR-SALE-005";
	private static final String INVALID_TAX_VALUE = "Invalid tax value";

	private static final String WEIGHT_EDIT_NOT_ALLOWED = "Weight Edit is not allowed in Advance Booking/Orders";

	private static final String ORDER_DOESNOT_EXIST = "Requested Order doesn't exist";
	
	private static final String CUST_TAX_NO = "custTaxNo";
	private static final String MOBILE_NO = "mobileNo";
	private static final String EMAIL_ID =  "emailId";
	private static final String CUSTOMER_NAME ="customerName";
	private static final String INSTI_TAX_NO = "instiTaxNo";
	private static final String PASSPORT_ID = "passportId";
	private static final String CUST_TAX_NO_OLD = "custTaxNoOld";

	@Autowired
	private OrderRepositoryExt orderRepository;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private InventoryService inventoryService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepo;

	@Autowired
	private PaymentFacadeService paymentFacadeService;

	@Autowired
	CreditNoteService creditNoteService;

	@Autowired
	private DiscountItemFacadeService discountItemFacadeService;

	@Autowired
	private DiscountFacadeService discountFacadeService;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private DiscountConfigDetailsRepositoryExt discountConfigDetailsRepository;

	@Autowired
	private DiscountFactory discountFactory;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepositoryExt;

	@Autowired
	private OrderDetailsConfigRepositoryExt orderDetailsConfigRepositoryExt;
	
	@Autowired
	ItemRepository itemRepository;
	
	@Autowired
	private BusinessDayServiceImpl businessDayServiceImpl;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Override
	public OrderDaoExt checkIfOrderExistsByOrderId(String orderId, String transactionType, String subTxnType) {
		OrderDaoExt orderDao = orderRepository.findOneByIdAndSalesTxnLocationCodeAndTxnTypeAndSubTxnType(orderId,
				CommonUtil.getLocationCode(), transactionType, subTxnType);

		if (StringUtils.isEmpty(orderDao)) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + ORDER_DOESNOT_EXIST,
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS, ORDER_DOESNOT_EXIST));
		}

		return orderDao;
	}

	@Override
	public OrderAndItemIdResponseDto orderAndItemIdResponse(OrderDaoExt orderDao, List<Integer> creditNotes) {
		OrderAndItemIdResponseDto orderAndItemIdResponseDto = (OrderAndItemIdResponseDto) MapperUtil
				.getObjectMapping(orderResponse(orderDao, creditNotes), new OrderAndItemIdResponseDto());

		List<String> itemIdList = new ArrayList<>();

		List<OrderDetailsDaoExt> orderDetailsList = orderDetailsRepository.findAllByOrderId(orderDao.getId());
		
		BigDecimal minOrderAmount = BigDecimal.ZERO;
		if(!orderDetailsList.isEmpty()) {
			for(OrderDetailsDaoExt orderDetail : orderDetailsList) {
				itemIdList.add(orderDetail.getId());
				if(orderDetail.getMinDiscountPayment().compareTo(orderDetail.getMinOrderPayment()) > 0)
					minOrderAmount = minOrderAmount.add(orderDetail.getMinDiscountPayment());
				else
					minOrderAmount = minOrderAmount.add(orderDetail.getMinOrderPayment());
			}
		}
		BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(minOrderAmount);

		orderAndItemIdResponseDto.setMinOrderPayment(minOrderAmount.add(roundingVariance));
		
		orderAndItemIdResponseDto.setItemIdList(itemIdList);
				
		orderAndItemIdResponseDto.setCustTaxNo(CryptoUtil.decrypt(orderDao.getCustTaxNo(), CUST_TAX_NO));
		orderAndItemIdResponseDto.setCustTaxNoOld(CryptoUtil.decrypt(orderDao.getCustTaxNoOld() , CUST_TAX_NO));
	//	Optional<CustomerTxnDaoExt> customerTxnDao = customerTxnDetailsRepository.findById(orderDao.getId());
		//customerTxnDao.get().setMobileNumber(CryptoUtil.decrypt(customerTxnDao.get().getMobileNumber(),MOBILE_NO));
		//customerTxnDao.get().setEmailId(CryptoUtil.decrypt(customerTxnDao.get().getEmailId(),EMAIL_ID));
		//customerTxnDao.get().setCustomerName(CryptoUtil.decrypt(customerTxnDao.get().getCustomerName(),CUSTOMER_NAME));
	//	customerTxnDao.get().setCustTaxNo(CryptoUtil.decrypt(customerTxnDao.get().getCustTaxNo(),CUST_TAX_NO));
	//	customerTxnDao.get().setCustTaxNoOld(CryptoUtil.decrypt(customerTxnDao.get().getCustTaxNoOld(),CUST_TAX_NO_OLD));
	//	customerTxnDao.get().setInstiTaxNo(CryptoUtil.decrypt(customerTxnDao.get().getInstiTaxNo(),INSTI_TAX_NO));
	//	customerTxnDao.get().setPassportId(CryptoUtil.decrypt(customerTxnDao.get().getPassportId(),PASSPORT_ID));
	//	customerTxnDao.ifPresent(custTxnDao -> {
	//		orderAndItemIdResponseDto.setCustTaxNo(CryptoUtil.decrypt(custTxnDao.getCustTaxNo(), CUST_TAX_NO));
	//		orderAndItemIdResponseDto.setCustTaxNoOld(CryptoUtil.decrypt(custTxnDao.getCustTaxNoOld(), CUST_TAX_NO_OLD));
	//	});

		return orderAndItemIdResponseDto;
	}

	@Override
	public List<OrderDetailsDaoExt> getOrderDetailsIfExists(String orderId, Boolean isPaymentForRateProtectedCN) {
		List<OrderDetailsDaoExt> orderDetailsList = orderDetailsRepository.findAllByOrderId(orderId);

		// not to throw error when rate freezed CN is to be added
		if (CollectionUtil.isEmpty(orderDetailsList) && !BooleanUtils.isTrue(isPaymentForRateProtectedCN)) {
			throw new ServiceException(SalesConstants.NO_ITEM_FOUND_IN_THE_TRANSACTION, SalesConstants.ERR_SALE_046,
					"Order Id: " + orderId);
		}

		return orderDetailsList;
	}

	@Override
	public OrderResponseDto orderResponse(OrderDaoExt orderDao, List<Integer> creditNotes) {
		OrderResponseDto orderResponseDto = (OrderResponseDto) MapperUtil.getObjectMapping(orderDao,
				new OrderResponseDto());
		// map sales txn table fields to response
		mapSalesTxnFieldsToResponse(orderDao, orderResponseDto);

		if (orderDao.getTaxDetails() != null && !"{}".equals(orderDao.getTaxDetails())) {
			orderResponseDto.setTaxDetails(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(orderDao.getTaxDetails()), TaxDetailsListDto.class));
		}

		if (!StringUtils.isEmpty(orderDao.getActivationDetails())) {
			orderResponseDto.setActivationDetails(MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(orderDao.getActivationDetails()), OrderActivationDetails.class));
		}
		if (!StringUtils.isEmpty(orderDao.getCancellationDetails())) {
			orderResponseDto.setCancellationDetails(MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(orderDao.getCancellationDetails()), OrderCancelDetails.class));
		}

		if (!CollectionUtils.isEmpty(creditNotes)) {
			orderResponseDto.setCreditNotes(creditNotes);
		}

		if (!StringUtils.isEmpty(orderDao.getOrderWeightDetails())) {
			orderResponseDto
			.setOrderWeightDetails(MapperUtil.mapObjToClass(orderDao.getOrderWeightDetails(), JsonData.class));
		}
		if (!StringUtils.isEmpty(orderDao.getDeliveredWeightDetails())) {
			orderResponseDto.setDeliveredWeightDetails(
					MapperUtil.mapObjToClass(orderDao.getDeliveredWeightDetails(), JsonData.class));
		}
		if (!StringUtils.isEmpty(orderDao.getMinPaymentDetails())) {
			orderResponseDto
			.setMinPaymentDetails(MapperUtil.mapObjToClass(orderDao.getMinPaymentDetails(), JsonData.class));
		}

		if (!StringUtil.isBlankJsonStr(orderDao.getBestRateConfigDetails())) {
			orderResponseDto.setBestRateConfigDetails(
					MapperUtil.mapObjToClass(orderDao.getBestRateConfigDetails(), JsonData.class));
		}

		if (!StringUtil.isBlankJsonStr(orderDao.getNomineeDetails())) {
					orderResponseDto.setNomineeDetails(
							MapperUtil.mapObjToClass(orderDao.getNomineeDetails(), JsonData.class));
		}
		if (!StringUtil.isBlankJsonStr(orderDao.getCnDetails())) {
			orderResponseDto.setCnDetails(MapperUtil.mapObjToClass(orderDao.getCnDetails(), JsonData.class));
		}

		// PENDING: print, payment, discount

		return orderResponseDto;
	}

	// This method map sales txn table fields to response
	private void mapSalesTxnFieldsToResponse(OrderDaoExt orderDao, OrderResponseDto orderResponseDto) {
		orderResponseDto = (OrderResponseDto) MapperUtil.getObjectMapping(orderDao.getSalesTxn(), orderResponseDto);

		if (!StringUtils.isEmpty(orderDao.getSalesTxn().getManualBillDetails())) {
			orderResponseDto.setManualBillDetails(
					commonTransactionService.mapJsonToManualBillDetails(orderDao.getSalesTxn().getManualBillDetails()));
		}

		if (!StringUtils.isEmpty(orderDao.getSalesTxn().getMetalRateDetails())) {
			orderResponseDto.setMetalRateList(mapMetalRateJsonToDto(orderDao.getSalesTxn().getMetalRateDetails()));
		}
		if (!StringUtil.isBlankJsonStr(orderDao.getSalesTxn().getDiscountTxnDetails())) {
			orderResponseDto.setDiscountTxnDetails(
					MapperUtil.mapObjToClass(orderDao.getSalesTxn().getDiscountTxnDetails(), JsonData.class));
		}

	}

	private MetalRateListDto mapMetalRateJsonToDto(String metalRateJson) {
		MetalRateListDto savedMetalRateListDto = null;
		if (!StringUtils.isEmpty(metalRateJson)) {
			savedMetalRateListDto = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(metalRateJson), MetalRateListDto.class);
		}
		return savedMetalRateListDto;
	}

	@Override
	public OrderItemDetailsResponseDto mapOrderDetailsToItemDto(OrderDetailsDaoExt orderDetailsDao) {
		OrderItemDetailsResponseDto orderItemDetailsDto = (OrderItemDetailsResponseDto) MapperUtil
				.getObjectMapping(orderDetailsDao, new OrderItemDetailsResponseDto());

		orderItemDetailsDto.setItemId(orderDetailsDao.getId());
		if (orderDetailsDao.getInventoryWeightDetails() != null
				&& !"{}".equals(orderDetailsDao.getInventoryWeightDetails())) {
			orderItemDetailsDto.setInventoryWeightDetails(
					MapperUtil.mapObjToClass(orderDetailsDao.getInventoryWeightDetails(), JsonData.class));
		}

		if (orderDetailsDao.getTaxDetails() != null && !"{}".equals(orderDetailsDao.getTaxDetails())) {
			orderItemDetailsDto.setTaxDetails(
					MapperUtil.mapObjToClass(orderDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class));
		}

		if (!StringUtil.isBlankJsonStr(orderDetailsDao.getDiscountDetails())) {
			orderItemDetailsDto
			.setDiscountDetails(MapperUtil.mapObjToClass(orderDetailsDao.getDiscountDetails(), JsonData.class));
		}

		if (!StringUtil.isBlankJsonStr(orderDetailsDao.getItemDetails())) {
			orderItemDetailsDto
			.setItemDetails(MapperUtil.mapObjToClass(orderDetailsDao.getItemDetails(), JsonData.class));
		}

		if (!StringUtil.isBlankJsonStr(orderDetailsDao.getMinPaymentDetails())) {
			orderItemDetailsDto.setMinPaymentDetails(
					MapperUtil.mapObjToClass(orderDetailsDao.getMinPaymentDetails(), JsonData.class));
		}

		orderItemDetailsDto
		.setPriceDetails(MapperUtil.mapObjToClass(orderDetailsDao.getPriceDetails(), PriceDetailsDto.class));
		
		orderItemDetailsDto.setPricingType(orderDetailsDao.getPricingType());

		// PENDING: discount

		return orderItemDetailsDto;

	}

	@Override
	public OrderDaoExt checkIfOrderExistsById(String id) {

		Optional<OrderDaoExt> orderDao = orderRepository.findById(id);

		if (!orderDao.isPresent()) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + ORDER_DOESNOT_EXIST,
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS, ORDER_DOESNOT_EXIST));
		}

		return orderDao.get();
	}

	// This method will calculate the minimum payment to be made for an ordered item
	@Override
	public OrderDetailsDaoExt calculateMinOrderValue(OrderDetailsDaoExt orderDetailsDao, String txnType,
			Boolean isRateFreeze) {

		RuleRequestListDto ruleRequestDto = new RuleRequestListDto();

		ruleRequestDto.setLocationCode(CommonUtil.getLocationCode());
		ruleRequestDto.setProductGroupCode(orderDetailsDao.getProductGroupCode());

		RuleTypeEnum ruleType = null;
		if (txnType.equalsIgnoreCase(TransactionTypeEnum.AB.name())) {
			ruleType = RuleTypeEnum.ORDER_AB_PAYMENT_CONFIG;
		} else if(txnType.equalsIgnoreCase(TransactionTypeEnum.CO.name())) {
			ruleType = RuleTypeEnum.ORDER_CO_PAYMENT_CONFIG;
		}

		// Call to engine api to get Configured values
		Object ruleFieldValues = engineService.getRuleFieldValues(ruleType, ruleRequestDto);

		OrderPaymentConfigDetails orderPaymentConfigDetails = null;
		if(txnType.equalsIgnoreCase(TransactionTypeEnum.AB.name()))
		{
			orderPaymentConfigDetails = MapperUtil.getObjectMapperInstance().convertValue(ruleFieldValues, OrderPaymentConfigDetails.class);
		}else if (txnType.equalsIgnoreCase(TransactionTypeEnum.CO.name()))
		{
			orderPaymentConfigDetails = cOPaymentConfig(orderDetailsDao, ruleFieldValues, orderPaymentConfigDetails);

		}



		BigDecimal minValue = BigDecimal.ZERO;
		BigDecimal minPaymentPercent;

		// If Price update for Rate Freeze after confirm, No validations required,
		// calculate for
		// frozen rate percentage
		if (BooleanUtils.isTrue(isRateFreeze)) {
			minPaymentPercent = orderPaymentConfigDetails.getMetalRateFrozenPercent();
		}
		// Regular price calculation of items before confirm needs all the validations
		// applicable based on Frozen rate & Best rate flags
		else {
			if (BooleanUtils.isTrue(orderDetailsDao.getOrder().getIsFrozenRate())
					&& BooleanUtils.isTrue(orderDetailsDao.getOrder().getIsBestRate())) {
				throw new ServiceException(SalesConstants.INVALID_REQUEST
						+ "Both Rate Freeze and Best Rate are not allowed for a transaction.Please choose any one",
						SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS,
								"Both Rate Freeze and Best Rate are not allowed for a transaction.Please choose any one"));
			}
			// If frozen rate, apply frozen rate minimum pay %
			if (BooleanUtils.isTrue(orderDetailsDao.getOrder().getIsFrozenRate())) {
				minPaymentPercent = orderPaymentConfigDetails.getMetalRateFrozenPercent();
			}

			// If non frozen and best rate, apply best rate minimum pay %
			else if (BooleanUtils.isFalse(orderDetailsDao.getOrder().getIsFrozenRate())
					&& BooleanUtils.isTrue(orderDetailsDao.getOrder().getIsBestRate())) {
				minPaymentPercent = orderPaymentConfigDetails.getBestRatePercent();
			}

			// If non frozen and no best rate selected, apply non frozen minimum pay %
			else {
				minPaymentPercent = orderPaymentConfigDetails.getMetalRateNonFrozenPercent();
			}
		}
		// minimum payment percent should not be null
		if (StringUtils.isEmpty(minPaymentPercent)) {
			log.info("Configuration details - {}", ruleFieldValues);
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Please set Order payment configurations",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Please set Order payment configurations"));
		}
		if (minPaymentPercent.compareTo(BigDecimal.ZERO) > 0) {
			minValue = orderDetailsDao.getFinalValue().multiply(minPaymentPercent.divide(BigDecimal.valueOf(100)))
					.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);
		}

		log.info("Min order payment value - {}", minValue);

		orderDetailsDao.setMinOrderPayment(minValue);

		if (orderDetailsDao.getMinDiscountPayment() == null)
			orderDetailsDao.setMinDiscountPayment(minValue);

		// New Requirement to capture min payment for all applicable scenarios.
		getMinPaymentForApplicableScenarios(orderDetailsDao, orderPaymentConfigDetails);

		return orderDetailsDao;
	}

	private OrderPaymentConfigDetails cOPaymentConfig(OrderDetailsDaoExt orderDetailsDao, Object ruleFieldValues,
			OrderPaymentConfigDetails orderPaymentConfigDetails) {
		
		RequestTypeOrderPaymentConfig requestTypOrderPymnt = MapperUtil.getObjectMapperInstance().convertValue(ruleFieldValues, RequestTypeOrderPaymentConfig.class);

		PriceDetailsDto price = MapperUtil.mapObjToClass(orderDetailsDao.getPriceDetails(), PriceDetailsDto.class);
		
		MetalOrderPaymentConfig metalOrderPaymentConfig=null;
		
		if(BooleanUtils.isTrue(orderDetailsDao.getIsAutoStn()))
		{
			metalOrderPaymentConfig =requestTypOrderPymnt.getAutoApproval();

		}else if(orderDetailsDao.getRequestType().equals(RequestTypeEnum.IBT.name()))
		{
			metalOrderPaymentConfig =requestTypOrderPymnt.getIbt();

		}else if(orderDetailsDao.getRequestType().equals(RequestTypeEnum.MTR.name()))
		{
			metalOrderPaymentConfig =requestTypOrderPymnt.getMtr();

		}else if(orderDetailsDao.getRequestType().equals(RequestTypeEnum.COM.name()))
		{
			metalOrderPaymentConfig =requestTypOrderPymnt.getCom();

		}else if(orderDetailsDao.getRequestType().equals(RequestTypeEnum.PROD.name()))
		{
			metalOrderPaymentConfig =requestTypOrderPymnt.getProd();
		}

		if(price.getItemTypeCode().equals(MetalTypeCodeEnum.J.name()))
		{
			orderPaymentConfigDetails =metalOrderPaymentConfig.getGold();

		}else if(price.getItemTypeCode().equals(MetalTypeCodeEnum.L.name()))
		{
			orderPaymentConfigDetails =metalOrderPaymentConfig.getPlatinum();
		}else 
		{
			throw new ServiceException(SalesConstants.NO_CONFIG_FOR_ITEM_TYPE_CODE,SalesConstants.ERR_COM_003);
		}

		return orderPaymentConfigDetails;
	}

	@Override
	public void checkIfItemIsAlreadyAdded(Short totalInventoryQuantity, OrderDetailsDaoExt orderDetailsDao) {
		// check if item is already added in any transaction where status is HOLD or if
		// item is already added to current Order
		List<OrderDetailsDaoExt> orderDetailsList = orderDetailsRepository
				.listByIdNotInAndItemCodeAndDocDateAndInventoryIdAndStatusandLocationCode(orderDetailsDao.getId(),
						businessDayService.getBusinessDay().getBusinessDate(), orderDetailsDao.getItemCode(),
						orderDetailsDao.getInventoryId(), List.of(TransactionStatusEnum.HOLD.name()),
						CommonUtil.getLocationCode(), orderDetailsDao.getOrder().getId());

		// if not found, then return
		if (orderDetailsList.isEmpty()) {
			return;
		}

		// if found check for total quantity
		int totalQuantityInAdded = orderDetailsDao.getTotalQuantity();
		for (OrderDetailsDaoExt orderDetail : orderDetailsList) {
			totalQuantityInAdded = totalQuantityInAdded + orderDetail.getTotalQuantity();
		}

		// if total quantity is more than quantity available in inventory, then throw
		// error.
		if (totalQuantityInAdded > totalInventoryQuantity) {
			List<ExistingItemDetailsDto> existingItemDetailsDtoList = new ArrayList<>();

			orderDetailsList.forEach(orderDetail -> {
				ExistingItemDetailsDto existingItemDetailsDto = new ExistingItemDetailsDto();

				existingItemDetailsDto.setItemId(orderDetail.getId());
				existingItemDetailsDto.setItemCode(orderDetail.getItemCode());
				existingItemDetailsDto.setLotNumber(orderDetail.getLotNumber());
				existingItemDetailsDto.setInventoryId(orderDetail.getInventoryId());
				existingItemDetailsDto.setDocNo(orderDetail.getOrder().getSalesTxn().getDocNo());
				existingItemDetailsDto.setTxnType(orderDetail.getOrder().getSalesTxn().getTxnType());
				existingItemDetailsDto.setSubTxnType(orderDetail.getOrder().getSalesTxn().getSubTxnType());
				existingItemDetailsDto.setId(orderDetail.getOrder().getId());
				existingItemDetailsDto.setStatus(orderDetail.getOrder().getSalesTxn().getStatus());

				existingItemDetailsDtoList.add(existingItemDetailsDto);
			});

			throw new ServiceException(
					SalesConstants.ITEM_IS_ALREADY_ADDED_IN_DYNAMIC_TRANSACTIONTYPE_DYNAMIC_TASKTYPE_TASK_NUMBER_DYNAMIC_DOCNO,
					SalesConstants.ERR_SALE_089, "Item is already added in: " + existingItemDetailsDtoList,
					Map.of("transactionType", existingItemDetailsDtoList.get(0).getTxnType(), "taskType",
							existingItemDetailsDtoList.get(0).getStatus(), "docNo",
							existingItemDetailsDtoList.get(0).getDocNo().toString()));
		}

	}

	@Override
	public void validateQuantityAndWeight(OrderDetailsDaoExt orderDetailsDao) {

		if (orderDetailsDao.getTotalQuantity() > 1) {
			BigDecimal weight = orderDetailsDao.getTotalWeight().divide(
					BigDecimal.valueOf(orderDetailsDao.getTotalQuantity()), DomainConstants.WEIGHT_SCALE,
					RoundingMode.HALF_UP);

			// compare inventory unit weight with totalWeight/totalQuantity
			if (orderDetailsDao.getInventoryWeight().compareTo(weight) != 0) {
				throw new ServiceException(SalesConstants.INVALID_REQUEST + WEIGHT_EDIT_NOT_ALLOWED,
						SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS, WEIGHT_EDIT_NOT_ALLOWED));

			}

		} else if (orderDetailsDao.getInventoryWeight().compareTo(orderDetailsDao.getTotalWeight()) != 0) {

			// wieght edit is not allowed in AB
			throw new ServiceException(SalesConstants.INVALID_REQUEST + WEIGHT_EDIT_NOT_ALLOWED,
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS, WEIGHT_EDIT_NOT_ALLOWED));

		}

	}

	@Override
	public void validateItemPrice(SalesTxnDaoExt salesTxnDao, OrderDetailsDaoExt orderDetailsDao,
			OrderDetailsConfigDaoExt orderDetailsConfigDao, boolean isPriceUpdate, boolean isMetalRateFreezedCN) {
		// check metal rate
		commonTransactionService.checkMetalRate(salesTxnDao, null,
				TransactionStatusEnum.valueOf(salesTxnDao.getStatus()), false, getHoldTimeInMinutesForAb(),
				(isPriceUpdate || isMetalRateFreezedCN), Set.of());

		OrdersPriceRequest ordersPriceRequest = new OrdersPriceRequest();
		ordersPriceRequest.setCheckInventory(true);
		ordersPriceRequest.setItemCode(orderDetailsDao.getItemCode());
		ordersPriceRequest.setLotNumber(orderDetailsDao.getLotNumber());
		ordersPriceRequest.setInventoryId(orderDetailsDao.getInventoryId());
		ordersPriceRequest.setMeasuredQuantity(orderDetailsDao.getTotalQuantity());
		ordersPriceRequest.setMeasuredWeight(orderDetailsDao.getTotalWeight());
		ordersPriceRequest.setStandardPrice(commonTransactionService
				.mapMetalRateJsonToDto(orderDetailsDao.getOrder().getSalesTxn().getMetalRateDetails()).getMetalRates());

		PriceResponseDto priceResponseDto = engineService.getPriceDetails(ordersPriceRequest);
		commonTransactionService.manualCmOrAbCheck(salesTxnDao, priceResponseDto.getPriceDetails().getItemTypeCode());
		// if UCP item, then get tax % and reverse calculate to get original price
		checkUcpItemToGetOriginalPrice(salesTxnDao, orderDetailsDao, priceResponseDto);

		if (isPriceUpdate) {
			// set unit value on price update
			// unit value = (final value from Price engine) / total quantity
			orderDetailsDao.setUnitValue(
					priceResponseDto.getFinalValue().divide(BigDecimal.valueOf(orderDetailsDao.getTotalQuantity()),
							DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
			// total value = final value from price engine
			orderDetailsDao.setTotalValue(priceResponseDto.getFinalValue());

			// if price update- then explicitly set 'hallmarkCharges' &
			// 'hallmarkDiscount'.
			orderDetailsDao.setHallmarkCharges(
					priceResponseDto.getPriceDetails().getItemHallmarkDetails().getHallmarkingCharges() == null
							? BigDecimal.ZERO
							: priceResponseDto.getPriceDetails().getItemHallmarkDetails().getHallmarkingCharges());
			orderDetailsDao.setHallmarkDiscount(BooleanUtils
					.isTrue(priceResponseDto.getPriceDetails().getItemHallmarkDetails().getIsFOCForHallmarkingCharges())
							? priceResponseDto.getPriceDetails().getItemHallmarkDetails().getHallmarkingCharges()
							: BigDecimal.ZERO);

		} else {
			// total value must match finalValue from price engine. or
			// check: unit value = total value / total quantity

			if ((orderDetailsDao.getTotalValue().compareTo(priceResponseDto.getFinalValue()) != 0)
					|| (orderDetailsDao.getUnitValue()
							.compareTo(priceResponseDto.getFinalValue().divide(
									BigDecimal.valueOf(orderDetailsDao.getTotalQuantity()), DomainConstants.PRICE_SCALE,
									RoundingMode.HALF_UP)) != 0)) {
				log.info("Price Engine Response - {}", priceResponseDto);
				throw new ServiceException(SalesConstants.PRICE_MISMATCH, SalesConstants.ERR_SALE_044,
						"Unit Value or Total Value");
			}

		}

		commonTransactionService.hallmarkValuesValidation(priceResponseDto, orderDetailsDao.getHallmarkCharges(),
				orderDetailsDao.getHallmarkDiscount());
		orderDetailsDao.setPriceDetails(MapperUtil.getStringFromJson(priceResponseDto.getPriceDetails()));
		orderDetailsDao.setPricingType(priceResponseDto.getPricingType());	
		// set item config details
		orderDetailsConfigDao = (OrderDetailsConfigDaoExt) MapperUtil.getObjectMapping(priceResponseDto,
				orderDetailsConfigDao, "makingChargeMarginDetails");
		if (priceResponseDto.getMakingChargeMarginDetails() != null
				&& !CollectionUtil.isEmpty(priceResponseDto.getMakingChargeMarginDetails().getMarginDetails())) {
			orderDetailsConfigDao.setMakingChargeMarginDetails(MapperUtil.getStringFromJson(
					new JsonData("MARGIN_DETAILS", priceResponseDto.getMakingChargeMarginDetails())));
		}

	}

	private void checkUcpItemToGetOriginalPrice(SalesTxnDaoExt salesTxnDaoExt, OrderDetailsDaoExt orderDetailsDao,
			PriceResponseDto priceResponseDto) {

		if (BooleanUtils.isNotTrue(priceResponseDto.getPriceDetails().getIsUcp())) {
			return;
		}
		// if UCP item, then get tax % and reverse calculate to get original price
		TotalTaxAndTaxDetailsDto reverseTaxDetails = commonTransactionService.reverseTotalTaxDetails(
				salesTxnDaoExt.getCustomerId(), orderDetailsDao.getItemCode(), priceResponseDto.getFinalValue(),
				TxnTaxTypeEnum.CUST_TRANSACTION_ADV_BOOKING,
				!StringUtils.isEmpty(orderDetailsDao.getTaxDetails())
				? MapperUtil.mapObjToClass(orderDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class)
						: null);
		priceResponseDto.setFinalValue(reverseTaxDetails.getFinalValue());
		orderDetailsDao.setTaxDetails(MapperUtil.getStringFromJson(reverseTaxDetails.getTaxDetails()));

	}

	@Override
	public void validateTaxDetails(OrderDetailsDaoExt orderDetailsDao, boolean isPriceUpdate, boolean isTaxUpdate) {
		// ignore if customer is not selected - not to be ignored, as tax API will get
		// tax based on location's state code

		// NOTE: tax to be calculated on (totalValue - totalDiscount) and tax on
		// hallmark will be calculated on hallmark charges
		PriceDetailsDto priceDetails = MapperUtil.mapObjToClass(orderDetailsDao.getPriceDetails(),
				PriceDetailsDto.class);
		HallmarkGstRequestDto hallmarkGstRequestDto = new HallmarkGstRequestDto(orderDetailsDao.getHallmarkCharges(),
				orderDetailsDao.getHallmarkDiscount(), priceDetails.getItemHallmarkDetails().getHallmarkGstPct());

		/*TotalTaxAndTaxDetailsDto totalTaxAndTaxDetailsDto = commonTransactionService
				.getTotalTaxDetails(orderDetailsDao.getOrder().getSalesTxn().getCustomerId(),
						orderDetailsDao.getItemCode(), orderDetailsDao.getTotalValue(),
						orderDetailsDao.getTotalDiscount(), TxnTaxTypeEnum.CUST_TRANSACTION_ADV_BOOKING,
						((isTaxUpdate) || !StringUtils.isEmpty(orderDetailsDao.getTaxDetails())) ? MapperUtil
								.mapObjToClass(orderDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class) : null,
								hallmarkGstRequestDto);*/
		TotalTaxAndTaxDetailsDto totalTaxAndTaxDetailsDto = commonTransactionService
				.getTotalTaxDetails(orderDetailsDao.getOrder().getSalesTxn().getCustomerId(),
						orderDetailsDao.getItemCode(), orderDetailsDao.getTotalValue(),
						orderDetailsDao.getTotalDiscount(), TxnTaxTypeEnum.CUST_TRANSACTION_ADV_BOOKING,
						((isTaxUpdate) || !StringUtils.isEmpty(orderDetailsDao.getTaxDetails())) ?null: MapperUtil
								.mapObjToClass(orderDetailsDao.getTaxDetails(), TaxCalculationResponseDto.class),
								hallmarkGstRequestDto);


		if (totalTaxAndTaxDetailsDto.getTotalTax().compareTo(orderDetailsDao.getTotalTax()) != 0) {
			if (isPriceUpdate) {
				orderDetailsDao.setTotalTax(totalTaxAndTaxDetailsDto.getTotalTax());
			} else {
				log.info("Tax Engine response - {}", totalTaxAndTaxDetailsDto);
				throw new ServiceException(INVALID_TAX_VALUE, ERR_SALE_005);
			}
		}

		// map tax details to json.
		orderDetailsDao.setTaxDetails(MapperUtil.getStringFromJson(totalTaxAndTaxDetailsDto.getTaxDetails()));

	}

	@Override
	public OrderDaoExt updateOrderHeader(OrderDaoExt orderDao, List<OrderDetailsDaoExt> orderDetailsList) {
		if (orderDetailsList == null) {
			orderDetailsList = orderDetailsRepository.findAllByOrderId(orderDao.getId());
		}
		updateTotalsOfOrderHeader(orderDao, orderDetailsList);

		// Update sum of all items splitted weight details to header
		updateTotalOrderWeightDetails(orderDao, orderDetailsList);

		// if manual bill, then check if total weight and final value of order exceeds
		// manual bill values. - check removed

		return orderDao;
	}

	@Override
	public ManualBillTxnDetailsDto validateManualBillDetails(OrderDaoExt orderDao,
			List<OrderDetailsDaoExt> orderDetailsList, boolean isConfirmTxn) {

		if (!SubTxnTypeEnum.MANUAL_AB.name().equals(orderDao.getSalesTxn().getSubTxnType()) && !SubTxnTypeEnum.MANUAL_CO.name().equals(orderDao.getSalesTxn().getSubTxnType())) {
			return new ManualBillTxnDetailsDto();
		}

		if (orderDetailsList == null) {
			orderDetailsList = getOrderedItemsByStatus(orderDao, orderDao.getSalesTxn().getStatus());
		}

		if (CollectionUtils.isEmpty(orderDetailsList)) {
			return new ManualBillTxnDetailsDto();
		}
		
		Map<String, BigDecimal> weightDetailsList = new HashMap<>();
		ManualBillTxnDetailsDto manualBillTxnDetailsDto = MapperUtil
				.mapObjToClass(orderDao.getSalesTxn().getManualBillDetails(), ManualBillTxnDetailsDto.class);
		//checking biMetal products
		BigDecimal goldWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
		BigDecimal silverWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);
		BigDecimal platinumWeight = BigDecimal.ZERO.setScale(DomainConstants.WEIGHT_SCALE);

		if (BooleanUtils.isTrue(manualBillTxnDetailsDto.getManualBillDetails().getIsBimetal())) {

			for (OrderDetailsDaoExt record : orderDetailsList) {
				PriceDetailsDto priceDetails = MapperUtil.mapObjToClass(record.getPriceDetails(),
						PriceDetailsDto.class);

				if (priceDetails != null && priceDetails.getMetalPriceDetails() != null) {

					List<MetalPriceDto> metalPrices = priceDetails.getMetalPriceDetails().getMetalPrices();

					for (MetalPriceDto metalPrice : metalPrices) {
						if (MetalTypeCodeEnum.J.name().equals(metalPrice.getMetalTypeCode())
								&& metalPrice.getNetWeight() != null) {
							goldWeight = goldWeight.add(metalPrice.getNetWeight());
						} else if (MetalTypeCodeEnum.P.name().equals(metalPrice.getMetalTypeCode())
								&& metalPrice.getNetWeight() != null) {
							silverWeight = silverWeight.add(metalPrice.getNetWeight());
						} else if (MetalTypeCodeEnum.L.name().equals(metalPrice.getMetalTypeCode())
								&& metalPrice.getNetWeight() != null) {
							platinumWeight = platinumWeight.add(metalPrice.getNetWeight());
						}
					}
				}

			}
			log.debug("goldWeight : {}", goldWeight);
			log.debug("silverWeight : {}", silverWeight);
			log.debug("silverWeight : {}", silverWeight);
			weightDetailsList.put(MetalTypeCodeEnum.J.name(), goldWeight);
			weightDetailsList.put(MetalTypeCodeEnum.P.name(), silverWeight);
			weightDetailsList.put(MetalTypeCodeEnum.L.name(), platinumWeight);
		} else {
			for (OrderDetailsDaoExt orderDetails : orderDetailsList) {
				String itemTypecode = MapperUtil.mapObjToClass(orderDetails.getPriceDetails(), PriceDetailsDto.class)
						.getItemTypeCode();
				if (weightDetailsList.containsKey(itemTypecode)) {
					weightDetailsList.put(itemTypecode,
							weightDetailsList.get(itemTypecode).add(orderDetails.getTotalWeight()));
				} else {
					weightDetailsList.put(itemTypecode, orderDetails.getTotalWeight());
				}
			}
		}
		WeightDetailsDto weightDetails = commonTransactionService
				.getTotalWeightSplitDetailsForManualBill(weightDetailsList);
		return commonTransactionService.manualBillValuesWithHeader(orderDao.getTotalWeight(), orderDao.getFinalValue(),
				orderDao.getSalesTxn(), isConfirmTxn, weightDetails);
	}

	// Method to update Totals of Order
	@Override
	public OrderDaoExt updateTotalsOfOrderHeader(OrderDaoExt orderDao, List<OrderDetailsDaoExt> orderDetailsList) {

		orderDao.setTotalValue(BigDecimal.ZERO);
		orderDao.setFinalValue(BigDecimal.ZERO);
		orderDao.setTotalWeight(BigDecimal.ZERO);
		orderDao.setTotalQuantity((short) 0);
		orderDao.setTotalTax(BigDecimal.ZERO);
		orderDao.setTotalDiscount(BigDecimal.ZERO);
		orderDao.setMinOrderPayment(BigDecimal.ZERO);
		orderDao.setMinDiscountPayment(BigDecimal.ZERO);
		orderDao.setHallmarkCharges(BigDecimal.ZERO);
		orderDao.setHallmarkDiscount(BigDecimal.ZERO);
		orderDao.setTotalOrderValue(BigDecimal.ZERO);
		orderDao.setTotalGrossWeight(BigDecimal.ZERO);

		List<TaxCalculationResponseDto> taxes = new ArrayList<>();
		List<OrderMinPaymentDto> orderMinPayments = new ArrayList<>();
		if (!orderDetailsList.isEmpty()) {
			orderDetailsList.forEach(orderDetails -> {
				orderDao.setTotalGrossWeight(orderDao.getTotalGrossWeight().add(orderDetails.getGrossWeight()));
				orderDao.setTotalOrderValue(orderDao.getTotalOrderValue().add(orderDetails.getOrderValue()));
				orderDao.setFinalValue(orderDao.getFinalValue().add(orderDetails.getFinalValue()));
				orderDao.setTotalValue(orderDao.getTotalValue().add(orderDetails.getTotalValue()));
				orderDao.setTotalWeight(orderDao.getTotalWeight().add(orderDetails.getTotalWeight()));
				orderDao.setTotalQuantity((short) (orderDao.getTotalQuantity() + orderDetails.getTotalQuantity()));
				orderDao.setTotalTax(orderDao.getTotalTax().add(orderDetails.getTotalTax()));
				orderDao.setTotalDiscount(orderDao.getTotalDiscount().add(orderDetails.getTotalDiscount()));
				orderDao.setMinOrderPayment(orderDao.getMinOrderPayment().add(orderDetails.getMinOrderPayment()));
				orderDao.setMinDiscountPayment(
						orderDao.getMinDiscountPayment().add(orderDetails.getMinDiscountPayment()));
				// combine tax details to update header
				if (orderDetails.getTaxDetails() != null && !"{}".equals(orderDetails.getTaxDetails())) {
					taxes.add(MapperUtil.getObjectMapperInstance().convertValue(
							MapperUtil.getJsonFromString(orderDetails.getTaxDetails()),
							TaxCalculationResponseDto.class));
				}

				// Combine Min payments details to update header
				if (orderDetails.getMinPaymentDetails() != null && !"{}".equals(orderDetails.getMinPaymentDetails())) {
					JsonData jsonData = MapperUtil.mapObjToClass(orderDetails.getMinPaymentDetails(), JsonData.class);
					orderMinPayments.add(MapperUtil.mapObjToClass(jsonData.getData(), OrderMinPaymentDto.class));
				}

				// hallmark changes
				orderDao.setHallmarkCharges(orderDao.getHallmarkCharges().add(orderDetails.getHallmarkCharges()));
				orderDao.setHallmarkDiscount(orderDao.getHallmarkDiscount().add(orderDetails.getHallmarkDiscount()));

			});
		}

		// combined tax details at header
		TaxDetailsListDto taxDetails = new TaxDetailsListDto(taxes);
		if (!taxes.isEmpty()) {
			orderDao.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));

		}

		// Combined Order Min payments details
		if (!CollectionUtils.isEmpty(orderMinPayments)) {
			OrderMinPaymentDto orderMinPaymentDetails = new OrderMinPaymentDto();
			orderMinPaymentDetails.setNonFrozenMinPayment(BigDecimal.ZERO);
			orderMinPaymentDetails.setFrozenMinPayment(BigDecimal.ZERO);
			orderMinPaymentDetails.setBestRateMinPayment(BigDecimal.ZERO);
			orderMinPayments.forEach(orderItemMinPayment -> {
				orderMinPaymentDetails.setNonFrozenMinPayment(orderMinPaymentDetails.getNonFrozenMinPayment()
						.add(orderItemMinPayment.getNonFrozenMinPayment()));
				orderMinPaymentDetails.setFrozenMinPayment(
						orderMinPaymentDetails.getFrozenMinPayment().add(orderItemMinPayment.getFrozenMinPayment()));
				orderMinPaymentDetails.setBestRateMinPayment(orderMinPaymentDetails.getBestRateMinPayment()
						.add(orderItemMinPayment.getBestRateMinPayment()));
			});

			log.info("Header Min payment details - {}", orderMinPaymentDetails);

			orderDao.setMinPaymentDetails(
					MapperUtil.getStringFromJson(new JsonData("MIN_PAYMENT_DETAILS", orderMinPaymentDetails)));
		}

		// rounding off Order Min payment
		BigDecimal roundingVariance = commonTransactionService.getRoundingVariance(orderDao.getMinOrderPayment());
		orderDao.setMinOrderPayment(orderDao.getMinOrderPayment().add(roundingVariance));

		// rounding off Order Min payment to avail discount:
		orderDao.setMinDiscountPayment(orderDao.getMinDiscountPayment()
				.add(commonTransactionService.getRoundingVariance(orderDao.getMinDiscountPayment())));

		// @formatter:off
		// final value = (total value + hallmark charges - (total discount + hallmark
		// discount)) + total tax(includes hallmark tax also)
		// @formatter:on
		BigDecimal finalValue = orderDao.getTotalValue().add(orderDao.getHallmarkCharges())
				.subtract(orderDao.getTotalDiscount().add(orderDao.getHallmarkDiscount())).add(orderDao.getTotalTax());
		orderDao.setFinalValue(finalValue);

		// rounding off Order final value:
		BigDecimal finalValueRoundingVariance = commonTransactionService.getRoundingVariance(orderDao.getFinalValue());

		// rounding variance
		orderDao.setRoundingVariance(finalValueRoundingVariance);
		orderDao.setFinalValue(orderDao.getFinalValue().add(finalValueRoundingVariance));

		return orderDao;
	}

	@Override
	public void updateOrderItemStatus(List<OrderDetailsDaoExt> orderDetailsDaoList, String currentStatus) {
		List<OrderDetailsDaoExt> updatedOrderDetailsList = new ArrayList<>();
		orderDetailsDaoList.forEach(orderDetail -> {
			orderDetail.setStatus(currentStatus);
			updatedOrderDetailsList.add(orderDetail);
		});
		orderDetailsRepository.saveAll(updatedOrderDetailsList);
		log.info("Updated order item details - {} and status is {}", updatedOrderDetailsList,
				updatedOrderDetailsList.get(0).getStatus());
	}

	@Override
	public String getInvWeightDetails(Object weightDetails) {
		JsonData jsonData = MapperUtil.mapObjToClass(weightDetails, JsonData.class);
		// temp check
		Object weightJson = StringUtil.isBlankJsonData(jsonData) ? null : jsonData.getData();

		if (StringUtil.isBlankJsonStr(MapperUtil.getStringFromJson(weightJson))) {
			weightJson = weightDetails;
		}

		return MapperUtil.getStringFromJson(new JsonData(CommonConstants.WEIGHT_DETAILS,
				MapperUtil.mapObjToClass(weightJson, WeightDetailsDto.class)));
	}

	/**
	 * This method will update price details for each item in order
	 * 
	 * 
	 * @param orderDetailsDaoList
	 * @param salesTxnDao
	 * @param isRateFreeze        - In case of Freeze Rate of Confirmed Order
	 * @param metalRate
	 */
	@Override
	public void updateItemPriceDetails(Map<OrderDetailsDaoExt, OrderDetailsConfigDaoExt> orderItemDetailsMap,
			SalesTxnDaoExt salesTxnDao, Boolean isRateFreeze, boolean isMetalRateFreezedCN) {

		orderItemDetailsMap.forEach((orderDetailsDao, orderDetailsConfigDao) -> {
			// unit value, net value and price details
			validateItemPrice(salesTxnDao, orderDetailsDao, orderDetailsConfigDao, true, isMetalRateFreezedCN);
			// total tax and tax details.
			validateTaxDetails(orderDetailsDao, true, false);

			// @formatter:off
			// final value = (total value + hallmark charges - (total discount + hallmark
			// discount)) + total tax(includes hallmark tax also).
			// @formatter:on
			orderDetailsDao.setFinalValue(commonTransactionService.getItemFinalValue(orderDetailsDao.getTotalValue(),
					orderDetailsDao.getTotalDiscount(), orderDetailsDao.getTotalTax(),
					orderDetailsDao.getHallmarkCharges(), orderDetailsDao.getHallmarkDiscount()));

			calculateMinOrderValue(orderDetailsDao, salesTxnDao.getTxnType(), isRateFreeze);
			// pending - total discount.

			log.info("Order item details after min order payment update - {}", orderDetailsDao.getMinOrderPayment());

			// pending: discount details
		});

		orderDetailsRepository.saveAll(orderItemDetailsMap.keySet().stream().collect(Collectors.toList()));
		orderDetailsConfigRepositoryExt.saveAll(orderItemDetailsMap.values().stream().collect(Collectors.toList()));

		// for cumulative discount discount
		Map<String, List<DiscountItemDetailsDaoExt>> applicableCumulativeItemsMap = new HashMap<>();
		// Update discount details at item level
		orderItemDetailsMap.forEach((orderDetailsDao, itemConfig) -> discountItemFacadeService.updateItemDiscounts(
				salesTxnDao.getId(), salesTxnDao.getTxnType(), salesTxnDao.getSubTxnType(), orderDetailsDao.getId(),
				true, applicableCumulativeItemsMap));

		if (!CollectionUtils.isEmpty(applicableCumulativeItemsMap)) {

			applicableCumulativeItemsMap.forEach(
					(cumulativeId, itemDiscountList) -> discountUtilService.recalculateCumulateDiscount(new HashSet<>(),
							itemDiscountList, salesTxnDao, new HashSet<>(), null, true));
		}

		// update or re apportionate discount details at bill level like system
		// discounts(GHS,DV),bill level discount types
		discountFacadeService.updateTransactionLevelDiscount(salesTxnDao.getId(), salesTxnDao.getTxnType(),
				salesTxnDao.getSubTxnType(), null, true, null, null);

	}

	// Method to update tax details of list of items in case of cutomer change
	@Override
	public void updateTaxDetails(List<OrderDetailsDaoExt> orderDetailsDaoList) {
		for (OrderDetailsDaoExt orderDetailsDao : orderDetailsDaoList) {
			// total tax and tax details.
			validateTaxDetails(orderDetailsDao, true, true);

			// @formatter:off
			// final value = (total value + hallmark charges - (total discount + hallmark
			// discount)) + total tax(includes hallmark tax also).
			// @formatter:on
			orderDetailsDao.setFinalValue(commonTransactionService.getItemFinalValue(orderDetailsDao.getTotalValue(),
					orderDetailsDao.getTotalDiscount(), orderDetailsDao.getTotalTax(),
					orderDetailsDao.getHallmarkCharges(), orderDetailsDao.getHallmarkDiscount()));

		}
	}

	// Method to get AB config details from location master
	@Override
	public LocationAdvanceBookingDetailsDto getAbDetailsFromLocation() {

		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		LocationAdvanceBookingDetailsDto locationAdvanceBookingDetailsDto = locationCacheDto.getAbDetails();
		
		if (locationAdvanceBookingDetailsDto == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023, "AB details for location");
		}

		return locationAdvanceBookingDetailsDto;
	}
	
	// Method to get CO config details from location master
	@Override
	public CustomerOrderDetails getCoDetailsFromLocation() {

		LocationCacheDto locationCacheDto = engineService.getStoreLocation(CommonUtil.getLocationCode());
		
		CustomerOrderDetails cODetails = locationCacheDto.getOrderDetails();

		if (cODetails == null) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_OF_CO_IS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_COM_008, "CO details for location");
		}

		return cODetails;
	}
	

	// Method to fetch Inventory coin details by BinGroup
	@Override
	public List<InventoryDetailsDao> getInventoryCoinsByBinGroup(String itemCode, BigDecimal invWeight, Short reqQty,
			String reqBinGroup) {
		ItemCodeInvWeightDto itemCodeInvWeightDto = new ItemCodeInvWeightDto(itemCode, invWeight);
		// Fetch Inventory coins for a bin Group
		Map<ItemCodeInvWeightDto, List<InventoryDetailsDao>> itemCodeAndInvCoinsMap = inventoryService
				.getInvCoinDetails(Map.of(itemCodeInvWeightDto, new SalesItemDto()), List.of(reqBinGroup), true);

		List<InventoryDetailsDao> coinInvDetailsList = itemCodeAndInvCoinsMap.get(itemCodeInvWeightDto);

		// filter coins by comparing unit_weight with required weight
		List<InventoryDetailsDao> matchedCoinList = coinInvDetailsList.stream()
				.filter(coin -> (invWeight
						.compareTo(coin.getTotalWeight().divide(new BigDecimal(coin.getTotalQuantity()))) == 0))
				.collect(Collectors.toList());

		if (CollectionUtils.isEmpty(matchedCoinList)) {
			throw new ServiceException(SalesConstants.ITEM_NOT_AVAILABLE, SalesConstants.ERR_SALE_131, itemCode);
		}

		// Validate required quantity with available quantity in inventory
		Integer totalAvailableQuantity = matchedCoinList.stream().mapToInt(InventoryDetailsDao::getTotalQuantity).sum();
		if (reqQty > totalAvailableQuantity) {
			throw new ServiceException(SalesConstants.ITEM_QUANTITY_EXCEEDS_INVENTORY_QUANTITY,
					SalesConstants.ERR_SALE_055, itemCode);
		}

		return matchedCoinList;
	}

	/**
	 * Methods to update sum of all ordered items splitted weight details to header
	 * 
	 * @param orderDao
	 * @param orderDetailsList
	 */
	private OrderDaoExt updateTotalOrderWeightDetails(OrderDaoExt orderDao, List<OrderDetailsDaoExt> orderDetailsList) {

		WeightDetailsDto weightDetailsDto;
		if (TransactionTypeEnum.CO.name().equals(orderDao.getSalesTxn().getTxnType())) {
			weightDetailsDto = getWeightSplitForCO(orderDetailsList);

		} else {
			// Fetch weight details of each ordered item
			Map<String, WeightDetailsAndQtyDto> weightDetailsList = orderDetailsList.stream()
					.collect(Collectors.toMap(OrderDetailsDaoExt::getId,
							orderDetails -> new WeightDetailsAndQtyDto(orderDetails.getInventoryWeightDetails(),
									orderDetails.getTotalQuantity())));

			// Sum up all item level splitted weights.
			weightDetailsDto = commonTransactionService.getTotalWeightSplitDetails(weightDetailsList);
		}
		orderDao.setOrderWeightDetails(new JsonData(SalesUtil.WEIGHT_DETAILS, weightDetailsDto).toString());

		return orderDao;

	}

	private WeightDetailsDto getWeightSplitForCO(List<OrderDetailsDaoExt> orderDetailsList) {
		WeightDetailsDto weightDetailsDto;
		weightDetailsDto = new WeightDetailsDto(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
				BigDecimal.ZERO, BigDecimal.ZERO);
		for (OrderDetailsDaoExt orderDetails : orderDetailsList) {
			PriceDetailsDto price = MapperUtil.mapObjToClass(orderDetails.getPriceDetails(), PriceDetailsDto.class);
			if (MetalTypeCodeEnum.J.name().equals(price.getItemTypeCode())) {
				weightDetailsDto.setGoldWeight(weightDetailsDto.getGoldWeight().add(price.getNetWeight()));
			} else if (MetalTypeCodeEnum.L.name().equals(price.getItemTypeCode())) {
				weightDetailsDto.setPlatinumWeight(weightDetailsDto.getPlatinumWeight().add(price.getNetWeight()));
			} else if (MetalTypeCodeEnum.P.name().equals(price.getItemTypeCode())) {
				weightDetailsDto.setSilverWeight(weightDetailsDto.getSilverWeight().add(price.getNetWeight()));
			}
		}
		return weightDetailsDto;
	}

	// Method to validate tolerance config for Frozen,Non-Frozen & Best gold rate
	// orders
	public void validateToleranceConfig(WeightDetailsDto totalDeliveredWeightDetails,
			WeightDetailsDto totalOrderedWeightDetails, String ruleType, String rangeType) {

		RuleRequestListDto ruleRequestDto = new RuleRequestListDto();

		ruleRequestDto.setLocationCode(CommonUtil.getLocationCode());
		ruleRequestDto.setRangeType(rangeType);

		// Validate for Gold weight
		validateMetalWeightTolerance(totalDeliveredWeightDetails.getGoldWeight(),
				totalOrderedWeightDetails.getGoldWeight(), ruleRequestDto, MetalTypeCodeEnum.J.name(), ruleType);

		// Validate for Silver weight
		validateMetalWeightTolerance(totalDeliveredWeightDetails.getSilverWeight(),
				totalOrderedWeightDetails.getSilverWeight(), ruleRequestDto, MetalTypeCodeEnum.P.name(), ruleType);

		// Validate for Platinum weight
		validateMetalWeightTolerance(totalDeliveredWeightDetails.getPlatinumWeight(),
				totalOrderedWeightDetails.getPlatinumWeight(), ruleRequestDto, MetalTypeCodeEnum.L.name(), ruleType);

	}

	// Method to validate weight tolerance at each metal level applicable in convert
	// order to CM
	private void validateMetalWeightTolerance(BigDecimal deliveredMetalWeight, BigDecimal orderedMetalWeight,
			RuleRequestListDto ruleRequestDto, String metalType, String ruleType) {

		log.info("validate metal weight tolerance>>> Metal Type: " + metalType + " delivered weight: "
				+ deliveredMetalWeight + " ordered weight: " + orderedMetalWeight + " rule type: " + ruleType);

		// Incase order doesn't have specific metal added, during invoice new metal
		// types are not allowed. As the order rate being freezed
		if (orderedMetalWeight.compareTo(BigDecimal.ZERO) == 0 && deliveredMetalWeight.compareTo(BigDecimal.ZERO) > 0) {
			throw new ServiceException("Metals other than ordered Metals are not allowed for Invoice", "ERR-SALE-273",
					"Metal type: " + metalType);
		}

		// If ZERO value, no need to validate tolerance
		if (orderedMetalWeight.compareTo(BigDecimal.ZERO) == 0
				|| deliveredMetalWeight.compareTo(BigDecimal.ZERO) == 0) {
			return;
		}

		ruleRequestDto.setInputValue(orderedMetalWeight);
		ruleRequestDto.setMetalType(metalType);

		// Call to engine api to get Configured values
		Object ruleFieldValues = engineService.getRuleFieldValues(RuleTypeEnum.valueOf(ruleType), ruleRequestDto);

		log.info("validate Metal Weight Tolerance>>> rule field values: {}", ruleFieldValues);

		BigDecimal toleranceWeightApplicable;

		if (ruleType.equalsIgnoreCase(RuleTypeEnum.BGR_TOLERANCE_CONFIG.name())) {
			BGRToleranceRangeDetails bgrToleranceRangeDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(ruleFieldValues, BGRToleranceRangeDetails.class);
			// Applied tolerance percent on ordered weight
			if (bgrToleranceRangeDetails.getConfigPercent() != null
					&& bgrToleranceRangeDetails.getConfigPercent().compareTo(BigDecimal.ZERO) > 0) {
				BigDecimal tolerancePercentValue = orderedMetalWeight
						.multiply(bgrToleranceRangeDetails.getConfigPercent())
						.divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);
				// Consider minimum of percent or value for tolerance validation
				toleranceWeightApplicable = bgrToleranceRangeDetails.getConfigValue().min(tolerancePercentValue);
			} else {
				toleranceWeightApplicable = bgrToleranceRangeDetails.getConfigValue();
			}
		} else {
			OrderRangeConfigDetails orderRangeConfigDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(ruleFieldValues, OrderRangeConfigDetails.class);
			// Applied tolerance percent on ordered weight
			if (orderRangeConfigDetails.getConfigPercent() != null
					&& orderRangeConfigDetails.getConfigPercent().compareTo(BigDecimal.ZERO) > 0) {
				BigDecimal tolerancePercentValue = orderedMetalWeight
						.multiply(orderRangeConfigDetails.getConfigPercent())
						.divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);
				// Consider minimum of percent or value for tolerance validation
				toleranceWeightApplicable = orderRangeConfigDetails.getConfigValue().min(tolerancePercentValue);
			} else {
				toleranceWeightApplicable = orderRangeConfigDetails.getConfigValue();
			}
		}

		if (deliveredMetalWeight.subtract(orderedMetalWeight).compareTo(toleranceWeightApplicable) > 0) {
			throw new ServiceException(
					"Invoice metal weight exceeding ordered metal weight for metalType -" + metalType, "ERR-SALE-215",
					"Rule type>> " + ruleType + " Metal Type:" + metalType + "Ordered weight: " + orderedMetalWeight
					+ ",Invoiced weight:" + deliveredMetalWeight+ ", Tolerance weight allowed: "+toleranceWeightApplicable,
					Map.of("metalType", metalType));
		}

	}

	@Override
	public List<InventoryDetailsDao> releaseItemsFromReserveBin(List<OrderDetailsDaoExt> orderDetailsDaoList) {
		List<InventoryDetailsDao> updatedInventoryDetails = new ArrayList<>();

		List<SalesItemDto> salesItemDtoList = new ArrayList<>();

		orderDetailsDaoList.forEach(orderDetailsDao -> {
			SalesItemDto salesItemDto = (SalesItemDto) MapperUtil.getDtoMapping(orderDetailsDao, SalesItemDto.class);
			salesItemDtoList.add(salesItemDto);
		});

		// get inventory id's to Release from Reserve Bin for both regular items & Coins
		UpdateInvItemAndSalesItemDto updateInvItemsAndSalesItems = commonTransactionService
				.getInvIdsAndSalesItemsForUpdate(salesItemDtoList, List.of(BinGroupEnum.RESERVEBIN.name()));

		log.info("Update Inventory details & sales item details - {}{}",
				updateInvItemsAndSalesItems.getUpdateInventoryDtoList(),
				updateInvItemsAndSalesItems.getItemDetailsListToUpdate());

		// update inventory
		if (!CollectionUtils.isEmpty(updateInvItemsAndSalesItems.getUpdateInventoryDtoList())) {

			// Update Inventory by releasing ordered items from RESERVE BIN
			updatedInventoryDetails = inventoryService
					.updateBinById(updateInvItemsAndSalesItems.getUpdateInventoryDtoList(), null, true);

		}

		return updatedInventoryDetails;

	}

	@Override
	public void validateResidualToleranceAndUpdateOrder(OrderDaoExt orderDao) {

		// If delivered weight is equal & greater than ordered weight, CLOSE the order
		if (orderDao.getTotalDeliveredWeight().compareTo(orderDao.getTotalWeight()) >= 0) {
			orderDao.getSalesTxn().setStatus(TransactionStatusEnum.DELIVERED.name());

			List<OrderDetailsDaoExt> orderItemDetails = getOrderedItemsByStatus(orderDao,
					TransactionStatusEnum.CONFIRMED.name());

			// To CLOSE the order, Get the pending ordered items released
			if (!CollectionUtils.isEmpty(orderItemDetails)) {

				List<String> pendingOrderItemIds = getPendingOrderItemIds(orderItemDetails);

				throw new ServiceException(
						"Total delivery weight reached ordered weight. Please release the pending ordered items",
						"ERR-SALE-255", pendingOrderItemIds);
			}

			// To release residual CN's linked to AB
			releaseLinkedCreditNotes(orderDao);

		} else {
			RuleRequestListDto ruleRequestDto = new RuleRequestListDto();

			ruleRequestDto.setLocationCode(CommonUtil.getLocationCode());
			ruleRequestDto.setInputValue(orderDao.getTotalWeight());
			ruleRequestDto.setRangeType(RangeTypeEnum.ORDER_RESIDUAL_WEIGHT.name());

			// Call to engine api to get Configured values
			Object ruleFieldValues = engineService.getRuleFieldValues(RuleTypeEnum.ORDER_AB_RESIDUAL_TOLERANCE_CONFIG,
					ruleRequestDto);

			OrderRangeConfigDetails orderRangeConfigDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(ruleFieldValues, OrderRangeConfigDetails.class);

			BigDecimal residualToleranceApplicable;
			// Added as part of client requirement during UAT, once existing data is
			// corrected, this null check can be removed
			if (orderRangeConfigDetails.getConfigPercent() != null
					&& orderRangeConfigDetails.getConfigPercent().compareTo(BigDecimal.ZERO) > 0) {
				// Applied tolerance percent on ordered weight
				BigDecimal tolerancePercentValue = orderDao.getTotalWeight()
						.multiply(orderRangeConfigDetails.getConfigPercent())
						.divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);
				// Consider minimum of percent or value for tolerance validation
				residualToleranceApplicable = orderRangeConfigDetails.getConfigValue().min(tolerancePercentValue);
			} else {
				residualToleranceApplicable = orderRangeConfigDetails.getConfigValue();
			}
			// If the difference of ordered weight & delivered weight within
			// residual closure tolerance value. Update status as RESIDUAL_CLOSURE
			if (orderDao.getTotalWeight().subtract(orderDao.getTotalDeliveredWeight())
					.compareTo(residualToleranceApplicable) <= 0) {

				orderDao.getSalesTxn().setStatus(TransactionStatusEnum.RESIDUAL_CLOSURE.name());

				// Validate, Is eligible for Residual closure
				validateOrderResidualClosure(orderDao);

				// To release residual CN's linked to AB
				releaseLinkedCreditNotes(orderDao);

			} else {

				// Validate, Is order eligible for Partial Invoice
				validateOrderPartialInvoiceEligibility(orderDao);

			}

		}

	}

	// Method to get items id's of pending order
	public List<String> getPendingOrderItemIds(List<OrderDetailsDaoExt> orderItemDetails) {

		return orderItemDetails.stream().map(OrderDetailsDaoExt::getId).collect(Collectors.toList());

	}

	public void validateOrderPartialInvoiceEligibility(OrderDaoExt orderDao) {
		List<OrderDetailsDaoExt> orderItemDetails = getOrderedItemsByStatus(orderDao,
				TransactionStatusEnum.CONFIRMED.name());

		// if (!CollectionUtils.isEmpty(orderItemDetails)) {
		orderDao.getSalesTxn().setStatus(TransactionStatusEnum.PARTIAL_INVOICE.name());
		if (!CollectionUtils.isEmpty(orderItemDetails)) {
			BigDecimal pendingItemsWeight = orderItemDetails.stream().map(OrderDetailsDaoExt::getTotalWeight)
					.reduce(BigDecimal.ZERO, BigDecimal::add);

			// If Pending orders items weight exceeding available ordered weight for
			// further invoice. Get the pending items released
			if (pendingItemsWeight
					.compareTo(orderDao.getTotalWeight().subtract(orderDao.getTotalDeliveredWeight())) > 0) {

				List<String> pendingOrderItemIds = getPendingOrderItemIds(orderItemDetails);

				throw new ServiceException(
						"Pending Ordered items weight is greater than the available ordered weight for further invoice. Please release the pending ordered items",
						"ERR-SALE-257", pendingOrderItemIds);
			}
		}
	}
	// else {
	// orderDao.getSalesTxn().setStatus(TransactionStatusEnum.DELIVERED.name());
	//
	// // To release residual CN's linked to AB
	// releaseLinkedCreditNotes(orderDao);
	// }
	// }

	public void validateOrderResidualClosure(OrderDaoExt orderDao) {
		List<OrderDetailsDaoExt> orderItemDetails = getOrderedItemsByStatus(orderDao,
				TransactionStatusEnum.CONFIRMED.name());

		// To perform Residual closure, All pending ordered items should be released
		if (!CollectionUtils.isEmpty(orderItemDetails)) {
			List<String> pendingOrderItemIds = getPendingOrderItemIds(orderItemDetails);
			throw new ServiceException(
					"Total delivery weight reached ordered weight with residual tolerance allowed. Please release the pending ordered items",
					"ERR-SALE-256", pendingOrderItemIds);
		}
	}

	public List<OrderDetailsDaoExt> getOrderedItemsByStatus(OrderDaoExt orderDao, String status) {

		return orderDetailsRepository.findAllByOrderIdAndStatus(orderDao.getId(), status);

	}

	@Override
	public List<OrderDetailsDaoExt> validateAndUpdateOrderItemDetails(List<OrderDetailsDaoExt> orderDetailsDaoList,
			List<CashMemoDetailsDaoExt> orderedCmItemList) {
		List<OrderDetailsDaoExt> updatedOrderItems = new ArrayList<>();
		for (CashMemoDetailsDaoExt orderCmItem : orderedCmItemList) {
			for (OrderDetailsDaoExt orderItem : orderDetailsDaoList) {
				if (orderCmItem.getOrderItem().getId().equalsIgnoreCase(orderItem.getId())) {
					Short lastDeliveredQty = orderItem.getDeliveredQuantity() != null ? orderItem.getDeliveredQuantity()
							: 0;
					Short totalItemDeliveredQty = (short) (lastDeliveredQty + orderCmItem.getTotalQuantity());
					BigDecimal totalItemDeliveredWeight = (orderItem.getDeliveredWeight() != null
							? orderItem.getDeliveredWeight()
							: BigDecimal.ZERO).add(orderCmItem.getTotalWeight());
					updateOrdereditemDeliveryDetails(orderCmItem, orderItem, totalItemDeliveredQty,
							totalItemDeliveredWeight);

					updatedOrderItems.add(orderItem);
				}
			}
		}
		return updatedOrderItems;
	}

	// Method tp update Ordered item delivery details
	private void updateOrdereditemDeliveryDetails(CashMemoDetailsDaoExt orderCmItem, OrderDetailsDaoExt orderItem,
			Short totalItemDeliveredQty, BigDecimal totalItemDeliveredWeight) {
		if (totalItemDeliveredQty > orderItem.getTotalQuantity()) {
			throw new ServiceException("Delivered Quantity exceeds Ordered Quantity", "ERR-SALE-204",
					orderCmItem.getId());
		}
		if (totalItemDeliveredQty.compareTo(orderItem.getTotalQuantity()) == 0) {
			orderItem.setStatus(TransactionStatusEnum.DELIVERED.name());
		}
		orderItem.setDeliveredQuantity(totalItemDeliveredQty);
		orderItem.setDeliveredWeight(totalItemDeliveredWeight);
	}

	@Override
	public void validateAndUpdateOrderHeaderDetails(CashMemoDaoExt cashMemoDao,
		List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList, OrderDaoExt orderDao) {

		SalesTxnDaoExt salesTxnDao = orderDao.getSalesTxn();
		if (salesTxnDao.getStatus().equals(TransactionStatusEnum.PARTIAL_INVOICE.name())) {
			BigDecimal balanceWeight =  orderDao.getTotalWeight().subtract(orderDao.getTotalDeliveredWeight());

			log.info("balanceWeight >>>  {} ", balanceWeight);
			log.info("cashMemoDao.getTotalWeight() >>>  {} ", cashMemoDao.getTotalWeight());
			if (cashMemoDao.getTotalWeight().compareTo(balanceWeight) > 0) {
				throw new ServiceException(
						"Total items weight is greater than AB balance weight",
						"ERR-SALE-449");
			}
		}

		// Sum up the total delivered Quantity & weight
		Integer totalOrderDeliveredQuantity = orderDao.getTotalDeliveredQuantity() != null
				? orderDao.getTotalDeliveredQuantity()
				: 0 + cashMemoDao.getTotalQuantity();
		BigDecimal totalOrderDeliveredWeight = (orderDao.getTotalDeliveredWeight() != null
				? orderDao.getTotalDeliveredWeight()
				: BigDecimal.ZERO).add(cashMemoDao.getTotalWeight());

		orderDao.setTotalDeliveredQuantity(totalOrderDeliveredQuantity.shortValue());
		orderDao.setTotalDeliveredWeight(totalOrderDeliveredWeight);

		// Sum up all the Billed items splitted weight details
		Map<String, WeightDetailsAndQtyDto> cmWeightDetailsList = cashMemoDetailsDaoList.stream()
				.collect(Collectors.toMap(CashMemoDetailsDaoExt::getId,
						cMDetails -> new WeightDetailsAndQtyDto(cMDetails.getMeasuredWeightDetails(),
								cMDetails.getTotalQuantity())));

		// Total delivered weight details of current Cash memo
		WeightDetailsDto totalDeliveredWeightDetails = commonTransactionService
				.getTotalWeightSplitDetails(cmWeightDetailsList);

		// If any items previously delivered , In case of partial invoice
		if (!StringUtil.isBlankJsonStr(orderDao.getDeliveredWeightDetails())) {

			List<String> totalDeliveredWeightList = new ArrayList<>();
			totalDeliveredWeightList.add(
					MapperUtil.getStringFromJson(new JsonData(SalesUtil.WEIGHT_DETAILS, totalDeliveredWeightDetails)));

			// Sum up the previously delivered weights with the current item weights
			totalDeliveredWeightList.add(orderDao.getDeliveredWeightDetails());

			// Sum up previously delivered weight with current delivered weight
			totalDeliveredWeightDetails = commonTransactionService.sumUpWeightDetails(totalDeliveredWeightList);

		}

		// Update Total Delivered weight details
		orderDao.setDeliveredWeightDetails(
				MapperUtil.getStringFromJson(new JsonData(SalesUtil.WEIGHT_DETAILS, totalDeliveredWeightDetails)));

		// Validate Residual tolerance allowed
		validateResidualToleranceAndUpdateOrder(orderDao);

	}

	@Override
	public void saveLinkedCreditNotesAsPaymentInCashMemo(OrderDaoExt orderDao, CashMemoDaoExt cashMemoDao) {

		List<CreditNoteDaoExt> creditNotesOfOrder = creditNoteRepo.findByLinkedTxnIdAndStatus(orderDao.getId(),
				CNStatus.OPEN.name());
		if (!CollectionUtils.isEmpty(creditNotesOfOrder)) {
			// if any CN has frozen details, the it has top priority(GRF CN flow)
			CreditNoteDaoExt cnToBeMovedToFirst = null;
			for (CreditNoteDaoExt cn : creditNotesOfOrder) {
				if (!StringUtil.isBlankJsonStr(cn.getFrozenRateDetails())) {
					cnToBeMovedToFirst = cn;
					break;
				}
			}
			if (cnToBeMovedToFirst != null) {
				creditNotesOfOrder.remove(cnToBeMovedToFirst);
				creditNotesOfOrder.add(0, cnToBeMovedToFirst);
			}
			// end: CN with frozen details moved to first

			for (CreditNoteDaoExt creditNote : creditNotesOfOrder) {

				CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto = new CreditNotePaymentOtherDetailsDto();
				creditNoteOtherDetailsDto.setIsLinkedCn(true);
				// get the 'allowedCategory' selected in AB transaction.
				if (cnToBeMovedToFirst != null && cnToBeMovedToFirst.getId().equals(creditNote.getId())) {
					getCnRateProtectedDetails(orderDao, creditNote, creditNoteOtherDetailsDto);
				}

				PaymentCreateDto paymentCreateDto = new PaymentCreateDto();
				paymentCreateDto
						.setAmount(creditNote.getAmount().setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
				paymentCreateDto.setReference3(creditNote.getId());
				paymentCreateDto.setInstrumentNo(creditNote.getDocNo().toString());
				paymentCreateDto.setInstrumentType(creditNote.getCreditNoteType());

				paymentCreateDto.setOtherDetails(
						new JsonData(PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), creditNoteOtherDetailsDto));

				paymentFacadeService.savePayment(PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(),
						PaymentGroupEnum.REGULAR.name(), TransactionTypeEnum.CM.name(), SubTxnTypeEnum.NEW_CM.name(),
						cashMemoDao.getId(), paymentCreateDto, true, false);
			}
		}

	}

	private void getCnRateProtectedDetails(OrderDaoExt orderDao, CreditNoteDaoExt creditNote,
			CreditNotePaymentOtherDetailsDto creditNoteOtherDetailsDto) {
		List<PaymentDetailsDaoExt> paymentDaoList = paymentDetailsRepositoryExt
				.findBySalesTxnDaoIdAndCreditNoteDaoIdAndStatus(orderDao.getId(), creditNote.getId(),
						PaymentStatusEnum.COMPLETED.name());

		// if payment list is empty or list has more than one item, then data is invalid
		if (CollectionUtil.isEmpty(paymentDaoList) || paymentDaoList.size() > 1) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294,
					"Payment list is empty or list has more than one item, then data is invalid for GRF CN from AB to CM",
					Map.of(SalesConstants.REMARKS, "Invalid data in DB."));
		}

		PaymentDetailsDaoExt paymentDetailsDao = paymentDaoList.get(0);
		JsonData jsonData = MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class);
		creditNoteOtherDetailsDto.setIsRateProtectedCN(true);
//		if(paymentDetailsDao.getPaymentCode().equals(PaymentCodeEnum.GHS_ACCOUNT.name()))
//		{
//			//get details from  item master for product_type
//			//if it is equal to studded/plain set//else error throw
//		}
//		else
//		{
//			
//		}
		creditNoteOtherDetailsDto
		.setAllowedCategory(JsonUtils.getValueFromJson(jsonData.getData(), "allowedCategory", String.class));
	}

	@Override
	public void releaseItemFromReserveBin(OrderDetailsDaoExt orderDetailsDao) {

		//		SalesItemDto salesItemDto = (SalesItemDto) MapperUtil.getDtoMapping(orderDetailsDao, SalesItemDto.class);
		//
		//		// get inventory id's to Release from Reserve Bin for both regular items & Coins
		//		UpdateInvItemAndSalesItemDto updateInvItemsAndSalesItems = commonTransactionService
		//				.getInvIdsAndSalesItemsForUpdate(List.of(salesItemDto), BinGroupEnum.RESERVEBIN.name());
		//		
		//		log.info("Release Item from reserve bin  & update order item details - {}{}",
		//				updateInvItemsAndSalesItems.getUpdateInventoryDtoList(),
		//				updateInvItemsAndSalesItems.getItemDetailsListToUpdate());
		//
		//		// update inventory
		//		if (!CollectionUtils.isEmpty(updateInvItemsAndSalesItems.getUpdateInventoryDtoList())) {
		//
		//			// Update Inventory by releasing ordered items from RESERVE BIN
		//			inventoryService.updateBinById(updateInvItemsAndSalesItems.getUpdateInventoryDtoList(), null, true);
		//
		//		}
		//
		//		// Update order item status
		//		orderDetailsDao.setStatus(TransactionStatusEnum.RELEASED.name());
		orderDetailsDao.setIsItemToBeReleased(true);
		orderDetailsRepository.save(orderDetailsDao);

	}

	@Override
	public List<OrderDetailsDaoExt> getOrderDetailsByItemIdIfExists(String orderId, List<String> itemIdList) {

		List<OrderDetailsDaoExt> orderDetailsDaoList = orderDetailsRepository
				.listItemDetailsByOrderIdAndItemIds(orderId, !CollectionUtils.isEmpty(itemIdList) ? itemIdList : null);

		if (orderDetailsDaoList.isEmpty()) {
			throw new ServiceException(SalesConstants.NO_ITEM_FOUND_IN_THE_TRANSACTION, SalesConstants.ERR_SALE_046,
					"No items found in current transaction.");
		}
		return orderDetailsDaoList;
	}

	// Method to release linked credit notes
	@Override
	public void releaseLinkedCreditNotes(OrderDaoExt orderDao) {
		CreditNoteLinkDto creditNoteLinkDto = new CreditNoteLinkDto();
		creditNoteLinkDto.setLinkedTxn(orderDao.getSalesTxn());
		creditNoteLinkDto.setRemoveLink(true);
		creditNoteService.linkCreditNote(creditNoteLinkDto);
	}

	// Method to validate and apply order item discounts in invoked CM
	@Override
	@Transactional
	public void validateAndApplyOrderItemDiscounts(SalesTxnDaoExt salesTxnDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {

		// get all AB items with cumm discount applied
		List<DiscountItemDetailsDaoExt> cummDiscount = discountItemDetailsRepository
				.findByDiscountDetailSalesTxnIdAndItemIdInAndDiscountDetailCumulativeDiscountIdNotNull(
						salesTxnDao.getRefTxnId().getId(),
						cashMemoDetailsDaoList.stream().filter(cmd -> cmd.getOrderItem() != null)
								.map(cmd -> cmd.getOrderItem().getId()).collect(Collectors.toSet()));
		// get all AB items that do not have discount and are part of exclude
		Set<String> excludeItems = new HashSet<>();
		Map<String, Set<String>> newHashMapforCumDiscountItems = new HashMap<>();
		if (!CollectionUtils.isEmpty(cummDiscount)) {
			newHashMapforCumDiscountItems = getCmItemsForRespetiveAbIds(cummDiscount, cashMemoDetailsDaoList);
			excludeItems = discountUtilService.getPossibleExcludeItemsForCummulativeDiscountForAbToCm(salesTxnDao,
					cashMemoDetailsDaoList.stream().filter(cmd -> cmd.getOrderItem() != null)
							.map(cmd -> cmd.getOrderItem().getId()).collect(Collectors.toList()),
					null);
		}

		log.info("excludeItems : {}", excludeItems);

		for (CashMemoDetailsDaoExt cashMemoDetailsDao : cashMemoDetailsDaoList) {

			List<DiscountItemDetailsDaoExt> itemDiscountsApplied = discountItemDetailsRepository
					.findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdIn(
							salesTxnDao.getRefTxnId(), DiscountApplicableLevelEnum.ITEM_LEVEL.name(),
							List.of(cashMemoDetailsDao.getOrderItem().getId()));

			// If Any discount applied during AB, carry forward the discount
			if (!CollectionUtils.isEmpty(itemDiscountsApplied)) {
				List<DiscountDetailsDaoExt> discountDetailsList = new ArrayList<>();

				List<DiscountItemDetailsDaoExt> discountItemList = new ArrayList<>();

				List<DiscountConfigDetailsDaoExt> discountConfigList = new ArrayList<>();

				List<DiscountItemDetailsDaoExt> applicableCumulativeItemDiscounts = new ArrayList<>();

				// If single item has Club discounts applied, validate & apply all
				for (DiscountItemDetailsDaoExt itemDiscount : itemDiscountsApplied) {

					if ((StringUtils.isEmpty(itemDiscount.getDiscountDetail().getCumulativeDiscountId()) 
							||(!StringUtils.isEmpty(itemDiscount.getDiscountDetail().getCumulativeDiscountId())&& itemDiscount.getDiscountDetail().getDiscountType().equals(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name())))
							&& StringUtils.isEmpty(itemDiscount.getDiscountDetail().getLinkedDiscountId())) {

						// Apply the eligible order discount to items invoked in cash memo
						createOrderToCmDiscountDetails(salesTxnDao, cashMemoDetailsDao, itemDiscount,
								discountDetailsList, discountItemList, discountConfigList);

					} else if (!StringUtils.isEmpty(itemDiscount.getDiscountDetail().getCumulativeDiscountId())) {

						log.info(itemDiscount.getItemId());
						Set<String> itemsToConsider = new HashSet<>();
						if (!newHashMapforCumDiscountItems.isEmpty() && newHashMapforCumDiscountItems
								.containsKey(itemDiscount.getDiscountDetail().getCumulativeDiscountId())) {
							itemsToConsider.addAll(newHashMapforCumDiscountItems
									.get(itemDiscount.getDiscountDetail().getCumulativeDiscountId()));
						}
						itemsToConsider.addAll(excludeItems);
						applicableCumulativeItemDiscounts = validateAndApplyOrderCumulativeDiscount(salesTxnDao,
								cashMemoDetailsDao, discountDetailsList, discountItemList, itemDiscount,
								discountConfigList, itemsToConsider);

					} else if (!StringUtils.isEmpty(itemDiscount.getDiscountDetail().getLinkedDiscountId())) {

					}

				}

				// Method to validate and Save applicable discount to Cash Memo
				validateAndSaveApplicableDiscountToCm(salesTxnDao, cashMemoDetailsDao, itemDiscountsApplied,
						discountDetailsList, discountItemList, applicableCumulativeItemDiscounts, discountConfigList);
			}

		}

		cashMemoDetailsRepository.saveAll(cashMemoDetailsDaoList);

	}

	// Method to Carry & apply order item discount to same item in cash memo
	private void createOrderToCmDiscountDetails(SalesTxnDaoExt salesTxnDao, CashMemoDetailsDaoExt cashMemoDetailsDao,
			DiscountItemDetailsDaoExt appliedItemDiscount, List<DiscountDetailsDaoExt> discountDetailsList,
			List<DiscountItemDetailsDaoExt> discountItemList, List<DiscountConfigDetailsDaoExt> discountConfigList) {
		DiscountDetailsDaoExt discountDetails = MapperUtil.mapObjToClass(appliedItemDiscount.getDiscountDetail(),
				DiscountDetailsDaoExt.class);

		if (discountDetails.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())) {
			List<String> cmItemIds = new ArrayList<String>();
			List<DiscountItemDetailsDaoExt> applicableCumulativeItemDiscounts = null;
			if (!StringUtils.isEmpty(discountDetails.getCumulativeDiscountId()))
				applicableCumulativeItemDiscounts = discountItemDetailsRepository
						.findAllByDiscountDetailSalesTxnAndDiscountDetailCumulativeDiscountIdIn(salesTxnDao,
								List.of(discountDetails.getCumulativeDiscountId()));
			CashMemoDetailsDaoExt cmDetails = new CashMemoDetailsDaoExt();
			if ((!StringUtils.isEmpty(applicableCumulativeItemDiscounts))
					&& applicableCumulativeItemDiscounts.size() == 1) {
				// fetch by item id instead of item code - to do
				cmDetails = cashMemoDetailsRepository.findByCashMemoDaoIdAndItemCode(salesTxnDao.getId(),
						applicableCumulativeItemDiscounts.get(0).getItemCode());
				if (cmDetails != null)
					cmItemIds.add(cmDetails.getId());
			}
			cmItemIds.add(cashMemoDetailsDao.getId());
			log.info("Cash memo details Dao - {}", cashMemoDetailsDao);

			AbCoSlabDiscountRequestDto orderToCmDiscountRequestDto = discountUtilService
					.getOrderToCmCumulativeDiscountRequestDto(salesTxnDao, cmItemIds, appliedItemDiscount);

			log.info("Discount: Order to CM calculate discount request dto - {}",
					MapperUtil.getJsonString(orderToCmDiscountRequestDto));

			SlabBasedDiscountDetailsResponseDto slabBasedDiscountDetailsResponseDto = engineService
					.calculateAbCoDiscountValueForSlabBasedDiscounts(orderToCmDiscountRequestDto);

			log.info("Discount: Order to CM calculate discount response dto - {}",
					MapperUtil.getJsonString(slabBasedDiscountDetailsResponseDto));

			// To handle, if discount grace period expired or empty response from
			// engine api
			// Empty check added to handle invalid discount
			if (!StringUtils.isEmpty(slabBasedDiscountDetailsResponseDto)
					&& !CollectionUtils.isEmpty(slabBasedDiscountDetailsResponseDto.getItemDiscountDetails())) {

				SlabItemDetailsDto discountEngineResponse = null;
				SlabItemDetailsDto discountEngineResponse1 = null;

				for (SlabItemDetailsDto slabItemDetailsDto : slabBasedDiscountDetailsResponseDto
						.getItemDiscountDetails()) {
					if (slabItemDetailsDto.getItemCode().equals(appliedItemDiscount.getItemCode())) {
						discountEngineResponse = slabItemDetailsDto;
					} else if (slabItemDetailsDto.getItemCode()
							.equals(applicableCumulativeItemDiscounts.get(0).getItemCode())) {
						discountEngineResponse1 = slabItemDetailsDto;
					}
				}
				// SlabItemDetailsDto discountEngineResponse =
				// slabBasedDiscountDetailsResponseDto
				// .getItemDiscountDetails().get(0);

				if (discountEngineResponse != null
						&& slabBasedDiscountDetailsResponseDto.getDiscountConfigDetails() != null
						&& discountEngineResponse.getDiscountValueDetails() != null
						&& discountEngineResponse.getDiscountValue() != null) {
					// Map calculated discount details to common discountDetailsDto to create
					// discount
					DiscountDetailDto discountDetail = MapperUtil.mapObjToClass(
							slabBasedDiscountDetailsResponseDto.getDiscountConfigDetails(), DiscountDetailDto.class);
					discountDetail.setDiscountValue(discountEngineResponse.getDiscountValue());

					discountDetail.setDiscountValueDetails(new JsonData("DISCOUNT_VALUE_DETAILS",
							new DiscountValueDetailsObjectDto(discountEngineResponse.getDiscountValueDetails())));
					discountDetail.setIsEdited(appliedItemDiscount.getDiscountDetail().getIsEdited());

					String discountValueDetails = MapperUtil.getStringFromJson(
							new JsonData("DISCOUNT_VALUE_DETAILS", discountEngineResponse.getDiscountValueDetails()));
					DiscountConfigDetailsDaoExt discountConfig = (DiscountConfigDetailsDaoExt) MapperUtil
							.getObjectMapping(appliedItemDiscount.getDiscountDetail().getDiscountConfig(),
									new DiscountConfigDetailsDaoExt(), "id");
					discountConfig.setAppliedDiscountComponent(
							MapperUtil.getStringFromJson(slabBasedDiscountDetailsResponseDto.getDiscountConfigDetails()
									.getAppliedDiscountComponent()));
					discountConfig.setAppliedDiscountComponentType(slabBasedDiscountDetailsResponseDto
							.getDiscountConfigDetails().getAppliedDiscountComponentType());

					setDiscountDetails(discountDetail, salesTxnDao, discountValueDetails, discountConfig,
							cashMemoDetailsDao, discountDetailsList, discountItemList, discountConfigList,
							appliedItemDiscount);

				}

				if (discountEngineResponse1 != null
						&& slabBasedDiscountDetailsResponseDto.getDiscountConfigDetails() != null
						&& discountEngineResponse1.getDiscountValueDetails() != null
						&& discountEngineResponse1.getDiscountValue() != null) {
					applicableCumulativeItemDiscounts.get(0).getDiscountDetail()
							.setDiscountValue(discountEngineResponse1.getDiscountValue());
					;

					String discountValueDetails = MapperUtil.getStringFromJson(
							new JsonData("DISCOUNT_VALUE_DETAILS", discountEngineResponse1.getDiscountValueDetails()));
					applicableCumulativeItemDiscounts.get(0).getDiscountDetail()
							.setDiscountValueDetails(discountValueDetails);
					applicableCumulativeItemDiscounts.get(0).setDiscountValueDetails(discountValueDetails);
					cmDetails.setTotalDiscount(discountEngineResponse1.getDiscountValue());
				}

			}
		} else {
			RivaahGhsDiscountDto rivaahGhsDetails = null;
			if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()
					.equals(appliedItemDiscount.getDiscountDetail().getDiscountType())) {
				rivaahGhsDetails = MapperUtil.mapObjToClass(
						MapperUtil.mapObjToClass(appliedItemDiscount.getDiscountDetail().getDiscountValueDetails(),
								JsonData.class).getData(),
						RivaahGhsDiscountDto.class);
			}

			discountDetails.setClubbedDiscountId(appliedItemDiscount.getDiscountDetail().getClubbedDiscountId());
			discountDetails.setCumulativeDiscountId(appliedItemDiscount.getDiscountDetail().getCumulativeDiscountId());
			discountDetails.setLinkedDiscountId(appliedItemDiscount.getDiscountDetail().getLinkedDiscountId());
			log.info("Cash memo details Dao - {}", cashMemoDetailsDao);

			AbCoDiscountRequestDto orderToCmDiscountRequestDto = discountUtilService.createOrderToCmDiscountRequestDto(
					salesTxnDao, cashMemoDetailsDao.getId(), appliedItemDiscount, rivaahGhsDetails);

			log.info("Discount: Order to CM calculate discount request dto - {}",
					MapperUtil.getJsonString(orderToCmDiscountRequestDto));

			DiscountEngineResponseDto discountEngineResponseList = engineService
					.calculateAbDiscountValue(orderToCmDiscountRequestDto);

			log.info("Discount: Order to CM calculate discount response dto - {}",
					MapperUtil.getJsonString(discountEngineResponseList));

			if (!StringUtils.isEmpty(discountEngineResponseList)
					&& !CollectionUtils.isEmpty(discountEngineResponseList.getDiscountDetailsResponseDto())) {

				DiscountDetailsResponseDto discountEngineResponse = discountEngineResponseList
						.getDiscountDetailsResponseDto().get(0);

				if (discountEngineResponse != null && discountEngineResponse.getDiscountConfigDetails() != null
						&& discountEngineResponse.getDiscountValueDetails() != null
						&& discountEngineResponse.getDiscountValue() != null) {
					// Map calculated discount details to common discountDetailsDto to create
					// discount
					DiscountDetailDto discountDetail = MapperUtil
							.mapObjToClass(discountEngineResponse.getDiscountConfigDetails(), DiscountDetailDto.class);
					discountDetail.setDiscountValue(discountEngineResponse.getDiscountValue());

					discountDetail.setDiscountValueDetails(new JsonData("DISCOUNT_VALUE_DETAILS",
							new DiscountValueDetailsObjectDto(discountEngineResponse.getDiscountValueDetails())));
					discountDetail.setIsEdited(appliedItemDiscount.getDiscountDetail().getIsEdited());

					String discountValueDetails = MapperUtil.getStringFromJson(
							new JsonData("DISCOUNT_VALUE_DETAILS", discountEngineResponse.getDiscountValueDetails()));

					DiscountConfigDetailsDaoExt discountConfig = (DiscountConfigDetailsDaoExt) MapperUtil
							.getObjectMapping(appliedItemDiscount.getDiscountDetail().getDiscountConfig(),
									new DiscountConfigDetailsDaoExt(), "id");
					discountConfig.setAppliedDiscountComponent(MapperUtil.getStringFromJson(
							discountEngineResponse.getDiscountConfigDetails().getAppliedDiscountComponent()));
					discountConfig.setAppliedDiscountComponentType(
							discountEngineResponse.getDiscountConfigDetails().getAppliedDiscountComponentType());

					setDiscountDetails(discountDetail, salesTxnDao, discountValueDetails, discountConfig,
							cashMemoDetailsDao, discountDetailsList, discountItemList, discountConfigList,
							appliedItemDiscount);

				}

			}

		}

	}

	private void setDiscountDetails(DiscountDetailDto discountDetail, SalesTxnDaoExt salesTxnDao,
			String discountValueDetails, DiscountConfigDetailsDaoExt discountConfig,
			CashMemoDetailsDaoExt cashMemoDetailsDao, List<DiscountDetailsDaoExt> discountDetailsList,
			List<DiscountItemDetailsDaoExt> discountItemList, List<DiscountConfigDetailsDaoExt> discountConfigList,
			DiscountItemDetailsDaoExt appliedItemDiscount) {
		// TODO Auto-generated method stub
		// Create Discount details
		DiscountDetailsDaoExt discountDetailsDao = discountUtilService.createDiscountDetails(discountDetail,
				salesTxnDao, DiscountApplicableLevelEnum.ITEM_LEVEL.name(), null,
				DiscountSalesStatusEnum.CONFIRMED.name(), null);

		// for UI purpose
		if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountDetail.getDiscountType())) {
			discountDetailsDao.setDiscountValueDetails(discountValueDetails);
		}

		// Link AB discount config details for carry forwarded discount also
		discountDetailsDao.setDiscountConfig(discountConfig);

		// Set reference Id & type, if applicable
		discountDetailsDao.setReferenceId(appliedItemDiscount.getId());
		discountDetailsDao.setReferenceType(DiscountReferenceTypeEnum.ORDER_AB_DISCOUNT.name());

		discountDetailsDao.setClubbedDiscountId(appliedItemDiscount.getDiscountDetail().getClubbedDiscountId());
		discountDetailsDao.setCumulativeDiscountId(appliedItemDiscount.getDiscountDetail().getDiscountId());
		discountDetailsDao.setLinkedDiscountId(appliedItemDiscount.getDiscountDetail().getLinkedDiscountId());

		// Create Discount item details
		DiscountItemDetailsDaoExt discountItemDao = discountUtilService.getItemDiscountDetails(
				cashMemoDetailsDao.getId(), discountDetailsDao, null, discountDetail.getDiscountValueDetails());

		discountDetailsList.add(discountDetailsDao);

		discountItemList.add(discountItemDao);

		discountConfigList.add(discountConfig);

	}

	// Method to validate applicable cumulative discount from Order to CM
	private List<DiscountItemDetailsDaoExt> validateAndApplyOrderCumulativeDiscount(SalesTxnDaoExt salesTxnDao,
			CashMemoDetailsDaoExt cashMemoDetailsDao, List<DiscountDetailsDaoExt> discountDetailsList,
			List<DiscountItemDetailsDaoExt> discountItemList, DiscountItemDetailsDaoExt itemDiscount,
			List<DiscountConfigDetailsDaoExt> discountConfigList, Set<String> excludeItemsforCum) {
		List<DiscountItemDetailsDaoExt> applicableCumulativeItemDiscounts;
		List<DiscountItemDetailsDaoExt> applicableCumulativeItems = new ArrayList<>();
		log.info("Item Discount" + MapperUtil.getJsonString(itemDiscount));
		applicableCumulativeItemDiscounts = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailCumulativeDiscountIdIn(salesTxnDao,
						List.of(itemDiscount.getDiscountDetail().getCumulativeDiscountId()));

//		for (DiscountItemDetailsDaoExt discountItemDetailsDaoExt : applicableCumulativeItems) {
//			log.info(itemDiscount.getItemCode());
//			log.info(MapperUtil.getJsonString(discountItemDetailsDaoExt));
//		}
//		System.out.println(itemDiscount.getDiscountDetail());
//		if (CollectionUtils.isEmpty(applicableCumulativeItemDiscounts)
//				|| (!CollectionUtils.isEmpty(applicableCumulativeItemDiscounts)
//						&& applicableCumulativeItemDiscounts.size() == 1)) {
//			// Apply the eligible order discount to items invoked in cash memo
//			createOrderToCmDiscountDetails(salesTxnDao, cashMemoDetailsDao, itemDiscount, discountDetailsList,
//					discountItemList, discountConfigList);
//		} else {
		// Map calculated discount details to common discountDetailsDto to create
		// discount
		DiscountDetailsDaoExt de = itemDiscount.getDiscountDetail();
		DiscountDetailDto discountDetail = (DiscountDetailDto) MapperUtil.getDtoMapping(de, DiscountDetailDto.class);
		JsonData discountValueDetails = new JsonData("DISCOUNT_VALUE_DETAILS",
				MapperUtil.getJsonFromString(de.getDiscountValueDetails()));
		discountDetail.setDiscountValueDetails(discountValueDetails);
		// Link AB discount config details for carry forwarded discount also
		DiscountConfigDetailsDaoExt discountConfig = (DiscountConfigDetailsDaoExt) MapperUtil.getObjectMapping(
				itemDiscount.getDiscountDetail().getDiscountConfig(), new DiscountConfigDetailsDaoExt(), "id");

		SlabConfigDetails slabConfigDetails = MapperUtil
				.mapObjToClass(getJsonData(discountConfig.getSlabConfigDetails()).getData(), SlabConfigDetails.class);
		List<String> itemsToIgnore = new ArrayList<>();
		List<DiscountItemDetailsDaoExt> discountItemDetailsDaoList = new ArrayList<>();
		discountItemDetailsDaoList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnIdAndDiscountDetailDiscountId(salesTxnDao.getId(),
						discountDetail.getDiscountId());
		List<DiscountItemDetailsDaoExt> bestDealDiscountItemDetailsDaoList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailDiscountType(salesTxnDao,
						DiscountTypeEnum.BEST_DEAL_DISCOUNT.name());
		itemsToIgnore.add(itemDiscount.getItemId());
		if (!CollectionUtils.isEmpty(applicableCumulativeItemDiscounts)) {

			if (BooleanUtils.isTrue(slabConfigDetails.getIsSingle())) {

				applicableCumulativeItems = applicableCumulativeItemDiscounts.stream()
						.filter(discountItemDetailsDao -> discountItemDetailsDao.getProductGroupCode()
								.equalsIgnoreCase(itemDiscount.getProductGroupCode()))
						.collect(Collectors.toList());
			} else {
				// All kind of product group codes can be part of cumulative process
				applicableCumulativeItems.addAll(applicableCumulativeItemDiscounts);
			}

		}
		if (!CollectionUtils.isEmpty(discountItemDetailsDaoList)) {
			itemsToIgnore.addAll(discountItemDetailsDaoList.stream().map(DiscountItemDetailsDaoExt::getItemId)
					.collect(Collectors.toList()));
		}

		if (!CollectionUtils.isEmpty(bestDealDiscountItemDetailsDaoList)) {
			itemsToIgnore.addAll(bestDealDiscountItemDetailsDaoList.stream().map(DiscountItemDetailsDaoExt::getItemId)
					.collect(Collectors.toList()));
		}
		
		SlabBasedDiscountDetailsResponseDto slabDiscountsResponse = discountUtilService
				.applyCumulativeOrderToCmDiscounts(salesTxnDao, discountDetail, cashMemoDetailsDao.getId(),
						applicableCumulativeItems, itemDiscount.getDiscountDetail().getCumulativeDiscountId(),
						itemDiscount, excludeItemsforCum.stream().collect(Collectors.toList()));
		if (CollectionUtils.isEmpty(slabDiscountsResponse.getItemDiscountDetails())) {
			return applicableCumulativeItems;
		}

		// Create Discount details
		DiscountDetailsDaoExt discountDetailsDao = discountUtilService.createDiscountDetails(discountDetail,
				salesTxnDao, DiscountApplicableLevelEnum.ITEM_LEVEL.name(), null,
				DiscountSalesStatusEnum.CONFIRMED.name(), null);

		discountConfig.setAppliedDiscountComponent(MapperUtil
				.getStringFromJson(slabDiscountsResponse.getDiscountConfigDetails().getAppliedDiscountComponent()));
		discountConfig.setAppliedDiscountComponentType(
				slabDiscountsResponse.getDiscountConfigDetails().getAppliedDiscountComponentType());

		discountDetailsDao.setDiscountConfig(discountConfig);

		// Set reference Id & type, if applicable
		discountDetailsDao.setReferenceId(itemDiscount.getId());
		discountDetailsDao.setReferenceType(DiscountReferenceTypeEnum.ORDER_AB_DISCOUNT.name());

		discountDetailsDao.setClubbedDiscountId(itemDiscount.getDiscountDetail().getClubbedDiscountId());

		// Create Discount item details
		DiscountItemDetailsDaoExt discountItemDao = discountUtilService.getItemDiscountDetails(
				cashMemoDetailsDao.getId(), discountDetailsDao, null, discountDetail.getDiscountValueDetails());

		// Create Discount entry for current item
		discountDetailsList.add(discountDetailsDao);

		discountItemList.add(discountItemDao);

		discountConfigList.add(discountConfig);

//		}
		return applicableCumulativeItems;
	}

	private JsonData getJsonData(String configDetails) {
		JsonData jsonData = MapperUtil.mapObjToClass(configDetails, JsonData.class);
		return jsonData;
	}

	@Transactional
	public void validateAndSaveApplicableDiscountToCm(SalesTxnDaoExt salesTxnDao,
			CashMemoDetailsDaoExt cashMemoDetailsDao, List<DiscountItemDetailsDaoExt> itemDiscountsApplied,
			List<DiscountDetailsDaoExt> discountDetailsList, List<DiscountItemDetailsDaoExt> discountItemList,
			List<DiscountItemDetailsDaoExt> applicableCumulativeItemDiscounts,
			List<DiscountConfigDetailsDaoExt> discountConfigList) {
		if (itemDiscountsApplied.size() == discountItemList.size() && !CollectionUtils.isEmpty(discountDetailsList)
				&& !CollectionUtils.isEmpty(discountItemList)) {

			// Save discount details & item discount details
			discountConfigDetailsRepository.saveAll(discountConfigList);

			discountDetailsRepository.saveAll(discountDetailsList);

			discountItemDetailsRepository.saveAll(discountItemList);

			List<String> rivaahGhsDiscount = discountDetailsList.stream()
					.filter(dao -> DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(dao.getDiscountType()))
					.map(DiscountDetailsDaoExt::getDiscountType).collect(Collectors.toList());
			if (!CollectionUtil.isEmpty(rivaahGhsDiscount)) {
				DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxnDao);
				DiscountTransactionDetails discountTxnDetailsOfOrder = discountUtilService
						.getDiscountTxnDetails(salesTxnDao.getRefTxnId());
				discountTxnDetails.setRivaahGhsDiscountDetails(discountTxnDetailsOfOrder.getRivaahGhsDiscountDetails());
				salesTxnDao.setDiscountTxnDetails(MapperUtil
						.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
				salesTxnRepository.save(salesTxnDao);
			}

			// Set discount value back to Cash Memo Dao
			cashMemoDetailsDao.setTotalDiscount(discountItemList.stream()
					.map(DiscountItemDetailsDaoExt::getDiscountValue).reduce(BigDecimal.ZERO, BigDecimal::add));

			if (!CollectionUtils.isEmpty(applicableCumulativeItemDiscounts)) {
				// After discounts applied, update the impacted items discount
				Set<String> impactedItemIds = applicableCumulativeItemDiscounts.stream()
						.map(DiscountItemDetailsDaoExt::getItemId).collect(Collectors.toSet());
				impactedItemIds.add(cashMemoDetailsDao.getId());
				// Update Cumulative Discount values for all the items
				discountUtilService.updateTransactionSpecificItemDetails(salesTxnDao, impactedItemIds, true);
			} else {
				// individual item discount update apart from cumulative
				discountUtilService.updateTransactionSpecificItemDetails(salesTxnDao,
						Set.of(cashMemoDetailsDao.getId()), true);
			}

		}
	}

	@Override
	public void updateTotalAmountPaid(SalesTxnDaoExt salesTxnDao, BigDecimal amountToDeduct, String locationCode) {

		OrderDaoExt orderDao = orderRepository.findOneByIdAndSalesTxnLocationCode(salesTxnDao.getId(), locationCode);
		orderDao.setPaidValue(orderDao.getPaidValue().subtract(amountToDeduct));
		orderRepository.save(orderDao);

	}

	@Override
	@Transactional
	public void validateAndApplyOrderTransactionLevelDiscounts(SalesTxnDaoExt salesTxnDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsList) {
		List<DiscountDetailsDaoExt> orderDiscountDetails = discountDetailsRepository
				.findAllBySalesTxnIdAndApplicableLevel(salesTxnDao.getRefTxnId().getId(),
						DiscountApplicableLevelEnum.BILL_LEVEL.name());
		if (!CollectionUtils.isEmpty(orderDiscountDetails)) {
			orderDiscountDetails.forEach(orderBillDiscount -> {
				DiscountService discountService = discountFactory
						.getDiscountService(orderBillDiscount.getDiscountType());

				discountService.applyTransactionLevelDiscountFromOrderToCM(salesTxnDao, orderBillDiscount,
						orderBillDiscount.getDiscountType());
			});

			if (!CollectionUtils.isEmpty(cashMemoDetailsList)) {
				// Update the total discount value of each item(including apportioned value)
				discountUtilService.updateTransactionSpecificItemDetails(salesTxnDao,
						cashMemoDetailsList.stream().map(CashMemoDetailsDaoExt::getId).collect(Collectors.toSet()),
						true);
				cashMemoDetailsRepository.saveAll(cashMemoDetailsList);
			}
		}

	}

	@Override
	public Boolean checkIfFrozenOrder(SalesTxnDaoExt salesTxnDao) {
		OrderDaoExt orderDao = checkIfOrderExistsByOrderId(salesTxnDao.getId(), salesTxnDao.getTxnType(),
				salesTxnDao.getSubTxnType());
		return orderDao.getIsFrozenRate();

	}

	// Method to Calculate Min Payment value applicable for all scenarios of AB
	private void getMinPaymentForApplicableScenarios(OrderDetailsDaoExt orderDetailsDao,
			OrderPaymentConfigDetails orderPaymentConfigDetails) {
		OrderMinPaymentDto orderMinPaymentDetails = new OrderMinPaymentDto();
		if (!StringUtils.isEmpty(orderPaymentConfigDetails.getMetalRateNonFrozenPercent())) {
			orderMinPaymentDetails.setNonFrozenMinPayment(orderDetailsDao.getFinalValue()
					.multiply(orderPaymentConfigDetails.getMetalRateNonFrozenPercent().divide(BigDecimal.valueOf(100)))
					.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		}
		if (!StringUtils.isEmpty(orderPaymentConfigDetails.getMetalRateFrozenPercent())) {
			orderMinPaymentDetails.setFrozenMinPayment(orderDetailsDao.getFinalValue()
					.multiply(orderPaymentConfigDetails.getMetalRateFrozenPercent().divide(BigDecimal.valueOf(100)))
					.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		}
		if (!StringUtils.isEmpty(orderPaymentConfigDetails.getBestRatePercent())) {
			orderMinPaymentDetails.setBestRateMinPayment(orderDetailsDao.getFinalValue()
					.multiply(orderPaymentConfigDetails.getBestRatePercent().divide(BigDecimal.valueOf(100)))
					.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		}

		log.info("Min payment details - {}", orderMinPaymentDetails);

		orderDetailsDao.setMinPaymentDetails(
				MapperUtil.getStringFromJson(new JsonData("MIN_PAYMENT_DETAILS", orderMinPaymentDetails)));
	}

	@Override
	public BigDecimal getHoldTimeInMinutesForAb() {

		LocationAdvanceBookingDetailsDto locationAbDetails = getAbDetailsFromLocation();

		if (StringUtils.isEmpty(locationAbDetails.getAbHoldTime())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					"Configuration not present for 'abHoldTime' field under AB details for location: "
							+ CommonUtil.getLocationCode());
		}
		return locationAbDetails.getAbHoldTime();
	}
	
	@Override
	public BigDecimal getHoldTimeInMinutesForCo() {
		
		CustomerOrderDetails cODetails = getCoDetailsFromLocation();

		if (StringUtils.isEmpty(cODetails.getCoHoldTime())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_OF_CO_IS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_COM_008,"Configuration not present for 'coHoldTime' field under CO details for location: "
							+ CommonUtil.getLocationCode());
		}
		return cODetails.getCoHoldTime();
	}

	@Override
	public OrderDetailsConfigDaoExt getItemConfigByItem(OrderDetailsDaoExt orderDetailsDao) {
		OrderDetailsConfigDaoExt orderDetailsConfigDao = orderDetailsConfigRepositoryExt
				.findByOrderItem(orderDetailsDao);

		if (orderDetailsConfigDao == null) {

//			throw new ServiceException(
//					SalesConstants.INVALID_REQUEST
//							+ "Item config not present for current transaction. Please raise new "
//							+ orderDetailsDao.getOrder().getSalesTxn().getTxnType(),
//					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS, "Item config not found."));
			log.info("Item config not present for current transaction. Item id: {}", orderDetailsDao.getId());
		}

		return orderDetailsConfigDao;
	}


	public OrderDetailsDaoExt setOrderDetailsDaoAttributes(CustomerOrderDetailsDto cO,OrderDaoExt orderDao,PriceResponseDto price,TotalTaxAndTaxDetailsDto tax)
	{
		int count=1;
		OrderDetailsDaoExt orderDetailsDao = new OrderDetailsDaoExt();
		orderDetailsDao.setTotalDiscount(BigDecimal.ZERO);
		orderDetailsDao.setItemCode(cO.getItemCode());
		orderDetailsDao.setComOrderNumber(cO.getComOrderNumber());
		orderDetailsDao.setRequestType(cO.getRequestType());
		orderDetailsDao.setTotalQuantity(cO.getQuantity());
		orderDetailsDao.setOrderValue(cO.getOrderValue() == null ? BigDecimal.ZERO : cO.getOrderValue());
		orderDetailsDao.setIsAutoStn(cO.getAutostn());
		orderDetailsDao.setOrder(orderDao);
		orderDetailsDao.setLotNumber(cO.getLotNumber());
		orderDetailsDao.setEmployeeCode(cO.getRsoName());
		orderDetailsDao.setTotalWeight(price.getStdWeight());
		orderDetailsDao.setInventoryWeight(price.getStdWeight());
		orderDetailsDao.setProductCategoryCode(price.getProductCategoryCode());
		orderDetailsDao.setProductGroupCode(price.getProductGroupCode());
		orderDetailsDao.setItemInStock(Boolean.TRUE);
		orderDetailsDao.setStatus(TransactionStatusEnum.OPEN.name());
		orderDetailsDao.setRowId(count++);
		orderDetailsDao.setUnitValue(price.getFinalValue().divide(BigDecimal.valueOf(orderDetailsDao.getTotalQuantity()),
				DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		orderDetailsDao.setTotalValue(price.getFinalValue());
		orderDetailsDao.setPriceDetails(MapperUtil.getStringFromJson(price.getPriceDetails()));
		orderDetailsDao.setTotalTax(tax.getTotalTax());

		// final value = (total value + hallmark charges - (total discount + hallmark discount)) + total tax(includes hallmark tax also).
		orderDetailsDao.setFinalValue(tax.getFinalValue());
		orderDetailsDao.setTaxDetails(MapperUtil.getStringFromJson(tax.getTaxDetails()));
		orderDetailsDao.setMinDiscountPayment(BigDecimal.ZERO);
		orderDetailsDao.setGrossWeight(cO.getGrossWeight()==null?BigDecimal.ZERO:cO.getGrossWeight());
		orderDetailsDao.setOrderDate(cO.getComOrderDateTime());
		orderDetailsDao.setRequestedBy(cO.getRequestBy());
		orderDetailsDao.setRequestBtq(cO.getRequestBtq());

		//set min order payment
		calculateMinOrderValue(orderDetailsDao, orderDao.getSalesTxn().getTxnType(), null);
		
		//set Delivery Date
		if(Objects.isNull(cO.getDeliveryDateTime()))
		{
			//delivery date = Current business date+lead time from item_master 
			//ex : 14th sept 2022 + 10 day = 24th sept 2022
			ItemDao itemDao = itemRepository.findOneByItemCode(cO.getItemCode());
			BusinessDayDaoExt businessDay = businessDayServiceImpl.getBusinessDayInProgress(CommonUtil.getLocationCode());
			Calendar cal = Calendar.getInstance();
			cal.setTime(businessDay.getBusinessDate());
			cal.add(Calendar.DATE, itemDao.getLeadTime());
			orderDetailsDao.setDeliveryDate(cal.getTime());
		}
		else
		{
			//set date directly , given from COM
			orderDetailsDao.setDeliveryDate(cO.getDeliveryDateTime());
		}

		return orderDetailsDao;
	}

	private Map<String, Set<String>> getCmItemsForRespetiveAbIds(List<DiscountItemDetailsDaoExt> abCummDiscount,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList) {

		Map<String, Set<String>> newIdMap = new HashMap<>();

		// this logic will get the cumulative discount id and it's respective item id in
		// CM
		abCummDiscount.forEach(abItemDiscount -> {

			Set<String> cmItemId = cashMemoDetailsDaoList.stream()
					.filter(cmdetail -> cmdetail.getOrderItem() != null
							&& cmdetail.getOrderItem().getId().equals(abItemDiscount.getItemId()))
					.map(CashMemoDetailsDaoExt::getId).collect(Collectors.toSet());
			if (!CollectionUtils.isEmpty(cmItemId)) {
				Set<String> newCmSet;
				if (newIdMap.containsKey(abItemDiscount.getDiscountDetail().getCumulativeDiscountId())) {
					newCmSet = newIdMap.get(abItemDiscount.getDiscountDetail().getCumulativeDiscountId());
				} else {
					newCmSet = new HashSet<>();
				}
				newCmSet.addAll(cmItemId);
				newIdMap.put(abItemDiscount.getDiscountDetail().getCumulativeDiscountId(), newCmSet);
			}

		});

		return newIdMap;
	}

}
