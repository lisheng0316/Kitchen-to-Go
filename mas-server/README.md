# MAS Server Application
[![N|Solid](http://yigitnot.com/wp-content/uploads/2016/02/node-js-logo.png)](https://nodesource.com/products/nsolid)

# Create User
### Definition
    POST https://api.kitchen2go.net/users
    
# Get User
### Definition
    GET https://api.kitchen2go.net/users/:id
    
# Create Cooker
### Definition
    POST https://api.kitchen2go.net/cookers/

# Get Cooker
### Definition
    GET https://api.kitchen2go.net/cookers/:id
    
# Create Session
### Definition
    POST https://api.kitchen2go.net/session/

# Delete Session
### Definition
    DELETE https://api.kitchen2go.net/session/

# Get Pass to create food
### Definition
    GET https://api.kitchen2go.net/pass/
    
# Create Food
### Definition
    POST https://api.kitchen2go.net/foods/

# Get Foods around area
### Definition
    GET https://api.kitchen2go.net/foods/?latitude=:latitude&longitude=:longitude&miles=:miles
    
# Get food
### Definition
    GET https://api.kitchen2go.net/food/?id=:id