/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.file.dto.DebitNoteDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class CmRoundingOffRowMapper implements RowMapper<DebitNoteDto> {

	private static final String ROUNDING_VARIANCE = "rounding_variance";

	@Override
	public DebitNoteDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		DebitNoteDto debitNoteDto = new DebitNoteDto();
		debitNoteDto.setTrxDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setGiDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setReference(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
				+ "CM"
				+ String.join("",
						Lists.reverse(Arrays
								.stream(rs.getDate(FileIntegrationConstants.DOC_DATE).toString().trim().split("-"))
								.collect(Collectors.toList()))));
		debitNoteDto.setReference1(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
				+ "CM"
				+ String.join("",
						Lists.reverse(Arrays
								.stream(rs.getDate(FileIntegrationConstants.DOC_DATE).toString().trim().split("-"))
								.collect(Collectors.toList())))
				+ "/");
		debitNoteDto.setCurrency(rs.getString("currency_code"));
		debitNoteDto.setSource("EPOSS");
		debitNoteDto.setCustomerNo(rs.getString("sap_code"));
		debitNoteDto.setCustomerName(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setSalesrepName(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setMemoLine("CMRoundingoff");
		debitNoteDto.setQty(1);
		BigDecimal roundingVariance = rs.getBigDecimal(ROUNDING_VARIANCE) == null ? new BigDecimal("0")
				: rs.getBigDecimal(ROUNDING_VARIANCE);
		debitNoteDto.setAmount1(roundingVariance);
		debitNoteDto.setAmount2(roundingVariance);
		debitNoteDto.setPurchaseOrder("CM" + String.join("",
				Lists.reverse(Arrays.stream(rs.getDate(FileIntegrationConstants.DOC_DATE).toString().trim().split("-"))
						.collect(Collectors.toList()))));
		debitNoteDto.setBtqCode(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setLine("Line");
		if (roundingVariance != null && roundingVariance.compareTo(BigDecimal.ZERO) > 0) {
			// debit line
			debitNoteDto.setPaymentTerm("D001");
			debitNoteDto.setTransactionType("DRoundoff");
		} else {
			// credit line
			debitNoteDto.setTransactionType("CRoundoff");
			debitNoteDto.setPaymentTerm("");
		}
		debitNoteDto.setOrg("B" + rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setLocation1("B" + rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setRecordId(0);
		debitNoteDto.setLocation2(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		return debitNoteDto;
	}

}
