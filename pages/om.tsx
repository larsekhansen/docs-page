import Head from 'next/head';
import { Heading, Paragraph } from '@digdir/designsystemet-react';
import styles from '@/styles/content-page.module.css';

export default function OmPage() {
  return (
    <>
      <Head>
        <title>Om dokumentasjonen - Digdir Dokumentasjon</title>
        <meta
          name="description"
          content="Lær om hvordan dokumentasjonen er strukturert"
        />
      </Head>
      <main id="main-content" className={styles.container}>
        <a href="#main-content" className="skip-to-main">
          Hopp til hovedinnhold
        </a>

        <div className={styles.content}>
          <Heading size="xlarge" level={1}>
            Om dokumentasjonen
          </Heading>

          <Paragraph size="large" className={styles.intro}>
            Denne dokumentasjonsportalen er bygget med brukeren i fokus, ved hjelp
            av etablerte rammeverk for dokumentasjon.
          </Paragraph>

          <section className={styles.section}>
            <Heading size="large" level={2}>
              Diataxis-rammeverket
            </Heading>
            <Paragraph>
              Vi følger{' '}
              <a
                href="https://diataxis.fr/"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Diataxis
              </a>
              , et systematisk rammeverk for teknisk dokumentasjon. Dette betyr at
              innholdet er organisert i fire kategorier basert på brukerens behov:
            </Paragraph>

            <div className={styles.grid}>
              <div className={styles.card}>
                <Heading size="small" level={3}>
                  📖 Explanation (Forklaring)
                </Heading>
                <Paragraph>
                  Konseptuell informasjon som hjelper deg å forstå hvordan noe
                  fungerer. Eksempler: "Om [Produkt]", "Hva får du?"
                </Paragraph>
              </div>

              <div className={styles.card}>
                <Heading size="small" level={3}>
                  🚀 Tutorial (Opplæring)
                </Heading>
                <Paragraph>
                  Læringsorientert innhold som veileder deg gjennom å lære ved å
                  gjøre. Eksempler: "Kom i gang"-guider
                </Paragraph>
              </div>

              <div className={styles.card}>
                <Heading size="small" level={3}>
                  📚 How-to (Veiledning)
                </Heading>
                <Paragraph>
                  Oppgaveorienterte guider som hjelper deg å løse spesifikke
                  problemer. Eksempler: "Hvordan gjøre X"
                </Paragraph>
              </div>

              <div className={styles.card}>
                <Heading size="small" level={3}>
                  📑 Reference (Referanse)
                </Heading>
                <Paragraph>
                  Teknisk informasjon og fakta. Eksempler: API-dokumentasjon,
                  konfigurasjonsreferanser
                </Paragraph>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <Heading size="large" level={2}>
              Jobs to be Done (JTBD)
            </Heading>
            <Paragraph>
              Dokumentasjonen er strukturert rundt brukerens "jobber" - de
              oppgavene du faktisk trenger å få gjort:
            </Paragraph>
            <ul className={styles.list}>
              <li>
                <strong>"Jeg vil forstå hva dette er"</strong> → Om-seksjonen
              </li>
              <li>
                <strong>"Jeg vil komme i gang raskt"</strong> → Kom i gang-guider
                (fremhevet)
              </li>
              <li>
                <strong>"Jeg vil løse et spesifikt problem"</strong> → Guider og
                how-to
              </li>
              <li>
                <strong>"Jeg trenger teknisk referanse"</strong> → API-dokumentasjon
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <Heading size="large" level={2}>
              Designsystemet
            </Heading>
            <Paragraph>
              Portalen er bygget med{' '}
              <a
                href="https://designsystemet.no"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Designsystemet
              </a>
              , Norges offisielle designsystem fra Digdir. Dette sikrer konsistens,
              tilgjengelighet og god brukeropplevelse.
            </Paragraph>
          </section>

          <section className={styles.section}>
            <Heading size="large" level={2}>
              Tilgjengelighet
            </Heading>
            <Paragraph>
              Vi streber etter å følge WCAG 2.1 AA-standarden for å sikre at
              dokumentasjonen er tilgjengelig for alle brukere, uavhengig av
              funksjonsnedsettelser eller hjelpemidler.
            </Paragraph>
          </section>
        </div>
      </main>
    </>
  );
}
