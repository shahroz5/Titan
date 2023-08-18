/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.domain.validator;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.CONSTRUCTOR;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE_USE;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.springframework.util.StringUtils;

/**
 * Validates if RequestBody has SQL commands
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = SqlInjectionCheck.SqlInjectionValidator.class)
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RetentionPolicy.RUNTIME)
public @interface SqlInjectionCheck {

	String message() default "Request Body cannot have SQL Commands";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class SqlInjectionValidator implements ConstraintValidator<SqlInjectionCheck, String> {

		private static final String SQL_KEYWORDS = "TABLE, TABLESPACE, PROCEDURE, FUNCTION, TRIGGER, KEY, VIEW, MATERIALIZED VIEW, LIBRARY"
				+ "SEQUENCE, RESTORE POINT, PFILE, CLASS, CURSOR, OBJECT, RULE, USER, DATASET, DATASTORE, "
				+ "CLUSTER, COMMENT, SYNONYM, TYPE, JAVA, SESSION, ROLE, PACKAGE, PACKAGE BODY, OPERATOR"
				+ " INDEX, CONSTRAINT, TRIGGER, USER, SCHEMA, DATABASE, PLUGGABLE DATABASE, BUCKET, "
				+ "COLUMN, FIELD, OPERATOR,DATABASE, LINK, DBLINK";

		private static final String COMMON_REGEX = ")(\\b)+\\s.*(.*)";

		private static final String[] SQL_REG_EX = { "(?i)(.*)(\\b)+SELECT(\\b)+\\s.*(\\b)+FROM(\\b)+\\s.*(.*)",
				"(?i)(.*)(\\b)+SAVEPOINT(\\b)+\\s.*(.*)", "(?i)(.*)(\\b)+CALL(\\b)+\\s.*(.*)",
				"(?i)(.*)(\\b)+DELETE(\\b)+\\s.*(\\b)+FROM(\\b)+\\s.*(.*)", "(?i)(.*)(\\b)+UPSERT(\\b)+\\s.*(.*)",
				"(?i)(.*)(\\b)+DROP(\\b)+\\s.*(.*)",
				"(?i)(.*)(\\b)+INSERT(\\b)+\\s.*(\\b)+INTO(\\b)+\\s.*(.*)", "(?i)(.*)(\\b)+UPDATE(\\b)+\\s.*(.*)",
				"(?i)(.*)(\\b)+ROLLBACK(\\b)+\\s.*(.*)", "(?i)(.*)(\\b)+KILL(\\b)+\\s.*(.*)",
				"(?i)(.*)(\\b)+DESC(\\b)+(\\w)*\\s.*(.*)", "(?i)(.*)(\\b)+DESCRIBE(\\b)+(\\w)*\\s.*(.*)",
				"(?i)(.*)(\\b)+CREATE(\\b)+(\\s)*(" + SQL_KEYWORDS.replaceAll(",", "|") + COMMON_REGEX,
				"(?i)(.*)(\\b)+ALTER(\\b)+(\\s)*(" + SQL_KEYWORDS.replaceAll(",", "|") + COMMON_REGEX,
				"(?i)(.*)(\\b)+TRUNCATE(\\b)+(\\s)*(" + SQL_KEYWORDS.replaceAll(",", "|") + COMMON_REGEX,
				"(?i)(.*)(\\b)+LOCK(\\b)+(\\s)*(" + SQL_KEYWORDS.replaceAll(",", "|") + COMMON_REGEX,
				"(?i)(.*)(\\b)+UNLOCK(\\b)+(\\s)*(" + SQL_KEYWORDS.replaceAll(",", "|") + COMMON_REGEX,
				"(?i)(.*)(\\b)+RELEASE(\\b)+(\\s)*(" + SQL_KEYWORDS.replaceAll(",", "|") + COMMON_REGEX,
		         "(.*)(-){2,}(.*)",
		         "(.*)(/\\*|\\*/|;){1,}(.*)"};

		@Override
		public boolean isValid(String value, ConstraintValidatorContext context) {

			Boolean isValid = true;
			if (!StringUtils.isEmpty(value)) {
				isValid = checkString(value);
			}

			return isValid;
		}

		private Boolean checkString(String value) {
			Boolean isValid = sqlInjectionCheck(value);
			if (!isValid) {
				return false;
			}
			return isValid;
		}

		private List<Pattern> validatePatterns = getValidationPatterns();

		private List<Pattern> getValidationPatterns() {
			List<Pattern> patterns = new ArrayList<>();
			for (String sqlExpres : SQL_REG_EX) {
				patterns.add(Pattern.compile(sqlExpres, Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE));
			}
			return patterns;
		}

		private boolean matches(Pattern pattern, String value) {
			Matcher matcher = pattern.matcher(value);
			return matcher.matches();
		}

		private boolean sqlInjectionCheck(String value) {

			if (StringUtils.isEmpty(value)) {
				return true;
			}
			for (Pattern pattern : validatePatterns) {
				if (matches(pattern, value)) {
					return false;
				}
			}
			return true;
		}

	}
}
