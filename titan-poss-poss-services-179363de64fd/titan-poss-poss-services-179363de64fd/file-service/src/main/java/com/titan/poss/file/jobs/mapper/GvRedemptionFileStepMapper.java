/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.GvRedemptionDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class GvRedemptionFileStepMapper implements RowMapper<GvRedemptionDto> {

	@Override
	public GvRedemptionDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		GvRedemptionDto gvRedemptionDto = new GvRedemptionDto();
		gvRedemptionDto.setDateAndTime(
				CalendarUtils.formatDateToString(rs.getTimestamp("date_and_time"), "dd-MM-yyyy hh:mm:ss"));
		gvRedemptionDto.setDocType(rs.getString("doc_type"));
		gvRedemptionDto.setCmNumber(rs.getInt("cm_number"));
		gvRedemptionDto.setGvItemCode(rs.getString("gv_item_code"));
		gvRedemptionDto.setGvGc(rs.getString("gv_gc"));
		gvRedemptionDto.setGvSerialNumber(rs.getInt("gv_serial_number"));
		BigDecimal amount = rs.getBigDecimal("amount");
		gvRedemptionDto.setAmount(amount.setScale(2, RoundingMode.HALF_UP));
		gvRedemptionDto.setLocationCode(rs.getString("location_code"));
		gvRedemptionDto.setOwnerInfo(rs.getString("owner_info"));
		gvRedemptionDto.setType(rs.getString("type"));
		gvRedemptionDto.setRemarks(rs.getString("remarks"));

		return gvRedemptionDto;
	}

}
