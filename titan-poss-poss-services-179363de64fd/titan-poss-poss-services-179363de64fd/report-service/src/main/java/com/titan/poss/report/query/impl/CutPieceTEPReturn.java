package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.CutPieceTEPReturnCustomRequestDto;
import com.titan.poss.report.dto.request.json.CutPieceTEPReturnRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("CutPieceTEPReturn")
public class CutPieceTEPReturn extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public CutPieceTEPReturn(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("CUT_PIECE_TEP_RETURN", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		CutPieceTEPReturnRequestDto cutPieceTEPReturnRequestDto=(CutPieceTEPReturnRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(cutPieceTEPReturnRequestDto);
		

		String select="select st.location_code as [BTQ CODE],\r\n"
				+ "bmv.owner_type as [TYPE],\r\n"
				+ "bmv.town_name as [CITY],\r\n"
				+ "bmv.state_name as [STATE],\r\n"
				+ "bmv.sub_region_code as [SUB REGION],\r\n"
				+ "stra.src_doc_no as [RETURN DOC NO],\r\n"
				+ "FORMAT(CAST(stra.src_doc_date as DATE),'dd/MM/yyyy') as [RETURN DOC DATE],\r\n"
				+ "stra.src_location_code as [FROM LOCATION],\r\n"
				+ "stra.dest_location_code as [TO LOCATION],\r\n"
				+ "st.doc_no as [DOC NO], \r\n"
				+ "FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [DOC DATE],\r\n"
				+ "st.transaction_type as [DOC TYPE], \r\n"
				+ "std.item_code as [VARIANT CODE],\r\n"
				+ "pgm.pricing_type as [CATEGORY], \r\n"
				+ "std.bin_code as [BIN],\r\n"
				+ "std1.quantity as [AVAILABLE QTY],\r\n"
				+ "std1.std_weight as[WEIGHT],\r\n"
				+ "std.issued_quantity as [RETURNED QTY], \r\n"
				+ "std.issued_weight as [GROSS WEIGHT],\r\n"
				+ "mplm.metal_rate as [PRICE PER UNIT],\r\n"
				+ "std.final_value-std.total_tax as [PRE TAX],\r\n"
				+ "std.total_tax as [TOTAL TAX ],\r\n"
				+ "std.final_value as [FINAL VALUE],\r\n"
				+ "JSON_VALUE(stra.carrier_details,'$.data.courierCompany') as [COURIER COMPANY],\r\n"
				+ "stra.courier_received_date as [COURIER DATE],\r\n"
				+ "JSON_VALUE(stra.carrier_details,'$.data.lockNumber') as [LOCK NUMBER],\r\n"
				+ "JSON_VALUE(stra.carrier_details,'$.data.docketNumber') as [DOCKET NO],\r\n"
				+ "JSON_VALUE(stra.carrier_details,'$.data.roadPermitNumber') as [ROAD PERMIT NO],\r\n"
				+ "stra.issued_remarks as [REMARKS], \r\n"
				+ "stra.issued_by as [Login ID], \r\n"
				+ "std.karat as [Karatage]\r\n"
				+ "from reports.dbo.stock_transaction_cut_piece_sales st\r\n"
				+ "inner join reports.dbo.stock_transaction_details_cut_piece_sales std1 on std1.stock_transaction_id=st.id\r\n"
				+ "inner join reports.dbo.stock_transfer_details std on std.ref_doc_no=st.doc_no and std.ref_fiscal_year=st.fiscal_year and std.ref_doc_type=st.transaction_type\r\n"
				+ "inner join reports.dbo.stock_transfer stra on st.location_code=stra.src_location_code and stra.id=std.stock_transfer_id\r\n"
				+ "left outer join reports.dbo.product_group_master pgm on pgm.product_group_code=std.product_group\r\n"
				+ "left outer join reports.dbo.metal_price_location_mapping mplm on mplm.location_code=st.location_code \r\n"
				+ "and mplm.applicable_date=st.doc_date and mplm.metal_type_code='J'\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "where st.transaction_type IN ('CUT_PIECE_TEP') and st.status NOT IN('DELETED') and std.status='ISSUED'";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		CutPieceTEPReturnRequestDto cutPieceTEPReturnRequestDto= (CutPieceTEPReturnRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(cutPieceTEPReturnRequestDto.getFromDate())
				&& StringUtils.isEmpty(cutPieceTEPReturnRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(cutPieceTEPReturnRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(cutPieceTEPReturnRequestDto.getToDate());
			query.append(" AND (stra.src_doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(cutPieceTEPReturnRequestDto, query);
		if (cutPieceTEPReturnRequestDto.getCutPieceTEPReturnCustomRequestDto() != null) {
			validateCustomInputAndAppend(cutPieceTEPReturnRequestDto, query);
		}
		query.append(" order by st.location_code, stra.src_doc_date");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(CutPieceTEPReturnRequestDto cutPieceTEPReturnRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(CutPieceTEPReturnRequestDto cutPieceTEPReturnRequestDto, StringBuilder query) {
		
		
		if (cutPieceTEPReturnRequestDto.getSubRegionCode() != null && !cutPieceTEPReturnRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(cutPieceTEPReturnRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cutPieceTEPReturnRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + cutPieceTEPReturnRequestDto.getStateId()).append("'");
		}
		if (cutPieceTEPReturnRequestDto.getTownId() != null && !cutPieceTEPReturnRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(cutPieceTEPReturnRequestDto.getTownId())).append(")");
		}
		if (cutPieceTEPReturnRequestDto.getLocationCode() != null && !cutPieceTEPReturnRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(cutPieceTEPReturnRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(cutPieceTEPReturnRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + cutPieceTEPReturnRequestDto.getCountryId()).append("'");
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
		
		CutPieceTEPReturnRequestDto cutPieceTEPReturnRequestDto = (CutPieceTEPReturnRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, CutPieceTEPReturnRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			CutPieceTEPReturnCustomRequestDto cutPieceTEPReturnCustomRequestDto = new CutPieceTEPReturnCustomRequestDto();
			cutPieceTEPReturnCustomRequestDto.validate(reportRequestDto.getCustomFields());
			cutPieceTEPReturnCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), CutPieceTEPReturnCustomRequestDto.class);
			cutPieceTEPReturnRequestDto.setCutPieceTEPReturnCustomRequestDto(cutPieceTEPReturnCustomRequestDto);
		}
		
		return cutPieceTEPReturnRequestDto;
	}
	
	

}
