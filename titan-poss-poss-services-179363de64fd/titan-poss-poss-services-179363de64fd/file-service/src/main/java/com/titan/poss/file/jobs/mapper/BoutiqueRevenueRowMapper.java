/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.BoutiqueRevenueDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class BoutiqueRevenueRowMapper implements RowMapper<BoutiqueRevenueDto> {

	@Override
	public BoutiqueRevenueDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		BoutiqueRevenueDto boutiqueRevenueDto = new BoutiqueRevenueDto();
		String oracleMapping = toDisplayCase(rs.getString("oracle_mapping"));
		if( oracleMapping.equalsIgnoreCase("CC") 
				|| oracleMapping.equalsIgnoreCase("CN") 
				|| oracleMapping.equalsIgnoreCase("DD") 
				|| oracleMapping.equalsIgnoreCase("RTGS")
				|| oracleMapping.equalsIgnoreCase("UPI") 
				|| oracleMapping.equalsIgnoreCase("RO") 
				|| oracleMapping.equalsIgnoreCase("QCGC") 
				|| oracleMapping.equalsIgnoreCase("CASHBACKOFFER") 
				|| oracleMapping.equalsIgnoreCase("GV") 
				|| oracleMapping.equalsIgnoreCase("HDFC")
				|| oracleMapping.equalsIgnoreCase("QCEGHS"))
		{
			oracleMapping =   oracleMapping.toUpperCase();
		}
		else if(oracleMapping.equalsIgnoreCase("UNIPAY"))
		{
			oracleMapping = "CC";
		}
		else if(oracleMapping.toUpperCase().contains("DIGIGOLD"))
		{
			oracleMapping = "DIGIGOLDREDEEM";
		}
		String receiptNo = rs.getString(FileIntegrationConstants.LOCATION_CODE) + String.join("", Lists.reverse(
				Arrays.stream(rs.getDate(FileIntegrationConstants.DOC_DATE).toString().trim().split("-")).collect(Collectors.toList()))) + "_"
				+ oracleMapping;
		boutiqueRevenueDto.setReceiptNo(receiptNo);
		boutiqueRevenueDto.setCurrency(rs.getString("currency_code"));
		boutiqueRevenueDto.setAmount(rs.getBigDecimal("amount"));
		boutiqueRevenueDto.setReceiptDate(CalendarUtils.formatDateToString(rs.getDate(FileIntegrationConstants.DOC_DATE),
				FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		boutiqueRevenueDto.setGlDate(CalendarUtils.formatDateToString(rs.getDate(FileIntegrationConstants.DOC_DATE),
				FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		boutiqueRevenueDto.setReceiptMethod(rs.getString(FileIntegrationConstants.LOCATION_CODE) + oracleMapping);
		boutiqueRevenueDto.setCategory(null);
		boutiqueRevenueDto.setAttribute1(null);
		boutiqueRevenueDto.setAttribute2(null);
		boutiqueRevenueDto.setCustomerName(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		boutiqueRevenueDto.setCustomerNumber(rs.getString("sap_code"));
		boutiqueRevenueDto.setComments("CM" + String.join("", Lists.reverse(
				Arrays.stream(rs.getDate(FileIntegrationConstants.DOC_DATE).toString().trim().split("-")).collect(Collectors.toList()))));
		boutiqueRevenueDto.setAttribute3(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		boutiqueRevenueDto.setAttribute4(null);
		boutiqueRevenueDto.setAttribute5("");
		boutiqueRevenueDto.setAttribute6(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		boutiqueRevenueDto.setAttribute7(rs.getDate(FileIntegrationConstants.DOC_DATE));

		return boutiqueRevenueDto;
	}
	
	 public static String toDisplayCase(String s) {

		    final String ACTIONABLE_DELIMITERS = " '-/"; // these cause the character following
		                                                 // to be capitalized
		    
		    StringBuilder sb = new StringBuilder();
		    boolean capNext = true;

		    for (char c : s.toCharArray()) {
		        c = (capNext)
		                ? Character.toUpperCase(c)
		                : Character.toLowerCase(c);
		        sb.append(c);
		        capNext = (ACTIONABLE_DELIMITERS.indexOf((int) c) >= 0); // explicit cast not needed
		    }
		    return sb.toString();
		}


}
