package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.CashDepositCustomRequestDto;
import com.titan.poss.report.dto.request.json.CashDepositRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("CashDeposit")
public class CashDeposit extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public CashDeposit(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("CASH_DEPOSIT", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		//System.out.print("Cash deposit report - in");
		CashDepositRequestDto cashDepositRequestDto=(CashDepositRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(cashDepositRequestDto);
		

		String select="select bd.location_code as [BTQ CODE],\r\n"
				+ "bmv.owner_type as [TYPE],\r\n"
				+ "bmv.region_code as [REGION], \r\n"
				+ "bmv.town_name as [BTQ NAME],\r\n"
				+ "format(cast(bd.business_date as date),'dd/MM/yyyy') as [Business Date],\r\n"
				+ "bdm.fiscal_year as [FY],\r\n"
				+ "bd.payment_code as [Payment Type],\r\n"
				+ "\r\n"
				+ "CASE WHEN JSON_VALUE(rs.revenue_details,'$.data[0].paymentCode')='CASH' THEN\r\n"
				+ "JSON_VALUE(rs.revenue_details,'$.data[0].payments')\r\n"
				+ "ELSE NULL END as [POSS Amount Collected],\r\n"
				+ "\r\n"
				+ "CASE WHEN JSON_VALUE(rs.revenue_details,'$.data[0].paymentCode')='CASH' THEN\r\n"
				+ "JSON_VALUE(rs.ghs_revenue_details,'$.data[0].payments') \r\n"
				+ "ELSE NULL END as [GHS Amount Collected],	\r\n"
				+ "CASE WHEN JSON_VALUE(rs.revenue_details,'$.data[0].paymentCode')='CASH' OR  JSON_VALUE(rs.revenue_details,'$.data[0].paymentCode')='CASH' THEN \r\n"
				+ "ISNULL(CAST(JSON_VALUE(rs.revenue_details,'$.data[0].payments') as float),0)+ISNULL(CAST(JSON_VALUE(rs.ghs_revenue_details,'$.data[0].payments') as float),0)\r\n"
				+ "ELSE NULL END as [POSS + GHS = Total amount to be deposited],\r\n"
				+ "--bd.amount as [Bill Amount], \r\n"
				+ "bd.deposit_slip_no as [Deposit Slip No],\r\n"
				+ "format(cast(bd.deposit_date as date),'dd/MM/yyyy') as [Deposited Date],\r\n"
				+ "bd.created_by as [Depositors Name],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfTwoThousandNotes') as [2000 Qty],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfTwoThousandNotes')*2000 as [2000 Value],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOFiveHundredNotes') as [500 Qty],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOFiveHundredNotes')*500 as [500 Value],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfTwoHundredNotes') as [200 Qty],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfTwoHundredNotes')*200 as [200 Value],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfHundredNotes') as [100 Qty],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfHundredNotes')*100 as [100 Value],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfFiftyNotes') as [50 Qty],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfFiftyNotes')*50 as [50 Value],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfTwentyNotes') as [20 Qty],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfTwentyNotes')*20 as [20 Value],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfTenNotes') as [10 Qty],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfTenNotes')*10 as [10 Value],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfFiveNotes') as [5 Qty],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfFiveNotes')*5 as [5 Value],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfTwoNotes') as [2 Qty],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfTwoNotes')*2 as [2 Value],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfOneNotes') as [1 Qty],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.noOfOneNotes')*1 as [1 Value],\r\n"
				+ "JSON_VALUE(bds.denomination_details,'$.data.totalCoinsAmount') as [Total Coins Amount], \r\n"
				+ "bd.deposit_amount as [Deposited Amount],\r\n"
				+ "FORMAT((bd.amount-bd.deposit_amount),'N0') as [Value Difference]\r\n"
				+ "from reports.dbo.bank_deposits bd, reports.dbo.boutique_master_view bmv, reports.dbo.business_day_master bdm, reports.dbo.bank_deposit_summary bds,reports.dbo.revenue_summary rs \r\n"
				+ "where bd.location_code=bmv.location_code \r\n"
				+ "and bdm.id=bd.day_master_id	 \r\n"
				+ "and rs.day_master_id=bd.day_master_id and rs.location_code=bd.location_code\r\n"
				+ "and bd.payment_code='CASH'\r\n"
				+ "and bds.id=bd.deposit_summary_id";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
		//System.exit(1);
		//return "select report_name as reportname, access_type as AccessType from report_master";
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		CashDepositRequestDto cashDepositRequestDto= (CashDepositRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(cashDepositRequestDto.getFromDate())
				&& StringUtils.isEmpty(cashDepositRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(cashDepositRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(cashDepositRequestDto.getToDate());
			query.append(" AND (bd.business_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(cashDepositRequestDto, query);
		if (cashDepositRequestDto.getCashDepositCustomRequestDto() != null) {
			validateCustomInputAndAppend(cashDepositRequestDto, query);
		}
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(CashDepositRequestDto cashDepositRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(CashDepositRequestDto cashDepositRequestDto, StringBuilder query) {
		
		
		if (cashDepositRequestDto.getSubRegionCode() != null && !cashDepositRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(cashDepositRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cashDepositRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + cashDepositRequestDto.getStateId()).append("'");
		}
		if (cashDepositRequestDto.getTownId() != null && !cashDepositRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(cashDepositRequestDto.getTownId())).append(")");
		}
		if (cashDepositRequestDto.getLocationCode() != null && !cashDepositRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(cashDepositRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cashDepositRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + cashDepositRequestDto.getCountryId()).append("'");
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
		
		CashDepositRequestDto cashDepositRequestDto = (CashDepositRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, CashDepositRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			CashDepositCustomRequestDto cashDepositCustomRequestDto = new CashDepositCustomRequestDto();
			cashDepositCustomRequestDto.validate(reportRequestDto.getCustomFields());
			cashDepositCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), CashDepositCustomRequestDto.class);
			cashDepositRequestDto.setCashDepositCustomRequestDto(cashDepositCustomRequestDto);
		}
		
		return cashDepositRequestDto;
	}
	
	

}
