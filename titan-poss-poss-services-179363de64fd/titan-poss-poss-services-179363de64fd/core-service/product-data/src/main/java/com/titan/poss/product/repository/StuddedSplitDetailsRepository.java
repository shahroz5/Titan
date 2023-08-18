package com.titan.poss.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.StuddedSplitDetailsDao;


@Repository("StuddedSplitDetailsRepository")
public interface StuddedSplitDetailsRepository extends JpaRepository<StuddedSplitDetailsDao, String>{

	@Query(nativeQuery = true, value = "select * from studded_split_dtl where detail=:detail and item_code=:itemCode"
			+ " and parent_item_code = :parentItemCode and location_code = :locationCode")
	StuddedSplitDetailsDao findDetailAndItemCode(@Param("detail") String detail ,@Param("itemCode") String itemCode,
			@Param("parentItemCode") String parentItemCode,@Param("locationCode") String locationCode);
	
}
