## Biger Authentication Service
This authentication service built by using Node.js Runtime with Express.js. To use this service just do the following steps.

### Register
> URL : https://capstone-ch2-ps514.et.r.appspot.com/api/v1/register

- Method

  /POST
- Request Body
  
  > **`username`** as `string`
  > 
  > **`email`** as `string`, must be globally unique, one email for one account
  > 
  > **`password`** as `string`, make sure to create a strong password

- Response

  ```json
  {
    "message": "account created",
    "error": false,
    "store": {
        "_writeTime": {
            "_seconds": 1701160318,
            "_nanoseconds": 47885000
        }
    }
  }
  ```
  Register data stored properly if the **`error`** belong to `false` and the **`store`** key exists.
  If **`error`** occurs, just tell user to try again register for a few minutes later.

### Login
> URL : https://capstone-ch2-ps514.et.r.appspot.com/api/v1/login

- Method

  /POST
- Request Body
  
  > **`email`** as `string`
  >
  > **`password`** as `string`
- Response 

  ```json
  {
    "success": true,
    "message": "login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlcGxveWVkQGFwcGVuZ2luZS5jby5pZCIsImlhdCI6MTcwMTE3NDY1NX0.4UKiIQn54kIH8vuHWPj3bvsmR9mO8ReyAUbHKQp-1og"
  }
  ```

  If **`email`** and **`password`** matches users collection database, the response always send **`token`** filled with value. But, if user data doesn't match users collection database, the **`success`** always `false` and return null **`token`** value.

### Logout
> URL : AVAILABLE SOON

This feature may available soon, the **Logout** feature will delete user token from database and change user **`logged`** status to `false`. This is the best way to prevent user using same account in multiple devices.