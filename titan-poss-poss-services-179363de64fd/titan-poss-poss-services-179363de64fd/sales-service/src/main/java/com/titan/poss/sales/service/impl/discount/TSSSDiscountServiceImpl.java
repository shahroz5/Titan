/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.config.dto.DiscountCouponUpdateResponseDto;
import com.titan.poss.config.dto.constants.DiscountCouponStatusEnum;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.EmployeeCouponDetailDto;
import com.titan.poss.core.discount.dto.TSSSDiscountDetailsDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.dto.DiscountCouponDto;
import com.titan.poss.core.dto.TSSSCouponRedeemDto;
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
import com.titan.poss.sales.utils.EpossCallServiceImpl;

/**
 * Service class for TSSS Discounts
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("salesTSSSDiscountServiceImpl")
public class TSSSDiscountServiceImpl implements DiscountService {

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
	private EpossCallServiceImpl epossCallService;

	private static final String TSSS_REDEMPTION_API_URL = "api/config/v2/discounts/coupons";

	public TSSSDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.TSSS_DISCOUNT.name(), this);
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
				DiscountInitialStatusEnum.TSSS_DISCOUNT.getDiscountInitialStatus(), null);

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
			throw new ServiceException("TSSS Coupon details not found to validate", "ERR-DISC-020",
					discountDetail.getDiscountCode());
		}

		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

		if (StringUtils.isEmpty(discountTxnDetails.getTsssDetails())
				|| (!StringUtils.isEmpty(discountTxnDetails.getTsssDetails())
						&& CollectionUtils.isEmpty(discountTxnDetails.getTsssDetails().getCouponDetails()))) {
			throw new ServiceException("TSSS Coupon details not found to validate", "ERR-DISC-020",
					discountDetail.getDiscountCode());
		}

		// TBD: Validate each coupon code against eposs server,
		// If Eligible to redeem, allow discount, else throw error - Taken care during
		// apply at bill level & list discount header

	}

	@Override
	@Transactional
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {
		// Validate If any Bill level discount already applied
		discountUtilService.checkIfBillLevelDiscountApplied(salesTxn);

		if (StringUtils.isEmpty(discountBillLevelCreateDto.getTsssDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "TSSS coupon details not found to validate",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "TSSS coupon details not found to validate"));
		}

		// Validate each coupon code against eposs,(Multiple Coupon code
		// at a time)
		// If Eligible to redeem, allow discount, else throw error
		DiscountBillLevelRequestDto discountBillLevelRequestDto = discountUtilService
				.getDiscountEligibleRequestDto(salesTxn, discountBillLevelCreateDto, discountType);

		DiscountBillLevelResponseDto discountEligibleItemResponseDto = engineService
				.getDiscountsAtBillLevel(discountBillLevelRequestDto);

		if (CollectionUtils.isEmpty(discountEligibleItemResponseDto.getDiscountDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "No Item eligible for TSSS discount",
					SalesConstants.ERR_SALE_294, Map.of(SalesConstants.REMARKS, "No Item eligible for TSSS discount"));
		}

		discountUtilService.validateAndCreateBestDiscountForEligibleItems(salesTxn, discountEligibleItemResponseDto,
				discountBillLevelCreateDto);

		// Update sales txn details with TSSS coupon details
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		// Added to captured applied time of each check boxed discount
		discountBillLevelCreateDto.getTsssDetails().setAppliedDate(CalendarUtils.getCurrentDate());
		String discountId=discountBillLevelCreateDto.getDiscountDetails().get(0).getDiscountId();
		TSSSDiscountDetailsDto tsssDiscountDetailsDto=discountBillLevelCreateDto.getTsssDetails();
		EmployeeCouponDetailDto couponDetailDto=tsssDiscountDetailsDto.getCouponDetails().get(0);
		couponDetailDto.setRedeemTxnId(discountId);
		discountTxnDetails.setTsssDetails(tsssDiscountDetailsDto);
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

		if (StringUtils.isEmpty(discountTransactionDetails.getTsssDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "TSSS coupon details not found to redeem",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "TSSS coupon details not found to redeem"));
		}

		if (!CollectionUtils.isEmpty(discountTransactionDetails.getTsssDetails().getCouponDetails())) {
			EmployeeCouponDetailDto employeeCouponDetailDto = discountTransactionDetails.getTsssDetails()
					.getCouponDetails().get(0);

			// If Coupon is already redeemed, just return
			if (!StringUtils.isEmpty(employeeCouponDetailDto.getRedeemStatus())
					&& employeeCouponDetailDto.getRedeemStatus().equalsIgnoreCase("REDEEMED")) {
				return;
			}

			DiscountCouponDto tsssDiscountDto = new DiscountCouponDto();
			tsssDiscountDto.setCouponCode(employeeCouponDetailDto.getCouponCode());
			tsssDiscountDto.setDiscountId(discountDaoList.get(0).getDiscountId());
			tsssDiscountDto.setStatus(DiscountCouponStatusEnum.REDEEMED.name());

			// Redeem TSSS coupon code w.r.t EPOSS
			epossCallService.callEposs(HttpMethod.PATCH, TSSS_REDEMPTION_API_URL, null,
					new TSSSCouponRedeemDto(List.of(tsssDiscountDto)), DiscountCouponUpdateResponseDto.class);

			// Pending: Will any thrown from the eposs api? Need to check with sivaleela
			employeeCouponDetailDto.setRedeemStatus(DiscountSalesStatusEnum.REDEEMED.name());

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

		if (StringUtils.isEmpty(discountTransactionDetails.getTsssDetails())) {
			throw new ServiceException(SalesConstants.INVALID_REQUEST + "TSSS coupon details not found to delete",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "TSSS coupon details not found to delete"));
		}

		if (!CollectionUtils.isEmpty(discountTransactionDetails.getTsssDetails().getCouponDetails())) {
			EmployeeCouponDetailDto employeeCouponDetailDto = discountTransactionDetails.getTsssDetails()
					.getCouponDetails().get(0);

			// If Coupon is already redeemed, revert back the redemption
			if (!StringUtils.isEmpty(employeeCouponDetailDto.getRedeemStatus())
					&& employeeCouponDetailDto.getRedeemStatus().equalsIgnoreCase("REDEEMED")) {

				DiscountCouponDto tsssDiscountDto = new DiscountCouponDto();
				tsssDiscountDto.setCouponCode(employeeCouponDetailDto.getCouponCode());
				tsssDiscountDto.setDiscountId(itemDiscountDetailsList.get(0).getDiscountDetail().getDiscountId());
				tsssDiscountDto.setStatus(DiscountCouponStatusEnum.OPEN.name());

				// Call Reverse redeem method of TSSS coupon codes
				epossCallService.callEposs(HttpMethod.PATCH, TSSS_REDEMPTION_API_URL, null,
						new TSSSCouponRedeemDto(List.of(tsssDiscountDto)), DiscountCouponUpdateResponseDto.class);

			}

			if (!CollectionUtils.isEmpty(itemDiscountDetailsList)) {

				Set<String> updatedItemIds = itemDiscountDetailsList.stream().map(DiscountItemDetailsDaoExt::getItemId)
						.collect(Collectors.toSet());

				discountUtilService.deleteAllItemDiscountDetails(itemDiscountDetailsList);

				// Update discount values for the impacted items
				if (!CollectionUtils.isEmpty(updatedItemIds))
					discountUtilService.updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);
			}

			// Delete TSSS Coupon details from discount txn details of sales txn data
			discountTransactionDetails.setTsssDetails(null);

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
		discountTransactionDetails.getTsssDetails().setCouponDetails(List.of(employeeCouponDetailDto));
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
