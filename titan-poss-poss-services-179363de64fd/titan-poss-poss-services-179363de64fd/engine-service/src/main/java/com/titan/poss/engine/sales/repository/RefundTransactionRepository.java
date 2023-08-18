package com.titan.poss.engine.sales.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CancelDao;



/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface RefundTransactionRepository extends JpaRepository<CancelDao, String>{
	
	@Query(nativeQuery = true, value = "SELECT CASE WHEN EXISTS (select * from refund_transaction rt \r\n"
			+ "JOIN cash_memo_details cmd on cmd.cash_memo_id=rt.ref_sales_id\r\n"
			+ "where ref_sales_id = :id)\r\n"
			+ "THEN CAST(1 AS BIT)\r\n"
			+ "ELSE CAST(0 AS BIT) END AS BOOL")
	Boolean findByIds(@Param("id")String id);


}
