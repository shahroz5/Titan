# FROM 172.31.48.245:8123/nap-ojdk-2019:11.0.1
FROM 172.31.48.245:8123/nap-openjdk-2019:11.0.1

ARG JAR_FILE_NAME
ARG PORT
ARG HOSTS_FILE


COPY ${JAR_FILE_NAME} app.jar

# Add the below COPY command to map the host 'config-server' in services' bootstrap.yml file  
# to the value of Pivate IP of machine where Config-Server is running
# Config server is running in EPOSS machine of respective environments

COPY ${HOSTS_FILE} C:\\windows\\system32\\drivers\\etc\\hosts

# CMD java -jar -Dspring.profiles.active=${APP_ENV} -Deureka.instance.prefer-ip-address=${PREFER_IP_ADDR} app.jar
ENTRYPOINT ["java","-jar","-Dspring.profiles.active=${APP_ENV}","-Deureka.instance.prefer-ip-address=${PREFER_IP_ADDR}","/app.jar"]

EXPOSE ${PORT}