
---
# 0 — users endpoints

## 1 — Create User
### request
```http
POST http://localhost:8000/register
Content-Type: application/json
````

```json
{
"username": "abdullah88",
  "password": "StrongPass123",
  "email": "abdullah88@example.com",
  "phone_number": "+966501234568",
  "whatsapp_number": "+966501234569",
  "city": "Riyadh",
  "postal_code": "11564",
  "address": "Olaya Street, Riyadh"
}
```

### response

```json
HTTP/1.1 201 Created
Content-Type: application/json
{
    "id": "b50aa14d-0f0d-463e-930c-91124c4fcf68",
    "username": "abdullah88",
    "phone_number": "+966501234568",
    "whatsapp_number": "+966501234569",
    "city": "Riyadh",
    "postal_code": "11564",
    "address": "Olaya Street, Riyadh",
    "first_name": "",
    "last_name": "",
    "email": "abdullah88@example.com",
    "is_staff": false,
    "is_superuser": false,
    "is_active": true
}
```
---
---

# 2 — Login User

### request

```http
POST /login/
Content-Type: application/json

http://54.166.6.159/login/
```

```json
{
"username": "abdullah88",
"password": "StrongPass123"
}
```

### response

```http
HTTP/1.1 200 OK
Allow: POST, OPTIONS
Content-Type: application/json
```
```json
{
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5MDYzNzY3LCJpYXQiOjE3NDkwNjA3NjcsImp0aSI6IjEyMjBhYjcwMTgyMzQ3OTNiNTY3OWViY2E3MzkxNWYyIiwidXNlcl9pZCI6IjM4NDk2NDE2LTkwOTctNDAyOS04ZTQzLWM3NTA1MzRmYThkOCJ9.HY84y4knzb9vCmAZEptXhp1U7uDiVHRVljN7eOkbSFo",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5MDYzNzY3LCJpYXQiOjE3NDkwNjA3NjcsImp0aSI6IjcxZThjZDk0NzBlODQwNWI4YjM4MGI4YWY0ZDRmYTE0IiwidXNlcl9pZCI6IjM4NDk2NDE2LTkwOTctNDAyOS04ZTQzLWM3NTA1MzRmYThkOCJ9.BEJPPxHhVU7xKNMVUA_j1WLVe5USfa9p-O1r8DZ6YRI",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0OTIzMzU2NywiaWF0IjoxNzQ5MDYwNzY3LCJqdGkiOiI4ZGZiMjMzYmI3NGI0ZDkzYjg4M2Y4YTYxZTNkYzc3ZSIsInVzZXJfaWQiOiIzODQ5NjQxNi05MDk3LTQwMjktOGU0My1jNzUwNTM0ZmE4ZDgifQ.V-ILuue-F7EGK27rnNVywESVJ40JQQr0kOCmkQqhsHM",
    "detail": "Logged in successfully"
}
```
# get user data
### request
```sh
curl -X GET http://54.166.6.159/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5MDYzNzY3LCJpYXQiOjE3NDkwNjA3NjcsImp0aSI6IjEyMjBhYjcwMTgyMzQ3OTNiNTY3OWViY2E3MzkxNWYyIiwidXNlcl9pZCI6IjM4NDk2NDE2LTkwOTctNDAyOS04ZTQzLWM3NTA1MzRmYThkOCJ9.HY84y4knzb9vCmAZEptXhp1U7uDiVHRVljN7eOkbSFo"
```
### response
```json
    {
        "id": "38496416-9097-4029-8e43-c750534fa8d8",
        "username": "abdullah88",
        "phone_number": "+966501234568",
        "whatsapp_number": "+966501234569",
        "city": "Riyadh",
        "postal_code": "11564",
        "address": "Olaya Street, Riyadh",
        "first_name": "",
        "last_name": "",
        "email": "abdullah88@example.com",
        "is_staff": false,
        "is_superuser": false,
        "is_active": true
    }
```
---

## 3 — Update User

> *Must be authenticated*

### request

```http
PUT /users/
Content-Type: application/json
Authorization: Session / Cookie
```

```json
{
  "username": "abdullah99",
  "password": "StrongPass123",
  "email": "abdullah-alzoz@example.com",
  "phone_number": "+966501234567",
  "whatsapp_number": "+966501234567",
  "city": "Riyadh",
  "postal_code": "11564",
  "address": "Olaya Street, Riyadh"
}
```

### response

```http
HTTP/1.1 200 OK
Allow: GET, POST, PUT, DELETE, HEAD, OPTIONS
Content-Type: application/json
```
```json
{
    "id": "49aeb016-9039-4a9a-891f-e9266ed455fa",
    "username": "abdullah99",
    "phone_number": "+966501234567",
    "whatsapp_number": "+966501234567",
    "city": "Riyadh",
    "postal_code": "11564",
    "address": "Olaya Street, Riyadh",
    "first_name": "",
    "last_name": "",
    "email": "abdullah-alzoz@example.com",
    "is_staff": false,
    "is_superuser": false,
    "is_active": true
}
```

---

# profile endpoints

## 1 — Get Profile

> *Must be authenticated*

### request

```sh
curl -X GET http://54.166.6.159/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5MDYzNzY3LCJpYXQiOjE3NDkwNjA3NjcsImp0aSI6IjEyMjBhYjcwMTgyMzQ3OTNiNTY3OWViY2E3MzkxNWYyIiwidXNlcl9pZCI6IjM4NDk2NDE2LTkwOTctNDAyOS04ZTQzLWM3NTA1MzRmYThkOCJ9.HY84y4knzb9vCmAZEptXhp1U7uDiVHRVljN7eOkbSFo"

```

### response

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": "9349f22c-92e5-473a-8b6e-846f57d8894b",
    "first_name": null,
    "last_name": null,
    "email": null,
    "image": null
}
```

---

## 2 — Create Profile

> *Must be authenticated*

### request

```http
POST /profile/
Content-Type: multipart/form-data
Authorization: Session / Cookie
```

*Form-data fields:*

* `first_name`: Abdullah
* `last_name`: Alzoz
* `email`: [abdullah99@example.com](mailto:abdullah99@example.com)
* `image`: (file)

### response

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
    "id": "69ec4d28-b92d-4343-a22a-723f5381e07a",
    "first_name": "Abdullah",
    "last_name": "Alzoz",
    "email": "abdullah99@example.com",
    "image": "/media/images/profile/69ec4d28-b92d-4343-a22a-723f5381e07a.jpg"
}
```

---

## 3 — Update Profile
> *Must be authenticated*

### request

```http
PUT http://54.166.6.159/profile
Content-Type: multipart/form-data
Authorization: Session / Cookie
```

*Form-data fields (any subset):*

* `first_name`: Abdullah Updated
* `email`: abdullah-updated@example.com
* `image`: (file) (optional)

### response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": "69ec4d28-b92d-4343-a22a-723f5381e07a",
    "first_name": "Abdullah Updated",
    "last_name": "Alzoz",
    "email": "abdullah-updated@example.com",
    "image": "/media/images/profile/69ec4d28-b92d-4343-a22a-723f5381e07a.jpg"
}
```

---

## 4 — Delete Profile

> *Must be authenticated*

### request

```http
DELETE /profile/
Authorization: Session / Cookie
```

### response

```http
HTTP/1.1 204 No Content
```

---

## 5 — Get Profile Image

> *Must be authenticated*

### request

```http
GET /profile/image/
Authorization: Session / Cookie
```

### response (when exists)

```http
HTTP/1.1 200 OK
Content-Type: image/jpeg

(binary image data)
```

### response (when missing)

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
    "detail": "Profile has no image"
}
```

```
```

i wanna do Contacts class
which contain
1 - full name name should be in one field
2- phone number filed
    must be validated as saudi arabia phone number
3-email
4- catigory with optinal valuse just

5 -  message which will be text field
all fields in monitory
    1 -complaining
    2- Intelligence
    3- join us

also
FAQ class which simply qustion and answer
both are text fileds
```url
http://54.166.6.159/profile
```
request body
```json
{
        "first_name": "mesh sho5lak",
    "last_name": "milzmaksh",
    "email": "nafs al kslam"
}
```
request file
```path
C:\Users\Active\Pictures\Camera Roll\FB_IMG_1684853676131.jpg
```
response body

```json
{
    "detail": "Unsupported media type \"image/jpeg\" in request."
}
```

# order
### Request
```json
{

"method":"POST ",
"URL" : "http://54.166.6.159/order",

"Headers"{
"Authorization" :" Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5MDcyMDgxLCJpYXQiOjE3NDkwNjA3NjcsImp0aSI6ImU2NDdlMDJhNTQxYjQwOGM4YmQ3Njk0NGVjNTU0Yjc4IiwidXNlcl9pZCI6IjM4NDk2NDE2LTkwOTctNDAyOS04ZTQzLWM3NTA1MzRmYThkOCJ9.lWCQ22747TAa1Fck_3IaLMZf2OFt4WgqocSze5YuUw0
"
}
"body":{
  "package": "Economic",
  "promo_code": "SUPPORT100%",
  "from_address": "شارع الملك عبدالعزيز، حي العليا، الرياض",
  "from_lat": 24.7136,
  "from_lng": 46.6753,
  "to_address": "شارع الإمام محمد بن سعود، حي الملز، الرياض",
  "to_lat": 24.6936,
  "to_lng": 46.6731,
  "transportation_date": "2025-06-15",
  "transportation_date_time": "14:00",
  "rooms_number": 3,
  "phone_code": "+20",
  "phone_number": "1123456789",
  "belonging_description": "2 سرير، ثلاجة، مكتب، كرتين",
  "total": 900,
  "service_type": "Intracity"
}
}
```
### Response
```json
{
"status":"201 Created",
"body":{
    "detail": "order created",
    "id": "358a061f-07a2-4b1e-85d4-4b261e8f5c9e"
}
}
```

# ORDER IMAGES
### Request (form data )

```http
* `first_name`: Abdullah

*`order_id`: 358a061f-07a2-4b1e-85d4-4b261e8f5c9e
*`images`: (files) // maximum 15 image more will not result an error but will not be uploaded
```
### Response
```json
{
    "status":"201 Created",
    "body":{
    "detail": "2 image(s) uploaded.",
    "images": [
        {
            "id": "ce6c8dae-67e3-4d33-b7e2-68b3bc59060b",
            "image_url": "http://54.166.6.159/media/images/orders/358a061f-07a2-4b1e-85d4-4b261e8f5c9e/452438061_456754920586587_84692762380_rEFOxDL.jpg"
        },
        {
            "id": "fa11aa01-2699-471f-ae1f-d7f744ec9011",
            "image_url": "http://54.166.6.159/media/images/orders/358a061f-07a2-4b1e-85d4-4b261e8f5c9e/1735552773666.jpg"
        }
    ]
}
}
```