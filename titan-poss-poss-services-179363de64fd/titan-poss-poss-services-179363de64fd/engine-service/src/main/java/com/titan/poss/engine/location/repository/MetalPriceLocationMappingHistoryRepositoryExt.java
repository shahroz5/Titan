/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.location.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MetalPriceLocationHistoryDao;
import com.titan.poss.location.repository.MetalPriceLocationHistoryRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("engineMetalPriceLocationHistoryRepository")
public interface MetalPriceLocationMappingHistoryRepositoryExt extends MetalPriceLocationHistoryRepository {

	/**
	 * @param metalType
	 * @param applicableDate
	 * @param locationCode
	 */

	@Query("select m from MetalPriceLocationHistoryDao m where (" + "(m.location.locationCode=:locationCode) "
			+ " AND (:metalTypeCode IS NULL OR m.metalTypeCode = :metalTypeCode) "
			+ " AND (m.applicableDate= :applicableDate OR :applicableDate IS NULL) )")
	List<MetalPriceLocationHistoryDao> findByCombination(@Param("metalTypeCode") String metalType,
			@Param("applicableDate") Date applicableDate, @Param("locationCode") String locationCode);

	@Query(nativeQuery = true, value = "(select * from(SELECT mm.item_type_code as itemCode, mm.description as description, pm.offset as offset, pm.karat as karat, pm.purity as purity, "
			+ " mplh.metal_rate as metalRate, mplh.applicable_date as applicableDate, mplh.currency_code as currencyCode, mpc.price_type as priceType, mplh.created_date as createdDate,pm.is_active as pmIsActive ,mm.is_active as mmIsActive, mplh.metal_type_code as metalTypeCode, mplh.location_code as locationCode "
			+ " FROM " + "locations.dbo.metal_price_location_history  mplh " + "	LEFT JOIN "
			+ "products.dbo.item_type_master mm " + " ON mplh.metal_type_code = mm.item_type_code " + "	LEFT JOIN "
			+ "products.dbo.purity_master pm " + "	ON pm.item_type_code = mm.item_type_code" + " LEFT JOIN "
			+ "locations.dbo.metal_price_config mpc ON mplh.config_id = mpc.id) as result "
			+ " WHERE result.locationCode = :locationCode" + " AND result.applicableDate = :applicableDate"
			+ "	AND pmIsActive = 'true' AND mmIsActive = 'true'"
			+ " AND (:metalTypeCode IS NULL OR metalTypeCode = :metalTypeCode)" + "	AND offset = :offset) "
			+ " ORDER BY CASE WHEN  :sortParameter = 'createdDate ASC'  THEN createdDate END ASC, "
			+ "CASE WHEN  :sortParameter = 'createdDate DESC'  THEN createdDate END DESC,"
			+ "CASE WHEN  :sortParameter = 'NULL'  THEN createdDate END OFFSET :startOffset ROWS FETCH NEXT :size ROWS ONLY")
	List<Object[]> findByAllCombination(@Param("metalTypeCode") String metalType,
			@Param("applicableDate") String applicableDate, @Param("locationCode") String locationCode,
			@Param("offset") BigDecimal offset, @Param("sortParameter") String sortParameter,
			@Param("startOffset") int startOffset, @Param("size") int size);

	// @formatter:off
	@Query(nativeQuery = true, value = "(select * from(SELECT mm.item_type_code as itemCode, mm.description as description, pm.offset as offset, pm.karat as karat, pm.purity as purity, "
			+ " mplh.metal_rate as metalRate, mplh.applicable_date as applicableDate, mplh.currency_code as currencyCode, NULL as priceType, mplh.created_date as createdDate,pm.is_active as pmIsActive ,mm.is_active as mmIsActive, mplh.metal_type_code as metalTypeCode, mplh.location_code as locationCode "
			+ " FROM locations.dbo.metal_price_location_history  mplh " 
			+ "	LEFT JOIN products.dbo.item_type_master mm " 
			+ " 	ON mplh.metal_type_code = mm.item_type_code " 
			+ "	LEFT JOIN products.dbo.purity_master pm " 
			+ "		ON pm.item_type_code = mm.item_type_code) AS result "
			+ " WHERE result.locationCode = :locationCode" 
			+ " AND result.applicableDate = :applicableDate"
			+ "	AND pmIsActive = 'true' AND mmIsActive = 'true'"
			+ " AND (:metalTypeCode IS NULL OR metalTypeCode = :metalTypeCode) "
			+ " AND offset = :offset ) "
			+ " ORDER BY "
			+ "		CASE WHEN  :sortParameter = 'createdDate ASC' THEN createdDate END ASC, "
			+ " 	CASE WHEN  :sortParameter = 'createdDate DESC'  THEN createdDate END DESC,"
			+ " 	CASE WHEN  :sortParameter = 'NULL'  "
			+ "		THEN createdDate "
			+ " 	END "
			+ " OFFSET :startOffset ROWS FETCH NEXT :size ROWS ONLY")
	// @formatter:on
	List<Object[]> findByAllCombinationAtPoss(@Param("metalTypeCode") String metalType,
			@Param("applicableDate") String applicableDate, @Param("locationCode") String locationCode,
			@Param("offset") BigDecimal offset, @Param("sortParameter") String sortParameter,
			@Param("startOffset") int startOffset, @Param("size") int size);

}
