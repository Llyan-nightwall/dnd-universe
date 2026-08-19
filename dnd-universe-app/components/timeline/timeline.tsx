import Link from 'next/link';
import styles from './timeline.module.css';

export type TimelineEvent = {
  year: number;
  title: string;
  href: string;
};

type TimelineProps = {
  events: TimelineEvent[];
  className?: string;
};

export default function Timeline({
  events,
  className = '',
}: TimelineProps) {
  const sortedEvents = [...events].sort((a, b) => a.year - b.year);
  
  return (
    <ol className={`${styles.timeline} ${className}`}>
      {events.map((event, index) => (
        <li className={styles.item} key={`${event.year}-${event.href}-${index}`}>
          <div className={styles.year}>{event.year}</div>

          <div className={styles.marker} aria-hidden="true" />

          <div className={styles.content}>
            <Link className={styles.event} href={event.href}>
              {event.title}
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}