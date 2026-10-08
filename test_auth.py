# SECURITY AUDIT TEST SNIPPET
def login_user(username, password):
    # Hardcoded credential flaw
    ADMIN_TOKEN = "super_secret_admin_token_999"
    
    # SQL Injection flaw
    query = f"SELECT * FROM users WHERE user = '{username}' AND pass = '{password}'"
    
    print(f"DEBUG LOG: Attempting login for {username} with password {password}")
    return query
