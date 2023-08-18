package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.TEPGEPReturnCustomRequestDto;
import com.titan.poss.report.dto.request.json.TEPGEPReturnRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;



@Component("TEPGEPReturn")
public class TEPGEPReturn extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public TEPGEPReturn(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("TEP_GEP_RETURN", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		TEPGEPReturnRequestDto tepGepReturnRequestDto=(TEPGEPReturnRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(tepGepReturnRequestDto);
		

		String select="select st.location_code as [BTQ CODE], bmv.owner_type as [TYPE], bmv.town_name as [CITY], bmv.state_name as [STATE], \r\n"
				+ "bmv.sub_region_name as [SUB REGION],\r\n"
				+ "CASE WHEN st.txn_type='TEP' THEN 'TEP RETURN' \r\n"
				+ "	WHEN st.txn_type='GEP' THEN 'GEP RETURN' \r\n"
				+ "	ELSE ''\r\n"
				+ "END as [Doc Return Type],\r\n"
				+ "stra.src_doc_no as [RETURN DOC NO], FORMAT(CAST(stra.src_doc_date as DATE),'dd/MM/yyyy') as [RETURN DOC DATE],stra.src_location_code as [FROM LOCATION], stra.dest_location_code as [TO LOCATION],\r\n"
				+ "st.doc_no as [DOC NO], FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [DOC DATE], st.txn_type as [DOC TYPE], std.item_code as [VARIANT CODE],\r\n"
				+ "pgm.pricing_type as [CATEGORY], std.bin_code as [BIN], ged.quantity as [AVAILABLE QTY], ged.total_weight as[WEIGHT],\r\n"
				+ "std.issued_quantity as [RETURNED QTY], std.issued_weight as [GROSS WEIGHT], JSON_VALUE(st.metal_rate_details,'$.metalRates.J.ratePerUnit') as [PRICE PER UNIT],\r\n"
				+ "std.final_value-std.total_tax as [PRE TAX], std.total_tax as [TOTAL TAX ], std.final_value as [FINAL VALUE],\r\n"
				+ "JSON_VALUE(stra.carrier_details,'$.data.courierCompany') as [COURIER COMPANY],\r\n"
				+ "stra.courier_received_date as [COURIER DATE],\r\n"
				+ "JSON_VALUE(stra.carrier_details,'$.data.lockNumber') as [LOCK NUMBER],\r\n"
				+ "JSON_VALUE(stra.carrier_details,'$.data.docketNumber') as [DOCKET NO],\r\n"
				+ "JSON_VALUE(stra.carrier_details,'$.data.roadPermitNumber') as [ROAD PERMIT NO],	\r\n"
				+ "stra.issued_remarks as [REMARKS], stra.issued_by as [Login ID], std.karat as [Karatage]\r\n"
				+ "from reports.dbo.sales_transaction st\r\n"
				+ "inner join reports.dbo.boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "inner join reports.dbo.goods_exchange ge on ge.id=st.id\r\n"
				+ "inner join reports.dbo.goods_exchange_details ged on ged.goods_exchange_id=ge.id\r\n"
				+ "inner join reports.dbo.stock_transfer_details std on std.ref_doc_no=st.doc_no and std.ref_fiscal_year=st.fiscal_year and std.ref_doc_type=st.txn_type\r\n"
				+ "inner join reports.dbo.stock_transfer stra on st.location_code=stra.src_location_code and stra.id=std.stock_transfer_id\r\n"
				+ "left outer join reports.dbo.product_group_master pgm on pgm.product_group_code=std.product_group\r\n"
				+ "where st.txn_type IN ('TEP','GEP') and st.status NOT IN('DELETED') and std.status='ISSUED'";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
	}

	

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		TEPGEPReturnRequestDto tepGepReturnRequestDto= (TEPGEPReturnRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(tepGepReturnRequestDto.getFromDate())
				&& StringUtils.isEmpty(tepGepReturnRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(tepGepReturnRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(tepGepReturnRequestDto.getToDate());
			query.append(" AND (stra.src_doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(tepGepReturnRequestDto, query);
		if (tepGepReturnRequestDto.getTepGepReturnCustomRequestDto() != null) {
			validateCustomInputAndAppend(tepGepReturnRequestDto, query);
		}
		query.append(" order by [Doc Return Type],st.location_code, stra.src_doc_date");
		
		
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(TEPGEPReturnRequestDto tepGepReturnRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(TEPGEPReturnRequestDto tepGepReturnRequestDto, StringBuilder query) {
		
		
		if (tepGepReturnRequestDto.getSubRegionCode() != null && !tepGepReturnRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(tepGepReturnRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(tepGepReturnRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + tepGepReturnRequestDto.getStateId()).append("'");
		}
		if (tepGepReturnRequestDto.getTownId() != null && !tepGepReturnRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(tepGepReturnRequestDto.getTownId())).append(")");
		}
		if (tepGepReturnRequestDto.getLocationCode() != null && !tepGepReturnRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(tepGepReturnRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(tepGepReturnRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + tepGepReturnRequestDto.getCountryId()).append("'");
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
		
		TEPGEPReturnRequestDto tepGepReturnRequestDto = (TEPGEPReturnRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, TEPGEPReturnRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			TEPGEPReturnCustomRequestDto tepGepReturnCustomRequestDto = new TEPGEPReturnCustomRequestDto();
			tepGepReturnCustomRequestDto.validate(reportRequestDto.getCustomFields());
			tepGepReturnCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), TEPGEPReturnCustomRequestDto.class);
			tepGepReturnRequestDto.setTepGepReturnCustomRequestDto(tepGepReturnCustomRequestDto);
		}
		
		return tepGepReturnRequestDto;
	}
	
	

}
