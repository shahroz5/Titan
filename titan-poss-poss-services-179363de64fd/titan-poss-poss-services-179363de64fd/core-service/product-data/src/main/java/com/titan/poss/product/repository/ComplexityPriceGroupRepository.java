/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ComplexityPriceGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface ComplexityPriceGroupRepository extends JpaRepository<ComplexityPriceGroupDao, String> {

	@Query("select c from ComplexityPriceGroupDao c where (c.complexity.complexityCode=:complexityCode and c.priceGroup.priceGroup=:priceGroup)")
	ComplexityPriceGroupDao findOneByComplexityCodeAndPriceGroup(@Param("complexityCode") String complexityCode,
			@Param("priceGroup") String priceGroup);
}
