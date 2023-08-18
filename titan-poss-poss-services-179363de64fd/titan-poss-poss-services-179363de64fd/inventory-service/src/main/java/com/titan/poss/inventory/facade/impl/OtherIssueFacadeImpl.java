/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.facade.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.DomainConstants;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.ItemsDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.StorePrintDetailsDto;
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
import com.titan.poss.core.utils.NumberToWordsFactory;
import com.titan.poss.core.utils.PrintUtil;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.inventory.acl.InventoryAccessControls;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.InventoryChild;
import com.titan.poss.inventory.dto.InventoryDetailsSyncDtoExt;
import com.titan.poss.inventory.dto.InventoryPrint;
import com.titan.poss.inventory.dto.OtherIssuePrintHeader;
import com.titan.poss.inventory.dto.constants.OtherIssueRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.OtherReceiveStatusEnum;
import com.titan.poss.inventory.dto.constants.OtherRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.RequestTypesEnum;
import com.titan.poss.inventory.dto.constants.StockIssueTransferTypeStatusEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferStatusEnum;
import com.titan.poss.inventory.dto.request.IssueStockItemBulkDto;
import com.titan.poss.inventory.dto.request.StockIssueStockConfirmDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.IssueStockDto;
import com.titan.poss.inventory.dto.response.QuantityCheckDto;
import com.titan.poss.inventory.dto.response.ReceiveStockDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;
import com.titan.poss.inventory.facade.OtherIssueFacade;
import com.titan.poss.inventory.facade.StockIssueFacade;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.repository.StockRequestDetailsRepository;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.InventoryDocMasterService;
import com.titan.poss.inventory.service.InventorySyncDataService;
import com.titan.poss.inventory.service.LocationService;
import com.titan.poss.inventory.service.StockRequestService;
import com.titan.poss.inventory.service.StockTransactionService;
import com.titan.poss.inventory.utils.InventoryUtil;

import freemarker.template.Configuration;
import freemarker.template.Template;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Service
public class OtherIssueFacadeImpl implements OtherIssueFacade {

	private static final Logger LOGGER = LoggerFactory.getLogger(OtherIssueFacadeImpl.class);
	private static final String ERR_INV_017 = "ERR-INV-017";
	public static final BigDecimal ONE_HUNDRED = new BigDecimal(100);

	@Autowired
	private Configuration freemarkerConfig;

	@Autowired
	NumberToWordsFactory numberToWordsFactory;

	@Value("${docs.file.source.path}")
	String fileBasePath;

	@Autowired
	InventoryDetailsService inventoryDetailsService;

	@Autowired
	StockRequestService stockRequestService;

	@Autowired
	InventoryDetailsService inventoryTransactionService;

	@Autowired
	StockIssueFacade stockIssueFacade;
	@Autowired
	InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	StockTransactionService stockTransactionService;

	@Autowired
	LocationService locationService;

	@Autowired
	EngineService engineService;

	@Autowired
	EngineServiceClient engineClient;

	@Autowired
	InventoryCommonFacadeImpl inventoryService;

	@Autowired
	StockRequestDetailsRepository stockRequestDetailsRepository;

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	@Autowired
	private OtherIssueFacadeImpl otherIssueFacadeImp;

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";

	@Override
	public ListResponse<InventoryCountDto> getStockRequestCount() {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		String locationCode = authUser.getLocationCode();
		List<String> statusList = new ArrayList<>();
		List<String> requestTypeList = new ArrayList<>();
		if (locationCode != null) {
			statusList.add(StockRequestStatusEnum.APPROVED.toString());
		}
		statusList.add(StockRequestStatusEnum.APVL_PENDING.toString());
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.OTHER_ISSUES_EXHIBITION))) {
			requestTypeList.add(OtherIssueRequestTypeEnum.EXH.toString());
		}
		if (authUser.getAuthorities().contains(new SimpleGrantedAuthority(InventoryAccessControls.OTHER_ISSUES_PSV))) {
			requestTypeList.add(OtherIssueRequestTypeEnum.PSV.toString());
		}
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.OTHER_ISSUES_ADJUSTMENTS))) {
			requestTypeList.add(OtherIssueRequestTypeEnum.ADJ.toString());
		}
		if (authUser.getAuthorities().contains(new SimpleGrantedAuthority(InventoryAccessControls.OTHER_ISSUES_FOC))) {
			requestTypeList.add(OtherIssueRequestTypeEnum.FOC.toString());
		}
		if (authUser.getAuthorities().contains(new SimpleGrantedAuthority(InventoryAccessControls.OTHER_ISSUES_LOAN))) {
			requestTypeList.add(OtherIssueRequestTypeEnum.LOAN.toString());
		}
		if (authUser.getAuthorities().contains(new SimpleGrantedAuthority(InventoryAccessControls.OTHER_ISSUES_LOSS))) {
			requestTypeList.add(OtherIssueRequestTypeEnum.LOSS.toString());
		}
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.CONVERSION_REQUESTS_SENT))
				|| authUser.getAuthorities()
						.contains(new SimpleGrantedAuthority(InventoryAccessControls.CONVERSION_SEARCH_BY_VARIANT))) {
			requestTypeList.add(OtherIssueRequestTypeEnum.CONV.toString());
		}
		return new ListResponse<>(stockRequestService.getStockRequestCount(locationCode, requestTypeList, statusList));
	}

	@Override
	public PagedRestResponse<List<IssueStockDto>> listStockRequests(Integer reqDocNo, String requestType,
			Pageable pageable) {
		String locationcode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		Page<StockRequestDao> stockRequestPageLists = null;
		List<String> statusList = new ArrayList<>();
		statusList.add(StockRequestStatusEnum.APVL_PENDING.toString());
		if (locationcode != null) {
			statusList.add(StockRequestStatusEnum.APPROVED.toString());
		}
		stockRequestPageLists = stockRequestService.findAllBySrcLocationCodeAndRequestTypeAndReqDocNoAndStatusIn(
				locationcode, requestType, reqDocNo, statusList, pageable);
		LOGGER.debug("Stock Request List Size - {}", stockRequestPageLists.getSize());
		List<IssueStockDto> stockReqDtls = new ArrayList<>();
		for (StockRequestDao stockRequestList : stockRequestPageLists) {
			IssueStockDto stockReqDtlls = (IssueStockDto) MapperUtil.getDtoMapping(stockRequestList,
					IssueStockDto.class);
			stockReqDtlls.setCarrierDetails(MapperUtil.getJsonFromString(stockRequestList.getCarrierDetails()));
			stockReqDtlls.setOtherDetails(MapperUtil.getJsonFromString(stockRequestList.getOtherDetails()));
			if (stockRequestList.getStatus().equals(OtherRequestStatusEnum.APVL_PENDING.toString())) {
				stockReqDtlls.setTotalAvailableQuantity(stockRequestList.getTotalRequestedQuantity());
			} else {
				stockReqDtlls.setTotalAvailableQuantity(stockRequestList.getTotalApprovedQuantity());
			}
			// totalApprovedQuantity will be populated while confirming request
			// and will be updated in ApprovalController
			stockReqDtlls.setTotalAvailableWeight(stockRequestList.getTotalRequestedWeight());
			stockReqDtlls.setTotalAvailableValue(stockRequestList.getTotalRequestedValue());

			stockReqDtlls.setTotalMeasuredQuantity(stockRequestList.getTotalSelectedQuantity());
			stockReqDtlls.setTotalMeasuredWeight(stockRequestList.getTotalSelectedWeight());
			if (stockRequestList.getTotalIssuedValue() == null) {
				stockReqDtlls.setTotalMeasuredValue(BigDecimal.ZERO);
			} else {
				stockReqDtlls.setTotalMeasuredValue(stockRequestList.getTotalIssuedValue());
			}
			stockReqDtls.add(stockReqDtlls);

		}
		LOGGER.debug("Get Some stock request Details - {}", stockReqDtls.size());
		return new PagedRestResponse<>(stockReqDtls, stockRequestPageLists);

	}

	@Override
	public IssueStockDto getStockRequest(Integer id, String requestType) {
		StockRequestDao stockRequest = stockRequestService.getStockRequestByIdAndType(id, requestType);
		IssueStockDto stockReqDto = (IssueStockDto) MapperUtil.getDtoMapping(stockRequest, IssueStockDto.class);
		stockReqDto.setCarrierDetails(MapperUtil.getJsonFromString(stockRequest.getCarrierDetails()));
		stockReqDto.setOtherDetails(MapperUtil.getJsonFromString(stockRequest.getOtherDetails()));
		if (stockRequest.getStatus().equals(OtherRequestStatusEnum.APVL_PENDING.toString())) {
			stockReqDto.setTotalAvailableQuantity(stockRequest.getTotalRequestedQuantity());
		} else {
			stockReqDto.setTotalAvailableQuantity(stockRequest.getTotalApprovedQuantity());
		}
		// totalApprovedQuantity will be populated while confirming request
		// and will be updated in ApprovalController
		stockReqDto.setTotalAvailableWeight(stockRequest.getTotalRequestedWeight());
		// will be updated in ApprovalController
		stockReqDto.setTotalAvailableValue(stockRequest.getTotalRequestedValue());
		// will be updated in ApprovalController
		stockReqDto.setTotalMeasuredQuantity(stockRequest.getTotalSelectedQuantity());
		stockReqDto.setTotalMeasuredWeight(stockRequest.getTotalSelectedWeight());
		if (stockRequest.getTotalIssuedValue() == null) {
			stockReqDto.setTotalMeasuredValue(BigDecimal.ZERO);
		} else {
			stockReqDto.setTotalMeasuredValue(stockRequest.getTotalIssuedValue());
		}

		return stockReqDto;
	}

	@Override
	public PagedRestResponse<List<RequestStockItemResponseDto>> listStockRequestItems(Integer id, String requestType,
			String itemCode, List<String> productGroup, List<String> productCategory, String lotNumber,
			List<String> binCode, String binGroupCode, String status, Pageable pageable) {

		List<RequestStockItemResponseDto> stockRequestDetailsDtos = new ArrayList<>();

		// get stock request by id,request type & location code
		StockRequestDao stRequest = stockRequestService.findByIdAndRequestTypeAndSrcLocationCode(id, requestType,
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());

		// get pageable object of stock request details and params are stock
		// request,request type,item code,product group,product category,lot
		// number,bincode & bin group code,status
		Page<StockRequestDetailsDao> stRequestDetailsPage = stockRequestService.listStockRequestItems(stRequest,
				requestType, itemCode, productGroup, productCategory, lotNumber, binCode, binGroupCode, status,
				pageable);

		// get list of inventory ids from stock request details
		List<String> inventortIds = stRequestDetailsPage.stream().map(StockRequestDetailsDao::getInventoryId)
				.collect(Collectors.toList());

		// get inventory details by inventory ids
		List<InventoryDetailsDaoExt> inventoryDetailsList = inventoryDetailsService
				.getInventoryDetailsByIdList(inventortIds);

		Map<String, InventoryDetailsDaoExt> inventoryDetailsMap = inventoryDetailsList.stream()
				.collect(Collectors.toMap(InventoryDetailsDaoExt::getId, invDetails -> invDetails));
		LOGGER.debug("listItem - {}", stRequestDetailsPage.getContent());

		generateRequestStockItem(stRequestDetailsPage.getContent(), inventoryDetailsMap, stockRequestDetailsDtos);
		return new PagedRestResponse<>(stockRequestDetailsDtos, stRequestDetailsPage);
	}

	private void generateRequestStockItem(List<StockRequestDetailsDao> stRequestDetailsList,
			Map<String, InventoryDetailsDaoExt> inventoryDetailsMap,
			List<RequestStockItemResponseDto> stockRequestDetailsDtos) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		for (StockRequestDetailsDao stRequestDetails : stRequestDetailsList) {
			RequestStockItemResponseDto stockRequestDetailDto = (RequestStockItemResponseDto) MapperUtil
					.getDtoMapping(stRequestDetails, RequestStockItemResponseDto.class);
			stockRequestDetailDto.setInventoryId(stRequestDetails.getInventoryId());
			if (inventoryDetailsMap.get(stRequestDetails.getInventoryId()) != null) {
				short minQuantity;
				if (stRequestDetails.getIssuedQuantity() == null) {
					short qty = 0;
					minQuantity = (short) Math.min(
							(short) (inventoryDetailsMap.get(stRequestDetails.getInventoryId()).getTotalQuantity()
									- inventoryDetailsMap.get(stRequestDetails.getInventoryId()).getIssuedQuantity()),
							(short) (stRequestDetails.getApprovedQuantity() - qty));
					stockRequestDetailDto.setAvailableQuantity(minQuantity);
				} else {
					minQuantity = (short) Math.min(
							(short) (inventoryDetailsMap.get(stRequestDetails.getInventoryId()).getTotalQuantity()
									- inventoryDetailsMap.get(stRequestDetails.getInventoryId()).getIssuedQuantity()),
							(short) (stRequestDetails.getApprovedQuantity() - stRequestDetails.getIssuedQuantity()));
					stockRequestDetailDto.setAvailableQuantity(minQuantity);
				}
				// will be updated in the Approval controller acc. to approved quantity
				stockRequestDetailDto.setAvailableWeight(stRequestDetails.getRequestedWeight());
				// will be updated in the Approval controller acc. to approved quantity
				stockRequestDetailDto.setAvailableValue(stRequestDetails.getRequestedValue());

				stockRequestDetailDto
						.setAvailableValue(new BigDecimal(minQuantity).multiply(stRequestDetails.getStdValue()));
				if (stRequestDetails.getSelectedQuantity() == null) {
					stockRequestDetailDto.setMeasuredValue(new BigDecimal(stRequestDetails.getApprovedQuantity())
							.multiply(stRequestDetails.getStdValue()));
				} else {
					stockRequestDetailDto.setMeasuredValue(new BigDecimal(stRequestDetails.getSelectedQuantity())
							.multiply(stRequestDetails.getStdValue()));
				}

				stockRequestDetailDto.setMeasuredWeight(stRequestDetails.getSelectedWeight());
				stockRequestDetailDto.setMeasuredQuantity(stRequestDetails.getSelectedQuantity());

			} else {
				stockRequestDetailDto.setAvailableQuantity((short) 0);
			}

			stockRequestDetailDto.setProductCategory(stRequestDetails.getProductCategory());
			stockRequestDetailDto
					.setProductCategoryDesc(productCategoryList.get(stRequestDetails.getProductCategory()));
			stockRequestDetailDto.setProductGroup(stRequestDetails.getProductGroup());
			stockRequestDetailDto.setProductGroupDesc(productGroupList.get(stRequestDetails.getProductGroup()));

			stockRequestDetailDto.setItemDetails(MapperUtil.getJsonFromString(stRequestDetails.getItemDetails()));

			// setissueStockTaxDetails(stockRequestDetailDto, stRequestDetails);
			if (stRequestDetails.getBinCode().equals(OtherIssueRequestTypeEnum.LOSS.toString())
					&& stRequestDetails.getBinGroupCode().equals(OtherIssueRequestTypeEnum.LOSS.toString())) {
				stockRequestDetailDto.setTaxDetails(MapperUtil.getJsonFromString(stRequestDetails.getTaxDetails()));
			}
			stockRequestDetailDto.setImageURL(new URLUtil().getImageUrlByItemCode(stRequestDetails.getItemCode()));
			stockRequestDetailsDtos.add(stockRequestDetailDto);

		}

	}

	@Override
	public RequestStockItemResponseDto getStockRequestItem(Integer id, String itemId, String requestType) {
		return stockRequestService.getStockRequestItemByIdAndItemIdAndRequestType(id, itemId, requestType);
	}

	@Override
	public ReceiveStockDto updateStockRequest(Integer id, String requestType,
			StockIssueStockConfirmDto stockRequestConfirmDto) {
		StockRequestDao stockRequest = stockRequestService.getStockRequestByIdAndType(id, requestType);
		if (stockRequest == null) {
			throw new ServiceException("No Item available with approved status", "ERR-INV-029");
		}
		if (!stockRequest.getStatus().equalsIgnoreCase(StockRequestStatusEnum.APPROVED.toString())) {
			throw new ServiceException("No Item available with approved status", "ERR-INV-013");
		}
		short totalIssuedQuantity = 0;
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal totalWeight = BigDecimal.ZERO;

		// query to check requested quantity> inventory quantity.
		List<QuantityCheckDto> itemIds = checkQuantityValidation(id);
		if ((!itemIds.isEmpty()) && (!RequestTypesEnum.withBinGoupRequests().contains(requestType))) {
			throw new ServiceException(
					"Following Id's have requested quantity more than available inventory's quantity" + itemIds,
					ERR_INV_017, itemIds);
		}
		CountryDetailsDto countryDetailsDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		Map<String, QuantityCheckDto> itemList = new HashMap<>();
		List<String> zeroQuantityItemList = new ArrayList<>();
		getOutOfStockItemIds(itemIds, itemList, zeroQuantityItemList);
		// check bin validation for other than ADJ,PSV,FOC
		validateBinForBinRequests(id, requestType);
		StockTransactionDao stockTransaction = createStockTransaction(requestType, stockRequestConfirmDto, stockRequest,
				countryDetailsDto, businessDayDto);
		List<StockRequestDetailsDao> stockRequestDetails = getStockRequestDetails(stockRequest);
		List<StockRequestDetailsDao> stockRqstDetailsDaos = new ArrayList<>();
		List<StockTransactionDetailsDao> stList = new ArrayList<>();
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);
		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		if (statusMap.get(ISOFFLINE).booleanValue()) {
			stockRequest.setStatus(StockRequestStatusEnum.PUBLISHED.name());
		} else {
			stockRequest.setStatus(StockRequestStatusEnum.ISSUED.name());
		}
		for (StockRequestDetailsDao stockRequestDtls : stockRequestDetails) {
			if (stockRequestDtls.getStatus().equals(StockRequestStatusEnum.SELECTED.toString())
					&& (!zeroQuantityItemList.contains(stockRequestDtls.getId()))) {
				// items with zero available quantity should not be issued.
				short selectedQuantity = 0;
				StockTransactionDetailsDao stDetail = (StockTransactionDetailsDao) MapperUtil
						.getDtoMapping(stockRequestDtls, StockTransactionDetailsDao.class);

				// Set bin code and bin group as EXHIBITION or LOAN for other issue type EXH and
				// LOAN
				if (stockRequest.getRequestType().equals(OtherIssueRequestTypeEnum.EXH.toString())) {
					stDetail.setBinCode("EXHIBITION");
					stDetail.setBinGroupCode("EXHIBITION");
				}
				if (stockRequest.getRequestType().equals(OtherIssueRequestTypeEnum.LOAN.toString())) {
					stDetail.setBinCode("LOAN");
					stDetail.setBinGroupCode("LOAN");
				}
				// END of the bin update

				if (stockRequestDtls.getSelectedQuantity() == null) {
					selectedQuantity = 0;
				} else {
					selectedQuantity = stockRequestDtls.getSelectedQuantity();
				}
				setValueToStockTransaction(stockTransaction, stList, stockRequestDtls, stDetail);
				if (itemList.get(stockRequestDtls.getId()) != null) {
					// issuing only available quantities if available quantity is less than selected
					setIssueAndReceiveDetailsToStockRequestDetails(itemList, stockRequestDtls, stDetail);
					totalIssuedQuantity = (short) (totalIssuedQuantity
							+ itemList.get(stockRequestDtls.getId()).getAvailableQuantity());
					totalWeight = totalWeight.add(stockRequestDtls.getStdWeight().multiply(
							BigDecimal.valueOf(itemList.get(stockRequestDtls.getId()).getAvailableQuantity())));
				} else {
					// normal quantities getting issued [available_quantity> selected]
					// issued values are setted
					setIssueAndReceiveDetailsToStockTransactionDetail(stockRequestDtls, selectedQuantity, stDetail);
					totalIssuedQuantity = (short) (totalIssuedQuantity + stockRequestDtls.getIssuedQuantity());
					totalWeight = totalWeight.add(stockRequestDtls.getSelectedWeight());
				}
				totalValue = totalValue.add(
						new BigDecimal(stockRequestDtls.getIssuedQuantity()).multiply(stockRequestDtls.getStdValue()));
				stockRequestDtls.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());

				stockRequestDtls.setIssuedDate(businessDayDto.getBusinessDate());
				stockRequestDtls.setSelectedQuantity((short) 0);
				stockRequestDtls.setSelectedWeight(BigDecimal.ZERO);
				stockRequestDtls.setStatus(stockRequest.getStatus());
				stockRqstDetailsDaos.add(stockRequestDtls);
			}
		}

		SyncStagingDto stagingDto = otherIssueFacadeImp.updateStockTransferAndStaging(stockRequest,
				stockRqstDetailsDaos, stList, stockTransaction, totalIssuedQuantity, totalWeight, totalValue);
		if (stagingDto != null)
			inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(), stagingDto);

		return createConfirmReceiveStockDto(stockTransaction);
	}

	/**
	 * @param id
	 * @param stockRequest
	 * @param stockRqstDetailsDaos
	 * @param stList
	 * @param stockTransaction
	 * @param totalIssuedQuantity
	 * @param totalWeight
	 * @param totalValue
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto updateStockTransferAndStaging(StockRequestDao stockRequest,
			List<StockRequestDetailsDao> stockRqstDetailsDaos, List<StockTransactionDetailsDao> stList,
			StockTransactionDao stockTransaction, short totalIssuedQuantity, BigDecimal totalWeight,
			BigDecimal totalValue) {
		List<InventoryDetailsDaoExt> inv = new ArrayList<>();
		stockRequestDetailsRepository.saveAll(stockRqstDetailsDaos);
		if (!stList.isEmpty()) {
			stockTransactionService.saveAll(stList);
		}
		// stockRequest Update
		updateStockRequest(stockRequest, totalIssuedQuantity, totalWeight);
		// inventory update update
		getRemoveInventoryDetails(stockTransaction, inv);

		if (!stockRequest.getStatus().equals(StockRequestStatusEnum.PUBLISHED.name()))
			inventoryTransactionService.removeFromInventoryDetails((inv), stockTransaction.getIssuedDocNo(),
					DocTypeEnum.OTHERISSUE);

		updateStockTransaction(stockTransaction, totalIssuedQuantity, totalValue, totalWeight);
		SyncStagingDto otherIssueStagingDto = new SyncStagingDto();
		if (stockRequest.getStatus().equals(StockRequestStatusEnum.PUBLISHED.name())) {
			InventoryDetailsSyncDtoExt invDetlsSyncDto = new InventoryDetailsSyncDtoExt();
			List<SyncData> syncDatas = new ArrayList<>();
			if (!inv.isEmpty()) {
				syncDatas.add(
						DataSyncUtil.createSyncData(invDetlsSyncDto.getSyncDtoExtList(inv, stockRequest.getId()), 0));
				List<String> destinations = new ArrayList<>();
				destinations.add(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
				MessageRequest otherIssueRqst = DataSyncUtil.createMessageRequest(syncDatas,
						InventoryOperationCodes.INV_OTHERISSUE_POSS_ADD, destinations, MessageType.FIFO.toString(),
						DestinationType.SELECTIVE.toString());
				otherIssueStagingDto.setMessageRequest(otherIssueRqst);
				String requestBody = MapperUtil.getJsonString(otherIssueRqst);
				// saving to staging table
				SyncStaging otherIssueStaging = new SyncStaging();
				otherIssueStaging.setMessage(requestBody);
				otherIssueStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
				otherIssueStaging = inventorySyncStagingRepository.save(otherIssueStaging);
				otherIssueStagingDto.setId(otherIssueStaging.getId());
			}

		}
		return otherIssueStagingDto;
	}

	private void setIssueAndReceiveDetailsToStockTransactionDetail(StockRequestDetailsDao stockRequestDtls,
			short selectedQuantity, StockTransactionDetailsDao stDetail) {
		stDetail.setIssuedValue(
				BigDecimal.valueOf(stockRequestDtls.getSelectedQuantity()).multiply(stockRequestDtls.getStdValue()));
		stDetail.setIssuedQuantity(stockRequestDtls.getSelectedQuantity());
		stDetail.setIssuedWeight(stockRequestDtls.getSelectedWeight());
		// received values are setted
		stDetail.setReceivedValue(
				BigDecimal.valueOf(stockRequestDtls.getSelectedQuantity()).multiply(stockRequestDtls.getStdValue()));
		stDetail.setReceivedQuantity(stockRequestDtls.getSelectedQuantity());
		stDetail.setReceivedWeight(stockRequestDtls.getSelectedWeight());
		stockRequestDtls.setIssuedQuantity((selectedQuantity));
	}

	private void setIssueAndReceiveDetailsToStockRequestDetails(Map<String, QuantityCheckDto> itemList,
			StockRequestDetailsDao stockRequestDtls, StockTransactionDetailsDao stDetail) {
		// issued values are setted
		stDetail.setIssuedQuantity(itemList.get(stockRequestDtls.getId()).getAvailableQuantity());
		stDetail.setIssuedValue(BigDecimal.valueOf(itemList.get(stockRequestDtls.getId()).getAvailableQuantity())
				.multiply(stockRequestDtls.getStdValue()));
		stDetail.setIssuedWeight(stockRequestDtls.getStdWeight()
				.multiply(BigDecimal.valueOf(itemList.get(stockRequestDtls.getId()).getAvailableQuantity())));
		// received values are setted
		stDetail.setReceivedValue(BigDecimal.valueOf(itemList.get(stockRequestDtls.getId()).getAvailableQuantity())
				.multiply(stockRequestDtls.getStdValue()));
		stDetail.setReceivedQuantity(itemList.get(stockRequestDtls.getId()).getAvailableQuantity());
		stDetail.setReceivedWeight(stockRequestDtls.getStdWeight()
				.multiply(BigDecimal.valueOf(itemList.get(stockRequestDtls.getId()).getAvailableQuantity())));
		stockRequestDtls.setIssuedQuantity(itemList.get(stockRequestDtls.getId()).getAvailableQuantity());
	}

	private void setValueToStockTransaction(StockTransactionDao stockTransaction,
			List<StockTransactionDetailsDao> stList, StockRequestDetailsDao stockRequestDtls,
			StockTransactionDetailsDao stDetail) {
		stDetail.setStatus(StockTransferStatusEnum.ISSUED.name());
		stDetail.setItemDetails(stockRequestDtls.getItemDetails());
		stDetail.setStockTransaction(stockTransaction);
		stDetail.setInventoryId(stockRequestDtls.getInventoryId());
		stDetail.setStdValue(stockRequestDtls.getStdValue());
		stDetail.setStdWeight(stockRequestDtls.getStdWeight());
		stDetail.setIssuedBinCode(stockRequestDtls.getBinGroupCode());
		stDetail.setIssuedWeightDetails(stockRequestDtls.getSelectedWeightDetails());
		stDetail.setReceivedWeightDetails(stockRequestDtls.getSelectedWeightDetails());

		if (stockTransaction.getTransactionType().equals(OtherIssueRequestTypeEnum.LOSS.toString())) {
			TaxCalculationResponseDto taxDetailsResponse = engineClient.getTaxDetails(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), null, null,
					TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE_OTHER_ISSUE.name(), stockRequestDtls.getItemCode(), false,
					null);
			Map<String, BigDecimal> taxDetails = new HashMap<>();
			Map<String, TaxDetailDto> data = new HashMap<>();
			TaxDetailDto sgstDetails = null;
			if (taxDetailsResponse != null) {
				data = taxDetailsResponse.getData();
				if (!CollectionUtils.isEmpty(data)) {
					if (data.get("SGST") != null) {
						sgstDetails = data.get("SGST");
						if (sgstDetails.getTaxPercentage() != null) {
							taxDetails.put("SGSTVal",
									stockRequestDtls.getStdValue()
											.multiply(sgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
											.setScale(2, RoundingMode.HALF_UP));
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
								taxDetails.put("UTGSTVal",
										stockRequestDtls.getStdValue()
												.multiply(utgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
												.setScale(2, RoundingMode.HALF_UP));
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
							taxDetails.put("CGSTVal",
									stockRequestDtls.getStdValue()
											.multiply(cgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
											.setScale(2, RoundingMode.HALF_UP));
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
								taxDetails.put("IGSTVal",
										stockRequestDtls.getStdValue()
												.multiply(igstDetails.getTaxPercentage().divide(ONE_HUNDRED))
												.setScale(2, RoundingMode.HALF_UP));
								taxDetails.put("IGSTPct", igstDetails.getTaxPercentage());
							}
						}
					} else {
						taxDetails.put("IGSTVal", BigDecimal.ZERO);
						taxDetails.put("IGSTPct", BigDecimal.ZERO);

					}
				}
			}
			// stDetail.setTaxDetails(MapperUtil.getStringFromJson(taxDetails));
			Map<String, Object> issueStockTaxDetails = new LinkedHashMap<>();
			issueStockTaxDetails.put("type", "TAX_DETAILS");
			issueStockTaxDetails.put("data", taxDetails);
			stDetail.setTaxDetails(MapperUtil.getStringFromJson(issueStockTaxDetails).replace("\\", "")
					.replace("\"[", "[").replace("]\"", "]"));

			BigDecimal totalTax = BigDecimal.ZERO;
			if (!taxDetailsResponse.getData().isEmpty()) {

				for (Entry<String, TaxDetailDto> taxDetailsDto : taxDetailsResponse.getData().entrySet()) {
					taxDetailsDto.getValue()
							.setTaxValue((stockRequestDtls.getStdValue().multiply(
									(taxDetailsDto.getValue().getTaxPercentage().divide(BigDecimal.valueOf(100)))))
									.setScale(DomainConstants.PRICE_SCALE, RoundingMode.HALF_UP));

					totalTax = totalTax.add(taxDetailsDto.getValue().getTaxValue());
				}
			}
			stDetail.setTotalTax(totalTax);
		}
		Optional<InventoryDetailsDaoExt> invDetailsDaoOptional = inventoryDetailsService
				.findById(stockRequestDtls.getInventoryId());
		if (invDetailsDaoOptional.isPresent()) {
			stDetail.setStockInwardDate(invDetailsDaoOptional.get().getStockInwardDate());
		}
		stList.add(stDetail);

	}

	private StockTransactionDao updateStockTransaction(StockTransactionDao stockTransaction, short totalIssuedQuantity,
			BigDecimal totalValue, BigDecimal totalWeight) {
		stockTransaction.setTotalIssuedQuantity(totalIssuedQuantity);
		stockTransaction.setTotalIssuedValue(totalValue);
		stockTransaction.setTotalIssuedWeight(totalWeight);
		stockTransaction = stockTransactionService.saveOrUpdateStockTransaction(stockTransaction);
		return stockTransaction;
	}

	private void updateStockRequest(StockRequestDao stockRequest, short totalIssuedQuantity, BigDecimal totalWeight) {
		BusinessDayDto businessDayDto = getBusinessDay(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		stockRequest.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		stockRequest.setIssuedDate(businessDayDto.getBusinessDate());
		stockRequest.setTotalIssuedQuantity(totalIssuedQuantity);
		stockRequest.setTotalIssuedWeight(totalWeight);
		stockRequest.setTotalSelectedQuantity((short) 0);
		stockRequest.setTotalSelectedWeight(BigDecimal.ZERO);
		stockRequestService.save(stockRequest);
	}

	private void getOutOfStockItemIds(List<QuantityCheckDto> itemIds, Map<String, QuantityCheckDto> mapList,
			List<String> zeroQuantityItemList) {
		// maplist will have all items whose selected quantity is more than inventory
		// even 0 quantity
		for (QuantityCheckDto quantityCheckDto : itemIds) {
			if (quantityCheckDto.getAvailableQuantity() == 0) {
				// add those items whose qauntity is 0 in inventory, which will not be issued
				zeroQuantityItemList.add(quantityCheckDto.getItemId());
			} else {// add only those item ids whose inventory quantity is less than selected
					// quantity
				mapList.put(quantityCheckDto.getItemId(), quantityCheckDto);
			}
		}

	}

	private void validateBinForBinRequests(Integer id, String requestType) {
		if (RequestTypesEnum.withBinGoupRequests().contains(requestType)) {
			// only applicable for LOAN, LOSS, EXH
			// Query to check restricted bins before
			// issue
			List<QuantityCheckDto> items = checkIssueBinValidation(id);

			// if bin-group got change before issue. throw exception
			if (!items.isEmpty()) {
				throw new ServiceException("Following items Bingroup has been changed so couldnot confirm" + items,
						"ERR-INV-037", items);
			}
		}
	}

	// Issue Bin Group Validation...get Data from DB
	private List<QuantityCheckDto> checkIssueBinValidation(Integer id) {
		List<QuantityCheckDto> itemIds = new ArrayList<>();
		List<Object[]> availableItemList = stockRequestService.checkBinValidationWithInventoryOtherIssue(id);
		return getItemIdsBinList(itemIds, availableItemList);

	}

	private List<QuantityCheckDto> getItemIdsBinList(List<QuantityCheckDto> itemIds, List<Object[]> availableItemList) {
		for (Object[] availableItem : availableItemList) {
			QuantityCheckDto item = new QuantityCheckDto();
			item.setItemId((String) availableItem[0]);
			item.setLotNumber((String) availableItem[1]);
			item.setItemCode((String) availableItem[2]);
			item.setCurrentBinGroup((String) availableItem[3]);
			item.setPreviousBinGroup((String) availableItem[4]);

			itemIds.add(item);
		}
		return itemIds;
	}

	private List<QuantityCheckDto> getItemIdsQuantityList(List<QuantityCheckDto> itemIds,
			List<Object[]> availableItemList) {
		for (Object[] availableItem : availableItemList) {
			QuantityCheckDto item = new QuantityCheckDto();
			item.setItemId((String) availableItem[0]);
			item.setLotNumber((String) availableItem[1]);
			item.setItemCode((String) availableItem[2]);
			Integer totalQty = (int) availableItem[3];

			item.setSelectedQuantity((short) availableItem[4]);
			Integer issuedQty = (int) availableItem[5];
			item.setAvailableQuantity((short) (totalQty - issuedQty));

			itemIds.add(item);
		}
		return itemIds;
	}

	private ReceiveStockDto createConfirmReceiveStockDto(StockTransactionDao stockTransaction) {
		ReceiveStockDto receiveStockDto = (ReceiveStockDto) MapperUtil.getDtoMapping(stockTransaction,
				ReceiveStockDto.class);
		// needed to convert it to string before sending
		receiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stockTransaction.getCarrierDetails()));
		// yet to implement/
		receiveStockDto.setTotalAvailableQuantity(stockTransaction.getTotalReceivedQuantity());
		// totalApprovedQuantity will be populated while confirming request
		// and will be updated in ApprovalController
		receiveStockDto.setTotalAvailableWeight(stockTransaction.getTotalReceivedWeight());
		receiveStockDto.setTotalAvailableValue(stockTransaction.getTotalReceivedValue());
		receiveStockDto.setTotalMeasuredQuantity(stockTransaction.getTotalIssuedQuantity());
		receiveStockDto.setTotalMeasuredWeight(stockTransaction.getTotalIssuedWeight());
		receiveStockDto.setTotalMeasuredValue(stockTransaction.getTotalIssuedValue());
		receiveStockDto.setTransferType(stockTransaction.getTransactionType());
		receiveStockDto.setSrcDocNo(stockTransaction.getIssuedDocNo());
		receiveStockDto.setSrcDocDate(stockTransaction.getIssuedDocDate());
		receiveStockDto.setSrcFiscalYear(Integer.valueOf(stockTransaction.getIssuedFiscalYear()));
		receiveStockDto.setSrcLocationCode(stockTransaction.getLocationCode());
		receiveStockDto.setDestLocationCode(stockTransaction.getLocationCode());

		return receiveStockDto;

	}

	public void getRemoveInventoryDetails(StockTransactionDao stockTransaction, List<InventoryDetailsDaoExt> inv) {

		List<StockTransactionDetailsDao> stds = stockTransactionService
				.findByStockTransactionAndStatus(stockTransaction, OtherRequestStatusEnum.ISSUED.toString());
		List<String> invIds = new ArrayList<>();
		if (!stds.isEmpty()) {

			for (StockTransactionDetailsDao stransactionDetail : stds) {

				InventoryDetailsDaoExt inventoryDetail = (InventoryDetailsDaoExt) MapperUtil
						.getDtoMapping(stransactionDetail, InventoryDetailsDaoExt.class);
				inventoryDetail.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
				inventoryDetail.setTotalQuantity(stransactionDetail.getIssuedQuantity());
				inventoryDetail.setTotalValue(stransactionDetail.getIssuedValue());
				inventoryDetail.setTotalWeight(stransactionDetail.getIssuedWeight());
				inventoryDetail.setId(stransactionDetail.getInventoryId());
				inventoryDetail.setSerialNumber(stransactionDetail.getIssuedWeight().toString());
				inventoryDetail.setOrgCode(stockTransaction.getOrgCode());
				inventoryDetail.setRequestType(null);
				inventoryDetail.setRequestQuantity((short) (0));
				inv.add(inventoryDetail);
				invIds.add(stransactionDetail.getInventoryId());

			}
			List<InventoryDetailsDaoExt> invList = inventoryTransactionService.getInventoryDetailsByIdList(invIds);
			for (StockTransactionDetailsDao stransactionDetail : stds) {
				for (InventoryDetailsDaoExt in : invList) {
					if (stransactionDetail.getInventoryId().equals(in.getId())) {
						// updating issued quantity alone, before datasync
						in.setIssuedQuantity(
								(short) (in.getIssuedQuantity() + stransactionDetail.getIssuedQuantity().shortValue()));
						in.setRequestType(null);
						in.setRequestQuantity((short) (0));
					}
				}

			}
			inventoryTransactionService.updateIssuedQuantity(invList);

		}

	}

	private List<QuantityCheckDto> checkQuantityValidation(Integer id) {
		List<QuantityCheckDto> itemIds = new ArrayList<>();
		List<Object[]> availableItemList = stockRequestService.checkAvailableQuantityWithInventory(id);

		return getItemIdsQuantityList(itemIds, availableItemList);

	}

	private List<StockRequestDetailsDao> getStockRequestDetails(StockRequestDao stockRequest) {
		StockRequestDao sr = new StockRequestDao();
		sr.setId(stockRequest.getId());
		sr.setRequestType(stockRequest.getRequestType());
		StockRequestDetailsDao stockRequestDetail = new StockRequestDetailsDao();
		stockRequestDetail.setStockRequest(sr);
		stockRequestDetail.setStatus(StockRequestStatusEnum.SELECTED.toString());
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StockRequestDetailsDao> criteria = Example.of(stockRequestDetail, matcher);
		return stockRequestService.findAllStockRequestItems(criteria);
	}

	private StockTransactionDao createStockTransaction(String requestType, StockIssueStockConfirmDto stnIssueConfirmDto,
			StockRequestDao stockRequest, CountryDetailsDto countryDetailsDto, BusinessDayDto businessDayDto) {
		Object carrierDetails = null;
		ObjectMapper objectMapper = MapperUtil.getObjectMapperInstance();
		if (stnIssueConfirmDto.getCarrierDetails() == null
				|| stnIssueConfirmDto.getCarrierDetails().getData() == null) {
			carrierDetails = MapperUtil.getJsonFromString(stockRequest.getCarrierDetails());
		} else {
			carrierDetails = stnIssueConfirmDto.getCarrierDetails();
		}
		StockTransactionDao stockTransaction = (StockTransactionDao) MapperUtil.getDtoMapping(stockRequest,
				StockTransactionDao.class);
		stockTransaction.setId(null);
		stockTransaction.setTransactionType(requestType);
		stockTransaction
				.setCarrierDetails(MapperUtil.getStringFromJson(objectMapper.convertValue(carrierDetails, Map.class)));
		stockTransaction.setStatus(StockRequestStatusEnum.ISSUED.toString());
		stockTransaction.setIssuedRemarks(stnIssueConfirmDto.getRemarks());
		stockTransaction.setPrints((short) 0);
		stockTransaction.setTotalIssuedQuantity(stockRequest.getTotalIssuedQuantity());
		stockTransaction.setTotalReceivedQuantity(stockRequest.getTotalIssuedQuantity());
		// issued value and issued weight should be changed
		stockTransaction.setTotalIssuedValue(stockRequest.getTotalRequestedValue());
		stockTransaction.setIssuedDocNo(inventoryDocMasterService.getDocNumber(
				countryDetailsDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.OTHERISSUE.toString()));
		stockTransaction.setIssuedDocDate(businessDayDto.getBusinessDate());
		stockTransaction.setIssuedFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		stockTransaction.setIssuedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		stockTransaction.setLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		// need to check
		stockTransaction.setStockRequestId(stockRequest.getId());
		stockTransaction = stockTransactionService.saveOrUpdateStockTransaction(stockTransaction);
		return stockTransaction;
	}

	@Override
	public void updateAllStockIssueItems(Integer id, String requestType, IssueStockItemBulkDto issueStockItemBulkDto) {
		stockRequestService.updateIssueRequestItems(id, requestType, issueStockItemBulkDto);
	}

	@Override
	public ResponseEntity<Resource> getOtherIssuePDF(Integer id, String transactionType, String receive) {

		List<InventoryChild> inventoryChildList = new ArrayList<>();
		OtherIssuePrintHeader otherReceiveStockDto;
		BigDecimal totalTax = BigDecimal.ZERO;
		BigDecimal totalFinalValue = BigDecimal.ZERO;
		BigDecimal totalStdWeight = new BigDecimal(0);

		String html = null;
		StockTransactionDao stockTransaction = stockTransactionService.getOtherIssuePDF(id, transactionType);

		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();

		BrandDto brandDto = engineService.getBrand(authUser.getBrandCode());

		if (stockTransaction.getStatus().equals(StockIssueTransferTypeStatusEnum.ISSUED.toString())
				|| stockTransaction.getStatus().equals(OtherReceiveStatusEnum.RECEIVED.toString())) {

			Short printCount = InventoryUtil.checkPrintMaxConfig(brandDto, stockTransaction.getPrints());
			otherReceiveStockDto = (OtherIssuePrintHeader) MapperUtil.getDtoMapping(stockTransaction,
					OtherIssuePrintHeader.class);

			otherReceiveStockDto.setTotalIssuedValueInWords(String.valueOf(otherReceiveStockDto.getTotalIssuedValue()));
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
			otherReceiveStockDto.setIssuedDate(simpleDateFormat.format(otherReceiveStockDto.getIssuedDocDate()));
			List<StockTransactionDetailsDao> stockTransactionList = stockTransactionService
					.findAllStockTransactionDetails(stockTransaction);
			otherReceiveStockDto.setTaxHeader("");
			for (StockTransactionDetailsDao stockTransactionDetail : stockTransactionList) {
				InventoryChild inventoryChild;
				BigDecimal itemTax = new BigDecimal(0);

				inventoryChild = (InventoryChild) MapperUtil.getDtoMapping(stockTransactionDetail,
						InventoryChild.class);
				ItemsDto itemDto = engineClient.getItemDetails(inventoryChild.getItemCode());

				JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(stockTransactionDetail.getTaxDetails()), JsonData.class);
				if (jsonData.getData() != null
						&& stockTransaction.getTransactionType().equals(OtherIssueRequestTypeEnum.LOSS.toString())) {
					JsonObject jsonObject = new JsonParser().parse(MapperUtil.getJsonString(jsonData.getData()))
							.getAsJsonObject();
					BigDecimal qty = BigDecimal.ZERO;
					if (receive != null) {
						qty = new BigDecimal(inventoryChild.getReceivedQuantity());
					} else {
						qty = new BigDecimal(inventoryChild.getIssuedQuantity());
					}
					if (jsonObject != null) {
						if (jsonObject.get("SGST") != null) {
							JsonObject sgst = jsonObject.get("SGST").getAsJsonObject();

							BigDecimal sgstPct = BigDecimal.ZERO;
							sgstPct = sgst.get("taxPercentage").getAsBigDecimal();
							if (sgstPct != null && sgstPct.compareTo(BigDecimal.ZERO) > 0) {
								inventoryChild.setSgst(stockTransactionDetail.getIssuedValue()
										.multiply(sgstPct.divide(ONE_HUNDRED)).setScale(2, RoundingMode.HALF_UP));
							}
						} else {
							inventoryChild.setSgst(BigDecimal.ZERO);
						}
						if (jsonObject.get("CGST") != null) {
							JsonObject cgst = jsonObject.get("CGST").getAsJsonObject();
							BigDecimal cgstPct = BigDecimal.ZERO;
							cgstPct = cgst.get("taxPercentage").getAsBigDecimal();
							if (cgstPct != null && cgstPct.compareTo(BigDecimal.ZERO) > 0) {
								inventoryChild.setCgst(stockTransactionDetail.getIssuedValue()
										.multiply(cgstPct.divide(ONE_HUNDRED)).setScale(2, RoundingMode.HALF_UP));
							}
						} else {
							inventoryChild.setCgst(BigDecimal.ZERO);
						}
						if (jsonObject.get("UGST") != null) {
							JsonObject ugst = jsonObject.get("UGST").getAsJsonObject();
							BigDecimal ugstPct = BigDecimal.ZERO;
							ugstPct = ugst.get("taxPercentage").getAsBigDecimal();
							if (ugstPct != null && ugstPct.compareTo(BigDecimal.ZERO) > 0) {
								inventoryChild.setCgst(stockTransactionDetail.getIssuedValue()
										.multiply(ugstPct.divide(ONE_HUNDRED)).setScale(2, RoundingMode.HALF_UP));
							}
						} else
							inventoryChild.setUgst(BigDecimal.ZERO);

						if (jsonObject.get("IGST") != null) {
							JsonObject igst = jsonObject.get("IGST").getAsJsonObject();
							BigDecimal igstPct = BigDecimal.ZERO;
							igstPct = igst.get("taxPercentage").getAsBigDecimal();
							if (igstPct != null && igstPct.compareTo(BigDecimal.ZERO) > 0) {
								inventoryChild.setCgst(stockTransactionDetail.getIssuedValue()
										.multiply(igstPct.divide(ONE_HUNDRED)).setScale(2, RoundingMode.HALF_UP));
							}
						} else
							inventoryChild.setIgst(BigDecimal.ZERO);
					}
					inventoryChild.setSgst(inventoryChild.getSgst().multiply(qty));
					inventoryChild.setCgst(inventoryChild.getCgst().multiply(qty));
					inventoryChild.setUgst(inventoryChild.getUgst().multiply(qty));
					inventoryChild.setIgst(inventoryChild.getIgst().multiply(qty));
				} else {
					inventoryChild.setSgst(BigDecimal.ZERO);
					inventoryChild.setCgst(BigDecimal.ZERO);
					inventoryChild.setUgst(BigDecimal.ZERO);
					inventoryChild.setIgst(BigDecimal.ZERO);

				}

				itemTax = itemTax.add(inventoryChild.getSgst()).add(inventoryChild.getCgst())
						.add(inventoryChild.getUgst()).add(inventoryChild.getIgst());
				inventoryChild.setItemTax(itemTax);
				totalTax = totalTax.add(itemTax);

				inventoryChild.setTaxValue(BigDecimal.ZERO);
				if (inventoryChild.getIgst().compareTo(BigDecimal.ZERO) != 0) {
					otherReceiveStockDto.setTaxHeader("IGST");
					inventoryChild.setTaxValue(inventoryChild.getIgst());
				} else if (inventoryChild.getUgst().compareTo(BigDecimal.ZERO) != 0) {
					otherReceiveStockDto.setTaxHeader("UGST");
					inventoryChild.setTaxValue(inventoryChild.getUgst());
				} else if (inventoryChild.getSgst().compareTo(BigDecimal.ZERO) != 0) {
					otherReceiveStockDto.setTaxHeader("SGST");
					inventoryChild.setTaxValue(inventoryChild.getSgst());
				}

				if (itemDto.getProductType() != null) {
					inventoryChild.setProductType(itemDto.getProductType());
				}

				if (itemDto.getHsnSacCode() != null) {
					inventoryChild.setHsnCode(itemDto.getHsnSacCode());
				}

				if (receive != null && inventoryChild.getReceivedValue() != null) {
					totalFinalValue = totalFinalValue.add(inventoryChild.getReceivedValue().add(itemTax));
					inventoryChild.setFinalValue(inventoryChild.getReceivedValue().add(itemTax));
				} else if (inventoryChild.getIssuedValue() != null) {
					totalFinalValue = totalFinalValue.add(inventoryChild.getIssuedValue().add(itemTax));
					inventoryChild.setFinalValue(inventoryChild.getIssuedValue().add(itemTax));
				}

				totalStdWeight = totalStdWeight.add(inventoryChild.getStdWeight());

				inventoryChildList.add(inventoryChild);

			}
			LOGGER.info("totalFinalValue {}", totalFinalValue);
			totalFinalValue = totalFinalValue.setScale(0, RoundingMode.HALF_UP);
			otherReceiveStockDto.setTotalStdWeight(totalStdWeight);
			otherReceiveStockDto.setTotalFinalValue(totalFinalValue);
			otherReceiveStockDto.setTotalTax(totalTax);
			LOGGER.info("otherReceiveStockDto {}", otherReceiveStockDto.getTotalFinalValue());

			StorePrintDetailsDto storeLocationDto = engineService
					.getLocationDetailWithTaxCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			String totalPrice = "";

			String remarks = stockTransaction.getIssuedRemarks();
			InventoryPrint inventoryPrint = new InventoryPrint();
			inventoryPrint.setOtherIssuePrintHeader(otherReceiveStockDto);
			inventoryPrint.setInventoryChildList(inventoryChildList);
			inventoryPrint.setSrcLocationData(storeLocationDto);
			inventoryPrint.setDestLocationData(storeLocationDto);
			inventoryPrint.setRemarks(remarks);
			inventoryPrint.setTotalPrice(totalPrice);
			inventoryPrint.setPriceInWords(numberToWordsFactory.getPriceInWords(
					inventoryPrint.getOtherIssuePrintHeader().getTotalFinalValue().longValue(),
					DomainConstants.ASIAN_PRICE_TYPE));

			// inventoryService.nullCheckForMandatoryFields(inventoryPrint);
			if (stockTransaction.getCurrencyCode().equals(CommonConstants.CURRENCY_CODE))
				inventoryPrint.setCurrency("Rupees");

			String templateName = "otherIssue.ftl";
			switch (otherReceiveStockDto.getTransactionType()) {
			case "EXH":
				inventoryPrint.setTxnTypeDetail("Exhibition");
				break;
			case "LOAN":
				inventoryPrint.setTxnTypeDetail("Loan");
				templateName = "otherIssueLoan.ftl";
				break;
			case "LOSS":
				inventoryPrint.setTxnTypeDetail("Loss");
				break;
			case "ADJ":
				inventoryPrint.setTxnTypeDetail("Adjustment");
				break;
			case "FOC":
				inventoryPrint.setTxnTypeDetail("Free Of Cost");
				break;
			case "PSV":
				inventoryPrint.setTxnTypeDetail("Physical Stock Verification");
				break;
			default:
				break;
			}
			if (receive != null) {
				if (otherReceiveStockDto.getTransactionType().equals("LOAN")) {
					templateName = "otherReceiptLoan.ftl";
				} else {
					templateName = "otherReceipt.ftl";
				}
			}
			if (printCount > 1) {
				inventoryPrint.setDocument("DUPLICATE");
			} else {
				inventoryPrint.setDocument("ORIGINAL");
			}
			try {
				Template t = freemarkerConfig.getTemplate(templateName);
				inventoryService.nullCheckForMandatoryFields(inventoryPrint);
				html = FreeMarkerTemplateUtils.processTemplateIntoString(t, inventoryPrint);

				stockTransactionService.updatePrintCountOtherIssue(printCount, stockTransaction.getId());
				return generatePdf(html, otherReceiveStockDto.getTransactionType(), otherReceiveStockDto.getId());

			} catch (Exception e) {
				throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
			}

		} else {
			throw new ServiceException("cannot print for non issued", "");
		}
	}

	public ResponseEntity<Resource> generatePdf(String html, String type, Integer id) {

		String path = new StringBuilder().append("INVENTORY").append("/").append(CommonUtil.getLocationCode())
				.append("/") // CPD/
				.append(type).append("/") // CUSTOMER-MASTER-ID/
				.append(id) // TXN-ID/
				.append(".").append(FileExtensionEnum.PDF.getValue()) // GC_PRINTS.pdf
				.toString();
		return PrintUtil.printPdfAndSave(html, fileBasePath, path);

	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}

}