/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.StockInvoiceDao;
import com.titan.poss.inventory.dao.StockInvoiceDetailsDao;

/**
 * Handles repository operations for InvoiceDetail
 * 
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface StockInvoiceDetailsRepository extends JpaRepository<StockInvoiceDetailsDao, String> {

	@Query(nativeQuery = true, value = "(SELECT * FROM "
			+ "(SELECT inv_details.inventoryId,invoice_details.id,COALESCE(invoice_details.status, 'OPEN') status,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,invoice_details.requestedQuantity,inv_details.productCategory,inv_details.productGroup,inv_details.binCode,"
			+ "inv_details.binGroupCode,inv_details.itemValue,inv_details.itemWeight,inv_details.currencyCode,inv_details.weightUnit,"
			+ "inv_details.mfgDate,invoice_details.requestedWeight as requestedWeight,inv_details.totalWeight as totalWeight,invoice_details.issuedValue,"
			+ "inv_details.totalValue,inv_details.issueQuantity,inv_details.docType,inv_details.docNumber,inv_details.fiscalYear,"
			+ "inv_details.stockInwardDate,inv_details.itemDetails,inv_details.karat,inv_details.isacDetails FROM "

			+ "(SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ "product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,"
			+ "currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,total_value as totalValue, "
			+ "issued_quantity as issueQuantity,doc_type as docType,doc_number as docNumber,fiscal_year as fiscalYear,"
			+ "stock_inward_date as stockInwardDate,item_details as itemDetails,karat as karat,isac_details as isacDetails FROM inventory_details "
			+ "WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ "(product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND"
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "(stock_inward_date < :businessDate) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND total_quantity-issued_quantity >0) "

			+ "as inv_details  FULL OUTER JOIN"

			+ "(SELECT  id as id,issued_quantity as requestedQuantity,status,item_code,lot_number,"
			+ "issued_weight as requestedWeight, inventory_id as inventoryId, issued_value as issuedValue  FROM stock_invoice_details"
			+ " WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ "(product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND"
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
            + "(bin_group_code= :binGroupCode OR :binGroupCode IS NULL) AND "
			+ "stock_invoice_id = :stockInvoiceId ) as invoice_details"
			+ "	ON inv_details.inventoryId=invoice_details.inventoryId ) as result WHERE (status= :status OR :status IS NULL) AND (itemCode= :itemCode OR :itemCode IS NULL ) AND (lotNumber= :lotNumber OR :lotNumber IS NULL )) "

			+ "ORDER BY CASE WHEN  :parameter = 'availableQuantity ASC'  THEN totalQuantity END ASC, "
			+ "CASE WHEN  :parameter = 'availableQuantity DESC'  THEN totalQuantity END DESC,  "
			+ "CASE WHEN  :parameter = 'availableWeight ASC' THEN totalWeight END ASC,  "
			+ "CASE WHEN  :parameter = 'availableWeight DESC' THEN totalWeight END DESC, "
			+ "CASE WHEN  :parameter = 'inwardDate ASC' THEN stockInwardDate END ASC,  "
			+ "CASE WHEN  :parameter = 'inwardDate DESC' THEN stockInwardDate END DESC, "
			+ "CASE WHEN  :parameter = 'NULL' THEN id END OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY")
	List<Object[]> getJointList(@Param("stockInvoiceId") Integer stockTransferId,
			@Param("productGroups") List<String> productGroups, @Param("status") String status,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroupList") List<String> productGroupList, @Param("binCodeList") List<String> binCodeList,
			@Param("binGroupList") List<String> binGroupList,@Param("binGroupCode") String binGroupCode,@Param("businessDate") Date businessDate,
			@Param("parameter") String parameter, @Param("offset") int offset, @Param("size") int size);

	@Query(nativeQuery = true, value = "(SELECT count(*) "
			+ "FROM (SELECT inv_details.inventoryId,invoice_details.id,COALESCE(invoice_details.status, 'OPEN') status,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,invoice_details.requestedQuantity,inv_details.productCategory,inv_details.productGroup,inv_details.binCode,"
			+ "inv_details.binGroupCode,inv_details.itemValue,inv_details.itemWeight,inv_details.currencyCode,inv_details.weightUnit,inv_details.mfgDate,invoice_details.requestedWeight as requestedWeight,inv_details.totalWeight as totalWeight "
			+ "FROM "

			+ "(SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight "
			+ "FROM inventory_details "
			+ "WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ "(product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND"
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND"
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "(stock_inward_date < :businessDate) AND "
			+ "(bin_group_code= :binGroupCode OR :binGroupCode IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND total_quantity-issued_quantity >0) "
			+ "as inv_details "

			+ "LEFT JOIN"
			+ "(SELECT  id as id,issued_quantity as requestedQuantity,status,item_code,lot_number,issued_weight as requestedWeight, inventory_id as inventoryId  "
			+ "FROM stock_invoice_details "
			+ "WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ "(product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND"
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
            + "(bin_group_code= :binGroupCode OR :binGroupCode IS NULL) AND "
			+ "stock_invoice_id = :stockInvoiceId ) as invoice_details	"
			+ "ON inv_details.inventoryId=invoice_details.inventoryId ) "

			+ "as result WHERE (status= :status OR :status IS NULL) AND "
			+ "(itemCode= :itemCode OR :itemCode IS NULL ) AND " + "(lotNumber= :lotNumber OR :lotNumber IS NULL ))")
	int getPageSize(@Param("stockInvoiceId") Integer stockInvoiceId, @Param("productGroups") List<String> productGroups,
			@Param("status") String status, @Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroupList") List<String> productGroupList, @Param("binCodeList") List<String> binCodeList,
			@Param("binGroupList") List<String> binGroupList,@Param("binGroupCode") String binGroupCode,@Param("businessDate") Date businessDate);
	
	@Query(nativeQuery = true, value = "(SELECT * FROM "
			+ "(SELECT inv_details.inventoryId,invoice_details.id,COALESCE(invoice_details.status, 'OPEN') status,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,invoice_details.requestedQuantity,inv_details.productCategory,inv_details.productGroup,inv_details.binCode,"
			+ "inv_details.binGroupCode,inv_details.itemValue,inv_details.itemWeight,inv_details.currencyCode,inv_details.weightUnit,"
			+ "inv_details.mfgDate,invoice_details.requestedWeight as requestedWeight,inv_details.totalWeight as totalWeight,invoice_details.issuedValue,inv_details.totalValue,inv_details.issueQuantity,inv_details.docType,inv_details.docNumber,inv_details.fiscalYear,inv_details.stockInwardDate,inv_details.itemDetails,inv_details.karat,inv_details.isacDetails FROM "

			+ "(SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ "product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,"
			+ "currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,total_value as totalValue, issued_quantity as issueQuantity,doc_type as docType,doc_number as docNumber,fiscal_year as fiscalYear,stock_inward_date as stockInwardDate,item_details as itemDetails,karat as karat,isac_details as isacDetails FROM inventory_details "
			+ "WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ "(product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND"
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "(stock_inward_date is null OR stock_inward_date <= :businessDate) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND total_quantity-issued_quantity >0) "

			+ "as inv_details FULL OUTER JOIN"

			+ "(SELECT  id as id,issued_quantity as requestedQuantity,status,item_code,lot_number,"
			+ "issued_weight as requestedWeight, inventory_id as inventoryId, issued_value as issuedValue  FROM stock_invoice_details"
			+ " WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ "(product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND"
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
            + "(bin_group_code= :binGroupCode OR :binGroupCode IS NULL) AND "
			+ "stock_invoice_id = :stockInvoiceId ) as invoice_details"
			+ "	ON inv_details.inventoryId=invoice_details.inventoryId ) as result WHERE (status= :status OR :status IS NULL) AND (itemCode= :itemCode OR :itemCode IS NULL ) AND (lotNumber= :lotNumber OR :lotNumber IS NULL )) "

			+ "ORDER BY CASE WHEN  :parameter = 'availableQuantity ASC'  THEN totalQuantity END ASC, "
			+ "CASE WHEN  :parameter = 'availableQuantity DESC'  THEN totalQuantity END DESC,  "
			+ "CASE WHEN  :parameter = 'availableWeight ASC' THEN totalWeight END ASC,  "
			+ "CASE WHEN  :parameter = 'availableWeight DESC' THEN totalWeight END DESC, "

			+ "CASE WHEN  :parameter = 'NULL' THEN id END OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY")
	List<Object[]> getJointListForBtqCfa(@Param("stockInvoiceId") Integer stockTransferId,
			@Param("productGroups") List<String> productGroups, @Param("status") String status,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroupList") List<String> productGroupList, @Param("binCodeList") List<String> binCodeList,
			@Param("binGroupList") List<String> binGroupList,@Param("binGroupCode") String binGroupCode,@Param("businessDate") Date businessDate,
			@Param("parameter") String parameter, @Param("offset") int offset, @Param("size") int size);
	
	@Query(nativeQuery = true, value = "(SELECT count(*) "
			+ "FROM (SELECT inv_details.inventoryId,invoice_details.id,COALESCE(invoice_details.status, 'OPEN') status,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,invoice_details.requestedQuantity,inv_details.productCategory,inv_details.productGroup,inv_details.binCode,"
			+ "inv_details.binGroupCode,inv_details.itemValue,inv_details.itemWeight,inv_details.currencyCode,inv_details.weightUnit,inv_details.mfgDate,invoice_details.requestedWeight as requestedWeight,inv_details.totalWeight as totalWeight "
			+ "FROM "

			+ "(SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight "
			+ "FROM inventory_details "
			+ "WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ "(product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND"
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND"
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "(stock_inward_date is null OR stock_inward_date <= :businessDate) AND "
			+ "(bin_group_code= :binGroupCode OR :binGroupCode IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND total_quantity-issued_quantity >0) "
			+ "as inv_details "

			+ "LEFT JOIN "
			+ "(SELECT  id as id,issued_quantity as requestedQuantity,status,item_code,lot_number,issued_weight as requestedWeight, inventory_id as inventoryId  "
			+ "FROM stock_invoice_details "
			+ "WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ "(product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND"
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
            + "(bin_group_code= :binGroupCode OR :binGroupCode IS NULL) AND "
			+ "stock_invoice_id = :stockInvoiceId ) as invoice_details	"
			+ "ON inv_details.inventoryId=invoice_details.inventoryId ) "

			+ "as result WHERE (status= :status OR :status IS NULL) AND "
			+ "(itemCode= :itemCode OR :itemCode IS NULL ) AND " + "(lotNumber= :lotNumber OR :lotNumber IS NULL ))")
	int getPageSizeBtqCfa(@Param("stockInvoiceId") Integer stockInvoiceId, @Param("productGroups") List<String> productGroups,
			@Param("status") String status, @Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroupList") List<String> productGroupList, @Param("binCodeList") List<String> binCodeList,
			@Param("binGroupList") List<String> binGroupList,@Param("binGroupCode") String binGroupCode,@Param("businessDate") Date businessDate);
	
	

	@Query(value = "SELECT COUNT(sid) FROM StockInvoiceDetailsDao sid WHERE sid.status = 'ISSUED' AND sid.stockInvoice = :stockInvoice")
	Integer getOpenItemCount(@Param("stockInvoice") StockInvoiceDao stockInvoice);

	@Query(value = "SELECT COUNT(sid) FROM StockInvoiceDetailsDao sid where sid.binCode = 'UNASSIGNED' and sid.stockInvoice = :stockInvoice")
	Integer getUnassignedBinCount(@Param("stockInvoice") StockInvoiceDao stockInvoice);

	@Modifying
	@Query("UPDATE StockInvoiceDetailsDao sid SET sid.status = :status WHERE sid.stockInvoice = :stockInvoice")
	int changeItemStatus(@Param("status") String status, @Param("stockInvoice") StockInvoiceDao stockInvoice);

	// bincode is being hardcoded(for now Purchase has only one Bin) need to remove.
	@Modifying
	@Query("UPDATE StockInvoiceDetailsDao sid SET sid.binCode=:binCode, sid.status = :status "
			+ "WHERE sid.id in (:itemid) AND sid.stockInvoice = :stockInvoice AND sid.binGroupCode = 'PURCFA'")
	void updateAllStockTransferDetailsByItemId(@Param("stockInvoice") StockInvoiceDao stockInvoice,
			@Param("itemid") List<String> itemid, @Param("binCode") String binCode, @Param("status") String status);
	// issued only verified, if verified not verifying in bulk

	// bincode is being hardcoded(for now Purchase has only one Bin) need to remove.
	@Modifying
	@Query("UPDATE StockInvoiceDetailsDao sid SET sid.binCode=:binCode , sid.status=:status "
			+ "WHERE sid.stockInvoice = :stockInvoice AND sid.binGroupCode = 'PURCFA'")
	void updateAllStockTransferDetails(@Param("stockInvoice") StockInvoiceDao stockInvoice,
			@Param("binCode") String binCode, @Param("status") String status);

	// removed receivedWeight update as it will be updated while issue only if any
	// change in weight is needed then
	// line level update will work
	@Modifying
	@Query("UPDATE StockInvoiceDetailsDao sid SET sid.status = :status "
			+ "WHERE sid.stockInvoice = :stockInvoice AND  sid.status = 'ISSUED'")
	void verifyAllItems(@Param("status") String status, @Param("stockInvoice") StockInvoiceDao stockInvoice);
	// last modified by, date?

	// removed receivedWeight update as it will be updated while issue only if any
	// change in weight is needed then
	// line level update will work
	@Modifying
	@Query("UPDATE StockInvoiceDetailsDao sid SET sid.status = :status "
			+ "WHERE sid.id in (:itemid) AND  sid.stockInvoice = :stockInvoice AND sid.status = 'ISSUED'")
	void verifyAllItemsByItemId(@Param("stockInvoice") StockInvoiceDao stockInvoice, @Param("status") String status,
			@Param("itemid") List<String> itemid);

	List<StockInvoiceDetailsDao> findByStockInvoice(StockInvoiceDao stockInvoice);

	@Query("select stockInvoiceDetails from StockInvoiceDetailsDao stockInvoiceDetails where stockInvoiceDetails.id IN (:itemIds)")
	List<StockInvoiceDetailsDao> findAllById(@Param("itemIds") List<String> itemIds);

	@Modifying
	@Query("UPDATE StockInvoiceDetailsDao sid SET sid.status = :status WHERE sid.status='SELECTED' and sid.stockInvoice = :stockInvoice")
	int changeItemDetailStatus(@Param("status") String status, @Param("stockInvoice") StockInvoiceDao stockInvoice);

	StockInvoiceDetailsDao getInvoiceByInventoryId(String inventoryId);

	@Query(nativeQuery = true, value = "SELECT * from (SELECT invoice_details.id as id, invoice_details.lotNumber as lotNumber, invoice_details.itemCode as itemCode, COALESCE(inv_details.totalQuantity, 0) as totalQuantity,invoice_details.issuedQuantity	FROM "
			+ "	(SELECT id as inventoryId, total_quantity-issued_quantity as totalQuantity FROM inventory_details where total_quantity-issued_quantity>0 )as inv_details "
			+ "	INNER JOIN "
			+ "	(SELECT  id as id,lot_number as lotNumber, item_code as itemCode, issued_quantity as issuedQuantity,status,inventory_id as inventoryId "
			+ " FROM stock_invoice_details "
			+ "	WHERE status='SELECTED' AND stock_invoice_id =:id ) as invoice_details 	"
			+ "	ON inv_details.inventoryId=invoice_details.inventoryId) as result where totalQuantity<issuedQuantity")
	List<Object[]> checkAvailableQuantityWithInventory(@Param("id") Integer id);

	List<StockInvoiceDetailsDao> findByStockInvoiceAndStatus(StockInvoiceDao stockInvoice, String status);

	@Query(nativeQuery = true, value = "SELECT * from (SELECT invoice_details.id as id, invoice_details.lotNumber, invoice_details.itemCode, inv_details.currentBinGroup, invoice_details.previousBinGroup FROM "
			+ "	(SELECT id as inventoryId, bin_group_code as currentBinGroup FROM inventory_details where total_quantity-issued_quantity>0 )as inv_details "
			+ "	 INNER JOIN "
			+ "	(SELECT  id as id,status,inventory_id as inventoryId,item_code as itemCode,lot_number as lotNumber, bin_group_code as previousBinGroup "
			+ " FROM stock_invoice_details "
			+ "	WHERE status='SELECTED' AND stock_invoice_id =:id ) as invoice_details 	"
			+ "	ON inv_details.inventoryId=invoice_details.inventoryId) as result where previousBinGroup != currentBinGroup")
	List<Object[]> checkBinValidationWithInventory(@Param("id") Integer id);

	// Queries related to history

	@Query("SELECT stockInvoiceDetails FROM StockInvoiceDetailsDao stockInvoiceDetails WHERE (stockInvoiceDetails.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL)"
			+ " AND (stockInvoiceDetails.itemCode = :itemCode OR :itemCode IS NULL)  AND (stockInvoiceDetails.productCategory in (:productCategory) OR "
			+ " nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (stockInvoiceDetails.productGroup in (:productGroup) OR "
			+ " nullif(CHOOSE(1,:productGroup),'') IS NULL) AND (stockInvoiceDetails.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) "
			+ " AND (stockInvoiceDetails.lotNumber = :lotNumber OR :lotNumber IS NULL) AND (stockInvoiceDetails.status= :status OR :status IS NULL) "
			+ " AND stockInvoiceDetails.stockInvoice= :stockInvoice")
	Page<StockInvoiceDetailsDao> listInvoiceItems(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("status") String status,
			@Param("stockInvoice") StockInvoiceDao stockInvoice, Pageable pageable);

	@Query("SELECT SUM(stockInvoiceDetails.receivedWeight) FROM StockInvoiceDetailsDao stockInvoiceDetails WHERE (stockInvoiceDetails.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL)"
			+ " AND (stockInvoiceDetails.itemCode = :itemCode OR :itemCode IS NULL)  AND (stockInvoiceDetails.productCategory in (:productCategory) OR "
			+ " nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (stockInvoiceDetails.productGroup in (:productGroup) OR "
			+ " nullif(CHOOSE(1,:productGroup),'') IS NULL) AND (stockInvoiceDetails.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) "
			+ " AND (stockInvoiceDetails.lotNumber = :lotNumber OR :lotNumber IS NULL) AND (stockInvoiceDetails.status= :status OR :status IS NULL) "
			+ " AND stockInvoiceDetails.stockInvoice= :stockInvoice")
	BigDecimal listInvoiceItemsReceivedWeight(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("status") String status,
			@Param("stockInvoice") StockInvoiceDao stockInvoice);

	@Query("UPDATE StockInvoiceDetailsDao s  SET s.status= 'CLOSE' WHERE s.id IN (:stockInvoiceId) AND s.status='SELECTED' ")
	void closeReturnInvoiceItems(@Param("stockInvoiceId") List<StockInvoiceDao> stockInvoice);

	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_invoice_details SET status='ISSUED',received_quantity = issued_quantity, "
			+ " received_weight = issued_weight,received_value = issued_value,last_modified_by = :lastModifiedBy, "
			+ " last_modified_date = :lastModifiedDate, bin_group_code = :binGroupCode, bin_code = :binCode  WHERE status='VERIFIED'")
	void updateStockInvoiceDetailsStatus(@Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy, @Param("binGroupCode") String binGroupCode,
			@Param("binCode") String binCode);
	
	@Query(nativeQuery = true, value = "SELECT * FROM stock_invoice_details  where id in("
			+ " SELECT invoice_details.id as id FROM "
			+ " (SELECT id as inventoryId, total_quantity-issued_quantity as totalQuantity FROM inventory_details where total_quantity-issued_quantity>0 )"
			+ " as inv_details  INNER JOIN "
			+ " (SELECT  id as id,lot_number as lotNumber, item_code as itemCode, issued_quantity as issuedQuantity,status,inventory_id as inventoryId "
			+ " FROM stock_invoice_details "
			+ " WHERE status=:status AND stock_invoice_id =:id ) as invoice_details "
			+ " ON inv_details.inventoryId=invoice_details.inventoryId)")
	List<StockInvoiceDetailsDao> findAllStockInvoiceDetails(@Param("id") Integer id, @Param("status") String status);
	
	
	@Query(nativeQuery = true, value = "(SELECT * FROM "
			+ "(SELECT inv_details.inventoryId,invoice_details.id,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,invoice_details.requestedQuantity, invoice_details.requestedWeight, invoice_details.finalValue,"
			+ " inv_details.binCode, inv_details.binGroupCode,"
			+ "inv_details.totalWeight as totalWeight,invoice_details.issuedValue, invoice_details.status as status, "
			+ "inv_details.totalValue"
			+ " FROM "
			+ "(SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ "product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,"
			+ "currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,total_value as totalValue, "
			+ "issued_quantity as issueQuantity,doc_type as docType,doc_number as docNumber,fiscal_year as fiscalYear,"
			+ "stock_inward_date as stockInwardDate,item_details as itemDetails,karat as karat FROM inventory_details "
			+ "WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ "(product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND"
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(stock_inward_date < :businessDate) AND "
			+ " (total_quantity-issued_quantity >0 ) ) "

			+ "as inv_details  FULL OUTER JOIN"

			+ "(SELECT  id as id,issued_quantity as requestedQuantity,status,item_code,lot_number,"
			+ "issued_weight as requestedWeight, inventory_id as inventoryId, issued_value as issuedValue, final_value as finalValue  FROM stock_invoice_details"
			+ " WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ "(product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND "
			+ "stock_invoice_id = :stockInvoiceId ) as invoice_details"
			+ "	ON inv_details.inventoryId=invoice_details.inventoryId ) as result WHERE (status= :status OR :status IS NULL) "
			+ " ) ")
	List<Object[]> getJointListDetail(@Param("stockInvoiceId") Integer stockInvoiceId,
			@Param("productGroups") List<String> productGroups, @Param("status") String status,
			@Param("locationCode") String locationCode, 
			@Param("binGroupList") List<String> binGroupList, @Param("businessDate") Date businessDate);
	
	@Query(nativeQuery = true, value = "(SELECT * FROM "
			+ " (SELECT inv_details.inventoryId,invoice_details.id,inv_details.itemCode,inv_details.lotNumber,"
			+ " inv_details.totalQuantity,invoice_details.requestedQuantity, invoice_details.requestedWeight, invoice_details.finalValue,"
			+ " inv_details.binCode, inv_details.binGroupCode,"
			+ " inv_details.totalWeight as totalWeight,invoice_details.issuedValue, invoice_details.status as status, "
			+ " inv_details.totalValue"
			+ " FROM "
			+ " (SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,total_quantity as totalQuantity,product_category as productCategory,"
			+ " product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as itemValue,std_weight as itemWeight,"
			+ " currency_code as currencyCode,weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,total_value as totalValue, "
			+ " issued_quantity as issueQuantity,doc_type as docType,doc_number as docNumber,fiscal_year as fiscalYear,"
			+ " stock_inward_date as stockInwardDate,item_details as itemDetails,karat as karat FROM inventory_details "
			+ " WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ " (product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND"
			+ " (location_code= :locationCode OR :locationCode IS NULL) AND "
			+ " (stock_inward_date is null OR stock_inward_date <= :businessDate) AND "
			+ " (total_quantity-issued_quantity >0 ) ) "

			+ " as inv_details  FULL OUTER JOIN"

			+ " (SELECT  id as id,issued_quantity as requestedQuantity,status,item_code,lot_number,"
			+ " issued_weight as requestedWeight, inventory_id as inventoryId, issued_value as issuedValue, final_value as finalValue  FROM stock_invoice_details"
			+ " WHERE (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND "
			+ " (product_group in (:productGroups) OR nullif(CHOOSE(1,:productGroups),'') IS NULL) AND "
			+ " stock_invoice_id = :stockInvoiceId ) as invoice_details"
			+ "	ON inv_details.inventoryId=invoice_details.inventoryId ) as result WHERE (status= :status OR :status IS NULL) "
			+ " ) ")
	List<Object[]> getJointBtqCfaListDetail(@Param("stockInvoiceId") Integer stockInvoiceId,
			@Param("productGroups") List<String> productGroups, @Param("status") String status,
			@Param("locationCode") String locationCode,  
			@Param("binGroupList") List<String> binGroupList, @Param("businessDate") Date businessDate);
	

}
