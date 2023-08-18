/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.product.repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.repository.ItemRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineItemRepositoryExt")
public interface ItemRepositoryExt extends ItemRepository {

	@Query("Select i from ItemDao i where itemCode=convert(varchar(20),:itemCode)")
	ItemDao findByItemCode(@Param("itemCode") String itemCode);

	// NONUCP, CFACODE
	@Query(nativeQuery = true, value = "select top 1 item_code,lot_number from dev_inventory.dbo.inventory_details where (item_code in (select item_code from dev_products.dbo.item_master where product_group_code= :productGroupCode and pricing_type= :pricingType) and location_code= :locationCode)")
	String getItemCode(@Param("productGroupCode") String priceGroupCode, @Param("pricingType") String pricingType,
			@Param("locationCode") String locationCode);

	//@formatter:off
	@Query("SELECT i FROM ItemDao i \r\n"
			+ " INNER JOIN ProductGroupDao pg \r\n"
			+ " ON i.productGroup.productGroupCode = pg.productGroupCode \r\n"
			+ " INNER JOIN ProductCategoryDao pc \r\n"
			+ " ON i.productCategory.productCategoryCode = pc.productCategoryCode \r\n"
			+ " WHERE i.itemCode IN (:itemCodes) \r\n"
			+ " AND pg.productGroupCode = :productGroupCode \r\n"
			+ " AND ((:withSaleableCheck = false) \r\n"
			+ " 	 OR ( :withSaleableCheck = true \r\n"
			+ "			  AND i.isSaleable = true \r\n"
			+ " 		  AND i.isReturnable = true \r\n"
			+ " 		  AND i.isActive = true \r\n"
			+ " 		  AND pg.isActive = true \r\n"
			+ "           AND pc.isActive = true \r\n"
			+ "         ) \r\n"
			+ " ) \r\n")
	//@formatter:on
	List<ItemDao> findByItemCodesAndProductGroup(@Param("itemCodes") List<String> itemCodes,
			@Param("productGroupCode") String coinProductGroupCode,
			@Param("withSaleableCheck") Boolean withSaleableCheck);

	List<ItemDao> findByItemCodeIn(Collection<String> itemCodes);

	//@formatter:off
	@Query("SELECT i FROM ItemDao i \r\n"
			+ " WHERE (:itemCode IS NULL OR i.itemCode=:itemCode) \r\n"
			+ " AND (:productGroupCode IS NULL OR i.productGroup.productGroupCode = :productGroupCode) \r\n"
			+ " AND (:productCategoryCode IS NULL OR i.productCategory.productCategoryCode = :productCategoryCode) \r\n"
			+ " AND (:pricingType IS NULL  OR i.pricingType = :pricingType) \r\n"
			+ " AND ((:fromStdValue IS NULL AND :toStdValue IS NULL ) OR i.stdValue BETWEEN :fromStdValue AND :toStdValue) \r\n"
			+ " AND ((:fromStdWeight IS NULL AND :toStdWeight IS NULL) OR i.stdWeight BETWEEN :fromStdWeight AND :toStdWeight) \r\n"
			+ " AND ((:fromStoneCharges IS NULL AND :toStoneCharges IS NULL) OR i.stoneCharges BETWEEN :fromStoneCharges AND :toStoneCharges)")
	//@formatter:on
	Page<ItemDao> getItems(@Param("itemCode") String itemCode, @Param("fromStdValue") BigDecimal fromStdValue,
			@Param("toStdValue") BigDecimal toStdValue, @Param("fromStoneCharges") BigDecimal fromStoneCharges,
			@Param("toStoneCharges") BigDecimal toStoneCharges, @Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("pricingType") String pricingType,
			@Param("fromStdWeight") BigDecimal fromStdWeight, @Param("toStdWeight") BigDecimal toStdWeight,
			Pageable pageable);

	/**
	 * This method will return the Item details based on the itemCode.
	 *
	 * @param itemCode
	 * @return Item
	 */
	@Override
	@Query("Select i from ItemDao i where itemCode=convert(varchar(20),:itemCode)")
	ItemDao findOneByItemCode(@Param("itemCode") String itemCode);

	//@formatter:off
		@Query("SELECT i FROM ItemDao i \r\n"
				+ " WHERE i.isFocItem = true \r\n"
				+ " AND i.isSaleable = true \r\n"
				+ " AND i.isReturnable = true \r\n"
				+ " AND i.isActive = true \r\n")
	//@formatter:on
	List<ItemDao> getFocItems();

	@Query(nativeQuery = true, value = "DECLARE @item_code varchar(20) "
			+ " SET @item_code = CONCAT('\"*', :itemCode, '*\"') " + " SELECT * FROM item_master "
			+ " WHERE CONTAINS(item_code, @item_code)", countQuery = "DECLARE @item_code varchar(20) "
					+ " SET @item_code = CONCAT('\"*', :itemCode, '*\"') "
					+ " SELECT COUNT(*) FROM (SELECT * FROM item_master "
					+ " WHERE CONTAINS(item_code, @item_code)) itm")
	Page<ItemDao> getItems(@Param("itemCode") String itemCode, Pageable pageable);
	
	
	@Query("Select i from ItemDao i where itemCode=convert(varchar(20),:itemCode)")
	ItemDao findByItemMaster(@Param("itemCode") String itemCode);


}
