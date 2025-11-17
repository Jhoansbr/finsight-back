# 📱 Guía de Integración con Flutter - MIDAS

Esta guía te ayudará a conectar tu aplicación móvil Flutter con el backend de MIDAS.

## 🔌 Configuración Inicial

### 1. Configuración de URL Base

Crea un archivo `lib/config/api_config.dart`:

```dart
class ApiConfig {
  // Desarrollo - Elige según tu caso
  static const String _devBaseUrl = 'http://localhost:3000/api/v1';
  
  // Para Android Emulator
  // static const String _devBaseUrl = 'http://10.0.2.2:3000/api/v1';
  
  // Para iOS Simulator
  // static const String _devBaseUrl = 'http://localhost:3000/api/v1';
  
  // Para dispositivo físico (reemplaza con tu IP local)
  // static const String _devBaseUrl = 'http://192.168.1.100:3000/api/v1';
  
  // Producción
  static const String _prodBaseUrl = 'https://api.tudominio.com/api/v1';
  
  static const bool _isProduction = false; // Cambia a true en producción
  
  static String get baseUrl => _isProduction ? _prodBaseUrl : _devBaseUrl;
  
  // Timeouts
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
}
```

### 2. Dependencias de Flutter

Agrega en tu `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # HTTP Client
  dio: ^5.3.3
  
  # Almacenamiento seguro para tokens
  flutter_secure_storage: ^9.0.0
  
  # State Management (ejemplo con Provider)
  provider: ^6.1.1
  
  # Manejo de fechas
  intl: ^0.18.1
  
  # JSON serialization
  json_annotation: ^4.8.1

dev_dependencies:
  build_runner: ^2.4.6
  json_serializable: ^6.7.1
```

## 🔐 Servicio de Autenticación

### Auth Service

Crea `lib/services/auth_service.dart`:

```dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';
import '../models/user.dart';

class AuthService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: ApiConfig.baseUrl,
    connectTimeout: ApiConfig.connectionTimeout,
    receiveTimeout: ApiConfig.receiveTimeout,
  ));
  
  final _storage = const FlutterSecureStorage();
  
  // Keys para storage
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userKey = 'user';
  
  /// Registrar nuevo usuario
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String nombre,
    required String apellido,
    String? telefono,
    DateTime? fechaNacimiento,
  }) async {
    try {
      final response = await _dio.post('/auth/register', data: {
        'email': email,
        'password': password,
        'nombre': nombre,
        'apellido': apellido,
        if (telefono != null) 'telefono': telefono,
        if (fechaNacimiento != null) 
          'fechaNacimiento': fechaNacimiento.toIso8601String(),
      });
      
      if (response.data['success'] == true) {
        final data = response.data['data'];
        
        // Guardar tokens
        await _saveTokens(
          accessToken: data['accessToken'],
          refreshToken: data['refreshToken'],
        );
        
        // Guardar usuario
        await _saveUser(data['user']);
        
        return data;
      } else {
        throw Exception('Error en el registro');
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  /// Iniciar sesión
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });
      
      if (response.data['success'] == true) {
        final data = response.data['data'];
        
        // Guardar tokens
        await _saveTokens(
          accessToken: data['accessToken'],
          refreshToken: data['refreshToken'],
        );
        
        // Guardar usuario
        await _saveUser(data['user']);
        
        return data;
      } else {
        throw Exception('Error en el login');
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  /// Cerrar sesión
  Future<void> logout() async {
    try {
      final token = await getAccessToken();
      
      if (token != null) {
        await _dio.post(
          '/auth/logout',
          options: Options(headers: {'Authorization': 'Bearer $token'}),
        );
      }
    } catch (e) {
      // Continuar con logout local aunque falle en servidor
    } finally {
      await _clearStorage();
    }
  }
  
  /// Obtener perfil del usuario
  Future<Map<String, dynamic>> getProfile() async {
    try {
      final token = await getAccessToken();
      
      if (token == null) {
        throw Exception('No hay sesión activa');
      }
      
      final response = await _dio.get(
        '/auth/me',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      if (response.data['success'] == true) {
        await _saveUser(response.data['data']);
        return response.data['data'];
      } else {
        throw Exception('Error al obtener perfil');
      }
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  /// Refrescar token
  Future<String?> refreshToken() async {
    try {
      final refreshToken = await getRefreshToken();
      
      if (refreshToken == null) {
        return null;
      }
      
      final response = await _dio.post('/auth/refresh-token', data: {
        'refreshToken': refreshToken,
      });
      
      if (response.data['success'] == true) {
        final data = response.data['data'];
        
        await _saveTokens(
          accessToken: data['accessToken'],
          refreshToken: data['refreshToken'],
        );
        
        return data['accessToken'];
      }
      
      return null;
    } catch (e) {
      return null;
    }
  }
  
  // Helpers privados
  
  Future<void> _saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: _accessTokenKey, value: accessToken);
    await _storage.write(key: _refreshTokenKey, value: refreshToken);
  }
  
  Future<void> _saveUser(Map<String, dynamic> user) async {
    await _storage.write(key: _userKey, value: json.encode(user));
  }
  
  Future<void> _clearStorage() async {
    await _storage.delete(key: _accessTokenKey);
    await _storage.delete(key: _refreshTokenKey);
    await _storage.delete(key: _userKey);
  }
  
  Future<String?> getAccessToken() async {
    return await _storage.read(key: _accessTokenKey);
  }
  
  Future<String?> getRefreshToken() async {
    return await _storage.read(key: _refreshTokenKey);
  }
  
  Future<Map<String, dynamic>?> getStoredUser() async {
    final userJson = await _storage.read(key: _userKey);
    if (userJson != null) {
      return json.decode(userJson);
    }
    return null;
  }
  
  String _handleError(DioException e) {
    if (e.response != null) {
      final data = e.response!.data;
      if (data is Map && data['error'] != null) {
        return data['error']['message'] ?? 'Error desconocido';
      }
    }
    
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return 'Tiempo de espera agotado';
      case DioExceptionType.connectionError:
        return 'Error de conexión. Verifica tu internet';
      default:
        return 'Error de red';
    }
  }
}
```

## 🌐 API Client con Interceptor

Crea `lib/services/api_client.dart`:

```dart
import 'package:dio/dio.dart';
import '../config/api_config.dart';
import 'auth_service.dart';

class ApiClient {
  late final Dio _dio;
  final AuthService _authService;
  
  ApiClient(this._authService) {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: ApiConfig.connectionTimeout,
      receiveTimeout: ApiConfig.receiveTimeout,
    ));
    
    // Interceptor para agregar token automáticamente
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _authService.getAccessToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        // Si el error es 401, intentar refrescar token
        if (error.response?.statusCode == 401) {
          final newToken = await _authService.refreshToken();
          
          if (newToken != null) {
            // Reintentar petición original
            final options = error.requestOptions;
            options.headers['Authorization'] = 'Bearer $newToken';
            
            try {
              final response = await _dio.fetch(options);
              return handler.resolve(response);
            } catch (e) {
              return handler.next(error);
            }
          }
        }
        
        return handler.next(error);
      },
    ));
  }
  
  Dio get dio => _dio;
}
```

## 💰 Servicios de Negocio

### Servicio de Ingresos

Crea `lib/services/ingreso_service.dart`:

```dart
import 'package:dio/dio.dart';
import 'api_client.dart';

class IngresoService {
  final ApiClient _apiClient;
  
  IngresoService(this._apiClient);
  
  /// Crear ingreso
  Future<Map<String, dynamic>> crear({
    required int categoriaId,
    required double monto,
    required DateTime fecha,
    String? descripcion,
    int? tipoPagoId,
    bool esRecurrente = false,
    int? frecuenciaId,
    DateTime? fechaInicio,
    DateTime? fechaFin,
  }) async {
    final response = await _apiClient.dio.post('/ingresos', data: {
      'categoriaId': categoriaId,
      'monto': monto,
      'fecha': fecha.toIso8601String(),
      if (descripcion != null) 'descripcion': descripcion,
      if (tipoPagoId != null) 'tipoPagoId': tipoPagoId,
      'esRecurrente': esRecurrente,
      if (frecuenciaId != null) 'frecuenciaId': frecuenciaId,
      if (fechaInicio != null) 'fechaInicio': fechaInicio.toIso8601String(),
      if (fechaFin != null) 'fechaFin': fechaFin.toIso8601String(),
    });
    
    return response.data['data'];
  }
  
  /// Listar ingresos
  Future<Map<String, dynamic>> listar({
    int page = 1,
    int limit = 20,
    DateTime? fechaInicio,
    DateTime? fechaFin,
    int? categoriaId,
    bool? esRecurrente,
  }) async {
    final queryParams = {
      'page': page,
      'limit': limit,
      if (fechaInicio != null) 'fechaInicio': fechaInicio.toIso8601String(),
      if (fechaFin != null) 'fechaFin': fechaFin.toIso8601String(),
      if (categoriaId != null) 'categoriaId': categoriaId,
      if (esRecurrente != null) 'esRecurrente': esRecurrente,
    };
    
    final response = await _apiClient.dio.get(
      '/ingresos',
      queryParameters: queryParams,
    );
    
    return {
      'ingresos': response.data['data'],
      'meta': response.data['meta'],
    };
  }
  
  /// Obtener ingreso por ID
  Future<Map<String, dynamic>> obtenerPorId(int id) async {
    final response = await _apiClient.dio.get('/ingresos/$id');
    return response.data['data'];
  }
  
  /// Actualizar ingreso
  Future<Map<String, dynamic>> actualizar(int id, Map<String, dynamic> data) async {
    final response = await _apiClient.dio.put('/ingresos/$id', data: data);
    return response.data['data'];
  }
  
  /// Eliminar ingreso
  Future<void> eliminar(int id) async {
    await _apiClient.dio.delete('/ingresos/$id');
  }
}
```

### Servicio de Dashboard

Crea `lib/services/dashboard_service.dart`:

```dart
import 'api_client.dart';

class DashboardService {
  final ApiClient _apiClient;
  
  DashboardService(this._apiClient);
  
  /// Obtener resumen general
  Future<Map<String, dynamic>> obtenerResumen() async {
    final response = await _apiClient.dio.get('/dashboard/resumen');
    return response.data['data'];
  }
  
  /// Obtener resumen mensual
  Future<Map<String, dynamic>> obtenerResumenMensual(int mes, int anio) async {
    final response = await _apiClient.dio.get('/dashboard/mensual/$mes/$anio');
    return response.data['data'];
  }
  
  /// Obtener tendencias
  Future<List<dynamic>> obtenerTendencias() async {
    final response = await _apiClient.dio.get('/estadisticas/tendencias');
    return response.data['data'];
  }
  
  /// Obtener gastos por categoría
  Future<Map<String, dynamic>> obtenerGastosPorCategoria({
    required DateTime fechaInicio,
    required DateTime fechaFin,
  }) async {
    final response = await _apiClient.dio.get(
      '/estadisticas/gastos-categoria',
      queryParameters: {
        'fechaInicio': fechaInicio.toIso8601String(),
        'fechaFin': fechaFin.toIso8601String(),
      },
    );
    return response.data['data'];
  }
}
```

## 🎨 Ejemplo de UI - Pantalla de Login

```dart
import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  
  bool _isLoading = false;
  
  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);
    
    try {
      await _authService.login(
        email: _emailController.text,
        password: _passwordController.text,
      );
      
      // Navegar al dashboard
      Navigator.pushReplacementNamed(context, '/dashboard');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('MIDAS - Login')),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: _emailController,
                decoration: InputDecoration(labelText: 'Email'),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Ingresa tu email';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(labelText: 'Contraseña'),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Ingresa tu contraseña';
                  }
                  return null;
                },
              ),
              SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _login,
                child: _isLoading
                    ? CircularProgressIndicator()
                    : Text('Iniciar Sesión'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

## 🧪 Testing de Conexión

Para verificar que la conexión funciona:

1. **Inicia el backend**: `npm run dev`
2. **Verifica que corre**: http://localhost:3000/health
3. **En Flutter**, usa esta función de prueba:

```dart
Future<void> testConnection() async {
  try {
    final dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl));
    final response = await dio.get('/health');
    print('✅ Conexión exitosa: ${response.data}');
  } catch (e) {
    print('❌ Error de conexión: $e');
  }
}
```

## 📝 Formato de Respuestas

Todas las respuestas del API siguen este formato:

### Éxito
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje del error",
    "details": {}
  }
}
```

## 🔐 Manejo de Tokens

El `ApiClient` maneja automáticamente:
- ✅ Agregar token a cada petición
- ✅ Refrescar token cuando expira
- ✅ Reintentar petición con nuevo token

## 💡 Tips Importantes

1. **URL Base**: Cambia según dónde ejecutes (emulador, dispositivo físico, etc.)
2. **Timeouts**: Ajusta según tu conexión
3. **Seguridad**: Nunca guardes datos sensibles sin encriptar
4. **Tokens**: Usa `flutter_secure_storage` siempre
5. **Errores**: Maneja siempre los errores de red

## 🚀 Próximos Pasos

1. Implementa modelos de datos (User, Ingreso, Gasto, etc.)
2. Crea servicios para gastos, metas, presupuestos
3. Implementa state management (Provider, Riverpod, Bloc)
4. Diseña tus pantallas
5. Agrega gráficas con `fl_chart`

---

**¡Listo para conectar Flutter con MIDAS! 🚀📱**

