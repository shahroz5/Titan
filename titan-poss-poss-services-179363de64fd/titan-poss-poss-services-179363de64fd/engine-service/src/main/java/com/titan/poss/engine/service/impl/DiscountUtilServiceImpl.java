/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.config.dao.ClubbingDiscountsDao;
import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountDetailsDao;
import com.titan.poss.config.dao.DiscountExcludeMappingDao;
import com.titan.poss.config.dao.DiscountLocationMappingDao;
import com.titan.poss.config.dao.DiscountProductCategoryMappingDao;
import com.titan.poss.config.dao.LinkingDiscountsDao;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.request.json.BestDealDiscountConfigDetails;
import com.titan.poss.config.repository.DiscountProductCategoryMappingRepository;
import com.titan.poss.core.discount.dto.AbCoSlabDiscountRequestDto;
import com.titan.poss.core.discount.dto.ClubbingDiscountDetailsDto;
import com.titan.poss.core.discount.dto.CouponDto;
import com.titan.poss.core.discount.dto.CummulativeDiscountWithExcludeDto;
import com.titan.poss.core.discount.dto.DiscountAttributesDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseResponseDto;
import com.titan.poss.core.discount.dto.DiscountDto;
import com.titan.poss.core.discount.dto.DiscountExcludeComplexityPercentDto;
import com.titan.poss.core.discount.dto.DiscountExcludeMcPerGramDto;
import com.titan.poss.core.discount.dto.DiscountGrnConfigDetails;
import com.titan.poss.core.discount.dto.DiscountItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsReqDto;
import com.titan.poss.core.discount.dto.DiscountItemLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountItemLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemsDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.DiscountProductGroupMappingDto;
import com.titan.poss.core.discount.dto.ExcludeConfigDto;
import com.titan.poss.core.discount.dto.LinkDiscountDetailsDto;
import com.titan.poss.core.discount.dto.LocationOfferDetails;
import com.titan.poss.core.discount.dto.ProductCategoryDetails;
import com.titan.poss.core.discount.dto.ProductGroupDetails;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.discount.dto.SlabConfigDetails;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.BaseBasicCriteriaDetails;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.dto.DiscountCouponDto;
import com.titan.poss.core.dto.TepConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.engine.config.repository.ClubbingDiscountsRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountExcludeMappingRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountLocationMappingRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountProductGroupMappingRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountRepositoryExt;
import com.titan.poss.engine.config.repository.LinkingDiscountsRepositoryExt;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.product.repository.ItemRepositoryExt;
import com.titan.poss.engine.service.DiscountUtilService;
import com.titan.poss.engine.service.IntegrationService;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.product.dao.ItemDao;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Service("discountUtilServiceImpl")
public class DiscountUtilServiceImpl implements DiscountUtilService {

	@Autowired
	ClubbingDiscountsRepositoryExt clubbingRepository;

	@Autowired
	ItemRepositoryExt itemRepository;

	@Autowired
	DiscountProductGroupMappingRepositoryExt discountProductMappingRepository;

	@Autowired
	DiscountExcludeMappingRepositoryExt discountExcludeMappingRepository;

	@Autowired
	DiscountProductCategoryMappingRepository discountProductCategoryMappingRepository;

	@Autowired
	DiscountRepositoryExt discountRepository;

	@Autowired
	IntegrationService intgService;

	@Autowired
	DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	InventoryDetailsRepository inventoryDetailsRepo;

	@Autowired
	DiscountLocationMappingRepositoryExt discountLocationMappingRepository;

	@Autowired
	LinkingDiscountsRepositoryExt linkingDiscountsRepository;

	@Override
	public DiscountItemLevelResponseDto createItemLevelDiscountResponse(List<DiscountDao> discountItemList,
			DiscountItemLevelRequestDto discountRequestDto, Date businessDate,
			Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExclude) {

		DiscountItemLevelResponseDto discountResponseDto = new DiscountItemLevelResponseDto();
		discountResponseDto.setCummulativeDiscountWithExcludeDetails(cummulativeDiscountWithExclude);// for cumm.
																										// discount
		if (!CollectionUtils.isEmpty(discountItemList)) {

			List<DiscountDetailsBaseResponseDto> discountDetailListDto = new ArrayList<>();
			Map<String, DiscountDetailsBaseResponseDto> resultMap = new HashMap<>();
			Map<String, List<RivaahGhsDiscountDto>> rivaahGhsMap = new HashMap<>();

			discountItemList.forEach(discountDao -> {
				SlabConfigDetails slabConfigDetails = new SlabConfigDetails();
				if (discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.SLAB_BASED_DISCOUNT.toString())) {
					// getting discount details for this discount and since it will have common
					// discount category, eligibility details and is single value, returning the
					// first data
					List<DiscountDetailsDao> discountDetails = discountDetailsRepository
							.getSlabDetails(Arrays.asList(discountDao.getId()));
					if (!CollectionUtils.isEmpty(discountDetails)) {
						slabConfigDetails.setDiscountCategory(discountDetails.get(0).getDiscountCategory());
						slabConfigDetails.setEligibilityDetails(discountDetails.get(0).getEligibility());
						slabConfigDetails.setIsSingle(discountDetails.get(0).getIsSingle());
					}
				}
				DiscountDetailsBaseResponseDto responseDto = new DiscountDetailsBaseResponseDto();
				responseDto.setDiscountConfigDetails(setDiscountConfigDetails(discountDao, new DiscountDetailsBaseDto(),
						businessDate, slabConfigDetails));

				List<DiscountDetailsBaseResponseDto> responseDtoList = new ArrayList<>();
				// set RIVAAH GHS details
				List<RivaahGhsDiscountDto> validRivaahDetails = getValidRivaahDetails(discountDao, discountRequestDto);
				if (!CollectionUtils.isEmpty(validRivaahDetails)) {
					for (RivaahGhsDiscountDto rivaahDto : validRivaahDetails) {
						DiscountDetailsBaseResponseDto response = (DiscountDetailsBaseResponseDto) MapperUtil
								.getDtoMapping(responseDto, DiscountDetailsBaseResponseDto.class);
						response.setRivaahGhsDetails(rivaahDto);
						responseDtoList.add(response);
					}
					rivaahGhsMap.put(discountDao.getId(), validRivaahDetails);
				} else {
					responseDtoList.add(responseDto);
				}

				resultMap.put(discountDao.getId(), responseDto);

				discountDetailListDto.addAll(responseDtoList);

			});

			discountResponseDto.setDiscounts(discountDetailListDto);

			List<ClubbingDiscountsDao> clubbingDetails = clubbingRepository.getClubbingDetails(resultMap.keySet());

			List<ClubbingDiscountDetailsDto> clubbingDetailList = new ArrayList<>();

			clubbingDetails.forEach(clubDetail -> {

				List<ClubbingDiscountDetailsDto> clubbingResponseDtoList = new ArrayList<>();
				ClubbingDiscountDetailsDto clubbingResponseDto = new ClubbingDiscountDetailsDto();
				clubbingResponseDto.setClubbingId(clubDetail.getId());

				if (clubDetail.getDiscount1() != null) {
					listDiscountWithRivaah(clubDetail, resultMap.get(clubDetail.getDiscount1().getId()), rivaahGhsMap,
							clubbingResponseDtoList);
				}

				if (clubDetail.getDiscount2() != null) {
					listDiscountWithRivaah(clubDetail, resultMap.get(clubDetail.getDiscount2().getId()), rivaahGhsMap,
							clubbingResponseDtoList);
				}
				if (clubDetail.getDiscount3() != null) {
					listDiscountWithRivaah(clubDetail, resultMap.get(clubDetail.getDiscount3().getId()), rivaahGhsMap,
							clubbingResponseDtoList);
				}

				clubbingDetailList.addAll(clubbingResponseDtoList);

			});

			discountResponseDto.setClubDiscounts(clubbingDetailList);

		}
		return discountResponseDto;

	}

	private void listDiscountWithRivaah(ClubbingDiscountsDao clubDetail,
			DiscountDetailsBaseResponseDto discountDetailsBaseResponseDto,
			Map<String, List<RivaahGhsDiscountDto>> rivaahGhsMap,
			List<ClubbingDiscountDetailsDto> clubbingResponseDtoList) {

		if (clubbingResponseDtoList.isEmpty()) {
			ClubbingDiscountDetailsDto clubbingDiscountDetailsDto = new ClubbingDiscountDetailsDto();
			clubbingDiscountDetailsDto.setClubbingId(clubDetail.getId());
			clubbingResponseDtoList.add(clubbingDiscountDetailsDto);
		}

		if (discountDetailsBaseResponseDto == null) {
			return;
		}

		if (rivaahGhsMap.isEmpty() || !rivaahGhsMap
				.containsKey(discountDetailsBaseResponseDto.getDiscountConfigDetails().getDiscountId())) {
			for (ClubbingDiscountDetailsDto clubDto : clubbingResponseDtoList) {
				List<DiscountDetailsBaseResponseDto> discountList = CollectionUtils.isEmpty(clubDto.getDiscounts())
						? new ArrayList<>()
						: clubDto.getDiscounts();
				discountList.add(discountDetailsBaseResponseDto);
				clubDto.setDiscounts(discountList);
			}
			return;
		}

		// only in case of rivaah, clubbing discount will become multiple, else it will
		// be single
		List<ClubbingDiscountDetailsDto> newClubbingResponseDtoList = new ArrayList<>();
		for (ClubbingDiscountDetailsDto clubDto : clubbingResponseDtoList) {
			for (RivaahGhsDiscountDto rivaahDto : rivaahGhsMap
					.get(discountDetailsBaseResponseDto.getDiscountConfigDetails().getDiscountId())) {
				ClubbingDiscountDetailsDto newClubDto = (ClubbingDiscountDetailsDto) MapperUtil.getDtoMapping(clubDto,
						ClubbingDiscountDetailsDto.class);
				List<DiscountDetailsBaseResponseDto> discountList = CollectionUtils.isEmpty(clubDto.getDiscounts())
						? new ArrayList<>()
						: new ArrayList<>(clubDto.getDiscounts());
				DiscountDetailsBaseResponseDto response = (DiscountDetailsBaseResponseDto) MapperUtil
						.getDtoMapping(discountDetailsBaseResponseDto, DiscountDetailsBaseResponseDto.class);
				response.setRivaahGhsDetails(rivaahDto);
				discountList.add(response);
				newClubDto.setDiscounts(discountList);
				newClubbingResponseDtoList.add(newClubDto);
			}
		}

		if (!newClubbingResponseDtoList.isEmpty()) {
			clubbingResponseDtoList.clear();
			clubbingResponseDtoList.addAll(newClubbingResponseDtoList);
		}
	}

	// get from item master
	@Override
	public ItemDao getItemDetail(String itemCode) {
		Optional<ItemDao> item = itemRepository.findById(itemCode);
		if (item.isPresent()) {
			return item.get();
		} else {
			throw new ServiceException("item not present in the inventory", "");
		}
	}

	@Override
	public Map<DiscountDao, List<DiscountItemsDto>> validateDiscountIdWithRequest(List<DiscountDao> validDiscountList,
			List<DiscountItemsDto> itemDetailsListRequest, Date businessDate, String discountType) {

		Map<DiscountDao, List<DiscountItemsDto>> responseMap = new HashMap<>();

		validDiscountList.forEach(discountDao -> {
			String discountId = discountDao.getId();

			List<DiscountItemsDto> validItemDetailList = new ArrayList<>();
			List<String> karatageTypeList = new ArrayList<>();
			if (discountType != null && discountType.equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())) {
				karatageTypeList.add("1");
				karatageTypeList.add("2");
			}
			// iterating through all items from the request for every discount Id
			itemDetailsListRequest.forEach(itemDetail -> {

				String itemCode = itemDetail.getItemCode();

				// validating ItemCode
				List<DiscountExcludeMappingDao> excludeItem = validateItemCode(discountId, itemCode,
						itemDetail.getComplexityPercent(), itemDetail.getMakingChargePerGram());

				if (excludeItem.isEmpty()) {
					String productGroupCode = itemDetail.getProductGroupCode();
					String productCategoryCode = itemDetail.getProductCategoryCode();

					// validating other Request Details
					DiscountDao validDiscountDao = validateOtherRequestDetails(discountId,
							CalendarUtils.getStartOfDay(businessDate), productGroupCode, productCategoryCode,
							CommonUtil.getLocationCode(), discountDao.getDiscountType());
					if (validDiscountDao != null) {
						if (!karatageTypeList.isEmpty()) {
							itemDetail.setApplicableKaratageType(discountRepository.getKaratType(discountId,
									CalendarUtils.getStartOfDay(businessDate), productGroupCode, productCategoryCode,
									CommonUtil.getLocationCode(), karatageTypeList));
						}
						validItemDetailList.add(itemDetail);

					}
				}

			});
			responseMap.put(discountDao, validItemDetailList);

		});
		return responseMap;

	}

	@Override
	public List<DiscountExcludeMappingDao> validateItemCode(String discountId, String itemCode,
			BigDecimal compelexityPercent, BigDecimal makingChargePerGram) {

		String themeCode = itemCode.substring(2, 6);
		return discountExcludeMappingRepository.validateItemCode(discountId, itemCode, themeCode, compelexityPercent,
				makingChargePerGram);

	}

	@Override
	public DiscountDao validateOtherRequestDetails(String discountId, Date businessDate, String productGroupCode,
			String productCategoryCode, String locationCode, String discountType) {
		// validate all the request details

		if (discountType.equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.toString())
				|| DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equalsIgnoreCase(discountType)) {
			return discountRepository.validateEmpowermentOrRivaahGhsRequestDetails(discountId, productGroupCode,
					productCategoryCode, locationCode);
		} else {
			return discountRepository.validateRequestDetails(discountId, CalendarUtils.getStartOfDay(businessDate),
					productGroupCode, productCategoryCode, locationCode);
		}
	}

	@Override
	public List<String> getValidTSSSCoupons(List<String> couponCodesList) {
		CouponDto requestDto = new CouponDto();
		requestDto.setCouponCodes(couponCodesList);
		ApiResponseDto epossApiResponseDto = callEPOSSAPIThroughIntegration(HttpMethod.POST,
				EngineConstants.VALID_COUPONS_GET_URL, null, requestDto);
		ObjectMapper mapper = new ObjectMapper();
		ListResponse<DiscountCouponDto> response = mapper.convertValue(epossApiResponseDto.getResponse(),
				new TypeReference<ListResponse<DiscountCouponDto>>() {
				});
		List<String> validDiscoundIds = new ArrayList<>();
		response.getResults().forEach(discountCoupon -> validDiscoundIds.add(discountCoupon.getDiscountId()));
		return validDiscoundIds;

	}

	/**
	 * @param httpMethod
	 * @param relativeUrl
	 * @param requestParamters
	 * @param requestBody
	 * @return ApiResponseDto
	 */
	@Override
	public ApiResponseDto callEPOSSAPIThroughIntegration(HttpMethod httpMethod, String relativeUrl,
			Map<String, String> requestParamters, Object requestBody) {
		ApiResponseDto epossResponseDto = intgService.callEpossAPI(httpMethod, relativeUrl, requestParamters,
				requestBody);

		// if 200, then return response
		if (epossResponseDto.getHttpResponseCode() == HttpStatus.OK.value()) {
			return epossResponseDto;

		} else if (epossResponseDto.getHttpResponseCode() == HttpStatus.BAD_REQUEST.value()) {
			// if 400, then throw error
			throw new ServiceException(
					JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.MESSAGE),
					JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.CODE),
					epossResponseDto.getResponse());
		}
		// if not 400, then throw generic error message
		throw new ServiceException("CALL_TO_EPOSS_FAILED", "ERR_INT_025", epossResponseDto.getResponse());
	}

	@Override
	public InventoryDetailsDao validateBestDealDiscountType(DiscountDao discountDao, String itemCode, String lotNumber,
			Date businessDate) {

		// get json data to check against config values
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discountDao.getConfigDetails()), JsonData.class);

		BestDealDiscountConfigDetails bestDealConfigDetails = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(MapperUtil.getJsonString(jsonData.getData())),
				BestDealDiscountConfigDetails.class);

		// validate if item is configured for 100 to 150 days If product is 90 days old
		// system should not give discount

		BigDecimal lotFrom = BigDecimal.ZERO;
		BigDecimal lotTo = BigDecimal.ZERO;
		BigDecimal binFrom = BigDecimal.ZERO;
		BigDecimal binTo = BigDecimal.ZERO;
		if (bestDealConfigDetails.getLotAge() != null) {
			lotFrom = bestDealConfigDetails.getLotAge().getFromValue();
			lotTo = bestDealConfigDetails.getLotAge().getToValue();
		}
		if (bestDealConfigDetails.getBinAge() != null) {
			binFrom = bestDealConfigDetails.getBinAge().getFromValue();
			binTo = bestDealConfigDetails.getBinAge().getToValue();
		}

		return inventoryDetailsRepo.findByLocationCodeBasedOnLotAgeBinAgeWrtBusinessDate(CommonUtil.getLocationCode(),
				itemCode, lotNumber, lotFrom, lotTo, binFrom, binTo, businessDate);

	}

	@Override
	public DiscountBillLevelItemDetailsDto createBillLevelResponse(DiscountDao discountObject,
			List<DiscountItemsDto> itemDetailList) {

		DiscountBillLevelItemDetailsDto itemDetailResponseDto = new DiscountBillLevelItemDetailsDto();
		itemDetailResponseDto.setDiscountCode(discountObject.getDiscountCode());
		itemDetailResponseDto.setDiscountId(discountObject.getId());
		itemDetailResponseDto.setDiscountType(discountObject.getDiscountType());
		itemDetailResponseDto.setItemDetails(itemDetailList);

		// set BasicCriteria object
		JsonData basicCriteriaJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discountObject.getBasicCriteria()), JsonData.class);

		BaseBasicCriteriaDetails basicCriteriaDetails = MapperUtil.mapObjToClass(basicCriteriaJson.getData(),
				BaseBasicCriteriaDetails.class);
		itemDetailResponseDto.setBasicCriteriaDetails(basicCriteriaDetails);

		// set ClubbingDetails object
		JsonData clubbingJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discountObject.getClubOtherOffersConfig()), JsonData.class);

		ClubbingConfigDetails clubbingDetails = MapperUtil.mapObjToClass(clubbingJson.getData(),
				ClubbingConfigDetails.class);
		// setting isClubbedOtherBillLevelDiscounts from club discount type
		if (!StringUtils.isEmpty(discountObject.getClubDiscountType())) {
			JsonObject clubDiscountJson = new JsonParser().parse(discountObject.getClubDiscountType())
					.getAsJsonObject();
			if (clubDiscountJson != null) {
				JsonElement isOtherBillLevelDiscount = clubDiscountJson.getAsJsonObject("data")
						.get("isClubbedOtherBillLevelDiscounts");
				if (isOtherBillLevelDiscount != null && !isOtherBillLevelDiscount.toString().equalsIgnoreCase("null")) {
					clubbingDetails.setIsOtherBillLevelDiscount(isOtherBillLevelDiscount.getAsBoolean());
				}
			}
		}
		itemDetailResponseDto.setClubbingDetails(clubbingDetails);

		return itemDetailResponseDto;

	}

	@Override
	public List<DiscountExcludeMappingDao> validateItemCodeForDiscountList(List<String> discountIds, String itemCode,
			BigDecimal complexityPercent, BigDecimal makingChargePerGram) {

		String themeCode = itemCode.substring(2, 6);
		return discountExcludeMappingRepository.validateItemCodeForDiscountList(discountIds, itemCode, themeCode,
				complexityPercent, makingChargePerGram);

	}

	@Override
	public List<DiscountDao> validateOtherRequestDetailsForDiscountList(List<String> discountIds, Date businessDate,
			String productGroupCode, String productCategoryCode, String locationCode) {
		// validate all the request details

		return discountRepository.validateOtherRequestDetailsForDiscountList(discountIds,
				CalendarUtils.getStartOfDay(businessDate), productGroupCode, productCategoryCode, locationCode);
	}

	@Override
	public List<DiscountDao> validateItemDetailsFromRequest(List<DiscountDao> discounts,
			DiscountItemDetailsDto itemDetails, Date businessDate, String locationCode, boolean empowermentDiscount) {

		List<DiscountDao> validDiscountList = new ArrayList<>();
		if (empowermentDiscount) {
			List<String> discountIds = discounts.stream().map(DiscountDao::getId).collect(Collectors.toList());
			validDiscountList = validateOtherRequestDetailsForEmpowermentDiscountList(discountIds,
					itemDetails.getProductGroupCode(), itemDetails.getProductCategoryCode(),
					CommonUtil.getLocationCode());
		} else {
			for (DiscountDao discount : discounts) {
				// checking whether discount can be given or not for the itemCode
				List<DiscountExcludeMappingDao> invalidItemList = validateItemCode(discount.getId(),
						itemDetails.getItemCode(), itemDetails.getComplexityPercent(),
						itemDetails.getMakingChargePerGram());

				// if emptyList means all the discounts are applicable for this itemCode
				if (CollectionUtils.isEmpty(invalidItemList)) {
					List<DiscountDao> validDiscount = validateOtherRequestDetailsForDiscountList(
							Arrays.asList(discount.getId()), businessDate, itemDetails.getProductGroupCode(),
							itemDetails.getProductCategoryCode(), CommonUtil.getLocationCode());
					if (!CollectionUtils.isEmpty(validDiscount)) {
						validDiscountList.add(discount);
					}
				}
			}
		}
		return validDiscountList;
	}

	@Override
	public List<DiscountDetailsDao> validateItemRequestDetails(String discountId, Date businessDate,
			DiscountItemDetailsReqDto item, boolean throwException, boolean empowermentDiscount, Date offerEndDate,
			Integer offerGrace) {

		String itemCode = item.getItemCode();
		String productGroupCode = item.getProductGroupCode();
		String productCategoryCode = item.getProductCategoryCode();
		String themeCode = item.getItemCode().substring(2, 6);

		DiscountDao validDiscountObject = null;
		if (empowermentDiscount) {
			validDiscountObject = discountRepository.validateItemRequestDetailsListWithoutDate(discountId,
					CommonUtil.getLocationCode(), productGroupCode, productCategoryCode);
		} else if (offerEndDate != null) {
			validDiscountObject = discountRepository.validateItemRequestDetailsListwithGracePeriod(discountId,
					businessDate, CommonUtil.getLocationCode(), productGroupCode, productCategoryCode, offerEndDate);
		} else if (offerGrace != null) {
			validDiscountObject = discountRepository.validateItemRequestDetailsListwithGraceAdditional(discountId,
					businessDate, CommonUtil.getLocationCode(), productGroupCode, productCategoryCode, offerGrace);
		} else {
			validDiscountObject = discountRepository.validateItemRequestDetailsForDiscount(discountId, businessDate,
					CommonUtil.getLocationCode(), productGroupCode, productCategoryCode);
		}
		// validating exclude item code, theme code, making charge per gram and
		// complexity percent
		if (validDiscountObject != null) {
			BigDecimal complexityPercent = null;
			BigDecimal makingChargePerGram = null;
			if (item.getPriceDetails() != null && item.getPriceDetails().getMakingChargeDetails() != null) {
				complexityPercent = item.getPriceDetails().getMakingChargeDetails().getWastagePct();
				makingChargePerGram = item.getPriceDetails().getMakingChargeDetails().getMakingChargePgram();
			}
			Boolean isExclude = discountRepository.validateExcludeDetails(discountId, themeCode, itemCode,
					complexityPercent, makingChargePerGram);
			if (BooleanUtils.isTrue(isExclude)) {
				item.setIsExclude(isExclude);
				if (empowermentDiscount) {
					validDiscountObject = null;// for empowerment
				}
			}
		}
		List<DiscountDetailsDao> discountDetail = null;
		if (validDiscountObject == null) {
			if (throwException) {
				throw new ServiceException(ConfigConstants.DISCOUNTS_NOT_AVAILABLE_ON_ITEMS,
						ConfigConstants.ERR_CONFIG_140);
			}
		} else {
			// for high level discount applicable theme is validated in sales
			discountDetail = discountDetailsRepository.getDiscountDetails(validDiscountObject.getId(),
					productGroupCode);
		}
		return discountDetail;

	}

	@Override
	public DiscountDetailsBaseDto setDiscountConfigDetails(DiscountDao validDiscountObj,
			DiscountDetailsBaseDto responseObject, Date businessDate, SlabConfigDetails slabConfigDetails) {

		responseObject.setDiscountId(validDiscountObj.getId());
		responseObject.setDiscountType(validDiscountObj.getDiscountType());
		responseObject.setDiscountCode(validDiscountObj.getDiscountCode());

		// set discount Attributes
		DiscountAttributesDto discountAttributes = new DiscountAttributesDto();
		discountAttributes.setIsAccrualUlpPoints(validDiscountObj.getIsAccrualUlp());
		discountAttributes.setIsRiva(validDiscountObj.getIsRiva());
		discountAttributes.setClubbingDiscountType(validDiscountObj.getClubbingDiscountType());
		discountAttributes.setOccasion(validDiscountObj.getOccasion());

		responseObject.setDiscountAttributes(discountAttributes);

		// set BasicCriteria object
		JsonData basicCriteriaJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(validDiscountObj.getBasicCriteria()), JsonData.class);

		BaseBasicCriteriaDetails basicCriteriaDetails = MapperUtil.mapObjToClass(basicCriteriaJson.getData(),
				BaseBasicCriteriaDetails.class);
		if (validDiscountObj.getDiscountType().equalsIgnoreCase("COIN_OFFER_DISCOUNT")) {
			basicCriteriaDetails.setMCPercent(
					JsonUtils.getValueFromJson(basicCriteriaJson.getData(), "mCPercent", BigDecimal.class));
		}
		responseObject.setBasicCriteriaDetails(basicCriteriaDetails);

		// set ClubbingDetails object
		JsonData clubbingJson = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(validDiscountObj.getClubOtherOffersConfig()), JsonData.class);

		ClubbingConfigDetails clubbingDetails = MapperUtil.mapObjToClass(clubbingJson.getData(),
				ClubbingConfigDetails.class);
		// setting isClubbedOtherBillLevelDiscounts from club discount type
		if (!StringUtils.isEmpty(validDiscountObj.getClubDiscountType())) {
			JsonObject clubDiscountJson = new JsonParser().parse(validDiscountObj.getClubDiscountType())
					.getAsJsonObject();
			if (clubDiscountJson != null) {
				JsonElement isOtherBillLevelDiscount = clubDiscountJson.getAsJsonObject("data")
						.get("isClubbedOtherBillLevelDiscounts");
				if (isOtherBillLevelDiscount != null && !isOtherBillLevelDiscount.toString().equalsIgnoreCase("null")) {
					clubbingDetails.setIsOtherBillLevelDiscount(isOtherBillLevelDiscount.getAsBoolean());
				}
			}
		}
		responseObject.setClubbingDetails(clubbingDetails);

		// set GrnDetails object
		JsonData grnDetailJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(validDiscountObj.getGrnDetails()), JsonData.class);

		DiscountGrnConfigDetails grnDetails = MapperUtil.mapObjToClass(grnDetailJson.getData(),
				DiscountGrnConfigDetails.class);
		responseObject.setGrnConfigDetails(grnDetails);

		JsonData tepDetailJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(validDiscountObj.getTepDetails()), JsonData.class);

		// set TepConfigDetails object
		TepConfigDetails tepDetail = MapperUtil.mapObjToClass(tepDetailJson.getData(), TepConfigDetails.class);
		responseObject.setTepConfigDetails(tepDetail);

		JsonData orderDetailJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(validDiscountObj.getOrderDetails()), JsonData.class);

		// set OrderConfigDetails object
		DiscountOrderConfigDetails orderDetail = MapperUtil.mapObjToClass(orderDetailJson.getData(),
				DiscountOrderConfigDetails.class);
		responseObject.setOrderConfigDetails(orderDetail);

		// getting config details wrt location and business date
		DiscountLocationMappingDao locationDetails = null;
		if (DiscountTypeEnum.EMPOWERMENT_DISCOUNT.toString().equalsIgnoreCase(validDiscountObj.getDiscountType())) {
			locationDetails = discountLocationMappingRepository
					.getEmpowermentLocationConfigDetails(validDiscountObj.getId(), CommonUtil.getLocationCode());
		} else {
			locationDetails = discountLocationMappingRepository.getLocationDetails(validDiscountObj.getId(),
					CommonUtil.getLocationCode(), businessDate);
		}

		if (locationDetails != null) {
			LocationOfferDetails locationOfferDetails = new LocationOfferDetails();
			locationOfferDetails.setOfferStartDate(locationDetails.getOfferStartDate());
			locationOfferDetails.setOfferEndDate(locationDetails.getOfferEndDate());
			locationOfferDetails.setPreviewOfferStartDate(locationDetails.getPreviewStartDate());
			locationOfferDetails.setPreviewOfferEndDate(locationDetails.getPreviewEndDate());

			if (DiscountTypeEnum.EMPOWERMENT_DISCOUNT.toString().equalsIgnoreCase(validDiscountObj.getDiscountType())
					&& !StringUtils.isEmpty(locationDetails.getConfigDetails())) {
				JsonObject empowermentConfigDetails = new JsonParser().parse(locationDetails.getConfigDetails())
						.getAsJsonObject();
				int quarter = CalendarUtils.getQuarterFromDate(businessDate);
				if (empowermentConfigDetails != null && empowermentConfigDetails.getAsJsonObject("data")
						.getAsJsonObject("Q" + quarter).get("isQ" + quarter + "Enabled").getAsBoolean()) {
					BigDecimal empowermentMaxQuarterDiscountValue = empowermentConfigDetails.getAsJsonObject("data")
							.getAsJsonObject("Q" + quarter).get("value").getAsBigDecimal();
					locationOfferDetails.setEmpowermentQuarterMaxDiscountValue(empowermentMaxQuarterDiscountValue);
				}
			}
			responseObject.setLocationOfferDetails(locationOfferDetails);
		}

		// setting slab config details
		responseObject.setSlabConfigDetails(slabConfigDetails);

		// set ApplicableThemes details
		if (!StringUtils.isEmpty(validDiscountObj.getApplicableThemes())) {
			JsonData applicableThemeJson = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(validDiscountObj.getApplicableThemes()), JsonData.class);

			responseObject.setApplicableThemeDetails(applicableThemeJson);
		}

		// setting product group mapping
		List<DiscountProductGroupMappingDto> productGroupList = discountProductMappingRepository
				.getProductGroupMappingList(validDiscountObj.getId());
		ProductGroupDetails productGroupDetails = new ProductGroupDetails();
		productGroupDetails.setProductGroups(productGroupList);
		responseObject.setProductGroups(productGroupDetails);

		// setting product category mapping
		List<DiscountProductCategoryMappingDao> productCategoryList = discountProductCategoryMappingRepository
				.findAllByDiscountId(validDiscountObj.getId());
		ProductCategoryDetails productCategoryDetails = new ProductCategoryDetails();
		List<String> category = productCategoryList.stream()
				.map(DiscountProductCategoryMappingDao::getProductCategoryCode).collect(Collectors.toList());
		productCategoryDetails.setProductCategory(category);
		responseObject.setProductCategory(productCategoryDetails);

		responseObject.setAppliedDiscountMaster(mapDiscountDto(validDiscountObj));

		List<LinkingDiscountsDao> linkedDiscounts = linkingDiscountsRepository.findAllBySrcDiscountId(validDiscountObj);
		List<String> discountCodes = new ArrayList<>();
		if (!linkedDiscounts.isEmpty()) {
			LinkDiscountDetailsDto linkDiscountDetailsDto = new LinkDiscountDetailsDto();
			linkedDiscounts.forEach(discount -> {
				discountCodes.add(discount.getDestDiscountId().getId());
			});
			linkDiscountDetailsDto.setLinkDiscountDetails(discountCodes);
			responseObject.setLinkDiscountDetails(linkDiscountDetailsDto);
		}
		// set exchange offer config details
		if (!StringUtils.isEmpty(validDiscountObj.getConfigDetails())) {
			JsonData exchangeConfigDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(validDiscountObj.getConfigDetails()), JsonData.class);

			responseObject.setExchangeConfigDetails(exchangeConfigDetails);
		}

		return responseObject;
	}

	@Override
	public DiscountLocationMappingDao getDiscountLocationMapping(String discountId) {
		DiscountLocationMappingDao discountLocationMapping = discountLocationMappingRepository
				.getEmpowermentLocationConfigDetails(discountId, CommonUtil.getLocationCode());

		if (discountLocationMapping == null) {
			throw new ServiceException(ConfigConstants.DISCOUNTS_NOT_AVAILABLE_ON_ITEMS,
					ConfigConstants.ERR_CONFIG_140);
		}
		return discountLocationMapping;
	}

	@Override
	public List<DiscountDao> validateOtherRequestDetailsForEmpowermentDiscountList(List<String> discountIds,
			String productGroupCode, String productCategoryCode, String locationCode) {
		// validate all the request details
		return discountRepository.validateOtherRequestDetailsForEmpowermentDiscountList(discountIds, productGroupCode,
				productCategoryCode, locationCode);
	}

	@Override
	public DiscountDao mapDiscountDao(DiscountDto discountDto) {

		DiscountDao discount = new DiscountDao();
		discount.setId(discountDto.getId());
		discount.setDiscountCode(discountDto.getDiscountCode());
		discount.setDescription(discountDto.getDescription());
		discount.setApprovedBy(discountDto.getApprovedBy());
		discount.setDiscountType(discountDto.getDiscountType());
		discount.setOccasion(discountDto.getOccasion());
		discount.setSubBrandCode(discountDto.getSubBrandCode());
		discount.setBrandCode(discountDto.getBrandCode());
		discount.setIsPreviewApplicable(discountDto.getIsPreviewApplicable());
		discount.setUlpCreateDate(discountDto.getUlpCreateDate());
		discount.setIsAbOfferApplicable(discountDto.getIsAbOfferApplicable());
		discount.setIsCoOfferApplicable(discountDto.getIsCoOfferApplicable());
		discount.setIsRiva(discountDto.getIsRiva());
		discount.setIsAccrualUlp(discountDto.getIsAccrualUlp());
		discount.setCumulativeDetails(MapperUtil.getStringFromJson(discountDto.getCumulativeDetails()));
		discount.setGrnDetails(MapperUtil.getStringFromJson(discountDto.getGrnDetails()));
		discount.setOrderDetails(MapperUtil.getStringFromJson(discountDto.getOrderDetails()));
		discount.setTepDetails(MapperUtil.getStringFromJson(discountDto.getTepDetails()));
		discount.setApplicableLevels(discountDto.getApplicableLevels() == null ? null
				: discountDto.getApplicableLevels().toString().replace("[", "").replace("]", ""));
		discount.setRemarks(discountDto.getRemarks());
		discount.setBasicCriteria(MapperUtil.getStringFromJson(discountDto.getBasicCriteria()));
		discount.setClubOtherOffersConfig(MapperUtil.getStringFromJson(discountDto.getClubOtherOffersConfig()));
		discount.setClubDiscountType(discountDto.getClubDiscountType() == null ? null
				: MapperUtil.getStringFromJson(discountDto.getClubDiscountType()));
		discount.setAbCoData(MapperUtil.getStringFromJson(discountDto.getAbCoData()));
		discount.setConfigDetails(MapperUtil.getStringFromJson(discountDto.getConfigDetails()));
		discount.setRivaahItemGroupConfig(MapperUtil.getStringFromJson(discountDto.getItemGroupConfig()));
		if (discountDto.getRivaahItemGroupConfig() != null)
			discount.setRivaahItemGroupConfig(MapperUtil.getStringFromJson(discountDto.getRivaahItemGroupConfig()));
		discount.setApplicableThemes(MapperUtil.getStringFromJson(discountDto.getApplicableThemes()));
		discount.setClubbingDiscountType(discountDto.getClubbingDiscountType());
		discount.setIsPublishPending(discountDto.getIsPublishPending());
		discount.setPublishTime(discountDto.getPublishTime());

		return discount;
	}

	@Override
	public DiscountDto mapDiscountDto(DiscountDao discountDao) {
		DiscountDto discount = new DiscountDto();
		discount.setId(discountDao.getId());
		discount.setDiscountCode(discountDao.getDiscountCode());
		discount.setDescription(discountDao.getDescription());
		discount.setApprovedBy(discountDao.getApprovedBy());
		discount.setDiscountType(discountDao.getDiscountType());
		discount.setOccasion(discountDao.getOccasion());
		discount.setSubBrandCode(discountDao.getSubBrandCode());
		discount.setBrandCode(discountDao.getBrandCode());
		discount.setIsPreviewApplicable(discountDao.getIsPreviewApplicable());
		discount.setIsAbOfferApplicable(discountDao.getIsAbOfferApplicable());
		discount.setIsCoOfferApplicable(discountDao.getIsCoOfferApplicable());
		discount.setIsRiva(discountDao.getIsRiva());
		discount.setIsAccrualUlp(discountDao.getIsAbOfferApplicable());
		discount.setUlpCreateDate(discountDao.getUlpCreateDate());
		if (!StringUtils.isEmpty(discountDao.getCumulativeDetails())) {
			JsonData cumlativeDetails = MapperUtil.mapObjToClass(discountDao.getCumulativeDetails(), JsonData.class);
			discount.setCumulativeDetails(cumlativeDetails);
		}
		if (!StringUtils.isEmpty(discountDao.getGrnDetails())) {
			JsonData grnDetails = MapperUtil.mapObjToClass(discountDao.getGrnDetails(), JsonData.class);
			discount.setGrnDetails(grnDetails);

		}
		if (!StringUtils.isEmpty(discountDao.getOrderDetails())) {
			JsonData orderDetails = MapperUtil.mapObjToClass(discountDao.getOrderDetails(), JsonData.class);
			discount.setOrderDetails(orderDetails);
		}
		if (!StringUtils.isEmpty(discountDao.getTepDetails())) {
			JsonData tepDetails = MapperUtil.mapObjToClass(discountDao.getTepDetails(), JsonData.class);
			discount.setTepDetails(tepDetails);
		}
		if (!StringUtils.isEmpty(discountDao.getApplicableLevels())) {
			List<String> applicableLevels = new ArrayList<>(
					Arrays.asList(discountDao.getApplicableLevels().split(",")));
			discount.setApplicableLevels(applicableLevels);
		}

		if (!StringUtils.isEmpty(discountDao.getBasicCriteria())) {
			JsonData basicCriteria = MapperUtil.mapObjToClass(discountDao.getBasicCriteria(), JsonData.class);
			discount.setBasicCriteria(basicCriteria);
		}
		if (!StringUtils.isEmpty(discountDao.getClubOtherOffersConfig())) {
			JsonData clubOtherOffersConfig = MapperUtil.mapObjToClass(discountDao.getClubOtherOffersConfig(),
					JsonData.class);
			discount.setClubOtherOffersConfig(clubOtherOffersConfig);
		}
		if (!StringUtils.isEmpty(discountDao.getClubDiscountType())) {
			JsonData clubDiscountType = MapperUtil.mapObjToClass(discountDao.getClubDiscountType(), JsonData.class);
			discount.setClubDiscountType(clubDiscountType);
		}
		if (!StringUtils.isEmpty(discountDao.getAbCoData())) {
			JsonData abcoData = MapperUtil.mapObjToClass(discountDao.getAbCoData(), JsonData.class);
			discount.setAbCoData(abcoData);
		}
		if (!StringUtils.isEmpty(discountDao.getConfigDetails())) {
			JsonData configDetails = MapperUtil.mapObjToClass(discountDao.getConfigDetails(), JsonData.class);
			discount.setConfigDetails(configDetails);
		}
		if (!StringUtils.isEmpty(discountDao.getItemGroupConfig())) {
			JsonData itemGroupConfig = MapperUtil.mapObjToClass(discountDao.getItemGroupConfig(), JsonData.class);
			discount.setItemGroupConfig(itemGroupConfig);
		}
		if (!StringUtils.isEmpty(discountDao.getRivaahItemGroupConfig())) {
			JsonData rivaahItemGroupConfig = MapperUtil.mapObjToClass(discountDao.getRivaahItemGroupConfig(),
					JsonData.class);
			discount.setRivaahItemGroupConfig(rivaahItemGroupConfig);
		}
		if (!StringUtils.isEmpty(discountDao.getApplicableThemes())) {
			JsonData applicableTheme = MapperUtil.mapObjToClass(discountDao.getApplicableThemes(), JsonData.class);
			discount.setApplicableThemes(applicableTheme);
		}
		discount.setRemarks(discountDao.getRemarks());
		discount.setClubbingDiscountType(discountDao.getClubbingDiscountType());
		discount.setIsPublishPending(discountDao.getIsPublishPending());
		discount.setPublishTime(discountDao.getPublishTime());
		return discount;
	}

	private List<RivaahGhsDiscountDto> getValidRivaahDetails(DiscountDao discountDao,
			DiscountItemLevelRequestDto discountRequestDto) {

		List<RivaahGhsDiscountDto> validRivaahDetails = new ArrayList<>();

		if (!DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name().equals(discountDao.getDiscountType())
				|| discountRequestDto.getRivaahGhsDetails() == null
				|| CollectionUtils.isEmpty(discountRequestDto.getRivaahGhsDetails().getRivaahGhs())) {
			return validRivaahDetails;
		}

		for (RivaahGhsDiscountDto rivaahGhsDiscountDto : discountRequestDto.getRivaahGhsDetails().getRivaahGhs()) {
			List<String> schemeList = discountExcludeMappingRepository.getMappedSchemeCodes(discountDao.getId());
			if (!CollectionUtils.isEmpty(schemeList) && schemeList.contains(rivaahGhsDiscountDto.getSchemeCode())) {
				validRivaahDetails.add(rivaahGhsDiscountDto);
			}
		}

		return validRivaahDetails;
	}

	@Override
	public Boolean validateItemRequestDetailsForAbToCmCumulativeDiscount(DiscountItemDetailsReqDto item,
			AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto) {

		String itemCode = item.getItemCode();
		String productGroupCode = item.getProductGroupCode();
		String productCategoryCode = item.getProductCategoryCode();
		String themeCode = item.getItemCode().substring(2, 6);

		boolean isValidItemPgc = false;
		boolean isValidItemPcc = false;
		if (abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getProductGroups() != null) {
			for (DiscountProductGroupMappingDto pgcDetails : abCoSlabDiscountRequestDto
					.getDiscountDetilsConfigRequestDto().getProductGroups().getProductGroups()) {
				if (productGroupCode.equals(pgcDetails.getProductGroup())) {
					isValidItemPgc = productGroupCode.equals(pgcDetails.getProductGroup());
					break;
				}
			}
		}
		if (abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getProductCategory() != null) {
			isValidItemPcc = (abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getProductCategory()
					.getProductCategory().contains(productCategoryCode));
		}

		// validating exclude item code, theme code, making charge per gram and
		// complexity percent
		if (isValidItemPgc && isValidItemPcc) {
			BigDecimal complexityPercent = null;
			BigDecimal makingChargePerGram = null;
			if (item.getPriceDetails() != null && item.getPriceDetails().getMakingChargeDetails() != null) {
				complexityPercent = item.getPriceDetails().getMakingChargeDetails().getWastagePct();
				makingChargePerGram = item.getPriceDetails().getMakingChargeDetails().getMakingChargePgram();
			}
			if (BooleanUtils.isTrue(isExcludeItemCheck(itemCode, themeCode, complexityPercent, makingChargePerGram,
					abCoSlabDiscountRequestDto.getDiscountDetilsConfigRequestDto().getExcludeConfigDto()))) {
				item.setIsExclude(true);
			}
		}

		return (isValidItemPgc && isValidItemPcc);

	}

	private Boolean isExcludeItemCheck(String itemCode, String themeCode, BigDecimal complexityPercent,
			BigDecimal makingChargePerGram, ExcludeConfigDto excludeConfigDto) {

		Boolean isExclude = false;
		if (excludeConfigDto == null) {
			return isExclude;
		}

		if (excludeConfigDto.getItemCodes() != null) {
			isExclude = isExclude || (excludeConfigDto.getItemCodes().contains(itemCode));
		}
		if (excludeConfigDto.getThemeCodes() != null) {
			isExclude = isExclude || (excludeConfigDto.getThemeCodes().contains(themeCode));
		}
		if (makingChargePerGram != null && excludeConfigDto.getMakingChargePerGram() != null) {
			for (DiscountExcludeMcPerGramDto mcDto : excludeConfigDto.getMakingChargePerGram()) {
				isExclude = isExclude || (makingChargePerGram.compareTo(mcDto.getFromValue()) >= 0
						&& makingChargePerGram.compareTo(mcDto.getToValue()) <= 0);
			}
		}
		if (complexityPercent != null && excludeConfigDto.getComplexityPercent() != null) {
			for (DiscountExcludeComplexityPercentDto cmpxDto : excludeConfigDto.getComplexityPercent()) {
				isExclude = isExclude || (complexityPercent.compareTo(cmpxDto.getFromValue()) >= 0
						&& complexityPercent.compareTo(cmpxDto.getToValue()) <= 0);
			}
		}

		return isExclude;
	}
}
