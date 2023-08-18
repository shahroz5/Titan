/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountItemMappingDao;
import com.titan.poss.config.repository.DiscountItemMappingRepository;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("EngineDiscountItemMappingRepositoryExt")
public interface DiscountItemMappingRepositoryExt extends DiscountItemMappingRepository {

	@Query("select count(*) from DiscountItemMappingDaoExt c where c.discount.discountCode = :discountCode AND c.locationCode = :locationCode"
			+ " AND c.itemCode = :itemCode AND c.lotNumber = :lotNumber And c.isActive = :isActive AND (:startDate between c.startDate and c.endDate \r\n"
			+ "or :endDate between c.startDate and c.endDate)")
	int ifDiscountExist(@Param("discountCode") String discountCode, @Param("locationCode") String locationCode,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("isActive") Boolean isActive, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

	@Query("select c from DiscountItemMappingDao c where c.discount.id = :discountId AND c.locationCode = :locationCode"
			+ " AND c.itemCode = :itemCode AND c.lotNumber like %:lotNumber% And c.isActive = 1 AND (:businessDate between c.startDate and c.endDate)")
	DiscountItemMappingDao getDiscountComponentDetails(@Param("discountId") String discountId,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("businessDate") Date businessDate);

	@Query("select c from DiscountItemMappingDao c where c.discount.id = :discountId AND c.locationCode = :locationCode"
			+ " AND c.itemCode = :itemCode AND c.lotNumber = :lotNumber And c.isActive = 1 AND (:businessDate between c.startDate and DATEADD(day, :configuration,c.endDate))")
	DiscountItemMappingDao getDiscountComponentDetailsWithDate(@Param("discountId") String discountId,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("locationCode") String locationCode, @Param("businessDate") Date businessDate,
			@Param("configuration") Integer configuration);

	@Query("select c from DiscountItemMappingDao c where  c.itemCode = :itemCode AND c.lotNumber = :lotNumber And c.locationCode = :locationCode")	
	List<DiscountItemMappingDao> getDiscountItemMappingDetails(@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber, @Param("locationCode") String locationCode);

	@Query("select c from DiscountItemMappingDao c where  c.itemCode = :itemCode AND c.lotNumber = :lotNumber And c.discount.id = :discountId")	
	DiscountItemMappingDao getDiscountDetails(@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber, @Param("discountId") String discountId);
	
}
