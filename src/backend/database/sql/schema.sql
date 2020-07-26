--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

-- Started on 2020-07-19 21:13:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS typoteka;
--
-- TOC entry 2876 (class 1262 OID 19344)
-- Name: typoteka; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE typoteka WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';


ALTER DATABASE typoteka OWNER TO postgres;

\connect typoteka

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 19345)
-- Name: t_article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_article (
    id bigint NOT NULL,
    title character varying(50) NOT NULL,
    announce text NOT NULL,
    sentences text NOT NULL,
    img character varying(255),
    created_date character varying(255)
);


ALTER TABLE public.t_article OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 19351)
-- Name: t_article_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_article_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_article_id_seq OWNER TO postgres;

--
-- TOC entry 2878 (class 0 OID 0)
-- Dependencies: 205
-- Name: t_article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_article_id_seq OWNED BY public.t_article.id;


--
-- TOC entry 206 (class 1259 OID 19353)
-- Name: t_article_t_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_article_t_category (
    article_category_fk_article_id integer NOT NULL,
    article_category_fk_category_id integer NOT NULL
);


ALTER TABLE public.t_article_t_category OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 19356)
-- Name: t_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_category (
    id bigint NOT NULL,
    label character varying(255) NOT NULL
);


ALTER TABLE public.t_category OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 19359)
-- Name: t_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_category_id_seq OWNER TO postgres;

--
-- TOC entry 2879 (class 0 OID 0)
-- Dependencies: 208
-- Name: t_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_category_id_seq OWNED BY public.t_category.id;


--
-- TOC entry 209 (class 1259 OID 19361)
-- Name: t_comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_comment (
    id bigint NOT NULL,
    comment text NOT NULL,
    comment_fk_t_user_id integer,
    comment_fk_t_article_id integer,
    created_date character varying(255) NOT NULL
);


ALTER TABLE public.t_comment OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 19367)
-- Name: t_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_comment_id_seq OWNER TO postgres;

--
-- TOC entry 2880 (class 0 OID 0)
-- Dependencies: 210
-- Name: t_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_comment_id_seq OWNED BY public.t_comment.id;


--
-- TOC entry 211 (class 1259 OID 19369)
-- Name: t_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_user (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    avatar character varying(255),
    avatar_small character varying(255)
);


ALTER TABLE public.t_user OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 19375)
-- Name: t_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.t_user_id_seq OWNER TO postgres;

--
-- TOC entry 2881 (class 0 OID 0)
-- Dependencies: 212
-- Name: t_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_user_id_seq OWNED BY public.t_user.id;


--
-- TOC entry 2714 (class 2604 OID 19377)
-- Name: t_article id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_article ALTER COLUMN id SET DEFAULT nextval('public.t_article_id_seq'::regclass);


--
-- TOC entry 2715 (class 2604 OID 19378)
-- Name: t_category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_category ALTER COLUMN id SET DEFAULT nextval('public.t_category_id_seq'::regclass);


--
-- TOC entry 2716 (class 2604 OID 19379)
-- Name: t_comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_comment ALTER COLUMN id SET DEFAULT nextval('public.t_comment_id_seq'::regclass);


--
-- TOC entry 2717 (class 2604 OID 19380)
-- Name: t_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_user ALTER COLUMN id SET DEFAULT nextval('public.t_user_id_seq'::regclass);


--
-- TOC entry 2862 (class 0 OID 19345)
-- Dependencies: 204
-- Data for Name: t_article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_article (id, title, announce, sentences, img, created_date) FROM stdin;
\.


--
-- TOC entry 2864 (class 0 OID 19353)
-- Dependencies: 206
-- Data for Name: t_article_t_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_article_t_category (article_category_fk_article_id, article_category_fk_category_id) FROM stdin;
\.


--
-- TOC entry 2865 (class 0 OID 19356)
-- Dependencies: 207
-- Data for Name: t_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_category (id, label) FROM stdin;
\.


--
-- TOC entry 2867 (class 0 OID 19361)
-- Dependencies: 209
-- Data for Name: t_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_comment (id, comment, comment_fk_t_user_id, comment_fk_t_article_id, created_date) FROM stdin;
\.


--
-- TOC entry 2869 (class 0 OID 19369)
-- Dependencies: 211
-- Data for Name: t_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_user (id, name, avatar, avatar_small) FROM stdin;
\.


--
-- TOC entry 2882 (class 0 OID 0)
-- Dependencies: 205
-- Name: t_article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_article_id_seq', 2, true);


--
-- TOC entry 2883 (class 0 OID 0)
-- Dependencies: 208
-- Name: t_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_category_id_seq', 72, true);


--
-- TOC entry 2884 (class 0 OID 0)
-- Dependencies: 210
-- Name: t_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_comment_id_seq', 34, true);


--
-- TOC entry 2885 (class 0 OID 0)
-- Dependencies: 212
-- Name: t_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_user_id_seq', 66, true);


--
-- TOC entry 2723 (class 2606 OID 19382)
-- Name: t_article_t_category pk_article_id_category_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_article_t_category
    ADD CONSTRAINT pk_article_id_category_id PRIMARY KEY (article_category_fk_article_id, article_category_fk_category_id);


--
-- TOC entry 2719 (class 2606 OID 19384)
-- Name: t_article t_article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_article
    ADD CONSTRAINT t_article_pkey PRIMARY KEY (id);


--
-- TOC entry 2725 (class 2606 OID 19386)
-- Name: t_category t_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_category
    ADD CONSTRAINT t_category_pkey PRIMARY KEY (id);


--
-- TOC entry 2729 (class 2606 OID 19388)
-- Name: t_comment t_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_comment
    ADD CONSTRAINT t_comment_pkey PRIMARY KEY (id);


--
-- TOC entry 2731 (class 2606 OID 19390)
-- Name: t_user t_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_user
    ADD CONSTRAINT t_user_pkey PRIMARY KEY (id);


--
-- TOC entry 2720 (class 1259 OID 19391)
-- Name: fki_article_category_fk_article_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_article_category_fk_article_id ON public.t_article_t_category USING btree (article_category_fk_article_id);


--
-- TOC entry 2721 (class 1259 OID 19424)
-- Name: fki_article_category_fk_t_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_article_category_fk_t_category_id ON public.t_article_t_category USING btree (article_category_fk_category_id);


--
-- TOC entry 2726 (class 1259 OID 19392)
-- Name: fki_comment_fk_t_article_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_comment_fk_t_article_id ON public.t_comment USING btree (comment_fk_t_article_id);


--
-- TOC entry 2727 (class 1259 OID 19393)
-- Name: fki_comment_fk_t_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_comment_fk_t_user_id ON public.t_comment USING btree (comment_fk_t_user_id);


--
-- TOC entry 2732 (class 2606 OID 19414)
-- Name: t_article_t_category article_category_fk_t_article_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_article_t_category
    ADD CONSTRAINT article_category_fk_t_article_id FOREIGN KEY (article_category_fk_article_id) REFERENCES public.t_article(id) NOT VALID;


--
-- TOC entry 2733 (class 2606 OID 19419)
-- Name: t_article_t_category article_category_fk_t_category_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_article_t_category
    ADD CONSTRAINT article_category_fk_t_category_id FOREIGN KEY (article_category_fk_category_id) REFERENCES public.t_category(id) NOT VALID;


--
-- TOC entry 2734 (class 2606 OID 19404)
-- Name: t_comment comment_fk_t_article_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_comment
    ADD CONSTRAINT comment_fk_t_article_id FOREIGN KEY (comment_fk_t_article_id) REFERENCES public.t_article(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 2735 (class 2606 OID 19409)
-- Name: t_comment comment_fk_t_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_comment
    ADD CONSTRAINT comment_fk_t_user_id FOREIGN KEY (comment_fk_t_user_id) REFERENCES public.t_user(id) ON UPDATE CASCADE ON DELETE RESTRICT NOT VALID;


--
-- TOC entry 2877 (class 0 OID 0)
-- Dependencies: 2876
-- Name: DATABASE typoteka; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE typoteka FROM PUBLIC;


-- Completed on 2020-07-19 21:13:10

--
-- PostgreSQL database dump complete
--
