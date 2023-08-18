/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.config.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeDetailsDao;
import com.titan.poss.config.repository.FocSchemeDetailsRepository;

@Repository
public interface FocSchemeDetailsRepositoryExt extends FocSchemeDetailsRepository {

	/**
	 * @param keySet
	 */

	@Query("Select f from FocSchemeDetailsDao f where f.isActive = 1 AND f.id IN (:schemeDetailIds)")
	List<FocSchemeDetailsDao> findByIdIn(@Param("schemeDetailIds") Set<String> schemeDetailIds);

	Set<FocSchemeDetailsDao> findAllByFocSchemeMasterDaoIdAndIsActiveTrue(String schemeId);

	@Query("Select f from FocSchemeDetailsDao f where f.isActive = :true1 AND f.focSchemeMasterDao.id = :id")
	List<FocSchemeDetailsDao> findAllByFocSchemeMasterDaoIdAndIsActive(@Param("id") String id,
			@Param("true1") Boolean true1);

	@Query("Select f FROM FocSchemeDetailsDao f WHERE f.id IN ( "
			+ "Select focSchemeDetailsDao.id FROM FocSchemeProductMappingDao WHERE f.focSchemeMasterDao.id = :id"
			+ " AND productGroupCode = :productGroup)")
	List<FocSchemeDetailsDao> findFocSchemeDetailsByProductGroup(@Param("id") String id,
			@Param("productGroup") String productGroup);

	@Query("Select f from FocSchemeDetailsDao f where f.isActive = 1 AND f.focSchemeMasterDao.id IN (:schemeIds)")
	List<FocSchemeDetailsDao> findBySchemeIdIn(@Param("schemeIds") Set<String> schemeIds);

	@Query("Select f from FocSchemeDetailsDao f ,FocSchemeProductMappingDao fpm where f.focSchemeMasterDao.id = fpm.focSchemeMasterDao.id "
			+ " AND f.category = fpm.category AND f.itemType = fpm.itemType AND  f.isActive = 1 AND "
			+ "f.offerType = :slabBased AND f.focSchemeMasterDao.id IN (:schemeIds) AND fpm.productGroupCode IN (:productGroupList)")
	List<FocSchemeDetailsDao> findBySchemeIdInForSlabBased(@Param("slabBased") String slabBased,
			@Param("schemeIds") Set<String> schemeIds, @Param("productGroupList") Set<String> set);
	
	@Query("select weight from FocSchemeDetailsDao where id=:id")
	BigDecimal findWt(@Param("id") String id);

	
	

}
