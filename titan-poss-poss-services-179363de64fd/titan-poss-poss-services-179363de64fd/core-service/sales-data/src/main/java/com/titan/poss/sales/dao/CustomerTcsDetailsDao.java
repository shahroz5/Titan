package com.titan.poss.sales.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity(name = "CustomerTcsDetails")
@Table(name = "customer_tcs_details")
@EqualsAndHashCode(callSuper = false)
public class CustomerTcsDetailsDao extends SyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sales_txn_id", referencedColumnName = "id")
	private SalesTxnDao salesTxnDao;

	@Column(name = "brand_code")
	private String brandCode; 

	@Column(name = "owner_type")
	private String ownerType;

	@Column(name = "location_code")
	private String locationCode;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_master_id", referencedColumnName = "id")
	private CustomerDao customer;

	@Column(name = "mobile_no")
	private String mobileNumber;

	@Column(name = "ulp_id")
	private String ulpId;
	
	@Column(name = "store_pan")
	private String storePan;
	
	@Column(name = "doc_no")
	private Integer docNo;
	
	@Column(name = "fiscal_year")
	private Short fiscalYear;
	
	@Column(name = "transaction_date")
	private Date transactionDate;

	@Column(name = "tcs_eligible_amount")
	private BigDecimal tcsEligibleAmount;
	
	@Column(name = "tcs_applicable_amount")
	private BigDecimal tcsApplicableAmount;
	
	@Column(name = "tcs_percentage")
	private BigDecimal tcsPercentage;
	
	@Column(name = "tcs_amount_paid")
	private BigDecimal tcsAmountPaid;
	
	@Column(name = "net_invoice_amount")
	private BigDecimal netInvoiceAmount;
	
	@PrePersist
	private void onPrePersist2() {
	
		if(this.tcsApplicableAmount == null) {
			this.tcsApplicableAmount =  BigDecimal.ZERO;
		}
		if(this.tcsEligibleAmount == null) {
			this.tcsEligibleAmount =  BigDecimal.ZERO;
		}
		if(this.tcsPercentage == null) {
			this.tcsPercentage =  BigDecimal.ZERO;
		}
		if(this.tcsAmountPaid == null) {
			this.tcsAmountPaid =  BigDecimal.ZERO;
		}
		if(this.netInvoiceAmount == null) {
			this.netInvoiceAmount =  BigDecimal.ZERO;
		}

	}

}
