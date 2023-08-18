/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dao.ProductGroupDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemMasterMapper implements RowMapper<ItemDao> {

	@Override
	public ItemDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		ItemDao itemDao = new ItemDao();
		itemDao.setItemCode(rs.getString("item_code"));
		itemDao.setDescription(rs.getString("description"));
		itemDao.setStdWeight(rs.getBigDecimal("std_weight"));
		itemDao.setStdValue(rs.getBigDecimal("std_value"));

		ComplexityDao complexityDao = new ComplexityDao();
		complexityDao.setComplexityCode(rs.getString("complexity_code"));
		itemDao.setComplexity(complexityDao);

		ProductGroupDao productGroupDao = new ProductGroupDao();
		productGroupDao.setProductGroupCode(rs.getString("product_group_code"));
		itemDao.setProductGroup(productGroupDao);

		ProductCategoryDao productCategoryDao = new ProductCategoryDao();
		productCategoryDao.setProductCategoryCode(rs.getString("product_category_code"));
		itemDao.setProductCategory(productCategoryDao);

		itemDao.setBrandCode(rs.getString("brand_code"));

		ItemTypeDao itemTypeDao = new ItemTypeDao();
		itemTypeDao.setItemTypeCode(rs.getString("item_type_code"));
		itemDao.setItemType(itemTypeDao);

		itemDao.setLeadTime(rs.getInt("lead_time"));
		itemDao.setOrgCode(rs.getString("org_code"));
		itemDao.setIsEditable(rs.getBoolean("is_editable"));

		itemDao.setOrgCode(rs.getString("org_code"));

		if (!StringUtils.isEmpty(rs.getString("parent_item_code"))) {
			ItemDao parentItemDao = new ItemDao();
			parentItemDao.setItemCode(rs.getString("parent_item_code"));
			itemDao.setParentItem(parentItemDao);
		}

		itemDao.setItemDetails(rs.getString("item_details"));
		itemDao.setConfigDetails(rs.getString("config_details"));
		itemDao.setIsEditable(false);
		itemDao.setTaxClassCode(rs.getString("tax_class_code"));
		itemDao.setPricingType(rs.getString("pricing_type"));
		itemDao.setPricingGroupType(rs.getString("pricing_group_type"));
		itemDao.setPurity(rs.getBigDecimal("purity"));
		itemDao.setKarat(rs.getBigDecimal("karat"));
		itemDao.setStoneCharges(rs.getBigDecimal("stone_charges"));
		itemDao.setCurrencyCode(rs.getString("currency_code"));
		itemDao.setWeightUnit(rs.getString("weight_unit"));
		itemDao.setPriceFactor(rs.getBigDecimal("price_factor"));
		itemDao.setIsFocItem(rs.getBoolean("is_foc_item"));
		itemDao.setIsActive(rs.getBoolean("is_active"));
		itemDao.setCreatedBy(rs.getString("created_by"));
		itemDao.setCreatedDate(rs.getDate("created_date"));
		itemDao.setLastModifiedBy(rs.getString("last_modified_by"));
		itemDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		itemDao.setSrcSyncId(rs.getInt("src_sync_id"));
		itemDao.setDestSyncId(rs.getInt("dest_sync_id"));
		itemDao.setCorrelationId(rs.getString("correlation_id"));

		return itemDao;
	}

}
