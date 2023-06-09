import psycopg2

#creamos la funcion para conectarnos a la base de datos

def conectar():
    #creamos la conexion a la base de datos
    conn = psycopg2.connect(
        host="dpg-ci0vmj9mbg5ffcgrgp1g-a.frankfurt-postgres.render.com",
        database="usuarios_3bbx",
        user="default",
        password="0quGIz37OzqNznc5nSTCvrWijLFoueZu",
        sslmode="require"
    )
    #devolvemos la conexion
    return conn