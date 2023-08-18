package com.titan.poss.user.dto.request;

import java.util.Set;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class EmployeeLocationUpdateDto {

	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> updateLocations;

	private Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> removeLocations;

}
