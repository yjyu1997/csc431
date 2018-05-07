--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.0

-- Started on 2018-03-20 15:42:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12924)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 4230 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 2 (class 3079 OID 19506)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 4231 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- table to relate multimedia table to the three layers below 
-- 

CREATE TABLE multimedia_to_layer (
    id integer NOT NULL,
    "link" character varying,
    "id_in_layer" integer NOT NULL, 
    "layer_name" character varying
);

ALTER TABLE multimedia_to_layer OWNER TO postgres; 

ALTER TABLE ONLY multimedia_to_layer
    ADD CONSTRAINT multimedia_to_layer PRIMARY KEY (id);

CREATE SEQUENCE multimedia_to_layer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE multimedia_to_layer_id_seq OWNER TO postgres;

ALTER SEQUENCE multimedia_to_layer_id_seq OWNED BY multimedia_to_layer.id;

--
-- TOC entry 213 (class 1259 OID 21015)
-- Name: construccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE construccion (
    id integer NOT NULL,
    geom geometry(Polygon,4326),
    "OBJECTID" integer,
    "CODIGO" character varying,
    "TERRENO_CODIGO" character varying,
    "TIPO_CONSTRUCCION" character varying,
    "TIPO_DOMINIO" character varying,
    "NUMERO_PISOS" integer,
    "NUMERO_SOTANOS" integer,
    "NUMERO_MEZANINES" integer,
    "NUMERO_SEMISOTANOS" integer,
    "ETIQUETA" character varying,
    "IDENTIFICADOR" character varying,
    "CODIGO_EDIFICACION" character varying,
    "CODIGO_ANTERIOR" character varying,
    "SHAPE.AREA" double precision,
    "SHAPE.LEN" double precision,
    wkt text
);


ALTER TABLE construccion OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 21013)
-- Name: construccion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE construccion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE construccion_id_seq OWNER TO postgres;

--
-- TOC entry 4232 (class 0 OID 0)
-- Dependencies: 212
-- Name: construccion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE construccion_id_seq OWNED BY construccion.id;


--
-- TOC entry 215 (class 1259 OID 21028)
-- Name: terreno; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE terreno (
    id integer NOT NULL,
    geom geometry(Polygon,4326),
    "OBJECTID" integer,
    "CODIGO" character varying,
    "CODIGO_ANTERIOR" character varying,
    "SHAPE.AREA" double precision,
    "SHAPE.LEN" double precision,
    wkt text
);


ALTER TABLE terreno OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 21026)
-- Name: terreno_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE terreno_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE terreno_id_seq OWNER TO postgres;

--
-- TOC entry 4233 (class 0 OID 0)
-- Dependencies: 214
-- Name: terreno_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE terreno_id_seq OWNED BY terreno.id;

--
-- TOC entry 217 (class 1259 OID 21082)
-- Name: workshop_20170210; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE workshop_20170210 (
    id integer NOT NULL,
    geom geometry(MultiPoint,4326),
    codigo character varying(20),
    fuente character varying(50),
    wkt text
);


ALTER TABLE workshop_20170210 OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 21080)
-- Name: workshop_20170210_id_0_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE workshop_20170210_id_0_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE workshop_20170210_id_0_seq OWNER TO postgres;

--
-- TOC entry 4200 (class 0 OID 0)
-- Dependencies: 216
-- Name: workshop_20170210_id_0_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE workshop_20170210_id_0_seq OWNED BY workshop_20170210.id;


--
-- TOC entry 4062 (class 2604 OID 21085)
-- Name: workshop_20170210 id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY workshop_20170210 ALTER COLUMN id SET DEFAULT nextval('workshop_20170210_id_0_seq'::regclass);


--
-- TOC entry 4084 (class 2604 OID 21018)
-- Name: construccion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY construccion ALTER COLUMN id SET DEFAULT nextval('construccion_id_seq'::regclass);


--
-- TOC entry 4085 (class 2604 OID 21031)
-- Name: terreno id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY terreno ALTER COLUMN id SET DEFAULT nextval('terreno_id_seq'::regclass);


--
-- TOC entry 4221 (class 0 OID 21015)
-- Dependencies: 213
-- Data for Name: construccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- TOC entry 4201 (class 0 OID 0)
-- Dependencies: 216
-- Name: workshop_20170210_id_0_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('workshop_20170210_id_0_seq', 223, true);


--
-- TOC entry 4065 (class 2606 OID 21087)
-- Name: workshop_20170210 workshop_20170210_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY workshop_20170210
    ADD CONSTRAINT workshop_20170210_pkey PRIMARY KEY (id);


--
-- TOC entry 4063 (class 1259 OID 21091)
-- Name: sidx_workshop_20170210_geom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sidx_workshop_20170210_geom ON workshop_20170210 USING gist (geom);

--
-- TOC entry 4234 (class 0 OID 0)
-- Dependencies: 212
-- Name: construccion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('construccion_id_seq', 2388, true);


--
-- TOC entry 4235 (class 0 OID 0)
-- Dependencies: 214
-- Name: terreno_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('terreno_id_seq', 1465, true);


--
-- TOC entry 4087 (class 2606 OID 21020)
-- Name: construccion construccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY construccion
    ADD CONSTRAINT construccion_pkey PRIMARY KEY (id);


--
-- TOC entry 4091 (class 2606 OID 21033)
-- Name: terreno terreno_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY terreno
    ADD CONSTRAINT terreno_pkey PRIMARY KEY (id);


--
-- TOC entry 4088 (class 1259 OID 21024)
-- Name: sidx_construccion_geom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sidx_construccion_geom ON construccion USING gist (geom);


--
-- TOC entry 4089 (class 1259 OID 21040)
-- Name: sidx_terreno_geom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sidx_terreno_geom ON terreno USING gist (geom);


-- Completed on 2018-03-20 15:42:14

--
-- PostgreSQL database dump complete
--

