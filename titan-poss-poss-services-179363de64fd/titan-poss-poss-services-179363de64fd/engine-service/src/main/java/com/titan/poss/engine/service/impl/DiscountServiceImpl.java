/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Sets;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.config.dao.ClubbingDiscountsDao;
import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountDetailsDao;
import com.titan.poss.config.dao.DiscountExcludeMappingDao;
import com.titan.poss.config.dao.DiscountItemMappingDao;
import com.titan.poss.config.dao.DiscountLocationMappingDao;
import com.titan.poss.config.dao.DiscountTypeMetaDataDao;
import com.titan.poss.config.dto.DiscountItemMappingSyncDto;
import com.titan.poss.config.dto.EmployeeDiscountTxnResponse;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.DiscountDetailsTypeEnum;
import com.titan.poss.config.dto.constants.ExcludeTypeEnum;
import com.titan.poss.config.dto.request.json.AbCoDetails;
import com.titan.poss.config.dto.request.json.AbDiscount;
import com.titan.poss.config.dto.request.json.CoDiscount;
import com.titan.poss.config.dto.request.json.DiscountCategoryEnum;
import com.titan.poss.config.dto.request.json.EmpowermentDiscount;
import com.titan.poss.config.dto.request.json.OrderConfigDetails;
import com.titan.poss.config.dto.request.json.RivaahItemGroupConfig;
import com.titan.poss.core.discount.dto.AbCoSlabDiscountRequestDto;
import com.titan.poss.core.discount.dto.AbCoValidateDiscountRequestDto;
import com.titan.poss.core.discount.dto.ClubbingDiscountDetailsDto;
import com.titan.poss.core.discount.dto.CummulativeDiscountWithExcludeDto;
import com.titan.poss.core.discount.dto.DiscountApplicableForItemCheckRequestDto;
import com.titan.poss.core.discount.dto.DiscountAutoCalRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelClubDetailsDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountCalRequestDto;
import com.titan.poss.core.discount.dto.DiscountCustDetails;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseResponseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.DiscountEngineResponseDto;
import com.titan.poss.core.discount.dto.DiscountExcludeComplexityPercentDto;
import com.titan.poss.core.discount.dto.DiscountExcludeMcPerGramDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsListRequestDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsListResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsReqDto;
import com.titan.poss.core.discount.dto.DiscountItemLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountItemLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemListResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemPreviewConfigDetailsDto;
import com.titan.poss.core.discount.dto.DiscountItemRegularConfigDetailsDto;
import com.titan.poss.core.discount.dto.DiscountItemsDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.DiscountProductGroupMappingDto;
import com.titan.poss.core.discount.dto.DiscountValueDetails;
import com.titan.poss.core.discount.dto.EligibleDiscountAbItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemDetailsDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsResponseDto;
import com.titan.poss.core.discount.dto.EligibleItemDetails;
import com.titan.poss.core.discount.dto.EmployeeCouponDetailDto;
import com.titan.poss.core.discount.dto.EmployeeDiscountDetailsDto;
import com.titan.poss.core.discount.dto.EmpowermentDetailsDto;
import com.titan.poss.core.discount.dto.EncircleDiscountDto;
import com.titan.poss.core.discount.dto.ExchangeOfferRequestDto;
import com.titan.poss.core.discount.dto.ExchangeOfferResponseDto;
import com.titan.poss.core.discount.dto.ExcludeConfigDto;
import com.titan.poss.core.discount.dto.GepConfigDetailsRes;
import com.titan.poss.core.discount.dto.GepPurityItemsDto;
import com.titan.poss.core.discount.dto.GepPurityScemeValidationRequest;
import com.titan.poss.core.discount.dto.GepPurityScemeValidationResponse;
import com.titan.poss.core.discount.dto.GhsExcludeProductGroupDetailsDto;
import com.titan.poss.core.discount.dto.LocationOfferDetails;
import com.titan.poss.core.discount.dto.MakingChargeData;
import com.titan.poss.core.discount.dto.MetalChargeData;
import com.titan.poss.core.discount.dto.ProductCategoryDetails;
import com.titan.poss.core.discount.dto.ProductGroupDetails;
import com.titan.poss.core.discount.dto.RegularCategoryDetails;
import com.titan.poss.core.discount.dto.RegularCategoryDetailsExtendedForRivaahGhs;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDetailsDto;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.discount.dto.RsPerGramData;
import com.titan.poss.core.discount.dto.SlabBasedDiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.SlabBasedDiscountRequestDto;
import com.titan.poss.core.discount.dto.SlabConfig;
import com.titan.poss.core.discount.dto.SlabConfigDetails;
import com.titan.poss.core.discount.dto.SlabDetails;
import com.titan.poss.core.discount.dto.SlabItemDetailsDto;
import com.titan.poss.core.discount.dto.StoneChargeData;
import com.titan.poss.core.discount.dto.TSSSDiscountDetailsDto;
import com.titan.poss.core.discount.dto.TataEmployeeDiscountDetailsDto;
import com.titan.poss.core.discount.dto.TransactionDetailsDto;
import com.titan.poss.core.discount.dto.UcpData;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountApplicableLevelEnum;
import com.titan.poss.core.domain.constant.enums.DiscountComponentTypeEnum;
import com.titan.poss.core.domain.constant.enums.DiscountEligibilityEnum;
import com.titan.poss.core.domain.constant.enums.GhsSchemeTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.AbCoDiscountRequestDto;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BaseBasicCriteriaDetails;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CumulativeItemDetails;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.DiscountApplicableForItemResponseDto;
import com.titan.poss.core.dto.DiscountDetailsConfigRequestDto;
import com.titan.poss.core.dto.DiscountItemMapiingDto;
import com.titan.poss.core.dto.GcResponseDto;
import com.titan.poss.core.dto.GepOfferDetails;
import com.titan.poss.core.dto.ItemGroupMappingDto;
import com.titan.poss.core.dto.ItemLotStoneBaseDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.enums.GiftCardTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.engine.config.repository.ClubbingDiscountsRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountExcludeMappingRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountItemMappingRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountLocationMappingRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountProductCategoryMappingRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountProductGroupMappingRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountTypeMetaDataRepositoryExt;
import com.titan.poss.engine.config.repository.LinkingDiscountsRepositoryExt;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.dto.response.ItemLotStoneListDto;
import com.titan.poss.engine.sales.repository.GepConfigDetailsRepository;
import com.titan.poss.engine.service.DiscountService;
import com.titan.poss.engine.service.DiscountUtilService;
import com.titan.poss.engine.service.ProductService;
import com.titan.poss.engine.service.SalesService;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.dao.GepConfigDetailsDao;
import com.titan.poss.sales.dto.GepExcludeItemCodeDetails;
import com.titan.poss.sales.dto.GepExcludeThemeCodeDetails;
import com.titan.poss.sales.dto.GepPurityProductGroupDetails;
import com.titan.poss.sales.dto.GepRivaahPurityProductGroupDetails;
import com.titan.poss.sales.repository.SalesTxnRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("EngingDiscountService")
public class DiscountServiceImpl implements DiscountService {

	private static final String MC = "MC";
	private static final String UCP = "UCP";

	private static final String CARAT_BASED = "CARAT_BASED";

	@Autowired
	DiscountRepositoryExt discountRepository;

	@Autowired
	DiscountTypeMetaDataRepositoryExt discountTypeMetaDataRepository;

	@Autowired
	DiscountLocationMappingRepositoryExt discountLocationMappingRepository;

	@Autowired
	ClubbingDiscountsRepositoryExt clubbingRepository;

	@Autowired
	DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	DiscountProductGroupMappingRepositoryExt discountProductMappingRepository;

	@Autowired
	DiscountProductCategoryMappingRepositoryExt discountProductCatRepository;

	@Autowired
	DiscountItemMappingRepositoryExt discountItemMappingRepository;

	@Autowired
    private DataSyncServiceClient dataSyncServiceClient;
	
	@Autowired
	private SalesService salesService;
	

	@Autowired
	private DiscountUtilService discountUtilService;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	public static final String DISCOUNT_ID = "DiscountId";

	@Autowired
	private SalesTxnRepository salesTxnRepository;

	@Autowired
	private ProductService productService;
	


	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepositoryExt;

	@Autowired
	private DiscountExcludeMappingRepositoryExt discountExcludeMappingRepository;

	@Autowired
	private GepConfigDetailsRepository gepConfigDetailsRepository;

	@Autowired
	private LinkingDiscountsRepositoryExt linkingDiscountsRepositoryExt;
	
	@Autowired
    EngineServiceClient engineClient;
	
	
	
	@Override
	public DiscountItemLevelResponseDto getDiscountsAtItemLevel(DiscountItemLevelRequestDto discountRequestDto,
			boolean throwError) {

		List<DiscountDao> finalDiscountDaoList = new ArrayList<>();
		Map<String, CummulativeDiscountWithExcludeDto> validCummulativeDiscountWithExclude = new HashMap<>();// for
																												// cumm.
		// details

		discountRequestDto.setBusinessDate(CalendarUtils.getStartOfDay(discountRequestDto.getBusinessDate()));
		Date businessDate = discountRequestDto.getBusinessDate();
		if (discountRequestDto.getItemDetails() != null) {

			// getting all default discount types
			List<String> discountTypeList = discountTypeMetaDataRepository.findByDiscountTypeForItemLevel();

			List<DiscountDao> defaultDiscountList = null;

			String itemCode = discountRequestDto.getItemDetails().getItemCode();
			String lotNumber = discountRequestDto.getItemDetails().getLotNumber();
			String productGroupCode = discountRequestDto.getItemDetails().getProductGroupCode();
			String productCategoryCode = discountRequestDto.getItemDetails().getProductCategoryCode();

			// defaults discounts
			defaultDiscountList = createItemLevelQuery(discountTypeList, discountRequestDto.getItemDetails(),
					businessDate, itemCode, lotNumber, productGroupCode, productCategoryCode, null);

			// Slab Based Validations
			getValidSlabDiscsounts(defaultDiscountList, discountRequestDto, finalDiscountDaoList,
					validCummulativeDiscountWithExclude);

			validateBestDealDiscount(defaultDiscountList, itemCode, lotNumber, businessDate);

			// validate RIVAAH GHS discount
			validateRivaahGhsDiscount(defaultDiscountList, discountRequestDto);

			List<DiscountDao> validCouponDiscounts = validateTsssDiscount(businessDate, discountRequestDto);
			List<DiscountDao> validTataEmployeeDiscounts = validateTataEmployeeDiscount(businessDate,
					discountRequestDto);
			List<DiscountDao> validEmployeeDiscounts = validateEmployeeDiscount(businessDate, discountRequestDto);
			List<DiscountDao> validEncircleDiscounts = validateEncircleDiscount(businessDate, discountRequestDto);
			List<DiscountDao> validEmpowermentDiscounts = getValidEmpowermentDiscounts(discountRequestDto);

			// adding Tsss discounts if coupons are valid
			if (!CollectionUtils.isEmpty(validCouponDiscounts)) {
				finalDiscountDaoList.addAll(validCouponDiscounts);
			}
			// adding Employee discounts if coupons are valid
			if (!CollectionUtils.isEmpty(validEmployeeDiscounts)) {
				finalDiscountDaoList.addAll(validEmployeeDiscounts);
			}
			// adding TataEmployee discounts if given Employee Info is valid
			if (!CollectionUtils.isEmpty(validTataEmployeeDiscounts)) {
				finalDiscountDaoList.addAll(validTataEmployeeDiscounts);
			}
			// adding Encircle discounts if encircle discount info is present in Request
			if (!CollectionUtils.isEmpty(validEncircleDiscounts)) {
				finalDiscountDaoList.addAll(validEncircleDiscounts);
			}
			// adding empowerment discounts if empower discount info is present in Request
			if (!CollectionUtils.isEmpty(validEmpowermentDiscounts)) {
				finalDiscountDaoList.addAll(validEmpowermentDiscounts);
			}
			finalDiscountDaoList.addAll(defaultDiscountList);

			// removing discounts based on condition from finalDiscountList
			if (discountRequestDto.getTransactionDetails() != null) {
				log.info("final Disounts without TransactionType Check : " + finalDiscountDaoList);
				createDiscountListWrtTransactionType(discountRequestDto, finalDiscountDaoList);
			}

			if (finalDiscountDaoList.isEmpty()) {
				if (throwError) {
					throw new ServiceException(ConfigConstants.NO_ACTIVE_DISCOUNTS_AVAILABLE,
							ConfigConstants.ERR_CONFIG_141);
				} else {
					return null;
				}
			}

		}
		return discountUtilService.createItemLevelDiscountResponse(finalDiscountDaoList, discountRequestDto,
				businessDate, validCummulativeDiscountWithExclude);
	}

	private void validateBestDealDiscount(List<DiscountDao> defaultDiscountList, String itemCode, String lotNumber,
			Date businessDate) {
		List<DiscountDao> invalidDiscounts = new ArrayList<>();
		if (!CollectionUtils.isEmpty(defaultDiscountList)) {
			for (DiscountDao discountDao : defaultDiscountList) {
				// validation for BestDeal Discount wrt lotAge and binAge from inventory
				validatingBestDealDiscounts(discountDao, itemCode, lotNumber, businessDate, invalidDiscounts);
			}

			if (!CollectionUtils.isEmpty(invalidDiscounts)) {
				defaultDiscountList.removeAll(invalidDiscounts);
			}
		}
	}

	private void validateRivaahGhsDiscount(List<DiscountDao> defaultDiscountList,
			DiscountItemLevelRequestDto discountRequestDto) {

		if (CollectionUtils.isEmpty(defaultDiscountList)) {
			return;
		}

		List<DiscountDao> invalidDiscounts = new ArrayList<>();

		for (DiscountDao discountDao : defaultDiscountList) {
			if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountDao.getDiscountType())) {
				checkRivaahGhsDiscounts(discountDao, discountRequestDto, invalidDiscounts);
			}
		}

		if (!CollectionUtils.isEmpty(invalidDiscounts)) {
			defaultDiscountList.removeAll(invalidDiscounts);
		}

	}

	private void checkRivaahGhsDiscounts(DiscountDao discountDao, DiscountItemLevelRequestDto discountRequestDto,
			List<DiscountDao> invalidDiscounts) {

		// if no RIVAAH details are present, then no need to consider such discount
		if (discountRequestDto.getRivaahGhsDetails() == null
				|| CollectionUtils.isEmpty(discountRequestDto.getRivaahGhsDetails().getRivaahGhs())) {
			invalidDiscounts.add(discountDao);
			return;
		}

		// if list size is greater than 2 then invalid request
		validateRivaahInputList(discountRequestDto.getRivaahGhsDetails());

		boolean isDiscountValid = false;
		// get product group mapping
		List<DiscountProductGroupMappingDto> discountProdGroupMappingList = discountProductMappingRepository
				.getProductTypeListForDiscountIdAndProductGroup(discountDao.getId(),
						discountRequestDto.getItemDetails().getProductGroupCode());
		String productGroupType = null;
		if (!CollectionUtil.isEmpty(discountProdGroupMappingList)) {
			productGroupType = discountProdGroupMappingList.get(0).getProductType();
		}

		Set<RivaahGhsDiscountDto> invalidRivaahGhsDetailsForItem = new HashSet<>();

		// loop and check if discount belongs to any scheme mapping
		for (RivaahGhsDiscountDto rivaahDetails : discountRequestDto.getRivaahGhsDetails().getRivaahGhs()) {

			// if product group is excluded then such RIVAAH GHS discount is not applicable
			// for the item
			// also, if rivaah GHS with MC/UCP discount which does not match with product
			// group type of the item should be considered invalid.

			if ((!CollectionUtil.isEmpty(rivaahDetails.getExcludeProductGroup()) && rivaahDetails
					.getExcludeProductGroup().contains(discountRequestDto.getItemDetails().getProductGroupCode()))
					|| !checkIfRivaahDetailIsValidForItem(productGroupType, rivaahDetails)) {
				invalidRivaahGhsDetailsForItem.add(rivaahDetails);
				continue;
			}

			List<String> schemeList = discountExcludeMappingRepository.getMappedSchemeCodes(discountDao.getId());
			// if scheme code is mapped, then discount is valid
			if (!CollectionUtil.isEmpty(schemeList) && schemeList.contains(rivaahDetails.getSchemeCode())) {
				isDiscountValid = true;
			}
		}

		if (!isDiscountValid) {
			invalidDiscounts.add(discountDao);
		}

		if (!CollectionUtil.isEmpty(invalidRivaahGhsDetailsForItem)) {
			discountRequestDto.getRivaahGhsDetails().getRivaahGhs().removeAll(invalidRivaahGhsDetailsForItem);
		}
	}

	private boolean checkIfRivaahDetailIsValidForItem(String productGroupType, RivaahGhsDiscountDto rivaahDetails) {
		return (MC.equals(productGroupType) && BooleanUtils.isTrue(rivaahDetails.getIsMcDiscountUsed()))
				|| (UCP.equals(productGroupType) && BooleanUtils.isTrue(rivaahDetails.getIsUcpdiscountUsed()));
	}

	private List<DiscountDao> validateEmployeeDiscount(Date businessDate,
			DiscountItemLevelRequestDto discountRequestDto) {

		if (discountRequestDto.getEmployeeDetails() != null) {

			String discountType = DiscountTypeEnum.EMPLOYEE_DISCOUNT.toString();
			List<DiscountDao> discounts = discountRepository.getDiscountsBasedOnDiscountTypeAndLocationCode(
					discountType, businessDate, CommonUtil.getLocationCode());
			List<DiscountDao> validDiscountList = new ArrayList<>();
			// validating coupons from QCGC
			discountRequestDto.getEmployeeDetails().getCouponDetails().forEach(couponDetails -> {
				GcResponseDto couponResponseDto = integrationServiceClient.getGiftCardBalanc(
						VendorCodeEnum.QC_GC.name(), couponDetails.getCouponCode(), null, false,
						GiftCardTypeEnum.EMPLOYEE_CODE);
				if ("0".equals(couponResponseDto.getResponseCode())) {
					discounts.forEach(discount -> {
						JsonData basicCriteriaJson = MapperUtil.getObjectMapperInstance().convertValue(
								MapperUtil.getJsonFromString(discount.getBasicCriteria()), JsonData.class);

						BaseBasicCriteriaDetails basicCriteriaDetails = MapperUtil
								.mapObjToClass(basicCriteriaJson.getData(), BaseBasicCriteriaDetails.class);

						if (basicCriteriaDetails.getStartingSerialNo() != null) {

							String[] values = basicCriteriaDetails.getStartingSerialNo().split(",");
							for (int i = 0; i < values.length; i++) {
								if (values[i].equals(couponDetails.getCouponCode().substring(0, values[i].length()))) {
									validDiscountList.add(discount);
									break;
								}
							}
						}
					});
				}
			});
			return getAdditionalDiscounts(null, validDiscountList, businessDate, discountRequestDto.getItemDetails());
		}
		return new ArrayList<>();
	}

	private List<DiscountDao> validateTataEmployeeDiscount(Date businessDate,
			DiscountItemLevelRequestDto discountRequestDto) {
		if (discountRequestDto.getTataEmployeeDetails() != null) {

			String discountType = DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.toString();
			List<DiscountDao> discounts = discountRepository.getDiscountsBasedOnDiscountTypeAndLocationCode(
					discountType, businessDate, CommonUtil.getLocationCode());

			return getAdditionalDiscounts(null, discounts, businessDate, discountRequestDto.getItemDetails());
		}
		return new ArrayList<>();
	}

	private List<DiscountDao> validateTsssDiscount(Date businessDate, DiscountItemLevelRequestDto discountRequestDto) {
		if (discountRequestDto.getTsssDetails() != null) {
			// validate coupon codes wrt location and offerstartdate n offerendDate with
			// status as open

			List<DiscountDao> validDiscountIds = validatingTssDiscountDetails(discountRequestDto.getTsssDetails());

			return getAdditionalDiscounts(null, validDiscountIds, businessDate, discountRequestDto.getItemDetails());

		}
		return new ArrayList<>();
	}

	private List<DiscountDao> validateEncircleDiscount(Date businessDate,
			DiscountItemLevelRequestDto discountRequestDto) {
		// if encircle discounts is present in Request
		if (discountRequestDto.getEncircleDiscount() != null) {
			return getAdditionalDiscounts(discountRequestDto.getEncircleDiscount().getDiscountType(), null,
					businessDate, discountRequestDto.getItemDetails());
		}
		return new ArrayList<>();
	}

	/**
	 * @param defaultDiscountList
	 * @param discountRequestDto
	 * @param finalDiscountDaoList
	 */
	private void getValidSlabDiscsounts(List<DiscountDao> defaultDiscountList,
			DiscountItemLevelRequestDto discountRequestDto, List<DiscountDao> finalDiscountDaoList,
			Map<String, CummulativeDiscountWithExcludeDto> validCummulativeDiscountWithExclude) {
		List<DiscountDao> slabDiscountDaoList = new ArrayList<>();
		Set<DiscountDao> validSlabDiscounts = new HashSet<>();
		List<String> slabDiscountIds = new ArrayList<>();
		getValidSlabDiscounts(defaultDiscountList, slabDiscountDaoList, slabDiscountIds);
		if (!slabDiscountDaoList.isEmpty()) {
			List<DiscountDetailsDao> discountDetailsDaos = discountDetailsRepository.getSlabDetails(slabDiscountIds);
			ItemLotStoneListDto lotItemStones = productService.getLotItemStonesWithDICheck(
					discountRequestDto.getItemDetails().getItemCode(),
					discountRequestDto.getItemDetails().getLotNumber(), true, false);
			if (!discountDetailsDaos.isEmpty()) {
				Map<String, List<DiscountDetailsDao>> discountIdAndItsSlabs = getDiscountAndItsSlabMap(
						discountDetailsDaos, null);
				for (DiscountDao discount : slabDiscountDaoList) {
					if (discountIdAndItsSlabs.containsKey(discount.getId())) {
						Map<String, BigDecimal> cummulativeSumDetails = getCummulativeSlabWeightOrValueOfAllItems(
								discountRequestDto, discount, discountIdAndItsSlabs.get(discount.getId()).stream()
										.collect(Collectors.toList()).get(0).getIsSingle());

						for (DiscountDetailsDao details : discountIdAndItsSlabs.get(discount.getId())) {
							if (checkSlab(discount, details, validSlabDiscounts, discountRequestDto, lotItemStones,
									cummulativeSumDetails, validCummulativeDiscountWithExclude)) {
								break;
							}
						}
					}
				}
			}
		}
		finalizeDefaultDiscounts(defaultDiscountList, validSlabDiscounts, finalDiscountDaoList, slabDiscountDaoList);
	}

	private Map<String, List<DiscountDetailsDao>> getDiscountAndItsSlabMap(List<DiscountDetailsDao> discountDetailsDaos,
			Boolean ignoreCaratBasedSlab) {
		Map<String, List<DiscountDetailsDao>> discountIdAndItsSlabs = new HashMap<>();
		discountDetailsDaos.forEach(discountDetail -> {
			List<DiscountDetailsDao> slabs;
			if (discountIdAndItsSlabs.containsKey(discountDetail.getDiscount().getId())) {
				slabs = discountIdAndItsSlabs.get(discountDetail.getDiscount().getId());
			} else {
				slabs = new ArrayList<>();
			}

			if (BooleanUtils.isNotTrue(ignoreCaratBasedSlab) || (BooleanUtils.isTrue(ignoreCaratBasedSlab)
					&& !CARAT_BASED.equalsIgnoreCase(discountDetail.getDiscountCategory()))) {
				slabs.add(discountDetail);
				discountIdAndItsSlabs.put(discountDetail.getDiscount().getId(), slabs);
			}
		});
		return discountIdAndItsSlabs;
	}

	private void getValidSlabDiscounts(List<DiscountDao> defaultDiscountList, List<DiscountDao> slabDiscountDaoList,
			List<String> slabDiscountIds) {
		defaultDiscountList.forEach(discount -> {
			if (discount.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())
					|| discount.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())) {
				slabDiscountDaoList.add(discount);
				slabDiscountIds.add(discount.getId());
			}
		});
	}

	private void finalizeDefaultDiscounts(List<DiscountDao> defaultDiscountList, Set<DiscountDao> validSlabDiscounts,
			List<DiscountDao> finalDiscountDaoList, List<DiscountDao> slabDiscountDaoList) {
		if (!validSlabDiscounts.isEmpty()) {
			log.info("Valid Slab Disounts : " + validSlabDiscounts);
			finalDiscountDaoList.addAll(validSlabDiscounts);
			defaultDiscountList.removeAll(slabDiscountDaoList);
		} else {
			defaultDiscountList.removeAll(slabDiscountDaoList);
		}
	}

	private boolean checkSlab(DiscountDao discount, DiscountDetailsDao details, Set<DiscountDao> validSlabDiscounts,
			DiscountItemLevelRequestDto discountRequestDto, ItemLotStoneListDto lotItemStones,
			Map<String, BigDecimal> cummulativeSumDetails,
			Map<String, CummulativeDiscountWithExcludeDto> validCummulativeDiscountWithExclude) {
		return discount.getId().equals(details.getDiscount().getId())
				&& (details.getDiscountCategory().equals(DiscountCategoryEnum.WEIGHT_BASED.name())
						&& checkWeightBasedSlab(discount, details, validSlabDiscounts, discountRequestDto,
								cummulativeSumDetails, validCummulativeDiscountWithExclude))
				|| (details.getDiscountCategory().equals(DiscountCategoryEnum.VALUE_BASED.name())
						&& checkValueBasedSlab(discount, details, validSlabDiscounts, discountRequestDto,
								cummulativeSumDetails, validCummulativeDiscountWithExclude))
				|| (details.getDiscountCategory().equals(DiscountCategoryEnum.CARAT_BASED.name())
						&& checkCaratBasedSlab(discount, details, validSlabDiscounts, discountRequestDto,
								lotItemStones));
	}

	private boolean checkWeightBasedSlab(DiscountDao discount, DiscountDetailsDao details,
			Set<DiscountDao> validSlabDiscounts, DiscountItemLevelRequestDto discountRequestDto,
			Map<String, BigDecimal> cummulativeDetails,
			Map<String, CummulativeDiscountWithExcludeDto> validCummulativeDiscountWithExclude) {

		if (details.getEligibility().equals(DiscountEligibilityEnum.GROSS_WEIGHT.name())) {
			BigDecimal totalWeight = discountRequestDto.getItemDetails().getTotalWeight();
			totalWeight = getNecessaryCummulativeValue(cummulativeDetails, totalWeight,
					DiscountEligibilityEnum.GROSS_WEIGHT.name());
			if (totalWeight != null && details.getMinValue() != null && details.getMaxValue() != null
					&& totalWeight.compareTo(details.getMinValue()) >= 0
					&& totalWeight.compareTo(details.getMaxValue()) <= 0) {
				validSlabDiscounts.add(discount);
				validCummulativeDiscountWithExclude.put(discount.getId(), new CummulativeDiscountWithExcludeDto(
						discount.getId(), details.getId(), null, discount.getDiscountType()));
				return true;
			}
		} else if (details.getEligibility().equals(DiscountEligibilityEnum.NET_WEIGHT.name())) {
			BigDecimal netWeight = discountRequestDto.getItemDetails().getNetWeight();
			netWeight = getNecessaryCummulativeValue(cummulativeDetails, netWeight,
					DiscountEligibilityEnum.NET_WEIGHT.name());
			if (netWeight != null && details.getMinValue() != null && details.getMaxValue() != null
					&& netWeight.compareTo(details.getMinValue()) >= 0
					&& netWeight.compareTo(details.getMaxValue()) <= 0) {
				validSlabDiscounts.add(discount);
				validCummulativeDiscountWithExclude.put(discount.getId(), new CummulativeDiscountWithExcludeDto(
						discount.getId(), details.getId(), null, discount.getDiscountType()));
				return true;
			}
		}
		return false;
	}

	private Map<String, BigDecimal> getCummulativeSlabWeightOrValueOfAllItems(
			DiscountItemLevelRequestDto discountRequestDto, DiscountDao discount, Boolean isSingle) {

		Map<String, BigDecimal> cummulativeDetails = new HashMap<>();
		cummulativeDetails.put(DiscountEligibilityEnum.GROSS_WEIGHT.name(), BigDecimal.ZERO);
		cummulativeDetails.put(DiscountEligibilityEnum.NET_WEIGHT.name(), BigDecimal.ZERO);
		cummulativeDetails.put(DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.name(), BigDecimal.ZERO);
		cummulativeDetails.put(DiscountEligibilityEnum.PRE_DISCOUNT_TAX.name(), BigDecimal.ZERO);

		if (CollectionUtil.isEmpty(discountRequestDto.getItemDetailsForCummulativeCal())) {
			return cummulativeDetails;
		}

		List<String> discountLinkIds = linkingDiscountsRepositoryExt.findAllBySrcDiscountId(discount.getId());

		for (DiscountItemDetailsDto item : discountRequestDto.getItemDetailsForCummulativeCal()) {
			// is single means only items of same PGC should be considered. Else skip the
			// item
			if (BooleanUtils.isTrue(isSingle)
					&& !discountRequestDto.getItemDetails().getProductGroupCode().equals(item.getProductGroupCode())) {
				continue;
			}
			// if an item already has cumulative discount applied, then consider
			// it.(NAP-10670 && NAP-10779)
			if (item.getDiscountTypeAndIdAppliedOnItem() != null && !item.getDiscountTypeAndIdAppliedOnItem().isEmpty()
					&& discount.getId()
							.equals(item.getDiscountTypeAndIdAppliedOnItem().get(discount.getDiscountType()))) {
				sumUpCummulativeDetails(cummulativeDetails, item);
			}
			// if an item is excluded or valid(NAP-10670,NAP-10779,NAP-10842) or has best
			// deal discount which is linked to the valid discount, then consider it.
			else if (item.getTotalDiscount() == null || BigDecimal.ZERO.compareTo(item.getTotalDiscount()) == 0
					|| checkToRemoveItemWithoutBestDealForCummulativeCal(item)) {

				DiscountDao validDiscountObject = discountRepository.validateItemRequestDetailsForDiscount(
						discount.getId(), discountRequestDto.getBusinessDate(), CommonUtil.getLocationCode(),
						item.getProductGroupCode(), item.getProductCategoryCode());

				if (validDiscountObject != null && checkItemForValidOrBestDeal(discountLinkIds, item)) {
					sumUpCummulativeDetails(cummulativeDetails, item);
				}

			}
		}

		log.info("cumulative item details sum details: " + cummulativeDetails);

		return cummulativeDetails;

	}

	private void sumUpCummulativeDetails(Map<String, BigDecimal> cummulativeDetails, DiscountItemDetailsDto item) {
		if (item.getTotalWeight() != null) {
			cummulativeDetails.put(DiscountEligibilityEnum.GROSS_WEIGHT.name(),
					cummulativeDetails.get(DiscountEligibilityEnum.GROSS_WEIGHT.name()).add(item.getTotalWeight()));
		}
		if (item.getNetWeight() != null) {
			cummulativeDetails.put(DiscountEligibilityEnum.NET_WEIGHT.name(),
					cummulativeDetails.get(DiscountEligibilityEnum.NET_WEIGHT.name()).add(item.getNetWeight()));
		}
		cummulativeDetails.put(DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.name(), cummulativeDetails
				.get(DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.name()).add(item.getTotalValue()));
		cummulativeDetails.put(DiscountEligibilityEnum.PRE_DISCOUNT_TAX.name(),
				cummulativeDetails.get(DiscountEligibilityEnum.PRE_DISCOUNT_TAX.name())
						.add(item.getTotalValue().add(item.getTotalTax())));
	}

	private boolean checkItemForValidOrBestDeal(List<String> discountLinkIds, DiscountItemDetailsDto item) {
		return (item.getDiscountTypeAndIdAppliedOnItem() == null || item.getDiscountTypeAndIdAppliedOnItem().isEmpty()
				|| (!CollectionUtil.isEmpty(discountLinkIds) && checkToRemoveItemWithoutBestDealForCummulativeCal(item)
						&& discountLinkIds.contains(item.getDiscountTypeAndIdAppliedOnItem()
								.get(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name()))));
	}

	private boolean checkToRemoveItemWithoutBestDealForCummulativeCal(DiscountItemDetailsDto item) {

		return (item.getDiscountTypeAndIdAppliedOnItem() != null && !item.getDiscountTypeAndIdAppliedOnItem().isEmpty()
				&& item.getDiscountTypeAndIdAppliedOnItem().containsKey(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name()));
	}

	private boolean checkValueBasedSlab(DiscountDao discount, DiscountDetailsDao details,
			Set<DiscountDao> validSlabDiscounts, DiscountItemLevelRequestDto discountRequestDto,
			Map<String, BigDecimal> cummulativeDetails,
			Map<String, CummulativeDiscountWithExcludeDto> validCummulativeDiscountWithExclude) {
		if (details.getEligibility().equals(DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.name())) {
			BigDecimal totalValue = discountRequestDto.getItemDetails().getTotalValue();
			totalValue = getNecessaryCummulativeValue(cummulativeDetails, totalValue,
					DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.name());
			if (totalValue != null && details.getMinValue() != null && details.getMaxValue() != null
					&& totalValue.compareTo(details.getMinValue()) >= 0
					&& totalValue.compareTo(details.getMaxValue()) <= 0) {
				validSlabDiscounts.add(discount);
				validCummulativeDiscountWithExclude.put(discount.getId(), new CummulativeDiscountWithExcludeDto(
						discount.getId(), details.getId(), null, discount.getDiscountType()));
				return true;
			}
		} else if (details.getEligibility().equals(DiscountEligibilityEnum.PRE_DISCOUNT_TAX.name())) {
			BigDecimal total = discountRequestDto.getItemDetails().getTotalTax()
					.add(discountRequestDto.getItemDetails().getTotalValue());
			total = getNecessaryCummulativeValue(cummulativeDetails, total,
					DiscountEligibilityEnum.PRE_DISCOUNT_TAX.name());
			if (total != null && details.getMinValue() != null && details.getMaxValue() != null
					&& total.compareTo(details.getMinValue()) >= 0 && total.compareTo(details.getMaxValue()) <= 0) {
				validSlabDiscounts.add(discount);
				validCummulativeDiscountWithExclude.put(discount.getId(), new CummulativeDiscountWithExcludeDto(
						discount.getId(), details.getId(), null, discount.getDiscountType()));
				return true;
			}
		}
		return false;
	}

	private BigDecimal getNecessaryCummulativeValue(Map<String, BigDecimal> cummulativeDetails, BigDecimal totalValue,
			String discountEligibilityType) {
		if (!cummulativeDetails.isEmpty()) {
			totalValue = totalValue != null ? totalValue.add(cummulativeDetails.get(discountEligibilityType)) : null;
		}
		return totalValue;
	}

	private boolean checkCaratBasedSlab(DiscountDao discount, DiscountDetailsDao details,
			Set<DiscountDao> validSlabDiscounts, DiscountItemLevelRequestDto discountRequestDto,
			ItemLotStoneListDto lotItemStones) {

		if (!CollectionUtils.isEmpty(lotItemStones.getLotStoneDetails())) {
			if (details.getEligibility().equals(DiscountEligibilityEnum.SINGLE_STONE.name())) {
				BigDecimal maxWeightForSingleCaratSlab = getMaxWeightForSingleCaratSlab(
						lotItemStones.getLotStoneDetails());
				if (checkIfItBelongsToSlab(details.getMinValue(), details.getMaxValue(), maxWeightForSingleCaratSlab)) {
					validSlabDiscounts.add(discount);
					return true;
				}
			} else if (details.getEligibility().equals(DiscountEligibilityEnum.CUMULATIVE_STONE.name())) {
				BigDecimal cumulativeStoneWeight = getCumaltiveWeightForCaratSlab(lotItemStones.getLotStoneDetails(),
						discount.getId());
				if (checkIfItBelongsToSlab(details.getMinValue(), details.getMaxValue(), cumulativeStoneWeight)) {
					validSlabDiscounts.add(discount);
					return true;
				}
			}
		}
		return false;
	}

	private void validatingBestDealDiscounts(DiscountDao discountDao, String itemCode, String lotNumber,
			Date businessDate, List<DiscountDao> invalidDiscounts) {
		if (DiscountTypeEnum.BEST_DEAL_DISCOUNT.toString().equalsIgnoreCase(discountDao.getDiscountType())) {

			// TODO: validate directly from request. no need to query inventory
			InventoryDetailsDao inventoryDetailsDao = discountUtilService.validateBestDealDiscountType(discountDao,
					itemCode, lotNumber, businessDate);

			if (inventoryDetailsDao == null) {
				invalidDiscounts.add(discountDao);
			}
		}
	}

	private List<DiscountDao> getAdditionalDiscounts(String discountType, List<DiscountDao> validDiscountIds,
			Date businessDate, DiscountItemDetailsDto itemDetails) {

		if (discountType != null && CollectionUtils.isEmpty(validDiscountIds)) {
			validDiscountIds = discountRepository.getDiscountDetails(discountType);
		}

		List<DiscountDao> validDiscountList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(validDiscountIds)) {
			// validating item details wrt discountIds
			boolean empowermentDiscount = false;
			if (!StringUtils.isEmpty(discountType)
					&& discountType.equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())) {
				empowermentDiscount = true;
			}
			validDiscountList = discountUtilService.validateItemDetailsFromRequest(validDiscountIds, itemDetails,
					businessDate, CommonUtil.getLocationCode(), empowermentDiscount);
		}
		return validDiscountList;

	}

	private List<DiscountDao> createItemLevelQuery(List<String> discountTypeList, DiscountItemDetailsDto itemDetails,
			Date businessDate, String itemCode, String lotNumber, String productGroupCode, String productCategoryCode,
			Boolean isIgnoreExcludeCheck) {

		Map<String, String> queryMap;// key is variable name and value is query to be appended.
		StringBuilder unionQuery = null;
		StringBuilder innerQuery;

		for (String discountType : discountTypeList) {
			queryMap = createQueryBasedOnMetadata(discountType, itemDetails,
					CalendarUtils.formatDateToSql(businessDate), itemCode, lotNumber, productGroupCode,
					productCategoryCode, isIgnoreExcludeCheck);
			innerQuery = createInnerQuery(discountType, queryMap);

			// Attaching union to inner query
			if (unionQuery == null) {
				unionQuery = new StringBuilder(" ( ");
			} else {
				unionQuery.append(" UNION (");
			}
			unionQuery.append(innerQuery);
		}

		// creating final query after coming out of for loop
		String finalQuery = " SELECT * FROM discount_master dm WHERE dm.id IN (" + unionQuery + ")";
		log.info(finalQuery);

		return discountRepository.getDiscountCodes(finalQuery);
	}

	private void createDiscountListWrtTransactionType(DiscountItemLevelRequestDto discountRequestDto,
			List<DiscountDao> discountDaoList) {
		Iterator<DiscountDao> itr = discountDaoList.iterator();
		while (itr.hasNext()) {

			DiscountDao discountDao = itr.next();
			if ((!discountDao.getDiscountType().equals(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()))
					&& (checkFrozenRateForAbCo(discountDao, discountRequestDto.getTransactionDetails()))) {
				itr.remove();
			}
		}
	}

	private boolean checkFrozenRateForAbCo(DiscountDao discount, TransactionDetailsDto transactionDetails) {
		JsonData orderDetailJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discount.getOrderDetails()), JsonData.class);
		DiscountOrderConfigDetails orderDetail = MapperUtil.mapObjToClass(orderDetailJson.getData(),
				DiscountOrderConfigDetails.class);
		Boolean displayOnAb = orderDetail == null ? null : orderDetail.getIsDisplayOnAB();
		Boolean displayOnCo = orderDetail == null ? null : orderDetail.getIsDisplayOnCO();
		Boolean frozenRateForAb = orderDetail == null ? null : orderDetail.getIsGoldRateFrozenForAB();
		Boolean frozenRateForCo = orderDetail == null ? null : orderDetail.getIsGoldRateFrozenForCO();
		return (transactionDetails.getTransactionType().equalsIgnoreCase("AB")
				&& (BooleanUtils.isNotTrue(displayOnAb) || (BooleanUtils.isTrue(frozenRateForAb)
						&& BooleanUtils.isNotTrue(transactionDetails.getIsFrozenRate()))))
				|| (transactionDetails.getTransactionType().equalsIgnoreCase("CO")
						&& (BooleanUtils.isNotTrue(displayOnCo) || (BooleanUtils.isTrue(frozenRateForCo)
								&& BooleanUtils.isNotTrue(transactionDetails.getIsFrozenRate()))));
	}

	/**
	 * This method will create innerQuery.
	 * 
	 * @param discountType
	 * @param queryMap
	 * @return StringBuilder.
	 */
	private StringBuilder createInnerQuery(String discountType, Map<String, String> queryMap) {
		String discountTypeFilterQuery = " SELECT d.id FROM discount_master d " + " WHERE d.discount_type = '"
				+ discountType + "' AND d.is_active = 1 ";

		StringBuilder innerQuery = new StringBuilder();
		int inCount = 0;
		String discountItemMappingQuery = queryMap.get("discountItemMappingQuery");
		String discountProductGroupMappingQuery = queryMap.get("discountProductGroupMappingQuery");
		String discountProductCategoryMappingQuery = queryMap.get("discountProductCategoryMappingQuery");
		String discountLocationMappingQuery = queryMap.get("discountLocationMappingQuery");
		String discountExcludeMappingQuery = queryMap.get("discountExcludeMappingQuery");
		if (discountItemMappingQuery != null) {
			innerQuery.append(discountItemMappingQuery);
			inCount++;
		}

		if (discountProductCategoryMappingQuery != null) {
			innerQuery.append(discountProductCategoryMappingQuery);
			inCount++;
		}

		if (discountProductGroupMappingQuery != null) {
			innerQuery.append(discountProductGroupMappingQuery);
			inCount++;
		}

		if (discountLocationMappingQuery != null) {
			innerQuery.append(discountLocationMappingQuery);
			inCount++;
		}

		innerQuery.append(discountTypeFilterQuery);

		if (innerQuery.length() > 0) {
			for (int i = 0; i < inCount; i++) {
				innerQuery.append(" ) ");
			}
		}

		if (discountExcludeMappingQuery != null) {
			innerQuery.append(discountExcludeMappingQuery).append(" ) ");
		} else {
			innerQuery.append(" ) ");
		}

		return innerQuery;
	}

	private Map<String, String> createQueryBasedOnMetadata(String discountType, DiscountItemDetailsDto itemDetails,
			String businessDate, String itemCode, String lotNumber, String productGroupCode, String productCategoryCode,
			Boolean isIgnoreExcludeCheck) {

		String themeCode = itemCode.substring(2, 6);
		BigDecimal complexityPercent = itemDetails.getComplexityPercent();
		BigDecimal makingChargePerGram = itemDetails.getMakingChargePerGram();
		String locationCode = CommonUtil.getLocationCode();

		Map<String, String> queryMap = new HashMap<>();
		Optional<DiscountTypeMetaDataDao> discountTypeMetaDataOptional = discountTypeMetaDataRepository
				.findById(discountType);
		if (lotNumber != null && lotNumber.substring(lotNumber.length() - 2, lotNumber.length()).equals("CP")) {
			lotNumber = lotNumber.substring(0, lotNumber.length() - 2);
		}
		if (discountTypeMetaDataOptional.isPresent()) {

			if (discountTypeMetaDataOptional.get().getItemMapping()
					&& discountType.equalsIgnoreCase("BEST_DEAL_DISCOUNT")) {
				String discountItemMappingQuery = " SELECT dim.discount_id FROM discount_Item_Mapping dim "
						+ " WHERE dim.item_Code = '" + itemCode + "'" + " AND dim.lot_Number LIKE '%" + lotNumber
						+ "%' " + " AND dim.location_Code = '" + locationCode + "' AND '" + businessDate
						+ "' between dim.start_date AND dim.end_date AND dim.is_active = 1 AND dim.discount_id IN ( ";
				queryMap.put("discountItemMappingQuery", discountItemMappingQuery);
			} else if (discountTypeMetaDataOptional.get().getItemMapping()) {
				String discountItemMappingQuery = " SELECT dim.discount_id FROM discount_Item_Mapping dim "
						+ " WHERE dim.item_Code = '" + itemCode + "'" + " AND dim.lot_Number = '" + lotNumber + "' "
						+ " AND dim.location_Code = '" + locationCode + "' AND '" + businessDate
						+ "' between dim.start_date AND dim.end_date AND dim.is_active = 1 AND dim.discount_id IN ( ";
				queryMap.put("discountItemMappingQuery", discountItemMappingQuery);
			}

			if (discountTypeMetaDataOptional.get().getProductGroupMapping()) {
				String productGroupWithProductTypeCheck;
				// if item is UCP, the product group also should be mapped to UCP
				if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountType)
						&& BooleanUtils.isTrue(itemDetails.getIsUcp())) {
					productGroupWithProductTypeCheck = productGroupCode + "' AND dpgm.product_type = 'UCP";
				} else {
					productGroupWithProductTypeCheck = productGroupCode;
				}

				String discountProductGroupMappingQuery = " SELECT dpgm.discount_id FROM discount_details dd, discount_product_group_mapping dpgm "
						+ " WHERE dpgm.product_group_code = '" + productGroupWithProductTypeCheck + "' "
						+ " AND dpgm.is_active = 1 AND (dpgm.discount_detail_id IS NULL OR (dpgm.discount_detail_id = dd.id AND dd.is_active = 1 AND dpgm.is_active = 1 AND dpgm.discount_id =dd.discount_id)) AND  dpgm.discount_id IN ( ";
				queryMap.put("discountProductGroupMappingQuery", discountProductGroupMappingQuery);
			}

			if (discountTypeMetaDataOptional.get().getProductCategoryMapping()) {
				String discountProductCategoryMappingQuery = " SELECT dpcm.discount_id FROM discount_product_category_mapping dpcm "
						+ " WHERE dpcm.product_category_code = '" + productCategoryCode + "' "
						+ " AND dpcm.is_active = 1 AND dpcm.discount_id IN ( ";
				queryMap.put("discountProductCategoryMappingQuery", discountProductCategoryMappingQuery);
			}

			if (discountTypeMetaDataOptional.get().getLocationMapping()) {
				String discountLocationMappingQuery;
				if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountType)) {
					// for RIVAAH GHS no start date or end date is present
					discountLocationMappingQuery = " SELECT dlm.discount_id FROM discount_location_mapping dlm "
							+ " WHERE dlm.location_code = '" + locationCode
							+ "' AND dlm.is_active = 1 AND dlm.discount_id IN ( ";
				} else {
					discountLocationMappingQuery = " SELECT dlm.discount_id FROM discount_location_mapping dlm "
							+ " WHERE dlm.location_code = '" + locationCode + "' AND " + " '" + businessDate
							+ "' between dlm.offer_start_date AND dlm.offer_end_date AND dlm.is_active = 1 AND dlm.discount_id IN ( ";

				}
				queryMap.put("discountLocationMappingQuery", discountLocationMappingQuery);
			}

			if (discountTypeMetaDataOptional.get().getExcludeMapping()
					&& BooleanUtils.isNotTrue(isIgnoreExcludeCheck)) {
				String discountExcludeMappingQuery = " EXCEPT (SELECT dem.discount_id FROM discount_exclude_mapping dem "
						+ " WHERE dem.is_active = 1 AND ((dem.item_Code = '" + itemCode
						+ "' AND dem.is_excluded = 1) OR (dem.theme_code  = '" + themeCode + "') OR ("
						+ complexityPercent + " is not NULL AND dem.exclude_type = '"
						+ ExcludeTypeEnum.COMPLEXITY_PERCENT.name() + "' AND (" + complexityPercent
						+ ">= dem.from_value " + "and " + complexityPercent + "<= dem.to_value)) OR ("
						+ makingChargePerGram + " is not NULL AND dem.exclude_type = '"
						+ ExcludeTypeEnum.MC_PER_GRAM.name() + "'  and (" + makingChargePerGram + " >= dem.from_value "
						+ "and " + makingChargePerGram + "<= dem.to_value)))) ";
				queryMap.put("discountExcludeMappingQuery", discountExcludeMappingQuery);
			}
		}

		return queryMap;
	}

	@Override
	public DiscountBillLevelResponseDto getDiscountsAtTransactionLevel(
			DiscountBillLevelRequestDto discountBillLevelRequest) {

		List<DiscountBillLevelItemDetailsDto> responseDtoList = new ArrayList<>();

		DiscountTypeMetaDataDao discountMetadata = discountTypeMetaDataRepository
				.findByDiscountType(discountBillLevelRequest.getDiscountType());
		if(discountBillLevelRequest.getBusinessDate() != null)
		{
		discountBillLevelRequest
				.setBusinessDate(CalendarUtils.getStartOfDay(discountBillLevelRequest.getBusinessDate()));
		}
		Date businessDate = discountBillLevelRequest.getBusinessDate();
		if (discountMetadata != null) {
			if (discountMetadata.getApplicableLevel().equalsIgnoreCase(DiscountApplicableLevelEnum.BILL_LEVEL.name())) {
				// getting discounts where applicable type is BILL LEVEL
				getDiscountsForBillLevel(discountBillLevelRequest, discountMetadata, businessDate, responseDtoList);
			} else {

				if (discountBillLevelRequest.getItemDetails() == null) {
					discountBillLevelRequest.setItemDetails(new ArrayList<>());
				}

				List<DiscountDao> validDiscountList = new ArrayList<>();
				// when employee/Tsss/tataEmployee/empowerment/rivaahGHS Information is given in
				// request
				getDiscountsForItemLevel(discountBillLevelRequest, businessDate, validDiscountList);
				validateDiscountList(validDiscountList, discountBillLevelRequest.getDiscountType());

				// validating itemRequest details against validiscount ids
				Map<DiscountDao, List<DiscountItemsDto>> responseMap = discountUtilService
						.validateDiscountIdWithRequest(validDiscountList, discountBillLevelRequest.getItemDetails(),
								businessDate, null);

				if (CollectionUtils.isEmpty(responseMap) && !DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()
						.equals(discountBillLevelRequest.getDiscountType())) {
					throw new ServiceException(ConfigConstants.DISCOUNTS_NOT_AVAILABLE_ON_ITEMS,
							ConfigConstants.ERR_CONFIG_140);
				} else {
					for (Map.Entry<DiscountDao, List<DiscountItemsDto>> entry : responseMap.entrySet()) {
						DiscountDao discountObject = entry.getKey();
						List<DiscountItemsDto> itemDetailList = entry.getValue();
						responseDtoList
								.add(discountUtilService.createBillLevelResponse(discountObject, itemDetailList));
					}
				}
			}
		} else {
			throw new ServiceException(ConfigConstants.DISCOUNT_TYPE_NOT_FOUND_IN_METADATA,
					ConfigConstants.ERR_CONFIG_137);
		}

		DiscountBillLevelResponseDto responseDto = new DiscountBillLevelResponseDto();
		responseDto.setDiscountDetails(responseDtoList);
		responseDto.setClubDiscountDetails(checkBillLevelClubbingDiscount(responseDtoList, businessDate,
				discountBillLevelRequest.getDiscountType()));
		return responseDto;
	}

	private List<DiscountBillLevelClubDetailsDto> checkBillLevelClubbingDiscount(
			List<DiscountBillLevelItemDetailsDto> responseDtoList, Date businessDate, String discountType) {
		List<DiscountBillLevelClubDetailsDto> responseClubDtoList = new ArrayList<>();
		Set<String> discountIds = responseDtoList.stream().map(DiscountBillLevelItemDetailsDto::getDiscountId)
				.collect(Collectors.toSet());
		// getting all the club discounts
		if (!CollectionUtil.isEmpty(discountIds)) {
			Set<ClubbingDiscountsDao> clubDiscounts = clubbingRepository.getClubDiscounts(discountIds);
			Set<DiscountItemsDto> itemDetails = getItemDetails(responseDtoList);
			for (ClubbingDiscountsDao clubDiscount : clubDiscounts) {
				List<DiscountDao> discountList = new ArrayList<>();
				DiscountDao discount1 = clubDiscount.getDiscount1();
				if (discount1 != null) {
					discountList.add(discount1);
				}
				DiscountDao discount2 = clubDiscount.getDiscount2();
				if (discount2 != null) {
					discountList.add(discount2);
				}
				DiscountDao discount3 = clubDiscount.getDiscount3();
				if (discount3 != null) {
					discountList.add(discount3);
				}
				List<DiscountItemsDto> itemDetailsList = new ArrayList<>();
				itemDetailsList.addAll(itemDetails);
				Map<DiscountDao, List<DiscountItemsDto>> discountItemDetailsMap = discountUtilService
						.validateDiscountIdWithRequest(discountList, itemDetailsList, businessDate, discountType);
				if (checkIfAllClubDiscountIsPresent(discountList, discountItemDetailsMap)) {
					List<DiscountItemsDto> commonItemsForClubDiscount = getCommonItemsForClubDiscount(
							discountItemDetailsMap);
					if (!CollectionUtil.isEmpty(commonItemsForClubDiscount)) {
						DiscountBillLevelClubDetailsDto discountClubLevel = new DiscountBillLevelClubDetailsDto();
						discountClubLevel.setClubbingId(clubDiscount.getId());
						discountClubLevel
								.setDiscountDetails(getDiscountResponseList(discountList, commonItemsForClubDiscount));
						discountClubLevel.setItemDetails(commonItemsForClubDiscount);
						responseClubDtoList.add(discountClubLevel);
					}
				}
			}
		}
		return responseClubDtoList;
	}

	private boolean checkIfAllClubDiscountIsPresent(List<DiscountDao> discountList,
			Map<DiscountDao, List<DiscountItemsDto>> discountItemDetailsMap) {

		// checking if all the discounts in the club discount is eligible for that item
		for (DiscountDao discount : discountList) {
			List<DiscountItemsDto> itemList = discountItemDetailsMap.get(discount);
			if (CollectionUtil.isEmpty(itemList)) {
				return false;
			}
		}
		return true;
	}

	private List<DiscountItemsDto> getCommonItemsForClubDiscount(
			Map<DiscountDao, List<DiscountItemsDto>> discountItemDetailsMap) {
		List<List<DiscountItemsDto>> itemDetailsList = new ArrayList<>();
		List<DiscountItemsDto> itemList = new ArrayList<>();
		for (Map.Entry<DiscountDao, List<DiscountItemsDto>> entry : discountItemDetailsMap.entrySet()) {
			itemDetailsList.add(entry.getValue());
		}
		Set<DiscountItemsDto> commonItems = Sets.newHashSet(itemDetailsList.get(0));
		for (List<DiscountItemsDto> itemDetail : itemDetailsList) {
			commonItems = Sets.intersection(commonItems, Sets.newHashSet(itemDetail));
		}
		itemList.addAll(commonItems);
		return itemList;
	}

	private Set<DiscountItemsDto> getItemDetails(List<DiscountBillLevelItemDetailsDto> responseDtoList) {
		Set<DiscountItemsDto> itemDetails = new HashSet<>();
		for (DiscountBillLevelItemDetailsDto itemDetailsDto : responseDtoList) {
			if (itemDetailsDto.getItemDetails() != null) {
				for (DiscountItemsDto itemDetail : itemDetailsDto.getItemDetails()) {
					itemDetails.add(itemDetail);
				}
			}
		}
		return itemDetails;
	}

	private List<DiscountBillLevelItemDetailsDto> getDiscountResponseList(List<DiscountDao> discountList,
			List<DiscountItemsDto> itemList) {
		List<DiscountBillLevelItemDetailsDto> discountResponseList = new ArrayList<>();
		for (DiscountDao discount : discountList) {
			discountResponseList.add(discountUtilService.createBillLevelResponse(discount, itemList));
		}
		return discountResponseList;
	}

	private void validateDiscountList(List<DiscountDao> validDiscountList, String discountType) {
		// ignore check for Rivaah GHS
		if (validDiscountList.isEmpty() && !DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountType))
			throw new ServiceException(ConfigConstants.INVALID_COUPON_CODE, ConfigConstants.ERR_CONFIG_146);
	}

	private void getDiscountsForItemLevel(DiscountBillLevelRequestDto discountBillLevelRequest, Date businessDate,
			List<DiscountDao> validDiscountList) {

		String locationCode = CommonUtil.getStoreCode();
		List<DiscountDao> discountListDao = new ArrayList<>();
		if (discountBillLevelRequest.getEmployeeDetails() != null
				|| discountBillLevelRequest.getTataEmployeeDetails() != null) {

			// get all the active discounts for a given location and businessDate
			discountListDao = discountRepository.getDiscountsBasedOnDiscountTypeAndLocationCode(
					discountBillLevelRequest.getDiscountType(), businessDate, locationCode);
		}
		if (discountBillLevelRequest.getEmpowermentDetails() != null && BooleanUtils
				.isTrue(discountBillLevelRequest.getEmpowermentDetails().getApplyEmpowermentDiscount())) {
			discountListDao = discountRepository.getEmpowermentDiscounts(discountBillLevelRequest.getDiscountType(),
					locationCode);
		}
		if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountBillLevelRequest.getDiscountType())) {
			List<String> schemeCodes = null;
			if (discountBillLevelRequest.getRivaahGhsDetails() != null
					&& !CollectionUtil.isEmpty(discountBillLevelRequest.getRivaahGhsDetails().getRivaahGhs())) {
				schemeCodes = discountBillLevelRequest.getRivaahGhsDetails().getRivaahGhs().stream()
						.map(RivaahGhsDiscountDto::getSchemeCode).collect(Collectors.toList());
			}
			discountListDao = discountRepository.getRivaahGhsDiscounts(discountBillLevelRequest.getDiscountType(),
					locationCode, schemeCodes);
		}

		if (!CollectionUtils.isEmpty(discountListDao)) {
			if (discountBillLevelRequest.getEmployeeDetails() != null) {
				// validating coupons from QCGC
				validateEmployeeCouponCode(discountListDao, validDiscountList,
						discountBillLevelRequest.getEmployeeDetails().getCouponDetails());
			}
			// validating TataEmployee Discounts Configs
			if (discountBillLevelRequest.getTataEmployeeDetails() != null) {
				validateTataEmployeeDetailsAgainstDiscountIds(discountListDao, validDiscountList,
						discountBillLevelRequest.getTataEmployeeDetails());
			}
			// validating empowerment discount
			if (discountBillLevelRequest.getEmpowermentDetails() != null
					&& discountBillLevelRequest.getEmpowermentDetails().getApplyEmpowermentDiscount()) {
				validateEmpowermentDetailsAgainstDiscountIds(discountListDao, validDiscountList, businessDate);
			}
			if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountBillLevelRequest.getDiscountType())) {
				Set<String> rivaahDiscountIdSet = discountListDao.stream().map(DiscountDao::getId)
						.collect(Collectors.toSet());
				// get top discount only.
				// throw error if more than one config found
				if (rivaahDiscountIdSet.size() > 1) {
					throw new ServiceException(
							"Multiple Configurations Present for Discount Type - "
									+ DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name() + ", Please verify Data.",
							"ERR-CONFIG-123", "Multiple discount configs found",
							Map.of("discountType", DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()));
				}
				validDiscountList.add(discountListDao.get(0));
			}
		}

		// validating TSSS Discounts Configs
		if (discountBillLevelRequest.getTsssDetails() != null) {

			List<DiscountDao> validTSSSDiscountList = new ArrayList<>();

			getTssDiscountIds(discountBillLevelRequest.getTsssDetails(), validTSSSDiscountList);

			if (!validTSSSDiscountList.isEmpty()) {
				validDiscountList.addAll(validTSSSDiscountList);
			} else {
				throw new ServiceException(ConfigConstants.COUPON_CODE_INVALID, ConfigConstants.ERR_CONFIG_164);
			}

		}
		// ignore error for Rivaah GHS
		if (validDiscountList.isEmpty() && !DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name()
				.equals(discountBillLevelRequest.getDiscountType())) {
			Map<String, String> dynamicValues = new HashMap<>();
			dynamicValues.put("discountType", discountBillLevelRequest.getDiscountType());
			dynamicValues.put("locationCode", CommonUtil.getLocationCode());
			throw new ServiceException(ConfigConstants.DISCOUNTS_UNAVAILABLE_FOR_THIS_DISCOUNT_TYPE,
					ConfigConstants.ERR_CONFIG_142,
					Map.of("errorMessage:", "Running Discounts Not Available", "discountType:",
							discountBillLevelRequest.getDiscountType(), "businessDate", businessDate, "locationCode:",
							CommonUtil.getLocationCode()),
					dynamicValues);
		}
	}

	/**
	 * @param discountListDao
	 * @param validDiscountList
	 * @param list
	 */
	private void validateEmployeeCouponCode(List<DiscountDao> discountListDao, List<DiscountDao> validDiscountList,
			List<EmployeeCouponDetailDto> employeeCouponDetailDto) {
		employeeCouponDetailDto.forEach(couponDetails -> {

			// Call to revert coupon redemption by refer the redeemTxnId
			GcResponseDto couponResponseDto = integrationServiceClient.getGiftCardBalanc(VendorCodeEnum.QC_GC.name(),
					couponDetails.getCouponCode(), null, false, GiftCardTypeEnum.EMPLOYEE_CODE);
			log.info("GIFT CARD RESPONSE DTO"+MapperUtil.getJsonString(couponResponseDto));
			if (!"0".equals(couponResponseDto.getResponseCode())) {
				Map<String, String> errorCause = Map.of("couponCode", couponDetails.getCouponCode(), "errorMessage",
						couponResponseDto.getResponseMessage());
				if (couponResponseDto.getResponseCode().equalsIgnoreCase("ERR-INT-21014")) {
					throw new ServiceException("This discount code is already used", "ERR-CONFIG-158", errorCause);
				}
				throw new ServiceException("Error from Gift card application :- {errorMessage}", "ERR-ENG-036",
						Map.of("errorMessage", couponResponseDto.getResponseMessage()));
			} else {
				discountListDao.forEach(discount -> {
					JsonData basicCriteriaJson = MapperUtil.getObjectMapperInstance()
							.convertValue(MapperUtil.getJsonFromString(discount.getBasicCriteria()), JsonData.class);

					BaseBasicCriteriaDetails basicCriteriaDetails = MapperUtil
							.mapObjToClass(basicCriteriaJson.getData(), BaseBasicCriteriaDetails.class);
					if (basicCriteriaDetails.getStartingSerialNo() != null) {

						String[] values = basicCriteriaDetails.getStartingSerialNo().split(",");
						for (int i = 0; i < values.length; i++) {
							if (values[i].equals(couponDetails.getCouponCode().substring(0, values[i].length()))) {
								validDiscountList.add(discount);
								break;
							}
						}
					}

				});
			}

		});
		if (validDiscountList.isEmpty()) {
			Map<String, String> errorCause = Map.of("errorMessage", "Not Matching with startingSerialNo configuratoin");
			throw new ServiceException(ConfigConstants.INVALID_COUPON_CODE, ConfigConstants.ERR_CONFIG_146, errorCause);
		}
	}

	private void validateTataEmployeeDetailsAgainstDiscountIds(List<DiscountDao> discountListDao,
			List<DiscountDao> validDiscountList, TataEmployeeDiscountDetailsDto tataEmployeeDiscountDetailsDto) {

		if (tataEmployeeDiscountDetailsDto.getEmployeeId() != null
				&& tataEmployeeDiscountDetailsDto.getCompanyName() != null) {
			int maxCount = getMaxCountFromSalesTransaction(tataEmployeeDiscountDetailsDto.getEmployeeId(),
					tataEmployeeDiscountDetailsDto.getCompanyName());
			log.info("Number of Transaction: ", maxCount);
			log.info("Employee ID: ", tataEmployeeDiscountDetailsDto.getEmployeeId());
			log.info("Company Name: ", tataEmployeeDiscountDetailsDto.getCompanyName());
			discountListDao.forEach(discountDao -> {
				JsonData basicCriteriaJson = MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(discountDao.getBasicCriteria()), JsonData.class);
				BaseBasicCriteriaDetails basicCriteriaDetails = MapperUtil.mapObjToClass(basicCriteriaJson.getData(),
						BaseBasicCriteriaDetails.class);
				if (basicCriteriaDetails.getMaxCount() != null && maxCount < basicCriteriaDetails.getMaxCount()) {
					validDiscountList.add(discountDao);
				}

			});
		}

		if (validDiscountList.isEmpty()) {
			throw new ServiceException(ConfigConstants.EXCEEDED_MAX_LIMIT, ConfigConstants.ERR_CONFIG_147);
		}

	}

	/**
	 * @param employeeId
	 * @param companyName
	 * @return
	 */
	private int getMaxCountFromSalesTransaction(String employeeId, String companyName) {

		Map<String, String> requestParams = new HashMap<>();
		requestParams.put("employeeID", employeeId);
		requestParams.put("companyName", companyName);
		ApiResponseDto epossApiResponseDto = discountUtilService.callEPOSSAPIThroughIntegration(HttpMethod.GET,
				EngineConstants.MAX_COUNT_URL, requestParams, null);
		ObjectMapper mapper = new ObjectMapper();
		EmployeeDiscountTxnResponse response = mapper.convertValue(epossApiResponseDto.getResponse(),
				new TypeReference<EmployeeDiscountTxnResponse>() {
				});
		return response.getTxnCount();
	}

	private void getTssDiscountIds(TSSSDiscountDetailsDto tsssDiscountDetailsDto, List<DiscountDao> validDiscountList) {

		List<DiscountDao> discountDaos=validatingTssDiscountDetails(tsssDiscountDetailsDto);
		if(!discountDaos.isEmpty())
		{
			validDiscountList.addAll(discountDaos);			
		}else
		{
			Map<String, String> dynamicValues = new HashMap<>();
			dynamicValues.put("discountType", DiscountTypeEnum.TSSS_DISCOUNT.name());
			dynamicValues.put("locationCode", CommonUtil.getLocationCode());
			throw new ServiceException(ConfigConstants.DISCOUNTS_UNAVAILABLE_FOR_THIS_DISCOUNT_TYPE,
					ConfigConstants.ERR_CONFIG_142,
					Map.of("errorMessage:",
							"No Discounts Available or Active for the given discountType at this Location and Businessdate",
							"discountType:", DiscountTypeEnum.TSSS_DISCOUNT.name(), "locationCode:",
							CommonUtil.getLocationCode()),
					dynamicValues);
		}
	}

	private List<DiscountDao> validatingTssDiscountDetails(TSSSDiscountDetailsDto tsssDiscountDetailsDto) {

		List<String> couponCodesList = new ArrayList<>();

		tsssDiscountDetailsDto.getCouponDetails().forEach(coupon -> couponCodesList.add(coupon.getCouponCode()));

		List<String> validDiscountIds = discountUtilService.getValidTSSSCoupons(couponCodesList);
		return discountRepository.findAllById(validDiscountIds);
	}

	private void getDiscountsForBillLevel(DiscountBillLevelRequestDto discountBillLevelRequest,
			DiscountTypeMetaDataDao discountMetadata, Date businessDate,
			List<DiscountBillLevelItemDetailsDto> responseDtoList) {
		List<DiscountDao> validDiscountIds;
		if (discountMetadata.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.BILL_LEVEL_DISCOUNT.toString())) {

			// for Bill level Discounts
			if (discountBillLevelRequest.getItemDetails() != null) {
				throw new ServiceException("Invalid Request - ItemDetails Should be Null for BillLevelDiscount", "ERR");
			} else {

				validDiscountIds = discountRepository.getDiscountsBasedOnDiscountTypeAndLocationCode(
						DiscountTypeEnum.BILL_LEVEL_DISCOUNT.toString(), businessDate, CommonUtil.getLocationCode());
			}
		} else {
			// for System Discounts get discount details for the given discountType from
			// discount master
			validDiscountIds = discountRepository.getDiscountDetails(discountMetadata.getDiscountType());

		}
		validDiscountIds.forEach(
				discountDao -> responseDtoList.add(discountUtilService.createBillLevelResponse(discountDao, null)));

	}

	@Override
	public DiscountEngineResponseDto calculateDiscountValue(String discountId, String discountClubId,
			DiscountCalRequestDto discountCalDto) {

		discountCalDto.setBusinessDate(CalendarUtils.getStartOfDay(discountCalDto.getBusinessDate()));
		if (StringUtils.isEmpty(discountId) && StringUtils.isEmpty(discountClubId)) {
			throw new ServiceException("Discount id is not present", "ERR-CONFIG-161");
		}

		DiscountEngineResponseDto response = new DiscountEngineResponseDto();
		List<DiscountDetailsResponseDto> discountDetails = new ArrayList<>();
		List<DiscountDao> discounts = getDiscounts(discountClubId, discountId);

		for (DiscountDao validDiscountObj : discounts) {

			// calculate Discount Value for item
			discountDetails.add(calculateDiscount(validDiscountObj, discountId, discountCalDto, null, null));
		}
		response.setClubbingId(discountClubId);
		response.setDiscountDetailsResponseDto(discountDetails);

		return response;
	}

	private DiscountDetailsResponseDto calculateDiscount(DiscountDao validDiscountObj, String discountId,
			DiscountCalRequestDto discountCalDto, Date offerEndDate, RegularCategoryDetails regularCategoryDetails) {
		if (validDiscountObj == null) {
			validDiscountObj = discountRepository.findById(discountId)
					.orElseThrow(() -> new ServiceException(
							ConfigConstants.NO_DISCOUNT_DETAILS_FOUND_FOR_THE_REQUESTED_DISCOUNTID,
							ConfigConstants.ERR_CONFIG_033));
		}

		// temporary removing time component from date part
		discountCalDto.setBusinessDate(CalendarUtils.getStartOfDay(discountCalDto.getBusinessDate()));
		if (discountCalDto.getCustomerDetails() != null
				&& discountCalDto.getCustomerDetails().getEnrollmentDate() != null) {
			discountCalDto.getCustomerDetails().setEnrollmentDate(
					CalendarUtils.getStartOfDay(discountCalDto.getCustomerDetails().getEnrollmentDate()));

		}

		RegularCategoryDetails regularDetails = new RegularCategoryDetails();
		DiscountDetailsResponseDto responseObject = new DiscountDetailsResponseDto();
		SlabConfigDetails slabConfigDetails = new SlabConfigDetails();
		if (DiscountTypeEnum.BEST_DEAL_DISCOUNT.toString().equalsIgnoreCase(validDiscountObj.getDiscountType())
				|| DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT.toString()
						.equalsIgnoreCase(validDiscountObj.getDiscountType())) {

			if (regularCategoryDetails != null && discountCalDto.getTransactionDetails().getRefTxnType() != null
					&& discountCalDto.getTransactionDetails().getRefTxnType().equals("AB")) {
				MapperUtil.beanMapping(regularCategoryDetails, regularDetails);
			} else {
				// discount component is present in discountItemMapping table for above discount
				// Types
				regularDetails = validateRequestAndGetDiscountComponentFromDiscountItemMapping(validDiscountObj,
						discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(),
						discountCalDto.getCustomerDetails(), responseObject, discountCalDto.getTransactionDetails(),
						Boolean.FALSE);
			}

		} else if (DiscountTypeEnum.SLAB_BASED_DISCOUNT.toString().equalsIgnoreCase(validDiscountObj.getDiscountType())
				|| DiscountTypeEnum.HIGH_VALUE_DISCOUNT.toString()
						.equalsIgnoreCase(validDiscountObj.getDiscountType())) {
			if (regularCategoryDetails != null && discountCalDto.getTransactionDetails().getRefTxnType() != null
					&& discountCalDto.getTransactionDetails().getRefTxnType().equals("AB")) {
				MapperUtil.beanMapping(regularCategoryDetails, regularDetails);
			} else {
				regularDetails = getConfigDetailsFromValidSlab(validDiscountObj, discountCalDto, slabConfigDetails,
						responseObject, offerEndDate);
			}

		} else if (DiscountTypeEnum.EMPOWERMENT_DISCOUNT.toString()
				.equalsIgnoreCase(validDiscountObj.getDiscountType())) {
			regularDetails = validateAndGetEmpowermentConfigDetails(validDiscountObj, discountCalDto.getBusinessDate(),
					discountCalDto.getItemDetails());
			// for empowerment there is no preview, hence it will always be regular
			if (discountCalDto.getTransactionDetails().getTransactionType().equalsIgnoreCase("AB")
					|| discountCalDto.getTransactionDetails().getTransactionType().equalsIgnoreCase("CO")) {
				DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
				discountConfigDetails.setRegularDiscountComponent(regularDetails);
				discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.REGULAR.name());
				responseObject.setDiscountConfigDetails(discountConfigDetails);
			}
		} else if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.toString()
				.equalsIgnoreCase(validDiscountObj.getDiscountType())) {
			if (discountCalDto.getEligibleRivaahGhsDetails() == null) {
				throw new ServiceException(EngineConstants.INVALID_REQUEST_FORMAT, EngineConstants.ERR_CORE_023,
						"Rivaah details not present.");
			}

			RegularCategoryDetailsExtendedForRivaahGhs details = validateAndGetRivaahConfigDetails(validDiscountObj,
					discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(),
					new RivaahGhsDiscountDetailsDto(List.of(discountCalDto.getEligibleRivaahGhsDetails())));
			regularDetails = MapperUtil.mapObjToClass(details, RegularCategoryDetails.class);

			DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
			discountConfigDetails.setRegularDiscountComponent(regularDetails);
			discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.REGULAR.name());

			GhsExcludeProductGroupDetailsDto ghsBasicDetails = new GhsExcludeProductGroupDetailsDto();
			ghsBasicDetails.setAccountNo(discountCalDto.getEligibleRivaahGhsDetails().getAccountNo());
			ghsBasicDetails.setMakingChargeDiscountPercent(
					discountCalDto.getEligibleRivaahGhsDetails().getMakingChargeDiscountPercent());
			ghsBasicDetails.setUcpDiscountPercent(discountCalDto.getEligibleRivaahGhsDetails().getUcpDiscountPercent());
			ghsBasicDetails.setBonus(BigDecimal.ZERO);
			ghsBasicDetails.setSchemeCode(discountCalDto.getEligibleRivaahGhsDetails().getSchemeCode());
			ghsBasicDetails.setPaymentCode(discountCalDto.getEligibleRivaahGhsDetails().getPaymentCode());
			ghsBasicDetails.setSchemeType(GhsSchemeTypeEnum.RIVAAH_SCHEME.name());
			ghsBasicDetails
					.setGhsExcludeProductGroups(discountCalDto.getEligibleRivaahGhsDetails().getExcludeProductGroup());
			discountConfigDetails.setGhsExcludeProductGroupDetails(ghsBasicDetails);

			responseObject.setDiscountConfigDetails(discountConfigDetails);
			responseObject.setRivaahGhsDetails(discountCalDto.getEligibleRivaahGhsDetails());
		} else {
			if (regularCategoryDetails != null && discountCalDto.getTransactionDetails().getRefTxnType() != null
					&& discountCalDto.getTransactionDetails().getRefTxnType().equals("AB")) {
				MapperUtil.beanMapping(regularCategoryDetails, regularDetails);
			} else {
				// validate request details and get discount component
				regularDetails = validateRequestAndGetDiscountComponent(validDiscountObj,
						discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(),
						discountCalDto.getCustomerDetails(), discountCalDto.getTransactionDetails(), responseObject,
						true, offerEndDate);
			}
		}

		if (regularDetails == null) {
			throw new ServiceException(ConfigConstants.DISCOUT_COMPONENT_NOT_CONFIGURED, ConfigConstants.ERR_CONFIG_145,
					Map.of(DISCOUNT_ID, discountId));
		}

		if (discountCalDto.getTransactionDetails().getTransactionType().equalsIgnoreCase("AB")
				|| discountCalDto.getTransactionDetails().getTransactionType().equalsIgnoreCase("CO")) {
			responseObject.getDiscountConfigDetails()
					.setAppliedDiscountMaster(discountUtilService.mapDiscountDto(validDiscountObj));
			responseObject.getDiscountConfigDetails().setAppliedDiscountComponent(regularDetails);
			// responseObject.getDiscountConfigDetails().setAppliedDiscountComponentType(discountCalDto.getTransactionDetails().getTransactionType());
			responseObject
					.setDiscountConfigDetails(setConfigForAbCo(responseObject.getDiscountConfigDetails(), discountId));
		}

		// calculate Discount Value for item
		return calculateDiscountValue(validDiscountObj, regularDetails, discountCalDto.getItemDetails(),
				discountCalDto.getBusinessDate(), slabConfigDetails, true, responseObject);
	}

	private List<DiscountDao> getDiscounts(String discountClubId, String discountId) {
		List<DiscountDao> discounts = new ArrayList<>();
		if (!StringUtils.isEmpty(discountClubId)) {
			String clubDiscountString = clubbingRepository.getClubbingDiscount(discountClubId);
			String[] clubDiscounts = clubDiscountString.split(",");
			for (String discount : clubDiscounts) {
				if (!StringUtils.isEmpty(discount) && !discount.equalsIgnoreCase("null")) {
					discounts.add(validateDiscountDao(discount));
				}
			}
		} else {
			discounts.add(validateDiscountDao(discountId));
		}
		return discounts;
	}

	private RegularCategoryDetails validateRequestAndGetDiscountComponentFromDiscountItemMapping(
			DiscountDao discountDao, Date businessDate, DiscountItemDetailsReqDto itemDetails,
			DiscountCustDetails customerDetails, DiscountDetailsResponseDto responseObject,
			TransactionDetailsDto transactionDetailsDto, Boolean isRivaah) {

		DiscountItemMappingDao itemDiscountComponent = null;
		RegularCategoryDetails categoryDetails = null;
		if (BooleanUtils.isTrue(isRivaah) && transactionDetailsDto.getRefTxnType() != null
				&& transactionDetailsDto.getRefTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.name())
				&& discountDao.getOrderDetails() != null) {
			JsonData orderDetailJson = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountDao.getOrderDetails()), JsonData.class);
			DiscountOrderConfigDetails orderDetail = MapperUtil.mapObjToClass(orderDetailJson.getData(),
					DiscountOrderConfigDetails.class);
			if (orderDetail.getOfferPeriodForAB() != null && orderDetail.getOfferPeriodForAB() > 0) {
				itemDiscountComponent = discountItemMappingRepository.getDiscountComponentDetailsWithDate(
						discountDao.getId(), itemDetails.getItemCode(), itemDetails.getLotNumber(),
						CommonUtil.getLocationCode(), businessDate, orderDetail.getOfferPeriodForAB());
			} else {
				itemDiscountComponent = discountItemMappingRepository.getDiscountComponentDetails(discountDao.getId(),
						itemDetails.getItemCode(), itemDetails.getLotNumber(), CommonUtil.getLocationCode(),
						businessDate);
			}
		} else if (BooleanUtils.isTrue(isRivaah) && transactionDetailsDto.getRefTxnType() != null
				&& transactionDetailsDto.getRefTxnType().equalsIgnoreCase(TransactionTypeEnum.CO.name())
				&& discountDao.getOrderDetails() != null) {
			JsonData orderDetailJson = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountDao.getOrderDetails()), JsonData.class);
			DiscountOrderConfigDetails orderDetail = MapperUtil.mapObjToClass(orderDetailJson.getData(),
					DiscountOrderConfigDetails.class);
			if (orderDetail.getOfferPeriodForAB() != null && orderDetail.getOfferPeriodForCO() > 0) {
				itemDiscountComponent = discountItemMappingRepository.getDiscountComponentDetailsWithDate(
						discountDao.getId(), itemDetails.getItemCode(), itemDetails.getLotNumber(),
						CommonUtil.getLocationCode(), businessDate, orderDetail.getOfferPeriodForCO());
			} else {
				itemDiscountComponent = discountItemMappingRepository.getDiscountComponentDetails(discountDao.getId(),
						itemDetails.getItemCode(), itemDetails.getLotNumber(), CommonUtil.getLocationCode(),
						businessDate);
			}
		} else {
			if (itemDetails.getLotNumber() != null && itemDetails.getLotNumber()
					.substring(itemDetails.getLotNumber().length() - 2, itemDetails.getLotNumber().length())
					.equals("CP")) {

				itemDetails
						.setLotNumber(itemDetails.getLotNumber().substring(0, itemDetails.getLotNumber().length() - 2));
				// System.out.println("The lot Number is : "+itemDetails.getLotNumber());

			}
			itemDiscountComponent = discountItemMappingRepository.getDiscountComponentDetails(discountDao.getId(),
					itemDetails.getItemCode(), itemDetails.getLotNumber(), CommonUtil.getLocationCode(), businessDate);
		}

		if (itemDiscountComponent == null) {
			throw new ServiceException(ConfigConstants.DISCOUNT_NOT_AVAILABLE_ON_ITEM, ConfigConstants.ERR_CONFIG_143);
		} else {
			DiscountItemRegularConfigDetailsDto regularDetails = MapperUtil.mapObjToClass(
					itemDiscountComponent.getRegularConfigDetails(), DiscountItemRegularConfigDetailsDto.class);
			DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
			// for encircle customers
			if (customerDetails != null && customerDetails.getUlpId() != null
					&& BooleanUtils.isTrue(itemDiscountComponent.getIsPreviewApplicable())
					&& checkCustomerEnrollmentDateForItemDiscount(customerDetails, discountDao)
					&& (!(businessDate.before(itemDiscountComponent.getPreviewStartDate())
							|| businessDate.after(itemDiscountComponent.getPreviewEndDate())))) {

				DiscountItemPreviewConfigDetailsDto previewDetails = MapperUtil.mapObjToClass(
						itemDiscountComponent.getPreviewConfigDetails(), DiscountItemPreviewConfigDetailsDto.class);
				categoryDetails = convertToRegularCategoryDetailsForPreviewComponent(previewDetails);
				discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.PREVIEW.name());

			} else {
				// for regular customers
				categoryDetails = convertToRegularCategoryDetailsForRegularComponent(regularDetails);
				discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.REGULAR.name());
			}
			LocationOfferDetails locationOfferDetails = new LocationOfferDetails();
			locationOfferDetails.setOfferStartDate(itemDiscountComponent.getStartDate());
			locationOfferDetails.setOfferEndDate(itemDiscountComponent.getEndDate());
			locationOfferDetails.setPreviewOfferStartDate(itemDiscountComponent.getPreviewStartDate());
			locationOfferDetails.setPreviewOfferEndDate(itemDiscountComponent.getPreviewEndDate());
			discountConfigDetails.setLocationOfferDetails(locationOfferDetails);
			// returning regular details for ab to cm scenario
			discountConfigDetails.setRegularDiscountComponent(categoryDetails);
			responseObject.setDiscountConfigDetails(discountConfigDetails);
		}
		return categoryDetails;

	}

	private boolean checkCustomerEnrollmentDateForItemDiscount(DiscountCustDetails customerDetails,
			DiscountDao discount) {
		Date encircleCreationDate = customerDetails.getEnrollmentDate();
		return discount.getUlpCreateDate() != null && (encircleCreationDate.equals(discount.getUlpCreateDate())
				|| encircleCreationDate.before(discount.getUlpCreateDate()));
	}

	private RegularCategoryDetails convertToRegularCategoryDetailsForRegularComponent(
			DiscountItemRegularConfigDetailsDto regularDetails) {
		RegularCategoryDetails categoryDetails = new RegularCategoryDetails();

		MetalChargeData metalCharges = new MetalChargeData();
		metalCharges.setIsPercent(regularDetails.getRegularVIsPercent());
		metalCharges.setValue(regularDetails.getRegularVValue());
		categoryDetails.setGoldCharges(metalCharges);

		StoneChargeData stoneCharges = new StoneChargeData();
		stoneCharges.setIsPercent(regularDetails.getRegularF1IsPercent());
		stoneCharges.setValue(regularDetails.getRegularF1Value());
		categoryDetails.setStoneCharges(stoneCharges);

		UcpData ucpCharges = new UcpData();
		ucpCharges.setIsPercent(regularDetails.getRegularUcpIsPercent());
		ucpCharges.setValue(regularDetails.getRegularUcpValue());
		categoryDetails.setIsUCP(ucpCharges);

		MakingChargeData mcCharges = new MakingChargeData();
		mcCharges.setIsPercent(regularDetails.getRegularF2IsPercent());
		mcCharges.setValue(regularDetails.getRegularF2Value());
		categoryDetails.setMcCharges(mcCharges);

		RsPerGramData rsPerGram = new RsPerGramData();
		rsPerGram.setIsGrossWeight(regularDetails.getRegularIsGrossWeight());
		rsPerGram.setWeight(regularDetails.getRegularWeightValue());
		categoryDetails.setRsPerGram(rsPerGram);
		return categoryDetails;
	}

	private RegularCategoryDetails convertToRegularCategoryDetailsForPreviewComponent(
			DiscountItemPreviewConfigDetailsDto previewDetails) {

		RegularCategoryDetails categoryDetails = new RegularCategoryDetails();

		MetalChargeData metalCharges = new MetalChargeData();
		metalCharges.setIsPercent(previewDetails.getPreviewVIsPercent());
		metalCharges.setValue(previewDetails.getPreviewVValue());
		categoryDetails.setGoldCharges(metalCharges);

		StoneChargeData stoneCharges = new StoneChargeData();
		stoneCharges.setIsPercent(previewDetails.getPreviewF1IsPercent());
		stoneCharges.setValue(previewDetails.getPreviewF1Value());
		categoryDetails.setStoneCharges(stoneCharges);

		UcpData ucpCharges = new UcpData();
		ucpCharges.setIsPercent(previewDetails.getPreviewUcpIsPercent());
		ucpCharges.setValue(previewDetails.getPreviewUcpValue());
		categoryDetails.setIsUCP(ucpCharges);

		MakingChargeData mcCharges = new MakingChargeData();
		mcCharges.setIsPercent(previewDetails.getPreviewF2IsPercent());
		mcCharges.setValue(previewDetails.getPreviewF2Value());
		categoryDetails.setMcCharges(mcCharges);

		RsPerGramData rsPerGram = new RsPerGramData();
		rsPerGram.setIsGrossWeight(previewDetails.getPreviewIsGrossWeight());
		rsPerGram.setWeight(previewDetails.getPreviewWeightValue());
		categoryDetails.setRsPerGram(rsPerGram);
		return categoryDetails;
	}

	private RegularCategoryDetails validateRequestAndGetDiscountComponent(DiscountDao validDiscountDao,
			Date businessDate, DiscountItemDetailsReqDto itemDetails, DiscountCustDetails customerDetails,
			TransactionDetailsDto transactionDetails, DiscountDetailsResponseDto responseObject, boolean throwError,
			Date offerEndDate) {

		Object objectData = null;
		String itemCode = itemDetails.getItemCode();
		BigDecimal complexityPercent = null;
		BigDecimal makingChargePerGram = null;
		if (itemDetails.getPriceDetails() != null && itemDetails.getPriceDetails().getMakingChargeDetails() != null) {
			complexityPercent = itemDetails.getPriceDetails().getMakingChargeDetails().getWastagePct();
			makingChargePerGram = itemDetails.getPriceDetails().getMakingChargeDetails().getMakingChargePgram();
		}
		// validating ItemCode
		List<DiscountExcludeMappingDao> excludeItem = discountUtilService.validateItemCode(validDiscountDao.getId(),
				itemCode, complexityPercent, makingChargePerGram);

		RegularCategoryDetails regularDetails = null;
		if (excludeItem.isEmpty()) {
			String productGroupCode = itemDetails.getProductGroupCode();
			String productCategoryCode = itemDetails.getProductCategoryCode();

			DiscountDao discountDao = null;
			if (offerEndDate == null || transactionDetails.getRefTxnType() == null) {
				// validating other Request Details
				discountDao = discountUtilService.validateOtherRequestDetails(validDiscountDao.getId(),
						CalendarUtils.getStartOfDay(businessDate), productGroupCode, productCategoryCode,
						CommonUtil.getLocationCode(), validDiscountDao.getDiscountType());
			} else {
				JsonData orderDetailJson = MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(validDiscountDao.getOrderDetails()), JsonData.class);
				DiscountOrderConfigDetails orderDetail = MapperUtil.mapObjToClass(orderDetailJson.getData(),
						DiscountOrderConfigDetails.class);
				log.info("order details : " + orderDetail);
				log.info("offer end date : " + offerEndDate);
				if (transactionDetails.getRefTxnType() != null
						&& transactionDetails.getRefTxnType().equalsIgnoreCase("AB") && orderDetail != null
						&& orderDetail.getOfferPeriodForAB() != null && offerEndDate != null) {

					// to get after AB offer period we have to do
					// endDate + grace period
					Calendar cal = Calendar.getInstance();
					cal.setTime(offerEndDate);
					cal.add(Calendar.DATE, orderDetail.getOfferPeriodForAB());
					log.info("after adding grace period : " + cal.getTime());
					// validating other Request Details with grace period
					discountDao = discountRepository.validateRequestDetailsWthGracePeriod(validDiscountDao.getId(),
							CalendarUtils.getStartOfDay(businessDate), productGroupCode, productCategoryCode,
							CommonUtil.getLocationCode(), cal.getTime());

				}

			}

			if (discountDao == null) {
				throw new ServiceException(ConfigConstants.DISCOUNT_NOT_AVAILABLE_ON_ITEM,
						ConfigConstants.ERR_CONFIG_143);
			}
			DiscountDetailsDao discountDetail = new DiscountDetailsDao();
			if(discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name()) || discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())) {
				discountDetail = getValidSlab(discountDao.getId(), productGroupCode,itemDetails);
				
			}else {
				// get discount component based on discountId and ProductGroupCode
				discountDetail = getDiscountDetails(discountDao.getId(), productGroupCode);
			}
			

			if (discountDetail == null) {
				if (throwError) {
					throw new ServiceException(ConfigConstants.NO_DISCOUT_COMPONENT_CONFIGURED,
							ConfigConstants.ERR_CONFIG_144, Map.of(discountDao.getId(), productGroupCode));
				}
				return null;
			}

			// getABCoJsonData for the given discountId
			JsonData abCoJsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountDao.getAbCoData()), JsonData.class);

			AbCoDetails abCoDetails = MapperUtil.mapObjToClass(abCoJsonData.getData(), AbCoDetails.class);

			// check preview details if present
			DiscountDao discountPreviewDetails = null;
			if (customerDetails != null && customerDetails.getUlpId() != null) {
				Date encircleCreationDate = customerDetails.getEnrollmentDate();
				discountPreviewDetails = discountRepository.getPreviewDetails(validDiscountDao.getId(),
						encircleCreationDate, businessDate, CommonUtil.getLocationCode());
			}
			// get order details for the given discountId
			JsonData orderDetailsJsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountDao.getOrderDetails()), JsonData.class);
			OrderConfigDetails orderConfigDetails = MapperUtil.mapObjToClass(orderDetailsJsonData.getData(),
					OrderConfigDetails.class);

			objectData = getDiscountComponentBasedOnTransactionType(transactionDetails, discountDetail,
					discountPreviewDetails, abCoDetails, discountDao, orderConfigDetails, responseObject, businessDate);

			regularDetails = MapperUtil.mapObjToClass(objectData, RegularCategoryDetails.class);

		}

		else {
			if (throwError) {
				// giving of discount on this itemcode is excluded in eposs
				throw new ServiceException(ConfigConstants.DISCOUNT_NOT_AVAILABLE_ON_ITEM,
						ConfigConstants.ERR_CONFIG_143, Map.of(excludeItem.get(0).getDiscount().getId(), itemCode));
			}
			return null;
		}
		return regularDetails;

	}

	private DiscountDetailsDao getValidSlab(String id, String productGroupCode, DiscountItemDetailsReqDto itemDetails) {
		List<DiscountDetailsDao> discountDetailList =  discountDetailsRepository.getDiscountDetails(id, productGroupCode);
		if(!discountDetailList.isEmpty()) {
			String discountCategory = discountDetailList.get(0).getDiscountCategory();
			String discountEligibility = discountDetailList.get(0).getEligibility();
			if (DiscountCategoryEnum.WEIGHT_BASED.toString().equalsIgnoreCase(discountCategory)) {
				BigDecimal grossWeight  = itemDetails.getTotalWeight();
				BigDecimal netWeight = itemDetails.getPriceDetails().getNetWeight();
				for (DiscountDetailsDao slab : discountDetailList) {
					if (DiscountEligibilityEnum.GROSS_WEIGHT.toString().equalsIgnoreCase(discountEligibility) && checkIfItBelongsToSlab(slab.getMinValue(),slab.getMaxValue(),grossWeight)) {
						return slab;
					}else if (DiscountEligibilityEnum.NET_WEIGHT.toString().equalsIgnoreCase(discountEligibility) && checkIfItBelongsToSlab(slab.getMinValue(),slab.getMaxValue(),netWeight)) {
						return slab;
					}
				}
			}else if(DiscountCategoryEnum.VALUE_BASED.toString().equalsIgnoreCase(discountCategory)){
				for (DiscountDetailsDao slab : discountDetailList) {
					if(DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.toString().equalsIgnoreCase(discountEligibility) && checkIfItBelongsToSlab(slab.getMinValue(),slab.getMaxValue(),itemDetails.getTotalValue())) {
						return slab;
					}
					else if (DiscountEligibilityEnum.PRE_DISCOUNT_TAX.toString().equalsIgnoreCase(discountEligibility) && checkIfItBelongsToSlab(slab.getMinValue(), slab.getMaxValue(), itemDetails.getTotalTax().add(itemDetails.getTotalValue()))) {
						return slab;
					}
				}
			}
		}
		return null;
	}

	private Object getDiscountComponentBasedOnTransactionType(TransactionDetailsDto transactionDetailsDto,
			DiscountDetailsDao discountDetail, DiscountDao discountPreviewDetails, AbCoDetails abCoDetails,
			DiscountDao discountDao, OrderConfigDetails orderConfigDetails, DiscountDetailsResponseDto responseObject,
			Date businessDate) {

		Boolean isFrozenRate = transactionDetailsDto == null ? null : transactionDetailsDto.getIsFrozenRate();
		String transactionType = transactionDetailsDto == null ? null : transactionDetailsDto.getTransactionType();
		Object objectData = null;
		// if Transactiontype is AB,get discountComponent according to the value present
		// in AbCo JsonObject

		discountDetail.setDiscount(discountDetail.getDiscount());
		DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
		JsonData regularJsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discountDetail.getRegularConfigDetails()), JsonData.class);
		if (checkIfAbCoApplicable(discountDao.getIsAbOfferApplicable().booleanValue(), isFrozenRate, transactionType,
				orderConfigDetails, "AB")) {
			for (AbDiscount abvalue : abCoDetails.getAbDiscount()) {
				objectData = getDiscountComponentBasedOnCondition(abvalue, null, discountDetail, responseObject,
						businessDate,discountPreviewDetails);
			}
			discountConfigDetails.setAppliedDiscountComponentType(responseObject.getDiscountConfigDetails().getAppliedDiscountComponentType());
//			discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.AB.name());
			// returning regular details even if preview is applied for ab to cm scenario
			RegularCategoryDetails regularDetails = MapperUtil.mapObjToClass(regularJsonData.getData(),
					RegularCategoryDetails.class);
			discountConfigDetails.setRegularDiscountComponent(regularDetails);
		}
		// if Transactiontype is CO,get discountComponent according to the value present
		// in AbCo JsonObject
		else if (checkIfAbCoApplicable(discountDao.getIsCoOfferApplicable().booleanValue(), isFrozenRate,
				transactionType, orderConfigDetails, "CO")) {
			for (CoDiscount coValue : abCoDetails.getCoDiscount()) {
				objectData = getDiscountComponentBasedOnCondition(null, coValue, discountDetail, responseObject,
						businessDate,discountPreviewDetails);
			}
//			discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.CO.name());
			discountConfigDetails.setAppliedDiscountComponentType(responseObject.getDiscountConfigDetails().getAppliedDiscountComponentType());
			// returning regular details even if preview is applied for ab to cm scenario
			RegularCategoryDetails regularDetails = MapperUtil.mapObjToClass(regularJsonData.getData(),
					RegularCategoryDetails.class);
			discountConfigDetails.setRegularDiscountComponent(regularDetails);
		}
		// if Transactiontype is CM or where the CO/AB config not applicable ,get
		// discountComponent - preview/regular accordingly
		else {
			if (discountPreviewDetails != null) {
				JsonData previewJsonData = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(discountDetail.getPreviewConfigDetails()), JsonData.class);
				objectData = previewJsonData.getData();
				discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.PREVIEW.name());
			} else {
				objectData = regularJsonData.getData();
				discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.REGULAR.name());
			}
		}
		responseObject.setDiscountConfigDetails(discountConfigDetails);
		return objectData;
	}

	private boolean checkIfAbCoApplicable(boolean abCoOfferApplicable, Boolean isFrozenRate, String transactionType,
			OrderConfigDetails orderConfigDetails, String expectedTransactionType) {
		return abCoOfferApplicable && expectedTransactionType.equalsIgnoreCase(transactionType)
				&& (BooleanUtils.isTrue(isFrozenRate) || (BooleanUtils.isNotTrue(isFrozenRate)
						&& BooleanUtils.isFalse(orderConfigDetails.getIsGoldRateFrozenForAB())));
	}

	private DiscountDetailsResponseDto calculateDiscountValue(DiscountDao validDiscountObj,
			RegularCategoryDetails regularDetails, DiscountItemDetailsReqDto itemDetails, Date businessDate,
			SlabConfigDetails slabConfigDetails, boolean throwException, DiscountDetailsResponseDto responseObject) {

		List<DiscountValueDetails> valueDetails = new ArrayList<>();

		BigDecimal discountOnMcValue = BigDecimal.ZERO;
		BigDecimal discountOnMetalChargeValue = BigDecimal.ZERO;
		BigDecimal discountOnStoneChargeValue = BigDecimal.ZERO;
		BigDecimal discountOnWeight = BigDecimal.ZERO;
		BigDecimal discountOnUcp = BigDecimal.ZERO;

		BigDecimal totalDiscountValue = null;
		if (itemDetails.getPriceDetails().getIsUcp()) {

			// checking if ucp is configured
			if (regularDetails.getIsUCP().getValue() == null
					|| regularDetails.getIsUCP().getValue().compareTo(BigDecimal.ZERO) == 0) {
				throw new ServiceException(
						"UCP discount is not configured for this product, Pls contact the administrator",
						"ERR-CONFIG-160");
			}
			// calculate discountValue on Ucp
			BigDecimal calculatedUcpDiscVal = calculateDiscountOnUcpIfEnabled(regularDetails, itemDetails, valueDetails,
					discountOnUcp, throwException);
			totalDiscountValue = calculatedUcpDiscVal;
		} else {

			BigDecimal calculatedUcpDiscVal = BigDecimal.ZERO;
			if (regularDetails.getIsUCP() != null && regularDetails.getIsUCP().getValue() != null) {
				// calculate discountValue on Ucp
				calculatedUcpDiscVal = calculateDiscountOnUcpIfEnabled(regularDetails, itemDetails, valueDetails,
						discountOnUcp, throwException);
			}
			// calculate discountValue on MakingCharges
			BigDecimal calculatedMcDiscVal = calculateMakingChargeDiscountValue(regularDetails, itemDetails,
					valueDetails, discountOnMcValue, throwException);

			// calculate discountValue on MetalCharges

			BigDecimal calculatedMetalChrgeDiscVal = calculateMetalChargeDiscountValue(regularDetails, itemDetails,
					valueDetails, discountOnMetalChargeValue, throwException);

			// calculate discountValue on StoneCharges
			BigDecimal calculatedStoneChargeDiscVal = calculateStoneChargeDiscountValue(regularDetails, itemDetails,
					valueDetails, discountOnStoneChargeValue, throwException);

			// calculate discountValue on weight of the Product
			BigDecimal calculatedDiscValOnWeight = calculateDiscountOnWeightOfTheProduct(regularDetails, itemDetails,
					valueDetails, discountOnWeight);

			// summation of all discountComponent values to get Total discount Amount
			totalDiscountValue = calculatedMcDiscVal.add(calculatedMetalChrgeDiscVal).add(calculatedStoneChargeDiscVal)
					.add(calculatedDiscValOnWeight).add(calculatedUcpDiscVal);
		}

		if (totalDiscountValue.compareTo(itemDetails.getTotalValue()) > 0) {
			throw new ServiceException("Discount is greater than the item value", "ERR-CONFIG-156");
		}

		return createResponseObject(validDiscountObj, valueDetails, totalDiscountValue, businessDate, slabConfigDetails,
				responseObject);
	}

	private DiscountDetailsResponseDto createResponseObject(DiscountDao validDiscountObj,
			List<DiscountValueDetails> valueDetails, BigDecimal totalDiscountValue, Date businessDate,
			SlabConfigDetails slabConfigDetails, DiscountDetailsResponseDto responseObject) {

		responseObject.setDiscountValue(totalDiscountValue);
		responseObject.setDiscountValueDetails(valueDetails);
		DiscountDetailsBaseDto response = responseObject.getDiscountConfigDetails() != null
				? responseObject.getDiscountConfigDetails()
				: new DiscountDetailsBaseDto();
		responseObject.setDiscountConfigDetails(discountUtilService.setDiscountConfigDetails(validDiscountObj, response,
				businessDate, slabConfigDetails));

		return responseObject;
	}

	private BigDecimal calculateDiscountOnWeightOfTheProduct(RegularCategoryDetails regularDetails,
			DiscountItemDetailsReqDto itemDetails, List<DiscountValueDetails> valueDetails,
			BigDecimal discountOnWeightValue) {

		DiscountValueDetails valueDetailObject = new DiscountValueDetails();
		discountOnWeightValue = calculateDiscountOnWeight(regularDetails, discountOnWeightValue, valueDetailObject,
				itemDetails);
		valueDetails.add(valueDetailObject);
		valueDetailObject.setComponent(DiscountComponentTypeEnum.UNIT_WEIGHT.toString());
		valueDetailObject.setDiscountValue(discountOnWeightValue);
		return discountOnWeightValue;

	}

	private BigDecimal calculateDiscountOnWeight(RegularCategoryDetails regularDetails,
			BigDecimal discountOnWeightValue, DiscountValueDetails valueDetailObject,
			DiscountItemDetailsReqDto itemDetails) {

		if (regularDetails.getRsPerGram() != null && regularDetails.getRsPerGram().getWeight() != null
				&& regularDetails.getRsPerGram().getWeight().compareTo(BigDecimal.ZERO) > 0) {

			BigDecimal weightValuefromDB = regularDetails.getRsPerGram().getWeight();

			// if discount is configured for gross Weight in discount master
			if (Boolean.TRUE.equals(regularDetails.getRsPerGram().getIsGrossWeight())) {

				BigDecimal unitWeightValReq = itemDetails.getTotalWeight();

				if (unitWeightValReq != null && unitWeightValReq.compareTo(BigDecimal.ZERO) > 0) {
					// calculate discount component on totalWeight
					discountOnWeightValue = unitWeightValReq.multiply(weightValuefromDB)
							.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

//					valueDetailObject.setDiscountPercent(unitWeightValReq.divide(weightValuefromDB,
//							DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE));
				}
			} else {
				// if discount is configured for net Weight in discount master
				BigDecimal netWeightValReq = itemDetails.getPriceDetails().getNetWeight();

				if (netWeightValReq != null && netWeightValReq.compareTo(BigDecimal.ZERO) > 0) {
					// calculate discount component on netWeight
					discountOnWeightValue = netWeightValReq.multiply(weightValuefromDB)
							.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);
//					valueDetailObject.setDiscountPercent(netWeightValReq.divide(weightValuefromDB,
//							DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE));
				}
			}
		}
		return discountOnWeightValue;

	}

	private BigDecimal calculateDiscountOnUcpIfEnabled(RegularCategoryDetails regularDetails,
			DiscountItemDetailsReqDto itemDetails, List<DiscountValueDetails> valueDetails,
			BigDecimal discountOnUcpValue, boolean throwException) {

		DiscountValueDetails valueDetailObject = new DiscountValueDetails();

		if (itemDetails.getTotalValue() != null && itemDetails.getTotalValue().compareTo(BigDecimal.ZERO) > 0) {
			BigDecimal preDiscountValueReq = itemDetails.getTotalValue();

			if (preDiscountValueReq != null && preDiscountValueReq.compareTo(BigDecimal.ZERO) > 0
					&& regularDetails.getIsUCP() != null
					&& regularDetails.getIsUCP().getValue().compareTo(BigDecimal.ZERO) > 0) {

				discountOnUcpValue = ucpChargeDiscountValueCalculation(regularDetails, valueDetailObject,
						preDiscountValueReq);

				if (Boolean.FALSE.equals(regularDetails.getIsUCP().getIsPercent())
						&& discountOnUcpValue.compareTo(itemDetails.getTotalValue()) > 0 && throwException) {
					throw new ServiceException("Ucp discount is greater than the item value",
							ConfigConstants.ERR_CONFIG_157, Map.of(ConfigConstants.DISCOUNT_TYPE, UCP));
				}
			}
		}
		valueDetailObject.setComponent(DiscountComponentTypeEnum.UCP.toString());
		valueDetailObject.setDiscountValue(discountOnUcpValue);
		valueDetails.add(valueDetailObject);

		return discountOnUcpValue;
	}

	private BigDecimal ucpChargeDiscountValueCalculation(RegularCategoryDetails regularDetails,
			DiscountValueDetails valueDetailObject, BigDecimal preDiscountValueReq) {
		BigDecimal ucpChrgDiscPercent;
		BigDecimal ucpChargeDiscountValue;

		BigDecimal ucpChrgDiscValueFrmDB = regularDetails.getIsUCP().getValue();
		// calculate discountValue on UCPCharge, if Percent is set
		if (Boolean.TRUE.equals(regularDetails.getIsUCP().getIsPercent())) {

			valueDetailObject.setDiscountPercent(ucpChrgDiscValueFrmDB);
			ucpChargeDiscountValue = preDiscountValueReq.multiply(ucpChrgDiscValueFrmDB)
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE).divide(new BigDecimal(100))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

		}
		// calculate discountValue on UCPCharge, if value is set
		else {
			ucpChargeDiscountValue = ucpChrgDiscValueFrmDB;

			ucpChrgDiscPercent = ucpChrgDiscValueFrmDB.multiply(new BigDecimal(100))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)
					.divide(preDiscountValueReq, DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			valueDetailObject.setDiscountPercent(ucpChrgDiscPercent);

		}
		valueDetailObject.setIsDiscountPercentage(regularDetails.getIsUCP().getIsPercent());
		return ucpChargeDiscountValue;
	}

	private BigDecimal calculateStoneChargeDiscountValue(RegularCategoryDetails regularDetails,
			DiscountItemDetailsReqDto itemDetails, List<DiscountValueDetails> valueDetails,
			BigDecimal stoneChargeDiscValue, boolean throwException) {

		DiscountValueDetails valueDetailObject = new DiscountValueDetails();

		// validate request
		if (itemDetails.getPriceDetails().getStonePriceDetails() != null) {
			BigDecimal preDiscountValueReq = itemDetails.getPriceDetails().getStonePriceDetails().getPreDiscountValue();
			// validate request and DB data
			if (preDiscountValueReq != null && preDiscountValueReq.compareTo(BigDecimal.ZERO) > 0
					&& regularDetails.getStoneCharges() != null && regularDetails.getStoneCharges().getValue() != null
					&& regularDetails.getStoneCharges().getValue().compareTo(BigDecimal.ZERO) > 0) {

				stoneChargeDiscValue = stoneChargeDiscountValueCalculation(regularDetails, valueDetailObject,
						preDiscountValueReq);
				if (Boolean.FALSE.equals(regularDetails.getStoneCharges().getIsPercent())
						&& stoneChargeDiscValue.compareTo(
								itemDetails.getPriceDetails().getStonePriceDetails().getPreDiscountValue()) > 0
						&& throwException) {
					throw new ServiceException("Stone charge discount is greater than the Stone charge value",
							ConfigConstants.ERR_CONFIG_157, Map.of(ConfigConstants.DISCOUNT_TYPE, "Stone charge"));
				}
			}

		}

		valueDetails.add(valueDetailObject);
		valueDetailObject.setComponent(DiscountComponentTypeEnum.STONE_CHARGE.toString());
		valueDetailObject.setDiscountValue(stoneChargeDiscValue);

		return stoneChargeDiscValue;
	}

	private BigDecimal stoneChargeDiscountValueCalculation(RegularCategoryDetails regularDetails,
			DiscountValueDetails valueDetailObject, BigDecimal preDiscountValueReq) {
		BigDecimal stoneChrgDiscPercent;
		BigDecimal stoneChargeDiscountValue;

		BigDecimal stoneChrgDiscValueFrmDB = regularDetails.getStoneCharges().getValue();

		// calculate discountValue on StoneCharge, if Percent is set
		if (Boolean.TRUE.equals(regularDetails.getStoneCharges().getIsPercent())) {

			valueDetailObject.setDiscountPercent(stoneChrgDiscValueFrmDB);
			stoneChargeDiscountValue = preDiscountValueReq.multiply(stoneChrgDiscValueFrmDB)
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE).divide(new BigDecimal(100))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

		}
		// calculate discountValue on StoneCharge, if value is set
		else {
			stoneChargeDiscountValue = stoneChrgDiscValueFrmDB;

			stoneChrgDiscPercent = stoneChrgDiscValueFrmDB.multiply(new BigDecimal(100))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)
					.divide(preDiscountValueReq, DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			valueDetailObject.setDiscountPercent(stoneChrgDiscPercent);

		}
		valueDetailObject.setIsDiscountPercentage(regularDetails.getStoneCharges().getIsPercent());
		return stoneChargeDiscountValue;
	}

	private BigDecimal calculateMetalChargeDiscountValue(RegularCategoryDetails regularDetails,
			DiscountItemDetailsReqDto itemDetails, List<DiscountValueDetails> valueDetails,
			BigDecimal metalChargeDiscountValue, boolean throwException) {

		DiscountValueDetails valueDetailObject = new DiscountValueDetails();

		if (itemDetails.getPriceDetails() != null && itemDetails.getPriceDetails().getMetalPriceDetails() != null
				&& regularDetails.getGoldCharges() != null && regularDetails.getGoldCharges().getValue() != null
				&& regularDetails.getGoldCharges().getValue().compareTo(BigDecimal.ZERO) > 0) {

			metalChargeDiscountValue = metalChargeDiscountValueCalculation(regularDetails, valueDetailObject,
					itemDetails.getPriceDetails().getMetalPriceDetails().getMetalPrices());

			if (Boolean.FALSE.equals(regularDetails.getGoldCharges().getIsPercent())
					&& metalChargeDiscountValue
							.compareTo(itemDetails.getPriceDetails().getMetalPriceDetails().getPreDiscountValue()) > 0
					&& throwException) {
				throw new ServiceException("Metal discount is greater than the Metal value",
						ConfigConstants.ERR_CONFIG_157, Map.of(ConfigConstants.DISCOUNT_TYPE, "Metal"));
			}
		}

		valueDetails.add(valueDetailObject);
		valueDetailObject.setComponent(DiscountComponentTypeEnum.METAL_CHARGE.toString());
		valueDetailObject.setDiscountValue(metalChargeDiscountValue);

		return metalChargeDiscountValue;
	}

	private BigDecimal metalChargeDiscountValueCalculation(RegularCategoryDetails regularDetails,
			DiscountValueDetails valueDetailObject, List<MetalPriceDto> metalPrices) {
		BigDecimal metalChrgDiscPercent = BigDecimal.ZERO;
		BigDecimal metalChargeDiscountValue = BigDecimal.ZERO;

		BigDecimal metalChrgDiscValueFrmDB = regularDetails.getGoldCharges().getValue();

		for (MetalPriceDto metalObject : metalPrices) {

			BigDecimal preDiscountValueReq = BigDecimal.ZERO;
			preDiscountValueReq = preDiscountValueReq.add(metalObject.getMetalValue());
			// calculate discountValue on MetalCharge, if Percent is set
			if (Boolean.TRUE.equals(regularDetails.getGoldCharges().getIsPercent())) {

				valueDetailObject.setDiscountPercent(metalChrgDiscValueFrmDB);
				metalChargeDiscountValue = metalChargeDiscountValue.add(preDiscountValueReq
						.multiply(metalChrgDiscValueFrmDB)
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)
						.divide(new BigDecimal(100), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));

			}
			// calculate discountValue on MetalCharge, if value is set
			else {
				metalChargeDiscountValue = metalChargeDiscountValue.add(metalChrgDiscValueFrmDB);

				metalChrgDiscPercent = metalChrgDiscPercent.add(metalChrgDiscValueFrmDB.multiply(new BigDecimal(100))
						.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)
						.divide(preDiscountValueReq, DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));

				valueDetailObject.setDiscountPercent(metalChrgDiscPercent);

			}
		}

		valueDetailObject.setIsDiscountPercentage(regularDetails.getGoldCharges().getIsPercent());
		return metalChargeDiscountValue;

	}

	private BigDecimal calculateMakingChargeDiscountValue(RegularCategoryDetails regularDetails,
			DiscountItemDetailsReqDto itemDetails, List<DiscountValueDetails> valueDetails,
			BigDecimal makingChrgeDiscValue, boolean throwException) {

		DiscountValueDetails valueDetailObject = new DiscountValueDetails();

		if (itemDetails.getPriceDetails() != null && itemDetails.getPriceDetails().getMakingChargeDetails() != null) {

			BigDecimal preDiscountValueReq = itemDetails.getPriceDetails().getMakingChargeDetails()
					.getPreDiscountValue();
			if (preDiscountValueReq != null && preDiscountValueReq.compareTo(BigDecimal.ZERO) > 0
					&& regularDetails.getMcCharges() != null && regularDetails.getMcCharges().getValue() != null
					&& regularDetails.getMcCharges().getValue().compareTo(BigDecimal.ZERO) > 0) {
				// making charge discount value calculation
				makingChrgeDiscValue = makingChargeDiscountValueCalculation(regularDetails, valueDetailObject,
						preDiscountValueReq);
				if (Boolean.FALSE.equals(regularDetails.getMcCharges().getIsPercent())
						&& makingChrgeDiscValue.compareTo(
								itemDetails.getPriceDetails().getMakingChargeDetails().getPreDiscountValue()) > 0
						&& throwException) {
					throw new ServiceException("Making charge discount is greater than the making charge value",
							ConfigConstants.ERR_CONFIG_157, Map.of(ConfigConstants.DISCOUNT_TYPE, "Making charge"));
				}

			}
		}

		valueDetails.add(valueDetailObject);
		valueDetailObject.setComponent(DiscountComponentTypeEnum.MAKING_CHARGE.toString());
		valueDetailObject.setDiscountValue(makingChrgeDiscValue);

		return makingChrgeDiscValue;

	}

	private BigDecimal makingChargeDiscountValueCalculation(RegularCategoryDetails regularDetails,
			DiscountValueDetails valueDetailObject, BigDecimal preDiscountValueReq) {
		BigDecimal makingChrgDiscPercent;
		BigDecimal makingChargeDiscountValue;

		BigDecimal makingChrgDiscValueFrmDB = regularDetails.getMcCharges().getValue();

		// calculate discountValue on MakingCharge, if Percent is set
		if (Boolean.TRUE.equals(regularDetails.getMcCharges().getIsPercent())) {

			valueDetailObject.setDiscountPercent(makingChrgDiscValueFrmDB);
			makingChargeDiscountValue = preDiscountValueReq.multiply(makingChrgDiscValueFrmDB)
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)
					.divide(new BigDecimal(100), DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

		}
		// calculate discountValue on MakingCharge, if value is set
		else {
			makingChargeDiscountValue = makingChrgDiscValueFrmDB;
			makingChrgDiscPercent = makingChrgDiscValueFrmDB.multiply(new BigDecimal(100))
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE)
					.divide(preDiscountValueReq, DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE);

			valueDetailObject.setDiscountPercent(makingChrgDiscPercent);

		}
		valueDetailObject.setIsDiscountPercentage(regularDetails.getMcCharges().getIsPercent());
		return makingChargeDiscountValue;
	}

	private Object getDiscountComponentBasedOnCondition(@Valid AbDiscount abValue, @Valid CoDiscount coValue,
			DiscountDetailsDao discountDetail, DiscountDetailsResponseDto responseObject, Date businessDate, DiscountDao discountPreviewDetails) {

		JsonData componentData;
		if (abValue != null) {
			componentData = getABComponent(abValue, discountDetail, responseObject, businessDate,discountPreviewDetails);
		} else {
			componentData = getCOComponent(coValue, discountDetail, responseObject,discountPreviewDetails);
		}
		return componentData.getData();
	}

	private JsonData getCOComponent(@Valid CoDiscount coValue, DiscountDetailsDao discountDetail,
			DiscountDetailsResponseDto responseObject, DiscountDao discountPreviewDetails) {
		JsonData coData;
		DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
		// if CO or Post CO is enabled in abCoObject, get COConfigDetails
		if (Boolean.TRUE.equals(coValue.getCo()) || Boolean.TRUE.equals(coValue.getPostCO())) {
			coData = MapperUtil.getObjectMapperInstance().convertValue(discountDetail.getCoConfigDetails(),
					JsonData.class);
			discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.CO.name());
		}

		else {
			// if preview is enabled in abCoObject, get PreviewConfigDetails
			if (discountPreviewDetails != null && Boolean.TRUE.equals(coValue.getPreview())) {
				coData = MapperUtil.getObjectMapperInstance().convertValue(discountDetail.getPreviewConfigDetails(),
						JsonData.class);
				discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.PREVIEW.name());
			} else {
				// get Regular Config Details -default
				coData = MapperUtil.getObjectMapperInstance().convertValue(discountDetail.getRegularConfigDetails(),
						JsonData.class);
				discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.REGULAR.name());
			}
		}
		responseObject.setDiscountConfigDetails(discountConfigDetails);
		return coData;
	}

	private JsonData getABComponent(@Valid AbDiscount abValue, DiscountDetailsDao discountDetail,
			DiscountDetailsResponseDto responseObject, Date businessDate, DiscountDao discountPreviewDetails) {
		JsonData abData;

		String discountId = discountDetail.getDiscount().getId();
		DiscountLocationMappingDao discountComponent = null;
		discountComponent = discountLocationMappingRepository.getEmpowermentLocationConfigDetails(discountId,
				CommonUtil.getLocationCode());
		// if AB or Post AB is enabled in abCoObject, get ABConfigDetails
		DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
		if (discountPreviewDetails != null && Boolean.TRUE
				.equals(abValue.getPreview() && ((businessDate.after(discountComponent.getPreviewStartDate())
						&& businessDate.before(discountComponent.getPreviewEndDate()))
						|| businessDate.equals(discountComponent.getPreviewEndDate())
						|| businessDate.equals(discountComponent.getPreviewStartDate())))) {
			abData = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(discountDetail.getPreviewConfigDetails()), JsonData.class);
			discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.PREVIEW.name());
		} else {

			if (Boolean.TRUE.equals(abValue.getAb()) || Boolean.TRUE.equals(abValue.getPostAB())) {
				abData = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(discountDetail.getAbConfigDetails()), JsonData.class);
				discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.AB.name());
			}
			// get Regular Config Details -default
			else {
				abData = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(discountDetail.getRegularConfigDetails()), JsonData.class);
				discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.REGULAR.name());
			}
		}
		responseObject.setDiscountConfigDetails(discountConfigDetails);
		return abData;
	}

	private DiscountDetailsDao getDiscountDetails(String discountId, String productGroupCode) {

		return discountDetailsRepository.getDiscountComponent(discountId, productGroupCode);
	}

	@Override
	public DiscountItemDetailsListResponseDto calculateDiscountValueforListOfItems(
			DiscountItemDetailsListRequestDto discountItemListDto) {

		String locationCode = CommonUtil.getStoreCode();
		// temporary removing time component from date part
		discountItemListDto.setBusinessDate(CalendarUtils.getStartOfDay(discountItemListDto.getBusinessDate()));
		if (discountItemListDto.getCustomerDetails() != null
				&& discountItemListDto.getCustomerDetails().getEnrollmentDate() != null) {
			discountItemListDto.getCustomerDetails().setEnrollmentDate(
					CalendarUtils.getStartOfDay(discountItemListDto.getCustomerDetails().getEnrollmentDate()));
		}

		// creating map wrt itemCode and entire request object where key is itemcode +
		// lotnumber
		Map<String, DiscountItemDetailsReqDto> requestMap = new HashMap<>();
		for (DiscountItemDetailsReqDto reqDto : discountItemListDto.getItemDetails()) {
			// for coins, lot number might not be there, hence concatenate inventory weight
			// in such case
			if (ProductGroupCodeEnum.getCoinList().contains(reqDto.getProductGroupCode())
					&& StringUtils.isEmpty(reqDto.getLotNumber())) {
				requestMap.put(reqDto.getItemCode().concat(reqDto.getInventoryWeight().toString()), reqDto);
			} else {
				requestMap.put(reqDto.getItemCode().concat(reqDto.getLotNumber()), reqDto);
			}
		}

		// validating discountIds
		List<DiscountDao> validDiscountIds = discountRepository.validateDiscountIds(
				discountItemListDto.getBusinessDate(), locationCode, discountItemListDto.getDiscountIds());

		// validating empowerment discount
		validDiscountIds.addAll(
				discountRepository.validateEmpowermentDiscountIds(locationCode, discountItemListDto.getDiscountIds(),DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name()));

		// validating Rivaah GHS discounts
		if (discountItemListDto.getRivaahGhsDetails() != null
				&& !CollectionUtil.isEmpty(discountItemListDto.getRivaahGhsDetails().getRivaahGhs())) {
			validDiscountIds.addAll(discountRepository.validateRivaahGhsDiscountIds(locationCode,
					discountItemListDto.getDiscountIds(), discountItemListDto.getRivaahGhsDetails().getRivaahGhs()
							.stream().map(RivaahGhsDiscountDto::getSchemeCode).collect(Collectors.toList())));
		}

		Map<String, DiscountDetailsResponseDto> responseMap = new HashMap<>();
		Map<String, DiscountDao> itemDiscountMap = new HashMap<>();

		List<DiscountItemListResponseDto> validDiscountItemList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(validDiscountIds)) {

			for (DiscountDao discountDao : validDiscountIds) {
				// for every discountId iterate through list of items
				discountItemListDto.getItemDetails().forEach(itemDetail -> calculateDiscountForItems(discountDao,
						discountItemListDto, itemDetail, itemDiscountMap, responseMap));
			}

			responseMap.forEach((itemCodeLotNumber, discountDetailObject) -> {
				// creating response object for every item detail
				DiscountItemDetailsReqDto itemRequest = requestMap.get(itemCodeLotNumber);

				DiscountItemListResponseDto itemResponseDto = new DiscountItemListResponseDto();
				MapperUtil.beanMapping(discountDetailObject, itemResponseDto);
				itemResponseDto.setItemCode(itemRequest.getItemCode());
				itemResponseDto.setItemId(itemRequest.getItemId());
				itemResponseDto.setLotNumber(itemRequest.getLotNumber());
				validDiscountItemList.add(itemResponseDto);
			});

		}
		// throw exception

		else {
			throw new ServiceException(ConfigConstants.NO_ACTIVE_DISCOUNTS_AVAILABLE, ConfigConstants.ERR_CONFIG_141);
		}
		// checking if any club discount is eligible for the items
		DiscountItemDetailsListResponseDto responseObject = new DiscountItemDetailsListResponseDto();
		if (!CollectionUtils.isEmpty(discountItemListDto.getClubDiscountDetails())) {
			responseObject.setItemDiscountDetails(checkClubDiscountForItems(
					discountItemListDto.getClubDiscountDetails(), validDiscountItemList, discountItemListDto));
		} else {
			responseObject.setItemDiscountDetails(validDiscountItemList);
		}

		return responseObject;
	}

	private void calculateDiscountForItems(DiscountDao discountDao,
			DiscountItemDetailsListRequestDto discountItemListDto, DiscountItemDetailsReqDto itemDetail,
			Map<String, DiscountDao> itemDiscountMap, Map<String, DiscountDetailsResponseDto> responseMap) {

		DiscountDetailsResponseDto responseObject = new DiscountDetailsResponseDto();
		// validating request details for every item and discountId
		RegularCategoryDetails regularDetails = calculateDiscountForItems(discountDao,
				discountItemListDto.getBusinessDate(), discountItemListDto, responseObject, itemDetail, true);
		if (regularDetails != null) {
			DiscountDetailsResponseDto finalDiscountValue = calculateDiscountForItem(regularDetails, discountDao,
					discountItemListDto.getBusinessDate(), responseObject, itemDetail);
			// if discount exceeds the item value, then it is not considered
			if (finalDiscountValue != null) {
				// setting config details ab and co
				if (discountItemListDto.getTransactionDetails().getTransactionType().equalsIgnoreCase("AB")
						|| discountItemListDto.getTransactionDetails().getTransactionType().equalsIgnoreCase("CO")) {
					finalDiscountValue.getDiscountConfigDetails()
							.setAppliedDiscountMaster(discountUtilService.mapDiscountDto(discountDao));
					finalDiscountValue.getDiscountConfigDetails().setAppliedDiscountComponent(regularDetails);
					finalDiscountValue.getDiscountConfigDetails().setRegularDiscountComponent(
							responseObject.getDiscountConfigDetails().getRegularDiscountComponent());
					finalDiscountValue.getDiscountConfigDetails().setAppliedDiscountComponentType(
							responseObject.getDiscountConfigDetails().getAppliedDiscountComponentType());
					finalDiscountValue.setDiscountConfigDetails(
							setConfigForAbCo(finalDiscountValue.getDiscountConfigDetails(), discountDao.getId()));
				}

				// for coins, lot number might not be there, hence concatenate inventory weight
				// in such case
				String key;
				if (ProductGroupCodeEnum.getCoinList().contains(itemDetail.getProductGroupCode())
						&& StringUtils.isEmpty(itemDetail.getLotNumber())) {
					key = itemDetail.getItemCode().concat(itemDetail.getInventoryWeight().toString());
				} else {
					key = itemDetail.getItemCode().concat(itemDetail.getLotNumber());
				}

				itemDiscountMap.put(key, discountDao);

				// checking if the discountValue is already calculated
				if (responseMap.containsKey(key)) {
					BigDecimal existingDiscountValue = responseMap.get(key).getDiscountValue();

					// comparing discount values for the item
					if (finalDiscountValue.getDiscountValue().compareTo(existingDiscountValue) > 0) {
						responseMap.put(key, finalDiscountValue);
					}
				} else {
					// calculating discountValue for the item for first time
					responseMap.put(key, finalDiscountValue);
				}
			}
		}
	}

	private RegularCategoryDetails calculateDiscountForItems(DiscountDao discountDao, Date businessDate,
			DiscountItemDetailsListRequestDto discountItemListDto, DiscountDetailsResponseDto responseObject,
			DiscountItemDetailsReqDto itemDetail, boolean throwError) {

		DiscountCustDetails customerDetails = discountItemListDto.getCustomerDetails();
		TransactionDetailsDto transactionDetails = discountItemListDto.getTransactionDetails();
		RivaahGhsDiscountDetailsDto rivaalGhsDetails = discountItemListDto.getRivaahGhsDetails();
		// validating request details for every item and discountId
		Object objectData = null;
		if (discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())) {
			objectData = validateAndGetEmpowermentConfigDetails(discountDao, businessDate, itemDetail);
			DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
			discountConfigDetails
					.setRegularDiscountComponent(MapperUtil.mapObjToClass(objectData, RegularCategoryDetails.class));
			discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.REGULAR.name());
			responseObject.setDiscountConfigDetails(discountConfigDetails);
		} else if (discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name())) {

			RegularCategoryDetailsExtendedForRivaahGhs details = validateAndGetRivaahConfigDetails(discountDao,
					businessDate, itemDetail, rivaalGhsDetails);
			objectData = MapperUtil.mapObjToClass(details, RegularCategoryDetails.class);

			DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
			discountConfigDetails
					.setRegularDiscountComponent(MapperUtil.mapObjToClass(objectData, RegularCategoryDetails.class));
			discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.REGULAR.name());
			if (details != null) {
				RivaahGhsDiscountDto selectedRivaahDiscount = getSelectedRivaahDiscount(rivaalGhsDetails,
						details.getProductType());
				responseObject.setRivaahGhsDetails(selectedRivaahDiscount);
				if (selectedRivaahDiscount != null) {
					GhsExcludeProductGroupDetailsDto ghsBasicDetails = new GhsExcludeProductGroupDetailsDto();
					ghsBasicDetails.setAccountNo(selectedRivaahDiscount.getAccountNo());
					ghsBasicDetails
							.setMakingChargeDiscountPercent(selectedRivaahDiscount.getMakingChargeDiscountPercent());
					ghsBasicDetails.setUcpDiscountPercent(selectedRivaahDiscount.getUcpDiscountPercent());
					ghsBasicDetails.setBonus(BigDecimal.ZERO);
					ghsBasicDetails.setSchemeCode(selectedRivaahDiscount.getSchemeCode());
					ghsBasicDetails.setSchemeType(GhsSchemeTypeEnum.RIVAAH_SCHEME.name());
					ghsBasicDetails.setPaymentCode(selectedRivaahDiscount.getPaymentCode());
					ghsBasicDetails.setGhsExcludeProductGroups(selectedRivaahDiscount.getExcludeProductGroup());
					discountConfigDetails.setGhsExcludeProductGroupDetails(ghsBasicDetails);
				}
			}
			responseObject.setDiscountConfigDetails(discountConfigDetails);
		}else {
			objectData = validateRequestAndGetDiscountComponent(discountDao, businessDate, itemDetail, customerDetails,
					transactionDetails, responseObject, throwError, null);
		}
		return MapperUtil.mapObjToClass(objectData, RegularCategoryDetails.class);
	}

	private RivaahGhsDiscountDto getSelectedRivaahDiscount(RivaahGhsDiscountDetailsDto rivaalGhsDetails,
			String productDiscountType) {

		RivaahGhsDiscountDto selectedRivaahDiscount = null;

		if (rivaalGhsDetails.getRivaahGhs().size() == 1) {
			selectedRivaahDiscount = rivaalGhsDetails.getRivaahGhs().get(0);
		} else {
			for (RivaahGhsDiscountDto rivaalGhs : rivaalGhsDetails.getRivaahGhs()) {
				if (MC.equals(productDiscountType) && BooleanUtils.isTrue(rivaalGhs.getIsMcDiscountUsed())) {
					return rivaalGhs;
				} else if (UCP.equals(productDiscountType) && BooleanUtils.isTrue(rivaalGhs.getIsUcpdiscountUsed())) {
					return rivaalGhs;
				}
			}
		}

		return selectedRivaahDiscount;
	}

	private DiscountDetailsResponseDto calculateDiscountForItem(RegularCategoryDetails regularDetails,
			DiscountDao discountDao, Date businessDate, DiscountDetailsResponseDto responseObject,
			DiscountItemDetailsReqDto itemDetail) {
		// calculate discountValue for every item
		SlabConfigDetails slabConfigDetails = new SlabConfigDetails();
		return calculateDiscountValue(discountDao, regularDetails, itemDetail, businessDate, slabConfigDetails, false,
				responseObject);
	}

	private List<DiscountItemListResponseDto> checkClubDiscountForItems(
			List<DiscountBillLevelClubDetailsDto> clubDiscountDetails,
			List<DiscountItemListResponseDto> validDiscountItemList,
			DiscountItemDetailsListRequestDto discountItemListDto) {
		List<DiscountItemListResponseDto> responseList = new ArrayList<>();
		for (DiscountItemListResponseDto discountItem : validDiscountItemList) {
			Map<String, List<DiscountDetailsResponseDto>> clubDiscountMap = new HashMap<>();
			for (DiscountBillLevelClubDetailsDto clubDiscount : clubDiscountDetails) {
				if (checkIfItemIsEligibleForClubDiscount(clubDiscount.getItemDetails(), discountItem.getItemId())) {
					List<DiscountDetailsResponseDto> discounts = new ArrayList<>();
					for (DiscountBillLevelItemDetailsDto clubDiscountItem : clubDiscount.getDiscountDetails()) {
						DiscountDao discount = discountRepository
								.findOneByDiscountCode(clubDiscountItem.getDiscountCode());
						Optional<DiscountItemDetailsReqDto> itemDetail = discountItemListDto.getItemDetails().stream()
								.filter(di -> di.getItemId().equalsIgnoreCase(discountItem.getItemId())).findAny();
						if (itemDetail.isPresent()) {
							DiscountDetailsResponseDto responseObject = new DiscountDetailsResponseDto();
							// checking if the club discount is employee, tata, empowerment, tsss and
							// checking if they are eligible
							// club with Rivaah GHS only - not eligible (hence ignored in condition)

							if (couponCodeCheck(discount.getDiscountType()) && !checkBillLevelDiscount(
									discount.getDiscountType(), discountItemListDto.getEmployeeDetails(),
									discountItemListDto.getTataEmployeeDetails(), discountItemListDto.getTsssDetails(),
									discountItemListDto.getEmpowermentDetails(), discount,
									discountItemListDto.getBusinessDate(), discountItemListDto.getRivaahGhsDetails(),
									discountItemListDto.getEncircleDiscount(), itemDetail.get())) {
								discounts = null;
								if (CollectionUtil.isEmpty(responseList) || !responseList.contains(discountItem)) {
									responseList.add(discountItem);
								}
								break;
							}

							RegularCategoryDetails regularDetails = calculateDiscountForItems(discount,
									discountItemListDto.getBusinessDate(), discountItemListDto, responseObject,
									itemDetail.get(), false);
							if (regularDetails != null) {
								DiscountDetailsResponseDto finalDiscountValue = calculateDiscountForItem(regularDetails,
										discount, discountItemListDto.getBusinessDate(), responseObject,
										itemDetail.get());
								discounts.add(finalDiscountValue);
								// setting config details ab and co
								if (discountItemListDto.getTransactionDetails().getTransactionType()
										.equalsIgnoreCase("AB")
										|| discountItemListDto.getTransactionDetails().getTransactionType()
												.equalsIgnoreCase("CO")) {
									finalDiscountValue.getDiscountConfigDetails()
											.setAppliedDiscountMaster(discountUtilService.mapDiscountDto(discount));
									finalDiscountValue.getDiscountConfigDetails()
											.setAppliedDiscountComponent(regularDetails);
									finalDiscountValue.getDiscountConfigDetails().setRegularDiscountComponent(
											responseObject.getDiscountConfigDetails().getRegularDiscountComponent());
									finalDiscountValue.getDiscountConfigDetails()
											.setAppliedDiscountComponentType(responseObject.getDiscountConfigDetails()
													.getAppliedDiscountComponentType());
									finalDiscountValue.setDiscountConfigDetails(setConfigForAbCo(
											finalDiscountValue.getDiscountConfigDetails(), discount.getId()));

								}
							}
						}
					}
					if (!CollectionUtils.isEmpty(discounts)) {
						clubDiscountMap.put(clubDiscount.getClubbingId(), discounts);
					}
				} else {
					if (CollectionUtil.isEmpty(responseList) || !responseList.contains(discountItem))
						responseList.add(discountItem);
				}

			}
			// checking the highest club discount for the item
			if (!CollectionUtils.isEmpty(clubDiscountMap)) {
				List<DiscountDetailsResponseDto> discounts = null;
				BigDecimal finalDiscountValue = new BigDecimal("0");
				String clubDiscountId = null;
				for (Map.Entry<String, List<DiscountDetailsResponseDto>> entry : clubDiscountMap.entrySet()) {
					BigDecimal discountValue = entry.getValue().stream()
							.map(DiscountDetailsResponseDto::getDiscountValue).reduce(BigDecimal.ZERO, BigDecimal::add);
					if (discountValue.compareTo(finalDiscountValue) > 0) {
						clubDiscountId = entry.getKey();
						finalDiscountValue = discountValue;
						discounts = entry.getValue();
					}
				}

				// checking if club discount is greater than individual discount
				if (finalDiscountValue.compareTo(discountItem.getDiscountValue()) > 0) {
					// if 'responseList' already contains 'discountItem', then remove it
					if (!CollectionUtil.isEmpty(responseList)) {
						responseList.remove(discountItem);
					}

					for (DiscountDetailsResponseDto discountDetail : discounts) {
						DiscountItemListResponseDto itemResponseDto = new DiscountItemListResponseDto();
						MapperUtil.beanMapping(discountDetail, itemResponseDto);
						itemResponseDto.setItemCode(discountItem.getItemCode());
						itemResponseDto.setItemId(discountItem.getItemId());
						itemResponseDto.setLotNumber(discountItem.getLotNumber());
						itemResponseDto.setClubDiscountId(clubDiscountId);
						responseList.add(itemResponseDto);
					}
				} else {
					if (CollectionUtil.isEmpty(responseList) || !responseList.contains(discountItem))
						responseList.add(discountItem);
				}

			}
		}
		return responseList;
	}

	private boolean couponCodeCheck(String discountType) {
		return discountType.equalsIgnoreCase(DiscountTypeEnum.EMPLOYEE_DISCOUNT.name())
				|| discountType.equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())
				|| discountType.equalsIgnoreCase(DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.name())
				|| discountType.equalsIgnoreCase(DiscountTypeEnum.TSSS_DISCOUNT.name())
				|| discountType.equalsIgnoreCase(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name())
				|| List.of(DiscountTypeEnum.ULP_DISCOUNT_ANNIVERSARY.name(),
						DiscountTypeEnum.ULP_DISCOUNT_BIRTHDAY.name(),
						DiscountTypeEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY.name()).contains(discountType);
	}

	private boolean checkBillLevelDiscount(String discountType, EmployeeDiscountDetailsDto employeeDetails,
			TataEmployeeDiscountDetailsDto tataEmployeeDetails, TSSSDiscountDetailsDto tsssDetails,
			EmpowermentDetailsDto empowermentDetails, DiscountDao discount, Date businessDate,
			RivaahGhsDiscountDetailsDto rivaahGhsDetails, EncircleDiscountDto encircleDiscountDto,
			DiscountItemDetailsReqDto itemsDetailsReqDto) {

		boolean valid = false;
		List<DiscountDao> validDiscountList = new ArrayList<>();
		try {
			if (discountType.equalsIgnoreCase(DiscountTypeEnum.EMPLOYEE_DISCOUNT.name()) && employeeDetails != null) {
				// validating coupons from QCGC
				validateEmployeeCouponCode(Arrays.asList(discount), validDiscountList,
						employeeDetails.getCouponDetails());
				valid = true;

			} else if (discountType.equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())
					&& empowermentDetails != null && empowermentDetails.getApplyEmpowermentDiscount()) {
				validateEmpowermentDetailsAgainstDiscountIds(Arrays.asList(discount), validDiscountList, businessDate);
				valid = true;

			} else if (discountType.equalsIgnoreCase(DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.name())
					&& tataEmployeeDetails != null) {
				validateTataEmployeeDetailsAgainstDiscountIds(Arrays.asList(discount), validDiscountList,
						tataEmployeeDetails);
				valid = true;
			} else if (discountType.equalsIgnoreCase(DiscountTypeEnum.TSSS_DISCOUNT.name()) && tsssDetails != null) {
				List<DiscountDao> validTSSSDiscountList = new ArrayList<>();
				getTssDiscountIds(tsssDetails, validTSSSDiscountList);
				if (!validTSSSDiscountList.isEmpty()) {
					valid = true;
				}
			} else if (discountType.equalsIgnoreCase(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name())
					&& rivaahGhsDetails != null && !CollectionUtil.isEmpty(rivaahGhsDetails.getRivaahGhs())) {
				validateRivaahGhsDetailsAgainstDiscountIds(Arrays.asList(discount), validDiscountList, rivaahGhsDetails
						.getRivaahGhs().stream().map(RivaahGhsDiscountDto::getSchemeCode).collect(Collectors.toList()));
				if (!validDiscountList.isEmpty()) {
					valid = true;
				}
			} else if (encircleDiscountDto != null && discountType.equals(encircleDiscountDto.getDiscountType())) {

				DiscountItemDetailsDto itemDetailsDto = MapperUtil.mapObjToClass(itemsDetailsReqDto,
						DiscountItemDetailsDto.class);
				if (itemsDetailsReqDto.getPriceDetails() != null) {
					itemDetailsDto.setIsUcp(itemsDetailsReqDto.getPriceDetails().getIsUcp());
					itemDetailsDto.setNetWeight(itemsDetailsReqDto.getPriceDetails().getNetWeight());
					if (itemsDetailsReqDto.getPriceDetails().getMakingChargeDetails() != null) {
						itemDetailsDto.setMakingChargePerGram(
								itemsDetailsReqDto.getPriceDetails().getMakingChargeDetails().getMakingChargePgram());
						itemDetailsDto.setComplexityPercent(
								itemsDetailsReqDto.getPriceDetails().getMakingChargeDetails().getWastagePct());
					}
				}
				validDiscountList = getAdditionalDiscounts(encircleDiscountDto.getDiscountType(), null, businessDate,
						itemDetailsDto);
				if (!validDiscountList.isEmpty()) {
					valid = true;
				}
			}
		} catch (ServiceException ex) {
			log.debug("Invalid employee/tata/tsss/empowerment/rivaah GHS/Encircle discount");
		}
		return valid;
	}

	private boolean checkIfItemIsEligibleForClubDiscount(List<DiscountItemsDto> itemDetails, String itemId) {
		long count = itemDetails.stream().filter(item -> item.getItemId().equalsIgnoreCase(itemId)).count();
		return count > 0;
	}

	@Override
	public EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscounts(
			EligibleDiscountItemsRequestDto discountItemListDto, String discountType) {

		// set start of business date
		discountItemListDto.setBusinessDate(CalendarUtils.getStartOfDay(discountItemListDto.getBusinessDate()));
		// validate discountId
		List<DiscountDao> validDiscountIds = discountRepository.validateDiscountIds(
				CalendarUtils.getStartOfDay(discountItemListDto.getBusinessDate()), CommonUtil.getLocationCode(),
				discountItemListDto.getDiscountIds());

		List<EligibleDiscountItemDetailsDto> eligibleItemDiscountDetailsList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(validDiscountIds)) {

			if (discountItemListDto.getItemDetails() == null) {
				throw new ServiceException("Invalid Request", "ERR");
			}

			// validate Request wrt valid discountIds
			Map<DiscountDao, List<DiscountItemsDto>> responseMap = discountUtilService.validateDiscountIdWithRequest(
					validDiscountIds, discountItemListDto.getItemDetails(), discountItemListDto.getBusinessDate(),
					discountType);

			if (CollectionUtils.isEmpty(responseMap)) {

				throw new ServiceException(ConfigConstants.DISCOUNTS_NOT_AVAILABLE_ON_ITEMS,
						ConfigConstants.ERR_CONFIG_140);
			} else {
				responseMap.forEach((discountObject, itemDetailList) -> {
					EligibleDiscountItemDetailsDto itemDetailResponseObject = new EligibleDiscountItemDetailsDto();
					itemDetailResponseObject.setItemDetails(responseMap.get(discountObject));
					itemDetailResponseObject.setDiscountConfigDetails(discountUtilService.setDiscountConfigDetails(
							discountObject, new DiscountDetailsBaseDto(), discountItemListDto.getBusinessDate(), null));
					eligibleItemDiscountDetailsList.add(itemDetailResponseObject);

				});
			}

		} else {

			throw new ServiceException(ConfigConstants.INACTIVE_DISCOUNTS, ConfigConstants.ERR_CONFIG_139);
		}

		EligibleDiscountItemsResponseDto responseItemDto = new EligibleDiscountItemsResponseDto();
		responseItemDto.setEligibleItemDetails(eligibleItemDiscountDetailsList);

		return responseItemDto;
	}

	@Override
	public DiscountDetailsBaseDto getDiscountConfigDetails(String discountId) {

		Date businessDate = CalendarUtils
				.getStartOfDay(salesService.getBusinessDay(CommonUtil.getLocationCode()).getBusinessDate());

		DiscountDao discountDao = discountRepository.findById(discountId)
				.orElseThrow(() -> new ServiceException(
						ConfigConstants.NO_DISCOUNT_DETAILS_FOUND_FOR_THE_REQUESTED_DISCOUNTID,
						ConfigConstants.ERR_CONFIG_033));

		DiscountDetailsBaseDto responseBaseDto = new DiscountDetailsBaseDto();
		if (discountDao != null) {
			if (discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.SLAB_BASED_DISCOUNT.toString())) {
				SlabConfigDetails slabConfigDetails = new SlabConfigDetails();
				// getting discount details for this discount and since it will have common
				// discount category, eligibility details and is single value, returning the
				// first data
				List<DiscountDetailsDao> discountDetails = discountDetailsRepository
						.getSlabDetails(Arrays.asList(discountDao.getId()));
				if (!CollectionUtils.isEmpty(discountDetails)) {
					setSlabConfigDetailsForResponse(slabConfigDetails, discountDetails.get(0).getDiscountCategory(),
							discountDetails.get(0).getEligibility(), discountDetails.get(0).getIsSingle());
					discountUtilService.setDiscountConfigDetails(discountDao, responseBaseDto, businessDate,
							slabConfigDetails);
				}
			} else {
				discountUtilService.setDiscountConfigDetails(discountDao, responseBaseDto, businessDate, null);
			}
		}
		return responseBaseDto;
	}

	@Override
	public ExchangeOfferResponseDto getExchangeOrCoinOfferDiscountDetails(String discountType, String transactionType,
			ExchangeOfferRequestDto exchangeOfferRequestDto) {

		List<DiscountDao> validDiscountIds = new ArrayList<>();
		ExchangeOfferResponseDto offerResponseDto = new ExchangeOfferResponseDto();

		// for coin Offer discounts
		if (exchangeOfferRequestDto.getTepDate() != null && exchangeOfferRequestDto.getCmDate() != null) {

			List<DiscountDao> discountIdList = discountRepository
					.getDiscountsBasedOnDiscountTypeAndLocationCode(discountType, CommonUtil.getLocationCode());

			if (!CollectionUtils.isEmpty(discountIdList)) {

				// getting coin offer discounts
				List<DiscountDao> validCoinOfferDiscountIds = getValidCoinOfferDiscounts(discountIdList,
						exchangeOfferRequestDto);

				if (!CollectionUtils.isEmpty(validCoinOfferDiscountIds)) {
					validDiscountIds.addAll(validCoinOfferDiscountIds);
				}

			}
		}

		// for Karatage Offer discounts
		if (DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name().equals(discountType)
				&& exchangeOfferRequestDto.getTepDate() != null) {
			List<DiscountDao> discountIdList;
			if (transactionType.equalsIgnoreCase("TEP")) {
				// for TEP
				discountIdList = discountRepository.getDiscountsBasedOnDiscountTypeAndLocationCodeAndProductGroupCode(
						discountType, exchangeOfferRequestDto.getTepDate(), CommonUtil.getLocationCode(),
						exchangeOfferRequestDto.getProductGroupCode(), exchangeOfferRequestDto.getKaratage());
			} else {
				// for GEP
				discountIdList = discountRepository.getDiscountsBasedOnDiscountTypeAndLocationCodeAndKaratage(
						discountType, exchangeOfferRequestDto.getTepDate(), CommonUtil.getStoreCode(),
						exchangeOfferRequestDto.getKaratage());
			}

			if (!CollectionUtils.isEmpty(discountIdList)) {
				validDiscountIds.addAll(discountIdList);
			}
		}

		List<DiscountDetailsBaseDto> baseResponseList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(validDiscountIds)) {
			validDiscountIds.forEach(discountDao -> {
				DiscountDetailsBaseDto responseBaseDto = new DiscountDetailsBaseDto();

				baseResponseList.add(discountUtilService.setDiscountConfigDetails(discountDao, responseBaseDto,
						exchangeOfferRequestDto.getTepDate(), null));

			});

		}
		offerResponseDto.setDiscountDetails(baseResponseList);
		return offerResponseDto;
	}

	private List<DiscountDao> getValidCoinOfferDiscounts(List<DiscountDao> discountIdList,
			ExchangeOfferRequestDto exchangeOfferRequestDto) {

		List<DiscountDao> validCoinOfferDiscountIds = new ArrayList<>();

		discountIdList.forEach(discountDao -> {

			// set BasicCriteria object
			JsonData basicCriteriaJson = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountDao.getBasicCriteria()), JsonData.class);

			BaseBasicCriteriaDetails basicCriteriaDetails = MapperUtil.mapObjToClass(basicCriteriaJson.getData(),
					BaseBasicCriteriaDetails.class);

			if (basicCriteriaDetails != null && basicCriteriaDetails.getTepPeriodStartDate() != null
					&& basicCriteriaDetails.getTepPeriodEndDate() != null
					&& basicCriteriaDetails.getCoinPurchaseStartDate() != null
					&& basicCriteriaDetails.getCoinPurchaseEndDate() != null
					&& (exchangeOfferRequestDto.getTepDate()
							.compareTo(basicCriteriaDetails.getTepPeriodStartDate()) >= 0
							&& exchangeOfferRequestDto.getTepDate()
									.compareTo(basicCriteriaDetails.getTepPeriodEndDate()) <= 0)
					&& (exchangeOfferRequestDto.getCmDate()
							.compareTo(basicCriteriaDetails.getCoinPurchaseStartDate()) >= 0
							&& exchangeOfferRequestDto.getCmDate()
									.compareTo(basicCriteriaDetails.getCoinPurchaseEndDate()) <= 0)) {
				validCoinOfferDiscountIds.add(discountDao);
			}

		});

		return validCoinOfferDiscountIds;
	}

	@Override
	public SlabBasedDiscountDetailsResponseDto calculateDiscountValueForSlabBasedDiscounts(String discountId,
			SlabBasedDiscountRequestDto slabBasedDiscountRequest) {
		// validate discountId
		DiscountDao validDiscountObj = validateDiscountDao(discountId);
		slabBasedDiscountRequest
				.setBusinessDate(CalendarUtils.getStartOfDay(slabBasedDiscountRequest.getBusinessDate()));
		Date businessDate = slabBasedDiscountRequest.getBusinessDate();
		slabBasedDiscountRequest.setBusinessDate(businessDate);
		// removing time part for customer enrollment date
		if (slabBasedDiscountRequest.getCustomerDetails() != null
				&& slabBasedDiscountRequest.getCustomerDetails().getEnrollmentDate() != null) {
			slabBasedDiscountRequest.getCustomerDetails().setEnrollmentDate(
					CalendarUtils.getStartOfDay(slabBasedDiscountRequest.getCustomerDetails().getEnrollmentDate()));

		}
		// validate each item details from request for the given discountId
		List<DiscountDetailsDao> validDiscountDetailList = null;
		List<DiscountItemDetailsReqDto> validDiscountItemDetailsReq = new ArrayList<>();
		List<String> discountLinkIds = linkingDiscountsRepositoryExt.findAllBySrcDiscountId(validDiscountObj.getId());
		for (DiscountItemDetailsReqDto discountItemDetailsReqDto : slabBasedDiscountRequest.getItemDetails()) {

			List<DiscountDetailsDao> discountDetailList = discountUtilService.validateItemRequestDetails(
					validDiscountObj.getId(), businessDate, discountItemDetailsReqDto, false, false, null, null);
			if (!CollectionUtils.isEmpty(discountDetailList)
					&& (CollectionUtils.isEmpty(discountItemDetailsReqDto.getDiscountTypeAndIdAppliedOnItem())
							|| (validDiscountObj.getId()
									.equals(discountItemDetailsReqDto
											.getDiscountTypeAndIdAppliedOnItem()
											.get(validDiscountObj.getDiscountType())))
							|| (!CollectionUtil.isEmpty(discountLinkIds)
									&& discountItemDetailsReqDto.getDiscountTypeAndIdAppliedOnItem()
											.containsKey(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name())
									&& discountLinkIds
											.contains(discountItemDetailsReqDto.getDiscountTypeAndIdAppliedOnItem()
													.get(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name()))))) {
				validDiscountItemDetailsReq.add(discountItemDetailsReqDto);
				validDiscountDetailList = discountDetailList;
			}
		}
		if (CollectionUtils.isEmpty(validDiscountDetailList)) {
			if (BooleanUtils.isTrue(slabBasedDiscountRequest.getThrowException())) {
				throw new ServiceException(ConfigConstants.DISCOUT_COMPONENT_NOT_CONFIGURED,
						ConfigConstants.ERR_CONFIG_145, Map.of(DISCOUNT_ID, discountId));
			}
			return new SlabBasedDiscountDetailsResponseDto();
		}

		DiscountDetailsDao discountDetailObject = validDiscountDetailList.get(0);
		String discountCategory = discountDetailObject.getDiscountCategory();

		List<SlabItemDetailsDto> slabItemResponseList = null;
		SlabBasedDiscountDetailsResponseDto slabBasedDiscountEngineResponseDto = new SlabBasedDiscountDetailsResponseDto();

		if (DiscountCategoryEnum.WEIGHT_BASED.toString().equalsIgnoreCase(discountCategory)) {
			slabItemResponseList = validateWeightBasedSlab(discountDetailObject, validDiscountItemDetailsReq,
					validDiscountDetailList, validDiscountObj, slabBasedDiscountRequest,
					slabBasedDiscountEngineResponseDto);
		} else if (DiscountCategoryEnum.VALUE_BASED.toString().equalsIgnoreCase(discountCategory)) {
			slabItemResponseList = validateValueBasedSlab(discountDetailObject, validDiscountItemDetailsReq,
					validDiscountDetailList, validDiscountObj, slabBasedDiscountRequest,
					slabBasedDiscountEngineResponseDto);
		}

		if (CollectionUtils.isEmpty(slabItemResponseList)
				&& !BooleanUtils.isTrue(slabBasedDiscountRequest.getThrowException())) {

			return new SlabBasedDiscountDetailsResponseDto();
		}

		// setting more details necessary for AB/CO to CM scenario
		if (TransactionTypeEnum.AB.name()
				.equalsIgnoreCase(slabBasedDiscountRequest.getTransactionDetails().getTransactionType())
				|| TransactionTypeEnum.CO.name()
						.equalsIgnoreCase(slabBasedDiscountRequest.getTransactionDetails().getTransactionType())) {
			SlabDetails slabDetails = new SlabDetails();
			slabDetails.setSlabConfigs(setSlabDetails(validDiscountDetailList));
			DiscountDetailsBaseDto discountConfigDetails = slabBasedDiscountEngineResponseDto
					.getDiscountConfigDetails();
			discountConfigDetails.setSlabDiscountComponents(slabDetails);
			discountConfigDetails.setAppliedDiscountComponent(discountConfigDetails.getRegularDiscountComponent());
			slabBasedDiscountEngineResponseDto
					.setDiscountConfigDetails(setConfigForAbCo(discountConfigDetails, discountId));
		}

		slabBasedDiscountEngineResponseDto.setItemDiscountDetails(slabItemResponseList);
		return slabBasedDiscountEngineResponseDto;
	}

	private List<SlabItemDetailsDto> validateWeightBasedSlab(DiscountDetailsDao discountDetailObject,
			List<DiscountItemDetailsReqDto> validDiscountItemDetailsReq,
			List<DiscountDetailsDao> validDiscountDetailList, DiscountDao validDiscountObj,
			SlabBasedDiscountRequestDto slabBasedDiscountRequest,
			SlabBasedDiscountDetailsResponseDto slabBasedDiscountEngineResponseDto) {

		List<SlabItemDetailsDto> slabItemResponseList = new ArrayList<>();
		Map<String, List<DiscountItemDetailsReqDto>> itemsGroupedByProductGroup = null;
		// if Single product and validating if all productGroups are common
		if (BooleanUtils.isTrue(discountDetailObject.getIsSingle())) {
			itemsGroupedByProductGroup = validDiscountItemDetailsReq.stream()
					.collect(Collectors.groupingBy(DiscountItemDetailsReqDto::getProductGroupCode));
		}

		for (DiscountItemDetailsReqDto requestItemDetail : validDiscountItemDetailsReq) {
			for (DiscountDetailsDao discountDetail : validDiscountDetailList) {
				if (DiscountEligibilityEnum.GROSS_WEIGHT.toString()
						.equalsIgnoreCase(discountDetailObject.getEligibility())) {
					// Gross Weight from itemDetail Request
					BigDecimal totalWeight;
					if (BooleanUtils.isTrue(discountDetailObject.getIsSingle())) {
						totalWeight = itemsGroupedByProductGroup.get(requestItemDetail.getProductGroupCode()).stream()
								.map(DiscountItemDetailsReqDto::getTotalWeight)
								.reduce(BigDecimal.ZERO, BigDecimal::add);
					} else {
						totalWeight = validDiscountItemDetailsReq.stream()
								.map(DiscountItemDetailsReqDto::getTotalWeight)
								.reduce(BigDecimal.ZERO, BigDecimal::add);
					}

					SlabItemDetailsDto validWeightBasedSlab = calculateDiscountComponent(discountDetail, totalWeight,
							requestItemDetail, slabBasedDiscountRequest, validDiscountObj,
							slabBasedDiscountEngineResponseDto);
					checkIfNotNull(validWeightBasedSlab, slabItemResponseList);
				} else if (DiscountEligibilityEnum.NET_WEIGHT.toString()
						.equalsIgnoreCase(discountDetailObject.getEligibility())) {
					BigDecimal totalWeight;
					// net Weight from itemDetail Request
					if (BooleanUtils.isTrue(discountDetailObject.getIsSingle())) {
						totalWeight = itemsGroupedByProductGroup.get(requestItemDetail.getProductGroupCode()).stream()
								.map(discount -> discount.getPriceDetails().getNetWeight())
								.reduce(BigDecimal.ZERO, BigDecimal::add);
					} else {
						totalWeight = validDiscountItemDetailsReq.stream()
								.map(discount -> discount.getPriceDetails().getNetWeight())
								.reduce(BigDecimal.ZERO, BigDecimal::add);
					}
					SlabItemDetailsDto validWeightBasedSlab = calculateDiscountComponent(discountDetail, totalWeight,
							requestItemDetail, slabBasedDiscountRequest, validDiscountObj,
							slabBasedDiscountEngineResponseDto);
					checkIfNotNull(validWeightBasedSlab, slabItemResponseList);
				}
			}
		}

		if (CollectionUtil.isEmpty(slabItemResponseList)
				&& BooleanUtils.isNotFalse(slabBasedDiscountRequest.getThrowException())) {
			throw new ServiceException("The cumulative weight does not belong to any slab",
					ConfigConstants.ERR_CONFIG_154, Map.of(ConfigConstants.SLAB_TYPE, "weight"));
		}
		return slabItemResponseList;
	}

	private void checkIfNotNull(SlabItemDetailsDto validWeightBasedSlab,
			List<SlabItemDetailsDto> slabItemResponseList) {
		if (validWeightBasedSlab != null && !StringUtils.isEmpty(validWeightBasedSlab.getItemCode())) {
			slabItemResponseList.add(validWeightBasedSlab);
		}
	}

	private List<SlabItemDetailsDto> validateValueBasedSlab(DiscountDetailsDao discountDetailObject,
			List<DiscountItemDetailsReqDto> validDiscountItemDetailsReq,
			List<DiscountDetailsDao> validDiscountDetailList, DiscountDao validDiscountObj,
			SlabBasedDiscountRequestDto slabBasedDiscountRequest,
			SlabBasedDiscountDetailsResponseDto slabBasedDiscountEngineResponseDto) {

		List<SlabItemDetailsDto> slabItemResponseList = new ArrayList<>();
		// if Single product and validating if all productGroups are common
		Map<String, List<DiscountItemDetailsReqDto>> itemsGroupedByProductGroup = null;
		if (BooleanUtils.isTrue(discountDetailObject.getIsSingle())) {
			itemsGroupedByProductGroup = validDiscountItemDetailsReq.stream()
					.collect(Collectors.groupingBy(DiscountItemDetailsReqDto::getProductGroupCode));
		}

		for (DiscountItemDetailsReqDto requestItemDetail : validDiscountItemDetailsReq) {
			for (DiscountDetailsDao discountDetail : validDiscountDetailList) {
				BigDecimal totalValue;
				BigDecimal totalTax;
				if (BooleanUtils.isTrue(discountDetailObject.getIsSingle())) {
					totalValue = itemsGroupedByProductGroup.get(requestItemDetail.getProductGroupCode()).stream()
							.map(DiscountItemDetailsReqDto::getTotalValue).reduce(BigDecimal.ZERO, BigDecimal::add);
					totalTax = itemsGroupedByProductGroup.get(requestItemDetail.getProductGroupCode()).stream()
							.map(DiscountItemDetailsReqDto::getTotalTax).reduce(BigDecimal.ZERO, BigDecimal::add);
				} else {
					totalValue = validDiscountItemDetailsReq.stream().map(DiscountItemDetailsReqDto::getTotalValue)
							.reduce(BigDecimal.ZERO, BigDecimal::add);
					totalTax = validDiscountItemDetailsReq.stream().map(DiscountItemDetailsReqDto::getTotalTax)
							.reduce(BigDecimal.ZERO, BigDecimal::add);
				}

				if (DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.toString()
						.equalsIgnoreCase(discountDetailObject.getEligibility())) {
					// Gross Weight from itemDetail Request
					SlabItemDetailsDto validWeightBasedSlab = calculateDiscountComponent(discountDetail, totalValue,
							requestItemDetail, slabBasedDiscountRequest, validDiscountObj,
							slabBasedDiscountEngineResponseDto);
					checkIfNotNull(validWeightBasedSlab, slabItemResponseList);
				} else if (DiscountEligibilityEnum.PRE_DISCOUNT_TAX.toString()
						.equalsIgnoreCase(discountDetailObject.getEligibility())) {
					// net Weight from itemDetail Request
					BigDecimal totalValuePlusTax = totalValue.add(totalTax);
					SlabItemDetailsDto validWeightBasedSlab = calculateDiscountComponent(discountDetail,
							totalValuePlusTax, requestItemDetail, slabBasedDiscountRequest, validDiscountObj,
							slabBasedDiscountEngineResponseDto);
					checkIfNotNull(validWeightBasedSlab, slabItemResponseList);

				}
			}
		}

		if (CollectionUtil.isEmpty(slabItemResponseList)
				&& BooleanUtils.isNotFalse(slabBasedDiscountRequest.getThrowException())) {
			throw new ServiceException("The cumulative value does not belong to any slab",
					ConfigConstants.ERR_CONFIG_154, Map.of(ConfigConstants.SLAB_TYPE, "value "));
		}
		return slabItemResponseList;
	}

	private boolean validateCommonProductGroups(List<DiscountItemDetailsReqDto> validDiscountItemDetailsReq) {
		List<String> validProductGroupCodes = validDiscountItemDetailsReq.stream()
				.map(DiscountItemDetailsReqDto::getProductGroupCode).collect(Collectors.toList());
		return validProductGroupCodes.stream().distinct().count() <= 1;
	}

	private SlabItemDetailsDto calculateDiscountComponent(DiscountDetailsDao discountDetail,
			BigDecimal totalWeightValue, DiscountItemDetailsReqDto requestItemDetails,
			SlabBasedDiscountRequestDto slabBasedDiscountRequest, DiscountDao validDiscountObj,
			SlabBasedDiscountDetailsResponseDto slabBasedDiscountEngineResponseDto) {

		RegularCategoryDetails regularDetails;
		DiscountDetailsResponseDto responseDto = null;

		SlabItemDetailsDto itemDetail = null;
		DiscountDetailsResponseDto responseObject = new DiscountDetailsResponseDto();

		if (checkIfItBelongsToSlab(discountDetail.getMinValue(), discountDetail.getMaxValue(), totalWeightValue)) {
			itemDetail = new SlabItemDetailsDto();
			// check preview details if present
			regularDetails = checkPreviewDetails(slabBasedDiscountRequest.getCustomerDetails(),
					slabBasedDiscountRequest.getTransactionDetails(), discountDetail, validDiscountObj,
					slabBasedDiscountRequest.getBusinessDate(), responseObject);

			// calculate Discount Value for item
			SlabConfigDetails slabConfigDetails = new SlabConfigDetails();
			slabConfigDetails.setDiscountCategory(discountDetail.getDiscountCategory());
			slabConfigDetails.setEligibilityDetails(discountDetail.getEligibility());
			slabConfigDetails.setIsSingle(discountDetail.getIsSingle());

			responseDto = calculateDiscountValue(validDiscountObj, regularDetails, requestItemDetails,
					slabBasedDiscountRequest.getBusinessDate(), slabConfigDetails, false, responseObject);

			itemDetail.setDiscountValue(responseDto.getDiscountValue());
			itemDetail.setDiscountValueDetails(responseDto.getDiscountValueDetails());
			itemDetail.setItemCode(requestItemDetails.getItemCode());
			itemDetail.setItemId(requestItemDetails.getItemId());
			itemDetail.setLotNumber(requestItemDetails.getLotNumber());
			itemDetail.setIsExclude(requestItemDetails.getIsExclude());
			itemDetail.setCummulativeDiscountWithExcludeDetails(Map.of(validDiscountObj.getId(),
					(new CummulativeDiscountWithExcludeDto(validDiscountObj.getId(), discountDetail.getId(),
							requestItemDetails.getIsExclude(), validDiscountObj.getDiscountType()))));

			if (slabBasedDiscountEngineResponseDto.getDiscountConfigDetails() == null) {
				slabBasedDiscountEngineResponseDto.setDiscountConfigDetails(responseDto.getDiscountConfigDetails());
			}
		}
		return itemDetail;
	}

	private RegularCategoryDetails checkPreviewDetails(DiscountCustDetails discountCustDetails,
			TransactionDetailsDto transactionDetailsDto, DiscountDetailsDao discountDetail,
			DiscountDao validDiscountObj, Date businessDate, DiscountDetailsResponseDto responseObject) {

		Object objectData = null;
		DiscountDao discountPreviewDetails = null;

		JsonData abCoJsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(validDiscountObj.getAbCoData()), JsonData.class);
		AbCoDetails abCoDetails = MapperUtil.mapObjToClass(abCoJsonData.getData(), AbCoDetails.class);

		if (discountCustDetails != null && discountCustDetails.getUlpId() != null) {
			Date encircleCreationDate = discountCustDetails.getEnrollmentDate();
			discountPreviewDetails = discountRepository.getPreviewDetails(validDiscountObj.getId(),
					encircleCreationDate, businessDate, CommonUtil.getLocationCode());
		}

		// get order details for the given discountId
		JsonData orderDetailsJsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(validDiscountObj.getOrderDetails()), JsonData.class);
		OrderConfigDetails orderConfigDetails = MapperUtil.mapObjToClass(orderDetailsJsonData.getData(),
				OrderConfigDetails.class);

		objectData = getDiscountComponentBasedOnTransactionType(transactionDetailsDto, discountDetail,
				discountPreviewDetails, abCoDetails, validDiscountObj, orderConfigDetails, responseObject,
				businessDate);

		return MapperUtil.mapObjToClass(objectData, RegularCategoryDetails.class);
	}

	@Override
	public EmployeeDiscountTxnResponse getMaxCountOfEmployeeDiscountTxn(String employeeID, String companyName) {
		EmployeeDiscountTxnResponse response = new EmployeeDiscountTxnResponse();
		BusinessDayDto businessDateDto = engineClient.getBusinessDay(CommonUtil.getLocationCode());
		response.setTxnCount(salesTxnRepository.getMaxCout(employeeID, companyName, businessDateDto.getFiscalYear().shortValue()));
		return response;
	}

	/**
	 * Checking in which slab range does the item belong to if any.
	 *
	 * @param discount             the discount
	 * @param discountCalDto       the discount cal dto
	 * @param locationOfferDetails
	 * @return the regular details from valid slab
	 */
	private RegularCategoryDetails getConfigDetailsFromValidSlab(DiscountDao discount,
			DiscountCalRequestDto discountCalDto, SlabConfigDetails slabConfigDetails,
			DiscountDetailsResponseDto responseObject, Date offerEndDate) {
		List<DiscountDetailsDao> discountDetailsDaos = new ArrayList<>();
		JsonData orderDetailJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discount.getOrderDetails()), JsonData.class);
		DiscountOrderConfigDetails orderDetail = MapperUtil.mapObjToClass(orderDetailJson.getData(),
				DiscountOrderConfigDetails.class);
		log.info("order details : " + orderDetail);
		log.info("offer end date : " + offerEndDate);
		if (discountCalDto.getTransactionDetails().getRefTxnType() != null
				&& discountCalDto.getTransactionDetails().getRefTxnType().equalsIgnoreCase("AB") && orderDetail != null
				&& orderDetail.getOfferPeriodForAB() != null && offerEndDate != null) {

			// to get after AB offer period we have to do
			// endDate + grace period
			Calendar cal = Calendar.getInstance();
			cal.setTime(offerEndDate);
			cal.add(Calendar.DATE, orderDetail.getOfferPeriodForAB());
			log.info("after adding grace period : " + cal.getTime());
			discountDetailsDaos = discountUtilService.validateItemRequestDetails(discount.getId(),
					discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(), true, false, cal.getTime(),
					null);
		} else {
			log.info("after adding grace period : else block ");
			discountDetailsDaos = discountUtilService.validateItemRequestDetails(discount.getId(),
					discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(), true, false, null, null);
		}
		RegularCategoryDetails regularCategoryDetails = null;
		for (DiscountDetailsDao discountDetail : discountDetailsDaos) {
			String discountDetailId = null;
			if (checkIfCummDiscountIdIsAvailable(discount, discountCalDto, discountDetail)) {
				discountDetailId = discountCalDto.getCummulativeDiscountWithExcludeDetails().get(discount.getId())
						.getDiscountDetailsId();
			}

			if (discountDetail.getDiscountCategory().equals(DiscountCategoryEnum.WEIGHT_BASED.name())) {
				regularCategoryDetails = checkWeightBasedSlab(discountDetail, slabConfigDetails, discountCalDto,
						discount, discountCalDto.getItemDetails().getTotalWeight(),
						discountCalDto.getItemDetails().getPriceDetails().getNetWeight(), responseObject, Boolean.FALSE,
						discountDetailId);
			} else if (discountDetail.getDiscountCategory().equals(DiscountCategoryEnum.VALUE_BASED.name())) {
				regularCategoryDetails = checkValueBasedSlab(discountDetail, slabConfigDetails, discountCalDto,
						discount, discountCalDto.getItemDetails().getTotalValue(),
						discountCalDto.getItemDetails().getTotalTax(), responseObject, Boolean.FALSE, discountDetailId);
			} else if (discountDetail.getDiscountCategory().equals(DiscountCategoryEnum.CARAT_BASED.name())) {
				regularCategoryDetails = checkKaratBasedSlab(discountDetail, slabConfigDetails, discountCalDto,
						discount, discountCalDto.getItemDetails().getItemCode(),
						discountCalDto.getItemDetails().getLotNumber(), responseObject, Boolean.FALSE);
			}
			if (regularCategoryDetails != null) {
				break;
			}
		}

		// setting slab details for ab to cm scenario
		if (discountCalDto.getTransactionDetails().getTransactionType().equalsIgnoreCase("AB")||
				discountCalDto.getTransactionDetails().getTransactionType().equalsIgnoreCase("CM")
				|| discountCalDto.getTransactionDetails().getTransactionType().equalsIgnoreCase("CO")) {
			SlabDetails slabDetails = new SlabDetails();
			slabDetails.setSlabConfigs(setSlabDetails(discountDetailsDaos));
			DiscountDetailsBaseDto discountConfigDetails = responseObject.getDiscountConfigDetails();
			if (discountConfigDetails != null) {
				discountConfigDetails.setSlabDiscountComponents(slabDetails);
				responseObject.setDiscountConfigDetails(discountConfigDetails);
			}
			// responseObject.getDiscountConfigDetails().setSlabDiscountComponents(slabDetails);
		}
		return regularCategoryDetails;
	}

	private RegularCategoryDetails checkWeightBasedSlab(DiscountDetailsDao discountDetail,
			SlabConfigDetails slabConfigDetails, DiscountCalRequestDto discountCalRequestDto,
			DiscountDao validDiscountObj, BigDecimal totalWeight, BigDecimal netWeight,
			DiscountDetailsResponseDto responseObject, Boolean isRivaah, String validDiscountDetailForCummDiscount) {

		// if validDiscountDetailForCummDiscount is not null, then weight/value check is
		// not needed.

		if (discountDetail.getEligibility().equals(DiscountEligibilityEnum.GROSS_WEIGHT.name())) {
			if (checkIfItBelongsToSlab(discountDetail.getMinValue(), discountDetail.getMaxValue(), totalWeight)
					|| !StringUtils.isBlank(validDiscountDetailForCummDiscount)) {
				// setting slab config details for response
				setSlabConfigDetailsForResponse(slabConfigDetails, discountDetail.getDiscountCategory(),
						discountDetail.getEligibility(), discountDetail.getIsSingle());
				if (BooleanUtils.isTrue(isRivaah))
					return rivaahPreviewDetails(discountDetail);
				else
					return checkPreviewDetails(discountCalRequestDto.getCustomerDetails(),
							discountCalRequestDto.getTransactionDetails(), discountDetail, validDiscountObj,
							discountCalRequestDto.getBusinessDate(), responseObject);

			}
		} else if (discountDetail.getEligibility().equals(DiscountEligibilityEnum.NET_WEIGHT.name())
				&& (!StringUtils.isBlank(validDiscountDetailForCummDiscount) || checkIfItBelongsToSlab(
						discountDetail.getMinValue(), discountDetail.getMaxValue(), netWeight))) {
			// setting slab config details for response
			setSlabConfigDetailsForResponse(slabConfigDetails, discountDetail.getDiscountCategory(),
					discountDetail.getEligibility(), discountDetail.getIsSingle());
			if (BooleanUtils.isTrue(isRivaah))
				return rivaahPreviewDetails(discountDetail);
			else
				return checkPreviewDetails(discountCalRequestDto.getCustomerDetails(),
						discountCalRequestDto.getTransactionDetails(), discountDetail, validDiscountObj,
						discountCalRequestDto.getBusinessDate(), responseObject);
		}
		return null;
	}

	private RegularCategoryDetails rivaahPreviewDetails(DiscountDetailsDao discountDetail) {
		return getRivaahRegularDetails(discountDetail);
	}

	private RegularCategoryDetails checkValueBasedSlab(DiscountDetailsDao discountDetail,
			SlabConfigDetails slabConfigDetails, DiscountCalRequestDto discountCalRequestDto,
			DiscountDao validDiscountObj, BigDecimal totalValue, BigDecimal totalTax,
			DiscountDetailsResponseDto responseObject, Boolean isRivaah, String validDiscountDetailForCummDiscount) {

		// if validDiscountDetailForCummDiscount is not null, then weight/value check is
		// not needed.

		if (discountDetail.getEligibility().equals(DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.name())) {
			if (checkIfItBelongsToSlab(discountDetail.getMinValue(), discountDetail.getMaxValue(), totalValue)
					|| !StringUtils.isBlank(validDiscountDetailForCummDiscount)) {
				// setting slab config details for response
				setSlabConfigDetailsForResponse(slabConfigDetails, discountDetail.getDiscountCategory(),
						discountDetail.getEligibility(), discountDetail.getIsSingle());
				if (BooleanUtils.isTrue(isRivaah))
					return rivaahPreviewDetails(discountDetail);
				else
					return checkPreviewDetails(discountCalRequestDto.getCustomerDetails(),
							discountCalRequestDto.getTransactionDetails(), discountDetail, validDiscountObj,
							discountCalRequestDto.getBusinessDate(), responseObject);
			}
		} else if (discountDetail.getEligibility().equals(DiscountEligibilityEnum.PRE_DISCOUNT_TAX.name())) {
			BigDecimal totalTaxPlusValue = totalValue.add(totalTax);
			if (checkIfItBelongsToSlab(discountDetail.getMinValue(), discountDetail.getMaxValue(), totalTaxPlusValue)
					|| !StringUtils.isBlank(validDiscountDetailForCummDiscount)) {
				// setting slab config details for response
				setSlabConfigDetailsForResponse(slabConfigDetails, discountDetail.getDiscountCategory(),
						discountDetail.getEligibility(), discountDetail.getIsSingle());
				if (BooleanUtils.isTrue(isRivaah))
					return rivaahPreviewDetails(discountDetail);
				else
					return checkPreviewDetails(discountCalRequestDto.getCustomerDetails(),
							discountCalRequestDto.getTransactionDetails(), discountDetail, validDiscountObj,
							discountCalRequestDto.getBusinessDate(), responseObject);
			}
		}
		return null;
	}

	private RegularCategoryDetails checkKaratBasedSlab(DiscountDetailsDao discountDetail,
			SlabConfigDetails slabConfigDetails, DiscountCalRequestDto discountCalRequestDto,
			DiscountDao validDiscountObj, String itemCode, String lotNumber, DiscountDetailsResponseDto responseObject,
			Boolean isRivaah) {
		ItemLotStoneListDto lotItemStones = productService.getLotItemStonesWithDICheck(itemCode, lotNumber,true, true);
		if (!CollectionUtils.isEmpty(lotItemStones.getLotStoneDetails())) {
			if (discountDetail.getEligibility().equals(DiscountEligibilityEnum.SINGLE_STONE.name())) {
				return checkKaratBasedSingleStoneSlabConfig(lotItemStones, discountDetail, slabConfigDetails,
						discountCalRequestDto, validDiscountObj, responseObject, isRivaah);
			} else if (discountDetail.getEligibility().equals(DiscountEligibilityEnum.CUMULATIVE_STONE.name())) {
				return checkKaratBasedCumulativeStoneSlabConfig(lotItemStones, discountDetail, slabConfigDetails,
						discountCalRequestDto, validDiscountObj, responseObject, isRivaah);
			}
		}
		return null;
	}

	private RegularCategoryDetails checkKaratBasedSingleStoneSlabConfig(ItemLotStoneListDto lotItemStones,
			DiscountDetailsDao discountDetail, SlabConfigDetails slabConfigDetails,
			DiscountCalRequestDto discountCalRequestDto, DiscountDao validDiscountObj,
			DiscountDetailsResponseDto responseObject, Boolean isRivaah) {

		BigDecimal maxWeightForSingleCaratSlab = getMaxWeightForSingleCaratSlab(lotItemStones.getLotStoneDetails());
		if (checkIfItBelongsToSlab(discountDetail.getMinValue(), discountDetail.getMaxValue(),
				maxWeightForSingleCaratSlab)) {
			// setting slab config details for response
			setSlabConfigDetailsForResponse(slabConfigDetails, discountDetail.getDiscountCategory(),
					discountDetail.getEligibility(), discountDetail.getIsSingle());
			if (BooleanUtils.isTrue(isRivaah))
				return rivaahPreviewDetails(discountDetail);
			else
				return checkPreviewDetails(discountCalRequestDto.getCustomerDetails(),
						discountCalRequestDto.getTransactionDetails(), discountDetail, validDiscountObj,
						discountCalRequestDto.getBusinessDate(), responseObject);
		}
		return null;
	}

	private RegularCategoryDetails checkKaratBasedCumulativeStoneSlabConfig(ItemLotStoneListDto lotItemStones,
			DiscountDetailsDao discountDetail, SlabConfigDetails slabConfigDetails,
			DiscountCalRequestDto discountCalRequestDto, DiscountDao validDiscountObj,
			DiscountDetailsResponseDto responseObject, Boolean isRivaah) {
		BigDecimal cumulativeStoneWeight = getCumaltiveWeightForCaratSlab(lotItemStones.getLotStoneDetails(),
				validDiscountObj.getId());
		if (checkIfItBelongsToSlab(discountDetail.getMinValue(), discountDetail.getMaxValue(), cumulativeStoneWeight)) {
			// setting slab config details for response
			setSlabConfigDetailsForResponse(slabConfigDetails, discountDetail.getDiscountCategory(),
					discountDetail.getEligibility(), discountDetail.getIsSingle());
			if (BooleanUtils.isTrue(isRivaah))
				return rivaahPreviewDetails(discountDetail);
			else
				return checkPreviewDetails(discountCalRequestDto.getCustomerDetails(),
						discountCalRequestDto.getTransactionDetails(), discountDetail, validDiscountObj,
						discountCalRequestDto.getBusinessDate(), responseObject);
		}
		return null;
	}

	private boolean checkIfItBelongsToSlab(BigDecimal minVlaue, BigDecimal maxValue, BigDecimal inputValue) {
		return minVlaue != null && maxValue != null && inputValue.compareTo(minVlaue) >= 0
				&& inputValue.compareTo(maxValue) <= 0;
	}

	private DiscountDao validateDiscountDao(String discountId) {
		return discountRepository.findById(discountId)
				.orElseThrow(() -> new ServiceException(
						ConfigConstants.NO_DISCOUNT_DETAILS_FOUND_FOR_THE_REQUESTED_DISCOUNTID,
						ConfigConstants.ERR_CONFIG_033));
	}

	private void setSlabConfigDetailsForResponse(SlabConfigDetails slabConfigDetails, String discountCategory,
			String eligibilityDetails, boolean isSingle) {
		slabConfigDetails.setDiscountCategory(discountCategory);
		slabConfigDetails.setEligibilityDetails(eligibilityDetails);
		slabConfigDetails.setIsSingle(isSingle);
	}

	private RegularCategoryDetails validateAndGetEmpowermentConfigDetails(DiscountDao discount, Date businessDate,
			DiscountItemDetailsReqDto itemDetail) {
		RegularCategoryDetails regularCategoryDetails = null;

		// validating prod group, prod category, exclude mapping and location mapping
		List<DiscountDetailsDao> discountDetailsDaos = discountUtilService.validateItemRequestDetails(discount.getId(),
				businessDate, itemDetail, true, true, null, null);

		for (DiscountDetailsDao discountDetail : discountDetailsDaos) {
			if (checkIfItBelongsToSlab(discountDetail.getMinValue(), discountDetail.getMaxValue(),
					itemDetail.getTotalValue())) {
				regularCategoryDetails = setEmpowermentRegularDetails(discount.getId(), discountDetail, businessDate);
			}

			if (regularCategoryDetails != null) {
				break;
			}
		}

		return regularCategoryDetails;
	}

	private RegularCategoryDetails setEmpowermentRegularDetails(String discountId, DiscountDetailsDao discountDetail,
			Date businessDate) {

		// validating discount location mapping and checking quarter is enabled and max
		// value of that quarter
		DiscountLocationMappingDao discountLocationMapping = discountUtilService.getDiscountLocationMapping(discountId);
		if (StringUtils.isEmpty(discountLocationMapping.getConfigDetails())) {
			throw new ServiceException("Discount Location Config details not found", "");
		}
		validateEmpowermentDiscount(discountLocationMapping.getConfigDetails(), businessDate, true);

		BigDecimal discountPercent = new BigDecimal(discountDetail.getDiscountPercent());

		JsonData empowermentJsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discountDetail.getConfigDetails()), JsonData.class);
		EmpowermentDiscount empowermentDiscountConfig = MapperUtil.mapObjToClass(empowermentJsonData.getData(),
				EmpowermentDiscount.class);

		if (empowermentDiscountConfig == null) {
			throw new ServiceException("Empowerment discount details not configured.", "ERR-CONFIG-166");
		}
		return setRegularDetailsForEmpowerment(empowermentDiscountConfig, discountPercent);
	}

	private void validateEmpowermentDiscount(String configDetails, Date businessDate, boolean throwExcepion) {
		// get current quarter
		int quarter = CalendarUtils.getQuarterFromDate(businessDate);
		JsonObject empowermentConfigDetails = new JsonParser().parse(configDetails).getAsJsonObject();

		if (empowermentConfigDetails.getAsJsonObject("data").getAsJsonObject("Q" + quarter)
				.get("isQ" + quarter + "Enabled").getAsBoolean()) {
			BigDecimal maxQuarterDiscountValue = empowermentConfigDetails.getAsJsonObject("data")
					.getAsJsonObject("Q" + quarter).get("value").getAsBigDecimal();
			BigDecimal currentEmpowermentDiscountValue = discountDetailsRepository.getMaxDiscountForCurrentQuarter(
					CalendarUtils.getFirstDayOfQuarter(businessDate), CalendarUtils.getLastDayOfQuarter(businessDate),
					DiscountTypeEnum.EMPOWERMENT_DISCOUNT.toString(), CommonUtil.getLocationCode());
			if (maxQuarterDiscountValue.compareTo(currentEmpowermentDiscountValue) <= 0 && throwExcepion) {
				throw new ServiceException("Empowerment discount exceeds the maximum quarter value for the location",
						"ERR-CONFIG-151");
			}
		} else {
			if (throwExcepion) {
				throw new ServiceException("Empowerment discount is not enabled for the current quarter",
						"ERR-CONFIG-152");
			}
		}
	}

	private RegularCategoryDetails setRegularDetailsForEmpowerment(EmpowermentDiscount empowermentDiscountConfig,
			BigDecimal discountPercent) {
		RegularCategoryDetails regularCategoryDetails = new RegularCategoryDetails();

		MakingChargeData makingChargeData = new MakingChargeData();
		makingChargeData.setIsPercent(true);
		makingChargeData.setValue(BigDecimal.ZERO);

		StoneChargeData stoneChargeData = new StoneChargeData();
		stoneChargeData.setIsPercent(true);
		stoneChargeData.setValue(BigDecimal.ZERO);

		UcpData ucpData = new UcpData();
		ucpData.setIsPercent(true);
		ucpData.setValue(BigDecimal.ZERO);

		MetalChargeData metalChargeData = new MetalChargeData();
		metalChargeData.setIsPercent(true);
		metalChargeData.setValue(BigDecimal.ZERO);

		if (BooleanUtils.isTrue(empowermentDiscountConfig.getIsMakingCharge())) {
			makingChargeData.setValue(discountPercent);
		}

		if (BooleanUtils.isTrue(empowermentDiscountConfig.getIsStoneCharge())) {
			stoneChargeData.setValue(discountPercent);
		}

		if (BooleanUtils.isTrue(empowermentDiscountConfig.getIsUCP())) {
			ucpData.setValue(discountPercent);
		}

		if (BooleanUtils.isTrue(empowermentDiscountConfig.getIsMetalCharge())) {
			metalChargeData.setValue(discountPercent);
		}

		regularCategoryDetails.setMcCharges(makingChargeData);
		regularCategoryDetails.setStoneCharges(stoneChargeData);
		regularCategoryDetails.setIsUCP(ucpData);
		regularCategoryDetails.setGoldCharges(metalChargeData);

		return regularCategoryDetails;
	}

	private void validateEmpowermentDetailsAgainstDiscountIds(List<DiscountDao> discountListDao,
			List<DiscountDao> validDiscountList, Date businessDate) {

		discountListDao.forEach(discount -> {
			DiscountLocationMappingDao discountLocationMapping = discountUtilService
					.getDiscountLocationMapping(discount.getId());
			if (discountLocationMapping != null) {
				validateEmpowermentDiscount(discountLocationMapping.getConfigDetails(), businessDate, true);
				validDiscountList.add(discount);
			}
		});
	}

	private List<DiscountDao> getValidEmpowermentDiscounts(DiscountItemLevelRequestDto discountRequestDto) {
		if (discountRequestDto.getEmpowermentDetails() != null
				&& discountRequestDto.getEmpowermentDetails().getApplyEmpowermentDiscount()) {
			String discountType = DiscountTypeEnum.EMPOWERMENT_DISCOUNT.toString();
			List<DiscountDao> discounts = discountRepository.getEmpowermentDiscounts(discountType,
					CommonUtil.getLocationCode());
			List<DiscountDao> validDiscountList = new ArrayList<>();
			validateEmpowermentDetailsAgainstDiscountIds(discounts, validDiscountList,
					discountRequestDto.getBusinessDate());
			return getAdditionalDiscounts(discountType, validDiscountList, discountRequestDto.getBusinessDate(),
					discountRequestDto.getItemDetails());

		}
		return Collections.emptyList();
	}

	private BigDecimal getMaxWeightForSingleCaratSlab(List<ItemLotStoneBaseDto> lotStoneDetails) {
		BigDecimal maxSingleCarat = BigDecimal.ZERO;

		for (ItemLotStoneBaseDto lotStone : lotStoneDetails) {
			BigDecimal unitWeight = lotStone.getStoneWeight().divide(BigDecimal.valueOf(lotStone.getNoOfStones()), 5,
					RoundingMode.HALF_UP);
			if (unitWeight.compareTo(maxSingleCarat) > 0) {
				maxSingleCarat = unitWeight;
			}
		}
		return maxSingleCarat;
	}

	private BigDecimal getCumaltiveWeightForCaratSlab(List<ItemLotStoneBaseDto> lotStoneDetails, String discountId) {
		BigDecimal minSlabWeight = discountDetailsRepositoryExt.getMinSlabValue(discountId);
		BigDecimal cumulativeWeight = BigDecimal.ZERO;
		for (ItemLotStoneBaseDto lotStone : lotStoneDetails) {
			BigDecimal singleStoneWeight = lotStone.getStoneWeight()
					.divide(BigDecimal.valueOf(lotStone.getNoOfStones()), 5, RoundingMode.HALF_UP);
			if (singleStoneWeight.compareTo(minSlabWeight) > 0) {
				cumulativeWeight = cumulativeWeight.add(lotStone.getStoneWeight());
			}
		}
		return cumulativeWeight;
	}

	private List<SlabConfig> setSlabDetails(List<DiscountDetailsDao> discountDetails) {

		List<SlabConfig> slabDetails = new ArrayList<>();
		for (DiscountDetailsDao discountDetail : discountDetails) {
			SlabConfig slabConfig = new SlabConfig();
			slabConfig.setMinValue(discountDetail.getMinValue());
			slabConfig.setMaxValue(discountDetail.getMaxValue());
			slabConfig.setId(discountDetail.getId());

			JsonData regularJsonData = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(discountDetail.getRegularConfigDetails()), JsonData.class);
			RegularCategoryDetails regularDetails = MapperUtil.mapObjToClass(regularJsonData.getData(),
					RegularCategoryDetails.class);
			slabConfig.setRegularDiscountComponent(regularDetails);

			JsonData previewJsonData = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(discountDetail.getPreviewConfigDetails()), JsonData.class);
			RegularCategoryDetails previewCategoryDetails = MapperUtil.mapObjToClass(previewJsonData.getData(),
					RegularCategoryDetails.class);
			slabConfig.setPreviewDiscountComponent(previewCategoryDetails);

			JsonData abJsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountDetail.getAbConfigDetails()), JsonData.class);
			RegularCategoryDetails abCategoryDetails = MapperUtil.mapObjToClass(abJsonData.getData(),
					RegularCategoryDetails.class);
			slabConfig.setAbDiscountComponent(abCategoryDetails);

			JsonData coJsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountDetail.getCoConfigDetails()), JsonData.class);
			RegularCategoryDetails coCategoryDetails = MapperUtil.mapObjToClass(coJsonData.getData(),
					RegularCategoryDetails.class);
			slabConfig.setCoDiscountComponent(coCategoryDetails);

			slabDetails.add(slabConfig);
		}
		return slabDetails;
	}

	@Override
	public DiscountEngineResponseDto calculateAbDiscountValue(AbCoDiscountRequestDto abCoDiscountRequestDto) {

		DiscountEngineResponseDto discountResponse = new DiscountEngineResponseDto();
		List<DiscountDetailsResponseDto> discountDetailsResponseDto = new ArrayList<>();
		abCoDiscountRequestDto.setBusinessDate(CalendarUtils.getStartOfDay(abCoDiscountRequestDto.getBusinessDate()));
		for (DiscountDetailsConfigRequestDto discountDetailsConfig : abCoDiscountRequestDto
				.getDiscountDetilsConfigRequestDto()) {
			DiscountDao discount = discountUtilService.mapDiscountDao(discountDetailsConfig.getAppliedDiscountMaster());
			DiscountDetailsResponseDto responseObject = new DiscountDetailsResponseDto();
			responseObject.setRivaahGhsDetails(abCoDiscountRequestDto.getEligibleRivaahGhsDetails());
			Date businessDate = CalendarUtils.getStartOfDay(abCoDiscountRequestDto.getBusinessDate());
			if (discountDetailsConfig.getDiscountType().equals(DiscountTypeEnum.CATEGORY_DISCOUNT)
					|| discountDetailsConfig.getDiscountType().equals(DiscountTypeEnum.BEST_DEAL_DISCOUNT)
					|| discountDetailsConfig.getDiscountType().equals(DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT)) {
				if (discountDetailsConfig.getAppliedDiscountComponentType()
						.equalsIgnoreCase(DiscountDetailsTypeEnum.AB.name())
						|| (discountDetailsConfig.getAppliedDiscountComponentType()
								.equalsIgnoreCase(DiscountDetailsTypeEnum.REGULAR.name()))) {
					DiscountDetailsResponseDto discountDetails = checkAbRegularOffer(discountDetailsConfig,
							businessDate, discount, responseObject, abCoDiscountRequestDto.getItemDetails());
					if (discountDetails != null) {
						if (discountDetails.getDiscountConfigDetails() == null) {
							DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
							discountDetails.setDiscountConfigDetails(discountConfigDetails);
						}
						discountDetails.getDiscountConfigDetails().setAppliedDiscountComponentType(
								discountDetailsConfig.getAppliedDiscountComponentType());
						discountDetailsResponseDto.add(discountDetails);
					}
				} else if (discountDetailsConfig.getAppliedDiscountComponentType()
						.equalsIgnoreCase(DiscountDetailsTypeEnum.PREVIEW.name())) {
					DiscountDetailsResponseDto discountDetails = checkAbPreviewOffer(discountDetailsConfig,
							businessDate, discount, responseObject, abCoDiscountRequestDto.getItemDetails());
					if (discountDetails != null) {
						if (discountDetails.getDiscountConfigDetails() == null) {
							DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
							discountDetails.setDiscountConfigDetails(discountConfigDetails);
						}
						discountDetails.getDiscountConfigDetails().setAppliedDiscountComponentType(
								discountDetailsConfig.getAppliedDiscountComponentType());
						discountDetailsResponseDto.add(discountDetails);
					}
				}

			} else if (discountDetailsConfig.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT)
					|| discountDetailsConfig.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT)) {

				DiscountDetailsResponseDto discountDetails = checkAbSlabAndHighValueDiscount(discountDetailsConfig,
						businessDate, discount, responseObject, abCoDiscountRequestDto);
				if (discountDetails != null) {
					if (discountDetails.getDiscountConfigDetails() == null) {
						DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
						discountDetails.setDiscountConfigDetails(discountConfigDetails);
					}
					discountDetails.getDiscountConfigDetails()
							.setAppliedDiscountComponentType(discountDetailsConfig.getAppliedDiscountComponentType());
					discountDetails.getDiscountConfigDetails()
							.setAppliedDiscountComponent(discountDetailsConfig.getAppliedDiscountComponent());
					discountDetails.getDiscountConfigDetails()
							.setRegularDiscountComponent(discountDetailsConfig.getRegularDiscountComponent());
					discountDetails.getDiscountConfigDetails()
							.setSlabDiscountComponents(discountDetailsConfig.getSlabDiscountComponents());
					discountDetailsResponseDto.add(discountDetails);
				}
			} else if (DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.equals(discountDetailsConfig.getDiscountType())) {
				DiscountDetailsResponseDto discountDetails = calculateDiscountValue(discount,
						discountDetailsConfig.getAppliedDiscountComponent(), abCoDiscountRequestDto.getItemDetails(),
						businessDate, discountDetailsConfig.getSlabConfigDetails(), true, responseObject);
				if (discountDetails != null) {
					if (discountDetails.getDiscountConfigDetails() == null) {
						DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
						discountDetails.setDiscountConfigDetails(discountConfigDetails);
					}
					discountDetails.getDiscountConfigDetails()
							.setAppliedDiscountComponentType(discountDetailsConfig.getAppliedDiscountComponentType());
					discountDetailsResponseDto.add(discountDetails);
				}
			}
		}

		discountResponse.setClubbingId(abCoDiscountRequestDto.getClubDiscountId());
		// in case of club discounts checking if all the discounts is eligible
		if (discountDetailsResponseDto.size() == abCoDiscountRequestDto.getDiscountDetilsConfigRequestDto().size()) {
			discountResponse.setDiscountDetailsResponseDto(discountDetailsResponseDto);
		} else {
			discountResponse.setDiscountDetailsResponseDto(new ArrayList<>());
		}
		return discountResponse;
	}

	private DiscountDetailsResponseDto checkAbPreviewOffer(DiscountDetailsConfigRequestDto discountDetailsConfig,
			Date businessDate, DiscountDao discount, DiscountDetailsResponseDto responseObject,
			DiscountItemDetailsReqDto itemDetails) {

		Date previewEndDate = discountDetailsConfig.getLocationOfferDetails().getPreviewOfferEndDate();
		Calendar cal = Calendar.getInstance();
		cal.setTime(previewEndDate);
		Integer gracePeriod = discountDetailsConfig.getOrderConfigDetails().getOfferPeriodForAB();
		if (gracePeriod != null) {
			cal.add(Calendar.DATE, gracePeriod);
		}

		if (checkAbOfferPeriod(businessDate, discountDetailsConfig.getLocationOfferDetails().getPreviewOfferStartDate(),
				discountDetailsConfig.getLocationOfferDetails().getPreviewOfferEndDate(), gracePeriod)) {
			return calculateDiscountValue(discount, discountDetailsConfig.getAppliedDiscountComponent(), itemDetails,
					businessDate, discountDetailsConfig.getSlabConfigDetails(), true, responseObject);
		}
		return checkAbRegularOffer(discountDetailsConfig, businessDate, discount, responseObject, itemDetails);
	}

	private DiscountDetailsResponseDto checkAbRegularOffer(DiscountDetailsConfigRequestDto discountDetailsConfig,
			Date businessDate, DiscountDao discount, DiscountDetailsResponseDto responseObject,
			DiscountItemDetailsReqDto itemDetails) {

		Date offerEndDate = discountDetailsConfig.getLocationOfferDetails().getOfferEndDate();
		Date offerStartDate = discountDetailsConfig.getLocationOfferDetails().getOfferStartDate();
		Calendar cal = Calendar.getInstance();
		cal.setTime(offerEndDate);
		Integer gracePeriod = null;
		if (discountDetailsConfig.getOrderConfigDetails() != null
				&& discountDetailsConfig.getOrderConfigDetails().getOfferPeriodForAB() != null) {
			gracePeriod = discountDetailsConfig.getOrderConfigDetails().getOfferPeriodForAB();
			if (gracePeriod != null) {
				cal.add(Calendar.DATE, gracePeriod);
			}
		}

		// offer period check is not needed for 'RIVAAH_ASHIRWAAD_DISCOUNT'
		if (checkAbOfferPeriod(businessDate, offerStartDate, offerEndDate, gracePeriod)) {
			return calculateDiscountValue(discount, discountDetailsConfig.getAppliedDiscountComponent(), itemDetails,
					businessDate, discountDetailsConfig.getSlabConfigDetails(), true, responseObject);
		}
		return null;
	}

	private DiscountDetailsResponseDto checkAbSlabAndHighValueDiscount(
			DiscountDetailsConfigRequestDto discountDetailsConfig, Date businessDate, DiscountDao discount,
			DiscountDetailsResponseDto responseObject, AbCoDiscountRequestDto abCoDiscountRequestDto) {

		if (discountDetailsConfig.getAppliedDiscountComponentType()
				.equalsIgnoreCase(DiscountDetailsTypeEnum.AB.name())) {
			return checkAbSlabOffer(discountDetailsConfig, businessDate, discount, responseObject, "AB",
					abCoDiscountRequestDto);
		} else if (discountDetailsConfig.getAppliedDiscountComponentType()
				.equalsIgnoreCase(DiscountDetailsTypeEnum.REGULAR.name())) {
			return checkAbSlabOffer(discountDetailsConfig, businessDate, discount, responseObject, "REGULAR",
					abCoDiscountRequestDto);
		} else if (discountDetailsConfig.getAppliedDiscountComponentType()
				.equalsIgnoreCase(DiscountDetailsTypeEnum.PREVIEW.name())) {
			return checkAbSlabOffer(discountDetailsConfig, businessDate, discount, responseObject, "PREVIEW",
					abCoDiscountRequestDto);
		} else if (discountDetailsConfig.getAppliedDiscountComponentType()
				.equalsIgnoreCase(DiscountDetailsTypeEnum.CO.name())) {
			return checkAbSlabOffer(discountDetailsConfig, businessDate, discount, responseObject, "CO",
					abCoDiscountRequestDto);
		}
		return null;
	}

	private DiscountDetailsResponseDto checkAbSlabOffer(DiscountDetailsConfigRequestDto discountDetailsConfig,
			Date businessDate, DiscountDao discount, DiscountDetailsResponseDto responseObject,
			String regularCategoryType, AbCoDiscountRequestDto abCoDiscountRequestDto) {

		Date offerEndDate = discountDetailsConfig.getLocationOfferDetails().getOfferEndDate();
		Calendar cal = Calendar.getInstance();
		cal.setTime(offerEndDate);
		Integer gracePeriod = null;
		if (discountDetailsConfig.getOrderConfigDetails() != null
				&& discountDetailsConfig.getOrderConfigDetails().getOfferPeriodForAB() != null) {
			gracePeriod = discountDetailsConfig.getOrderConfigDetails().getOfferPeriodForAB();
			if (gracePeriod != null) {
				cal.add(Calendar.DATE, gracePeriod);
			}
		}
		if (checkAbOfferPeriod(businessDate, discountDetailsConfig.getLocationOfferDetails().getOfferStartDate(),
				offerEndDate, gracePeriod)) {
			BigDecimal inputValue = getInputValueForSlabAndHighValueDiscount(discountDetailsConfig,
					abCoDiscountRequestDto.getItemDetails());
			for (SlabConfig slabConfig : discountDetailsConfig.getSlabDiscountComponents().getSlabConfigs()) {
				if ((!CollectionUtils.isEmpty(abCoDiscountRequestDto.getCummulativeDiscountWithExcludeDetails())
						&& slabConfig.getId() != null
						&& slabConfig.getId()
								.equalsIgnoreCase(abCoDiscountRequestDto.getCummulativeDiscountWithExcludeDetails()
										.get(discount.getId()).getDiscountDetailsId()))
						|| ((CollectionUtils.isEmpty(abCoDiscountRequestDto.getCummulativeDiscountWithExcludeDetails())
								|| slabConfig.getId() == null)
								&& checkIfItBelongsToSlab(slabConfig.getMinValue(), slabConfig.getMaxValue(),
										inputValue))) {
					RegularCategoryDetails regularCategoryDetails = getRegularCategoryDetails(regularCategoryType,
							slabConfig);
					return calculateDiscountValue(discount, regularCategoryDetails,
							abCoDiscountRequestDto.getItemDetails(), businessDate,
							discountDetailsConfig.getSlabConfigDetails(), true, responseObject);
				}
			}
		}
		return new DiscountDetailsResponseDto();
	}

	private BigDecimal getInputValueForSlabAndHighValueDiscount(DiscountDetailsConfigRequestDto discountDetailsConfig,
			DiscountItemDetailsReqDto itemDetails) {
		String discountCategory = discountDetailsConfig.getSlabConfigDetails().getDiscountCategory();
		String eligibiltyDetails = discountDetailsConfig.getSlabConfigDetails().getEligibilityDetails();
		if (discountCategory.equals(DiscountCategoryEnum.WEIGHT_BASED.name())) {
			if (DiscountEligibilityEnum.GROSS_WEIGHT.toString().equalsIgnoreCase(eligibiltyDetails)) {
				return itemDetails.getTotalWeight();
			} else {
				return itemDetails.getPriceDetails().getNetWeight();
			}
		} else if (discountCategory.equals(DiscountCategoryEnum.VALUE_BASED.name())) {
			if (DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.toString().equalsIgnoreCase(eligibiltyDetails)) {
				return itemDetails.getTotalValue();
			} else {
				return itemDetails.getTotalValue().add(itemDetails.getTotalTax());
			}
		} else if (discountCategory.equals(DiscountCategoryEnum.CARAT_BASED.name())) {
			ItemLotStoneListDto lotItemStones = productService.getLotItemStonesWithDICheck(itemDetails.getItemCode(),
					itemDetails.getLotNumber(),true, true);
			if (DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.toString().equalsIgnoreCase(eligibiltyDetails)) {
				Optional<ItemLotStoneBaseDto> itemLotStone = lotItemStones.getLotStoneDetails().stream()
						.max(Comparator.comparing(ItemLotStoneBaseDto::getStoneWeight));
				if (itemLotStone.isPresent()) {
					return itemLotStone.get().getStoneWeight();
				}
			} else {
				return getCumaltiveWeightForCaratSlab(lotItemStones.getLotStoneDetails(),
						discountDetailsConfig.getDiscountId());
			}
		}
		return null;
	}

	/**
	 * @param regularCategoryType
	 * @param slabConfig
	 * @return
	 */
	private RegularCategoryDetails getRegularCategoryDetails(String regularCategoryType, SlabConfig slabConfig) {

		if (regularCategoryType != null && regularCategoryType.equalsIgnoreCase("AB")) {
			return slabConfig.getAbDiscountComponent();
		} else if (regularCategoryType != null && regularCategoryType.equalsIgnoreCase("PREVIEW")) {
			return slabConfig.getPreviewDiscountComponent();
		} else if (regularCategoryType != null && regularCategoryType.equalsIgnoreCase("REGULAR")) {
			return slabConfig.getRegularDiscountComponent();
		} else {
			return slabConfig.getCoDiscountComponent();
		}
	}

	@Override
	public SlabBasedDiscountDetailsResponseDto calculateAbCoDiscountValueForSlabBasedDiscounts(
			AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto) {
		String discountCategory = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getSlabConfigDetails()
				.getDiscountCategory();
		abCoSlabDiscountRequestDto
				.setBusinessDate(CalendarUtils.getStartOfDay(abCoSlabDiscountRequestDto.getBusinessDate()));

		String discountId = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getAppliedDiscountMaster()
				.getId();
		String discountType = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getAppliedDiscountMaster()
				.getDiscountType();

		// validate each item details from request for the given discountId
		List<DiscountItemDetailsReqDto> validDiscountItemDetailsReq = new ArrayList<>();
		List<String> discountLinkIds = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto()
				.getLinkDiscountDetails() != null
						? abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getLinkDiscountDetails()
								.getLinkDiscountDetails()
						: null;
		for (DiscountItemDetailsReqDto discountItemDetailsReqDto : abCoSlabDiscountRequestDto.getItemDetails()) {

			Boolean isValidItem = discountUtilService.validateItemRequestDetailsForAbToCmCumulativeDiscount(
					discountItemDetailsReqDto, abCoSlabDiscountRequestDto);
			if (BooleanUtils.isTrue(isValidItem) && (CollectionUtils
					.isEmpty(discountItemDetailsReqDto.getDiscountTypeAndIdAppliedOnItem())
					|| (discountId
							.equals(discountItemDetailsReqDto.getDiscountTypeAndIdAppliedOnItem().get(discountType)))
					|| (!CollectionUtil.isEmpty(discountLinkIds)
							&& discountItemDetailsReqDto.getDiscountTypeAndIdAppliedOnItem()
									.containsKey(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name())
							&& discountLinkIds.contains(discountItemDetailsReqDto.getDiscountTypeAndIdAppliedOnItem()
									.get(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name()))))) {
				validDiscountItemDetailsReq.add(discountItemDetailsReqDto);
			}
		}
		if (CollectionUtils.isEmpty(validDiscountItemDetailsReq)) {
			return new SlabBasedDiscountDetailsResponseDto();
		}

		List<SlabItemDetailsDto> slabItemResponseList = null;
		SlabBasedDiscountDetailsResponseDto slabBasedDiscountEngineResponseDto = new SlabBasedDiscountDetailsResponseDto();

		if (DiscountCategoryEnum.WEIGHT_BASED.toString().equalsIgnoreCase(discountCategory)) {
			slabItemResponseList = validateAbCoWeightBasedSlab(abCoSlabDiscountRequestDto,
					slabBasedDiscountEngineResponseDto);
		} else if (DiscountCategoryEnum.VALUE_BASED.toString().equalsIgnoreCase(discountCategory)) {
			slabItemResponseList = validateAbCoValueBasedSlab(abCoSlabDiscountRequestDto,
					slabBasedDiscountEngineResponseDto);
		}else if (DiscountCategoryEnum.CARAT_BASED.toString().equalsIgnoreCase(discountCategory)) {
			slabItemResponseList = validateAbCoCaratBasedSlab(abCoSlabDiscountRequestDto, slabBasedDiscountEngineResponseDto);
		}

		slabBasedDiscountEngineResponseDto.setItemDiscountDetails(slabItemResponseList);
		return slabBasedDiscountEngineResponseDto;
	}

	private List<SlabItemDetailsDto> validateAbCoCaratBasedSlab(AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto,
			SlabBasedDiscountDetailsResponseDto slabBasedDiscountEngineResponseDto) {
		List<SlabItemDetailsDto> slabItemResponseList = new ArrayList<>();
				// if Single product and validating if all productGroups are common
				Boolean isSingle = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getSlabConfigDetails()
						.getIsSingle();
				String eligibility = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getSlabConfigDetails()
						.getEligibilityDetails();
				DiscountDao discount = discountUtilService.mapDiscountDao(
						abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getAppliedDiscountMaster());
				if ((isSingle && validateCommonProductGroups(abCoSlabDiscountRequestDto.getItemDetails())) || !isSingle) {
					List<DiscountItemDetailsReqDto> itemDetails = abCoSlabDiscountRequestDto.getItemDetails();
					for (DiscountItemDetailsReqDto requestItemDetail : itemDetails) {
						for (SlabConfig slabConfig : abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto()
								.getSlabDiscountComponents().getSlabConfigs()) {
							BigDecimal singleStoneMaxWeightSum = getMaxSingleStoneWeightInKaratBasedSlab(itemDetails);
							if (DiscountEligibilityEnum.SINGLE_STONE.toString().equalsIgnoreCase(eligibility)) {
								SlabItemDetailsDto validValueBasedSlab = calculateAbCoSlabDiscountComponent(slabConfig,
										singleStoneMaxWeightSum, requestItemDetail, abCoSlabDiscountRequestDto, discount,
										slabBasedDiscountEngineResponseDto);
								checkIfNotNull(validValueBasedSlab, slabItemResponseList);
							} else if (DiscountEligibilityEnum.CUMULATIVE_STONE.toString().equalsIgnoreCase(eligibility)) {
								BigDecimal totalKarat = getMaxSumStoneWeightInKaratBasedSlab(itemDetails, discount.getId());
								SlabItemDetailsDto validValueBasedSlab = calculateAbCoSlabDiscountComponent(slabConfig,
										totalKarat, requestItemDetail, abCoSlabDiscountRequestDto, discount,
										slabBasedDiscountEngineResponseDto);
								checkIfNotNull(validValueBasedSlab, slabItemResponseList);
							}
						}
					}
	}
				return slabItemResponseList;
	}
	private BigDecimal getMaxSingleStoneWeightInKaratBasedSlab(
						List<DiscountItemDetailsReqDto> validDiscountItemDetailsReq) {
					BigDecimal singleStoneMaxWeight = BigDecimal.ZERO;
					for (DiscountItemDetailsReqDto requestItemDetail : validDiscountItemDetailsReq) {
						ItemLotStoneListDto lotItemStones = productService.getLotItemStonesWithDICheck(requestItemDetail.getItemCode(),
								requestItemDetail.getLotNumber(), true,false);
						if (CollectionUtils.isEmpty(lotItemStones.getLotStoneDetails())) {
							throw new ServiceException(ConfigConstants.NO_STONE_DETAILS_FOUND, ConfigConstants.ERR_CONFIG_149);
						} else {
							Optional<ItemLotStoneBaseDto> itemLotStone = lotItemStones.getLotStoneDetails().stream()
									.max(Comparator.comparing(ItemLotStoneBaseDto::getStoneWeight));
							if (itemLotStone.isPresent()) {
								singleStoneMaxWeight = itemLotStone.get().getStoneWeight();
							}
						}
					}
					return singleStoneMaxWeight;
				}
	private BigDecimal getMaxSumStoneWeightInKaratBasedSlab(List<DiscountItemDetailsReqDto> validDiscountItemDetailsReq,
			String discountId) {
		BigDecimal cumulativeStoneMaxWeight = BigDecimal.ZERO;
		for (DiscountItemDetailsReqDto requestItemDetail : validDiscountItemDetailsReq) {
			ItemLotStoneListDto lotItemStones = productService.getLotItemStonesWithDICheck(requestItemDetail.getItemCode(),
					requestItemDetail.getLotNumber(), true,false);
			if (CollectionUtils.isEmpty(lotItemStones.getLotStoneDetails())) {
				throw new ServiceException(ConfigConstants.NO_STONE_DETAILS_FOUND, ConfigConstants.ERR_CONFIG_149);
			} else {
				cumulativeStoneMaxWeight = getCumaltiveWeightForCaratSlab(lotItemStones.getLotStoneDetails(),
						discountId);
			}
		}
		return cumulativeStoneMaxWeight;
	}

	private List<SlabItemDetailsDto> validateAbCoWeightBasedSlab(AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto,
			SlabBasedDiscountDetailsResponseDto slabBasedDiscountEngineResponseDto) {

		List<SlabItemDetailsDto> slabItemResponseList = new ArrayList<>();
		// if Single product and validating if all productGroups are common
		boolean isSingle = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getSlabConfigDetails()
				.getIsSingle();

		Map<String, List<DiscountItemDetailsReqDto>> itemsGroupedByProductGroup = null;
		// if Single product and validating if all productGroups are common
		if (BooleanUtils.isTrue(isSingle)) {
			itemsGroupedByProductGroup = abCoSlabDiscountRequestDto.getItemDetails().stream()
					.collect(Collectors.groupingBy(DiscountItemDetailsReqDto::getProductGroupCode));
		}

		String eligibility = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getSlabConfigDetails()
				.getEligibilityDetails();
		DiscountDao discount = discountUtilService.mapDiscountDao(
				abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getAppliedDiscountMaster());
		List<DiscountItemDetailsReqDto> itemDetails = abCoSlabDiscountRequestDto.getItemDetails();
		for (DiscountItemDetailsReqDto requestItemDetail : itemDetails) {
			for (SlabConfig slabConfig : abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto()
					.getSlabDiscountComponents().getSlabConfigs()) {
				if (DiscountEligibilityEnum.GROSS_WEIGHT.toString().equalsIgnoreCase(eligibility)) {
					// Gross Weight from itemDetail Request
					BigDecimal totalWeight;
					if (BooleanUtils.isTrue(isSingle)) {
						totalWeight = itemsGroupedByProductGroup.get(requestItemDetail.getProductGroupCode()).stream()
								.map(DiscountItemDetailsReqDto::getTotalWeight)
								.reduce(BigDecimal.ZERO, BigDecimal::add);
					} else {
						totalWeight = abCoSlabDiscountRequestDto.getItemDetails().stream()
								.map(DiscountItemDetailsReqDto::getTotalWeight)
								.reduce(BigDecimal.ZERO, BigDecimal::add);
					}

					SlabItemDetailsDto validWeightBasedSlab = calculateAbCoSlabDiscountComponent(slabConfig,
							totalWeight, requestItemDetail, abCoSlabDiscountRequestDto, discount,
							slabBasedDiscountEngineResponseDto);
					checkIfNotNull(validWeightBasedSlab, slabItemResponseList);
				} else if (DiscountEligibilityEnum.NET_WEIGHT.toString().equalsIgnoreCase(eligibility)) {
					// net Weight from itemDetail Request
					BigDecimal totalWeight;
					if (BooleanUtils.isTrue(isSingle)) {
						totalWeight = itemsGroupedByProductGroup.get(requestItemDetail.getProductGroupCode()).stream()
								.map(dis -> dis.getPriceDetails().getNetWeight())
								.reduce(BigDecimal.ZERO, BigDecimal::add);
					} else {
						totalWeight = abCoSlabDiscountRequestDto.getItemDetails().stream()
								.map(dis -> dis.getPriceDetails().getNetWeight())
								.reduce(BigDecimal.ZERO, BigDecimal::add);
					}

					SlabItemDetailsDto validWeightBasedSlab = calculateAbCoSlabDiscountComponent(slabConfig,
							totalWeight, requestItemDetail, abCoSlabDiscountRequestDto, discount,
							slabBasedDiscountEngineResponseDto);
					checkIfNotNull(validWeightBasedSlab, slabItemResponseList);
				}
			}
		}
//		if (CollectionUtil.isEmpty(slabItemResponseList)) {
//			throw new ServiceException("The cumulative weight does not belong to any slab",
//					ConfigConstants.ERR_CONFIG_154, Map.of(ConfigConstants.SLAB_TYPE, "weight"));
//		}
		return slabItemResponseList;
	}

	private List<SlabItemDetailsDto> validateAbCoValueBasedSlab(AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto,
			SlabBasedDiscountDetailsResponseDto slabBasedDiscountEngineResponseDto) {

		List<SlabItemDetailsDto> slabItemResponseList = new ArrayList<>();
		// if Single product and validating if all productGroups are common
		boolean isSingle = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getSlabConfigDetails()
				.getIsSingle();
		Map<String, List<DiscountItemDetailsReqDto>> itemsGroupedByProductGroup = null;
		// if Single product and validating if all productGroups are common
		if (BooleanUtils.isTrue(isSingle)) {
			itemsGroupedByProductGroup = abCoSlabDiscountRequestDto.getItemDetails().stream()
					.collect(Collectors.groupingBy(DiscountItemDetailsReqDto::getProductGroupCode));
		}

		String eligibility = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getSlabConfigDetails()
				.getEligibilityDetails();
		DiscountDao discount = discountUtilService.mapDiscountDao(
				abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getAppliedDiscountMaster());
		List<DiscountItemDetailsReqDto> itemDetails = abCoSlabDiscountRequestDto.getItemDetails();
		for (DiscountItemDetailsReqDto requestItemDetail : itemDetails) {
			for (SlabConfig slabConfig : abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto()
					.getSlabDiscountComponents().getSlabConfigs()) {
				BigDecimal totalValue;
				BigDecimal totalTax;
				if (BooleanUtils.isTrue(isSingle)) {
					totalValue = itemsGroupedByProductGroup.get(requestItemDetail.getProductGroupCode()).stream()
							.map(DiscountItemDetailsReqDto::getTotalValue).reduce(BigDecimal.ZERO, BigDecimal::add);
					totalTax = itemsGroupedByProductGroup.get(requestItemDetail.getProductGroupCode()).stream()
							.map(DiscountItemDetailsReqDto::getTotalTax).reduce(BigDecimal.ZERO, BigDecimal::add);
				} else {
					totalValue = abCoSlabDiscountRequestDto.getItemDetails().stream()
							.map(DiscountItemDetailsReqDto::getTotalValue).reduce(BigDecimal.ZERO, BigDecimal::add);
					totalTax = abCoSlabDiscountRequestDto.getItemDetails().stream()
							.map(DiscountItemDetailsReqDto::getTotalTax).reduce(BigDecimal.ZERO, BigDecimal::add);
				}
				if (DiscountEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.toString().equalsIgnoreCase(eligibility)) {
					SlabItemDetailsDto validValueBasedSlab = calculateAbCoSlabDiscountComponent(slabConfig, totalValue,
							requestItemDetail, abCoSlabDiscountRequestDto, discount,
							slabBasedDiscountEngineResponseDto);
					checkIfNotNull(validValueBasedSlab, slabItemResponseList);
				} else if (DiscountEligibilityEnum.PRE_DISCOUNT_TAX.toString().equalsIgnoreCase(eligibility)) {
					// PRE_DISCOUNT_TAX from itemDetail Request
					BigDecimal totalValuePlusTax = totalValue.add(totalTax);
					SlabItemDetailsDto validValueBasedSlab = calculateAbCoSlabDiscountComponent(slabConfig,
							totalValuePlusTax, requestItemDetail, abCoSlabDiscountRequestDto, discount,
							slabBasedDiscountEngineResponseDto);
					checkIfNotNull(validValueBasedSlab, slabItemResponseList);
				}
			}
		}
//		if (CollectionUtil.isEmpty(slabItemResponseList)) {
//			throw new ServiceException("The cumulative value does not belong to any slab",
//					ConfigConstants.ERR_CONFIG_154, Map.of(ConfigConstants.SLAB_TYPE, "value"));
//		}
		return slabItemResponseList;
	}

	private SlabItemDetailsDto calculateAbCoSlabDiscountComponent(SlabConfig slabConfig, BigDecimal totalWeightValue,
			DiscountItemDetailsReqDto requestItemDetails, AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto,
			DiscountDao validDiscountObj, SlabBasedDiscountDetailsResponseDto slabBasedDiscountEngineResponseDto) {

		DiscountDetailsResponseDto responseDto = null;

		DiscountOrderConfigDetails orderDetail = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto()
				.getOrderConfigDetails();
		LocationOfferDetails locationDetails = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto()
				.getLocationOfferDetails();
		TransactionDetailsDto transactionDetails = abCoSlabDiscountRequestDto.getTransactionDetails();
		Date offerEndDate = CalendarUtils.getStartOfDay(locationDetails.getOfferEndDate());
		Date offerStartDate = CalendarUtils.getStartOfDay(locationDetails.getOfferStartDate());
		Date businessDate = CalendarUtils.getStartOfDay(abCoSlabDiscountRequestDto.getBusinessDate());
		int gracePeriod = 0;
		if (orderDetail != null && orderDetail.getOfferPeriodForAB() != null
				&& transactionDetails.getRefTxnType() != null && transactionDetails.getRefTxnType().equals("AB"))
			gracePeriod = orderDetail.getOfferPeriodForAB();
		else if(orderDetail != null && orderDetail.getOfferPeriodForCO() != null)
			gracePeriod = orderDetail.getOfferPeriodForCO();

		SlabItemDetailsDto itemDetail = new SlabItemDetailsDto();
		DiscountDetailsResponseDto responseObject = new DiscountDetailsResponseDto();
		String regularCategoryType = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto()
				.getAppliedDiscountComponentType();
		DiscountDetailsBaseDto detailsResponseDto = new DiscountDetailsBaseDto();
		detailsResponseDto.setAppliedDiscountComponentType(regularCategoryType);
		detailsResponseDto.setAppliedDiscountComponent(
				abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getAppliedDiscountComponent());
		detailsResponseDto.setSlabDiscountComponents(
				abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getSlabDiscountComponents());
		responseObject.setDiscountConfigDetails(detailsResponseDto);

		if (checkIfItBelongsToSlab(slabConfig.getMinValue(), slabConfig.getMaxValue(), totalWeightValue)
				&& checkAbOfferPeriod(businessDate, offerStartDate, offerEndDate, gracePeriod)) {
			String discountId = validDiscountObj.getId();
			DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
			JsonData abCoJsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(validDiscountObj.getAbCoData()), JsonData.class);
			AbCoDetails abCoDetails = MapperUtil.mapObjToClass(abCoJsonData.getData(), AbCoDetails.class);
			RegularCategoryDetails regularDetails = null;

			if(transactionDetails.getRefTxnType() != null && transactionDetails.getRefTxnType().equals("AB")) {
				regularDetails = getRegularCategoryDetails(regularCategoryType, slabConfig);
			}else {			
				for (AbDiscount abvalue : abCoDetails.getAbDiscount()) {
					regularDetails = getAbCoSlabDiscountComponent(abvalue, abCoSlabDiscountRequestDto.getBusinessDate(),
						discountId, slabConfig);
				}
			}

			

			Boolean isSingle = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getSlabConfigDetails()
					.getIsSingle();
			String eligibility = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getSlabConfigDetails()
					.getEligibilityDetails();
			String discountCategory = abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto()
					.getSlabConfigDetails().getDiscountCategory();
			SlabConfigDetails slabConfigDetails = new SlabConfigDetails();
			slabConfigDetails.setDiscountCategory(discountCategory);
			slabConfigDetails.setEligibilityDetails(eligibility);
			slabConfigDetails.setIsSingle(isSingle);
			responseDto = calculateDiscountValue(validDiscountObj, regularDetails, requestItemDetails,
					abCoSlabDiscountRequestDto.getBusinessDate(), slabConfigDetails, false, responseObject);

			itemDetail.setDiscountValue(responseDto.getDiscountValue());
			itemDetail.setDiscountValueDetails(responseDto.getDiscountValueDetails());
			itemDetail.setItemCode(requestItemDetails.getItemCode());
			itemDetail.setItemId(requestItemDetails.getItemId());
			itemDetail.setLotNumber(requestItemDetails.getLotNumber());
			itemDetail.setCummulativeDiscountWithExcludeDetails(Map.of(validDiscountObj.getId(),
					(new CummulativeDiscountWithExcludeDto(validDiscountObj.getId(), slabConfig.getId(),
							requestItemDetails.getIsExclude(), validDiscountObj.getDiscountType()))));

			if (slabBasedDiscountEngineResponseDto.getDiscountConfigDetails() == null) {
				slabBasedDiscountEngineResponseDto.setDiscountConfigDetails(responseDto.getDiscountConfigDetails());
			}
		}
		return itemDetail;
	}

	private RegularCategoryDetails getAbCoSlabDiscountComponent(AbDiscount abValue, Date businessDate,
			String discountId, SlabConfig slabConfig) {
		// TODO Auto-generated method stub
		DiscountLocationMappingDao discountComponent = null;
		discountComponent = discountLocationMappingRepository.getEmpowermentLocationConfigDetails(discountId,
				CommonUtil.getLocationCode());
		// if AB or Post AB is enabled in abCoObject, get ABConfigDetails
		if (Boolean.TRUE.equals(abValue.getPreview() && ((businessDate.after(discountComponent.getPreviewStartDate())
				&& businessDate.before(discountComponent.getPreviewEndDate()))
				|| businessDate.equals(discountComponent.getPreviewEndDate())))) {
			return slabConfig.getPreviewDiscountComponent();

		} else {

			if (Boolean.TRUE.equals(abValue.getAb()) || Boolean.TRUE.equals(abValue.getPostAB())) {

				return slabConfig.getAbDiscountComponent();
			}
			// get Regular Config Details -default
			else {
				return slabConfig.getRegularDiscountComponent();
			}
		}

	}

	@Override
	public DiscountEngineResponseDto autoApplyBestDiscount(DiscountAutoCalRequestDto discountAutoCalRequestDto) {
		DiscountEngineResponseDto discountEngineResponseDto = null;

		discountAutoCalRequestDto.getDiscountRequestDto().setBusinessDate(
				CalendarUtils.getStartOfDay(discountAutoCalRequestDto.getDiscountRequestDto().getBusinessDate()));
		boolean throwError = false;
		DiscountItemLevelResponseDto itemLevelDiscountResponse = getDiscountsAtItemLevel(
				discountAutoCalRequestDto.getDiscountRequestDto(), throwError);

		if (itemLevelDiscountResponse == null) {
			return discountEngineResponseDto;
		}

		// validating discounts
		validateItemLevelDiscountResponse(itemLevelDiscountResponse);

		// 1st priority -> check box discount
		discountEngineResponseDto = checkBoxDiscount(itemLevelDiscountResponse, discountAutoCalRequestDto);
		if (discountEngineResponseDto != null) {
			return discountEngineResponseDto;
		}

		// 2nd priority -> check encircle in club discount
		discountEngineResponseDto = checkEncircleClubDiscount(itemLevelDiscountResponse, discountAutoCalRequestDto);
		if (discountEngineResponseDto != null) {
			return discountEngineResponseDto;
		}

		// 3rd priority -> check encircle in normal discount
		discountEngineResponseDto = checkEncircleDiscount(itemLevelDiscountResponse, discountAutoCalRequestDto);
		if (discountEngineResponseDto != null) {
			return discountEngineResponseDto;
		}

		// 4th priority -> check for any club discount
		discountEngineResponseDto = checkClubDiscount(itemLevelDiscountResponse.getClubDiscounts(),
				discountAutoCalRequestDto, itemLevelDiscountResponse.getCummulativeDiscountWithExcludeDetails());
		if (discountEngineResponseDto != null) {
			return discountEngineResponseDto;
		}

		// 5th priority -> check for any discount
		discountEngineResponseDto = getMaxDiscountValue(itemLevelDiscountResponse.getDiscounts(),
				discountAutoCalRequestDto, itemLevelDiscountResponse.getCummulativeDiscountWithExcludeDetails());
		if (discountEngineResponseDto != null) {
			return discountEngineResponseDto;
		}

		return discountEngineResponseDto;
	}

	private void validateItemLevelDiscountResponse(DiscountItemLevelResponseDto itemLevelDiscountResponse) {
		List<DiscountDetailsBaseResponseDto> discounts = new ArrayList<>();
		for (DiscountDetailsBaseResponseDto discount : itemLevelDiscountResponse.getDiscounts()) {
			if (checkAutoDiscountFlag(discount)) {
				discounts.add(discount);
			}
		}
		List<ClubbingDiscountDetailsDto> clubDiscounts = new ArrayList<>();
		for (ClubbingDiscountDetailsDto clubDiscount : itemLevelDiscountResponse.getClubDiscounts()) {
			boolean allClubDiscountsEligible = true;
			for (DiscountDetailsBaseResponseDto discount : clubDiscount.getDiscounts()) {
				if (!checkAutoDiscountFlag(discount)) {
					allClubDiscountsEligible = false;
				}
			}
			if (allClubDiscountsEligible) {
				clubDiscounts.add(clubDiscount);
			}
		}
		itemLevelDiscountResponse.setDiscounts(discounts);
		itemLevelDiscountResponse.setClubDiscounts(clubDiscounts);
	}

	private boolean checkAutoDiscountFlag(DiscountDetailsBaseResponseDto discount) {

		// only for the below discounts we need to check this flag
		List<String> discountTypeList = Arrays.asList("CATEGORY_DISCOUNT", "SLAB_BASED_DISCOUNT",
				"ITEM_GROUP_LEVEL_DISCOUNT", "BEST_DEAL_DISCOUNT", "HIGH_VALUE_DISCOUNT");

		return !discountTypeList.contains(discount.getDiscountConfigDetails().getDiscountType())
				|| (discount.getDiscountConfigDetails() != null
						&& discount.getDiscountConfigDetails().getBasicCriteriaDetails() != null
						&& BooleanUtils.isTrue(discount.getDiscountConfigDetails().getBasicCriteriaDetails()
								.getIsApplicableForAutomatedDiscount()));
	}

	private DiscountEngineResponseDto checkBoxDiscount(DiscountItemLevelResponseDto itemLevelDiscountResponse,
			DiscountAutoCalRequestDto discountAutoCalRequestDto) {
		Date appliedDate = null;
		String discountType = null;
		if (discountAutoCalRequestDto.getDiscountRequestDto().getEmployeeDetails() != null) {
			appliedDate = discountAutoCalRequestDto.getDiscountRequestDto().getEmployeeDetails().getAppliedDate();
			discountType = DiscountTypeEnum.EMPLOYEE_DISCOUNT.name();
		}
		if (discountAutoCalRequestDto.getDiscountRequestDto().getTataEmployeeDetails() != null
				&& (appliedDate == null || appliedDate.compareTo(discountAutoCalRequestDto.getDiscountRequestDto()
						.getTataEmployeeDetails().getAppliedDate()) >= 0)) {
			appliedDate = discountAutoCalRequestDto.getDiscountRequestDto().getTataEmployeeDetails().getAppliedDate();
			discountType = DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.name();
		}
		if (discountAutoCalRequestDto.getDiscountRequestDto().getTsssDetails() != null
				&& (appliedDate == null || appliedDate.compareTo(
						discountAutoCalRequestDto.getDiscountRequestDto().getTsssDetails().getAppliedDate()) >= 0)) {
			appliedDate = discountAutoCalRequestDto.getDiscountRequestDto().getTsssDetails().getAppliedDate();
			discountType = DiscountTypeEnum.TSSS_DISCOUNT.name();
		}
		if (discountAutoCalRequestDto.getDiscountRequestDto().getEmpowermentDetails() != null
				&& discountAutoCalRequestDto.getDiscountRequestDto().getEmpowermentDetails().getAppliedDate() != null
				&& (appliedDate == null || appliedDate.compareTo(discountAutoCalRequestDto.getDiscountRequestDto()
						.getEmpowermentDetails().getAppliedDate()) >= 0)) {
			discountType = DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name();
		}
		if (StringUtils.isEmpty(discountType)) {
			return null;
		}
		return checkBoxDiscount(itemLevelDiscountResponse, discountAutoCalRequestDto, discountType);
	}

	private DiscountEngineResponseDto checkBoxDiscount(DiscountItemLevelResponseDto itemLevelDiscountResponse,
			DiscountAutoCalRequestDto discountAutoCalRequestDto, String discountType) {

		// checking for club check box discount
		List<ClubbingDiscountDetailsDto> clubDiscounts = new ArrayList<>();
		for (ClubbingDiscountDetailsDto clubDiscount : itemLevelDiscountResponse.getClubDiscounts()) {
			for (DiscountDetailsBaseResponseDto discount : clubDiscount.getDiscounts()) {
				if (discount.getDiscountConfigDetails().getDiscountType().equalsIgnoreCase(discountType)) {
					clubDiscounts.add(clubDiscount);
					break;
				}
			}
		}
		DiscountEngineResponseDto response = null;
		if (!CollectionUtils.isEmpty(clubDiscounts)) {
			response = checkClubDiscount(clubDiscounts, discountAutoCalRequestDto,
					itemLevelDiscountResponse.getCummulativeDiscountWithExcludeDetails());
			if (response != null) {
				return response;
			}
		}

		// checking for individual check box discount
		List<DiscountDetailsBaseResponseDto> discounts = new ArrayList<>();
		for (DiscountDetailsBaseResponseDto discount : itemLevelDiscountResponse.getDiscounts()) {
			if (discount.getDiscountConfigDetails().getDiscountType().equalsIgnoreCase(discountType)) {
				discounts.add(discount);
			}
		}
		if (!CollectionUtils.isEmpty(discounts)) {
			response = getMaxDiscountValue(discounts, discountAutoCalRequestDto,
					itemLevelDiscountResponse.getCummulativeDiscountWithExcludeDetails());
			if (response != null) {
				return response;
			}
		}
		return null;
	}

	private DiscountEngineResponseDto checkEncircleClubDiscount(DiscountItemLevelResponseDto itemLevelDiscountResponse,
			DiscountAutoCalRequestDto discountAutoCalRequestDto) {

		// 1st priority clubbing encircle discount
		List<ClubbingDiscountDetailsDto> encircleClubDiscounts = new ArrayList<>();
		for (ClubbingDiscountDetailsDto clubDiscount : itemLevelDiscountResponse.getClubDiscounts()) {
			for (DiscountDetailsBaseResponseDto discount : clubDiscount.getDiscounts()) {
				if (discount.getDiscountConfigDetails().getDiscountType().startsWith("ULP")) {
					encircleClubDiscounts.add(clubDiscount);
				}
			}
		}
		if (!CollectionUtils.isEmpty(encircleClubDiscounts)) {
			return checkClubDiscount(encircleClubDiscounts, discountAutoCalRequestDto,
					itemLevelDiscountResponse.getCummulativeDiscountWithExcludeDetails());
		}
		return null;
	}

	private DiscountEngineResponseDto checkClubDiscount(List<ClubbingDiscountDetailsDto> clubDiscounts,
			DiscountAutoCalRequestDto discountAutoCalRequestDto,
			Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails) {
		if (!CollectionUtils.isEmpty(clubDiscounts)) {
			List<ClubbingDiscountDetailsDto> maxClubDiscounts = getMaxClubDiscounts(clubDiscounts);
			// if multiple club discounts are there then max discount value is
			// selected
			DiscountEngineResponseDto autoDiscountResponse = new DiscountEngineResponseDto();
			BigDecimal maxSumClubDiscount = BigDecimal.ZERO;
			List<DiscountDetailsResponseDto> discountDetailsResponseDto = null;
			for (ClubbingDiscountDetailsDto clubDiscount : maxClubDiscounts) {
				BigDecimal clubDiscountValue = BigDecimal.ZERO;
				discountDetailsResponseDto = new ArrayList<>();
				for (DiscountDetailsBaseResponseDto discount : clubDiscount.getDiscounts()) {
					DiscountDetailsResponseDto calculateDiscountResponse = calculateDiscount(null,
							discount.getDiscountConfigDetails().getDiscountId(),
							getCalRequestBody(discountAutoCalRequestDto.getDiscountRequestDto().getBusinessDate(),
									discountAutoCalRequestDto.getItemDetails(),
									discountAutoCalRequestDto.getCustomerDetails(),
									discountAutoCalRequestDto.getCumulativeItemDetails(),
									discountAutoCalRequestDto.getDiscountRequestDto().getTransactionDetails(),
									discount.getRivaahGhsDetails(), cummulativeDiscountWithExcludeDetails),
							discount.getDiscountConfigDetails().getLocationOfferDetails().getOfferEndDate(), null);
					clubDiscountValue = clubDiscountValue.add(calculateDiscountResponse.getDiscountValue());
					discountDetailsResponseDto.add(calculateDiscountResponse);
				}
				if (clubDiscountValue.compareTo(discountAutoCalRequestDto.getItemDetails().getTotalValue()) > 0) {
					throw new ServiceException(
							"Auto applied discount value is greater than the item value. Please manually select other discount",
							"ERR-CONFIG-163");
				} else if (clubDiscountValue.compareTo(maxSumClubDiscount) > 0) {
					maxSumClubDiscount = clubDiscountValue;
					autoDiscountResponse.setClubbingId(clubDiscount.getClubbingId());
					autoDiscountResponse.setDiscountDetailsResponseDto(discountDetailsResponseDto);
				}
			}
			autoDiscountResponse.setCummulativeDiscountWithExcludeDetails(cummulativeDiscountWithExcludeDetails);
			return autoDiscountResponse;
		}
		return null;
	}

	private DiscountEngineResponseDto checkEncircleDiscount(DiscountItemLevelResponseDto itemLevelDiscountResponse,
			DiscountAutoCalRequestDto discountAutoCalRequestDto) {

		List<DiscountDetailsBaseResponseDto> discounts = new ArrayList<>();
		for (DiscountDetailsBaseResponseDto discount : itemLevelDiscountResponse.getDiscounts()) {
			if (discount.getDiscountConfigDetails().getDiscountType().startsWith("ULP")) {
				discounts.add(discount);
			}
		}
		if (!CollectionUtils.isEmpty(discounts)) {
			return getMaxDiscountValue(discounts, discountAutoCalRequestDto,
					itemLevelDiscountResponse.getCummulativeDiscountWithExcludeDetails());
		}
		return null;
	}

	private DiscountEngineResponseDto getMaxDiscountValue(List<DiscountDetailsBaseResponseDto> discounts,
			DiscountAutoCalRequestDto discountAutoCalRequestDto,
			Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails) {
		if (!CollectionUtils.isEmpty(discounts)) {
			DiscountEngineResponseDto autoDiscountResponse = new DiscountEngineResponseDto();
			BigDecimal maxDiscountValue = BigDecimal.ZERO;
			DiscountDetailsResponseDto maxDiscount = null;
			for (DiscountDetailsBaseResponseDto discount : discounts) {
				DiscountDetailsResponseDto calculateDiscountResponse = calculateDiscount(null,
						discount.getDiscountConfigDetails().getDiscountId(),
						getCalRequestBody(discountAutoCalRequestDto.getDiscountRequestDto().getBusinessDate(),
								discountAutoCalRequestDto.getItemDetails(),
								discountAutoCalRequestDto.getCustomerDetails(),
								discountAutoCalRequestDto.getCumulativeItemDetails(),
								discountAutoCalRequestDto.getDiscountRequestDto().getTransactionDetails(),
								discount.getRivaahGhsDetails(), cummulativeDiscountWithExcludeDetails),
						null, null);
				if (calculateDiscountResponse.getDiscountValue()
						.compareTo(discountAutoCalRequestDto.getItemDetails().getTotalValue()) > 0) {
					throw new ServiceException(
							"Auto applied discount value is greater than the item value. Please manually select other discount",
							"ERR-CONFIG-163");
				} else if (calculateDiscountResponse.getDiscountValue().compareTo(maxDiscountValue) >= 0) {
					maxDiscountValue = calculateDiscountResponse.getDiscountValue();
					maxDiscount = calculateDiscountResponse;
					autoDiscountResponse.setDiscountDetailsResponseDto(Arrays.asList(maxDiscount));
				}
			}
			autoDiscountResponse.setCummulativeDiscountWithExcludeDetails(cummulativeDiscountWithExcludeDetails);
			return autoDiscountResponse;
		}
		return null;
	}

	private List<ClubbingDiscountDetailsDto> getMaxClubDiscounts(List<ClubbingDiscountDetailsDto> clubDiscounts) {
		int maxClubSize = 0;
		List<ClubbingDiscountDetailsDto> maxClubDiscounts = new ArrayList<>();
		for (ClubbingDiscountDetailsDto clubDiscount : clubDiscounts) {
			if (clubDiscount.getDiscounts().size() > maxClubSize) {
				maxClubSize = clubDiscount.getDiscounts().size();
			}
		}
		for (ClubbingDiscountDetailsDto clubDiscount : clubDiscounts) {
			if (clubDiscount.getDiscounts().size() == maxClubSize) {
				maxClubDiscounts.add(clubDiscount);
			}
		}
		return maxClubDiscounts;
	}

	private DiscountCalRequestDto getCalRequestBody(Date businessDate, DiscountItemDetailsReqDto itemDetails,
			DiscountCustDetails customerDetails, CumulativeItemDetails cumulativeItemDetails,
			TransactionDetailsDto transactionDetails, RivaahGhsDiscountDto rivaahGhsDetails,
			Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails) {

		DiscountCalRequestDto calRequestBody = new DiscountCalRequestDto();
		// removing time part of businessDate
		calRequestBody.setBusinessDate(CalendarUtils.getStartOfDay(businessDate));
		calRequestBody.setItemDetails(itemDetails);
		calRequestBody.setCustomerDetails(customerDetails);
		calRequestBody.setCumulativeItemDetails(cumulativeItemDetails);
		calRequestBody.setTransactionDetails(transactionDetails);
		calRequestBody.setEligibleRivaahGhsDetails(rivaahGhsDetails);
		calRequestBody.setCummulativeDiscountWithExcludeDetails(cummulativeDiscountWithExcludeDetails);

		return calRequestBody;
	}

	private DiscountDetailsBaseDto setConfigForAbCo(DiscountDetailsBaseDto discountConfigDetails, String discountId) {

		// setting product group
		List<DiscountProductGroupMappingDto> productGroupList = discountProductMappingRepository
				.getProductGroupMappingList(discountId);
		ProductGroupDetails productGroupDetails = new ProductGroupDetails();
		productGroupDetails.setProductGroups(productGroupList);
		discountConfigDetails.setProductGroups(productGroupDetails);

		// setting product category
		List<String> productCategoryList = discountProductCatRepository.getProductCategoryList(discountId);
		ProductCategoryDetails productCategoryDetailsList = new ProductCategoryDetails();
		productCategoryDetailsList.setProductCategory(productCategoryList);
		discountConfigDetails.setProductCategory(productCategoryDetailsList);

		// setting exclude config
		ExcludeConfigDto excludeConfig = new ExcludeConfigDto();

		List<String> excludedItemCodes = discountExcludeMappingRepository.getExcludedItemCodes(discountId);
		excludeConfig.setItemCodes(excludedItemCodes);

		List<String> excludedThemeCodes = discountExcludeMappingRepository.getExcludedThemeCodes(discountId);
		excludeConfig.setThemeCodes(excludedThemeCodes);

		List<DiscountExcludeComplexityPercentDto> excludedComplexityPercent = discountExcludeMappingRepository
				.getExcludedComplexityPercent(discountId);
		excludeConfig.setComplexityPercent(excludedComplexityPercent);

		List<DiscountExcludeMcPerGramDto> excludedMcPerGram = discountExcludeMappingRepository
				.getExcludedMcPerGram(discountId);
		excludeConfig.setMakingChargePerGram(excludedMcPerGram);
		discountConfigDetails.setExcludeConfigDto(excludeConfig);

		return discountConfigDetails;
	}

	@Override
	public DiscountEngineResponseDto checkAndCalculateAbDiscountValue(
			AbCoValidateDiscountRequestDto abCoValidateDiscountRequestDto) {

		abCoValidateDiscountRequestDto
				.setBusinessDate(CalendarUtils.getStartOfDay(abCoValidateDiscountRequestDto.getBusinessDate()));
		validateAbCoItem(abCoValidateDiscountRequestDto);

		// calculating max discount
		List<DiscountEngineResponseDto> discountResponses = new ArrayList<>();

		// calculating discount for club discount
		List<DiscountDetailsResponseDto> discountDetailsResponseDto = null;
		if (!CollectionUtils.isEmpty(abCoValidateDiscountRequestDto.getClubDiscounts())) {
			for (ClubbingDiscountDetailsDto clubDiscount : abCoValidateDiscountRequestDto.getClubDiscounts()) {
				BigDecimal clubDiscountValue = BigDecimal.ZERO;
				discountDetailsResponseDto = new ArrayList<>();
				for (DiscountDetailsBaseResponseDto discount : clubDiscount.getDiscounts()) {
					// TODO: set proper discount detail id
					DiscountDetailsResponseDto calculateDiscountResponse = calculateDiscount(null,
							discount.getDiscountConfigDetails().getDiscountId(),
							getCalRequestBody(abCoValidateDiscountRequestDto.getBusinessDate(),
									abCoValidateDiscountRequestDto.getItemDetails(),
									abCoValidateDiscountRequestDto.getCustomerDetails(), null,
									abCoValidateDiscountRequestDto.getTransactionDetails(),
									discount.getRivaahGhsDetails(), null),
							discount.getDiscountConfigDetails().getLocationOfferDetails().getOfferEndDate(),
							discount.getDiscountConfigDetails().getAppliedDiscountComponent());
					clubDiscountValue = clubDiscountValue.add(calculateDiscountResponse.getDiscountValue());
					discountDetailsResponseDto.add(calculateDiscountResponse);
				}
				DiscountEngineResponseDto autoDiscountResponse = new DiscountEngineResponseDto();
				autoDiscountResponse.setClubbingId(clubDiscount.getClubbingId());
				autoDiscountResponse.setDiscountDetailsResponseDto(discountDetailsResponseDto);
				discountResponses.add(autoDiscountResponse);
			}
		}
		// calculating discount for normal discount
		DiscountEngineResponseDto autoDiscountResponse = new DiscountEngineResponseDto();
		BigDecimal maxDiscountValue = BigDecimal.ZERO;
		DiscountDetailsResponseDto maxDiscount = null;
		if (!CollectionUtils.isEmpty(abCoValidateDiscountRequestDto.getDiscounts())) {
			for (DiscountDetailsBaseResponseDto discount : abCoValidateDiscountRequestDto.getDiscounts()) {
				// TODO: set proper discount detail id details
				DiscountDetailsResponseDto calculateDiscountResponse = calculateDiscount(null,
						discount.getDiscountConfigDetails().getDiscountId(),
						getCalRequestBody(abCoValidateDiscountRequestDto.getBusinessDate(),
								abCoValidateDiscountRequestDto.getItemDetails(),
								abCoValidateDiscountRequestDto.getCustomerDetails(), null,
								abCoValidateDiscountRequestDto.getTransactionDetails(), discount.getRivaahGhsDetails(),
								null),
						discount.getDiscountConfigDetails().getLocationOfferDetails().getOfferEndDate(),
						discount.getDiscountConfigDetails().getAppliedDiscountComponent());
				if (calculateDiscountResponse.getDiscountValue().compareTo(maxDiscountValue) > 0) {
					maxDiscountValue = calculateDiscountResponse.getDiscountValue();
					maxDiscount = calculateDiscountResponse;
					autoDiscountResponse.setDiscountDetailsResponseDto(Arrays.asList(maxDiscount));
					discountResponses.add(autoDiscountResponse);
				}
			}
		}
		return checkHighestDiscount(discountResponses);
	}

	private void validateAbCoItem(AbCoValidateDiscountRequestDto abCoValidateDiscountRequestDto) {

		// validating productGroup, productCategory & exclude in clubbing discounts
		String itemCode = abCoValidateDiscountRequestDto.getItemDetails().getItemCode();
		String productGroup = abCoValidateDiscountRequestDto.getItemDetails().getProductGroupCode();
		String productCategory = abCoValidateDiscountRequestDto.getItemDetails().getProductCategoryCode();
		BigDecimal complexityPercent = abCoValidateDiscountRequestDto.getItemDetails().getPriceDetails()
				.getMakingChargeDetails().getWastagePct();
		BigDecimal makingChargePerGram = abCoValidateDiscountRequestDto.getItemDetails().getPriceDetails()
				.getMakingChargeDetails().getMakingChargePgram();
		if (!CollectionUtils.isEmpty(abCoValidateDiscountRequestDto.getClubDiscounts())) {
			Iterator<ClubbingDiscountDetailsDto> clubDiscountItr = abCoValidateDiscountRequestDto.getClubDiscounts()
					.iterator();
			while (clubDiscountItr.hasNext()) {
				ClubbingDiscountDetailsDto clubDiscount = clubDiscountItr.next();
				for (DiscountDetailsBaseResponseDto discountDetail : clubDiscount.getDiscounts()) {
					if (!checkIfProductGroupExists(
							discountDetail.getDiscountConfigDetails().getProductGroups().getProductGroups(),
							productGroup)
							|| !discountDetail.getDiscountConfigDetails().getProductCategory().getProductCategory()
									.contains(productCategory)
							|| validateAbCoExcludeConfig(
									discountDetail.getDiscountConfigDetails().getExcludeConfigDto(), itemCode,
									complexityPercent, makingChargePerGram)) {
						clubDiscountItr.remove();
						break;
					}
				}
			}
		}
		// validating productGroup, productCategory & exclude in normal discounts
		if (!CollectionUtils.isEmpty(abCoValidateDiscountRequestDto.getDiscounts())) {
			Iterator<DiscountDetailsBaseResponseDto> discountItr = abCoValidateDiscountRequestDto.getDiscounts()
					.iterator();
			while (discountItr.hasNext()) {
				DiscountDetailsBaseResponseDto discount = discountItr.next();
				if (!checkIfProductGroupExists(
						discount.getDiscountConfigDetails().getProductGroups().getProductGroups(), productGroup)
						|| !discount.getDiscountConfigDetails().getProductCategory().getProductCategory()
								.contains(productCategory)
						|| validateAbCoExcludeConfig(discount.getDiscountConfigDetails().getExcludeConfigDto(),
								itemCode, complexityPercent, makingChargePerGram)) {
					discountItr.remove();
					break;
				}
			}
		}
	}

	private boolean validateAbCoExcludeConfig(ExcludeConfigDto excludeConfigDto, String itemCode,
			BigDecimal complexityPercent, BigDecimal makingChargePerGram) {

		String themeCode = itemCode.substring(2, 6);
		if (excludeConfigDto == null) {
			return false;
		}
		return (excludeConfigDto.getItemCodes().contains(itemCode)
				|| excludeConfigDto.getThemeCodes().contains(themeCode)
				|| checkExcludeComplexityPercent(excludeConfigDto, complexityPercent)
				|| checkExcludeMakingChargePerGram(excludeConfigDto, makingChargePerGram));
	}

	private boolean checkExcludeComplexityPercent(ExcludeConfigDto excludeConfigDto, BigDecimal complexityPercent) {
		for (DiscountExcludeComplexityPercentDto complexityPercentDto : excludeConfigDto.getComplexityPercent()) {
			if (complexityPercent.compareTo(complexityPercentDto.getFromValue()) >= 0
					&& complexityPercent.compareTo(complexityPercentDto.getToValue()) <= 0) {
				return true;
			}
		}
		return false;
	}

	private boolean checkExcludeMakingChargePerGram(ExcludeConfigDto excludeConfigDto, BigDecimal makingChargePerGram) {
		for (DiscountExcludeMcPerGramDto makingChargePerGramDto : excludeConfigDto.getMakingChargePerGram()) {
			if (makingChargePerGram.compareTo(makingChargePerGramDto.getFromValue()) >= 0
					&& makingChargePerGram.compareTo(makingChargePerGramDto.getToValue()) <= 0) {
				return true;
			}
		}
		return false;
	}

	private DiscountEngineResponseDto checkHighestDiscount(List<DiscountEngineResponseDto> responses) {
		BigDecimal maxDiscount = BigDecimal.ZERO;
		DiscountEngineResponseDto bestDiscountResponse = null;
		for (DiscountEngineResponseDto discountResponse : responses) {
			BigDecimal discountSum = BigDecimal.ZERO;
			for (DiscountDetailsResponseDto discountDetail : discountResponse.getDiscountDetailsResponseDto()) {
				discountSum = discountSum.add(discountDetail.getDiscountValue());
			}
			if (discountSum.compareTo(maxDiscount) > 0) {
				bestDiscountResponse = discountResponse;
			}
		}
		return bestDiscountResponse;
	}

	@Override
	public GepPurityScemeValidationResponse validateGepPurityScheme(Boolean isRivaah,
			GepPurityScemeValidationRequest gepPurityScemeValidationRequest) {
		gepPurityScemeValidationRequest
				.setBusinessDate(CalendarUtils.getStartOfDay(gepPurityScemeValidationRequest.getBusinessDate()));
		GepConfigDetailsDao gepConfigDetailsDao = gepConfigDetailsRepository
				.findOneById(gepPurityScemeValidationRequest.getGepConfigDetailsId());
		if (BooleanUtils.isTrue(isRivaah) && gepConfigDetailsDao != null
				&& gepConfigDetailsDao.getOfferDetails() != null) {
			GepOfferDetails gepOfferDetails = MapperUtil.mapObjToClass(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(gepConfigDetailsDao.getOfferDetails()), JsonData.class)
					.getData(), GepOfferDetails.class);
			if (gepOfferDetails.getIsRivaah() == null || !gepOfferDetails.getIsRivaah())
				return new GepPurityScemeValidationResponse();

		}
		List<GepPurityItemsDto> validItems = new ArrayList<>();
		if (gepConfigDetailsDao != null && gepConfigDetailsDao.getPurityProductGroupDetails() != null) {

			JsonData excludeThemesJson = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(gepConfigDetailsDao.getExcludeThemeCode()), JsonData.class);

			GepExcludeThemeCodeDetails excludeThemes = MapperUtil.mapObjToClass(excludeThemesJson.getData(),
					GepExcludeThemeCodeDetails.class);

			JsonData excludeItemsJson = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(gepConfigDetailsDao.getExcludeItemCode()), JsonData.class);

			GepExcludeItemCodeDetails excludeItems = MapperUtil.mapObjToClass(excludeItemsJson.getData(),
					GepExcludeItemCodeDetails.class);

			JsonData productDetailsJson = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(gepConfigDetailsDao.getPurityProductGroupDetails()), JsonData.class);

			GepPurityProductGroupDetails productDetails = MapperUtil.mapObjToClass(productDetailsJson.getData(),
					GepPurityProductGroupDetails.class);
			// temp code
			if (!CollectionUtils.isEmpty(productDetails.getPurityProductDetails())
					&& !productDetails.getPurityProductDetails().containsKey(BigDecimal.ZERO)) {
				Map<String, BigDecimal> newDetailsForZeroPurity = new HashMap<>();
				productDetails.getPurityProductDetails().values().stream().forEach(obj -> obj
						.forEach((product, pct) -> newDetailsForZeroPurity.put(product, new BigDecimal(100))));
				productDetails.getPurityProductDetails().put(BigDecimal.ZERO, newDetailsForZeroPurity);
			}
			// temp code ends

			gepPurityScemeValidationRequest.getItemDetails().forEach(item -> {
				String themeCode = item.getItemCode().substring(2, 6);
				int themeExcluded = 1;
				if (excludeThemes != null && !excludeThemes.getThemeList().isEmpty()
						&& excludeThemes.getThemeList().contains(themeCode)) {
					themeExcluded = 0;
				}

				int itemExcluded = 1;
				if (excludeItems != null && !excludeItems.getItemList().isEmpty()
						&& excludeItems.getItemList().contains(item.getItemCode())) {
					itemExcluded = 0;
				}

				if (themeExcluded == 1 && itemExcluded == 1) {

					if (BooleanUtils.isTrue(isRivaah)) {
						if (gepConfigDetailsDao.getRivaahPurityProductGroupDetails() != null) {
							JsonData rivaahProductDetailsJson = MapperUtil.getObjectMapperInstance()
									.convertValue(
											MapperUtil.getJsonFromString(
													gepConfigDetailsDao.getRivaahPurityProductGroupDetails()),
											JsonData.class);
							GepRivaahPurityProductGroupDetails rivaahProductDetails = MapperUtil.mapObjToClass(
									rivaahProductDetailsJson.getData(), GepRivaahPurityProductGroupDetails.class);
							// temp code
							if (!CollectionUtils.isEmpty(rivaahProductDetails.getRivaahpurityProductDetails())
									&& !rivaahProductDetails.getRivaahpurityProductDetails()
											.containsKey(BigDecimal.ZERO)) {
								Map<String, BigDecimal> newDetailsForZeroPurity = new HashMap<>();
								rivaahProductDetails.getRivaahpurityProductDetails().values().stream()
										.forEach(obj -> obj.forEach((product, pct) -> newDetailsForZeroPurity
												.put(product, new BigDecimal(100))));
								rivaahProductDetails.getRivaahpurityProductDetails().put(BigDecimal.ZERO,
										newDetailsForZeroPurity);
							}
							// temp code ends

							Map<BigDecimal, Map<String, BigDecimal>> rivaahPurityProductDetails = rivaahProductDetails
									.getRivaahpurityProductDetails();
							rivaahPurityProductDetails.forEach((key, value) -> {
								if (key.compareTo(gepPurityScemeValidationRequest.getGepPurity()) == 0) {
									Map<String, BigDecimal> prodGroupApplicablePct = rivaahProductDetails
											.getRivaahpurityProductDetails().get(key);

									if (prodGroupApplicablePct != null) {
										BigDecimal applicablePct = prodGroupApplicablePct
												.get(item.getProductGroupCode());

										if (applicablePct != null) {
											GepPurityItemsDto gepPurityItemsDto = MapperUtil.mapObjToClass(item,
													GepPurityItemsDto.class);
											gepPurityItemsDto.setApplicablePct(applicablePct);
											validItems.add(gepPurityItemsDto);
										}
									}
								}
							});

						}
					} else {
						Map<BigDecimal, Map<String, BigDecimal>> purityProductDetails = productDetails
								.getPurityProductDetails();

						purityProductDetails.forEach((key, value) -> {
							if (key.compareTo(gepPurityScemeValidationRequest.getGepPurity()) == 0) {
								Map<String, BigDecimal> prodGroupApplicablePct = productDetails
										.getPurityProductDetails().get(key);

								if (prodGroupApplicablePct != null) {
									BigDecimal applicablePct = prodGroupApplicablePct.get(item.getProductGroupCode());

									if (applicablePct != null) {
										GepPurityItemsDto gepPurityItemsDto = MapperUtil.mapObjToClass(item,
												GepPurityItemsDto.class);
										gepPurityItemsDto.setApplicablePct(applicablePct);
										validItems.add(gepPurityItemsDto);
									}
								}
							}
						});
					}

				}

			});
		}

		return getGepPurityScemeValidationResponse(gepConfigDetailsDao, validItems);
	}

	/**
	 * @param configDetailsDao
	 * @param validItems
	 * @return
	 */
	private GepPurityScemeValidationResponse getGepPurityScemeValidationResponse(GepConfigDetailsDao configDetailsDao,
			List<GepPurityItemsDto> validItems) {

		GepPurityScemeValidationResponse response = new GepPurityScemeValidationResponse();

		List<EligibleItemDetails> eligibleItemDetailsList = new ArrayList<>();
		EligibleItemDetails eligibleItemDetails = new EligibleItemDetails();

		List<GepConfigDetailsRes> gepConfigDetails = new ArrayList<>();
		GepConfigDetailsRes gepConfigDetailsRes = new GepConfigDetailsRes();

		gepConfigDetailsRes.setGepConfigCode(configDetailsDao.getConfigCode());
		gepConfigDetailsRes.setGepConfigId(configDetailsDao.getConfigId());
		gepConfigDetailsRes.setGepConfigType(configDetailsDao.getConfigType());
		gepConfigDetailsRes
				.setGepOfferDetails(MapperUtil.mapObjToClass(configDetailsDao.getOfferDetails(), JsonData.class));
		gepConfigDetailsRes
				.setGepConfigDetails(MapperUtil.mapObjToClass(configDetailsDao.getConfigDetails(), JsonData.class));
		gepConfigDetailsRes.setIsOfferEnabled(configDetailsDao.getIsOfferEnabled());
		gepConfigDetailsRes.setItemDetails(validItems);

		gepConfigDetails.add(gepConfigDetailsRes);

		eligibleItemDetails.setGepConfigDetails(gepConfigDetails);

		eligibleItemDetailsList.add(eligibleItemDetails);

		response.setEligibleItemDetails(eligibleItemDetailsList);

		return response;
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

	@Override
	public EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscountsForAbToCm(
			EligibleDiscountAbItemsRequestDto discountItemListDto, String discountType) {

		discountItemListDto.setBusinessDate(CalendarUtils.getStartOfDay(discountItemListDto.getBusinessDate()));

		List<DiscountDao> validDiscountList = validateAbDiscountList(discountItemListDto.getDiscountDetails(),
				discountItemListDto.getBusinessDate());

		Map<DiscountDao, List<DiscountItemsDto>> responseMap = validateAbItems(validDiscountList, discountType,
				discountItemListDto.getItemDetails(), discountItemListDto.getDiscountDetails());
		List<EligibleDiscountItemDetailsDto> eligibleItemDiscountDetailsList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(responseMap)) {
			responseMap.forEach((discountObject, itemDetailList) -> {
				EligibleDiscountItemDetailsDto itemDetailResponseObject = new EligibleDiscountItemDetailsDto();
				itemDetailResponseObject.setItemDetails(responseMap.get(discountObject));
				itemDetailResponseObject.setDiscountConfigDetails(discountUtilService.setDiscountConfigDetails(
						discountObject, new DiscountDetailsBaseDto(), discountItemListDto.getBusinessDate(), null));
				eligibleItemDiscountDetailsList.add(itemDetailResponseObject);

			});
		}
		EligibleDiscountItemsResponseDto responseItemDto = new EligibleDiscountItemsResponseDto();
		responseItemDto.setEligibleItemDetails(eligibleItemDiscountDetailsList);

		return responseItemDto;
	}

	private List<DiscountDao> validateAbDiscountList(List<DiscountDetailsBaseDto> discountDetailList,
			Date businessDate) {
		List<DiscountDao> validDiscountList = new ArrayList<>();

		for (DiscountDetailsBaseDto discountDetail : discountDetailList) {
			Date offerStartDate = null;
			Date offerEndDate = null;
			if (discountDetail.getAppliedDiscountComponentType() != null && discountDetail
					.getAppliedDiscountComponentType().equalsIgnoreCase(DiscountDetailsTypeEnum.PREVIEW.name())) {
				offerStartDate = discountDetail.getLocationOfferDetails().getPreviewOfferStartDate();
				offerEndDate = discountDetail.getLocationOfferDetails().getPreviewOfferEndDate();
			} else {
				offerStartDate = discountDetail.getLocationOfferDetails().getOfferStartDate();
				offerEndDate = discountDetail.getLocationOfferDetails().getOfferEndDate();
			}
			Calendar cal = Calendar.getInstance();
			cal.setTime(offerEndDate);
			Integer gracePeriod = null;
			if (discountDetail.getOrderConfigDetails() != null
					&& discountDetail.getOrderConfigDetails().getOfferPeriodForAB() != null) {
				gracePeriod = discountDetail.getOrderConfigDetails().getOfferPeriodForAB();
				if (gracePeriod != null) {
					cal.add(Calendar.DATE, gracePeriod);
				}
			}
			if (checkAbOfferPeriod(businessDate, offerStartDate, offerEndDate, gracePeriod)) {
				validDiscountList.add(discountUtilService.mapDiscountDao(discountDetail.getAppliedDiscountMaster()));
			}
		}

		return validDiscountList;
	}

	private Map<DiscountDao, List<DiscountItemsDto>> validateAbItems(List<DiscountDao> validDiscountList,
			String discountType, List<DiscountItemsDto> itemDetailsListRequest,
			List<DiscountDetailsBaseDto> discountDetailsList) {
		Map<DiscountDao, List<DiscountItemsDto>> responseMap = new HashMap<>();
		validDiscountList.forEach(discountDao -> {
			List<DiscountItemsDto> validItemDetailList = new ArrayList<>();
			List<String> karatageTypeList = checkIfKaratageDiscount(discountType);
			// iterating through all items from the request for every discount Id
			itemDetailsListRequest.forEach(itemDetail -> {
				String itemCode = itemDetail.getItemCode();
				String productGroup = itemDetail.getProductGroupCode();
				String productCategory = itemDetail.getProductCategoryCode();
				BigDecimal complexityPercent = itemDetail.getComplexityPercent();
				BigDecimal makingChargePerGram = itemDetail.getMakingChargePerGram();
				List<DiscountDetailsBaseDto> discountDetailDto = discountDetailsList.stream()
						.filter(discountDetail -> discountDetail.getDiscountId().equalsIgnoreCase(discountDao.getId()))
						.collect(Collectors.toList());

				// validating ItemCode
				if (!discountDetailDto.isEmpty() && (checkIfProductGroupExists(
						discountDetailDto.get(0).getProductGroups().getProductGroups(), productGroup)
						|| discountDetailDto.get(0).getProductCategory().getProductCategory().contains(productCategory)
						|| !validateAbCoExcludeConfig(discountDetailDto.get(0).getExcludeConfigDto(), itemCode,
								complexityPercent, makingChargePerGram))) {
					if (!karatageTypeList.isEmpty()) {
						List<DiscountProductGroupMappingDto> productGroupMappingDtoList = discountDetailDto.get(0)
								.getProductGroups().getProductGroups().stream()
								.filter(pg -> pg.getProductGroup().equalsIgnoreCase(productGroup)
										&& !"TEP".equalsIgnoreCase(pg.getKaratType()))
								.collect(Collectors.toList());
						if (!productGroupMappingDtoList.isEmpty()) {
							itemDetail.setApplicableKaratageType(productGroupMappingDtoList.get(0).getKaratType());
						}
					}
					validItemDetailList.add(itemDetail);
				}
			});
			responseMap.put(discountDao, validItemDetailList);
		});
		return responseMap;
	}

	private boolean checkIfProductGroupExists(List<DiscountProductGroupMappingDto> productGroupMappingDtoList,
			String productGroup) {
		List<DiscountProductGroupMappingDto> productGroupMappingList = productGroupMappingDtoList.stream()
				.filter(pg -> pg.getProductGroup().equalsIgnoreCase(productGroup)).collect(Collectors.toList());

		return !productGroupMappingList.isEmpty();
	}

	private List<String> checkIfKaratageDiscount(String discountType) {
		List<String> karatageTypeList = new ArrayList<>();
		if (discountType != null && discountType.equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())) {
			karatageTypeList.add("1");
			karatageTypeList.add("2");
		}
		return karatageTypeList;
	}

	private DiscountEngineResponseDto calculateAdditionalRivaahDiscount(String discountType, String discountId,
			DiscountCalRequestDto discountCalDto) {
		if (StringUtils.isEmpty(discountId)) {
			throw new ServiceException("Discount id is not present", "ERR-CONFIG-161");
		}
		DiscountEngineResponseDto response = new DiscountEngineResponseDto();
		List<DiscountDetailsResponseDto> discountDetails = new ArrayList<>();
		DiscountDao discountObj = validateDiscountDao(discountId);
		DiscountDetailsResponseDto discountResponse = null;
		// Rivaah Discount for the item
		if (discountType.equalsIgnoreCase(DiscountTypeEnum.CATEGORY_DISCOUNT.name())) {
			discountResponse = calculateRivaahAdditionalDiscountForCategory(discountObj, discountId, discountCalDto);
		} else if (DiscountTypeEnum.SLAB_BASED_DISCOUNT.name().equalsIgnoreCase(discountObj.getDiscountType())
				|| DiscountTypeEnum.HIGH_VALUE_DISCOUNT.toString().equalsIgnoreCase(discountObj.getDiscountType())) {
			discountResponse = calculateRivaahAdditionalDiscountForHighValueSlab(discountObj, discountId,
					discountCalDto);
		} else {
			discountResponse = calculateRivaahAdditionalDiscountForItemGroupAndBestDeal(discountObj, discountId,
					discountCalDto);
		}
		if (discountResponse != null && discountResponse.getDiscountValue() != null
				&& discountResponse.getDiscountValue().compareTo(BigDecimal.ZERO) != 0) {
			discountDetails.add(discountResponse);
			response.setDiscountDetailsResponseDto(discountDetails);
			return response;
		} else {
			return null;
		}
	}

	private DiscountDetailsResponseDto calculateRivaahAdditionalDiscountForHighValueSlab(DiscountDao discountObj,
			String discountId, DiscountCalRequestDto discountCalDto) {
		DiscountDetailsResponseDto response = new DiscountDetailsResponseDto();
		DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
		List<DiscountDetailsDao> discountDetailsDaos = new ArrayList<>();
		if (discountCalDto.getTransactionDetails().getRefTxnType() != null && discountCalDto.getTransactionDetails()
				.getRefTxnType().equalsIgnoreCase(TransactionTypeEnum.AB.name())
				&& discountObj.getOrderDetails() != null) {
			JsonData orderDetailJson = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountObj.getOrderDetails()), JsonData.class);
			DiscountOrderConfigDetails orderDetail = MapperUtil.mapObjToClass(orderDetailJson.getData(),
					DiscountOrderConfigDetails.class);
			if (orderDetail.getOfferPeriodForAB() != null && orderDetail.getOfferPeriodForAB() > 0) {
				discountDetailsDaos = discountUtilService.validateItemRequestDetails(discountObj.getId(),
						discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(), true, false, null,
						orderDetail.getOfferPeriodForAB());
			} else {
				discountDetailsDaos = discountUtilService.validateItemRequestDetails(discountObj.getId(),
						discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(), true, false, null, null);
			}
		} else if (discountCalDto.getTransactionDetails().getRefTxnType() != null && discountCalDto
				.getTransactionDetails().getRefTxnType().equalsIgnoreCase(TransactionTypeEnum.CO.name())
				&& discountObj.getOrderDetails() != null) {
			JsonData orderDetailJson = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountObj.getOrderDetails()), JsonData.class);
			DiscountOrderConfigDetails orderDetail = MapperUtil.mapObjToClass(orderDetailJson.getData(),
					DiscountOrderConfigDetails.class);
			if (orderDetail.getOfferPeriodForCO() != null && orderDetail.getOfferPeriodForCO() > 0) {
				discountDetailsDaos = discountUtilService.validateItemRequestDetails(discountObj.getId(),
						discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(), true, false, null,
						orderDetail.getOfferPeriodForCO());
			} else {
				discountDetailsDaos = discountUtilService.validateItemRequestDetails(discountObj.getId(),
						discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(), true, false, null, null);
			}
		} else {
			discountDetailsDaos = discountUtilService.validateItemRequestDetails(discountObj.getId(),
					discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(), true, false, null, null);
		}
		RegularCategoryDetails regularCategoryDetails = null;
		SlabConfigDetails slabConfigDetails = new SlabConfigDetails();
		for (DiscountDetailsDao discountDetail : discountDetailsDaos) {
			String discountDetailId = null;
			// ignore others if details id is passed.
			if (checkIfCummDiscountIdIsAvailable(discountObj, discountCalDto, discountDetail)) {
				discountDetailId = discountCalDto.getCummulativeDiscountWithExcludeDetails().get(discountObj.getId())
						.getDiscountDetailsId();
			}
			if (discountDetail.getDiscountCategory().equals(DiscountCategoryEnum.WEIGHT_BASED.name())) {
				regularCategoryDetails = checkWeightBasedSlab(discountDetail, slabConfigDetails, discountCalDto,
						discountObj, discountCalDto.getItemDetails().getTotalWeight(),
						discountCalDto.getItemDetails().getPriceDetails().getNetWeight(), response, Boolean.TRUE,
						discountDetailId);
			} else if (discountDetail.getDiscountCategory().equals(DiscountCategoryEnum.VALUE_BASED.name())) {
				regularCategoryDetails = checkValueBasedSlab(discountDetail, slabConfigDetails, discountCalDto,
						discountObj, discountCalDto.getItemDetails().getTotalValue(),
						discountCalDto.getItemDetails().getTotalTax(), response, Boolean.TRUE, discountDetailId);
			} else if (discountDetail.getDiscountCategory().equals(DiscountCategoryEnum.CARAT_BASED.name())) {
				regularCategoryDetails = checkKaratBasedSlab(discountDetail, slabConfigDetails, discountCalDto,
						discountObj, discountCalDto.getItemDetails().getItemCode(),
						discountCalDto.getItemDetails().getLotNumber(), response, Boolean.TRUE);
			}
			if (regularCategoryDetails != null) {
				break;
			}
		}
		discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.RIVAAH.name());
		response.setDiscountConfigDetails(discountConfigDetails);
		return calculateDiscountValue(discountObj, regularCategoryDetails, discountCalDto.getItemDetails(),
				discountCalDto.getBusinessDate(), null, true, response);
	}

	private boolean checkIfCummDiscountIdIsAvailable(DiscountDao discountObj, DiscountCalRequestDto discountCalDto,
			DiscountDetailsDao discountDetail) {
		return discountCalDto.getCummulativeDiscountWithExcludeDetails() != null
				&& !discountCalDto.getCummulativeDiscountWithExcludeDetails().isEmpty()
				&& discountCalDto.getCummulativeDiscountWithExcludeDetails().containsKey(discountObj.getId())
				&& discountDetail.getId().equalsIgnoreCase(discountCalDto.getCummulativeDiscountWithExcludeDetails()
						.get(discountObj.getId()).getDiscountDetailsId());
	}

	private DiscountDetailsResponseDto calculateRivaahAdditionalDiscountForCategory(DiscountDao discountObj,
			String discountId, DiscountCalRequestDto discountCalDto) {
		DiscountDetailsResponseDto response = new DiscountDetailsResponseDto();
		DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
		DiscountDetailsDao discountDetail = getDiscountDetails(discountObj.getId(),
				discountCalDto.getItemDetails().getProductGroupCode());
		if (discountDetail == null || StringUtils.isEmpty(discountDetail.getRivaahConfigDetails())) {
			return new DiscountDetailsResponseDto();
		} else {
			RegularCategoryDetails regularDetails = getRivaahRegularDetails(discountDetail);
			response.setDiscountConfigDetails(discountConfigDetails);
			discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.RIVAAH.name());
			return calculateDiscountValue(discountObj, regularDetails, discountCalDto.getItemDetails(),
					discountCalDto.getBusinessDate(), null, true, response);
		}
	}

	private RegularCategoryDetails getRivaahRegularDetails(DiscountDetailsDao discountDetail) {
		if (discountDetail.getRivaahConfigDetails() != null) {
			JsonData rivaahData = MapperUtil.getObjectMapperInstance().convertValue(
					MapperUtil.getJsonFromString(discountDetail.getRivaahConfigDetails()), JsonData.class);
			return MapperUtil.mapObjToClass(rivaahData.getData(), RegularCategoryDetails.class);
		} else {
			return null;
		}
	}

	private DiscountDetailsResponseDto calculateRivaahAdditionalDiscountForItemGroupAndBestDeal(DiscountDao discountObj,
			String discountId, DiscountCalRequestDto discountCalDto) {

		DiscountDetailsResponseDto responseObject = new DiscountDetailsResponseDto();
		RegularCategoryDetails categoryDetails = validateRequestAndGetDiscountComponentFromDiscountItemMapping(
				discountObj, discountCalDto.getBusinessDate(), discountCalDto.getItemDetails(),
				discountCalDto.getCustomerDetails(), responseObject, discountCalDto.getTransactionDetails(),
				Boolean.TRUE);
		if (StringUtils.isEmpty(discountObj.getRivaahItemGroupConfig())) {
			return null;
		} else {
			RivaahItemGroupConfig rivaahItem = MapperUtil.mapObjToClass(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(discountObj.getRivaahItemGroupConfig()), JsonData.class)
					.getData(), RivaahItemGroupConfig.class);
			RegularCategoryDetails categoryDetailsRivaah = getAdditionalRivaahDiscountDetails(categoryDetails,
					rivaahItem);
			DiscountDetailsBaseDto discountConfigDetails = new DiscountDetailsBaseDto();
			discountConfigDetails.setAppliedDiscountComponentType(DiscountDetailsTypeEnum.RIVAAH.name());
			responseObject.setDiscountConfigDetails(discountConfigDetails);
			return calculateDiscountValue(discountObj, categoryDetailsRivaah, discountCalDto.getItemDetails(),
					discountCalDto.getBusinessDate(), null, true, responseObject);
		}
	}

	private RegularCategoryDetails getAdditionalRivaahDiscountDetails(RegularCategoryDetails categoryDetails,
			RivaahItemGroupConfig rivaahItem) {

		RegularCategoryDetails categoryDetailsForRivaah = new RegularCategoryDetails();
		if (rivaahItem.getAdditionalMaxMC() != null) {
			MakingChargeData mcCharges = new MakingChargeData();
			if (BooleanUtils.isTrue(categoryDetails.getMcCharges().getIsPercent())) {
				if (rivaahItem.getAdditionalMaxMC().getPercent() != null) {
					mcCharges.setIsPercent(Boolean.TRUE);
					mcCharges.setValue(rivaahItem.getAdditionalMaxMC().getPercent());
				}
			} else {
				if (rivaahItem.getAdditionalMaxMC().getValue() != null) {
					mcCharges.setIsPercent(Boolean.FALSE);
					mcCharges.setValue(rivaahItem.getAdditionalMaxMC().getValue());
				}
			}
			categoryDetailsForRivaah.setMcCharges(mcCharges);
		}
		if (rivaahItem.getAdditionalMaxMetalCharge() != null) {
			MetalChargeData metalCharges = new MetalChargeData();
			if (BooleanUtils.isTrue(categoryDetails.getGoldCharges().getIsPercent())) {
				if (rivaahItem.getAdditionalMaxMetalCharge().getPercent() != null) {
					metalCharges.setIsPercent(Boolean.TRUE);
					metalCharges.setValue(rivaahItem.getAdditionalMaxMetalCharge().getPercent());
				}
			} else {
				if (rivaahItem.getAdditionalMaxMetalCharge().getValue() != null) {
					metalCharges.setIsPercent(Boolean.FALSE);
					metalCharges.setValue(rivaahItem.getAdditionalMaxMetalCharge().getValue());
				}
			}
			categoryDetailsForRivaah.setGoldCharges(metalCharges);
		}
		if (rivaahItem.getAdditionalMaxStoneCharges() != null) {
			StoneChargeData stoneCharges = new StoneChargeData();
			if (BooleanUtils.isTrue(categoryDetails.getStoneCharges().getIsPercent())) {
				if (rivaahItem.getAdditionalMaxStoneCharges().getPercent() != null) {
					stoneCharges.setIsPercent(Boolean.TRUE);
					stoneCharges.setValue(rivaahItem.getAdditionalMaxStoneCharges().getPercent());
				}
			} else {
				if (rivaahItem.getAdditionalMaxStoneCharges().getValue() != null) {
					stoneCharges.setIsPercent(Boolean.FALSE);
					stoneCharges.setValue(rivaahItem.getAdditionalMaxStoneCharges().getValue());
				}
			}
			categoryDetailsForRivaah.setStoneCharges(stoneCharges);
		}
		if (rivaahItem.getAdditionalMaxUCP() != null) {
			UcpData ucpCharges = new UcpData();
			if (BooleanUtils.isTrue(categoryDetails.getIsUCP().getIsPercent())) {
				if (rivaahItem.getAdditionalMaxUCP().getPercent() != null) {
					ucpCharges.setIsPercent(Boolean.TRUE);
					ucpCharges.setValue(rivaahItem.getAdditionalMaxUCP().getPercent());
				}
			} else {
				if (rivaahItem.getAdditionalMaxUCP().getValue() != null) {
					ucpCharges.setIsPercent(Boolean.FALSE);
					ucpCharges.setValue(rivaahItem.getAdditionalMaxUCP().getValue());
				}
			}
			categoryDetailsForRivaah.setIsUCP(ucpCharges);
		}
		if (rivaahItem.getAdditionalMaxPsPerGram() != null) {
			RsPerGramData rsPerGram = new RsPerGramData();
			if (categoryDetails.getRsPerGram() != null && categoryDetails.getRsPerGram().getIsGrossWeight() != null) {
				if (rivaahItem.getAdditionalMaxPsPerGram().getWeight() != null) {
					rsPerGram.setIsGrossWeight(categoryDetails.getRsPerGram().getIsGrossWeight());
					rsPerGram.setWeight(rivaahItem.getAdditionalMaxPsPerGram().getWeight());
				}
				categoryDetailsForRivaah.setRsPerGram(rsPerGram);
			}
		}
		return categoryDetailsForRivaah;
	}

	@Override
	public Map<String, DiscountEngineResponseDto> calculateRivaahDiscountsForAllItemsInDiscount(String discountType,
			String discountId, List<DiscountCalRequestDto> discountCalDtoList) {
		Map<String, DiscountEngineResponseDto> discountForRivaahMap = new HashMap<>();
		discountCalDtoList.forEach(discountCalDto -> {
			discountCalDto.setBusinessDate(CalendarUtils.getStartOfDay(discountCalDto.getBusinessDate()));
			DiscountEngineResponseDto rivaahDiscItem = calculateAdditionalRivaahDiscount(discountType, discountId,
					discountCalDto);
			if (rivaahDiscItem != null)
				discountForRivaahMap.put(discountCalDto.getItemDetails().getItemId(), rivaahDiscItem);
		});
		return discountForRivaahMap;
	}

	private RegularCategoryDetailsExtendedForRivaahGhs validateAndGetRivaahConfigDetails(DiscountDao discount,
			Date businessDate, DiscountItemDetailsReqDto itemDetails, RivaahGhsDiscountDetailsDto rivaalGhsDetails) {

		// validate rivaah discount list
		Map<String, RivaahGhsDiscountDto> rivaahDiscountMap = validateRivaahInputList(rivaalGhsDetails);

		String itemCode = itemDetails.getItemCode();
		BigDecimal complexityPercent = null;
		BigDecimal makingChargePerGram = null;
		if (itemDetails.getPriceDetails() != null && itemDetails.getPriceDetails().getMakingChargeDetails() != null) {
			complexityPercent = itemDetails.getPriceDetails().getMakingChargeDetails().getWastagePct();
			makingChargePerGram = itemDetails.getPriceDetails().getMakingChargeDetails().getMakingChargePgram();
		}
		// validating ItemCode
		List<DiscountExcludeMappingDao> excludeItem = discountUtilService.validateItemCode(discount.getId(), itemCode,
				complexityPercent, makingChargePerGram);

		if (excludeItem.isEmpty()) {
			String productGroupCode = itemDetails.getProductGroupCode();
			String productCategoryCode = itemDetails.getProductCategoryCode();

			// validating other Request Details
			DiscountDao discountDao = discountUtilService.validateOtherRequestDetails(discount.getId(),
					CalendarUtils.getStartOfDay(businessDate), productGroupCode, productCategoryCode,
					CommonUtil.getStoreCode(), discount.getDiscountType());
			// if not applicable, then ignore
			if (discountDao == null) {
				return null;
			}
			// get product group mapping
			List<DiscountProductGroupMappingDto> discountProdGroupMappingList = discountProductMappingRepository
					.getProductTypeListForDiscountIdAndProductGroup(discountDao.getId(), productGroupCode);

			// if not applicable, then ignore
			if (CollectionUtil.isEmpty(discountProdGroupMappingList)) {
				return null;
			}
			if (!CollectionUtil.isEmpty(discountProdGroupMappingList) && discountProdGroupMappingList.size() > 1) {
				throw new ServiceException(ConfigConstants.DISCOUNT_NOT_AVAILABLE_ON_ITEM,
						ConfigConstants.ERR_CONFIG_143,
						"Discount is undertermined as product group is mapped for both MC and UCP");
			}

			return setRegularDetailsForRivaahGhs(rivaahDiscountMap, discountProdGroupMappingList.get(0), itemDetails);
		}

		return null;
	}

	private Map<String, RivaahGhsDiscountDto> validateRivaahInputList(RivaahGhsDiscountDetailsDto rivaalGhsDetails) {
		if (rivaalGhsDetails == null || CollectionUtil.isEmpty(rivaalGhsDetails.getRivaahGhs())) {
			throw new ServiceException(EngineConstants.INVALID_REQUEST_FORMAT, EngineConstants.ERR_CORE_023,
					"Rivaah details not present.");
		}
		// validate rivaah discount list
		if (rivaalGhsDetails.getRivaahGhs().size() > 2) {
			throw new ServiceException(EngineConstants.INVALID_REQUEST_FORMAT, EngineConstants.ERR_CORE_023,
					"Only max of 2 Rivaah discounts allowed.");
		}
		Map<String, RivaahGhsDiscountDto> rivaahDiscountMap = new HashMap<>();

		for (RivaahGhsDiscountDto rivaahGhsDiscount : rivaalGhsDetails.getRivaahGhs()) {

			if (checkRivaahGhsMcAndUcpBooleanField(rivaahGhsDiscount)) {
				throw new ServiceException(EngineConstants.INVALID_REQUEST_FORMAT, EngineConstants.ERR_CORE_023,
						"Invalid rivaah GHS details.");
			}

			boolean isFound = false;
			if (BooleanUtils.isTrue(rivaahGhsDiscount.getIsMcDiscountUsed()) && !rivaahDiscountMap.containsKey(MC)) {
				isFound = true;
				rivaahDiscountMap.put(MC, rivaahGhsDiscount);
			}
			if (BooleanUtils.isTrue(rivaahGhsDiscount.getIsUcpdiscountUsed()) && !rivaahDiscountMap.containsKey(UCP)) {
				isFound = true;
				rivaahDiscountMap.put(UCP, rivaahGhsDiscount);
			}
			if (!isFound) {
				// if discount MC/UCP repeats again
				throw new ServiceException(EngineConstants.INVALID_REQUEST_FORMAT, EngineConstants.ERR_CORE_023,
						"Invalid rivaah GHS details.");
			}
		}

		return rivaahDiscountMap;
	}

	private boolean checkRivaahGhsMcAndUcpBooleanField(RivaahGhsDiscountDto rivaahGhsDiscount) {
		return (BooleanUtils.isNotTrue(rivaahGhsDiscount.getIsMcDiscountUsed())
				&& BooleanUtils.isNotTrue(rivaahGhsDiscount.getIsUcpdiscountUsed()));
	}

	private RegularCategoryDetailsExtendedForRivaahGhs setRegularDetailsForRivaahGhs(
			Map<String, RivaahGhsDiscountDto> rivaahDiscountMap,
			DiscountProductGroupMappingDto discountProductGroupMappingDto, DiscountItemDetailsReqDto itemDetails) {
		RegularCategoryDetailsExtendedForRivaahGhs regularCategoryDetails = new RegularCategoryDetailsExtendedForRivaahGhs();

		MakingChargeData makingChargeData = new MakingChargeData();
		makingChargeData.setIsPercent(true);
		makingChargeData.setValue(BigDecimal.ZERO);

		StoneChargeData stoneChargeData = new StoneChargeData();
		stoneChargeData.setIsPercent(true);
		stoneChargeData.setValue(BigDecimal.ZERO);

		UcpData ucpData = new UcpData();
		ucpData.setIsPercent(true);
		ucpData.setValue(BigDecimal.ZERO);

		MetalChargeData metalChargeData = new MetalChargeData();
		metalChargeData.setIsPercent(true);
		metalChargeData.setValue(BigDecimal.ZERO);

		boolean isDiscountFound = false;

		if (MC.equals(discountProductGroupMappingDto.getProductType()) && rivaahDiscountMap.containsKey(MC)) {
			isDiscountFound = true;
			makingChargeData.setValue(rivaahDiscountMap.get(MC).getMakingChargeDiscountPercent());
			regularCategoryDetails.setProductType(MC);
		}

		if (UCP.equals(discountProductGroupMappingDto.getProductType()) && rivaahDiscountMap.containsKey(UCP)) {
			isDiscountFound = true;
			ucpData.setValue(rivaahDiscountMap.get(UCP).getUcpDiscountPercent());
			regularCategoryDetails.setProductType(UCP);
		}

		// if discount % not found OR UCP product and product group is not mapped for
		// UCP discount, then return null.
		if (!isDiscountFound || (BooleanUtils.isTrue(itemDetails.getPriceDetails().getIsUcp())
				&& BigDecimal.ZERO.compareTo(ucpData.getValue()) == 0)) {
			return null;
		}

		regularCategoryDetails.setMcCharges(makingChargeData);
		regularCategoryDetails.setStoneCharges(stoneChargeData);
		regularCategoryDetails.setIsUCP(ucpData);
		regularCategoryDetails.setGoldCharges(metalChargeData);
		return regularCategoryDetails;
	}

	private void validateRivaahGhsDetailsAgainstDiscountIds(List<DiscountDao> discountListDao,
			List<DiscountDao> validDiscountList, List<String> inputSchemeCodeList) {

		discountListDao.forEach(discount -> {
			List<String> schemeList = discountExcludeMappingRepository.getMappedSchemeCodes(discount.getId());
			if (!CollectionUtil.isEmpty(schemeList)
					&& CollectionUtil.disjointCheckFailed(schemeList, inputSchemeCodeList)) {
				validDiscountList.add(discount);
			}
		});

	}
	
	@Override
	public List<DiscountItemMapiingDto> getDiscountItemMappingDetails(String itemCode,String lotNumber, String locationCode) {
		// TODO Auto-generated method stub
		List<DiscountItemMappingDao> discountItemMappingDao=discountItemMappingRepository.getDiscountItemMappingDetails(itemCode,lotNumber,locationCode);
		//Object object = MapperUtil.getObjectMapping(discountItemMappingDao, Object.class);
		List<DiscountItemMapiingDto> discountItemList = new ArrayList<>();
		if(discountItemMappingDao.isEmpty())
		{
			return discountItemList;
		}
		discountItemMappingDao.forEach(item->{
			DiscountItemMapiingDto dto= (DiscountItemMapiingDto) MapperUtil.getDtoMapping(item, DiscountItemMapiingDto.class);
			dto.setDiscount(item.getDiscount().getId());
			discountItemList.add(dto);
		});
		return  discountItemList;
	}

	@Override
	public List<ItemGroupMappingDto> discountIBTTansfer(List<ItemGroupMappingDto> ObjectList) {
		List<DiscountItemMappingDao> discountItemMappingDaos=new ArrayList<DiscountItemMappingDao>();
		for (ItemGroupMappingDto object : ObjectList) {
			DiscountItemMappingDao discountItemMappingDao=new DiscountItemMappingDao();
			DiscountDao discountDao=new DiscountDao();
			discountDao.setId(object.getDiscountId());
			DiscountItemMappingDao discountDetails=discountItemMappingRepository.getDiscountDetails(object.getItemCode(), object.getLotNumber(), object.getDiscountId());
			discountItemMappingDao=(DiscountItemMappingDao) MapperUtil.getDtoMapping(object,DiscountItemMappingDao.class);
			discountItemMappingDao.setDiscount(discountDao);
			discountItemMappingDao.setPreviewConfigDetails(discountDetails.getPreviewConfigDetails());
			discountItemMappingDao.setRegularConfigDetails(discountDetails.getRegularConfigDetails());
			discountItemMappingDaos.add(discountItemMappingDao);
		}
			discountItemMappingDaos=discountItemMappingRepository.saveAll(discountItemMappingDaos);			
		List<SyncData> syncDatas=new ArrayList<SyncData>();
		if (discountItemMappingDaos!=null) {
				DiscountItemMappingSyncDto discountItemDtoExt = new DiscountItemMappingSyncDto();
				syncDatas
						.add(DataSyncUtil.createSyncData(discountItemDtoExt.getSyncDtos(discountItemMappingDaos), 4));
			}
		List<String> destinations = new ArrayList<>();
        MessageRequest discountMsgRequest = DataSyncUtil.createMessageRequest(syncDatas,  ConfigServiceOperationCodes.DISCOUNT_PUBLISH, destinations,
                MessageType.GENERAL.toString(), DestinationType.ALL.name());
        dataSyncServiceClient.publish(discountMsgRequest);

        List<ItemGroupMappingDto> objectlist=new ArrayList<ItemGroupMappingDto>();
		for (DiscountItemMappingDao discountItemMappingDao : discountItemMappingDaos) {
			objectlist.add(MapperUtil.mapObjToClass(discountItemMappingDao, ItemGroupMappingDto.class));
		}			

		return objectlist;
		

	}

	@Override
	public DiscountApplicableForItemResponseDto checkIfGivenDiscountApplicableForGiveItem(
			DiscountApplicableForItemCheckRequestDto discountForItemRequest) {

		DiscountApplicableForItemResponseDto responseDto = new DiscountApplicableForItemResponseDto();

		if (discountForItemRequest.getItemDetails() == null
				|| CollectionUtil.isEmpty(discountForItemRequest.getDiscountTypeList())) {
			return responseDto;
		}
		// this implementation is for cumulative discounts only
		if (!(discountForItemRequest.getDiscountTypeList().contains(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())
				|| discountForItemRequest.getDiscountTypeList()
						.contains(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name()))) {
			return responseDto;
		}

		discountForItemRequest.setBusinessDate(CalendarUtils.getStartOfDay(discountForItemRequest.getBusinessDate()));

		String itemCode = discountForItemRequest.getItemDetails().getItemCode();
		String lotNumber = discountForItemRequest.getItemDetails().getLotNumber();
		String productGroupCode = discountForItemRequest.getItemDetails().getProductGroupCode();
		String productCategoryCode = discountForItemRequest.getItemDetails().getProductCategoryCode();

		// defaults discounts
		List<DiscountDao> defaultDiscountList = createItemLevelQuery(discountForItemRequest.getDiscountTypeList(),
				discountForItemRequest.getItemDetails(), discountForItemRequest.getBusinessDate(), itemCode, lotNumber,
				productGroupCode, productCategoryCode, true);

		if (CollectionUtils.isEmpty(defaultDiscountList)) {
			return responseDto;
		}
		Map<String, DiscountDao> discountDaoMap = defaultDiscountList.stream()
				.collect(Collectors.toMap(DiscountDao::getId, Function.identity()));

		// Slab Based Validations
		List<DiscountDetailsDao> discountDetailsDaos = discountDetailsRepository
				.getSlabDetails(discountDaoMap.keySet().stream().collect(Collectors.toList()));

		if (discountDetailsDaos.isEmpty()) {
			return responseDto;
		}

		Map<String, List<DiscountDetailsDao>> discountIdAndItsSlabsWithoutCaratCategory = getDiscountAndItsSlabMap(
				discountDetailsDaos, true);

		if (CollectionUtils.isEmpty(discountIdAndItsSlabsWithoutCaratCategory)) {
			return responseDto;
		}

		responseDto.setValidDiscountDetails(new HashMap<>());

		discountIdAndItsSlabsWithoutCaratCategory.keySet().forEach(discountId -> {
			DiscountDao discountDao = discountDaoMap.get(discountId);
			Boolean isExclude = discountRepository.validateExcludeDetails(discountId, itemCode.substring(2, 6),
					itemCode, discountForItemRequest.getItemDetails().getComplexityPercent(),
					discountForItemRequest.getItemDetails().getMakingChargePerGram());

			BaseBasicCriteriaDetails basicCriteriaDetails = new BaseBasicCriteriaDetails();
			if (!StringUtil.isBlankJsonStr(discountDao.getBasicCriteria())) {
				basicCriteriaDetails = MapperUtil.mapJsonDataToClass(discountDao.getBasicCriteria(),
						BaseBasicCriteriaDetails.class);
			}

			responseDto.getValidDiscountDetails().put(discountDao.getDiscountType(),
					new CummulativeDiscountWithExcludeDto(discountId, null, isExclude, discountDao.getDiscountType(),
							basicCriteriaDetails.getIsApplicableForAutomatedDiscount()));
		});

		return responseDto;
	}
}
