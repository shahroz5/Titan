package com.titan.poss.core.dto;

import java.io.Serializable;
import java.util.Date;

import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TcsDetails extends BaseFieldsValidator implements Serializable {
	private static final long serialVersionUID = 1L;
	private Boolean isTcsApplicable;
	private String locationPanNumber;
	private Boolean isApplicableLocations;
	private Date tcsStartDate;
	private Date tcsApplicableDate;
}
