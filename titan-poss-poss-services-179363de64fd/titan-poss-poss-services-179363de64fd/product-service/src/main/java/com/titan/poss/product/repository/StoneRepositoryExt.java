/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ProductStoneRepositoryExt")
public interface StoneRepositoryExt extends StoneRepository {

	@Query("SELECT sm.stoneCode,sm.color,sm.quality,lm.noOfStones,sm.ratePerCarat,lm.stoneWeight,(lm.stoneWeight)*(sm.ratePerCarat),st.description FROM "
			+ "LotDetailsDao lm LEFT JOIN StoneDao sm ON lm.stone = sm.stoneCode LEFT JOIN StoneTypeDao st ON st.stoneTypeCode = sm.stoneType WHERE lm.lotDetailsId.item = :itemCode AND lm.lotDetailsId.lotNumber = :lotNumber")
	List<Object[]> getStoneDetailsByItemCode(@Param("itemCode") ItemDao itemCode, @Param("lotNumber") String lotNumber);

	@Query("select distinct s.quality from StoneDao s where s.quality is not null")
	Page<String> getStoneQuality(Pageable pageable);
	
	
}
