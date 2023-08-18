package com.titan.poss.file.jobs.mapper;

import java.math.RoundingMode;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.file.dto.DebitNoteDto;

@Component
public class DebitNoteL3FileStepMapper implements RowMapper<DebitNoteDto> {

	@Override
	public DebitNoteDto mapRow(ResultSet rs, int rowNum) throws SQLException {
		DebitNoteDto debitNoteDto = new DebitNoteDto();
        debitNoteDto.setTrxDate(CalendarUtils.formatDateToString(rs.getDate("trx_date"),
                FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
        debitNoteDto.setGiDate(CalendarUtils.formatDateToString(rs.getDate("gi_date"),
                FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		debitNoteDto.setReference(rs.getString("reference"));
		debitNoteDto.setReference1(rs.getString("reference1"));
		debitNoteDto.setBlank1(null);
		debitNoteDto.setCurrency(rs.getString("currency"));
		debitNoteDto.setSource(rs.getString("source"));
		debitNoteDto.setTransactionType(rs.getString("transaction_type"));
		debitNoteDto.setCustomerNo(rs.getString("customer_no"));
		debitNoteDto.setCustomerName(rs.getString("customer_name"));
		debitNoteDto.setSalesrepName(rs.getString("salesrep_name"));
		debitNoteDto.setMemoLine(rs.getString("memo_line"));
		debitNoteDto.setQty(rs.getInt("qty"));
        debitNoteDto.setAmount1(rs.getBigDecimal("amount1").setScale(2, RoundingMode.HALF_UP));
        debitNoteDto.setAmount2(rs.getBigDecimal("amount2").setScale(2, RoundingMode.HALF_UP));
		debitNoteDto.setBlank2(null);
		debitNoteDto.setPurchaseOrder(rs.getString("purchase_order"));
		debitNoteDto.setBtqCode(rs.getString("btq_code"));
		debitNoteDto.setLine(rs.getString("line"));
		debitNoteDto.setPaymentTerm(rs.getString("payment_term"));
		debitNoteDto.setOrg(rs.getString("org"));
		debitNoteDto.setLocation1(rs.getString("location1"));
		debitNoteDto.setRecordId(rs.getInt("record_id"));
		debitNoteDto.setLocation2(rs.getString("location2"));
		debitNoteDto.setDate(CalendarUtils.formatDateToString(rs.getDate("date"),
                FileIntegrationConstants.DD_MM_YY_DATE_FORMAT));
		debitNoteDto.setFileRef(rs.getString("file_ref"));
		return debitNoteDto;
	}
}
