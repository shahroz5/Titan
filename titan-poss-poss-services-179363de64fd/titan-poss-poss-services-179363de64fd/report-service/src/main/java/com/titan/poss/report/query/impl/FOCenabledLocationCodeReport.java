package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;

import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.FOCenabledLocationCodeRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;
import org.springframework.util.StringUtils;

@Component("FOCenabledLocationCodeReport")
public class FOCenabledLocationCodeReport extends IReport {
	@Autowired
	ReportFactory reportFactory;
	
	public FOCenabledLocationCodeReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("FOC_ENABLED_LOCATION_CODES", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) { 
		FOCenabledLocationCodeRequestDto focEnabledLocationCodeRequestDto = (FOCenabledLocationCodeRequestDto) setCustomInput(reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(focEnabledLocationCodeRequestDto);
		String select ="SELECT st.location_code LocationCode\r\n"
				+ "	,JSON_VALUE(FOC.scheme_details, '$.data.schemeName') FOCschemeName\r\n"
				+ "	,'' SchemeStartDate\r\n"
				+ "	,'' SchemeEndDate\r\n"
				+ "	,FOC.created_date SchemeCreatedDate\r\n"
				+ "	,FOC.created_by CreatedLoginId\r\n"
				+ "FROM sales_transaction ST\r\n"
				+ "INNER JOIN foc_schemes FOC ON ST.id = FOC.sales_txn_id\r\n"
				+ "INNER JOIN foc_details FOC_D ON FOC.id = FOC_D.foc_scheme_id\r\n"
				+ "INNER JOIN boutique_master_view bmv ON st.location_code = bmv.location_code";
	
		return String.format("%s%s", select, appendWhereClause);
	}
	
	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		FOCenabledLocationCodeRequestDto focEnabledLocationCodeRequestDto = (FOCenabledLocationCodeRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(focEnabledLocationCodeRequestDto.getFromDate())
				&& StringUtils.isEmpty(focEnabledLocationCodeRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(focEnabledLocationCodeRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(focEnabledLocationCodeRequestDto.getToDate());
			query.append(" WHERE convert(datetime,CONVERT(varchar(10),foc.created_date,103),103) BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (!CollectionUtil.isEmpty(focEnabledLocationCodeRequestDto.getOwnerType())) {
			query.append(" AND bmv.owner_type in ("
					+ formatListToInClause(focEnabledLocationCodeRequestDto.getOwnerType())).append(")");
		}
		if (!CollectionUtil.isEmpty(focEnabledLocationCodeRequestDto.getSubBrandCode())) {
			query.append(" AND bmv.brand_code in ("
					+ formatListToInClause(focEnabledLocationCodeRequestDto.getSubBrandCode())).append(")");
		}
		if (!CollectionUtil.isEmpty(focEnabledLocationCodeRequestDto.getSubRegionCode())) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(focEnabledLocationCodeRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(focEnabledLocationCodeRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + focEnabledLocationCodeRequestDto.getStateId()).append("'");
		}
		if (!CollectionUtil.isEmpty(focEnabledLocationCodeRequestDto.getTownId())) {
			query.append(
					" AND bmv.town_id in (" + formatListToInClause(focEnabledLocationCodeRequestDto.getTownId()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(focEnabledLocationCodeRequestDto.getLocationCode())) {
			query.append(" AND bmv.location_code in ("
					+ formatListToInClause(focEnabledLocationCodeRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(focEnabledLocationCodeRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + focEnabledLocationCodeRequestDto.getCountryId()).append("'");
		}
		
		return query;
	}


	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
		return (FOCenabledLocationCodeRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				FOCenabledLocationCodeRequestDto.class);
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

}
