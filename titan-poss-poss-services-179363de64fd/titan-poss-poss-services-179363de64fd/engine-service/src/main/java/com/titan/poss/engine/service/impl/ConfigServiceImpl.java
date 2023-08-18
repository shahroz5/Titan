/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.ConfigLovDao;
import com.titan.poss.config.dao.DiscountTypeMetaDataDao;
import com.titan.poss.config.dao.ExchangeConfigDetailsDao;
import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDao;
import com.titan.poss.config.dao.ExchangeConfigLocationMappingDao;
import com.titan.poss.config.dao.ExchangeConfigMasterDao;
import com.titan.poss.config.dao.ExchangeConfigProductMappingDao;
import com.titan.poss.config.dao.ExchangeConfigStoneMappingDao;
import com.titan.poss.config.dao.FocSchemeDetailsDao;
import com.titan.poss.config.dao.FocSchemeLocationMappingDao;
import com.titan.poss.config.dao.FocSchemeMasterDao;
import com.titan.poss.config.dao.FocSchemeProductMappingDao;
import com.titan.poss.config.dto.ConfigDetailsDto;
import com.titan.poss.config.dto.FocItemDto;
import com.titan.poss.config.dto.FocSchemeBaseDto;
import com.titan.poss.config.dto.FocSchemeResponseDto;
import com.titan.poss.config.dto.ManualFocSchemeResponseDto;
import com.titan.poss.config.dto.PurchaseItemDto;
import com.titan.poss.config.dto.constants.CategoryEnum;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.ConfigTypeEnum;
import com.titan.poss.config.dto.constants.FocEligibilityEnum;
import com.titan.poss.config.dto.constants.ItemTypeEnum;
import com.titan.poss.config.dto.constants.OfferTypeEnum;
import com.titan.poss.config.dto.request.json.LocationConfigDetails;
import com.titan.poss.config.dto.request.json.OrderConfigDetails;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.discount.dto.FocSchemeRequestDto;
import com.titan.poss.core.domain.constant.TepTypeEnum;
import com.titan.poss.core.domain.constant.TransactionTypeEnum;
import com.titan.poss.core.dto.BankingDetails;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.FocItemDetailsDto;
import com.titan.poss.core.dto.FocProductDetailsJsonDto;
import com.titan.poss.core.dto.FocSchemeDetailsDto;
import com.titan.poss.core.dto.FocSchemeIndividualBaseDto;
import com.titan.poss.core.dto.FocSchemeItemResponseDto;
import com.titan.poss.core.dto.FocSchemeProductMappingDto;
import com.titan.poss.core.dto.GepConfigDetailResponse;
import com.titan.poss.core.dto.GepDiscountConfigurationDetailsDto;
import com.titan.poss.core.dto.GepRequestDetail;
import com.titan.poss.core.dto.KeyValueDto;
import com.titan.poss.core.dto.LocationResponseDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.PurchaseItemRequestDto;
import com.titan.poss.core.dto.RivaahProductGroupGepPurityDetails;
import com.titan.poss.core.dto.TepCutPieceConfigDto;
import com.titan.poss.core.dto.TepExceptionDetailsResponseDto;
import com.titan.poss.core.dto.TepGeneralCodeConfigDto;
import com.titan.poss.core.dto.TepGeneralCodesConfig;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepProductGroupConfigDetails;
import com.titan.poss.core.dto.TepStoneResponseDto;
import com.titan.poss.core.dto.TepValidationConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.engine.config.dto.request.VerifyManualFOCDto;
import com.titan.poss.engine.config.repository.ConfigLovRepositoryExt;
import com.titan.poss.engine.config.repository.DiscountTypeMetaDataRepository;
import com.titan.poss.engine.config.repository.ExchangeConfigDetailsRepositoryExt;
import com.titan.poss.engine.config.repository.ExchangeConfigExcludeMappingRepositoryExt;
import com.titan.poss.engine.config.repository.ExchangeConfigLocationMappingRepositoryExt;
import com.titan.poss.engine.config.repository.ExchangeConfigMasterReporsitoryExt;
import com.titan.poss.engine.config.repository.ExchangeConfigProductMappingRepositoryExt;
import com.titan.poss.engine.config.repository.ExchangeConfigStoneMappingRepositoryExt;
import com.titan.poss.engine.config.repository.FocSchemeDetailsRepositoryExt;
import com.titan.poss.engine.config.repository.FocSchemeItemMappingRepositoryExt;
import com.titan.poss.engine.config.repository.FocSchemeLocationMappingRepositoryExt;
import com.titan.poss.engine.config.repository.FocSchemeMasterRepositoryExt;
import com.titan.poss.engine.config.repository.FocSchemeProductMappingRepositoryExt;
import com.titan.poss.engine.constant.PaymentCodeEnum;
import com.titan.poss.engine.dto.FocItemLiteDto;
import com.titan.poss.engine.dto.TepStoneDto;
import com.titan.poss.engine.dto.request.TepStoneRequestDto;
import com.titan.poss.engine.dto.response.CustomerDto;
import com.titan.poss.engine.dto.response.FocSchemeForABResponseDto;
import com.titan.poss.engine.product.repository.ItemRepositoryExt;
import com.titan.poss.engine.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.engine.sales.repository.FocSchemesRepositoryExt;
import com.titan.poss.engine.sales.repository.OrderDetailsRepositoryExt;
import com.titan.poss.engine.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.engine.service.ConfigService;
import com.titan.poss.engine.service.LocationService;
import com.titan.poss.engine.service.RuleService;
import com.titan.poss.engine.service.SalesService;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.FocSchemesDao;
import com.titan.poss.sales.dao.OrderDetailsDao;
import com.titan.poss.sales.dao.SalesTxnDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ConfigServiceImpl implements ConfigService {

	@Autowired
	private ExchangeConfigDetailsRepositoryExt exchangeConfigDetailRepo;

	@Autowired
	private ExchangeConfigLocationMappingRepositoryExt exchangeConfigLocationRepo;

	@Autowired
	private FocSchemeMasterRepositoryExt focSchemeMasterRepo;

	@Autowired
	private FocSchemeProductMappingRepositoryExt focSchemeProductMappingRepo;

	@Autowired
	private FocSchemeDetailsRepositoryExt focSchemeDetailsRepo;

	@Autowired
	private FocSchemeItemMappingRepositoryExt focSchemeItemMappingRepo;

	@Autowired
	private FocSchemeLocationMappingRepositoryExt focSchemeLocationMappingRepo;

	@Autowired
	private ItemRepositoryExt itemDaoRepository;

	@Autowired
	private SalesService salesService;

	@Autowired
	FocSchemesRepositoryExt focSchemesRepository;

	@Autowired
	private ExchangeConfigProductMappingRepositoryExt exchangeConfigProductMappingRepo;

	@Autowired
	private ExchangeConfigMasterReporsitoryExt exchangeConfigMasterRepo;

	@Autowired
	private ExchangeConfigStoneMappingRepositoryExt exchangeConfigStoneMappingRepo;

	@Autowired
	private ConfigLovRepositoryExt configLovRepo;

	@Autowired
	DiscountTypeMetaDataRepository discountTypeMetaDataRepository;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepoExt;

	@Autowired
	CashMemoDetailsRepositoryExt cashMemoDetailsRepoExt;

	@Autowired
	private OrderDetailsRepositoryExt orderRepo;

	@Autowired
	private RuleService ruleService;

	@Autowired
	private LocationService locationService;

	@Autowired
	private ExchangeConfigExcludeMappingRepositoryExt exchangeConfigExcludeMappingRepository;

	private static final String LOC_CODE = "location code : ";

	private static final String ITEM_CODE = "item code : ";

	private static final String TEP_TYPE = "tepType";

	private static final String REGULAR_TEP = "Regular TEP";

	private static final String INTERBRAND_TEP = "Inter Brand TEP";

	private static final String FULL_VALUE_TEP = "Full Value TEP";

	private static final String CUT_PIECE_TEP = "Cut Piece TEP";

	private static final String MOBILENUMBER = "mobileNumber";
	
	private static final String RO_PAYMENT = "RO PAYMENT";

	@Override
	public GepConfigDetailResponse getGEPDetails(GepRequestDetail gepRequestDetail) {
		// fetch deduction/scheme percentage based on
		GepConfigDetailResponse gepConfigDetailResp = null;
		String configId = getGepLocationMapping().getExchangeConfig().getConfigId();
		ExchangeConfigDetailsDao exchangeConfigDetail = exchangeConfigDetailRepo.findByCombination(configId,
				gepRequestDetail.getMetalType(), gepRequestDetail.getItemType(), gepRequestDetail.getPurity());
		if (exchangeConfigDetail == null) {
			throw new ServiceException(ConfigConstants.NO_CONFIGURATION_FOUND_FOR_REQUESTED_COMBINATION,
					ConfigConstants.ERR_CONFIG_087,
					"GEP combination :- itemType : " + gepRequestDetail.getItemType() + " , metalType : "
							+ gepRequestDetail.getMetalType() + " , configId : " + configId + " , business date : "
							+ gepRequestDetail.getBuisnessDate() + " , purity : " + gepRequestDetail.getPurity()
							+ " , locationCode : " + CommonUtil.getLocationCode());
		}
		gepConfigDetailResp = (GepConfigDetailResponse) MapperUtil.getDtoMapping(exchangeConfigDetail,
				GepConfigDetailResponse.class);
		gepConfigDetailResp.setRangeId(exchangeConfigDetail.getRange().getId());
		gepConfigDetailResp.setHoldTime(getHoldTime(exchangeConfigDetail));
		gepConfigDetailResp.setConfigId(exchangeConfigDetail.getExchangeConfig().getConfigId());
		gepConfigDetailResp.setConfigName(exchangeConfigDetail.getExchangeConfig().getDescription());
		gepConfigDetailResp.setConfigType(exchangeConfigDetail.getExchangeConfig().getConfigType());
		return gepConfigDetailResp;
	}

	private Integer getHoldTime(ExchangeConfigDetailsDao gepConfigDetail) {
		Object configDetailsObj = MapperUtil.getJsonFromString(gepConfigDetail.getExchangeConfig().getConfigDetails());
		ConfigDetailsDto configDetails = MapperUtil.getObjectMapperInstance().convertValue(configDetailsObj,
				ConfigDetailsDto.class);
		return configDetails.getHoldTime();
	}

	public ExchangeConfigLocationMappingDao getGepLocationMapping() {
		// fetch config id based on locationCode
		Optional<ExchangeConfigLocationMappingDao> exchangeConfigLocation = exchangeConfigLocationRepo
				.findByLocationCodeAndConfigType(CommonUtil.getLocationCode(), ConfigTypeEnum.GEP_ITEM.toString());
		if (!exchangeConfigLocation.isPresent()) {
			throw new ServiceException(ConfigConstants.NO_LOCATION_MAPPING_FOUND_FOR_REQUESTED_DETAILS,
					ConfigConstants.ERR_CONFIG_055, LOC_CODE + CommonUtil.getLocationCode());
		}
		return exchangeConfigLocation.get();
	}

	@Transactional(readOnly = true) // to maintain session for FK
	@Override
	public ListResponse<GepDiscountConfigurationDetailsDto> getGEPDiscountConfigs(List<BigDecimal> purityList) {
		ExchangeConfigLocationMappingDao locationMapping = getGepLocationMapping();

		if (locationMapping == null || BooleanUtils.isNotTrue(locationMapping.getExchangeConfig().getIsActive())) {
			return new ListResponse<>();
		}

		JsonData configJsonData = MapperUtil.mapObjToClass(locationMapping.getExchangeConfig().getConfigDetails(),
				JsonData.class);
		JsonData offerJsonData = MapperUtil.mapObjToClass(locationMapping.getExchangeConfig().getOfferDetails(),
				JsonData.class);

		GepDiscountConfigurationDetailsDto gepDiscountConfigurationDetailsDto = new GepDiscountConfigurationDetailsDto();
		gepDiscountConfigurationDetailsDto.setConfigId(locationMapping.getExchangeConfig().getConfigId());
		gepDiscountConfigurationDetailsDto.setConfigCode(locationMapping.getExchangeConfig().getDescription());
		gepDiscountConfigurationDetailsDto.setConfigType(locationMapping.getExchangeConfig().getConfigType());
		gepDiscountConfigurationDetailsDto.setIsOfferEnabled(locationMapping.getExchangeConfig().getIsOfferEnabled());
		gepDiscountConfigurationDetailsDto.setOfferDetails(offerJsonData);
		gepDiscountConfigurationDetailsDto.setConfigDetails(configJsonData);

		// exclude theme and item codes
		getExcludeItemCodeAndThemeCodeList(locationMapping.getExchangeConfig(), gepDiscountConfigurationDetailsDto);

		// purity product group mapping list
		getPurityProductGroupMapping(purityList, locationMapping.getExchangeConfig(),
				gepDiscountConfigurationDetailsDto);

		return new ListResponse<>(List.of(gepDiscountConfigurationDetailsDto));
	}

	private void getPurityProductGroupMapping(List<BigDecimal> purityList, ExchangeConfigMasterDao exchnageConfigDao,
			GepDiscountConfigurationDetailsDto gepDiscountConfigurationDetailsDto) {
		Map<BigDecimal, Map<String, BigDecimal>> purityProductDetails = new HashMap<>();
		Map<BigDecimal, Map<String, BigDecimal>> rivaahpurityProductDetails = new HashMap<>();
		if (!CollectionUtil.isEmpty(purityList)) {
			Map<String,BigDecimal> mappingForZeroPurity= new HashMap<>();
			Map<String,BigDecimal> mappingForZeroPurityForRivaah = new HashMap<>();
			purityList.forEach(gepPurity -> {
				// get product group and applicable pct based on gep purity
				List<ExchangeConfigProductMappingDao> productGroupMappingList = exchangeConfigProductMappingRepo
						.findByExchangeCongifIdAndPurity(exchnageConfigDao.getConfigId(), gepPurity);
				Map<String, BigDecimal> productGroupApplicablePctMap = new HashMap<>();
				Map<String, BigDecimal> productGroupApplicableAdditionalPctRivaahMap = new HashMap<>();
				if (!CollectionUtil.isEmpty(productGroupMappingList)) {
					productGroupMappingList.forEach(productGroupMappingDao -> {
						if (productGroupMappingDao.getPercentValue() != null) {
							productGroupApplicablePctMap.put(productGroupMappingDao.getProductGroupCode(),
									productGroupMappingDao.getPercentValue());
							mappingForZeroPurity.put(productGroupMappingDao.getProductGroupCode(),new BigDecimal(100));
						}
						if (productGroupMappingDao.getConfigDetails() != null) {
							JsonData jsonData = MapperUtil.mapObjToClass(productGroupMappingDao.getConfigDetails(),
									JsonData.class);
							RivaahProductGroupGepPurityDetails rivaahGepDetails = MapperUtil
									.mapObjToClass(jsonData.getData(), RivaahProductGroupGepPurityDetails.class);
							if (rivaahGepDetails.getRivaahAdditionalDiscount() != null) {
								productGroupApplicableAdditionalPctRivaahMap.put(
										productGroupMappingDao.getProductGroupCode(),
										rivaahGepDetails.getRivaahAdditionalDiscount());
								mappingForZeroPurityForRivaah.put(productGroupMappingDao.getProductGroupCode(),new BigDecimal(100));
							}
						}
					});
					if (!CollectionUtils.isEmpty(productGroupApplicablePctMap)) {
						purityProductDetails.put(gepPurity, productGroupApplicablePctMap);
					}
					if (!CollectionUtils.isEmpty(productGroupApplicableAdditionalPctRivaahMap)) {
						rivaahpurityProductDetails.put(gepPurity, productGroupApplicableAdditionalPctRivaahMap);
					}
				}
			});
			if(!CollectionUtils.isEmpty(mappingForZeroPurity)) {
				purityProductDetails.put(BigDecimal.ZERO, mappingForZeroPurity);
			}
			if(!CollectionUtils.isEmpty(mappingForZeroPurityForRivaah)) {
				rivaahpurityProductDetails.put(BigDecimal.ZERO, mappingForZeroPurityForRivaah);
			}
		}
		if (!CollectionUtils.isEmpty(purityProductDetails)) {
			gepDiscountConfigurationDetailsDto.setPurityProductDetails(
					new JsonData("PURITY_PRODUCT_GROUP_DETAILS", Map.of("purityProductDetails", purityProductDetails)));
		}
		if (!CollectionUtils.isEmpty(rivaahpurityProductDetails)) {
			gepDiscountConfigurationDetailsDto
					.setRivaahAdditionalpurityProductDetails(new JsonData("RIVAAH_PURITY_PRODUCT_GROUP_DETAILS",
							Map.of("rivaahpurityProductDetails", rivaahpurityProductDetails)));
		}
	}

	private void getExcludeItemCodeAndThemeCodeList(ExchangeConfigMasterDao exchnageConfigDao,
			GepDiscountConfigurationDetailsDto gepDiscountConfigurationDetailsDto) {
		List<ExchangeConfigExcludeMappingDao> exchangeExcludeList = exchangeConfigExcludeMappingRepository
				.findByExchangeConfigConfigIdAndIsExcludedTrue(exchnageConfigDao.getConfigId());

		List<String> itemCodesExcluded = new ArrayList<>();
		List<String> themeCodesExcluded = new ArrayList<>();
		if (!CollectionUtil.isEmpty(exchangeExcludeList)) {
			exchangeExcludeList.forEach(exchangeExcludeDao -> {
				if (!StringUtils.isEmpty(exchangeExcludeDao.getItemCode())) {
					itemCodesExcluded.add(exchangeExcludeDao.getItemCode());
				}
				if (!StringUtils.isEmpty(exchangeExcludeDao.getThemeCode())) {
					themeCodesExcluded.add(exchangeExcludeDao.getThemeCode());
				}
			});
		}
		// set item exclude list if not empty
		if (!CollectionUtil.isEmpty(itemCodesExcluded)) {
			gepDiscountConfigurationDetailsDto
					.setExcludeItemCodeList(new JsonData("ITEM_EXCLUDED", Map.of("itemList", itemCodesExcluded)));
		}
		// set theme exclude list if not empty
		if (!CollectionUtil.isEmpty(themeCodesExcluded)) {
			gepDiscountConfigurationDetailsDto
					.setExcludeThemeCodeList(new JsonData("THEME_EXCLUDED", Map.of("themeList", themeCodesExcluded)));
		}
	}

	@Override
	public ListResponse<FocSchemeBaseDto> getFocActiveSchemes(String locationCode) {

		Date businessDate = salesService.getBusinessDay(CommonUtil.getLocationCode()).getBusinessDate();

		List<FocSchemeMasterDao> focMasterDaoList = focSchemeMasterRepo.getActiveSchemes(locationCode,
				CalendarUtils.getStartOfDay(businessDate));

		List<FocSchemeBaseDto> responseList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(focMasterDaoList)) {
			focMasterDaoList.forEach(record -> {
				FocSchemeBaseDto focBaseDto = (FocSchemeBaseDto) MapperUtil.getObjectMapping(record,
						new FocSchemeBaseDto());
				responseList.add(focBaseDto);
			});
		}

		return new ListResponse<>(responseList);

	}

	@Override
	@Transactional
	public ListResponse<FocSchemeResponseDto> getFocSchemesAndItems(FocSchemeRequestDto focSchemeRequestDto,
			String cashMemoId, List<String> abItemIdList) {

		Map<String, PurchaseItemRequestDto> requestMap = new HashMap<>();

		if (!CollectionUtils.isEmpty(focSchemeRequestDto.getPurchaseItems())) {
			focSchemeRequestDto.getPurchaseItems()
					.forEach(itemDetail -> requestMap.put(itemDetail.getProductGroupCode(), itemDetail));
		}

		List<FocSchemeProductMappingDao> focProductDaoList = new ArrayList<>();
		if (cashMemoId != null && abItemIdList != null)
			focProductDaoList = matchCmAndAbItem(cashMemoId, abItemIdList, focSchemeRequestDto, requestMap);
		// getting products mapped to Active Scheme for a given location and current
		// businessdate
		if (focProductDaoList == null || focProductDaoList.isEmpty())
			focProductDaoList = getProductGroupList(focSchemeRequestDto, requestMap);

		Map<String, Set<String>> schemeDetailsMap = new HashMap<>(); // key is schemeDetailId
		Map<String, Set<String>> schemeMap = new HashMap<>(); // key is schemeId

		if (!CollectionUtils.isEmpty(focProductDaoList)) {
			focProductDaoList.forEach(focProductDao -> {
				// Standard Scheme-SchemeDetailId
				if (focProductDao.getFocSchemeDetailsDao() != null) {

					if (schemeDetailsMap.get(focProductDao.getFocSchemeDetailsDao().getId()) != null) {

						schemeDetailsMap.get(focProductDao.getFocSchemeDetailsDao().getId())
								.add(focProductDao.getProductGroupCode());
					} else {
						Set<String> productList = new HashSet<>();
						productList.add(focProductDao.getProductGroupCode());
						schemeDetailsMap.put(focProductDao.getFocSchemeDetailsDao().getId(), productList);
					}
				}

				else {
					// Slab Scheme-SchemeId
					if (schemeMap.get(focProductDao.getFocSchemeMasterDao().getId()) != null) {

						schemeMap.get(focProductDao.getFocSchemeMasterDao().getId())
								.add(focProductDao.getProductGroupCode());
					} else {
						Set<String> productList = new HashSet<>();
						productList.add(focProductDao.getProductGroupCode());
						schemeMap.put(focProductDao.getFocSchemeMasterDao().getId(), productList);
					}
				}

			});
		}

		List<FocSchemeResponseDto> focSchemeResponseList = new ArrayList<>();

		// for stdSchemeDetails
		if (!schemeDetailsMap.keySet().isEmpty()) {
			checkStandardSchemeEligibility(schemeDetailsMap, requestMap, focSchemeResponseList, focSchemeRequestDto,
					false);
		}

		// for slabSchemeDetails
		if (!schemeMap.keySet().isEmpty()) {
			checkSlabSchemeEligibility(schemeMap, requestMap, focSchemeResponseList, focSchemeRequestDto, false);
		}

		// removing from the list if items are not mapped to a scheme
		focSchemeResponseList.removeIf(scheme -> scheme.getFocItems().isEmpty());

		return new ListResponse<>(focSchemeResponseList);
	}

	private List<PurchaseItemDto> getPurchaseItemDtoList(FocSchemeRequestDto focSchemeRequestDto,
			List<String> productResponseList) {

		List<PurchaseItemDto> purchaseItemList = new ArrayList<>();
		Map<String, PurchaseItemDto> productMap = new HashMap<>();

		Map<String, List<FocItemDetailsDto>> focItemMap = focSchemeRequestDto.getPurchaseItems().stream()
				.collect(Collectors.toMap(PurchaseItemRequestDto::getProductGroupCode,
						PurchaseItemRequestDto::getFocItemDetails));

		for (PurchaseItemRequestDto itemRequestDto : focSchemeRequestDto.getPurchaseItems()) {

			PurchaseItemDto purchaseItemDto = new PurchaseItemDto();
			purchaseItemDto.setProductGroupCode(itemRequestDto.getProductGroupCode());
			purchaseItemDto.setFocItemDetails(focItemMap.get(itemRequestDto.getProductGroupCode()));

			productMap.put(itemRequestDto.getProductGroupCode(), purchaseItemDto);
		}

		for (Map.Entry<String, PurchaseItemDto> entry : productMap.entrySet()) {
			productResponseList.forEach(productResponse -> {
				String productGroupCode = entry.getKey();
				if (productGroupCode.equalsIgnoreCase(productResponse)) {
					purchaseItemList.add(productMap.get(productGroupCode));
				}
			});
		}
		return purchaseItemList;
	}

	private void checkSlabSchemeEligibility(Map<String, Set<String>> schemeMap,
			Map<String, PurchaseItemRequestDto> requestMap, List<FocSchemeResponseDto> focSchemeResponseList,
			FocSchemeRequestDto focSchemeRequestDto, Boolean isAdvanceBooking) {

		List<FocSchemeDetailsDao> schemeDetailsList = focSchemeDetailsRepo
				.findBySchemeIdInForSlabBased(OfferTypeEnum.SLAB.toString(), schemeMap.keySet(), requestMap.keySet());

		if (!CollectionUtils.isEmpty(schemeDetailsList)) {
			Map<String, FocSchemeDetailsDao> schemeDetailMap = new HashMap<>();

			schemeDetailsList.forEach(schemeDetail -> schemeDetailMap.put(schemeDetail.getId(), schemeDetail));

			List<FocSchemeDetailsDao> activeSchemeDetailsList = focSchemeDetailsRepo
					.findByIdIn(schemeDetailMap.keySet());

			List<FocSchemeProductMappingDao> slabProductGroups = focSchemeProductMappingRepo
					.findBySlabCategory(schemeMap.keySet());

			Map<String, String> slabCategoryMap = new HashMap<>();

			if (!CollectionUtils.isEmpty(slabProductGroups)) {
				slabProductGroups.forEach(slabProductDao -> {
					if (slabProductDao.getId() != null) {
						slabCategoryMap.put(slabProductDao.getProductGroupCode(), slabProductDao.getCategory());
					}
				});
			}

			for (FocSchemeDetailsDao activeStdFocDetail : activeSchemeDetailsList) {

				List<FocItemDto> focItemDtoList = new ArrayList<>();
				List<FocItemDto> validatedList = null;
				Set<String> productGroupList = schemeMap.get(activeStdFocDetail.getFocSchemeMasterDao().getId());
				List<String> productResponseList = new ArrayList<>();

				if (BooleanUtils.isTrue(activeStdFocDetail.getIsSingle())) {
					for (String productGroupCode : productGroupList) {
					for (Map.Entry<String, String> entry : slabCategoryMap.entrySet()) {
						if ((entry.getKey().toString().equals(productGroupCode))
								&& entry.getValue().equals(activeStdFocDetail.getCategory().toString())) {
						
							BigDecimal purchaseValue = getPurchaseValue(activeStdFocDetail,
									requestMap.get(productGroupCode));
					
						validatedList = computeSlabSchemeEligibility(purchaseValue, activeStdFocDetail);
						if (!CollectionUtils.isEmpty(validatedList)) {
							if (!focItemDtoList.isEmpty()) {
								BigDecimal wt = (focItemDtoList.get(0).getWeight()
										.add(validatedList.get(0).getWeight()));
								Set<FocItemDto> dtos = new HashSet<>();
								for (FocItemDto item : focItemDtoList) {
									item.setWeight(wt);
									dtos.add(item);
								}
								for (FocItemDto item : validatedList) {
									item.setWeight(wt);
									dtos.add(item);
								}
								dtos.forEach(dto -> focItemDtoList.add(dto));
							} else
								focItemDtoList.addAll(validatedList);
							productResponseList.add(productGroupCode);
							// break;
						}
						}
					}
					}

				} else {
					BigDecimal totalPurchaseValue = BigDecimal.ZERO;
					for (String productGroupCode : productGroupList) {

						for (Map.Entry<String, String> entry : slabCategoryMap.entrySet()) {
							if ((entry.getKey().toString().equals(productGroupCode))
									&& entry.getValue().equals(activeStdFocDetail.getCategory().toString())) {
								BigDecimal purchaseValue = getPurchaseValue(activeStdFocDetail,
										requestMap.get(productGroupCode));
								totalPurchaseValue = totalPurchaseValue.add(purchaseValue);
							}

						}
//						validatedList = computeSlabSchemeEligibility(totalPurchaseValue, activeStdFocDetail);
//						if (!CollectionUtils.isEmpty(validatedList)) {
//							productResponseList.add(productGroupCode);
//							if (!focItemDtoList.isEmpty())
//								for (FocItemDto item : focItemDtoList) {
//									item.getWeight().add(validatedList.get(0).getWeight());
//								}
//							else
//								focItemDtoList.addAll(validatedList);
//							validatedList = new ArrayList<>();
//							productResponseList.add(productGroupCode);
						// break;
					}
					validatedList = computeSlabSchemeEligibility(totalPurchaseValue, activeStdFocDetail);
					if (!CollectionUtils.isEmpty(validatedList)) {
						productResponseList.addAll(productGroupList);
						focItemDtoList.addAll(validatedList);
					}

				}
				if (!CollectionUtils.isEmpty(focItemDtoList)) {
					setFinalResponse(activeStdFocDetail, focSchemeResponseList, focSchemeRequestDto, focItemDtoList,
							productResponseList, isAdvanceBooking);
				}

			}
		}
	}

	private List<FocItemDto> computeSlabSchemeEligibility(BigDecimal purchaseValue,
			FocSchemeDetailsDao activeSchemeFocDetail) {
		List<FocItemDto> focItemDtoList = new ArrayList<>();
		BigDecimal fromValue = BigDecimal.ZERO;
		BigDecimal toValue = BigDecimal.ZERO;

		if (activeSchemeFocDetail.getFromSaleValue() != null) {
			fromValue = activeSchemeFocDetail.getFromSaleValue();
		}

		if (activeSchemeFocDetail.getToSaleValue() != null) {
			toValue = activeSchemeFocDetail.getToSaleValue();
		}

		if (validatePurchaseValue(purchaseValue, fromValue, toValue)) {
			// in slab we have to check for Multiplying value =0 like isMultiple in std
			if (activeSchemeFocDetail.getStdSaleValue() == null
					|| activeSchemeFocDetail.getStdSaleValue().compareTo(BigDecimal.ZERO) == 0) {

				if (activeSchemeFocDetail.getItemType().equalsIgnoreCase(ItemTypeEnum.GOLD_COIN.toString())) {

					getItemCodeListForGoldCoins(activeSchemeFocDetail, null, focItemDtoList);
				} else {

					getItemCodeListForOthers(activeSchemeFocDetail, null, focItemDtoList);
				}

			} else {
				BigDecimal multiplyFactor = purchaseValue.divide(activeSchemeFocDetail.getStdSaleValue(), 0,
						RoundingMode.DOWN);

				if (activeSchemeFocDetail.getItemType().equalsIgnoreCase(ItemTypeEnum.GOLD_COIN.toString())) {

					getItemCodeListForGoldCoins(activeSchemeFocDetail, multiplyFactor, focItemDtoList);
				} else {
					getItemCodeListForOthers(activeSchemeFocDetail, multiplyFactor, focItemDtoList);
				}
			}
		}
		return focItemDtoList;
	}

	private Boolean validatePurchaseValue(BigDecimal purchaseValue, BigDecimal fromValue, BigDecimal toValue) {

		Boolean valid = false;
		if ((purchaseValue.compareTo(fromValue) > 0 && purchaseValue.compareTo(toValue) < 0)
				|| purchaseValue.compareTo(fromValue) == 0 || purchaseValue.compareTo(toValue) == 0) {
			valid = true;
		}
		return valid;
	}

	private List<FocSchemeProductMappingDao> getProductGroupList(FocSchemeRequestDto focSchemeRequestDto,
			Map<String, PurchaseItemRequestDto> requestMap) {

		// getting Active Schemes for given location and current businessdate
		List<FocSchemeMasterDao> focMasterDaoList = focSchemeMasterRepo.getActiveSchemes(CommonUtil.getLocationCode(),
				CalendarUtils.getStartOfDay(focSchemeRequestDto.getBusinessDate()));

		List<String> schemeIdList = new ArrayList<>();

		if (!CollectionUtils.isEmpty(focMasterDaoList)) {
			focMasterDaoList.forEach(focScheme -> schemeIdList.add(focScheme.getId()));
		}

		else {
			return new ArrayList<>();
		}
		// getting products mapped for the Active Schemes

		return focSchemeProductMappingRepo.getMappedProductWrtCategoryAndItemType(schemeIdList, requestMap.keySet());
	}

	/**
	 * @param orderToCmDto
	 * @param focSchemeRequestDto
	 * @param requestMap
	 * @return
	 * @return
	 */
	private List<FocSchemeProductMappingDao> matchCmAndAbItem(String cashMemoId, List<String> abItemIdList,
			FocSchemeRequestDto focSchemeRequestDto, Map<String, PurchaseItemRequestDto> requestMap) {

		List<CashMemoDetailsDao> cashMemoDetailsDaoList = cashMemoDetailsRepoExt.findByCashMemoId(cashMemoId);
		if (cashMemoDetailsDaoList == null)
			throw new ServiceException("Record not found.", "ERR-SALE-070", "No Details Found For CM Id");
		List<OrderDetailsDao> orderDaoList = orderRepo.findByOrderId(abItemIdList);
		if (orderDaoList == null)
			throw new ServiceException("Record not found.", "ERR-SALE-070", "No Details Found For Order Id");

		Map<String, FocSchemeMasterDao> focSchemeMasterDaoMap = new HashMap<String, FocSchemeMasterDao>();
		List<String> schemeIdList = new ArrayList<>();
		requestMap.forEach((key, value) -> {

			FocSchemeMasterDao focSchemeMasterDao = getFocSchemeMappedtoAb(key, orderDaoList.get(0).getOrder().getId());
			if (focSchemeMasterDao != null)
				focSchemeMasterDaoMap.put(key, focSchemeMasterDao);
		});
		List<String> cmItemList = new ArrayList<>();
		List<String> abItemList = new ArrayList<>();
		Set<String> abProductGroupList = new HashSet<>();
		cashMemoDetailsDaoList.forEach(cashMemoDao -> cmItemList.add(cashMemoDao.getItemCode()));
		orderDaoList.forEach(orderDao -> {
			abItemList.add(orderDao.getItemCode());
			abProductGroupList.add(orderDao.getProductGroupCode());
		});
		
		focSchemeMasterDaoMap.forEach((key,value)->{
			schemeIdList.add(value.getId());
		});	
		
		if (abItemList.size() == cmItemList.size() && !focSchemeMasterDaoMap.isEmpty()) {

			if (!schemeIdList.isEmpty() && !orderDaoList.get(0).getOrder().getIsFrozenRate()
					&& (!abItemList.containsAll(cmItemList) || !cmItemList.containsAll(abItemList)))
				return focSchemeProductMappingRepo.getMappedProductWrtCategoryAndItemType(schemeIdList,
						requestMap.keySet());
			focSchemeMasterDaoMap.forEach((key, value) -> {

				FocSchemeMasterDao focSchemeMaster = new FocSchemeMasterDao();
				if (value != null) {
					JsonData orderDetailsJsonData = MapperUtil.getObjectMapperInstance()
							.convertValue(MapperUtil.getJsonFromString(value.getOrderConfig()), JsonData.class);
					OrderConfigDetails orderConfigDetails = MapperUtil.mapObjToClass(orderDetailsJsonData.getData(),
							OrderConfigDetails.class);
					if (orderConfigDetails.getOfferPeriodForAB() != null)
						focSchemeMaster = focSchemeMasterRepo.getActiveAbSchemes(CommonUtil.getLocationCode(),
								orderConfigDetails.getOfferPeriodForAB(),
								CalendarUtils.getStartOfDay(focSchemeRequestDto.getBusinessDate()), value.getId());
					else
						focSchemeMaster = focSchemeMasterRepo.getActiveAbSchemes(CommonUtil.getLocationCode(), 0,
								CalendarUtils.getStartOfDay(focSchemeRequestDto.getBusinessDate()), value.getId());
					if (focSchemeMaster != null)
						schemeIdList.add(focSchemeMaster.getId());
				}
			});

			List<FocSchemeMasterDao> focDaos = focSchemeMasterRepo.getActiveSchemes(CommonUtil.getLocationCode(),
					CalendarUtils.getStartOfDay(focSchemeRequestDto.getBusinessDate()));
			List<String> focSchemeIds = new ArrayList<>();
			focDaos.forEach(dao -> focSchemeIds.add(dao.getId()));

			if (!CollectionUtils.isEmpty(focSchemeIds)) {
				List<FocSchemeProductMappingDao> abSchemes = focSchemeProductMappingRepo
						.getMappedProductWrtCategoryAndItemType(focSchemeIds, abProductGroupList);
				List<FocSchemeProductMappingDao> cmSchemes = focSchemeProductMappingRepo
						.getMappedProductWrtCategoryAndItemType(focSchemeIds, requestMap.keySet());

				if (!abSchemes.containsAll(cmSchemes))
					cmSchemes.forEach(scheme -> {
						if (!abSchemes.contains(scheme))
							schemeIdList.add(scheme.getFocSchemeMasterDao().getId());
					});
			}
		}

		if (schemeIdList.isEmpty())
			return getProductGroup(focSchemeRequestDto, requestMap);

		// getting products mapped for the Active Schemes

		return focSchemeProductMappingRepo.getMappedProductWrtCategoryAndItemType(schemeIdList, requestMap.keySet());

	}

	/**
	 * @param key
	 * @param cashMemoDetailsDaoList
	 * @return
	 * @return
	 */
	private FocSchemeMasterDao getFocSchemeMappedtoAb(String key, String cashMemoId) {

		List<FocSchemesDao> focSchemeDao = focSchemesRepository.findBySalesTxnId(cashMemoId);

		for (FocSchemesDao schemesDao : focSchemeDao) {
			JsonData productGroupDetails = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(schemesDao.getProductGroupDetails()), JsonData.class);

			List<FocProductDetailsJsonDto> focProcuctDetailsForAbList = MapperUtil.jsonStrToList(
					MapperUtil.getJsonString(productGroupDetails.getData()), FocProductDetailsJsonDto.class);

			for (FocProductDetailsJsonDto productDetails : focProcuctDetailsForAbList) {

				if (productDetails.getProductGroupCode().equals(key)) {
					FocSchemeMasterDao focSchemeMasterDao = focSchemeMasterRepo.findById(productDetails.getSchemeId())
							.orElseThrow(() -> new ServiceException("Record not found.", "ERR-SALE-070",
									"No Details Found For FOC Scheme"));
					return focSchemeMasterDao;
				}
			}
		}
		return null;
	}

	private void checkStandardSchemeEligibility(Map<String, Set<String>> schemeDetailsMap,
			Map<String, PurchaseItemRequestDto> requestMap, List<FocSchemeResponseDto> focSchemeResponseList,
			FocSchemeRequestDto focSchemeRequestDto, Boolean isAdvanceBooking) {

		List<FocSchemeDetailsDao> activeFocDetailsList = focSchemeDetailsRepo.findByIdIn(schemeDetailsMap.keySet());

		if (!CollectionUtils.isEmpty(activeFocDetailsList)) {

			activeFocDetailsList.forEach(activeStdFocDetail -> {

				List<FocItemDto> focItemDtoList = new ArrayList<>();
				List<FocItemDto> focItemDtoListFinal = new ArrayList<>();
				Map<String, FocItemDto> itemCodes = new HashMap<>();
				BigDecimal weight = BigDecimal.ZERO;
				Short qty = (short) 0;

				Set<String> productGroupList = schemeDetailsMap.get(activeStdFocDetail.getId());
				List<String> productResponseList = new ArrayList<>();
				// single product mapping

				if (activeStdFocDetail.getIsSingle()) {
					for (String productGroupCode : productGroupList) {
						BigDecimal purchaseValue = getPurchaseValue(activeStdFocDetail,
								requestMap.get(productGroupCode)); // requestMap.get(productGroupCode).getFocItemDetails().size();
						// compute std Scheme eligibility for the calculated purchaseValue
						focItemDtoList = computeStdSchemeEligibility(purchaseValue, activeStdFocDetail);
						if (!CollectionUtil.isEmpty(focItemDtoList)) {

							focItemDtoList.forEach(fi -> itemCodes.put(fi.getItemCode(), fi));

							// check if item came in output, if available before, if yes, add quantity, else
							// new entry
							if (focItemDtoList.get(0).getWeight() != null)
								weight = weight.add(focItemDtoList.get(0).getWeight());
							if (focItemDtoList.get(0).getQuantity() != null)
								qty = (short) (qty + focItemDtoList.get(0).getQuantity());
							productResponseList.add(productGroupCode);
						}
					}

					for (Map.Entry<String, FocItemDto> entry : itemCodes.entrySet()) {
						if (entry.getValue().getQuantity() != null)
							entry.getValue().setQuantity(qty);
						if (entry.getValue().getWeight() != null)
							entry.getValue().setWeight(weight);
						focItemDtoListFinal.add(entry.getValue());
					}
					focItemDtoList = focItemDtoListFinal;

				}

				else {
					// cumulative3a
					BigDecimal totalPurchaseValue = BigDecimal.ZERO;

					for (String productGroupCode : productGroupList) {
						productResponseList.add(productGroupCode);
						BigDecimal purchaseValue = getPurchaseValue(activeStdFocDetail,
								requestMap.get(productGroupCode));
						totalPurchaseValue = totalPurchaseValue.add(purchaseValue);
					}
					focItemDtoList.addAll(computeStdSchemeEligibility(totalPurchaseValue, activeStdFocDetail));
				}

				setFinalResponse(activeStdFocDetail, focSchemeResponseList, focSchemeRequestDto, focItemDtoList,
						productResponseList, isAdvanceBooking);

			});

		}

	}

	/**
	 * @param activeStdFocDetail
	 * @param focItemDtoList
	 * @param productResponseList
	 */
	private void setFinalResponse(FocSchemeDetailsDao activeStdFocDetail,
			List<FocSchemeResponseDto> focSchemeResponseList, FocSchemeRequestDto focSchemeRequestDto,
			List<FocItemDto> focItemDtoList, List<String> productResponseList, Boolean isAdvanceBooking) {

		FocSchemeResponseDto focSchemeResponse = new FocSchemeResponseDto();

		JsonData orderDetailsJsonData = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(activeStdFocDetail.getFocSchemeMasterDao().getOrderConfig()),
				JsonData.class);
		OrderConfigDetails orderConfigDetails = MapperUtil.mapObjToClass(orderDetailsJsonData.getData(),
				OrderConfigDetails.class);

		if (!isAdvanceBooking) {
			setFocSchemeResponse(activeStdFocDetail, focSchemeResponseList, focSchemeRequestDto, focItemDtoList,
					productResponseList, focSchemeResponse);
		} else if (isAdvanceBooking && ((BooleanUtils.isTrue(focSchemeRequestDto.getIsFrozen())
				&& BooleanUtils.isTrue(orderConfigDetails.getIsGoldRateFrozenForAB()))
				|| (BooleanUtils.isNotTrue(orderConfigDetails.getIsGoldRateFrozenForAB())))) {
			setFocSchemeResponse(activeStdFocDetail, focSchemeResponseList, focSchemeRequestDto, focItemDtoList,
					productResponseList, focSchemeResponse);
		} else if (isAdvanceBooking && !(BooleanUtils.isTrue(focSchemeRequestDto.getIsFrozen())
				&& BooleanUtils.isTrue(orderConfigDetails.getIsGoldRateFrozenForAB()))) {
			throw new ServiceException(ConfigConstants.AB_NOT_APPLICABLE_FOR_NON_FROZEN_ORDER,
					ConfigConstants.ERR_CONFIG_187);
		}

	}

	private void setFocSchemeResponse(FocSchemeDetailsDao activeStdFocDetail,
			List<FocSchemeResponseDto> focSchemeResponseList, FocSchemeRequestDto focSchemeRequestDto,
			List<FocItemDto> focItemDtoList, List<String> productResponseList, FocSchemeResponseDto focSchemeResponse) {
		focSchemeResponse.setSchemeDetailId(activeStdFocDetail.getId());
		focSchemeResponse.setSchemeId(activeStdFocDetail.getFocSchemeMasterDao().getId());
		focSchemeResponse.setSchemeName(activeStdFocDetail.getFocSchemeMasterDao().getName());
		focSchemeResponse.setSchemeCategory(activeStdFocDetail.getCategory());
		focSchemeResponse.setPurchaseItems(getPurchaseItemDtoList(focSchemeRequestDto, productResponseList));
		focSchemeResponse.setFocItems(focItemDtoList);

		focSchemeResponseList.add(focSchemeResponse);
	}

	/**
	 * @param purchaseValue
	 * @param activeStdFocDetail
	 */
	private List<FocItemDto> computeStdSchemeEligibility(BigDecimal purchaseValue,
			FocSchemeDetailsDao activeStdFocDetail) {

		List<FocItemDto> focItemDtoList = new ArrayList<>();

		if (purchaseValue.compareTo(activeStdFocDetail.getStdSaleValue()) > 0
				|| purchaseValue.compareTo(activeStdFocDetail.getStdSaleValue()) == 0) {
			// when isMultiple is configured - for every integral times increase in the
			// standard value
			if (activeStdFocDetail.getIsMultiple()) {

				BigDecimal multiplyFactor = purchaseValue.divide(activeStdFocDetail.getStdSaleValue(), 0,
						RoundingMode.DOWN);

				if (activeStdFocDetail.getItemType().equalsIgnoreCase(ItemTypeEnum.GOLD_COIN.toString())) {

					// getting focitems(gold coins) mapped to a scheme
					getItemCodeListForGoldCoins(activeStdFocDetail, multiplyFactor, focItemDtoList);

				} else {
					// getting diamonds or otherthan goldcoins mapped to a scheme
					getItemCodeListForOthers(activeStdFocDetail, multiplyFactor, focItemDtoList);
				}

			} else {
				// isMultiple is false
				if (activeStdFocDetail.getItemType().equalsIgnoreCase(ItemTypeEnum.GOLD_COIN.toString())) {

					// getting focitems(gold coins) mapped to a scheme
					getItemCodeListForGoldCoins(activeStdFocDetail, null, focItemDtoList);

				} else {
					// getting diamonds or otherthan goldcoins mapped to a scheme
					getItemCodeListForOthers(activeStdFocDetail, null, focItemDtoList);
				}
			}

		}

		return focItemDtoList;
	}

	/**
	 * @param activeStdFocDetail
	 * @param focItemDtoList
	 */
	private void getItemCodeListForOthers(FocSchemeDetailsDao activeStdFocDetail, BigDecimal multiplyFactor,
			List<FocItemDto> focItemDtoList) {

		FocItemDto focItem = new FocItemDto();
		if (activeStdFocDetail.getQuantity() != null) {

			focItem.setItemCode(activeStdFocDetail.getItemCode());

			// setting the number of diamonds or other items for std scheme when isMultiple
			// is selected
			if (multiplyFactor != null
					&& activeStdFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.STANDARD.toString())) {
				focItem.setQuantity((short) (multiplyFactor.intValue() * activeStdFocDetail.getQuantity()));
			}
			// setting the number of diamonds or other items for slab scheme when isMultiple
			// is selected
			else if (multiplyFactor != null
					&& activeStdFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.SLAB.toString())) {
				focItem.setQuantity((short) (multiplyFactor.intValue() * activeStdFocDetail.getQuantity() + 1));
			} else {
				focItem.setQuantity(activeStdFocDetail.getQuantity().shortValue());
			}
		}

		focItemDtoList.add(focItem);
	}

	/**
	 * @param activeFocDetail
	 * @param multiplyFactor
	 * @param focItemDtoList
	 */
	private void getItemCodeListForGoldCoins(FocSchemeDetailsDao activeFocDetail, BigDecimal multiplyFactor,
			List<FocItemDto> focItemDtoList) {

		BigDecimal weight = null;

		// calculating weight for standard based schemes
		if (multiplyFactor != null
				&& activeFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.STANDARD.toString())) {
			weight = multiplyFactor.multiply(activeFocDetail.getWeight());

			// calculating weight for slab based schemes
		} else if (multiplyFactor != null
				&& activeFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.SLAB.toString())) {
			weight = multiplyFactor.multiply(activeFocDetail.getWeight()).add(new BigDecimal(1));
		} else {
			weight = activeFocDetail.getWeight();
		}
		// getting itemCodes mapped to a scheme
		List<FocItemLiteDto> focItemList = focSchemeItemMappingRepo.findItemCodesBySchemeId(
				activeFocDetail.getFocSchemeMasterDao().getId(), activeFocDetail.getKarat(), weight);

		if (!CollectionUtils.isEmpty(focItemList)) {

			focItemList.forEach(focItemCode -> {
				FocItemDto focItem = new FocItemDto();
				focItem.setItemCode(focItemCode.getItemCode());
//				focItem.setQuantity(focItemCode.getQuantity().shortValue());
				if (multiplyFactor != null
						&& activeFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.STANDARD.toString())) {
					focItem.setWeight(multiplyFactor.multiply(activeFocDetail.getWeight()));
				} else if (multiplyFactor != null && multiplyFactor != BigDecimal.ZERO
						&& activeFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.SLAB.toString())) {
					focItem.setWeight(multiplyFactor.multiply(activeFocDetail.getWeight()));
				} else {
					focItem.setWeight(activeFocDetail.getWeight());
				}

				focItemDtoList.add(focItem);
			});

		}

	}

	/**
	 * @param activeStdFocDetail
	 * @param purchaseItemRequestDto
	 * @return
	 */
	private BigDecimal getPurchaseValue(FocSchemeDetailsDao activeStdFocDetail,
			PurchaseItemRequestDto purchaseItemRequestDto) {

		BigDecimal purchaseValue;
		String focEligibility = activeStdFocDetail.getFocEligibility();
		// calculating purchase value for weight based scheme
		if (activeStdFocDetail.getCategory().equalsIgnoreCase(CategoryEnum.WEIGHT_BASED.toString())) {

			if (FocEligibilityEnum.NET_WEIGHT.toString().equalsIgnoreCase(focEligibility)) {
				purchaseValue = purchaseItemRequestDto.getTotalMetalWeight();
			} else {
				purchaseValue = purchaseItemRequestDto.getTotalMetalWeight().add(purchaseItemRequestDto
						.getTotalMaterialWeight().add(purchaseItemRequestDto.getTotalStoneWeight()));
			}
		}
		// calculating purchase value for value based scheme based on focEligibility
		// configured in scheme
		else {

			BigDecimal totalValue = purchaseItemRequestDto.getTotalValue();
			BigDecimal totalDiscount = purchaseItemRequestDto.getTotalDiscount();
			BigDecimal totalTax = purchaseItemRequestDto.getTotalTax();

			if (FocEligibilityEnum.PRE_DISCOUNT_TAX.toString().equalsIgnoreCase(focEligibility)) {
				purchaseValue = totalValue.add(totalTax);
			} else if (FocEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.toString().equalsIgnoreCase(focEligibility)) {
				purchaseValue = totalValue;
			} else if (FocEligibilityEnum.POST_DISCOUNT_TAX.toString().equalsIgnoreCase(focEligibility)) {
				purchaseValue = totalValue.subtract(totalDiscount).add(totalTax);
			} else {
				purchaseValue = totalValue.subtract(totalDiscount);
			}
		}

		return purchaseValue;
	}

	@Override
	public ListResponse<ManualFocSchemeResponseDto> getManualFocSchemeDetails(String mobileNumber) {

		String locationCode = CommonUtil.getLocationCode();

		List<ManualFocSchemeResponseDto> focListDto = new ArrayList<>();
		ManualFocSchemeResponseDto focResponseDto = new ManualFocSchemeResponseDto();

		List<FocItemDto> focItemList = new ArrayList<>();

		// foc blocked for Location/store
		BusinessDayDto businessDayDto = salesService.getBusinessDay(locationCode);

		// foc blocked for Location
		FocSchemeLocationMappingDao checkFocBlockedForLoc = focSchemeLocationMappingRepo
				.focBlockedForLocationExist(locationCode, businessDayDto.getBusinessDate());
		if (checkFocBlockedForLoc != null) {
			List<ItemDao> itemDaoList = itemDaoRepository.getFocItems();
			if (!CollectionUtils.isEmpty(itemDaoList)) {
				itemDaoList.forEach(item -> {
					FocItemDto focItemDto = new FocItemDto();
					focItemDto.setItemCode(item.getItemCode());
					focItemList.add(focItemDto);

				});
				focResponseDto.setFocItems(focItemList);
				focListDto.add(focResponseDto);
				focResponseDto.setSchemeId(checkFocBlockedForLoc.getFocSchemeMasterDao().getId());
				focResponseDto.setSchemeName(checkFocBlockedForLoc.getFocSchemeMasterDao().getName());
				focResponseDto.setManualFOCStartDate(checkFocBlockedForLoc.getStartDate());
				focResponseDto.setManualFOCEndDate(checkFocBlockedForLoc.getEndDate());
				focResponseDto.setConfigDetails(checkFocBlockedForLoc.getConfigDetails());
				return new ListResponse<>(focListDto);
			}
		}

		// foc blocked for Customer
		List<FocSchemeLocationMappingDao> manualFocforCustomer = focSchemeLocationMappingRepo
				.getFocBlockedForCustomer(locationCode, mobileNumber, businessDayDto.getBusinessDate());

		if (manualFocforCustomer != null) {
			manualFocforCustomer.forEach(record -> {
				FocItemDto focItemDto = new FocItemDto();
				JsonData configDetailsJson = MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(record.getConfigDetails()), JsonData.class);
				LocationConfigDetails itemDetails = MapperUtil.getObjectMapperInstance()
						.convertValue(configDetailsJson.getData(), LocationConfigDetails.class);
//				LocationConfigDetails itemDetails = (LocationConfigDetails) MapperUtil.getObjectMapping(
//						MapperUtil.getJsonFromString(record.getConfigDetails()), new LocationConfigDetails());
				focItemDto.setItemCode(itemDetails.getFocItemCode());
				focItemDto.setQuantity(Short.valueOf(itemDetails.getQuantity()));
				focItemList.add(focItemDto);

				focResponseDto.setFocItems(focItemList);
				focResponseDto.setSchemeId(record.getFocSchemeMasterDao().getId());
				focResponseDto.setSchemeName(record.getFocSchemeMasterDao().getName());
				focResponseDto.setManualFOCStartDate(record.getStartDate());
				focResponseDto.setManualFOCEndDate(record.getEndDate());
				focResponseDto.setConfigDetails(record.getConfigDetails());
				focListDto.add(focResponseDto);
			});

			return new ListResponse<>(focListDto);
		}
		return new ListResponse<>();
	}

	@Override
	@Transactional
	public TepItemResponseDto getTepItem(String itemCode, String customerMobileNo, String tepType,
			Boolean isDummyCode) {
		ItemDao item = itemDaoRepository.findByItemCodeAndIsActive(itemCode, Boolean.TRUE);
		if (item == null) {
			throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
					ITEM_CODE + itemCode);
		}
		TepProductGroupConfigDetails tepConfig = validateTepItemConfig(itemCode, item);
		checkAllowedTepType(itemCode, tepType, tepConfig);
//		ExchangeConfigMasterDao configMaster = checkForTepException(itemCode, customerMobileNo);
		TepItemResponseDto tepItem = (TepItemResponseDto) MapperUtil.getDtoMapping(tepConfig, TepItemResponseDto.class);
//		if (configMaster != null) {
//			TepExceptionDetailsResponseDto tepException = getTepExceptionOfferDetails(customerMobileNo, configMaster);
//			tepItem.setTepOfferDetails(tepException);
//		}
		ExchangeConfigMasterDao configMaster = exchangeConfigMasterRepo.findByItemCodeAndConfigType(itemCode,
				ConfigTypeEnum.TEP_GENERAL_CODES.toString());
		validateDummyItemCode(tepType, itemCode, configMaster, isDummyCode);
		if (Boolean.TRUE.equals(isDummyCode) && (TepTypeEnum.INTER_BRAND_TEP.toString().equals(tepType)
				|| TepTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(tepType))) {
			TepGeneralCodeConfigDto tepGeneralCodes = getTepGeneralCodeConfigData(itemCode, configMaster, isDummyCode);
			tepItem.setTepGeneralCodeConfig(tepGeneralCodes);
			TepValidationConfigDetails tepValidationConfig = getTepCancelDetails(TepTypeEnum.CANCEL_TEP.toString());
			tepItem.setTepValidationConfig(tepValidationConfig);
			// Interbrand tep not allowed for cm non mandatory for product group other than
			// 71 and 73
			if (Boolean.FALSE.equals(tepGeneralCodes.getIsCMMandatory())
					&& !("71".equals(item.getProductGroup().getProductGroupCode())
							|| "73".equals(item.getProductGroup().getProductGroupCode())))
				throw new ServiceException(ConfigConstants.INTER_BRAND_NOT_ALLOWED, ConfigConstants.ERR_CONFIG_173,
						Map.of("dummyCode", item.getItemCode()));
		}
		if (TepTypeEnum.CUT_PIECE_TEP.toString().equals(tepType)) {
			TepCutPieceConfigDto tepCutPiece = getCutPieceTepConfigDetails(
					item.getProductCategory().getProductCategoryCode(), item.getKarat(),
					item.getProductGroup().getItemType().getItemTypeCode());
			tepItem.setTepCutPieceConfig(tepCutPiece);
		}
		
		tepItem.setMaxFlatTepException(BigDecimal.ZERO);
		configMaster = exchangeConfigMasterRepo.findByConfigType(ConfigTypeEnum.TEP_GLOBAL.name());
		if(configMaster!=null && configMaster.getConfigDetails()!=null) {
			JsonData jsonData = MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(configMaster.getConfigDetails()), JsonData.class);
			JsonNode configJsonNode = JsonUtils.getJsonNodeByField(jsonData, "data");
			BigDecimal maxFlatTepExceptionValue = new BigDecimal(configJsonNode.path("maxFlatTepExchangeValue").asText());
			tepItem.setMaxFlatTepException(maxFlatTepExceptionValue);
		}
		
		tepItem = getRefundConfiguration(tepItem);
		return tepItem;
	}

	private TepItemResponseDto getRefundConfiguration(TepItemResponseDto tepItem) {

		// refund cash limit config
		BigDecimal refundCashLimit = ruleService.getRefundCashLimitConfig();
		tepItem.setRefundCashLimit(refundCashLimit);
		List<String> subPaymentModes = new ArrayList<>();
		// refundMode configutation
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (!StringUtils.isEmpty(authUser.getLocationCode())) {
			LocationResponseDto locationDto = locationService.listLocationByLocationCode(authUser.getLocationCode());
			if (!StringUtil.isBlankJsonData(locationDto.getBankingDetails())
					&& locationDto.getBankingDetails().getData() != null) {
				JsonData bankingDetails = locationDto.getBankingDetails();
				if (bankingDetails == null) {
					throw new ServiceException(ConfigConstants.NO_REFUND_CASH_CONFIG, ConfigConstants.ERR_CONFIG_186,
							Map.of("configKey",
									"BankingDetails - paymentMode in locationCode: " + authUser.getLocationCode()));
				}
				ObjectMapper mapper = new ObjectMapper();
				BankingDetails bankingDetail = mapper.convertValue(bankingDetails.getData(),
						new TypeReference<BankingDetails>() {
						});
				if (StringUtil.isNull(bankingDetail.getPaymentMode())) {
					throw new ServiceException(ConfigConstants.NO_REFUND_CASH_CONFIG, ConfigConstants.ERR_CONFIG_186,
							Map.of("configKey",
									"BankingDetails - paymentMode in locationCode: " + authUser.getLocationCode()));
				}
				tepItem.setAllowedRefundMode(bankingDetail.getPaymentMode());
				if(bankingDetail.getPaymentMode().equalsIgnoreCase(RO_PAYMENT)) {
					subPaymentModes.add(PaymentCodeEnum.CHEQUE.name());
					subPaymentModes.add(PaymentCodeEnum.RTGS.name());
					tepItem.setSubRefundModes(subPaymentModes);
				}
			} else {

				throw new ServiceException(ConfigConstants.NO_REFUND_CASH_CONFIG, ConfigConstants.ERR_CONFIG_186,
						Map.of("configKey",
								"BankingDetails - paymentMode in locationCode: " + authUser.getLocationCode()));
			}
		}
		return tepItem;

	}

	private void validateDummyItemCode(String tepType, String itemCode, ExchangeConfigMasterDao configMaster,
			Boolean isDummy) {
		if (TepTypeEnum.INTER_BRAND_TEP.toString().equals(tepType)
				|| TepTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(tepType)) {
			if (Boolean.TRUE.equals(isDummy) && configMaster == null) {
				throw new ServiceException(ConfigConstants.TEP_IS_NOT_ALLOWED, ConfigConstants.ERR_CONFIG_089,
						ITEM_CODE + itemCode, Map.of(TEP_TYPE, INTERBRAND_TEP));
			}
		} else if (TepTypeEnum.NEW_TEP.toString().equals(tepType)
				|| TepTypeEnum.FULL_VALUE_TEP.toString().equals(tepType)
				|| TepTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(tepType)) {
			Map<String, String> errorMap = new HashMap<>();
			if (TepTypeEnum.NEW_TEP.toString().equals(tepType)) {
				errorMap.put(TEP_TYPE, REGULAR_TEP);
			} else if (TepTypeEnum.FULL_VALUE_TEP.toString().equals(tepType)) {
				errorMap.put(TEP_TYPE, FULL_VALUE_TEP);
			} else if (TepTypeEnum.CUT_PIECE_TEP.toString().equals(tepType)) {
				errorMap.put(TEP_TYPE, CUT_PIECE_TEP);
			}
			if (configMaster != null) {
				throw new ServiceException(ConfigConstants.TEP_IS_NOT_ALLOWED, ConfigConstants.ERR_CONFIG_089,
						ITEM_CODE + itemCode, errorMap);
			}
		}
	}

	private TepCutPieceConfigDto getCutPieceTepConfigDetails(String productCategoryCode, BigDecimal karat,
			String itemTypeCode) {
		TepCutPieceConfigDto tepCutPiece = new TepCutPieceConfigDto();
		ExchangeConfigMasterDao configMaster = exchangeConfigMasterRepo
				.findByConfigType(ConfigTypeEnum.TEP_CUT_PIECE.toString());
		if (configMaster == null) {
			throw new ServiceException("No configuration found for Cut Piece TEP", "ERR-CONFIG-125",
					"config type : " + ConfigTypeEnum.TEP_CUT_PIECE.toString());
		}
		ExchangeConfigProductMappingDao configProductMapping = exchangeConfigProductMappingRepo
				.findByExchangeConfigAndProductCategoryCode(configMaster, productCategoryCode);
		if (configProductMapping == null) {
			throw new ServiceException("No product category configuration found for Cut Piece TEP", "ERR-CONFIG-126");
		}
		// Cut Piece TEP should be done for Gold items only
		if (!"J".equals(itemTypeCode)) {
			throw new ServiceException("Cut Piece TEP is allowed for gold items only", "ERR-CONFIG-128");
		}
		JsonData configDetailsJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(configProductMapping.getConfigDetails()), JsonData.class);
		JsonNode configJsonNode = JsonUtils.getJsonNodeByField(configDetailsJson, "data");
		BigDecimal cutPiecePercent = new BigDecimal(configJsonNode.path("cutPieceTepPercent").asText());
		tepCutPiece.setWeightTolerancePercent(cutPiecePercent);
		ExchangeConfigMasterDao configMasterObj = exchangeConfigMasterRepo
				.findByConfigTypeAndKarat(ConfigTypeEnum.TEP_CUT_PIECE_TOT.toString(), karat);
		if (configMasterObj == null) {
			throw new ServiceException("No configuration found for Cut Piece TOT", "ERR-CONFIG-188",
					"config type : " + ConfigTypeEnum.TEP_CUT_PIECE_TOT.toString());
		}
		tepCutPiece.setCutPieceItemCode(configMasterObj.getItemCode());
		JsonData configDetailsJsonUpdated = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(configMasterObj.getConfigDetails()), JsonData.class);
		JsonNode configJsonNodeUpdated = JsonUtils.getJsonNodeByField(configDetailsJsonUpdated, "data");
		BigDecimal l3DeductionPercent = new BigDecimal(configJsonNodeUpdated.path("l3DeductionPercent").asText());
		tepCutPiece.setL3DeductionPercent(l3DeductionPercent);
		return tepCutPiece;
	}

	/**
	 * @param itemCode
	 * @param tepType
	 * @param tepConfig
	 */
	private void checkAllowedTepType(String itemCode, String tepType, TepProductGroupConfigDetails tepConfig) {
		if (TepTypeEnum.NEW_TEP.toString().equals(tepType)) {
			// if isTepAllowed is false then throw exception
			if (Boolean.FALSE.equals(tepConfig.getIsTepAllowed())) {
				throw new ServiceException(ConfigConstants.TEP_IS_NOT_ALLOWED, ConfigConstants.ERR_CONFIG_089,
						ITEM_CODE + itemCode + " & isTepAllowed : " + tepConfig.getIsTepAllowed(),
						Map.of(TEP_TYPE, REGULAR_TEP));
			}
		} else if (TepTypeEnum.INTER_BRAND_TEP.toString().equals(tepType)
				|| TepTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(tepType)) {
			if (Boolean.FALSE.equals(tepConfig.getIsInterBrandTepAllowed())) {
				throw new ServiceException(
						ConfigConstants.TEP_IS_NOT_ALLOWED, ConfigConstants.ERR_CONFIG_089, "itemCode : " + itemCode
								+ " & isInterBrandTepAllowed : " + tepConfig.getIsInterBrandTepAllowed(),
						Map.of(TEP_TYPE, INTERBRAND_TEP));
			}
		} else if (TepTypeEnum.FULL_VALUE_TEP.toString().equals(tepType)
				|| TepTypeEnum.MANUAL_FULL_VALUE_TEP.toString().equals(tepType)) {
			if (Boolean.FALSE.equals(tepConfig.getIsFVTAllowed())) {
				throw new ServiceException(ConfigConstants.TEP_IS_NOT_ALLOWED, ConfigConstants.ERR_CONFIG_089,
						ITEM_CODE + itemCode + " & isFVTAllowed : " + tepConfig.getIsFVTAllowed(),
						Map.of(TEP_TYPE, FULL_VALUE_TEP));
			}
		} else if (TepTypeEnum.CUT_PIECE_TEP.toString().equals(tepType)
				&& (Boolean.FALSE.equals(tepConfig.getIsCutPieceTepAllowed()))) {
			throw new ServiceException(ConfigConstants.TEP_IS_NOT_ALLOWED, ConfigConstants.ERR_CONFIG_089,
					ITEM_CODE + itemCode + " & isCutPieceTepAllowed : " + tepConfig.getIsCutPieceTepAllowed(),
					Map.of(TEP_TYPE, CUT_PIECE_TEP));
		}
	}

	/**
	 * @param itemCode
	 * @param tepConfig
	 * @return
	 */
	private TepGeneralCodeConfigDto getTepGeneralCodeConfigData(String itemCode, ExchangeConfigMasterDao configMaster,
			Boolean isDummyCode) {
		if (configMaster == null) {
			throw new ServiceException(ConfigConstants.TEP_IS_NOT_ALLOWED, ConfigConstants.ERR_CONFIG_089,
					"itemCode : " + itemCode, Map.of(TEP_TYPE, INTERBRAND_TEP));
		}
		Set<String> productGroups = new HashSet<>();
		List<ExchangeConfigProductMappingDao> productMappingList = exchangeConfigProductMappingRepo
				.findByExchangeConfig(configMaster);
		JsonData configDetailsJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(configMaster.getConfigDetails()), JsonData.class);
		TepGeneralCodesConfig tepGeneralCode = MapperUtil.getObjectMapperInstance()
				.convertValue(configDetailsJson.getData(), TepGeneralCodesConfig.class);
		TepGeneralCodeConfigDto tepGeneralCodeConfig = (TepGeneralCodeConfigDto) MapperUtil
				.getDtoMapping(tepGeneralCode, TepGeneralCodeConfigDto.class);
		productMappingList.forEach(record -> productGroups.add(record.getProductGroupCode()));
		tepGeneralCodeConfig.setAllowedProductGroups(productGroups);
		return tepGeneralCodeConfig;
	}

	private TepExceptionDetailsResponseDto getTepExceptionOfferDetails(String customerMobileNo,
			ExchangeConfigMasterDao configMaster) {
		TepExceptionDetailsResponseDto tepException = (TepExceptionDetailsResponseDto) MapperUtil
				.getDtoMapping(configMaster, TepExceptionDetailsResponseDto.class, "offerDetails");
		tepException.setOfferDetails(MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(configMaster.getOfferDetails()), JsonData.class));
		tepException.setCustomerMobileNo(customerMobileNo);
		return tepException;
	}

	private TepProductGroupConfigDetails validateTepItemConfig(String itemCode, ItemDao item) {
		ExchangeConfigLocationMappingDao locationMapping = exchangeConfigLocationRepo
				.findByConfigTypeAndLocationCode(ConfigTypeEnum.TEP_ITEM.toString(), CommonUtil.getLocationCode());
		// if location mapping is not available then throw exception
		if (locationMapping == null) {
			throw new ServiceException(ConfigConstants.NO_LOCATION_MAPPING_FOUND_FOR_REQUESTED_DETAILS,
					ConfigConstants.ERR_CONFIG_055, LOC_CODE + CommonUtil.getLocationCode());
		}
		ExchangeConfigProductMappingDao exchangeConfigProductMappingDao = exchangeConfigProductMappingRepo
				.findByExchangeConfigAndProductGroupCode(locationMapping.getExchangeConfig(),
						item.getProductGroup().getProductGroupCode());
		// get product mapping by config id & product group code
		// if product mapping details is not available then throw exception
		if (exchangeConfigProductMappingDao == null) {
			throw new ServiceException(ConfigConstants.NO_CONFIGURATION_FOUND_FOR_REQUESTED_PRODUCT_GROUP_CODE,
					ConfigConstants.ERR_CONFIG_088, "product group code : "
							+ item.getProductGroup().getProductGroupCode() + " & item code : " + itemCode);
		}
		JsonData configJson = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(exchangeConfigProductMappingDao.getConfigDetails()), JsonData.class);
		return MapperUtil.getObjectMapperInstance().convertValue(configJson.getData(),
				TepProductGroupConfigDetails.class);
	}

	private ExchangeConfigMasterDao checkForTepException(String itemCode, String customerMobileNo) {
		BusinessDayDto businessDayDto = salesService.getBusinessDay(CommonUtil.getLocationCode());
		// check for TEP exception offer by logged in location code,item code,customer
		// mobile no,business date & config type
		return exchangeConfigMasterRepo.getExchangeConfigMaster(CommonUtil.getLocationCode(), itemCode,
				customerMobileNo, businessDayDto.getBusinessDate(), ConfigTypeEnum.TEP_EXCEPTION.toString());
	}

	@Override
	public ListResponse<TepStoneResponseDto> getTepStone(TepStoneRequestDto tepStoneRequestDto) {
		List<TepStoneResponseDto> tepStoneList = new ArrayList<>();
		tepStoneRequestDto.getStonesDetails().forEach(record -> {
			ExchangeConfigStoneMappingDao stoneMapping = validateTepStoneMapping(record);
//			ExchangeConfigMasterDao configMaster = checkForTepException(record.getStoneCode(),
//					tepStoneRequestDto.getCustomerMobileNo());
			TepStoneResponseDto tepStone = (TepStoneResponseDto) MapperUtil.getDtoMapping(record,
					TepStoneResponseDto.class);
//			if (configMaster != null) {
//				TepExceptionDetailsResponseDto tepException = getTepExceptionOfferDetails(
//						tepStoneRequestDto.getCustomerMobileNo(), configMaster);
//				tepStone.setTepOfferDetails(tepException);
//			}
			BigDecimal stoneDeductionPercent = BigDecimal.ZERO;
			if (stoneMapping != null) {
				stoneDeductionPercent = stoneMapping.getDedutionPercent();
			}
			tepStone.setDeductionPercent(stoneDeductionPercent);
			tepStoneList.add(tepStone);
		});
		return new ListResponse<>(tepStoneList);
	}

	private ExchangeConfigStoneMappingDao validateTepStoneMapping(TepStoneDto record) {
		ExchangeConfigStoneMappingDao stoneMapping = null;
		ExchangeConfigLocationMappingDao locationMapping = exchangeConfigLocationRepo
				.findByConfigTypeAndLocationCode(ConfigTypeEnum.TEP_STONE.toString(), CommonUtil.getLocationCode());
		if (locationMapping != null) {
			stoneMapping = exchangeConfigStoneMappingRepo.findByStoneTypeCodeAndStoneQualityAndRangeAndExchangeConfig(
					record.getStoneTypeCode(), record.getCarat(), locationMapping.getExchangeConfig(),
					record.getStoneQuality());
		}
		return stoneMapping;
	}

	@Override
	@Transactional
	public TepValidationConfigDetails getTepCancelDetails(String tepType) {
		if (!TepTypeEnum.CANCEL_TEP.toString().equals(tepType)) {
			throw new ServiceException("Invalid tep type", "", "tep type : " + tepType);
		}
		ExchangeConfigLocationMappingDao locationMapping = exchangeConfigLocationRepo.findByConfigTypeAndLocationCode(
				ConfigTypeEnum.TEP_VALIDATION.toString(), CommonUtil.getLocationCode());
		// if location mapping is not available then throw exception
		if (locationMapping == null) {
			throw new ServiceException(ConfigConstants.NO_LOCATION_MAPPING_FOUND_FOR_REQUESTED_DETAILS,
					ConfigConstants.ERR_CONFIG_055, LOC_CODE + CommonUtil.getLocationCode());
		}
		ExchangeConfigMasterDao configMaster = locationMapping.getExchangeConfig();
		JsonData jsonData = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(configMaster.getConfigDetails()), JsonData.class);
		return MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(), TepValidationConfigDetails.class);
	}

	@Override
	public LovDto getLov(String lovType, Boolean isManualDiscount, Boolean isPageable, Pageable pageable) {
		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		List<ConfigLovDao> configLovList = configLovRepo.findByLovTypeAndIsActiveTrue(lovType, pageable);
		LovDto lovDto = new LovDto();
		if (isManualDiscount != null) {
			List<DiscountTypeMetaDataDao> metaDataDaos = discountTypeMetaDataRepository.getDiscounts(isManualDiscount);
			if (!metaDataDaos.isEmpty()) {
				lovDto.setLovType(lovType);
				List<KeyValueDto> keyValueDtoList = new ArrayList<>();
				configLovList.forEach(lov -> {
					metaDataDaos.forEach(meta -> {
						if (meta.getDiscountType().equals(lov.getCode())) {
							KeyValueDto keyValueDto = (KeyValueDto) MapperUtil.getObjectMapping(lov, new KeyValueDto());
							keyValueDtoList.add(keyValueDto);
						}
					});
				});
				lovDto.setResults(keyValueDtoList);
			} else {
				lovDto.setResults(new ArrayList<KeyValueDto>());
			}
		} else {
			lovDto.setLovType(lovType);
			if (!configLovList.isEmpty()) {
				List<KeyValueDto> keyValueDtoList = configLovList.stream()
						.map(configLov -> (KeyValueDto) MapperUtil.getObjectMapping(configLov, new KeyValueDto()))
						.collect(Collectors.toList());
				lovDto.setResults(keyValueDtoList);
			} else {
				lovDto.setResults(new ArrayList<KeyValueDto>());
			}
		}

		return lovDto;
	}

	@Override
	public ListResponse<FocSchemeItemResponseDto> getFocSchemesOnProductGroups(
			@Valid FocSchemeRequestDto focSchemeRequestDto) {

		Map<String, PurchaseItemRequestDto> requestMap = new HashMap<>();

		if (!CollectionUtils.isEmpty(focSchemeRequestDto.getPurchaseItems())) {
			focSchemeRequestDto.getPurchaseItems()
					.forEach(itemDetail -> requestMap.put(itemDetail.getProductGroupCode(), itemDetail));
		}

		List<FocSchemeProductMappingDto> focProductDtoList = getProductDaoList(focSchemeRequestDto);

		Map<String, Set<String>> schemeDetailsMap = new HashMap<>(); // key is schemeDetailId
		Map<String, Set<String>> schemeMap = new HashMap<>(); // key is schemeId

		if (!CollectionUtils.isEmpty(focProductDtoList)) {
			focProductDtoList.forEach(focProductDto -> {
				// Standard Scheme-SchemeDetailId
				if (focProductDto.getSchemeDetailsId() != null) {

					if (schemeDetailsMap.get(focProductDto.getSchemeDetailsId()) != null) {

						schemeDetailsMap.get(focProductDto.getSchemeDetailsId())
								.add(focProductDto.getProductGroupCode());
					} else {
						Set<String> productList = new HashSet<>();
						productList.add(focProductDto.getProductGroupCode());
						schemeDetailsMap.put(focProductDto.getSchemeDetailsId(), productList);
					}
				}

				else {
					// Slab Scheme-SchemeId
					if (schemeMap.get(focProductDto.getSchemeId()) != null) {

						schemeMap.get(focProductDto.getSchemeId()).add(focProductDto.getProductGroupCode());
					} else {
						Set<String> productList = new HashSet<>();
						productList.add(focProductDto.getProductGroupCode());
						schemeMap.put(focProductDto.getSchemeId(), productList);
					}
				}

			});
		}

		List<FocSchemeItemResponseDto> focSchemeItemResponseDtos = new ArrayList<>();

		// for stdSchemeDetails
		if (!schemeDetailsMap.keySet().isEmpty()) {
			validateStandardSchemeEligibility(schemeDetailsMap, requestMap, focSchemeItemResponseDtos,
					focSchemeRequestDto);
		}

		// for slabSchemeDetails
		if (!schemeMap.keySet().isEmpty()) {
			validateSlabSchemeEligibility(schemeMap, requestMap, focSchemeItemResponseDtos, focSchemeRequestDto);
		}
		
		// removing from the list if items are not mapped to a scheme
		//focSchemeItemResponseDtos.removeIf(scheme -> scheme.getSchemeDetailId().isEmpty());

		return new ListResponse<>(focSchemeItemResponseDtos);
	}

	/**
	 * @param schemeMap
	 * @param requestMap
	 * @param focSchemeItemResponseDtos
	 * @param focSchemeRequestDto
	 */
	private void validateSlabSchemeEligibility(Map<String, Set<String>> schemeMap,
			Map<String, PurchaseItemRequestDto> requestMap, List<FocSchemeItemResponseDto> focSchemeItemResponseDtos,
			@Valid FocSchemeRequestDto focSchemeRequestDto) {
//		List<FocSchemeDetailsDto> schemeDetailsList = focSchemeDetailsRepo
//				.findBySchemeIdInForSlabBased(OfferTypeEnum.SLAB.toString(), schemeMap.keySet(), requestMap.keySet());
		List<FocSchemeDetailsDto> schemeDetailsList = new ArrayList<>();
		for (FocSchemeDetailsDto schemeDetail : focSchemeRequestDto.getSchemeDetails())
			focSchemeRequestDto.getSchemeProductMapping().forEach(product -> {
				if (schemeDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.SLAB.toString())
						&& schemeMap.containsKey(schemeDetail.getSchemeId())
						&& requestMap.keySet().contains(product.getProductGroupCode())
						&& product.getItemType().equalsIgnoreCase(schemeDetail.getItemType()))
					schemeDetailsList.add(schemeDetail);
			});

		if (!CollectionUtils.isEmpty(schemeDetailsList)) {
			Map<String, FocSchemeDetailsDto> schemeDetailMap = new HashMap<>();

			schemeDetailsList.forEach(schemeDetail -> schemeDetailMap.put(schemeDetail.getId(), schemeDetail));

			List<FocSchemeDetailsDto> activeSchemeDetailsList = new ArrayList<>();

			focSchemeRequestDto.getSchemeDetails().forEach(schemeDetail -> {
				if (schemeDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.SLAB.toString())
						&& schemeMap.containsKey(schemeDetail.getSchemeId()))
					activeSchemeDetailsList.add(schemeDetail);
			});

			List<FocSchemeProductMappingDao> slabProductGroups = focSchemeProductMappingRepo
					.findBySlabCategory(schemeMap.keySet());
			Map<String, String> slabCategoryMap = new HashMap<>();

			if (!CollectionUtils.isEmpty(slabProductGroups)) {
				slabProductGroups.forEach(slabProductDao -> {
					if (slabProductDao.getId() != null) {
						slabCategoryMap.put(slabProductDao.getProductGroupCode(), slabProductDao.getCategory());
					}
				});
			}

			for (FocSchemeDetailsDto activeStdFocDetail : activeSchemeDetailsList) {

				List<FocItemDto> focItemDtoList = new ArrayList<>();
				List<FocItemDto> validatedList = null;
				Set<String> productGroupList = schemeMap.get(activeStdFocDetail.getSchemeId());
				List<String> productResponseList = new ArrayList<>();

				if (BooleanUtils.isTrue(activeStdFocDetail.getIsSingle())) {
					for (String productGroupCode : productGroupList) {
						for (Map.Entry<String, String> entry : slabCategoryMap.entrySet()) {
							if ((entry.getKey().toString().equals(productGroupCode))
									&& entry.getValue().equals(activeStdFocDetail.getCategory().toString())
									&& (requestMap.get(productGroupCode) != null)) {
								BigDecimal purchaseValue = calculatePurchaseValue(activeStdFocDetail,
										requestMap.get(productGroupCode));
								validatedList = slabSchemeEligibility(purchaseValue, activeStdFocDetail);
								if (!CollectionUtils.isEmpty(validatedList)) {
									if (!focItemDtoList.isEmpty()) {
										BigDecimal wt = (focItemDtoList.get(0).getWeight()
												.add(validatedList.get(0).getWeight()));
										Set<FocItemDto> dtos = new HashSet<>();
										for (FocItemDto item : focItemDtoList) {
											item.setWeight(wt);
											dtos.add(item);
										}
										for (FocItemDto item : validatedList) {
											item.setWeight(wt);
											dtos.add(item);
										}
										dtos.forEach(dto -> focItemDtoList.add(dto));
									} else
										focItemDtoList.addAll(validatedList);
									productResponseList.add(productGroupCode);
									// break;
								}
							}
						}
					}

				} else {
					BigDecimal totalPurchaseValue = BigDecimal.ZERO;
					for (String productGroupCode : productGroupList) {
						for (Map.Entry<String, String> entry : slabCategoryMap.entrySet()) {
							if ((entry.getKey().toString().equals(productGroupCode))
									&& entry.getValue().equals(activeStdFocDetail.getCategory().toString())
											&& (requestMap.get(productGroupCode) != null)) {
//								if (requestMap.get(productGroupCode) != null) {
									productResponseList.add(productGroupCode);
									BigDecimal purchaseValue = calculatePurchaseValue(activeStdFocDetail,
											requestMap.get(productGroupCode));
									totalPurchaseValue = totalPurchaseValue.add(purchaseValue);
							//	}
							}
						}
					}
					validatedList = slabSchemeEligibility(totalPurchaseValue, activeStdFocDetail);
					if (!CollectionUtils.isEmpty(validatedList)) {
						//productResponseList.addAll(productGroupList);
						focItemDtoList.addAll(validatedList);

					}

				}
				if (!CollectionUtils.isEmpty(focItemDtoList)) {
					setFinalResponseDto(activeStdFocDetail, focSchemeItemResponseDtos, focSchemeRequestDto,
							focItemDtoList, productResponseList);
				}

			}
		}
	}

	/**
	 * @param purchaseValue
	 * @param activeStdFocDetail
	 * @return
	 */
	private List<FocItemDto> slabSchemeEligibility(BigDecimal purchaseValue,
			FocSchemeDetailsDto activeSchemeFocDetail) {
		List<FocItemDto> focItemDtoList = new ArrayList<>();
		BigDecimal fromValue = BigDecimal.ZERO;
		BigDecimal toValue = BigDecimal.ZERO;

		if (activeSchemeFocDetail.getFromSaleValue() != null) {
			fromValue = activeSchemeFocDetail.getFromSaleValue();
		}

		if (activeSchemeFocDetail.getToSaleValue() != null) {
			toValue = activeSchemeFocDetail.getToSaleValue();
		}

		if (validatePurchaseValue(purchaseValue, fromValue, toValue)) {
			// in slab we have to check for Multiplying value =0 like isMultiple in std
			if (activeSchemeFocDetail.getStdSaleValue() == null
					|| activeSchemeFocDetail.getStdSaleValue().compareTo(BigDecimal.ZERO) == 0) {

				if (activeSchemeFocDetail.getItemType().equalsIgnoreCase(ItemTypeEnum.GOLD_COIN.toString())) {

					calculateItemCodeListForGoldCoins(activeSchemeFocDetail, null, focItemDtoList);
				} else {

					calculateItemCodeListForOthers(activeSchemeFocDetail, null, focItemDtoList);
				}

			} else {
				BigDecimal multiplyFactor = purchaseValue.divide(activeSchemeFocDetail.getStdSaleValue(), 0,
						RoundingMode.DOWN);

				if (activeSchemeFocDetail.getItemType().equalsIgnoreCase(ItemTypeEnum.GOLD_COIN.toString())) {

					calculateItemCodeListForGoldCoins(activeSchemeFocDetail, multiplyFactor, focItemDtoList);
				} else {
					calculateItemCodeListForOthers(activeSchemeFocDetail, multiplyFactor, focItemDtoList);
				}
			}
		} 
//		else {
//			activeSchemeFocDetail.setWeight(null);
//			activeSchemeFocDetail.setQuantity(null);
//		}
		return focItemDtoList;
	}

	/**
	 * @param schemeDetailsMap
	 * @param requestMap
	 * @param focSchemeItemResponseDtos
	 * @param focSchemeRequestDto
	 */
	private void validateStandardSchemeEligibility(Map<String, Set<String>> schemeDetailsMap,
			Map<String, PurchaseItemRequestDto> requestMap, List<FocSchemeItemResponseDto> focSchemeResponseList,
			@Valid FocSchemeRequestDto focSchemeRequestDto) {

		// List<FocSchemeDetailsDao> activeFocDetailsList =
		// focSchemeDetailsRepo.findByIdIn(schemeDetailsMap.keySet());

		List<FocSchemeDetailsDto> activeFocDetailsList = new ArrayList<>();

		focSchemeRequestDto.getSchemeDetails().forEach(schemeDetail -> {
			if (schemeDetailsMap.containsKey(schemeDetail.getId()))
				activeFocDetailsList.add(schemeDetail);
		});
		if (!CollectionUtils.isEmpty(activeFocDetailsList)) {

			activeFocDetailsList.forEach(activeStdFocDetail -> {

				List<FocItemDto> focItemDtoList = new ArrayList<>();
				List<FocItemDto> focItemDtoListFinal = new ArrayList<>();
				Map<String, FocItemDto> itemCodes = new HashMap<>();
				BigDecimal weight = BigDecimal.ZERO;
				Short qty = (short) 0;
				Set<String> productGroupList = schemeDetailsMap.get(activeStdFocDetail.getId());
				List<String> productResponseList = new ArrayList<>();
				// single product mapping
				if (activeStdFocDetail.getIsSingle()) {
					for (String productGroupCode : productGroupList) {
						if (requestMap.get(productGroupCode) != null) {
							BigDecimal purchaseValue = calculatePurchaseValue(activeStdFocDetail,
									requestMap.get(productGroupCode));
							//productResponseList.add(productGroupCode);
							// compute std Scheme eligbility for the calculated purchaseValue
							focItemDtoList = stdSchemeEligibility(purchaseValue, activeStdFocDetail);
							if (!CollectionUtil.isEmpty(focItemDtoList)) {

								focItemDtoList.forEach(fi -> itemCodes.put(fi.getItemCode(), fi));

								// check if item came in output, if available before, if yes, add quantity, else
								// new entry
								if (focItemDtoList.get(0).getWeight() != null)
									weight = weight.add(focItemDtoList.get(0).getWeight());
								if (focItemDtoList.get(0).getQuantity() != null)
									qty = (short) (qty + focItemDtoList.get(0).getQuantity());
								productResponseList.add(productGroupCode);
							}
						}
					}
					for (Map.Entry<String, FocItemDto> entry : itemCodes.entrySet()) {
						if (entry.getValue().getQuantity() != null)
							entry.getValue().setQuantity(qty);
						if (entry.getValue().getWeight() != null)
							entry.getValue().setWeight(weight);
						focItemDtoListFinal.add(entry.getValue());
					}
					focItemDtoList = focItemDtoListFinal;
				}

				else {
					// cumulative
					BigDecimal totalPurchaseValue = BigDecimal.ZERO;

					for (String productGroupCode : productGroupList) {
						if (requestMap.get(productGroupCode) != null) {
							productResponseList.add(productGroupCode);
							BigDecimal purchaseValue = calculatePurchaseValue(activeStdFocDetail,
									requestMap.get(productGroupCode));
							totalPurchaseValue = totalPurchaseValue.add(purchaseValue);
							//focItemDtoList.addAll(stdSchemeEligibility(totalPurchaseValue, activeStdFocDetail));
						}
					}
					focItemDtoList.addAll(stdSchemeEligibility(totalPurchaseValue, activeStdFocDetail));
				}

				setFinalResponseDto(activeStdFocDetail, focSchemeResponseList, focSchemeRequestDto, focItemDtoList,
						productResponseList);

			});

		}

	}

	/**
	 * @param activeStdFocDetail
	 * @param focSchemeResponseList
	 * @param focSchemeRequestDto
	 * @param focItemDtoList
	 * @param productResponseList
	 */
	private void setFinalResponseDto(FocSchemeDetailsDto activeStdFocDetail,
			List<FocSchemeItemResponseDto> focSchemeResponseList, @Valid FocSchemeRequestDto focSchemeRequestDto,
			List<FocItemDto> focItemDtoList, List<String> productResponseList) {

		productResponseList.forEach(productGroupCode -> {
			if (activeStdFocDetail.getQuantity() != null || activeStdFocDetail.getWeight() != null) {
				FocSchemeItemResponseDto focSchemeResponse = new FocSchemeItemResponseDto();
				focSchemeResponse.setSchemeDetailId(activeStdFocDetail.getId());
				focSchemeResponse.setSchemeId(activeStdFocDetail.getSchemeId());
				focSchemeResponse.setQuantity(activeStdFocDetail.getQuantity());
				focSchemeResponse.setWeight(activeStdFocDetail.getIntialWt() !=null ? activeStdFocDetail.getIntialWt() : BigDecimal.ZERO);
				focSchemeResponse.setProductGroupCode(productGroupCode);
				focSchemeResponseList.add(focSchemeResponse);
			}
		});

	}

	/**
	 * @param totalPurchaseValue
	 * @param activeStdFocDetail
	 * @return
	 */
	private List<FocItemDto> stdSchemeEligibility(BigDecimal purchaseValue, FocSchemeDetailsDto activeStdFocDetail) {
		List<FocItemDto> focItemDtoList = new ArrayList<>();

		if (purchaseValue.compareTo(activeStdFocDetail.getStdSaleValue()) > 0
				|| purchaseValue.compareTo(activeStdFocDetail.getStdSaleValue()) == 0) {
			// when isMultiple is configured - for every integral times increase in the
			// standard value
			if (activeStdFocDetail.getIsMultiple()) {

				BigDecimal multiplyFactor = purchaseValue.divide(activeStdFocDetail.getStdSaleValue(), 0,
						RoundingMode.DOWN);

				if (activeStdFocDetail.getItemType().equalsIgnoreCase(ItemTypeEnum.GOLD_COIN.toString())) {

					// getting focitems(gold coins) mapped to a scheme
					calculateItemCodeListForGoldCoins(activeStdFocDetail, multiplyFactor, focItemDtoList);

				} else {
					// getting diamonds or otherthan goldcoins mapped to a scheme
					calculateItemCodeListForOthers(activeStdFocDetail, multiplyFactor, focItemDtoList);
				}

			} else {
				// isMultiple is false
				if (activeStdFocDetail.getItemType().equalsIgnoreCase(ItemTypeEnum.GOLD_COIN.toString())) {

					// getting focitems(gold coins) mapped to a scheme
					calculateItemCodeListForGoldCoins(activeStdFocDetail, null, focItemDtoList);

				} else {
					// getting diamonds or otherthan goldcoins mapped to a scheme
					calculateItemCodeListForOthers(activeStdFocDetail, null, focItemDtoList);
				}
			}

		} 
//		else {
//			activeStdFocDetail.setWeight(null);
//			activeStdFocDetail.setQuantity(null);
//		}

		return focItemDtoList;
	}

	/**
	 * @param activeStdFocDetail
	 * @param multiplyFactor
	 * @param focItemDtoList
	 */
	private void calculateItemCodeListForOthers(FocSchemeDetailsDto activeStdFocDetail, BigDecimal multiplyFactor,
			List<FocItemDto> focItemDtoList) {
		FocItemDto focItem = new FocItemDto();
		if (activeStdFocDetail.getQuantity() != null) {

			focItem.setItemCode(activeStdFocDetail.getItemCode());

			// setting the number of diamonds or other items for std scheme when isMultiple
			// is selected
			if (multiplyFactor != null
					&& activeStdFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.STANDARD.toString()) && !(multiplyFactor.equals(BigDecimal.ZERO))) {
				focItem.setQuantity((short) (multiplyFactor.intValue() * activeStdFocDetail.getQuantity()));
				activeStdFocDetail.setQuantity((multiplyFactor.intValue() * activeStdFocDetail.getQuantity()));
			}
			// setting the number of diamonds or other items for slab scheme when isMultiple
			// is selected
			else if (multiplyFactor != null
					&& activeStdFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.SLAB.toString()) && !(multiplyFactor.equals(BigDecimal.ZERO))) {
				focItem.setQuantity((short) (multiplyFactor.intValue() * activeStdFocDetail.getQuantity() + 1));
				activeStdFocDetail.setQuantity((multiplyFactor.intValue() * activeStdFocDetail.getQuantity() + 1));
			} else {
				focItem.setQuantity(activeStdFocDetail.getQuantity().shortValue());
			}
		}
		activeStdFocDetail.setWeight(null);

		focItemDtoList.add(focItem);
	}

	/**
	 * @param activeStdFocDetail
	 * @param multiplyFactor
	 * @param focItemDtoList
	 */
	private void calculateItemCodeListForGoldCoins(FocSchemeDetailsDto activeFocDetail, BigDecimal multiplyFactor,
			List<FocItemDto> focItemDtoList) {
		BigDecimal weight = null;
		BigDecimal tempWt = activeFocDetail.getActualWt();
	    BigDecimal actualWt = focSchemeDetailsRepo.findWt(activeFocDetail.getId()); //getting wt from db
	    BigDecimal intialWt = null;
		// calculating weight for standard based schemes
		if (multiplyFactor != null
				&& activeFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.STANDARD.toString()) && !(multiplyFactor.equals(BigDecimal.ZERO))){
			weight = multiplyFactor.multiply(actualWt);

			// calculating weight for slab based schemes
		} else if (multiplyFactor != null
				&& activeFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.SLAB.toString()) && activeFocDetail.getWeight() != null && 
				!(multiplyFactor.equals(BigDecimal.ZERO))) {
			
			weight = multiplyFactor.multiply(actualWt);
		} else {
			weight = actualWt;
		}
		if(tempWt != null) {
			intialWt = weight.add(activeFocDetail.getWeight());
			activeFocDetail.setWeight(intialWt);
			activeFocDetail.setIntialWt(intialWt);
		}else {
			activeFocDetail.setWeight(weight);
			activeFocDetail.setActualWt(weight);
			activeFocDetail.setIntialWt(weight);
		}
		activeFocDetail.setQuantity(null);
		// getting itemCodes mapped to a scheme
		List<FocItemLiteDto> focItemList = focSchemeItemMappingRepo
				.findItemCodesBySchemeId(activeFocDetail.getSchemeId(), activeFocDetail.getKarat(), weight);

		if (!CollectionUtils.isEmpty(focItemList)) {

			focItemList.forEach(focItemCode -> {
				FocItemDto focItem = new FocItemDto();
				focItem.setItemCode(focItemCode.getItemCode());
//				focItem.setQuantity(focItemCode.getQuantity().shortValue());
				if (multiplyFactor != null
						&& activeFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.STANDARD.toString()) && !(multiplyFactor.equals(BigDecimal.ZERO))) {
					focItem.setWeight(multiplyFactor.multiply(activeFocDetail.getWeight()));
				} else if (multiplyFactor != null
						&& activeFocDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.SLAB.toString()) && !(multiplyFactor.equals(BigDecimal.ZERO))) {
					focItem.setWeight(multiplyFactor.multiply(activeFocDetail.getWeight()));
				} else {
					focItem.setWeight(activeFocDetail.getWeight());
				}

				focItemDtoList.add(focItem);
			});

		}

	}

	/**
	 * @param activeStdFocDetail
	 * @param purchaseItemRequestDto
	 * @return
	 */
	private BigDecimal calculatePurchaseValue(FocSchemeDetailsDto activeStdFocDetail,
			PurchaseItemRequestDto purchaseItemRequestDto) {

		BigDecimal purchaseValue;
		String focEligibility = activeStdFocDetail.getFocEligibility();
		// calculating purchase value for weight based scheme
		if (activeStdFocDetail.getCategory().equalsIgnoreCase(CategoryEnum.WEIGHT_BASED.toString())) {

			if (FocEligibilityEnum.NET_WEIGHT.toString().equalsIgnoreCase(focEligibility)) {
				purchaseValue = purchaseItemRequestDto.getTotalMetalWeight();
			} else {
				purchaseValue = purchaseItemRequestDto.getTotalMetalWeight().add(purchaseItemRequestDto
						.getTotalMaterialWeight().add(purchaseItemRequestDto.getTotalStoneWeight()));
			}
		}
		// calculating purchase value for value based scheme based on focEligibility
		// configured in scheme
		else {

			BigDecimal totalValue = purchaseItemRequestDto.getTotalValue();
			BigDecimal totalDiscount = purchaseItemRequestDto.getTotalDiscount();
			BigDecimal totalTax = purchaseItemRequestDto.getTotalTax();

			if (FocEligibilityEnum.PRE_DISCOUNT_TAX.toString().equalsIgnoreCase(focEligibility)) {
				purchaseValue = totalValue.add(totalTax);
			} else if (FocEligibilityEnum.PRE_DISCOUNT_WITHOUT_TAX.toString().equalsIgnoreCase(focEligibility)) {
				purchaseValue = totalValue;
			} else if (FocEligibilityEnum.POST_DISCOUNT_TAX.toString().equalsIgnoreCase(focEligibility)) {
				purchaseValue = totalValue.subtract(totalDiscount).add(totalTax);
			} else {
				purchaseValue = totalValue.subtract(totalDiscount);
			}
		}

		return purchaseValue;
	}

	/**
	 * @param focSchemeRequestDto
	 * @return
	 */
	private List<FocSchemeProductMappingDto> getProductDaoList(@Valid FocSchemeIndividualBaseDto focSchemeRequestDto) {

		List<FocSchemeProductMappingDto> focSchemeProductMappingDtos = new ArrayList<>();

		for (FocSchemeDetailsDto focSchemeDetailsDto : focSchemeRequestDto.getSchemeDetails())
			for (FocSchemeProductMappingDto focSchemeProductMappingDto : focSchemeRequestDto
					.getSchemeProductMapping()) {
				if (focSchemeDetailsDto.getSchemeId().equalsIgnoreCase(focSchemeProductMappingDto.getSchemeId())
						&& focSchemeDetailsDto.getCategory().equalsIgnoreCase(focSchemeProductMappingDto.getCategory())
						&& focSchemeDetailsDto.getItemType()
								.equalsIgnoreCase(focSchemeProductMappingDto.getItemType())) {
					focSchemeProductMappingDtos.add(focSchemeProductMappingDto);
				}
			}
		return focSchemeProductMappingDtos;
	}

	@Override
	public ListResponse<FocSchemeForABResponseDto> getFocSchemesForAB(@Valid FocSchemeRequestDto focSchemeRequestDto) {

		Map<String, PurchaseItemRequestDto> requestMap = new HashMap<>();

		if (!CollectionUtils.isEmpty(focSchemeRequestDto.getPurchaseItems())) {
			focSchemeRequestDto.getPurchaseItems()
					.forEach(itemDetail -> requestMap.put(itemDetail.getProductGroupCode(), itemDetail));
		}

		// getting products mapped to Active Scheme for a given location and current
		// businessdate
		List<FocSchemeProductMappingDao> focProductDaoList = getProductGroup(focSchemeRequestDto, requestMap);
		List<FocSchemeForABResponseDto> abResponseDtoList = new ArrayList<>();

		Map<String, Set<String>> schemeDetailsMap = new HashMap<>(); // key is schemeDetailId
		Map<String, Set<String>> schemeMap = new HashMap<>(); // key is schemeId

		if (!CollectionUtils.isEmpty(focProductDaoList)) {
			focProductDaoList.forEach(focProductDao -> {
				// Standard Scheme-SchemeDetailId
				if (focProductDao.getFocSchemeDetailsDao() != null) {

					if (schemeDetailsMap.get(focProductDao.getFocSchemeDetailsDao().getId()) != null) {

						schemeDetailsMap.get(focProductDao.getFocSchemeDetailsDao().getId())
								.add(focProductDao.getProductGroupCode());
					} else {
						Set<String> productList = new HashSet<>();
						productList.add(focProductDao.getProductGroupCode());
						schemeDetailsMap.put(focProductDao.getFocSchemeDetailsDao().getId(), productList);
					}
				}

				else {
					// Slab Scheme-SchemeId
					if (schemeMap.get(focProductDao.getFocSchemeMasterDao().getId()) != null) {

						schemeMap.get(focProductDao.getFocSchemeMasterDao().getId())
								.add(focProductDao.getProductGroupCode());
					} else {
						Set<String> productList = new HashSet<>();
						productList.add(focProductDao.getProductGroupCode());
						schemeMap.put(focProductDao.getFocSchemeMasterDao().getId(), productList);
					}
				}

			});
		}
		List<FocSchemeResponseDto> focSchemeResponseList = new ArrayList<>();

		// for stdSchemeDetails
		if (!schemeDetailsMap.keySet().isEmpty()) {
			checkStandardSchemeEligibility(schemeDetailsMap, requestMap, focSchemeResponseList, focSchemeRequestDto,
					true);
		}

		// for slabSchemeDetails
		if (!schemeMap.keySet().isEmpty()) {
			checkSlabSchemeEligibility(schemeMap, requestMap, focSchemeResponseList, focSchemeRequestDto, true);
		}

		// removing from the list if items are not mapped to a scheme
		focSchemeResponseList.removeIf(scheme -> scheme.getFocItems().isEmpty());

		focSchemeResponseList.forEach(response -> {
			FocSchemeForABResponseDto abResponseDto = new FocSchemeForABResponseDto();
			abResponseDto.setPurchaseItems(focSchemeRequestDto.getPurchaseItems());
			abResponseDto.setWeight(response.getFocItems().get(0).getWeight());
			abResponseDto.setSchemeId(response.getSchemeId());
			abResponseDto.setSchemeName(response.getSchemeName());
			abResponseDto.setSchemeCategory(response.getSchemeCategory());
			abResponseDto.setSchemeDetailId(Arrays.asList(response.getSchemeDetailId()));
			abResponseDtoList.add(abResponseDto);
		});

		return new ListResponse<>(abResponseDtoList);

	}

	private List<FocSchemeProductMappingDao> getProductGroup(FocSchemeRequestDto focSchemeRequestDto,
			Map<String, PurchaseItemRequestDto> requestMap) {

		// getting Active Schemes for given location and current businessdate
		List<FocSchemeMasterDao> focMasterDaoList = focSchemeMasterRepo.getActiveSchemes(CommonUtil.getLocationCode(),
				CalendarUtils.getStartOfDay(focSchemeRequestDto.getBusinessDate()));

		List<String> schemeIdList = new ArrayList<>();

		if (!CollectionUtils.isEmpty(focMasterDaoList) && !requestMap.keySet().isEmpty()) {
			focMasterDaoList.forEach(focScheme -> schemeIdList.add(focScheme.getId()));
		}

		else {
			return new ArrayList<>();
		}
		// getting products mapped for the Active Schemes

		return focSchemeProductMappingRepo.getMappedProductWrtCategoryAndItemTypeDetailId(schemeIdList,
				requestMap.keySet());
	}

	@Override
	public SalesTxnDao validateCMManualFocDetails(String locationCode, String approvedBy, String CMNumber,
			String fiscalYear, String mobileNumber) {

		// check whether the cashmemo is already available or not.
		if (CMNumber != null && fiscalYear != null && locationCode != null) {
			SalesTxnDao salesDao = salesTxnRepoExt.getByDocNoFiscalCodeAndLocationCode(fiscalYear, CMNumber,
					locationCode, TransactionTypeEnum.CM.name(), "CONFIRMED");
			if (salesDao == null) {
				throw new ServiceException("Record not found.", "ERR-SALE-070",
						"No Details Found for this CMNumber: " + CMNumber);
			}

			CustomerDto customerDetails = salesService.getCustomer(salesDao.getCustomerId());

			if (!CryptoUtil.decrypt(customerDetails.getMobileNumber(), MOBILENUMBER).equalsIgnoreCase(mobileNumber)) {
				throw new ServiceException("Record not found.", "ERR-SALE-070",
						"This CashMemo number is not mapped for this customer");
			} else {
				return salesDao;
			}
		}

		return null;
	}

	@Override
	public void validateManualFocIsAlreadyGiven(VerifyManualFOCDto verifyManualFOCDto) {

		// check whether the customer already received the manual foc or not based on
		// the customer id, manual foc startdate and enddate.
		SalesTxnDao salesDao = salesTxnRepoExt.validateCustomerForManualFoc(verifyManualFOCDto.getCustomerID(),
				verifyManualFOCDto.getManualFocStartDate(), verifyManualFOCDto.getManualFocEndDate(), 1);

		if (salesDao != null) {
			throw new ServiceException("Manual FOC is Already Given for this customer", "ERR-CONFIG-175",
					"Manual FOC can be given only once for a particular period of time for this customer: "
							+ verifyManualFOCDto.getCustomerID());
		}

	}

	@Override
	@Transactional
		public TepItemResponseDto getTepItems(String itemCode, String customerMobileNo, String tepType,
				Boolean isDummyCode) {
		TepItemResponseDto tepItem = new TepItemResponseDto();
			ItemDao item = itemDaoRepository.findByItemCodeAndIsActive(itemCode, Boolean.TRUE);
			if (item == null) {
				throw new ServiceException("No Item details found for the requested itemCode", "ERR-PRO-028",
						ITEM_CODE + itemCode);
			}
			TepProductGroupConfigDetails tepConfig = validateTepItemConfigs(itemCode, item);
			//checkAllowedTepType(itemCode, tepType, tepConfig);
			ExchangeConfigMasterDao configMaster = checkForTepException(itemCode, customerMobileNo);
			if(tepConfig!=null) {
			 tepItem = (TepItemResponseDto) MapperUtil.getDtoMapping(tepConfig, TepItemResponseDto.class);
			 if (configMaster != null) {
					TepExceptionDetailsResponseDto tepException = getTepExceptionOfferDetails(customerMobileNo, configMaster);
					tepItem.setTepOfferDetails(tepException);
				}
				configMaster = exchangeConfigMasterRepo.findByItemCodeAndConfigType(itemCode,
						ConfigTypeEnum.TEP_GENERAL_CODES.toString());
				//validateDummyItemCode(tepType, itemCode, configMaster, isDummyCode);
				if (Boolean.TRUE.equals(isDummyCode) && (TepTypeEnum.INTER_BRAND_TEP.toString().equals(tepType)
						|| TepTypeEnum.MANUAL_INTER_BRAND_TEP.toString().equals(tepType))) {
					TepGeneralCodeConfigDto tepGeneralCodes = getTepGeneralCodeConfigData(itemCode, configMaster, isDummyCode);
					tepItem.setTepGeneralCodeConfig(tepGeneralCodes);
					TepValidationConfigDetails tepValidationConfig = getTepCancelDetails(TepTypeEnum.CANCEL_TEP.toString());
					tepItem.setTepValidationConfig(tepValidationConfig);
					// Interbrand tep not allowed for cm non mandatory for product group other than
					// 71 and 73
					if (Boolean.FALSE.equals(tepGeneralCodes.getIsCMMandatory())
							&& !("71".equals(item.getProductGroup().getProductGroupCode())
									|| "73".equals(item.getProductGroup().getProductGroupCode())))
						throw new ServiceException(ConfigConstants.INTER_BRAND_NOT_ALLOWED, ConfigConstants.ERR_CONFIG_173,
								Map.of("dummyCode", item.getItemCode()));
				}
				if (TepTypeEnum.CUT_PIECE_TEP.toString().equals(tepType)) {
					TepCutPieceConfigDto tepCutPiece = getCutPieceTepConfigDetails(
							item.getProductCategory().getProductCategoryCode(), item.getKarat(),
							item.getProductGroup().getItemType().getItemTypeCode());
					tepItem.setTepCutPieceConfig(tepCutPiece);
				}
				tepItem.setMaxFlatTepException(BigDecimal.ZERO);
				configMaster = exchangeConfigMasterRepo.findByConfigType(ConfigTypeEnum.TEP_GLOBAL.name());
				if(configMaster!=null && configMaster.getConfigDetails()!=null) {
					JsonData jsonData = MapperUtil.getObjectMapperInstance()
							.convertValue(MapperUtil.getJsonFromString(configMaster.getConfigDetails()), JsonData.class);
					JsonNode configJsonNode = JsonUtils.getJsonNodeByField(jsonData, "data");
					BigDecimal maxFlatTepExceptionValue = new BigDecimal(configJsonNode.path("maxFlatTepExchangeValue").asText());
					tepItem.setMaxFlatTepException(maxFlatTepExceptionValue);
				}
				
				tepItem = getRefundConfiguration(tepItem);	
			} 
			
			return tepItem;
		}
	private TepProductGroupConfigDetails validateTepItemConfigs(String itemCode, ItemDao item) {
		
		ExchangeConfigLocationMappingDao locationMapping = exchangeConfigLocationRepo
				.findByConfigTypeAndLocationCode(ConfigTypeEnum.TEP_ITEM.toString(), CommonUtil.getLocationCode());
		// if location mapping is not available then throw exception
//		if (locationMapping == null) {
//			throw new ServiceException(ConfigConstants.NO_LOCATION_MAPPING_FOUND_FOR_REQUESTED_DETAILS,
//					ConfigConstants.ERR_CONFIG_055, LOC_CODE + CommonUtil.getLocationCode());
//		}
		if(locationMapping!=null) {
			ExchangeConfigProductMappingDao exchangeConfigProductMappingDao = exchangeConfigProductMappingRepo
					.findByExchangeConfigAndProductGroupCode(locationMapping.getExchangeConfig(),
							item.getProductGroup().getProductGroupCode());
			// get product mapping by config id & product group code
			// if product mapping details is not available then throw exception
//			if (exchangeConfigProductMappingDao == null) {
//				throw new ServiceException(ConfigConstants.NO_CONFIGURATION_FOUND_FOR_REQUESTED_PRODUCT_GROUP_CODE,
//						ConfigConstants.ERR_CONFIG_088, "product group code : "
//								+ item.getProductGroup().getProductGroupCode() + " & item code : " + itemCode);
//			}
			if (exchangeConfigProductMappingDao != null) {
				if (exchangeConfigProductMappingDao.getConfigDetails()!= null) {
					JsonData configJson = MapperUtil.getObjectMapperInstance().convertValue(
							MapperUtil.getJsonFromString(exchangeConfigProductMappingDao.getConfigDetails()),
							JsonData.class);
					return MapperUtil.getObjectMapperInstance().convertValue(configJson.getData(),
							TepProductGroupConfigDetails.class);
				}
				else {
					return null;
				}
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	}


