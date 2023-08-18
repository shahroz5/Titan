/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.LinkDiscountDetailsDto;
import com.titan.poss.core.discount.dto.SlabBasedDiscountDetailsResponseDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;

/**
 * Service class for Slab based Discount
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesSlabBasedDiscountServiceImpl")
public class SlabBasedDiscountServiceImpl implements DiscountService {

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	public SlabBasedDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name(), this);
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

		String discountCategory = null;
		SlabBasedDiscountDetailsResponseDto slabDiscountsResponse = null;
		if (!StringUtils.isEmpty(discountEngineResponseConfigs.getDiscountConfigDetails().getSlabConfigDetails())) {
			discountCategory = discountEngineResponseConfigs.getDiscountConfigDetails().getSlabConfigDetails()
					.getDiscountCategory();
		}

		// Cumulative Discount not applicable for CARAT_BASED Slab discount, So we can
		// ignore cumulative discounts for same.
		List<DiscountItemDetailsDaoExt> discountItemDetailsDaoList = new ArrayList<>();
		List<DiscountItemDetailsDaoExt> bestDealDiscountItemDetailsDaoList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnAndDiscountDetailDiscountType(salesTxn,
						DiscountTypeEnum.BEST_DEAL_DISCOUNT.name());
		if (!StringUtils.isEmpty(discountCategory) && !SalesConstants.CARAT_BASED.equalsIgnoreCase(discountCategory)) {

			discountItemDetailsDaoList = discountItemDetailsRepository
					.findAllByDiscountDetailSalesTxnIdAndDiscountDetailDiscountId(salesTxn.getId(),
							discountDetail.getDiscountId());

		}

		DiscountDetailsDaoExt discountDetailsDao;

		List<SalesItemDetailsDto> itemDetailsList = discountUtilService.getTransactionSpecificItemDetails(salesTxn,
				List.of(discountOtherDetails.getItemId()));

		// get items that can be excluded or applicable for cumulative:
		List<String> itemsValidOrExclude = new ArrayList<>();

		if (!SalesConstants.CARAT_BASED.equalsIgnoreCase(discountCategory)) {
			List<String> itemsToIgnore = new ArrayList<>();
			itemsToIgnore.add(discountOtherDetails.getItemId());
			if (!CollectionUtils.isEmpty(discountItemDetailsDaoList)) {
				itemsToIgnore.addAll(discountItemDetailsDaoList.stream().map(DiscountItemDetailsDaoExt::getItemId)
						.collect(Collectors.toList()));
			}
			if (!CollectionUtils.isEmpty(bestDealDiscountItemDetailsDaoList)) {
				itemsToIgnore.addAll(bestDealDiscountItemDetailsDaoList.stream()
						.map(DiscountItemDetailsDaoExt::getItemId).collect(Collectors.toList()));
			}

			itemsValidOrExclude = discountUtilService
					.getPossibleExcludeItemsForCummulativeDiscount(salesTxn, itemsToIgnore,
							(BooleanUtils.isTrue(discountEngineResponseConfigs.getDiscountConfigDetails()
									.getSlabConfigDetails().getIsSingle())
											? itemDetailsList.get(0).getProductGroupCode()
											: null));
		}

		// If No other items availed the same slab discount before, Create as Individual
		// discount
		// And for CARAT_BASED slab discount, Cumulative discount not applicable
		if ((CollectionUtils.isEmpty(discountItemDetailsDaoList) && bestDealDiscountItemDetailsDaoList.isEmpty()
				&& itemsValidOrExclude.isEmpty())
				|| (!StringUtils.isEmpty(discountCategory)
						&& SalesConstants.CARAT_BASED.equalsIgnoreCase(discountCategory))) {
			// Create Discount details
			discountDetailsDao = discountUtilService.createDiscountDetails(discountDetail, salesTxn,
					DiscountApplicableLevelEnum.ITEM_LEVEL.name(), discountOtherDetails,
					DiscountInitialStatusEnum.SLAB_BASED_DISCOUNT.getDiscountInitialStatus(), null);
		} else {

			// If some items have already availed the same slab discount,Check for
			// cumulative possibilities.
			List<DiscountItemDetailsDaoExt> applicableCumulativeItems = new ArrayList<>();

			// If IsSingle config is true, only same product group code items will
			// participate in cumulative process
			if (BooleanUtils.isTrue(
					discountEngineResponseConfigs.getDiscountConfigDetails().getSlabConfigDetails().getIsSingle())) {

				applicableCumulativeItems = discountItemDetailsDaoList.stream()
						.filter(discountItemDetailsDao -> discountItemDetailsDao.getProductGroupCode()
								.equalsIgnoreCase(itemDetailsList.get(0).getProductGroupCode()))
						.collect(Collectors.toList());
			} else {
				// All kind of product group codes can be part of cumulative process
				applicableCumulativeItems.addAll(discountItemDetailsDaoList);
			}

			if (!bestDealDiscountItemDetailsDaoList.isEmpty()) {
				LinkDiscountDetailsDto linkDiscounts = discountEngineResponseConfigs.getDiscountConfigDetails()
						.getLinkDiscountDetails();
				if (linkDiscounts != null && !linkDiscounts.getLinkDiscountDetails().isEmpty()) {

					for (DiscountItemDetailsDaoExt best : bestDealDiscountItemDetailsDaoList) {

						for (String linkedId : linkDiscounts.getLinkDiscountDetails()) {
							if (best.getDiscountDetail().getDiscountId().equalsIgnoreCase(linkedId)
									&& checkIsSingleFoSlabDiscount(discountEngineResponseConfigs, itemDetailsList,
											best))
								applicableCumulativeItems.add(best);
						}
					}
				}
			}
			if (!StringUtils.isEmpty(discountDetail.getReferenceId())) {
				List<DiscountItemDetailsDaoExt> discountDetails = applicableCumulativeItems.stream().filter(
						applicable -> !applicable.getItemId().equalsIgnoreCase(discountOtherDetails.getItemId()))
						.collect(Collectors.toList());
				if (!discountDetails.isEmpty() || !CollectionUtils.isEmpty(itemsValidOrExclude))
					slabDiscountsResponse = discountUtilService.applyCumulativeOrderToCmDiscounts(salesTxn,
							discountDetail, discountOtherDetails.getItemId(), applicableCumulativeItems,
							discountDetails.get(0).getDiscountDetail().getCumulativeDiscountId(),
							discountDetails.get(0),itemsValidOrExclude);
			} else {
				if (!applicableCumulativeItems.isEmpty() || !CollectionUtils.isEmpty(itemsValidOrExclude)) {
					discountUtilService.applyCumulativeDiscounts(salesTxn, discountDetail,
							discountOtherDetails.getItemId(), applicableCumulativeItems, discountDetail.getDiscountId(),
							itemsValidOrExclude, discountOtherDetails);
				}
			}

			// Create Discount details
			discountDetailsDao = discountUtilService.createDiscountDetails(discountDetail, salesTxn,
					DiscountApplicableLevelEnum.ITEM_LEVEL.name(), discountOtherDetails,
					DiscountInitialStatusEnum.SLAB_BASED_DISCOUNT.getDiscountInitialStatus(), null);

		}

		if (slabDiscountsResponse != null) {
			// Save discount config details & Link to the discount applied
			discountDetailsDao.setDiscountConfig(
					discountUtilService.saveDiscountConfigDetails(slabDiscountsResponse.getDiscountConfigDetails()));
		} else {
			// Save discount config details & Link to the discount applied
			discountDetailsDao.setDiscountConfig(discountUtilService
					.saveDiscountConfigDetails(discountEngineResponseConfigs.getDiscountConfigDetails()));
		}

		return discountDetailsDao;
	}

	private boolean checkIsSingleFoSlabDiscount(DiscountDetailsResponseDto discountEngineResponseConfigs,
			List<SalesItemDetailsDto> itemDetailsList, DiscountItemDetailsDaoExt best) {
		return (BooleanUtils
				.isTrue(discountEngineResponseConfigs.getDiscountConfigDetails().getSlabConfigDetails().getIsSingle())
				&& itemDetailsList.get(0).getProductGroupCode().equals(best.getProductGroupCode()))
				|| BooleanUtils.isNotTrue(
						discountEngineResponseConfigs.getDiscountConfigDetails().getSlabConfigDetails().getIsSingle());
	}

	@Override
	public void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailsDaoExt) {
		// NA

	}

	@Override
	public void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode) {

		// Pending: To be removed
		if (StringUtils.isEmpty(orderConfigDetails)) {
			return;
		}

		if (StringUtils.isEmpty(orderConfigDetails)) {
			throw new ServiceException("Order Configurations not available for the discount applied", "ERR-DISC-015",
					"Discount code : " + discountCode);
		}

		// Is Display on AB being handled in discount engine, no need to validate that
		// again

		// Is gold rate frozen is a pre check to avail this discount done on discount
		// engine

		discountOtherDetailsDto.setMinPaymentPercent(orderConfigDetails.getAbPercent());

	}

	@Override
	public void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId) {
		// NA

	}

	@Override
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {
		// NA
		return null;
	}

	@Override
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {
		// NA

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
