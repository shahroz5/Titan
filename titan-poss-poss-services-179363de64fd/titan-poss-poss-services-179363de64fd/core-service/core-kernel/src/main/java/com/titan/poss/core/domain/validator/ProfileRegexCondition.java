/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.validator;

import java.util.regex.Pattern;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotatedTypeMetadata;
import org.springframework.util.MultiValueMap;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class ProfileRegexCondition implements Condition {

	@Override
	public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
		Environment env = context.getEnvironment();
		String[] profiles = env.getActiveProfiles();
		MultiValueMap<String, Object> attrs = metadata.getAllAnnotationAttributes(ProfileRegex.class.getName());
		if (attrs != null) {
			for (Object value : attrs.get("value")) {
				for (String profile : profiles) {
					boolean matches = Pattern.matches((String) value, profile);
					if (matches) {
						return true;
					}
				}
			}
			return false;
		}
		return true;
	}

}
