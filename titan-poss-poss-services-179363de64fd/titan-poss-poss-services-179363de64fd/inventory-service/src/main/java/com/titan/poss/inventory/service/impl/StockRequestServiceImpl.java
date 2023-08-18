/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.service.impl;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.inventory.constant.DateTypeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dto.AvailableValues;
import com.titan.poss.inventory.dto.ItemsParamListDto;
import com.titan.poss.inventory.dto.RequestIBTCountDto;
import com.titan.poss.inventory.dto.constants.ApprovalRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.OtherRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.RequestGroupEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;
import com.titan.poss.inventory.dto.request.HistoryIssueItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryIssueRequestDto;
import com.titan.poss.inventory.dto.request.IssueStockItemBulkDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;
import com.titan.poss.inventory.repository.StockRequestDetailsRepository;
import com.titan.poss.inventory.repository.StockRequestRepository;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.ProductService;
import com.titan.poss.inventory.service.StockRequestService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("stockRequestService")
public class StockRequestServiceImpl implements StockRequestService {

	public static final BigDecimal ONE_HUNDRED = new BigDecimal(100);
	
	@Autowired
	StockRequestRepository stockRequestRepository;

	@Autowired
	StockRequestDetailsRepository stockRequestDetailsRepository;

	@Autowired
	InventoryDetailsService inventoryDetailsService;

	@Autowired
	NamedParameterJdbcTemplate namedparameterjdbctemplate;

	@Autowired
	ProductService productService;

	@Autowired
	EngineService engineService;
	
	@Autowired
	private EngineServiceClient engineClient;

	@Override
	public List<InventoryCountDto> getStockRequestCount(String locationCode, List<String> requestTypeList,
			List<String> stnstatus) {
		return stockRequestRepository.getStnCount(locationCode, requestTypeList, stnstatus);
	}

	@Override
	public Page<StockRequestDao> findAllStockRequestsByCriteria(Example<StockRequestDao> criteria, Pageable pageable) {
		return stockRequestRepository.findAll(criteria, pageable);
	}

	@Override
	public Page<StockRequestDao> findAllBySrcLocationCodeAndRequestTypeAndReqDocNoAndStatusIn(String locationcode,
			String requestType, Integer reqDocNo, List<String> statusList, Pageable pageable) {
		return stockRequestRepository.findAllBySrcLocationCodeAndRequestTypeAndReqDocNoAndStatusIn(locationcode,
				requestType, reqDocNo, statusList, pageable);
	}

	@Override
	public StockRequestDao getStockRequestByIdAndType(Integer id, String requestType) {
		StockRequestDao stockRequest = new StockRequestDao();
		stockRequest.setId(id);
		stockRequest.setRequestType(requestType);
		stockRequest.setSrcLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StockRequestDao> criteria = Example.of(stockRequest, matcher);
		Optional<StockRequestDao> stRequest = stockRequestRepository.findOne(criteria);

		if (stRequest.isPresent()) {
			stockRequest = stRequest.get();
		}
		return stockRequest;
	}

	@Override
	public Page<StockRequestDetailsDao> findAllStockRequestItems(Example<StockRequestDetailsDao> criteria,
			Pageable pageable) {
		return stockRequestDetailsRepository.findAll(criteria, pageable);
	}

	@Override
	public List<StockRequestDetailsDao> findAllStockRequestItems(Example<StockRequestDetailsDao> criteria) {
		return stockRequestDetailsRepository.findAll(criteria);
	}

	// Service Implementations related to stock request starts here

	@Override
	public StockRequestDao saveStockRequest(StockRequestDao requestObj) {
		return stockRequestRepository.save(requestObj);
	}

	@Override
	public StockRequestDetailsDao saveStockRequestDetails(StockRequestDetailsDao requestItemDetails) {

		return stockRequestDetailsRepository.save(requestItemDetails);
	}

	@Override
	public List<StockRequestDetailsDao> saveAllStockRequestDetails(List<StockRequestDetailsDao> requestItemList) {

		return stockRequestDetailsRepository.saveAll(requestItemList);
	}

	@Override
	public Optional<StockRequestDetailsDao> findStockRequestDetailsById(String itemId) {

		return stockRequestDetailsRepository.findById(itemId);
	}

	@Override
	public Optional<StockRequestDao> findStockRequestById(Integer id) {

		return stockRequestRepository.findById(id);
	}

	@Override
	public Long findStockRequestCountGroupBy(String locationCode, String requestType, List<String> historyStatus,
			Integer historyTime, String groupBy) {
		Long stockRequestCount = null;
		if (groupBy != null && groupBy.equalsIgnoreCase(RequestGroupEnum.SENT.toString())) {
			stockRequestCount = stockRequestRepository.countOfActiveStockRequests(requestType, null, locationCode,
					historyStatus, historyTime);

		} else if (groupBy != null && groupBy.equalsIgnoreCase(RequestGroupEnum.RECEIVED.toString())) {
			stockRequestCount = stockRequestRepository.countOfActiveStockRequests(requestType, locationCode, null,
					historyStatus, historyTime);
		}
		return stockRequestCount;
	}

	@Override
	public Page<StockRequestDao> findAllByRequestTypeAndStatus(String reqType, String status, Pageable pageable) {
		return stockRequestRepository.findAllByRequestTypeAndStatus(reqType, status, pageable);
	}

	@Override
	public Page<StockRequestDao> findAllByCriteria(Example<StockRequestDao> criteria, Pageable pageable) {
		return stockRequestRepository.findAll(criteria, pageable);
	}

	@Override
	public Optional<StockRequestDao> findByIdAndRequestTypeAndStatus(Integer stockRequestId, String reqType,
			String status) {

		return stockRequestRepository.findByIdAndRequestTypeAndStatus(stockRequestId, reqType, status);
	}

	@Override
	public Page<StockRequestDetailsDao> findAllByStockRequestId(Integer requestId, Pageable pageable) {
		return stockRequestDetailsRepository.findAllByStockRequestId(requestId, pageable);
	}

	@Override
	public Optional<List<StockRequestDetailsDao>> findAllByStockRequestReqLocationCodeAndStockRequestRequestTypeAndItemCodeAndStatus(
			String locationCode, String reqType, String itemCode, String status) {

		return stockRequestDetailsRepository
				.findAllByStockRequestReqLocationCodeAndStockRequestRequestTypeAndItemCodeAndStatus(locationCode,
						reqType, itemCode, status);
	}

	@Override
	public Optional<StockRequestDetailsDao> findByIdAndStatusInAndStockRequest(String itemId, List<String> statusList,
			StockRequestDao stockRequest) {

		return stockRequestDetailsRepository.findByIdAndStatusInAndStockRequest(itemId, statusList, stockRequest);
	}

	@Override
	public Optional<StockRequestDao> findByIdAndSrcLocationCodeAndRequestTypeAndStatus(Integer stockRequestId,
			String locationCode, String reqType, String status) {

		return stockRequestRepository.findByIdAndSrcLocationCodeAndRequestTypeAndStatus(stockRequestId, locationCode,
				reqType, status);
	}

	@Override
	public Optional<List<StockRequestDetailsDao>> findAllPendingStockRequestForItem(String locationCode, String reqType,
			String itemCode, String status) {

		return stockRequestDetailsRepository
				.findAllByStockRequestReqLocationCodeAndStockRequestRequestTypeAndItemCodeAndStatus(locationCode,
						reqType, itemCode, status);
	}

	@Override
	public StockRequestDao findByIdAndRequestTypeAndReqLocationCode(Integer requestId, String requsetType,
			String locationCode) {

		return stockRequestRepository.findByIdAndRequestTypeAndReqLocationCode(requestId, requsetType, locationCode);
	}

	@Override
	public StockRequestDao findByIdAndRequestTypeAndSrcLocationCode(Integer requestId, String requestType,
			String locationCode) {

		return stockRequestRepository.findByIdAndRequestTypeAndSrcLocationCode(requestId, requestType, locationCode);
	}

	@Override
	public Integer updateAcceptedItemStatus(String status, StockRequestDao stockRequest, List<String> itemIdList,
			List<String> statusList) {
		if (stockRequest.getRequestType().equals(ApprovalRequestTypeEnum.CONV.name())
				&& status.equals(StockRequestStatusEnum.ACKNOWLEDGED.toString()))
			status = StockRequestStatusEnum.APVL_PENDING.name();
		return stockRequestDetailsRepository.updateAcceptedItemStatus(status, stockRequest, itemIdList, statusList);
	}

	@Override
	public Integer updateRejectedItemStatus(String status, StockRequestDao stockRequest, List<String> itemIdList,
			List<String> statusList) {

		return stockRequestDetailsRepository.updateRejectedItemStatus(status, stockRequest, itemIdList, statusList);
	}

	@Override
	public Short getTotalAcceptedQuantity(StockRequestDao stockRequest, String status) {

		return stockRequestDetailsRepository.getTotalAcceptedQuantity(stockRequest, status);
	}

	@Override
	public Integer updateAllRequestItemStatus(String status, StockRequestDao stockRequest, List<String> statusList) {

		if (stockRequest.getRequestType().equals(ApprovalRequestTypeEnum.CONV.name())
				&& status.equals(StockRequestStatusEnum.ACKNOWLEDGED.toString()))
			status = StockRequestStatusEnum.APVL_PENDING.name();

		return stockRequestDetailsRepository.updateAllRequestItemStatus(status, stockRequest, statusList);
	}

	@Override
	public Optional<StockRequestDao> findByIdAndStatus(Integer stockRequestId, String status) {

		return stockRequestRepository.findByIdAndStatus(stockRequestId, status);

	}

	@Override
	public List<InventoryCountDto> getRequestCountByStatus(List<String> status) {

		return stockRequestRepository.getRequestCountByStatus(status);
	}

	@Override
	public Optional<StockRequestDao> findByIdAndRequestType(Integer requestId, String requestType) {

		return stockRequestRepository.findByIdAndRequestType(requestId, requestType);
	}

	@Override
	public Short getAcceptedItemQuantity(StockRequestDao stockRequest, String itemCode, String status) {

		return stockRequestDetailsRepository.getAcceptedItemQuantity(stockRequest, itemCode, status);
	}

	@Override
	public Short getApprovedItemQuantity(StockRequestDao stockRequest, String itemCode, String status) {

		return stockRequestDetailsRepository.getApprovedItemQuantity(stockRequest, itemCode, status);
	}

	@Override
	public Short getTotalApprovedQuantity(StockRequestDao stockRequest, String status) {
		if (stockRequest.getRequestType().equals(ApprovalRequestTypeEnum.CONV.name())
				&& status.equals(StockRequestStatusEnum.ACKNOWLEDGED.toString()))
			status = StockRequestStatusEnum.APVL_PENDING.name();

		return stockRequestDetailsRepository.getTotalApprovedQuantity(stockRequest, status);
	}

	@Override
	public RequestIBTCountDto getIBTCount(String locationCode, String requestType, List<String> statusList, Date businessDate) {
		return stockRequestRepository.getIBTCount(locationCode, requestType, statusList, businessDate);
	}

	@Override
	public Optional<StockRequestDao> findByStockRequestCriteria(Example<StockRequestDao> criteria) {
		return stockRequestRepository.findOne(criteria);

	}

	// Services related to stock request ends here

	@Override
	public RequestStockItemResponseDto getStockRequestItemByIdAndItemIdAndRequestType(Integer id, String itemId,
			String requestType) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		StockRequestDetailsDao stockRequestDetails = new StockRequestDetailsDao();
		Optional<StockRequestDetailsDao> stOptional = getStockRequestObject(id, itemId, requestType);
		if (stOptional.isPresent()) {
			stockRequestDetails = stOptional.get();
		}
		return getStockRequestResponseDto(productGroupList, productCategoryList, stockRequestDetails);
	}

	private RequestStockItemResponseDto getStockRequestResponseDto(Map<String, String> productGroupList,
			Map<String, String> productCategoryList, StockRequestDetailsDao stockRequestDetails) {
		RequestStockItemResponseDto reqstStockItemDto = (RequestStockItemResponseDto) MapperUtil
				.getDtoMapping(stockRequestDetails, RequestStockItemResponseDto.class);
		Optional<InventoryDetailsDaoExt> inventoryDetail = inventoryDetailsService
				.findById(stockRequestDetails.getInventoryId());
		if (inventoryDetail.isPresent()) {
			getReqStockItemDto(stockRequestDetails, reqstStockItemDto, inventoryDetail.get());
		} else {
			reqstStockItemDto.setAvailableQuantity((short) 0);
		}
		reqstStockItemDto.setProductCategory(stockRequestDetails.getProductCategory());
		reqstStockItemDto.setProductCategoryDesc(productCategoryList.get(stockRequestDetails.getProductCategory()));
		reqstStockItemDto.setProductGroup(stockRequestDetails.getProductGroup());
		reqstStockItemDto.setProductGroupDesc(productGroupList.get(stockRequestDetails.getProductGroup()));
		return reqstStockItemDto;
	}

	private void getReqStockItemDto(StockRequestDetailsDao stockRequestDetails,
			RequestStockItemResponseDto reqstStockItemDto, InventoryDetailsDaoExt inventoryDetailsDaoExt) {
		reqstStockItemDto.setAvailableQuantity((short) Math.min(
				(short) (inventoryDetailsDaoExt.getTotalQuantity() - inventoryDetailsDaoExt.getIssuedQuantity()),
				stockRequestDetails.getApprovedQuantity()));
		// will be updated in the Approval controller acc. to approved quantity
		reqstStockItemDto.setAvailableWeight(stockRequestDetails.getRequestedWeight());
		// will be updated in the Approval controller acc. to approved quantity
		reqstStockItemDto.setAvailableValue(new BigDecimal((short) Math.min(
				(inventoryDetailsDaoExt.getTotalQuantity() - inventoryDetailsDaoExt.getIssuedQuantity()),
				stockRequestDetails.getApprovedQuantity())).multiply(stockRequestDetails.getStdValue()));
		if (stockRequestDetails.getSelectedQuantity() == null) {
			reqstStockItemDto.setMeasuredValue(new BigDecimal(stockRequestDetails.getApprovedQuantity())
					.multiply(stockRequestDetails.getStdValue()));
		} else {
			reqstStockItemDto.setMeasuredValue(new BigDecimal(stockRequestDetails.getSelectedQuantity())
					.multiply(stockRequestDetails.getStdValue()));
		}
		if (stockRequestDetails.getIssuedWeight() == null) {
			reqstStockItemDto.setAvailableWeight(stockRequestDetails.getRequestedWeight());
		} else {
			BigDecimal availableWeight = stockRequestDetails.getRequestedWeight()
					.divide(BigDecimal.valueOf(stockRequestDetails.getRequestedQuantity()), MathContext.DECIMAL32);
			availableWeight = availableWeight.multiply(BigDecimal.valueOf(stockRequestDetails.getApprovedQuantity()));
			reqstStockItemDto.setAvailableWeight(availableWeight);
		}
		reqstStockItemDto.setMeasuredWeight(stockRequestDetails.getSelectedWeight());
		reqstStockItemDto.setMeasuredQuantity(stockRequestDetails.getSelectedQuantity());
		reqstStockItemDto.setMeasuredValue(stockRequestDetails.getRequestedValue());
	}

	private Optional<StockRequestDetailsDao> getStockRequestObject(Integer id, String itemId, String requestType) {
		StockRequestDao stockRequest = new StockRequestDao();
		stockRequest.setId(id);
		stockRequest.setRequestType(requestType);
		stockRequest.setSrcLocationCode(CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		StockRequestDetailsDao stockRequestDetails = new StockRequestDetailsDao();
		stockRequestDetails.setId(itemId);
		stockRequestDetails.setStockRequest(stockRequest);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StockRequestDetailsDao> criteria = Example.of(stockRequestDetails, matcher);
		return stockRequestDetailsRepository.findOne(criteria);
	}

	@Override
	public StockRequestDao save(StockRequestDao stockRequest) {
		return stockRequestRepository.save(stockRequest);
	}

	@Override
	public StockRequestDetailsDao save(StockRequestDetailsDao stockRequestDetails) {
		return stockRequestDetailsRepository.save(stockRequestDetails);
	}

	@Override
	public void updateStockRequestDetailsStatus(StockRequestDao stockRequest) {
		stockRequestDetailsRepository.updateStockRequestDetailsStatus(stockRequest);
	}

	@Override
	@Transactional
	public void updateIssueRequestItems(Integer id, String requestType, IssueStockItemBulkDto issueStockItemBulkDto) {
		StockRequestDao stockRequest = new StockRequestDao();
		stockRequest.setId(id);
		
		// cannot move from APPROVED to SELECTED in OTHER ISSUE
		if (!issueStockItemBulkDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.SELECTED.toString())) {
			throw new ServiceException("Invalid status : " + issueStockItemBulkDto.getStatus(), "ERR-INV-013");
		}
		if (!issueStockItemBulkDto.getItemIds().isEmpty()) {
			// call a join methode to get
			// min(invqty,approvedQty),min(requestedValue,inventoryValue),min(requestedWeight,inventoryTotalValue),
			// inventoryIds's,itemIds,quantity.
			List<Object[]> avblList = stockRequestDetailsRepository.getMultipleAvailableQuantityList(
					issueStockItemBulkDto.getItemIds(), StockRequestStatusEnum.APPROVED.toString());
			List<AvailableValues> availableList = setAvailableValues(avblList, id, issueStockItemBulkDto.getStatus(),stockRequest.getReqLocationCode());
			// updating min values
			updateAllOtherIssueRequestsBatch(availableList);
		}
		if (issueStockItemBulkDto.getItemIds().isEmpty()) {
			// call a join methode to get min(invqty,approvedQty)
			// inventoryIds's,itemIds,quantity.
			List<Object[]> avblList = stockRequestDetailsRepository.getAllAvailableQuantityList(id,
					StockRequestStatusEnum.APPROVED.toString());
			List<AvailableValues> availableList = setAvailableValues(avblList, id, issueStockItemBulkDto.getStatus(),stockRequest.getReqLocationCode());
			// updating min values
			updateAllOtherIssueRequestsBatch(availableList);
		}

		// Update Header Level according to the populated minValues.
		// issued value field is not available so not updating.
		stockRequestRepository.updateHeaderValuesOtherIssue(id, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());

	}

	private void updateAllOtherIssueRequestsBatch(List<AvailableValues> availableList) {
		SqlParameterSource[] batch = SqlParameterSourceUtils.createBatch(availableList.toArray());
		String s = "UPDATE stock_request_details SET selected_weight_details= :selectedWeightDetails, selected_quantity = :minQuantity , status = :status,"
				+ " selected_weight = :minWeight , requested_value = :minValue, last_modified_by=:lastModifiedBy ,last_modified_Date=:lastModifiedDate "
				+ " WHERE id = :itemId AND stock_request_id =:headerId ";
		namedparameterjdbctemplate.batchUpdate(s, batch);
	}

	private List<AvailableValues> setAvailableValues(List<Object[]> avblList, Integer id, String status,String reqLocationCode) {
		List<AvailableValues> availableQtyList = new ArrayList<>();
		for (Object[] l : avblList) {
			AvailableValues is = new AvailableValues();
			is.setItemId((String) l[0]);
			Integer qty = (int) l[1];
			is.setMinQuantity(qty.shortValue());
			is.setInventoryId((String) l[2]);
			is.setHeaderId(id);
			is.setStatus(status);
			is.setLastModifiedBy(CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
			is.setLastModifiedDate(new Date());
			is.setSelectedWeightDetails((String) l[3]);
			
			BigDecimal requestedWeight = (BigDecimal) l[4];
			Short requestedQuantity = (short) l[5];
			BigDecimal stdValue = (BigDecimal) l[6];
			is.setItemCode((String) l[7]);
			setissueToBTQTaxDetails(is,is.getItemCode(),stdValue,reqLocationCode);
			BigDecimal standardWeight = requestedWeight.divide(BigDecimal.valueOf(requestedQuantity),
					MathContext.DECIMAL32);
			// minWeight (SelectedWeight) = (reqWeight/req_quantity)*min_quantity
			BigDecimal minWeight = standardWeight.multiply(BigDecimal.valueOf(is.getMinQuantity()));
			is.setMinWeight(minWeight.setScale(3, RoundingMode.HALF_UP));
			// minValue (requestedValue)= stdValue*minQuantity
			BigDecimal value = BigDecimal.valueOf(is.getMinQuantity()).multiply(stdValue);
			is.setMinValue(value.setScale(3, RoundingMode.HALF_UP));
			availableQtyList.add(is);
		}
		return availableQtyList;
	}
	
	private void setissueToBTQTaxDetails(AvailableValues stockDetailDto, String itemCode,
			BigDecimal stdValue, String destLocation) {
		TaxCalculationResponseDto taxDetailsResponse = null;
		if (!StringUtils.isEmpty(itemCode) && !StringUtils.isEmpty(destLocation)) {
			taxDetailsResponse = engineClient.getTaxDetails(destLocation, 0,null,
					TxnTaxTypeEnum.INV_MANAGMNT_STOCK_ISSUE.name(), itemCode, false,false);
		
		Map<String, BigDecimal> taxDetails = new HashMap<>();
		Map<String, TaxDetailDto> data = new HashMap<>();
		TaxDetailDto sgstDetails = null;
		if (taxDetailsResponse != null) {
			data = taxDetailsResponse.getData();
			if (!CollectionUtils.isEmpty(data)) {
				if (data.get("SGST") != null) {
					sgstDetails = data.get("SGST");
					if (sgstDetails.getTaxPercentage() != null) {
						taxDetails.put("SGSTVal", stdValue.multiply(
								sgstDetails.getTaxPercentage().divide(ONE_HUNDRED)).setScale(2, RoundingMode.HALF_UP));
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
							taxDetails.put("UTGSTVal", stdValue.multiply(utgstDetails.getTaxPercentage()
									.divide(ONE_HUNDRED)).setScale(2, RoundingMode.HALF_UP));
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
						taxDetails.put("CGSTVal", stdValue.multiply(
								cgstDetails.getTaxPercentage().divide(ONE_HUNDRED)).setScale(2, RoundingMode.HALF_UP));
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
							taxDetails.put("IGSTVal", stdValue.multiply(igstDetails.getTaxPercentage()
									.divide(ONE_HUNDRED)).setScale(2, RoundingMode.HALF_UP));
							taxDetails.put("IGSTPct", igstDetails.getTaxPercentage());
						}
					}
				} else {
					taxDetails.put("IGSTVal", BigDecimal.ZERO);
					taxDetails.put("IGSTPct", BigDecimal.ZERO);

				}
			}
		}

		Map<String, Object> issueBTQtaxDetails = new LinkedHashMap<>();
		issueBTQtaxDetails.put("type", "TAX_DETAILS");
		issueBTQtaxDetails.put("data", taxDetails);
		stockDetailDto.setTaxDetails(MapperUtil.getStringFromJson(issueBTQtaxDetails).replace("\\", "")
				.replace("\"[", "[").replace("]\"", "]"));
//		JsonObject taxValueDetails = new JsonParser()
//				.parse(MapperUtil.getStringFromJson(stockDetailDto.getTaxDetails())).getAsJsonObject();
//		BigDecimal igstVal = taxValueDetails.getAsJsonObject("data").get("IGSTVal").getAsBigDecimal();
//		BigDecimal cgstVal = taxValueDetails.getAsJsonObject("data").get("CGSTVal").getAsBigDecimal();
//		BigDecimal sgstVal = taxValueDetails.getAsJsonObject("data").get("SGSTVal").getAsBigDecimal();
//		BigDecimal utgstVal = taxValueDetails.getAsJsonObject("data").get("UTGSTVal").getAsBigDecimal();
		//BigDecimal finalTax = igstVal.add(cgstVal).add(sgstVal).add(utgstVal);
		//stockDetailDto.setTotalTax(finalTax.setScale(2, RoundingMode.HALF_UP));
		//stockDetailDto
		//		.setFinalValue(stockDetailDto.getAvailableValue().add(finalTax).setScale(2, RoundingMode.HALF_UP));
		}else {
			stockDetailDto.setTaxDetails(null);
		}

	}

	@Override
	public List<Object[]> listOtherRequestAvailableItems(ItemsParamListDto params, Pageable pageable) {
		return stockRequestDetailsRepository.getJointList(params.getHeaderId(), params.getBinGroupCode(),
				params.getProductGroup(), params.getStatus(), params.getItemCode(), params.getLotNumber(),
				params.getLocationCode(), params.getProductCategory(), params.getProductGroupList(),
				params.getBinCodeList(), params.getSortParameter() == null ? "NULL" : params.getSortParameter(),
				pageable.getPageSize() * pageable.getPageNumber(), pageable.getPageSize());
	}

	// Service Implementations related to other requests starts here

	@Override
	public Integer findOtherRequestPageSize(ItemsParamListDto params, Pageable pageable) {
		return stockRequestDetailsRepository.getPageSize(params.getHeaderId(), params.getBinGroupCode(),
				params.getProductGroup(), params.getStatus(), params.getItemCode(), params.getLotNumber(),
				params.getLocationCode(), params.getProductCategory(), params.getProductGroupList(),
				params.getBinCodeList());
	}

	@Override
	public List<StockRequestDao> findAllByRequestTypeAndStatusAndSrcLocationCode(String reqType, String status,
			String srcLocationCode) {
		return stockRequestRepository.findAllByRequestTypeAndStatusAndSrcLocationCode(reqType, status, srcLocationCode);
	}

	@Override
	public StockRequestDao getOne(Integer id) {
		return stockRequestRepository.getOne(id);
	}

	@Override
	public StockRequestDetailsDao getOne(String itemId) {
		return stockRequestDetailsRepository.getOne(itemId);
	}

	@Override
	public List<StockRequestDetailsDao> findByStockRequest(StockRequestDao stockRequest) {
		return stockRequestDetailsRepository.findByStockRequest(stockRequest);
	}

	@Override
	public List<StockRequestDetailsDao> findAllById(List<String> itemIds) {
		return stockRequestDetailsRepository.findAllById(itemIds);
	}

	@Override
	public void deleteInBatch(List<StockRequestDetailsDao> stockRequestDetailsList) {
		stockRequestDetailsRepository.deleteInBatch(stockRequestDetailsList);
	}

	@Override
	@Transactional
	public void updateTotalValues(Short totalQuantity, BigDecimal totalWeight, BigDecimal totalValue, Integer id,
			Date lastModifiedDate, String lastModifiedBy) {
		stockRequestRepository.updateTotalValues(totalQuantity, totalWeight, totalValue, id,
				OtherRequestStatusEnum.OPEN.toString(), lastModifiedDate, lastModifiedBy);

	}

	@Override
	public void updatingTotalWeightAndQuantity(Integer id, Date lastModifiedDate, String lastModifiedBy) {
		stockRequestRepository.updatingTotalWeightAndQuantity(id, lastModifiedDate, lastModifiedBy);
	}

	// Service Implementations related to other requests ends here

	@Override
	public List<Object[]> checkAvailableQuantityWithInventory(Integer id) {
		return stockRequestRepository.checkAvailableQuantityWithInventory(id);
	}

	@Override
	public List<Object[]> checkBinValidationWithInventoryStockIssue(Integer id) {
		return stockRequestRepository.checkBinValidationWithInventory(id);
	}

	@Override
	public List<Object[]> checkBinValidationWithInventoryOtherIssue(Integer id) {
		return stockRequestRepository.checkBinValidationWithInventoryOtherIssue(id);
	}

	@Override
	public List<StockRequestDetailsDao> findByStockRequestAndStatus(StockRequestDao stockRequest, String status) {
		return stockRequestDetailsRepository.findByStockRequestAndStatus(stockRequest, status);
	}

	@Override
	public Optional<StockRequestDao> findByIdAndRequestTypeAndStatusIn(Integer stockRequestId, String reqType,
			List<String> statusList) {
		return stockRequestRepository.findByIdAndRequestTypeAndStatusIn(stockRequestId, reqType, statusList);
	}

	@Override
	@Transactional
	// For ALL StockIssues
	public void updateStockIssueRequestItems(Integer id, String requestType,
			IssueStockItemBulkDto issueStockItemBulkDto) {
		StockRequestDao stockRequest = new StockRequestDao();
		stockRequest.setId(id);
		stockRequest=stockRequestRepository.findOneById(stockRequest.getId());
		if (!issueStockItemBulkDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.APPROVED.toString())
				&& !issueStockItemBulkDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.SELECTED.toString())) {
			throw new ServiceException("Invalid status : " + issueStockItemBulkDto.getStatus(), "ERR-INV-026");
		}
		if (issueStockItemBulkDto.getStatus().equals(StockRequestStatusEnum.SELECTED.toString())) {
			// updates status from APPROVED to SELECTED
			updateItemsToSelectedStatus(id, issueStockItemBulkDto,stockRequest);
		} else if (issueStockItemBulkDto.getStatus().equals(StockRequestStatusEnum.APPROVED.toString())) {
			// updates status from SELECTED to APPROVED
			updateItemsToApprovedStatus(id, issueStockItemBulkDto,stockRequest);
		}
	}

	// updates status from APPROVED to SELECTED
	private void updateItemsToSelectedStatus(Integer id, IssueStockItemBulkDto issueStockItemBulkDto,StockRequestDao stockReq) {
		if (!issueStockItemBulkDto.getItemIds().isEmpty()) {
			// call a join methode to get
			// min(invqty,approvedQty),min(requestedValue,inventoryValue),min(requestedWeight,inventoryTotalValue),
			// inventoryIds's,itemIds,quantity.
			// to fetch with existing status
			// to get min of inventory, request details to make it selected
			List<Object[]> avblList = stockRequestDetailsRepository.getMultipleAvailableQuantityList(
					issueStockItemBulkDto.getItemIds(), StockRequestStatusEnum.APPROVED.toString());
			// to update APPROVED to SELECTED
			List<AvailableValues> availableList = setAvailableValues(avblList, id, issueStockItemBulkDto.getStatus(),stockReq.getReqLocationCode());
			// updating min values
			updateAllStockIssueRequestsBatch(availableList);
		}
		if (issueStockItemBulkDto.getItemIds().isEmpty()) {
			// call a join methode to get min(invqty,approvedQty)
			// inventoryIds's,itemIds,quantity.
			List<Object[]> avblList = stockRequestDetailsRepository.getAllAvailableQuantityList(id,
					StockRequestStatusEnum.APPROVED.toString());
			List<AvailableValues> availableList = setAvailableValues(avblList, id, issueStockItemBulkDto.getStatus(),stockReq.getReqLocationCode());
			// updating min values
			updateAllStockIssueRequestsBatch(availableList);
		}
		// Update Header Level according to the populated minValues.
		// issued value field is not available so not updating.
		stockRequestRepository.updateHeaderValuesStockIssue(id, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
	}

	// updates status from SELECTED to APPROVED
	private void updateItemsToApprovedStatus(Integer id, IssueStockItemBulkDto issueStockItemBulkDto,StockRequestDao stockReq) {
		// need to update quantity weight accordingly.
		if (!issueStockItemBulkDto.getItemIds().isEmpty()) {
			// update selected_quantity to 0,issued_weight to 0.0
			List<String> itemIds = issueStockItemBulkDto.getItemIds();
			stockRequestRepository.updateSelectedValues(itemIds);
		}
		if (issueStockItemBulkDto.getItemIds().isEmpty()) {
			Optional<StockRequestDao> stockRequest = stockRequestRepository.findById(id);
			if (stockRequest.isPresent()) {
				List<StockRequestDetailsDao> reqDtls = stockRequestDetailsRepository
						.findByStockRequestAndStatus(stockRequest.get(), StockRequestStatusEnum.SELECTED.toString());

				List<String> itemIds = reqDtls.stream().map(StockRequestDetailsDao::getId).collect(Collectors.toList());
				stockRequestRepository.updateSelectedValues(itemIds);
			} else {
				throw new ServiceException("", "");
			}
		}
		// Update Header Level according to the populated minValues.
		// issued value field is not available so not updating.
		stockRequestRepository.updateHeaderValuesStockIssue(id, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());

	}

	private void updateAllStockIssueRequestsBatch(List<AvailableValues> availableList) {
		SqlParameterSource[] batch = SqlParameterSourceUtils.createBatch(availableList.toArray());
		String s = "UPDATE stock_request_details SET selected_weight_details = :selectedWeightDetails, selected_quantity = :minQuantity , status = :status,"
				+ " selected_weight = :minWeight , requested_value = :minValue,tax_details= :taxDetails,last_modified_by=:lastModifiedBy ,last_modified_Date=:lastModifiedDate "
				+ " WHERE id = :itemId AND stock_request_id =:headerId ";
		namedparameterjdbctemplate.batchUpdate(s, batch);
	}

	@Override
	public void cancelRequestDetails(StockRequestDao otherRequest, String toStatus, String fromStatus) {
		stockRequestRepository.updateRequestCancellation(otherRequest, toStatus, fromStatus);

	}

	@Override
	public Page<StockRequestDetailsDao> listStockRequestItems(StockRequestDao stRequest, String requestType,
			String itemCode, List<String> productGroup, List<String> productCategory, String lotNumber,
			List<String> binCode, String binGroupCode, String status, Pageable pageable) {
		return stockRequestDetailsRepository.listStockRequestItems(binCode, itemCode, productCategory, productGroup,
				binGroupCode, lotNumber, status, stRequest, pageable);
	}

	@Override
	public Page<StockRequestDao> findAllByRequestTypeAndMultipleStatusAndSrcLocationCode(String requestType,
			List<String> status, String srcLocationCode, Pageable pageable) {
		return stockRequestRepository.findBySrcLocationCodeAndRequestTypeAndStatusIn(srcLocationCode, requestType,
				status, pageable);
	}

	@Override
	public Page<StockRequestDao> findByRequestTypeAndReqDocNoAndSrcLocationCodeAndStatusIn(String requestType,
			Integer reqDocNo, String srcLocationCode, List<String> status, Pageable pageable) {
		return stockRequestRepository.findByRequestTypeAndReqDocNoAndSrcLocationCodeAndStatusIn(requestType, reqDocNo,
				srcLocationCode, status, pageable);
	}

	@Override
	public Integer getSelectedItemsCount(Integer id, String status) {
		return stockRequestDetailsRepository.getSelectedItemsCount(id, status);
	}

	@Override
	@Transactional
	public void updateHeaderValuesStockIssue(Integer id) {
		// Update Header Level according to the populated minValues.
		// issued value field is not available so not updating.
		stockRequestRepository.updateHeaderValuesStockIssue(id, new Date(),
				CustomSecurityPrincipal.getSecurityPrincipal().getUsername());
	}

	@Override
	public List<StockRequestDetailsDao> findByItemCodeAndLotNumberAndRequestedWeightAndStatus(String itemCode,
			String lotNumber, BigDecimal requestedWeight, String status) {
		return stockRequestDetailsRepository.findByItemCodeAndLotNumberAndRequestedWeightAndStatus(itemCode, lotNumber,
				requestedWeight, status);
	}

	@Override
	public Page<StockRequestDetailsDao> findAllStockRequestItems(StockRequestDao stockRequest, String status,
			List<String> productCategory, List<String> productGroup, String itemCode, String lotNumber,
			Pageable pageable) {
		return stockRequestDetailsRepository.findAllRequestItems(stockRequest, status, productCategory, productGroup,
				itemCode, lotNumber, pageable);
	}

	@Override
	public List<Object[]> validateDefectiveAndDisputeItems(List<String> inventoryIds) {
		return inventoryDetailsService.validateDefectiveAndDisputeItems(inventoryIds);
	}

	@Override
	public Page<StockRequestDao> findStockRequestHistoryBySrcLocationCodeAndRequestType(String requestType,
			String srcLocationCode, HistoryIssueRequestDto historyIssueRequestDto, Date startDate, Date endDate,
			List<String> statuses, Pageable pageable) {
		if (historyIssueRequestDto.getDateType()==null
				|| historyIssueRequestDto.getDateType().equals(DateTypeEnum.REQUESTDATE)) {
			return stockRequestRepository.findStockRequestHistoryBySrcLocationCodeAndRequestType(requestType,
					historyIssueRequestDto.getReqDocNo(), srcLocationCode, historyIssueRequestDto.getLocationCode(),
					startDate, endDate, statuses, historyIssueRequestDto.getReqFiscalYear(), pageable);
		} else if (historyIssueRequestDto.getDateType().equals(DateTypeEnum.ACCEPTEDDATE)) {
			return stockRequestRepository.findStockRequestHistoryBySrcLocationCodeAndAcceptedDate(requestType,
					historyIssueRequestDto.getReqDocNo(), srcLocationCode, historyIssueRequestDto.getLocationCode(),
					startDate, endDate, statuses, historyIssueRequestDto.getReqFiscalYear(), pageable);
		}
		return null;

	}

	@Override
	public Page<StockRequestDetailsDao> listStockIssueItemsHistory(StockRequestDao stRequest,
			HistoryIssueItemRequestDto historyIssueItemRequestDto, Pageable pageable) {
		return stockRequestDetailsRepository.listStockIssueItemsHistory(historyIssueItemRequestDto.getBinCodes(),
				historyIssueItemRequestDto.getItemCode(), historyIssueItemRequestDto.getProductCategories(),
				historyIssueItemRequestDto.getProductGroups(), historyIssueItemRequestDto.getBinGroupCode(),
				historyIssueItemRequestDto.getLotNumber(), stRequest, pageable);
	}

	@Override
	public StockRequestDao findById(Integer id) {
		return stockRequestRepository.findById(id)
				.orElseThrow(() -> new ServiceException("Record(s) not found for this id : " + id, "ERR-INV-029"));
	}

	@Override
	public Page<StockRequestDao> findStockRequestHistoryByDestLocationCodeAndRequestType(String requestType,
			String destLocationCode, HistoryIssueRequestDto historyIssueRequestDto, Date startDate, Date endDate,
			List<String> statuses, Pageable pageable) {
		if (historyIssueRequestDto.getDateType()==null
				|| historyIssueRequestDto.getDateType().equals(DateTypeEnum.REQUESTDATE)) {
			return stockRequestRepository.findStockRequestHistoryByDestLocationCodeAndRequestType(requestType,
					historyIssueRequestDto.getReqDocNo(), historyIssueRequestDto.getLocationCode(), destLocationCode,
					startDate, endDate, statuses, historyIssueRequestDto.getReqFiscalYear(), pageable);
		} else if (historyIssueRequestDto.getDateType().equals(DateTypeEnum.ACCEPTEDDATE)) {
			return stockRequestRepository.findStockRequestHistoryByDestLocationCodeAndAcceptedDate(requestType,
					historyIssueRequestDto.getReqDocNo(), historyIssueRequestDto.getLocationCode(), destLocationCode,
					startDate, endDate, statuses, historyIssueRequestDto.getReqFiscalYear(), pageable);
		}
		return null;

	}

	@Override
	public List<StockRequestDao> findAllStockRequestBySrcLocationCodeAndRequestTypeAndStatus(String srcLocationCode,
			String requestType, String status) {
		return stockRequestRepository.findByRequestTypeAndSrcLocationCodeAndStatus(requestType, srcLocationCode,
				status);
	}

	@Override
	public List<StockRequestDetailsDao> findByItemCodeAndLotNumberAndRequestedWeightAndStatusAndListStockRequest(
			String itemCode, String lotNumber, BigDecimal requestedWeight, String status,
			List<StockRequestDao> stockRequestDaos) {
		return stockRequestDetailsRepository.findByItemCodeAndLotNumberAndRequestedWeightAndStatusAndStockRequestIn(
				itemCode, lotNumber, requestedWeight, status, stockRequestDaos);
	}

	private StockRequestDao getStockRequestObject(Optional<StockRequestDao> stReqOptional) {
		if (!stReqOptional.isPresent()) {
			throw new ServiceException("Records not found", "ERR-INV-029");
		}
		return stReqOptional.get();
	}

	// New implementation
	@Override
	public Page<StockRequestDao> findAllActiveStockRequests(String requestType, Integer reqDocNo, String status,
			String srcLocationCode, String reqLocationCode, List<String> historyStatus, Integer historyTime,
			Pageable pageable) {
		return stockRequestRepository.findAllActiveStockRequests(requestType, reqDocNo, status, srcLocationCode,
				reqLocationCode, historyStatus, historyTime, pageable);
	}

	@Override
	public StockRequestDao findStockRequestByIdAndSrcLocationCodeAndRequestType(Integer id, String locationCode,
			String requestType) {
		Optional<StockRequestDao> stReqOptional = stockRequestRepository.findByIdAndSrcLocationCodeAndRequestType(id,
				locationCode, requestType);
		return getStockRequestObject(stReqOptional);
	}

	@Override
	public StockRequestDao findStockReuqestByIdAndDestLocationCodeAndRequestType(Integer id, String locationCode,
			String requestType) {
		Optional<StockRequestDao> stReqOptional = stockRequestRepository.findByIdAndDestLocationCodeAndRequestType(id,
				locationCode, requestType);
		return getStockRequestObject(stReqOptional);
	}

	// checking if items were adding again for PSV
	@Override
	public List<StockRequestDetailsDao> listItemsPsv(List<String> id, String locationCode) {
		// TODO Auto-generated method stub
		return stockRequestRepository.getItemsListForPSV(id, locationCode);
	}

	@Override
	public List<StockRequestDao> findAllByStatusAndComConfirm(String status, Boolean comConfirm) {
		
		return stockRequestRepository.findAllByStatusAndComConfirm(status, comConfirm);
	}

}
