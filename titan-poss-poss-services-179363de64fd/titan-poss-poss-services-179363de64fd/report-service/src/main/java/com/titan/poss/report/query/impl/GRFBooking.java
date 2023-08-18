package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.GRFBookingCustomRequestDto;
import com.titan.poss.report.dto.request.json.GRFBookingRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("GRFBooking")
public class GRFBooking extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public GRFBooking(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("GRF_BOOKING", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		GRFBookingRequestDto GRFBookingRequestDto=(GRFBookingRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(GRFBookingRequestDto);
		

		String select="select st.location_code as [Location Code], bmv.town_name as [City], bmv.owner_type  as [Channel Type],\r\n"
				+ "bmv.brand_name as [Brand], bmv.sub_region_name as [Region], bmv.state_name as [State],\r\n"
				+ "st.doc_no as [GRF Doc No], FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [GRF Date], \r\n"
				+ "st.fiscal_year as [GRF FISCAL YEAR], ct.customer_name as [Customer Name], ct.mobile_number as [Customer Mobile No], \r\n"
				+ "ct.ulp_id as [Customer ULP No], cn.doc_no as [Credit Note No], cn.amount as [Net Amount], \r\n"
				+ "JSON_VALUE(cn.frozen_rate_details,'$.data.weight') as [Gold Wt. Frozen],\r\n"
				+ " JSON_VALUE(cn.frozen_rate_details,'$.data.ratePerUnit') as [Gold Rate], st.employee_code as [RSO Name],\r\n"
				+ "MOP.PaymentCodes  as [Mode of Payments], \r\n"
				+ "amtCash.Amount as [CASH],\r\n"
				+ "amtCard.Amount as [CARD],\r\n"
				+ "amtCN.Amount as [CREDIT NOTE],\r\n"
				+ "amtRTGS.Amount as [RTGS],\r\n"
				+ "amtGP.Amount as [G PAY],\r\n"
				+ "cn.status as [CN Status], st.remarks as [Remarks],\r\n"
				+ "CASE WHEN cn.merged_cn_id IS NOT NULL THEN 'Yes' ELSE 'No' END as [Is CN Merged],\r\n"
				+ "CASE WHEN cn.merged_cn_id IS NOT NULL THEN \r\n"
				+ "	CASE WHEN cnmerged.ct1ulp_id=cnmerged.ct2ulp_id THEN 'No' ELSE 'Yes' END\r\n"
				+ "ELSE\r\n"
				+ "	''\r\n"
				+ "END as [Is 3rd Party CN Merged],\r\n"
				+ "CASE WHEN cn.merged_cn_id IS NOT NULL THEN \r\n"
				+ "	CASE WHEN cnmerged.ct1ulp_id!=cnmerged.ct2ulp_id THEN\r\n"
				+ "		CASE WHEN cnmerged.customer_name IS NOT NULL THEN cnmerged.customer_name ELSE '' END\r\n"
				+ "	ELSE '' END\r\n"
				+ "ELSE '' END as [3rd Party Customer Name],\r\n"
				+ "CASE WHEN cn.merged_cn_id IS NOT NULL THEN \r\n"
				+ "	CASE WHEN cnmerged.ct1ulp_id!=cnmerged.ct2ulp_id THEN\r\n"
				+ "		CASE WHEN cnmerged.GRFNO IS NOT NULL THEN cnmerged.GRFNO ELSE NULL END  \r\n"
				+ "	ELSE NULL END\r\n"
				+ "ELSE NULL END as [GRF NO],\r\n"
				+ "CASE WHEN cn.merged_cn_id IS NOT NULL THEN \r\n"
				+ "	CASE WHEN cnmerged.ct1ulp_id!=cnmerged.ct2ulp_id THEN\r\n"
				+ "		CASE WHEN cnmerged.mobile_number IS NOT NULL THEN cnmerged.mobile_number ELSE NULL END \r\n"
				+ "	ELSE NULL END \r\n"
				+ "ELSE NULL END as [Mobile],\r\n"
				+ "CASE WHEN cn.merged_cn_id IS NOT NULL THEN \r\n"
				+ "	CASE WHEN cnmerged.ct1ulp_id!=cnmerged.ct2ulp_id THEN\r\n"
				+ "		CASE WHEN cnmerged.CNNO IS NOT NULL THEN cnmerged.CNNO ELSE NULL END \r\n"
				+ "	ELSE NULL END \r\n"
				+ "ELSE NULL END as [CN No],\r\n"
				+ "CASE WHEN cn.merged_cn_id IS NOT NULL THEN \r\n"
				+ "	CASE WHEN cnmerged.ct1ulp_id!=cnmerged.ct2ulp_id THEN\r\n"
				+ "		CASE WHEN cnmerged.ct2ulp_id IS NOT NULL THEN cnmerged.ct2ulp_id ELSE NULL END\r\n"
				+ "		ELSE NULL END\r\n"
				+ "ELSE NULL END as [ULP No],\r\n"
				+ "CASE WHEN cn.merged_cn_id IS NOT NULL THEN \r\n"
				+ "	CASE WHEN cnmerged.ct1ulp_id!=cnmerged.ct2ulp_id THEN\r\n"
				+ "		CASE WHEN cnmerged.amount IS NOT NULL THEN cnmerged.amount ELSE NULL END  \r\n"
				+ "	ELSE NULL END \r\n"
				+ "ELSE NULL END as [Amount], 	\r\n"
				+ "CASE WHEN st.manual_bill_details IS NOT NULL THEN\r\n"
				+ "	'Yes:'+JSON_VALUE(st.manual_bill_details,'$.validationType')\r\n"
				+ "ELSE 'No' END as [Is Manual GRF], \r\n"
				+ "st.created_by as [Login ID]\r\n"
				+ "from reports.dbo.sales_transaction st inner join reports.dbo.boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "inner join reports.dbo.customer_transaction ct on st.id=ct.id\r\n"
				+ "inner join reports.dbo.credit_note cn on cn.sales_txn_id=st.id\r\n"
				+ "left outer join(\r\n"
				+ "SELECT distinct pd1.sales_txn_id, STUFF((SELECT '/' +  a.payment_code from(\r\n"
				+ " select distinct sales_txn_id,payment_code from reports.dbo.payment_details where status='COMPLETED') a  where a.sales_txn_id=pd1.sales_txn_id\r\n"
				+ " FOR XML PATH('')), 1, 1, '') AS PaymentCodes\r\n"
				+ " from reports.dbo.payment_details pd1 where pd1.status='COMPLETED'\r\n"
				+ ") MOP on MOP.sales_txn_id=st.id\r\n"
				+ "left outer join(\r\n"
				+ "select sales_txn_id, sum(amount) as Amount from reports.dbo.payment_details where payment_code='CASH' and status='COMPLETED' group by sales_txn_id\r\n"
				+ ") amtCash on amtCash.sales_txn_id=st.id \r\n"
				+ "left outer join(\r\n"
				+ "select sales_txn_id, sum(amount) as Amount from reports.dbo.payment_details where payment_code='CARD' and status='COMPLETED' group by sales_txn_id\r\n"
				+ ") amtCard on amtCard.sales_txn_id=st.id\r\n"
				+ "left outer join(\r\n"
				+ "select sales_txn_id, sum(amount) as Amount from reports.dbo.payment_details where payment_code='CREDIT NOTE' and status='COMPLETED' group by sales_txn_id\r\n"
				+ ") amtCN on amtCN.sales_txn_id=st.id\r\n"
				+ "left outer join(\r\n"
				+ "select sales_txn_id, sum(amount) as Amount from reports.dbo.payment_details where payment_code='RTGS' and status='COMPLETED' group by sales_txn_id\r\n"
				+ ") amtRTGS on amtRTGS.sales_txn_id=st.id\r\n"
				+ "left outer join(\r\n"
				+ "select sales_txn_id, sum(amount) as Amount from reports.dbo.payment_details where payment_code='G PAY' and status='COMPLETED' group by sales_txn_id\r\n"
				+ ") amtGP on amtGP.sales_txn_id=st.id \r\n"
				+ "left outer join(\r\n"
				+ "	select cn1.id cni1d,cn1.sales_txn_id cn1sales_txn_id,cn1.merged_cn_id cn1merged_cn_id,ct1.ulp_id ct1ulp_id, \r\n"
				+ "	cn2.id cn2id,cn2.sales_txn_id cn2sales_txn_id,cn2.merged_cn_id cn2merged_cn_id,ct2.ulp_id ct2ulp_id,\r\n"
				+ "	ct2.customer_name, st2.doc_no  GRFNO,ct2.mobile_number,cn2.doc_no as CNNO,cn2.amount\r\n"
				+ "	from reports.dbo.credit_note cn1 \r\n"
				+ "	inner join reports.dbo.customer_transaction ct1 on ct1.id=cn1.sales_txn_id\r\n"
				+ "	left outer join reports.dbo.credit_note cn2 on cn2.id=cn1.merged_cn_id\r\n"
				+ "	inner join reports.dbo.customer_transaction ct2 on ct2.id=cn2.sales_txn_id\r\n"
				+ "	left outer join reports.dbo.sales_transaction st2 on st2.id=cn2.sales_txn_id\r\n"
				+ ") cnmerged on cnmerged.cn1sales_txn_id=st.id\r\n"
				+ "where st.sub_txn_type='FROZEN_RATES' and cn.frozen_rate_details IS NOT NULL and st.status NOT IN('DELETED')";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		GRFBookingRequestDto GRFBookingRequestDto= (GRFBookingRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(GRFBookingRequestDto.getFromDate())
				&& StringUtils.isEmpty(GRFBookingRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(GRFBookingRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(GRFBookingRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(GRFBookingRequestDto, query);
		if (GRFBookingRequestDto.getGRFBookingCustomRequestDto() != null) {
			validateCustomInputAndAppend(GRFBookingRequestDto, query);
		}
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(GRFBookingRequestDto GRFBookingRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(GRFBookingRequestDto GRFBookingRequestDto, StringBuilder query) {
		
		
		if (GRFBookingRequestDto.getSubRegionCode() != null && !GRFBookingRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(GRFBookingRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(GRFBookingRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + GRFBookingRequestDto.getStateId()).append("'");
		}
		if (GRFBookingRequestDto.getTownId() != null && !GRFBookingRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(GRFBookingRequestDto.getTownId())).append(")");
		}
		if (GRFBookingRequestDto.getLocationCode() != null && !GRFBookingRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(GRFBookingRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(GRFBookingRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + GRFBookingRequestDto.getCountryId()).append("'");
		}
		query.append(" order by st.location_code, st.created_date");
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
		
		GRFBookingRequestDto GRFBookingRequestDto = (GRFBookingRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, GRFBookingRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			GRFBookingCustomRequestDto GRFBookingCustomRequestDto = new GRFBookingCustomRequestDto();
			GRFBookingCustomRequestDto.validate(reportRequestDto.getCustomFields());
			GRFBookingCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), GRFBookingCustomRequestDto.class);
			GRFBookingRequestDto.setGRFBookingCustomRequestDto(GRFBookingCustomRequestDto);
		}
		
		return GRFBookingRequestDto;
	}
	
	

}
