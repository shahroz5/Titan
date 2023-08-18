/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ProductItemRepository")
public interface ItemRepositoryExt extends ItemRepository {

	@Query(nativeQuery = true, value = "select item.item_code,productCategory.product_category_code,"
			+ " productGroup.product_group_code, "
			+ " item.description,complexity.complexity_code,item.std_weight,item.std_value, "
			+ " lotMaster.lot_number,item.parent_item_code,item.pricing_group_type,item.stone_charges"
			+ " from item_master item inner join lot_stone_details lotMaster on item.item_code=lotMaster.item_code "
			+ " inner join complexity_master complexity on complexity.complexity_code=item.complexity_code "
			+ " inner join product_group_master productGroup on productGroup.product_group_code=item.product_group_code "
			+ " inner join product_category_master productCategory on productCategory.product_category_code=item.product_category_code "
			+ " and item.item_code= :itemCode and lotMaster.lot_number= :lotNumber and item.is_active= :isActive")
	public List<Object[]> listItems(@Param("itemCode") String itemCode, @Param("isActive") boolean isActive,
			@Param("lotNumber") String lotNumber);

	@Query(nativeQuery = true, value = "select item.item_code,productCategory.product_category_code,"
			+ " productGroup.product_group_code, "
			+ " item.description,complexity.complexity_code,item.std_weight,item.std_value, "
			+ " lotMaster.lot_number,item.parent_item_code,SUM(lotMaster.stone_weight) as stone_weight,item.stone_charges,item.is_saleable,"
			+ " item.pricing_group_type"
			+ " from item_master item inner join lot_stone_details lotMaster on item.item_code=lotMaster.item_code "
			+ " inner join complexity_master complexity on complexity.complexity_code=item.complexity_code "
			+ " inner join product_group_master productGroup on productGroup.product_group_code=item.product_group_code "
			+ " inner join product_category_master productCategory on productCategory.product_category_code=item.product_category_code "
			+ " and item.parent_item_code= :parentItemCode and lotMaster.lot_number= :parentLotNumber "
			+ " and item.is_active= :isActive GROUP BY item.item_code,productCategory.product_category_code,"
			+ " productGroup.product_group_code,item.description,complexity.complexity_code,item.std_weight,item.std_value,"
			+ " lotMaster.lot_number,item.parent_item_code,item.stone_charges,item.is_saleable,item.pricing_group_type")
	public List<Object[]> listChildItems(@Param("parentItemCode") String parentItemCode,
			@Param("isActive") boolean isActive, @Param("parentLotNumber") String parentLotNumber);

	/**
	 * @param includeProductGroups
	 * @param excludeProductGroups
	 * @param includeProductCategories
	 * @param excludeProductCategories
	 * @param isFocItem
	 * @return
	 */
	@Query("Select i from ItemDao i where (:isFocItem IS NULL OR i.isFocItem = :isFocItem) "
			+ " AND (nullif(CHOOSE(1,:includeProductGroups),'') IS NULL OR i.productGroup.productGroupCode IN (:includeProductGroups)) \r\n"
			+ " AND (nullif(CHOOSE(1,:excludeProductGroups),'') IS NULL OR i.productGroup.productGroupCode NOT IN (:excludeProductGroups)) \r\n"
			+ " AND (nullif(CHOOSE(1,:includeProductCategories),'') IS NULL OR i.productCategory.productCategoryCode IN (:includeProductCategories)) \r\n"
			+ " AND (nullif(CHOOSE(1,:excludeProductCategories),'') IS NULL OR i.productCategory.productCategoryCode NOT IN (:excludeProductCategories)) \r\n")
	List<ItemDao> listItemDetails(@Param("includeProductGroups") Set<String> includeProductGroups,
			@Param("excludeProductGroups") Set<String> excludeProductGroups,
			@Param("includeProductCategories") Set<String> includeProductCategories,
			@Param("excludeProductCategories") Set<String> excludeProductCategories,
			@Param("isFocItem") Boolean isFocItem);

	@Query(nativeQuery = true, value = "select item.item_code,productCategory.product_category_code,"
			+ " productGroup.product_group_code, "
			+ " item.description,complexity.complexity_code,item.std_weight,item.std_value,item.pricing_group_type,item.stone_charges from item_master item "
			+ " inner join complexity_master complexity on complexity.complexity_code=item.complexity_code "
			+ " inner join product_group_master productGroup on productGroup.product_group_code=item.product_group_code "
			+ " inner join product_category_master productCategory on productCategory.product_category_code=item.product_category_code "
			+ " and item.item_code= :itemCode and item.is_active= :isActive")
	public List<Object[]> listItemsForConversion(@Param("itemCode") String itemCode,
			@Param("isActive") boolean isActive);

	@Query(nativeQuery = true, value = "select item.item_code,productCategory.product_category_code,"
			+ " productGroup.product_group_code, "
			+ " item.description,complexity.complexity_code,item.std_weight,item.std_value,item.is_saleable,item.stone_charges,item.pricing_group_type"
			+ " from item_master item inner join complexity_master complexity on complexity.complexity_code=item.complexity_code "
			+ " inner join product_group_master productGroup on productGroup.product_group_code=item.product_group_code "
			+ " inner join product_category_master productCategory on productCategory.product_category_code=item.product_category_code "
			+ " and item.parent_item_code= :parentItemCode and item.is_active= :isActive")
	public List<Object[]> listChildItemsForConversion(@Param("parentItemCode") String parentItemCode,
			@Param("isActive") boolean isActive);

}
