/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.GvRedemptionDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class GvRedemptionRowMapper implements RowMapper<GvRedemptionDto> {

	@Override
	public GvRedemptionDto mapRow(ResultSet rs, int rowNum) throws SQLException {

		GvRedemptionDto gvRedemptionDto = new GvRedemptionDto();
		gvRedemptionDto.setDateAndTime(rs.getString("confirmed_time"));
		gvRedemptionDto.setDocType(rs.getString("txn_type"));
		gvRedemptionDto.setCmNumber(rs.getInt("doc_no"));
		gvRedemptionDto.setGvItemCode(rs.getString("reference_2"));
		gvRedemptionDto.setGvGc("GV");
		gvRedemptionDto.setGvSerialNumber(rs.getInt("instrument_no"));
		gvRedemptionDto.setAmount(rs.getBigDecimal("amount"));
		gvRedemptionDto.setLocationCode(rs.getString("location_code"));
		gvRedemptionDto.setOwnerInfo(getOwnerType(rs.getString("owner_type")));
		// as of now there is only redemption, hence "R"
		gvRedemptionDto.setType("R");
		gvRedemptionDto.setRemarks(null);

		return gvRedemptionDto;
	}

	private String getOwnerType(String ownerType) {
		if (ownerType.equalsIgnoreCase("L1")) {
			return "Level 1";
		} else if (ownerType.equalsIgnoreCase("L2")) {
			return "Level 2";
		} else {
			return "Level 3";
		}
	}

}
