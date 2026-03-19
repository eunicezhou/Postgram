import os
from dotenv import load_dotenv

load_dotenv()
app_key = os.getenv('APP_SECRET_KEY')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_host= os.getenv('DB_HOST')
db_name = os.getenv('DB_NAME')
token_key = os.getenv('TOKEN_KEY')
aws_access_key=os.getenv('IAM_ACCESS_KEY')
aws_secret_key=os.getenv('IAM_SECRET_ACCESS_KEY')
google_client_id = os.getenv('GOOGLE_CLIENT_ID')