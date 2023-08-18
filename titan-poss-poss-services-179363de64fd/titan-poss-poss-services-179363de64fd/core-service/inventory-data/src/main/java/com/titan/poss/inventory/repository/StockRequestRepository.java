/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;
import com.titan.poss.inventory.dto.RequestIBTCountDto;
import com.titan.poss.inventory.dto.response.InventoryCountDto;

/**
 * Handles repository operations for Stn
 * 
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface StockRequestRepository extends JpaRepository<StockRequestDao, Integer> {

	@Query(value = "select new com.titan.poss.inventory.dto.response.InventoryCountDto(s.requestType, count(*)) from StockRequestDao s where s.srcLocationCode = :locationCode and s.status in (:stnstatus) and s.requestType in (:requesttype) group by s.requestType ")
	List<InventoryCountDto> getStnCount(@Param("locationCode") String locationCode,
			@Param("requesttype") List<String> requestTypeList, @Param("stnstatus") List<String> stnstatus);

	@Query("select stockrequest from StockRequestDao stockrequest where  stockrequest.srcLocationCode= :srcLocationCode and stockrequest.requestType= :requestType and (stockrequest.reqDocNo=:reqDocNo or :reqDocNo is null) and stockrequest.status in (:status)")
	Page<StockRequestDao> findAllBySrcLocationCodeAndRequestTypeAndReqDocNoAndStatusIn(
			@Param("srcLocationCode") String srcLocationCode, @Param("requestType") String requestType,
			@Param("reqDocNo") Integer reqDocNo, @Param("status") List<String> status, Pageable pageable);

	// Queries related to stock request starts here

	// To get count of stock request based on requestType & status
	Long countByRequestTypeAndStatusIn(String requestType, String status);

	// To get count of stock request based on status(for approval request)
	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryCountDto(i.requestType,count(i)) FROM  StockRequestDao i "
			+ " WHERE i.status in (:status)  GROUP BY i.requestType ")
	List<InventoryCountDto> getRequestCountByStatus(@Param("status") List<String> status);

	// To list Stock requests for Approver
	Page<StockRequestDao> findAllByRequestTypeAndStatus(String requestType, String status, Pageable pageable);

	// To list all the stock requests being SENT
	Page<StockRequestDao> findAllByReqLocationCodeAndRequestTypeAndStatusNotIn(String locationCode, String requestType,
			List<String> statusList, Pageable pageable);

	// To list all the stock requests being RECEIVED
	Page<StockRequestDao> findAllBySrcLocationCodeAndRequestTypeAndStatusNotIn(String locationCode, String requestType,
			List<String> statusList, Pageable pageable);

	// To Get the SENT Stock request Details
	StockRequestDao findByIdAndRequestTypeAndReqLocationCode(Integer stockRequestId, String requestType,
			String locationCode);

	// To Get the Received Stock request details
	StockRequestDao findByIdAndRequestTypeAndSrcLocationCode(Integer stockRequestId, String requestType,
			String locationCode);

	Optional<StockRequestDao> findByIdAndRequestType(Integer requestId, String requestType);

	Optional<StockRequestDao> findByIdAndRequestTypeAndStatus(Integer stockRequestId, String requestType,
			String status);

	Optional<StockRequestDao> findByIdAndRequestTypeAndStatusIn(Integer stockRequestId, String requestType,
			List<String> statusList);

	Optional<StockRequestDao> findByIdAndSrcLocationCodeAndRequestTypeAndStatus(Integer stockRequestId,
			String locationCode, String requestType, String status);

	Optional<StockRequestDao> findByIdAndStatus(Integer stockRequestId, String status);

	// To get IBT Count of a Requesting boutique
	@Query("SELECT new com.titan.poss.inventory.dto.RequestIBTCountDto(count(i.status),SUM(i.totalRequestedQuantity),SUM(i.totalRequestedValue)) FROM  StockRequestDao i WHERE i.reqLocationCode = :locationCode AND i.requestType = :requestType AND i.status in (:statusList) AND \r\n"
			+ "YEAR(i.reqDocDate) = YEAR(:businessDate) AND  MONTH(i.reqDocDate) = MONTH(:businessDate)")
//			+ "YEAR(i.reqDocDate) = YEAR(CURRENT_TIMESTAMP) AND  MONTH(i.reqDocDate) = MONTH(CURRENT_TIMESTAMP)")
	RequestIBTCountDto getIBTCount(@Param("locationCode") String locationCode, @Param("requestType") String requestType,
			@Param("statusList") List<String> statusList, @Param("businessDate") Date businessDate);

	// Query to Get Active stock requests list(Other than the requests with history
	// status for more than 48 hours)
	@Query("SELECT sr FROM StockRequestDao sr WHERE sr.requestType = :requestType AND "
			+ "(sr.reqDocNo = :reqDocNo OR :reqDocNo IS NULL) AND (sr.status = :status OR :status IS NULL) "
			+ "AND (sr.srcLocationCode = :srcLocationCode OR :srcLocationCode IS NULL) AND (sr.reqLocationCode = :reqLocationCode OR :reqLocationCode IS NULL) "
			+ "AND sr.id NOT IN (SELECT sr1.id FROM StockRequestDao sr1 where sr1.requestType = :requestType "
			+ "AND (sr1.srcLocationCode = :srcLocationCode OR :srcLocationCode IS NULL) "
			+ "AND (sr1.reqLocationCode = :reqLocationCode OR :reqLocationCode IS NULL) "
			+ "AND sr1.status IN (:historyStatus) AND DATEDIFF(HOUR,sr1.lastModifiedDate,CURRENT_TIMESTAMP) > :historyTime)")
	Page<StockRequestDao> findAllActiveStockRequests(@Param("requestType") String requestType,
			@Param("reqDocNo") Integer reqDocNo, @Param("status") String status,
			@Param("srcLocationCode") String srcLocationCode, @Param("reqLocationCode") String reqLocationCode,
			@Param("historyStatus") List<String> historyStatus, @Param("historyTime") Integer historyTime,
			Pageable pageable);

	// Query to Get Active stock requests count(Other than the requests with history
	// status for more than 48 hours)
	@Query("SELECT COUNT(*) FROM StockRequestDao sr WHERE sr.requestType = :requestType "
			+ "AND (sr.srcLocationCode = :srcLocationCode OR :srcLocationCode IS NULL) "
			+ "AND (sr.reqLocationCode = :reqLocationCode OR :reqLocationCode IS NULL) "
			+ "AND sr.id NOT IN (SELECT sr1.id FROM StockRequestDao sr1 where sr1.requestType = :requestType "
			+ "AND (sr1.srcLocationCode = :srcLocationCode OR :srcLocationCode IS NULL) "
			+ "AND (sr1.reqLocationCode = :reqLocationCode OR :reqLocationCode IS NULL) "
			+ "AND sr1.status IN (:historyStatus) AND DATEDIFF(HOUR,sr1.lastModifiedDate,CURRENT_TIMESTAMP) > :historyTime)")
	Long countOfActiveStockRequests(@Param("requestType") String requestType,
			@Param("srcLocationCode") String srcLocationCode, @Param("reqLocationCode") String reqLocationCode,
			@Param("historyStatus") List<String> historyStatus, @Param("historyTime") Integer historyTime);

	// Queries related to stock request ends here

	// Queries related to other request starts here

	List<StockRequestDao> findAllByRequestTypeAndStatusAndSrcLocationCode(String requestType, String status,
			String srcLocationCode);

	@Modifying
	@Query("UPDATE StockRequestDao sr set"
			+ " sr.totalRequestedQuantity = sr.totalRequestedQuantity + :totalQuantity, sr.totalRequestedWeight = sr.totalRequestedWeight + :totalWeight, sr.totalRequestedValue = sr.totalRequestedValue + :totalValue,"
			+ " sr.lastModifiedBy = :lastModifiedBy,sr.lastModifiedDate = :lastModifiedDate"
			+ " where sr.id = :id AND sr.status = :status")
	void updateTotalValues(@Param("totalQuantity") Short totalQuantity, @Param("totalWeight") BigDecimal totalWeight,
			@Param("totalValue") BigDecimal totalValue, @Param("id") Integer id, @Param("status") String status,
			@Param("lastModifiedDate") Date lastModifiedDate, @Param("lastModifiedBy") String lastModifiedBy);

	// updating header while creating request.
	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_request SET"
			+ " last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate,"
			+ "total_requested_value=i.reqValue,"
			+ " total_requested_quantity=i.quantity, total_requested_weight=i.weights FROM "
			+ "(SELECT sum(sd.requested_quantity) as quantity," + "sum(sd.requested_weight) as weights,"
			+ "sum(sd.requested_value) as reqValue "
			+ "FROM stock_request_details sd where stock_request_id=:id)as i where id=:id")
	void updatingTotalWeightAndQuantity(@Param("id") Integer id, @Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy);

	// sum of selectedQty,RequestedWeight,requestedValue (LOAN,EXH,LOSS,ADJ,PSV,)
	// need to update totalValue
	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_request SET "
			+ " last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate,"
			+ "total_issued_quantity=i.totalQuantity," + "total_issued_weight=i.totalWeight " + "FROM "
			+ "(SELECT sum(selected_quantity) as totalQuantity,sum(selected_weight) as totalWeight "
			+ "FROM stock_request_details where stock_request_id=:requestId and status='SELECTED')as i where id=:requestId")
	void updateHeaderValuesOtherIssue(@Param("requestId") Integer requestId,
			@Param("lastModifiedDate") Date lastModifiedDate, @Param("lastModifiedBy") String lastModifiedBy);

	@Query(nativeQuery = true, value = "SELECT * from (SELECT request_details.id as id, request_details.lotNumber, request_details.itemCode, COALESCE(inv_details.totalQuantity, 0) as totalQuantity, request_details.requestedQuantity, COALESCE(inv_details.issuedQuantity, 0) as issuedQuantity	FROM "
			+ "	(SELECT id as inventoryId, total_quantity as totalQuantity, issued_quantity as issuedQuantity FROM inventory_details )as inv_details "
			+ "	 RIGHT OUTER JOIN "
			+ "	(SELECT  id as id,selected_quantity as requestedQuantity,status,inventory_id as inventoryId,item_code as itemCode,lot_number as lotNumber "
			+ " FROM stock_request_details "
			+ "	WHERE status='SELECTED' AND stock_request_id =:id ) as request_details 	"
			+ "	ON inv_details.inventoryId=request_details.inventoryId) as result where totalQuantity<requestedQuantity")
	List<Object[]> checkAvailableQuantityWithInventory(@Param("id") Integer id);

	// for stock Issue
	@Query(nativeQuery = true, value = "SELECT * from (SELECT request_details.id as id, request_details.lotNumber, request_details.itemCode, inv_details.currentBinGroup, request_details.previousBinGroup FROM "
			+ "	(SELECT id as inventoryId, bin_group_code as currentBinGroup FROM inventory_details )as inv_details "
			+ "	 RIGHT OUTER JOIN "
			+ "	(SELECT  id as id,status,inventory_id as inventoryId,item_code as itemCode,lot_number as lotNumber, bin_group_code as previousBinGroup "
			+ " FROM stock_request_details "
			+ "	WHERE status='SELECTED' AND stock_request_id =:id ) as request_details 	"
			+ "	ON inv_details.inventoryId=request_details.inventoryId) as result where previousBinGroup != currentBinGroup")
	List<Object[]> checkBinValidationWithInventory(@Param("id") Integer id);

	// for other Issue
	@Query(nativeQuery = true, value = "SELECT * from (SELECT request_details.id as id, request_details.lotNumber, request_details.itemCode, inv_details.currentBinGroup, request_details.previousBinGroup FROM "
			+ "	(SELECT id as inventoryId, bin_group_code as currentBinGroup FROM inventory_details )as inv_details "
			+ "	 RIGHT OUTER JOIN "
			+ "	(SELECT  id as id,status,inventory_id as inventoryId,item_code as itemCode,lot_number as lotNumber, bin_group_code as previousBinGroup "
			+ " FROM stock_request_details "
			+ "	WHERE status='SELECTED' AND stock_request_id =:id ) as request_details 	"
			+ "	ON inv_details.inventoryId=request_details.inventoryId) as result where previousBinGroup != currentBinGroup")
	List<Object[]> checkBinValidationWithInventoryOtherIssue(@Param("id") Integer id);

	@Modifying
	@Query(nativeQuery = true, value = "update stock_request_details "
			+ "set selected_quantity=0,selected_weight=0.00,status='APPROVED' where id in (:itemIds)")
	void updateSelectedValues(@Param("itemIds") List<String> itemIds);

	// sum of selectedQty,isssuedWeight,issuedValue(FAC,BTQ)
	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_request SET "
			+ " last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate,"
			+ "total_selected_quantity=i.totalQuantity," + "total_selected_weight=i.totalWeight "
			+ ", total_issued_value=i.totalValue " + "FROM "
			+ "(SELECT sum(selected_quantity) as totalQuantity,sum(selected_weight) as totalWeight, sum(selected_quantity * std_value ) as totalValue "
			+ "FROM stock_request_details where stock_request_id=:requestId and status='SELECTED')as i where id=:requestId")
	void updateHeaderValuesStockIssue(@Param("requestId") Integer requestId,
			@Param("lastModifiedDate") Date lastModifiedDate, @Param("lastModifiedBy") String lastModifiedBy);

	@Modifying
	@Query("UPDATE StockRequestDetailsDao sd set sd.status= :toStatus where sd.stockRequest=:stockRequest and sd.status=:fromStatus")
	void updateRequestCancellation(@Param("stockRequest") StockRequestDao stockRequest,
			@Param("toStatus") String toStatus, @Param("fromStatus") String fromStatus);

	// Queries related to Other request ends here

	Page<StockRequestDao> findBySrcLocationCodeAndRequestTypeAndStatusIn(String srcLocationCode, String requestType,
			List<String> status, Pageable pageable);

	Page<StockRequestDao> findByRequestTypeAndReqDocNoAndSrcLocationCodeAndStatusIn(String requestType,
			Integer reqDocNo, String srcLocationCode, List<String> status, Pageable pageable);

	// Queries related to history
	@Query("SELECT sr FROM StockRequestDao sr WHERE sr.requestType = :requestType AND (sr.reqDocNo = :reqDocNo OR :reqDocNo IS NULL) AND"
			+ " sr.srcLocationCode = :srcLocationCode AND "
			+ " (sr.reqFiscalYear = :reqFiscalYear OR :reqFiscalYear IS NULL) AND "
			+ " (sr.destLocationCode = :destLocationCode OR :destLocationCode IS NULL) AND"
			+ " sr.reqDocDate BETWEEN :startDate AND :endDate AND sr.status IN (:statuses) ")
	Page<StockRequestDao> findStockRequestHistoryBySrcLocationCodeAndRequestType(
			@Param("requestType") String requestType, @Param("reqDocNo") Integer reqDocNo,
			@Param("srcLocationCode") String srcLocationCode, @Param("destLocationCode") String destLocationCode,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate,
			@Param("statuses") List<String> statuses, @Param("reqFiscalYear") Short reqFiscalYear, Pageable pageable);

	
	@Query("SELECT sr FROM StockRequestDao sr WHERE sr.requestType = :requestType AND (sr.reqDocNo = :reqDocNo OR :reqDocNo IS NULL) AND"
			+ " sr.srcLocationCode = :srcLocationCode AND "
			+ " (sr.reqFiscalYear = :reqFiscalYear OR :reqFiscalYear IS NULL) AND "
			+ " (sr.destLocationCode = :destLocationCode OR :destLocationCode IS NULL) AND"
			+ "  sr.acceptedDate BETWEEN :startDate AND :endDate AND sr.status IN (:statuses) ")
	Page<StockRequestDao> findStockRequestHistoryBySrcLocationCodeAndAcceptedDate(
			@Param("requestType") String requestType, @Param("reqDocNo") Integer reqDocNo,
			@Param("srcLocationCode") String srcLocationCode, @Param("destLocationCode") String destLocationCode,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate,
			@Param("statuses") List<String> statuses, @Param("reqFiscalYear") Short reqFiscalYear, Pageable pageable);
	
	// Queries related to history
	@Query("SELECT sr FROM StockRequestDao sr WHERE sr.requestType = :requestType AND (sr.reqDocNo = :reqDocNo OR :reqDocNo IS NULL) AND"
			+ " sr.destLocationCode = :destLocationCode AND "
			+ " (sr.reqFiscalYear = :reqFiscalYear OR :reqFiscalYear IS NULL) AND "
			+ " (sr.srcLocationCode = :srcLocationCode OR :srcLocationCode IS NULL) AND"
			+ " sr.reqDocDate BETWEEN :startDate AND :endDate AND sr.status IN (:statuses) ")
	Page<StockRequestDao> findStockRequestHistoryByDestLocationCodeAndRequestType(
			@Param("requestType") String requestType, @Param("reqDocNo") Integer reqDocNo,
			@Param("srcLocationCode") String srcLocationCode, @Param("destLocationCode") String destLocationCode,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate,
			@Param("statuses") List<String> statuses, @Param("reqFiscalYear") Short reqFiscalYear, Pageable pageable);
	
	@Query("SELECT sr FROM StockRequestDao sr WHERE sr.requestType = :requestType AND (sr.reqDocNo = :reqDocNo OR :reqDocNo IS NULL) AND"
			+ " sr.destLocationCode = :destLocationCode AND "
			+ " (sr.reqFiscalYear = :reqFiscalYear OR :reqFiscalYear IS NULL) AND "
			+ " (sr.srcLocationCode = :srcLocationCode OR :srcLocationCode IS NULL) AND"
			+ " sr.acceptedDate BETWEEN :startDate AND :endDate AND sr.status IN (:statuses) ")
	Page<StockRequestDao> findStockRequestHistoryByDestLocationCodeAndAcceptedDate(
			@Param("requestType") String requestType, @Param("reqDocNo") Integer reqDocNo,
			@Param("srcLocationCode") String srcLocationCode, @Param("destLocationCode") String destLocationCode,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate,
			@Param("statuses") List<String> statuses, @Param("reqFiscalYear") Short reqFiscalYear, Pageable pageable);
	

	@Query("SELECT sr FROM StockRequestDetailsDao sr WHERE sr.stockRequest in (select id from StockRequestDao where status in ('APPROVED','APVL_PENDING') and reqLocationCode= :locationCode) AND " 
			+ "sr.inventoryId IN (:inventoryId)")
	List<StockRequestDetailsDao> getItemsListForPSV(@Param("inventoryId") List<String> inventoryId,@Param("locationCode") String locationCode);

	List<StockRequestDao> findByRequestTypeAndSrcLocationCodeAndStatus(String requestType, String srcLocationCode,
			String status);

	Optional<StockRequestDao> findByIdAndSrcLocationCode(Integer id, String locationCode);

	Optional<StockRequestDao> findByIdAndDestLocationCode(Integer id, String locationCode);

	Optional<StockRequestDao> findByIdAndSrcLocationCodeAndRequestType(Integer id, String locationCode,
			String requestType);

	Optional<StockRequestDao> findByIdAndDestLocationCodeAndRequestType(Integer id, String locationCode,
			String requestType);

	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_request  SET status= 'EXPIRED',last_modified_by= :lastModifiedBy,last_modified_date = :lastModifiedDate "
			+ " WHERE status='REQUESTED' AND request_type IN ('BTQ') AND req_doc_date <= :previousDate AND dest_location_code = :locationCode")
	void closeUnacceptedIBTRequests(@Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy, @Param("previousDate") Date previousDate,
			@Param("locationCode") String locationCode);

	/**
	 * @param stockId
	 * @return
	 */
	StockRequestDao findOneById(Integer stockId);
	
	List<StockRequestDao> findAllByStatusAndComConfirm(String status, Boolean comConfirm);

}
