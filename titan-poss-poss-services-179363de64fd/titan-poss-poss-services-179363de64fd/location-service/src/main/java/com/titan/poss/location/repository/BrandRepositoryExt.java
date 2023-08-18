/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.BrandDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("locationBrandRepositoryExt")
public interface BrandRepositoryExt extends BrandRepository {

	/**
	 * This method will return the parent Brand list based on the isActiveList.
	 * 
	 * @param isActiveList
	 * @param pageable
	 * @return Page<Brand>
	 */
	@Query("select r from BrandDao r where isActive in(:isActiveList) and r.parentBrand.brandCode = r.brandCode OR r.parentBrand.brandCode IS NULL")
	public Page<BrandDao> findParentBrands(@Param("isActiveList") List<Boolean> isActiveList, Pageable pageable);

	@Query("select r from BrandDao r where r.parentBrand.brandCode in(:brandCodeList)")
	public Page<BrandDao> findSubBrands(@Param("brandCodeList") List<String> brandCodeList, Pageable pageable);

}
