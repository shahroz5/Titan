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
import com.titan.poss.report.dto.request.json.StockTransferDetailsReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("StockTransferDetailsReport")
public class StockTransferDetailsReport extends IReport {
	@Autowired
	ReportFactory reportFactory;

	public StockTransferDetailsReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("STOCK_TRANSFER_DETAILS_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		StockTransferDetailsReportRequestDto stockTransferDetailsReportRequestDto = (StockTransferDetailsReportRequestDto) setCustomInput(
				reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(stockTransferDetailsReportRequestDto);
		String select = "SELECT 	\r\n" + "ST.transfer_type as TransferType,\r\n"
				+ "ST.src_location_code as FromLocation,\r\n" + "ST.dest_location_code as ToLocation,\r\n"
				+ "ST.order_type as OrderType,\r\n" + "st.src_doc_no as STNDocNo,\r\n"
				+ "st.src_doc_date as STNDocDate,\r\n" + "std.status as STNStatus,\r\n"
				+ "st.dest_doc_no as [Doc No],\r\n" + "st.dest_doc_date as [Doc Date],\r\n"
				+ "std.item_code as ItemCode,\r\n" + "std.lot_number as LotNumber,\r\n"
				+ "pcm.description as ProductCategory,\r\n" + "std.product_group as CFAProductCode,\r\n"
				+ "pgm.description as [CFA Description],\r\n" + "std.bin_group_code as BINGroup,\r\n"
				+ "std.bin_code as BinCode,\r\n" + "std.mfg_date as [Mfg Date],\r\n"
				+ "std.issued_quantity as IssuedQty,\r\n" + "std.received_quantity as ReceivedQty,\r\n"
				+ "std.std_weight as StdWeight,\r\n" + "std.issued_weight as IssuedWt,\r\n"
				+ "std.received_weight as ReceivedWt,	\r\n" + "CAST(std.issued_value AS FLOAT) as IssuedValue,\r\n"
				+ "CAST(std.received_value AS FLOAT) as ReceivedValue,\r\n"
				+ "JSON_VALUE(st.carrier_details ,'$.data.courierCompany')  as CourierCompany,\r\n"
				+ "JSON_VALUE(st.carrier_details ,'$.data.docketNumber')  as DocketNumber,\r\n"
				+ "JSON_VALUE(st.carrier_details ,'$.data.lockNumber')  as LockNumber,\r\n"
				+ "JSON_VALUE(st.carrier_details ,'$.data.roadPermitNumber')  as RoadPermitNumber,\r\n"
				+ "CAST(std.created_date AS DATE) as [Date of Receipt],\r\n"
				+ "st.reason_for_delay as [Reason for Delay],\r\n" + "ST.issued_remarks AS IssuedRemarks,\r\n"
				+ "ST.received_remarks as ReceivedRemarks,\r\n" + "std.created_by as [Login ID]\r\n" + "FROM \r\n"
				+ "stock_transfer ST LEFT OUTER JOIN stock_transfer_details STD ON ST.id=STD.stock_transfer_id\r\n"
				+ "left outer join product_category_master pcm on pcm.product_category_code=std.product_category\r\n"
				+ "left outer join product_group_master pgm on pgm.product_group_code=std.product_group WHERE";

		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		StockTransferDetailsReportRequestDto stockTransferDetailsReportRequestDto = (StockTransferDetailsReportRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(stockTransferDetailsReportRequestDto.getFromDate())
				&& StringUtils.isEmpty(stockTransferDetailsReportRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(stockTransferDetailsReportRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(stockTransferDetailsReportRequestDto.getToDate());
			query.append(" convert(datetime,CONVERT(varchar(10),st.src_doc_date,103),103) BETWEEN '" + fromDate
					+ "' AND '" + toDate + "'");
			if (!CollectionUtil.isEmpty(reportRequestDto.getLocationCode())) {
				query.append(
						" AND ST.dest_location_code in (" + formatListToInClause(reportRequestDto.getLocationCode()))
						.append(")");
			}
			query.append(" order by  ST.dest_location_code ,ST.dest_doc_no ");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}
		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		
		return (StockTransferDetailsReportRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				StockTransferDetailsReportRequestDto.class);
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
