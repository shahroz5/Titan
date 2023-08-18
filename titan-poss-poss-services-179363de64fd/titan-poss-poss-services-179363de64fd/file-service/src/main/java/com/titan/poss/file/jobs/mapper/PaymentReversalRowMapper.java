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
public class PaymentReversalRowMapper implements RowMapper<DebitNoteDto> {

	private static final String AMOUNT = "amount";

	@Override
	public DebitNoteDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		DebitNoteDto debitNoteDto = new DebitNoteDto();
		debitNoteDto.setTrxDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setGiDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		debitNoteDto.setReference(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
				+ rs.getString("txn_type") + rs.getString("doc_no"));
		debitNoteDto.setReference1(rs.getString(FileIntegrationConstants.LOCATION_CODE) + rs.getString("fiscal_year")
				+ rs.getString("txn_type") + rs.getString("doc_no") + "/");
		debitNoteDto.setCurrency(rs.getString("currency_code"));
		debitNoteDto.setSource("EPOSS");
		String paymentCode = toDisplayCase(rs.getString("payment_code"));
		if(paymentCode.length() == 2)
		{
			paymentCode.toUpperCase();
		}
		else if(paymentCode.equalsIgnoreCase("UNIPAY") || paymentCode.equalsIgnoreCase("CARD"))
		{
			paymentCode = "CC";
		}
		debitNoteDto.setTransactionType(
				rs.getString(FileIntegrationConstants.LOCATION_CODE) + paymentCode);
		debitNoteDto.setCustomerNo(rs.getString("sap_code"));
		debitNoteDto.setCustomerName(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setSalesrepName(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setMemoLine("CM Cancellation");
		debitNoteDto.setQty(1);
		debitNoteDto.setAmount1(rs.getBigDecimal(AMOUNT));
		debitNoteDto.setAmount2(rs.getBigDecimal(AMOUNT));
		debitNoteDto
				.setPurchaseOrder(
						rs.getString(FileIntegrationConstants.LOCATION_CODE)
								+ String.join("",
										Lists.reverse(Arrays.stream(rs.getDate(FileIntegrationConstants.DOC_DATE)
												.toString().trim().split("-")).collect(Collectors.toList())))
								+ "_" + paymentCode);
		debitNoteDto.setBtqCode(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setLine("Line");
		if (rs.getBigDecimal(AMOUNT).compareTo(BigDecimal.ZERO) > 0)
			debitNoteDto.setPaymentTerm("D001");

		debitNoteDto.setOrg("B" + rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setLocation1("B" + rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setRecordId(0);
		debitNoteDto.setLocation2(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		debitNoteDto.setDate(rs.getString(FileIntegrationConstants.DOC_DATE));
		return debitNoteDto;
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
