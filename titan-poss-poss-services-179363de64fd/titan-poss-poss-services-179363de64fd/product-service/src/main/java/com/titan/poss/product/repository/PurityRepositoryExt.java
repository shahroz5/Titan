/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.dao.PurityDaoExt;
import com.titan.poss.product.dto.PurityDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface PurityRepositoryExt extends JpaRepository<PurityDaoExt, String> {

	/**
	 * This method will return the Purity details based on the id.
	 * 
	 * @param id
	 * @return Purity
	 */
	public PurityDaoExt findOneById(String id);

	/**
	 * This method will return the Purity details based on the itemType and purity.
	 * 
	 * @param itemType
	 * @param purity
	 * @return Purity
	 */
	public PurityDaoExt findOneByItemTypeAndPurity(ItemTypeDao itemType, BigDecimal purity);

	/**
	 * This method will return the Purity details based on the itemType and offset.
	 * 
	 * @param itemtype
	 * @param offset
	 * @return PurityDao
	 */
	public PurityDaoExt findOneByItemTypeAndOffset(ItemTypeDao itemType, BigDecimal offset);

	/**
	 * This method will return the Purity details based on the itemType and karat.
	 * 
	 * @param itemType
	 * @param karat
	 * @return PurityDao
	 */
	public PurityDaoExt findOneByItemTypeAndKarat(ItemTypeDao itemType, BigDecimal karat);

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
