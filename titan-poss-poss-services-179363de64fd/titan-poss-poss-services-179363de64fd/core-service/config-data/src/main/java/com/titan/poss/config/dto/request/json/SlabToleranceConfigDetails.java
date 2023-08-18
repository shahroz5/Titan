/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;
import com.titan.poss.core.domain.validator.SlabValidator;
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
public class SlabToleranceConfigDetails extends BaseFieldsValidator {

	// cannot use inheritance even though same fields in both class as Reflection
	// doesn't support
	private List<WeightBasedTolerance> weightBased;

	private List<ValueBasedTolerance> valueBased;

	@Override
	public void validate(Object object) {
		super.validate(object);

		ObjectMapper mapper = new ObjectMapper();
		List<WeightBasedTolerance> weightList = new ArrayList<>();
		List<ValueBasedTolerance> valueList = new ArrayList<>();
		try {

			JsonNode node = MapperUtil.getObjectMapperInstance().convertValue(object, JsonNode.class);
			for (int i = 0; i < node.get("weightBased").size(); i++) {

				WeightBasedTolerance weightData = mapper.treeToValue(node.get("weightBased").get(i),
						WeightBasedTolerance.class);
				weightList.add(weightData);

			}
			for (int i = 0; i < node.get("valueBased").size(); i++) {

				ValueBasedTolerance valueData = mapper.treeToValue(node.get("valueBased").get(i),
						ValueBasedTolerance.class);
				valueList.add(valueData);

			}
		} catch (JsonProcessingException e) {
			throw new ServiceException("Error while parsing JsonData", "ERR-CORE-003");
		}

		SlabValidator.createAndValidateSlabObject(weightList, WeightBasedTolerance.class, "fromRange", "toRange",
				"rowId");
		SlabValidator.createAndValidateSlabObject(valueList, ValueBasedTolerance.class, "fromRange", "toRange",
				"rowId");

	}
}
