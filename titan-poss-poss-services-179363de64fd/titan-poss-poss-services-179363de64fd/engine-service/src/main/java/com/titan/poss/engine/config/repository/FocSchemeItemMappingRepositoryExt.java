/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeItemMappingDao;
import com.titan.poss.config.repository.FocSchemeItemMappingRepository;
import com.titan.poss.engine.dto.FocItemLiteDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface FocSchemeItemMappingRepositoryExt extends FocSchemeItemMappingRepository {

	/**
	 * @param id
	 * @param bigDecimal2
	 * @param bigDecimal
	 * @return
	 */
	// formatter:off
	@Query("select new com.titan.poss.engine.dto.FocItemLiteDto (f.itemCode,f.karat,"
			+ "((:weight)/f.stdWeight) as quantity) from FocSchemeItemMappingDao f "
			+ "where f.focSchemeMasterDao.id = :schemeId and f.karat = :karat and f.stdWeight<= :weight")
	// ((:weight)/f.stdWeight)%1 = 0
	// formatter:on
	List<FocItemLiteDto> findItemCodesBySchemeId(@Param("schemeId") String schemeId, @Param("karat") BigDecimal karat,
			@Param("weight") BigDecimal weight);

	Set<FocSchemeItemMappingDao> findAllByFocSchemeMasterDaoId(String schemeId);

}
