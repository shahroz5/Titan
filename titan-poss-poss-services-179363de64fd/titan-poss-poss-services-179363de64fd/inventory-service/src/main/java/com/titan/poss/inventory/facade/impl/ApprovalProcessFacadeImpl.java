/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.facade.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.dto.ConversionItemDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.ProductServiceClient;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.URLUtil;
import com.titan.poss.inventory.constant.ProductGroupCodeEnum;
import com.titan.poss.inventory.dao.BinRequestDao;
import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dao.StockTransferDetailsDao;
import com.titan.poss.inventory.dto.ConversionChildItemsData;
import com.titan.poss.inventory.dto.ConversionChildItemsDto;
import com.titan.poss.inventory.dto.constants.ApprovalRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.ApprovalRequestTypeEnum;
import com.titan.poss.inventory.dto.constants.StockRequestStatusEnum;
import com.titan.poss.inventory.dto.constants.StockTransferStatusEnum;
import com.titan.poss.inventory.dto.request.ApprovalRequestItemUpdateDto;
import com.titan.poss.inventory.dto.request.ApprovalRequestUpdateDto;
import com.titan.poss.inventory.dto.request.BinRequestUpdateDto;
import com.titan.poss.inventory.dto.request.RequestOtherItemDto;
import com.titan.poss.inventory.dto.request.StockTransferApprovalRequestUpdateDto;
import com.titan.poss.inventory.dto.response.ApprovalRequestDto;
import com.titan.poss.inventory.dto.response.ApprovalRequestItemDto;
import com.titan.poss.inventory.dto.response.ApprovalTransferDto;
import com.titan.poss.inventory.dto.response.ApprovalTransferItemDto;
import com.titan.poss.inventory.dto.response.BinRequestDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.facade.ApprovalProcessFacade;
import com.titan.poss.inventory.repository.StockRequestDetailsRepository;
import com.titan.poss.inventory.service.BinRequestService;
import com.titan.poss.inventory.service.EngineService;
import com.titan.poss.inventory.service.InventoryDetailsService;
import com.titan.poss.inventory.service.StockRequestService;
import com.titan.poss.inventory.service.StockTransferService;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Service
public class ApprovalProcessFacadeImpl implements ApprovalProcessFacade {

	private static final String ERR_INV_035 = "ERR-INV-035";

	private static final String INVALID_REQUEST = "Invalid Request.Please Check";

	private static final String ERR_INV_013 = "ERR-INV-013";

	private static final String INVALID_UPDATE_ON_REQUEST = "Invalid Update on Stock Request.Please check the current status";

	private static final String ERR_INV_015 = "ERR-INV-015";

	private static final String RECORD_NOT_FOUND = "Records not found";

	private static final String ERR_INV_029 = "ERR-INV-029";

	private static final String APRVD_QUANTITY_GT_ACPT_QUANTITY = "approved quantity can't be more than accepted quantity";

	private static final String ERR_INV_022 = "ERR-INV-022";

	private static final String APRVD_QUANTITY_GT_REQUESTED_QUANTITY = "approved quantity should not be more than requested quantity";

	List<String> approvalStatus = new ArrayList<>(Arrays.asList(StockRequestStatusEnum.APPROVED.toString(),
			StockRequestStatusEnum.APVL_PENDING.toString(), StockRequestStatusEnum.APVL_REJECTED.toString(),
			StockRequestStatusEnum.ACKNOWLEDGED.toString(), StockRequestStatusEnum.ACKNOWLEDGE_PENDING.toString()));

	@Autowired
	StockRequestService stockRequestService;

	@Autowired
	InventoryDetailsService inventoryDetailsService;

	@Autowired
	BinRequestService binRequestService;

	@Autowired
	StockTransferService stockTransferService;

	@Autowired
	EngineService engineService;

	@Autowired
	private ProductServiceClient productServiceClient;

	@Autowired
	private StockRequestDetailsRepository stockReqDetailsRepo;

	private static final Logger LOGGER = LoggerFactory.getLogger(ApprovalProcessFacadeImpl.class);

	@Override
	public ListResponse<InventoryCountDto> getApprovalRequestCount() {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<String> status = new ArrayList<>();
		status.add(StockRequestStatusEnum.APVL_PENDING.toString());
		List<InventoryCountDto> approvalRequestCount;
		if (authUser.getLocType() != null && authUser.getLocType().equalsIgnoreCase(UserTypeEnum.ORG.toString())) {
			approvalRequestCount = stockRequestService.getRequestCountByStatus(status);
			Long binRequestCount = binRequestService.getRequestCountByStatus(status);
			InventoryCountDto binRequest = new InventoryCountDto(ApprovalRequestTypeEnum.BIN.toString(),
					binRequestCount);
			approvalRequestCount.add(binRequest);
		} else {
			throw new ServiceException(INVALID_REQUEST, ERR_INV_035);
		}

		return new ListResponse<>(approvalRequestCount);
	}

	@Override
	public PagedRestResponse<List<ApprovalRequestDto>> listApprovalRequests(String requestType, Integer reqDocNo,
			String reqLocationCode, String status, Pageable pageable) {
		Page<StockRequestDao> requestList = null;
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		if (authUser.getLocType() != null && authUser.getLocType().equalsIgnoreCase(UserTypeEnum.ORG.toString())) {
			StockRequestDao stockRequest = new StockRequestDao();
			stockRequest.setRequestType(requestType);
			stockRequest.setReqDocNo(reqDocNo);
			stockRequest.setReqLocationCode(reqLocationCode);
			stockRequest.setStatus(status);
			ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
			Example<StockRequestDao> criteria = Example.of(stockRequest, matcher);

			requestList = stockRequestService.findAllByCriteria(criteria, pageable);

		} else {
			throw new ServiceException(INVALID_REQUEST, ERR_INV_035);
		}
		List<ApprovalRequestDto> requestDtls = new ArrayList<>();
		if (requestList != null && !requestList.isEmpty()) {
			LOGGER.debug("Stock Request List Size - {}", requestList.getSize());
			for (StockRequestDao stockRequest : requestList) {
				ApprovalRequestDto requestDtl = (ApprovalRequestDto) MapperUtil.getDtoMapping(stockRequest,
						ApprovalRequestDto.class);
				requestDtl.setOtherDetails(MapperUtil.getJsonFromString(stockRequest.getOtherDetails()));
				requestDtl.setCarrierDetails(MapperUtil.getJsonFromString(stockRequest.getCarrierDetails()));
				requestDtls.add(requestDtl);
			}
			LOGGER.debug("Get Size of Request Details - {}", requestDtls.size());
		}
		return new PagedRestResponse<>(requestDtls, requestList);

	}

	@Override
	public ApprovalRequestDto getApprovalRequest(Integer requestId, String requestType) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		Optional<StockRequestDao> stockRequest;
		ApprovalRequestDto approvalRequestDto;
		if (authUser.getLocType() != null && authUser.getLocType().equalsIgnoreCase(UserTypeEnum.ORG.toString())) {
			stockRequest = stockRequestService.findByIdAndRequestType(requestId, requestType);
			if (!stockRequest.isPresent()) {
				throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
			}
		} else {
			throw new ServiceException(INVALID_REQUEST, ERR_INV_035);
		}
		approvalRequestDto = (ApprovalRequestDto) MapperUtil.getDtoMapping(stockRequest.get(),
				ApprovalRequestDto.class);

		approvalRequestDto.setOtherDetails(MapperUtil.getJsonFromString(stockRequest.get().getOtherDetails()));
		approvalRequestDto.setCarrierDetails(MapperUtil.getJsonFromString(stockRequest.get().getCarrierDetails()));

		if (requestType.equals(ApprovalRequestTypeEnum.CONV.name())) {
			// check the lot stone is available for studded items and update the child items
			List<StockRequestDetailsDao> listItem = stockReqDetailsRepo.findAllByStockRequest(stockRequest.get());

			if (!listItem.isEmpty()) {
				String itemCode = "";
				String lotNumber = "";
				ConversionItemDto conversionItemDto = null;
				for (int i = 0; i < listItem.size(); i++) {
					String itemType = JsonUtils.getValueFromJsonString(
							MapperUtil.getJsonFromString(listItem.get(i).getItemDetails()), "itemType");
					if (itemType.toLowerCase().equals("parent")) {
						itemCode = listItem.get(i).getItemCode();
						lotNumber = listItem.get(i).getLotNumber();
					}
				}
				if (ProductGroupCodeEnum.getStuddedList().contains(listItem.get(0).getProductGroup())) {
					conversionItemDto = productServiceClient.listItems(itemCode, lotNumber);
				} else {
					conversionItemDto = productServiceClient.getItemMasterForConversion(itemCode);
				}

				if (conversionItemDto != null && !CollectionUtils.isEmpty(conversionItemDto.getChildItems())) {
					JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(
							MapperUtil.getJsonFromString(stockRequest.get().getOtherDetails()), JsonData.class);
					ObjectMapper mapper = new ObjectMapper();
					mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
					ConversionChildItemsDto convChildItems = mapper.convertValue(jsonData.getData(),
							ConversionChildItemsDto.class);

					List<RequestOtherItemDto> childItems = new ArrayList<RequestOtherItemDto>();

					for (ConversionItemDto convItems : conversionItemDto.getChildItems()) {
						RequestOtherItemDto childItemDto = new RequestOtherItemDto();
						childItemDto.setItemCode(convItems.getItemCode());
						childItemDto.setLotNumber(convItems.getLotNumber());
						childItemDto.setMeasuredWeight(convItems.getStdWeight());
						childItemDto.setQuantity((short) 1);

						ConversionChildItemsData itemDetailsData = new ConversionChildItemsData();
						itemDetailsData.setRemarks("");
						itemDetailsData.setItemCode(convItems.getItemCode());
						itemDetailsData.setNetWeight(convItems.getStdWeight());
						itemDetailsData.setStonePrice(convItems.getStoneValue());
						itemDetailsData.setComplexityCode(convItems.getComplexityCode());
						itemDetailsData.setSold(convItems.isSold() == true ? "Y" : "N");
						itemDetailsData.setItemType("Child");

						JsonData jsonData1 = new JsonData();
						jsonData1.setType("conversion");
						jsonData1.setData(itemDetailsData);
						childItemDto.setItemDetails(jsonData1);
						childItems.add(childItemDto);

						for (int i = 0; i < listItem.size(); i++) {
							if (listItem.get(i).getItemCode().equals(convItems.getItemCode())) {
								listItem.get(i).setStdWeight(convItems.getStdWeight());
								listItem.get(i).setItemDetails(MapperUtil.getStringFromJson(itemDetailsData));
								stockReqDetailsRepo.save(listItem.get(i));
								LOGGER.info("stock request details>>>>>>>>" + listItem.get(i));
							}
						}
					}

					convChildItems = new ConversionChildItemsDto();
					convChildItems.setChildItems(childItems);
					JsonData sData = new JsonData();
					sData.setType("OTHERDETAILS");
					sData.setData(convChildItems);
					approvalRequestDto.setOtherDetails(sData);
					StockRequestDao stockReq = stockRequest.get();
					stockReq.setOtherDetails(MapperUtil.getStringFromJson(approvalRequestDto.getOtherDetails()));
					stockRequestService.save(stockReq);
					LOGGER.info("stock request>>>>>>>>" + stockReq);
//					approvalRequestDto.setOtherDetails(stockReq.getOtherDetails());
				}
			}
			
		}

		return approvalRequestDto;
	}

	@Override
	public PagedRestResponse<List<ApprovalRequestItemDto>> listApprovalRequestItems(Integer requestId,
			String requestType, String status, List<String> productCategory, List<String> productGroup, String itemCode,
			String lotNumber, Pageable pageable) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<ApprovalRequestItemDto> listProductDtls = new ArrayList<>();
		Page<StockRequestDetailsDao> listItem = null;
		Optional<StockRequestDao> stockRequest;
		if (authUser.getLocType() != null && authUser.getLocType().equalsIgnoreCase(UserTypeEnum.ORG.toString())) {
			stockRequest = stockRequestService.findByIdAndRequestTypeAndStatusIn(requestId, requestType,
					approvalStatus);
			if (!stockRequest.isPresent()) {
				throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
			}

			StockRequestDao st = new StockRequestDao();
			st.setId(requestId);
			listItem = stockRequestService.findAllStockRequestItems(st, status, productCategory, productGroup, itemCode,
					lotNumber, pageable);

			// TO DO: Items Not found error need to throw?
			if (!listItem.isEmpty() && listItem.get().count() > 0) {
				for (StockRequestDetailsDao stockRequestDetail : listItem) {
					ApprovalRequestItemDto productDtls = (ApprovalRequestItemDto) MapperUtil
							.getDtoMapping(stockRequestDetail, ApprovalRequestItemDto.class);
					productDtls.setItemDetails(MapperUtil.getJsonFromString(stockRequestDetail.getItemDetails()));
					productDtls.setImageURL(new URLUtil().getImageUrlByItemCode(stockRequestDetail.getItemCode()));
					// TO DO: Join query to get list as a whole
					Optional<InventoryDetailsDaoExt> getItemDetail = inventoryDetailsService
							.findById(stockRequestDetail.getInventoryId());

					productDtls.setAvailableQuantity(getItemDetail.isPresent()
							? (short) (getItemDetail.get().getTotalQuantity() - getItemDetail.get().getIssuedQuantity())
							: 0);

					productDtls.setProductCategory(stockRequestDetail.getProductCategory());
					productDtls
							.setProductCategoryDesc(productCategoryList.get(stockRequestDetail.getProductCategory()));
					productDtls.setProductGroup(stockRequestDetail.getProductGroup());
					productDtls.setProductGroupDesc(productGroupList.get(stockRequestDetail.getProductGroup()));

					listProductDtls.add(productDtls);
				}
				LOGGER.debug("listProductDtls Count - {}", listProductDtls.size());
			}

		} else {
			throw new ServiceException(INVALID_REQUEST, ERR_INV_035);
		}

		return new PagedRestResponse<>(listProductDtls, listItem);
	}

	@Override
	@Transactional
	public ApprovalRequestItemDto updateApprovalRequestItem(Integer requestId, String itemId, String requestType,
			ApprovalRequestItemUpdateDto itemUpdateDto) {
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		ApprovalRequestItemDto requestItemDetails = null;
		Optional<StockRequestDao> stockRequest;
		Optional<InventoryDetailsDaoExt> inventoryDetails;
		StockRequestDetailsDao updateRequestDetail;
		Short approvedItemQuantity;
		if (!(authUser.getLocType() != null && authUser.getLocType().equalsIgnoreCase(UserTypeEnum.ORG.toString())
				&& (itemUpdateDto.getStatus().equalsIgnoreCase(ApprovalRequestStatusEnum.APPROVED.toString())
						|| itemUpdateDto.getStatus()
								.equalsIgnoreCase(ApprovalRequestStatusEnum.APVL_REJECTED.toString()))))
			throw new ServiceException(INVALID_UPDATE_ON_REQUEST, ERR_INV_013);

		stockRequest = stockRequestService.findByIdAndRequestTypeAndStatus(requestId, requestType,
				StockRequestStatusEnum.APVL_PENDING.toString());

		if (!stockRequest.isPresent()) {
			throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
		}
		Optional<StockRequestDetailsDao> requestItem = stockRequestService.findByIdAndStatusInAndStockRequest(itemId,
				approvalStatus, stockRequest.get());

		if (!requestItem.isPresent()) {
			throw new ServiceException("No Item with id " + itemId + " exist with respect to your request",
					ERR_INV_029);

		}
		approvedItemQuantity = stockRequestService.getApprovedItemQuantity(stockRequest.get(),
				requestItem.get().getItemCode(), StockRequestStatusEnum.APPROVED.toString());

		// check for accepted, & requested quantity and throw error if it fails
		checkForAcceptedAndRequestedQuntity(requestType, itemUpdateDto, approvedItemQuantity, requestItem);

		inventoryDetails = inventoryDetailsService.findById(requestItem.get().getInventoryId());
		LOGGER.debug("Inventory Details - {}", inventoryDetails.isPresent() ? inventoryDetails.get() : null);
		if (ApprovalRequestStatusEnum.APPROVED.toString().equals(itemUpdateDto.getStatus())
				&& (!inventoryDetails.isPresent() || ((short) (inventoryDetails.get().getTotalQuantity()
						- inventoryDetails.get().getIssuedQuantity()) < itemUpdateDto.getQuantity())))
			throw new ServiceException("Approved Quantity can't be more than available quantity", "ERR-INV-017");

		LOGGER.debug("Request Item detail - {}", requestItem.get());
		updateRequestDetail = requestItem.get();
		updateRequestDetail.setApprovedQuantity(itemUpdateDto.getQuantity());
		if (ApprovalRequestStatusEnum.APVL_REJECTED.toString().equalsIgnoreCase(itemUpdateDto.getStatus()))
			updateRequestDetail.setStatus(ApprovalRequestStatusEnum.APVL_PENDING.toString());
		else
			updateRequestDetail.setStatus(itemUpdateDto.getStatus());

		stockRequestService.saveStockRequestDetails(updateRequestDetail);
		approvedItemQuantity = stockRequestService.getApprovedItemQuantity(stockRequest.get(),
				requestItem.get().getItemCode(), StockRequestStatusEnum.APPROVED.toString());
		LOGGER.debug("Updated Item detail - {}", updateRequestDetail);

		requestItemDetails = (ApprovalRequestItemDto) MapperUtil.getDtoMapping(updateRequestDetail,
				ApprovalRequestItemDto.class);
		requestItemDetails.setItemDetails(MapperUtil.getJsonFromString(updateRequestDetail.getItemDetails()));
		requestItemDetails.setImageURL(new URLUtil().getImageUrlByItemCode(updateRequestDetail.getItemCode()));
		requestItemDetails.setTotalApprovedQuantity(approvedItemQuantity != null ? approvedItemQuantity : 0);

		requestItemDetails.setProductCategory(updateRequestDetail.getProductCategory());
		requestItemDetails.setProductCategoryDesc(productCategoryList.get(updateRequestDetail.getProductCategory()));
		requestItemDetails.setProductGroup(updateRequestDetail.getProductGroup());
		requestItemDetails.setProductGroupDesc(productGroupList.get(updateRequestDetail.getProductGroup()));

		return requestItemDetails;
	}

	private void checkForAcceptedAndRequestedQuntity(String requestType, ApprovalRequestItemUpdateDto itemUpdateDto,
			Short approvedItemQuantity, Optional<StockRequestDetailsDao> requestItem) {
		if (requestItem.isPresent()
				&& ApprovalRequestStatusEnum.APPROVED.toString().equalsIgnoreCase(itemUpdateDto.getStatus())) {
			if (requestType.equalsIgnoreCase(ApprovalRequestTypeEnum.BTQ.toString())
					&& itemUpdateDto.getQuantity() > requestItem.get().getAcceptedQuantity()
					|| (approvedItemQuantity != null
							&& (itemUpdateDto.getQuantity() > requestItem.get().getApprovedQuantity()
									&& itemUpdateDto.getQuantity() > (requestItem.get().getAcceptedQuantity()
											- approvedItemQuantity)))) {
				throw new ServiceException("approved quantity should not be more than accepted quantity", ERR_INV_015);
			} else if (itemUpdateDto.getQuantity() > requestItem.get().getRequestedQuantity()
					|| (approvedItemQuantity != null
							&& (itemUpdateDto.getQuantity() > requestItem.get().getApprovedQuantity()
									&& itemUpdateDto.getQuantity() > (requestItem.get().getRequestedQuantity()
											- approvedItemQuantity)))) {
				throw new ServiceException(APRVD_QUANTITY_GT_REQUESTED_QUANTITY, ERR_INV_022);
			}
		}
	}

	@Override
	@Transactional
	public ApprovalRequestDto updateApprovalRequest(Integer requestId, String requestType,
			ApprovalRequestUpdateDto requestUpdateDto) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		StockRequestDao updatedStockRequest = null;

		if (authUser.getLocType() != null && authUser.getLocType().equalsIgnoreCase(UserTypeEnum.ORG.toString())) {

			Optional<StockRequestDao> stockRequest = null;

			if (requestType.equals(ApprovalRequestTypeEnum.CONV.name())) {
				String status = null;
				if (requestUpdateDto.getStatus().equals(StockRequestStatusEnum.ACKNOWLEDGED.toString())) {
					status = StockRequestStatusEnum.ACKNOWLEDGE_PENDING.toString();
				} else {
					status = StockRequestStatusEnum.APVL_PENDING.toString();
				}
				stockRequest = stockRequestService.findByIdAndStatus(requestId, status);
			} else {
				stockRequest = stockRequestService.findByIdAndStatus(requestId,
						StockRequestStatusEnum.APVL_PENDING.toString());
			}

			if (stockRequest != null && stockRequest.isPresent()) {
				updatedStockRequest = approveOrRejectApprovalRequest(requestUpdateDto, requestType, authUser,
						stockRequest.get());
			} else {
				throw new ServiceException(INVALID_UPDATE_ON_REQUEST, ERR_INV_013);
			}
		} else {
			throw new ServiceException(INVALID_REQUEST, ERR_INV_035);
		}

		ApprovalRequestDto approvalRequestDto = (ApprovalRequestDto) MapperUtil.getDtoMapping(updatedStockRequest,
				ApprovalRequestDto.class);

		approvalRequestDto.setOtherDetails(MapperUtil.getJsonFromString(updatedStockRequest.getOtherDetails()));
		approvalRequestDto.setCarrierDetails(MapperUtil.getJsonFromString(updatedStockRequest.getCarrierDetails()));
		return approvalRequestDto;
	}

	private StockRequestDao approveOrRejectApprovalRequest(ApprovalRequestUpdateDto requestUpdateDto,
			String requestType, AuthUser authUser, StockRequestDao stockRequest) {
		LOGGER.debug("Approve/Reject Approval request - {}", stockRequest.getId());
		StockRequestDao updatedStockRequest;
		if (!stockRequest.getStatus().equalsIgnoreCase(StockRequestStatusEnum.APVL_PENDING.toString())) {

			if (!requestType.equals(ApprovalRequestTypeEnum.CONV.name()))
				throw new ServiceException(
						"approval request can't be approved/rejected as the request is not in APVL_PENDING stage",
						ERR_INV_013);
		}
		if (StockRequestStatusEnum.APPROVED.toString().equalsIgnoreCase(requestUpdateDto.getStatus())
				|| StockRequestStatusEnum.ACKNOWLEDGED.toString().equalsIgnoreCase(requestUpdateDto.getStatus())) {
			// w.r.t
			if (stockRequest.getOtherDetails() != null && requestType.equals(ApprovalRequestTypeEnum.CONV.name())) {
				JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(
						MapperUtil.getJsonFromString(stockRequest.getOtherDetails()), JsonData.class);
				ObjectMapper mapper = new ObjectMapper();
				mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
				ConversionChildItemsDto convChildItems = mapper.convertValue(jsonData.getData(),
						ConversionChildItemsDto.class);
				
				for (RequestOtherItemDto itemDetails : convChildItems.getChildItems()) {
					if (itemDetails.getItemCode().isEmpty()) {
						throw new ServiceException("No Child Items Available for the Existing Parent Item. So it Cannot be approved", "ERR-INV-058");
					}
				}
			}
			if (requestUpdateDto.getItemIds() == null || requestUpdateDto.getItemIds().isEmpty()) {
				updatedStockRequest = approveAllRequestItems(requestUpdateDto, authUser, stockRequest);
			} else {
				updatedStockRequest = approveRequest(requestUpdateDto, authUser, stockRequest);
			}
		} else {
			updatedStockRequest = rejectRequest(requestUpdateDto, authUser, stockRequest);
		}
		return updatedStockRequest;
	}

	private StockRequestDao approveRequest(ApprovalRequestUpdateDto requestUpdateDto, AuthUser authUser,
			StockRequestDao stockRequest) {
		int updatedCount = stockRequestService.updateAcceptedItemStatus(requestUpdateDto.getStatus(), stockRequest,
				requestUpdateDto.getItemIds(), approvalStatus);
		if (updatedCount != requestUpdateDto.getItemIds().size()) {
			throw new ServiceException("No item available for the requested itemId", ERR_INV_029);
		}
		stockRequestService.updateRejectedItemStatus(StockRequestStatusEnum.APVL_REJECTED.toString(), stockRequest,
				requestUpdateDto.getItemIds(), approvalStatus);

		Short totalApprovedQuantity = stockRequestService.getTotalApprovedQuantity(stockRequest,
				requestUpdateDto.getStatus());
		if (totalApprovedQuantity == null) {
			throw new ServiceException("Total Approved Quantity can't be Zero.Please check", "ERR-INV-023");
		} else if (stockRequest.getRequestType().equals(ApprovalRequestTypeEnum.BTQ.toString())
				&& stockRequest.getTotalAcceptedQuantity() != null
				&& totalApprovedQuantity > stockRequest.getTotalAcceptedQuantity()) {
			throw new ServiceException(APRVD_QUANTITY_GT_ACPT_QUANTITY, ERR_INV_015);
		} else if (stockRequest.getTotalRequestedQuantity() != null
				&& totalApprovedQuantity > stockRequest.getTotalRequestedQuantity()) {
			throw new ServiceException(APRVD_QUANTITY_GT_REQUESTED_QUANTITY, ERR_INV_022);
		}

		if (stockRequest.getRequestType().equals(ApprovalRequestTypeEnum.CONV.name())
				&& requestUpdateDto.getStatus().equals(StockRequestStatusEnum.ACKNOWLEDGED.toString()))
			stockRequest.setStatus(StockRequestStatusEnum.APVL_PENDING.toString());
		else
			stockRequest.setStatus(requestUpdateDto.getStatus());
		stockRequest.setTotalApprovedQuantity(totalApprovedQuantity);
		stockRequest.setApprovedBy(authUser.getUsername());
		stockRequest.setApprovedDate(new Date());
		stockRequest.setApprovalRemarks(requestUpdateDto.getRemarks());
		return stockRequestService.saveStockRequest(stockRequest);

	}

	private StockRequestDao approveAllRequestItems(ApprovalRequestUpdateDto requestUpdateDto, AuthUser authUser,
			StockRequestDao stockRequest) {
		stockRequestService.updateAllRequestItemStatus(requestUpdateDto.getStatus(), stockRequest, approvalStatus);
		Short totalApprovedQuantity = stockRequestService.getTotalApprovedQuantity(stockRequest,
				requestUpdateDto.getStatus());
		if (totalApprovedQuantity == null) {
			throw new ServiceException("Total Approved Quantity can't be Zero.Please check", "ERR-INV-023");
		} else if (stockRequest.getRequestType().equals(ApprovalRequestTypeEnum.BTQ.toString())
				&& stockRequest.getTotalAcceptedQuantity() != null
				&& totalApprovedQuantity > stockRequest.getTotalAcceptedQuantity()) {
			throw new ServiceException(APRVD_QUANTITY_GT_ACPT_QUANTITY, ERR_INV_015);
		} else if (stockRequest.getTotalRequestedQuantity() != null
				&& totalApprovedQuantity > stockRequest.getTotalRequestedQuantity()) {
			throw new ServiceException(APRVD_QUANTITY_GT_REQUESTED_QUANTITY, ERR_INV_022);
		}
		if (stockRequest.getRequestType().equals(ApprovalRequestTypeEnum.CONV.name())
				&& requestUpdateDto.getStatus().equals(StockRequestStatusEnum.ACKNOWLEDGED.toString()))
			stockRequest.setStatus(StockRequestStatusEnum.APVL_PENDING.name());
		else
			stockRequest.setStatus(requestUpdateDto.getStatus());
		stockRequest.setTotalApprovedQuantity(totalApprovedQuantity);
		stockRequest.setApprovedBy(authUser.getUsername());
		stockRequest.setApprovedDate(new Date());
		stockRequest.setApprovalRemarks(requestUpdateDto.getRemarks());
		return stockRequestService.saveStockRequest(stockRequest);

	}

	private StockRequestDao rejectRequest(ApprovalRequestUpdateDto requestUpdateDto, AuthUser authUser,
			StockRequestDao stockRequest) {
		LOGGER.debug("Reject Stock request - {}", stockRequest.getId());
		stockRequestService.updateAllRequestItemStatus(requestUpdateDto.getStatus(), stockRequest, approvalStatus);
		stockRequest.setStatus(requestUpdateDto.getStatus());
		if (requestUpdateDto.getStatus() != null
				&& StockRequestStatusEnum.APVL_REJECTED.toString().equalsIgnoreCase(requestUpdateDto.getStatus())) {
			stockRequest.setApprovedBy(authUser.getUsername());
			stockRequest.setApprovedDate(new Date());
			stockRequest.setApprovalRemarks(requestUpdateDto.getRemarks());
		} else {
			throw new ServiceException(INVALID_REQUEST, ERR_INV_035);
		}
		return stockRequestService.saveStockRequest(stockRequest);

	}

	@Override
	public PagedRestResponse<List<BinRequestDto>> listBinApprovalRequests(Integer reqDocNo, String locationCode,
			Pageable pageable) {

		BinRequestDao binRequest = new BinRequestDao();
		List<BinRequestDto> binRequestDtoList = new ArrayList<>();
		binRequest.setReqDocNo(reqDocNo);
		binRequest.setReqLocationCode(locationCode);
		binRequest.setStatus(ApprovalRequestStatusEnum.APVL_PENDING.toString());
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
	@Transactional
	public BinRequestDto updateBinApprovalRequest(Integer id, BinRequestUpdateDto binRequestUpdateDto) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		if (authUser.getLocType() != null && !authUser.getLocType().equalsIgnoreCase(UserTypeEnum.ORG.toString())) {
			throw new ServiceException(INVALID_REQUEST, ERR_INV_035);
		}
		Optional<BinRequestDao> binRequest = binRequestService.findById(id);
		if (!binRequest.isPresent()) {
			throw new ServiceException("No record(s) found", ERR_INV_029);
		}
		if (!binRequestUpdateDto.getStatus().equals(ApprovalRequestStatusEnum.APVL_REJECTED.toString())
				&& !binRequestUpdateDto.getStatus().equals(ApprovalRequestStatusEnum.APPROVED.toString())) {
			throw new ServiceException(INVALID_UPDATE_ON_REQUEST, ERR_INV_013);
		}
		binRequest.get().setApprovedRemarks(binRequestUpdateDto.getRemarks());
		binRequest.get().setApprovedBy(authUser.getUsername());
		binRequest.get().setApprovalDate(new Date());
		binRequest.get().setStatus(binRequestUpdateDto.getStatus());
		return (BinRequestDto) MapperUtil.getDtoMapping(binRequestService.save(binRequest.get()), BinRequestDto.class);
	}

	@Override
	public PagedRestResponse<List<ApprovalTransferDto>> listTransferApprovalRequest(String transferType,
			Integer srcDocNo, String srcLocationCode, String status, Pageable pageable) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		List<ApprovalTransferDto> approvalTransferDtos = new ArrayList<>();

		if (authUser.getLocType() == null && !authUser.getLocType().equalsIgnoreCase(UserTypeEnum.ORG.toString())) {
			throw new ServiceException(INVALID_REQUEST, ERR_INV_035);
		}
		StockTransferDao stTransfer = new StockTransferDao();
		stTransfer.setTransferType(transferType);
		stTransfer.setStatus(status);
		stTransfer.setSrcLocationCode(srcLocationCode);
		stTransfer.setSrcDocNo(srcDocNo);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<StockTransferDao> criteria = Example.of(stTransfer, matcher);

		Page<StockTransferDao> stockTransferPage = stockTransferService.findStockTransferByCriteria(criteria, pageable);
		LOGGER.debug("Stock Request List Size - {}", stockTransferPage.getSize());

		stockTransferPage.forEach(stockTransfer -> {
			ApprovalTransferDto approvalTransfer = (ApprovalTransferDto) MapperUtil.getDtoMapping(stockTransfer,
					ApprovalTransferDto.class);
			approvalTransfer.setCourierDetails(MapperUtil.getJsonFromString(stockTransfer.getCarrierDetails()));
			approvalTransfer.setOtherDetails(MapperUtil.getJsonFromString(stockTransfer.getOtherDetails()));
			approvalTransferDtos.add(approvalTransfer);
		});

		return new PagedRestResponse<>(approvalTransferDtos, stockTransferPage);
	}

	@Override
	public PagedRestResponse<List<ApprovalTransferItemDto>> listTransferApprovalRequestItems(Integer id,
			String transferType, String status, Pageable pageable) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();

		// get productGroupList & productCategoryList by calling product micro service
		Map<String, String> productGroupList = engineService.getProductGroups(null, null);
		Map<String, String> productCategoryList = engineService.getProductCategories();

		if (authUser.getLocType() == null && !authUser.getLocType().equalsIgnoreCase(UserTypeEnum.ORG.toString())) {
			throw new ServiceException(INVALID_REQUEST, ERR_INV_035);
		}
		// create criteria object of stock transfer details
		Example<StockTransferDetailsDao> criteria = generateCriteriaForStockTransferDetails(id, transferType, status);

		// get pageable object of stock transfer details based on criteria object
		Page<StockTransferDetailsDao> stTransferDetailsPage = stockTransferService
				.findListStockTransferDetailsByCriteria(criteria, pageable);

		// convert to dto from stock transfer details list object
		List<ApprovalTransferItemDto> approvalTransferItemDtos = generateApprovalTransferItemDto(productGroupList,
				productCategoryList, stTransferDetailsPage);
		return new PagedRestResponse<>(approvalTransferItemDtos, stTransferDetailsPage);
	}

	private List<ApprovalTransferItemDto> generateApprovalTransferItemDto(Map<String, String> productGroupList,
			Map<String, String> productCategoryList, Page<StockTransferDetailsDao> stTransferDetailsPage) {
		List<ApprovalTransferItemDto> approvalTransferItemDtos = new ArrayList<>();
		stTransferDetailsPage.forEach(stTransferDetails -> {
			ApprovalTransferItemDto approvalTransferItemDto = (ApprovalTransferItemDto) MapperUtil
					.getDtoMapping(stTransferDetails, ApprovalTransferItemDto.class);
			approvalTransferItemDto.setAvailableQuantity(stTransferDetails.getIssuedQuantity());
			approvalTransferItemDto.setAvailableWeight(stTransferDetails.getIssuedWeight());
			approvalTransferItemDto.setAvailableValue(stTransferDetails.getIssuedValue());
			approvalTransferItemDto.setMeasuredQuantity(stTransferDetails.getReceivedQuantity());
			approvalTransferItemDto.setMeasuredWeight(stTransferDetails.getReceivedWeight());
			approvalTransferItemDto.setMeasuredValue(stTransferDetails.getReceivedValue());

			approvalTransferItemDto.setItemDetails(MapperUtil.getJsonFromString(stTransferDetails.getItemDetails()));
			approvalTransferItemDto.setImageURL(new URLUtil().getImageUrlByItemCode(stTransferDetails.getItemCode()));

			approvalTransferItemDto.setProductCategory(stTransferDetails.getProductCategory());
			approvalTransferItemDto
					.setProductCategoryDesc(productCategoryList.get(stTransferDetails.getProductCategory()));
			approvalTransferItemDto.setProductGroup(stTransferDetails.getProductGroup());
			approvalTransferItemDto.setProductGroupDesc(productGroupList.get(stTransferDetails.getProductGroup()));
			approvalTransferItemDtos.add(approvalTransferItemDto);

		});
		return approvalTransferItemDtos;
	}

	private Example<StockTransferDetailsDao> generateCriteriaForStockTransferDetails(Integer id, String transferType,
			String status) {
		StockTransferDao stTransfer = new StockTransferDao();
		stTransfer.setTransferType(transferType);
		stTransfer.setStatus(status);
		stTransfer.setId(id);
		StockTransferDetailsDao stTransferDetails = new StockTransferDetailsDao();
		stTransferDetails.setStockTransfer(stTransfer);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(stTransferDetails, matcher);
	}

	@Override
	@Transactional
	public ApprovalTransferDto updateTransferApprovalRequest(Integer id, String transferType,
			StockTransferApprovalRequestUpdateDto stUpdateDto) {

		// status should be CNCL_APVL_APPROVED or CNCL_APVL_REJECTED
		// if from UI comes different status then throw exception
		if (StockTransferStatusEnum.CNCL_APVL_APPROVED.toString().equals(stUpdateDto.getStatus())
				|| StockTransferStatusEnum.CNCL_APVL_REJECTED.toString().equals(stUpdateDto.getStatus())) {
			// do nothing
		} else {
			throw new ServiceException("Invalid Update: Please check the current status or type", ERR_INV_013);
		}
		Optional<StockTransferDao> stockTransferOptional = stockTransferService.findByIdAndTransferType(id,
				transferType);

		if (!stockTransferOptional.isPresent()) {
			throw new ServiceException("No record(s) found", ERR_INV_029);
		}

		// if the status is RECEIVED then throw exception
		if (StockTransferStatusEnum.RECEIVED.toString().equals(stockTransferOptional.get().getStatus())
				|| StockTransferStatusEnum.CANCELLED.toString().equals(stockTransferOptional.get().getStatus())) {
			throw new ServiceException("Invalid Update: Please check the current status or type", ERR_INV_013);
		}

		StockTransferDao stockTransfer = stockTransferOptional.get();

		// if from UI, CNCL_APVL_APPROVED status comes that means corporate has approved
		// the request. In header & item details,status should be updated as CANCELLED
		// if from UI,CNCL_APVL_REJECTED status comes that means corporate has rejected
		// the request.In header status will be updated as ISSUED.No need to update the
		// item details status cause at the approver's action we are changing the status
		// of item details. If approver cancels that means item details status would
		// remain same like earlier
		if (StockTransferStatusEnum.CNCL_APVL_APPROVED.toString().equals(stUpdateDto.getStatus())) {
			stockTransferService.updateAllStockTransferDetailsByStockTransferId(
					StockTransferStatusEnum.CANCELLED.toString(), stockTransfer);
			stockTransfer.setStatus(StockTransferStatusEnum.CANCELLED.toString());
		} else if (StockTransferStatusEnum.CNCL_APVL_REJECTED.toString().equals(stUpdateDto.getStatus())) {
			stockTransfer.setStatus(StockTransferStatusEnum.ISSUED.toString());
		}
		stockTransfer = stockTransferService.saveOrUpdateStockTransfer(stockTransfer);
		return (ApprovalTransferDto) MapperUtil.getDtoMapping(stockTransfer, ApprovalTransferDto.class);
	}

	@Override
	public ApprovalTransferDto getTransferApprovalRequest(Integer id, String transferType) {
		AuthUser authUser = CustomSecurityPrincipal.getSecurityPrincipal();
		Optional<StockTransferDao> stockTransfer;
		ApprovalTransferDto approvalTransferDto;
		if (authUser.getLocType() != null && authUser.getLocType().equalsIgnoreCase(UserTypeEnum.ORG.toString())) {
			stockTransfer = stockTransferService.findByIdAndTransferType(id, transferType);
			if (!stockTransfer.isPresent()) {
				throw new ServiceException(RECORD_NOT_FOUND, ERR_INV_029);
			}
		} else {
			throw new ServiceException(INVALID_REQUEST, ERR_INV_035);
		}
		approvalTransferDto = (ApprovalTransferDto) MapperUtil.getDtoMapping(stockTransfer.get(),
				ApprovalTransferDto.class);

		return approvalTransferDto;
	}
}
