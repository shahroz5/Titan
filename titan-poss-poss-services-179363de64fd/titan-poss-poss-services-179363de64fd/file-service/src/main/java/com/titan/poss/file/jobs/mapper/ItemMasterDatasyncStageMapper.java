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

import com.titan.poss.datasync.dao.ItemDatasyncStageDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class ItemMasterDatasyncStageMapper implements RowMapper<ItemDatasyncStageDao> {

	@Override
	public ItemDatasyncStageDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		ItemDatasyncStageDao itemDataSyncStageDao = new ItemDatasyncStageDao();
		itemDataSyncStageDao.setItemCode(rs.getString("item_code"));
		itemDataSyncStageDao.setDescription(rs.getString("description"));
		itemDataSyncStageDao.setStdWeight(rs.getBigDecimal("std_weight"));
		itemDataSyncStageDao.setStdValue(rs.getBigDecimal("std_value"));
		itemDataSyncStageDao.setComplexity(rs.getString("complexity_code"));
		itemDataSyncStageDao.setProductGroup(rs.getString("product_group_code"));
		itemDataSyncStageDao.setProductCategory(rs.getString("product_category_code"));
		itemDataSyncStageDao.setBrandCode(rs.getString("brand_code"));
		itemDataSyncStageDao.setItemType(rs.getString("item_type_code"));
		itemDataSyncStageDao.setLeadTime(rs.getInt("lead_time"));
		itemDataSyncStageDao.setOrgCode(rs.getString("org_code"));
		itemDataSyncStageDao.setIsEditable(rs.getBoolean("is_editable"));

		itemDataSyncStageDao.setOrgCode(rs.getString("org_code"));

		if (!StringUtils.isEmpty(rs.getString("parent_item_code"))) {
			itemDataSyncStageDao.setParentItem(rs.getString("parent_item_code"));
		}

		itemDataSyncStageDao.setItemDetails(rs.getString("item_details"));
		itemDataSyncStageDao.setConfigDetails(rs.getString("config_details"));
		itemDataSyncStageDao.setIsEditable(false);
		itemDataSyncStageDao.setTaxClassCode(rs.getString("tax_class_code"));
		itemDataSyncStageDao.setPricingType(rs.getString("pricing_type"));
		itemDataSyncStageDao.setPricingGroupType(rs.getString("pricing_group_type"));
		itemDataSyncStageDao.setPurity(rs.getBigDecimal("purity"));
		itemDataSyncStageDao.setKarat(rs.getBigDecimal("karat"));
		itemDataSyncStageDao.setStoneCharges(rs.getBigDecimal("stone_charges"));
		itemDataSyncStageDao.setCurrencyCode(rs.getString("currency_code"));
		itemDataSyncStageDao.setWeightUnit(rs.getString("weight_unit"));
		itemDataSyncStageDao.setPriceFactor(rs.getBigDecimal("price_factor"));
		itemDataSyncStageDao.setIsFocItem(rs.getBoolean("is_foc_item"));
		itemDataSyncStageDao.setIsActive(rs.getBoolean("is_active"));
		itemDataSyncStageDao.setCreatedBy(rs.getString("created_by"));
		itemDataSyncStageDao.setCreatedDate(rs.getDate("created_date"));
		itemDataSyncStageDao.setLastModifiedBy(rs.getString("last_modified_by"));
		itemDataSyncStageDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		itemDataSyncStageDao.setSrcSyncId(rs.getInt("src_sync_id"));
		itemDataSyncStageDao.setDestSyncId(rs.getInt("dest_sync_id"));
		itemDataSyncStageDao.setCorrelationId(rs.getString("correlation_id"));
		itemDataSyncStageDao.setIsSaleable(rs.getBoolean("is_saleable"));
		itemDataSyncStageDao.setIsReturnable(rs.getBoolean("is_returnable"));
		itemDataSyncStageDao.setHsnSacCode(rs.getString("hsn_sac_code"));
		itemDataSyncStageDao.setStoneWeight(rs.getBigDecimal("stone_weight"));
		itemDataSyncStageDao.setDiamondCaratage(rs.getBigDecimal("diamond_caratage"));
		itemDataSyncStageDao.setDiamondClarity(rs.getString("diamond_clarity"));
		itemDataSyncStageDao.setDiamondColor(rs.getString("diamond_color"));
		itemDataSyncStageDao.setStoneCombination(rs.getString("stone_combination"));
		itemDataSyncStageDao.setProductType(rs.getString("product_type"));
		itemDataSyncStageDao.setTotCategory(rs.getString("tot_category"));

		return itemDataSyncStageDao;
	}

}
