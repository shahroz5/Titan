package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.WalkinsCustomRequestDto;
import com.titan.poss.report.dto.request.json.WalkinsRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("Walkins")
public class Walkins extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public Walkins(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("WALKINS_CONVERSIONS", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		WalkinsRequestDto walkinsRequestDto=(WalkinsRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(walkinsRequestDto);
		

		String select="select\r\n"
				+ "cv.location_code as [LocationCode],\r\n"
				+ "bmv.sub_region_code as [RegionCode],\r\n"
				+ "FORMAT(CAST(cv.business_date as DATE),'dd/MM/yyyy') as [BusinessDate],\r\n"
				+ "cv.walkins as [No of Walkins],\r\n"
				+ "cv.invoice_count as [No of Bills],\r\n"
				+ "cv.purchaser_count as [No Of Conversions],\r\n"
				+ "CAST(ISNULL((CAST(cv.purchaser_count as float)/CAST(NULLIF(cv.walkins,0) as FLOAT))*100,0) as decimal(16,2)) as [Conversion %]\r\n"
				+ "from customer_visits cv, boutique_master_view bmv \r\n"
				+ "where bmv.location_code=cv.location_code";
		
		return  String.format("%s%s", select, appendWhereClause);
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		WalkinsRequestDto walkinsRequestDto= (WalkinsRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(walkinsRequestDto.getFromDate())
				&& StringUtils.isEmpty(walkinsRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(walkinsRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(walkinsRequestDto.getToDate());
			query.append(" AND (cv.business_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(walkinsRequestDto, query);
		if (walkinsRequestDto.getWalkinsCustomRequestDto() != null) {
			validateCustomInputAndAppend(walkinsRequestDto, query);
		}
		
		query.append(" order by cv.location_code, bmv.sub_region_code,business_date");
		
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(WalkinsRequestDto walkinsRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(WalkinsRequestDto walkinsRequestDto, StringBuilder query) {
		
		
		if (walkinsRequestDto.getSubRegionCode() != null && !walkinsRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(walkinsRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(walkinsRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + walkinsRequestDto.getStateId()).append("'");
		}
		if (walkinsRequestDto.getTownId() != null && !walkinsRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(walkinsRequestDto.getTownId())).append(")");
		}
		if (walkinsRequestDto.getLocationCode() != null && !walkinsRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(walkinsRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(walkinsRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + walkinsRequestDto.getCountryId()).append("'");
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
		
		WalkinsRequestDto walkinsRequestDto = (WalkinsRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, WalkinsRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			WalkinsCustomRequestDto walkinsCustomRequestDto = new WalkinsCustomRequestDto();
			walkinsCustomRequestDto.validate(reportRequestDto.getCustomFields());
			walkinsCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), WalkinsCustomRequestDto.class);
			walkinsRequestDto.setWalkinsCustomRequestDto(walkinsCustomRequestDto);
		}
		
		return walkinsRequestDto;
	}
	
	

}
