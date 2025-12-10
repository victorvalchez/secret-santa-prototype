CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: draw_state; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.draw_state (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_pin text DEFAULT '0000'::text NOT NULL,
    is_drawn boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    drawn_at timestamp with time zone
);


--
-- Name: participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    pin text NOT NULL,
    assigned_to uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: draw_state draw_state_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.draw_state
    ADD CONSTRAINT draw_state_pkey PRIMARY KEY (id);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: participants participants_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.participants(id);


--
-- Name: participants Anyone can delete participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can delete participants" ON public.participants FOR DELETE USING (true);


--
-- Name: draw_state Anyone can insert draw state; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert draw state" ON public.draw_state FOR INSERT WITH CHECK (true);


--
-- Name: participants Anyone can insert participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert participants" ON public.participants FOR INSERT WITH CHECK (true);


--
-- Name: draw_state Anyone can read draw state; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read draw state" ON public.draw_state FOR SELECT USING (true);


--
-- Name: participants Anyone can read participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can read participants" ON public.participants FOR SELECT USING (true);


--
-- Name: draw_state Anyone can update draw state; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update draw state" ON public.draw_state FOR UPDATE USING (true);


--
-- Name: participants Anyone can update participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can update participants" ON public.participants FOR UPDATE USING (true);


--
-- Name: draw_state; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.draw_state ENABLE ROW LEVEL SECURITY;

--
-- Name: participants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


