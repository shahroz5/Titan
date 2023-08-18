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

import com.titan.poss.inventory.dao.StockRequestDao;
import com.titan.poss.inventory.dao.StockRequestDetailsDao;

/**
 * Handles repository operations for Stock Request
 * 
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface StockRequestDetailsRepository extends JpaRepository<StockRequestDetailsDao, String> {

	// Queries related to stock request details starts here

	Page<StockRequestDetailsDao> findAllByStockRequestId(Integer id, Pageable pageable);

	Optional<StockRequestDetailsDao> findByIdAndStatusInAndStockRequest(String itemId, List<String> statusList,
			StockRequestDao stockRequest);

	Optional<List<StockRequestDetailsDao>> findAllByStockRequestReqLocationCodeAndStockRequestRequestTypeAndItemCodeAndStatus(
			String locationCode, String reqType, String itemCode, String status);

	@Modifying
	@Query("UPDATE StockRequestDetailsDao s set s.status = :status where s.stockRequest = :stockRequest and s.id in (:itemIdList) and status in (:statusList)")
	Integer updateAcceptedItemStatus(@Param("status") String status,
			@Param("stockRequest") StockRequestDao stockRequest, @Param("itemIdList") List<String> itemIdList,
			@Param("statusList") List<String> statusList);

	@Modifying
	@Query("UPDATE StockRequestDetailsDao s set s.status = :status where s.stockRequest = :stockRequest and s.id not in (:itemIdList) and status in (:statusList)")
	Integer updateRejectedItemStatus(@Param("status") String status,
			@Param("stockRequest") StockRequestDao stockRequest, @Param("itemIdList") List<String> itemIdList,
			@Param("statusList") List<String> statusList);

	@Query("SELECT SUM(acceptedQuantity) FROM StockRequestDetailsDao s WHERE s.stockRequest = :stockRequest AND s.status = :status")
	Short getTotalAcceptedQuantity(@Param("stockRequest") StockRequestDao stockRequest, @Param("status") String status);

	@Query("SELECT SUM(acceptedQuantity) FROM StockRequestDetailsDao s WHERE s.stockRequest = :stockRequest AND s.itemCode = :itemCode AND s.status = :status")
	Short getAcceptedItemQuantity(@Param("stockRequest") StockRequestDao stockRequest,
			@Param("itemCode") String itemCode, @Param("status") String status);

	@Query("SELECT SUM(approvedQuantity) FROM StockRequestDetailsDao s WHERE s.stockRequest = :stockRequest AND s.itemCode = :itemCode AND s.status = :status")
	Short getApprovedItemQuantity(@Param("stockRequest") StockRequestDao stockRequest,
			@Param("itemCode") String itemCode, @Param("status") String status);

	@Query("SELECT SUM(approvedQuantity) FROM StockRequestDetailsDao s WHERE s.stockRequest = :stockRequest AND s.status = :status")
	Short getTotalApprovedQuantity(@Param("stockRequest") StockRequestDao stockRequest, @Param("status") String status);

	// Queries related to stock request details ends here

	// Queries related to Other request starts here

	@Query(nativeQuery = true, value = "(SELECT * FROM "
			+ "(SELECT inv_details.inventoryId,req_details.id,COALESCE(req_details.status, 'OPEN') status,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,req_details.requestedQuantity,inv_details.productCategory,inv_details.productGroup,inv_details.binCode,"
			+ "inv_details.binGroupCode,inv_details.stdValue,inv_details.stdWeight,inv_details.currencyCode,inv_details.weightUnit,"
			+ "inv_details.mfgDate,req_details.requestedWeight as requestedWeight,inv_details.totalWeight as totalWeight,req_details.requestedValue,inv_details.totalValue, inv_details.issuedQuantity, inv_details.isHallmarked, inv_details.itemDetails FROM "

			+ "(SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,(total_quantity-issued_quantity) as totalQuantity,product_category as productCategory,"
			+ "product_group as productGroup,bin_code as binCode,bin_group_code as binGroupCode,std_value as stdValue,std_weight as stdWeight,currency_code as currencyCode,"
			+ "weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight,total_value as totalValue, issued_quantity as issuedQuantity, is_hallmarked as isHallmarked, item_details as itemDetails FROM inventory_details "

			+ "WHERE bin_group_code =:binGroupCode AND " + "(product_group= :productGroup OR :productGroup IS NULL)AND "
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND total_quantity!=0 AND ((total_quantity-issued_quantity)>0)) "

			+ "as inv_details "

			+ "FULL OUTER JOIN "

			+ "(SELECT  id as id,requested_quantity as requestedQuantity,status,item_code,lot_number,requested_weight as requestedWeight,inventory_id as inventoryId, requested_value as requestedValue "
			+ "FROM stock_request_details " + "WHERE (status='SELECTED' OR bin_group_code = :binGroupCode) AND "
			+ "(product_group= :productGroup OR :productGroup IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "stock_request_id = :stockRequestId) as req_details "

			+ "ON inv_details.inventoryId=req_details.inventoryId ) " + "as result "
			+ "WHERE (status= :status OR :status IS NULL) AND " + "(itemCode= :itemCode OR :itemCode IS NULL ) AND "
			+ "(lotNumber= :lotNumber OR :lotNumber IS NULL )) "

			+ "ORDER BY CASE WHEN  :parameter = 'availableQuantity ASC'  THEN totalQuantity END ASC, "
			+ "CASE WHEN  :parameter = 'availableQuantity DESC'  THEN totalQuantity END DESC,  "
			+ "CASE WHEN  :parameter = 'availableWeight ASC' THEN totalWeight END ASC,  "
			+ "CASE WHEN  :parameter = 'availableWeight DESC' THEN totalWeight END DESC, "

			+ " CASE WHEN  :parameter = 'NULL' THEN id END OFFSET :offset ROWS FETCH NEXT :size ROWS ONLY")
	List<Object[]> getJointList(@Param("stockRequestId") Integer stockRequestId,
			@Param("binGroupCode") String binGroupCode, @Param("productGroup") String productGroup,
			@Param("status") String status, @Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroupList") List<String> productGroupList, @Param("binCodeList") List<String> binCodeList,
			@Param("parameter") String parameter, @Param("offset") int offset, @Param("size") int size);

	@Query(nativeQuery = true, value = "SELECT count(*) "
			+ "FROM (SELECT inv_details.inventoryId,req_details.id,COALESCE(req_details.status, 'OPEN') status,inv_details.itemCode,inv_details.lotNumber,"
			+ "inv_details.totalQuantity,req_details.requestedQuantity,inv_details.productCategory,inv_details.productGroup,inv_details.binCode,"
			+ "inv_details.binGroupCode,inv_details.stdValue,inv_details.stdWeight,inv_details.currencyCode,inv_details.weightUnit,"
			+ "inv_details.mfgDate,req_details.requestedWeight as requestedWeight,inv_details.totalWeight as totalWeight FROM "

			+ "(SELECT id as inventoryId,item_code as itemCode,lot_number as lotNumber,(total_quantity-issued_quantity) as totalQuantity,product_category as productCategory,product_group as productGroup,"
			+ "bin_code as binCode,bin_group_code as binGroupCode,std_value as stdValue,std_weight as stdWeight,currency_code as currencyCode,"
			+ "weight_unit as weightUnit,mfg_date as mfgDate,total_weight as totalWeight FROM inventory_details "

			+ "WHERE bin_group_code =:binGroupCode AND " + "(product_group= :productGroup OR :productGroup IS NULL)AND "
			+ "(location_code= :locationCode OR :locationCode IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND total_quantity!=0 AND ((total_quantity-issued_quantity)>0)) "

			+ "as inv_details " + "LEFT JOIN "

			+ "(SELECT  id as id,requested_quantity as requestedQuantity,status,item_code,lot_number,requested_weight as requestedWeight,inventory_id as inventoryId "
			+ "FROM stock_request_details " + "WHERE (status='SELECTED' OR bin_group_code = :binGroupCode) AND "
			+ "(product_group= :productGroup OR :productGroup IS NULL) AND "
			+ "(product_category in (:productCategory) OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND "
			+ "(product_group in (:productGroupList) OR nullif(CHOOSE(1,:productGroupList),'') IS NULL) AND "
			+ "(bin_code in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND "
			+ "stock_request_id = :stockRequestId) as req_details "
			+ "ON inv_details.inventoryId=req_details.inventoryId) "

			+ "as result WHERE (status= :status OR :status IS NULL) AND "
			+ "(itemCode= :itemCode OR :itemCode IS NULL ) AND " + "(lotNumber= :lotNumber OR :lotNumber IS NULL)")
	int getPageSize(@Param("stockRequestId") Integer stockRequestId, @Param("binGroupCode") String binGroupCode,
			@Param("productGroup") String productGroup, @Param("status") String status,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroupList") List<String> productGroupList, @Param("binCodeList") List<String> binCodeList);

	@Modifying
	@Query("UPDATE StockRequestDetailsDao s SET s.status = :status where s.stockRequest = :stockRequest and s.status in (:statusList)")
	Integer updateAllRequestItemStatus(@Param("status") String status,
			@Param("stockRequest") StockRequestDao stockRequest, @Param("statusList") List<String> statusList);

	@Modifying
	@Query("UPDATE StockRequestDetailsDao s SET s.status = :status where s.stockRequest = :stockRequest and s.status='SELECTED'")
	Integer changeReqItemStatusOtherRequest(@Param("status") String status,
			@Param("stockRequest") StockRequestDao stockRequest);

	List<StockRequestDetailsDao> findByStockRequest(StockRequestDao stockRequest);

	@Modifying
	@Query("UPDATE StockRequestDetailsDao s SET s.status='ISSUED' WHERE s.status = 'SELECTED' AND s.stockRequest = :stockRequest")
	void updateStockRequestDetailsStatus(@Param("stockRequest") StockRequestDao stockRequest);

	@Query(nativeQuery = true, value = "(SELECT request_details.itemId,"
			+ "IIF(inv_details.totalQuantity<(request_details.approvedQuantity-COALESCE(request_details.issuedQuantity, 0)), (inv_details.totalQuantity-inv_details.issuedQuantity), request_details.approvedQuantity-COALESCE(request_details.issuedQuantity, 0)) as quantity,"
			// +
			// "IIF(inv_details.totalWeight<(request_details.requestedWeight-COALESCE(request_details.issuedWeight,0.00)),
			// inv_details.totalWeight,
			// request_details.requestedWeight-COALESCE(request_details.issuedWeight,0.00))
			// as minweight,"
			// + "IIF(inv_details.totalValue<request_details.requestedValue,
			// inv_details.totalValue, request_details.requestedValue) as minValue,"
			+ "inv_details.inventoryId,request_details.reqWeightDetails,request_details.requestedWeight,request_details.requestedQuantity, request_details.stdValue,request_details.itemCode "
			+ "FROM "
			+ "(SELECT total_quantity as totalQuantity,id as inventoryId,total_weight as totalWeight,total_value as totalValue, issued_quantity as issuedQuantity FROM inventory_details where total_quantity>0 )as inv_details "
			+ "JOIN "
			+ "(SELECT id as itemId,approved_quantity as approvedQuantity,issued_weight as issuedWeight,selected_quantity as selectedQuantity,issued_quantity as issuedQuantity,"
			+ "inventory_id as inventoryId,requested_weight as requestedWeight,requested_quantity requestedQuantity,std_value as stdValue,item_code as itemCode, requested_value as requestedValue,requested_weight_details as reqWeightDetails "
			+ "FROM stock_request_details " + "WHERE status=:status AND id IN (:itemIds)) as request_details "
			+ "ON inv_details.inventoryId=request_details.inventoryId) ")
	List<Object[]> getMultipleAvailableQuantityList(@Param("itemIds") List<String> itemIds,
			@Param("status") String status);

	@Query(nativeQuery = true, value = "(SELECT request_details.itemId,"
			+ "IIF(inv_details.totalQuantity<(request_details.approvedQuantity-COALESCE(request_details.issuedQuantity, 0)), (inv_details.totalQuantity-inv_details.issuedQuantity), request_details.approvedQuantity-COALESCE(request_details.issuedQuantity, 0)) as quantity,"
			// +
			// "IIF(inv_details.totalWeight<(request_details.requestedWeight-COALESCE(request_details.issuedWeight,0.00)),
			// inv_details.totalWeight,
			// request_details.requestedWeight-COALESCE(request_details.issuedWeight,0.00))
			// as minweight,"
			// + "IIF(inv_details.totalValue<request_details.requestedValue,
			// inv_details.totalValue, request_details.requestedValue) as minValue,"
			+ "inv_details.inventoryId,request_details.reqWeightDetails,request_details.requestedWeight,request_details.requestedQuantity, request_details.stdValue ,request_details.itemCode "
			+ "	FROM "
			+ "(SELECT total_quantity as totalQuantity,id as inventoryId,total_weight as totalWeight,total_value as totalValue, issued_quantity as issuedQuantity FROM inventory_details where total_quantity>0 ) as inv_details "
			+ "JOIN "
			+ "(SELECT  id as itemId,approved_quantity as approvedQuantity,issued_weight as issuedWeight,selected_quantity as selectedQuantity,issued_quantity as issuedQuantity,"
			+ "inventory_id as inventoryId ,requested_weight as requestedWeight,requested_value as requestedValue,requested_quantity requestedQuantity,std_value as stdValue,item_code as itemCode,requested_weight_details as reqWeightDetails "
			+ "FROM stock_request_details " + "	WHERE status=:status AND stock_request_id=:id ) as request_details "
			+ "	ON inv_details.inventoryId=request_details.inventoryId)")
	List<Object[]> getAllAvailableQuantityList(@Param("id") Integer id, @Param("status") String status);

	List<StockRequestDetailsDao> findByStockRequestAndStatus(StockRequestDao stockRequest, String status);
	// Queries related to Other request ends here

	@Query("SELECT sd FROM StockRequestDetailsDao sd WHERE (sd.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL)"
			+ " AND (sd.itemCode = :itemCode OR :itemCode IS NULL)  AND (sd.productCategory in (:productCategory) OR "
			+ " nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (sd.productGroup in (:productGroup) OR "
			+ " nullif(CHOOSE(1,:productGroup),'') IS NULL) AND (sd.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) "
			+ " AND (sd.lotNumber = :lotNumber OR :lotNumber IS NULL) AND (sd.status= :status OR :status IS NULL) "
			+ " AND sd.stockRequest= :stockRequest")
	Page<StockRequestDetailsDao> listStockRequestItems(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("status") String status,
			@Param("stockRequest") StockRequestDao stockRequest, Pageable pageable);

	@Query(nativeQuery = true, value = "select count(*) from stock_request_details where stock_request_id= :id and status = :status")
	Integer getSelectedItemsCount(@Param("id") Integer id, @Param("status") String status);

	List<StockRequestDetailsDao> findByItemCodeAndLotNumberAndRequestedWeightAndStatus(String itemCode,
			String lotNumber, BigDecimal requestedWeight, String status);

	// Queries related to history
	@Query("SELECT sd FROM StockRequestDetailsDao sd WHERE (sd.binCode IN (:binCodes) OR  nullif(CHOOSE(1,:binCodes),'') IS NULL)"
			+ " AND (sd.itemCode = :itemCode OR :itemCode IS NULL)  AND (sd.productCategory in (:productCategories) OR "
			+ " nullif(CHOOSE(1,:productCategories),'') IS NULL) AND (sd.productGroup in (:productGroups) OR "
			+ " nullif(CHOOSE(1,:productGroups),'') IS NULL) AND (sd.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) "
			+ " AND (sd.lotNumber = :lotNumber OR :lotNumber IS NULL) AND sd.stockRequest= :stockRequest")
	Page<StockRequestDetailsDao> listStockIssueItemsHistory(@Param("binCodes") List<String> binCodes,
			@Param("itemCode") String itemCode, @Param("productCategories") List<String> productCategories,
			@Param("productGroups") List<String> productGroups, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("stockRequest") StockRequestDao stockRequest,
			Pageable pageable);

	@Query("SELECT sd FROM StockRequestDetailsDao sd WHERE (sd.productCategory in (:productCategory) OR "
			+ " nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (sd.productGroup in (:productGroup) OR "
			+ " nullif(CHOOSE(1,:productGroup),'') IS NULL) "
			+ " AND (sd.status IN (:status) OR :status IS NULL) AND (sd.itemCode = :itemCode OR :itemCode IS NULL) AND (sd.lotNumber = :lotNumber OR :lotNumber IS NULL) AND sd.stockRequest= :stockRequest ")
	Page<StockRequestDetailsDao> findAllRequestItems(@Param("stockRequest") StockRequestDao stockRequest,
			@Param("status") String status, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("itemCode") String itemCode,
			@Param("lotNumber") String lotNumber, Pageable pageable);

	List<StockRequestDetailsDao> findByItemCodeAndLotNumberAndRequestedWeightAndStatusAndStockRequestIn(String itemCode,
			String lotNumber, BigDecimal requestedWeight, String status, List<StockRequestDao> stockRequestDaos);

	@Modifying
	@Query(nativeQuery = true, value = "UPDATE stock_request_details SET status= 'EXPIRED',last_modified_by= :lastModifiedBy,last_modified_date = :lastModifiedDate "
			+ " WHERE stock_request_id IN ( SELECT id FROM stock_request WHERE status = 'REQUESTED' AND  request_type IN ('BTQ') AND req_doc_date <= :previousDate AND dest_location_code = :locationCode) ")
	void closeUnacceptedIBTRequestDetails(@Param("lastModifiedDate") Date lastModifiedDate,
			@Param("lastModifiedBy") String lastModifiedBy, @Param("previousDate") Date previousDate,
			@Param("locationCode") String locationCode);

	/**
	 * @param stockRequestDao
	 * @return
	 */
	List<StockRequestDetailsDao> findAllByStockRequest(StockRequestDao stockRequestDao);

}
