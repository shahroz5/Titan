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

import com.titan.poss.config.dao.FocSchemeDetailsDaoExt;
import com.titan.poss.config.dao.FocSchemeMasterDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface FocSchemeDetailsRepositoryExt extends JpaRepository<FocSchemeDetailsDaoExt, String> {

	/**
	 * @param focSchemeDetailIdRemove
	 * @return
	 */
	@Query("SELECT c FROM FocSchemeDetailsDaoExt c WHERE c.id IN (:schemeDetailIdRemove)")
	List<FocSchemeDetailsDaoExt> findAllBySchemeDetailId(
			@Param("schemeDetailIdRemove") List<String> schemeDetailIdRemove);

	/**
	 * @param id
	 * @return
	 */
	@Query("SELECT c FROM FocSchemeDetailsDaoExt c WHERE c.focSchemeMasterDao.id = :id")
	List<FocSchemeDetailsDaoExt> findBySchemeId(@Param("id") String id);

	/**
	 * @param id
	 * @param schemeId
	 * @return
	 */
	// @formatter:off
	@Query(nativeQuery = true, value = "select fds.id,fds.category, fds.item_type, fds.offer_type,"
			+ "fds.foc_eligibility,fds.item_code,fds.is_multiple,"
			+ "fds.multiply_factor, fds.from_sale_value,fds.to_sale_value,fds.weight,fds.quantity,"
			+ "fds.row_id,fds.karat,fds.is_single,fds.is_active ,t1.productGroupCount from foc_scheme_details fds left join "
			+ "(select count(sd.id) as productGroupCount,sd.id from foc_scheme_details sd inner join foc_scheme_product_mapping fd \r\n"
			+ "on sd.id = fd.scheme_details_id where sd.scheme_id = :id Group By sd.id)  t1 on fds.id = t1.id "
			+ "where fds.id IN (select distinct(fsdm.id) from foc_scheme_details fsdm "
			+ "Left Join foc_scheme_product_mapping fsp on fsdm.id = fsp.scheme_details_id where  "
			+ " (fsdm.item_type = (:itemType) OR  nullif(CHOOSE(1,:itemType),'') IS NULL ) AND "
			+ "(fsdm.category = (:category) OR  nullif(CHOOSE(1,:category),'') IS NULL) AND "
			+ "(fsdm.offer_type = (:offerType) OR  nullif(CHOOSE(1,:offerType),'') IS NULL ) AND "
			+ "(fsp.product_group_code = (:productGroupCode) OR  nullif(CHOOSE(1,:productGroupCode),'') IS NULL ) "
			+ "AND fsdm.scheme_id = :id) "
			, 
			countQuery = "select fds.id,fds.category, fds.item_type, fds.offer_type," + 
					"fds.foc_eligibility,fds.item_code,fds.is_multiple,fds.multiply_factor, "
					+ "fds.from_sale_value,fds.to_sale_value,fds.weight,fds.quantity,fds.row_id,"
					+ "fds.karat,fds.is_single,fds.is_active ,t1.productGroupCount from foc_scheme_details fds left join "
					+ "(select count(sd.id) as productGroupCount,sd.id from foc_scheme_details sd inner join foc_scheme_product_mapping fd " 
					+ "on sd.id = fd.scheme_details_id where sd.scheme_id = :id Group By sd.id)  t1 on fds.id = t1.id "
					+"where fds.id IN (select  distinct(fsdm.id) from foc_scheme_details fsdm "
					+"Left Join foc_scheme_product_mapping fsp on fsdm.id = fsp.scheme_details_id where "
					+ " (fsdm.item_type = (:itemType) OR  nullif(CHOOSE(1,:itemType),'') IS NULL ) AND "
					+ "(fsdm.category = (:category) OR  nullif(CHOOSE(1,:category),'') IS NULL) AND "
					+ "(fsdm.offer_type = (:offerType) OR  nullif(CHOOSE(1,:offerType),'') IS NULL ) AND "
					+ "(fsp.product_group_code = (:productGroupCode) OR  nullif(CHOOSE(1,:productGroupCode),'') IS NULL ) "
					+ "AND fsdm.scheme_id = :id) ")
		// @formatter:on
	Page<Object[]> findAllBasedOnFilters(@Param("id") String id, @Param("category") String category,
			@Param("itemType") String itemType, @Param("offerType") String offerType,
			@Param("productGroupCode") String productGroupCode, Pageable pageable);

	@Query("SELECT c FROM FocSchemeDetailsDaoExt c WHERE c.focSchemeMasterDao.id = :id AND c.offerType = :offerType")
	List<FocSchemeDetailsDaoExt> findBySchemeIdAndOfferType(@Param("id") String id,
			@Param("offerType") String offerType);

	/**
	 * @param focSchemeMasterDaoExt
	 * @return
	 */
	List<FocSchemeDetailsDaoExt> findAllByFocSchemeMasterDao(FocSchemeMasterDaoExt focSchemeMasterDaoExt);
}
