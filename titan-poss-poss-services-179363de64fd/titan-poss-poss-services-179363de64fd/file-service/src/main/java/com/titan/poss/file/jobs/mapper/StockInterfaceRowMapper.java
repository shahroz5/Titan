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
import com.titan.poss.file.dto.StockInterfaceDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StockInterfaceRowMapper  implements RowMapper<StockInterfaceDto> {

	@Override
	public StockInterfaceDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		StockInterfaceDto stockInterfaceDto = new StockInterfaceDto();
		stockInterfaceDto.setTransactionType(rs.getString("transaction_type"));
		stockInterfaceDto.setFromWhere(rs.getString("from_where"));
		stockInterfaceDto.setFromLocation(rs.getString("from_location"));
		stockInterfaceDto.setLotNo(rs.getString("lot_number"));
		stockInterfaceDto.setStmValue(rs.getString("stm_value"));
		stockInterfaceDto.setToWhere(rs.getString("to_where"));
		stockInterfaceDto.setToLocation(rs.getString("to_location"));
		if(rs.getString("item_code").length() == 14 )
		{	//for finished goods PriQty is quantity, SecQty is weight
			stockInterfaceDto.setPrimaryQty(rs.getString("primary_quantity"));
			stockInterfaceDto.setSecondaryQty2(rs.getString("secondary_quantity"));
		}
		else
		{	//for non finished goods opposite
			stockInterfaceDto.setPrimaryQty(rs.getString("secondary_quantity")); // changed condition based on achyuth's feedback
			stockInterfaceDto.setSecondaryQty2(""); 	
		}
		stockInterfaceDto.setBusinessDate(CalendarUtils.formatDateToString(rs.getDate("business_date"), "dd-MM-yy"));
		stockInterfaceDto.setReasonCode(rs.getString("reason_code"));
		stockInterfaceDto.setStmNumber(rs.getString("stm_number"));
		stockInterfaceDto.setItemNo(rs.getString("item_code"));
		stockInterfaceDto.setAttribute(rs.getString("attribute"));
		stockInterfaceDto.setAttribute1(""); // line item no will added later
		stockInterfaceDto.setAttribute2(rs.getString("attribute_2"));
		stockInterfaceDto.setAttribute3(rs.getString("attribute_3"));
		stockInterfaceDto.setLogisticPartnerName(rs.getString("logistic_partner_name"));
		stockInterfaceDto.setLogisticDocNumber(rs.getString("logistic_doc_number"));
		stockInterfaceDto.setIgstPercentage(rs.getString("igst_percentage"));
		stockInterfaceDto.setIgstAmount(rs.getString("igst_amount"));
		stockInterfaceDto.setSgstPercentage(rs.getString("sgst_percentage"));
		stockInterfaceDto.setSgstAmount(rs.getString("sgst_amount"));
		stockInterfaceDto.setCgstPercentage(rs.getString("cgst_percentage"));
		stockInterfaceDto.setCgstAmount(rs.getString("cgst_amount"));
		stockInterfaceDto.setUtgstPercentage(rs.getString("utgst_percentage"));
		stockInterfaceDto.setUtgstAmount(rs.getString("utgst_amount"));
		stockInterfaceDto.setRecordId(""); // will be added later
		stockInterfaceDto.setBtqCode(rs.getString("btq_code"));
		stockInterfaceDto.setBusinessDate2(rs.getString("business_date"));

		return stockInterfaceDto;
	}

}
