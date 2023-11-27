FROM openjdk:17

EXPOSE 8080
ARG JAR_FILE=/target/clinica_ucu-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} clinica_ucu-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","clinica_ucu-0.0.1-SNAPSHOT.jar"]