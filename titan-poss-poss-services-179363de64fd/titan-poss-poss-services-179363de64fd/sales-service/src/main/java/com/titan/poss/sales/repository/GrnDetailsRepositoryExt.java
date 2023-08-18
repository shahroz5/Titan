/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.GrnDetailsDaoExt;
import com.titan.poss.sales.dto.ReturnableItemsDto;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesGrnDetailsRepositoryExt")
public interface GrnDetailsRepositoryExt extends JpaRepository<GrnDetailsDaoExt, String> {

	List<GrnDetailsDaoExt> findByGrnId(String id);

	// @formatter:off
	@Query(nativeQuery = true, value =  "\r\n" +   
			  " SELECT cmd.id, cmd.row_id, cmd.item_code, cmd.lot_number, cmd.total_quantity, cmd.inventory_weight, cmd.unit_value, \r\n" + 
			  "	cmd.total_weight, cmd.total_value, cmd.employee_code, cmd.total_tax, cmd.total_discount, cmd.final_value, cmd.hallmark_charges, cmd.hallmark_discount \r\n" + 
			  " FROM (SELECT * FROM cash_memo_details WHERE cash_memo_id = :salesTxnId)  cmd \r\n" + 
			  " LEFT JOIN \r\n" + 
			  "		 (SELECT * FROM goods_return_details \r\n"+ 
			  "		   WHERE cash_memo_details_id IS NOT NULL AND \r\n"
			  + "			goods_return_id IN (SELECT id FROM refund_transaction WHERE ref_sales_id = :salesTxnId)) grnd \r\n" + 
			  "	ON cmd.item_code = grnd.item_code AND cmd.lot_number = grnd.lot_number \r\n" +
			  " WHERE grnd.item_code IS NULL")
	// @formatter:on
	List<Object[]> getReturnableItems(@Param("salesTxnId") String salesTxnId);
	// TODO NOT REQUIRED

//	// @formatter:off
//	@Query(nativeQuery = true, value =  "\r\n" +     
//			  " SELECT fd.id, fd.row_id, fd.item_code, fd.lot_number, fd.total_quantity, fd.total_weight, fd.employee_code \r\n" + 
//			  " FROM (SELECT * FROM foc_details \r\n"+ 
//			  "		WHERE (sales_txn_id = :salesTxnId OR sales_txn_id = (SELECT id FROM sales_transaction WHERE ref_txn_id = :salesTxnId AND status = 'CONFIRMED')) AND status = :focStatus) fd \r\n" + 
//			  " LEFT JOIN \r\n" + 
//			  "	 	 (SELECT * FROM goods_return_details \r\n"+ 
//			  "		   	WHERE foc_details_id IS NULL AND \r\n"
//			  + "			goods_return_id IN (SELECT id FROM refund_transaction WHERE ref_sales_id = :salesTxnId AND status = 'CONFIRMED')) grnd \r\n" + 
//			  "		ON fd.item_code = grnd.item_code AND fd.lot_number = grnd.lot_number \r\n" +
//			  " WHERE grnd.item_code IS NULL")
//	// @formatter:on
//	List<Object[]> getReturnableFocItems(@Param("salesTxnId") String salesTxnId, @Param("focStatus") String focStatus);

//	// @formatter:off
//		@Query(nativeQuery = true, value =  "\r\n" +     
//				  " SELECT grnd.foc_details_id, SUM(grnd.total_quantity) FROM goods_return_details grnd, refund_transaction rt \r\n" + 
//				  " WHERE rt.ref_sales_id = :salesTxnId \r\n" + 
//				  "	AND grnd.goods_return_id = rt.id AND rt.status = 'CONFIRMED' AND grnd.foc_details_id IS NOT NULL \r\n" + 
//				  " GROUP BY grnd.foc_details_id \r\n")
//		// @formatter:on
//	List<Object[]> getFocReturnedItemWithQuantity(@Param("salesTxnId") String salesTxnId);

	// @formatter:off
	@Query(value = "SELECT new com.titan.poss.sales.dto.ReturnableItemsDto(grnd.cashMemoDetailsId,SUM(grnd.totalQuantity)) FROM com.titan.poss.sales.dao.GrnDetailsDaoExt grnd \r\n"+ 
			  "	WHERE grnd.cashMemoDetailsId IS NOT NULL AND \r\n" + 
			  " grnd.grn IN (SELECT cd FROM com.titan.poss.sales.dao.CancelDaoExt cd WHERE refSalesTxn.id = :salesTxnId AND status in ('CONFIRMED','PENDING')) GROUP BY grnd.cashMemoDetailsId ")
	// @formatter:on
	List<ReturnableItemsDto> getReturnedItems(@Param("salesTxnId") String salesTxnId);

	// @formatter:off
	@Query("SELECT COALESCE(SUM(grnDetails.totalQuantity),0) FROM GRNDetailsExt grnDetails,GRNExt grn,Cancel cancel "
			+ " WHERE grnDetails.grn.id=grn.id AND grn.id=cancel.id AND cancel.status='CONFIRMED' "
			+ " AND grnDetails.cashMemoDetailsId = :cashMemoDetailsId")
	// @formatter:on
	long getSumOfTotalQuantityByCashMemoDetails(@Param("cashMemoDetailsId") String cashMemoDetailsId);
	


	@Query("SELECT SUM(grnd.totalQuantity) FROM com.titan.poss.sales.dao.GrnDetailsDaoExt grnd  WHERE grnd.cashMemoDetailsId IS NOT NULL AND grnd.cashMemoDetailsId = :id")
	Short getReturnedQuantity(@Param("id") String id);
	
	List<GrnDetailsDaoExt> findByCashMemoDetailsId(String id);
	

	// @formatter:off
	@Query(value="SELECT grnd.grn.cancel FROM com.titan.poss.sales.dao.GrnDetailsDaoExt grnd  WHERE grnd.cashMemoDetailsId IS NOT NULL AND "
			+ " grnd.grn IN (SELECT cd FROM com.titan.poss.sales.dao.CancelDaoExt cd WHERE refSalesTxn.id = :salesTxnId AND status = 'PENDING') ")
	// @formatter:on
	List<CancelDaoExt> getPendingGrn(@Param("salesTxnId") String salesTxnId);
}
