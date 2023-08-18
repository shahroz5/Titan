/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.product.repository;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.PurityDao;
import com.titan.poss.product.dto.PurityDto;
import com.titan.poss.product.repository.PurityRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PurityRepositoryExt extends PurityRepository {

	@Query("select p from PurityDao p where (p.karat=:karat and p.itemType.itemTypeCode=:itemTypeCode )")
	PurityDao findOneByKaratAndItemTypeCode(@Param("karat") BigDecimal karat,
			@Param("itemTypeCode") String itemTypeCode);

	@Query("select p from PurityDao p where (p.purity=:purity and p.itemType.itemTypeCode=:itemTypeCode )")
	PurityDao findOneByPurityAndItemTypeCode(@Param("purity") BigDecimal purity,
			@Param("itemTypeCode") String itemTypeCode);
	
	/**
	 * This method will return all purity details based on parameters in search.
	 * 
	 * @param itemType
	 * @param karat
	 * @param isActive
	 * @return Page<PurityDao>
	 */
	// @formatter:off
	@Query("SELECT new com.titan.poss.product.dto.PurityDto(p.id, "
			+ " p.itemType.itemTypeCode, p.purity, p.karat, "
			+ " p.offset, p.description, p.isActive, p.isDisplayed ) "
			+ " FROM com.titan.poss.product.dao.PurityDaoExt p "
			+ " WHERE (:itemTypeCode IS NULL OR p.itemType.itemTypeCode = :itemTypeCode) "
			+ " AND (:purity IS NULL OR p.purity = :purity) "
			+ " AND (:isActive IS NULL OR p.isActive = :isActive) ")
	// @formatter:on
	public Page<PurityDto> findByItemTypeCodeAndPurityAndIsActive(@Param("itemTypeCode") String itemTypeCode,
			@Param("purity") BigDecimal purity, @Param("isActive") Boolean isActive, Pageable pageable);

}
