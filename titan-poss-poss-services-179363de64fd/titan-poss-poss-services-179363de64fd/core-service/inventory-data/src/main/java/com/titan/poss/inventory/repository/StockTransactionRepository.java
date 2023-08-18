/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.repository;

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

import com.titan.poss.inventory.dao.StockTransactionDao;
import com.titan.poss.inventory.dto.response.InventoryCountDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("InvStockTransactionRepo")
public interface StockTransactionRepository extends JpaRepository<StockTransactionDao, Integer> {

	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryCountDto(i.transactionType,count(i)) FROM  StockTransactionDao i "
			+ " WHERE i.locationCode = :locationCode AND i.status = :status AND i.transactionType in (:transactionTypes) "
			+ " GROUP BY i.transactionType ")
	List<InventoryCountDto> getStockTransactionCount(@Param("locationCode") String locationCode,
			@Param("status") String status, @Param("transactionTypes") List<String> transactionTypes);

	Optional<StockTransactionDao> findByIdAndLocationCodeAndTransactionType(Integer id, String locationCode,
			String transactionType);

	@Modifying
	@Query("UPDATE com.titan.poss.inventory.dao.StockTransactionDao sr set sr.prints = :printCount where sr.id = :id ")
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
	void updateTotalWeightAndQuantity(@Param("id") Integer id, @Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy);

	// Queries related to history
	@Query("SELECT st FROM com.titan.poss.inventory.dao.StockTransactionDao st WHERE st.transactionType = :transactionType AND "
			+ "	(st.issuedDocNo = :issuedDocNo OR :issuedDocNo IS NULL) AND "
			+ "	st.locationCode = :locationCode AND "
			+ " (st.issuedFiscalYear = :issueFiscalYear OR :issueFiscalYear IS NULL) AND "
			+ " (st.receivedFiscalYear = :receiveFiscalYear OR :receiveFiscalYear IS NULL) AND "
			+ " (st.receivedDocNo = :receiveDocNo OR :receiveDocNo IS NULL) AND "
			+ " st.issuedDocDate between :startDate AND :endDate AND st.status IN (:statuses)")
	Page<StockTransactionDao> listStockTransactionIssueHistory(@Param("transactionType") String transactionType,
			@Param("issuedDocNo") Integer issuedDocNo, @Param("locationCode") String locationCode,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate,
			@Param("statuses") List<String> statuses, @Param("receiveDocNo") Integer receiveDocNo,
			@Param("issueFiscalYear") Short issueFiscalYear, @Param("receiveFiscalYear") Short receiveFiscalYear,
			Pageable pageable);

	// Queries related to history
	@Query("SELECT st FROM com.titan.poss.inventory.dao.StockTransactionDao st WHERE st.transactionType = :transactionType AND "
			+ "	(st.issuedDocNo = :issuedDocNo OR :issuedDocNo IS NULL) AND "
			+ "	st.locationCode = :locationCode AND "
			+ " (st.issuedFiscalYear = :issueFiscalYear OR :issueFiscalYear IS NULL) AND "
			+ " (st.receivedFiscalYear = :receiveFiscalYear OR :receiveFiscalYear IS NULL) AND "
			+ " (st.receivedDocNo = :receiveDocNo OR :receiveDocNo IS NULL) AND "
			+ " st.receivedDocDate between :startDate AND :endDate AND st.status IN (:statuses)")
	Page<StockTransactionDao> listStockTransactionReceiveHistory(@Param("transactionType") String transactionType,
			@Param("issuedDocNo") Integer issuedDocNo, @Param("locationCode") String locationCode,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate,
			@Param("statuses") List<String> statuses, @Param("receiveDocNo") Integer receiveDocNo,
			@Param("issueFiscalYear") Short issueFiscalYear, @Param("receiveFiscalYear") Short receiveFiscalYear,
			Pageable pageable);

	Optional<StockTransactionDao> findByIdAndLocationCode(Integer id, String locationCode);

	/**
	 * @param stockId
	 * @return StockTransactionDao
	 */
	StockTransactionDao findOneById(Integer stockId);

}
