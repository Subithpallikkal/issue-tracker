ALTER TABLE "issues" ALTER COLUMN "uid" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "uid" ADD GENERATED ALWAYS AS IDENTITY (sequence name "issues_uid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "discussions" ALTER COLUMN "uid" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "discussions" ALTER COLUMN "uid" ADD GENERATED ALWAYS AS IDENTITY (sequence name "discussions_uid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);