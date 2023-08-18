/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import com.titan.poss.core.utils.CryptoUtil;

import com.titan.poss.file.dto.TepApHdrDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class TepApHdrMapper implements RowMapper<TepApHdrDto> {

	@Override
	public TepApHdrDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		TepApHdrDto tepApHdr = new TepApHdrDto();
		tepApHdr.setRecType("HDR");
		tepApHdr.setInvoiceType("STANDARD");
		tepApHdr.setInvoiceNumber(rs.getString("location_code") + "/" + rs.getString("doc_no") + "/"
				+ rs.getInt("fiscal_year") % 100 + "-" + (rs.getInt("fiscal_year") % 100 + 1));
		tepApHdr.setBusinessDate(rs.getDate("doc_date"));
		tepApHdr.setVendorCode(rs.getString("vendor_code"));
		tepApHdr.setVendorSite(rs.getString("vendor_site"));
		tepApHdr.setAmount(rs.getBigDecimal("final_value").setScale(0, RoundingMode.HALF_UP));
		tepApHdr.setCurrencyCode(rs.getString("currency_code"));
		String description = rs.getString("record_type").equalsIgnoreCase("CN") ? "Credit Note Cancellation_RO Refund"  : "TEP RO REFUND";
		tepApHdr.setDescription(description);
		if(rs.getString("email_id")!= null)
			tepApHdr.setCustomerEmailId(CryptoUtil.decrypt(rs.getString("email_id"),"emailId"));
		else
			tepApHdr.setCustomerEmailId("");
		if(rs.getString("customer_name")!= null)
			tepApHdr.setCustomerName(CryptoUtil.decrypt(rs.getString("customer_name"),"customerName"));
		else
			tepApHdr.setCustomerName("");
		tepApHdr.setCustomerBankAccNo(rs.getString("account_no"));
		if(rs.getString("ifsc_code")!= null)
		{
		tepApHdr.setBankIfscCode(rs.getString("ifsc_code").toUpperCase());
		}
		else
		{
			tepApHdr.setBankIfscCode(rs.getString("ifsc_code"));
		}
		tepApHdr.setBtqEmailId(rs.getString("boutique_email_id"));
		tepApHdr.setLocationCode(rs.getString("location_code"));

		return tepApHdr;
	}

}
