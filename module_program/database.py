import mysql.connector
from mysql.connector import pooling
import module_program.env_key as env


con ={
    'user':env.db_user,
    'password':env.db_password,
    'host':env.db_host,
    'database':env.db_name,
}
# 建立連接池
connection_pool = pooling.MySQLConnectionPool(pool_name='postgram',pool_size=5,**con)

def databaseConnect(execute_str,execute_argument=None):
	connection = connection_pool.get_connection()
	cursor = connection.cursor()
	try:
		cursor.execute("USE postgram")
		cursor.execute(execute_str,execute_argument)
		result = cursor.fetchall()
		connection.commit()
	except Exception as err:
		print(err)
		result = None
	finally:
		cursor.close()
		connection.close()
	return result
