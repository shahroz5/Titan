/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.BoutiqueRevenueDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class BoutiqueRevenueFileStepMapper implements RowMapper<BoutiqueRevenueDto> {

	@Override
	public BoutiqueRevenueDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		BoutiqueRevenueDto boutiqueRevenueDto = new BoutiqueRevenueDto();
		boutiqueRevenueDto.setReceiptNo(rs.getString("receipt_no"));
		boutiqueRevenueDto.setCurrency(rs.getString("currency"));
		boutiqueRevenueDto.setAmount(rs.getBigDecimal("amount").setScale(0, RoundingMode.HALF_UP));
		boutiqueRevenueDto.setReceiptDate(rs.getString("receipt_date"));
		boutiqueRevenueDto.setGlDate(rs.getString("gl_date"));
		boutiqueRevenueDto.setReceiptMethod(rs.getString("receipt_method"));
		boutiqueRevenueDto.setCategory(null);
		boutiqueRevenueDto.setAttribute1(null);
		boutiqueRevenueDto.setAttribute2(null);
		boutiqueRevenueDto.setCustomerName(rs.getString("customer_name"));
		boutiqueRevenueDto.setCustomerNumber(rs.getString("customer_number"));
		boutiqueRevenueDto.setComments(rs.getString("comments"));
		boutiqueRevenueDto.setAttribute3(rs.getString("attribute3"));
		boutiqueRevenueDto.setAttribute4(null);
		boutiqueRevenueDto.setAttribute5(rs.getString("attribute5"));
		boutiqueRevenueDto.setAttribute6(rs.getString("attribute6"));
		boutiqueRevenueDto.setAttribute7String(CalendarUtils.formatDateToString(rs.getDate("attribute7"),
                FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		boutiqueRevenueDto.setAttribute8(rs.getString("attribute8"));
		//rs.getString("attribute5");
		return boutiqueRevenueDto;
	}

}
