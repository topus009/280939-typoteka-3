\connect typoteka

------------------------------ fill users table --------------------------------
BEGIN;
CREATE TEMP TABLE users_json (values TEXT)  ON COMMIT DROP;
\copy users_json FROM './mocks/users.json';

INSERT INTO users(id, name, avatar, avatar_small)
SELECT CAST(values->>'id' AS BIGINT) AS id,
       CAST(values->>'name' AS TEXT) AS name,
       CAST(values->>'avatar' AS TEXT) AS avatar,
       CAST(values->>'avatar_small' AS TEXT) AS avatar_small
FROM (SELECT json_array_elements(values::json) AS values FROM users_json) a;

SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM users));

COMMIT;
--------------------------------------------------------------------------------
------------------------------ fill articles table -----------------------------
BEGIN;
CREATE TEMP TABLE articles_json (values TEXT)  ON COMMIT DROP;
\copy articles_json FROM './mocks/articles.json';

INSERT INTO articles(id, title, created_date, announce, sentences, img)
SELECT CAST(values->>'id' AS BIGINT) AS id,
       CAST(values->>'title' AS TEXT) AS title,
       CAST(values->>'created_date' AS TEXT) AS created_date,
       CAST(values->>'announce' AS TEXT) AS announce,
       CAST(values->>'sentences' AS TEXT) AS sentences,
       CAST(values->>'img' AS TEXT) AS img
FROM (SELECT json_array_elements(values::json) AS values FROM articles_json) a;

SELECT setval('public.articles_id_seq', (SELECT MAX(id) FROM articles));

COMMIT;
--------------------------------------------------------------------------------
------------------------------ fill categories table ---------------------------
BEGIN;
CREATE TEMP TABLE categories_json (values TEXT)  ON COMMIT DROP;
\copy categories_json FROM './mocks/categories.json';

INSERT INTO categories(id, label)
SELECT CAST(values->>'id' AS BIGINT) AS id,
       CAST(values->>'label' AS TEXT) AS label
FROM (SELECT json_array_elements(values::json) AS values FROM categories_json) a;

SELECT setval('public.categories_id_seq', (SELECT MAX(id) FROM categories));

COMMIT;
--------------------------------------------------------------------------------
------------------------------ fill comments table -----------------------------
BEGIN;
CREATE TEMP TABLE comments_json (values TEXT)  ON COMMIT DROP;
\copy comments_json FROM './mocks/comments.json';

INSERT INTO comments(
  id,
  comment,
  user_id,
  article_id,
  created_date
)
SELECT
       CAST(values->>'id' AS BIGINT) AS id,
       CAST(values->>'comment' AS TEXT) AS comment,
       CAST(values->>'user_id' AS INTEGER) AS user_id,
       CAST(values->>'article_id' AS INTEGER) AS article_id,
       CAST(values->>'created_date' AS TEXT) AS created_date
FROM (SELECT json_array_elements(values::json) AS values FROM comments_json) a;

SELECT setval('public.comments_id_seq', (SELECT MAX(id) FROM comments));

COMMIT;
--------------------------------------------------------------------------------
------------------------------ fill article_category table -----------------------------
BEGIN;

CREATE TEMP TABLE articles_json (values TEXT);
CREATE TEMP TABLE temp_article_category(id INTEGER, categories TEXT);
\copy articles_json FROM './mocks/articles.json';

INSERT INTO temp_article_category(id, categories)
SELECT CAST(values->>'id' AS INTEGER),
       CAST(values->>'categories' AS TEXT)
FROM (SELECT json_array_elements(values::json) AS values FROM articles_json) a;

END;
DO LANGUAGE PLPGSQL $$
DECLARE
  maximum int;
  categoryCell text;
  arr int[];
  arrValue text;
BEGIN
  maximum := (SELECT COUNT(id) FROM temp_article_category);
   FOR counter IN 1..maximum LOOP
      categoryCell := (SELECT (categories) FROM temp_article_category WHERE id = counter);
      arr := string_to_array(btrim(categoryCell, '[]'), ',');
      FOREACH arrValue IN array arr LOOP
      INSERT INTO articles_categories(
        article_id,
        category_id
      ) values(counter, arrValue::int);
      END LOOP;
  END LOOP;
END $$;
--------------------------------------------------------------------------------
