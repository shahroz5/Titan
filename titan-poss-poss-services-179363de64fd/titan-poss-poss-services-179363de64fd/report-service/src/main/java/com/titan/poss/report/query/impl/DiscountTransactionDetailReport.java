package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.DiscountTransactionReportCustomRequestDto;
import com.titan.poss.report.dto.request.json.DiscountTransactionReportRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component("DiscountTransactionDetailsReport")
public class DiscountTransactionDetailReport extends IReport {

	@Autowired
	ReportFactory reportFactory;

	public DiscountTransactionDetailReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("DISCOUNT_TRANSACTION_DETAIL_REPORT", this);
	}

	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {

		DiscountTransactionReportRequestDto discountTransactionReportRequestDto = (DiscountTransactionReportRequestDto) setCustomInput(
				reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(discountTransactionReportRequestDto);
		String select = "select " + "format(cast(st.doc_date as \"date\"), 'dd/MM/yyyy') as \"Doc Date\", "
				+ "st.location_code as \"Location Code\", " + "bmv.owner_type as \"Btq Level\", "
				+ "bmv.brand_code as \"Brand\", " + "bmv.sub_region_code as \"Region\", "
				+ "bmv.state_name as \"State\", " + "bmv.town_name as \"City\", " + "st.doc_no as \"Doc No\", "
				+ "st.fiscal_year as \"Fiscal Year\", " + "cmd.product_group_code as \"CFA Product Code\", "
				+ "pgm.description as \"CFA Product Code Description\", " + "cmd.inventory_weight as \"Actual Wt\", "
				+ "cmd.total_weight as \"Measured Wt\", " + "cmd.inventory_weight-cmd.total_weight as \"Wt DFRNS\", "
				+ "cmd.inventory_std_weight as \"Gross Wt\", " + "cmd.total_quantity as \"Quantity\", "
				+ "im.karat as \"Karatage\", " + "im.complexity_code as \"Complexity Code\", "
				+ "cmd.item_code as \"Item Code\", " + "cmd.lot_number as \"Lot Number\", "
				+ "im.description as \"Item Description\", " + "cmd.total_value as \"Total Pre Discount Total Value\", "
				+ "JSON_VALUE(cmd.price_details, '$.metalPriceDetails.preDiscountValue') as \"Total Metal Value\", "
				+ "JSON_VALUE(cmd.price_details, '$.stonePriceDetails.preDiscountValue') as \"Total Stone Value\", "
				+ "JSON_VALUE(cmd.price_details, '$.makingChargeDetails.preDiscountValue') as \"Total Making Charges\", "
				+ "cmd.unit_value as \"Unit value\", "
				+ "dd1.discount_code as \"Bill Level Discount 1 Discount Code\", "
				+ "(CASE WHEN JSON_VALUE(dd1.discount_value_details, '$.data.discountValueDetails[0].isDiscountPercentage') = 'true' then 'Discount %' "
				+ "WHEN JSON_VALUE(dd1.discount_value_details, '$.data.discountValueDetails[0].isDiscountPercentage') = 'false' then 'FLAT VALUE' "
				+ "ELSE ''  END) as \"Bill Level Discount 1 Discount Type\", "
				+ "JSON_VALUE(dd1.discount_value_details, '$.data.discountValueDetails[0].discountPercent') as \"Bill Level Discount 1 Discount Percentage\", "
				+ "JSON_VALUE(dd1.discount_value_details, '$.data.discountValueDetails[0].discountValue') as \"Bill Level Discount 1 Discount Amount\", "
				+ "dd2.discount_code as \"Bill Level Discount 2 Discount Code\", "
				+ "(CASE  WHEN JSON_VALUE(dd2.discount_value_details, '$.data.discountValueDetails[0].isDiscountPercentage') = 'true' then 'Discount %' "
				+ "WHEN JSON_VALUE(dd2.discount_value_details, '$.data.discountValueDetails[0].isDiscountPercentage') = 'false' then 'FLAT VALUE' "
				+ "ELSE ''  END) as \"Bill Level Discount 2 Discount Type\", "
				+ "JSON_VALUE(dd2.discount_value_details, '$.data.discountValueDetails[0].discountPercent') as \"Bill Level Discount 2 Discount Percentage\", "
				+ "JSON_VALUE(dd2.discount_value_details, '$.data.discountValueDetails[0].discountValue') as \"Bill Level Discount 2 Discount Amount\", "
				+ "dd3.discount_code as \"Item Level Discount 1 Discount Code 1\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[0].component') as \"Item Level Discount 1 Discount Applicable on 1\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[0].discountPercent') as \"Item Level Discount 1 Discount Percentage 1\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[0].discountValue') as \"Item Level Discount 1 Discount Amount 1\", "
				+ "dd3.discount_code as \"Item Level Discount 1 Discount Code 2\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[1].component') as \"Item Level Discount 1 Discount Applicable on 2\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[1].discountPercent') as \"Item Level Discount 1 Discount Percentage 2\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[1].discountValue') as \"Item Level Discount 1 Discount Amount 2\", "
				+ "dd3.discount_code as \"Item Level Discount 1 Discount Code 3\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[2].component') as \"Item Level Discount 1 Discount Applicable on 3\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[2].discountPercent') as \"Item Level Discount 1 Discount Percentage 3\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[2].discountValue') as \"Item Level Discount 1 Discount Amount 3\", "
				+ "dd3.discount_code as \"Item Level Discount 1 Discount Code 4\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[3].component') as \"Item Level Discount 1 Discount Applicable on 4\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[3].discountPercent') as \"Item Level Discount 1 Discount Percentage 4\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[3].discountValue') as \"Item Level Discount 1 Discount Amount 4\", "
				+ "dd3.discount_code as \"Item Level Discount 1 Discount Code 5\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[4].component') as \"Item Level Discount 1 Discount Applicable on 5\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[4].discountPercent') as \"Item Level Discount 1 Discount Percentage 5\", "
				+ "JSON_VALUE(dd3.discount_value_details, '$.data[4].discountValue') as \"Item Level Discount 1 Discount Amount 5\", "
				+ "dd4.discount_code as \"Item Level Discount 2 Discount Code 1\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[0].component') as \"Item Level Discount 2 Discount Applicable on 1\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[0].discountPercent') as \"Item Level Discount 2 Discount Percentage 1\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[0].discountValue') as \"Item Level Discount 2 Discount Amount 1\", "
				+ "dd4.discount_code as \"Item Level Discount 2 Discount Code 2\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[1].component') as \"Item Level Discount 2 Discount Applicable on 2\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[1].discountPercent') as \"Item Level Discount 2 Discount Percentage 2\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[1].discountValue') as \"Item Level Discount 2 Discount Amount 2\", "
				+ "dd4.discount_code as \"Item Level Discount 2 Discount Code 3\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[2].component') as \"Item Level Discount 2 Discount Applicable on 3\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[2].discountPercent') as \"Item Level Discount 2 Discount Percentage 3\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[2].discountValue') as \"Item Level Discount 2 Discount Amount 3\", "
				+ "dd4.discount_code as \"Item Level Discount 2 Discount Code 4\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[3].component') as \"Item Level Discount 2 Discount Applicable on 4\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[3].discountPercent') as \"Item Level Discount 2 Discount Percentage 4\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[3].discountValue') as \"Item Level Discount 2 Discount Amount 4\", "
				+ "dd4.discount_code as \"Item Level Discount 2 Discount Code 5\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[4].component') as \"Item Level Discount 2 Discount Applicable on 5\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[4].discountPercent') as \"Item Level Discount 2 Discount Percentage 5\", "
				+ "JSON_VALUE(dd4.discount_value_details, '$.data[4].discountValue') as \"Item Level Discount 2 Discount Amount 5\", "
				+ "dd5.discount_code as \"Item Level Discount 3 Discount Code 1\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[0].component') as \"Item Level Discount 3 Discount Applicable on 1\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[0].discountPercent') as \"Item Level Discount 3 Discount Percentage 1\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[0].discountValue') as \"Item Level Discount 3 Discount Amount 1\", "
				+ "dd5.discount_code as \"Item Level Discount 3 Discount Code 2\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[1].component') as \"Item Level Discount 3 Discount Applicable on 2\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[1].discountPercent') as \"Item Level Discount 3 Discount Percentage 2\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[1].discountValue') as \"Item Level Discount 3 Discount Amount 2\", "
				+ "dd5.discount_code as \"Item Level Discount 3 Discount Code 3\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[2].component') as \"Item Level Discount 3 Discount Applicable on 3\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[2].discountPercent') as \"Item Level Discount 3 Discount Percentage 3\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[2].discountValue') as \"Item Level Discount 3 Discount Amount 3\", "
				+ "dd5.discount_code as \"Item Level Discount 3 Discount Code 4\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[3].component') as \"Item Level Discount 3 Discount Applicable on 4\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[3].discountPercent') as \"Item Level Discount 3 Discount Percentage 4\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[3].discountValue') as \"Item Level Discount 3 Discount Amount 4\", "
				+ "dd5.discount_code as \"Item Level Discount 3 Discount Code 5\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[4].component') as \"Item Level Discount 3 Discount Applicable on 5\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[4].discountPercent') as \"Item Level Discount 3 Discount Percentage 5\", "
				+ "JSON_VALUE(dd5.discount_value_details, '$.data[4].discountValue') as \"Item Level Discount 3 Discount Amount 5\", "
				+ "COALESCE(dd3.discount_value,0) + COALESCE(dd4.discount_value,0) + COALESCE(dd5.discount_value,0) as \"Overall Total Item Level Discount\", "
				+ "COALESCE(dd1.discount_value,0) + COALESCE(dd2.discount_value,0) as \"Overall Total Bill Level Discount\", "
				+ "cmd.total_tax as \"Total Tax\", " + "cmd.final_value as \"Total Invoice Value\", "
				+ "(CASE WHEN fd1.sales_txn_id is not null then 'TRUE' " + "ELSE 'FALSE'  END) as \"Is FOC\", "
				+ "(CASE  WHEN fd1.sales_txn_id is not null then 'AUTOMATIC' " + "ELSE ''  END) as \"FOC Status\", "
				+ "JSON_VALUE(st.metal_rate_details , '$.metalRates.J.ratePerUnit') as \"Gold Rate\", "
				+ "JSON_VALUE(st.metal_rate_details , '$.metalRates.L.ratePerUnit') as \"Platinum Rate\", "
				+ "JSON_VALUE(st.metal_rate_details , '$.metalRates.P.ratePerUnit') as \"Silver Rate\", "
				+ "st.remarks as \"Remarks\", " + "ct.customer_id as \"Customer No\", "
				+ "ct.title as \"Customer Title\", " + "ct.customer_name as \"Customer Name\", "
				+ "ct.mobile_number as \"Mobile No\", " + "ct.ulp_id as \"Loyalty No\", "
				+ "cmd.employee_code as \"RSO Name\", " + "cmd.bin_code as \"Bin Code\", "
				+ "JSON_VALUE(st.discount_txn_details , '$.data.employeeDetails.couponDetails[0].couponCode') as \"Employee Coupon No\", "
				+ "pd1.instrument_no as \"GHS eVoucher\" , '' as \"GHS Discount Voucher\" from reports.dbo.sales_transaction st "
				+ "left outer join reports.dbo.payment_details pd1 on st.id = pd1.sales_txn_id and pd1.status = 'COMPLETED' and pd1.payment_code = 'GHS EVOUCHER' "
				+ "left outer join reports.dbo.payment_details pd2 on st.id = pd2.sales_txn_id and pd2.status = 'COMPLETED' and pd2.payment_code = 'ENCIRCLE' "
				+ "left outer join (select  pd3.sales_txn_id as \"sales_txn_id\" , pd3.status as \"status\", min(pd3.created_date) as \"created_dates\", max(pd3.last_modified_date) as \"last_modified_dates\" from  reports.dbo.payment_details pd3  group by  pd3.sales_txn_id, pd3.status) pd3 on  st.id = pd3.sales_txn_id  and pd3.status = 'COMPLETED' "
				+ "inner join reports.dbo.cash_memo cm on  st.id = cm.id "
				+ "inner join reports.dbo.cash_memo_details cmd on cm.id = cmd.cash_memo_id "
				+ "inner join reports.dbo.customer_transaction ct on st.id = ct.id "
				+ "inner join reports.dbo.boutique_master_view bmv on st.location_code = bmv.location_code "
				+ "inner join reports.dbo.item_master im on cmd.item_code = im.item_code "
				+ "inner join reports.dbo.product_group_master pgm on cmd.product_group_code = pgm.product_group_code "
				+ "left outer join (SELECT * from (SELECT did1.item_id , dd1.discount_code , dd1.discount_value_details, dd1.sales_txn_id , did1.item_id as \"item_id1\", did1.discount_value , ROW_NUMBER() over ( "
				+ "order by did1.id ) as rn from reports.dbo.discount_details_sales dd1 inner join reports.dbo.discount_item_details did1 on dd1.id = did1.discount_details_id where dd1.applicable_level = 'BILL_LEVEL' ) dd1 "
				+ "where dd1.rn = 1 ) dd1 on st.id = dd1.sales_txn_id and cmd.id = item_id1 "
				+ "left outer join (SELECT * from (SELECT dd2.discount_code , dd2.discount_value_details, dd2.sales_txn_id , did2.item_id as \"item_id2\", did2.discount_value , ROW_NUMBER() over ( "
				+ "order by did2.id ) as rn from reports.dbo.discount_details_sales dd2 inner join reports.dbo.discount_item_details did2 on dd2.id = did2.discount_details_id where dd2.applicable_level = 'BILL_LEVEL' ) dd2 "
				+ "where dd2.rn = 2 ) dd2 on st.id = dd2.sales_txn_id and cmd.id = item_id2 "
				+ "left outer join (SELECT * from (SELECT dd3.discount_code , dd3.discount_value_details, dd3.sales_txn_id , did3.item_id as \"item_id3\", did3.discount_value , ROW_NUMBER() over ( "
				+ "order by did3.id ) as rn from reports.dbo.discount_details_sales dd3 inner join reports.dbo.discount_item_details did3 on dd3.id = did3.discount_details_id where dd3.applicable_level = 'ITEM_LEVEL' ) dd3 "
				+ "where dd3.rn = 1) dd3 on st.id = dd3.sales_txn_id and cmd.id = item_id3 "
				+ "left outer join (SELECT * from (SELECT dd4.discount_code , dd4.discount_value_details, did4.id, dd4.sales_txn_id , did4.item_id as \"item_id4\", did4.discount_value , ROW_NUMBER() over ( "
				+ "order by did4.id ) as rn from reports.dbo.discount_details_sales dd4 inner join reports.dbo.discount_item_details did4 on dd4.id = did4.discount_details_id where dd4.applicable_level = 'ITEM_LEVEL' ) dd4 "
				+ "where dd4.rn = 2) dd4 on st.id = dd4.sales_txn_id and cmd.id = item_id4 "
				+ "left outer join (SELECT * from (SELECT dd5.discount_code , dd5.discount_value_details, dd5.sales_txn_id , did5.item_id as \"item_id5\", did5.discount_value , ROW_NUMBER() over ( "
				+ "order by did5.id ) as rn from reports.dbo.discount_details_sales dd5 inner join reports.dbo.discount_item_details did5 on dd5.id = did5.discount_details_id where dd5.applicable_level = 'ITEM_LEVEL' ) dd5 "
				+ "where dd5.rn = 3) dd5 on st.id = dd5.sales_txn_id and cmd.id = item_id5 "
				+ "left outer join(Select fd1.sales_txn_id from reports.dbo.foc_details fd1 group by fd1.sales_txn_id ) fd1 on st.id = fd1.sales_txn_id "
				+ "where st.txn_type = 'CM' and st.status = 'CONFIRMED'";
		return String.format("%s%s", select, appendWhereClause);
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		DiscountTransactionReportRequestDto discountTransactionReportRequestDto = (DiscountTransactionReportRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();

		if (!(StringUtils.isEmpty(discountTransactionReportRequestDto.getFromDate())
				&& StringUtils.isEmpty(discountTransactionReportRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(discountTransactionReportRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(discountTransactionReportRequestDto.getToDate());
			query.append(" AND st.doc_date BETWEEN '" + fromDate + "'  AND  '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}
		if (discountTransactionReportRequestDto.getOwnerType() != null
				&& !discountTransactionReportRequestDto.getOwnerType().isEmpty()) {
			query.append(" AND bmv.owner_type in ("
					+ formatListToInClause(discountTransactionReportRequestDto.getOwnerType())).append(")");
		}
		if (discountTransactionReportRequestDto.getBrandCode() != null
				&& !discountTransactionReportRequestDto.getBrandCode().isEmpty()) {
			query.append(" AND bmv.brand_code in ("
					+ formatListToInClause(discountTransactionReportRequestDto.getBrandCode())).append(")");
		}
		validateLocationFields(discountTransactionReportRequestDto, query);
		validateCustomInputAndAppend(discountTransactionReportRequestDto, query);
		return query;
	}

	private StringBuilder validateLocationFields(
			DiscountTransactionReportRequestDto discountTransactionReportRequestDto, StringBuilder query) {
		if (discountTransactionReportRequestDto.getSubRegionCode() != null
				&& !discountTransactionReportRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in ("
					+ formatListToInClause(discountTransactionReportRequestDto.getSubRegionCode())).append(")");
		}
		if (!StringUtils.isEmpty(discountTransactionReportRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + discountTransactionReportRequestDto.getStateId()).append("'");
		}
		if (discountTransactionReportRequestDto.getTownId() != null
				&& !discountTransactionReportRequestDto.getTownId().isEmpty()) {
			query.append(
					" AND bmv.town_id in (" + formatListToInClause(discountTransactionReportRequestDto.getTownId()))
					.append(")");
		}
		if (discountTransactionReportRequestDto.getLocationCode() != null
				&& !discountTransactionReportRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in ("
					+ formatListToInClause(discountTransactionReportRequestDto.getLocationCode())).append(")");
		}

		if (!StringUtils.isEmpty(discountTransactionReportRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + discountTransactionReportRequestDto.getCountryId()).append("'");
		}
		return query;
	}

	private StringBuilder validateCustomInputAndAppend(
			DiscountTransactionReportRequestDto discountTransactionReportRequestDto, StringBuilder query) {
		if (!StringUtils.isEmpty(
				discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getFiscalYear())) {
			query.append(" AND st.fiscal_year ='" + discountTransactionReportRequestDto
					.getDiscountTransactionReportCustomRequestDto().getFiscalYear()).append("'");
		}
		if (!CollectionUtil.isEmpty(
				discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getRsoName())) {
			query.append(" AND cmd.employee_code in(" + formatListToInClause(
					discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getRsoName()))
					.append(")");
		}
		if (!StringUtils.isEmpty(discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto()
				.getCustomerMobileNo())) {
			query.append(" AND ct.mobile_number ='" + discountTransactionReportRequestDto
					.getDiscountTransactionReportCustomRequestDto().getCustomerMobileNo()).append("'");
		}
		if (!StringUtils.isEmpty(
				discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getCustomerName())) {
			query.append(" AND ct.customer_name ='" + discountTransactionReportRequestDto
					.getDiscountTransactionReportCustomRequestDto().getCustomerName()).append("'");
		}
		if (!StringUtils.isEmpty(
				discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getUlpNo())) {
			query.append(" AND ct.ulp_id ='"
					+ discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getUlpNo())
					.append("'");
		}
		if (!CollectionUtil
				.isEmpty(discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getCfa())) {
			query.append(" AND cmd.product_group_code in (" + formatListToInClause(
					discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getCfa()))
					.append(")");
		}
		if (!(StringUtils.isEmpty(
				discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getFromValue())
				&& StringUtils.isEmpty(discountTransactionReportRequestDto
						.getDiscountTransactionReportCustomRequestDto().getToValue()))) {
			query.append(" AND cmd.final_value BETWEEN '"
					+ discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getFromValue()
					+ "' AND '"
					+ discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getToValue()
					+ "'");
		}
		if (!(StringUtils
				.isEmpty(discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getFromWt())
				&& StringUtils.isEmpty(discountTransactionReportRequestDto
						.getDiscountTransactionReportCustomRequestDto().getToWt()))) {
			query.append(" AND cmd.total_weight BETWEEN '"
					+ discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getFromWt()
					+ "' AND '"
					+ discountTransactionReportRequestDto.getDiscountTransactionReportCustomRequestDto().getToWt()
					+ "'");
		}

		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		DiscountTransactionReportRequestDto discountTransactionReportRequestDto = (DiscountTransactionReportRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, DiscountTransactionReportRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			DiscountTransactionReportCustomRequestDto discountTransactionReportCustomRequestDto = new DiscountTransactionReportCustomRequestDto();
			discountTransactionReportCustomRequestDto.validate(reportRequestDto.getCustomFields());
			discountTransactionReportCustomRequestDto = MapperUtil.getObjectMapperInstance().convertValue(
					reportRequestDto.getCustomFields().getData(), DiscountTransactionReportCustomRequestDto.class);
			discountTransactionReportRequestDto
					.setDiscountTransactionReportCustomRequestDto(discountTransactionReportCustomRequestDto);
		}
		return discountTransactionReportRequestDto;
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
