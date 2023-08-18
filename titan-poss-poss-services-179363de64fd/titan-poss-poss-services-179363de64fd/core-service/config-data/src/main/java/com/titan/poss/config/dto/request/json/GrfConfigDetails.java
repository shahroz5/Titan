/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import org.apache.commons.lang.BooleanUtils;

import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.MapperUtil;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class GrfConfigDetails extends SlabToleranceConfigDetails {

	private Boolean mergeAllowed;
	private Boolean currentOwner;
	private Boolean thirdPerson;

	@Override
	public void validate(Object object) {
		super.validate(object);

		GrfConfigDetails grfMergeData = MapperUtil.getObjectMapperInstance().convertValue(object,
				GrfConfigDetails.class);

		if (BooleanUtils.isTrue(grfMergeData.getMergeAllowed())
				&& (!Boolean.logicalOr(BooleanUtils.isTrue(grfMergeData.getCurrentOwner()),
						BooleanUtils.isTrue(grfMergeData.getThirdPerson())))) {
			throw new ServiceException(ConfigConstants.SELECT_ANY_OWNER_IF_MERGE_ALLOWED,
					ConfigConstants.ERR_CONFIG_020);
		}
	}
}
