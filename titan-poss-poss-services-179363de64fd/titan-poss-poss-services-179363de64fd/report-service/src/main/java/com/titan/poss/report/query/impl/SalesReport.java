/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.SalesReportCustomRequestDto;
import com.titan.poss.report.dto.request.json.SalesReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component("SalesReport")
public class SalesReport extends IReport {

	@Autowired
	ReportFactory reportFactory;

	public SalesReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("SALES_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {

		SalesReportRequestDto salesReportRequestDto = (SalesReportRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
        StringBuilder appendWhereClause = appendQuery(salesReportRequestDto);
        String select ="select  " +
                "format(cast(st.doc_date as \"date\"),'dd/MM/yyyy') as \"Doc Date\",  " +
                "st.location_code as \"Location Code\",  " +
                "bmv.owner_type as \"Btq Level\",  " +
                "bmv.brand_code as \"Brand\",  " +
                "bmv.sub_region_code as \"Region\",  " +
                "bmv.state_name as \"State\",  " +
                "bmv.town_name as \"City\",  " +
                "st.doc_no as \"Doc No\",  " +
                "st.fiscal_year as \"Fiscal Year\",  " +
                "(CASE\r\n" + 
				"WHEN st.ref_txn_id is not null and st.ref_txn_type ='AB' then (SELECT std.doc_no from reports.dbo.sales_transaction std where std.id = st.ref_txn_id)\r\n" + 
				"ELSE null \r\n" + 
				"END) as \"Adv Booking Doc No\",\r\n" + 
				"(CASE\r\n" + 
			    "WHEN st.ref_txn_id is not null and st.ref_txn_type ='AB' then (SELECT stf.fiscal_year from reports.dbo.sales_transaction stf where stf.id = st.ref_txn_id)\r\n" + 
				"ELSE null \r\n" + 
				"END) as \"Adv Booking FY\",\r\n" + 
                "cmd.product_group_code as \"CFA Product Code\",  " +
                "pgm.description as \"CFA Product Code Description\",  " +
                "cmd.inventory_weight as \"Actual Wt\",  " +
                "cmd.total_weight as \"Measured Wt\",  " +
                "cmd.inventory_weight-cmd.total_weight as \"Wt DFRNS\",  " +
                "cmd.inventory_std_weight as \"Gross Wt\",  " +
                "cmd.total_quantity as \"Quantity\",  " +
                "im.karat as \"Karatage\",  " +
                "im.complexity_code as \"Complexity Code\",  " +
                "cmd.item_code as \"Item Code\",  " +
                "cmd.lot_number as \"Lot Number\",  " +
                "im.description as \"Item Description\", " +
                "cmd.total_value as \"Total Pre Discount Total Value\", " +
                "JSON_VALUE(cmd.price_details,'$.metalPriceDetails.preDiscountValue') as \"Total Metal Value\", " +
                "JSON_VALUE(cmd.price_details,'$.stonePriceDetails.preDiscountValue')  as \"Total Stone Value\", " +
                "JSON_VALUE(cmd.price_details,'$.makingChargeDetails.preDiscountValue')  as \"Total Making Charges\", " +
               
                "cmd.unit_value as \"Unit value\",  " +
                
                "COALESCE (dd3.discount_value, 0) as \"Item Level Discount 1\", " + 
                "COALESCE (dd4.discount_value, 0) as \"Item Level Discount 2\", " + 
                "COALESCE (dd5.discount_value, 0) as \"Item Level Discount 3\", " + 
                "COALESCE (dd1.discount_value, 0) as \"Bill Level Discount 1\", " + 
                "COALESCE (dd2.discount_value, 0) as \"Bill Level Discount 2\", " + 

                
                "cmd.total_discount as \"Overall Total Discount for Item Level and Bill Level\", " +
                "cmd.total_tax as \"Total Tax\", " +
                "cmd.final_value as \"Total Invoice Value\",  " +
                
				"(CASE\r\n" + 
				"WHEN  fd1.sales_txn_id is not null then 'TRUE'\r\n" + 
				"ELSE 'FALSE'\r\n" + 
				"END) as \"Is FOC\",\r\n" + 
				"(CASE\r\n" + 
				"WHEN  fd1.sales_txn_id is not null then 'AUTOMATIC'\r\n" + 
				"ELSE ''\r\n" + 
				"END) as \"FOC Status\"," +
                
                "JSON_VALUE(st.metal_rate_details ,'$.metalRates.J.ratePerUnit') as \"Gold Rate\", " +
                "JSON_VALUE(st.metal_rate_details ,'$.metalRates.L.ratePerUnit') as \"Platinum Rate\", " +
                "JSON_VALUE(st.metal_rate_details ,'$.metalRates.P.ratePerUnit') as \"Silver Rate\", " +
                "st.remarks as \"Remarks\",  " +
                "ct.customer_id as \"Customer No\",  " +
                "ct.title as \"Customer Title\",  " +
                "ct.customer_name as \"Customer Name\",  " +
                "ct.mobile_number as \"Mobile No\",  " +
                "ct.ulp_id as \"Loyalty No\",  " +
                "ct.cust_tax_no as \"PAN Card/Form 60\",  " +
                "ct.insti_tax_no as \"GST No\",  " +
                "st.confirmed_time as \"Time Of Sale\",  " +
                "st.last_hold_time as \"Hold Time\",  " +
                "st.invoke_time as \"Invoke time\", " +
                "DATEDIFF(MONTH,st.invoke_time , st.last_hold_time)  as \"Hold Duration\", " +
                "format(cast(pd3.created_dates as \"time\"), 'hh\\:mm\\:ss') as \"Billing Start Time\", " +
                "format(cast(pd3.last_modified_dates as \"time\"), 'hh\\:mm\\:ss') as \"Billing end Time\", " +
                "DATEDIFF(MINUTE, pd3.last_modified_dates, pd3.created_dates) as \"Billing Duration\", " +
                "(CASE\r\n" + 
				"WHEN  st.invoke_count is not null then 'YES'\r\n" + 
				"ELSE 'NO'\r\n" + 
				"END) as \"Is Multiple Times Invoked\",\r\n" + 
                "cmd.employee_code as \"RSO Name\",  " +
                "cmd.bin_code as \"Bin Code\",  " +
                "cmd.bin_group_code as \"Bin Group\",  " +
                "cmd.row_id as \"Line Item No\",  " +
                
                "'' as \"TCS Collected\", " +
                "'' as \"TCS Percentage\", " +
                "'' as \"eInvoice\", " +
                "cmd.final_value as \"Total Amount Paid\", " +
                
                "cm.occasion_name as \"Occasion Name\",  " +
               
                "rt.doc_no as \"GRN No\",  " +
                "rt.doc_date as \"GRN Date\", " +
                
                "(CASE WHEN rt.doc_no is not null THEN rt.txn_type \r\n" + 
                "ELSE st.txn_type\r\n" + 
                "END) as \"Transaction Type\" " +

                "from reports.dbo.sales_transaction st " +
                "left outer join  reports.dbo.payment_details pd1 on  st.id = pd1.sales_txn_id and  pd1.status='COMPLETED'  and pd1.payment_code ='GHS EVOUCHER'  " +
                "left outer join reports.dbo.payment_details pd2 on st.id = pd2.sales_txn_id and pd2.status='COMPLETED'  and pd2.payment_code ='ENCIRCLE' " +
                "left outer join (select pd3.sales_txn_id as \"sales_txn_id\" , pd3.status as \"status\", min(pd3.created_date) as \"created_dates\",max(pd3.last_modified_date) as \"last_modified_dates\" from reports.dbo.payment_details pd3 group by pd3.sales_txn_id,pd3.status) pd3 on st.id=pd3.sales_txn_id  and pd3.status='COMPLETED' " +
                "inner join reports.dbo.cash_memo cm on st.id = cm.id  " +
                "inner join reports.dbo.cash_memo_details cmd on cm.id = cmd.cash_memo_id  " +
                "inner join reports.dbo.customer_transaction ct on  st.id = ct.id  " +
                "inner join reports.dbo.boutique_master_view bmv on st.location_code = bmv.location_code and bmv.is_migrated_from_Legacy=1 " +
                "inner join reports.dbo.item_master im on cmd.item_code = im.item_code " +
                "inner join reports.dbo.product_group_master pgm  on cmd.product_group_code = pgm.product_group_code  " +
                
                "left outer join ( SELECT rt.doc_no , rt.doc_date , grd.cash_memo_details_id, rt.ref_sales_id , rt.txn_type from " + 
                "reports.dbo.refund_transaction rt inner join reports.dbo.goods_return_details grd on rt.id = grd.goods_return_id and rt.txn_type in ('GRN', 'CMCAN') and rt.status = 'CONFIRMED') rt on st.id = rt.ref_sales_id and cmd.id = rt.cash_memo_details_id " +

                "left outer join (SELECT * from ( SELECT dd1.sales_txn_id , did1.item_id as \"item_id1\", did1.discount_value , ROW_NUMBER() over (PARTITION BY dd1.sales_txn_id,did1.item_id order by did1.id) " +
                "as rn from reports.dbo.discount_details_sales dd1 " + 
                "inner join reports.dbo.discount_item_details did1 on dd1.id = did1.discount_details_id where dd1.applicable_level = 'BILL_LEVEL') dd1 " + 
                "where dd1.rn = 1 ) dd1 on st.id = dd1.sales_txn_id and cmd.id = item_id1 " + 
                "left outer join (SELECT * from (SELECT dd2.sales_txn_id, did2.item_id as \"item_id2\", did2.discount_value , ROW_NUMBER() over (PARTITION BY dd2.sales_txn_id,did2.item_id order by did2.id) " +
                "as rn from reports.dbo.discount_details_sales dd2 " + 
                "inner join reports.dbo.discount_item_details did2 on dd2.id = did2.discount_details_id where dd2.applicable_level = 'BILL_LEVEL' ) dd2 " + 
                "where dd2.rn = 2 ) dd2 on st.id = dd2.sales_txn_id and cmd.id = item_id2 " + 
                "left outer join (SELECT * from (SELECT dd3.sales_txn_id , did3.item_id as \"item_id3\", did3.discount_value , ROW_NUMBER() over (PARTITION BY dd3.sales_txn_id,did3.item_id order by did3.id) " +
                "as rn from reports.dbo.discount_details_sales dd3 " +
                "inner join reports.dbo.discount_item_details did3 on dd3.id = did3.discount_details_id where dd3.applicable_level = 'ITEM_LEVEL' ) dd3 " + 
                "where dd3.rn = 1) dd3 on st.id = dd3.sales_txn_id and cmd.id = item_id3 " + 
                "left outer join (SELECT * from (SELECT dd4.sales_txn_id , did4.item_id as \"item_id4\", did4.discount_value , ROW_NUMBER() over (PARTITION BY dd4.sales_txn_id,did4.item_id order by did4.id)" +
                " as rn from reports.dbo.discount_details_sales dd4 " + 
                "inner join reports.dbo.discount_item_details did4 on dd4.id = did4.discount_details_id where dd4.applicable_level = 'ITEM_LEVEL' ) dd4 " + 
                "where dd4.rn = 2) dd4 on st.id = dd4.sales_txn_id and cmd.id = item_id4 " + 
                "left outer join (SELECT * from (SELECT dd5.sales_txn_id , did5.item_id as \"item_id5\", did5.discount_value , ROW_NUMBER() over (PARTITION BY dd5.sales_txn_id,did5.item_id order by did5.id) " +
                " as rn from reports.dbo.discount_details_sales dd5 " + 
                "inner join reports.dbo.discount_item_details did5 on dd5.id = did5.discount_details_id where dd5.applicable_level = 'ITEM_LEVEL' ) dd5 " + 
                "where dd5.rn = 3) dd5 on st.id = dd5.sales_txn_id and cmd.id = item_id5 " +
                
                "left outer join( select fd1.sales_txn_id from reports.dbo.foc_details fd1 group by fd1.sales_txn_id) fd1 on st.id = fd1.sales_txn_id " +
                "where st.txn_type = 'CM' " +
                "and st.status='CONFIRMED' and st.txn_source is null ";
		// @formatter:on
		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		SalesReportRequestDto salesReportRequestDto = (SalesReportRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();

		if (!(StringUtils.isEmpty(salesReportRequestDto.getFromDate())
				&& StringUtils.isEmpty(salesReportRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(salesReportRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(salesReportRequestDto.getToDate());
			query.append(" AND st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate + "'");
		}
		if (salesReportRequestDto.getOwnerType() != null && !salesReportRequestDto.getOwnerType().isEmpty()) {
			query.append(" AND bmv.owner_type in (" + formatListToInClause(salesReportRequestDto.getOwnerType()))
					.append(")");
		}
		if (salesReportRequestDto.getBrandCode() != null && !salesReportRequestDto.getBrandCode().isEmpty()) {
			query.append(" AND bmv.brand_code in (" + formatListToInClause(salesReportRequestDto.getBrandCode()))
					.append(")");
		}

		validateLocationFields(salesReportRequestDto, query);
		if (salesReportRequestDto.getSalesReportCustomRequestDto() != null) {
			validateCustomInputAndAppend(salesReportRequestDto, query);
		}
		return query;
	}

	private StringBuilder validateLocationFields(SalesReportRequestDto salesReportRequestDto, StringBuilder query) {
		if (salesReportRequestDto.getSubRegionCode() != null && !salesReportRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(salesReportRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(salesReportRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + salesReportRequestDto.getStateId()).append("'");
		}
		if (salesReportRequestDto.getTownId() != null && !salesReportRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(salesReportRequestDto.getTownId())).append(")");
		}
		if (salesReportRequestDto.getLocationCode() != null && !salesReportRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(salesReportRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(salesReportRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + salesReportRequestDto.getCountryId()).append("'");
		}

		return query;
	}

	private StringBuilder validateCustomInputAndAppend(SalesReportRequestDto salesReportRequestDto,
			StringBuilder query) {
		if (!StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getFiscalYear())) {
			query.append(
					" AND st.fiscal_year ='" + salesReportRequestDto.getSalesReportCustomRequestDto().getFiscalYear())
					.append("'");
		}
		if (!StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getDocNo())) {
			query.append(" AND st.doc_no ='" + salesReportRequestDto.getSalesReportCustomRequestDto().getDocNo())
					.append("'");
		}
		if (!CollectionUtil.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getRsoName())) {
			query.append(" AND cmd.employee_code in("
					+ formatListToInClause(salesReportRequestDto.getSalesReportCustomRequestDto().getRsoName()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getKaratage())) {
			query.append(" AND im.karat in ("
					+ formatListToInClause(salesReportRequestDto.getSalesReportCustomRequestDto().getKaratage()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getComplexity())) {
			query.append(" AND im.complexity_code in ("
					+ formatListToInClause(salesReportRequestDto.getSalesReportCustomRequestDto().getComplexity()))
					.append(")");
		}
		if (!StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getCustomerMobileNo())) {
			query.append(" AND ct.mobile_number ='"
					+ salesReportRequestDto.getSalesReportCustomRequestDto().getCustomerMobileNo()).append("'");
		}
		if (!StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getCustomerName())) {
			query.append(" AND ct.customer_name ='"
					+ salesReportRequestDto.getSalesReportCustomRequestDto().getCustomerName()).append("'");
		}
		if (!StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getUlpNo())) {
			query.append(" AND ct.ulp_id ='" + salesReportRequestDto.getSalesReportCustomRequestDto().getUlpNo())
					.append("'");
		}
		if (!CollectionUtil.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getCfa())) {
			query.append(" AND cmd.product_group_code in ("
					+ formatListToInClause(salesReportRequestDto.getSalesReportCustomRequestDto().getCfa()))
					.append(")");
		}
		if (!CollectionUtil.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getBinGroup())) {
			query.append(" AND cmd.bin_code in ("
					+ formatListToInClause(salesReportRequestDto.getSalesReportCustomRequestDto().getBinGroup()))
					.append(")");
		}
		if (!(StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getFromValue())
				&& StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getToValue()))) {
			query.append(" AND cmd.final_value BETWEEN '"
					+ salesReportRequestDto.getSalesReportCustomRequestDto().getFromValue() + "' AND '"
					+ salesReportRequestDto.getSalesReportCustomRequestDto().getToValue() + "'");
		}
		if (!(StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getFromWt())
				&& StringUtils.isEmpty(salesReportRequestDto.getSalesReportCustomRequestDto().getToWt()))) {
			query.append(" AND cmd.total_weight BETWEEN '"
					+ salesReportRequestDto.getSalesReportCustomRequestDto().getFromWt() + "' AND '"
					+ salesReportRequestDto.getSalesReportCustomRequestDto().getToWt() + "'");
		}
		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		SalesReportRequestDto salesReportRequestDto = (SalesReportRequestDto) MapperUtil.getDtoMapping(reportRequestDto,
				SalesReportRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			SalesReportCustomRequestDto salesReportCustomRequestDto = new SalesReportCustomRequestDto();
			salesReportCustomRequestDto.validate(reportRequestDto.getCustomFields());
			salesReportCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), SalesReportCustomRequestDto.class);
			salesReportRequestDto.setSalesReportCustomRequestDto(salesReportCustomRequestDto);
		}
		return salesReportRequestDto;
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
