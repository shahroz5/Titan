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

import com.titan.poss.product.dao.ItemDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ItemRepository extends JpaRepository<ItemDao, String> {

	/**
	 * This method will return the Item details based on the itemCode.
	 * 
	 * @param itemCode
	 * @return Item
	 */
	@Query("Select i from ItemDao i where itemCode=convert(varchar(20),:itemCode)")
	public ItemDao findOneByItemCode(@Param("itemCode") String itemCode);

	/**
	 * This method will return the list of Item details based on the parent item
	 * Code.
	 * 
	 * @param ItemDao object
	 * @return List of Item
	 */
	List<ItemDao> findByParentItem(ItemDao parentitem);

	/**
	 * Ths method will return the Item details based on the itemCode and isActive
	 * 
	 * @param itemCode
	 * @param isActive
	 * @return Item
	 */
	public ItemDao findByItemCodeAndIsActive(String itemCode, boolean isActive);

	@Query(nativeQuery = true, value = "SELECT ls.item_code from item_master ls WHERE ls.item_code IN (:itemCode)")
	public List<String> fetchItemCode(@Param("itemCode") List<String> itemCode);
}
