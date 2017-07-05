NEW USER REGISTER:

/v1/users/signup - POST

Expect:
- JSON {"Username" string, "Password" string, "Name" string, "Email" string, "Age" int}


Response:
- if successful: 201 Created + JSON User {"UserID" string, "Username" string, "Email" string, "Name" string, "Age" int, "DateCreated" time}

- else if bad Username: 400 BadRequest + JSON ErrorResponse {"Message":"SignUp Failed", "Resource":"user", "Field":"username", "Code":"already_exist"}

- else if bad Email: 400 BadRequest + JSON ErrorResponse {"Message":"SignUp Failed", "Resource":"user", "Field":"email", "Code":"already_exist"}

- else if unexpected server error: 500 Internal Server Error + JSON ErrorResponse {"Message":"SignUp Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

----------------------------------------------------------------------------------------------------------------
USER LOGIN:

/v1/users/login - POST

Expect:
- JSON {"Username" string, "Password" string}

Response:
- if successful: 200 OK + JSON Session {"SessionID" string, "UserID" string, "Expires" time}

- else if Already logged in: 400 Bad Request + JSON ErrorResponse {"Message":"Login Failed", "Resource":"user", "Field":"user_status", "Code":"already_logged_in"}

- else if Username don't exist: 404 NotFound + JSON ErrorResponse {"Message":"Login Failed", "Resource":"user", "Field":"username", "Code":"username_does_not_exist"}

- else if wrong Password: 401 Unauthorized + JSON ErrorResponse {"Message":"Login Failed", "Resource":"user", "Field":"password", "Code":"wrong_password"}

- else if unexpected server error: 500 Internal Server Error + JSON ErrorResponse {"Message":"Login Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

-------------------------------------------------------------------------------------------------------------------
USER LOGOUT:

/v1/users/logout - POST

Expect: 
- User to be logged in. Expect nothing in the POST request body.

Response:
- if successful: 200 OK

- else if Already logged out: 400 Bad Request + JSON ErrorResponse {"Message":"Logout Failed", "Resource":"user", "Field":"user_status", "Code":"already_logged_out"}

- else if unexpected server error: 500 Internal Server Error + JSON ErrorResponse {"Message":"Logout Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

----------------------------------------------------------------------------------------------------------------------
GET USER ACCOUNTS:

/v1/users/me/accounts - GET

Expect:
- User to be logged in. Expect nothing else than an empty GET request to this URL.

Response:
- if authorized and successful: 200 OK  + JSON Session + JSON Account(s){"AccountID" string, "UserID" string, "Currency" string, "Amount" float64, "Type" string}

- else if unauthorized: 401 Unauthorized + JSON ErrorResponse {"Message":"Authorization Failed", "Resource":"account", "Field":"account_authorization", "Code":"unauthorized"}

- else if unexpected server error: 500 Internal Server Error + JSON ErrorResponse {"Message":"Fetch User Accounts Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

-------------------------------------------------------------------------------------------------------------------------
NEW USER ACCOUNT:

/v1/users/me/new-account - POST

Expect:
- User to be logged in + JSON {"Currency" string, "Amount" float64, "Type" string}

Response:
- if authorized and successful: 201 Created + JSON Session

- else if unauthorized: 401 Unauthorized + JSON ErrorResponse {"Message":"Authorization Failed", "Resource":"account", "Field":"account_authorization", "Code":"unauthorized"}

- else if User Account already exists: 500 Internal Server Error + JSON ErrorResponse {"Message":"Create User Account Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

- else if unexpected server error: 500 Internal Server Error + JSON ErrorResponse {"Message":"Create User Account Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

----------------------------------------------------------------------------------------------------------------------------
DELETE USER ACCOUNT:

/v1/users/me/delete-account?id="AccountID" - DELETE

Expect:
- User to be logged in + URL Parameter ?id="AccountID" (example: .../v3/users/me/delete-account?id=12345)

Response:
- if authorized and successful: 200 OK + JSON Session

- else if unauthorized: 401 Unauthorized + JSON ErrorResponse {"Message":"Authorization Failed", "Resource":"account", "Field":"account_authorization", "Code":"unauthorized"}

- else if there are no URL parameters: 400 Bad Request + JSON ErrorResponse {"Message":"Delete User Account Failed", "Resource":"request", "Field":"URL_parameters","Code":"need_accountID_to_be_specified_in_URL"}

- else if User Account doesn't exists: 500 Internal Server Error + JSON ErrorResponse {"Message":"Delete User Account Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

- else if unexpected server error: 500 Internal Server Error + JSON ErrorResponse {"Message":"Delete User Account Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

-----------------------------------------------------------------------------------------------------------------------------
DEPOSIT:

/v1/users/me/deposit - POST

Expect:
- User to be logged in + JSON {"AccountID" string, "Amount" float64}

Response:
- if authorized and successful: 200 OK + JSON Session

- else if unauthorized: 401 Unauthorized + JSON ErrorResponse {"Message":"Authorization Failed", "Resource":"account", "Field":"account_authorization", "Code":"unauthorized"}

- else if unexpected server error: 500 Internal Server Error + JSON ErrorResponse {"Message":"User Account Deposit Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

------------------------------------------------------------------------------------------------------------------------------
WITHDRAW:

/v1/users/me/withdraw - POST

Expect:
- User to be logged in + JSON {"AccountID" string, "Amount" float64}

Response:
- if authorized and successful: 200 OK + JSON Session

- else if unauthorized: 401 Unauthorized + JSON ErrorResponse {"Message":"Authorization Failed", "Resource":"account", "Field":"account_authorization", "Code":"unauthorized"}

- else if User try to withdraw more than have: 400 Bad Request + JSON ErrorResponse {"Message":"User Account Withdraw Failed", "Resource":"account", "Field":"money_availability", "Code":"not_enough_available"}

- else if unexpected server error: 500 Internal Server Error + JSON ErrorResponse {"Message":"User Account Withdraw Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

-------------------------------------------------------------------------------------------------------------------------------
HISTORY:

/v1/users/me/account-history - POST

Expect:
- User to be logged in + JSON {"AccountID" string}

Response:
- if authorized and successful: 200 OK + JSON Session + JSON History {"AccountID" string, "UserID" string, "TransactionType" string, "Currency" string, "Amount" float64, "Date" time}

- else if unauthorized: 401 Unauthorized + JSON ErrorResponse {"Message":"Authorization Failed", "Resource":"account", "Field":"account_authorization", "Code":"unauthorized"}

- else if logged in and authorized, but requests another users's Account History: 401 Unauthorized + JSON ErrorResponse {"Message":"Fetch User Account History Failed", "Resource":"account", "Field":"account_authorization", "Code":"unauthorized_to_see_this_account_history"}

- else if unexpected server error: 500 Internal Server Error + JSON ErrorResponse {"Message":"Fetch User Account History Failed", "Resource":"error", "Field":"unexpected_error", "Code": THE ERROR BODY}

-------------------------------------------------------------------------------------------------------------------------------
HISTORY:

/v1/users/me/accounts/:accountID - GET

Expect:
- User to be logged in

Response:
- if authorized and successful: 200 OK + JSON Session + JSON Account {"AccountID" string, "UserID" string, "Currency" string, "Amount" string, "Type" string}

- else if unauthorized: 401 Unauthorized + JSON ErrorResponse {"Message":"Authorization Failed", "Resource":"account", "Field":"account_authorization", "Code":"unauthorized"}

- else if logged in and authorized, but requests another users's Account Details: 404 Unauthorized + JSON ErrorResponse {"Message":"Fetch Account Details Failed", "Resource":"account", "Field":"error", "Code":"fetch_account_details_error"}
