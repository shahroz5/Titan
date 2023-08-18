package com.titan.poss.payment.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.payment.base.PayerLocationMappingBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@Entity
@Table(name = "payer_bank_location_mapping")
@EqualsAndHashCode(callSuper = false)
public class PayerLocationMappingDaoExt extends PayerLocationMappingBaseDao{

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier", updatable = false)
	private String id;

	@ManyToOne
	@JoinColumn(name = "config_id", referencedColumnName = "id")
	private PayerConfigDaoExt payerBankConfig;
}
