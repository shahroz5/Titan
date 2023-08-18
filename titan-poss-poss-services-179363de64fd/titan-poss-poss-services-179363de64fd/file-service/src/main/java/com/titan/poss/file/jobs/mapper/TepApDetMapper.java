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

import com.titan.poss.file.dto.TepApDetailsDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class TepApDetMapper implements RowMapper<TepApDetailsDto> {

	@Override
	public TepApDetailsDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		TepApDetailsDto tepApDet = new TepApDetailsDto();
		tepApDet.setRecType("DTL");
		tepApDet.setInvoiceNumber(rs.getString("location_code") + "/" + rs.getString("doc_no") + "/"
				+ rs.getInt("fiscal_year") % 100 + "-" + (rs.getInt("fiscal_year") % 100 + 1));
		tepApDet.setBusinessDate(rs.getDate("doc_date"));
		tepApDet.setAmount(rs.getBigDecimal("final_value").setScale(0, RoundingMode.HALF_UP));
		tepApDet.setGlCodeCombination(
				"100-" + rs.getString("cost_center") + "-" + rs.getString("gl_code") + "-JEWL-TQ-00-00");
		String itemCode = rs.getString("record_type").equalsIgnoreCase("CN") ? rs.getString("location_code") + "/" + rs.getString("debit_note_doc_no") + "/"
				+ rs.getInt("debit_note_fiscal_year") % 100 + "-" + (rs.getInt("debit_note_fiscal_year") % 100 + 1)
				: rs.getString("item_code");
		tepApDet.setItemCode(itemCode);

		return tepApDet;
	}

}
