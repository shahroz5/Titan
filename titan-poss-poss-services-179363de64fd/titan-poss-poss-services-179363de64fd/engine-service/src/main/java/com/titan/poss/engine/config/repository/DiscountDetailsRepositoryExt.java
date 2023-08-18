/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDetailsDao;
import com.titan.poss.config.repository.DiscountDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineConfigDiscountDetailsRepository")
public interface DiscountDetailsRepositoryExt extends DiscountDetailsRepository {

	@Query("Select dd from ConfigDiscountDetailsDao dd, DiscountProductGroupMappingDao dpgm where dd.discount.id = dpgm.discount.id "
			+ " AND dd.id = dpgm.discountDetail.id AND "
			+ " dd.discount.id = :discountId AND dd.isActive = 1 AND dpgm.isActive = 1 AND dpgm.productGroupCode = :productGroupCode ")
	DiscountDetailsDao getDiscountComponent(@Param("discountId") String discountId,
			@Param("productGroupCode") String productGroupCode);

	@Query("Select dd from ConfigDiscountDetailsDao dd, DiscountProductGroupMappingDao dpgm where dd.discount.id = dpgm.discount.id "
			+ " AND dd.discount.id = :discountId AND dd.isActive = 1 AND dpgm.isActive = 1 AND dpgm.productGroupCode = :productGroupCode ")
	List<DiscountDetailsDao> getDiscountDetails(@Param("discountId") String discountId,
			@Param("productGroupCode") String productGroupCode);

	/**
	 * @param slabDiscountIds
	 * @return
	 */
	@Query("Select dd from ConfigDiscountDetailsDao dd where dd.discount.id  IN (:slabDiscountIds) AND dd.isActive = 1 ")
	List<DiscountDetailsDao> getSlabDetails(@Param("slabDiscountIds") List<String> slabDiscountIds);

	@Query(value = "SELECT COALESCE(sum(dd.discount_value) ,0) from sales.dbo.sales_transaction st "
			+ "inner join sales.dbo.discount_details_sales dd on st.id = dd.sales_txn_id "
			+ "where st.txn_type ='CM' and st.location_code = :locationCode and st.status ='CONFIRMED' and st.doc_date BETWEEN :quarterStartDate and :quarterEndDate "
			+ "and dd.discount_type = :discountType", nativeQuery = true)
	BigDecimal getMaxDiscountForCurrentQuarter(@Param("quarterStartDate") Date quarterStartDate,
			@Param("quarterEndDate") Date quarterEndDate, @Param("discountType") String discountType,
			@Param("locationCode") String locationCode);

	@Query(value = "SELECT min(min_value) from configs.dbo.discount_details where discount_id=:discountId AND is_active = 1", nativeQuery = true)
	BigDecimal getMinSlabValue(@Param("discountId") String discountId);
}
