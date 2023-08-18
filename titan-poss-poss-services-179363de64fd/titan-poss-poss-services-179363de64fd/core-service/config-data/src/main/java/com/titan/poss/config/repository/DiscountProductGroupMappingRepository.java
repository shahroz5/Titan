/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountProductGroupMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface DiscountProductGroupMappingRepository extends JpaRepository<DiscountProductGroupMappingDao, String> {

	@Query("SELECT d from DiscountProductGroupMappingDao d WHERE d.discount = :discountCode AND d.productGroupCode IN (:productGroupList)")
	List<DiscountProductGroupMappingDao> getProductGroupMapping(@Param("discountCode") DiscountDao discountCode,
			@Param("productGroupList") List<String> productGroupList);

	@Modifying
	@Query("DELETE DiscountProductGroupMappingDao d WHERE d.discount = :discountCode AND d.productGroupCode IN (:productGroupList)")
	void deleteProductGroupMapping(@Param("discountCode") DiscountDao discountCode,
			@Param("productGroupList") List<String> productGroupList);

}
