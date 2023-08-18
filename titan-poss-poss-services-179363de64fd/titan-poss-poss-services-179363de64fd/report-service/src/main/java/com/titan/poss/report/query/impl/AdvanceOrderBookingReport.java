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
import com.titan.poss.report.dto.request.json.AdvanceOrderBookingReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("AdvanceOrderBookingReport")
public class AdvanceOrderBookingReport extends IReport  {
	@Autowired
	ReportFactory reportFactory;

	public AdvanceOrderBookingReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("ADVANCE_ORDER_BOOKING_REPORT", this);
	}
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		AdvanceOrderBookingReportRequestDto advanceOrderBookingReportRequestDto = (AdvanceOrderBookingReportRequestDto) setCustomInput(
				reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(advanceOrderBookingReportRequestDto);
		String select ="SELECT DISTINCT st.location_code as BTQCode\r\n"
				+ ",bmv.brand_code as BrandCode\r\n"
				+ ",bmv.town_name as City\r\n"
				+ ",bmv.owner_type  as Type\r\n"
				+ ",bmv.region_name as Region\r\n"
				+ ",bmv.state_name as State\r\n"
				+ ",CASE \r\n"
				+ "	WHEN st.txn_type = 'AB'\r\n"
				+ "		THEN 'Advance Booking'\r\n"
				+ "	END AS OrderType\r\n"
				+ ",st.doc_no as DocNo\r\n"
				+ ",st.doc_date as DocDate\r\n"
				+ ",st.fiscal_year as OrderFiscalYear\r\n"
				+ ",sod.item_code as ItemCode\r\n"
				+ ",sod.lot_number as LotNumber\r\n"
				+ ",im.description as ProductDescription\r\n"
				+ ",sod.product_group_code as CFAProductCode\r\n"
				+ ",sod.bin_code as BIN\r\n"
				+ ",im.karat as Karatage\r\n"
				+ ",sod.inventory_weight as WtPerUnit\r\n"
				+ ",sod.total_quantity as Qty\r\n"
				+ ",sod.total_weight as GrossWt\r\n"
				+ ",sod.unit_value as PricePerUnit\r\n"
				+ ",JSON_VALUE(SOD.tax_details, '$.data.SGST.taxValue') AS SGST\r\n"
				+ ",JSON_VALUE(SOD.tax_details, '$.data.CGST.taxValue') AS CGST\r\n"
				+ ",JSON_VALUE(SOD.tax_details, '$.data.UTGST.taxValue') AS UTGST\r\n"
				+ ",sod.total_value as TotalValue\r\n"
				+ ",sod.min_order_payment as MinimumOrderBookingAmt\r\n"
				+ ",so.paid_value as PaidAmount\r\n"
				+ ",convert(varchar(max),convert(DECIMAL(10, 1), COALESCE((so.paid_value * 100) / NULLIF(so.total_value,0), 0)))+'%' as [PaidAmt%]	\r\n"
				+ ",convert(VARCHAR(max), DATEDIFF(DAY, CONVERT(DATE, ST.DOC_DATE), CONVERT(DATE, GETDATE()))) + ' Days' AS ProductAgeInAdvanceBooking\r\n"
				+ ",CASE WHEN cn.frozen_rate_details IS NOT NULL AND frozen_rate_details != '{}' THEN 'Yes' ELSE 'No' END as [Isgoldratefrozen]\r\n"
				+ ",JSON_VALUE(st.metal_rate_details, '$.metalRates.J.ratePerUnit') AS GoldRate\r\n"
				+ ",JSON_VALUE(st.metal_rate_details, '$.metalRates.L.ratePerUnit') AS PlatinumRate\r\n"
				+ ",ct.customer_id AS CustomerNo\r\n"
				+ ",ct.customer_name AS Name\r\n"
				+ ",ct.mobile_number AS MobileNo\r\n"
				+ ",ct.ulp_id AS ULPMembershipId\r\n"
				+ ",st.STATUS AS OrderStatus\r\n"
				+ ",CASE WHEN st.STATUS IN ('CANCELLED','SUSPENDED')\r\n"
				+ "	THEN 'CN'\r\n"
				+ "	WHEN st.STATUS='OPEN'\r\n"
				+ "	THEN ''		\r\n"
				+ "	END AS DocType\r\n"
				+ ",CASE WHEN st.STATUS IN ('CANCELLED','SUSPENDED')\r\n"
				+ "	THEN (select a.doc_no from (select distinct c1.sales_txn_id,\r\n"
				+ "		STUFF(\r\n"
				+ "			(SELECT ',' + convert(varchar(max),C.doc_no)\r\n"
				+ "				FROM CREDIT_NOTE C WHERE \r\n"
				+ "				 c.sales_txn_id = c1.sales_txn_id\r\n"
				+ "			FOR XML PATH (''))\r\n"
				+ "			, 1, 1, '')  AS doc_no\r\n"
				+ "		 from CREDIT_NOTE c1 WHERE C1.SALES_TXN_ID=ST.ID group by c1.sales_txn_id)a)\r\n"
				+ "	WHEN st.STATUS='OPEN'\r\n"
				+ "	THEN ''		\r\n"
				+ "	END AS Doc_No\r\n"
				+ ",CASE WHEN st.STATUS IN ('CANCELLED','SUSPENDED')\r\n"
				+ "	THEN (select a.date from (select distinct c1.sales_txn_id,\r\n"
				+ "		STUFF(\r\n"
				+ "			(SELECT ',' + convert(varchar(max),C.doc_date)\r\n"
				+ "				FROM CREDIT_NOTE C WHERE \r\n"
				+ "				 c.sales_txn_id = c1.sales_txn_id\r\n"
				+ "			FOR XML PATH (''))\r\n"
				+ "			, 1, 1, '')  AS date\r\n"
				+ "		 from CREDIT_NOTE c1 WHERE C1.SALES_TXN_ID=ST.ID group by c1.sales_txn_id)a)\r\n"
				+ "	WHEN st.STATUS='OPEN'\r\n"
				+ "	THEN ''		\r\n"
				+ "	END AS Doc_Date\r\n"
				+ ",CASE WHEN st.STATUS IN ('CANCELLED','SUSPENDED')\r\n"
				+ "	THEN (select a.fiscal_year from (select distinct c1.sales_txn_id,\r\n"
				+ "		STUFF(\r\n"
				+ "			(SELECT ',' + convert(varchar(max),C.fiscal_year)\r\n"
				+ "				FROM CREDIT_NOTE C WHERE \r\n"
				+ "				 c.sales_txn_id = c1.sales_txn_id\r\n"
				+ "			FOR XML PATH (''))\r\n"
				+ "			, 1, 1, '')  AS fiscal_year\r\n"
				+ "		 from CREDIT_NOTE c1 WHERE C1.SALES_TXN_ID=ST.ID group by c1.sales_txn_id)a)\r\n"
				+ "	WHEN st.STATUS='OPEN'\r\n"
				+ "	THEN ''		\r\n"
				+ "	END AS Fiscal_Year\r\n"
				+ ", CONVERT(varchar,DATEADD(SECOND,CAST(JSON_VALUE(cn.activation_details, '$.data.lastReactivatedDate') as BIGINT)/1000,'1970/1/1'),103) AS [Activated Date]\r\n"
				+ ",sod.remarks AS Remarks\r\n"
				+ ",case when st.manual_bill_id is null then 'NO' else 'YES' end as ISMB\r\n"
				+ ",JSON_VALUE(st.manual_bill_details, '$.manualBillDetails.metalRates.J.ratePerUnit') AS MB_GR\r\n"
				+ ",JSON_VALUE(st.manual_bill_details, '$.manualBillDetails.manualBillDate') AS MB_Date\r\n"
				+ ",st.created_by as LoginName\r\n"
				+ ",st.confirmed_time as ConfirmedTime\r\n"
				+ ",st.first_hold_time as FirstHoldTime\r\n"
				+ ",st.last_hold_time as LastHoldTime\r\n"
				+ ",st.invoke_time as InvokeTime\r\n"
				+ ",st.last_invoke_time as LastInvokeTime\r\n"
				+ ",FORMAT(DATEDIFF(minute,st.last_hold_time,st.last_invoke_time),'00')+':'+FORMAT(DATEDIFF(second,st.last_hold_time,st.last_invoke_time)%60,'00') as [From Last Holding Time to Invoke Time]\r\n"
				+ "				FROM sales_transaction st\r\n"
				+ "				LEFT JOIN sales_order so ON st.id = so.id\r\n"
				+ "				LEFT JOIN credit_note cn ON cn.sales_txn_id=so.id\r\n"
				+ "INNER JOIN sales_order_details sod ON SO.ID = sod.order_id\r\n"
				+ ",boutique_master_view bmv\r\n"
				+ ",item_master im\r\n"
				+ ",customer_transaction ct\r\n"
				+ ",employee_master em\r\n"
				+ "				WHERE bmv.location_Code = st.location_code\r\n"
				+ "AND im.item_code = sod.item_code\r\n"
				+ "AND ct.id = st.id\r\n"
				+ "AND st.txn_type = 'AB'";
	
		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		AdvanceOrderBookingReportRequestDto advanceOrderBookingReportRequestDto = (AdvanceOrderBookingReportRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(advanceOrderBookingReportRequestDto.getFromDate())
				&& StringUtils.isEmpty(advanceOrderBookingReportRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(advanceOrderBookingReportRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(advanceOrderBookingReportRequestDto.getToDate());
			query.append(" AND convert(datetime,CONVERT(varchar(10),st.doc_date,103),103) BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (!CollectionUtil.isEmpty(advanceOrderBookingReportRequestDto.getOwnerType())) {
			query.append(" AND bmv.owner_type in ("
+ formatListToInClause(advanceOrderBookingReportRequestDto.getOwnerType())).append(")");
		}
		if (!CollectionUtil.isEmpty(advanceOrderBookingReportRequestDto.getSubBrandCode())) {
			query.append(" AND bmv.brand_code in ("
+ formatListToInClause(advanceOrderBookingReportRequestDto.getSubBrandCode())).append(")");
		}
		if (!CollectionUtil.isEmpty(advanceOrderBookingReportRequestDto.getSubRegionCode())) {
			query.append(" AND bmv.region_code in ("
+ formatListToInClause(advanceOrderBookingReportRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(advanceOrderBookingReportRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + advanceOrderBookingReportRequestDto.getStateId()).append("'");
		}
		if (!CollectionUtil.isEmpty(advanceOrderBookingReportRequestDto.getTownId())) {
			query.append(
" AND bmv.town_id in (" + formatListToInClause(advanceOrderBookingReportRequestDto.getTownId()))
.append(")");
		}
		if (!CollectionUtil.isEmpty(advanceOrderBookingReportRequestDto.getLocationCode())) {
			query.append(" AND bmv.location_code in ("
+ formatListToInClause(advanceOrderBookingReportRequestDto.getLocationCode())).append(")");
		}
		if (!StringUtils.isEmpty(advanceOrderBookingReportRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + advanceOrderBookingReportRequestDto.getCountryId()).append("'");
		}
		
		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		// TODO Auto-generated method stub
				return (AdvanceOrderBookingReportRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
	AdvanceOrderBookingReportRequestDto.class);
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
