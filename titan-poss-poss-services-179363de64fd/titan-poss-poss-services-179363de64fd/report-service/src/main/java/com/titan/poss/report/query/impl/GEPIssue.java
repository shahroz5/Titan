package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.GEPIssueCustomRequestDto;
import com.titan.poss.report.dto.request.json.GEPIssueRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("GEPIssue")
public class GEPIssue extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public GEPIssue(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("GEP_ISSUE_REPORT", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		GEPIssueRequestDto gepIssueRequestDto=(GEPIssueRequestDto) setCustomInput(reportRequestDto);
		
		StringBuilder appendWhereClause = appendQuery(gepIssueRequestDto);
		

		String select="select st.location_code as [BTQ CODE], \r\n"
				+ "bmv.owner_type as [TYPE],\r\n"
				+ "bmv.town_name as [CITY],\r\n"
				+ "bmv.state_name as [STATE],\r\n"
				+ "bmv.sub_region_code as [SUB REGION],\r\n"
				+ "FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [DATE],\r\n"
				+ "st.fiscal_year as [FISCAL YEAR],\r\n"
				+ "st.doc_no as [GEP NO],\r\n"
				+ "st.status as [Status], \r\n"
				+ "cn.doc_no as [CN NO],\r\n"
				+ "cn.status as [CN Status],\r\n"
				+ "ct.customer_id as [Customer No],\r\n"
				+ "ct.customer_name as [Customer Name], \r\n"
				+ "ct.ulp_id as [ULP No], \r\n"
				+ "JSON_VALUE(st.metal_rate_details ,'$.metalRates.J.ratePerUnit') as [Gold Rate],\r\n"
				+ "JSON_VALUE(st.metal_rate_details ,'$.metalRates.L.ratePerUnit') as [Platinum Rate],\r\n"
				+ "JSON_VALUE(st.metal_rate_details ,'$.metalRates.P.ratePerUnit') as [Silver Rate],\r\n"
				+ "ged.item_type as [ITEM TYPE], \r\n"
				+ "ged.item_code as [VARIANT CODE], \r\n"
				+ "ged.total_weight as [WEIGHT],\r\n"
				+ "ged.purity as [PURITY],\r\n"
				+ "ged.karat as [KARATAGE],\r\n"
				+ "CASE WHEN ged.purity >=99.5 THEN 'YES' ELSE 'NO' END as [PURE GOLD],\r\n"
				+ "JSON_VALUE(ged.price_details,'$.netValue') as [Exchange Value],\r\n"
				+ "JSON_VALUE(ged.price_details,'$.deductionValue') as [GEP DEDUCTION],\r\n"
				+ "ged.final_value as [TOTAL CN VALUE], \r\n"
				+ "JSON_VALUE(ged.price_details,'$.deductionPercentage') as [GEP DEDUCTION %],\r\n"
				+ "JSON_VALUE(ge.exchange_details,'$.data.isDeclarationFormSubmitted') as [Is Pre Declaration Form Submitted],\r\n"
				+ "em.emp_name as [RSO NAME],\r\n"
				+ "CASE WHEN st.manual_bill_details IS NOT NULL THEN '1' ELSE '0' END as [IS GEP MB],\r\n"
				+ "JSON_VALUE(st.manual_bill_details, '$.manualBillDetails.manualBillNo') as [MB NO],\r\n"
				+ "CONVERT(varchar,DATEADD(SECOND,CAST(JSON_VALUE(st.manual_bill_details, '$.manualBillDetails.manualBillDate') as BIGINT)/1000,'1970/1/1'),103) as [MB Date],\r\n"
				+ "st.remarks as [REMARKS], \r\n"
				+ "st.created_by [LOGIN ID],\r\n"
				+ "rt.doc_no as [GEP CANCELLATION NO],\r\n"
				+ "rt.fiscal_year as [REF FISCAL YEAR],\r\n"
				+ "st1.txn_type as [CN REDEEMED DOC TYPE],\r\n"
				+ "st1.doc_no as [CN REDEEMED DOC NO],\r\n"
				+ "st1.fiscal_year as [FY]\r\n"
				+ "from sales_transaction st\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "inner join credit_note cn on cn.sales_txn_id=st.id\r\n"
				+ "left outer join customer_transaction ct on ct.id=st.id\r\n"
				+ "inner join goods_exchange ge on ge.id=st.id\r\n"
				+ "inner join goods_exchange_details ged on ged.goods_exchange_id=st.id\r\n"
				+ "left outer join employee_master em on em.employee_code=st.employee_code\r\n"
				+ "left outer join refund_transaction rt on rt.ref_sales_id=st.id\r\n"
				+ "outer apply\r\n"
				+ "(\r\n"
				+ "select pd.sales_txn_id from payment_details pd where pd.status='COMPLETED' and reference_3=cn.id and pd.payment_code='CREDIT NOTE'\r\n"
				+ ") cnRedeemption\r\n"
				+ "left outer join sales_transaction st1 on st1.id=cnRedeemption.sales_txn_id\r\n"
				+ "where st.txn_type='GEP' and st.status NOT IN('DELETED')";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		GEPIssueRequestDto gepIssueRequestDto= (GEPIssueRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(gepIssueRequestDto.getFromDate())
				&& StringUtils.isEmpty(gepIssueRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(gepIssueRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(gepIssueRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(gepIssueRequestDto, query);
		if (gepIssueRequestDto.getGepIssueCustomRequestDto() != null) {
			validateCustomInputAndAppend(gepIssueRequestDto, query);
		}
		query.append(" order by st.location_code, st.doc_date");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(GEPIssueRequestDto gepIssueRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(GEPIssueRequestDto gepIssueRequestDto, StringBuilder query) {
		
		
		if (gepIssueRequestDto.getSubRegionCode() != null && !gepIssueRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(gepIssueRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(gepIssueRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + gepIssueRequestDto.getStateId()).append("'");
		}
		if (gepIssueRequestDto.getTownId() != null && !gepIssueRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(gepIssueRequestDto.getTownId())).append(")");
		}
		if (gepIssueRequestDto.getLocationCode() != null && !gepIssueRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(gepIssueRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(gepIssueRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + gepIssueRequestDto.getCountryId()).append("'");
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
		
		GEPIssueRequestDto gepIssueRequestDto = (GEPIssueRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, GEPIssueRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			GEPIssueCustomRequestDto gepIssueCustomRequestDto = new GEPIssueCustomRequestDto();
			gepIssueCustomRequestDto.validate(reportRequestDto.getCustomFields());
			gepIssueCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), GEPIssueCustomRequestDto.class);
			gepIssueRequestDto.setGepIssueCustomRequestDto(gepIssueCustomRequestDto);
		}
		
		return gepIssueRequestDto;
	}
	
	

}
