/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeLocationMappingDaoExt;
import com.titan.poss.config.dao.FocSchemeMasterDaoExt;
import com.titan.poss.config.dao.FocSchemeProductMappingDaoExt;
import com.titan.poss.config.dto.FocSchemeProductLiteDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface FocSchemeProductMappingRepositoryExt extends JpaRepository<FocSchemeProductMappingDaoExt, String> {

	/**
	 * @param productRemove
	 * @return
	 */
	List<FocSchemeProductMappingDaoExt> findAllByProductGroupCode(List<String> productRemove);

	/**
	 * @param schemeMasterId
	 * @param schemedetailsId
	 * @param productGroupList
	 */

	@Query("Select new com.titan.poss.config.dto.FocSchemeProductLiteDto(fsm.id, fsm.name,fpm.productGroupCode)"
			+ " from FocSchemeProductMappingDaoExt fpm inner join FocSchemeMasterDao fsm "
			+ "on fsm.id = fpm.focSchemeMasterDao.id where fpm.productGroupCode IN (:productGroupList)"
			+ "AND fpm.focSchemeMasterDao.id != :schemeId AND fpm.focSchemeMasterDao.id IN "
			+ "(Select distinct(flm.focSchemeMasterDao.id) from FocSchemeLocationMappingDaoExt flm "
			+ "where flm.focSchemeMasterDao.id != :schemeId AND flm.locationCode "
			+ "IN (Select flm.locationCode from FocSchemeLocationMappingDaoExt flm where flm.focSchemeMasterDao.id = :schemeId))")
	List<FocSchemeProductLiteDto> checkMappedProductGroups(@Param("schemeId") String schemeMasterId,
			@Param("productGroupList") List<String> productGroupList);

	/**
	 * @param discountId
	 * @param productGroupList
	 * @param discountType
	 * @return
	 */

	@Query("Select dlm from FocSchemeProductMappingDaoExt dpm, FocSchemeLocationMappingDaoExt dlm, FocSchemeMasterDaoExt dm WHERE dm.id = dpm.focSchemeMasterDao.id AND dpm.focSchemeMasterDao.id = dlm.focSchemeMasterDao.id AND dpm.productGroupCode IN (:productGroupList)"
			+ " AND dm.isActive = 1 AND dpm.focSchemeMasterDao.id != :schemeMasterId AND dpm.focSchemeMasterDao.id IN "
			+ "(Select distinct(dlm.focSchemeMasterDao.id) from FocSchemeLocationMappingDaoExt dlm "
			+ "where dlm.focSchemeMasterDao.id != :schemeMasterId AND dlm.isActive = 1 AND dlm.locationCode "
			+ "IN (Select dlm.locationCode from FocSchemeLocationMappingDaoExt dlm where dlm.focSchemeMasterDao.id = :schemeMasterId and dlm.isActive = 1))")
	List<FocSchemeLocationMappingDaoExt> getMappedActiveLocations(@Param("schemeMasterId") String schemeMasterId,
			@Param("productGroupList") List<String> productGroupList);

	/**
	 * @param focSchemeMasterDaoExt
	 * @return
	 */
	List<FocSchemeProductMappingDaoExt> findAllByFocSchemeMasterDao(FocSchemeMasterDaoExt focSchemeMasterDaoExt);

	/**
	 * This method will return the parent Brand list based on the isActiveList.
	 * 
	 * @param isActiveList
	 * @param pageable
	 * @return Page<Brand>
	 */
	@Query("select r from FocSchemeProductMappingDaoExt r " + "where r.focSchemeMasterDao.id = :focSchemeMasterId "
			+ "AND ((r.focSchemeDetailsDao.id IS NULL AND :focSchemeDetailsId IS NULL) "
			+ "OR (r.focSchemeDetailsDao.id = :focSchemeDetailsId) ) AND (:category IS NULL OR :category = r.category) AND (:itemType IS NULL OR r.itemType = :itemType)")
	public Page<FocSchemeProductMappingDaoExt> findProductMapping(
			@Param("focSchemeDetailsId") String focSchemeDetailsId,
			@Param("focSchemeMasterId") String focSchemeMasterId, @Param("category") String category,@Param("itemType") String itemType,
			Pageable pageable);

	/**
	 * @param deleteSchemeDetails
	 * @return
	 */
	@Query("select r from FocSchemeProductMappingDaoExt r where r.focSchemeDetailsDao.id IN (:deleteSchemeDetails)")
	List<FocSchemeProductMappingDaoExt> getMappedProducts(
			@Param("deleteSchemeDetails") List<String> deleteSchemeDetails);
}
