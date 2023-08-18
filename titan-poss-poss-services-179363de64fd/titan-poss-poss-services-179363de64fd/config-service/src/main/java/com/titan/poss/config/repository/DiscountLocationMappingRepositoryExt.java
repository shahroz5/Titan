/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountDaoExt;
import com.titan.poss.config.dao.DiscountLocationMappingDaoExt;
import com.titan.poss.config.dto.DiscountLocProductGroupDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface DiscountLocationMappingRepositoryExt extends JpaRepository<DiscountLocationMappingDaoExt, String> {

	@Modifying
	@Query("SELECT d FROM DiscountLocationMappingDaoExt d WHERE d.discount = :discountCode AND d.locationCode IN (:locationList)")
	List<DiscountLocationMappingDaoExt> getDiscountLocationMapping(@Param("discountCode") DiscountDao discountCode,
			@Param("locationList") List<String> locationList);

	/**
	 * @param id
	 * @param locationId
	 * @param offerStartDate
	 * @param offerEndDate
	 * @return
	 */
	@Query("select count(*) from DiscountLocationMappingDaoExt c where c.discount.id = :id and c.locationCode = "
			+ "(select c.locationCode from DiscountLocationMappingDaoExt c where c.id  = :locationId) \r\n"
			+ " AND c.id != :locationId AND c.isActive = 1 AND ((:offerStartDate between c.offerStartDate and c.offerEndDate \r\n"
			+ "or :offerEndDate between c.offerStartDate and c.offerEndDate) OR (c.offerStartDate between :offerStartDate and :offerEndDate or c.offerEndDate between :offerStartDate and :offerEndDate))")
	int ifUpdateExists(@Param("id") String id, @Param("locationId") String locationId,
			@Param("offerStartDate") Date offerStartDate, @Param("offerEndDate") Date offerEndDate);

	/**
	 * @param id
	 * @param offerStartDate
	 * @param offerEndDate
	 * @param locationCode
	 * @return
	 */
	@Query("select count(*) from DiscountLocationMappingDaoExt c where c.discount.id = :id and c.locationCode = :locationCode \r\n"
			+ "AND ((:offerStartDate between c.offerStartDate and c.offerEndDate \r\n"
			+ "or :offerEndDate between c.offerStartDate and c.offerEndDate) OR (c.offerStartDate between :offerStartDate and :offerEndDate or c.offerEndDate between :offerStartDate and :offerEndDate))")
	int ifExists(@Param("id") String id, @Param("offerStartDate") Date offerStartDate,
			@Param("offerEndDate") Date offerEndDate, @Param("locationCode") String locationCode);

	/**
	 * @param discountDaoExt
	 * @return
	 */
	List<DiscountLocationMappingDaoExt> findAllByDiscount(DiscountDaoExt discountDaoExt);

	/**
	 * @param discountId
	 * @param locationCode
	 * @param status
	 * @param offerStartDate
	 * @param offerEndDate
	 * @param previewStartDate
	 * @param previewEndDate
	 * @param pageable
	 * @return
	 */
	@Query("SELECT d FROM DiscountLocationMappingDaoExt d WHERE d.discount.id = :discountId AND "
			+ "(nullif(CHOOSE(1,:locationCodes),'') IS NULL OR d.locationCode in (:locationCodes)) "
			+ "AND (:status IS NULL OR :status = d.isActive) AND ((:offerStartDate IS NULL OR :offerStartDate = d.offerStartDate) and (:offerEndDate IS NULL OR :offerEndDate = d.offerEndDate)) "
			+ "AND((:previewStartDate IS NULL OR :previewStartDate = d.previewStartDate) and (:previewEndDate IS NULL OR :previewEndDate = d.previewEndDate))")
	Page<DiscountLocationMappingDaoExt> getDiscountLocations(@Param("discountId") String discountId,
			@Param("locationCodes") List<String> locationCodes, @Param("status") Boolean status,
			@Param("offerStartDate") Date offerStartDate, @Param("offerEndDate") Date offerEndDate,
			@Param("previewStartDate") Date previewStartDate, @Param("previewEndDate") Date previewEndDate,
			Pageable pageable);

	/**
	 * 
	 * Checking Duplicate entry for the combination of (CFA, Location, Start & end
	 * Date) for the discount Types Slab & High Value --> At location mapping level
	 * w.r.t location
	 * 
	 * @param discountId
	 * @param addLocations
	 * @param offerStartDate
	 * @param offerEndDate
	 * @param discountType
	 * @return
	 */
	@Query("select new com.titan.poss.config.dto.DiscountLocProductGroupDto (d.discountCode, dlm.locationCode) FROM DiscountLocationMappingDaoExt dlm INNER JOIN DiscountDaoExt d ON dlm.discount.id = d.id WHERE ((:offerStartDate between dlm.offerStartDate and dlm.offerEndDate \r\n"
			+ "	or :offerEndDate between dlm.offerStartDate and dlm.offerEndDate) OR (dlm.offerStartDate between :offerStartDate and :offerEndDate or dlm.offerEndDate between :offerStartDate and :offerEndDate)) AND dlm.isActive = 1 AND d.isActive = 1 AND dlm.discount.id != :discountId AND dlm.discount.discountType =:discountType AND \r\n"
			+ "	dlm.locationCode IN (:addLocations) AND dlm.discount.id IN (select distinct(dpm.discount.id) FROM DiscountProductGroupMappingDaoExt dpm \r\n"
			+ "	WHERE dpm.discount.id != :discountId and dpm.discount.discountType =:discountType AND dpm.isActive = 1 and dpm.discount.isActive = 1 and dpm.productGroupCode IN (select distinct(dpm1.productGroupCode) from DiscountProductGroupMappingDaoExt dpm1 WHERE dpm1.discount.id = :discountId AND dpm1.isActive = 1 AND dpm1.discount.isActive = 1))")
	List<DiscountLocProductGroupDto> checkMappedDiscount(@Param("discountId") String discountId,
			@Param("addLocations") Set<String> addLocations, @Param("offerStartDate") Date offerStartDate,
			@Param("offerEndDate") Date offerEndDate, @Param("discountType") String discountType);

	/**
	 * 
	 * Checking while activating Location Mapping for Karatage / coin offer discount
	 * types
	 * 
	 * @param discountType
	 * @param locationCode
	 * @param offerStartDate
	 * @param offerEndDate
	 * @return
	 */
	@Query("select count(*) from DiscountLocationMappingDaoExt c where c.discount.discountType = :discountType and c.locationCode = "
			+ "(select c.locationCode from DiscountLocationMappingDaoExt c where c.id  = :locationId) \r\n"
			+ " AND c.id != :locationId AND ((:offerStartDate between c.offerStartDate and c.offerEndDate \r\n"
			+ "or :offerEndDate between c.offerStartDate and c.offerEndDate) OR (c.offerStartDate between :offerStartDate and :offerEndDate or c.offerEndDate between :offerStartDate and :offerEndDate))AND c.isActive = 1 AND c.discount.isActive =1")
	int ifDiscountExists(@Param("discountType") String discountType, @Param("locationId") String locationId,
			@Param("offerStartDate") Date offerStartDate, @Param("offerEndDate") Date offerEndDate);

	@Query("select c from DiscountLocationMappingDaoExt c where c.discount.discountType = :discountType and c.locationCode = "
			+ "(select c.locationCode from DiscountLocationMappingDaoExt c where c.id  = :locationId) \r\n"
			+ " AND c.id != :locationId AND ((:offerStartDate between c.offerStartDate and c.offerEndDate \r\n"
			+ "or :offerEndDate between c.offerStartDate and c.offerEndDate) OR (c.offerStartDate between :offerStartDate and :offerEndDate or c.offerEndDate between :offerStartDate and :offerEndDate))AND c.isActive = 1 AND c.discount.isActive =1")
	List<DiscountLocationMappingDaoExt> getDiscountLocationExists(@Param("discountType") String discountType,
			@Param("locationId") String locationId, @Param("offerStartDate") Date offerStartDate,
			@Param("offerEndDate") Date offerEndDate);

	/**
	 * 
	 * Checking while Adding New Location Mapping for Karatage / coin offer discount
	 * types
	 * 
	 * @param discountId
	 * @param addLocations
	 * @param offerStartDate
	 * @param offerEndDate
	 * @param discountType
	 * @return
	 */
	@Query("select new com.titan.poss.config.dto.DiscountLocProductGroupDto (d.discountCode, dlm.locationCode) FROM DiscountLocationMappingDaoExt dlm INNER JOIN DiscountDaoExt d ON dlm.discount.id = d.id WHERE ((:offerStartDate between dlm.offerStartDate and dlm.offerEndDate \r\n"
			+ "	or :offerEndDate between dlm.offerStartDate and dlm.offerEndDate) OR (dlm.offerStartDate between :offerStartDate and :offerEndDate or dlm.offerEndDate between :offerStartDate and :offerEndDate) ) AND dlm.isActive = 1 AND d.isActive = 1 AND dlm.discount.id != :discountId AND dlm.discount.discountType =:discountType AND \r\n"
			+ "	dlm.locationCode IN (:addLocations) ")
	List<DiscountLocProductGroupDto> checkDiscountExsitsOrNot(@Param("discountId") String discountId,
			@Param("addLocations") Set<String> addLocations, @Param("offerStartDate") Date offerStartDate,
			@Param("offerEndDate") Date offerEndDate, @Param("discountType") String discountType);


	/**
	 * 
	 * Checking while activating the discount header of Karatage / coin offer
	 * discount types
	 * 
	 * @param discountType
	 * @param id
	 * @return
	 */
	@Query("select dlm1 from DiscountLocationMappingDaoExt dlm1 WHERE dlm1.discount.id = :id AND dlm1.discount.discountType = :discountType AND  dlm1.isActive = 1")
	List<DiscountLocationMappingDaoExt> checkLocationMapping(@Param("discountType") String discountType,
			@Param("id") String id);

	/**
	 * @param discountType
	 * @param id
	 * @param locationCodes
	 * @return
	 */
	@Query("select dlm1 from DiscountLocationMappingDaoExt dlm1 WHERE dlm1.discount.id != :id AND dlm1.locationCode IN (:locationCodes) AND dlm1.discount.discountType = :discountType AND  dlm1.isActive = 1")
	List<DiscountLocationMappingDaoExt> checkLocationMapping1(@Param("discountType") String discountType,
			@Param("id") String id, @Param("locationCodes") List<String> locationCodes);


	/**
	 * @param discountId
	 * @param isActive
	 * @param locationcodes
	 * @return
	 */
	List<DiscountLocationMappingDaoExt> findByDiscountIdAndIsActiveAndLocationCodeIn(String discountId,
			Boolean isActive,
			Set<String> locationcodes);
}
