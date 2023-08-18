/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.facade.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.request.json.ConversionRuleDetails;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.ConversionItemDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.ProductCategoryDto;
import com.titan.poss.core.dto.ProductGroupDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.constant.StockTransactionStatus;
import com.titan.poss.inventory.constant.StockTransactionType;
import com.titan.poss.inventory.dao.BinRequestDao;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.ConversionChildItemsDto;
import com.titan.poss.inventory.dto.InvWeightDetailDto;
import com.titan.poss.inventory.dto.InventoryDetailsSyncDtoExt;
import com.titan.poss.inventory.dto.InventoryItemDetailsDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferStatusEnum;
import com.titan.poss.inventory.dto.request.BinRequestCreateDto;
import com.titan.poss.inventory.dto.request.ConversionApprovalRequestDto;
import com.titan.poss.inventory.dto.request.ConversionRequestChildItemDto;
import com.titan.poss.inventory.dto.request.ConversionRequestDto;
import com.titan.poss.inventory.dto.request.ListInventoryItemsDto;
import com.titan.poss.inventory.dto.request.RequestItemSearchDto;
import com.titan.poss.inventory.dto.request.RequestOtherItemDto;
import com.titan.poss.inventory.dto.response.AvailableBinCode;
import com.titan.poss.inventory.dto.response.BinRequestDto;
import com.titan.poss.inventory.dto.response.ConversionDto;
import com.titan.poss.inventory.dto.response.ConversionRequestItemListDto;
import com.titan.poss.inventory.dto.response.ConversionRequestListDto;
import com.titan.poss.inventory.dto.response.ConversionResponseDto;
import com.titan.poss.inventory.dto.response.InventoryItemDto;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.ItemLocationDto;
import com.titan.poss.inventory.dto.response.ItemLocationListDto;
import com.titan.poss.inventory.dto.response.LocationHeaderDto;
import com.titan.poss.inventory.dto.response.StockDto;
import com.titan.poss.inventory.facade.StockManagementFacade;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.service.BinRequestService;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.InventoryDocMasterService;
import com.titan.poss.inventory.service.InventorySyncDataService;
import com.titan.poss.inventory.service.LocationService;
import com.titan.poss.inventory.service.ProductService;
import com.titan.poss.inventory.service.StockRequestService;
import com.titan.poss.inventory.service.StockTransactionService;
import com.titan.poss.product.dto.request.json.ProductGroupConfig;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Service
public class StockManagementFacadeImpl implements StockManagementFacade {

	private static final Logger LOGGER = LoggerFactory.getLogger(StockManagementFacadeImpl.class);

	@Autowired
	private InventoryDetailsService inventoryDetailsService;

	@Autowired
	private StockTransactionService stockTransactionService;

	@Autowired
	private BinRequestService binRequestService;

	@Autowired
	private InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	LocationService locationService;

	@Autowired
	private StockRequestService stockRequestService;

	@Autowired
	ProductService productService;

	@Autowired
	EngineService engineService;

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	@Autowired
	private StockManagementFacadeImpl stockManagementFacadeImp;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;
	
	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepository;

//	@Autowired
//	private StuddedSplitDetailsRepository studdedRepository;

	private static final String THIS_PRODUCT_IS_NOT_AVAILABLE_FOR_CONVERSION = "This product is not available for conversion";

	private static final String ERR_INV_011 = "ERR-INV-011";

	private static final String ERR_INV_045 = "ERR-INV-045";

	private static final String ERR_INV_046 = "ERR-INV-046";

	private static final String ERR_INV_059 = "ERR-INV-059";
	
	private static final String ERR_INV_069 = "ERR-INV-069";

	private static final String RECORD_NOT_FOUND = "Records not found";

	private static final String ERR_INV_029 = "ERR-INV-029";
	
	private static final String CONVERSION_IS_RESTRICTED_AT_LOCATION_LEVEL = "Conversion is restricted at location level";
	
	private static final String ERR_INV_063 = "ERR-INV-063";
	
	private static final String ERR_INV_067 = "ERR-INV-067";
	
	private static final String RSO_NAME = "rsoName";

	private static final String CONVERSION_PARENT = "Parent";

	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";
	
	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";

	@Value("${conv.product.studded.value}")
	private String conversionStuddedProductValue;

	@Value("${conv.item.weight}")
	private String conversionItemWeight;

	@Value("${locationCache}")
	private String locationCache;

	@Override
	public PagedRestResponse<List<ItemLocationDto>> listLocationsWithItems(List<RequestItemSearchDto> reqItem,
			List<String> ownerTypeCodes, String regionType, List<String> locationTypes, Pageable pageable)
			throws IOException {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<String> itemList = new ArrayList<>();
		List<Short> quantities = new ArrayList<>();
		List<ItemLocationDto> itemLocationDtoList = new ArrayList<>();
		Map<String, Short> requestMap = new HashMap<>();
		for (RequestItemSearchDto item : reqItem) {
			itemList.add(item.getItemCode());
			quantities.add(item.getQuantity());
			requestMap.put(item.getItemCode(), item.getQuantity());
		}
		long requestCount = itemList.size();

		Map<String, LocationHeaderDto> locationDetails = locationService.getIBTLocations(regionType, ownerTypeCodes,
				locationTypes);
		List<String> locationCodes = new ArrayList<>(locationDetails.keySet());
		LOGGER.debug("Filtered Locations - {}", locationCodes);
		if (locationCodes.isEmpty()) {
			LOGGER.debug("No location found - {},{},{}", regionType, ownerTypeCodes, locationTypes);
			throw new ServiceException("Boutique location not found", ERR_INV_029);
		}
		/*
		 * Below forEach condition and if Code condition Written by Amitabh Kumar to get
		 * UEC Location
		 */
		Boolean isUECLocationStockNotVisibleForIBTTransfer = null;
		for (String locationValue : locationCodes) {
			if (locationValue.equalsIgnoreCase("UEC")) {
				engineService.clearLocationCache(locationCache, "UEC");
				isUECLocationStockNotVisibleForIBTTransfer = engineService.getLocationDetail(locationValue)
						.getInventoryDetails().getIsUECLocationStockNotVisibleForIBTTransfer();
			}
		}
		if (isUECLocationStockNotVisibleForIBTTransfer != null && isUECLocationStockNotVisibleForIBTTransfer == true) {
			List<String> binGroupList = new ArrayList<>(Arrays.asList(BinGroupEnum.STN.toString()));
			List<ItemLocationListDto> itemsLocationsMapDto = inventoryDetailsService.getItemsAvailableLocationsList(
					itemList, authUser.getLocationCode(), requestCount, locationCodes, binGroupList);
			Map<String, Map<String, Long>> itemLocationMap = new HashMap<>();
			List<String> avoidedLocations = new ArrayList<>();
			for (ItemLocationListDto item : itemsLocationsMapDto) {
				if (!item.getLocationcode().contains("UEC")) {
					getAvoidedLocations(requestMap, itemLocationMap, avoidedLocations, item);
				}
			}
			itemLocationMap.forEach((key, value) -> {
				if (value.size() >= requestCount) {
					ItemLocationDto itemLocationDto = new ItemLocationDto(key, locationDetails.get(key).getPhoneNo(),
							locationDetails.get(key).getContactNo(), locationDetails.get(key).getAddress(),
							locationDetails.get(key).getDescription());
					itemLocationDtoList.add(itemLocationDto);
				}
			});

			int start = (int) pageable.getOffset();
			int end = (start + pageable.getPageSize() > itemLocationDtoList.size() ? itemLocationDtoList.size()
					: (start + pageable.getPageSize()));
			Page<ItemLocationDto> locationPages = new PageImpl<>(itemLocationDtoList.subList(start, end), pageable,
					itemLocationDtoList.size());
			return new PagedRestResponse<>(locationPages.getContent(), locationPages);

		} /*
			 * Below else condition and if condition code Written by Amitabh Kumar to get
			 * UEC Location
			 */
		else {
			List<String> binGroupList = new ArrayList<>(Arrays.asList(BinGroupEnum.STN.toString()));
			List<ItemLocationListDto> itemsLocationsMapDto = inventoryDetailsService.getItemsAvailableLocationsList(
					itemList, authUser.getLocationCode(), requestCount, locationCodes, binGroupList);
			Map<String, Map<String, Long>> itemLocationMap = new HashMap<>();
			List<String> avoidedLocations = new ArrayList<>();
			for (ItemLocationListDto item : itemsLocationsMapDto) {
				getAvoidedLocations(requestMap, itemLocationMap, avoidedLocations, item);

			}
			itemLocationMap.forEach((key, value) -> {
				if (value.size() >= requestCount) {
					ItemLocationDto itemLocationDto = new ItemLocationDto(key, locationDetails.get(key).getPhoneNo(),
							locationDetails.get(key).getContactNo(), locationDetails.get(key).getAddress(),
							locationDetails.get(key).getDescription());
					itemLocationDtoList.add(itemLocationDto);
				}
			});

			int start = (int) pageable.getOffset();
			int end = (start + pageable.getPageSize() > itemLocationDtoList.size() ? itemLocationDtoList.size()
					: (start + pageable.getPageSize()));
			Page<ItemLocationDto> locationPages = new PageImpl<>(itemLocationDtoList.subList(start, end), pageable,
					itemLocationDtoList.size());
			return new PagedRestResponse<>(locationPages.getContent(), locationPages);

		}
	}

	private void getAvoidedLocations(Map<String, Short> requestMap, Map<String, Map<String, Long>> itemLocationMap,
			List<String> avoidedLocations, ItemLocationListDto item) {
		if (!avoidedLocations.contains(item.getLocationcode())) {
			if (itemLocationMap.get(item.getLocationcode()) == null) {
				Map<String, Long> itemCodeQuantityMap = new HashMap<>();
				itemCodeQuantityMap.put(item.getItemCode(), item.getQuantity());
				if (item.getQuantity() >= requestMap.get(item.getItemCode())) {
					itemLocationMap.put(item.getLocationcode(), itemCodeQuantityMap);
				} else {
					avoidedLocations.add(item.getLocationcode());
				}
			} else {
				if (item.getQuantity() >= requestMap.get(item.getItemCode())) {
					itemLocationMap.get(item.getLocationcode()).put(item.getItemCode(), item.getQuantity());
				} else {
					avoidedLocations.add(item.getLocationcode());
				}
			}
		}
	}

	@Override
	public BinRequestDto createBinRequest(BinRequestCreateDto binRequestDto) {
		return binRequestService.createBinRequest(binRequestDto);
	}

	@Override
	public PagedRestResponse<List<BinRequestDto>> listBinCreationRequest(Integer reqDocNo, Pageable pageable) {
		BinRequestDao binRequest = new BinRequestDao();
		List<BinRequestDto> binRequestDtoList = new ArrayList<>();
		binRequest.setReqDocNo(reqDocNo);
		binRequest.setReqLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<BinRequestDao> criteria = Example.of(binRequest, matcher);
		Page<BinRequestDao> binRequestPageLists = binRequestService.findAllBinRequestsByCriteria(criteria, pageable);
		for (BinRequestDao binRequest1 : binRequestPageLists) {
			BinRequestDto binRequestDto = (BinRequestDto) MapperUtil.getDtoMapping(binRequest1, BinRequestDto.class);
			binRequestDto.setRequestedRemarks(binRequest1.getRequestedRemarks());
			binRequestDtoList.add(binRequestDto);
		}

		return new PagedRestResponse<>(binRequestDtoList, binRequestPageLists);
	}

	@Override
	public ListResponse<ConversionResponseDto> listConversionItems(String itemCode, String lotNumber,
			BigDecimal itemWeight, String binCode) {
		List<ConversionResponseDto> parentItem = new ArrayList<>();
		List<ConversionResponseDto> childItemList = new ArrayList<>();
		
		LocationCacheDto locationCacheDto = engineService.getLocationDetail(CommonUtil.getLocationCode());
		  Boolean isConversionRestricted =locationCacheDto.getInventoryDetails().getIsConversionRestricted();
	    	if (BooleanUtils.isTrue(isConversionRestricted)) {
	    		throw new ServiceException(CONVERSION_IS_RESTRICTED_AT_LOCATION_LEVEL, ERR_INV_063);
	    	}
	    	else {
		// call inventory details service and get inventory details object based on
		// location code,item code & lot number
		List<InventoryDetailsDaoExt> invDetails = inventoryDetailsService
				.findAllByLocationCodeAndItemCodeAndLotNumberAndSerialNumberAndBinCode(
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), itemCode, lotNumber,
						itemWeight, binCode);
		// if inventory details object is empty then throw exception
		if (invDetails.isEmpty() || invDetails.get(0).getTotalQuantity() <= 0) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}

		ProductCategoryDto categoryDao = productService.getProductCategory(invDetails.get(0).getProductCategory());
		ProductGroupDto productGroup = productService.getProductGroup(invDetails.get(0).getProductGroup());
		ProductGroupConfig productGroupConfigDetails = MapperUtil.mapJsonDataToClass(productGroup.getConfigDetails(),
				ProductGroupConfig.class);

		if (!categoryDao.getIsConversionEnabled() || !productGroupConfigDetails.getIsConversionEnabled())
			throw new ServiceException(THIS_PRODUCT_IS_NOT_AVAILABLE_FOR_CONVERSION, ERR_INV_011);
		// if bin group code is not STN/PURCFA then throw exception
		if (BinGroupEnum.STN.toString().equals(invDetails.get(0).getBinGroupCode())
				|| BinGroupEnum.PURCFA.toString().equals(invDetails.get(0).getBinGroupCode())) {
			// do nothing
		} else {
			throw new ServiceException(THIS_PRODUCT_IS_NOT_AVAILABLE_FOR_CONVERSION, ERR_INV_011);
		}

		Boolean checkLotStone = false;
		Map<String, String> productGroupList = engineService.getProductGroups(PlainStuddedEnum.S.toString(), null);

		for (Map.Entry<String, String> entry : productGroupList.entrySet()) {
			if (entry.getKey().contains(invDetails.get(0).getProductGroup())) {
				checkLotStone = true;
				break;
			}
		}
		ConversionItemDto conversionDto = new ConversionItemDto();
		if (checkLotStone) {
			// call getItemDetailsFromProductService() to get the data from item_master &
			// lot_stone_details
			conversionDto = productService.getItemDetailsForConversionFromProductService(itemCode, lotNumber);
			conversionDto.setStudded(true);
		} else {
			// call getItemMasterForConversion() to get the data from item_master as for
			// plain we dont have entry in lot_stone_details
			conversionDto = productService.getItemMasterForConversion(itemCode);
		}

		// if item code is null then throw exception
		if (conversionDto.getItemCode() == null) {
			throw new ServiceException("Records not found in Item Master", ERR_INV_046);
		}

		conversionDto.setAutoApproved(true);
		// parent item validation for conversion
		if (parentItemConversionValidation(conversionDto, invDetails.get(0), productGroupList)) {
			childItemsConversionValidation(conversionDto);
		}
		// get parent & child item
		return getItemObject(conversionDto, parentItem, childItemList, invDetails.get(0));
	    	}
	}

	private ListResponse<ConversionResponseDto> getItemObject(ConversionItemDto convItemDto,
			List<ConversionResponseDto> parentItem, List<ConversionResponseDto> childItem,
			InventoryDetailsDaoExt inventoryDetailsDaoExt) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		ConversionResponseDto lItemDto = new ConversionResponseDto();
		URLUtil urlUtil = new URLUtil();
		// copy from ConversionItemDto object to ConversionResponseDto
		BeanUtils.copyProperties(convItemDto, lItemDto);
		lItemDto.setProductCategoryCode(inventoryDetailsDaoExt.getProductCategory());
		lItemDto.setProductCategoryDesc(productCategoryList.get(inventoryDetailsDaoExt.getProductCategory()));
		lItemDto.setProductGroupDesc(productGroupList.get(inventoryDetailsDaoExt.getProductGroup()));
		lItemDto.setProductGroupCode(inventoryDetailsDaoExt.getProductGroup());
		lItemDto.setStdValue(inventoryDetailsDaoExt.getStdValue());
		lItemDto.setStdWeight(inventoryDetailsDaoExt.getStdWeight());
		lItemDto.setBinCode(inventoryDetailsDaoExt.getBinCode());
		lItemDto.setImageURL(urlUtil.getImageUrlByItemCode(convItemDto.getItemCode()));
		lItemDto.setInventoryId(inventoryDetailsDaoExt.getId());
		lItemDto.setWeightUnit(inventoryDetailsDaoExt.getWeightUnit());
		lItemDto.setLotNumber(inventoryDetailsDaoExt.getLotNumber());
		lItemDto.setCurrencyCode(inventoryDetailsDaoExt.getCurrencyCode());
		for (ConversionItemDto conversionItem : convItemDto.getChildItems()) {
			ConversionResponseDto convItem = new ConversionResponseDto();
			BeanUtils.copyProperties(conversionItem, convItem);
			convItem.setProductCategoryDesc(productCategoryList.get(convItem.getProductCategoryCode()));
			// call JsonUtils.getValueFromJsonString() to get the value of "stoneValue" key
			convItem.setProductGroupDesc(productGroupList.get(convItem.getProductGroupCode()));
			convItem.setImageURL(urlUtil.getImageUrlByItemCode(conversionItem.getItemCode()));
//			String childLotNumber = null;
//			if (convItemDto.isAutoApproved()) {
//				if (conversionItem.getLotNumber() != null
//						&& ProductGroupCodeEnum.getStuddedList().contains(conversionItem.getProductGroupCode())) {
//					childLotNumber = conversionItem.getLotNumber();
//				} 
//				else {
//					childLotNumber = engineService.getLotNumber(DocTypeEnum.OTHERRECPT);
//				}
//			}
//			convItem.setLotNumber(childLotNumber);
			childItem.add(convItem);
		}
		lItemDto.setChildItems(childItem);
		parentItem.add(lItemDto);
		return new ListResponse<>(parentItem);
	}

	private boolean parentItemConversionValidation(ConversionItemDto convItemDto,
			InventoryDetailsDaoExt inventoryDetailsDaoExt, Map<String, String> productGroupList) {
		ConversionRuleDetails convConfig = getConversionRulesDetails(convItemDto);
		if (convConfig != null) {
			String allowedLimitValue = convConfig.getAllowedLimitValue();
			String allowedLimitWeight = convConfig.getAllowedLimitWeight();
			String autoApprLimitValue = convConfig.getAutoApprovalLimitValue();
			String autoApprLimitWeight = convConfig.getAutoApprovalLimitWeight();
//			productGroupList.entrySet().stream().forEach(e -> {
//				if (e.getKey().contains(convItemDto.getProductGroupCode())) {
//					convItemDto.setAutoApproved(false);
//				}
//			});
			if (autoApprLimitValue != null && autoApprLimitWeight != null) {
				if (!(inventoryDetailsDaoExt.getStdWeight().compareTo(new BigDecimal(autoApprLimitWeight)) > 0
						&& inventoryDetailsDaoExt.getStdValue().compareTo(new BigDecimal(autoApprLimitValue)) > 0)) {
					convItemDto.setAutoApproved(false);
				}
			} else if (autoApprLimitValue != null && autoApprLimitWeight == null) {
				if (!(inventoryDetailsDaoExt.getStdValue().compareTo(new BigDecimal(autoApprLimitValue)) > 0)) {
					convItemDto.setAutoApproved(false);
				}
			} else if (autoApprLimitValue == null && autoApprLimitWeight != null) {
				if (!(inventoryDetailsDaoExt.getStdWeight().compareTo(new BigDecimal(autoApprLimitWeight)) > 0)) {
					convItemDto.setAutoApproved(false);
				}
			}
			Boolean isConversionAllowed = true;
			if (allowedLimitValue != null && allowedLimitWeight != null) {
				if (!(inventoryDetailsDaoExt.getStdWeight().compareTo(new BigDecimal(allowedLimitWeight)) > 0
						&& inventoryDetailsDaoExt.getStdValue().compareTo(new BigDecimal(allowedLimitValue)) > 0)) {
					isConversionAllowed = false;
				}
			} else if (allowedLimitValue != null && allowedLimitWeight == null) {
				if (!(inventoryDetailsDaoExt.getStdValue().compareTo(new BigDecimal(allowedLimitValue)) > 0)) {
					isConversionAllowed = false;
				}
			} else if (allowedLimitValue == null && allowedLimitWeight != null) {
				if (!(inventoryDetailsDaoExt.getStdWeight().compareTo(new BigDecimal(allowedLimitWeight)) > 0)) {
					isConversionAllowed = false;
				}
			}
			if (isConversionAllowed == false) {
				throw new ServiceException(THIS_PRODUCT_IS_NOT_AVAILABLE_FOR_CONVERSION, ERR_INV_045);
			}

		} else {
			Map<String, String> dynamicErrorValues = new HashMap<>();
			dynamicErrorValues.put("ruleType", "CONVERSIONS");

			throw new ServiceException(ConfigConstants.RESULT_IS_EMPTY_PLEASE_SET_CONFIGURATION,
					ConfigConstants.ERR_CONFIG_015, "CONVERSIONS", dynamicErrorValues);
		}
		return convItemDto.isAutoApproved();
	}

	// temporary fix. needs change in implementation
	private ConversionRuleDetails getConversionRulesDetails(ConversionItemDto convItemDto) {
		RuleRequestListDto requestListDto = new RuleRequestListDto();
		requestListDto.setProductGroupCode(convItemDto.getProductGroupCode());
		requestListDto.setProductCategoryCode(convItemDto.getProductCategoryCode());
		requestListDto.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		String ruleType = RuleTypeEnum.CONVERSIONS.toString();
		Object object = new Object();
		Boolean catchError = true;
		ConversionRuleDetails convRuleDetails = new ConversionRuleDetails();

		// if Configuration not there we shouldn't throw error
		try {
			object = engineService.getRuleFieldValues(ruleType, requestListDto);
		} catch (Exception e) {
			catchError = false;
		}
		if (catchError)
			convRuleDetails = MapperUtil.getObjectMapperInstance().convertValue(object, ConversionRuleDetails.class);

		return convRuleDetails;
	}

	private void childItemsConversionValidation(ConversionItemDto convItemDto) {
		BigDecimal stoneValue = BigDecimal.ZERO;

		// If conversion is available but child codes are not there for Plain products
		// and PJWS the request should go to EPOSS
		if (convItemDto.getChildItems().isEmpty()) {
			convItemDto.setAutoApproved(false);

		} else {
			for (ConversionItemDto childItem : convItemDto.getChildItems()) {
				// In case of plain products If child codes are available and if complexity of
				// parent code is same as complexity of child codes request should be auto
				// approved
				if (ProductGroupCodeEnum.getPlainList().contains(childItem.getProductGroupCode())
						&& !convItemDto.getComplexityCode().equals(childItem.getComplexityCode())) {
					convItemDto.setAutoApproved(false);
					break;
				}

				// Adding stone value for PJWS check
				if (ProductGroupCodeEnum.PJWS.getCode().equals(childItem.getProductGroupCode())) {
					if (childItem.getStoneValue() != null)
						stoneValue = stoneValue.add(childItem.getStoneValue());
				}
			}

			// In case of PJWS if F1 value of parent is equal to sum of F1 values of child
			// variants and complexity codes are same for parent and child codes then the
			// request should be auto approved
			if (ProductGroupCodeEnum.PJWS.getCode().equals(convItemDto.getProductGroupCode())
					&& (convItemDto.getStoneValue() != null && !convItemDto.getStoneValue().equals(stoneValue))) {
				convItemDto.setAutoApproved(false);
			}
		}
	}

	@Override
	@Transactional
	public ConversionDto createConversionItems(ConversionRequestDto conversionRequestDto) {

		ConversionDto conversionDto = new ConversionDto();
		List<StockDto> stoDtos = new ArrayList<>();
		List<InventoryDetailsDaoExt> invDetailsList = new ArrayList<>();
		BigDecimal totalWeight = BigDecimal.ZERO;
		Optional<InventoryDetailsDaoExt> invDetails = validationForBinGroupCode(conversionRequestDto);
		HashMap<String, BigDecimal> hashMap = new HashMap<>();
		HashMap<String, String> binCodeHashMap = new HashMap<>();
		HashMap<String, BigDecimal> receiveItemsMap = new HashMap<>();
		for (ConversionRequestChildItemDto receiveItem : conversionRequestDto.getReceiveItems()) {
			// calculate total measured weight of child items for conversion
			totalWeight = totalWeight.add(receiveItem.getMeasuredWeight());
			hashMap.put(receiveItem.getItemCode(), receiveItem.getMeasuredWeight());
			binCodeHashMap.put(receiveItem.getItemCode(), receiveItem.getBinCode());
			receiveItemsMap.put(receiveItem.getItemCode(), receiveItem.getFinal_value());
		}
		// sum of child items weight should be same with parent item
		// if not then throw exception
		if (invDetails.get().getStdWeight().compareTo(totalWeight) != 0) {
			throw new ServiceException("Parent Item weight is not matching with sum of child item weight",
					"ERR-INV-026");
		}

		ConversionItemDto conversionItemDto = getConversionData(conversionRequestDto, invDetails.get());

		return getConversionDto(conversionRequestDto, conversionDto, stoDtos, invDetailsList, invDetails.get(), hashMap,
				binCodeHashMap, conversionItemDto, receiveItemsMap);
	}

	private ConversionDto getConversionDto(ConversionRequestDto conversionRequestDto, ConversionDto conversionDto,
			List<StockDto> stoDtos, List<InventoryDetailsDaoExt> invDetailsList,
			InventoryDetailsDaoExt inventoryDetailsDaoExt, HashMap<String, BigDecimal> hashMap,
			HashMap<String, String> binCodeHashMap, ConversionItemDto conversionItemDto,
			HashMap<String, BigDecimal> receiveItemsMap) {
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);
		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		SyncStagingDto syncStagingDto = new SyncStagingDto();

		StockTransactionDao issueStockTransaction = new StockTransactionDao();

		// create new row in stock transaction(header) for the child items(conversion)
		StockTransactionDao receiveTransaction = new StockTransactionDao();

		List<InventoryDetailsDaoExt> childInventoryItemsList = new ArrayList<>();
		String issueStatus;
		String receiveStatus;

		if (statusMap.get(ISOFFLINE).booleanValue()) {
			issueStatus = StockTransferStatusEnum.PUBLISHED.name();
			receiveStatus = StockTransferStatusEnum.PUBLISHED.name();

			childInventoryItemsList = stockManagementFacadeImp.updateStockTransactionAndStaging(issueStatus,
					receiveStatus, issueStockTransaction, receiveTransaction, inventoryDetailsDaoExt,
					conversionRequestDto, conversionItemDto, binCodeHashMap, syncStagingDto, hashMap, invDetailsList,
					stoDtos);
			inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(),
					syncStagingDto);

		} else {
			issueStatus = StockTransferStatusEnum.ISSUED.name();
			receiveStatus = StockTransferStatusEnum.RECEIVED.name();
			childInventoryItemsList = stockManagementFacadeImp.updateStockTransactionAndStaging(issueStatus,
					receiveStatus, issueStockTransaction, receiveTransaction, inventoryDetailsDaoExt,
					conversionRequestDto, conversionItemDto, binCodeHashMap, syncStagingDto, hashMap, invDetailsList,
					stoDtos);

			// call inventoryDetailsService to update the items into inventory details table
			// if items are not available then insert new rows in inventory details table
			// if items are available then update total quantity,total value in inventory
			// details table

			inventoryDetailsService.addInventoryDetails(childInventoryItemsList, receiveTransaction.getReceivedDocNo(),
					DocTypeEnum.OTHERRECPT); // remove parent item from inventory
			inventoryDetailsService.removeFromInventoryDetails(invDetailsList, issueStockTransaction.getIssuedDocNo(),
					DocTypeEnum.OTHERISSUE);

		}

		conversionDto.setStockTransactionDetails(stoDtos);
		if (conversionRequestDto.getRequestId() != null) {
			StockRequestDao stRequestDao = stockRequestService.findStockRequestByIdAndSrcLocationCodeAndRequestType(
					conversionRequestDto.getRequestId(),
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
					StockTransactionType.CONV.toString());
			stRequestDao.setStatus(receiveStatus);
			updateStockRequestDetails(stRequestDao, conversionRequestDto, receiveItemsMap);
		}
		return conversionDto;
	}

	private void updateStockRequestDetails(StockRequestDao stRequestDao, ConversionRequestDto conversionRequestDto,
			HashMap<String, BigDecimal> receiveItemsMap) {
		if (stRequestDao != null) {
			if (stRequestDao.getOtherDetails() != null) {
				JsonData jsonData = MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString(stRequestDao.getOtherDetails()), JsonData.class);
				ObjectMapper mapper = new ObjectMapper();
				mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
				ConversionChildItemsDto convChildItems = mapper.convertValue(jsonData.getData(),
						ConversionChildItemsDto.class);

				for (RequestOtherItemDto reqItems : convChildItems.getChildItems()) {
					reqItems.setMeasuredValue(receiveItemsMap.get(reqItems.getItemCode()) == null ? BigDecimal.ZERO
							: receiveItemsMap.get(reqItems.getItemCode()));
				}

				JsonData sData = new JsonData();
				sData.setType("OTHERDETAILS");
				sData.setData(convChildItems);
				stRequestDao.setOtherDetails(MapperUtil.getStringFromJson(sData));
			}
			stockRequestService.save(stRequestDao);
			LOGGER.info("stock request>>>>>>>>" + stRequestDao);

			List<StockRequestDetailsDao> stRequestDetails = stockRequestService.findByStockRequest(stRequestDao);
			if (stRequestDetails != null && !stRequestDetails.isEmpty()) {
				for (StockRequestDetailsDao stockRequestDetails : stRequestDetails) {
					stockRequestDetails.setRequestedValue(
							receiveItemsMap.get(stockRequestDetails.getItemCode()) == null ? BigDecimal.ZERO
									: receiveItemsMap.get(stockRequestDetails.getItemCode()));
				}
				stockRequestService.saveAllStockRequestDetails(stRequestDetails);
			}
		}
	}

	/**
	 * @param issueStatus
	 * @param receiveStatus
	 * @param issueStockTransaction
	 * @param receiveTransaction
	 * @param inventoryDetailsDaoExt
	 * @param conversionRequestDto
	 * @param conversionItemDto
	 * @param binCodeHashM
	 * @param hashMap
	 * @param syncStagingDto
	 * @param invDetailsList
	 * @param stoDtos
	 * @return
	 */
	@Transactional
	public List<InventoryDetailsDaoExt> updateStockTransactionAndStaging(String issueStatus, String receiveStatus,
			StockTransactionDao issueStockTransaction, StockTransactionDao receiveTransaction,
			InventoryDetailsDaoExt inventoryDetailsDaoExt, ConversionRequestDto conversionRequestDto,
			ConversionItemDto conversionItemDto, HashMap<String, String> binCodeHashMap, SyncStagingDto syncStagingDto,
			HashMap<String, BigDecimal> hashMap, List<InventoryDetailsDaoExt> invDetailsList, List<StockDto> stoDtos) {

		CountryDetailsDto countryDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		// call createStockTransactionItem() to create new row in stock transaction and
		// details for parent item(conversion)
		issueStockTransaction = createIssueStockTransaction(inventoryDetailsDaoExt, conversionRequestDto,
				conversionItemDto, businessDayDto, countryDto, issueStatus);

		// call createReceiveStockTransaction() to create new row in stock transaction
		// and details for child items(conversion)

		// to create new childs coming as per new request weigh sp
		mapChildItemsForBangleConversion(inventoryDetailsDaoExt.getItemCode(), conversionItemDto, conversionRequestDto);
		List<InventoryDetailsDaoExt> childInventoryItemsList = createReceiveStockTransaction(inventoryDetailsDaoExt,
				conversionRequestDto, conversionItemDto.getChildItems(), hashMap, issueStockTransaction, binCodeHashMap,
				businessDayDto, countryDto, receiveTransaction, receiveStatus, conversionItemDto);
		setInventoryDetails(invDetailsList, inventoryDetailsDaoExt);

		if (issueStatus.equals(StockTransferStatusEnum.PUBLISHED.name())) {

			stockManagementFacadeImp.saveToSyncStagging(syncStagingDto, issueStockTransaction, receiveTransaction,
					invDetailsList, childInventoryItemsList);
		}

		// convert issue StockTransaction to StockDto
		StockDto stockDto = generateStockDto(issueStockTransaction, issueStatus);
		stoDtos.add(stockDto);
		// convert receive StockTransaction to StockDto
		stockDto = generateStockDto(receiveTransaction, receiveStatus);
		stoDtos.add(stockDto);
		return childInventoryItemsList;
	}

	private void mapChildItemsForBangleConversion(String parentItemCode, ConversionItemDto conversionItemDto,
			ConversionRequestDto conversionRequestDto) {
		char bangleCatCode = parentItemCode.charAt(6);
		List<ConversionItemDto> newChildItems = new ArrayList<ConversionItemDto>();
		//plain bangle addition to inventory
		if (Character.toString(bangleCatCode).toLowerCase().equals("v")
				&& BooleanUtils.isFalse(conversionItemDto.isStudded())) {
			if (conversionItemDto.getChildItems().size() != conversionRequestDto.getReceiveItems().size()) {
				// conversionItemDto.getchild = 2A
				for (ConversionRequestChildItemDto receivedItem : conversionRequestDto.getReceiveItems()) {
					// based on item master data, comparing new child from payload with item_master
					// - itemcodes
					ConversionItemDto childItemDto = conversionItemDto.getChildItems().stream()
							.filter(childItem -> receivedItem.getItemCode().equals(childItem.getItemCode())).findFirst()
							.get();
					ConversionItemDto conversionItem = (ConversionItemDto) MapperUtil.getObjectMapping(childItemDto,
							new ConversionItemDto());
					conversionItem.setStdWeight(receivedItem.getMeasuredWeight()); // setting updated weight
					if (ProductGroupCodeEnum.getPlainList().contains(conversionItem.getProductGroupCode())) {
						String childLotNumber = engineService.getLotNumber(DocTypeEnum.OTHERRECPT); // custom lot number for new childs
						receivedItem.setLotNumber(childLotNumber);															 
						conversionItem.setLotNumber(childLotNumber);
					}
					newChildItems.add(conversionItem);

				}
			}
			// adding new childs from UI to dto to be passed in for inventory addition.
			conversionItemDto.setChildItems(newChildItems);
		}
	}

	private ConversionItemDto getConversionData(ConversionRequestDto conversionRequestDto,
			InventoryDetailsDaoExt invDetails) {

		Boolean checkLotStone = false;
		Map<String, String> productGroupList = engineService.getProductGroups(PlainStuddedEnum.S.toString(), null);

		for (Map.Entry<String, String> entry : productGroupList.entrySet()) {
			if (entry.getKey().contains(invDetails.getProductGroup())) {
				checkLotStone = true;
				break;
			}
		}
		ConversionItemDto conversionDto = new ConversionItemDto();
		if (checkLotStone) {
			// call getItemDetailsFromProductService() to get the data from item_master &
			// lot_stone_details
			conversionDto = productService.getItemDetailsForConversionFromProductService(
					conversionRequestDto.getIssueItems().get(0).getItemCode(),
					conversionRequestDto.getIssueItems().get(0).getLotNumber());
		} else {
			// same for Bangle conversion(Only Plain)
			checkPlainBangleConversion(invDetails.getItemCode(), conversionRequestDto);
			// call getItemMasterForConversion() to get the data from item_master as for
			// plain we dont have entry in lot_stone_details
			conversionDto = productService
					.getItemMasterForConversion(conversionRequestDto.getIssueItems().get(0).getItemCode());

		}
		conversionDto.setAutoApproved(true);
//		validationForConversion(invDetails, conversionItemDto);
		return conversionDto;
	}

//	private void validationForConversion(InventoryDetailsDaoExt invDetails, ConversionItemDto conversionItemDto) {
//		if (parentItemConversionValidation(conversionItemDto, invDetails)) {
//			childItemsConversionValidation(conversionItemDto);
//			if (!conversionItemDto.isAutoApproved()) {
//				throw new ServiceException("Please raise a request for conversion", "ERR-INV-027");
//			}
//		} else {
//			throw new ServiceException("Please raise a request for conversion", "ERR-INV-027");
//		}
//	}

	private Optional<InventoryDetailsDaoExt> validationForBinGroupCode(ConversionRequestDto conversionRequestDto) {
		// throw exception if user wants to change bin code of parent item
		if (!StringUtils.isBlank(conversionRequestDto.getIssueItems().get(0).getBinCode())) {
			throw new ServiceException("Parent item bin code should be empty", "ERR-INV-013");
		}

		// call inventory details service and get inventory details object based on
		// location code,item code & lot number
		Optional<InventoryDetailsDaoExt> invDetails = inventoryDetailsService
				.findById(conversionRequestDto.getIssueItems().get(0).getInventoryId());

		// if inventory details object is empty then throw exception
		if (!invDetails.isPresent()) {
			throw new ServiceException(
					"Parent Item Code is not found in inventory. So conversion cannot be done for this item",
					"ERR-PRO-048");
		}

		// if bin group code is not STN/PURCFA then throw exception
		if (BinGroupEnum.STN.toString().equals(invDetails.get().getBinGroupCode())
				|| BinGroupEnum.PURCFA.toString().equals(invDetails.get().getBinGroupCode())) {
			// do nothing
		} else {
			throw new ServiceException(THIS_PRODUCT_IS_NOT_AVAILABLE_FOR_CONVERSION, ERR_INV_011);
		}
		return invDetails;
	}

	private void setInventoryDetails(List<InventoryDetailsDaoExt> invDetailsList,
			InventoryDetailsDaoExt inventoryDetailsDaoExt) {
		InventoryDetailsDaoExt inventoryDetails = (InventoryDetailsDaoExt) MapperUtil
				.getDtoMapping(inventoryDetailsDaoExt, InventoryDetailsDaoExt.class);

		// set total quantity,total weight & total value for parent item
		inventoryDetails.setTotalQuantity((short) 1);
		inventoryDetails.setTotalWeight(inventoryDetails.getStdWeight());
		inventoryDetails.setTotalValue(inventoryDetails.getStdValue());

		invDetailsList.add(inventoryDetails);
	}

	private StockDto generateStockDto(StockTransactionDao stockTransaction, String stockTransactionStatus) {
		StockDto stockDto;
		stockDto = (StockDto) MapperUtil.getDtoMapping(stockTransaction, StockDto.class);
		stockDto.setOrderType(stockTransaction.getTransactionType());
		stockDto.setSrcDocDate(stockTransaction.getIssuedDocDate());
		stockDto.setSrcFiscalYear(Integer.valueOf(stockTransaction.getIssuedFiscalYear()));
		stockDto.setSrcLocationCode(stockTransaction.getLocationCode());
		stockDto.setSrcDocNo(stockTransaction.getIssuedDocNo());
		if (stockTransactionStatus.equals(StockTransactionStatus.ISSUED.name())) {
			stockDto.setDestDocDate(null);
			stockDto.setDestLocationCode(null);
			stockDto.setDestDocNo(null);
			stockDto.setTotalMeasuredQuantity(stockTransaction.getTotalIssuedQuantity());
			stockDto.setTotalMeasuredValue(stockTransaction.getTotalIssuedValue());
			stockDto.setTotalMeasuredWeight(stockTransaction.getTotalIssuedWeight());
			stockDto.setTotalAvailableQuantity(stockTransaction.getTotalReceivedQuantity());
			stockDto.setTotalAvailableValue(stockTransaction.getTotalReceivedValue());
			stockDto.setTotalAvailableWeight(stockTransaction.getTotalReceivedWeight());
		} else if (stockTransactionStatus.equals(StockTransactionStatus.RECEIVED.name())) {
			stockDto.setSrcDocNo(stockTransaction.getIssuedDocNo());
			stockDto.setDestDocDate(stockTransaction.getReceivedDocDate());
			stockDto.setDestLocationCode(stockTransaction.getLocationCode());
			stockDto.setDestDocNo(stockTransaction.getReceivedDocNo());
			stockDto.setTotalMeasuredQuantity(stockTransaction.getTotalReceivedQuantity());
			stockDto.setTotalMeasuredValue(stockTransaction.getTotalReceivedValue());
			stockDto.setTotalMeasuredWeight(stockTransaction.getTotalReceivedWeight());
			stockDto.setTotalAvailableQuantity(stockTransaction.getTotalIssuedQuantity());
			stockDto.setTotalAvailableValue(stockTransaction.getTotalIssuedValue());
			stockDto.setTotalAvailableWeight(stockTransaction.getTotalIssuedWeight());
		}
		return stockDto;
	}

	private StockTransactionDao createIssueStockTransaction(InventoryDetailsDaoExt inventoryDetailsDaoExt,
			ConversionRequestDto conversionRequest, ConversionItemDto conversionItem, BusinessDayDto businessDayDto,
			CountryDetailsDto countryDto, String issueStatus) {
		Map<String, String> otherDetails = new HashMap<>();
		otherDetails.put(RSO_NAME, conversionRequest.getRsoName());
		// create new row in stock transaction(header) table for the parent
		// item(conversion)
		StockTransactionDao stockTransaction = new StockTransactionDao();
		// copy from InventoryDetails object to StockTransaction object with excluding
		// id column of inventory details table
		BeanUtils.copyProperties(inventoryDetailsDaoExt, stockTransaction, "id");
		stockTransaction.setId(null);
		stockTransaction.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		stockTransaction.setIssuedDocDate(businessDayDto.getBusinessDate());
		// call inventoryDocMasterService to get stock issue src doc no
		Integer issueDocNo = inventoryDocMasterService.getDocNumber(countryDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.OTHERISSUE.toString());
		stockTransaction.setIssuedDocNo(issueDocNo);
		stockTransaction.setIssuedFiscalYear(countryDto.getFiscalYear().shortValue());
		stockTransaction.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		stockTransaction.setStatus(issueStatus);
		stockTransaction.setTotalIssuedQuantity((short) 1);
		stockTransaction.setTotalIssuedValue(conversionItem.getStdValue());
		stockTransaction.setTotalIssuedWeight(conversionRequest.getIssueItems().get(0).getMeasuredWeight());
		stockTransaction.setTransactionType(StockTransactionType.CONV.toString());
		stockTransaction.setTotalReceivedQuantity((short) 0);
		stockTransaction.setTotalReceivedValue(BigDecimal.ZERO);
		stockTransaction.setTotalReceivedWeight(BigDecimal.ZERO);
		stockTransaction.setOtherDetails(MapperUtil.getStringFromJson(otherDetails));
		stockTransaction = stockTransactionService.updateStockTransaction(stockTransaction);
		// create new row in stock transaction details(details) table for the parent
		// item(conversion)
		LOGGER.info("StockTransactionConv :: " + stockTransaction.toString());
		StockTransactionDetailsDao stockTransactionDetails = new StockTransactionDetailsDao();
		// copy from InventoryDetails object to StockTransactionDetails object with
		// excluding id column of inventory details table
		BeanUtils.copyProperties(inventoryDetailsDaoExt, stockTransactionDetails, "id");
		stockTransactionDetails.setIssuedBinCode(inventoryDetailsDaoExt.getBinCode());
		stockTransactionDetails.setIssuedQuantity((short) 1);
		stockTransactionDetails.setIssuedValue(conversionItem.getStdValue());
		stockTransactionDetails.setIssuedWeight(conversionRequest.getIssueItems().get(0).getMeasuredWeight());
		stockTransactionDetails.setInventoryId(conversionRequest.getIssueItems().get(0).getInventoryId());
		stockTransactionDetails.setStatus(issueStatus);
		stockTransactionDetails.setStockTransaction(stockTransaction);
		stockTransactionDetails.setItemDetails(inventoryDetailsDaoExt.getItemDetails());
		stockTransactionService.saveOrUpdateStockTransactionDetails(stockTransactionDetails);
		LOGGER.info("StockTransactionDetailsConv :: " + stockTransactionDetails.toString());
		return stockTransaction;
	}

	private List<InventoryDetailsDaoExt> createReceiveStockTransaction(InventoryDetailsDaoExt inventoryDetailsDaoExt,
			ConversionRequestDto conversionRequest, List<ConversionItemDto> childList,
			HashMap<String, BigDecimal> hashMap, StockTransactionDao issueTransaction,
			HashMap<String, String> binCodeHashMap, BusinessDayDto businessDayDto, CountryDetailsDto countryDto,
			StockTransactionDao receiveTransaction, String receiveStatus, ConversionItemDto conversionParentItemDto) {
		Map<String, String> otherDetails = new HashMap<>();
		otherDetails.put(RSO_NAME, conversionRequest.getRsoName());
		BigDecimal totalReceiveValue = BigDecimal.ZERO;
		BigDecimal totalReceiveWeight = BigDecimal.ZERO;
		List<StockTransactionDetailsDao> stockTransactionDetailsList = new ArrayList<>();
		List<InventoryDetailsDaoExt> childInventoryItemsList = new ArrayList<>();

		// copy from InventoryDetails object to StockTransaction object with excluding
		// id column of inventory details table
		BeanUtils.copyProperties(inventoryDetailsDaoExt, receiveTransaction, "id");
		receiveTransaction.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		receiveTransaction.setIssuedDocDate(businessDayDto.getBusinessDate());
		receiveTransaction.setIssuedFiscalYear(countryDto.getFiscalYear().shortValue());
		receiveTransaction.setIssuedDocNo(issueTransaction.getIssuedDocNo());
		receiveTransaction.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		receiveTransaction.setPrevTransaction(issueTransaction);
		receiveTransaction.setReceivedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		receiveTransaction.setReceivedDocDate(businessDayDto.getBusinessDate());
		receiveTransaction.setOrgCode(issueTransaction.getOrgCode());
		// call inventoryDocMasterService to get stock issue receive doc no
		Integer receiveDocNo = inventoryDocMasterService.getDocNumber(countryDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.OTHERRECPT.toString());
		receiveTransaction.setReceivedDocNo(receiveDocNo);
		receiveTransaction.setReceivedFiscalYear(countryDto.getFiscalYear().shortValue());
		receiveTransaction.setStatus(receiveStatus);
		receiveTransaction.setTotalIssuedQuantity((short) conversionRequest.getReceiveItems().size());
		receiveTransaction.setTotalIssuedValue(BigDecimal.ZERO);
		receiveTransaction.setTotalIssuedWeight(BigDecimal.ZERO);
		receiveTransaction.setTotalReceivedQuantity((short) conversionRequest.getReceiveItems().size());
		receiveTransaction.setTotalReceivedValue(BigDecimal.ZERO);
		receiveTransaction.setTotalReceivedWeight(BigDecimal.ZERO);
		receiveTransaction.setTransactionType(StockTransactionType.CONV.toString());
		receiveTransaction.setOtherDetails(MapperUtil.getStringFromJson(otherDetails));
		receiveTransaction = stockTransactionService.updateStockTransaction(receiveTransaction);

		LOGGER.debug("Approved {}", conversionParentItemDto.isAutoApproved());

		for (ConversionItemDto conversionItem : childList) {

			InventoryDetailsDaoExt childInventoryItem = new InventoryDetailsDaoExt();

			StockTransactionDetailsDao stockTransactionDetails = new StockTransactionDetailsDao();
			// copy from InventoryDetails object to StockTransactionDetails object with
			// excluding id column of inventory details table
			BeanUtils.copyProperties(inventoryDetailsDaoExt, stockTransactionDetails, "id", "productCategory");
			// copy from ConversionItemDto object to StockTransactionDetails object with
			BeanUtils.copyProperties(conversionItem, stockTransactionDetails);
			stockTransactionDetails.setIssuedBinCode(inventoryDetailsDaoExt.getBinCode());
			stockTransactionDetails.setIssuedQuantity((short) 0);
			stockTransactionDetails.setIssuedValue(BigDecimal.ZERO);
			stockTransactionDetails.setIssuedWeight(BigDecimal.ZERO);
			stockTransactionDetails.setReceivedBinCode(inventoryDetailsDaoExt.getBinCode());
			stockTransactionDetails.setReceivedQuantity((short) 1);
			stockTransactionDetails.setReceivedValue(conversionItem.getStdValue());
			
			stockTransactionDetails.setReceivedBinCode(binCodeHashMap.get(conversionItem.getItemCode()));
			stockTransactionDetails.setStatus(receiveStatus);
			stockTransactionDetails.setStockTransaction(receiveTransaction);
			stockTransactionDetails.setInventoryId(UUID.randomUUID().toString());
			
			stockTransactionDetails.setProductCategory(conversionItem.getProductCategoryCode());
			stockTransactionDetails.setStockInwardDate(inventoryDetailsDaoExt.getStockInwardDate());

		
			BeanUtils.copyProperties(inventoryDetailsDaoExt, childInventoryItem, "id", "productCategory");
			BeanUtils.copyProperties(conversionItem, childInventoryItem);
			// get lot number for child items
//			if (!(Character.toString(inventoryDetailsDaoExt.getItemCode().charAt(6)).toLowerCase().equals("v")
//					&& ProductGroupCodeEnum.getPlainList().contains(conversionItem.getProductGroupCode()))
//					|| ProductGroupCodeEnum.getStuddedList().contains(conversionItem.getProductGroupCode())) {
	
			for (ConversionRequestChildItemDto conversionRequestItemDto : conversionRequest.getReceiveItems()) {
				// get lot number for child items
				if (!(Character.toString(inventoryDetailsDaoExt.getItemCode().charAt(6)).toLowerCase().equals("v")
						&& ProductGroupCodeEnum.getPlainList().contains(conversionItem.getProductGroupCode()))
						|| ProductGroupCodeEnum.getStuddedList().contains(conversionItem.getProductGroupCode())
						|| (Character.toString(inventoryDetailsDaoExt.getItemCode().charAt(6)).toLowerCase().equals("v")
								&& ProductGroupCodeEnum.getPlainList().contains(conversionItem.getProductGroupCode())
								&& conversionItem.getLotNumber().equals(conversionRequestItemDto.getLotNumber()))) {
					if (conversionItem.getItemCode().equals(conversionRequestItemDto.getItemCode())) {
						String childLotNumber = conversionItem.getLotNumber();
						if (conversionParentItemDto.isAutoApproved()) {
							if (conversionItem.getLotNumber() != null && ProductGroupCodeEnum.getStuddedList()
									.contains(conversionItem.getProductGroupCode())) {
								childLotNumber = conversionItem.getLotNumber();
							} else {
								if (conversionItem.getLotNumber() == null) {
									childLotNumber = engineService.getLotNumber(DocTypeEnum.OTHERRECPT);
									conversionItem.setLotNumber(childLotNumber);
								}
							}
						}
						childInventoryItem.setLotNumber(childLotNumber);
						stockTransactionDetails.setLotNumber(childLotNumber);
						childInventoryItem.setStdWeight(conversionRequestItemDto.getMeasuredWeight());
						childInventoryItem.setMakingCharges(conversionRequestItemDto.getMakingCharges());
						childInventoryItem.setMakingChargesPct(conversionRequestItemDto.getMakingChargesPct());
						childInventoryItem.setTotalWeight(conversionRequestItemDto.getMeasuredWeight());
						childInventoryItem
								.setSerialNumber(String.valueOf(conversionRequestItemDto.getMeasuredWeight()));
						stockTransactionDetails.setReceivedWeight(conversionRequestItemDto.getMeasuredWeight());

						JsonNode root;
						JsonNode dataNode = null;
						InvWeightDetailDto itemDetailsImp = null;
						try {
							root = MapperUtil.getObjectMapperInstance()
									.readTree(inventoryDetailsDaoExt.getTotalWeightDetails());
							dataNode = root.path("data");
							itemDetailsImp = MapperUtil.getObjectMapperInstance().convertValue(dataNode,
									InvWeightDetailDto.class);
							BigDecimal stoneWt = BigDecimal.ZERO;
							itemDetailsImp.setGoldWeight(conversionRequestItemDto.getMeasuredWeight());
							if (conversionItem.isStudded()) {
								stoneWt = conversionItem.getStoneWeight().divide(new BigDecimal(5));
								if (conversionItem.getPricingGroupType().equals("GOLDSTUDDED")) {
									itemDetailsImp.setGoldWeight(
											conversionRequestItemDto.getMeasuredWeight().subtract(stoneWt));
									itemDetailsImp.setPlatinumWeight(BigDecimal.ZERO);
								} else if (conversionItem.getPricingGroupType().equals("PLATINUMSTUDDED")) {
									itemDetailsImp.setPlatinumWeight(conversionRequestItemDto.getMeasuredWeight());
									itemDetailsImp.setGoldWeight(BigDecimal.ZERO);
								}
							}
							itemDetailsImp.setStoneWeight(stoneWt);
							itemDetailsImp.setSilverWeight(BigDecimal.ZERO);
							itemDetailsImp.setMaterialWeight(BigDecimal.ZERO);
							itemDetailsImp.setDiamondWeight(BigDecimal.ZERO);

							JsonData jsonData = new JsonData();
							jsonData.setType("WEIGHT_DETAILS");
							jsonData.setData(itemDetailsImp);
							childInventoryItem.setTotalWeightDetails(MapperUtil.getStringFromJson(jsonData));

						} catch (IOException e) {
							LOGGER.info("UNABLE_TO_PARSE_JSON>>>>>>>>>>>" + e);
						}
						// set making charges in Studded split repo
						// TODO: Studded split save
//					StuddedSplitDetailsDao studded = studdedRepository.findDetailAndItemCode("CDTL",
//							childInventoryItem.getItemCode());
//					studded.setMakingCharges(childInventoryItem.getMakingCharges());
//					studdedRepository.save(studded);
					}
				}
			}

			
			// calculate totalReceiveValue,totalReceiveWeight
			totalReceiveValue = totalReceiveValue.add(stockTransactionDetails.getReceivedValue());
			totalReceiveWeight = totalReceiveWeight.add(stockTransactionDetails.getReceivedWeight());
			
			stockTransactionDetailsList.add(stockTransactionDetails);
			childInventoryItem.setProductGroup(conversionItem.getProductGroupCode());
			childInventoryItem.setProductCategory(conversionItem.getProductCategoryCode());
			childInventoryItem.setId(stockTransactionDetails.getInventoryId());
			childInventoryItem.setCreatedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			childInventoryItem.setCreatedDate(new Date());
			childInventoryItem.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			childInventoryItem.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			childInventoryItem.setLastModifiedDate(new Date());

			childInventoryItem.setTotalQuantity((short) 1);
			childInventoryItem.setTotalValue(conversionItem.getStdValue());
			// childInventoryItem.setTotalWeight(hashMap.get(conversionItem.getItemCode()));
		
			childInventoryItem.setOrgCode(receiveTransaction.getOrgCode());
			childInventoryItem.setBinModifiedDate(new Date());
			childInventoryItem.setBinCode(binCodeHashMap.get(conversionItem.getItemCode()));
			childInventoryItem.setIsHallmarked(inventoryDetailsDaoExt.getIsHallmarked());
			childInventoryItem.setStockInwardDate(inventoryDetailsDaoExt.getStockInwardDate());
			childInventoryItem.setDocNumber(receiveDocNo);
			childInventoryItem.setDocType(StockTransactionType.CONV.toString());
			childInventoryItem.setFiscalYear(countryDto.getFiscalYear().shortValue());
			childInventoryItem.setActionType("ADD");
			try {
				JsonNode jsonNode = MapperUtil.getObjectMapperInstance()
						.readTree(inventoryDetailsDaoExt.getItemDetails());
				conversionRequest.getReceiveItems().forEach(receive -> {

					if (receive.getItemCode().equals(conversionItem.getItemCode()) && receive.getLotNumber() != null
							&& receive.getLotNumber().equals(conversionItem.getLotNumber())) {
						((ObjectNode) jsonNode).put("sold", receive.getSold());
					}
				});
				childInventoryItem.setItemDetails(MapperUtil.getStringFromJson(jsonNode));
			} catch (Exception ex) {
				Map<String, Boolean> item = new HashMap<>();
				conversionRequest.getReceiveItems().forEach(receive -> {
					if (receive.getItemCode().equals(conversionItem.getItemCode()) && receive.getLotNumber() != null
							&& receive.getLotNumber().equals(conversionItem.getLotNumber())) {
						item.put("sold", receive.getSold());
					}
				});
				Map<String, Object> itemDetails = new LinkedHashMap<>();
				itemDetails.put("type", "ITEM_DETAILS");
				itemDetails.put("data", item);
				childInventoryItem.setItemDetails(MapperUtil.getStringFromJson(itemDetails));
			}

			Object itemDetailsObject = MapperUtil.getJsonFromString(inventoryDetailsDaoExt.getItemDetails());
			childInventoryItem.setItemDetails(MapperUtil.getStringFromJson(itemDetailsObject));
			stockTransactionDetails.setItemDetails(childInventoryItem.getItemDetails());
			childInventoryItemsList.add(childInventoryItem);
		}
		// call stockTransactionService to add item level transaction
		stockTransactionService.addStockTransactionDetails(stockTransactionDetailsList);
		// update total received value & total received weight
		receiveTransaction.setTotalReceivedValue(totalReceiveValue);
		receiveTransaction.setTotalReceivedWeight(totalReceiveWeight);
		receiveTransaction.setTotalIssuedValue(totalReceiveValue);
		receiveTransaction.setTotalIssuedWeight(BigDecimal.ZERO);
		// update stock transaction(header) table with updated total received value &
		// total received weight
		receiveTransaction = stockTransactionService.updateStockTransaction(receiveTransaction);
		return childInventoryItemsList;
	}

	@Override
	public ListResponse<AvailableBinCode> getAvailableBinCodesByLocation() {
		List<AvailableBinCode> availableBinCodes = inventoryDetailsService
				.getAvailableBinCodesByLocation(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		return new ListResponse<>(availableBinCodes);
	}

	@Override
	public PagedRestResponse<List<ConversionRequestListDto>> listConversionRequest(Integer srcDocNo,
			Pageable pageable) {
		List<ConversionRequestListDto> conversionRequestListDtos = new ArrayList<>();
		List<String> statusList = new ArrayList<>();
		statusList.add(StockRequestStatusEnum.APVL_PENDING.toString());
		statusList.add(StockRequestStatusEnum.APPROVED.toString());
		statusList.add(StockRequestStatusEnum.ACKNOWLEDGE_PENDING.toString());
		statusList.add(StockRequestStatusEnum.APVL_REJECTED.toString());
		Page<StockRequestDao> stockRequestPage = null;
		if (srcDocNo != null) {
			stockRequestPage = stockRequestService.findByRequestTypeAndReqDocNoAndSrcLocationCodeAndStatusIn(
					StockTransactionType.CONV.toString(), srcDocNo,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), statusList, pageable);
		} else {
			// call stock request service impl to get the page of stock request(header)
			stockRequestPage = stockRequestService.findAllByRequestTypeAndMultipleStatusAndSrcLocationCode(
					StockTransactionType.CONV.toString(), statusList,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), pageable);
		}

		// convert Page object to ConversionRequestListDto object
		prepareConversionDto(conversionRequestListDtos, stockRequestPage);
		return new PagedRestResponse<>(conversionRequestListDtos, stockRequestPage);
	}

	private void prepareConversionDto(List<ConversionRequestListDto> conversionRequestListDtos,
			Page<StockRequestDao> stockRequestPage) {
		for (StockRequestDao stockRequest : stockRequestPage) {
			ConversionRequestListDto conversionDto = prepareConversionListDto(stockRequest);
			conversionRequestListDtos.add(conversionDto);
		}
	}

	private ConversionRequestListDto prepareConversionListDto(StockRequestDao stockRequest) {
		ConversionRequestListDto conversionDto = new ConversionRequestListDto();
		conversionDto.setId(stockRequest.getId());
		conversionDto.setCreatedDate(stockRequest.getCreatedDate());
		conversionDto.setSrcDocNo(stockRequest.getReqDocNo());
		conversionDto.setStatus(stockRequest.getStatus());
		conversionDto.setTotalQuantity(stockRequest.getTotalRequestedQuantity());
		conversionDto.setTotalValue(stockRequest.getTotalRequestedValue());
		conversionDto.setTotalWeight(stockRequest.getTotalRequestedWeight());
		conversionDto.setApprovalRemarks(stockRequest.getApprovalRemarks());
		if (stockRequest.getOtherDetails() != null)
			conversionDto.setOtherDetails(MapperUtil.getJsonFromString(stockRequest.getOtherDetails()));
		return conversionDto;
	}

	@Override
	public PagedRestResponse<List<ConversionRequestItemListDto>> listConversionRequestItem(Integer id,
			Pageable pageable) {
		List<ConversionRequestItemListDto> conversionList = new ArrayList<>();
		URLUtil urlUtil = new URLUtil();
		// call generateCriteriaForConversionRequestItems() to get example matcher of
		// StockRequestDetails
		Example<StockRequestDetailsDao> stockRequestDetailsExample = generateCriteriaForConversionRequestItems(id);

		// call stock request service impl to get the page of stock request details(item
		// details)
		Page<StockRequestDetailsDao> stockRequestDetailsPage = stockRequestService
				.findAllStockRequestItems(stockRequestDetailsExample, pageable);

		// convert Page object to ConversionRequestItemListDto object
		generateConversionItemDetails(conversionList, urlUtil, stockRequestDetailsPage);

		return new PagedRestResponse<>(conversionList, stockRequestDetailsPage);
	}

	private List<ConversionRequestItemListDto> generateConversionItemDetails(
			List<ConversionRequestItemListDto> conversionList, URLUtil urlUtil,
			Page<StockRequestDetailsDao> stockRequestDetailsPage) {

		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		for (StockRequestDetailsDao stockRequestDetails : stockRequestDetailsPage) {
			ConversionRequestItemListDto conversionRequestItemListDto = new ConversionRequestItemListDto();
			conversionRequestItemListDto.setBinCode(stockRequestDetails.getBinCode());
			conversionRequestItemListDto.setItemCode(stockRequestDetails.getItemCode());
			conversionRequestItemListDto
					.setItemDetails(MapperUtil.getJsonFromString(stockRequestDetails.getItemDetails()));
			conversionRequestItemListDto.setImageURL(urlUtil.getImageUrlByItemCode(stockRequestDetails.getItemCode()));
			conversionRequestItemListDto.setLotNumber(stockRequestDetails.getLotNumber());
			conversionRequestItemListDto.setMfgDate(stockRequestDetails.getMfgDate());
			conversionRequestItemListDto.setProductCategory(stockRequestDetails.getProductCategory());
			conversionRequestItemListDto.setProductGroup(stockRequestDetails.getProductGroup());
			conversionRequestItemListDto.setStdValue(stockRequestDetails.getStdValue());
			conversionRequestItemListDto.setStdWeight(stockRequestDetails.getStdWeight());
			conversionRequestItemListDto.setInventoryId(stockRequestDetails.getInventoryId());
			conversionRequestItemListDto.setWeightUnit(stockRequestDetails.getWeightUnit());
			conversionRequestItemListDto
					.setProductCategoryDesc(productCategoryList.get(stockRequestDetails.getProductCategory()));
			conversionRequestItemListDto
					.setProductGroupDesc(productGroupList.get(stockRequestDetails.getProductGroup()));

			Map<String, String> studdedProductGroups = engineService.getProductGroups(PlainStuddedEnum.S.toString(),
					null);

			for (Map.Entry<String, String> entry : studdedProductGroups.entrySet()) {
				if (entry.getKey().contains(stockRequestDetails.getProductGroup())) {
					conversionRequestItemListDto.setStudded(true);
					break;
				}
			}
			conversionList.add(conversionRequestItemListDto);
		}
		return conversionList;
	}

	private Example<StockRequestDetailsDao> generateCriteriaForConversionRequestItems(Integer id) {
		StockRequestDao stockRequest = new StockRequestDao();
		stockRequest.setId(id);
		StockRequestDetailsDao stockRequestDetails = new StockRequestDetailsDao();
		stockRequestDetails.setStockRequest(stockRequest);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockRequestDetails, matcher);
	}

	@Override
	@Transactional
	public ConversionDto updateConversionRequest(Integer id,
			ConversionApprovalRequestDto conversionApprovalRequestDto) {
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);
		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		String status;
		if (statusMap.get(ISOFFLINE).booleanValue()) {
			status = StockRequestStatusEnum.PUBLISHED.name();
		} else {
			status = StockRequestStatusEnum.CLOSED.name();
		}
		ConversionDto conversionDto = new ConversionDto();
		Map<String, String> otherDetails = new HashMap<>();
		CountryDetailsDto countryDetails = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		otherDetails.put(RSO_NAME, conversionApprovalRequestDto.getRsoName());
		BigDecimal totalReceiveValue = BigDecimal.ZERO;
		BigDecimal totalReceiveWeight = BigDecimal.ZERO;
		List<InventoryDetailsDaoExt> issueItems = new ArrayList<>();
		List<InventoryDetailsDaoExt> receiveItems = new ArrayList<>();
		StockTransactionDao issueStockTransaction = new StockTransactionDao();
		StockTransactionDao receiveStockTransaction = new StockTransactionDao();
		List<StockDto> stockDtos = new ArrayList<>();
		int count = 0;
		Optional<StockRequestDao> stRequest = stockRequestService.findByIdAndRequestType(id,
				StockTransactionType.CONV.toString());
		validationForConfirmCoversion(stRequest);
		// get list of stock request details by stock request object
		List<StockRequestDetailsDao> stRequestDetailsList = stockRequestService.findByStockRequest(stRequest.get());
		Date date = new Date();
		for (StockRequestDetailsDao stockRequestDetails : stRequestDetailsList) {
			Optional<InventoryDetailsDaoExt> invDetails = inventoryDetailsService
					.findById(stockRequestDetails.getInventoryId());
			if (invDetails.isPresent() && (invDetails.get().getStockInwardDate() != null))
				date = invDetails.get().getStockInwardDate();
		}
		for (StockRequestDetailsDao stockRequestDetails : stRequestDetailsList) {
			Optional<InventoryDetailsDaoExt> invDetails = inventoryDetailsService
					.findById(stockRequestDetails.getInventoryId());
			String itemType = JsonUtils.getValueFromJsonString(
					MapperUtil.getJsonFromString(stockRequestDetails.getItemDetails()), "itemType");
			// check if the parent item is still in inventory
			// if not available then throw exception
			if (CONVERSION_PARENT.equalsIgnoreCase(itemType) && !invDetails.isPresent()) {
				throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
			}
			if (invDetails.isPresent()) {
				InventoryDetailsDaoExt inventoryDetails = null;
				inventoryDetails = (InventoryDetailsDaoExt) MapperUtil.getDtoMapping(invDetails.get(),
						InventoryDetailsDaoExt.class);
				issueStockTransaction = createConvIssueStockTransactionItem(otherDetails, issueStockTransaction,
						inventoryDetails, countryDetails, businessDayDto);
				// reduce total quantity,total weight & total value for parent item
				inventoryDetails.setTotalQuantity((short) 1);
				inventoryDetails.setTotalWeight(inventoryDetails.getStdWeight());
				inventoryDetails.setTotalValue(inventoryDetails.getStdValue());
				issueItems.add(inventoryDetails);
			} else {
				String childLotNumber = null;
				count++;
				if (ProductGroupCodeEnum.getStuddedList().contains(stockRequestDetails.getProductGroup())) {
					childLotNumber = stockRequestDetails.getLotNumber() + "_PS";
				} else {
					childLotNumber = engineService.getLotNumber(DocTypeEnum.OTHERRECPT);
				}
				stockRequestDetails.setLotNumber(childLotNumber);
				receiveStockTransaction = createConvReceiveStockTransactionItem(otherDetails, issueStockTransaction,
						receiveStockTransaction, count, stockRequestDetails, date, countryDetails, businessDayDto);
				totalReceiveValue = totalReceiveValue.add(receiveStockTransaction.getTotalReceivedValue());
				totalReceiveWeight = totalReceiveWeight.add(receiveStockTransaction.getTotalReceivedWeight());
				InventoryDetailsDaoExt inDetails;
				inDetails = (InventoryDetailsDaoExt) MapperUtil.getDtoMapping(stockRequestDetails,
						InventoryDetailsDaoExt.class);
				inDetails.setCreatedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
				inDetails.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
				inDetails.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
				inDetails.setLastModifiedDate(new Date());
				inDetails.setStdWeight(stockRequestDetails.getRequestedWeight());
				inDetails.setSerialNumber(String.valueOf(stockRequestDetails.getRequestedWeight()));
				inDetails.setTotalQuantity((short) 1);
				inDetails.setTotalValue(stockRequestDetails.getStdValue());
				inDetails.setTotalWeight(stockRequestDetails.getRequestedWeight());
				inDetails.setOrgCode(CommonConstants.ORG_CODE);
				inDetails.setBinModifiedDate(new Date());
				inDetails.setLotNumber(childLotNumber);
				inDetails.setStockInwardDate(date);
				receiveItems.add(inDetails);
			}
			stockRequestDetails.setStatus(status);
		}
		if (receiveStockTransaction.getIssuedDocNo() == 0) {
			receiveStockTransaction.setIssuedDocNo(issueStockTransaction.getIssuedDocNo());
		}
		if (receiveStockTransaction.getPrevTransaction() == null) {
			receiveStockTransaction.setPrevTransaction(issueStockTransaction);
		}

		if (statusMap.get(ISOFFLINE).booleanValue()) {
			stockManagementFacadeImp.saveToSyncStagging(syncStagingDto, issueStockTransaction, receiveStockTransaction,
					issueItems, receiveItems);
			inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(),
					syncStagingDto);
		} else {
			// remove parent item from inventory
			inventoryDetailsService.removeFromInventoryDetails(issueItems, issueStockTransaction.getIssuedDocNo(),
					DocTypeEnum.OTHERISSUE);
			// call inventoryDetailsService to update the items into inventory details table
			// if items are not available then insert new rows in inventory details table
			// if items are available then update total quantity,total value in inventory
			// details table
			inventoryDetailsService.addInventoryDetails(receiveItems, receiveStockTransaction.getReceivedDocNo(),
					DocTypeEnum.OTHERRECPT);
		}

		LOGGER.debug("total val {}", totalReceiveValue);
		LOGGER.debug("total weight {}", totalReceiveWeight);
		receiveStockTransaction.setTotalReceivedValue(totalReceiveValue);
		receiveStockTransaction.setTotalReceivedWeight(totalReceiveWeight);
		receiveStockTransaction = stockTransactionService.updateStockTransaction(receiveStockTransaction);
		// convert StockTransaction to StockDto
		StockDto stockDto = generateStockDto(issueStockTransaction, StockTransactionStatus.ISSUED.name());
		stockDtos.add(stockDto);
		// convert StockTransaction to StockDto
		stockDto = generateStockDto(receiveStockTransaction, StockTransactionStatus.RECEIVED.name());
		stockDtos.add(stockDto);
		conversionDto.setStockTransactionDetails(stockDtos);
		// update stock request status as CLOSED
		stRequest.get().setStatus(status);
		stRequest.get().setIssuedDate(businessDayDto.getBusinessDate());
		stockRequestService.save(stRequest.get());
		// update stock request details status as CLOSED
		stockRequestService.saveAllStockRequestDetails(stRequestDetailsList);
		return conversionDto;
	}

	/**
	 * @param receiveItems
	 * @param issueItems
	 * @param receiveStockTransaction
	 * @param issueStockTransaction
	 * @param syncStagingDto
	 * 
	 */
	@Transactional
	public void saveToSyncStagging(SyncStagingDto syncStagingDto, StockTransactionDao issueStockTransaction,
			StockTransactionDao receiveStockTransaction, List<InventoryDetailsDaoExt> issueItems,
			List<InventoryDetailsDaoExt> receiveItems) {
		InventoryDetailsSyncDtoExt inventorySyncDto = new InventoryDetailsSyncDtoExt();
		List<SyncData> syncDatas = new ArrayList<>();
		syncDatas.add(DataSyncUtil.createSyncData(
				inventorySyncDto.getSyncDtoExtList(issueItems, issueStockTransaction.getIssuedDocNo()), 1));
		syncDatas.add(DataSyncUtil.createSyncData(
				inventorySyncDto.getSyncDtoExtList(receiveItems, receiveStockTransaction.getReceivedDocNo()), 0));
		List<String> destinations = new ArrayList<>();
		destinations.add(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDatas,
				InventoryOperationCodes.INV_CONV_POSS_UPDATE, destinations, MessageType.FIFO.toString(),
				DestinationType.SELECTIVE.toString());
		syncStagingDto.setMessageRequest(messageRequest);
		String requestBody = MapperUtil.getJsonString(messageRequest);
		// saving to staging table
		SyncStaging stagingMessage = new SyncStaging();
		stagingMessage.setMessage(requestBody);
		stagingMessage.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		stagingMessage = inventorySyncStagingRepository.save(stagingMessage);
		syncStagingDto.setId(stagingMessage.getId());
	}

	private void validationForConfirmCoversion(Optional<StockRequestDao> stRequest) {
		// if stock request is not available then throw exception
		if (!stRequest.isPresent()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}

		// if stock request status is APVL_PENDING then throw exception
		if (stRequest.get().getStatus().equals(StockRequestStatusEnum.APVL_PENDING.toString())
				|| stRequest.get().getStatus().equals(StockRequestStatusEnum.ACKNOWLEDGED.toString())) {
			throw new ServiceException("Conversion request pending for approval", "ERR-INV-32");
		}

		// if stock request status is CLOSED then throw exception
		if (stRequest.get().getStatus().equals(StockRequestStatusEnum.CLOSED.toString())) {
			throw new ServiceException("Item has been converted already", "ERR-INV-013");
		}
	}

	private StockTransactionDao createConvReceiveStockTransactionItem(Map<String, String> otherDetails,
			StockTransactionDao issueStockTransaction, StockTransactionDao receiveStockTransaction, int count,
			StockRequestDetailsDao stockRequestDetails, Date date, CountryDetailsDto countryDto,
			BusinessDayDto businessDayDto) {
		ItemLiteDto itemLiteDto = engineService.getItemDetails(stockRequestDetails.getItemCode());
		// header should be created once. if count == 1 then only execute if block
		if (count == 1) {
			receiveStockTransaction = new StockTransactionDao();
			receiveStockTransaction.setCurrencyCode(countryDto.getCurrencyCode());
			receiveStockTransaction.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			receiveStockTransaction.setOrgCode(CommonConstants.ORG_CODE);
			receiveStockTransaction.setWeightUnit(countryDto.getWeightUnit());
			receiveStockTransaction.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			receiveStockTransaction.setIssuedDocDate(businessDayDto.getBusinessDate());
			receiveStockTransaction.setIssuedFiscalYear(countryDto.getFiscalYear().shortValue());
			if (issueStockTransaction.getIssuedDocNo() != null) {
				receiveStockTransaction.setIssuedDocNo(issueStockTransaction.getIssuedDocNo());
			} else {
				receiveStockTransaction.setIssuedDocNo(0);
			}
			receiveStockTransaction.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			receiveStockTransaction.setReceivedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			receiveStockTransaction.setReceivedDocDate(businessDayDto.getBusinessDate());
			receiveStockTransaction.setOrgCode(CommonConstants.ORG_CODE);
			// call inventoryDocMasterService to get stock issue receive doc no
			Integer receiveDocNo = inventoryDocMasterService.getDocNumber(countryDto.getFiscalYear().shortValue(),
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
					DocTypeEnum.OTHERRECPT.toString());
			receiveStockTransaction.setReceivedDocNo(receiveDocNo);
			receiveStockTransaction.setReceivedFiscalYear(countryDto.getFiscalYear().shortValue());
			receiveStockTransaction.setStatus(StockTransactionStatus.RECEIVED.toString());
			receiveStockTransaction.setTotalIssuedQuantity((short) 0);
			receiveStockTransaction.setTotalIssuedValue(BigDecimal.ZERO);
			receiveStockTransaction.setTotalIssuedWeight(BigDecimal.ZERO);
			receiveStockTransaction.setTotalReceivedQuantity((short) 0);
			receiveStockTransaction.setTotalReceivedQuantity((short) 0);
			receiveStockTransaction.setTotalReceivedValue(BigDecimal.ZERO);
			receiveStockTransaction.setTotalReceivedWeight(BigDecimal.ZERO);
			receiveStockTransaction.setTransactionType(StockTransactionType.CONV.toString());
			receiveStockTransaction.setOtherDetails(MapperUtil.getStringFromJson(otherDetails));
			stockTransactionService.updateStockTransaction(receiveStockTransaction);
		}
		StockTransactionDetailsDao stTransactionDetails = new StockTransactionDetailsDao();
		BeanUtils.copyProperties(stockRequestDetails, stTransactionDetails, "id");
		stTransactionDetails.setCurrencyCode(countryDto.getCurrencyCode());
		stTransactionDetails.setInventoryId(UUID.randomUUID().toString());
		stTransactionDetails.setIssuedBinCode(stockRequestDetails.getBinCode());
		stTransactionDetails.setIssuedQuantity((short) 0);
		stTransactionDetails.setIssuedValue(BigDecimal.ZERO);
		stTransactionDetails.setIssuedWeight(BigDecimal.ZERO);
		stTransactionDetails.setReceivedBinCode(stockRequestDetails.getBinCode());
		stTransactionDetails.setReceivedQuantity((short) 1);
		stTransactionDetails.setReceivedValue(itemLiteDto.getStdValue());
		stTransactionDetails.setReceivedWeight(stockRequestDetails.getRequestedWeight());
		stTransactionDetails.setStatus(StockTransactionStatus.RECEIVED.toString());
		stTransactionDetails.setStdValue(itemLiteDto.getStdValue());
		stTransactionDetails.setWeightUnit(countryDto.getWeightUnit());
		stTransactionDetails.setStockTransaction(receiveStockTransaction);
		stTransactionDetails.setStockInwardDate(date);
		stockTransactionService.saveOrUpdateStockTransactionDetails(stTransactionDetails);
		receiveStockTransaction.setTotalReceivedQuantity((short) count);
		receiveStockTransaction.setTotalReceivedValue(stTransactionDetails.getReceivedValue());
		receiveStockTransaction.setTotalReceivedWeight(stTransactionDetails.getReceivedWeight());
		return receiveStockTransaction;
	}

	private StockTransactionDao createConvIssueStockTransactionItem(Map<String, String> otherDetails,
			StockTransactionDao issueStockTransaction, InventoryDetailsDaoExt inventoryDetails,
			CountryDetailsDto countryDto, BusinessDayDto businessDayDto) {
		// create new row in stock transaction(header) table for the parent
		// item(conversion)
		// copy from InventoryDetails object to StockTransaction object with excluding
		// id column of inventory details table
		BeanUtils.copyProperties(inventoryDetails, issueStockTransaction, "id");
		issueStockTransaction.setId(null);
		issueStockTransaction.setCurrencyCode(countryDto.getCurrencyCode());
		issueStockTransaction.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		issueStockTransaction.setIssuedDocDate(businessDayDto.getBusinessDate());
		// call inventoryDocMasterService to get stock issue src doc no
		Integer issueDocNo = inventoryDocMasterService.getDocNumber(countryDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.OTHERISSUE.toString());
		issueStockTransaction.setIssuedDocNo(issueDocNo);
		issueStockTransaction.setIssuedFiscalYear(countryDto.getFiscalYear().shortValue());
		issueStockTransaction.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		issueStockTransaction.setStatus(StockTransactionStatus.ISSUED.toString());
		issueStockTransaction.setTotalIssuedQuantity((short) 1);
		issueStockTransaction.setTotalIssuedValue(inventoryDetails.getStdValue());
		issueStockTransaction.setTotalIssuedWeight(inventoryDetails.getStdWeight());
		issueStockTransaction.setTransactionType(StockTransactionType.CONV.toString());
		issueStockTransaction.setTotalReceivedQuantity((short) 0);
		issueStockTransaction.setTotalReceivedValue(BigDecimal.ZERO);
		issueStockTransaction.setTotalReceivedWeight(BigDecimal.ZERO);
		issueStockTransaction.setOtherDetails(MapperUtil.getStringFromJson(otherDetails));
		issueStockTransaction.setWeightUnit(countryDto.getWeightUnit());
		issueStockTransaction.setOrgCode(CommonConstants.ORG_CODE);
		issueStockTransaction = stockTransactionService.updateStockTransaction(issueStockTransaction);
		// create new row in stock transaction details(details) table for the parent
		// item(conversion)
		StockTransactionDetailsDao stockTransactionDetails = new StockTransactionDetailsDao();
		// copy from InventoryDetails object to StockTransactionDetails object with
		// excluding id column of inventory details table
		BeanUtils.copyProperties(inventoryDetails, stockTransactionDetails, "id");
		stockTransactionDetails.setIssuedBinCode(inventoryDetails.getBinCode());
		stockTransactionDetails.setIssuedQuantity((short) 1);
		stockTransactionDetails.setIssuedValue(inventoryDetails.getStdValue());
		stockTransactionDetails.setIssuedWeight(inventoryDetails.getStdWeight());
		stockTransactionDetails.setInventoryId(inventoryDetails.getId());
		stockTransactionDetails.setStatus(StockTransactionStatus.ISSUED.toString());
		stockTransactionDetails.setStockTransaction(issueStockTransaction);
		stockTransactionService.saveOrUpdateStockTransactionDetails(stockTransactionDetails);
		return issueStockTransaction;
	}

	@Override
	public ConversionRequestListDto getConversionRequest(Integer id) {
		StockRequestDao stRequestDao = stockRequestService.findStockRequestByIdAndSrcLocationCodeAndRequestType(id,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), StockTransactionType.CONV.toString());
		return prepareConversionListDto(stRequestDao);
	}

	@Override
	public StockTransactionDao addBinStockTransaction() {
		return stockTransactionService.addBinStockTransaction("IN_PROGRESS",
				StockTransactionType.BIN_TO_BIN.toString());

	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}

	@Override
	public PagedRestResponse<InventoryItemDtoList> listInventoryItems(List<String> binCode, String itemCode,
			List<String> productCategory, List<String> productGroup, String binGroupCode, String lotNumber,
			String binType, Boolean isPageable, Pageable pageable) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}

		ListInventoryItemsDto listInventoryItemsDto = new ListInventoryItemsDto();
		listInventoryItemsDto.setBinCode(binCode);
		listInventoryItemsDto.setItemCode(itemCode);
		listInventoryItemsDto.setProductCategory(productCategory);
		listInventoryItemsDto.setProductGroup(productGroup);
		listInventoryItemsDto.setBinGroupCode(binGroupCode);
		listInventoryItemsDto.setLotNumber(lotNumber);

		Page<InventoryDetailsDaoExt> inventoryDetailPageLists = inventoryDetailsService
				.listInventoryItems(listInventoryItemsDto, binType, pageable);

		InventoryItemDtoList itemDtoCount = inventoryDetailsService.listInventoryItemsCount(listInventoryItemsDto,
				binType);

		List<InventoryItemDto> binToBinTransferList = new ArrayList<>();
		InventoryItemDtoList itemsList = new InventoryItemDtoList();

		if (!inventoryDetailPageLists.isEmpty()) {
			for (InventoryDetailsDaoExt inventoryDetailList : inventoryDetailPageLists) {
				InventoryItemDto binToBinTransferItemDetails = (InventoryItemDto) MapperUtil
						.getDtoMapping(inventoryDetailList, InventoryItemDto.class);
				binToBinTransferItemDetails
						.setItemDetails(MapperUtil.getJsonFromString(inventoryDetailList.getItemDetails()));
				binToBinTransferItemDetails
						.setImageURL(new URLUtil().getImageUrlByItemCode(inventoryDetailList.getItemCode()));
				binToBinTransferItemDetails.setAvailableQuantity(inventoryDetailList.getTotalQuantity());
				binToBinTransferItemDetails.setAvailableValue(inventoryDetailList.getTotalValue());
				binToBinTransferItemDetails.setAvailableWeight(inventoryDetailList.getTotalWeight());

				binToBinTransferItemDetails.setProductCategory(inventoryDetailList.getProductCategory());
				binToBinTransferItemDetails
						.setProductCategoryDesc(productCategoryList.get(inventoryDetailList.getProductCategory()));
				binToBinTransferItemDetails.setProductGroup(inventoryDetailList.getProductGroup());
				binToBinTransferItemDetails
						.setProductGroupDesc(productGroupList.get(inventoryDetailList.getProductGroup()));
				binToBinTransferItemDetails.setItemCode(inventoryDetailList.getItemCode().trim());
				binToBinTransferList.add(binToBinTransferItemDetails);
			}
		}

		itemsList.setItems(binToBinTransferList);
		itemsList.setTotalQuantity(itemDtoCount.getTotalQuantity());
		itemsList.setTotalValue(itemDtoCount.getTotalValue());
		return new PagedRestResponse<>(itemsList, inventoryDetailPageLists);

	}

	// 502718VAJA4A02 -P
	// 502718VAJA2A02
	// 502718VAJA2A02
	private void checkPlainBangleConversion(String parentItemCode, ConversionRequestDto conversionRequestDto) {
		char bangleQtyChar = parentItemCode.charAt(10);
		char bangleCatCode = parentItemCode.charAt(6);
		int childBangleQtyChar = 0;
		if (Character.toString(bangleCatCode).toLowerCase().equals("v")) {
			for (int i = 0; i < conversionRequestDto.getReceiveItems().size(); i++) {
				if (Character.isAlphabetic(conversionRequestDto.getReceiveItems().get(i).getItemCode().charAt(10))) {
					childBangleQtyChar = childBangleQtyChar + 1;
				} else if (Character.isDigit(conversionRequestDto.getReceiveItems().get(i).getItemCode().charAt(10))) {
					childBangleQtyChar = childBangleQtyChar + Integer.parseInt(
							Character.toString(conversionRequestDto.getReceiveItems().get(i).getItemCode().charAt(10)));
					System.out.println("ChildBangle Qty " + childBangleQtyChar);
				}
			}
			System.out.println("Child bangle qty " + childBangleQtyChar + " Parent Qty " + bangleQtyChar);
			if (childBangleQtyChar != Integer.parseInt(Character.toString(bangleQtyChar))) {
				throw new ServiceException("Total Child Item Count Does not match with Parent Item Count", ERR_INV_059);
			}
		}
	}
	
	@Override
	public ResponseEntity<Resource> getInventoryItemLotDetails(String itemCode, String lotNumber,
			Boolean isHallmarking) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();

		List<String> binGroupCodeList = new ArrayList<>(Arrays.asList(BinGroupEnum.STN.toString(),
				(BinGroupEnum.HALLMARKDISPUTEBIN.toString()), (BinGroupEnum.CUSTOMERORDERBIN.toString())));

		List<InventoryDetailsDao> inventoryItemList = inventoryDetailsRepository
				.findAllByLocationCodeAndItemCodeAndLotNumberAndBinGroupCodeIn(authUser.getLocationCode(), itemCode,
						lotNumber, binGroupCodeList);
		InventoryDetailsDao inventoryDetail = new InventoryDetailsDao();
		List<InventoryDetailsDao> invs = new ArrayList<>();
		if (!CollectionUtils.isEmpty(inventoryItemList)) {

			for (InventoryDetailsDao i : inventoryItemList) {
				inventoryDetail = (InventoryDetailsDao) MapperUtil.getDtoMapping(i, InventoryDetailsDao.class);

				if (null != inventoryDetail.getBinGroupCode()
						&& (CommonConstants.HALLMARK_DISPUTE_BIN.equalsIgnoreCase(inventoryDetail.getBinGroupCode())
								|| CommonConstants.STN.equalsIgnoreCase(inventoryDetail.getBinGroupCode()))) {
					inventoryDetail.setBinCode("ZEROBIN");
					inventoryDetail.setBinGroupCode("STN");

					inventoryDetail.setIsHallmarked(isHallmarking);

					inventoryDetail = updateItemDetailsHallmarkFlag(inventoryDetail.getItemDetails(), inventoryDetail,
							isHallmarking);
				} else if (null != inventoryDetail.getBinGroupCode()
						&& CommonConstants.CUSTOM_ORDER_BIN.equalsIgnoreCase(inventoryDetail.getBinGroupCode())) {
					inventoryDetail.setIsHallmarked(isHallmarking);

					inventoryDetail = updateItemDetailsHallmarkFlag(inventoryDetail.getItemDetails(), inventoryDetail,
							isHallmarking);
				} 
				invs.add(inventoryDetail);
			}		
			inventoryDetailsRepository.saveAll(invs);
		} else {
			throw new ServiceException("Items with bin code : HALLMARKDISPUTEBIN/STN can only be Hallmarked",
					ERR_INV_067);
		}
		return new ResponseEntity<>(new HttpHeaders(), HttpStatus.OK);
	}

	public static InventoryDetailsDao updateItemDetailsHallmarkFlag(String itemDetails, InventoryDetailsDao invDetails,
			Boolean hallmarkingFlag) {

		JsonNode root;
		JsonNode dataNode = null;
		InventoryItemDetailsDto itemDetailsImp = null;
		try {
			if (itemDetails != null) {
				root = MapperUtil.getObjectMapperInstance().readTree(itemDetails);
				dataNode = root.path("data");
				itemDetailsImp = MapperUtil.getObjectMapperInstance().convertValue(dataNode,
						InventoryItemDetailsDto.class);
				if (itemDetailsImp != null) {
					itemDetailsImp.setIsHallMarking(hallmarkingFlag);
					JsonData itemDetailsImprt = new JsonData("ITEM_DETAILS", itemDetailsImp);
					invDetails.setItemDetails(MapperUtil.getStringFromJson(itemDetailsImprt));
				} else {
					Map<String, Boolean> item = new HashMap<>();
					item.put("isHallMarking", hallmarkingFlag);
					JsonData itemDetailsImprt = new JsonData("ITEM_DETAILS", item);
					invDetails.setItemDetails(MapperUtil.getStringFromJson(itemDetailsImprt));
				}
			} else {
				Map<String, Boolean> item = new HashMap<>();
				item.put("isHallMarking", hallmarkingFlag);
				JsonData itemDetailsImprt = new JsonData("ITEM_DETAILS", item);
				invDetails.setItemDetails(MapperUtil.getStringFromJson(itemDetailsImprt));
			}
		} catch (Exception e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_INV_069);
		}

		return invDetails;
	}
}
