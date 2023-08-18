/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.PaymentDetailsCustomRequestDto;
import com.titan.poss.report.dto.request.json.PaymentDetailsRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class PaymentReport extends IReport {

	public PaymentReport(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("PAYMENT_REPORT_TEST", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		PaymentDetailsRequestDto paymentDetailsRequestDto = (PaymentDetailsRequestDto) setCustomInput(reportRequestDto);
		StringBuilder appendWhereClause = appendQuery(paymentDetailsRequestDto);

		StringBuilder commonSelectQuery = new StringBuilder("select st.location_code  as \"Location Code\",   "
				+ "bmv.owner_type as \"Btq Level\",  bmv.sub_region_code as \"Region\",     "
				+ "bmv.state_name as \"State\",  bmv.town_name as \"City\",     "
				+ "st.doc_date as \"Business Date\",  st.doc_no as \"Doc No\", CASE  WHEN pd.payment_group = 'WALLET' THEN 'Wallet'  "
				+ "   WHEN pd.payment_group = 'BANK LOAN' THEN 'Bank Loan'  "
				+ "   WHEN pd.payment_code  = 'AIRPAY' THEN 'Airpay'  "
				+ "   WHEN pd.payment_code  = 'CARD' THEN 'Card'    "
				+ "   WHEN pd.payment_code  = 'CASH' THEN 'Cash'  "
				+ "   WHEN pd.payment_code  = 'CASHBACK' THEN 'Cash Back Offer'  "
				+ "   WHEN pd.payment_code  = 'CHEQUE' THEN 'Cheque'  "
				+ "   WHEN pd.payment_code  = 'CREDIT NOTE' THEN 'Credit Note'  "
				+ "   WHEN pd.payment_code  = 'EMPLOYEE LOAN' THEN 'Employee Loan'  "
				+ "   WHEN pd.payment_code  = 'ENCIRCLE' THEN 'Encircle Points Redemption'  "
				+ "   WHEN pd.payment_code  = 'GEP EXCHANGE' THEN 'GEP exchange'  "
				+ "   WHEN pd.payment_code  = 'GHS ACCOUNT' THEN 'GHS Account'  "
				+ "   WHEN pd.payment_code  = 'GHS EVOUCHER' THEN 'GHS eVoucher'  "
				+ "   WHEN pd.payment_code  = 'GIFT VOUCHER' THEN 'Gift Vouhcher'  "
				+ "   WHEN pd.payment_code  = 'RO PAYMENT' THEN 'RO Payments'  "
				+ "   WHEN pd.payment_code  = 'TATA LOYALTY POINTS' THEN 'Tata Loyalty Points'  "
				+ "  ELSE pd.payment_code  END as \"Mode Of Amount Collection\",   "
				+ "pd.instrument_no as \"Instrument Number\",   " + "pd.instrument_type as \"Instrument Type\",   "
				+ "pd.amount as \"Amount\",   " + "pd.bank_name as \"Bank Name\",   "
				+ "JSON_VALUE(pd.other_details ,'$.data.isWorkFlowApproval') as \"Approved By Work Flow\",   "
				+ "JSON_VALUE(pd.other_details ,'$.data.downPayment') as \"Down Payment Collected\",   "
				+ "JSON_VALUE(pd.other_details ,'$.data.totalApprovedLoan') as \"Total Approved Loan\",   "
				+ "JSON_VALUE(pd.other_details ,'$.data.employeeCode') as \"Employee Code\",   "
				+ "JSON_VALUE(pd.other_details ,'$.data.totalNoOfEMIApproved') as \"Total No Of EMI Approved\" ");

		String commonFromQuery = "FROM  sales_transaction st,  boutique_master_view bmv,  payment_details pd,   ";

		String commonWhereQuery = "WHERE pd.sales_txn_id  = st.id  AND st.location_code  = bmv.location_code  AND pd.status ='COMPLETED' ";

		String cmSelectQuery = ", cm.final_value as \"Invoice Amount\",  "
				+ "case when st.sub_txn_type='GIFT_SALE' then 'QCGC - Gift Card'\r\n"
				+ " else 'Cash Memo' end as  \"Transaction Type\" ";

		String cmFromQuery = "cash_memo cm ";

		String cmWhereQuery = " and cm.id=st.id";

		String cmString = commonSelectQuery + cmSelectQuery + commonFromQuery + cmFromQuery + commonWhereQuery
				+ cmWhereQuery;

		String cmQuery = String.format("%s%s", cmString, appendWhereClause);

		// ADV
		String advSelectQuery = ", ap.final_value as \"Invoice Amount\",  "
				+ "case WHEN st.sub_txn_type='FROZEN_RATES' then 'GRF'\r\n"
				+ "ELSE 'Accept Advance' end as \"Transaction Type\" ";

		String advFromQuery = " advance_payment ap ";

		String advWhereQuery = " and ap.id=st.id";

		String advString = commonSelectQuery + advSelectQuery + commonFromQuery + advFromQuery + commonWhereQuery
				+ advWhereQuery;

		String advQuery = String.format("%s%s", advString, appendWhereClause);

		// AB
		String abSelectQuery = ", so.final_value as \"Invoice Amount\", 'Advance Booking' as \"Transaction Type\" ";

		String abFromQuery = " sales_order so ";

		String abWhereQuery = " and so.id=st.id";

		String abString = commonSelectQuery + abSelectQuery + commonFromQuery + abFromQuery + commonWhereQuery
				+ abWhereQuery;

		String abQuery = String.format("%s%s", abString, appendWhereClause);

		StringBuilder finalQuery = new StringBuilder(cmQuery).append("\r\nUNION\r\n").append(advQuery)
				.append("\r\nUNION\r\n").append(abQuery);


		return finalQuery.toString();
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		PaymentDetailsRequestDto paymentDetailsRequestDto = (PaymentDetailsRequestDto) reportRequestDto;
		StringBuilder query = new StringBuilder();
		if (!(StringUtils.isEmpty(paymentDetailsRequestDto.getFromDate())
				&& StringUtils.isEmpty(paymentDetailsRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(paymentDetailsRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(paymentDetailsRequestDto.getToDate());

			query.append(" AND st.doc_date BETWEEN '" + fromDate + "' AND '" + toDate + "'");
		} else {
			throw new ServiceException("Required field(s) missing", "ERR-REPORT-011");
		}

		if (paymentDetailsRequestDto.getPaymentDetailsCustomRequestDto() != null) {
			if (paymentDetailsRequestDto.getPaymentDetailsCustomRequestDto().getPaymentType() != null
					&& !paymentDetailsRequestDto.getPaymentDetailsCustomRequestDto().getPaymentType().isEmpty()) {
				query.append(" AND pd.payment_code in (" + formatListToInClause(
						paymentDetailsRequestDto.getPaymentDetailsCustomRequestDto().getPaymentType())).append(")");
			}

			if (paymentDetailsRequestDto.getOwnerType() != null && !paymentDetailsRequestDto.getOwnerType().isEmpty()) {
				query.append(
						" AND bmv.owner_type in  (" + formatListToInClause(paymentDetailsRequestDto.getOwnerType()))
						.append(")");
			}
		}
		if (paymentDetailsRequestDto.getBrandCode() != null
				&& !paymentDetailsRequestDto.getBrandCode().isEmpty()) {
			query.append(" AND bmv.brand_code in (" + formatListToInClause(paymentDetailsRequestDto.getBrandCode()))
					.append(")");
		}

		validateLocationFields(paymentDetailsRequestDto, query);
		return query;
	}

	private StringBuilder validateLocationFields(PaymentDetailsRequestDto paymentDetailsRequestDto,
			StringBuilder query) {
		if (paymentDetailsRequestDto.getSubRegionCode() != null
				&& !paymentDetailsRequestDto.getSubRegionCode().isEmpty()) {
			query.append(
					" AND bmv.region_code in (" + formatListToInClause(paymentDetailsRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(paymentDetailsRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + paymentDetailsRequestDto.getStateId()).append("'");
		}
		if (paymentDetailsRequestDto.getTownId() != null && !paymentDetailsRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(paymentDetailsRequestDto.getTownId()))
					.append(")");
		}
		if (paymentDetailsRequestDto.getLocationCode() != null
				&& !paymentDetailsRequestDto.getLocationCode().isEmpty()) {
			query.append(
					" AND bmv.location_code in (" + formatListToInClause(paymentDetailsRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(paymentDetailsRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + paymentDetailsRequestDto.getCountryId()).append("'");
		}

		return query;
	}

	@Override
	protected ReportRequestDto setCustomInput(ReportRequestDto reportRequestDto) {
		PaymentDetailsRequestDto paymentDetailsRequestDto = (PaymentDetailsRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, PaymentDetailsRequestDto.class);

		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			PaymentDetailsCustomRequestDto paymentDetailsCustomRequestDto = new PaymentDetailsCustomRequestDto();
			paymentDetailsCustomRequestDto.validate(reportRequestDto.getCustomFields());

			paymentDetailsCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), PaymentDetailsCustomRequestDto.class);
			paymentDetailsRequestDto.setPaymentDetailsCustomRequestDto(paymentDetailsCustomRequestDto);
		}

		return paymentDetailsRequestDto;

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
