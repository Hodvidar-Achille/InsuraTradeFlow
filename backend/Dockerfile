# Use official OpenJDK image
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy ONLY the built JAR file
COPY target/*.jar app.jar

# Run the application (simple and direct)
CMD ["java", "-jar", "app.jar"]