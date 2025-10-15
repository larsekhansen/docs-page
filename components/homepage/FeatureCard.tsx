import { Card } from '@digdir/designsystemet-react';
import Link from 'next/link';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export function FeatureCard({ title, description, href, icon }: FeatureCardProps) {
  return (
    <Card asChild className={styles.featureCard}>
      <Link href={href}>
        <Card.Block className={styles.cardContent}>
          {icon && (
            <div className={styles.iconWrapper}>
              <span className={styles.icon} aria-hidden="true">
                {icon}
              </span>
            </div>
          )}
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </Card.Block>
      </Link>
    </Card>
  );
}
