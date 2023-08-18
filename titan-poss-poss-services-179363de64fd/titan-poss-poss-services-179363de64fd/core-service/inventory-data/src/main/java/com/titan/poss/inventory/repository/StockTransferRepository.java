/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
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

import com.titan.poss.inventory.dao.StockTransferDao;
import com.titan.poss.inventory.dto.response.InventoryCountDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("InvSchedulerStockTransferRepo")
public interface StockTransferRepository extends JpaRepository<StockTransferDao, Integer> {

	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryCountDto(i.transferType,count(i)) FROM  StockTransferDao i "
			+ " WHERE i.destLocationCode = :locationCode AND i.status = :status AND i.transferType in (:transferTypes)  "
			+ " GROUP BY i.transferType ")
	List<InventoryCountDto> getStnCount(@Param("locationCode") String locationCode, @Param("status") String status,
			@Param("transferTypes") List<String> transferTypes);

	Optional<StockTransferDao> findByIdAndDestLocationCodeAndTransferType(Integer id, String locationCode,
			String transferType);

	Optional<StockTransferDao> findByIdAndTransferType(Integer id, String transferType);

	@Query("select s from StockTransferDao s where s.transferType = :transferType and s.status = :status and s.srcLocationCode = :srcLocationCode  and s.destLocationCode is NULL")
	List<StockTransferDao> findByTransferTypeAndStatusAndSrcLocationCode(@Param("transferType") String transferType,
			@Param("status") String status, @Param("srcLocationCode") String srcLocationCode);

	@Query("select s from StockTransferDao s where s.transferType = :transferType AND s.status = :status AND s.srcLocationCode=:srcLocationCode and s.srcDocDate > :compareDate"
			+ " AND (s.srcDocNo = :srcDocNo OR :srcDocNo IS NULL)  AND s.isDirectTransfer IS NULL")
	Page<StockTransferDao> findStockTransferStnCancel(@Param("srcDocNo") Integer srcDocNo,
			@Param("transferType") String transferType, @Param("status") String status,
			@Param("srcLocationCode") String srcLocationCode, @Param("compareDate") Date compareDate,
			Pageable pageable);

	@Query("select count(s) from StockTransferDao s where s.transferType = :transferType AND s.status = :status AND s.srcLocationCode=:srcLocationCode and s.srcDocDate > :compareDate AND s.isDirectTransfer IS NULL")
	Long findStockTransferStnCancelCount(@Param("transferType") String transferType, @Param("status") String status,
			@Param("srcLocationCode") String srcLocationCode, @Param("compareDate") Date compareDate);

	@Modifying
	@Query("UPDATE StockTransferDao si set"
			+ " si.totalIssuedQuantity = si.totalIssuedQuantity + :totalQuantity, si.totalIssuedWeight = si.totalIssuedWeight + :totalWeight, si.totalIssuedValue = si.totalIssuedValue + :totalValue,"
			+ " si.totalReceivedQuantity = si.totalReceivedQuantity + :totalQuantity, si.totalReceivedWeight = si.totalReceivedWeight + :totalWeight, si.totalReceivedValue = si.totalReceivedValue + :totalValue"
			+ " where si.id = :id AND si.status = 'OPEN'")
	void updateTotalValues(@Param("totalQuantity") Short totalQuantity, @Param("totalWeight") BigDecimal totalWeight,
			@Param("totalValue") BigDecimal totalValue, @Param("id") Integer id);

	@Query(nativeQuery = true, value = "SELECT * from (SELECT transfer_details.id as id,transfer_details.lotNumber as lotNumber, transfer_details.itemCode as itemCode, COALESCE(inv_details.totalQuantity, 0) as totalQuantity,transfer_details.selectedQuantity	FROM "
			+ "	(SELECT id as inventoryId, total_quantity as totalQuantity FROM inventory_details )as inv_details "
			+ "	RIGHT OUTER JOIN "
			+ "	(SELECT  id as id, item_code as itemCode, lot_number as lotNumber, issued_quantity as selectedQuantity,status,inventory_id as inventoryId "
			+ " FROM stock_transfer_details "
			+ "	WHERE status='SELECTED' AND stock_transfer_id =:id ) as transfer_details 	"
			+ "	ON inv_details.inventoryId=transfer_details.inventoryId) as result where totalQuantity<selectedQuantity")
	List<Object[]> checkAvailableQuantityWithInventory(@Param("id") Integer id);

	// updating header while confirming ISSUE.
	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_transfer SET"
			+ " last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate,"
			+ "total_received_value=i.reqValue,"
			+ " total_received_quantity=i.quantity, total_received_weight=i.weights FROM "
			+ "(SELECT sum(sd.received_quantity) as quantity," + "sum(sd.received_weight) as weights,"
			+ "sum(sd.received_value) as reqValue "
			+ "FROM stock_transfer_details sd where stock_transfer_id=:id)as i where id=:id")
	void updateTotalWeightAndQuantity(@Param("id") Integer id, @Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy);

	@Modifying
	@Query("UPDATE com.titan.poss.inventory.dao.StockTransferDao sr set sr.prints = :printCount where sr.id = :id ")
	void updatePrintCount(@Param("printCount") Short printCount, @Param("id") Integer id);

	// updating header while confirming request.
	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_transaction SET"
			+ " last_modified_by = :lastModifiedBy, last_modified_date = :lastModifiedDate,"
			+ "total_received_value=i.reqValue,"
			+ " total_received_quantity=i.quantity, total_received_weight=i.weights FROM "
			+ "(SELECT sum(sd.received_quantity) as quantity," + "sum(sd.received_weight) as weights,"
			+ "sum(sd.received_value) as reqValue "
			+ "FROM stock_transaction_details sd where stock_transaction_id=:id)as i where id=:id")
	void updateReceivedTotalWeightAndQuantity(@Param("id") Integer id, @Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy);

	Optional<StockTransferDao> findByIdAndSrcLocationCodeAndTransferType(Integer id, String locationCode,
			String transferType);

	// Queries related to history
	@Query("SELECT st FROM StockTransferDao st WHERE st.transferType = :transferType AND st.srcLocationCode = :srcLocationCode AND "
			+ " (st.destLocationCode = :destLocationCode OR :destLocationCode IS NULL) AND"
			+ " st.srcDocDate between :startDate AND :endDate AND st.status IN (:status) AND "
			+ " (st.srcDocNo = :srcDocNo OR :srcDocNo IS NULL) AND "
			+ " (st.destDocNo = :destDocNo OR :destDocNo IS NULL) AND"
			+ " (st.srcFiscalYear = :srcFiscalYear OR :srcFiscalYear IS NULL) AND"
			+ " (st.destFiscalYear = :destFiscalYear OR :destFiscalYear IS NULL)")
	Page<StockTransferDao> listStockTransferIssueHistory(@Param("transferType") String transferType,
			@Param("srcDocNo") Integer srcDocNo, @Param("srcLocationCode") String srcLocationCode,
			@Param("destLocationCode") String destLocationCode, @Param("startDate") Date startDate,
			@Param("endDate") Date endDate, @Param("status") List<String> status,
			@Param("destFiscalYear") Short destFiscalYear, @Param("destDocNo") Integer destDocNo,
			@Param("srcFiscalYear") Short srcFiscalYear, Pageable pageable);
	
	@Query("SELECT st FROM StockTransferDao st WHERE st.transferType = :transferType AND st.srcLocationCode = :srcLocationCode AND "
			+ " (st.destLocationCode = :destLocationCode OR :destLocationCode IS NULL) AND"
			+ " st.srcDocDate between :startDate AND :endDate AND st.status IN (:status) AND "
			+ " (st.srcDocNo = :srcDocNo OR :srcDocNo IS NULL) AND "
			+ " (st.destDocNo = :destDocNo OR :destDocNo IS NULL) AND"
			+ " (st.srcFiscalYear = :srcFiscalYear OR :srcFiscalYear IS NULL) AND"
			+ " (st.destFiscalYear = :destFiscalYear OR :destFiscalYear IS NULL) AND"
			+ " (st.isDirectTransfer IS NULL)")
	Page<StockTransferDao> listStockTransferIssueIbtHistory(@Param("transferType") String transferType,
			@Param("srcDocNo") Integer srcDocNo, @Param("srcLocationCode") String srcLocationCode,
			@Param("destLocationCode") String destLocationCode, @Param("startDate") Date startDate,
			@Param("endDate") Date endDate, @Param("status") List<String> status,
			@Param("destFiscalYear") Short destFiscalYear, @Param("destDocNo") Integer destDocNo,
			@Param("srcFiscalYear") Short srcFiscalYear, Pageable pageable);

	@Query("SELECT st FROM StockTransferDao st WHERE st.transferType = :transferType AND st.srcLocationCode = :srcLocationCode AND "
			+ " (st.destLocationCode = :destLocationCode OR :destLocationCode IS NULL) AND"
			+ " st.srcDocDate between :startDate AND :endDate AND st.status IN (:status) AND "
			+ " (st.srcDocNo = :srcDocNo OR :srcDocNo IS NULL) AND "
			+ " (st.destDocNo = :destDocNo OR :destDocNo IS NULL) AND"
			+ " (st.srcFiscalYear = :srcFiscalYear OR :srcFiscalYear IS NULL) AND"
			+ " (st.destFiscalYear = :destFiscalYear OR :destFiscalYear IS NULL) AND"
	        + " (st.isDirectTransfer =true)")
	Page<StockTransferDao> listStockTransferIssueLegacyIbtHistory(@Param("transferType") String transferType,
			@Param("srcDocNo") Integer srcDocNo, @Param("srcLocationCode") String srcLocationCode,
			@Param("destLocationCode") String destLocationCode, @Param("startDate") Date startDate,
			@Param("endDate") Date endDate, @Param("status") List<String> status,
			@Param("destFiscalYear") Short destFiscalYear, @Param("destDocNo") Integer destDocNo,
			@Param("srcFiscalYear") Short srcFiscalYear, Pageable pageable);
	
	// Queries related to history
	@Query("SELECT st FROM StockTransferDao st WHERE st.transferType = :transferType AND "
			+ "	(st.srcDocNo = :srcDocNo OR :srcDocNo IS NULL) AND st.destLocationCode = :destLocationCode AND "
			+ " (st.srcLocationCode = :srcLocationCode OR :srcLocationCode IS NULL) AND"
			+ " st.destDocDate between :startDate AND :endDate AND st.status IN (:statuses) AND "
			+ "	(st.destDocNo = :destDocNo OR :destDocNo IS NULL) AND "
			+ " (st.srcFiscalYear = :srcFiscalYear OR :srcFiscalYear IS NULL) AND"
			+ " (st.destFiscalYear = :destFiscalYear OR :destFiscalYear IS NULL)")
	Page<StockTransferDao> listStockTransferReceiveHistory(@Param("transferType") String transferType,
			@Param("srcDocNo") Integer srcDocNo, @Param("srcLocationCode") String srcLocationCode,
			@Param("destLocationCode") String destLocationCode, @Param("startDate") Date startDate,
			@Param("endDate") Date endDate, @Param("statuses") List<String> statuses,
			@Param("destFiscalYear") Short destFiscalYear, @Param("destDocNo") Integer destDocNo,
			@Param("srcFiscalYear") Short srcFiscalYear, Pageable pageable);

	Optional<StockTransferDao> findByIdAndSrcLocationCode(Integer id, String locationCode);

	Optional<StockTransferDao> findByIdAndDestLocationCode(Integer id, String locationCode);

	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_transfer SET total_received_quantity = total_issued_quantity, "
			+ " total_received_weight = total_issued_weight,total_received_value = total_issued_value,last_modified_by = :lastModifiedBy, "
			+ " last_modified_date = :lastModifiedDate WHERE status='ISSUED' AND transfer_type IN ('FAC_BTQ', 'BTQ_BTQ', 'MER_BTQ')")
	void updateStockTransferStatus(@Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy);

	@Modifying
	@Query("UPDATE StockTransferDao st SET st.orderType = :orderType WHERE st.id = :id")
	void updateStockTransferOrderType(@Param("id") Integer id, @Param("orderType") String orderType);

	/**
	 * @param stockTransferId
	 */
	StockTransferDao findOneById(Integer stockTransferId);

	StockTransferDao findByDestLocationCodeAndTransferTypeAndSrcDocNo(String destLocationCode, String transferType,
			Integer srcDocNo);

	List<StockTransferDao> findByTransferTypeInAndFilePublishedAndIsDirectTransferAndStatusIn(List<String> invoiceType,
			Boolean filePublishedStatus,Boolean isDirectTransfer,List<String> status);
	
	
	@Query(nativeQuery = true, value = "SELECT st.* FROM stock_transfer st INNER JOIN stock_transfer_details sd ON st.id = sd.stock_transfer_id WHERE st.transfer_type=:transferType"
			+ " AND st.dest_location_code = :destLocationCode AND st.src_location_code = :srcLocationCode AND st.src_doc_no = :srcDocNo AND sd.product_group=:productGroup"
			+ " AND st.src_fiscal_year = :srcFiscalYear ")
	
	List<StockTransferDao> getStockTransfer(@Param("transferType") String transferType, 
			@Param("destLocationCode") String destLocationCode,@Param("srcLocationCode") String srcLocationCode,@Param("srcDocNo") Integer srcDocNo,
			 @Param("productGroup") String productGroup,@Param("srcFiscalYear") Short srcFiscalYear);

}
