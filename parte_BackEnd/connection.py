import psycopg2

#creamos la funcion para conectarnos a la base de datos

def conectar():
    #creamos la conexion a la base de datos
    conn = psycopg2.connect(
        host="localhost",
        database="Usuarios",
        user="postgres",
        password="4646"
    )
    #devolvemos la conexion
    return conn