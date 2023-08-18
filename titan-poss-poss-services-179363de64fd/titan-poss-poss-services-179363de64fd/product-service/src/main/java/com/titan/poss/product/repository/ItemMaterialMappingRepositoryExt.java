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

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemMaterialMappingDaoExt;
import com.titan.poss.product.dao.MaterialDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ProductItemMaterialMappingRepositoryExt")
public interface ItemMaterialMappingRepositoryExt  extends JpaRepository<ItemMaterialMappingDaoExt, String>{

	@Query("SELECT i FROM ItemMaterialMappingDaoExt i  WHERE i.item = :itemCode AND i.material IN (:materialCode)")
	List<ItemMaterialMappingDaoExt> getItemMaterialMapping(@Param("itemCode") ItemDao itemCode,
			@Param("materialCode") List<String> materialCode);
}
