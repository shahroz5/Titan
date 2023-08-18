/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.sales.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.titan.poss.sales.dao.CashMemoDetailsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("engineCashMemoDetailsRepository")
public interface CashMemoDetailsRepositoryExt extends JpaRepository<CashMemoDetailsDao, String> {

	/**
	 * @param cashMemoId
	 * @return
	 */
	@Query("SELECT cm FROM CashMemoDetailsDao cm WHERE cm.cashMemoDao.id = :cashMemoId AND cm.productGroupCode = :productGroupCode")
	List<CashMemoDetailsDao> findByCashMemoIdAndProductGroupCode(@Param("cashMemoId") String cashMemoId,
			@Param("productGroupCode") String productGroupCode);

	/**
	 * @param cashMemoId
	 * @return
	 */
	@Query("SELECT cm FROM CashMemoDetailsDao cm WHERE cm.cashMemoDao.id = :cashMemoId")
	List<CashMemoDetailsDao> findByCashMemoId(@Param("cashMemoId") String cashMemoId);
	
	CashMemoDetailsDao findOneById(@Param("id") String id);
	
	// @formatter:off
	@Query(nativeQuery = true, value = "select cmd.item_code,cmd.lot_number,cmd.product_category_code,cmd.total_quantity as qty,cmd.total_weight as wt,st.location_code as BTQ,st.doc_no, \r\n"
			+ "st.doc_date,COALESCE (JSON_VALUE(cmd.price_details ,'$.metalPriceDetails.preDiscountValue'),'0') as preDiscountTotalValue, \r\n"
			+ "im.pricing_group_type as product_type,COALESCE (JSON_VALUE(cmd.price_details ,'$.stonePriceDetails.preDiscountValue'),'0') as stone_value, \r\n"
			+ "im.karat as Karatage,ct.mobile_number as Mobileno, \r\n"
			+ "COALESCE (JSON_VALUE(cmd.price_details ,'$.stonePriceDetails.numberOfStones'),'0') as TotalStones, \r\n"
			+ "im.product_group_code as cfa_product_code,im.hsn_sac_code as HSN_Code,st.fiscal_year\r\n"
			+ "FROM cash_memo_details cmd \r\n"
			+ "INNER JOIN sales_transaction st on st.id=cmd.cash_memo_id \r\n"
			+ "INNER JOIN customer_transaction ct on ct.id=cmd.cash_memo_id \r\n"
			+ "INNER JOIN products.dbo.item_master im on im.item_code=cmd.item_code \r\n"
			+ "WHERE (:productCategory IS NULL OR cmd.product_category_code = :productCategory)\r\n"
			+ "AND (:fromDate IS NULL OR st.doc_date >= CAST(:fromDate as date))\r\n"
			+ "AND (:toDate IS NULL OR st.doc_date <= CAST(:toDate as date)) \r\n"
			+ "AND (:ProductType IS NULL OR im.product_group_code = :ProductType)\r\n"
			+ "AND (:mobileNumber IS NULL OR ct.mobile_number = :mobileNumber)" )
	// @formatter:on
	List<Object[]>  getCashMemohistory(@Param("mobileNumber") String mobileNumber,@Param("ProductType") String ProductType,@Param("productCategory") String productCategory,
			@Param("fromDate") Date fromDate,@Param("toDate") Date toDate);

}
