package com.titan.poss.payment.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.payment.base.CashbackOfferDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@Entity
@Table(name = "cashback_offer_details")
@EqualsAndHashCode(callSuper = false)
public class CashbackOfferDetailsDaoExt extends CashbackOfferDetailsBaseDao{

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cashback_id", referencedColumnName = "cashback_id")
	private CashbackDaoExt cashbackDao;
}
