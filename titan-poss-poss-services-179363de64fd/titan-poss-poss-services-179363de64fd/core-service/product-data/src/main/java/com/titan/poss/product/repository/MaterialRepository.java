/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.MaterialDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface MaterialRepository extends JpaRepository<MaterialDao, String> {

	MaterialDao findOneByMaterialCode(String materialCode);
	
	MaterialDao findByMaterialCodeAndIsActive(String materialCode, Boolean isActive);

	@Query(nativeQuery = true, value = "SELECT ls.material_code from material_master ls WHERE ls.material_code IN (:material_code)")
	public List<String> fetchMaterialCode(@Param("material_code") List<String> material_code);
}
