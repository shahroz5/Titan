package com.titan.poss.product.dto.request.json;

import java.math.BigDecimal;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class HallmarkDetails extends BaseFieldsValidator{

	private Boolean isAllowedForHallmarking;

	private BigDecimal hallmarkingCharges;

	private Boolean isFOCForHallmarkingCharges;
	
	}
