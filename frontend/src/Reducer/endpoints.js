/*POST    : api/user/register
	body : exemple :
	{   
    	"name":"username",
    	"email": "test@gmail.com",
    	"password": "abe121212t"
	}

	returns : user id
	{
    	"user": "608ac128f495ce38fc88a15f"
	}



POST	: /api/user/login
	body : exemple :
	{   
    	"name":"username",
    	"email": "test@gmail.com",
    	"password": "abe121212t"
	}

	assigns 'auth-token' to the header sends back token :

	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDhhZDMxNDQ3NTdkODNkYjQxN2EzOTAiLCJpYXQiOjE2MTk3MTA3NTB9.icN87CJxmfhiRngFg64Asa8IphyRg9zPPoMpPAbRlPE

GET		: /api/private/
	returns  :
	{
    	"_id": "607c96eb58c8761414733bbd",
    	"iat": 1618780519
	}*/

   export const register="http://localhost:5000/api/user/register";
   export const login="http://localhost:5000/api/user/login";
   