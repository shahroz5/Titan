package com.titan.poss.file.jobs.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.BoutiqueRevenueDto;

@Component
public class BoutiqueRevenueEghsRowMapper implements RowMapper<BoutiqueRevenueDto> {
	
	@Override
	public BoutiqueRevenueDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		BoutiqueRevenueDto boutiqueRevenueDto = new BoutiqueRevenueDto();
		boutiqueRevenueDto.setReceiptNo(rs.getString("instrument_no"));
		boutiqueRevenueDto.setCurrency(rs.getString("currency_code"));
		boutiqueRevenueDto.setAmount(rs.getBigDecimal("amount"));
		boutiqueRevenueDto.setReceiptDate(CalendarUtils.formatDateToString(rs.getDate(FileIntegrationConstants.DOC_DATE),
				FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		boutiqueRevenueDto.setGlDate(CalendarUtils.formatDateToString(rs.getDate(FileIntegrationConstants.DOC_DATE),
				FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		boutiqueRevenueDto.setReceiptMethod(rs.getString(FileIntegrationConstants.LOCATION_CODE) + "QCEGHS");
		boutiqueRevenueDto.setCategory(null);
		boutiqueRevenueDto.setAttribute1(null);
		boutiqueRevenueDto.setAttribute2(null);
		boutiqueRevenueDto.setCustomerName(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		boutiqueRevenueDto.setCustomerNumber(rs.getString("sap_code"));
		boutiqueRevenueDto.setComments("CM" + rs.getString("doc_no"));
		boutiqueRevenueDto.setAttribute3(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		boutiqueRevenueDto.setAttribute4(null);
		boutiqueRevenueDto.setAttribute5("");
		boutiqueRevenueDto.setAttribute6(rs.getString(FileIntegrationConstants.LOCATION_CODE));
		boutiqueRevenueDto.setAttribute7(rs.getDate(FileIntegrationConstants.DOC_DATE));

		return boutiqueRevenueDto;
	}

}
