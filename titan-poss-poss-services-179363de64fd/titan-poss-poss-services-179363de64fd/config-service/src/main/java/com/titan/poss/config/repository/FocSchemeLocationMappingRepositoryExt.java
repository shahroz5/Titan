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
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeLocationMappingDaoExt;
import com.titan.poss.config.dao.FocSchemeMasterDaoExt;
import com.titan.poss.config.dto.FocLocationLiteDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface FocSchemeLocationMappingRepositoryExt extends JpaRepository<FocSchemeLocationMappingDaoExt, String> {

	/**
	 * @param locationCode
	 * @param startDate
	 * @param endDate
	 * @param id
	 * @return
	 */
	@Query("select count(*) from FocSchemeLocationMappingDaoExt c where c.focSchemeMasterDao.id = :id and c.locationCode = :locationCode \r\n"
			+ "AND ((:startDate between c.startDate and c.endDate \r\n"
			+ "or :endDate between c.startDate and c.endDate) or (c.startDate between :startDate and :endDate or c.endDate between :startDate and :endDate ))")

	int ifExist(@Param("locationCode") String locationCode, @Param("startDate") Date startDate,
			@Param("endDate") Date endDate, @Param("id") String id);

	/**
	 * @param id
	 * @param pageable
	 * @return
	 */
	@Query("SELECT c FROM FocSchemeLocationMappingDaoExt c WHERE (:locationCode IS NULL OR c.locationCode = :locationCode) AND c.focSchemeMasterDao.id = :id")
	Page<FocSchemeLocationMappingDaoExt> findAllBySchemeId(@Param("locationCode") String locationCode,
			@Param("id") String id, Pageable pageable);

	/**
	 * @param locationId
	 * @param id
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	@Query("select count(*) from FocSchemeLocationMappingDaoExt c where c.focSchemeMasterDao.id != :schemeId and c.locationCode = "
			+ "(select c.locationCode from FocSchemeLocationMappingDaoExt c where c.id  = :locationId ) \r\n"
			+ " AND c.isActive = 1 AND c.focSchemeMasterDao.isActive = 1 AND c.focSchemeMasterDao.manualFoc=0 AND c.id != :locationId AND ((:startDate between c.startDate and c.endDate \r\n"
			+ "or :endDate between c.startDate and c.endDate) or (c.startDate between :startDate and :endDate or c.endDate between :startDate and :endDate ))")
	int ifLocationExist(@Param("locationId") String locationId, @Param("schemeId") String schemeId,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate);

	/**
	 * @param locationId
	 * @param id
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	@Query("select count(*) from FocSchemeLocationMappingDaoExt c where c.focSchemeMasterDao.id = :schemeId and c.locationCode = "
			+ "(select c.locationCode from FocSchemeLocationMappingDaoExt c where c.id  = :locationId ) \r\n"
			+ " AND c.isActive = 1 AND c.id != :locationId AND ((:startDate between c.startDate and c.endDate \r\n"
			+ "or :endDate between c.startDate and c.endDate) or (c.startDate between :startDate and :endDate or c.endDate between :startDate and :endDate ))")
	int ifLocationUpdateExist(@Param("locationId") String locationId, @Param("schemeId") String schemeId,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate);

	/**
	 * @param removeLocations
	 */
	List<FocSchemeLocationMappingDaoExt> findByIdIn(Set<String> removeLocations);

	/**
	 * @param schemeId
	 * @param addLocations
	 * @param startDate
	 * @param endDate
	 */

	@Query("select new com.titan.poss.config.dto.FocLocationLiteDto (flm.focSchemeMasterDao.id, sm.name, flm.locationCode) "
			+ "from FocSchemeLocationMappingDaoExt flm  "
			+ "inner join FocSchemeMasterDaoExt sm on flm.focSchemeMasterDao.id = sm.id \r\n"	
			+ "where sm.manualFoc = :isManualFoc AND \r\n"
			+ "((:startDate between flm.startDate and flm.endDate or :endDate between flm.startDate and flm.endDate) or (flm.startDate between :startDate and :endDate or flm.endDate between :startDate and :endDate ))\r\n"
			+ "AND flm.isActive = 1 AND sm.isActive = 1 AND flm.focSchemeMasterDao.id != :schemeId \r\n"
			+ "AND flm.locationCode IN (:addLocations) AND flm.focSchemeMasterDao.id IN "
			+ "(select distinct(fsp.focSchemeMasterDao.id)from FocSchemeProductMappingDao fsp "
			+ "where fsp.focSchemeMasterDao.id != :schemeId and fsp.focSchemeMasterDao.isActive = 1 )")
	List<FocLocationLiteDto> checkMappedScheme(@Param("schemeId") String schemeId,
			@Param("addLocations") Set<String> addLocations, @Param("startDate") Date startDate,
			@Param("endDate") Date endDate,@Param("isManualFoc")Boolean isManualFoc);

	/**
	 * @param focSchemeMasterDaoExt
	 * @return
	 */
	List<FocSchemeLocationMappingDaoExt> findAllByFocSchemeMasterDao(FocSchemeMasterDaoExt focSchemeMasterDaoExt);

	/**
	 * @param id
	 * @return
	 */
	@Query("select dlm1 from FocSchemeLocationMappingDaoExt dlm1 WHERE dlm1.focSchemeMasterDao.id = :id AND  dlm1.isActive = 1")
	List<FocSchemeLocationMappingDaoExt> checkLocationMapping(@Param("id") String id);

	/**
	 * @param id
	 * @param locationCodes
	 * @return
	 */
	@Query("select dlm1 from FocSchemeLocationMappingDaoExt dlm1 WHERE dlm1.focSchemeMasterDao.id != :id AND dlm1.locationCode IN (:locationCodes) AND dlm1.isActive = 1 AND dlm1.focSchemeMasterDao.isActive = 1")
	List<FocSchemeLocationMappingDaoExt> checkLocationMapping1(@Param("id") String id,
			@Param("locationCodes") List<String> locationCodes);

	/**
	 * @param schemeMasterId
	 * @param isActive
	 * @param locationcodes
	 * @return
	 */
	List<FocSchemeLocationMappingDaoExt> findByFocSchemeMasterDaoIdAndIsActiveAndLocationCodeIn(String schemeMasterId,
			boolean isActive, Set<String> locationcodes);

	@Query("select new com.titan.poss.config.dto.FocLocationLiteDto (flm.focSchemeMasterDao.id, sm.name, flm.locationCode) "
			+ "from FocSchemeLocationMappingDaoExt flm  "
			+ "inner join FocSchemeMasterDaoExt sm on flm.focSchemeMasterDao.id = sm.id \r\n"
			+ "where flm.isActive = 1 AND sm.isActive = 1 AND flm.focSchemeMasterDao.id != :schemeId \r\n"
			+ "AND flm.mobileNo = :mobileNo AND flm.locationCode IN (:addLocations) AND flm.focSchemeMasterDao.id IN "
			+ "(select distinct(fsp.focSchemeMasterDao.id)from FocSchemeProductMappingDao fsp "
			+ "where fsp.focSchemeMasterDao.id != :schemeId and fsp.focSchemeMasterDao.isActive = 1  and fsp.productGroupCode IN "
			+ " (select distinct(fspm.productGroupCode)from FocSchemeProductMappingDao fspm where fspm.focSchemeMasterDao.id = :schemeId))")
	List<FocLocationLiteDto> checkMappedSchemeForCustomer(@Param("schemeId") String schemeId,
			@Param("addLocations") Set<String> addLocations, @Param("mobileNo") String mobileNo);

	/**
	 * @param locationCode
	 * @param mobileNo
	 * @param id
	 * @return
	 */
	@Query("select count(*) from FocSchemeLocationMappingDaoExt c where c.focSchemeMasterDao.id = :id and c.locationCode = :locationCode \r\n"
			+ "AND c.mobileNo = :mobileNo")
	int ifCustomerExist(@Param("locationCode") String locationCode, @Param("id") String id,
			@Param("mobileNo") String mobileNo);
	
	@Query("select count(*) from FocSchemeLocationMappingDaoExt c where c.focSchemeMasterDao.id = :schemeId and c.locationCode = "
			+ "(select c.locationCode from FocSchemeLocationMappingDaoExt c where c.id  = :locationId ) \r\n"
			+ " AND c.isActive = 1 AND c.id != :locationId AND c.mobileNo = :mobileNo")
	int ifCustomerLocationUpdateExist(@Param("locationId") String locationId, @Param("schemeId") String schemeId,@Param("mobileNo") String mobileNo);
	
}
