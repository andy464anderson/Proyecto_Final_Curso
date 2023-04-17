#importar los modulos necesarios para procesar los datos con pyspark
from pyspark.sql import SparkSession
from pyspark.sql.functions import *


#crear la sesion de spark
spark = SparkSession.builder.appName("gestionar_pelis").getOrCreate()

#leer dos ficheros csv
df1 = spark.read.csv("new_pelis.csv", header=True, inferSchema=True)
df2 = spark.read.csv("new_df.csv", header=True, inferSchema=True)