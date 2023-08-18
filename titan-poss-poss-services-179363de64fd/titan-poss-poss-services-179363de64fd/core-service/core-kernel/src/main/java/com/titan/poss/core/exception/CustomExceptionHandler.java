/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.exception;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolationException;

import org.apache.commons.lang.StringUtils;
import org.apache.tomcat.util.http.fileupload.FileUploadBase;
import org.hibernate.exception.SQLGrammarException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.server.MethodNotAllowedException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CustomExceptionMessageUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.StringUtil;

import brave.Tracer;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

	private static final String TRACE_ID_IS = "Trace ID is  :  {}";

	private static final String ERR_CORE_023 = "ERR-CORE-023";

	private static final String SQL_ERROR_DETAILS = "SQL Error Details: \n{}";

	@Autowired
	private Tracer tracer;

	private static final Logger EXCEPTION_LOGGER = LoggerFactory.getLogger(CustomExceptionHandler.class);

	// data integrity violation related
	private static final Map<String, String> constraintCodeMap = new HashMap<>();

	static {

		constraintCodeMap.put("String or binary data would be truncated",
				"In DB, length is less than provided value for some column(s)");

		constraintCodeMap.put("Cannot insert the value NULL", "In DB, some column(s) are mandatory");

//		 unique key check fail
		constraintCodeMap.put("Violation of UNIQUE KEY constraint", "Violation of UNIQUE KEY constraint.");

		// unique index check fail
		constraintCodeMap.put("Cannot insert duplicate key row", "Violation of UNIQUE INDEX constraint");
	}

	private String getMessageFromThrowable(ServiceException e) {
		Throwable t = e.getCause();
		String message = null;
		if (t != null)
			message = t.getMessage();
		return message;
	}

	// get message description from error properties file if nothing is provided
	// from threw function
	private String getErrMessageFromProperty(String errCode, String errMessage, Map<String, String> dynamicValues) {

		String message = ApplicationPropertiesUtil.getProperty(errCode);

		if (StringUtils.isBlank(message)) {
			message = errMessage;
		}

		if (dynamicValues != null)
			for (Map.Entry<String, String> entry : dynamicValues.entrySet())
				message = message.replace("{" + entry.getKey() + "}", entry.getValue());

		return message.trim();

	}

	private ErrorResponse generateErrRespObject(String errorCode, String errorMessage, Object errorCause) {
		return new ErrorResponse(errorCode, getErrMessageFromProperty(errorCode, errorMessage, null),
				tracer.currentSpan().context().spanIdString(), errorCause);
	}

	/************************************************************************************************************
	 * // DTO VALIDATION ERROR STARTS HERE
	 ***********************************************************************************************************/
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {

		BindingResult ire = ex.getBindingResult();
		List<FieldErrorResource> fieldErrorResources = new ArrayList<>();
		Set<String> defaulterFieldNames = new HashSet<>();
		EXCEPTION_LOGGER.error("Field Error Details: \n{}", ire);
		List<FieldError> fieldErrors = ire.getFieldErrors();
		for (FieldError fieldError : fieldErrors) {
			FieldErrorResource fieldErrorResource = new FieldErrorResource();
			fieldErrorResource.setField(fieldError.getField());
			fieldErrorResource.setMessage(fieldError.getDefaultMessage());
			fieldErrorResource.setInputValue(fieldError.getRejectedValue());
			fieldErrorResources.add(fieldErrorResource);

			defaulterFieldNames.add(fieldErrorResource.getField());
		}
		if (fieldErrorResources.isEmpty() && !ire.getAllErrors().isEmpty()) {
			for (ObjectError oe : ire.getAllErrors()) {
				FieldErrorResource fieldErrorResource = new FieldErrorResource();
				fieldErrorResource.setField(oe.getObjectName());
				fieldErrorResource.setMessage(oe.getDefaultMessage());
				fieldErrorResources.add(fieldErrorResource);

				defaulterFieldNames.add(fieldErrorResource.getField());
			}
		}

		defaulterFieldNames = defaulterFieldNames.stream().map(StringUtil::changeCaseToReadableFormat)
				.collect(Collectors.toSet());
		FieldErrorResponse error = new FieldErrorResponse("ERR-CORE-001",
				getErrMessageFromProperty("ERR-CORE-001", "Request is not valid",
						Map.of("FIELD_NAMES", Arrays.toString(defaulterFieldNames.toArray()))),
				tracer.currentSpan().context().spanIdString(),
				Map.of("FIELD_NAMES", Arrays.toString(defaulterFieldNames.toArray())));
		if (EXCEPTION_LOGGER.isDebugEnabled()) {
			EXCEPTION_LOGGER.debug(TRACE_ID_IS, tracer.currentSpan().context().spanIdString());
		}
		error.setFieldErrors(fieldErrorResources);
		headers.setContentType(MediaType.APPLICATION_JSON);
		return throwError(ex, error, headers, HttpStatus.UNPROCESSABLE_ENTITY, request);

	}

	@ExceptionHandler({ RequestException.class })
	protected ResponseEntity<Object> handleInvalidRequest(RequestException e, WebRequest request) {
		RequestException ire = e;
		List<FieldErrorResource> fieldErrorResources = new ArrayList<>();
		EXCEPTION_LOGGER.error("Field Error Details: \n{}", e);
		List<FieldError> fieldErrors = ire.getErrors().getFieldErrors();
		for (FieldError fieldError : fieldErrors) {
			FieldErrorResource fieldErrorResource = new FieldErrorResource();
			fieldErrorResource.setField(fieldError.getField());
			fieldErrorResource.setMessage(fieldError.getDefaultMessage());
			fieldErrorResources.add(fieldErrorResource);
		}
		if (fieldErrorResources.isEmpty() && !ire.getErrors().getAllErrors().isEmpty()) {
			for (ObjectError oe : ire.getErrors().getAllErrors()) {
				FieldErrorResource fieldErrorResource = new FieldErrorResource();
				fieldErrorResource.setField(oe.getObjectName());
				fieldErrorResource.setMessage(oe.getDefaultMessage());
				fieldErrorResources.add(fieldErrorResource);
			}
		}
		FieldErrorResponse error = new FieldErrorResponse("InvalidRequest", ire.getMessage(),
				tracer.currentSpan().context().spanIdString(), null);
		if (EXCEPTION_LOGGER.isDebugEnabled()) {
			EXCEPTION_LOGGER.debug(TRACE_ID_IS, tracer.currentSpan().context().spanIdString());
		}
		error.setFieldErrors(fieldErrorResources);
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return throwError(e, error, headers, HttpStatus.UNPROCESSABLE_ENTITY, request);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	protected ResponseEntity<Object> handleConstraintViolationException(ConstraintViolationException ex,
			WebRequest request) {

		EXCEPTION_LOGGER.error("ConstraintViolationException Error Details: \n{}", ex);

		List<FieldErrorResource> fieldErrorsList = ex.getConstraintViolations().stream()
				.map(violation -> new FieldErrorResource(violation.getPropertyPath().toString(), violation.getMessage(),
						violation.getInvalidValue()))
				.collect(Collectors.toList());
		Set<String> defaulterFieldNames = fieldErrorsList.stream()
				.map(fer -> StringUtil.changeCaseToReadableFormat(fer.getField())).collect(Collectors.toSet());

		FieldErrorResponse error = new FieldErrorResponse("ERR-CORE-001",
				getErrMessageFromProperty("ERR-CORE-001", "Request is not valid",
						Map.of("FIELD_NAMES", Arrays.toString(defaulterFieldNames.toArray()))),
				tracer.currentSpan().context().spanIdString(),
				Map.of("FIELD_NAMES", Arrays.toString(defaulterFieldNames.toArray())));

		return throwError(ex, error, new HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY, request);
	}

	/************************************************************************************************************
	 * // DTO VALIDATION ERROR ENDS HERE
	 ***********************************************************************************************************/

	/************************************************************************************************************
	 * // AUTH ERROR STARTS HERE
	 ***********************************************************************************************************/

	@ExceptionHandler({ CredentialsExpiredException.class, AuthenticationCredentialsNotFoundException.class,
			BadCredentialsException.class, InsufficientAuthenticationException.class })
	public ResponseEntity<Object> processAuthenticationException(AuthenticationException ex, WebRequest request) {
		HttpHeaders responseHeaders = new HttpHeaders();
		String errorCode = StringUtils.EMPTY;
		// if refresh token expired or deactivated
		if (ex instanceof CredentialsExpiredException) {
			removeTokenFromHeader(responseHeaders);
			EXCEPTION_LOGGER.error("CredentialsExpired Exception Error Details: \n{}", ex);
			errorCode = "ERR-AUTH-019";
			// it throws error when token check b/w cookie & request header is required
		} else if (ex instanceof AuthenticationCredentialsNotFoundException) {
			removeTokenFromHeader(responseHeaders);
			EXCEPTION_LOGGER.error("Unauthorized Exception Error Details: \n{}", ex);
			errorCode = "ERR-AUTH-018";
			// session doesn't exist
		} else if (ex instanceof BadCredentialsException) {
			EXCEPTION_LOGGER.error("BadCredentials Exception Error Details: \n{}", ex);
			errorCode = "ERR-AUTH-017";
		} else if (ex instanceof InsufficientAuthenticationException) {
			removeTokenFromHeader(responseHeaders);
			EXCEPTION_LOGGER.error("Authentication Exception Error Details: \n{}", ex);
			errorCode = "ERR-AUTH-007";
			// if credentials provided is wrong
		}
		ErrorResponse error = generateErrRespObject(errorCode, ex.getMessage(), null);
		return throwError(ex, error, responseHeaders, HttpStatus.UNAUTHORIZED, request);
	}

	// remove authorization from header
	private void removeTokenFromHeader(HttpHeaders responseHeaders) {
		responseHeaders.add("Set-Cookie", "Authorization=null; HttpOnly; Path=/; max-age=0;");
		responseHeaders.add("Set-Cookie", "ref_tok=null; HttpOnly; Path=/; max-age=0;");
	}

	// when it fails in pre authorize check
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<Object> processAuthorizationExceptions(AccessDeniedException ex, WebRequest request) {
		EXCEPTION_LOGGER.error("AccessDenied Exception Error Details: \n{}", ex);

		String errorCode = "ERR-AUTH-016";
		ErrorResponse error = generateErrRespObject(errorCode, ex.getMessage(), null);
		return throwError(ex, error, new HttpHeaders(), HttpStatus.FORBIDDEN, request);
	}

	@ExceptionHandler({ JWTVerificationException.class })
	public ResponseEntity<Object> processJWTVerificationException(JWTVerificationException ex, WebRequest request) {
		HttpHeaders responseHeaders = new HttpHeaders();
		removeTokenFromHeader(responseHeaders);
		EXCEPTION_LOGGER.error("Authorized Exception Error Details: \n{}", ex);

		String errorCode = "ERR-AUTH-018";
		ErrorResponse error = generateErrRespObject(errorCode, ex.getMessage(), null);
		return throwError(ex, error, responseHeaders, HttpStatus.UNAUTHORIZED, request);
	}

	@ExceptionHandler(MethodNotAllowedException.class)
	public ResponseEntity<Object> handleMethodNotAllowedException(MethodNotAllowedException ex, WebRequest request) {
		EXCEPTION_LOGGER.error("Method not allowed Error Details: \n{}", ex);

		String errorCode = "ERR-CORE-024";
		ErrorResponse error = generateErrRespObject(errorCode, ex.getMessage(), null);
		return throwError(ex, error, new HttpHeaders(), HttpStatus.METHOD_NOT_ALLOWED, request);
	}

	/************************************************************************************************************
	 * // AUTH ERROR ENDS HERE
	 ***********************************************************************************************************/

	/************************************************************************************************************
	 * // SQL ERROR STARTS HERE
	 ***********************************************************************************************************/

	// when it fails at sql level like unique key violation, not null, field length
	// is more than limit etc
	// constraints violate, unique key, length etc
	// to recreate change column length to less than expected in DTO
	// debug point
	@ExceptionHandler(DataIntegrityViolationException.class)
	protected ResponseEntity<Object> handleDataIntegrityViolationException(DataIntegrityViolationException ex,
			WebRequest request) {
		EXCEPTION_LOGGER.error(SQL_ERROR_DETAILS, ex);
		String errorCause = "DataIntegrityViolationException";
		String rootMsg = ex.getMostSpecificCause().getMessage();
		ErrorResponse error;
		if (CommonUtil.isDev()) {
			error = generateErrRespObject("ERR-CORE-043", "Duplicate Data Insertion Error", rootMsg);
			return throwError(ex, error, new HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY, request);
		}

		if (rootMsg != null && (rootMsg.contains("Violation of UNIQUE KEY constraint")
				|| rootMsg.contains("Cannot insert duplicate key row in object"))) {
			errorCause = null;
			if (rootMsg.contains("The duplicate key value is")) {
				errorCause = rootMsg.substring(rootMsg.indexOf('(') + 1, rootMsg.indexOf(')'));
			}
			error = generateErrRespObject("ERR-CORE-043", "Duplicate Data Insertion Error", errorCause);

			return throwError(ex, error, new HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY, request);
		}

		if (rootMsg != null) {
			Optional<Map.Entry<String, String>> entry = constraintCodeMap.entrySet().stream()
					.filter(it -> rootMsg.contains(it.getKey())).findAny();
			if (entry.isPresent()) {
				errorCause = entry.get().getValue();
			} else {
				errorCause = CustomExceptionMessageUtil.getSQLGrammarMssg(rootMsg);
			}
		}

		error = generateErrRespObject("ERR-CORE-012", "Data Integrity Violation", errorCause);

		return throwError(ex, error, new HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY, request);
	}

	// query did not return a unique result
	@ExceptionHandler(IncorrectResultSizeDataAccessException.class)
	protected ResponseEntity<Object> handleIncorrectResultSizeDataAccessException(
			IncorrectResultSizeDataAccessException ex, WebRequest request) {
		EXCEPTION_LOGGER.error(SQL_ERROR_DETAILS, ex);
		ErrorResponse error = getDBMessageAndError(ex.getMostSpecificCause().getMessage());
		return throwError(ex, error, new HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY, request);
	}

	@ExceptionHandler(JpaSystemException.class)
	protected ResponseEntity<Object> handleJpaSystemException(JpaSystemException ex, WebRequest request) {
		EXCEPTION_LOGGER.error(SQL_ERROR_DETAILS, ex);
		ErrorResponse error = getDBMessageAndError(ex.getMostSpecificCause().getMessage());
		return throwError(ex, error, new HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY, request);
	}

	private ErrorResponse getDBMessageAndError(String message) {

		String errorCause = CustomExceptionMessageUtil.getSQLGrammarMssg(message);
		return generateErrRespObject("ERR-CORE-012", "Data Integrity Violation", errorCause);
	}

	// when native SQL query is not proper
	// to recreate change change native query to invalid query
	@ExceptionHandler(SQLGrammarException.class)
	protected ResponseEntity<Object> handleSQLGrammarException(SQLGrammarException ex, WebRequest request) {
		EXCEPTION_LOGGER.error("SQLGrammarException Error Details: \n{}", ex);
		ErrorResponse error = generateErrRespObject(ERR_CORE_023, null,
				CustomExceptionMessageUtil.getSQLGrammarMssg(ex.getMessage()));
		return throwError(ex, error, new HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY, request);

	}

	// for e.g, UUID entered is not valid UUID, SQL injection, column name mismatch
	// to recreate remove UUID regex for String in DTO
	@ExceptionHandler(InvalidDataAccessResourceUsageException.class)
	protected ResponseEntity<Object> handleInvalidDataAccessResourceUsageException(
			org.springframework.dao.InvalidDataAccessResourceUsageException ex, WebRequest request) {
		EXCEPTION_LOGGER.error("InvalidDataAccessResourceUsageException Error Details: \n{}", ex);
		ErrorResponse error = generateErrRespObject("ERR-CORE-012", null,
				CustomExceptionMessageUtil.getSQLGrammarMssg(ex.getMessage()));
		return throwError(ex, error, new HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY, request);
	}

	/************************************************************************************************************
	 * // SQL ERROR ENDS HERE
	 ***********************************************************************************************************/

	// Used to handle multipart exception when max size of a file being exceeded
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	protected ResponseEntity<Object> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ex,
			WebRequest request) {

		EXCEPTION_LOGGER.error("MaxUploadSizeExceededException Error Details: \n{}", ex);

		FileUploadBase.SizeLimitExceededException exception = ((FileUploadBase.SizeLimitExceededException) (ex
				.getCause().getCause()));
		double actualSizeInMB = (double) exception.getActualSize() / (1024 * 1024);
		double permittedSizeInMB = (double) exception.getPermittedSize() / (1024 * 1024);

		String errorMsg = "Input file size " + actualSizeInMB + " MB exceeds max allowed upload size of "
				+ permittedSizeInMB + " MB ";
		ErrorResponse error = generateErrRespObject("ERR-CORE-O25", null, errorMsg);

		return throwError(ex, error, new HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY, request);

	}

	/************************************************************************************************************
	 * // BUSINESS SPECIFIC ERROR STARTS HERE
	 ***********************************************************************************************************/

	// business specific errors
	@ExceptionHandler(ServiceException.class)
	protected ResponseEntity<Object> handleServiceException(ServiceException e, WebRequest request) {
		StringWriter sw = new StringWriter();
		e.printStackTrace(new PrintWriter(sw));
		EXCEPTION_LOGGER.error("Service Exception Error Details: \n{}", sw);
		ErrorResponse error = new ErrorResponse(e.getErrorCode(),
				getErrMessageFromProperty(e.getErrorCode(), e.getMessage(), e.getDynamicValues()),
				tracer.currentSpan().context().spanIdString(),
				(e.getErrorDetails() == null) ? getMessageFromThrowable(e) : e.getErrorDetails(),
				(e.getDynamicValues() == null ? null : e.getDynamicValues()));// need to discuss what needs to be
																				// displayed when dynamic values is null

		if (EXCEPTION_LOGGER.isDebugEnabled()) {
			EXCEPTION_LOGGER.debug(TRACE_ID_IS, tracer.currentSpan().context().spanIdString());
		}

		return throwError(e, error, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
	}

	/**********************************************************************************************************
	 * // BUSINESS SPECIFIC ERROR ENDS HERE
	 ***********************************************************************************************************/

	/**********************************************************************************************************
	 * // GLOBAL ERROR HANDLER STARTS HERE
	 ***********************************************************************************************************/

	// global exception, if no provided exception would able to capture
	@ExceptionHandler({ Exception.class })
	protected ResponseEntity<Object> handleAllException(Exception e, WebRequest request) {

		EXCEPTION_LOGGER.error("Exception class name : {}", e.getClass());
		EXCEPTION_LOGGER.error("InternalServer Exception Error Details: \n", e);

		String errorCause = CustomExceptionMessageUtil.getErrorCauseMessage(e);
		ErrorResponse error = generateErrRespObject("ERR-CORE-037", "InternalServer Exception Occured", errorCause);
		if (EXCEPTION_LOGGER.isDebugEnabled()) {
			EXCEPTION_LOGGER.debug(TRACE_ID_IS, tracer.currentSpan().context().spanIdString());
		}
		return throwError(e, error, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
	}

	private void printHeaderInfo(WebRequest webRequest) {

		HttpServletRequest request = ((ServletWebRequest) webRequest).getRequest();

		StringBuilder requestInfo = new StringBuilder();

		// user name
		try {
			requestInfo.append("User\t: ").append(CommonUtil.getAuthUser().getUsername());
		} catch (Exception e) {
			requestInfo.append("User:\tNot able to fetch");
		}
		requestInfo.append("\n");

		// method, URI
		requestInfo.append("API\t: ").append(request.getMethod());
		requestInfo.append(" ");
		requestInfo.append(request.getRequestURI()).append("\n");

		// parameters
		Map<String, String[]> params = request.getParameterMap();
		if (params.size() > 0) {
			requestInfo.append("Params\t: ");
			requestInfo.append(JsonUtils.getJson(params));
			requestInfo.append("\n");

		}

		EXCEPTION_LOGGER.info("\n{}", requestInfo);

	}

	private ResponseEntity<Object> throwError(Exception ex, @Nullable Object body, HttpHeaders headers,
			HttpStatus status, WebRequest request) {
		printHeaderInfo(request);
		return handleExceptionInternal(ex, body, headers, status, request);
	}

	/************************************************************************************************************
	 * // GLOBAL ERROR HANDLER ENDS HERE
	 ***********************************************************************************************************/

	@ExceptionHandler(IntegrationServiceException.class)
	protected ResponseEntity<Object> handleIntegrationServiceException(IntegrationServiceException e,
			WebRequest request) {
		StringWriter sw = new StringWriter();
		e.printStackTrace(new PrintWriter(sw));
		EXCEPTION_LOGGER.error("Integration Service Exception Error Details: \n{}", sw);
		ErrorResponse error = new ErrorResponse(e.getErrorCode(), e.getMessage(),
				tracer.currentSpan().context().spanIdString(),
				(e.getErrorDetails() == null) ? e.getCause() : e.getErrorDetails());
		if (EXCEPTION_LOGGER.isDebugEnabled()) {
			EXCEPTION_LOGGER.debug(TRACE_ID_IS, tracer.currentSpan().context().spanIdString());
		}

		return handleExceptionInternal(e, error, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
	}

}
