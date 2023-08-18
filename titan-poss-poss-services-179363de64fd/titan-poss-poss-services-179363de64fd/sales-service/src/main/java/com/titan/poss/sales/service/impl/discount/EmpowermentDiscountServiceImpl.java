/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.LocationOfferDetails;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.constants.TransactionStatusEnum;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.service.BusinessDayService;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesEmpowermentDiscountServiceImpl")
public class EmpowermentDiscountServiceImpl implements DiscountService {

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private BusinessDayService businessDayService;

	public EmpowermentDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name(), this);
	}

	@Override
	public void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {
		// NA

	}

	@Override
	@Transactional
	public DiscountDetailsDaoExt addDiscount(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			DiscountDetailsResponseDto discountEngineResponseConfigs, DiscountOtherDetailsDto discountOtherDetails) {

		// Create Discount details
		DiscountDetailsDaoExt discountDetailsDao = discountUtilService.createDiscountDetails(discountDetail, salesTxn,
				DiscountApplicableLevelEnum.ITEM_LEVEL.name(), discountOtherDetails,
				DiscountInitialStatusEnum.EMPOWERMENT_DISCOUNT.getDiscountInitialStatus(), null);

		// Save discount config details & Link to the discount applied
		discountDetailsDao.setDiscountConfig(discountUtilService
				.saveDiscountConfigDetails(discountEngineResponseConfigs.getDiscountConfigDetails()));

		return discountDetailsDao;
	}

	@Override
	public void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailsDaoExt) {
		// NA

	}

	@Override
	public void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode) {
		// NA

	}

	@Override
	public void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId) {

		if (StringUtil.isBlankJsonStr(salesTxn.getDiscountTxnDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Empowerment discount details not found",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Empowerment discount details not found"));
		}

		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (StringUtils.isEmpty(discountTxnDetails.getEmpowermentDetails())
				|| (!StringUtils.isEmpty(discountTxnDetails.getEmpowermentDetails()) && BooleanUtils
						.isFalse(discountTxnDetails.getEmpowermentDetails().getApplyEmpowermentDiscount()))) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Empowerment Discount should be selected to apply the discount",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Empowerment Discount should be selected to apply the discount"));
		}

		// Validate coupon code may not be required at ITEM-LEVEL, as it is already done
		// to list eligible discounts headers

	}

	@Override
	@Transactional
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {

		if (StringUtils.isEmpty(discountBillLevelCreateDto.getEmpowermentDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Empowerment discount details not found",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Empowerment discount details not found"));
		}

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		DiscountBillLevelRequestDto discountBillLevelRequestDto = discountUtilService
				.getDiscountEligibleRequestDto(salesTxn, discountBillLevelCreateDto, discountType);

		log.info("Get discount eligible at Bill level Request body- {}",
				MapperUtil.getJsonString(discountBillLevelRequestDto));

		DiscountBillLevelResponseDto discountEligibleItemResponseDto = engineService
				.getDiscountsAtBillLevel(discountBillLevelRequestDto);

		log.info("Get discount eligible at Bill level Response body- {}",
				MapperUtil.getJsonString(discountEligibleItemResponseDto));

		if (CollectionUtils.isEmpty(discountEligibleItemResponseDto.getDiscountDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "No Item eligible for Empowerment discount",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "No Item eligible for Empowerment discount"));
		}

		discountUtilService.validateAndCreateBestDiscountForEligibleItems(salesTxn, discountEligibleItemResponseDto,
				discountBillLevelCreateDto);

		// Update sales txn details with empowerment details
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		// Added to captured applied time of each check boxed discount
		discountBillLevelCreateDto.getEmpowermentDetails().setAppliedDate(CalendarUtils.getCurrentDate());
		discountTxnDetails.setEmpowermentDetails(discountBillLevelCreateDto.getEmpowermentDetails());

		salesTxn.setDiscountTxnDetails(
				MapperUtil.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));

		return new DiscountResponseDto(List.of());
	}

	@Override
	@Transactional
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {

		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, null);

		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (StringUtils.isEmpty(discountTransactionDetails.getEmpowermentDetails())
				|| (!StringUtils.isEmpty(discountTransactionDetails.getEmpowermentDetails()) && BooleanUtils
						.isFalse(discountTransactionDetails.getEmpowermentDetails().getApplyEmpowermentDiscount()))) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Empowerment details not found",
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS, "Empowerment details not found"));
		}

		// Empowerment discount limit validation
		Date businessDate = businessDayService.getBusinessDay().getBusinessDate();

		BigDecimal empowermentDiscountGivenInAQuarter = discountDetailsRepository.getMaxDiscountForCurrentQuarter(
				CalendarUtils.getFirstDayOfQuarter(businessDate), CalendarUtils.getLastDayOfQuarter(businessDate),
				discountType, salesTxn.getTxnType(), List.of(TransactionStatusEnum.OPEN.name(),
						TransactionStatusEnum.HOLD.name(), TransactionStatusEnum.CONFIRMED.name()),
				CommonUtil.getLocationCode());

		JsonData locationJsonData = MapperUtil
				.mapObjToClass(discountDaoList.get(0).getDiscountConfig().getLocationOfferDetails(), JsonData.class);

		LocationOfferDetails locationOfferDetails = MapperUtil.mapObjToClass(locationJsonData.getData(),
				LocationOfferDetails.class);

		log.info("Max limit per Quarter - {} and Empowerment discount given so far - {}", locationOfferDetails,
				empowermentDiscountGivenInAQuarter);

		// If given empowerment discount exceeds the limit per Quarter, throw the
		// exception.
		if (locationOfferDetails.getEmpowermentQuarterMaxDiscountValue() == null || empowermentDiscountGivenInAQuarter
				.compareTo(locationOfferDetails.getEmpowermentQuarterMaxDiscountValue()) > 0) {
			throw new ServiceException("Empowerment discount exceeded the limit - Please contact the administrator",
					SalesConstants.ERR_CONFIG_151);
		}

		for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
			// Update discount status to CONFIRMED limit validation
			discountDetails.setStatus(DiscountSalesStatusEnum.CONFIRMED.name());
		}

		discountDetailsRepository.saveAll(discountDaoList);

	}

	@Override
	@Transactional
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {

		List<DiscountItemDetailsDaoExt> itemDiscountDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailDiscountType(salesTxn, discountType);

		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (StringUtils.isEmpty(discountTransactionDetails.getEmpowermentDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Empowerment details not found to delete",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Empowerment details not found to delete"));
		}

		if (!CollectionUtils.isEmpty(itemDiscountDetailsList)) {

			Set<String> updatedItemIds = itemDiscountDetailsList.stream().map(DiscountItemDetailsDaoExt::getItemId)
					.collect(Collectors.toSet());

			discountUtilService.deleteAllItemDiscountDetails(itemDiscountDetailsList);

			// Update discount values for the impacted items
			if (!CollectionUtils.isEmpty(updatedItemIds))
				discountUtilService.updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);
		}

		// Delete Employee Coupon details from discount txn details of sales txn data
		discountTransactionDetails.setEmpowermentDetails(null);

		salesTxn.setDiscountTxnDetails(MapperUtil
				.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTransactionDetails)));

	}

	@Override
	public void updateTransactionLevelDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailDao,
			Boolean isPriceUpdate) {
		// NA

	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// NA

	}

}
