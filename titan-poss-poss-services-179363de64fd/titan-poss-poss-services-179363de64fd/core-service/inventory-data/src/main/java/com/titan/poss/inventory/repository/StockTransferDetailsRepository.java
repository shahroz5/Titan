/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
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
import com.titan.poss.inventory.dao.StockTransferDetailsDao;
import com.titan.poss.inventory.dto.constants.StockTransferTypeEnum;

/**
 * Handles repository operations for StnDetail
 * 
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface StockTransferDetailsRepository extends JpaRepository<StockTransferDetailsDao, String> {

	Optional<StockTransferDetailsDao> findByIdAndStockTransfer(String id, StockTransferDao stockTransfer);

	@Modifying
	@Query("UPDATE StockTransferDetailsDao s SET s.status = :status"
			+ " WHERE s.stockTransfer = :stockTransfer AND s.status = 'ISSUED'")
	public void verifyAllItems(@Param("status") String status, @Param("stockTransfer") StockTransferDao stockTransfer);

	@Modifying
	@Query("UPDATE StockTransferDetailsDao s SET s.binCode=:binCode"
			+ " WHERE s.stockTransfer = :stockTransfer AND s.binGroupCode = 'STN'")
	void updateAllStockTransferDetails(@Param("stockTransfer") StockTransferDao stockTransfer,
			@Param("binCode") String binCode);

	List<StockTransferDetailsDao> findByStockTransferAndStatus(StockTransferDao stockTransfer, String status);

	List<StockTransferDetailsDao> findByStockTransfer(StockTransferDao stockTransfer);
	
//	List<StockTransferDetailsDao> findByStockTransfer1(Optional<StockTransferDao> stockTransfer);

	@Modifying
	@Query("UPDATE StockTransferDetailsDao s SET s.status = :status WHERE"
			+ " s.id in (:itemId) AND s.stockTransfer = :stockTransfer AND s.status = 'ISSUED'")
	void verifyAllItemsByItemId(@Param("status") String status, @Param("stockTransfer") StockTransferDao stockTransfer,
			@Param("itemId") List<String> itemId);

	@Modifying
	@Query("UPDATE StockTransferDetailsDao s SET s.binCode = :binCode"
			+ " WHERE s.id in (:itemId) AND s.stockTransfer = :stockTransfer AND s.binGroupCode = 'STN' ")
	void updateAllStockTransferDetailsByItemId(@Param("stockTransfer") StockTransferDao stockTransfer,
			@Param("itemId") List<String> itemId, @Param("binCode") String binCode);

	@Query(nativeQuery = true, value = "(SELECT * " + "FROM "
			+ "(SELECT inv_details.inventoryId,trans_details.id,COALESCE(trans_details.status, 'OPEN') status,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,trans_details.requestedQuantity,inv_details.productCategory,inv_details.productGroup,inv_details.binCode,"
			+ "inv_details.binGroupCode,inv_details.itemValue,inv_details.itemWeight,inv_details.currencyCode,inv_details.weightUnit,inv_details.mfgDate,"
			+ "trans_details.requestedWeight as requestedWeight,inv_details.totalWeight as totalWeight,trans_details.measuredValue,inv_details.totalValue,"
			+ "inv_details.issuedQuantity,inv_details.docType,inv_details.docNumber,inv_details.fiscalYear,inv_details.stockInwardDate,inv_details.itemDetails,"
			+ "inv_details.karat FROM "
			+ "(SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ "product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,"
			+ "currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,total_value as totalValue,"
			+ " issued_quantity as issuedQuantity,doc_type as docType,doc_number as docNumber,fiscal_year as fiscalYear,stock_inward_date as stockInwardDate,"
			+ "item_details as itemDetails,karat as karat FROM inventory_details "
			+ "WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ "(product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "(stock_inward_date < :businessDate) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND total_quantity - issued_quantity > 0) "

			+ " as inv_details "

			+ "LEFT JOIN"

			+ "   (SELECT  id as id, inventory_id as inventoryId,issued_quantity as requestedQuantity,status,item_code,lot_number,issued_weight as requestedWeight,issued_weight as totalWeight,issued_value as measuredValue "
			+ "FROM stock_transfer_details"
			+ " WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ "(product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ " stock_transfer_id = :stockTransferId ) as trans_details"
			+ "	ON trans_details.inventoryId = inv_details.inventoryId) as result "
			+ "WHERE (status= :status OR :status IS NULL) AND " + "(itemCode= :itemCode OR :itemCode IS NULL) AND  "
			+ "(lotNumber= :lotNumber OR :lotNumber IS NULL )) " 
			+ "ORDER BY CASE WHEN  :parameter = 'availableQuantity ASC'  THEN totalQuantity END ASC, "
			+ "CASE WHEN  :parameter = 'availableQuantity DESC'  THEN totalQuantity END DESC,  "
			+ "CASE WHEN  :parameter = 'availableWeight ASC' THEN totalWeight END ASC,  "
			+ "CASE WHEN  :parameter = 'availableWeight DESC' THEN totalWeight END DESC, "
			+ "CASE WHEN  :parameter = 'inwardDate ASC' THEN stockInwardDate END ASC,  "
			+ "CASE WHEN  :parameter = 'inwardDate DESC' THEN stockInwardDate END DESC, "
			+ "CASE WHEN  :parameter = 'NULL' THEN stockInwardDate END OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY")
	List<Object[]> getJointList(@Param("stockTransferId") Integer stockTransferId,
			@Param("binGroupCode") List<String> binGroupCode, @Param("productGroup") List<String> productGroup,
			@Param("status") String status, @Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroupList") List<String> productGroupList, @Param("binCodeList") List<String> binCodeList,
			@Param("businessDate") Date businessDate, @Param("parameter") String parameter, @Param("offset") int offset,
			@Param("size") int size);

	@Query(nativeQuery = true, value = "(SELECT COUNT(*) "
			+ "FROM (SELECT inv_details.inventoryId,trans_details.id,COALESCE(trans_details.status, 'OPEN') status,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,trans_details.requestedQuantity,inv_details.productCategory,inv_details.productGroup,inv_details.binCode,"
			+ "inv_details.binGroupCode,inv_details.itemValue,inv_details.itemWeight,inv_details.currencyCode,inv_details.weightUnit,"
			+ "inv_details.mfgDate,trans_details.requestedWeight as requestedWeight,inv_details.totalWeight as totalWeight,inv_details.issuedQuantity  "

			+ "FROM (SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ "product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,currency_code as currencyCode,"
			+ "weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,issued_quantity as issuedQuantity "
			+ "FROM inventory_details "
			+ "WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ "(product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "(stock_inward_date < :businessDate) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND total_quantity-issued_quantity >0) "

			+ "as inv_details "

			+ "LEFT JOIN  "

			+ "(SELECT  id as id, inventory_id as inventoryId,issued_quantity as requestedQuantity,status,item_code,lot_number,issued_weight as requestedWeight,"
			+ "issued_weight as totalWeight,issued_value as measuredValue  " + "FROM stock_transfer_details "
			+ "WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ "(product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND"
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ " stock_transfer_id = :stockTransferId ) " + "as trans_details  "
			+ "ON trans_details.inventoryId = inv_details.inventoryId)" + " as result "
			+ "WHERE (status= :status OR :status IS NULL) AND " + "(itemCode= :itemCode OR :itemCode IS NULL ) AND "
			+ "(lotNumber= :lotNumber OR :lotNumber IS NULL ))")
	int getPageSize(@Param("stockTransferId") Integer stockTransferId, @Param("binGroupCode") List<String> binGroupCode,
			@Param("productGroup") List<String> productGroup, @Param("status") String status,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroupList") List<String> productGroupList, @Param("binCodeList") List<String> binCodeList,
			@Param("businessDate") Date businessDate);

	// Get Data for Defective transfer type
	
	@Query(nativeQuery = true, value = "(SELECT * " + "FROM "
			+ "(SELECT inv_details.inventoryId,trans_details.id,COALESCE(trans_details.status, 'OPEN') status,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,trans_details.requestedQuantity,inv_details.productCategory,inv_details.productGroup,inv_details.binCode,"
			+ "inv_details.binGroupCode,inv_details.itemValue,inv_details.itemWeight,inv_details.currencyCode,inv_details.weightUnit,inv_details.mfgDate,"
			+ "trans_details.requestedWeight as requestedWeight,inv_details.totalWeight as totalWeight,trans_details.measuredValue,inv_details.totalValue,"
			+ "inv_details.issuedQuantity,inv_details.docType,inv_details.docNumber,inv_details.fiscalYear,inv_details.stockInwardDate,inv_details.itemDetails,"
			+ "inv_details.karat FROM "
			+ "(SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ "product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,"
			+ "currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,total_value as totalValue,"
			+ " issued_quantity as issuedQuantity,doc_type as docType,doc_number as docNumber,fiscal_year as fiscalYear,stock_inward_date as stockInwardDate,"
			+ "item_details as itemDetails,karat as karat FROM inventory_details "
			+ "WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ "(product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "(stock_inward_date <= :businessDate OR stock_inward_date IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND total_quantity - issued_quantity > 0) "

			+ " as inv_details "

			+ "FULL OUTER JOIN"

			+ "   (SELECT  id as id, inventory_id as inventoryId,issued_quantity as requestedQuantity,status,item_code,lot_number,issued_weight as requestedWeight,issued_weight as totalWeight,issued_value as measuredValue "
			+ "FROM stock_transfer_details"
			+ " WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ "(product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ " stock_transfer_id = :stockTransferId ) as trans_details"
			+ "	ON trans_details.inventoryId = inv_details.inventoryId) as result "
			+ "WHERE (status= :status OR :status IS NULL) AND " + "(itemCode= :itemCode OR :itemCode IS NULL) AND  "
			+ "(lotNumber= :lotNumber OR :lotNumber IS NULL )) " 
			+ "ORDER BY CASE WHEN  :parameter = 'availableQuantity ASC'  THEN totalQuantity END ASC, "
			+ "CASE WHEN  :parameter = 'availableQuantity DESC'  THEN totalQuantity END DESC,  "
			+ "CASE WHEN  :parameter = 'availableWeight ASC' THEN totalWeight END ASC,  "
			+ "CASE WHEN  :parameter = 'availableWeight DESC' THEN totalWeight END DESC, "
			+ "CASE WHEN  :parameter = 'inwardDate ASC' THEN stockInwardDate END ASC,  "
			+ "CASE WHEN  :parameter = 'inwardDate DESC' THEN stockInwardDate END DESC, "
			+ "CASE WHEN  :parameter = 'NULL' THEN stockInwardDate END OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY")
	List<Object[]> getJointListForDefective(@Param("stockTransferId") Integer stockTransferId,
			@Param("binGroupCode") List<String> binGroupCode, @Param("productGroup") List<String> productGroup,
			@Param("status") String status, @Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroupList") List<String> productGroupList, @Param("binCodeList") List<String> binCodeList,
			@Param("businessDate") Date businessDate, @Param("parameter") String parameter, @Param("offset") int offset,
			@Param("size") int size);

	@Query(nativeQuery = true, value = "(SELECT COUNT(*) "
			+ "FROM (SELECT inv_details.inventoryId,trans_details.id,COALESCE(trans_details.status, 'OPEN') status,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,trans_details.requestedQuantity,inv_details.productCategory,inv_details.productGroup,inv_details.binCode,"
			+ "inv_details.binGroupCode,inv_details.itemValue,inv_details.itemWeight,inv_details.currencyCode,inv_details.weightUnit,"
			+ "inv_details.mfgDate,trans_details.requestedWeight as requestedWeight,inv_details.totalWeight as totalWeight,inv_details.issuedQuantity  "

			+ "FROM (SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ "product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,currency_code as currencyCode,"
			+ "weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,issued_quantity as issuedQuantity "
			+ "FROM inventory_details "
			+ "WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ "(product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "(stock_inward_date < =:businessDate OR stock_inward_date is NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND total_quantity-issued_quantity >0) "

			+ "as inv_details "

			+ "LEFT JOIN  "

			+ "(SELECT  id as id, inventory_id as inventoryId,issued_quantity as requestedQuantity,status,item_code,lot_number,issued_weight as requestedWeight,"
			+ "issued_weight as totalWeight,issued_value as measuredValue  " + "FROM stock_transfer_details "
			+ "WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ "(product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND"
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ " stock_transfer_id = :stockTransferId ) " + "as trans_details  "
			+ "ON trans_details.inventoryId = inv_details.inventoryId)" + " as result "
			+ "WHERE (status= :status OR :status IS NULL) AND " + "(itemCode= :itemCode OR :itemCode IS NULL ) AND "
			+ "(lotNumber= :lotNumber OR :lotNumber IS NULL ))")
	int getPageSizeForDefective(@Param("stockTransferId") Integer stockTransferId, @Param("binGroupCode") List<String> binGroupCode,
			@Param("productGroup") List<String> productGroup, @Param("status") String status,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroupList") List<String> productGroupList, @Param("binCodeList") List<String> binCodeList,
			@Param("businessDate") Date businessDate);
	
	@Query("SELECT COUNT(s) FROM StockTransferDetailsDao s where s.status = 'ISSUED' and s.stockTransfer = :stockTransfer")
	Integer getOpenItemCount(@Param("stockTransfer") StockTransferDao stockTransfer);

	@Modifying
	@Query("UPDATE StockTransferDetailsDao s SET s.status = :status WHERE s.stockTransfer = :stockTransfer and  s.status='SELECTED' ")
	Integer changeItemStatus(@Param("status") String status, @Param("stockTransfer") StockTransferDao stockTransfer);

	@Modifying
	@Query("UPDATE StockTransferDetailsDao s SET s.status = :status WHERE s.stockTransfer = :stockTransfer")
	void updateAllStockIssueDetailsByItemIds(@Param("stockTransfer") StockTransferDao stockTransfer,
			@Param("status") String status);

	@Query("SELECT COUNT(s) FROM StockTransferDetailsDao s where s.binCode = 'UNASSIGNED' and s.stockTransfer = :stockTransfer")
	Integer getUnassignedBinCount(@Param("stockTransfer") StockTransferDao stockTransfer);

	@Query("select stockTransferDetails from StockTransferDetailsDao stockTransferDetails where stockTransferDetails.id IN (:itemIds)")
	List<StockTransferDetailsDao> findAllTransferDetailsByItemIds(@Param("itemIds") List<String> itemIds);

	@Query("SELECT sd FROM StockTransferDetailsDao sd WHERE (sd.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL)"
			+ " AND (sd.itemCode = :itemCode OR :itemCode IS NULL)  AND (sd.productCategory in (:productCategory) OR "
			+ " nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (sd.productGroup in (:productGroup) OR "
			+ " nullif(CHOOSE(1,:productGroup),'') IS NULL) AND (sd.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) "
			+ " AND (sd.lotNumber = :lotNumber OR :lotNumber IS NULL) AND (sd.status= :status OR :status IS NULL) "
			+ " AND sd.stockTransfer= :stockTransfer")
	Page<StockTransferDetailsDao> listStockReceiveItems(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("status") String status,
			@Param("stockTransfer") StockTransferDao stockTransfer, Pageable pageable);

	@Query("SELECT SUM(sd.receivedWeight) FROM StockTransferDetailsDao sd WHERE (sd.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL)"
			+ " AND (sd.itemCode = :itemCode OR :itemCode IS NULL)  AND (sd.productCategory in (:productCategory) OR "
			+ " nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (sd.productGroup in (:productGroup) OR "
			+ " nullif(CHOOSE(1,:productGroup),'') IS NULL) AND (sd.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) "
			+ " AND (sd.lotNumber = :lotNumber OR :lotNumber IS NULL) AND (sd.status= :status OR :status IS NULL) "
			+ " AND sd.stockTransfer= :stockTransfer")
	BigDecimal listStockReceiveItemsReceivedWeight(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("status") String status,
			@Param("stockTransfer") StockTransferDao stockTransfer);

	// this method is responsible for history only
	@Query("SELECT sd FROM StockTransferDetailsDao sd WHERE  (sd.binCode IN (:binCodes) OR  nullif(CHOOSE(1,:binCodes),'') IS NULL)"
			+ " AND (sd.itemCode = :itemCode OR :itemCode IS NULL)  AND (sd.productCategory in (:productCategories) OR "
			+ " nullif(CHOOSE(1,:productCategories),'') IS NULL) AND (sd.productGroup in (:productGroups) OR "
			+ " nullif(CHOOSE(1,:productGroups),'') IS NULL) AND (sd.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) "
			+ " AND (sd.lotNumber = :lotNumber OR :lotNumber IS NULL) AND sd.stockTransfer= :stockTransfer ")
	Page<StockTransferDetailsDao> listStockTransferItemHistory(@Param("binCodes") List<String> binCodes,
			@Param("itemCode") String itemCode, @Param("productCategories") List<String> productCategories,
			@Param("productGroups") List<String> productGroups, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("stockTransfer") StockTransferDao stockTransfer,
			Pageable pageable);

	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_transfer_details SET status= :transferStatus WHERE stock_transfer_id IN "
			+ " ( SELECT id FROM stock_transfer WHERE last_modified_date<=DATEADD(day,- :days,getdate()) AND status = 'OPEN' AND transfer_type IN (:transferTypes) ) "
			+ " AND status = ('SELECTED')")
	void closeWithoutApprovalRequestsDetails(@Param("days") Integer days,
			@Param("transferTypes") List<StockTransferTypeEnum> transferTypes,
			@Param("transferStatus") String transferStatus);

	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_transfer_details SET status= :newStatus,received_quantity = issued_quantity, "
			+ " received_weight = issued_weight,received_value = issued_value,last_modified_by = :modifiedBy , "
			+ " last_modified_date = :modifiedDate , bin_group_code = :binGroupCode, bin_code = :binCode WHERE status = :currentStatus ")
	void updateStockTransferDetailsStatus(@Param("currentStatus") String currentStatus,
			@Param("newStatus") String newStatus, @Param("modifiedBy") String modifiedBy,
			@Param("modifiedDate") Date modifiedDate, @Param("binGroupCode") String binGroupCode,
			@Param("binCode") String binCode);

	List<StockTransferDetailsDao> findByStockTransferAndProductGroup(StockTransferDao stockTransfer,
			String productGroup);
	
	@Query(nativeQuery = true, value = "(SELECT * " + " FROM "
			+ " (SELECT inv_details.inventoryId,trans_details.id,inv_details.itemCode,inv_details.lotNumber,"
			+ " inv_details.totalQuantity,trans_details.requestedQuantity, trans_details.requestedWeight as requestedWeight, "
			+ " trans_details.finalValue as finalValue, trans_details.status as status, "
			+ " inv_details.totalWeight as totalWeight,inv_details.totalValue"
			+ " FROM "
			+ " (SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ " product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,"
			+ " currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,total_value as totalValue,"
			+ " issued_quantity as issuedQuantity,doc_type as docType,doc_number as docNumber,fiscal_year as fiscalYear,stock_inward_date as stockInwardDate,"
			+ " item_details as itemDetails,karat as karat FROM inventory_details "
			+ " WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ " (product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ " (location_code= :locationCode OR :locationCode IS NULL) AND "
			+ " (stock_inward_date <= :businessDate) AND "
			+ " (total_quantity - issued_quantity > 0 ) )"
			+ " as inv_details FULL OUTER JOIN "
			+ " (SELECT  id as id, inventory_id as inventoryId,issued_quantity as requestedQuantity,status,item_code,lot_number,issued_weight as requestedWeight,"
			+ " issued_weight as totalWeight,issued_value as measuredValue, final_value as finalValue "
			+ " FROM stock_transfer_details"
			+ " WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ " (product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ " stock_transfer_id = :stockTransferId ) as trans_details"
			+ "	ON trans_details.inventoryId = inv_details.inventoryId) as result "
			+ " WHERE (status= :status OR :status IS NULL) "
			+ ") ")
	List<Object[]> getJointListForDefetiveHeader(@Param("stockTransferId") Integer stockTransferId,
			@Param("binGroupCode") List<String> binGroupCode, @Param("productGroup") List<String> productGroup,
			@Param("status") String status,
			@Param("locationCode") String locationCode,
			@Param("businessDate") Date businessDate);
	
	@Query(nativeQuery = true, value = "(SELECT * " + " FROM "
			+ " (SELECT inv_details.inventoryId,trans_details.id,inv_details.itemCode,inv_details.lotNumber,"
			+ " inv_details.totalQuantity,trans_details.requestedQuantity, trans_details.requestedWeight as requestedWeight, "
			+ " trans_details.finalValue as finalValue, trans_details.status as status, "
			+ " inv_details.totalWeight as totalWeight,inv_details.totalValue"
			+ " FROM "
			+ " (SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ " product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,"
			+ " currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,total_value as totalValue,"
			+ " issued_quantity as issuedQuantity,doc_type as docType,doc_number as docNumber,fiscal_year as fiscalYear,stock_inward_date as stockInwardDate,"
			+ " item_details as itemDetails,karat as karat FROM inventory_details "
			+ " WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ " (product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ " (location_code= :locationCode OR :locationCode IS NULL) AND "
			+ " (stock_inward_date < :businessDate) AND "
			+ " (total_quantity - issued_quantity > 0 ) )"
			+ " as inv_details FULL OUTER JOIN "
			+ " (SELECT  id as id, inventory_id as inventoryId,issued_quantity as requestedQuantity,status,item_code,lot_number,issued_weight as requestedWeight,"
			+ " issued_weight as totalWeight,issued_value as measuredValue, final_value as finalValue "
			+ " FROM stock_transfer_details"
			+ " WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ " (product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ " stock_transfer_id = :stockTransferId ) as trans_details"
			+ "	ON trans_details.inventoryId = inv_details.inventoryId) as result "
			+ " WHERE (status= :status OR :status IS NULL) "
			+ ") ")
	List<Object[]> getJointListForHeader(@Param("stockTransferId") Integer stockTransferId,
			@Param("binGroupCode") List<String> binGroupCode, @Param("productGroup") List<String> productGroup,
			@Param("status") String status,
			@Param("locationCode") String locationCode,
			@Param("businessDate") Date businessDate);
	
	@Query(nativeQuery = true, value = "(SELECT * " + " FROM "
			+ " (SELECT inv_details.inventoryId,trans_details.id,inv_details.itemCode,inv_details.lotNumber,"
			+ " inv_details.totalQuantity,trans_details.requestedQuantity, trans_details.requestedWeight as requestedWeight, "
			+ " trans_details.finalValue as finalValue, "
			+ " inv_details.binCode, inv_details.binGroupCode,"
			+ " inv_details.totalWeight as totalWeight,trans_details.issuedValue,trans_details.status as status,inv_details.totalValue"
			+ " FROM "
			+ " (SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ " product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,"
			+ " currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,total_value as totalValue,"
			+ " issued_quantity as issuedQuantity,doc_type as docType,doc_number as docNumber,fiscal_year as fiscalYear,stock_inward_date as stockInwardDate,"
			+ " item_details as itemDetails,karat as karat FROM inventory_details "
			+ " WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ " (product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ " (location_code= :locationCode OR :locationCode IS NULL) AND "
			+ " (stock_inward_date is null OR stock_inward_date <= :businessDate) AND "
			+ " (total_quantity - issued_quantity > 0 ) )"
			+ " as inv_details FULL OUTER JOIN "
			+ " (SELECT  id as id, issued_quantity as requestedQuantity,status,item_code,lot_number,issued_weight as requestedWeight,"
			+ " inventory_id as inventoryId, issued_value as issuedValue, final_value as finalValue "
			+ " FROM stock_transfer_details"
			+ " WHERE (bin_group_code in (:binGroupCode) OR nullif(CHOOSE(1,:binGroupCode),'') IS NULL) AND "
			+ " (product_group in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) AND "
			+ " stock_transfer_id = :stockTransferId ) as trans_details"
			+ "	ON trans_details.inventoryId = inv_details.inventoryId) as result "
			+ " WHERE (status= :status OR :status IS NULL) "
			+ ") ")
	List<Object[]> getJointListForBtqHeader(@Param("stockTransferId") Integer stockTransferId,
			@Param("productGroup") List<String> productGroup,
			@Param("status") String status,
			@Param("locationCode") String locationCode, @Param("binGroupCode") List<String> binGroupCode,
			@Param("businessDate") Date businessDate);

}
