COPY construccion (id, geom, "OBJECTID", "CODIGO", "TERRENO_CODIGO", "TIPO_CONSTRUCCION", "TIPO_DOMINIO", "NUMERO_PISOS", "NUMERO_SOTANOS", "NUMERO_MEZANINES", "NUMERO_SEMISOTANOS", "ETIQUETA", "IDENTIFICADOR", "CODIGO_EDIFICACION", "CODIGO_ANTERIOR", "SHAPE.AREA", "SHAPE.LEN", wkt) FROM '/Users/Jerry/Documents/csc431/sample_database/database/construccion.data';

COPY terreno (id, geom, "OBJECTID", "CODIGO", "CODIGO_ANTERIOR", "SHAPE.AREA", "SHAPE.LEN", wkt) FROM '/Users/Jerry/Documents/csc431/sample_database/database/terreno.data';

COPY workshop_20170210 (id, geom, codigo, fuente, wkt) FROM '/Users/Jerry/Documents/csc431/sample_database/database/workshop_20170210.data';

COPY multimedia_to_layer(id, "link", "id_in_layer", "layer_name") FROM 
'/Users/Jerry/Documents/csc431/sample_database/database/multimedia_to_layer.data';

