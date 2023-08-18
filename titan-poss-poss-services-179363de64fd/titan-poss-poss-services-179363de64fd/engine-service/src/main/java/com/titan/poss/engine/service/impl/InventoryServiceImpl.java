/*  Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.service.impl;

import static com.titan.poss.core.utils.CommonUtil.updatePageable;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.dto.CoinDetailsDto;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ItemCodeInvWeightDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationResponseDto;
import com.titan.poss.core.dto.OfferDetails;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.engine.constant.EngineConstants;
import com.titan.poss.engine.dto.InventoryCoinsDto;
import com.titan.poss.engine.dto.request.FocItemRequestDto;
import com.titan.poss.engine.dto.response.InventoryFocItemDto;
import com.titan.poss.engine.dto.response.InventoryItemErrorCauseDto;
import com.titan.poss.engine.dto.response.ItemQuantityDto;
import com.titan.poss.engine.inventory.repository.InventoryDetailRepositoryExt;
import com.titan.poss.engine.location.repository.CountryRepositoryExt;
import com.titan.poss.engine.product.repository.ItemRepositoryExt;
import com.titan.poss.engine.service.InventoryService;
import com.titan.poss.engine.service.LocationService;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.repository.LocationRepository;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dto.request.json.HallmarkDetails;
import com.titan.poss.product.dto.request.json.ProductGroupConfig;
import com.titan.poss.sales.constants.SalesConstants;


/**
 * Service class for Inventory.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("engineInventoryService")
public class InventoryServiceImpl implements InventoryService {

	private static final String ERR_CORE_034 = "ERR-CORE-034";
	private static final String INVALID_REQUEST_DATA = "Invalid request data";

	private static final String ERR_SALE_001 = "ERR-SALE-001";
	private static final String ITEM_IS_NOT_FOR_SALE = "Item is not for sale.";

	private static final String ERR_SALE_010 = "ERR-SALE-010";
	private static final String PRODUCT_GROUP_CODE_IS_NOT_ACTIVE = "Product Group code is not active.";

	private static final String ERR_SALE_039 = "ERR-SALE-039";
	private static final String PRODUCT_CATEGORY_CODE_IS_NOT_ACTIVE = "Product Category code is not active.";

	private static final String ERR_SALE_040 = "ERR-SALE-040";
	private static final String ITEM_CODE_IS_NOT_ACTIVE = "Item code is not active.";

	private static final String ERR_INV_029 = "ERR-INV-029";
	private static final String RECORDS_NOT_FOUND = "Record(s) not found";

	private static final String LEFT_JOIN = "LEFT JOIN";

	@Autowired
	private InventoryDetailRepositoryExt inventoryDetailsRepository;

	@Autowired
	private ItemRepositoryExt itemRepository;

	@Autowired
	private CountryRepositoryExt countryRepository;

	@Autowired
	private LocationService locationService;
	
	@Autowired	
	private LocationRepository locationRepository;
	
	@Autowired
	private ItemRepositoryExt itemDaoRepository;
	
	
	/**
	 * This method will give total quantity of items present in inventory for a give
	 * itemCode.
	 * 
	 * @param itemCode
	 * @param pageable
	 * @return PagedRestResponse<List<ItemQuantityDto>>
	 * @throws JSONException 
	 */
	@Override
	public PagedRestResponse<List<ItemQuantityDto>> getInventoryItemDetails(String itemCode, Pageable pageable) throws JSONException {

		// validate is foc items saleable or not
		Boolean isFOCItemsSaleable = getFOCitemssaleable(CommonUtil.getLocationCode());
		Boolean isFoc=getIsFOCitemWithItemCode(itemCode);
		if (BooleanUtils.isTrue(isFoc) )
		if (isFOCItemsSaleable == false) {
			throw new ServiceException("Foc items are not allowed for CM", "ERR-INV-066");
		}
				
		// add sort on pageable if sort is null
		if (pageable == null) {
			pageable = PageRequest.of(0, 20, Sort.by("totalQuantity").ascending());
		} else if (pageable.getSort() == Sort.unsorted()) {
			pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
					Sort.by("totalQuantity").ascending());
		}

		Page<Object[]> inventoryDetailsList = inventoryDetailsRepository
				.findByLocationCodeAndItemCode(CommonUtil.getLocationCode(), itemCode, pageable);

		List<ItemQuantityDto> inventoryDetailsDtoList = new ArrayList<>();

		for (Object[] obj : inventoryDetailsList) {
			ItemQuantityDto itemQuantityDto = new ItemQuantityDto();

			itemQuantityDto.setItemCode((String) obj[0]);
			itemQuantityDto.setTotalQuantity((int) obj[1]);
			itemQuantityDto.setProductGroupCode((String) obj[2]); // product group code, to differentiate coins

			inventoryDetailsDtoList.add(itemQuantityDto);
		}

		return new PagedRestResponse<>(inventoryDetailsDtoList, inventoryDetailsList);
	}

	/**
	 * This method will validate item and set error cause.
	 * 
	 * @param obj
	 * @param txnType
	 */
	private void checkValidation(ItemDao itemDao) {

		// product group active check
		if (BooleanUtils.isFalse(itemDao.getProductGroup().getIsActive())) {
			throw new ServiceException(PRODUCT_GROUP_CODE_IS_NOT_ACTIVE, ERR_SALE_010,
					"Product group '" + itemDao.getProductGroup().getProductGroupCode() + "' is not active for item '"
							+ itemDao.getItemCode() + "'");
		}

		// product category active check
		if (BooleanUtils.isFalse(itemDao.getProductCategory().getIsActive())) {
			throw new ServiceException(PRODUCT_CATEGORY_CODE_IS_NOT_ACTIVE, ERR_SALE_039,
					"Product category '" + itemDao.getProductCategory().getProductCategoryCode()
							+ "' is not active for item '" + itemDao.getItemCode() + "'");
		}

		// item code active check
		if (BooleanUtils.isFalse(itemDao.getIsActive())) {
			throw new ServiceException(ITEM_CODE_IS_NOT_ACTIVE, ERR_SALE_040,
					"Item code '" + itemDao.getItemCode() + "' is not active.");
		}

		InventoryItemErrorCauseDto errorCause = new InventoryItemErrorCauseDto();
		errorCause.setIsSaleable(itemDao.getIsSaleable());
		errorCause.setIsReturnable(itemDao.getIsReturnable());

		// pending: will change for CM against AB (items from reserve bin of AB txn can
		// be sold in CM(converted CM)).

		// subTxnType specific validation - eg: AB to CM, in which case this validation
		// is to be skipped

		// pending: isReturnable check based on transaction type
		if (BooleanUtils.isFalse(errorCause.getIsSaleable()) || BooleanUtils.isFalse(errorCause.getIsReturnable())) {
			throw new ServiceException(ITEM_IS_NOT_FOR_SALE, ERR_SALE_001, errorCause);
		}

	}

	/**
	 * This method will map all object elements to InventoryItemDto fields.
	 * 
	 * @param inventoryItemDetailsList
	 * @return List<InventoryItemDto>
	 */
	private List<InventoryItemDto> mapInvDetailToDto(Page<Object[]> inventoryItemDetailsList,String locationCode) {

		List<InventoryItemDto> inventoryItemDtoList = new ArrayList<>();

		for (Object[] obj : inventoryItemDetailsList) {

			InventoryItemDto inventoryItemDto = new InventoryItemDto();

			inventoryItemDto.setBinCode((String) obj[0]);
			inventoryItemDto.setProductGroupDescription((String) obj[1]);
			inventoryItemDto.setInventoryId((String) obj[2]);
			inventoryItemDto.setLotNumber((String) obj[3]);
			inventoryItemDto.setKaratage((BigDecimal) obj[4]);
			inventoryItemDto.setTotalQuantity((short) obj[5]);
			inventoryItemDto.setStdWeight((BigDecimal) obj[6]);
			String objvalue = (String) obj[8];
			 objvalue = objvalue.replaceAll("\\\\", "");
			inventoryItemDto.setTotalWeightDetails(MapperUtil.getJsonString((String) objvalue));
			inventoryItemDto.setProductCategoryDescription((String) obj[9]);
			inventoryItemDto.setProductGroupCode((String) obj[10]);
			inventoryItemDto.setProductCategoryCode((String) obj[11]);
			inventoryItemDto.setItemCode((String) obj[12]);
			inventoryItemDto.setBinGroupCode((String) obj[13]);
			inventoryItemDto.setItemDescription((String) obj[14]);
			inventoryItemDto.setStdValue((BigDecimal) obj[15]);
			inventoryItemDto.setMfgDate((Date) obj[16]);
			inventoryItemDto.setStockInwardDate((Date) obj[17]);

			BigDecimal quantity = new BigDecimal(inventoryItemDto.getTotalQuantity());
			BigDecimal totalWeight = (BigDecimal) obj[7];
			BigDecimal unitWeight = totalWeight.divide(quantity, 3, RoundingMode.HALF_UP);
			inventoryItemDto.setUnitWeight(unitWeight);

			// get image url
			inventoryItemDto.setImageUrl(new URLUtil().getImageUrlByItemCode(inventoryItemDto.getItemCode()));

			inventoryItemDtoList.add(inventoryItemDto);
		}

		// sort list to have items in valid bin group at top.
		List<String> binGroupCodeList = getBinGroupCode(locationCode);
		List<InventoryItemDto> itemsOfValidBinGroup = inventoryItemDtoList.stream()
				.filter(inventoryItemDto -> binGroupCodeList.contains(inventoryItemDto.getBinGroupCode())
						|| (CommonConstants.TEP_BIN_CODE.equals(inventoryItemDto.getBinGroupCode())
								&& CommonConstants.TEP_SALE_BIN_CODE.equals(inventoryItemDto.getBinCode())))
				.collect(Collectors.toList());

		// if list of valid items is not empty, then
		// 1. remove valid items from original list and
		// 2. append original list to valid items list
		if (!CollectionUtils.isEmpty(itemsOfValidBinGroup)) {
			inventoryItemDtoList.removeAll(itemsOfValidBinGroup);

			if (CollectionUtils.isEmpty(inventoryItemDtoList)) {
				inventoryItemDtoList = itemsOfValidBinGroup;
			} else {
				// will add items of valid bin to the beginning of the original list.
				inventoryItemDtoList.addAll(0, itemsOfValidBinGroup);
			}
		}

		return inventoryItemDtoList;
	}

	/**
	 * This method will get inventory-item details for the given item code.
	 * 
	 * @param itemCode
	 * @param pageable
	 * @return PagedRestResponse<List<InventoryItemDto>>
	 */
	@Override
	public PagedRestResponse<List<InventoryItemDto>> getInventoryItemLotDetails(String itemCode, String lotNumber,
			Pageable pageable) {

		if (StringUtils.isEmpty(lotNumber)) {
			lotNumber = "";
		}
		
		String locationCode=CommonUtil.getLocationCode();

		Map<String, String> resultQueries = new HashMap<>();
		// @formatter:off
		StringBuilder query = new StringBuilder(
				"SELECT invDtls.bin_code, pgm.description as product_group_description, invDtls.id as inventoryId, "
						+ " invDtls.lot_number, item.karat, invDtls.total_quantity, invDtls.std_weight, "
						+ " invDtls.total_weight, invDtls.total_weight_details, pcm.description as product_category_description, "
						+ " item.product_group_code, item.product_category_code, invDtls.item_code, invDtls.bin_group_code,  item.description, invDtls.std_value, "
						+ " invDtls.mfg_date, invDtls.stock_inward_date "
						+ " FROM " +  "inventory.dbo.inventory_details invDtls " 
						+ LEFT_JOIN + " " + "products.dbo.item_master item " 
						+ " ON invDtls.item_code = item.item_code " 
						+ LEFT_JOIN + " " +  "products.dbo.product_group_master pgm "
						+ " ON pgm.product_group_code = item.product_group_code " 
						+ LEFT_JOIN + " " +  "products.dbo.product_category_master pcm "
						+ " ON pcm.product_category_code = item.product_category_code " 
						+ " WHERE invDtls.item_code = '"+ itemCode + "' "
						+ " AND ( '" + lotNumber + "' = '' OR invDtls.lot_number = '" + lotNumber + "') "
						+ " AND invDtls.location_code = '" +locationCode + "' "
						+ " AND invDtls.total_quantity > 0");
		// @formatter:on

		query.append(" ORDER BY invDtls.mfg_date, invDtls.total_quantity OFFSET "
				+ pageable.getPageSize() * pageable.getPageNumber() + " ROWS FETCH NEXT " + pageable.getPageSize()
				+ " ROWS ONLY");
		resultQueries.put("finalQuery", query.toString());

		String countQuery = "SELECT COUNT(*) FROM ( " + query + " ) t1";

		resultQueries.put("countQuery", countQuery);
		Page<Object[]> inventoryItemDetailsList = inventoryDetailsRepository.getDetails(resultQueries, pageable);

		List<InventoryItemDto> inventoryItemDtoList = mapInvDetailToDto(inventoryItemDetailsList,locationCode);

		return new PagedRestResponse<>(inventoryItemDtoList, inventoryItemDetailsList);
	}

	private boolean checkExcludeKarat(ItemDao itemDao, ProductGroupConfig productGroupConfigDetails) {

		// @formatter:off
		return (MetalTypeCodeEnum.J.name().equals(itemDao.getItemType().getItemTypeCode())
				&& !CollectionUtil.isEmpty(productGroupConfigDetails.getHallmarkingExcludeKarat())
				&& !productGroupConfigDetails.getHallmarkingExcludeKarat().contains(itemDao.getKarat().setScale(0)))
				|| !MetalTypeCodeEnum.J.name().equals(itemDao.getItemType().getItemTypeCode()) // ignore if item is not of type 'J'
				|| CollectionUtil.isEmpty(productGroupConfigDetails.getHallmarkingExcludeKarat());// ignore if exclude karat not configured
		// @formatter:on
	}

	private Boolean isHallmarkNecessaryCheck(String locationCode, String itemCode, Boolean withSaleableCheck,
			Map<String, BigDecimal> excludeGramAndKarat, ItemDao singleItemDao) {

		Boolean isHallmarkNecessary = null;
		if (BooleanUtils.isNotTrue(withSaleableCheck) || itemCode == null) {
			return isHallmarkNecessary;
		}

		LocationCacheDto locationCacheDto = locationService.getStoreLocation(locationCode);
		if (!BooleanUtils.isTrue(locationCacheDto.getStoreDetails().getIsHallmarkingEnabled())) {
			return isHallmarkNecessary;
		}
		if (singleItemDao == null) {
			throw new ServiceException("not a valid item", EngineConstants.ERR_PRO_002);
		}
		ProductGroupDao productGroupDto = singleItemDao.getProductGroup();
		ProductCategoryDao productCategoryDao = singleItemDao.getProductCategory();

		// product group hallmark details
		ProductGroupConfig productGroupConfigDetails = MapperUtil.mapJsonDataToClass(productGroupDto.getConfigDetails(),
				ProductGroupConfig.class);

		// product category hallmark details
		HallmarkDetails productCategoryHallmarkDetails = MapperUtil
				.mapJsonDataToClass(productCategoryDao.getHallmarkDetails(), HallmarkDetails.class);

		if (BooleanUtils.isTrue(productGroupConfigDetails.getIsHallmarked()) && productCategoryHallmarkDetails != null
				&& BooleanUtils.isTrue(productCategoryHallmarkDetails.getIsAllowedForHallmarking())
				&& checkExcludeKarat(singleItemDao, productGroupConfigDetails)) {
			excludeGramAndKarat.put("excludeGrams", productGroupConfigDetails.getHallmarkingExcludeGrams());
			isHallmarkNecessary = true;
		}

		return isHallmarkNecessary;
	}

	/**
	 * This method will give coin details.
	 * 
	 * @return List<CoinDetailsDto>
	 */
	@Override
	@Transactional(readOnly = true)
	public ListResponse<CoinDetailsDto> getCoinDetails(String itemCode, Boolean withSaleableCheck) {

		// if saleable check is null, then only valid coins to be listed
		withSaleableCheck = !BooleanUtils.isFalse(withSaleableCheck);
		String locationCode = CommonUtil.getStoreCode();

		/**
		 * 1.list inventory items 2. attach item master data
		 */

		// isSaleable and isRetrunable in configDetails of item master
		// isJwelleryItem in product group config details. - not required for coins?
		List<String> binGroupCodeList = getBinGroupCode(locationCode);

		Map<String, BigDecimal> excludeGramAndKarat = new HashMap<>();
		ItemDao singleItemDao = null;
		if (itemCode != null) {
			singleItemDao = itemRepository.findByItemCode(itemCode);
		}
		// NAP-8817, NAP-9547 and NAP-8859
		// check for hallmark on single item
		Boolean isHallmarkNecessary = isHallmarkNecessaryCheck(locationCode, itemCode, withSaleableCheck,
				excludeGramAndKarat, singleItemDao);

		List<InventoryCoinsDto> invDetailsDtoList = inventoryDetailsRepository.findByProductGroupAndLocationCode(
				locationCode, itemCode, SalesConstants.COIN_PRODUCT_GROUP_CODE, SalesConstants.SILVER_COIN_PRODUCT_GROUP_CODE,
				binGroupCodeList, withSaleableCheck,isHallmarkNecessary, excludeGramAndKarat.get("excludeGrams"));

		List<CoinDetailsDto> coinDetailsDtoList = new ArrayList<>();
		// check if inv coin list is empty.
		if (CollectionUtils.isEmpty(invDetailsDtoList)) {
			return new ListResponse<>(coinDetailsDtoList);
		}

		// check hallmark when 'withSaleableCheck' is true and 'itemCode' is provided

		// group items as required
		invDetailsDtoList = groupCoins(withSaleableCheck, binGroupCodeList, invDetailsDtoList);

		List<String> itemCodes = new ArrayList<>();
		for (InventoryCoinsDto invCoinDto : invDetailsDtoList) {
			itemCodes.add(invCoinDto.getItemCode());
		}

		// pick item codes for which is_active is true, pgc is true, pcc is true,
		// isSaleable is true and isReturnable is true.
		List<ItemDao> itemsList;
		if (singleItemDao == null) {
			itemsList = itemRepository.findByItemCodesAndProductGroup(itemCodes, SalesConstants.COIN_PRODUCT_GROUP_CODE,
					withSaleableCheck);
		} else {
			itemsList = List.of(singleItemDao);
		}

		Map<String, ItemDao> itemMap = new HashMap<>();
		for (ItemDao itemDao : itemsList) {
			itemMap.put(itemDao.getItemCode(), itemDao);
		}

		CountryDao countryDao = countryRepository.getCountryDetails(locationCode);
		String weightUnit = countryDao.getWeightUnit();

		for (InventoryCoinsDto inventory : invDetailsDtoList) {
			if (itemMap.get(inventory.getItemCode()) == null) {
				continue; // if item_master doesn't have particular item then should not send in
							// response.(LEFT JOIN)
			}
			ItemDao itemDao = itemMap.get(inventory.getItemCode());
			CoinDetailsDto coinDetailsDtoNew = new CoinDetailsDto();
			// set item master data
			coinDetailsDtoNew.setItemCode(itemDao.getItemCode());
			coinDetailsDtoNew.setItemDescription(itemDao.getDescription());
			coinDetailsDtoNew.setKaratage(itemDao.getKarat());
			coinDetailsDtoNew.setProductCategoryCode(itemDao.getProductCategory().getProductCategoryCode());

			// set inventory data
			coinDetailsDtoNew.setTotalQuantity(inventory.getTotalQuantity().intValue());
			coinDetailsDtoNew.setStdWeight(inventory.getStdWeight());
			coinDetailsDtoNew.setUnit(weightUnit);
			coinDetailsDtoNew.setUnitWeight(
					inventory.getUnitWeight().setScale(DomainConstants.WEIGHT_SCALE, DomainConstants.ROUNDIND_MODE));
			coinDetailsDtoNew.setTotalWeightDetails(MapperUtil.getJsonFromString(inventory.getTotalWeightDetails()));
			coinDetailsDtoNew.setProductGroupCode(SalesConstants.COIN_PRODUCT_GROUP_CODE);
			coinDetailsDtoNew.setStdValue(inventory.getStdValue());

			coinDetailsDtoList.add(coinDetailsDtoNew);
		}

		// if withSaleableCheck check is false then, populate valid bin group items
		// first. - removed, as TEPSALE bin has also come into picture.

		return new ListResponse<>(coinDetailsDtoList);
	}

	private List<InventoryCoinsDto> groupCoins(Boolean withSaleableCheck, List<String> binGroupCodeList,
			List<InventoryCoinsDto> invDetailsDtoList) {
		Map<ItemCodeInvWeightDto, InventoryCoinsDto> mapValidCoinsByItemCodeAndUnitWeigt = new HashMap<>();
		Map<ItemCodeInvWeightDto, InventoryCoinsDto> mapInvalidCoinsByItemCodeAndUnitWeigt = new HashMap<>();

		ItemCodeInvWeightDto itemCodeInvWeightDto = new ItemCodeInvWeightDto();

		invDetailsDtoList.forEach(invCoinDetail -> {

			itemCodeInvWeightDto.setItemCode(invCoinDetail.getItemCode());
			itemCodeInvWeightDto.setInventoryWeight(invCoinDetail.getUnitWeight());

			if (binGroupCodeList.contains(invCoinDetail.getBinGroupCode())
					|| (CommonConstants.TEP_BIN_CODE.equals(invCoinDetail.getBinGroupCode())
							&& CommonConstants.TEP_SALE_BIN_CODE.equals(invCoinDetail.getBinCode()))) {
				getValidCoinDetail(mapValidCoinsByItemCodeAndUnitWeigt, itemCodeInvWeightDto, invCoinDetail);
			} else {
				getValidCoinDetail(mapInvalidCoinsByItemCodeAndUnitWeigt, itemCodeInvWeightDto, invCoinDetail);

			}

		});

		invDetailsDtoList = mapValidCoinsByItemCodeAndUnitWeigt.values().stream().collect(Collectors.toList());
		// if withSaleableCheck check is false then, populate invalid valid bin group
		// items to bottom of the list.
		if (!BooleanUtils.isTrue(withSaleableCheck)) {
			invDetailsDtoList
					.addAll(mapInvalidCoinsByItemCodeAndUnitWeigt.values().stream().collect(Collectors.toList()));
		}
		return invDetailsDtoList;
	}

	private void getValidCoinDetail(Map<ItemCodeInvWeightDto, InventoryCoinsDto> mapCoinsByItemCodeAndUnitWeigt,
			ItemCodeInvWeightDto itemCodeInvWeightDto, InventoryCoinsDto invCoinDetail) {

		if (mapCoinsByItemCodeAndUnitWeigt.isEmpty()
				|| !mapCoinsByItemCodeAndUnitWeigt.containsKey(itemCodeInvWeightDto)) {
			mapCoinsByItemCodeAndUnitWeigt.put(itemCodeInvWeightDto, invCoinDetail);

		} else {
			InventoryCoinsDto existingInvCoinsDto = mapCoinsByItemCodeAndUnitWeigt.get(itemCodeInvWeightDto);
			existingInvCoinsDto
					.setTotalQuantity(existingInvCoinsDto.getTotalQuantity() + invCoinDetail.getTotalQuantity());
			if (existingInvCoinsDto.getStdValue().compareTo(invCoinDetail.getStdValue()) < 0) {
				existingInvCoinsDto.setStdValue(invCoinDetail.getStdValue());
			}
			if (existingInvCoinsDto.getTotalWeightDetails().compareTo(invCoinDetail.getTotalWeightDetails()) < 0) {
				existingInvCoinsDto.setTotalWeightDetails(invCoinDetail.getTotalWeightDetails());
			}
			mapCoinsByItemCodeAndUnitWeigt.put(itemCodeInvWeightDto, existingInvCoinsDto);
		}

	}

	public List<String> getBinGroupCode(String locationCode) {
		List<String> binGroupCodeList = new ArrayList<>();
		LocationCacheDto locationCacheDto = locationService.getStoreLocation(locationCode);
		if (BooleanUtils.isTrue(locationCacheDto.getOfferDetails().getIsFOCitemssaleable())) {
			binGroupCodeList.add(CommonConstants.FOC);
		}
		binGroupCodeList.add(CommonConstants.CUSTOM_ORDER_BIN);
		if (UserTypeEnum.L1.name().equals(CommonUtil.getLoggedInUserType())
				|| UserTypeEnum.L2.name().equals(CommonUtil.getLoggedInUserType())) {
			binGroupCodeList.add(SalesConstants.L1_L2_STN);
		} else if (UserTypeEnum.L3.name().equals(CommonUtil.getLoggedInUserType())) {
			binGroupCodeList.add(SalesConstants.L3_PURCFA);
		}
		return binGroupCodeList;
	}

	/**
	 * This method will validate whether the item is sale able or not based on
	 * inventoryId.
	 * 
	 * @param inventoryId
	 */
	@Transactional(readOnly = true) // added to resolve lazy loading issue(mainly to check PGC & PCC are active/not)
	@Override
	public InventoryItemDto validateInventoryItem(String inventoryId, String itemCode) {

		// if both (inventoryId & itemCode are not provided ) or (both are provided)
		// throw error
		if ((inventoryId == null && itemCode == null) || (inventoryId != null && itemCode != null)) {
			throw new ServiceException(INVALID_REQUEST_DATA, ERR_CORE_034,
					"Invalid request. Please provide either inventory id or item code to do saleable check (any one of them ONLY).");
		}

		/**
		 * 1-get inventory details 2-get item details 3-get product details
		 */

		InventoryDetailsDao inventoryDetail = null;

		if (inventoryId != null) {
			inventoryDetail = inventoryDetailsRepository.findByIdAndLocationCode(inventoryId,
					CommonUtil.getLocationCode());
		} else {
			inventoryDetail = inventoryDetailsRepository.findTopByItemCodeAndLocationCode(itemCode,
					CommonUtil.getLocationCode());
		}

		ItemDao itemDao = null;
		if (inventoryDetail != null) {

			itemDao = itemRepository.findByItemCode(inventoryDetail.getItemCode());
			if (itemDao != null) {
				checkValidation(itemDao);

			} else {
				throw new ServiceException(EngineConstants.ITEM_NOT_PRESENT_IN_ITEM_MASTER, EngineConstants.ERR_ENG_016,
						Map.of("itemCode", inventoryDetail.getItemCode()));
			}

		} else {
			throw new ServiceException(EngineConstants.ITEM_NOT_PRESENT_IN_INVENTORY, EngineConstants.ERR_ENG_015,
					Map.of("id", inventoryId));
		}

		// map item and inventoryDetails data to DTO
		InventoryItemDto inventoryItemDto = new InventoryItemDto();
		inventoryItemDto.setBinCode(inventoryDetail.getBinCode());
		inventoryItemDto.setProductGroupDescription(itemDao.getProductGroup().getDescription());
		inventoryItemDto.setInventoryId(inventoryDetail.getId());
		inventoryItemDto.setLotNumber(inventoryDetail.getLotNumber());
		inventoryItemDto.setKaratage(itemDao.getKarat());
		inventoryItemDto.setTotalQuantity(inventoryDetail.getTotalQuantity());
		inventoryItemDto.setStdWeight(inventoryDetail.getStdWeight());
		// check added to avoid / by 0 error
		inventoryItemDto.setUnitWeight(inventoryDetail.getTotalQuantity() == 0 ? BigDecimal.ZERO
				: inventoryDetail.getTotalWeight().divide(BigDecimal.valueOf(inventoryDetail.getTotalQuantity()), 3,
						RoundingMode.HALF_UP));
		inventoryItemDto.setTotalWeightDetails(MapperUtil.getJsonFromString(inventoryDetail.getTotalWeightDetails()));
		inventoryItemDto.setProductCategoryDescription(itemDao.getProductCategory().getDescription());
		inventoryItemDto.setProductGroupCode(itemDao.getProductGroup().getProductGroupCode());
		inventoryItemDto.setProductCategoryCode(itemDao.getProductCategory().getProductCategoryCode());
		inventoryItemDto.setItemCode(itemDao.getItemCode());
		inventoryItemDto.setImageUrl(new URLUtil().getImageUrlByItemCode(inventoryItemDto.getItemCode()));
		inventoryItemDto.setBinGroupCode(inventoryDetail.getBinGroupCode());
		inventoryItemDto.setItemDescription(itemDao.getItemCode());
		inventoryItemDto.setStdValue(inventoryDetail.getStdValue());
		inventoryItemDto.setMfgDate(inventoryDetail.getMfgDate());
		inventoryItemDto.setStockInwardDate(inventoryDetail.getStockInwardDate());
		inventoryItemDto.setIsHallmarked(inventoryDetail.getIsHallmarked());
		inventoryItemDto.setRequestType(inventoryDetail.getRequestType());
		inventoryItemDto.setRequestQuantity(inventoryDetail.getRequestQuantity());
		inventoryItemDto.setItemDetails(inventoryDetail.getItemDetails());
		
		/*
		 * Date businessDate =
		 * saleService.getBusinessDay(CommonUtil.getLocationCode()).getBusinessDate();
		 * if (businessDate != null && inventoryDetail.getMfgDate() != null) { try {
		 * SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd"); String
		 * busiNessDate = businessDate.toString(); String mfgDate =
		 * inventoryDetail.getMfgDate().toString(); long age =
		 * ChronoUnit.DAYS.between(dateFormat.parse(mfgDate).toInstant(),
		 * dateFormat.parse(busiNessDate).toInstant()); inventoryItemDto.setAge(age); }
		 * catch (Exception e) { // TODO : Need to add logger } }
		 */
		return inventoryItemDto;

	}

	@Override
	public PagedRestResponse<List<InventoryFocItemDto>> listFocItems(FocItemRequestDto focItemRequestDto,
			Pageable pageable, Boolean isPageable) {

		BigDecimal maxValue = null;
		BigDecimal maxWeight = null;

		pageable = updatePageable(isPageable, pageable);

		LocationResponseDto locationResponse = locationService.listLocationByLocationCode(CommonUtil.getLocationCode());

		// Fetch Location Master FOC details and check for maximum value and maximum
		// weight to be validated with inventory details.
		OfferDetails offerDetails = MapperUtil.mapJsonDataToClass(locationResponse.getOfferDetails(),
				OfferDetails.class);

		if (offerDetails.getMaxWeightforFOC() != null && !offerDetails.getMaxWeightforFOC().toString().isEmpty()) {
			maxWeight = BigDecimal.valueOf(offerDetails.getMaxWeightforFOC());
		}

		if (offerDetails.getMaxValueforFOC() != null && !offerDetails.getMaxValueforFOC().toString().isEmpty()) {
			maxValue = BigDecimal.valueOf(offerDetails.getMaxValueforFOC());
		}
//		if(offerDetails.getIsTEPsaleableitemsallowedforFOC()!= null && offerDetails.getIsTEPsaleableitemsallowedforFOC()==true) {
//			Page<InventoryFocItemDto> inventoryDetailsDaoList = inventoryDetailsRepository
//					.findAllLocationCodeAndBinGroupCodeAndBinCode(
//							CommonUtil.getLocationCode(), "TEP", "TEPSALE",pageable);	
//		}

		List<String> binCodesList = new ArrayList();
		binCodesList.add("FOC");
		if (offerDetails.getIsTEPsaleableitemsallowedforFOC())
		binCodesList.add("TEPSALE");
		
		List<String> binGrpCodesList = new ArrayList();
		binGrpCodesList.add("FOC");
		if (offerDetails.getIsTEPsaleableitemsallowedforFOC())
		binGrpCodesList.add("TEP");
		
		/*List<String> binCodesList1 = new ArrayList();
		binCodesList1.add("FOC");
		if (offerDetails.getIsFOCitemssaleable())
		binCodesList1.add("FOC BIN");
		
		List<String> binGrpCodesList1 = new ArrayList();
		binGrpCodesList1.add("FOC");
		if (offerDetails.getIsFOCitemssaleable())
		binGrpCodesList1.add("FOC BIN");*/
		
		// Bi Group & bin code been hard code, need to move to an enum
		Page<InventoryFocItemDto> inventoryDetailsDaoList = inventoryDetailsRepository
				.findAllLocationCodeAndBinGroupCodeAndBinCodeAndItemCodeInAndTotalQuantityGreaterThanAndTotalWeightLessThanEqualAndTotalValueLessThanEqual(
						CommonUtil.getLocationCode(),binGrpCodesList, binCodesList, focItemRequestDto.getItemsCodes(), (short) 0,
						maxWeight, maxValue, pageable);

		if (inventoryDetailsDaoList == null || inventoryDetailsDaoList.isEmpty()) {
			throw new ServiceException(RECORDS_NOT_FOUND, ERR_INV_029);
		}

		List<InventoryFocItemDto> inventoryItemDtoList = new ArrayList<>();

		inventoryDetailsDaoList.getContent().forEach(dto -> {
			InventoryFocItemDto focItemDto = (InventoryFocItemDto) MapperUtil.getDtoMapping(dto,
					InventoryFocItemDto.class);
			inventoryItemDtoList.add(focItemDto);
		});

//		inventoryDetailsDaoList.forEach(inventoryDetailsDao -> {
//			InventoryItemDto inventoryItemDto = (InventoryItemDto) MapperUtil.getObjectMapping(inventoryDetailsDao,
//					new InventoryItemDto());
//			inventoryItemDto.setTotalQuantity(inventoryDetailsDao.getTotalQuantity());
//			BigDecimal unitWeight = inventoryDetailsDao.getTotalWeightDetails()
//					.divide(new BigDecimal(inventoryItemDto.getTotalQuantity()), 3, RoundingMode.HALF_UP);
//			inventoryItemDto.setUnitWeight(unitWeight);
//			inventoryItemDto.setTotalWeightDetails(inventoryDetailsDao.getTotalWeightDetails());
//			inventoryItemDto.setProductGroupCode(inventoryDetailsDao.getProductGroup());
//			inventoryItemDto.setProductCategoryCode(inventoryDetailsDao.getProductCategory());
//			inventoryItemDto.setImageUrl(new URLUtil().getImageUrlByItemCode(inventoryItemDto.getItemCode()));
//			inventoryItemDtoList.add(inventoryItemDto);
//
//		});

		return new PagedRestResponse<>(inventoryItemDtoList, inventoryDetailsDaoList);
	}


	/**
	 * This method will validate whether the item is in inventory or not
	 * inventoryId.
	 * 
	 * @param inventoryId
	 */
	@Transactional(readOnly = true) // added to resolve lazy loading issue(mainly to check PGC & PCC are active/not)
	@Override
	public InventoryItemDto validateInventoryItems(String inventoryId, String itemCode) {

		// if both (inventoryId & itemCode are not provided ) or (both are provided)
		// throw error
		if ((inventoryId == null && itemCode == null) || (inventoryId != null && itemCode != null)) {
			throw new ServiceException(INVALID_REQUEST_DATA, ERR_CORE_034,
					"Invalid request. Please provide either inventory id or item code to do saleable check (any one of them ONLY).");
		}

		/**
		 * 1-get inventory details 2-get item details 3-get product details
		 */

		InventoryDetailsDao inventoryDetail = null;

		if (inventoryId != null) {
			inventoryDetail = inventoryDetailsRepository.findByIdAndLocationCode(inventoryId,
					CommonUtil.getLocationCode());
		} else {
			inventoryDetail = inventoryDetailsRepository.findTopByItemCodeAndLocationCode(itemCode,
					CommonUtil.getLocationCode());
		}

		ItemDao itemDao = null;
		if (inventoryDetail != null) {

			itemDao = itemRepository.findByItemCode(inventoryDetail.getItemCode());
			if (itemDao == null) {
				//checkValidation(itemDao);
				throw new ServiceException(EngineConstants.ITEM_NOT_PRESENT_IN_ITEM_MASTER, EngineConstants.ERR_ENG_016,
						Map.of("itemCode", inventoryDetail.getItemCode()));
			}

		} else {
			throw new ServiceException(EngineConstants.ITEM_NOT_PRESENT_IN_INVENTORY, EngineConstants.ERR_ENG_015,
					Map.of("id", inventoryId));
		}

		// map item and inventoryDetails data to DTO
		InventoryItemDto inventoryItemDto = new InventoryItemDto();
		inventoryItemDto.setBinCode(inventoryDetail.getBinCode());
		inventoryItemDto.setProductGroupDescription(itemDao.getProductGroup().getDescription());
		inventoryItemDto.setInventoryId(inventoryDetail.getId());
		inventoryItemDto.setLotNumber(inventoryDetail.getLotNumber());
		inventoryItemDto.setKaratage(itemDao.getKarat());
		inventoryItemDto.setTotalQuantity(inventoryDetail.getTotalQuantity());
		inventoryItemDto.setStdWeight(inventoryDetail.getStdWeight());
		// check added to avoid / by 0 error
		inventoryItemDto.setUnitWeight(inventoryDetail.getTotalQuantity() == 0 ? BigDecimal.ZERO
				: inventoryDetail.getTotalWeight().divide(BigDecimal.valueOf(inventoryDetail.getTotalQuantity()), 3,
						RoundingMode.HALF_UP));
		inventoryItemDto.setTotalWeightDetails(MapperUtil.getJsonFromString(inventoryDetail.getTotalWeightDetails()));
		inventoryItemDto.setProductCategoryDescription(itemDao.getProductCategory().getDescription());
		inventoryItemDto.setProductGroupCode(itemDao.getProductGroup().getProductGroupCode());
		inventoryItemDto.setProductCategoryCode(itemDao.getProductCategory().getProductCategoryCode());
		inventoryItemDto.setItemCode(itemDao.getItemCode());
		inventoryItemDto.setImageUrl(new URLUtil().getImageUrlByItemCode(inventoryItemDto.getItemCode()));
		inventoryItemDto.setBinGroupCode(inventoryDetail.getBinGroupCode());
		inventoryItemDto.setItemDescription(itemDao.getItemCode());
		inventoryItemDto.setStdValue(inventoryDetail.getStdValue());
		inventoryItemDto.setMfgDate(inventoryDetail.getMfgDate());
		inventoryItemDto.setStockInwardDate(inventoryDetail.getStockInwardDate());
		inventoryItemDto.setIsHallmarked(inventoryDetail.getIsHallmarked());

		return inventoryItemDto;

	}
	
	/**
	 * Method to get status of FOC items saleability
	 * @param locationCode
	 * @return Boolean -> true / false
	 * @throws JSONException
	 */
	private Boolean getFOCitemssaleable(String locationCode) throws JSONException {
		LocationDao offerDetails = locationRepository.findOneByLocationCode(locationCode);
		if (null != offerDetails && null != offerDetails.getOfferDetails()) {
			JSONObject json = new JSONObject(offerDetails.getOfferDetails());
			if (!"".equals(json.optString("data"))) {
				JSONObject jsonForOffer = new JSONObject(json.getString("data"));
				if (jsonForOffer.get("isFOCitemssaleable") != null
						&& ((Boolean) jsonForOffer.get("isFOCitemssaleable"))) {
					return true;
				}
			}

		}
		return false;

	}

	private Boolean getIsFOCitemWithItemCode(String itemCode) throws JSONException {
		ItemDao item = itemDaoRepository.findOneByItemCode(itemCode);
		Boolean foc = item != null ? item.getIsFocItem() : false;
		return foc;
	}
}
