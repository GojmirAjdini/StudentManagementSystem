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
- All these protected endpoints below require a **valid `accessToken` cookie**.
- You do **not** need to manually attach tokens; they are sent automatically if your frontend uses `credentials: 'include'` in fetch or `withCredentials: true` in Axios.
- Only users with appropriate role (e.g., `'admin'` or `'superadmin'`) can access admin-level routes.
- Admin and superadmin have the same priorities, expect that superadmin can CRUD(Create,Read,Update,Delete) other admins!
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
• FakultetiID (text): The ID of the faculty to which the course belongs.  
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







