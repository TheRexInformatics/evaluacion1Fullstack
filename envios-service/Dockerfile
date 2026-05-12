FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
# Copiamos el JAR compilado al contenedor
COPY target/*.jar app.jar
# Exponemos el puerto del microservicio
EXPOSE 8083
ENTRYPOINT ["java","-jar","/app.jar"]