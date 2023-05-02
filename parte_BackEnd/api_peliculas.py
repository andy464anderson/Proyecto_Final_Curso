#creamos una api utilizando fastAPI
#utilizamos el spark session para leer el archivo csv

#Importamos las librerias necesarias
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.responses import FileResponse
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when
from pyspark.sql.types import *
from fastapi.responses import JSONResponse
from pyspark.sql.types import *
from pyspark.sql.functions import *
from typing import List
import ast
import json


# creamos la clase Pelicula
class Pelicula(BaseModel):
    id: int
    adult: bool
    imdb_id: str
    title: str
    overview: str
    release_date: str
    runtime: str
    cast: str
    crew: str
    keywords: str
    poster: str
    genres: str

# creamos la sesión de Spark
spark = SparkSession.builder.appName("Peliculas").getOrCreate()

# leemos el archivo csv
df = spark.read.csv("lista_Pelis.csv", header=True, inferSchema=True)

#filtrar los genres que no sean nulos y son array validos
df = df.filter(df['genres'].cast('string').isNotNull())

# filtramos las filas que corresponden a Pelicula
peliculas_df = df.filter(df['overview'].cast('string').isNotNull())

# convertimos el dataframe a una lista de diccionarios
lista = [Pelicula(**row.asDict()) for row in peliculas_df.collect()]






#creamos la api
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




#creamos la ruta para acceder a la api
@app.get("/")
async def read_main():
    return JSONResponse(content={"message": "Bienvenido a la api de peliculas"})


@app.get("/peliculas")
async def get_peliculas():
    #las peliculas se devuelven en formato json
    return lista


#creamos la ruta para acceder a una pelicula en concreto
@app.get("/peliculas/{id}")
async def get_pelicula(id: int):

    #filtramos el dataframe por el id de la pelicula
    df2 = peliculas_df.filter(df['id'] == id)

    df2 = df2.filter(df['overview'].cast('string').isNotNull())

    #convertimos el dataframe a una lista de diccionarios
    lista = [Pelicula(**row.asDict()) for row in df2.collect()]

    #devolvemos la pelicula en formato json
    return lista




#creamos la ruta para acceder a las peliculas de un genero en concreto
@app.get("/peliculas/genero/{genero}")
async def get_peliculas_genero(genero: str):
    #filtramos el dataframe por el genero de la pelicula pero el genero es una lista
    #por lo que tenemos que filtrar por cada elemento de la lista y covertir en mayusculas
    df2 = df.filter(when(col("genres").contains(genero.title()), True).otherwise(False))
    df2 = df2.filter(df['overview'].cast('string').isNotNull())
    #convertimos el dataframe a una lista de diccionarios
    lista = [Pelicula(**row.asDict()) for row in df2.collect()]

    #devolvemos las peliculas en formato json
    return lista


#creamos la ruta para acceder a las peliculas de un año en concreto
@app.get("/peliculas/fecha/{fecha}")
async def get_peliculas_fecha(fecha: str):
    #filtramos el dataframe por el año de la pelicula
    df2 = df.filter(df.release_date == fecha)
    #devolvemos las peliculas en formato json
    return df2.toJSON().collect()


#-------------------------------------------------------------------------------
# creamos al api para los usuarios

# creamos la clase Usuario
class Usuario(BaseModel):
    id: int
    correo: str
    clave: str
    rol: str
    nombre_usuario: str
    nombre_completo: str


from connection import conectar

@app.get("/usuarios")
async def get_usuarios():
    #creamos la conexion a la base de datos
    conn = conectar()
    #creamos el cursor
    cursor = conn.cursor()
    #ejecutamos la consulta
    cursor.execute("SELECT * FROM usuario")
    #obtenemos los resultados
    usuarios = cursor.fetchall()
    #cerramos la conexion
    conn.close()
    cursor.close()
    #convertimos los resultados en una lista de diccionarios
    lista_usuarios = []
    for usuario in usuarios:
        lista_usuarios.append({
            "id": usuario[0],
            "correo": usuario[1],
            "clave": usuario[2],
            "rol": usuario[3],
            "nombre_usuario": usuario[4],
            "nombre_completo": usuario[5]
        })

    #devolvemos los usuarios en formato json
    return lista_usuarios


@app.get("/usuario/{id}")
async def get_usuario(id):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuario WHERE id = %s", (id,))
    usuario = cursor.fetchone()
    conn.close()
    cursor.close()
    lista_usuarios={
            "id": usuario[0],
            "correo": usuario[1],
            "clave": usuario[2],
            "rol": usuario[3],
            "nombre_usuario": usuario[4],
            "nombre_completo": usuario[5]
        }

    return lista_usuarios

@app.get("/usuario/correo/{correo}/{clave}")
async def get_usuario(correo:str,clave:str):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuario WHERE correo = %s and clave = %s", (correo,clave))
    usuario = cursor.fetchone()

    if cursor.rowcount == 0:
        return {"error": "Usuario no encontrado"}

    conn.close()
    cursor.close()
    lista_usuarios={
            "id": usuario[0],
            "correo": usuario[1],
            "clave": usuario[2],
            "rol": usuario[3],
            "nombre_usuario": usuario[4],
            "nombre_completo": usuario[5]
        }

    return lista_usuarios

@app.post("/usuario")
async def post_usuario(usuario: Usuario):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO usuario (correo, nombre_completo, nombre_usuario, clave, rol) VALUES (%s, %s, %s, %s, %s, %s)", (usuario.correo, usuario.nombre_completo, usuario.nombre_usuario, usuario.clave, usuario.rol))
    conn.commit()
    conn.close()
    cursor.close()
    if cursor.rowcount == 1:
        return JSONResponse(content={"message": "Usuario creado"})
    else:
        return JSONResponse(content={"message": "Error al crear el usuario"})



@app.put("/usuario/{id}")
async def put_usuario(id: int, usuario: Usuario):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("UPDATE usuario SET correo = %s, nombre_completo = %s, nombre_usuario = %s, clave = %s, rol = %s WHERE id = %s", (usuario.correo, usuario.nombre_completo, usuario.nombre_usuario, usuario.clave, usuario.rol))
    conn.commit()
    conn.close()
    cursor.close()
    return usuario


@app.delete("/usuario/{id}")
async def delete_usuario(id: int):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuario WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    cursor.close()
    return {"message": "Usuario eliminado"}


#--------------------------------------------------------------------------------
# creamos la api para los seguidores

# creamos la clase Seguidor
class Seguidor(BaseModel):
    id_seguidor: int
    id_usuario_seguidor: int
    id_usuario_seguido: int

# creamos la api para los seguidores
@app.get("/seguidores")
async def get_seguidores():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM seguidor")
    seguidores = cursor.fetchall()
    conn.close()
    cursor.close()
    lista_seguidores = []
    for seguidor in seguidores:
        lista_seguidores.append({
            "id_seguidor": seguidor[0],
            "id_usuario_seguidor": seguidor[1],
            "id_usuario_seguido": seguidor[2]
        })

    return lista_seguidores


#traemos los seguidores de un usuario
@app.get("/seguidor/{id}")
async def get_seguidor(id):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM seguidor WHERE id_usuario_seguido = %s", (id,))
    seguidores = cursor.fetchall()
    conn.close()
    cursor.close()
    lista_seguidores = []
    for seguidor in seguidores:
        lista_seguidores.append({
            "id_seguidor": seguidor[0],
            "id_usuario_seguidor": seguidor[1],
            "id_usuario_seguido": seguidor[2]
        })

    return lista_seguidores

#insertamos un seguidor
@app.post("/seguidor")
async def post_seguidor(seguidor: Seguidor):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO seguidor (id_usuario_seguidor, id_usuario_seguido) VALUES (%s, %s)", (seguidor.id_usuario_seguidor, seguidor.id_usuario_seguido))
    conn.commit()
    conn.close()
    cursor.close()
    return seguidor


#eliminamos un seguidor
@app.delete("/seguidor/{id_usuario_seguido}/{id_usuario_seguidor}}")
async def delete_seguidor(id_usuario_seguidor: int, id_usuario_seguido: int):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM seguidor WHERE id_usuario_seguidor = %s and id_usuario_seguido = %s", (id_usuario_seguidor,id_usuario_seguido))
    conn.commit()
    conn.close()
    cursor.close()
    return {"message": "Seguidor eliminado"}

from datetime import date

#--------------------------------------------------------------------------------
# creamos la api para los reviews

# creamos la clase Review
class Review(BaseModel):
    id: int
    id_usuario: int
    id_pelicula: int
    contenido: str
    valoracion: int
    fecha: date

#traemos todos los reviews
@app.get("/reviews")
async def get_reviews():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM review")
    reviews = cursor.fetchall()
    conn.close()
    cursor.close()
    lista_reviews = []
    for review in reviews:
        lista_reviews.append({
            "id": review[0],
            "id_usuario": review[1],
            "id_pelicula": review[2],
            "contenido": review[3],
            "valoracion": review[4],
            "fecha": review[5]
        })

    return lista_reviews

#traemos los reviews de una pelicula
@app.get("/review/{id}")
async def get_review(id):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM review WHERE id_pelicula = %s", (id,))
    review = cursor.fetchone()
    conn.close()
    cursor.close()
    lista_reviews={
            "id": review[0],
            "id_usuario": review[1],
            "id_pelicula": review[2],
            "contenido": review[3],
            "valoracion": review[4],
            "fecha": review[5]
        }

    return lista_reviews


#creamos un review
@app.post("/review")
async def post_review(review: Review):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO review (id_usuario, id_pelicula, contenido, valoracion, fecha) VALUES (%s, %s, %s, %s, %s)", (review.id_usuario, review.id_pelicula, review.contenido, review.valoracion, review.fecha))
    conn.commit()
    conn.close()
    cursor.close()
    return review

#actualizamos un review
@app.put("/review/{id}")
async def put_review(id: int, review: Review):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("UPDATE review SET id_usuario = %s, id_pelicula = %s, contenido = %s, valoracion = %s, fecha = %s WHERE id = %s", (review.id_usuario, review.id_pelicula, review.contenido, review.valoracion, review.fecha, id))
    conn.commit()
    conn.close()
    cursor.close()
    return review

#eliminamos un review
@app.delete("/review/{id}")
async def delete_review(id: int):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM review WHERE id = %s", (id,))
    conn.commit()
    conn.close()
    cursor.close()
    return {"message": "Review eliminado"}

#--------------------------------------------------------------------------------
# creamos la api para los listas

# creamos la clase Lista
class Lista(BaseModel):
    id: int
    nombre_lista: str
    tipo: str
    usuario_id: int
    publica: bool
    peliculas: List[Pelicula]

#traemos todos los listas
@app.get("/listas")
async def get_listas():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM lista")
    listas = cursor.fetchall()
    conn.close()
    cursor.close()
    lista_listas = []
    for lista in listas:
        lista_listas.append({
            "id": lista[0],
            "nombre_lista": lista[1],
            "tipo": lista[2],
            "usuario_id": lista[3],
            "publica": lista[4],
            "peliculas": lista[5]
        })

    return lista_listas
