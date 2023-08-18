/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dto.CashMemoDetailsResponseDto;

/**
 * Repository for CashMemoDetailsDao.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCashMemoDetailsRepository")
public interface CashMemoDetailsRepository extends JpaRepository<CashMemoDetailsDao, String> {

	List<CashMemoDetailsDao> findByCashMemoDaoId(String cashMemoId);

	// @formatter:off
	@Query(value = "SELECT cmd from CashMemoDetailsDao cmd,CashMemo cm,SalesTxnDao st WHERE cmd.cashMemoDao.id=cm.id "
			+ " AND cm.salesTxnDao.id=st.id AND st.docNo = :docNo AND st.locationCode = :locationCode AND st.fiscalYear = :fiscalYear"
			+ " AND st.txnType = :txnType AND st.status IN ('CONFIRMED','CANCELLED')")
	// @formatter:on
	List<CashMemoDetailsDao> findByDocNoAndLocationCodeAndFiscalYearAndTxnType(@Param("docNo") Integer docNo,
			@Param("locationCode") String locationCode, @Param("fiscalYear") Short fiscalYear,
			@Param("txnType") String txnType);
	
	CashMemoDetailsDao findOneById(String id);
	
	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT cd.id , sales.location_code, sales.fiscal_year,  sales.doc_no, cm.is_migrated,  cd.total_quantity FROM cash_memo_details cd "
			+ " INNER JOIN cash_memo cm on cd.cash_memo_id = cm.id "
			+ " INNER JOIN customer_transaction ctd on ctd.id = cm.id "
			+ " INNER JOIN sales_transaction sales on sales.id = cm.id "
			+ " WHERE ctd.location_code = :locationCode "
			+ " AND cd.item_code = :itemCode "			
			+ " AND ((:mobileNumber  IS NULL or ctd.mobile_number = :mobileNumber) "
			+ " OR (:customerId IS NULL or ctd.customer_id = :customerId)) ")	
	List<Object[]>  getCashMemoByVarientCodeAndMobileNumber(@Param("itemCode") String varientCode, @Param("mobileNumber") String mobileNumber,@Param("locationCode") String locationCode,@Param("customerId") String customerId);


	@Query(nativeQuery = true, value = "SELECT count(cmd.id) from cash_memo_details cmd where cmd.cash_memo_id = :txnId")
	int noOfItemsInCM(@Param("txnId")String txnId);
	
	// @formatter:off
		@Query(nativeQuery = true, value = "SELECT st.id,st.location_code, st.fiscal_year, st.doc_no, cm.is_migrated, cm.total_quantity FROM sales_transaction st "
				+ " INNER JOIN cash_memo cm on cm.id = st.id "
				+ " INNER JOIN cash_memo_details cmd on cmd.cash_memo_id = st.id "
				+ " INNER JOIN customer_transaction ct on ct.id = st.id "
				+ " WHERE st.location_code = :locationCode " 
				+ " AND st.customer_id = :customerId "
				+ " AND status ='CONFIRMED' "
				+ " AND cmd.item_code = :itemCode "
				+ " AND (:mobileNumber  IS NULL or ct.mobile_number = :mobileNumber) ")	
		List<Object[]>  getCashMemoByVarientCodeAndMobileNumberAndCustomerId(@Param("itemCode") String varientCode, @Param("mobileNumber") String mobileNumber,@Param("locationCode") String locationCode,@Param("customerId") String customerId);


	
	
}
