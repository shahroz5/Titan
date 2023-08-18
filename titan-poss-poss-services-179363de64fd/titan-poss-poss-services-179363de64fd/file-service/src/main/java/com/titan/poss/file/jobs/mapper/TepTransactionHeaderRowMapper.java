package com.titan.poss.file.jobs.mapper;

import org.springframework.jdbc.core.RowMapper;

import com.titan.poss.file.dto.TepTransactionDto;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Component;

import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.utils.CalendarUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Slf4j
@Component
public class TepTransactionHeaderRowMapper implements RowMapper<TepTransactionDto> {

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
		tepTransaction.setSgstPercentage(rs.getBigDecimal("sgst_percentage").setScale(1,RoundingMode.DOWN));
		tepTransaction.setSgstValue(rs.getBigDecimal("sgst_value"));
		tepTransaction.setCgstPercentage(rs.getBigDecimal("cgst_percentage").setScale(1,RoundingMode.DOWN));
		tepTransaction.setCgstValue(rs.getBigDecimal("cgst_value"));
		tepTransaction.setUtgstPercentage(BigDecimal.ZERO);  
		tepTransaction.setUtgstValue(BigDecimal.ZERO); 	
		tepTransaction.setGoodsExchangeId("");
		tepTransaction.setDocDate(rs.getDate("doc_date"));
		

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

