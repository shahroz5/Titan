package com.titan.poss.sales.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.CustomerPaymentDaoExt;
import com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt;

@Repository("customerTcsDetailsRepositoryExt")
public interface CustomerTcsDetailsRepositoryExt  extends JpaRepository<CustomerTcsDetailsDaoExt, String> {
	
	
	@Query(value = "select (COALESCE(((select COALESCE(sum(pd.amount),0) from sales.dbo.customer_tcs_details tcs \r\n"
			+ " join sales.dbo.sales_transaction st on tcs.sales_txn_id = st.id \r\n"
			+ " join sales.dbo.payment_details pd on pd.sales_txn_id = st.id \r\n"
			+ " join sales.dbo.customer_transaction ct on ct.id = st.id \r\n"
			+ " where tcs.fiscal_year = :fiscalYear and (tcs.mobile_no = :mobileNumber OR ct.insti_tax_no = :instiTaxNo) \r\n"
			+ " and tcs.store_pan = :locationPanNumber \r\n"
			+ " and pd.status = 'COMPLETED' and tcs.owner_type in(:ownerTypeCode) and pd.is_tcs_payment = 0 \r\n"
			+ " and st.created_date >= :tcsApplicableDate and st.status = 'CONFIRMED' and ct.customer_type = :customerType\r\n"
			+ " and st.txn_type NOT IN ('AB','ADV','CO','GHS') \r\n"
			+ " and st.sub_txn_type NOT IN ('GIFT_SALE')) - \r\n"
			+ " (select COALESCE(sum(rt.total_value),0) from sales.dbo.refund_transaction rt \r\n"
			+ " join sales.dbo.sales_transaction st on st.id = rt.ref_sales_id \r\n"
			+ " join sales.dbo.customer_tcs_details tcs on tcs.sales_txn_id = st.id \r\n"
			+ " join sales.dbo.customer_transaction ct on ct.id = st.id \r\n"
			+ " where tcs.fiscal_year = :fiscalYear and (tcs.mobile_no = :mobileNumber OR ct.insti_tax_no = :instiTaxNo) \r\n"
			+ " and tcs.store_pan = :locationPanNumber and ct.customer_type = :customerType \r\n"
			+ " and tcs.owner_type in(:ownerTypeCode) and rt.txn_type = 'GRN')),0) ) \r\n", nativeQuery = true)
	// @formatter:on
	BigDecimal cmCummulativeTcsValue(@Param("mobileNumber") String mobileNumber, @Param("fiscalYear") Short fiscalYear,
			@Param("tcsApplicableDate") Date tcsApplicableDate, @Param("ownerTypeCode") List<String> ownerTypeCode,
			@Param("locationPanNumber") String locationPanNumber, @Param("instiTaxNo") String instiTaxNo,
			@Param("customerType") String customerType);

	@Query("SELECT distinct tcs \r\n" + " FROM com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt tcs \r\n"
			+ " LEFT JOIN com.titan.poss.sales.dao.PaymentDetailsDaoExt pd on tcs.salesTxnDao.id = pd.salesTxnDao.id \r\n"
			+ " JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt ct on tcs.salesTxnDao.id = ct.id \r\n"
			+ " WHERE tcs.fiscalYear = :fiscalYear and tcs.ownerType in(:ownerTypeCode) and tcs.storePan = :storePan \r\n"
			+ " AND ((:searchType = 'MOBILE_NO' AND tcs.mobileNumber = :searchValue) OR (:searchType = 'ULP_ID' AND tcs.ulpId = :searchValue) OR (:searchType = 'INSTITUTIONAL' AND ct.instiTaxNo = :searchValue)) \r\n"
			+ " AND pd.status = 'COMPLETED'and ct.customerType = :customerType \r\n"
			+ " AND tcs.salesTxnDao.txnType NOT IN ('AB','ADV','CO','GHS','GC') \r\n"
			+ " AND tcs.salesTxnDao.subTxnType NOT IN ('GIFT_SALE') order by tcs.createdDate asc \r\n")
	List<CustomerTcsDetailsDaoExt> retrieveAllTcsPreviousTransaction(@Param("searchType") String searchType,
			@Param("searchValue") String searchValue, @Param("fiscalYear") Short fiscalYear,
			@Param("ownerTypeCode") List<String> ownerTypeCode, @Param("storePan") String storePan,
			@Param("customerType") String customerType);

	CustomerTcsDetailsDaoExt findBySalesTxnDaoId(String salesTxnId);

	// @formatter:off
	@Query("SELECT cp \r\n" + " FROM com.titan.poss.sales.dao.CustomerPaymentDaoExt cp \r\n"
			+ " WHERE cp.paymentDetailsDao.salesTxnDao.fiscalYear = :fiscalYear  \r\n"
			+ " AND ((:searchType = 'MOBILE_NO' AND cp.customerIdentifier1 = :searchValue) OR (:searchType = 'ULP_ID' AND cp.customerIdentifier2 = :searchValue)) \r\n"
			+ " AND cp.cashAmount > 0 and cp.paymentDetailsDao.status = 'COMPLETED' \r\n"
			+ " AND cp.paymentDetailsDao.salesTxnDao.txnType NOT IN ('AB','ADV','CO','GHS') order by cp.createdDate asc \r\n")
	List<CustomerPaymentDaoExt> getAllPaymentDetailsByFiscalYearMobileOrUlpId(@Param("searchType") String searchType,
			@Param("searchValue") String searchValue, @Param("fiscalYear") Short fiscalYear);

	// @formatter:off
	@Query("SELECT cd \r\n" + " FROM com.titan.poss.sales.dao.CancelDaoExt cd \r\n"
			+ " join com.titan.poss.sales.dao.PaymentDetailsDaoExt pd ON pd.salesTxnDao.id = cd.refSalesTxn.id  \r\n"
			+ " join com.titan.poss.sales.dao.CustomerPaymentDaoExt cp ON cp.paymentDetailsDao.id = pd.id  \r\n"
			+ " WHERE cp.paymentDetailsDao.salesTxnDao.fiscalYear = :fiscalYear  \r\n"
			+ " AND cp.cashAmount > 0 and cp.paymentDetailsDao.status = 'COMPLETED' \r\n"
			+ " AND ((:searchType = 'MOBILE_NO' AND cp.customerIdentifier1 = :searchValue) OR (:searchType = 'ULP_ID' AND cp.customerIdentifier2 = :searchValue)) \r\n"
			+ " AND cp.paymentDetailsDao.salesTxnDao.txnType NOT IN ('AB','ADV','CO','GHS') \r\n")
	List<CancelDaoExt> getAllCancelledTransactionsByFiscalYearMobileOrUlpId(@Param("searchType") String searchType,
			@Param("searchValue") String searchValue, @Param("fiscalYear") Short fiscalYear);

	
	  @Query("SELECT tcs \r\n"+
	  " FROM com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt tcs \r\n" +
	  " LEFT JOIN com.titan.poss.sales.dao.PaymentDetailsDaoExt pd on tcs.salesTxnDao.id = pd.salesTxnDao.id \r\n" +
	  " JOIN com.titan.poss.sales.dao.CustomerTxnDaoExt ct on tcs.salesTxnDao.id = ct.id \r\n"
	  + " WHERE tcs.fiscalYear = :fiscalYear  and tcs.storePan = :btqPanCard \r\n"
	  + " AND  tcs.mobileNumber = :customerMobileNo \r\n" +
	  " AND pd.status = 'COMPLETED' \r\n" +
	  " AND tcs.salesTxnDao.txnType NOT IN ('AB','ADV','CO','GHS') \r\n"
	  )
	
	// @Query(value = "select * from customer_tcs_details where
	// mobile_no=:customerMobileNo and store_pan=:btqPanCardand
	// fiscal_year=:fiscalYear", nativeQuery = true)
	List<CustomerTcsDetailsDaoExt> retrieveTcsDetailsOfFiscalYear(@Param("customerMobileNo") String customerMobileNo,
			@Param("fiscalYear") Short fiscalYear, @Param("btqPanCard") String btqPanCard);


}
