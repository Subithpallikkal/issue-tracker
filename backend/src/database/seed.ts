import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { issues, discussions } from './schema';
import { IssueStatus, IssuePriority } from '../enums/issue.enum';

async function seed() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Subith@123@localhost:5432/issue_tracker';
  console.log('Connecting to:', connectionString);
  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  console.log('Seeding issues...');

  try {
    const insertedIssues = await db.insert(issues).values([
      {
        title: 'Network latency issues in US-East-1',
        description: 'Several users are reporting 500ms+ latency when accessing the platform from US-East-1 region. Initial traces suggest a bottleneck in the database connection pool.',
        status: IssueStatus.OPEN,
        priority: IssuePriority.URGENT,
      },
      {
        title: 'Fix broken footer links in documentation',
        description: 'The "Terms of Service" and "Privacy Policy" links in the documentation footer are currently pointing to a non-existent 404 page.',
        status: IssueStatus.IN_PROGRESS,
        priority: IssuePriority.LOW,
      },
      {
        title: 'Implement OAuth2 login with Google',
        description: 'Add Google OAuth2 support as a new login method. This involves registering the app in the Google Cloud Console and implementing the backend flow.',
        status: IssueStatus.OPEN,
        priority: IssuePriority.HIGH,
      },
      {
        title: 'Memory leak in image processing worker',
        description: 'The background worker responsible for resizing profile pictures seems to have a memory leak. Heap usage increases continuously over time until the container crashes.',
        status: IssueStatus.OPEN,
        priority: IssuePriority.HIGH,
      },
      {
        title: 'Upgrade dependencies to latest stable versions',
        description: 'A routine maintenance task to upgrade all project dependencies (NestJS, Next.js, Drizzle) to their latest stable versions for security and performance.',
        status: IssueStatus.RESOLVED,
        priority: IssuePriority.MEDIUM,
      },
      {
        title: 'Inconsistent button styling on mobile',
        description: 'The "Submit" button in the contact form is missing its gradient when viewed on iOS devices using Safari.',
        status: IssueStatus.OPEN,
        priority: IssuePriority.MEDIUM,
      },
    ]).returning();

    console.log(`Successfully seeded ${insertedIssues.length} issues.`);

    console.log('Seeding discussions...');

    const discussionsData = [
      {
        issueUid: insertedIssues[0].uid,
        content: 'I have started investigating the traces. It seems like the RDS instance is hitting CPU spikes.',
        author: 'Mark Thompson',
      },
      {
        issueUid: insertedIssues[0].uid,
        content: 'I noticed the same. I will increase the connection pool size to see if it helps.',
        author: 'Sarah Jenkins',
      },
      {
        issueUid: insertedIssues[0].uid,
        content: 'Pool size increased. Monitoring now.',
        author: 'Sarah Jenkins',
      },
      {
        issueUid: insertedIssues[2].uid,
        content: 'I already have the Google Cloud Console project ready. I can share the client IDs.',
        author: 'Alex Chen',
      },
      {
        issueUid: insertedIssues[3].uid,
        content: 'I suspect the sharp library is not releasing buffers correctly.',
        author: 'Mark Thompson',
      },
    ];

    await db.insert(discussions).values(discussionsData);

    console.log(`Successfully seeded ${discussionsData.length} discussion comments.`);
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await pool.end();
  }
}

seed();
