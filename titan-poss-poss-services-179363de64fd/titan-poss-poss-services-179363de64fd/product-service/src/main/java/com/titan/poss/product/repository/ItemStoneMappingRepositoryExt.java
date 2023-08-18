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

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemStoneMappingDaoExt;
import com.titan.poss.product.dao.StoneDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ProductItemStoneMappingRepositoryExt")
public interface ItemStoneMappingRepositoryExt extends JpaRepository<ItemStoneMappingDaoExt, String> {

	@Query("SELECT i FROM ItemStoneMappingDaoExt i  WHERE i.item = :itemCode AND i.stone IN (:stoneList)")
	List<ItemStoneMappingDaoExt> getItemStoneMapping(@Param("itemCode") ItemDao itemCode,
			@Param("stoneList") List<StoneDao> stoneList);

	List<ItemStoneMappingDaoExt> findByItemItemCode(String itemCode);
	
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
}
