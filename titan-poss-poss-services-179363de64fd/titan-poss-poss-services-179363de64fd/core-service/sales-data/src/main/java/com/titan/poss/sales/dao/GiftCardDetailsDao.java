package com.titan.poss.sales.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;


import com.titan.poss.core.dao.AuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "gift_card_details")
@EqualsAndHashCode(callSuper = false)
public class GiftCardDetailsDao extends AuditableEntity implements Serializable{


	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name ="card_number")
	private String cardNumber;
	
	@Column(name ="amount", columnDefinition = "DECIMAL")
	private BigDecimal amount;
	
	@Column(name ="card_type")
	private String cardType;
	
	@Column(name ="card_name")
	private String cardName;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name ="card_expiry_date" , length = 23)
	private Date cardExpiryDate;

	@Column(name ="approval_code")
	private String approvalCode;
	
	@Column(name ="transaction_id")
	private String transactionId;
	
	@Column(name="track_data")
	private String trackData;

}
