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
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotDetailsIdDao;
import com.titan.poss.product.dao.StoneDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class LotStoneDetailsMapper implements RowMapper<LotDetailsDao> {

	@Override
	public LotDetailsDao mapRow(ResultSet rs, int rowNum) throws SQLException {
		LotDetailsDao lotDetailsDao = new LotDetailsDao();

		LotDetailsIdDao lotDetailsId = new LotDetailsIdDao();
		ItemDao itemDao = new ItemDao();
		itemDao.setItemCode(rs.getString("item_code"));
		lotDetailsId.setItem(itemDao);
		lotDetailsId.setLotNumber(rs.getString("lot_number"));
		lotDetailsId.setLineItemNo(rs.getShort("line_item_no"));
		lotDetailsDao.setLotDetailsId(lotDetailsId);

		StoneDao stone = new StoneDao();
		stone.setStoneCode(rs.getString("stone_code"));
		lotDetailsDao.setStone(stone);

		lotDetailsDao.setStoneWeight(rs.getBigDecimal("stone_weight"));
		lotDetailsDao.setNoOfStones(rs.getShort("no_of_stones"));
		lotDetailsDao.setWeightUnit(rs.getString("weight_unit"));
		lotDetailsDao.setCorrelationId(rs.getString("correlation_id"));

		lotDetailsDao.setCreatedBy(rs.getString("created_by"));
		lotDetailsDao.setCreatedDate(rs.getDate("created_date"));
		lotDetailsDao.setLastModifiedBy(rs.getString("last_modified_by"));
		lotDetailsDao.setLastModifiedDate(rs.getDate("last_modified_date"));
		lotDetailsDao.setSyncTime(rs.getLong("sync_time"));

		return lotDetailsDao;
	}

}
