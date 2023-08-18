/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dto.LotStoneDetailsDto;
import com.titan.poss.product.dto.StoneMasterDto;
import com.titan.poss.product.repository.LotDetailsRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface LotDetailRepositoryExt extends LotDetailsRepository {

	@Query(nativeQuery = true, value = "select l.no_of_stones as numberOfStones,l.stone_code as stoneCode, l.stone_weight as stoneWeight  from lot_stone_details L where ((L.item_Code= convert(varchar(20),:itemCode)) and (L.lot_Number=convert(varchar(20),:lotNumber)))")
	List<Object[]> findByLotNumberId(@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber);
	
	@Query("SELECT new com.titan.poss.product.dto.LotStoneDetailsDto(ld.lotDetailsId.item.itemCode,ld.lotDetailsId.lotNumber,ld.lotDetailsId.lineItemNo,ld.stone.stoneCode,ld.stoneWeight,ld.noOfStones,ld.weightUnit,ld.correlationId,ld.createdBy,ld.createdDate,ld.lastModifiedBy,ld.lastModifiedDate) "
			 + "FROM LotDetailsDao ld WHERE ld.lotDetailsId.item.itemCode=convert(varchar(20),:itemCode) AND ld.lotDetailsId.lotNumber=convert(varchar(20),:lotNumber)")
	List<LotStoneDetailsDto> findAllByStoneAndLot(@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber);

}
