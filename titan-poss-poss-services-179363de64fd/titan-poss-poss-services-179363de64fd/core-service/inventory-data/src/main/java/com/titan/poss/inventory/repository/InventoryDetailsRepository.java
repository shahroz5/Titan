
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.dto.response.InvWeightAndQuantityDto;
import com.titan.poss.inventory.dto.response.InventoryBinDto;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.ItemLocationListDto;
import com.titan.poss.inventory.dto.response.QtyAndWeightDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface InventoryDetailsRepository extends JpaRepository<InventoryDetailsDao, String> {
	@Query("SELECT i from InventoryDetailsDao i WHERE i.locationCode = :locationCode AND i.binCode = :binCode AND i.binModifiedDate <= DATEADD(day, -:configuration,:docDate) AND i.previousBinCode is NOT NULL AND i.previousBinGroupCode is NOT NULL")
	List<InventoryDetailsDao> getReserveBinItems(@Param("binCode") String binCode,
			@Param("locationCode") String locationCode, @Param("docDate") Date docDate,
			@Param("configuration") Integer configuration);

	@Query("SELECT i from InventoryDetailsDao i WHERE i.itemCode =:itemCode AND i.lotNumber =:lotNumber AND i.locationCode =:locationCode "
			+ "AND i.stdWeight =:stdWeight AND i.binGroupCode IN (:binGroupCodeList)")
	List<InventoryDetailsDao> getInvDetailsForReqFile(@Param("itemCode") String itemCode,
			@Param("lotNumber") String lotNumber, @Param("locationCode") String locationCode,
			@Param("stdWeight") BigDecimal stdWeight, @Param("binGroupCodeList") List<String> binGroupCodeList);

	@Query("SELECT i FROM InventoryDetailsDao i WHERE i.binCode IN (:binCode) AND "
			+ " i.itemCode IN (:itemCode) AND i.lotNumber IN (:lotNumber)"
			+ "AND i.serialNumber IN (:serialNumberList) AND i.locationCode IN (:locationCode)")
	List<InventoryDetailsDao> getInventoryItems(@Param("binCode") List<String> binCode,
			@Param("itemCode") List<String> itemCode, @Param("lotNumber") List<String> lotNumber,
			@Param("locationCode") String locationCode, @Param("serialNumberList") List<String> serialNumberList);

	// @formatter:off 
	@Query("SELECT i FROM InventoryDetailsDao i \r\n"
			+ " WHERE i.itemCode in (:itemCode) \r\n"
			+ " AND i.locationCode = (:locationCode) \r\n"
			+ " AND ( (i.binGroupCode IN (:binGroupCode)) "
			+ "		  OR "
			+ "       (:isReserverdBin = false AND (i.binGroupCode = '" +CommonConstants.TEP_BIN_CODE+"' AND i.binCode = '"+CommonConstants.TEP_SALE_BIN_CODE+"'))"
			+"      )")
	// @formatter:on
	List<InventoryDetailsDao> findByItemCodeInAndLocationCodeAndBinGroupCode(@Param("itemCode") Set<String> itemCode,
			@Param("locationCode") String locationCode, @Param("binGroupCode") List<String> binGroupCode,
			@Param("isReserverdBin") Boolean isReserverdBin);

	@Query("SELECT i from InventoryDetailsDao i WHERE i.correlationId = :correlationId")
	List<InventoryDetailsDao> findByCorrelationId(@Param("correlationId") String correlationId);

	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryBinDto(i.binCode,SUM(i.totalQuantity),SUM(i.totalValue),SUM(i.totalWeight),"
			+ " i.currencyCode) FROM  InventoryDetailsDao i WHERE i.locationCode = :locationCode AND (i.binCode = :name OR :name IS NULL) "
			+ " AND (i.binGroupCode in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND i.totalQuantity > 0 GROUP BY i.binCode,i.currencyCode ORDER BY i.binCode")
	Page<InventoryBinDto> listBinsByBincode(@Param("locationCode") String locationCode, @Param("name") String name,
			@Param("binGroupList") List<String> binGroupList, Pageable pageable);

	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryBinDto(i.productGroup,SUM(i.totalQuantity),SUM(i.totalValue),SUM(i.totalWeight),"
			+ " i.currencyCode) FROM  InventoryDetailsDao i WHERE i.locationCode = :locationCode AND (i.productGroup = :name OR :name IS NULL) "
			+ " AND (i.binGroupCode in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND i.totalQuantity > 0 GROUP BY i.productGroup,i.currencyCode ORDER BY i.productGroup")
	Page<InventoryBinDto> listBinsByProductGroup(@Param("locationCode") String locationCode, @Param("name") String name,
			@Param("binGroupList") List<String> binGroupList, Pageable pageable);

	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryBinDto(i.productCategory,SUM(i.totalQuantity),SUM(i.totalValue),SUM(i.totalWeight),"
			+ " i.currencyCode) FROM  InventoryDetailsDao i WHERE i.locationCode = :locationCode AND (i.productCategory = :name OR :name IS NULL) "
			+ " AND (i.binGroupCode in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND i.totalQuantity > 0 GROUP BY i.productCategory,i.currencyCode"
			+ " ORDER BY i.productCategory")
	Page<InventoryBinDto> listBinsByProductCategory(@Param("locationCode") String locationCode,
			@Param("name") String name, @Param("binGroupList") List<String> binGroupList, Pageable pageable);

	// List<String> binCode: bincode passed from UI for filtering (if not passed
	// will be null)

	// List<String> binCodeList: bincode constrains from Backend for PArticular
	// Users (if not passed will be null)

	@Query("SELECT i FROM InventoryDetailsDao i WHERE (i.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL) AND "
			+ " (:itemCode IS NULL OR i.itemCode LIKE :itemCode +'%') AND (i.productCategory in (:productCategory) "
			+ " OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (i.productGroup in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) "
			+ " AND (i.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) AND (i.lotNumber = :lotNumber "
			+ " OR :lotNumber IS NULL) AND (i.binGroupCode in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND(i.locationCode=:locationCode) AND i.totalQuantity > 0")
	Page<InventoryDetailsDao> getInventoryItems(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("locationCode") String locationCode,
			@Param("binGroupList") List<String> binGroupList, Pageable pageable);

	@Query("SELECT i FROM InventoryDetailsDao i WHERE (i.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL) AND "
			+ " (:itemCode IS NULL OR i.itemCode LIKE :itemCode +'%') AND (i.productCategory in (:productCategory) "
			+ " OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (i.productGroup in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) "
			+ " AND (i.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) AND (i.lotNumber = :lotNumber "
			+ " OR :lotNumber IS NULL) AND (i.binCode in (:binCodeList) OR nullif(CHOOSE(1,:binCodeList),'') IS NULL) AND(i.locationCode=:locationCode)")
	List<InventoryDetailsDao> getAllInventoryItems(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("locationCode") String locationCode,
			@Param("binCodeList") List<String> binCodeList);
	
	
	@Query("SELECT i FROM InventoryDetailsDao i WHERE (:itemCode IS NULL OR i.itemCode = :itemCode ) AND (i.lotNumber = :lotNumber "
			+ " OR :lotNumber IS NULL) AND (i.binGroupCode in (:binGroupCodeList) OR nullif(CHOOSE(1,:binGroupCodeList),'') IS NULL) AND(i.locationCode=:locationCode) AND i.totalQuantity > 0")
	List<InventoryDetailsDao> getInventoryItemsFileUpload(@Param("itemCode") String itemCode,@Param("lotNumber") String lotNumber, @Param("locationCode") String locationCode,
			@Param("binGroupCodeList") List<String> binGroupCodeList);

	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryItemDtoList(SUM(i.totalQuantity),SUM(i.totalValue),COUNT(itemCode))from InventoryDetailsDao i WHERE (i.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL) AND "
			+ "(:itemCode IS NULL OR i.itemCode LIKE :itemCode +'%') AND (i.productCategory in (:productCategory) "
			+ " OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (i.productGroup in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) "
			+ " AND (i.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) AND (i.lotNumber = :lotNumber "
			+ " OR :lotNumber IS NULL) AND (i.binGroupCode in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND(i.locationCode=:locationCode) AND i.totalQuantity > 0")
	InventoryItemDtoList getInventoryItemsCount(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("locationCode") String locationCode,
			@Param("binGroupList") List<String> binGroupList);

	List<InventoryDetailsDao> findAllByIdIn(List<String> inventortIds);

	@Query("SELECT i from InventoryDetailsDao i WHERE i.id IN (:idList) AND i.locationCode = :locationCode")
	List<InventoryDetailsDao> getItemsByIdAndLocationCode(@Param("idList") List<String> idList,
			@Param("locationCode") String locationCode);

	@Query("SELECT i from InventoryDetailsDao i WHERE i.id =:id AND i.locationCode = :locationCode")
	InventoryDetailsDao getItemByIdAndLocationCode(@Param("id") String id,
			@Param("locationCode") String locationCode);
	// Queries related to other request starts here

	Optional<InventoryDetailsDao> findByLocationCodeAndItemCodeAndLotNumber(String srcLocationCode, String itemCode,
			String lotNumber);
	
	List<InventoryDetailsDao> findByItemCodeAndLotNumberAndLocationCode(String itemCode,
			String lotNumber,String locationCode);
	
	Optional<InventoryDetailsDao> findByIdAndItemCodeAndLotNumberAndLocationCode(String id,String itemCode,
			String lotNumber,String locationCode);
	                            

	List<InventoryDetailsDao> findByBinCodeAndLocationCode(String binCode, String locationCode);

	// Queries related to other request ends here

	// Queries related to stock request starts here

	List<InventoryDetailsDao> findByBinCodeAndProductGroupAndLocationCode(String bin, String productGroup,
			String locationCode);

	List<InventoryDetailsDao> findAllByLocationCodeAndItemCodeAndBinGroupCodeIn(String srcLocationCode, String itemCode,
			List<String> binGroupList);

	@Query("select new com.titan.poss.inventory.dto.response.ItemLocationListDto(i.locationCode, sum(i.totalQuantity), i.itemCode) from InventoryDetailsDao i where i.itemCode in (:itemList) and i.locationCode in (select inv.locationCode from InventoryDetailsDao inv where inv.locationCode in (:locationList) and inv.itemCode in (:itemList) and inv.binGroupCode in (:binGroupList) group by inv.locationCode having count(distinct inv.itemCode) >= :requestCount) and  i.locationCode != :locationCode group by i.locationCode, i.itemCode")
	List<ItemLocationListDto> getItemsAvailableLocationsList(@Param("itemList") List<String> itemList,
			@Param("locationCode") String locationCode, @Param("requestCount") Long requestCount,
			@Param("locationList") List<String> locationList, @Param("binGroupList") List<String> binGroupList);

	@Query(nativeQuery = true, value = " select distinct k.bin_code, ISNULL(p.summed_quantity,0) as summed_quantity  from (select bin_code from bincode_location_mapping i join bin_master j on (j.id = i.bin_master_id) "
			+ "   where i.location_code=:locationCode) k left join (select bin_code, sum(total_quantity) as summed_quantity  from inventory_details where location_code=:locationCode group by bin_code) p "
			+ "   on (k.bin_code = p.bin_code) ORDER BY summed_quantity DESC")
	List<Object[]> getAvailableBinCodesByLocation(@Param("locationCode") String locationCode);

	// Queries related to stock request ends here

	Optional<InventoryDetailsDao> findByLocationCodeAndItemCodeAndLotNumberAndSerialNumberAndBinCode(
			String srcLocationCode, String itemCode, String lotNumber, String serialNumber, String binCode);

	@Query(nativeQuery = true, value = "select id as inventoryId, bin_group_code as binGroup,item_code as itemCode, lot_number as lotNumber from inventory_details where id in (:inventoryIds) and (bin_group_code='DISPUTE' OR bin_group_code = 'DEFFECTIVE')and location_code= :locationCode")
	List<Object[]> validateDefectiveAndDisputeItems(@Param("inventoryIds") List<String> inventoryIds,
			@Param("locationCode") String locationCode);

	/**
	 * @param binCode
	 * @param itemCode
	 * @param serialNumber
	 * @param lotNumber
	 * @param location
	 */
	InventoryDetailsDao findOneByBinCodeAndItemCodeAndSerialNumberAndLotNumberAndLocationCode(String binCode,
			String itemCode, String serialNumber, String lotNumber, String location);

	/**
	 * @param correlationId
	 * @return
	 */
	List<InventoryDetailsDao> findAllByCorrelationId(String correlationId);

	/**
	 * @param locationCode
	 * @param itemCode
	 * @param lotNumber
	 * @param toBinAge
	 * @param fromBinAge
	 * @param toLotAge
	 * @param fromLotAge
	 * @return
	 */
	@Query("select i from InventoryDetailsDao i where i.itemCode = :itemCode and i.locationCode  = :locationCode and i.lotNumber = :lotNumber and (DATEDIFF(day,i.mfgDate,GETDATE()) between :fromLotAge and  :toLotAge) and (DATEDIFF(day,i.stockInwardDate,GETDATE()) between :fromBinAge and :toBinAge)")
	List<InventoryDetailsDao> findByLocationCodeBasedOnLotAgeBinAge(@Param("locationCode") String locationCode,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("fromLotAge") BigDecimal fromLotAge, @Param("toLotAge") BigDecimal toLotAge,
			@Param("fromBinAge") BigDecimal fromBinAge, @Param("toBinAge") BigDecimal toBinAge);

	// @formatter:off
	@Query("SELECT new com.titan.poss.inventory.dto.response.InvWeightAndQuantityDto(SUM(i.totalQuantity),(i.totalWeight/i.totalQuantity)) \r\n"
			+ " FROM InventoryDetailsDao i \r\n" + " WHERE i.locationCode=:locationCode \r\n"
			+ " AND i.itemCode = :itemCode \r\n" + " AND i.productGroup = :coinProductGroupCode \r\n"
			+ " AND i.totalQuantity > 0 \r\n"
			+ " GROUP BY i.itemCode, i.stdWeight, (i.totalWeight/i.totalQuantity) \r\n"
			+ " ORDER BY SUM(i.totalQuantity)")
	// @formatter:on
	List<InvWeightAndQuantityDto> findCoinByItemCodeAndProductGroupAndLocationCode(@Param("itemCode") String itemCode,
			@Param("coinProductGroupCode") String coinProductGroupCode, @Param("locationCode") String locationCode);

	// @formatter:off
	@Query("SELECT new com.titan.poss.inventory.dto.response.QtyAndWeightDto(i.totalQuantity,(i.totalWeight/i.totalQuantity)) \r\n"
			+ " FROM InventoryDetailsDao i \r\n" 
			+ " WHERE i.locationCode=:locationCode \r\n" 
			+ " AND i.id = :id \r\n"
			+ " AND i.totalQuantity > 0 ")
	// @formatter:on
	QtyAndWeightDto findOneByIdAndLocationCode(@Param("id") String id, @Param("locationCode") String locationCode);

	/**
	 * @param binCode
	 * @param locationCode
	 * @param numberOfDays
	 * @return List<InventoryDetailsDao>
	 */
	@Query("SELECT i from InventoryDetailsDao i WHERE i.locationCode = :locationCode AND i.binCode = :binCode AND i.lastModifiedDate <= DATEADD(day, - :numberOfDays,getdate()) AND i.previousBinCode is NOT NULL AND i.previousBinGroupCode is NOT NULL")
	List<InventoryDetailsDao> getReserveBinItemsList(@Param("binCode") String binCode,
			@Param("locationCode") String locationCode, @Param("numberOfDays") Integer numberOfDays);

	@Query("SELECT i from InventoryDetailsDao i WHERE i.id in :inventoryIds")
	List<InventoryDetailsDao> getInventoryDetails(@Param("inventoryIds") List<String> inventoryIds);

	@Query(value = "select TOP 1.* from inventory.dbo.inventory_details i where i.item_code = :itemCode and i.total_quantity > 0 and i.location_code  = :locationCode and i.lot_number = :lotNumber and (DATEDIFF(day,i.mfg_date,:businessDate) between :fromLotAge and  :toLotAge) and (DATEDIFF(day,i.stock_inward_date,:businessDate) between :fromBinAge and :toBinAge)", nativeQuery = true)
	InventoryDetailsDao findByLocationCodeBasedOnLotAgeBinAgeWrtBusinessDate(@Param("locationCode") String locationCode,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("fromLotAge") BigDecimal fromLotAge, @Param("toLotAge") BigDecimal toLotAge,
			@Param("fromBinAge") BigDecimal fromBinAge, @Param("toBinAge") BigDecimal toBinAge,
			@Param("businessDate") Date businessDate);

	/**
	 * @param locationCode
	 * @param itemCode
	 * @param lotNumber
	 * @return
	 */
	List<InventoryDetailsDao> findAllByLocationCodeAndItemCodeAndLotNumber(String locationCode, String itemCode,
			String lotNumber);
	
	List<InventoryDetailsDao> findAllByLocationCodeAndItemCodeAndLotNumberAndBinGroupCodeIn(String locationCode,
			String itemCode, String lotNumber, List<String> binGroupList);
	
    InventoryDetailsDao findByLocationCodeAndItemCodeAndLotNumberAndBinCodeAndBinGroupCode(String locationCode,
            String itemCode, String lotNumber, String binCode, String binGroupCode);

	@Query("SELECT i FROM InventoryDetailsDao i WHERE (i.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL) AND "
			+ " (:itemCode IS NULL OR i.itemCode LIKE :itemCode +'%') AND (i.productCategory in (:productCategory) "
			+ " OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (i.productGroup in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) "
			+ " AND (i.binGroupCode != :binGroupCode OR :binGroupCode IS NULL) AND (i.lotNumber = :lotNumber "
			+ " OR :lotNumber IS NULL) AND (i.binGroupCode not in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND(i.locationCode=:locationCode) AND i.totalQuantity > 0")
	Page<InventoryDetailsDao> getInventoryItemsNotInBinGroup(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("locationCode") String locationCode,
			@Param("binGroupList") List<String> binGroupList, Pageable pageable);

	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryItemDtoList(SUM(i.totalQuantity),SUM(i.totalValue),COUNT(itemCode))from InventoryDetailsDao i WHERE (i.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL) AND "
			+ "(:itemCode IS NULL OR i.itemCode LIKE :itemCode +'%') AND (i.productCategory in (:productCategory) "
			+ " OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (i.productGroup in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) "
			+ " AND (i.binGroupCode != :binGroupCode OR :binGroupCode IS NULL) AND (i.lotNumber = :lotNumber "
			+ " OR :lotNumber IS NULL) AND (i.binGroupCode not in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND(i.locationCode=:locationCode) AND i.totalQuantity > 0")
	InventoryItemDtoList getInventoryItemsCountNotInBinGroup(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("locationCode") String locationCode,
			@Param("binGroupList") List<String> binGroupList);

	@Query(nativeQuery = true, value = "SELECT * from inventory.dbo.inventory_details  WHERE item_code = :itemCode AND (total_quantity - issued_quantity > 0) AND (bin_group_code in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL)")
	List<InventoryDetailsDao> getItemsByItemCode(@Param("itemCode") String itemCode ,@Param("binGroupList") List<String> binGroupList );
	
	@Query(nativeQuery = true, value = "SELECT * from inventory.dbo.inventory_details  WHERE item_code = :itemCode AND  bin_group_code= :binGroupCode AND location_code= :locationCode")
	List<InventoryDetailsDao> getItemsByItemCodeAndBinGroupCodeAndLocationCode(@Param("itemCode")String itemCode,@Param("binGroupCode")String binGroupCode, @Param("locationCode") String locationCode);
	
}
