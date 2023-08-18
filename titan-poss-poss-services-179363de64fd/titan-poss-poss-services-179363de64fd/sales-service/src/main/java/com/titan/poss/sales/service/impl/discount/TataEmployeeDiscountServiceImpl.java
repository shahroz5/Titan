/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

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
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.SalesConstants;
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
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

/**
 * Service Class for Tata Employee Discount
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("salesTataEmployeeDiscountServiceImpl")
public class TataEmployeeDiscountServiceImpl implements DiscountService {

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	public TataEmployeeDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.name(), this);
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
				DiscountInitialStatusEnum.TATA_EMPLOYEE_DISCOUNT.getDiscountInitialStatus(), null);

		// Save discount config details & Link to the discount applied
		discountDetailsDao.setDiscountConfig(discountUtilService
				.saveDiscountConfigDetails(discountEngineResponseConfigs.getDiscountConfigDetails()));

		// Pending: Update discount availed count w.r.t employee ID & Company - can be
		// done as part of confirm discount

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
			throw new ServiceException(SalesConstants.TATA_EMPLOYEE_DETAILS_NOT_FOUND, SalesConstants.ERR_DISC_019,
					discountDetail.getDiscountCode());
		}

		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (StringUtils.isEmpty(discountTxnDetails.getTataEmployeeDetails())) {
			throw new ServiceException(SalesConstants.TATA_EMPLOYEE_DETAILS_NOT_FOUND, SalesConstants.ERR_DISC_019,
					discountDetail.getDiscountCode());
		}

		if (StringUtils.isEmpty(discountTxnDetails.getTataEmployeeDetails().getEmployeeId())
				|| StringUtils.isEmpty(discountTxnDetails.getTataEmployeeDetails().getCompanyName())) {
			throw new ServiceException(SalesConstants.TATA_EMPLOYEE_DETAILS_NOT_FOUND, SalesConstants.ERR_DISC_019,
					"Employee Id and Company name are mandatory");
		}

		if (BooleanUtils.isTrue(discountTxnDetails.getTataEmployeeDetails().getIsIdProofUploaded())) {
			// Pending: Check if Id Proof uploaded, (Input?)
			Boolean isProofUploaded = true;
			// If Mismatch between UI input & File upload status, throw error
			if (BooleanUtils.isFalse(isProofUploaded)) {
				throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
						"Tata Employee -> IsIdPrrofUploaded: "
								+ discountTxnDetails.getTataEmployeeDetails().getIsIdProofUploaded());
			}

		}

		// TBD: Will there be any validation w.r.t Employee masters of company?
	}

	@Override
	@Transactional
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		if (StringUtils.isEmpty(discountBillLevelCreateDto.getTataEmployeeDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "TATA Employee details not found to validate",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "TATA Employee details not found to validate"));
		}

		// Validate Tata employee details
		DiscountBillLevelRequestDto discountBillLevelRequestDto = discountUtilService
				.getDiscountEligibleRequestDto(salesTxn, discountBillLevelCreateDto, discountType);

		DiscountBillLevelResponseDto discountEligibleItemResponseDto = engineService
				.getDiscountsAtBillLevel(discountBillLevelRequestDto);

		if (CollectionUtils.isEmpty(discountEligibleItemResponseDto.getDiscountDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "No Item eligible for TATA Employee discount",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "No Item eligible for TATA Employee discount"));
		}

		discountUtilService.validateAndCreateBestDiscountForEligibleItems(salesTxn, discountEligibleItemResponseDto,
				discountBillLevelCreateDto);

		// Update sales txn details with Tata employee details
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		// Added to captured applied time of each check boxed discount
		discountBillLevelCreateDto.getTataEmployeeDetails().setAppliedDate(CalendarUtils.getCurrentDate());
		discountTxnDetails.setTataEmployeeDetails(discountBillLevelCreateDto.getTataEmployeeDetails());

		salesTxn.setDiscountTxnDetails(
				MapperUtil.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));

		return new DiscountResponseDto(List.of());
	}

	@Override
	@Transactional
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {
		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, discountTxnId);

		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (StringUtils.isEmpty(discountTransactionDetails.getTataEmployeeDetails())) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Tata employee details not found to confirm discount",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Tata employee details not found to confirm discount"));
		}

		Boolean isIdProofUploaded = discountTransactionDetails.getTataEmployeeDetails().getIsIdProofUploaded();
		// TBD: How to make sure IdPrrof Uploaded, any reference to file place
		if (BooleanUtils.isFalse(isIdProofUploaded)) {
			// Pending: Iterate through applied tata employee discounts, if any discount has
			// dependency on IdProof, throw error.
		}

		for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
			// Update discount status to CONFIRMED after coupon code redemption
			discountDetails.setStatus(DiscountSalesStatusEnum.CONFIRMED.name());

		}

		discountDetailsRepository.saveAll(discountDaoList);

	}

	@Override
	@Transactional
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {

		List<DiscountItemDetailsDaoExt> itemDiscountDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailDiscountType(salesTxn, discountType);

		// Delete TATA employee details from discount txn details of sales txn data
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (StringUtils.isEmpty(discountTxnDetails.getTataEmployeeDetails())) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "Tata employee details not found to delete discount",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Tata employee details not found to delete discount"));
		}

		if (!CollectionUtils.isEmpty(itemDiscountDetailsList)
				&& !StringUtils.isEmpty(discountTxnDetails.getTataEmployeeDetails())) {

			Set<String> updatedItemIds = itemDiscountDetailsList.stream().map(DiscountItemDetailsDaoExt::getItemId)
					.collect(Collectors.toSet());

			discountUtilService.deleteAllItemDiscountDetails(itemDiscountDetailsList);

			// Update discount values for the impacted items
			if (!CollectionUtils.isEmpty(updatedItemIds))
				discountUtilService.updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);
		}

		discountTxnDetails.setTataEmployeeDetails(null);

		salesTxn.setDiscountTxnDetails(
				MapperUtil.getStringFromJson(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));

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
