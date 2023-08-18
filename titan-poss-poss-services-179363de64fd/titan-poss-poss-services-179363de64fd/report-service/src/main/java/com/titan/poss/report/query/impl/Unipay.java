package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.UnipayCustomRequestDto;
import com.titan.poss.report.dto.request.json.UnipayRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("Unipay")
public class Unipay extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public Unipay(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("UNIPAY_REPORT", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		UnipayRequestDto unipayRequestDto=(UnipayRequestDto) setCustomInput(reportRequestDto);
		
		StringBuilder appendWhereClause = appendQuery(unipayRequestDto);
		

		String select="select Unipay.location_code as [locationcode], Unipay.sub_region_code as [region], UniPay.owner_type as [level],\r\n"
				+ "UniPay.BTQName as [BTQ Name], UniPay.brand_code as [Brand], UniPay.state_name as [State], UniPay.town_name as [City],\r\n"
				+ "FORMAT(CAST(Unipay.payment_date as DATE),'dd/MM/yyyy') as [PaymentDate], CAST(ISNULL(UniPay.NONUNIPAYAmt,0) as bigint) as [nonunipayamount], \r\n"
				+ "CAST(ISNULL(UniPay.UNIPAYAmt,0) as bigint) as [unipayamount],\r\n"
				+ "CAST(ISNULL(UniPay.NONUNIPAYAmt,0)+ISNULL(UniPay.UNIPAYAmt,0) as bigint) as [totalamount], \r\n"
				+ "CAST(ROUND(ISNULL(UniPay.NONUNIPAYAmt,0)/(ISNULL(UniPay.NONUNIPAYAmt,0)+ISNULL(UniPay.UNIPAYAmt,0))*100,2) as decimal(16,2)) as [Non Unipay Payment %],\r\n"
				+ "CAST(ROUND(ISNULL(UniPay.UNIPAYAmt,0)/(ISNULL(UniPay.NONUNIPAYAmt,0)+ISNULL(UniPay.UNIPAYAmt,0))*100,2) as decimal(16,2)) as [Unipay Payment %]	\r\n"
				+ "from\r\n"
				+ "(\r\n"
				+ "	select a.location_code, a.payment_date,SUM(D1) UNIPAYAmt,SUM(D2) NONUNIPAYAmt,\r\n"
				+ "	a.brand_code,a.BTQName,a.owner_type,a.state_name,a.sub_region_code,a.town_name\r\n"
				+ "	from\r\n"
				+ "	( \r\n"
				+ "		select st.location_code, pd.payment_date,\r\n"
				+ "		CASE WHEN pd.payment_code='UNIPAY' THEN SUM(amount) END D1,\r\n"
				+ "		CASE WHEN pd.payment_code<>'UNIPAY' THEN SUM(amount) END D2,\r\n"
				+ "		bmv.sub_region_code, bmv.owner_type, st.location_code+'-'+bmv.town_name as [BTQName], \r\n"
				+ "		bmv.brand_code, bmv.state_name, bmv.town_name\r\n"
				+ "		from payment_details pd\r\n"
				+ "		inner join sales_transaction st on st.id=pd.sales_txn_id\r\n"
				+ "		left outer join boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "		where pd.status='COMPLETED' \r\n"
				+ "		group by st.location_code, pd.payment_date, pd.payment_code,sub_region_code,bmv.owner_type, \r\n"
				+ "		bmv.brand_code, bmv.state_name, bmv.town_name\r\n"
				+ "	)a where a.payment_date IS NOT NULL \r\n"
				+ "	group by a.location_code,a.payment_date, a.brand_code,a.BTQName,a.owner_type,a.state_name,a.sub_region_code,a.town_name\r\n"
				+ ") UniPay, boutique_master_view bmv"
				+ " WHERE UniPay.location_code=bmv.location_code";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		UnipayRequestDto unipayRequestDto= (UnipayRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(unipayRequestDto.getFromDate())
				&& StringUtils.isEmpty(unipayRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(unipayRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(unipayRequestDto.getToDate());
			query.append(" AND (Unipay.payment_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(unipayRequestDto, query);
		if (unipayRequestDto.getUnipayCustomRequestDto() != null) {
			validateCustomInputAndAppend(unipayRequestDto, query);
		}
		query.append(" order by UniPay.location_code,UniPay.payment_date");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(UnipayRequestDto unipayRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(UnipayRequestDto unipayRequestDto, StringBuilder query) {
		
		
		if (unipayRequestDto.getSubRegionCode() != null && !unipayRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(unipayRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(unipayRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + unipayRequestDto.getStateId()).append("'");
		}
		if (unipayRequestDto.getTownId() != null && !unipayRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(unipayRequestDto.getTownId())).append(")");
		}
		if (unipayRequestDto.getLocationCode() != null && !unipayRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(unipayRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(unipayRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + unipayRequestDto.getCountryId()).append("'");
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
		
		UnipayRequestDto unipayRequestDto = (UnipayRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, UnipayRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			UnipayCustomRequestDto unipayCustomRequestDto = new UnipayCustomRequestDto();
			unipayCustomRequestDto.validate(reportRequestDto.getCustomFields());
			unipayCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), UnipayCustomRequestDto.class);
			unipayRequestDto.setUnipayCustomRequestDto(unipayCustomRequestDto);
		}
		
		return unipayRequestDto;
	}
	
	

}
