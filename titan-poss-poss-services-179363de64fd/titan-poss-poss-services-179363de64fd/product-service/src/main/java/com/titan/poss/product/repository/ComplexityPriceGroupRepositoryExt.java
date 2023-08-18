/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.product.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.ComplexityPriceGroupDaoExt;
import com.titan.poss.product.dao.PriceGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("ProductComplexityPriceGroupRepositoryExt")
public interface ComplexityPriceGroupRepositoryExt extends JpaRepository<ComplexityPriceGroupDaoExt, String> {

	Optional<ComplexityPriceGroupDaoExt> findByComplexityAndPriceGroup(ComplexityDao complexityCode, PriceGroupDao priceGroup);

}
