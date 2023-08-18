/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationResponseDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
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
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dao.StockTransferDetailsDao;
import com.titan.poss.inventory.dao.SyncStaging;
import com.titan.poss.inventory.dto.InventoryDetailsSyncDtoExt;
import com.titan.poss.inventory.dto.ItemsParamListDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.OtherIssueRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.OtherRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.OtherTransactionRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.OtherTransferRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.ReturnInvoiceStatus;
import com.titan.poss.inventory.dto.constants.StockIssueRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.StockIssueTransferTypeEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.StockRequestTypeEnum;
import com.titan.poss.inventory.dto.request.OtherRequestItemCreateDto;
import com.titan.poss.inventory.dto.request.OtherRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.OtherRequestItemsCreateDto;
import com.titan.poss.inventory.dto.request.OtherRequestUpdateDto;
import com.titan.poss.inventory.dto.request.OtherTransactionRequestCreateDto;
import com.titan.poss.inventory.dto.request.RemoveOtherItemsDto;
import com.titan.poss.inventory.dto.request.RequestOtherItemDto;
import com.titan.poss.inventory.dto.request.json.AddressData;
import com.titan.poss.inventory.dto.request.json.ApprovalData;
import com.titan.poss.inventory.dto.request.json.EmployeeData;
import com.titan.poss.inventory.dto.request.json.ItemDetailsData;
import com.titan.poss.inventory.dto.response.IssueStockItemDto;
import com.titan.poss.inventory.dto.response.OtherRequestDto;
import com.titan.poss.inventory.dto.response.OtherRequestItemDto;
import com.titan.poss.inventory.dto.response.QuantityCheckDto;
import com.titan.poss.inventory.dto.response.RequestDtlsInsertResponseDto;
import com.titan.poss.inventory.facade.OtherRequestFacade;
import com.titan.poss.inventory.repository.InventorySyncStagingRepository;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.InventoryDocMasterService;
import com.titan.poss.inventory.service.InventorySyncDataService;
import com.titan.poss.inventory.service.LocationService;
import com.titan.poss.inventory.service.StockRequestService;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Service("otherRequestFacadeService")
public class OtherRequestFacadempl implements OtherRequestFacade {

	private static final Logger LOGGER = LoggerFactory.getLogger(OtherRequestFacadempl.class);
	private static final String ERR_INV_035 = "ERR-INV-035";
	private static final String ERR_INV_014 = "ERR-INV-014";
	private static final String ERR_INV_029 = "ERR-INV-029";
	private static final String ERR_INV_013 = "ERR-INV-013";
	private static final String TOTAL_QUANTITY = "totalQuantity";
	private static final String TOTAL_WEIGHT = "totalWeight";
	private static final String TOTAL_VALUE = "totalValue";
	private static final String RECORD_S_NOT_FOUND = "Record(s) not found";
	private static final String ERR_INV_017 = "ERR-INV-017";
	private static final String ERR_INV_034 = "ERR-INV-034";
	private static final String ERR_INV_043 = "ERR-INV-043";
	private static final String ERR_CORE_013 = "ERR-CORE-013";
	private static final String JSON_FORMAT_ERROR = "JSON data format error";
	private static final String ITEM_NOT_AVAILABLE = "Item Not avaliable any more";
	private static final String ERR_INV_044 = "ERR-INV-044";
	private static final String ERR_INV_057 = "ERR-INV-057";
	private static final String REQUEST_TYPE = "requestType";
	private static final String ERR_INV_064 = "ERR-INV-064";
	public static final BigDecimal ONE_HUNDRED = new BigDecimal(100);

	@Autowired
	private InventorySyncStagingRepository inventorySyncStagingRepository;

	@Autowired
	protected StockRequestService stockRequestService;

	@Autowired
	LocationService locationService;

	@Autowired
	protected InventoryDetailsService inventoryDetailsService;

	@Autowired
	public InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	EngineService engineService;

	@Autowired
	private EngineServiceClient engineClient;

	@Autowired
	private InventorySyncDataService inventorySyncDataService;

	private static final String ISOFFLINE = "isOffline";
	private static final String ISPUBLISHTOEGHS = "isPublishToEGHS";

	@Override
	public PagedRestResponse<List<OtherRequestItemDto>> listOtherRequestItems(Integer requestId, String reqType,
			String itemCode, List<String> productGroupList, List<String> productCategory, String lotNumber,
			List<String> binCode, String status, Pageable pageable) {

		Optional<Order> order = pageable.getSort().get().findFirst();
		List<OtherRequestItemDto> listProductDtls;
		String productGroup = null;
		String binGroup = "";
		if (reqType.equals(OtherTransferRequestTypeEnum.EXH.toString())) {
			binGroup = BinGroupEnum.EXHIBITION.toString();
		} else {
			binGroup = reqType;
		}
		String sortParameter = null;

		StockRequestDao stockRequest = stockRequestService.getStockRequestByIdAndType(requestId, reqType);
		if (stockRequest == null) {
			throw new ServiceException("Incorrect request ID ", ERR_INV_029);
		} else {
			if (!stockRequest.getSrcLocationCode()
					.equals(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode())) {

				throw new ServiceException("No Access : ", ERR_INV_035);
			}
		}
		if (order.isPresent()) {
			sortParameter = order.get().getProperty();
			sortParameter += " " + order.get().getDirection().name();
		}

		ItemsParamListDto params = createParamForJointList(binGroup, requestId, reqType, itemCode, lotNumber,
				productCategory, productGroup, status, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
				sortParameter, productGroupList, binCode);

		List<Object[]> listAvailableItems = stockRequestService.listOtherRequestAvailableItems(params, pageable);
		listProductDtls = setReturnRequestItemDtoFromRequestDetails(listAvailableItems, reqType);
		int pageSize = stockRequestService.findOtherRequestPageSize(params, pageable);

		Page<OtherRequestItemDto> pagedData = new PageImpl<>(listProductDtls,
				PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()), pageSize);

		return new PagedRestResponse<>(listProductDtls, pagedData);

	}

	private List<OtherRequestItemDto> setReturnRequestItemDtoFromRequestDetails(List<Object[]> listAvailableItems,
			String requestType) {
		List<OtherRequestItemDto> listProductDtls = new ArrayList<>();
		LocationResponseDto locationDetails = engineClient.getBoutiqueLocationDetails();
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		for (Object[] l : listAvailableItems) {
			OtherRequestItemDto is = new OtherRequestItemDto();
			is.setInventoryId((String) l[0]);
			is.setId((String) l[1]);
			is.setStatus((String) l[2]);
			is.setItemCode((String) l[3]);
			is.setLotNumber((String) l[4]);
			Short qty = (l[5] == null) ? (short) 0 : (Short) l[5];// totalQuantity
			is.setAvailableQuantity(qty);

			// Short issueQty = (l[20] == null) ? (short) 0 : (Short) l[20];//
			// issuedQuantity

			// No need to subtract here again .. already subtracting in query
			// is.setAvailableQuantity((short) (qty - issueQty));// total- issued quantity

			is.setMeasuredQuantity((Short) l[6]); // detailsTotalQuantity == details requested quantity
			is.setProductCategory((String) l[7]);
			is.setProductGroup((String) l[8]);
			is.setBinCode((String) l[9]);
			is.setBinGroupCode((String) l[10]);
			is.setStdValue((BigDecimal) l[11]); // inventory item value == inventory std value
			is.setStdWeight((BigDecimal) l[12]); // inventory item weight == inventory std weight
			is.setCurrencyCode((String) l[13]);
			is.setWeightUnit((String) l[14]);
			is.setMfgDate((Date) l[15]);
			is.setMeasuredWeight((BigDecimal) l[16]); // detailsMeasuredWeight == details requested quantity
			is.setAvailableWeight((BigDecimal) l[17]); // inventoryTotalweight == inventory totalWeight
			is.setMeasuredValue((BigDecimal) l[18]); // details measured Value
			is.setAvailableValue((BigDecimal) l[19]); // inventory details totalValue
			is.setProductCategoryDesc(productCategoryList.get(l[7]));
			is.setProductGroupDesc(productGroupList.get(l[8]));
			is.setIsHallmarked((Boolean) l[21]);
			LOGGER.debug("hallmark value {}", is.getIsHallmarked());
			is.setItemDetails(MapperUtil.getJsonFromString((String) l[22]));
			// inventory total weight
			if (is.getItemCode() != null) {
				is.setImageURL(new URLUtil().getImageUrlByItemCode(is.getItemCode()));
			}
			if (qty > 0) {
				setOtherRequestTaxDetails(is, (String) l[3], (BigDecimal) l[11], requestType, locationDetails);
				listProductDtls.add(is);
			}

		}
		return listProductDtls;
	}

	private void setOtherRequestTaxDetails(OtherRequestItemDto stockDetailDto, String itemCode, BigDecimal stdValue,
			String requestType, LocationResponseDto locationDetails) {
		TaxCalculationResponseDto taxDetailsResponse = null;
		if ((requestType.equalsIgnoreCase(OtherTransferRequestTypeEnum.LOSS.toString())
				&& !StringUtils.isEmpty(itemCode))) {

			taxDetailsResponse = engineClient.getTaxDetails(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), 0, null,
					TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE_OTHER_ISSUE.name(), itemCode, false, null);
		}

		Map<String, BigDecimal> taxDetails = new HashMap<>();
		Map<String, TaxDetailDto> data = new HashMap<>();
		TaxDetailDto sgstDetails = null;
		if (taxDetailsResponse != null) {
			data = taxDetailsResponse.getData();
			if (!CollectionUtils.isEmpty(data)) {
				if (data.get("SGST") != null) {
					sgstDetails = data.get("SGST");
					if (sgstDetails.getTaxPercentage() != null) {
						taxDetails.put("SGSTVal", stdValue.multiply(sgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
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
									stdValue.multiply(utgstDetails.getTaxPercentage().divide(ONE_HUNDRED)).setScale(2,
											RoundingMode.HALF_UP));
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
						taxDetails.put("CGSTVal", stdValue.multiply(cgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
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
									stdValue.multiply(igstDetails.getTaxPercentage().divide(ONE_HUNDRED)).setScale(2,
											RoundingMode.HALF_UP));
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
		stockDetailDto.setTaxDetails(MapperUtil.getJsonFromString(MapperUtil.getStringFromJson(issueStockTaxDetails)
				.replace("\\", "").replace("\"[", "[").replace("]\"", "]")));
		JsonObject taxValueDetails = new JsonParser()
				.parse(MapperUtil.getStringFromJson(stockDetailDto.getTaxDetails())).getAsJsonObject();
		BigDecimal finalTax = BigDecimal.ZERO;
		if (taxValueDetails != null && taxValueDetails.getAsJsonObject("data") != null) {
			BigDecimal igstVal = BigDecimal.ZERO;
			BigDecimal cgstVal = BigDecimal.ZERO;
			BigDecimal sgstVal = BigDecimal.ZERO;
			BigDecimal utgstVal = BigDecimal.ZERO;
			if (taxValueDetails.getAsJsonObject("data").get("IGSTVal") != null)
				igstVal = taxValueDetails.getAsJsonObject("data").get("IGSTVal").getAsBigDecimal();
			if (taxValueDetails.getAsJsonObject("data").get("CGSTVal") != null)
				cgstVal = taxValueDetails.getAsJsonObject("data").get("CGSTVal").getAsBigDecimal();
			if (taxValueDetails.getAsJsonObject("data").get("SGSTVal") != null)
				sgstVal = taxValueDetails.getAsJsonObject("data").get("SGSTVal").getAsBigDecimal();
			if (taxValueDetails.getAsJsonObject("data").get("UTGSTVal") != null)
				utgstVal = taxValueDetails.getAsJsonObject("data").get("UTGSTVal").getAsBigDecimal();

			finalTax = igstVal.add(cgstVal).add(sgstVal).add(utgstVal);
		}
		stockDetailDto.setTotalTax(finalTax.setScale(2, RoundingMode.HALF_UP));
		finalTax = finalTax.multiply(new BigDecimal(stockDetailDto.getAvailableQuantity()));
		if (stockDetailDto.getAvailableValue() != null) {
			stockDetailDto
					.setFinalValue(stockDetailDto.getAvailableValue().add(finalTax).setScale(2, RoundingMode.HALF_UP));
		}
	}

	private ItemsParamListDto createParamForJointList(String binGroup, Integer requestId, String invoiceType,
			String itemCode, String lotNumber, List<String> productCategory, String productGroup, String status,
			String locationCode, String sortParameter, List<String> productGroupList, List<String> binCodeList) {
		ItemsParamListDto params = new ItemsParamListDto();
		params.setBinGroupCode(binGroup);
		params.setHeaderId(requestId);
		params.setType(invoiceType);
		params.setItemCode(itemCode);
		params.setLotNumber(lotNumber);

		params.setProductCategory(productCategory);
		params.setProductGroup(productGroup);
		params.setStatus(status);
		params.setLocationCode(locationCode);
		params.setSortParameter(sortParameter);

		params.setProductGroupList(productGroupList);

		params.setBinCodeList(binCodeList);

		return params;
	}

	@Override
	public OtherRequestDto createOtherTransactionRequest(String reqType) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		CountryDetailsDto countryDto = getCountryDetails(authUser.getLocationCode());
		StockRequestDao createdOtherRequest;
		StockRequestDao stockRequest = new StockRequestDao();
		List<StockRequestDao> requestList;
		// check for any Request is available in OPEN state if yes then return same..
		requestList = stockRequestService.findAllByRequestTypeAndStatusAndSrcLocationCode(reqType,
				StockRequestStatusEnum.OPEN.toString(), authUser.getLocationCode());
		if (requestList.isEmpty()) {
			stockRequest.setRequestType(reqType);
			stockRequest.setReqLocationCode(authUser.getLocationCode());
			stockRequest.setTotalRequestedQuantity((short) 0);
			stockRequest.setTotalRequestedValue(BigDecimal.ZERO);
			stockRequest.setTotalRequestedWeight(BigDecimal.ZERO);
			stockRequest.setSrcLocationCode(authUser.getLocationCode());
			stockRequest.setDestLocationCode(authUser.getLocationCode());
			stockRequest.setCurrencyCode(countryDto.getCurrencyCode());
			stockRequest.setWeightUnit(countryDto.getWeightUnit());
			stockRequest.setStatus(StockRequestStatusEnum.OPEN.toString());
			stockRequest.setOrgCode(CommonConstants.ORG_CODE);
			createdOtherRequest = stockRequestService.saveStockRequest(stockRequest);
		} else {
			createdOtherRequest = requestList.get(0);
		}
		OtherRequestDto requestDto = (OtherRequestDto) MapperUtil.getDtoMapping(createdOtherRequest,
				OtherRequestDto.class);
		return createRequestDtoResponse(requestDto, createdOtherRequest);

	}

	@Override
	@Transactional
	public OtherRequestDto createOtherTransactionRequest(String reqType,
			OtherTransactionRequestCreateDto otherRequestCreateDto) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		StockRequestDao createdOtherRequest;
		List<StockRequestDetailsDao> stockRequestDetailsList;
		RequestDtlsInsertResponseDto requestDtlsInsertResponseDto;
		// validate for approval json
		// if reqType is PSV/ADJ/FOC
		List<String> inventoryId = new ArrayList<>();
		for (int i = 0; i < otherRequestCreateDto.getItems().size(); i++) {
			inventoryId.add(otherRequestCreateDto.getItems().get(i).getInventoryId());
		}
		if (!OtherTransactionRequestTypeEnum.CONV.toString().equals(reqType)) {
			validateApprovalJson(otherRequestCreateDto.getApprovalDetails().getType(),
					otherRequestCreateDto.getApprovalDetails().getData());
			List<StockRequestDetailsDao> checkStockRequestDetailsList = validateCheckAnotherPSV(inventoryId,
					authUser.getLocationCode());
			if (checkStockRequestDetailsList.size() > 0) {
//				for (StockRequestDetailsDao id : checkStockRequestDetailsList) {
//					System.out.println("Already exists id's " + id.getInventoryId());
//				}
				throw new ServiceException("Re-issuing ADJ/PSV not allowed for similar items", ERR_INV_044,
						Map.of(REQUEST_TYPE, reqType));
			}
		}
		// create new row in stock request table
		createdOtherRequest = insertOtherRequest(otherRequestCreateDto, authUser, reqType);
		// if reqType is CONV
		if (reqType.equals(OtherTransactionRequestTypeEnum.CONV.toString())) {
			// call createConversionRequestDetails() and it creates new row in stock request
			// details table
			// return type is List of stock request details object
			stockRequestDetailsList = createConversionRequestDetails(createdOtherRequest,
					otherRequestCreateDto.getItems());
			// call generateRequestDetailsResponse() and this method sets the value of
			// totalRequestedQuantity,totalRequestedWeight,totalRequestedValue
			// return type RequestDtlsInsertResponseDto object
			requestDtlsInsertResponseDto = generateRequestDetailsResponse(stockRequestDetailsList, reqType,
					createdOtherRequest.getTotalRequestedQuantity(), createdOtherRequest.getTotalRequestedWeight(),
					createdOtherRequest.getTotalRequestedValue());
			createdOtherRequest.setStatus(StockRequestStatusEnum.ACKNOWLEDGE_PENDING.toString());
		} else {
			// if reqType is PSV/ADJ/FOC
			requestDtlsInsertResponseDto = insertOtherRequestDetails(otherRequestCreateDto, createdOtherRequest,
					reqType);
			createdOtherRequest.setStatus(StockRequestStatusEnum.APVL_PENDING.toString());
		}
		CountryDetailsDto countryDto = getCountryDetails(authUser.getLocationCode());
		// set totalRequestedQuantity,totalRequestedWeight,totalRequestedValue to
		// StockRequest object
		createdOtherRequest.setReqDocNo(inventoryDocMasterService.getDocNumber(countryDto.getFiscalYear().shortValue(),
				authUser.getLocationCode(), DocTypeEnum.OTHERREQUEST.toString()));
		createdOtherRequest.setTotalRequestedQuantity(requestDtlsInsertResponseDto.getTotalRequestedQuantity());
		createdOtherRequest.setTotalRequestedWeight(requestDtlsInsertResponseDto.getTotalRequestedWeight());
		createdOtherRequest.setTotalRequestedValue(requestDtlsInsertResponseDto.getTotalRequestedValue());

		stockRequestService.saveStockRequest(createdOtherRequest);

		stockRequestService.updatingTotalWeightAndQuantity(createdOtherRequest.getId(), new Date(),
				authUser.getUsername());

		// Setting the fields in Inventory when Request is Raised
		List<InventoryDetailsDaoExt> inventoryDetailsList = inventoryDetailsService
				.getItemsByIdAndLocationCode(inventoryId);
		List<InventoryDetailsDaoExt> detailsList = new ArrayList<>();
		for (InventoryDetailsDaoExt inv : inventoryDetailsList) {
			inv.setRequestType(reqType);
			for (int i = 0; i < otherRequestCreateDto.getItems().size(); i++) {
				if (otherRequestCreateDto.getItems().get(i).getInventoryId() != null
						&& (otherRequestCreateDto.getItems().get(i).getInventoryId()).equals(inv.getId())) {
					inv.setRequestQuantity(otherRequestCreateDto.getItems().get(i).getQuantity());
				}
			}
			detailsList.add(inv);
		}
		inventoryDetailsService.updateRequestDetailsForInventoryItems(detailsList);
		// convert StockRequest object to OtherRequestDto object
		OtherRequestDto requestDto = (OtherRequestDto) MapperUtil.getDtoMapping(createdOtherRequest,
				OtherRequestDto.class);
		Map<String, Boolean> statusMap = new HashMap<>();
		statusMap.put(ISOFFLINE, false);
		statusMap.put(ISPUBLISHTOEGHS, false);
		inventorySyncDataService.getStatus(statusMap, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		SyncStagingDto stagingDto = updateStockTransferAndStagingForReq(detailsList, createdOtherRequest);
		if (stagingDto != null)
			inventorySyncDataService.deleteStagingAndPublish(statusMap, DestinationType.SELECTIVE.name(), stagingDto);
		return createRequestDtoResponse(requestDto, createdOtherRequest);
	}

	@Transactional
	public SyncStagingDto updateStockTransferAndStagingForReq(List<InventoryDetailsDaoExt> inv,
			StockRequestDao stockRequest) {
		SyncStagingDto otherIssueStagingDto = new SyncStagingDto();
		InventoryDetailsSyncDtoExt invDetlsSyncDto = new InventoryDetailsSyncDtoExt();
		List<SyncData> syncDatas = new ArrayList<>();
		if (!inv.isEmpty()) {
			syncDatas.add(DataSyncUtil.createSyncData(invDetlsSyncDto.getSyncDtoExtList(inv, stockRequest.getId()), 0));
			List<String> destinations = new ArrayList<>();
			destinations.add(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			MessageRequest otherIssueRqst = DataSyncUtil.createMessageRequest(syncDatas,
					InventoryOperationCodes.INV_OTHERREQUEST_POSS_ADD, destinations, MessageType.FIFO.toString(),
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
		return otherIssueStagingDto;
	}

	private List<StockRequestDetailsDao> validateCheckAnotherPSV(List<String> inventoryId, String locationCode) {

		return stockRequestService.listItemsPsv(inventoryId, locationCode);

	}

	private void validateApprovalJson(String approvalType, Object approvalData) {
		List<String> str = new ArrayList<>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		ApprovalData aprvlData = null;

		// if approval type doesn't match then throw exception
		if (!"approval".equals(approvalType))
			throw new ServiceException("JSON type : " + approvalType + " doesn't match", "ERR-CORE-014");

		aprvlData = MapperUtil.getObjectMapperInstance().convertValue(approvalData, ApprovalData.class);
		// validate approval type
		Set<ConstraintViolation<ApprovalData>> violationsApvl = validator.validate(aprvlData);
		violationsApvl.forEach(violation -> str.add(violation.getMessage()));
		if (!violationsApvl.isEmpty())
			throw new ServiceException(JSON_FORMAT_ERROR, ERR_CORE_013, str);

	}

	private StockRequestDao insertOtherRequest(OtherTransactionRequestCreateDto otherRequestCreateDto,
			AuthUser authUser, String reqType) {
		CountryDetailsDto countryDto = getCountryDetails(authUser.getLocationCode());
		BusinessDayDto businessDayDto = getBusinessDay(authUser.getLocationCode());
		StockRequestDao createOtherRequest = new StockRequestDao();
		createOtherRequest.setTotalAcceptedQuantity((short) 0);
		createOtherRequest.setAcceptedDate(new Date());
		createOtherRequest.setApprovedDate(new Date());
		createOtherRequest.setTotalApprovedQuantity((short) 0);
		createOtherRequest.setRequestType(reqType);
		createOtherRequest.setReqFiscalYear(countryDto.getFiscalYear().shortValue());
		createOtherRequest.setReqLocationCode(authUser.getLocationCode());
		createOtherRequest.setReqDocDate(businessDayDto.getBusinessDate());
		createOtherRequest.setSrcLocationCode(authUser.getLocationCode());
		createOtherRequest.setDestLocationCode(authUser.getLocationCode());
		createOtherRequest.setTotalRequestedQuantity((short) 0);
		createOtherRequest.setTotalRequestedValue(BigDecimal.ZERO);
		createOtherRequest.setTotalRequestedWeight(BigDecimal.ZERO);
		createOtherRequest.setCurrencyCode(countryDto.getCurrencyCode());
		createOtherRequest.setWeightUnit(countryDto.getWeightUnit());
		createOtherRequest.setOrgCode(CommonConstants.ORG_CODE);
		createOtherRequest.setRequestRemarks(otherRequestCreateDto.getRemarks());
		if (!OtherTransactionRequestTypeEnum.CONV.toString().equalsIgnoreCase(reqType)) {
			createOtherRequest
					.setOtherDetails(MapperUtil.getStringFromJson(otherRequestCreateDto.getApprovalDetails()));
		}
		if (OtherTransactionRequestTypeEnum.CONV.toString().equalsIgnoreCase(reqType)
				&& otherRequestCreateDto.getOtherDetails() != null) {
			createOtherRequest.setOtherDetails(MapperUtil.getStringFromJson(otherRequestCreateDto.getOtherDetails()));
		}
		createOtherRequest.setStatus(StockRequestStatusEnum.OPEN.toString());
		return stockRequestService.saveStockRequest(createOtherRequest);
	}

	private RequestDtlsInsertResponseDto insertOtherRequestDetails(
			OtherTransactionRequestCreateDto otherRequestCreateDto, StockRequestDao createdOtherRequest,
			String reqType) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<String> itemNotAvailable = new ArrayList<>();
		List<StockRequestDetailsDao> requestDetailList = new ArrayList<>();
		Short totalRequestedQuantity = 0;
		BigDecimal totalRequestedWeight = BigDecimal.ZERO;
		BigDecimal totalRequestedValue = BigDecimal.ZERO;
		List<RequestOtherItemDto> items = otherRequestCreateDto.getItems();
		List<String> inventortIds = items.stream().map(RequestOtherItemDto::getInventoryId)
				.collect(Collectors.toList());
		List<InventoryDetailsDaoExt> inventoryDetailsList = inventoryDetailsService
				.getInventoryDetailsByIdList(inventortIds);

		List<String> inventoryDetailsListAdj = validateAdjBin(inventoryDetailsList);
		if (inventoryDetailsListAdj.size() > 0)
			throw new ServiceException("Invalid BinGroup for ADJ", ERR_INV_043);

		Map<String, InventoryDetailsDaoExt> inventoryDetailMap = inventoryDetailsList.stream()
				.collect(Collectors.toMap(InventoryDetailsDaoExt::getId, Function.identity()));
		// TO DO: Empty list check should happen
		for (RequestOtherItemDto requestItem : items) {
			InventoryDetailsDaoExt inventoryDetail = validateInventoryMapItems(authUser, inventoryDetailMap,
					requestItem);
//			if ((reqType.equals(OtherTransactionRequestTypeEnum.ADJ.toString())
//					&& !(inventoryDetail.getProductGroup().equals(ProductGroupCodeEnum.GOLD_PLAIN.getCode().toString())))
//					|| (reqType.equals(OtherTransactionRequestTypeEnum.PSV.toString()) && !(inventoryDetail
//							.getProductGroup().equals(ProductGroupCodeEnum.GOLD_STUDDED.getCode().toString())))) {
//				throw new ServiceException("Invalid product group for ADJ/PSV", ERR_INV_057,
//						Map.of(REQUEST_TYPE, reqType));
//			}
			// for PSV,ADJ,FOC
			if (!reqType.equals(OtherTransactionRequestTypeEnum.CONV.toString())) {
				engineService.checkWeightToleranceValue(inventoryDetail.getProductGroup(),
						inventoryDetail.getTotalWeight(), requestItem.getMeasuredWeight(),
						(short) (inventoryDetail.getTotalQuantity() - inventoryDetail.getIssuedQuantity()),
						requestItem.getQuantity());
				createOtherRequestDetails(createdOtherRequest, requestDetailList, requestItem, inventoryDetail,
						authUser.getLocationCode());
				totalRequestedQuantity = (short) (totalRequestedQuantity + requestItem.getQuantity());
				totalRequestedWeight = totalRequestedWeight.add(requestItem.getMeasuredWeight());
				totalRequestedValue = totalRequestedValue
						.add(inventoryDetail.getStdValue().multiply(BigDecimal.valueOf(requestItem.getQuantity())));
			} else {
				throw new ServiceException("requesting item is not available with given location code at this moment",
						ERR_INV_029);
			}
		}
		if (!itemNotAvailable.isEmpty()) {
			// TO DO: An extra object parameter to pass list of item codes to client
			throw new ServiceException("requesting item " + itemNotAvailable.toString()
					+ " is not available with given location code at this moment", ERR_INV_029);
		}
		requestDetailList = stockRequestService.saveAllStockRequestDetails(requestDetailList);
		// call createStockRequestDetailsList() and this method sets the value of
		// totalRequestedQuantity,totalRequestedWeight,totalRequestedValue
		return generateRequestDetailsResponse(requestDetailList, reqType, totalRequestedQuantity, totalRequestedWeight,
				totalRequestedValue);
	}

	private List<String> validateAdjBin(List<InventoryDetailsDaoExt> inventoryDetailsList) {

		List<String> listAdjItems = new ArrayList<>();
		for (InventoryDetailsDaoExt invenDetails : inventoryDetailsList) {
			if (invenDetails.getBinGroupCode().equalsIgnoreCase("CUSTOMERORDERBIN")
					|| invenDetails.getBinGroupCode().equalsIgnoreCase("RESERVEBIN")) {
				listAdjItems.add(invenDetails.getId());
			}
		}
		return listAdjItems;

	}

	private InventoryDetailsDaoExt validateInventoryMapItems(AuthUser authUser,
			Map<String, InventoryDetailsDaoExt> inventoryDetailMap, RequestOtherItemDto requestItem) {
		InventoryDetailsDaoExt inventoryDetail = inventoryDetailMap.get(requestItem.getInventoryId());

		List<QuantityCheckDto> items = validateBin(inventoryDetailMap);

		// if bin-group got change before issue. throw exception
		if (!items.isEmpty()) {
			throw new ServiceException("Following items are in Dispute and Defective Bins cannot request these items: ",
					"ERR-INV-037", items);
		}

		if (inventoryDetail == null)
			throw new ServiceException("RECORDS_NOT_FOUND", ERR_INV_029);
		if (!inventoryDetail.getLocationCode().equalsIgnoreCase(authUser.getLocationCode())) {
			throw new ServiceException("NO_ITEM_WITH_ID" + requestItem.getInventoryId() + "EXIST", ERR_INV_029);
			// no inventory id
		}

		if (inventoryDetail.getTotalWeight() == null) {
			throw new ServiceException("Improper data from inventory", ERR_INV_014);
		}
		
		// measured weight should not be 0 except for product group "A6 - Jewel care"
		if((!inventoryDetail.getProductGroup().equalsIgnoreCase("A6")) 
				&& (requestItem.getMeasuredWeight().compareTo(BigDecimal.ZERO) <= 0)) {  				
			throw new ServiceException("Measured weight should be greater than 0" , ERR_INV_064);				
		}	

		// MeasuredWeight is the cummulative Weight of n Quantity
		// so having check with total weight not on individual(stdWeight).
		if (requestItem.getMeasuredWeight().compareTo(inventoryDetail.getTotalWeight()) > 0) {
			throw new ServiceException("Measured weight cannot be greater than the available Weight", ERR_INV_034);
		} else if (requestItem.getQuantity()
				.compareTo((short) (inventoryDetail.getTotalQuantity() - inventoryDetail.getIssuedQuantity())) > 0) {
			throw new ServiceException("Measured quantity cannot be greater than the available quantity", ERR_INV_017);
		}
		// Yet to implement as inventoryId is not sent from UI
		// current flow works w.r.t lotnumber and itemcode and srclocation

		// if item is not available in inventory
		if (inventoryDetail.getTotalQuantity() <= 0) {
			throw new ServiceException("Total quantity is <=0 in inventory for id= " + inventoryDetail.getId(),
					ERR_INV_014);
			// new error
		}
		return inventoryDetail;
	}

	private List<QuantityCheckDto> validateBin(Map<String, InventoryDetailsDaoExt> inventoryDetailMap) {
		List<String> inventoryIds = new ArrayList<>();
		for (Map.Entry<String, InventoryDetailsDaoExt> entry : inventoryDetailMap.entrySet()) {
			inventoryIds.add(entry.getKey());
		}
		List<QuantityCheckDto> itemIds = new ArrayList<>();
		List<Object[]> availableItemList = stockRequestService.validateDefectiveAndDisputeItems(inventoryIds);
		for (Object[] availableItem : availableItemList) {
			QuantityCheckDto item = new QuantityCheckDto();
			item.setItemId((String) availableItem[0]);
			item.setCurrentBinGroup((String) availableItem[1]);
			item.setItemCode((String) availableItem[2]);
			item.setLotNumber((String) availableItem[3]);

			itemIds.add(item);
		}

		return itemIds;
	}

	private RequestDtlsInsertResponseDto generateRequestDetailsResponse(
			List<StockRequestDetailsDao> stockRequestDetailsList, String reqType, Short totalRequestedQuantity,
			BigDecimal totalRequestedWeight, BigDecimal totalRequestedValue) {
		RequestDtlsInsertResponseDto requestDtlsInsertResponseDto = new RequestDtlsInsertResponseDto();
		// if the reqType is CONV then set totalRequestedQuantity and it should be the
		// size of
		// stockRequestDetailsList
		if (OtherTransactionRequestTypeEnum.CONV.toString().equals(reqType)) {
			requestDtlsInsertResponseDto.setTotalRequestedQuantity((short) stockRequestDetailsList.size());
		} else {

			// if the reqType is other than CONV then set totalRequestedQuantity and it
			// should be totalRequestedQuantity parameter
			requestDtlsInsertResponseDto.setTotalRequestedQuantity(totalRequestedQuantity);
		}
		requestDtlsInsertResponseDto.setTotalRequestedWeight(totalRequestedWeight);
		requestDtlsInsertResponseDto.setTotalRequestedValue(totalRequestedValue);
		requestDtlsInsertResponseDto.setTotalRequestCreatedItems(stockRequestDetailsList.size());
		return requestDtlsInsertResponseDto;

	}

	private List<StockRequestDetailsDao> createConversionRequestDetails(StockRequestDao stockRequest,
			List<RequestOtherItemDto> requestItems) {
		List<StockRequestDetailsDao> requestDetailList = new ArrayList<>();
		String binGroupCode = null;
		String productCategory = null;
		String productGroup = null;
		String binCode = null;
		Short totalQty = 0;
		BigDecimal totalWeight = BigDecimal.ZERO;
		BigDecimal totalValue = BigDecimal.ZERO;
		BigDecimal parentWeight = BigDecimal.ZERO;
		BigDecimal childWeight = BigDecimal.ZERO;
		for (RequestOtherItemDto requestOtherItemDto : requestItems) {
			// validate item details json
			// calling JsonUtils and get "itemType" key's value
			String itemType = JsonUtils.getValueFromJsonString(requestOtherItemDto.getItemDetails().getData(),
					"itemType");
			// validate JSON for parent JSON only
			// cause sometimes child items may not be available
			// so for child items JSON validation won't apply
			if ("Parent".equalsIgnoreCase(itemType)) {
				// here validation will happen against parent item and for JSON
				// if parent item is already in db and status is APVL_PENDING then boutique user
				// should not be allowed to raise another request
				validateParentItemApprovalRequest(requestOtherItemDto);
				validateJsonForConversion(requestOtherItemDto);
				parentWeight = parentWeight.add(requestOtherItemDto.getMeasuredWeight());

			} else if ("Child".equalsIgnoreCase(itemType)) {
				childWeight = childWeight.add(requestOtherItemDto.getMeasuredWeight());
			} else {
				throw new ServiceException("Json type error", ERR_CORE_013);
			}
			InventoryDetailsDaoExt inventoryDetails = null;
			if (!StringUtils.isEmpty(requestOtherItemDto.getInventoryId())) {
				Optional<InventoryDetailsDaoExt> invDetails = inventoryDetailsService
						.findById(requestOtherItemDto.getInventoryId());
				if (invDetails.isPresent()) {
					inventoryDetails = invDetails.get();
					binGroupCode = inventoryDetails.getBinGroupCode();
					productCategory = inventoryDetails.getProductCategory();
					productGroup = inventoryDetails.getProductGroup();
					if (requestOtherItemDto.getBinCode() != null)
						binCode = requestOtherItemDto.getBinCode();
					else
						binCode = inventoryDetails.getBinCode();
					// if bin group code is not STN/PURCFA then throw exception
					if (BinGroupEnum.STN.toString().equals(invDetails.get().getBinGroupCode())
							|| BinGroupEnum.PURCFA.toString().equals(invDetails.get().getBinGroupCode())) {
						// do nothing
					} else {
						throw new ServiceException("This product is not available for conversion", "ERR-INV-011");
					}
				}
			}
			StockRequestDetailsDao stockRequestDetails = getStockRequestDetailsList(stockRequest, requestDetailList,
					binGroupCode, productCategory, productGroup, requestOtherItemDto, inventoryDetails, binCode);
			// calculate totalQuantity,totalWeight,totalValue
			totalQty = (short) (totalQty + requestOtherItemDto.getQuantity());
			totalWeight = totalWeight.add(requestOtherItemDto.getMeasuredWeight());
			totalValue = totalValue.add(stockRequestDetails.getRequestedValue());
		}
		// sum of child items weight should be same with parent item
		// if not then throw exception
		checkForParentAndChildItemWeight(parentWeight, childWeight);
		stockRequest.setTotalRequestedQuantity(totalQty);
		stockRequest.setTotalRequestedValue(totalValue);
		stockRequest.setTotalRequestedWeight(totalWeight);
		// call stockRequestService and save item details in stock request details table
		stockRequestService.saveAllStockRequestDetails(requestDetailList);
		return requestDetailList;
	}

	private void checkForParentAndChildItemWeight(BigDecimal parentWeight, BigDecimal childWeight) {
		if (parentWeight.compareTo(childWeight) != 0 && childWeight.compareTo(BigDecimal.ZERO) != 0)
			throw new ServiceException("Parent Item weight is not matching with sum of child item weight",
					"ERR-INV-026");
	}

	private StockRequestDetailsDao getStockRequestDetailsList(StockRequestDao stockRequest,
			List<StockRequestDetailsDao> requestDetailList, String binGroupCode, String productCategory,
			String productGroup, RequestOtherItemDto requestOtherItemDto, InventoryDetailsDaoExt inventoryDetails,
			String binCode) {
		CountryDetailsDto countryDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		StockRequestDetailsDao stockRequestDetails = new StockRequestDetailsDao();
		stockRequestDetails.setAcceptedQuantity((short) requestOtherItemDto.getQuantity());
		stockRequestDetails.setApprovedQuantity((short) requestOtherItemDto.getQuantity());
		stockRequestDetails.setBinCode(binCode);
		stockRequestDetails.setBinGroupCode(binGroupCode);
		stockRequestDetails.setProductCategory(productCategory);
		stockRequestDetails.setProductGroup(productGroup);
		stockRequestDetails.setCurrencyCode(countryDto.getCurrencyCode());
		if (inventoryDetails != null) {
			stockRequestDetails.setInventoryId(inventoryDetails.getId());
			stockRequestDetails.setMfgDate(inventoryDetails.getMfgDate());
			stockRequestDetails.setRequestedValue(inventoryDetails.getStdValue());
			stockRequestDetails.setStdValue(inventoryDetails.getStdValue());
		} else {
			stockRequestDetails.setInventoryId(UUID.randomUUID().toString());
			stockRequestDetails.setRequestedValue(BigDecimal.ZERO);
			stockRequestDetails.setStdValue(BigDecimal.ZERO);
			stockRequestDetails.setMfgDate(new Date());
		}
		stockRequestDetails.setIssuedQuantity((short) 0);
		stockRequestDetails.setItemCode(requestOtherItemDto.getItemCode());
		// convert Json to string
		stockRequestDetails
				.setItemDetails(MapperUtil.getStringFromJson(requestOtherItemDto.getItemDetails().getData()));
		stockRequestDetails.setLotNumber(requestOtherItemDto.getLotNumber());
		stockRequestDetails.setRequestedQuantity((short) requestOtherItemDto.getQuantity());
		stockRequestDetails.setRequestedWeight(requestOtherItemDto.getMeasuredWeight());
		stockRequestDetails.setSelectedQuantity((short) requestOtherItemDto.getQuantity());
		if (stockRequest.getRequestType().equals(OtherTransactionRequestTypeEnum.CONV.name()))
			stockRequestDetails.setStatus(StockRequestStatusEnum.ACKNOWLEDGE_PENDING.toString());
		else
			stockRequestDetails.setStatus(StockRequestStatusEnum.APVL_PENDING.toString());
		stockRequestDetails.setStdWeight(requestOtherItemDto.getMeasuredWeight());
		stockRequestDetails.setStockRequest(stockRequest);
		stockRequestDetails.setWeightUnit(countryDto.getWeightUnit());
		requestDetailList.add(stockRequestDetails);
		return stockRequestDetails;
	}

	private void validateParentItemApprovalRequest(RequestOtherItemDto requestOtherItemDto) {

		// if parent item data is available and status is APVL_PENDING then boutique
		// user should not allow to raise a request more than one
		List<StockRequestDao> stRequestDaoList = stockRequestService
				.findAllStockRequestBySrcLocationCodeAndRequestTypeAndStatus(
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
						OtherTransactionRequestTypeEnum.CONV.toString(),
						StockRequestStatusEnum.APVL_PENDING.toString());
		List<StockRequestDao> stRequestDaoList1 = stockRequestService
				.findAllStockRequestBySrcLocationCodeAndRequestTypeAndStatus(
						CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(),
						OtherTransactionRequestTypeEnum.CONV.toString(),
						StockRequestStatusEnum.ACKNOWLEDGED.toString());
		List<StockRequestDetailsDao> stRequestDetailsList = stockRequestService
				.findByItemCodeAndLotNumberAndRequestedWeightAndStatusAndListStockRequest(
						requestOtherItemDto.getItemCode(), requestOtherItemDto.getLotNumber(),
						requestOtherItemDto.getMeasuredWeight(), StockRequestStatusEnum.APVL_PENDING.toString(),
						stRequestDaoList);
		List<StockRequestDetailsDao> stRequestDetailsList1 = stockRequestService
				.findByItemCodeAndLotNumberAndRequestedWeightAndStatusAndListStockRequest(
						requestOtherItemDto.getItemCode(), requestOtherItemDto.getLotNumber(),
						requestOtherItemDto.getMeasuredWeight(), StockRequestStatusEnum.ACKNOWLEDGED.toString(),
						stRequestDaoList1);

		// throw exception if the list is not empty & list size is more than 0
		if (!stRequestDetailsList.isEmpty() || !stRequestDetailsList1.isEmpty())
			throw new ServiceException("Request is already pending for approval", "ERR-INV-032");
	}

	private void validateJsonForConversion(RequestOtherItemDto requestOtherItemDto) {
		String type = requestOtherItemDto.getItemDetails().getType();
		ItemDetailsData itemDetailsData = null;
		if ("conversion".equals(type)) {
			ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
			Validator validator = factory.getValidator();
			List<String> str = new ArrayList<>();
			itemDetailsData = MapperUtil.getObjectMapperInstance()
					.convertValue(requestOtherItemDto.getItemDetails().getData(), ItemDetailsData.class);
			Set<ConstraintViolation<ItemDetailsData>> violationsApvl = validator.validate(itemDetailsData);
			violationsApvl.forEach(violation -> str.add(violation.getMessage()));
			if (!violationsApvl.isEmpty())
				throw new ServiceException(JSON_FORMAT_ERROR, ERR_CORE_013, str);
		}

	}

	private void createOtherRequestDetails(StockRequestDao createdStockRequest,
			List<StockRequestDetailsDao> requestDetailList, RequestOtherItemDto requestItem,
			InventoryDetailsDaoExt inventoryDetail, String locationCode) {
		CountryDetailsDto countryDto = getCountryDetails(locationCode);
		StockRequestDetailsDao stockRequestDetails = new StockRequestDetailsDao();
		stockRequestDetails.setBinCode(inventoryDetail.getBinCode());
		stockRequestDetails.setRequestedValue(inventoryDetail.getStdValue());
		// not handling any inventory check for item weight?
		stockRequestDetails.setRequestedWeight(requestItem.getMeasuredWeight());
		if (requestItem.getQuantity() != 0)
			stockRequestDetails.setStdWeight(
					requestItem.getMeasuredWeight().divide(BigDecimal.valueOf(requestItem.getQuantity())));

		stockRequestDetails.setBinGroupCode(inventoryDetail.getBinGroupCode());
		stockRequestDetails.setCurrencyCode(countryDto.getCurrencyCode());
		stockRequestDetails.setProductCategory(inventoryDetail.getProductCategory());
		stockRequestDetails.setProductGroup(inventoryDetail.getProductGroup());
		stockRequestDetails.setInventoryId(inventoryDetail.getId());
		stockRequestDetails.setIssuedQuantity((short) 0);
		stockRequestDetails.setItemCode(requestItem.getItemCode());
		// ObjectMapper objectMapper = MapperUtil.getObjectMapperInstance();
		// stockRequestDetails.setItemDetails(
		// MapperUtil.getStringFromJson(objectMapper.convertValue(requestItem.getItemDetails(),
		// Map.class)));
		stockRequestDetails.setItemDetails(inventoryDetail.getItemDetails());
		stockRequestDetails.setStdValue(inventoryDetail.getStdValue());
		stockRequestDetails.setLotNumber(requestItem.getLotNumber());
		stockRequestDetails.setMfgDate(new Date());
		stockRequestDetails.setRequestedQuantity(requestItem.getQuantity());
		stockRequestDetails.setAcceptedQuantity((short) 0);
		stockRequestDetails.setApprovedQuantity(requestItem.getQuantity());
		stockRequestDetails.setStatus(StockRequestStatusEnum.APVL_PENDING.toString());
		stockRequestDetails.setStockRequest(createdStockRequest);
		stockRequestDetails.setWeightUnit(countryDto.getWeightUnit());
		// call for weightDetails calculation
		if (inventoryDetail.getTotalWeightDetails() != null) {
			stockRequestDetails.setRequestedWeightDetails(WeightUtil.calculateWeightDetails(
					inventoryDetail.getTotalWeight().divide(BigDecimal.valueOf(inventoryDetail.getTotalQuantity())),
					inventoryDetail.getTotalWeightDetails(),
					requestItem.getMeasuredWeight().divide(BigDecimal.valueOf(requestItem.getQuantity()))));
		} else {
			stockRequestDetails.setRequestedWeightDetails(inventoryDetail.getTotalWeightDetails());
		}
		requestDetailList.add(stockRequestDetails);
	}

	@Override
	@Transactional
	public OtherRequestItemDto updateOtherRequestItem(Integer otherRequestId, String itemId, String reqType,
			OtherRequestItemUpdateDto itemUpdateDto) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		OtherRequestItemDto otherRequestItemDto = new OtherRequestItemDto();
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		StockRequestDao stockRequest = StockRequestDao.builder().id(otherRequestId).requestType(reqType)
				.srcLocationCode(authUser.getLocationCode()).status(ReturnInvoiceStatus.OPEN.name()).build();

		if (stockRequest == null) {
			throw new ServiceException(RECORD_S_NOT_FOUND, ERR_INV_029);
		}

		// id is stockRequestId
		// itemId is stocktransferDetails id
		Optional<StockRequestDetailsDao> otherRequestItem = stockRequestService.findStockRequestDetailsById(itemId);
		// TO DO: Header level check w.r.t requestType and locationcode should happen
		StockRequestDetailsDao reqDetailNew = new StockRequestDetailsDao();
		if (otherRequestItem.isPresent()) {
			if (!otherRequestItem.get().getStockRequest().getId().equals(otherRequestId)) {
				throw new ServiceException("Can not list items for request id", ERR_INV_029);
			}

			LOGGER.debug("stnItem - {}", otherRequestItem.get());

			String inventoryId = itemUpdateDto.getInventoryId();
			Optional<InventoryDetailsDaoExt> inventoryItem = inventoryDetailsService.findById(inventoryId);

			// yet to implement WEIGHT TOLERANCE
			// MeasuredWeight is the cummulative Weight of n Quantity

			// so having check with total weight not on individual(stdWeight).

			if (inventoryItem.isPresent()) {

				reqDetailNew = setDataToOtherRequestItemDto(otherRequestId, itemUpdateDto, otherRequestItemDto,
						otherRequestItem.get(), inventoryItem.get());

			}

		} else {
			throw new ServiceException("No Item with id " + itemId + " exist", ERR_INV_029);
		}
		otherRequestItemDto = (OtherRequestItemDto) MapperUtil.getObjectMapping(reqDetailNew, otherRequestItemDto);
		otherRequestItemDto.setItemDetails(MapperUtil.getJsonFromString(reqDetailNew.getItemDetails()));
		otherRequestItemDto.setImageURL(new URLUtil().getImageUrlByItemCode(reqDetailNew.getItemCode()));

		otherRequestItemDto.setProductCategory(reqDetailNew.getProductCategory());
		otherRequestItemDto.setProductCategoryDesc(productCategoryList.get(reqDetailNew.getProductCategory()));
		otherRequestItemDto.setProductGroup(reqDetailNew.getProductGroup());
		otherRequestItemDto.setProductGroupDesc(productGroupList.get(reqDetailNew.getProductGroup()));
		return otherRequestItemDto;
	}

	private StockRequestDetailsDao setDataToOtherRequestItemDto(Integer otherRequestId,
			OtherRequestItemUpdateDto itemUpdateDto, OtherRequestItemDto otherRequestItemDto,
			StockRequestDetailsDao otherRequestItem, InventoryDetailsDaoExt inventoryDetailsDaoExt) {
		StockRequestDetailsDao reqDetailNew;
		if (itemUpdateDto.getMeasuredWeight().compareTo(inventoryDetailsDaoExt.getTotalWeight()) > 0) {
			throw new ServiceException("Measured weight cannot greater than the available Weight", ERR_INV_034);
		} else if (itemUpdateDto.getQuantity().compareTo(
				(short) (inventoryDetailsDaoExt.getTotalQuantity() - inventoryDetailsDaoExt.getIssuedQuantity())) > 0) {
			throw new ServiceException("Measured quantity cannot be greater than the available quantity", ERR_INV_017);
		}

		engineService.checkWeightToleranceValue(otherRequestItem.getProductGroup(),
				inventoryDetailsDaoExt.getTotalWeight(), itemUpdateDto.getMeasuredWeight(),
				(short) (inventoryDetailsDaoExt.getTotalQuantity() - inventoryDetailsDaoExt.getIssuedQuantity()),
				itemUpdateDto.getQuantity());

		Short oldQuantity = otherRequestItem.getRequestedQuantity();
		BigDecimal oldWeight = otherRequestItem.getRequestedWeight();
		BigDecimal oldValue = otherRequestItem.getRequestedValue();
		reqDetailNew = updateOtherRequestItem(itemUpdateDto, otherRequestItem, inventoryDetailsDaoExt);
		Short totalQuantity = (short) (itemUpdateDto.getQuantity() - oldQuantity);
		BigDecimal weight = itemUpdateDto.getMeasuredWeight().subtract(oldWeight);
		BigDecimal value = reqDetailNew.getRequestedValue().subtract(oldValue);
		updateTotalValues(totalQuantity, weight, value, otherRequestId);

		otherRequestItemDto.setAvailableQuantity(
				(short) (inventoryDetailsDaoExt.getTotalQuantity() - inventoryDetailsDaoExt.getIssuedQuantity()));
		otherRequestItemDto.setAvailableWeight(inventoryDetailsDaoExt.getTotalWeight());
		otherRequestItemDto.setMeasuredWeight(itemUpdateDto.getMeasuredWeight());
		otherRequestItemDto.setMeasuredQuantity(itemUpdateDto.getQuantity());
		return reqDetailNew;
	}

	private StockRequestDetailsDao updateOtherRequestItem(OtherRequestItemUpdateDto itemUpdateDto,
			StockRequestDetailsDao stockRequestDetails, InventoryDetailsDaoExt inventoryDetailsDaoExt) {
		if (itemUpdateDto != null) {
			stockRequestDetails.setRequestedQuantity(itemUpdateDto.getQuantity());
			stockRequestDetails.setApprovedQuantity(itemUpdateDto.getQuantity());
			stockRequestDetails.setAcceptedQuantity(itemUpdateDto.getQuantity());
			if (inventoryDetailsDaoExt.getStdValue() == null) {
				throw new ServiceException("Null in inventory details table", ERR_INV_014);
			} else {
				stockRequestDetails.setRequestedValue(
						inventoryDetailsDaoExt.getStdValue().multiply(BigDecimal.valueOf(itemUpdateDto.getQuantity())));
			}
		}

		// call for weightDetails calculation
		if (inventoryDetailsDaoExt.getTotalWeightDetails() != null && (itemUpdateDto != null)) {

			stockRequestDetails.setRequestedWeightDetails(WeightUtil.calculateWeightDetails(
					inventoryDetailsDaoExt.getTotalWeight()
							.divide(BigDecimal.valueOf(inventoryDetailsDaoExt.getTotalQuantity())),
					inventoryDetailsDaoExt.getTotalWeightDetails(),
					itemUpdateDto.getMeasuredWeight().divide(BigDecimal.valueOf(itemUpdateDto.getQuantity()))));
			stockRequestDetails.setRequestedWeight(itemUpdateDto.getMeasuredWeight());
		} else if (itemUpdateDto != null) {
			stockRequestDetails.setRequestedWeight(itemUpdateDto.getMeasuredWeight());
			stockRequestDetails.setRequestedWeightDetails(inventoryDetailsDaoExt.getTotalWeightDetails());
		}

		stockRequestDetails = stockRequestService.saveStockRequestDetails(stockRequestDetails);
		LOGGER.debug("stnDetailNew - {}", stockRequestDetails);
		return stockRequestDetails;
	}

	@Transactional
	@Override
	public OtherRequestDto updateOtherRequest(Integer otherRequestId, String reqType,
			OtherRequestUpdateDto requestUpdateDto) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		StockRequestDao updatedStockRequest = null;
		// validate JSON based on request type
		validateJson(requestUpdateDto, reqType);
		Optional<StockRequestDao> stockRequest1 = stockRequestService.findStockRequestById(otherRequestId);
		if (stockRequest1.isPresent()) {
			updatedStockRequest = stockRequest1.get();
		} else {
			throw new ServiceException("Incorrect request Id", ERR_INV_029);
		}
		// SELECTED Items Count <=0 then throw exception.
		Integer selectedCount = stockRequestService.getSelectedItemsCount(stockRequest1.get().getId(),
				OtherRequestStatusEnum.SELECTED.toString());
		if (selectedCount <= 0) {
			throw new ServiceException("Cannot confirm Request without any selected Items", ERR_INV_013);
		}
		LOGGER.debug("stn - {}", stockRequest1.get());
		CountryDetailsDto countryDetailsDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		updatedStockRequest.setReqFiscalYear(countryDetailsDto.getFiscalYear().shortValue());
		updatedStockRequest.setStatus(OtherRequestStatusEnum.APVL_PENDING.toString());
		updatedStockRequest.setDestLocationCode(authUser.getLocationCode());
		updatedStockRequest.setOtherDetails(MapperUtil.getStringFromJson(requestUpdateDto.getApprovalDetails()));
		// incase of LOSS courier details will be null or empty
		updatedStockRequest.setCarrierDetails(MapperUtil.getStringFromJson(requestUpdateDto.getCarrierDetails()));
		updatedStockRequest.setRequestRemarks(requestUpdateDto.getRemarks());
		updatedStockRequest.setReqDocNo(inventoryDocMasterService.getDocNumber(
				countryDetailsDto.getFiscalYear().shortValue(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), DocTypeEnum.OTHERREQUEST.toString()));
		updatedStockRequest.setReqDocDate(getBusinessDay(authUser.getLocationCode()).getBusinessDate());
		stockRequestService.saveStockRequest(updatedStockRequest);
		// only selected status should be requested,To be handled
		List<String> updateStatusList = new ArrayList<>(Arrays.asList(OtherRequestStatusEnum.SELECTED.toString()));
		stockRequestService.updateAllRequestItemStatus(OtherRequestStatusEnum.APVL_PENDING.toString(),
				updatedStockRequest, updateStatusList);
		// total quantity,value,weight update implementation
		// update header
		stockRequestService.updatingTotalWeightAndQuantity(otherRequestId, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
		OtherRequestDto requestDto = (OtherRequestDto) MapperUtil.getDtoMapping(updatedStockRequest,
				OtherRequestDto.class);
		return createRequestDtoResponse(requestDto, updatedStockRequest);
	}

	private void validateJson(OtherRequestUpdateDto requestUpdateDto, String reqType) {
		String type = null;
		if (requestUpdateDto.getCarrierDetails() != null) {
			type = requestUpdateDto.getCarrierDetails().getType();
		}
		String apvlType = requestUpdateDto.getApprovalDetails().getType();
		EmployeeData employeeData = null;
		AddressData addressData = null;

		if (OtherTransferRequestTypeEnum.EXH.toString().equals(reqType) && "address_exh".equals(type)) {
			// do nothing
		} else if (OtherTransferRequestTypeEnum.LOAN.toString().equals(reqType) && "employee_loan".equals(type)) {
			// do nothing
		} else if (OtherTransferRequestTypeEnum.LOSS.toString().equals(reqType) && type == null) {
			// do nothing
		} else {
			throw new ServiceException(
					"Invalid Request type & JSON type.Request type: " + reqType + " & JSON type : " + type,
					ERR_INV_013);
		}

		validateApprovalJson(apvlType, requestUpdateDto.getApprovalDetails().getData());

		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		List<String> str = new ArrayList<>();

		// validate carrier details for employee loan type
		if ("employee_loan".equals(type)) {
			employeeData = MapperUtil.getObjectMapperInstance()
					.convertValue(requestUpdateDto.getCarrierDetails().getData(), EmployeeData.class);
			Set<ConstraintViolation<EmployeeData>> violationsEmployee = validator.validate(employeeData);
			violationsEmployee.forEach(violation -> str.add(violation.getMessage()));
			if (!violationsEmployee.isEmpty())
				throw new ServiceException(JSON_FORMAT_ERROR, ERR_CORE_013, str);
		}

		// validate carrier details for address exhibition type
		if ("address_exh".equals(type)) {
			addressData = MapperUtil.getObjectMapperInstance()
					.convertValue(requestUpdateDto.getCarrierDetails().getData(), AddressData.class);
			Set<ConstraintViolation<AddressData>> violationsAddress = validator.validate(addressData);
			violationsAddress.forEach(violation -> str.add(violation.getMessage()));
			if (!violationsAddress.isEmpty())
				throw new ServiceException(JSON_FORMAT_ERROR, ERR_CORE_013, str);
		}

	}

	// setting response for measured quantity
	private OtherRequestDto createRequestDtoResponse(OtherRequestDto otherRequestDto, StockRequestDao stockRequest) {
		otherRequestDto.setTotalAvailableQuantity(stockRequest.getTotalRequestedQuantity());
		otherRequestDto.setTotalMeasuredQuantity(stockRequest.getTotalRequestedQuantity());
		otherRequestDto.setTotalAvailableWeight(stockRequest.getTotalRequestedWeight());
		otherRequestDto.setTotalMeasuredWeight(stockRequest.getTotalRequestedWeight());
		otherRequestDto.setTotalAvailableValue(stockRequest.getTotalRequestedValue());
		otherRequestDto.setTotalMeasuredValue(stockRequest.getTotalRequestedValue());
		otherRequestDto.setSrcDocNo(stockRequest.getReqDocNo());
		otherRequestDto.setSrcDocDate(stockRequest.getReqDocDate());

		return otherRequestDto;
	}

	@Override
	@Transactional
	public void createItemDetails(Integer id, String requestType,
			OtherRequestItemsCreateDto otherRequestItemsCreateDto) {

		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		BigDecimal tax = BigDecimal.ZERO;

		Map<String, BigDecimal> total = new HashMap<>();
		Optional<StockRequestDao> stockRequests = stockRequestService.findStockRequestById(id);
		if (!stockRequests.isPresent()) {
			throw new ServiceException("Records not found", ERR_INV_029);
		}
		StockRequestDao stockRequest = stockRequests.get();
		if (!stockRequest.getStatus().equalsIgnoreCase("OPEN")) {
			throw new ServiceException("Can not list items for requested id", ERR_INV_029);
		}
		List<String> defaulters = new ArrayList<>();
		List<StockRequestDetailsDao> itemsToSave = new ArrayList<>();
		if (!otherRequestItemsCreateDto.getStockItems().isEmpty()) {
			total = createMultiStockIssueItem(otherRequestItemsCreateDto, authUser, tax, stockRequest, defaulters,
					itemsToSave);

		} else if (otherRequestItemsCreateDto.getStockItems().isEmpty()) {
			// bulk create items for LOAN and EXIBITION and others
			total = createAllStockIssueItems(id, requestType, authUser, null, stockRequest, itemsToSave);
		}
		stockRequestService.saveAllStockRequestDetails(itemsToSave);
		updateTotalValues(total.get(TOTAL_QUANTITY).shortValue(), total.get(TOTAL_WEIGHT), total.get(TOTAL_VALUE), id);

	}

	private Map<String, BigDecimal> createAllStockIssueItems(Integer id, String requestType, AuthUser authUser,
			String productGroup, StockRequestDao stockRequest, List<StockRequestDetailsDao> itemsToSave) {
		LocationResponseDto locationDetails = engineClient.getBoutiqueLocationDetails();
		BigDecimal totalWeight = BigDecimal.ZERO;
		Integer totalQuantity = 0;
		BigDecimal totalValue = BigDecimal.ZERO;
		List<InventoryDetailsDaoExt> inventoryList;
		Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, Sort.unsorted());
		StockRequestDao stockRequest1 = stockRequestService.getStockRequestByIdAndType(id, requestType);

		if (stockRequest1 == null) {
			LOGGER.debug("The Request Id passed is improper ");
			throw new ServiceException("Incorrect request ID  passed ", ERR_INV_029);
		} else {
			if (!stockRequest1.getSrcLocationCode()
					.equals(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode())) {
				LOGGER.debug("The Request Id passed is improper ");
				throw new ServiceException("No Access ", ERR_INV_035);
			}
		}

		String binGroupCode;
		if (requestType.equals(OtherTransferRequestTypeEnum.EXH.toString()))
			binGroupCode = BinGroupEnum.EXHIBITION.toString();
		else
			binGroupCode = requestType;

		ItemsParamListDto params = createParamForJointList(binGroupCode, id, requestType, null, null, null,
				productGroup, ReturnInvoiceStatus.OPEN.toString(),
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), null, null, null);
		List<Object[]> listAvailableItems = stockRequestService.listOtherRequestAvailableItems(params, pageable);
		List<String> inventoryIds = getOpenItemInventoryList(listAvailableItems);
		inventoryList = inventoryDetailsService.getInventoryDetailsByIdList(inventoryIds);

		for (InventoryDetailsDaoExt inventoryDetail : inventoryList) {
			StockRequestDetailsDao stockRequestDetails = (StockRequestDetailsDao) MapperUtil
					.getDtoMapping(inventoryDetail, StockRequestDetailsDao.class);
			stockRequestDetails.setRequestedQuantity(inventoryDetail.getTotalQuantity());
			stockRequestDetails.setApprovedQuantity(inventoryDetail.getTotalQuantity());
			stockRequestDetails.setRequestedWeight(inventoryDetail.getTotalWeight());
			stockRequestDetails.setStdValue(inventoryDetail.getStdValue());
			stockRequestDetails.setAcceptedQuantity(inventoryDetail.getTotalQuantity());
			stockRequestDetails.setIssuedQuantity((short) 0);
			if (inventoryDetail.getStdValue() == null) {
				throw new ServiceException("Null in inventory details table", ERR_INV_014);
			} else {
				stockRequestDetails.setRequestedValue(
						inventoryDetail.getStdValue().multiply(BigDecimal.valueOf(inventoryDetail.getTotalQuantity())));
			}
			stockRequestDetails.setCreatedBy(authUser.getUsername());
			stockRequestDetails.setInventoryId(inventoryDetail.getId());
			stockRequestDetails.setLastModifiedBy(authUser.getUsername());
			stockRequestDetails.setCreatedDate(new Date());
			stockRequestDetails.setBinGroupCode(inventoryDetail.getBinGroupCode());
			stockRequestDetails.setBinCode(inventoryDetail.getBinCode());
			stockRequestDetails.setLastModifiedDate(new Date());
			stockRequestDetails.setStockRequest(stockRequest);
			stockRequestDetails.setItemDetails(inventoryDetail.getItemDetails());
			stockRequestDetails.setStatus(OtherRequestStatusEnum.SELECTED.name());
			stockRequestDetails.setRequestedWeightDetails(inventoryDetail.getTotalWeightDetails());
			saveTaxDetailsInStockRequest(stockRequestDetails, inventoryDetail.getItemCode(),
					inventoryDetail.getStdValue(), stockRequest.getRequestType(), locationDetails);
			itemsToSave.add(stockRequestDetails);
			// update parent
			totalQuantity = totalQuantity + stockRequestDetails.getRequestedQuantity();
			totalWeight = totalWeight.add(stockRequestDetails.getRequestedWeight());
			totalValue = totalValue.add(stockRequestDetails.getRequestedValue());
		}
		Map<String, BigDecimal> data = new HashMap<>();
		data.put(TOTAL_QUANTITY, BigDecimal.valueOf(totalQuantity));
		data.put(TOTAL_WEIGHT, totalWeight);
		data.put(TOTAL_VALUE, totalValue);
		return data;
	}

	// will update isssued and receive
	private void updateTotalValues(Short totalQuantity, BigDecimal totalWeight, BigDecimal totalValue, Integer id) {
		// verification if id is in OPEN state??
		// need to update total issued value,qiuantity,weight

		stockRequestService.updateTotalValues(totalQuantity, totalWeight, totalValue, id, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());

	}

	private Map<String, BigDecimal> createMultiStockIssueItem(OtherRequestItemsCreateDto otherRequestItemsCreateDto,
			AuthUser authUser, BigDecimal tax, StockRequestDao stockRequest, List<String> defaulters,
			List<StockRequestDetailsDao> itemsToSave) {
		LocationResponseDto locationDetails = engineClient.getBoutiqueLocationDetails();
		Integer totalQuantity = 0;
		BigDecimal totalWeight = BigDecimal.ZERO;
		BigDecimal totalValue = BigDecimal.ZERO;
		List<OtherRequestItemCreateDto> items;
		items = otherRequestItemsCreateDto.getStockItems();

		for (OtherRequestItemCreateDto item : items) {
			InventoryDetailsDaoExt inventoryDetail = validateInvetoryItems(authUser.getLocationCode(), item);
			engineService.checkWeightToleranceValue(inventoryDetail.getProductGroup(), inventoryDetail.getTotalWeight(),
					item.getMeasuredWeight(), inventoryDetail.getTotalQuantity(), item.getQuantity());

			StockRequestDetailsDao stockRequestDetails = (StockRequestDetailsDao) MapperUtil
					.getDtoMapping(inventoryDetail, StockRequestDetailsDao.class);
			if (item.getQuantity() > inventoryDetail.getTotalQuantity()) {
				// in future if less is not required add it to defaulteras and break
				defaulters.add(item.getInventoryId());
			}

			stockRequestDetails.setRequestedQuantity(item.getQuantity());
			stockRequestDetails.setAcceptedQuantity(item.getQuantity());
			stockRequestDetails.setRequestedWeight(item.getMeasuredWeight());
			stockRequestDetails.setApprovedQuantity(item.getQuantity());
			stockRequestDetails.setIssuedQuantity((short) 0);
			stockRequestDetails.setBinGroupCode(inventoryDetail.getBinGroupCode());
			stockRequestDetails.setBinCode(inventoryDetail.getBinCode());
			stockRequestDetails.setStdValue(inventoryDetail.getStdValue());
			// TO DO: What does this meant for?
			if (inventoryDetail.getStdValue() == null) {
				throw new ServiceException("Impproper Data from Inventory", ERR_INV_014);
			} else {
				stockRequestDetails.setRequestedValue(inventoryDetail.getStdValue()
						.multiply(BigDecimal.valueOf(stockRequestDetails.getRequestedQuantity())).add(tax));
			}
			stockRequestDetails.setCreatedBy(authUser.getUsername());
			stockRequestDetails.setLastModifiedBy(authUser.getUsername());
			stockRequestDetails.setCreatedDate(new Date());
			stockRequestDetails.setLastModifiedDate(new Date());
			stockRequestDetails.setStockRequest(stockRequest);

			// call for weightDetails calculation
			if (inventoryDetail.getTotalWeightDetails() != null) {

				stockRequestDetails.setRequestedWeightDetails(WeightUtil.calculateWeightDetails(
						inventoryDetail.getTotalWeight().divide(BigDecimal.valueOf(inventoryDetail.getTotalQuantity())),
						inventoryDetail.getTotalWeightDetails(),
						item.getMeasuredWeight().divide(BigDecimal.valueOf(item.getQuantity()))));
			} else {
				stockRequestDetails.setRequestedWeightDetails(inventoryDetail.getTotalWeightDetails());
			}

			stockRequestDetails.setInventoryId(inventoryDetail.getId());
			stockRequestDetails.setItemDetails(inventoryDetail.getItemDetails());
			stockRequestDetails.setStatus(OtherRequestStatusEnum.SELECTED.toString());
			saveTaxDetailsInStockRequest(stockRequestDetails, inventoryDetail.getItemCode(),
					inventoryDetail.getStdValue(), stockRequest.getRequestType(), locationDetails);
			itemsToSave.add(stockRequestDetails);
			// update parent
			totalQuantity = totalQuantity + stockRequestDetails.getRequestedQuantity();
			totalWeight = totalWeight.add(stockRequestDetails.getRequestedWeight());
			totalValue = totalValue.add(stockRequestDetails.getRequestedValue());

		}
		Map<String, BigDecimal> data = new HashMap<>();
		data.put(TOTAL_QUANTITY, BigDecimal.valueOf(totalQuantity));
		data.put(TOTAL_WEIGHT, totalWeight);
		data.put(TOTAL_VALUE, totalValue);
		return data;
	}

	private void saveTaxDetailsInStockRequest(StockRequestDetailsDao stockRequestDetails, String itemCode,
			BigDecimal stdValue, String requestType, LocationResponseDto locationDetails) {
		TaxCalculationResponseDto taxDetailsResponse = null;
		if (requestType.equalsIgnoreCase(OtherIssueRequestTypeEnum.LOSS.toString()) && !StringUtils.isEmpty(itemCode)) {
			taxDetailsResponse = engineClient.getTaxDetails(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), 0, null,
					TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE_OTHER_ISSUE.name(), itemCode, false, null);
		}
		Map<String, BigDecimal> taxDetails = new HashMap<>();
		Map<String, TaxDetailDto> data = new HashMap<>();
		TaxDetailDto sgstDetails = null;
		if (taxDetailsResponse != null) {
			data = taxDetailsResponse.getData();
			if (!CollectionUtils.isEmpty(data)) {
				if (data.get("SGST") != null) {
					sgstDetails = data.get("SGST");
					if (sgstDetails.getTaxPercentage() != null) {
						taxDetails.put("SGSTVal", stdValue.multiply(sgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
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
									stdValue.multiply(utgstDetails.getTaxPercentage().divide(ONE_HUNDRED)).setScale(2,
											RoundingMode.HALF_UP));
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
						taxDetails.put("CGSTVal", stdValue.multiply(cgstDetails.getTaxPercentage().divide(ONE_HUNDRED))
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
									stdValue.multiply(igstDetails.getTaxPercentage().divide(ONE_HUNDRED)).setScale(2,
											RoundingMode.HALF_UP));
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
		stockRequestDetails.setTaxDetails(MapperUtil.getStringFromJson(issueStockTaxDetails).replace("\\", "")
				.replace("\"[", "[").replace("]\"", "]"));
//		JsonObject taxValueDetails = new JsonParser().parse(stockRequestDetails.getTaxDetails()).getAsJsonObject();
//		BigDecimal igstVal = taxValueDetails.getAsJsonObject("data").get("IGSTVal").getAsBigDecimal();
//		BigDecimal cgstVal = taxValueDetails.getAsJsonObject("data").get("CGSTVal").getAsBigDecimal();
//		BigDecimal sgstVal = taxValueDetails.getAsJsonObject("data").get("SGSTVal").getAsBigDecimal();
//		BigDecimal utgstVal = taxValueDetails.getAsJsonObject("data").get("UTGSTVal").getAsBigDecimal();
//		BigDecimal finalTax = igstVal.add(cgstVal).add(sgstVal).add(utgstVal);
		// stockRequestDetails.setTotalTax(finalTax.multiply(new
		// BigDecimal(stockRequestDetails.getIssuedQuantity()))
		// .setScale(2, RoundingMode.HALF_UP));
		// stockRequestDetails.setFinalValue(stockRequestDetails.getIssuedValue().add(stockRequestDetails.getTotalTax())
		// .setScale(2, RoundingMode.HALF_UP));
	}

	private InventoryDetailsDaoExt validateInvetoryItems(String locationCode, OtherRequestItemCreateDto item) {
		// if id is there not allow again to add
		Optional<InventoryDetailsDaoExt> inventoryDetails = inventoryDetailsService.findById(item.getInventoryId());
		if (!inventoryDetails.isPresent()) {
			throw new ServiceException(ITEM_NOT_AVAILABLE, ERR_INV_029);
			// new error
		}
		InventoryDetailsDaoExt inventoryDetail = inventoryDetails.get();
		if (inventoryDetail.getTotalWeight() == null) {
			throw new ServiceException("Improper data from inventory", ERR_INV_014);
		}
		// MeasuredWeight is the cummulative Weight of n Quantity
		// so having check with total weight not on individual(stdWeight).
		if (item.getMeasuredWeight().compareTo(inventoryDetail.getTotalWeight()) > 0) {
			throw new ServiceException("Measured weight cannot be greater than the available Weight", ERR_INV_034);
		} else if (item.getQuantity().compareTo(inventoryDetail.getTotalQuantity()) > 0) {
			throw new ServiceException("measured quantity cannot be greater than the available quantity", ERR_INV_017);
		}

		if (!inventoryDetail.getLocationCode().equalsIgnoreCase(locationCode)) {
			throw new ServiceException("NO_ITEM_WITH_ID " + item.getInventoryId(), "EXIST, ERR_INV_004");
		}
		// if item is not available in inventory
		if (inventoryDetail.getTotalQuantity() <= 0) {
			throw new ServiceException("Total quantity is <=0 in inventory for id= " + inventoryDetail.getId(),
					ERR_INV_014);
			// new error
		}
		return inventoryDetail;
	}

	private List<String> getOpenItemInventoryList(List<Object[]> listAvailableItems) {

		List<String> listProductDtls = new ArrayList<>();
		for (Object[] l : listAvailableItems) {
			listProductDtls.add((String) l[0]);

		}
		return listProductDtls;

	}

	@Transactional
	@Override
	public void removeOtherRequestItems(Integer id, RemoveOtherItemsDto removeItemsDto, String requestType) {

		// if items id is empty then do bulk delete
		if (removeItemsDto.getItemIds().isEmpty()) {
			StockRequestDao stockRequest = stockRequestService.getOne(id);
			List<StockRequestDetailsDao> stockRequestDetailsList = stockRequestService.findByStockRequest(stockRequest);
			stockRequestService.deleteInBatch(stockRequestDetailsList);
			stockRequest.setTotalRequestedWeight(BigDecimal.ZERO);
			stockRequest.setTotalRequestedValue(BigDecimal.ZERO);
			stockRequest.setTotalRequestedQuantity((short) 0);
			stockRequestService.saveStockRequest(stockRequest);
		} else {

			BigDecimal totalWeight = BigDecimal.ZERO;
			BigDecimal totalValue = BigDecimal.ZERO;
			Short totalQuantity = 0;
			// if item id is available
			List<StockRequestDetailsDao> stockRequestDetails = stockRequestService
					.findAllById(removeItemsDto.getItemIds());
			for (StockRequestDetailsDao stockRequestDetail : stockRequestDetails) {
				totalWeight = totalWeight.add(stockRequestDetail.getRequestedWeight());
				totalValue = totalValue.add(stockRequestDetail.getRequestedValue());
				totalQuantity = (short) (totalQuantity + stockRequestDetail.getRequestedQuantity());
			}
			stockRequestService.deleteInBatch(stockRequestDetails);
			StockRequestDao stockRequest = stockRequestService.getOne(id);
			totalWeight = stockRequest.getTotalRequestedWeight().subtract(totalWeight);
			totalValue = stockRequest.getTotalRequestedValue().subtract(totalValue);
			totalQuantity = (short) (stockRequest.getTotalRequestedQuantity() - totalQuantity);
			stockRequest.setTotalRequestedWeight(totalWeight);
			stockRequest.setTotalRequestedValue(totalValue);
			stockRequest.setTotalRequestedQuantity(totalQuantity);
			stockRequestService.saveStockRequest(stockRequest);
		}
	}

	// API to cancel the Request which is in APVL pending Status
	@Override
	@Transactional
	public OtherRequestDto cancelOtherRequest(Integer otherRequestId, String reqType) {
		StockRequestDao updatedStockRequest = null;
		Optional<StockRequestDao> stockRequest1 = stockRequestService.findStockRequestById(otherRequestId);
		if (stockRequest1.isPresent()) {
			updatedStockRequest = stockRequest1.get();
		} else {
			throw new ServiceException("improper request Id", ERR_INV_029);
		}

		if (updatedStockRequest.getRequestType().equals(reqType)
				&& updatedStockRequest.getStatus().equals(StockRequestStatusEnum.APVL_PENDING.toString())) {
			// update item level
			stockRequestService.cancelRequestDetails(updatedStockRequest, StockRequestStatusEnum.CANCELLED.toString(),
					StockRequestStatusEnum.APVL_PENDING.toString());
			// update header level
			updatedStockRequest.setStatus(StockRequestStatusEnum.CANCELLED.toString());
			updatedStockRequest = stockRequestService.save(updatedStockRequest);
		} else {
			throw new ServiceException("Invalid Request please verify", ERR_INV_013);
		}
		OtherRequestDto requestDto = (OtherRequestDto) MapperUtil.getDtoMapping(updatedStockRequest,
				OtherRequestDto.class);
		return createRequestDtoResponse(requestDto, updatedStockRequest);
	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}
}
