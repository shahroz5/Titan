/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter.SseEventBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.titan.poss.core.dto.NotificationEventDto;
import com.titan.poss.core.dto.NotificationRequestDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.engine.service.NotificationService;
import com.titan.poss.engine.user.repository.AclRepository;
import com.titan.poss.engine.user.repository.NotificationRepository;
import com.titan.poss.engine.user.repository.RoleAclMappingRepository;
import com.titan.poss.engine.user.repository.RoleRepository;
import com.titan.poss.engine.user.repository.UserLoginRepository;
import com.titan.poss.user.dao.RoleAclMappingDao;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.notification.dao.NotificationDao;
import com.titan.poss.user.util.RoleUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

	@Autowired
	NotificationRepository notificationRepository;

	@Autowired
	RoleRepository roleRepo;

	@Autowired
	AclRepository aclRepo;

	@Autowired
	RoleAclMappingRepository roleAclRepo;

	@Autowired
	UserLoginRepository userLoginRepo;

	private static final String USER_NAME = "userName";
	private static final String ERR_ENG_013 = "ERR-ENG-013";

	final Map<String, CopyOnWriteArrayList<SseEmitter>> userEmitters = new ConcurrentHashMap<>();

	public final ApplicationEventPublisher eventPublisher;

	private ExecutorService threadPool = createThreadPool();

	@Bean
	public ExecutorService createThreadPool() {
		return Executors.newCachedThreadPool();
	}

	public NotificationServiceImpl(ApplicationEventPublisher eventPublisher) {
		this.eventPublisher = eventPublisher;
	}

	/**
	 * This method returns the SseEmitter object for the user.
	 */
	@Override
	public SseEmitter registerEmitters() {
		String userName = CommonUtil.getUserName();
		SseEmitter emitter = new SseEmitter();
		emitter.onCompletion(() -> userEmitters.get(userName).remove(emitter));
		emitter.onTimeout(() -> userEmitters.get(userName).remove(emitter));
		userEmitters.putIfAbsent(userName, new CopyOnWriteArrayList<>());
		userEmitters.get(userName).add(emitter);
		return emitter;

	}

	/**
	 * This method sends Heartbeat event for all the registered events.
	 */
	@Override
	public void sendHeartBeat() {

		SseEventBuilder event = SseEmitter.event();
		event.name("Heartbeat");
		userEmitters.forEach((k, v) -> {

			event.data(getObjectFromMessage("Heartbeat: 200", k), MediaType.APPLICATION_JSON);
			for (SseEmitter emitter : v) {
				try {
					log.trace("Sending heartbeat");
					emitter.send(event);
				} catch (IOException e) {
					v.remove(emitter);
				}
			}
		});
	}

	private Map<String, Object> getObjectFromMessage(String message, String userName) {

		Map<String, Object> data = new LinkedHashMap<>();
		data.put("text", message);
		data.put(USER_NAME, userName);
		data.put("time", CalendarUtils.getCurrentDate());

		return data;
	}

	/**
	 * This method listens to publishNotificationEvent and send events.
	 */
	@EventListener
	public void onEvent(ObjectNode object) {

		String userName = object.get(USER_NAME).asText();
		log.debug("check notification to: {}", userName);
		if (userEmitters.containsKey(userName)) {
			log.debug("Send notification to: {}", userName);
			SseEventBuilder event = SseEmitter.event();

			event.name(object.get("name").asText());
			event.data(getObjectFromMessage(object.get("data").asText(), userName), MediaType.APPLICATION_JSON);
			// @formatter:off
			userEmitters.get(userName).parallelStream()
			.forEach(emitter -> CompletableFuture.runAsync(() -> {
				try {
					emitter.send(event);
				} catch (IOException e) {
					userEmitters.get(userName).remove(emitter);
				}
			}, threadPool));
			// @formatter:on
		}
	}

	/**
	 * This method is called from /publish-event API.
	 * 
	 */
	@Override
	@Transactional(readOnly = true)
	public void publishNotificationEvent(NotificationRequestDto notificationRequestDto) {

		String notificationCode = notificationRequestDto.getNotificationCode();

		NotificationDao notification = getByNotificationCode(notificationCode);

		boolean isAclExist = aclRepo.existsByAclCode(notificationCode);

		checkForNotificationRestriction(notificationRequestDto, notificationCode, isAclExist);

		String message = getMessageWithValue(notification.getMessage(), notificationRequestDto.getProperties());

		NotificationEventDto notificationEvent = getNotificationEvent(message);
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode eventCommon = mapper.convertValue(notificationEvent, ObjectNode.class);

		// user name specific
		if (!isAclExist) {
			eventCommon.put(USER_NAME, notificationRequestDto.getUserName());
			this.eventPublisher.publishEvent(eventCommon);
		} else {
			// role specific, location optional
			// @formatter:off
			Set<String> userNames = userLoginRepo.listUserNames(notificationCode, notificationRequestDto.getLocationCode());
			log.debug("Send notification to: {}", userNames);
			CollectionUtil.collectionAsStream(userNames)
				.forEach(userName -> {
					ObjectNode event = mapper.convertValue(eventCommon, ObjectNode.class);
					event.put(USER_NAME, userName);
					this.eventPublisher.publishEvent(event);
				});
		}
	}

	private NotificationDao getByNotificationCode(String notificationCode) {
		Optional<NotificationDao> notifications = notificationRepository.findById(notificationCode);
		if (!notifications.isPresent() || !notifications.get().getIsActive())
			throw new ServiceException("Notification not found or deactivated.", "ERR-ENG-014",
					"'" + notificationCode + "' notification code not found or deactive.");
		return notifications.get();
	}

	private void checkForNotificationRestriction(NotificationRequestDto notificationRequestDto, String notificationCode,
			boolean isAclExist) {

		if (isAclExist) {

			RoleAclMappingDao ram = roleAclRepo.findFirstByAclAclCode(notificationCode);
			if (ram == null)
				throw new ServiceException("Role mapping is required for this notification code.", "ERR-ENG-011",
						notificationCode);

			RoleDao role = ram.getRole();
			if (RoleUtil.isRoleBelongToBtq(role.getAccessType())
					&& StringUtils.isBlank(notificationRequestDto.getLocationCode()))
				throw new ServiceException("locationCode is mandatory if role code is of store", ERR_ENG_013,
						"locationCode");

		} else if (StringUtils.isBlank(notificationRequestDto.getUserName())) {
			throw new ServiceException("userName is mandatory if role code is not mapped to this notification",
					ERR_ENG_013, USER_NAME);
		}
	}

	/**
	 * This method return the message with replaced dynamic values
	 * 
	 * @param message    The message to publish to UI
	 * @param properties Map of Parameters whose value to be changed on runtime
	 * @return
	 */
	private String getMessageWithValue(String message, Map<String, String> properties) {

		if (properties != null && !properties.isEmpty()) {

			for (Map.Entry<String, String> entry : properties.entrySet()) {
				String pattern = "${" + entry.getKey() + "}";
				message = message.replace(pattern, entry.getValue());
			}
		}

		String[] strArr = message.split("[ ]+");
		List<String> unParsedStr = new ArrayList<>();
		for (int i = 0; i < strArr.length; i++) {
			if (strArr[i].startsWith("${")) {
				unParsedStr.add(parseStringToRemoveUnwanted(strArr[i]));
			}
		}

		if (!unParsedStr.isEmpty())
			throw new ServiceException("Notification template parsing failed", "ERR-ENG-012", "failed properties: " + unParsedStr);

		return message;
	}
	
	private String parseStringToRemoveUnwanted(String str) {
		int end = str.lastIndexOf('}');
		end = (end == -1) ? str.length() : end;
		str = str.substring(2, end);
		return str;
	}


	private NotificationEventDto getNotificationEvent(String message) {
		NotificationEventDto notificationEvent = new NotificationEventDto();
		notificationEvent.setName("Notification");
		notificationEvent.setData(message);
		return notificationEvent;
	}
}
