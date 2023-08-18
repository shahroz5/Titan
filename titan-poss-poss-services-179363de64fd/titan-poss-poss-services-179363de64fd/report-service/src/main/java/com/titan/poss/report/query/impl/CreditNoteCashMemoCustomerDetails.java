package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.CreditNoteCashMemoCustomerDetailsCustomRequestDto;
import com.titan.poss.report.dto.request.json.CreditNoteCashMemoCustomerDetailsRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("CreditNoteCashMemoCustomerDetails")
public class CreditNoteCashMemoCustomerDetails extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public CreditNoteCashMemoCustomerDetails(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("CREDIT_NOTE_CASH_MEMO_CUSTOMER_DETAILS", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		CreditNoteCashMemoCustomerDetailsRequestDto creditNoteCashMemoCustomerDetailsRequestDto=(CreditNoteCashMemoCustomerDetailsRequestDto) setCustomInput(reportRequestDto);
		// @formatter:off
		StringBuilder appendWhereClause = appendQuery(creditNoteCashMemoCustomerDetailsRequestDto);
		

		String select="select st.location_code as [Locationcode], st.doc_no as [CMno], FORMAT(CAST(st.doc_date as DATE),'dd/MM/yyy') as [CMdate],\r\n"
				+ "st.fiscal_year as [Fiscalyear], cm.total_quantity as [TotalQty], cm.total_weight as [TotalWeight],\r\n"
				+ "cm.total_value as [TotalAmount], cn.doc_no as [CrNo],pd.payment_code as [PaymentCode], cn.credit_note_type as [CreditnoteType],\r\n"
				+ "cn.amount as [CrAmount], FORMAT(CAST(cn.redeem_date as DATE),'dd/MM/yyy') as [RedeemDate],cn.fiscal_year as [CrFiscalyear],\r\n"
				+ "FORMAT(CAST(cn.doc_date as DATE),'dd/MM/yyy') as [CrDate], \r\n"
				+ "ct1.customer_id as [CMcustomerno], ct1.customer_name as [CMcustomerName],\r\n"
				+ "ct2.customer_id as [CNcustomerno],ct2.customer_name as [CNcustomername],cn.utilised_amount as [AdjustedAmount],ct2.ulp_id as [CNcustomerEncircleno],\r\n"
				+ "ct2.mobile_number as [CNcustomerMobileno],ct2.cust_tax_no as [CNpancardno], JSON_VALUE(ct2.customer_details,'$.data.form60') as [CNform60],\r\n"
				+ "ct1.ulp_id as [cmencircleno],ct1.mobile_number as [cmmobileno],ct1.cust_tax_no as [cmpancardno],JSON_VALUE(ct1.customer_details,'$.data.form60') as [cmform60]\r\n"
				+ "from sales_transaction st\r\n"
				+ "inner join reports.dbo.credit_note cn on cn.sales_txn_id=st.id\r\n"
				+ "inner join reports.dbo.payment_details pd on pd.reference_3=cn.id and cn.doc_no=pd.instrument_no and cn.fiscal_year=pd.reference_2 and pd.status='COMPLETED' and pd.payment_code='CREDIT NOTE' and pd.sales_txn_type=st.txn_type\r\n"
				+ "inner join reports.dbo.customer_transaction ct on ct.id=st.id\r\n"
				+ "inner join cash_memo cm on cm.id=st.id\r\n"
				+ "left outer join customer_transaction ct1 on ct1.id=st.id\r\n"
				+ "left outer join customer_transaction ct2 on ct2.id=cn.sales_txn_id\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "where cn.status='REDEEMED' and st.txn_type='CM' and st.status='CONFIRMED'";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		CreditNoteCashMemoCustomerDetailsRequestDto creditNoteCashMemoCustomerDetailsRequestDto= (CreditNoteCashMemoCustomerDetailsRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(creditNoteCashMemoCustomerDetailsRequestDto.getFromDate())
				&& StringUtils.isEmpty(creditNoteCashMemoCustomerDetailsRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(creditNoteCashMemoCustomerDetailsRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(creditNoteCashMemoCustomerDetailsRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(creditNoteCashMemoCustomerDetailsRequestDto, query);
		if (creditNoteCashMemoCustomerDetailsRequestDto.getCreditNoteCashMemoCustomerDetailsCustomRequestDto() != null) {
			validateCustomInputAndAppend(creditNoteCashMemoCustomerDetailsRequestDto, query);
		}
		query.append(" order by st.location_code,st.created_date");
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(CreditNoteCashMemoCustomerDetailsRequestDto creditNoteCashMemoCustomerDetailsRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(CreditNoteCashMemoCustomerDetailsRequestDto creditNoteCashMemoCustomerDetailsRequestDto, StringBuilder query) {
		
		
		if (creditNoteCashMemoCustomerDetailsRequestDto.getSubRegionCode() != null && !creditNoteCashMemoCustomerDetailsRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(creditNoteCashMemoCustomerDetailsRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(creditNoteCashMemoCustomerDetailsRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + creditNoteCashMemoCustomerDetailsRequestDto.getStateId()).append("'");
		}
		if (creditNoteCashMemoCustomerDetailsRequestDto.getTownId() != null && !creditNoteCashMemoCustomerDetailsRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(creditNoteCashMemoCustomerDetailsRequestDto.getTownId())).append(")");
		}
		if (creditNoteCashMemoCustomerDetailsRequestDto.getLocationCode() != null && !creditNoteCashMemoCustomerDetailsRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(creditNoteCashMemoCustomerDetailsRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(creditNoteCashMemoCustomerDetailsRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + creditNoteCashMemoCustomerDetailsRequestDto.getCountryId()).append("'");
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
		
		CreditNoteCashMemoCustomerDetailsRequestDto creditNoteCashMemoCustomerDetailsRequestDto = (CreditNoteCashMemoCustomerDetailsRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, CreditNoteCashMemoCustomerDetailsRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			CreditNoteCashMemoCustomerDetailsCustomRequestDto creditNoteCashMemoCustomerDetailsCustomRequestDto = new CreditNoteCashMemoCustomerDetailsCustomRequestDto();
			creditNoteCashMemoCustomerDetailsCustomRequestDto.validate(reportRequestDto.getCustomFields());
			creditNoteCashMemoCustomerDetailsCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), CreditNoteCashMemoCustomerDetailsCustomRequestDto.class);
			creditNoteCashMemoCustomerDetailsRequestDto.setCreditNoteCashMemoCustomerDetailsCustomRequestDto(creditNoteCashMemoCustomerDetailsCustomRequestDto);
		}
		
		return creditNoteCashMemoCustomerDetailsRequestDto;
	}
	
	

}
