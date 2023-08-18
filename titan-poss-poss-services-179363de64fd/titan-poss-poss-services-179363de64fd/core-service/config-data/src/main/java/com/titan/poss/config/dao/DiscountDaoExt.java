/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dao;

import com.titan.poss.config.base.DiscountBaseDao;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "discount_master")
@EqualsAndHashCode(callSuper = false)
public class DiscountDaoExt extends DiscountBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(name = "refer_other_discounts", referencedColumnName = "id")
//	@JsonBackReference("refer_other_discounts")
//	private DiscountDaoExt discountDao;
}
