package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.ManualBillCustomRequestDto;
import com.titan.poss.report.dto.request.json.ManualBillRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("ManualBill")
public class ManualBill extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public ManualBill(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("MANUAL_BILL_REPORT", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		ManualBillRequestDto manualBillRequestDto=(ManualBillRequestDto) setCustomInput(reportRequestDto);
		
		StringBuilder appendWhereClause = appendQuery(manualBillRequestDto);
		

		String select="select \r\n"
				+ "st.location_code as [LocationCode],\r\n"
				+ "bmv.brand_code as [Brand],\r\n"
				+ "bmv.owner_type as [Type],\r\n"
				+ "bmv.sub_region_code as [Region],\r\n"
				+ "bmv.state_name as [State], \r\n"
				+ "bmv.town_name as [City],\r\n"
				+ "st.txn_type+'-'+st.sub_txn_type as [Transcation Type], \r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.validationType') as [Validation Type],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.manualBillNo') as [Bill No],\r\n"
				+ "CONVERT(varchar,DATEADD(SECOND,CAST(JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.manualBillDate') as BIGINT)/1000,'1970/1/1'),103) as [Bill Date],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.manualBillValue') as [Manual Bill Value],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.approvedBy') as [Approved by],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.remarks') as [Manual Bill Reason],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.metalRates.J.totalMetalWeight') as [Gold Weight],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.metalRates.L.totalMetalWeight') as [Platinum Weight],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.metalRates.P.totalMetalWeight') as [Silver Weight],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.metalRates.J.ratePerUnit') as [Gold Rate],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.metalRates.L.ratePerUnit') as [Platinum Rate],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.metalRates.P.ratePerUnit') as [Silver Rate],\r\n"
				+ "NULL as [Is Bi-Metal],\r\n"
				+ "ct.ulp_id as [ULP No],\r\n"
				+ "ct.customer_name as [Customer Name],\r\n"
				+ "ct.mobile_number as [Mobile No],\r\n"
				+ "st.doc_no as [Invoice No.],\r\n"
				+ "st.doc_date as [Invoice Date],\r\n"
				+ "JSON_VALUE(st.manual_bill_details,'$.manualBillDetails.requestStatus') as [Approve or Reject]\r\n"
				+ "from sales_transaction st\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "left outer join customer_transaction ct on ct.id=st.id\r\n"
				+ "where st.manual_bill_details IS NOT NULL and st.manual_bill_details NOT IN ('{}')\r\n"
				+ "and st.status NOT IN ('DELETED')";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		ManualBillRequestDto manualBillRequestDto= (ManualBillRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(manualBillRequestDto.getFromDate())
				&& StringUtils.isEmpty(manualBillRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(manualBillRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(manualBillRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(manualBillRequestDto, query);
		if (manualBillRequestDto.getManualBillCustomRequestDto() != null) {
			validateCustomInputAndAppend(manualBillRequestDto, query);
		}
		query.append(" order by st.location_code,st.doc_date");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(ManualBillRequestDto manualBillRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(ManualBillRequestDto manualBillRequestDto, StringBuilder query) {
		
		
		if (manualBillRequestDto.getSubRegionCode() != null && !manualBillRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(manualBillRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(manualBillRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + manualBillRequestDto.getStateId()).append("'");
		}
		if (manualBillRequestDto.getTownId() != null && !manualBillRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(manualBillRequestDto.getTownId())).append(")");
		}
		if (manualBillRequestDto.getLocationCode() != null && !manualBillRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(manualBillRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(manualBillRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + manualBillRequestDto.getCountryId()).append("'");
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
		
		ManualBillRequestDto manualBillRequestDto = (ManualBillRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, ManualBillRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			ManualBillCustomRequestDto manualBillCustomRequestDto = new ManualBillCustomRequestDto();
			manualBillCustomRequestDto.validate(reportRequestDto.getCustomFields());
			manualBillCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), ManualBillCustomRequestDto.class);
			manualBillRequestDto.setManualBillCustomRequestDto(manualBillCustomRequestDto);
		}
		
		return manualBillRequestDto;
	}
	
	

}
