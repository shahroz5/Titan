package com.titan.poss.report.query.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.report.dto.request.ReportRequestDto;
import com.titan.poss.report.dto.request.json.BillingTimeCustomRequestDto;
import com.titan.poss.report.dto.request.json.BillingTimeRequestDto;
import com.titan.poss.report.factory.ReportFactory;
import com.titan.poss.report.query.IReport;

@Component("BillingTime")
public class BillingTime extends IReport {

	
	@Autowired
	ReportFactory reportFactory;
	public BillingTime(ReportFactory reportFactory) {
		reportFactory.registerReportQuery("BILLING_TIME_REPORT", this);
	}
	
	@Override
	public String buildQuery(ReportRequestDto reportRequestDto) {
		
		
		BillingTimeRequestDto billingTimeRequestDto=(BillingTimeRequestDto) setCustomInput(reportRequestDto);
		
		StringBuilder appendWhereClause = appendQuery(billingTimeRequestDto);
		

		String select="select bmv.sub_region_code as [Region],\r\n"
				+ "st.location_code as [LocationCode], \r\n"
				+ "st.created_by as [Cashiername],\r\n"
				+ "em.emp_name as [RSOname],\r\n"
				+ "st.fiscal_year as [FisicalYear],\r\n"
				+ "bmv.owner_type as [LEVEL],\r\n"
				+ "ct.mobile_number as [CustomerMobileNo],\r\n"
				+ "ct.customer_name as [CustomerName], \r\n"
				+ "st.doc_no as [Cmno],\r\n"
				+ "Format(CAST(st.doc_date as DATE),'dd/MM/yyyy') as [Invoicedate],  \r\n"
				+ "convert(char(10),st.last_hold_time,108) as [CM Last Holding Time],\r\n"
				+ "convert(char(10),st.last_invoke_time,108) [CM Last Invoke Time],\r\n"
				+ "convert(char(10),st.confirmed_time,108) as [Invoice Time],\r\n"
				+ "FORMAT(DATEDIFF(minute,st.last_hold_time,st.confirmed_time),'00')+':'+FORMAT(DATEDIFF(second,st.last_hold_time,st.confirmed_time)%60,'00') as [From Last Holding Time to Invoice Time],\r\n"
				+ "FORMAT(DATEDIFF(minute,st.last_invoke_time,st.confirmed_time),'00')+':'+FORMAT(DATEDIFF(second,st.last_invoke_time,st.confirmed_time)%60,'00') as [From Invoking CM to Invoice Time],\r\n"
				+ "FORMAT(DATEDIFF(minute,st.last_hold_time,st.last_invoke_time),'00')+':'+FORMAT(DATEDIFF(second,st.last_hold_time,st.last_invoke_time)%60,'00') as [From Last Holding Time to Invoke Time],\r\n"
				+ "cm.total_quantity as [TotalQty],\r\n"
				+ "ISNULL(PaymentsCount.CASH,0) as [Cash],\r\n"
				+ "ISNULL(PaymentsCount.CARD, 0) as [CC],\r\n"
				+ "ISNULL(PaymentsCount.AIRPAY,0) as [Airpay],\r\n"
				+ "ISNULL(PaymentsCount.CHEQUE,0) as [Cheque],\r\n"
				+ "ISNULL(PaymentsCount.DD,0) as [DD], \r\n"
				+ "ISNULL(PaymentsCount.RTGS,0) as [RTGS],\r\n"
				+ "ISNULL(PaymentsCount.WALLET,0) as [Wallet],\r\n"
				+ "ISNULL(PaymentsCount.[EMPLOYEE LOAN], 0) as [Employee],\r\n"
				+ "ISNULL(PaymentsCount.ENCIRCLE,0) as [Encircle],\r\n"
				+ "ISNULL(PaymentsCount.[GIFT VOUCHER],0) as [GV],\r\n"
				+ "ISNULL(PaymentsCount.[RO PAYMENT],0) as [RO],\r\n"
				+ "ISNULL(PaymentsCount.[AMAZON PAY],0) as [Amazon Pay],\r\n"
				+ "ISNULL(PaymentsCount.[DIGI GOLD TANISHQ],0) as [Digi Gold Tanishq],\r\n"
				+ "ISNULL(PaymentsCount.CASHBACK,0) as [CASHBACK],\r\n"
				+ "ISNULL(PaymentsCount.[CREDIT NOTE],0) as [CN],\r\n"
				+ "ISNULL(CreditNoteInstrumentTypes.GEP,0) as [GEP],\r\n"
				+ "ISNULL(CreditNoteInstrumentTypes.GHS,0) as [GHS],\r\n"
				+ "ISNULL(CreditNoteInstrumentTypes.GRN,0) as [GRN], \r\n"
				+ "ISNULL(CreditNoteInstrumentTypes.TEP,0) as [TEP],\r\n"
				+ "ISNULL(CreditNoteInstrumentTypes.ADV,0) as [Advance], \r\n"
				+ "ISNULL(CreditNoteInstrumentTypes.BILL_CANCELLATION,0) as [Billcancellation],\r\n"
				+ "ISNULL(CreditNoteInstrumentTypes.CN_IBT,0) as [CNIntBTQ],\r\n"
				+ "cm.paid_value as [Amount],\r\n"
				+ "case when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) between '00:00:00' AND '00:03:30' THEN 'Within 3mins' \r\n"
				+ "when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) BETWEEN '00:03:31' AND '00:05:30' THEN '3 to 5mins'\r\n"
				+ "when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) BETWEEN '00:05:31' AND '00:10:30' THEN '5 to 10mins'\r\n"
				+ "when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) between '00:10:31' AND '00:15:30' THEN '10 to 15mins'\r\n"
				+ "when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) between '00:15:31' AND '00:20:30' THEN '15 to 20mins'\r\n"
				+ "when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) between '00:20:31'	AND '00:30:30' THEN '20 to 30mins'\r\n"
				+ "when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) between '00:30:31' AND '00:45:30' THEN '30 to 45mins'\r\n"
				+ "when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) BETWEEN '00:45:31' AND '01:00:30' THEN '45 to 60mins'\r\n"
				+ "when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) BETWEEN '01:00:31' AND '01:30:30' THEN '60 to 90mins'\r\n"
				+ "when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) > '01:30:31' then 'More than 90mins'\r\n"
				+ "when CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0)) is null   then NULL   when     CAST((CONVERT(DATETIME,st.confirmed_time)-CONVERT(DATETIME,st.last_hold_time)) as time(0))  < '00:00:00'  then   null \r\n"
				+ "else NULL  end [Timegroup],\r\n"
				+ "CASE WHEN PaymentsCount.CARD >= 4 then 'Type D'\r\n"
				+ "	 WHEN PaymentsCount.[DIGI GOLD NON TANISHQ]>=1 OR PaymentsCount.[DIGI GOLD TANISHQ]>=1 then 'Type D'\r\n"
				+ "	 WHEN PaymentsCount.[CREDIT NOTE]>=3 THEN 'Type D' \r\n"
				+ "	 WHEN PaymentsCount.[CREDIT NOTE]<=2 AND (CreditNoteInstrumentTypes.GRN>=1 OR CreditNoteInstrumentTypes.CN_IBT>=1 OR CreditNoteInstrumentTypes.BILL_CANCELLATION>=1) THEN 'Type D'\r\n"
				+ "	 WHEN cm.total_quantity >=5 THEN 'Type D'\r\n"
				+ "	 WHEN PaymentsCount.CHEQUE>0 THEN 'Type D'\r\n"
				+ "	 WHEN PaymentsCount.DD>0 THEN 'Type D'\r\n"
				+ "	 WHEN PaymentsCount.[RO PAYMENT]>0 THEN 'Type D'\r\n"
				+ "	 WHEN PaymentsCount.[EMPLOYEE LOAN]>0 THEN 'Type D'\r\n"
				+ "	 WHEN PaymentsCount.AIRPAY>0 THEN 'Type D'\r\n"
				+ "	 WHEN PaymentsCount.RTGS>0 THEN 'Type D'\r\n"
				+ "	 WHEN PaymentsCount.CASHBACK>0 THEN 'Type D'\r\n"
				+ "	 WHEN PaymentsCount.[CREDIT NOTE]=2 THEN 'Type C'\r\n"
				+ "	 WHEN cm.total_quantity=4 THEN 'Type C'\r\n"
				+ "	 WHEN PaymentsCount.[GIFT VOUCHER]>=5 THEN 'Type C'\r\n"
				+ "	 WHEN PaymentsCount.CARD=3 THEN 'Type C'\r\n"
				+ "	 WHEN PaymentsCount.WALLET>0 THEN 'Type C'\r\n"
				+ "	 WHEN cm.paid_value>200000 THEN 'Type B'\r\n"
				+ "	 WHEN PaymentsCount.CASH>=2 THEN 'Type B'\r\n"
				+ "	 WHEN PaymentsCount.CARD=2 THEN 'Type B'\r\n"
				+ "	 WHEN PaymentsCount.[CREDIT NOTE]=1 THEN 'Type B'\r\n"
				+ "	 WHEN PaymentsCount.[GHS EVOUCHER] IN (3,4) THEN 'Type B'\r\n"
				+ "	 WHEN cm.total_quantity>=2 THEN 'Type B'\r\n"
				+ "else 'Type A' END as [Type of Billing],\r\n"
				+ "\r\n"
				+ "case when convert(char(10),st.confirmed_time,108) between '00:00' and '13:00' then 'Morning' \r\n"
				+ "	when convert(char(10),st.confirmed_time,108) between '13:00' and '17:00' then 'Afternoon'\r\n"
				+ "	when convert(char(10),st.confirmed_time,108) between '17:00' and '23:59' then 'Evening' end  [TypeofInvoice],\r\n"
				+ "CAST(DATEDIFF(minute,st.last_hold_time,st.confirmed_time)+((CAST(DATEDIFF(second,st.last_hold_time,st.confirmed_time)%60 as float)/60)*100)/100 as decimal(10,2)) as [Holding to Sale],\r\n"
				+ "CAST(DATEDIFF(minute,st.last_invoke_time,st.confirmed_time)+((CAST(DATEDIFF(second,st.last_invoke_time,st.confirmed_time)%60 as float)/60)*100)/100 as decimal(10,2)) as [Invoke to Sale],\r\n"
				+ "CAST(DATEDIFF(minute,st.last_hold_time,st.last_invoke_time)+((CAST(DATEDIFF(second,st.last_hold_time,st.last_invoke_time)%60 as float)/60)*100)/100 as decimal(10,2)) as [Holding to Invoke],\r\n"
				+ "CFA.CFACodes as [CFACode], \r\n"
				+ "pt.pricing_type as [Description],\r\n"
				+ "pc.description as [productcategory],\r\n"
				+ "bmv.sub_brand_code as [Brand Name],\r\n"
				+ "CASE WHEN pt.product_group_code IN ('1','2','4','5','7','81','82','99','A1','A2','A6','A8','B4','Ganesha','GP','GV','LAMP','NE','VA') THEN\r\n"
				+ "'Secondary'\r\n"
				+ "ELSE 'Primary' END as[CFA Type]\r\n"
				+ "from sales_transaction st\r\n"
				+ "inner join boutique_master_view bmv on bmv.location_code=st.location_code\r\n"
				+ "left outer join customer_transaction ct on ct.id=st.id\r\n"
				+ "left outer join employee_master em on em.employee_code=st.employee_code\r\n"
				+ "inner join cash_memo cm on cm.id=st.id\r\n"
				+ "outer apply(\r\n"
				+ "select top 1 cmd.product_group_code, cmd.product_category_code from cash_memo_details cmd where cmd.cash_memo_id=cm.id order by final_value desc\r\n"
				+ ") pgcpc\r\n"
				+ "outer apply(\r\n"
				+ "select product_group_code, pricing_type from product_group_master pgm where pgm.product_group_code=pgcpc.product_group_code\r\n"
				+ ") pt\r\n"
				+ "outer apply(\r\n"
				+ "select description from product_category_master pcm where pcm.product_category_code=pgcpc.product_category_code\r\n"
				+ ") pc \r\n"
				+ "left outer join(\r\n"
				+ "SELECT distinct cmd1.cash_memo_id, STUFF((SELECT ',' +  a.product_group_code from(\r\n"
				+ " select distinct cash_memo_id,product_group_code from reports.dbo.cash_memo_details) a  where a.cash_memo_id=cmd1.cash_memo_id\r\n"
				+ " FOR XML PATH('')), 1, 1, '') AS CFACodes\r\n"
				+ " from reports.dbo.cash_memo_details cmd1 \r\n"
				+ " ) CFA on CFA.cash_memo_id=st.id\r\n"
				+ "left outer join \r\n"
				+ "(\r\n"
				+ "		SELECT * FROM(\r\n"
				+ "		SELECT [sales_txn_id], [payment_code],[amount] from payment_details\r\n"
				+ "		where status='COMPLETED'\r\n"
				+ "		) Payments\r\n"
				+ "		PIVOT\r\n"
				+ "		(\r\n"
				+ "		COUNT([amount])\r\n"
				+ "		FOR [payment_code]\r\n"
				+ "		IN\r\n"
				+ "		(\r\n"
				+ "			[AIRPAY],\r\n"
				+ "			[AMAZON],\r\n"
				+ "			[AMAZON PAY],\r\n"
				+ "			[AMAZONPAY],\r\n"
				+ "			[Bajaj Finance],\r\n"
				+ "			[BANK_LOAN],\r\n"
				+ "			[BankLoan Test],\r\n"
				+ "			[CARD],\r\n"
				+ "			[CASH],\r\n"
				+ "			[CASHBACK],\r\n"
				+ "			[CHEQUE],\r\n"
				+ "			[CREDIT NOTE],\r\n"
				+ "			[DD],\r\n"
				+ "			[DIGI GOLD NON TANISHQ],\r\n"
				+ "			[DIGI GOLD TANISHQ],\r\n"
				+ "			[EMPLOYEE LOAN],\r\n"
				+ "			[ENCIRCLE],\r\n"
				+ "			[G PAY],\r\n"
				+ "			[GHS ACCOUNT],\r\n"
				+ "			[GHS EVOUCHER],\r\n"
				+ "			[GIFT VOUCHER],\r\n"
				+ "			[GPAY],\r\n"
				+ "			[PAYTM],\r\n"
				+ "			[PAytmmmmm],\r\n"
				+ "			[PHONEPAY],\r\n"
				+ "			[PHONEPE],\r\n"
				+ "			[QCGC],\r\n"
				+ "			[RAZOR PAY],\r\n"
				+ "			[RO PAYMENT],\r\n"
				+ "			[ROPAYMENT],\r\n"
				+ "			[RTGS],\r\n"
				+ "			[UNIPAY],\r\n"
				+ "			[UTI Finance],\r\n"
				+ "			[WALLET]\r\n"
				+ "		)\r\n"
				+ "		)  AS PivotTable\r\n"
				+ ") PaymentsCount on PaymentsCount.sales_txn_id=st.id\r\n"
				+ "left outer join(\r\n"
				+ "	Select * from(\r\n"
				+ "	select pd.sales_txn_id as [SaleID], pd.payment_code [pCode], cn.credit_note_type [cnCode],pd.amount [pAmount] from payment_details pd\r\n"
				+ "	inner join credit_note cn on  pd.reference_3=cn.id and cn.credit_note_type=pd.instrument_type and pd.payment_code='CREDIT NOTE' and pd.status='COMPLETED'\r\n"
				+ "	) CreditNoteInstrumentTypes\r\n"
				+ "	PIVOT\r\n"
				+ "	(\r\n"
				+ "		COUNT([pAmount])\r\n"
				+ "		FOR [cnCode]\r\n"
				+ "		IN\r\n"
				+ "		(\r\n"
				+ "			[GHS],\r\n"
				+ "			[DIGI_GOLD_NON_TANISHQ],\r\n"
				+ "			[GRN],\r\n"
				+ "			[BILL_CANCELLATION],\r\n"
				+ "			[TEP],\r\n"
				+ "			[CN_IBT],\r\n"
				+ "			[DIGI_GOLD_TANISHQ],\r\n"
				+ "			[TCS_CREDIT_NOTE],\r\n"
				+ "			[EVOUCHER],\r\n"
				+ "			[GEP],\r\n"
				+ "			[ADV]\r\n"
				+ "		)\r\n"
				+ "	) as PIVOTTABLE\r\n"
				+ ") CreditNoteInstrumentTypes on CreditNoteInstrumentTypes.SaleID=st.id\r\n"
				+ "where st.txn_type='CM' and st.status='CONFIRMED'";
		
		String s= select+""+ appendWhereClause;
		System.out.println(s);
		
		return  String.format("%s%s", select, appendWhereClause);
		
		
		
	}

	@Override
	protected StringBuilder appendQuery(ReportRequestDto reportRequestDto) {
		
		
		BillingTimeRequestDto billingTimeRequestDto= (BillingTimeRequestDto) reportRequestDto;
		StringBuilder query=new StringBuilder();
		
		if (!(StringUtils.isEmpty(billingTimeRequestDto.getFromDate())
				&& StringUtils.isEmpty(billingTimeRequestDto.getToDate()))) {
			String fromDate = CalendarUtils.formatDateToSql(billingTimeRequestDto.getFromDate());
			String toDate = CalendarUtils.formatDateToSql(billingTimeRequestDto.getToDate());
			query.append(" AND (st.doc_date BETWEEN '" + fromDate + "'  AND '" + toDate
					+ "')");
		}
		
		validateLocationFields(billingTimeRequestDto, query);
		if (billingTimeRequestDto.getBillingTimeCustomRequestDto() != null) {
			validateCustomInputAndAppend(billingTimeRequestDto, query);
		}
		
		query.append(" order by st.location_code, st.doc_date, st.doc_no");	
		return query;
	}

	protected StringBuilder validateCustomInputAndAppend(BillingTimeRequestDto billingTimeRequestDto, StringBuilder query) {
	
		return query;
	}

	private StringBuilder validateLocationFields(BillingTimeRequestDto billingTimeRequestDto, StringBuilder query) {
		
		
		if (billingTimeRequestDto.getSubRegionCode() != null && !billingTimeRequestDto.getSubRegionCode().isEmpty()) {
			query.append(" AND bmv.region_code in (" + formatListToInClause(billingTimeRequestDto.getSubRegionCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(billingTimeRequestDto.getStateId())) {
			query.append(" AND bmv.state_id='" + billingTimeRequestDto.getStateId()).append("'");
		}
		if (billingTimeRequestDto.getTownId() != null && !billingTimeRequestDto.getTownId().isEmpty()) {
			query.append(" AND bmv.town_id in (" + formatListToInClause(billingTimeRequestDto.getTownId())).append(")");
		}
		if (billingTimeRequestDto.getLocationCode() != null && !billingTimeRequestDto.getLocationCode().isEmpty()) {
			query.append(" AND bmv.location_code in (" + formatListToInClause(billingTimeRequestDto.getLocationCode()))
					.append(")");
		}
		if (!StringUtils.isEmpty(billingTimeRequestDto.getCountryId())) {
			query.append(" AND bmv.country_code='" + billingTimeRequestDto.getCountryId()).append("'");
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
		
		BillingTimeRequestDto billingTimeRequestDto = (BillingTimeRequestDto) MapperUtil
				.getDtoMapping(reportRequestDto, BillingTimeRequestDto.class);
		if (!StringUtil.isBlankJsonData(reportRequestDto.getCustomFields())) {
			BillingTimeCustomRequestDto billingTimeCustomRequestDto = new BillingTimeCustomRequestDto();
			billingTimeCustomRequestDto.validate(reportRequestDto.getCustomFields());
			billingTimeCustomRequestDto = MapperUtil.getObjectMapperInstance()
					.convertValue(reportRequestDto.getCustomFields().getData(), BillingTimeCustomRequestDto.class);
			billingTimeRequestDto.setBillingTimeCustomRequestDto(billingTimeCustomRequestDto);
		}
		
		return billingTimeRequestDto;
	}
	
	

}
