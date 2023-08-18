/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade.impl;

import java.io.StringReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.enums.DateEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.inventory.dao.BinRequestDao;
import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dao.StockInvoiceDetailsDao;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dao.StockTransferDetailsDao;
import com.titan.poss.inventory.dto.IsacDetailsDto;
import com.titan.poss.inventory.dto.constants.ActionTypeEnum;
import com.titan.poss.inventory.dto.constants.BinRequestHistoryEnum;
import com.titan.poss.inventory.dto.constants.PurchaseInvoiceStatus;
import com.titan.poss.inventory.dto.constants.ReturnInvoiceStatus;
import com.titan.poss.inventory.dto.constants.ReturnInvoiceType;
import com.titan.poss.inventory.dto.constants.StockInvoiceHistoryStatusEnum;
import com.titan.poss.inventory.dto.constants.StockInvoiceHistoryTypeEnum;
import com.titan.poss.inventory.dto.constants.StockIssueHistoryStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransactionHistoryStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferHistoryStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferTypeEnum;
import com.titan.poss.inventory.dto.request.HistoryInvoiceItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryInvoiceRequestDto;
import com.titan.poss.inventory.dto.request.HistoryIssueItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryIssueRequestDto;
import com.titan.poss.inventory.dto.request.HistoryRequestBinDto;
import com.titan.poss.inventory.dto.request.HistoryTransactionItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransactionRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransferItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryTransferRequestDto;
import com.titan.poss.inventory.dto.response.HistoryBinRequestDto;
import com.titan.poss.inventory.dto.response.HistoryConversionItemsDto;
import com.titan.poss.inventory.dto.response.HistoryInvoiceDto;
import com.titan.poss.inventory.dto.response.HistoryInvoiceItemDto;
import com.titan.poss.inventory.dto.response.HistoryIssueDto;
import com.titan.poss.inventory.dto.response.HistoryOtherReceiveStockDto;
import com.titan.poss.inventory.dto.response.HistoryReceiveStockDto;
import com.titan.poss.inventory.dto.response.OtherReceiveStockItemDto;
import com.titan.poss.inventory.dto.response.ReceiveStockItemDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;
import com.titan.poss.inventory.facade.HistoryFacade;
import com.titan.poss.inventory.service.BinRequestService;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InvoiceService;
import com.titan.poss.inventory.service.LocationService;
import com.titan.poss.inventory.service.StockRequestService;
import com.titan.poss.inventory.service.StockTransactionService;
import com.titan.poss.inventory.service.StockTransferService;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Service("historyFacade")
public class HistoryFacadeImpl implements HistoryFacade {

	private static final Logger LOGGER = LoggerFactory.getLogger(HistoryFacadeImpl.class);

	private static final String ERR_CORE_052 = "ERR-CORE-052";

	public static final BigDecimal ONE_HUNDRED = new BigDecimal(100);

	private static final String START_DATE_AND_END_DATE_NOT_NULL = "Start date and end date cannot be null";

	@Autowired
	private EngineServiceClient engineClient;

	@Autowired
	StockTransferService stockTransferService;

	@Autowired
	StockRequestService stockRequestService;

	@Autowired
	LocationService locationService;

	@Autowired
	InvoiceService invoiceService;

	@Autowired
	StockTransactionService stockTransactionService;

	@Autowired
	EngineService engineService;

	@Autowired
	BinRequestService binRequestService;

	@Override
	public PagedRestResponse<List<HistoryReceiveStockDto>> listStockTransfer(String transferType,
			HistoryTransferRequestDto historyTransferRequestDto, Pageable pageable, Boolean isLegacy) {
		Date startingDate = null;
		Date endingDate = new Date();
		Page<StockTransferDao> stockTransferPageData = null;
		startingDate = getStartDateBasedOnInput(historyTransferRequestDto.getDateRangeType(),
				historyTransferRequestDto.getStartDate(), historyTransferRequestDto.getEndDate(), startingDate);
		if (DateEnum.CUSTOM.toString().equals(historyTransferRequestDto.getDateRangeType())) {
			endingDate = historyTransferRequestDto.getEndDate();
		}
		stockTransferPageData = getStockTransferData(transferType, historyTransferRequestDto, pageable, startingDate,
				endingDate, stockTransferPageData,isLegacy);
		
		List<HistoryReceiveStockDto> historyReceiveStockDetails = new ArrayList<>();
		// convert page of StockTransfer to list of ReceiveStockDto
		for (StockTransferDao stockTransfer : stockTransferPageData) {
			historyReceiveStockDetails.add(generateReceiveStockDto(stockTransfer));
		}
		LOGGER.debug("Get stn Details - {}", historyReceiveStockDetails.size());
		return new PagedRestResponse<>(historyReceiveStockDetails, stockTransferPageData);
	}

	private Page<StockTransferDao> getStockTransferData(String transferType,
			HistoryTransferRequestDto historyTransferRequestDto, Pageable pageable, Date startingDate, Date endingDate,
			Page<StockTransferDao> stockTransferPageData, Boolean isLegacy) {
		List<String> statuses = (historyTransferRequestDto.getStatuses().isEmpty())
				? StockTransferHistoryStatusEnum.getAllStatus()
				: historyTransferRequestDto.getStatuses();

		if (ActionTypeEnum.ISSUE.toString().equals(historyTransferRequestDto.getActionType())) {
			if(StockTransferTypeEnum.BTQ_BTQ.toString().equalsIgnoreCase(transferType) && BooleanUtils.isTrue(isLegacy)) {
				stockTransferPageData = stockTransferService.listStockTransferIssueLegacyIbtHistory(
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), historyTransferRequestDto,
						startingDate, endingDate, statuses, transferType, pageable);
			} else if(StockTransferTypeEnum.BTQ_BTQ.toString().equalsIgnoreCase(transferType) && BooleanUtils.isFalse(isLegacy)) {
				stockTransferPageData = stockTransferService.listStockTransferIssueIbtHistory(
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), historyTransferRequestDto,
						startingDate, endingDate, statuses, transferType, pageable);
			} else {
				stockTransferPageData = stockTransferService.listStockTransferIssueHistory(
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), historyTransferRequestDto,
						startingDate, endingDate, statuses, transferType, pageable);
			}
			
			

		} else if (ActionTypeEnum.RECEIVE.toString().equals(historyTransferRequestDto.getActionType())) {
			stockTransferPageData = stockTransferService.listStockTransferReceiveHistory(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), historyTransferRequestDto,
					startingDate, endingDate, statuses, transferType, pageable);
		}
		return stockTransferPageData;
	}

	private HistoryReceiveStockDto generateReceiveStockDto(StockTransferDao stockTransfer) {
		HistoryReceiveStockDto historyReceiveStockDto = (HistoryReceiveStockDto) MapperUtil.getDtoMapping(stockTransfer,
				HistoryReceiveStockDto.class);
		historyReceiveStockDto.setSrcLocationDescription(getLocationDescription(stockTransfer.getSrcLocationCode()));
		historyReceiveStockDto.setDestLocationDescription(getLocationDescription(stockTransfer.getDestLocationCode()));
		historyReceiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stockTransfer.getCarrierDetails()));
		if (StockTransferHistoryStatusEnum.ISSUED.toString().equals(stockTransfer.getStatus())
				|| StockTransferHistoryStatusEnum.CANCELLED.toString().equals(stockTransfer.getStatus())) {
			historyReceiveStockDto.setTotalMeasuredQuantity(stockTransfer.getTotalIssuedQuantity());
			historyReceiveStockDto.setTotalMeasuredValue(stockTransfer.getTotalIssuedValue());
			historyReceiveStockDto.setTotalMeasuredWeight(stockTransfer.getTotalIssuedWeight());
			historyReceiveStockDto.setRemarks(stockTransfer.getIssuedRemarks());
			historyReceiveStockDto.setCancelledDate(stockTransfer.getCancelledDate());
			historyReceiveStockDto.setCancelledRemarks(stockTransfer.getCancelledRemarks());
		} else if (StockTransferHistoryStatusEnum.RECEIVED.toString().equals(stockTransfer.getStatus())
				|| StockTransferHistoryStatusEnum.PUBLISHED.toString().equals(stockTransfer.getStatus())) {
			historyReceiveStockDto.setTotalMeasuredQuantity(stockTransfer.getTotalReceivedQuantity());
			historyReceiveStockDto.setTotalMeasuredValue(stockTransfer.getTotalReceivedValue());
			historyReceiveStockDto.setTotalMeasuredWeight(stockTransfer.getTotalReceivedWeight());
			historyReceiveStockDto.setTotalAvailableQuantity(stockTransfer.getTotalIssuedQuantity());
			historyReceiveStockDto.setTotalAvailableValue(stockTransfer.getTotalIssuedValue());
			historyReceiveStockDto.setTotalAvailableWeight(stockTransfer.getTotalIssuedWeight());
			historyReceiveStockDto.setRemarks(stockTransfer.getReceivedRemarks());
		}
		historyReceiveStockDto.setReasonForDelay(stockTransfer.getReasonForDelay());

		if (stockTransfer.getStockRequestId() != null) {
			StockRequestDao stRqDao = stockRequestService.findById(stockTransfer.getStockRequestId());
			historyReceiveStockDto.setReqDocNo(stRqDao.getReqDocNo());
			historyReceiveStockDto.setReqDocDate(stRqDao.getReqDocDate());
		}
		return historyReceiveStockDto;
	}

	@Override
	public PagedRestResponse<List<ReceiveStockItemDto>> listStockTransferItems(Integer id,
			HistoryTransferItemRequestDto historyTransferItemRequestDto, Pageable pageable, String actionType,
			String transferType) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		StockTransferDao stTransfer = getStockTransferBasedOnIdAndLocationCode(id, actionType, transferType);
		// call stock transfer service to get the pageable data of stock transfer
		// details
		Page<StockTransferDetailsDao> stTransferDetailsPage = stockTransferService
				.listStockTransferItemHistory(stTransfer, historyTransferItemRequestDto, pageable);
		// reiterate stTransferDetailsPage object
		List<ReceiveStockItemDto> receiveStockItemDtos = createReceiveStockItemDtoList(productGroupList,
				productCategoryList, stTransferDetailsPage, stTransfer);
		LOGGER.debug("listProductDtls Count - {}", receiveStockItemDtos.size());
		return new PagedRestResponse<>(receiveStockItemDtos, stTransferDetailsPage);
	}

	private List<ReceiveStockItemDto> createReceiveStockItemDtoList(Map<String, String> productGroupList,
			Map<String, String> productCategoryList, Page<StockTransferDetailsDao> stTransferDetailsPage,
			StockTransferDao stTransfer) {
		List<ReceiveStockItemDto> receiveStockItemDtos = new ArrayList<>();
		for (StockTransferDetailsDao stTransferDetails : stTransferDetailsPage) {
			ReceiveStockItemDto productDtls = (ReceiveStockItemDto) MapperUtil.getDtoMapping(stTransferDetails,
					ReceiveStockItemDto.class);
			if (StockTransferHistoryStatusEnum.ISSUED.toString().equals(stTransfer.getStatus())
					|| StockTransferHistoryStatusEnum.CANCELLED.toString().equals(stTransfer.getStatus())) {
				productDtls.setMeasuredQuantity(stTransferDetails.getIssuedQuantity());
				productDtls.setMeasuredWeight(stTransferDetails.getIssuedWeight());
				productDtls.setMeasuredValue(stTransferDetails.getIssuedValue());
			} else if (StockTransferHistoryStatusEnum.RECEIVED.toString().equals(stTransfer.getStatus())
					|| StockTransferHistoryStatusEnum.PUBLISHED.toString().equals(stTransfer.getStatus())) {
				productDtls.setMeasuredQuantity(stTransferDetails.getReceivedQuantity());
				productDtls.setMeasuredWeight(stTransferDetails.getReceivedWeight());
				productDtls.setMeasuredValue(stTransferDetails.getReceivedValue());
			}
			productDtls.setAvailableQuantity(stTransferDetails.getIssuedQuantity());
			productDtls.setAvailableValue(stTransferDetails.getIssuedValue());
			productDtls.setAvailableWeight(stTransferDetails.getIssuedWeight());
			productDtls.setKarat(stTransferDetails.getKarat());
			productDtls.setItemDetails(MapperUtil.getJsonFromString(stTransferDetails.getItemDetails()));
			productDtls.setImageURL(new URLUtil().getImageUrlByItemCode(stTransferDetails.getItemCode()));
			productDtls.setProductCategory(stTransferDetails.getProductCategory());
			productDtls.setProductCategoryDesc(productCategoryList.get(stTransferDetails.getProductCategory()));
			productDtls.setProductGroup(stTransferDetails.getProductGroup());
			productDtls.setProductGroupDesc(productGroupList.get(stTransferDetails.getProductGroup()));
			// map the stockTransferDetails fields to dto
			productDtls.setRefDocDate(stTransferDetails.getRefDocDate());
			productDtls.setRefDocNumber(stTransferDetails.getRefDocNumber());
			productDtls.setRefDocType(stTransferDetails.getRefDocType());
			productDtls.setRefFiscalYear(stTransferDetails.getRefFiscalYear());
			productDtls.setTaxDetails(MapperUtil.getJsonFromString(stTransferDetails.getTaxDetails()));
			productDtls.setFinalValue(stTransferDetails.getFinalValue());
			productDtls.setTotalTax(stTransferDetails.getTotalTax());
			productDtls.setKaratage(stTransferDetails.getKarat());
			receiveStockItemDtos.add(productDtls);
		}
		return receiveStockItemDtos;
	}

	@Override
	public PagedRestResponse<List<HistoryIssueDto>> listStockRequest(String requestType,
			HistoryIssueRequestDto historyIssueRequestDto, Pageable pageable) {
		Date startingDate = null;
		Date endingDate = new Date();
		startingDate = getStartDateBasedOnInput(historyIssueRequestDto.getDateRangeType(),
				historyIssueRequestDto.getStartDate(), historyIssueRequestDto.getEndDate(), startingDate);
		if (DateEnum.CUSTOM.toString().equals(historyIssueRequestDto.getDateRangeType())) {
			endingDate = historyIssueRequestDto.getEndDate();
		}
		Page<StockRequestDao> stRequestPage = getStockRequestPage(requestType, historyIssueRequestDto, pageable,
				CalendarUtils.getStartOfDay(startingDate), CalendarUtils.getEndOfDay(endingDate));
		List<HistoryIssueDto> stockReqDtls = new ArrayList<>();
		for (StockRequestDao stockRequest : stRequestPage) {
			stockReqDtls.add(generateIssueStockDto(stockRequest));
		}
		LOGGER.debug("Get Some stock request Details - {}", stockReqDtls.size());
		return new PagedRestResponse<>(stockReqDtls, stRequestPage);

	}

	private Page<StockRequestDao> getStockRequestPage(String requestType, HistoryIssueRequestDto historyIssueRequestDto,
			Pageable pageable, Date startingDate, Date endingDate) {
		Page<StockRequestDao> stockRequestPage = null;
		List<String> statuses = (historyIssueRequestDto.getStatuses().isEmpty())
				? StockIssueHistoryStatusEnum.getAllStatus()
				: historyIssueRequestDto.getStatuses();
		if (ActionTypeEnum.ISSUE.toString().equals(historyIssueRequestDto.getActionType())) {
			stockRequestPage = stockRequestService.findStockRequestHistoryBySrcLocationCodeAndRequestType(requestType,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), historyIssueRequestDto,
					startingDate, endingDate, statuses, pageable);
		} else if (ActionTypeEnum.RECEIVE.toString().equals(historyIssueRequestDto.getActionType())) {
			stockRequestPage = stockRequestService.findStockRequestHistoryByDestLocationCodeAndRequestType(requestType,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), historyIssueRequestDto,
					startingDate, endingDate, statuses, pageable);
		}
		return stockRequestPage;
	}

	private HistoryIssueDto generateIssueStockDto(StockRequestDao stockRequest) {
		HistoryIssueDto historyIssueDto = (HistoryIssueDto) MapperUtil.getDtoMapping(stockRequest,
				HistoryIssueDto.class);
		historyIssueDto.setCarrierDetails(MapperUtil.getJsonFromString(stockRequest.getCarrierDetails()));
		historyIssueDto.setOtherDetails(MapperUtil.getJsonFromString(stockRequest.getOtherDetails()));
		historyIssueDto.setSrcLocationDescription(getLocationDescription(stockRequest.getSrcLocationCode()));
		historyIssueDto.setDestLocationDescription(getLocationDescription(stockRequest.getDestLocationCode()));
		historyIssueDto.setSrcDocNo(stockRequest.getReqDocNo());
		historyIssueDto.setSrcDocDate(stockRequest.getReqDocDate());
		historyIssueDto.setSrcFiscalYear(Integer.valueOf(stockRequest.getReqFiscalYear()));
		if (StockIssueHistoryStatusEnum.ISSUED.toString().equals(stockRequest.getStatus())) {
			historyIssueDto.setTotalMeasuredQuantity(stockRequest.getTotalIssuedQuantity());
			historyIssueDto.setTotalMeasuredValue(stockRequest.getTotalIssuedValue());
			historyIssueDto.setTotalMeasuredWeight(stockRequest.getTotalIssuedWeight());
			historyIssueDto.setDestDocDate(stockRequest.getIssuedDate());
		} else {
			updateDocDate(stockRequest, historyIssueDto);
			historyIssueDto.setTotalMeasuredQuantity(stockRequest.getTotalRequestedQuantity());
			historyIssueDto.setTotalMeasuredValue(stockRequest.getTotalRequestedValue());
			historyIssueDto.setTotalMeasuredWeight(stockRequest.getTotalRequestedWeight());
		}
		historyIssueDto.setRemarks(stockRequest.getRequestRemarks());
		return historyIssueDto;
	}

	private void updateDocDate(StockRequestDao stockRequest, HistoryIssueDto historyIssueDto) {
		if (StockIssueHistoryStatusEnum.ACPT_REJECTED.toString().equals(stockRequest.getStatus()))
			historyIssueDto.setDestDocDate(stockRequest.getAcceptedDate());
		else if (StockIssueHistoryStatusEnum.APVL_REJECTED.toString().equals(stockRequest.getStatus()))
			historyIssueDto.setDestDocDate(stockRequest.getApprovedDate());
		else if (StockIssueHistoryStatusEnum.CANCELLED.toString().equals(stockRequest.getStatus())
				|| StockIssueHistoryStatusEnum.EXPIRED.toString().equals(stockRequest.getStatus()))
			historyIssueDto.setDestDocDate(stockRequest.getReqDocDate());
		else if (StockIssueHistoryStatusEnum.CLOSED.toString().equals(stockRequest.getStatus()))
			historyIssueDto.setDestDocDate(stockRequest.getIssuedDate());
	}

	@Override
	public PagedRestResponse<List<RequestStockItemResponseDto>> listStockIssueItems(Integer id, String requestType,
			HistoryIssueItemRequestDto historyIssueItemRequestDto, String actionType, Pageable pageable) {
		Map<String, String> productGroupMap = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryMap = engineService.getProductCategories();
		List<RequestStockItemResponseDto> stockRequestDetailsDtos = new ArrayList<>();
		Page<StockRequestDetailsDao> stRequestDetailsPage = getStockRequestItemDetails(id, historyIssueItemRequestDto,
				pageable, productGroupMap, productCategoryMap, stockRequestDetailsDtos, actionType, requestType);
		return new PagedRestResponse<>(stockRequestDetailsDtos, stRequestDetailsPage);
	}

	private Page<StockRequestDetailsDao> getStockRequestItemDetails(Integer id,
			HistoryIssueItemRequestDto historyIssueItemRequestDto, Pageable pageable,
			Map<String, String> productGroupMap, Map<String, String> productCategoryMap,
			List<RequestStockItemResponseDto> stockRequestDetailsDtos, String actionType, String requestType) {
		StockRequestDao stRequest = getStockReuqestObjectBasedOnIdAndLocationCode(id, actionType, requestType);
		// get pageable object of stock request details and params are stock
		// request,request type,item code,product group,product category,lot
		// number,bincode & bin group code,status
		Page<StockRequestDetailsDao> stRequestDetailsPage = stockRequestService.listStockIssueItemsHistory(stRequest,
				historyIssueItemRequestDto, pageable);
		for (StockRequestDetailsDao stockRequestDetails : stRequestDetailsPage) {
			RequestStockItemResponseDto requestStockItemResponseDto = (RequestStockItemResponseDto) MapperUtil
					.getDtoMapping(stockRequestDetails, RequestStockItemResponseDto.class);
			requestStockItemResponseDto
					.setProductCategoryDesc(productCategoryMap.get(stockRequestDetails.getProductCategory()));
			requestStockItemResponseDto.setProductGroupDesc(productGroupMap.get(stockRequestDetails.getProductGroup()));
			requestStockItemResponseDto
					.setItemDetails(MapperUtil.getJsonFromString(stockRequestDetails.getItemDetails()));
			requestStockItemResponseDto
					.setImageURL(new URLUtil().getImageUrlByItemCode(stockRequestDetails.getItemCode()));
			requestStockItemResponseDto.setMeasuredQuantity(stockRequestDetails.getRequestedQuantity());
			requestStockItemResponseDto.setMeasuredValue(stockRequestDetails.getRequestedValue());
			requestStockItemResponseDto.setMeasuredWeight(stockRequestDetails.getRequestedWeight());
			stockRequestDetailsDtos.add(requestStockItemResponseDto);
		}
		return stRequestDetailsPage;
	}

	@Override
	public PagedRestResponse<List<HistoryInvoiceItemDto>> listStockInvoiceItems(Integer invoiceId, String invoiceType,
			HistoryInvoiceItemRequestDto historyInvoiceItemRequestDto, String actionType, Pageable pageable) {
		Map<String, String> productGroupMap = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryMap = engineService.getProductCategories();
		List<HistoryInvoiceItemDto> historyInvoiceItemDtoList = new ArrayList<>();
		return getInvoiceItemsList(invoiceId, historyInvoiceItemRequestDto, pageable, productGroupMap,
				productCategoryMap, historyInvoiceItemDtoList, actionType, invoiceType);
	}

	private PagedRestResponse<List<HistoryInvoiceItemDto>> createInvoiceItemsListObject(
			Map<String, String> productGroupMap, Map<String, String> productCategoryMap,
			Page<StockInvoiceDetailsDao> stockInvoiceDetailsPage, List<HistoryInvoiceItemDto> historyInvoiceItemDtoList,
			StockInvoiceDao stInvoice) {
		BigDecimal itemLevelDiscount = BigDecimal.ZERO;
		BigDecimal preTaxValue = BigDecimal.ZERO;
		BigDecimal totalTax = BigDecimal.ZERO;
		for (StockInvoiceDetailsDao stInvoiceDetails : stockInvoiceDetailsPage) {
			HistoryInvoiceItemDto historyInvoiceItemDto = (HistoryInvoiceItemDto) MapperUtil
					.getDtoMapping(stInvoiceDetails, HistoryInvoiceItemDto.class);
			historyInvoiceItemDto.setProductCategoryDesc(productCategoryMap.get(stInvoiceDetails.getProductCategory()));
			historyInvoiceItemDto.setProductGroupDesc(productGroupMap.get(stInvoiceDetails.getProductGroup()));
			if (ReturnInvoiceStatus.ISSUED.toString().equals(stInvoice.getStatus())) {
				historyInvoiceItemDto.setMeasuredQuantity(stInvoiceDetails.getReceivedQuantity());
				historyInvoiceItemDto.setMeasuredValue(stInvoiceDetails.getReceivedValue());
				historyInvoiceItemDto.setMeasuredWeight(stInvoiceDetails.getReceivedWeight());
				historyInvoiceItemDto.setAvailableQuantity(stInvoiceDetails.getIssuedQuantity());
				historyInvoiceItemDto.setAvailableValue(stInvoiceDetails.getIssuedValue());
				historyInvoiceItemDto.setAvailableWeight(stInvoiceDetails.getIssuedWeight());
			} else if (PurchaseInvoiceStatus.RECEIVED.toString().equals(stInvoice.getStatus())
					|| PurchaseInvoiceStatus.PUBLISHED.toString().equals(stInvoice.getStatus())) {
				historyInvoiceItemDto.setMeasuredQuantity(stInvoiceDetails.getReceivedQuantity());
				historyInvoiceItemDto.setMeasuredValue(stInvoiceDetails.getReceivedValue());
				historyInvoiceItemDto.setMeasuredWeight(stInvoiceDetails.getReceivedWeight());
				historyInvoiceItemDto.setAvailableQuantity(stInvoiceDetails.getIssuedQuantity());
				historyInvoiceItemDto.setAvailableValue(stInvoiceDetails.getIssuedValue());
				historyInvoiceItemDto.setAvailableWeight(stInvoiceDetails.getIssuedWeight());
			}
			historyInvoiceItemDto.setKaratage(stInvoiceDetails.getKarat());
			historyInvoiceItemDto.setItemDetails(MapperUtil.getJsonFromString(stInvoiceDetails.getItemDetails()));
			historyInvoiceItemDto.setImageURL(new URLUtil().getImageUrlByItemCode(stInvoiceDetails.getItemCode()));
			historyInvoiceItemDto.setIsacDetails(MapperUtil.getJsonFromString(stInvoiceDetails.getIsacDetails()));
			historyInvoiceItemDto.setRefDocDate(stInvoiceDetails.getRefDocDate());
			historyInvoiceItemDto.setRefDocNumber(stInvoiceDetails.getRefDocNumber());
			historyInvoiceItemDto.setRefFiscalYear(stInvoiceDetails.getRefFiscalYear());
			historyInvoiceItemDto.setRefDocType(stInvoiceDetails.getRefDocType());
			if (stInvoiceDetails.getTaxDetails() != null)
				historyInvoiceItemDto.setTaxDetails(MapperUtil.getJsonFromString(stInvoiceDetails.getTaxDetails()));
			if (stInvoiceDetails.getIsacDetails() != null) {
				JsonReader reader = new JsonReader(new StringReader(stInvoiceDetails.getIsacDetails()));
				reader.setLenient(true);
				JsonObject jsonObject = new JsonParser().parse(reader).getAsJsonObject();
				if (jsonObject != null && jsonObject.get("data") != null) {
					JsonObject jsonData = jsonObject.get("data").getAsJsonObject();
                   
					List<IsacDetailsDto> isacDetailList = new ArrayList<>();
					if (jsonData != null && jsonData.get("IsacDetails") != null) {
						JsonArray isacDetails = jsonData.get("IsacDetails").getAsJsonArray();
						for (int i = 0; i < isacDetails.size(); i++) {
							JsonObject isacDetail = isacDetails.get(i).getAsJsonObject();
							if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
									&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("TRADE")) {
								itemLevelDiscount = isacDetail.get("amount").getAsBigDecimal();
							} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
									&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("DBTR")) {
								preTaxValue = isacDetail.get("amount").getAsBigDecimal();
							} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
									&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("SALES")) {

							} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
									&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("CGST")) {
								totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
								getTaxDetailsForBtqCfa(isacDetail,isacDetailList,stInvoiceDetails.getIssuedQuantity());
							} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
									&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("SGST")) {
								totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
								getTaxDetailsForBtqCfa(isacDetail,isacDetailList,stInvoiceDetails.getIssuedQuantity());
							} else if (isacDetail.get("glKey") != null && isacDetail.get("glKey").getAsString() != null
									&& isacDetail.get("glKey").getAsString().equalsIgnoreCase("IGST")) {
								totalTax = totalTax.add(isacDetail.get("amount").getAsBigDecimal());
								getTaxDetailsForBtqCfa(isacDetail,isacDetailList,stInvoiceDetails.getIssuedQuantity());
							}
						}
					}
					Map<String,List<IsacDetailsDto>> isacDetailsObj=new HashMap<>();
					isacDetailsObj.put("IsacDetails", isacDetailList);
					JsonData data=new JsonData();
					data.setType("ISAC_DETAILS");
					data.setData(isacDetailsObj);		
					historyInvoiceItemDto.setIsacDetails(data);
				}
				
			}
			historyInvoiceItemDto.setMfgDate(stInvoiceDetails.getStockInvoice().getSrcDocDate());

			historyInvoiceItemDto.setPricePerUnit(stInvoiceDetails.getStdValue());
			historyInvoiceItemDto.setValue(stInvoiceDetails.getNetValue());
			historyInvoiceItemDto.setItemLevelDiscount(itemLevelDiscount);
			historyInvoiceItemDto.setPreTaxValue(preTaxValue);
			// qty can be more than 1 , so tax * qty
			if (stInvoice.getInvoiceType().equals(StockInvoiceHistoryTypeEnum.CFA_BTQ.name()) || 
					stInvoice.getInvoiceType().equals(StockInvoiceHistoryTypeEnum.BTQ_CFA.name())) {
				historyInvoiceItemDto
						.setTotalTax(totalTax);
				historyInvoiceItemDto.setFinalValue((historyInvoiceItemDto.getStdValue().multiply(new BigDecimal(stInvoiceDetails.getReceivedQuantity())))
						.subtract(itemLevelDiscount)
						.add(historyInvoiceItemDto.getTotalTax()).setScale(0, RoundingMode.HALF_UP)); 
			} else {
				if (!StringUtils.isEmpty(stInvoiceDetails.getTaxDetails())) {
					JsonObject taxValueDetails = new JsonParser().parse(stInvoiceDetails.getTaxDetails())
							.getAsJsonObject();
					BigDecimal igstVal = taxValueDetails.getAsJsonObject("data").get("IGSTVal").getAsBigDecimal();
					BigDecimal cgstVal = taxValueDetails.getAsJsonObject("data").get("CGSTVal").getAsBigDecimal();
					BigDecimal sgstVal = taxValueDetails.getAsJsonObject("data").get("SGSTVal").getAsBigDecimal();
					BigDecimal utgstVal = taxValueDetails.getAsJsonObject("data").get("UTGSTVal").getAsBigDecimal();
					BigDecimal finalTax = igstVal.add(cgstVal).add(sgstVal).add(utgstVal);
					historyInvoiceItemDto.setTotalTax(finalTax.setScale(2, RoundingMode.HALF_UP)
							.multiply(new BigDecimal(stInvoiceDetails.getReceivedQuantity())));
					historyInvoiceItemDto.setFinalValue(
							stInvoiceDetails.getStdValue().add(finalTax).setScale(2, RoundingMode.HALF_UP));
				}
			}
			historyInvoiceItemDtoList.add(historyInvoiceItemDto);
		}

		return new PagedRestResponse<>(historyInvoiceItemDtoList, stockInvoiceDetailsPage);
	}

	private void getTaxDetailsForBtqCfa(JsonObject isacDetail, List<IsacDetailsDto> isacDetailList, Short issuedQuantity) {
		IsacDetailsDto taxDetail=new IsacDetailsDto();
		taxDetail.setLineDtlCount(isacDetail.get("lineDtlCount")!=null ?isacDetail.get("lineDtlCount").getAsInt():null);
		taxDetail.setGlKey(isacDetail.get("glKey")!=null? isacDetail.get("glKey").getAsString():null);
		taxDetail.setDcInd(isacDetail.get("dcInd")!=null? isacDetail.get("dcInd").getAsString():null);
		taxDetail.setPercentage(isacDetail.get("percentage")!=null? isacDetail.get("percentage").getAsBigDecimal():BigDecimal.ZERO);
		if(isacDetail.get("amount")!= null && isacDetail.get("amount").getAsBigDecimal().compareTo(BigDecimal.ZERO)>0) {
			 BigDecimal amount = isacDetail.get("amount").getAsBigDecimal();
			 BigDecimal totalQty = new BigDecimal(issuedQuantity);
			 taxDetail.setAmount(amount.divide(totalQty, 2, RoundingMode.HALF_UP));
		} else {
			taxDetail.setAmount(BigDecimal.ZERO);
		}
		isacDetailList.add(taxDetail);
		
		
	}

	private PagedRestResponse<List<HistoryInvoiceItemDto>> getInvoiceItemsList(Integer invoiceId,
			HistoryInvoiceItemRequestDto historyInvoiceItemRequestDto, Pageable pageable,
			Map<String, String> productGroupMap, Map<String, String> productCategoryMap,
			List<HistoryInvoiceItemDto> historyInvoiceItemDtoList, String actionType, String invoiceType) {
		Page<StockInvoiceDetailsDao> stockInvoiceDetailsPage = null;
		StockInvoiceDao stockInvoiceDao = getStockInvoiceObject(invoiceId, invoiceType, actionType);
		stockInvoiceDetailsPage = invoiceService.listInvoiceItems(stockInvoiceDao,
				historyInvoiceItemRequestDto.getItemCode(), historyInvoiceItemRequestDto.getProductGroup(),
				historyInvoiceItemRequestDto.getProductCategory(), historyInvoiceItemRequestDto.getLotNumber(),
				historyInvoiceItemRequestDto.getBinCode(), historyInvoiceItemRequestDto.getBinGroupCode(),
				stockInvoiceDao.getStatus(), pageable);
		return createInvoiceItemsListObject(productGroupMap, productCategoryMap, stockInvoiceDetailsPage,
				historyInvoiceItemDtoList, stockInvoiceDao);

	}

	private String getLocationDescription(String locationCode) {
		return engineService.getLocationDetail(locationCode).getDescription();

	}

	private StoreDetails getSrcDestDetails(String locationCode) {
		return engineService.getLocationDetail(locationCode).getStoreDetails();

	}

	private Date getStartDateBasedOnInput(String dateRangeType, Date startDate, Date endDate, Date startingDate) {
		if (DateEnum.TODAY.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.getTodayStartDateAndTime();
		} else if (DateEnum.LAST_WEEK.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, -1, null, null);
		} else if (DateEnum.LAST_MONTH.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, null, -1, null);
		} else if (DateEnum.LAST_YEAR.toString().equals(dateRangeType)) {
			startingDate = CalendarUtils.addTimeToCurrentTime(null, null, null, null, null, -1);
		} else if (DateEnum.CUSTOM.toString().equals(dateRangeType)) {
			if (startDate == null || endDate == null) {
				throw new ServiceException(START_DATE_AND_END_DATE_NOT_NULL, ERR_CORE_052);
			}
			startingDate = startDate;
		}
		return startingDate;
	}

	@Override
	public PagedRestResponse<List<HistoryOtherReceiveStockDto>> listStockTransaction(String transactionType,
			HistoryTransactionRequestDto historyTransactionRequestDto, Pageable pageable) {
		List<HistoryOtherReceiveStockDto> historyOtherReceiveStockDtoList = new ArrayList<>();
		Date startingDate = null;
		Date endingDate = new Date();
		startingDate = getStartDateBasedOnInput(historyTransactionRequestDto.getDateRangeType(),
				historyTransactionRequestDto.getStartDate(), historyTransactionRequestDto.getEndDate(), startingDate);
		if (DateEnum.CUSTOM.toString().equals(historyTransactionRequestDto.getDateRangeType())) {
			endingDate = historyTransactionRequestDto.getEndDate();
		}
		Page<StockTransactionDao> stTransactionPage = getStockTransactionDetails(transactionType,
				historyTransactionRequestDto, pageable, CalendarUtils.getStartOfDay(startingDate),
				CalendarUtils.getEndOfDay(endingDate));
		for (StockTransactionDao stTransaction : stTransactionPage) {
			historyOtherReceiveStockDtoList.add(generateOtherReceiveStockDto(stTransaction));
		}
		return new PagedRestResponse<>(historyOtherReceiveStockDtoList, stTransactionPage);
	}

	private Page<StockTransactionDao> getStockTransactionDetails(String transactionType,
			HistoryTransactionRequestDto historyTransactionRequestDto, Pageable pageable, Date startingDate,
			Date endingDate) {
		Page<StockTransactionDao> stTransactionPage = null;
		List<String> statuses = (historyTransactionRequestDto.getStatuses().isEmpty())
				? StockTransactionHistoryStatusEnum.getAllStatus()
				: historyTransactionRequestDto.getStatuses();
		if (ActionTypeEnum.ISSUE.toString().equals(historyTransactionRequestDto.getActionType())) {
			stTransactionPage = stockTransactionService.listStockTransactionIssueHistory(transactionType,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), historyTransactionRequestDto,
					startingDate, endingDate, statuses, pageable);
		} else if (ActionTypeEnum.RECEIVE.toString().equals(historyTransactionRequestDto.getActionType())) {
			stTransactionPage = stockTransactionService.listStockTransactionReceiveHistory(transactionType,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), historyTransactionRequestDto,
					startingDate, endingDate, statuses, pageable);
		}
		return stTransactionPage;
	}

	private HistoryOtherReceiveStockDto generateOtherReceiveStockDto(StockTransactionDao stTransaction) {
		HistoryOtherReceiveStockDto historyOtherReceiveStockDto = (HistoryOtherReceiveStockDto) MapperUtil
				.getDtoMapping(stTransaction, HistoryOtherReceiveStockDto.class);
		historyOtherReceiveStockDto.setCarrierDetails(MapperUtil.getJsonFromString(stTransaction.getCarrierDetails()));
		if (StockTransactionHistoryStatusEnum.ISSUED.toString().equals(stTransaction.getStatus())
				|| StockTransactionHistoryStatusEnum.COMPLETED.toString().equals(stTransaction.getStatus())) {
			historyOtherReceiveStockDto.setTotalMeasuredQuantity(stTransaction.getTotalIssuedQuantity());
			historyOtherReceiveStockDto.setTotalMeasuredWeight(stTransaction.getTotalIssuedWeight());
			historyOtherReceiveStockDto.setTotalMeasuredValue(stTransaction.getTotalIssuedValue());
			historyOtherReceiveStockDto.setSrcDocDate(stTransaction.getIssuedDocDate());
			historyOtherReceiveStockDto.setSrcDocNo(stTransaction.getIssuedDocNo());
			historyOtherReceiveStockDto.setSrcFiscalYear(stTransaction.getIssuedFiscalYear());
			historyOtherReceiveStockDto.setRemarks(stTransaction.getIssuedRemarks());
		} else if (StockTransactionHistoryStatusEnum.RECEIVED.toString().equals(stTransaction.getStatus())) {
			historyOtherReceiveStockDto.setTotalMeasuredQuantity(stTransaction.getTotalReceivedQuantity());
			historyOtherReceiveStockDto.setTotalMeasuredWeight(stTransaction.getTotalReceivedWeight());
			historyOtherReceiveStockDto.setTotalMeasuredValue(stTransaction.getTotalReceivedValue());
			historyOtherReceiveStockDto.setDestDocDate(stTransaction.getReceivedDocDate());
			historyOtherReceiveStockDto.setDestDocNo(stTransaction.getReceivedDocNo());
			historyOtherReceiveStockDto.setDestFiscalYear(stTransaction.getReceivedFiscalYear());
			historyOtherReceiveStockDto.setRemarks(stTransaction.getReceivedRemarks());
		} else if (StockTransactionHistoryStatusEnum.PUBLISHED.toString().equals(stTransaction.getStatus())) {
			historyOtherReceiveStockDto.setTotalMeasuredQuantity(stTransaction.getTotalIssuedQuantity());
			historyOtherReceiveStockDto.setTotalMeasuredWeight(stTransaction.getTotalIssuedWeight());
			historyOtherReceiveStockDto.setTotalMeasuredValue(stTransaction.getTotalIssuedValue());
			historyOtherReceiveStockDto.setSrcDocDate(stTransaction.getIssuedDocDate());
			historyOtherReceiveStockDto.setSrcDocNo(stTransaction.getIssuedDocNo());
			historyOtherReceiveStockDto.setSrcFiscalYear(stTransaction.getIssuedFiscalYear());
			historyOtherReceiveStockDto.setRemarks(stTransaction.getIssuedRemarks());
			historyOtherReceiveStockDto.setTotalMeasuredQuantity(stTransaction.getTotalReceivedQuantity());
			historyOtherReceiveStockDto.setTotalMeasuredWeight(stTransaction.getTotalReceivedWeight());
			historyOtherReceiveStockDto.setTotalMeasuredValue(stTransaction.getTotalReceivedValue());
			historyOtherReceiveStockDto.setDestDocDate(stTransaction.getReceivedDocDate());
			historyOtherReceiveStockDto.setDestDocNo(stTransaction.getReceivedDocNo());
		}
		historyOtherReceiveStockDto.setOtherDetails(MapperUtil.getJsonFromString(stTransaction.getOtherDetails()));
		historyOtherReceiveStockDto.setLocationCodeDescription(getLocationDescription(stTransaction.getLocationCode()));
		if (stTransaction.getStockRequestId() != null) {
			StockRequestDao stRequestDao = stockRequestService.findById(stTransaction.getStockRequestId());
			historyOtherReceiveStockDto.setReqDocNo(stRequestDao.getReqDocNo());
			historyOtherReceiveStockDto.setReqDocDate(stRequestDao.getReqDocDate());
		}
		if (stTransaction.getPrevTransaction() != null) {
			historyOtherReceiveStockDto.setPrevTransaction(stTransaction.getPrevTransaction().getId());
		}
		return historyOtherReceiveStockDto;
	}

	@Override
	public PagedRestResponse<List<OtherReceiveStockItemDto>> listStockTransactionItems(Integer id,
			String transactionType, HistoryTransactionItemRequestDto historyTransactionItemRequestDto,
			Pageable pageable) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		StockTransactionDao stTransaction = getStockTransactionObject(id, transactionType);
		Page<StockTransactionDetailsDao> stTransactionDetailsPage = stockTransactionService
				.listStockTransactionItemHistory(stTransaction, historyTransactionItemRequestDto, pageable);
		List<OtherReceiveStockItemDto> otherReceiveStockItemDtoList = generateOtherReceiveStockItemDto(productGroupList,
				productCategoryList, stTransactionDetailsPage, stTransaction);
		return new PagedRestResponse<>(otherReceiveStockItemDtoList, stTransactionDetailsPage);
	}

	private List<OtherReceiveStockItemDto> generateOtherReceiveStockItemDto(Map<String, String> productGroupList,
			Map<String, String> productCategoryList, Page<StockTransactionDetailsDao> stTransactionDetailsPage,
			StockTransactionDao stTransaction) {
		List<OtherReceiveStockItemDto> otherReceiveStockItemDtoList = new ArrayList<>();
		for (StockTransactionDetailsDao stockTransactionDetails : stTransactionDetailsPage) {
			OtherReceiveStockItemDto otherReceiveStockItemDto = stockTransactionItemDetailsList(productGroupList,
					productCategoryList, stTransaction, stockTransactionDetails);
			otherReceiveStockItemDtoList.add(otherReceiveStockItemDto);
		}
		return otherReceiveStockItemDtoList;
	}

	private OtherReceiveStockItemDto stockTransactionItemDetailsList(Map<String, String> productGroupList,
			Map<String, String> productCategoryList, StockTransactionDao stTransaction,
			StockTransactionDetailsDao stockTransactionDetails) {
		OtherReceiveStockItemDto otherReceiveStockItemDto = (OtherReceiveStockItemDto) MapperUtil
				.getDtoMapping(stockTransactionDetails, OtherReceiveStockItemDto.class);
		otherReceiveStockItemDto.setItemDetails(MapperUtil.getJsonFromString(stockTransactionDetails.getItemDetails()));
		if (StockTransactionHistoryStatusEnum.ISSUED.toString().equals(stTransaction.getStatus())
				|| StockTransactionHistoryStatusEnum.COMPLETED.toString().equals(stTransaction.getStatus())) {
			otherReceiveStockItemDto.setMeasuredQuantity(stockTransactionDetails.getIssuedQuantity());
			otherReceiveStockItemDto.setMeasuredValue(stockTransactionDetails.getIssuedValue());
			otherReceiveStockItemDto.setMeasuredWeight(stockTransactionDetails.getIssuedWeight());
		} else if (StockTransactionHistoryStatusEnum.RECEIVED.toString().equals(stTransaction.getStatus())) {
			otherReceiveStockItemDto.setMeasuredQuantity(stockTransactionDetails.getReceivedQuantity());
			otherReceiveStockItemDto.setMeasuredValue(stockTransactionDetails.getReceivedValue());
			otherReceiveStockItemDto.setMeasuredWeight(stockTransactionDetails.getReceivedWeight());
		}
		otherReceiveStockItemDto.setProductCategory(stockTransactionDetails.getProductCategory());
		otherReceiveStockItemDto
				.setProductCategoryDesc(productCategoryList.get(stockTransactionDetails.getProductCategory()));
		otherReceiveStockItemDto.setProductGroup(stockTransactionDetails.getProductGroup());
		otherReceiveStockItemDto.setProductGroupDesc(productGroupList.get(stockTransactionDetails.getProductGroup()));
		otherReceiveStockItemDto.setDestBinCode(stockTransactionDetails.getReceivedBinCode());
		otherReceiveStockItemDto.setBinCode(stockTransactionDetails.getIssuedBinCode());
		otherReceiveStockItemDto.setBinGroupCode(stockTransactionDetails.getBinGroupCode());
		otherReceiveStockItemDto
				.setImageURL(new URLUtil().getImageUrlByItemCode(stockTransactionDetails.getItemCode()));
		otherReceiveStockItemDto.setReceivedWeight(stockTransactionDetails.getReceivedWeight());

		if (stockTransactionDetails.getItemDetails() != null) {
			JsonReader reader = new JsonReader(new StringReader(stockTransactionDetails.getItemDetails()));
			reader.setLenient(true);
			JsonObject jsonObject = new JsonParser().parse(reader).getAsJsonObject();
			if (jsonObject.get("data") != null) {
				JsonObject json = jsonObject.get("data").getAsJsonObject();
				if (json.get("isHallMarking") != null) {
					otherReceiveStockItemDto.setIsHallmarked(json.get("isHallMarking").getAsBoolean());
				}
			}
		}

		return otherReceiveStockItemDto;
	}

	@Override
	public HistoryReceiveStockDto getStockTransfer(Integer id, String transferType, String actionType) {
		StockTransferDao stTransfer = getStockTransferBasedOnIdAndLocationCode(id, actionType, transferType);
		return generateReceiveStockDto(stTransfer);
	}

	private StockTransferDao getStockTransferBasedOnIdAndLocationCode(Integer id, String actionType,
			String transferType) {
		// define a new object or sonar gives warning for null pointer
		StockTransferDao stTransfer = new StockTransferDao();
		if (CustomSecurityPrincipal.getSecurityPrincipal().isAStoreUser()) {
			if (ActionTypeEnum.ISSUE.toString().equals(actionType))
				stTransfer = stockTransferService.findStockTransferByIdAndSrcLocationCodeAndTransferType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), transferType);
			else if (ActionTypeEnum.RECEIVE.toString().equals(actionType))
				stTransfer = stockTransferService.findStockTransferByIdAndDestLocationCodeAndTransferType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), transferType);
		} else {
			stTransfer = stockTransferService.findStockTransferById(id);
		}
		return stTransfer;
	}

	@Override
	public HistoryIssueDto getStockRequest(Integer id, String requestType, String actionType) {
		StockRequestDao stockRequestDao = getStockReuqestObjectBasedOnIdAndLocationCode(id, actionType, requestType);
		return generateIssueStockDto(stockRequestDao);
	}

	private StockRequestDao getStockReuqestObjectBasedOnIdAndLocationCode(Integer id, String actionType,
			String requestType) {
		// create an object or null pointer warning is coming in sonar
		StockRequestDao stockRequestDao = new StockRequestDao();
		Optional<StockRequestDao> stRequestOptional = null;
		if (CustomSecurityPrincipal.getSecurityPrincipal().isAStoreUser()) {
			if (ActionTypeEnum.ISSUE.toString().equals(actionType)) {
				stockRequestDao = stockRequestService.findStockRequestByIdAndSrcLocationCodeAndRequestType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), requestType);
			} else if (ActionTypeEnum.RECEIVE.toString().equals(actionType)) {
				stockRequestDao = stockRequestService.findStockReuqestByIdAndDestLocationCodeAndRequestType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), requestType);
			}
		} else {
			stRequestOptional = stockRequestService.findStockRequestById(id);
			if (stRequestOptional.isPresent())
				stockRequestDao = stRequestOptional.get();
		}

		return stockRequestDao;
	}

	@Override
	public HistoryInvoiceDto getStockInvoice(Integer id, String invoiceType, String actionType) {
		StockInvoiceDao stockInvoice = getStockInvoiceObject(id, invoiceType, actionType);
		return createHistoryInvoiceData(stockInvoice.getInvoiceType(), stockInvoice);
	}

	private StockInvoiceDao getStockInvoiceObject(Integer id, String invoiceType, String actionType) {
		// define a new object or null pointer warning is showing in sonar
		StockInvoiceDao stockInvoice = new StockInvoiceDao();
		if (CustomSecurityPrincipal.getSecurityPrincipal().isAStoreUser()) {
			if (ActionTypeEnum.ISSUE.toString().equals(actionType))
				stockInvoice = invoiceService.findByIdAndSrcLocationCodeAndInvoiceType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), invoiceType);
			else if (ActionTypeEnum.RECEIVE.toString().equals(actionType))
				stockInvoice = invoiceService.findByIdAndDestLocationCodeAndInvoiceType(id,
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), invoiceType);
		} else {
			stockInvoice = invoiceService.findById(id);
		}
		return stockInvoice;
	}

	@Override
	public HistoryOtherReceiveStockDto getStockTransaction(Integer id, String transactionType) {
		StockTransactionDao stTransaction = getStockTransactionObject(id, transactionType);
		return generateOtherReceiveStockDto(stTransaction);
	}

	private StockTransactionDao getStockTransactionObject(Integer id, String transactionType) {
		StockTransactionDao stTransaction = null;
		if (CustomSecurityPrincipal.getSecurityPrincipal().isAStoreUser()) {
			stTransaction = stockTransactionService.findStockTransactionByIdAndLocationCodeAndTransactionType(id,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), transactionType);
		} else {
			stTransaction = stockTransactionService.findStockTransactionById(id);
		}
		return stTransaction;
	}

	@Override
	public PagedRestResponse<List<HistoryInvoiceDto>> listStockInvoice(String invoiceType,
			HistoryInvoiceRequestDto historyInvoiceRequestDto, Pageable pageable) {
		Date startingDate = null;
		Date endingDate = new Date();
		List<HistoryInvoiceDto> historyInvoiceDtoList = new ArrayList<>();
		startingDate = getStartDateBasedOnInput(historyInvoiceRequestDto.getDateRangeType(),
				historyInvoiceRequestDto.getStartDate(), historyInvoiceRequestDto.getEndDate(), startingDate);
		if (DateEnum.CUSTOM.toString().equals(historyInvoiceRequestDto.getDateRangeType())) {
			endingDate = historyInvoiceRequestDto.getEndDate();
		}
		Page<StockInvoiceDao> stockInvoicePageData = getStockInvoicePage(invoiceType, historyInvoiceRequestDto,
				pageable, startingDate, endingDate);
		return new PagedRestResponse<>(
				createHistoryStockInvoiceList(invoiceType, stockInvoicePageData, historyInvoiceDtoList),
				stockInvoicePageData);
	}

	private Page<StockInvoiceDao> getStockInvoicePage(String invoiceType,
			HistoryInvoiceRequestDto historyInvoiceRequestDto, Pageable pageable, Date startingDate, Date endingDate) {
		Page<StockInvoiceDao> stockInvoicePageData = null;
		List<String> statuses = (historyInvoiceRequestDto.getStatuses().isEmpty())
				? StockInvoiceHistoryStatusEnum.getAllStatus()
				: historyInvoiceRequestDto.getStatuses();
		if (ActionTypeEnum.ISSUE.toString().equals(historyInvoiceRequestDto.getActionType())) {
			stockInvoicePageData = invoiceService.listReturnInvoiceHistory(invoiceType,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), historyInvoiceRequestDto,
					startingDate, endingDate, statuses, pageable);
		} else if (ActionTypeEnum.RECEIVE.toString().equals(historyInvoiceRequestDto.getActionType())) {
			stockInvoicePageData = invoiceService.listPurchaseInvoiceHistory(invoiceType,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), historyInvoiceRequestDto,
					startingDate, endingDate, statuses, pageable);
		}
		return stockInvoicePageData;
	}

	private List<HistoryInvoiceDto> createHistoryStockInvoiceList(String invoiceType,
			Page<StockInvoiceDao> stockInvoicePageData, List<HistoryInvoiceDto> historyInvoiceDtoList) {
		for (StockInvoiceDao stockInvoice : stockInvoicePageData) {
			historyInvoiceDtoList.add(createHistoryInvoiceData(invoiceType, stockInvoice));
		}
		return historyInvoiceDtoList;
	}

	private HistoryInvoiceDto createHistoryInvoiceData(String invoiceType, StockInvoiceDao stockInvoice) {
		HistoryInvoiceDto historyInvoiceDto = (HistoryInvoiceDto) MapperUtil.getDtoMapping(stockInvoice,
				HistoryInvoiceDto.class);

		if (StockInvoiceHistoryTypeEnum.CFA_BTQ.toString().equals(invoiceType)) {
			historyInvoiceDto.setRemarks(stockInvoice.getReceivedRemarks());
			historyInvoiceDto.setDestFiscalyear(stockInvoice.getDestFiscalYear());
			historyInvoiceDto.setTotalMeasuredQuantity(stockInvoice.getTotalReceivedQuantity());
			historyInvoiceDto.setTotalMeasuredWeight(stockInvoice.getTotalReceivedWeight());
			historyInvoiceDto.setTotalMeasuredValue(stockInvoice.getTotalReceivedValue());
			historyInvoiceDto.setTotalAvailableQuantity(stockInvoice.getTotalIssuedQuantity());
			historyInvoiceDto.setTotalAvailableValue(stockInvoice.getTotalIssuedValue());
			historyInvoiceDto.setTotalAvailableWeight(stockInvoice.getTotalIssuedWeight());
			if (stockInvoice.getTotalTax() != null && stockInvoice.getTotalDiscount() != null) {
				historyInvoiceDto
						.setTotalValue((stockInvoice.getTotalIssuedValue().subtract(stockInvoice.getTotalDiscount())
								.add(stockInvoice.getTotalTax())).setScale(0, RoundingMode.HALF_UP));
			} else {
				// tax or discount might be null
				historyInvoiceDto
						.setTotalValue((stockInvoice.getTotalIssuedValue().subtract(stockInvoice.getTotalDiscount()))
								.setScale(0, RoundingMode.HALF_UP));
			}

		} else if (StockInvoiceHistoryTypeEnum.getPurchaseInvoiceType().contains(invoiceType)) {
			historyInvoiceDto.setRemarks(stockInvoice.getIssuedRemarks());
			historyInvoiceDto.setSrcFiscalYear(Integer.valueOf((stockInvoice.getSrcFiscalYear())));
			historyInvoiceDto.setTotalMeasuredQuantity(stockInvoice.getTotalIssuedQuantity());
			historyInvoiceDto.setTotalMeasuredWeight(stockInvoice.getTotalIssuedWeight());
			historyInvoiceDto.setTotalMeasuredValue(stockInvoice.getTotalIssuedValue());
		}
		historyInvoiceDto.setTotalDiscount(stockInvoice.getTotalDiscount());
		historyInvoiceDto.setCarrierDetails(MapperUtil.getJsonFromString(stockInvoice.getCarrierDetails()));
		historyInvoiceDto.setSrcLocationDescription(getLocationDescription(stockInvoice.getSrcLocationCode()));
		historyInvoiceDto.setDestLocationDescription(getLocationDescription(stockInvoice.getDestLocationCode()));
		historyInvoiceDto.setSrcDetails(getSrcDestDetails(stockInvoice.getSrcLocationCode()));
		historyInvoiceDto.setDestDetails(getSrcDestDetails(stockInvoice.getDestLocationCode()));
		historyInvoiceDto.setFilePublish(stockInvoice.getFilePublished());
		historyInvoiceDto.setReqDocDate(null);
		historyInvoiceDto.setReqDocNo(null);
		return historyInvoiceDto;
	}

	@Override
	public PagedRestResponse<List<HistoryBinRequestDto>> listBinRequest(HistoryRequestBinDto historyRequestBinDto,
			Pageable pageable) {
		Date startingDate = null;
		Date endingDate = new Date();
		startingDate = getStartDateBasedOnInput(historyRequestBinDto.getDateRangeType(),
				historyRequestBinDto.getStartDate(), historyRequestBinDto.getEndDate(), startingDate);

		if (DateEnum.CUSTOM.toString().equals(historyRequestBinDto.getDateRangeType())) {
			endingDate = historyRequestBinDto.getEndDate();
		}
		Page<BinRequestDao> binRequestPage = getBinRequestList(startingDate, endingDate, historyRequestBinDto,
				pageable);

		return listBinRequestHistory(binRequestPage);
	}

	private Page<BinRequestDao> getBinRequestList(Date startDate, Date endDate,
			HistoryRequestBinDto historyRequestBinDto, Pageable pageable) {
		List<String> statuses = (historyRequestBinDto.getStatuses().isEmpty()) ? BinRequestHistoryEnum.getAllStatus()
				: historyRequestBinDto.getStatuses();
		return binRequestService.listBinRequestHistory(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				startDate, endDate, statuses, historyRequestBinDto, pageable);
	}

	private PagedRestResponse<List<HistoryBinRequestDto>> listBinRequestHistory(Page<BinRequestDao> binRequestPage) {
		List<HistoryBinRequestDto> historyBinRequestDtos = new ArrayList<>();
		binRequestPage.forEach(binRequestDao -> {
			HistoryBinRequestDto historyBinRequestDto = (HistoryBinRequestDto) MapperUtil.getDtoMapping(binRequestDao,
					HistoryBinRequestDto.class);
			historyBinRequestDtos.add(historyBinRequestDto);
		});
		return new PagedRestResponse<>(historyBinRequestDtos, binRequestPage);
	}

	@Override
	public HistoryConversionItemsDto listConversionItems(Integer id) {
		HistoryConversionItemsDto historyConversionItemsDto = new HistoryConversionItemsDto();
		// get product group list & product category list by calling product service
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		StockTransactionDao stTransactionDao = stockTransactionService.findStockTransactionById(id);
		List<StockTransactionDetailsDao> stTransactionDetailsListDao = stockTransactionService
				.findAllStockTransactionDetails(stTransactionDao);
		// get child items data
		List<OtherReceiveStockItemDto> childItemsDetails = conversionItemsList(productGroupList, productCategoryList,
				stTransactionDetailsListDao, stTransactionDao);
		// get parent item data
		stTransactionDao = stTransactionDao.getPrevTransaction();
		stTransactionDetailsListDao = stockTransactionService.findAllStockTransactionDetails(stTransactionDao);
		// prepare the data for stock transaction item details
		historyConversionItemsDto.setChildItems(childItemsDetails);
		List<OtherReceiveStockItemDto> parentItemDetails = conversionItemsList(productGroupList, productCategoryList,
				stTransactionDetailsListDao, stTransactionDao);
		historyConversionItemsDto.setParentItem(parentItemDetails.get(0));
		return historyConversionItemsDto;
	}

	private List<OtherReceiveStockItemDto> conversionItemsList(Map<String, String> productGroupList,
			Map<String, String> productCategoryList, List<StockTransactionDetailsDao> stTransactionDetailsListDao,
			StockTransactionDao stTransactionDao) {
		List<OtherReceiveStockItemDto> itemsList = new ArrayList<>();
		stTransactionDetailsListDao.forEach(stTransactionDetailsDao -> {
			OtherReceiveStockItemDto otherReceiveStockItemDto = stockTransactionItemDetailsList(productGroupList,
					productCategoryList, stTransactionDao, stTransactionDetailsDao);
			itemsList.add(otherReceiveStockItemDto);
		});
		return itemsList;
	}

}
