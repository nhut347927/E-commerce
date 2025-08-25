FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy WAR hoặc JAR vào image
COPY target/Moe-0.0.1-SNAPSHOT.war app.war

# Thiết lập biến môi trường (có thể override khi chạy container hoặc docker-compose)
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS=""

EXPOSE 8080

# Chạy app
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.war"]
