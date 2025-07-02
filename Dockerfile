FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/municipal-0.0.1-SNAPSHOT.jar ./municipal.jar
ENTRYPOINT ["java", "-jar", "municipal.jar"]
