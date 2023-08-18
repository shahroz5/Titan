package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.ComplexityReportCustomRequestDto;
import com.titan.poss.report.dto.request.json.ComplexityReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("ComplexityReport")
public class ComplexityReport  extends IReport {

	@Autowired
	ReportFactory reportFactory;

	public ComplexityReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("COMPLEXITY_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		ComplexityReportRequestDto complexityRequestDto=(ComplexityReportRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(complexityRequestDto);
		
		String select = "Select bmv.location_code as [BTQCode],\r\n"
				+ "cpgm.price_group as 'Price Group',\r\n"
				+ "cpgm.complexity_code as 'Complexity Code',\r\n"
				+ "cpgm.making_charge_pgram as 'Making Charges Per Gram',\r\n"
				+ "cpgm.wastage_pct as 'Wastage Percentage',\r\n"
				+ "lm.is_active as [BTQ Active Status],\r\n"
				+ "cm.is_active as 'Complexity Code Active',\r\n"
				+ "cpgm.is_active as 'Price group Active',\r\n"
				+ "convert(varchar,cpgm.created_date , 23) as 'Price Group Created Date',\r\n"
				+ "cpgm.making_charge_punit as 'Making Charges Per Gram Value',\r\n"
				+ "convert(varchar,cm.created_date , 23) as 'Complexity Created Date'\r\n"
				+ "from boutique_master_view bmv, location_master lm,\r\n"
				+ "complexity_price_group_mapping cpgm, complexity_master cm,location_price_group_mapping lpgm\r\n"
				+ "where cpgm.complexity_code = cm.complexity_code and bmv.location_code=lpgm.location_code \r\n"
				+ "and lpgm.price_group=cpgm.price_group and lm.location_code=bmv.location_code";
		
		return  String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		ComplexityReportRequestDto complexityRequestDto= (ComplexityReportRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(complexityRequestDto.getFromDate())
				&& StringUtils.isEmpty(complexityRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(complexityRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(complexityRequestDto.getToDate());
			query.append(" AND convert(datetime,CONVERT(varchar(10),cpgm.created_date,103),103) BETWEEN '" + fromDate + "' AND '" + toDate
					+ "'");
		}
		
		validateLocationFields(complexityRequestDto, query);
		if (complexityRequestDto.getComplexityReportCustomRequestDto() != null) {
			validateCustomInputAndAppend(complexityRequestDto, query);
		}
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(ComplexityReportRequestDto complexityRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(ComplexityReportRequestDto complexityRequestDto, StringBuilder query) {
		
		
		if (complexityRequestDto.getSubRegionCode() != null && !complexityRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(complexityRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(complexityRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + complexityRequestDto.getStateId()).append("'");
		}
		if (complexityRequestDto.getTownId() != null && !complexityRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(complexityRequestDto.getTownId())).append(")");
		}
		if (complexityRequestDto.getLocationCode() != null && !complexityRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(complexityRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(complexityRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + complexityRequestDto.getCountryId()).append("'");
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
		
		ComplexityReportRequestDto complexityRequestDto = (ComplexityReportRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, ComplexityReportRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			ComplexityReportCustomRequestDto complexityCustomRequestDto = new ComplexityReportCustomRequestDto();
			complexityCustomRequestDto.validate(reportRequestDto.getCustomFields());
			complexityCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), ComplexityReportCustomRequestDto.class);
			complexityRequestDto.setComplexityReportCustomRequestDto(complexityCustomRequestDto);
		}
		
		return complexityRequestDto;
	}
	
}
