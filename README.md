# SmartLogix - Sistema de Gestión de Inventario y Pedidos (Backend)

Bienvenido al ecosistema backend de **SmartLogix**, una arquitectura basada en **Microservicios** construida con **Spring Boot**, **Spring Cloud (API Gateway, OpenFeign)** y **Docker**. El sistema permite gestionar de manera aislada y eficiente los productos, el control de stock, la creación de pedidos y el procesamiento de envíos.

---

## Arquitectura del Sistema y Carpetas

El repositorio está organizado de forma modular, donde cada carpeta representa un componente independiente de la arquitectura:

```text
evaluacion1Fullstack-DV/
├── api-gateway/            # Enrutador único y punto de entrada de la arquitectura (Puerto 8080)
├── bff-service/            # Backend For Frontend para agregación de datos (Puerto 8084)
├── inventario-service/     # Microservicio de catálogo de productos y stock global (Puerto 8081)
├── pedidos-service/        # Microservicio de reglas de negocio y compras (Puerto 8082)
├── envios-service/         # Microservicio de despachos y logística (Puerto 8083)
└── docker-compose.yml      # Orquestador de contenedores (Apps + Bases de Datos)
```

## Puertos, Microservicios y URLs de Interés

<table>
  <thead>
    <tr>
      <th>Componente / Microservicio</th>
      <th>Puerto Nativo</th>
      <th>URL de Swagger UI (Documentación)</th>
      <th>Descripción / Rol en la Arquitectura</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>API Gateway</strong></td>
      <td><code>8080</code></td>
      <td><em>No aplica (Punto de entrada unificado)</em></td>
      <td>Enruta todas las peticiones externas hacia sus servicios correspondientes.</td>
    </tr>
    <tr>
      <td><strong>inventario-service</strong></td>
      <td><code>8081</code></td>
      <td><a href="http://localhost:8081/swagger-ui/index.html">http://localhost:8081/swagger-ui/index.html</a></td>
      <td>Catálogo de productos, descripción y validación/reducción de stock global.</td>
    </tr>
    <tr>
      <td><strong>pedidos-service</strong></td>
      <td><code>8082</code></td>
      <td><a href="http://localhost:8082/swagger-ui/index.html">http://localhost:8082/swagger-ui/index.html</a></td>
      <td>Lógica principal de compra. Valida stock mediante Feign con inventario.</td>
    </tr>
    <tr>
      <td><strong>envios-service</strong></td>
      <td><code>8083</code></td>
      <td><a href="http://localhost:8083/swagger-ui/index.html">http://localhost:8083/swagger-ui/index.html</a></td>
      <td>Gestión de logística, almacenamiento y estados de despacho de pedidos.</td>
    </tr>
    <tr>
      <td><strong>bff-service</strong></td>
      <td><code>8084</code></td>
      <td><a href="http://localhost:8084/swagger-ui/index.html">http://localhost:8084/swagger-ui/index.html</a></td>
      <td>Backend For Frontend. Orquesta y unifica respuestas optimizadas para la UI.</td>
    </tr>
    <tr>
      <td><strong>db-inventario (PostgreSQL)</strong></td>
      <td><code>5433</code></td>
      <td><em>Conexión directa vía JDBC / DBeaver</em></td>
      <td>Base de datos aislada para el estado físico del inventario.</td>
    </tr>
    <tr>
      <td><strong>db-pedidos (PostgreSQL)</strong></td>
      <td><code>5434</code></td>
      <td><em>Conexión directa vía JDBC / DBeaver</em></td>
      <td>Base de datos aislada para las órdenes y estados de compra.</td>
    </tr>
    <tr>
      <td><strong>db-envios (PostgreSQL)</strong></td>
      <td><code>5435</code></td>
      <td><em>Conexión directa vía JDBC / DBeaver</em></td>
      <td>Base de datos aislada para las guías de despacho y direcciones.</td>
    </tr>
  </tbody>
</table>

---

## 🛠️ Comandos de Docker (Gestión del Entorno)

Todos estos comandos deben ejecutarse desde la **raíz del proyecto**, donde se encuentra el archivo `docker-compose.yml`.

### Gestión Global (Todo el ecosistema)

* **Levantar todo por primera vez (o aplicar cambios de código):**
  Construye las imágenes y levanta todos los contenedores en segundo plano.
  ```bash
  docker-compose up -d --build
  ```

* **Detener y eliminar todos los contenedores:**
  Apaga el ecosistema completo y libera los puertos de tu máquina.
  ```bash
  docker-compose down
  ```

* **Verificar el estado de los servicios:**
  Muestra qué contenedores están corriendo, sus puertos y su estado de salud (healthy).
  ```bash
  docker-compose ps
  ```

### Gestión Individual (Por Microservicio)

Si realizaste cambios en el código de una sola carpeta (por ejemplo, `pedidos-service`) y no quieres reiniciar todo el ecosistema, utiliza los siguientes comandos.

*Reemplaza `<nombre-servicio>` por el nombre exacto definido en el docker-compose (ej: `inventario-service`, `api-gateway`, etc).*

* **Reconstruir y levantar un solo servicio:**
  ```bash
  docker-compose up -d --build <nombre-servicio>
  ```
  *Ejemplo: `docker-compose up -d --build pedidos-service`*

* **Detener un solo servicio:**
  ```bash
  docker-compose stop <nombre-servicio>
  ```

* **Reiniciar un solo servicio:**
  ```bash
  docker-compose restart <nombre-servicio>
  ```

* **Ver los logs en tiempo real de un servicio:**
  Útil para depurar errores o ver las trazas de Spring Boot.
  ```bash
  docker-compose logs -f <nombre-servicio>
  ```

  ## Stack Tecnológico

* **Lenguaje:** Java 17+
* **Framework Principal:** Spring Boot 3
* **Arquitectura:** Microservicios (Spring Cloud Gateway, OpenFeign)
* **Bases de Datos:** PostgreSQL (Database-per-service)
* **Documentación de APIs:** Springdoc OpenAPI (Swagger UI)
* **Testing:** JUnit 5, Mockito, JaCoCo
* **Orquestación:** Docker & Docker Compose

---


## Calidad de Código y Testing

El núcleo lógico del sistema (controladores y servicios) ha sido sometido a pruebas exhaustivas, garantizando un código blindado ante refactorizaciones.

* **Cobertura de Instrucciones (JaCoCo):** 100%
* **Cobertura de Ramas lógicas (Branches):** 100%