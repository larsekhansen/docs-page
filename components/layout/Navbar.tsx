import { useState } from 'react';
import Link from 'next/link';
import { Search } from '@digdir/designsystemet-react';
import styles from './Navbar.module.css';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Digdir</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={styles.navLinks}>
          <Link href="/produkter" className={styles.navLink}>
            Produkter
          </Link>
          <Link href="/kom-i-gang" className={styles.navLink}>
            Kom i gang
          </Link>
          <Link href="/om" className={styles.navLink}>
            Om dokumentasjonen
          </Link>
        </div>

        {/* Desktop Search */}
        <div className={styles.searchWrapper}>
          <Search>
            <Search.Input aria-label="Søk i dokumentasjonen" placeholder="Søk i dokumentasjonen..." />
            <Search.Clear />
          </Search>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={styles.menuIcon}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link
            href="/produkter"
            className={styles.mobileNavLink}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Produkter
          </Link>
          <Link
            href="/kom-i-gang"
            className={styles.mobileNavLink}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Kom i gang
          </Link>
          <Link
            href="/om"
            className={styles.mobileNavLink}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Om dokumentasjonen
          </Link>
          <div className={styles.mobileSearch}>
            <Search>
              <Search.Input aria-label="Søk" placeholder="Søk..." />
              <Search.Clear />
            </Search>
          </div>
        </div>
      )}
    </nav>
  );
}
