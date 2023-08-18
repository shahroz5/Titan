/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsIdDao;
import com.titan.poss.product.dao.MaterialDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class LotMaterialDetailsMapper implements RowMapper<LotMaterialDetailsDao> {

	@Override
	public LotMaterialDetailsDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		LotMaterialDetailsDao lotMaterailDetailsDao = new LotMaterialDetailsDao();

		LotMaterialDetailsIdDao lotDetailsId = new LotMaterialDetailsIdDao();
		ItemDao itemDao = new ItemDao();
		itemDao.setItemCode(rs.getString("item_code"));
		lotDetailsId.setItem(itemDao);
		lotDetailsId.setLotNumber(rs.getString("lot_number"));
		lotDetailsId.setLineItemNo(rs.getInt("line_item_no"));
		lotMaterailDetailsDao.setLotDetailsId(lotDetailsId);

		MaterialDao material = new MaterialDao();
		material.setMaterialCode(rs.getString("material_code"));
		lotMaterailDetailsDao.setMaterial(material);

		lotMaterailDetailsDao.setMaterialWeight(rs.getBigDecimal("material_weight"));
		lotMaterailDetailsDao.setNoOfMaterials(rs.getInt("no_of_materials"));
		lotMaterailDetailsDao.setWeightUnit(rs.getString("weight_unit"));
		lotMaterailDetailsDao.setCorrelationId(rs.getString("correlation_id"));

		lotMaterailDetailsDao.setCreatedBy(rs.getString("created_by"));
		lotMaterailDetailsDao.setCreatedDate(rs.getDate("created_date"));
		lotMaterailDetailsDao.setLastModifiedBy(rs.getString("last_modified_by"));
		lotMaterailDetailsDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		lotMaterailDetailsDao.setSyncTime(rs.getLong("sync_time"));

		return lotMaterailDetailsDao;
	}

}
