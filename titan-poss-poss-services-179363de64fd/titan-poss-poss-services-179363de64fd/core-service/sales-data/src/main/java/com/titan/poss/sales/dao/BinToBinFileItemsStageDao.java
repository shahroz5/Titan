package com.titan.poss.sales.dao;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.core.dao.AuditableEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bintobin_file_items_stage")
@EqualsAndHashCode(callSuper = false)
public class BinToBinFileItemsStageDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(columnDefinition = "uniqueidentifier")
	private String id;
	
	@ManyToOne
	@JoinColumn(name = "bintobin_file_stage_id")
	private BinToBinFileStageDao binToBinFileStage;
	
	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "lot_number")
	private String lotNumber;
	
	@Column(name = "quantity")
	private Short quantity;
	
	@Column(name = "inventory_id", columnDefinition = "uniqueidentifier")
	private String inventoryId;
	
	@Column(name="item_status")
	private String itemStatus;
	
	@Column(name = "status")
	private String status;
}
