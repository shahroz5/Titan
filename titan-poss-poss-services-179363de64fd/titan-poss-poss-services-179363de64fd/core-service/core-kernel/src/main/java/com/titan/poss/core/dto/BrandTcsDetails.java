package com.titan.poss.core.dto;


import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class BrandTcsDetails  extends BaseFieldsValidator{

	private TcsB2C b2c;
	private TcsB2B b2b;
	
	
}
