/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.config.dto.request.json.OrderConfigDetails;
import com.titan.poss.core.discount.dto.ClubbingDiscountDetailsDto;
import com.titan.poss.core.discount.dto.CummulativeDiscountWithExcludeDto;
import com.titan.poss.core.discount.dto.DiscountCalRequestDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseResponseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountEngineResponseDto;
import com.titan.poss.core.discount.dto.DiscountProductGroupMappingDto;
import com.titan.poss.core.discount.dto.LinkDiscountDetailsDto;
import com.titan.poss.core.discount.dto.LocationOfferDetails;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.discount.dto.SlabConfigDetails;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.AbCoDiscountRequestDto;
import com.titan.poss.core.dto.BaseBasicCriteriaDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountConfigDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.DiscountValueDetailsObjectDto;
import com.titan.poss.sales.dto.ItemDiscountDetailsDto;
import com.titan.poss.sales.dto.request.DiscountItemLevelCreateDto;
import com.titan.poss.sales.dto.request.DiscountItemUpdateDto;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.dto.response.OrderItemDiscountsResponseDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountConfigDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.DiscountItemFacadeService;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.OrderUtilService;

import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation class for item level discount
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesDiscountItemFacadeServiceimpl")
public class DiscountItemFacadeServiceImpl implements DiscountItemFacadeService {

	@Autowired
	private CommonTransactionService commonTransactionService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountFactory discountFactory;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Autowired
	private OrderUtilService orderUtilService;

	@Autowired
	private OrderDetailsRepositoryExt orderDetailsRepository;

	@Autowired
	private DiscountConfigDetailsRepositoryExt discountConfigDetailsRepository;

	@Autowired
	private BusinessDayService businessDayService;
	
	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepository;

	@Override
	@Transactional
	public DiscountResponseDto saveDiscounts(String transactionId, String txnType, String subTxnType, String itemId,
			DiscountItemLevelCreateDto discountCreateDto) {

		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to add discount
		commonTransactionService.checkTranscationStatusForUpdate(salesTxn.getStatus());

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		List<DiscountDetailResponseDto> discountDetailsResponseList = new ArrayList<>();

		// Check if any discounts applied before
		List<DiscountItemDetailsDaoExt> discountItemDetails = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdIn(salesTxn,
						DiscountApplicableLevelEnum.ITEM_LEVEL.name(), List.of(itemId));

		if (!CollectionUtils.isEmpty(discountItemDetails)) {
			throw new ServiceException("Please remove the old discounts to apply new discount for a item",
					"ERR-DISC-022");
		}

		if (!CollectionUtils.isEmpty(discountCreateDto.getDiscountDetails())) {

			// ITEM_LEVEL discounts
			validateAndCreateDiscountDetails(itemId, discountCreateDto, salesTxn, discountDetailsResponseList);
		}

		// RIVAAH DISCOUNT VALIDATION
		discountUtilService.validateRivaahDiscounts(salesTxn);

		return new DiscountResponseDto(discountDetailsResponseList);
	}

	@Override
	public DiscountResponseDto listDiscounts(String transactionId, String txnType, String subTxnType, String itemId) {

		// Validate sales transaction
		commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId, txnType);

		List<DiscountDetailResponseDto> discountDetailsResponseList = new ArrayList<>();

		// Get applicable discount details
		listItemLevelDiscountDetails(transactionId, itemId, discountDetailsResponseList);

		return new DiscountResponseDto(discountDetailsResponseList);
	}

	@Override
	@Transactional
	public void deleteDiscount(String transactionId, String txnType, String subTxnType, String itemId,
			String discountTxnId) {

		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to add discount
		commonTransactionService.checkTranscationStatusForUpdate(salesTxn.getStatus());

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		// Pending: Restrict Delete of order discounts with 'is allowed to change' =
		// false

		DiscountItemDetailsDaoExt discountItemDetailsDao = getDiscountItemDetailsIfExists(itemId, discountTxnId,
				salesTxn);

		List<DiscountItemDetailsDaoExt> itemDiscountsToBeDeleted = new ArrayList<>();

		Set<String> impactedItemIds = new HashSet<>();

		// If Clubbed or Cumulative discounts, dependent discounts will be deleted
		// together
		// Pending: Multiple level of Cumulative & clubbed discount to be deleted too
		if (!StringUtils.isEmpty(discountItemDetailsDao.getDiscountDetail().getClubbedDiscountId())) {
			itemDiscountsToBeDeleted = discountItemDetailsRepository
					.findAllByDiscountDetailSalesTxnAndDiscountDetailClubbedDiscountIdAndItemIdIn(salesTxn,
							discountItemDetailsDao.getDiscountDetail().getClubbedDiscountId(), itemId);
		}
		List<DiscountItemDetailsDaoExt> itemDiscounts = new ArrayList<>();
		if (!StringUtils.isEmpty(discountItemDetailsDao.getDiscountDetail().getCumulativeDiscountId())) {

			itemDiscounts = discountItemDetailsRepository
					.findAllByDiscountDetailSalesTxnAndDiscountDetailCumulativeDiscountIdIn(salesTxn,
							List.of(discountItemDetailsDao.getDiscountDetail().getCumulativeDiscountId()));
			// All the other items as part of cumulative discounts should be updated with
			// latest value
			itemDiscounts.remove(discountItemDetailsDao);
			impactedItemIds = itemDiscounts.stream().map(DiscountItemDetailsDaoExt::getItemId)
					.collect(Collectors.toSet());
		}

		// If Clubbed discounts or Cumulative discounts not found, will be deleted
		// independently
		if (CollectionUtils.isEmpty(itemDiscountsToBeDeleted))

		{
			itemDiscountsToBeDeleted.add(discountItemDetailsDao);
		}

		discountUtilService.removeRivaahDiscounts(salesTxn);

		// Delete discount details
		discountUtilService.deleteAllItemDiscountDetails(itemDiscountsToBeDeleted);

		if (!impactedItemIds.isEmpty() && (discountItemDetailsDao.getDiscountDetail().getDiscountType()
				.equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())
				|| discountItemDetailsDao.getDiscountDetail().getDiscountType()
						.equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name()))) {

			Set<String> itemsToIgnore = new HashSet<>();
			itemsToIgnore.add(itemId);

			discountUtilService.recalculateCumulateDiscount(impactedItemIds, itemDiscounts, salesTxn, itemsToIgnore,
					null, false);

		}

		// Find all Item Level discounts applied for a item
		List<DiscountItemDetailsDaoExt> discountItemDetails = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdIn(salesTxn,
						com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum.ITEM_LEVEL.name(),
						List.of(itemId));

		// if no other discount is present in item and item is excluded for certain
		// discount, then update cumulative discount
		if (CollectionUtils.isEmpty(discountItemDetails)) {
			checkForExcludeItemdiscountUpdate(itemId, salesTxn, true, true);
		}

		impactedItemIds.add(itemId);

		// Update discount value & final value of impacted items
		discountUtilService.updateTransactionSpecificItemDetails(salesTxn, impactedItemIds, false);

		// RIVAAH VALIDATION
		discountUtilService.validateRivaahDiscounts(salesTxn);

	}

	@Override
	@Transactional
	public DiscountDetailResponseDto updateDiscount(String transactionId, String txnType, String subTxnType,
			String itemId, String discountTxnId, DiscountItemUpdateDto discountUpdateDto) {

		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to add discount
		commonTransactionService.checkTranscationStatusForUpdate(salesTxn.getStatus());

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);

		// TBD: Call discount engine api to fetch discount config & value details is
		// required or not?

		DiscountItemDetailsDaoExt discountItemDetailsDao = getDiscountItemDetailsIfExists(itemId, discountTxnId,
				salesTxn);

		JsonData basicCriteriaJson = MapperUtil.mapObjToClass(
				discountItemDetailsDao.getDiscountDetail().getDiscountConfig().getBasicCriteriaDetails(),
				JsonData.class);

		log.info("Discount basic criteria config details json - {}", basicCriteriaJson);

		BaseBasicCriteriaDetails baseBasicCriteriaDetails = MapperUtil.mapObjToClass(basicCriteriaJson.getData(),
				BaseBasicCriteriaDetails.class);

		log.info("Basic Criteria mapped Dto - {}", baseBasicCriteriaDetails);

		// Validate Common basic criteria like IsEditable & updated discountValue
		discountUtilService.validateCommonBasicCriteriaConfigs(baseBasicCriteriaDetails,
				discountUpdateDto.getDiscountValue(), discountUpdateDto.getIsEdited(),
				discountItemDetailsDao.getDiscountValue(),
				discountItemDetailsDao.getDiscountDetail().getDiscountCode());

		// Update item discount details
		DiscountDetailResponseDto discountDetailResponseDto = updateItemDiscountDetails(discountUpdateDto,
				discountItemDetailsDao);
		if(discountUpdateDto.getIsEdited() != null)
			discountDetailResponseDto.setIsEdited(discountUpdateDto.getIsEdited());

		// Update discount value & final value of impacted items
		discountUtilService.updateTransactionSpecificItemDetails(salesTxn, Set.of(itemId), false);
		// RIVAAH VALIDATION
		discountUtilService.validateRivaahDiscounts(salesTxn);
		return discountDetailResponseDto;
	}

	public void validateAndCreateDiscountDetails(String itemId, DiscountItemLevelCreateDto discountCreateDto,
			SalesTxnDaoExt salesTxn, List<DiscountDetailResponseDto> discountDetailsResponseList) {
		List<DiscountDetailsDaoExt> discountDetailsList = new ArrayList<>();

		List<DiscountItemDetailsDaoExt> discountItemDetailsList = new ArrayList<>();

		// Pending: If clubbed discount(list of discounts), RefDiscountId should be same
		// for all

		discountCreateDto.getDiscountDetails().forEach(discountDetail -> {
			// call factory service to invoke appropriate service implementation w.r.t
			// discountType.
			DiscountService	discountService = discountFactory.getDiscountService(discountDetail.getDiscountType());

			// Discount type specific validation - Eligibility to get this discount
			discountService.validateDiscountEligibililty(salesTxn, discountDetail, itemId);

			DiscountOtherDetailsDto discountOtherDetails = new DiscountOtherDetailsDto();

			// Pending: Framing Engine request specific to discount type
			// Category discount: customer details(encircle date,ulp id),item details(item
			// code,lot no,price details,)
			// Employee : Coupon code list as input
			// Tata employee: Max count,employee name, upload id data as input to engine
			// Encircle: IsEligible for B'day/spouse b'day/anniversary flag, item details
			// Item group level : customer details(encircle date),item details
			// TSSS : TSSS coupon details
			// Best Deal discount:customer details(encircle date),item detail
			// RIVAAH GHS: RIVAAH GHS details, item details
			DiscountEngineResponseDto discountEngineResponseList = discountUtilService.getEngineResponseDto(
					discountDetail.getReferenceId(), discountDetail.getDiscountId(),
					discountDetail.getRivaahGhsDiscountDetails(), salesTxn, itemId,
					discountDetail.getCummulativeDiscountWithExcludeDetails());

			DiscountDetailsResponseDto discountEngineResponse = discountEngineResponseList
					.getDiscountDetailsResponseDto().get(0);

			// Validate Common basic criteria validations applicable across discount types
			discountUtilService.validateCommonBasicCriteriaConfigs(
					discountEngineResponse.getDiscountConfigDetails().getBasicCriteriaDetails(),
					discountDetail.getDiscountValue(), discountDetail.getIsEdited(),
					discountEngineResponse.getDiscountValue(),
					discountEngineResponse.getDiscountConfigDetails().getDiscountCode());

			// Validate Eligible Club offer configs
			discountUtilService.validateCommonEligibleClubOfferConfigs(
					discountEngineResponse.getDiscountConfigDetails().getClubbingDetails(),
					discountEngineResponse.getDiscountConfigDetails().getDiscountCode(), salesTxn);

			DiscountDetailsDaoExt discountDetailsDaoExt = new DiscountDetailsDaoExt();

			// ----------Discount type specific operations----------

			// Validate Discount type specific eligible club offers
			discountService.validateEligibleClubOfferConfigs(
					discountEngineResponse.getDiscountConfigDetails().getClubbingDetails(),
					discountEngineResponse.getDiscountConfigDetails().getDiscountCode(), salesTxn);

			// If Order transactions, validate applicable order configs
			if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.name())) {
				discountService.validateOrderConfigs(salesTxn,
						discountEngineResponse.getDiscountConfigDetails().getOrderConfigDetails(), discountOtherDetails,
						discountEngineResponse.getDiscountConfigDetails().getDiscountCode());
			}

			log.info("Discount create DTo details from UI- {}", discountDetail);

			// If not edited, save the discount engine value
			if (BooleanUtils.isFalse(discountDetail.getIsEdited())) {
				discountDetail.setDiscountValueDetails(new JsonData("DISCOUNT_VALUE_DETAILS",
						new DiscountValueDetailsObjectDto(discountEngineResponse.getDiscountValueDetails())));
				discountDetail.setDiscountValue(discountEngineResponse.getDiscountValue());

				log.info("Discount create Dto details overrided by discount engine values- {}", discountDetail);
			}

			discountOtherDetails.setItemId(itemId);

			// Add discount
			discountDetailsDaoExt = discountService.addDiscount(salesTxn, discountDetail, discountEngineResponse,
					discountOtherDetails);

			// Create Item level discount details
			discountItemDetailsList.add(discountUtilService.getItemDiscountDetails(itemId, discountDetailsDaoExt,
					discountOtherDetails, discountDetail.getDiscountValueDetails()));

			discountDetailsList.add(discountDetailsDaoExt);
		});

		discountDetailsRepository.saveAll(discountDetailsList);

		discountItemDetailsRepository.saveAll(discountItemDetailsList);

		discountUtilService.updateTransactionSpecificItemDetails(salesTxn, Set.of(itemId), false);
		
		List<DiscountItemDetailsDaoExt> applicableCumulativeitems = new ArrayList<>();
		// Get slab discount linked to best deal discount, which is going to add
		if (discountCreateDto.getDiscountDetails().get(0).getDiscountType().equals(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name())) {
			List<DiscountItemDetailsDaoExt> slabItemDetailsDaoList = discountItemDetailsRepository
					.findAllByDiscountDetailSalesTxnAndDiscountDetailDiscountType(salesTxn,
							DiscountTypeEnum.SLAB_BASED_DISCOUNT.name());
			if (!slabItemDetailsDaoList.isEmpty()) {

				for (DiscountItemDetailsDaoExt slab : slabItemDetailsDaoList) {
					JsonData json = MapperUtil.mapObjToClass(
							slab.getDiscountDetail().getDiscountConfig().getLinkedDiscountDetails(), JsonData.class);

					LinkDiscountDetailsDto linkDiscountDetailsDto = MapperUtil.mapObjToClass(json.getData(),
							LinkDiscountDetailsDto.class);
					if (linkDiscountDetailsDto != null && !linkDiscountDetailsDto.getLinkDiscountDetails().isEmpty()) {
						for (String linkedId : linkDiscountDetailsDto.getLinkDiscountDetails()) {
							if (discountCreateDto.getDiscountDetails().get(0).getDiscountId()
									.equalsIgnoreCase(linkedId))
								applicableCumulativeitems.add(slab);
						}
					}

				}
			}
			if (!applicableCumulativeitems.isEmpty()) {
				calculateCumulativeDiscount(applicableCumulativeitems,
						slabItemDetailsDaoList.get(slabItemDetailsDaoList.size() - 1), salesTxn);
			} else {
				// if exclude item gets other discount(non linked BestDeal discount), then also
				// ignore it from cumulative discount consideration
				checkForExcludeItemdiscountUpdate(itemId, salesTxn, true, false);
			}
		} else {
			// if exclude item gets other discount, then also ignore it from cumulative
			// discount consideration
			checkForExcludeItemdiscountUpdate(itemId, salesTxn, true, false);
		}

		// pending: Get maximum of min payment percent for all discounts for a item and
		// calculate min discount payment and update order details

		discountItemDetailsList.forEach(discountItemDetail -> {
			DiscountDetailResponseDto discountDetailResponseDto = getDiscountItemDetailsResponseDto(discountItemDetail);
			discountDetailsResponseList.add(discountDetailResponseDto);
		});

	}

	@SuppressWarnings("unchecked")
	private void calculateCumulativeDiscount(List<DiscountItemDetailsDaoExt> applicableCumulativeitems,
			DiscountItemDetailsDaoExt discountItemDetailsDaoExt, SalesTxnDaoExt salesTxn) {
		DiscountDetailDto discountDetail = createDiscountDetailsDto(discountItemDetailsDaoExt);

		DiscountOtherDetailsDto discountOtherDetails = new DiscountOtherDetailsDto();

		DiscountEngineResponseDto discountEngineResponseList = discountUtilService.getEngineResponseDto(
				discountDetail.getReferenceId(), discountDetail.getDiscountId(),
				discountDetail.getRivaahGhsDiscountDetails(), salesTxn, discountItemDetailsDaoExt.getItemId(),
				MapperUtil.mapObjToClass(discountItemDetailsDaoExt.getDiscountDetail().getDiscountValueDetails(),
						Map.class));

		DiscountDetailsResponseDto discountEngineResponse = discountEngineResponseList.getDiscountDetailsResponseDto()
				.get(0);

		// If not edited, save the discount engine value
		if (BooleanUtils.isFalse(discountDetail.getIsEdited())) {
			discountDetail.setDiscountValueDetails(new JsonData("DISCOUNT_VALUE_DETAILS",
					new DiscountValueDetailsObjectDto(discountEngineResponse.getDiscountValueDetails())));
			discountDetail.setDiscountValue(discountEngineResponse.getDiscountValue());

		}
		String itemId = discountItemDetailsDaoExt.getItemId();
		
		DiscountDetailsDaoExt details = discountItemDetailsDaoExt.getDiscountDetail();
		
		DiscountConfigDetailsDaoExt configs = discountItemDetailsDaoExt.getDiscountDetail().getDiscountConfig();
		
		discountItemDetailsRepository.delete(discountItemDetailsDaoExt);
		discountItemDetailsRepository.flush();
		
		discountDetailsRepository.delete(details);
		discountDetailsRepository.flush();

		discountConfigDetailsRepository.delete(configs);
		discountConfigDetailsRepository.flush();
		
		discountOtherDetails.setItemId(itemId);

		DiscountService discountService = discountFactory.getDiscountService(discountDetail.getDiscountType());

		List<DiscountDetailsDaoExt> discountDetailsList = new ArrayList<>();

		List<DiscountItemDetailsDaoExt> discountItemDetailsList = new ArrayList<>();

		DiscountDetailsDaoExt discountDetailsDaoExt = new DiscountDetailsDaoExt();
		// Add discount
		discountDetailsDaoExt = discountService.addDiscount(salesTxn, discountDetail, discountEngineResponse,
				discountOtherDetails);

		// Create Item level discount details
		discountItemDetailsList.add(discountUtilService.getItemDiscountDetails(itemId, discountDetailsDaoExt,
				discountOtherDetails, discountDetail.getDiscountValueDetails()));

		discountDetailsList.add(discountDetailsDaoExt);

		discountDetailsRepository.saveAll(discountDetailsList);

		discountItemDetailsRepository.saveAll(discountItemDetailsList);

		discountUtilService.updateTransactionSpecificItemDetails(salesTxn, Set.of(itemId), false);

	}

	@SuppressWarnings("unchecked")
	private DiscountDetailDto createDiscountDetailsDto(DiscountItemDetailsDaoExt discountItemDetailsDaoExt) {
		DiscountDetailDto discountDetails = new DiscountDetailDto();
		discountDetails.setDiscountCode(discountItemDetailsDaoExt.getDiscountDetail().getDiscountCode());
		discountDetails.setDiscountType(discountItemDetailsDaoExt.getDiscountDetail().getDiscountType());
		discountDetails.setDiscountId(discountItemDetailsDaoExt.getDiscountDetail().getDiscountId());
		discountDetails.setDiscountValue(discountItemDetailsDaoExt.getDiscountValue());
		discountDetails.setDiscountValueDetails(
				MapperUtil.mapObjToClass(discountItemDetailsDaoExt.getDiscountValueDetails(), JsonData.class));
		discountDetails.setReferenceId(discountItemDetailsDaoExt.getDiscountDetail().getReferenceId());
		discountDetails.setReferenceType(discountItemDetailsDaoExt.getDiscountDetail().getReferenceType());
		discountDetails.setIsEdited(discountItemDetailsDaoExt.getDiscountDetail().getIsEdited());
		discountDetails.setIsAutoApplied(discountItemDetailsDaoExt.getDiscountDetail().getIsAutoApplied());
		discountDetails.setReason(discountItemDetailsDaoExt.getDiscountDetail().getReason());
		discountDetails.setClubbedDiscountId(discountItemDetailsDaoExt.getDiscountDetail().getClubbedDiscountId());
		discountDetails
				.setCumulativeDiscountId(discountItemDetailsDaoExt.getDiscountDetail().getCumulativeDiscountId());
		discountDetails.setLinkedDiscountId(discountItemDetailsDaoExt.getDiscountDetail().getLinkedDiscountId());
		discountDetails.setDiscountSubType(discountItemDetailsDaoExt.getDiscountDetail().getDiscountSubType());

		// temp
		if (!StringUtil.isBlankJsonStr(discountItemDetailsDaoExt.getDiscountDetail().getDiscountValueDetails())) {
			discountDetails.setCummulativeDiscountWithExcludeDetails(MapperUtil
					.mapObjToClass(discountItemDetailsDaoExt.getDiscountDetail().getDiscountValueDetails(), Map.class));
		} // temp end

		return discountDetails;
	}

	private void listItemLevelDiscountDetails(String transactionId, String itemId,
			List<DiscountDetailResponseDto> discountDetailsResponseList) {

		List<DiscountItemDetailsDaoExt> discountItemDetails = discountItemDetailsRepository
				.findAllByItemIdAndDiscountDetailSalesTxnId(itemId, transactionId);
		discountItemDetails.forEach(discountItemDetail -> {
			DiscountDetailResponseDto discountDetailResponseDto = getDiscountItemDetailsResponseDto(discountItemDetail);
			discountDetailsResponseList.add(discountDetailResponseDto);
		});

	}

	public DiscountDetailResponseDto updateItemDiscountDetails(DiscountItemUpdateDto discountUpdateDto,
			DiscountItemDetailsDaoExt discountItemDetailsDao) {

		DiscountDetailResponseDto discountDetailResponseDto;

		// Update discount value at sales txn level
		discountItemDetailsDao.getDiscountDetail().setDiscountValue(
				discountUpdateDto.getDiscountValue().setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));
		discountItemDetailsDao
				.setDiscountValueDetails(MapperUtil.getStringFromJson(discountUpdateDto.getDiscountValueDetails()));

		// Update discount value at discount item details
		discountItemDetailsDao.setDiscountValue(
				discountUpdateDto.getDiscountValue().setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));

		discountDetailsRepository.save(discountItemDetailsDao.getDiscountDetail());
		discountItemDetailsRepository.save(discountItemDetailsDao);

		discountDetailResponseDto = getDiscountItemDetailsResponseDto(discountItemDetailsDao);

		return discountDetailResponseDto;
	}

	private DiscountItemDetailsDaoExt getDiscountItemDetailsIfExists(String itemId, String discountTxnId,
			SalesTxnDaoExt salesTxn) {
		Optional<DiscountItemDetailsDaoExt> discountItemDetailsDaoExt = discountItemDetailsRepository
				.findByIdAndItemIdAndDiscountDetailSalesTxnId(discountTxnId, itemId, salesTxn.getId());

		if (!discountItemDetailsDaoExt.isPresent()) {
			throw new ServiceException("Item Discount details doesn't exist", "ERR-DISC-006",
					"Discount does not exist for a requested item" + itemId);
		}
		return discountItemDetailsDaoExt.get();
	}

	private DiscountDetailResponseDto getDiscountItemDetailsResponseDto(DiscountItemDetailsDaoExt discountItemDetail) {

		DiscountDetailResponseDto discountDetailResponseDto = (DiscountDetailResponseDto) MapperUtil
				.getDtoMapping(discountItemDetail.getDiscountDetail(), DiscountDetailResponseDto.class);
		// TBD: which discount id to be passed in response discount detail id or
		// discount item detail id?
		discountDetailResponseDto.setDiscountValue(discountItemDetail.getDiscountValue());
		discountDetailResponseDto.setDiscountTxnId(discountItemDetail.getId());
		discountDetailResponseDto.setItemId(discountItemDetail.getItemId());
		discountDetailResponseDto.setDiscountValueDetails(
				MapperUtil.mapObjToClass(discountItemDetail.getDiscountValueDetails(), JsonData.class));
		discountDetailResponseDto.setBasicCriteriaDetails(MapperUtil.mapObjToClass(
				discountItemDetail.getDiscountDetail().getDiscountConfig().getBasicCriteriaDetails(), JsonData.class));
		discountDetailResponseDto.setOrderConfigDetails(MapperUtil.mapObjToClass(
				discountItemDetail.getDiscountDetail().getDiscountConfig().getOrderConfigDetails(), JsonData.class));
		if (discountItemDetail.getIsRivaahDiscount() == null) {
			discountDetailResponseDto.setDiscountAttributes(MapperUtil.mapObjToClass(
					discountItemDetail.getDiscountDetail().getDiscountConfig().getDiscountAttributes(),
					JsonData.class));
		} else {
			Optional<DiscountDetailsDaoExt> rivaahItemDetails = discountDetailsRepository.findByIdAndSalesTxnId(
					discountItemDetail.getDiscountDetail().getRivaahCardDiscountId(),
					discountItemDetail.getDiscountDetail().getSalesTxn().getId());
			if (rivaahItemDetails.isPresent())
				discountDetailResponseDto.setDiscountAttributes(MapperUtil.mapObjToClass(
						rivaahItemDetails.get().getDiscountConfig().getDiscountAttributes(), JsonData.class));
		}
		// used for RIVAAH GHS discount calculation
		discountDetailResponseDto.setTxnLevelDiscountValueDetails(MapperUtil
				.mapObjToClass(discountItemDetail.getDiscountDetail().getDiscountValueDetails(), Object.class));

		//setting CummulativeDiscountWithExcludeDetails for slab based and high value discount 
		if(discountItemDetail.getDiscountDetail().getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())||
				discountItemDetail.getDiscountDetail().getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name()))
		{
			Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDto=  MapperUtil.mapObjToClass(discountItemDetail.getDiscountDetail().getDiscountValueDetails(),
					Map.class);
			discountDetailResponseDto.setCummulativeDiscountWithExcludeDetails(cummulativeDiscountWithExcludeDto);
		}
		return discountDetailResponseDto;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public void updateItemDiscounts(String transactionId, String txnType, String subTxnType, String itemId,
			Boolean isPriceUpdate, Map<String, List<DiscountItemDetailsDaoExt>> applicableCumulativeItemsMap) {

		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to update discount
		discountUtilService.checkSalesTranscationStatusForDiscount(salesTxn.getStatus(), txnType);

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		List<DiscountItemDetailsDaoExt> itemDiscountDetails = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemId(salesTxn,
						DiscountApplicableLevelEnum.ITEM_LEVEL.name(), itemId);

		// If No discount found for a item, return
		if (CollectionUtils.isEmpty(itemDiscountDetails)) {
			return;
		}

		List<DiscountDetailsDaoExt> updatedDiscountDetails = new ArrayList<>();
		List<DiscountConfigDetailsDaoExt> updatedDiscountConfigDetails = new ArrayList<>();
		List<DiscountItemDetailsDaoExt> rivaahDiscountList = new ArrayList<>();

		itemDiscountDetails.forEach(itemDiscountDetail -> {

			if (BooleanUtils.isTrue(itemDiscountDetail.getIsRivaahDiscount())) {
				rivaahDiscountList.add(itemDiscountDetail);
			} else {
				DiscountEngineResponseDto discountEngineResponseList = new DiscountEngineResponseDto();
				RivaahGhsDiscountDto rivaahGhsDetails = null;
				if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()
						.equals(itemDiscountDetail.getDiscountDetail().getDiscountType())) {
					rivaahGhsDetails = MapperUtil.mapObjToClass(
							MapperUtil.mapObjToClass(itemDiscountDetail.getDiscountDetail().getDiscountValueDetails(),
									JsonData.class).getData(),
							RivaahGhsDiscountDto.class);
				}

				DiscountDetailsResponseDto discountEngineResponse = null;
				if (StringUtils.isEmpty(itemDiscountDetail.getDiscountDetail().getReferenceId())) {
					DiscountDetailsDaoExt discountDetails = itemDiscountDetail.getDiscountDetail();

					if (BooleanUtils.isTrue(isPriceUpdate) && DiscountTypeEnum.SLAB_BASED_DISCOUNT.name()
							.equals(itemDiscountDetail.getDiscountDetail().getDiscountType())) {
						SlabConfigDetails slabDetails = MapperUtil.mapJsonDataToClass(
								itemDiscountDetail.getDiscountDetail().getDiscountConfig().getSlabConfigDetails(),
								SlabConfigDetails.class);

						if (SalesConstants.CARAT_BASED.equalsIgnoreCase(slabDetails.getDiscountCategory())) {
							DiscountCalRequestDto discountEngineRequestDto = discountUtilService
									.getDiscountEngineRequestDto(salesTxn, itemId, rivaahGhsDetails, null);

							log.info("Sales - Discount Engine Calculate API Request body - {}",
									MapperUtil.getJsonString(discountEngineRequestDto));

							discountEngineResponseList = engineService.calculateDiscountValue(
									itemDiscountDetail.getDiscountDetail().getDiscountId(), null,
									discountEngineRequestDto);

							log.info("Sales - Discount Engine Calculate API Response body - {}",
									MapperUtil.getJsonString(discountEngineResponseList));

							discountEngineResponse = discountEngineResponseList.getDiscountDetailsResponseDto().get(0);
						} else {
							List<DiscountItemDetailsDaoExt> applicableCumDiscounts;
							if (applicableCumulativeItemsMap.containsKey(discountDetails.getCumulativeDiscountId())) {
								applicableCumDiscounts = applicableCumulativeItemsMap
										.get(discountDetails.getCumulativeDiscountId());
							} else {
								applicableCumDiscounts = new ArrayList<>();
							}
							applicableCumDiscounts.add(itemDiscountDetail);
							applicableCumulativeItemsMap.put(discountDetails.getCumulativeDiscountId(),
									applicableCumDiscounts);
						}

					} else {

						Map<String, CummulativeDiscountWithExcludeDto> cumDiscountDetailsMap = null;

						if (DiscountTypeEnum.SLAB_BASED_DISCOUNT.name()
								.equals(itemDiscountDetail.getDiscountDetail().getDiscountType())
								&& !StringUtil.isBlankJsonStr(discountDetails.getDiscountValueDetails())) {
							cumDiscountDetailsMap = MapperUtil.mapObjToClass(discountDetails.getDiscountValueDetails(),
									Map.class);
						}

						DiscountCalRequestDto discountEngineRequestDto = discountUtilService
								.getDiscountEngineRequestDto(salesTxn, itemId, rivaahGhsDetails, cumDiscountDetailsMap);

						log.info("Sales - Discount Engine Calculate API Request body - {}",
								MapperUtil.getJsonString(discountEngineRequestDto));

						discountEngineResponseList = engineService.calculateDiscountValue(
								itemDiscountDetail.getDiscountDetail().getDiscountId(), null, discountEngineRequestDto);

						log.info("Sales - Discount Engine Calculate API Response body - {}",
								MapperUtil.getJsonString(discountEngineResponseList));

						discountEngineResponse = discountEngineResponseList.getDiscountDetailsResponseDto().get(0);

						if (BooleanUtils.isTrue(isPriceUpdate)
								&& DiscountTypeEnum.BEST_DEAL_DISCOUNT.name()
										.equals(itemDiscountDetail.getDiscountDetail().getDiscountType())
								&& discountDetails.getCumulativeDiscountId() != null) {
							List<DiscountItemDetailsDaoExt> applicableCumDiscounts;
							if (applicableCumulativeItemsMap.containsKey(discountDetails.getCumulativeDiscountId())) {
								applicableCumDiscounts = applicableCumulativeItemsMap
										.get(discountDetails.getCumulativeDiscountId());
							} else {
								applicableCumDiscounts = new ArrayList<>();
							}
							applicableCumDiscounts.add(itemDiscountDetail);
							applicableCumulativeItemsMap.put(discountDetails.getCumulativeDiscountId(),
									applicableCumDiscounts);
						}

					}

				} else {

					Optional<DiscountItemDetailsDaoExt> orderItemDiscount = discountItemDetailsRepository
							.findByIdAndDiscountDetailSalesTxnId(
									itemDiscountDetail.getDiscountDetail().getReferenceId(),
									salesTxn.getRefTxnId().getId());

					if (!orderItemDiscount.isPresent()) {
						throw new ServiceException(SalesConstants.INVALID_REQUEST + "Pre Order discount doesn't exist",
								SalesConstants.ERR_SALE_294,
								Map.of(SalesConstants.REMARKS, "Pre Order discount doesn't exist"));
					}

					AbCoDiscountRequestDto orderToCmDiscountRequestDto = discountUtilService
							.createOrderToCmDiscountRequestDto(salesTxn, itemId, orderItemDiscount.get(),
									rivaahGhsDetails);

					log.info("Discount: Order to CM calculate discount request dto - {}", orderToCmDiscountRequestDto);

					discountEngineResponseList = engineService.calculateAbDiscountValue(orderToCmDiscountRequestDto);

					log.info("Discount: Order to CM calculate discount response dto - {}", discountEngineResponseList);

					discountEngineResponse = discountEngineResponseList.getDiscountDetailsResponseDto().get(0);

				}

				if (discountEngineResponse != null) {
					itemDiscountDetail.setDiscountValue(discountEngineResponse.getDiscountValue());
					itemDiscountDetail.getDiscountDetail().setDiscountValue(discountEngineResponse.getDiscountValue());
					JsonData valueJsonData = new JsonData("DISCOUNT_VALUE_DETAILS",
							discountEngineResponse.getDiscountValueDetails());
					itemDiscountDetail.setDiscountValueDetails(MapperUtil.getStringFromJson(valueJsonData));
					// Save the Applied discount component details to utilize during AB to CM
					// discount value calculations
					itemDiscountDetail.getDiscountDetail().getDiscountConfig()
							.setAppliedDiscountComponent(MapperUtil.getStringFromJson(
									discountEngineResponse.getDiscountConfigDetails().getAppliedDiscountComponent()));
					itemDiscountDetail.getDiscountDetail().getDiscountConfig()
							.setRegularDiscountComponent(MapperUtil.getStringFromJson(
									discountEngineResponse.getDiscountConfigDetails().getRegularDiscountComponent()));
					itemDiscountDetail.getDiscountDetail().getDiscountConfig().setAppliedDiscountComponentType(
							discountEngineResponse.getDiscountConfigDetails().getAppliedDiscountComponentType());

					updatedDiscountDetails.add(itemDiscountDetail.getDiscountDetail());
					updatedDiscountConfigDetails.add(itemDiscountDetail.getDiscountDetail().getDiscountConfig());
				}
			}
		});

		if (!CollectionUtils.isEmpty(updatedDiscountDetails)) {

			discountConfigDetailsRepository.saveAll(updatedDiscountConfigDetails);
			discountDetailsRepository.saveAll(updatedDiscountDetails);
			discountItemDetailsRepository.saveAll(itemDiscountDetails);

			discountUtilService.updateTransactionSpecificItemDetails(salesTxn, Set.of(itemId), isPriceUpdate);
		}
		// pending: when to call update header tables?

		// RIVAAH DISCOUNT VALIDATION
		if (!CollectionUtils.isEmpty(rivaahDiscountList))
			discountUtilService.validateRivaahDiscounts(salesTxn);

	}

	@Override
	@Transactional
	public void deleteItemDiscounts(String transactionId, String txnType, String subTxnType, String itemId,
			Boolean asPartOfItemDelete) {
		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to add discount
		commonTransactionService.checkTranscationStatusForUpdate(salesTxn.getStatus());

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		// Find all Item Level discounts applied for a item
		List<DiscountItemDetailsDaoExt> discountItemDetails = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdIn(salesTxn,
						com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum.ITEM_LEVEL.name(),
						List.of(itemId));

		List<DiscountItemDetailsDaoExt> rivaahDiscountList = new ArrayList<>();

		if (!CollectionUtils.isEmpty(discountItemDetails)) {
			discountItemDetails.forEach(discountItem -> {
				if (BooleanUtils.isTrue(discountItem.getIsRivaahDiscount())) {
					rivaahDiscountList.add(discountItem);
				}
			});

			if (!CollectionUtils.isEmpty(rivaahDiscountList))
				discountItemDetails.removeAll(rivaahDiscountList);

			// pending: Discount type specific delete operations, like for employee
			// discount, if it's the one & only discount applied at item level, it should
			// not be allowed to delete
			// Delete discount details
			discountUtilService.deleteAllItemDiscountDetails(discountItemDetails);

			List<String> discountAppliableForExclude = null;
			if (BooleanUtils.isTrue(asPartOfItemDelete)) {
				discountAppliableForExclude = getDiscountApplicableIfItemIsExcluded(itemId, salesTxn,
						asPartOfItemDelete, false);
			}

			// Delete dependent cumulative items discount as part of overriding discount of
			// current item
			discountUtilService.verifyAndDeleteCumulativeItemDiscounts(salesTxn, discountItemDetails,
					(!CollectionUtils.isEmpty(discountAppliableForExclude)));

			discountUtilService.removeRivaahDiscounts(salesTxn);

			// Update discount value & final value of impacted items
			discountUtilService.updateTransactionSpecificItemDetails(salesTxn, Set.of(itemId), false);
		}

		// Find all Item Level discounts applied for a item
		List<DiscountItemDetailsDaoExt> discountItemDetailsRemaining = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdIn(salesTxn,
						com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum.ITEM_LEVEL.name(),
						List.of(itemId));

		// if no other discount is present in item and item is excluded for certain
		// discount, then update cumulative discount
		if (CollectionUtils.isEmpty(discountItemDetailsRemaining)) {
			checkForExcludeItemdiscountUpdate(itemId, salesTxn, asPartOfItemDelete, false);
		}

		// RIVAAH DISCOUNT VALIDATION
		discountUtilService.validateRivaahDiscounts(salesTxn);

	}

	private void checkForExcludeItemdiscountUpdate(String itemId, SalesTxnDaoExt salesTxn, Boolean asPartOfDelete,
			Boolean isExcludeDiscountUpdate) {
		List<String> discountIdsToCheck = getDiscountApplicableIfItemIsExcluded(itemId, salesTxn, asPartOfDelete,
				isExcludeDiscountUpdate);
		if (CollectionUtils.isEmpty(discountIdsToCheck)) {
			return;
		}

		// get slab or high value discount
		List<DiscountItemDetailsDaoExt> cumulativeItemDiscountList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailCumulativeDiscountIdIn(salesTxn, discountIdsToCheck);
		boolean isIndependantDiscount = false;
		if (CollectionUtils.isEmpty(cumulativeItemDiscountList)) {
			isIndependantDiscount = true;
			cumulativeItemDiscountList = discountItemDetailsRepository
					.findAllByDiscountDetailSalesTxnIdAndDiscountDetailDiscountIdIn(salesTxn.getId(),
							discountIdsToCheck);
		}

		if (CollectionUtils.isEmpty(cumulativeItemDiscountList) && BooleanUtils.isTrue(asPartOfDelete)
				&& BooleanUtils.isNotTrue(isExcludeDiscountUpdate)) {
			return;
		}

		Map<String, List<DiscountItemDetailsDaoExt>> mapItemDiscountsByCumulativeId = new HashMap<>();
		for (DiscountItemDetailsDaoExt itemDiscount : cumulativeItemDiscountList) {
			List<DiscountItemDetailsDaoExt> itemDiscountList;
			String idToConsider;
			if (!isIndependantDiscount && mapItemDiscountsByCumulativeId
					.containsKey(itemDiscount.getDiscountDetail().getCumulativeDiscountId())) {
				itemDiscountList = mapItemDiscountsByCumulativeId
						.get(itemDiscount.getDiscountDetail().getCumulativeDiscountId());
				idToConsider = itemDiscount.getDiscountDetail().getCumulativeDiscountId();
			} else if (isIndependantDiscount
					&& mapItemDiscountsByCumulativeId.containsKey(itemDiscount.getDiscountDetail().getDiscountId())) {
				itemDiscountList = mapItemDiscountsByCumulativeId.get(itemDiscount.getDiscountDetail().getDiscountId());
				idToConsider = itemDiscount.getDiscountDetail().getDiscountId();
			} else {
				idToConsider = isIndependantDiscount ? itemDiscount.getDiscountDetail().getDiscountId()
						: itemDiscount.getDiscountDetail().getCumulativeDiscountId();
				itemDiscountList = new ArrayList<>();
			}
			itemDiscountList.add(itemDiscount);
			mapItemDiscountsByCumulativeId.put(idToConsider, itemDiscountList);

		}

		Set<String> itemsToIgnore = new HashSet<>();
		if (BooleanUtils.isTrue(asPartOfDelete) && BooleanUtils.isNotTrue(isExcludeDiscountUpdate)) {
			itemsToIgnore.add(itemId);
		}
		if (!CollectionUtils.isEmpty(mapItemDiscountsByCumulativeId)) {
			mapItemDiscountsByCumulativeId.forEach((cumulativeId, itemDiscountList) -> discountUtilService
					.recalculateCumulateDiscount(null, itemDiscountList, salesTxn, itemsToIgnore, null, false));
		} else {
			// when discount has to be updated for
			discountIdsToCheck.forEach(discountId -> discountUtilService.recalculateCumulateDiscount(null,
					new ArrayList<>(), salesTxn, itemsToIgnore, discountId, false));
		}
	}

	private List<String> getDiscountApplicableIfItemIsExcluded(String itemId, SalesTxnDaoExt salesTxn,
			Boolean asPartOfDelete, Boolean isExcludeDiscountUpdate) {
		String discountDetailsJson = null;
		if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.CM.name())) {
			CashMemoDetailsDaoExt cashMemoDetails = cashMemoDetailsRepository.findOneByIdAndCashMemoDaoId(itemId,
					salesTxn.getId());
			discountDetailsJson = cashMemoDetails.getDiscountDetails();
		} else if (salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.name())
				|| salesTxn.getTxnType().equalsIgnoreCase(TransactionTypeEnum.CO.name())) {
			OrderDetailsDaoExt orderDetailsDao = orderDetailsRepository.findOneByIdAndOrderId(itemId, salesTxn.getId());
			discountDetailsJson = orderDetailsDao.getDiscountDetails();
		}
		List<String> discountIdsToCheck = new ArrayList<>();
		if (StringUtil.isBlankJsonStr(discountDetailsJson)) {
			return discountIdsToCheck;
		}

		JsonData jsonData = MapperUtil.mapObjToClass(discountDetailsJson, JsonData.class);
		ItemDiscountDetailsDto itemDiscountDetailsDtoExisting = MapperUtil.mapObjToClass(jsonData.getData(),
				ItemDiscountDetailsDto.class);
		if (CollectionUtils.isEmpty(itemDiscountDetailsDtoExisting.getValidDiscountDetails())) {
			return discountIdsToCheck;
		}

		// if delete, then do not consider auto discount concept.
		discountIdsToCheck = itemDiscountDetailsDtoExisting.getValidDiscountDetails().values().stream()
				.filter(cummDetail -> BooleanUtils.isTrue(cummDetail.getIsExclude())
						&& (BooleanUtils.isTrue(asPartOfDelete) || (BooleanUtils.isTrue(isExcludeDiscountUpdate)
								&& BooleanUtils.isTrue(cummDetail.getIsAutoDiscount()))))
				.map(CummulativeDiscountWithExcludeDto::getDiscountId).collect(Collectors.toList());
		return discountIdsToCheck;
	}

	@Override
	public OrderItemDiscountsResponseDto listOrderItemDiscounts(String transactionId, String txnType, String subTxnType,
			String orderItemId, String discountTxnId, String clubbedDiscountId, Boolean configsRequired,
			String itemProductGroupCode) {

		CashMemoDaoExt cashMemoDao = commonCashMemoService.checkIfCashMemoExistsByCashMemoId(transactionId, txnType,
				subTxnType);

		OrderItemDiscountsResponseDto orderDiscountsResponse = new OrderItemDiscountsResponseDto();

		if (!StringUtils.isEmpty(cashMemoDao.getSalesTxnDao().getRefTxnId())) {
			OrderDaoExt orderDao = orderUtilService
					.checkIfOrderExistsById(cashMemoDao.getSalesTxnDao().getRefTxnId().getId());

			List<DiscountItemDetailsDaoExt> orderItemDiscounts = discountItemDetailsRepository.findAllOrderDiscounts(
					orderDao.getSalesTxn(), DiscountApplicableLevelEnum.ITEM_LEVEL.name(), orderItemId, discountTxnId,
					clubbedDiscountId);

			Date businessDate = CalendarUtils.getStartOfDay(businessDayService.getBusinessDay().getBusinessDate());
			List<DiscountItemDetailsDaoExt> eligibleItems = new ArrayList<>();
			if (!CollectionUtils.isEmpty(orderItemDiscounts)) {
				orderItemDiscounts.forEach(orderItem->{
					
					JsonData jsonNode = MapperUtil.mapObjToClass(orderItem.getDiscountDetail().getDiscountConfig().getLocationOfferDetails(), JsonData.class);
					LocationOfferDetails location = MapperUtil.mapObjToClass(jsonNode.getData(),LocationOfferDetails.class);
					
					JsonData order = MapperUtil.mapObjToClass(orderItem.getDiscountDetail().getDiscountConfig().getOrderConfigDetails(), JsonData.class);
					OrderConfigDetails orderConfigDetails = MapperUtil.mapObjToClass(order.getData(),OrderConfigDetails.class);
					
					if(location!=null)
					{
						Date offerEndDate = CalendarUtils.getStartOfDay(location.getOfferEndDate());
						Date offerStartDate = CalendarUtils.getStartOfDay(location.getOfferStartDate());
						
					
					Calendar cal = Calendar.getInstance();
					cal.setTime(offerEndDate);
					Integer gracePeriod = null;
					if (orderConfigDetails != null
							&& orderConfigDetails.getOfferPeriodForAB() != null) {
						gracePeriod = orderConfigDetails.getOfferPeriodForAB();
						if (gracePeriod != null) {
							cal.add(Calendar.DATE, gracePeriod);
						}
					}
					if (checkAbOfferPeriod(businessDate, offerStartDate,offerEndDate, gracePeriod)) {
						
							eligibleItems.add(orderItem);
					}
					}

					if (orderItem.getDiscountDetail().getDiscountType()
							.equals(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name())) {
						eligibleItems.add(orderItem);
					}

				});

				Map<String, List<DiscountItemDetailsDaoExt>> clubbedOrderItemDiscounts = eligibleItems.stream()
						.filter(itemDiscount -> !StringUtils
								.isEmpty(itemDiscount.getDiscountDetail().getClubbedDiscountId()))
						.collect(Collectors
								.groupingBy(itemDiscount -> itemDiscount.getDiscountDetail().getClubbedDiscountId()));

				List<DiscountItemDetailsDaoExt> individualOrderItemDiscounts = eligibleItems.stream().filter(
						itemDiscount -> StringUtils.isEmpty(itemDiscount.getDiscountDetail().getClubbedDiscountId()))
						.collect(Collectors.toList());

				// Set all the applied Clubbed discounts
				if (!CollectionUtils.isEmpty(clubbedOrderItemDiscounts)) {

					List<ClubbingDiscountDetailsDto> clubDiscounts = new ArrayList<>();

					for (Map.Entry<String, List<DiscountItemDetailsDaoExt>> entry : clubbedOrderItemDiscounts
							.entrySet()) {

						ClubbingDiscountDetailsDto clubDiscountDetails = new ClubbingDiscountDetailsDto();

						clubDiscountDetails.setClubbingId(entry.getKey());

						// Need to find optimal way of handling this scenario
						Set<String> set = new HashSet<>(entry.getValue().size());
						List<DiscountItemDetailsDaoExt> distinctClubbedDiscounts = entry.getValue().stream()
								.filter(itemDiscount -> set.add(itemDiscount.getDiscountDetail().getDiscountId()))
								.collect(Collectors.toList());

						clubDiscountDetails.setDiscounts(getOrderItemDiscountDetails(distinctClubbedDiscounts,
								configsRequired, orderDao, orderItemId, itemProductGroupCode));

						clubDiscounts.add(clubDiscountDetails);

					}

					orderDiscountsResponse.setClubDiscounts(clubDiscounts);
				}

				// Set all the Individual discount applied
				if (!CollectionUtils.isEmpty(individualOrderItemDiscounts)) {

					// Need to find optimal way of handling this scenario
					Set<String> set = new HashSet<>(individualOrderItemDiscounts.size());
					List<DiscountItemDetailsDaoExt> distinctIndividualDiscounts = individualOrderItemDiscounts.stream()
							.filter(itemDiscount -> set.add(itemDiscount.getDiscountDetail().getDiscountId()))
							.collect(Collectors.toList());

					orderDiscountsResponse.setDiscounts(getOrderItemDiscountDetails(distinctIndividualDiscounts,
							configsRequired, orderDao, orderItemId, itemProductGroupCode));
				}

			}

		}

		return orderDiscountsResponse;
	}

	private boolean checkAbOfferPeriod(Date businessDate, Date offerStartDate, Date offerEndDate, Integer gracePeriod) {
		if (offerStartDate != null && offerEndDate != null) {
			Calendar cal = Calendar.getInstance();
			cal.setTime(offerEndDate);
			if (gracePeriod != null) {
				cal.add(Calendar.DATE, gracePeriod);
			}
			Date graceOfferDate = cal.getTime();
			return (businessDate.compareTo(offerStartDate) >= 0
					&& (businessDate.compareTo(offerEndDate) <= 0 || businessDate.compareTo(graceOfferDate) <= 0));
		}
		return false;
	}

	// Method to get order item discount config details
	private List<DiscountDetailsBaseResponseDto> getOrderItemDiscountDetails(
			List<DiscountItemDetailsDaoExt> orderItemDiscounts, Boolean configsRequired, OrderDaoExt orderDao,
			String orderItemId, String itemProductGroupCode) {

		List<DiscountDetailsBaseResponseDto> itemDiscounts = new ArrayList<>();

		for (DiscountItemDetailsDaoExt itemDiscount : orderItemDiscounts) {

			DiscountDetailsBaseResponseDto itemDiscountDetails = new DiscountDetailsBaseResponseDto();

			DiscountDetailsBaseDto itemDiscountConfigDetails = MapperUtil
					.mapObjToClass(itemDiscount.getDiscountDetail(), DiscountDetailsBaseDto.class);

			discountUtilService.getOrderDiscountConfigDetails(itemDiscount.getDiscountDetail().getDiscountConfig(),
					itemDiscountConfigDetails, configsRequired);

			itemDiscountDetails.setDiscountConfigDetails(itemDiscountConfigDetails);

			// to get valid Rivaah GHS details
			itemDiscountDetails
					.setRivaahGhsDetails(getValidRivaahghsDetails(itemDiscount.getDiscountDetail().getDiscountType(),
							configsRequired, orderDao, orderItemId, itemProductGroupCode, itemDiscountConfigDetails));

			// Order item's discount txn id for reference
			itemDiscountConfigDetails.setRefDiscountTxnId(itemDiscount.getId());

			// if discountType is 'RIVAAH_ASHIRWAAD_DISCOUNT' and 'rivaahDetails' is null,
			// then don't add the discount to list, when 'configsRequired' is true
//			if (((DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()
//					.equals(itemDiscount.getDiscountDetail().getDiscountType())
//					&& itemDiscountDetails.getRivaahGhsDetails() != null && BooleanUtils.isTrue(configsRequired))
//					|| !DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()
//							.equals(itemDiscount.getDiscountDetail().getDiscountType()))
//					|| BooleanUtils.isNotTrue(configsRequired)) {

				itemDiscounts.add(itemDiscountDetails);
//			}

		}
		return itemDiscounts;
	}

	private RivaahGhsDiscountDto getValidRivaahghsDetails(String discountType, Boolean configsRequired,
			OrderDaoExt orderDao, String orderItemId, String itemProductGroupCode,
			DiscountDetailsBaseDto itemDiscountConfigDetails) {

		// if 'configsRequired' is true & discount type is 'RIVAAH_ASHIRWAAD_DISCOUNT',
		// then only fetch details
		if (!(BooleanUtils.isTrue(configsRequired)
				&& DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountType))) {
			return null;
		}

		// either needed to pick valid RIVAAH GHS details based on product type.
		if (StringUtils.isEmpty(orderItemId) && StringUtils.isEmpty(itemProductGroupCode)) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Need order item id or product group code of the item",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Need order item id or product group code of the item"));
		}

		if (!StringUtils.isEmpty(orderItemId)) {
			OrderDetailsDaoExt orderDetailsDao = orderDetailsRepository.findOneByIdAndOrderId(orderItemId,
					orderDao.getId());
			if (orderDetailsDao == null) {
				throw new ServiceException(SalesConstants.INVALID_DYNAMIC_TYPE_ID, SalesConstants.ERR_SALE_006,
						"Invalid order item id", Map.of("type", "item"));
			}
			itemProductGroupCode = orderDetailsDao.getProductGroupCode();
		}

		DiscountTransactionDetails discountTxnDetails = discountUtilService
				.getDiscountTxnDetails(orderDao.getSalesTxn());

		return checkAndGetRivaahGhsDetail(itemProductGroupCode, itemDiscountConfigDetails, discountTxnDetails);
	}

	private RivaahGhsDiscountDto checkAndGetRivaahGhsDetail(String itemProductGroupCode,
			DiscountDetailsBaseDto itemDiscountConfigDetails, DiscountTransactionDetails discountTxnDetails) {
		RivaahGhsDiscountDto rivaahGhsDiscount = null;
        if (itemDiscountConfigDetails.getProductGroups() != null && !itemDiscountConfigDetails.getProductGroups().getProductGroups().isEmpty()) {
		for (DiscountProductGroupMappingDto productGroupConfig : itemDiscountConfigDetails.getProductGroups()
				.getProductGroups()) {
			if (itemProductGroupCode.equals(productGroupConfig.getProductGroup())) {

				for (RivaahGhsDiscountDto eachRivaahGhsDetails : discountTxnDetails.getRivaahGhsDiscountDetails()
						.getRivaahGhs()) {
					if (("MC".equals(productGroupConfig.getProductType())
							&& BooleanUtils.isTrue(eachRivaahGhsDetails.getIsMcDiscountUsed()))
							|| ("UCP".equals(productGroupConfig.getProductType())
									&& BooleanUtils.isTrue(eachRivaahGhsDetails.getIsUcpdiscountUsed()))) {
						rivaahGhsDiscount = eachRivaahGhsDetails;
					}
				}
				// once found the product group, break out of loop
				break;
			}
		}
        }
		// if item is excluded, then also discount not applicable
		if (rivaahGhsDiscount != null && !CollectionUtil.isEmpty(rivaahGhsDiscount.getExcludeProductGroup())
				&& rivaahGhsDiscount.getExcludeProductGroup().contains(itemProductGroupCode)) {

			rivaahGhsDiscount = null;
		}

		return rivaahGhsDiscount;
	}

	@Transactional
	@Override
	public void checkAndUpdateCumulativeDiscount(String transactionId, String txnType, String subTxnType,
			String itemId) {
		// Validate sales transaction
		SalesTxnDaoExt salesTxn = commonTransactionService.checkIfSalesTxnIdExistsWithTransactionType(transactionId,
				txnType);

		// Validate Transaction status to add discount
		commonTransactionService.checkTranscationStatusForUpdate(salesTxn.getStatus());

		// TCS should be clear before discount update
		commonTransactionService.checkIfTcsAmountIsAdded(salesTxn, false);

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		// Check if any discounts applied before
		List<DiscountItemDetailsDaoExt> discountItemDetails = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailApplicableLevelAndItemIdIn(salesTxn,
						DiscountApplicableLevelEnum.ITEM_LEVEL.name(), List.of(itemId));

		// if discount is present for exclude item, then should not consider for
		// cumulative discount
		if (!CollectionUtil.isEmpty(discountItemDetails)) {
			return;
		}

		checkForExcludeItemdiscountUpdate(itemId, salesTxn, false, true);

		// RIVAAH DISCOUNT VALIDATION
		discountUtilService.validateRivaahDiscounts(salesTxn);

	}

}