/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.config.dto.request.json.HistoryTimeRuleDetails;
import com.titan.poss.config.dto.request.json.IbtRuleDetails;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.response.StringResponse;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.inventory.acl.InventoryAccessControls;
import com.titan.poss.inventory.constant.DocTypeEnum;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dto.RequestIBTCountDto;
import com.titan.poss.inventory.dto.StockRequestItemFilterDto;
import com.titan.poss.inventory.dto.constants.BinGroupEnum;
import com.titan.poss.inventory.dto.constants.InvConfigType;
import com.titan.poss.inventory.dto.constants.RequestGroupEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.StockRequestTypeEnum;
import com.titan.poss.inventory.dto.request.ComStockRequestDto;
import com.titan.poss.inventory.dto.request.RequestStockItemDto;
import com.titan.poss.inventory.dto.request.StockRequestCreateDto;
import com.titan.poss.inventory.dto.request.StockRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.StockRequestUpdateDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.RequestDtlsInsertResponseDto;
import com.titan.poss.inventory.dto.response.StockRequestDto;
import com.titan.poss.inventory.dto.response.StockRequestItemDto;
import com.titan.poss.inventory.facade.StockRequestFacade;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.InventoryDocMasterService;
import com.titan.poss.inventory.service.LocationService;
import com.titan.poss.inventory.service.StockRequestService;
import com.titan.poss.inventory.service.StockTransferService;

/**
 * Facade implementation layer of stock request controller
 * 
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Service
public class StockRequestFacadeImpl implements StockRequestFacade {

	private static final String INVALID_REQUEST = "Invalid Request.Please Check";

	private static final String ERR_INV_022 = "ERR-INV-022";

	private static final String RECORD_NOT_FOUND = "Records not found";

	private static final String ERR_INV_029 = "ERR-INV-029";

	private static final String ERR_INV_013 = "ERR-INV-013";

	private static final String ACPT_QUANTITY_GT_REQ_QUANTITY = "accepted quantity can't be more than requested quantity";

	private static final String APPROVED = "APPROVED";

	private static final String COM_ORDER_REQUESTED = "Com Order Requested";

	private static final String ERR_INV_053 = "ERR-INV-053";

	private static final String SAVED_SUCCESSFULLY = "Saved Successfully";

	private static final String CUSTOMER_ORDER_STOCK_REQUEST_CAN_NOT_BE_NULL = "Customer order stock request can not be null";

	private static final String ERR_INV_054 = "ERR-INV-054";

	

	private static final Logger LOGGER = LoggerFactory.getLogger(StockRequestFacadeImpl.class);

	private List<String> historyStatus = Arrays.asList(StockRequestStatusEnum.ACPT_REJECTED.toString(),
			StockRequestStatusEnum.APVL_REJECTED.toString(), StockRequestStatusEnum.CANCELLED.toString(),
			StockRequestStatusEnum.EXPIRED.toString(), StockRequestStatusEnum.ISSUE_REJECTED.toString(),
			StockRequestStatusEnum.APPROVED.toString(), StockRequestStatusEnum.ISSUED.toString());

	@Autowired
	protected StockRequestService stockRequestService;

	@Autowired
	StockTransferService stockTransferService;

	@Autowired
	InventoryDetailsService inventoryDetailsService;

	@Autowired
	public InventoryDocMasterService inventoryDocMasterService;

	@Autowired
	LocationService locationService;

	@Autowired
	EngineService engineService;
	
	@Override
	public ListResponse<InventoryCountDto> getStockRequestCount() {

		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<InventoryCountDto> requestCount = new ArrayList<>();
		String requestType = StockRequestTypeEnum.BTQ.toString();
		String locationCode = authUser.getLocationCode();

		// Should be fetched from History Time Configurations
		String ruleType = RuleTypeEnum.HISTORY_TIME_CONFIGURATION.toString();

		Object response = engineService.getRuleFieldValues(ruleType, new RuleRequestListDto());

		HistoryTimeRuleDetails value = MapperUtil.getObjectMapperInstance().convertValue(response,
				HistoryTimeRuleDetails.class);

		Integer historyTime = Integer.valueOf(value.getMaxTimeToMovTransHist());

		// To get SENT request count
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.REQUEST_IBT_REQUESTS_SENT))) {

			Long reqSentCount = stockRequestService.findStockRequestCountGroupBy(locationCode, requestType,
					historyStatus, historyTime, RequestGroupEnum.SENT.toString());

			LOGGER.debug("Request count sent by - {},{}", locationCode, reqSentCount);
			InventoryCountDto reqSent = new InventoryCountDto(RequestGroupEnum.SENT.toString(), reqSentCount);

			requestCount.add(reqSent);
		}
		// To get RECEIVED request count
		if (authUser.getAuthorities()
				.contains(new SimpleGrantedAuthority(InventoryAccessControls.REQUEST_IBT_REQUESTS_RECEIVED))) {

			Long reqReceivedCount = stockRequestService.findStockRequestCountGroupBy(locationCode, requestType,
					historyStatus, historyTime, RequestGroupEnum.RECEIVED.toString());
			LOGGER.debug("Request received count for - {},{}", locationCode, reqReceivedCount);
			InventoryCountDto reqReceived = new InventoryCountDto(RequestGroupEnum.RECEIVED.toString(),
					reqReceivedCount);

			requestCount.add(reqReceived);
		}
		LOGGER.debug("Total request count at - {},{}", locationCode, requestCount.size());

		return new ListResponse<>(requestCount);
	}

	@Override
	public PagedRestResponse<List<StockRequestDto>> listStockRequests(String requestType, String requestGroup,
			Integer reqDocNo, String status, String srcLocationCode, String reqLocationCode, Pageable pageable) {
		Page<StockRequestDao> requestList = null;
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();

		if (requestType.equalsIgnoreCase(StockRequestTypeEnum.BTQ.toString()) && requestGroup != null) {
			// If requestGroup is SENT , reqLocationCode should be same as that of in token
			if (requestGroup.equalsIgnoreCase(RequestGroupEnum.SENT.toString())) {
				reqLocationCode = authUser.getLocationCode();
			}
			// If requestGroup is RECEIVED , srcLocationCode should be same as that of in
			// token
			else if (requestGroup.equalsIgnoreCase(RequestGroupEnum.RECEIVED.toString())) {
				srcLocationCode = authUser.getLocationCode();
			}

			// Should be fetched from History Time Configurations
			String ruleType = RuleTypeEnum.HISTORY_TIME_CONFIGURATION.toString();

			Object response = engineService.getRuleFieldValues(ruleType, new RuleRequestListDto());

			HistoryTimeRuleDetails value = MapperUtil.getObjectMapperInstance().convertValue(response,
					HistoryTimeRuleDetails.class);

			Integer historyTime = Integer.valueOf(value.getMaxTimeToMovTransHist());
			requestList = stockRequestService.findAllActiveStockRequests(requestType, reqDocNo, status, srcLocationCode,
					reqLocationCode, historyStatus, historyTime, pageable);

		} else {
			LOGGER.debug(
					"Invalid request for requestType - {} or requestGroup - {} or reqDocNo - {} or status - {} or srcLocationCode - {} or reqlocationCode - {} or authuser location code - {} of incorrect combinations",
					requestType, requestGroup, reqDocNo, status, srcLocationCode, reqLocationCode,
					authUser.getLocationCode());
			throw new ServiceException(INVALID_REQUEST, ERR_INV_013);
		}
		List<StockRequestDto> requestDtls = new ArrayList<>();
		// Map Dao to DTO response
		if (requestList != null && !requestList.isEmpty()) {
			LOGGER.debug("Stock Request List Size - {}", requestList.getSize());
			for (StockRequestDao stockRequest : requestList) {
				StockRequestDto requestDtl = (StockRequestDto) MapperUtil.getDtoMapping(stockRequest,
						StockRequestDto.class);
				requestDtls.add(requestDtl);
			}
			LOGGER.debug("Stock Request Dto list size - {}", requestDtls.size());
		}
		return new PagedRestResponse<>(requestDtls, requestList);
	}

	private Example<StockRequestDao> generateStockRequestCriteria(String requestType, Integer requestId,
			String requestGroup, AuthUser authUser) {
		StockRequestDao stockRequest = new StockRequestDao();
		stockRequest.setRequestType(requestType);
		stockRequest.setId(requestId);
		// To list Request sent, filter on req location code
		if (requestGroup.equalsIgnoreCase(RequestGroupEnum.SENT.toString())) {
			stockRequest.setReqLocationCode(authUser.getLocationCode());
		}
		// To list Request Received, filter on src location code
		else if (requestGroup.equalsIgnoreCase(RequestGroupEnum.RECEIVED.toString())) {
			stockRequest.setSrcLocationCode(authUser.getLocationCode());
		}
		LOGGER.debug("Stock Request Example criteria - {}", stockRequest);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockRequest, matcher);

	}

	@Override
	public StockRequestDto getStockRequest(Integer stockRequestId, String requestType, String requestGroup) {
		Optional<StockRequestDao> stockRequest;
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();

		if (requestType != null && requestType.equalsIgnoreCase(StockRequestTypeEnum.BTQ.toString())) {
			Example<StockRequestDao> stockrequestCriteria = generateStockRequestCriteria(requestType, stockRequestId,
					requestGroup, authUser);
			stockRequest = stockRequestService.findByStockRequestCriteria(stockrequestCriteria);
		} else {
			LOGGER.debug(
					"Invalid request for requestType - {}  or authuser location code - {} of incorrect combinations",
					requestType, authUser.getLocationCode());
			throw new ServiceException(INVALID_REQUEST, ERR_INV_013);
		}
		if (!stockRequest.isPresent()) {
			LOGGER.debug(
					"Record not found for requestType - {} or requestId - {} or requestGroup - {} or authuser location code - {} of incorrect combinations",
					requestType, stockRequestId, requestGroup, authUser.getLocationCode());
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}
		return (StockRequestDto) MapperUtil.getDtoMapping(stockRequest.get(), StockRequestDto.class);
	}

	@Override
	public PagedRestResponse<List<StockRequestItemDto>> listStockRequestItems(Integer stockRequestId,
			String requestType, String requestGroup, String itemCode, String productGroup, String productCategory,
			String lotNumber, String binCode, String binGroupCode, String status, Pageable pageable) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<StockRequestItemDto> listProductDtls = new ArrayList<>();
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		Page<StockRequestDetailsDao> listItem = null;
		Optional<StockRequestDao> stockRequest;

		Example<StockRequestDao> stockrequestCriteria = generateStockRequestCriteria(requestType, stockRequestId,
				requestGroup, authUser);
		stockRequest = stockRequestService.findByStockRequestCriteria(stockrequestCriteria);

		if (!stockRequest.isPresent()) {
			LOGGER.debug(
					"Record not found for requestType - {} or requestId - {} or requestGroup - {} or authuser location code - {} of incorrect combinations",
					requestType, stockRequestId, requestGroup, authUser.getLocationCode());
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}

		StockRequestItemFilterDto stockRequestItemFilterDto = new StockRequestItemFilterDto(itemCode, productGroup,
				productCategory, lotNumber, binCode, binGroupCode, status);

		Example<StockRequestDetailsDao> criteria = generateCriteriaForStockRequestItems(stockRequestId, requestType,
				requestGroup, stockRequestItemFilterDto, authUser.getLocationCode());
		listItem = stockRequestService.findAllStockRequestItems(criteria, pageable);

		// TO DO: Items Not found error need to throw?
		if (!listItem.isEmpty() && listItem.get().count() > 0) {
			List<String> inventoryIds = listItem.stream().map(StockRequestDetailsDao::getInventoryId)
					.collect(Collectors.toList());
			List<InventoryDetailsDaoExt> inventoryDetailsList = inventoryDetailsService
					.getInventoryDetailsByIdList(inventoryIds);
			Map<String, InventoryDetailsDaoExt> inventoryDetailsMap = inventoryDetailsList.stream()
					.collect(Collectors.toMap(InventoryDetailsDaoExt::getId, invDetails -> invDetails));
			for (StockRequestDetailsDao stockRequestDetail : listItem) {
				StockRequestItemDto productDtls = (StockRequestItemDto) MapperUtil.getDtoMapping(stockRequestDetail,
						StockRequestItemDto.class);
				productDtls.setItemDetails(MapperUtil.getJsonFromString(stockRequestDetail.getItemDetails()));
				productDtls.setImageURL(new URLUtil().getImageUrlByItemCode(stockRequestDetail.getItemCode()));
				productDtls.setAvailableQuantity(inventoryDetailsMap.containsKey(stockRequestDetail.getInventoryId())
						? (short) (inventoryDetailsMap.get(stockRequestDetail.getInventoryId()).getTotalQuantity()
								- inventoryDetailsMap.get(stockRequestDetail.getInventoryId()).getIssuedQuantity())
						: 0);

				productDtls.setProductCategory(stockRequestDetail.getProductCategory());
				productDtls.setProductCategoryDesc(productCategoryList.get(stockRequestDetail.getProductCategory()));
				productDtls.setProductGroup(stockRequestDetail.getProductGroup());
				productDtls.setProductGroupDesc(productGroupList.get(stockRequestDetail.getProductGroup()));
				productDtls.setTaxDetails(MapperUtil.getJsonFromString(stockRequestDetail.getTaxDetails()));
				listProductDtls.add(productDtls);
			}
			LOGGER.debug("listProductDtls Count - {}", listProductDtls.size());
		}
		return new PagedRestResponse<>(listProductDtls, listItem);
	}

	@Transactional
	@Override
	public StockRequestDto createStockRequest(String requestType, StockRequestCreateDto stockRequestCreateDto) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		StockRequestDao createdStockRequest;

		if (stockRequestCreateDto.getSrcLocationCode().equalsIgnoreCase(authUser.getLocationCode())
				&& requestType.equalsIgnoreCase(StockRequestTypeEnum.BTQ.toString())) {
			LOGGER.debug("IBT Stock request can't be made within a boutique- {},{}",
					stockRequestCreateDto.getSrcLocationCode(), authUser.getLocationCode());
			throw new ServiceException("Stock Request can't be made within a boutique.Please check the location code",
					"ERR-INV-008");

		}
		if (requestType.equalsIgnoreCase(StockRequestTypeEnum.BTQ.toString())) {
			// TO DO: System check , if any request is pending against same item code or not

			createdStockRequest = insertStockRequest(stockRequestCreateDto, authUser, requestType);
			RequestDtlsInsertResponseDto requestDtlsInsertResponseDto = insertStockRequestDetails(stockRequestCreateDto,
					createdStockRequest);
			// TO DO: Do this check required?
			if (requestDtlsInsertResponseDto.getTotalRequestCreatedItems() < stockRequestCreateDto.getItems().size()) {
				List<String> requestStatus = new ArrayList<>(Arrays.asList(StockRequestStatusEnum.OPEN.toString(),
						StockRequestStatusEnum.REQUESTED.toString()));
				StockRequestUpdateDto stockRequestUpdateDto = new StockRequestUpdateDto();
				stockRequestUpdateDto.setStatus(StockRequestStatusEnum.CANCELLED.toString());
				stockRequestUpdateDto.setRemarks("Auto cancelled");
				rejectStockRequest(stockRequestUpdateDto, authUser, createdStockRequest, requestStatus);
			}
			CountryDetailsDto countryDetailsDto = getCountryDetails(
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
			createdStockRequest
					.setReqDocNo(inventoryDocMasterService.getDocNumber(countryDetailsDto.getFiscalYear().shortValue(),
							authUser.getLocationCode(), DocTypeEnum.STNREQUEST.toString()));
			createdStockRequest.setTotalRequestedQuantity(requestDtlsInsertResponseDto.getTotalRequestedQuantity());
			createdStockRequest.setTotalRequestedWeight(requestDtlsInsertResponseDto.getTotalRequestedWeight());
			createdStockRequest.setTotalRequestedValue(requestDtlsInsertResponseDto.getTotalRequestedValue());
			createdStockRequest.setStatus(StockRequestStatusEnum.REQUESTED.toString());
			stockRequestService.saveStockRequest(createdStockRequest);
		} else {
			LOGGER.debug(
					"Invalid request for requestType - {}  or authuser location code - {} of incorrect combinations",
					requestType, authUser.getLocationCode());
			throw new ServiceException(INVALID_REQUEST, ERR_INV_013);
		}
		return (StockRequestDto) MapperUtil.getDtoMapping(createdStockRequest, StockRequestDto.class);
	}

	@Transactional
	@Override
	public StockRequestItemDto updateStockRequestItem(Integer stockRequestId, String itemId, String requestType,
			StockRequestItemUpdateDto itemUpdateDto) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();
		Optional<StockRequestDao> stockRequest;
		Optional<InventoryDetailsDaoExt> inventoryDetails;
		StockRequestDetailsDao updateRequestDetail;
		Short acceptedItemQuantity;
		List<String> itemAcceptanceStatus = new ArrayList<>(
				Arrays.asList(StockRequestStatusEnum.REQUESTED.toString(), StockRequestStatusEnum.ACCEPTED.toString()));
		if (itemUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ACCEPTED.toString())
				|| itemUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ACPT_REJECTED.toString())) {
			stockRequest = stockRequestService.findByIdAndSrcLocationCodeAndRequestTypeAndStatus(stockRequestId,
					CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode(), requestType,
					StockRequestStatusEnum.REQUESTED.toString());
			if (stockRequest.isPresent() && CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode() != null
					&& CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode()
							.equalsIgnoreCase(stockRequest.get().getSrcLocationCode())) {
				Optional<StockRequestDetailsDao> requestItem = stockRequestService
						.findByIdAndStatusInAndStockRequest(itemId, itemAcceptanceStatus, stockRequest.get());
				if (requestItem.isPresent()) {
					acceptedItemQuantity = stockRequestService.getAcceptedItemQuantity(stockRequest.get(),
							requestItem.get().getItemCode(), StockRequestStatusEnum.ACCEPTED.toString());
					validationForAcceptedQuantity(itemUpdateDto, acceptedItemQuantity, requestItem.get());
					inventoryDetails = inventoryDetailsService.findById(requestItem.get().getInventoryId());
					LOGGER.debug("Inventory Details - {}",
							inventoryDetails.isPresent() ? inventoryDetails.get() : null);
					validationForAvailableQuantity(itemUpdateDto, inventoryDetails);
					LOGGER.debug("Request Item detail - {}", requestItem.get());
					updateRequestDetail = updateRequestDetail(itemUpdateDto, requestItem.get());
					stockRequestService.saveStockRequestDetails(updateRequestDetail);
					acceptedItemQuantity = stockRequestService.getAcceptedItemQuantity(stockRequest.get(),
							requestItem.get().getItemCode(), StockRequestStatusEnum.ACCEPTED.toString());
					LOGGER.debug("Updated Item detail - {}", updateRequestDetail);
				} else {
					throw new ServiceException("No Item with id " + itemId + " exist with respect to your request",
							ERR_INV_029);
				}
			} else {
				LOGGER.debug(
						"Record not found for requestType - {} or requestId - {}  or authuser location code - {} of incorrect combinations",
						requestType, stockRequestId, CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
				throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
			}
		} else {
			LOGGER.debug("Invalid update on stock request with the status - {} ", itemUpdateDto.getStatus());
			throw new ServiceException("Invalid Update on Stock Request.Please check the current status", ERR_INV_013);
		}
		return setRequestItemDetails(productGroupList, productCategoryList, inventoryDetails, updateRequestDetail,
				acceptedItemQuantity);
	}

	private StockRequestItemDto setRequestItemDetails(Map<String, String> productGroupList,
			Map<String, String> productCategoryList, Optional<InventoryDetailsDaoExt> inventoryDetails,
			StockRequestDetailsDao updateRequestDetail, Short acceptedItemQuantity) {
		StockRequestItemDto requestItemDetails;
		requestItemDetails = (StockRequestItemDto) MapperUtil.getDtoMapping(updateRequestDetail,
				StockRequestItemDto.class);
		requestItemDetails.setItemDetails(MapperUtil.getJsonFromString(updateRequestDetail.getItemDetails()));
		requestItemDetails.setImageURL(new URLUtil().getImageUrlByItemCode(updateRequestDetail.getItemCode()));
		requestItemDetails.setTotalAcceptedQuantity(acceptedItemQuantity != null ? acceptedItemQuantity : 0);
		requestItemDetails.setAvailableQuantity(inventoryDetails.isPresent()
				? (short) (inventoryDetails.get().getTotalQuantity() - inventoryDetails.get().getIssuedQuantity())
				: 0);

		requestItemDetails.setProductCategory(updateRequestDetail.getProductCategory());
		requestItemDetails.setProductCategoryDesc(productCategoryList.get(updateRequestDetail.getProductCategory()));
		requestItemDetails.setProductGroup(updateRequestDetail.getProductGroup());
		requestItemDetails.setProductGroupDesc(productGroupList.get(updateRequestDetail.getProductGroup()));
		requestItemDetails
				.setTaxDetails(MapperUtil.getJsonFromString(productGroupList.get(updateRequestDetail.getTaxDetails())));
		return requestItemDetails;
	}

	private StockRequestDetailsDao updateRequestDetail(StockRequestItemUpdateDto itemUpdateDto,
			StockRequestDetailsDao requestItem) {
		StockRequestDetailsDao updateRequestDetail;
		updateRequestDetail = requestItem;
		updateRequestDetail.setAcceptedQuantity(itemUpdateDto.getQuantity());
		updateRequestDetail.setApprovedQuantity(itemUpdateDto.getQuantity());
		if (itemUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ACPT_REJECTED.toString())) {
			updateRequestDetail.setStatus(StockRequestStatusEnum.REQUESTED.toString());
		} else {
			updateRequestDetail.setStatus(itemUpdateDto.getStatus());
		}
		return updateRequestDetail;
	}

	private void validationForAvailableQuantity(StockRequestItemUpdateDto itemUpdateDto,
			Optional<InventoryDetailsDaoExt> inventoryDetails) {
		if (itemUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ACCEPTED.toString())
				&& (!inventoryDetails.isPresent()
						|| (!inventoryDetails.isEmpty() && (short) (inventoryDetails.get().getTotalQuantity()
								- inventoryDetails.get().getIssuedQuantity()) < itemUpdateDto.getQuantity()))) {
			throw new ServiceException("Accepted Quantity can't be more than available quantity", "ERR-INV-017");

		}
	}

	private void validationForAcceptedQuantity(StockRequestItemUpdateDto itemUpdateDto, Short acceptedItemQuantity,
			StockRequestDetailsDao requestItem) {
		if (itemUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ACCEPTED.toString())
				&& (itemUpdateDto.getQuantity() > requestItem.getRequestedQuantity() || (acceptedItemQuantity != null
						&& (itemUpdateDto.getQuantity() > requestItem.getAcceptedQuantity() && itemUpdateDto
								.getQuantity() > (requestItem.getRequestedQuantity() - acceptedItemQuantity))))) {
			throw new ServiceException(ACPT_QUANTITY_GT_REQ_QUANTITY, ERR_INV_022);
		}
	}

	@Transactional
	@Override
	public StockRequestDto updateStockRequest(Integer stockRequestId, String requestType, String requestGroup,
			StockRequestUpdateDto requestUpdateDto) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		Example<StockRequestDao> stockrequestCriteria = generateStockRequestCriteria(requestType, stockRequestId,
				requestGroup, authUser);
		Optional<StockRequestDao> stockRequests = stockRequestService.findByStockRequestCriteria(stockrequestCriteria);

		// TO DO item level verification should happen before update
		if (!stockRequests.isPresent()) {
			LOGGER.debug(
					"Record not found for requestType - {}  requestId - {}  , requestGroup - {} , authuser location code - {} of incorrect combinations",
					requestType, stockRequestId, requestGroup, authUser.getLocationCode());
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}
		StockRequestDao stockRequest = stockRequests.get();

		StockRequestDao updatedStockRequest = updateStockRequestWithCheck(requestUpdateDto, authUser, stockRequest);

		return (StockRequestDto) MapperUtil.getDtoMapping(updatedStockRequest, StockRequestDto.class);

	}

	private StockRequestDao updateStockRequestWithCheck(StockRequestUpdateDto requestUpdateDto, AuthUser authUser,
			StockRequestDao stockRequest) {
		StockRequestDao updatedStockRequest = null;
		if ((requestUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ACCEPTED.toString())
				|| requestUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ACPT_REJECTED.toString()))
				&& stockRequest.getSrcLocationCode().equalsIgnoreCase(authUser.getLocationCode())) {
			updatedStockRequest = acceptOrRejectStockRequest(requestUpdateDto, authUser, stockRequest);

		} else if (requestUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.CANCELLED.toString())
				&& stockRequest.getReqLocationCode().equalsIgnoreCase(authUser.getLocationCode())) {
			if (stockRequest.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ISSUED.toString())
					|| stockRequest.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ISSUE_REJECTED.toString())) {

				LOGGER.debug("Stock request has been Issued out or Issue Rejected- {}", stockRequest);
				throw new ServiceException(
						"stock request can't be cancelled as the stock has been issued or Issue Rejected ",
						ERR_INV_013);

			}
			List<String> cancellationStatus = new ArrayList<>(
					Arrays.asList(StockRequestStatusEnum.REQUESTED.toString()));
			updatedStockRequest = rejectStockRequest(requestUpdateDto, authUser, stockRequest, cancellationStatus);
		} else if (requestUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ISSUE_REJECTED.toString())
				&& stockRequest.getSrcLocationCode().equalsIgnoreCase(authUser.getLocationCode())) {
			if (stockRequest.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ISSUED.toString())
					|| !(stockRequest.getStatus().equalsIgnoreCase(StockRequestStatusEnum.APVL_PENDING.toString())
							|| stockRequest.getStatus().equalsIgnoreCase(StockRequestStatusEnum.APPROVED.toString()))) {

				LOGGER.debug("Stock request has been Issued out - {}", stockRequest);
				throw new ServiceException("stock request can't be rejected as the stock has been issued ",
						ERR_INV_013);

			}
			List<String> rejectionStatus = new ArrayList<>(
					Arrays.asList(StockRequestStatusEnum.APVL_PENDING.toString()));
			updatedStockRequest = rejectStockRequest(requestUpdateDto, authUser, stockRequest, rejectionStatus);
		} else {

			LOGGER.debug("Invalid update on stock request with the status - {} and location code - {} ",
					requestUpdateDto.getStatus(), authUser.getLocationCode());
			throw new ServiceException("Invalid Update on Stock Request.Please check the current status", ERR_INV_013);

		}
		return updatedStockRequest;
	}

	private StockRequestDao insertStockRequest(StockRequestCreateDto requestStockConfirmDto, AuthUser authUser,
			String requestType) {
		BusinessDayDto businessDay = getBusinessDay(authUser.getLocationCode());
		CountryDetailsDto countryDto = getCountryDetails(authUser.getLocationCode());
		StockRequestDao createStockRequest = new StockRequestDao();
		createStockRequest.setRequestType(requestType);
		createStockRequest.setReqFiscalYear(countryDto.getFiscalYear().shortValue());
		createStockRequest.setReqLocationCode(authUser.getLocationCode());
		createStockRequest.setReqDocDate(businessDay.getBusinessDate());
		createStockRequest.setSrcLocationCode(requestStockConfirmDto.getSrcLocationCode());
		createStockRequest.setDestLocationCode(authUser.getLocationCode());
		createStockRequest.setTotalRequestedQuantity((short) 0);
		createStockRequest.setTotalRequestedValue(BigDecimal.ZERO);
		createStockRequest.setTotalRequestedWeight(BigDecimal.ZERO);
		createStockRequest.setOrgCode(CommonConstants.ORG_CODE);
		createStockRequest.setWeightUnit(countryDto.getWeightUnit());
		createStockRequest.setCurrencyCode(countryDto.getCurrencyCode());
		createStockRequest.setRequestRemarks(requestStockConfirmDto.getRemarks());
		createStockRequest.setStatus(StockRequestStatusEnum.OPEN.toString());
		return stockRequestService.saveStockRequest(createStockRequest);
	}

	private RequestDtlsInsertResponseDto insertStockRequestDetails(StockRequestCreateDto stockRequestCreateDto,
			StockRequestDao createdStockRequest) {
		CountryDetailsDto countryDto = getCountryDetails(
				CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode());
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<String> itemNotAvailable = new ArrayList<>();
		List<String> requestedItems = new ArrayList<>();
		List<StockRequestDetailsDao> requestDetailList = new ArrayList<>();
		Short totalRequestedQuantity = 0;
		BigDecimal totalItemValue = BigDecimal.ZERO;
		BigDecimal totalItemWeight = BigDecimal.ZERO;
		BigDecimal totalRequestedWeight = BigDecimal.ZERO;
		BigDecimal totalRequestedValue = BigDecimal.ZERO;
		RequestDtlsInsertResponseDto requestDtlsInsertResponseDto = new RequestDtlsInsertResponseDto();
		for (RequestStockItemDto requestItem : stockRequestCreateDto.getItems()) {
			Optional<List<StockRequestDetailsDao>> requestedItemDetails = stockRequestService
					.findAllPendingStockRequestForItem(authUser.getLocationCode(), StockRequestTypeEnum.BTQ.toString(),
							requestItem.getItemCode(), StockRequestStatusEnum.REQUESTED.toString());
			if (!requestedItemDetails.isEmpty()) {
				LOGGER.debug("Pending Stock Request Details - {}",
						requestedItemDetails.isPresent() ? requestedItemDetails.get() : null);
				requestedItems.add(requestItem.getItemCode());
			}
			List<String> binGroupList = new ArrayList<>(Arrays.asList(BinGroupEnum.STN.toString()));
			List<InventoryDetailsDaoExt> inventoryDetailsList = inventoryDetailsService
					.getInventoryItemsDetailsList(stockRequestCreateDto.getSrcLocationCode(),
							requestItem.getItemCode(), binGroupList);
			LOGGER.debug("inventoryDetailsList {}",inventoryDetailsList);
			if (inventoryDetailsList.isEmpty()) {
				LOGGER.debug("Item Not availbale in Inventory with location code and item code- {},{}",
						stockRequestCreateDto.getSrcLocationCode(), requestItem.getItemCode());
				itemNotAvailable.add(requestItem.getItemCode());
			}

			for (InventoryDetailsDaoExt inventoryDetails : inventoryDetailsList) {
				StockRequestDetailsDao createSRDetail = new StockRequestDetailsDao();
				createSRDetail.setStockRequest(createdStockRequest);
				createSRDetail.setItemCode(inventoryDetails.getItemCode());
				createSRDetail.setLotNumber(inventoryDetails.getLotNumber());
				createSRDetail.setMfgDate(inventoryDetails.getMfgDate());
				createSRDetail.setRequestedQuantity(requestItem.getQuantity());
				// TO DO Tax calculations included
				totalItemValue = inventoryDetails.getStdValue().multiply(BigDecimal.valueOf(requestItem.getQuantity()));
				createSRDetail.setRequestedValue(totalItemValue);
				totalItemWeight = inventoryDetails.getStdWeight()
						.multiply(BigDecimal.valueOf(requestItem.getQuantity()));
				createSRDetail.setRequestedWeight(totalItemWeight);
				createSRDetail.setStdValue(inventoryDetails.getStdValue());
				createSRDetail.setInventoryId(inventoryDetails.getId());
				createSRDetail.setCurrencyCode(countryDto.getCurrencyCode());
				createSRDetail.setWeightUnit(countryDto.getWeightUnit());
				createSRDetail.setBinCode(inventoryDetails.getBinCode());
				createSRDetail.setStdValue(inventoryDetails.getStdValue());
				createSRDetail.setStdWeight(inventoryDetails.getStdWeight());
				createSRDetail.setBinGroupCode(inventoryDetails.getBinGroupCode());
				createSRDetail.setProductGroup(inventoryDetails.getProductGroup());
				createSRDetail.setProductCategory(inventoryDetails.getProductCategory());
				createSRDetail.setStatus(StockRequestStatusEnum.REQUESTED.toString());
				createSRDetail.setItemDetails(inventoryDetails.getItemDetails());
				createSRDetail.setRequestedWeightDetails(inventoryDetails.getTotalWeightDetails());
				requestDetailList.add(createSRDetail);	
			}
			totalRequestedQuantity = (short) (totalRequestedQuantity + requestItem.getQuantity());
			totalRequestedWeight = totalRequestedWeight.add(totalItemWeight);
			totalRequestedValue = totalRequestedValue.add(totalItemValue);

		}
		if (!itemNotAvailable.isEmpty() || !requestedItems.isEmpty()) {
			LOGGER.info("Item Not available list");
			if (!requestedItems.isEmpty()) {
				LOGGER.debug("requesting items already have an stock request - {}", requestedItems);
				throw new ServiceException(
						"requesting items " + requestedItems.toString() + " already have an stock request.Please check",
						"ERR-INV-012", requestedItems.toString());
			}
			LOGGER.debug("requesting item is not available with given location code at this moment - {},{}",
					itemNotAvailable, stockRequestCreateDto.getSrcLocationCode());
			throw new ServiceException(
					"requesting item " + itemNotAvailable.toString()
							+ " is not available with given location code at this moment",
					"ERR-INV-017", itemNotAvailable.toString());
		}
		requestDetailList = stockRequestService.saveAllStockRequestDetails(requestDetailList);
		requestDtlsInsertResponseDto.setTotalRequestedQuantity(totalRequestedQuantity);
		requestDtlsInsertResponseDto.setTotalRequestedWeight(totalRequestedWeight);
		requestDtlsInsertResponseDto.setTotalRequestedValue(totalRequestedValue);
		requestDtlsInsertResponseDto.setTotalRequestCreatedItems(requestDetailList.size());

		return requestDtlsInsertResponseDto;
	}

	private StockRequestDao acceptOrRejectStockRequest(StockRequestUpdateDto stockRequestUpdateDto, AuthUser authUser,
			StockRequestDao stockRequest) {
		LOGGER.debug("Accept/Reject Stock request - {},{}", stockRequest.getId(), stockRequestUpdateDto);
		LOGGER.debug("Accept/Reject Stock request detail - {}", stockRequest);
		StockRequestDao updatedStockRequest;
		if (!stockRequest.getStatus().equalsIgnoreCase(StockRequestStatusEnum.REQUESTED.toString())) {
			throw new ServiceException(
					"stock request can't be accepted/rejected as the stock request is not in REQUESTED stage",
					ERR_INV_013);
		}
		List<String> acceptanceStatus = new ArrayList<>(Arrays.asList(StockRequestStatusEnum.REQUESTED.toString(),
				StockRequestStatusEnum.ACCEPTED.toString(), StockRequestStatusEnum.ACPT_REJECTED.toString()));
		if (stockRequestUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.ACCEPTED.toString())) {
			if (stockRequestUpdateDto.getItemIds() == null || stockRequestUpdateDto.getItemIds().isEmpty()) {
				throw new ServiceException("Stock request can't be accepted/approved without Item Id's.Please check",
						"ERR-INV-007");
			}
			updatedStockRequest = acceptStockRequest(stockRequestUpdateDto, authUser, stockRequest, acceptanceStatus);

		} else {

			updatedStockRequest = rejectStockRequest(stockRequestUpdateDto, authUser, stockRequest, acceptanceStatus);
		}
		return updatedStockRequest;
	}

	private StockRequestDao acceptStockRequest(StockRequestUpdateDto stockRequestUpdateDto, AuthUser authUser,
			StockRequestDao stockRequest, List<String> acceptanceStatusList) {
		LOGGER.debug("Accept Stock request - {}", stockRequest.getId());

		BusinessDayDto businessDate = getBusinessDay(stockRequest.getReqLocationCode());
		List<String> ibtConfigStatusList = new ArrayList<>(Arrays.asList(StockRequestStatusEnum.APVL_PENDING.toString(),
				StockRequestStatusEnum.APPROVED.toString(), StockRequestStatusEnum.ISSUED.toString(),
				StockRequestStatusEnum.REQUESTED.toString()));
		RequestIBTCountDto ibtCountDto = stockRequestService.getIBTCount(stockRequest.getReqLocationCode(),
				StockRequestTypeEnum.BTQ.toString(), ibtConfigStatusList, businessDate.getBusinessDate());
		LOGGER.debug("Get IBT Validate details - {}", ibtCountDto);

		// ibtLimit(Max No of requests in a month),ibtQuantityLimit(Max No of quantity
		// per request) and
		// ibtValueLimit(Max request value in a month) should be fetched form IBT
		// configurations

		String ruleType = InvConfigType.IBT_CONFIGURATIONS.toString();

		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();

		if (!StringUtils.isEmpty(authUser.getLocationCode())) {
			ruleRequestListDto.setLocationCode(authUser.getLocationCode());
		}

		Object ruleFieldValues = engineService.getRuleFieldValues(ruleType, ruleRequestListDto);

		IbtRuleDetails ibtConfigs = MapperUtil.getObjectMapperInstance().convertValue(ruleFieldValues,
				IbtRuleDetails.class);
		
		LOGGER.debug("Ibt Config detail - {}", ibtConfigs);

		Integer ibtLimit = Integer.valueOf(ibtConfigs.getMaxReqPerMonth());

		Integer ibtQuantityLimit = Integer.valueOf(ibtConfigs.getMaxProductsPerStn());

		BigDecimal ibtValueLimit = new BigDecimal(ibtConfigs.getMaxValPerStn());
		LOGGER.debug("IBT value limit- {}", ibtValueLimit);
		
		if ((ibtCountDto.getIbtCount() != null && ibtCountDto.getIbtCount() > ibtLimit)
				|| (stockRequest.getTotalRequestedQuantity() != null
						&& stockRequest.getTotalRequestedQuantity() > ibtQuantityLimit)
				|| (ibtCountDto.getTotalRequestedValue() != null
						&& ibtCountDto.getTotalRequestedValue().compareTo(ibtValueLimit) > 0)) {
			stockRequestService.updateAcceptedItemStatus(StockRequestStatusEnum.APVL_PENDING.toString(), stockRequest,
					stockRequestUpdateDto.getItemIds(), acceptanceStatusList);

			stockRequestService.updateRejectedItemStatus(StockRequestStatusEnum.ACPT_REJECTED.toString(), stockRequest,
					stockRequestUpdateDto.getItemIds(), acceptanceStatusList);

			Short totalAcceptedQuantity = stockRequestService.getTotalAcceptedQuantity(stockRequest,
					StockRequestStatusEnum.APVL_PENDING.toString());
			LOGGER.debug("total Accepted Quantity in if - {}", totalAcceptedQuantity);
			if (totalAcceptedQuantity == null) {
				throw new ServiceException("Total Accepted Quantity can't be null.Please check", "ERR-INV-021");
			} else if (totalAcceptedQuantity > stockRequest.getTotalRequestedQuantity()) {
				throw new ServiceException(ACPT_QUANTITY_GT_REQ_QUANTITY, ERR_INV_022);
			}
			stockRequest.setStatus(StockRequestStatusEnum.APVL_PENDING.toString());
			stockRequest.setTotalAcceptedQuantity(totalAcceptedQuantity);
			stockRequest.setAcceptedBy(authUser.getUsername());
			stockRequest.setAcceptedDate(new Date());
			stockRequest.setAcceptanceRemarks(stockRequestUpdateDto.getRemarks());
		} else {
			stockRequestService.updateAcceptedItemStatus(StockRequestStatusEnum.APPROVED.toString(), stockRequest,
					stockRequestUpdateDto.getItemIds(), acceptanceStatusList);

			stockRequestService.updateRejectedItemStatus(StockRequestStatusEnum.ACPT_REJECTED.toString(), stockRequest,
					stockRequestUpdateDto.getItemIds(), acceptanceStatusList);
			Short totalAcceptedQuantity = stockRequestService.getTotalAcceptedQuantity(stockRequest,
					StockRequestStatusEnum.APPROVED.toString());
			LOGGER.debug("total Accepted Quantity in else - {}", totalAcceptedQuantity);
			if (totalAcceptedQuantity == null) {
				throw new ServiceException("Total Accepted Quantity can't be null.Please check", "ERR-INV-021");
			} else if (totalAcceptedQuantity > stockRequest.getTotalRequestedQuantity()) {
				throw new ServiceException(ACPT_QUANTITY_GT_REQ_QUANTITY, ERR_INV_022);
			}
			stockRequest.setStatus(StockRequestStatusEnum.APPROVED.toString());
			stockRequest.setTotalAcceptedQuantity(totalAcceptedQuantity);
			stockRequest.setAcceptedBy(authUser.getUsername());
			stockRequest.setAcceptedDate(new Date());
			stockRequest.setAcceptanceRemarks(stockRequestUpdateDto.getRemarks());
			stockRequest.setTotalApprovedQuantity(totalAcceptedQuantity);
			stockRequest.setApprovedBy(authUser.getUsername());
			stockRequest.setApprovedDate(new Date());
			stockRequest.setApprovalRemarks(stockRequestUpdateDto.getRemarks());
		}
		LOGGER.debug("Updated Stock Request - {}", stockRequest);
		return stockRequestService.saveStockRequest(stockRequest);

	}

	private StockRequestDao rejectStockRequest(StockRequestUpdateDto stockRequestUpdateDto, AuthUser authUser,
			StockRequestDao stockRequest, List<String> statusList) {
		LOGGER.debug("Reject Stock request - {}", stockRequest.getId());
		stockRequestService.updateAllRequestItemStatus(stockRequestUpdateDto.getStatus(), stockRequest, statusList);
		stockRequest.setStatus(stockRequestUpdateDto.getStatus());
		if (stockRequestUpdateDto.getStatus() != null && stockRequestUpdateDto.getStatus()
				.equalsIgnoreCase(StockRequestStatusEnum.ACPT_REJECTED.toString())) {
			stockRequest.setAcceptedBy(authUser.getUsername());
			stockRequest.setAcceptedDate(new Date());
			stockRequest.setAcceptanceRemarks(stockRequestUpdateDto.getRemarks());
		} else if (stockRequestUpdateDto.getStatus() != null
				&& stockRequestUpdateDto.getStatus().equalsIgnoreCase(StockRequestStatusEnum.CANCELLED.toString())) {
			stockRequest.setRequestRemarks(stockRequestUpdateDto.getRemarks());
		} else if (stockRequestUpdateDto.getStatus() != null && stockRequestUpdateDto.getStatus()
				.equalsIgnoreCase(StockRequestStatusEnum.ISSUE_REJECTED.toString())) {
			stockRequest.setAcceptanceRemarks(stockRequestUpdateDto.getRemarks());
		} else {
			LOGGER.debug("Update Stock Request Details - {}", stockRequestUpdateDto);
			throw new ServiceException(INVALID_REQUEST, ERR_INV_013);
		}
		LOGGER.debug("Reject stock request - {}", stockRequest);
		return stockRequestService.saveStockRequest(stockRequest);

	}

	private Example<StockRequestDetailsDao> generateCriteriaForStockRequestItems(Integer stockRequestId,
			String requestType, String requestGroup, StockRequestItemFilterDto stockRequestItemFilterDto,
			String locationCode) {
		StockRequestDetailsDao stockRequestDetails = new StockRequestDetailsDao();
		StockRequestDao stockRequest = new StockRequestDao();
		stockRequest.setId(stockRequestId);
		stockRequest.setRequestType(requestType);
		if (requestGroup != null && requestGroup.equalsIgnoreCase(RequestGroupEnum.RECEIVED.toString())) {
			stockRequest.setSrcLocationCode(locationCode);
		} else {
			stockRequest.setReqLocationCode(locationCode);
		}
		stockRequestDetails.setStockRequest(stockRequest);
		stockRequestDetails.setItemCode(stockRequestItemFilterDto.getItemCode());
		stockRequestDetails.setProductGroup(stockRequestItemFilterDto.getProductGroup());
		stockRequestDetails.setProductCategory(stockRequestItemFilterDto.getProductCategory());
		stockRequestDetails.setBinCode(stockRequestItemFilterDto.getBinCode());
		stockRequestDetails.setBinGroupCode(stockRequestItemFilterDto.getBinGroupCode());
		stockRequestDetails.setLotNumber(stockRequestItemFilterDto.getLotNumber());
		stockRequestDetails.setStatus(stockRequestItemFilterDto.getStatus());
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stockRequestDetails, matcher);
	}

	private CountryDetailsDto getCountryDetails(String locationCode) {
		return engineService.getCountryDetails(locationCode);
	}

	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}

	@Transactional
	@Override
	public StringResponse createCoStockRequest(ComStockRequestDto comStockRequest) {

		if (comStockRequest == null) {
			throw new ServiceException(ERR_INV_054, CUSTOMER_ORDER_STOCK_REQUEST_CAN_NOT_BE_NULL);
		}

		String binGroupCode = "STN";

		Optional<InventoryDetailsDaoExt> inventoryDetails = inventoryDetailsService
				.findByItemCodeAndLotNumberAndBinCodeAndBinGroupCode(comStockRequest.getItemCode(),
						comStockRequest.getLotNumber(), comStockRequest.getBinCode(), binGroupCode);

		if (inventoryDetails.isPresent() && (inventoryDetails.get().getTotalQuantity()
				- inventoryDetails.get().getIssuedQuantity()) >= comStockRequest.getQuantity()) {
			insertCoStockRequest(inventoryDetails.get(), comStockRequest);
		} else {
			throw new ServiceException(ERR_INV_053, comStockRequest.getItemCode());
		}

		StringResponse response = new StringResponse();
		response.setStatus(SAVED_SUCCESSFULLY);

		return response;
	}

	private void insertCoStockRequest(InventoryDetailsDaoExt inventoryDetailsDaoExt,
			ComStockRequestDto comStockRequest) {
		BusinessDayDto businessDay = getBusinessDay(comStockRequest.getSourceLocationCode());
		CountryDetailsDto countryDto = getCountryDetails(comStockRequest.getSourceLocationCode());

		StockRequestDao createStockRequest = new StockRequestDao();
		createStockRequest.setRequestType(StockRequestTypeEnum.BTQ.toString());
		createStockRequest.setComOrderNumber(comStockRequest.getComOrderNo());
		createStockRequest.setComOrderDate(comStockRequest.getComOrderDateTime());
		createStockRequest.setReqFiscalYear(comStockRequest.getFiscalYear());
		createStockRequest.setReqLocationCode(comStockRequest.getDestinationLocationCode());
		createStockRequest.setReqDocDate(businessDay.getBusinessDate());
		createStockRequest.setSrcLocationCode(comStockRequest.getSourceLocationCode());
		createStockRequest.setDestLocationCode(comStockRequest.getDestinationLocationCode());
		createStockRequest.setTotalRequestedQuantity(comStockRequest.getQuantity());
		createStockRequest.setTotalRequestedValue(
				BigDecimal.valueOf(comStockRequest.getQuantity()).multiply(inventoryDetailsDaoExt.getStdValue()));
		createStockRequest.setTotalRequestedWeight(
				BigDecimal.valueOf(comStockRequest.getQuantity()).multiply(inventoryDetailsDaoExt.getStdWeight()));
		createStockRequest.setOrgCode(CommonConstants.ORG_CODE);
		createStockRequest.setWeightUnit(comStockRequest.getUnitWeight());
		createStockRequest.setCurrencyCode(countryDto.getCurrencyCode());
		createStockRequest.setRequestRemarks(COM_ORDER_REQUESTED);
		createStockRequest.setTotalApprovedQuantity(comStockRequest.getQuantity());
		createStockRequest.setReqDocNo(inventoryDocMasterService.getDocNumber(comStockRequest.getFiscalYear(),
				comStockRequest.getSourceLocationCode(), DocTypeEnum.STNREQUEST.toString()));
		createStockRequest.setStatus(APPROVED);
		createStockRequest = stockRequestService.save(createStockRequest);
		if (createStockRequest != null) {
			insertComStockRequestDetails(inventoryDetailsDaoExt, createStockRequest, comStockRequest, countryDto);
		}
	}

	private void insertComStockRequestDetails(InventoryDetailsDaoExt inventoryDetailsDaoExt,
			StockRequestDao createStockRequest, ComStockRequestDto comStockRequest, CountryDetailsDto countryDto) {
		StockRequestDetailsDao stockRequestDetailsDao = new StockRequestDetailsDao();
		stockRequestDetailsDao.setStockRequest(createStockRequest);
		stockRequestDetailsDao.setItemCode(comStockRequest.getItemCode());
		stockRequestDetailsDao.setLotNumber(comStockRequest.getLotNumber());
		stockRequestDetailsDao.setBinCode(comStockRequest.getBinCode());
		stockRequestDetailsDao.setMfgDate(new Date());
		stockRequestDetailsDao.setRequestedQuantity(comStockRequest.getQuantity());
		stockRequestDetailsDao.setRequestedValue(
				BigDecimal.valueOf(comStockRequest.getQuantity()).multiply(inventoryDetailsDaoExt.getStdValue()));
		stockRequestDetailsDao.setRequestedWeight(
				BigDecimal.valueOf(comStockRequest.getQuantity()).multiply(inventoryDetailsDaoExt.getStdWeight()));
		stockRequestDetailsDao.setInventoryId(inventoryDetailsDaoExt.getId());
		stockRequestDetailsDao.setWeightUnit(comStockRequest.getUnitWeight());
		stockRequestDetailsDao.setCurrencyCode(countryDto.getCurrencyCode());
		stockRequestDetailsDao.setStdValue(inventoryDetailsDaoExt.getStdValue());
		stockRequestDetailsDao.setStdWeight(inventoryDetailsDaoExt.getStdWeight());
		stockRequestDetailsDao.setProductCategory(inventoryDetailsDaoExt.getProductCategory());
		stockRequestDetailsDao.setProductGroup(inventoryDetailsDaoExt.getProductGroup());
		stockRequestDetailsDao.setItemDetails(inventoryDetailsDaoExt.getItemDetails());
		stockRequestDetailsDao.setAcceptedQuantity(comStockRequest.getQuantity());
		stockRequestDetailsDao.setApprovedQuantity(comStockRequest.getQuantity());
		stockRequestDetailsDao.setSelectedQuantity(comStockRequest.getQuantity());
		stockRequestDetailsDao.setStatus(APPROVED);
		stockRequestDetailsDao.setBinGroupCode(inventoryDetailsDaoExt.getBinGroupCode());
		stockRequestDetailsDao.setRequestedWeightDetails(inventoryDetailsDaoExt.getTotalWeightDetails());
		stockRequestDetailsDao = stockRequestService.save(stockRequestDetailsDao);
	}

	
	
}
