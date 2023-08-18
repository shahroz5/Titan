package com.titan.poss.product.dao;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "studded_split_dtl")
@EqualsAndHashCode(callSuper = false)
public class StuddedSplitDetailsDao implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(columnDefinition = "uniqueidentifier")
    private String id;
	
	@Column(name = "detail")
	private String detail;
	
	@Column(name = "constant")
	private String constant;
	
	@Column(name = "location_code")
	private String locationCode;
	
	@Column(name = "fiscal_year")
	private Short fiscalYear;
	
	@Column(name = "serial_number")
	private Integer serialNumber;
	
	@Column(name = "current_date")
	private String currentDate;
	
	@Column(name = "line_item_number")
	private Integer lineItemNumber;
	
	@Column(name = "item_code")
	private String itemCode;
	
	@Column(name = "value", columnDefinition = "decimal")
	private BigDecimal value;
	
	@Column(name = "quantity")
	private Short quantity;
	
	@Column(name = "weight", columnDefinition = "decimal")
	private BigDecimal weight;
	
	@Column(name = "total_value", columnDefinition = "decimal")
	private BigDecimal totalValue;
	
	@Column(name = "constant_value1")
	private Integer constantValue1;
	
	@Column(name = "constant_value2")
	private Integer constantValue2;
	
	@Column(name = "constant_value3")
	private Integer constantValue3;
	
	@Column(name = "lot_number")
	private String lotNumber;
	
	@Column(name = "actual_f1", columnDefinition = "decimal")
	private BigDecimal actualF1;
	
	@Column(name = "diamond_weight", columnDefinition = "decimal")
	private BigDecimal diamondWeight;
	
	@Column(name = "other_stone_weight", columnDefinition = "decimal")
	private BigDecimal otherStoneWeight;
	
	@Column(name = "parent_line_item_number")
	private Integer parentLineItemNumber;
	
	@Column(name = "file_id", columnDefinition = "uniqueidentifier")
	private String fileId;
	
	@Column(name = "parent_item_code")
	private String parentItemCode;
	
	@Column(name = "making_charges", columnDefinition = "decimal")
	private BigDecimal makingCharges;

}
