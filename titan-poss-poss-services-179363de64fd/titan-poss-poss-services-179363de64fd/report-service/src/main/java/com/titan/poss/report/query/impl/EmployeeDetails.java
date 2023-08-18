package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.EmployeeDetailsCustomRequestDto;
import com.titan.poss.report.dto.request.json.EmployeeDetailsRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("EmployeeDetails")
public class EmployeeDetails extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public EmployeeDetails(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("EMPLOYEE_DETAILS", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		EmployeeDetailsRequestDto employeeDetailsRequestDto=(EmployeeDetailsRequestDto) setCustomInput(reportRequestDto);
		
		StringBuilder appendWhereClause = appendQuery(employeeDetailsRequestDto);
		

		String select="select em.location_code as [Locationcode],   em.employee_code as [EmployeeCode], em.emp_name as [Name],\r\n"
				+ " em.email_id as [Mailid], em.mobile_no as [Mobileno],  \r\n"
				+ "JSON_VALUE(em.address,'$.data.line1')+','+JSON_VALUE(em.address,'$.data.line2')+','  as [Address1],\r\n"
				+ "JSON_VALUE(em.address,'$.data.city')+','+JSON_VALUE(em.address,'$.data.country')+','+\r\n"
				+ "JSON_VALUE(em.address,'$.data.pincode')+','+JSON_VALUE(em.address,'$.data.state') as [Address2],\r\n"
				+ "FORMAT(em.joining_date,'dd/MM/yyyy') as [Joiningdate],\r\n"
				+ "CASE WHEN em.is_active=1 THEN 'TRUE'\r\n"
				+ "	WHEN em.is_active=0 THEN 'FALSE'\r\n"
				+ "	ELSE '' END as [IsActive],\r\n"
				+ "FORMAT(em.resignation_date,'dd/MM/yyyy') as [ResigningDate],\r\n"
				+ "FORMAT(em.birth_date,'dd/MM/yyyy') as [DateofBirth],\r\n"
				+ "em.created_by as [LoginId], FORMAT(CAST(em.created_date as DATE),'dd/MM/yyyy') as [CreatedDate], \r\n"
				+ "FORMAT(CAST(em.last_modified_date as DATE),'dd/MM/yyyy') as [LastmodifiedDate]\r\n"
				+ "from employee_master em,boutique_master_view bmv \r\n"
				+ "where bmv.location_code=em.location_code";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		EmployeeDetailsRequestDto employeeDetailsRequestDto= (EmployeeDetailsRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		/*if (!(StringUtils.isEmpty(employeeDetailsRequestDto.getFromDate())
				&& StringUtils.isEmpty(employeeDetailsRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(employeeDetailsRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(employeeDetailsRequestDto.getToDate());
			query.append(" AND (bd.business_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}*/
		
		validateLocationFields(employeeDetailsRequestDto, query);
		if (employeeDetailsRequestDto.getEmployeeDetailsCustomRequestDto() != null) {
			validateCustomInputAndAppend(employeeDetailsRequestDto, query);
		}
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(EmployeeDetailsRequestDto employeeDetailsRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(EmployeeDetailsRequestDto employeeDetailsRequestDto, StringBuilder query) {
		
		
		if (employeeDetailsRequestDto.getSubRegionCode() != null && !employeeDetailsRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(employeeDetailsRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(employeeDetailsRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + employeeDetailsRequestDto.getStateId()).append("'");
		}
		if (employeeDetailsRequestDto.getTownId() != null && !employeeDetailsRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(employeeDetailsRequestDto.getTownId())).append(")");
		}
		if (employeeDetailsRequestDto.getLocationCode() != null && !employeeDetailsRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(employeeDetailsRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(employeeDetailsRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + employeeDetailsRequestDto.getCountryId()).append("'");
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
		
		EmployeeDetailsRequestDto employeeDetailsRequestDto = (EmployeeDetailsRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, EmployeeDetailsRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			EmployeeDetailsCustomRequestDto employeeDetailsCustomRequestDto = new EmployeeDetailsCustomRequestDto();
			employeeDetailsCustomRequestDto.validate(reportRequestDto.getCustomFields());
			employeeDetailsCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), EmployeeDetailsCustomRequestDto.class);
			employeeDetailsRequestDto.setEmployeeDetailsCustomRequestDto(employeeDetailsCustomRequestDto);
		}
		
		return employeeDetailsRequestDto;
	}
	
	

}
