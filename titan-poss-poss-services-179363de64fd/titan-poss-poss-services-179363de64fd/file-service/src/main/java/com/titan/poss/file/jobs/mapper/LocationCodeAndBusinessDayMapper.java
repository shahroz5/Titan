/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.LocationCodeAndMaxBusinessDateDto;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Component
public class LocationCodeAndBusinessDayMapper implements RowMapper<LocationCodeAndMaxBusinessDateDto> {

	@Override
	public LocationCodeAndMaxBusinessDateDto mapRow(ResultSet rs, int rowNum) throws SQLException {

		LocationCodeAndMaxBusinessDateDto locationCodeDto = new LocationCodeAndMaxBusinessDateDto();
		locationCodeDto.setLocationCode(rs.getString("location_code"));
		locationCodeDto.setLastBusinessDate(rs.getString("business_date"));
		log.info("Last business date is.........................................{}",locationCodeDto.getLastBusinessDate());

		return locationCodeDto;
	}

}
