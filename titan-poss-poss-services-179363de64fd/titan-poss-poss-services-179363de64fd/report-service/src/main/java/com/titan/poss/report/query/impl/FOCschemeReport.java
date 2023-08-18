package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;

import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.FOCschemeReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;
import org.springframework.util.StringUtils;

@Component("FOCschemeReport")
public class FOCschemeReport extends IReport  {
	@Autowired
	ReportFactory reportFactory;

	public FOCschemeReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("FOC_SCHEMES", this);
	}
		@Override
		public String buildQuery(ReportRequestDto reportRequestDto) { 
			FOCschemeReportRequestDto focSchemeReportRequestDto = (FOCschemeReportRequestDto) setCustomInput(reportRequestDto);
			StringBuilder appendWhereClause = appendQuery(focSchemeReportRequestDto);
			String select ="SELECT CASE \r\n"
					+ "		WHEN ST.is_manual_foc = 0\r\n"
					+ "			THEN 'AUTOMATIC'\r\n"
					+ "		ELSE 'MANUAL'\r\n"
					+ "		END FOCSchemes\r\n"
					+ "	,JSON_VALUE(FOC.scheme_details, '$.data.schemeName') FOCschemeName\r\n"
					+ "	,JSON_VALUE(FOC.scheme_details, '$.data.schemeCategory') SchemeCategory\r\n"
					+ "	,'' CFAproductCode\r\n"
					+ "	--JSON_VALUE(FOC.purchase_items, '$.purchaseItems.productGroupCode') CFAproductCode,\r\n"
					+ "	,CASE \r\n"
					+ "		WHEN JSON_VALUE(FOC.scheme_details, '$.data.schemeCategory') = 'WEIGHT_BASED'\r\n"
					+ "			THEN JSON_VALUE(FOC_D.inventory_details, '$.data.stdWeight')\r\n"
					+ "		WHEN JSON_VALUE(FOC.scheme_details, '$.data.schemeCategory') = 'VALUE_BASED'\r\n"
					+ "			THEN JSON_VALUE(FOC_D.inventory_details, '$.data.stdValue')\r\n"
					+ "		END [StandardWt/Value]\r\n"
					+ "	,'' SchemeStartDate\r\n"
					+ "	,'' SchemeEndDate\r\n"
					+ "	,FOC.created_date SchemeCreatedDate\r\n"
					+ "	,FOC.created_by CreatedLoginId\r\n"
					+ "	,FOC.last_modified_date LastModifiedDate\r\n"
					+ "	,'' NoOfLocations\r\n"
					+ "	--NoOfLocations --To be confirmed from Naveen\r\n"
					+ "	,'' FOCeligibleOn\r\n"
					+ "	,FOC_D.item_code FOCitemCode\r\n"
					+ "	,FOC_D.unit_weight FOCitemUnitWeight\r\n"
					+ "	,FOC_D.total_quantity Quantity\r\n"
					+ "	,FOC_D.total_weight TotalFOCWeight\r\n"
					+ "	--Description Not required as per me (Manual/Automatic)\r\n"
					+ "FROM sales_transaction ST\r\n"
					+ "INNER JOIN foc_schemes FOC ON ST.id = FOC.sales_txn_id\r\n"
					+ "INNER JOIN foc_details FOC_D ON FOC.id = FOC_D.foc_scheme_id\r\n"
					+ "INNER JOIN boutique_master_view bmv on bmv.location_code = st.location_code";
		
			return String.format("%s%s", select, appendWhereClause);
		}

		@Override
		protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
			FOCschemeReportRequestDto focSchemeReportRequestDto = (FOCschemeReportRequestDto) reportRequestDto;
			StringBuilder query = new StringBuilder();
			if (!(StringUtils.isEmpty(focSchemeReportRequestDto.getFromDate())
					&& StringUtils.isEmpty(focSchemeReportRequestDto.getToDate()))) {
				String fromDate = CalendarUtils.formatDateToSql(focSchemeReportRequestDto.getFromDate());
				String toDate = CalendarUtils.formatDateToSql(focSchemeReportRequestDto.getToDate());
				query.append(" WHERE convert(datetime,CONVERT(varchar(10),foc.created_date,103),103) BETWEEN '" + fromDate + "' AND '" + toDate + "'");
			} else {
				throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
			}

			if (!CollectionUtil.isEmpty(focSchemeReportRequestDto.getOwnerType())) {
				query.append(" AND bmv.owner_type in ("
						+ formatListToInClause(focSchemeReportRequestDto.getOwnerType())).append(")");
			}
			if (!CollectionUtil.isEmpty(focSchemeReportRequestDto.getSubBrandCode())) {
				query.append(" AND bmv.brand_code in ("
						+ formatListToInClause(focSchemeReportRequestDto.getSubBrandCode())).append(")");
			}
			if (!CollectionUtil.isEmpty(focSchemeReportRequestDto.getSubRegionCode())) {
				query.append(" AND bmv.region_code in ("
						+ formatListToInClause(focSchemeReportRequestDto.getSubRegionCode())).append(")");
			}
			if (!StringUtils.isEmpty(focSchemeReportRequestDto.getStateId())) {
				query.append(" AND bmv.state_id='" + focSchemeReportRequestDto.getStateId()).append("'");
			}
			if (!CollectionUtil.isEmpty(focSchemeReportRequestDto.getTownId())) {
				query.append(
						" AND bmv.town_id in (" + formatListToInClause(focSchemeReportRequestDto.getTownId()))
						.append(")");
			}
			if (!CollectionUtil.isEmpty(focSchemeReportRequestDto.getLocationCode())) {
				query.append(" AND bmv.location_code in ("
						+ formatListToInClause(focSchemeReportRequestDto.getLocationCode())).append(")");
			}
			if (!StringUtils.isEmpty(focSchemeReportRequestDto.getCountryId())) {
				query.append(" AND bmv.country_code='" + focSchemeReportRequestDto.getCountryId()).append("'");
			}
			
			return query;
		}


		@Override
		protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
			// TODO Auto-generated method stub
			return (FOCschemeReportRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
					FOCschemeReportRequestDto.class);
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