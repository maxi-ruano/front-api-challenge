🌦️ Branch Weather Frontend
Aplicación frontend para gestionar sucursales y empleados, consultando el clima actual de cada sucursal desde una API externa.

📋 Tecnologías
Tecnología	Uso
Vue 3	Framework principal
Axios	Cliente HTTP para consumir la API
Vue Router	Navegación entre vistas
Pinia	Gestión de estado (opcional)
Tailwind CSS	Estilos (o el que uses)
🚀 Características
✅ Listado de sucursales con clima actual

✅ CRUD completo de sucursales

✅ CRUD completo de empleados (asociados a sucursales)

✅ Búsqueda de sucursales por nombre o ciudad

✅ Visualización de clima en tiempo real

✅ Interfaz responsive

📸 Vista previa
Pantalla	Descripción
Sucursales	Lista todas las sucursales con clima actual, temperatura y viento
Empleados	Lista empleados, filtrables por sucursal
Formularios	Crear/editar sucursales y empleados
Búsqueda	Busca sucursales por nombre o ciudad
🛠️ Instalación
Requisitos
Node.js 18+

NPM o Yarn

Pasos
bash
# 1. Clonar el repositorio
git clone https://github.com/maxi-ruano/front-api-challenge.git
cd front-api-challenge

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu API backend

# 4. Levantar servidor de desarrollo
npm run dev
⚙️ Variables de entorno
env
VITE_API_URL=http://127.0.0.1:8000/api
📡 Endpoints consumidos
🏢 Sucursales (Branches)
Método	Endpoint	Descripción
GET	/branches	Listar sucursales (con clima)
GET	/branches/{id}	Obtener una sucursal
POST	/branches	Crear sucursal
PUT	/branches/{id}	Actualizar sucursal
DELETE	/branches/{id}	Eliminar sucursal
GET	/branches/search?q={texto}	Buscar por nombre/ciudad
👥 Empleados (Employees)
Método	Endpoint	Descripción
GET	/employees	Listar empleados (filtro por branch_id)
GET	/employees/{id}	Obtener un empleado
POST	/employees	Crear empleado
PUT	/employees/{id}	Actualizar empleado
DELETE	/employees/{id}	Eliminar empleado

🔗 Backend
Este frontend consume la API desarrollada en Laravel con arquitectura hexagonal.

📦 Repositorio backend: api-challenge

