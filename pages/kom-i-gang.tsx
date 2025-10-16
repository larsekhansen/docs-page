import Head from 'next/head';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import styles from '@/styles/content-page.module.css';

export default function KomIGangPage() {
  return (
    <>
      <Head>
        <title>Kom i gang - Digdir Dokumentasjon</title>
        <meta
          name="description"
          content="Kom i gang med Altinn-produkter og tjenester"
        />
      </Head>
      <main id="main-content" className={styles.container}>
        <a href="#main-content" className="skip-to-main">
          Hopp til hovedinnhold
        </a>

        <div className={styles.content}>
          <Heading data-size="xl" level={1}>
            Kom i gang med Altinn
          </Heading>

          <Paragraph data-size="lg" className={styles.intro}>
            Velkommen til Altinn! Her finner du ressurser for å komme i gang med
            våre produkter og tjenester.
          </Paragraph>

          <section className={styles.section}>
            <Heading data-size="lg" level={2}>
              Ny til Altinn?
            </Heading>
            <Paragraph>
              Altinn er Norges plattform for digital kommunikasjon mellom
              innbyggere, næringsliv og offentlig sektor. Vi tilbyr en rekke
              produkter og tjenester for å forenkle digitale prosesser.
            </Paragraph>
          </section>

          <section className={styles.section}>
            <Heading data-size="lg" level={2}>
              Vanlige bruksscenarier
            </Heading>
            <Paragraph>
              Her er noen av de vanligste måtene å bruke Altinn på:
            </Paragraph>
            <ul className={styles.list}>
              <li>Utvikle digitale tjenester med Altinn Studio</li>
              <li>Implementere tilgangsstyring med Altinn Autorisasjon</li>
              <li>Integrere med Altinn-APIer</li>
              <li>Administrere tilganger og rettigheter</li>
            </ul>
          </section>

          <section className={styles.section}>
            <Heading data-size="lg" level={2}>
              Neste steg
            </Heading>
            <Paragraph>
              Utforsk våre{' '}
              <a href="/produkter" className={styles.link}>
                produkter
              </a>{' '}
              for å finne det som passer dine behov, eller dykk direkte inn i
              dokumentasjonen for et spesifikt produkt.
            </Paragraph>
          </section>
        </div>
      </main>
    </>
  );
}
