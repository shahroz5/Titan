/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.inventory.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dto.ItemsParamListDto;
import com.titan.poss.inventory.dto.RequestIBTCountDto;
import com.titan.poss.inventory.dto.request.HistoryIssueItemRequestDto;
import com.titan.poss.inventory.dto.request.HistoryIssueRequestDto;
import com.titan.poss.inventory.dto.request.IssueStockItemBulkDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;
import com.titan.poss.inventory.dto.response.RequestStockItemResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface StockRequestService {
	List<InventoryCountDto> getStockRequestCount(String locationCode, List<String> requestTypeList,
			List<String> stnstatus);

	Optional<StockRequestDao> findByStockRequestCriteria(Example<StockRequestDao> criteria);

	Page<StockRequestDao> findAllStockRequestsByCriteria(Example<StockRequestDao> criteria, Pageable pageable);

	Page<StockRequestDao> findAllBySrcLocationCodeAndRequestTypeAndReqDocNoAndStatusIn(String locationcode,
			String requestType, Integer reqDocNo, List<String> statusList, Pageable pageable);

	StockRequestDao getStockRequestByIdAndType(Integer id, String requestType);

	Page<StockRequestDetailsDao> findAllStockRequestItems(Example<StockRequestDetailsDao> criteria, Pageable pageable);

	Page<StockRequestDetailsDao> findAllStockRequestItems(StockRequestDao stockRequest, String status,
			List<String> productCategory, List<String> productGroup, String itemCode, String lotNumber,
			Pageable pageable);
	// Service related to Stock request starts here

	StockRequestDao saveStockRequest(StockRequestDao requestDetails);

	StockRequestDetailsDao saveStockRequestDetails(StockRequestDetailsDao requestItemDetails);

	List<StockRequestDetailsDao> saveAllStockRequestDetails(List<StockRequestDetailsDao> requestItemList);

	Optional<StockRequestDao> findStockRequestById(Integer id);

	Optional<StockRequestDetailsDao> findStockRequestDetailsById(String itemId);

	Optional<List<StockRequestDetailsDao>> findAllPendingStockRequestForItem(String locationCode, String requestType,
			String itemCode, String status);

	// To get stock request count based on requestType & Group By(SENT or RECEIVED)
	Long findStockRequestCountGroupBy(String locationCode, String requestType, List<String> historyStatus,
			Integer historyTime, String groupBy);

	// To list Stock requests based on requestType & status
	Page<StockRequestDao> findAllByRequestTypeAndStatus(String requestType, String status, Pageable pageable);

	RequestStockItemResponseDto getStockRequestItemByIdAndItemIdAndRequestType(Integer id, String itemId,
			String requestType);

	Optional<StockRequestDao> findByIdAndRequestTypeAndStatus(Integer stockRequestId, String requestType,
			String status);

	Optional<StockRequestDao> findByIdAndRequestTypeAndStatusIn(Integer stockRequestId, String requestType,
			List<String> statusList);

	Optional<List<StockRequestDetailsDao>> findAllByStockRequestReqLocationCodeAndStockRequestRequestTypeAndItemCodeAndStatus(
			String locationCode, String requestType, String itemCode, String status);

	Optional<StockRequestDetailsDao> findByIdAndStatusInAndStockRequest(String itemId, List<String> status,
			StockRequestDao stockRequest);

	Optional<StockRequestDao> findByIdAndSrcLocationCodeAndRequestTypeAndStatus(Integer stockRequestId,
			String locationCode, String requestType, String status);

	Integer updateAcceptedItemStatus(String status, StockRequestDao stockRequest, List<String> itemIdList,
			List<String> statusList);

	Integer updateRejectedItemStatus(String status, StockRequestDao stockRequest, List<String> itemIdList,
			List<String> statusList);

	Short getTotalAcceptedQuantity(StockRequestDao stockRequest, String status);

	Integer updateAllRequestItemStatus(String status, StockRequestDao stockRequest, List<String> statusList);

	Optional<StockRequestDao> findByIdAndStatus(Integer stockRequestId, String status);

	Optional<StockRequestDao> findByIdAndRequestType(Integer requestId, String requestType);

	StockRequestDao findByIdAndRequestTypeAndReqLocationCode(Integer requestId, String requestType,
			String locationCode);

	StockRequestDao findByIdAndRequestTypeAndSrcLocationCode(Integer requestId, String requestType,
			String locationCode);

	List<InventoryCountDto> getRequestCountByStatus(List<String> status);

	Short getAcceptedItemQuantity(StockRequestDao stockRequest, String itemCode, String status);

	Short getApprovedItemQuantity(StockRequestDao stockRequest, String itemCode, String status);

	Short getTotalApprovedQuantity(StockRequestDao stockRequest, String status);

	// Service related to Stock request ends here

	List<StockRequestDetailsDao> findAllStockRequestItems(Example<StockRequestDetailsDao> criteria);

	StockRequestDao save(StockRequestDao stockRequest);

	StockRequestDetailsDao save(StockRequestDetailsDao stockRequestDetails);

	void updateStockRequestDetailsStatus(StockRequestDao stockRequest);

	// updating status of items for LOAN,EXH,LOSS,PSV,ADJ
	void updateIssueRequestItems(Integer id, String requestType, IssueStockItemBulkDto issueStockItemBulkDto);

	// Services related to Other Requests starts here

	List<Object[]> listOtherRequestAvailableItems(ItemsParamListDto params, Pageable pageable);

	Integer findOtherRequestPageSize(ItemsParamListDto params, Pageable pageable);

	List<StockRequestDao> findAllByRequestTypeAndStatusAndSrcLocationCode(String requestType, String status,
			String srcLocationCode);

	StockRequestDao getOne(Integer id);

	StockRequestDetailsDao getOne(String itemId);

	List<StockRequestDetailsDao> findByStockRequest(StockRequestDao stockRequest);

	List<StockRequestDetailsDao> findAllById(List<String> itemIds);

	Page<StockRequestDetailsDao> findAllByStockRequestId(Integer requestId, Pageable pageable);

	void deleteInBatch(List<StockRequestDetailsDao> stockRequestDetailsList);

	void updateTotalValues(Short totalQuantity, BigDecimal totalWeight, BigDecimal totalValue, Integer id,
			Date lastModifiedDate, String lastModifiedBy);

	// for ADJ PSV CONV LOSS LOAN EXH
	void updatingTotalWeightAndQuantity(Integer id, Date lastModifiedDate, String lastModifiedBy);
	
	List<StockRequestDetailsDao> listItemsPsv(List<String> id,String locationCode);
	
	List<Object[]> checkAvailableQuantityWithInventory(Integer id);

	List<StockRequestDetailsDao> findByStockRequestAndStatus(StockRequestDao stockRequest, String string);

	// Services related to Other Requests ends here

	// updating status of items for MER,FAC,BTQ
	void updateStockIssueRequestItems(Integer id, String requestType, IssueStockItemBulkDto issueStockItemBulkDto);

	void cancelRequestDetails(StockRequestDao otherRequest, String toStatus, String fromStatus);

	Page<StockRequestDetailsDao> listStockRequestItems(StockRequestDao stRequest, String requestType, String itemCode,
			List<String> productGroup, List<String> productCategory, String lotNumber, List<String> binCode,
			String binGroupCode, String status, Pageable pageable);

	RequestIBTCountDto getIBTCount(String locationCode, String requestType, List<String> statusList, Date businessDate);

	Page<StockRequestDao> findAllByRequestTypeAndMultipleStatusAndSrcLocationCode(String requestType,
			List<String> status, String srcLocationCode, Pageable pageable);

	Page<StockRequestDao> findByRequestTypeAndReqDocNoAndSrcLocationCodeAndStatusIn(String requestType,
			Integer srcDocNo, String srcLocationCode, List<String> status, Pageable pageable);

	Integer getSelectedItemsCount(Integer id, String string);

	List<Object[]> checkBinValidationWithInventoryStockIssue(Integer id);

	List<Object[]> checkBinValidationWithInventoryOtherIssue(Integer id);

	void updateHeaderValuesStockIssue(Integer id);

	// history method
	Page<StockRequestDao> findStockRequestHistoryBySrcLocationCodeAndRequestType(String requestType,
			String srcLocationCode, HistoryIssueRequestDto historyIssueRequestDto, Date startDate, Date endDate,
			List<String> statuses, Pageable pageable);

	// history method
	Page<StockRequestDao> findStockRequestHistoryByDestLocationCodeAndRequestType(String requestType,
			String destLocationCode, HistoryIssueRequestDto historyIssueRequestDto, Date startDate, Date endDate,
			List<String> statuses, Pageable pageable);

	List<StockRequestDetailsDao> findByItemCodeAndLotNumberAndRequestedWeightAndStatus(String itemCode,
			String lotNumber, BigDecimal requestedWeight, String status);

	Page<StockRequestDetailsDao> listStockIssueItemsHistory(StockRequestDao stRequest,
			HistoryIssueItemRequestDto historyIssueItemRequestDto, Pageable pageable);

	List<Object[]> validateDefectiveAndDisputeItems(List<String> inventoryIds);

	StockRequestDao findById(Integer id);

	List<StockRequestDao> findAllStockRequestBySrcLocationCodeAndRequestTypeAndStatus(String srcLocationCode,
			String requestType, String status);

	List<StockRequestDetailsDao> findByItemCodeAndLotNumberAndRequestedWeightAndStatusAndListStockRequest(
			String itemCode, String lotNumber, BigDecimal requestedWeight, String status,
			List<StockRequestDao> stockRequestDaos);

	// New Implementation
	Page<StockRequestDao> findAllActiveStockRequests(String requestType, Integer reqDocNo, String status,
			String srcLocationCode, String reqLocationCode, List<String> historyStatus, Integer historyTime,
			Pageable pageable);

	// Approval Service starts here

	// To list Approval requests based on criteria
	Page<StockRequestDao> findAllByCriteria(Example<StockRequestDao> criteria, Pageable pageable);

	// Approval Services Ends here

	StockRequestDao findStockRequestByIdAndSrcLocationCodeAndRequestType(Integer id, String locationCode,
			String requestType);

	StockRequestDao findStockReuqestByIdAndDestLocationCodeAndRequestType(Integer id, String locationCode,
			String requestType);
	
	List<StockRequestDao>  findAllByStatusAndComConfirm(String status, Boolean comConfirm);
}
