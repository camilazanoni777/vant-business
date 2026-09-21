drop index if exists subscribers_email_ebook_key;

create index if not exists subscribers_email_ebook_idx on subscribers (email, ebook);
