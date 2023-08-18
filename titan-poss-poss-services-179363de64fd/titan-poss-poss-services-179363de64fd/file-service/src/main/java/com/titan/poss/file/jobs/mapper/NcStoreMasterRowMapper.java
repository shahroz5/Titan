/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.file.dto.NcStoreMasterStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class NcStoreMasterRowMapper implements RowMapper<NcStoreMasterStageDto> {

	private static final String CHANNEL = "Tanishq";

	@Override
	public NcStoreMasterStageDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		NcStoreMasterStageDto ncStoreMasterStageDto = new NcStoreMasterStageDto();
		LocalDate date = LocalDate.now();
		ncStoreMasterStageDto.setChannel(CHANNEL);
		ncStoreMasterStageDto.setStoreCode(rs.getString("location_code"));
		ncStoreMasterStageDto.setStoreName(rs.getString("store_name"));
		String storeType = rs.getString("owner_type");
		if (storeType.equalsIgnoreCase("L1")) {
			storeType = "CO";
		} else if (storeType.equalsIgnoreCase("L2") || storeType.equalsIgnoreCase("L3")) {
			storeType = "FR";
		} else {
			storeType = "NA";
		}
		ncStoreMasterStageDto.setStoreType(storeType);
		ncStoreMasterStageDto.setCity(rs.getString("city"));
		ncStoreMasterStageDto.setState(rs.getString("state"));
		ncStoreMasterStageDto.setTransactionDate(date.toString());
		ncStoreMasterStageDto.setRegion(rs.getString("region_code"));
		ncStoreMasterStageDto.setPinCode(rs.getInt("pin_code"));
		ncStoreMasterStageDto.setIsActive(rs.getBoolean("is_active") ? 1 : 0);
		ncStoreMasterStageDto.setIsSmsEnabled(1);
		return ncStoreMasterStageDto;
	}

}
