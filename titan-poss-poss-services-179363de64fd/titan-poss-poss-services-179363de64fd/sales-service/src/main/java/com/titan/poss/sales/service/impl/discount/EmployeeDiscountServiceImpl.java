/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.EmployeeCouponDetailDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GiftCardBaseRedeemRequestDto;
import com.titan.poss.core.dto.GiftCardBaseReverseRedeemRequestDto;
import com.titan.poss.core.enums.GiftCardTypeEnum;
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
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("salesEmployeeDiscountServiceImpl")
public class EmployeeDiscountServiceImpl implements DiscountService {

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private IntegrationService integrationService;

	private static final String EMPLOYEE_COUPON_DETAILS_NOT_FOUND = "Employee Coupon details not found to validate";

	private static final String ERR_DISC_017 = "ERR-DISC-017";

	public EmployeeDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.EMPLOYEE_DISCOUNT.name(), this);
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
				DiscountInitialStatusEnum.EMPLOYEE_DISCOUNT.getDiscountInitialStatus(), null);

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
			throw new ServiceException(EMPLOYEE_COUPON_DETAILS_NOT_FOUND, ERR_DISC_017,
					discountDetail.getDiscountCode());
		}

		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (StringUtils.isEmpty(discountTxnDetails.getEmployeeDetails())
				|| (!StringUtils.isEmpty(discountTxnDetails.getEmployeeDetails())
						&& CollectionUtils.isEmpty(discountTxnDetails.getEmployeeDetails().getCouponDetails()))) {
			throw new ServiceException(EMPLOYEE_COUPON_DETAILS_NOT_FOUND, ERR_DISC_017,
					discountDetail.getDiscountCode());
		}

		// Validate coupon code may not be required at ITEM-LEVEL, as it is already done
		// to list eligible discounts headers

	}

	@Override
	@Transactional
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {

		if (StringUtils.isEmpty(discountBillLevelCreateDto.getEmployeeDetails())) {
			throw new ServiceException(EMPLOYEE_COUPON_DETAILS_NOT_FOUND, ERR_DISC_017);
		}

		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		// Validate each coupon code against Quick silver,(Multiple Coupon code
		// at a time)
		// If Eligible to redeem, allow discount, else throw error
		DiscountBillLevelRequestDto discountBillLevelRequestDto = discountUtilService
				.getDiscountEligibleRequestDto(salesTxn, discountBillLevelCreateDto, discountType);

		log.info("Get discount eligible at Bill level Request body- {}",
				MapperUtil.getJsonString(discountBillLevelRequestDto));

		DiscountBillLevelResponseDto discountEligibleItemResponseDto = engineService
				.getDiscountsAtBillLevel(discountBillLevelRequestDto);

		log.info("Get discount eligible at Bill level Response body- {}",
				MapperUtil.getJsonString(discountEligibleItemResponseDto));

		if (CollectionUtils.isEmpty(discountEligibleItemResponseDto.getDiscountDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "No Item eligible for Employee discount",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "No Item eligible for Employee discount"));
		}

		discountUtilService.validateAndCreateBestDiscountForEligibleItems(salesTxn, discountEligibleItemResponseDto,
				discountBillLevelCreateDto);

		// Update sales txn details with employee coupon details
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		// Added to captured applied time of each check boxed discount
		discountBillLevelCreateDto.getEmployeeDetails().setAppliedDate(CalendarUtils.getCurrentDate());
		discountTxnDetails.setEmployeeDetails(discountBillLevelCreateDto.getEmployeeDetails());

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

		if (StringUtils.isEmpty(discountTransactionDetails.getEmployeeDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Employee coupon details not found to redeem",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Employee coupon details not found to redeem"));
		}

		if (!CollectionUtils.isEmpty(discountTransactionDetails.getEmployeeDetails().getCouponDetails())) {
			EmployeeCouponDetailDto employeeCouponDetailDto = discountTransactionDetails.getEmployeeDetails()
					.getCouponDetails().get(0);

			// If Coupon is already redeemed, just return
			if (!StringUtils.isEmpty(employeeCouponDetailDto.getRedeemTxnId())
					&& !StringUtils.isEmpty(employeeCouponDetailDto.getRedeemStatus())
					&& employeeCouponDetailDto.getRedeemStatus().equalsIgnoreCase("REDEEMED")) {
				return;
			}

			BigDecimal totalEmployeeDiscount = discountDaoList.stream().map(DiscountDetailsDaoExt::getDiscountValue)
					.reduce(BigDecimal.ZERO, BigDecimal::add);

			// From cash memo or sales order table depends on txn type in sales txn
			BigDecimal finalBillValue = discountUtilService.getTransactionSpecificInvoiceDetails(salesTxn)
					.getFinalValue();

			// Redeem Employee coupon code w.r.t QCGC
			GiftCardBaseRedeemRequestDto couponCodeRedeemRequestDto = new GiftCardBaseRedeemRequestDto();
			couponCodeRedeemRequestDto.setAmount(totalEmployeeDiscount.doubleValue());
			couponCodeRedeemRequestDto.setCardNumber(employeeCouponDetailDto.getCouponCode());
			couponCodeRedeemRequestDto.setInvoiceNumber(salesTxn.getId());
			couponCodeRedeemRequestDto.setBillAmount(finalBillValue.doubleValue());
			GcResponseDto couponResponseDto = integrationService.redeemGiftCardBalance(VendorCodeEnum.QC_GC.name(),
					couponCodeRedeemRequestDto, GiftCardTypeEnum.EMPLOYEE_CODE);
			
			log.info("GIFT CARD RESPONSE DTO SALES"+MapperUtil.getJsonString(couponResponseDto));
			if (!"0".equals(couponResponseDto.getResponseCode())) {
				employeeCouponDetailDto.setRedeemStatus(DiscountSalesStatusEnum.REDEMPTION_FAILED.name());
				updateCouponDetailsAndUpdateSalesTxn(salesTxn, discountTransactionDetails, employeeCouponDetailDto);

				Map<String, String> errorCause = Map.of("couponCode", employeeCouponDetailDto.getCouponCode(),
						"errorMessage", couponResponseDto.getResponseMessage());

				throw new ServiceException(null, couponResponseDto.getResponseCode(), errorCause);
			}

			employeeCouponDetailDto.setRedeemStatus(DiscountSalesStatusEnum.REDEEMED.name());
			employeeCouponDetailDto.setRedeemTxnId(couponResponseDto.getTransactionId());
			employeeCouponDetailDto.setAmount(totalEmployeeDiscount);

			for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
				// Update discount status to CONFIRMED after coupon code redemption
				discountDetails.setStatus(DiscountSalesStatusEnum.CONFIRMED.name());
			}

			discountDetailsRepository.saveAll(discountDaoList);

			// Update Coupon redemption status & txn Id back to sales txn
			updateCouponDetailsAndUpdateSalesTxn(salesTxn, discountTransactionDetails, employeeCouponDetailDto);

		}

	}

	@Override
	@Transactional
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {

		List<DiscountItemDetailsDaoExt> itemDiscountDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailDiscountType(salesTxn, discountType);

		DiscountTransactionDetails discountTransactionDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (StringUtils.isEmpty(discountTransactionDetails.getEmployeeDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "Employee coupon details not found to delete",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "Employee coupon details not found to delete"));
		}

		if (!CollectionUtils.isEmpty(discountTransactionDetails.getEmployeeDetails().getCouponDetails())) {
			EmployeeCouponDetailDto employeeCouponDetailDto = discountTransactionDetails.getEmployeeDetails()
					.getCouponDetails().get(0);

			// If Coupon is already redeemed, revert back the redemption
			if (!StringUtils.isEmpty(employeeCouponDetailDto.getRedeemTxnId())
					&& !StringUtils.isEmpty(employeeCouponDetailDto.getRedeemStatus())
					&& employeeCouponDetailDto.getRedeemStatus().equalsIgnoreCase("REDEEMED")) {

				BigDecimal totalEmployeeDiscount = itemDiscountDetailsList.stream()
						.map(DiscountItemDetailsDaoExt::getDiscountValue).reduce(BigDecimal.ZERO, BigDecimal::add);

				// From cash memo or sales order table depends on txn type in sales txn
				BigDecimal finalBillValue = discountUtilService.getTransactionSpecificInvoiceDetails(salesTxn)
						.getFinalValue();

				GiftCardBaseReverseRedeemRequestDto couponRedeemReverseReqDto = new GiftCardBaseReverseRedeemRequestDto();
				couponRedeemReverseReqDto.setAmount(totalEmployeeDiscount.doubleValue());
				couponRedeemReverseReqDto.setCardNumber(employeeCouponDetailDto.getCouponCode());
				couponRedeemReverseReqDto.setInvoiceNumber(salesTxn.getId());
				couponRedeemReverseReqDto.setBillAmount(finalBillValue.doubleValue());
				couponRedeemReverseReqDto.setTransactionId(employeeCouponDetailDto.getRedeemTxnId());
				// Call to revert coupon redemption by refer the redeemTxnId
				GcResponseDto couponResponseDto = integrationService.reverseRedeemGiftCardBalance(
						VendorCodeEnum.QC_GC.name(), couponRedeemReverseReqDto, GiftCardTypeEnum.EMPLOYEE_CODE);
				if (!"0".equals(couponResponseDto.getResponseCode())) {
					Map<String, String> errorCause = Map.of("couponCode", employeeCouponDetailDto.getCouponCode(),
							"errorMessage", couponResponseDto.getResponseMessage());

					throw new ServiceException(null, couponResponseDto.getResponseCode(), errorCause);
				}

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
			discountTransactionDetails.setEmployeeDetails(null);

			salesTxn.setDiscountTxnDetails(MapperUtil
					.getStringFromJson(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTransactionDetails)));
		}
	}

	@Override
	public void updateTransactionLevelDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailDao,
			Boolean isPriceUpdate) {
		// NA

	}

	@Transactional
	public void updateCouponDetailsAndUpdateSalesTxn(SalesTxnDaoExt salesTxn,
			DiscountTransactionDetails discountTransactionDetails, EmployeeCouponDetailDto employeeCouponDetailDto) {
		discountTransactionDetails.getEmployeeDetails().setCouponDetails(List.of(employeeCouponDetailDto));
		salesTxn.setDiscountTxnDetails(MapperUtil
				.getStringFromJson(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTransactionDetails)));
		salesTxnRepository.save(salesTxn);
	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// NA

	}
}
