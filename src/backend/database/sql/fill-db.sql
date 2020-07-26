\connect typoteka

------------------------------ fill users table --------------------------------
BEGIN;
CREATE TEMP TABLE users_json (values TEXT)  ON COMMIT DROP;
\copy users_json FROM './mocks/users.json';

INSERT INTO t_user(id, name, avatar, avatar_small)
SELECT CAST(values->>'id' AS BIGINT) AS id,
       CAST(values->>'name' AS CHARACTER VARYING) AS name,
       CAST(values->>'avatar' AS CHARACTER VARYING) AS avatar,
       CAST(values->>'avatarSmall' AS CHARACTER VARYING) AS avatar_small
FROM (SELECT json_array_elements(values::json) AS values FROM users_json) a;
COMMIT;
--------------------------------------------------------------------------------
------------------------------ fill articles table -----------------------------
BEGIN;
CREATE TEMP TABLE articles_json (values TEXT)  ON COMMIT DROP;
\copy articles_json FROM './mocks/articles.json';

INSERT INTO t_article(id, title, created_date, announce, sentences, img)
SELECT CAST(values->>'id' AS BIGINT) AS id,
       CAST(values->>'title' AS CHARACTER VARYING) AS title,
       CAST(values->>'createdDate' AS CHARACTER VARYING) AS created_date,
       CAST(values->>'announce' AS CHARACTER VARYING) AS announce,
       CAST(values->>'sentences' AS CHARACTER VARYING) AS sentences,
       CAST(values->>'img' AS CHARACTER VARYING) AS img
FROM (SELECT json_array_elements(values::json) AS values FROM articles_json) a;
COMMIT;
--------------------------------------------------------------------------------
------------------------------ fill categories table ---------------------------
BEGIN;
CREATE TEMP TABLE categories_json (values TEXT)  ON COMMIT DROP;
\copy categories_json FROM './mocks/categories.json';

INSERT INTO t_category(id, label)
SELECT CAST(values->>'id' AS BIGINT) AS id,
       CAST(values->>'label' AS CHARACTER VARYING) AS label
FROM (SELECT json_array_elements(values::json) AS values FROM categories_json) a;
COMMIT;
--------------------------------------------------------------------------------
------------------------------ fill comments table -----------------------------
BEGIN;
CREATE TEMP TABLE comments_json (values TEXT)  ON COMMIT DROP;
\copy comments_json FROM './mocks/comments.json';

INSERT INTO t_comment(
  id,
  comment,
  comment_fk_t_user_id,
  comment_fk_t_article_id,
  created_date
)
SELECT
       CAST(values->>'id' AS BIGINT) AS id,
       CAST(values->>'comment' AS TEXT) AS comment,
       CAST(values->>'userId' AS INTEGER) AS comment_fk_t_user_id,
       CAST(values->>'articleId' AS INTEGER) AS comment_fk_t_article_id,
       CAST(values->>'createdDate' AS CHARACTER VARYING) AS created_date
FROM (SELECT json_array_elements(values::json) AS values FROM comments_json) a;
COMMIT;
--------------------------------------------------------------------------------
------------------------------ fill article_category table -----------------------------
BEGIN;

CREATE TEMP TABLE articles_json (values TEXT);
CREATE TEMP TABLE article_category(id INTEGER, categories TEXT);
\copy articles_json FROM './mocks/articles.json';

INSERT INTO article_category(id, categories)
SELECT CAST(values->>'id' AS INTEGER),
       CAST(values->>'categories' AS TEXT)
FROM (SELECT json_array_elements(values::json) AS values FROM articles_json) a;

END;
DO LANGUAGE PLPGSQL $$
DECLARE
  maximum int;
  categoryCell text;
  arr int[];
  arrValue CHARACTER VARYING;
BEGIN
  maximum := (SELECT COUNT(id) FROM article_category);
   FOR counter IN 1..maximum LOOP
      categoryCell := (SELECT (categories) FROM article_category WHERE id = counter);
      arr := string_to_array(btrim(categoryCell, '[]'), ',');
      FOREACH arrValue IN array arr LOOP
      INSERT INTO t_article_t_category(
        article_category_fk_article_id,
        article_category_fk_category_id
      ) values(counter, arrValue::int);
      END LOOP;
  END LOOP;
END $$;
--------------------------------------------------------------------------------
