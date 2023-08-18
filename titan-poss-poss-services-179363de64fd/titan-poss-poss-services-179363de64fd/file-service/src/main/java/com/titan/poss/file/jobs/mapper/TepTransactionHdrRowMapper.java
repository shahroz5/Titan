/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.TepTransactionDto;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Component
public class TepTransactionHdrRowMapper implements RowMapper<TepTransactionDto> {

	@Override
	public TepTransactionDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		TepTransactionDto tepTransaction = new TepTransactionDto();
		tepTransaction.setRecType("MAIN");
		tepTransaction.setDocType("STANDARD");
		String locationCode = rs.getString("location_code");
		tepTransaction.setVendorName(locationCode);
		tepTransaction.setSiteName("TEP_C");
		tepTransaction.setShipTo("B" + locationCode);
		tepTransaction.setBillTo("B" + locationCode);
		tepTransaction.setItemAttribute13(BigDecimal.ZERO);
		tepTransaction.setBtqId(locationCode);
		tepTransaction.setBusinessDate(CalendarUtils.formatDateToString(rs.getDate("doc_date"), "dd-MM-yy"));
		String taxDetails = rs.getString("tax_details");
		if (!StringUtils.isEmpty(taxDetails)) {
			JsonObject jsonObject = new JsonParser().parse(taxDetails).getAsJsonObject();
			List<TaxCalculationResponseDto> taxDtos = MapperUtil.jsonStrToList(jsonObject.get("taxes").toString(),
					TaxCalculationResponseDto.class);
			tepTransaction.setIgstPercentage(getMaxTaxPercentage(taxDtos, "IGST").setScale(1,RoundingMode.DOWN));
			tepTransaction.setIgstValue(getSumTaxValue(taxDtos, "IGST"));
			if(rs.getString("reg_tep").equals("Y") && getMaxTaxPercentage(taxDtos, "SGST")==BigDecimal.ZERO)
			{
				tepTransaction.setSgstPercentage(new BigDecimal(rs.getString("sgst_percentage")));
				tepTransaction.setSgstValue(new BigDecimal(rs.getString("sgst_value")));
				tepTransaction.setCgstPercentage(new BigDecimal(rs.getString("cgst_percentage")));
				tepTransaction.setCgstValue(new BigDecimal(rs.getString("cgst_value")));
				
			}
			else
			{
				tepTransaction.setSgstPercentage(getMaxTaxPercentage(taxDtos, "SGST").setScale(1,RoundingMode.DOWN));
				tepTransaction.setSgstValue(getSumTaxValue(taxDtos, "SGST"));
				tepTransaction.setCgstPercentage(getMaxTaxPercentage(taxDtos, "CGST").setScale(1,RoundingMode.DOWN));
				tepTransaction.setCgstValue(getSumTaxValue(taxDtos, "CGST"));
			}
			tepTransaction.setUtgstPercentage(getMaxTaxPercentage(taxDtos, "UTGST").setScale(1,RoundingMode.DOWN));
			tepTransaction.setUtgstValue(getSumTaxValue(taxDtos, "UTGST"));
			tepTransaction.setGoodsExchangeId(rs.getString("id"));
			tepTransaction.setDocDate(rs.getDate("doc_date"));
		}

		return tepTransaction;
	}

	private BigDecimal getMaxTaxPercentage(List<TaxCalculationResponseDto> taxDtos, String taxType) {
		BigDecimal maxTaxPercent = BigDecimal.ZERO;
		boolean valuePresent = false;
		for (TaxCalculationResponseDto taxDto : taxDtos) {
			if(taxDto.getData().containsKey(taxType))	{
			TaxDetailDto taxDetailDto = taxDto.getData().get(taxType);
			if (taxDetailDto != null && taxDetailDto.getTaxPercentage().compareTo(maxTaxPercent) >= 0) {
				maxTaxPercent = taxDetailDto.getTaxPercentage();
				valuePresent = true;
			}
		}
		}
		return valuePresent ? maxTaxPercent : BigDecimal.ZERO;
	}

	private BigDecimal getSumTaxValue(List<TaxCalculationResponseDto> taxDtos, String taxType) {
		BigDecimal sumTaxValue = BigDecimal.ZERO;
		boolean valuePresent = false;

		for (TaxCalculationResponseDto taxDto : taxDtos) {
			if(taxDto.getData().containsKey(taxType))	{	
			TaxDetailDto taxDetailDto = taxDto.getData().get(taxType);
			if (taxDetailDto.getTaxValue() != null) {
				sumTaxValue = sumTaxValue.add(taxDetailDto.getTaxValue());
				
				valuePresent = true;
			}
		}
		}
		return valuePresent ? sumTaxValue : BigDecimal.ZERO;
	}
}
