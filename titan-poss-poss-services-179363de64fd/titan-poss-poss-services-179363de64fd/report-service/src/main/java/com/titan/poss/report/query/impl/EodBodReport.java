package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;


import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.EodBodReportCustomRequestDto;
import com.titan.poss.report.dto.request.json.EodBodReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("EodBodReport")
public class EodBodReport extends IReport {

	@Autowired
	ReportFactory reportFactory;

	public EodBodReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("EOD_BOD_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {

		EodBodReportRequestDto eodBodReportRequestDto=(EodBodReportRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(eodBodReportRequestDto);
		
		String select = "SELECT ps1.location_code as BTQCode,\r\n"
				+ "				 bmv.owner_type as Level,\r\n"
				+ "				 bmv.region_code as Region,\r\n"
				+ "				 bmv.brand_code as Brand,\r\n"
				+ "				 bmv.state_name as State,\r\n"
				+ "				 bmv.town_name as City,\r\n"
				+ "				 convert(varchar,ps1.created_date , 23) as BODDate,\r\n"
				+ "				 convert(varchar,ps1.created_date , 8) as BODTime,\r\n"
				+ "				 ps1.status as Status,\r\n"
				+ "				 ps1.remarks as Remarks,\r\n"
				+ "				 convert(varchar,ps1.last_modified_date , 23) as EODDate,\r\n"
				+ "				 convert(varchar,ps1.last_modified_date , 8) as EODTime,\r\n"
				+ "				 ps1.status as EODStatus,\r\n"
				+ "				 ps1.remarks as Remarks\r\n"
				+ "				 FROM reports.dbo.boutique_master_view bmv, reports.dbo.business_day_master ps1\r\n"
				+ "				 where ps1.location_code=bmv.location_code";
		return  String.format("%s%s", select, appendWhereClause);
	}
	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		EodBodReportRequestDto eodBodReportRequestDto= (EodBodReportRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		/*if (!(StringUtils.isEmpty(eodBodReportRequestDto.getFromDate())
				&& StringUtils.isEmpty(eodBodReportRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(eodBodReportRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(eodBodReportRequestDto.getToDate());
			query.append(" AND (bd.business_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}*/
		
		validateLocationFields(eodBodReportRequestDto, query);
		if (eodBodReportRequestDto.getEodBodReportCustomRequestDto() != null) {
			validateCustomInputAndAppend(eodBodReportRequestDto, query);
		}
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(EodBodReportRequestDto eodBodReportRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(EodBodReportRequestDto eodBodReportRequestDto, StringBuilder query) {
		
		
		if (eodBodReportRequestDto.getSubRegionCode() != null && !eodBodReportRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(eodBodReportRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(eodBodReportRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + eodBodReportRequestDto.getStateId()).append("'");
		}
		if (eodBodReportRequestDto.getTownId() != null && !eodBodReportRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(eodBodReportRequestDto.getTownId())).append(")");
		}
		if (eodBodReportRequestDto.getLocationCode() != null && !eodBodReportRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(eodBodReportRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(eodBodReportRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + eodBodReportRequestDto.getCountryId()).append("'");
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
		
		EodBodReportRequestDto eodBodReportRequestDto = (EodBodReportRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, EodBodReportRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			EodBodReportCustomRequestDto eodBodReportCustomRequestDto = new EodBodReportCustomRequestDto();
			eodBodReportCustomRequestDto.validate(reportRequestDto.getCustomFields());
			eodBodReportCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), EodBodReportCustomRequestDto.class);
			eodBodReportRequestDto.setEodBodReportCustomRequestDto(eodBodReportCustomRequestDto);
		}
		
		return eodBodReportRequestDto;
	}
	
}
