import { Button, Card } from '@digdir/designsystemet-react';
import Link from 'next/link';
import { ProductSection } from '@/types/product';
import styles from './NavigationCard.module.css';

interface NavigationCardProps {
  section: ProductSection;
}

export function NavigationCard({ section }: NavigationCardProps) {
  const cardClassName = `${styles.navigationCard} ${
    section.highlighted ? styles.highlighted : ''
  }`;

  return (
    <Card asChild className={cardClassName}>
      <Link href={section.url}>
        <Card.Block className={styles.cardHeader}>
          {section.icon && (
            <span className={styles.icon} aria-hidden="true">
              {getIconForType(section.icon)}
            </span>
          )}
          <h3 className={styles.title}>{section.title}</h3>
        </Card.Block>
        <Card.Block className={styles.cardContent}>
          <p className={styles.description}>{section.description}</p>
        </Card.Block>
        <Card.Block className={styles.cardFooter}>
          <span className={styles.linkText}>
            Les mer
            <span aria-hidden="true"> →</span>
          </span>
        </Card.Block>
      </Link>
      <Button> hello world</Button>
    </Card>
  );
}

// Simple icon mapping - can be replaced with proper icon library later
function getIconForType(iconType: string): string {
  const icons: Record<string, string> = {
    information: '📖',
    bulb: '✨',
    rocket: '🚀',
    book: '📚',
    code: '📑',
  };
  return icons[iconType] || '📄';
}
