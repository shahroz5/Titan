/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
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

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for High Value Discount
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("salesHighValueDiscountServiceImpl")
public class HighValueDiscountServiceImpl implements DiscountService {

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";

	private static final String ERR_CORE_003 = "ERR-CORE-003";

	public HighValueDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name(), this);
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

		List<DiscountItemDetailsDaoExt> discountItemDetailsDaoList = discountItemDetailsRepository
				.findAllByDiscountDetailSalesTxnIdAndDiscountDetailDiscountId(salesTxn.getId(),
						discountDetail.getDiscountId());

		DiscountDetailsDaoExt discountDetailsDao = new DiscountDetailsDaoExt();

		// If No other items availed the same high value discount before, Create as
		// Individual
		// discount
		if (CollectionUtils.isEmpty(discountItemDetailsDaoList)) {

			// Create Discount details
			discountDetailsDao = discountUtilService.createDiscountDetails(discountDetail, salesTxn,
					DiscountApplicableLevelEnum.ITEM_LEVEL.name(), discountOtherDetails,
					DiscountInitialStatusEnum.HIGH_VALUE_DISCOUNT.getDiscountInitialStatus(), null);
		} else {

			// If some items have already availed the same high value discount,Check for
			// cumulative possibilities.
			List<DiscountItemDetailsDaoExt> applicableCumulativeItems = new ArrayList<>();

			// If IsSingle config is true, only same product group code items will
			// participate in cumulative process
			if (BooleanUtils.isTrue(
					discountEngineResponseConfigs.getDiscountConfigDetails().getSlabConfigDetails().getIsSingle())) {

				List<SalesItemDetailsDto> itemDetailsList = discountUtilService
						.getTransactionSpecificItemDetails(salesTxn, List.of(discountOtherDetails.getItemId()));

				applicableCumulativeItems = discountItemDetailsDaoList.stream()
						.filter(discountItemDetailsDao -> discountItemDetailsDao.getProductGroupCode()
								.equalsIgnoreCase(itemDetailsList.get(0).getProductGroupCode()))
						.collect(Collectors.toList());
			} else {
				// All kind of product group codes can be part of cumulative process
				applicableCumulativeItems.addAll(discountItemDetailsDaoList);
			}

			// Validate applicable theme digits
			Map<String, Set<String>> eligibleItemGroups = validateHighValueDiscountEligibility(salesTxn,
					discountOtherDetails.getItemId(), applicableCumulativeItems,
					discountEngineResponseConfigs.getDiscountConfigDetails());

			for (Map.Entry<String, Set<String>> entry : eligibleItemGroups.entrySet()) {
				List<String> itemCodes = entry.getValue().stream().collect(Collectors.toList());
				if (itemCodes.size() > 1) {

					List<DiscountItemDetailsDaoExt> eligibleItemDiscountDetailsList = discountItemDetailsRepository
							.findAllByDiscountDetailSalesTxnIdAndDiscountDetailDiscountIdAndItemCodeIn(salesTxn.getId(),
									discountDetail.getDiscountId(), itemCodes);

					List<SalesItemDetailsDto> itemDetailsList = discountUtilService
							.getTransactionSpecificItemDetails(salesTxn, List.of(discountOtherDetails.getItemId()));

					discountUtilService.applyCumulativeDiscounts(salesTxn, discountDetail,
							discountOtherDetails.getItemId(), eligibleItemDiscountDetailsList,
							discountDetail.getDiscountId().concat("-").concat(entry.getKey()),
							itemDetailsList.stream().map(SalesItemDetailsDto::getId).collect(Collectors.toList()),
							discountOtherDetails);
				}
			}
			// Create Discount details
			discountDetailsDao = discountUtilService.createDiscountDetails(discountDetail, salesTxn,
					DiscountApplicableLevelEnum.ITEM_LEVEL.name(), discountOtherDetails,
					DiscountInitialStatusEnum.HIGH_VALUE_DISCOUNT.getDiscountInitialStatus(), null);

		}

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

	private Map<String, Set<String>> validateHighValueDiscountEligibility(SalesTxnDaoExt salesTxn, String itemId,
			List<DiscountItemDetailsDaoExt> applicableCumulativeItems, DiscountDetailsBaseDto discountConfigDetails) {
		List<String> cumulativeItemIds = applicableCumulativeItems.stream().map(DiscountItemDetailsDaoExt::getItemId)
				.collect(Collectors.toList());
		cumulativeItemIds.add(itemId);

		List<SalesItemDetailsDto> itemDetailsList = discountUtilService.getTransactionSpecificItemDetails(salesTxn,
				cumulativeItemIds);

		List<String> itemCodes = itemDetailsList.stream().map(SalesItemDetailsDto::getItemCode)
				.collect(Collectors.toList());

		Map<String, Boolean> applicableThemeDigits;
		try {
			applicableThemeDigits = MapperUtil.getObjectMapperInstance().readValue(
					MapperUtil.getStringFromJson(discountConfigDetails.getApplicableThemeDetails().getData()),
					new TypeReference<Map<String, Boolean>>() {
					});
		} catch (IOException e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003, e.getLocalizedMessage());
		}

		Set<Integer> indexes = new TreeSet<>();
		for (Map.Entry<String, Boolean> entry : applicableThemeDigits.entrySet()) {
			if (entry.getValue())
				indexes.add(Integer.valueOf(entry.getKey().substring(entry.getKey().indexOf('t') + 1)) - 1);
		}

		log.info("Configured digit indexes - {}", indexes);

		Map<String, Set<String>> itemGroup = new HashMap<>();

		for (String itemCode : itemCodes) {
			String grpCode = getUniqueKeyByItemCodeAndDigitIndexes(itemCode, indexes);
			Set<String> itemCommon = itemGroup.get(grpCode);
			if (itemCommon == null) {
				itemCommon = new HashSet<>();
			}
			itemCommon.add(itemCode);
			itemGroup.put(grpCode, itemCommon);
		}

		log.info("Item Group eligible for High value discount - {}", itemGroup);

		return itemGroup;
	}

	public String getUniqueKeyByItemCodeAndDigitIndexes(String itemCode, Collection<Integer> indexes) {
		StringBuilder sb = new StringBuilder();
		for (Integer index : indexes) {
			if (index > itemCode.length() - 1)
				break;
			sb.append(itemCode.charAt(index));
		}
		return sb.toString();
	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// NA

	}

}
