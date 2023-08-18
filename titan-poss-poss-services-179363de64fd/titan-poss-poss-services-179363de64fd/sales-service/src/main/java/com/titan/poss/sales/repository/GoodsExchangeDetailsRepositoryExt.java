/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.GoodsExchangeDaoExt;
import com.titan.poss.sales.dao.GoodsExchangeDetailsDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("salesGoodsExchangeDetailsRepository")
public interface GoodsExchangeDetailsRepositoryExt extends JpaRepository<GoodsExchangeDetailsDaoExt, String> {

	List<GoodsExchangeDetailsDaoExt> findByGoodsExchange(GoodsExchangeDaoExt goodsExchange);

	GoodsExchangeDetailsDaoExt findByIdAndGoodsExchange(String id, GoodsExchangeDaoExt goodsExchangeDao);

	@Query("SELECT COALESCE(SUM(details.quantity),0) FROM GoodsExchangeDetailsDaoExt details WHERE details.cashMemoDetails.id = :cashMemoDetailsId AND details.goodsExchange.salesTxn.status='CONFIRMED'")
	long getSumOfTotalQuantityByCashMemoDetails(@Param("cashMemoDetailsId") String cashMemoDetailsId);

	@Query("SELECT COALESCE(COUNT(details),0) FROM GoodsExchangeDetailsDaoExt details WHERE details.goodsExchange = :goodsExchange")
	long getCountOfTotalQuantityByGoodsExchange(@Param("goodsExchange") GoodsExchangeDaoExt goodsExchange);

	// @formatter:off
	@Query("SELECT ged FROM GoodsExchangeDetailsDaoExt ged \r\n"
			+ " INNER JOIN com.titan.poss.sales.dao.CashMemoDetailsDaoExt cmd \r\n"
			+ " ON ged.cashMemoDetails.id = cmd.id \r\n"
			+ " WHERE cmd.cashMemoDao.salesTxnDao.id = :txnId \r\n"
			+ " AND ged.goodsExchange.salesTxn.status IN (:statusList)" )
	// @formatter:on
	List<GoodsExchangeDetailsDaoExt> findAllByCashMemoTxnIdAndStatusIn(@Param("txnId") String txnId,
			@Param("statusList") List<String> statusList);

}
