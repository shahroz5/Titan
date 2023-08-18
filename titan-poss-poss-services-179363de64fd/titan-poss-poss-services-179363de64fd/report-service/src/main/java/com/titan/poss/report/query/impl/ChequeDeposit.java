package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.ChequeDepositCustomRequestDto;
import com.titan.poss.report.dto.request.json.ChequeDepositRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("ChequeDeposit")
public class ChequeDeposit extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public ChequeDeposit(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("CHEQUE_DEPOSIT", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		ChequeDepositRequestDto chequeDepositRequestDto=(ChequeDepositRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(chequeDepositRequestDto);
		

		String select="select bd.location_code as \"BTQ CODE\", \r\n"
				+ "bmv.owner_type as \"TYPE\",\r\n"
				+ "bmv.region_code as \"REGION\",\r\n"
				+ "bmv.town_name as \"BTQ NAME\",\r\n"
				+ "FORMAT(CAST(bd.business_date AS DATE),'dd/MM/yyyy') as \"Business Date\",\r\n"
				+ "bdm.fiscal_year as \"FY\",\r\n"
				+ "bd.payment_code as \"Payment Type\",\r\n"
				+ "bd.payer_bank_name as \"Bank Name\",\r\n"
				+ "bd.instrument_no as \"Cheque/Instrument Number\",\r\n"
				+ "format(CAST(bd.instrument_date as DATE),'dd/MM/yyyy') as \"Cheque Date\",\r\n"
				+ "bd.amount as \"Cheque Amount\", \r\n"
				+ "bd.deposit_slip_no as \"Deposit Slip No\", \r\n"
				+ "FORMAT(CAST(bd.deposit_date AS DATE),'dd/MM/yyyy') as \"Deposited Date\", \r\n"
				+ "bd.created_by as \"Depositors Name\",\r\n"
				+ "bd.deposit_amount as \"Deposited Amount\",\r\n"
				+ "FORMAT((bd.amount-bd.deposit_amount),'N0') as \"Value Difference\",\r\n"
				+ "pd.sales_txn_type as [Cheque billed Doc Type],\r\n"
				+ "st.doc_no as [Ref.Doc No],\r\n"
				+ "FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy')as [Ref.Doc Date]\r\n"
				+ "from reports.dbo.bank_deposits bd\r\n"
				+ "inner join reports.dbo.boutique_master_view bmv on bd.location_code=bmv.location_code \r\n"
				+ "inner join reports.dbo.business_day_master bdm on bdm.id=bd.day_master_id\r\n"
				+ "left outer join reports.dbo.payment_details pd on pd.instrument_no=bd.instrument_no and pd.instrument_date=bd.instrument_date and pd.instrument_type=bd.payment_code\r\n"
				+ "and pd.amount=bd.amount\r\n"
				+ "left outer join reports.dbo.sales_transaction st on st.id=pd.sales_txn_id and pd.sales_txn_type=st.txn_type\r\n"
				+ "where bd.payment_code='CHEQUE'";
		
		//String s= select+""+ appendWhereClause;
		//System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		ChequeDepositRequestDto chequeDepositRequestDto= (ChequeDepositRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(chequeDepositRequestDto.getFromDate())
				&& StringUtils.isEmpty(chequeDepositRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(chequeDepositRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(chequeDepositRequestDto.getToDate());
			query.append(" AND (bd.business_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(chequeDepositRequestDto, query);
		if (chequeDepositRequestDto.getChequeDepositCustomRequestDto() != null) {
			validateCustomInputAndAppend(chequeDepositRequestDto, query);
		}
		query.append(" order by bd.location_code,bd.business_date");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(ChequeDepositRequestDto chequeDepositRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(ChequeDepositRequestDto chequeDepositRequestDto, StringBuilder query) {
		
		
		if (chequeDepositRequestDto.getSubRegionCode() != null && !chequeDepositRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(chequeDepositRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(chequeDepositRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + chequeDepositRequestDto.getStateId()).append("'");
		}
		if (chequeDepositRequestDto.getTownId() != null && !chequeDepositRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(chequeDepositRequestDto.getTownId())).append(")");
		}
		if (chequeDepositRequestDto.getLocationCode() != null && !chequeDepositRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(chequeDepositRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(chequeDepositRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + chequeDepositRequestDto.getCountryId()).append("'");
		}

		return query;
	}

	private StringBuilder formatListToInClause(List<String> values) {
		
		
		StringBuilder sb = new StringBuilder();
		int count = 0;
		for (String value : values) {

			sb.append("'" + value + "'");
			if (count != values.size() - 1) {
				sb.append(",");
			}
			count++;
		}
		return sb;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		
		ChequeDepositRequestDto chequeDepositRequestDto = (ChequeDepositRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, ChequeDepositRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			ChequeDepositCustomRequestDto chequeDepositCustomRequestDto = new ChequeDepositCustomRequestDto();
			chequeDepositCustomRequestDto.validate(reportRequestDto.getCustomFields());
			chequeDepositCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), ChequeDepositCustomRequestDto.class);
			chequeDepositRequestDto.setChequeDepositCustomRequestDto(chequeDepositCustomRequestDto);
		}
		
		return chequeDepositRequestDto;
	}
	
	

}
