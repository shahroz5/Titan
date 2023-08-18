/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.BoutiqueSalesDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class BoutiqueSalesFileHdrMapper implements RowMapper<BoutiqueSalesDto> {

	@Override
	public BoutiqueSalesDto mapRow(ResultSet rs, int rowNum) throws SQLException {

		BoutiqueSalesDto boutiqueSalesDto = new BoutiqueSalesDto();

		boutiqueSalesDto.setRecType(rs.getString("rec_type"));
		boutiqueSalesDto.setHdrCustomerNo(rs.getString("customer_no"));
		boutiqueSalesDto.setHdrCustomerName(rs.getString("customer_name"));
		boutiqueSalesDto.setHdrOrderSource(rs.getString("order_source"));
		boutiqueSalesDto.setHdrSysDocumentRef(rs.getString("sys_document_ref"));
		boutiqueSalesDto.setHdrOrderType(rs.getString("order_type"));
		boutiqueSalesDto.setHdrShipOrg(rs.getString("ship_org"));
		boutiqueSalesDto.setHdrPriceList(rs.getString("price_list"));
		boutiqueSalesDto.setHdrSalesRep(rs.getString("salesrep"));
		boutiqueSalesDto.setHdrItemAttribute1(rs.getString("item_attribute1"));
		boutiqueSalesDto.setHdrItemAttribute2(rs.getString("item_attribute2"));
		boutiqueSalesDto.setHdrItemAttribute3(rs.getString("item_attribute3"));
		boutiqueSalesDto.setHdrItemAttribute4(rs.getInt("item_attribute4"));
		boutiqueSalesDto.setHdrItemAttribute5(rs.getString("item_attribute5"));
		boutiqueSalesDto.setHdrItemAttribute6(
				CalendarUtils.formatDateToString(rs.getDate("item_attribute6"), FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		boutiqueSalesDto.setHdrItemAttribute7(rs.getString("item_attribute7"));

		return boutiqueSalesDto;

	}
}
