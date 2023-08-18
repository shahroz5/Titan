/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade.impl;

import java.io.StringReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.core.utils.WeightUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.acl.InventoryAccessControls;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.constant.InventoryDetailsActionEnum;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.InventoryDetailsSyncDtoExt;
import com.titan.poss.inventory.dto.InventoryItemDetailsDto;
import com.titan.poss.inventory.dto.WeightDTO;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.OtherReceiveStatusEnum;
import com.titan.poss.inventory.dto.constants.OtherReceiveTypeAdjPsvEnum;
import com.titan.poss.inventory.dto.constants.OtherReceiveTypeEnum;
import com.titan.poss.inventory.dto.constants.StockReceiveStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferStatusEnum;
import com.titan.poss.inventory.dto.request.OtherReceiveItemBulkDto;
import com.titan.poss.inventory.dto.request.OtherReceiveStockConfirmDto;
import com.titan.poss.inventory.dto.request.OtherReceiveStockCreateDto;
import com.titan.poss.inventory.dto.request.ReceiveItemDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemUpdateDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.OtherReceiveStockDto;
import com.titan.poss.inventory.dto.response.OtherReceiveStockItemDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;
import com.titan.poss.inventory.facade.OtherReceiveFacade;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.InventoryDocMasterService;
import com.titan.poss.inventory.service.InventorySyncDataService;
import com.titan.poss.inventory.service.LocationService;
import com.titan.poss.inventory.service.ProductService;
import com.titan.poss.inventory.service.StockTransactionService;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Service("otherReceiveFacadeService")
public class OtherReceiveFacadeImpl implements OtherReceiveFacade {

	private static final Logger LOGGER = LoggerFactory.getLogger(OtherReceiveFacadeImpl.class);

	@Autowired
	private StockTransactionService stockTransactionService;

	@Autowired
	private InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	private InventoryDetailsService invDetailsService;

	@Autowired
	ProductService productService;
	@Autowired
	LocationService locationService;

	@Autowired
	EngineService engineService;

	@Autowired
	EngineServiceClient engineClient;

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	@Autowired
	private OtherReceiveFacadeImpl otherReceiveFacadeImp;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	private static final String SOLITAIRE_PRODUCT = "Studded - Solitaire";

	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";

	private static final String ERR_CORE_003 = "ERR-CORE-003";

	private static final String ISOFFLINE = "isOffline";

	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";

	/**
	 * Call stock transfer service to get the count based on other receive type
	 * enum(EXH, LOAN, LOSS)
	 */
	@Override
	public ListResponse<InventoryCountDto> getOtherReceiveCount(String otherReceiveStatus) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<String> otherReceiveTypeList = new ArrayList<>();
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.OTHER_RECEIPTS_EXHIBITION))) {
			otherReceiveTypeList.add(OtherReceiveTypeEnum.EXH.toString());
		}
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.OTHER_RECEIPTS_LOAN))) {
			otherReceiveTypeList.add(OtherReceiveTypeEnum.LOAN.toString());
		}

		List<InventoryCountDto> otherReceiveCount = stockTransactionService.getStockTransactionCount(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), otherReceiveStatus,
				otherReceiveTypeList);
		return new ListResponse<>(otherReceiveCount);
	}

	/**
	 * Call stock transfer service to get the list of other receive by other receive
	 * type enum (EXH, LOAN, LOSS)
	 */
	@Override
	public PagedRestResponse<List<OtherReceiveStockDto>> listOtherReceive(Integer docNo, String otherReceiveType,
			String otherReceiveStatus, Pageable pageable) {

		// call the stock transfer service example criteria method
		Example<StockTransactionDao> stockTransactionCriteria = generateCriteriaForStocktransaction(docNo,
				otherReceiveType, otherReceiveStatus);

		// call stock transfer service to get stock transfer pageable data
		// criteria and pageable are the param
		Page<StockTransactionDao> stockTransaction = stockTransactionService
				.findStockTransactionByCriteria(stockTransactionCriteria, pageable);

		// convert pageable stock transaction object to list of OtherReceiveStockDto
		// object
		List<OtherReceiveStockDto> otherReceiveStockDetails = generateOtherReceiveStockDto(stockTransaction);
		return new PagedRestResponse<>(otherReceiveStockDetails, stockTransaction);
	}

	private List<OtherReceiveStockDto> generateOtherReceiveStockDto(Page<StockTransactionDao> stockTransaction) {
		List<OtherReceiveStockDto> otherReceiveStockDetails = new ArrayList<>();
		for (StockTransactionDao stTransaction : stockTransaction) {
			OtherReceiveStockDto otherReceiveStockDto = (OtherReceiveStockDto) MapperUtil.getDtoMapping(stTransaction,
					OtherReceiveStockDto.class);
			otherReceiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stTransaction.getCarrierDetails()));
			otherReceiveStockDto.setTotalAvailableQuantity(stTransaction.getTotalIssuedQuantity());
			otherReceiveStockDto.setTotalAvailableWeight(stTransaction.getTotalIssuedWeight());
			otherReceiveStockDto.setTotalAvailableValue(stTransaction.getTotalIssuedValue());
			otherReceiveStockDto.setSrcDocDate(stTransaction.getIssuedDocDate());
			otherReceiveStockDto.setSrcDocNo(stTransaction.getIssuedDocNo());
			otherReceiveStockDto.setSrcFiscalYear(stTransaction.getIssuedFiscalYear());
			otherReceiveStockDto.setLocationCodeDescription(
					engineService.getLocationDetail(stTransaction.getLocationCode()).getDescription());
			otherReceiveStockDetails.add(otherReceiveStockDto);
		}
		return otherReceiveStockDetails;
	}

	private Example<StockTransactionDao> generateCriteriaForStocktransaction(Integer docNo, String otherReceiveType,
			String otherReceiveStatus) {
		StockTransactionDao stockTransaction = new StockTransactionDao();
		stockTransaction.setStatus(otherReceiveStatus);
		stockTransaction.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		stockTransaction.setIssuedDocNo(docNo);
		stockTransaction.setTransactionType(otherReceiveType);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockTransaction, matcher);
	}

	/**
	 * Call stock transfer service to get the header level data of stock transfer
	 * and return ReceiveStockDto
	 */

	@Override
	public OtherReceiveStockDto getOtherReceive(Integer id, String otherReceiveType) {

		// call stock transaction service to get the header level data of Stock
		// Transaction and transaction id,location code & transaction type are param
		StockTransactionDao stockTransaction = stockTransactionService
				.findStockTransactionByIdAndLocationCodeAndTransactionType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), otherReceiveType);
		// convert stock transfer object to ReceiveStockDto object
		OtherReceiveStockDto otherReceiveStockDto = (OtherReceiveStockDto) MapperUtil.getDtoMapping(stockTransaction,
				OtherReceiveStockDto.class);
		otherReceiveStockDto.setSrcDocNo(stockTransaction.getIssuedDocNo());
		otherReceiveStockDto.setSrcDocDate(stockTransaction.getIssuedDocDate());
		otherReceiveStockDto.setSrcFiscalYear(stockTransaction.getIssuedFiscalYear());
		otherReceiveStockDto.setDestDocDate(stockTransaction.getReceivedDocDate());
		otherReceiveStockDto.setDestDocNo(stockTransaction.getReceivedDocNo());
		otherReceiveStockDto.setTotalAvailableQuantity(stockTransaction.getTotalIssuedQuantity());
		otherReceiveStockDto.setTotalAvailableWeight(stockTransaction.getTotalIssuedWeight());
		otherReceiveStockDto.setTotalAvailableValue(stockTransaction.getTotalIssuedValue());
		otherReceiveStockDto.setLocationCodeDescription(
				engineService.getLocationDetail(stockTransaction.getLocationCode()).getDescription());
		otherReceiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stockTransaction.getCarrierDetails()));
		otherReceiveStockDto.setOtherDetails(MapperUtil.getJsonFromString(stockTransaction.getOtherDetails()));
		return otherReceiveStockDto;
	}

	@Override
	public OtherReceiveStockItemDto getOtherReceiveItem(Integer id, String itemId, String otherReceiveType) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		// call stock transaction service and param are stock transaction id and item
		// id(String)
		Example<StockTransactionDetailsDao> stockTransactionDetailsCriteria = generateCriteriaForStockTransactionItems(
				id, itemId, otherReceiveType, null, null, null, null, null, null);

		// call stock transaction service to get stock transfer details data by stock
		// transaction details example object
		StockTransactionDetailsDao stockTransactionDetails = stockTransactionService
				.findStockTransactionDetailsByCriteria(stockTransactionDetailsCriteria);

		// convert stock transaction details object to OtherReceiveStockItemDto
		return generateOtherReceiveStockItem(productGroupList, productCategoryList, stockTransactionDetails);
	}

	private OtherReceiveStockItemDto generateOtherReceiveStockItem(Map<String, String> productGroupList,
			Map<String, String> productCategoryList, StockTransactionDetailsDao stockTransactionDetails) {
		OtherReceiveStockItemDto otherReceiveStockItem = (OtherReceiveStockItemDto) MapperUtil
				.getDtoMapping(stockTransactionDetails, OtherReceiveStockItemDto.class);
		otherReceiveStockItem.setItemDetails(MapperUtil.getJsonFromString(stockTransactionDetails.getItemDetails()));
		otherReceiveStockItem.setImageURL(new URLUtil().getImageUrlByItemCode(stockTransactionDetails.getItemCode()));

		otherReceiveStockItem.setProductCategory(stockTransactionDetails.getProductCategory());
		otherReceiveStockItem
				.setProductCategoryDesc(productCategoryList.get(stockTransactionDetails.getProductCategory()));
		otherReceiveStockItem.setProductGroup(stockTransactionDetails.getProductGroup());
		otherReceiveStockItem.setProductGroupDesc(productGroupList.get(stockTransactionDetails.getProductGroup()));

		otherReceiveStockItem.setAvailableQuantity(stockTransactionDetails.getIssuedQuantity());
		otherReceiveStockItem.setAvailableValue(stockTransactionDetails.getIssuedValue());
		otherReceiveStockItem.setAvailableWeight(stockTransactionDetails.getIssuedWeight());

		otherReceiveStockItem.setMeasuredQuantity(stockTransactionDetails.getReceivedQuantity());
		otherReceiveStockItem.setMeasuredValue(stockTransactionDetails.getReceivedValue());
		otherReceiveStockItem.setMeasuredWeight(stockTransactionDetails.getReceivedWeight());

		otherReceiveStockItem.setProductCategory(stockTransactionDetails.getProductCategory());
		otherReceiveStockItem
				.setProductCategoryDesc(productCategoryList.get(stockTransactionDetails.getProductCategory()));
		otherReceiveStockItem.setProductGroup(stockTransactionDetails.getProductGroup());
		otherReceiveStockItem.setProductGroupDesc(productGroupList.get(stockTransactionDetails.getProductGroup()));
		return otherReceiveStockItem;
	}

	private Example<StockTransactionDetailsDao> generateCriteriaForStockTransactionItems(Integer id, String itemId,
			String otherReceiveType, String itemCode, String binGroupCode, String binCode, String productGroup,
			String productCategory, String otherReceiveStatus) {
		StockTransactionDao stockTransaction = new StockTransactionDao();
		stockTransaction.setId(id);
		stockTransaction.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		stockTransaction.setTransactionType(otherReceiveType);
		StockTransactionDetailsDao stockTransactionDetails = new StockTransactionDetailsDao();
		stockTransactionDetails.setItemCode(itemCode);
		stockTransactionDetails.setBinCode(binCode);
		stockTransactionDetails.setId(itemId);
		stockTransactionDetails.setBinGroupCode(binGroupCode);
		stockTransactionDetails.setProductCategory(productCategory);
		stockTransactionDetails.setProductGroup(productGroup);
		stockTransactionDetails.setStatus(otherReceiveStatus);
		stockTransactionDetails.setStockTransaction(stockTransaction);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockTransactionDetails, matcher);
	}

	@Override
	@Transactional
	public ReceiveStockItemDto updateOtherReceiveItem(Integer id, String itemId,
			ReceiveStockItemUpdateDto receiveStockItemUpdateDto, String otherReceiveType) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		ObjectMapper mapperObject = MapperUtil.getObjectMapperInstance();
		// call stock transaction service and get stock transaction dao by id,location
		// code,transaction type
		StockTransactionDao stockTransaction = stockTransactionService
				.findStockTransactionByIdAndLocationCodeAndTransactionType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), otherReceiveType);
		StockTransactionDetailsDao stockTransactionDetails = stockTransactionService
				.findByItemIdAndStockTransaction(itemId, stockTransaction);
		LOGGER.debug("stockTransactionDetails - {}", stockTransactionDetails);
		// check for weight tolerance
		// if measured weight is greater than weight tolerance then throw exception
		// checkWeightTolerance method will throw exception in case measured weight is
		// greater than weight tolerance
		// params are location code,product group code,available weight/issue
		// weight,measured
		// weight,available qty/issue qty & measured qty
		if (BinGroupEnum.STN.toString().equals(receiveStockItemUpdateDto.getBinGroupCode())
				|| BinGroupEnum.PURCFA.toString().equals(receiveStockItemUpdateDto.getBinGroupCode())
				|| BinGroupEnum.EXHIBITION.toString().equals(receiveStockItemUpdateDto.getBinGroupCode())
				|| BinGroupEnum.LOAN.toString().equals(receiveStockItemUpdateDto.getBinGroupCode())) {
			engineService.checkWeightToleranceValue(stockTransactionDetails.getProductGroup(),
					stockTransactionDetails.getIssuedWeight(), receiveStockItemUpdateDto.getMeasuredWeight(),
					stockTransactionDetails.getIssuedQuantity(), stockTransactionDetails.getIssuedQuantity());
		}
		validateSolitaireProductGroup(receiveStockItemUpdateDto, mapperObject, stockTransactionDetails);
		// set data from dto to dao and update stock transaction details
		stockTransactionDetails = updateStockTransactionDetails(receiveStockItemUpdateDto, stockTransactionDetails);
		return createReceiveStockItemDto(productGroupList, productCategoryList, stockTransactionDetails);
	}

	private ReceiveStockItemDto createReceiveStockItemDto(Map<String, String> productGroupList,
			Map<String, String> productCategoryList, StockTransactionDetailsDao stockTransactionDetails) {
		// convert stock transaction detals dao to ReceiveStockItemDto
		ReceiveStockItemDto receiveStockItem = (ReceiveStockItemDto) MapperUtil.getDtoMapping(stockTransactionDetails,
				ReceiveStockItemDto.class);
		receiveStockItem.setItemDetails(MapperUtil.getJsonFromString(stockTransactionDetails.getItemDetails()));
		receiveStockItem.setImageURL(new URLUtil().getImageUrlByItemCode(stockTransactionDetails.getItemCode()));
		receiveStockItem.setAvailableQuantity(stockTransactionDetails.getIssuedQuantity());
		receiveStockItem.setAvailableValue(stockTransactionDetails.getIssuedValue());
		receiveStockItem.setAvailableWeight(stockTransactionDetails.getIssuedWeight());
		receiveStockItem.setMeasuredQuantity(stockTransactionDetails.getReceivedQuantity());
		receiveStockItem.setMeasuredValue(stockTransactionDetails.getReceivedValue());
		receiveStockItem.setMeasuredWeight(stockTransactionDetails.getReceivedWeight());

		receiveStockItem.setProductCategory(stockTransactionDetails.getProductCategory());
		receiveStockItem.setProductCategoryDesc(productCategoryList.get(stockTransactionDetails.getProductCategory()));
		receiveStockItem.setProductGroup(stockTransactionDetails.getProductGroup());
		receiveStockItem.setProductGroupDesc(productGroupList.get(stockTransactionDetails.getProductGroup()));
		return receiveStockItem;
	}

	private void validateSolitaireProductGroup(ReceiveStockItemUpdateDto receiveStockItemUpdateDto,
			ObjectMapper mapperObject, StockTransactionDetailsDao stockTransactionDetails) {
		// if product group is SOLITAIRE
		if (stockTransactionDetails.getProductGroup().equals(SOLITAIRE_PRODUCT)) {

			// method for converting item details object to JsonNode
			JsonNode jsonNode = convertToJsonNode(receiveStockItemUpdateDto, mapperObject);

			// get list of uin no string and its coming from ui
			List<String> uinNosList = getListFromJson(mapperObject, jsonNode.toString());

			// get list of uin no string and its coming from db
			List<String> uinNosList1 = getListFromJson(mapperObject, stockTransactionDetails.getItemDetails());

			// if both list don't match then throw exception
			if (!uinNosList.equals(uinNosList1)) {
				throw new ServiceException("UIN is not Matching", "ERR-INV-016");
			}
		}
	}

	private StockTransactionDetailsDao updateStockTransactionDetails(
			ReceiveStockItemUpdateDto receiveStockItemUpdateDto, StockTransactionDetailsDao stockTransactionDetails) {
		BeanUtils.copyProperties(receiveStockItemUpdateDto, stockTransactionDetails);
		stockTransactionDetails.setStatus(StockReceiveStatusEnum.VERIFIED.toString());
		stockTransactionDetails.setReceivedWeight(receiveStockItemUpdateDto.getMeasuredWeight());
		// call for weightDetails calculation
		if (stockTransactionDetails.getIssuedWeightDetails() != null) {
			stockTransactionDetails.setReceivedWeightDetails(WeightUtil.calculateWeightDetails(
					stockTransactionDetails.getIssuedWeight()
							.divide(BigDecimal.valueOf(stockTransactionDetails.getIssuedQuantity())),
					stockTransactionDetails.getIssuedWeightDetails(), receiveStockItemUpdateDto.getMeasuredWeight()
							.divide(BigDecimal.valueOf(stockTransactionDetails.getIssuedQuantity()))));
		} else {
			stockTransactionDetails.setReceivedWeightDetails(stockTransactionDetails.getIssuedWeightDetails());
		}
		return stockTransactionService.saveOrUpdateStockTransactionDetails(stockTransactionDetails);
	}

	/**
	 * This method is to convert object to JsonNode
	 */
	private JsonNode convertToJsonNode(ReceiveStockItemUpdateDto receiveStockItemUpdateDto, ObjectMapper mapperObject) {
		Object object = receiveStockItemUpdateDto.getItemDetails().getData();
		JsonNode jsonNode = null;
		try {
			// call getJsonFromObject method to convert object to JsonNode
			jsonNode = getJsonFromObject(object, mapperObject);
		} catch (Exception e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		return jsonNode;
	}

	/**
	 * This method is to get list of string from Json
	 */
	private List<String> getListFromJson(ObjectMapper mapperObject, String itemDetails) {
		String uinDetails = null;
		JsonNode jsonNode = null;

		// call getJsonFromString method to convert string to object
		Object itemDetailsObject = MapperUtil.getJsonFromString(itemDetails);
		try {
			// call getJsonFromObject method to convert object to JsonNode
			jsonNode = getJsonFromObject(itemDetailsObject, mapperObject);
		} catch (Exception e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}

		jsonNode = jsonNode.path("UINNo");
		String uinNoString = jsonNode.toString();
		uinDetails = uinNoString.replace("[", "").replace("]", "");
		String[] splitArray = uinDetails.split(",");
		return Arrays.asList(splitArray);
	}

	private JsonNode getJsonFromObject(Object obj, ObjectMapper mapperObject) {
		JsonNode jsonNode = null;
		try {
			// convert object to JsonNode
			jsonNode = mapperObject.readTree(mapperObject.writeValueAsString(obj));
		} catch (Exception e) {
			throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
		}
		return jsonNode;
	}

	@Override
	@Transactional
	public void updateAllOtherReceiveItems(Integer id, String stockReceiveType,
			OtherReceiveItemBulkDto otherReceiveStockItemBulkDto) {

		// call stock transfer service to get stock transfer by id,location code &
		// transfer type
		StockTransactionDao stockTransaction = stockTransactionService
				.findStockTransactionByIdAndLocationCodeAndTransactionType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), stockReceiveType);

		// if ids are empty
		if (otherReceiveStockItemBulkDto.getId().isEmpty()) {

			// if bin code is empty
			if (StringUtils.isEmpty(otherReceiveStockItemBulkDto.getBinCode())) {
				stockTransactionService.verifyAllStockTransactionItems(StockReceiveStatusEnum.VERIFIED.toString(), null,
						null, stockTransaction);
			} else {
				stockTransactionService.verifyAllStockTransactionItems(StockReceiveStatusEnum.VERIFIED.toString(),
						otherReceiveStockItemBulkDto.getBinCode(), otherReceiveStockItemBulkDto.getBinGroupCode(),
						stockTransaction);
			}
		} else {
			if (StringUtils.isEmpty(otherReceiveStockItemBulkDto.getBinCode())) {
				stockTransactionService.verifyAllItemsByItemId(stockTransaction,
						StockReceiveStatusEnum.VERIFIED.toString(), otherReceiveStockItemBulkDto.getId());
			} else {
				stockTransactionService.updateAllStockTransactionDetailsByItemId(stockTransaction,
						otherReceiveStockItemBulkDto.getId(), otherReceiveStockItemBulkDto.getBinCode(),
						otherReceiveStockItemBulkDto.getBinGroupCode());
			}
		}

		// get list of stock transfer details by stock transfer
		List<StockTransactionDetailsDao> stockTransactionDetails = stockTransactionService
				.findAllStockTransactionDetails(stockTransaction);

		// update stock transfer data
		updateStockTransaction(stockTransaction, stockTransactionDetails);
	}

	private void updateStockTransaction(StockTransactionDao stockTransaction,
			List<StockTransactionDetailsDao> stockTransactionDetails) {
		Short totalReceivedQty = 0;
		BigDecimal totalReceivedValue = BigDecimal.ZERO;
		BigDecimal totalReceivedWeight = BigDecimal.ZERO;

		// reiterate list of StockTransferDetails and calculate total received
		// quantity,total received value,total received weight
		for (StockTransactionDetailsDao stTransactionDetails : stockTransactionDetails) {
			totalReceivedQty = (short) (totalReceivedQty + stTransactionDetails.getReceivedQuantity());
			totalReceivedValue = totalReceivedValue.add(stTransactionDetails.getReceivedValue());
			totalReceivedWeight = totalReceivedWeight.add(stTransactionDetails.getReceivedWeight());
		}

		stockTransaction.setTotalReceivedQuantity(totalReceivedQty);
		stockTransaction.setTotalReceivedValue(totalReceivedValue);
		stockTransaction.setTotalIssuedWeight(totalReceivedWeight);

		// call stock transfer service & update total received quantity,total received
		// value,total received weight of
		// stock transfer
		stockTransactionService.updateStockTransaction(stockTransaction);
	}

	@Override
	public OtherReceiveStockDto createStockReceiveItems(String otherReceiveType,
			OtherReceiveStockCreateDto otherReceiveStockCreateDto) {
		StockTransactionDao stTransaction;
		CountryDetailsDto countryDetails = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		Short totalReceivedQty = 0;
		BigDecimal totalReceivedValue = BigDecimal.ZERO;
		BigDecimal totalReceivedWeight = BigDecimal.ZERO;
		List<StockTransactionDetailsDao> stockTransactionDetails = new ArrayList<>();
		List<InventoryDetailsDaoExt> inventoryDetailsList = new ArrayList<>();
		// create new row in stock transaction for ADJ & PSV
		stTransaction = createStockTransaction(otherReceiveType, otherReceiveStockCreateDto, countryDetails,
				businessDayDto);
		String correlationId = UUID.randomUUID().toString();
		for (ReceiveItemDto receiveItemDto : otherReceiveStockCreateDto.getItems()) {
			String inventoryId = UUID.randomUUID().toString();
			// call product service api to get item details
			ItemLiteDto itemLiteDto = engineService.getItemDetails(receiveItemDto.getItemCode());
			// validation for Adjustment and PSV
			//validationForAdjAndPSV(otherReceiveType, itemLiteDto);
			String lotNumber = engineService.getLotNumber(DocTypeEnum.OTHERRECPT);
			// create stock transaction list
			createStockTransactionsList(stockTransactionDetails, receiveItemDto, stTransaction, itemLiteDto, lotNumber,
					countryDetails, inventoryId);
			// create new row in inventory details
			createInventoryDetails(inventoryDetailsList, receiveItemDto, itemLiteDto, stTransaction.getOrgCode(),
					lotNumber, countryDetails, correlationId, stTransaction.getReceivedDocNo(), inventoryId);
			// calculate total received weight,total received quantity,total received value
			totalReceivedQty = (short) (totalReceivedQty + receiveItemDto.getQuantity());
			totalReceivedValue = totalReceivedValue
					.add(receiveItemDto.getValue().multiply(BigDecimal.valueOf(receiveItemDto.getQuantity())));
			totalReceivedWeight = totalReceivedWeight
					.add(receiveItemDto.getMeasuredWeight().multiply(BigDecimal.valueOf(receiveItemDto.getQuantity())));
		}
		// update total received quantity,total received value,total received weight in
		// stock transaction
		stTransaction.setTotalReceivedQuantity(totalReceivedQty);
		stTransaction.setTotalReceivedValue(totalReceivedValue);
		stTransaction.setTotalReceivedWeight(totalReceivedWeight);
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);

		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		if (statusMap.get(ISOFFLINE).booleanValue()) {
			SyncStagingDto stagingDto = otherReceiveFacadeImp.createStockReceiveAndStaging(stTransaction,
					inventoryDetailsList, StockTransferStatusEnum.PUBLISHED.name(), stockTransactionDetails);
			inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(), stagingDto);
		} else {
			otherReceiveFacadeImp.createStockReceiveAndStaging(stTransaction, inventoryDetailsList,
					StockTransferStatusEnum.RECEIVED.name(), stockTransactionDetails);
			// create new rows in inventory details
			invDetailsService.addInventoryDetails(inventoryDetailsList, stTransaction.getReceivedDocNo(),
					DocTypeEnum.OTHERRECPT);
		}

		// convert stock transaction object to OtherReceiveStockDto DTO
		return createOtherReceiveStockDtoObject(stTransaction);
	}

	/**
	 * @param stTransaction
	 * @param inventoryDetailsList
	 * @param name
	 * @param stockTransactionDetails
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto createStockReceiveAndStaging(StockTransactionDao stTransaction,
			List<InventoryDetailsDaoExt> inventoryDetailsList, String status,
			List<StockTransactionDetailsDao> stockTransactionDetails) {
		stTransaction.setStatus(status);
		stockTransactionService.updateStockTransaction(stTransaction);
		// create new rows in stock transaction details for ADJ & PSV
		stockTransactionDetails.forEach(st -> st.setStatus(status));
		stockTransactionService.addStockTransactionDetails(stockTransactionDetails);
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		if (status.equals(StockTransferStatusEnum.PUBLISHED.name())) {
			syncStagingDto = otherReceiveFacadeImp.getStagingDto(inventoryDetailsList, stTransaction);
		}
		return syncStagingDto;

	}

	private void validationForAdjAndPSV(String otherReceiveType, ItemLiteDto itemDto) {
		if (otherReceiveType.equals(OtherReceiveTypeAdjPsvEnum.ADJ.toString())) {
			// Adjustment is only for Plain Gold and PJWS
			// if item's product group doesn't match throw exception
			if (!itemDto.getProductGroupCode().equals(ProductGroupCodeEnum.GOLD_PLAIN.getCode())
					&& !itemDto.getProductGroupCode().equals(ProductGroupCodeEnum.PJWS.getCode())
					&& !itemDto.getProductGroupCode().equals(ProductGroupCodeEnum.GOLD_COIN.getCode())) {
				throw new ServiceException("Item is not valid for adjustment", "ERR-INV-018");
			}
		}
		// PSV is only for Plain Gold and Gold Studded
		// if item's product group doesn't match throw exception
		else if (otherReceiveType.equals(OtherReceiveTypeAdjPsvEnum.PSV.toString())
				&& (!itemDto.getProductGroupCode().equals(ProductGroupCodeEnum.GOLD_PLAIN.getCode())
						&& !itemDto.getProductGroupCode().equals(ProductGroupCodeEnum.GOLD_STUDDED.getCode()))) {
			throw new ServiceException("Item is not valid for PSV", "ERR-INV-019");
		}
	}

	private void createInventoryDetails(List<InventoryDetailsDaoExt> inventoryDetailsList,
			ReceiveItemDto receiveItemDto, ItemLiteDto itemDto, String orgCode, String lotNumber,
			CountryDetailsDto countryDetails, String correlationId, Integer docNumber, String invId) {
		InventoryDetailsDaoExt invDetails = new InventoryDetailsDaoExt();
		invDetails.setId(invId);
		invDetails.setBinCode(receiveItemDto.getBinCode());
		invDetails.setBinGroupCode(receiveItemDto.getBinGroupCode());
		invDetails.setBinModifiedDate(new Date());
		invDetails.setCurrencyCode(countryDetails.getCurrencyCode());
		invDetails.setCreatedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		invDetails.setCreatedDate(new Date());
		invDetails.setItemCode(itemDto.getItemCode());
		invDetails.setMfgDate(new Date());
		invDetails.setItemCode(receiveItemDto.getItemCode());
		invDetails.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		invDetails.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		invDetails.setLastModifiedDate(new Date());
		invDetails.setLotNumber(lotNumber);
		invDetails.setProductCategory(itemDto.getProductCategoryCode());
		invDetails.setProductGroup(itemDto.getProductGroupCode());
		invDetails.setSerialNumber(String.valueOf(receiveItemDto.getMeasuredWeight()));
		invDetails.setStdValue(receiveItemDto.getValue());
		invDetails.setStdWeight(receiveItemDto.getMeasuredWeight());
		invDetails.setTotalQuantity(receiveItemDto.getQuantity());
		BigDecimal totalValue = receiveItemDto.getValue().multiply(BigDecimal.valueOf(receiveItemDto.getQuantity()));
		invDetails.setTotalValue(totalValue);
		BigDecimal totalWeight = receiveItemDto.getMeasuredWeight()
				.multiply(BigDecimal.valueOf(receiveItemDto.getQuantity()));
		invDetails.setTotalWeight(totalWeight);
		invDetails.setOrgCode(orgCode);
		invDetails.setWeightUnit(countryDetails.getWeightUnit());
		invDetails.setStockInwardDate(new Date());
		invDetails.setDocNumber(docNumber);
		invDetails.setDocType(DocTypeEnum.OTHERRECPT.name());
		invDetails.setFiscalYear(countryDetails.getFiscalYear().shortValue());
		invDetails.setActionType(InventoryDetailsActionEnum.ADD.name());
		invDetails.setCorrelationId(correlationId);
		invDetails.setIssuedQuantity((short) 0);
		// invDetails.setItemDetails("{}");
		invDetails.setTotalWeightDetails(
				MapperUtil.getStringFromJson(getWeightDetails(receiveItemDto.getMeasuredWeight())));
		invDetails.setIsHallmarked(receiveItemDto.getIsHallmarked());
		invDetails.setItemDetails(MapperUtil.getStringFromJson(getHallmarkDetails(receiveItemDto.getIsHallmarked())));
		inventoryDetailsList.add(invDetails);
	}

	private JsonData getWeightDetails(BigDecimal measuredWt) {
		WeightDTO weightDetails = new WeightDTO();
		weightDetails.setGoldWeight(measuredWt);
		weightDetails.setDiamondWeight(BigDecimal.ZERO);
		weightDetails.setMaterialWeight(BigDecimal.ZERO);
		weightDetails.setPlatinumWeight(BigDecimal.ZERO);
		weightDetails.setSilverWeight(BigDecimal.ZERO);
		weightDetails.setStoneWeight(BigDecimal.ZERO);
		JsonData inventoryWeightDetails = new JsonData();
		inventoryWeightDetails.setType("WEIGHT_DETAILS");
		inventoryWeightDetails.setData(weightDetails);
		return inventoryWeightDetails;

	}

	private JsonData getHallmarkDetails(Boolean hallmarked) {
		InventoryItemDetailsDto hallmarkDetails = new InventoryItemDetailsDto();
		hallmarkDetails.setStoneValue(BigDecimal.ZERO);
		hallmarkDetails.setDocNo(0);
		hallmarkDetails.setDocDate(null);
		hallmarkDetails.setHallMarkRemarks1(null);
		hallmarkDetails.setHallMarkingCode(null);
		hallmarkDetails.setHallMarkingCentreName(null);
		hallmarkDetails.setHallMarkRemarks(null);
		hallmarkDetails.setHallMarkedDate(null);
		if(hallmarked != null) {
		hallmarkDetails.setIsHallMarking(hallmarked);
		}
		else {
			hallmarkDetails.setIsHallMarking(false);
		}
		hallmarkDetails.setSold(null);
		JsonData inventoryHallmarkDetails = new JsonData();
		inventoryHallmarkDetails.setType("ITEM_DETAILS");
		inventoryHallmarkDetails.setData(hallmarkDetails);
		return inventoryHallmarkDetails;

	}
	
	private OtherReceiveStockDto createOtherReceiveStockDtoObject(StockTransactionDao stTransaction) {
		OtherReceiveStockDto otherReceiveStockDto = (OtherReceiveStockDto) MapperUtil.getDtoMapping(stTransaction,
				OtherReceiveStockDto.class);
		otherReceiveStockDto.setDestDocDate(stTransaction.getReceivedDocDate());
		otherReceiveStockDto.setDestDocNo(stTransaction.getReceivedDocNo());
		otherReceiveStockDto.setSrcDocDate(stTransaction.getIssuedDocDate());
		otherReceiveStockDto.setSrcDocNo(stTransaction.getIssuedDocNo());
		otherReceiveStockDto.setSrcFiscalYear(stTransaction.getIssuedFiscalYear());
		otherReceiveStockDto.setTotalAvailableQuantity(stTransaction.getTotalIssuedQuantity());
		otherReceiveStockDto.setTotalAvailableValue(stTransaction.getTotalIssuedValue());
		otherReceiveStockDto.setTotalAvailableWeight(stTransaction.getTotalIssuedWeight());
		otherReceiveStockDto.setTotalMeasuredQuantity(stTransaction.getTotalReceivedQuantity());
		otherReceiveStockDto.setTotalMeasuredValue(stTransaction.getTotalReceivedValue());
		otherReceiveStockDto.setTotalMeasuredWeight(stTransaction.getTotalReceivedWeight());
		otherReceiveStockDto.setTransactionType(stTransaction.getTransactionType());
		return otherReceiveStockDto;
	}

	private List<StockTransactionDetailsDao> createStockTransactionsList(
			List<StockTransactionDetailsDao> stockTransactionDetails, ReceiveItemDto receiveItemDto,
			StockTransactionDao stockTransaction, ItemLiteDto itemDto, String lotNumber,
			CountryDetailsDto countryDetails, String invId) {
		StockTransactionDetailsDao stTransactionDetails = new StockTransactionDetailsDao();
		BeanUtils.copyProperties(receiveItemDto, stTransactionDetails);
		stTransactionDetails.setCurrencyCode(countryDetails.getCurrencyCode());
		stTransactionDetails.setIssuedQuantity((short) 0);
		stTransactionDetails.setIssuedValue(BigDecimal.ZERO);
		stTransactionDetails.setIssuedWeight(BigDecimal.ZERO);
		stTransactionDetails.setIssuedBinCode(receiveItemDto.getBinCode());
		stTransactionDetails.setLotNumber(lotNumber);
		stTransactionDetails.setMfgDate(new Date());
		stTransactionDetails.setProductCategory(itemDto.getProductCategoryCode());
		stTransactionDetails.setProductGroup(itemDto.getProductGroupCode());
		stTransactionDetails.setReceivedBinCode(receiveItemDto.getBinCode());
		stTransactionDetails.setReceivedQuantity(receiveItemDto.getQuantity());
		stTransactionDetails.setReceivedValue(receiveItemDto.getValue());
		//stTransactionDetails.setItemDetails("{}");
		TaxCalculationResponseDto taxDetails = engineClient.getTaxDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), null,null,
				TxnTaxTypeEnum.INV_MANAGMNT_STOCK_RECEIPT_OTHER_RECEIPT.name(), itemDto.getItemCode(), false,null);
		stTransactionDetails.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));
		BigDecimal totalTax = BigDecimal.ZERO;
		if (!taxDetails.getData().isEmpty()) {

			for (Entry<String, TaxDetailDto> taxDetailsDto : taxDetails.getData().entrySet()) {
				taxDetailsDto.getValue()
						.setTaxValue((itemDto.getStdValue().multiply(
								(taxDetailsDto.getValue().getTaxPercentage().divide(BigDecimal.valueOf(100)))))
										.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));

				totalTax = totalTax.add(taxDetailsDto.getValue().getTaxValue());
			}
		}
		stTransactionDetails.setTotalTax(totalTax);
		BigDecimal totalWeight = receiveItemDto.getMeasuredWeight()
				.multiply(BigDecimal.valueOf(receiveItemDto.getQuantity()));
		stTransactionDetails.setReceivedWeight(totalWeight);
		// std value & std weight should be calculated from item master
		stTransactionDetails.setStdValue(receiveItemDto.getValue());
		stTransactionDetails.setStdWeight(receiveItemDto.getMeasuredWeight());
		stTransactionDetails.setWeightUnit(countryDetails.getWeightUnit());
		stTransactionDetails.setStockTransaction(stockTransaction);
		stTransactionDetails.setInventoryId(invId);
		stTransactionDetails.setStockInwardDate(new Date());
		stTransactionDetails.setItemDetails(MapperUtil.getStringFromJson(getHallmarkDetails(receiveItemDto.getIsHallmarked())));

		stockTransactionDetails.add(stTransactionDetails);
		return stockTransactionDetails;
	}

	private StockTransactionDao createStockTransaction(String otherReceiveType,
			OtherReceiveStockCreateDto otherReceiveStockCreateDto, CountryDetailsDto countryDto,
			BusinessDayDto businessDayDto) {
		int docNo = inventoryDocMasterService.getDocNumber(countryDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.OTHERRECPT.toString());
		StockTransactionDao stockTransaction = new StockTransactionDao();
		stockTransaction.setCurrencyCode(countryDto.getCurrencyCode());
		stockTransaction.setIssuedDocNo(docNo);
		stockTransaction.setIssuedFiscalYear(countryDto.getFiscalYear().shortValue());
		stockTransaction.setIssuedDocDate(businessDayDto.getBusinessDate());
		stockTransaction.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		stockTransaction.setReceivedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		stockTransaction.setReceivedDocNo(docNo);
		stockTransaction.setReceivedFiscalYear(countryDto.getFiscalYear().shortValue());
		stockTransaction.setReceivedDocDate(businessDayDto.getBusinessDate());
		stockTransaction.setReceivedRemarks(otherReceiveStockCreateDto.getRemarks());
		stockTransaction.setTotalIssuedQuantity((short) 0);
		stockTransaction.setTotalIssuedValue(BigDecimal.ZERO);
		stockTransaction.setTotalIssuedWeight(BigDecimal.ZERO);
		stockTransaction.setTotalReceivedQuantity((short) 0);
		stockTransaction.setTotalReceivedValue(BigDecimal.ZERO);
		stockTransaction.setTotalReceivedWeight(BigDecimal.ZERO);
		stockTransaction.setTransactionType(otherReceiveType);
		stockTransaction.setWeightUnit(countryDto.getWeightUnit());
		stockTransaction.setOrgCode(CommonConstants.ORG_CODE);
		stockTransaction.setStatus(OtherReceiveStatusEnum.RECEIVED.toString());
		return stockTransactionService.updateStockTransaction(stockTransaction);
	}

	@Override
	public OtherReceiveStockDto updateOtherReceive(Integer id, String transactionType,
			OtherReceiveStockConfirmDto otherReceiveStockConfirmDto) {
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		List<InventoryDetailsDaoExt> invDetailsList = new ArrayList<>();
		StockTransactionDao stockTransaction = stockTransactionService
				.findStockTransactionByIdAndLocationCodeAndTransactionType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), transactionType);
		validateOtherReceive(stockTransaction);
		CountryDetailsDto countryDetailsDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		stockTransaction.setReceivedRemarks(otherReceiveStockConfirmDto.getRemarks());
		stockTransaction.setReceivedDocNo(inventoryDocMasterService.getDocNumber(
				countryDetailsDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.OTHERRECPT.toString()));
		stockTransaction.setReceivedDocDate(businessDayDto.getBusinessDate());
		stockTransaction.setReceivedFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);

		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		if (statusMap.get(ISOFFLINE).booleanValue()) {
			stockTransaction.setStatus(StockTransferStatusEnum.PUBLISHED.name());
			SyncStagingDto stagingDto = otherReceiveFacadeImp.updateOtherReceiveAndStaging(id, stockTransaction,
					invDetailsList, StockTransferStatusEnum.PUBLISHED.name(), transactionType);
			inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(), stagingDto);
		} else {
			stockTransaction.setStatus(StockTransferStatusEnum.RECEIVED.name());
			otherReceiveFacadeImp.updateOtherReceiveAndStaging(id, stockTransaction, invDetailsList,
					StockTransferStatusEnum.RECEIVED.name(), transactionType);
			invDetailsService.addInventoryDetails(invDetailsList, stockTransaction.getReceivedDocNo(),
					DocTypeEnum.OTHERRECPT);
		}
		// convert StockTransaction to OtherReceiveStockDto
		return createOtherReceiveStockDto(stockTransaction);
	}

	/**
	 * @param id
	 * @param stockTransaction
	 * @param invDetailsList
	 * @param transactionType
	 * @param name
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto updateOtherReceiveAndStaging(Integer id, StockTransactionDao stockTransaction,
			List<InventoryDetailsDaoExt> invDetailsList, String status, String transactionType) {
		stockTransactionService.updateStockTransaction(stockTransaction);
		stockTransactionService.updateAllStockTransactionDetails(stockTransaction, status);
		// get all item details list by header id
		List<StockTransactionDetailsDao> stockTransactionDetailsList = stockTransactionService
				.findAllStockTransactionDetails(stockTransaction);
		// get item in inventory
		getItemInInventory(invDetailsList, stockTransactionDetailsList, stockTransaction, transactionType);
		// update header table
		stockTransactionService.updateTotalWeightAndQuantity(id, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		if (status.equals(StockTransferStatusEnum.PUBLISHED.name())) {
			syncStagingDto = otherReceiveFacadeImp.getStagingDto(invDetailsList, stockTransaction);
		}
		return syncStagingDto;
	}

	/**
	 * @param invOtherrecptPossAdd
	 * @param invDetailsList
	 * @param stockTransaction
	 * @return SyncStagingDto
	 */
	public SyncStagingDto getStagingDto(List<InventoryDetailsDaoExt> invDetailsList,
			StockTransactionDao stockTransaction) {
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		InventoryDetailsSyncDtoExt otherRecInvSyncDto = new InventoryDetailsSyncDtoExt();
		List<SyncData> otherRecInvSyncDatas = new ArrayList<>();
		otherRecInvSyncDatas.add(DataSyncUtil
				.createSyncData(otherRecInvSyncDto.getSyncDtoExtList(invDetailsList, stockTransaction.getId()), 0));
		List<String> destinations = new ArrayList<>();
		destinations.add(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		MessageRequest messageRequest = DataSyncUtil.createMessageRequest(otherRecInvSyncDatas,
				InventoryOperationCodes.INV_OTHERRECPT_POSS_ADD, destinations, MessageType.FIFO.toString(),
				DestinationType.SELECTIVE.toString());
		syncStagingDto.setMessageRequest(messageRequest);
		String requestBody = MapperUtil.getJsonString(messageRequest);
		// saving to staging table
		SyncStaging otherRecStaging = new SyncStaging();
		otherRecStaging.setMessage(requestBody);
		otherRecStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		otherRecStaging = inventorySyncStagingRepository.save(otherRecStaging);
		syncStagingDto.setId(otherRecStaging.getId());
		return syncStagingDto;
	}

	private void validateOtherReceive(StockTransactionDao stockTransaction) {
		// throw exception if stock transaction status is RECEIVED
		if (stockTransaction.getStatus().equalsIgnoreCase(OtherReceiveStatusEnum.RECEIVED.name())) {
			throw new ServiceException("This STN Have been already Confirmed", "ERR-INV-013");
		}
		// throw exception if open item count is more than 0
		Integer openItemCount = stockTransactionService.getOpenItemCount(stockTransaction);
		if (openItemCount > 0) {
			throw new ServiceException("Please verify all the items", "ERR-INV-005");
		}
		// throw exception if unassignedBin count is more than 0
		Integer unassignedBin = stockTransactionService.getUnassignedBinCount(stockTransaction);
		if (unassignedBin > 0) {
			throw new ServiceException("Please assign bin to all the items", "ERR-INV-009");
		}
		// if location code doesn't match with logged in user then throw exception
		if (!stockTransaction.getLocationCode()
				.equals(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode())) {
			throw new ServiceException("Can not list items for request id", "ERR-INV-029");
		}
	}

	private OtherReceiveStockDto createOtherReceiveStockDto(StockTransactionDao stockTransaction) {
		OtherReceiveStockDto otherReceiveStockDto = (OtherReceiveStockDto) MapperUtil.getDtoMapping(stockTransaction,
				OtherReceiveStockDto.class);
		otherReceiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stockTransaction.getCarrierDetails()));
		otherReceiveStockDto.setTotalAvailableQuantity(stockTransaction.getTotalIssuedQuantity());
		otherReceiveStockDto.setTotalAvailableValue(stockTransaction.getTotalIssuedValue());
		otherReceiveStockDto.setTotalAvailableWeight(stockTransaction.getTotalIssuedWeight());
		otherReceiveStockDto.setTotalMeasuredQuantity(stockTransaction.getTotalReceivedQuantity());
		otherReceiveStockDto.setTotalMeasuredValue(stockTransaction.getTotalReceivedValue());
		otherReceiveStockDto.setTotalMeasuredWeight(stockTransaction.getTotalReceivedWeight());
		otherReceiveStockDto.setSrcDocDate(stockTransaction.getIssuedDocDate());
		otherReceiveStockDto.setSrcDocNo(stockTransaction.getIssuedDocNo());
		otherReceiveStockDto.setSrcFiscalYear(stockTransaction.getIssuedFiscalYear());
		otherReceiveStockDto.setDestDocDate(stockTransaction.getReceivedDocDate());
		otherReceiveStockDto.setDestDocNo(stockTransaction.getReceivedDocNo());
		return otherReceiveStockDto;
	}

	private void getItemInInventory(List<InventoryDetailsDaoExt> invDetailsList,
			List<StockTransactionDetailsDao> stockTransactionDetailsList, StockTransactionDao stockTransaction,
			String transactionType) {
		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(CommonUtil.getLocationCode());
		String correlationId = UUID.randomUUID().toString();
		for (StockTransactionDetailsDao stockTransactionDetails : stockTransactionDetailsList) {
			InventoryDetailsDaoExt invDetails = new InventoryDetailsDaoExt();
			BeanUtils.copyProperties(stockTransactionDetails, invDetails, "id");
			invDetails.setId(UUID.randomUUID().toString());
			invDetails.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			invDetails.setSerialNumber(stockTransactionDetails.getStdWeight().toString());
			invDetails.setCreatedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			invDetails.setCreatedDate(new Date());
			invDetails.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			invDetails.setLastModifiedDate(new Date());
			invDetails.setTotalQuantity(stockTransactionDetails.getReceivedQuantity());
			invDetails.setTotalValue(stockTransactionDetails.getReceivedValue());
			invDetails.setTotalWeight(stockTransactionDetails.getReceivedWeight());
			invDetails.setTotalWeightDetails(stockTransactionDetails.getReceivedWeightDetails());
			invDetails.setOrgCode(stockTransaction.getOrgCode());
			invDetails.setBinModifiedDate(new Date());
			invDetails.setStockInwardDate(stockTransactionDetails.getStockInwardDate());
			invDetails.setCurrencyCode(countryDetailsDto.getCurrencyCode());
			invDetails.setWeightUnit(countryDetailsDto.getWeightUnit());
			invDetails.setDocNumber(stockTransaction.getReceivedDocNo());
			invDetails.setDocType(DocTypeEnum.OTHERRECPT.name());
			invDetails.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
			invDetails.setActionType(InventoryDetailsActionEnum.ADD.name());
			invDetails.setCorrelationId(correlationId);
			invDetails.setIssuedQuantity((short) 0);
			
			if(stockTransactionDetails.getItemDetails() != null) {
				JsonReader reader = new JsonReader(new StringReader(stockTransactionDetails.getItemDetails()));
				reader.setLenient(true);
			    JsonObject jsonObject = new JsonParser().parse(reader).getAsJsonObject();
			    if(jsonObject.get("data") != null) {
			    JsonObject json = jsonObject.get("data").getAsJsonObject();
			    if(json.get("isHallMarking") != null) {
			    invDetails.setIsHallmarked(json.get("isHallMarking").getAsBoolean());
			    }
			    }
			}
						
			if (transactionType.equals("LOAN")) {
				invDetails.setPreviousBinCode("LOAN");
				invDetails.setPreviousBinGroupCode("LOAN");
			} else if (transactionType.equals("EXH")) {
				invDetails.setPreviousBinCode("EXHIBITION");
				invDetails.setPreviousBinGroupCode("EXHIBITION");
			}
			invDetailsList.add(invDetails);
		}

	}

	@Override
	public PagedRestResponse<List<OtherReceiveStockItemDto>> listOtherReceiveItems(Integer id, String otherReceiveType,
			String itemCode, String binGroupCode, String lotNumber, List<String> binCode, List<String> productGroup,
			List<String> productCategory, String otherReceiveStatus, Pageable pageable) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		// get stock transaction and params are id,location code,transaction type
		StockTransactionDao stTransaction = stockTransactionService
				.findStockTransactionByIdAndLocationCodeAndTransactionType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), otherReceiveType);

		// get pageable list of StockTransactionDetails
		Page<StockTransactionDetailsDao> stTransactionDetails = stockTransactionService.listOtherReceiveItems(
				stTransaction, itemCode, binGroupCode, lotNumber, binCode, productGroup, productCategory,
				otherReceiveStatus, pageable);

		// convert from StockTransactionDetails to OtherReceiveStockItemDto
		List<OtherReceiveStockItemDto> otherReceiveStockItemDtos = new ArrayList<>();
		for (StockTransactionDetailsDao stockTransactionDetails : stTransactionDetails) {
			OtherReceiveStockItemDto otherReceiveStockItemDto = (OtherReceiveStockItemDto) MapperUtil
					.getDtoMapping(stockTransactionDetails, OtherReceiveStockItemDto.class);
			otherReceiveStockItemDto
					.setItemDetails(MapperUtil.getJsonFromString(stockTransactionDetails.getItemDetails()));
			otherReceiveStockItemDto.setAvailableQuantity(stockTransactionDetails.getIssuedQuantity());
			otherReceiveStockItemDto.setAvailableValue(stockTransactionDetails.getIssuedValue());
			otherReceiveStockItemDto.setAvailableWeight(stockTransactionDetails.getIssuedWeight());
			otherReceiveStockItemDto
					.setImageURL(new URLUtil().getImageUrlByItemCode(stockTransactionDetails.getItemCode()));
			otherReceiveStockItemDto.setProductCategory(stockTransactionDetails.getProductCategory());
			otherReceiveStockItemDto
					.setProductCategoryDesc(productCategoryList.get(stockTransactionDetails.getProductCategory()));
			otherReceiveStockItemDto.setProductGroup(stockTransactionDetails.getProductGroup());
			otherReceiveStockItemDto
					.setProductGroupDesc(productGroupList.get(stockTransactionDetails.getProductGroup()));
			otherReceiveStockItemDto.setMeasuredQuantity(stockTransactionDetails.getReceivedQuantity());
			otherReceiveStockItemDto.setMeasuredValue(stockTransactionDetails.getReceivedValue());
			otherReceiveStockItemDto.setMeasuredWeight(stockTransactionDetails.getReceivedWeight());
			otherReceiveStockItemDto.setTaxDetails(MapperUtil.getJsonFromString(stockTransactionDetails.getTaxDetails()));
					
			if(stockTransactionDetails.getItemDetails() != null) {
				JsonReader reader = new JsonReader(new StringReader(stockTransactionDetails.getItemDetails()));
				reader.setLenient(true);
			    JsonObject jsonObject = new JsonParser().parse(reader).getAsJsonObject();
			    if(jsonObject.get("data") != null) {
			    JsonObject json = jsonObject.get("data").getAsJsonObject();
			    if(json.get("isHallMarking") != null) {
			    otherReceiveStockItemDto.setIsHallmarked(json.get("isHallMarking").getAsBoolean());
			    }
			    }
			}
			
			otherReceiveStockItemDtos.add(otherReceiveStockItemDto);
		}
		LOGGER.debug("listProductDtls Count - {}", otherReceiveStockItemDtos.size());
		return new PagedRestResponse<>(otherReceiveStockItemDtos, stTransactionDetails);
	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}

}
