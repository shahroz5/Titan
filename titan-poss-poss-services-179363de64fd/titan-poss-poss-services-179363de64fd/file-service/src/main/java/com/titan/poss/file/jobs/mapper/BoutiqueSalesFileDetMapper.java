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
import com.titan.poss.file.dto.BoutiqueSalesDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class BoutiqueSalesFileDetMapper implements RowMapper<BoutiqueSalesDto> {

	@Override
	public BoutiqueSalesDto mapRow(ResultSet rs, int rowNum) throws SQLException {

		BoutiqueSalesDto boutiqueSalesDto = new BoutiqueSalesDto();

		boutiqueSalesDto.setRecType(rs.getString("rec_type"));
		boutiqueSalesDto.setDetSysDocumetRef(rs.getString("sys_documet_ref"));
		boutiqueSalesDto.setDetSysLineRef(rs.getInt("sys_line_ref"));
		boutiqueSalesDto.setDetShipmentRef(rs.getInt("shipment_ref"));
		boutiqueSalesDto.setDetInventoryItemRef(rs.getString("inventory_item_ref"));
		boutiqueSalesDto.setDetCustLineNo(rs.getString("cust_line_no"));
		boutiqueSalesDto.setDetOrdQty1(rs.getBigDecimal("ord_qty1").setScale(3, RoundingMode.HALF_UP).toString());
		boutiqueSalesDto.setDetOrdQty2(rs.getBigDecimal("ord_qty2").setScale(3, RoundingMode.HALF_UP).toString());
		boutiqueSalesDto.setDetUnitSellingPrice(rs.getBigDecimal("unit_selling_price").setScale(4, RoundingMode.HALF_UP).toString());
		boutiqueSalesDto.setDetUnitListPrice(rs.getBigDecimal("unit_list_price").setScale(4, RoundingMode.HALF_UP).toString());
		boutiqueSalesDto.setDetScheduleDate(CalendarUtils.formatDateToString(rs.getDate("schedule_date"),
				FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		boutiqueSalesDto.setDetPriceList(rs.getString("price_list"));
		boutiqueSalesDto.setDetShipFromOrg(rs.getString("ship_from_org"));
		boutiqueSalesDto.setDetCalculatePrice(rs.getString("calculate_price"));
		boutiqueSalesDto.setDetItemAttribute1(rs.getBigDecimal("item_attribute_1"));
		boutiqueSalesDto.setDetItemAttribute2(rs.getBigDecimal("item_attribute_2").setScale(4, RoundingMode.HALF_UP).toString());
		boutiqueSalesDto.setDetItemAttribute3(rs.getBigDecimal("item_attribute_3").setScale(4, RoundingMode.HALF_UP).toString());
		boutiqueSalesDto.setDetItemAttribute4(rs.getBigDecimal("item_attribute_4").setScale(4, RoundingMode.HALF_UP).toString());
		boutiqueSalesDto.setDetItemAttribute5(rs.getString("item_attribute_5"));
		boutiqueSalesDto.setDetItemAttribute6(rs.getString("item_attribute_6"));
		boutiqueSalesDto.setDetItemAttribute7(rs.getString("item_attribute_7"));
		boutiqueSalesDto.setDetItemAttribute8(rs.getString("item_attribute_8"));
		boutiqueSalesDto.setDetItemAttribute9(rs.getString("item_attribute_9"));
		boutiqueSalesDto.setDetItemAttribute10(rs.getBigDecimal("item_attribute_10"));
		boutiqueSalesDto.setDetItemAttribute11(rs.getBigDecimal("item_attribute_11"));
		boutiqueSalesDto.setDetItemAttribute12(rs.getInt("item_attribute_12"));
		boutiqueSalesDto.setDetItemAttribute13(rs.getString("item_attribute_13"));
		boutiqueSalesDto.setDetItemAttribute14(CalendarUtils.formatDateToString(rs.getDate("item_attribute_14"),
				FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		boutiqueSalesDto.setDetItemAttribute15(rs.getString("item_attribute_15"));

		return boutiqueSalesDto;

	}

}
