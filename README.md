# Backend-en-nube
### SignUp
```http
POST http://44.205.252.151:8080/cliente/signup
```
| Parameter | Type | Description |
|:--------- |:---- |:----------- |
| email     |  string    |   **REQUIRED**  Email saved to Dynamo and Cognito         |
|  password         |  string     |    **REQUIRED**   Password saved to Dynamo and Cognito       |
|   name        |  string    |   **REQUIRED**  Name saved to Dynamo and Cognito           |
|     role      |    string  |     **REQUIRED**  Role saved to Dynamo and Cognito     |


### Verify
```http
POST http://44.205.252.151:8080/cliente/verify
```
| Parameter | Type | Description |
|:--------- |:---- |:----------- |
| email     |  string    |   **REQUIRED**  Email saved to Dynamo and Cognito         |
|  code         |  string     |    **REQUIRED**   Code received from email  registered    |

### SignIn
```http
POST http://44.205.252.151:8080/cliente/signin
```
| Parameter | Type | Description |
|:--------- |:---- |:----------- |
| email     |  string    |   **REQUIRED**  Email saved on Dynamo and Cognito         |
|  password         |  string     |    **REQUIRED**   Password saved on Dynamo and Cognito    |

<div style="page-break-after: always;"></div>

### Saldo
```http
GET http://44.205.252.151:8080/cuenta/saldo
```
| Parameter | Type | Description |
|:--------- |:---- |:----------- |
| no_cuenta     |  string    |   **REQUIRED**  Account number received from /signup         |
|  Auth         |  Bearer Token     |    **REQUIRED**   Auth token received from  /signin    |


### Deposito
```http
POST http://44.205.252.151:8080/cuenta/deposito
```
| Parameter | Type | Description |
|:--------- |:---- |:----------- |
| no_cuenta     |  string    |   **REQUIRED**  Account number received from /signup         |
|  cantidad         |  number     |    **REQUIRED**   Number to deposit to account number       |



### Retiro
```http
POST http://44.205.252.151:8080/cuenta/retiro
```
| Parameter | Type   | Description                                        |
|:--------- |:------ |:-------------------------------------------------- |
| no_cuenta | string | **REQUIRED**  Account number received from /signup |
| cantidad  | number | **REQUIRED**   Number to deposit to account number |
|  Auth         |  Bearer Token     |    **REQUIRED**   Auth token received from  /signin    |
