/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CashMemoDao;

/**
 * Repository for <b>cash_memo</b>.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesCashMemoRepository")
public interface CashMemoRepository extends JpaRepository<CashMemoDao, String> {

	// @formatter:off
	@Query("SELECT cm "
			+ " FROM com.titan.poss.sales.dao.CashMemoDao cm \r\n"
			+ " INNER JOIN com.titan.poss.sales.dao.SalesTxnDao st \r\n"
			+ "   ON cm.id = st.id \r\n"
			+ " WHERE st.locationCode = :locationCode \r\n"
			+ " AND (:refTxnId IS NULL OR st.refTxnId.id = :refTxnId) \r\n"
			+ " AND st.status IN :status \r\n"
			+ " AND st.txnType = :txnType \r\n"
			+ " AND (:subTxnType IS NULL OR st.subTxnType = :subTxnType) \r\n"
			+ " AND (:docNo IS NULL OR st.docNo = :docNo) \r\n"
			+ " AND (:fiscalYear IS NULL OR st.fiscalYear = :fiscalYear) \r\n"
			+ " AND (:isMigrated IS NULL OR cm.isMigrated = :isMigrated) \r\n")
	// @formatter:on
	CashMemoDao getByLocationCodeAndStatusAndDocNoAndFiscalYearAndTxnTypeAndSubTxnTypeAndRefTxnIdAndIsMigrated(
			@Param("locationCode") String locationCode, @Param("status") List<String> status, @Param("docNo") Integer docNo,
			@Param("fiscalYear") Short fiscalYear, @Param("txnType") String txnType,
			@Param("subTxnType") String subTxnType, @Param("refTxnId") String refTxnId,@Param("isMigrated") Boolean isMigrated);

	CashMemoDao getBySalesTxnDaoLocationCodeAndSalesTxnDaoDocNoAndSalesTxnDaoFiscalYearAndIsMigrated(@Param("locationCode") String locationCode,@Param("docNo") Integer docNo,
			@Param("fiscalYear")Short fiscalYear, @Param("isMigrated") Boolean isMigrated);
	
	// @formatter:off
	// @formatter:off 
	  @Query(nativeQuery = true, value = "SELECT cd.id , sales.location_code, sales.fiscal_year,  sales.doc_no, cm.is_migrated,  cd.total_quantity FROM cash_memo cm "
				+ " INNER JOIN cash_memo_details cd on cd.cash_memo_id = cm.id "
				+ " INNER JOIN customer_transaction ctd on ctd.id = cm.id "
				+ " INNER JOIN sales_transaction sales on sales.id = cm.id "
				+ " WHERE ctd.location_code = :locationCode "
				+ " AND cd.item_code = :itemCode "
				+ " AND cm.is_migrated = :isMigrated "
				+ " AND sales.status = 'CONFIRMED'"
				+ " AND ((:mobileNumber  IS NULL or ctd.mobile_number = :mobileNumber) "
				+ " OR (:customerId IS NULL or ctd.customer_id = :customerId)) ")
		// @formatter:on
	  List<Object[]>  getByLocationCodeAndItemCodeAndCustomerMobileNoOrCustomerIdAndIsMigrated(
				@Param("locationCode") String locationCode, @Param("itemCode") String itemCode, @Param("mobileNumber") String customerMobileNo,
				@Param("customerId") String customerId,@Param("isMigrated") Boolean isMigrated);

	  @Modifying
		@Query(nativeQuery = true, value = "UPDATE cash_memo \r\n" + " SET created_by = :createdBy \r\n"
				 + " WHERE id = :id")
	void updateCashMemoCreatedBy(@Param("id") String id, @Param("createdBy") String createdBy);

}
