/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dto.response.GRNItemDetailsDto;

/**
 * Handles repository operations for <b>cash_memo_details</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesCashMemoDetailsRepositoryExt")
public interface CashMemoDetailsRepositoryExt extends JpaRepository<CashMemoDetailsDaoExt, String> {

	List<CashMemoDetailsDaoExt> findByCashMemoDaoId(String cashMemoId);

	List<CashMemoDetailsDaoExt> findByCashMemoDaoIdIn(List<String> cashMemoIds);

	List<CashMemoDetailsDaoExt> findByIdIn(List<String> itemIds);

	CashMemoDetailsDaoExt findOneByIdAndCashMemoDaoId(String itemId, String cashMemoId);

	List<CashMemoDetailsDaoExt> findByIdIn(Collection<String> fieldIds);

	Integer countByCashMemoDaoId(@Param("cashMemoId") String cashMemoId);

	// @formatter:off
	@Query(" SELECT cmd FROM com.titan.poss.sales.dao.CashMemoDetailsDaoExt cmd \r\n"
			+ " WHERE (:id IS NULL OR cmd.id != :id) \r\n"
			+ " AND cmd.cashMemoDao.salesTxnDao.docDate = :currentDate \r\n"
			+ " AND cmd.itemCode = :itemCode \r\n"
			+ " AND (cmd.inventoryId = :inventoryId) \r\n"
			+ " AND ((cmd.cashMemoDao.salesTxnDao.status IN (:statusList)) OR (cmd.cashMemoDao.id = :cashMemoId)) \r\n"
			+ " AND cmd.cashMemoDao.salesTxnDao.locationCode = :locationCode")
	// @formatter:on
	List<CashMemoDetailsDaoExt> listByIdNotInAndItemCodeAndDocDateAndInventoryIdAndStatusandLocationCode(
			@Param("id") String id, @Param("currentDate") Date currentDate, @Param("itemCode") String itemCode,
			@Param("inventoryId") String inventoryId, @Param("statusList") List<String> statusList,
			@Param("locationCode") String locationCode, @Param("cashMemoId") String cashMemoId);

	boolean existsByItemCodeAndCashMemoDaoIdAndCashMemoDaoSalesTxnDaoLocationCodeAndInventoryWeight(
			@Param("itemCode") String itemCode, @Param("cashMemoId") String cashMemoId,
			@Param("locationCode") String locationCode, @Param("inventoryWeight") BigDecimal inventoryWeight);

	// @formatter:off
	@Query(" SELECT new com.titan.poss.sales.dto.response.GRNItemDetailsDto(cmd.id, cmd.rowId, cmd.itemCode, cmd.lotNumber, cmd.productGroupCode, cmd.productCategoryCode, cmd.inventoryWeight, \r\n"
			+ "		cmd.totalWeight, cmd.totalQuantity, cmd.employeeCode, cmd.unitValue, cmd.totalValue, cmd.finalValue, cmd.totalTax, cmd.totalDiscount, cmd.priceDetails, taxDetails, cmd.binCode, \r\n"
			+ "     cmd.hallmarkCharges, cmd.hallmarkDiscount) \r\n"
			+ " FROM com.titan.poss.sales.dao.CashMemoDetailsDaoExt cmd \r\n"
			+ " WHERE cmd.id IN (SELECT gd.cashMemoDetailsId FROM com.titan.poss.sales.dao.GrnDetailsDaoExt gd "
			+ "						WHERE gd.grn.id = :cancelId AND gd.cashMemoDetailsId IS NOT NULL)")
	// @formatter:on
	List<GRNItemDetailsDto> listCashMemoItemsByCancelId(@Param("cancelId") String cancelId);

	@Query("SELECT cmd FROM com.titan.poss.sales.dao.CashMemoDetailsDaoExt cmd "
			+ "WHERE cmd.cashMemoDao.id = :cashMemoId AND (cmd.id IN (:itemIdList) OR nullif(CHOOSE(1, :itemIdList), '') IS NULL)")
	List<CashMemoDetailsDaoExt> listItemDetailsByCashMemoIdAndItemIds(@Param("cashMemoId") String cashMemoId,
			@Param("itemIdList") List<String> itemIdList);

	/**
	 * @param cashMemoId
	 * @param object
	 * @return
	 */
	List<CashMemoDetailsDaoExt> findAllByCashMemoDaoIdAndIdIn(String cashMemoId, List<String> itemIds);

	/**
	 * @param txnId
	 * @param itemCode
	 * @return
	 */
	CashMemoDetailsDaoExt findByCashMemoDaoIdAndItemCode(String txnId, String itemCode);

	/**
	 * @param refTxnId
	 * @param locationCode
	 * @return
	 */
//	CashMemoResponseDto findByIdAndSalesTxnDaoLocationCode(SalesTxnDaoExt refTxnId, String locationCode);

	@Query("SELECT cmd " + " FROM com.titan.poss.sales.dao.CashMemoDetailsDaoExt cmd " + " WHERE "
			+ " cmd.cashMemoDao.salesTxnDao.locationCode = :locationCode")
	List<CashMemoDetailsDaoExt> findAllByLocationCode(@Param("locationCode") String locationCode);

	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT * FROM cash_memo_details cmd "
			+ " WHERE cmd.cash_memo_id = :cashMemoId "
			+ " AND (cmd.total_discount IS NULL OR cmd.total_discount = 0) "
			+ " AND (NULLIF(CHOOSE(1, :itemIdsNotIn), '') IS NULL OR cmd.id NOT IN (:itemIdsNotIn)) "
			+ " AND (NULLIF(CHOOSE(1, :itemIdsIn), '') IS NULL OR cmd.id IN (:itemIdsIn)) "
			+ " AND (:productGroupCode IS NULL OR cmd.product_group_code = :productGroupCode)")
	// @formatter:on
	List<CashMemoDetailsDaoExt> findAllByCmIdAndTotalDiscountEqualsZeroAndIdNotIn(
			@Param("cashMemoId") String cashMemoId, @Param("itemIdsNotIn") List<String> itemIdsNotIn,
			@Param("productGroupCode") String productGroupCode, @Param("itemIdsIn") List<String> itemIdsIn);

	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT * FROM cash_memo_details cmd "
			+ " WHERE cmd.cash_memo_id = :cashMemoId "
			+ " AND (cmd.total_discount IS NULL OR cmd.total_discount = 0) "
			+ " AND (NULLIF(CHOOSE(1, :orderItemIdsIn), '') IS NULL OR cmd.order_item_id IN (:orderItemIdsIn)) "
			+ " AND (:productGroupCode IS NULL OR cmd.product_group_code = :productGroupCode)")
	// @formatter:on
	List<CashMemoDetailsDaoExt> findAllByCmIdAndTotalDiscountEqualsZeroAndOrderItemIdIn(
			@Param("cashMemoId") String cashMemoId, @Param("productGroupCode") String productGroupCode,
			@Param("orderItemIdsIn") Set<String> orderItemIdsIn);
	
	
	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT product_group_code from cash_memo_details "
			+"where cash_memo_id = :cashMemoId ")
	List<String> findProductGroups(@Param("cashMemoId") String cashMemoId);
	

}
