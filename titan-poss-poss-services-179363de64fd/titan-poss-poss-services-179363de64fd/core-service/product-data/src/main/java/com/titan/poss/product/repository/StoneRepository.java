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

import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.dto.ItemStoneMappingDetailsDto;
import com.titan.poss.product.dto.StoneMasterDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface StoneRepository extends JpaRepository<StoneDao, String> {

	/**
	 * This method will return the Stone details based on the stoneCode.
	 * 
	 * @param stoneCode
	 * @return Stone
	 */
	public StoneDao findOneByStoneCode(String stoneCode);
	
	public StoneDao findByStoneCodeAndIsActive(String stoneCode, Boolean isActive);

	@Query(nativeQuery = true, value = "SELECT ls.stone_code from stone_master ls WHERE"
			+ " ls.stone_code IN (:stoneCode)")
	List<String> fetchStoneDetails(@Param("stoneCode") List<String> stoneCode);
	
	@Query("SELECT new com.titan.poss.product.dto.StoneMasterDto(ism.stoneCode,ism.color,ism.stdWeight,ism.stoneType.stoneTypeCode,ism.quality,ism.shape,ism.stdValue,ism.ratePerCarat,ism.currencyCode,ism.weightUnit,ism.correlationId,ism.configDetails,ism.isActive,ism.createdBy,ism.createdDate,ism.lastModifiedBy,ism.lastModifiedDate)"
			 + "FROM StoneDao ism WHERE ism.stoneCode IN (:stoneCode)")
	List<StoneMasterDto> findAllByStone(@Param("stoneCode") List<String> stoneCode);
	
	
}
