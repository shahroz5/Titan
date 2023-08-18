/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.file.dto.NcMemberDataStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class NcMemberDataRowMapper implements RowMapper<NcMemberDataStageDto>{

	private static final String CHANNEL = "Tanishq";
	
	private static final String MOBILE_NO = "mobile_number";
	private static final String EMAIL_ID = "email_id";
	private static final String CUSTOMER_NAME = "customer_name";
	
	@Override
	public NcMemberDataStageDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		NcMemberDataStageDto nCMemberDataStageDto = new NcMemberDataStageDto();
		nCMemberDataStageDto.setChannel(CHANNEL);
		nCMemberDataStageDto.setStoreCode(rs.getString("location_code"));
		nCMemberDataStageDto.setUnifiedLoyaltyNo(rs.getString("ulp_id"));
		nCMemberDataStageDto.setTransactionDate(CalendarUtils.formatDateToString(rs.getDate("doc_date"), "dd-MMM-yyyy"));		
		nCMemberDataStageDto.setFirstName(CryptoUtil.decrypt(rs.getString("customer_name"),CUSTOMER_NAME,false));
		nCMemberDataStageDto.setMobileNo(CryptoUtil.decrypt(rs.getString("mobile_number"),MOBILE_NO, false));
		nCMemberDataStageDto.setEmail(CryptoUtil.decrypt(rs.getString("email_id"),EMAIL_ID,false));
		nCMemberDataStageDto.setOldLoyaltyNo("");
		nCMemberDataStageDto.setOldLoyaltyType("");
		nCMemberDataStageDto.setLastName("");
		return nCMemberDataStageDto;
	}

}
