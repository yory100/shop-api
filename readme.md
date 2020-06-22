Base url 
  # http://localhost:1950/apiv1


Routes
  # /users/login POST
  no token
    username - sbtech, hard-coded username - mandatory
    password - password123, hardcoded password - mandatory

  # /products GET
  works both with token and no token - applies Vat service, when token provided.

  # /products POST
  needs token
    name and category mandatory
    price optional
  
  # /products/:id PUT
  needs token
    name, category or price - at least on

  # /products/:id DELETE
  needs token

  # /orders GET
  needs token

  # /orders POST
  needs token
    status - Pending, Processing, Delivered or Cancelled - mandatory
    products array of products id - mandatory
  
  # /orders/:id PUT
  needs token
