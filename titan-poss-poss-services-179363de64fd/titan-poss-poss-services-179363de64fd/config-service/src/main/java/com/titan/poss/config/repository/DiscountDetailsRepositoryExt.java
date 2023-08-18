/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDaoExt;
import com.titan.poss.config.dao.DiscountDetailsDao;
import com.titan.poss.config.dao.DiscountDetailsDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface DiscountDetailsRepositoryExt extends JpaRepository<DiscountDetailsDaoExt, String> {

	// @formatter:off
	@Query(nativeQuery = true, value = "select fds.id,fds.discount_id, fds.min_value,"
			+ "fds.max_value,fds.slab_name,fds.discount_category,fds.eligibility_details, "
			+ "fds.regular_config_details,fds.preview_config_details,fds.ab_config_details,fds.co_config_details,fds.row_id,"
			+ "fds.is_single,fds.is_active ,t1.productGroupCount,fds.discount_percent,fds.config_details, fds.created_date,fds.rivaah_config_details from discount_details fds left join "
			+ "(select count(fd.product_group_code) as productGroupCount,sd.id from discount_details sd inner join discount_product_group_mapping fd "
			+ "on sd.id = fd.discount_detail_id where sd.discount_id = :discountId Group By sd.id)  t1 on fds.id = t1.id "
			+ " where  fds.id IN (select  distinct(fsdm.id) from discount_details fsdm "
			+ "Left Join discount_product_group_mapping fsp on fsdm.id = fsp.discount_detail_id where "
			+ "(fsp.product_group_code IN (:productGroupCodes) OR  nullif(CHOOSE(1,:productGroupCodes),'') IS NULL )"
			+ " AND (fsdm.discount_category = (:category) OR  nullif(CHOOSE(1,:category),'') IS NULL )"
			+ " AND fsdm.discount_id = :discountId )", countQuery = "select fds.id,fds.discount_id,fds.min_value,"
					+ "fds.max_value,fds.slab_name,fds.discount_category,fds.eligibility_details, "
					+ "fds.regular_config_details,fds.preview_config_details,fds.ab_config_details,fds.co_config_details,fds.row_id,"
					+ "fds.is_single,fds.is_active ,t1.productGroupCount from discount_details fds left join "
					+ "(select count(fd.product_group_code) as productGroupCount,sd.id from discount_details sd inner join discount_product_group_mapping fd "
					+ "on sd.id = fd.discount_detail_id where sd.discount_id = :discountId Group By sd.id)  t1 on fds.id = t1.id "
					+ "where fds.id IN (select  distinct(fsdm.id) from discount_details fsdm "
					+ "Left Join discount_product_group_mapping fsp on fsdm.id = fsp.discount_detail_id where "
					+ "(fsp.product_group_code IN (:productGroupCodes) OR  nullif(CHOOSE(1,:productGroupCodes),'') IS NULL )"
					+ " AND (fsdm.discount_category = (:category) OR  nullif(CHOOSE(1,:category),'') IS NULL )"
					+ " AND fsdm.discount_id = :discountId )")
	// @formatter:on
	Page<Object[]> findAllBasedOnFilters(@Param("discountId") String discountId, @Param("category") String category,
			@Param("productGroupCodes") List<String> productGroupCodes, Pageable pageable);

	/**
	 * @param discountDaoExt
	 * @return
	 */
	List<DiscountDetailsDaoExt> findAllByDiscount(DiscountDaoExt discountDaoExt);

	@Query("Select dd from DiscountDetailsDaoExt dd where dd.discount.id = :id AND dd.isActive = 1 AND (((:minValue BETWEEN  dd.minValue AND dd.maxValue) OR (:maxValue BETWEEN  dd.minValue AND dd.maxValue) ) OR ((dd.minValue BETWEEN :minValue AND :maxValue) OR (dd.maxValue BETWEEN :minValue AND :maxValue)))")
	List<DiscountDetailsDaoExt> checkIfSlabExist(@Param("minValue")BigDecimal minValue, @Param("maxValue")BigDecimal maxValue, @Param("id")String id);
}
