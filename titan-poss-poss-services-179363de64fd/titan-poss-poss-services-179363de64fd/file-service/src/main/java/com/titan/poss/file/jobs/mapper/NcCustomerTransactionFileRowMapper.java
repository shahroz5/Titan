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

import com.titan.poss.file.dto.NcCustomerTransactionStageDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class NcCustomerTransactionFileRowMapper implements RowMapper<NcCustomerTransactionStageDto> {

	@Override
	public NcCustomerTransactionStageDto mapRow(ResultSet rs, int rowNum) throws SQLException {

		NcCustomerTransactionStageDto ncCustomerTransactionStageDto = new NcCustomerTransactionStageDto();
		ncCustomerTransactionStageDto.setChannel(rs.getString("channel"));
		ncCustomerTransactionStageDto.setStoreCode(rs.getString("store_code"));
		ncCustomerTransactionStageDto.setUnifiedLoyaltyNo(rs.getString("unified_loyalty_no"));
		ncCustomerTransactionStageDto
				.setTransactionDate(rs.getString("transaction_date"));
		ncCustomerTransactionStageDto.setGvCode(rs.getString("gv_code"));
		ncCustomerTransactionStageDto.setInvoiceNumber(rs.getString("invoice_number"));
		ncCustomerTransactionStageDto.setLineItemNo(rs.getString("line_item_no"));
		ncCustomerTransactionStageDto.setItemCode(rs.getString("item_code"));
		ncCustomerTransactionStageDto.setCategoryCode(rs.getString("category_code"));
		ncCustomerTransactionStageDto.setQuantity(rs.getInt("quantity"));
		ncCustomerTransactionStageDto.setGrossAmount(rs.getBigDecimal("gross_amount").setScale(2, RoundingMode.HALF_UP));
		ncCustomerTransactionStageDto.setDiscount(rs.getBigDecimal("discount").setScale(2, RoundingMode.HALF_UP));
		ncCustomerTransactionStageDto
				.setEligibleAmount(rs.getBigDecimal("eligible_amount").setScale(2, RoundingMode.HALF_UP));
		ncCustomerTransactionStageDto.setRrNumber(rs.getString("rr_number"));
		ncCustomerTransactionStageDto.setTransactionType(rs.getString("transaction_type"));
		ncCustomerTransactionStageDto.setReference(rs.getString("reference"));
		ncCustomerTransactionStageDto.setDiscountCode(rs.getString("discount_code"));
		ncCustomerTransactionStageDto.setCmDate(rs.getString("cm_date"));
		ncCustomerTransactionStageDto.setCmNo(rs.getString("cm_no"));
		ncCustomerTransactionStageDto.setBrandName(rs.getString("brand_name"));
		ncCustomerTransactionStageDto.setCmLocationCode(rs.getString("cm_location_code"));
		ncCustomerTransactionStageDto.setCmLineItemNo(rs.getString("cm_line_item_no"));
		return ncCustomerTransactionStageDto;
	}

}
