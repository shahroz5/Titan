
/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.inventory.dao.InventoryDetailsDaoExt;
import com.titan.poss.inventory.dto.response.InventoryBinDto;
import com.titan.poss.inventory.dto.response.InventoryItemDtoList;
import com.titan.poss.inventory.dto.response.ItemLocationListDto;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface InventoryDetailsRepositoryExt extends JpaRepository<InventoryDetailsDaoExt, String> {
	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryBinDto(i.binCode,SUM(i.totalQuantity),SUM(i.totalValue),SUM(i.totalWeight),"
			+ " i.currencyCode) FROM  InventoryDetailsDaoExt i WHERE i.locationCode = :locationCode AND (i.binCode = :binCode OR :binCode IS NULL) "
			+ " AND (i.binGroupCode in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) GROUP BY i.binCode,i.currencyCode ORDER BY i.binCode")
	Page<InventoryBinDto> listBinsByBincode(@Param("locationCode") String locationCode,
			@Param("binCode") String binCode, @Param("binGroupList") List<String> binGroupList, Pageable pageable);

	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryBinDto(i.productGroup,SUM(i.totalQuantity),SUM(i.totalValue),SUM(i.totalWeight),"
			+ " i.currencyCode) FROM  InventoryDetailsDaoExt i WHERE i.locationCode = :locationCode AND (i.productGroup = :binCode OR :binCode IS NULL) "
			+ " AND (i.binGroupCode in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) GROUP BY i.productGroup,i.currencyCode ORDER BY i.productGroup")
	Page<InventoryBinDto> listBinsByProductGroup(@Param("locationCode") String locationCode,
			@Param("binCode") String binCode, @Param("binGroupList") List<String> binGroupList, Pageable pageable);

	@Query("SELECT new com.titan.poss.inventory.dto.response.InventoryBinDto(i.productCategory,SUM(i.totalQuantity),SUM(i.totalValue),SUM(i.totalWeight),"
			+ " i.currencyCode) FROM  InventoryDetailsDaoExt i WHERE i.locationCode = :locationCode AND (i.productCategory = :binCode OR :binCode IS NULL) "
			+ " AND (i.binGroupCode in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) GROUP BY i.productCategory,i.currencyCode "
			+ " ORDER BY i.productCategory")
	Page<InventoryBinDto> listBinsByProductCategory(@Param("locationCode") String locationCode,
			@Param("binCode") String binCode, @Param("binGroupList") List<String> binGroupList, Pageable pageable);

	// List<String> binCode: bincode passed from UI for filtering (if not passed
	// will be null)

	// List<String> binCodeList: bincode constrains from Backend for PArticular
	// Users (if not passed will be null)

	@Query("SELECT i FROM InventoryDetailsDaoExt i WHERE (i.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL) AND "
			+ " (:itemCode IS NULL OR i.itemCode LIKE :itemCode +'%') AND (i.productCategory in (:productCategory) "
			+ " OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (i.productGroup in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) "
			+ " AND (i.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) AND (i.lotNumber = :lotNumber "
			+ " OR :lotNumber IS NULL) AND (i.binGroupCode in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND(i.locationCode=:locationCode) AND totalQuantity >0")
	Page<InventoryDetailsDaoExt> getInventoryItems(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("locationCode") String locationCode,
			@Param("binGroupList") List<String> binGroupList, Pageable pageable);

	@Query("SELECT i FROM InventoryDetailsDaoExt i WHERE (i.binCode IN (:binCode) OR  nullif(CHOOSE(1,:binCode),'') IS NULL) AND "
			+ " (i.itemCode = :itemCode OR :itemCode IS NULL) AND (i.productCategory in (:productCategory) "
			+ " OR nullif(CHOOSE(1,:productCategory),'') IS NULL) AND (i.productGroup in (:productGroup) OR nullif(CHOOSE(1,:productGroup),'') IS NULL) "
			+ " AND (i.binGroupCode = :binGroupCode OR :binGroupCode IS NULL) AND (i.lotNumber = :lotNumber "
			+ " OR :lotNumber IS NULL) AND (i.binGroupCode in (:binGroupList) OR nullif(CHOOSE(1,:binGroupList),'') IS NULL) AND(i.locationCode=:locationCode)")
	List<InventoryDetailsDaoExt> getAllInventoryItems(@Param("binCode") List<String> binCode,
			@Param("itemCode") String itemCode, @Param("productCategory") List<String> productCategory,
			@Param("productGroup") List<String> productGroup, @Param("binGroupCode") String binGroupCode,
			@Param("lotNumber") String lotNumber, @Param("locationCode") String locationCode,
			@Param("binGroupList") List<String> binGroupList);

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

	List<InventoryDetailsDaoExt> findAllByIdIn(List<String> inventortIds);

	@Query("SELECT i from InventoryDetailsDaoExt i WHERE i.id IN (:idList) AND i.locationCode = :locationCode")
	List<InventoryDetailsDaoExt> getItemsByIdAndLocationCode(@Param("idList") List<String> idList,
			@Param("locationCode") String locationCode);

	// Queries related to other request starts here

	Optional<InventoryDetailsDaoExt> findByLocationCodeAndItemCodeAndLotNumber(String srcLocationCode, String itemCode,
			String lotNumber);

	List<InventoryDetailsDaoExt> findByBinCodeAndLocationCode(String binCode, String locationCode);

	// Queries related to other request ends here

	// Queries related to stock request starts here

	List<InventoryDetailsDaoExt> findByBinCodeAndProductGroupAndLocationCode(String bin, String productGroup,
			String locationCode);
    
	List<InventoryDetailsDaoExt> findAllByLocationCodeAndItemCodeAndBinGroupCodeIn(String srcLocationCode,
			String itemCode, List<String> binGroupList);
	
	@Query(nativeQuery = true, value = "select * from inventory_details where location_code= :srcLocationCode and "
			+ " item_code= :itemCode and bin_group_code in (:binGroupList) and total_quantity>0")
	List<InventoryDetailsDaoExt> getInventoryItemsDetailsList(@Param("srcLocationCode") String srcLocationCode,
			@Param("itemCode") String itemCode, @Param("binGroupList") List<String> binGroupList);

	@Query("select new com.titan.poss.inventory.dto.response.ItemLocationListDto(i.locationCode, sum(i.totalQuantity), i.itemCode) from InventoryDetailsDaoExt i where i.itemCode in (:itemList) and i.locationCode in (select inv.locationCode from InventoryDetailsDaoExt inv where inv.locationCode in (:locationList) and inv.itemCode in (:itemList) and inv.binGroupCode in (:binGroupList) group by inv.locationCode having count(distinct inv.itemCode) >= :requestCount) and  i.locationCode != :locationCode group by i.locationCode, i.itemCode")
	List<ItemLocationListDto> getItemsAvailableLocationsList(@Param("itemList") List<String> itemList,
			@Param("locationCode") String locationCode, @Param("requestCount") Long requestCount,
			@Param("locationList") List<String> locationList, @Param("binGroupList") List<String> binGroupList);

	@Query(nativeQuery = true, value = " select distinct k.bin_code, ISNULL(p.summed_quantity,0) as summed_quantity  from (select bin_code from bincode_location_mapping i join bin_master j on (j.id = i.bin_master_id) "
			+ "   where i.location_code=:locationCode) k left join (select bin_code, sum(total_quantity-issued_quantity) as summed_quantity  from inventory_details where location_code=:locationCode group by bin_code) p "
			+ "   on (k.bin_code = p.bin_code) ORDER BY summed_quantity DESC")
	List<Object[]> getAvailableBinCodesByLocation(@Param("locationCode") String locationCode);

	// Queries related to stock request ends here

	Optional<InventoryDetailsDaoExt> findByLocationCodeAndItemCodeAndLotNumberAndSerialNumberAndBinCode(
			String srcLocationCode, String itemCode, String lotNumber, String serialNumber, String binCode);

	@Query(nativeQuery = true, value = "select id as inventoryId, bin_group_code as binGroup,item_code as itemCode, "
			+ "lot_number as lotNumber from inventory_details where id in (:inventoryIds) and"
			+ " (bin_group_code='DISPUTE' OR bin_group_code = 'DEFECTIVE') and location_code= :locationCode")
	List<Object[]> validateDefectiveAndDisputeItems(@Param("inventoryIds") List<String> inventoryIds,
			@Param("locationCode") String locationCode);

	/**
	 * @param locationCode
	 * @param itemCode
	 * @param lotNumber
	 * @param serialNumber
	 * @param binCode
	 * @return
	 */
	List<InventoryDetailsDaoExt> findAllByLocationCodeAndItemCodeAndLotNumberAndStdWeightAndBinCode(String locationCode,
			String itemCode, String lotNumber, BigDecimal serialNumber, String binCode);
	
	Optional<InventoryDetailsDaoExt> findByItemCodeAndLotNumberAndBinCodeAndBinGroupCode( String itemCode, String lotNumber , String binCode, String binGroupCode);


}
