/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl.discount;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountCalRequestDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountEngineResponseDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.RivaahCardDiscountDetailsDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.constants.DiscountInitialStatusEnum;
import com.titan.poss.sales.constants.DiscountSalesStatusEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.CustomerCouponDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.constants.RivaahCardStatusEnum;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.CreditNoteDiscountDetailsDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;
import com.titan.poss.sales.dto.response.DiscountResponseDto;
import com.titan.poss.sales.factory.DiscountFactory;
import com.titan.poss.sales.repository.CreditNoteRepositoryExt;
import com.titan.poss.sales.repository.CustomerRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CommonCashMemoService;
import com.titan.poss.sales.service.DiscountService;
import com.titan.poss.sales.service.DiscountUtilService;
import com.titan.poss.sales.service.EngineService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesRivaahCardDiscountServiceImpl")
public class RivaahCardDiscountServiceImpl implements DiscountService {

	public RivaahCardDiscountServiceImpl(DiscountFactory discountFactory) {
		discountFactory.registerDiscountService(DiscountTypeEnum.RIVAAH_CARD_DISCOUNT.name(), this);
	}

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private EngineService engineService;

	@Autowired
	private CreditNoteRepositoryExt creditNoteRepositoryExt;

	@Autowired
	private SystemGepPurityDisountServiceImpl systemGepPurityDisountServiceImpl;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private CommonCashMemoService commonCashMemoService;

	@Autowired
	private CustomerRepositoryExt customerRepo;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Override
	public void validateEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn) {
		// TODO Auto-generated method stub

	}

	@Override
	public DiscountDetailsDaoExt addDiscount(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail,
			DiscountDetailsResponseDto discountEngineResponseConfigs, DiscountOtherDetailsDto discountOtherDetails) {

		return null;
	}

	@Override
	public void deleteDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailsDaoExt) {
		// TODO Auto-generated method stub
	}

	@Override
	public void validateOrderConfigs(SalesTxnDaoExt salesTxn, DiscountOrderConfigDetails orderConfigDetails,
			DiscountOtherDetailsDto discountOtherDetailsDto, String discountCode) {
		// TODO Auto-generated method stub

	}

	@Override
	public void validateDiscountEligibililty(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId) {
		// TODO Auto-generated method stub

	}

	@Override
	public DiscountResponseDto applyTransactionLevelDiscount(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType) {
		if (StringUtils.isEmpty(discountBillLevelCreateDto.getRivaahCardDetails())) {
			throw new ServiceException(
					SalesConstants.INVALID_REQUEST + "RIVAAH CARD coupon details not found to validate",
					SalesConstants.ERR_SALE_294,
					Map.of(SalesConstants.REMARKS, "RIVAAH CARD details not found to validate"));
		}
		RivaahCardDiscountDetailsDto rivaahDetails = discountBillLevelCreateDto.getRivaahCardDetails();
		// validate rivaah card coupon
		validateRivaahCoupon(rivaahDetails, salesTxn);
		List<DiscountDetailResponseDto> discountDetails = calculateRivaahDiscount(salesTxn, discountType,
				Boolean.FALSE);
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		discountTxnDetails.setRivaahCardDetails(rivaahDetails);
		salesTxn.setDiscountTxnDetails(
				MapperUtil.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
		salesTxnRepository.save(salesTxn);

		return new DiscountResponseDto(discountDetails);
	}

	private void removeRivaahCouponFromTxn(SalesTxnDaoExt salesTxn) {
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		discountTxnDetails.setRivaahCardDetails(null);
		salesTxn.setDiscountTxnDetails(
				MapperUtil.getJsonString(new JsonData(SalesConstants.DISCOUNT_TXN_DETAILS, discountTxnDetails)));
		salesTxnRepository.save(salesTxn);

	}

	public List<DiscountDetailResponseDto> calculateRivaahDiscount(SalesTxnDaoExt salesTxn, String discountType,
			Boolean isRivaahUpdate) {

		List<DiscountDetailsDaoExt> discountDetailsList = getRivaahAppliedDiscounts(salesTxn);

		if (BooleanUtils.isFalse(isRivaahUpdate)) {
			return addRivaahDiscount(salesTxn, discountType, discountDetailsList, isRivaahUpdate);
		} else {
			discountUtilService.removeRivaahDiscounts(salesTxn);
			return addRivaahDiscount(salesTxn, discountType, discountDetailsList, isRivaahUpdate);
		}
	}

	private List<DiscountDetailsDaoExt> getRivaahAppliedDiscounts(SalesTxnDaoExt salesTxn) {
		return discountDetailsRepository.findAllBySalesTxnIdAndDiscountTypeIn(salesTxn.getId(),
				Set.of(DiscountTypeEnum.CATEGORY_DISCOUNT.name(), DiscountTypeEnum.SLAB_BASED_DISCOUNT.name(),
						DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name(), DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT.name(),
						DiscountTypeEnum.BEST_DEAL_DISCOUNT.name(),
						DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name()));
	}

	private List<DiscountDetailResponseDto> addRivaahDiscount(SalesTxnDaoExt salesTxn, String discountType,
			List<DiscountDetailsDaoExt> discountDetailsList, Boolean isRivaahUpdate) {
		List<DiscountDetailResponseDto> discountDetailsResponse = new ArrayList<>();
		if (BooleanUtils.isTrue(isRivaahUpdate) && CollectionUtil.isEmpty(discountDetailsList)) {
			return discountDetailsResponse;
		}
		if (CollectionUtil.isEmpty(discountDetailsList))
			throw new ServiceException("No eligible discount present to apply RIVAAH CARD", "ERR-SALE-352");
		DiscountBillLevelRequestDto discountBillLevelRequestDto = new DiscountBillLevelRequestDto();
		discountBillLevelRequestDto.setBusinessDate(salesTxn.getDocDate());
		discountBillLevelRequestDto.setDiscountType(discountType);
		DiscountBillLevelResponseDto discountBillLevel = engineService
				.getDiscountsAtBillLevel(discountBillLevelRequestDto);
		discountDetailsList.forEach(discountDetail -> {
			DiscountDetailsBaseDto discountDetailsConfigs = engineService
					.getDiscountConfigDetails(discountDetail.getDiscountId());
			DiscountDetailsDaoExt discountDetailsRivaah = createBillLevelRivaahDiscount(discountBillLevel, salesTxn,
					discountDetail);
			List<DiscountItemDetailsDaoExt> discountItemListRivaah = new ArrayList<>();
			if (!discountDetail.getDiscountType()
					.equalsIgnoreCase(DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name())) {
				if (BooleanUtils.isTrue(discountDetailsConfigs.getDiscountAttributes().getIsRiva()))
					discountItemListRivaah = createItemLevelDiscountsForRivaahOtherDiscounts(discountDetail,
							discountDetailsRivaah, salesTxn);
			} else {
				discountItemListRivaah = createItemLevelDiscountsForRivaahGepPurity(discountDetail,
						discountDetailsRivaah, salesTxn);
			}
			if (!CollectionUtil.isEmpty(discountItemListRivaah)) {
				discountItemDetailsRepository.saveAll(discountItemListRivaah);
				discountUtilService.updateTransactionSpecificItemDetails(salesTxn, discountItemListRivaah.stream()
						.map(DiscountItemDetailsDaoExt::getItemId).collect(Collectors.toSet()), Boolean.FALSE);
				discountDetailsResponse.add(discountUtilService.getDiscountDetailsResponseDto(discountDetailsRivaah));
			} else {
				discountDetailsRepository.delete(discountDetailsRivaah);
			}
		});
		if (BooleanUtils.isTrue(isRivaahUpdate) && CollectionUtil.isEmpty(discountDetailsResponse)) {
			return discountDetailsResponse;
		}
		if (CollectionUtil.isEmpty(discountDetailsResponse)) {
			throw new ServiceException(
					"Additional configuration has not been added for any of the eligible discounts to apply RIVAAH CARD",
					"ERR-SALE-354");
		}
		return discountDetailsResponse;
	}

	private List<DiscountItemDetailsDaoExt> createItemLevelDiscountsForRivaahGepPurity(
			DiscountDetailsDaoExt discountDetail, DiscountDetailsDaoExt discountDetailsRivaah,
			SalesTxnDaoExt salesTxn) {

		if (StringUtils.isEmpty(discountDetail.getRefPayment().getId())) {
			throw new ServiceException(SalesConstants.INVALID_INPUTS, SalesConstants.ERR_SALE_048,
					"Payment id is required to add the dsicount.");
		}

		PaymentDetailsDaoExt paymentDetailsDao = paymentDetailsRepository.findByIdAndSalesTxnDaoLocationCode(
				discountDetail.getRefPayment().getId(), CommonUtil.getLocationCode());
		CreditNoteDaoExt creditNoteDao = creditNoteRepositoryExt.getOne(paymentDetailsDao.getReference3());
		CreditNoteDiscountDetailsDto cnDiscountDetails = systemGepPurityDisountServiceImpl
				.getCreditNoteDiscountDetails(creditNoteDao);
		BigDecimal utilzPct = systemGepPurityDisountServiceImpl.getUtilzPct(paymentDetailsDao, creditNoteDao);

		Map<String, DiscountItemDetailsDaoExt> itemIdAndCreatedDiscountItemDetailsMap = systemGepPurityDisountServiceImpl
				.calculateGepPurityDiscount(salesTxn, salesTxn.getDocDate(), cnDiscountDetails, utilzPct,
						discountDetailsRivaah, creditNoteDao, Boolean.TRUE);
		List<DiscountItemDetailsDaoExt> discountItemListToSave = new ArrayList<>();
		BigDecimal discountAmount = BigDecimal.ZERO;
		if (!itemIdAndCreatedDiscountItemDetailsMap.isEmpty()) {
			for (Map.Entry<String, DiscountItemDetailsDaoExt> discountItem : itemIdAndCreatedDiscountItemDetailsMap
					.entrySet()) {
				discountItem.getValue().setIsRivaahDiscount(Boolean.TRUE);
				discountAmount = discountAmount.add(discountItem.getValue().getDiscountValue());
				discountItemListToSave.add(discountItem.getValue());
			}
			discountDetailsRivaah.setDiscountValue(discountAmount);
			discountDetailsRepository.save(discountDetailsRivaah);
			return discountItemListToSave;
		} else {
			return discountItemListToSave;
		}
	}

	private List<DiscountItemDetailsDaoExt> createItemLevelDiscountsForRivaahOtherDiscounts(
			DiscountDetailsDaoExt discountDetail, DiscountDetailsDaoExt discountDetailsRivaah,
			SalesTxnDaoExt salesTxn) {
		List<DiscountItemDetailsDaoExt> itemDetailsList = discountItemDetailsRepository
				.findAllByDiscountDetailId(discountDetail.getId());
		List<DiscountItemDetailsDaoExt> discountItemListToSave = new ArrayList<>();
		List<DiscountCalRequestDto> discountCalDtoList = new ArrayList<>();
		BigDecimal discountAmount = BigDecimal.ZERO;
		itemDetailsList.forEach(discountItem -> {
			RivaahGhsDiscountDto rivaahGhsDetails = null;
			if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()
					.equals(discountItem.getDiscountDetail().getDiscountType())) {
				rivaahGhsDetails = MapperUtil.mapObjToClass(MapperUtil
						.mapObjToClass(discountItem.getDiscountDetail().getDiscountValueDetails(), JsonData.class)
						.getData(), RivaahGhsDiscountDto.class);
			}
			DiscountCalRequestDto discountEngineRequestDto = discountUtilService.getDiscountEngineRequestDto(salesTxn,
					discountItem.getItemId(), rivaahGhsDetails, null);
			discountCalDtoList.add(discountEngineRequestDto);
		});
		Map<String, DiscountEngineResponseDto> itemLevelDiscountsMap = engineService
				.calculateRivaahDiscountsForAllItemsInDiscount(discountDetail.getDiscountType(),
						discountDetail.getDiscountId(), discountCalDtoList);
		if (!CollectionUtils.isEmpty(itemLevelDiscountsMap)) {
			for (DiscountItemDetailsDaoExt discountItem : itemDetailsList) {
				DiscountEngineResponseDto discount = itemLevelDiscountsMap.get(discountItem.getItemId());
				if (discount != null) {
					discountAmount = discountAmount
							.add(discount.getDiscountDetailsResponseDto().get(0).getDiscountValue());
					DiscountItemDetailsDaoExt discountItemToSave = new DiscountItemDetailsDaoExt();
					discountItemToSave.setDiscountDetail(discountDetailsRivaah);
					discountItemToSave.setItemId(discountItem.getItemId());
					discountItemToSave
							.setDiscountValue(discount.getDiscountDetailsResponseDto().get(0).getDiscountValue());
					discountItemToSave.setPreDiscountValue(discountItem.getPreDiscountValue());
					if (StringUtils.isEmpty(discountItem.getProductGroupCode()))
						discountItemToSave.setProductGroupCode(discountItem.getProductGroupCode());
					if (StringUtils.isEmpty(discountItem.getItemCode()))
						discountItemToSave.setItemCode(discountItem.getItemCode());
					if (StringUtils.isEmpty(discountItem.getLotNumber()))
						discountItemToSave.setLotNumber(discountItem.getLotNumber());
					JsonData discountValueDetails = new JsonData();
					discountValueDetails.setType("DISCOUNT_VALUE_DETAILS");
					discountValueDetails
							.setData(discount.getDiscountDetailsResponseDto().get(0).getDiscountValueDetails());
					discountItemToSave.setDiscountValueDetails(MapperUtil.getStringFromJson(discountValueDetails));
					discountItemToSave.setIsRivaahDiscount(Boolean.TRUE);
					discountItemListToSave.add(discountItemToSave);
				}
			}
		}
		discountDetailsRivaah.setDiscountValue(discountAmount);
		discountDetailsRepository.save(discountDetailsRivaah);
		return discountItemListToSave;
	}

	private DiscountDetailsDaoExt createBillLevelRivaahDiscount(DiscountBillLevelResponseDto discountBillLevel,
			SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetail) {
		DiscountDetailsDaoExt discountDetailsRivaah = new DiscountDetailsDaoExt();
		discountDetailsRivaah.setDiscountId(discountBillLevel.getDiscountDetails().get(0).getDiscountId());
		discountDetailsRivaah.setDiscountCode(discountBillLevel.getDiscountDetails().get(0).getDiscountCode());
		discountDetailsRivaah.setDiscountType(discountBillLevel.getDiscountDetails().get(0).getDiscountType());
		discountDetailsRivaah.setDiscountSubType(discountDetail.getDiscountType());
		discountDetailsRivaah.setSalesTxn(salesTxn);
		DiscountDetailsBaseDto discountDetailsBaseDto = engineService
				.getDiscountConfigDetails(discountBillLevel.getDiscountDetails().get(0).getDiscountId());
		discountDetailsRivaah.setDiscountConfig(discountUtilService.saveDiscountConfigDetails(discountDetailsBaseDto));
		discountDetailsRivaah.setApplicableLevel(discountDetail.getApplicableLevel());
		discountDetailsRivaah.setStatus(DiscountInitialStatusEnum.RIVAAH_CARD_DISCOUNT.getDiscountInitialStatus());
		discountDetailsRivaah.setDiscountValue(BigDecimal.ZERO);
		discountDetailsRivaah.setIsEdited(Boolean.FALSE);
		discountDetailsRivaah.setRivaahCardDiscountId(discountDetail.getId());
		return discountDetailsRepository.save(discountDetailsRivaah);
	}

	private void validateRivaahCoupon(RivaahCardDiscountDetailsDto rivaahDetails, SalesTxnDaoExt salesTxn) {
		Set<Integer> customerSet = new HashSet<>();
		customerSet.add(salesTxn.getCustomerId());
		List<Object[]> object = customerRepo.getCustomerNamesByIds(CommonUtil.getLocationCode(), customerSet);
		ApiResponseDto apiResponse = commonCashMemoService.callEpossCustomerCoupon((String) object.get(0)[2],
				rivaahDetails.getCouponCode(), null, null);
		CustomerCouponDto customerCouponDto = MapperUtil.getObjectMapperInstance()
				.convertValue(apiResponse.getResponse(), CustomerCouponDto.class);
		if (salesTxn.getDocDate().after(customerCouponDto.getExpiryDate())) {
			commonCashMemoService.callEpossCustomerCoupon((String) object.get(0)[2], null,
					RivaahCardStatusEnum.EXPIRED.name(), null);
			throw new ServiceException("Invalid coupon code", "ERR-SALE-351");
		}
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		if (discountTxnDetails != null && discountTxnDetails.getRivaahCardDetails() != null
				&& discountTxnDetails.getRivaahCardDetails().getCouponCode() != null) {
			throw new ServiceException("RIVAAH CARD is already applied in the cash memo", "ERR-SALE-355");
		}
	}

	@Override
	public void confirmTransactionLevelDiscount(SalesTxnDaoExt salesTxn, String discountType, String discountTxnId) {
		DiscountTransactionDetails discountTxnDetails = discountUtilService.getDiscountTxnDetails(salesTxn);
		if (discountTxnDetails != null && discountTxnDetails.getRivaahCardDetails() != null
				&& discountTxnDetails.getRivaahCardDetails().getCouponCode() != null) {
			List<DiscountDetailsDaoExt> rivaahDiscountDetails = discountDetailsRepository
					.findAllBySalesTxnIdAndDiscountTypeIn(salesTxn.getId(),
							Set.of(DiscountTypeEnum.RIVAAH_CARD_DISCOUNT.name()));
			if (!CollectionUtil.isEmpty(rivaahDiscountDetails)) {
				rivaahDiscountDetails.forEach(rivaahDiscount -> {
					rivaahDiscount.setStatus(DiscountSalesStatusEnum.CONFIRMED.name());
				});
				Set<Integer> customerSet = new HashSet<>();
				customerSet.add(salesTxn.getCustomerId());
				List<Object[]> object = customerRepo.getCustomerNamesByIds(CommonUtil.getLocationCode(), customerSet);
				ApiResponseDto apiResponse = commonCashMemoService.callEpossCustomerCoupon((String) object.get(0)[2],
						null, null, null);
				CustomerCouponDto customerCouponDto = MapperUtil.getObjectMapperInstance()
						.convertValue(apiResponse.getResponse(), CustomerCouponDto.class);
				if (customerCouponDto != null) {
					if (customerCouponDto.getAttempts() + 1 == customerCouponDto.getTotalCount())
						commonCashMemoService.callEpossCustomerCoupon((String) object.get(0)[2], null,
								RivaahCardStatusEnum.LIMIT_EXCEEDED.name(), null);
					else
						commonCashMemoService.callEpossCustomerCoupon((String) object.get(0)[2], null,
								RivaahCardStatusEnum.OPEN.name(), null);
				}
				discountDetailsRepository.saveAll(rivaahDiscountDetails);
			}
		}
	}

	@Override
	public void deleteTransactionLevelDiscounts(SalesTxnDaoExt salesTxn, String discountType) {
		discountUtilService.removeRivaahDiscounts(salesTxn);
		removeRivaahCouponFromTxn(salesTxn);

	}

	@Override
	public void updateTransactionLevelDiscount(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetailDao,
			Boolean isPriceUpdate) {
		// TODO Auto-generated method stub

	}

	@Override
	public void applyTransactionLevelDiscountFromOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao, String discountType) {
		// TODO Auto-generated method stub

	}

}
