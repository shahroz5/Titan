package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.BinToBinTransferReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("BinToBinTransferReport")
public class BinToBinTransferReport extends IReport{
	@Autowired
	ReportFactory reportFactory;

	public BinToBinTransferReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("BIN_TO_BIN_TRANSFER_REPORT", this);
	}
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		BinToBinTransferReportRequestDto binToBinTransferReportRequestDto = (BinToBinTransferReportRequestDto) setCustomInput(
reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(binToBinTransferReportRequestDto);
		String select ="SELECT ST.location_code AS BTQCode,\r\n"
+ "st.transaction_type as Type,\r\n"
+ "st.issued_doc_no as DocNo,\r\n"
+ "st.issued_doc_date as DocDate,\r\n"
+ "st.issued_fiscal_year as FiscalYear,\r\n"
+ "std.bin_group_code as CFAProductCode,\r\n"
+ "std.product_category as ProductCategory,\r\n"
+ "std.item_code as ItemCode,\r\n"
+ "std.lot_number as Lotnumber,\r\n"
+ "std.bin_code as IssuingBin,\r\n"
+ "std.issued_quantity as IssuedQty,\r\n"
+ "std.issued_weight as IssuedWeight,\r\n"
+ "std.issued_value as IssuedValue,\r\n"
+ "std.std_weight as StdWeight,\r\n"
+ "std.std_value as StdValue,\r\n"
+ "std.received_bin_code as ReceivingBin,\r\n"
+ "std.defect_type_desc as [DEFECT TYPE DESCRIPTION],\r\n"
+ "std.defect_code_desc as [DEFECT CODE DESCRIPTION],\r\n"
+ "std.received_quantity as ReceivedQty,\r\n"
+ "std.received_weight as ReceivedWeight,\r\n"
+ "std.received_value as ReceivedValue,\r\n"
+ "pgm.description as [CATEGORY],\r\n"
+ "im.description as [PRODUCT DESCRIPTION],\r\n"
+ "std.remarks as Remarks,\r\n"
+ "std.created_by as LoginId\r\n"
+ "FROM stock_transaction ST LEFT OUTER JOIN stock_transaction_details STD ON ST.id=STD.stock_transaction_id\r\n"
+ "left outer join item_master im on im.item_code=std.item_code\r\n"
+ "left outer join product_group_master pgm on pgm.product_group_code=im.product_group_code\r\n"
+ ",boutique_master_view bmv\r\n"
+ "where st.transaction_type='BIN_TO_BIN' and bmv.location_Code = st.location_code";
	
		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		BinToBinTransferReportRequestDto binToBinTransferReportRequestDto = (BinToBinTransferReportRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(binToBinTransferReportRequestDto.getFromDate())
&& StringUtils.isEmpty(binToBinTransferReportRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(binToBinTransferReportRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(binToBinTransferReportRequestDto.getToDate());
			query.append(" AND convert(datetime,CONVERT(varchar(10),st.issued_doc_date,103),103) BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (!CollectionUtil.isEmpty(binToBinTransferReportRequestDto.getOwnerType())) {
			query.append(" AND bmv.owner_type in ("
	+ formatListToInClause(binToBinTransferReportRequestDto.getOwnerType())).append(")");
		}
		if (!CollectionUtil.isEmpty(binToBinTransferReportRequestDto.getSubBrandCode())) {
			query.append(" AND bmv.brand_code in ("
	+ formatListToInClause(binToBinTransferReportRequestDto.getSubBrandCode())).append(")");
		}
		if (!CollectionUtil.isEmpty(binToBinTransferReportRequestDto.getSubRegionCode())) {
			query.append(" AND bmv.region_code in ("
	+ formatListToInClause(binToBinTransferReportRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(binToBinTransferReportRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + binToBinTransferReportRequestDto.getStateId()).append("'");
		}
		if (!CollectionUtil.isEmpty(binToBinTransferReportRequestDto.getTownId())) {
			query.append(
	" AND bmv.town_id in (" + formatListToInClause(binToBinTransferReportRequestDto.getTownId()))
	.append(")");
		}
		if (!CollectionUtil.isEmpty(binToBinTransferReportRequestDto.getLocationCode())) {
			query.append(" AND bmv.location_code in ("
	+ formatListToInClause(binToBinTransferReportRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(binToBinTransferReportRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + binToBinTransferReportRequestDto.getCountryId()).append("'");
		}
		
		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
return (BinToBinTransferReportRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
		BinToBinTransferReportRequestDto.class);
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
