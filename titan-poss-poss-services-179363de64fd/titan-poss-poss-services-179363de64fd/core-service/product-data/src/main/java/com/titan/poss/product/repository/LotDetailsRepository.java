/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.LotNumberDetailsDto;
import com.titan.poss.product.dao.LotDetailsDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface LotDetailsRepository extends JpaRepository<LotDetailsDao, String> {

	/**
	 * @param itemCodes
	 * @return List<LotDetailsDao>
	 */
	List<LotDetailsDao> findAllByLotDetailsIdItemItemCodeIn(Set<String> itemCodes);

	List<LotDetailsDao> findByLotDetailsIdItemItemCodeAndLotDetailsIdLotNumber(String itemCode, String lotNumber);
	
	
	@Query(nativeQuery = true, value = "SELECT * from lot_stone_details ls WHERE ls.item_code = :itemCode"
			+ " AND ls.lot_number = :lotNumber")
	List<LotDetailsDao> findByLotDetailsIdItemCodeAndLotDetailsIdLotNumber(@Param("itemCode") String itemCode,
			@Param("lotNumber") String lotNumber);

	boolean existsByLotDetailsIdItemItemCodeAndLotDetailsIdLotNumberAndStoneStoneCode(String itemCode, String lotNumber,
			String stoneCode);

	@Query(nativeQuery = true, value = "SELECT ls.item_code from lot_stone_details ls WHERE ls.item_code IN (:itemCode)"
			+ " AND ls.lot_number IN (:lotNumber)"
			+ " AND ls.stone_code IN (:stoneCode)")
	List<String> fetchLotStoneDetails(@Param("itemCode") List<String> itemCode,
			@Param("lotNumber") List<String> lotNumber, @Param("stoneCode") List<String> stoneCode);

	
	
	@Query(nativeQuery = true, value = "INSERT INTO lot_stone_details (lot_number,stone_code,stone_weight,no_of_stones,item_code,line_item_no,weight_unit,created_by,created_date,last_modified_date,last_modified_by,sync_time)"
			+ " VALUES(:lotNumber,:stoneCode,:stoneWeight,:noOfStones,:itemCode,:lineItemNo,:weightType,'Migration User',:createdDate,:createdDate,'Migration User','0')")
	@Transactional
	void saveLotStoneDetails(@Param("itemCode") String itemCode,@Param("lineItemNo")  Short lineItemNo, @Param("lotNumber") String lotNumber, @Param("noOfStones") Short noOfStones, @Param("stoneCode")  String stoneCode,
			@Param("stoneWeight") BigDecimal stoneWeight, @Param("weightType") String weightType,@Param("createdDate")Date createdDate);
	
	
	
	

}
