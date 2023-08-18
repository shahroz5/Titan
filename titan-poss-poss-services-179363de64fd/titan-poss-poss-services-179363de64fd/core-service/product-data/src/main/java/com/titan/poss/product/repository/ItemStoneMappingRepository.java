/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemStoneMappingDao;
import com.titan.poss.product.dto.ItemStoneMappingDetailsDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ItemStoneMappingRepository")
public interface ItemStoneMappingRepository extends JpaRepository<ItemStoneMappingDao, String> {

	ItemStoneMappingDao findByItemItemCodeAndStoneStoneCode(String itemCode, String stoneCode);

	/**
	 * @param itemCodes
	 * @return List<ItemStoneMappingDao>
	 */
	List<ItemStoneMappingDao> findAllByItemItemCodeIn(List<String> itemCodes);
	
	boolean existsByItemItemCodeAndStoneStoneCode(String itemCode,String stoneCode);
	
	@Query(nativeQuery = true, value = "SELECT ls.item_code from item_stone_mapping ls WHERE ls.item_code IN (:itemCode)"
			+ " AND ls.stone_code IN (:stoneList)")
	List<String> fetchItemStoneMapping(@Param("itemCode") List<String> itemCode,
			@Param("stoneList") List<String> stoneList);

	
	@Modifying
	@Query(nativeQuery = true, value = "INSERT INTO item_stone_mapping (id,item_code,stone_code,no_of_stones,sync_time,is_active,created_by,created_date,last_modified_date,last_modified_by)"
			+ " VALUES(:id,:itemCode,:stoneCode,:noOfStones,'0',:isActive,'Migration User',:createdDate,:createdDate,'Migration User')")
	@Transactional
	void saveItemStoneDetails(@Param("id")String id,@Param("itemCode")String itemCode,@Param("noOfStones") Short noOfStones, @Param("stoneCode")String stoneCode,@Param("isActive") Boolean isActive,
			@Param("createdDate")	Date createdDate);
	
	
	@Query("SELECT new com.titan.poss.product.dto.ItemStoneMappingDetailsDto(ism.id,ism.correlationId,ism.item.itemCode,ism.stone.stoneCode,ism.noOfStones,ism.createdBy,ism.createdDate,ism.lastModifiedBy,ism.lastModifiedDate,ism.isActive) "
	 + "FROM ItemStoneMappingDao ism WHERE ism.item.itemCode=convert(varchar(20),:itemCode)")
	List<ItemStoneMappingDetailsDto> findAllByItemStone(@Param("itemCode") String itemCode);
}
