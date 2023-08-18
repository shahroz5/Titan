/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.inventory.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.engine.dto.InventoryCoinsDto;
import com.titan.poss.engine.dto.response.InventoryFocItemDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineInventoryDetailRepository")
public interface InventoryDetailRepositoryExt extends InventoryDetailsRepository, CustomInventoryDetailRepositoryExt {

	@Override
	Optional<InventoryDetailsDao> findByLocationCodeAndItemCodeAndLotNumber(String locationCode, String itemCode,
			String lotNumber);

	// @formatter:off
	@Query(nativeQuery = true, value = "DECLARE @item_code varchar(20) \r\n" 
			+ " SET @item_code = CONCAT('\"*', :itemCode, '*\"') \r\n"
			+ " SELECT item_code AS itemCode, SUM(total_quantity) AS totalQuantity, product_group AS productGroupCode \r\n"
			+ " FROM inventory_details \r\n"
			+ " WHERE CONTAINS(item_code, @item_code) \r\n"
			+ " AND location_code = :locationCode \r\n"
			+ " AND total_quantity > 0 \r\n"
			+ " GROUP BY item_code, product_group \r\n",
			countQuery = " DECLARE @item_code varchar(20) \r\n" 
					+ " SET @item_code = CONCAT('\"*', :itemCode, '*\"') \r\n"
					+ " SELECT COUNT(*) FROM ( SELECT invDtls.item_code, SUM(invDtls.total_quantity) AS total_quantity, invDtls.product_group \r\n"
					+ " FROM inventory_details invDtls \r\n"
					+ " WHERE CONTAINS(invDtls.item_code, @item_code) \r\n"
					+ " AND invDtls.location_code = :locationCode \r\n"
					+ " AND total_quantity > 0 \r\n"
					+ " GROUP BY invDtls.item_code, invDtls.product_group) invD")
	// @formatter:on
	Page<Object[]> findByLocationCodeAndItemCode(@Param("locationCode") String locationCode,
			@Param("itemCode") String itemCode, Pageable pageable);

	/**
	 * @param metalTypeCode
	 * @param applicableDate
	 * @param priceType
	 * @param pageable
	 */
	// for coins
	// @formatter:off
	@Query("select m from InventoryDetailsDao m where (m.locationCode=:locationCode and m.itemCode=:itemCode) AND m.totalQuantity > 0 \r\n"
			+ " AND  ROUND(m.totalWeight/m.totalQuantity, :weightScale) = :measuredWeight \r\n"
			+ " ANd (:isHalmarked IS NULL OR m.isHallmarked = :isHalmarked) \r\n"
			+ " order by m.totalQuantity ASC")
	// @formatter:on
	List<InventoryDetailsDao> findByLocationCodeAndItemCodeWithOrder(@Param("locationCode") String locationCode,
			@Param("itemCode") String itemCode, @Param("measuredWeight") BigDecimal measuredWeight,
			@Param("weightScale") Integer weightScale, @Param("isHalmarked") Boolean isHalmarked, Pageable pageable);

	// @formatter:off
	//max value of stdValue to be picked if coins are in different lots.
	//if unit weight exceeds exclude grams, only then hallmark check is necessary, else no.
	@Query("SELECT new com.titan.poss.engine.dto.InventoryCoinsDto(i.itemCode,SUM(i.totalQuantity),i.stdWeight,(i.totalWeight/i.totalQuantity), i.weightUnit, MAX(i.totalWeightDetails), MAX(i.stdValue), i.binGroupCode, i.binCode) \r\n"
			+ " FROM InventoryDetailsDao i \r\n"
			+ " WHERE i.locationCode=:locationCode \r\n"
			+ " AND (:itemCode IS NULL OR i.itemCode = :itemCode) \r\n"
			+ " AND (i.productGroup=:coinProductGroupCode OR i.productGroup=:silverCoinProductGroupCode) \r\n"
			+ " AND ("
			+ "		(:withSaleableCheck = false) "
			+ "		 OR "
			+ "     (:withSaleableCheck = true AND (i.binGroupCode IN (:binGroupCode) OR (i.binGroupCode = '" + CommonConstants.TEP_BIN_CODE + "' AND i.binCode = '" + CommonConstants.TEP_SALE_BIN_CODE + "')))"
			+ ") \r\n"
			+ " AND i.totalQuantity > 0 \r\n"
			+ " AND (:isHallmarked IS NULL OR i.isHallmarked = :isHallmarked) \r\n"
			+ " AND ("
			+ "      (:excludeGrams IS NULL AND (:isHallmarked IS NULL OR i.isHallmarked = :isHallmarked)) \r\n"
			+ "      OR \r\n"
			+ "      (i.totalWeight/i.totalQuantity > :excludeGrams AND i.isHallmarked = :isHallmarked) \r\n"
			+ "      OR \r\n"
			+ "      (i.totalWeight/i.totalQuantity <= :excludeGrams) \r\n" //to take items equal or below exclude grams even if not hallmarked.
			+ "     ) \r\n"
			+ " GROUP BY i.itemCode, i.stdWeight, (i.totalWeight/i.totalQuantity), i.weightUnit, i.binGroupCode, i.binCode \r\n"
			+ " ORDER BY SUM(i.totalQuantity)")
	// @formatter:on
	List<InventoryCoinsDto> findByProductGroupAndLocationCode(@Param("locationCode") String locationCode,
			@Param("itemCode") String itemCode, @Param("coinProductGroupCode") String coinProductGroupCode,
			@Param("silverCoinProductGroupCode") String silverCoinProductGroupCode,
			@Param("binGroupCode") List<String> binGroupCodeList, @Param("withSaleableCheck") Boolean withSaleableCheck,
			@Param("isHallmarked") Boolean isHallmarked, @Param("excludeGrams") BigDecimal excludeGrams);

	InventoryDetailsDao findByIdAndLocationCode(String inventoryId, String locationCode);

	/**
	 * @param locationCode
	 * @param itemCode
	 * @param lotNumber
	 * @return Top one InventoryDetailsDao
	 */

	@Query("select m from InventoryDetailsDao m where (m.locationCode=:locationCode and m.itemCode=:itemCode and m.lotNumber=:lotNumber and m.totalQuantity !=0) order by m.totalQuantity ASC")
	InventoryDetailsDao findTopByLocationCodeAndItemCodeAndLotNumber(@Param("locationCode") String locationCode,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber);
	
	// @formatter:off
		@Query("SELECT new com.titan.poss.engine.dto.response.InventoryFocItemDto(m.itemCode,m.lotNumber,SUM(m.totalQuantity),m.stdWeight,(m.totalWeight/m.totalQuantity), m.weightUnit, MAX(m.totalWeightDetails), MAX(m.stdValue), m.binGroupCode, m.binCode) from InventoryDetailsDao m where (m.locationCode=:locationCode and m.binGroupCode IN :binGroupCode "
				+ "and m.binCode IN :binCode and m.itemCode IN :itemCodeList and m.totalQuantity > :totalQuantity "
				+ "and "
				+ "(:totalWeight IS NULL or m.totalWeight <= :totalWeight) and  "
				+ "(:totalValue IS NULL or m.totalValue <= :totalValue)) GROUP BY m.itemCode,m.lotNumber, m.stdWeight, (m.totalWeight/m.totalQuantity), m.weightUnit, m.binGroupCode, m.binCode " 
				+ " ORDER BY SUM(m.totalQuantity)")
		// @formatter:on
		Page<InventoryFocItemDto> findAllLocationCodeAndBinGroupCodeAndBinCodeAndItemCodeInAndTotalQuantityGreaterThanAndTotalWeightLessThanEqualAndTotalValueLessThanEqual(
				@Param("locationCode") String locationCode, @Param("binGroupCode") List<String> binGroupCode,
				@Param("binCode") List<String> binCode, @Param("itemCodeList") List<String> itemCodeList,
				@Param("totalQuantity") Short totalQuantity, @Param("totalWeight") BigDecimal totalWeight,
				@Param("totalValue") BigDecimal totalValue, Pageable pageable);


	/**
	 * This method will get one inventory detail by item code.
	 * 
	 * @param itemCode
	 * @param locationCode
	 * @return InventoryDetailsDao
	 */
	InventoryDetailsDao findTopByItemCodeAndLocationCode(String itemCode, String locationCode);

	/**
	 * @param inventoryId
	 * @param locationCode
	 * @param totalQuantity
	 * @return
	 */
	InventoryDetailsDao findByIdAndLocationCodeAndTotalQuantityGreaterThan(String inventoryId, String locationCode,
			Short totalQuantity);

}