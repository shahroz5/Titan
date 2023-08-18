package com.titan.poss.engine.config.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeMasterDao;
import com.titan.poss.config.dao.FocSchemeProductMappingDao;
import com.titan.poss.config.repository.FocSchemeProductMappingRepository;

@Repository
public interface FocSchemeProductMappingRepositoryExt extends FocSchemeProductMappingRepository {

	/**
	 * @param schemeIdList
	 * @param set
	 * @return
	 */
	@Query("Select fpm from FocSchemeProductMappingDao fpm where fpm.focSchemeMasterDao.id IN (:schemeIdList) AND fpm.productGroupCode IN (:productGroupList)")
	List<FocSchemeProductMappingDao> getMappedProduct(@Param("schemeIdList") List<String> schemeIdList,
			@Param("productGroupList") Set<String> set);

	@Query("Select fpm from FocSchemeProductMappingDao fpm inner join FocSchemeDetailsDao fsd on "
			+ "fpm.focSchemeMasterDao.id = fsd.focSchemeMasterDao.id AND fpm.category = fsd.category AND fpm.itemType = fsd.itemType "
			+ "AND fpm.focSchemeMasterDao.id IN (:schemeIdList) AND fpm.productGroupCode IN (:productGroupList)")
	List<FocSchemeProductMappingDao> getMappedProductWrtCategoryAndItemType(
			@Param("schemeIdList") List<String> schemeIdList, @Param("productGroupList") Set<String> set);

	List<FocSchemeProductMappingDao> findAllByFocSchemeMasterDao(FocSchemeMasterDao focSchemeMasterDao);

	Set<FocSchemeProductMappingDao> findAllByFocSchemeMasterDaoId(String schemeId);
	
	@Query("Select f from FocSchemeProductMappingDao f where scheme_id IN (:schemeId)")
	List<FocSchemeProductMappingDao> findBySlabCategory(@Param("schemeId") Set<String> schemeId);

	/**
	 * @param schemeIdList
	 * @param keySet
	 * @return
	 */
	@Query("Select fpm from FocSchemeProductMappingDao fpm inner join FocSchemeDetailsDao fsd on "
			+ "fpm.focSchemeMasterDao.id = fsd.focSchemeMasterDao.id AND fpm.category = fsd.category AND fpm.itemType = fsd.itemType AND fpm.focSchemeDetailsDao.id = fsd.id "
			+ "AND fpm.focSchemeMasterDao.id IN (:schemeIdList) AND fpm.productGroupCode IN (:productGroupList)")
	List<FocSchemeProductMappingDao> getMappedProductWrtCategoryAndItemTypeDetailId(
			@Param("schemeIdList") List<String> schemeIdList, @Param("productGroupList") Set<String> set);
}
