/*  

 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import javax.transaction.Transactional;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.BooleanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.ConversionItemDto;
import com.titan.poss.core.dto.CutPieceTepPriceResponseDto;
import com.titan.poss.core.dto.GepConfigDetailResponse;
import com.titan.poss.core.dto.GepPriceRequest;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.GepRequestDetail;
import com.titan.poss.core.dto.HistoryPriceResponse;
import com.titan.poss.core.dto.ItemHallmarkDetailsDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationResponseDto;
import com.titan.poss.core.dto.MakingChargeDetailsDto;
import com.titan.poss.core.dto.MetalPriceDetailsDto;
import com.titan.poss.core.dto.MetalPriceDto;
import com.titan.poss.core.dto.MetalPriceLocationMappingDto;
import com.titan.poss.core.dto.MetalPriceRequestDto;
import com.titan.poss.core.dto.MetalRateDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StonePriceDetailsDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.dto.TepStoneResponseDto;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.enums.PricingTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.service.clients.ProductServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.engine.config.dto.request.StandardMetalRateDto;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.dto.TepConfigurations;
import com.titan.poss.engine.dto.TepStoneDto;
import com.titan.poss.engine.dto.request.TepStoneRequestDto;
import com.titan.poss.engine.dto.response.ItemLotStoneListDto;
import com.titan.poss.engine.inventory.repository.InventoryDetailRepositoryExt;
import com.titan.poss.engine.location.repository.MarketUcpPriceMappingRepositoryExt;
import com.titan.poss.engine.location.repository.MetalPriceLocationMappingHistoryRepositoryExt;
import com.titan.poss.engine.location.repository.MetalPriceLocationMappingRepositoryExt;
import com.titan.poss.engine.product.repository.ItemRepositoryExt;
import com.titan.poss.engine.product.repository.PriceRepositoryExt;
import com.titan.poss.engine.product.repository.ProductCategoryRepositoryExt;
import com.titan.poss.engine.product.repository.ProductGroupRepositoryExt;
import com.titan.poss.engine.sales.repository.BusinessDayRepositoryExt;
import com.titan.poss.engine.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.engine.service.ConfigService;
import com.titan.poss.engine.service.IntegrationService;
import com.titan.poss.engine.service.LocationService;
import com.titan.poss.engine.service.PriceService;
import com.titan.poss.engine.service.PriceUtilService;
import com.titan.poss.engine.service.ProductService;
import com.titan.poss.engine.service.SalesService;
import com.titan.poss.engine.service.TEPPriceUtilService;
import com.titan.poss.engine.util.PriceFactory;
import com.titan.poss.engine.util.TEPPriceFactory;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.InventoryItemDetailsDto;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MarketUcpPriceMappingDao;
import com.titan.poss.location.dao.MetalPriceConfigDao;
import com.titan.poss.location.dao.MetalPriceLocationHistoryDao;
import com.titan.poss.location.dao.MetalPriceLocationMappingDao;
import com.titan.poss.location.dto.request.json.MetalPriceConfigRequestDto;
import com.titan.poss.location.repository.LocationRepository;
import com.titan.poss.location.repository.MarketRepository;
import com.titan.poss.location.repository.MetalPriceConfigRepository;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.PriceGroupDao;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dao.StuddedSplitDetailsDao;
import com.titan.poss.product.dto.request.json.HallmarkDetails;
import com.titan.poss.product.dto.request.json.ProductGroupConfig;
import com.titan.poss.product.repository.ComplexityRepository;
import com.titan.poss.product.repository.StuddedSplitDetailsRepository;
import com.titan.poss.sales.dao.BusinessDayDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dto.WeightDetailsDto;

import feign.Response;
import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
@Slf4j
public class PriceServiceImpl implements PriceService {
	private static final Logger LOGGER = LoggerFactory.getLogger(PriceServiceImpl.class);

	private static final String LOCATION_EPOSS_API_URL = EngineConstants.LOCATION_SERVICE_URL;

	private static final String ERR_CORE_013 = "ERR-CORE-013";

	private static final String ERR_CORE_003 = "ERR-ENG-003";

	private static final String NO_METAL_RATE_SET_FOR_THE_DAY = "No metal rate set for the day. Please contact commercial helpdesk and get the metal rate password";

	private static final String JSON_DATA_FORMAT_ERROR = "JSON data format error";

	private static final String ERR_LOC_001 = "ERR-LOC-001";
	private static final String NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE = "No Location details found for the requested locationCode";

	private static final String ERR_COM_013 = "ERR-COM-013";
	private static final String ITEM_NOT_THERE_IN_STOCK = "Item not in Stock";

	private static final String ERR_PRO_037 = "ERR-PRO-037";
	private static final String NO_CHILD_ITEMS = "No child items present for the requested Parent Item code.";

	@Autowired
	ProductServiceClient productClient;

	@Autowired
	ItemRepositoryExt itemRepository;

	@Autowired
	InventoryDetailRepositoryExt inventoryDetailRepository;

	@Autowired
	ProductGroupRepositoryExt productGroupRepository;

	@Autowired
	ConfigService configService;

	@Autowired
	LocationService locationService;

	@Autowired
	ProductService productService;

	@Autowired
	LocationRepository locationRepo;

	@Autowired
	MarketRepository marketRepo;

	@Autowired
	PriceUtilService priceUtilService;

	@Autowired
	TEPPriceUtilService tepPriceUtilService;

	@Autowired
	IntegrationService intgService;

	@Autowired
	PriceFactory priceFactory;

	@Autowired
	TEPPriceFactory teppriceFactory;

	@Autowired
	MetalPriceConfigRepository metalPriceConfigRepo;

	@Autowired
	private CashMemoDetailsRepositoryExt cmRepo;

	@Autowired
	private MetalPriceLocationMappingRepositoryExt metalPriceLocationMappingRepository;

	@Autowired
	private MetalPriceLocationMappingHistoryRepositoryExt metalPriceLocationHistoryRepository;

	@Autowired
	private SalesService salesService;

	@Autowired
	private BusinessDayRepositoryExt buisnessRepo;

	@Autowired
	private MarketUcpPriceMappingRepositoryExt marketUcpPriceMappingRepositoryExt;

	@Autowired
	private ProductCategoryRepositoryExt productCategoryRepositoryExt;

	@Autowired
	private StuddedSplitDetailsRepository studdedSplitRepository;

/*	@Autowired
	private ComplexityRepository complexityRepository;

	@Autowired
	private PriceRepositoryExt priceRepositoryExt;
*/
	@Override
	public PriceResponseDto getPriceDetails(OrdersPriceRequest orderPriceRequest, String locationCode) {

		PriceResponseDto price = null;

		log.info("destination location is ......{}", locationCode);
		if (CommonUtil.isAStoreUser() && locationCode == null) {
			locationCode = CommonUtil.getLocationCode();
		}

		log.info(
				"Calculate price at location: {} for item: {}, lot: {}, invId: {}, measured weight: {}, measured quantity: {}, check inventory:{}",
				locationCode, orderPriceRequest.getItemCode(), orderPriceRequest.getLotNumber(),
				orderPriceRequest.getInventoryId(), orderPriceRequest.getMeasuredWeight(),
				orderPriceRequest.getMeasuredQuantity(), orderPriceRequest.getCheckInventory());

		Boolean isUcp = false;
		ItemDao itemDto = getItemDetail(orderPriceRequest.getItemCode());

		InventoryDetailsDao inventoryDetail;
		inventoryDetail = getInventoryDetails(orderPriceRequest.getInventoryId(), orderPriceRequest.getItemCode(),
				orderPriceRequest.getLotNumber(), locationCode, orderPriceRequest.getMeasuredWeight(),
				orderPriceRequest.getMeasuredQuantity(), itemDto);

		ProductGroupDao productGroupDto = getProductGroupDetails(itemDto.getProductGroup().getProductGroupCode());
		// product group config details
		ProductGroupConfig productGroupConfigDetails = MapperUtil.mapJsonDataToClass(productGroupDto.getConfigDetails(),
				ProductGroupConfig.class);

		ProductCategoryDao productCategoryDao = productCategoryRepositoryExt
				.findOneByProductCategoryCode(itemDto.getProductCategory().getProductCategoryCode());

		// check hallmark
		ItemHallmarkDetailsDto itemHallmarkDetailsDto = checkAndGetHallmarkDetails(orderPriceRequest, locationCode,
				itemDto, inventoryDetail, productGroupConfigDetails, productCategoryDao);

		if (itemDto.getPricingType() == null) {
			throw new ServiceException("no pricing type available", "ERR-CORE-036");
		}
		String currencyCode = locationService.listLocationByLocationCode(locationCode).getStockCurrency();
		if (itemDto.getPricingType().equals(EngineConstants.NON_UCP)) {
			price = calculateNonUcpPrice(locationCode, itemDto, inventoryDetail, productGroupDto,
					orderPriceRequest.getMeasuredQuantity(), orderPriceRequest.getMeasuredWeight(),
					orderPriceRequest.getStandardPrice(), orderPriceRequest.getCheckInventory(),
					orderPriceRequest.getIsComPrice());
			validateMandatoryPrice(price);
			price.setCurrencyCode(currencyCode);

		} else if (itemDto.getPricingType().equals(EngineConstants.UCP)) {

			price = calculateUcpPrice(itemDto, orderPriceRequest.getMeasuredQuantity(),
					orderPriceRequest.getMeasuredWeight(), inventoryDetail, productGroupDto, locationCode,
					orderPriceRequest.getCheckInventory());

			// price = calculateUcpPrice(itemDto, inventoryDetail, productGroupDto,
			// locationCode,orderPriceRequest.getCheckInventory());
			price.setCurrencyCode(currencyCode);
			isUcp = true;
			// set if its ucp or non ucp
			price.getPriceDetails().setIsUcp(isUcp);

		}

/*		ComplexityDao complexityDao = complexityRepository.findOneByComplexityCode(price.getComplexityCode());
		if (complexityDao != null && !complexityDao.getIsActive()) {
			throw new ServiceException(
					"Complexity code :- {complexityCode} is inactive contact the merchandising team.", "ERR-ENG-041",
					"Inactive complexity code ", Map.of("complexityCode", price.getComplexityCode()));
		}

		PriceGroupDao priceGroupDao = priceRepositoryExt.findOneByPriceGroup(price.getPriceGroup());
		if (priceGroupDao != null && !priceGroupDao.getIsActive()) {
			throw new ServiceException(
					"Price group :- {priceGroup} is inactive, please contact the merchandising team.", "ERR-ENG-042",
					"Inactive Price group.", Map.of("priceGroup", price.getPriceGroup()));
		}
*/
		if (price != null && price.getPriceDetails() != null) {
			// set hallmark details
			price.getPriceDetails().setItemHallmarkDetails(itemHallmarkDetailsDto);

			price.getPriceDetails()
					.setPrintGuranteeCard(productGroupConfigDetails == null
							|| productGroupConfigDetails.getPrintGuranteeCard() == null ? Boolean.FALSE
									: productGroupConfigDetails.getPrintGuranteeCard());
			// set item type code
			price.getPriceDetails().setItemTypeCode(price.getItemTypeCode());

			// if isDynamic field in making charge details is null, then set it as false.
			if (price.getPriceDetails().getMakingChargeDetails() != null
					&& price.getPriceDetails().getMakingChargeDetails().getIsDynamic() == null) {
				price.getPriceDetails().getMakingChargeDetails().setIsDynamic(false);
			}
		}

		return price;
	}

	private ItemHallmarkDetailsDto checkAndGetHallmarkDetails(OrdersPriceRequest orderPriceRequest, String locationCode,
			ItemDao itemDto, InventoryDetailsDao inventoryDetail, ProductGroupConfig productGroupConfigDetails,
			ProductCategoryDao productCategoryDao) {
		ItemHallmarkDetailsDto itemHallmarkDetailsDto = new ItemHallmarkDetailsDto();
		itemHallmarkDetailsDto.setIsHallmarked(BooleanUtils.isTrue(inventoryDetail.getIsHallmarked()));

		// product category hallmark details
		HallmarkDetails productCategoryHallmarkDetails = MapperUtil
				.mapJsonDataToClass(productCategoryDao.getHallmarkDetails(), HallmarkDetails.class);
		if (productCategoryDao.getProductCategoryCode().equalsIgnoreCase("V")) {
			// 51D1D1VZGS2A00
			char hmQtyChar = itemDto.getItemCode().charAt(10);
			if (Character.isDigit(hmQtyChar)) {
				int hmQtyFromItemCode = Integer.parseInt(String.valueOf(hmQtyChar));
				log.info("HM Quantity from item code is........................", hmQtyFromItemCode);
				// set hallmarking qty for Bangles
				itemHallmarkDetailsDto.setHmQuantity(hmQtyFromItemCode);
			} else {
				// 11th character from item code is not an integer................
				itemHallmarkDetailsDto.setHmQuantity(1);
			}
		} else if (productCategoryDao.getHallmarkQuantity() != null
				&& !productCategoryDao.getProductCategoryCode().equalsIgnoreCase("V")) {
			// Product Category Code is not V...........................
			itemHallmarkDetailsDto.setHmQuantity(productCategoryDao.getHallmarkQuantity());
		}
		LocationCacheDto locationCacheDto = locationService.getStoreLocation(locationCode);
		// NAP-8817, NAP-9547 and NAP-8859
		if (BooleanUtils.isTrue(locationCacheDto.getStoreDetails().getIsHallmarkingEnabled())
				&& BooleanUtils.isTrue(productGroupConfigDetails.getIsHallmarked())
				&& productCategoryHallmarkDetails != null
				&& BooleanUtils.isTrue(productCategoryHallmarkDetails.getIsAllowedForHallmarking())
				&& checkExcludeKarat(itemDto, productGroupConfigDetails)
				&& checkExcludeGrams(orderPriceRequest, inventoryDetail, productGroupConfigDetails)) {

			// for coins, fetch data again as already fetch data may contain non hallmarked
			// items
			if (ProductGroupCodeEnum.getCoinList().contains(itemDto.getProductGroup().getProductGroupCode())) {
				inventoryDetail = getInventoryDetailForCoins(itemDto.getItemCode(), locationCode,
						orderPriceRequest.getMeasuredWeight(), orderPriceRequest.getMeasuredQuantity(), true);
				itemHallmarkDetailsDto.setIsHallmarked(BooleanUtils.isTrue(inventoryDetail.getIsHallmarked()));// re-check
																												// hallmark
																												// at
																												// inventory
			}
			checkAndThrowErorrForHallmark(orderPriceRequest, itemDto, inventoryDetail);

			// all details matter only when hallmark charges is configured.
			setHallmarkdetails(orderPriceRequest, itemHallmarkDetailsDto, locationCacheDto,
					productCategoryHallmarkDetails);
		}
		return itemHallmarkDetailsDto;
	}

	private void checkAndThrowErorrForHallmark(OrdersPriceRequest orderPriceRequest, ItemDao itemDto,
			InventoryDetailsDao inventoryDetail) {
		
		Boolean isHallMarking = checkItemHallmark(inventoryDetail);
			if(!BooleanUtils.isTrue(isHallMarking)) {
				// if weight edited in case of already added product.(except coins)
				if (!ProductGroupCodeEnum.getCoinList().contains(itemDto.getProductGroup().getProductGroupCode())
						&& orderPriceRequest.getMeasuredWeight() != null
						&& orderPriceRequest.getMeasuredWeight().compareTo(inventoryDetail.getTotalWeight().divide(
								new BigDecimal(inventoryDetail.getTotalQuantity()), 3, RoundingMode.HALF_UP)) != 0) {
					throw new ServiceException(
							"The selected product's weight is above the Hallmarked configured limit hence cannot be edited.",
							"ERR-ENG-030");
				}
				//throw error
				throw new ServiceException("Item is not Hallmarked and is not available for transaction.", "ERR-ENG-029",
											"Hallmark is mandatory for the location, but the item is not hallmarked in inventory.");
			}
	
		}


	private Boolean checkItemHallmark(InventoryDetailsDao inventoryDetail) {
		Boolean isHallMarking = Boolean.FALSE;
		if (inventoryDetail.getItemDetails() != null) {
		JsonObject jsonObj = new JsonParser().parse(inventoryDetail.getItemDetails()).getAsJsonObject();
		if(jsonObj!= null && jsonObj.getAsJsonObject("data") != null && jsonObj.getAsJsonObject("data").get("isHallMarking")!= null) {
			JsonElement checkhallmarkElement = jsonObj.getAsJsonObject("data").get("isHallMarking"); 
			if(!JsonNull.INSTANCE.equals(checkhallmarkElement)) {
				isHallMarking = jsonObj.getAsJsonObject("data").get("isHallMarking")
						.getAsBoolean(); 
			}else {
				isHallMarking = Boolean.FALSE;  //if null set false
					
			}
		}
		}
		return isHallMarking;
		
	}

	private void setHallmarkdetails(OrdersPriceRequest orderPriceRequest, ItemHallmarkDetailsDto itemHallmarkDetailsDto,
			LocationCacheDto locationCacheDto, HallmarkDetails productCategoryHallmarkDetails) {
		if (productCategoryHallmarkDetails.getHallmarkingCharges() != null
				&& itemHallmarkDetailsDto.getHmQuantity() != null) {
			itemHallmarkDetailsDto.setHallmarkingCharges(orderPriceRequest.getMeasuredQuantity() == null
					? productCategoryHallmarkDetails.getHallmarkingCharges()
							.multiply(new BigDecimal(itemHallmarkDetailsDto.getHmQuantity()))
					: productCategoryHallmarkDetails.getHallmarkingCharges()
							.multiply(new BigDecimal(itemHallmarkDetailsDto.getHmQuantity()))
							.multiply(new BigDecimal(orderPriceRequest.getMeasuredQuantity()))
							.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
			itemHallmarkDetailsDto.setIsFOCForHallmarkingCharges(
					BooleanUtils.isTrue(productCategoryHallmarkDetails.getIsFOCForHallmarkingCharges()));
			// hm quantity is set in parent function
			itemHallmarkDetailsDto.setHallmarkGstPct(locationCacheDto.getStoreDetails().getHallmarkGSTPercentage());
		}
	}

	private boolean checkExcludeKarat(ItemDao itemDto, ProductGroupConfig productGroupConfigDetails) {

		// @formatter:off
		return (MetalTypeCodeEnum.J.name().equals(itemDto.getItemType().getItemTypeCode())
				&& !CollectionUtil.isEmpty(productGroupConfigDetails.getHallmarkingExcludeKarat())
				&& !productGroupConfigDetails.getHallmarkingExcludeKarat().contains(itemDto.getKarat().setScale(0)))
				|| !MetalTypeCodeEnum.J.name().equals(itemDto.getItemType().getItemTypeCode()) // ignore if item is not of type 'J'
				|| CollectionUtil.isEmpty(productGroupConfigDetails.getHallmarkingExcludeKarat());// ignore if exclude karat not configured
		// @formatter:on
	}

	private boolean checkExcludeGrams(OrdersPriceRequest orderPriceRequest, InventoryDetailsDao inventoryDetail,
			ProductGroupConfig productGroupConfigDetails) {
		// @formatter:off
		return (productGroupConfigDetails.getHallmarkingExcludeGrams() != null
				&& (orderPriceRequest.getMeasuredWeight() != null && (orderPriceRequest.getMeasuredWeight() // check for input weight
						.divide(new BigDecimal(orderPriceRequest.getMeasuredQuantity()),3,
								RoundingMode.HALF_UP))
						.compareTo(productGroupConfigDetails.getHallmarkingExcludeGrams()) > 0)
				|| (orderPriceRequest.getMeasuredWeight() == null
						&& (inventoryDetail.getTotalWeight().divide(new BigDecimal(inventoryDetail.getTotalQuantity()),3,
								RoundingMode.HALF_UP)) // else, check for inventory weight
								.compareTo(productGroupConfigDetails.getHallmarkingExcludeGrams()) > 0))
				|| productGroupConfigDetails.getHallmarkingExcludeGrams() == null;// ignore if exclude grams is not configured.
		// @formatter:on
	}

	/**
	 * @param price
	 */

	private void validateMandatoryPrice(PriceResponseDto price) {

		if ((price.getIsGoldPriceMandatory() || price.getIsPlatinumPriceMandatory()
				|| price.getIsSilverPriceMandatory())) {
			if (price.getPriceDetails().getMetalPriceDetails() == null
					|| price.getPriceDetails().getMetalPriceDetails().getMetalPrices() == null) {
				throw new ServiceException("MetalPrice is Mandatory and no MetalPrice available: Item can't be sold ",
						"ERR-ENG-004");
			}
			for (MetalPriceDto metalRate : price.getPriceDetails().getMetalPriceDetails().getMetalPrices()) {
				if (metalRate.getMetalTypeCode().equals(MetalTypeCodeEnum.J.toString())
						&& price.getIsGoldPriceMandatory()
						&& metalRate.getMetalValue().compareTo(BigDecimal.ZERO) <= 0) {
					// if getmetalValue is <0 throw exception
					log.info("price in validateMandatoryPrice.....{} ", price.toString());
					throw new ServiceException("GoldPrice is Mandatory and no GoldPrice available: Item can't be sold ",
							"ERR-ENG-005");
				}
				if (metalRate.getMetalTypeCode().equals(MetalTypeCodeEnum.L.toString())
						&& price.getIsPlatinumPriceMandatory()
						&& metalRate.getMetalValue().compareTo(BigDecimal.ZERO) <= 0) {
					// if getmetalValue is <0 throw exception
					throw new ServiceException(
							"PlatinumPrice is Mandatory and no PlatinumPrice available: Item can't be sold ",
							"ERR-ENG-006");
				}
				if (metalRate.getMetalTypeCode().equals(MetalTypeCodeEnum.P.toString())
						&& price.getIsSilverPriceMandatory()
						&& metalRate.getMetalValue().compareTo(BigDecimal.ZERO) <= 0) {
					// if getmetalValue is <0 throw exception
					throw new ServiceException(
							"SilverPrice is Mandatory and no SilverPrice available: Item can't be sold ",
							"ERR-ENG-007");
				}
			}

		}

		if (price.getIsStonePriceMandatory() && (price.getPriceDetails().getStonePriceDetails() != null)
				&& (price.getPriceDetails().getStonePriceDetails().getPreDiscountValue() == null
						|| price.getPriceDetails().getStonePriceDetails().getPreDiscountValue()
								.compareTo(BigDecimal.ZERO) <= 0)) {
			throw new ServiceException("Stone Price is Mandatory and no StonePrice available: Item can't be sold ",
					"ERR-ENG-008");

		}
		if (price.getIsMakingChargeMandatory() && (price.getPriceDetails().getMakingChargeDetails() != null)
				&& (price.getPriceDetails().getMakingChargeDetails().getPreDiscountValue() == null
						|| price.getPriceDetails().getMakingChargeDetails().getPreDiscountValue()
								.compareTo(BigDecimal.ZERO) <= 0)) {
			throw new ServiceException("Making charge is Mandatory and no MakingCharge available: Item can't be sold ",
					"ERR-ENG-009");
		}

	}

	private InventoryDetailsDao getInventoryDetails(String inventoryId, String itemCode, String lotNumber,
			String locationCode, BigDecimal measuredWeight, Short measuredQuantity, ItemDao itemDto) {
		InventoryDetailsDao inventoryDetail;

		if (inventoryId != null && !inventoryId.isEmpty()) {
			inventoryDetail = inventoryDetailRepository.findByIdAndLocationCodeAndTotalQuantityGreaterThan(inventoryId,
					locationCode, (short) 0);
			if (inventoryDetail == null) {
				throw new ServiceException("No Item details found for the requested itemCode",
						EngineConstants.ERR_PRO_002, "Product not found in inventory.");
			}
		} else if (ProductGroupCodeEnum.getCoinList().contains(itemDto.getProductGroup().getProductGroupCode())) {
			// it is a coin

			inventoryDetail = getInventoryDetailForCoins(itemCode, locationCode, measuredWeight, measuredQuantity,
					null);

		} else {
			// for others
			inventoryDetail = getInventoryDetailForOthers(itemCode, lotNumber, locationCode);
		}
		return inventoryDetail;
	}

	private InventoryDetailsDao getInventoryDetailForCoins(String itemCode, String locationCode,
			BigDecimal measuredWeight, Short measuredQuantity, Boolean isHallmarked) {

		Pageable pageable = PageRequest.of(0, 1);

		List<InventoryDetailsDao> inventoryList = inventoryDetailRepository.findByLocationCodeAndItemCodeWithOrder(
				locationCode, itemCode,
				measuredWeight.divide(new BigDecimal(measuredQuantity != null ? measuredQuantity : 1),
						DomainConstants.WEIGHT_SCALE, RoundingMode.HALF_UP),
				DomainConstants.WEIGHT_SCALE, isHallmarked, pageable);

		if (CollectionUtil.isEmpty(inventoryList)) {
			if (BooleanUtils.isTrue(isHallmarked)) {
				throw new ServiceException("Item is not Hallmarked and is not available for transaction.",
						"ERR-ENG-029",
						"Hallmark is mandatory for the location, but the item is not hallmarked in inventory. Location code: "
								+ locationCode);
			}
			throw new ServiceException("product not found in inventory", EngineConstants.ERR_PRO_002);
		}

		return inventoryList.get(0);
	}

	private PriceResponseDto calculateUcpPrice(ItemDao itemDetail, Short measuredQuantity, BigDecimal measuredWeight,
			InventoryDetailsDao inventoryDetail, ProductGroupDao productGroupDao, String locationCode,
			boolean checkInventory) {

		PriceResponseDto priceResponseDto = new PriceResponseDto();
		if (BooleanUtils.isFalse(checkInventory)) {
			priceResponseDto.setItemCode(itemDetail.getItemCode());
			priceResponseDto.setStdWeight(itemDetail.getStdWeight());
			priceResponseDto.setCheckInventory(checkInventory);
		} else {
			priceResponseDto.setBinCode(inventoryDetail.getBinCode());
			priceResponseDto.setInventoryId(inventoryDetail.getId());
			priceResponseDto.setItemCode(inventoryDetail.getItemCode());
			priceResponseDto.setLotNumber(inventoryDetail.getLotNumber());
			priceResponseDto.setStdWeight(inventoryDetail.getStdWeight());
		}

		priceResponseDto.setProductDesc(itemDetail.getDescription());
		priceResponseDto.setItemQuantity(measuredQuantity);
		priceResponseDto.setProductGroupDesc(productGroupDao.getDescription());
		priceResponseDto.setProductGroupCode(productGroupDao.getProductGroupCode());
		priceResponseDto.setItemTypeCode(productGroupDao.getItemType().getItemTypeCode());
		priceResponseDto.setPricingType(productGroupDao.getPricingType());

		PriceDetailsDto priceDetailDto = new PriceDetailsDto();
		priceResponseDto.setPriceDetails(priceDetailDto);

		/**
		 * included with tax, UI call to get tax percent and show actual price;
		 ***/
		Optional<LocationDao> locationDao = locationRepo.findById(locationCode);
		if (!locationDao.isPresent()) {
			throw new ServiceException(NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE, ERR_LOC_001,
					NO_LOCATION_DETAILS_FOUND_FOR_THE_REQUESTED_LOCATIONCODE + "-" + locationCode);
		}

		// add UCP factor to std value and then set final price
		MarketUcpPriceMappingDao marketUcpPriceMappingDao = marketUcpPriceMappingRepositoryExt
				.findByMarketDaoMarketCodeAndProductGroupCode(locationDao.get().getMarket().getMarketCode(),
						productGroupDao.getProductGroupCode());

		if (marketUcpPriceMappingDao != null) {
			priceResponseDto.setMarketUcpMarkupFactor(marketUcpPriceMappingDao.getMarkupFactor());

			priceResponseDto.setFinalValue(itemDetail.getStdValue().multiply(marketUcpPriceMappingDao.getMarkupFactor())
					.setScale(DomainConstants.PRICE_SCALE, DomainConstants.ROUNDIND_MODE));
		} else {
			if (measuredQuantity != null && measuredQuantity > 1 && measuredWeight.compareTo(BigDecimal.ONE) > 0) {
				itemDetail.setStdValue(itemDetail.getStdValue().multiply(BigDecimal.valueOf(measuredQuantity)));
			}
			priceResponseDto.setFinalValue(itemDetail.getStdValue());
		}

		return priceResponseDto;
	}

	private PriceResponseDto calculateNonUcpPrice(String locationCode, ItemDao itemDetail,
			InventoryDetailsDao inventoryDetail, ProductGroupDao productGroupDetail, Short measuredQuantity,
			BigDecimal measuredWeight, Map<String, StandardPriceResponseDto> standardPrice, Boolean checkInventory,
			Boolean isCOMPrice) {

		return priceFactory.getPriceCalculator(locationCode, itemDetail, inventoryDetail, productGroupDetail,
				measuredWeight, measuredQuantity, standardPrice, checkInventory, isCOMPrice).price(priceUtilService);
	}

	// get from item master

	private ItemDao getItemDetail(String itemCode) {
		ItemDao item = itemRepository.findByItemCode(itemCode);
		if (item == null) {
			throw new ServiceException("not a valid item", EngineConstants.ERR_PRO_002);
		}
		return item;

	}

	// get from inventory
	private InventoryDetailsDao getInventoryDetailForOthers(String itemCode, String lotNumber, String locationCode) {

		InventoryDetailsDao inventoryDetails = inventoryDetailRepository
				.findTopByLocationCodeAndItemCodeAndLotNumber(locationCode, itemCode, lotNumber);

		if (inventoryDetails == null) {
			throw new ServiceException("product not found in inventory", EngineConstants.ERR_PRO_002);
		}
		return inventoryDetails;
	}

	// get from product group master
	private ProductGroupDao getProductGroupDetails(String productGroupCode) {

		ProductGroupDao productGroup = productGroupRepository.findOneByProductGroupCode(productGroupCode);

		if (productGroup == null) {
			throw new ServiceException(" no product group details  ", EngineConstants.ERR_INV_014);
		}
		return productGroup;
	}

	@Override
	@Transactional
	public GepPriceResponseDto getGepPriceDetails(GepPriceRequest gepPriceRequest) {

		GepPriceResponseDto gepPriceResponseDto = new GepPriceResponseDto();
		Date businessDate = salesService.getBusinessDay(CommonUtil.getStoreCode()).getBusinessDate();
		getDeductionPercentage(gepPriceRequest, gepPriceResponseDto, businessDate);

		return priceUtilService.calculateGepPrice(gepPriceRequest, gepPriceResponseDto, businessDate);
	}

	/**
	 * @param gepPriceRequest
	 * @param gepPriceResponseDto
	 */
	private void getDeductionPercentage(GepPriceRequest gepPriceRequest, GepPriceResponseDto gepPriceResponseDto,
			Date businessDate) {

		GepRequestDetail gepRequestDetail = new GepRequestDetail();
		String locationCode = CommonUtil.getStoreCode();

		// when metalType is 'J', check minimum karat from location.
		chechMinPurity(gepPriceRequest, gepPriceResponseDto, locationCode);

		gepRequestDetail.setBuisnessDate(businessDate);
		gepRequestDetail.setMetalType(gepPriceRequest.getMetalType());
		gepRequestDetail.setPurity(gepPriceRequest.getMeasuredPurity());
		gepRequestDetail.setItemType(gepPriceRequest.getItemType());

		GepConfigDetailResponse gepConfigDetaill = configService.getGEPDetails(gepRequestDetail);

		if (gepConfigDetaill.getDeductionPercent() == null) {
			gepPriceResponseDto.setDeductionPercentage(BigDecimal.ZERO);
		} else {
			gepPriceResponseDto.setDeductionPercentage(gepConfigDetaill.getDeductionPercent());
		}
		if (gepConfigDetaill.getSchemePercent() == null) {
			gepPriceResponseDto.setSchemePercentage(BigDecimal.ZERO);
		} else {
			gepPriceResponseDto.setSchemePercentage(gepConfigDetaill.getSchemePercent());
		}

		gepPriceResponseDto.setStartDate(gepConfigDetaill.getStartDate());
		gepPriceResponseDto.setEndDate(gepConfigDetaill.getEndDate());
		gepPriceResponseDto.setConfigId(gepConfigDetaill.getConfigId());
		gepPriceResponseDto.setConfigCode(gepConfigDetaill.getConfigName());
		gepPriceResponseDto.setConfigType(gepConfigDetaill.getConfigType());
	}

	/**
	 * @param gepPriceRequest
	 * @param gepPriceResponseDto
	 * @param locationCode
	 */
	private void chechMinPurity(GepPriceRequest gepPriceRequest, GepPriceResponseDto gepPriceResponseDto,
			String locationCode) {
		if (MetalTypeCodeEnum.J.name().equalsIgnoreCase(gepPriceRequest.getMetalType())) {
			LocationCacheDto locationCacheDto = locationService.getStoreLocation(locationCode);
			BigDecimal inputKarat = gepPriceRequest.getMeasuredPurity()
					.divide(new BigDecimal(100), EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
					.multiply(new BigDecimal(EngineConstants.MAX_KARAT));
			gepPriceResponseDto.setKarat(inputKarat.setScale(EngineConstants.KARAT_SCALE, RoundingMode.HALF_UP));
			if (locationCacheDto.getGepDetails().getKaratAcceptedForGEP() != null && gepPriceResponseDto.getKarat()
					.compareTo(locationCacheDto.getGepDetails().getKaratAcceptedForGEP()) < 0) {
				BigDecimal validMinPurity = locationCacheDto
						.getGepDetails().getKaratAcceptedForGEP().divide(new BigDecimal(EngineConstants.MAX_KARAT),
								EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)
						.multiply(new BigDecimal(100)).setScale(2, RoundingMode.HALF_UP);
				throw new ServiceException("Please add purity greater than or equal to " + validMinPurity,
						"ERR-ENG-026", "Purity should not be less than: " + validMinPurity,
						Map.of("value", validMinPurity.toString()));
			}
		}
	}

	@Override
	public Map<String, StandardPriceResponseDto> getStandardMetalRate(String locationCode) {

		if (CommonUtil.isAStoreUser() && locationCode == null) {
			locationCode = CommonUtil.getLocationCode();
		}
		Date applicableDate = null;
		List<Object[]> metalRateList = null;
		try {
			applicableDate = salesService.getBusinessDay(locationCode).getBusinessDate();
		} catch (Exception e) {
			e.printStackTrace();
			if (applicableDate == null) {
				applicableDate = CalendarUtils.getCurrentDate();
			}
		}

		metalRateList = findMetalRate(applicableDate, null, locationCode);
		return mapToStandardPriceDto(metalRateList);

	}

	/**
	 * @param metalRateList
	 */
	private Map<String, StandardPriceResponseDto> mapToStandardPriceDto(List<Object[]> metalRateList) {
		Map<String, StandardPriceResponseDto> standardMaterialPrice = new HashMap<>();

		if (metalRateList == null || metalRateList.isEmpty()) {
			throw new ServiceException(NO_METAL_RATE_SET_FOR_THE_DAY, ERR_CORE_003, "METAL RATE UNAVAILABLE");
		}

		for (Object[] obj : metalRateList) {

			StandardPriceResponseDto standardPriceReponse = new StandardPriceResponseDto();

			standardPriceReponse.setApplicableDate((Date) obj[6]);
			standardPriceReponse.setCurrency((String) obj[7]);
			standardPriceReponse.setMetalTypeCode((String) obj[0]);
			standardPriceReponse.setPurity((BigDecimal) obj[4]);
			standardPriceReponse.setKarat((BigDecimal) obj[3]);

			// decimal to int
			standardPriceReponse.setRatePerUnit((BigDecimal) obj[5]);

			standardMaterialPrice.put(standardPriceReponse.getMetalTypeCode(), standardPriceReponse);
		}

		return standardMaterialPrice;

	}

	/**
	 * @param metalRateList
	 */
	private List<Object[]> findMetalRate(Date applicableDate, Boolean isDisplayed, String locationCode) {
		// boutique call for applicabledate rate
		if (applicableDate == null) {
			return metalPriceLocationMappingRepository.findAllByLocationCodeAndCurrentDate(locationCode,
					CalendarUtils.formatDateToSql(CalendarUtils.getCurrentDate()));
		} else {
			return metalPriceLocationMappingRepository.getMetalRate(true, locationCode,
					CalendarUtils.formatDateToSql(applicableDate), BigDecimal.ONE, isDisplayed);
		}

	}

	/**
	 * @param metalPrice
	 */
	private void saveToDb(MetalPriceLocationMappingDto metalPrice) {
		MetalPriceConfigDao metalPriceConfig = saveToMetalConfig(metalPrice);

		saveToMetalPriceLocation(metalPrice, metalPriceConfig);

	}

	/**
	 * @param metalPrice
	 */
	private MetalPriceConfigDao saveToMetalConfig(MetalPriceLocationMappingDto metalPrice) {
		MetalPriceConfigDao metalPriceConfig = (MetalPriceConfigDao) MapperUtil.getObjectMapping(metalPrice,
				new MetalPriceConfigDao());

		String currency = locationService.getCountryDetails(CommonUtil.getLocationCode()).getCurrencyCode();
		metalPriceConfig.setCurrencyCode(currency);

		metalPriceConfig.setId(metalPrice.getMetalPriceConfigId());

		return metalPriceConfigRepo.save(metalPriceConfig);

	}

	/**
	 * @param metalPrice
	 */
	private void saveToMetalPriceLocation(MetalPriceLocationMappingDto metalPrice,
			MetalPriceConfigDao metalPriceConfig) {

		MarketDao market = getMarket(metalPrice.getMarketCode());
		LocationDao location = getLocation(metalPrice.getLocationCode());
		LOGGER.info("latestLocation:{}", location);
		saveToMetalPriceLocation(metalPrice, metalPriceConfig, market, location);
		saveToMetalPriceLocationHistory(metalPrice, metalPriceConfig, market, location);

	}

	/**
	 * @param metalPrice
	 * @param metalPriceConfig
	 * @param market
	 * @param location
	 */
	private void saveToMetalPriceLocationHistory(MetalPriceLocationMappingDto metalPrice,
			MetalPriceConfigDao metalPriceConfig, MarketDao market, LocationDao location) {

		MetalPriceLocationHistoryDao metalPriceLocation = (MetalPriceLocationHistoryDao) MapperUtil
				.getObjectMapping(metalPrice, new MetalPriceLocationHistoryDao());
		metalPriceLocation.setMetalPriceConfig(metalPriceConfig);
		metalPriceLocation.setMarket(market);
		metalPriceLocation.setLocation(location);
		metalPriceLocation.setMarket(market);
		metalPriceLocationHistoryRepository.save(metalPriceLocation);

	}

	private void saveToMetalPriceLocation(MetalPriceLocationMappingDto metalPrice, MetalPriceConfigDao metalPriceConfig,
			MarketDao market, LocationDao location) {
		MetalPriceLocationMappingDao metalPriceLocation = (MetalPriceLocationMappingDao) MapperUtil
				.getObjectMapping(metalPrice, new MetalPriceLocationMappingDao());
		metalPriceLocation.setSyncTime(new Date().getTime());
		metalPriceLocation.setMetalPriceConfig(metalPriceConfig);
		metalPriceLocation.setMarket(market);
		metalPriceLocation.setLocation(location);
		metalPriceLocation.setMarket(market);
		LOGGER.info("latestMarket before save:{}", market);
		LOGGER.info("latestLocation before save:{}", location);
		metalPriceLocationMappingRepository.save(metalPriceLocation);
	}

	/**
	 * @param locationCode
	 * @return
	 */
	private LocationDao getLocation(String locationCode) {
		return locationRepo.findOneByLocationCode(locationCode);
	}

	/**
	 * @param marketCode
	 * @return
	 */
	private MarketDao getMarket(String marketCode) {
		return marketRepo.findOneByMarketCode(marketCode);
	}

	private JsonNode convertToJsonNode(Response response) {

		JsonNode jsonNode = null;
		try {
			jsonNode = new ObjectMapper().readTree(
					IOUtils.toString(response.body().asInputStream(), String.valueOf(StandardCharsets.UTF_8)));
		} catch (IOException e) {
			throw new ServiceException(JSON_DATA_FORMAT_ERROR, ERR_CORE_013, e);
		}
		return jsonNode;
	}

	@Override
	public ListResponse<MetalRateDto> getMetalRate(Date businessDate) {

		List<Object[]> metalRateList = null;
		Date applicaDate = (null != businessDate) ? businessDate
				: salesService.getBusinessDay(CommonUtil.getLocationCode()).getBusinessDate();
		// for applicable date
		metalRateList = metalPriceLocationMappingRepository.getMetalRate(true, CommonUtil.getLocationCode(),
				CalendarUtils.formatDateToSql(applicaDate), null, true);

		List<MetalRateDto> metalRateDtoList = new ArrayList<>();

		if (metalRateList.isEmpty()) {
			return new ListResponse<>(metalRateDtoList);
		}
		String unit = locationService.getCountryDetails(CommonUtil.getLocationCode()).getWeightUnit();
		for (Object[] obj : metalRateList) {

			MetalRateDto metalRateDto = new MetalRateDto();
			metalRateDto.setMetalTypeCode((String) obj[0]);
			metalRateDto.setMetalName((String) obj[1]);
			metalRateDto.setOffset((BigDecimal) obj[2]);
			metalRateDto.setKaratage((BigDecimal) obj[3]);
			metalRateDto.setPurity((BigDecimal) obj[4]);
			metalRateDto.setApplicableDate((Date) obj[6]);
			metalRateDto.setCurrency((String) obj[7]);
			metalRateDto.setUnit(unit);

			BigDecimal metalRate = (BigDecimal) obj[5];

			metalRateDto.setRatePerUnit(metalRate.multiply(metalRateDto.getOffset())
					.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));

			metalRateDtoList.add(metalRateDto);
		}

		return new ListResponse<>(metalRateDtoList);
	}

	@Override
	@Transactional // [added for fetching getMaterialPriceConfig()_getMaterialPriceType()]
	public ListResponse<HistoryPriceResponse> getStandardHistoryPrice(MetalPriceRequestDto metalPriceRequest) {

		List<Object[]> metalRateList = null;
		if (StringUtils.isEmpty(metalPriceRequest.getLocationCode())) {
			metalPriceRequest.setLocationCode(CommonUtil.getLocationCode());
		}

		String sortParameter = null;
		int pageSize = Integer.MAX_VALUE;

		List<HistoryPriceResponse> historyPriceList = new ArrayList<>();

		if (metalPriceRequest.getSortParam() == null) {
			sortParameter = "createdDate ASC";
		} else if (metalPriceRequest.getSortParam().equals("FIRST")) {
			// get first record in ascending
			sortParameter = "createdDate ASC";
			pageSize = 1;
		} else if (metalPriceRequest.getSortParam().equals("LAST")) {
			// get first record in ascending
			sortParameter = "createdDate DESC";
			pageSize = 1;
		}
		if (CommonUtil.isEpossApp()) {
			metalRateList = metalPriceLocationHistoryRepository.findByAllCombination(metalPriceRequest.getMetalType(),
					CalendarUtils.formatDateToSql(metalPriceRequest.getApplicableDate()),
					metalPriceRequest.getLocationCode(), BigDecimal.ONE, sortParameter, 0, pageSize);
		} else {
			metalRateList = metalPriceLocationHistoryRepository.findByAllCombinationAtPoss(
					metalPriceRequest.getMetalType(),
					CalendarUtils.formatDateToSql(metalPriceRequest.getApplicableDate()),
					metalPriceRequest.getLocationCode(), BigDecimal.ONE, sortParameter, 0, pageSize);
		}

		if (metalRateList.isEmpty()) {
			throw new ServiceException("metal Price not available for applicable given applicable date", "ERR-LOC-039");
		}

		for (Object[] obj : metalRateList) {

			HistoryPriceResponse historyPriceReponse = new HistoryPriceResponse();

			historyPriceReponse.setApplicableDate((Date) obj[6]);
			historyPriceReponse.setCurrency((String) obj[7]);
			historyPriceReponse.setMetalTypeCode((String) obj[0]);
			historyPriceReponse.setRatePerUnit((BigDecimal) obj[5]);
			historyPriceReponse.setPriceType((String) obj[8]);
			historyPriceReponse.setPurity((BigDecimal) obj[4]);
			historyPriceList.add(historyPriceReponse);
		}

		return new ListResponse<>(historyPriceList);

	}

	@Override
	public Map<String, StandardPriceResponseDto> getAvailableMetalRate(StandardMetalRateDto metalRateDtoRequest) {

		List<Object[]> metalRateList = null;
		// check metal rate in boutique
		metalRateList = findMetalRate(metalRateDtoRequest.getBusinessDate(), null, CommonUtil.getLocationCode());

		if (metalRateList == null || metalRateList.isEmpty()) {
			List<MetalPriceLocationMappingDto> metalPriceLocationList;
			MetalPriceConfigRequestDto metalPriceLocationRequestDto = new MetalPriceConfigRequestDto();

			metalPriceLocationRequestDto.setApplicableDate(metalRateDtoRequest.getBusinessDate());
			// check the max retry for the given buisness date
			// increment the count onlt if UI triggers through rety attempt button
			if (metalRateDtoRequest.getIsRetryAttempted() != null && metalRateDtoRequest.getIsRetryAttempted()) {
				checkAndIncrementCount(metalRateDtoRequest);
			}

			// get metal rate from eposs
			Response response = intgService.getMetalPriceLocationList(HttpMethod.POST, LOCATION_EPOSS_API_URL, null,
					metalPriceLocationRequestDto);
			int epossHTTPStatus = response.status();

			if (epossHTTPStatus == HttpStatus.OK.value()) {
				JsonNode jsonNode = convertToJsonNode(response);
				JsonNode dataNode1 = jsonNode.path("response");
				JsonNode dataNode = dataNode1.path("metalPriceList");

				try {

					metalPriceLocationList = Arrays.asList(
							new ObjectMapper().readValue(dataNode.toString(), MetalPriceLocationMappingDto[].class));

					for (MetalPriceLocationMappingDto metalPrice : metalPriceLocationList) {
						saveToDb(metalPrice);
					}

					// get updated metal rate
					metalRateList = findMetalRate(metalRateDtoRequest.getBusinessDate(), null,
							CommonUtil.getLocationCode());

				} catch (IOException e) {
					throw new ServiceException("ERR-ENG-001", "Invalid Json Data");
				}

			} else {
				throw new ServiceException(NO_METAL_RATE_SET_FOR_THE_DAY, ERR_CORE_003,
						NO_METAL_RATE_SET_FOR_THE_DAY + " for location " + CommonUtil.getLocationCode());
			}

		}
		return mapToStandardPriceDto(metalRateList);
	}

	/**
	 * @param businessDate
	 */
	private void checkAndIncrementCount(StandardMetalRateDto businessDate) {
		BusinessDayDao buisnessDao = buisnessRepo.findByLocationCodeAndBusinessDate(CommonUtil.getLocationCode(),
				businessDate.getBusinessDate());
		if (buisnessDao == null) {
			throw new ServiceException("No Combination available for Location:--" + CommonUtil.getLocationCode()
					+ "BuisnessDate:--" + businessDate.getBusinessDate(), "ERR-ENG-024 ");
		}
		Short rateFetchAttempts = buisnessDao.getRateFetchAttempts();

		LocationResponseDto locationResponse = locationService.listLocationByLocationCode(CommonUtil.getLocationCode());
		StoreDetails storeDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(locationResponse.getStoreDetails().getData(), StoreDetails.class);

		if (rateFetchAttempts == null) {
			rateFetchAttempts = 0;
		} else if (rateFetchAttempts >= storeDetails.getMaxRateRetryAttempt()) {
			throw new ServiceException("reached max configuration Limit: please contact admin", "ERR-ENG-023");
		} else {
			rateFetchAttempts = (short) (rateFetchAttempts.intValue() + 1);
		}
		buisnessDao.setRateFetchAttempts(rateFetchAttempts);
		buisnessRepo.save(buisnessDao);

	}

	@Override
	public TepPriceResponseDto getTepPriceDetails(TepPriceRequest tepPriceRequest) {
		TepConfigurations tepCofigReponse;
		// TODO error msg update required
//		if (StringUtils.isEmpty(tepPriceRequest.getCustomerMobileNo())
//				&& (StringUtils.isEmpty(tepPriceRequest.getCustomerType())
//						|| !tepPriceRequest.getCustomerType().equalsIgnoreCase("ONETIME"))) {
//			throw new ServiceException("customer details mandatory ", "ERR-CORE-056");
//		}
		// validate item from itemmaster
		ItemDao itemDto = getItemDetail(tepPriceRequest.getItemCode());

		if (itemDto.getPricingType() == null) {
			throw new ServiceException("no pricing type available", "ERR-CORE-036");
		}
		// converting gms to carat for 74 product grp code ,to fix 3449 issue.
		if (itemDto.getProductGroup().getProductGroupCode().equals("74")) {
			itemDto.setStdWeight(itemDto.getStdWeight().multiply(new BigDecimal(0.2))
					.setScale(EngineConstants.WEIGHT_SCALE, RoundingMode.HALF_UP));
		}
		ProductGroupDao productGroupDto = getProductGroupDetails(itemDto.getProductGroup().getProductGroupCode());

		CashMemoDetailsDao cashMemo = null;
		if (tepPriceRequest.getCashMemoDetailsId() != null) {
			// check if cashmemo is available..
			Optional<CashMemoDetailsDao> cms = cmRepo.findById(tepPriceRequest.getCashMemoDetailsId());
			if (cms.isPresent()) {
				cashMemo = cms.get();
			}
		}

		tepCofigReponse = getTepConfigurations(tepPriceRequest, itemDto, productGroupDto);

		// no exception details available or percentage is available
		// get configuration from tep
		// configService.getTepStone(tepStoneRequestDto)
		// apply exception Percentage on tepCalculatedPrice
		return teppriceFactory.getPriceCalculator(CommonUtil.getLocationCode(), itemDto, productGroupDto,
				tepPriceRequest, tepCofigReponse, cashMemo).price(tepPriceUtilService);

	}

	private TepConfigurations getTepConfigurations(TepPriceRequest tepPriceRequest, ItemDao itemDto,
			ProductGroupDao productGroupDto) {
		ItemLotStoneListDto stoneList = null;
		TepConfigurations tepCofigReponse = new TepConfigurations();
		// get item level configgetItemLevelConfig
		TepItemResponseDto tepItemResponse = getItemLevelConfig(tepPriceRequest);
		tepCofigReponse.setItemLevelConfig(tepItemResponse);
		// get stone level config
		// get stone list, as stone details will not be available in cash-memo
		// for UCP stoneList is ignored

		if (!itemDto.getPricingGroupType().equals(PricingTypeEnum.UCP.toString())) {
			if (productGroupDto.getPlainStudded().equals(PlainStuddedEnum.S.toString())) {
				stoneList = getStoneDetails(tepPriceRequest);
				tepCofigReponse.setStoneList(stoneList);
				ListResponse<TepStoneResponseDto> stoneLevelConfig = getStoneLevelConfig(tepPriceRequest, stoneList);
				tepCofigReponse.setStoneLeveLConfig(stoneLevelConfig);
			}
		}
		if (itemDto.getPricingGroupType().equals(PricingTypeEnum.UCP.toString())) {
			stoneList = null;
		}

		// validate Bi-metal
		validateBiMetal(itemDto, tepCofigReponse, tepPriceRequest.getCashMemoDetailsId(), productGroupDto);
		return tepCofigReponse;
	}

	private void validateBiMetal(ItemDao itemDto, TepConfigurations tepCofigReponse, String cashMemoDetailsId,
			ProductGroupDao productGroupDto) {
		if ("B5".equals(itemDto.getProductGroup().getProductGroupCode())
				|| "B6".equals(itemDto.getProductGroup().getProductGroupCode())) {
			if (Boolean.FALSE.equals(tepCofigReponse.getItemLevelConfig().getIsCMMandatory())) {
				throw new ServiceException(
						"Cashmemo is mandatory for {metalType}, isCMMandatory configured : {cMMandatory}.",
						"ERR-ENG-034",
						Map.of("metalType",
								MetalTypeCodeEnum.valueOf(productGroupDto.getItemType().getItemTypeCode()).getValue(),
								"cMMandatory", tepCofigReponse.getItemLevelConfig().getIsCMMandatory()));
			}
			if (cashMemoDetailsId == null)
				throw new ServiceException("No cashMemo details found for {metalType}.", "ERR-ENG-035",
						Map.of("metalType",
								MetalTypeCodeEnum.valueOf(productGroupDto.getItemType().getItemTypeCode()).getValue()));
		}

	}

	private ListResponse<TepStoneResponseDto> getStoneLevelConfig(TepPriceRequest tepPriceRequest,
			ItemLotStoneListDto stoneList) {

		Set<TepStoneDto> stoneDetails = new HashSet<>();
		stoneList.getLotStoneDetails().forEach(lotStone -> {
			TepStoneDto tepDto = new TepStoneDto();
			tepDto.setCarat(lotStone.getStoneWeight());
			tepDto.setStoneCode(lotStone.getStoneCode());
			tepDto.setStoneTypeCode(lotStone.getStoneTypeCode());
			tepDto.setStoneQuality(lotStone.getStoneQuality());
			stoneDetails.add(tepDto);
		});

		TepStoneRequestDto request = new TepStoneRequestDto();
		request.setCustomerMobileNo(tepPriceRequest.getCustomerMobileNo());
		request.setStonesDetails(stoneDetails);
		return configService.getTepStone(request);

	}

	private ItemLotStoneListDto getStoneDetails(TepPriceRequest tepPriceRequest) {
		ItemLotStoneListDto stoneList;
		// engine client get from local
		// if null call eposs- integration
		stoneList = productService.getLotItemStonesWithDICheck(tepPriceRequest.getItemCode(),
				tepPriceRequest.getLotNumber(), false, true);

		if (stoneList == null) {
			if (tepPriceRequest.getItemCode() != null) {
				// call integration
				stoneList = callTEPPricingIntegration(tepPriceRequest.getItemCode(), tepPriceRequest.getLotNumber());
			}
			if (stoneList == null) {
				throw new ServiceException("No stones available for the requested ItemCode", "ERR-ENG-017");
			}
		}
		return stoneList;
	}

	private TepItemResponseDto getItemLevelConfig(TepPriceRequest tepPriceRequest) {
		TepItemResponseDto tepItemResponse = configService.getTepItem(tepPriceRequest.getItemCode(),
				tepPriceRequest.getCustomerMobileNo(), tepPriceRequest.getTepType(), tepPriceRequest.getIsDummyCode());
		if (tepItemResponse == null) {
			throw new ServiceException("No Item Level TEP configurations found", "ERR-ENG-018");
		}
		return tepItemResponse;
	}

	public ItemLotStoneListDto callTEPPricingIntegration(String itemCode, String lotNumber) {

		// isFromReversal

		Map<String, String> reqParams = new HashMap<>();
		if (lotNumber == null) {
			reqParams.put("itemCode", String.valueOf(itemCode));
		} else {
			reqParams.put("itemCode", String.valueOf(itemCode));
			reqParams.put("lotNumber", String.valueOf(lotNumber));
		}

		// calling eposs integration service
		ApiResponseDto epossApiResponseDto = callIntegration(HttpMethod.GET, EngineConstants.LOT_DETAILS_GET_URL,
				reqParams, null);

		return MapperUtil.getObjectMapperInstance().convertValue(epossApiResponseDto.getResponse(),
				ItemLotStoneListDto.class);

	}

	private ApiResponseDto callIntegration(HttpMethod httpMethod, String relativeUrl,
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
	public CutPieceTepPriceResponseDto getCutPieceTepPriceDetails(TepPriceRequest tepPriceRequest) {
		// validate item from itemmaster
		ItemDao itemDto = getItemDetail(tepPriceRequest.getItemCode());

		InventoryDetailsDao invDetails = getInventoryDetailForOthers(tepPriceRequest.getItemCode(),
				tepPriceRequest.getLotNumber(), CommonUtil.getLocationCode());

		if (itemDto.getPricingType() == null) {
			throw new ServiceException("no pricing type available", "ERR-CORE-036");
		}
		ProductGroupDao productGroupDto = getProductGroupDetails(itemDto.getProductGroup().getProductGroupCode());
		tepPriceRequest.setStandardPrice(getStandardMetalRate(CommonUtil.getLocationCode()));
		TepConfigurations tepCofigReponse = getTepConfigurations(tepPriceRequest, itemDto, productGroupDto);

		BigDecimal makingCharges = BigDecimal.ZERO;
		BigDecimal netWeight = BigDecimal.ZERO;
		BigDecimal itemValue = BigDecimal.ZERO;
		BigDecimal soldItemValue = BigDecimal.ZERO;
		BigDecimal TOTValue = BigDecimal.ZERO;
		BigDecimal cutPieceValue = BigDecimal.ZERO;
		BigDecimal stoneWeight = BigDecimal.ZERO;
		BigDecimal stoneValue = BigDecimal.ZERO;

		MetalPriceDetailsDto metalPriceDetails = new MetalPriceDetailsDto();
		StonePriceDetailsDto stonePriceDetails = new StonePriceDetailsDto();
		MakingChargeDetailsDto makingChargeDetails = new MakingChargeDetailsDto();

		if (productGroupDto.getPricingType().equals(EngineConstants.PLAIN)
				|| productGroupDto.getPricingType().equals(EngineConstants.PJWS)) {
			TepPriceResponseDto priceResponseData = new TepPriceResponseDto();
			netWeight = invDetails.getTotalWeight();
			priceResponseData.setNetWeight(invDetails.getTotalWeight());
			priceResponseData.setMetalPriceDetails(metalPriceDetails);
			priceResponseData.setMakingChargeDetails(makingChargeDetails);
			priceResponseData.getMetalPriceDetails().setPreDiscountValue(invDetails.getTotalValue());
			priceResponseData.setProductGroupCode(productGroupDto.getProductGroupCode());
			priceResponseData = tepPriceUtilService.plainF2Calculation(priceResponseData, CommonUtil.getLocationCode(),
					null, tepCofigReponse, itemDto);
			makingCharges = priceResponseData.getMakingChargeDetails().getPreDiscountValue();

		} else if (productGroupDto.getPricingType().equals(EngineConstants.STUDDED)
		/* || productGroupDto.getPricingType().equals(EngineConstants.PJWS) */) {
			TepPriceResponseDto priceResponseData = new TepPriceResponseDto();
			priceResponseData.setStonePriceDetails(stonePriceDetails);
			priceResponseData.setMetalPriceDetails(metalPriceDetails);
			priceResponseData.setMakingChargeDetails(makingChargeDetails);
			tepPriceUtilService.setStoneDetails(new TepPriceRequest(), priceResponseData, tepCofigReponse);
			stoneValue = getStoneValue(invDetails.getItemDetails());
			priceResponseData.getStonePriceDetails().setPreDiscountValue(stoneValue);
			priceResponseData.setProductGroupCode(productGroupDto.getProductGroupCode());
			priceResponseData.getMetalPriceDetails()
					.setPreDiscountValue(invDetails.getTotalValue().subtract(stoneValue));
			priceResponseData = tepPriceUtilService.studdedF2Calculation(priceResponseData,
					CommonUtil.getLocationCode(), null, tepCofigReponse, itemDto);
			makingCharges = priceResponseData.getMakingChargeDetails().getPreDiscountValue();
			stoneWeight = getStoneWeight(invDetails.getTotalWeightDetails());
			netWeight = invDetails.getTotalWeight().subtract(stoneWeight);
		}

		BigDecimal cutPieceWeight = tepPriceRequest.getMeasuredWeight();
		BigDecimal netWtAfterCutPiece = netWeight.subtract(cutPieceWeight); // TotalWt - cutPieceWt
		BigDecimal goldRateSet = tepPriceRequest.getStandardPrice().get(MetalTypeCodeEnum.J.name()).getRatePerUnit();
		BigDecimal ntWtMinusCtPcWt = netWeight.subtract(cutPieceWeight);

		if (Boolean.TRUE.equals(CustomSecurityPrincipal.getSecurityPrincipal().isAnL3StoreUser())) {
			// (goldRate* netWeight)+makingCharge
			itemValue = (goldRateSet.multiply(netWeight)).add(makingCharges).setScale(EngineConstants.VALUE_SCALE,
					RoundingMode.HALF_UP);

			// (netWeight - cutPieceWt)*goldRate + (((netWeight -
			// cutPieceWt)/netWeight))*makingCharge
			soldItemValue = (ntWtMinusCtPcWt).multiply(goldRateSet)
					.add((ntWtMinusCtPcWt.divide(netWeight, EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP))
							.multiply(makingCharges))
					.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);

//				BigDecimal cutPieceTOTValue = makingCharges
//						.multiply(tepCofigReponse.getItemLevelConfig().getTepCutPieceConfig().getL3DeductionPercent())
//						.divide(BigDecimal.valueOf(100),EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP);

			// (TOT%)*(cutPieceWt/netWeight)*MakingCharges
			if (tepCofigReponse.getItemLevelConfig().getTepCutPieceConfig() != null) {
				TOTValue = (tepCofigReponse.getItemLevelConfig().getTepCutPieceConfig().getL3DeductionPercent().divide(
						BigDecimal.valueOf(100), EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP)).multiply(
								cutPieceWeight.divide(netWeight, EngineConstants.DIVISION_SCALE, RoundingMode.HALF_UP))
								.multiply(makingCharges).setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
			}

			cutPieceValue = itemValue.subtract(soldItemValue).subtract(TOTValue);
		} else {
			// (goldRate*netWeight)+ makingCharge
			itemValue = (goldRateSet.multiply(netWeight)).add(makingCharges);
			// (netWeight-cutPieceWt)*goldRate+((netWeight-cutPieceWt)/netWeight)*makingCharge
			soldItemValue = ((ntWtMinusCtPcWt)).multiply(goldRateSet)
					.add(((ntWtMinusCtPcWt).divide(netWeight, EngineConstants.WEIGHT_SCALE, RoundingMode.HALF_UP))
							.multiply(makingCharges))
					.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);

			cutPieceValue = itemValue.subtract(soldItemValue).setScale(EngineConstants.VALUE_SCALE,
					RoundingMode.HALF_UP);
		}

		CutPieceTepPriceResponseDto cutPieceTepPriceResponseDto = new CutPieceTepPriceResponseDto();
		cutPieceTepPriceResponseDto.setItemCode(invDetails.getItemCode());
		cutPieceTepPriceResponseDto.setLotNumber(invDetails.getLotNumber());
		cutPieceTepPriceResponseDto.setCutPieceWeight(tepPriceRequest.getMeasuredWeight());
		cutPieceTepPriceResponseDto.setProductGroupCode(productGroupDto.getProductGroupCode());
		cutPieceTepPriceResponseDto.setNetWeight(netWeight.add(stoneWeight));
		cutPieceTepPriceResponseDto.setNetWeightAfterCutPiece(netWtAfterCutPiece.add(stoneWeight));
		cutPieceTepPriceResponseDto.setItemValue(itemValue);
		cutPieceTepPriceResponseDto.setSoldItemValue(soldItemValue.add(stoneValue));
		cutPieceTepPriceResponseDto.setTOTValue(TOTValue);
		cutPieceTepPriceResponseDto.setCutPieceValue(cutPieceValue);
		cutPieceTepPriceResponseDto.setKarat(invDetails.getKarat());

		return cutPieceTepPriceResponseDto;
	}

	private BigDecimal getStoneValue(String itemDetails) {
		if (itemDetails != null) {
			JsonNode root;
			JsonNode dataNode = null;
			InventoryItemDetailsDto itemDetailsImp = null;
			try {
				root = MapperUtil.getObjectMapperInstance().readTree(itemDetails);
				dataNode = root.path("data");
				itemDetailsImp = MapperUtil.getObjectMapperInstance().convertValue(dataNode,
						InventoryItemDetailsDto.class);

			} catch (IOException e) {
				throw new ServiceException("UNABLE_TO_PARSE_JSON", "ERR_CORE_003");
			}

			if (itemDetailsImp != null) {
				return itemDetailsImp.getStoneValue();
			}

		}
		return BigDecimal.ZERO;
	}

	private BigDecimal getStoneWeight(String invWeightDetails) {
		BigDecimal stoneWeight = BigDecimal.ZERO;
		if (invWeightDetails != null) {
			JsonNode root;
			JsonNode dataNode = null;
			WeightDetailsDto itemDetailsImp = null;
			try {
				root = MapperUtil.getObjectMapperInstance().readTree(invWeightDetails);
				dataNode = root.path("data");
				itemDetailsImp = MapperUtil.getObjectMapperInstance().convertValue(dataNode, WeightDetailsDto.class);

			} catch (IOException e) {
				throw new ServiceException("UNABLE_TO_PARSE_JSON", "ERR_CORE_003");
			}

			if (itemDetailsImp != null) {
				stoneWeight = itemDetailsImp.getStoneWeight().add(itemDetailsImp.getDiamondWeight());
			}

		}
		return stoneWeight;
	}

	// *********************CUSTOMER ORDER PRICE
	// API****************************************//

	public PriceResponseDto getCOPriceDetails(OrdersPriceRequest orderPriceRequest, String locationCode) {

		log.info("destination location is ......{}", locationCode);
		if (CommonUtil.isAStoreUser() && locationCode == null) {
			locationCode = CommonUtil.getLocationCode();
		}

		Boolean isUcp = false;
		PriceResponseDto price = null;
		ItemDao itemDto = new ItemDao();
		InventoryDetailsDao inventoryDetail = new InventoryDetailsDao();

		log.info(
				"Calculate price at location: {} for item: {}, lot: {}, invId: {}, measured weight: {}, measured quantity: {}",
				locationCode, orderPriceRequest.getItemCode(), orderPriceRequest.getLotNumber(),
				orderPriceRequest.getInventoryId(), orderPriceRequest.getMeasuredWeight(),
				orderPriceRequest.getMeasuredQuantity());

		itemDto = getItemDetail(orderPriceRequest.getItemCode());

		ProductGroupDao productGroupDto = getProductGroupDetails(itemDto.getProductGroup().getProductGroupCode());
		// product group config details
		ProductGroupConfig productGroupConfigDetails = MapperUtil.mapJsonDataToClass(productGroupDto.getConfigDetails(),
				ProductGroupConfig.class);

		// Checking if item is a B5 or B6 (bimetal) product
		// throwing error incase when a Bimetal item not there in inventory
		if (productGroupDto.getProductGroupCode().equalsIgnoreCase("B5")
				|| productGroupDto.getProductGroupCode().equalsIgnoreCase("B6")) {
			throw new ServiceException(ITEM_NOT_THERE_IN_STOCK, ERR_COM_013);
		}

		if (itemDto.getPricingType() == null) {
			throw new ServiceException("no pricing type available", "ERR-CORE-036");
		}
		String currencyCode = locationService.listLocationByLocationCode(locationCode).getStockCurrency();
		if (itemDto.getPricingType().equals(EngineConstants.NON_UCP)) {
			price = calculateNonUcpPrice(locationCode, itemDto, inventoryDetail, productGroupDto,
					orderPriceRequest.getMeasuredQuantity(), orderPriceRequest.getMeasuredWeight(),
					orderPriceRequest.getStandardPrice(), orderPriceRequest.getCheckInventory(),
					orderPriceRequest.getIsComPrice());

			validateMandatoryPrice(price);
			price.setCurrencyCode(currencyCode);

		} else if (itemDto.getPricingType().equals(EngineConstants.UCP)) {

			price = calculateUcpPrice(itemDto, orderPriceRequest.getMeasuredQuantity(),
					orderPriceRequest.getMeasuredWeight(), inventoryDetail, productGroupDto, locationCode,
					orderPriceRequest.getCheckInventory());

			// price = calculateUcpPrice(itemDto, inventoryDetail, productGroupDto,
			// locationCode,orderPriceRequest.getCheckInventory());
			price.setCurrencyCode(currencyCode);
			isUcp = true;
			// set if its ucp or non ucp
			price.getPriceDetails().setIsUcp(isUcp);

		}

		if (price != null && price.getPriceDetails() != null) {

			price.getPriceDetails()
					.setPrintGuranteeCard(productGroupConfigDetails == null
							|| productGroupConfigDetails.getPrintGuranteeCard() == null ? Boolean.FALSE
									: productGroupConfigDetails.getPrintGuranteeCard());
			// set item type code
			price.getPriceDetails().setItemTypeCode(price.getItemTypeCode());

			// if isDynamic field in making charge details is null, then set it as false.
			if (price.getPriceDetails().getMakingChargeDetails() != null
					&& price.getPriceDetails().getMakingChargeDetails().getIsDynamic() == null) {
				price.getPriceDetails().getMakingChargeDetails().setIsDynamic(false);
			}
		}

		return price;
	}

	/**
	 * Find Price
	 */
	public PriceResponseDto findPrice(OrdersPriceRequest orderPriceRequest, String locationCode) {

		// if measured weight is passed then measured qty is must
		// multimetal - not needed
		InventoryDetailsDao inventoryDetail = null;
		if (!StringUtils.isEmpty(orderPriceRequest.getInventoryId())) {
			inventoryDetail = inventoryDetailRepository.findByIdAndLocationCodeAndTotalQuantityGreaterThan(
					orderPriceRequest.getInventoryId(), locationCode, (short) 1);
		}
		if (StringUtils.isEmpty(orderPriceRequest.getLotNumber()) && inventoryDetail == null) {
			// when no lot number is present -- Item is not there in inventory.

			// This is to set measured weight from itemMaster when in the measured weight
			// input is NULL
			orderPriceRequest.setCheckInventory(Boolean.FALSE);

			log.info("Calling CO Price API...............");
			return getCOPriceDetails(orderPriceRequest, locationCode);
		} else {
			// when there is lot number -- Item picked from inventory
			// This is set to FALSE in order to eliminate weight Tolerance check when an
			// item
			// is picked from Inventory
			orderPriceRequest.setIsComPrice(Boolean.FALSE);

			// CheckInventory is set to TRUE because incase of item from inventory measured
			// weight should
			// be calculated in getMeasuredStandardWeight() method
			orderPriceRequest.setCheckInventory(Boolean.TRUE);

			log.info("Calling AB Price API...............");
			return getPriceDetails(orderPriceRequest, locationCode);
		}
	}

	@Override
	public ListResponse<MetalRateDto> getMetalPriceDetails(Date businessDate) {
		return getMetalRate(businessDate);
	}

	@Override
	public List<PriceResponseDto> getConversionPriceDetails(OrdersPriceRequest orderPriceRequest, String locationCode) {

		// TODO Auto-generated method stub
		PriceResponseDto price = null;
		BigDecimal childTotalValue = BigDecimal.ZERO;

		log.info("destination location is ......{}", locationCode);
		if (CommonUtil.isAStoreUser() && locationCode == null) {
			locationCode = CommonUtil.getLocationCode();
		}

		if (orderPriceRequest.getInventoryId() != null && !orderPriceRequest.getInventoryId().isEmpty()) {
			InventoryDetailsDao inventoryDetail = inventoryDetailRepository
					.findByIdAndLocationCodeAndTotalQuantityGreaterThan(orderPriceRequest.getInventoryId(),
							locationCode, (short) 0);
			if (inventoryDetail == null) {
				throw new ServiceException(
						"Parent Item Code is not found in inventory. So conversion cannot be done for this item",
						EngineConstants.ERR_PRO_048);
			}
		}
		
		List<PriceResponseDto> childPriceItems = new ArrayList<>();
		/* 1. First Fetch Child Items based on parent items
		   2. If Child Items Available, then calculate price for parent and child items */
		ConversionItemDto conversionItemDto = productClient.listItems(orderPriceRequest.getItemCode(),
				orderPriceRequest.getLotNumber());
		if (conversionItemDto != null && conversionItemDto.getChildItems() != null 
				&& !conversionItemDto.getChildItems().isEmpty()) {
			
			/*If check inventory is true it will go in normal flow same as CM Price Calculation*/
			orderPriceRequest.setCheckInventory(true);
			orderPriceRequest.setStandardPrice(getStandardMetalRate(locationCode));
			log.info("standard price in getPriceDetails......{}", orderPriceRequest.getStandardPrice());
			
			/*Calculate Parent Item Price*/
			PriceResponseDto parentPriceResponse = getPriceDetails(orderPriceRequest, locationCode);
			log.info("Parent data " + MapperUtil.getJsonString(parentPriceResponse));
			
			for (int i = 0; i < conversionItemDto.getChildItems().size(); i++) {

				Boolean isUcp = false;
				ItemDao itemDto = getItemDetail(conversionItemDto.getChildItems().get(i).getItemCode());

				/*Create Inventory Dao for child items and mapped data based on conversion items*/
				InventoryDetailsDao inventoryDetail = createChildInventory(itemDto,
						conversionItemDto.getChildItems().get(i), locationCode);

				ProductGroupDao productGroupDto = getProductGroupDetails(
						itemDto.getProductGroup().getProductGroupCode());
				// product group config details
				ProductGroupConfig productGroupConfigDetails = MapperUtil
						.mapJsonDataToClass(productGroupDto.getConfigDetails(), ProductGroupConfig.class);

				ProductCategoryDao productCategoryDao = productCategoryRepositoryExt
						.findOneByProductCategoryCode(itemDto.getProductCategory().getProductCategoryCode());

				if (itemDto.getPricingType() == null) {
					throw new ServiceException("no pricing type available", "ERR-CORE-036");
				}

				String currencyCode = locationService.listLocationByLocationCode(locationCode).getStockCurrency();
				if (itemDto.getPricingType().equals(EngineConstants.NON_UCP)) {
					log.info("IN NONUCP");
					price = calculateNonUcpPrice(locationCode, itemDto, inventoryDetail, productGroupDto,
							inventoryDetail.getTotalQuantity(), inventoryDetail.getStdWeight(),
							orderPriceRequest.getStandardPrice(), orderPriceRequest.getCheckInventory(), false);
					validateMandatoryPrice(price);
					price.setCurrencyCode(currencyCode);

				} else if (itemDto.getPricingType().equals(EngineConstants.UCP)) {
					log.info("IN UCP");
					price = calculateUcpPrice(itemDto, inventoryDetail.getTotalQuantity(),
							inventoryDetail.getStdWeight(), inventoryDetail, productGroupDto, locationCode,
							orderPriceRequest.getCheckInventory());

					price.setCurrencyCode(currencyCode);
					isUcp = true;
					// set if its ucp or non ucp
					price.getPriceDetails().setIsUcp(isUcp);

				}

				if (price != null && price.getPriceDetails() != null) {
					price.getPriceDetails()
							.setPrintGuranteeCard(productGroupConfigDetails == null
									|| productGroupConfigDetails.getPrintGuranteeCard() == null ? Boolean.FALSE
											: productGroupConfigDetails.getPrintGuranteeCard());
					// set item type code
					price.getPriceDetails().setItemTypeCode(price.getItemTypeCode());

					log.info("Parent data " + MapperUtil.getJsonString(parentPriceResponse));
					log.info("Child Price Before making Charges " + price.toString());

					BigDecimal totalValue = price.getPriceDetails().getStonePriceDetails().getPreDiscountValue()
							.add(price.getPriceDetails().getMetalPriceDetails().getPreDiscountValue());
					childTotalValue = childTotalValue.add(totalValue);

					childPriceItems.add(price);
				}
			}
			/*Calculate propotionate making charges for child items based on parent making charges*/
			calculateProMakingCharges(childPriceItems, parentPriceResponse, childTotalValue);
			log.info("Child Price After Making Charges " + MapperUtil.getJsonString(childPriceItems));
			childPriceItems.add(parentPriceResponse);
		} else {
			childPriceItems = new ArrayList<>();
//			throw new ServiceException(NO_CHILD_ITEMS, ERR_PRO_037);
		}

		
		return childPriceItems;
	}

	private InventoryDetailsDao createChildInventory(ItemDao item, ConversionItemDto childItem, String locationCode) {
		InventoryDetailsDao childItems = new InventoryDetailsDao();
		WeightDetailsDto weightDetails = new WeightDetailsDto();

		weightDetails.setStoneWeight(childItem.getStoneWeight().divide(new BigDecimal(5),
				DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE)); // karat to gms convert
		weightDetails.setDiamondWeight(BigDecimal.ZERO);
		// if its plaitnum studded , then save weight
		if (item.getPricingGroupType().equals("GOLDSTUDDED")) {
			weightDetails.setGoldWeight(childItem.getStdWeight().subtract(weightDetails.getStoneWeight()));
			weightDetails.setPlatinumWeight(BigDecimal.ZERO);
		} else if (item.getPricingGroupType().equals("PLATINUMSTUDDED")) {
			weightDetails.setPlatinumWeight(childItem.getStdWeight());
			weightDetails.setGoldWeight(BigDecimal.ZERO);
		}
		
		weightDetails.setSilverWeight(BigDecimal.ZERO);
		weightDetails.setMaterialWeight(BigDecimal.ZERO);

//		childItems.setTotalWeight(childItem.getStdWeight().add(childItem.getStoneWeight()));
		childItems.setTotalWeight(childItem.getStdWeight());
		childItems.setWeightUnit("gms"); // Add from Enum
		childItems.setTotalQuantity((short) 1);
		childItems.setProductGroup(childItem.getProductGroupCode());
		childItems.setItemCode(childItem.getItemCode());
		childItems.setLotNumber(childItem.getLotNumber());
		childItems.setStdWeight(childItem.getStdWeight());
		childItems.setProductCategory(childItem.getProductCategoryCode());

		StuddedSplitDetailsDao childDtl = studdedSplitRepository.findDetailAndItemCode("CDTL", 
				childItem.getItemCode(),item.getItemCode(),locationCode);
		if (childDtl != null) {
			// karat to gms
//			childItems.setTotalWeight(childDtl.getWeight().add(childDtl.getDiamondWeight()));
			childItems.setTotalWeight(childDtl.getWeight());
			childItems.setStdWeight(childDtl.getWeight());
			weightDetails.setDiamondWeight(childDtl.getDiamondWeight().divide(new BigDecimal(5),
					DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE));
			weightDetails.setStoneWeight(childDtl.getOtherStoneWeight().divide(new BigDecimal(5),
					DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE));
			if (item.getPricingGroupType().equals("GOLDSTUDDED")) {
				weightDetails.setGoldWeight(childDtl.getWeight()
						.subtract(weightDetails.getStoneWeight())
						.subtract(weightDetails.getDiamondWeight()));
				weightDetails.setPlatinumWeight(BigDecimal.ZERO);
			} else if (item.getPricingGroupType().equals("PLATINUMSTUDDED")) {
				weightDetails.setPlatinumWeight(childDtl.getWeight()
						.subtract(weightDetails.getStoneWeight())
						.subtract(weightDetails.getDiamondWeight()));
				weightDetails.setGoldWeight(BigDecimal.ZERO);
			}
		}
		JsonData jsonData = new JsonData();
		jsonData.setType("WEIGHT_DETAILS");
		jsonData.setData(weightDetails);
		childItems.setTotalWeightDetails(MapperUtil.getStringFromJson(jsonData));
		return childItems;

	}

	// Proportionate making changes calculation
	private List<PriceResponseDto> calculateProMakingCharges(List<PriceResponseDto> childPriceDetails,
			PriceResponseDto parentPriceDetails, BigDecimal childTotalValue) {

		/*1. First sum up child gold and stone value for child items	 
		  2. Then find propotionate percentage for each child item with total child item value	  
		  3. Multiply each child propotionate value with parent making charges.  
		  4. Then add each making charges with child item and set the final value*/
		
		BigDecimal parentMakingCharges = parentPriceDetails.getPriceDetails().getMakingChargeDetails()
				.getPreDiscountValue();
		BigDecimal childFinalValue = BigDecimal.ZERO;
		
		for (int i = 0; i < childPriceDetails.size(); i++) {
			BigDecimal totalValue = childPriceDetails.get(i).getPriceDetails().getStonePriceDetails()
					.getPreDiscountValue()
					.add(childPriceDetails.get(i).getPriceDetails().getMetalPriceDetails().getPreDiscountValue());

			BigDecimal childPropotionatePercentage = totalValue.divide(childTotalValue, EngineConstants.DIVISION_SCALE,
					RoundingMode.HALF_UP);
			log.info("PCT " + childPropotionatePercentage);
			BigDecimal childMakingCharesValue = parentMakingCharges.multiply(childPropotionatePercentage)
					.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP);
			childPriceDetails.get(i).getPriceDetails().getMakingChargeDetails()
					.setPreDiscountValue(childMakingCharesValue);
			childPriceDetails.get(i).getPriceDetails().getMakingChargeDetails()
					.setMakingChargePercentage(childPropotionatePercentage.multiply(new BigDecimal(100))
							.setScale(EngineConstants.PERCENT_SCALE, RoundingMode.HALF_UP));// multiply
			// to
			// 100
			childPriceDetails.get(i).setFinalValue((childPriceDetails.get(i).getPriceDetails().getMetalPriceDetails()
					.getPreDiscountValue()
					.add(childPriceDetails.get(i).getPriceDetails().getStonePriceDetails().getPreDiscountValue())
					.add(childPriceDetails.get(i).getPriceDetails().getMakingChargeDetails().getPreDiscountValue()))
							.setScale(EngineConstants.VALUE_SCALE, RoundingMode.HALF_UP));
			childFinalValue = childFinalValue.add(childPriceDetails.get(i).getFinalValue());
		}
		
		log.info("Final Value Difference " + parentPriceDetails.getFinalValue().subtract(childFinalValue));
		
		return childPriceDetails;
	}
}
