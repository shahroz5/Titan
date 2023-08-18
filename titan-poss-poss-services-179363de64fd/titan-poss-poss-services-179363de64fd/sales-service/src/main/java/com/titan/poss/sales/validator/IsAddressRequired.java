/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.validation.Constraint;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.Payload;

import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.enums.CustomerTypeEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.sales.dto.AddressDetails;
import com.titan.poss.sales.dto.request.CustomerAddDto;
import com.titan.poss.sales.dto.request.CustomerUpdateDto;

/**
 * Validates if address is required for the given customerType.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Documented
@Constraint(validatedBy = IsAddressRequired.VerifyAddress.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface IsAddressRequired {

	String message()

	default "Valid address is required. Not empty, max 4 lines, first two mandatory";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};

	public class VerifyAddress implements ConstraintValidator<IsAddressRequired, Object> {

		private boolean checkAddressDetails(AddressDetails addressDetails) {
			return (CollectionUtils.isEmpty(addressDetails.getAddressLines())
					|| addressDetails.getAddressLines().size() > 4
					|| StringUtils.isEmpty(addressDetails.getAddressLines().get(0))
					|| StringUtils.isEmpty(addressDetails.getAddressLines().get(1)));
		}

		@Override
		public boolean isValid(Object object, ConstraintValidatorContext context) {

			Boolean isValid = true;

			if (CustomerAddDto.class.isAssignableFrom(object.getClass())) {

				isValid = createCustomerCheck(object, context, isValid);

			} else if (CustomerUpdateDto.class.isAssignableFrom(object.getClass())) {

				isValid = updateCustomerCheck(object, context, isValid);
			}

			return isValid;
		}

		private Boolean updateCustomerCheck(Object object, ConstraintValidatorContext context, Boolean isValid) {

			CustomerUpdateDto updateCustomerDto = (CustomerUpdateDto) object;

			if (StringUtil.isBlankJsonData(updateCustomerDto.getCustomerDetails()))
				return true;

			AddressDetails addressDetails = mapToAddressDetails(updateCustomerDto.getCustomerDetails().getData());

			if (addressDetails.getAddressLines() == null)
				return true;

			if (checkAddressDetails(addressDetails)) {

				isValid = false;

			}
			isValid = addressDetailCheckBasedOnType(context, isValid, addressDetails,
					updateCustomerDto.getCustomerDetails().getType());

			return isValid;
		}

		private Boolean createCustomerCheck(Object object, ConstraintValidatorContext context, Boolean isValid) {
			CustomerAddDto addCustomerDto = (CustomerAddDto) object;

			if (StringUtil.isBlankJsonData(addCustomerDto.getCustomerDetails()))
				return false;

			AddressDetails addressDetails = mapToAddressDetails(addCustomerDto.getCustomerDetails().getData());

			Set<String> fieldsFailure = new HashSet<>();

			// 1st check
			if (checkAddressDetails(addressDetails)) {

				isValid = false;

			} else {
				// 2nd check
				if (pinCodeCheck(addCustomerDto.getCustomerType(), addressDetails.getPincode()))
					fieldsFailure.add("pincode");
				if (zoneCheck(addCustomerDto.getCustomerType(), addressDetails.getZone()))
					fieldsFailure.add("zone");
				fieldsFailure.addAll(cityStateCountryCatchmentCheck(addCustomerDto.getCustomerType(), addressDetails));

				if (!fieldsFailure.isEmpty()) {

					context.disableDefaultConstraintViolation();
					context.buildConstraintViolationWithTemplate(
							"some address fields are mandatory for this customer type: "
									+ Arrays.toString(fieldsFailure.toArray()))
							.addConstraintViolation();

					isValid = false;
				} else {
					// 3rd check

					String customerTypeStr = addCustomerDto.getCustomerType();
					// to address min max check & mandatory check
					isValid = addressDetailCheckBasedOnType(context, isValid, addressDetails, customerTypeStr);
				}
			}
			return isValid;
		}

		private Boolean addressDetailCheckBasedOnType(ConstraintValidatorContext context, Boolean isValid,
				AddressDetails addressDetails, String customerTypeStr) {

			CustomerTypeEnum customerType = null;
			try {
				customerType = CustomerTypeEnum.valueOf(customerTypeStr);
			} catch (IllegalArgumentException e) {
				List<String> acceptedValues = Stream.of(CustomerTypeEnum.class.getEnumConstants()).map(Enum::name)
						.collect(Collectors.toList());

				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate("Customer Type is invalid. Allowed :- " + acceptedValues)
						.addConstraintViolation();
				return false;
			}

			String remarks = null;
			if (customerType == CustomerTypeEnum.REGULAR) {
				if (addressDetails.getAddressLines().size() < 2)
					remarks = "Minimum no of address lines for this customer type is 2";
			} else if (addressDetails.getAddressLines().size() > 3) {
				remarks = "Maximum no of address lines for this customer type is 3";
			}

			if (!StringUtils.isEmpty(remarks))

			{
				context.disableDefaultConstraintViolation();
				context.buildConstraintViolationWithTemplate(remarks).addConstraintViolation();
				isValid = false;

			}
			return isValid;
		}

		private AddressDetails mapToAddressDetails(Object obj) {
			return MapperUtil.getObjectMapperInstance().convertValue(obj, AddressDetails.class);
		}

		/**
		 * @param customerType
		 * @param addressDetails
		 */
		private Set<String> cityStateCountryCatchmentCheck(String customerType, AddressDetails addressDetails) {

			Set<String> fieldsFailure = new HashSet<>();

			if (!CustomerTypeEnum.INTERNATIONAL.name().equals(customerType)) {
				if (StringUtils.isEmpty(addressDetails.getCity()))
					fieldsFailure.add("city");
				else if (StringUtils.isEmpty(addressDetails.getState()))
					fieldsFailure.add("state");
			}
			if (!CustomerTypeEnum.ONETIME.name().equals(customerType)
					&& StringUtils.isEmpty(addressDetails.getCountry())) {
				fieldsFailure.add("country");
			}

			return fieldsFailure;

		}

		private boolean pinCodeCheck(String customerType, String pincode) {
			return StringUtils.isEmpty(pincode) && (CustomerTypeEnum.REGULAR.name().equals(customerType)
					|| CustomerTypeEnum.ONETIME.name().equals(customerType)
					|| CustomerTypeEnum.INSTITUTIONAL.name().equals(customerType));
		}

		private boolean zoneCheck(String customerType, String zone) {
			return ((CustomerTypeEnum.INSTITUTIONAL.name().equals(customerType)
					|| CustomerTypeEnum.REGULAR.name().equals(customerType)) && StringUtils.isEmpty(zone));
		}

	}

}
