/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.repository;

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
import com.titan.poss.inventory.dao.StockTransactionDetailsDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Repository("InvStockTransactionDetailsRepo")
public interface StockTransactionDetailsRepository extends JpaRepository<StockTransactionDetailsDao, String> {

	Optional<StockTransactionDetailsDao> findByIdAndStockTransaction(String id, StockTransactionDao stockTransaction);

	@Modifying
	@Query("UPDATE com.titan.poss.inventory.dao.StockTransactionDetailsDao s SET s.status = :status WHERE"
			+ " s.id in (:itemId) AND s.stockTransaction = :stockTransaction AND s.status = 'ISSUED'")
	void verifyAllItemsByItemId(@Param("status") String status,
			@Param("stockTransaction") StockTransactionDao stockTransaction, @Param("itemId") List<String> itemId);

	@Modifying
	@Query("UPDATE com.titan.poss.inventory.dao.StockTransactionDetailsDao s SET s.binCode = :binCode"
			+ " WHERE s.id in (:itemId) AND s.stockTransaction = :stockTransaction AND s.binGroupCode = :binGroupCode ")
	void updateAllStockTransactionDetailsByItemId(@Param("stockTransaction") StockTransactionDao stockTransaction,
			@Param("itemId") List<String> itemId, @Param("binCode") String binCode,
			@Param("binGroupCode") String binGroupCode);

	@Modifying
	@Query("UPDATE com.titan.poss.inventory.dao.StockTransactionDetailsDao s SET s.binCode=:binCode"
			+ " WHERE s.stockTransaction = :stockTransaction AND s.binGroupCode = :binGroupCode ")
	void updateAllStockTransactionDetails(@Param("stockTransaction") StockTransactionDao stockTransaction,
			@Param("binCode") String binCode, @Param("binGroupCode") String binGroupCode);

	@Modifying
	@Query("UPDATE com.titan.poss.inventory.dao.StockTransactionDetailsDao s SET s.status = :status"
			+ " WHERE s.stockTransaction = :stockTransaction AND s.status = 'ISSUED'")
	void verifyAllItems(@Param("status") String status,
			@Param("stockTransaction") StockTransactionDao stockTransaction);

	List<StockTransactionDetailsDao> findByStockTransaction(StockTransactionDao stockTransaction);

	List<StockTransactionDetailsDao> findByStockTransactionAndStatus(StockTransactionDao stockTransaction,
			String status);

	@Query("SELECT COUNT(s) FROM com.titan.poss.inventory.dao.StockTransactionDetailsDao s where s.status = 'ISSUED' and s.stockTransaction = :stockTransaction")
	Integer getOpenItemCount(@Param("stockTransaction") StockTransactionDao stockTransaction);

	@Query("SELECT COUNT(s) FROM com.titan.poss.inventory.dao.StockTransactionDetailsDao s where s.binCode = 'UNASSIGNED' and s.stockTransaction = :stockTransaction")
	Integer getUnassignedBinCount(@Param("stockTransaction") StockTransactionDao stockTransaction);

	@Modifying
	@Query("UPDATE com.titan.poss.inventory.dao.StockTransactionDetailsDao s SET s.status = :status WHERE s.stockTransaction = :stockTransaction")
	void updateAllStockTransactionItemDetails(@Param("stockTransaction") StockTransactionDao stockTransaction,
			@Param("status") String status);

	@Query("SELECT sd FROM com.titan.poss.inventory.dao.StockTransactionDetailsDao sd WHERE (sd.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL)"
			+ " AND (sd.itemCode = :itemCode OR :itemCode IS NULL)  AND (sd.productCategory in (:productCategory) OR "
			+ " nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (sd.productGroup in (:productGroup) OR "
			+ " nullif(CHOOSE(1,:productGroup),'') IS NULL) AND (sd.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) "
			+ " AND (sd.lotNumber = :lotNumber OR :lotNumber IS NULL) AND (sd.status= :status OR :status IS NULL) "
			+ " AND sd.stockTransaction= :stockTransaction")
	Page<StockTransactionDetailsDao> listOtherReceiveItems(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("status") String status,
			@Param("stockTransaction") StockTransactionDao stockTransaction, Pageable pageable);

	// Queries related to history
	@Query("SELECT sd FROM com.titan.poss.inventory.dao.StockTransactionDetailsDao sd WHERE (sd.binCode IN (:binCodes) OR  nullif(CHOOSE(1,:binCodes),'') IS NULL)"
			+ " AND (sd.itemCode = :itemCode OR :itemCode IS NULL)  AND (sd.productCategory in (:productCategories) OR "
			+ " nullif(CHOOSE(1,:productCategories),'') IS NULL) AND (sd.productGroup in (:productGroups) OR "
			+ " nullif(CHOOSE(1,:productGroups),'') IS NULL) AND (sd.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) "
			+ " AND (sd.lotNumber = :lotNumber OR :lotNumber IS NULL) AND sd.stockTransaction= :stockTransaction")
	Page<StockTransactionDetailsDao> listStockTransactionItemHistory(@Param("binCodes") List<String> binCodes,
			@Param("itemCode") String itemCode, @Param("productCategories") List<String> productCategories,
			@Param("productGroups") List<String> productGroups, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("stockTransaction") StockTransactionDao stockTransaction,
			Pageable pageable);

}
