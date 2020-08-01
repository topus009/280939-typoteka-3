--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

-- Started on 2020-07-29 04:07:04

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

DROP DATABASE if exists typoteka;
--
-- TOC entry 2866 (class 1262 OID 31288)
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
-- TOC entry 207 (class 1259 OID 31378)
-- Name: articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articles (
    id integer NOT NULL,
    title text NOT NULL,
    created_date text NOT NULL,
    announce text NOT NULL,
    sentences text,
    img text
);


ALTER TABLE public.articles OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 31426)
-- Name: articles_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articles_categories (
    article_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.articles_categories OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 31376)
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_id_seq OWNER TO postgres;

--
-- TOC entry 2867 (class 0 OID 0)
-- Dependencies: 206
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- TOC entry 209 (class 1259 OID 31394)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    label text NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 31392)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 2868 (class 0 OID 0)
-- Dependencies: 208
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 211 (class 1259 OID 31407)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    comment text NOT NULL,
    user_id integer NOT NULL,
    article_id integer NOT NULL,
    created_date text NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 31405)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO postgres;

--
-- TOC entry 2869 (class 0 OID 0)
-- Dependencies: 210
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 205 (class 1259 OID 31367)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    avatar text,
    avatar_small text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 31365)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2870 (class 0 OID 0)
-- Dependencies: 204
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2716 (class 2604 OID 31381)
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- TOC entry 2717 (class 2604 OID 31397)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 2718 (class 2604 OID 31410)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 2715 (class 2604 OID 31370)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2730 (class 2606 OID 31430)
-- Name: articles_categories articles_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles_categories
    ADD CONSTRAINT articles_categories_pkey PRIMARY KEY (article_id, category_id);


--
-- TOC entry 2722 (class 2606 OID 31386)
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- TOC entry 2724 (class 2606 OID 31404)
-- Name: categories categories_label_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_label_key UNIQUE (label);


--
-- TOC entry 2726 (class 2606 OID 31402)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2728 (class 2606 OID 31415)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 2720 (class 2606 OID 31375)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2733 (class 2606 OID 31431)
-- Name: articles_categories articles_categories_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles_categories
    ADD CONSTRAINT articles_categories_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2734 (class 2606 OID 31436)
-- Name: articles_categories articles_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles_categories
    ADD CONSTRAINT articles_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2732 (class 2606 OID 31421)
-- Name: comments comments_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2731 (class 2606 OID 31416)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2020-07-29 04:07:04

--
-- PostgreSQL database dump complete
--
