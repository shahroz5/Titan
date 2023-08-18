/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.utils;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.titan.poss.config.dto.constants.DiscountDetailsTypeEnum;
import com.titan.poss.config.dto.request.json.CNRuleDetails;
import com.titan.poss.core.discount.dto.AbCoSlabDiscountRequestDto;
import com.titan.poss.core.discount.dto.CummulativeDiscountWithExcludeDto;
import com.titan.poss.core.discount.dto.DiscountApplicableForItemCheckRequestDto;
import com.titan.poss.core.discount.dto.DiscountAttributesDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelClubDetailsDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountCalRequestDto;
import com.titan.poss.core.discount.dto.DiscountCustDetails;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDto;
import com.titan.poss.core.discount.dto.DiscountEngineResponseDto;
import com.titan.poss.core.discount.dto.DiscountGrnConfigDetails;
import com.titan.poss.core.discount.dto.DiscountItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsListRequestDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsListResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsReqDto;
import com.titan.poss.core.discount.dto.DiscountItemsDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.DiscountValueDetails;
import com.titan.poss.core.discount.dto.EligibleDiscountAbItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsRequestDto;
import com.titan.poss.core.discount.dto.EncircleDiscountDto;
import com.titan.poss.core.discount.dto.ExcludeConfigDto;
import com.titan.poss.core.discount.dto.GepConfigDetailsRes;
import com.titan.poss.core.discount.dto.LinkDiscountDetailsDto;
import com.titan.poss.core.discount.dto.LocationOfferDetails;
import com.titan.poss.core.discount.dto.ProductCategoryDetails;
import com.titan.poss.core.discount.dto.ProductGroupDetails;
import com.titan.poss.core.discount.dto.RegularCategoryDetails;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.discount.dto.SlabBasedDiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.SlabBasedDiscountRequestDto;
import com.titan.poss.core.discount.dto.SlabConfigDetails;
import com.titan.poss.core.discount.dto.SlabDetails;
import com.titan.poss.core.discount.dto.SlabItemDetailsDto;
import com.titan.poss.core.discount.dto.TransactionDetailsDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.domain.constant.enums.DiscountComponentTypeEnum;
import com.titan.poss.core.dto.AbCoDiscountRequestDto;
import com.titan.poss.core.dto.BaseBasicCriteriaDetails;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.dto.DiscountApplicableForItemResponseDto;
import com.titan.poss.core.dto.DiscountDetailsConfigRequestDto;
import com.titan.poss.core.dto.GepConfigDetails;
import com.titan.poss.core.dto.GepOfferDetails;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TepConfigDetails;
import com.titan.poss.core.enums.CNType;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.DiscountConfigDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.DiscountValueDetailsObjectDto;
import com.titan.poss.sales.dto.ItemDiscountDetailsDto;
import com.titan.poss.sales.dto.ItemInvDetailsDto;
import com.titan.poss.sales.dto.SalesInvoiceDetailsDto;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.constants.DiscountReferenceTypeEnum;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.request.HallmarkGstRequestDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountConfigDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.FocSchemesRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OrderUtilService;
import com.titan.poss.sales.service.impl.discount.RivaahCardDiscountServiceImpl;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesDiscountUtilServiceImpl")
public class DiscountUtilServiceImpl implements DiscountUtilService {

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Autowired
	private OrderUtilService orderUtilService;

	@Autowired
	private DiscountConfigDetailsRepositoryExt discountConfigDetailsRepository;

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private FocSchemesRepositoryExt focSchemesRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private RivaahCardDiscountServiceImpl rivaahCardDiscountServiceImpl;

	public static final String FOR_DISCOUNT = "For discount code: ";

	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";

	private static final String ERR_CORE_003 = "ERR-CORE-003";

	@Override
	@Transactional
	public void apportionBillLevelDiscountsToApplicableItems(DiscountDetailsDaoExt discountDetails,
			SalesTxnDaoExt salesTxn, List<String> billDiscountEligibleItemIds,DiscountOtherDetailsDto discountOtherDetails) {

		// Step 1: Create common item DTO list to carry sales item details
		List<SalesItemDetailsDto> salesItemList = getTransactionSpecificItemDetails(salesTxn,
				billDiscountEligibleItemIds);

		// Step 2: Find all the item level discount details applied for same transaction
		List<DiscountItemDetailsDaoExt> discountItemDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndItemIdIn(salesTxn, billDiscountEligibleItemIds);

		Set<String> nonEligibleItemIdList = new HashSet<>();
		Set<String> nonClubableDiscountCodes = new HashSet<>();

		// Validate against the applied discounts of items
		if (!CollectionUtils.isEmpty(discountItemDetailsList)) {

			// Step 3: Validate the items discount are eligible to club with selected bill
			// level discount
			nonClubableDiscountCodes = validateEachItemDiscountsConfigAndGetNonEligibleItems(discountItemDetailsList,
					nonEligibleItemIdList, discountDetails.getDiscountType());

		}

		// Step 4: Get the Eligible sales item list by filtering out the non eligible
		// items and non eligible product groups
		getEligibleSalesItems(discountDetails, salesItemList, nonEligibleItemIdList, nonClubableDiscountCodes);

		// Step 5: Calculate the Apportioned value at each item level and create the
		// respective apportioned discount entries
		calculateApportionValueAndUpdateDiscountDetails(discountDetails, salesItemList,
				discountDetails.getDiscountValue(), null,discountOtherDetails);

		Set<String> apportionedItemIds = salesItemList.stream().map(SalesItemDetailsDto::getId)
				.collect(Collectors.toSet());

		// Step 6: Update the total discount value of each item(including apportioned
		// value)
		updateTransactionSpecificItemDetails(salesTxn, apportionedItemIds, false);
	}

	public void calculateApportionValueAndUpdateDiscountDetails(DiscountDetailsDaoExt discountDetails,
			List<SalesItemDetailsDto> eligibleSalesItemList, BigDecimal applicableDiscountValue,
			String applicableKaratageType,DiscountOtherDetailsDto discountOtherDetails) {

		// List to save the new apportioned bill discount for new eligible items added
		List<DiscountItemDetailsDaoExt> createdDiscountItemDetailsList = new ArrayList<>();

		// Sum up the total items value to calculate the each eligible item
		// value
		// contribution as percentage
		BigDecimal eligibleItemsTotalValue = eligibleSalesItemList.stream().map(SalesItemDetailsDto::getTotalValue)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		for (SalesItemDetailsDto salesItemDetail : eligibleSalesItemList) {

			// Calculate the each eligible item value contribution out of all eligible items
			// total value as percentage
			BigDecimal itemValuePercentage = salesItemDetail.getTotalValue()
					.divide(eligibleItemsTotalValue, MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100));
			// Apply bill level discount value on each items percentage, to get exact
			// apportioned value
			BigDecimal billDiscountApportionedValue = applicableDiscountValue.multiply(itemValuePercentage)
					.divide(BigDecimal.valueOf(100), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			// create new entry in item discount details with newly apportioned record.
			DiscountItemDetailsDaoExt newApportionedDiscountItemDetails = new DiscountItemDetailsDaoExt();
			newApportionedDiscountItemDetails.setItemId(salesItemDetail.getId());
			newApportionedDiscountItemDetails.setDiscountDetail(discountDetails);
			newApportionedDiscountItemDetails.setDiscountValue(billDiscountApportionedValue);
			newApportionedDiscountItemDetails.setPreDiscountValue(salesItemDetail.getTotalValue());
			newApportionedDiscountItemDetails.setApplicableKaratageType(applicableKaratageType);
			newApportionedDiscountItemDetails.setItemCode(salesItemDetail.getItemCode());
			newApportionedDiscountItemDetails.setLotNumber(salesItemDetail.getLotNumber());
			newApportionedDiscountItemDetails.setProductGroupCode(salesItemDetail.getProductGroupCode());
			// Pending: If bill level discounts need to consider minimum order payment %
			// from order config details of discount, to be updated.
			if (discountOtherDetails != null && discountOtherDetails.getMinPaymentPercent() != null)
				newApportionedDiscountItemDetails.setMinPaymentPercent(discountOtherDetails.getMinPaymentPercent());
			else
				newApportionedDiscountItemDetails.setMinPaymentPercent(BigDecimal.ZERO);
			createdDiscountItemDetailsList.add(newApportionedDiscountItemDetails);

		}

		log.info("Apportioned Item Discounts - {}", createdDiscountItemDetailsList);

		if (!CollectionUtils.isEmpty(createdDiscountItemDetailsList)) {
			discountDetailsRepository.save(discountDetails);
			discountItemDetailsRepository.saveAll(createdDiscountItemDetailsList);
		}

	}

	private List<SalesItemDetailsDto> getEligibleSalesItems(DiscountDetailsDaoExt discountDetails,
			List<SalesItemDetailsDto> salesItemList, Set<String> nonEligibleItemIdList,
			Set<String> nonClubableDiscountCodes) {
		List<SalesItemDetailsDto> itemsToBeRemoved = new ArrayList<>();
		Boolean isSingleItemNotEligible = false;
		if (!CollectionUtils.isEmpty(nonEligibleItemIdList)) {
			// Step 3: Filter only the eligible sales item details
			for(SalesItemDetailsDto salesItem : salesItemList) {
				if (nonEligibleItemIdList.contains(salesItem.getId())) {
					itemsToBeRemoved.add(salesItem);
					isSingleItemNotEligible = true;
				}
			}
		}
		salesItemList.removeAll(itemsToBeRemoved);

		log.info("Bill discount final eligible item id list :- {}", salesItemList);

		// If none of the items eligible for apportion, bill level discount should not
		// be allowed to add
		// NAP-11319 :: if single item is not eligible for clubbing
		if (isSingleItemNotEligible) {
			throw new ServiceException("{discountCode} cannot be clubbed with {invalidDiscountCodes}", "ERR-DISC-033",
					"Discount Code: " + discountDetails.getDiscountCode(),
					Map.of("discountCode", discountDetails.getDiscountCode(), "invalidDiscountCodes",
							StringUtil.convertSetToCommaSeparatedValue(nonClubableDiscountCodes)));
		}

		return salesItemList;
	}

	private Set<String> validateEachItemDiscountsConfigAndGetNonEligibleItems(
			List<DiscountItemDetailsDaoExt> discountItemDetailsList, Set<String> nonEligibleItemIdList,
			String discountType) {

		Set<String> nonClubableDiscountCodes = new HashSet<>();

		discountItemDetailsList.forEach(discountItemDetails -> {

			JsonData clubConfigsJson = MapperUtil.mapObjToClass(
					discountItemDetails.getDiscountDetail().getDiscountConfig().getClubbableConfigDetails(),
					JsonData.class);

			ClubbingConfigDetails clubConfigsDetails = MapperUtil.mapObjToClass(clubConfigsJson.getData(),
					ClubbingConfigDetails.class);

			log.info("Club Configurations : - {}", MapperUtil.getJsonString(clubConfigsDetails));

			// Validate each discounts eligible Club configs of all items w.r.t
			// discount type
			Boolean isClubApplicable = true;
			if (clubConfigsDetails != null && ((discountType
					.equalsIgnoreCase(DiscountTypeEnum.BILL_LEVEL_DISCOUNT.name())
					&& !BooleanUtils.isNotFalse(clubConfigsDetails.getIsBillLevelDiscount()))
					|| (discountType.equalsIgnoreCase(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name())
							&& !BooleanUtils.isNotFalse(clubConfigsDetails.getIsGHS()))
					|| (discountType.equalsIgnoreCase(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name())
							&& !BooleanUtils.isNotFalse(clubConfigsDetails.getIsDV()))
					|| (discountType.equalsIgnoreCase(DiscountTypeEnum.COIN_OFFER_DISCOUNT.name())
							&& !BooleanUtils.isNotFalse(clubConfigsDetails.getIsCoin()))
					|| ((discountType.equalsIgnoreCase(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())
							|| discountType.equalsIgnoreCase(DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name()))
							&& !BooleanUtils.isNotFalse(clubConfigsDetails.getIsExchangeOffer())))) {
				// If Eligibilty check w.r.t applied Bill level discount, validate isBillLevel
				// config of each discount of all items
				// If Eligibilty check w.r.t applied GHS discount, validate isGHS
				// config of each discount of all items
				// If Eligibilty check w.r.t applied DV discount, validate isDv
				// config of each discount of all items
				// If Eligibilty check w.r.t applied Coin Offer discount, validate isCoin
				// config of each discount of all items
				// Eligibilty check w.r.t applied Karat exchange Offer or GEP purity discount,
				// validate IsExchangeOffer config of each discount of all items
				isClubApplicable = false;
			}

			if (BooleanUtils.isFalse(isClubApplicable)) {
				// If any of the discount of a item not eligible to club means, add to non
				// eligible list.
				nonEligibleItemIdList.add(discountItemDetails.getItemId());
				nonClubableDiscountCodes.add(discountItemDetails.getDiscountDetail().getDiscountCode());
			}

		});

		log.info("Non ELigible Item Id's as per Club Configs :- {}", nonEligibleItemIdList);

		return nonClubableDiscountCodes;
	}

	@Override
	public List<SalesItemDetailsDto> getTransactionSpecificItemDetails(SalesTxnDaoExt salesTxn,
			List<String> itemIdList) {
		List<SalesItemDetailsDto> salesItemList = new ArrayList<>();

		log.info("Sales Transaction - {} and item id list - {}", salesTxn, itemIdList);

		if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.CM.name())) {

			List<CashMemoDetailsDaoExt> cashMemoDetailsList = new ArrayList<>();

			// Fetch all item details of a transaction
			if (CollectionUtils.isEmpty(itemIdList)) {
				cashMemoDetailsList = commonCashMemoService.getCashMemoDetailsByItemIdIfExists(salesTxn.getId(),
						itemIdList);
			} else {
				// To handle persistent Dao's
				cashMemoDetailsList = commonCashMemoService.findCashMemoDetailsByItemIdIfExists(salesTxn.getId(),
						itemIdList);
			}

			cashMemoDetailsList.forEach(cashMemoDetail -> {
				SalesItemDetailsDto salesItemDetailsDto = (SalesItemDetailsDto) MapperUtil
						.getObjectMapping(cashMemoDetail, new SalesItemDetailsDto());

				PriceDetailsDto priceDetails = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(cashMemoDetail.getPriceDetails()), PriceDetailsDto.class);
				salesItemDetailsDto.setPriceDetails(priceDetails);

				// Set wastgae percent & making charge per gram for eligibility check for
				// Non-ucp products
				if (!StringUtils.isEmpty(priceDetails) && BooleanUtils.isFalse(priceDetails.getIsUcp())) {
					salesItemDetailsDto.setComplexityPercent(priceDetails.getMakingChargeDetails().getWastagePct());
					salesItemDetailsDto
							.setMakingChargePerGram(priceDetails.getMakingChargeDetails().getMakingChargePgram());
				}

				if (!StringUtils.isEmpty(cashMemoDetail.getItemDetails())
						&& !StringUtils.isEmpty(cashMemoDetail.getInventoryId())) {
					getInventoryItemDetails(cashMemoDetail.getItemDetails(), cashMemoDetail.getInventoryId(),
							salesItemDetailsDto);
				}

				// Need reference Order item id during AB to CM discount flow
				if (!StringUtils.isEmpty(cashMemoDetail.getOrderItem())) {
					salesItemDetailsDto.setOrderItemId(cashMemoDetail.getOrderItem().getId());
				}

				salesItemList.add(salesItemDetailsDto);
			});
		} else if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.name())) {
			// Fetch all item details of a transaction
			List<OrderDetailsDaoExt> orderDetailsList = orderUtilService
					.getOrderDetailsByItemIdIfExists(salesTxn.getId(), itemIdList);

			orderDetailsList.forEach(orderDetail -> {
				SalesItemDetailsDto salesItemDetailsDto = (SalesItemDetailsDto) MapperUtil.getObjectMapping(orderDetail,
						new SalesItemDetailsDto());

				PriceDetailsDto priceDetails = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(orderDetail.getPriceDetails()), PriceDetailsDto.class);
				salesItemDetailsDto.setPriceDetails(priceDetails);

				// Set wastgae percent & making charge per gram for eligibility check for
				// Non-ucp products
				if (!StringUtils.isEmpty(priceDetails) && BooleanUtils.isFalse(priceDetails.getIsUcp())) {
					salesItemDetailsDto.setComplexityPercent(priceDetails.getMakingChargeDetails().getWastagePct());
					salesItemDetailsDto
							.setMakingChargePerGram(priceDetails.getMakingChargeDetails().getMakingChargePgram());
				}

				if (!StringUtils.isEmpty(orderDetail.getItemDetails())
						&& !StringUtils.isEmpty(orderDetail.getInventoryId())) {
					getInventoryItemDetails(orderDetail.getItemDetails(), orderDetail.getInventoryId(),
							salesItemDetailsDto);
				}
				salesItemList.add(salesItemDetailsDto);
			});

		}

		log.info("Sales Txn :- {} , Sales Item Details :- {}", salesTxn.getId(),
				MapperUtil.getJsonString(salesItemList));

		return salesItemList;
	}

	@Override
	@Transactional
	public synchronized void updateTransactionSpecificItemDetails(SalesTxnDaoExt salesTxn, Set<String> updatedItemIds,
			Boolean isPriceUpdate) {
		if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.CM.name())) {

			// Fetch all item details of a transaction
			List<CashMemoDetailsDaoExt> cashMemoDetailsList = cashMemoDetailsRepository.findByIdIn(updatedItemIds);

			if (!CollectionUtils.isEmpty(cashMemoDetailsList)) {

				updateCashMemoDiscountValue(isPriceUpdate, cashMemoDetailsList);
			}

		} else if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.name())) {

			// Fetch all item details of a transaction
			List<OrderDetailsDaoExt> orderDetailsList = orderDetailsRepository.findByIdIn(updatedItemIds);

			if (!CollectionUtils.isEmpty(orderDetailsList)) {

				updateOrderDiscountValue(isPriceUpdate, orderDetailsList);

			}
		}
	}

	@Override
	@Transactional
	public DiscountDetailsDaoExt calculateBillLevelDiscountOnUCPOfEachItemAndSumUp(
			DiscountDetailsDaoExt discountDetails, SalesTxnDaoExt salesTxn, List<String> billDiscountEligibleItemIds) {

		// Step 1: Create common item DTO list to carry sales item details
		List<SalesItemDetailsDto> salesItemList = getTransactionSpecificItemDetails(salesTxn,
				billDiscountEligibleItemIds);

		// Step 2: Find all the item level discount details applied for same transaction
		List<DiscountItemDetailsDaoExt> discountItemDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdIn(salesTxn,
						DiscountApplicableLevelEnum.ITEM_LEVEL.name(), billDiscountEligibleItemIds);

		Set<String> nonEligibleItemIdList = new HashSet<>();
		Set<String> nonClubableDiscountCodes = new HashSet<>();

		// Validate against the applied discounts of items
		if (!CollectionUtils.isEmpty(discountItemDetailsList)) {

			// Step 3: Validate the items discount are eligible to club with selected bill
			// level discount
			nonClubableDiscountCodes = validateEachItemDiscountsConfigAndGetNonEligibleItems(discountItemDetailsList,
					nonEligibleItemIdList, discountDetails.getDiscountType());

		}

		// Step 4: Get the Eligible sales item list by filtering out the non eligible
		// items and non eligible product groups,category & exclude themes
		getEligibleSalesItems(discountDetails, salesItemList, nonEligibleItemIdList, nonClubableDiscountCodes);

		// Step 5: Calculate the bill discount on UCP of each item and create the
		// respective bill item discount entries and sum up calculated bill
		// level discount.
		calculateBillDiscountOnItemUCPValueAndUpdateBillDiscountDetails(discountDetails, salesItemList);

		Set<String> apportionedItemIds = salesItemList.stream().map(SalesItemDetailsDto::getId)
				.collect(Collectors.toSet());

		// Step 6: Update the total discount value of each item(including calculated
		// value)
		updateTransactionSpecificItemDetails(salesTxn, apportionedItemIds, false);

		return discountDetails;

	}

	public void calculateBillDiscountOnItemUCPValueAndUpdateBillDiscountDetails(DiscountDetailsDaoExt discountDetails,
			List<SalesItemDetailsDto> eligibleSalesItemList) {

		// List to save the new apportined bill discount for new eligible items added
		List<DiscountItemDetailsDaoExt> createdDiscountItemDetailsList = new ArrayList<>();

		// Get UCP percentage applicable from discount config details or if edited from
		// UI input
		BigDecimal ucpPercentage = getUcpPercentageToBeApplied(
				discountDetails.getDiscountConfig().getBasicCriteriaDetails(), discountDetails);

		for (SalesItemDetailsDto salesItemDetail : eligibleSalesItemList) {

			// Apply bill level discount value on each items percentage, to get exact
			// apportioned value
			BigDecimal itemDiscountOnUcp = salesItemDetail.getTotalValue().multiply(ucpPercentage)
					.divide(BigDecimal.valueOf(100), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			// else create new entry in item discount details with newly apportioned record.
			DiscountItemDetailsDaoExt newApportionedDiscountItemDetails = new DiscountItemDetailsDaoExt();
			newApportionedDiscountItemDetails.setItemId(salesItemDetail.getId());
			newApportionedDiscountItemDetails.setDiscountDetail(discountDetails);
			newApportionedDiscountItemDetails.setDiscountValue(itemDiscountOnUcp);
			newApportionedDiscountItemDetails.setPreDiscountValue(salesItemDetail.getTotalValue());
			createdDiscountItemDetailsList.add(newApportionedDiscountItemDetails);

			// Sum up calculated discount at item level to bill discount
			discountDetails.setDiscountValue(discountDetails.getDiscountValue().add(itemDiscountOnUcp)
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));

		}

		if (!CollectionUtils.isEmpty(createdDiscountItemDetailsList)) {

			discountDetailsRepository.save(discountDetails);

			discountItemDetailsRepository.saveAll(createdDiscountItemDetailsList);
		}

	}

	@Override
	public DiscountDetailsDaoExt createDiscountDetails(DiscountDetailDto discountDetail, SalesTxnDaoExt salesTxn,
			String applicableLevel, DiscountOtherDetailsDto discountOtherDetails, String status,
			PaymentDetailsDaoExt refPaymentDetails) {

		DiscountDetailsDaoExt discountDetailsDao = (DiscountDetailsDaoExt) MapperUtil.getObjectMapping(discountDetail,
				new DiscountDetailsDaoExt());
		discountDetailsDao.setDiscountValue(
				discountDetail.getDiscountValue().setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		discountDetailsDao.setApplicableLevel(applicableLevel);
		discountDetailsDao.setSalesTxn(salesTxn);
		discountDetailsDao.setStatus(status);

		if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountDetail.getDiscountType())) {
			discountDetailsDao
					.setDiscountValueDetails(MapperUtil.getStringFromJson(discountDetail.getDiscountValueDetails()));
			discountDetailsDao.setRefPayment(refPaymentDetails);
		} else if (DiscountTypeEnum.SLAB_BASED_DISCOUNT.name().equals(discountDetail.getDiscountType())
				|| DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name().equals(discountDetail.getDiscountType())) {
			discountDetailsDao.setDiscountValueDetails(
					MapperUtil.getStringFromJson(discountDetail.getCummulativeDiscountWithExcludeDetails()));
		}

		return discountDetailsDao;
	}

	@Override
	@Transactional
	public DiscountConfigDetailsDaoExt saveDiscountConfigDetails(DiscountDetailsBaseDto discountConfigs) {

		// Discount configurations required for business validation
		DiscountConfigDetailsDaoExt discountConfigDao = (DiscountConfigDetailsDaoExt) MapperUtil
				.getObjectMapping(discountConfigs, new DiscountConfigDetailsDaoExt());
		discountConfigDao.setBasicCriteriaDetails(MapperUtil
				.getStringFromJson(new JsonData("BASIC_CRITERIA_DETAILS", discountConfigs.getBasicCriteriaDetails())));
		discountConfigDao.setClubbableConfigDetails(MapperUtil
				.getStringFromJson(new JsonData("CLUBBABLE_CONFIG_DETAILS", discountConfigs.getClubbingDetails())));
		discountConfigDao.setDiscountAttributes(MapperUtil.getStringFromJson(
				new JsonData("DISCOUNT_ATTRIBUTE_DETAILS", discountConfigs.getDiscountAttributes())));
		discountConfigDao.setOrderConfigDetails(MapperUtil
				.getStringFromJson(new JsonData("ORDER_CONFIG_DETAILS", discountConfigs.getOrderConfigDetails())));
		discountConfigDao.setLocationOfferDetails(MapperUtil
				.getStringFromJson(new JsonData("LOCATION_OFFER_DETAILS", discountConfigs.getLocationOfferDetails())));
		discountConfigDao.setLinkedDiscountDetails(MapperUtil
				.getStringFromJson(new JsonData("LINKED_DISCOUNT_DETAILS", discountConfigs.getLinkDiscountDetails())));
		discountConfigDao.setSlabConfigDetails(MapperUtil
				.getStringFromJson(new JsonData("SLAB_CONFIG_DETAILS", discountConfigs.getSlabConfigDetails())));
		discountConfigDao
				.setHighValueConfigDetails(MapperUtil.getStringFromJson(discountConfigs.getApplicableThemeDetails()));
		discountConfigDao.setTepConfigDetails(MapperUtil
				.getStringFromJson(new JsonData("TEP_CONFIG_DETAILS", discountConfigs.getTepConfigDetails())));
		discountConfigDao.setGrnConfigDetails(MapperUtil
				.getStringFromJson(new JsonData("GRN_CONFIG_DETAILS", discountConfigs.getGrnConfigDetails())));

		// Save the Applied discount component details to utilize during AB to CM
		// discount value calculations
		discountConfigDao.setAppliedDiscountComponent(
				MapperUtil.getStringFromJson(discountConfigs.getAppliedDiscountComponent()));
		discountConfigDao.setRegularDiscountComponent(
				MapperUtil.getStringFromJson(discountConfigs.getRegularDiscountComponent()));
		discountConfigDao
				.setSlabDiscountComponents(MapperUtil.getStringFromJson(discountConfigs.getSlabDiscountComponents()));
		discountConfigDao
				.setAppliedDiscountMaster(MapperUtil.getStringFromJson(discountConfigs.getAppliedDiscountMaster()));
		discountConfigDao.setAppliedDiscountComponentType(discountConfigs.getAppliedDiscountComponentType());

		// Config Details required to check eligibility of a item for discount
		discountConfigDao.setProductGroupDetails(MapperUtil.getStringFromJson(discountConfigs.getProductGroups()));
		discountConfigDao.setProductCategoryDetails(MapperUtil.getStringFromJson(discountConfigs.getProductCategory()));
		discountConfigDao.setExcludeConfigDetails(MapperUtil.getStringFromJson(discountConfigs.getExcludeConfigDto()));

		discountConfigDao.setGhsExcludeProductGroupDetails(
				MapperUtil.getStringFromJson(discountConfigs.getGhsExcludeProductGroupDetails()));

		return discountConfigDetailsRepository.save(discountConfigDao);
	}

	@Override
	public BigDecimal validateCommonBasicCriteriaConfigs(BaseBasicCriteriaDetails basicCriteriaConfigs,
			BigDecimal discountValue, Boolean isEdited, BigDecimal engineDiscountValue, String discountCode) {

		if (StringUtils.isEmpty(basicCriteriaConfigs)) {
			throw new ServiceException("Basic criteria Details not found for the discount code" + discountCode,
					SalesConstants.ERR_DISC_026, Map.of(SalesConstants.DISCOUNT_CONFIG, "Basic criteria Details",
							SalesConstants.DISCOUNT_CODE, discountCode));
		}

		// Validate isEdited configs, if discount value is edited.
		if (BooleanUtils.isTrue(isEdited)) {
			// Is Editable flag should be true in Discount config
			if (BooleanUtils.isFalse(basicCriteriaConfigs.getIsEditable())) {
				throw new ServiceException("Edit of Discount value is not allowed", "ERR-DISC-002",
						"Discount basic criteria:" + basicCriteriaConfigs + " For Discount code: " + discountCode);
			}
		} else {
			// If Not Edited, Passed discount value & Discount engine value should be same
			if (engineDiscountValue.compareTo(discountValue) != 0) {
				throw new ServiceException("Discount value mismatch", "ERR-DISC-003",
						"Discount details passed: " + discountValue + "And Value from Discount engine: "
								+ engineDiscountValue + " For Discount code: " + discountCode);
			}

		}

		log.info("Basic Criteria Config Details - {}", basicCriteriaConfigs);

		// Compare with max discount allowed, if calculated value is greater than max
		// value, throw error to get it matched/edited by the end user - Requirement Got
		// removed

		// pending: summing up each component discount from discountValueDetails and
		// compare with total discount
		// discount value need not to be removed in this case

		return discountValue;
	}

	@Override
	public void validateCommonEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {

		if (StringUtils.isEmpty(clubOfferConfigs)) {
			throw new ServiceException("Club offer details not found for the discount code" + discountCode,
					SalesConstants.ERR_DISC_026, Map.of(SalesConstants.DISCOUNT_CONFIG, "Club offer details",
							SalesConstants.DISCOUNT_CODE, discountCode));
		}

		// Validate club with Exchange offer,if applicable.
		// Both TRUE and NULL value means eligible for Club
		if (!BooleanUtils.isNotFalse(clubOfferConfigs.getIsExchangeOffer())) {
			// verify if Karatage Exchange discount applied in the transaction
			verifyIfKaratageExchangeDiscountAppliedInTransaction(salesTxn, discountCode);
		}

		// Validate club with FOC offer, if applicable.
		// Both TRUE and NULL value means eligible for Club
		if (!BooleanUtils.isNotFalse(clubOfferConfigs.getIsFOCOffer())) {
			// verify if FOC offer applied in the transaction
			verifyIfFOCOfferAppliedInTransaction(salesTxn, discountCode);
		}

		// Validate club with Discount voucher(DV), if applicable - apportion
		// logic will be applied

		// Validate club with CBO offer, if applicable.
		if (!BooleanUtils.isNotFalse(clubOfferConfigs.getIsCBOOffer())) {
			// Validate if CBO offer applied in the transaction,
			verifyIfCBOAppliedInTransaction(salesTxn, discountCode);

		}

		// Validate club with GHS account maturity, if applicable.
		if (!BooleanUtils.isNotFalse(clubOfferConfigs.getIsGHS())) {
			// Validate if GHS account has bonus/discount component
			verifyIfGHSAccountMaturity(salesTxn, discountCode);

		}

		// Validate club with RIVA JPP, if applicable.
		if (!BooleanUtils.isNotFalse(clubOfferConfigs.getIsRiva())) {
			// Validate if RIVA Discounts applied in the transaction
			verifyIfRIVADiscountAppliedInTransaction(salesTxn, discountCode);
		}

		// Validate club with Empower discount, if applicable.
		if (!BooleanUtils.isNotFalse(clubOfferConfigs.getIsEmpowerment())) {
			// Validate if Empower Discounts applied in the transaction,
			verifyIfEmpowerDiscountAppliedInTransaction(salesTxn, discountCode);
		}

		// Validate club with Coin offer discount,if applicable.
		// Both TRUE and NULL value means eligible for Club
		if (!BooleanUtils.isNotFalse(clubOfferConfigs.getIsCoin())) {
			// verify if Coin offer discount applied in the transaction
			verifyIfCoinOfferDiscountAppliedInTransaction(salesTxn, discountCode);
		}

		// Validate club with other bill level discount , if applicable - apportion
		// logic will be applied

	}

	// Method to verify If FOC offer applied in the transaction
	private void verifyIfFOCOfferAppliedInTransaction(SalesTxnDaoExt salesTxn, String discountCode) {
		// Validate, if any foc offer applied in the transaction
		Long focSchemesCount = focSchemesRepository.countBySalesTxnId(salesTxn.getId());
		if (focSchemesCount.compareTo(Long.valueOf(0)) > 0)
			throw new ServiceException("Discount can't be clubbed with FOC offer applied", "ERR-DISC-005",
					FOR_DISCOUNT + discountCode);
	}

	// Method to verify If CBO applied in the transaction
	private void verifyIfCBOAppliedInTransaction(SalesTxnDaoExt salesTxn, String discountCode) {
		// Validate, If CASHBACK payment added in the transaction
		Long cboPaymentCount = paymentDetailsRepository.countBySalesTxnDaoIdAndPaymentCodeAndStatusIn(salesTxn.getId(),
				PaymentCodeEnum.CASHBACK.name(),
				Set.of(PaymentStatusEnum.OPEN.name(), PaymentStatusEnum.COMPLETED.name()));

		if (cboPaymentCount.compareTo(Long.valueOf(0)) > 0) {
			throw new ServiceException("Discount can't be clubbed with Cash Back offer applied", "ERR-DISC-009",
					FOR_DISCOUNT + discountCode);
		}

	}

	// Method to verify If GHS account has bonus/discount component
	private void verifyIfGHSAccountMaturity(SalesTxnDaoExt salesTxn, String discountCode) {
		// Validate, If GHS account's bonus/discount component apportioned as GHS
		// discount in the transaction
		Long ghsDiscountCount = discountDetailsRepository.countBySalesTxnIdAndDiscountType(salesTxn.getId(),
				DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name());

		if (ghsDiscountCount.compareTo(Long.valueOf(0)) > 0) {
			throw new ServiceException("Discount can't be clubbed with the GHS maturity", "ERR-DISC-011",
					FOR_DISCOUNT + discountCode);
		}

	}

	// Method to verify If RIVA Discount applied in the transaction
	private void verifyIfRIVADiscountAppliedInTransaction(SalesTxnDaoExt salesTxn, String discountCode) {
		// RIVA Discounts applicable only in case of CATEGORY_DISCOUNT &
		// SLAB_BASED_DISCOUNT,HIGH_VALUE_DISCOUNT,ITEM_GROUP_LEVEL_DISCOUNT,BEST_DEAL_DISCOUNT,SYSTEM_DISCOUNT_GEP_PURITY
		List<DiscountDetailsDaoExt> discountDetailsList = discountDetailsRepository
				.findAllBySalesTxnIdAndDiscountTypeIn(salesTxn.getId(),
						Set.of(DiscountTypeEnum.CATEGORY_DISCOUNT.name(), DiscountTypeEnum.SLAB_BASED_DISCOUNT.name(),
								DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name(),
								DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT.name(),
								DiscountTypeEnum.BEST_DEAL_DISCOUNT.name(),
								DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name()));
		Boolean isRIVADiscountApplied = false;
		if (!CollectionUtils.isEmpty(discountDetailsList)) {
			for (DiscountDetailsDaoExt discountDetails : discountDetailsList) {
				JsonData discountAttributesJson = MapperUtil
						.mapObjToClass(discountDetails.getDiscountConfig().getDiscountAttributes(), JsonData.class);

				DiscountAttributesDto discountAttributesDto = MapperUtil.mapObjToClass(discountAttributesJson.getData(),
						DiscountAttributesDto.class);

				// Validate each discounts IS RIVA property
				if (BooleanUtils.isTrue(discountAttributesDto.getIsRiva())) {
					isRIVADiscountApplied = true;
				}

				if (isRIVADiscountApplied) {
					break;
				}

			}
		}

//		if (BooleanUtils.isTrue(isRIVADiscountApplied)) {
//			throw new ServiceException("Discount can't be clubbed with the applied RIVA Discount in the transaction",
//					"ERR-DISC-010", FOR_DISCOUNT + discountCode);
//
//		}

	}

	// Method to verify If Empower Discount applied in the transaction
	private void verifyIfEmpowerDiscountAppliedInTransaction(SalesTxnDaoExt salesTxn, String discountCode) {
		// validate, If Empower Discount applied in the transaction
		Long empowermentDiscountCount = discountDetailsRepository.countBySalesTxnIdAndDiscountTypeIn(salesTxn.getId(),
				Set.of(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name()));

		if (empowermentDiscountCount.compareTo(Long.valueOf(0)) > 0) {
			throw new ServiceException(
					discountCode + " can't be clubbed with " + DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name()
							+ " applied",
					SalesConstants.ERR_DISC_027, Map.of(SalesConstants.DISCOUNT_CODE, discountCode,
							SalesConstants.DISCOUNT_TYPE, DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name()));
		}

	}

	// Method to verify If karatage Exchange Discount applied in the transaction
	private void verifyIfKaratageExchangeDiscountAppliedInTransaction(SalesTxnDaoExt salesTxn, String discountCode) {
		// validate, If karatage Discount applied in the transaction
		List<DiscountDetailsDaoExt> appliedDiscounts =  discountDetailsRepository.findAllByDiscountTypeAndSalesTxnId(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name(),salesTxn.getId());

		Boolean isKaratDiscountGiven = false;
		if(!appliedDiscounts.isEmpty()) {
			for(DiscountDetailsDaoExt discount :appliedDiscounts) {
				if(discountCode.equalsIgnoreCase(discount.getDiscountCode())) {
					isKaratDiscountGiven = true;
					break;
				}
			}
			if(isKaratDiscountGiven) {
				Map<String, String> dynamicValues = new HashMap<>();
				dynamicValues.put("discountType", DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name());
				dynamicValues.put("discountCode", discountCode);
				throw new ServiceException(SalesConstants.DISCOUNT_ALREADY_APPLIED,SalesConstants.ERR_DISC_039, dynamicValues);
			}else {
				throw new ServiceException(
						discountCode + " can't be clubbed with " + DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name()
								+ " applied",
						SalesConstants.ERR_DISC_027, Map.of(SalesConstants.DISCOUNT_CODE, discountCode,
								SalesConstants.DISCOUNT_TYPE, DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name()));
			}
			
		}

		// GEP purity discount
		List<DiscountDetailsDaoExt> appliedGEPPurityDiscounts =  discountDetailsRepository.findAllByDiscountTypeAndSalesTxnId(DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name(),salesTxn.getId());

		Boolean isGEPPurityDiscountGiven = false;
		if(!appliedGEPPurityDiscounts.isEmpty()) {
			for(DiscountDetailsDaoExt discount :appliedGEPPurityDiscounts) {
				if(discountCode.equalsIgnoreCase(discount.getDiscountCode())) {
					isGEPPurityDiscountGiven = true;
					break;
				}
			}
			if(isGEPPurityDiscountGiven) {
				Map<String, String> dynamicValues = new HashMap<>();
				dynamicValues.put("discountType", DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name());
				dynamicValues.put("discountCode", discountCode);
				throw new ServiceException(SalesConstants.DISCOUNT_ALREADY_APPLIED,SalesConstants.ERR_DISC_039, dynamicValues);
			}else {
			throw new ServiceException(
					discountCode + " can't be clubbed with " + DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name()
							+ " applied",
					SalesConstants.ERR_DISC_027, Map.of(SalesConstants.DISCOUNT_CODE, discountCode,
							SalesConstants.DISCOUNT_TYPE, DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name()));
		}
		}
	}

	// Method to verify If Coin offer Discount applied in the transaction
	private void verifyIfCoinOfferDiscountAppliedInTransaction(SalesTxnDaoExt salesTxn, String discountCode) {
		// validate, If Coin offer Discount applied in the transaction
		Long coinOfferDiscountCount = discountDetailsRepository.countBySalesTxnIdAndDiscountTypeIn(salesTxn.getId(),
				Set.of(DiscountTypeEnum.COIN_OFFER_DISCOUNT.name()));

		if (coinOfferDiscountCount.compareTo(Long.valueOf(0)) > 0) {
			throw new ServiceException(
					discountCode + " can't be clubbed with " + DiscountTypeEnum.COIN_OFFER_DISCOUNT.name() + " applied",
					SalesConstants.ERR_DISC_027, Map.of(SalesConstants.DISCOUNT_CODE, discountCode,
							SalesConstants.DISCOUNT_TYPE, DiscountTypeEnum.COIN_OFFER_DISCOUNT.name()));
		}

	}

	/**
	 * Method to Fetch UCP percentage or value from basic criteria
	 * 
	 * @param basicCriteriaDetails
	 * @return
	 */
	private BigDecimal getUcpPercentageToBeApplied(String basicCriteriaDetails,
			DiscountDetailsDaoExt discountDetailsDao) {

		BigDecimal ucpPercentage = BigDecimal.ZERO;
		if (BooleanUtils.isTrue(discountDetailsDao.getIsEdited())) {
			DiscountValueDetailsObjectDto discountValueDetailsObjectDto = getDiscountValueDetailsObject(
					discountDetailsDao.getDiscountValueDetails());
			for (DiscountValueDetails discountValueComponent : discountValueDetailsObjectDto
					.getDiscountValueDetails()) {
				if (discountValueComponent.getComponent()
						.equalsIgnoreCase(DiscountComponentTypeEnum.BILL_DISCOUNT.name())) {
					ucpPercentage = discountValueComponent.getDiscountPercent();
					break;
				}
			}
		} else {

			log.info("Basic criteria details String - {}", basicCriteriaDetails);

			JsonData basicCriteriaJson = MapperUtil.mapObjToClass(basicCriteriaDetails, JsonData.class);

			log.info("Discount basic criteria config details json - {}", basicCriteriaJson);

			BaseBasicCriteriaDetails baseBasicCriteriaDetails = MapperUtil.mapObjToClass(basicCriteriaJson.getData(),
					BaseBasicCriteriaDetails.class);

			log.info("Discount basic criteria config details - {}", baseBasicCriteriaDetails);

			ucpPercentage = baseBasicCriteriaDetails.getUcpValue();

		}

		return ucpPercentage;

	}

	public BigDecimal sumUpItemTotalDiscount(String itemId, String salesTxnId) {

		BigDecimal totalDiscount = BigDecimal.ZERO;

		List<DiscountItemDetailsDaoExt> discountItemDetails = discountItemDetailsRepository
				.findAllByItemIdAndDiscountDetailSalesTxnId(itemId, salesTxnId);
		if (!CollectionUtils.isEmpty(discountItemDetails)) {

			totalDiscount = discountItemDetails.stream().map(DiscountItemDetailsDaoExt::getDiscountValue)
					.reduce(BigDecimal.ZERO, BigDecimal::add);
		}

		return totalDiscount.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);
	}

	public void updateCashMemoDiscountValue(Boolean isPriceUpdate, List<CashMemoDetailsDaoExt> cashMemoDetailsList) {
		List<CashMemoDetailsDaoExt> updatedCashMemoDetailsList = new ArrayList<>();

		for (CashMemoDetailsDaoExt cashMemoDetail : cashMemoDetailsList) {

			BigDecimal totalDiscount = sumUpItemTotalDiscount(cashMemoDetail.getId(),
					cashMemoDetail.getCashMemoDao().getId());

			// Item discount Value should not exceed items total value
			if (totalDiscount.compareTo(cashMemoDetail.getTotalValue()) >= 0) {
				throw new ServiceException(SalesConstants.DISCOUNT_EXCEEDS_ITEM_VALUE_FOR_SOME_ITEMS,
						SalesConstants.ERR_DISC_032,
						"Discount exceeds item value for item code - " + cashMemoDetail.getItemCode()
								+ ", total item value - " + cashMemoDetail.getTotalValue() + ", total discount "
								+ totalDiscount);
			}

			// Sum up item level discounts and update back to cash memo details table
			cashMemoDetail.setTotalDiscount(totalDiscount);
			// Update final value of item w.r.t updated discount value
			// Re calculate tax after discount applied
			PriceDetailsDto priceDetails = MapperUtil.mapObjToClass(cashMemoDetail.getPriceDetails(),
					PriceDetailsDto.class);
			HallmarkGstRequestDto hallmarkGstRequestDto = new HallmarkGstRequestDto(cashMemoDetail.getHallmarkCharges(),
					cashMemoDetail.getHallmarkDiscount(), priceDetails.getItemHallmarkDetails().getHallmarkGstPct());
			TotalTaxAndTaxDetailsDto totalTaxAndTaxDetailsDto = commonTransactionService.getTotalTaxDetails(
					cashMemoDetail.getCashMemoDao().getSalesTxnDao().getCustomerId(), cashMemoDetail.getItemCode(),
					cashMemoDetail.getTotalValue(), cashMemoDetail.getTotalDiscount(),
					TxnTaxTypeEnum.CUST_TRANSACTION_CM,
					MapperUtil.mapObjToClass(cashMemoDetail.getTaxDetails(), TaxCalculationResponseDto.class),
					hallmarkGstRequestDto);
			cashMemoDetail.setTotalTax(
					totalTaxAndTaxDetailsDto.getTotalTax().setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
			// map tax details to json.
			cashMemoDetail.setTaxDetails(MapperUtil.getStringFromJson(totalTaxAndTaxDetailsDto.getTaxDetails()));

			cashMemoDetail.setFinalValue(commonTransactionService.getItemFinalValue(cashMemoDetail.getTotalValue(),
					cashMemoDetail.getTotalDiscount(), cashMemoDetail.getTotalTax(),
					cashMemoDetail.getHallmarkCharges(), cashMemoDetail.getHallmarkDiscount()));
			updatedCashMemoDetailsList.add(cashMemoDetail);
		}
		cashMemoDetailsRepository.saveAll(updatedCashMemoDetailsList);

		// If Bulk price update, avoid header update for each item
		if (BooleanUtils.isFalse(isPriceUpdate))
			commonCashMemoService.updatedCashMemoHeader(cashMemoDetailsList.get(0).getCashMemoDao(), null);
	}

	public void updateOrderDiscountValue(Boolean isPriceUpdate, List<OrderDetailsDaoExt> orderDetailsList) {
		List<OrderDetailsDaoExt> updatedOrderDetailsList = new ArrayList<>();

		for (OrderDetailsDaoExt orderDetail : orderDetailsList) {

			BigDecimal totalDiscount = sumUpItemTotalDiscount(orderDetail.getId(), orderDetail.getOrder().getId());

			// Item discount Value should not exceed items total value
			if (totalDiscount.compareTo(orderDetail.getTotalValue()) >= 0) {
				throw new ServiceException(SalesConstants.DISCOUNT_EXCEEDS_ITEM_VALUE_FOR_SOME_ITEMS,
						SalesConstants.ERR_DISC_032,
						"Discount exceeds item value for item code - " + orderDetail.getItemCode()
								+ ", total item value - " + orderDetail.getTotalValue() + ", total discount "
								+ totalDiscount);
			}
			// Sum up item level discounts and update back to order details table
			orderDetail.setTotalDiscount(totalDiscount);

			// Update final value of item w.r.t updated discount value
			// Re calculate tax after discount applied
			PriceDetailsDto priceDetails = MapperUtil.mapObjToClass(orderDetail.getPriceDetails(),
					PriceDetailsDto.class);
			HallmarkGstRequestDto hallmarkGstRequestDto = new HallmarkGstRequestDto(orderDetail.getHallmarkCharges(),
					orderDetail.getHallmarkDiscount(), priceDetails.getItemHallmarkDetails().getHallmarkGstPct());
			TotalTaxAndTaxDetailsDto totalTaxAndTaxDetailsDto = commonTransactionService.getTotalTaxDetails(
					orderDetail.getOrder().getSalesTxn().getCustomerId(), orderDetail.getItemCode(),
					orderDetail.getTotalValue(), orderDetail.getTotalDiscount(),
					TxnTaxTypeEnum.CUST_TRANSACTION_ADV_BOOKING,
					MapperUtil.mapObjToClass(orderDetail.getTaxDetails(), TaxCalculationResponseDto.class),
					hallmarkGstRequestDto);

			orderDetail.setTotalTax(
					totalTaxAndTaxDetailsDto.getTotalTax().setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
			// map tax details to json.
			orderDetail.setTaxDetails(MapperUtil.getStringFromJson(totalTaxAndTaxDetailsDto.getTaxDetails()));

			orderDetail.setFinalValue(commonTransactionService.getItemFinalValue(orderDetail.getTotalValue(),
					orderDetail.getTotalDiscount(), orderDetail.getTotalTax(), orderDetail.getHallmarkCharges(),
					orderDetail.getHallmarkDiscount()));

			// Set Min Order payment required to avail the discount
			orderDetail.setMinDiscountPayment(getMinPaymentForDiscountEligibility(orderDetail.getId(),
					orderDetail.getOrder().getId(), orderDetail.getFinalValue()));

			// Re Calculate Min Order payment w.r.t Freezed rates
			orderUtilService.calculateMinOrderValue(orderDetail, orderDetail.getOrder().getSalesTxn().getTxnType(),
					false);

			updatedOrderDetailsList.add(orderDetail);
		}
		orderDetailsRepository.saveAll(updatedOrderDetailsList);

		// If Bulk price update, avoid header update for each item
		if (BooleanUtils.isFalse(isPriceUpdate))
			orderUtilService.updateOrderHeader(orderDetailsList.get(0).getOrder(), null);
	}

	@Override
	public DiscountCalRequestDto getDiscountEngineRequestDto(SalesTxnDaoExt salesTxn, String itemId,
			RivaahGhsDiscountDto rivaahGhsDetails,
			Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails) {

		DiscountCalRequestDto discountEngineRequestDto = new DiscountCalRequestDto();
		discountEngineRequestDto.setBusinessDate(
				CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));
		discountEngineRequestDto.setCummulativeDiscountWithExcludeDetails(cummulativeDiscountWithExcludeDetails);
		// Get Item Price details
		List<DiscountItemDetailsReqDto> discountItemDetailsReqDtoList = getDiscountItemDetailsRequestDto(salesTxn,
				List.of(itemId));

		discountEngineRequestDto.setItemDetails(discountItemDetailsReqDtoList.get(0));

		// Get customer details
		DiscountCustDetails discountCustDetails = getCustomerDetailsRequestDto(salesTxn);

		discountEngineRequestDto.setCustomerDetails(discountCustDetails);

		// Get Transaction details
		TransactionDetailsDto transactionDetails = getTransactionDetailsRequestDto(salesTxn);

		discountEngineRequestDto.setTransactionDetails(transactionDetails);

		// set RIVAAH GHS details
		discountEngineRequestDto.setEligibleRivaahGhsDetails(rivaahGhsDetails);

		return discountEngineRequestDto;

	}

	@Override
	public TransactionDetailsDto getTransactionDetailsRequestDto(SalesTxnDaoExt salesTxn) {
		TransactionDetailsDto transactionDetails = new TransactionDetailsDto();
		transactionDetails.setTransactionType(salesTxn.getTxnType());
		transactionDetails.setSubTransactionType(salesTxn.getSubTxnType());
		transactionDetails.setRefTxnType(salesTxn.getRefTxnType());

		if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.name())
				|| salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.CO.name())) {
			OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsById(salesTxn.getId());
			transactionDetails.setIsFrozenRate(orderDao.getIsFrozenRate());
		}

		log.info("Transaction Details - {}", transactionDetails);
		return transactionDetails;
	}

	@Override
	public DiscountCustDetails getCustomerDetailsRequestDto(SalesTxnDaoExt salesTxn) {

		DiscountCustDetails discountCustDetails = new DiscountCustDetails();

		if (salesTxn.getCustomerId() != null) {

			discountCustDetails = getCustomerDetailsForDiscount(salesTxn.getCustomerId());
		}

		log.info("Customer Details -  Discount Customer details: - {}", discountCustDetails);

		return discountCustDetails;
	}

	private DiscountCustDetails getCustomerDetailsForDiscount(Integer customerId) {
		DiscountCustDetails discountCustDetails;
		CustomerDetailsDto customerDetails = customerService.getCustomer(customerId);

		log.info("Customer Details - Customer master: - {}", customerDetails);

		discountCustDetails = (DiscountCustDetails) MapperUtil.getDtoMapping(customerDetails,
				DiscountCustDetails.class);
		return discountCustDetails;
	}

	@Override
	public List<DiscountItemDetailsReqDto> getDiscountItemDetailsRequestDto(SalesTxnDaoExt salesTxn,
			List<String> itemIds) {
		List<SalesItemDetailsDto> salesItemDetailsList = getTransactionSpecificItemDetails(salesTxn, itemIds);

		log.info("Discount Engine Request - Transaction specific Sales Item Details: - {}",
				MapperUtil.getJsonString(salesItemDetailsList));

		List<DiscountItemDetailsReqDto> discountItemDetailsReqDtoList = new ArrayList<>();

		salesItemDetailsList.forEach(salesItem -> {
			DiscountItemDetailsReqDto discountItemDetailsReqDto = (DiscountItemDetailsReqDto) MapperUtil
					.getDtoMapping(salesItem, DiscountItemDetailsReqDto.class);
			discountItemDetailsReqDto.setItemId(salesItem.getId());
			discountItemDetailsReqDtoList.add(discountItemDetailsReqDto);
		});

		log.info("Discount Engine Request - Item Details: - {}",
				MapperUtil.getJsonString(discountItemDetailsReqDtoList));
		return discountItemDetailsReqDtoList;
	}

	@Override
	public DiscountItemDetailsDaoExt getItemDiscountDetails(String itemId, DiscountDetailsDaoExt discountDetails,
			DiscountOtherDetailsDto discountOtherDetails, JsonData discountValueDetailsJson) {

		List<SalesItemDetailsDto> itemDetailsList = getTransactionSpecificItemDetails(discountDetails.getSalesTxn(),
				List.of(itemId));

		DiscountItemDetailsDaoExt discountItemDetail = new DiscountItemDetailsDaoExt();
		discountItemDetail.setDiscountDetail(discountDetails);
		discountItemDetail.setItemId(itemId);
		discountItemDetail.setDiscountValue(discountDetails.getDiscountValue());
		discountItemDetail.setPreDiscountValue(itemDetailsList.get(0).getTotalValue());
		discountItemDetail.setProductGroupCode(itemDetailsList.get(0).getProductGroupCode());
		discountItemDetail.setDiscountValueDetails(MapperUtil.getStringFromJson(discountValueDetailsJson));
		discountItemDetail.setItemCode(itemDetailsList.get(0).getItemCode());
		discountItemDetail.setLotNumber(itemDetailsList.get(0).getLotNumber());

		if (!StringUtils.isEmpty(discountOtherDetails))
			discountItemDetail.setMinPaymentPercent(discountOtherDetails.getMinPaymentPercent());

		return discountItemDetail;
	}

	@Override
	@Transactional
	public List<String> validateAndCreateBestDiscountForEligibleItems(SalesTxnDaoExt salesTxn,
			DiscountBillLevelResponseDto discountEligibleItemResponseDto,
			DiscountBillLevelCreateDto discountBillLevelCreateDto) {
		List<String> salesEligibleDiscountIds = new ArrayList<>();
		Set<String> eligibleItemIdSet = new HashSet<>();

		// Consider only the eligible discounts with applicable items list is non empty
		List<DiscountBillLevelItemDetailsDto> eligibleItemDiscountsList = discountEligibleItemResponseDto
				.getDiscountDetails().stream()
				.filter(eligibleDiscount -> !CollectionUtils.isEmpty(eligibleDiscount.getItemDetails()))
				.collect(Collectors.toList());

		// Validate against Club with other offers and remove the non eligible discount
		// objects
		for (DiscountBillLevelItemDetailsDto eligibleDiscount : eligibleItemDiscountsList) {
			DiscountDetailsBaseDto discountDetailsConfigs = engineService
					.getDiscountConfigDetails(eligibleDiscount.getDiscountId());

			log.info("Sales - Discount Config details Response body - {}",
					MapperUtil.getJsonString(discountDetailsConfigs));
			if (discountDetailsConfigs.getDiscountCode()
					.equals(discountBillLevelCreateDto.getDiscountDetails().get(0).getDiscountCode())) {
				if (discountDetailsConfigs.getDiscountType()
						.equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())) {
					// Empowerment discount limit validation
					Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

					BigDecimal empowermentDiscountGivenInAQuarter = discountDetailsRepository
							.getMaxDiscountForCurrentQuarter(CalendarUtils.getFirstDayOfQuarter(businessDate),
									CalendarUtils.getLastDayOfQuarter(businessDate),
									discountDetailsConfigs.getDiscountType(), salesTxn.getTxnType(),
									List.of(TransactionStatusEnum.OPEN.name(), TransactionStatusEnum.HOLD.name(),
											TransactionStatusEnum.CONFIRMED.name()),
									CommonUtil.getLocationCode());

					log.info("Max limit per Quarter - {} and Empowerment discount given so far - {}",
							discountDetailsConfigs.getLocationOfferDetails().getEmpowermentQuarterMaxDiscountValue(),
							empowermentDiscountGivenInAQuarter);

					// If given empowerment discount exceeds the limit per Quarter, throw the
					// exception.
					if (discountDetailsConfigs.getLocationOfferDetails() != null && (discountDetailsConfigs
							.getLocationOfferDetails().getEmpowermentQuarterMaxDiscountValue() == null
							|| (discountDetailsConfigs.getLocationOfferDetails()
									.getEmpowermentQuarterMaxDiscountValue() != null
									&& empowermentDiscountGivenInAQuarter.compareTo(discountDetailsConfigs
											.getLocationOfferDetails().getEmpowermentQuarterMaxDiscountValue()) > 0))) {
						throw new ServiceException("Empowerment discount exceeded the limit - Please contact the administrator",
								SalesConstants.ERR_CONFIG_151);
					}
				}
			}
			try {
				// Validate Eligible Club offer configs
				validateCommonEligibleClubOfferConfigs(discountDetailsConfigs.getClubbingDetails(),
						eligibleDiscount.getDiscountCode(), salesTxn);
				salesEligibleDiscountIds.add(eligibleDiscount.getDiscountId());
				eligibleItemIdSet.addAll(eligibleDiscount.getItemDetails().stream().map(DiscountItemsDto::getItemId)
						.collect(Collectors.toSet()));

			} catch (ServiceException e) {
				log.info("Discount Not eligible to Club with Other offers -{}", e);
				eligibleItemDiscountsList.remove(eligibleDiscount);
				if (CollectionUtils.isEmpty(eligibleItemDiscountsList)) {
					break;
				}

			}
		}

		// checking eligible for club discounts
		List<DiscountBillLevelClubDetailsDto> eligibleClubDiscountDetails = new ArrayList<>();
		for (DiscountBillLevelClubDetailsDto discountBillLevel : discountEligibleItemResponseDto
				.getClubDiscountDetails()) {
			boolean valid = true;
			for (DiscountBillLevelItemDetailsDto discountBillLevelItem : discountBillLevel.getDiscountDetails()) {
				DiscountDetailsBaseDto discountDetailsConfigs = engineService
						.getDiscountConfigDetails(discountBillLevelItem.getDiscountId());

				log.info("Sales - Discount Config details Response body - {}",
						MapperUtil.getJsonString(discountDetailsConfigs));

				try {
					// Validate Eligible Club offer configs
					validateCommonEligibleClubOfferConfigs(discountDetailsConfigs.getClubbingDetails(),
							discountBillLevelItem.getDiscountCode(), salesTxn);
					eligibleItemIdSet.addAll(discountBillLevelItem.getItemDetails().stream()
							.map(DiscountItemsDto::getItemId).collect(Collectors.toSet()));
				} catch (ServiceException e) {
					valid = false;
					log.info("Discount Not eligible to Club with Other offers -{}", e);
					if (CollectionUtils.isEmpty(eligibleItemDiscountsList)) {
						break;
					}
				}
			}
			if (valid) {
				eligibleClubDiscountDetails.add(discountBillLevel);
			}
		}

		List<String> eligibleItemIds = eligibleItemIdSet.stream().collect(Collectors.toList());

		if (CollectionUtils.isEmpty(eligibleItemDiscountsList)) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "No Discount eligible to club with other offers",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "No Discount eligible to club with other offers"));
		}

		DiscountItemDetailsListRequestDto discountItemListRequestDto = new DiscountItemDetailsListRequestDto();
		discountItemListRequestDto.setBusinessDate(
				CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));
		discountItemListRequestDto.setCustomerDetails(getCustomerDetailsRequestDto(salesTxn));
		discountItemListRequestDto.setTransactionDetails(getTransactionDetailsRequestDto(salesTxn));
		discountItemListRequestDto.setItemDetails(getDiscountItemDetailsRequestDto(salesTxn, eligibleItemIds));
		discountItemListRequestDto.setClubDiscountDetails(eligibleClubDiscountDetails);
		discountItemListRequestDto.setDiscountIds(salesEligibleDiscountIds);

		discountItemListRequestDto.setEmployeeDetails(discountBillLevelCreateDto.getEmployeeDetails());
		discountItemListRequestDto.setEmpowermentDetails(discountBillLevelCreateDto.getEmpowermentDetails());
		discountItemListRequestDto.setTataEmployeeDetails(discountBillLevelCreateDto.getTataEmployeeDetails());
		discountItemListRequestDto.setTsssDetails(discountBillLevelCreateDto.getTsssDetails());
		discountItemListRequestDto.setRivaahGhsDetails(discountBillLevelCreateDto.getRivaahGhsDetails());
		discountItemListRequestDto.setEncircleDiscount(getEncircleDetails(salesTxn));
		log.info(
				"Sales - Calculate Best discount for eligible items with list of discounts applicable Request body - {}",
				MapperUtil.getJsonString(discountItemListRequestDto));
		DiscountItemDetailsListResponseDto discountItemDetailsList = engineService
				.calculateDiscountValueforListOfItems(discountItemListRequestDto);
		log.info(
				"Sales - Calculate Best discount for eligible items with list of discounts applicable Response body - {}",
				MapperUtil.getJsonString(discountItemDetailsList));

		List<DiscountDetailsDaoExt> discountDetailsList = new ArrayList<>();

		List<DiscountItemDetailsDaoExt> discountItemDetailsDaoList = new ArrayList<>();

		// Check if any item level discounts applied before for eligible items, if so
		// first delete them to apply new discount
		List<DiscountItemDetailsDaoExt> currentDiscountItemDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdIn(salesTxn,
						DiscountApplicableLevelEnum.ITEM_LEVEL.name(), eligibleItemIds);
		
		if (!CollectionUtils.isEmpty(currentDiscountItemDetailsList)) {

			// Delete dependent cumulative items discount as part of overriding discount of
			// current item
			verifyAndDeleteCumulativeItemDiscounts(salesTxn, currentDiscountItemDetailsList, true);

			deleteAllItemDiscountDetails(currentDiscountItemDetailsList);
			
			if(eligibleClubDiscountDetails.isEmpty())
			{
				//updating discount_txn_details in sales transaction
				DiscountTransactionDetails discountTxnDetails=getDiscountTxnDetails(salesTxn);
				String discountType=currentDiscountItemDetailsList.get(0).getDiscountDetail().getDiscountType();
				if(discountType.equals(DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.name()))
				{
					discountTxnDetails.setTataEmployeeDetails(null);
				}
				
				salesTxn.setDiscountTxnDetails(MapperUtil.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
				
			}

		}

		// if item list is empty, then no updates needed
		if (CollectionUtil.isEmpty(discountItemDetailsList.getItemDiscountDetails())) {
			return new ArrayList<>();
		}

		discountItemDetailsList.getItemDiscountDetails().forEach(itemDiscountDetails -> {

			DiscountOtherDetailsDto discountOtherDetails = new DiscountOtherDetailsDto();

			DiscountDetailsDaoExt discountDetailsDao = new DiscountDetailsDaoExt();

			// Add discount
			DiscountDetailDto discountDetailDto = (DiscountDetailDto) MapperUtil.getObjectMapping(itemDiscountDetails,
					new DiscountDetailDto());

			discountDetailDto.setDiscountValueDetails(new JsonData("DISCOUNT_VALUE_DETAILS",
					new DiscountValueDetailsObjectDto(itemDiscountDetails.getDiscountValueDetails())));

			discountDetailDto = (DiscountDetailDto) MapperUtil
					.getObjectMapping(itemDiscountDetails.getDiscountConfigDetails(), discountDetailDto);
			discountDetailDto.setIsAutoApplied(Boolean.FALSE);
			discountDetailDto.setIsEdited(Boolean.FALSE);
			discountDetailDto.setClubbedDiscountId(itemDiscountDetails.getClubDiscountId());
			// for UI purpose & payment purpose
			PaymentDetailsDaoExt refPaymentDetails = null;
			if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountDetailDto.getDiscountType())) {
				discountDetailDto.setDiscountValueDetails(
						new JsonData("DISCOUNT_VALUE_DETAILS", itemDiscountDetails.getRivaahGhsDetails()));
				refPaymentDetails = new PaymentDetailsDaoExt();
				refPaymentDetails.setId(itemDiscountDetails.getRivaahGhsDetails().getRefPaymentId());
			}
			// Create Discount details
			discountDetailsDao = createDiscountDetails(discountDetailDto, salesTxn,
					DiscountApplicableLevelEnum.ITEM_LEVEL.name(), discountOtherDetails,
					DiscountInitialStatusEnum.valueOf(discountDetailDto.getDiscountType()).getDiscountInitialStatus(),
					refPaymentDetails);

			// Save discount config details & Link to the discount applied
			discountDetailsDao
					.setDiscountConfig(saveDiscountConfigDetails(itemDiscountDetails.getDiscountConfigDetails()));

			discountDetailsList.add(discountDetailsDao);

			JsonData discountValueDetailsJson = null;
			if (itemDiscountDetails.getDiscountValueDetails() != null) {
				discountValueDetailsJson = new JsonData("DISCOUNT_VALUE_DETAILS",
						Map.of("discountValueDetails", itemDiscountDetails.getDiscountValueDetails()));
			}

			// Create Item level discount details
			discountItemDetailsDaoList.add(getItemDiscountDetails(itemDiscountDetails.getItemId(), discountDetailsDao,
					discountOtherDetails, discountValueDetailsJson));

		});

		discountDetailsRepository.saveAll(discountDetailsList);

		discountItemDetailsRepository.saveAll(discountItemDetailsDaoList);

		// Update CM/AB item details and header details with updated discount
		updateTransactionSpecificItemDetails(salesTxn, eligibleItemIdSet, false);

		return discountDetailsList.stream().map(DiscountDetailsDaoExt::getId).collect(Collectors.toList());
	}

	private EncircleDiscountDto getEncircleDetails(SalesTxnDaoExt salesTxn) {
		DiscountTransactionDetails discountTxn = getDiscountTxnDetails(salesTxn);
		if (discountTxn != null) {

			return discountTxn.getEncircleDetails();
		}
		return null;
	}

	@Override
	public DiscountBillLevelRequestDto getDiscountEligibleRequestDto(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {
		DiscountBillLevelRequestDto discountBillLevelRequestDto = new DiscountBillLevelRequestDto();
		discountBillLevelRequestDto.setBusinessDate(
				CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));
		discountBillLevelRequestDto
				.setDiscountType(discountBillLevelCreateDto.getDiscountDetails().get(0).getDiscountType());
		List<SalesItemDetailsDto> salesItemDtoList = getTransactionSpecificItemDetails(salesTxn, null);
		List<DiscountItemsDto> discountItemList = new ArrayList<>();
		salesItemDtoList.forEach(salesItem -> {
			DiscountItemsDto discountItemsDto = (DiscountItemsDto) MapperUtil.getObjectMapping(salesItem,
					new DiscountItemsDto());
			discountItemsDto.setItemId(salesItem.getId());
			discountItemList.add(discountItemsDto);
		});
		discountBillLevelRequestDto.setItemDetails(discountItemList);
		if (discountType.equalsIgnoreCase(DiscountTypeEnum.EMPLOYEE_DISCOUNT.name())) {
			discountBillLevelRequestDto.setEmployeeDetails(discountBillLevelCreateDto.getEmployeeDetails());
		} else if (discountType.equalsIgnoreCase(DiscountTypeEnum.TSSS_DISCOUNT.name())) {
			discountBillLevelRequestDto.setTsssDetails(discountBillLevelCreateDto.getTsssDetails());
		} else if (discountType.equalsIgnoreCase(DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.name())) {
			discountBillLevelRequestDto.setTataEmployeeDetails(discountBillLevelCreateDto.getTataEmployeeDetails());
		} else if (discountType.equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())) {
			discountBillLevelRequestDto.setEmpowermentDetails(discountBillLevelCreateDto.getEmpowermentDetails());
		} else if (discountType.equalsIgnoreCase(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name())) {
			discountBillLevelRequestDto.setRivaahGhsDetails(discountBillLevelCreateDto.getRivaahGhsDetails());
		}

		return discountBillLevelRequestDto;
	}

	@Override
	public List<DiscountDetailsDaoExt> checkIfDiscountDetailsExistsByDiscountType(String discountType,
			SalesTxnDaoExt salesTxn, String discountTxnId) {
		List<DiscountDetailsDaoExt> openDiscountDetailsList = discountDetailsRepository
				.findAllByDiscountTypeAndSalesTxnId(discountType, salesTxn.getId(), discountTxnId);

		if (CollectionUtils.isEmpty(openDiscountDetailsList)) {
			throw new ServiceException(
					"No item availed the discount applied :- " + discountType
							+ " , Please remove the respective discount details.",
					"ERR-DISC-024", Map.of("discountType", discountType));
		}

		return openDiscountDetailsList;

	}

	@Override
	public DiscountTransactionDetails getDiscountTxnDetails(SalesTxnDaoExt salesTxn) {

		DiscountTransactionDetails discountTxnDetails = new DiscountTransactionDetails();

		if (!StringUtils.isEmpty(salesTxn.getDiscountTxnDetails())) {
			JsonData discountTxnJsonData = MapperUtil.mapObjToClass(salesTxn.getDiscountTxnDetails(), JsonData.class);
			discountTxnDetails = MapperUtil.mapObjToClass(discountTxnJsonData.getData(),
					DiscountTransactionDetails.class);
		}

		log.info("discount transaction Details - {}", MapperUtil.getJsonString(discountTxnDetails));

		return discountTxnDetails;
	}

	@Override
	@Transactional
	public void reApportionBillLevelDiscountsToApplicableItems(DiscountDetailsDaoExt discountDetails,
			SalesTxnDaoExt salesTxn, List<DiscountItemDetailsDaoExt> apportionedItemDiscountDetails,
			Boolean isPriceUpdate) {

		List<String> apportionedItemsList = apportionedItemDiscountDetails.stream()
				.map(DiscountItemDetailsDaoExt::getItemId).collect(Collectors.toList());

		// Step 1: Create common item DTO list to carry sales item details
		List<SalesItemDetailsDto> salesItemList = getTransactionSpecificItemDetails(salesTxn, apportionedItemsList);

		// Step 2: Calculate the Apportioned value at each item level and update the
		// respective apportioned discount entries
		reeCalculateApportionValueAndUpdateDiscountDetails(discountDetails, salesItemList,
				apportionedItemDiscountDetails, discountDetails.getDiscountValue());

		Set<String> apportionedItemIdSet = apportionedItemsList.stream().collect(Collectors.toSet());

		// Step 3: Update the total discount value of each item(including apportioned
		// value)
		updateTransactionSpecificItemDetails(salesTxn, apportionedItemIdSet, isPriceUpdate);
	}

	@Transactional
	public void reeCalculateApportionValueAndUpdateDiscountDetails(DiscountDetailsDaoExt discountDetails,
			List<SalesItemDetailsDto> apportionedSalesItemList,
			List<DiscountItemDetailsDaoExt> apportionedItemDiscountDetails, BigDecimal applicableDiscountValue) {

		Map<String, DiscountItemDetailsDaoExt> apportionedItemDiscountMap = apportionedItemDiscountDetails.stream()
				.collect(Collectors.toMap(DiscountItemDetailsDaoExt::getItemId, Function.identity()));

		// Sum up the total items value to calculate the each eligible item
		// value
		// contribution as percentage
		BigDecimal eligibleItemsTotalValue = apportionedSalesItemList.stream().map(SalesItemDetailsDto::getTotalValue)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		if (!CollectionUtils.isEmpty(apportionedItemDiscountMap)) {

			for (SalesItemDetailsDto salesItemDetail : apportionedSalesItemList) {

				// Calculate the each eligible item value contribution out of all eligible items
				// total value as percentage
				BigDecimal itemValuePercentage = salesItemDetail.getTotalValue()
						.divide(eligibleItemsTotalValue, MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100));
				// Apply bill level discount value on each items percentage, to get exact
				// apportioned value
				// Pending: Round off as per sales implementation
				BigDecimal billDiscountApportionedValue = applicableDiscountValue.multiply(itemValuePercentage)
						.divide(BigDecimal.valueOf(100), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

				// create new entry in item discount details with newly apportioned record.
				if (apportionedItemDiscountMap.containsKey(salesItemDetail.getId())) {
					apportionedItemDiscountMap.get(salesItemDetail.getId())
							.setDiscountValue(billDiscountApportionedValue);
				}

			}

			log.info("Re Apportioned Item Discounts - {}", apportionedItemDiscountMap);

			discountItemDetailsRepository.saveAll(apportionedItemDiscountMap.values());

		}

	}

	@Override
	@Transactional
	public void reCalculateBillLevelDiscountOnUCPOfEachItemAndSumUp(DiscountDetailsDaoExt discountDetails,
			SalesTxnDaoExt salesTxn, List<DiscountItemDetailsDaoExt> apportionedItemDiscountDetails,
			Boolean isPriceUpdate) {

		List<String> apportionedItemsList = apportionedItemDiscountDetails.stream()
				.map(DiscountItemDetailsDaoExt::getItemId).collect(Collectors.toList());

		// Step 1: Create common item DTO list to carry sales item details
		List<SalesItemDetailsDto> apportionedSalesItemList = getTransactionSpecificItemDetails(salesTxn,
				apportionedItemsList);

		// Step 8: Calculate the bill discount on UCP of each item and
		// Update the respective bill item discount entries and sum up calculated bill
		// level discount.
		reCalculateBillDiscountOnItemUCPValueAndUpdateBillDiscountDetails(discountDetails, apportionedSalesItemList,
				apportionedItemDiscountDetails);

		Set<String> apportionedItemIdSet = apportionedItemsList.stream().collect(Collectors.toSet());

		// Step 9: Update the total discount value of each item(including calculated
		// value)
		updateTransactionSpecificItemDetails(salesTxn, apportionedItemIdSet, isPriceUpdate);

	}

	@Transactional
	public void reCalculateBillDiscountOnItemUCPValueAndUpdateBillDiscountDetails(DiscountDetailsDaoExt discountDetails,
			List<SalesItemDetailsDto> apportionedSalesItemList,
			List<DiscountItemDetailsDaoExt> apportionedItemDiscountDetails) {

		Map<String, DiscountItemDetailsDaoExt> apportionedItemDiscountMap = apportionedItemDiscountDetails.stream()
				.collect(Collectors.toMap(DiscountItemDetailsDaoExt::getItemId, Function.identity()));

		// Get UCP percentage applicable from discount config details or if edited from
		// UI input
		BigDecimal ucpPercentage = getUcpPercentageToBeApplied(
				discountDetails.getDiscountConfig().getBasicCriteriaDetails(), discountDetails);

		if (!CollectionUtils.isEmpty(apportionedItemDiscountMap)) {

			for (SalesItemDetailsDto salesItemDetail : apportionedSalesItemList) {

				// Apply bill level discount value on each items percentage, to get exact
				// apportioned value
				BigDecimal itemDiscountOnUcp = salesItemDetail.getTotalValue().multiply(ucpPercentage)
						.divide(BigDecimal.valueOf(100), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

				// If pre apportioned item, just update the apportioned value
				if (apportionedItemDiscountMap.containsKey(salesItemDetail.getId())) {
					apportionedItemDiscountMap.get(salesItemDetail.getId()).setDiscountValue(itemDiscountOnUcp);
				}

				// Sum up calculated discount at item level to bill discount
				discountDetails.setDiscountValue(discountDetails.getDiscountValue().add(itemDiscountOnUcp)
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));

			}

			discountDetailsRepository.save(discountDetails);

			discountItemDetailsRepository.saveAll(apportionedItemDiscountMap.values());
		}

	}

	@Override
	public DiscountDetailResponseDto getDiscountDetailsResponseDto(DiscountDetailsDaoExt discountDetail) {
		DiscountDetailResponseDto discountDetailResponseDto = (DiscountDetailResponseDto) MapperUtil
				.getDtoMapping(discountDetail, DiscountDetailResponseDto.class);
		// TBD: which discount id to be passed in response discount detail id or
		// discount item detail id?
		discountDetailResponseDto.setDiscountTxnId(discountDetail.getId());
		discountDetailResponseDto.setDiscountValueDetails(
				MapperUtil.mapObjToClass(discountDetail.getDiscountValueDetails(), JsonData.class));
		discountDetailResponseDto.setIsEdited(discountDetail.getIsEdited());
		discountDetailResponseDto.setBasicCriteriaDetails(
				MapperUtil.mapObjToClass(discountDetail.getDiscountConfig().getBasicCriteriaDetails(), JsonData.class));
		discountDetailResponseDto.setDiscountAttributes(
				MapperUtil.mapObjToClass(discountDetail.getDiscountConfig().getDiscountAttributes(), JsonData.class));

		if (discountDetail.getRefPayment() != null) {
			discountDetailResponseDto.setReferenceId(discountDetail.getRefPayment().getId());
		}

		return discountDetailResponseDto;
	}

	@Override
	public void checkSalesTranscationStatusForDiscount(String status, String txnType) {

		if (BooleanUtils.isFalse(SalesUtil.checkTranscationStatusForPayment(status, txnType))) {
			throw new ServiceException(SalesConstants.PLEASE_REFRESH_SCREEN_FOR_FURTHER_ACTIONS,
					SalesConstants.ERR_SALE_053);
		}
	}

	@Override
	public void checkIfBillLevelDiscountApplied(SalesTxnDaoExt salesTxn) {

		List<DiscountDetailsDaoExt> billLevelDiscountDetailsList = discountDetailsRepository
				.findAllBySalesTxnIdAndApplicableLevel(salesTxn.getId(), DiscountApplicableLevelEnum.BILL_LEVEL.name());

		// if bill level discount is carried from AB, then ignore it
		billLevelDiscountDetailsList = billLevelDiscountDetailsList.stream()
				.filter(discount -> StringUtils.isEmpty(discount.getReferenceId())).collect(Collectors.toList());

		if (CollectionUtils.isEmpty(billLevelDiscountDetailsList)) {
			return;
		}

		Set<String> paymentCodeOrDiscountSet = billLevelDiscountDetailsList.stream().map(discount -> {
			// if reference id is not checked, then discount payment of AB will be given in
			// error.
			if (discount.getRefPayment() != null && StringUtils.isEmpty(discount.getReferenceId())) {
				return PaymentCodeEnum.CREDIT_NOTE.getPaymentcode().equals(discount.getRefPayment().getPaymentCode())
						? discount.getRefPayment().getInstrumentType() + " " + discount.getRefPayment().getPaymentCode()
						: discount.getRefPayment().getPaymentCode();
			}
			return discount.getDiscountCode();
		}).collect(Collectors.toSet());

		throw new ServiceException(
				SalesConstants.ADD_OR_UPDATE_OF_ITEM_OR_DISCOUNT_NOT_ALLOWED_AS_BILL_DISCOUNT_APPLIED_PLEASE_REMOVE_PAYMENTCODE_OR_DISCOUNT_TO_PROCEED,
				SalesConstants.ERR_DISC_014, "Item cannot be updated when bill level discounts are added.",
				Map.of("paymentCodeOrDiscount", StringUtil.convertSetToCommaSeparatedValue(paymentCodeOrDiscountSet)));

	}

	@Override
	public void checkIfDVApplied(SalesTxnDaoExt salesTxn, String message, Boolean isPriceUpdate) {

		List<DiscountDetailsDaoExt> billLevelDiscountDetailsList = discountDetailsRepository
				.findAllBySalesTxnIdAndApplicableLevelAndDiscountType(salesTxn.getId(),
						DiscountApplicableLevelEnum.BILL_LEVEL.name(), DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name());

		if (!CollectionUtils.isEmpty(billLevelDiscountDetailsList)) {

			if (BooleanUtils.isTrue(isPriceUpdate)) {
				throw new ServiceException(
						SalesConstants.PLEASE_DELETE_FOLLOWING_DISCOUNTS_IF_ADDED_DYNAMIC_DISCOUNTS_TO_MAKE_PRICE_UPDATES,
						SalesConstants.ERR_DISC_034, message,
						Map.of("discountCodes", List.of(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name()).toString()));
			}

			throw new ServiceException(SalesConstants.INVALID_REQUEST, SalesConstants.ERR_SALE_294, message,
					Map.of(SalesConstants.REMARKS, message));
		}

	}

	@Override
	public Set<String> checkIfAnyAppliedDiscountsAreInOpenStatus(SalesTxnDaoExt salesTxn) {

		Set<String> openDiscountTypes = new HashSet<>();

		List<DiscountDetailsDaoExt> openDiscountDetailsList = discountDetailsRepository
				.findAllSalesTransactionDiscounts(salesTxn.getId(), null, null, DiscountSalesStatusEnum.OPEN.name());
		if (!CollectionUtils.isEmpty(openDiscountDetailsList)) {
			openDiscountTypes = openDiscountDetailsList.stream().map(DiscountDetailsDaoExt::getDiscountType)
					.collect(Collectors.toSet());
		}

		return openDiscountTypes;
	}

	@Override
	public Set<String> checkIfAnyCustomerDependentDiscountsApplied(SalesTxnDaoExt salesTxn,
			Integer newCustomerIdForUpdate) {

		Set<String> customerDependentDiscounts = new HashSet<>();
		DiscountCustDetails discountCustDetails = null;
		if (newCustomerIdForUpdate != null && newCustomerIdForUpdate != 0) {
			discountCustDetails = getCustomerDetailsForDiscount(newCustomerIdForUpdate);
		}

		List<DiscountDetailsDaoExt> discountsList = discountDetailsRepository.findAllBySalesTxnId(salesTxn.getId());
		if (!CollectionUtils.isEmpty(discountsList)) {

			for (DiscountDetailsDaoExt discountDetail : discountsList) {
				if (SalesConstants.CUSTOMER_DEPENDENT_DISCOUNTS.contains(discountDetail.getDiscountType())) {
					customerDependentDiscounts.add(discountDetail.getDiscountType());
				} else if (discountCustDetails != null && DiscountDetailsTypeEnum.PREVIEW.name()
						.equals(discountDetail.getDiscountConfig().getAppliedDiscountComponentType())) {
					// to remove 'PREVIEW' discount based on ULP creation of customer being updated
					DiscountDto discount = MapperUtil.mapObjToClass(
							discountDetail.getDiscountConfig().getAppliedDiscountMaster(), DiscountDto.class);
					if (checkEnrollmentDateForDiscount(discountCustDetails, discount)) {
						customerDependentDiscounts.add(discountDetail.getDiscountType());
					}

				}

			}

		}

		return customerDependentDiscounts;
	}

	private boolean checkEnrollmentDateForDiscount(DiscountCustDetails discountCustDetails, DiscountDto discount) {
		return discountCustDetails.getUlpId() == null || discountCustDetails.getEnrollmentDate() == null
				|| (discount.getUlpCreateDate() != null
						&& !(discountCustDetails.getEnrollmentDate().equals(discount.getUlpCreateDate())
								|| discountCustDetails.getEnrollmentDate().before(discount.getUlpCreateDate())));
	}

	// Method to get Mfg Date & Stock inward date of an item
	@Override
	public void getInventoryItemDetails(String itemDetails, String inventoryId,
			SalesItemDetailsDto salesItemDetailsDto) {
		JsonData itemDetailsJson = MapperUtil.mapObjToClass(itemDetails, JsonData.class);

		Map<String, Object> itemDetailsMap;
		try {
			itemDetailsMap = MapperUtil.getObjectMapperInstance().readValue(
					MapperUtil.getStringFromJson(itemDetailsJson.getData()), new TypeReference<Map<String, Object>>() {
					});
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003, e.getLocalizedMessage());
		}
		if (itemDetailsMap.containsKey(inventoryId) && itemDetailsMap.get(inventoryId) != null) {
			ItemInvDetailsDto itemInvDetailsDto = MapperUtil.mapObjToClass(itemDetailsMap.get(inventoryId),
					ItemInvDetailsDto.class);
			salesItemDetailsDto.setMfgDate(itemInvDetailsDto.getMfgDate());
			salesItemDetailsDto.setStockInwardDate(itemInvDetailsDto.getStockInwardDate());
		}

		log.info("Sales Item details with inventory details - {}", salesItemDetailsDto);
	}

	@Override
	public SalesInvoiceDetailsDto getTransactionSpecificInvoiceDetails(SalesTxnDaoExt salesTxn) {

		SalesInvoiceDetailsDto salesInvoiceDetailsDto = new SalesInvoiceDetailsDto();

		if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.CM.name())) {

			// Fetch cash memo details
			CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsById(salesTxn.getId());

			salesInvoiceDetailsDto = MapperUtil.mapObjToClass(cashMemoDao, SalesInvoiceDetailsDto.class);
		} else if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.name())) {
			// Fetch order details
			OrderDaoExt orderDao = orderUtilService.checkIfOrderExistsById(salesTxn.getId());

			salesInvoiceDetailsDto = MapperUtil.mapObjToClass(orderDao, SalesInvoiceDetailsDto.class);
		}

		log.info("Sales Txn :- {} , Sales Invoice Details :- {}", salesTxn.getId(),
				MapperUtil.getJsonString(salesInvoiceDetailsDto));

		return salesInvoiceDetailsDto;
	}

	@Override
	public EligibleDiscountItemsRequestDto getEligibleItemRequestBody(SalesTxnDaoExt salesTxn,
			DiscountBillLevelItemDetailsDto discountBillDetail) {
		EligibleDiscountItemsRequestDto eligibleDiscountItemsRequestDto = new EligibleDiscountItemsRequestDto();
		eligibleDiscountItemsRequestDto.setBusinessDate(
				CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));
		eligibleDiscountItemsRequestDto.setDiscountIds(List.of(discountBillDetail.getDiscountId()));
		List<SalesItemDetailsDto> salesItemDtoList = getTransactionSpecificItemDetails(salesTxn, null);

		List<DiscountItemsDto> discountItemList = new ArrayList<>();
		salesItemDtoList.forEach(salesItem -> {
			DiscountItemsDto discountItemsDto = (DiscountItemsDto) MapperUtil.getObjectMapping(salesItem,
					new DiscountItemsDto());
			discountItemsDto.setItemId(salesItem.getId());
			discountItemList.add(discountItemsDto);
		});
		eligibleDiscountItemsRequestDto.setItemDetails(discountItemList);

		log.info("Bill level applicable discount Eligible Item Request Dto - {}",
				MapperUtil.getJsonString(eligibleDiscountItemsRequestDto));

		return eligibleDiscountItemsRequestDto;
	}

	@Override
	public void validateMaxDiscountAllowed(BigDecimal discountValue, BigDecimal maxDiscountAlloweed,
			String discountCode) {
		if (maxDiscountAlloweed != null && discountValue.compareTo(maxDiscountAlloweed) > 0) {
			throw new ServiceException(
					"Calculated discount Exceeded Max discount allowed for discountCode: " + discountCode,
					"ERR-DISC-021", Map.of("discountCode", discountCode));
		}
	}

	@Override
	@Transactional
	public BigDecimal apportionKaratageDiscountsToApplicableItems(DiscountDetailsDaoExt discountDetails,
			SalesTxnDaoExt salesTxn, List<String> eligibleSalesItemIds, BigDecimal applicableDiscountValue,
			String applicableKaratageType, List<String> karatageEligibleItemIds,DiscountOtherDetailsDto discountOtherDetails) {

		// Step 1: Create common item DTO list to carry sales item details
		List<SalesItemDetailsDto> eligibleSalesItemList = getTransactionSpecificItemDetails(salesTxn,
				eligibleSalesItemIds);

		// Karatage specific eligible item details
		List<SalesItemDetailsDto> karatageEligibleItemList = getTransactionSpecificItemDetails(salesTxn,
				karatageEligibleItemIds);

		// Step 2: Find all the item level discount details applied for same transaction
		List<DiscountItemDetailsDaoExt> discountItemDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdIn(salesTxn,
						DiscountApplicableLevelEnum.ITEM_LEVEL.name(), karatageEligibleItemIds);

		Set<String> nonEligibleItemIdList = new HashSet<>();
		Set<String> nonClubableDiscountCodes = new HashSet<>();

		// Validate against the applied discounts of items
		if (!CollectionUtils.isEmpty(discountItemDetailsList)) {

			// Step 3: Validate the items discount are eligible to club with selected bill
			// level discount
			nonClubableDiscountCodes = validateEachItemDiscountsConfigAndGetNonEligibleItems(discountItemDetailsList,
					nonEligibleItemIdList, discountDetails.getDiscountType());

		}

		// Step 4: Get the Eligible sales item list by filtering out the non eligible
		// items and non eligible product groups
		getEligibleSalesItems(discountDetails, eligibleSalesItemList, nonEligibleItemIdList, nonClubableDiscountCodes);

		// Get eligible karatage specific item details
		getEligibleSalesItems(discountDetails, karatageEligibleItemList, nonEligibleItemIdList,
				nonClubableDiscountCodes);

		// Step 5: Calculate the Apportioned value at each item level and create the
		// respective apportioned discount entries
		BigDecimal appliedKaratageDiscountValue = calculateApportionValueAndUpdateKaratageDiscountDetails(
				discountDetails, eligibleSalesItemList, applicableDiscountValue, applicableKaratageType,
				karatageEligibleItemList,discountOtherDetails);

		Set<String> apportionedItemIds = karatageEligibleItemList.stream().map(SalesItemDetailsDto::getId)
				.collect(Collectors.toSet());

		// Step 6: Update the total discount value of each item(including apportioned
		// value)
		updateTransactionSpecificItemDetails(salesTxn, apportionedItemIds, false);

		return appliedKaratageDiscountValue;

	}

	@Override
	public DiscountValueDetailsObjectDto getDiscountValueDetailsObject(String discountValueDetails) {
		JsonData discountValueDetailsJson = MapperUtil.mapObjToClass(discountValueDetails, JsonData.class);

		return MapperUtil.mapObjToClass(discountValueDetailsJson.getData(), DiscountValueDetailsObjectDto.class);
	}

	@Override
	@Transactional
	public void reApportionKaratageDiscountsToApplicableItems(DiscountDetailsDaoExt discountDetails,
			SalesTxnDaoExt salesTxn, List<DiscountItemDetailsDaoExt> apportionedItemDiscountDetails,
			Boolean isPriceUpdate, BigDecimal applicableDiscountValue) {

		List<String> apportionedItemsList = apportionedItemDiscountDetails.stream()
				.map(DiscountItemDetailsDaoExt::getItemId).collect(Collectors.toList());

		// Step 1: Create common item DTO list to carry sales item details
		List<SalesItemDetailsDto> salesItemList = getTransactionSpecificItemDetails(salesTxn, apportionedItemsList);

		// Step 2: Calculate the Apportioned value at each item level and update the
		// respective apportioned discount entries
		reeCalculateApportionValueAndUpdateDiscountDetails(discountDetails, salesItemList,
				apportionedItemDiscountDetails, applicableDiscountValue);

		Set<String> apportionedItemIdSet = apportionedItemsList.stream().collect(Collectors.toSet());

		// Step 3: Update the total discount value of each item(including apportioned
		// value)
		updateTransactionSpecificItemDetails(salesTxn, apportionedItemIdSet, isPriceUpdate);
	}

	@Override
	public DiscountDetailsDaoExt createBillLevelDiscountDetails(DiscountBillLevelItemDetailsDto discountBillDetail,
			SalesTxnDaoExt salesTxn, String applicableLevel, String status, BigDecimal discountValue) {

		DiscountDetailsDaoExt discountDetailsDao = (DiscountDetailsDaoExt) MapperUtil
				.getObjectMapping(discountBillDetail, new DiscountDetailsDaoExt());
		discountDetailsDao.setApplicableLevel(applicableLevel);
		discountDetailsDao.setSalesTxn(salesTxn);
		discountDetailsDao.setStatus(status);
		discountDetailsDao.setDiscountValue(discountValue.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		discountDetailsDao
				.setDiscountValueDetails(MapperUtil.getStringFromJson(discountBillDetail.getDiscountValueDetails()));
		discountDetailsDao.setIsEdited(discountBillDetail.getIsEdited());

		return discountDetailsDao;
	}

	@Override
	public SlabBasedDiscountRequestDto getCumulativeDiscountRequestDto(SalesTxnDaoExt salesTxn, String currentItem,
			List<DiscountItemDetailsDaoExt> applicableCumulativeItems, List<String> itemsValidOrExclude) {

		List<String> cumulativeItemIds = new ArrayList<>();
		Boolean throwException = null;
		if (currentItem != null) {
			cumulativeItemIds.add(currentItem);// current item to which discount is being added.
		} else {
			// do not throw exception on delete of a slab discount and recalculation of
			// discount is happening for other items.
			throwException = false;
		}
		if (!CollectionUtil.isEmpty(itemsValidOrExclude)) {
			cumulativeItemIds.addAll(itemsValidOrExclude);
		}
		Map<String, Map<String, String>> itemIdAndDiscountInIt = new HashMap<>();
		if (!CollectionUtil.isEmpty(applicableCumulativeItems)) {
			Map<String, String> discountsApplied;
			for (DiscountItemDetailsDaoExt itemDiscount : applicableCumulativeItems) {
				cumulativeItemIds.add(itemDiscount.getItemId());
				if (itemIdAndDiscountInIt.containsKey(itemDiscount.getItemId())) {
					discountsApplied = itemIdAndDiscountInIt.get(itemDiscount.getItemId());
				} else {
					discountsApplied = new HashMap<>();
				}
				discountsApplied.put(itemDiscount.getDiscountDetail().getDiscountType(),
						itemDiscount.getDiscountDetail().getDiscountId());
				itemIdAndDiscountInIt.put(itemDiscount.getItemId(), discountsApplied);
			}
		}

		SlabBasedDiscountRequestDto cumulativeDiscountRequestDto = new SlabBasedDiscountRequestDto();
		cumulativeDiscountRequestDto.setBusinessDate(
				CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));
		cumulativeDiscountRequestDto.setThrowException(throwException);

		// Get Item Price details
		List<DiscountItemDetailsReqDto> discountItemDetailsReqDtoList = getDiscountItemDetailsRequestDto(salesTxn,
				cumulativeItemIds);
		// set details helpful for cumm. discount check
		for (DiscountItemDetailsReqDto discountItemDetailsReqDto : discountItemDetailsReqDtoList) {
			if (itemIdAndDiscountInIt.containsKey(discountItemDetailsReqDto.getItemId())) {
				discountItemDetailsReqDto.setDiscountTypeAndIdAppliedOnItem(
						itemIdAndDiscountInIt.get(discountItemDetailsReqDto.getItemId()));
			}
		}

		cumulativeDiscountRequestDto.setItemDetails(discountItemDetailsReqDtoList);

		// Get customer details
		DiscountCustDetails discountCustDetails = getCustomerDetailsRequestDto(salesTxn);

		cumulativeDiscountRequestDto.setCustomerDetails(discountCustDetails);

		// Get Transaction details
		TransactionDetailsDto transactionDetails = getTransactionDetailsRequestDto(salesTxn);

		cumulativeDiscountRequestDto.setTransactionDetails(transactionDetails);

		return cumulativeDiscountRequestDto;

	}

	@Override
	@Transactional
	public Boolean applyCumulativeDiscounts(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			String currentItem, List<DiscountItemDetailsDaoExt> applicableCumulativeItems, String cumulativeDiscountId,
			List<String> itemsValidOrExclude, DiscountOtherDetailsDto discountOtherDetails) {

		SlabBasedDiscountRequestDto cumulativeSlabDiscountRequestDto = getCumulativeDiscountRequestDto(salesTxn,
				currentItem, applicableCumulativeItems, itemsValidOrExclude);

		log.info("Calculate Cumulative discounts Request Dto - {}",
				MapperUtil.getJsonString(cumulativeSlabDiscountRequestDto));

		SlabBasedDiscountDetailsResponseDto slabDiscountsResponse = engineService
				.calculateDiscountValueForSlabBasedDiscounts(cumulativeDiscountId, cumulativeSlabDiscountRequestDto);

		log.info("Calculate Cumulative discounts Response Dto - {}", MapperUtil.getJsonString(slabDiscountsResponse));
		Boolean isDiscountApplicable = false;

		if (!CollectionUtils.isEmpty(slabDiscountsResponse.getItemDiscountDetails())) {

			// Impacted cumulative items
			Set<String> updatedItemIds = new HashSet<>();
			List<DiscountDetailsDaoExt> existingDiscountList = new ArrayList<>();
			Map<String, SlabItemDetailsDto> cumulativeDiscountsResponseMap = slabDiscountsResponse
					.getItemDiscountDetails().stream()
					.collect(Collectors.toMap(SlabItemDetailsDto::getItemId, Function.identity()));
			applicableCumulativeItems.forEach(discountItemDetailsDao -> {
				if (discountItemDetailsDao.getDiscountDetail().getDiscountType()
						.equals(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name())) {
					SlabItemDetailsDto slabItem = cumulativeDiscountsResponseMap
							.get(discountItemDetailsDao.getItemId());
					if (cumulativeDiscountsResponseMap.containsKey(discountItemDetailsDao.getItemId())
							&& BooleanUtils.isNotTrue(slabItem.getIsExclude())) {
						if (discountItemDetailsDao.getDiscountValue().compareTo(slabItem.getDiscountValue()) < 0) {

							SlabItemDetailsDto slabItemDiscountDetails = cumulativeDiscountsResponseMap
									.get(discountItemDetailsDao.getItemId());
							discountItemDetailsDao.setDiscountValue(slabItemDiscountDetails.getDiscountValue());
							discountItemDetailsDao.setDiscountValueDetails(MapperUtil.getStringFromJson(
									new JsonData("DISCOUNT_VALUE_DETAILS", new DiscountValueDetailsObjectDto(
											slabItemDiscountDetails.getDiscountValueDetails()))));
							discountItemDetailsDao.getDiscountDetail()
									.setDiscountValue(slabItemDiscountDetails.getDiscountValue());
							discountItemDetailsDao.getDiscountDetail().setCumulativeDiscountId(cumulativeDiscountId);

							updatedItemIds.add(discountItemDetailsDao.getItemId());
							discountItemDetailsDao.getDiscountDetail()
									.setDiscountValueDetails(MapperUtil.getStringFromJson(
											slabItemDiscountDetails.getCummulativeDiscountWithExcludeDetails()));
							existingDiscountList.add(discountItemDetailsDao.getDiscountDetail());
						} else {
							discountItemDetailsDao.getDiscountDetail().setCumulativeDiscountId(cumulativeDiscountId);

							updatedItemIds.add(discountItemDetailsDao.getItemId());

						}
					}
	
				} else if (!discountItemDetailsDao.getDiscountDetail().getDiscountType()
						.equals(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name())
						&& cumulativeDiscountsResponseMap.containsKey(discountItemDetailsDao.getItemId())) {
					SlabItemDetailsDto slabItemDiscountDetails = cumulativeDiscountsResponseMap
							.get(discountItemDetailsDao.getItemId());
					discountItemDetailsDao.setDiscountValue(slabItemDiscountDetails.getDiscountValue());
					discountItemDetailsDao.setDiscountValueDetails(MapperUtil.getStringFromJson(new JsonData(
							"DISCOUNT_VALUE_DETAILS",
							new DiscountValueDetailsObjectDto(slabItemDiscountDetails.getDiscountValueDetails()))));
					discountItemDetailsDao.getDiscountDetail()
							.setDiscountValue(slabItemDiscountDetails.getDiscountValue());
					discountItemDetailsDao.getDiscountDetail().setCumulativeDiscountId(cumulativeDiscountId);
					discountItemDetailsDao.getDiscountDetail().setDiscountValueDetails(MapperUtil
							.getStringFromJson(slabItemDiscountDetails.getCummulativeDiscountWithExcludeDetails()));
					existingDiscountList.add(discountItemDetailsDao.getDiscountDetail());
					updatedItemIds.add(discountItemDetailsDao.getItemId());
				}
			});

			// Save all the impacted items
			discountItemDetailsRepository.saveAll(applicableCumulativeItems);
			if (!CollectionUtil.isEmpty(existingDiscountList)) {
				discountDetailsRepository.saveAll(existingDiscountList);
			}

			if (currentItem != null && cumulativeDiscountsResponseMap.containsKey(currentItem)) {
				SlabItemDetailsDto slabItemDiscountDetails = cumulativeDiscountsResponseMap.get(currentItem);
				if (slabItemDiscountDetails != null && BooleanUtils.isNotTrue(slabItemDiscountDetails.getIsExclude())) {
					discountDetail.setDiscountValue(slabItemDiscountDetails.getDiscountValue());
					discountDetail.setDiscountValueDetails(new JsonData("DISCOUNT_VALUE_DETAILS",
							new DiscountValueDetailsObjectDto(slabItemDiscountDetails.getDiscountValueDetails())));
					discountDetail.setCumulativeDiscountId(cumulativeDiscountId);
					discountDetail.setCummulativeDiscountWithExcludeDetails(
							slabItemDiscountDetails.getCummulativeDiscountWithExcludeDetails());
					updatedItemIds.add(currentItem);
				}
			}

			// updated items applicable/involved in cumm. discount
			List<DiscountDetailsDaoExt> discountDetailsForExistingItems = new ArrayList<>();
			List<DiscountItemDetailsDaoExt> discountItemDetailsForExistingItems = new ArrayList<>();
			itemsValidOrExclude.forEach(existingItem -> {
				SlabItemDetailsDto slabItemDiscountDetails = cumulativeDiscountsResponseMap.get(existingItem);
				if (slabItemDiscountDetails != null && BooleanUtils.isNotTrue(slabItemDiscountDetails.getIsExclude())) {
					DiscountDetailsDaoExt discountDetailsDaoForExistingItem = createDiscountDetails(discountDetail,
							salesTxn, DiscountApplicableLevelEnum.ITEM_LEVEL.name(), discountOtherDetails,
							DiscountInitialStatusEnum.SLAB_BASED_DISCOUNT.getDiscountInitialStatus(), null);

					discountDetailsDaoForExistingItem.setDiscountValue(slabItemDiscountDetails.getDiscountValue());
					JsonData discountValueDetails = new JsonData("DISCOUNT_VALUE_DETAILS",
							new DiscountValueDetailsObjectDto(slabItemDiscountDetails.getDiscountValueDetails()));
					discountDetailsDaoForExistingItem.setDiscountValueDetails(MapperUtil
							.getStringFromJson(slabItemDiscountDetails.getCummulativeDiscountWithExcludeDetails()));
					discountDetailsDaoForExistingItem.setCumulativeDiscountId(cumulativeDiscountId);
					discountDetailsDaoForExistingItem.setDiscountConfig(
							saveDiscountConfigDetails(slabDiscountsResponse.getDiscountConfigDetails()));

					updatedItemIds.add(existingItem);
					discountDetailsForExistingItems.add(discountDetailsDaoForExistingItem);
					discountItemDetailsForExistingItems.add(getItemDiscountDetails(existingItem,
							discountDetailsDaoForExistingItem, discountOtherDetails, discountValueDetails));
				}
			});
			if (!CollectionUtils.isEmpty(discountItemDetailsForExistingItems)) {
				discountDetailsRepository.saveAll(discountDetailsForExistingItems);
				discountItemDetailsRepository.saveAll(discountItemDetailsForExistingItems);
			}

			isDiscountApplicable = true;
			// Update Impacted Items final value with calculated cumulative discount value
			updateTransactionSpecificItemDetails(salesTxn, updatedItemIds,
					(discountOtherDetails != null && BooleanUtils.isTrue(discountOtherDetails.getIsPriceUpdate())));
		}

		return isDiscountApplicable;
	}

	// Method to delete item discount details and discount config details
	@Transactional
	@Override
	public void deleteAllItemDiscountDetails(List<DiscountItemDetailsDaoExt> discountItemDetailsList) {
		List<DiscountDetailsDaoExt> discountDetailsDaoList = discountItemDetailsList.stream()
				.map(DiscountItemDetailsDaoExt::getDiscountDetail).collect(Collectors.toList());

		List<DiscountConfigDetailsDaoExt> discountConfigDaoList = discountDetailsDaoList.stream()
				.map(DiscountDetailsDaoExt::getDiscountConfig).collect(Collectors.toList());

		discountItemDetailsRepository.deleteAll(discountItemDetailsList);

		discountDetailsRepository.deleteAll(discountDetailsDaoList);

		discountConfigDetailsRepository.deleteAll(discountConfigDaoList);
	}

	// Method to verify and delete cumulative item discounts, if applicable
	@Transactional
	@Override
	public void verifyAndDeleteCumulativeItemDiscounts(SalesTxnDaoExt salesTxn,
			List<DiscountItemDetailsDaoExt> currentDiscountItemDetailsList, Boolean isCurrentItemIgnore) {
		List<DiscountDetailsDaoExt> cumulativeDiscounts = currentDiscountItemDetailsList.stream().filter(
				itemDiscount -> !StringUtils.isEmpty(itemDiscount.getDiscountDetail().getCumulativeDiscountId()))
				.map(DiscountItemDetailsDaoExt::getDiscountDetail).collect(Collectors.toList());

		List<String> cumulativeDiscountRefIds = cumulativeDiscounts.stream()
				.map(DiscountDetailsDaoExt::getCumulativeDiscountId).collect(Collectors.toList());

		Set<String> currentItemIdsForIgnore = currentDiscountItemDetailsList.stream()
				.map(DiscountItemDetailsDaoExt::getItemId).collect(Collectors.toSet());

		List<DiscountItemDetailsDaoExt> impactedItemDiscountDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailCumulativeDiscountIdIn(salesTxn,
						cumulativeDiscountRefIds);

		Map<String, List<DiscountItemDetailsDaoExt>> mapItemDiscountsByCumulativeId = new HashMap<>();
		impactedItemDiscountDetailsList.forEach(itemDiscount -> {
			List<DiscountItemDetailsDaoExt> itemDiscountList;
			if (mapItemDiscountsByCumulativeId
					.containsKey(itemDiscount.getDiscountDetail().getCumulativeDiscountId())) {
				itemDiscountList = mapItemDiscountsByCumulativeId
						.get(itemDiscount.getDiscountDetail().getCumulativeDiscountId());
			} else {
				itemDiscountList = new ArrayList<>();
			}
			itemDiscountList.add(itemDiscount);
			mapItemDiscountsByCumulativeId.put(itemDiscount.getDiscountDetail().getCumulativeDiscountId(),
					itemDiscountList);
		});

		impactedItemDiscountDetailsList.removeAll(currentDiscountItemDetailsList);

		Set<String> impactedItemIds = impactedItemDiscountDetailsList.stream().map(DiscountItemDetailsDaoExt::getItemId)
				.collect(Collectors.toSet());

		if (!impactedItemIds.isEmpty() && (impactedItemDiscountDetailsList.get(0).getDiscountDetail().getDiscountType()
				.equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())
				|| impactedItemDiscountDetailsList.get(0).getDiscountDetail().getDiscountType()
						.equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
				|| impactedItemDiscountDetailsList.get(0).getDiscountDetail().getDiscountType()
						.equals(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name()))) {

			mapItemDiscountsByCumulativeId
					.forEach((cumulativeId, itemDiscountList) -> recalculateCumulateDiscount(impactedItemIds,
							itemDiscountList, salesTxn,
							// for exclude item discount delete, item should not be ignored. But for exclude
							// item delete item should be ignored for cumulative discount
							(BooleanUtils.isTrue(isCurrentItemIgnore) ? new HashSet<>() : currentItemIdsForIgnore),
							null, false));

		}

		updateTransactionSpecificItemDetails(salesTxn, impactedItemIds, false);

	}

	@Override
	public AbCoDiscountRequestDto createOrderToCmDiscountRequestDto(SalesTxnDaoExt salesTxn, String cmItemId,
			DiscountItemDetailsDaoExt appliedItemDiscount, RivaahGhsDiscountDto rivaahGhsDetails) {

		AbCoDiscountRequestDto orderToCmDiscountRequestDto = new AbCoDiscountRequestDto();

		orderToCmDiscountRequestDto.setBusinessDate(
				CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));

		// Get Item Price details
		List<DiscountItemDetailsReqDto> discountItemDetailsReqDtoList = getDiscountItemDetailsRequestDto(salesTxn,
				List.of(cmItemId));

		orderToCmDiscountRequestDto.setItemDetails(discountItemDetailsReqDtoList.get(0));

		// Set Discount config details freezed during order
		DiscountDetailsConfigRequestDto discountDetailsConfigRequestDto = getFreezedDiscountConfigsofOrder(
				appliedItemDiscount);

		orderToCmDiscountRequestDto.setDiscountDetilsConfigRequestDto(List.of(discountDetailsConfigRequestDto));

		orderToCmDiscountRequestDto.setEligibleRivaahGhsDetails(rivaahGhsDetails);

		return orderToCmDiscountRequestDto;

	}

	private JsonData getJsonData(String configDetails) {
		JsonData jsonData = MapperUtil.mapObjToClass(configDetails, JsonData.class);
		return jsonData;
	}

	@Override
	@Transactional
	public SlabBasedDiscountDetailsResponseDto applyCumulativeOrderToCmDiscounts(SalesTxnDaoExt salesTxn,
			DiscountDetailDto discountDetail, String itemId, List<DiscountItemDetailsDaoExt> applicableCumulativeItems,
			String cumulativeDiscountId, DiscountItemDetailsDaoExt appliedItemDiscount,
			List<String> itemsValidOrExclude) {
//		applicableCumulativeItems.add(appliedItemDiscount);
		Set<String> cumulativeItemIds = new HashSet<>();
		if (!CollectionUtil.isEmpty(applicableCumulativeItems)) {
			cumulativeItemIds = applicableCumulativeItems.stream().map(DiscountItemDetailsDaoExt::getItemId)
					.collect(Collectors.toSet());
		}
		if (itemId != null) {
			cumulativeItemIds.add(itemId);
		}
		if (!CollectionUtil.isEmpty(itemsValidOrExclude)) {
			cumulativeItemIds.addAll(itemsValidOrExclude);
		}
		AbCoSlabDiscountRequestDto orderToCmSlabDiscountRequestDto = getOrderToCmCumulativeDiscountRequestDto(salesTxn,
				cumulativeItemIds.stream().collect(Collectors.toList()), appliedItemDiscount);

		log.info("Calculate Order to CM Cumulative discounts Request Dto - {}",
				MapperUtil.getJsonString(orderToCmSlabDiscountRequestDto));

		SlabBasedDiscountDetailsResponseDto slabDiscountsResponse = engineService
				.calculateAbCoDiscountValueForSlabBasedDiscounts(orderToCmSlabDiscountRequestDto);

		log.info("Calculate Order to CM Cumulative discounts Response Dto - {}",
				MapperUtil.getJsonString(slabDiscountsResponse));
		Set<String> updatedItemIds = new HashSet<>();
		if (!CollectionUtils.isEmpty(slabDiscountsResponse.getItemDiscountDetails())) {
			Map<String, SlabItemDetailsDto> cumulativeDiscountsResponseMap = slabDiscountsResponse
					.getItemDiscountDetails().stream()
					.collect(Collectors.toMap(SlabItemDetailsDto::getItemId, Function.identity()));
			applicableCumulativeItems.forEach(discountItemDetailsDao -> {
				if (cumulativeDiscountsResponseMap.containsKey(discountItemDetailsDao.getItemId())) {
					SlabItemDetailsDto slabItemDiscountDetails = cumulativeDiscountsResponseMap
							.get(discountItemDetailsDao.getItemId());
					discountItemDetailsDao.setDiscountValue(slabItemDiscountDetails.getDiscountValue());
					discountItemDetailsDao.setDiscountValueDetails(MapperUtil.getStringFromJson(new JsonData(
							"DISCOUNT_VALUE_DETAILS",
							new DiscountValueDetailsObjectDto(slabItemDiscountDetails.getDiscountValueDetails()))));
					discountItemDetailsDao.getDiscountDetail()
							.setDiscountValue(slabItemDiscountDetails.getDiscountValue());
					discountItemDetailsDao.getDiscountDetail().setCumulativeDiscountId(cumulativeDiscountId);
					discountItemDetailsDao.getDiscountDetail().setDiscountValueDetails(MapperUtil
							.getStringFromJson(slabItemDiscountDetails.getCummulativeDiscountWithExcludeDetails()));
					updatedItemIds.add(discountItemDetailsDao.getItemId());
					// Pending: To update applied discount component type for cumulative discounts
				}
			});

			// Save of all the impacted item discount will happen in calling method

			if (itemId != null && cumulativeDiscountsResponseMap.containsKey(itemId.toUpperCase())) {
				SlabItemDetailsDto slabItemDiscountDetails = cumulativeDiscountsResponseMap.get(itemId.toUpperCase());
				discountDetail.setDiscountValue(slabItemDiscountDetails.getDiscountValue());
				discountDetail.setDiscountValueDetails(new JsonData("DISCOUNT_VALUE_DETAILS",
						new DiscountValueDetailsObjectDto(slabItemDiscountDetails.getDiscountValueDetails())));
				discountDetail.setCumulativeDiscountId(cumulativeDiscountId);
				discountDetail.setCummulativeDiscountWithExcludeDetails(
						slabItemDiscountDetails.getCummulativeDiscountWithExcludeDetails());
				updatedItemIds.add(itemId.toUpperCase());
			}

			if (itemId == null && !CollectionUtil.isEmpty(updatedItemIds)) {
				updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);
			}
		}

		return slabDiscountsResponse;
	}

	@Override
	public AbCoSlabDiscountRequestDto getOrderToCmCumulativeDiscountRequestDto(SalesTxnDaoExt salesTxn,
			List<String> cumulativeItemIds, DiscountItemDetailsDaoExt appliedItemDiscount) {
		AbCoSlabDiscountRequestDto orderToCmCumulativeDiscountRequestDto = new AbCoSlabDiscountRequestDto();
		orderToCmCumulativeDiscountRequestDto.setBusinessDate(
				CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));

		// Get Item Price details
		List<DiscountItemDetailsReqDto> discountItemDetailsReqDtoList = getDiscountItemDetailsRequestDto(salesTxn,
				cumulativeItemIds);

		orderToCmCumulativeDiscountRequestDto.setItemDetails(discountItemDetailsReqDtoList);

		// Get customer details
		DiscountCustDetails discountCustDetails = getCustomerDetailsRequestDto(salesTxn);

		orderToCmCumulativeDiscountRequestDto.setCustomerDetails(discountCustDetails);

		// Get Transaction details
		TransactionDetailsDto transactionDetails = getTransactionDetailsRequestDto(salesTxn);

		orderToCmCumulativeDiscountRequestDto.setTransactionDetails(transactionDetails);

		// Get the Freezed discount configs of order
		DiscountDetailsConfigRequestDto discountDetailsConfigRequestDto = getFreezedDiscountConfigsofOrder(
				appliedItemDiscount);

		orderToCmCumulativeDiscountRequestDto.setDiscountDetilsConfigRequestDto(discountDetailsConfigRequestDto);

		return orderToCmCumulativeDiscountRequestDto;

	}

	// Method to set Freezed discount config details to apply on Cash memo item
	private DiscountDetailsConfigRequestDto getFreezedDiscountConfigsofOrder(
			DiscountItemDetailsDaoExt appliedItemDiscount) {
		DiscountDetailsConfigRequestDto discountDetailsConfigRequestDto = new DiscountDetailsConfigRequestDto();

		discountDetailsConfigRequestDto.setDiscountId(appliedItemDiscount.getDiscountDetail().getDiscountId());

		// Set applied discount type
		discountDetailsConfigRequestDto
				.setDiscountType(DiscountTypeEnum.valueOf(appliedItemDiscount.getDiscountDetail().getDiscountType()));

		DiscountConfigDetailsDaoExt discountConfig = appliedItemDiscount.getDiscountDetail().getDiscountConfig();

		// Set location offer details
		discountDetailsConfigRequestDto.setLocationOfferDetails(MapperUtil.mapObjToClass(
				getJsonData(discountConfig.getLocationOfferDetails()).getData(), LocationOfferDetails.class));

		// Set Order config details
		discountDetailsConfigRequestDto.setOrderConfigDetails(MapperUtil.mapObjToClass(
				getJsonData(discountConfig.getOrderConfigDetails()).getData(), DiscountOrderConfigDetails.class));

		// Set Slab config details
		discountDetailsConfigRequestDto.setSlabConfigDetails(MapperUtil
				.mapObjToClass(getJsonData(discountConfig.getSlabConfigDetails()).getData(), SlabConfigDetails.class));

		// Set all the Freezed discount component details
		discountDetailsConfigRequestDto.setAppliedDiscountComponent(
				MapperUtil.mapObjToClass(discountConfig.getAppliedDiscountComponent(), RegularCategoryDetails.class));

		discountDetailsConfigRequestDto.setRegularDiscountComponent(
				MapperUtil.mapObjToClass(discountConfig.getRegularDiscountComponent(), RegularCategoryDetails.class));

		discountDetailsConfigRequestDto.setSlabDiscountComponents(
				MapperUtil.mapObjToClass(discountConfig.getSlabDiscountComponents(), SlabDetails.class));

		discountDetailsConfigRequestDto
				.setAppliedDiscountComponentType(discountConfig.getAppliedDiscountComponentType());

		discountDetailsConfigRequestDto.setAppliedDiscountMaster(
				MapperUtil.mapObjToClass(discountConfig.getAppliedDiscountMaster(), DiscountDto.class));

		// Set linked discount details
		discountDetailsConfigRequestDto.setLinkDiscountDetails(MapperUtil.mapObjToClass(
				getJsonData(discountConfig.getLinkedDiscountDetails()).getData(), LinkDiscountDetailsDto.class));

		// Set High value config details
		discountDetailsConfigRequestDto
				.setApplicableThemeDetails(getJsonData(discountConfig.getHighValueConfigDetails()));

		// Set discount config details needed for eligibility check
		discountDetailsConfigRequestDto.setProductGroups(
				MapperUtil.mapObjToClass(discountConfig.getProductGroupDetails(), ProductGroupDetails.class));

		discountDetailsConfigRequestDto.setProductCategory(
				MapperUtil.mapObjToClass(discountConfig.getProductCategoryDetails(), ProductCategoryDetails.class));

		discountDetailsConfigRequestDto.setExcludeConfigDto(
				MapperUtil.mapObjToClass(discountConfig.getExcludeConfigDetails(), ExcludeConfigDto.class));

		return discountDetailsConfigRequestDto;
	}

	// Method to calculate minimum payment to be made to avail the discount during
	// order
	public BigDecimal getMinPaymentForDiscountEligibility(String itemId, String salesTxnId, BigDecimal itemFinalValue) {

		BigDecimal minDiscountPayment = BigDecimal.ZERO;

		List<DiscountItemDetailsDaoExt> discountItemDetails = discountItemDetailsRepository
				.findAllByItemIdAndDiscountDetailSalesTxnId(itemId, salesTxnId);
		if (!CollectionUtils.isEmpty(discountItemDetails)) {

			BigDecimal minPaymentPercent = discountItemDetails.stream()
					.filter(discountItemDao -> discountItemDao.getMinPaymentPercent() != null)
					.max(Comparator.comparing(DiscountItemDetailsDaoExt::getMinPaymentPercent))
					.map(DiscountItemDetailsDaoExt::getMinPaymentPercent).orElse(BigDecimal.ZERO);

			if (minPaymentPercent.compareTo(BigDecimal.ZERO) > 0)
				minDiscountPayment = itemFinalValue.multiply((minPaymentPercent.divide(BigDecimal.valueOf(100))))
						.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP);

		}

		return minDiscountPayment;
	}

	@Override
	public List<SalesItemDetailsDto> filterAndGetEligibleItemsForCurrentDiscount(DiscountDetailsDaoExt discountDetails,
			SalesTxnDaoExt salesTxn) {

		List<SalesItemDetailsDto> salesItemList = getTransactionSpecificItemDetails(salesTxn, null);

		if (CollectionUtil.isEmpty(salesItemList)) {
			return salesItemList;
		}

		// Step 1: Find all the item level discount details applied for same transaction
		List<DiscountItemDetailsDaoExt> discountItemDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndItemIdIn(salesTxn,
						salesItemList.stream().map(SalesItemDetailsDto::getId).collect(Collectors.toList()));

		Set<String> nonEligibleItemIdList = new HashSet<>();
		Set<String> nonClubableDiscountCodes = new HashSet<>();

		// Validate against the applied discounts of items
		if (!CollectionUtils.isEmpty(discountItemDetailsList)) {

			// Step 2: Validate the items discount are eligible to club with selected bill
			// level discount
			nonClubableDiscountCodes = validateEachItemDiscountsConfigAndGetNonEligibleItems(discountItemDetailsList,
					nonEligibleItemIdList, discountDetails.getDiscountType());

		}

		// Step 3: Get the Eligible sales item list by filtering out the non eligible
		// items and non eligible product groups
		getEligibleSalesItems(discountDetails, salesItemList, nonEligibleItemIdList, nonClubableDiscountCodes);

		return salesItemList;
	}

	// Method to get order discount config details
	@Override
	public void getOrderDiscountConfigDetails(DiscountConfigDetailsDaoExt discountConfig,
			DiscountDetailsBaseDto itemDiscountConfigDetails, Boolean configsRequired) {

		// Set discount attributes details
		itemDiscountConfigDetails.setDiscountAttributes(MapperUtil.mapObjToClass(
				getJsonData(discountConfig.getDiscountAttributes()).getData(), DiscountAttributesDto.class));

		// Set Order config details
		itemDiscountConfigDetails.setOrderConfigDetails(MapperUtil.mapObjToClass(
				getJsonData(discountConfig.getOrderConfigDetails()).getData(), DiscountOrderConfigDetails.class));

		// All the config details to be fetched only if required
		if (BooleanUtils.isTrue(configsRequired)) {

			// Set basic criteria details
			itemDiscountConfigDetails.setBasicCriteriaDetails(MapperUtil.mapObjToClass(
					getJsonData(discountConfig.getBasicCriteriaDetails()).getData(), BaseBasicCriteriaDetails.class));

			// Set clubbable config details
			itemDiscountConfigDetails.setClubbingDetails(MapperUtil.mapObjToClass(
					getJsonData(discountConfig.getClubbableConfigDetails()).getData(), ClubbingConfigDetails.class));

			// Set location offer details
			itemDiscountConfigDetails.setLocationOfferDetails(MapperUtil.mapObjToClass(
					getJsonData(discountConfig.getLocationOfferDetails()).getData(), LocationOfferDetails.class));

			// Set linked discount details
			itemDiscountConfigDetails.setLinkDiscountDetails(MapperUtil.mapObjToClass(
					getJsonData(discountConfig.getLinkedDiscountDetails()).getData(), LinkDiscountDetailsDto.class));

			// Set Slab config details
			itemDiscountConfigDetails.setSlabConfigDetails(MapperUtil.mapObjToClass(
					getJsonData(discountConfig.getSlabConfigDetails()).getData(), SlabConfigDetails.class));

			// Set High value config details
			itemDiscountConfigDetails
					.setApplicableThemeDetails(getJsonData(discountConfig.getHighValueConfigDetails()));

			// Set TEP config details
			itemDiscountConfigDetails.setTepConfigDetails(MapperUtil.mapObjToClass(
					getJsonData(discountConfig.getTepConfigDetails()).getData(), TepConfigDetails.class));

			// Set GRN config details
			itemDiscountConfigDetails.setGrnConfigDetails(MapperUtil.mapObjToClass(
					getJsonData(discountConfig.getGrnConfigDetails()).getData(), DiscountGrnConfigDetails.class));

			// Set all the Freezed discount component details
			itemDiscountConfigDetails.setAppliedDiscountComponent(MapperUtil
					.mapObjToClass(discountConfig.getAppliedDiscountComponent(), RegularCategoryDetails.class));

			itemDiscountConfigDetails.setRegularDiscountComponent(MapperUtil
					.mapObjToClass(discountConfig.getRegularDiscountComponent(), RegularCategoryDetails.class));

			itemDiscountConfigDetails.setSlabDiscountComponents(
					MapperUtil.mapObjToClass(discountConfig.getSlabDiscountComponents(), SlabDetails.class));

			itemDiscountConfigDetails.setAppliedDiscountComponentType(discountConfig.getAppliedDiscountComponentType());

			itemDiscountConfigDetails.setAppliedDiscountMaster(
					MapperUtil.mapObjToClass(discountConfig.getAppliedDiscountMaster(), DiscountDto.class));

			// Set discount config details needed for eligibility check
			itemDiscountConfigDetails.setProductGroups(
					MapperUtil.mapObjToClass(discountConfig.getProductGroupDetails(), ProductGroupDetails.class));

			itemDiscountConfigDetails.setProductCategory(
					MapperUtil.mapObjToClass(discountConfig.getProductCategoryDetails(), ProductCategoryDetails.class));

			itemDiscountConfigDetails.setExcludeConfigDto(
					MapperUtil.mapObjToClass(discountConfig.getExcludeConfigDetails(), ExcludeConfigDto.class));

		}
	}

	@Override
	public Map<Boolean, List<DiscountDetailsDaoExt>> getBestDiscount(BigDecimal bestDiscountAmount,
			SalesTxnDaoExt salesTxn, PaymentDetailsDaoExt paymentDetailsDao) {

		// NOTE: This function cannot be called for discount other than GEP PURITY OFFER

		boolean isCurrentDiscountBest = true;
		List<DiscountDetailsDaoExt> previouslyAddedDiscountDetails = discountDetailsRepository
				.findAllBySalesTxnIdAndRefPaymentId(salesTxn.getId(), paymentDetailsDao.getId());

		// if not discount is added w.r.t payment, then return current discount
		if (CollectionUtil.isEmpty(previouslyAddedDiscountDetails)) {
			return Map.of(isCurrentDiscountBest, List.of());
		}

		for (DiscountDetailsDaoExt existingDiscount : previouslyAddedDiscountDetails) {
			if (bestDiscountAmount.compareTo(existingDiscount.getDiscountValue()) < 0) {
				isCurrentDiscountBest = false;
				bestDiscountAmount = existingDiscount.getDiscountValue();
			}
		}

		// 1. if best discount is same as current discount
		// (ie, isCurrentDiscountBest=true), then other discount delete to be called.
		if (isCurrentDiscountBest) {
			return Map.of(isCurrentDiscountBest, previouslyAddedDiscountDetails);
		}

		// 2. if not, no need to save current discount so return false.
		return Map.of(isCurrentDiscountBest, List.of());

	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public void deletePaymentIndividually(PaymentDetailsDaoExt paymentDetails, String locationCode) {
		// calling repo again as previous one will not be in transaction
		PaymentDetailsDaoExt payment = paymentDetailsRepository.getOne(paymentDetails.getId());
		payment.setStatus(PaymentStatusEnum.DELETED.name());

		// assumption: payment will be in 'OPEN' status and used only for CNs

		paymentDetailsRepository.save(payment);

		if (TransactionTypeEnum.CM.name().equals(payment.getSalesTxnDao().getTxnType())) {
			commonCashMemoService.updateTotalAmountPaid(payment.getSalesTxnDao(), payment.getAmount(), locationCode);
		} else if (TransactionTypeEnum.AB.name().equals(payment.getSalesTxnDao().getTxnType())) {
			orderUtilService.updateTotalAmountPaid(payment.getSalesTxnDao(), payment.getAmount(), locationCode);
		}

	}

	@Override
	public PaymentDetailsDaoExt getRefPaymentDetailById(String refPaymentId, String paymentCode, String locationCode) {

		// ref payment is mandatory
		if (StringUtils.isEmpty(refPaymentId)) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Payment id is required to add the dsicount.");
		}

		PaymentDetailsDaoExt paymentDetailsDao = paymentDetailsRepository
				.findByIdAndSalesTxnDaoLocationCode(refPaymentId, locationCode);
		if (!PaymentStatusEnum.OPEN.name().equals(paymentDetailsDao.getStatus())
				|| !paymentCode.equals(paymentDetailsDao.getPaymentCode())) {
			// if payment status is not 'OPEN', then discount is not applicable and only
			// 'CREDIT NOTE' payment is allowed.
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Payment not valid to apply discount. Payment id: " + refPaymentId + ", payment code: "
							+ paymentDetailsDao.getPaymentCode());
		}

		return paymentDetailsDao;
	}

	@Override
	public void deleteHeaderDiscountByDiscountDetails(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetails) {

		// create util method
		List<DiscountItemDetailsDaoExt> apportionedItemDiscounts = discountItemDetailsRepository
				.findAllByDiscountDetailId(discountDetails.getId());

		if (!CollectionUtils.isEmpty(apportionedItemDiscounts)) {
			Set<String> updatedItemIds = apportionedItemDiscounts.stream().map(DiscountItemDetailsDaoExt::getItemId)
					.collect(Collectors.toSet());

			// Delete the apportioned discount values at item level
			discountItemDetailsRepository.deleteByDiscountDetailId(discountDetails.getId());

			// Update discount values for the impacted items
			updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);

		}

		// Delete bill level discount at sales transaction level
		discountDetailsRepository.deleteById(discountDetails.getId());

		// Delete discount config details
		discountConfigDetailsRepository.delete(discountDetails.getDiscountConfig());

	}

	@Override
	public EligibleDiscountAbItemsRequestDto getEligibleItemRequestBodyForOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao) {
		EligibleDiscountAbItemsRequestDto eligibleDiscountItemsRequestDto = new EligibleDiscountAbItemsRequestDto();
		eligibleDiscountItemsRequestDto.setBusinessDate(
				CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));

		// Set Discount config details Freezed during Order
		DiscountDetailsBaseDto discountConfigDetails = MapperUtil.mapObjToClass(orderDiscountDetailDao,
				DiscountDetailsBaseDto.class);
		getOrderDiscountConfigDetails(orderDiscountDetailDao.getDiscountConfig(), discountConfigDetails, true);
		eligibleDiscountItemsRequestDto.setDiscountDetails(List.of(discountConfigDetails));

		List<SalesItemDetailsDto> salesItemDtoList = getTransactionSpecificItemDetails(salesTxn, null);

		List<DiscountItemsDto> discountItemList = new ArrayList<>();
		salesItemDtoList.forEach(salesItem -> {
			DiscountItemsDto discountItemsDto = (DiscountItemsDto) MapperUtil.getObjectMapping(salesItem,
					new DiscountItemsDto());
			discountItemsDto.setItemId(salesItem.getId());
			discountItemList.add(discountItemsDto);
		});
		eligibleDiscountItemsRequestDto.setItemDetails(discountItemList);

		log.info("Bill level applicable discount Eligible Item Request Dto for Order to CM - {}",
				MapperUtil.getJsonString(eligibleDiscountItemsRequestDto));

		return eligibleDiscountItemsRequestDto;
	}

	@Override
	public DiscountDetailsDaoExt createBillLevelDiscountDetailsForOrderToCM(
			DiscountDetailsDaoExt orderDiscountDetailDao, SalesTxnDaoExt salesTxn, String status) {
		DiscountDetailsDaoExt cmDiscountDetailsDao = (DiscountDetailsDaoExt) MapperUtil
				.getObjectMapping(orderDiscountDetailDao, new DiscountDetailsDaoExt(), "id");
		cmDiscountDetailsDao.setSalesTxn(salesTxn);
		cmDiscountDetailsDao.setReferenceId(orderDiscountDetailDao.getId());
		cmDiscountDetailsDao.setReferenceType(DiscountReferenceTypeEnum.ORDER_AB_DISCOUNT.name());
		cmDiscountDetailsDao.setStatus(status);

		return cmDiscountDetailsDao;
	}

	@Override
	public boolean validateGepPutiryConfig(GepConfigDetailsRes gepConfigDetailsRes, BigDecimal utilzPct,
			Date businessDate, CreditNoteDaoExt creditNoteDao, boolean isAppliedAsDiscount,
			SalesTxnDaoExt salesTxnDao) {

		boolean isConfigValid = false;

		// check if offer is enabled or not
		if (!BooleanUtils.isTrue(gepConfigDetailsRes.getIsOfferEnabled())) {
			return isConfigValid;
		}

		// config details check
		if (StringUtil.isBlankJsonData(gepConfigDetailsRes.getGepConfigDetails())
				|| gepConfigDetailsRes.getGepConfigDetails().getData() == null
				|| StringUtil.isBlankJsonData(gepConfigDetailsRes.getGepOfferDetails())
				|| gepConfigDetailsRes.getGepOfferDetails().getData() == null) {
			throw new ServiceException(SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE, SalesConstants.ERR_CORE_036,
					"Some GEP offer configurations are not defined at EPOSS for config id - "
							+ gepConfigDetailsRes.getGepConfigId());
		}
		GepConfigDetails gepConfigDetails = MapperUtil
				.mapObjToClass(gepConfigDetailsRes.getGepConfigDetails().getData(), GepConfigDetails.class);
		GepOfferDetails gepOfferDetails = MapperUtil.mapObjToClass(gepConfigDetailsRes.getGepOfferDetails().getData(),
				GepOfferDetails.class);

		// 1. check if offer can be used as discount or not
		if ((isAppliedAsDiscount && !BooleanUtils.isTrue(gepConfigDetails.getGepDiscountDeductionAmt()))
				|| (!isAppliedAsDiscount && !BooleanUtils.isTrue(gepConfigDetails.getGepAsPayment()))) {
			String type = isAppliedAsDiscount ? "discount" : "payment";
			throw new ServiceException(SalesConstants.GEP_OFFER_CANNOT_BE_USED_AS_DYNAMIC_TYPE,
					SalesConstants.ERR_SALE_323, "Offer cannot be used as " + type
							+ " in current transaction. GEP config Id - " + gepConfigDetailsRes.getGepConfigId(),
					Map.of("type", type));
		}

		// 2. check if utilzPct is >= minutilzPct
		isConfigValid = checkCreditNoteMinUtilization(utilzPct, creditNoteDao, gepOfferDetails);
		if (!isConfigValid) {
			// if config is not valid, then no need to check further
			return isConfigValid;
		}

		if (gepOfferDetails.getGepDiscountStartDate() == null || gepOfferDetails.getGepDiscountEndDate() == null) {
			throw new ServiceException(SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE, SalesConstants.ERR_CORE_036,
					"GEP offer discount start and end date not defined.");
		}

		// 3. check if offer is within discount range, then return true
		isConfigValid = checkBusinessDateForOffer(businessDate, salesTxnDao, gepConfigDetails, gepOfferDetails,
				creditNoteDao);

		return isConfigValid;

	}

	private boolean checkCreditNoteMinUtilization(BigDecimal utilzPct, CreditNoteDaoExt creditNoteDao,
			GepOfferDetails gepOfferDetails) {

		if (creditNoteDao == null) {
			return true;
		}

		// if remaining amount is less than residual amount && minutilzPct is 100, then
		// ignore config and give discount based on utilzPct
		BigDecimal minUtilzPct = CNType.GRN.name().equals(creditNoteDao.getCreditNoteType())
				? gepOfferDetails.getGrnCNUtilizationPercentage()
				: gepOfferDetails.getGepCNUtilizationPercentage();
		if (minUtilzPct != null && utilzPct.compareTo(minUtilzPct) < 0) {
			if (new BigDecimal(100).compareTo(minUtilzPct) == 0) {
				CNRuleDetails cnResidualAmountDetails = getCNConfig(
						RuleTypeEnum.valueOf(creditNoteDao.getCreditNoteType()));
				BigDecimal cnRemainingAmount = creditNoteDao.getAmount()
						.subtract((creditNoteDao.getAmount()
								.multiply(utilzPct.divide(new BigDecimal(100), DomainConstants.PRICE_SCALE,
										DomainConstants.ROUNDIND_MODE))
								.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)));
				// if remaining amount of CN is more than residual refund, then discount/payment
				// is not applicable
				if (cnRemainingAmount
						.compareTo(new BigDecimal(cnResidualAmountDetails.getResidentialValueAmount())) >= 0) {
					return false;
				}
			} else {
				return false;
			}
		}

		return true;
	}

	private boolean checkBusinessDateForOffer(Date businessDate, SalesTxnDaoExt salesTxnDao,
			GepConfigDetails gepConfigDetails, GepOfferDetails gepOfferDetails, CreditNoteDaoExt creditNoteDao) {
		boolean isConfigValid = false;
		// if within business date, the config is valid
		if ((businessDate.compareTo(gepOfferDetails.getGepDiscountStartDate()) >= 0
				&& businessDate.compareTo(gepOfferDetails.getGepDiscountEndDate()) <= 0)
				|| ((creditNoteDao == null || creditNoteDao.getLinkedTxn() == null)// on AB to CM, CN details will not
																					// be
																					// present
						&& (businessDate.compareTo(CalendarUtils.addDate(gepOfferDetails.getGepDiscountEndDate(),
								gepOfferDetails.getDaysForGEPCNAfterOffer())) <= 0))
				|| ((creditNoteDao == null || creditNoteDao.getLinkedTxn() == null)
						&& salesTxnDao.getRefTxnId().getDocDate()
								.compareTo(gepOfferDetails.getGepDiscountStartDate()) >= 0
						&& salesTxnDao.getRefTxnId().getDocDate()
								.compareTo(gepOfferDetails.getGepDiscountEndDate()) <= 0
						&& ((TransactionTypeEnum.AB.name().equals(salesTxnDao.getRefTxnType())
								&& businessDate.compareTo(CalendarUtils.addDate(gepOfferDetails.getGepDiscountEndDate(),
										gepConfigDetails.getGepDaysAfterABOffer())) < 0)
								|| (TransactionTypeEnum.CO.name().equals(salesTxnDao.getRefTxnType()) && businessDate
										.compareTo(CalendarUtils.addDate(gepOfferDetails.getGepDiscountEndDate(),
												gepConfigDetails.getGepDaysAfterCOOffer())) < 0)))) {
			isConfigValid = true;
		} else {
			throw new ServiceException(SalesConstants.DYNAMIC_DISCOUNTTYPE_OFFER_HAS_EXPIRED,
					SalesConstants.ERR_DISC_042, "Offer expired for CN",
					Map.of(SalesConstants.DISCOUNT_TYPE, DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name()));
		}

		return isConfigValid;
	}

	private CNRuleDetails getCNConfig(RuleTypeEnum creditNoteType) {

		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();
		ruleRequestListDto.setLocationCode(CommonUtil.getLocationCode());

		Object objRespose = engineService.getRuleFieldValues(creditNoteType, ruleRequestListDto);

		if (StringUtils.isEmpty(objRespose)) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					creditNoteType + " CN rule details is not present for the location " + CommonUtil.getStoreCode());
		}

		CNRuleDetails cNRuleDetails = MapperUtil.mapObjToClass(objRespose, CNRuleDetails.class);
		if (cNRuleDetails == null || StringUtils.isEmpty(cNRuleDetails.getResidentialValueAmount())) {
			throw new ServiceException(SalesConstants.CONFIGURATION_DETAILS_NOT_PRESENT_FOR_THE_LOCATION,
					SalesConstants.ERR_SALE_023,
					creditNoteType + " CN 'residual value' details is not present for the location "
							+ CommonUtil.getStoreCode());
		}

		return cNRuleDetails;
	}

	@Override
	public void validateOrderDiscountsApplicabilityOnNewItem(SalesTxnDaoExt salesTxnDao, String itemId) {

		// Order Item discounts shoul not be applied on New Items added in CM of
		// Non-Frozen
		// order
		if (BooleanUtils.isFalse(orderUtilService.checkIfFrozenOrder(salesTxnDao.getRefTxnId()))) {

			List<SalesItemDetailsDto> salesItemDetails = getTransactionSpecificItemDetails(salesTxnDao,
					List.of(itemId));

			if (StringUtils.isEmpty(salesItemDetails.get(0).getOrderItemId())) {
				throw new ServiceException(
						SalesConstants.INVALID_REQUEST
								+ "Order Item discounts can't be applied on New Items added in CM of Non-Frozen order.",
						SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS,
								"Order Item discounts can't be applied on New Items added in CM of Non-Frozen order."));
			}
		}

	}

	public BigDecimal calculateApportionValueAndUpdateKaratageDiscountDetails(DiscountDetailsDaoExt discountDetails,
			List<SalesItemDetailsDto> eligibleSalesItemList, BigDecimal applicableDiscountValue,
			String applicableKaratageType, List<SalesItemDetailsDto> karatageEligibleItemList,DiscountOtherDetailsDto discountOtherDetails) {

		// List to save the new apportioned bill discount for new eligible items added
		List<DiscountItemDetailsDaoExt> createdDiscountItemDetailsList = new ArrayList<>();

		// Sum up the total items value to calculate the each eligible item
		// value
		// contribution as percentage
		BigDecimal eligibleItemsTotalValue = eligibleSalesItemList.stream().map(SalesItemDetailsDto::getTotalValue)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		BigDecimal appliedKaratageDiscountValue = BigDecimal.ZERO;

		// Apply discount on only karatage specific eligible items
		for (SalesItemDetailsDto salesItemDetail : karatageEligibleItemList) {

			// Calculate the each eligible item value contribution out of all eligible items
			// total value as percentage
			BigDecimal itemValuePercentage = salesItemDetail.getTotalValue()
					.divide(eligibleItemsTotalValue, MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100));
			// Apply bill level discount value on each items percentage, to get exact
			// apportioned value
			BigDecimal billDiscountApportionedValue = applicableDiscountValue.multiply(itemValuePercentage)
					.divide(BigDecimal.valueOf(100), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			// create new entry in item discount details with newly apportioned record.
			DiscountItemDetailsDaoExt newApportionedDiscountItemDetails = new DiscountItemDetailsDaoExt();
			newApportionedDiscountItemDetails.setItemId(salesItemDetail.getId());
			newApportionedDiscountItemDetails.setDiscountDetail(discountDetails);
			newApportionedDiscountItemDetails.setDiscountValue(billDiscountApportionedValue);
			newApportionedDiscountItemDetails.setPreDiscountValue(salesItemDetail.getTotalValue());
			newApportionedDiscountItemDetails.setApplicableKaratageType(applicableKaratageType);
			// Pending: If bill level discounts need to consider minimum order payment %
			// from order config details of discount, to be updated.
			if (discountOtherDetails != null && discountOtherDetails.getMinPaymentPercent() != null)
				newApportionedDiscountItemDetails.setMinPaymentPercent(discountOtherDetails.getMinPaymentPercent());
			else
				newApportionedDiscountItemDetails.setMinPaymentPercent(BigDecimal.ZERO);

			createdDiscountItemDetailsList.add(newApportionedDiscountItemDetails);

			appliedKaratageDiscountValue = appliedKaratageDiscountValue.add(billDiscountApportionedValue);

		}

		log.info("Apportioned Item karatage Discounts - {}", createdDiscountItemDetailsList);

		if (!CollectionUtils.isEmpty(createdDiscountItemDetailsList)) {
			discountDetailsRepository.save(discountDetails);
			discountItemDetailsRepository.saveAll(createdDiscountItemDetailsList);
		}

		return appliedKaratageDiscountValue;

	}

	@Override
	public void validateRivaahDiscounts(SalesTxnDaoExt salesTxn) {
		DiscountTransactionDetails discountTxnDetails = getDiscountTxnDetails(salesTxn);
		if (discountTxnDetails != null && discountTxnDetails.getRivaahCardDetails() != null
				&& discountTxnDetails.getRivaahCardDetails().getCouponCode() != null)
			rivaahCardDiscountServiceImpl.calculateRivaahDiscount(salesTxn,
					DiscountTypeEnum.RIVAAH_CARD_DISCOUNT.name(), Boolean.TRUE);

	}

	@Override
	public void removeRivaahDiscounts(SalesTxnDaoExt salesTxn) {
		List<DiscountDetailsDaoExt> discountdetailsList = discountDetailsRepository
				.findAllBySalesTxnIdAndDiscountTypeIn(salesTxn.getId(),
						Set.of(DiscountTypeEnum.RIVAAH_CARD_DISCOUNT.name()));
		if (!CollectionUtils.isEmpty(discountdetailsList)) {
			discountdetailsList.forEach(discountDetailsDaoExt -> {
				List<DiscountItemDetailsDaoExt> apportionedItemDiscounts = discountItemDetailsRepository
						.findAllByDiscountDetailId(discountDetailsDaoExt.getId());

				if (!CollectionUtils.isEmpty(apportionedItemDiscounts)) {
					Set<String> updatedItemIds = apportionedItemDiscounts.stream()
							.map(DiscountItemDetailsDaoExt::getItemId).collect(Collectors.toSet());

					// Delete the apportioned discount values at item level
					discountItemDetailsRepository.deleteByDiscountDetailId(discountDetailsDaoExt.getId());

					// Update discount values for the impacted items
					updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);
				}
				// Delete bill level discount at sales transaction level
				discountDetailsRepository.deleteById(discountDetailsDaoExt.getId());
			});
		}

	}

	@SuppressWarnings("unchecked")
	@Transactional
	@Override
	public void recalculateCumulateDiscount(Set<String> impactedItemIds, List<DiscountItemDetailsDaoExt> itemDiscounts,
			SalesTxnDaoExt salesTxn, Set<String> itemsToIgnore, String discountIdToCheck, Boolean isPriceUpdate) {

		// recalculation needed if and only if slab or high value discount is present in
		// the list.
		DiscountDetailsDaoExt discountDetailsDaoExt = null;
		String refIdForDiscount = null;
		for (DiscountItemDetailsDaoExt itemDiscountDetail : itemDiscounts) {
			itemsToIgnore.add(itemDiscountDetail.getItemId());
			if (itemDiscountDetail.getDiscountDetail().getDiscountType()
					.equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())
					|| itemDiscountDetail.getDiscountDetail().getDiscountType()
							.equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())) {
				discountDetailsDaoExt = itemDiscountDetail.getDiscountDetail();
				if (refIdForDiscount == null)
					refIdForDiscount = itemDiscountDetail.getDiscountDetail().getReferenceId();

			}
		}

		// no delete or update of anything. Just return as mostly the list will contain
		// BestDeal discount
		if (discountDetailsDaoExt == null && discountIdToCheck == null) {
			return;
		}

		String discountId;
		if (discountDetailsDaoExt != null) {
			discountId = discountDetailsDaoExt.getCumulativeDiscountId() != null
					? discountDetailsDaoExt.getCumulativeDiscountId()
					: discountDetailsDaoExt.getDiscountId();
		} else {
			discountId = discountIdToCheck;
		}
		DiscountDetailsBaseDto discountDetailsBaseDto = engineService.getDiscountConfigDetails(discountId);

		// get items that can be excluded or applicable for cumulative:
		List<String> itemsValidOrExclude = getPossibleExcludeItemsForCummulativeDiscount(salesTxn,
				itemsToIgnore.stream().collect(Collectors.toList()), null);

		DiscountDetailDto discountDetailDto = new DiscountDetailDto();
		discountDetailDto.setDiscountType(discountDetailsBaseDto.getDiscountType());
		discountDetailDto.setDiscountId(discountDetailsBaseDto.getDiscountId());
		discountDetailDto.setDiscountCode(discountDetailsBaseDto.getDiscountCode());
		// dummy value should not be used
		discountDetailDto.setDiscountValue(BigDecimal.ZERO);
		discountDetailDto
				.setIsEdited(discountDetailsDaoExt != null ? discountDetailsDaoExt.getIsEdited() : Boolean.FALSE);
		discountDetailDto.setCumulativeDiscountId(discountDetailsBaseDto.getDiscountId());
		if (discountDetailsDaoExt != null
				&& !StringUtil.isBlankJsonStr(discountDetailsDaoExt.getDiscountValueDetails())) {
			discountDetailDto.setCummulativeDiscountWithExcludeDetails(
					MapperUtil.mapObjToClass(discountDetailsDaoExt.getDiscountValueDetails(), Map.class));
		}
		DiscountOtherDetailsDto discountOtherDetailsDto = getDiscountOtherDetails(salesTxn, discountDetailsBaseDto);
		discountOtherDetailsDto.setIsPriceUpdate(isPriceUpdate);

		Boolean isDiscountApplicable = false;
		SlabBasedDiscountDetailsResponseDto slabDiscountsResponse = null;
		if (refIdForDiscount != null) {
			slabDiscountsResponse = applyCumulativeOrderToCmDiscounts(salesTxn, discountDetailDto, null, itemDiscounts,
					discountDetailsBaseDto.getDiscountId(), itemDiscounts.get(0), itemsValidOrExclude);
			if (slabDiscountsResponse != null
					&& !CollectionUtil.isEmpty(slabDiscountsResponse.getItemDiscountDetails())) {
				isDiscountApplicable = true;
			}
		} else {
			isDiscountApplicable = applyCumulativeDiscounts(salesTxn, discountDetailDto, null, itemDiscounts,
					discountDetailsBaseDto.getDiscountId(), itemsValidOrExclude, discountOtherDetailsDto);
		}

		Map<DiscountDetailsDaoExt, DiscountItemDetailsDaoExt> discountDaoAndDiscountItemDaoMap = itemDiscounts.stream().distinct()
				.filter(discountItemDetailDao -> (List
						.of(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name(), DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
						.contains(discountItemDetailDao.getDiscountDetail().getDiscountType())))
				.collect(Collectors.toMap(DiscountItemDetailsDaoExt::getDiscountDetail, Function.identity()));

		if (BooleanUtils.isTrue(isDiscountApplicable)) {
			discountDaoAndDiscountItemDaoMap.forEach((discountDetailsDao, discountItemDetailsDao) -> discountDetailsDao
					.setDiscountValue(discountItemDetailsDao.getDiscountValue()));
			// update discount value to discount_details table
			discountDetailsRepository.saveAll(discountDaoAndDiscountItemDaoMap.keySet());

		} else {
			// delete 'SLAB_BASED_DISCOUNT' or 'HIGH_VALUE_DISCOUNT' discount of other
			// items, if discount not applicable

			Set<String> itemsToUpdate = discountDaoAndDiscountItemDaoMap.values().stream()
					.map(DiscountItemDetailsDaoExt::getItemId).collect(Collectors.toSet());

			discountItemDetailsRepository.deleteAll(discountDaoAndDiscountItemDaoMap.values());
			discountItemDetailsRepository.flush();
			discountDetailsRepository.deleteAll(discountDaoAndDiscountItemDaoMap.keySet());
			updateTransactionSpecificItemDetails(salesTxn, itemsToUpdate, isPriceUpdate);

		}

	}

	private DiscountOtherDetailsDto getDiscountOtherDetails(SalesTxnDaoExt salesTxn,
			DiscountDetailsBaseDto discountDetailsBaseDto) {

		DiscountOtherDetailsDto discountOtherDetailsDto = new DiscountOtherDetailsDto();
		if (TransactionTypeEnum.AB.name().equals(salesTxn.getTxnType())
				|| TransactionTypeEnum.CO.name().equals(salesTxn.getTxnType())) {
			DiscountOrderConfigDetails orderConfigDetails = discountDetailsBaseDto.getOrderConfigDetails();
			if (orderConfigDetails != null) {
				discountOtherDetailsDto.setMinPaymentPercent(
						TransactionTypeEnum.AB.name().equals(salesTxn.getTxnType()) ? orderConfigDetails.getAbPercent()
								: orderConfigDetails.getCoPercent());
			}
		}
		return discountOtherDetailsDto;
	}

	/**
	 * @param discountDetail
	 * @param salesTxn
	 * @param itemId
	 * @return
	 */
	@Override
	public DiscountEngineResponseDto getEngineResponseDto(String referenceId, String discountId,
			RivaahGhsDiscountDto rivaahGhsDiscountDetails, SalesTxnDaoExt salesTxn, String itemId,
			Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails) {
		DiscountEngineResponseDto discountEngineResponseList = new DiscountEngineResponseDto();
		// New CM current running offers
		if (StringUtils.isEmpty(referenceId)) {

			DiscountCalRequestDto discountEngineRequestDto = getDiscountEngineRequestDto(salesTxn, itemId,
					rivaahGhsDiscountDetails, cummulativeDiscountWithExcludeDetails);

			log.info("Sales - Discount Engine Calculate API Request body - {}",
					MapperUtil.getJsonString(discountEngineRequestDto));

			discountEngineResponseList = engineService.calculateDiscountValue(discountId, null,
					discountEngineRequestDto);

			log.info("Sales - Discount Engine Calculate API Response body - {}",
					MapperUtil.getJsonString(discountEngineResponseList));

		}
		// AB to CM Carry forwarded discounts
		else {

			Optional<DiscountItemDetailsDaoExt> orderItemDiscount = discountItemDetailsRepository
					.findByIdAndDiscountDetailSalesTxnId(referenceId, salesTxn.getRefTxnId().getId());

			if (!orderItemDiscount.isPresent()) {
				throw new ServiceException(SalesConstants.INVALID_REQUEST + "Pre Order discount doesn't exist",
						SalesConstants.ERR_SALE_294,
						Map.of(SalesConstants.REMARKS, "Pre Order discount doesn't exist"));
			}

			// Validate Order items discounts applicability on New items added during CM
			validateOrderDiscountsApplicabilityOnNewItem(salesTxn, itemId);

			AbCoDiscountRequestDto orderToCmDiscountRequestDto = createOrderToCmDiscountRequestDto(salesTxn, itemId,
					orderItemDiscount.get(), rivaahGhsDiscountDetails);
			try {
				log.info("Discount: Order to CM calculate discount request dto - {}", orderToCmDiscountRequestDto);

				discountEngineResponseList = engineService.calculateAbDiscountValue(orderToCmDiscountRequestDto);

				log.info("Discount: Order to CM calculate discount response dto - {}", discountEngineResponseList);
			} catch (Exception ex) {
				return discountEngineResponseList;
			}

		}
		return discountEngineResponseList;
	}

	@Override
	public void checkIfDiscountApplied(SalesTxnDaoExt salesTxnDao) {

		List<DiscountDetailsDaoExt> discountDetailsList = discountDetailsRepository
				.findAllBySalesTxnId(salesTxnDao.getId());

		discountDetailsList.forEach(discountDetails -> {

			JsonData clubConfigsJson = MapperUtil
					.mapObjToClass(discountDetails.getDiscountConfig().getClubbableConfigDetails(), JsonData.class);

			if (!StringUtil.isBlankJsonData(clubConfigsJson)) {
				ClubbingConfigDetails clubConfigsDetails = MapperUtil.mapObjToClass(clubConfigsJson.getData(),
						ClubbingConfigDetails.class);

				if (!BooleanUtils.isNotFalse(clubConfigsDetails.getIsFOCOffer())) {
					Map<String, String> dynamicValues = new HashMap<>();
					dynamicValues.put("discountCode", discountDetails.getDiscountCode());
					throw new ServiceException("FOC offer can't be clubbed with Discount offer applied", "ERR-DISC-038",
							dynamicValues);
				}
			}
		});
	}

	@Override
	public void verifyIfBillLevelDiscountAppliedInTransaction(SalesTxnDaoExt salesTxn, String discountCode) {

		Long billLevelDiscountCount = discountDetailsRepository.countBySalesTxnIdAndDiscountTypeIn(salesTxn.getId(),
				Set.of(DiscountTypeEnum.BILL_LEVEL_DISCOUNT.name()));

		if (billLevelDiscountCount.compareTo(Long.valueOf(0)) > 0) {
			throw new ServiceException(
					discountCode + " can't be clubbed with " + DiscountTypeEnum.BILL_LEVEL_DISCOUNT.name() + " applied",
					SalesConstants.ERR_DISC_027, Map.of(SalesConstants.DISCOUNT_CODE, discountCode,
							SalesConstants.DISCOUNT_TYPE, DiscountTypeEnum.BILL_LEVEL_DISCOUNT.name()));
		}

	}

	@Override
	public void deleteAllBillLevelDiscountDetailsForTheItems(List<DiscountItemDetailsDaoExt> discountItemDetailsList) {

		if (CollectionUtils.isEmpty(discountItemDetailsList)) {
			return;
		}

		List<DiscountDetailsDaoExt> discountDetailsDaoList = discountItemDetailsList.stream()
				.map(DiscountItemDetailsDaoExt::getDiscountDetail).collect(Collectors.toList());

		List<String> discountDetailIds = discountDetailsDaoList.stream().map(DiscountDetailsDaoExt::getId)
				.collect(Collectors.toList());

		List<DiscountItemDetailsDaoExt> impactedItemDiscountDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailIdIn(discountDetailIds);

		impactedItemDiscountDetailsList.removeAll(discountItemDetailsList);

		Map<DiscountDetailsDaoExt, List<DiscountItemDetailsDaoExt>> impactedDiscountDetailAndItemMap = new HashMap<>();
		if (!CollectionUtils.isEmpty(impactedItemDiscountDetailsList)) {
			impactedItemDiscountDetailsList.forEach(itemDiscount -> {
				List<DiscountItemDetailsDaoExt> itemDiscountDetails;
				if (impactedDiscountDetailAndItemMap.containsKey(itemDiscount.getDiscountDetail())) {
					itemDiscountDetails = impactedDiscountDetailAndItemMap.get(itemDiscount.getDiscountDetail());
					itemDiscountDetails.add(itemDiscount);
				} else {
					itemDiscountDetails = new ArrayList<>();
					itemDiscountDetails.add(itemDiscount);
				}
				impactedDiscountDetailAndItemMap.put(itemDiscount.getDiscountDetail(), itemDiscountDetails);
			});
		}

		discountDetailsDaoList.removeAll(impactedDiscountDetailAndItemMap.keySet());

		List<DiscountConfigDetailsDaoExt> discountConfigDaoList = discountDetailsDaoList.stream()
				.map(DiscountDetailsDaoExt::getDiscountConfig).collect(Collectors.toList());

		discountItemDetailsRepository.deleteAll(discountItemDetailsList);

		if (!CollectionUtils.isEmpty(discountDetailsDaoList)) {
			discountDetailsRepository.deleteAll(discountDetailsDaoList);
			discountConfigDetailsRepository.deleteAll(discountConfigDaoList);
		}

		// recalculate discount amount for sharedDiscountDetailsDaoList
		if (!impactedDiscountDetailAndItemMap.isEmpty()) {
			impactedDiscountDetailAndItemMap.forEach((discountDetail, itemDiscountList) -> {
				BigDecimal discountValue = BigDecimal.ZERO;
				for (DiscountItemDetailsDaoExt itemDiscount : itemDiscountList) {
					discountValue = discountValue.add(itemDiscount.getDiscountValue());
				}
				discountDetail.setDiscountValue(discountValue);
			});
			discountDetailsRepository.saveAll(impactedDiscountDetailAndItemMap.keySet());
		}

	}

	@Override
	public List<String> getPossibleExcludeItemsForCummulativeDiscount(SalesTxnDaoExt salesTxn,
			List<String> itemsToIgnore, String productGroupCode) {
		List<String> itemsPossiblyInExclude;

		if (CollectionUtils.isEmpty(itemsToIgnore)) {
			itemsToIgnore = null; // for query check purpose
		}

		if (TransactionTypeEnum.CM.name().equals(salesTxn.getTxnType())) {
			List<CashMemoDetailsDaoExt> cmdList = cashMemoDetailsRepository
					.findAllByCmIdAndTotalDiscountEqualsZeroAndIdNotIn(salesTxn.getId(), itemsToIgnore,
							productGroupCode, null);
			itemsPossiblyInExclude = cmdList.stream().map(CashMemoDetailsDaoExt::getId).collect(Collectors.toList());
		} else {
			// AB or CO
			List<OrderDetailsDaoExt> odList = orderDetailsRepository
					.findAllByOrderIdAndTotalDiscountEqualsZeroAndIdNotIn(salesTxn.getId(), itemsToIgnore,
							productGroupCode, null);
			itemsPossiblyInExclude = odList.stream().map(OrderDetailsDaoExt::getId).collect(Collectors.toList());
		}

		return itemsPossiblyInExclude;
	}

	@Override
	public String checkIfItemCanBeIncludedInSlabOrHighValueDiscount(String discountDetailsAtItem,
			SalesItemDetailsDto salesItemDetailsDto) {

		DiscountApplicableForItemCheckRequestDto request = new DiscountApplicableForItemCheckRequestDto();
		request.setBusinessDate(CalendarUtils.addOffSetTimeZone(businessDayService.getBusinessDay().getBusinessDate()));
		DiscountItemDetailsDto discountItemDto = MapperUtil.mapObjToClass(salesItemDetailsDto,
				DiscountItemDetailsDto.class);
		discountItemDto.setItemId(salesItemDetailsDto.getId());
		discountItemDto.setNetWeight(salesItemDetailsDto.getPriceDetails().getNetWeight());
		request.setItemDetails(discountItemDto);
		request.setDiscountTypeList(
				List.of(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name(), DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name()));

		DiscountApplicableForItemResponseDto response = engineService
				.checkIfGivenDiscountApplicableForGiveItem(request);
		if (response == null || CollectionUtils.isEmpty(response.getValidDiscountDetails())) {
			return discountDetailsAtItem;
		}

		JsonData jsonData = MapperUtil.mapObjToClass(discountDetailsAtItem, JsonData.class);
		ItemDiscountDetailsDto itemDiscountDetailsDtoExisting;
		if (jsonData == null || jsonData.getData() == null) {
			itemDiscountDetailsDtoExisting = new ItemDiscountDetailsDto();
		} else {
			itemDiscountDetailsDtoExisting = MapperUtil.mapObjToClass(jsonData.getData(), ItemDiscountDetailsDto.class);
		}
		itemDiscountDetailsDtoExisting.setValidDiscountDetails(response.getValidDiscountDetails());

		return MapperUtil.getStringFromJson(new JsonData("DISCOUNT_DETAILS", itemDiscountDetailsDtoExisting));
	}

	@Override
	public Set<String> getPossibleExcludeItemsForCummulativeDiscountForAbToCm(SalesTxnDaoExt salesTxn,
			List<String> items, String productGroupCode) {
		Set<String> itemsPossiblyInExclude = new HashSet<>();

		if (CollectionUtils.isEmpty(items)) {
			items = null; // for query check purpose
		}

		// AB or CO
		List<OrderDetailsDaoExt> odList = orderDetailsRepository.findAllByOrderIdAndTotalDiscountEqualsZeroAndIdNotIn(
				salesTxn.getRefTxnId().getId(), null, productGroupCode, items);

		getExcludeItemsOnly(itemsPossiblyInExclude, odList.stream()
				.filter(discountDetails -> discountDetails.getDiscountDetails() != null)
				.collect(Collectors.toMap(OrderDetailsDaoExt::getId, OrderDetailsDaoExt::getDiscountDetails)));

		if (CollectionUtils.isEmpty(itemsPossiblyInExclude)) {
			return new HashSet<>();
		}

		List<CashMemoDetailsDaoExt> cmdList = cashMemoDetailsRepository
				.findAllByCmIdAndTotalDiscountEqualsZeroAndOrderItemIdIn(salesTxn.getId(), productGroupCode,
						itemsPossiblyInExclude);
		return cmdList.stream().map(CashMemoDetailsDaoExt::getId).collect(Collectors.toSet());// as we need items of CM
	}

	private void getExcludeItemsOnly(Set<String> itemsPossiblyInExclude, Map<String, String> itemIdAndDiscountDetails) {

		itemIdAndDiscountDetails.forEach((id, discountDetails) -> {
			JsonData jsonData = MapperUtil.mapObjToClass(discountDetails, JsonData.class);
			if (jsonData != null) {
				ItemDiscountDetailsDto itemDiscountDetailsDtoExisting = MapperUtil.mapObjToClass(jsonData.getData(),
						ItemDiscountDetailsDto.class);
				if (itemDiscountDetailsDtoExisting != null
						&& !CollectionUtils.isEmpty(itemDiscountDetailsDtoExisting.getValidDiscountDetails())) {
					itemDiscountDetailsDtoExisting.getValidDiscountDetails().values().forEach(data -> {
						if (BooleanUtils.isTrue(data.getIsExclude())) {
							itemsPossiblyInExclude.add(id);
						}

					});
				}
			}
		});
	}

	@Override
	public PaymentDetailsDaoExt disableIsDiscountPresent(PaymentDetailsDaoExt paymentDetailsDao) {
		CreditNotePaymentOtherDetailsDto cnOtherDetails = MapperUtil.mapObjToClass(
				MapperUtil.mapObjToClass(paymentDetailsDao.getOtherDetails(), JsonData.class).getData(),
				CreditNotePaymentOtherDetailsDto.class);
		cnOtherDetails.setIsDiscountPresent(false);
		paymentDetailsDao.setOtherDetails(
				MapperUtil.getStringFromJson(new JsonData(paymentDetailsDao.getPaymentCode(), cnOtherDetails)));
		return paymentDetailsDao;
	}
}
