/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.discount.dto.DigiGoldTanishqDiscountDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesDigiGoldDiscountServiceImpl")
public class DigiGoldDiscountServiceImpl implements DiscountService {

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	public DigiGoldDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.DIGI_GOLD_DISCOUNT.name(), this);
	}

	@Override
	public void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {
		// NA

	}

	@Override
	public DiscountDetailsDaoExt addDiscount(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			DiscountDetailsResponseDto discountEngineResponseConfigs, DiscountOtherDetailsDto discountOtherDetails) {
		// NA
		return null;
	}

	@Override
	public void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailsDaoExt) {
		List<DiscountItemDetailsDaoExt> apportionedItemDiscounts = discountItemDetailsRepository
				.findAllByDiscountDetailId(discountDetailsDaoExt.getId());

		if (!CollectionUtils.isEmpty(apportionedItemDiscounts)) {
			Set<String> updatedItemIds = apportionedItemDiscounts.stream().map(DiscountItemDetailsDaoExt::getItemId)
					.collect(Collectors.toSet());

			// Delete the apportioned discount values at item level
			discountItemDetailsRepository.deleteByDiscountDetailId(discountDetailsDaoExt.getId());

			// Update discount values for the impacted items
			discountUtilService.updateTransactionSpecificItemDetails(salesTxn, updatedItemIds, false);

		}

		// Delete bill level discount at sales transaction level
		discountDetailsRepository.deleteById(discountDetailsDaoExt.getId());

		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		discountTxnDetails.setDigiGoldDetails(null);
		salesTxn.setDiscountTxnDetails(
				MapperUtil.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));

		salesTxnRepository.save(salesTxn);

	}

	@Override
	public void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode) {
		// NA

	}

	@Override
	public void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId) {
		// NA

	}

	@Override
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {
		// Validate If DV discount already applied
		discountUtilService.checkIfDVApplied(salesTxn, "No discount allowed after GHS DV is added.", null);

		String locationCode = CommonUtil.getStoreCode();
		List<DiscountDetailResponseDto> discountDetails = new ArrayList<>();
		discountBillLevelCreateDto.getDiscountDetails().forEach(discountBillDetail -> {
			if (discountBillDetail.getDiscountValue() != null
					&& discountBillDetail.getDiscountValue().compareTo(BigDecimal.ZERO) != 0) {
				DiscountDetailsDaoExt discountDetailsDaoExt = new DiscountDetailsDaoExt();

				// if refPaymentId is present, then
				// doubt; utilization % to be checked?
				PaymentDetailsDaoExt paymentDetailsDao = checkIfRefPaymentIdExists(discountBillLevelCreateDto,
						locationCode, discountBillDetail);

				DiscountDetailsBaseDto discountDetailsBaseDto = engineService
						.getDiscountConfigDetails(discountBillDetail.getDiscountId());

				// Create Discount details
				discountDetailsDaoExt = discountUtilService.createBillLevelDiscountDetails(discountBillDetail, salesTxn,
						DiscountApplicableLevelEnum.BILL_LEVEL.name(),
						DiscountInitialStatusEnum.DIGI_GOLD_DISCOUNT.getDiscountInitialStatus(),
						discountBillDetail.getDiscountValue());
				DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);

				DigiGoldTanishqDiscountDto digiGoldDiscount = new DigiGoldTanishqDiscountDto();
				digiGoldDiscount.setDiscountValue(discountBillDetail.getDiscountValue());
				discountTxnDetails.setDigiGoldDetails(digiGoldDiscount);

				salesTxn.setDiscountTxnDetails(MapperUtil
						.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
				salesTxnRepository.save(salesTxn);

				//disable isDiscountPresent flag once discount is applied 
				paymentDetailsDao=discountUtilService.disableIsDiscountPresent(paymentDetailsDao);
				discountDetailsDaoExt.setRefPayment(paymentDetailsDao);

				// Save discount config details & Link to the discount applied
				discountDetailsDaoExt
						.setDiscountConfig(discountUtilService.saveDiscountConfigDetails(discountDetailsBaseDto));

				List<SalesItemDetailsDto> salesItemList = discountUtilService
						.getTransactionSpecificItemDetails(salesTxn, null);

				discountDetailsRepository.save(discountDetailsDaoExt);

				// Apportion the bill discounts to the eligible item Id's
				discountUtilService.apportionBillLevelDiscountsToApplicableItems(discountDetailsDaoExt, salesTxn,
						salesItemList.stream().map(SalesItemDetailsDto::getId).collect(Collectors.toList()), null);

				discountDetails.add(discountUtilService.getDiscountDetailsResponseDto(discountDetailsDaoExt));
			}
		});

		return new DiscountResponseDto(discountDetails);
	}

	/**
	 * @param discountBillLevelCreateDto
	 * @param locationCode
	 * @param discountBillDetail
	 * @return
	 */
	private PaymentDetailsDaoExt checkIfRefPaymentIdExists(DiscountBillLevelCreateDto discountBillLevelCreateDto,
			String locationCode, DiscountBillLevelItemDetailsDto discountBillDetail) {
		try {
			PaymentDetailsDaoExt paymentDetailsDao = discountUtilService.getRefPaymentDetailById(
					discountBillLevelCreateDto.getDiscountDetails().get(0).getRefPaymentId(),
					PaymentCodeEnum.DIGI_GOLD_TANISHQ.getPaymentcode(), locationCode);
			return paymentDetailsDao;
		} catch (Exception e) {
			PaymentDetailsDaoExt paymentDetailsDao = discountUtilService.getRefPaymentDetailById(
					discountBillLevelCreateDto.getDiscountDetails().get(0).getRefPaymentId(),
					PaymentCodeEnum.CREDIT_NOTE.getPaymentcode(), locationCode);
			return paymentDetailsDao;
		}
	}

	@Override
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {

		List<DiscountDetailsDaoExt> discountDaoList = discountUtilService
				.checkIfDiscountDetailsExistsByDiscountType(discountType, salesTxn, discountTxnId);

		if (!CollectionUtils.isEmpty(discountDaoList)) {
			for (DiscountDetailsDaoExt discountDetails : discountDaoList) {
				// Check at least one item should have apportioned this GHS bonus discount
				List<DiscountItemDetailsDaoExt> discountItemDetailsList = discountItemDetailsRepository
						.findAllByDiscountDetailId(discountDetails.getId());
				if (!CollectionUtils.isEmpty(discountItemDetailsList)) {
					discountDetails.setStatus(DiscountSalesStatusEnum.CONFIRMED.name());
				}
			}
		}

		discountDetailsRepository.saveAll(discountDaoList);
	}

	@Override
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {
		// NA

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
