# StudentManagementSystem (Sistem për Menaxhimin e Studentëve)

## Project Description (Përshkrimi i projektit)
Projekti SMS (Student Management System) mundëson lehtësim në administrimin e studentëve, profesorëve, lëndëve dhe notave. Sistemi përmirëson efikasitetin në menaxhimin akademik dhe redukton proceset manuale brenda një institucioni arsimor.

## Prerequisites (Parakushte)
- NodeJS
- ReactJS
- MySQL
- dotenv..  

## Installation (Instalimi)

1. Clone the repository:
   ```bash
   git clone https://github.com/GojmirAjdini/StudentManagementSystem.git
   cd StudentManagementSystem
   ```
2. Install Backend Dependencies:
   ```bash
   npm install
   ```
3. Install Frontend Dependencies:
   ```bash
   cd React/my-react-app
   npm install  
   ```

## Starting Application (Startimi i aplikacionit) 
To start app, you will need two terminals:  
Terminal 1 - Backend (Server):
  ```bash
  cd StudentManagementSystem
  npm start
  # or
  npm run dev  
  ```  
Terminal 2 - Frontend (React):
  ```bash
  cd StudentManagementSystem/React/my-react-app
  npm start
  # or
  npm run dev  
   ```
The URL for application will appear on terminal, that would usually be like:
  ```bash
  http://localhost:5173/
   ``` 
## API (Admin) Endpoints 
### Notes:
- All these (Admin) protected endpoints below require a **valid `accessToken` cookie**.
- You do **not** need to manually attach tokens; they are sent automatically if your frontend uses `credentials: 'include'` in fetch or `withCredentials: true` in Axios.
- Only users with appropriate role (e.g., `'admin'` or `'superadmin'`) can access admin-level routes.
- Admin and superadmin have the same priorities, expect that superadmin can CRUD(Create,Read,Update,Delete) other admins, while admin cannot!
---

## **Admin Register (Regjistrimi si Admin, Superadmin )**
### Notes about Admin registration
- Admins cannot register themselves, they are registered by superadmins only,   
- Superadmins also cannot register themselves,  
- One superadmin can be registered manually in database, then we use this one account to register other superadmins, admins.  

### Request
This endpoint allows administrators to register new users. The request should be sent via an **HTTP POST** method to `localhost:3000/admin/register`.   
### Body
The request body should be of type x-www-form-urlencoded and include the following parameters:  
- FakultetiID (number): The ID of the faculty to which the user belongs. 
- Email (text): The email address of the user.
- Password (text): The password for the user account.
- Emri (text): The first name of the user.
- Mbiemri (text): The last name of the user.
- Role(text): The role (**'superadmin'**, **'admin'**)

Upon successful registration, the endpoint will return a response with the relevant user information.

### Response

```json
{
    "message": "Te dhënat u regjistruan me sukses!",
    "Data": {
        "AdminID": 7,
        "Fakulteti": "1",
        "Email": "user@gmail.com",
        "Password": "Psw",
        "Emri_Adminit": "Name",
        "Mbiemri_Adminit": "Surname",
        "role": "admin"
    }
}
```
---
## **Login Admin (Kyçja si Admin)**

This endpoint allows administrators to log in (Use the credentials of the account registered in endpoint above **Admin Register**).

#### Request
1. **Method: POST**
2. **URL:** 
```bash 
http://localhost:3000/admin/login
```
#### Body

- Email (text): The email of the administrator.
- Password (text): The password of the administrator.

#### Response
The response Example below in (JSON):

```json
{
    "loginMessage": "Kyçja e suksesshme",
    "message": "Përshëndetje Admin: superadmin@gmail.com",
    "data": [
        {
            "FakultetiId": 1,
            "Email": "superadmin@gmail.com",
            "Emri_Adminit": "Superadmin",
            "Mbiemri_Adminit": "Superadmin",
            "role": "superadmin"
        }
    ]
}
```
---







---
### **Register Faculties (Regjistro Fakultetet)**
This endpoint allows the admin to submit information about fakultetet.(Ky endpoint lejon adminin te regjistroje te dhenat per fakultetin.)  
#### Request
1. **Method: POST**
2. **URL:** 
```bash 
http://localhost:3000/admin/fakultetet/submit/
```
3. **Body** (x-www-form-urlencoded):
- Emri (text, required): The name of the fakulteti.
- Niveli (text, required): The level of the fakulteti.
- Lokacioni (text, required): The location of the fakulteti.
- Kodi_Fakultetit(number, required): Faculty Code.

#### Response
The response after successful registration would look like this in (JSON):  
```json
{
    "message": "Fakulteti u regjistrua me sukses!",
    "data": {
        "FakultetiID": 84,
        "Emri": "Shkenca Kompjuterike",
        "Niveli": "Master",
        "Lokacioni": "Prishtine",
        "Kodi_Fakultetit": "10000"
    }
}
```
---
### **Read Faculties (Lexo fakultetet)** 
The endpoint retrieves a list of all faculties available in the system.(Ky endpoint merr nje liste te te gjithe fakulteteve te disponueshme ne sistem.)  

#### Request
1. **Method: GET**
2. **URL:** 
```bash 
http://localhost:3000/admin/fakultetet/all/
```
#### Response
The response is a JSON array containing objects with the following properties:  
- FakultetiID (number): The ID of the faculty.
- Emri (string): The name of the faculty.
- Niveli (string): The level of the faculty.
- Lokacioni (string): The location of the faculty.
- Kodi_Fakultetit (number): The code of the faculty.
- uKrijua (string): The creation date of the faculty.  

Example: 

```json
[
    {
        "FakultetiID": 0,
        "Emri": "",
        "Niveli": "",
        "Lokacioni": "",
        "Kodi_Fakultetit": 0,
        "uKrijua": ""
    }
]

```
---
### **Delete faculty (Fshij fakultetin)**
This endpoint sends an **HTTP DELETE** request to **URL**:    
``` bash
http://localhost:3000/admin/fakultetet/delete/:FakultetiID
``` 
to delete a specific fakulteti (faculty) identified by the FakultetiID parameter. (Kerkese HTTP Delete per te fshire fakultetin specifik i cili identifikohet me ane te FakultetiID si parameter.)

#### Response
The response is a message confirming whether the deletion was successful or not.  
Example:  
```json
{
    "message": "Fakulteti u fshi me sukses!"
}
```
---
### **Update Fakulteti Information (Perditeso te dhenat e fakultetit)**
This endpoint allows the admin to update information about a specific fakulteti. (Ky endpoint lejon adminin te perditesoje informata rreth nje fakulteti specifik.)
#### Request 
1. **Method: PATCH** 
2. **URL:** 
```bash
http://localhost:3000/admin/fakultetet/edit/:FakultetiID
```
3. **Body:**  
- Emri: (text) The name of the fakulteti.
- Niveli: (text) The level of the fakulteti.
- Lokacioni: (text) The location of the fakulteti.
- Kodi_Fakultetit: (number) The code of the fakulteti.  

#### Response 
Example of JSON response after successful updation:

```json
{
    "message": "Fakulteti u përditësua me sukses!"
}

```
---

### **Register Courses (Regjistro Lendet)**
This endpoint allows the admin to submit information about a course.
 (Ky endpoint lejon adminin te regjistroj te dhenat per ndonje lende.)
#### Request
1. **Method**: POST
2. **URL**: 
```bash 
http://localhost:3000/admin/lendet/submit 
```    
3. **Body**:   
• FakultetiID (number): The ID of the faculty to which the course belongs.  
• Emri_Lendes (text): The name of the course.  
• ECTS (number): The number of ECTS credits for the course.  
• semestri (number): The semester in which the course is offered.  

#### Example Request Body
```json
{
  "FakultetiID": "12345",
  "Emri_Lendes": "Programming 1",
  "ECTS": "6",
  "semestri": "1"
}  
```
---
### **Read Courses (Lexo Lendet)**
This endpoint sends an HTTP GET request to retrieve all lendet for the admin.
(Ky endpoint dergon kerkese GET te HTTP per te marre te gjithe lendet.)
1. **Method**: GET
2. **URL**: 
```bash 
http://localhost:3000/admin/lendet/all 
```
#### Response   
The response for this request is a JSON object representing the list of all courses.
 (Pergjigja nga kjo kerkese eshte objekt JSON qe reprezenton nje liste te te gjithe lendeve.)
```json
{    
   "LendaID": 123,
   "Fakulteti": "Shkenca Kompjuterike",
   "Emri_Lendes": "Bazat e të Dhënave",
   "ECTS": 5,
   "Kodi_Lendes": "123DB123",
   "uKrijua": "0000-00-00T17:00:00.000Z",
   "Semestri": 3
}
```

---
### **Delete specific Course (Fshij Lenden specifike)**
This endpoint is used to delete a specific "Lenda" (subject) identified by its unique ID. 
(Ky endpoint perdoret per te fshire nje lende specifike e cila identifikohet nga ID-ja e saj unike.)

1. **Method**: DELETE
2. **URL**: 
```bash 
http://localhost:3000/admin/lendet/delete/:LendaID
```
#### Request
- The request does not require a request body.
- The LendaID parameter in the URL specifies the ID of the "Lenda" to be deleted.  

#### Response
The response for this request is a JSON object with the following property:   
**message**: A string providing information about the deletion, whether it was successful or not.  

Example response: 
```json
{
    "message": "Lënda u fshi me sukses!"
}
```  
---
### **Edit Lenda**
This endpoint is used to update the details of a specific Lenda.  

1. **Method**: PATCH
2. **URL**: 
```bash 
http://localhost:3000/admin/lendet/edit/:LendaID
```
#### Response
The response for this request is a JSON object with the following property:   
**message**: A string providing information about the updation, whether it was successful or not.  


```json
{
    "message": "Lënda u përditësua me sukses!"
}

```







