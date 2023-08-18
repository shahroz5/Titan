/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

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
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.DiscountItemMapiingDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.JsonUtils;
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
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dao.StockTransferDetailsDao;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.InventoryDetailsSyncDtoExt;
import com.titan.poss.inventory.dto.ReceivedWeightDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.StockReceiveStatusEnum;
import com.titan.poss.inventory.dto.constants.StockReceiveTypeEnum;
import com.titan.poss.inventory.dto.constants.StockTransferStatusEnum;
import com.titan.poss.inventory.dto.request.ReceiveStockConfirmDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemBulkDto;
import com.titan.poss.inventory.dto.request.ReceiveStockItemUpdateDto;
import com.titan.poss.inventory.dto.request.StnCancelDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.ReceiveStockDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;
import com.titan.poss.inventory.facade.StockReceiveFacade;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.IntegrationService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.InventoryDocMasterService;
import com.titan.poss.inventory.service.InventorySyncDataService;
import com.titan.poss.inventory.service.LocationService;
import com.titan.poss.inventory.service.StockRequestService;
import com.titan.poss.inventory.service.StockTransferService;
import com.titan.poss.inventory.utils.InventoryUtil;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Service("stockReceiveService")
public class StockReceiveFacadeImpl implements StockReceiveFacade {

	private static final Logger LOGGER = LoggerFactory.getLogger(StockReceiveFacadeImpl.class);

	@Autowired
	private StockTransferService stockTransferService;

	@Autowired
	private StockRequestService stockRequestService;

	@Autowired
	InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	protected InventoryDetailsService inventoryDetailsService;

	@Autowired
	LocationService locationService;

	@Autowired
	EngineService engineService;

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	@Autowired
	private StockReceiveFacadeImpl stockReceiveFacadeImp;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	@Autowired
	private EngineServiceClient engineClient;
	
	@Autowired
	private IntegrationService integrationService;

	private static final String SOLITAIRE_PRODUCT = "Studded - Solitaire";

	private static final String ERR_INV_013 = "ERR-INV-013";
	private static final String ERR_INV_047 = "ERR-INV-047";
	private static final String ERR_INV_048 = "ERR-INV-048";

	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";
	public static final BigDecimal ONE_HUNDRED = new BigDecimal(100);

	/*
	 * To get the list of stock receive count based on location code,stock receive
	 * type and status(ISSUED)
	 */
	@Override
	public ListResponse<InventoryCountDto> getStockReceiveCount(String stockReceiveStatus) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<String> stockReceiveTypeList = new ArrayList<>();
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.RECEIVE_FROM_OTHER_BOUTIQUE))) {
			stockReceiveTypeList.add(StockReceiveTypeEnum.BTQ_BTQ.toString());
		}
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.RECEIVE_FROM_FACTORY))) {
			stockReceiveTypeList.add(StockReceiveTypeEnum.FAC_BTQ.toString());
		}
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.RECEIVE_FROM_MERCHENDIZE))) {
			stockReceiveTypeList.add(StockReceiveTypeEnum.MER_BTQ.toString());
		}

		// Call stock transfer service to get the count based on location
		// code,list of stockReceiveType,stockReceiveStatus
		List<InventoryCountDto> stockReceiveCount = stockTransferService.getStockTransferCount(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), stockReceiveStatus,
				stockReceiveTypeList);
		LOGGER.debug("stockReceiveCount size is - {}", stockReceiveCount.size());
		return new ListResponse<>(stockReceiveCount);
	}

	@Override
	public PagedRestResponse<List<ReceiveStockDto>> listStockReceive(Integer srcDocno, String stockReceiveType,
			String stockReceiveStatus, Pageable pageable) {

		// call generateCriteriaForStockTransfer() to get the example object of stock
		// transfer
		Example<StockTransferDao> stockTransferCriteria = generateCriteriaForStockTransfer(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), srcDocno, stockReceiveStatus,
				stockReceiveType);

		// call stock transfer service to get stock transfer pageable data
		Page<StockTransferDao> stockTransferPageData = stockTransferService
				.findStockTransferByCriteria(stockTransferCriteria, pageable);
		LOGGER.debug("stock transfer list Size - {}", stockTransferPageData.getSize());

		List<ReceiveStockDto> receiveStockDetails = new ArrayList<>();

		// convert page of StockTransfer to list of ReceiveStockDto
		generateReceiveStockDto(stockTransferPageData, receiveStockDetails);
		LOGGER.debug("Get stn Details - {}", receiveStockDetails.size());
		return new PagedRestResponse<>(receiveStockDetails, stockTransferPageData);
	}

	@Override
	public PagedRestResponse<List<ReceiveStockDto>> listStockReceiveStnCancel(Integer srcDocNo, String stockReceiveType,
			String stockReceiveStatus, Pageable pageable) {

		LocationCacheDto locationDetails = engineService
				.getLocationDetail(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		Boolean isCancelAllowed = locationDetails.getInventoryDetails().getIsSTNcancellationAllowed();
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		BusinessDayDto businessDayDto = getBusinessDay(authUser.getLocationCode());
		if (!isCancelAllowed) {
			throw new ServiceException("STN cancellation is not allowed for this location", ERR_INV_047);
		} else {
			Integer maxNoOfDaysStnCancel = locationDetails.getInventoryDetails().getMaximumNoOfDaysForSTNCancellation();
			if (maxNoOfDaysStnCancel == null) {
				throw new ServiceException("STN cancellation days are not configured for this location", ERR_INV_048);
			}
			LocalDate date = businessDayDto.getBusinessDate().toInstant().atZone(ZoneId.of("Asia/Kolkata"))
					.toLocalDate();
			LocalDate dateCancel = date.minusDays(maxNoOfDaysStnCancel);
			java.util.Date date1 = java.sql.Date.valueOf(dateCancel);

			Page<StockTransferDao> stockTransferPageData = stockTransferService.findStockTransferForStnCancel(srcDocNo,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), stockReceiveStatus,
					stockReceiveType, date1, pageable);
			LOGGER.debug("stock transfer list Size Stn cancel- {}", stockTransferPageData.getSize());
			List<ReceiveStockDto> receiveStockDetails = new ArrayList<>();
			// convert page of StockTransfer to list of ReceiveStockDto
			generateReceiveStockDto(stockTransferPageData, receiveStockDetails);
			LOGGER.debug("Get stn Details - {}", receiveStockDetails.size());
			return new PagedRestResponse<>(receiveStockDetails, stockTransferPageData);
		}
	}

	@Override
	public StnCancelDto listStockReceiveStnCancelCount(String stockReceiveType, String stockReceiveStatus) {

		LocationCacheDto locationDetails = engineService
				.getLocationDetail(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		Boolean isCancelAllowed = locationDetails.getInventoryDetails().getIsSTNcancellationAllowed();
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		BusinessDayDto businessDayDto = getBusinessDay(authUser.getLocationCode());
		Integer maxNoOfDaysStnCancel = locationDetails.getInventoryDetails().getMaximumNoOfDaysForSTNCancellation();
		LocalDate date = businessDayDto.getBusinessDate().toInstant().atZone(ZoneId.of("Asia/Kolkata")).toLocalDate();
		LocalDate dateCancel = date.minusDays(maxNoOfDaysStnCancel);
		java.util.Date date1 = java.sql.Date.valueOf(dateCancel);
		StnCancelDto stncancel = new StnCancelDto();
		if (isCancelAllowed) {
			long stockTransferPageDataCount = stockTransferService.findStockTransferForStnCancelCount(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), stockReceiveStatus,
					stockReceiveType, date1);
			stncancel.setCount(stockTransferPageDataCount);
			// LOGGER.debug("stock transfer list Size Stn cancel- {}",
			// stockTransferPageData.getSize());
			// List<ReceiveStockDto> receiveStockDetails = new ArrayList<>();
			// convert page of StockTransfer to list of ReceiveStockDto
			// generateReceiveStockDto(stockTransferPageData, receiveStockDetails);
			// LOGGER.debug("Get stn Details - {}", receiveStockDetails.size());
			return stncancel;
		} else {
			throw new ServiceException("STN cancellation is not allowed for this location", ERR_INV_047);
		}
	}

	private void generateReceiveStockDto(Page<StockTransferDao> stockTransferPageData,
			List<ReceiveStockDto> receiveStockDetails) {
		for (StockTransferDao stockTransfer : stockTransferPageData) {
			ReceiveStockDto receiveStockDto = (ReceiveStockDto) MapperUtil.getDtoMapping(stockTransfer,
					ReceiveStockDto.class);
			receiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stockTransfer.getCarrierDetails()));
			receiveStockDto.setTotalAvailableQuantity(stockTransfer.getTotalIssuedQuantity());
			if (stockTransfer.getTotalIssuedValue() != null) {
				receiveStockDto
						.setTotalAvailableValue(stockTransfer.getTotalIssuedValue().setScale(0, RoundingMode.HALF_UP));
			} else {
				receiveStockDto.setTotalAvailableValue(stockTransfer.getTotalIssuedValue());
			}
			receiveStockDto.setTotalAvailableWeight(stockTransfer.getTotalIssuedWeight());
			receiveStockDto.setTotalMeasuredQuantity(stockTransfer.getTotalReceivedQuantity());
			if (stockTransfer.getTotalReceivedValue() != null) {
				receiveStockDto
						.setTotalMeasuredValue(stockTransfer.getTotalReceivedValue().setScale(0, RoundingMode.HALF_UP));
			} else {
				receiveStockDto.setTotalMeasuredValue(stockTransfer.getTotalReceivedValue());
			}
			receiveStockDto.setTotalMeasuredWeight(stockTransfer.getTotalReceivedWeight());
            receiveStockDto.setSrcLocationDescription(
					engineService.getLocationDetail(stockTransfer.getSrcLocationCode()).getDescription());
            receiveStockDto.setDestLocationDescription(
					engineService.getLocationDetail(stockTransfer.getDestLocationCode()).getDescription());
			receiveStockDto.setRemarks(stockTransfer.getIssuedRemarks());
			if (stockTransfer.getStockRequestId() != null) {
				StockRequestDao stRqDao = stockRequestService.findById(stockTransfer.getStockRequestId());
				receiveStockDto.setReqDocNo(stRqDao.getReqDocNo());
				receiveStockDto.setReqDocDate(stRqDao.getReqDocDate());
			}
			receiveStockDetails.add(receiveStockDto);
		}
	}

	// private method for example criteria of stock transfer
	private Example<StockTransferDao> generateCriteriaForStockTransfer(String locationCode, Integer srcDocNo,
			String status, String transferType) {
		StockTransferDao stockTransfer = new StockTransferDao();
		stockTransfer.setStatus(status);
		stockTransfer.setDestLocationCode(locationCode);
		stockTransfer.setSrcDocNo(srcDocNo);
		stockTransfer.setTransferType(transferType);

		// if any null value comes then ignore null values
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockTransfer, matcher);
	}

	@Override
	public ReceiveStockDto getStockReceive(Integer id, String stockReceiveType) {

		// call stock transfer service to get the header level data of Stock Transfer
		StockTransferDao stockTransfer = stockTransferService.findStockTransferByIdAndDestLocationCodeAndTransferType(
				id, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), stockReceiveType);

		// convert stock transfer object to ReceiveStockDto object
		ReceiveStockDto receiveStockDto = (ReceiveStockDto) MapperUtil.getDtoMapping(stockTransfer,
				ReceiveStockDto.class);
		receiveStockDto.setTotalAvailableQuantity(stockTransfer.getTotalIssuedQuantity());
		if (stockTransfer.getTotalIssuedValue() != null) {
			receiveStockDto
					.setTotalAvailableValue(stockTransfer.getTotalIssuedValue().setScale(0, RoundingMode.HALF_UP));
		} else {
			receiveStockDto.setTotalAvailableValue(stockTransfer.getTotalIssuedValue());
		}
		receiveStockDto.setTotalAvailableWeight(stockTransfer.getTotalIssuedWeight());
		receiveStockDto.setTotalMeasuredQuantity(stockTransfer.getTotalReceivedQuantity());
		if (stockTransfer.getTotalReceivedValue() != null) {
			receiveStockDto
					.setTotalMeasuredValue(stockTransfer.getTotalReceivedValue().setScale(0, RoundingMode.HALF_UP));
		} else {
			receiveStockDto.setTotalMeasuredValue(stockTransfer.getTotalReceivedValue());
		}
		receiveStockDto.setTotalMeasuredWeight(stockTransfer.getTotalReceivedWeight());
        receiveStockDto.setSrcLocationDescription(
				engineService.getLocationDetail(stockTransfer.getSrcLocationCode()).getDescription());
        receiveStockDto.setDestLocationDescription(
				engineService.getLocationDetail(stockTransfer.getDestLocationCode()).getDescription());
		receiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stockTransfer.getCarrierDetails()));
		return receiveStockDto;
	}

	@Override
	public ReceiveStockDto getStockReceiveStnCancel(Integer id, String status, String stockReceiveType) {

		// call stock transfer service to get the header level data of Stock Transfer
		StockTransferDao stockTransfer = stockTransferService.getStockTransferByIdAndType(id, status, stockReceiveType);

		// convert stock transfer object to ReceiveStockDto object
		ReceiveStockDto receiveStockDto = (ReceiveStockDto) MapperUtil.getDtoMapping(stockTransfer,
				ReceiveStockDto.class);
		receiveStockDto.setTotalAvailableQuantity(stockTransfer.getTotalIssuedQuantity());
		if (stockTransfer.getTotalIssuedValue() != null) {
			receiveStockDto
					.setTotalAvailableValue(stockTransfer.getTotalIssuedValue().setScale(0, RoundingMode.HALF_UP));
		} else {
			receiveStockDto.setTotalAvailableValue(stockTransfer.getTotalIssuedValue());
		}
		receiveStockDto.setTotalAvailableWeight(stockTransfer.getTotalIssuedWeight());
		receiveStockDto.setTotalMeasuredQuantity(stockTransfer.getTotalReceivedQuantity());
		if (stockTransfer.getTotalReceivedValue() != null) {
			receiveStockDto
					.setTotalMeasuredValue(stockTransfer.getTotalReceivedValue().setScale(0, RoundingMode.HALF_UP));
		} else {
			receiveStockDto.setTotalMeasuredValue(stockTransfer.getTotalReceivedValue());
		}
		receiveStockDto.setTotalMeasuredWeight(stockTransfer.getTotalReceivedWeight());
        receiveStockDto.setSrcLocationDescription(
				engineService.getLocationDetail(stockTransfer.getSrcLocationCode()).getDescription());
        receiveStockDto.setDestLocationDescription(
				engineService.getLocationDetail(stockTransfer.getDestLocationCode()).getDescription());
		receiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stockTransfer.getCarrierDetails()));
		receiveStockDto.setRemarks(stockTransfer.getIssuedRemarks());
		if (stockTransfer.getStockRequestId() != null) {
			StockRequestDao stRqDao = stockRequestService.findById(stockTransfer.getStockRequestId());
			receiveStockDto.setReqDocNo(stRqDao.getReqDocNo());
			receiveStockDto.setReqDocDate(stRqDao.getReqDocDate());
		}
		return receiveStockDto;
	}

	@Override
	public ReceiveStockItemDto getStockReceiveItem(Integer id, String itemId, String stockReceiveType) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		// call generic criteria method(generateCriteriaForStockTransferDetails) to get
		// the example criteria of stock transfer details
		Example<StockTransferDetailsDao> stockTransferDetailsExample = generateCriteriaForStockTransferDetails(id,
				itemId, stockReceiveType, null, null, null, null, null, null, null, null);

		// call stock transfer service to get stock transfer details data by stock
		// transfer details criteria example object
		StockTransferDetailsDao stockTransferDetails = stockTransferService
				.findStockTransferDetailsByCriteria(stockTransferDetailsExample);

		// convert stock transfer details object to ReceiveStockItemDto
		ReceiveStockItemDto receiveStockItem = (ReceiveStockItemDto) MapperUtil.getDtoMapping(stockTransferDetails,
				ReceiveStockItemDto.class);

		receiveStockItem.setAvailableQuantity(stockTransferDetails.getIssuedQuantity());
		receiveStockItem.setAvailableWeight(stockTransferDetails.getIssuedWeight());
		receiveStockItem.setAvailableValue(stockTransferDetails.getIssuedValue());
		receiveStockItem.setMeasuredQuantity(stockTransferDetails.getReceivedQuantity());
		receiveStockItem.setMeasuredWeight(stockTransferDetails.getReceivedWeight());
		receiveStockItem.setMeasuredValue(stockTransferDetails.getReceivedValue());

		receiveStockItem.setItemDetails(MapperUtil.getJsonFromString(stockTransferDetails.getItemDetails()));
		receiveStockItem.setImageURL(new URLUtil().getImageUrlByItemCode(stockTransferDetails.getItemCode()));

		receiveStockItem.setProductCategory(stockTransferDetails.getProductCategory());
		receiveStockItem.setProductCategoryDesc(productCategoryList.get(stockTransferDetails.getProductCategory()));
		receiveStockItem.setProductGroup(stockTransferDetails.getProductGroup());
		receiveStockItem.setProductGroupDesc(productGroupList.get(stockTransferDetails.getProductGroup()));
		receiveStockItem.setTaxDetails(MapperUtil.getJsonFromString(stockTransferDetails.getTaxDetails()));
		return receiveStockItem;
	}

	// create generic method to get the example criteria of stock transfer details
	private Example<StockTransferDetailsDao> generateCriteriaForStockTransferDetails(Integer id, String itemId,
			String transferType, String status, String itemCode, String binGroupCode, String lotNumber, String binCode,
			String productGroup, String productCategory, String locationCode) {
		StockTransferDao stockTransfer = new StockTransferDao();
		stockTransfer.setId(id);
		stockTransfer.setTransferType(transferType);
		stockTransfer.setDestLocationCode(locationCode);
		StockTransferDetailsDao stockTransferDetails = new StockTransferDetailsDao();
		stockTransferDetails.setStockTransfer(stockTransfer);
		stockTransferDetails.setId(itemId);
		stockTransferDetails.setLotNumber(lotNumber);
		stockTransferDetails.setBinCode(binCode);
		stockTransferDetails.setBinGroupCode(binGroupCode);
		stockTransferDetails.setItemCode(itemCode);
		stockTransferDetails.setStatus(status);
		stockTransferDetails.setProductCategory(productCategory);
		stockTransferDetails.setProductGroup(productGroup);

		// if any null value comes then ignore null values
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockTransferDetails, matcher);
	}

	@Override
	@Transactional
	public ReceiveStockItemDto updateStockReceiveItem(Integer id, String itemid,
			ReceiveStockItemUpdateDto receiveStockItemUpdateDto, String stockReceiveType) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		// call stock transfer service by id,dest location code and transfer type
		StockTransferDao stockTransfer = stockTransferService.findStockTransferByIdAndDestLocationCodeAndTransferType(
				id, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), stockReceiveType);
		StockTransferDetailsDao stockTransferDetails = stockTransferService
				.findStockTransferDetailsByItemIdAndStockTransfer(itemid, stockTransfer);
		LOGGER.debug("stockTransferDetails - {}", stockTransferDetails);
		validatationForStockReceive(receiveStockItemUpdateDto, stockTransfer, stockTransferDetails);
		// check for weight tolerance
		// if measured weight is greater than weight tolerance then throw exception
		// checkWeightTolerance method will throw exception in case measured weight is
		// greater than weight tolerance
		// params are location code,product group code,available weight/issue
		// weight,measured
		// weight,available qty/issue qty & measured qty
		if (BinGroupEnum.STN.toString().equals(receiveStockItemUpdateDto.getBinGroupCode())) {
			engineService.checkWeightToleranceValue(stockTransferDetails.getProductGroup(),
					stockTransferDetails.getIssuedWeight(), receiveStockItemUpdateDto.getMeasuredWeight(),
					stockTransferDetails.getIssuedQuantity(), stockTransferDetails.getIssuedQuantity());
		}
		validateSolitaireProduct(receiveStockItemUpdateDto, stockTransferDetails);
		// set data from dto to dao and update stock transfer details
		stockTransferDetails = updateStockTransferDetails(receiveStockItemUpdateDto, stockTransferDetails);
		return convertToReceiveStockItemDto(productGroupList, productCategoryList, stockTransferDetails);
	}

	private ReceiveStockItemDto convertToReceiveStockItemDto(Map<String, String> productGroupList,
			Map<String, String> productCategoryList, StockTransferDetailsDao stockTransferDetails) {
		// convert stock transfer detals dao to ReceiveStockItemDto
		ReceiveStockItemDto receiveStockItem = new ReceiveStockItemDto();
		MapperUtil.beanMapping(stockTransferDetails, receiveStockItem);
		receiveStockItem.setItemDetails(MapperUtil.getJsonFromString(stockTransferDetails.getItemDetails()));
		receiveStockItem.setImageURL(new URLUtil().getImageUrlByItemCode(stockTransferDetails.getItemCode()));
		receiveStockItem.setAvailableQuantity(stockTransferDetails.getIssuedQuantity());
		receiveStockItem.setAvailableWeight(stockTransferDetails.getIssuedWeight());
		receiveStockItem.setAvailableValue(stockTransferDetails.getIssuedValue());
		receiveStockItem.setMeasuredQuantity(stockTransferDetails.getReceivedQuantity());
		receiveStockItem.setMeasuredWeight(stockTransferDetails.getReceivedWeight());
		receiveStockItem.setMeasuredValue(stockTransferDetails.getReceivedValue());

		receiveStockItem.setProductCategory(stockTransferDetails.getProductCategory());
		receiveStockItem.setProductCategoryDesc(productCategoryList.get(stockTransferDetails.getProductCategory()));
		receiveStockItem.setProductGroup(stockTransferDetails.getProductGroup());
		receiveStockItem.setProductGroupDesc(productGroupList.get(stockTransferDetails.getProductGroup()));

		return receiveStockItem;
	}

	private void validatationForStockReceive(ReceiveStockItemUpdateDto receiveStockItemUpdateDto,
			StockTransferDao stockTransfer, StockTransferDetailsDao stockTransferDetails) {

		// if the item status is RECEIVED then throw exception
		if (stockTransferDetails.getStatus().equals(StockReceiveStatusEnum.RECEIVED.toString())) {
			throw new ServiceException("The item has been already received", ERR_INV_013);
		}
		if (!getHallmarkedFromItemDetails(stockTransferDetails)) { // hallmarking condition check
			List bins = Arrays.asList(BinGroupEnum.DEFECTIVE.toString(), BinGroupEnum.DISPUTE.toString(),
					BinGroupEnum.HALLMARKDISPUTEBIN.toString());
			if (!bins.contains(receiveStockItemUpdateDto.getBinGroupCode())) {
				throw new ServiceException("Items cannot be moved to any STN bin", ERR_INV_013);
			}
		}

		if (stockTransferDetails.getOrderType() != null) {
			if (receiveStockItemUpdateDto.getBinGroupCode().equals(BinGroupEnum.STN.toString())
					&& !"R".equals(stockTransferDetails.getOrderType())) {
				throw new ServiceException("Only regular items can be moved to STN Bin/Bingroup ", ERR_INV_013);
			}
			if (receiveStockItemUpdateDto.getBinGroupCode().equals(BinGroupEnum.CUSTOMERORDERBIN.toString())
					&& !stockTransferDetails.getOrderType().equals("P")) {
				throw new ServiceException("Only cutomer order items can be moved to CUSTOMERORDERBIN Bin/Bingroup ",
						ERR_INV_013);
			}
			if (receiveStockItemUpdateDto.getBinGroupCode().equals(BinGroupEnum.SPARE.toString())
					&& !stockTransferDetails.getOrderType().equals("S")) {
				throw new ServiceException("Only spare items can be moved to SPARE Bin/Bingroup ", ERR_INV_013);
			}
			if (receiveStockItemUpdateDto.getBinGroupCode().equals(BinGroupEnum.DEFECTIVE.toString())
					&& !stockTransferDetails.getOrderType().equals("R")) {
				throw new ServiceException("Only regular items can be moved to DEFECTIVEBIN Bin/Bingroup ",
						ERR_INV_013);
			}

		} else {
			if (receiveStockItemUpdateDto.getBinGroupCode().equals(BinGroupEnum.CUSTOMERORDERBIN.toString())) {
				throw new ServiceException("Only customer order items can be moved to CUSTOMERORDERBIN Bin/Bingroup ",
						ERR_INV_013);
			}
			if (receiveStockItemUpdateDto.getBinGroupCode().equals(BinGroupEnum.SPARE.toString())) {
				throw new ServiceException("Only spare items can be moved to SPARE Bin/Bingroup ", ERR_INV_013);
			}
		}

	}

	private void validateSolitaireProduct(ReceiveStockItemUpdateDto receiveStockItemUpdateDto,
			StockTransferDetailsDao stockTransferDetails) {
		// if product group is SOLITAIRE
		if (stockTransferDetails.getProductGroup().equals(SOLITAIRE_PRODUCT)) {
			// method for converting item details object to JsonNode
			JsonNode jsonNode = convertToJsonNode(receiveStockItemUpdateDto);

			// get list of uin no string and its coming from ui
			List<String> uinNosList = JsonUtils.getListValueFromJsonString(jsonNode.toString(), "UINNo");

			// get list of uin no string and its coming from db
			List<String> uinNosList1 = JsonUtils.getListValueFromJsonString(stockTransferDetails.getItemDetails(),
					"UINNo");

			// if both list don't match then throw exception
			if (!uinNosList.equals(uinNosList1)) {
				throw new ServiceException("UIN is not Matching ", "ERR-INV-016");
			}
		}
	}

	private StockTransferDetailsDao updateStockTransferDetails(ReceiveStockItemUpdateDto receiveStockItemUpdateDto,
			StockTransferDetailsDao stockTransferDetails) {
		BeanUtils.copyProperties(receiveStockItemUpdateDto, stockTransferDetails);
		stockTransferDetails.setStatus(StockReceiveStatusEnum.VERIFIED.toString());
		stockTransferDetails.setReceivedWeight(receiveStockItemUpdateDto.getMeasuredWeight());
		// call for weightDetails calculation
		if (stockTransferDetails.getIssuedWeightDetails() != null) {

			stockTransferDetails.setReceivedWeightDetails(WeightUtil.calculateWeightDetails(
					stockTransferDetails.getIssuedWeight()
							.divide(BigDecimal.valueOf(stockTransferDetails.getIssuedQuantity())),
					stockTransferDetails.getIssuedWeightDetails(), receiveStockItemUpdateDto.getMeasuredWeight()
							.divide(BigDecimal.valueOf(stockTransferDetails.getIssuedQuantity()))));
		} else {
			stockTransferDetails.setReceivedWeightDetails(stockTransferDetails.getIssuedWeightDetails());
		}

		return stockTransferService.saveOrUpdateStockTransferDetails(stockTransferDetails);
	}

	/**
	 * This method is to convert object to JsonNode
	 */
	private JsonNode convertToJsonNode(ReceiveStockItemUpdateDto receiveStockItemUpdateDto) {
		ObjectMapper mapper = new ObjectMapper();
		Object object = receiveStockItemUpdateDto.getItemDetails().getData();
		JsonNode jsonNode = null;
		try {
			// convert object to string
			jsonNode = mapper.readTree(mapper.writeValueAsString(object));
		} catch (Exception e) {
			throw new ServiceException("Unable to parse json data", "ERR-CORE-003");
		}
		return jsonNode;
	}

	@Override
	@Transactional
	public void updateAllStockReceiveItems(Integer id, String stockReceiveType,
			ReceiveStockItemBulkDto receiveStockItemBulkDto) {

		// call stock transfer service to get stock transfer by id,location code &
		// transfer type
		StockTransferDao stockTransfer = stockTransferService.findStockTransferByIdAndDestLocationCodeAndTransferType(
				id, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), stockReceiveType);

		// if ids are empty
		if (receiveStockItemBulkDto.getId().isEmpty()) {

			// if bin code is empty
			if (StringUtils.isEmpty(receiveStockItemBulkDto.getBinCode())) {
				stockTransferService.verifyAllStockTransferItems(StockReceiveStatusEnum.VERIFIED.toString(), null,
						stockTransfer);
			} else {
				stockTransferService.verifyAllStockTransferItems(StockReceiveStatusEnum.VERIFIED.toString(),
						receiveStockItemBulkDto.getBinCode(), stockTransfer);
			}
		} else {
			if (StringUtils.isEmpty(receiveStockItemBulkDto.getBinCode())) {
				stockTransferService.verifyAllItemsByItemId(stockTransfer, StockReceiveStatusEnum.VERIFIED.toString(),
						receiveStockItemBulkDto.getId());
			} else {
				stockTransferService.updateAllStockTransferDetailsByItemId(stockTransfer,
						receiveStockItemBulkDto.getId(), receiveStockItemBulkDto.getBinCode());
			}
		}

		// get list of stock transfer details by stock transfer
		List<StockTransferDetailsDao> stockTransferDetails = stockTransferService
				.findAllStockTransferDetails(stockTransfer);

		// update stock transfer data
		updateStockTransfer(stockTransfer, stockTransferDetails);

	}

	private void updateStockTransfer(StockTransferDao stockTransfer,
			List<StockTransferDetailsDao> stockTransferDetails) {
		Short totalReceivedQty = 0;
		BigDecimal totalReceivedValue = BigDecimal.ZERO;
		BigDecimal totalReceivedWeight = BigDecimal.ZERO;

		// reiterate list of StockTransferDetails and calculate total received
		// quantity,total received value,total received weight
		for (StockTransferDetailsDao stTransferDetails : stockTransferDetails) {
			totalReceivedQty = (short) (totalReceivedQty + stTransferDetails.getIssuedQuantity());
			totalReceivedValue = totalReceivedValue.add(stTransferDetails.getIssuedValue());
			totalReceivedWeight = totalReceivedWeight.add(stTransferDetails.getIssuedWeight());
		}

		stockTransfer.setTotalReceivedQuantity(totalReceivedQty);
		stockTransfer.setTotalReceivedValue(totalReceivedValue);
		stockTransfer.setTotalReceivedWeight(totalReceivedWeight);

		// call stock transfer service & update total received quantity,total received
		// value,total received weight of
		// stock transfer
		stockTransferService.saveOrUpdateStockTransfer(stockTransfer);
	}

	@Override
	public ReceiveStockDto cancelStockReceive(Integer id, String stockReceiveType, StnCancelDto stnCancelDto) {
		List<InventoryDetailsDaoExt> invDetailsList = new ArrayList<>();
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		Optional<StockTransferDao> stockTransfer = stockTransferService.findByIdAndTransferType(id, stockReceiveType);
		// throw exception if stockTransfer is empty
		if (!stockTransfer.isPresent()) {
			throw new ServiceException("Stn with stockTransferId = " + id + " does not exist", "ERR-INV-029");
		}
		BusinessDayDto busineeDayDto = getBusinessDay(authUser.getLocationCode());
//		CountryDetailsDto countryDetailsDto = getCountryDetails(authUser.getLocationCode());
		stockTransferCancelValidation(stockTransfer);
		stockTransfer.get().setCancelledDate(busineeDayDto.getBusinessDate());
		stockTransfer.get().setCancelledRemarks(stnCancelDto.getCancelRemarks());
		// stockTransfer.get().setReasonForDelay(receiveStockConfirmDto.getReasonForDelay());
		// stockTransfer.get().setReceivedRemarks(receiveStockConfirmDto.getRemarks());
//		stockTransfer.get()
//				.setDestDocNo(inventoryDocMasterService.getDocNumber(countryDetailsDto.getFiscalYear().shortValue(),
//						authUser.getLocationCode(), DocTypeEnum.STNRECPT.toString()));
//		stockTransfer.get().setDestDocDate(busineeDayDto.getBusinessDate());
//		stockTransfer.get().setDestFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);

		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		if (statusMap.get(ISOFFLINE).booleanValue()) {
			stockTransfer.get().setStatus(StockTransferStatusEnum.PUBLISHED.name());
			SyncStagingDto stagingDto = stockReceiveFacadeImp.updateStockTransferAndStagingStnCancel(id,
					stockTransfer.get(), invDetailsList, StockTransferStatusEnum.PUBLISHED.name());
			inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(), stagingDto);
		} else {
			stockTransfer.get().setStatus(StockTransferStatusEnum.CANCELLED.name());
			stockReceiveFacadeImp.updateStockTransferAndStagingStnCancel(id, stockTransfer.get(), invDetailsList,
					StockTransferStatusEnum.CANCELLED.name());
			inventoryDetailsService.addInventoryDetails(invDetailsList, stockTransfer.get().getDestDocNo(),
					DocTypeEnum.STNRECPT);
		}
		// convert stockTransfer object to ReceiveStockDto
		return createReceiveStockDto(stockTransfer.get());
	}

	@Override
	public ReceiveStockDto updateStockReceive(Integer id, String stockReceiveType,
			ReceiveStockConfirmDto receiveStockConfirmDto) {
		List<InventoryDetailsDaoExt> invDetailsList = new ArrayList<>();
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		Optional<StockTransferDao> stockTransfer = stockTransferService.findByIdAndTransferType(id, stockReceiveType);
		// throw exception if stockTransfer is empty
		if (!stockTransfer.isPresent()) {
			throw new ServiceException("Stn with stockTransferId = " + id + " does not exist", "ERR-INV-029");
		}
		BusinessDayDto businessDayDto = getBusinessDay(authUser.getLocationCode());
		CountryDetailsDto countryDetailsDto = getCountryDetails(authUser.getLocationCode());
		stockTransferValidation(receiveStockConfirmDto, authUser, stockTransfer);
		stockTransfer.get().setCourierReceivedDate(receiveStockConfirmDto.getCourierReceivedDate());
		stockTransfer.get().setReasonForDelay(receiveStockConfirmDto.getReasonForDelay());
		stockTransfer.get().setReceivedRemarks(receiveStockConfirmDto.getRemarks());
		stockTransfer.get()
				.setDestDocNo(inventoryDocMasterService.getDocNumber(countryDetailsDto.getFiscalYear().shortValue(),
						authUser.getLocationCode(), DocTypeEnum.STNRECPT.toString()));
		stockTransfer.get().setDestDocDate(businessDayDto.getBusinessDate());
		stockTransfer.get().setDestFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);

		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		if (statusMap.get(ISOFFLINE).booleanValue()) {
			stockTransfer.get().setStatus(StockTransferStatusEnum.PUBLISHED.name());
			SyncStagingDto stagingDto = stockReceiveFacadeImp.updateStockTransferAndStaging(id, stockTransfer.get(),
					invDetailsList, StockTransferStatusEnum.PUBLISHED.name());
			inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(), stagingDto);
		} else {
			stockTransfer.get().setStatus(StockTransferStatusEnum.RECEIVED.name());
			stockReceiveFacadeImp.updateStockTransferAndStaging(id, stockTransfer.get(), invDetailsList,
					StockTransferStatusEnum.RECEIVED.name());
			inventoryDetailsService.addInventoryDetails(invDetailsList, stockTransfer.get().getDestDocNo(),
					DocTypeEnum.STNRECPT);
		}
		// convert stockTransfer object to ReceiveStockDto
		return createReceiveStockDto(stockTransfer.get());
	}

	/**
	 * @param id
	 * @param stockTransfer
	 * @param invDetailsList
	 */
	@Transactional
	public SyncStagingDto updateStockTransferAndStaging(Integer id, StockTransferDao stockTransfer,
			List<InventoryDetailsDaoExt> invDetailsList, String status) {

		stockTransferService.saveOrUpdateStockTransfer(stockTransfer);
		stockTransferService.updateAllStockIssueDetailsByItemIds(stockTransfer, status);
		// call stockTransferService to get list of item level data against the header
		// id
		List<StockTransferDetailsDao> stockTransferDetailsList = stockTransferService
				.findAllStockTransferDetails(stockTransfer);
		List<SyncData> syncDatas = new ArrayList<>();
		List<DiscountItemMapiingDto> itemGroupMappingDtoList=new ArrayList<DiscountItemMapiingDto>();
		for (StockTransferDetailsDao stockTransferDetailsDao : stockTransferDetailsList) {
			
			List<DiscountItemMapiingDto> itemGroupMappingDto=engineService.getDiscountItemMappingDetails(stockTransferDetailsDao.getItemCode(), stockTransferDetailsDao.getLotNumber(),stockTransfer.getSrcLocationCode());
			 //DiscountItemMappingDao discountItemMappingDao=(DiscountItemMappingDao)MapperUtil.getObjectMapping(object, new DiscountItemMappingDao());
			if(!itemGroupMappingDto.isEmpty()) {
			itemGroupMappingDto.forEach(item->{
				if(item.getIsTransferredLocation()!=null)
				{
					if(item.getIsTransferredLocation()==true)
					{
						item.setId(UUID.randomUUID().toString());
						item.setLocationCode(stockTransfer.getDestLocationCode());
						itemGroupMappingDtoList.add(item);
					}
					
				}
			});
			}
			
		}
		if(!itemGroupMappingDtoList.isEmpty())
		{
			syncDatas.add(DataSyncUtil
					.createSyncData(itemGroupMappingDtoList, 2));
//			engineClient.discountIBTTansfer(itemGroupMappingDtoList );
		}
		// add all received items in Inventory
		addItemInInventory(invDetailsList, stockTransferDetailsList, stockTransfer);
		// update header table
		stockTransferService.updateReceivedTotalWeightAndQuantity(id, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		if (status.equals(StockTransferStatusEnum.PUBLISHED.name())) {
			InventoryDetailsSyncDtoExt inventorySyncDto = new InventoryDetailsSyncDtoExt();
			
			syncDatas.add(DataSyncUtil
					.createSyncData(inventorySyncDto.getSyncDtoExtList(invDetailsList, stockTransfer.getId()), 0));
			List<String> destinations = new ArrayList<>();
			destinations.add(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDatas,
					InventoryOperationCodes.INV_STN_POSS_ADD, destinations, MessageType.FIFO.toString(),
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
		
		return syncStagingDto;
	}

	@Transactional
	public SyncStagingDto updateStockTransferAndStagingStnCancel(Integer id, StockTransferDao stockTransfer,
			List<InventoryDetailsDaoExt> invDetailsList, String status) {

		stockTransferService.saveOrUpdateStockTransfer(stockTransfer);
		stockTransferService.updateAllStockIssueDetailsByItemIds(stockTransfer, status);
		// call stockTransferService to get list of item level data against the header
		// id
		List<StockTransferDetailsDao> stockTransferDetailsList = stockTransferService
				.findAllStockTransferDetails(stockTransfer);
		// add all received items in Inventory
		addItemInInventoryAfterStnCancel(invDetailsList, stockTransferDetailsList, stockTransfer);
		// update header table
		stockTransferService.updateReceivedTotalWeightAndQuantity(id, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		SyncStagingDto syncStagingDto = new SyncStagingDto();
		if (status.equals(StockTransferStatusEnum.PUBLISHED.name())) {
			InventoryDetailsSyncDtoExt inventorySyncDto = new InventoryDetailsSyncDtoExt();
			List<SyncData> syncDatas = new ArrayList<>();
			syncDatas.add(DataSyncUtil
					.createSyncData(inventorySyncDto.getSyncDtoExtList(invDetailsList, stockTransfer.getId()), 0));
			List<String> destinations = new ArrayList<>();
			destinations.add(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			MessageRequest messageRequest = DataSyncUtil.createMessageRequest(syncDatas,
					InventoryOperationCodes.INV_STN_POSS_CANCEL, destinations, MessageType.FIFO.toString(),
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
		return syncStagingDto;
	}

	private void stockTransferValidation(ReceiveStockConfirmDto receiveStockConfirmDto, AuthUser authUser,
			Optional<StockTransferDao> stockTransfer) {
		// throw exception if stock transfer status is RECEIVED
		LocationCacheDto locationDetails = engineService
				.getLocationDetail(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		if (stockTransfer.isPresent()) {
			StockTransferDao stockTransferDao = stockTransfer.get();
			if (stockTransferDao.getStatus().equalsIgnoreCase(StockTransferStatusEnum.RECEIVED.name())) {
				throw new ServiceException("This STN Have been already Confirmed", ERR_INV_013);
			}
			// throw exception if open item count is more than 0
			Integer openItemCount = stockTransferService.getOpenItemCount(stockTransferDao);
			if (openItemCount > 0) {
				throw new ServiceException("Please verify all the items", "ERR-INV-005");
			}
			// throw exception if unassignedBin count is more than 0
			Integer unassignedBin = stockTransferService.getUnassignedBinCount(stockTransferDao);
			if (unassignedBin > 0) {
				throw new ServiceException("Please assign bin to all the items", "ERR-INV-009");
			}
			if (!stockTransferDao.getDestLocationCode().equals(authUser.getLocationCode())) {
				throw new ServiceException("Can not list items for request id", "ERR-INV-029");
			}
			// if current date - created date is more than config set in eposs and reason for delay is
			// empty then throw exception
			//long daysDiff = CalendarUtils.getDayDiff(stockTransferDao.getSrcDocDate(), new Date());
			BusinessDayDto businessDay = getBusinessDay(authUser.getLocationCode());

			long daysDiff = CalendarUtils.getDayDiff(stockTransferDao.getSrcDocDate(), 
					businessDay.getBusinessDate());
			long maxNoOfDays=locationDetails.getInventoryDetails().getMaximumNoOfDaysForPhysicalReceiptDate(); // converting days to hours
			if (daysDiff > maxNoOfDays && StringUtils.isBlank(receiveStockConfirmDto.getReasonForDelay())) {
				throw new ServiceException("Stock inward delayed "
						+ CalendarUtils.getHourDifference(stockTransfer.get().getSrcDocDate(), businessDay.getBusinessDate())
						+ " hrs. So, Reason for delay is mandatory ", "ERR-INV-025");
			}
		}
	}

	private void stockTransferCancelValidation(Optional<StockTransferDao> stockTransfer) {
		// throw exception if stock transfer status is RECEIVED
		if (stockTransfer.isPresent()) {
			StockTransferDao stockTransferDao = stockTransfer.get();
			if (stockTransferDao.getStatus().equalsIgnoreCase(StockTransferStatusEnum.CANCELLED.name())) {
				throw new ServiceException("This STN Have been already Cancelled", ERR_INV_013);
			}
			// throw exception if open item count is more than 0
//			Integer openItemCount = stockTransferService.getOpenItemCount(stockTransferDao);
//			if (openItemCount > 0) {
//				throw new ServiceException("Please verify all the items", "ERR-INV-005");
//			}
			// throw exception if unassignedBin count is more than 0
//			Integer unassignedBin = stockTransferService.getUnassignedBinCount(stockTransferDao);
//			if (unassignedBin > 0) {
//				throw new ServiceException("Please assign bin to all the items", "ERR-INV-009");
//			}
//			if (!stockTransferDao.getDestLocationCode().equals(authUser.getLocationCode())) {
//				throw new ServiceException("Can not list items for request id", "ERR-INV-029");
//			}
			// if current date - created date is more than 48 hours and reason for delay is
			// empty then throw exception
//			long hours = CalendarUtils.getHourDifference(stockTransferDao.getSrcDocDate(), new Date());
//			if (hours > reasonForDelayHours && StringUtils.isBlank(receiveStockConfirmDto.getReasonForDelay())) {
//				throw new ServiceException("Stock inward delayed "
//						+ CalendarUtils.getHourDifference(stockTransfer.get().getSrcDocDate(), new Date())
//						+ " hrs. So, Reason for delay is mandatory ", "ERR-INV-025");
//			}
		}
	}

	private ReceiveStockDto createReceiveStockDto(StockTransferDao stockTransfer) {
		ReceiveStockDto receiveStockDto = new ReceiveStockDto();
		MapperUtil.beanMapping(stockTransfer, receiveStockDto);
		receiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stockTransfer.getCarrierDetails()));
		receiveStockDto.setTotalAvailableQuantity(stockTransfer.getTotalIssuedQuantity());
		receiveStockDto.setTotalAvailableValue(stockTransfer.getTotalIssuedValue());
		receiveStockDto.setTotalAvailableWeight(stockTransfer.getTotalIssuedWeight());
		receiveStockDto.setTotalMeasuredQuantity(stockTransfer.getTotalReceivedQuantity());
		receiveStockDto.setTotalMeasuredValue(stockTransfer.getTotalReceivedValue());
		receiveStockDto.setTotalMeasuredWeight(stockTransfer.getTotalReceivedWeight());
		return receiveStockDto;
	}

	private void addItemInInventory(List<InventoryDetailsDaoExt> invDetailsList,
			List<StockTransferDetailsDao> stockTransferDetails, StockTransferDao stockTransfer) {

		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(CommonUtil.getLocationCode());
		BusinessDayDto businessDayDto = getBusinessDay(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		String correlationId = UUID.randomUUID().toString();
		for (StockTransferDetailsDao stTransferDetails : stockTransferDetails) {
			InventoryDetailsDaoExt invDetails = new InventoryDetailsDaoExt();
			BeanUtils.copyProperties(stTransferDetails, invDetails, "id");
			invDetails.setItemDetails(stTransferDetails.getItemDetails());
//			ItemDto item = null;
//			if (!StringUtils.isEmpty(invDetails.getItemCode())) {
//				item = productService.getItem(invDetails.getItemCode());
//				LOGGER.info("Item karat " + item.getKarat());
//			}
			ItemLiteDto item = null;
			if (!StringUtils.isEmpty(invDetails.getItemCode())) {
				item = engineService.getItemDetails(invDetails.getItemCode());
				LOGGER.info("Item karat " + item.getKarat());
			}
			invDetails.setKarat(item.getKarat());
			invDetails.setId(UUID.randomUUID().toString());
			invDetails.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			invDetails.setSerialNumber(stTransferDetails.getStdWeight().toString());
			invDetails.setCreatedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			invDetails.setCreatedDate(new Date());
			invDetails.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			invDetails.setLastModifiedDate(new Date());
			invDetails.setTotalQuantity(stTransferDetails.getReceivedQuantity());
			invDetails.setTotalValue(stTransferDetails.getReceivedValue());
			invDetails.setTotalWeight(stTransferDetails.getReceivedWeight());
			invDetails.setTotalWeightDetails(stTransferDetails.getReceivedWeightDetails());
			invDetails.setOrgCode(stockTransfer.getOrgCode());
			invDetails.setBinModifiedDate(CalendarUtils.getStartOfDay(businessDayDto.getBusinessDate()));
			invDetails.setStockInwardDate(CalendarUtils.getStartOfDay(businessDayDto.getBusinessDate()));
			invDetails.setCurrencyCode(countryDetailsDto.getCurrencyCode());
			invDetails.setWeightUnit(countryDetailsDto.getWeightUnit());
			invDetails.setDocNumber(stockTransfer.getDestDocNo());
			invDetails.setDocType(DocTypeEnum.STNRECPT.name());
			invDetails.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
			invDetails.setActionType(InventoryDetailsActionEnum.ADD.name());
			invDetails.setCorrelationId(correlationId);
			invDetails.setIssuedQuantity((short) 0);
			// retrieve isHallmarked from itemDetails JSON and set to isHallmarked.
			invDetails.setIsHallmarked(getHallmarkedFromItemDetails(stTransferDetails));
			// set item details add doc number and doc date
			InventoryUtil.createAndUpdateItemDetails(stTransferDetails.getItemDetails(), invDetails,
					stockTransfer.getDestDocNo(), stockTransfer.getDestDocDate());
			invDetailsList.add(invDetails);

		}

	}

	private void addItemInInventoryAfterStnCancel(List<InventoryDetailsDaoExt> invDetailsList,
			List<StockTransferDetailsDao> stockTransferDetails, StockTransferDao stockTransfer) {

		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(CommonUtil.getLocationCode());
		String correlationId = UUID.randomUUID().toString();
		for (StockTransferDetailsDao stTransferDetails : stockTransferDetails) {
			InventoryDetailsDaoExt invDetails = new InventoryDetailsDaoExt();
			BeanUtils.copyProperties(stTransferDetails, invDetails, "id");
			// invDetails.setItemDetails(stTransferDetails.getItemDetails());
			invDetails.setId(UUID.randomUUID().toString());
			invDetails.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			invDetails.setSerialNumber(stTransferDetails.getStdWeight().toString());
			invDetails.setCreatedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			invDetails.setCreatedDate(new Date());
			invDetails.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			invDetails.setLastModifiedDate(new Date());
			invDetails.setTotalQuantity(stTransferDetails.getReceivedQuantity());
			invDetails.setTotalValue(stTransferDetails.getReceivedValue());
			invDetails.setTotalWeight(stTransferDetails.getReceivedWeight());
			invDetails.setTotalWeightDetails(stTransferDetails.getReceivedWeightDetails());
			invDetails.setOrgCode(stockTransfer.getOrgCode());
			invDetails.setBinModifiedDate(new Date());
			invDetails.setStockInwardDate(new Date());
			invDetails.setCurrencyCode(countryDetailsDto.getCurrencyCode());
			invDetails.setWeightUnit(countryDetailsDto.getWeightUnit());
			// invDetails.setDocNumber(stockTransfer.getDestDocNo());
			// invDetails.setDocType(DocTypeEnum.STNRECPT.name());
			invDetails.setFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
			invDetails.setActionType(InventoryDetailsActionEnum.ADD.name());
			invDetails.setCorrelationId(correlationId);
			invDetails.setIssuedQuantity((short) 0);
			// retrieve isHallmarked from itemDetails JSON and set to isHallmarked.
			invDetails.setIsHallmarked(getHallmarkedFromItemDetails(stTransferDetails));
			// set item details add doc number and doc date
			InventoryUtil.createAndUpdateItemDetails(stTransferDetails.getItemDetails(), invDetails,
					stockTransfer.getDestDocNo(), stockTransfer.getDestDocDate());
			invDetailsList.add(invDetails);

		}

	}

	/**
	 * Method to retrieve hallmarked value from ItemDetails JSON
	 * 
	 * @param stTransferDetails
	 * @return
	 */
	private Boolean getHallmarkedFromItemDetails(StockTransferDetailsDao stTransferDetails) {
		AtomicReference<Boolean> isHallmarkingReference = new AtomicReference<>();
		isHallmarkingReference.set(Boolean.FALSE);
		try {
			JsonNode itemDetailsEligibleNode = MapperUtil.getObjectMapperInstance()
					.readTree(stTransferDetails.getItemDetails());
			JsonNode itemDetailsDataEligible = itemDetailsEligibleNode.get("data");
			if (itemDetailsDataEligible.has("isHallmarkEligible")) {
				Boolean check = itemDetailsDataEligible.get("isHallmarkEligible").asBoolean();
				if (!check) {
					LOGGER.info("Attr isHallmarkEligible is false");
					isHallmarkingReference.set(Boolean.TRUE);
					return isHallmarkingReference.get();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		Optional.ofNullable(stTransferDetails.getItemDetails()).ifPresent(itemDetails -> {
			JsonNode itemDetailsNode;
			try {
				itemDetailsNode = MapperUtil.getObjectMapperInstance().readTree(stTransferDetails.getItemDetails());
				Optional.ofNullable(itemDetailsNode).ifPresent(itemDetailsJson -> {
					JsonNode itemDetailsData = itemDetailsJson.get("data");
					Optional.ofNullable(itemDetailsData).ifPresent(itemDetailsDataJson -> {
						JsonNode isHallmarkingNode = itemDetailsDataJson.get("isHallMarking");
						Optional.ofNullable(isHallmarkingNode)
								.ifPresent(isHallmarking -> isHallmarkingReference.set(isHallmarking.asBoolean()));
					});
				});
			} catch (IOException e) {
				LOGGER.error("Unable to parse json data", e.getMessage());
			}
		});

		return isHallmarkingReference.get();
	}

	@Override
	public PagedRestResponse<List<ReceiveStockItemDto>> listStockReceiveItems(Integer id, String stockReceiveType,
			String stockReceiveStatus, String itemCode, String binGroupCode, String lotNumber, List<String> binCode,
			List<String> productGroup, List<String> productCategory, Pageable pageable) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		// get stock transfer by id,location code,receive type
		StockTransferDao stockTransfer = stockTransferService.findStockTransferByIdAndDestLocationCodeAndTransferType(
				id, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), stockReceiveType);

		// call stock transfer service to get the pageable data of stock transfer
		// details
		Page<StockTransferDetailsDao> stTransferDetailsPage = stockTransferService.listStockReceiveItems(stockTransfer,
				itemCode, productGroup, productCategory, lotNumber, binCode, binGroupCode, stockReceiveStatus,
				pageable);

		// reiterate stTransferDetailsPage object
		List<ReceiveStockItemDto> receiveStockItemDtos = new ArrayList<>();
		for (StockTransferDetailsDao stTransferDetails : stTransferDetailsPage) {
			ReceiveStockItemDto productDtls = (ReceiveStockItemDto) MapperUtil.getDtoMapping(stTransferDetails,
					ReceiveStockItemDto.class);
			productDtls.setAvailableQuantity(stTransferDetails.getIssuedQuantity());
			productDtls.setAvailableWeight(stTransferDetails.getIssuedWeight());
			productDtls.setAvailableValue(stTransferDetails.getIssuedValue());
			productDtls.setMeasuredQuantity(stTransferDetails.getReceivedQuantity());
			productDtls.setMeasuredWeight(stTransferDetails.getReceivedWeight());
			productDtls.setMeasuredValue(stTransferDetails.getReceivedValue());

			productDtls.setItemDetails(MapperUtil.getJsonFromString(stTransferDetails.getItemDetails()));
			productDtls.setImageURL(new URLUtil().getImageUrlByItemCode(stTransferDetails.getItemCode()));

			productDtls.setProductCategory(stTransferDetails.getProductCategory());
			productDtls.setProductCategoryDesc(productCategoryList.get(stTransferDetails.getProductCategory()));
			productDtls.setProductGroup(stTransferDetails.getProductGroup());
			productDtls.setProductGroupDesc(productGroupList.get(stTransferDetails.getProductGroup()));
			productDtls.setTaxDetails(MapperUtil.getJsonFromString(stTransferDetails.getTaxDetails()));
			receiveStockItemDtos.add(productDtls);
		}
		LOGGER.debug("listProductDtls Count - {}", receiveStockItemDtos.size());
		return new PagedRestResponse<>(receiveStockItemDtos, stTransferDetailsPage);
	}

	@Override
	public PagedRestResponse<List<ReceiveStockItemDto>> listCancelStockReceiveItems(Integer id, String stockReceiveType,
			String stockReceiveStatus, String itemCode, String binGroupCode, String lotNumber, List<String> binCode,
			List<String> productGroup, List<String> productCategory, Pageable pageable) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		// get stock transfer by id,location code,receive type
		StockTransferDao stockTransfer = stockTransferService.findStockTransferByIdAndSrcLocationCodeAndTransferType(id,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), stockReceiveType);

		// call stock transfer service to get the pageable data of stock transfer
		// details
		Page<StockTransferDetailsDao> stTransferDetailsPage = stockTransferService.listStockReceiveItems(stockTransfer,
				itemCode, productGroup, productCategory, lotNumber, binCode, binGroupCode, stockReceiveStatus,
				pageable);

		// reiterate stTransferDetailsPage object
		List<ReceiveStockItemDto> receiveStockItemDtos = new ArrayList<>();
		for (StockTransferDetailsDao stTransferDetails : stTransferDetailsPage) {
			ReceiveStockItemDto productDtls = (ReceiveStockItemDto) MapperUtil.getDtoMapping(stTransferDetails,
					ReceiveStockItemDto.class);
			productDtls.setAvailableQuantity(stTransferDetails.getIssuedQuantity());
			productDtls.setAvailableWeight(stTransferDetails.getIssuedWeight());
			productDtls.setAvailableValue(stTransferDetails.getIssuedValue());
			productDtls.setMeasuredQuantity(stTransferDetails.getReceivedQuantity());
			productDtls.setMeasuredWeight(stTransferDetails.getReceivedWeight());
			productDtls.setMeasuredValue(stTransferDetails.getReceivedValue());

			productDtls.setItemDetails(MapperUtil.getJsonFromString(stTransferDetails.getItemDetails()));
			productDtls.setImageURL(new URLUtil().getImageUrlByItemCode(stTransferDetails.getItemCode()));

			productDtls.setProductCategory(stTransferDetails.getProductCategory());
			productDtls.setProductCategoryDesc(productCategoryList.get(stTransferDetails.getProductCategory()));
			productDtls.setProductGroup(stTransferDetails.getProductGroup());
			productDtls.setProductGroupDesc(productGroupList.get(stTransferDetails.getProductGroup()));
			setissueStockTaxDetails(productDtls,stTransferDetails);
			receiveStockItemDtos.add(productDtls);
		}
		LOGGER.debug("listProductDtls Count - {}", receiveStockItemDtos.size());
		return new PagedRestResponse<>(receiveStockItemDtos, stTransferDetailsPage);
	}

	private void setissueStockTaxDetails(ReceiveStockItemDto stockReceiveDetailDto,
			StockTransferDetailsDao stTransferDetails) {

		TaxCalculationResponseDto taxDetailsResponse = engineClient.getTaxDetails(
				stTransferDetails.getStockTransfer().getDestLocationCode(), 0,null,
				TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE.name(), stTransferDetails.getItemCode(), false,null);

		Map<String, BigDecimal> taxDetails = new HashMap<>();
		Map<String, TaxDetailDto> data = new HashMap<>();
		TaxDetailDto sgstDetails = null;
		if (taxDetailsResponse != null) {
			data = taxDetailsResponse.getData();
			if (!CollectionUtils.isEmpty(data)) {
				if (data.get("SGST") != null) {
					sgstDetails = data.get("SGST");
					if (sgstDetails.getTaxPercentage() != null) {
						taxDetails.put("SGSTVal", stTransferDetails.getStdValue()
								.multiply(sgstDetails.getTaxPercentage().divide(ONE_HUNDRED)));
						taxDetails.put("SGSTPct", sgstDetails.getTaxPercentage());
					}
				} else {
					taxDetails.put("SGSTVal", BigDecimal.ZERO);
					taxDetails.put("SGSTPct", BigDecimal.ZERO);

				}
				if (data.get("UTGST") != null) {
					TaxDetailDto utgstDetails = data.get("UTGST");
					if (utgstDetails != null) {
						if (utgstDetails.getTaxPercentage() != null) {
							taxDetails.put("UTGSTVal", stTransferDetails.getStdValue()
									.multiply(utgstDetails.getTaxPercentage().divide(ONE_HUNDRED)));
							taxDetails.put("UTSTPct", utgstDetails.getTaxPercentage());
						}
					}
				} else {
					taxDetails.put("UTGSTVal", BigDecimal.ZERO);
					taxDetails.put("UTSTPct", BigDecimal.ZERO);

				}
				if (data.get("CGST") != null) {
					TaxDetailDto cgstDetails = data.get("CGST");
					if (cgstDetails.getTaxPercentage() != null) {
						taxDetails.put("CGSTVal", stTransferDetails.getStdValue()
								.multiply(cgstDetails.getTaxPercentage().divide(ONE_HUNDRED)));
						taxDetails.put("CGSTPct", cgstDetails.getTaxPercentage());
					}
				} else {
					taxDetails.put("CGSTVal", BigDecimal.ZERO);
					taxDetails.put("CGSTPct", BigDecimal.ZERO);

				}
				if (data.get("IGST") != null) {
					TaxDetailDto igstDetails = data.get("IGST");
					if (igstDetails != null) {
						if (igstDetails.getTaxPercentage() != null) {
							taxDetails.put("IGSTVal", stTransferDetails.getStdValue()
									.multiply(igstDetails.getTaxPercentage().divide(ONE_HUNDRED)));
							taxDetails.put("IGSTPct", igstDetails.getTaxPercentage());
						}
					}
				} else {
					taxDetails.put("IGSTVal", BigDecimal.ZERO);
					taxDetails.put("IGSTPct", BigDecimal.ZERO);

				}
			}
		}
		Map<String, Object> issueStockTaxDetails = new LinkedHashMap<>();
		issueStockTaxDetails.put("type", "TAX_DETAILS");
		issueStockTaxDetails.put("data", taxDetails);
		stockReceiveDetailDto.setTaxDetails(MapperUtil.getJsonFromString(MapperUtil
				.getStringFromJson(issueStockTaxDetails).replace("\\", "").replace("\"[", "[").replace("]\"", "]")));
	}

	@Override
	public ReceivedWeightDto getTotalReceivedWeight(Integer id, String stockReceiveType, String stockReceiveStatus,
			String itemCode, String binGroupCode, String lotNumber, List<String> binCode, List<String> productGroup,
			List<String> productCategory) {
		// get stock transfer by id,location code,receive type
		StockTransferDao stockTransfer = stockTransferService.findStockTransferByIdAndDestLocationCodeAndTransferType(
				id, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), stockReceiveType);
		BigDecimal totalWeight = new BigDecimal(0.00);
		ReceivedWeightDto receivedWeight = new ReceivedWeightDto();
		receivedWeight.setTotalWeight(totalWeight);
		if (stockTransferService.listStockReceiveItemsWeightSum(stockTransfer, itemCode, productGroup, productCategory,
				lotNumber, binCode, binGroupCode, stockReceiveStatus) != null) {
			receivedWeight.setTotalWeight(stockTransferService.listStockReceiveItemsWeightSum(stockTransfer, itemCode,
					productGroup, productCategory, lotNumber, binCode, binGroupCode, stockReceiveStatus));
		}
		return receivedWeight;
	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}

	@Override
	public PagedRestResponse<List<ReceiveStockDto>> getStnFromErp(String srcDocNo, String transferType) {

		// first searching in the db
		PagedRestResponse<List<ReceiveStockDto>> listStockReceive = listStockReceive(Integer.parseInt(srcDocNo),
				transferType, StockReceiveStatusEnum.ISSUED.toString(), Pageable.unpaged());
		if (listStockReceive.getResults().isEmpty()) {
			// if it is not present, getting stn data from ERP
			integrationService.getStnService(srcDocNo);
			return listStockReceive(Integer.parseInt(srcDocNo), StockReceiveTypeEnum.FAC_BTQ.toString(),
					StockReceiveStatusEnum.ISSUED.toString(), Pageable.unpaged());
		} else {
			return listStockReceive;
		}
	}

}
