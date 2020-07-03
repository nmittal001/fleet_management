# Fleet Management Application

Trips Tracker Application.

# Trips Tracker with Node.js and Cassandra

- Trips Tracker application using Node.js and Cassandra.

## Features

- User can Register.
- User can Login.
- User can get his/her Profile.
- User can update his/her Profile.
- User can create Trip.
- User can update Trip.
- User can get all his/her Trips (filter based on UPCOMING, ONGOING, PAST)

## Prerequisites

Make sure you have installed all of the following prerequisites on your machine:

- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Cassandra - [Download & Install Cassandra](http://cassandra.apache.org/doc/latest/getting_started/installing.html), and make sure it's running on the default port (9042).
- Postman - You can take the collection file from postman_collections directory which is present in fleet_management directory, then import that json file directly into Postman.

## Create Database and Tables

- You will get all the queries for creating Database and Table in the masterDB file which is present in fleet_management directory.

## Install

    $ cd fleet_management
    $ npm install

## Running Node.js Application

    $ node app.js

## Responses

An invalid request is submitted, or some other error occurs, it returns a JSON response in the following format:

```json
{
  "message": string,
  "success": 0
}
```

If a request is successfully submitted, it returns a JSON response which can be two types of Json in the following format:

```json
{
  "message": string,
  "success": 1
}
```

```json
{
  "data": array,
  "success": 1
}
```

The `message` attribute contains a message commonly used to indicate errors or, in the case of successful or not.
The `success` attribute describes if the transaction was successful or not.
The `data` attribute contains data associated with the response.

## Usage

- All requests will be made to the Restful API and All the requests must include a content-type of application/json and the body must be valid JSON.

### 01 `POST` /register

API for adding new user: `http://localhost:7005/register`.
Request body:

```json
{
  "email": "niteshmittal001@gmail.com",
  "first_name": "Nitesh",
  "last_name": "Mittal",
  "phone_no": "9706323868",
  "password": "password",
  "driver_license": "MH1420110062821"
}
```

Response body:

```json
{
  "success": 1,
  "message": "User added successfully"
}
```

### 02 `POST` /login

API for login: `http://localhost:7005/login`
Request body:

```json
{
  "email": "niteshmittal001@gmail.com",
  "password": "password"
}
```

Response body:

```json
{
  "success": 1,
  "message": "Authentication successful!",
  "token": "eyJhbGciOiJIUzI1NiIsXVCJ9.eyJlbWFpbCI6Im5pdGV"
}
```

### 03 `GET` /getUserProfile

API for getting user information: `http://localhost:7005/fleetManagement/getUserProfile`, In header add a key `x-access-token` and value you will get from login API response as token

```json
{
  "success": 1,
  "data": {
    "user_id": "204e7440-bc66-11ea-bb57-a9d87fda8b91",
    "created_at": "2020-07-02T13:15:40.292Z",
    "driver_license": "MH1420110062821",
    "email": "niteshmittal001@gmail.com",
    "first_name": "Nitesh",
    "last_name": "Mittal",
    "phone_no": "9706323868",
    "status": 1,
    "updated_at": "2020-07-02T13:15:40.292Z"
  }
}
```

### 04 `PUT` /updateUserProfile

API for updating user profile: `http://localhost:7005/fleetManagement/updateUserProfile`, In header add a key `x-access-token` and x-access-token value you will get from login API response as token. User can update his/her first_name, last_name, phone_no, driver_license
Request body:

```json
{
  "first_name": "Nitesh Kumar",
  "last_name": "Mittal",
  "phone_no": "9706323868",
  "driver_license": "MH1420110062821"
}
```

Response body:

```json
{
  "success": 1,
  "message": "User profile updated successfully"
}
```

### 05 `POST` /createTrip

API for creating trip: `http://localhost:7005/fleetManagement/createTrip`, In header add a key `x-access-token` and x-access-token value you will get from login API response as token.
Request body:

```json
{
  "source_location": "Bangalore",
  "destination_location": "Kolkota",
  "start_date": "2020-07-03T01:40:40.895Z",
  "end_date": "2020-07-04T21:40:40.895Z",
  "purpose_of_visit": "Business trip"
}
```

Response body:

```json
{
  "success": 1,
  "message": "Trip added successfully"
}
```

### 06 `PUT` /updateTrip

API for updating trip: `http://localhost:7005/fleetManagement/updateTrip?trip_id={id}`, In header add a key `x-access-token` and value you will get from login API response as token.
Request body:

```json
{
  "source_location": "Bangalore",
  "destination_location": "Assam",
  "start_date": "2020-07-03T16:15:40.895Z",
  "end_date": "2020-07-04T21:21:40.895Z"
}
```

Response body:

```json
{
  "success": 1,
  "message": "Trip updated successfully"
}
```

### 07 `GET` /getTrips

API for getting all trips that is related to the user based on UPCOMING, ONGOING, PAST: `http://localhost:7005/fleetManagement/getTrips?trip_time=UPCOMING`, In header add a key `x-access-token` and value you will get from login API response as token
`trip_time` can be `UPCOMING, ONGOING, PAST`

query param: `trip_time`

Response body (If trip is present):

```json
{
  "success": 1,
  "message": [
    {
      "user_id": "204e7440-bc66-11ea-bb57-a9d87fda8b91",
      "id": "264458a0-bc8f-11ea-bb57-a9d87fda8b91",
      "created_at": "2020-07-02T18:09:19.658Z",
      "destination_location": "Assam",
      "end_date": "2020-07-04T21:21:40.895Z",
      "purpose_of_visit": "Business trip",
      "source_location": "Bangalore",
      "start_date": "2020-07-03T16:15:40.895Z",
      "status": 1,
      "updated_at": "2020-07-02T18:12:10.589Z"
    }
  ]
}
```

Response body (If trip is not present):

```json
{
  "success": 1,
  "data": []
}
```
